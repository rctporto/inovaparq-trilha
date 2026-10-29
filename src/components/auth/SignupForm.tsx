"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAccount } from "@/app/actions/auth";
import { FormField } from "@/components/ui";
import { Icon } from "@/components/ui/Icon";

export function SignupForm() {
  const [state, action, pending] = useActionState(registerAccount, undefined);
  const fe = state?.fieldErrors ?? {};
  const v = state?.values ?? {};
  return (
    <form action={action} noValidate key={JSON.stringify(v)}>
      {state?.error && (
        <div className="form-error" role="alert">
          {state.error}
        </div>
      )}
      <FormField label="Nome completo" name="name" autoComplete="name" required error={fe.name} defaultValue={v.name} />
      <FormField label="E-mail" name="email" type="email" autoComplete="email" required error={fe.email} defaultValue={v.email} />
      <FormField label="Startup ou organização" name="organization" hint="Opcional" error={fe.organization} defaultValue={v.organization} />
      <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className="field" style={{ marginBottom: 0 }}>
          Como você vai participar?
        </legend>
        <div className="radio-cards">
          <label className="option">
            <input type="radio" name="requestedRole" value="PARTICIPANTE" defaultChecked={v.requestedRole !== "MENTOR"} />
            <span>
              <b>Participante</b>
              <br />
              <span className="tiny muted">Startup em treinamento</span>
            </span>
          </label>
          <label className="option">
            <input type="radio" name="requestedRole" value="MENTOR" defaultChecked={v.requestedRole === "MENTOR"} />
            <span>
              <b>Mentor(a)</b>
              <br />
              <span className="tiny muted">Avalia e orienta projetos</span>
            </span>
          </label>
        </div>
      </fieldset>
      <FormField label="Senha" name="password" type="password" autoComplete="new-password" required hint="Mínimo de 8 caracteres." error={fe.password} />
      <FormField label="Confirme a senha" name="confirm" type="password" autoComplete="new-password" required error={fe.confirm} />
      <label className="field" htmlFor="f-note">
        Mensagem para a coordenação
        <textarea id="f-note" name="note" style={{ minHeight: 70 }} placeholder="Turma, edital ou contexto do seu cadastro (opcional)." defaultValue={v.note} />
      </label>
      <label className="check">
        <input type="checkbox" name="terms" aria-invalid={fe.terms ? true : undefined} />
        <span>
          Entendo que meu cadastro será analisado pela coordenação do Inovaparq e que meus dados serão usados apenas para a jornada.
          {fe.terms && (
            <span className="error" role="alert" style={{ color: "#a3323b", display: "block" }}>
              {fe.terms}
            </span>
          )}
        </span>
      </label>
      <button type="submit" className="btn full" disabled={pending}>
        {pending ? "Enviando..." : "Solicitar acesso"}
        <Icon name="arrow" />
      </button>
      <p className="auth-foot">
        Já tem conta? <Link href="/">Entrar</Link>
      </p>
    </form>
  );
}
