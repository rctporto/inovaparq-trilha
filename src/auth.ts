import NextAuth, { CredentialsSignin, type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { bootstrapEmails } from "@/lib/roles";
import { audit } from "@/lib/audit";

declare module "next-auth" {
  interface Session {
    user: { id: string } & DefaultSession["user"];
  }
}

class BlockedAccount extends CredentialsSignin {
  code = "bloqueada";
}

export const googleEnabled = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(200),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // JWT é exigido pelo provedor de credenciais. O token guarda só o id;
  // papel e situação são lidos do banco a cada requisição (src/lib/session.ts).
  session: { strategy: "jwt", maxAge: 60 * 60 * 12 },
  pages: { signIn: "/", error: "/" },
  providers: [
    ...(googleEnabled
      ? [
          Google({
            // O Google verifica o e-mail; permite entrar com Google numa conta criada por e-mail e senha.
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
        if (!user?.passwordHash) return null;
        const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!ok) return null;
        if (user.status === "REJEITADO" || user.status === "INATIVO") throw new BlockedAccount();
        return { id: user.id, name: user.name, email: user.email, image: user.image };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google" || !user.email) return true;
      const existing = await prisma.user.findUnique({ where: { email: user.email.toLowerCase() } });
      if (existing && (existing.status === "REJEITADO" || existing.status === "INATIVO"))
        return "/?erro=bloqueada";
      return true;
    },
    jwt({ token, user }) {
      if (user?.id) token.uid = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.uid) session.user.id = token.uid as string;
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      // Contas criadas pelo Google também nascem pendentes, exceto e-mails de bootstrap.
      if (!user.id || !user.email) return;
      const isBootstrap = bootstrapEmails().includes(user.email.toLowerCase());
      if (isBootstrap) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: "DESENVOLVEDOR", status: "ATIVO", reviewedAt: new Date(), statusReason: "Bootstrap" },
        });
      }
      await audit("conta.criada", { targetId: user.id, details: { via: "google", bootstrap: isBootstrap } });
    },
  },
});
