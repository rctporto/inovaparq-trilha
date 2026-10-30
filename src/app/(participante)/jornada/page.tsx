import type { Metadata } from "next";
import { Button, DemoRibbon, PageHead, PhaseCard, ProgressBar, StatusBadge } from "@/components/ui";
import { Icon } from "@/components/ui/Icon";
import { CURRENT_PHASE, PHASES } from "@/lib/demo";

export const metadata: Metadata = { title: "Mapa da jornada" };

export default function Jornada() {
  const done = PHASES.filter((p) => p.state === "done").length;
  return (
    <>
      <DemoRibbon />
      <PageHead eyebrow="Mapa de evolução" title="Sua ideia ganha caminho." desc="Avance com conhecimento, experimentação e decisões baseadas em evidências." action={<Button href={`/fase/${CURRENT_PHASE}`}>Continuar fase {CURRENT_PHASE}</Button>} />
      <div className="card mb">
        <div className="row between mb wrap">
          <div>
            <b>Trilha principal</b>
            <p className="tiny muted" style={{ margin: "6px 0 0" }}>10 fases · aproximadamente 100 horas · ritmo flexível</p>
          </div>
          <StatusBadge tone="green">{done} fases concluídas</StatusBadge>
        </div>
        <ProgressBar value={done * 10} label="Progresso na trilha" />
        <div className="row wrap tiny muted mt">
          <span><Icon name="check" /> Concluída</span>
          <span style={{ color: "var(--plum)" }}><Icon name="target" /> Em andamento</span>
          <span><Icon name="lock" /> Próximas fases</span>
        </div>
      </div>
      <div className="phase-path">
        {PHASES.map((p, i) => (
          <PhaseCard key={p.name} index={i + 1} name={p.name} theme={p.theme} state={p.state} href={`/fase/${i + 1}`} />
        ))}
      </div>
      <div className="notice mt">Mudar de direção também é evoluir. Revise hipóteses e preserve o histórico do que aprendeu em cada fase.</div>
    </>
  );
}
