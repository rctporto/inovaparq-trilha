"use client";

import { useState } from "react";
import Link from "next/link";
import { PASS_RATIO, type Phase } from "@/content/trilha";
import { completePhase } from "@/lib/session";

type Result = { correct: number; total: number; passed: boolean };

export function QuizForm({ uid, phase, alreadyDone }: { uid: string; phase: Phase; alreadyDone: boolean }) {
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const correct = phase.quiz.filter((q, i) => Number(f.get(`q${i}`)) === q.answer).length;
    const total = phase.quiz.length;
    const passed = correct / total >= PASS_RATIO;
    setError(null);
    if (passed && !alreadyDone) {
      setPending(true);
      try {
        await completePhase(uid, phase.id, correct, phase.xp);
      } catch {
        setPending(false);
        return setError("Não foi possível salvar seu progresso. Verifique a conexão e tente de novo.");
      }
      setPending(false);
    }
    setResult({ correct, total, passed });
  }

  return (
    <form onSubmit={onSubmit} className="quiz" onChange={() => !result?.passed && setResult(null)}>
      {phase.quiz.map((q, i) => (
        <fieldset key={i}>
          <legend>{i + 1}. {q.prompt}</legend>
          {q.options.map((o, j) => (
            <label key={j}>
              <input type="radio" name={`q${i}`} value={j} required disabled={result?.passed} /> {o}
            </label>
          ))}
        </fieldset>
      ))}
      {error && <p className="error">{error}</p>}
      {result && (
        <p style={{ fontWeight: 600, color: result.passed ? "var(--brand-primary-dark)" : "#b42318" }}>
          {result.correct} de {result.total} corretas.{" "}
          {result.passed ? "Fase concluída! 🎉" : "Ainda não foi desta vez, tente de novo."}
        </p>
      )}
      {result?.passed ? (
        <Link className="btn btn-accent" href="/trilha/">Voltar para a trilha</Link>
      ) : (
        <button className="btn" disabled={pending}>{pending ? "Salvando…" : "Enviar respostas"}</button>
      )}
    </form>
  );
}
