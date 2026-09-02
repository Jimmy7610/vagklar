import { DAILY_TEN_MIX, MASTERY, REPETITION, SESSION } from '@/domain/constants';
import {
  COVERED_SUBCATEGORY_IDS,
  QUESTIONS,
  QUESTIONS_BY_CATEGORY,
  QUESTIONS_BY_SUBCATEGORY,
  getQuestion,
  siblingQuestions,
} from '@/domain/content/bank';
import { CATEGORIES, SUBCATEGORY_BY_ID } from '@/content/taxonomy';
import type { CategoryId, Difficulty, Question } from '@/domain/content/types';
import { rankWeakAreas } from '@/domain/mastery/mastery';
import { isDue, overdueDays } from '@/domain/repetition/repetition';
import { mulberry32, shuffleWith } from '@/content/questions/authoring';
import type { AnswerRecord, MasteryState, QuestionState } from '@/domain/learner/types';

/**
 * Question selection.
 *
 * Every session type is built from the same pipeline: gather candidate pools,
 * score them, then assemble under diversity constraints. Given the same
 * learner state and the same seed, selection is fully deterministic — which is
 * what makes "Dagens 10" stable across a day and makes the whole thing
 * testable.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

export interface SelectionContext {
  mastery: Readonly<Record<string, MasteryState>>;
  questionStates: Readonly<Record<string, QuestionState>>;
  answers: readonly AnswerRecord[];
  now: number;
  /** Deterministic tie-breaking and shuffling. */
  seed: number;
}

/* ------------------------------------------------------------------ */
/* Difficulty targeting                                                */
/* ------------------------------------------------------------------ */

/** The difficulty that best challenges a learner at a given mastery level. */
export function targetDifficulty(score: number): Difficulty {
  if (score < 0.45) return 1;
  if (score < MASTERY.thresholds.developing) return 2;
  return 3;
}

function difficultyFit(question: Question, score: number): number {
  const target = targetDifficulty(score);
  const distance = Math.abs(question.difficulty - target);
  return distance === 0 ? 1 : distance === 1 ? 0.6 : 0.25;
}

/* ------------------------------------------------------------------ */
/* Candidate pools                                                     */
/* ------------------------------------------------------------------ */

export type PoolKind = 'weak' | 'due' | 'mistake' | 'reinforcement' | 'unseen' | 'any';

export interface Candidate {
  question: Question;
  kind: PoolKind;
  priority: number;
}

function seenRecently(state: QuestionState | undefined, now: number, days: number): boolean {
  if (!state?.lastAnsweredAt) return false;
  return now - state.lastAnsweredAt < days * DAY_MS;
}

/**
 * Prefer a sibling question testing the same rule when the exact item was seen
 * very recently. Concept-level variation beats verbatim repetition.
 */
function preferSibling(question: Question, ctx: SelectionContext): Question {
  const state = ctx.questionStates[question.id];
  if (!seenRecently(state, ctx.now, REPETITION.siblingPreferenceDays)) return question;

  const siblings = siblingQuestions(question).filter(
    (candidate) => !seenRecently(ctx.questionStates[candidate.id], ctx.now, REPETITION.siblingPreferenceDays),
  );
  if (siblings.length === 0) return question;

  const random = mulberry32(ctx.seed ^ question.id.length);
  const picked = shuffleWith(siblings, random)[0];
  return picked ?? question;
}

/**
 * Questions from the learner's weakest subcategories.
 *
 * "Weak" means *demonstrably* weak: an area with no data is not weak, it is
 * unexplored, and it is `unseenPool` that covers it. Mixing the two would make
 * "Mina svaga områden" a list of everything the learner has not opened yet.
 * For a learner with no data at all we fall back to the full set so the pool
 * is never empty.
 */
export function weakPool(ctx: SelectionContext): Candidate[] {
  const ranked = rankWeakAreas(ctx.mastery, COVERED_SUBCATEGORY_IDS);
  const attempted = ranked.filter((area) => area.observations > 0);
  const areas = (attempted.length > 0 ? attempted : ranked).slice(0, 8);
  const candidates: Candidate[] = [];

  areas.forEach((area, rank) => {
    const questions = QUESTIONS_BY_SUBCATEGORY.get(area.subcategoryId) ?? [];
    for (const question of questions) {
      const state = ctx.questionStates[question.id];
      // Skip items answered correctly in the last day — they are not the gap.
      if (state?.lastCorrect === true && seenRecently(state, ctx.now, 1)) continue;
      const rankBonus = (areas.length - rank) / areas.length;
      const unseenBonus = state ? 0 : 0.2;
      candidates.push({
        question,
        kind: 'weak',
        priority: 1.4 * rankBonus + difficultyFit(question, area.score) * 0.5 + unseenBonus,
      });
    }
  });

  return candidates;
}

