import type { Metadata } from "next";
import { EmptyState, PageHead } from "@/components/ui";

export const metadata: Metadata = { title: "Meu projeto" };

export default function Projeto() {
  return (
    <>
      <PageHead eyebrow="Meu projeto" title="Seu projeto" desc="Visão do negócio, evidências e histórico de evolução." />
      <section className="card">
        <EmptyState icon="flag" title="Nenhum projeto cadastrado" text="O cadastro do projeto, da equipe e das hipóteses será liberado nas próximas etapas. Tudo o que você registrar ficará guardado com histórico de versões." />
      </section>
    </>
  );
}
