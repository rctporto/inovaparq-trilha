import type { ReactNode } from "react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Brand } from "@/components/ui/Brand";
import { StatusBadge } from "@/components/ui";

export function AuthLanding({ title, subtitle, children }: { title: ReactNode; subtitle: string; children: ReactNode }) {
  return (
    <main className="landing" id="conteudo">
      <AnimatedBackground />
      <section className="landing-copy">
        <div className="eyebrow">Jornada empreendedora</div>
        <h1>
          Uma ideia.
          <br />
          Muitas <em>possibilidades.</em>
        </h1>
        <p>Aprenda, experimente e transforme oportunidades em projetos que fazem a diferença.</p>
        <div className="landing-steps">
          <StatusBadge>10 fases de evolução</StatusBadge>
          <StatusBadge tone="plum">Aprendizado na prática</StatusBadge>
          <StatusBadge>Mentorias e conquistas</StatusBadge>
        </div>
      </section>
      <section className="landing-panel">
        <div className="auth-card">
          <Brand />
          <h2>{title}</h2>
          <p className="sub mb">{subtitle}</p>
          {children}
        </div>
      </section>
    </main>
  );
}
