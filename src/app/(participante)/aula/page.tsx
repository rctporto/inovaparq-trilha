import type { Metadata } from "next";
import { Button, EmptyState, PageHead } from "@/components/ui";
import { CURRENT_PHASE } from "@/lib/trilha";

export const metadata: Metadata = { title: "Ambiente de aprendizagem" };

export default function Aula() {
  return (
    <>
      <PageHead eyebrow="Ambiente de aprendizagem" title="Suas aulas" desc="Conteúdos curtos e aplicáveis ao seu projeto." action={<Button href={`/fase/${CURRENT_PHASE}`} variant="light" icon="back">Voltar à fase</Button>} />
      <section className="card">
        <EmptyState icon="book" title="Nenhuma aula liberada ainda" text="As aulas da sua fase aparecerão aqui assim que o currículo for publicado." />
      </section>
    </>
  );
}
