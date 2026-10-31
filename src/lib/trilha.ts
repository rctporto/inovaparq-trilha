// Estrutura da trilha principal (nomes e temas das fases e rubrica das missões).
// O progresso de cada pessoa ainda não é gravado no banco: até a etapa 3, todos começam na fase 1,
// sem XP, missões, avaliações ou comentários.
import type { PhaseState } from "@/components/ui";

const PHASE_LIST = [
  { name: "Explorador", theme: "Mentalidade empreendedora" },
  { name: "Investigador", theme: "Problema e cliente" },
  { name: "Estrategista", theme: "Mercado e oportunidade" },
  { name: "Criador", theme: "Concepção da inovação" },
  { name: "Arquiteto", theme: "Modelo de negócio" },
  { name: "Construtor", theme: "Protótipo e experimentação" },
  { name: "Negociador", theme: "Entrada no mercado" },
  { name: "Gestor", theme: "Operação e equipe" },
  { name: "Articulador", theme: "Recursos e parcerias" },
  { name: "Líder", theme: "Crescimento e evolução" },
];

export const CURRENT_PHASE = 1;

export const PHASES: { name: string; theme: string; state: PhaseState }[] = PHASE_LIST.map((p, i) => ({
  ...p,
  state: i + 1 < CURRENT_PHASE ? "done" : i + 1 === CURRENT_PHASE ? "current" : "locked",
}));

export const RUBRIC = [
  { key: "evidencias", label: "Evidências", fullLabel: "Qualidade das evidências", max: 30, icon: "search" as const },
  { key: "metodo", label: "Método", fullLabel: "Adequação do método", max: 25, icon: "target" as const },
  { key: "coerencia", label: "Coerência da decisão", fullLabel: "Coerência da decisão", max: 20, icon: "flag" as const },
  { key: "aprendizado", label: "Aprendizado e revisão", fullLabel: "Aprendizado e revisão", max: 15, icon: "spark" as const },
  { key: "clareza", label: "Clareza", fullLabel: "Clareza da comunicação", max: 10, icon: "chat" as const },
];
