import { Card, CardRole, CARDS, RiskLevel, totalScore } from "./cards";
// PrepLevel and TechImpact are referenced via card.prepTime / card.techImpact (typed on Card)

// ─── Incompatibility ─────────────────────────────────────────────────────────

export function isIncompatible(a: Card, b: Card): boolean {
  return a.incompatibilities.includes(b.id) || b.incompatibilities.includes(a.id);
}

// ─── Tension ─────────────────────────────────────────────────────────────────

function variance(values: number[]): number {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  return values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / values.length;
}

// Tension = variance of disorientation scores + sum of risks.
// Higher variance = more complementary friction; higher risk = more stakes.
export function computeTension(cards: Card[]): number {
  return (
    variance(cards.map((c) => c.difficulty.disorientation)) +
    cards.reduce((sum, c) => sum + c.risk, 0)
  );
}

const MIN_TENSION = 5;
const RISK_THRESHOLD = 5; // combined risk above this requires a STABILIZER in the combo

// ─── Pair Validation ─────────────────────────────────────────────────────────

export function isValidPair(a: Card, b: Card): boolean {
  if (a.id === b.id) return false;
  // Different natures — crossing boundaries is the point
  if (a.nature === b.nature) return false;
  // Card-level incompatibilities
  if (isIncompatible(a, b)) return false;
  // Minimum score threshold (exempts STABILIZER by design)
  if (a.role !== "STABILIZER" && totalScore(a) < 8) return false;
  if (b.role !== "STABILIZER" && totalScore(b) < 8) return false;
  // Role composition rules
  // — max 1 DESTRUCTIVE
  if (a.role === "DESTRUCTIVE" && b.role === "DESTRUCTIVE") return false;
  // — at least 1 TRANSFORMATIVE (unless one card is a STABILIZER, which anchors any combo)
  const hasTransformative = a.role === "TRANSFORMATIVE" || b.role === "TRANSFORMATIVE";
  const hasStabilizer = a.role === "STABILIZER" || b.role === "STABILIZER";
  if (!hasTransformative && !hasStabilizer) return false;
  // — high combined risk requires an anchor
  if (a.risk + b.risk > RISK_THRESHOLD && !hasStabilizer) return false;
  // Minimum tension — forces friction, rejects two safe same-energy cards
  if (computeTension([a, b]) < MIN_TENSION) return false;
  return true;
}

// ─── Weighted Generation ─────────────────────────────────────────────────────

export interface Context {
  recent: string[];
  currentSelection: Card[];
  targetRisk: RiskLevel;
}

function difficultyFactor(card: Card): number {
  // Weight by disorientation — the dimension most relevant to artistic impact
  return 1.0 + (card.difficulty.disorientation - 1) * 0.125;
}

function freshnessFactor(cardId: string, recent: string[]): number {
  return recent.includes(cardId) ? 0.3 : 1.0;
}

function typeBalanceFactor(card: Card, currentSelection: Card[]): number {
  if (currentSelection.length === 0) return 1.0;
  const roles = currentSelection.map((c) => c.role);
  // Strongly boost STABILIZER after high-risk selections
  const totalCurrentRisk = currentSelection.reduce((s, c) => s + c.risk, 0);
  if (totalCurrentRisk >= 3 && card.role === "STABILIZER") return 2.5;
  // Discourage double-DESTRUCTIVE (also caught by isValidPair, but pre-filter is cheaper)
  if (roles.includes("DESTRUCTIVE") && card.role === "DESTRUCTIVE") return 0.05;
  // Moderate discourage of same role
  const sameRoleCount = roles.filter((r) => r === card.role).length;
  if (sameRoleCount >= 1) return 0.6;
  return 1.0;
}

function riskFactor(cardRisk: RiskLevel, targetRisk: RiskLevel): number {
  const diff = Math.abs(cardRisk - targetRisk);
  return ([1.0, 0.7, 0.4] as const)[diff];
}

function synergyFactor(card: Card, currentSelection: Card[]): number {
  if (currentSelection.length === 0) return 1.0;
  const hasSynergy = currentSelection.some(
    (c) => c.synergies.includes(card.id) || card.synergies.includes(c.id)
  );
  return hasSynergy ? 1.3 : 1.0;
}

function computeWeight(card: Card, context: Context): number {
  return (
    1.0 *
    difficultyFactor(card) *
    freshnessFactor(card.id, context.recent) *
    typeBalanceFactor(card, context.currentSelection) *
    riskFactor(card.risk, context.targetRisk) *
    synergyFactor(card, context.currentSelection)
  );
}

