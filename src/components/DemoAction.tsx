"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Icon, type IconName } from "@/components/ui/Icon";
import { useToast } from "@/components/ui/Toast";

/**
 * Botão de uma ação que ainda não tem backend nesta etapa.
 * Explica o que a versão final fará — nunca simula sucesso.
 */
export function DemoAction({
  label,
  title,
  text,
  icon = "arrow",
  variant = "",
  small,
  toast,
}: {
  label: string;
  title?: string;
  text?: string;
  icon?: IconName;
  variant?: string;
  small?: boolean;
  /** Em vez de diálogo, exibe uma mensagem curta. */
  toast?: string;
}) {
  const [open, setOpen] = useState(false);
  const push = useToast();
  return (
    <>
      <button type="button" className={`btn ${variant} ${small ? "small" : ""}`} onClick={() => (toast ? push(toast) : setOpen(true))}>
        {label}
        <Icon name={icon} />
      </button>
      {!toast && (
        <Dialog open={open} onClose={() => setOpen(false)} title={title ?? label}>
          <p>{text}</p>
          <p className="tiny muted">Funcionalidade prevista para as próximas etapas. Nada foi gravado ou enviado.</p>
        </Dialog>
      )}
    </>
  );
}
