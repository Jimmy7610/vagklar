import { STREAK } from '@/domain/constants';
import type { Question } from '@/domain/content/types';
import { SUBCATEGORY_BY_ID } from '@/content/taxonomy';
import { answerQuality, applyObservation, createMasteryState } from '@/domain/mastery/mastery';
import { applyAnswerToQuestionState, createQuestionState } from '@/domain/repetition/repetition';
import { isoDate } from '@/domain/readiness/readiness';
import type {
  AnswerRecord,
  Confidence,
  LearnerData,
  PracticeMode,
  StreakState,
} from './types';

/**
 * Fold one answer into the learner record.
 *
 * Pure: takes the current data and returns new data plus the record that was
 * appended and the mastery movement it caused. The React layer is responsible
 * only for calling this and persisting the result.
 */

export interface AnswerInput {
  question: Question;
  selectedAnswerId: string;
  confidence: Confidence | null;
  responseMs: number;
  mode: PracticeMode;
  at: number;
  answerId: string;
  attemptId?: string;
  /** Mirrors Preferences.useResponseTimeSignal. */
  useResponseTimeSignal: boolean;
}

export interface AnswerOutcome {
  data: LearnerData;
  answer: AnswerRecord;
  correct: boolean;
  /** Mastery before and after for the touched subcategory. */
  masteryBefore: number;
  masteryAfter: number;
}

export function nextStreak(streak: StreakState, at: number): StreakState {
  const today = isoDate(at);
  const questionsToday = streak.todayDate === today ? streak.questionsToday + 1 : 1;

  // The day only counts once enough questions have been answered.
  if (questionsToday < STREAK.questionsForActiveDay) {
    return { ...streak, todayDate: today, questionsToday };
  }

  if (streak.lastActiveDate === today) {
    return { ...streak, todayDate: today, questionsToday };
  }

  const yesterday = isoDate(at - 24 * 60 * 60 * 1000);
  const current = streak.lastActiveDate === yesterday ? streak.current + 1 : 1;

  return {
    current,
    longest: Math.max(streak.longest, current),
    lastActiveDate: today,
    todayDate: today,
    questionsToday,
  };
}

export function applyAnswer(data: LearnerData, input: AnswerInput): AnswerOutcome {
  const { question } = input;
  const correct = input.selectedAnswerId === question.correctAnswerId;

  const chosen = question.answers.find((a) => a.id === input.selectedAnswerId);
  const misconceptionId = !correct ? chosen?.misconceptionId : undefined;

  const answer: AnswerRecord = {
    id: input.answerId,
    questionId: question.id,
    category: question.category,
    subcategory: question.subcategory,
    difficulty: question.difficulty,
    ruleTested: question.ruleTested,
    selectedAnswerId: input.selectedAnswerId,
    correct,
    confidence: input.confidence,
    responseMs: Math.max(0, input.responseMs),
    answeredAt: input.at,
    mode: input.mode,
  };
  if (misconceptionId) answer.misconceptionId = misconceptionId;
  if (input.attemptId) answer.attemptId = input.attemptId;

  /* Question state + spaced repetition ------------------------------- */
  const previousQuestionState =
    data.questionStates[question.id] ?? createQuestionState(question.id, question.subcategory);
  const questionState = applyAnswerToQuestionState(previousQuestionState, {
    correct,
    confidence: input.confidence,
    responseMs: answer.responseMs,
    at: input.at,
  });

  /* Mastery ----------------------------------------------------------- */
  const categoryId = SUBCATEGORY_BY_ID.get(question.subcategory)?.categoryId ?? question.category;
  const previousMastery =
    data.mastery[question.subcategory] ?? createMasteryState(question.subcategory, categoryId);

  const quality = answerQuality({
    correct,
    confidence: input.confidence,
    difficulty: question.difficulty,
    responseMs: answer.responseMs,
    estimatedTimeSec: question.estimatedTimeSec,
    useResponseTimeSignal: input.useResponseTimeSignal,
  });

  const mastery = applyObservation(previousMastery, quality, correct, input.at);

  /* Profile ------------------------------------------------------------ */
  const profile = {
    ...data.profile,
    lastActiveAt: input.at,
    streak: nextStreak(data.profile.streak, input.at),
    totals: {
      ...data.profile.totals,
      answered: data.profile.totals.answered + 1,
      correct: data.profile.totals.correct + (correct ? 1 : 0),
    },
  };

  return {
    data: {
      ...data,
      profile,
      answers: [...data.answers, answer],
      questionStates: { ...data.questionStates, [question.id]: questionState },
      mastery: { ...data.mastery, [question.subcategory]: mastery },
    },
    answer,
    correct,
    masteryBefore: previousMastery.score,
    masteryAfter: mastery.score,
  };
}

/**
 * Snapshot the current mastery scores as "previousScore" so the next session
 * can report movement. Called when a session completes.
 */
export function snapshotMastery(data: LearnerData, subcategoryIds: readonly string[]): LearnerData {
  const mastery = { ...data.mastery };
  for (const id of subcategoryIds) {
    const state = mastery[id];
    if (state) mastery[id] = { ...state, previousScore: state.score };
  }
  return { ...data, mastery };
}
