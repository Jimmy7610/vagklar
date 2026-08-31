import type {
  LearnerData,
  LearnerProfile,
  OnboardingState,
  Preferences,
  StreakState,
} from '@/domain/learner/types';

/** A stable id generator that works without crypto.randomUUID. */
export function createId(prefix = ''): string {
  const globalCrypto = typeof crypto !== 'undefined' ? crypto : undefined;
  if (globalCrypto?.randomUUID) return `${prefix}${globalCrypto.randomUUID()}`;
  const random = Math.random().toString(36).slice(2, 10);
  const time = Date.now().toString(36);
  return `${prefix}${time}-${random}`;
}

export const DEFAULT_PREFERENCES: Preferences = {
  theme: 'system',
  motion: 'system',
  textScale: 1,
  confidencePrompt: 'smart',
  sound: false,
  haptics: true,
  useResponseTimeSignal: true,
  calmExamTimer: false,
};

export function createOnboardingState(): OnboardingState {
  return { completed: false, step: 0, path: null, levelTestCompleted: false, completedAt: null };
}

export function createStreakState(): StreakState {
  return { current: 0, longest: 0, lastActiveDate: null, questionsToday: 0, todayDate: null };
}

export function createProfile(now: number): LearnerProfile {
  return {
    id: createId('learner-'),
    createdAt: now,
    lastActiveAt: now,
    onboarding: createOnboardingState(),
    streak: createStreakState(),
    totals: { answered: 0, correct: 0, sessionsCompleted: 0, examAttempts: 0, examsPassed: 0 },
  };
}

/**
 * A brand-new learner. Every counter is genuinely zero — the dashboard must
 * never show invented progress.
 */
export function createEmptyLearnerData(now: number): LearnerData {
  return {
    profile: createProfile(now),
    preferences: { ...DEFAULT_PREFERENCES },
    answers: [],
    questionStates: {},
    mastery: {},
    sessions: [],
    activeSession: null,
    activeExamId: null,
    exams: [],
    lessons: {},
    achievements: [],
    readinessHistory: [],
  };
}
