"use client";

// Interações demonstrativas da etapa 1. Validam no navegador e explicam o comportamento final,
// mas não gravam nada: as regras reais (nota, XP, reservas) serão calculadas no servidor.

import { useMemo, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { useToast } from "@/components/ui/Toast";
import { RUBRIC } from "@/lib/demo";

export function Tabs({ tabs }: { tabs: { id: string; label: string; content: ReactNode }[] }) {
  const [active, setActive] = useState(tabs[0].id);
  return (
    <>
      <div className="tabs mb" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={active === t.id}
            aria-controls={`panel-${t.id}`}
            className={active === t.id ? "active" : ""}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.id} role="tabpanel" id={`panel-${t.id}`} aria-labelledby={`tab-${t.id}`} hidden={active !== t.id}>
          {t.content}
        </div>
      ))}
    </>
  );
}

export function LessonComplete() {
  const push = useToast();
  return (
    <button className="btn teal" onClick={() => push("Demonstração: o progresso da aula será gravado na etapa 3. Concluir aula não concede XP de missão.")}>
      Marcar como concluída
      <Icon name="check" />
    </button>
  );
}

export function NotesField() {
  const push = useToast();
  return (
    <>
      <label className="field" htmlFor="notes">
        Suas anotações
        <textarea id="notes" placeholder="Registre seus aprendizados." />
      </label>
      <button className="btn light" onClick={() => push("Demonstração: anotações serão salvas na sua conta na etapa 3.")}>
        Salvar anotações
        <Icon name="file" />
      </button>
    </>
  );
}

const QUIZ = [
  { v: "a", t: "Aumentar a quantidade de funcionalidades antes de investigar o motivo." },
  { v: "b", t: "Revisar a hipótese, compreender as evidências e decidir o próximo experimento." },
  { v: "c", t: "Desconsiderar os resultados porque a ideia parece inovadora." },
  { v: "d", t: "Considerar o projeto validado porque o teste foi realizado." },
];

export function QuizDemo() {
  const [value, setValue] = useState<string>();
  const [result, setResult] = useState<"ok" | "bad" | "none">();
  return (
    <>
      <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className="sr-only">Alternativas</legend>
        {QUIZ.map((o) => (
          <label key={o.v} className="option">
            <input type="radio" name="quiz" value={o.v} checked={value === o.v} onChange={() => setValue(o.v)} />
            {o.t}
          </label>
        ))}
      </fieldset>
      <div aria-live="polite">
        {result === "none" && <div className="notice gold mt">Selecione uma alternativa.</div>}
        {result === "ok" && <div className="notice success mt">Resposta correta. A evidência orienta a revisão da hipótese e o próximo experimento.</div>}
        {result === "bad" && <div className="notice gold mt">Reflita sobre o que os resultados mostram. É preciso revisar a hipótese antes de investir mais na solução.</div>}
      </div>
      <div className="row between mt wrap">
        <span className="tiny muted">Novas tentativas não geram XP duplicado. Na versão final a correção é feita no servidor.</span>
        <button className="btn" onClick={() => setResult(!value ? "none" : value === "b" ? "ok" : "bad")}>
          Verificar resposta
          <Icon name="arrow" />
        </button>
      </div>
    </>
  );
}

