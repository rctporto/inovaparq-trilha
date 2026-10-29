"use client";

import { useState } from "react";
import { claimReward, useRequireSession } from "@/lib/session";
import { computeProgress } from "@/lib/progress";
import { levels } from "@/content/trilha";
import { LevelBar } from "@/components/LevelBar";
import { Loading } from "@/components/Loading";

export default function RecompensasPage() {
  const s = useRequireSession();
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  if (!s) return <Loading />;
  const { xp, level, next, rewardStates } = computeProgress(s.completions, s.claims);

  async function claim(id: string) {
    setPending(id);
    setError(null);
    try {
      await claimReward(s!.user.uid, id);
    } catch {
      setError("Não foi possível solicitar agora. Tente de novo.");
    }
    setPending(null);
  }

  return (
    <div className="stack">
      <LevelBar xp={xp} level={level} next={next} />
      <h1>Bonificações</h1>
      <p className="muted">Ao resgatar, a equipe do Inovaparq recebe sua solicitação e entra em contato para agendar.</p>
      {error && <p className="error">{error}</p>}
      <div className="grid">
        {rewardStates.map((r) => (
          <div key={r.id} className={`card reward stack ${r.unlocked ? "" : "locked"}`}>
            <span className="tag">Nível {r.level} · {levels.find((l) => l.level === r.level)?.name}</span>
            <h3>{r.unlocked ? "🎁" : "🔒"} {r.title}</h3>
            <p className="muted">{r.description}</p>
            {r.claim ? (
              <span className="tag">Status: {r.claim.status}</span>
            ) : (
              <button className="btn btn-accent" disabled={!r.unlocked || pending === r.id} onClick={() => claim(r.id)}>
                {r.unlocked ? (pending === r.id ? "Enviando…" : "Resgatar") : "Bloqueado"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
