import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroArt } from "@/components/HeroArt";
import { Button, DemoRibbon, EmptyState, ListRow, PageHead, ProgressBar, StatusBadge } from "@/components/ui";
import { Icon } from "@/components/ui/Icon";
import { CURRENT_PHASE, PHASES } from "@/lib/demo";

export const metadata: Metadata = { title: "Detalhe da fase" };

export default async function Fase({ params }: { params: Promise<{ numero: string }> }) {
  const n = Number((await params).numero);
  if (!Number.isInteger(n) || n < 1 || n > PHASES.length) notFound();
  const phase = PHASES[n - 1];
  const label = `Fase ${String(n).padStart(2, "0")} · ${phase.name}`;
  const back = <Button href="/jornada" variant="light" icon="back">Voltar à jornada</Button>;

  if (phase.state === "locked")
    return (
      <>
        <PageHead eyebrow={label} title={phase.theme} desc="Esta fase será liberada após a conclusão da fase anterior." action={back} />
        <section className="card">
          <EmptyState icon="lock" title="Fase ainda bloqueada" text={`Para desbloquear, conclua a fase ${PHASES[n - 2].name}: avaliação teórica com pelo menos 80%, missão prática com 70/100 e as atividades de reflexão e colaboração.`} action={<Button href={`/fase/${CURRENT_PHASE}`} small>Ir para a fase atual</Button>} />
        </section>
      </>
    );

  if (n !== CURRENT_PHASE)
    return (
      <>
        <DemoRibbon />
        <PageHead eyebrow={label} title={phase.theme} desc="Fase concluída. Você pode revisitar conteúdos e entregas." action={back} />
        <section className="card">
          <EmptyState icon="book" title="Conteúdo em preparação" text="Os treinamentos desta fase serão cadastrados a partir do currículo oficial (CURRICULO_SEED.json) na etapa 3." />
        </section>
      </>
    );

  return (
    <>
      <DemoRibbon />
      <PageHead eyebrow={label} title={phase.theme} desc="Transforme o problema investigado em alternativas de solução." action={back} />
      <div className="grid wide">
        <div className="stack">
          <div className="hero" style={{ minHeight: 180 }}>
            <div className="hero-text">
              <div className="eyebrow">Sua missão nesta fase</div>
              <h2>Explore. Compare. Escolha.</h2>
              <p>Desenvolva três alternativas e selecione uma com critérios de necessidade, viabilidade e diferenciação.</p>
            </div>
            <HeroArt />
          </div>
          <div className="card">
            <div className="row between mb">
              <h2>Treinamentos da fase</h2>
              <StatusBadge tone="plum">2 de 4 concluídos</StatusBadge>
            </div>
            <ListRow title="01 · Criatividade aplicada a problemas" desc="Concluída · 12 min" icon="check" state="done" tail={<StatusBadge tone="green">Concluída</StatusBadge>} />
            <ListRow title="02 · Caminhos para inovar" desc="Concluída · 10 min" icon="check" state="done" tail={<StatusBadge tone="green">Concluída</StatusBadge>} />
            <ListRow title="03 · Como selecionar boas ideias" desc="Em andamento · 8 min" icon="play" tail={<Button href="/aula" small>Continuar</Button>} />
            <ListRow title="04 · Viabilidade, impacto e proteção" desc="Disponível · 12 min" icon="book" tail={<Button href="/aula" variant="light" small>Acessar</Button>} />
          </div>
          <div className="notice">Ao final, você terá um conceito de solução, uma matriz de alternativas e um mapa inicial de riscos.</div>
        </div>
        <aside className="stack">
          <div className="card">
            <h2>Progresso da fase</h2>
            <div className="row between tiny muted mt mb"><span>250 / 500 XP</span><b>50%</b></div>
            <ProgressBar value={50} tone="plum" label="Progresso da fase" />
            <div className="divider" />
            <ListRow title="Conhecimento" desc="Avaliação mínima: 80%" icon="book" />
            <ListRow title="Aplicação" desc="Entrega prática mínima: 70/100" icon="file" />
            <ListRow title="Evidências" desc="Itens obrigatórios completos" icon="check" />
            <div className="row wrap mt">
              <Button href="/missao" small>Abrir missão</Button>
              <Button href="/verificacao" variant="light" small>Fazer avaliação</Button>
            </div>
          </div>
          <div className="card">
            <div className="feature-icon plum"><Icon name="gift" /></div>
            <h3>Ao concluir</h3>
            <p className="sub">Insígnia Criador e acesso ao encontro com especialista, ao atingir 2.000 XP.</p>
          </div>
        </aside>
      </div>
    </>
  );
}
