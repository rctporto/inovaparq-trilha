"use client";

import { gameById, type GameId } from "@/lib/games/catalog";
import { FatoOuSuposicao } from "./FatoOuSuposicao";
import { FolegoDeCaixa } from "./FolegoDeCaixa";
import { GameFrame, type Finish } from "./GameFrame";
import { MemoriaDoCanvas } from "./MemoriaDoCanvas";
import { MesaDeNegociacao } from "./MesaDeNegociacao";
import { MonteOExperimento } from "./MonteOExperimento";

const COMPONENTS: Record<GameId, (p: { onFinish: Finish }) => React.ReactNode> = {
  "fato-ou-suposicao": FatoOuSuposicao,
  "memoria-do-canvas": MemoriaDoCanvas,
  "monte-o-experimento": MonteOExperimento,
  "mesa-de-negociacao": MesaDeNegociacao,
  "folego-de-caixa": FolegoDeCaixa,
};

export function GamePlayer({ id, best }: { id: GameId; best: number }) {
  const game = gameById(id)!;
  const Game = COMPONENTS[id];
  return <GameFrame game={game} best={best}>{(finish) => <Game onFinish={finish} />}</GameFrame>;
}
