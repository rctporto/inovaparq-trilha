"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { Finish } from "./GameFrame";
import { shuffle } from "./shuffle";

type Kind = "fato" | "suposicao";
const CARDS: { text: string; kind: Kind; why: string }[] = [
  { text: "12 de 15 donos de restaurante entrevistados disseram que jogam alimentos fora toda semana.", kind: "fato", why: "É um relato observado, com amostra e contagem." },
  { text: "Todo restaurante vai querer pagar por um app de estoque.", kind: "suposicao", why: "Generalização sem teste de disposição a pagar." },
  { text: "Nossa página de cadastro recebeu 40 inscrições em 7 dias com R$ 200 em anúncios.", kind: "fato", why: "Comportamento real medido, com custo e período." },
  { text: "O mercado de alimentação é enorme, então teremos muitos clientes.", kind: "suposicao", why: "Tamanho de mercado não prova que alguém vai comprar de você." },
  { text: "3 restaurantes usaram o protótipo em papel por 2 semanas; 2 continuaram registrando.", kind: "fato", why: "Uso observado ao longo do tempo é evidência forte." },
  { text: "Meu amigo chef achou a ideia genial.", kind: "suposicao", why: "Opinião de pessoa próxima tende a ser enviesada e não é compra." },
  { text: "Os concorrentes cobram entre R$ 89 e R$ 149 por mês, segundo os próprios sites.", kind: "fato", why: "Dado público e verificável." },
  { text: "Se baixarmos o preço, com certeza vamos vender mais.", kind: "suposicao", why: "Hipótese de elasticidade que precisa de teste." },
  { text: "Em 4 de 5 cozinhas visitadas, o estoque era controlado em caderno.", kind: "fato", why: "Observação direta no contexto do cliente." },
  { text: "Os clientes não se importam com a aparência do aplicativo.", kind: "suposicao", why: "Afirmação sem fonte nem observação." },
  { text: "Na pré-venda, 6 de 20 restaurantes assinaram carta de intenção.", kind: "fato", why: "Compromisso concreto é evidência de interesse." },
  { text: "Vamos ser os primeiros nesse mercado.", kind: "suposicao", why: "Raramente verdadeiro; exige pesquisa de concorrência." },
];
const TIME = 75;

export function FatoOuSuposicao({ onFinish }: { onFinish: Finish }) {
  const deck = useMemo(() => shuffle(CARDS), []);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [time, setTime] = useState(TIME);
  const [feedback, setFeedback] = useState<{ ok: boolean; why: string; gain: number } | null>(null);
  const [misses, setMisses] = useState<typeof CARDS>([]);

  const end = useCallback(
    (finalScore: number, finalMisses: typeof CARDS, answered: number) =>
      onFinish(
        finalScore,
        <>
          <p className="sub">Você classificou {answered} de {deck.length} afirmações e errou {finalMisses.length}.</p>
          {finalMisses.length > 0 && (
            <>
              <h3 className="mt">Para revisar</h3>
              {finalMisses.map((m) => (
                <p key={m.text} className="smalltext"><b>{m.kind === "fato" ? "Fato" : "Suposição"}:</b> “{m.text}” — {m.why}</p>
              ))}
            </>
          )}
          <div className="notice mt">Na entrevista, prefira perguntar o que a pessoa já fez (“quanto jogou fora na semana passada?”) em vez do que ela faria.</div>
        </>,
      ),
    [deck.length, onFinish],
  );

  useEffect(() => {
    if (feedback) return;
    if (time <= 0) return end(score, misses, i);
    const t = setTimeout(() => setTime((x) => x - 1), 1000);
    return () => clearTimeout(t);
  }, [time, feedback, score, misses, i, end]);

  const answer = useCallback(
    (kind: Kind) => {
      if (feedback || time <= 0) return;
      const card = deck[i];
      const ok = card.kind === kind;
      const nextStreak = ok ? streak + 1 : 0;
      const gain = ok ? 10 + (nextStreak >= 3 ? 5 : 0) : 0;
      setStreak(nextStreak);
      setScore((s) => s + gain);
      if (!ok) setMisses((m) => [...m, card]);
      setFeedback({ ok, why: card.why, gain });
    },
    [deck, i, streak, feedback, time],
  );

  const next = useCallback(() => {
    setFeedback(null);
    if (i + 1 >= deck.length) end(score, misses, deck.length);
    else setI(i + 1);
  }, [i, deck.length, end, score, misses]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (feedback && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); next(); }
      if (!feedback && (e.key === "ArrowLeft" || e.key.toLowerCase() === "f")) answer("fato");
      if (!feedback && (e.key === "ArrowRight" || e.key.toLowerCase() === "s")) answer("suposicao");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answer, next, feedback]);

  const card = deck[i];
  return (
    <section className="card game-board">
      <div className="game-hud">
        <span><Icon name="clock" /> <b className={time <= 10 ? "danger-text" : ""}>{time}s</b></span>
        <span>Carta {i + 1}/{deck.length}</span>
        <span className={`combo ${streak >= 3 ? "hot" : ""}`}>Combo ×{streak}</span>
        <span><b>{score}</b> pts</span>
      </div>
      <div className="progress mt"><span style={{ width: `${(time / TIME) * 100}%`, transition: "width 1s linear" }} /></div>
      <div className={`sort-card ${feedback ? (feedback.ok ? "good" : "bad") : ""}`} key={i} aria-live="polite">
        <p>{card.text}</p>
        {feedback && (
          <div className="sort-feedback">
            <b>{feedback.ok ? `Certo! +${feedback.gain}` : `Era ${card.kind === "fato" ? "fato" : "suposição"}.`}</b> {feedback.why}
          </div>
        )}
      </div>
      {!feedback ? (
        <div className="sort-actions">
          <button className="btn teal sort-btn" onClick={() => answer("fato")}>
            <Icon name="back" /> Fato / evidência <kbd>F</kbd>
          </button>
          <button className="btn sort-btn" onClick={() => answer("suposicao")}>
            Suposição <kbd>S</kbd> <Icon name="arrow" />
          </button>
        </div>
      ) : (
        <div className="sort-actions">
          <button className="btn light sort-btn" onClick={next} autoFocus>
            {i + 1 >= deck.length ? "Ver resultado" : "Próxima carta"} <Icon name="arrow" />
          </button>
        </div>
      )}
      <p className="tiny muted" style={{ textAlign: "center" }}>Teclado: ← ou F para fato, → ou S para suposição, Enter para avançar. O relógio pausa durante a explicação.</p>
    </section>
  );
}
