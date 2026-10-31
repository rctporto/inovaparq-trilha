import { EmptyState, ListRow, PageHead } from "@/components/ui";

export function ComunidadeScreen() {
  return (
    <>
      <PageHead eyebrow="Aprender também é compartilhar" title="Boas ideias crescem em conversa." desc="Trocas da turma sobre os projetos em desenvolvimento." />
      <div className="grid wide">
        <div className="stack">
          <section className="card">
            <EmptyState icon="chat" title="Nenhuma publicação ainda" text="As publicações e conversas da turma aparecerão aqui quando a comunidade for aberta." />
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
          </div>
        </aside>
      </div>
    </>
  );
}
