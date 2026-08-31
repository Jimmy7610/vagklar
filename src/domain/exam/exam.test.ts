import { describe, expect, it } from 'vitest';
import { EXAM } from '@/domain/constants';
import { QUESTION_BY_ID } from '@/domain/content/bank';
import {
  answerExamQuestion,
  answeredCount,
  buildExamQuestions,
  categoryQuota,
  createExamAttempt,
  goToExamQuestion,
  isExpired,
  pickUnscoredIndices,
  remainingMs,
  scoreExam,
  submitExam,
  toggleExamMark,
  unansweredIndices,
} from './exam';
import type { ExamAttempt } from '@/domain/learner/types';

const NOW = 1_700_000_000_000;

function attemptWith(correctCount: number, seed = 42): ExamAttempt {
  const attempt = createExamAttempt(seed, NOW, 'exam-test');
  let remaining = correctCount;
  const questions = attempt.questions.map((state) => {
    const question = QUESTION_BY_ID.get(state.questionId);
    if (!question) return state;
    const wrong = question.answers.find((a) => a.id !== question.correctAnswerId);
    const answerCorrectly = remaining > 0;
    if (answerCorrectly) remaining -= 1;
    return {
      ...state,
      selectedAnswerId: answerCorrectly ? question.correctAnswerId : (wrong?.id ?? null),
      answeredAt: NOW + 1000,
      responseMs: 8000,
    };
  });
  return { ...attempt, questions, submittedAt: NOW + 60_000 };
}

