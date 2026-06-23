"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, totalScore, overallDifficulty, NATURE_BG, NATURE_BORDER, NATURE_DOT, ROLE_LABELS } from "@/lib/cards";
import {
  generateSession,
  generateThirdCard,
  computeTension,
  computePreparationTime,
  SessionPhase,
  StoredSession,
} from "@/lib/engine";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function progressPercent(timeLeftMs: number, durationSec: number): number {
  if (durationSec === 0) return 0;
  return Math.max(0, Math.min(100, (timeLeftMs / 1000 / durationSec) * 100));
}

const PHASE_META: Record<
  SessionPhase,
  { label: string; subtitle: string; color: string }
> = {
  IDLE:        { label: "PRÊT",            subtitle: "En attente de démarrage",   color: "#6b6560" },
  REVEAL:      { label: "RÉVÉLATION",      subtitle: "Découverte des contraintes", color: "#2d5fa0" },
  PREPARATION: { label: "PRÉPARATION",     subtitle: "Installation technique",     color: "#9a7820" },
  LOCK:        { label: "VERROUILLAGE",    subtitle: "Dernière mise en place",     color: "#b84a30" },
  PLAYING:     { label: "EN COURS",        subtitle: "Session active",             color: "#2d7a53" },
  COMPLETE:    { label: "TERMINÉE",        subtitle: "Session complète",           color: "#1a1a18" },
};

function nextPhase(phase: SessionPhase): SessionPhase | null {
  const order: SessionPhase[] = ["IDLE", "REVEAL", "PREPARATION", "LOCK", "PLAYING", "COMPLETE"];
  const i = order.indexOf(phase);
  return i < order.length - 1 ? order[i + 1] : null;
}

function phaseDurationSec(phase: SessionPhase, prepTime: number): number {
  if (phase === "REVEAL") return 120;
  if (phase === "PREPARATION") return prepTime * 60;
  if (phase === "LOCK") return 60;
  return 0;
}

function saveSession(session: StoredSession) {
  try {
    sessionStorage.setItem("altdeck_active_session", JSON.stringify(session));
  } catch {
    // storage unavailable — phase won't persist across refresh
  }
}

function isValidCard(c: Card) {
  return Array.isArray(c.rules) && c.difficulty != null && typeof c.difficulty === "object";
}

// ─── Print layout ─────────────────────────────────────────────────────────────

const NATURE_COLOR: Record<string, string> = {
  STRUCTURAL: "#b84a30",
  COGNITIVE:  "#2d5fa0",
  SONIC:      "#2d7a53",
  PHYSICAL:   "#9a7820",
};

