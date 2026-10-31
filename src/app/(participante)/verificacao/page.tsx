import type { Metadata } from "next";
import { QuizDemo } from "@/components/demo/Interactive";
import { Button, PageHead, StatusBadge } from "@/components/ui";
import { Icon } from "@/components/ui/Icon";
import { CURRENT_PHASE } from "@/lib/trilha";

export const metadata: Metadata = { title: "Avaliação de conhecimentos" };

export default function Verificacao() {
  return (
    <>
      <PageHead eyebrow="Verificação de aprendizagem" title="O que orienta uma boa decisão?" desc="Avaliação de conhecimentos · questão de exemplo" action={<Button href={`/fase/${CURRENT_PHASE}`} variant="light" icon="back">Voltar à fase</Button>} />
      <div className="grid wide">
        <section className="card">
          <div className="row between mb wrap">
            <StatusBadge tone="plum">Questão de exemplo</StatusBadge>
            <span className="tiny muted">Meta da avaliação completa: 80%</span>
          </div>
          <h2 style={{ fontSize: 22, lineHeight: 1.4, margin: "25px 0" }}>Um teste mostrou que os clientes não têm interesse na solução proposta. Qual é o próximo passo mais adequado?</h2>
          <QuizDemo />
        </section>
        <aside className="stack">
          <div className="card">
            <div className="feature-icon"><Icon name="book" /></div>
            <h2>Aprender faz parte</h2>
            <p className="sub">Você pode consultar os materiais e tentar novamente. O feedback explica o raciocínio por trás da resposta.</p>
            <div className="divider" />
            <h3>Conhecimento + aplicação</h3>
            <p className="sub">A avaliação teórica é uma parte da fase. A missão prática precisa ser aprovada separadamente.</p>
          </div>
          <div className="notice">Esta tela demonstra uma questão. A versão final usará um banco de questões por competência, com correção no servidor.</div>
        </aside>
      </div>
    </>
  );
}
