import type { Metadata } from "next";
import { Button, EmptyState, ListRow, PageHead } from "@/components/ui";
import { RUBRIC } from "@/lib/trilha";

export const metadata: Metadata = { title: "Avaliar uma entrega" };

export default function Avaliar() {
  return (
    <>
      <PageHead eyebrow="Avaliação de entrega" title="Uma devolutiva para avançar." desc="Entregas dos projetos atribuídos a você." action={<Button href="/mentor" variant="light" icon="back">Voltar</Button>} />
      <div className="grid wide">
        <section className="card">
          <EmptyState icon="file" title="Nenhuma entrega aguardando avaliação" text="As missões enviadas pelos participantes aparecerão aqui com as evidências anexadas." />
        </section>
        <aside className="card">
          <h2>Critérios da rubrica</h2>
          {RUBRIC.map((r) => (
            <ListRow key={r.key} title={r.fullLabel} desc={`${r.max} pontos`} icon={r.icon} />
          ))}
          <div className="divider" />
          <p className="tiny muted">Aprovação: 70/100 e todos os itens obrigatórios.</p>
        </aside>
      </div>
    </>
  );
}
