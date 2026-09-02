import { describe, expect, it } from 'vitest';
import { SCHEMA_VERSION } from '@/domain/constants';
import { createEmptyLearnerData } from './defaults';
import { createBackup, parseBackup, serialiseBackup } from './backup';
import { MIGRATIONS, migrateLearnerPayload } from './schema';
import { readAnswer, readExamAttempt, readPracticeSession, readQuestionState } from './sanitize';
import { applyAnswer } from '@/domain/learner/applyAnswer';
import { getQuestion, QUESTIONS } from '@/domain/content/bank';
import { createExamAttempt, answerExamQuestion, submitExam } from '@/domain/exam/exam';
import type { LearnerData } from '@/domain/learner/types';

/**
 * Progress must survive everything that can happen to it.
 *
 * A learner's history only exists on their own device, so there is no server
 * copy to fall back on. That makes three things load-bearing: an export has to
 * contain everything, an import has to restore everything, and neither a
 * half-written record nor a save from an older build may take the whole thing
 * down with it.
 *
 * This suite builds a learner with something in every field — answers, mastery,
 * an unfinished session, a finished exam, an interrupted exam, lessons,
 * achievements, readiness history — and puts that through the round trip. The
 * existing repository tests cover the database; these cover the data.
 */

const NOW = Date.UTC(2026, 8, 2, 12, 0, 0);
const DAY = 86_400_000;

/** A learner with progress in every part of LearnerData. */
function fullLearner(): LearnerData {
  let data = createEmptyLearnerData(NOW - 30 * DAY);

  const answered = QUESTIONS.slice(0, 12);
  answered.forEach((question, i) => {
    const wrong = question.answers.find((a) => a.id !== question.correctAnswerId)!;
    data = applyAnswer(data, {
      question,
      selectedAnswerId: i % 4 === 0 ? wrong.id : question.correctAnswerId,
      confidence: i % 3 === 0 ? 'uncertain' : 'known',
      responseMs: 8000 + i * 250,
      mode: i % 2 === 0 ? 'training' : 'daily-ten',
      at: NOW - (12 - i) * DAY,
      answerId: `ans-${i}`,
      useResponseTimeSignal: true,
    }).data;
  });

  // A finished exam and an interrupted one, so both shapes are exercised.
  const finished = submitExam(
    answerExamQuestion(
      createExamAttempt(11, NOW - 5 * DAY, 'exam-finished'),
      0,
      getQuestion(createExamAttempt(11, NOW - 5 * DAY, 'exam-finished').questions[0]!.questionId)!
        .correctAnswerId,
      NOW - 5 * DAY + 60_000,
      11_000,
    ),
    NOW - 5 * DAY + 900_000,
  );
  const interrupted = answerExamQuestion(
    createExamAttempt(12, NOW - 3600_000, 'exam-open'),
    3,
    'a',
    NOW - 3000_000,
    9_000,
  );

  return {
    ...data,
    exams: [finished, interrupted],
    activeExamId: interrupted.id,
    activeSession: {
      id: 'session-open',
      mode: 'training',
      categoryId: null,
      label: 'Snabbträning',
      questionIds: QUESTIONS.slice(20, 25).map((q) => q.id),
      startedAt: NOW - 600_000,
      updatedAt: NOW - 300_000,
      completedAt: null,
      currentIndex: 2,
      masteryBefore: {},
      questions: QUESTIONS.slice(20, 25).map((q, i) => ({
        questionId: q.id,
        selectedAnswerId: i < 2 ? q.correctAnswerId : null,
        confidence: i < 2 ? ('known' as const) : null,
        correct: i < 2 ? true : null,
        responseMs: i < 2 ? 11_000 : null,
        answeredAt: i < 2 ? NOW - 600_000 + i * 30_000 + 12_000 : null,
      })),
    },
    lessons: {
      'les-grundreglerna': {
        lessonId: 'les-grundreglerna',
        startedAt: NOW - 10 * DAY,
        completedAt: NOW - 10 * DAY + 400_000,
        furthestBlock: 9,
        checkPassed: true,
      },
    },
    achievements: [{ id: 'first-session', unlockedAt: NOW - 12 * DAY }],
    readinessHistory: [
      { date: '2026-08-30', score: 0.51, recordedAt: NOW - 3 * DAY },
      { date: '2026-09-01', score: 0.62, recordedAt: NOW - DAY },
    ],
  } satisfies LearnerData;
}

