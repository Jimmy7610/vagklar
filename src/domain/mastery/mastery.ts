import { MASTERY, RESPONSE_TIME } from '@/domain/constants';
import type { CategoryId, Difficulty } from '@/domain/content/types';
import { QUESTIONS_BY_CATEGORY, subcategoryWeight } from '@/domain/content/bank';
import { SUBCATEGORY_BY_ID } from '@/content/taxonomy';
import type { Confidence, MasteryState } from '@/domain/learner/types';

/**
 * The mastery model.
 *
 * A mastery estimate is an exponentially weighted moving average of *answer
 * quality* — not an accuracy percentage. Quality folds in three things:
 *
 *   1. correctness              (dominant)
 *   2. stated confidence        (a correct guess is worth much less than a
 *                                confident correct answer; a confidently wrong
 *                                answer is the worst possible signal, because
 *                                it means a misconception rather than a gap)
 *   3. question difficulty      (being wrong on an easy item is worse than
 *                                being wrong on a hard one)
 *
 * Response time is applied last and only as a weak damping factor, never as a
 * reward for speed. See docs/KNOWLEDGE-ENGINE.md.
 */

export function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

export interface QualityInput {
  correct: boolean;
  confidence: Confidence | null;
  difficulty: Difficulty;
  responseMs: number;
  /** The question's own time estimate, in seconds. */
  estimatedTimeSec: number;
  /** When false the response-time term is skipped entirely. */
  useResponseTimeSignal: boolean;
}

/** Quality of a single answer, in 0–1. Pure and deterministic. */
export function answerQuality(input: QualityInput): number {
  const confidenceKey = input.confidence ?? 'none';
  const base = input.correct
    ? MASTERY.qualityCorrect[confidenceKey]
    : MASTERY.qualityIncorrect[confidenceKey];

  const difficultyGain = input.correct
    ? MASTERY.difficultyGainCorrect[input.difficulty]
    : MASTERY.difficultyGainIncorrect[input.difficulty];

  let quality = base * difficultyGain;

  if (input.correct && input.useResponseTimeSignal) {
    quality *= responseTimeMultiplier(input.responseMs, input.estimatedTimeSec);
  }

  return clamp01(quality);
}

/**
 * Weak supporting signal. An answer that arrives implausibly fast is slightly
 * damped (it may be recognition rather than reasoning); a very slow one is
 * damped almost imperceptibly. Slow answers are never punished meaningfully —
 * that would penalise learners who read carefully or use assistive technology.
 */
export function responseTimeMultiplier(responseMs: number, estimatedTimeSec: number): number {
  const estimateMs = Math.max(1, estimatedTimeSec) * 1000;
  if (responseMs <= 0) return 1;

  if (
    responseMs < estimateMs * RESPONSE_TIME.suspiciouslyFastFactor &&
    responseMs < RESPONSE_TIME.minimumConsideredMs * 4
  ) {
    return RESPONSE_TIME.suspiciouslyFastMultiplier;
  }
  if (responseMs > estimateMs * RESPONSE_TIME.slowFactor) {
    return RESPONSE_TIME.slowMultiplier;
  }
  return 1;
}

export function createMasteryState(subcategoryId: string, categoryId: CategoryId): MasteryState {
  return {
    subcategoryId,
    categoryId,
    score: MASTERY.initialScore,
    observations: 0,
    correct: 0,
    incorrect: 0,
    lastPracticedAt: null,
    previousScore: MASTERY.initialScore,
  };
}

/** Learning rate. High while the estimate is new, then settles at a floor. */
export function learningRate(observations: number): number {
  return Math.max(MASTERY.alphaFloor, MASTERY.alphaNumerator / Math.sqrt(observations + 1));
}

/** Apply one observation. Returns a new state; never mutates the input. */
export function applyObservation(
  state: MasteryState,
  quality: number,
  correct: boolean,
  at: number,
): MasteryState {
  const alpha = learningRate(state.observations);
  const score = clamp01(state.score + alpha * (clamp01(quality) - state.score));
  return {
    ...state,
    score,
    observations: state.observations + 1,
    correct: state.correct + (correct ? 1 : 0),
    incorrect: state.incorrect + (correct ? 0 : 1),
    lastPracticedAt: at,
  };
}

