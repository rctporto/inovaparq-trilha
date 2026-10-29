// Catálogo dos jogos de aprendizagem. Compartilhado entre servidor (validação) e cliente (vitrine).
import type { IconName } from "@/components/ui/Icon";

export type GameId = "fato-ou-suposicao" | "memoria-do-canvas" | "monte-o-experimento" | "mesa-de-negociacao" | "folego-de-caixa";

export type GameInfo = {
  id: GameId;
  phase: number;
  phaseName: string;
  title: string;
  mechanic: string;
  pitch: string;
  learns: string[];
  minutes: number;
  maxScore: number;
  icon: IconName;
};

export const GAMES: GameInfo[] = [
  {
    id: "fato-ou-suposicao",
    phase: 2,
    phaseName: "Investigador",
    title: "Fato ou suposição?",
    mechanic: "Classificação contra o relógio",
    pitch: "Separe evidências de achismos antes que o tempo acabe. Acertos seguidos rendem combo.",
    learns: ["Diferenciar dado observado de opinião", "Reconhecer vieses comuns em entrevistas", "Valorizar números com contexto"],
    minutes: 2,
    maxScore: 170,
    icon: "search",
  },
  {
    id: "memoria-do-canvas",
    phase: 5,
    phaseName: "Arquiteto",
    title: "Memória do Canvas",
    mechanic: "Jogo da memória",
    pitch: "Encontre os pares entre cada bloco do Canvas de Modelo de Negócio e um exemplo real.",
    learns: ["Os nove blocos do Business Model Canvas", "Exemplos concretos de cada bloco", "Como os blocos se conectam"],
    minutes: 3,
    maxScore: 100,
    icon: "chart",
  },
  {
    id: "monte-o-experimento",
    phase: 6,
    phaseName: "Construtor",
    title: "Monte o experimento",
    mechanic: "Ordenação de etapas",
    pitch: "Coloque as etapas de um bom experimento na ordem certa. Você tem três tentativas.",
    learns: ["Definir critério de sucesso antes de testar", "Escolher o teste mais barato que gera evidência", "Decidir com base no resultado"],
    minutes: 2,
    maxScore: 100,
    icon: "target",
  },
  {
    id: "mesa-de-negociacao",
    phase: 7,
    phaseName: "Negociador",
    title: "Mesa de negociação",
    mechanic: "Diálogo com escolhas",
    pitch: "Negocie com uma rede de 12 restaurantes. Cada resposta muda o valor do contrato e a confiança do cliente.",
    learns: ["Perguntar antes de dar preço", "Trocar concessões por contrapartidas", "Reduzir risco com pilotos e próximos passos claros"],
    minutes: 4,
    maxScore: 100,
    icon: "chat",
  },
  {
    id: "folego-de-caixa",
    phase: 8,
    phaseName: "Gestor",
    title: "Fôlego de caixa",
    mechanic: "Simulação de gestão",
    pitch: "Conduza a startup por seis meses. Cada decisão mexe no caixa, nos clientes e na energia da equipe.",
    learns: ["Queima de caixa e meses de fôlego (runway)", "Custo fixo x receita recorrente", "Equilibrar crescimento e saúde da equipe"],
    minutes: 5,
    maxScore: 100,
    icon: "clock",
  },
];

export const gameById = (id: string) => GAMES.find((g) => g.id === id);

/** Estrelas calculadas pelo servidor a partir da pontuação. */
export function starsFor(score: number, maxScore: number) {
  const pct = maxScore > 0 ? score / maxScore : 0;
  return pct >= 0.9 ? 3 : pct >= 0.65 ? 2 : pct >= 0.35 ? 1 : 0;
}