describe('exam construction', () => {
  it('builds exactly the configured number of questions', () => {
    expect(buildExamQuestions(1)).toHaveLength(EXAM.totalQuestions);
  });

  it('never repeats a question inside one attempt', () => {
    const ids = buildExamQuestions(7).map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('is deterministic for a given seed and varies between seeds', () => {
    expect(buildExamQuestions(99).map((q) => q.id)).toEqual(
      buildExamQuestions(99).map((q) => q.id),
    );
    expect(buildExamQuestions(1).map((q) => q.id)).not.toEqual(
      buildExamQuestions(2).map((q) => q.id),
    );
  });

  it('spreads questions across categories in proportion to their weight', () => {
    const quota = categoryQuota(EXAM.totalQuestions);
    const total = Array.from(quota.values()).reduce((sum, n) => sum + n, 0);
    expect(total).toBe(EXAM.totalQuestions);
    // Korsningar carries the highest exam weight, so it must not be starved.
    expect(quota.get('korsningar') ?? 0).toBeGreaterThan(quota.get('miljo') ?? 0);
    for (const count of quota.values()) expect(count).toBeGreaterThan(0);
  });

  it('marks exactly five questions as unscored, deterministically', () => {
    const attempt = createExamAttempt(11, NOW, 'a');
    const unscored = attempt.questions.filter((q) => !q.scored);
    expect(unscored).toHaveLength(EXAM.unscoredQuestions);
    expect(attempt.questions.filter((q) => q.scored)).toHaveLength(EXAM.scoredQuestions);

    const again = pickUnscoredIndices(11, EXAM.totalQuestions);
    expect(Array.from(again).sort()).toEqual(
      Array.from(pickUnscoredIndices(11, EXAM.totalQuestions)).sort(),
    );
  });

  it('sets a deadline of exactly the configured duration', () => {
    const attempt = createExamAttempt(1, NOW, 'a');
    expect(attempt.deadlineAt - attempt.startedAt).toBe(EXAM.durationMs);
    expect(remainingMs(attempt, NOW)).toBe(EXAM.durationMs);
    expect(remainingMs(attempt, NOW + EXAM.durationMs + 5000)).toBe(0);
  });
});

describe('exam interaction', () => {
  it('records an answer without mutating the previous attempt', () => {
    const attempt = createExamAttempt(3, NOW, 'a');
    const next = answerExamQuestion(attempt, 0, 'a', NOW + 100, 4000);
    expect(attempt.questions[0]?.selectedAnswerId).toBeNull();
    expect(next.questions[0]?.selectedAnswerId).toBe('a');
    expect(answeredCount(next)).toBe(1);
  });

  it('keeps the first recorded response time when an answer is changed', () => {
    let attempt = createExamAttempt(3, NOW, 'a');
    attempt = answerExamQuestion(attempt, 0, 'a', NOW + 100, 4000);
    attempt = answerExamQuestion(attempt, 0, 'b', NOW + 200, 90_000);
    expect(attempt.questions[0]?.responseMs).toBe(4000);
    expect(attempt.questions[0]?.selectedAnswerId).toBe('b');
  });

  it('toggles marks and clamps navigation', () => {
    let attempt = createExamAttempt(3, NOW, 'a');
    attempt = toggleExamMark(attempt, 5, NOW);
    expect(attempt.questions[5]?.marked).toBe(true);
    attempt = toggleExamMark(attempt, 5, NOW);
    expect(attempt.questions[5]?.marked).toBe(false);

    expect(goToExamQuestion(attempt, -5, NOW).currentIndex).toBe(0);
    expect(goToExamQuestion(attempt, 999, NOW).currentIndex).toBe(EXAM.totalQuestions - 1);
  });

  it('lists unanswered questions', () => {
    let attempt = createExamAttempt(3, NOW, 'a');
    attempt = answerExamQuestion(attempt, 0, 'a', NOW, 1000);
    expect(unansweredIndices(attempt)).toHaveLength(EXAM.totalQuestions - 1);
  });

  it('expires exactly at the deadline', () => {
    const attempt = createExamAttempt(3, NOW, 'a');
    expect(isExpired(attempt, attempt.deadlineAt - 1)).toBe(false);
    expect(isExpired(attempt, attempt.deadlineAt)).toBe(true);
  });
});

describe('exam scoring', () => {
  it('counts only scored questions toward the result', () => {
    const attempt = attemptWith(EXAM.totalQuestions);
    const result = scoreExam(attempt);
    expect(result.correctIncludingUnscored).toBe(EXAM.totalQuestions);
    expect(result.score).toBe(EXAM.scoredQuestions);
    expect(result.scoredQuestions).toBe(EXAM.scoredQuestions);
  });

  it('passes at the threshold and fails one below it', () => {
    // Build attempts where exactly N scored questions are correct.
    const makeWithScoredCorrect = (scoredCorrect: number): ExamAttempt => {
      const attempt = createExamAttempt(7, NOW, 'x');
      let remaining = scoredCorrect;
      const questions = attempt.questions.map((state) => {
        const question = QUESTION_BY_ID.get(state.questionId)!;
        const wrong = question.answers.find((a) => a.id !== question.correctAnswerId);
        const shouldBeCorrect = state.scored && remaining > 0;
        if (shouldBeCorrect) remaining -= 1;
        return {
          ...state,
          selectedAnswerId: shouldBeCorrect ? question.correctAnswerId : (wrong?.id ?? null),
          answeredAt: NOW,
          responseMs: 5000,
        };
      });
      return { ...attempt, questions, submittedAt: NOW + 1000 };
    };

    expect(scoreExam(makeWithScoredCorrect(EXAM.passThreshold)).passed).toBe(true);
    expect(scoreExam(makeWithScoredCorrect(EXAM.passThreshold)).score).toBe(EXAM.passThreshold);
    expect(scoreExam(makeWithScoredCorrect(EXAM.passThreshold - 1)).passed).toBe(false);
  });

  it('treats unanswered questions as incorrect', () => {
    const attempt = createExamAttempt(5, NOW, 'x');
    const result = scoreExam({ ...attempt, submittedAt: NOW + 1000 });
    expect(result.score).toBe(0);
    expect(result.answered).toBe(0);
    expect(result.unanswered).toBe(EXAM.totalQuestions);
    expect(result.passed).toBe(false);
  });

  it('reports the unscored question ids for transparency after submission', () => {
    const result = scoreExam(attemptWith(10));
    expect(result.unscoredQuestionIds).toHaveLength(EXAM.unscoredQuestions);
  });

  it('produces a category breakdown that adds up to the score', () => {
    const result = scoreExam(attemptWith(40));
    const total = result.byCategory.reduce((sum, c) => sum + c.total, 0);
    const correct = result.byCategory.reduce((sum, c) => sum + c.correct, 0);
    expect(total).toBe(result.scoredQuestions);
    expect(correct).toBe(result.score);
  });
});

describe('submitExam', () => {
  it('finalises a submitted attempt and attaches a result', () => {
    const attempt = attemptWith(60);
    const finished = submitExam(attempt, NOW + 120_000);
    expect(finished.status).toBe('submitted');
    expect(finished.result).not.toBeNull();
    expect(finished.submittedAt).toBe(NOW + 120_000);
  });

  it('never credits time past the deadline when the exam expires', () => {
    const attempt = createExamAttempt(1, NOW, 'a');
    const finished = submitExam(attempt, NOW + EXAM.durationMs + 600_000, 'expired');
    expect(finished.status).toBe('expired');
    expect(finished.submittedAt).toBe(attempt.deadlineAt);
    expect(finished.result?.durationMs).toBe(EXAM.durationMs);
  });
});
