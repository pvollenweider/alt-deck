"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  curate,
  generateThirdCard,
  computePreparationTime,
  CurationProfile,
  CurationPair,
  ExperienceLevel,
  Flexibility,
} from "@/lib/engine";
import { Card, RiskLevel } from "@/lib/cards";
import { CardDisplay } from "@/components/CardDisplay";

const DEFAULT_PROFILE: CurationProfile = {
  genre: "",
  experience_level: "intermediate",
  flexibility: "medium",
  risk_tolerance: 2,
};

function SelectField<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[#6b6560] text-xs tracking-widest uppercase font-medium">{label}</label>
      <div className="flex gap-0 border border-[#ddd5cc] bg-[#faf7f4]">
        {options.map((opt) => (
          <button
            key={String(opt.value)}
            onClick={() => onChange(opt.value)}
            className={`flex-1 px-2 sm:px-4 py-2 text-xs tracking-widest border-r border-[#ddd5cc] last:border-r-0 font-medium uppercase transition-colors ${
              value === opt.value
                ? "bg-[#b84a30] text-white font-bold"
                : "text-[#6b6560] hover:text-[#1a1a18] hover:bg-[#f5f0eb]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CuratePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<CurationProfile>(DEFAULT_PROFILE);
  const [groupName, setGroupName] = useState("");
  const [location, setLocation] = useState("");
  const [results, setResults] = useState<CurationPair[] | null>(null);
  const [curated, setCurated] = useState(false);
  const [thirdCards, setThirdCards] = useState<Record<string, Card | null>>({});

  const handleCurate = () => {
    const pairs = curate(profile);
    setResults(pairs);
    setCurated(true);
    setThirdCards({});
  };

  const pairKey = (pair: CurationPair) => `${pair.card1.id}-${pair.card2.id}`;

  const handleAddThird = (pair: CurationPair) => {
    const card3 = generateThirdCard(pair.card1, pair.card2, []);
    setThirdCards((prev) => ({ ...prev, [pairKey(pair)]: card3 }));
  };

  const handleRemoveThird = (pair: CurationPair) => {
    setThirdCards((prev) => ({ ...prev, [pairKey(pair)]: null }));
  };

  const handleLaunchSession = (pair: CurationPair) => {
    const card3 = thirdCards[pairKey(pair)];
    const cards = card3
      ? [pair.card1, pair.card2, card3]
      : [pair.card1, pair.card2];
    const prepTime = computePreparationTime(cards);
    sessionStorage.setItem(
      "altdeck_active_session",
      JSON.stringify({
        card1: pair.card1,
        card2: pair.card2,
        ...(card3 ? { card3 } : {}),
        prepTime,
        phase: "IDLE",
        phaseEndTime: null,
        phaseDuration: null,
        ...(groupName.trim() ? { groupName: groupName.trim() } : {}),
        ...(location.trim() ? { location: location.trim() } : {}),
      })
    );
    router.push("/session");
  };

  const update = <K extends keyof CurationProfile>(key: K, value: CurationProfile[K]) => {
    setProfile((p) => ({ ...p, [key]: value }));
    setResults(null);
    setCurated(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="text-[#6b6560] text-xs tracking-widest mb-2 uppercase font-medium">
          Curation par profil
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-widest text-[#1a1a18] font-mono">CURATION</h1>
        <div className="w-10 h-0.5 bg-[#b84a30] mt-2" />
      </div>

      {/* Profile form */}
      <div className="border border-[#ddd5cc] p-5 sm:p-8 mb-8 sm:mb-10 bg-[#faf7f4]" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div className="text-[#6b6560] text-xs tracking-widest mb-5 sm:mb-6 uppercase font-medium">Profil du groupe</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <SelectField<ExperienceLevel>
            label="Niveau d'expérience"
            value={profile.experience_level}
            options={[
              { value: "beginner", label: "DÉBUTANT" },
              { value: "intermediate", label: "INTER." },
              { value: "advanced", label: "AVANCÉ" },
            ]}
            onChange={(v) => update("experience_level", v)}
          />

          <SelectField<Flexibility>
            label="Flexibilité"
            value={profile.flexibility}
            options={[
              { value: "low", label: "FAIBLE" },
              { value: "medium", label: "MOYENNE" },
              { value: "high", label: "ÉLEVÉE" },
            ]}
            onChange={(v) => update("flexibility", v)}
          />

          <SelectField<RiskLevel>
            label="Tolérance au risque"
            value={profile.risk_tolerance}
            options={[
              { value: 1, label: "FAIBLE" },
              { value: 2, label: "MOYENNE" },
              { value: 3, label: "ÉLEVÉE" },
            ]}
            onChange={(v) => update("risk_tolerance", v)}
          />

          <div className="flex flex-col gap-2">
            <label className="text-[#6b6560] text-xs tracking-widest uppercase font-medium">
              Genre (optionnel)
            </label>
            <input
              type="text"
              value={profile.genre}
              onChange={(e) => update("genre", e.target.value)}
              placeholder="ex. jazz, post-rock, électroacoustique..."
              className="text-sm bg-[#f5f0eb] border border-[#ddd5cc] text-[#1a1a18] px-4 py-3 placeholder:text-[#6b6560] focus:border-[#1a1a18] outline-none tracking-wide"
              style={{ borderRadius: "2px" }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#6b6560] text-xs tracking-widest uppercase font-medium">
              Nom du groupe (optionnel)
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="ex. Trio Vide, Ensemble X..."
              className="text-sm bg-[#f5f0eb] border border-[#ddd5cc] text-[#1a1a18] px-4 py-3 placeholder:text-[#6b6560] focus:border-[#1a1a18] outline-none tracking-wide"
              style={{ borderRadius: "2px" }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#6b6560] text-xs tracking-widest uppercase font-medium">
              Lieu (optionnel)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="ex. Studio 103, Le Lieu Unique..."
              className="text-sm bg-[#f5f0eb] border border-[#ddd5cc] text-[#1a1a18] px-4 py-3 placeholder:text-[#6b6560] focus:border-[#1a1a18] outline-none tracking-wide"
              style={{ borderRadius: "2px" }}
            />
          </div>
        </div>

        <div className="mt-6 sm:mt-8">
          <button
            onClick={handleCurate}
            className="text-sm tracking-widest px-8 sm:px-10 py-3 bg-[#b84a30] text-white font-bold hover:bg-[#8c3622] uppercase transition-colors"
            style={{ borderRadius: "2px" }}
          >
            ANALYSER →
          </button>
        </div>
      </div>

      {/* Results */}
      {curated && results !== null && (
        <div>
          {results.length === 0 ? (
            <div className="border border-[#b84a30] p-6 text-[#b84a30] text-sm tracking-wider bg-[#fdf2ef]">
              AUCUNE PAIRE VALIDE pour ce profil. Ajuster la tolérance au risque.
            </div>
          ) : (
            <div>
              <div className="text-[#6b6560] text-xs tracking-widest mb-4 sm:mb-6 uppercase font-medium">
                {results.length} paire{results.length !== 1 ? "s" : ""} suggérée{results.length !== 1 ? "s" : ""}
              </div>
              <div className="flex flex-col gap-6 sm:gap-8">
                {results.map((pair, i) => {
                  const key = pairKey(pair);
                  const card3 = thirdCards[key];
                  return (
                    <div key={key} className="border border-[#ddd5cc] p-4 sm:p-6 bg-[#faf7f4]" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                      <div className="flex flex-col gap-3 mb-4 sm:mb-6">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-4">
                            <span className="text-[#6b6560] text-xs tracking-widest uppercase font-medium">Paire {i + 1}</span>
                            <span className="text-[#4f4f49] text-xs">
                              Score : {pair.rank_score.toFixed(2)} · Tension : {pair.tension.toFixed(1)}
                            </span>
                          </div>
                          <span className="text-[#6b6560] text-xs uppercase tracking-wider">
                            {pair.card1.nature} + {pair.card2.nature}{card3 ? ` + ${card3.nature}` : ""}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          {!card3 ? (
                            <button
                              onClick={() => handleAddThird(pair)}
                              className="text-xs tracking-widest px-3 sm:px-4 py-2 border border-[#9a7820] text-[#9a7820] hover:bg-[#9a7820] hover:text-white uppercase transition-colors bg-[#faf7f4] font-bold"
                              style={{ borderRadius: "2px" }}
                            >
                              + 3ÈME
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRemoveThird(pair)}
                              className="text-xs tracking-widest px-3 sm:px-4 py-2 border border-[#ddd5cc] text-[#6b6560] hover:text-[#b84a30] hover:border-[#b84a30] uppercase transition-colors bg-[#faf7f4]"
                              style={{ borderRadius: "2px" }}
                            >
                              RETIRER
                            </button>
                          )}
                          <button
                            onClick={() => handleLaunchSession(pair)}
                            className="text-xs tracking-widest px-4 sm:px-6 py-2 bg-[#b84a30] text-white font-bold hover:bg-[#8c3622] uppercase transition-colors"
                            style={{ borderRadius: "2px" }}
                          >
                            LANCER →
                          </button>
                        </div>
                      </div>
                      <div className={`grid gap-4 grid-cols-1 ${card3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
                        <CardDisplay card={pair.card1} />
                        <CardDisplay card={pair.card2} />
                        {card3 && <CardDisplay card={card3} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
