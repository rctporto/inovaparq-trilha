"use client";

import Link from "next/link";
import { useRef, useState, useTransition, type ReactNode } from "react";
import { saveGameResult, type SaveResult } from "@/app/actions/games";
import { Icon } from "@/components/ui/Icon";
import { starsFor, type GameInfo } from "@/lib/games/catalog";

export type Finish = (score: number, debrief: ReactNode) => void;

/** Moldura comum: tela de abertura, partida e resultado (com estrelas calculadas no servidor). */
export function GameFrame({ game, best, children }: { game: GameInfo; best: number; children: (finish: Finish) => ReactNode }) {
  const [stage, setStage] = useState<"intro" | "play" | "done">("intro");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [debrief, setDebrief] = useState<ReactNode>(null);
  const [saved, setSaved] = useState<SaveResult | null>(null);
  const [saving, start] = useTransition();
  const startedAt = useRef(0);
  const [knownBest, setKnownBest] = useState(best);

  const begin = () => {
    startedAt.current = Date.now();
    setSaved(null);
    setRound((r) => r + 1);
    setStage("play");
  };

  const finish: Finish = (s, d) => {
    setScore(s);
    setDebrief(d);
    setStage("done");
    const duration = Date.now() - startedAt.current;
    start(async () => {
      try {
        const res = await saveGameResult(game.id, s, duration);
        setSaved(res);
        if (res.ok) setKnownBest(res.best);
      } catch {
        setSaved({ ok: false, stars: 0, best: knownBest, isRecord: false, message: "Não foi possível salvar o resultado agora." });
      }
    });
  };

  if (stage === "intro")
    return (
      <div className="grid wide">
        <section className="card game-intro">
          <div className="game-hero">
            <div className="game-hero-icon"><Icon name={game.icon} /></div>
            <div>
              <div className="eyebrow">Fase {String(game.phase).padStart(2, "0")} · {game.phaseName} · {game.mechanic}</div>
              <h2>{game.title}</h2>
              <p className="sub">{game.pitch}</p>
            </div>
          </div>
          <div className="row wrap mt">
            <button className="btn" onClick={begin} autoFocus>
              Começar partida <Icon name="play" />
            </button>
            <span className="tiny muted">Cerca de {game.minutes} min · {knownBest ? `Seu recorde: ${knownBest} de ${game.maxScore}` : "Primeira partida"}</span>
          </div>
        </section>
        <aside className="card">
          <h2>O que você pratica</h2>
          {game.learns.map((l) => (
            <div className="listrow" key={l}>
              <span className="circle"><Icon name="check" /></span>
              <div className="grow"><p style={{ color: "var(--ink)", fontSize: 12 }}>{l}</p></div>
            </div>
          ))}
          <div className="divider" />
          <p className="tiny muted">Jogos são prática livre: rendem estrelas e recordes, mas não somam XP da trilha nem substituem a avaliação da fase.</p>
        </aside>
      </div>
    );

  if (stage === "play") return <div key={round}>{children(finish)}</div>;

  const stars = saved?.ok ? saved.stars : saved ? starsFor(score, game.maxScore) : null;
  return (
    <div className="grid wide">
      <section className="card game-result" aria-live="polite">
        <div className="eyebrow">Fim de partida</div>
        <h2>{score} <span className="muted" style={{ fontSize: 18 }}>/ {game.maxScore} pontos</span></h2>
        <div className="stars" aria-label={stars === null ? "Calculando estrelas" : `${stars} de 3 estrelas`}>
          {[1, 2, 3].map((i) => (
            <span key={i} className={`star ${stars !== null && i <= stars ? "on" : ""}`} style={{ animationDelay: `${i * 160}ms` }}>
              <Icon name="spark" />
            </span>
          ))}
        </div>
        {saving && <p className="tiny muted">Salvando resultado…</p>}
        {saved?.ok && saved.isRecord && <span className="tag green">Novo recorde pessoal!</span>}
        {saved && !saved.ok && <div className="notice gold">{saved.message} Esta partida não entrou no seu recorde.</div>}
        <div className="debrief">{debrief}</div>
        <div className="row wrap mt">
          <button className="btn" onClick={begin}>Jogar de novo <Icon name="arrow" /></button>
          <Link className="btn light" href="/jogos">Outros jogos <Icon name="spark" /></Link>
        </div>
      </section>
      <aside className="card">
        <h2>Leve para o seu projeto</h2>
        {game.learns.map((l) => (
          <div className="listrow" key={l}>
            <span className="circle done"><Icon name="check" /></span>
            <div className="grow"><p style={{ color: "var(--ink)", fontSize: 12 }}>{l}</p></div>
          </div>
        ))}
        <div className="divider" />
        <p className="tiny muted">Recorde: {knownBest} de {game.maxScore}. Estrelas: 35%, 65% e 90% da pontuação.</p>
      </aside>
    </div>
  );
}
