"use client";

import { useState } from "react";
import Link from "next/link";
import { resizeImage, updateProfile, useRequireSession } from "@/lib/session";
import { computeProgress } from "@/lib/progress";
import { displayName } from "@/lib/types";
import { phases } from "@/content/trilha";
import { Avatar } from "@/components/Avatar";
import { LevelBar } from "@/components/LevelBar";
import { Loading } from "@/components/Loading";

export default function PerfilPage() {
  const s = useRequireSession();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok?: string; error?: string }>({});
  const [pending, setPending] = useState(false);
  if (!s) return <Loading />;
  const { profile } = s;
  const { xp, level, next, rewardStates } = computeProgress(s.completions, s.claims);
  const isCompany = profile.accountType === "pj";

  async function onFile(file: File | undefined) {
    setMsg({});
    if (!file) return setAvatar(null);
    if (!file.type.startsWith("image/")) return setMsg({ error: "Envie uma imagem (JPG, PNG ou WEBP)." });
    try {
      setAvatar(await resizeImage(file));
    } catch {
      setMsg({ error: "Não foi possível ler essa imagem. Tente outra." });
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    const companyName = String(f.get("companyName") ?? "").trim();
    const bio = String(f.get("bio") ?? "").trim().slice(0, 500);
    if (!name) return setMsg({ error: "O nome não pode ficar vazio." });
    if (isCompany && !companyName) return setMsg({ error: "Informe o nome da empresa." });
    setPending(true);
    try {
      await updateProfile(profile.uid, {
        name,
        companyName: isCompany ? companyName : null,
        bio: bio || null,
        ...(avatar ? { avatar } : {}),
      });
      setAvatar(null);
      setMsg({ ok: "Perfil atualizado." });
    } catch {
      setMsg({ error: "Não foi possível salvar. Tente de novo." });
    }
    setPending(false);
  }

  return (
    <div className="stack">
      <div className="card stack">
        <div className="profile-head">
          <Avatar profile={profile} size={112} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <span className="tag">{isCompany ? "Empresa" : "Pessoa"}</span>
            <h1 style={{ marginTop: 8 }}>{displayName(profile)}</h1>
            {isCompany && <p className="muted" style={{ margin: 0 }}>Responsável: {profile.name}</p>}
            <p className="muted" style={{ margin: 0 }}>
              {profile.email} · na trilha desde {profile.createdAt.toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>
        {profile.bio && <p>{profile.bio}</p>}
        <div className="stats">
          <div className="stat"><strong>{s.completions.length}/{phases.length}</strong>fases concluídas</div>
          <div className="stat"><strong>{xp}</strong>XP acumulado</div>
          <div className="stat"><strong>{level.level}</strong>{level.name}</div>
          <div className="stat"><strong>{rewardStates.filter((r) => r.unlocked).length}</strong>bonificações liberadas</div>
        </div>
        <p><Link href="/historico/">Ver histórico completo →</Link></p>
      </div>
      <LevelBar xp={xp} level={level} next={next} />
      <form onSubmit={onSubmit} className="card stack">
        <h2>Editar perfil</h2>
        <label>
          {isCompany ? "Logo da empresa" : "Foto de perfil"}
          <input type="file" name="avatar" accept="image/png,image/jpeg,image/webp" style={{ display: "block", marginTop: 6 }}
            onChange={(e) => onFile(e.target.files?.[0])} />
          <small className="muted">JPG, PNG ou WEBP. A imagem é recortada em quadrado.</small>
        </label>
        {avatar && <img src={avatar} alt="Pré-visualização" className="avatar" style={{ width: 96, height: 96 }} />}
        {isCompany && (
          <label>Nome da empresa<input type="text" name="companyName" defaultValue={profile.companyName ?? ""} required /></label>
        )}
        <label>{isCompany ? "Nome do responsável" : "Nome"}<input type="text" name="name" defaultValue={profile.name} required /></label>
        <label>
          {isCompany ? "Sobre a empresa" : "Sobre você"}
          <textarea name="bio" maxLength={500} defaultValue={profile.bio ?? ""}
            placeholder="Conte um pouco sobre o que você faz ou o projeto que está desenvolvendo." />
        </label>
        {msg.error && <p className="error">{msg.error}</p>}
        {msg.ok && <p style={{ color: "var(--brand-primary-dark)", fontWeight: 600 }}>{msg.ok}</p>}
        <div><button className="btn" disabled={pending}>{pending ? "Salvando…" : "Salvar"}</button></div>
      </form>
    </div>
  );
}
