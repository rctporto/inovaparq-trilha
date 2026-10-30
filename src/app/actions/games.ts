"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { gameById, starsFor } from "@/lib/games/catalog";
import { requireArea } from "@/lib/session";

export type SaveResult = { ok: boolean; stars: number; best: number; isRecord: boolean; message?: string };

// Partidas valem como prática: geram estrelas e recordes, nunca XP da trilha principal.
export async function saveGameResult(gameId: string, rawScore: number, durationMs: number): Promise<SaveResult> {
  const user = await requireArea("participante");
  const game = gameById(gameId);
  if (!game) return { ok: false, stars: 0, best: 0, isRecord: false, message: "Jogo desconhecido." };

  const score = Math.max(0, Math.min(game.maxScore, Math.round(Number(rawScore) || 0)));
  const duration = Math.max(0, Math.min(60 * 60 * 1000, Math.round(Number(durationMs) || 0)));
  // Partidas impossíveis de tão rápidas não entram no recorde.
  if (duration < 4000) return { ok: false, stars: 0, best: 0, isRecord: false, message: "Partida muito curta para registrar." };

  const previous = await prisma.gameResult.findFirst({ where: { userId: user.id, gameId }, orderBy: { score: "desc" }, select: { score: true } });
  const stars = starsFor(score, game.maxScore);
  await prisma.gameResult.create({ data: { userId: user.id, gameId, score, maxScore: game.maxScore, stars, durationMs: duration } });
  revalidatePath("/jogos");
  const best = Math.max(previous?.score ?? 0, score);
  return { ok: true, stars, best, isRecord: !previous || score > previous.score };
}
