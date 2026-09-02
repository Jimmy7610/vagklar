import { describe, expect, it } from 'vitest';
import {
  answerExamQuestion,
  buildExamQuestions,
  createExamAttempt,
  goToExamQuestion,
  isExpired,
  markedCount,
  remainingMs,
  scoreExam,
  submitExam,
  toggleExamMark,
  unansweredIndices,
} from './exam';
import { EXAM } from '@/domain/constants';
import { getQuestion } from '@/domain/content/bank';
import { CATEGORIES } from '@/content/taxonomy';
import type { ExamAttempt } from '@/domain/learner/types';

/**
 * The exam as a learner actually meets it, start to finish.
 *
 * exam.test.ts covers the pieces. This covers the journey: sit down, answer
 * seventy questions across a fifty-minute clock, mark a few to come back to,
 * lose the tab, resume exactly where you were, submit, and get a result that
 * adds up. Each of those steps is fine on its own and the sequence is where
 * a mistake would actually reach someone taking a mock test.
 */

const START = Date.UTC(2026, 8, 2, 9, 0, 0);
const minutes = (n: number) => n * 60_000;

function freshAttempt(seed = 4711): ExamAttempt {
  return createExamAttempt(seed, START, `attempt-${seed}`);
}

/** Answer every question, getting `correct` of the scored ones right. */
function answerAll(attempt: ExamAttempt, correct: number, now = START): ExamAttempt {
  let current = attempt;
  let given = 0;
  for (let i = 0; i < current.questions.length; i += 1) {
    const state = current.questions[i]!;
    const question = getQuestion(state.questionId)!;
    const wantCorrect = state.scored ? given < correct : false;
    if (state.scored && wantCorrect) given += 1;
    const wrong = question.answers.find((a) => a.id !== question.correctAnswerId)!;
    current = answerExamQuestion(
      current,
      i,
      wantCorrect ? question.correctAnswerId : wrong.id,
      now,
      10_000,
    );
  }
  return current;
}