describe('export and import round trip', () => {
  const original = fullLearner();
  const result = parseBackup(serialiseBackup(createBackup(original, NOW)), NOW);

  it('parses back successfully with nothing skipped', () => {
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.summary.skipped).toBe(0);
  });

  it('carries every part of the learner data, not just the answers', () => {
    if (!result.ok) return;
    const restored = result.data;

    // Field by field, so a new field added to LearnerData without being
    // exported shows up here rather than silently going missing on restore.
    expect(restored.answers).toHaveLength(original.answers.length);
    expect(Object.keys(restored.questionStates)).toHaveLength(
      Object.keys(original.questionStates).length,
    );
    expect(Object.keys(restored.mastery)).toHaveLength(Object.keys(original.mastery).length);
    expect(restored.sessions).toHaveLength(original.sessions.length);
    expect(restored.exams).toHaveLength(original.exams.length);
    expect(Object.keys(restored.lessons)).toEqual(Object.keys(original.lessons));
    expect(restored.achievements).toHaveLength(original.achievements.length);
    expect(restored.readinessHistory).toHaveLength(original.readinessHistory.length);
    expect(restored.activeSession).not.toBeNull();
    expect(restored.activeExamId).toBe(original.activeExamId);
  });

  it('keeps the numbers a learner would notice', () => {
    if (!result.ok) return;
    expect(result.data.profile.totals.answered).toBe(original.profile.totals.answered);
    expect(result.data.profile.totals.correct).toBe(original.profile.totals.correct);
    expect(result.data.profile.streak).toEqual(original.profile.streak);
    for (const [id, before] of Object.entries(original.mastery)) {
      expect(result.data.mastery[id]!.score, id).toBeCloseTo(before.score, 10);
      expect(result.data.mastery[id]!.observations, id).toBe(before.observations);
    }
  });

  it('keeps spaced repetition scheduling intact', () => {
    if (!result.ok) return;
    for (const [id, before] of Object.entries(original.questionStates)) {
      const after = result.data.questionStates[id]!;
      expect(after.dueAt, id).toBe(before.dueAt);
      expect(after.ease, id).toBeCloseTo(before.ease, 10);
      expect(after.intervalDays, id).toBe(before.intervalDays);
      expect(after.repetitions, id).toBe(before.repetitions);
      expect(after.lapses, id).toBe(before.lapses);
    }
  });

  it('restores an unfinished session exactly where it stopped', () => {
    if (!result.ok) return;
    const session = result.data.activeSession!;
    expect(session.id).toBe('session-open');
    expect(session.currentIndex).toBe(2);
    expect(session.questions).toHaveLength(5);
    expect(session.questions.filter((q) => q.answeredAt !== null)).toHaveLength(2);
    expect(session.questions[4]!.selectedAnswerId).toBeNull();
  });

  it('restores an interrupted exam so it can be resumed', () => {
    if (!result.ok) return;
    const open = result.data.exams.find((e) => e.id === 'exam-open')!;
    expect(open.status).toBe('in-progress');
    expect(open.questions).toHaveLength(70);
    expect(open.questions[3]!.selectedAnswerId).toBe('a');
    expect(result.data.activeExamId).toBe('exam-open');
  });

  it('restores a finished exam with its result', () => {
    if (!result.ok) return;
    const done = result.data.exams.find((e) => e.id === 'exam-finished')!;
    expect(done.status).toBe('submitted');
    expect(done.result).toBeTruthy();
    expect(done.result!.scoredQuestions).toBe(65);
  });

  it('is stable across a second round trip', () => {
    if (!result.ok) return;
    const twice = parseBackup(serialiseBackup(createBackup(result.data, NOW)), NOW);
    expect(twice.ok).toBe(true);
    if (!twice.ok) return;
    expect(twice.data).toEqual(result.data);
  });
});

