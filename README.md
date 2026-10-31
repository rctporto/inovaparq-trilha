# Inovaparq · Jornada empreendedora

Plataforma de treinamento em empreendedorismo e inovação para as startups do Inovaparq.
Esta versão entrega a **etapa 1** do roteiro (estrutura, identidade e navegação) e o **fluxo real de acesso**:
login com Google, cadastro por e-mail e senha e aprovação de contas por Administrador/Desenvolvedor.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Auth.js v5 (Google + e-mail/senha) com adaptador Prisma
- PostgreSQL + Prisma 6 (migrations em `prisma/migrations`)
- Tailwind CSS 4 + design system portado do protótipo (`src/app/globals.css`)
- Vitest (regras de papéis e aprovação)

## Como rodar localmente

```bash
cp .env.example .env          # preencha DATABASE_URL e AUTH_SECRET (npx auth secret)
npm install
npx prisma migrate deploy     # cria as tabelas
npm run db:seed               # opcional: cria a conta Desenvolvedor de SEED_DEV_EMAIL/SEED_DEV_PASSWORD
npm run dev                   # http://localhost:3000
```

Verificações: `npm run typecheck`, `npm test`, `npm run build`.

### Primeira conta com poder de aprovação

Escolha uma das opções (as duas são idempotentes):

1. Coloque seu e-mail em `BOOTSTRAP_DEV_EMAILS`. No primeiro acesso (Google ou cadastro) a conta já nasce **Desenvolvedor** e ativa.
2. Defina `SEED_DEV_EMAIL` e `SEED_DEV_PASSWORD` e rode `npm run db:seed`.

### Login com Google

1. Google Cloud Console → APIs e serviços → Credenciais → **ID do cliente OAuth** (aplicativo da Web).
2. URI de redirecionamento autorizado: `https://SEU-DOMINIO/api/auth/callback/google` (e `http://localhost:3000/api/auth/callback/google` para testes).
3. Preencha `AUTH_GOOGLE_ID` e `AUTH_GOOGLE_SECRET`. Sem eles, o botão aparece como “configuração pendente”.

## Fluxo de acesso

| Situação | O que acontece |
| --- | --- |
| Cadastro por e-mail/senha ou primeiro login com Google | Conta criada como **PENDENTE**; a pessoa vê “Cadastro recebido. Em análise.” |
| Aprovação em *Administração → Pessoas e acessos* | Quem aprova escolhe o papel final (a pessoa só indica se é participante ou mentor) |
| Recusa | Exige motivo; conta fica **REJEITADO** e o login é bloqueado |
| Desativação / reativação | Conta **INATIVO** perde o acesso na próxima requisição |

Regras de quem pode fazer o quê (`src/lib/roles.ts`, testadas em `tests/roles.test.ts`):

- **Administrador**: aprova, recusa, desativa e concede *Participante* ou *Mentor*. Não altera contas de Administrador/Desenvolvedor.
- **Desenvolvedor**: tudo o que o Administrador faz e também concede *Administrador* e *Desenvolvedor*. Acessa as três áreas.
- Ninguém altera a própria conta. Toda ação fica no **registro de auditoria** (`AuditLog`).
- Papel e situação são lidos do banco a cada requisição (`src/lib/session.ts`); o token da sessão guarda só o id.
  Server actions revalidam a permissão no servidor. O middleware apenas barra quem não tem cookie de sessão.

## Áreas e rotas

- Público: `/` (tela inicial com animação de fundo + login), `/cadastro`, `/aguardando-aprovacao`, `/acesso-negado`
- Participante: `/inicio`, `/diagnostico`, `/jornada`, `/fase/[1-10]`, `/aula`, `/missao`, `/verificacao`, `/projeto`, `/recompensas`, `/mentores`, `/agendamento`, `/comunidade`, `/portfolio`
- Mentor: `/mentor`, `/mentor/avaliar`, `/mentor/agenda`, `/mentor/comunidade`
- Administração: `/admin`, `/admin/turmas`, `/admin/conteudos`, `/admin/beneficios`, `/admin/usuarios`, `/admin/configuracoes`

A animação da tela inicial (`src/components/AnimatedBackground.tsx`) respeita `prefers-reduced-motion`,
pausa quando a aba fica oculta e tem botão “Pausar animação” (preferência lembrada no navegador).

## Jogos de aprendizagem (`/jogos`)

Arena com cinco jogos curtos, cada um ligado ao tema de uma fase (o cartão aparece também na página da fase):

