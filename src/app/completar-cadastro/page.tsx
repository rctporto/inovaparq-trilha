"use client";

import { useState } from "react";
import { authMessage, completeProfile, logout, useGate } from "@/lib/session";
import { Welcome } from "@/components/Welcome";

export default function CompletarCadastroPage() {
  const s = useGate("/completar-cadastro/");
  const [type, setType] = useState<"pf" | "pj">("pf");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  if (!s) return null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    const companyName = String(f.get("companyName") ?? "").trim();
    if (!name) return setError("Preencha o nome.");
    if (type === "pj" && !companyName) return setError("Informe o nome da empresa.");
    setPending(true);
    setError(null);
    try {
      await completeProfile({ name, accountType: type, companyName });
    } catch (err) {
      setError(authMessage(err));
      setPending(false);
    }
  }

  return (
    <Welcome>
      <form onSubmit={onSubmit} className="card stack">
        <h2 style={{ textAlign: "center" }}>Complete seu cadastro</h2>
        <p className="muted" style={{ textAlign: "center", margin: 0 }}>{s.user?.email}</p>
        <div className="segmented" role="radiogroup" aria-label="Tipo de conta">
          <label><input type="radio" name="accountType" value="pf" checked={type === "pf"} onChange={() => setType("pf")} />Pessoa</label>
          <label><input type="radio" name="accountType" value="pj" checked={type === "pj"} onChange={() => setType("pj")} />Empresa</label>
        </div>
        {type === "pj" && (
          <label>Nome da empresa<input type="text" name="companyName" required autoComplete="organization" /></label>
        )}
        <label>
          {type === "pj" ? "Nome do responsável" : "Nome"}
          <input type="text" name="name" required autoComplete="name" defaultValue={s.user?.displayName ?? ""} />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn" disabled={pending} style={{ width: "100%" }}>{pending ? "Enviando…" : "Enviar solicitação"}</button>
        <button type="button" className="linklike" onClick={() => logout()}>Usar outra conta</button>
      </form>
    </Welcome>
  );
}
