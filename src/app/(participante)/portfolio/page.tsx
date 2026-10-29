import type { Metadata } from "next";
import { ExportPortfolio } from "@/components/demo/Interactive";
import { Button, DemoRibbon, ListRow, PageHead, StatusBadge } from "@/components/ui";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = { title: "Portfólio e conquistas" };

export default function Portfolio() {
  return (
    <>
      <DemoRibbon />
      <PageHead eyebrow="Portfólio de aprendizagem" title="Sua evolução tem evidências." desc="Competências desenvolvidas, entregas e próximos marcos." action={<ExportPortfolio />} />
      <div className="grid wide">
        <div className="stack">
          <div className="card">
            <div className="row between mb wrap">
              <h2>Conquistas da jornada</h2>
              <StatusBadge tone="green">3 insígnias conquistadas</StatusBadge>
            </div>
            <div className="grid g3">
              {([["Explorador", "flag"], ["Investigador", "search"], ["Estrategista", "chart"]] as const).map(([n, ic]) => (
                <div key={n} style={{ textAlign: "center" }}>
                  <div className="badge" style={{ margin: "10px auto 15px" }}><Icon name={ic} /></div>
                  <h3>{n}</h3>
                  <p className="tiny muted">Competência demonstrada</p>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h2>Entregas que contam sua história</h2>
            <ListRow title="Mapa de oportunidades" desc="Fase 1 · aprovado · versão 1.1" tail={<StatusBadge tone="green">82/100</StatusBadge>} />
            <ListRow title="Investigação do problema" desc="Fase 2 · aprovada · versão 2.0" tail={<StatusBadge tone="green">88/100</StatusBadge>} />
            <ListRow title="Proposta de valor inicial" desc="Fase 3 · aprovada · versão 1.2" tail={<StatusBadge tone="green">85/100</StatusBadge>} />
            <ListRow title="Matriz de alternativas" desc="Fase 4 · em elaboração" tail={<StatusBadge tone="gold">Em andamento</StatusBadge>} />
          </div>
        </div>
        <aside className="stack">
          <div className="certificate">
            <div className="eyebrow">Próximo marco</div>
            <h2>Certificado de conclusão da jornada</h2>
            <p className="sub">Disponível após concluir as dez fases e apresentar o portfólio final.</p>
            <div className="divider" />
            <p className="tiny muted">Competências, carga horária cumprida e código de verificação.</p>
            <Button variant="light" disabledReason="3 de 10 fases concluídas">{null}</Button>
          </div>
          <div className="notice">O portfólio é privado por padrão. Você escolhe o que deseja compartilhar na versão final.</div>
        </aside>
      </div>
    </>
  );
}
