import { phases } from "@/content/trilha";
import { FaseView } from "./FaseView";

export const dynamicParams = false;
export function generateStaticParams() {
  return phases.map((p) => ({ id: p.id }));
}

export default async function FasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FaseView id={id} />;
}
