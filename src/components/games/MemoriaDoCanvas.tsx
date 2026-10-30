"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { Finish } from "./GameFrame";
import { shuffle } from "./shuffle";

const PAIRS = [
  { block: "Segmentos de clientes", example: "Pequenos restaurantes com estoque controlado à mão", tip: "Para quem você cria valor." },
  { block: "Proposta de valor", example: "Reduzir o desperdício em 30% sem planilhas", tip: "O ganho que o cliente percebe." },
  { block: "Canais", example: "Associação comercial e visitas às cozinhas", tip: "Como você alcança e entrega ao cliente." },
  { block: "Relacionamento", example: "Suporte por WhatsApp na implantação", tip: "Como você conquista e mantém o cliente." },
  { block: "Fontes de receita", example: "Assinatura mensal de R$ 99 por unidade", tip: "Como o valor vira dinheiro." },
  { block: "Recursos-chave", example: "Base de dados de validade dos insumos", tip: "O que é indispensável para entregar a proposta." },
  { block: "Parcerias-chave", example: "Distribuidores de alimentos da região", tip: "Quem ajuda a reduzir riscos ou custos." },
  { block: "Estrutura de custos", example: "Servidores e equipe de suporte", tip: "Os principais gastos para operar." },
];
const MIN_MOVES = PAIRS.length;

type Tile = { id: string; pair: number; side: "block" | "example"; text: string };

export function MemoriaDoCanvas({ onFinish }: { onFinish: Finish }) {
  const tiles = useMemo<Tile[]>(
    () => shuffle(PAIRS.flatMap((p, i) => [{ id: `b${i}`, pair: i, side: "block" as const, text: p.block }, { id: `e${i}`, pair: i, side: "example" as const, text: p.example }])),
    [],
  );
  const [open, setOpen] = useState<string[]>([]);
  const [found, setFound] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [last, setLast] = useState<{ ok: boolean; pair?: number } | null>(null);

  const scoreFor = (m: number) => Math.max(20, 100 - 5 * (m - MIN_MOVES));

  useEffect(() => {
    if (open.length !== 2) return;
    const [a, b] = open.map((id) => tiles.find((t) => t.id === id)!);
    const ok = a.pair === b.pair;
    const t = setTimeout(
      () => {
        if (ok) setFound((f) => [...f, a.pair]);
        setLast({ ok, pair: ok ? a.pair : undefined });
        setOpen([]);
      },
      ok ? 350 : 1100,
    );
    return () => clearTimeout(t);
  }, [open, tiles]);

  useEffect(() => {
    if (found.length !== PAIRS.length) return;
    const t = setTimeout(
      () =>
        onFinish(
          scoreFor(moves),
          <>
            <p className="sub">Você encontrou os {PAIRS.length} pares em {moves} jogadas (o mínimo possível é {MIN_MOVES}).</p>
            <div className="canvas-grid mt">
              {PAIRS.map((p) => (
                <div className="canvas-cell" key={p.block}><h3>{p.block}</h3><p>{p.tip}</p></div>
              ))}
            </div>
            <div className="notice mt">Faltou um bloco? “Atividades-chave” completa os nove: o que a equipe precisa fazer bem todos os dias.</div>
          </>,
        ),
      700,
    );
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [found.length]);

  const flip = (t: Tile) => {
    if (open.length >= 2 || open.includes(t.id) || found.includes(t.pair)) return;
    const next = [...open, t.id];
    setOpen(next);
    if (next.length === 2) setMoves((m) => m + 1);
  };

  return (
    <section className="card game-board">
      <div className="game-hud">
        <span>Pares <b>{found.length}/{PAIRS.length}</b></span>
        <span>Jogadas <b>{moves}</b></span>
        <span>Pontuação atual <b>{scoreFor(Math.max(moves, MIN_MOVES))}</b></span>
      </div>
      <p className="smalltext muted" aria-live="polite" style={{ minHeight: 40 }}>
        {last?.ok && last.pair !== undefined ? <><b style={{ color: "var(--green)" }}>Par certo: {PAIRS[last.pair].block}.</b> {PAIRS[last.pair].tip}</> : last ? "Não formam par. Memorize e tente de novo." : "Vire duas cartas: um bloco do Canvas (magenta) e um exemplo (azul)."}
      </p>
      <div className="memory-grid">
        {tiles.map((t) => {
          const isOpen = open.includes(t.id) || found.includes(t.pair);
          return (
            <button
              key={t.id}
              className={`memory-tile ${isOpen ? "open" : ""} ${found.includes(t.pair) ? "found" : ""} ${t.side}`}
              onClick={() => flip(t)}
              aria-label={isOpen ? t.text : "Carta virada para baixo"}
              aria-pressed={isOpen}
            >
              <span className="memory-inner">
                <span className="memory-back"><Icon name="spark" /></span>
                <span className="memory-front">
                  <small>{t.side === "block" ? "Bloco" : "Exemplo"}</small>
                  {t.text}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
