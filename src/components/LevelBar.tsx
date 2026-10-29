import type { Level } from "@/content/trilha";

export function LevelBar({ xp, level, next }: { xp: number; level: Level; next: Level | null }) {
  const pct = next ? ((xp - level.minXp) / (next.minXp - level.minXp)) * 100 : 100;
  return (
    <div className="card levelbar">
      <span className="levelbadge">Nível {level.level} · {level.name}</span>
      <div className="xpbar" aria-label={`${Math.round(pct)}% para o próximo nível`}>
        <div style={{ width: `${pct}%` }} />
      </div>
      <span className="muted">
        {xp} XP{next ? ` · faltam ${next.minXp - xp} para ${next.name}` : " · nível máximo"}
      </span>
    </div>
  );
}
