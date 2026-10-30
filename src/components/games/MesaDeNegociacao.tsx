"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui";
import { Icon } from "@/components/ui/Icon";
import type { Finish } from "./GameFrame";

type State = { price: number; trust: number; knowsPain: boolean; pilot: boolean; annual: boolean };
type Choice = { label: string; apply: (s: State) => Partial<State>; reply: (s: State) => string; lesson: string; good: boolean };
type Round = { buyer: string; choices: Choice[] };

const LIST = 3600; // 12 unidades x R$ 300
const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

const ROUNDS: Round[] = [
  {
    buyer: "Gostei da demonstração. Quanto custa para as nossas 12 unidades?",
    choices: [
      { label: "R$ 300 por unidade: R$ 3.600 por mês.", apply: () => ({}), reply: () => "Hum… está acima do que eu imaginava.", lesson: "Preço sem contexto vira só custo na cabeça do cliente.", good: false },
      { label: "Antes do preço: quanto vocês perdem hoje com desperdício em cada unidade?", apply: (s) => ({ trust: s.trust + 15, knowsPain: true }), reply: () => "Uns R$ 2 mil por mês por unidade, talvez mais. Ninguém mede direito.", lesson: "Entender a dor permite ancorar o preço no valor.", good: true },
      { label: "Para vocês, faço R$ 150 por unidade.", apply: (s) => ({ price: LIST / 2, trust: s.trust - 5 }), reply: () => "Ótimo… mas por que tão barato? Tem algo errado?", lesson: "Desconto antes de pedirem reduz valor e gera desconfiança.", good: false },
    ],
  },
  {
    buyer: "Nosso orçamento está apertado. Você consegue 40% de desconto?",
    choices: [
      { label: "Tudo bem, fechamos com 40% de desconto.", apply: (s) => ({ price: s.price * 0.6 }), reply: () => "Perfeito! E será que dá para incluir treinamento presencial também?", lesson: "Concessão sem contrapartida convida a novos pedidos.", good: false },
      {
        label: "Consigo 15% se o contrato for anual e começarmos pelas 12 unidades.",
        apply: (s) => ({ price: s.price * 0.85, trust: s.trust + (s.knowsPain ? 20 : 10), annual: true }),
        reply: (s) => (s.knowsPain ? "Se perdemos R$ 24 mil por mês, isso se paga rápido. Faz sentido." : "Anual… pode ser. Vou pensar."),
        lesson: "Troque concessões por contrapartidas: prazo, volume ou indicação.",
        good: true,
      },
      { label: "Não damos desconto.", apply: (s) => ({ trust: s.trust - 15 }), reply: () => "Entendo. Então fica difícil para nós.", lesson: "Rigidez total encerra a conversa em vez de criar opções.", good: false },
    ],
  },
  {
    buyer: "E se não funcionar nas nossas cozinhas? Já tivemos sistemas que ninguém usou.",
    choices: [
      { label: "Vai funcionar, pode confiar.", apply: (s) => ({ trust: s.trust - 10 }), reply: () => "Todo fornecedor diz isso.", lesson: "Promessa sem prova não reduz o risco percebido.", good: false },
      { label: "Proponho um piloto de 30 dias em 2 unidades, com meta de reduzir 20% do desperdício. Batida a meta, ampliamos.", apply: (s) => ({ trust: s.trust + 20, pilot: true }), reply: () => "Assim fica mais fácil levar para a diretoria.", lesson: "Pilotos com meta clara transformam risco em teste.", good: true },
      { label: "Devolvemos todo o dinheiro a qualquer momento.", apply: (s) => ({ trust: s.trust + 5, price: s.price * 0.9 }), reply: () => "Interessante. Então o risco fica todo com vocês?", lesson: "Garantias amplas custam caro e não resolvem a adoção.", good: false },
    ],
  },
  {
    buyer: "Ok. Como seguimos a partir daqui?",
    choices: [
      { label: "Envio a proposta por e-mail e aguardo o retorno de vocês.", apply: (s) => ({ trust: s.trust - 5 }), reply: () => "Certo, vamos olhar quando der.", lesson: "Sem próximo passo com data, o negócio esfria.", good: false },
      { label: "Vamos definir hoje quem participa do piloto e a data de início?", apply: (s) => ({ trust: s.trust + 10 }), reply: (s) => (s.pilot ? "Pode ser na segunda. Vou chamar os gerentes das duas unidades." : "Vamos marcar uma conversa com a diretoria na semana que vem."), lesson: "Feche com um compromisso concreto: quem, o quê e quando.", good: true },
      { label: "Podemos assinar o contrato agora?", apply: (s) => ({ trust: s.trust + (s.trust >= 70 ? 0 : -10) }), reply: (s) => (s.trust >= 70 ? "Preciso só da aprovação jurídica, mas estamos alinhados." : "Calma, ainda não estou convencido."), lesson: "Pressão só funciona quando a confiança já existe.", good: false },
    ],
  },
];

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export function MesaDeNegociacao({ onFinish }: { onFinish: Finish }) {
  const [state, setState] = useState<State>({ price: LIST, trust: 40, knowsPain: false, pilot: false, annual: false });
  const [round, setRound] = useState(0);
  const [log, setLog] = useState<{ who: "buyer" | "you"; text: string }[]>([{ who: "buyer", text: ROUNDS[0].buyer }]);
  const [lessons, setLessons] = useState<{ text: string; good: boolean }[]>([]);
  const [waiting, setWaiting] = useState(false);

  const choose = (c: Choice) => {
    if (waiting) return;
    const next = { ...state, ...c.apply(state) };
    next.trust = clamp(next.trust);
    const newLog = [...log, { who: "you" as const, text: c.label }, { who: "buyer" as const, text: c.reply(next) }];
    const newLessons = [...lessons, { text: c.lesson, good: c.good }];
    setState(next);
    setLog(newLog);
    setLessons(newLessons);
    setWaiting(true);
    setTimeout(() => {
      setWaiting(false);
      if (round + 1 < ROUNDS.length) {
        setRound(round + 1);
        setLog((l) => [...l, { who: "buyer", text: ROUNDS[round + 1].buyer }]);
      } else {
        const score = Math.min(100, Math.round((next.price / LIST) * 45 + next.trust * 0.55));
        onFinish(
          score,
          <>
            <div className="grid g3 mt">
              <div className="metric-mini"><span className="tiny muted">Contrato mensal</span><strong>{brl(next.price)}</strong></div>
              <div className="metric-mini"><span className="tiny muted">Confiança do cliente</span><strong>{next.trust}/100</strong></div>
              <div className="metric-mini"><span className="tiny muted">Acordo</span><strong style={{ fontSize: 15 }}>{[next.annual && "Anual", next.pilot && "Com piloto"].filter(Boolean).join(" · ") || "Sem condições"}</strong></div>
            </div>
            <h3 className="mt">O que suas escolhas ensinaram</h3>
            {newLessons.map((l, i) => (
              <p key={i} className="smalltext"><b style={{ color: l.good ? "var(--green)" : "var(--warn)" }}>{l.good ? "Boa jogada:" : "Atenção:"}</b> {l.text}</p>
            ))}
          </>,
        );
      }
    }, 900);
  };

  return (
    <section className="card game-board">
      <div className="game-hud">
        <span>Rodada <b>{round + 1}/{ROUNDS.length}</b></span>
        <span>Contrato <b>{brl(state.price)}</b>/mês</span>
        <span className="meter">Confiança <span className="meter-bar"><span style={{ width: `${state.trust}%` }} /></span> <b>{state.trust}</b></span>
      </div>
      <div className="chat" aria-live="polite">
        {log.map((m, i) => (
          <div key={i} className={`bubble ${m.who}`}>
            {m.who === "buyer" && <Avatar initials="RS" tone="gold" />}
            <p>{m.who === "buyer" && <b className="tiny">Renata · compras da Rede Sabor &amp; Cia<br /></b>}{m.text}</p>
          </div>
        ))}
        {waiting && <div className="bubble buyer typing"><Avatar initials="RS" tone="gold" /><p>…</p></div>}
      </div>
      <div className="choices">
        {ROUNDS[round].choices.map((c) => (
          <button key={c.label} className="option choice" onClick={() => choose(c)} disabled={waiting}>
            <Icon name="chat" /> <span>{c.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
