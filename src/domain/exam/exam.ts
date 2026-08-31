import { EXAM } from '@/domain/constants';
import { CATEGORIES } from '@/content/taxonomy';
import { QUESTIONS, QUESTIONS_BY_CATEGORY, getQuestion } from '@/domain/content/bank';
import type { CategoryId, Question } from '@/domain/content/types';
import { mulberry32, shuffleWith } from '@/content/questions/authoring';
import type {
  ExamAttempt,
  ExamCategoryBreakdown,
  ExamQuestionState,
  ExamResult,
} from '@/domain/learner/types';

/**
 * The simulated theory exam.
 *
 * Structure mirrors the Swedish B knowledge test — 70 questions, 50 minutes,
 * five items that do not count, 52 of 65 required to pass — but every question
 * is Vägklar's own. We make no claim about which items are unscored in the
 * real test; in our simulation the five are drawn deterministically from the
 * attempt seed and are revealed only after submission.
 */

/**
 * Distribute `total` questions across categories in proportion to their exam
 * weight, using the largest-remainder method and respecting how many questions
 * each category actually has.
 */
export function categoryQuota(total: number): Map<CategoryId, number> {
  const available = new Map<CategoryId, number>();
  for (const category of CATEGORIES) {
    available.set(category.id, (QUESTIONS_BY_CATEGORY.get(category.id) ?? []).length);
  }

  const weighted = CATEGORIES.filter((c) => (available.get(c.id) ?? 0) > 0);
  const weightSum = weighted.reduce((sum, c) => sum + c.examWeight, 0);
  if (weightSum === 0) return new Map();

  const exact = weighted.map((category) => ({
    id: category.id,
    ideal: (total * category.examWeight) / weightSum,
  }));

  const quota = new Map<CategoryId, number>();
  let assigned = 0;
  for (const entry of exact) {
    const floor = Math.min(Math.floor(entry.ideal), available.get(entry.id) ?? 0);
    quota.set(entry.id, floor);
    assigned += floor;
  }

  // Largest remainder first, skipping categories that have run out of questions.
  const remainders = exact
    .map((entry) => ({ id: entry.id, remainder: entry.ideal - Math.floor(entry.ideal) }))
    .sort((a, b) => b.remainder - a.remainder || a.id.localeCompare(b.id));

  let index = 0;
  let guard = 0;
  while (assigned < total && guard < total * 8) {
    guard += 1;
    const entry = remainders[index % remainders.length];
    index += 1;
    if (!entry) break;
    const current = quota.get(entry.id) ?? 0;
    if (current >= (available.get(entry.id) ?? 0)) continue;
    quota.set(entry.id, current + 1);
    assigned += 1;
  }

  return quota;
}

/** Build the question set for one attempt. Deterministic for a given seed. */
export function buildExamQuestions(seed: number, total = EXAM.totalQuestions): Question[] {
  const quota = categoryQuota(total);
  const random = mulberry32(seed);
  const chosen: Question[] = [];

  for (const category of CATEGORIES) {
    const take = quota.get(category.id) ?? 0;
    if (take === 0) continue;
    const pool = (QUESTIONS_BY_CATEGORY.get(category.id) ?? []).slice();
    // Bias toward a realistic difficulty spread rather than all-easy.
    const shuffled = shuffleWith(pool, random);
    chosen.push(...shuffled.slice(0, take));
  }

  // Backfill if the taxonomy could not supply enough (small content library).
  if (chosen.length < total) {
    const used = new Set(chosen.map((q) => q.id));
    const extras = shuffleWith(
      QUESTIONS.filter((q) => !used.has(q.id)),
      random,
    ).slice(0, total - chosen.length);
    chosen.push(...extras);
  }

  return shuffleWith(chosen.slice(0, total), random);
}

/** Indices of the questions that will not count toward the score. */
export function pickUnscoredIndices(
  seed: number,
  total: number,
  count = EXAM.unscoredQuestions,
): Set<number> {
  const random = mulberry32(seed ^ 0x5f3759df);
  const indices = shuffleWith(
    Array.from({ length: total }, (_, i) => i),
    random,
  );
  return new Set(indices.slice(0, Math.min(count, total)));
}

export function createExamAttempt(seed: number, now: number, id: string): ExamAttempt {
  const questions = buildExamQuestions(seed);
  const unscored = pickUnscoredIndices(seed, questions.length);

  const questionStates: ExamQuestionState[] = questions.map((question, index) => ({
    questionId: question.id,
    selectedAnswerId: null,
    marked: false,
    answeredAt: null,
    responseMs: null,
    scored: !unscored.has(index),
  }));

  return {
    id,
    status: 'in-progress',
    seed,
    startedAt: now,
    deadlineAt: now + EXAM.durationMs,
    updatedAt: now,
    submittedAt: null,
    currentIndex: 0,
    questions: questionStates,
    result: null,
  };
}

