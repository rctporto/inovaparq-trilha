import type { Metadata } from "next";
import { Button, EmptyState, PageHead, StatCard } from "@/components/ui";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Painel do mentor" };

export default async function MentorHome() {
  const user = await getCurrentUser();
  const first = user?.name?.split(" ")[0];
  return (
    <>
      <PageHead eyebrow="Área do mentor" title={`Olá${first ? `, ${first}` : ""}. Seu olhar transforma.`} desc="Acompanhe projetos, devolutivas e próximos encontros." action={<Button href="/mentor/agenda" variant="light" icon="calendar">Abrir agenda</Button>} />
      <div className="grid g4 mb">
        <StatCard label="Entregas pendentes" value="0" note="Nenhuma entrega aguardando" icon="file" />
        <StatCard label="Projetos acompanhados" value="0" note="Nenhum projeto atribuído" icon="flag" />
        <StatCard label="Encontros da semana" value="0" note="Nenhum encontro agendado" icon="calendar" />
        <StatCard label="Devolutivas realizadas" value="0" note="Neste ciclo de aprendizagem" icon="check" />
      </div>
      <div className="grid wide">
        <section className="card">
          <h2>Próximas avaliações</h2>
          <EmptyState icon="file" title="Nenhuma entrega para avaliar" text="Quando participantes enviarem missões dos projetos atribuídos a você, elas aparecerão aqui por ordem de envio." />
          <div className="notice mt">Avalie o método, as evidências e a qualidade da decisão. Resultados negativos também podem demonstrar competência.</div>
        </section>
        <aside className="card">
          <h2>Próximo encontro</h2>
          <EmptyState icon="calendar" title="Nada agendado" text="Seus encontros com a turma aparecerão aqui." />
        </aside>
      </div>
    </>
  );
}
