# ALT-DECK — Moteur de contraintes v2

Outil web pour générer et valider des sessions musicales sous contraintes. Conçu pour les ateliers et résidences **ALT-Sessions** : chaque session combine deux ou trois cartes-contraintes tirées d'un deck de 42, selon des règles de composition strictes.

---

## Concept

Une session ALT-DECK impose deux contraintes simultanées à un groupe de musiciens. Les contraintes ne sont pas des suggestions : elles sont actives pour toute la durée de la session, sans négociation possible.

Chaque carte est évaluée sur trois axes de difficulté :
- **Structure** — dans quelle mesure elle réorganise la forme musicale
- **Désorientation** — ce qu'elle perturbe perceptivement pour les musiciens et l'auditoire
- **Performance** — ce qu'elle exige physiquement ou cognitivement

Une session est valide si les règles de composition sont respectées (voir section Moteur).

---

## Stack technique

| Outil | Version |
|---|---|
| Next.js | 16.2.2 (App Router) |
| React | 19.2.4 |
| TypeScript | 5 |
| Tailwind CSS | 4 (PostCSS) |
| Node.js | ≥ 20.9.0 (recommandé : 22) |

---

## Structure du projet

```
alt-deck/
├── app/
│   ├── layout.tsx          # Layout racine, Nav, métadonnées
│   ├── globals.css         # Variables CSS, palette de marque
│   ├── page.tsx            # Page d'accueil avec stats et navigation
│   ├── deck/page.tsx       # Vue de toutes les cartes, filtrables par nature
│   ├── generate/page.tsx   # Génération aléatoire pondérée
│   ├── curate/page.tsx     # Curation par profil de groupe
│   └── session/page.tsx    # Vue session active (cartes en grand)
├── components/
│   ├── Nav.tsx             # Barre de navigation avec logo
│   └── CardDisplay.tsx     # Composant carte réutilisable
├── lib/
│   ├── cards.ts            # Données du deck (42 cartes) + types + constantes couleur
│   └── engine.ts           # Moteur de génération, curation, tension
└── public/
    └── logo.svg            # Logo ALT-Sessions
```

---

## Données : `lib/cards.ts`

### Interface `Card`

```ts
interface Card {
  id: string;                 // identifiant unique en snake_case majuscule
  nature: Nature;             // "STRUCTURAL" | "COGNITIVE" | "SONIC" | "PHYSICAL"
  role: CardRole;             // "DESTRUCTIVE" | "TRANSFORMATIVE" | "CONSTRAINT" | "STABILIZER"
  title: string;              // titre court en anglais (identifiant artistique)
  description: string;        // description de la contrainte en français
  rules: string[];            // règles spécifiques et actionnables (2–3 items)
  difficulty: {
    structural: number;       // 0–5 : impact sur la forme musicale
    disorientation: number;   // 0–5 : perturbation perceptive
    performance: number;      // 0–5 : exigence d'exécution
  };
  risk: 1 | 2 | 3;           // 1 = faible, 2 = moyen, 3 = élevé
  incompatibilities: string[]; // IDs des cartes incompatibles
  synergies: string[];         // IDs des cartes qui se complètent bien
}
```

`totalScore(card)` = `difficulty.structural + difficulty.disorientation + difficulty.performance` (0–15)

### Natures (AXE 1 — ce que la contrainte affecte)

| Nature | Couleur | Description |
|---|---|---|
| `STRUCTURAL` | Terracotta `#b84a30` | Forme, temporalité, architecture du morceau |
| `COGNITIVE` | Bleu `#2d5fa0` | Rôles, hiérarchie, coordination entre musiciens |
| `SONIC` | Vert `#2d7a53` | Son, timbre, dynamique, articulation |
| `PHYSICAL` | Ocre `#9a7820` | Espace, corps, dispositif scénique |

### Rôles (AXE 2 — ce que la contrainte fait au système)

| Rôle | Description |
|---|---|
| `DESTRUCTIVE` | Supprime ou élimine quelque chose d'essentiel |
| `TRANSFORMATIVE` | Redirige ou recadre quelque chose d'existant |
| `CONSTRAINT` | Applique une règle limitative sans supprimer |
| `STABILIZER` | Préserve un ancrage pour rendre les combos agressifs jouables |

### Deck complet (42 cartes)

**STRUCTURAL — 14 cartes**

