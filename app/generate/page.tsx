"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { generateSession, GenerateResult } from "@/lib/engine";
import { totalScore } from "@/lib/cards";
import { CardDisplay } from "@/components/CardDisplay";

const RECENTLY_USED_KEY = "altdeck_recently_used";
const MAX_RECENT = 5;

function getRecentlyUsed(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENTLY_USED_KEY) || "[]");
  } catch {
    return [];
  }
}

function pushRecentlyUsed(ids: string[]) {
  if (typeof window === "undefined") return;
  const current = getRecentlyUsed();
  const updated = [...ids, ...current.filter((id) => !ids.includes(id))].slice(0, MAX_RECENT);
  localStorage.setItem(RECENTLY_USED_KEY, JSON.stringify(updated));
}

export default function GeneratePage() {
  const router = useRouter();
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [generated, setGenerated] = useState(false);
  const [recentIds, setRecentIds] = useState<string[]>([]);

  const handleGenerate = useCallback(() => {
    const recent = getRecentlyUsed();
    const session = generateSession(recent);
    if (session) {
      pushRecentlyUsed([session.card1.id, session.card2.id]);
      setRecentIds(getRecentlyUsed());
      setResult(session);
    }
    setGenerated(true);
  }, []);

  const handleLaunchSession = () => {
    if (!result) return;
    sessionStorage.setItem(
      "altdeck_active_session",
      JSON.stringify({ card1: result.card1, card2: result.card2 })
    );
    router.push("/session");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="text-[#6b6560] text-xs tracking-widest mb-2 uppercase font-medium">
          Aléatoire pondéré
        </div>
        <h1 className="text-3xl font-bold tracking-widest text-[#1a1a18] font-mono">GÉNÉRER</h1>
        <div className="w-10 h-0.5 bg-[#b84a30] mt-2" />
      </div>

      {/* Generate button */}
      <div className="mb-10">
        <button
          onClick={handleGenerate}
          className="text-sm tracking-widest px-10 py-3 bg-[#b84a30] text-white font-bold hover:bg-[#8c3622] uppercase transition-colors"
          style={{ borderRadius: "2px" }}
        >
          {generated ? "REGÉNÉRER LA SESSION" : "GÉNÉRER UNE SESSION"}
        </button>
        {recentIds.length > 0 && (
          <div className="mt-3 text-[#6b6560] text-xs tracking-wider">
            Récemment utilisées : {recentIds.join(" · ")}
          </div>
        )}
      </div>

      {/* Result */}
      {generated && !result && (
        <div className="border border-[#b84a30] p-6 text-[#b84a30] text-sm tracking-wider bg-[#fdf2ef]">
          AUCUNE PAIRE VALIDE TROUVÉE. Cela ne devrait pas arriver. Vérifier les données des cartes.
        </div>
      )}

      {result && (
        <div>
          {/* Validation banner */}
          <div className="border border-[#ddd5cc] p-4 mb-6 flex items-center justify-between bg-[#faf7f4]">
            <div className="flex items-center gap-6">
              <span className="text-[#6b6560] text-xs tracking-widest uppercase">Validité de la session</span>
              <span className="text-[#2d7a53] text-sm font-bold tracking-wider">
                ✓ VALIDE
              </span>
            </div>
            <div className="flex items-center gap-6 text-xs text-[#6b6560] tracking-wider">
              <span>
                Carte 1 :{" "}
                <span className={`font-bold ${result.score1 >= 8 ? "text-[#1a1a18]" : "text-[#b84a30]"}`}>
                  {result.score1}
                </span>
                /15
              </span>
              <span>
                Carte 2 :{" "}
                <span className={`font-bold ${result.score2 >= 8 ? "text-[#1a1a18]" : "text-[#b84a30]"}`}>
                  {result.score2}
                </span>
                /15
              </span>
              <span className="text-[#6b6560]">Seuil : 8</span>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div className="text-[#6b6560] text-xs tracking-widest mb-3 uppercase font-medium">
                Carte 1 — Score {result.score1}/15
              </div>
              <CardDisplay card={result.card1} />
            </div>
            <div>
              <div className="text-[#6b6560] text-xs tracking-widest mb-3 uppercase font-medium">
                Carte 2 — Score {result.score2}/15
              </div>
              <CardDisplay card={result.card2} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 border-t border-[#ddd5cc] pt-6">
            <button
              onClick={handleLaunchSession}
              className="text-sm tracking-widest px-8 py-3 bg-[#b84a30] text-white font-bold hover:bg-[#8c3622] uppercase transition-colors"
              style={{ borderRadius: "2px" }}
            >
              LANCER LA SESSION →
            </button>
            <button
              onClick={handleGenerate}
              className="text-sm tracking-widest px-8 py-3 border border-[#ddd5cc] text-[#6b6560] hover:text-[#1a1a18] hover:border-[#1a1a18] uppercase transition-colors bg-[#faf7f4]"
              style={{ borderRadius: "2px" }}
            >
              REGÉNÉRER
            </button>
          </div>
        </div>
      )}

      {/* Engine info */}
      <div className="mt-16 border border-[#ddd5cc] p-6 text-xs text-[#6b6560] bg-[#faf7f4]">
        <div className="tracking-widest mb-3 uppercase font-medium text-[#4f4f49]">Logique du moteur</div>
        <div className="grid grid-cols-3 gap-6 leading-relaxed">
          <div>
            <span className="text-[#4f4f49] font-medium">Formule de poids :</span>{" "}
            base × difficulty_factor × freshness_factor
          </div>
          <div>
            <span className="text-[#4f4f49] font-medium">Facteur difficulté :</span>{" "}
            1.0 + (difficulté − 1) × 0.125
          </div>
          <div>
            <span className="text-[#4f4f49] font-medium">Facteur fraîcheur :</span>{" "}
            0.3× pour les 5 dernières cartes utilisées, 1.0 sinon
          </div>
        </div>
      </div>
    </div>
  );
}
