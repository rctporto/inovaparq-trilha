import type { Metadata } from "next";
import Link from "next/link";
import { StatusCard } from "@/components/auth/StatusCard";
import { getCurrentUser } from "@/lib/session";
import { homeFor } from "@/lib/roles";

export const metadata: Metadata = { title: "Acesso negado" };
export const dynamic = "force-dynamic";

export default async function AcessoNegado({ searchParams }: { searchParams: Promise<{ motivo?: string }> }) {
  const { motivo } = await searchParams;
  const user = await getCurrentUser();
  const blocked = user && user.status !== "ATIVO" && user.status !== "PENDENTE";
  return (
    <StatusCard
      icon="shield"
      title={blocked ? "Seu acesso não está liberado." : "Esta área não faz parte do seu perfil."}
      actions={
        user?.status === "ATIVO" ? (
          <Link className="btn" href={homeFor(user.role)}>
            Ir para minha área
          </Link>
        ) : !user ? (
          <Link className="btn" href="/">
            Entrar
          </Link>
        ) : null
      }
    >
      <p className="sub">
        {blocked
          ? user.status === "REJEITADO"
            ? "O cadastro não foi aprovado pela coordenação."
            : "Esta conta foi desativada pela coordenação."
          : motivo === "perfil"
            ? "Seu papel atual não permite abrir esta página. Se precisar desse acesso, fale com a administração."
            : "Você não tem permissão para acessar este conteúdo."}
      </p>
      {blocked && user.statusReason && <div className="notice gold mt">Motivo registrado: {user.statusReason}</div>}
    </StatusCard>
  );
}
