"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { Finish } from "./GameFrame";
import { shuffle } from "./shuffle";

const STEPS = [
  { text: "Escolher a hipótese mais arriscada do projeto", why: "Teste primeiro o que, se estiver errado, derruba o negócio." },
  { text: "Definir a métrica e o critério de sucesso", why: "Decidir antes evita “mover a trave” depois de ver o resultado." },
  { text: "Escolher o teste mais barato que gera evidência", why: "Protótipo em papel, landing page ou concierge antes de programar." },
  { text: "Recrutar pessoas do público-alvo", why: "Amigos e família não representam o cliente." },
  { text: "Executar o teste e registrar os dados", why: "Registre tudo, inclusive o que contraria sua expectativa." },
  { text: "Comparar o resultado com o critério definido", why: "A régua é a que você escolheu no passo 2." },
  { text: "Decidir: seguir, ajustar ou mudar de rumo", why: "Todo experimento termina em uma decisão." },
];
const SCORE_BY_TRY = [100, 75, 50];

export function MonteOExperimento({ onFinish }: { onFinish: Finish }) {
  const initial = useMemo(() => {
    let s = shuffle(STEPS.map((_, i) => i));
    while (s.every((v, i) => v === i)) s = shuffle(s);
    return s;
  }, []);
  const [order, setOrder] = useState(initial);
  const [tries, setTries] = useState(0);
  const [checked, setChecked] = useState<boolean[] | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= order.length) return;
    const next = [...order];
    [next[from], next[to]] = [next[to], next[from]];
    setOrder(next);
    setChecked(null);
    setSelected(to);
  };

  const tapSwap = (pos: number) => {
    if (selected === null) return setSelected(pos);
    if (selected === pos) return setSelected(null);
    move(selected, pos);
    setSelected(null);
  };

  const debrief = (score: number) => (
    <>
      <p className="sub">{score === 100 ? "Ordem perfeita na primeira tentativa!" : score > 20 ? `Você acertou em ${tries + 1} tentativas.` : "A ordem correta foi revelada."}</p>
      <ol className="steps-recap">
        {STEPS.map((s) => (
          <li key={s.text}><b>{s.text}.</b> {s.why}</li>
        ))}
      </ol>
    </>
  );

  const check = () => {
    const result = order.map((v, i) => v === i);
    setChecked(result);
    if (result.every(Boolean)) return onFinish(SCORE_BY_TRY[tries], debrief(SCORE_BY_TRY[tries]));
    const t = tries + 1;
    setTries(t);
    if (t >= SCORE_BY_TRY.length) {
      setOrder(STEPS.map((_, i) => i));
      setTimeout(() => onFinish(20, debrief(20)), 1400);
    }
  };

  const correctCount = checked?.filter(Boolean).length ?? 0;
  return (
    <section className="card game-board">
      <div className="game-hud">
        <span>Tentativas restantes <b>{SCORE_BY_TRY.length - tries}</b></span>
        <span>Vale agora <b>{SCORE_BY_TRY[Math.min(tries, 2)]}</b> pts</span>
        {checked && <span><b>{correctCount}</b> de {STEPS.length} no lugar</span>}
      </div>
      <p className="smalltext muted">Use as setas ou toque em duas etapas para trocá-las de lugar. Depois clique em “Conferir ordem”.</p>
      <ol className="sequence" aria-live="polite">
        {order.map((stepIndex, pos) => {
          const state = checked ? (checked[pos] ? "right" : "wrong") : "";
          return (
            <li key={stepIndex} className={`seq-item ${state} ${selected === pos ? "selected" : ""}`}>
              <span className="seq-num">{pos + 1}</span>
              <button className="seq-text" onClick={() => tapSwap(pos)} aria-pressed={selected === pos}>
                {STEPS[stepIndex].text}
              </button>
              {checked && <span className="sr-only">{checked[pos] ? "posição correta" : "posição errada"}</span>}
              <span className="seq-arrows">
                <button className="iconbtn" onClick={() => move(pos, pos - 1)} disabled={pos === 0} aria-label={`Subir “${STEPS[stepIndex].text}”`}>
                  <Icon name="arrow" className="icon up" />
                </button>
                <button className="iconbtn" onClick={() => move(pos, pos + 1)} disabled={pos === order.length - 1} aria-label={`Descer “${STEPS[stepIndex].text}”`}>
                  <Icon name="arrow" className="icon down" />
                </button>
              </span>
            </li>
          );
        })}
      </ol>
      <div className="row between wrap mt">
        <span className="tiny muted">{checked && !checked.every(Boolean) ? "Verde está no lugar certo; ajuste as demais." : ""}</span>
        <button className="btn" onClick={check} disabled={tries >= SCORE_BY_TRY.length}>
          Conferir ordem <Icon name="check" />
        </button>
      </div>
    </section>
  );
}
