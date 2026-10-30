import type { Metadata } from "next";
import { FilterList } from "@/components/demo/Interactive";
import { Avatar, Button, PageHead, StatusBadge } from "@/components/ui";
import { Icon } from "@/components/ui/Icon";
import { MENTORS } from "@/lib/demo";

export const metadata: Metadata = { title: "Encontrar mentores" };

export default function Mentores() {
  return (
    <>
      <PageHead eyebrow="Conexões que fazem avançar" title="Encontre um novo ponto de vista." desc="Suporte coletivo disponível desde o início. Mentorias individuais seguem os marcos da trilha." action={<Button href="/agendamento" variant="light" icon="calendar">Minha agenda</Button>} />
      <div className="row mb wrap">
        <StatusBadge>Turma Semente 2026</StatusBadge>
        <StatusBadge tone="gray">Perfis ilustrativos</StatusBadge>
      </div>
      <FilterList
        placeholder="Buscar especialidade"
        items={MENTORS.map((m) => ({
          key: m.name,
          search: `${m.name} ${m.area} ${m.skills}`,
          node: (
            <section className="card mentor-card">
              <div className="row mb">
                <Avatar initials={m.initials} tone={m.tone} />
                <div><h2>{m.name}</h2><span className="tiny muted">Mentor(a) da jornada</span></div>
              </div>
              <StatusBadge>{m.area}</StatusBadge>
              <p className="smalltext muted">{m.skills}</p>
              <div className="divider" />
              <p className="tiny muted">Clínica coletiva disponível para sua turma.</p>
              <Button href="/agendamento" variant="light" small icon="calendar">Ver horários</Button>
            </section>
          ),
        }))}
      />
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
