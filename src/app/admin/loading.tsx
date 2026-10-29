import { Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Carregando">
      <Skeleton height={14} width={140} />
      <Skeleton height={34} width="45%" className="mt" />
      <div className="grid g4 mt">
        {[0, 1, 2, 3].map((i) => <Skeleton key={i} height={110} />)}
      </div>
      <Skeleton height={260} className="mt" />
    </div>
  );
}
