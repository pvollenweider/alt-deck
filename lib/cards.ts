export type Category = "STRUCTURE" | "ROLE" | "SOUND" | "DEVICE";
export type Difficulty = 1 | 2 | 3 | 4 | 5;
export type Tag = "structural" | "cognitive" | "sonic" | "physical";
export type RiskLevel = "low" | "medium" | "high";
export type SuitableFor = "solo" | "duo" | "band";

export interface Scores {
  structural_impact: number;
  performer_discomfort: number;
  perceptual_change: number;
}

export interface Card {
  id: string;
  category: Category;
  title: string;
  description: string;
  example: string;
  difficulty: Difficulty;
  tags: Tag[];
  risk_level: RiskLevel;
  suitable_for: SuitableFor[];
  scores: Scores;
}

export function totalScore(card: Card): number {
  return (
    card.scores.structural_impact +
    card.scores.performer_discomfort +
    card.scores.perceptual_change
  );
}

export const CARDS: Card[] = [
  // STRUCTURE
  {
    id: "NO_GRID",
    category: "STRUCTURE",
    title: "NO GRID",
    description:
      "Supprimer toute référence à la grille rythmique. Ni pulsation, ni tempo, ni compte.",
    example:
      "Un quartet joue sans batterie ni pied. Personne ne marque le temps. Les entrées flottent.",
    difficulty: 5,
    tags: ["structural", "cognitive"],
    risk_level: "high",
    suitable_for: ["solo", "duo", "band"],
    scores: { structural_impact: 5, performer_discomfort: 4, perceptual_change: 5 },
  },
  {
    id: "BROKEN_FORM",
    category: "STRUCTURE",
    title: "BROKEN FORM",
    description:
      "Interrompre la forme naturelle du morceau. Insérer un silence ou une coupure à un point non conventionnel.",
    example:
      "Un morceau en couplet-refrain s'arrête net après le premier refrain. Silence de 8 secondes. Reprise au pont.",
    difficulty: 4,
    tags: ["structural", "cognitive"],
    risk_level: "medium",
    suitable_for: ["solo", "duo", "band"],
    scores: { structural_impact: 5, performer_discomfort: 3, perceptual_change: 4 },
  },
  {
    id: "REMOVE_CORE",
    category: "STRUCTURE",
    title: "REMOVE CORE",
    description:
      "Identifier l'élément central du morceau. Le supprimer intégralement.",
    example:
      "Un morceau construit sur un riff de basse : la basse disparaît. Ce qui restait en arrière-plan devient la pièce entière.",
    difficulty: 5,
    tags: ["structural", "cognitive"],
    risk_level: "high",
    suitable_for: ["solo", "duo", "band"],
    scores: { structural_impact: 5, performer_discomfort: 5, perceptual_change: 5 },
  },
  {
    id: "ONE_PASS_FLOW",
    category: "STRUCTURE",
    title: "ONE PASS FLOW",
    description:
      "Le morceau est joué une seule fois, linéairement. Ni boucles, ni reprises, ni retours.",
    example:
      "Un morceau habituellement rejoué deux fois passe en une seule traversée. Le refrain n'est entendu qu'une fois.",
    difficulty: 3,
    tags: ["structural"],
    risk_level: "low",
    suitable_for: ["solo", "duo", "band"],
    scores: { structural_impact: 4, performer_discomfort: 2, perceptual_change: 3 },
  },
  {
    id: "SILENCE_AS_STRUCTURE",
    category: "STRUCTURE",
    title: "SILENCE AS STRUCTURE",
    description:
      "Le silence remplace au moins une section structurelle. Ce n'est pas un repos.",
    example:
      "Le pont disparaît. À sa place : 15 secondes de silence complet, tenu par tous. La section suivante repart sans préparation.",
    difficulty: 4,
    tags: ["structural", "cognitive"],
    risk_level: "medium",
    suitable_for: ["solo", "duo", "band"],
    scores: { structural_impact: 5, performer_discomfort: 3, perceptual_change: 4 },
  },

  // ROLE
  {
    id: "ROLE_SWAP",
    category: "ROLE",
    title: "ROLE SWAP",
    description:
      "Chaque musicien prend le rôle musical d'un autre. La basse joue la mélodie, la mélodie joue le rythme.",
    example:
      "Dans un trio guitare-basse-voix : la voix fredonne le riff de basse, la basse suit la ligne vocale, la guitare pulse.",
    difficulty: 4,
    tags: ["structural", "cognitive"],
    risk_level: "medium",
    suitable_for: ["duo", "band"],
    scores: { structural_impact: 4, performer_discomfort: 4, perceptual_change: 4 },
  },
  {
    id: "NO_LEADER",
    category: "ROLE",
    title: "NO LEADER",
    description:
      "Aucun musicien ne peut initier de transitions ni donner de signal. Tout changement doit émerger.",
    example:
      "Personne ne lève les yeux pour signaler le refrain. La section change quand tout le monde la ressent — ou pas.",
    difficulty: 5,
    tags: ["structural", "cognitive"],
    risk_level: "high",
    suitable_for: ["duo", "band"],
    scores: { structural_impact: 3, performer_discomfort: 5, perceptual_change: 4 },
  },
  {
    id: "VOICE_OFF",
    category: "ROLE",
    title: "VOICE OFF",
    description:
      "La voix principale ou l'instrument lead joue au niveau ou en dessous du plancher dynamique de l'ensemble.",
    example:
      "La voix chante à peine — presque parlé, presque inaudible. L'accompagnement doit descendre encore plus bas pour la laisser exister.",
    difficulty: 3,
    tags: ["sonic", "cognitive"],
    risk_level: "medium",
    suitable_for: ["solo", "duo", "band"],
    scores: { structural_impact: 2, performer_discomfort: 4, perceptual_change: 4 },
  },
  {
    id: "RHYTHM_MIGRATION",
    category: "ROLE",
    title: "RHYTHM MIGRATION",
    description:
      "L'ancre rythmique se déplace vers un instrument non-percussif pour toute la durée.",
    example:
      "La guitare acoustique pulse en picking régulier. La batterie joue librement, en texture. Le temps vient de là où on ne l'attendait pas.",
    difficulty: 4,
    tags: ["structural", "cognitive"],
    risk_level: "medium",
    suitable_for: ["duo", "band"],
    scores: { structural_impact: 4, performer_discomfort: 4, perceptual_change: 4 },
  },
  {
    id: "LIMITED_AGENCY",
    category: "ROLE",
    title: "LIMITED AGENCY",
    description:
      "Chaque musicien ne peut que réagir, jamais initier. Un seul musicien est exempté.",
    example:
      "La voix est la seule à pouvoir ouvrir. Tous les autres attendent qu'elle joue pour entrer — et doivent s'arrêter si elle s'arrête.",
    difficulty: 4,
    tags: ["structural", "cognitive"],
    risk_level: "high",
    suitable_for: ["duo", "band"],
    scores: { structural_impact: 3, performer_discomfort: 5, perceptual_change: 3 },
  },

  // SOUND
  {
    id: "LOW_DYNAMIC_ONLY",
    category: "SOUND",
    title: "LOW DYNAMIC ONLY",
    description:
      "Toute la session reste en pp ou en dessous. Aucun crescendo au-delà de p.",
    example:
      "Dans une pièce de 20 personnes assises à moins de 3 mètres, la voix chuchote presque. On entend les doigts sur les cordes.",
    difficulty: 3,
    tags: ["sonic"],
    risk_level: "low",
    suitable_for: ["solo", "duo", "band"],
    scores: { structural_impact: 2, performer_discomfort: 3, perceptual_change: 4 },
  },
  {
    id: "NO_ATTACK",
    category: "SOUND",
    title: "NO ATTACK",
    description:
      "Aucune note ne peut commencer par une attaque percussive ou dure. Toutes les entrées doivent être progressives.",
    example:
      "La guitare glisse sur la corde sans frapper. La voix entre en fondu depuis le silence. Chaque son naît, il n'arrive pas.",
    difficulty: 4,
    tags: ["sonic", "physical"],
    risk_level: "medium",
    suitable_for: ["solo", "duo", "band"],
    scores: { structural_impact: 2, performer_discomfort: 4, perceptual_change: 5 },
  },
  {
    id: "REGISTER_LIMIT",
    category: "SOUND",
    title: "REGISTER LIMIT",
    description:
      "Tous les musiciens sont confinés à une plage d'une seule octave pour toute la session.",
    example:
      "Tous jouent entre do3 et do4. La densité harmonique s'écrase. Les voix et instruments se frôlent.",
    difficulty: 3,
    tags: ["sonic", "physical"],
    risk_level: "low",
    suitable_for: ["solo", "duo", "band"],
    scores: { structural_impact: 3, performer_discomfort: 3, perceptual_change: 4 },
  },
  {
    id: "ACOUSTIC_SHIFT",
    category: "SOUND",
    title: "ACOUSTIC SHIFT",
    description:
      "Tous les instruments électriques ou amplifiés sont joués acoustiquement ou débranchés.",
    example:
      "La guitare électrique débranché résonne faiblement. La basse devient presque inaudible. L'espace de la pièce remplace l'ampli.",
    difficulty: 4,
    tags: ["sonic", "physical"],
    risk_level: "medium",
    suitable_for: ["solo", "duo", "band"],
    scores: { structural_impact: 3, performer_discomfort: 4, perceptual_change: 5 },
  },
  {
    id: "NO_SUSTAIN",
    category: "SOUND",
    title: "NO SUSTAIN",
    description:
      "Aucune note ne peut être tenue au-delà de sa décroissance d'attaque. L'articulation est toujours staccato.",
    example:
      "Un morceau de ballades lentes joué entièrement en détaché. Les espaces entre les notes deviennent aussi présents que les notes elles-mêmes.",
    difficulty: 3,
    tags: ["sonic", "physical"],
    risk_level: "low",
    suitable_for: ["solo", "duo", "band"],
    scores: { structural_impact: 2, performer_discomfort: 3, perceptual_change: 4 },
  },

  // STRUCTURE (suite)
  {
    id: "DEPLACEMENT_DE_FORME",
    category: "STRUCTURE",
    title: "DÉPLACEMENT DE FORME",
    description:
      "Jouer les sections du morceau dans un ordre différent de l'original. La forme devient étrangère à elle-même.",
    example:
      "Intro → pont → refrain → couplet. Le morceau existe, mais personne ne le reconnaît immédiatement.",
    difficulty: 4,
    tags: ["structural", "cognitive"],
    risk_level: "medium",
    suitable_for: ["solo", "duo", "band"],
    scores: { structural_impact: 5, performer_discomfort: 3, perceptual_change: 4 },
  },
  {
    id: "MISE_A_NU",
    category: "STRUCTURE",
    title: "MISE À NU",
    description:
      "Supprimer tout ce qui habille le morceau. Ne garder que ce qui tient sans soutien.",
    example:
      "Pad, doublures, contre-chants, harmonies — tout part. Il reste une voix et un accord gratté. C'est suffisant ou ça ne tient pas.",
    difficulty: 5,
    tags: ["structural", "cognitive"],
    risk_level: "high",
    suitable_for: ["solo", "duo", "band"],
    scores: { structural_impact: 5, performer_discomfort: 4, perceptual_change: 5 },
  },
  {
    id: "UN_SEUL_GESTE",
    category: "STRUCTURE",
    title: "UN SEUL GESTE",
    description:
      "Chaque musicien réduit son jeu à un seul geste récurrent, tenu pour toute la durée de la session.",
    example:
      "La guitare ne fait que gratter une corde à vide. La basse tient une pédale. Le chant reste sur deux notes. Le morceau tient sur ce peu.",
    difficulty: 4,
    tags: ["structural", "cognitive", "physical"],
    risk_level: "high",
    suitable_for: ["solo", "duo", "band"],
    scores: { structural_impact: 4, performer_discomfort: 4, perceptual_change: 4 },
  },

  // ROLE (suite)
  {
    id: "EFFECTIF_REDUIT",
    category: "ROLE",
    title: "EFFECTIF RÉDUIT",
    description:
      "Réduire l'effectif d'au moins un musicien par rapport à la formation habituelle. La formation ne peut pas s'assembler complètement.",
    example:
      "Un groupe de cinq joue à trois. Ce qui manque s'entend — et ce qui reste prend plus de place.",
    difficulty: 4,
    tags: ["structural", "cognitive"],
    risk_level: "medium",
    suitable_for: ["duo", "band"],
    scores: { structural_impact: 4, performer_discomfort: 3, perceptual_change: 4 },
  },
  {
    id: "INVERSION_DE_PLAN",
    category: "ROLE",
    title: "INVERSION DE PLAN",
    description:
      "L'instrument de fond passe au premier plan. L'instrument soliste disparaît en arrière-plan.",
    example:
      "La basse joue seule au centre. La guitare solo se noie dans un jeu de texture, presque inaudible.",
    difficulty: 3,
    tags: ["structural", "cognitive"],
    risk_level: "medium",
    suitable_for: ["duo", "band"],
    scores: { structural_impact: 3, performer_discomfort: 4, perceptual_change: 4 },
  },
  {
    id: "SANS_INITIATIVE",
    category: "ROLE",
    title: "SANS INITIATIVE",
    description:
      "Un musicien désigné ne joue que si un autre a joué avant lui dans les 5 dernières secondes. Il ne peut jamais ouvrir.",
    example:
      "Le pianiste attend. La voix pose une note. Le piano répond. Si la voix se tait trop longtemps, le piano se tait aussi.",
    difficulty: 4,
    tags: ["structural", "cognitive"],
    risk_level: "high",
    suitable_for: ["duo", "band"],
    scores: { structural_impact: 3, performer_discomfort: 5, perceptual_change: 3 },
  },

  // SOUND (suite)
  {
    id: "OBJETS_DU_LIEU",
    category: "SOUND",
    title: "OBJETS DU LIEU",
    description:
      "Au moins un instrument est remplacé par un objet sonore trouvé dans l'espace de jeu. L'acoustique du lieu entre dans le morceau.",
    example:
      "Dans un atelier : une planche de bois frappée remplace la caisse claire. Un verre d'eau posé sur la table sert de résonateur.",
    difficulty: 4,
    tags: ["sonic", "physical", "cognitive"],
    risk_level: "medium",
    suitable_for: ["solo", "duo", "band"],
    scores: { structural_impact: 3, performer_discomfort: 4, perceptual_change: 5 },
  },
  {
    id: "SANS_RESONANCE",
    category: "SOUND",
    title: "SANS RÉSONANCE",
    description:
      "Toute résonance artificielle est supprimée — reverb, delay, pédale de sustain. Le son s'arrête avec le geste.",
    example:
      "Une voix habituellement noyée dans la reverb chante dans le sec total. Chaque intention, chaque hésitation s'entend.",
    difficulty: 3,
    tags: ["sonic", "physical"],
    risk_level: "low",
    suitable_for: ["solo", "duo", "band"],
    scores: { structural_impact: 2, performer_discomfort: 3, perceptual_change: 4 },
  },
  {
    id: "INSTRUMENT_DEPLACE",
    category: "SOUND",
    title: "INSTRUMENT DÉPLACÉ",
    description:
      "Chaque musicien joue son instrument d'une façon non conventionnelle — préparation, placement, technique étendue.",
    example:
      "La guitare est posée à plat, jouée avec un archet. La basse est frappée avec les paumes. Les sonorités deviennent méconnaissables.",
    difficulty: 4,
    tags: ["sonic", "physical", "cognitive"],
    risk_level: "medium",
    suitable_for: ["solo", "duo", "band"],
    scores: { structural_impact: 3, performer_discomfort: 5, perceptual_change: 4 },
  },

  // DEVICE
  {
    id: "CIRCLE_MODE",
    category: "DEVICE",
    title: "CIRCLE MODE",
    description:
      "Les musiciens sont disposés en cercle face vers l'extérieur. Aucun contact visuel entre eux.",
    example:
      "Un trio en cercle dos tourné vers le centre. Chacun joue vers un coin de la pièce. L'écoute remplace le regard.",
    difficulty: 3,
    tags: ["physical", "cognitive"],
    risk_level: "low",
    suitable_for: ["duo", "band"],
    scores: { structural_impact: 2, performer_discomfort: 4, perceptual_change: 3 },
  },
  {
    id: "NO_MONITOR",
    category: "DEVICE",
    title: "NO MONITOR",
    description:
      "Tout monitoring de scène est supprimé. Les musiciens n'entendent que le son de la salle.",
    example:
      "Dans une salle communale : les retours sont éteints. La balance change complètement. Les musiciens s'entendent comme le public les entend.",
    difficulty: 4,
    tags: ["sonic", "physical"],
    risk_level: "high",
    suitable_for: ["duo", "band"],
    scores: { structural_impact: 2, performer_discomfort: 5, perceptual_change: 4 },
  },
  {
    id: "DISTANCE_CONSTRAINT",
    category: "DEVICE",
    title: "DISTANCE CONSTRAINT",
    description:
      "Les musiciens sont physiquement séparés. Minimum 5 mètres entre chaque musicien.",
    example:
      "Guitariste à une extrémité de l'atelier, voix à l'autre. Le public est entre eux. Le son voyage dans l'espace.",
    difficulty: 3,
    tags: ["physical", "cognitive"],
    risk_level: "medium",
    suitable_for: ["duo", "band"],
    scores: { structural_impact: 2, performer_discomfort: 4, perceptual_change: 4 },
  },
  {
    id: "BACK_TO_BACK",
    category: "DEVICE",
    title: "BACK TO BACK",
    description:
      "Les musiciens se tiennent dos à dos. Aucun signal visuel autorisé.",
    example:
      "Un duo voix-guitare dos à dos. Ni regard, ni hochement de tête. Seul le son circule.",
    difficulty: 3,
    tags: ["physical", "cognitive"],
    risk_level: "low",
    suitable_for: ["duo", "band"],
    scores: { structural_impact: 2, performer_discomfort: 3, perceptual_change: 3 },
  },
  {
    id: "AUDIENCE_BLEED",
    category: "DEVICE",
    title: "AUDIENCE BLEED",
    description:
      "Le public est placé dans l'espace de jeu. Aucune séparation scène/salle.",
    example:
      "Les auditeurs sont assis entre les musiciens. La respiration du public, ses mouvements, entrent dans l'acoustique du morceau.",
    difficulty: 4,
    tags: ["physical", "cognitive"],
    risk_level: "high",
    suitable_for: ["solo", "duo", "band"],
    scores: { structural_impact: 3, performer_discomfort: 4, perceptual_change: 5 },
  },
  {
    id: "LUMIERE_NATURELLE",
    category: "DEVICE",
    title: "LUMIÈRE NATURELLE",
    description:
      "La session se joue avec la seule lumière du lieu — naturelle ou ambiante. Aucun éclairage de scène ni artificiel.",
    example:
      "Session en fin d'après-midi dans un atelier. La lumière baisse au fil des morceaux. La dernière pièce se joue presque dans le noir.",
    difficulty: 2,
    tags: ["physical", "cognitive"],
    risk_level: "low",
    suitable_for: ["solo", "duo", "band"],
    scores: { structural_impact: 2, performer_discomfort: 3, perceptual_change: 4 },
  },
  {
    id: "PUBLIC_DISPERSE",
    category: "DEVICE",
    title: "PUBLIC DISPERSÉ",
    description:
      "Le public est réparti dans l'espace, sans regroupement. Les musiciens jouent entre les personnes présentes.",
    example:
      "20 personnes réparties dans une grande pièce, certaines debout, d'autres assises au sol. Les musiciens se déplacent lentement entre eux.",
    difficulty: 4,
    tags: ["physical", "cognitive"],
    risk_level: "high",
    suitable_for: ["solo", "duo", "band"],
    scores: { structural_impact: 3, performer_discomfort: 4, perceptual_change: 5 },
  },
  {
    id: "CAPTATION_ASSUMEE",
    category: "DEVICE",
    title: "CAPTATION ASSUMÉE",
    description:
      "Les micros et caméras sont visibles, exposés, intégrés au dispositif. Le tournage fait partie du jeu.",
    example:
      "Les perches et micros de sol sont laissés à vue. Un musicien joue directement face à une caméra fixe. La trace est présente dès le début.",
    difficulty: 2,
    tags: ["physical", "cognitive"],
    risk_level: "low",
    suitable_for: ["solo", "duo", "band"],
    scores: { structural_impact: 2, performer_discomfort: 3, perceptual_change: 3 },
  },
];

