# ALT-DECK — Moteur de contraintes

Outil web pour générer et valider des sessions musicales sous contraintes. Conçu pour les ateliers et résidences **ALT-Sessions** : chaque session combine deux cartes-contraintes tirées d'un deck de 32, selon des règles de validation strictes.

---

## Concept

Une session ALT-DECK impose deux contraintes simultanées à un groupe de musiciens. Les contraintes ne sont pas des suggestions — elles sont actives pour toute la durée de la session, sans négociation possible.

Chaque contrainte est évaluée sur trois axes :
- **Impact structurel** — dans quelle mesure elle réorganise la forme musicale
- **Inconfort du performer** — ce qu'elle exige physiquement ou cognitivement
- **Changement perceptif** — ce que l'auditeur entend différemment

Une session n'est valide que si chaque carte score ≥ 8/15 et que les deux cartes appartiennent à des catégories différentes.

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
│   ├── globals.css         # Variables CSS, palette de marque, Poppins
│   ├── page.tsx            # Page d'accueil (redirige vers /generate)
│   ├── deck/page.tsx       # Vue de toutes les cartes, filtrables par catégorie
│   ├── generate/page.tsx   # Génération aléatoire pondérée
│   ├── curate/page.tsx     # Curation par profil de groupe
│   └── session/page.tsx    # Vue session active (deux cartes en grand)
├── components/
│   ├── Nav.tsx             # Barre de navigation avec logo
│   └── CardDisplay.tsx     # Composant carte réutilisable
├── lib/
│   ├── cards.ts            # Données du deck (32 cartes) + types + constantes couleur
│   └── engine.ts           # Moteur de génération, curation, scoring
└── public/
    └── logo.svg            # Logo ALT-Sessions
```

---

## Données : `lib/cards.ts`

### Interface `Card`

```ts
interface Card {
  id: string;               // identifiant unique en snake_case majuscule
  category: Category;       // "STRUCTURE" | "ROLE" | "SOUND" | "DEVICE"
  title: string;            // titre court en anglais (identifiant artistique)
  description: string;      // description de la contrainte en français
  example: string;          // exemple concret ancré dans un contexte ALT-Sessions
  difficulty: 1 | 2 | 3 | 4 | 5;
  tags: Tag[];              // "structural" | "cognitive" | "sonic" | "physical"
  risk_level: RiskLevel;    // "low" | "medium" | "high"
  suitable_for: SuitableFor[]; // "solo" | "duo" | "band"
  scores: {
    structural_impact: number;    // 1–5
    performer_discomfort: number; // 1–5
    perceptual_change: number;    // 1–5
  };
}
```

### Catégories

| Catégorie | Couleur | Description |
|---|---|---|
| `STRUCTURE` | Terracotta `#b84a30` | Contraintes sur la forme et l'organisation temporelle |
| `ROLE` | Bleu `#2d5fa0` | Contraintes sur les rôles et fonctions de chaque musicien |
| `SOUND` | Vert `#2d7a53` | Contraintes sur le son, le timbre, la dynamique |
| `DEVICE` | Ocre `#9a7820` | Contraintes sur le dispositif, l'espace, le corps |

### Deck complet (32 cartes)

**STRUCTURE (8)**

| ID | Titre | Score | Risque |
|---|---|---|---|
| `NO_GRID` | NO GRID | 14 | Élevé |
| `BROKEN_FORM` | BROKEN FORM | 12 | Moyen |
| `REMOVE_CORE` | REMOVE CORE | 15 | Élevé |
| `ONE_PASS_FLOW` | ONE PASS FLOW | 9 | Faible |
| `SILENCE_AS_STRUCTURE` | SILENCE AS STRUCTURE | 12 | Moyen |
| `DEPLACEMENT_DE_FORME` | DÉPLACEMENT DE FORME | 12 | Moyen |
| `MISE_A_NU` | MISE À NU | 14 | Élevé |
| `UN_SEUL_GESTE` | UN SEUL GESTE | 12 | Élevé |

**ROLE (8)**

| ID | Titre | Score | Risque |
|---|---|---|---|
| `ROLE_SWAP` | ROLE SWAP | 12 | Moyen |
| `NO_LEADER` | NO LEADER | 12 | Élevé |
| `VOICE_OFF` | VOICE OFF | 10 | Moyen |
| `RHYTHM_MIGRATION` | RHYTHM MIGRATION | 12 | Moyen |
| `LIMITED_AGENCY` | LIMITED AGENCY | 11 | Élevé |
| `EFFECTIF_REDUIT` | EFFECTIF RÉDUIT | 11 | Moyen |
| `INVERSION_DE_PLAN` | INVERSION DE PLAN | 11 | Moyen |
| `SANS_INITIATIVE` | SANS INITIATIVE | 11 | Élevé |

**SOUND (9)**

| ID | Titre | Score | Risque |
|---|---|---|---|
| `LOW_DYNAMIC_ONLY` | LOW DYNAMIC ONLY | 9 | Faible |
| `NO_ATTACK` | NO ATTACK | 11 | Moyen |
| `REGISTER_LIMIT` | REGISTER LIMIT | 10 | Faible |
| `ACOUSTIC_SHIFT` | ACOUSTIC SHIFT | 12 | Moyen |
| `NO_SUSTAIN` | NO SUSTAIN | 9 | Faible |
| `OBJETS_DU_LIEU` | OBJETS DU LIEU | 12 | Moyen |
| `SANS_RESONANCE` | SANS RÉSONANCE | 9 | Faible |
| `INSTRUMENT_DEPLACE` | INSTRUMENT DÉPLACÉ | 12 | Moyen |

