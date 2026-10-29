"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout, useSession } from "@/lib/session";
import { displayName } from "@/lib/types";
import { Avatar } from "./Avatar";

export function Header() {
  const { profile } = useSession();
  const router = useRouter();
  if (!profile) return null;
  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/trilha/">
          <img src="/brand/inovaparq-logo.png" alt="Inovaparq" height={32} style={{ display: "block" }} />
        </Link>
        <nav>
          <Link href="/trilha/">Trilha</Link>
          <Link href="/recompensas/">Recompensas</Link>
          <Link href="/historico/">Histórico</Link>
          <Link href="/perfil/" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Avatar profile={profile} size={32} />
            {displayName(profile).split(" ")[0]}
          </Link>
          <button type="button" onClick={async () => { await logout(); router.replace("/"); }}>Sair</button>
        </nav>
      </div>
    </header>
  );
}
