"use client";

import { useState } from "react";
import { useGate } from "@/lib/session";
import { CLAIM_STATUSES, setClaimStatus, setUserStatus, useParticipants, type Participant } from "@/lib/adminData";
import { computeProgress } from "@/lib/progress";
import { displayName } from "@/lib/types";
import { phases, rewards } from "@/content/trilha";
import { Avatar } from "@/components/Avatar";
import { Loading } from "@/components/Loading";

type Tab = "solicitacoes" | "participantes" | "bonificacoes";

const fmt = (d: Date) => d.toLocaleDateString("pt-BR");
const kind = (p: Participant) => (p.accountType === "pj" ? "Empresa" : "Pessoa");

export default function AdminPage() {
  const s = useGate("/admin/");
  const { participants, error } = useParticipants();
  const [tab, setTab] = useState<Tab>("solicitacoes");
  const [busy, setBusy] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  if (!s) return <Loading />;
  if (error) return <p className="error">{error}</p>;
  if (!participants) return <Loading />;

  const pending = participants.filter((p) => p.status === "pendente");
  const approved = participants.filter((p) => p.status === "aprovado");
  const refused = participants.filter((p) => p.status === "recusado");
  const claims = participants
    .flatMap((p) => p.claims.map((c) => ({ ...c, participant: p })))
    .sort((a, b) => b.claimedAt.getTime() - a.claimedAt.getTime());
  const openClaims = claims.filter((c) => c.status !== "concluído").length;

  async function run(key: string, fn: () => Promise<void>) {
    setBusy(key);
    setActionError(null);
    try {
      await fn();
    } catch {
      setActionError("Não foi possível salvar a alteração. Tente de novo.");
    }
    setBusy(null);
  }

  return (
    <div className="stack">
      <h1>Painel do Inovaparq</h1>
      <div className="tabs" role="toolbar">
        <button aria-pressed={tab === "solicitacoes"} onClick={() => setTab("solicitacoes")}>
          Solicitações de cadastro{pending.length > 0 && <span className="badge">{pending.length}</span>}
        </button>
        <button aria-pressed={tab === "participantes"} onClick={() => setTab("participantes")}>
          Participantes ({approved.length})
        </button>
        <button aria-pressed={tab === "bonificacoes"} onClick={() => setTab("bonificacoes")}>
          Bonificações{openClaims > 0 && <span className="badge">{openClaims}</span>}
        </button>
      </div>
      {actionError && <p className="error">{actionError}</p>}

      {tab === "solicitacoes" && (
        <div className="card stack">
          <h2>Aguardando aprovação</h2>
          {pending.length === 0 ? (
            <p className="muted">Nenhuma solicitação pendente.</p>
          ) : (
            <ul className="admin-list">
              {pending.map((p) => (
                <li key={p.uid}>
                  <Avatar profile={p} size={44} />
                  <div className="who">
                    <strong>{displayName(p)}</strong> <span className="tag">{kind(p)}</span>
                    <div className="muted">
                      {p.accountType === "pj" && <>Responsável: {p.name} · </>}
                      {p.email} · pediu em {fmt(p.createdAt)}
                    </div>
                  </div>
                  <div className="actions">
                    <button className="btn btn-sm" disabled={busy === p.uid}
                      onClick={() => run(p.uid, () => setUserStatus(p.uid, "aprovado"))}>Aprovar</button>
                    <button className="btn btn-sm btn-danger" disabled={busy === p.uid}
                      onClick={() => run(p.uid, () => setUserStatus(p.uid, "recusado"))}>Recusar</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {refused.length > 0 && (
            <>
              <h3>Recusados</h3>
              <ul className="admin-list">
                {refused.map((p) => (
                  <li key={p.uid}>
                    <div className="who">
                      <strong>{displayName(p)}</strong> <span className="muted">{p.email}</span>
                    </div>
                    <button className="btn btn-sm btn-ghost" disabled={busy === p.uid}
                      onClick={() => run(p.uid, () => setUserStatus(p.uid, "aprovado"))}>Aprovar mesmo assim</button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {tab === "participantes" && (
        <div className="card">
          {approved.length === 0 ? (
            <p className="muted">Ninguém aprovado ainda.</p>
          ) : (
            <ul className="admin-list">
              {approved.map((p) => {
                const { xp, level, phaseStates } = computeProgress(p.completions, p.claims);
                const current = phaseStates.find((x) => x.state === "current");
                return (
                  <li key={p.uid}>
                    <Avatar profile={p} size={44} />
                    <div className="who">
                      <strong>{displayName(p)}</strong> <span className="tag">{kind(p)}</span>
                      <div className="muted">{p.email}</div>
                    </div>
                    <div style={{ minWidth: 220 }}>
                      <div>Nível {level.level} · {level.name} · {xp} XP</div>
                      <div className="muted">
                        <span className="minibar"><div style={{ width: `${(p.completions.length / phases.length) * 100}%` }} /></span>{" "}
                        {p.completions.length}/{phases.length} fases{current ? ` · agora em "${current.title}"` : " · trilha concluída"}
                      </div>
                    </div>
                    <button className="btn btn-sm btn-ghost" disabled={busy === p.uid}
                      onClick={() => {
                        if (confirm(`Suspender o acesso de ${displayName(p)}? O progresso fica guardado.`)) {
                          run(p.uid, () => setUserStatus(p.uid, "pendente"));
                        }
                      }}>Suspender</button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {tab === "bonificacoes" && (
        <div className="card">
          {claims.length === 0 ? (
            <p className="muted">Nenhuma bonificação solicitada ainda.</p>
          ) : (
            <ul className="admin-list">
              {claims.map((c) => (
                <li key={c.participant.uid + c.rewardId}>
                  <div className="who">
                    <strong>{rewards.find((r) => r.id === c.rewardId)?.title ?? c.rewardId}</strong>
                    <div className="muted">
                      {displayName(c.participant)} · {c.participant.email} · pedido em {fmt(c.claimedAt)}
                    </div>
                  </div>
                  <label style={{ fontWeight: 400 }}>
                    <select value={c.status} disabled={busy === c.participant.uid + c.rewardId}
                      className={`tag status-${c.status === "concluído" ? "aprovado" : c.status === "agendado" ? "aprovado" : "pendente"}`}
                      onChange={(e) => run(c.participant.uid + c.rewardId,
                        () => setClaimStatus(c.participant.uid, c.rewardId, e.target.value as (typeof CLAIM_STATUSES)[number]))}>
                      {CLAIM_STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