export function MissionForm() {
  const push = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const submit = (form: HTMLFormElement, mode: "draft" | "send") => {
    const fd = new FormData(form);
    const e: Record<string, string> = {};
    if (mode === "send") {
      if (!String(fd.get("solution") ?? "").trim()) e.solution = "Informe a solução selecionada.";
      if (!String(fd.get("rationale") ?? "").trim()) e.rationale = "Explique como chegou à decisão.";
      if (!fd.get("original")) e.original = "Confirme a revisão dos dados pessoais.";
      const file = fd.get("evidence");
      if (file instanceof File && file.size > 20 * 1024 * 1024) e.evidence = "Arquivo acima de 20 MB.";
    }
    setErrors(e);
    if (Object.keys(e).length) return push("Revise os campos destacados.", "error");
    push(mode === "draft" ? "Demonstração: rascunhos serão salvos no servidor na etapa 4." : "Demonstração: o envio com anexos privados e versão congelada chega na etapa 4. Nada foi enviado.");
  };
  return (
    <form onSubmit={(ev) => { ev.preventDefault(); submit(ev.currentTarget, "send"); }} noValidate>
      <label className="field" htmlFor="solution">
        Qual solução você selecionou?
        <input id="solution" name="solution" defaultValue="Sistema de acompanhamento de estoques e alertas de consumo" aria-invalid={!!errors.solution || undefined} />
        {errors.solution && <span className="error">{errors.solution}</span>}
      </label>
      <label className="field" htmlFor="rationale">
        Como você chegou a essa decisão?
        <textarea id="rationale" name="rationale" defaultValue="Comparamos um aplicativo de controle, um serviço de redistribuição e um sistema de alertas. A matriz considera relevância para o cliente, custo de teste, viabilidade e diferenciação." aria-invalid={!!errors.rationale || undefined} />
        {errors.rationale && <span className="error">{errors.rationale}</span>}
      </label>
      <div className="upload">
        <Icon name="upload" />
        <b>Anexe a matriz e os registros da análise</b>
        <br />
        Formatos previstos: PDF, XLSX, PNG ou JPG · até 20 MB por arquivo
        <br />
        <input type="file" name="evidence" aria-label="Selecionar evidência" accept=".pdf,.xlsx,.png,.jpg,.jpeg" />
        {errors.evidence && <span className="error">{errors.evidence}</span>}
      </div>
      <label className="field mt" htmlFor="hypothesis">
        Qual hipótese ainda precisa ser testada?
        <textarea id="hypothesis" name="hypothesis" style={{ minHeight: 85 }} defaultValue="Precisamos verificar se os responsáveis pelos estoques registrarão as informações com frequência suficiente." />
      </label>
      <label className="check">
        <input type="checkbox" name="original" defaultChecked />
        <span>
          Revisei as fontes e removi dados pessoais desnecessários dos anexos.
          {errors.original && <span className="error" style={{ color: "#a3323b", display: "block" }}>{errors.original}</span>}
        </span>
      </label>
      <div className="row between mt wrap">
        <button type="button" className="btn light" onClick={(ev) => submit(ev.currentTarget.form!, "draft")}>
          Salvar rascunho
          <Icon name="file" />
        </button>
        <button type="submit" className="btn">
          Enviar para avaliação
          <Icon name="arrow" />
        </button>
      </div>
      <p className="tiny muted">Etapa 1: anexos não são enviados a um servidor.</p>
    </form>
  );
}

const DAYS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
const AVAILABLE = [5, 12, 19, 26];

export function BookingDemo({ aside }: { aside: (summary: string, confirm: ReactNode) => ReactNode }) {
  const push = useToast();
  const [day, setDay] = useState(5);
  const [slot, setSlot] = useState("14:00");
  const [topic, setTopic] = useState("Como comparar alternativas de solução antes de investir no protótipo?");
  // Novembro/2026 começa num domingo.
  const summary = `${String(day).padStart(2, "0")}/11/2026 · ${slot} · Brasília`;
  const confirm = (
    <button className="btn" onClick={() => (topic.trim() ? push("Demonstração: nenhuma reserva ou convite real foi criado. A agenda com vagas reais chega na etapa 6.") : push("Descreva a dúvida principal.", "error"))}>
      Confirmar reserva
      <Icon name="calendar" />
    </button>
  );
  return (
    <div className="grid wide">
      <section className="card">
        <div className="row between mb">
          <h2>Novembro de 2026</h2>
          <span className="tiny muted">Horários de Brasília</span>
        </div>
        <div className="calendar" role="grid" aria-label="Dias de novembro de 2026">
          {DAYS.map((d) => (
            <span key={d}>{d}</span>
          ))}
          {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => {
            const ok = AVAILABLE.includes(d);
            return (
              <button key={d} className={!ok ? "disabled" : d === day ? "selected" : ""} disabled={!ok} aria-pressed={d === day} aria-label={`${d} de novembro${ok ? "" : ", sem horários"}`} onClick={() => setDay(d)}>
                {d}
              </button>
            );
          })}
        </div>
        <div className="divider" />
        <h3>Horários disponíveis</h3>
        <p className="tiny muted">Encontro coletivo · 60 minutos · exemplo de agenda</p>
        <div className="slots">
          {["14:00", "16:00"].map((s) => (
            <button key={s} className={s === slot ? "selected" : ""} aria-pressed={s === slot} onClick={() => setSlot(s)}>
              {s}
            </button>
          ))}
        </div>
        <label className="field mt" htmlFor="booking-topic">
          O que gostaria de discutir?
          <textarea id="booking-topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Conte sua principal dúvida para este encontro." />
        </label>
      </section>
      {aside(summary, confirm)}
    </div>
  );
}