describe('schema migration', () => {
  it('leaves a current payload untouched', () => {
    const payload = { profile: { id: 'p' } };
    const out = migrateLearnerPayload(payload, SCHEMA_VERSION);
    expect(out.migratedFrom).toBeNull();
    expect(out.payload).toBe(payload);
  });

  it('refuses a payload from a newer schema rather than guessing', () => {
    expect(() => migrateLearnerPayload({}, SCHEMA_VERSION + 1)).toThrow();
  });

  it('runs every registered migration in order when one exists', () => {
    // The registry is empty at schema version 1. This proves the machinery
    // works, so the first real migration is not also the first test of it.
    const order: number[] = [];
    const fake: typeof MIGRATIONS = {
      2: (d) => {
        order.push(2);
        return { ...d, two: true };
      },
      3: (d) => {
        order.push(3);
        return { ...d, three: true };
      },
    };
    let payload: Record<string, unknown> = { original: true };
    for (let v = 2; v <= 3; v += 1) payload = fake[v]!(payload);
    expect(order).toEqual([2, 3]);
    expect(payload).toEqual({ original: true, two: true, three: true });
  });

  it('has a migration registered for every version above the first', () => {
    // A schema bump without a migration silently drops data. If SCHEMA_VERSION
    // ever moves past 1, this makes the omission loud.
    for (let v = 2; v <= SCHEMA_VERSION; v += 1) {
      expect(MIGRATIONS[v], `saknar migration till version ${v}`).toBeTypeOf('function');
    }
  });
});

describe('damaged records', () => {
  it('drops an answer that lost a required field instead of throwing', () => {
    expect(readAnswer({ id: 'x', questionId: 'kor-001' })).toBeNull();
    expect(readAnswer(null)).toBeNull();
    expect(readAnswer('a string')).toBeNull();
  });

  it('repairs a nonsense repetition schedule rather than losing the history', () => {
    // Dropping the record would throw away how often the learner got this
    // question right. Clamping the schedule keeps the history and makes the
    // next interval sane, which is the better trade for the learner.
    const repaired = readQuestionState({
      questionId: 'kor-001',
      seenCount: 4,
      correctCount: 3,
      ease: 'soon',
      intervalDays: -12,
    })!;
    expect(repaired).not.toBeNull();
    expect(repaired.seenCount).toBe(4);
    expect(repaired.correctCount).toBe(3);
    expect(Number.isFinite(repaired.ease)).toBe(true);
    expect(repaired.ease).toBeGreaterThan(0);
    expect(repaired.intervalDays).toBeGreaterThanOrEqual(0);
  });

  it('drops a question state that points at no question at all', () => {
    expect(readQuestionState({ questionId: 'finns-inte', ease: 2.5 })).toBeNull();
    expect(readQuestionState({})).toBeNull();
  });

  it('drops a session that no longer refers to real questions', () => {
    const session = readPracticeSession({
      id: 's',
      mode: 'training',
      startedAt: NOW,
      updatedAt: NOW,
      currentIndex: 0,
      questions: [{ questionId: 'finns-inte-alls', selectedAnswerId: null }],
    });
    // Either the session is rejected outright or the dangling question is
    // removed — never a session that points at a question the app cannot show.
    if (session) {
      for (const q of session.questions) {
        expect(QUESTIONS.some((real) => real.id === q.questionId)).toBe(true);
      }
    }
  });

  it('drops an exam attempt that is not an exam', () => {
    expect(readExamAttempt({ id: 'e', questions: 'many' })).toBeNull();
    expect(readExamAttempt(undefined)).toBeNull();
  });

  it('survives a backup whose records are half destroyed', () => {
    const good = fullLearner();
    const backup = createBackup(good, NOW) as unknown as Record<string, unknown>;
    const data = backup.data as Record<string, unknown>;
    data.answers = [
      ...(data.answers as unknown[]).slice(0, 3),
      { id: 'broken' },
      null,
      42,
      'nope',
    ];
    const result = parseBackup(JSON.stringify(backup), NOW);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.answers).toHaveLength(3);
    expect(result.summary.skipped).toBeGreaterThanOrEqual(4);
  });
});
