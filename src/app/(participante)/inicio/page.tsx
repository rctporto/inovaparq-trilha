import type { Metadata } from "next";
import { HeroArt } from "@/components/HeroArt";
import { Button, EmptyState, ListRow, PageHead, ProgressBar, StatCard, StatusBadge } from "@/components/ui";
import { Icon } from "@/components/ui/Icon";
import { getCurrentUser } from "@/lib/session";
import { CURRENT_PHASE, PHASES } from "@/lib/trilha";

export const metadata: Metadata = { title: "Painel do participante" };

function greeting() {
  const h = Number(new Intl.DateTimeFormat("pt-BR", { hour: "numeric", hour12: false, timeZone: "America/Sao_Paulo" }).format(new Date()));
  return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
}

export default async function Inicio() {
  const user = await getCurrentUser();
  const first = user?.name?.split(" ")[0] ?? "";
  const phase = PHASES[CURRENT_PHASE - 1];
  return (
    <>
      <PageHead
        eyebrow="Sua jornada, seu impacto"
        title={`${greeting()}${first ? `, ${first}` : ""}. Vamos começar?`}
        desc={`Você está na fase ${phase.name}. Cada passo da trilha ficará registrado aqui.`}
        action={<Button href="/jornada" variant="light" icon="route">Ver minha jornada</Button>}
      />
      <div className="grid g4 mb">
        <StatCard label="Experiência acumulada" value="0 XP" note="Conclua atividades para somar XP" icon="spark" />
        <StatCard label="Fases concluídas" value={`0 de ${PHASES.length}`} note="Seu ritmo, sua evolução" icon="flag" />
        <StatCard label="Missões aprovadas" value="0" note="Nenhuma missão enviada ainda" icon="check" />
        <StatCard label="Próximo encontro" value="—" note="Nenhum encontro agendado" icon="calendar" />
      </div>
      <div className="grid wide">
        <div className="stack">
          <section className="hero">
            <div className="hero-text">
              <div className="eyebrow">Fase {String(CURRENT_PHASE).padStart(2, "0")} · {phase.name}</div>
              <h2>Toda grande ideia<br />começa com um primeiro passo.</h2>
              <p>{phase.theme}: conheça a fase e prepare-se para as primeiras atividades.</p>
              <Button href={`/fase/${CURRENT_PHASE}`}>Abrir fase</Button>
            </div>
            <HeroArt />
          </section>
          <section className="card">
            <div className="row between mb">
              <h2>Seu próximo movimento</h2>
              <StatusBadge>Para começar</StatusBadge>
            </div>
            <ListRow title={`Conhecer a fase ${phase.name}`} desc="Objetivos e critérios de conclusão" icon="flag" tail={<Button href={`/fase/${CURRENT_PHASE}`} variant="light" small>Abrir</Button>} />
            <ListRow title="Desafio rápido: Fato ou suposição?" desc="Arena de jogos · 2 minutos · vale estrelas" icon="spark" tail={<Button href="/jogos/fato-ou-suposicao" variant="ghost" small icon="play">Jogar</Button>} />
            <ListRow title="Apresentar-se à turma" desc="Comunidade" icon="chat" tail={<Button href="/comunidade" variant="light" small>Abrir</Button>} />
          </section>
        </div>
        <aside className="stack">
          <section className="card">
            <div className="row between">
              <h2>Próxima conquista</h2>
              <Icon name="gift" />
            </div>
            <div className="badge plum"><Icon name="spark" /></div>
            <h3>Clínica de descoberta</h3>
            <p className="sub">Uma conversa coletiva para aprofundar suas entrevistas e aprendizados.</p>
            <div className="row between tiny muted mt mb"><span>0 / 1.000 XP</span><b>0%</b></div>
            <ProgressBar value={0} tone="plum" label="Progresso até a próxima conquista" />
            <p className="tiny muted">Requer fase Investigador aprovada.</p>
            <Button href="/recompensas" variant="ghost" small>Ver recompensas</Button>
          </section>
          <section className="card">
            <div className="eyebrow">Meu projeto</div>
            <EmptyState icon="flag" title="Nenhum projeto cadastrado" text="O cadastro do projeto e da equipe será liberado nas próximas etapas da plataforma." />
          </section>
        </aside>
      </div>
    </>
  );
}
