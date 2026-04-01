"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  curate,
  CurationProfile,
  CurationPair,
  ExperienceLevel,
  Flexibility,
} from "@/lib/engine";
import { SuitableFor as BandSize, RiskLevel } from "@/lib/cards";
import { CardDisplay } from "@/components/CardDisplay";

const DEFAULT_PROFILE: CurationProfile = {
  band_size: "band",
  genre: "",
  experience_level: "intermediate",
  flexibility: "medium",
  risk_tolerance: "medium",
};

function SelectField<T extends string>({
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
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex-1 px-4 py-2 text-xs tracking-widest border-r border-[#ddd5cc] last:border-r-0 font-medium uppercase transition-colors ${
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
  const [results, setResults] = useState<CurationPair[] | null>(null);
  const [curated, setCurated] = useState(false);

  const handleCurate = () => {
    const pairs = curate(profile);
    setResults(pairs);
    setCurated(true);
  };

  const handleLaunchSession = (pair: CurationPair) => {
    sessionStorage.setItem(
      "altdeck_active_session",
      JSON.stringify({ card1: pair.card1, card2: pair.card2 })
    );
    router.push("/session");
  };

  const update = <K extends keyof CurationProfile>(key: K, value: CurationProfile[K]) => {
    setProfile((p) => ({ ...p, [key]: value }));
    setResults(null);
    setCurated(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="text-[#6b6560] text-xs tracking-widest mb-2 uppercase font-medium">
          Curation par profil
        </div>
        <h1 className="text-3xl font-bold tracking-widest text-[#1a1a18] font-mono">CURATION</h1>
        <div className="w-10 h-0.5 bg-[#b84a30] mt-2" />
      </div>

      {/* Profile form */}
      <div className="border border-[#ddd5cc] p-8 mb-10 bg-[#faf7f4]" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div className="text-[#6b6560] text-xs tracking-widest mb-6 uppercase font-medium">Profil du groupe</div>
        <div className="grid grid-cols-2 gap-6">
          <SelectField<BandSize>
            label="Formation"
            value={profile.band_size}
            options={[
              { value: "solo", label: "SOLO" },
              { value: "duo", label: "DUO" },
              { value: "band", label: "GROUPE" },
            ]}
            onChange={(v) => update("band_size", v)}
          />

          <SelectField<ExperienceLevel>
            label="Niveau d'expérience"
            value={profile.experience_level}
            options={[
              { value: "beginner", label: "DÉBUTANT" },
              { value: "intermediate", label: "INTERMÉDIAIRE" },
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
              { value: "low", label: "FAIBLE" },
              { value: "medium", label: "MOYENNE" },
              { value: "high", label: "ÉLEVÉE" },
            ]}
            onChange={(v) => update("risk_tolerance", v)}
          />

          <div className="col-span-2 flex flex-col gap-2">
            <label className="text-[#6b6560] text-xs tracking-widest uppercase font-medium">
              Genre (optionnel — contexte uniquement)
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
        </div>

        <div className="mt-8">
          <button
            onClick={handleCurate}
            className="text-sm tracking-widest px-10 py-3 bg-[#b84a30] text-white font-bold hover:bg-[#8c3622] uppercase transition-colors"
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
              AUCUNE PAIRE VALIDE pour ce profil. Ajuster la tolérance au risque ou la formation.
            </div>
          ) : (
            <div>
              <div className="text-[#6b6560] text-xs tracking-widest mb-6 uppercase font-medium">
                {results.length} paire{results.length !== 1 ? "s" : ""} suggérée{results.length !== 1 ? "s" : ""} — Classées par pertinence artistique + potentiel de transformation
              </div>
              <div className="flex flex-col gap-8">
                {results.map((pair, i) => (
                  <div key={`${pair.card1.id}-${pair.card2.id}`} className="border border-[#ddd5cc] p-6 bg-[#faf7f4]" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <span className="text-[#6b6560] text-xs tracking-widest uppercase font-medium">Paire {i + 1}</span>
                        <span className="text-[#4f4f49] text-xs">
                          Score : {pair.rank_score.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[#6b6560] text-xs uppercase tracking-wider">
                          {pair.card1.category} + {pair.card2.category}
                        </span>
                        <button
                          onClick={() => handleLaunchSession(pair)}
                          className="text-xs tracking-widest px-6 py-2 bg-[#b84a30] text-white font-bold hover:bg-[#8c3622] uppercase transition-colors"
                          style={{ borderRadius: "2px" }}
                        >
                          LANCER LA SESSION →
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <CardDisplay card={pair.card1} />
                      <CardDisplay card={pair.card2} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