| ID | Titre | Rôle | Score | Risque |
|---|---|---|---|---|
| `NO_GRID` | NO GRID | DESTRUCTIVE | 14 | Élevé |
| `REMOVE_CORE` | REMOVE CORE | DESTRUCTIVE | 15 | Élevé |
| `MISE_A_NU` | MISE À NU | DESTRUCTIVE | 14 | Élevé |
| `REMOVE_HARMONY` | REMOVE HARMONY | DESTRUCTIVE | 12 | Élevé |
| `SILENCE_CORE` | SILENCE CORE | DESTRUCTIVE | 12 | Élevé |
| `BROKEN_FORM` | BROKEN FORM | TRANSFORMATIVE | 12 | Moyen |
| `SILENCE_AS_STRUCTURE` | SILENCE AS STRUCTURE | TRANSFORMATIVE | 12 | Moyen |
| `DEPLACEMENT_DE_FORME` | DÉPLACEMENT DE FORME | TRANSFORMATIVE | 12 | Moyen |
| `TEMPO_FRACTURE` | TEMPO FRACTURE | TRANSFORMATIVE | 14 | Élevé |
| `ONE_PASS_FLOW` | ONE PASS FLOW | CONSTRAINT | 9 | Faible |
| `UN_SEUL_GESTE` | UN SEUL GESTE | CONSTRAINT | 12 | Élevé |
| `FIXED_REFERENCE` | FIXED REFERENCE | STABILIZER | 8 | Faible |
| `FIXED_TEMPO` | FIXED TEMPO | STABILIZER | 8 | Faible |
| `ANCHOR_INSTRUMENT` | ANCHOR INSTRUMENT | STABILIZER | 8 | Faible |

**COGNITIVE — 10 cartes**

| ID | Titre | Rôle | Score | Risque |
|---|---|---|---|---|
| `NO_LEADER` | NO LEADER | DESTRUCTIVE | 12 | Élevé |
| `EFFECTIF_REDUIT` | EFFECTIF RÉDUIT | DESTRUCTIVE | 10 | Moyen |
| `ROLE_SWAP` | ROLE SWAP | TRANSFORMATIVE | 12 | Moyen |
| `RHYTHM_MIGRATION` | RHYTHM MIGRATION | TRANSFORMATIVE | 12 | Moyen |
| `INVERSION_DE_PLAN` | INVERSION DE PLAN | TRANSFORMATIVE | 11 | Moyen |
| `ROLE_INVERSION` | ROLE INVERSION | TRANSFORMATIVE | 11 | Moyen |
| `VOICE_OFF` | VOICE OFF | CONSTRAINT | 10 | Moyen |
| `LIMITED_AGENCY` | LIMITED AGENCY | CONSTRAINT | 11 | Élevé |
| `SANS_INITIATIVE` | SANS INITIATIVE | CONSTRAINT | 11 | Élevé |
| `CONSTANT_ELEMENT` | CONSTANT ELEMENT | STABILIZER | 8 | Faible |

**SONIC — 9 cartes**

| ID | Titre | Rôle | Score | Risque |
|---|---|---|---|---|
| `ACOUSTIC_SHIFT` | ACOUSTIC SHIFT | TRANSFORMATIVE | 12 | Moyen |
| `OBJETS_DU_LIEU` | OBJETS DU LIEU | TRANSFORMATIVE | 12 | Moyen |
| `INSTRUMENT_DEPLACE` | INSTRUMENT DÉPLACÉ | TRANSFORMATIVE | 12 | Moyen |
| `LOW_DYNAMIC_ONLY` | LOW DYNAMIC ONLY | CONSTRAINT | 9 | Faible |
| `NO_ATTACK` | NO ATTACK | CONSTRAINT | 11 | Moyen |
| `REGISTER_LIMIT` | REGISTER LIMIT | CONSTRAINT | 10 | Faible |
| `NO_SUSTAIN` | NO SUSTAIN | CONSTRAINT | 9 | Faible |
| `SANS_RESONANCE` | SANS RÉSONANCE | CONSTRAINT | 9 | Faible |
| `DYNAMIC_CEILING` | DYNAMIC CEILING | CONSTRAINT | 9 | Faible |

**PHYSICAL — 9 cartes**

| ID | Titre | Rôle | Score | Risque |
|---|---|---|---|---|
| `NO_MONITOR` | NO MONITOR | DESTRUCTIVE | 10 | Élevé |
| `AUDIENCE_BLEED` | AUDIENCE BLEED | TRANSFORMATIVE | 12 | Élevé |
| `PUBLIC_DISPERSE` | PUBLIC DISPERSÉ | TRANSFORMATIVE | 12 | Élevé |
| `CIRCLE_MODE` | CIRCLE MODE | CONSTRAINT | 9 | Faible |
| `DISTANCE_CONSTRAINT` | DISTANCE CONSTRAINT | CONSTRAINT | 10 | Moyen |
| `BACK_TO_BACK` | BACK TO BACK | CONSTRAINT | 8 | Faible |
| `LUMIERE_NATURELLE` | LUMIÈRE NATURELLE | CONSTRAINT | 9 | Faible |
| `CAPTATION_ASSUMEE` | CAPTATION ASSUMÉE | CONSTRAINT | 8 | Faible |
| `LIMITED_RANGE` | LIMITED RANGE | CONSTRAINT | 11 | Faible |

---

## Moteur : `lib/engine.ts`

### Règles de composition d'une paire

Une paire est valide si toutes les conditions suivantes sont réunies :

