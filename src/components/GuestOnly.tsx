"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session";

// Telas de entrada: quem já está logado vai direto para a trilha.
export function GuestOnly({ children }: { children: React.ReactNode }) {
  const { loading, user, profile } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (user && profile) router.replace("/trilha/");
  }, [user, profile, router]);
  if (loading && user) return null;
  return <>{children}</>;
}
