import { Card, CARDS, SuitableFor, RiskLevel, totalScore } from "./cards";

// Blacklist: pairs of card IDs that cannot be used together
export const BLACKLIST: [string, string][] = [
  ["NO_GRID", "NO_LEADER"],
  ["NO_ATTACK", "NO_SUSTAIN"],
  ["MISE_A_NU", "REMOVE_CORE"],       // les deux vident — risque de silence total
  ["UN_SEUL_GESTE", "LIMITED_AGENCY"], // paralysie totale du jeu
  ["PUBLIC_DISPERSE", "AUDIENCE_BLEED"], // doublons dispositifs public
];

export function isBlacklisted(a: Card, b: Card): boolean {
  return BLACKLIST.some(
    ([x, y]) =>
      (a.id === x && b.id === y) || (a.id === y && b.id === x)
  );
}

export function isValidPair(a: Card, b: Card): boolean {
  if (a.id === b.id) return false;
  if (a.category === b.category) return false;
  if (isBlacklisted(a, b)) return false;
  if (totalScore(a) < 8) return false;
  if (totalScore(b) < 8) return false;
  return true;
}

// ─── Weighted Random ────────────────────────────────────────────────

function difficultyFactor(difficulty: number): number {
  return 1.0 + (difficulty - 1) * 0.125;
}

function freshnessFactor(cardId: string, recentlyUsed: string[]): number {
  return recentlyUsed.includes(cardId) ? 0.3 : 1.0;
}

function computeWeight(card: Card, recentlyUsed: string[]): number {
  return (
    1.0 *
    difficultyFactor(card.difficulty) *
    freshnessFactor(card.id, recentlyUsed)
  );
}

function weightedPick(pool: Card[], recentlyUsed: string[]): Card | null {
  if (pool.length === 0) return null;
  const weights = pool.map((c) => computeWeight(c, recentlyUsed));
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < pool.length; i++) {
    r -= weights[i];
    if (r <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}

export interface GenerateResult {
  card1: Card;
  card2: Card;
  valid: boolean;
  score1: number;
  score2: number;
}

export function generateSession(recentlyUsed: string[] = []): GenerateResult | null {
  const eligiblePool = CARDS.filter((c) => totalScore(c) >= 8);
  if (eligiblePool.length < 2) return null;

  // Try up to 50 times to find a valid pair
  for (let attempt = 0; attempt < 50; attempt++) {
    const card1 = weightedPick(eligiblePool, recentlyUsed);
    if (!card1) continue;

    const candidatesForCard2 = eligiblePool.filter(
      (c) => c.id !== card1.id && c.category !== card1.category && !isBlacklisted(card1, c)
    );
    const card2 = weightedPick(candidatesForCard2, recentlyUsed);
    if (!card2) continue;

    return {
      card1,
      card2,
      valid: true,
      score1: totalScore(card1),
      score2: totalScore(card2),
    };
  }

  return null;
}

// ─── Curation Mode ───────────────────────────────────────────────────

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";
export type Flexibility = "low" | "medium" | "high";
export type BandSize = SuitableFor;

export interface CurationProfile {
  band_size: BandSize;
  genre: string;
  experience_level: ExperienceLevel;
  flexibility: Flexibility;
  risk_tolerance: RiskLevel;
}

export interface CurationPair {
  card1: Card;
  card2: Card;
  score1: number;
  score2: number;
  rank_score: number;
}

function riskAllowed(cardRisk: RiskLevel, tolerance: RiskLevel): boolean {
  const levels: RiskLevel[] = ["low", "medium", "high"];
  return levels.indexOf(cardRisk) <= levels.indexOf(tolerance);
}

function artisticRelevance(card: Card, profile: CurationProfile): number {
  let score = 0;

  // Experience level adjustments
  if (profile.experience_level === "advanced") {
    score += card.difficulty * 0.3;
  } else if (profile.experience_level === "intermediate") {
    score += Math.min(card.difficulty, 3) * 0.3;
  } else {
    // beginner: prefer lower difficulty
    score += (6 - card.difficulty) * 0.3;
  }

  // Flexibility adjustments
  if (profile.flexibility === "low") {
    // Prefer more structured constraints
    score += card.scores.structural_impact * 0.2;
  } else if (profile.flexibility === "high") {
    // Prefer cognitive and sonic
    score += card.scores.perceptual_change * 0.2;
  }

  return score;
}

function transformationPotential(card: Card): number {
  return totalScore(card) / 15.0;
}

function pairRankScore(
  card1: Card,
  card2: Card,
  profile: CurationProfile
): number {
  const ar1 = artisticRelevance(card1, profile);
  const ar2 = artisticRelevance(card2, profile);
  const tp1 = transformationPotential(card1);
  const tp2 = transformationPotential(card2);
  return (ar1 + ar2) / 2 + (tp1 + tp2) / 2;
}

export function curate(profile: CurationProfile): CurationPair[] {
  // Filter cards compatible with band_size, risk tolerance, and score >= 8
  const eligible = CARDS.filter(
    (c) =>
      c.suitable_for.includes(profile.band_size) &&
      riskAllowed(c.risk_level, profile.risk_tolerance) &&
      totalScore(c) >= 8
  );

  // Find all valid pairs
  const pairs: CurationPair[] = [];
  for (let i = 0; i < eligible.length; i++) {
    for (let j = i + 1; j < eligible.length; j++) {
      const c1 = eligible[i];
      const c2 = eligible[j];
      if (!isValidPair(c1, c2)) continue;
      pairs.push({
        card1: c1,
        card2: c2,
        score1: totalScore(c1),
        score2: totalScore(c2),
        rank_score: pairRankScore(c1, c2, profile),
      });
    }
  }

  // Sort by rank score descending and return top 3
  pairs.sort((a, b) => b.rank_score - a.rank_score);
  return pairs.slice(0, 3);
}
