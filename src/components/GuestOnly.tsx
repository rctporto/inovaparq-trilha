"use client";

import { useGate } from "@/lib/session";

// Telas de entrada: quem já está logado vai para a página que vale para a sua situação.
export function GuestOnly({ children }: { children: React.ReactNode }) {
  const s = useGate("/");
  if (!s) return null;
  return <>{children}</>;
}
