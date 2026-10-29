import Link from "next/link";

type Node = { id: string; title: string; state: "done" | "current" | "locked" };

const COLS = 3;
const W = 600;
const ROW_H = 160;
const PAD_X = 100;
const R = 36;

// Quebra o nome da fase em linhas curtas para caber embaixo da casa.
function wrap(text: string, max = 20) {
  const lines: string[] = [];
  for (const word of text.split(" ")) {
    const last = lines[lines.length - 1];
    if (last && (last + " " + word).length <= max) lines[lines.length - 1] = last + " " + word;
    else lines.push(word);
  }
  return lines;
}

// Posição em "serpentina": linhas alternam a direção, como um tabuleiro.
function pos(i: number) {
  const row = Math.floor(i / COLS);
  let col = i % COLS;
  if (row % 2 === 1) col = COLS - 1 - col;
  const x = PAD_X + (col * (W - 2 * PAD_X)) / (COLS - 1);
  const y = 70 + row * ROW_H;
  return { x, y };
}

export function Board({ nodes, rewardAt }: { nodes: Node[]; rewardAt: Set<number> }) {
  const rows = Math.ceil(nodes.length / COLS);
  const H = 70 + (rows - 1) * ROW_H + 110;
  const pts = nodes.map((_, i) => pos(i));

  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    if (a.y === b.y) d += ` L ${b.x} ${b.y}`;
    else {
      const bulge = a.x > W / 2 ? 80 : -80;
      d += ` C ${a.x + bulge} ${a.y}, ${b.x + bulge} ${b.y}, ${b.x} ${b.y}`;
    }
  }

  const fill = { done: "var(--brand-success)", current: "var(--brand-accent)", locked: "var(--locked)" };

  return (
    <div className="board card">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Trilha de fases">
        <path d={d} fill="none" stroke="var(--border)" strokeWidth={14} strokeLinecap="round" />
        <path d={d} fill="none" stroke="var(--brand-primary)" strokeWidth={3} strokeDasharray="2 12" strokeLinecap="round" />
        {nodes.map((n, i) => {
          const { x, y } = pts[i];
          const circle = (
            <g>
              {n.state === "current" && (
                <circle cx={x} cy={y} r={R + 8} fill="none" stroke="var(--brand-accent)" strokeWidth={3} opacity={0.5} />
              )}
              <circle cx={x} cy={y} r={R} fill={fill[n.state]} stroke="#fff" strokeWidth={4} />
              <text x={x} y={y + 7} textAnchor="middle" fontSize={22} fontWeight={800} fill="#fff">
                {n.state === "done" ? "✓" : n.state === "locked" ? "🔒" : i + 1}
              </text>
              <text x={x} y={y + R + 24} textAnchor="middle" className="node-label" fontSize={15}>
                {wrap(n.title).map((line, k) => (
                  <tspan key={k} x={x} dy={k === 0 ? 0 : 18}>{line}</tspan>
                ))}
              </text>
              {rewardAt.has(i) && (
                <text x={x + R - 4} y={y - R + 10} fontSize={24} aria-label="Bonificação">🎁</text>
              )}
            </g>
          );
          return n.state === "locked" ? (
            <g key={n.id}>{circle}</g>
          ) : (
            <Link key={n.id} href={`/fase/${n.id}/`}>{circle}</Link>
          );
        })}
      </svg>
    </div>
  );
}
