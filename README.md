# Inovaparq · Trilha de Inovação

Plataforma gamificada de inovação do Inovaparq: login de pessoas e empresas, trilha em formato de
tabuleiro baseada na metodologia de incubação do Inovaparq, XP e níveis, bonificações (mentorias,
consultorias, banca de pitch), perfil com foto ou logo e histórico de progresso.

## Como funciona

| Peça | Onde fica |
| --- | --- |
| Páginas (Next.js, exportado como site estático) | `src/app/` |
| Fases, níveis e bonificações | `src/content/trilha.ts` |
| Login e dados (Firebase Auth + Cloud Firestore) | `src/lib/session.tsx`, `src/lib/firebase.ts` |
| Quem pode ler e gravar | `firestore.rules` |
| Cores e fontes da marca | topo de `src/app/globals.css`; logos em `public/brand/` |
| Publicação automática | `.github/workflows/deploy.yml` (a cada push na `main`) e `scripts/configurar-publicacao.sh` |

- **Login:** conta Google ou e-mail e senha (Firebase Authentication), com "Esqueci minha senha".
- **Aprovação:** todo cadastro novo (pessoa ou empresa) fica "pendente" e só entra na trilha depois
  que o administrador aprova. Administradores: contas Google listadas em `src/lib/admin.ts` e em
  `isAdmin()` de `firestore.rules` (hoje, renato@norionano.com.br). Eles entram direto no
  **Painel do Inovaparq** (`/admin/`): aprovam ou recusam cadastros, acompanham o progresso de cada
  participante e mudam o status das bonificações (solicitado → agendado → concluído).
- **Dados:** `users/<uid>` (perfil e status do cadastro; foto/logo reduzida para 256 px dentro do próprio documento),
  `users/<uid>/completions/<fase>` e `users/<uid>/claims/<bonificação>`.
- **Regras no servidor:** cada conta só vê os próprios dados; fases só podem ser concluídas em ordem,
  com XP fixo; bonificações só podem ser solicitadas depois da fase que as libera, sempre com status
  "solicitado" (só a equipe muda o status). Ao mudar a ordem das fases ou das bonificações em
  `src/content/trilha.ts`, atualize os mapas em `firestore.rules`.

## Rodar localmente

Requer Node 22 e Java (para os emuladores do Firebase). Nada sai da máquina.

```bash
npm install
npm run local        # gera o site e abre em http://localhost:5000 com login e banco locais
```

## Configuração no Firebase (uma vez)

1. Crie o projeto no [console do Firebase](https://console.firebase.google.com) (plano gratuito Spark).
2. **Firestore:** Criar banco de dados, local `southamerica-east1 (São Paulo)`, modo de produção.
3. **Login:** Authentication → Vamos começar → Método de login → ative **E-mail/senha** e **Google**.
   Em Modelos, troque o idioma para português.
4. **App da Web:** Configurações do projeto → Seus apps → `</>`, nome "Trilha Inovaparq".
   Depois, em Hosting, clique em Vamos começar e avance até o fim.
5. No Cloud Shell do projeto, rode `scripts/configurar-publicacao.sh <id-do-projeto> <dono/repositorio>`
   e coloque o número do projeto que ele mostra em `WIF_PROVIDER`, no topo de `.github/workflows/deploy.yml`.
6. Faça um push na `main` (ou rode o workflow manualmente) para publicar.