/** Questions whose spaced-repetition interval has elapsed. */
export function duePool(ctx: SelectionContext): Candidate[] {
  const candidates: Candidate[] = [];
  for (const state of Object.values(ctx.questionStates)) {
    if (!isDue(state, ctx.now)) continue;
    const question = getQuestion(state.questionId);
    if (!question) continue;
    const overdue = Math.min(30, overdueDays(state, ctx.now));
    candidates.push({
      question,
      kind: 'due',
      priority: 1.2 + Math.min(0.8, overdue / 14) + state.lapses * 0.1,
    });
  }
  return candidates;
}

/** Recently missed questions — or a sibling testing the same rule. */
export function mistakePool(ctx: SelectionContext): Candidate[] {
  const recent = ctx.answers.filter((a) => !a.correct).slice(-30).reverse();
  const seen = new Set<string>();
  const candidates: Candidate[] = [];

  recent.forEach((answer, index) => {
    if (seen.has(answer.questionId)) return;
    seen.add(answer.questionId);
    const original = getQuestion(answer.questionId);
    if (!original) return;
    // If the learner has since answered it correctly twice, it is not a
    // standing mistake any more.
    const state = ctx.questionStates[original.id];
    if (state && state.streak >= 2) return;

    const question = preferSibling(original, ctx);
    candidates.push({
      question,
      kind: 'mistake',
      priority: 1.3 + Math.max(0, (30 - index) / 30) * 0.5,
    });
  });

  return candidates;
}

/** Subcategories in the middle band, where practice consolidates fastest. */
export function reinforcementPool(ctx: SelectionContext): Candidate[] {
  const candidates: Candidate[] = [];
  for (const subcategoryId of COVERED_SUBCATEGORY_IDS) {
    const state = ctx.mastery[subcategoryId];
    if (!state || state.observations === 0) continue;
    if (state.score < MASTERY.thresholds.weak || state.score >= MASTERY.thresholds.strong) continue;

    for (const question of QUESTIONS_BY_SUBCATEGORY.get(subcategoryId) ?? []) {
      const qState = ctx.questionStates[question.id];
      if (seenRecently(qState, ctx.now, 1)) continue;
      candidates.push({
        question,
        kind: 'reinforcement',
        priority: 0.9 + difficultyFit(question, state.score) * 0.5,
      });
    }
  }
  return candidates;
}

/** Questions the learner has never answered. */
export function unseenPool(ctx: SelectionContext): Candidate[] {
  const candidates: Candidate[] = [];
  for (const question of QUESTIONS) {
    if (ctx.questionStates[question.id]) continue;
    const mastery = ctx.mastery[question.subcategory];
    candidates.push({
      question,
      kind: 'unseen',
      priority: 0.8 + difficultyFit(question, mastery?.score ?? 0) * 0.4,
    });
  }
  return candidates;
}

/* ------------------------------------------------------------------ */
/* Assembly                                                            */
/* ------------------------------------------------------------------ */

interface AssembleOptions {
  size: number;
  /** At most this many questions from any single subcategory. */
  maxPerSubcategory?: number;
  /** At most this many from any single top-level category. */
  maxPerCategory?: number;
  /**
   * Questions the session already holds.
   *
   * Without this the caps reset on every call, so a session assembled from
   * several pools can take the maximum from the same subject once per pool and
   * end up one-note anyway.
   */
  taken?: readonly Question[];
  seed: number;
}

/**
 * Pick `size` questions from scored candidates, highest priority first, with a
 * per-subcategory cap so a session never becomes one-note. The cap is relaxed
 * automatically if it would otherwise leave the session short.
 */
