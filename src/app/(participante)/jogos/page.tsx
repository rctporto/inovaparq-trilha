import type { Metadata } from "next";
import Link from "next/link";
import { PageHead, StatCard, StatusBadge } from "@/components/ui";
import { Icon } from "@/components/ui/Icon";
import { GAMES } from "@/lib/games/catalog";
import { gameProgress } from "@/lib/games/progress";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Arena de jogos" };

export default async function Jogos() {
  const user = (await getCurrentUser())!;
  const progress = await gameProgress(user.id);
  const totalStars = Object.values(progress).reduce((a, p) => a + p.stars, 0);
  const plays = Object.values(progress).reduce((a, p) => a + p.plays, 0);
  return (
    <>
      <PageHead eyebrow="Arena de prática" title="Aprenda jogando." desc="Desafios curtos sobre os temas de cada fase. Jogue quantas vezes quiser e bata seus recordes." />
      <div className="grid g4 mb">
        <StatCard label="Estrelas conquistadas" value={`${totalStars} / ${GAMES.length * 3}`} note="Até 3 estrelas por jogo" icon="spark" />
        <StatCard label="Partidas jogadas" value={plays} note="Todas ficam no seu histórico" icon="play" />
        <StatCard label="Jogos concluídos" value={`${Object.keys(progress).length} de ${GAMES.length}`} note="Pelo menos uma partida" icon="check" />
        <StatCard label="Jogos com 3 estrelas" value={Object.values(progress).filter((p) => p.stars === 3).length} note="Domínio do tema" icon="award" />
      </div>
      <div className="grid g3">
        {GAMES.map((g) => {
          const p = progress[g.id];
          return (
            <Link key={g.id} href={`/jogos/${g.id}`} className="card game-card">
              <div className="row between">
                <div className="game-hero-icon small"><Icon name={g.icon} /></div>
                <span className="mini-stars" aria-label={`${p?.stars ?? 0} de 3 estrelas`}>
                  {[1, 2, 3].map((i) => <span key={i} className={i <= (p?.stars ?? 0) ? "on" : ""}><Icon name="spark" /></span>)}
                </span>
              </div>
              <div className="eyebrow mt">Fase {String(g.phase).padStart(2, "0")} · {g.phaseName}</div>
              <h2>{g.title}</h2>
              <p className="sub">{g.pitch}</p>
              <div className="row between mt game-card-foot">
                <StatusBadge tone="gray">{g.mechanic} · {g.minutes} min</StatusBadge>
                <span className="tiny muted">{p ? `Recorde ${p.best}/${g.maxScore}` : "Nunca jogado"}</span>
              </div>
            </Link>
          );
        })}
        <div className="card game-card soon">
          <div className="game-hero-icon small"><Icon name="plus" /></div>
          <h2 className="mt">Mais jogos a caminho</h2>
          <p className="sub">Os mesmos formatos podem receber conteúdo das outras fases: Explorador, Estrategista, Criador, Articulador e Líder.</p>
        </div>
      </div>
      <div className="notice mt">Jogos são prática: rendem estrelas e recordes, mas não somam XP da trilha nem substituem a avaliação e a missão de cada fase.</div>
    </>
  );
}
