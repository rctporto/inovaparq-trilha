#!/usr/bin/env bash
# Configura a publicação automática pelo GitHub SEM chave de conta de serviço
# (mesmo esquema do NÓRIO R&D OS). O GitHub Actions prova quem é com um token
# próprio (Workload Identity Federation), e só a branch main do repositório publica.
#
# Uso, no Cloud Shell do projeto Firebase:
#   bash configurar-publicacao.sh <id-do-projeto> <dono/repositorio>
set -euo pipefail

PROJECT_ID=${1:?informe o id do projeto Firebase}
REPO=${2:?informe o repositório, ex.: rctporto/inovaparq-trilha}
SA_NAME=github-deploy
SA="$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"

gcloud config set project "$PROJECT_ID" >/dev/null
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')

echo "Ativando APIs..."
gcloud services enable iamcredentials.googleapis.com sts.googleapis.com \
  firebasehosting.googleapis.com firebaserules.googleapis.com cloudresourcemanager.googleapis.com

echo "Criando a conta de publicação (sem chave)..."
gcloud iam service-accounts describe "$SA" >/dev/null 2>&1 || \
  { gcloud iam service-accounts create "$SA_NAME" --display-name="Publicação pelo GitHub"; sleep 20; }

# Só o necessário para publicar o site e as regras; não lê os dados do banco.
for ROLE in roles/firebasehosting.admin roles/firebaserules.admin roles/firebase.viewer roles/serviceusage.serviceUsageConsumer; do
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$SA" --role="$ROLE" --condition=None -q >/dev/null
done

echo "Ligando o GitHub ao projeto..."
gcloud iam workload-identity-pools describe github --location=global >/dev/null 2>&1 || \
  gcloud iam workload-identity-pools create github --location=global --display-name="GitHub"
gcloud iam workload-identity-pools providers describe github --location=global --workload-identity-pool=github >/dev/null 2>&1 || \
  gcloud iam workload-identity-pools providers create-oidc github \
    --location=global --workload-identity-pool=github \
    --issuer-uri="https://token.actions.githubusercontent.com" \
    --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.ref=assertion.ref" \
    --attribute-condition="assertion.repository=='$REPO' && assertion.ref=='refs/heads/main'"
# Uma conta recém-criada pode levar alguns minutos para aceitar permissões; tenta de novo.
for TENTATIVA in 1 2 3 4 5 6; do
  if gcloud iam service-accounts add-iam-policy-binding "$SA" -q >/dev/null \
      --role=roles/iam.workloadIdentityUser \
      --member="principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/github/attribute.repository/$REPO"; then
    break
  fi
  [ "$TENTATIVA" = 6 ] && { echo "Não deu certo. Rode o comando de novo daqui a alguns minutos."; exit 1; }
  echo "A conta ainda está sendo criada, tentando de novo em 30 segundos..."
  sleep 30
done

echo
echo "Pronto. Número do projeto: $PROJECT_NUMBER"
echo "Mande esse número para o Claude terminar a configuração."
