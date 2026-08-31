import { describe, expect, it } from 'vitest';
import {
  answerQuality,
  applyObservation,
  categoryMastery,
  certainty,
  createMasteryState,
  effectiveMastery,
  learningRate,
  masteryLevel,
  rankWeakAreas,
  responseTimeMultiplier,
} from './mastery';
import { MASTERY } from '@/domain/constants';
import type { MasteryState } from '@/domain/learner/types';

const base = {
  difficulty: 2 as const,
  responseMs: 20_000,
  estimatedTimeSec: 30,
  useResponseTimeSignal: true,
};

describe('answerQuality', () => {
  it('ranks confidence levels correctly for correct answers', () => {
    const known = answerQuality({ ...base, correct: true, confidence: 'known' });
    const uncertain = answerQuality({ ...base, correct: true, confidence: 'uncertain' });
    const guessed = answerQuality({ ...base, correct: true, confidence: 'guessed' });

    expect(known).toBeGreaterThan(uncertain);
    expect(uncertain).toBeGreaterThan(guessed);
  });

  it('treats a confidently wrong answer as the worst possible signal', () => {
    const confidentlyWrong = answerQuality({ ...base, correct: false, confidence: 'known' });
    const guessedWrong = answerQuality({ ...base, correct: false, confidence: 'guessed' });

    expect(confidentlyWrong).toBe(0);
    expect(guessedWrong).toBeGreaterThan(confidentlyWrong);
  });

  it('never lets an incorrect answer outscore a correct one', () => {
    const bestWrong = answerQuality({ ...base, difficulty: 3, correct: false, confidence: 'guessed' });
    const worstRight = answerQuality({ ...base, difficulty: 1, correct: true, confidence: 'guessed' });
    expect(worstRight).toBeGreaterThan(bestWrong);
  });

  it('rewards being right on a hard question more than an easy one', () => {
    const hard = answerQuality({ ...base, difficulty: 3, correct: true, confidence: 'uncertain' });
    const easy = answerQuality({ ...base, difficulty: 1, correct: true, confidence: 'uncertain' });
    expect(hard).toBeGreaterThan(easy);
  });

  it('penalises being wrong on an easy question more than on a hard one', () => {
    const easy = answerQuality({ ...base, difficulty: 1, correct: false, confidence: 'uncertain' });
    const hard = answerQuality({ ...base, difficulty: 3, correct: false, confidence: 'uncertain' });
    expect(easy).toBeLessThan(hard);
  });

  it('stays inside 0–1', () => {
    for (const difficulty of [1, 2, 3] as const) {
      for (const confidence of ['known', 'uncertain', 'guessed', null] as const) {
        for (const correct of [true, false]) {
          const quality = answerQuality({ ...base, difficulty, confidence, correct });
          expect(quality).toBeGreaterThanOrEqual(0);
          expect(quality).toBeLessThanOrEqual(1);
        }
      }
    }
  });
});

describe('responseTimeMultiplier', () => {
  it('slightly damps implausibly fast correct answers', () => {
    expect(responseTimeMultiplier(1500, 30)).toBeLessThan(1);
  });

  it('barely touches slow answers', () => {
    const multiplier = responseTimeMultiplier(200_000, 30);
    expect(multiplier).toBeLessThan(1);
    expect(multiplier).toBeGreaterThan(0.95);
  });

  it('leaves normal pacing untouched', () => {
    expect(responseTimeMultiplier(25_000, 30)).toBe(1);
  });

  it('is skippable so accessibility users are not penalised', () => {
    const withSignal = answerQuality({
      ...base,
      correct: true,
      confidence: 'known',
      responseMs: 500_000,
      useResponseTimeSignal: true,
    });
    const withoutSignal = answerQuality({
      ...base,
      correct: true,
      confidence: 'known',
      responseMs: 500_000,
      useResponseTimeSignal: false,
    });
    expect(withoutSignal).toBeGreaterThan(withSignal);
  });
});

