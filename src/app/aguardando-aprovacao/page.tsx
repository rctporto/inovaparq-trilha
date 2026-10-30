import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { StatusCard } from "@/components/auth/StatusCard";
import { getCurrentUser, landingPath } from "@/lib/session";

export const metadata: Metadata = { title: "Cadastro em análise" };
export const dynamic = "force-dynamic";

export default async function Aguardando() {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  if (user.status !== "PENDENTE") redirect(await landingPath());
  return (
    <StatusCard
      icon="clock"
      title="Cadastro recebido. Em análise."
      actions={
        <Link className="btn" href="/painel">
          Verificar novamente
        </Link>
      }
    >
      <p className="sub">
        Olá{user.name ? `, ${user.name.split(" ")[0]}` : ""}! Sua conta <b>{user.email}</b> foi criada e aguarda a aprovação de uma pessoa da coordenação do Inovaparq.
      </p>
      <div className="notice mt">Assim que o acesso for liberado, você entra normalmente com o mesmo e-mail. Nenhuma notificação por e-mail é enviada nesta versão.</div>
    </StatusCard>
  );
}