describe('exam end to end', () => {
  it('builds a full-length attempt with no repeated question', () => {
    const attempt = freshAttempt();
    expect(attempt.questions).toHaveLength(EXAM.totalQuestions);
    const ids = attempt.questions.map((q) => q.questionId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('marks exactly the configured number of questions as unscored', () => {
    const attempt = freshAttempt();
    const unscored = attempt.questions.filter((q) => !q.scored);
    expect(unscored).toHaveLength(EXAM.unscoredQuestions);
    expect(attempt.questions.filter((q) => q.scored)).toHaveLength(EXAM.scoredQuestions);
  });

  it('starts with a fifty-minute clock that has not expired', () => {
    const attempt = freshAttempt();
    expect(remainingMs(attempt, START)).toBe(minutes(EXAM.durationMinutes));
    expect(isExpired(attempt, START)).toBe(false);
    expect(isExpired(attempt, START + minutes(EXAM.durationMinutes) + 1)).toBe(true);
  });

  it('never reveals whether an answer was right while the attempt is open', () => {
    // The attempt carries no correctness anywhere until it is submitted; the
    // runner therefore cannot leak feedback even by accident.
    const attempt = answerExamQuestion(freshAttempt(), 0, 'a', START + 1000, 10_000);
    expect(attempt.result ?? null).toBeNull();
    expect(JSON.stringify(attempt)).not.toMatch(/"correct"|"passed"|"score"/);
  });

  it('keeps every answer through navigation back and forth', () => {
    let attempt = freshAttempt();
    const first = getQuestion(attempt.questions[0]!.questionId)!;
    const tenth = getQuestion(attempt.questions[9]!.questionId)!;

    attempt = answerExamQuestion(attempt, 0, first.correctAnswerId, START + 1000, 10_000);
    attempt = goToExamQuestion(attempt, 9, START + 2000);
    attempt = answerExamQuestion(attempt, 9, tenth.correctAnswerId, START + 3000, 10_000);
    attempt = goToExamQuestion(attempt, 0, START + 4000);

    expect(attempt.currentIndex).toBe(0);
    expect(attempt.questions[0]!.selectedAnswerId).toBe(first.correctAnswerId);
    expect(attempt.questions[9]!.selectedAnswerId).toBe(tenth.correctAnswerId);
  });

  it('lets an answer be changed before submitting', () => {
    let attempt = freshAttempt();
    const q = getQuestion(attempt.questions[3]!.questionId)!;
    const other = q.answers.find((a) => a.id !== q.correctAnswerId)!;
    attempt = answerExamQuestion(attempt, 3, other.id, START + 1000, 10_000);
    attempt = answerExamQuestion(attempt, 3, q.correctAnswerId, START + 2000, 10_000);
    expect(attempt.questions[3]!.selectedAnswerId).toBe(q.correctAnswerId);
  });

  it('marks questions to return to, and finds them again', () => {
    let attempt = freshAttempt();
    attempt = toggleExamMark(attempt, 5, START + 1000);
    attempt = toggleExamMark(attempt, 40, START + 2000);
    expect(markedCount(attempt)).toBe(2);
    expect(attempt.questions[5]!.marked).toBe(true);
    expect(attempt.questions[40]!.marked).toBe(true);

    attempt = toggleExamMark(attempt, 5, START + 3000);
    expect(markedCount(attempt)).toBe(1);
    expect(attempt.questions[40]!.marked).toBe(true);
  });

  it('lists what is still unanswered before submission', () => {
    let attempt = freshAttempt();
    const q = getQuestion(attempt.questions[2]!.questionId)!;
    attempt = answerExamQuestion(attempt, 2, q.correctAnswerId, START + 1000, 10_000);
    const open = unansweredIndices(attempt);
    expect(open).toHaveLength(EXAM.totalQuestions - 1);
    expect(open).not.toContain(2);
  });

  it('resumes exactly where the learner left off after a reload', () => {
    let attempt = freshAttempt();
    attempt = answerExamQuestion(
      attempt,
      0,
      getQuestion(attempt.questions[0]!.questionId)!.correctAnswerId,
      START + 1000,
      10_000,
    );
    attempt = toggleExamMark(attempt, 7, START + 2000);
    attempt = goToExamQuestion(attempt, 7, START + 3000);

    // A reload is a JSON round trip through storage and nothing else.
    const resumed = JSON.parse(JSON.stringify(attempt)) as ExamAttempt;

    expect(resumed).toEqual(attempt);
    expect(resumed.currentIndex).toBe(7);
    expect(resumed.questions[7]!.marked).toBe(true);
    expect(resumed.questions[0]!.selectedAnswerId).not.toBeNull();
    // The clock keeps running across the reload — it is wall time, not a stopwatch.
    expect(remainingMs(resumed, START + minutes(10))).toBe(minutes(40));
  });

  it('passes at exactly the threshold and fails one below it', () => {
    const pass = submitExam(answerAll(freshAttempt(), EXAM.passThreshold), START + minutes(30));
    expect(pass.result!.score).toBe(EXAM.passThreshold);
    expect(pass.result!.passed).toBe(true);

    const fail = submitExam(answerAll(freshAttempt(), EXAM.passThreshold - 1), START + minutes(30));
    expect(fail.result!.score).toBe(EXAM.passThreshold - 1);
    expect(fail.result!.passed).toBe(false);
  });

  it('scores out of 65, not 70 — the unscored items never count', () => {
    const attempt = freshAttempt();
    // Get every unscored item right and every scored item wrong.
    let current = attempt;
    for (let i = 0; i < current.questions.length; i += 1) {
      const state = current.questions[i]!;
      const q = getQuestion(state.questionId)!;
      const wrong = q.answers.find((a) => a.id !== q.correctAnswerId)!;
      current = answerExamQuestion(
        current,
        i,
        state.scored ? wrong.id : q.correctAnswerId,
        START + 1000,
        10_000,
      );
    }
    const result = scoreExam(submitExam(current, START + minutes(20)));
    expect(result.score).toBe(0);
    expect(result.scoredQuestions).toBe(EXAM.scoredQuestions);
    expect(result.correctIncludingUnscored).toBe(EXAM.unscoredQuestions);
    expect(result.unscoredQuestionIds).toHaveLength(EXAM.unscoredQuestions);
  });

  it('reports a category breakdown that adds up to the score', () => {
    const submitted = submitExam(answerAll(freshAttempt(), 55), START + minutes(30));
    const result = submitted.result!;
    const total = result.byCategory.reduce((n, c) => n + c.total, 0);
    const correct = result.byCategory.reduce((n, c) => n + c.correct, 0);
    expect(total).toBe(result.scoredQuestions);
    expect(correct).toBe(result.score);
    for (const c of result.byCategory) {
      expect(CATEGORIES.some((cat) => cat.id === c.categoryId)).toBe(true);
      expect(c.correct).toBeLessThanOrEqual(c.total);
    }
  });

  it('counts unanswered questions as wrong rather than skipping them', () => {
    const submitted = submitExam(freshAttempt(), START + minutes(30));
    expect(submitted.result!.answered).toBe(0);
    expect(submitted.result!.unanswered).toBe(EXAM.totalQuestions);
    expect(submitted.result!.score).toBe(0);
    expect(submitted.result!.passed).toBe(false);
  });

  it('clamps a timed-out attempt to the deadline instead of the moment it was noticed', () => {
    const attempt = freshAttempt();
    const late = submitExam(attempt, START + minutes(70), 'expired');
    expect(late.status).toBe('expired');
    expect(late.submittedAt).toBe(attempt.deadlineAt);
    expect(late.result!.durationMs).toBe(minutes(EXAM.durationMinutes));
  });

  it('gives a new attempt different questions from the last one', () => {
    const first = new Set<string>(freshAttempt(1).questions.map((q) => q.questionId));
    const second: string[] = freshAttempt(2).questions.map((q) => q.questionId);
    const overlap = second.filter((id: string) => first.has(id)).length;
    expect(overlap).toBeLessThan(EXAM.totalQuestions);
  });

  it('is deterministic for a given seed', () => {
    expect(buildExamQuestions(99).map((q) => q.id)).toEqual(buildExamQuestions(99).map((q) => q.id));
  });
});
