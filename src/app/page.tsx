import { redirect } from "next/navigation";
import { googleEnabled } from "@/auth";
import { AuthLanding } from "@/components/auth/AuthLanding";
import { LoginForm } from "@/components/auth/LoginForm";
import { getCurrentUser, landingPath } from "@/lib/session";

const messages: Record<string, string> = {
  bloqueada: "Esta conta não está liberada. Fale com a coordenação do Inovaparq.",
  OAuthAccountNotLinked: "Este e-mail já está vinculado a outro método de acesso.",
  AccessDenied: "Acesso não autorizado.",
  Configuration: "O login está temporariamente indisponível. Tente novamente mais tarde.",
};

export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  if (await getCurrentUser()) redirect(await landingPath());
  const sp = await searchParams;
  const message = sp.sessao === "expirada" ? "Sua sessão terminou. Entre novamente." : messages[sp.erro ?? sp.error ?? ""];
  return (
    <AuthLanding
      title={
        <>
          Seu próximo passo
          <br />
          começa aqui.
        </>
      }
      subtitle="Acesse sua jornada de empreendedorismo e inovação."
    >
      <LoginForm googleEnabled={googleEnabled} message={message} />
    </AuthLanding>
  );
}
