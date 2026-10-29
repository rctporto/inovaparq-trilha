"use client";

import Link from "next/link";
import { useRequireSession } from "@/lib/session";
import { computeProgress, rewardGatePhase } from "@/lib/progress";
import { phases, rewards } from "@/content/trilha";
import { Board } from "@/components/Board";
import { LevelBar } from "@/components/LevelBar";
import { Loading } from "@/components/Loading";

// Marca no tabuleiro a casa em que cada bonificação é liberada.
const rewardAt = new Set(rewards.map((r) => phases.findIndex((p) => p.id === rewardGatePhase(r.level))));

export default function TrilhaPage() {
  const s = useRequireSession();
  if (!s) return <Loading />;
  const { xp, level, next, phaseStates } = computeProgress(s.completions, s.claims);
  const current = phaseStates.find((p) => p.state === "current");

  return (
    <div className="stack">
      <LevelBar xp={xp} level={level} next={next} />
      {current ? (
        <div className="card" style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <span className="tag">{current.block}</span>
            <h2 style={{ marginTop: 8 }}>Próxima fase: {current.title}</h2>
            <p className="muted" style={{ margin: 0 }}>{current.summary}</p>
          </div>
          <Link className="btn btn-accent" href={`/fase/${current.id}/`}>Continuar</Link>
        </div>
      ) : (
        <div className="card"><h2>Parabéns! Você concluiu a trilha. 🎉</h2></div>
      )}
      <Board nodes={phaseStates} rewardAt={rewardAt} />
    </div>
  );
}
