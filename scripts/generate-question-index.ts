/**
 * Generates src/content/question-index.ts.
 *
 *   npm run generate:index
 *
 * The index is the small, startup-cheap half of the question bank: just enough
 * about every question to hydrate saved progress, weight the adaptive engine
 * and show bank statistics, without the prompts, answers, explanations and
 * source references that make up 92 % of the bytes.
 *
 * It is generated rather than hand-kept, and a test asserts it matches the real
 * bank exactly — so it cannot drift when questions are added.
 */

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ALL_QUESTIONS } from '../src/content/questions';
import { LEARNER_VISIBLE_STATUSES } from '../src/domain/content/types';

const rows = ALL_QUESTIONS.map((q) => ({
  id: q.id,
  c: q.category,
  s: q.subcategory,
  d: q.difficulty,
  st: q.status,
  r: q.ruleTested,
}));

const byDifficulty = { easy: 0, medium: 0, hard: 0 };
for (const q of ALL_QUESTIONS) {
  if (!LEARNER_VISIBLE_STATUSES.includes(q.status)) continue;
  if (q.difficulty === 1) byDifficulty.easy += 1;
  else if (q.difficulty === 2) byDifficulty.medium += 1;
  else byDifficulty.hard += 1;
}

const lines: string[] = [];
lines.push('/**');
lines.push(' * GENERATED FILE — do not edit by hand.');
lines.push(' *');
lines.push(' * Run `npm run generate:index` after changing the question bank.');
lines.push(' * A test asserts this file matches the bank, so a stale index fails the suite.');
lines.push(' *');
lines.push(' * Why it exists: the full bank is ~470 kB of JSON, dominated by answers,');
lines.push(' * explanations and source references. Hydration, the mastery model and the');
lines.push(' * landing page need none of that — only which questions exist and where they');
lines.push(' * sit in the taxonomy. Keeping that here lets the bank itself load lazily.');
lines.push(' */');
lines.push('');
lines.push("import { LEARNER_VISIBLE_STATUSES } from '@/domain/content/types';");
lines.push("import type { CategoryId, Difficulty, QuestionStatus } from '@/domain/content/types';");
lines.push('');
lines.push('export interface QuestionIndexEntry {');
lines.push('  id: string;');
lines.push('  category: CategoryId;');
lines.push('  subcategory: string;');
lines.push('  difficulty: Difficulty;');
lines.push('  status: QuestionStatus;');
lines.push('  ruleTested: string;');
lines.push('}');
lines.push('');
lines.push('/** Compact rows: [id, category, subcategory, difficulty, status, ruleTested]. */');
lines.push(
  'const ROWS: ReadonlyArray<readonly [string, string, string, number, string, string]> = [',
);
for (const r of rows) {
  // JSON.stringify handles quotes and backslashes in rule names correctly.
  lines.push(
    `  ['${r.id}', '${r.c}', '${r.s}', ${r.d}, '${r.st}', ${JSON.stringify(r.r)}],`,
  );
}
lines.push('];');
lines.push('');
lines.push('export const QUESTION_INDEX: readonly QuestionIndexEntry[] = ROWS.map((r) => ({');
lines.push('  id: r[0],');
lines.push('  category: r[1] as CategoryId,');
lines.push('  subcategory: r[2],');
lines.push('  difficulty: r[3] as Difficulty,');
lines.push('  status: r[4] as QuestionStatus,');
lines.push('  ruleTested: r[5],');
lines.push('}));');
lines.push('');
lines.push('export const QUESTION_INDEX_BY_ID: ReadonlyMap<string, QuestionIndexEntry> = new Map(');
lines.push('  QUESTION_INDEX.map((q) => [q.id, q]),');
lines.push(');');
lines.push('');
lines.push('/** Learner-visible questions only — draft, rejected and retired stay out. */');
lines.push('export const ACTIVE_QUESTION_INDEX: readonly QuestionIndexEntry[] =');
lines.push('  QUESTION_INDEX.filter((q) => LEARNER_VISIBLE_STATUSES.includes(q.status));');
lines.push('');
lines.push('/** Bank statistics, so the landing page needs no question bodies. */');
lines.push('export const BANK_TOTALS = {');
lines.push(`  total: ${ALL_QUESTIONS.filter((q) => LEARNER_VISIBLE_STATUSES.includes(q.status)).length},`);
lines.push(`  easy: ${byDifficulty.easy},`);
lines.push(`  medium: ${byDifficulty.medium},`);
lines.push(`  hard: ${byDifficulty.hard},`);
lines.push('} as const;');
lines.push('');

writeFileSync(resolve(process.cwd(), 'src/content/question-index.ts'), lines.join('\n'), 'utf8');
console.log(`src/content/question-index.ts skriven — ${rows.length} frågor.`);
