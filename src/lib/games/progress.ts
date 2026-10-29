import "server-only";
import { prisma } from "@/lib/db";

/** Melhor pontuação, estrelas e partidas por jogo para a pessoa. */
export async function gameProgress(userId: string) {
  const rows = await prisma.gameResult.groupBy({
    by: ["gameId"],
    where: { userId },
    _max: { score: true, stars: true },
    _count: true,
  });
  return Object.fromEntries(rows.map((r) => [r.gameId, { best: r._max.score ?? 0, stars: r._max.stars ?? 0, plays: r._count }]));
}
