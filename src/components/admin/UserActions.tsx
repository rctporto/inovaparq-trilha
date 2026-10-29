"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { approveUser, changeRole, rejectUser, setActive, type ActionResult } from "@/app/actions/users";
import { Dialog } from "@/components/ui/Dialog";
import { Icon } from "@/components/ui/Icon";
import { useToast } from "@/components/ui/Toast";
import { ROLE_LABEL, type Role, type UserStatus } from "@/lib/roles";

type Target = { id: string; name: string | null; email: string; role: Role; requestedRole: Role; status: UserStatus };

export function UserActions({ user, grantable, canEdit, blockedReason }: { user: Target; grantable: Role[]; canEdit: boolean; blockedReason?: string }) {
  const push = useToast();
  const router = useRouter();
  const [pending, start] = useTransition();
  const [role, setRole] = useState<Role>(grantable.includes(user.status === "ATIVO" ? user.role : user.requestedRole) ? (user.status === "ATIVO" ? user.role : user.requestedRole) : grantable[0]);
  const [dialog, setDialog] = useState<null | "reject" | "deactivate">(null);
  const [reason, setReason] = useState("");

  if (!canEdit) return <span className="tiny muted">{blockedReason}</span>;

  const run = (fn: () => Promise<ActionResult>, after?: () => void) =>
    start(async () => {
      const res = await fn();
      push(res.message, res.ok ? "success" : "error");
      if (res.ok) {
        after?.();
        router.refresh();
      }
    });

  const label = user.name ?? user.email;
  const roleSelect = (
    <select aria-label={`Papel de ${label}`} value={role} onChange={(e) => setRole(e.target.value as Role)} disabled={pending}>
      {grantable.map((r) => (
        <option key={r} value={r}>
          {ROLE_LABEL[r]}
        </option>
      ))}
    </select>
  );

  return (
    <div className="inline-form">
      {user.status === "PENDENTE" && (
        <>
          {roleSelect}
          <button className="btn teal small" disabled={pending} onClick={() => run(() => approveUser(user.id, role))}>
            Aprovar <Icon name="check" />
          </button>
          <button className="btn light small" disabled={pending} onClick={() => setDialog("reject")}>
            Recusar <Icon name="x" />
          </button>
        </>
      )}
      {user.status === "ATIVO" && (
        <>
          {roleSelect}
          <button className="btn light small" disabled={pending || role === user.role} onClick={() => run(() => changeRole(user.id, role))}>
            Salvar papel
          </button>
          <button className="btn light small" disabled={pending} onClick={() => setDialog("deactivate")}>
            Desativar
          </button>
        </>
      )}
      {(user.status === "INATIVO" || user.status === "REJEITADO") && (
        <button className="btn light small" disabled={pending} onClick={() => run(() => setActive(user.id, true))}>
          Reativar <Icon name="check" />
        </button>
      )}

      <Dialog
        open={dialog !== null}
        onClose={() => setDialog(null)}
        title={dialog === "reject" ? `Recusar cadastro de ${label}` : `Desativar ${label}`}
        footer={
          <>
            <button className="btn light" onClick={() => setDialog(null)}>
              Cancelar
            </button>
            <button
              className="btn danger"
              disabled={pending}
              onClick={() => run(() => (dialog === "reject" ? rejectUser(user.id, reason) : setActive(user.id, false, reason)), () => { setDialog(null); setReason(""); })}
            >
              {dialog === "reject" ? "Recusar cadastro" : "Desativar conta"}
            </button>
          </>
        }
      >
        <p>{dialog === "reject" ? "A pessoa verá que o cadastro não foi aprovado. O registro fica guardado na auditoria e pode ser reativado depois." : "A pessoa perde o acesso imediatamente. O histórico é preservado e a conta pode ser reativada."}</p>
        <label className="field" htmlFor="reason">
          Motivo {dialog === "reject" ? "(obrigatório)" : "(opcional)"}
          <textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} style={{ minHeight: 80 }} />
        </label>
      </Dialog>
    </div>
  );
}