| Jogo | Fase | Mecânica | Ensina |
| --- | --- | --- | --- |
| Fato ou suposição? | 2 · Investigador | Classificação contra o relógio, com combo | Evidência x opinião, vieses de entrevista |
| Memória do Canvas | 5 · Arquiteto | Jogo da memória | Blocos do Business Model Canvas com exemplos |
| Monte o experimento | 6 · Construtor | Ordenar etapas (3 tentativas) | Ciclo de experimento com critério definido antes |
| Mesa de negociação | 7 · Negociador | Diálogo com escolhas e medidor de confiança | Perguntar antes de dar preço, contrapartidas, pilotos |
| Fôlego de caixa | 8 · Gestor | Simulação de 6 meses | Queima de caixa, runway, custo fixo x receita, equipe |

- Cada partida é salva em `GameResult`; as estrelas (35%, 65%, 90% da pontuação) são calculadas no servidor
  (`src/app/actions/games.ts`), que limita a pontuação ao máximo do jogo e ignora partidas com menos de 4 s.
- Jogos são **prática**: rendem estrelas e recordes, mas **não somam XP da trilha** (mantém o teto de 500 XP por fase do roteiro).
- Conteúdo dos jogos fica no próprio componente (`src/components/games/*`); o mesmo formato serve para outras fases.
- Teclado: todos os jogos funcionam sem mouse; animações respeitam “reduzir movimento”.

## O que é real e o que é demonstração

**Real (banco + servidor):** contas, login Google/e-mail, aprovação, papéis, bloqueio de áreas por papel,
auditoria, contadores de contas no painel administrativo.

**Demonstração (faixa “Dados demonstrativos” na tela):** XP, fases, aulas, missões, avaliações, benefícios, agenda,
comunidade, turmas e indicadores. Os dados ficam em `src/lib/demo.ts`. Botões dessas telas explicam o que a versão
final fará e nunca simulam sucesso. Serão substituídos nas etapas 3 a 7 do roteiro.

## Pendências concretas

- `ESPECIFICACAO_FUNCIONAL.md`, `DESIGN_SYSTEM.md` e `CURRICULO_SEED.json` não foram recebidos; a etapa 1 seguiu o HTML e o PDF.
- Logomarca: usada a versão colorida digital (`public/brand/`, PNG 436×96). Substituir pelo vetor oficial quando houver.
- Recuperação de senha e notificação por e-mail da aprovação dependem de um provedor de e-mail (não configurado).
- Limite de tentativas de login (rate limit) a ser adicionado junto com o deploy.
- Etapa 2 em diante: papéis por programa/turma/projeto, políticas no banco, trilha, missões, XP, benefícios, agenda.
- Deploy não realizado.

## Publicação

Esta versão precisa de um servidor Node.js e de um PostgreSQL (não é mais um site estático).

### Firebase App Hosting (configuração incluída em `apphosting.yaml`)

1. No console do Firebase, projeto `inovaparq-trilha`: mude para o plano **Blaze** (pago conforme o uso; o
   App Hosting exige). Configure um alerta de orçamento em Faturamento.
2. Banco PostgreSQL: **Cloud SQL** (mesmo projeto, região `southamerica-east1`) ou um Postgres externo com plano
   gratuito (ex.: Neon). Guarde a URL de conexão.
3. Crie os segredos (no Cloud Shell ou com o Firebase CLI):
   `firebase apphosting:secrets:set DATABASE_URL`, `AUTH_SECRET` (gere com `openssl rand -base64 32`),
   `AUTH_GOOGLE_ID` e `AUTH_GOOGLE_SECRET`.
4. App Hosting → Criar backend → conecte o GitHub `rctporto/inovaparq-trilha`, branch `main`, região
   `southamerica-east1`. Cada push na `main` publica; o build roda `prisma migrate deploy` antes do `next build`.
5. Crie o segredo `BOOTSTRAP_DEV_EMAILS` (`firebase apphosting:secrets:set BOOTSTRAP_DEV_EMAILS`) com o seu e-mail para a primeira conta nascer Desenvolvedor.
6. No Google Cloud (Credenciais OAuth), adicione `https://SEU-BACKEND.web.app/api/auth/callback/google`
   (ou o domínio próprio) às URIs de redirecionamento.

Outras opções: Vercel + Neon/Supabase, Render ou Railway.
Em qualquer uma: configure as variáveis de `.env.example`, rode `npx prisma migrate deploy` e `npm run db:seed`
e inclua `https://SEU-DOMINIO/api/auth/callback/google` nas URIs de redirecionamento do Google.

O GitHub Actions (`.github/workflows/ci.yml`) roda tipos, testes e build em cada PR; ele não publica nada.

A versão anterior (site estático com Firebase) está preservada no branch `versao-firebase`. O site antigo
continua no ar como estava até ser substituído; o conteúdo da trilha baseado no manual de incubação do
Inovaparq (`src/content/trilha.ts` daquele branch) pode ser reaproveitado na etapa 3.

## Backup

Dados vivem no PostgreSQL: `pg_dump "$DATABASE_URL" > backup.sql` e `psql "$DATABASE_URL" < backup.sql`.
