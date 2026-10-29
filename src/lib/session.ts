import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { areasFor, homeFor, type Area } from "@/lib/roles";

/** Usuário da sessão, sempre relido do banco (papel e situação nunca vêm do cliente). */
export const getCurrentUser = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) return null;
  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, image: true, role: true, status: true, statusReason: true },
  });
});

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

/** Exige conta ativa. Pendentes vão para a tela de espera; bloqueadas para acesso negado. */
export async function requireActiveUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/?sessao=expirada");
  if (user.status === "PENDENTE") redirect("/aguardando-aprovacao");
  if (user.status !== "ATIVO") redirect("/acesso-negado?motivo=conta");
  return user;
}

export async function requireArea(area: Area): Promise<CurrentUser> {
  const user = await requireActiveUser();
  if (!areasFor(user.role).includes(area)) redirect("/acesso-negado?motivo=perfil");
  return user;
}

/** Destino após o login, conforme situação e papel. */
export async function landingPath(): Promise<string> {
  const user = await getCurrentUser();
  if (!user) return "/";
  if (user.status === "PENDENTE") return "/aguardando-aprovacao";
  if (user.status !== "ATIVO") return "/acesso-negado?motivo=conta";
  return homeFor(user.role);
}
