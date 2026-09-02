import { ALL_QUESTIONS } from '@/content/questions';
import { CATEGORIES, SUBCATEGORY_BY_ID } from '@/content/taxonomy';
import { LEARNER_VISIBLE_STATUSES } from './types';
import type { CategoryId, Question } from './types';

/**
 * Read-only query surface over the question bank.
 *
 * Everything here is pure and index-backed so the adaptive engine can call it
 * freely without re-scanning the bank on every decision.
 */

export const QUESTIONS: readonly Question[] = ALL_QUESTIONS.filter((q) =>
  LEARNER_VISIBLE_STATUSES.includes(q.status),
);

export const QUESTION_BY_ID: ReadonlyMap<string, Question> = new Map(
  QUESTIONS.map((q) => [q.id, q]),
);

function groupBy<K>(items: readonly Question[], key: (q: Question) => K): Map<K, Question[]> {
  const map = new Map<K, Question[]>();
  for (const item of items) {
    const k = key(item);
    const bucket = map.get(k);
    if (bucket) bucket.push(item);
    else map.set(k, [item]);
  }
  return map;
}

export const QUESTIONS_BY_CATEGORY: ReadonlyMap<CategoryId, Question[]> = groupBy(
  QUESTIONS,
  (q) => q.category,
);

export const QUESTIONS_BY_SUBCATEGORY: ReadonlyMap<string, Question[]> = groupBy(
  QUESTIONS,
  (q) => q.subcategory,
);

/** Questions grouped by the rule they test — used to find sibling questions. */
export const QUESTIONS_BY_RULE: ReadonlyMap<string, Question[]> = groupBy(
  QUESTIONS,
  (q) => `${q.subcategory}::${q.ruleTested}`,
);

/**
 * Subcategories that actually have questions.
 *
 * Coverage and readiness are measured against this set, never against the full
 * taxonomy — otherwise a learner could never reach a high score simply because
 * the content library has not been filled out yet.
 */
// Re-exported from the index view so the bank and the startup-cheap view can
// never disagree about which subjects exist.
export { COVERED_SUBCATEGORY_IDS, subcategoryWeight } from './indexView';
import { COVERED_SUBCATEGORY_IDS } from './indexView';

export const COVERED_CATEGORY_IDS: readonly CategoryId[] = CATEGORIES.filter((c) =>
  QUESTIONS_BY_CATEGORY.has(c.id),
).map((c) => c.id);

export function getQuestion(id: string): Question | undefined {
  return QUESTION_BY_ID.get(id);
}

export function getQuestions(ids: readonly string[]): Question[] {
  const result: Question[] = [];
  for (const id of ids) {
    const question = QUESTION_BY_ID.get(id);
    if (question) result.push(question);
  }
  return result;
}

export function questionsInCategory(categoryId: CategoryId): readonly Question[] {
  return QUESTIONS_BY_CATEGORY.get(categoryId) ?? [];
}

export function questionsInSubcategory(subcategoryId: string): readonly Question[] {
  return QUESTIONS_BY_SUBCATEGORY.get(subcategoryId) ?? [];
}

/**
 * Other questions that test the same rule. Used by "Öva liknande" and by the
 * repetition scheduler so we vary the item rather than repeating it verbatim.
 */
export function siblingQuestions(question: Question): Question[] {
  const siblings = QUESTIONS_BY_RULE.get(`${question.subcategory}::${question.ruleTested}`) ?? [];
  const sameSubcategory = QUESTIONS_BY_SUBCATEGORY.get(question.subcategory) ?? [];
  const seen = new Set<string>([question.id]);
  const result: Question[] = [];
  for (const candidate of [...siblings, ...sameSubcategory]) {
    if (seen.has(candidate.id)) continue;
    seen.add(candidate.id);
    result.push(candidate);
  }
  return result;
}

/** The weight of a subcategory inside the overall taxonomy. */
export interface BankStats {
  total: number;
  byCategory: Array<{ categoryId: CategoryId; count: number }>;
  byDifficulty: { easy: number; medium: number; hard: number };
  coveredSubcategories: number;
  totalSubcategories: number;
}

export function bankStats(): BankStats {
  const byDifficulty = { easy: 0, medium: 0, hard: 0 };
  for (const question of QUESTIONS) {
    if (question.difficulty === 1) byDifficulty.easy += 1;
    else if (question.difficulty === 2) byDifficulty.medium += 1;
    else byDifficulty.hard += 1;
  }
  return {
    total: QUESTIONS.length,
    byCategory: CATEGORIES.map((c) => ({
      categoryId: c.id,
      count: QUESTIONS_BY_CATEGORY.get(c.id)?.length ?? 0,
    })),
    byDifficulty,
    coveredSubcategories: COVERED_SUBCATEGORY_IDS.length,
    totalSubcategories: SUBCATEGORY_BY_ID.size,
  };
}
