import type { Metadata } from "next";
import { MissionForm } from "@/components/demo/Interactive";
import { DemoRibbon, ListRow, PageHead, StatusBadge } from "@/components/ui";
import { RUBRIC } from "@/lib/demo";

export const metadata: Metadata = { title: "Missão e evidências" };

export default function Missao() {
  return (
    <>
      <DemoRibbon />
      <PageHead eyebrow="Missão 04 · Aplicação prática" title="Três caminhos. Uma decisão." desc="Compare alternativas para o projeto Raiz Circular." action={<StatusBadge tone="gold">Rascunho</StatusBadge>} />
      <div className="grid wide">
        <section className="card">
          <div className="row between mb">
            <h2>Seu raciocínio, suas evidências</h2>
            <StatusBadge>Até 250 XP</StatusBadge>
          </div>
          <MissionForm />
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
          <div className="notice">Uma hipótese descartada pode demonstrar um excelente aprendizado. Explique o que os resultados mudaram na sua decisão.</div>
        </aside>
      </div>
    </>
  );
}
