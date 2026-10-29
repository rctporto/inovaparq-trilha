"use client";

import { useState } from "react";
import Link from "next/link";
import { authMessage, login, loginWithGoogle, resetPassword, signup } from "@/lib/session";

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

  async function onGoogle() {
    setError(null);
    setInfo(null);
    setPending(true);
    try {
      await loginWithGoogle();
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
      <button type="button" className="btn btn-google" onClick={onGoogle} disabled={pending}>
        <GoogleIcon /> {isSignup ? "Cadastrar com Google" : "Entrar com Google"}
      </button>
      <div className="divider"><span>ou com e-mail</span></div>
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

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}