export function assemble(candidates: Candidate[], options: AssembleOptions): Question[] {
  const random = mulberry32(options.seed);
  // Stable ordering: priority desc, then a deterministic jitter by id.
  const jitter = new Map<string, number>();
  for (const candidate of candidates) {
    if (!jitter.has(candidate.question.id)) jitter.set(candidate.question.id, random());
  }
  const sorted = candidates.slice().sort((a, b) => {
    const delta = b.priority - a.priority;
    if (Math.abs(delta) > 1e-9) return delta;
    return (jitter.get(a.question.id) ?? 0) - (jitter.get(b.question.id) ?? 0);
  });

  const cap = options.maxPerSubcategory ?? Math.max(2, Math.ceil(options.size / 3));
  const categoryCap = options.maxPerCategory ?? Number.POSITIVE_INFINITY;
  const chosen: Question[] = [];
  const used = new Set<string>();
  const perSubcategory = new Map<string, number>();
  const perCategory = new Map<string, number>();

  // Seed the counts with what the session already holds, so the caps describe
  // the finished session rather than this one call.
  for (const question of options.taken ?? []) {
    perSubcategory.set(question.subcategory, (perSubcategory.get(question.subcategory) ?? 0) + 1);
    perCategory.set(question.category, (perCategory.get(question.category) ?? 0) + 1);
  }

  for (const candidate of sorted) {
    if (chosen.length >= options.size) break;
    const { question } = candidate;
    if (used.has(question.id)) continue;
    if ((perSubcategory.get(question.subcategory) ?? 0) >= cap) continue;
    if ((perCategory.get(question.category) ?? 0) >= categoryCap) continue;
    used.add(question.id);
    perSubcategory.set(question.subcategory, (perSubcategory.get(question.subcategory) ?? 0) + 1);
    perCategory.set(question.category, (perCategory.get(question.category) ?? 0) + 1);
    chosen.push(question);
  }

  // Relax the diversity cap only if we could not fill the session.
  if (chosen.length < options.size) {
    for (const candidate of sorted) {
      if (chosen.length >= options.size) break;
      if (used.has(candidate.question.id)) continue;
      used.add(candidate.question.id);
      chosen.push(candidate.question);
    }
  }

  return chosen;
}

/* ------------------------------------------------------------------ */
/* Session builders                                                    */
/* ------------------------------------------------------------------ */

