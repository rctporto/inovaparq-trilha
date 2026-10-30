import type { Metadata } from "next";
import { DemoAction } from "@/components/DemoAction";
import { Switch } from "@/components/demo/Interactive";
import { DemoRibbon, PageHead } from "@/components/ui";
import { Brand } from "@/components/ui/Brand";

export const metadata: Metadata = { title: "Configurações da jornada" };

export default function Configuracoes() {
  return (
    <>
      <DemoRibbon>Configurações demonstrativas. As regras versionadas serão gravadas no banco na etapa 7.</DemoRibbon>
      <PageHead eyebrow="Regras do programa" title="Uma jornada clara para todos." desc="Parâmetros, identidade e critérios de progressão." action={<DemoAction label="Salvar configurações" icon="check" toast="Demonstração: nada foi alterado. Regras publicadas serão versionadas." />} />
      <div className="grid g2">
        <section className="card">
          <h2>Progressão e avaliação</h2>
          <div className="grid g2 mt">
            <label className="field">XP máximo por fase<input type="number" defaultValue={500} readOnly /></label>
            <label className="field">Fases da trilha<input type="number" defaultValue={10} readOnly /></label>
            <label className="field">Avaliação teórica mínima (%)<input type="number" defaultValue={80} min={0} max={100} /></label>
            <label className="field">Entrega prática mínima (/100)<input type="number" defaultValue={70} min={0} max={100} /></label>
          </div>
          <div className="row between mb"><div><h3>Permitir novas tentativas</h3><span className="tiny muted">Sem concessão duplicada de XP.</span></div><Switch label="Permitir novas tentativas" defaultOn /></div>
          <div className="row between mb"><div><h3>Ranking público</h3><span className="tiny muted">Desativado por padrão.</span></div><Switch label="Ranking público" defaultOn={false} /></div>
          <div className="row between"><div><h3>Revisão humana das missões</h3><span className="tiny muted">Aprovação realizada por avaliador autorizado.</span></div><Switch label="Revisão humana obrigatória" defaultOn disabled /></div>
          <div className="notice mt">Regras publicadas precisam ser versionadas. Mudanças não devem alterar retroativamente conquistas existentes.</div>
        </section>
        <section className="card">
          <h2>Identidade e comunicação</h2>
          <div className="mt mb"><Brand /></div>
          <div className="grid g3">
            {[["#922878", "Magenta"], ["#287d8e", "Azul-petróleo"], ["#263b42", "Texto"]].map(([c, n]) => (
              <div key={c}><div className="color-swatch" style={{ background: c }} /><b className="tiny">{n}</b><p className="tiny muted">{c.toUpperCase()}</p></div>
            ))}
          </div>
          <p className="tiny muted">Paleta de interface aproximada a partir da referência enviada. Validar com o manual oficial da marca.</p>
          <label className="field mt">Nome de apresentação<input defaultValue="Jornada empreendedora" /></label>
          <label className="field">Idioma e fuso<select><option>Português do Brasil · America/Sao_Paulo</option></select></label>
          <div className="notice">Informações de privacidade, acessibilidade e suporte devem estar disponíveis em todas as áreas.</div>
        </section>
      </div>
    </>
  );
}
