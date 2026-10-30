import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GamePlayer } from "@/components/games/GamePlayer";
import { Button, PageHead } from "@/components/ui";
import { gameById } from "@/lib/games/catalog";
import { gameProgress } from "@/lib/games/progress";
import { getCurrentUser } from "@/lib/session";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  return { title: gameById((await params).id)?.title ?? "Jogo" };
}

export default async function Jogo({ params }: { params: Promise<{ id: string }> }) {
  const game = gameById((await params).id);
  if (!game) notFound();
  const user = (await getCurrentUser())!;
  const progress = await gameProgress(user.id);
  return (
    <>
      <PageHead eyebrow={`Arena · fase ${game.phaseName}`} title={game.title} desc={game.mechanic} action={<Button href="/jogos" variant="light" icon="back">Todos os jogos</Button>} />
      <GamePlayer id={game.id} best={progress[game.id]?.best ?? 0} />
    </>
  );
}
