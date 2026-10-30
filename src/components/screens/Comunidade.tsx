import { DemoAction } from "@/components/DemoAction";
import { Avatar, DemoRibbon, ListRow, PageHead, StatusBadge } from "@/components/ui";

const comments = "Marina: “Qual evidência ajudou mais na mudança de direção?” Bruno: “Os relatos sobre a dificuldade de manter os registros atualizados.”";

export function ComunidadeScreen() {
  return (
    <>
      <DemoRibbon />
      <PageHead eyebrow="Aprender também é compartilhar" title="Boas ideias crescem em conversa." desc="Comunidade da turma Semente · trocas sobre os projetos em desenvolvimento." action={<DemoAction label="Nova publicação" icon="plus" text="A publicação poderá conter título, tema, texto e visibilidade. Participantes escolhem o que compartilhar; as evidências do projeto permanecem privadas." />} />
      <div className="grid wide">
        <div className="stack">
          <section className="card">
            <div className="row">
              <Avatar initials="BL" tone="teal" />
              <div><b>Bruno Lima</b><p className="tiny muted" style={{ margin: "4px 0" }}>Hoje · fase Investigador</p></div>
            </div>
            <div className="feed-tag">Aprendizado de campo</div>
            <h2>O problema que ouvimos não era o que imaginávamos.</h2>
            <p className="sub">Nas entrevistas, a maior dificuldade apareceu na rotina de registro. Estamos revisando a proposta antes de construir novas funcionalidades.</p>
            <div className="row mt wrap">
              <DemoAction label="Achei útil · 8" variant="light" small icon="spark" toast="Demonstração: reconhecimentos não geram XP automático." />
              <DemoAction label="Ver conversa · 3" variant="light" small icon="chat" title="Conversa da comunidade" text={comments} />
            </div>
          </section>
          <section className="card">
            <div className="row wrap">
              <Avatar initials="MS" />
              <div><b>Marina Silva</b><p className="tiny muted" style={{ margin: "4px 0" }}>Mentora · ontem</p></div>
              <StatusBadge tone="plum">Dica da semana</StatusBadge>
            </div>
            <div className="feed-tag">Experimentos</div>
            <h2>Qual decisão seu próximo teste vai ajudar a tomar?</h2>
            <p className="sub">Defina a hipótese, o método e o critério de decisão antes de começar. Compartilhe uma versão do seu teste para receber contribuições.</p>
            <div className="row mt wrap">
              <DemoAction label="Achei útil · 12" variant="light" small icon="spark" toast="Demonstração: reconhecimentos não geram XP automático." />
              <DemoAction label="Ver conversa · 6" variant="light" small icon="chat" title="Conversa da comunidade" text={comments} />
            </div>
          </section>
        </div>
        <aside className="stack">
          <div className="card">
            <h2>Espaços da turma</h2>
            <ListRow title="Descobertas de campo" desc="Entrevistas, observações e aprendizados" icon="search" />
            <ListRow title="Mão na massa" desc="Protótipos, métodos e ferramentas" icon="target" />
            <ListRow title="Conexões" desc="Parcerias e colaboração" icon="people" />
          </div>
          <div className="card">
            <h2>Compartilhe com cuidado</h2>
            <p className="sub">Publique aprendizados sem expor informações confidenciais, dados de entrevistados ou resultados protegidos do projeto.</p>
            <div className="divider" />
            <p className="tiny muted">Reconhecimento por contribuição útil, com avaliação. Curtidas não geram XP automaticamente.</p>
          </div>
        </aside>
      </div>
    </>
  );
}