describe('applyObservation', () => {
  it('moves the estimate toward the observed quality', () => {
    const state = createMasteryState('hogerregeln', 'korsningar');
    const next = applyObservation(state, 1, true, 1000);
    expect(next.score).toBeGreaterThan(state.score);
    expect(next.observations).toBe(1);
    expect(next.correct).toBe(1);
  });

  it('does not mutate the input', () => {
    const state = createMasteryState('hogerregeln', 'korsningar');
    const snapshot = { ...state };
    applyObservation(state, 1, true, 1000);
    expect(state).toEqual(snapshot);
  });

  it('converges upward with repeated perfect answers but never exceeds 1', () => {
    let state = createMasteryState('hogerregeln', 'korsningar');
    for (let i = 0; i < 30; i += 1) {
      state = applyObservation(state, 1, true, 1000 + i);
    }
    expect(state.score).toBeGreaterThan(0.95);
    expect(state.score).toBeLessThanOrEqual(1);
  });

  it('drops sharply after confidently wrong answers', () => {
    let state = createMasteryState('hogerregeln', 'korsningar');
    for (let i = 0; i < 10; i += 1) state = applyObservation(state, 1, true, i);
    const before = state.score;
    state = applyObservation(state, 0, false, 100);
    expect(state.score).toBeLessThan(before);
    expect(state.incorrect).toBe(1);
  });

  it('slows down as evidence accumulates', () => {
    expect(learningRate(0)).toBeGreaterThan(learningRate(5));
    expect(learningRate(50)).toBe(MASTERY.alphaFloor);
  });
});

describe('certainty and effective mastery', () => {
  it('grows with observations and stays below 1', () => {
    expect(certainty(0)).toBe(0);
    expect(certainty(3)).toBeGreaterThan(certainty(1));
    expect(certainty(100)).toBeLessThan(1);
  });

  it('discounts an unproven high score', () => {
    const thin: MasteryState = {
      ...createMasteryState('hogerregeln', 'korsningar'),
      score: 0.9,
      observations: 1,
    };
    const solid: MasteryState = { ...thin, observations: 20 };
    expect(effectiveMastery(thin)).toBeLessThan(effectiveMastery(solid));
  });

  it('treats a missing state as zero', () => {
    expect(effectiveMastery(undefined)).toBe(0);
  });
});

describe('masteryLevel', () => {
  it('labels an untouched area rather than calling it weak', () => {
    expect(masteryLevel(undefined)).toBe('untouched');
    expect(masteryLevel(createMasteryState('x', 'korsningar'))).toBe('untouched');
  });

  it('maps scores onto the shared thresholds', () => {
    const make = (score: number): MasteryState => ({
      ...createMasteryState('hogerregeln', 'korsningar'),
      score,
      observations: 5,
    });
    expect(masteryLevel(make(0.3))).toBe('weak');
    expect(masteryLevel(make(0.6))).toBe('developing');
    expect(masteryLevel(make(0.8))).toBe('strong');
    expect(masteryLevel(make(0.95))).toBe('mastered');
  });
});

describe('categoryMastery', () => {
  it('counts covered but unattempted subcategories as zero', () => {
    const partial: Record<string, MasteryState> = {
      hogerregeln: {
        ...createMasteryState('hogerregeln', 'korsningar'),
        score: 1,
        observations: 10,
      },
    };
    const summary = categoryMastery(partial, 'korsningar');
    expect(summary.score).toBeGreaterThan(0);
    expect(summary.score).toBeLessThan(1);
    expect(summary.startedSubcategories).toBe(1);
    expect(summary.totalSubcategories).toBeGreaterThan(1);
  });

  it('returns zero for an untouched category', () => {
    const summary = categoryMastery({}, 'korsningar');
    expect(summary.score).toBe(0);
    expect(summary.startedSubcategories).toBe(0);
  });
});

describe('rankWeakAreas', () => {
  it('puts the weakest area first and is stable', () => {
    const mastery: Record<string, MasteryState> = {
      hogerregeln: {
        ...createMasteryState('hogerregeln', 'korsningar'),
        score: 0.9,
        observations: 10,
      },
      utfartsregeln: {
        ...createMasteryState('utfartsregeln', 'korsningar'),
        score: 0.2,
        observations: 10,
      },
    };
    const ranked = rankWeakAreas(mastery, ['hogerregeln', 'utfartsregeln']);
    expect(ranked[0]?.subcategoryId).toBe('utfartsregeln');
    expect(rankWeakAreas(mastery, ['utfartsregeln', 'hogerregeln'])[0]?.subcategoryId).toBe(
      'utfartsregeln',
    );
  });
});
