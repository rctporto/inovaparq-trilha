import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { SessionProvider } from "@/lib/session";

export const metadata: Metadata = {
  title: "Inovaparq · Trilha de Inovação",
  description: "Plataforma gamificada de inovação do Inovaparq",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <SessionProvider>
          <Header />
          <main className="container">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
