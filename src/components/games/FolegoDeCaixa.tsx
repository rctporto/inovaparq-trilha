"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { Finish } from "./GameFrame";

type S = { caixa: number; custo: number; clientes: number; preco: number; moral: number };
type Effect = Partial<Record<keyof S, number>> & { precoFixo?: number };
type Choice = { label: string; effect: Effect; lesson: string };
type Month = { title: string; text: string; choices: Choice[] };

const START: S = { caixa: 60000, custo: 12000, clientes: 8, preco: 300, moral: 70 };
const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

const MONTHS: Month[] = [
  {
    title: "Proposta de investimento",
    text: "Um investidor-anjo oferece R$ 40 mil por 20% da empresa, para assinar hoje.",
    choices: [
      { label: "Aceitar na hora", effect: { caixa: 40000, moral: 5 }, lesson: "Dinheiro rápido, mas 20% tão cedo é uma diluição alta." },
      { label: "Mostrar as métricas e negociar", effect: { caixa: 25000, moral: 5 }, lesson: "Ele topou R$ 25 mil por 10%: menos caixa, muito menos diluição." },
      { label: "Recusar e seguir enxuto", effect: {}, lesson: "Mantém a participação, mas o fôlego fica curto." },
    ],
  },
  {
    title: "Pedido sob medida",
    text: "Um cliente grande paga R$ 15 mil por uma função exclusiva que ocupa a equipe por 2 meses.",
    choices: [
      { label: "Aceitar o projeto", effect: { caixa: 15000, clientes: 1, moral: -15 }, lesson: "Receita pontual que trava o produto para os demais clientes." },
      { label: "Recusar e focar no produto", effect: { clientes: 4, moral: 5 }, lesson: "Foco no que serve a muitos clientes acelera a receita recorrente." },
      { label: "Oferecer uma versão simples em 2 semanas por R$ 6 mil", effect: { caixa: 6000, clientes: 3 }, lesson: "Bom meio-termo: atende o cliente sem desviar o rumo." },
    ],
  },
  {
    title: "Conta de servidor triplicou",
    text: "O uso ineficiente do banco de dados fez a infraestrutura disparar.",
    choices: [
      { label: "Pagar e seguir em frente", effect: { custo: 2000 }, lesson: "Custo fixo que cresce sem gerar valor encurta o fôlego todo mês." },
      { label: "Parar uma semana para otimizar", effect: { custo: 300, clientes: 1 }, lesson: "Pequenas correções técnicas podem valer meses de caixa." },
      { label: "Fechar plano anual com desconto (R$ 9 mil à vista)", effect: { caixa: -9000 }, lesson: "Reduz custo mensal, mas consome caixa agora." },
    ],
  },
  {
    title: "Como vender mais?",
    text: "As vendas dependem só dos fundadores. É hora de escalar.",
    choices: [
      { label: "Contratar vendedor (R$ 6 mil/mês)", effect: { custo: 6000, clientes: 8 }, lesson: "Cresce mais rápido, mas o custo fixo sobe junto." },
      { label: "Fundadores vendem 2 dias por semana", effect: { clientes: 5, moral: -5 }, lesson: "Barato e ensina muito sobre o cliente, mas cansa." },
      { label: "Parceria com distribuidor (comissão)", effect: { clientes: 6, custo: 1200 }, lesson: "Canal de terceiros: custo variável e alcance maior." },
    ],
  },
  {
    title: "Equipe no limite",
    text: "Depois de meses intensos, a equipe está esgotada e erros começam a aparecer.",
    choices: [
      { label: "Ignorar e acelerar", effect: { clientes: 3, moral: -25 }, lesson: "Ganho de curto prazo com risco alto de perder gente-chave." },
      { label: "Semana de folga e retrospectiva", effect: { moral: 20 }, lesson: "Pausas planejadas protegem a capacidade de execução." },
      { label: "Bônus em dinheiro", effect: { caixa: -6000, moral: 10 }, lesson: "Ajuda, mas dinheiro não resolve sobrecarga." },
    ],
  },
  {
    title: "Guerra de preços",
    text: "Um concorrente cortou o preço pela metade.",
    choices: [
      { label: "Igualar o preço (R$ 150)", effect: { clientes: 6, precoFixo: 150 }, lesson: "Mais clientes, mas receita por cliente cai pela metade." },
      { label: "Manter o preço e mostrar resultados de clientes", effect: { clientes: 3, moral: 5 }, lesson: "Provar valor com casos reais sustenta o preço." },
      { label: "Criar plano básico e manter o completo", effect: { clientes: 5, precoFixo: 260 }, lesson: "Segmentar planos protege a margem e amplia o alcance." },
    ],
  },
];

function apply(s: S, e: Effect): S {
  return {
    caixa: s.caixa + (e.caixa ?? 0),
    custo: s.custo + (e.custo ?? 0),
    clientes: Math.max(0, s.clientes + (e.clientes ?? 0)),
    preco: e.precoFixo ?? s.preco,
    moral: Math.max(0, Math.min(100, s.moral + (e.moral ?? 0))),
  };
}

