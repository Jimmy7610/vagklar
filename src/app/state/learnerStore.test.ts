import { beforeEach, describe, expect, it } from 'vitest';
import { IDBFactory } from 'fake-indexeddb';
import { LearnerStore } from './learnerStore';
import { EXAM } from '@/domain/constants';
import { getQuestion } from '@/domain/content/bank';
import { buildQuickSession } from '@/domain/selection/selection';

const NOW = new Date(2025, 4, 12, 10).getTime();

function emptyContext() {
  return { mastery: {}, questionStates: {}, answers: [], now: NOW, seed: 7 };
}

async function freshStore(): Promise<LearnerStore> {
  const store = new LearnerStore(NOW);
  await store.init(NOW);
  return store;
}

beforeEach(() => {
  globalThis.indexedDB = new IDBFactory();
});

describe('practice sessions', () => {
  it('starts, answers and completes a session', async () => {
    const store = await freshStore();
    const questions = buildQuickSession(emptyContext(), 5, { kind: 'all' });

    const session = store.startSession(
      { mode: 'quick', label: 'Blandat', questionIds: questions.map((q) => q.id) },
      NOW,
    );
    expect(session).not.toBeNull();
    expect(store.getSnapshot().data.activeSession?.questions).toHaveLength(5);

    questions.forEach((question, index) => {
      const result = store.answerSessionQuestion(
        question.id,
        question.correctAnswerId,
        7000,
        'known',
        NOW + index,
      );
      expect(result?.correct).toBe(true);
      if (index < questions.length - 1) store.goToSessionIndex(index + 1);
    });

    const summary = store.completeSession(NOW + 60_000);
    expect(summary?.answered).toBe(5);
    expect(summary?.correct).toBe(5);
    expect(store.getSnapshot().data.activeSession).toBeNull();
    expect(store.getSnapshot().data.profile.totals.sessionsCompleted).toBe(1);
    expect(store.getSnapshot().data.sessions).toHaveLength(1);
  });

  it('refuses to answer the same question twice in a session', async () => {
    const store = await freshStore();
    const question = getQuestion('kor-001')!;
    store.startSession({ mode: 'quick', label: 'Test', questionIds: [question.id] }, NOW);

    store.answerSessionQuestion(question.id, question.correctAnswerId, 5000, 'known', NOW);
    const wrong = question.answers.find((a) => a.id !== question.correctAnswerId)!;
    store.answerSessionQuestion(question.id, wrong.id, 5000, 'known', NOW + 10);

    expect(store.getSnapshot().data.answers).toHaveLength(1);
    expect(store.getSnapshot().data.profile.totals.answered).toBe(1);
  });

  it('records a confidence rating given after the answer', async () => {
    const store = await freshStore();
    const question = getQuestion('kor-001')!;
    store.startSession({ mode: 'quick', label: 'Test', questionIds: [question.id] }, NOW);
    store.answerSessionQuestion(question.id, question.correctAnswerId, 5000, null, NOW);

    expect(store.getSnapshot().data.answers[0]?.confidence).toBeNull();
    store.setSessionConfidence(question.id, 'guessed');
    expect(store.getSnapshot().data.answers[0]?.confidence).toBe('guessed');
  });

  it('keeps answers when a session is abandoned', async () => {
    const store = await freshStore();
    const question = getQuestion('kor-001')!;
    store.startSession({ mode: 'quick', label: 'Test', questionIds: [question.id] }, NOW);
    store.answerSessionQuestion(question.id, question.correctAnswerId, 5000, 'known', NOW);

    store.abandonSession();
    expect(store.getSnapshot().data.activeSession).toBeNull();
    expect(store.getSnapshot().data.answers).toHaveLength(1);
  });

  it('reports mastery movement over the session', async () => {
    const store = await freshStore();
    const questions = buildQuickSession(emptyContext(), 4, {
      kind: 'subcategory',
      subcategoryId: 'hogerregeln',
    });
    store.startSession(
      { mode: 'quick', label: 'Högerregeln', questionIds: questions.map((q) => q.id) },
      NOW,
    );
    questions.forEach((question, index) => {
      store.answerSessionQuestion(question.id, question.correctAnswerId, 6000, 'known', NOW + index);
    });
    const summary = store.completeSession(NOW + 30_000);
    expect(summary?.masteryDelta['hogerregeln']).toBeGreaterThan(0);
  });

  it('toggles saved questions', async () => {
    const store = await freshStore();
    store.toggleSaved('kor-001');
    expect(store.getSnapshot().data.questionStates['kor-001']?.saved).toBe(true);
    store.toggleSaved('kor-001');
    expect(store.getSnapshot().data.questionStates['kor-001']?.saved).toBe(false);
  });
});

