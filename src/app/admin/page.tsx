import type { Metadata } from "next";
import Link from "next/link";
import { Button, EmptyState, ListRow, PageHead, StatCard } from "@/components/ui";
import { prisma } from "@/lib/db";
import { CURRENT_PHASE, PHASES } from "@/lib/trilha";

export const metadata: Metadata = { title: "Painel administrativo" };

export default async function AdminHome() {
  const [pending, active, participants] = await Promise.all([
    prisma.user.count({ where: { status: "PENDENTE" } }),
    prisma.user.count({ where: { status: "ATIVO" } }),
    prisma.user.count({ where: { status: "ATIVO", role: "PARTICIPANTE" } }),
  ]);
  // O progresso ainda não é gravado: todo participante ativo está na fase inicial.
  const dist = PHASES.map((_, i) => (i + 1 === CURRENT_PHASE ? participants : 0));
  const peak = Math.max(1, ...dist);
  return (
    <>
      <PageHead eyebrow="Visão administrativa" title="O impacto da jornada, em perspectiva." desc="Acompanhe aprendizagem, participação e capacidade de atendimento." action={<Button href="/admin/usuarios" variant="light" icon="shield">Pessoas e acessos</Button>} />
      {pending > 0 && (
        <div className="notice rose mb row between wrap">
          <span><b>{pending} cadastro{pending > 1 ? "s" : ""} aguardando aprovação.</b> As pessoas só acessam a plataforma depois da sua decisão.</span>
          <Link className="btn small" href="/admin/usuarios">Revisar cadastros</Link>
        </div>
      )}
      <div className="grid g4 mb">
        <StatCard label="Contas ativas" value={active} note="Todas as áreas" icon="people" />
        <StatCard label="Cadastros pendentes" value={pending} note="Aguardando aprovação" icon="shield" />
        <StatCard label="Entregas avaliadas" value="0" note="Nenhuma missão enviada ainda" icon="clock" />
        <StatCard label="Mentorias realizadas" value="0" note="Nenhum encontro registrado" icon="calendar" />
      </div>
      <div className="grid wide">
        <div className="stack">
          <section className="card">
            <h2>Participantes por fase atual</h2>
            <p className="tiny muted">{participants} participante{participants === 1 ? "" : "s"} ativo{participants === 1 ? "" : "s"}</p>
            <div className="bars" role="img" aria-label={`Participantes por fase: ${dist.map((n, i) => `fase ${i + 1}: ${n}`).join(", ")}`}>
              {dist.map((n, i) => (
                <div className="bar-item" key={i}><small>{n}</small><div className="bar" style={{ height: Math.max(2, (n / peak) * 90) }} /><span>{i + 1}</span></div>
              ))}
            </div>
            <p className="tiny muted" style={{ textAlign: "center", marginBottom: 0 }}>Fases da jornada</p>
          </section>
          <section className="card">
            <h2>Acompanhamento das turmas</h2>
            <EmptyState icon="people" title="Nenhuma turma cadastrada" text="Turmas, entregas pendentes e situação de cada grupo aparecerão aqui." />
          </section>
        </div>
        <aside className="card">
          <h2>Onde atuar agora</h2>
          <ListRow title={`${pending} cadastro${pending === 1 ? "" : "s"} aguardando`} desc="Aprovar ou recusar novos acessos" icon="shield" tail={<Button href="/admin/usuarios" variant="light" small>Ver</Button>} />
          <ListRow title="0 entregas aguardando" desc="Nenhuma missão enviada" icon="file" />
        </aside>
      </div>
    </>
  );
}
