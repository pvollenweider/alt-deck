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
    <html lang="fr" className="h-full">
      <body className="min-h-full flex flex-col bg-[#f5f0eb] text-[#1a1a18]">
        <Nav />
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
