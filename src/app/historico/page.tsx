"use client";

import { useRequireSession } from "@/lib/session";
import { computeProgress } from "@/lib/progress";
import { phases, rewards } from "@/content/trilha";
import { Loading } from "@/components/Loading";

const fmt = (d: Date) => d.toLocaleString("pt-BR");

export default function HistoricoPage() {
  const s = useRequireSession();
  if (!s) return <Loading />;
  const { xp, level } = computeProgress(s.completions, s.claims);

  const events = [
    { at: s.profile.createdAt, text: "Conta criada. Bem-vindo(a) à Trilha de Inovação!" },
    ...s.completions.map((c) => ({
      at: c.completedAt,
      text: `Concluiu "${phases.find((p) => p.id === c.phaseId)?.title}" (+${c.xp} XP, ${c.score} acertos)`,
    })),
    ...s.claims.map((c) => ({
      at: c.claimedAt,
      text: `Solicitou a bonificação "${rewards.find((r) => r.id === c.rewardId)?.title}"`,
    })),
  ].sort((a, b) => b.at.getTime() - a.at.getTime());

  return (
    <div className="stack">
      <h1>Seu histórico</h1>
      <p className="muted">
        {s.completions.length} de {phases.length} fases concluídas · {xp} XP · Nível {level.level} ({level.name})
      </p>
      <div className="card">
        <ul className="timeline">
          {events.map((e, i) => (
            <li key={i}>
              <div>{e.text}</div>
              <small className="muted">{fmt(e.at)}</small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
