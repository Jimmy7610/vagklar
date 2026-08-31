import { describe, expect, it } from 'vitest';
import { EXAM, READINESS } from '@/domain/constants';
import { COVERED_SUBCATEGORY_IDS } from '@/domain/content/bank';
import { SUBCATEGORY_BY_ID } from '@/content/taxonomy';
import { createMasteryState } from '@/domain/mastery/mastery';
import { computeReadiness, isoDate, readinessBand } from './readiness';
import type {
  AnswerRecord,
  ExamAttempt,
  MasteryState,
  QuestionState,
} from '@/domain/learner/types';

const NOW = 1_700_000_000_000;
const DAY = 24 * 60 * 60 * 1000;

function makeAnswers(count: number, correctRatio: number, spreadDays = 1): AnswerRecord[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `a-${index}`,
    questionId: 'kor-001',
    category: 'korsningar' as const,
    subcategory: 'hogerregeln',
    difficulty: 2 as const,
    ruleTested: 'Högerregeln',
    selectedAnswerId: 'a',
    correct: index < Math.round(count * correctRatio),
    confidence: null,
    responseMs: 10_000,
    answeredAt: NOW - (index % spreadDays) * DAY,
    mode: 'training' as const,
  }));
}

function fullMastery(score: number): Record<string, MasteryState> {
  const mastery: Record<string, MasteryState> = {};
  for (const id of COVERED_SUBCATEGORY_IDS) {
    const meta = SUBCATEGORY_BY_ID.get(id);
    if (!meta) continue;
    mastery[id] = {
      ...createMasteryState(id, meta.categoryId),
      score,
      observations: 25,
      correct: Math.round(25 * score),
      incorrect: 25 - Math.round(25 * score),
      lastPracticedAt: NOW,
    };
  }
  return mastery;
}

function examAttempt(score: number): ExamAttempt {
  return {
    id: 'e1',
    status: 'submitted',
    seed: 1,
    startedAt: NOW - 3600_000,
    deadlineAt: NOW,
    updatedAt: NOW,
    submittedAt: NOW - 60_000,
    currentIndex: 0,
    questions: [],
    result: {
      passed: score >= EXAM.passThreshold,
      score,
      scoredQuestions: EXAM.scoredQuestions,
      passThreshold: EXAM.passThreshold,
      answered: EXAM.totalQuestions,
      unanswered: 0,
      correctIncludingUnscored: score,
      durationMs: 1_500_000,
      byCategory: [],
      unscoredQuestionIds: [],
    },
  };
}

const emptyInput = {
  mastery: {},
  questionStates: {} as Record<string, QuestionState>,
  answers: [] as AnswerRecord[],
  exams: [] as ExamAttempt[],
  createdAt: NOW - 30 * DAY,
  now: NOW,
};

