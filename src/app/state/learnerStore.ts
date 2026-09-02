import { EXAM } from '@/domain/constants';
import type { CategoryId, Question } from '@/domain/content/types';
import type { getQuestion as GetQuestion, getQuestions as GetQuestions } from '@/domain/content/bank';
import type {
  Confidence,
  ExamAttempt,
  LearnerData,
  LessonProgress,
  PracticeMode,
  PracticeSession,
  Preferences,
  SessionSummary,
} from '@/domain/learner/types';
import { applyAnswer, snapshotMastery } from '@/domain/learner/applyAnswer';
import { readinessFromLearner, isoDate } from '@/domain/readiness/readiness';
import { evaluateAchievements } from '@/domain/achievements/achievements';
import type * as ExamModule from '@/domain/exam/exam';
import { learnerRepository } from '@/storage/repository';
import { createEmptyLearnerData, createId } from '@/storage/defaults';
import type { StorageMode } from '@/storage/repository';

export interface LearnerStoreState {
  status: 'loading' | 'ready';
  mode: StorageMode;
  warnings: string[];
  data: LearnerData;
  /** Achievement ids unlocked but not yet acknowledged by the UI. */
  pendingAchievements: string[];
}

export interface StartSessionSpec {
  mode: PracticeMode;
  label: string;
  questionIds: string[];
  categoryId?: CategoryId | null;
}

type Listener = () => void;

/**
 * The learner store.
 *
 * Deliberately not a React context reducer: keeping it as a plain observable
 * object means every state transition is a pure domain call that can be tested
 * without rendering anything, and React subscribes through
 * `useSyncExternalStore`.
 *
 * Writes are fire-and-forget against the repository. The in-memory state is
 * the source of truth for the running session; IndexedDB is the durable
 * mirror. A failed write never blocks or breaks the UI.
 */
/**
 * The question bank, loaded on demand.
 *
 * The bank is ~470 kB of JSON — answers, explanations and source references —
 * and none of it is needed to paint the landing page. Importing it statically
 * here put all of it in the startup bundle, because this store is part of the
 * app shell.
 *
 * So it is imported dynamically in `init()`, which already awaits IndexedDB and
 * whose completion already gates every app route through `HydrationGate`. By
 * the time any screen renders, the bank is in memory and every consumer below
 * stays synchronous — the module boundary moved, the programming model did not.
 *
 * Vite emits it as its own chunk and Workbox precaches every chunk, so the bank
 * is still available offline exactly as before.
 */
let bank: { getQuestion: typeof GetQuestion; getQuestions: typeof GetQuestions } | null = null;
let exam: typeof ExamModule | null = null;

async function loadContentModules(): Promise<void> {
  if (bank && exam) return;
  // Both in parallel: the exam module reaches the bank anyway, so loading them
  // together costs one round trip rather than two.
  const [bankModule, examModule] = await Promise.all([
    import('@/domain/content/bank'),
    import('@/domain/exam/exam'),
  ]);
  bank = { getQuestion: bankModule.getQuestion, getQuestions: bankModule.getQuestions };
  exam = examModule;
}

/** Throws only if called before `init()` — which HydrationGate prevents. */
function questionBank(): { getQuestion: typeof GetQuestion; getQuestions: typeof GetQuestions } {
  if (!bank) throw new Error('Frågebanken är inte laddad än.');
  return bank;
}

function examOps(): typeof ExamModule {
  if (!exam) throw new Error('Provmodulen är inte laddad än.');
  return exam;
}

export class LearnerStore {
  private state: LearnerStoreState;
  private listeners = new Set<Listener>();

  constructor(now: number = Date.now()) {
    this.state = {
      status: 'loading',
      mode: 'memory',
      warnings: [],
      data: createEmptyLearnerData(now),
      pendingAchievements: [],
    };
  }

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = (): LearnerStoreState => this.state;

  private setState(next: Partial<LearnerStoreState>): void {
    this.state = { ...this.state, ...next };
    for (const listener of this.listeners) listener();
  }

  private setData(data: LearnerData): void {
    this.setState({ data });
  }

  /* ---- Lifecycle ----------------------------------------------------- */

