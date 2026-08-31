import { describe, expect, it } from 'vitest';
import { REPETITION } from '@/domain/constants';
import {
  applyAnswerToQuestionState,
  createQuestionState,
  dueQuestionStates,
  gradeFromAnswer,
  isDue,
  nextEase,
  overdueRatio,
  scheduleNext,
} from './repetition';

const DAY = 24 * 60 * 60 * 1000;
const NOW = 1_700_000_000_000;

describe('gradeFromAnswer', () => {
  it('rewards confident correct answers most', () => {
    expect(gradeFromAnswer(true, 'known')).toBe(5);
    expect(gradeFromAnswer(true, 'uncertain')).toBe(4);
    expect(gradeFromAnswer(true, 'guessed')).toBe(3);
  });

  it('treats a confidently wrong answer as the lowest grade', () => {
    expect(gradeFromAnswer(false, 'known')).toBe(0);
    expect(gradeFromAnswer(false, 'guessed')).toBe(1);
  });

  it('defaults to a strong grade when no confidence was given', () => {
    expect(gradeFromAnswer(true, null)).toBe(5);
  });
});

describe('scheduleNext', () => {
  type ScheduleState = { ease: number; intervalDays: number; repetitions: number; lapses: number };
  const fresh: ScheduleState = {
    ease: REPETITION.initialEase,
    intervalDays: 0,
    repetitions: 0,
    lapses: 0,
  };

  it('schedules the first success one day out', () => {
    const result = scheduleNext(fresh, 5, NOW);
    expect(result.intervalDays).toBe(REPETITION.firstIntervalDays);
    expect(result.dueAt).toBe(NOW + REPETITION.firstIntervalDays * DAY);
  });

  it('grows the interval on repeated success', () => {
    let state = fresh;
    const intervals: number[] = [];
    for (let i = 0; i < 5; i += 1) {
      const result = scheduleNext(state, 5, NOW);
      intervals.push(result.intervalDays);
      state = {
        ease: result.ease,
        intervalDays: result.intervalDays,
        repetitions: result.repetitions,
        lapses: result.lapses,
      };
    }
    for (let i = 1; i < intervals.length; i += 1) {
      expect(intervals[i]!).toBeGreaterThan(intervals[i - 1]!);
    }
  });

  it('brings a lapsed item back within the hour and counts the lapse', () => {
    const state = { ease: 2.5, intervalDays: 30, repetitions: 6, lapses: 0 };
    const result = scheduleNext(state, 1, NOW);
    expect(result.repetitions).toBe(0);
    expect(result.lapses).toBe(1);
    expect(result.dueAt).toBe(NOW + REPETITION.lapseIntervalMinutes * 60 * 1000);
  });

  it('schedules a guessed-but-correct answer sooner than a confident one', () => {
    const state = { ease: 2.4, intervalDays: 10, repetitions: 4, lapses: 0 };
    const guessed = scheduleNext(state, 3, NOW);
    const confident = scheduleNext(state, 5, NOW);
    expect(guessed.intervalDays).toBeLessThan(confident.intervalDays);
  });

  it('caps the interval', () => {
    const state = { ease: REPETITION.maxEase, intervalDays: 119, repetitions: 20, lapses: 0 };
    const result = scheduleNext(state, 5, NOW);
    expect(result.intervalDays).toBeLessThanOrEqual(REPETITION.maxIntervalDays);
  });

  it('keeps ease inside its bounds', () => {
    let ease: number = REPETITION.initialEase;
    for (let i = 0; i < 20; i += 1) ease = nextEase(ease, 0);
    expect(ease).toBe(REPETITION.minEase);

    for (let i = 0; i < 40; i += 1) ease = nextEase(ease, 5);
    expect(ease).toBeLessThanOrEqual(REPETITION.maxEase);
  });

  it('is deterministic', () => {
    const a = scheduleNext(fresh, 4, NOW);
    const b = scheduleNext(fresh, 4, NOW);
    expect(a).toEqual(b);
  });
});

describe('applyAnswerToQuestionState', () => {
  it('accumulates counts and streaks', () => {
    let state = createQuestionState('kor-001', 'hogerregeln');
    state = applyAnswerToQuestionState(state, {
      correct: true,
      confidence: 'known',
      responseMs: 5000,
      at: NOW,
    });
    state = applyAnswerToQuestionState(state, {
      correct: true,
      confidence: 'known',
      responseMs: 7000,
      at: NOW + 1000,
    });

    expect(state.seenCount).toBe(2);
    expect(state.correctCount).toBe(2);
    expect(state.streak).toBe(2);
    expect(state.averageResponseMs).toBe(6000);
  });

  it('resets the streak on an incorrect answer', () => {
    let state = createQuestionState('kor-001', 'hogerregeln');
    state = applyAnswerToQuestionState(state, {
      correct: true,
      confidence: 'known',
      responseMs: 5000,
      at: NOW,
    });
    state = applyAnswerToQuestionState(state, {
      correct: false,
      confidence: 'known',
      responseMs: 5000,
      at: NOW + 1,
    });
    expect(state.streak).toBe(0);
    expect(state.lapses).toBe(1);
  });
});

describe('due tracking', () => {
  it('reports an item as due once its interval elapses', () => {
    const state = { ...createQuestionState('q', 's'), dueAt: NOW };
    expect(isDue(state, NOW - 1)).toBe(false);
    expect(isDue(state, NOW)).toBe(true);
  });

  it('never treats an unscheduled item as due', () => {
    expect(isDue(createQuestionState('q', 's'), NOW)).toBe(false);
    expect(isDue(undefined, NOW)).toBe(false);
  });

  it('orders due items by how overdue they are', () => {
    const states = {
      a: { ...createQuestionState('a', 's'), dueAt: NOW - DAY },
      b: { ...createQuestionState('b', 's'), dueAt: NOW - 10 * DAY },
      c: { ...createQuestionState('c', 's'), dueAt: NOW + DAY },
    };
    const due = dueQuestionStates(states, NOW);
    expect(due.map((s) => s.questionId)).toEqual(['b', 'a']);
  });

  it('computes the overdue ratio over scheduled items only', () => {
    const states = {
      a: { ...createQuestionState('a', 's'), dueAt: NOW - DAY },
      b: { ...createQuestionState('b', 's'), dueAt: NOW + DAY },
      c: createQuestionState('c', 's'),
    };
    expect(overdueRatio(states, NOW)).toBe(0.5);
    expect(overdueRatio({}, NOW)).toBe(0);
  });
});
