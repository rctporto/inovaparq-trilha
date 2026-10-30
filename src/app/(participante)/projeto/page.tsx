import type { Metadata } from "next";
import { DemoAction } from "@/components/DemoAction";
import { Tabs } from "@/components/demo/Interactive";
import { DemoRibbon, ListRow, PageHead, StatCard, StatusBadge } from "@/components/ui";

export const metadata: Metadata = { title: "Meu projeto" };

const CANVAS = [
  ["Público prioritário", "Pequenos restaurantes com controle manual de estoque."],
  ["Proposta de valor", "Antecipar perdas e facilitar decisões de compra."],
  ["Problema observado", "Baixa visibilidade sobre validade e quantidade dos alimentos."],
  ["Solução em estudo", "Sistema simples de registro e alertas de consumo."],
  ["Canais possíveis", "Associações comerciais e contato direto com estabelecimentos."],
  ["Receita a investigar", "Assinatura mensal. Preço e disposição a pagar ainda não testados."],
];

export default function Projeto() {
  return (
    <>
      <DemoRibbon />
      <PageHead eyebrow="Meu projeto" title="Raiz Circular" desc="Tecnologia para reduzir o desperdício e apoiar decisões sobre estoques." action={<DemoAction label="Editar projeto" variant="light" icon="file" text="Nome, descrição, setor, estágio e equipe serão editáveis conforme as permissões. A versão final preservará o histórico das alterações." />} />
      <div className="grid g4 mb">
        <StatCard label="Estágio" value="Concepção" note="Fase 04 · Criador" icon="flag" />
        <StatCard label="Entrevistas" value="12" note="Registros exploratórios" icon="chat" />
        <StatCard label="Hipóteses abertas" value="3" note="Próximos testes planejados" icon="target" />
        <StatCard label="Equipe" value="2 pessoas" note="Ana Costa e Bruno Lima" icon="people" />
      </div>
      <section className="card">
        <div className="row between mb wrap">
          <span className="tiny muted">Versão 0.3 · em construção</span>
          <StatusBadge tone="gray">Privado · equipe e avaliadores</StatusBadge>
        </div>
        <Tabs
          tabs={[
            {
              id: "canvas",
              label: "Visão do projeto",
              content: (
                <>
                  <h2 className="mb">Hipóteses do modelo de negócio</h2>
                  <div className="canvas-grid">
                    {CANVAS.map(([t, d], i) => (
                      <div key={t} className={`canvas-cell ${i === 1 ? "accent" : ""}`}><h3>{t}</h3><p>{d}</p></div>
                    ))}
                  </div>
                  <div className="notice mt">Este painel reúne hipóteses. Cada atualização deve indicar quais evidências sustentam a mudança.</div>
                </>
              ),
            },
            {
              id: "evidencias",
              label: "Evidências",
              content: (
                <>
                  <h2>Evidências do projeto</h2>
                  <ListRow title="12 entrevistas exploratórias" desc="Fase Investigador · registros anonimizados" />
                  <ListRow title="Matriz competitiva" desc="Fase Estrategista · 6 alternativas analisadas" />
                  <ListRow title="Matriz de alternativas" desc="Fase Criador · em elaboração" />
                </>
              ),
            },
            {
              id: "historico",
              label: "Histórico",
              content: (
                <>
                  <h2>Histórico de evolução</h2>
                  <div className="timeline">
                    <div className="timeline-item"><strong>Versão 0.3 · Proposta revisada</strong>Segmento prioritário delimitado a pequenos restaurantes.</div>
                    <div className="timeline-item"><strong>Versão 0.2 · Entrevistas concluídas</strong>O problema da rotina de registro ganhou relevância.</div>
                    <div className="timeline-item"><strong>Versão 0.1 · Projeto iniciado</strong>Hipótese inicial e mapa de oportunidades.</div>
                  </div>
                </>
              ),
            },
          ]}
        />
      </section>
    </>
  );
}