  async init(now = Date.now()): Promise<void> {
    // Before the repository, because sanitising a saved session resolves
    // question ids, and every screen below assumes the bank is present.
    await loadContentModules();
    const result = await learnerRepository.load(now);

    let data = result.data;

    // An exam whose deadline passed while the app was closed is finalised on
    // load, so the timer can never be extended by closing the tab.
    const activeExam = data.exams.find((e) => e.id === data.activeExamId);
    if (activeExam && examOps().isExpired(activeExam, now)) {
      const finalised = examOps().submitExam(activeExam, now, 'expired');
      data = {
        ...data,
        exams: data.exams.map((e) => (e.id === finalised.id ? finalised : e)),
      };
      void learnerRepository.saveExam(finalised);
    }

    this.setState({
      status: 'ready',
      mode: result.mode,
      warnings: result.warnings,
      data,
    });

    this.checkAchievements();
  }

  /* ---- Preferences --------------------------------------------------- */

  setPreferences(partial: Partial<Preferences>): void {
    const preferences = { ...this.state.data.preferences, ...partial };
    this.setData({ ...this.state.data, preferences });
    void learnerRepository.savePreferences(preferences);
  }

  /* ---- Onboarding ---------------------------------------------------- */

  setOnboardingStep(step: number): void {
    const profile = {
      ...this.state.data.profile,
      onboarding: { ...this.state.data.profile.onboarding, step },
    };
    this.setData({ ...this.state.data, profile });
    void learnerRepository.saveProfile(profile);
  }

  completeOnboarding(path: 'basics' | 'level-test', now = Date.now()): void {
    const profile = {
      ...this.state.data.profile,
      onboarding: {
        ...this.state.data.profile.onboarding,
        completed: true,
        path,
        completedAt: now,
      },
    };
    this.setData({ ...this.state.data, profile });
    void learnerRepository.saveProfile(profile);
  }

  markLevelTestCompleted(): void {
    const profile = {
      ...this.state.data.profile,
      onboarding: { ...this.state.data.profile.onboarding, levelTestCompleted: true },
    };
    this.setData({ ...this.state.data, profile });
    void learnerRepository.saveProfile(profile);
  }

  /* ---- Practice sessions --------------------------------------------- */

  startSession(spec: StartSessionSpec, now = Date.now()): PracticeSession | null {
    const questions = questionBank().getQuestions(spec.questionIds);
    if (questions.length === 0) return null;

    const masteryBefore: Record<string, number> = {};
    for (const question of questions) {
      masteryBefore[question.subcategory] =
        this.state.data.mastery[question.subcategory]?.score ?? 0;
    }

    const session: PracticeSession = {
      id: createId('session-'),
      mode: spec.mode,
      categoryId: spec.categoryId ?? null,
      label: spec.label,
      questionIds: questions.map((q) => q.id),
      questions: questions.map((q) => ({
        questionId: q.id,
        selectedAnswerId: null,
        confidence: null,
        correct: null,
        responseMs: null,
        answeredAt: null,
      })),
      currentIndex: 0,
      startedAt: now,
      updatedAt: now,
      completedAt: null,
      masteryBefore,
    };

    this.setData({ ...this.state.data, activeSession: session });
    void learnerRepository.saveActiveSession(session);
    return session;
  }

  /** Record an answer inside the active practice session. */
  answerSessionQuestion(
    questionId: string,
    selectedAnswerId: string,
    responseMs: number,
    confidence: Confidence | null = null,
    now = Date.now(),
  ): { correct: boolean; question: Question } | null {
    const session = this.state.data.activeSession;
    const question = questionBank().getQuestion(questionId);
    if (!session || !question) return null;

    const index = session.questions.findIndex((q) => q.questionId === questionId);
    if (index === -1) return null;
    const existing = session.questions[index];
    if (!existing || existing.selectedAnswerId !== null) {
      return existing ? { correct: existing.correct ?? false, question } : null;
    }

    const outcome = applyAnswer(this.state.data, {
      question,
      selectedAnswerId,
      confidence,
      responseMs,
      mode: session.mode,
      at: now,
      answerId: createId('answer-'),
      useResponseTimeSignal: this.state.data.preferences.useResponseTimeSignal,
    });

    const questions = session.questions.slice();
    questions[index] = {
      ...existing,
      selectedAnswerId,
      confidence,
      correct: outcome.correct,
      responseMs,
      answeredAt: now,
    };

    const updatedSession: PracticeSession = { ...session, questions, updatedAt: now };

    this.setData({ ...outcome.data, activeSession: updatedSession });

    void learnerRepository.appendAnswer(outcome.answer);
    void learnerRepository.saveQuestionState(outcome.data.questionStates[question.id]!);
    void learnerRepository.saveMasteryState(outcome.data.mastery[question.subcategory]!);
    void learnerRepository.saveProfile(outcome.data.profile);
    void learnerRepository.saveActiveSession(updatedSession);

    return { correct: outcome.correct, question };
  }

