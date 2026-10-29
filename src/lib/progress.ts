import { phases, levels, rewards } from "@/content/trilha";
import type { Claim, Completion } from "./types";

export function computeProgress(completions: Completion[], claims: Claim[]) {
  const done = new Set(completions.map((c) => c.phaseId));
  const xp = completions.reduce((sum, c) => sum + c.xp, 0);
  const level = [...levels].reverse().find((l) => xp >= l.minXp)!;
  const next = levels.find((l) => l.minXp > xp) ?? null;

  // A fase atual é a primeira não concluída; as seguintes ficam bloqueadas.
  const currentIndex = phases.findIndex((p) => !done.has(p.id));
  const phaseStates = phases.map((p, i) => ({
    ...p,
    state: done.has(p.id) ? ("done" as const) : i === currentIndex ? ("current" as const) : ("locked" as const),
  }));

  const claimed = new Map(claims.map((c) => [c.rewardId, c]));
  const rewardStates = rewards.map((r) => ({
    ...r,
    unlocked: level.level >= r.level,
    claim: claimed.get(r.id) ?? null,
  }));

  return { xp, level, next, phaseStates, rewardStates };
}

// Fase que precisa estar concluída para liberar a bonificação (as fases são feitas em ordem).
// Mantido igual ao mapa em firestore.rules.
export function rewardGatePhase(level: number) {
  const minXp = levels.find((l) => l.level === level)!.minXp;
  let acc = 0;
  return phases.find((p) => (acc += p.xp) >= minXp)?.id ?? null;
}
