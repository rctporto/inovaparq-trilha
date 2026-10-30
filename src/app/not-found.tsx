import Link from "next/link";
import { Brand } from "@/components/ui/Brand";

export default function NotFound() {
  return (
    <main className="status-page" id="conteudo" style={{ background: "var(--bg)" }}>
      <div className="auth-card">
        <Brand />
        <h2>Página não encontrada.</h2>
        <p className="sub">O endereço pode ter mudado. Volte ao início para continuar sua jornada.</p>
        <Link className="btn mt" href="/painel">Ir para o início</Link>
      </div>
    </main>
  );
}
