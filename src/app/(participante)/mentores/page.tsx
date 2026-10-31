import type { Metadata } from "next";
import { Button, EmptyState, PageHead } from "@/components/ui";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = { title: "Encontrar mentores" };

export default function Mentores() {
  return (
    <>
      <PageHead eyebrow="Conexões que fazem avançar" title="Encontre um novo ponto de vista." desc="Suporte coletivo disponível desde o início. Mentorias individuais seguem os marcos da trilha." action={<Button href="/agendamento" variant="light" icon="calendar">Minha agenda</Button>} />
      <section className="card">
        <EmptyState icon="people" title="Nenhum mentor disponível ainda" text="Os mentores da sua turma aparecerão aqui quando forem cadastrados pela coordenação do Inovaparq." />
      </section>
      <div className="grid g2 mt">
        <div className="card">
          <div className="feature-icon plum"><Icon name="people" /></div>
          <h2>Prepare sua conversa</h2>
          <p className="sub">Atualize o projeto, selecione uma dúvida principal e compartilhe as evidências relevantes antes do encontro.</p>
        </div>
        <div className="card">
          <div className="feature-icon"><Icon name="gift" /></div>
          <h2>Mentoria individual</h2>
          <p className="sub">Seu primeiro atendimento individual é liberado na fase Construtor, com 3.000 XP e a fase aprovada.</p>
          <div className="mt"><Button href="/recompensas" variant="light" small>Consultar critérios</Button></div>
        </div>
      </div>
    </>
  );
}
