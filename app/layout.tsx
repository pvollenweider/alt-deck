import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "ALT-DECK — Moteur de contraintes",
  description: "Un moteur de contraintes pour musiciens. Force des contraintes artistiques significatives en session.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[#f5f0eb] text-[#1a1a18]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#1a1a18] focus:text-white focus:text-sm focus:tracking-wider focus:uppercase"
        >
          Passer au contenu
        </a>
        <Nav />
        <main id="main-content" className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
