import type { Metadata } from "next";
import { Button, EmptyState, PageHead, StatusBadge } from "@/components/ui";
import { PHASES } from "@/lib/trilha";

export const metadata: Metadata = { title: "Portfólio e conquistas" };

export default function Portfolio() {
  return (
    <>
      <PageHead eyebrow="Portfólio de aprendizagem" title="Sua evolução tem evidências." desc="Competências desenvolvidas, entregas e próximos marcos." />
      <div className="grid wide">
        <div className="stack">
          <div className="card">
            <div className="row between mb wrap">
              <h2>Conquistas da jornada</h2>
              <StatusBadge tone="gray">0 insígnias</StatusBadge>
            </div>
            <EmptyState icon="award" title="Nenhuma insígnia ainda" text="Cada fase aprovada rende uma insígnia que aparece aqui." />
          </div>
          <div className="card">
            <h2>Entregas que contam sua história</h2>
            <EmptyState icon="file" title="Nenhuma entrega registrada" text="As missões aprovadas, com nota e versão, formam o seu portfólio." />
          </div>
        </div>
        <aside className="stack">
          <div className="certificate">
            <div className="eyebrow">Próximo marco</div>
            <h2>Certificado de conclusão da jornada</h2>
            <p className="sub">Disponível após concluir as dez fases e apresentar o portfólio final.</p>
            <div className="divider" />
            <p className="tiny muted">Competências, carga horária cumprida e código de verificação.</p>
            <Button variant="light" disabledReason={`0 de ${PHASES.length} fases concluídas`}>{null}</Button>
          </div>
          <div className="notice">O portfólio é privado por padrão. Você escolhe o que deseja compartilhar na versão final.</div>
        </aside>
      </div>
    </>
  );
}
