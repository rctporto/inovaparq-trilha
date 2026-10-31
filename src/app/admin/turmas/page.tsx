import type { Metadata } from "next";
import { DemoAction } from "@/components/DemoAction";
import { EmptyState, PageHead } from "@/components/ui";

export const metadata: Metadata = { title: "Gestão de turmas" };

export default function Turmas() {
  return (
    <>
      <PageHead eyebrow="Turmas e projetos" title="Organize pessoas. Acompanhe avanços." desc="Ciclos de aprendizagem com responsáveis, prazos e capacidade definidos." action={<DemoAction label="Nova turma" icon="plus" title="Criar turma" text="Campos previstos: nome, datas, limite de participantes, trilha e versão, coordenador, mentores e regras de ingresso. O cadastro de turmas chega na etapa 2." />} />
      <section className="card mb">
        <h2>Turmas</h2>
        <EmptyState icon="people" title="Nenhuma turma cadastrada" text="As turmas criadas pela coordenação aparecerão aqui com participantes, mentores e situação." />
      </section>
      <section className="card">
        <h2>Projetos</h2>
        <EmptyState icon="flag" title="Nenhum projeto cadastrado" text="Os projetos dos participantes aparecerão aqui com fase atual, XP e última atividade." />
      </section>
    </>
  );
}
