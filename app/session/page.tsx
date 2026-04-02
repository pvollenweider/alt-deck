"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, totalScore, overallDifficulty, NATURE_BG, NATURE_BORDER, ROLE_LABELS } from "@/lib/cards";
import { generateSession, generateThirdCard, computeTension } from "@/lib/engine";

interface ActiveSession {
  card1: Card;
  card2: Card;
  card3?: Card;
}

function SessionCard({ card, label }: { card: Card; label: string }) {
  const score = totalScore(card);
  const diff = overallDifficulty(card);
  const riskLabel = card.risk === 3 ? "RISQUE ÉLEVÉ" : card.risk === 2 ? "RISQUE MOYEN" : "RISQUE FAIBLE";
  const riskClass =
    card.risk === 3
      ? "border-[#b84a30] text-[#b84a30] bg-[#fdf2ef]"
      : card.risk === 2
      ? "border-[#9a7820] text-[#9a7820] bg-[#faf6ec]"
      : "border-[#ddd5cc] text-[#6b6560]";

  return (
    <div
      className={`bg-[#faf7f4] border-l-4 ${NATURE_BORDER[card.nature]} border border-[#ddd5cc] p-6 sm:p-10 flex flex-col gap-4 sm:gap-6`}
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`${NATURE_BG[card.nature]} text-white text-xs font-bold px-3 py-1 tracking-widest uppercase`}
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
        <span className="text-[#6b6560] text-xs tracking-widest uppercase">{label}</span>
      </div>

      {/* Title */}
      <div className="text-3xl sm:text-5xl font-bold text-[#1a1a18] tracking-wider leading-none font-mono">
        {card.title}
      </div>

      {/* Description */}
      <div className="text-base sm:text-lg text-[#4f4f49] leading-relaxed">
        {card.description}
      </div>

      {/* Rules */}
      <ul className="text-sm text-[#6b6560] leading-relaxed space-y-2 border-l-2 border-[#ddd5cc] pl-4 flex-1">
        {card.rules.map((rule, i) => (
          <li key={i}>{rule}</li>
        ))}
      </ul>

      {/* Difficulty */}
      <div className="flex items-center gap-3">
        <span className="text-[#6b6560] text-xs tracking-widest uppercase">Difficulté</span>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((d) => (
            <div
              key={d}
              className={`w-3 h-3 rounded-full ${d <= diff ? "bg-[#b84a30]" : "bg-[#ddd5cc]"}`}
            />
          ))}
        </div>
      </div>

      {/* Score bar */}
      <div className="border-t border-[#ddd5cc] pt-4 sm:pt-5 flex items-center justify-between">
        <div className="flex gap-4 sm:gap-6 text-xs text-[#6b6560]">
          <span>
            STR <span className="text-[#4f4f49] font-semibold">{card.difficulty.structural}</span>
          </span>
          <span>
            DIS <span className="text-[#4f4f49] font-semibold">{card.difficulty.disorientation}</span>
          </span>
          <span>
            PER <span className="text-[#4f4f49] font-semibold">{card.difficulty.performance}</span>
          </span>
        </div>
        <div className="text-sm">
          <span className="text-[#6b6560] text-xs tracking-widest mr-2 uppercase">Score </span>
          <span className={`font-bold ${score >= 8 ? "text-[#1a1a18]" : "text-[#b84a30]"}`}>{score}</span>
          <span className="text-[#6b6560]">/15</span>
        </div>
      </div>

      {/* Risk */}
      <div className="flex justify-end">
        <span className={`text-xs border px-2 py-0.5 uppercase tracking-wider font-medium ${riskClass}`}>
          {riskLabel}
        </span>
      </div>
    </div>
  );
}