function PrintView({
  session,
  allCards,
  tension,
}: {
  session: StoredSession;
  allCards: Card[];
  tension: number;
}) {
  const date = new Date().toLocaleDateString("fr-FR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="print-only" style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#1a1a18", lineHeight: 1.55 }}>

      {/* En-tête */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "22pt", borderBottom: "2pt solid #b84a30", paddingBottom: "14pt" }}>
        <Image src="/logo.svg" alt="ALT-Sessions" width={130} height={48} style={{ display: "block" }} />
        <div style={{ textAlign: "right", fontSize: "9pt", color: "#6b6560", lineHeight: 1.7 }}>
          <div style={{ fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em" }}>{date}</div>
          {session.groupName && (
            <div style={{ color: "#1a1a18", fontWeight: "bold", marginTop: "3pt" }}>{session.groupName}</div>
          )}
          {session.location && (
            <div style={{ color: "#4f4f49" }}>{session.location}</div>
          )}
        </div>
      </div>

      {/* Résumé de session */}
      <div style={{ fontSize: "8.5pt", textTransform: "uppercase", letterSpacing: "0.12em", color: "#6b6560", marginBottom: "18pt" }}>
        {allCards.length} contrainte{allCards.length > 1 ? "s" : ""} actives
        {" · "}Tension&nbsp;<strong style={{ color: "#1a1a18" }}>{tension.toFixed(1)}</strong>
        {" · "}Préparation&nbsp;<strong style={{ color: "#1a1a18" }}>{session.prepTime}&nbsp;min</strong>
      </div>

      {/* Cartes */}
      {allCards.map((card, i) => {
        const natureColor = NATURE_COLOR[card.nature] ?? "#1a1a18";
        return (
          <div
            key={card.id}
            style={{
              marginBottom: "28pt",
              paddingBottom: "24pt",
              borderBottom: i < allCards.length - 1 ? "0.5pt solid #ddd5cc" : "none",
              pageBreakInside: "avoid",
            }}
          >
            {/* Badge nature + rôle */}
            <div style={{ display: "flex", alignItems: "center", gap: "8pt", marginBottom: "8pt" }}>
              <span style={{
                fontSize: "7.5pt", fontFamily: "monospace", textTransform: "uppercase",
                letterSpacing: "0.14em", fontWeight: "bold",
                backgroundColor: natureColor, color: "white",
                padding: "2pt 6pt", borderRadius: "2px",
              }}>
                {card.nature}
              </span>
              <span style={{
                fontSize: "7.5pt", fontFamily: "monospace", textTransform: "uppercase",
                letterSpacing: "0.12em", color: "#6b6560",
                border: "0.5pt solid #ddd5cc", padding: "2pt 6pt", borderRadius: "2px",
              }}>
                {ROLE_LABELS[card.role]}
              </span>
              <span style={{ fontSize: "7.5pt", color: "#9b9690", letterSpacing: "0.1em" }}>
                CONTRAINTE {i + 1}
              </span>
            </div>

            {/* Titre */}
            <div style={{
              fontFamily: "monospace", fontSize: "26pt", fontWeight: "bold",
              letterSpacing: "0.04em", lineHeight: 1.1,
              marginBottom: "10pt", color: "#1a1a18",
            }}>
              {card.title}
            </div>

            {/* Description */}
            <p style={{ fontSize: "11pt", lineHeight: 1.65, margin: "0 0 12pt 0", color: "#4f4f49" }}>
              {card.description}
            </p>

            {/* Règles */}
            <ol style={{ margin: 0, paddingLeft: "14pt", fontSize: "10pt", lineHeight: 1.75, color: "#1a1a18" }}>
              {card.rules.map((rule, j) => (
                <li key={j} style={{ marginBottom: "3pt" }}>{rule}</li>
              ))}
            </ol>
          </div>
        );
      })}

      {/* Pied de page */}
      <div style={{
        borderTop: "0.5pt solid #ddd5cc", paddingTop: "10pt",
        fontSize: "8pt", textTransform: "uppercase", letterSpacing: "0.12em",
        color: "#6b6560", textAlign: "center",
      }}>
        Ces contraintes sont actives pour toute la durée de cette session. Pas de négociation.
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PhaseBanner({
  session,
  timeLeftMs,
  onAdvance,
}: {
  session: StoredSession;
  timeLeftMs: number;
  onAdvance: () => void;
}) {
  const { phase, prepTime, phaseDuration } = session;
  const meta = PHASE_META[phase];
  const timed = phase === "REVEAL" || phase === "PREPARATION" || phase === "LOCK";
  const progress = timed && phaseDuration ? progressPercent(timeLeftMs, phaseDuration) : 0;

  return (
    <div className="border border-[#ddd5cc] bg-[#faf7f4] mb-6" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
      {/* Visually-hidden live region — separate persistent node for reliable SR announcement */}
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {meta.label}
      </span>

      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-bold tracking-widest px-3 py-1 text-white"
            style={{ backgroundColor: meta.color, borderRadius: "2px" }}
            aria-hidden="true"
          >
            {meta.label}
          </span>
          <span className="text-[#6b6560] text-xs tracking-wider hidden sm:inline">
            {meta.subtitle}
          </span>
          {phase === "PREPARATION" && (
            <span className="text-[#9a7820] text-xs tracking-wider hidden sm:inline">
              — {prepTime} min allouées
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {timed && (
            <span
              role="timer"
              className="text-xl font-mono font-bold text-[#1a1a18]"
              aria-label={`Temps restant : ${formatTime(timeLeftMs)}`}
            >
              {formatTime(timeLeftMs)}
            </span>
          )}
          {phase === "PLAYING" && (
            <span
              className="text-xs font-bold tracking-widest px-3 py-1"
              style={{ color: "#2d7a53" }}
              aria-label="Session en cours"
            >
              <span aria-hidden="true">● </span>LIVE
            </span>
          )}
          {phase === "REVEAL" && (
            <button
              onClick={onAdvance}
              className="text-xs tracking-widest px-4 py-2 border border-[#2d5fa0] text-[#2d5fa0] hover:bg-[#2d5fa0] hover:text-white uppercase transition-colors bg-[#faf7f4]"
              style={{ borderRadius: "2px" }}
              aria-label="Passer à la préparation (Espace)"
            >
              PASSER →
            </button>
          )}
          {phase === "PREPARATION" && (
            <button
              onClick={onAdvance}
              className="text-xs tracking-widest px-4 py-2 border border-[#9a7820] text-[#9a7820] hover:bg-[#9a7820] hover:text-white uppercase transition-colors bg-[#faf7f4] font-bold"
              style={{ borderRadius: "2px" }}
              aria-label="Prêt, passer au verrouillage (Espace)"
            >
              PRÊT →
            </button>
          )}
        </div>
      </div>

      {timed && phaseDuration && (
        <div
          className="h-1 bg-[#ddd5cc]"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progression de la phase ${meta.label}`}
        >
          <div
            className="h-1 transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: meta.color }}
          />
        </div>
      )}
    </div>
  );
}

function TechNotes({ cards }: { cards: Card[] }) {
  const high = cards.filter((c) => c.techImpact === "HIGH");
  const medium = cards.filter((c) => c.techImpact === "MEDIUM");
  if (high.length === 0 && medium.length === 0) return null;

  return (
    <div className="border border-[#9a7820] bg-[#faf6ec] p-4 sm:p-5 mb-6">
      <div className="text-[#9a7820] text-xs tracking-widest uppercase font-bold mb-3">
        Notes techniques
      </div>
      {high.length > 0 && (
        <div className="mb-1 text-xs leading-relaxed">
          <span className="text-[#9a7820] font-bold tracking-wider uppercase">Impact élevé : </span>
          <span className="text-[#4f4f49]">{high.map((c) => c.title).join(", ")}</span>
          <span className="text-[#6b6560]"> — vérifier micros, espace scénique, monitoring</span>
        </div>
      )}
      {medium.length > 0 && (
        <div className="text-xs leading-relaxed">
          <span className="text-[#6b6560] font-bold tracking-wider uppercase">Impact moyen : </span>
          <span className="text-[#4f4f49]">{medium.map((c) => c.title).join(", ")}</span>
          <span className="text-[#6b6560]"> — ajustements mineurs</span>
        </div>
      )}
    </div>
  );
}

function SessionCard({ card, label }: { card: Card; label: string }) {
  const score = totalScore(card);
  const diff = overallDifficulty(card);
  const riskLabel =
    card.risk === 3 ? "RISQUE ÉLEVÉ" : card.risk === 2 ? "RISQUE MOYEN" : "RISQUE FAIBLE";
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

      <div className="text-3xl sm:text-5xl font-bold text-[#1a1a18] tracking-wider leading-none font-mono">
        {card.title}
      </div>

      <div className="text-base sm:text-lg text-[#4f4f49] leading-relaxed">
        {card.description}
      </div>

      <ul className="text-sm text-[#6b6560] leading-relaxed space-y-2 border-l-2 border-[#ddd5cc] pl-4 flex-1">
        {card.rules.map((rule, i) => (
          <li key={i}>{rule}</li>
        ))}
      </ul>

      <div className="flex items-center gap-3">
        <span className="text-[#6b6560] text-xs tracking-widest uppercase" id={`diff-label-${card.id}`}>Difficulté</span>
        <div
          className="flex gap-2"
          role="img"
          aria-label={`Difficulté : ${diff} sur 5`}
        >
          {[1, 2, 3, 4, 5].map((d) => (
            <div
              key={d}
              className={`w-3 h-3 rounded-full ${d <= diff ? NATURE_DOT[card.nature] : "bg-[#ddd5cc]"}`}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      <div className="border-t border-[#ddd5cc] pt-4 sm:pt-5 flex items-center justify-between">
        <div className="flex gap-4 sm:gap-6 text-xs text-[#6b6560]">
          <span>STR <span className="text-[#4f4f49] font-semibold">{card.difficulty.structural}</span></span>
          <span>DÉS <span className="text-[#4f4f49] font-semibold">{card.difficulty.disorientation}</span></span>
          <span>PER <span className="text-[#4f4f49] font-semibold">{card.difficulty.performance}</span></span>
        </div>
        <div className="text-sm">
          <span className="text-[#6b6560] text-xs tracking-widest mr-2 uppercase">Score </span>
          <span className={`font-bold ${score >= 8 ? "text-[#1a1a18]" : "text-[#b84a30]"}`}>{score}</span>
          <span className="text-[#6b6560]">/15</span>
        </div>
      </div>

      <div className="flex justify-end">
        <span className={`text-xs border px-2 py-0.5 uppercase tracking-wider font-medium ${riskClass}`}>
          {riskLabel}
        </span>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SessionPage() {
  const router = useRouter();
  const [session, setSession] = useState<StoredSession | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [timeLeftMs, setTimeLeftMs] = useState<number>(0);
  const [replaceConfirmPending, setReplaceConfirmPending] = useState(false);
  const [thirdCardUnavailable, setThirdCardUnavailable] = useState(false);
  const [quickGenerateFailed, setQuickGenerateFailed] = useState(false);
  const sessionRef = useRef<StoredSession | null>(null);

  // Load session from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("altdeck_active_session");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as StoredSession;
        if (isValidCard(parsed.card1) && isValidCard(parsed.card2)) {
          if (!parsed.phase) {
            parsed.phase = "IDLE";
            parsed.phaseEndTime = null;
            parsed.phaseDuration = null;
            if (parsed.prepTime == null) {
              const cards: Card[] = parsed.card3
                ? [parsed.card1, parsed.card2, parsed.card3]
                : [parsed.card1, parsed.card2];
              parsed.prepTime = computePreparationTime(cards);
            }
          }
          setSession(parsed);
          sessionRef.current = parsed;
        } else {
          sessionStorage.removeItem("altdeck_active_session");
        }
      } catch {
        sessionStorage.removeItem("altdeck_active_session");
      }
    }
    setLoaded(true);
  }, []);

  // Keep ref in sync so timer closure always reads current session
  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  // Countdown timer — uses ref to avoid stale closure
  useEffect(() => {
    if (!session || session.phaseEndTime === null) return;

    const tick = () => {
      const current = sessionRef.current;
      if (!current || current.phaseEndTime === null) return;
      const left = Math.max(0, current.phaseEndTime - Date.now());
      setTimeLeftMs(left);
      if (left === 0) {
        clearInterval(id);
        advancePhaseFrom(current);
      }
    };

    setTimeLeftMs(Math.max(0, session.phaseEndTime - Date.now()));
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.phase, session?.phaseEndTime]);

  // Keyboard shortcut: Spacebar advances phase when no interactive element is focused
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code !== "Space") return;
    const target = e.target as HTMLElement;
    if (target.closest("button, input, textarea, select, [contenteditable]")) return;
    e.preventDefault();
    const current = sessionRef.current;
    if (!current) return;
    if (current.phase === "IDLE" || current.phase === "REVEAL" || current.phase === "PREPARATION") {
      advancePhaseFrom(current);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  function updateSession(updated: StoredSession) {
    saveSession(updated);
    setSession(updated);
    sessionRef.current = updated;
  }

  function advancePhaseFrom(current: StoredSession) {
    const next = nextPhase(current.phase);
    if (!next) return;
    const duration = phaseDurationSec(next, current.prepTime);
    const updated: StoredSession = {
      ...current,
      phase: next,
      phaseEndTime: duration > 0 ? Date.now() + duration * 1000 : null,
      phaseDuration: duration > 0 ? duration : null,
    };
    updateSession(updated);
  }

  function handleStartSession() {
    if (!session) return;
    advancePhaseFrom(session);
  }

  function handleAdvancePhase() {
    if (!session) return;
    advancePhaseFrom(session);
  }

  function handleAddThirdCard() {
    if (!session) return;
    const card3 = generateThirdCard(session.card1, session.card2, []);
    if (!card3) {
      setThirdCardUnavailable(true);
      return;
    }
    setThirdCardUnavailable(false);
    const cards: Card[] = [session.card1, session.card2, card3];
    const updated: StoredSession = {
      ...session,
      card3,
      prepTime: computePreparationTime(cards),
    };
    updateSession(updated);
  }

  function handleRemoveThirdCard() {
    if (!session) return;
    setThirdCardUnavailable(false);
    const { card3: _removed, ...rest } = session;
    const updated: StoredSession = {
      ...rest,
      prepTime: computePreparationTime([session.card1, session.card2]),
    };
    updateSession(updated);
  }

  function doQuickGenerate() {
    const result = generateSession([]);
    if (!result) {
      setQuickGenerateFailed(true);
      return;
    }
    setQuickGenerateFailed(false);
    const cards: Card[] = [result.card1, result.card2];
    const newSession: StoredSession = {
      card1: result.card1,
      card2: result.card2,
      prepTime: computePreparationTime(cards),
      phase: "IDLE",
      phaseEndTime: null,
      phaseDuration: null,
    };
    updateSession(newSession);
    setReplaceConfirmPending(false);
    setThirdCardUnavailable(false);
  }

  function handleQuickGenerate() {
    if (!session || session.phase === "IDLE" || session.phase === "COMPLETE") {
      doQuickGenerate();
    } else {
      setReplaceConfirmPending(true);
    }
  }

  // ─── Loading state ─────────────────────────────────────────────────────────

  if (!loaded) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-[#6b6560] text-xs tracking-widest" role="status" aria-label="Chargement de la session">
          CHARGEMENT...
        </div>
      </div>
    );
  }

  // ─── Empty state ──────────────────────────────────────────────────────────

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
          {quickGenerateFailed && (
            <div className="text-[#b84a30] text-xs tracking-wider uppercase mb-6" role="alert">
              Génération impossible — vérifier les données des cartes.
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={doQuickGenerate}
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

  // ─── Active session ───────────────────────────────────────────────────────

  const score1 = totalScore(session.card1);
  const score2 = totalScore(session.card2);
  const score3 = session.card3 ? totalScore(session.card3) : null;
  const totalLoad = score1 + score2 + (score3 ?? 0);
  const maxLoad = session.card3 ? 45 : 30;
  const allCards: Card[] = session.card3
    ? [session.card1, session.card2, session.card3]
    : [session.card1, session.card2];
  const tension = computeTension(allCards);
  const isActive = session.phase !== "IDLE" && session.phase !== "COMPLETE";

  return (
    <>
      {/* ── Layout PDF ──────────────────────────────────────────────────── */}
      <div className="print-only" style={{ padding: "0" }}>
        <PrintView session={session} allCards={allCards} tension={tension} />
      </div>

      {/* ── Interface écran ───────────────────────────────────────────────── */}
      <div className="no-print max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* ── Confirmation: replace active session ────────────────────────── */}
        {replaceConfirmPending && (
          <div
            className="border border-[#b84a30] bg-[#fdf2ef] p-4 sm:p-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            role="alert"
          >
            <div>
              <div className="text-[#b84a30] text-xs tracking-widest uppercase font-bold mb-1">
                Remplacer la session en cours ?
              </div>
              <div className="text-[#4f4f49] text-xs tracking-wider">
                La session active sera perdue. Cette action est irréversible.
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setReplaceConfirmPending(false)}
                className="text-xs tracking-widest px-4 py-2 border border-[#ddd5cc] text-[#6b6560] hover:text-[#1a1a18] hover:border-[#1a1a18] uppercase transition-colors bg-[#faf7f4]"
                style={{ borderRadius: "2px" }}
                autoFocus
              >
                ANNULER
              </button>
              <button
                onClick={doQuickGenerate}
                className="text-xs tracking-widest px-4 py-2 bg-[#b84a30] text-white font-bold hover:bg-[#8c3622] uppercase transition-colors"
                style={{ borderRadius: "2px" }}
              >
                REMPLACER
              </button>
            </div>
          </div>
        )}

        {/* ── Screen header ─────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="text-[#6b6560] text-xs tracking-widest mb-2 uppercase font-medium">Vue performance</div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-widest text-[#1a1a18] font-mono">SESSION</h1>
            <div className="w-10 h-0.5 bg-[#b84a30] mt-2" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 shrink-0">
            {/* Session management */}
            <div className="flex items-center gap-2 flex-wrap justify-end sm:justify-start">
              <div
                className="text-[#6b6560] text-xs tracking-widest px-3 py-2 border border-[#ddd5cc] bg-[#faf7f4] uppercase whitespace-nowrap"
                aria-label={`Charge totale : ${totalLoad} sur ${maxLoad}`}
              >
                {totalLoad}/{maxLoad}
              </div>
              {session.phase === "IDLE" && !session.card3 && (
                thirdCardUnavailable ? (
                  <span className="text-xs tracking-widest px-3 sm:px-5 py-2 border border-[#ddd5cc] text-[#6b6560] uppercase bg-[#faf7f4] whitespace-nowrap opacity-60">
                    3ÈME INDISPONIBLE
                  </span>
                ) : (
                  <button
                    onClick={handleAddThirdCard}
                    className="text-xs tracking-widest px-3 sm:px-5 py-2 border border-[#9a7820] text-[#9a7820] hover:bg-[#9a7820] hover:text-white uppercase transition-colors bg-[#faf7f4] font-bold whitespace-nowrap"
                    style={{ borderRadius: "2px" }}
                  >
                    + 3ÈME
                  </button>
                )
              )}
              {session.phase === "IDLE" && session.card3 && (
                <button
                  onClick={handleRemoveThirdCard}
                  className="text-xs tracking-widest px-3 sm:px-5 py-2 border border-[#ddd5cc] text-[#6b6560] hover:text-[#b84a30] hover:border-[#b84a30] uppercase transition-colors bg-[#faf7f4] whitespace-nowrap"
                  style={{ borderRadius: "2px" }}
                >
                  RETIRER
                </button>
              )}
            </div>
            {/* Actions */}
            <div className="flex items-center gap-2 flex-wrap justify-end sm:justify-start">
              <button
                onClick={() => window.print()}
                className="text-xs tracking-widest px-3 sm:px-5 py-2 border border-[#ddd5cc] text-[#6b6560] hover:text-[#1a1a18] hover:border-[#1a1a18] uppercase transition-colors bg-[#faf7f4] whitespace-nowrap"
                style={{ borderRadius: "2px" }}
              >
                PDF ↓
              </button>
              {/* ALÉATOIRE only shown when not in an active session — prevents accidental replacement */}
              {!isActive && (
                <button
                  onClick={handleQuickGenerate}
                  className="text-xs tracking-widest px-3 sm:px-5 py-2 bg-[#b84a30] text-white font-bold hover:bg-[#8c3622] uppercase transition-colors whitespace-nowrap"
                  style={{ borderRadius: "2px" }}
                >
                  ALÉATOIRE
                </button>
              )}
              {/* During active session: ghost button triggers confirmation */}
              {isActive && (
                <button
                  onClick={handleQuickGenerate}
                  className="text-xs tracking-widest px-3 sm:px-5 py-2 border border-[#ddd5cc] text-[#6b6560] hover:text-[#b84a30] hover:border-[#b84a30] uppercase transition-colors bg-[#faf7f4] whitespace-nowrap"
                  style={{ borderRadius: "2px" }}
                  aria-label="Nouvelle session — confirmation requise"
                >
                  NOUVELLE
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Phase banner — hidden in COMPLETE state */}
        {session.phase !== "COMPLETE" && (
          <div className="no-print">
            <PhaseBanner
              session={session}
              timeLeftMs={timeLeftMs}
              onAdvance={handleAdvancePhase}
            />
          </div>
        )}

        {/* IDLE: start button */}
        {session.phase === "IDLE" && (
          <div className="border border-[#ddd5cc] bg-[#faf7f4] p-6 sm:p-8 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-[#4f4f49] text-sm tracking-wider font-medium uppercase mb-1">
                Prêt à démarrer
              </div>
              <div className="text-[#6b6560] text-xs tracking-wider">
                Révélation 2 min · Préparation {session.prepTime} min · Verrouillage 1 min
                <span className="ml-3 text-[#9b9690]">— Espace pour avancer</span>
              </div>
            </div>
            <button
              onClick={handleStartSession}
              className="text-sm tracking-widest px-8 sm:px-10 py-3 bg-[#2d7a53] text-white font-bold hover:bg-[#1e5c3d] uppercase transition-colors whitespace-nowrap"
              style={{ borderRadius: "2px" }}
              aria-label="Démarrer la session (Espace)"
            >
              DÉMARRER →
            </button>
          </div>
        )}

        {/* PREPARATION: tech notes */}
        {session.phase === "PREPARATION" && (
          <div className="no-print">
            <TechNotes cards={allCards} />
          </div>
        )}

        {/* PLAYING: end-session trigger */}
        {session.phase === "PLAYING" && (
          <div className="no-print mb-6 flex justify-end">
            <button
              onClick={handleAdvancePhase}
              className="text-xs tracking-widest px-5 py-2 border border-[#ddd5cc] text-[#6b6560] hover:text-[#1a1a18] hover:border-[#1a1a18] uppercase transition-colors bg-[#faf7f4]"
              style={{ borderRadius: "2px" }}
            >
              TERMINER LA SESSION
            </button>
          </div>
        )}

        {/* COMPLETE: session-end state */}
        {session.phase === "COMPLETE" && (
          <div
            className="border border-[#1a1a18] bg-[#faf7f4] p-6 sm:p-8 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            role="status"
            aria-live="polite"
          >
            <div>
              <div className="text-[#1a1a18] text-xs tracking-widest uppercase font-bold mb-1">
                Session terminée
              </div>
              <div className="text-[#6b6560] text-xs tracking-wider">
                Tension {tension.toFixed(1)} · Charge {totalLoad}/{maxLoad} · {session.prepTime} min de préparation
              </div>
            </div>
            <div className="flex gap-2 shrink-0 flex-wrap">
              <button
                onClick={() => window.print()}
                className="text-xs tracking-widest px-4 sm:px-6 py-2 border border-[#ddd5cc] text-[#6b6560] hover:text-[#1a1a18] hover:border-[#1a1a18] uppercase transition-colors bg-[#faf7f4] whitespace-nowrap"
                style={{ borderRadius: "2px" }}
              >
                PDF ↓
              </button>
              <button
                onClick={() => router.push("/generate")}
                className="text-xs tracking-widest px-4 sm:px-6 py-2 border border-[#ddd5cc] text-[#6b6560] hover:text-[#1a1a18] hover:border-[#1a1a18] uppercase transition-colors bg-[#faf7f4] whitespace-nowrap"
                style={{ borderRadius: "2px" }}
              >
                GÉNÉRER
              </button>
              <button
                onClick={doQuickGenerate}
                className="text-xs tracking-widest px-4 sm:px-6 py-2 bg-[#1a1a18] text-white font-bold hover:bg-[#b84a30] uppercase transition-colors whitespace-nowrap"
                style={{ borderRadius: "2px" }}
              >
                NOUVELLE SESSION →
              </button>
            </div>
          </div>
        )}

        {/* Session status bar */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border border-[#ddd5cc] bg-[#faf7f4] px-4 sm:px-6 py-3 mb-6 text-xs tracking-wider">
          <span className="text-[#1a1a18] font-bold uppercase">✓ Valide</span>
          <span className="text-[#6b6560]">
            Tension : <span className="text-[#1a1a18] font-bold">{tension.toFixed(1)}</span>
          </span>
          <span className="text-[#6b6560]">
            Préparation : <span className="text-[#1a1a18] font-bold">{session.prepTime} min</span>
          </span>
        </div>

        {/* Cards */}
        <div className={`grid gap-4 sm:gap-6 grid-cols-1 ${session.card3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
          <SessionCard card={session.card1} label="CARTE 1" />
          <SessionCard card={session.card2} label="CARTE 2" />
          {session.card3 && <SessionCard card={session.card3} label="CARTE 3" />}
        </div>

      </div>
    </>
  );
}
