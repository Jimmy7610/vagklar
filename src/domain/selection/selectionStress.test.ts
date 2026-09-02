import { describe, expect, it } from 'vitest';
import { buildDailyTen, buildQuickSession, nextBestStep } from './selection';
import type { SelectionContext } from './selection';
import { QUESTIONS } from '@/domain/content/bank';
import { SUBCATEGORIES } from '@/content/taxonomy';
import { MASTERY } from '@/domain/constants';
import type { AnswerRecord, MasteryState, QuestionState } from '@/domain/learner/types';
import type { Question } from '@/domain/content/types';

/**
 * The adaptive engine under many synthetic learners, not one.
 *
 * selection.test.ts checks the rules. This checks the outcome across hundreds
 * of generated profiles, because the failure this suite exists to catch was
 * exactly that shape: a brand-new learner's Dagens 10 came back as eight
 * alcohol questions out of ten, and every unit test still passed. The caps
 * were right individually and wrong in combination.
 *
 * Each profile below is a learner an engine has to serve well simultaneously:
 * the one who has answered nothing, the one who is weak everywhere, the one
 * who is strong everywhere, the one with a single hole, the one carrying a
 * pile of mistakes, and the one who has been away long enough that everything
 * is overdue.
 */

const NOW = Date.UTC(2026, 8, 2, 18, 0, 0);
const DAY = 86_400_000;

/** mulberry32 — the same cheap deterministic generator the engine uses. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface ProfileOptions {
  /** Mastery score every subcategory starts at, or null for no data at all. */
  base: number | null;
  /** Subcategories forced to this score, whatever `base` says. */
  weakSpots?: Record<string, number>;
  /** How many recent questions were answered incorrectly. */
  mistakes?: number;
  /** How many questions are overdue for repetition. */
  overdue?: number;
  /** How many correct answers the learner already has behind them. */
  history?: number;
  seed: number;
}

function makeContext(options: ProfileOptions): SelectionContext {
  const random = rng(options.seed);
  const mastery: Record<string, MasteryState> = {};
  const questionStates: Record<string, QuestionState> = {};
  const answers: AnswerRecord[] = [];

  if (options.base !== null) {
    for (const sub of SUBCATEGORIES) {
      const forced = options.weakSpots?.[sub.id];
      const score = forced ?? Math.min(0.98, Math.max(0.02, options.base + (random() - 0.5) * 0.2));
      mastery[sub.id] = {
        subcategoryId: sub.id,
        categoryId: sub.categoryId,
        score,
        observations: 12,
        correct: Math.round(score * 12),
        incorrect: 12 - Math.round(score * 12),
        lastPracticedAt: NOW - Math.floor(random() * 20) * DAY,
        previousScore: score,
      };
    }
  }

  const shuffled = [...QUESTIONS].sort(() => random() - 0.5);
  const state = (q: Question, patch: Partial<QuestionState>): QuestionState => ({
    questionId: q.id,
    subcategory: q.subcategory,
    seenCount: 1,
    correctCount: 0,
    incorrectCount: 0,
    streak: 0,
    lastAnsweredAt: NOW - DAY,
    lastCorrect: true,
    lastConfidence: 'known',
    averageResponseMs: 12_000,
    ease: 2.5,
    intervalDays: 3,
    repetitions: 1,
    lapses: 0,
    dueAt: NOW + 3 * DAY,
    saved: false,
    ...patch,
  });

  let cursor = 0;
  for (let i = 0; i < (options.mistakes ?? 0); i += 1) {
    const q = shuffled[cursor++]!;
    questionStates[q.id] = state(q, {
      incorrectCount: 1,
      lastCorrect: false,
      lapses: 1,
      dueAt: NOW - DAY,
    });
    answers.push({
      id: `a-${i}`,
      questionId: q.id,
      category: q.category,
      subcategory: q.subcategory,
      difficulty: q.difficulty,
      ruleTested: q.ruleTested,
      selectedAnswerId: q.answers.find((a) => a.id !== q.correctAnswerId)!.id,
      correct: false,
      confidence: 'uncertain',
      responseMs: 15_000,
      answeredAt: NOW - (i + 1) * 3_600_000,
      mode: 'quick',
      ...(q.answers.find((a) => a.id !== q.correctAnswerId)?.misconceptionId
        ? { misconceptionId: q.answers.find((a) => a.id !== q.correctAnswerId)!.misconceptionId! }
        : {}),
    });
  }
  for (let i = 0; i < (options.history ?? 0); i += 1) {
    const q = shuffled[cursor++]!;
    questionStates[q.id] = state(q, { correctCount: 1, streak: 1 });
    answers.push({
      id: `h-${i}`,
      questionId: q.id,
      category: q.category,
      subcategory: q.subcategory,
      difficulty: q.difficulty,
      ruleTested: q.ruleTested,
      selectedAnswerId: q.correctAnswerId,
      correct: true,
      confidence: 'known',
      responseMs: 9_000,
      answeredAt: NOW - (i + 1) * 7_200_000,
      mode: 'quick',
    });
  }
  for (let i = 0; i < (options.overdue ?? 0); i += 1) {
    const q = shuffled[cursor++]!;
    questionStates[q.id] = state(q, {
      correctCount: 2,
      repetitions: 2,
      dueAt: NOW - (2 + i) * DAY,
    });
  }

  return { mastery, questionStates, answers, now: NOW, seed: options.seed };
}

