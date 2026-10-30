"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginWithGoogle, loginWithPassword } from "@/app/actions/auth";
import { FormField } from "@/components/ui";
import { GoogleMark, Icon } from "@/components/ui/Icon";

export function GoogleButton({ enabled, label = "Entrar com Google" }: { enabled: boolean; label?: string }) {
  if (!enabled)
    return (
      <button type="button" className="btn google" disabled title="Configure AUTH_GOOGLE_ID e AUTH_GOOGLE_SECRET">
        <GoogleMark />
        {label} · configuração pendente
      </button>
    );
  return (
    <form action={loginWithGoogle}>
      <button type="submit" className="btn google">
        <GoogleMark />
        {label}
      </button>
    </form>
  );
}

export function LoginForm({ googleEnabled, message }: { googleEnabled: boolean; message?: string }) {
  const [state, action, pending] = useActionState(loginWithPassword, undefined);
  return (
    <>
      <GoogleButton enabled={googleEnabled} />
      <div className="divider-or">ou com e-mail</div>
      <form action={action} noValidate>
        {(state?.error || message) && (
          <div className="form-error" role="alert">
            {state?.error ?? message}
          </div>
        )}
        <FormField label="E-mail" name="email" type="email" placeholder="voce@exemplo.com" autoComplete="email" required defaultValue={state?.values?.email} key={`e-${state?.values?.email ?? ""}`} />
        <FormField label="Senha" name="password" type="password" placeholder="Digite sua senha" autoComplete="current-password" required />
        <button type="submit" className="btn full" disabled={pending}>
          {pending ? "Entrando..." : "Entrar"}
          <Icon name="arrow" />
        </button>
      </form>
      <p className="auth-foot">
        Ainda não tem acesso? <Link href="/cadastro">Solicitar cadastro</Link>
      </p>
    </>
  );
}
