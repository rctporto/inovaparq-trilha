import type { Metadata } from "next";
import Link from "next/link";
import { UserActions } from "@/components/admin/UserActions";
import { Avatar, DataTable, EmptyState, PageHead, StatusBadge, initialsOf } from "@/components/ui";
import { prisma } from "@/lib/db";
import { requireArea } from "@/lib/session";
import { canManage, grantableRoles, ROLE_LABEL, STATUS_LABEL, type UserStatus } from "@/lib/roles";

export const metadata: Metadata = { title: "Pessoas e permissões" };

const FILTERS = [
  { key: "pendentes", label: "Pendentes", where: { status: "PENDENTE" as UserStatus } },
  { key: "ativos", label: "Ativos", where: { status: "ATIVO" as UserStatus } },
  { key: "bloqueados", label: "Recusados e inativos", where: { status: { in: ["REJEITADO", "INATIVO"] as UserStatus[] } } },
  { key: "todos", label: "Todos", where: {} },
];

const STATUS_TONE = { PENDENTE: "gold", ATIVO: "green", REJEITADO: "red", INATIVO: "gray" } as const;
const fmt = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" });

const AUDIT_LABEL: Record<string, string> = {
  "conta.criada": "Cadastro criado",
  "conta.aprovada": "Cadastro aprovado",
  "conta.recusada": "Cadastro recusado",
  "conta.papel_alterado": "Papel alterado",
  "conta.desativada": "Conta desativada",
  "conta.reativada": "Conta reativada",
};

export default async function Usuarios({ searchParams }: { searchParams: Promise<{ filtro?: string }> }) {
  const actor = await requireArea("admin");
  const { filtro } = await searchParams;
  const counts = await prisma.user.groupBy({ by: ["status"], _count: true });
  const pendingCount = counts.find((c) => c.status === "PENDENTE")?._count ?? 0;
  const active = FILTERS.find((f) => f.key === filtro) ?? (pendingCount ? FILTERS[0] : FILTERS[1]);

  const [users, logs] = await Promise.all([
    prisma.user.findMany({
      where: active.where,
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      take: 200,
      select: { id: true, name: true, email: true, image: true, role: true, requestedRole: true, status: true, organization: true, signupNote: true, statusReason: true, createdAt: true, passwordHash: true, accounts: { select: { provider: true } } },
    }),
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 12, include: { actor: { select: { name: true, email: true } }, target: { select: { name: true, email: true } } } }),
  ]);
  const grantable = grantableRoles(actor.role);

  return (
    <>
      <PageHead eyebrow="Pessoas e permissões" title="Cada perfil, o acesso necessário." desc="Aprove cadastros, defina papéis e acompanhe quem pode acessar a plataforma." />
      <div className="toolbar">
        <nav className="tabs" aria-label="Filtrar contas">
          {FILTERS.map((f) => (
            <Link key={f.key} href={`/admin/usuarios?filtro=${f.key}`} className={f.key === active.key ? "active" : ""} aria-current={f.key === active.key ? "page" : undefined} style={{ padding: "9px 14px", borderRadius: 6, fontSize: 12, color: f.key === active.key ? "var(--ink)" : "var(--muted)", background: f.key === active.key ? "white" : "none" }}>
              {f.label}
              {f.key === "pendentes" && pendingCount > 0 ? ` (${pendingCount})` : ""}
            </Link>
          ))}
        </nav>
        <span className="tiny muted">Você é {ROLE_LABEL[actor.role]}: pode conceder {grantable.map((r) => ROLE_LABEL[r]).join(", ")}.</span>
      </div>
      <section className="card">
        <DataTable
          caption="Contas da plataforma"
          rows={users}
          rowKey={(u) => u.id}
          empty={<EmptyState icon="check" title={active.key === "pendentes" ? "Nenhum cadastro aguardando" : "Nenhuma conta neste filtro"} text={active.key === "pendentes" ? "Novos cadastros por e-mail ou Google aparecem aqui para aprovação." : "Tente outro filtro."} />}
          columns={[
            {
              header: "Pessoa",
              cell: (u) => (
                <div className="row">
                  <Avatar initials={initialsOf(u.name, u.email)} image={u.image} />
                  <div style={{ minWidth: 0 }}>
                    <b>{u.name ?? "Sem nome"}</b>
                    <div className="tiny muted" style={{ wordBreak: "break-all" }}>{u.email}</div>
                    {u.organization && <div className="tiny muted">{u.organization}</div>}
                  </div>
                </div>
              ),
            },
            {
              header: "Acesso via",
              cell: (u) => (
                <span className="tiny">
                  {[u.accounts.some((a) => a.provider === "google") && "Google", u.passwordHash && "E-mail e senha"].filter(Boolean).join(" · ") || "—"}
                </span>
              ),
            },
            {
              header: "Perfil",
              cell: (u) =>
                u.status === "PENDENTE" ? (
                  <span className="tiny">Solicitou: <b>{ROLE_LABEL[u.requestedRole]}</b>{u.signupNote && <span className="muted" style={{ display: "block", maxWidth: 260 }}>“{u.signupNote}”</span>}</span>
                ) : (
                  <StatusBadge tone={u.role === "ADMIN" || u.role === "DESENVOLVEDOR" ? "plum" : "teal"}>{ROLE_LABEL[u.role]}</StatusBadge>
                ),
            },
            {
              header: "Situação",
              cell: (u) => (
                <>
                  <StatusBadge tone={STATUS_TONE[u.status]}>{STATUS_LABEL[u.status]}</StatusBadge>
                  <div className="tiny muted" style={{ marginTop: 4 }}>{fmt.format(u.createdAt)}</div>
                  {u.statusReason && u.status !== "ATIVO" && <div className="tiny muted">{u.statusReason}</div>}
                </>
              ),
            },
            {
              header: "Ações",
              cell: (u) => {
                const check = canManage(actor, u);
                return <UserActions user={u} grantable={grantable} canEdit={check.ok} blockedReason={check.ok ? undefined : u.id === actor.id ? "Sua conta" : "Requer Desenvolvedor"} />;
              },
            },
          ]}
        />
      </section>
      <div className="grid wide mt">
        <section className="card">
          <h2>Registro de auditoria</h2>
          <p className="tiny muted">Últimas ações sobre contas. O registro não pode ser editado pela interface.</p>
          {logs.length ? (
            <div className="timeline">
              {logs.map((l) => (
                <div className="timeline-item" key={l.id}>
                  <strong>{AUDIT_LABEL[l.action] ?? l.action} · {l.target?.name ?? l.target?.email ?? "conta removida"}</strong>
                  <span className="muted">{fmt.format(l.createdAt)} · por {l.actor ? l.actor.name ?? l.actor.email : "sistema/autocadastro"}</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="Sem registros" text="As ações de cadastro e aprovação aparecerão aqui." />
          )}
        </section>
        <aside className="stack">
          <div className="card"><h3>Participante</h3><p className="sub">Acessa sua jornada e projetos de que faz parte.</p></div>
          <div className="card"><h3>Mentor / avaliador</h3><p className="sub">Acessa apenas projetos e entregas atribuídos.</p></div>
          <div className="card"><h3>Administrador</h3><p className="sub">Aprova cadastros e concede papéis de Participante e Mentor.</p></div>
          <div className="card"><h3>Desenvolvedor</h3><p className="sub">Acesso técnico a todas as áreas. Único papel que concede Administrador ou Desenvolvedor.</p></div>
        </aside>
      </div>
    </>
  );
}
