"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { phases } from "@/content/trilha";
import { useRequireSession } from "@/lib/session";
import { computeProgress } from "@/lib/progress";
import { QuizForm } from "@/components/QuizForm";
import { Loading } from "@/components/Loading";

export function FaseView({ id }: { id: string }) {
  const s = useRequireSession();
  const router = useRouter();
  const index = phases.findIndex((p) => p.id === id);
  const phase = phases[index];
  const state = s ? computeProgress(s.completions, s.claims).phaseStates[index].state : null;

  useEffect(() => {
    if (state === "locked") router.replace("/trilha/");
  }, [state, router]);

  if (!s || !state || state === "locked") return <Loading />;

  return (
    <div className="stack">
      <Link href="/trilha/">← Voltar para a trilha</Link>
      <div className="card stack">
        <span className="tag">{phase.block} · Fase {index + 1} · {phase.xp} XP</span>
        <h1>{phase.title}</h1>
        <p className="muted">{phase.summary}</p>
        {phase.lessons.map((l) => (
          <section key={l.title}>
            <h3>{l.title}</h3>
            <p>{l.body}</p>
            {l.items && (
              <ul>
                {l.items.map((it) => <li key={it}>{it}</li>)}
              </ul>
            )}
          </section>
        ))}
        <section className="deliverables">
          <h3>Entregas para a gestão da incubadora</h3>
          <ul>
            {phase.deliverables.map((d) => <li key={d}>{d}</li>)}
          </ul>
        </section>
      </div>
      <div className="card">
        <h2>Desafio da fase</h2>
        {state === "done" && <p className="muted">Você já concluiu esta fase. Pode refazer o desafio para revisar.</p>}
        <QuizForm uid={s.user.uid} phase={phase} alreadyDone={state === "done"} />
      </div>
    </div>
  );
}
