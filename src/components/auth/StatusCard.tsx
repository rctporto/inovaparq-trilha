import type { ReactNode } from "react";
import { logout } from "@/app/actions/auth";
import { Brand } from "@/components/ui/Brand";
import { Icon, type IconName } from "@/components/ui/Icon";

export function StatusCard({ icon, title, children, actions }: { icon: IconName; title: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <main className="status-page" id="conteudo" style={{ background: "var(--bg)" }}>
      <div className="auth-card">
        <Brand />
        <div className="feature-icon plum" style={{ marginTop: 26 }}>
          <Icon name={icon} />
        </div>
        <h2 style={{ marginTop: 0 }}>{title}</h2>
        {children}
        <div className="row wrap mt">
          {actions}
          <form action={logout}>
            <button className="btn light" type="submit">
              Sair
              <Icon name="logout" />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
