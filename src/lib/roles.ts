// Regras puras de papéis e aprovação. Usadas pelas server actions e pelos testes.
export type Role = "PARTICIPANTE" | "MENTOR" | "ADMIN" | "DESENVOLVEDOR";
export type UserStatus = "PENDENTE" | "ATIVO" | "REJEITADO" | "INATIVO";
export type Area = "participante" | "mentor" | "admin";

export const ROLE_LABEL: Record<Role, string> = {
  PARTICIPANTE: "Participante",
  MENTOR: "Mentor",
  ADMIN: "Administrador",
  DESENVOLVEDOR: "Desenvolvedor",
};

export const STATUS_LABEL: Record<UserStatus, string> = {
  PENDENTE: "Aguardando aprovação",
  ATIVO: "Ativo",
  REJEITADO: "Não aprovado",
  INATIVO: "Inativo",
};

export const AREA_HOME: Record<Area, string> = {
  participante: "/inicio",
  mentor: "/mentor",
  admin: "/admin",
};

/** Áreas que cada papel pode abrir. Desenvolvedor vê tudo para suporte e testes. */
export function areasFor(role: Role): Area[] {
  switch (role) {
    case "PARTICIPANTE":
      return ["participante"];
    case "MENTOR":
      return ["mentor"];
    case "ADMIN":
      return ["admin"];
    case "DESENVOLVEDOR":
      return ["participante", "mentor", "admin"];
  }
}

export function homeFor(role: Role): string {
  return AREA_HOME[areasFor(role).at(-1)!];
}

export function isApprover(role: Role) {
  return role === "ADMIN" || role === "DESENVOLVEDOR";
}

/** Papéis que o ator pode conceder. Só Desenvolvedor concede Administrador/Desenvolvedor. */
export function grantableRoles(actor: Role): Role[] {
  if (actor === "DESENVOLVEDOR") return ["PARTICIPANTE", "MENTOR", "ADMIN", "DESENVOLVEDOR"];
  if (actor === "ADMIN") return ["PARTICIPANTE", "MENTOR"];
  return [];
}

type Person = { id: string; role: Role; status: UserStatus };

export type ManageCheck = { ok: true } | { ok: false; reason: string };

/**
 * Pode `actor` alterar a conta `target` (aprovar, rejeitar, mudar papel, desativar)?
 * `newRole` é o papel resultante quando a ação define um papel.
 */
export function canManage(actor: Person, target: Person, newRole?: Role): ManageCheck {
  if (actor.status !== "ATIVO" || !isApprover(actor.role))
    return { ok: false, reason: "Sua conta não tem permissão para gerenciar acessos." };
  if (actor.id === target.id)
    return { ok: false, reason: "Você não pode alterar a própria conta. Peça a outra pessoa autorizada." };
  if (actor.role === "ADMIN" && (target.role === "ADMIN" || target.role === "DESENVOLVEDOR"))
    return { ok: false, reason: "Somente um Desenvolvedor pode alterar contas de administração." };
  if (newRole && !grantableRoles(actor.role).includes(newRole))
    return { ok: false, reason: `Seu perfil não pode conceder o papel ${ROLE_LABEL[newRole]}.` };
  return { ok: true };
}

export function bootstrapEmails(): string[] {
  return (process.env.BOOTSTRAP_DEV_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}