/**
 * How much we trust the estimate, in 0–1. Used to blend an unproven estimate
 * toward zero when computing readiness — five confident answers is a much
 * stronger claim than one.
 */
export function certainty(observations: number): number {
  return 1 - Math.exp(-observations / MASTERY.certaintyTau);
}

/** Mastery discounted by how much evidence supports it. */
export function effectiveMastery(state: MasteryState | undefined): number {
  if (!state) return 0;
  return state.score * certainty(state.observations);
}

export function isReliable(state: MasteryState | undefined): boolean {
  return (state?.observations ?? 0) >= MASTERY.reliableObservations;
}

export type MasteryLevel = 'untouched' | 'weak' | 'developing' | 'strong' | 'mastered';

export function masteryLevel(state: MasteryState | undefined): MasteryLevel {
  if (!state || state.observations === 0) return 'untouched';
  if (state.score < MASTERY.thresholds.weak) return 'weak';
  if (state.score < MASTERY.thresholds.developing) return 'developing';
  if (state.score < MASTERY.thresholds.strong) return 'strong';
  return 'mastered';
}

/** Swedish label for a mastery level. Never used as the *only* status signal. */
export const MASTERY_LEVEL_LABEL: Record<MasteryLevel, string> = {
  untouched: 'Ej påbörjad',
  weak: 'Svag',
  developing: 'På väg',
  strong: 'Stark',
  mastered: 'Behärskad',
};

export interface CategoryMastery {
  categoryId: CategoryId;
  /** Weighted mean over every subcategory that has questions. */
  score: number;
  /** Subcategories with at least one observation. */
  startedSubcategories: number;
  /** Subcategories that have questions at all. */
  totalSubcategories: number;
  observations: number;
}

/**
 * Category mastery counts covered-but-unattempted subcategories as zero.
 * That is deliberate: "you have not learned this yet" is the honest reading,
 * and it prevents a category from showing 90% after a single subcategory.
 */
export function categoryMastery(
  mastery: Readonly<Record<string, MasteryState>>,
  categoryId: CategoryId,
): CategoryMastery {
  const questions = QUESTIONS_BY_CATEGORY.get(categoryId) ?? [];
  const covered = Array.from(new Set(questions.map((q) => q.subcategory)));

  let weightSum = 0;
  let weighted = 0;
  let started = 0;
  let observations = 0;

  for (const subcategoryId of covered) {
    const weight = subcategoryWeight(subcategoryId);
    const state = mastery[subcategoryId];
    weightSum += weight;
    weighted += weight * (state?.score ?? 0);
    if (state && state.observations > 0) {
      started += 1;
      observations += state.observations;
    }
  }

  return {
    categoryId,
    score: weightSum > 0 ? weighted / weightSum : 0,
    startedSubcategories: started,
    totalSubcategories: covered.length,
    observations,
  };
}

/** Subcategories sorted from weakest to strongest, restricted to covered ones. */
export interface WeakArea {
  subcategoryId: string;
  categoryId: CategoryId;
  score: number;
  effective: number;
  observations: number;
  reliable: boolean;
}

export function rankWeakAreas(
  mastery: Readonly<Record<string, MasteryState>>,
  coveredSubcategoryIds: readonly string[],
): WeakArea[] {
  const areas: WeakArea[] = [];
  for (const subcategoryId of coveredSubcategoryIds) {
    const meta = SUBCATEGORY_BY_ID.get(subcategoryId);
    if (!meta) continue;
    const state = mastery[subcategoryId];
    areas.push({
      subcategoryId,
      categoryId: meta.categoryId,
      score: state?.score ?? 0,
      effective: effectiveMastery(state),
      observations: state?.observations ?? 0,
      reliable: isReliable(state),
    });
  }
  // Weakest first. Ties are broken by subcategory id so ordering is stable.
  areas.sort((a, b) => a.effective - b.effective || a.subcategoryId.localeCompare(b.subcategoryId));
  return areas;
}