/** Stable seed for a given calendar day, so Dagens 10 does not shift. */
export function dailySeed(profileId: string, now: number): number {
  const date = new Date(now);
  const key = `${profileId}:${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  let hash = 0x811c9dc5;
  for (let i = 0; i < key.length; i += 1) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

interface MixSlot {
  pool: Candidate[];
  take: number;
}

/**
 * "Dagens 10" — a mixed session that is deliberately not all-weak-areas.
 * Targets are back-filled in priority order when a pool runs dry.
 */
/**
 * No more than this many of the ten from one top-level area.
 *
 * Without it a brand-new learner — who has no weak areas, no due repetitions
 * and no mistakes — gets a session drawn almost entirely from whichever area
 * happens to hold the most unseen questions. Four leaves room for a genuine
 * focus without letting one subject take the session.
 */
const DAILY_TEN_MAX_PER_CATEGORY = 4;

export function buildDailyTen(ctx: SelectionContext): Question[] {
  const slots: MixSlot[] = [
    { pool: weakPool(ctx), take: DAILY_TEN_MIX.weakConcepts },
    { pool: duePool(ctx), take: DAILY_TEN_MIX.dueRepetition },
    { pool: mistakePool(ctx), take: DAILY_TEN_MIX.recentMistakes },
    { pool: reinforcementPool(ctx), take: DAILY_TEN_MIX.reinforcement },
    { pool: unseenPool(ctx), take: DAILY_TEN_MIX.unseen },
  ];

  const chosen: Question[] = [];
  const used = new Set<string>();

  for (const slot of slots) {
    const picks = assemble(
      slot.pool.filter((c) => !used.has(c.question.id)),
      {
        size: slot.take,
        seed: ctx.seed,
        maxPerSubcategory: 2,
        maxPerCategory: DAILY_TEN_MAX_PER_CATEGORY,
        taken: chosen,
      },
    );
    for (const question of picks) {
      used.add(question.id);
      chosen.push(question);
    }
  }

  if (chosen.length < SESSION.dailyTenSize) {
    const fallback = [
      ...weakPool(ctx),
      ...unseenPool(ctx),
      ...reinforcementPool(ctx),
      ...QUESTIONS.map<Candidate>((question) => ({ question, kind: 'any', priority: 0.1 })),
    ].filter((c) => !used.has(c.question.id));

    for (const question of assemble(fallback, {
      size: SESSION.dailyTenSize - chosen.length,
      seed: ctx.seed + 1,
      maxPerSubcategory: 3,
      maxPerCategory: DAILY_TEN_MAX_PER_CATEGORY,
      taken: chosen,
    })) {
      used.add(question.id);
      chosen.push(question);
    }
  }

  // Present easier items first so a session opens with momentum.
  return chosen
    .slice(0, SESSION.dailyTenSize)
    .sort((a, b) => a.difficulty - b.difficulty || a.id.localeCompare(b.id));
}

export type QuickFilter =
  | { kind: 'all' }
  | { kind: 'category'; categoryId: CategoryId }
  | { kind: 'subcategory'; subcategoryId: string }
  | { kind: 'weak' }
  | { kind: 'mistakes' }
  | { kind: 'due' }
  | { kind: 'saved' };

export function buildQuickSession(
  ctx: SelectionContext,
  size: number,
  filter: QuickFilter,
): Question[] {
  let pool: Candidate[];

  switch (filter.kind) {
    case 'category': {
      const questions = QUESTIONS_BY_CATEGORY.get(filter.categoryId) ?? [];
      pool = questions.map((question) => ({
        question,
        kind: 'any' as const,
        priority:
          1 +
          difficultyFit(question, ctx.mastery[question.subcategory]?.score ?? 0) * 0.5 +
          (ctx.questionStates[question.id] ? 0 : 0.3),
      }));
      break;
    }
    case 'subcategory': {
      const questions = QUESTIONS_BY_SUBCATEGORY.get(filter.subcategoryId) ?? [];
      pool = questions.map((question) => ({
        question,
        kind: 'any' as const,
        priority:
          1 +
          difficultyFit(question, ctx.mastery[question.subcategory]?.score ?? 0) * 0.5 +
          (ctx.questionStates[question.id] ? 0 : 0.3),
      }));
      break;
    }
    case 'weak':
      pool = weakPool(ctx);
      break;
    case 'mistakes':
      pool = mistakePool(ctx);
      break;
    case 'due':
      pool = duePool(ctx);
      break;
    case 'saved': {
      const saved = Object.values(ctx.questionStates).filter((s) => s.saved);
      pool = saved.flatMap((state) => {
        const question = getQuestion(state.questionId);
        return question ? [{ question, kind: 'any' as const, priority: 1 }] : [];
      });
      break;
    }
    case 'all':
    default:
      pool = [
        ...weakPool(ctx),
        ...duePool(ctx),
        ...mistakePool(ctx),
        ...reinforcementPool(ctx),
        ...unseenPool(ctx),
        ...QUESTIONS.map<Candidate>((question) => ({ question, kind: 'any', priority: 0.2 })),
      ];
      break;
  }

  const maxPerSubcategory =
    filter.kind === 'subcategory' ? size : Math.max(2, Math.ceil(size / 2.5));

  return assemble(pool, { size, seed: ctx.seed, maxPerSubcategory });
}

/**
 * Optional diagnostic. Spreads questions across every category so the first
 * mastery estimates are broad rather than deep, favouring medium difficulty.
 */
export function buildLevelTest(seed: number): Question[] {
  const perCategory = Math.max(1, Math.floor(SESSION.levelTestSize / CATEGORIES.length));
  const chosen: Question[] = [];
  const random = mulberry32(seed);

  for (const category of CATEGORIES) {
    const questions = (QUESTIONS_BY_CATEGORY.get(category.id) ?? [])
      .slice()
      .sort((a, b) => Math.abs(a.difficulty - 2) - Math.abs(b.difficulty - 2));
    const pick = shuffleWith(questions.slice(0, Math.max(perCategory * 2, 4)), random).slice(
      0,
      perCategory,
    );
    chosen.push(...pick);
  }

  // Fill any remainder with medium-difficulty items not already chosen.
  const used = new Set(chosen.map((q) => q.id));
  if (chosen.length < SESSION.levelTestSize) {
    const extras = shuffleWith(
      QUESTIONS.filter((q) => !used.has(q.id) && q.difficulty === 2),
      random,
    ).slice(0, SESSION.levelTestSize - chosen.length);
    chosen.push(...extras);
  }

  return chosen.slice(0, SESSION.levelTestSize);
}

/* ------------------------------------------------------------------ */
/* Next best step                                                      */
/* ------------------------------------------------------------------ */

export type RecommendationKind = 'level-test' | 'weak-area' | 'due-review' | 'mistakes' | 'explore';

export interface Recommendation {
  kind: RecommendationKind;
  title: string;
  reason: string;
  subcategoryId: string | null;
  categoryId: CategoryId | null;
  questionIds: string[];
  estimatedMinutes: number;
}

function estimateMinutes(questions: readonly Question[]): number {
  const seconds = questions.reduce(
    (sum, q) => sum + (q.estimatedTimeSec || SESSION.estimatedSecondsPerQuestion),
    0,
  );
  return Math.max(1, Math.round(seconds / 60));
}

/**
 * "Nästa bästa steg" — the single answer to "what should I do now?".
 *
 * Priority order:
 *   1. nothing practised yet          → suggest a short broad start
 *   2. a meaningful review backlog    → clear it before adding new material
 *   3. a clear weak area with data    → target it
 *   4. standing mistakes              → replay the concept
 *   5. otherwise                      → broaden coverage
 */
export function nextBestStep(ctx: SelectionContext): Recommendation {
  const answered = ctx.answers.length;

  if (answered === 0) {
    const questions = buildLevelTest(ctx.seed).slice(0, 7);
    return {
      kind: 'level-test',
      title: 'Kom igång',
      reason: 'Vi behöver några svar för att kunna anpassa träningen.',
      subcategoryId: null,
      categoryId: null,
      questionIds: questions.map((q) => q.id),
      estimatedMinutes: estimateMinutes(questions),
    };
  }

  const due = duePool(ctx);
  if (due.length >= 5) {
    const questions = assemble(due, { size: 7, seed: ctx.seed, maxPerSubcategory: 3 });
    return {
      kind: 'due-review',
      title: 'Behöver repeteras',
      reason: `${due.length} frågor har legat och väntat. Repetition nu ger mest effekt.`,
      subcategoryId: null,
      categoryId: null,
      questionIds: questions.map((q) => q.id),
      estimatedMinutes: estimateMinutes(questions),
    };
  }

  const areas = rankWeakAreas(ctx.mastery, COVERED_SUBCATEGORY_IDS);
  const weakest = areas.find((area) => area.observations > 0 && area.score < MASTERY.thresholds.developing);

  if (weakest) {
    const meta = SUBCATEGORY_BY_ID.get(weakest.subcategoryId);
    const questions = buildQuickSession(ctx, 7, {
      kind: 'subcategory',
      subcategoryId: weakest.subcategoryId,
    });
    if (questions.length > 0) {
      return {
        kind: 'weak-area',
        title: meta?.name ?? weakest.subcategoryId,
        reason: weakest.reliable
          ? `Ditt svagaste område just nu — ${Math.round(weakest.score * 100)} % behärskning.`
          : 'Här har vi för lite data. Några frågor till ger en tydligare bild.',
        subcategoryId: weakest.subcategoryId,
        categoryId: meta?.categoryId ?? null,
        questionIds: questions.map((q) => q.id),
        estimatedMinutes: estimateMinutes(questions),
      };
    }
  }

  const mistakes = mistakePool(ctx);
  if (mistakes.length >= 3) {
    const questions = assemble(mistakes, { size: 7, seed: ctx.seed, maxPerSubcategory: 3 });
    return {
      kind: 'mistakes',
      title: 'Mina misstag',
      reason: 'Du har frågor som fortfarande sitter löst. Vi tar dem igen.',
      subcategoryId: null,
      categoryId: null,
      questionIds: questions.map((q) => q.id),
      estimatedMinutes: estimateMinutes(questions),
    };
  }

  const unseen = unseenPool(ctx);
  const questions = assemble(unseen.length > 0 ? unseen : reinforcementPool(ctx), {
    size: 7,
    seed: ctx.seed,
    maxPerSubcategory: 3,
  });
  const firstSubcategory = questions[0]?.subcategory ?? null;
  const meta = firstSubcategory ? SUBCATEGORY_BY_ID.get(firstSubcategory) : undefined;

  return {
    kind: 'explore',
    title: meta?.name ?? 'Bredda kunskapen',
    reason: 'Du ligger bra till. Nu breddar vi till områden du tränat mindre på.',
    subcategoryId: firstSubcategory,
    categoryId: meta?.categoryId ?? null,
    questionIds: questions.map((q) => q.id),
    estimatedMinutes: estimateMinutes(questions),
  };
}
