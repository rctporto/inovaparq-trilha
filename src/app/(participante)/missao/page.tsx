import type { Metadata } from "next";
import { Button, EmptyState, ListRow, PageHead } from "@/components/ui";
import { CURRENT_PHASE, RUBRIC } from "@/lib/trilha";

export const metadata: Metadata = { title: "Missão e evidências" };

export default function Missao() {
  return (
    <>
      <PageHead eyebrow="Aplicação prática" title="Missões da fase" desc="Aplique o que aprendeu no seu projeto e registre as evidências." action={<Button href={`/fase/${CURRENT_PHASE}`} variant="light" icon="back">Voltar à fase</Button>} />
      <div className="grid wide">
        <section className="card">
          <EmptyState icon="file" title="Nenhuma missão liberada ainda" text="A missão prática da sua fase aparecerá aqui quando o currículo for publicado. Você ainda não enviou nenhuma entrega." />
        </section>
        <aside className="stack">
          <div className="card">
            <h2>O que será avaliado</h2>
            {RUBRIC.map((r) => (
              <ListRow key={r.key} title={r.fullLabel} desc={`${r.max} pontos`} icon={r.icon} />
            ))}
            <div className="divider" />
            <p className="tiny muted">Aprovação: 70/100 e todos os itens obrigatórios. Você poderá revisar a entrega após o feedback.</p>
          </div>
        </aside>
      </div>
    </>
  );
}