describe('exam', () => {
  it('creates an attempt with the right shape and no feedback data', async () => {
    const store = await freshStore();
    const attempt = store.startExam(NOW);

    expect(attempt.questions).toHaveLength(EXAM.totalQuestions);
    expect(attempt.status).toBe('in-progress');
    expect(store.getActiveExam()?.id).toBe(attempt.id);
    expect(store.getSnapshot().data.profile.totals.examAttempts).toBe(1);
  });

  it('does not feed exam answers into the learning record until submission', async () => {
    const store = await freshStore();
    const attempt = store.startExam(NOW);
    const first = attempt.questions[0]!;
    const question = getQuestion(first.questionId)!;

    store.answerExam(0, question.correctAnswerId, 5000, NOW + 1000);

    // The answer is recorded on the attempt but must not have touched mastery,
    // because that is indistinguishable from giving feedback.
    expect(store.getActiveExam()?.questions[0]?.selectedAnswerId).toBe(question.correctAnswerId);
    expect(store.getSnapshot().data.answers).toHaveLength(0);
    expect(Object.keys(store.getSnapshot().data.mastery)).toHaveLength(0);
  });

  it('folds exam answers into mastery once submitted', async () => {
    const store = await freshStore();
    const attempt = store.startExam(NOW);

    attempt.questions.slice(0, 10).forEach((state, index) => {
      const question = getQuestion(state.questionId)!;
      store.answerExam(index, question.correctAnswerId, 6000, NOW + index);
    });

    const finished = store.finishExam(NOW + 600_000);
    expect(finished?.status).toBe('submitted');
    expect(finished?.result).not.toBeNull();
    expect(store.getSnapshot().data.answers).toHaveLength(10);
    expect(Object.keys(store.getSnapshot().data.mastery).length).toBeGreaterThan(0);
    expect(store.getActiveExam()).toBeNull();
  });

  it('records a pass in the profile totals', async () => {
    const store = await freshStore();
    const attempt = store.startExam(NOW);
    attempt.questions.forEach((state, index) => {
      const question = getQuestion(state.questionId)!;
      store.answerExam(index, question.correctAnswerId, 5000, NOW + index);
    });
    const finished = store.finishExam(NOW + 900_000);

    expect(finished?.result?.passed).toBe(true);
    expect(store.getSnapshot().data.profile.totals.examsPassed).toBe(1);
  });

  it('marks and navigates without leaking correctness', async () => {
    const store = await freshStore();
    store.startExam(NOW);
    store.markExamQuestion(3, NOW);
    expect(store.getActiveExam()?.questions[3]?.marked).toBe(true);

    store.goToExamIndex(69, NOW);
    expect(store.getActiveExam()?.currentIndex).toBe(69);
    store.goToExamIndex(500, NOW);
    expect(store.getActiveExam()?.currentIndex).toBe(EXAM.totalQuestions - 1);
  });

  it('auto-submits when the deadline passes', async () => {
    const store = await freshStore();
    const attempt = store.startExam(NOW);
    const finished = store.enforceExamDeadline(attempt.deadlineAt + 1000);

    expect(finished?.status).toBe('expired');
    expect(finished?.result).not.toBeNull();
    expect(store.getActiveExam()).toBeNull();
  });

  it('does nothing while the deadline has not passed', async () => {
    const store = await freshStore();
    store.startExam(NOW);
    expect(store.enforceExamDeadline(NOW + 60_000)).toBeNull();
    expect(store.getActiveExam()).not.toBeNull();
  });

  it('ignores answers submitted after the deadline', async () => {
    const store = await freshStore();
    const attempt = store.startExam(NOW);
    const question = getQuestion(attempt.questions[0]!.questionId)!;

    store.answerExam(0, question.correctAnswerId, 5000, attempt.deadlineAt + 5000);
    expect(store.getActiveExam()?.questions[0]?.selectedAnswerId).toBeNull();
  });

  it('finalises an exam that expired while the app was closed', async () => {
    const store = await freshStore();
    const attempt = store.startExam(NOW);
    attempt.questions.slice(0, 3).forEach((state, index) => {
      const question = getQuestion(state.questionId)!;
      store.answerExam(index, question.correctAnswerId, 5000, NOW + index);
    });

    // A new store instance stands in for reopening the app much later.
    const reopened = new LearnerStore(NOW);
    await reopened.init(attempt.deadlineAt + 3_600_000);

    const restored = reopened.getSnapshot().data.exams.find((e) => e.id === attempt.id);
    expect(restored?.status).toBe('expired');
    expect(restored?.result).not.toBeNull();
    // The pointer stays so the result is reachable, but nothing is running.
    expect(reopened.getActiveExam()).toBeNull();
  });

  it('resumes an exam that is still running', async () => {
    const store = await freshStore();
    const attempt = store.startExam(NOW);
    store.answerExam(0, getQuestion(attempt.questions[0]!.questionId)!.correctAnswerId, 5000, NOW + 1);
    store.goToExamIndex(12, NOW + 2);

    const reopened = new LearnerStore(NOW);
    await reopened.init(NOW + 120_000);

    const active = reopened.getActiveExam();
    expect(active?.id).toBe(attempt.id);
    expect(active?.currentIndex).toBe(12);
    expect(active?.questions[0]?.selectedAnswerId).not.toBeNull();
    expect(active?.deadlineAt).toBe(attempt.deadlineAt);
  });
});