**DEVICE (9)**

| ID | Titre | Score | Risque |
|---|---|---|---|
| `CIRCLE_MODE` | CIRCLE MODE | 9 | Faible |
| `NO_MONITOR` | NO MONITOR | 11 | Élevé |
| `DISTANCE_CONSTRAINT` | DISTANCE CONSTRAINT | 10 | Moyen |
| `BACK_TO_BACK` | BACK TO BACK | 8 | Faible |
| `AUDIENCE_BLEED` | AUDIENCE BLEED | 12 | Élevé |
| `LUMIERE_NATURELLE` | LUMIÈRE NATURELLE | 9 | Faible |
| `PUBLIC_DISPERSE` | PUBLIC DISPERSÉ | 12 | Élevé |
| `CAPTATION_ASSUMEE` | CAPTATION ASSUMÉE | 8 | Faible |

---

## Moteur : `lib/engine.ts`

### Règles de validation d'une paire

Une paire est valide si :
1. Les deux cartes sont différentes
2. Elles appartiennent à des **catégories différentes**
3. Aucune n'est dans la **liste noire** ensemble
4. Chacune a un score ≥ 8

### Liste noire (5 paires incompatibles)

| Carte A | Carte B | Raison |
|---|---|---|
| `NO_GRID` | `NO_LEADER` | Désorientation totale — groupe sans ancre ni direction |
| `NO_ATTACK` | `NO_SUSTAIN` | Se contredisent — impossible de jouer aucune note correctement |
| `MISE_A_NU` | `REMOVE_CORE` | Les deux vident le morceau — risque de silence total |
| `UN_SEUL_GESTE` | `LIMITED_AGENCY` | Paralysie totale du jeu |
| `PUBLIC_DISPERSE` | `AUDIENCE_BLEED` | Doublons dispositifs public |

### Génération aléatoire pondérée

```
poids = base × difficulty_factor × freshness_factor

difficulty_factor = 1.0 + (difficulté − 1) × 0.125
freshness_factor  = 0.3 si la carte est dans les 5 dernières utilisées, sinon 1.0
```

- Tire card1 depuis le pool éligible (score ≥ 8)
- Tire card2 depuis un sous-pool (catégorie différente, non blacklistée avec card1)
- 50 tentatives max avant d'abandonner
- L'historique des cartes récentes est stocké en **localStorage** (`altdeck_recently_used`, max 5)

### Mode curation

Le profil de curation filtre les cartes selon :
- `band_size` : "solo" | "duo" | "band"
- `risk_tolerance` : "low" | "medium" | "high" (bloque les cartes de risque supérieur)
- Score ≥ 8

Chaque paire valide est classée par :

```
rank_score = (artistic_relevance(card1) + artistic_relevance(card2)) / 2
           + (transformation_potential(card1) + transformation_potential(card2)) / 2
```

- **artistic_relevance** : pondère difficulté et scores selon le niveau d'expérience et la flexibilité du groupe
- **transformation_potential** : `totalScore / 15.0`

Les 3 meilleures paires sont retournées, triées par `rank_score` décroissant.

---

## Pages

### `/deck` — Le deck complet
Affiche toutes les cartes filtrables par catégorie. Affiche le score min/max du filtre actif en bas de page.

### `/generate` — Génération aléatoire
Génère une paire valide via l'algorithme pondéré. Affiche les scores, le statut de validation, et les cartes récemment utilisées. Permet de lancer la session ou de regénérer.

### `/curate` — Curation par profil
Formulaire de profil groupe (formation, expérience, flexibilité, tolérance au risque, genre). Retourne jusqu'à 3 paires classées. Chaque paire est directement lançable en session.

### `/session` — Session active
Vue pleine-page des deux cartes actives. Charge depuis `sessionStorage` (`altdeck_active_session`). Permet la génération rapide (aléatoire sans profil) depuis cette page. Affiche la charge totale (score1 + score2 / 30).

---

## Palette de marque

```css
--bg:           #f5f0eb   /* fond global — parchemin chaud */
--bg-card:      #faf7f4   /* fond des cartes */
--text:         #1a1a18   /* texte principal */
--text-muted:   #6b6560   /* texte secondaire */
--text-mid:     #4f4f49   /* texte intermédiaire */
--border:       #ddd5cc   /* bordures */
--accent:       #b84a30   /* terracotta — CTA, STRUCTURE */
--accent-hover: #8c3622   /* terracotta foncé */
```

Catégories :

```
STRUCTURE → #b84a30 (terracotta)
ROLE      → #2d5fa0 (bleu ardoise)
SOUND     → #2d7a53 (vert forêt)
DEVICE    → #9a7820 (ocre)
```

Typo : **Poppins** (UI), **monospace** (titres de cartes).

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
| `altdeck_active_session` | `sessionStorage` | `{ card1: Card, card2: Card }` — session en cours |
| `altdeck_recently_used` | `localStorage` | `string[]` — IDs des 5 dernières cartes utilisées |