  /** Attach a confidence rating to an answer already given in this session. */
  setSessionConfidence(questionId: string, confidence: Confidence): void {
    const session = this.state.data.activeSession;
    if (!session) return;
    const index = session.questions.findIndex((q) => q.questionId === questionId);
    const existing = index === -1 ? undefined : session.questions[index];
    if (!existing || existing.answeredAt === null) return;

    const questions = session.questions.slice();
    questions[index] = { ...existing, confidence };
    const updatedSession = { ...session, questions, updatedAt: Date.now() };

    // Update the stored answer record too, so the calibration signal is real.
    const answers = this.state.data.answers.slice();
    for (let i = answers.length - 1; i >= 0; i -= 1) {
      const answer = answers[i];
      if (answer && answer.questionId === questionId && answer.confidence === null) {
        answers[i] = { ...answer, confidence };
        void learnerRepository.appendAnswer(answers[i]!);
        break;
      }
    }

    this.setData({ ...this.state.data, answers, activeSession: updatedSession });
    void learnerRepository.saveActiveSession(updatedSession);
  }

  goToSessionIndex(index: number): void {
    const session = this.state.data.activeSession;
    if (!session) return;
    const clamped = Math.max(0, Math.min(session.questions.length - 1, index));
    const updated = { ...session, currentIndex: clamped, updatedAt: Date.now() };
    this.setData({ ...this.state.data, activeSession: updated });
    void learnerRepository.saveActiveSession(updated);
  }

  completeSession(now = Date.now()): SessionSummary | null {
    const session = this.state.data.activeSession;
    if (!session) return null;

    const answered = session.questions.filter((q) => q.answeredAt !== null);
    const correct = answered.filter((q) => q.correct).length;
    const touched = Array.from(
      new Set(
        session.questionIds.flatMap((id) => {
          const question = questionBank().getQuestion(id);
          return question ? [question.subcategory] : [];
        }),
      ),
    );

    const masteryDelta: Record<string, number> = {};
    for (const subcategoryId of touched) {
      const before = session.masteryBefore[subcategoryId] ?? 0;
      const after = this.state.data.mastery[subcategoryId]?.score ?? 0;
      masteryDelta[subcategoryId] = after - before;
    }

    const summary: SessionSummary = {
      id: session.id,
      mode: session.mode,
      label: session.label,
      startedAt: session.startedAt,
      completedAt: now,
      answered: answered.length,
      correct,
      durationMs: Math.max(0, now - session.startedAt),
      masteryDelta,
      masteryBefore: session.masteryBefore,
    };

    const profile = {
      ...this.state.data.profile,
      lastActiveAt: now,
      totals: {
        ...this.state.data.profile.totals,
        sessionsCompleted: this.state.data.profile.totals.sessionsCompleted + 1,
      },
    };

    const withSnapshot = snapshotMastery(
      { ...this.state.data, profile, sessions: [...this.state.data.sessions, summary] },
      touched,
    );

    this.setData({ ...withSnapshot, activeSession: null });

    void learnerRepository.saveSessionSummary(summary);
    void learnerRepository.saveProfile(profile);
    void learnerRepository.saveActiveSession(null);
    for (const subcategoryId of touched) {
      const state = withSnapshot.mastery[subcategoryId];
      if (state) void learnerRepository.saveMasteryState(state);
    }

    this.recordReadinessSnapshot(now);
    this.checkAchievements();

    return summary;
  }

  abandonSession(): void {
    if (!this.state.data.activeSession) return;
    this.setData({ ...this.state.data, activeSession: null });
    void learnerRepository.saveActiveSession(null);
  }

