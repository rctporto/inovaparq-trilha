import type { Metadata } from "next";
import { Button, PageHead, ProgressBar, StatusBadge } from "@/components/ui";
import { Icon, type IconName } from "@/components/ui/Icon";

export const metadata: Metadata = { title: "Central de recompensas" };

type Reward = { title: string; text: string; req: string; icon: IconName; next?: boolean };

const REWARDS: Reward[] = [
  { title: "Clínica de descoberta", text: "Uma conversa coletiva para aprofundar suas entrevistas e aprendizados.", req: "Fase 2 aprovada · 1.000 XP", icon: "people", next: true },
  { title: "Oficina de mercado", text: "Aprenda a interpretar alternativas e posicionar sua proposta de valor.", req: "Fase 3 aprovada · 1.500 XP", icon: "chart" },
  { title: "Olhar de especialista", text: "Novas perspectivas sobre viabilidade, diferenciação e impacto.", req: "Fase 4 aprovada · 2.000 XP", icon: "spark" },
  { title: "Mentoria individual", text: "30 minutos para revisar o protótipo e os resultados dos testes.", req: "Fase 6 aprovada · 3.000 XP", icon: "people" },
  { title: "Clínica de gestão", text: "Mentoria individual de 30 minutos sobre operação e finanças.", req: "Fase 8 aprovada · 4.000 XP", icon: "chart" },
  { title: "Apresentação para banca", text: "Compartilhe o projeto e receba recomendações para o próximo ciclo.", req: "Fase 10 aprovada · 5.000 XP", icon: "award" },
];

export default function Recompensas() {
  return (
    <>
      <PageHead eyebrow="Reconhecimento que impulsiona" title="Cada avanço abre possibilidades." desc="Benefícios vinculados ao seu aprendizado e aos marcos da jornada." action={<StatusBadge tone="plum">0 XP acumulados</StatusBadge>} />
      <div className="card mb">
        <div className="row between wrap">
          <div>
            <h2>Seu próximo desbloqueio</h2>
            <p className="sub">Clínica de descoberta · fase 2 aprovada e 1.000 XP</p>
          </div>
          <b style={{ color: "var(--plum)" }}>Faltam 1.000 XP</b>
        </div>
        <div className="mt"><ProgressBar value={0} tone="plum" label="Progresso até o próximo desbloqueio" /></div>
      </div>
      <div className="grid g3">
        {REWARDS.map((r) => (
          <section key={r.title} className="card reward">
            {r.next && (
              <div className="row between mb">
                <StatusBadge tone="plum">Próxima conquista</StatusBadge>
                <Icon name="lock" />
              </div>
            )}
            <div className={`badge ${r.next ? "plum" : "gray"}`}><Icon name={r.icon} /></div>
            <h3>{r.title}</h3>
            <p>{r.text}</p>
            <span className="tiny muted mb">{r.req}</span>
            <Button disabledReason={r.next ? "Conclua a fase Investigador" : "Aguardando marco"}>{null}</Button>
          </section>
        ))}
      </div>
    </>
  );
}
