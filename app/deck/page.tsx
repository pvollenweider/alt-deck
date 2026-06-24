"use client";

import { useState, useRef, useCallback } from "react";
import { CARDS, Nature, totalScore, NATURE_BG } from "@/lib/cards";
import { CardDisplay } from "@/components/CardDisplay";

const NATURES: (Nature | "ALL")[] = ["ALL", "STRUCTURAL", "COGNITIVE", "SONIC", "PHYSICAL"];

export default function DeckPage() {
  const [activeNature, setActiveNature] = useState<Nature | "ALL">("ALL");

  const filtered = activeNature === "ALL"
    ? CARDS
    : CARDS.filter((c) => c.nature === activeNature);

  const filterBarRef = useRef<HTMLDivElement>(null);

  const handleFilterKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const buttons = filterBarRef.current?.querySelectorAll<HTMLButtonElement>("button");
    if (!buttons || buttons.length === 0) return;
    const arr = Array.from(buttons);
    const focused = arr.indexOf(document.activeElement as HTMLButtonElement);
    if (focused === -1) return;
    e.preventDefault();
    const next = e.key === "ArrowRight"
      ? (focused + 1) % arr.length
      : (focused - 1 + arr.length) % arr.length;
    arr[next].focus();
  }, []);

  const natureCount = (n: Nature | "ALL") =>
    n === "ALL" ? CARDS.length : CARDS.filter((c) => c.nature === n).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="text-[#6b6560] text-xs tracking-widest mb-2 uppercase font-medium">Toutes les contraintes</div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-widest text-[#1a1a18] font-mono">DECK</h1>
        <div className="w-10 h-0.5 bg-[#b84a30] mt-2" />
      </div>

      {/* Persistent live region — announces filter result count to screen readers */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {filtered.length} carte{filtered.length !== 1 ? "s" : ""} affichée{filtered.length !== 1 ? "s" : ""}
        {activeNature !== "ALL" ? `, nature ${activeNature}` : ""}
      </div>

      {/* Filter bar */}
      <div
        role="toolbar"
        aria-label="Filtrer par nature"
        ref={filterBarRef}
        onKeyDown={handleFilterKeyDown}
        className="flex overflow-x-auto mb-8 sm:mb-10 border border-[#ddd5cc] w-fit max-w-full bg-[#faf7f4]"
      >
        {NATURES.map((n) => (
          <button
            key={n}
            onClick={() => setActiveNature(n)}
            aria-pressed={activeNature === n}
            className={`shrink-0 px-3 sm:px-5 py-2 text-xs tracking-widest border-r border-[#ddd5cc] last:border-r-0 font-medium uppercase transition-colors ${
              activeNature === n
                ? n === "ALL"
                  ? "bg-[#b84a30] text-white"
                  : `${NATURE_BG[n as Nature]} text-white`
                : "text-[#6b6560] hover:text-[#1a1a18] hover:bg-[#f5f0eb]"
            }`}
          >
            {n === "ALL" ? "Tout" : n} ({natureCount(n)})
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((card) => (
          <CardDisplay key={card.id} card={card} />
        ))}
      </div>

      {/* Footer count */}
      <div className="mt-6 sm:mt-8 text-[#6b6560] text-xs tracking-widest uppercase">
        {filtered.length} sur {CARDS.length} cartes
        {filtered.length > 0 && (
          <span className="ml-4 sm:ml-6">
            Score min : {Math.min(...filtered.map(totalScore))} &nbsp;·&nbsp;
            Score max : {Math.max(...filtered.map(totalScore))}
          </span>
        )}
      </div>
    </div>
  );
}