export const CATEGORY_COLORS: Record<Category, string> = {
  STRUCTURE: "#b84a30",
  ROLE: "#2d5fa0",
  SOUND: "#2d7a53",
  DEVICE: "#9a7820",
};

export const CATEGORY_BG: Record<Category, string> = {
  STRUCTURE: "bg-[#b84a30]",
  ROLE: "bg-[#2d5fa0]",
  SOUND: "bg-[#2d7a53]",
  DEVICE: "bg-[#9a7820]",
};

export const CATEGORY_BORDER: Record<Category, string> = {
  STRUCTURE: "border-[#b84a30]",
  ROLE: "border-[#2d5fa0]",
  SOUND: "border-[#2d7a53]",
  DEVICE: "border-[#9a7820]",
};

export const CATEGORY_TEXT: Record<Category, string> = {
  STRUCTURE: "text-[#b84a30]",
  ROLE: "text-[#2d5fa0]",
  SOUND: "text-[#2d7a53]",
  DEVICE: "text-[#9a7820]",
};

export const CATEGORY_DOT: Record<Category, string> = {
  STRUCTURE: "bg-[#b84a30]",
  ROLE: "bg-[#2d5fa0]",
  SOUND: "bg-[#2d7a53]",
  DEVICE: "bg-[#9a7820]",
};
