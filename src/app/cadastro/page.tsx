import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { googleEnabled } from "@/auth";
import { AuthLanding } from "@/components/auth/AuthLanding";
import { GoogleButton } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { getCurrentUser, landingPath } from "@/lib/session";

export const metadata: Metadata = { title: "Solicitar cadastro" };

export default async function Cadastro() {
  if (await getCurrentUser()) redirect(await landingPath());
  return (
    <AuthLanding title="Solicite seu acesso." subtitle="Seu cadastro fica pendente até a aprovação da coordenação do Inovaparq.">
      <GoogleButton enabled={googleEnabled} label="Cadastrar com Google" />
      <div className="divider-or">ou crie uma conta</div>
      <SignupForm />
    </AuthLanding>
  );
}
