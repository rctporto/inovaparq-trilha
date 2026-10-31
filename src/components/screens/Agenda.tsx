import { EmptyState, ListRow, PageHead } from "@/components/ui";

export function AgendaScreen() {
  return (
    <>
      <PageHead eyebrow="Agenda de encontros" title="Uma conversa. Novas perspectivas." desc="Clínicas coletivas e mentorias da sua turma." />
      <div className="grid wide">
        <section className="card">
          <EmptyState icon="calendar" title="Nenhum encontro agendado" text="Quando a coordenação abrir horários de clínicas e mentorias, eles aparecerão aqui para reserva." />
        </section>
        <aside className="card">
          <h2>Como funciona</h2>
          <ListRow title="Clínicas coletivas" desc="Abertas desde o início da jornada" icon="people" />
          <ListRow title="Mentorias individuais" desc="Liberadas pelos marcos da trilha" icon="gift" />
          <ListRow title="Lembretes" desc="Avisos antes de cada encontro" icon="bell" />
        </aside>
      </div>
    </>
  );
}
