import type { Metadata } from "next";
import { DemoAction } from "@/components/DemoAction";
import { ReviewForm } from "@/components/demo/Interactive";
import { DemoRibbon, ListRow, PageHead, StatusBadge } from "@/components/ui";

export const metadata: Metadata = { title: "Avaliar uma entrega" };

const preview = "Documento ilustrativo: matriz comparando três alternativas por relevância para o cliente, custo de teste, viabilidade técnica e diferenciação. O anexo definitivo será aberto por URL temporária autorizada.";

export default function Avaliar() {
  return (
    <>
      <DemoRibbon />
      <PageHead eyebrow="Avaliação de entrega" title="Uma devolutiva para avançar." desc="Raiz Circular · missão da fase Criador · versão 1.0" action={<StatusBadge tone="gold">Aguardando avaliação</StatusBadge>} />
      <div className="grid g2">
        <section className="card">
          <h2>Entrega do projeto</h2>
          <p className="tiny muted">Responsável: Ana Costa · equipe com 2 integrantes</p>
          <div className="divider" />
          <h3>Solução selecionada</h3>
          <p className="sub">Sistema de acompanhamento de estoques e alertas de consumo.</p>
          <h3 className="mt">Justificativa</h3>
          <p className="sub">Três alternativas foram comparadas quanto à relevância para o cliente, custo do teste, viabilidade e diferenciação.</p>
          <h3 className="mt">Hipótese em aberto</h3>
          <p className="sub">Frequência de uso e atualização das informações pelos responsáveis pelo estoque.</p>
          <div className="divider" />
          <ListRow title="matriz_alternativas.pdf" desc="Documento ilustrativo · versão 1.0" tail={<DemoAction label="Visualizar" variant="light" small icon="eye" title="Prévia da evidência" text={preview} />} />
          <ListRow title="registros_entrevistas.pdf" desc="Documento ilustrativo · 12 registros" tail={<DemoAction label="Visualizar" variant="light" small icon="eye" title="Prévia da evidência" text={preview} />} />
          <div className="notice mt">Acesso limitado aos projetos atribuídos ao avaliador. O conteúdo é apresentado aqui como exemplo.</div>
        </section>
        <ReviewForm />
      </div>
    </>
  );
}
