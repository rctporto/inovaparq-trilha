import type { Metadata } from "next";
import { DemoAction } from "@/components/DemoAction";
import { DataTable, DemoRibbon, PageHead, StatusBadge } from "@/components/ui";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = { title: "Gestão de turmas" };

const CARDS = [
  { n: "Semente · 2026.2", d: "36 participantes", m: "Marina Silva · mentoria", s: "Em andamento", t: "green" as const },
  { n: "Ciência em Ação", d: "28 participantes", m: "Rafael Costa · mentoria", s: "Atenção à avaliação", t: "gold" as const },
  { n: "Próxima turma · 2027.1", d: "Inscrições em preparação", m: "Coordenação a definir", s: "Rascunho", t: "gray" as const },
];
const PROJECTS = [
  ["Raiz Circular", "Ana Costa", "04 · Criador", "1.750", "Hoje"],
  ["Rota Acessível", "Pedro Alves", "02 · Investigador", "750", "Há 2 dias"],
  ["EcoFluxo", "Julia Martins", "05 · Arquiteto", "2.250", "Hoje"],
  ["Solo Vivo", "Lucas Rocha", "03 · Estrategista", "1.100", "Há 4 dias"],
];

export default function Turmas() {
  return (
    <>
      <DemoRibbon />
      <PageHead eyebrow="Turmas e projetos" title="Organize pessoas. Acompanhe avanços." desc="Ciclos de aprendizagem com responsáveis, prazos e capacidade definidos." action={<DemoAction label="Nova turma" icon="plus" title="Criar turma" text="Campos previstos: nome, datas, limite de participantes, trilha e versão, coordenador, mentores e regras de ingresso." />} />
      <div className="grid g3 mb">
        {CARDS.map((c) => (
          <section key={c.n} className="card">
            <div className="row between mb">
              <div className="feature-icon" style={{ margin: 0 }}><Icon name="people" /></div>
              <StatusBadge tone={c.t}>{c.s}</StatusBadge>
            </div>
            <h2>{c.n}</h2>
            <p className="sub">{c.d}</p>
            <p className="tiny muted">{c.m}</p>
            <div className="mt"><DemoAction label="Gerenciar turma" variant="light" small title="Gestão da turma" text="Administradores poderão acompanhar inscrições, projetos, distribuição de avaliações, agenda e necessidades de apoio." /></div>
          </section>
        ))}
      </div>
      <section className="card">
        <div className="row between mb"><h2>Projetos · turma Semente</h2></div>
        <DataTable
          rows={PROJECTS}
          rowKey={(r) => r[0]}
          columns={[
            { header: "Projeto", cell: (r) => <b>{r[0]}</b> },
            { header: "Responsável", cell: (r) => r[1] },
            { header: "Fase atual", cell: (r) => r[2] },
            { header: "XP", cell: (r) => r[3] },
            { header: "Última atividade", cell: (r) => r[4] },
          ]}
        />
      </section>
    </>
  );
}
