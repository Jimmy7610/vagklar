import { describe, expect, it } from 'vitest';
import { DAILY_TEN_MIX, SESSION } from '@/domain/constants';
import { QUESTIONS, QUESTIONS_BY_SUBCATEGORY, getQuestion } from '@/domain/content/bank';
import { CATEGORIES, SUBCATEGORY_BY_ID } from '@/content/taxonomy';
import { createMasteryState } from '@/domain/mastery/mastery';
import { createQuestionState } from '@/domain/repetition/repetition';
import {
  buildDailyTen,
  buildLevelTest,
  buildQuickSession,
  dailySeed,
  duePool,
  mistakePool,
  nextBestStep,
  targetDifficulty,
  unseenPool,
  weakPool,
} from './selection';
import type { AnswerRecord, MasteryState, QuestionState } from '@/domain/learner/types';

const NOW = 1_700_000_000_000;
const DAY = 24 * 60 * 60 * 1000;

function emptyContext(overrides: Partial<Parameters<typeof buildDailyTen>[0]> = {}) {
  return {
    mastery: {} as Record<string, MasteryState>,
    questionStates: {} as Record<string, QuestionState>,
    answers: [] as AnswerRecord[],
    now: NOW,
    seed: 12345,
    ...overrides,
  };
}

function answer(questionId: string, correct: boolean, at: number): AnswerRecord {
  const question = getQuestion(questionId)!;
  return {
    id: `ans-${questionId}-${at}`,
    questionId,
    category: question.category,
    subcategory: question.subcategory,
    difficulty: question.difficulty,
    ruleTested: question.ruleTested,
    selectedAnswerId: 'a',
    correct,
    confidence: null,
    responseMs: 9000,
    answeredAt: at,
    mode: 'training',
  };
}

describe('targetDifficulty', () => {
  it('scales with mastery', () => {
    expect(targetDifficulty(0.1)).toBe(1);
    expect(targetDifficulty(0.55)).toBe(2);
    expect(targetDifficulty(0.9)).toBe(3);
  });
});