  toggleSaved(questionId: string): void {
    const question = questionBank().getQuestion(questionId);
    if (!question) return;
    const existing = this.state.data.questionStates[questionId];
    const base = existing ?? {
      questionId,
      subcategory: question.subcategory,
      seenCount: 0,
      correctCount: 0,
      incorrectCount: 0,
      streak: 0,
      lastAnsweredAt: null,
      lastCorrect: null,
      lastConfidence: null,
      averageResponseMs: 0,
      ease: 2.3,
      intervalDays: 0,
      repetitions: 0,
      lapses: 0,
      dueAt: null,
      saved: false,
    };
    const updated = { ...base, saved: !base.saved };
    this.setData({
      ...this.state.data,
      questionStates: { ...this.state.data.questionStates, [questionId]: updated },
    });
    void learnerRepository.saveQuestionState(updated);
  }

  /* ---- Exam ----------------------------------------------------------- */

  startExam(now = Date.now()): ExamAttempt {
    const seed = (now ^ Math.floor(Math.random() * 0xffffffff)) >>> 0;
    const attempt = examOps().createExamAttempt(seed, now, createId('exam-'));

    const profile = {
      ...this.state.data.profile,
      lastActiveAt: now,
      totals: {
        ...this.state.data.profile.totals,
        examAttempts: this.state.data.profile.totals.examAttempts + 1,
      },
    };

    this.setData({
      ...this.state.data,
      profile,
      exams: [...this.state.data.exams, attempt],
      activeExamId: attempt.id,
    });

    void learnerRepository.saveExam(attempt);
    void learnerRepository.saveActiveExamId(attempt.id);
    void learnerRepository.saveProfile(profile);

    return attempt;
  }

  private updateExam(next: ExamAttempt, activeExamId?: string | null): void {
    const exams = this.state.data.exams.map((e) => (e.id === next.id ? next : e));
    const data = { ...this.state.data, exams };
    if (activeExamId !== undefined) data.activeExamId = activeExamId;
    this.setData(data);
    void learnerRepository.saveExam(next);
    if (activeExamId !== undefined) void learnerRepository.saveActiveExamId(activeExamId);
  }

  getActiveExam(): ExamAttempt | null {
    const { activeExamId, exams } = this.state.data;
    if (!activeExamId) return null;
    return exams.find((e) => e.id === activeExamId && e.status === 'in-progress') ?? null;
  }

  answerExam(index: number, answerId: string, responseMs: number, now = Date.now()): void {
    const attempt = this.getActiveExam();
    if (!attempt || examOps().isExpired(attempt, now)) return;
    this.updateExam(examOps().answerExamQuestion(attempt, index, answerId, now, responseMs));
  }

  markExamQuestion(index: number, now = Date.now()): void {
    const attempt = this.getActiveExam();
    if (!attempt) return;
    this.updateExam(examOps().toggleExamMark(attempt, index, now));
  }

  goToExamIndex(index: number, now = Date.now()): void {
    const attempt = this.getActiveExam();
    if (!attempt) return;
    this.updateExam(examOps().goToExamQuestion(attempt, index, now));
  }

  /**
   * Finalise the active exam. Exam answers are written into the learning
   * record only at this point — during the exam nothing must leak into the
   * adaptive engine, because that would be indistinguishable from feedback.
   */
  finishExam(now = Date.now(), reason: 'submitted' | 'expired' = 'submitted'): ExamAttempt | null {
    const attempt = this.getActiveExam();
    if (!attempt) return null;

    const finalised = examOps().submitExam(attempt, now, reason);
    let data = { ...this.state.data };

    for (const state of finalised.questions) {
      if (state.selectedAnswerId === null) continue;
      const question = questionBank().getQuestion(state.questionId);
      if (!question) continue;
      const outcome = applyAnswer(data, {
        question,
        selectedAnswerId: state.selectedAnswerId,
        confidence: null,
        responseMs: state.responseMs ?? 0,
        mode: 'exam',
        at: state.answeredAt ?? now,
        answerId: createId('answer-'),
        attemptId: finalised.id,
        useResponseTimeSignal: false,
      });
      data = outcome.data;
      void learnerRepository.appendAnswer(outcome.answer);
    }

    const passed = finalised.result?.passed ?? false;
    const profile = {
      ...data.profile,
      lastActiveAt: now,
      totals: {
        ...data.profile.totals,
        examsPassed: data.profile.totals.examsPassed + (passed ? 1 : 0),
      },
    };

    /*
     * `activeExamId` keeps pointing at the attempt after it is submitted. It
     * means "the current attempt", not "an attempt still running" — `status`
     * carries that, and `getActiveExam()` filters on it. Keeping the pointer is
     * what lets the exam screen redirect deterministically to the right result
     * instead of racing the state update back to the exam hub.
     */
    data = {
      ...data,
      profile,
      exams: data.exams.map((e) => (e.id === finalised.id ? finalised : e)),
      activeExamId: finalised.id,
    };

    this.setData(data);

    void learnerRepository.saveExam(finalised);
    void learnerRepository.saveActiveExamId(finalised.id);
    void learnerRepository.saveProfile(profile);
    for (const state of Object.values(data.questionStates)) {
      void learnerRepository.saveQuestionState(state);
    }
    for (const state of Object.values(data.mastery)) {
      void learnerRepository.saveMasteryState(state);
    }

    this.recordReadinessSnapshot(now);
    this.checkAchievements();

    return finalised;
  }

