import { ACTIVE_QUESTION_INDEX } from '@/content/question-index';
import { SUBCATEGORY_BY_ID } from '@/content/taxonomy';
import type { CategoryId } from './types';

/**
 * The startup-cheap view of the question bank.
 *
 * The mastery model and the readiness estimate need to know *which* subjects
 * exist and how they are weighted — not what any question says. Deriving that
 * from the lightweight index instead of the full bank is what keeps ~470 kB of
 * prompts, answers and explanations out of the startup bundle.
 *
 * Everything here is derived from the same generated index that hydration uses,
 * so it cannot disagree with the bank: a test asserts the index matches.
 */

/** Every subcategory that has at least one active question, sorted. */
export const COVERED_SUBCATEGORY_IDS: readonly string[] = Array.from(
  new Set(ACTIVE_QUESTION_INDEX.map((q) => q.subcategory)),
).sort();

/** Subcategories that have questions, grouped by their top-level category. */
export const SUBCATEGORIES_BY_CATEGORY: ReadonlyMap<CategoryId, readonly string[]> = (() => {
  const map = new Map<CategoryId, Set<string>>();
  for (const entry of ACTIVE_QUESTION_INDEX) {
    const bucket = map.get(entry.category);
    if (bucket) bucket.add(entry.subcategory);
    else map.set(entry.category, new Set([entry.subcategory]));
  }
  return new Map([...map].map(([category, set]) => [category, Array.from(set)]));
})();

/** Relative importance of a subcategory inside its category. */
export function subcategoryWeight(subcategoryId: string): number {
  return SUBCATEGORY_BY_ID.get(subcategoryId)?.weight ?? 1;
}
