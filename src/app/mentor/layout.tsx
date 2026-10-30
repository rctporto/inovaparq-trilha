import { AppShell } from "@/components/shell/AppShell";
import { requireArea } from "@/lib/session";
import { areasFor } from "@/lib/roles";

export const dynamic = "force-dynamic";

export default async function MentorLayout({ children }: { children: React.ReactNode }) {
  const user = await requireArea("mentor");
  return (
    <AppShell area="mentor" areas={areasFor(user.role)} user={user}>
      {children}
    </AppShell>
  );
}