  abandonExam(now = Date.now()): void {
    const attempt = this.getActiveExam();
    if (!attempt) return;
    this.updateExam({ ...attempt, status: 'abandoned', updatedAt: now }, null);
  }

  /** Called by the exam screen's ticker to enforce the deadline. */
  enforceExamDeadline(now = Date.now()): ExamAttempt | null {
    const attempt = this.getActiveExam();
    if (!attempt) return null;
    if (!examOps().isExpired(attempt, now)) return null;
    return this.finishExam(now, 'expired');
  }

  /* ---- Theory school -------------------------------------------------- */

  updateLessonProgress(lessonId: string, partial: Partial<LessonProgress>, now = Date.now()): void {
    const existing = this.state.data.lessons[lessonId] ?? {
      lessonId,
      startedAt: now,
      completedAt: null,
      furthestBlock: 0,
      checkPassed: false,
    };
    const updated: LessonProgress = { ...existing, ...partial, lessonId };
    this.setData({
      ...this.state.data,
      lessons: { ...this.state.data.lessons, [lessonId]: updated },
    });
    void learnerRepository.saveLessonProgress(updated);
    this.checkAchievements();
  }

  /* ---- Readiness history ---------------------------------------------- */

  recordReadinessSnapshot(now = Date.now()): void {
    const readiness = readinessFromLearner(this.state.data, now);
    if (readiness.score === null) return;

    const date = isoDate(now);
    const snapshot = { date, score: readiness.score, recordedAt: now };
    const history = this.state.data.readinessHistory.filter((s) => s.date !== date);
    history.push(snapshot);
    history.sort((a, b) => a.date.localeCompare(b.date));

    this.setData({ ...this.state.data, readinessHistory: history });
    void learnerRepository.saveReadinessSnapshot(snapshot);
  }

  /* ---- Achievements ---------------------------------------------------- */

  private checkAchievements(now = Date.now()): void {
    const earned = evaluateAchievements(this.state.data);
    if (earned.length === 0) return;

    const unlocks = earned.map((a) => ({ id: a.id, unlockedAt: now }));
    this.setState({
      data: {
        ...this.state.data,
        achievements: [...this.state.data.achievements, ...unlocks],
      },
      pendingAchievements: [...this.state.pendingAchievements, ...unlocks.map((u) => u.id)],
    });
    for (const unlock of unlocks) void learnerRepository.saveAchievement(unlock);
  }

  acknowledgeAchievement(id: string): void {
    this.setState({
      pendingAchievements: this.state.pendingAchievements.filter((a) => a !== id),
    });
  }

  /* ---- Destructive operations ------------------------------------------ */

  async reset(now = Date.now()): Promise<void> {
    const fresh = await learnerRepository.resetAll(now);
    this.setState({
      data: fresh,
      mode: learnerRepository.getMode(),
      pendingAchievements: [],
      warnings: [],
    });
  }

  async importData(data: LearnerData): Promise<void> {
    this.setState({ data, pendingAchievements: [] });
    await learnerRepository.replaceAll(data);
  }

  /** Persist anything transient before the page goes away. */
  flush(): void {
    const { activeSession } = this.state.data;
    if (activeSession) void learnerRepository.saveActiveSession(activeSession);
    void learnerRepository.saveProfile(this.state.data.profile);
  }
}

export const learnerStore = new LearnerStore();

/** Exam constants re-exported for screens that display them. */
export { EXAM };
