import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

type Tone = "teal" | "plum" | "green" | "gold" | "gray" | "red";
type Variant = "primary" | "teal" | "light" | "ghost" | "danger";

const variantClass: Record<Variant, string> = { primary: "", teal: "teal", light: "light", ghost: "ghost", danger: "danger" };

export function Button({
  children,
  href,
  icon = "arrow",
  variant = "primary",
  small,
  full,
  disabledReason,
  ...props
}: {
  children: ReactNode;
  href?: string;
  icon?: IconName | null;
  variant?: Variant;
  small?: boolean;
  full?: boolean;
  /** Ação indisponível: o botão fica desativado e o motivo é exibido. */
  disabledReason?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const cls = ["btn", variantClass[variant], small && "small", full && "full", props.className].filter(Boolean).join(" ");
  if (disabledReason)
    return (
      <button {...props} className={cls} disabled title={disabledReason}>
        <Icon name="lock" />
        {disabledReason}
      </button>
    );
  if (href)
    return (
      <Link href={href} className={cls}>
        {children}
        {icon && <Icon name={icon} />}
      </Link>
    );
  return (
    <button type="button" {...props} className={cls}>
      {children}
      {icon && <Icon name={icon} />}
    </button>
  );
}

export function StatusBadge({ children, tone = "teal" }: { children: ReactNode; tone?: Tone }) {
  return <span className={`tag ${tone === "teal" ? "" : tone}`}>{children}</span>;
}

export function Card({ children, className = "", as: Tag = "section" }: { children: ReactNode; className?: string; as?: "section" | "div" | "aside" }) {
  return <Tag className={`card ${className}`}>{children}</Tag>;
}

export function ProgressBar({ value, tone = "teal", label }: { value: number; tone?: "teal" | "plum"; label: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={`progress ${tone === "plum" ? "plum" : ""}`} role="progressbar" aria-valuenow={Math.round(v)} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <span style={{ width: `${v}%` }} />
    </div>
  );
}

export function StatCard({ label, value, note, icon = "chart" }: { label: string; value: ReactNode; note: string; icon?: IconName }) {
  return (
    <div className="card stat">
      <div className="stat-label">
        {label}
        <Icon name={icon} />
      </div>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  );
}

export function PageHead({ eyebrow, title, desc, action }: { eyebrow: string; title: string; desc: string; action?: ReactNode }) {
  return (
    <div className="pagehead">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p className="sub">{desc}</p>
      </div>
      {action}
    </div>
  );
}

export function ListRow({ title, desc, icon = "file", tail, state }: { title: ReactNode; desc: ReactNode; icon?: IconName; tail?: ReactNode; state?: "done" | "active" | "lock" }) {
  return (
    <div className="listrow">
      <span className={`circle ${state ?? ""}`}>
        <Icon name={icon} />
      </span>
      <div className="grow">
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
      {tail}
    </div>
  );
}

export type PhaseState = "done" | "current" | "locked";

export function PhaseCard({ index, name, theme, state, href }: { index: number; name: string; theme: string; state: PhaseState; href: string }) {
  return (
    <section className={`card phase ${state}`} aria-label={`Fase ${index}: ${name}`}>
      <div className="phase-top">
        <span className={`circle ${state === "done" ? "done" : state === "current" ? "active" : "lock"}`}>
          {state === "done" ? <Icon name="check" /> : String(index).padStart(2, "0")}
        </span>
        {state === "locked" ? (
          <Icon name="lock" label="Bloqueada" />
        ) : (
          <StatusBadge tone={state === "done" ? "green" : "plum"}>{state === "done" ? "Concluída" : "Sua fase"}</StatusBadge>
        )}
      </div>
      <h3>{name}</h3>
      <p>{theme}</p>
      <div className="phase-bottom">
        <span>500 XP</span>
        {state === "locked" ? (
          <span>Após fase anterior</span>
        ) : (
          <Button href={href} small variant={state === "done" ? "light" : "primary"}>
            {state === "done" ? "Revisitar" : "Continuar"}
          </Button>
        )}
      </div>
    </section>
  );
}

export function FormField({
  label,
  name,
  hint,
  error,
  children,
  ...input
}: { label: string; name: string; hint?: string; error?: string; children?: ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = `f-${name}`;
  return (
    <label className="field" htmlFor={id}>
      {label}
      {children ?? <input id={id} name={name} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined} {...input} />}
      {hint && !error && <small id={`${id}-hint`}>{hint}</small>}
      {error && (
        <span className="error" id={`${id}-err`} role="alert">
          {error}
        </span>
      )}
    </label>
  );
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  empty,
  caption,
}: {
  columns: { header: string; cell: (row: T) => ReactNode }[];
  rows: T[];
  rowKey: (row: T) => string;
  empty?: ReactNode;
  caption?: string;
}) {
  if (!rows.length) return <>{empty ?? <EmptyState title="Nada por aqui" text="Nenhum registro encontrado." />}</>;
  return (
    <div className="table-wrap">
      <table>
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th key={i} scope="col">
                {c.header.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={rowKey(r)}>
              {columns.map((c, i) => (
                <td key={i}>{c.cell(r)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function EmptyState({ title, text, icon = "search", action }: { title: string; text: string; icon?: IconName; action?: ReactNode }) {
  return (
    <div className="empty">
      <div className="feature-icon">
        <Icon name={icon} />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}

export function Skeleton({ height = 16, width = "100%", className = "" }: { height?: number; width?: number | string; className?: string }) {
  return <div className={`skeleton ${className}`} style={{ height, width }} aria-hidden="true" />;
}

export function Notice({ children, tone }: { children: ReactNode; tone?: "rose" | "gold" | "success" | "error" }) {
  return <div className={`notice ${tone ?? ""}`}>{children}</div>;
}

export function DemoRibbon({ children }: { children?: ReactNode }) {
  return (
    <div className="demo-ribbon" role="note">
      <Icon name="eye" />
      <span>{children ?? "Dados demonstrativos desta etapa. Pessoas, projetos e números são fictícios e serão substituídos pelos dados reais do banco."}</span>
    </div>
  );
}

export function Avatar({ initials, tone, image }: { initials: string; tone?: "teal" | "gold"; image?: string | null }) {
  return (
    <span className={`avatar ${tone ?? ""}`} aria-hidden={image ? undefined : true}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {image ? <img src={image} alt="" referrerPolicy="no-referrer" /> : initials}
    </span>
  );
}

export function initialsOf(name?: string | null, email?: string | null) {
  const base = (name || email || "?").trim();
  const parts = base.split(/[\s@.]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "?") + (parts[1]?.[0] ?? "")).toUpperCase();
}
