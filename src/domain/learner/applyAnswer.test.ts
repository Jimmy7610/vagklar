import { describe, expect, it } from 'vitest';
import { STREAK } from '@/domain/constants';
import { getQuestion } from '@/domain/content/bank';
import { createEmptyLearnerData } from '@/storage/defaults';
import { applyAnswer, nextStreak, snapshotMastery } from './applyAnswer';
import type { AnswerInput } from './applyAnswer';
import type { LearnerData, StreakState } from './types';

const NOW = new Date(2025, 4, 12, 10, 0, 0).getTime();
const DAY = 24 * 60 * 60 * 1000;

function input(overrides: Partial<AnswerInput> = {}): AnswerInput {
  const question = getQuestion('kor-002')!;
  return {
    question,
    selectedAnswerId: question.correctAnswerId,
    confidence: 'known',
    responseMs: 12_000,
    mode: 'training',
    at: NOW,
    answerId: 'answer-1',
    useResponseTimeSignal: true,
    ...overrides,
  };
}

function freshData(): LearnerData {
  return createEmptyLearnerData(NOW - 30 * DAY);
}

describe('applyAnswer', () => {
  it('appends the answer and updates totals', () => {
    const outcome = applyAnswer(freshData(), input());
    expect(outcome.correct).toBe(true);
    expect(outcome.data.answers).toHaveLength(1);
    expect(outcome.data.profile.totals.answered).toBe(1);
    expect(outcome.data.profile.totals.correct).toBe(1);
  });

  it('does not mutate the previous learner data', () => {
    const data = freshData();
    const before = JSON.stringify(data);
    applyAnswer(data, input());
    expect(JSON.stringify(data)).toBe(before);
  });

  it('records the misconception behind a wrong answer', () => {
    const question = getQuestion('kor-002')!;
    const wrong = question.answers.find((a) => a.misconceptionId);
    expect(wrong).toBeDefined();

    const outcome = applyAnswer(
      freshData(),
      input({ selectedAnswerId: wrong!.id, confidence: 'known' }),
    );
    expect(outcome.correct).toBe(false);
    expect(outcome.answer.misconceptionId).toBe(wrong!.misconceptionId);
  });

  it('never tags a correct answer with a misconception', () => {
    const outcome = applyAnswer(freshData(), input());
    expect(outcome.answer.misconceptionId).toBeUndefined();
  });

  it('creates mastery and question state for a first-time subcategory', () => {
    const outcome = applyAnswer(freshData(), input());
    const question = getQuestion('kor-002')!;
    expect(outcome.data.mastery[question.subcategory]).toBeDefined();
    expect(outcome.data.questionStates[question.id]).toBeDefined();
    expect(outcome.masteryAfter).toBeGreaterThan(outcome.masteryBefore);
  });

  it('schedules the question for review', () => {
    const outcome = applyAnswer(freshData(), input());
    const state = outcome.data.questionStates['kor-002'];
    expect(state?.dueAt).not.toBeNull();
    expect(state?.dueAt ?? 0).toBeGreaterThan(NOW);
  });

  it('weights a guessed correct answer lower than a confident one', () => {
    const confident = applyAnswer(freshData(), input({ confidence: 'known' }));
    const guessed = applyAnswer(freshData(), input({ confidence: 'guessed' }));
    expect(confident.masteryAfter).toBeGreaterThan(guessed.masteryAfter);
  });
});

describe('nextStreak', () => {
  const empty: StreakState = {
    current: 0,
    longest: 0,
    lastActiveDate: null,
    questionsToday: 0,
    todayDate: null,
  };

  it('does not count a day until enough questions are answered', () => {
    let streak = empty;
    for (let i = 0; i < STREAK.questionsForActiveDay - 1; i += 1) {
      streak = nextStreak(streak, NOW);
    }
    expect(streak.current).toBe(0);
    expect(streak.questionsToday).toBe(STREAK.questionsForActiveDay - 1);

    streak = nextStreak(streak, NOW);
    expect(streak.current).toBe(1);
    expect(streak.longest).toBe(1);
  });

  it('extends across consecutive days', () => {
    let streak = empty;
    for (let day = 0; day < 3; day += 1) {
      for (let i = 0; i < STREAK.questionsForActiveDay; i += 1) {
        streak = nextStreak(streak, NOW + day * DAY);
      }
    }
    expect(streak.current).toBe(3);
    expect(streak.longest).toBe(3);
  });

  it('resets after a missed day but keeps the record', () => {
    let streak = empty;
    for (let day = 0; day < 3; day += 1) {
      for (let i = 0; i < STREAK.questionsForActiveDay; i += 1) {
        streak = nextStreak(streak, NOW + day * DAY);
      }
    }
    for (let i = 0; i < STREAK.questionsForActiveDay; i += 1) {
      streak = nextStreak(streak, NOW + 6 * DAY);
    }
    expect(streak.current).toBe(1);
    expect(streak.longest).toBe(3);
  });

  it('does not double-count a day', () => {
    let streak = empty;
    for (let i = 0; i < STREAK.questionsForActiveDay * 4; i += 1) {
      streak = nextStreak(streak, NOW);
    }
    expect(streak.current).toBe(1);
  });
});

describe('snapshotMastery', () => {
  it('captures the current score as the baseline for the next session', () => {
    const outcome = applyAnswer(freshData(), input());
    const snapped = snapshotMastery(outcome.data, ['utfartsregeln']);
    const state = snapped.mastery['utfartsregeln'];
    expect(state?.previousScore).toBe(state?.score);
  });

  it('ignores unknown subcategories', () => {
    const data = freshData();
    expect(() => snapshotMastery(data, ['nonexistent'])).not.toThrow();
  });
});