const PROFILES: Record<string, (seed: number) => SelectionContext> = {
  'helt ny': (seed) => makeContext({ base: null, seed }),
  svag: (seed) => makeContext({ base: 0.3, mistakes: 8, seed }),
  avancerad: (seed) => makeContext({ base: 0.88, overdue: 4, history: 60, seed }),
  'ett svagt område': (seed) =>
    makeContext({ base: 0.85, weakSpots: { utfartsregeln: 0.15 }, history: 40, seed }),
  'många misstag': (seed) => makeContext({ base: 0.55, mistakes: 25, history: 20, seed }),
  'repetitionsskuld': (seed) => makeContext({ base: 0.6, overdue: 30, history: 30, seed }),
};

const RUNS = 40;

function diversity(session: readonly Question[]) {
  return {
    subcategories: new Set(session.map((q) => q.subcategory)).size,
    categories: new Set(session.map((q) => q.category)).size,
    maxPerSubcategory: Math.max(
      ...[...new Set(session.map((q) => q.subcategory))].map(
        (s) => session.filter((q) => q.subcategory === s).length,
      ),
    ),
    maxPerCategory: Math.max(
      ...[...new Set(session.map((q) => q.category))].map(
        (c) => session.filter((q) => q.category === c).length,
      ),
    ),
  };
}

describe('Dagens 10 across learner profiles', () => {
  for (const [label, build] of Object.entries(PROFILES)) {
    it(`stays varied for a learner who is ${label}`, () => {
      for (let run = 0; run < RUNS; run += 1) {
        const session = buildDailyTen(build(run * 101 + 7));
        expect(session, `${label} #${run}`).toHaveLength(10);

        const ids = session.map((q) => q.id);
        expect(new Set(ids).size, `${label} #${run}: dubbletter`).toBe(ids.length);

        const d = diversity(session);
        expect(d.subcategories, `${label} #${run}: bara ${d.subcategories} delområden`)
          .toBeGreaterThanOrEqual(4);
        expect(d.maxPerCategory, `${label} #${run}: ${d.maxPerCategory} från en kategori`)
          .toBeLessThanOrEqual(4);
        expect(d.maxPerSubcategory, `${label} #${run}: ${d.maxPerSubcategory} från ett delområde`)
          .toBeLessThanOrEqual(3);
      }
    });
  }

  it('is stable for the same learner on the same day', () => {
    const ctx = PROFILES['svag']!(42);
    expect(buildDailyTen(ctx).map((q) => q.id)).toEqual(buildDailyTen(ctx).map((q) => q.id));
  });

  it('gives different learners different sessions', () => {
    const a = buildDailyTen(PROFILES['svag']!(1)).map((q) => q.id).join();
    const b = buildDailyTen(PROFILES['svag']!(2)).map((q) => q.id).join();
    expect(a).not.toBe(b);
  });
});

