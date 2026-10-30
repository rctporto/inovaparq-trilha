import type { Metadata } from "next";
import { DemoAction } from "@/components/DemoAction";
import { Button, DemoRibbon, PageHead, ProgressBar, StatusBadge } from "@/components/ui";
import { Icon, type IconName } from "@/components/ui/Icon";

export const metadata: Metadata = { title: "Central de recompensas" };

type Reward = { title: string; text: string; req: string; icon: IconName; state: "available" | "next" | "locked"; cta?: React.ReactNode };

const REWARDS: Reward[] = [
  { title: "Clínica de descoberta", text: "Uma conversa coletiva para aprofundar suas entrevistas e aprendizados.", req: "Fase 2 aprovada · 1.000 XP", icon: "people", state: "available", cta: <DemoAction label="Resgatar benefício" variant="teal" icon="gift" toast="Demonstração: o resgate transacional (com controle de vagas) chega na etapa 5. Seu XP não é gasto." /> },
  { title: "Oficina de mercado", text: "Aprenda a interpretar alternativas e posicionar sua proposta de valor.", req: "Fase 3 aprovada · 1.500 XP", icon: "chart", state: "available", cta: <DemoAction label="Ver próximos encontros" variant="light" icon="calendar" text="Próximo encontro de demonstração: 12/11/2026, às 16h (Brasília). A disponibilidade será confirmada pelo sistema na versão final." /> },
  { title: "Olhar de especialista", text: "Novas perspectivas sobre viabilidade, diferenciação e impacto.", req: "Fase 4 aprovada · 2.000 XP", icon: "spark", state: "next" },
  { title: "Mentoria individual", text: "30 minutos para revisar o protótipo e os resultados dos testes.", req: "Fase 6 aprovada · 3.000 XP", icon: "people", state: "locked" },
  { title: "Clínica de gestão", text: "Mentoria individual de 30 minutos sobre operação e finanças.", req: "Fase 8 aprovada · 4.000 XP", icon: "chart", state: "locked" },
  { title: "Apresentação para banca", text: "Compartilhe o projeto e receba recomendações para o próximo ciclo.", req: "Fase 10 aprovada · 5.000 XP", icon: "award", state: "locked" },
];

export default function Recompensas() {
  return (
    <>
      <DemoRibbon />
      <PageHead eyebrow="Reconhecimento que impulsiona" title="Cada avanço abre possibilidades." desc="Benefícios vinculados ao seu aprendizado e aos marcos da jornada." action={<StatusBadge tone="plum">1.750 XP acumulados</StatusBadge>} />
      <div className="card mb">
        <div className="row between wrap">
          <div>
            <h2>Seu próximo desbloqueio</h2>
            <p className="sub">Encontro com especialista · fase 4 aprovada e 2.000 XP</p>
          </div>
          <b style={{ color: "var(--plum)" }}>Faltam 250 XP</b>
        </div>
        <div className="mt"><ProgressBar value={87.5} tone="plum" label="Progresso até o próximo desbloqueio" /></div>
      </div>
      <div className="grid g3">
        {REWARDS.map((r) => (
          <section key={r.title} className="card reward">
            {r.state !== "locked" && (
              <div className="row between mb">
                <StatusBadge tone={r.state === "available" ? "green" : "plum"}>{r.state === "available" ? "Disponível" : "Próxima conquista"}</StatusBadge>
                <Icon name={r.state === "available" ? "gift" : "lock"} />
              </div>
            )}
            <div className={`badge ${r.state === "next" ? "plum" : r.state === "locked" ? "gray" : ""}`}><Icon name={r.icon} /></div>
            <h3>{r.title}</h3>
            <p>{r.text}</p>
            <span className="tiny muted mb">{r.req}</span>
            {r.cta ?? <Button disabledReason={r.state === "next" ? "Conclua a fase Criador" : "Aguardando marco"}>{null}</Button>}
          </section>
        ))}
      </div>
    </>
  );
}
