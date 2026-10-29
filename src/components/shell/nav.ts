import type { IconName } from "@/components/ui/Icon";
import type { Area } from "@/lib/roles";

export type NavItem = { href: string; label: string; icon: IconName; badgeKey?: "pending" };

export const NAV: Record<Area, { title: string; items: NavItem[] }> = {
  participante: {
    title: "Seu espaço",
    items: [
      { href: "/inicio", label: "Visão geral", icon: "home" },
      { href: "/jornada", label: "Minha jornada", icon: "route" },
      { href: "/jogos", label: "Jogos", icon: "spark" },
      { href: "/projeto", label: "Meu projeto", icon: "flag" },
      { href: "/recompensas", label: "Recompensas", icon: "gift" },
      { href: "/mentores", label: "Mentorias", icon: "people" },
      { href: "/comunidade", label: "Comunidade", icon: "chat" },
      { href: "/portfolio", label: "Meu portfólio", icon: "award" },
    ],
  },
  mentor: {
    title: "Área de mentoria",
    items: [
      { href: "/mentor", label: "Visão geral", icon: "home" },
      { href: "/mentor/avaliar", label: "Avaliar entregas", icon: "file" },
      { href: "/mentor/agenda", label: "Minha agenda", icon: "calendar" },
      { href: "/mentor/comunidade", label: "Comunidade", icon: "chat" },
    ],
  },
  admin: {
    title: "Administração",
    items: [
      { href: "/admin", label: "Visão geral", icon: "chart" },
      { href: "/admin/turmas", label: "Turmas e projetos", icon: "people" },
      { href: "/admin/conteudos", label: "Trilhas e conteúdos", icon: "book" },
      { href: "/admin/beneficios", label: "Benefícios", icon: "gift" },
      { href: "/admin/usuarios", label: "Pessoas e acessos", icon: "shield", badgeKey: "pending" },
      { href: "/admin/configuracoes", label: "Configurações", icon: "settings" },
    ],
  },
};

export const AREA_LABEL: Record<Area, string> = { participante: "Participante", mentor: "Mentor", admin: "Administração" };

/** Título da página para o breadcrumb (rotas dinâmicas caem no item-pai). */
export function crumbFor(area: Area, path: string) {
  const items = NAV[area].items;
  const exact = items.find((i) => i.href === path);
  if (exact) return exact.label;
  const extra: Record<string, string> = {
    "/diagnostico": "Diagnóstico inicial",
    "/aula": "Ambiente de aprendizagem",
    "/missao": "Missão e evidências",
    "/verificacao": "Avaliação de conhecimentos",
    "/agendamento": "Agendamento de mentoria",
  };
  if (extra[path]) return extra[path];
  if (path.startsWith("/fase/")) return "Detalhe da fase";
  const parent = [...items].sort((a, b) => b.href.length - a.href.length).find((i) => path.startsWith(i.href + "/"));
  return parent?.label ?? "";
}