1. Les deux cartes sont différentes
2. Elles appartiennent à des **natures différentes**
3. Aucune incompatibilité per-carte (`card.incompatibilities`)
4. Score ≥ 8 pour chaque carte (les STABILIZER sont exemptés)
5. **Max 1 DESTRUCTIVE** dans la paire
6. **Au moins 1 TRANSFORMATIVE** — sauf si l'une des cartes est un STABILIZER (qui ancre n'importe quelle combinaison)
7. Si le **risque cumulé > 5**, la paire doit contenir un STABILIZER
8. **Tension minimale ≥ 5** (voir ci-dessous)

### Score de tension

```
computeTension(cards) = variance(cards.map(c => c.difficulty.disorientation))
                      + sum(cards.map(c => c.risk))
```

La variance mesure le déséquilibre de désorientation entre les cartes. La somme des risques mesure les enjeux totaux. Une tension trop faible (deux cartes sûres et similaires) est rejetée.

### Troisième carte

Quand le risque cumulé de la paire de base dépasse 5, la troisième carte doit obligatoirement être un **STABILIZER**. Elle ne peut pas avoir la même nature que les deux premières cartes.

### Génération aléatoire pondérée

```
poids = disorientation_factor
      × freshness_factor
      × type_balance_factor
      × risk_match_factor
      × synergy_factor
```

| Facteur | Rôle |
|---|---|
| `disorientation_factor` | Favorise les cartes à fort impact perceptif |
| `freshness_factor` | 0.3× pour les 5 dernières cartes utilisées, sinon 1.0 |
| `type_balance_factor` | Booste les STABILIZER après une sélection risquée, pénalise les doublons de rôle |
| `risk_match_factor` | Favorise les cartes dont le risque correspond à la cible (1.0 / 0.7 / 0.4) |
| `synergy_factor` | 1.3× si la carte est en synergie avec la sélection en cours |

Algorithme : tire card1 depuis le pool éligible, construit un pool filtré pour card2 (validité complète), tire card2 avec contexte mis à jour. 80 tentatives max.

L'historique des cartes récentes est stocké en **localStorage** (`altdeck_recently_used`, max 5).

### Mode curation

Le profil filtre et classe les cartes selon :

```ts
interface CurationProfile {
  genre: string;
  experience_level: "beginner" | "intermediate" | "advanced";
  flexibility: "low" | "medium" | "high";
  risk_tolerance: 1 | 2 | 3;
}
```

Chaque paire valide est classée par :

```
rank_score = (artistic_relevance(c1) + artistic_relevance(c2)) / 2
           + (transformation_potential(c1) + transformation_potential(c2)) / 2
           + computeTension([c1, c2]) / 10
```

Les 3 meilleures paires sont retournées, triées par `rank_score` décroissant.

---

## Pages

### `/deck` — Le deck complet
Toutes les cartes filtrables par nature (STRUCTURAL, COGNITIVE, SONIC, PHYSICAL). Affiche le score min/max du filtre actif.

### `/generate` — Génération aléatoire
Génère une paire valide via l'algorithme pondéré. Affiche les scores et la tension de la session. Permet d'ajouter une troisième contrainte ou de relancer.

### `/curate` — Curation par profil
Formulaire de profil groupe (expérience, flexibilité, tolérance au risque, genre). Retourne jusqu'à 3 paires classées avec leur score de tension. Chaque paire est directement lançable en session.

### `/session` — Session active
Vue pleine-page des cartes actives avec leurs règles. Charge depuis `sessionStorage` (`altdeck_active_session`). Affiche la charge totale et la tension. Permet la génération rapide depuis cette page.

---

## Palette de marque

```css
--bg:           #f5f0eb   /* fond global, parchemin chaud */
--bg-card:      #faf7f4   /* fond des cartes */
--text:         #1a1a18   /* texte principal */
--text-muted:   #6b6560   /* texte secondaire */
--text-mid:     #4f4f49   /* texte intermédiaire */
--border:       #ddd5cc   /* bordures */
--accent:       #b84a30   /* terracotta, CTA, STRUCTURAL */
--accent-hover: #8c3622   /* terracotta foncé */
```

Natures :

```
STRUCTURAL → #b84a30 (terracotta)
COGNITIVE  → #2d5fa0 (bleu ardoise)
SONIC      → #2d7a53 (vert forêt)
PHYSICAL   → #9a7820 (ocre)
```

Typo : **monospace** pour les titres de cartes, système pour l'interface.

---

## Démarrage local

```bash
# Nécessite Node.js ≥ 20.9.0
nvm use 22

npm install
npm run dev
# → http://localhost:3000
```

```bash
npm run build   # build de production
npm run start   # serveur de production
```

---

## Stockage navigateur

| Clé | Stockage | Contenu |
|---|---|---|
| `altdeck_active_session` | `sessionStorage` | `{ card1: Card, card2: Card, card3?: Card }` — session en cours |
| `altdeck_recently_used` | `localStorage` | `string[]` — IDs des 5 dernières cartes utilisées |
