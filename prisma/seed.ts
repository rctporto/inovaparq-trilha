// Seed idempotente. Cria/atualiza a conta Desenvolvedor indicada no .env (se houver).
// Não cria usuários fictícios: os dados demonstrativos da etapa 1 ficam em src/lib/demo.ts.
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_DEV_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_DEV_PASSWORD;
  if (!email || !password) {
    console.log("SEED_DEV_EMAIL/SEED_DEV_PASSWORD não definidos: nenhuma conta criada.");
    return;
  }
  if (password.length < 8) throw new Error("SEED_DEV_PASSWORD precisa ter ao menos 8 caracteres.");
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.upsert({
    where: { email },
    update: { role: "DESENVOLVEDOR", status: "ATIVO", passwordHash },
    create: { email, name: "Equipe de desenvolvimento", role: "DESENVOLVEDOR", requestedRole: "DESENVOLVEDOR", status: "ATIVO", passwordHash, reviewedAt: new Date(), statusReason: "Seed" },
  });
  console.log(`Conta Desenvolvedor pronta: ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
