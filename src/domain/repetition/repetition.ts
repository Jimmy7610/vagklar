import { REPETITION } from '@/domain/constants';
import type { Confidence, QuestionState } from '@/domain/learner/types';

/**
 * Spaced repetition.
 *
 * An SM-2 derived scheduler, adapted so that stated confidence — not just
 * correctness — drives the grade. A correct answer the learner marked as a
 * guess is scheduled far more aggressively than a confident one, because the
 * knowledge behind it is not yet stable.
 *
 * Everything here is deterministic: given the same state, grade and timestamp
 * it always produces the same schedule.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

export function createQuestionState(questionId: string, subcategory: string): QuestionState {
  return {
    questionId,
    subcategory,
    seenCount: 0,
    correctCount: 0,
    incorrectCount: 0,
    streak: 0,
    lastAnsweredAt: null,
    lastCorrect: null,
    lastConfidence: null,
    averageResponseMs: 0,
    ease: REPETITION.initialEase,
    intervalDays: 0,
    repetitions: 0,
    lapses: 0,
    dueAt: null,
    saved: false,
  };
}

/** Map an answer onto the 0–5 grade scale the scheduler expects. */
export function gradeFromAnswer(correct: boolean, confidence: Confidence | null): number {
  if (correct) {
    if (confidence === 'guessed') return 3;
    if (confidence === 'uncertain') return 4;
    return 5; // 'known' or not stated
  }
  // A confidently wrong answer is the strongest signal of a misconception.
  if (confidence === 'known') return 0;
  return 1;
}

export function isLapse(grade: number): boolean {
  return grade < REPETITION.passingGrade;
}

/** Update ease using the SM-2 response curve, clamped to sane bounds. */
export function nextEase(ease: number, grade: number): number {
  const delta = 0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02);
  const updated = ease + delta;
  return Math.min(REPETITION.maxEase, Math.max(REPETITION.minEase, updated));
}

export interface ScheduleResult {
  ease: number;
  intervalDays: number;
  repetitions: number;
  lapses: number;
  dueAt: number;
}

/** Compute the next review schedule for a question. */
export function scheduleNext(
  state: Pick<QuestionState, 'ease' | 'intervalDays' | 'repetitions' | 'lapses'>,
  grade: number,
  now: number,
): ScheduleResult {
  const ease = nextEase(state.ease, grade);

  if (isLapse(grade)) {
    return {
      ease,
      intervalDays: 0,
      repetitions: 0,
      lapses: state.lapses + 1,
      dueAt: now + REPETITION.lapseIntervalMinutes * 60 * 1000,
    };
  }

  const repetitions = state.repetitions + 1;
  let intervalDays: number;
  if (repetitions === 1) {
    intervalDays = REPETITION.firstIntervalDays;
  } else if (repetitions === 2) {
    intervalDays = REPETITION.secondIntervalDays;
  } else {
    const previous = state.intervalDays > 0 ? state.intervalDays : REPETITION.secondIntervalDays;
    intervalDays = Math.round(previous * ease);
  }
  intervalDays = Math.min(REPETITION.maxIntervalDays, Math.max(1, intervalDays));

  return {
    ease,
    intervalDays,
    repetitions,
    lapses: state.lapses,
    dueAt: now + intervalDays * DAY_MS,
  };
}

/** Fold an answer into a question's state, including the new schedule. */
export function applyAnswerToQuestionState(
  state: QuestionState,
  input: { correct: boolean; confidence: Confidence | null; responseMs: number; at: number },
): QuestionState {
  const grade = gradeFromAnswer(input.correct, input.confidence);
  const schedule = scheduleNext(state, grade, input.at);
  const seenCount = state.seenCount + 1;
  const averageResponseMs =
    state.seenCount === 0
      ? input.responseMs
      : Math.round((state.averageResponseMs * state.seenCount + input.responseMs) / seenCount);

  return {
    ...state,
    seenCount,
    correctCount: state.correctCount + (input.correct ? 1 : 0),
    incorrectCount: state.incorrectCount + (input.correct ? 0 : 1),
    streak: input.correct ? state.streak + 1 : 0,
    lastAnsweredAt: input.at,
    lastCorrect: input.correct,
    lastConfidence: input.confidence,
    averageResponseMs,
    ease: schedule.ease,
    intervalDays: schedule.intervalDays,
    repetitions: schedule.repetitions,
    lapses: schedule.lapses,
    dueAt: schedule.dueAt,
  };
}

export function isDue(state: QuestionState | undefined, now: number): boolean {
  if (!state || state.dueAt === null) return false;
  return state.dueAt <= now;
}

/** How overdue an item is, in days. Negative when it is not yet due. */
export function overdueDays(state: QuestionState, now: number): number {
  if (state.dueAt === null) return 0;
  return (now - state.dueAt) / DAY_MS;
}

/** Items due for review, most overdue first. Stable for equal overdue values. */
export function dueQuestionStates(
  states: Readonly<Record<string, QuestionState>>,
  now: number,
): QuestionState[] {
  const due = Object.values(states).filter((state) => isDue(state, now));
  due.sort(
    (a, b) => overdueDays(b, now) - overdueDays(a, now) || a.questionId.localeCompare(b.questionId),
  );
  return due;
}

/** Fraction of scheduled items that are currently overdue, in 0–1. */
export function overdueRatio(
  states: Readonly<Record<string, QuestionState>>,
  now: number,
): number {
  const scheduled = Object.values(states).filter((s) => s.dueAt !== null);
  if (scheduled.length === 0) return 0;
  const due = scheduled.filter((s) => s.dueAt !== null && s.dueAt <= now).length;
  return due / scheduled.length;
}
