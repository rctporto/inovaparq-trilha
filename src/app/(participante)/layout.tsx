import { AppShell } from "@/components/shell/AppShell";
import { requireArea } from "@/lib/session";
import { areasFor } from "@/lib/roles";

export const dynamic = "force-dynamic";

export default async function ParticipanteLayout({ children }: { children: React.ReactNode }) {
  const user = await requireArea("participante");
  return (
    <AppShell area="participante" areas={areasFor(user.role)} user={user}>
      {children}
    </AppShell>
  );
}
