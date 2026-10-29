// Trilha de Inovação Inovaparq, baseada no Manual do Sistema de Incubação de Empresas do Inovaparq
// (metodologia Lean Startup + Desenvolvimento de Clientes + Design Thinking).
// Cada fase é uma casa do tabuleiro; cada bloco termina liberando uma bonificação.
// As bonificações e textos de apoio são uma PROPOSTA e devem ser confirmados pela gestão do Inovaparq.

export type Question = { prompt: string; options: string[]; answer: number };
export type Lesson = { title: string; body: string; items?: string[] };
export type Phase = {
  id: string;
  block: string;
  title: string;
  summary: string;
  xp: number;
  lessons: Lesson[];
  deliverables: string[];
  quiz: Question[];
};

export const blocks = ["Pré-incubação", "Incubação · Implantação", "Incubação · Crescimento", "Consolidação e Graduação"];

export const phases: Phase[] = [
  {
    id: "boas-vindas",
    block: blocks[0],
    title: "Bem-vindo ao Inovaparq",
    summary: "Conheça o parque, as incubadoras e como funciona a jornada de incubação.",
    xp: 100,
    lessons: [
      {
        title: "As incubadoras",
        body: "O sistema de incubação do Inovaparq é focado na interação com o Parque Tecnológico, na inovação aberta, na busca por talentos e na criação de novas startups. Ele é formado por três incubadoras:",
        items: [
          "CENTRA: inovação aberta e criação de startups de base tecnológica.",
          "CAUSE: negócios que geram impacto positivo na sociedade e no meio ambiente.",
          "CRIA-TE: empreendedorismo em todos os âmbitos, incluindo negócios tradicionais.",
        ],
      },
      {
        title: "Programas e modalidades",
        body: "A jornada começa no Programa de Desenvolvimento do Empreendedorismo e Criação de Startups (pré-incubação, 6 meses) e segue no Programa de Incubação de Empresas (24 meses). Na incubação, a empresa pode ser:",
        items: [
          "Residente: desenvolve suas atividades no espaço da incubadora.",
          "Não-residente: atua fora do espaço físico, mas usa os espaços comuns e os serviços do Inovaparq.",
        ],
      },
      {
        title: "A metodologia",
        body: "A metodologia combina Lean Startup, Processo de Desenvolvimento de Clientes e Design Thinking, e trabalha os 5 eixos do empreendimento definidos pela ANPROTEC: empreendedor, mercado, tecnologia, gestão e capital.",
      },
    ],
    deliverables: ["Leitura do Manual do Incubado"],
    quiz: [
      { prompt: "Qual incubadora do Inovaparq apoia negócios de impacto social e ambiental?", options: ["CENTRA", "CAUSE", "CRIA-TE"], answer: 1 },
      { prompt: "Quanto tempo dura a pré-incubação?", options: ["6 meses", "12 meses", "24 meses"], answer: 0 },
      { prompt: "Quais são os 5 eixos do empreendimento segundo a ANPROTEC?", options: ["Produto, preço, praça, promoção e pessoas", "Empreendedor, mercado, tecnologia, gestão e capital", "Ideia, protótipo, venda, lucro e escala"], answer: 1 },
    ],
  },
  {
    id: "problema",
    block: blocks[0],
    title: "Identificação do problema",
    summary: "Qual necessidade do mercado não está sendo bem atendida?",
    xp: 100,
    lessons: [
      {
        title: "Perguntas que geram hipóteses",
        body: "Colete informações e converse com especialistas. Cada resposta abaixo é uma hipótese sobre o problema:",
        items: [
          "Qual é o problema? (contexto e variáveis)",
          "Como os clientes resolvem esse problema hoje?",
          "Por que o problema é tão difícil de resolver?",
          "Quão grande é o problema? (tamanho do mercado)",
          "Para quem é o problema? (potenciais clientes)",
          "O problema foi testado? É real?",
        ],
      },
      {
        title: "Passo a passo",
        body: "Para transformar dúvidas em hipóteses testáveis:",
        items: [
          "Liste o que você quer aprender na forma de perguntas.",
          "Construa hipóteses para responder a essas perguntas.",
          "Defina o que será medido e qual resultado valida a hipótese.",
          "Defina o tipo de teste que será feito.",
        ],
      },
    ],
    deliverables: ["Lean Canvas", "Canvas da Proposta de Valor (lado direito)"],
    quiz: [
      { prompt: "Nesta etapa, o objetivo é descrever hipóteses sobre:", options: ["Problema, mercado e competição", "Preço, canais e logística", "Equipe, sede e marca"], answer: 0 },
      { prompt: "\"Como os clientes resolvem esse problema hoje?\" ajuda a entender:", options: ["O valuation da empresa", "A concorrência e as soluções atuais", "O design do logotipo"], answer: 1 },
      { prompt: "Antes de testar uma hipótese, você precisa definir:", options: ["O nome do produto", "O investidor ideal", "O que será medido e qual resultado a valida"], answer: 2 },
    ],
  },
  {
    id: "clientes",
    block: blocks[0],
    title: "Segmento de clientes",
    summary: "Quem é o cliente e quem são os primeiros a adotar sua solução?",
    xp: 100,
    lessons: [
      {
        title: "Quem é o cliente?",
        body: "Responda: quem é o cliente, como você vai identificar os early adopters (primeiros adotantes) e como ele resolve seus problemas hoje. Grupos de clientes formam segmentos distintos quando:",
        items: [
          "Suas necessidades justificam uma oferta diferente.",
          "São alcançados por canais diferentes.",
          "Exigem tipos diferentes de relacionamento.",
          "Têm lucratividades ou disposição a pagar diferentes.",
        ],
      },
      {
        title: "Descrevendo o segmento",
        body: "Detalhe dados sociodemográficos, necessidades, desejos, objetivos e aspirações. Para o segmento, identifique tamanho, crescimento, localização e comportamento, e o tipo: mercado de massa, nicho, segmentado, diversificado ou plataforma multilateral.",
      },
    ],
    deliverables: ["Lean Canvas", "Canvas da Proposta de Valor (lado direito)"],
    quiz: [
      { prompt: "Early adopters são:", options: ["Os primeiros clientes dispostos a adotar a solução", "Os investidores-anjo", "Os concorrentes diretos"], answer: 0 },
      { prompt: "Dois grupos de clientes são segmentos distintos quando:", options: ["Moram na mesma cidade", "Exigem ofertas, canais ou relacionamentos diferentes", "Usam o mesmo celular"], answer: 1 },
      { prompt: "Qual destes NÃO é um tipo de segmento citado no manual?", options: ["Mercado de nicho", "Plataforma multilateral", "Mercado fiscal"], answer: 2 },
    ],
  },
  {
    id: "validacao-problema",
    block: blocks[0],
    title: "Validação do problema e do cliente",
    summary: "Vá a campo e confirme suas hipóteses antes de pensar na solução.",
    xp: 100,
    lessons: [
      {
        title: "Prepare-se",
        body: "Desenvolver algo apenas com sua própria visão é o primeiro passo para o fracasso. Antes das entrevistas:",
        items: [
          "Crie hipóteses mensuráveis e priorize os problemas.",
          "Monte a primeira lista de potenciais entrevistados.",
          "Crie o roteiro da entrevista e o relatório de documentação.",
        ],
      },
      {
        title: "Entrevistando clientes",
        body: "Construa um contexto de aprendizado, não de vendas. Não pergunte o que os clientes querem: descubra o que eles fazem. Prefira entrevistas presenciais, comece por pessoas conhecidas e documente logo após cada conversa. Classifique a dor: must-have, nice-to-have ou don't need.",
      },
      {
        title: "Quando avançar",
        body: "Avance quando souber claramente as características dos primeiros adotantes, tiver ao menos um problema que merece ser resolvido e souber como os clientes o resolvem hoje. Se não, revise o modelo e faça novas entrevistas.",
      },
    ],
    deliverables: ["Lean Canvas", "Canvas da Proposta de Valor (lado direito)", "Quadro de Validação de Hipóteses", "Entrevistas"],
    quiz: [
      { prompt: "Na entrevista de validação, o ideal é:", options: ["Vender o produto ao entrevistado", "Descobrir o que o cliente faz, sem perguntar o que ele quer", "Mostrar o protótipo final"], answer: 1 },
      { prompt: "Uma dor \"must-have\" significa que o cliente:", options: ["Precisa dessa solução", "Acharia legal ter", "Não precisa"], answer: 0 },
      { prompt: "Se após as entrevistas ainda houver dúvidas sobre o problema, você deve:", options: ["Avançar para a prototipação mesmo assim", "Desistir do negócio", "Revisar o modelo de negócio e fazer novas entrevistas"], answer: 2 },
    ],
  },
  {
    id: "ideacao",
    block: blocks[1],
    title: "Ideação",
    summary: "Transforme o que você aprendeu em uma solução com diferencial.",
    xp: 100,
    lessons: [
      {
        title: "Perguntas da solução",
        body: "A solução precisa ter um grande diferencial competitivo e criar barreiras de entrada. Cada resposta é uma hipótese sobre a solução:",
        items: [
          "Como você vai entregar valor e chamar a atenção do cliente?",
          "Como sua solução resolve o problema?",
          "Qual é seu modelo de negócios e como vai ganhar dinheiro?",
          "Qual é seu diferencial?",
        ],
      },
      {
        title: "Modelos de receita",
        body: "A forma de cobrar deve combinar com o jeito que o cliente gosta de pagar:",
        items: ["Venda direta", "Pagamento pelo uso", "Assinatura", "Aluguel", "Licenciamento", "Comissões", "Anúncios"],
      },
    ],
    deliverables: ["Lean Canvas", "Canvas da Proposta de Valor (lado esquerdo)"],
    quiz: [
      { prompt: "A forma de cobrança deve ser definida de acordo com:", options: ["O preço do concorrente apenas", "O jeito que o cliente gosta de pagar", "O que for mais fácil para a empresa"], answer: 1 },
      { prompt: "Qual destes é um modelo de receita citado?", options: ["Assinatura", "Doação obrigatória", "Imposto"], answer: 0 },
      { prompt: "Na ideação, a solução deve buscar:", options: ["Copiar o líder do mercado", "Ser a mais barata possível", "Diferencial competitivo e barreiras de entrada"], answer: 2 },
    ],
  },
  {
    id: "prototipacao",
    block: blocks[1],
    title: "Prototipação",
    summary: "Construa o produto mínimo viável (MVP) para aprender rápido.",
    xp: 100,
    lessons: [
      {
        title: "Protótipo e MVP",
        body: "O protótipo testa a viabilidade técnica e econômica e começa a validar o interesse dos clientes. O MVP é o produto mínimo que encontra clientes animados o suficiente para usar e pagar. Os primeiros usuários visionários (early adopters) ignoram falhas temporárias e ajudam a melhorar o produto.",
      },
      {
        title: "Antes de prototipar, responda",
        body: "Protótipos reduzem incertezas e ajudam a abandonar rapidamente alternativas que não funcionam.",
        items: ["Para quê estamos prototipando isso?", "O que queremos saber?", "O que queremos testar?", "O que queremos descobrir?"],
      },
    ],
    deliverables: ["Lean Canvas", "Canvas da Proposta de Valor (lado esquerdo)", "Protótipo"],
    quiz: [
      { prompt: "O MVP é:", options: ["A versão final e completa do produto", "O produto mínimo que encontra clientes dispostos a usar e pagar", "Um plano de marketing"], answer: 1 },
      { prompt: "Por que limitar a primeira versão às funções essenciais?", options: ["Para eliminar desperdício e validar as hipóteses principais", "Porque clientes não gostam de funções", "Para economizar com marketing"], answer: 0 },
      { prompt: "Uma das metas desta etapa é:", options: ["Abrir filiais", "Captar investimento de VC", "Demonstrar a capacidade de entrega da equipe"], answer: 2 },
    ],
  },
  {
    id: "validacao-solucao",
    block: blocks[1],
    title: "Validação da solução",
    summary: "Teste a proposta de valor e o modelo de receita com clientes reais.",
    xp: 100,
    lessons: [
      {
        title: "Product/Market Fit",
        body: "Com o MVP nas mãos dos clientes, o foco é confirmar as hipóteses e transformar o produto em algo que os clientes realmente querem e que seja vendido de forma lucrativa. Quando pequenas melhorias não resolvem, mude um componente central por vez (produto, público ou receita): isso é um pivô.",
      },
      {
        title: "Entrevistas de solução",
        body: "Materialize a ideia com slides, protótipos ou wireframes: quanto menos o cliente tiver que imaginar, mais verdadeira será a resposta. Ao final, você deve saber:",
        items: [
          "As características dos primeiros adotantes.",
          "Um problema que merece ser resolvido e a solução mínima para ele.",
          "Quanto os clientes estão dispostos a pagar.",
          "Se é viável construir um negócio.",
        ],
      },
    ],
    deliverables: ["Lean Canvas", "Canvas da Proposta de Valor (lado esquerdo)", "Protótipo validado", "Quadro de Validação de Hipóteses", "Entrevistas"],
    quiz: [
      { prompt: "Um pivô é:", options: ["Mudar um componente central do modelo de negócios", "Contratar um novo sócio", "Lançar uma campanha publicitária"], answer: 0 },
      { prompt: "Por que mostrar algo concreto (protótipo, wireframe) na entrevista?", options: ["Para impressionar investidores", "Quanto menos o cliente imaginar, mais verdadeira a resposta", "Porque é obrigatório por contrato"], answer: 1 },
      { prompt: "Product/Market Fit acontece quando:", options: ["O produto fica pronto", "A empresa recebe investimento", "Os clientes realmente desejam o produto"], answer: 2 },
    ],
  },
  {
    id: "mercado",
    block: blocks[2],
    title: "Acesso a mercado",
    summary: "Monte a máquina de vendas unindo vendas e marketing digital.",
    xp: 100,
    lessons: [
      {
        title: "Chegando até os clientes",
        body: "Valide os canais para descobrir os melhores caminhos (custo x benefício) e as métricas para conquistar e fidelizar clientes.",
        items: [
          "Vendas: como os clientes compram, quais os canais e quanto custa cada canal.",
          "Marketing digital: inbound (atrair pelas mídias digitais), outbound (busca ativa) ou os dois.",
          "Como filtrar os clientes com maior potencial de compra?",
        ],
      },
      {
        title: "Perguntas da etapa",
        body: "Como você chegará até os clientes? Como irá se proteger dos concorrentes? Como saberá que está avançando no caminho certo?",
      },
    ],
    deliverables: ["Lean Canvas completo", "Canvas da Jornada de Compras"],
    quiz: [
      { prompt: "Inbound marketing é:", options: ["Atrair clientes por mídias digitais e conteúdo", "Ligar ativamente para clientes", "Vender apenas em lojas físicas"], answer: 0 },
      { prompt: "Validar canais serve para descobrir:", options: ["O melhor logotipo", "Os melhores caminhos em custo x benefício até o cliente", "O tamanho da sala de incubação"], answer: 1 },
      { prompt: "Qual entrega é desta etapa?", options: ["Diploma de graduação", "Termo de confidencialidade", "Canvas da Jornada de Compras"], answer: 2 },
    ],
  },
  {
    id: "financeiro",
    block: blocks[2],
    title: "Modelagem financeira",
    summary: "Estime receitas, custos e o valor da sua empresa.",
    xp: 100,
    lessons: [
      {
        title: "Pontos da modelagem",
        body: "Aprenda a modelar a empresa para conversar com investidores, projetar o fluxo de caixa e estimar o valor de mercado.",
        items: [
          "Precificação: baseada no custo, nos competidores ou no valor percebido?",
          "Estrutura de custos: custos pré-operacionais e operacionais.",
          "Tamanho de mercado: as previsões de receita são coerentes com ele?",
          "Tipos de receita: é possível inovar na forma de gerar receita?",
          "Valuation: como foi estimado o valor da empresa?",
        ],
      },
    ],
    deliverables: ["Modelagem Financeira", "Resumo Executivo"],
    quiz: [
      { prompt: "Valuation é:", options: ["A estimativa do valor de mercado da empresa", "O custo do aluguel", "O número de clientes"], answer: 0 },
      { prompt: "A precificação pode ser baseada em:", options: ["Apenas no desejo do fundador", "Custo, preço dos competidores ou valor percebido", "Sorteio"], answer: 1 },
      { prompt: "As previsões de receita devem ser coerentes com:", options: ["O número de sócios", "A cor da marca", "O tamanho do mercado"], answer: 2 },
    ],
  },
  {
    id: "capital",
    block: blocks[2],
    title: "Acesso a capital e pitch",
    summary: "Identifique fontes de recursos e prepare seu pitch.",
    xp: 100,
    lessons: [
      {
        title: "Fontes de recursos",
        body: "Identifique as fontes disponíveis, o momento certo de captar e como negociar:",
        items: [
          "Fontes públicas e privadas de recursos.",
          "Tipo de investimento: dívida, equity, crowdfunding etc.",
          "Perfil de investidor: anjo, venture capital, institucional.",
          "Principais cláusulas em jogo numa negociação.",
        ],
      },
      {
        title: "Pitch",
        body: "Estruture uma apresentação sucinta e persuasiva para investidores, apoiada pelo resumo executivo e pela modelagem financeira.",
      },
    ],
    deliverables: ["Lean Canvas completo", "Canvas da Jornada de Compras", "Modelagem Financeira", "Resumo Executivo", "Pitch"],
    quiz: [
      { prompt: "Equity é um investimento em que o investidor:", options: ["Recebe participação na empresa", "Empresta com juros fixos", "Doa sem contrapartida"], answer: 0 },
      { prompt: "Um bom pitch deve ser:", options: ["Longo e detalhado", "Sucinto e persuasivo", "Só com números"], answer: 1 },
      { prompt: "Qual perfil de investidor costuma entrar nos estágios iniciais?", options: ["Investidor institucional", "Banco central", "Investidor-anjo"], answer: 2 },
    ],
  },
  {
    id: "consolidacao",
    block: blocks[3],
    title: "Consolidação",
    summary: "Execute o planejamento: primeiros clientes, proteção e crescimento.",
    xp: 100,
    lessons: [
      {
        title: "Executando o plano",
        body: "Nos últimos 12 meses de incubação, o objetivo é executar o planejamento de acesso a mercado e capital. Ao final, a empresa deve ter os primeiros clientes, uma estratégia clara de proteção contra concorrentes e, possivelmente, ter captado recursos para crescer.",
      },
      {
        title: "Monitoramento",
        body: "Os relatórios das reuniões de monitoramento, com indicadores de maturidade, são a base para a mudança de fase e para a decisão conjunta sobre a graduação.",
      },
    ],
    deliverables: ["Canvas da Jornada de Compras validado", "Modelagem Financeira completa", "Resumo Executivo", "Pitch"],
    quiz: [
      { prompt: "Quanto tempo dura a etapa de consolidação?", options: ["12 meses", "6 meses", "36 meses"], answer: 0 },
      { prompt: "O que embasa a decisão de graduação?", options: ["O número de seguidores", "Os relatórios de monitoramento", "A data de entrada"], answer: 1 },
      { prompt: "Ao final da consolidação a empresa deve ter:", options: ["Apenas a ideia", "Somente o protótipo", "Primeiros clientes e estratégia de proteção"], answer: 2 },
    ],
  },
  {
    id: "graduacao",
    block: blocks[3],
    title: "Graduação",
    summary: "Independência financeira e estrutural: hora de voar.",
    xp: 100,
    lessons: [
      {
        title: "A graduação",
        body: "A graduação é representada pelo diploma de empresa graduada, entregue aos sócios da empresa que demonstra independência financeira e estrutural. A partir daí, a empresa passa a ter espaço próprio e se torna Associada ao Inovaparq.",
      },
    ],
    deliverables: ["Relatório final de monitoramento"],
    quiz: [
      { prompt: "Após graduar, a empresa se torna:", options: ["Associada ao Inovaparq", "Pré-incubada", "Desligada"], answer: 0 },
      { prompt: "A graduação exige demonstrar:", options: ["Um protótipo", "Independência financeira e estrutural", "Um logotipo registrado"], answer: 1 },
      { prompt: "A graduação é decidida:", options: ["Só pelo incubado", "Por sorteio", "Em conjunto entre incubado e gerência da incubadora"], answer: 2 },
    ],
  },
];