describe('reset and import', () => {
  it('clears everything and cannot be undone by a later flush', async () => {
    const store = await freshStore();
    const question = getQuestion('kor-001')!;
    store.startSession({ mode: 'quick', label: 'Test', questionIds: [question.id] }, NOW);
    store.answerSessionQuestion(question.id, question.correctAnswerId, 5000, 'known', NOW);
    store.completeSession(NOW + 1000);

    await store.reset(NOW + 2000);
    store.flush();

    expect(store.getSnapshot().data.answers).toHaveLength(0);
    expect(store.getSnapshot().data.profile.totals.answered).toBe(0);
    expect(store.getSnapshot().data.sessions).toHaveLength(0);

    const reopened = new LearnerStore(NOW);
    await reopened.init(NOW + 3000);
    expect(reopened.getSnapshot().data.answers).toHaveLength(0);
  });

  it('records a readiness snapshot at most once per day', async () => {
    const store = await freshStore();
    const questions = buildQuickSession(emptyContext(), 6, { kind: 'all' });
    store.startSession(
      { mode: 'quick', label: 'Test', questionIds: questions.map((q) => q.id) },
      NOW,
    );
    questions.forEach((question, index) => {
      store.answerSessionQuestion(question.id, question.correctAnswerId, 5000, 'known', NOW + index);
    });
    store.completeSession(NOW + 10_000);
    store.recordReadinessSnapshot(NOW + 20_000);

    expect(store.getSnapshot().data.readinessHistory).toHaveLength(1);
  });
});

describe('preferences', () => {
  it('persists a preference change', async () => {
    const store = await freshStore();
    store.setPreferences({ theme: 'dark', textScale: 1.25 });

    expect(store.getSnapshot().data.preferences.theme).toBe('dark');

    const reopened = new LearnerStore(NOW);
    await reopened.init(NOW + 1000);
    expect(reopened.getSnapshot().data.preferences.theme).toBe('dark');
    expect(reopened.getSnapshot().data.preferences.textScale).toBe(1.25);
  });
});
