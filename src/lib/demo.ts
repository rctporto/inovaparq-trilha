// Dados DEMONSTRATIVOS da etapa 1 (copiados do protótipo navegável).
// Serão substituídos por consultas ao banco nas etapas 3 a 7. Não usar em regras de negócio.
import type { PhaseState } from "@/components/ui";

export const PHASES: { name: string; theme: string; state: PhaseState }[] = [
  { name: "Explorador", theme: "Mentalidade empreendedora", state: "done" },
  { name: "Investigador", theme: "Problema e cliente", state: "done" },
  { name: "Estrategista", theme: "Mercado e oportunidade", state: "done" },
  { name: "Criador", theme: "Concepção da inovação", state: "current" },
  { name: "Arquiteto", theme: "Modelo de negócio", state: "locked" },
  { name: "Construtor", theme: "Protótipo e experimentação", state: "locked" },
  { name: "Negociador", theme: "Entrada no mercado", state: "locked" },
  { name: "Gestor", theme: "Operação e equipe", state: "locked" },
  { name: "Articulador", theme: "Recursos e parcerias", state: "locked" },
  { name: "Líder", theme: "Crescimento e evolução", state: "locked" },
];

export const CURRENT_PHASE = 4;

export const MENTORS = [
  { initials: "MS", name: "Marina Silva", area: "Inovação e descoberta", skills: "Modelagem de negócios • Design Thinking", tone: "teal" as const },
  { initials: "RC", name: "Rafael Costa", area: "Prototipagem e tecnologia", skills: "Testes de hipóteses • Desenvolvimento de produto", tone: undefined },
  { initials: "LF", name: "Luiza Fernandes", area: "Gestão e mercado", skills: "Finanças • Vendas consultivas • Estratégia", tone: "gold" as const },
];

export const RUBRIC = [
  { key: "evidencias", label: "Evidências", fullLabel: "Qualidade das evidências", max: 30, demo: 25, icon: "search" as const },
  { key: "metodo", label: "Método", fullLabel: "Adequação do método", max: 25, demo: 21, icon: "target" as const },
  { key: "coerencia", label: "Coerência da decisão", fullLabel: "Coerência da decisão", max: 20, demo: 17, icon: "flag" as const },
  { key: "aprendizado", label: "Aprendizado e revisão", fullLabel: "Aprendizado e revisão", max: 15, demo: 11, icon: "spark" as const },
  { key: "clareza", label: "Clareza", fullLabel: "Clareza da comunicação", max: 10, demo: 8, icon: "chat" as const },
];
