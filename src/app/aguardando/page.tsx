"use client";

import { logout, useGate } from "@/lib/session";
import { displayName } from "@/lib/types";
import { Welcome } from "@/components/Welcome";

export default function AguardandoPage() {
  const s = useGate("/aguardando/");
  if (!s?.profile) return null;
  const refused = s.profile.status === "recusado";

  return (
    <Welcome>
      <div className="card stack" style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40 }} aria-hidden>{refused ? "📭" : "⏳"}</div>
        <h2>{refused ? "Solicitação não aprovada" : "Cadastro em análise"}</h2>
        <p className="muted">
          {refused
            ? "Sua solicitação de acesso não foi aprovada. Em caso de dúvida, fale com a equipe do Inovaparq pelo inovaparq@inovaparq.com.br."
            : `Recebemos a solicitação de ${displayName(s.profile)}. A equipe do Inovaparq vai analisar e liberar seu acesso à Trilha de Inovação. Esta página atualiza sozinha quando o acesso for liberado.`}
        </p>
        <button type="button" className="btn btn-ghost" onClick={() => logout()}>Sair</button>
      </div>
    </Welcome>
  );
}
