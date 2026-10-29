import type { Metadata } from "next";
import { DemoAction } from "@/components/DemoAction";
import { DemoRibbon, ListRow, PageHead, StatusBadge } from "@/components/ui";
import { PHASES } from "@/lib/demo";

export const metadata: Metadata = { title: "Gestão de conteúdo" };

export default function Conteudos() {
  return (
    <>
      <DemoRibbon />
      <PageHead eyebrow="Arquitetura de aprendizagem" title="Conteúdo que vira prática." desc="Organize fases, aulas, missões e critérios de avaliação." action={<DemoAction label="Nova versão da trilha" icon="plus" title="Versionamento da trilha" text="Uma nova versão começa como rascunho. A publicação deve preservar a versão vinculada às turmas já em andamento." />} />
      <div className="grid reverse">
        <aside className="card">
          <div className="row between mb"><h2>Trilha principal</h2><StatusBadge>v1.0</StatusBadge></div>
          {PHASES.map((p, i) => (
            <div key={p.name} className={`navlink ${i === 3 ? "active" : ""}`}>
              <span className={`circle ${i === 3 ? "active" : ""}`}>{i + 1}</span>
              {p.name}
            </div>
          ))}
        </aside>
        <section className="card">
          <div className="row between mb"><h2>Fase 04 · Criador</h2><StatusBadge tone="green">Publicada</StatusBadge></div>
          <label className="field">Título da fase<input defaultValue="Concepção da inovação" /></label>
          <label className="field">Objetivo de aprendizagem<textarea style={{ minHeight: 75 }} defaultValue="Desenvolver e comparar alternativas de solução, selecionando uma com base em critérios e evidências." /></label>
          <div className="row between mt mb">
            <h3>Treinamentos</h3>
            <DemoAction label="Adicionar aula" variant="light" small icon="plus" title="Adicionar treinamento" text="Campos: título, objetivo, conteúdo textual, vídeo, duração, materiais, acessibilidade e relação com a missão da fase." />
          </div>
          <ListRow title="Criatividade aplicada a problemas" desc="Vídeo + texto + exercício · 12 min" icon="book" />
          <ListRow title="Caminhos para inovar" desc="Vídeo + caso comentado · 10 min" icon="book" />
          <ListRow title="Como selecionar boas ideias" desc="Vídeo + matriz de critérios · 8 min" icon="book" />
          <ListRow title="Viabilidade, impacto e proteção" desc="Vídeo + checklist · 12 min" icon="book" />
          <div className="grid g2 mt">
            <label className="field">Nota mínima da avaliação (%)<input type="number" defaultValue={80} min={0} max={100} /></label>
            <label className="field">Nota mínima da missão (/100)<input type="number" defaultValue={70} min={0} max={100} /></label>
          </div>
          <div className="row between wrap">
            <DemoAction label="Salvar rascunho" variant="light" icon="file" toast="Demonstração: o editor versionado de conteúdo chega na etapa 7." />
            <DemoAction label="Revisar publicação" icon="eye" text="Na versão final, verificar conteúdo obrigatório, rubricas, questões, acessibilidade, pré-requisitos e versão antes de publicar." />
          </div>
        </section>
      </div>
    </>
  );
}
