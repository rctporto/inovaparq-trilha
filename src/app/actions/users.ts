"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { audit } from "@/lib/audit";
import { requireArea } from "@/lib/session";
import { canManage, ROLE_LABEL, type Role } from "@/lib/roles";

export type ActionResult = { ok: boolean; message: string };

const roleSchema = z.enum(["PARTICIPANTE", "MENTOR", "ADMIN", "DESENVOLVEDOR"]);

async function loadPair(targetId: string) {
  const actor = await requireArea("admin");
  const target = await prisma.user.findUnique({ where: { id: targetId } });
  return { actor, target };
}

export async function approveUser(targetId: string, role: Role): Promise<ActionResult> {
  const parsedRole = roleSchema.safeParse(role);
  if (!parsedRole.success) return { ok: false, message: "Papel inválido." };
  const { actor, target } = await loadPair(targetId);
  if (!target) return { ok: false, message: "Conta não encontrada." };
  if (target.status === "ATIVO") return { ok: false, message: "Esta conta já está ativa." };
  const check = canManage(actor, target, parsedRole.data);
  if (!check.ok) return { ok: false, message: check.reason };

  // updateMany com a situação anterior evita aprovar duas vezes em cliques simultâneos.
  const res = await prisma.user.updateMany({
    where: { id: target.id, status: target.status },
    data: { status: "ATIVO", role: parsedRole.data, reviewedAt: new Date(), reviewedById: actor.id, statusReason: null },
  });
  if (res.count === 0) return { ok: false, message: "A conta foi alterada por outra pessoa. Atualize a página." };
  await audit("conta.aprovada", { actorId: actor.id, targetId: target.id, details: { role: parsedRole.data, from: target.status } });
  revalidatePath("/admin/usuarios");
  return { ok: true, message: `${target.name ?? target.email} aprovado(a) como ${ROLE_LABEL[parsedRole.data]}.` };
}

export async function rejectUser(targetId: string, reason: string): Promise<ActionResult> {
  const text = reason.trim().slice(0, 500);
  if (text.length < 3) return { ok: false, message: "Informe o motivo para registrar a decisão." };
  const { actor, target } = await loadPair(targetId);
  if (!target) return { ok: false, message: "Conta não encontrada." };
  if (target.status !== "PENDENTE") return { ok: false, message: "Só é possível recusar cadastros pendentes." };
  const check = canManage(actor, target);
  if (!check.ok) return { ok: false, message: check.reason };
  const res = await prisma.user.updateMany({
    where: { id: target.id, status: "PENDENTE" },
    data: { status: "REJEITADO", reviewedAt: new Date(), reviewedById: actor.id, statusReason: text },
  });
  if (res.count === 0) return { ok: false, message: "A conta foi alterada por outra pessoa. Atualize a página." };
  await audit("conta.recusada", { actorId: actor.id, targetId: target.id, details: { reason: text } });
  revalidatePath("/admin/usuarios");
  return { ok: true, message: "Cadastro recusado e registrado." };
}

export async function changeRole(targetId: string, role: Role): Promise<ActionResult> {
  const parsedRole = roleSchema.safeParse(role);
  if (!parsedRole.success) return { ok: false, message: "Papel inválido." };
  const { actor, target } = await loadPair(targetId);
  if (!target) return { ok: false, message: "Conta não encontrada." };
  if (target.status !== "ATIVO") return { ok: false, message: "Aprove ou reative a conta antes de mudar o papel." };
  if (target.role === parsedRole.data) return { ok: false, message: "A conta já tem este papel." };
  const check = canManage(actor, target, parsedRole.data);
  if (!check.ok) return { ok: false, message: check.reason };
  await prisma.user.update({ where: { id: target.id }, data: { role: parsedRole.data } });
  await audit("conta.papel_alterado", { actorId: actor.id, targetId: target.id, details: { from: target.role, to: parsedRole.data } });
  revalidatePath("/admin/usuarios");
  return { ok: true, message: `Papel alterado para ${ROLE_LABEL[parsedRole.data]}.` };
}

export async function setActive(targetId: string, active: boolean, reason = ""): Promise<ActionResult> {
  const { actor, target } = await loadPair(targetId);
  if (!target) return { ok: false, message: "Conta não encontrada." };
  const check = canManage(actor, target);
  if (!check.ok) return { ok: false, message: check.reason };
  if (active && target.status !== "INATIVO" && target.status !== "REJEITADO")
    return { ok: false, message: "A conta não está inativa." };
  if (!active && target.status !== "ATIVO") return { ok: false, message: "Só contas ativas podem ser desativadas." };
  await prisma.user.update({
    where: { id: target.id },
    data: { status: active ? "ATIVO" : "INATIVO", statusReason: active ? null : reason.trim().slice(0, 500) || null, reviewedAt: new Date(), reviewedById: actor.id },
  });
  await audit(active ? "conta.reativada" : "conta.desativada", { actorId: actor.id, targetId: target.id, details: { reason } });
  revalidatePath("/admin/usuarios");
  return { ok: true, message: active ? "Conta reativada." : "Conta desativada. A pessoa perde o acesso na próxima requisição." };
}
