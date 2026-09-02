import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { learnerStore } from './learnerStore';
import type { LearnerStoreState } from './learnerStore';
import type { LearnerData } from '@/domain/learner/types';
import { computeReadiness } from '@/domain/readiness/readiness';
import { outstandingMistakeCount } from '@/domain/insights/mistakeCount';
import { useMinuteClock } from './clock';
import type { ReadinessResult } from '@/domain/readiness/readiness';

/**
 * React bindings for the learner store.
 *
 * Derived values are memoised against the identity of the `LearnerData`
 * object. Because every store transition produces a new object, a cache keyed
 * on that identity is exactly as fresh as the data and costs nothing when
 * several components ask for the same derivation.
 */

export function useLearnerState(): LearnerStoreState {
  return useSyncExternalStore(learnerStore.subscribe, learnerStore.getSnapshot, learnerStore.getSnapshot);
}

export function useLearner(): LearnerData {
  return useLearnerState().data;
}

export function useLearnerStore(): typeof learnerStore {
  return learnerStore;
}

/* ---- Derived caches ----------------------------------------------------- */

const readinessCache = new WeakMap<LearnerData, ReadinessResult>();

/**
 * Readiness is recomputed at most once per learner-data revision. The `now`
 * argument only affects time-decay terms, which move on the scale of days, so
 * caching on the data identity is safe within a session.
 */
export function useReadiness(): ReadinessResult {
  const data = useLearner();
  const now = useMinuteClock();
  return useMemo(() => {
    const cached = readinessCache.get(data);
    if (cached) return cached;
    const result = computeReadiness({
      mastery: data.mastery,
      questionStates: data.questionStates,
      answers: data.answers,
      exams: data.exams,
      createdAt: data.profile.createdAt,
      now,
    });
    readinessCache.set(data, result);
    return result;
  }, [data, now]);
}

export function useOutstandingMistakeCount(): number {
  const data = useLearner();
  return useMemo(() => outstandingMistakeCount(data), [data]);
}

/** Stable callback bundle for the most common store actions. */
export function useLearnerActions() {
  const store = useLearnerStore();
  return useMemo(
    () => ({
      startSession: store.startSession.bind(store),
      answer: store.answerSessionQuestion.bind(store),
      setConfidence: store.setSessionConfidence.bind(store),
      goToIndex: store.goToSessionIndex.bind(store),
      completeSession: store.completeSession.bind(store),
      abandonSession: store.abandonSession.bind(store),
      toggleSaved: store.toggleSaved.bind(store),
      setPreferences: store.setPreferences.bind(store),
      startExam: store.startExam.bind(store),
      answerExam: store.answerExam.bind(store),
      markExamQuestion: store.markExamQuestion.bind(store),
      goToExamIndex: store.goToExamIndex.bind(store),
      finishExam: store.finishExam.bind(store),
      abandonExam: store.abandonExam.bind(store),
      enforceExamDeadline: store.enforceExamDeadline.bind(store),
      updateLessonProgress: store.updateLessonProgress.bind(store),
      completeOnboarding: store.completeOnboarding.bind(store),
      setOnboardingStep: store.setOnboardingStep.bind(store),
      markLevelTestCompleted: store.markLevelTestCompleted.bind(store),
      acknowledgeAchievement: store.acknowledgeAchievement.bind(store),
      reset: store.reset.bind(store),
      importData: store.importData.bind(store),
    }),
    [store],
  );
}

export function useSavedQuestionIds(): string[] {
  const data = useLearner();
  return useMemo(
    () =>
      Object.values(data.questionStates)
        .filter((state) => state.saved)
        .map((state) => state.questionId),
    [data],
  );
}

export function useIsQuestionSaved(questionId: string): boolean {
  const data = useLearner();
  return data.questionStates[questionId]?.saved ?? false;
}

export function useHasProgress(): boolean {
  const data = useLearner();
  return data.answers.length > 0;
}

/** Convenience wrapper that re-renders when the active session changes. */
export function useActiveSession() {
  const data = useLearner();
  return data.activeSession;
}

export function useActiveExam() {
  const data = useLearner();
  const activeExamId = data.activeExamId;
  return useMemo(() => {
    if (!activeExamId) return null;
    return data.exams.find((e) => e.id === activeExamId && e.status === 'in-progress') ?? null;
  }, [data, activeExamId]);
}

export function useCompletedExams() {
  const data = useLearner();
  return useMemo(
    () =>
      data.exams
        .filter((e) => e.result !== null)
        .sort((a, b) => (b.submittedAt ?? 0) - (a.submittedAt ?? 0)),
    [data],
  );
}

export function useFlushOnHide(): () => void {
  const store = useLearnerStore();
  return useCallback(() => store.flush(), [store]);
}
