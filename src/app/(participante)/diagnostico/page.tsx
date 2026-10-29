import type { Metadata } from "next";
import { DemoAction } from "@/components/DemoAction";
import { ListRow, PageHead, StatusBadge } from "@/components/ui";
import { Icon } from "@/components/ui/Icon";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Diagnóstico inicial" };

export default async function Diagnostico() {
  const user = await getCurrentUser();
  return (
    <>
      <PageHead eyebrow="Boas-vindas" title="Toda jornada tem um começo." desc="Conte um pouco sobre você para preparar os próximos passos." />
      <div className="grid wide">
        <section className="card">
          <div className="row between mb">
            <h2>Seu ponto de partida</h2>
            <StatusBadge>Diagnóstico inicial</StatusBadge>
          </div>
          <div className="grid g2">
            <label className="field">Como podemos chamar você?<input defaultValue={user?.name?.split(" ")[0] ?? ""} placeholder="Seu primeiro nome" /></label>
            <label className="field">Tempo disponível por semana<select><option>Até 5 horas</option><option>De 6 a 10 horas</option><option>Mais de 10 horas</option></select></label>
          </div>
          <label className="field">Em que momento você está?<select><option>Tenho uma ideia e quero investigá-la</option><option>Quero encontrar uma oportunidade</option><option>Já tenho um protótipo</option><option>Já tenho um negócio em operação</option></select></label>
          <label className="field">Qual caminho combina com seu projeto?<select><option>Negócio de base científica ou tecnológica</option><option>Pequenos negócios e serviços</option><option>Startup digital</option><option>Inovação dentro de empresas</option></select></label>
          <label className="field">Que problema gostaria de resolver?<textarea placeholder="Descreva quem enfrenta esse problema e o que acontece hoje." /></label>
          <label className="check"><input type="checkbox" defaultChecked />Quero receber lembretes da minha jornada. Posso alterar depois.</label>
          <div className="row between mt wrap">
            <span className="tiny muted">Você poderá revisar estas respostas.</span>
            <DemoAction label="Salvar diagnóstico" icon="check" toast="Demonstração: o diagnóstico será gravado e usado na matrícula a partir da etapa 3." />
          </div>
        </section>
        <aside className="stack">
          <div className="card">
            <div className="feature-icon"><Icon name="route" /></div>
            <h2>Uma trilha com propósito</h2>
            <p className="sub">O diagnóstico orienta conteúdos e desafios adequados ao seu momento.</p>
            <div className="divider" />
            <ListRow title="Aprender" desc="Conteúdos curtos e aplicáveis." icon="book" />
            <ListRow title="Experimentar" desc="Missões no seu próprio projeto." icon="target" />
            <ListRow title="Evoluir" desc="Feedback, conquistas e mentorias." icon="award" />
          </div>
          <div className="notice">Já tem experiência? Você poderá solicitar uma avaliação das competências que já desenvolveu.</div>
        </aside>
      </div>
    </>
  );
}
