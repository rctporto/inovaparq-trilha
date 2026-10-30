"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { z } from "zod";
import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/db";
import { audit } from "@/lib/audit";
import { bootstrapEmails } from "@/lib/roles";

export type FormState =
  | { error?: string; fieldErrors?: Record<string, string>; ok?: boolean; values?: Record<string, string> }
  | undefined;

// O React limpa o formulário após cada envio; devolvemos os valores (nunca senhas) para preenchê-lo de novo.
const keep = (form: FormData, keys: string[]) => Object.fromEntries(keys.map((k) => [k, String(form.get(k) ?? "")]));

export async function loginWithPassword(_: FormState, form: FormData): Promise<FormState> {
  try {
    await signIn("credentials", {
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
      redirectTo: "/painel",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin" && "code" in error && error.code === "bloqueada")
        return { error: "Esta conta não está liberada. Fale com a coordenação do Inovaparq.", values: keep(form, ["email"]) };
      return { error: "E-mail ou senha incorretos.", values: keep(form, ["email"]) };
    }
    throw error; // inclui o redirecionamento de sucesso
  }
}

export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/painel" });
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}

const signupSchema = z
  .object({
    name: z.string().trim().min(2, "Informe seu nome.").max(120),
    email: z.string().trim().toLowerCase().email("Informe um e-mail válido.").max(200),
    organization: z.string().trim().max(160).optional(),
    requestedRole: z.enum(["PARTICIPANTE", "MENTOR"]),
    note: z.string().trim().max(600).optional(),
    password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres.").max(200),
    confirm: z.string(),
    terms: z.literal("on", { message: "Confirme que leu as orientações de privacidade." }),
  })
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "As senhas não conferem." });

export async function registerAccount(_: FormState, form: FormData): Promise<FormState> {
  const parsed = signupSchema.safeParse(Object.fromEntries(form));
  const values = keep(form, ["name", "email", "organization", "requestedRole", "note"]);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
    return { fieldErrors, values };
  }
  const d = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email: d.email } });
  if (existing) {
    // Mensagem neutra: não revela a situação de contas existentes.
    return { error: "Já existe um cadastro com este e-mail. Tente entrar ou use “Entrar com Google”.", values };
  }
  const isBootstrap = bootstrapEmails().includes(d.email);
  const user = await prisma.user.create({
    data: {
      name: d.name,
      email: d.email,
      organization: d.organization || null,
      signupNote: d.note || null,
      requestedRole: d.requestedRole,
      passwordHash: await bcrypt.hash(d.password, 12),
      ...(isBootstrap ? { role: "DESENVOLVEDOR", status: "ATIVO", reviewedAt: new Date(), statusReason: "Bootstrap" } : {}),
    },
  });
  await audit("conta.criada", { targetId: user.id, details: { via: "email", requestedRole: d.requestedRole, bootstrap: isBootstrap } });

  try {
    await signIn("credentials", { email: d.email, password: d.password, redirectTo: "/painel" });
  } catch (error) {
    if (error instanceof AuthError) return { ok: true };
    throw error;
  }
}
