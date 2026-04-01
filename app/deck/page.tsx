"use client";

import { useState } from "react";
import { CARDS, Category, totalScore, CATEGORY_BG } from "@/lib/cards";
import { CardDisplay } from "@/components/CardDisplay";

const CATEGORIES: (Category | "ALL")[] = ["ALL", "STRUCTURE", "ROLE", "SOUND", "DEVICE"];

export default function DeckPage() {
  const [activeCategory, setActiveCategory] = useState<Category | "ALL">("ALL");

  const filtered = activeCategory === "ALL"
    ? CARDS
    : CARDS.filter((c) => c.category === activeCategory);

  const categoryCount = (cat: Category | "ALL") =>
    cat === "ALL" ? CARDS.length : CARDS.filter((c) => c.category === cat).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="text-[#6b6560] text-xs tracking-widest mb-2 uppercase font-medium">Toutes les contraintes</div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-widest text-[#1a1a18] font-mono">DECK</h1>
        <div className="w-10 h-0.5 bg-[#b84a30] mt-2" />
      </div>

      {/* Filter bar */}
      <div className="flex overflow-x-auto mb-8 sm:mb-10 border border-[#ddd5cc] w-fit max-w-full bg-[#faf7f4]">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 px-3 sm:px-5 py-2 text-xs tracking-widest border-r border-[#ddd5cc] last:border-r-0 font-medium uppercase transition-colors ${
              activeCategory === cat
                ? cat === "ALL"
                  ? "bg-[#b84a30] text-white"
                  : `${CATEGORY_BG[cat as Category]} text-white`
                : "text-[#6b6560] hover:text-[#1a1a18] hover:bg-[#f5f0eb]"
            }`}
          >
            {cat === "ALL" ? "Tout" : cat} ({categoryCount(cat)})
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
