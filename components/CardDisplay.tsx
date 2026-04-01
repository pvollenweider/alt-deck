"use client";

import { Card, totalScore, CATEGORY_BG, CATEGORY_DOT, CATEGORY_BORDER, CATEGORY_TEXT } from "@/lib/cards";

interface CardDisplayProps {
  card: Card;
  size?: "default" | "large";
  showScore?: boolean;
}

export function CardDisplay({ card, size = "default", showScore = true }: CardDisplayProps) {
  const score = totalScore(card);
  const isLarge = size === "large";

  return (
    <div
      className={`bg-[#faf7f4] border-l-4 ${CATEGORY_BORDER[card.category]} border border-[#ddd5cc] ${
        isLarge ? "p-8" : "p-5"
      } flex flex-col gap-4`}
      style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}
    >
      {/* Category badge + score */}
      <div className="flex items-center justify-between">
        <span
          className={`${CATEGORY_BG[card.category]} text-white text-xs font-bold px-2 py-1 tracking-widest uppercase`}
          style={{ borderRadius: "2px" }}
        >
          {card.category}
        </span>
        {showScore && (
          <span className="text-[#6b6560] text-xs tracking-widest">
            SCORE{" "}
            <span className={`font-bold ${score >= 8 ? "text-[#1a1a18]" : "text-[#b84a30]"}`}>
              {score}
            </span>
            /15
          </span>
        )}
      </div>

      {/* Title */}
      <div className={`${isLarge ? "text-3xl" : "text-xl"} font-bold text-[#1a1a18] tracking-wider font-mono`}>
        {card.title}
      </div>

      {/* Description */}
      <div className={`${isLarge ? "text-base" : "text-sm"} text-[#4f4f49] leading-relaxed`}>
        {card.description}
      </div>

      {/* Example */}
      <div className={`${isLarge ? "text-sm" : "text-xs"} text-[#6b6560] leading-relaxed italic border-l-2 border-[#ddd5cc] pl-3`}>
        {card.example}
      </div>

      {/* Difficulty dots */}
      <div className="flex items-center gap-3 mt-auto">
        <span className="text-[#6b6560] text-xs tracking-widest uppercase">Difficulté</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((d) => (
            <div
              key={d}
              className={`w-2 h-2 rounded-full ${
                d <= card.difficulty
                  ? CATEGORY_DOT[card.category]
                  : "bg-[#ddd5cc]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Scores breakdown */}
      {showScore && (
        <div className="border-t border-[#ddd5cc] pt-3 grid grid-cols-3 gap-2 text-xs">
          <div className="flex flex-col gap-1">
            <span className="text-[#6b6560] uppercase tracking-wider">Structure</span>
            <span className="text-[#1a1a18] font-semibold">{card.scores.structural_impact}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[#6b6560] uppercase tracking-wider">Inconfort</span>
            <span className="text-[#1a1a18] font-semibold">{card.scores.performer_discomfort}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[#6b6560] uppercase tracking-wider">Perceptif</span>
            <span className="text-[#1a1a18] font-semibold">{card.scores.perceptual_change}</span>
          </div>
        </div>
      )}

      {/* Tags + risk */}
      <div className="flex flex-wrap gap-2">
        {card.tags.map((tag) => (
          <span key={tag} className="text-[#6b6560] text-xs border border-[#ddd5cc] px-2 py-0.5 uppercase tracking-wider bg-[#f5f0eb]">
            {tag}
          </span>
        ))}
        <span
          className={`text-xs border px-2 py-0.5 uppercase tracking-wider ml-auto font-medium ${
            card.risk_level === "high"
              ? "border-[#b84a30] text-[#b84a30] bg-[#fdf2ef]"
              : card.risk_level === "medium"
              ? "border-[#9a7820] text-[#9a7820] bg-[#faf6ec]"
              : "border-[#ddd5cc] text-[#6b6560]"
          }`}
        >
          {card.risk_level === "high" ? "RISQUE ÉLEVÉ" : card.risk_level === "medium" ? "RISQUE MOYEN" : "RISQUE FAIBLE"}
        </span>
      </div>
    </div>
  );
}