function weightedPick(pool: Card[], context: Context): Card | null {
  if (pool.length === 0) return null;
  const weights = pool.map((c) => computeWeight(c, context));
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < pool.length; i++) {
    r -= weights[i];
    if (r <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}

// ─── Public API ──────────────────────────────────────────────────────────────

export interface GenerateResult {
  card1: Card;
  card2: Card;
  valid: boolean;
  score1: number;
  score2: number;
  tension: number;
}

export function generateSession(
  recentlyUsed: string[] = [],
  targetRisk: RiskLevel = 2
): GenerateResult | null {
  // Eligible pool: scored cards + all STABILIZER cards
  const eligiblePool = CARDS.filter(
    (c) => c.role === "STABILIZER" || totalScore(c) >= 8
  );
  if (eligiblePool.length < 2) return null;

  const contextA: Context = {
    recent: recentlyUsed,
    currentSelection: [],
    targetRisk,
  };

  for (let attempt = 0; attempt < 80; attempt++) {
    const card1 = weightedPick(eligiblePool, contextA);
    if (!card1) continue;

    const contextB: Context = {
      recent: recentlyUsed,
      currentSelection: [card1],
      targetRisk,
    };
    const candidatesForCard2 = eligiblePool.filter((c) => isValidPair(card1, c));
    const card2 = weightedPick(candidatesForCard2, contextB);
    if (!card2) continue;

    return {
      card1,
      card2,
      valid: true,
      score1: totalScore(card1),
      score2: totalScore(card2),
      tension: computeTension([card1, card2]),
    };
  }

  return null;
}

export function generateThirdCard(
  card1: Card,
  card2: Card,
  recentlyUsed: string[] = [],
  targetRisk: RiskLevel = 2
): Card | null {
  const combinedRisk = card1.risk + card2.risk;
  // High combined risk: third card must be a STABILIZER
  const requiresStabilizer = combinedRisk > RISK_THRESHOLD;

  const context: Context = {
    recent: recentlyUsed,
    currentSelection: [card1, card2],
    targetRisk,
  };

  const pool = CARDS.filter((c) => {
    if (c.id === card1.id || c.id === card2.id) return false;
    if (c.nature === card1.nature || c.nature === card2.nature) return false;
    if (isIncompatible(c, card1) || isIncompatible(c, card2)) return false;
    if (c.role !== "STABILIZER" && totalScore(c) < 8) return false;
    if (requiresStabilizer && c.role !== "STABILIZER") return false;
    return true;
  });

  return weightedPick(pool, context);
}

// ─── Session Phases ──────────────────────────────────────────────────────────

export type SessionPhase = "IDLE" | "REVEAL" | "PREPARATION" | "LOCK" | "PLAYING";

export interface StoredSession {
  card1: Card;
  card2: Card;
  card3?: Card;
  prepTime: number;
  phase: SessionPhase;
  phaseEndTime: number | null;
  phaseDuration: number | null;
}

export function computePreparationTime(cards: Card[]): number {
  let time = 8;
  for (const card of cards) {
    if (card.prepTime === "HIGH") time += 2;
    if (card.techImpact === "HIGH") time += 2;
  }
  if (computeTension(cards) >= 7) time += 1;
  return Math.min(time, 15);
}

// ─── Curation Mode ───────────────────────────────────────────────────────────

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";
export type Flexibility = "low" | "medium" | "high";

export interface CurationProfile {
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
  tension: number;
  rank_score: number;
}

function artisticRelevance(card: Card, profile: CurationProfile): number {
  let score = 0;

  if (profile.experience_level === "advanced") {
    score += card.difficulty.disorientation * 0.3;
    score += card.difficulty.performance * 0.2;
  } else if (profile.experience_level === "intermediate") {
    score += Math.min(card.difficulty.disorientation, 3) * 0.3;
  } else {
    // beginner: prefer structural simplicity
    score += (6 - card.difficulty.structural) * 0.2;
    score += (6 - card.difficulty.performance) * 0.1;
  }

  if (profile.flexibility === "low") {
    score += card.difficulty.structural * 0.2;
  } else if (profile.flexibility === "high") {
    score += card.difficulty.disorientation * 0.2;
  }

  return score;
}

function transformationPotential(card: Card): number {
  return totalScore(card) / 15.0;
}

function pairRankScore(card1: Card, card2: Card, profile: CurationProfile): number {
  const ar1 = artisticRelevance(card1, profile);
  const ar2 = artisticRelevance(card2, profile);
  const tp1 = transformationPotential(card1);
  const tp2 = transformationPotential(card2);
  const tensionBonus = computeTension([card1, card2]) / 10;
  return (ar1 + ar2) / 2 + (tp1 + tp2) / 2 + tensionBonus;
}

export function curate(profile: CurationProfile): CurationPair[] {
  // Filter cards by risk tolerance and minimum score
  const eligible = CARDS.filter(
    (c) =>
      c.risk <= profile.risk_tolerance &&
      (c.role === "STABILIZER" || totalScore(c) >= 8)
  );

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
        tension: computeTension([c1, c2]),
        rank_score: pairRankScore(c1, c2, profile),
      });
    }
  }

  pairs.sort((a, b) => b.rank_score - a.rank_score);
  return pairs.slice(0, 3);
}
