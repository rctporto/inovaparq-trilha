import type { Metadata } from "next";
import Link from "next/link";
import { Button, DataTable, DemoRibbon, ListRow, PageHead, StatCard, StatusBadge } from "@/components/ui";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Painel administrativo" };

const COHORTS = [
  { n: "Semente · 2026.2", a: 36, p: 6, ok: true },
  { n: "Conexão · 2026.2", a: 32, p: 4, ok: true },
  { n: "Ciência em Ação", a: 28, p: 8, ok: false },
  { n: "Novos Caminhos", a: 32, p: 3, ok: true },
];
const DIST = [22, 24, 18, 16, 12, 10, 9, 7, 6, 4];

export default async function AdminHome() {
  const [pending, active] = await Promise.all([
    prisma.user.count({ where: { status: "PENDENTE" } }),
    prisma.user.count({ where: { status: "ATIVO" } }),
  ]);
  return (
    <>
      <PageHead eyebrow="Visão administrativa" title="O impacto da jornada, em perspectiva." desc="Acompanhe aprendizagem, participação e capacidade de atendimento." action={<Button href="/admin/turmas" variant="light" icon="people">Gerenciar turmas</Button>} />
      {pending > 0 && (
        <div className="notice rose mb row between wrap">
          <span><b>{pending} cadastro{pending > 1 ? "s" : ""} aguardando aprovação.</b> As pessoas só acessam a plataforma depois da sua decisão.</span>
          <Link className="btn small" href="/admin/usuarios">Revisar cadastros</Link>
        </div>
      )}
      <div className="grid g4 mb">
        <StatCard label="Contas ativas" value={active} note="Dado real · todas as áreas" icon="people" />
        <StatCard label="Cadastros pendentes" value={pending} note="Dado real · aguardando aprovação" icon="shield" />
        <StatCard label="Tempo de avaliação" value="2,4 dias" note="Demonstrativo · mediana 30 dias" icon="clock" />
        <StatCard label="Mentorias realizadas" value="36" note="Demonstrativo · 81% de presença" icon="calendar" />
      </div>
      <DemoRibbon>Os blocos abaixo são demonstrativos. Indicadores de fases, turmas e entregas serão calculados do banco na etapa 7.</DemoRibbon>
      <div className="grid wide">
        <div className="stack">
          <section className="card">
            <div className="row between"><h2>Participantes por fase atual</h2><StatusBadge tone="gray">Dados ilustrativos</StatusBadge></div>
            <p className="tiny muted">Distribuição dos 128 participantes ativos</p>
            <div className="bars" role="img" aria-label={`Participantes por fase: ${DIST.map((n, i) => `fase ${i + 1}: ${n}`).join(", ")}`}>
              {DIST.map((n, i) => (
                <div className="bar-item" key={i}><small>{n}</small><div className="bar" style={{ height: n * 4 }} /><span>{i + 1}</span></div>
              ))}
            </div>
            <p className="tiny muted" style={{ textAlign: "center", marginBottom: 0 }}>Fases da jornada</p>
          </section>
          <section className="card">
            <h2>Acompanhamento das turmas</h2>
            <DataTable
              rows={COHORTS}
              rowKey={(r) => r.n}
              columns={[
                { header: "Turma", cell: (r) => r.n },
                { header: "Ativos", cell: (r) => r.a },
                { header: "Entregas pendentes", cell: (r) => r.p },
                { header: "Situação", cell: (r) => <StatusBadge tone={r.ok ? "green" : "gold"}>{r.ok ? "Em andamento" : "Atenção à avaliação"}</StatusBadge> },
              ]}
            />
          </section>
        </div>
        <aside className="stack">
          <section className="card">
            <h2>Onde atuar agora</h2>
            <ListRow title={`${pending} cadastros aguardando`} desc="Aprovar ou recusar novos acessos" icon="shield" tail={<Button href="/admin/usuarios" variant="light" small>Ver</Button>} />
            <ListRow title="8 entregas aguardando" desc="Turma Ciência em Ação · revisar distribuição" tail={<Button href="/admin/turmas" variant="light" small>Ver</Button>} />
            <ListRow title="2 benefícios com poucas vagas" desc="Planejar capacidade dos próximos encontros" icon="gift" tail={<Button href="/admin/beneficios" variant="light" small>Ver</Button>} />
          </section>
          <section className="card">
            <h2>Aprendizado demonstrado</h2>
            <p className="sub">Acompanhe a qualidade das entregas e a evolução das competências ao longo do ciclo.</p>
            <div className="divider" />
            <div className="row between"><span className="smalltext">Média das entregas aprovadas</span><b>82/100</b></div>
          </section>
        </aside>
      </div>
    </>
  );
}
