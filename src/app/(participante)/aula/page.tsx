import type { Metadata } from "next";
import { DemoAction } from "@/components/DemoAction";
import { LessonComplete, NotesField, Tabs } from "@/components/demo/Interactive";
import { Button, DemoRibbon, ListRow, PageHead, StatusBadge } from "@/components/ui";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = { title: "Ambiente de aprendizagem" };

export default function Aula() {
  return (
    <>
      <DemoRibbon />
      <PageHead eyebrow="Fase 04 · Aula 03" title="Como selecionar boas ideias" desc="Critérios claros para uma decisão melhor." action={<Button href="/fase/4" variant="light" icon="back">Voltar à fase</Button>} />
      <div className="grid wide">
        <div className="stack">
          <div className="video">
            <div className="eyebrow" style={{ color: "#a8d7da" }}>Oficina de inovação</div>
            <h2>Da lista de ideias<br />à solução prioritária.</h2>
            <span className="play" aria-hidden="true"><Icon name="play" /></span>
            <small>Vídeo ainda não produzido · o texto da aula está abaixo</small>
            <div className="video-line" />
          </div>
          <div className="card">
            <Tabs
              tabs={[
                {
                  id: "resumo",
                  label: "Resumo",
                  content: (
                    <>
                      <h2>Compare antes de escolher.</h2>
                      <p className="sub">Uma ideia pode parecer atraente e ainda depender de hipóteses frágeis. Avalie o problema atendido, a capacidade de execução e o que diferencia cada alternativa.</p>
                      <div className="grid g3 mt">
                        <div className="metric-mini"><b className="smalltext">Desejabilidade</b><p className="tiny muted">Isso resolve uma necessidade relevante?</p></div>
                        <div className="metric-mini"><b className="smalltext">Viabilidade</b><p className="tiny muted">É possível executar com os recursos disponíveis?</p></div>
                        <div className="metric-mini"><b className="smalltext">Diferenciação</b><p className="tiny muted">Que vantagem existe sobre as alternativas?</p></div>
                      </div>
                    </>
                  ),
                },
                { id: "materiais", label: "Materiais", content: <><h2>Materiais da aula</h2><p className="sub">Matriz de seleção: avalie necessidade, viabilidade e diferenciação de cada alternativa em uma escala de 1 a 5, registrando as evidências.</p></> },
                { id: "anotacoes", label: "Minhas anotações", content: <NotesField /> },
              ]}
            />
          </div>
          <div className="row between wrap">
            <span className="tiny muted">Concluir uma aula não concede aprovação automática da fase.</span>
            <LessonComplete />
          </div>
        </div>
        <aside className="card">
          <h2>Nesta fase</h2>
          <ListRow title="Criatividade aplicada" desc="12 min · concluída" icon="check" state="done" />
          <ListRow title="Caminhos para inovar" desc="10 min · concluída" icon="check" state="done" />
          <ListRow title="Selecionar boas ideias" desc="8 min · aula atual" icon="play" tail={<StatusBadge tone="plum">Agora</StatusBadge>} />
          <ListRow title="Viabilidade e proteção" desc="12 min · próxima aula" icon="book" />
          <div className="divider" />
          <h3>Aprenda fazendo</h3>
          <p className="sub">Use a matriz de critérios no desafio do seu projeto.</p>
          <div className="mt"><Button href="/missao" variant="light" small>Ir para a missão</Button></div>
          <div className="mt"><DemoAction label="Roteiro da aula" variant="ghost" small icon="eye" title="Conteúdo de exemplo" text="1. Liste as alternativas. 2. Defina critérios antes de comparar. 3. Registre o que é evidência e o que é hipótese. 4. Escolha o próximo teste. O vídeo final ainda deverá ser produzido." /></div>
        </aside>
      </div>
    </>
  );
}