export function FilterList({ placeholder, items }: { placeholder: string; items: { key: string; search: string; node: ReactNode }[] }) {
  const [q, setQ] = useState("");
  const shown = items.filter((i) => i.search.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <>
      <div className="toolbar">
        <label className="field" style={{ margin: 0, minWidth: 260 }}>
          <span className="sr-only">{placeholder}</span>
          <input placeholder={placeholder} value={q} onChange={(e) => setQ(e.target.value)} style={{ margin: 0 }} />
        </label>
      </div>
      {shown.length ? (
        <div className="grid g3">{shown.map((i) => <div key={i.key} style={{ display: "contents" }}>{i.node}</div>)}</div>
      ) : (
        <div className="card empty">
          <h3>Nenhum resultado</h3>
          <p>Tente outra especialidade ou limpe a busca.</p>
        </div>
      )}
    </>
  );
}

export function ReviewForm() {
  const push = useToast();
  const [scores, setScores] = useState<Record<string, number>>(() => Object.fromEntries(RUBRIC.map((r) => [r.key, r.demo])));
  const [req, setReq] = useState(true);
  const [feedback, setFeedback] = useState("A comparação está bem estruturada. No próximo teste, explicite o critério mínimo de adesão à rotina de registros.");
  const total = useMemo(() => Object.values(scores).reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0), [scores]);
  const invalid = RUBRIC.some((r) => scores[r.key] < 0 || scores[r.key] > r.max || !Number.isFinite(scores[r.key]));

  const approve = () => {
    if (invalid) return push("Confira os limites de cada critério.", "error");
    if (total < 70 || !req) return push("Aprovação exige pelo menos 70 pontos e todos os itens obrigatórios.", "error");
    if (!feedback.trim()) return push("Registre um feedback antes de aprovar.", "error");
    push("Demonstração: a aprovação com concessão de XP em transação chega nas etapas 4 e 5. Nada foi gravado.");
  };
  const review = () => {
    if (!feedback.trim()) return push("Explique o que deve ser revisado.", "error");
    push("Demonstração: o pedido de revisão retornará a entrega ao participante na etapa 4.");
  };

  return (
    <section className="card">
      <div className="row between mb">
        <h2>Critérios da avaliação</h2>
        <span className={`tag ${total >= 70 ? "plum" : "gold"}`} aria-live="polite">
          {total} / 100
        </span>
      </div>
      {RUBRIC.map((r) => (
        <div className="row between" style={{ margin: "12px 0" }} key={r.key}>
          <label className="smalltext" htmlFor={`score-${r.key}`}>
            {r.label} <span className="muted">/ {r.max}</span>
          </label>
          <input
            id={`score-${r.key}`}
            type="number"
            min={0}
            max={r.max}
            value={Number.isFinite(scores[r.key]) ? scores[r.key] : ""}
            onChange={(e) => setScores((s) => ({ ...s, [r.key]: e.target.value === "" ? NaN : Number(e.target.value) }))}
            style={{ width: 65, border: "1px solid var(--line)", borderRadius: 6, padding: 7 }}
          />
        </div>
      ))}
      <label className="check">
        <input type="checkbox" checked={req} onChange={(e) => setReq(e.target.checked)} />
        Todos os itens obrigatórios foram atendidos.
      </label>
      <label className="field mt" htmlFor="feedback">
        Feedback para o participante
        <textarea id="feedback" style={{ minHeight: 85 }} value={feedback} onChange={(e) => setFeedback(e.target.value)} />
      </label>
      <div className="row wrap">
        <button className="btn light" onClick={review}>
          Solicitar revisão
          <Icon name="file" />
        </button>
        <button className="btn teal" onClick={approve}>
          Aprovar entrega
          <Icon name="check" />
        </button>
      </div>
      <p className="tiny muted">Aprovar a entrega não conclui a fase se existirem outros requisitos pendentes.</p>
    </section>
  );
}

export function Switch({ label, defaultOn, disabled }: { label: string; defaultOn: boolean; disabled?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return <button className={`switch ${on ? "" : "off"}`} role="switch" aria-checked={on} aria-label={label} disabled={disabled} onClick={() => setOn((o) => !o)} />;
}

export function ExportPortfolio() {
  const download = () => {
    const blob = new Blob(
      ["Portfólio de demonstração - Inovaparq\nParticipante fictícia: Ana Costa\nProjeto: Raiz Circular\nFases concluídas: Explorador, Investigador, Estrategista\nXP: 1750\nEste resumo não é um certificado."],
      { type: "text/plain;charset=utf-8" },
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "portfolio_demonstrativo.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  };
  return (
    <button className="btn light" onClick={download}>
      Exportar resumo
      <Icon name="file" />
    </button>
  );
}
