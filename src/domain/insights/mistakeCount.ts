import type { LearnerData } from '@/domain/learner/types';

/**
 * How many distinct questions the learner has got wrong and not yet re-mastered.
 *
 * Deliberately in its own module: this is the only insight the app *shell*
 * needs — it drives the badge on the "Mina misstag" tab — and it reads nothing
 * but learner data. Keeping it apart from insights.ts means the shell does not
 * pull the question bank into the startup bundle just to render a number.
 */
export function outstandingMistakeCount(data: LearnerData): number {
  const wrong = new Set(data.answers.filter((a) => !a.correct).map((a) => a.questionId));
  let count = 0;
  for (const questionId of wrong) {
    const state = data.questionStates[questionId];
    if (!state || state.streak < 2) count += 1;
  }
  return count;
}
