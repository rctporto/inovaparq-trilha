/* eslint-disable @next/next/no-img-element */
// Logomarca original (raster do anexo, apenas recortada nas margens). Substituir pelo vetor oficial quando disponível.
export function Brand({ small = false }: { small?: boolean }) {
  return (
    <span className={`brand${small ? " small" : ""}`}>
      <img src="/logo-inovaparq.png" alt="Inovaparq" width={142} height={42} />
    </span>
  );
}
