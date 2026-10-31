"use client";

// Interações de exemplo: a questão da avaliação e os interruptores de configuração.
// Não gravam nada; as regras reais serão calculadas no servidor.

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

const QUIZ = [
  { v: "a", t: "Aumentar a quantidade de funcionalidades antes de investigar o motivo." },
  { v: "b", t: "Revisar a hipótese, compreender as evidências e decidir o próximo experimento." },
  { v: "c", t: "Desconsiderar os resultados porque a ideia parece inovadora." },
  { v: "d", t: "Considerar o projeto validado porque o teste foi realizado." },
];

export function QuizDemo() {
  const [value, setValue] = useState<string>();
  const [result, setResult] = useState<"ok" | "bad" | "none">();
  return (
    <>
      <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className="sr-only">Alternativas</legend>
        {QUIZ.map((o) => (
          <label key={o.v} className="option">
            <input type="radio" name="quiz" value={o.v} checked={value === o.v} onChange={() => setValue(o.v)} />
            {o.t}
          </label>
        ))}
      </fieldset>
      <div aria-live="polite">
        {result === "none" && <div className="notice gold mt">Selecione uma alternativa.</div>}
        {result === "ok" && <div className="notice success mt">Resposta correta. A evidência orienta a revisão da hipótese e o próximo experimento.</div>}
        {result === "bad" && <div className="notice gold mt">Reflita sobre o que os resultados mostram. É preciso revisar a hipótese antes de investir mais na solução.</div>}
      </div>
      <div className="row between mt wrap">
        <span className="tiny muted">Novas tentativas não geram XP duplicado. Na versão final a correção é feita no servidor.</span>
        <button className="btn" onClick={() => setResult(!value ? "none" : value === "b" ? "ok" : "bad")}>
          Verificar resposta
          <Icon name="arrow" />
        </button>
      </div>
    </>
  );
}

export function Switch({ label, defaultOn, disabled }: { label: string; defaultOn: boolean; disabled?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return <button className={`switch ${on ? "" : "off"}`} role="switch" aria-checked={on} aria-label={label} disabled={disabled} onClick={() => setOn((o) => !o)} />;
}
