/* eslint-disable @next/next/no-img-element */
// Logomarca oficial (versão colorida digital, PNG com fundo transparente). Substituir pelo vetor quando disponível.
export function Brand({ small = false }: { small?: boolean }) {
  return (
    <span className={`brand${small ? " small" : ""}`}>
      <img src="/brand/inovaparq-logo.png" alt="Inovaparq" width={436} height={96} />
    </span>
  );
}
