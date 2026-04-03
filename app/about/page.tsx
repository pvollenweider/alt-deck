export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-14">
        <div className="text-[#6b6560] text-xs tracking-widest mb-4 uppercase font-medium">
          Concept
        </div>
        <h1 className="text-4xl font-bold tracking-widest text-[#1a1a18] mb-2 font-mono">
          ALT-DECK
        </h1>
        <div className="w-16 h-0.5 bg-[#b84a30] mb-6" />
        <p className="text-[#4f4f49] text-base leading-relaxed">
          Un système de contraintes pour musiciens. Pas un assistant créatif.
          Deux cartes. Une session. Pas de négociation.
        </p>
      </div>

      {/* Section: Principe */}
      <section className="mb-12">
        <h2 className="text-xs font-bold tracking-widest uppercase text-[#1a1a18] mb-4">
          Principe
        </h2>
        <div className="border border-[#ddd5cc] bg-[#faf7f4] p-6">
          <p className="text-[#4f4f49] text-sm leading-relaxed mb-4">
            ALT-DECK impose deux contraintes simultanées à un groupe de musiciens. Les contraintes
            ne sont pas des suggestions : elles sont actives pour toute la durée de la session,
            sans négociation possible.
          </p>
          <p className="text-[#4f4f49] text-sm leading-relaxed">
            Chaque session suit un protocole en quatre phases : découverte, préparation, calage,
            puis jeu. Le temps de chaque phase est calculé automatiquement selon les cartes tirées.
          </p>
        </div>
      </section>

      {/* Section: Les cartes */}
      <section className="mb-12">
        <h2 className="text-xs font-bold tracking-widest uppercase text-[#1a1a18] mb-4">
          Les cartes
        </h2>
        <p className="text-[#6b6560] text-sm mb-5 leading-relaxed">
          Le deck contient 45 cartes réparties sur deux axes.
        </p>

        <div className="mb-6">
          <div className="text-[#6b6560] text-xs tracking-widest uppercase mb-3 font-medium">
            Axe 1 — Nature (ce que la contrainte affecte)
          </div>
          <div className="grid grid-cols-2 gap-0 border border-[#ddd5cc]">
            {[
              { color: "#b84a30", label: "STRUCTURAL", desc: "Forme, temporalité, architecture" },
              { color: "#2d5fa0", label: "COGNITIVE",  desc: "Rôles, hiérarchie, coordination" },
              { color: "#2d7a53", label: "SONIC",      desc: "Son, timbre, dynamique" },
              { color: "#9a7820", label: "PHYSICAL",   desc: "Espace, corps, dispositif" },
            ].map((n, i) => (
              <div
                key={n.label}
                className={`p-4 bg-[#faf7f4] border-[#ddd5cc] ${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "border-b" : ""}`}
              >
                <div
                  className="text-xs font-bold tracking-widest mb-1"
                  style={{ color: n.color }}
                >
                  {n.label}
                </div>
                <div className="text-[#6b6560] text-xs">{n.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[#6b6560] text-xs tracking-widest uppercase mb-3 font-medium">
            Axe 2 — Rôle (ce que la contrainte fait au système)
          </div>
          <div className="border border-[#ddd5cc] bg-[#faf7f4] divide-y divide-[#ddd5cc]">
            {[
              { label: "DESTRUCTIVE",    desc: "Supprime quelque chose d'essentiel" },
              { label: "TRANSFORMATIVE", desc: "Redirige ou recadre quelque chose d'existant" },
              { label: "CONSTRAINT",     desc: "Applique une règle limitative sans supprimer" },
              { label: "STABILIZER",     desc: "Préserve un ancrage pour rendre les combos agressifs jouables" },
            ].map((r) => (
              <div key={r.label} className="flex items-baseline gap-4 px-5 py-3">
                <span className="text-xs font-bold tracking-widest text-[#1a1a18] w-32 shrink-0">
                  {r.label}
                </span>
                <span className="text-[#6b6560] text-xs">{r.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Règles de composition */}
      <section className="mb-12">
        <h2 className="text-xs font-bold tracking-widest uppercase text-[#1a1a18] mb-4">
          Règles de composition
        </h2>
        <div className="border border-[#ddd5cc] bg-[#faf7f4] p-6">
          <ul className="space-y-2 text-sm text-[#4f4f49]">
            <li className="flex gap-3">
              <span className="text-[#b84a30] font-bold shrink-0">—</span>
              Deux cartes de même nature ne peuvent pas être associées
            </li>
            <li className="flex gap-3">
              <span className="text-[#b84a30] font-bold shrink-0">—</span>
              Maximum 1 DESTRUCTIVE par session
            </li>
            <li className="flex gap-3">
              <span className="text-[#b84a30] font-bold shrink-0">—</span>
              Au moins 1 TRANSFORMATIVE (sauf si un STABILIZER est présent)
            </li>
            <li className="flex gap-3">
              <span className="text-[#b84a30] font-bold shrink-0">—</span>
              Si le risque cumulé dépasse 5, une troisième carte STABILIZER est requise
            </li>
            <li className="flex gap-3">
              <span className="text-[#b84a30] font-bold shrink-0">—</span>
              La tension minimale entre les cartes doit être ≥ 5
            </li>
          </ul>
        </div>
      </section>

      {/* Section: Phases */}
      <section className="mb-12">
        <h2 className="text-xs font-bold tracking-widest uppercase text-[#1a1a18] mb-4">
          Phases de session
        </h2>
        <div className="border border-[#ddd5cc] bg-[#faf7f4] divide-y divide-[#ddd5cc]">
          {[
            { phase: "IDLE",        color: "#6b6560", dur: "—",       desc: "Session prête, en attente de démarrage" },
            { phase: "REVEAL",      color: "#2d5fa0", dur: "2:00",    desc: "Découverte des contraintes" },
            { phase: "PREPARATION", color: "#9a7820", dur: "calculé", desc: "Installation technique et concertation" },
            { phase: "LOCK",        color: "#b84a30", dur: "1:00",    desc: "Dernier calage avant le jeu" },
            { phase: "PLAYING",     color: "#2d7a53", dur: "—",       desc: "Session active" },
          ].map((p) => (
            <div key={p.phase} className="flex items-center gap-4 px-5 py-3">
              <span
                className="text-xs font-bold tracking-widest w-28 shrink-0"
                style={{ color: p.color }}
              >
                {p.phase}
              </span>
              <span className="text-[#6b6560] text-xs w-16 shrink-0 font-mono">{p.dur}</span>
              <span className="text-[#4f4f49] text-xs">{p.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Section: Difficulté */}
      <section>
        <h2 className="text-xs font-bold tracking-widest uppercase text-[#1a1a18] mb-4">
          Score de difficulté
        </h2>
        <div className="border border-[#ddd5cc] bg-[#faf7f4] p-6">
          <p className="text-sm text-[#4f4f49] mb-4 leading-relaxed">
            Chaque carte est évaluée sur trois axes (0–5), pour un total de 0–15.
          </p>
          <div className="space-y-2 text-sm text-[#4f4f49]">
            <div className="flex gap-3">
              <span className="font-bold text-[#1a1a18] w-32 shrink-0">Structure</span>
              <span className="text-[#6b6560]">Impact sur la forme musicale</span>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-[#1a1a18] w-32 shrink-0">Désorientation</span>
              <span className="text-[#6b6560]">Perturbation perceptive pour musiciens et auditoire</span>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-[#1a1a18] w-32 shrink-0">Performance</span>
              <span className="text-[#6b6560]">Exigence d'exécution physique ou cognitive</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
