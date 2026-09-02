import { REPETITION } from '@/domain/constants';
import { SUBCATEGORY_BY_ID } from '@/content/taxonomy';
import { QUESTION_INDEX_BY_ID } from '@/content/question-index';
import { DEFAULT_PREFERENCES, createOnboardingState, createProfile, createStreakState } from './defaults';
import type {
  AchievementUnlock,
  AnswerRecord,
  ExamAttempt,
  LearnerProfile,
  LessonProgress,
  MasteryState,
  Preferences,
  PracticeSession,
  QuestionState,
  ReadinessSnapshot,
  SessionSummary,
} from '@/domain/learner/types';

/**
 * Defensive readers for persisted data.
 *
 * Persisted records are untrusted input: they may come from an older build, a
 * partially written transaction, or an imported backup file. Every reader
 * returns either a well-formed value or `null`, and callers drop the nulls.
 * Nothing here throws.
 */

type Raw = Record<string, unknown>;

export function isRecord(value: unknown): value is Raw {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function str(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function num(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function bool(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function nullableNum(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function oneOf<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback;
}

function nullableOneOf<T extends string>(value: unknown, allowed: readonly T[]): T | null {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : null;
}

const CONFIDENCE = ['known', 'uncertain', 'guessed'] as const;
const MODES = [
  'training',
  'daily-ten',
  'quick',
  'review',
  'mistakes',
  'level-test',
  'lesson-check',
  'exam',
] as const;
const EXAM_STATUS = ['in-progress', 'submitted', 'expired', 'abandoned'] as const;

/* ------------------------------------------------------------------ */

export function readAnswer(raw: unknown): AnswerRecord | null {
  if (!isRecord(raw)) return null;
  const questionId = str(raw.questionId);
  const question = QUESTION_INDEX_BY_ID.get(questionId);
  // An answer to a question that no longer exists is kept for the totals but
  // cannot be trusted for per-question reasoning, so we drop it entirely.
  if (!question) return null;

  const id = str(raw.id);
  if (!id) return null;

  const record: AnswerRecord = {
    id,
    questionId,
    category: question.category,
    subcategory: question.subcategory,
    difficulty: question.difficulty,
    ruleTested: question.ruleTested,
    selectedAnswerId: str(raw.selectedAnswerId),
    correct: bool(raw.correct),
    confidence: nullableOneOf(raw.confidence, CONFIDENCE),
    responseMs: Math.max(0, num(raw.responseMs)),
    answeredAt: num(raw.answeredAt),
    mode: oneOf(raw.mode, MODES, 'training'),
  };
  if (record.answeredAt <= 0) return null;

  const misconceptionId = str(raw.misconceptionId);
  if (misconceptionId) record.misconceptionId = misconceptionId;
  const attemptId = str(raw.attemptId);
  if (attemptId) record.attemptId = attemptId;

  return record;
}

export function readQuestionState(raw: unknown): QuestionState | null {
  if (!isRecord(raw)) return null;
  const questionId = str(raw.questionId);
  const question = QUESTION_INDEX_BY_ID.get(questionId);
  if (!question) return null;

  return {
    questionId,
    subcategory: question.subcategory,
    seenCount: Math.max(0, num(raw.seenCount)),
    correctCount: Math.max(0, num(raw.correctCount)),
    incorrectCount: Math.max(0, num(raw.incorrectCount)),
    streak: Math.max(0, num(raw.streak)),
    lastAnsweredAt: nullableNum(raw.lastAnsweredAt),
    lastCorrect: typeof raw.lastCorrect === 'boolean' ? raw.lastCorrect : null,
    lastConfidence: nullableOneOf(raw.lastConfidence, CONFIDENCE),
    averageResponseMs: Math.max(0, num(raw.averageResponseMs)),
    ease: Math.min(
      REPETITION.maxEase,
      Math.max(REPETITION.minEase, num(raw.ease, REPETITION.initialEase)),
    ),
    intervalDays: Math.max(0, Math.min(REPETITION.maxIntervalDays, num(raw.intervalDays))),
    repetitions: Math.max(0, num(raw.repetitions)),
    lapses: Math.max(0, num(raw.lapses)),
    dueAt: nullableNum(raw.dueAt),
    saved: bool(raw.saved),
  };
}

export function readMasteryState(raw: unknown): MasteryState | null {
  if (!isRecord(raw)) return null;
  const subcategoryId = str(raw.subcategoryId);
  const meta = SUBCATEGORY_BY_ID.get(subcategoryId);
  if (!meta) return null;

  const score = Math.min(1, Math.max(0, num(raw.score)));
  return {
    subcategoryId,
    categoryId: meta.categoryId,
    score,
    observations: Math.max(0, num(raw.observations)),
    correct: Math.max(0, num(raw.correct)),
    incorrect: Math.max(0, num(raw.incorrect)),
    lastPracticedAt: nullableNum(raw.lastPracticedAt),
    previousScore: Math.min(1, Math.max(0, num(raw.previousScore, score))),
  };
}

export function readProfile(raw: unknown, now: number): LearnerProfile {
  const fallback = createProfile(now);
  if (!isRecord(raw)) return fallback;

  const onboardingRaw = isRecord(raw.onboarding) ? raw.onboarding : {};
  const streakRaw = isRecord(raw.streak) ? raw.streak : {};
  const totalsRaw = isRecord(raw.totals) ? raw.totals : {};

  return {
    id: str(raw.id) || fallback.id,
    createdAt: num(raw.createdAt, fallback.createdAt),
    lastActiveAt: num(raw.lastActiveAt, fallback.lastActiveAt),
    onboarding: {
      ...createOnboardingState(),
      completed: bool(onboardingRaw.completed),
      step: Math.max(0, num(onboardingRaw.step)),
      path: nullableOneOf(onboardingRaw.path, ['basics', 'level-test'] as const),
      levelTestCompleted: bool(onboardingRaw.levelTestCompleted),
      completedAt: nullableNum(onboardingRaw.completedAt),
    },
    streak: {
      ...createStreakState(),
      current: Math.max(0, num(streakRaw.current)),
      longest: Math.max(0, num(streakRaw.longest)),
      lastActiveDate: typeof streakRaw.lastActiveDate === 'string' ? streakRaw.lastActiveDate : null,
      questionsToday: Math.max(0, num(streakRaw.questionsToday)),
      todayDate: typeof streakRaw.todayDate === 'string' ? streakRaw.todayDate : null,
    },
    totals: {
      answered: Math.max(0, num(totalsRaw.answered)),
      correct: Math.max(0, num(totalsRaw.correct)),
      sessionsCompleted: Math.max(0, num(totalsRaw.sessionsCompleted)),
      examAttempts: Math.max(0, num(totalsRaw.examAttempts)),
      examsPassed: Math.max(0, num(totalsRaw.examsPassed)),
    },
  };
}

export function readPreferences(raw: unknown): Preferences {
  if (!isRecord(raw)) return { ...DEFAULT_PREFERENCES };
  const textScale = num(raw.textScale, 1);
  return {
    theme: oneOf(raw.theme, ['light', 'dark', 'system'] as const, DEFAULT_PREFERENCES.theme),
    motion: oneOf(raw.motion, ['system', 'reduced', 'full'] as const, DEFAULT_PREFERENCES.motion),
    textScale: textScale === 1.125 || textScale === 1.25 ? textScale : 1,
    confidencePrompt: oneOf(
      raw.confidencePrompt,
      ['always', 'smart', 'never'] as const,
      DEFAULT_PREFERENCES.confidencePrompt,
    ),
    sound: bool(raw.sound, DEFAULT_PREFERENCES.sound),
    haptics: bool(raw.haptics, DEFAULT_PREFERENCES.haptics),
    useResponseTimeSignal: bool(
      raw.useResponseTimeSignal,
      DEFAULT_PREFERENCES.useResponseTimeSignal,
    ),
    calmExamTimer: bool(raw.calmExamTimer, DEFAULT_PREFERENCES.calmExamTimer),
  };
}

export function readPracticeSession(raw: unknown): PracticeSession | null {
  if (!isRecord(raw)) return null;
  const id = str(raw.id);
  if (!id) return null;

  const rawQuestions = Array.isArray(raw.questions) ? raw.questions : [];
  const questions = rawQuestions.flatMap((item) => {
    if (!isRecord(item)) return [];
    const questionId = str(item.questionId);
    if (!QUESTION_INDEX_BY_ID.has(questionId)) return [];
    return [
      {
        questionId,
        selectedAnswerId: typeof item.selectedAnswerId === 'string' ? item.selectedAnswerId : null,
        confidence: nullableOneOf(item.confidence, CONFIDENCE),
        correct: typeof item.correct === 'boolean' ? item.correct : null,
        responseMs: nullableNum(item.responseMs),
        answeredAt: nullableNum(item.answeredAt),
      },
    ];
  });

  // A session whose questions have all disappeared is not resumable.
  if (questions.length === 0) return null;

  const masteryBefore: Record<string, number> = {};
  if (isRecord(raw.masteryBefore)) {
    for (const [key, value] of Object.entries(raw.masteryBefore)) {
      if (typeof value === 'number' && Number.isFinite(value)) masteryBefore[key] = value;
    }
  }

  return {
    id,
    mode: oneOf(raw.mode, MODES, 'training'),
    categoryId: typeof raw.categoryId === 'string' ? (raw.categoryId as never) : null,
    label: str(raw.label, 'Träningspass'),
    questionIds: questions.map((q) => q.questionId),
    questions,
    currentIndex: Math.min(Math.max(0, num(raw.currentIndex)), questions.length - 1),
    startedAt: num(raw.startedAt),
    updatedAt: num(raw.updatedAt),
    completedAt: nullableNum(raw.completedAt),
    masteryBefore,
  };
}

export function readSessionSummary(raw: unknown): SessionSummary | null {
  if (!isRecord(raw)) return null;
  const id = str(raw.id);
  if (!id) return null;

  const readScores = (value: unknown): Record<string, number> => {
    const result: Record<string, number> = {};
    if (!isRecord(value)) return result;
    for (const [key, entry] of Object.entries(value)) {
      if (typeof entry === 'number' && Number.isFinite(entry)) result[key] = entry;
    }
    return result;
  };

  return {
    id,
    mode: oneOf(raw.mode, MODES, 'training'),
    label: str(raw.label, 'Träningspass'),
    startedAt: num(raw.startedAt),
    completedAt: num(raw.completedAt),
    answered: Math.max(0, num(raw.answered)),
    correct: Math.max(0, num(raw.correct)),
    durationMs: Math.max(0, num(raw.durationMs)),
    masteryDelta: readScores(raw.masteryDelta),
    masteryBefore: readScores(raw.masteryBefore),
  };
}

export function readExamAttempt(raw: unknown): ExamAttempt | null {
  if (!isRecord(raw)) return null;
  const id = str(raw.id);
  if (!id) return null;

  const rawQuestions = Array.isArray(raw.questions) ? raw.questions : [];
  const questions = rawQuestions.flatMap((item) => {
    if (!isRecord(item)) return [];
    const questionId = str(item.questionId);
    if (!QUESTION_INDEX_BY_ID.has(questionId)) return [];
    return [
      {
        questionId,
        selectedAnswerId: typeof item.selectedAnswerId === 'string' ? item.selectedAnswerId : null,
        marked: bool(item.marked),
        answeredAt: nullableNum(item.answeredAt),
        responseMs: nullableNum(item.responseMs),
        scored: bool(item.scored, true),
      },
    ];
  });

  if (questions.length === 0) return null;

  const rawResult = isRecord(raw.result) ? raw.result : null;
  const result = rawResult
    ? {
        passed: bool(rawResult.passed),
        score: Math.max(0, num(rawResult.score)),
        scoredQuestions: Math.max(0, num(rawResult.scoredQuestions)),
        passThreshold: Math.max(0, num(rawResult.passThreshold)),
        answered: Math.max(0, num(rawResult.answered)),
        unanswered: Math.max(0, num(rawResult.unanswered)),
        correctIncludingUnscored: Math.max(0, num(rawResult.correctIncludingUnscored)),
        durationMs: Math.max(0, num(rawResult.durationMs)),
        byCategory: Array.isArray(rawResult.byCategory)
          ? rawResult.byCategory.flatMap((entry) =>
              isRecord(entry) && typeof entry.categoryId === 'string'
                ? [
                    {
                      categoryId: entry.categoryId as never,
                      total: Math.max(0, num(entry.total)),
                      correct: Math.max(0, num(entry.correct)),
                    },
                  ]
                : [],
            )
          : [],
        unscoredQuestionIds: Array.isArray(rawResult.unscoredQuestionIds)
          ? rawResult.unscoredQuestionIds.filter((v): v is string => typeof v === 'string')
          : [],
      }
    : null;

  return {
    id,
    status: oneOf(raw.status, EXAM_STATUS, 'abandoned'),
    seed: num(raw.seed),
    startedAt: num(raw.startedAt),
    deadlineAt: num(raw.deadlineAt),
    updatedAt: num(raw.updatedAt),
    submittedAt: nullableNum(raw.submittedAt),
    currentIndex: Math.min(Math.max(0, num(raw.currentIndex)), questions.length - 1),
    questions,
    result,
  };
}

export function readLessonProgress(raw: unknown): LessonProgress | null {
  if (!isRecord(raw)) return null;
  const lessonId = str(raw.lessonId);
  if (!lessonId) return null;
  return {
    lessonId,
    startedAt: num(raw.startedAt),
    completedAt: nullableNum(raw.completedAt),
    furthestBlock: Math.max(0, num(raw.furthestBlock)),
    checkPassed: bool(raw.checkPassed),
  };
}

export function readAchievement(raw: unknown): AchievementUnlock | null {
  if (!isRecord(raw)) return null;
  const id = str(raw.id);
  if (!id) return null;
  return { id, unlockedAt: num(raw.unlockedAt) };
}

export function readReadinessSnapshot(raw: unknown): ReadinessSnapshot | null {
  if (!isRecord(raw)) return null;
  const date = str(raw.date);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  return {
    date,
    score: Math.min(100, Math.max(0, num(raw.score))),
    recordedAt: num(raw.recordedAt),
  };
}