export function FolegoDeCaixa({ onFinish }: { onFinish: Finish }) {
  const [s, setS] = useState<S>(START);
  const [m, setM] = useState(0);
  const [result, setResult] = useState<{ choice: Choice; before: S; after: S; churn: number } | null>(null);
  const [history, setHistory] = useState<{ month: number; caixa: number; lesson: string }[]>([]);

  const receita = s.clientes * s.preco;
  const burn = s.custo - receita;
  const runway = burn > 0 ? s.caixa / burn : Infinity;

  const choose = (c: Choice) => {
    const before = s;
    let after = apply(s, c.effect);
    const churn = after.moral < 30 ? 2 : 0; // equipe esgotada perde clientes
    after = { ...after, clientes: Math.max(0, after.clientes - churn) };
    after = { ...after, caixa: after.caixa + after.clientes * after.preco - after.custo };
    setS(after);
    setResult({ choice: c, before, after, churn });
    setHistory((h) => [...h, { month: m + 1, caixa: after.caixa, lesson: c.lesson }]);
  };

  const advance = () => {
    if (!result) return;
    const broke = result.after.caixa < 0;
    if (broke || m + 1 >= MONTHS.length) {
      const f = result.after;
      const survived = !broke;
      const score = Math.min(100, (survived ? 40 : 0) + Math.min(35, Math.round((f.clientes * 35) / 30)) + Math.round(f.moral * 0.25));
      const finalBurn = f.custo - f.clientes * f.preco;
      onFinish(
        score,
        <>
          <p className="sub">{survived ? `A startup chegou ao sexto mês com ${brl(f.caixa)} em caixa.` : `O caixa acabou no mês ${m + 1}. Isso acontece com muitas startups: o importante é entender por quê.`}</p>
          <div className="grid g4 mt">
            <div className="metric-mini"><span className="tiny muted">Caixa</span><strong>{brl(f.caixa)}</strong></div>
            <div className="metric-mini"><span className="tiny muted">Clientes</span><strong>{f.clientes}</strong></div>
            <div className="metric-mini"><span className="tiny muted">Energia da equipe</span><strong>{f.moral}</strong></div>
            <div className="metric-mini"><span className="tiny muted">Resultado mensal</span><strong>{brl(-finalBurn)}</strong></div>
          </div>
          <h3 className="mt">Linha do tempo</h3>
          {[...history].map((h) => (
            <p key={h.month} className="smalltext"><b>Mês {h.month}</b> · caixa {brl(h.caixa)} — {h.lesson}</p>
          ))}
          <div className="notice mt">Fôlego (runway) = caixa ÷ queima mensal. Queima = custos fixos − receita recorrente. Acompanhe esse número todo mês.</div>
        </>,
      );
      return;
    }
    setM(m + 1);
    setResult(null);
  };

  const month = MONTHS[m];
  const runwayLabel = runway === Infinity ? "Lucrativa" : `${runway.toFixed(1).replace(".", ",")} meses`;
  return (
    <section className="card game-board">
      <div className="sim-stats">
        <div><span>Caixa</span><b className={s.caixa < 15000 ? "danger-text" : ""}>{brl(s.caixa)}</b></div>
        <div><span>Clientes</span><b>{s.clientes} × {brl(s.preco)}</b></div>
        <div><span>Custo fixo/mês</span><b>{brl(s.custo)}</b></div>
        <div><span>Fôlego</span><b className={runway < 3 ? "danger-text" : ""}>{runwayLabel}</b></div>
        <div><span>Energia da equipe</span><span className="meter-bar wide"><span style={{ width: `${s.moral}%`, background: s.moral < 30 ? "#a3323b" : undefined }} /></span></div>
      </div>
      <div className="months" aria-hidden="true">
        {MONTHS.map((_, i) => <span key={i} className={i < m || (i === m && result) ? "done" : i === m ? "now" : ""} />)}
      </div>
      {!result ? (
        <div className="event" key={m}>
          <div className="eyebrow">Mês {m + 1} de {MONTHS.length}</div>
          <h2>{month.title}</h2>
          <p className="sub">{month.text}</p>
          <div className="choices">
            {month.choices.map((c) => (
              <button key={c.label} className="option choice" onClick={() => choose(c)}>
                <Icon name="arrow" /> <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="event" aria-live="polite">
          <div className="eyebrow">Fechamento do mês {m + 1}</div>
          <h2>{result.choice.label}</h2>
          <p className="sub">{result.choice.lesson}</p>
          {result.churn > 0 && <div className="notice gold mt">A equipe esgotada cometeu erros e {result.churn} clientes cancelaram.</div>}
          <div className="grid g3 mt">
            <div className="metric-mini"><span className="tiny muted">Receita do mês</span><strong>{brl(result.after.clientes * result.after.preco)}</strong></div>
            <div className="metric-mini"><span className="tiny muted">Custos do mês</span><strong>{brl(result.after.custo)}</strong></div>
            <div className="metric-mini"><span className="tiny muted">Variação do caixa</span><strong className={result.after.caixa - result.before.caixa < 0 ? "danger-text" : ""}>{brl(result.after.caixa - result.before.caixa)}</strong></div>
          </div>
          <div className="row mt">
            <button className="btn" onClick={advance} autoFocus>
              {result.after.caixa < 0 ? "Ver o que aconteceu" : m + 1 >= MONTHS.length ? "Ver resultado" : "Próximo mês"} <Icon name="arrow" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
