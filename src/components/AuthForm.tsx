"use client";

import { useState } from "react";
import Link from "next/link";
import { authMessage, login, resetPassword, signup } from "@/lib/session";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [type, setType] = useState<"pf" | "pj">("pf");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const isSignup = mode === "signup";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") ?? "").trim().toLowerCase();
    const password = String(f.get("password") ?? "");
    setError(null);
    setInfo(null);
    if (isSignup) {
      const name = String(f.get("name") ?? "").trim();
      const companyName = String(f.get("companyName") ?? "").trim();
      if (!name) return setError("Preencha o nome.");
      if (type === "pj" && !companyName) return setError("Informe o nome da empresa.");
      if (password.length < 8) return setError("A senha precisa ter pelo menos 8 caracteres.");
    }
    setPending(true);
    try {
      if (isSignup) {
        await signup({ name: String(f.get("name")).trim(), email, password, accountType: type, companyName: String(f.get("companyName") ?? "").trim() });
      } else {
        await login(email, password);
      }
      // A página inicial e a de cadastro levam para a trilha assim que a sessão chega.
    } catch (err) {
      setError(authMessage(err));
    } finally {
      setPending(false);
    }
  }

  async function onForgot(form: HTMLFormElement | null) {
    const email = String(new FormData(form ?? undefined).get("email") ?? "").trim();
    setError(null);
    if (!email) return setError("Digite seu e-mail acima e clique de novo em \"Esqueci minha senha\".");
    try {
      await resetPassword(email);
    } catch {
      // Não revelamos se o e-mail existe.
    }
    setInfo("Se houver uma conta com esse e-mail, enviamos um link para criar uma nova senha.");
  }

  return (
    <form onSubmit={onSubmit} className="card stack" noValidate={false}>
      <h2 style={{ textAlign: "center" }}>{isSignup ? "Criar conta" : "Acesse a Trilha de Inovação"}</h2>
      {isSignup && (
        <>
          <div className="segmented" role="radiogroup" aria-label="Tipo de conta">
            <label><input type="radio" name="accountType" value="pf" checked={type === "pf"} onChange={() => setType("pf")} />Pessoa</label>
            <label><input type="radio" name="accountType" value="pj" checked={type === "pj"} onChange={() => setType("pj")} />Empresa</label>
          </div>
          {type === "pj" && (
            <label>Nome da empresa<input type="text" name="companyName" required autoComplete="organization" /></label>
          )}
          <label>{type === "pj" ? "Nome do responsável" : "Nome"}<input type="text" name="name" required autoComplete="name" /></label>
        </>
      )}
      <label>E-mail<input type="email" name="email" required autoComplete="email" /></label>
      <label>
        Senha
        <input type="password" name="password" required minLength={isSignup ? 8 : undefined}
          autoComplete={isSignup ? "new-password" : "current-password"} />
      </label>
      {error && <p className="error">{error}</p>}
      {info && <p style={{ color: "var(--brand-primary-dark)" }}>{info}</p>}
      <button className="btn" disabled={pending} style={{ width: "100%" }}>
        {pending ? "Aguarde…" : isSignup ? "Cadastrar" : "Entrar"}
      </button>
      {!isSignup && (
        <button type="button" className="linklike" onClick={(e) => onForgot(e.currentTarget.form)}>Esqueci minha senha</button>
      )}
      <p className="muted" style={{ textAlign: "center" }}>
        {isSignup ? <>Já tem conta? <Link href="/">Entrar</Link></> : <>Primeira vez aqui? <Link href="/cadastro/">Criar conta</Link></>}
      </p>
    </form>
  );
}
