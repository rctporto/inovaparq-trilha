"use client";

import { BookingDemo } from "@/components/demo/Interactive";
import { Avatar, DemoRibbon, ListRow, PageHead, StatusBadge } from "@/components/ui";

export function AgendaScreen() {
  return (
    <>
      <DemoRibbon />
      <PageHead eyebrow="Agenda de encontros" title="Uma conversa. Novas perspectivas." desc="Reserve um horário e organize as perguntas do seu projeto." action={<StatusBadge tone="green">Clínica coletiva</StatusBadge>} />
      <BookingDemo
        aside={(summary, confirm) => (
          <aside className="stack">
            <div className="card">
              <div className="row mb">
                <Avatar initials="MS" tone="teal" />
                <div><h2>Marina Silva</h2><span className="tiny muted">Inovação e descoberta</span></div>
              </div>
              <div className="divider" />
              <h3>Clínica de inovação</h3>
              <p className="sub">Discussão de projetos, perguntas e próximos experimentos.</p>
              <ListRow title="Data selecionada" desc={summary} icon="calendar" />
              <ListRow title="Modalidade" desc="Encontro online em grupo" icon="people" />
              <ListRow title="Disponibilidade ilustrativa" desc="4 de 12 vagas livres" icon="check" />
              <div className="mt">{confirm}</div>
            </div>
            <div className="notice">A confirmação é demonstrativa nesta etapa. Nenhum evento ou convite real será enviado.</div>
          </aside>
        )}
      />
    </>
  );
}
