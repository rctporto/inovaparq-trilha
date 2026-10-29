"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { logout } from "@/app/actions/auth";
import { Avatar, initialsOf } from "@/components/ui";
import { Brand } from "@/components/ui/Brand";
import { Dialog } from "@/components/ui/Dialog";
import { Icon } from "@/components/ui/Icon";
import { AREA_HOME, ROLE_LABEL, type Area, type Role } from "@/lib/roles";
import { AREA_LABEL, NAV, crumbFor } from "./nav";

type ShellUser = { name: string | null; email: string; image: string | null; role: Role };

export function AppShell({ area, areas, user, pendingCount = 0, children }: { area: Area; areas: Area[]; user: ShellUser; pendingCount?: number; children: ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);
  const nav = NAV[area];

  useEffect(() => {
    setMenuOpen(false);
    setUserOpen(false);
  }, [path]);

  useEffect(() => {
    if (!userOpen) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !userRef.current?.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [userOpen]);

  const isActive = (href: string) => path === href || (href !== AREA_HOME[area] && path.startsWith(href + "/"));

  return (
    <>
      <aside className={`sidebar ${menuOpen ? "open" : ""}`} id="sidebar" aria-label="Navegação principal">
        <Link href={AREA_HOME[area]} aria-label="Inovaparq · início">
          <Brand />
        </Link>
        <div className="brand-note" style={{ marginTop: 8 }}>
          Jornada empreendedora
        </div>
        <div className="navlabel">{nav.title}</div>
        <nav>
          {nav.items.map((i) => (
            <Link key={i.href} href={i.href} className={`navlink ${isActive(i.href) ? "active" : ""}`} aria-current={isActive(i.href) ? "page" : undefined}>
              <Icon name={i.icon} />
              {i.label}
              {i.badgeKey === "pending" && pendingCount > 0 && (
                <span className="count-dot" aria-label={`${pendingCount} cadastros pendentes`}>
                  {pendingCount}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <b>Inovação que se constrói.</b>
          <br />
          Um passo de cada vez.
          <br />
          <span style={{ fontSize: 9 }}>Versão 0.1 · etapa 1</span>
        </div>
      </aside>
      <div className="sidebar-shade" onClick={() => setMenuOpen(false)} />
      <header className="topbar">
        <button className="iconbtn mobile-menu" onClick={() => setMenuOpen((o) => !o)} aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen} aria-controls="sidebar">
          <Icon name={menuOpen ? "x" : "menu"} />
        </button>
        <span className="crumb">
          Jornada empreendedora &nbsp; / &nbsp; <b>{crumbFor(area, path)}</b>
        </span>
        <div className="topright">
          {areas.length > 1 && (
            <select className="role-select" aria-label="Trocar de área" value={area} onChange={(e) => router.push(AREA_HOME[e.target.value as Area])}>
              {areas.map((a) => (
                <option key={a} value={a}>
                  {AREA_LABEL[a]}
                </option>
              ))}
            </select>
          )}
          <button className="iconbtn" aria-label="Notificações" onClick={() => setNotesOpen(true)}>
            <Icon name="bell" />
          </button>
          <div className="user-chip" ref={userRef}>
            <button className="avatar-button" style={{ background: "none", padding: 0, borderRadius: "50%" }} aria-haspopup="menu" aria-expanded={userOpen} aria-label="Menu da conta" onClick={() => setUserOpen((o) => !o)}>
              <Avatar initials={initialsOf(user.name, user.email)} image={user.image} />
            </button>
            {userOpen && (
              <div className="user-menu" role="menu">
                <div className="who">
                  <b>{user.name ?? "Sem nome"}</b>
                  <span>{user.email}</span>
                  <div style={{ marginTop: 8 }}>
                    <span className="tag plum">{ROLE_LABEL[user.role]}</span>
                  </div>
                </div>
                <form action={logout}>
                  <button type="submit" role="menuitem">
                    <Icon name="logout" />
                    Sair
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="main" id="conteudo">
        {children}
      </main>
      <Dialog open={notesOpen} onClose={() => setNotesOpen(false)} title="Notificações">
        <p>Você não tem notificações. Avisos de avaliações, mentorias e benefícios serão exibidos aqui nas próximas etapas.</p>
      </Dialog>
    </>
  );
}
