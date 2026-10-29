import type { Metadata } from "next";
import { HeroArt } from "@/components/HeroArt";
import { Avatar, Button, DemoRibbon, ListRow, PageHead, ProgressBar, StatCard, StatusBadge } from "@/components/ui";
import { Icon } from "@/components/ui/Icon";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Painel do participante" };

function greeting() {
  const h = Number(new Intl.DateTimeFormat("pt-BR", { hour: "numeric", hour12: false, timeZone: "America/Sao_Paulo" }).format(new Date()));
  return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
}

export default async function Inicio() {
  const user = await getCurrentUser();
  const first = user?.name?.split(" ")[0] ?? "";
  return (
    <>
      <DemoRibbon />
      <PageHead
        eyebrow="Sua jornada, seu impacto"
        title={`${greeting()}${first ? `, ${first}` : ""}. Vamos criar?`}
        desc="Você está na fase Criador. É hora de transformar aprendizados em possibilidades."
        action={<Button href="/jornada" variant="light" icon="route">Ver minha jornada</Button>}
      />
      <div className="grid g4 mb">
        <StatCard label="Experiência acumulada" value="1.750 XP" note="250 XP até o próximo benefício" icon="spark" />
        <StatCard label="Fases concluídas" value="3 de 10" note="Seu ritmo, sua evolução" icon="flag" />
        <StatCard label="Missões aprovadas" value="3" note="Evidências que fazem a diferença" icon="check" />
        <StatCard label="Próximo encontro" value="05 nov." note="Clínica de inovação · 14h" icon="calendar" />
      </div>
      <div className="grid wide">
        <div className="stack">
          <section className="hero">
            <div className="hero-text">
              <div className="eyebrow">Fase 04 · Criador</div>
              <h2>Dê forma à sua<br />próxima grande ideia.</h2>
              <p>Explore alternativas e escolha a solução com mais potencial para o problema que você investigou.</p>
              <Button href="/fase/4">Continuar fase</Button>
            </div>
            <HeroArt />
          </section>
          <section className="card">
            <div className="row between mb">
              <h2>Seu próximo movimento</h2>
              <StatusBadge>Esta semana</StatusBadge>
            </div>
            <ListRow title="Concluir: seleção de ideias" desc="Aula 3 de 4 · 8 minutos" icon="play" tail={<Button href="/aula" variant="light" small>Retomar</Button>} />
            <ListRow title="Enviar matriz de alternativas" desc="Missão da fase Criador · em elaboração" icon="file" tail={<Button href="/missao" variant="light" small>Abrir missão</Button>} />
            <ListRow title="Compartilhar uma descoberta" desc="Comunidade · turma Semente" icon="chat" tail={<Button href="/comunidade" variant="light" small>Participar</Button>} />
          </section>
        </div>
        <aside className="stack">
          <section className="card">
            <div className="row between">
              <h2>Próxima conquista</h2>
              <Icon name="gift" />
            </div>
            <div className="badge plum"><Icon name="spark" /></div>
            <h3>Encontro com especialista</h3>
            <p className="sub">Um novo olhar para o potencial de inovação do seu projeto.</p>
            <div className="row between tiny muted mt mb"><span>1.750 / 2.000 XP</span><b>88%</b></div>
            <ProgressBar value={87.5} tone="plum" label="Progresso até a próxima conquista" />
            <p className="tiny muted">Requer fase Criador aprovada.</p>
            <Button href="/recompensas" variant="ghost" small>Ver recompensas</Button>
          </section>
          <section className="card">
            <div className="eyebrow">Meu projeto</div>
            <h2>Raiz Circular</h2>
            <p className="sub">Tecnologia para reduzir o desperdício de alimentos.</p>
            <div className="row mt">
              <Avatar initials="AC" />
              <Avatar initials="BL" tone="teal" />
              <span className="tiny muted">Equipe com 2 integrantes</span>
            </div>
            <div className="divider" />
            <Button href="/projeto" variant="light" small>Acompanhar projeto</Button>
          </section>
        </aside>
      </div>
    </>
  );
}