export default function SessionPage() {
  const router = useRouter();
  const [session, setSession] = useState<ActiveSession | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("altdeck_active_session");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ActiveSession;
        // Discard sessions saved under the old schema (pre-v2: no rules/difficulty fields)
        const isValid = (c: Card) =>
          Array.isArray(c.rules) && c.difficulty != null && typeof c.difficulty === "object";
        if (isValid(parsed.card1) && isValid(parsed.card2)) {
          setSession(parsed);
        } else {
          sessionStorage.removeItem("altdeck_active_session");
        }
      } catch {
        sessionStorage.removeItem("altdeck_active_session");
      }
    }
    setLoaded(true);
  }, []);

  const handleQuickGenerate = () => {
    const result = generateSession([]);
    if (result) {
      const newSession = { card1: result.card1, card2: result.card2 };
      sessionStorage.setItem("altdeck_active_session", JSON.stringify(newSession));
      setSession(newSession);
    }
  };

  const handleAddThirdCard = () => {
    if (!session) return;
    const card3 = generateThirdCard(session.card1, session.card2, []);
    if (card3) {
      const updated = { ...session, card3 };
      sessionStorage.setItem("altdeck_active_session", JSON.stringify(updated));
      setSession(updated);
    }
  };

  const handleRemoveThirdCard = () => {
    if (!session) return;
    const updated = { card1: session.card1, card2: session.card2 };
    sessionStorage.setItem("altdeck_active_session", JSON.stringify(updated));
    setSession(updated);
  };

  if (!loaded) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-[#6b6560] text-xs tracking-widest">CHARGEMENT...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-6 sm:mb-8">
          <div className="text-[#6b6560] text-xs tracking-widest mb-2 uppercase font-medium">Vue performance</div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-widest text-[#1a1a18] font-mono">SESSION</h1>
          <div className="w-10 h-0.5 bg-[#b84a30] mt-2" />
        </div>

        <div className="border border-[#ddd5cc] p-8 sm:p-12 text-center bg-[#faf7f4]">
          <div className="text-[#4f4f49] text-sm tracking-wider mb-6 sm:mb-8 uppercase font-medium">
            Aucune session active
          </div>
          <div className="text-[#6b6560] text-xs tracking-wider mb-8 sm:mb-10 max-w-md mx-auto leading-relaxed">
            Aller sur GÉNÉRER ou CURATION pour créer une session, ou générer rapidement ici.
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleQuickGenerate}
              className="text-sm tracking-widest px-8 sm:px-10 py-3 bg-[#b84a30] text-white font-bold hover:bg-[#8c3622] uppercase transition-colors"
              style={{ borderRadius: "2px" }}
            >
              GÉNÉRATION RAPIDE →
            </button>
            <button
              onClick={() => router.push("/generate")}
              className="text-sm tracking-widest px-8 sm:px-10 py-3 border border-[#ddd5cc] text-[#6b6560] hover:text-[#1a1a18] hover:border-[#1a1a18] uppercase transition-colors bg-[#faf7f4]"
              style={{ borderRadius: "2px" }}
            >
              ALLER À GÉNÉRER
            </button>
          </div>
        </div>
      </div>
    );
  }

  const score1 = totalScore(session.card1);
  const score2 = totalScore(session.card2);
  const score3 = session.card3 ? totalScore(session.card3) : null;
  const totalLoad = score1 + score2 + (score3 ?? 0);
  const maxLoad = session.card3 ? 45 : 30;
  const allCards = session.card3
    ? [session.card1, session.card2, session.card3]
    : [session.card1, session.card2];
  const tension = computeTension(allCards);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <div className="text-[#6b6560] text-xs tracking-widest mb-2 uppercase font-medium">Vue performance</div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-widest text-[#1a1a18] font-mono">SESSION</h1>
          <div className="w-10 h-0.5 bg-[#b84a30] mt-2" />
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="text-[#6b6560] text-xs tracking-widest px-3 sm:px-4 py-2 border border-[#ddd5cc] bg-[#faf7f4] uppercase">
            Charge : {totalLoad}/{maxLoad}
          </div>
          {!session.card3 && (
            <button
              onClick={handleAddThirdCard}
              className="text-xs tracking-widest px-4 sm:px-6 py-2 border border-[#9a7820] text-[#9a7820] hover:bg-[#9a7820] hover:text-white uppercase transition-colors bg-[#faf7f4] font-bold"
              style={{ borderRadius: "2px" }}
            >
              + 3ÈME
            </button>
          )}
          {session.card3 && (
            <button
              onClick={handleRemoveThirdCard}
              className="text-xs tracking-widest px-4 sm:px-6 py-2 border border-[#ddd5cc] text-[#6b6560] hover:text-[#b84a30] hover:border-[#b84a30] uppercase transition-colors bg-[#faf7f4]"
              style={{ borderRadius: "2px" }}
            >
              RETIRER 3ÈME
            </button>
          )}
          <button
            onClick={() => router.push("/generate")}
            className="text-xs tracking-widest px-4 sm:px-6 py-2 border border-[#ddd5cc] text-[#6b6560] hover:text-[#1a1a18] hover:border-[#1a1a18] uppercase transition-colors bg-[#faf7f4]"
            style={{ borderRadius: "2px" }}
          >
            NOUVELLE
          </button>
          <button
            onClick={handleQuickGenerate}
            className="text-xs tracking-widest px-4 sm:px-6 py-2 bg-[#b84a30] text-white font-bold hover:bg-[#8c3622] uppercase transition-colors"
            style={{ borderRadius: "2px" }}
          >
            ALÉATOIRE
          </button>
        </div>
      </div>

      {/* Validation status */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-6 border border-[#ddd5cc] bg-[#faf7f4] px-4 sm:px-6 py-3 mb-6 text-xs tracking-wider">
        <span className="text-[#2d7a53] font-bold uppercase">✓ Valide</span>
        <span className="text-[#ddd5cc] hidden sm:inline">|</span>
        <span className="text-[#6b6560]">
          C1 : <span className="text-[#1a1a18] font-medium">{session.card1.nature}</span>{" "}
          <span className={score1 >= 8 ? "text-[#1a1a18] font-bold" : "text-[#b84a30] font-bold"}>{score1}</span>
        </span>
        <span className="text-[#ddd5cc] hidden sm:inline">|</span>
        <span className="text-[#6b6560]">
          C2 : <span className="text-[#1a1a18] font-medium">{session.card2.nature}</span>{" "}
          <span className={score2 >= 8 ? "text-[#1a1a18] font-bold" : "text-[#b84a30] font-bold"}>{score2}</span>
        </span>
        {session.card3 && score3 !== null && (
          <>
            <span className="text-[#ddd5cc] hidden sm:inline">|</span>
            <span className="text-[#6b6560]">
              C3 : <span className="text-[#1a1a18] font-medium">{session.card3.nature}</span>{" "}
              <span className={score3 >= 8 ? "text-[#1a1a18] font-bold" : "text-[#b84a30] font-bold"}>{score3}</span>
            </span>
          </>
        )}
        <span className="text-[#ddd5cc] hidden sm:inline">|</span>
        <span className="text-[#6b6560]">
          Tension : <span className="text-[#1a1a18] font-bold">{tension.toFixed(1)}</span>
        </span>
      </div>

      {/* Cards */}
      <div className={`grid gap-4 sm:gap-6 grid-cols-1 ${session.card3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
        <SessionCard card={session.card1} label="CARTE 1" />
        <SessionCard card={session.card2} label="CARTE 2" />
        {session.card3 && <SessionCard card={session.card3} label="CARTE 3" />}
      </div>

      {/* Footer */}
      <div className="mt-6 sm:mt-8 border-t border-[#ddd5cc] pt-6 sm:pt-8 text-center">
        <div className="text-[#6b6560] text-xs tracking-widest uppercase">
          Ces contraintes sont actives pour toute la durée de cette session. Pas de négociation.
        </div>
      </div>
    </div>
  );
}