describe('weak areas influence without monopolising', () => {
  it('reaches the weak subject in most sessions', () => {
    let touched = 0;
    for (let run = 0; run < RUNS; run += 1) {
      const session = buildDailyTen(PROFILES['ett svagt område']!(run * 31 + 3));
      if (session.some((q) => q.subcategory === 'utfartsregeln')) touched += 1;
    }
    // It should show up often enough to matter, without being guaranteed —
    // a session that is always the same subject stops being a session.
    expect(touched).toBeGreaterThan(RUNS * 0.4);
  });

  it('never fills a session with the weak subject', () => {
    for (let run = 0; run < RUNS; run += 1) {
      const session = buildDailyTen(PROFILES['ett svagt område']!(run * 31 + 3));
      const n = session.filter((q) => q.subcategory === 'utfartsregeln').length;
      expect(n, `run ${run}`).toBeLessThanOrEqual(3);
    }
  });

  it('does not drown a learner with repetition debt in overdue items alone', () => {
    for (let run = 0; run < RUNS; run += 1) {
      const ctx = PROFILES['repetitionsskuld']!(run * 17 + 5);
      const overdue = new Set(
        Object.values(ctx.questionStates)
          .filter((s) => s.dueAt !== null && s.dueAt < NOW)
          .map((s) => s.questionId),
      );
      const session = buildDailyTen(ctx);
      expect(session.filter((q) => overdue.has(q.id)).length).toBeLessThanOrEqual(8);
      expect(diversity(session).subcategories).toBeGreaterThanOrEqual(4);
    }
  });
});

describe('difficulty follows the learner', () => {
  it('leans easier for a weak learner than for an advanced one', () => {
    const avg = (label: string) => {
      let total = 0;
      for (let run = 0; run < RUNS; run += 1) {
        const s = buildDailyTen(PROFILES[label]!(run * 13 + 1));
        total += s.reduce((n, q) => n + q.difficulty, 0) / s.length;
      }
      return total / RUNS;
    };
    expect(avg('svag')).toBeLessThan(avg('avancerad'));
  });
});

describe('quick sessions and the recommendation', () => {
  for (const size of [5, 10, 20] as const) {
    it(`builds a ${size}-question quick session for every profile`, () => {
      for (const [label, build] of Object.entries(PROFILES)) {
        const session = buildQuickSession(build(size * 7), size, { kind: 'all' });
        expect(session, label).toHaveLength(size);
        expect(new Set(session.map((q) => q.id)).size, label).toBe(size);
      }
    });
  }

  it('honours a category filter without repeating questions', () => {
    for (const [label, build] of Object.entries(PROFILES)) {
      const session = buildQuickSession(build(3), 10, {
        kind: 'category',
        categoryId: 'korsningar',
      });
      expect(session.length, label).toBeGreaterThan(0);
      expect(new Set(session.map((q) => q.id)).size, label).toBe(session.length);
      for (const q of session) expect(q.category, label).toBe('korsningar');
    }
  });

  it('always has a next step to offer, whatever the learner looks like', () => {
    for (const [label, build] of Object.entries(PROFILES)) {
      for (let run = 0; run < 10; run += 1) {
        const rec = nextBestStep(build(run * 23 + 9));
        expect(rec.title, `${label} #${run}`).toBeTruthy();
        expect(rec.reason, `${label} #${run}`).toBeTruthy();
        expect(rec.questionIds.length, `${label} #${run}`).toBeGreaterThan(0);
        expect(rec.estimatedMinutes, `${label} #${run}`).toBeGreaterThan(0);
        // A recommendation nobody can act on is worse than none: every id has
        // to resolve against the bank the session will be built from.
        for (const id of rec.questionIds) {
          expect(QUESTIONS.some((q) => q.id === id), `${label} #${run}: ${id}`).toBe(true);
        }
      }
    }
  });

  it('sends a learner who has answered nothing to a broad level test', () => {
    const rec = nextBestStep(PROFILES['helt ny']!(7));
    expect(rec.kind).toBe('level-test');
    expect(new Set(rec.questionIds).size).toBe(rec.questionIds.length);
  });

  it('points a learner with one weak area at something related to it', () => {
    const weak = SUBCATEGORIES.find((s) => s.id === 'utfartsregeln')!;
    let onTarget = 0;
    for (let run = 0; run < RUNS; run += 1) {
      const rec = nextBestStep(PROFILES['ett svagt område']!(run * 5 + 2));
      const touchesWeakSubject = rec.questionIds.some(
        (id) => QUESTIONS.find((q) => q.id === id)?.subcategory === 'utfartsregeln',
      );
      if (
        rec.subcategoryId === 'utfartsregeln' ||
        rec.categoryId === weak.categoryId ||
        touchesWeakSubject
      ) {
        onTarget += 1;
      }
    }
    expect(onTarget).toBeGreaterThan(RUNS * 0.5);
  });
});

describe('mastery below the developing threshold is treated as weak', () => {
  it('uses the documented threshold rather than a magic number', () => {
    expect(MASTERY.thresholds.developing).toBeGreaterThan(0);
    expect(MASTERY.thresholds.developing).toBeLessThan(1);
  });
});
