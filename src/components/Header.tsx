"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout, useSession } from "@/lib/session";
import { displayName } from "@/lib/types";
import { Avatar } from "./Avatar";

export function Header() {
  const { profile, isAdmin, user } = useSession();
  const router = useRouter();
  const approved = profile?.status === "aprovado";
  if (!isAdmin && !approved) return null;

  const sair = (
    <button type="button" onClick={async () => { await logout(); router.replace("/"); }}>Sair</button>
  );

  return (
    <header className="header">
      <div className="header-inner">
        <Link href={isAdmin ? "/admin/" : "/trilha/"}>
          <img src="/brand/inovaparq-logo.png" alt="Inovaparq" height={32} style={{ display: "block" }} />
        </Link>
        {isAdmin ? (
          <nav>
            <Link href="/admin/">Painel do Inovaparq</Link>
            <span style={{ opacity: 0.7 }}>{user?.email}</span>
            {sair}
          </nav>
        ) : (
          <nav>
            <Link href="/trilha/">Trilha</Link>
            <Link href="/recompensas/">Recompensas</Link>
            <Link href="/historico/">Histórico</Link>
            <Link href="/perfil/" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar profile={profile!} size={32} />
              {displayName(profile!).split(" ")[0]}
            </Link>
            {sair}
          </nav>
        )}
      </div>
    </header>
  );
}
