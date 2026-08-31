import type { CategoryId, Difficulty } from '@/domain/content/types';

/** How sure the learner was when answering. */
export type Confidence = 'known' | 'uncertain' | 'guessed';

/** Where an answer was given. Exam answers must never leak feedback. */
export type PracticeMode =
  | 'training'
  | 'daily-ten'
  | 'quick'
  | 'review'
  | 'mistakes'
  | 'level-test'
  | 'lesson-check'
  | 'exam';

/** One answered question. The append-only event log the engine reasons over. */
export interface AnswerRecord {
  id: string;
  questionId: string;
  category: CategoryId;
  subcategory: string;
  difficulty: Difficulty;
  ruleTested: string;
  selectedAnswerId: string;
  correct: boolean;
  confidence: Confidence | null;
  /** Time from question shown to answer selected. */
  responseMs: number;
  answeredAt: number;
  mode: PracticeMode;
  /** Present when an incorrect alternative was tagged with a misconception. */
  misconceptionId?: string;
  /** Set for exam answers so results can be recomputed. */
  attemptId?: string;
}

/** Per-question state: exposure statistics plus spaced-repetition scheduling. */
export interface QuestionState {
  questionId: string;
  subcategory: string;
  seenCount: number;
  correctCount: number;
  incorrectCount: number;
  /** Consecutive correct answers. Reset to 0 on an incorrect answer. */
  streak: number;
  lastAnsweredAt: number | null;
  lastCorrect: boolean | null;
  lastConfidence: Confidence | null;
  averageResponseMs: number;
  /** Spaced repetition (SM-2 derived). */
  ease: number;
  intervalDays: number;
  repetitions: number;
  lapses: number;
  dueAt: number | null;
  /** Learner explicitly saved this question. */
  saved: boolean;
}

/** Mastery estimate for one subcategory. */
export interface MasteryState {
  subcategoryId: string;
  categoryId: CategoryId;
  /** Exponentially weighted estimate in 0–1. */
  score: number;
  /** Number of scored observations that produced the estimate. */
  observations: number;
  correct: number;
  incorrect: number;
  lastPracticedAt: number | null;
  /** Score the last time a session ended — used for "mastery movement". */
  previousScore: number;
}

export interface OnboardingState {
  completed: boolean;
  /** Index of the last completed step. */
  step: number;
  /** Chosen starting path. */
  path: 'basics' | 'level-test' | null;
  levelTestCompleted: boolean;
  completedAt: number | null;
}

export interface StreakState {
  current: number;
  longest: number;
  /** ISO date (YYYY-MM-DD) of the last day that counted. */
  lastActiveDate: string | null;
  /** Questions answered today, used to decide when the day counts. */
  questionsToday: number;
  todayDate: string | null;
}

export interface LearnerProfile {
  id: string;
  createdAt: number;
  lastActiveAt: number;
  onboarding: OnboardingState;
  streak: StreakState;
  totals: {
    answered: number;
    correct: number;
    sessionsCompleted: number;
    examAttempts: number;
    examsPassed: number;
  };
}

export type ThemePreference = 'light' | 'dark' | 'system';
export type MotionPreference = 'system' | 'reduced' | 'full';
export type ConfidencePrompt = 'always' | 'smart' | 'never';

export interface Preferences {
  theme: ThemePreference;
  motion: MotionPreference;
  /** Root font scale multiplier. */
  textScale: 1 | 1.125 | 1.25;
  confidencePrompt: ConfidencePrompt;
  sound: boolean;
  haptics: boolean;
  /**
   * When false, response time is excluded from the mastery signal entirely.
   * Defaults to true, but is turned off automatically for learners who enable
   * the accessibility reading-pace option.
   */
  useResponseTimeSignal: boolean;
  /** Show the exam countdown as a bar rather than digits. */
  calmExamTimer: boolean;
}

/* ---- Sessions ----------------------------------------------------------- */

