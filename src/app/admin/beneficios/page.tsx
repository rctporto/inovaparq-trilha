import type { Metadata } from "next";
import { DemoAction } from "@/components/DemoAction";
import { DataTable, DemoRibbon, PageHead, StatCard, StatusBadge } from "@/components/ui";

export const metadata: Metadata = { title: "Gestão de benefícios" };

const ROWS = [
  ["Clínica de descoberta", "Fase 2 + 1.000 XP", "A definir", "Rascunho"],
  ["Oficina de mercado", "Fase 3 + 1.500 XP", "A definir", "Rascunho"],
  ["Olhar de especialista", "Fase 4 + 2.000 XP", "A definir", "Rascunho"],
  ["Mentoria de protótipo", "Fase 6 + 3.000 XP", "A definir", "Rascunho"],
  ["Mentoria de gestão", "Fase 8 + 4.000 XP", "A definir", "Rascunho"],
];

export default function Beneficios() {
  return (
    <>
      <DemoRibbon>Catálogo inicial de benefícios. Capacidade e vagas serão definidas pela coordenação.</DemoRibbon>
      <PageHead eyebrow="Benefícios e capacidade" title="Recompensas com entrega planejada." desc="Defina elegibilidade, disponibilidade e responsáveis por cada benefício." action={<DemoAction label="Novo benefício" icon="plus" title="Cadastrar benefício" text="Defina nome, descrição, fase exigida, XP mínimo, período, capacidade, responsável e limite de resgates por participante." />} />
      <div className="grid g4 mb">
        <StatCard label="Benefícios cadastrados" value={ROWS.length} note="Vinculados aos marcos da trilha" icon="gift" />
        <StatCard label="Resgates neste mês" value="0" note="Um resgate por participante e benefício" icon="check" />
        <StatCard label="Horas individuais previstas" value="—" note="Capacidade a definir" icon="clock" />
        <StatCard label="Benefícios com alerta" value="0" note="Vagas próximas do limite" icon="bell" />
      </div>
      <section className="card">
        <DataTable
          rows={ROWS}
          rowKey={(r) => r[0]}
          columns={[
            { header: "Benefício", cell: (r) => <b>{r[0]}</b> },
            { header: "Critério", cell: (r) => r[1] },
            { header: "Capacidade", cell: (r) => r[2] },
            { header: "Status", cell: (r) => <StatusBadge tone="gray">{r[3]}</StatusBadge> },
            { header: "", cell: () => <DemoAction label="Editar" variant="light" small icon="file" title="Editar benefício" text="Alterações em capacidade e regras precisam ser registradas. Reservas confirmadas não podem desaparecer por mudança de configuração." /> },
          ]}
        />
      </section>
      <div className="grid g2 mt">
        <div className="notice">XP representa experiência acumulada. Resgatar um benefício não reduz o XP nem altera a fase do participante.</div>
        <div className="notice rose">O sistema deve reservar a vaga de forma atômica, impedir resgates duplicados e oferecer lista de espera quando aplicável.</div>
      </div>
    </>
  );
}
