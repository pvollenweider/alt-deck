import Link from "next/link";
import { CARDS, totalScore } from "@/lib/cards";

export default function HomePage() {
  const totalCards = CARDS.length;
  const avgScore = Math.round(
    CARDS.reduce((sum, c) => sum + totalScore(c), 0) / CARDS.length
  );

  const sections = [
    {
      href: "/deck",
      label: "DECK",
      description: "Parcourir toutes les cartes de contraintes. Filtrer par nature.",
      detail: `${totalCards} cartes, 4 natures`,
    },
    {
      href: "/generate",
      label: "GÉNÉRER",
      description: "Générer une session de contraintes aléatoire. Pondérée par difficulté et fraîcheur.",
      detail: "Sélection aléatoire pondérée",
    },
    {
      href: "/curate",
      label: "CURATION",
      description: "Saisir le profil du groupe. Obtenir 3 paires de contraintes classées.",
      detail: "Curation par profil",
    },
    {
      href: "/session",
      label: "SESSION",
      description: "Affichage de la session active. Deux cartes, grandes et lisibles.",
      detail: "Vue performance",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-16">
        <div className="text-[#6b6560] text-xs tracking-widest mb-4 uppercase font-medium">
          Moteur de contraintes v3
        </div>
        <h1 className="text-5xl font-bold tracking-widest text-[#1a1a18] mb-2 font-mono">
          ALT-DECK
        </h1>
        <div className="w-16 h-0.5 bg-[#b84a30] mb-6" />
        <p className="text-[#6b6560] text-sm leading-relaxed max-w-xl">
          Un système de contraintes rigide pour musiciens. Pas un assistant créatif. Pas un outil de suggestion.
          Une fonction de forçage. Deux cartes. Une session. Pas de négociation.
        </p>
      </div>

      {/* Stats bar */}
      <div className="border border-[#ddd5cc] grid grid-cols-3 mb-16 bg-[#faf7f4]" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div className="border-r border-[#ddd5cc] p-6">
          <div className="text-[#6b6560] text-xs tracking-widest mb-1 uppercase">Total cartes</div>
          <div className="text-3xl font-bold text-[#1a1a18]">{totalCards}</div>
        </div>
        <div className="border-r border-[#ddd5cc] p-6">
          <div className="text-[#6b6560] text-xs tracking-widest mb-1 uppercase">Score moy.</div>
          <div className="text-3xl font-bold text-[#1a1a18]">{avgScore}<span className="text-lg text-[#6b6560] font-normal">/15</span></div>
        </div>
        <div className="p-6">
          <div className="text-[#6b6560] text-xs tracking-widest mb-2 uppercase">Natures</div>
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs bg-[#b84a30] text-white px-2 py-0.5 font-medium tracking-wider">STRUCTURAL</span>
            <span className="text-xs bg-[#2d5fa0] text-white px-2 py-0.5 font-medium tracking-wider">COGNITIVE</span>
            <span className="text-xs bg-[#2d7a53] text-white px-2 py-0.5 font-medium tracking-wider">SONIC</span>
            <span className="text-xs bg-[#9a7820] text-white px-2 py-0.5 font-medium tracking-wider">PHYSICAL</span>
          </div>
        </div>
      </div>

      {/* Nav sections */}
      <div className="grid grid-cols-2 gap-0 border border-[#ddd5cc] bg-[#faf7f4]" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        {sections.map((section, i) => (
          <Link
            key={section.href}
            href={section.href}
            className={`p-8 border-[#ddd5cc] hover:bg-[#f5f0eb] group transition-colors ${
              i % 2 === 0 ? "border-r" : ""
            } ${i < 2 ? "border-b" : ""}`}
          >
            <div className="text-[#6b6560] text-xs tracking-widest mb-3 uppercase font-medium">
              {section.detail}
            </div>
            <div className="text-xl font-bold text-[#1a1a18] tracking-widest mb-3 group-hover:text-[#b84a30] transition-colors font-mono">
              {section.label} →
            </div>
            <div className="text-[#6b6560] text-sm leading-relaxed">
              {section.description}
            </div>
          </Link>
        ))}
      </div>

      {/* Rule block */}
      <div className="mt-16 border border-[#ddd5cc] p-8 bg-[#faf7f4]" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div className="text-[#6b6560] text-xs tracking-widest mb-6 uppercase font-medium">Règles fondamentales</div>
        <div className="grid grid-cols-3 gap-8 text-sm">
          <div>
            <div className="text-[#1a1a18] mb-2 font-bold tracking-wider uppercase text-xs">Score</div>
            <div className="text-[#6b6560] leading-relaxed">
              Chaque carte est notée de 3 à 15. Structure + désorientation + performance.
              Les cartes doivent scorer ≥ 8 (sauf STABILISATEUR).
            </div>
          </div>
          <div>
            <div className="text-[#1a1a18] mb-2 font-bold tracking-wider uppercase text-xs">Rôles</div>
            <div className="text-[#6b6560] leading-relaxed">
              Max 1 DESTRUCTEUR par session. Au moins 1 TRANSFORMATIF.
              Si risque cumulé &gt; 5, un STABILISATEUR est requis.
            </div>
          </div>
          <div>
            <div className="text-[#1a1a18] mb-2 font-bold tracking-wider uppercase text-xs">Natures</div>
            <div className="text-[#6b6560] leading-relaxed">
              Deux cartes de même nature ne peuvent pas être associées. Chaque session croise les frontières : STRUCTURAL, COGNITIVE, SONIC, PHYSICAL.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
