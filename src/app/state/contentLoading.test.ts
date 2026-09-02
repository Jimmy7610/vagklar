import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, sep } from 'node:path';
import { describe, expect, it } from 'vitest';
import { QUESTION_INDEX, BANK_TOTALS } from '@/content/question-index';
import { ALL_QUESTIONS } from '@/content/questions';

/**
 * Guards the startup budget.
 *
 * The question bodies are the heaviest thing Vägklar ships. They reach the app
 * through a single dynamic import in `learnerStore`, which is what lets the
 * bundler keep them out of the eagerly loaded startup payload while Workbox
 * still precaches the chunk for offline use.
 *
 * That guarantee is a property of the *static* import graph, not of any one
 * file, so it is easy to lose by accident: one ordinary `import { getQuestion }`
 * in a module the shell touches pulls all 397 questions back into first paint.
 * These tests walk the real graph and fail when that happens.
 */

const root = resolve(__dirname, '../../..');
const src = resolve(root, 'src');

const IMPORT = /(?:^|\n)\s*(?:import|export)\s+(?!type\s)(?:[^'";]*?\sfrom\s+)?['"]([^'"]+)['"]/g;

function readSource(file: string): string {
  return readFileSync(file, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

function resolveSpecifier(specifier: string, from: string): string | null {
  if (specifier.endsWith('.css') || specifier.endsWith('.svg')) return null;
  let base: string;
  if (specifier.startsWith('@/')) base = resolve(src, specifier.slice(2));
  else if (specifier.startsWith('.')) base = resolve(dirname(from), specifier);
  else return null; // node_modules and virtual modules are not ours to walk
  for (const candidate of [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    resolve(base, 'index.ts'),
    resolve(base, 'index.tsx'),
  ]) {
    if (existsSync(candidate) && !candidate.endsWith('/')) {
      try {
        if (readFileSync(candidate).length >= 0 && /\.tsx?$/.test(candidate)) return candidate;
      } catch {
        /* a directory — keep trying the index candidates */
      }
    }
  }
  return null;
}

/** Every module reachable from the entry point through static imports only. */
function eagerGraph(): Set<string> {
  const seen = new Set<string>();
  const queue = [resolve(src, 'main.tsx')];
  while (queue.length > 0) {
    const file = queue.pop()!;
    if (seen.has(file)) continue;
    seen.add(file);
    const source = readSource(file);
    for (const match of source.matchAll(IMPORT)) {
      const target = resolveSpecifier(match[1]!, file);
      if (target && !seen.has(target)) queue.push(target);
    }
  }
  return seen;
}

const relative = (file: string) => file.slice(root.length + 1).split(sep).join('/');

describe('startup content loading', () => {
  const eager = eagerGraph();
  const eagerPaths = [...eager].map(relative);

  it('reaches the app entry point at all', () => {
    // A broken resolver would make every assertion below vacuously true.
    expect(eagerPaths).toContain('src/app/App.tsx');
    expect(eagerPaths).toContain('src/app/state/learnerStore.ts');
  });

  it('does not pull the question bodies into the startup graph', () => {
    const questions = eagerPaths.filter((p) => p.startsWith('src/content/questions/'));
    expect(questions, `question modules loaded eagerly: ${questions.join(', ')}`).toHaveLength(0);
  });

  it('does not pull the bank, or anything that reads it whole, into startup', () => {
    const banned = [
      'src/domain/content/bank.ts',
      'src/domain/selection/selection.ts',
      'src/domain/insights/insights.ts',
      'src/domain/exam/exam.ts',
      'src/app/state/useContent.ts',
    ];
    const leaked = banned.filter((p) => eagerPaths.includes(p));
    expect(leaked, `reachable without a dynamic import: ${leaked.join(', ')}`).toHaveLength(0);
  });

  it('still lets the shell hydrate and rank subjects from the generated index', () => {
    // The startup path is not allowed to be *empty* of content either: mastery
    // and readiness need the index, or the shell could not draw progress.
    expect(eagerPaths).toContain('src/content/question-index.ts');
    expect(eagerPaths).toContain('src/domain/content/indexView.ts');
    expect(eagerPaths).toContain('src/domain/mastery/mastery.ts');
  });

  it('keeps the index far smaller than the bank it stands in for', () => {
    const bankBytes = JSON.stringify(ALL_QUESTIONS).length;
    const indexBytes = JSON.stringify(QUESTION_INDEX).length;
    expect(indexBytes).toBeLessThan(bankBytes * 0.2);
  });
});

describe('generated question index', () => {
  it('has exactly one row per question in the bank', () => {
    expect(QUESTION_INDEX).toHaveLength(ALL_QUESTIONS.length);
  });

  it('matches the bank field for field', () => {
    // Regenerate with `npm run generate:index` when this fails.
    const fromBank = ALL_QUESTIONS.map((q) => ({
      id: q.id,
      category: q.category,
      subcategory: q.subcategory,
      difficulty: q.difficulty,
      status: q.status,
      ruleTested: q.ruleTested,
    }));
    expect(QUESTION_INDEX.map((q) => ({ ...q }))).toEqual(fromBank);
  });

  it('reports the same totals the landing page shows', () => {
    const active = ALL_QUESTIONS.filter((q) => q.status !== 'retired');
    expect(BANK_TOTALS.total).toBe(active.length);
    expect(BANK_TOTALS.easy).toBe(active.filter((q) => q.difficulty === 1).length);
    expect(BANK_TOTALS.medium).toBe(active.filter((q) => q.difficulty === 2).length);
    expect(BANK_TOTALS.hard).toBe(active.filter((q) => q.difficulty === 3).length);
  });

  it('has no duplicate ids across the question modules', () => {
    const ids = ALL_QUESTIONS.map((q) => q.id);
    const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(duplicates, duplicates.join(', ')).toHaveLength(0);
  });
});
