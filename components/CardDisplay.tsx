"use client";

import {
  Card,
  totalScore,
  overallDifficulty,
  NATURE_BG,
  NATURE_DOT,
  NATURE_BORDER,
  ROLE_LABELS,
} from "@/lib/cards";

interface CardDisplayProps {
  card: Card;
  size?: "default" | "large";
  showScore?: boolean;
}

export function CardDisplay({ card, size = "default", showScore = true }: CardDisplayProps) {
  const score = totalScore(card);
  const diff = overallDifficulty(card);
  const isLarge = size === "large";

  const riskLabel = card.risk === 3 ? "RISQUE ÉLEVÉ" : card.risk === 2 ? "RISQUE MOYEN" : "RISQUE FAIBLE";
  const riskClass =
    card.risk === 3
      ? "border-[#b84a30] text-[#b84a30] bg-[#fdf2ef]"
      : card.risk === 2
      ? "border-[#9a7820] text-[#9a7820] bg-[#faf6ec]"
      : "border-[#ddd5cc] text-[#6b6560]";

  return (
    <div
      className={`h-full bg-[#faf7f4] border-l-4 ${NATURE_BORDER[card.nature]} border border-[#ddd5cc] ${
        isLarge ? "p-8" : "p-5"
      } flex flex-col gap-4`}
      style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}
    >
      {/* Nature badge + role badge + score */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`${NATURE_BG[card.nature]} text-white text-xs font-bold px-2 py-1 tracking-widest uppercase`}
            style={{ borderRadius: "2px" }}
          >
            {card.nature}
          </span>
          <span
            className="text-[#6b6560] text-xs border border-[#ddd5cc] px-2 py-1 tracking-widest uppercase bg-[#f5f0eb]"
            style={{ borderRadius: "2px" }}
          >
            {ROLE_LABELS[card.role]}
          </span>
        </div>
        {showScore && (
          <span className="text-[#6b6560] text-xs tracking-widest shrink-0">
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

      {/* Rules */}
      <ul className={`${isLarge ? "text-sm" : "text-xs"} text-[#6b6560] leading-relaxed space-y-1.5 border-l-2 border-[#ddd5cc] pl-3`}>
        {card.rules.map((rule, i) => (
          <li key={i}>{rule}</li>
        ))}
      </ul>

      {/* Difficulty dots */}
      <div className="flex items-center gap-3 mt-auto">
        <span className="text-[#6b6560] text-xs tracking-widest uppercase">Difficulté</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((d) => (
            <div
              key={d}
              className={`w-2 h-2 rounded-full ${
                d <= diff ? NATURE_DOT[card.nature] : "bg-[#ddd5cc]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Difficulty breakdown */}
      {showScore && (
        <div className="border-t border-[#ddd5cc] pt-3 grid grid-cols-3 gap-2 text-xs">
          <div className="flex flex-col gap-1">
            <span className="text-[#6b6560] uppercase tracking-wider">Structure</span>
            <span className="text-[#1a1a18] font-semibold">{card.difficulty.structural}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[#6b6560] uppercase tracking-wider">Désorientation</span>
            <span className="text-[#1a1a18] font-semibold">{card.difficulty.disorientation}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[#6b6560] uppercase tracking-wider">Performance</span>
            <span className="text-[#1a1a18] font-semibold">{card.difficulty.performance}</span>
          </div>
        </div>
      )}

      {/* Risk */}
      <div className="flex justify-end">
        <span className={`text-xs border px-2 py-0.5 uppercase tracking-wider font-medium ${riskClass}`}>
          {riskLabel}
        </span>
      </div>
    </div>
  );
}
