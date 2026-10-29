import { InnovationBackground } from "./InnovationBackground";

export function Welcome({ children }: { children: React.ReactNode }) {
  return (
    <div className="welcome">
      <InnovationBackground />
      <div className="welcome-inner">
        <img className="welcome-logo" src="/brand/inovaparq-logo-slogan.png" alt="Inovaparq: novas ideias orbitam aqui." />
        {children}
      </div>
    </div>
  );
}