// Mínimo de acertos (proporção) para concluir a fase.
export const PASS_RATIO = 2 / 3;

// Cada nível corresponde a um bloco da metodologia; o nível sobe ao concluir o bloco anterior.
export type Level = { level: number; name: string; minXp: number };
export const levels: Level[] = [
  { level: 1, name: "Pré-incubado", minXp: 0 },
  { level: 2, name: "Em implantação", minXp: 400 },
  { level: 3, name: "Em crescimento", minXp: 700 },
  { level: 4, name: "Em consolidação", minXp: 1000 },
  { level: 5, name: "Graduado", minXp: 1200 },
];

export type Reward = { id: string; level: number; title: string; description: string };
export const rewards: Reward[] = [
  { id: "mentoria-validacao", level: 2, title: "Mentoria de validação", description: "Sessão com mentor para revisar seu Lean Canvas e suas entrevistas." },
  { id: "ferramentas", level: 2, title: "Pacote de ferramentas", description: "Acesso a ferramentas parceiras (ex.: créditos AWS, Artia, ContaAzul), conforme disponibilidade." },
  { id: "mentoria-individual", level: 3, title: "Mentoria individual de produto", description: "1 hora com especialista para avaliar seu protótipo e o Product/Market Fit." },
  { id: "consultoria", level: 4, title: "Consultoria especializada", description: "Apoio de um núcleo do Inovaparq (ex.: NAF contábil, NIPI propriedade intelectual)." },
  { id: "banca-pitch", level: 4, title: "Banca de pitch com investidores", description: "Apresente seu pitch para a rede de investidores e fundos do Inovaparq." },
  { id: "diploma", level: 5, title: "Diploma de empresa graduada", description: "Reconhecimento oficial e entrada como empresa Associada ao Inovaparq." },
];