export interface SessionQuestionState {
  questionId: string;
  selectedAnswerId: string | null;
  confidence: Confidence | null;
  correct: boolean | null;
  responseMs: number | null;
  answeredAt: number | null;
}

/** A practice session that can be paused and resumed. */
export interface PracticeSession {
  id: string;
  mode: PracticeMode;
  /** Present for category-scoped quick training. */
  categoryId: CategoryId | null;
  label: string;
  questionIds: string[];
  questions: SessionQuestionState[];
  currentIndex: number;
  startedAt: number;
  updatedAt: number;
  completedAt: number | null;
  /** Snapshot of mastery per touched subcategory when the session started. */
  masteryBefore: Record<string, number>;
}

export interface SessionSummary {
  id: string;
  mode: PracticeMode;
  label: string;
  startedAt: number;
  completedAt: number;
  answered: number;
  correct: number;
  durationMs: number;
  /** Subcategory -> mastery delta over the session. */
  masteryDelta: Record<string, number>;
  /**
   * Mastery per touched subcategory as it stood when the session started.
   * Needed to tell "improved from 40%" apart from "this area is new" — without
   * it, a wrong answer in an untouched area reads as progress.
   */
  masteryBefore: Record<string, number>;
}

/* ---- Exam --------------------------------------------------------------- */

export type ExamStatus = 'in-progress' | 'submitted' | 'expired' | 'abandoned';

export interface ExamQuestionState {
  questionId: string;
  selectedAnswerId: string | null;
  marked: boolean;
  answeredAt: number | null;
  responseMs: number | null;
  /** Whether this item counts toward the score in our simulation. */
  scored: boolean;
}

export interface ExamAttempt {
  id: string;
  status: ExamStatus;
  /** Seed used to build the question set and choose the unscored items. */
  seed: number;
  startedAt: number;
  /** Wall-clock deadline. Persisted so a reload cannot extend the exam. */
  deadlineAt: number;
  updatedAt: number;
  submittedAt: number | null;
  currentIndex: number;
  questions: ExamQuestionState[];
  result: ExamResult | null;
}

export interface ExamCategoryBreakdown {
  categoryId: CategoryId;
  total: number;
  correct: number;
}

export interface ExamResult {
  passed: boolean;
  /** Correct answers among the scored questions. */
  score: number;
  scoredQuestions: number;
  passThreshold: number;
  answered: number;
  unanswered: number;
  /** Correct answers including the unscored items, for the learner's own view. */
  correctIncludingUnscored: number;
  durationMs: number;
  byCategory: ExamCategoryBreakdown[];
  /** Ids of the questions that did not count. Revealed only after submission. */
  unscoredQuestionIds: string[];
}

/* ---- Theory school ------------------------------------------------------ */

export interface LessonProgress {
  lessonId: string;
  startedAt: number;
  completedAt: number | null;
  /** Index of the furthest block the learner scrolled to. */
  furthestBlock: number;
  checkPassed: boolean;
}

/* ---- Achievements ------------------------------------------------------- */

export interface AchievementUnlock {
  id: string;
  unlockedAt: number;
}

/* ---- Readiness ---------------------------------------------------------- */

export interface ReadinessSnapshot {
  /** ISO date, YYYY-MM-DD. One snapshot per day, last write wins. */
  date: string;
  score: number;
  recordedAt: number;
}

/* ---- Aggregate ---------------------------------------------------------- */

/** Everything the engine needs, held in memory and mirrored to IndexedDB. */
export interface LearnerData {
  profile: LearnerProfile;
  preferences: Preferences;
  answers: AnswerRecord[];
  questionStates: Record<string, QuestionState>;
  mastery: Record<string, MasteryState>;
  sessions: SessionSummary[];
  activeSession: PracticeSession | null;
  activeExamId: string | null;
  exams: ExamAttempt[];
  lessons: Record<string, LessonProgress>;
  achievements: AchievementUnlock[];
  readinessHistory: ReadinessSnapshot[];
}
