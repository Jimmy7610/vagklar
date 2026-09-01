/**
 * Vägklar — central domain constants.
 *
 * Every number that describes "how the product works" lives here. Nothing in
 * features/ or ui/ may re-declare these values.
 */

/** Bumped when the persisted learner schema changes. See storage/migrations.ts */
export const SCHEMA_VERSION = 1;

/** Product version, surfaced in the footer and in exported backups. */
export const APP_VERSION = '1.0.0';

/* ==========================================================================
   Simulated theory exam
   --------------------------------------------------------------------------
   Mirrors the *structure* of the Swedish B knowledge test. Vägklar uses its
   own original questions; we never claim to know which items are unscored in
   the real test. In our simulation the unscored five are chosen deterministically
   from the attempt seed and revealed only after submission.
   ========================================================================== */
export const EXAM = {
  /** Total questions presented in one attempt. */
  totalQuestions: 70,
  /** Questions that do not count toward the result (simulating trial items). */
  unscoredQuestions: 5,
  /** Questions that do count. */
  get scoredQuestions(): number {
    return this.totalQuestions - this.unscoredQuestions;
  },
  /** Points required to pass. */
  passThreshold: 52,
  /** Time limit in minutes. */
  durationMinutes: 50,
  /** Time limit in milliseconds. */
  get durationMs(): number {
    return this.durationMinutes * 60 * 1000;
  },
  /** Warn the learner when this much time remains (ms). */
  warnAtRemainingMs: 5 * 60 * 1000,
  /** Persist the attempt at least this often while it runs (ms). */
  autosaveIntervalMs: 5000,
} as const;

/* ==========================================================================
   Session sizes
   ========================================================================== */
export const SESSION = {
  dailyTenSize: 10,
  quickSizes: [5, 10, 20] as const,
  levelTestSize: 24,
  /** Average seconds per question used for "~4 min" estimates. */
  estimatedSecondsPerQuestion: 32,
} as const;

/* ==========================================================================
   Mastery model
   ========================================================================== */
export const MASTERY = {
  /** Quality score for a correct answer at each confidence level. */
  qualityCorrect: { known: 1, uncertain: 0.8, guessed: 0.55, none: 0.9 },
  /** Quality score for an incorrect answer at each confidence level. */
  qualityIncorrect: { known: 0, uncertain: 0.05, guessed: 0.12, none: 0.03 },
  /** Multiplier applied to a *correct* answer by question difficulty (1–3). */
  difficultyGainCorrect: { 1: 0.96, 2: 1, 3: 1.06 },
  /** Multiplier applied to an *incorrect* answer's quality by difficulty. */
  difficultyGainIncorrect: { 1: 0.7, 2: 1, 3: 1.35 },
  /** Learning-rate floor and numerator: alpha = max(floor, num / sqrt(n + 1)). */
  alphaFloor: 0.18,
  alphaNumerator: 0.5,
  /** Neutral starting estimate for a never-attempted concept. */
  initialScore: 0,
  /** Observations needed before a concept's estimate is treated as reliable. */
  reliableObservations: 3,
  /** certainty = 1 - exp(-observations / certaintyTau) */
  certaintyTau: 5,
  /** Mastery thresholds used consistently by every mastery visual. */
  thresholds: { weak: 0.5, developing: 0.7, strong: 0.85 },
} as const;

/* ==========================================================================
   Response time — a *weak supporting* signal, never a dominant one.
   ========================================================================== */
export const RESPONSE_TIME = {
  /** Correct answers faster than this fraction of the estimate are damped. */
  suspiciouslyFastFactor: 0.3,
  suspiciouslyFastMultiplier: 0.95,
  /** Correct answers slower than this factor are damped only very slightly. */
  slowFactor: 3.5,
  slowMultiplier: 0.98,
  /** Absolute floor: never damp an answer that took longer than this (ms). */
  minimumConsideredMs: 1200,
} as const;

/* ==========================================================================
   Spaced repetition (SM-2 derived, deterministic)
   ========================================================================== */
export const REPETITION = {
  initialEase: 2.3,
  minEase: 1.3,
  maxEase: 2.7,
  /** Interval ladder for the first successful repetitions, in days. */
  firstIntervalDays: 1,
  secondIntervalDays: 3,
  maxIntervalDays: 120,
  /** After a lapse the item comes back very soon. */
  lapseIntervalMinutes: 20,
  /** Grade below this counts as a lapse. */
  passingGrade: 3,
  /** Prefer a sibling question when the exact item was seen within this window. */
  siblingPreferenceDays: 2,
} as const;

/* ==========================================================================
   Readiness model — see docs/KNOWLEDGE-ENGINE.md
   ========================================================================== */
export const READINESS = {
  weights: {
    mastery: 0.34,
    coverage: 0.12,
    recentAccuracy: 0.18,
    exam: 0.16,
    retention: 0.08,
    consistency: 0.06,
    calibration: 0.06,
  },
  /** How many recent answers feed the recent-accuracy component. */
  recentAnswerWindow: 60,
  /** Exam scores are mapped from this range onto 0–1. */
  examFloorScore: 38,
  examCeilingScore: 62,
  /** How many recent exam attempts are considered. */
  examAttemptWindow: 3,
  /** Days of activity considered for the consistency component. */
  consistencyWindowDays: 14,
  consistencyTargetActiveDays: 8,
  /** Weak-category penalty. */
  weakCategoryMinScore: 0.5,
  weakCategoryPenaltyEach: 0.035,
  weakCategoryPenaltyMax: 0.15,
  weakCategoryMinObservations: 5,
  /** Repeated-misconception penalty. */
  misconceptionPenaltyEach: 0.02,
  misconceptionPenaltyMax: 0.06,
  misconceptionRepeatThreshold: 3,
  /**
   * Answers required before any estimate is shown at all. A number derived
   * from one or two answers is noise, and showing it would be worse than
   * showing nothing — so the dashboard counts down to this instead.
   */
  firstEstimateAnswers: 5,
  /** Below this many answers the estimate is provisional and capped. */
  provisionalAnswerThreshold: 20,
  provisionalCap: 60,
} as const;

/* ==========================================================================
   Daily Ten composition (targets; shortfalls are back-filled by priority)
   ========================================================================== */
export const DAILY_TEN_MIX = {
  weakConcepts: 3,
  dueRepetition: 2,
  recentMistakes: 2,
  reinforcement: 2,
  unseen: 1,
} as const;

/** Streak bookkeeping. */
export const STREAK = {
  /** A day counts toward the streak once this many questions are answered. */
  questionsForActiveDay: 5,
} as const;

export const STORAGE_KEYS = {
  theme: 'vagklar.theme',
  reducedMotion: 'vagklar.reduced-motion',
  textScale: 'vagklar.text-scale',
} as const;

/** Legal/positioning copy used in more than one place. */
export const DISCLAIMER =
  'Vägklar är en fristående träningsprodukt och är inte ansluten till eller godkänd av Trafikverket.';