export function remainingMs(attempt: ExamAttempt, now: number): number {
  return Math.max(0, attempt.deadlineAt - now);
}

export function isExpired(attempt: ExamAttempt, now: number): boolean {
  return attempt.status === 'in-progress' && now >= attempt.deadlineAt;
}

export function answeredCount(attempt: ExamAttempt): number {
  return attempt.questions.filter((q) => q.selectedAnswerId !== null).length;
}

export function markedCount(attempt: ExamAttempt): number {
  return attempt.questions.filter((q) => q.marked).length;
}

export function unansweredIndices(attempt: ExamAttempt): number[] {
  const result: number[] = [];
  attempt.questions.forEach((question, index) => {
    if (question.selectedAnswerId === null) result.push(index);
  });
  return result;
}

/** Record an answer. Returns a new attempt; never mutates the input. */
export function answerExamQuestion(
  attempt: ExamAttempt,
  index: number,
  answerId: string,
  now: number,
  responseMs: number,
): ExamAttempt {
  const existing = attempt.questions[index];
  if (!existing) return attempt;
  const questions = attempt.questions.slice();
  questions[index] = {
    ...existing,
    selectedAnswerId: answerId,
    answeredAt: now,
    responseMs: existing.responseMs ?? responseMs,
  };
  return { ...attempt, questions, updatedAt: now };
}

export function toggleExamMark(attempt: ExamAttempt, index: number, now: number): ExamAttempt {
  const existing = attempt.questions[index];
  if (!existing) return attempt;
  const questions = attempt.questions.slice();
  questions[index] = { ...existing, marked: !existing.marked };
  return { ...attempt, questions, updatedAt: now };
}

export function goToExamQuestion(attempt: ExamAttempt, index: number, now: number): ExamAttempt {
  const clamped = Math.max(0, Math.min(attempt.questions.length - 1, index));
  return { ...attempt, currentIndex: clamped, updatedAt: now };
}

/** Score the attempt. Only questions flagged `scored` count. */
export function scoreExam(attempt: ExamAttempt): ExamResult {
  let score = 0;
  let correctIncludingUnscored = 0;
  let answered = 0;
  const byCategory = new Map<CategoryId, ExamCategoryBreakdown>();
  const unscoredQuestionIds: string[] = [];

  for (const state of attempt.questions) {
    const question = getQuestion(state.questionId);
    if (!question) continue;

    if (!state.scored) unscoredQuestionIds.push(state.questionId);
    if (state.selectedAnswerId !== null) answered += 1;

    const correct = state.selectedAnswerId === question.correctAnswerId;
    if (correct) correctIncludingUnscored += 1;
    if (state.scored && correct) score += 1;

    // The category breakdown reflects scored questions only, so the numbers
    // always add up to the reported result.
    if (!state.scored) continue;
    const entry = byCategory.get(question.category) ?? {
      categoryId: question.category,
      total: 0,
      correct: 0,
    };
    entry.total += 1;
    if (correct) entry.correct += 1;
    byCategory.set(question.category, entry);
  }

  const scoredQuestions = attempt.questions.filter((q) => q.scored).length;
  const finishedAt = attempt.submittedAt ?? attempt.updatedAt;

  return {
    passed: score >= EXAM.passThreshold,
    score,
    scoredQuestions,
    passThreshold: EXAM.passThreshold,
    answered,
    unanswered: attempt.questions.length - answered,
    correctIncludingUnscored,
    durationMs: Math.max(0, finishedAt - attempt.startedAt),
    byCategory: CATEGORIES.flatMap((category) => {
      const entry = byCategory.get(category.id);
      return entry ? [entry] : [];
    }),
    unscoredQuestionIds,
  };
}

/** Finalise an attempt, either because the learner submitted or time ran out. */
export function submitExam(
  attempt: ExamAttempt,
  now: number,
  reason: 'submitted' | 'expired' = 'submitted',
): ExamAttempt {
  const submittedAt = reason === 'expired' ? Math.min(now, attempt.deadlineAt) : now;
  const finalised: ExamAttempt = {
    ...attempt,
    status: reason,
    submittedAt,
    updatedAt: now,
  };
  return { ...finalised, result: scoreExam(finalised) };
}
