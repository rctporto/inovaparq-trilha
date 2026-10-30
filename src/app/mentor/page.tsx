import type { Metadata } from "next";
import { DemoAction } from "@/components/DemoAction";
import { Button, DataTable, DemoRibbon, PageHead, StatCard, StatusBadge } from "@/components/ui";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Painel do mentor" };

const QUEUE = [
  { p: "Raiz Circular", e: "Matriz de alternativas", f: "Criador", w: "2 dias" },
  { p: "Rota Acessível", e: "Investigação do problema", f: "Investigador", w: "4 dias" },
  { p: "EcoFluxo", e: "Plano de testes", f: "Arquiteto", w: "1 dia" },
];

export default async function MentorHome() {
  const user = await getCurrentUser();
  const first = user?.name?.split(" ")[0];
  return (
    <>
      <DemoRibbon />
      <PageHead eyebrow="Área do mentor" title={`Olá${first ? `, ${first}` : ""}. Seu olhar transforma.`} desc="Acompanhe projetos, devolutivas e próximos encontros." action={<Button href="/mentor/agenda" variant="light" icon="calendar">Abrir agenda</Button>} />
      <div className="grid g4 mb">
        <StatCard label="Entregas pendentes" value="6" note="2 aguardam há mais de 3 dias" icon="file" />
        <StatCard label="Projetos acompanhados" value="12" note="Turma Semente 2026" icon="flag" />
        <StatCard label="Encontros da semana" value="4" note="3 coletivos e 1 individual" icon="calendar" />
        <StatCard label="Devolutivas realizadas" value="28" note="Neste ciclo de aprendizagem" icon="check" />
      </div>
      <div className="grid wide">
        <section className="card">
          <div className="row between mb wrap">
            <h2>Próximas avaliações</h2>
            <StatusBadge>Por ordem de envio</StatusBadge>
          </div>
          <DataTable
            caption="Entregas aguardando avaliação"
            rows={QUEUE}
            rowKey={(r) => r.p}
            columns={[
              { header: "Projeto / entrega", cell: (r) => <><b>{r.p}</b><div className="tiny muted">{r.e}</div></> },
              { header: "Fase", cell: (r) => r.f },
              { header: "Aguardando", cell: (r) => r.w },
              { header: "", cell: () => <Button href="/mentor/avaliar" variant="light" small>Avaliar</Button> },
            ]}
          />
          <div className="notice mt">Avalie o método, as evidências e a qualidade da decisão. Resultados negativos também podem demonstrar competência.</div>
        </section>
        <aside className="stack">
          <section className="card">
            <h2>Próximo encontro</h2>
            <StatusBadge tone="plum">05 nov. · 14:00</StatusBadge>
            <h3 className="mt">Clínica de inovação</h3>
            <p className="sub">8 participantes confirmados · 60 min</p>
            <div className="divider" />
            <h3>Perguntas recebidas</h3>
            <p className="tiny muted">Priorização de alternativas, validação técnica e próximos experimentos.</p>
            <Button href="/mentor/agenda" variant="light" small icon="calendar">Ver agenda</Button>
          </section>
          <section className="card">
            <h2>Disponibilidade</h2>
            <p className="sub">Sua agenda está aberta para os próximos 30 dias.</p>
            <div className="mt">
              <DemoAction label="Configurar horários" variant="light" small icon="clock" title="Disponibilidade de mentoria" text="Na implementação, o mentor definirá janelas de atendimento, duração, capacidade, pausas e exceções. Conflitos e reservas serão verificados pelo servidor." />
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}