describe('buildDailyTen', () => {
  it('always produces the configured session size', () => {
    expect(buildDailyTen(emptyContext())).toHaveLength(SESSION.dailyTenSize);
  });

  it('never repeats a question inside one session', () => {
    const ids = buildDailyTen(emptyContext()).map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('is stable for the same seed and differs for another', () => {
    const a = buildDailyTen(emptyContext({ seed: 1 })).map((q) => q.id);
    const b = buildDailyTen(emptyContext({ seed: 1 })).map((q) => q.id);
    const c = buildDailyTen(emptyContext({ seed: 2 })).map((q) => q.id);
    expect(a).toEqual(b);
    expect(a).not.toEqual(c);
  });

  it('does not become a single-subject session', () => {
    const questions = buildDailyTen(emptyContext());
    const subcategories = new Set(questions.map((q) => q.subcategory));
    expect(subcategories.size).toBeGreaterThanOrEqual(4);
  });

  it('pulls in due repetitions when there are any', () => {
    const dueIds = QUESTIONS.slice(0, 6).map((q) => q.id);
    const questionStates: Record<string, QuestionState> = {};
    for (const id of dueIds) {
      const question = getQuestion(id)!;
      questionStates[id] = {
        ...createQuestionState(id, question.subcategory),
        seenCount: 3,
        repetitions: 2,
        dueAt: NOW - 3 * DAY,
        lastAnsweredAt: NOW - 10 * DAY,
      };
    }

    const chosen = buildDailyTen(emptyContext({ questionStates })).map((q) => q.id);
    const overlap = chosen.filter((id) => dueIds.includes(id));
    expect(overlap.length).toBeGreaterThanOrEqual(DAILY_TEN_MIX.dueRepetition);
  });

  it('opens with the easier questions', () => {
    const difficulties = buildDailyTen(emptyContext()).map((q) => q.difficulty);
    const sorted = [...difficulties].sort((a, b) => a - b);
    expect(difficulties).toEqual(sorted);
  });
});

describe('dailySeed', () => {
  it('is stable within a day and changes between days', () => {
    const today = new Date(2025, 4, 12, 9).getTime();
    const laterToday = new Date(2025, 4, 12, 23).getTime();
    const tomorrow = new Date(2025, 4, 13, 9).getTime();

    expect(dailySeed('learner-1', today)).toBe(dailySeed('learner-1', laterToday));
    expect(dailySeed('learner-1', today)).not.toBe(dailySeed('learner-1', tomorrow));
    expect(dailySeed('learner-1', today)).not.toBe(dailySeed('learner-2', today));
  });
});

describe('candidate pools', () => {
  it('ranks the weakest subcategories first', () => {
    const mastery: Record<string, MasteryState> = {
      hogerregeln: {
        ...createMasteryState('hogerregeln', 'korsningar'),
        score: 0.95,
        observations: 20,
      },
      utfartsregeln: {
        ...createMasteryState('utfartsregeln', 'korsningar'),
        score: 0.1,
        observations: 20,
      },
    };
    const pool = weakPool(emptyContext({ mastery }));
    const utfart = pool.filter((c) => c.question.subcategory === 'utfartsregeln');
    const hoger = pool.filter((c) => c.question.subcategory === 'hogerregeln');
    const bestUtfart = Math.max(...utfart.map((c) => c.priority));
    const bestHoger = hoger.length > 0 ? Math.max(...hoger.map((c) => c.priority)) : 0;
    expect(bestUtfart).toBeGreaterThan(bestHoger);
  });

  it('only offers questions that are actually due', () => {
    const questionStates: Record<string, QuestionState> = {
      'kor-001': { ...createQuestionState('kor-001', 'hogerregeln'), dueAt: NOW - DAY },
      'kor-002': { ...createQuestionState('kor-002', 'utfartsregeln'), dueAt: NOW + DAY },
    };
    const pool = duePool(emptyContext({ questionStates }));
    expect(pool.map((c) => c.question.id)).toEqual(['kor-001']);
  });

  it('drops mistakes the learner has since answered right twice', () => {
    const answers = [answer('kor-001', false, NOW - 5 * DAY)];
    const fixed: Record<string, QuestionState> = {
      'kor-001': { ...createQuestionState('kor-001', 'hogerregeln'), streak: 2 },
    };
    expect(mistakePool(emptyContext({ answers }))).toHaveLength(1);
    expect(mistakePool(emptyContext({ answers, questionStates: fixed }))).toHaveLength(0);
  });

  it('prefers a sibling question when the exact item was just seen', () => {
    // kor-002 and kor-003 both test the utfartsregeln.
    const answers = [answer('kor-002', false, NOW - 60_000)];
    const questionStates: Record<string, QuestionState> = {
      'kor-002': {
        ...createQuestionState('kor-002', 'utfartsregeln'),
        lastAnsweredAt: NOW - 60_000,
        seenCount: 1,
      },
    };
    const pool = mistakePool(emptyContext({ answers, questionStates }));
    expect(pool).toHaveLength(1);
    expect(pool[0]?.question.id).not.toBe('kor-002');
    expect(pool[0]?.question.subcategory).toBe('utfartsregeln');
  });

  it('treats every question as unseen for a new learner', () => {
    expect(unseenPool(emptyContext())).toHaveLength(QUESTIONS.length);
  });
});

describe('buildQuickSession', () => {
  it('respects the requested size', () => {
    for (const size of SESSION.quickSizes) {
      expect(buildQuickSession(emptyContext(), size, { kind: 'all' })).toHaveLength(size);
    }
  });

  it('stays inside the chosen category', () => {
    const questions = buildQuickSession(emptyContext(), 10, {
      kind: 'category',
      categoryId: 'korsningar',
    });
    expect(questions.length).toBeGreaterThan(0);
    for (const question of questions) expect(question.category).toBe('korsningar');
  });

  it('stays inside the chosen subcategory', () => {
    const available = QUESTIONS_BY_SUBCATEGORY.get('hogerregeln') ?? [];
    const questions = buildQuickSession(emptyContext(), 5, {
      kind: 'subcategory',
      subcategoryId: 'hogerregeln',
    });
    expect(questions.length).toBe(Math.min(5, available.length));
    for (const question of questions) expect(question.subcategory).toBe('hogerregeln');
  });

  it('returns only saved questions for the saved filter', () => {
    const questionStates: Record<string, QuestionState> = {
      'kor-001': { ...createQuestionState('kor-001', 'hogerregeln'), saved: true },
    };
    const questions = buildQuickSession(emptyContext({ questionStates }), 10, { kind: 'saved' });
    expect(questions.map((q) => q.id)).toEqual(['kor-001']);
  });

  it('returns an empty session rather than throwing when a pool is empty', () => {
    expect(buildQuickSession(emptyContext(), 10, { kind: 'mistakes' })).toEqual([]);
  });
});

describe('buildLevelTest', () => {
  it('covers every category and hits the configured size', () => {
    const questions = buildLevelTest(99);
    expect(questions).toHaveLength(SESSION.levelTestSize);
    const categories = new Set(questions.map((q) => q.category));
    expect(categories.size).toBe(CATEGORIES.length);
  });

  it('is deterministic', () => {
    expect(buildLevelTest(7).map((q) => q.id)).toEqual(buildLevelTest(7).map((q) => q.id));
  });
});

describe('nextBestStep', () => {
  it('suggests a broad start for a brand-new learner', () => {
    const recommendation = nextBestStep(emptyContext());
    expect(recommendation.kind).toBe('level-test');
    expect(recommendation.questionIds.length).toBeGreaterThan(0);
    expect(recommendation.estimatedMinutes).toBeGreaterThan(0);
  });

  it('prioritises a review backlog over new material', () => {
    const questionStates: Record<string, QuestionState> = {};
    for (const question of QUESTIONS.slice(0, 8)) {
      questionStates[question.id] = {
        ...createQuestionState(question.id, question.subcategory),
        seenCount: 2,
        dueAt: NOW - 2 * DAY,
      };
    }
    const recommendation = nextBestStep(
      emptyContext({ questionStates, answers: [answer('kor-001', true, NOW - 3 * DAY)] }),
    );
    expect(recommendation.kind).toBe('due-review');
  });

  it('targets the weakest area once there is enough data', () => {
    const mastery: Record<string, MasteryState> = {
      utfartsregeln: {
        ...createMasteryState('utfartsregeln', 'korsningar'),
        score: 0.15,
        observations: 8,
      },
    };
    const answers = Array.from({ length: 8 }, (_, i) => answer('kor-002', false, NOW - i * DAY));
    const recommendation = nextBestStep(emptyContext({ mastery, answers }));
    expect(['weak-area', 'mistakes']).toContain(recommendation.kind);
    expect(recommendation.questionIds.length).toBeGreaterThan(0);
  });

  it('always returns something actionable', () => {
    for (const seed of [1, 2, 3, 4, 5]) {
      const recommendation = nextBestStep(emptyContext({ seed }));
      expect(recommendation.questionIds.length).toBeGreaterThan(0);
      expect(recommendation.title.length).toBeGreaterThan(0);
      for (const id of recommendation.questionIds) {
        expect(getQuestion(id)).toBeDefined();
      }
    }
  });

  it('names a real subcategory when it recommends one', () => {
    const mastery: Record<string, MasteryState> = {
      utfartsregeln: {
        ...createMasteryState('utfartsregeln', 'korsningar'),
        score: 0.15,
        observations: 8,
      },
    };
    const answers = Array.from({ length: 8 }, (_, i) => answer('kor-002', false, NOW - i * DAY));
    const recommendation = nextBestStep(emptyContext({ mastery, answers }));
    if (recommendation.subcategoryId) {
      expect(SUBCATEGORY_BY_ID.has(recommendation.subcategoryId)).toBe(true);
    }
  });
});
