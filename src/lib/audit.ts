import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export async function audit(
  action: string,
  opts: { actorId?: string | null; targetId?: string | null; details?: Prisma.InputJsonValue } = {},
) {
  await prisma.auditLog.create({
    data: { action, actorId: opts.actorId ?? null, targetId: opts.targetId ?? null, details: opts.details },
  });
}