describe('computeReadiness', () => {
  it('returns null for a learner who has answered nothing', () => {
    const result = computeReadiness(emptyInput);
    expect(result.score).toBeNull();
    expect(result.band).toBe('none');
    expect(result.provisional).toBe(true);
  });

  it('is deterministic', () => {
    const input = { ...emptyInput, mastery: fullMastery(0.7), answers: makeAnswers(40, 0.8) };
    expect(computeReadiness(input).score).toBe(computeReadiness(input).score);
  });

  it('caps an early estimate so a handful of answers cannot look like readiness', () => {
    const result = computeReadiness({
      ...emptyInput,
      mastery: fullMastery(1),
      answers: makeAnswers(5, 1),
    });
    expect(result.provisional).toBe(true);
    expect(result.score).toBeLessThanOrEqual(READINESS.provisionalCap);
  });

  it('stops being provisional once enough answers exist', () => {
    const result = computeReadiness({
      ...emptyInput,
      mastery: fullMastery(0.8),
      answers: makeAnswers(READINESS.provisionalAnswerThreshold, 0.8),
    });
    expect(result.provisional).toBe(false);
  });

  it('is not merely correct divided by total', () => {
    // Perfect accuracy but only one subcategory practised.
    const narrow: Record<string, MasteryState> = {
      hogerregeln: {
        ...createMasteryState('hogerregeln', 'korsningar'),
        score: 1,
        observations: 60,
        correct: 60,
      },
    };
    const result = computeReadiness({
      ...emptyInput,
      mastery: narrow,
      answers: makeAnswers(60, 1),
    });
    expect(result.score).not.toBeNull();
    expect(result.score!).toBeLessThan(60);
  });

  it('rewards broad, high mastery', () => {
    const weak = computeReadiness({
      ...emptyInput,
      mastery: fullMastery(0.35),
      answers: makeAnswers(60, 0.4),
    });
    const strong = computeReadiness({
      ...emptyInput,
      mastery: fullMastery(0.95),
      answers: makeAnswers(60, 0.95),
    });
    expect(strong.score!).toBeGreaterThan(weak.score!);
    expect(strong.score!).toBeGreaterThan(60);
  });

  it('drops components that cannot be measured yet instead of scoring them zero', () => {
    const result = computeReadiness({
      ...emptyInput,
      mastery: fullMastery(0.9),
      answers: makeAnswers(40, 0.9),
    });
    const exam = result.components.find((c) => c.key === 'exam');
    expect(exam?.value).toBeNull();

    // A learner with no exam attempts should not be dragged below one who has
    // exactly the same knowledge and a mediocre exam behind them.
    const withPoorExam = computeReadiness({
      ...emptyInput,
      mastery: fullMastery(0.9),
      answers: makeAnswers(40, 0.9),
      exams: [examAttempt(READINESS.examFloorScore)],
    });
    expect(result.score!).toBeGreaterThan(withPoorExam.score!);
  });

  it('lets a strong exam result raise the estimate', () => {
    const without = computeReadiness({
      ...emptyInput,
      mastery: fullMastery(0.7),
      answers: makeAnswers(40, 0.75),
    });
    const withExam = computeReadiness({
      ...emptyInput,
      mastery: fullMastery(0.7),
      answers: makeAnswers(40, 0.75),
      exams: [examAttempt(EXAM.scoredQuestions)],
    });
    expect(withExam.score!).toBeGreaterThan(without.score!);
  });

  it('penalises repeated misconceptions', () => {
    const clean = makeAnswers(40, 0.6);
    const withPattern = clean.map((answer, index) =>
      !answer.correct && index % 2 === 0
        ? { ...answer, misconceptionId: 'utfart-vs-hoger' }
        : answer,
    );

    const a = computeReadiness({ ...emptyInput, mastery: fullMastery(0.7), answers: clean });
    const b = computeReadiness({ ...emptyInput, mastery: fullMastery(0.7), answers: withPattern });

    expect(b.score!).toBeLessThan(a.score!);
    const penalty = b.penalties.find((p) => p.key === 'misconceptions');
    expect(penalty?.amount).toBeGreaterThan(0);
  });

  it('penalises categories that are clearly behind', () => {
    const mastery = fullMastery(0.9);
    for (const id of COVERED_SUBCATEGORY_IDS) {
      const meta = SUBCATEGORY_BY_ID.get(id);
      if (meta?.categoryId === 'korsningar') {
        mastery[id] = { ...mastery[id]!, score: 0.1 };
      }
    }
    const result = computeReadiness({
      ...emptyInput,
      mastery,
      answers: makeAnswers(40, 0.9),
    });
    const penalty = result.penalties.find((p) => p.key === 'weakCategories');
    expect(penalty?.amount).toBeGreaterThan(0);
  });

  it('never leaves the 0–100 range', () => {
    const best = computeReadiness({
      ...emptyInput,
      mastery: fullMastery(1),
      answers: makeAnswers(120, 1, 14),
      exams: [examAttempt(EXAM.scoredQuestions)],
    });
    expect(best.score!).toBeLessThanOrEqual(100);
    expect(best.score!).toBeGreaterThanOrEqual(0);

    const worst = computeReadiness({
      ...emptyInput,
      mastery: fullMastery(0),
      answers: makeAnswers(120, 0),
    });
    expect(worst.score!).toBeGreaterThanOrEqual(0);
  });

  it('exposes every component with its weight for the UI breakdown', () => {
    const result = computeReadiness({
      ...emptyInput,
      mastery: fullMastery(0.6),
      answers: makeAnswers(40, 0.6),
    });
    expect(result.components).toHaveLength(7);
    for (const component of result.components) {
      expect(component.weight).toBeGreaterThan(0);
      expect(component.description.length).toBeGreaterThan(0);
    }
  });
});

describe('readinessBand', () => {
  it('maps scores onto bands, with none for an unmeasured learner', () => {
    expect(readinessBand(null)).toBe('none');
    expect(readinessBand(10)).toBe('early');
    expect(readinessBand(45)).toBe('building');
    expect(readinessBand(65)).toBe('progressing');
    expect(readinessBand(80)).toBe('close');
    expect(readinessBand(90)).toBe('ready');
  });
});

describe('isoDate', () => {
  it('formats a local calendar day', () => {
    expect(isoDate(new Date(2025, 0, 5, 13, 30).getTime())).toBe('2025-01-05');
  });
});
