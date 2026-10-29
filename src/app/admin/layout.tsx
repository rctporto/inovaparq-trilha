import { AppShell } from "@/components/shell/AppShell";
import { prisma } from "@/lib/db";
import { requireArea } from "@/lib/session";
import { areasFor } from "@/lib/roles";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireArea("admin");
  const pendingCount = await prisma.user.count({ where: { status: "PENDENTE" } });
  return (
    <AppShell area="admin" areas={areasFor(user.role)} user={user} pendingCount={pendingCount}>
      {children}
    </AppShell>
  );
}
