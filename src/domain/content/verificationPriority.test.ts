import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ALL_QUESTIONS } from '@/content/questions';
import { SUBCATEGORIES } from '@/content/taxonomy';
import {
  BATCHES,
  SAFETY_SUBCATEGORY_IDS,
  batchOfSubcategory,
  priorityOf,
  tagsOf,
} from './verificationPriority';
import type { Question } from './types';

/**
 * The queue is a claim about where a person's attention should go first.
 *
 * It is easy to write a rule that sounds right and produces a useless queue.
 * An earlier version of this model promoted every question citing a statute
 * and every question in a safety-critical subject, and put 376 of 442
 * questions into P1 — the whole bank with a label on it. The size of the
 * result is part of whether the rule is correct, so it is asserted here.
 */

const p1 = ALL_QUESTIONS.filter((q) => priorityOf(q).priority === 'P1');

describe('verification priority', () => {
  it('keeps P1 small enough to be a queue rather than a list of everything', () => {
    const share = p1.length / ALL_QUESTIONS.length;
    expect(share).toBeGreaterThan(0.15);
    expect(share).toBeLessThan(0.45);
  });

  it('puts every question somewhere', () => {
    for (const q of ALL_QUESTIONS) {
      expect(['P1', 'P2', 'P3']).toContain(priorityOf(q).priority);
    }
  });

  it('promotes a legal number', () => {
    const q = { ...ALL_QUESTIONS[0]!, prompt: 'Vid vilken hastighet? 30 km/h.', subcategory: 'grundregler' } as Question;
    const result = priorityOf(q);
    expect(result.priority).toBe('P1');
    expect(result.tags).toContain('P1-NUMERIC');
  });

  it('promotes an administrative rule even without a number', () => {
    const q = {
      ...ALL_QUESTIONS[0]!,
      prompt: 'Vad gäller vid kontrollbesiktning av en personbil?',
      answers: ALL_QUESTIONS[0]!.answers,
      shortExplanation: 'Besiktning ska göras enligt Transportstyrelsens föreläggande.',
      deepExplanation: '',
      ruleTested: 'Besiktning',
      subcategory: 'grundregler',
    } as Question;
    expect(priorityOf(q).tags).toContain('P1-ADMIN');
  });

  it('does not promote on a statute reference alone', () => {
    // 277 of 442 questions cite a statute. Promoting on that is not triage.
    const withStatute = ALL_QUESTIONS.filter((q) =>
      q.sourceReferences.some((r) => r.sourceId === 'trafikforordningen'),
    );
    expect(withStatute.length).toBeGreaterThan(50);
    expect(withStatute.some((q) => priorityOf(q).priority !== 'P1')).toBe(true);
  });

  it('puts the zero-tolerance drug rule in P1', () => {
    // It did not, and the reason is worth keeping: P1 membership needs a legal
    // number, a volatile subject or an administrative rule, and "nolltolerans"
    // is a legal absolute written entirely in words. The number test never
    // fired, the subcategory was not listed as volatile, and five questions
    // about the only zero-tolerance criminal rule in the bank sat in P3.
    const drugs = ALL_QUESTIONS.filter((q) => q.subcategory === 'droger-lakemedel');
    expect(drugs.length).toBeGreaterThan(0);
    for (const q of drugs) {
      expect(priorityOf(q).priority, q.id).toBe('P1');
    }
  });

  it('names only subcategories that exist in the safety list', () => {
    // Not that every safety subcategory reaches P1 — promoting on safety alone
    // was measured and rejected, because it put 376 of 442 questions in the
    // queue. What this catches is the failure that actually happened twice: an
    // id in a Set that matches nothing, which does not throw and does not warn.
    // It simply never fires, and the rule silently does not exist.
    const known = new Set(SUBCATEGORIES.map((s) => s.id));
    const unknown = SAFETY_SUBCATEGORY_IDS.filter((id) => !known.has(id));
    expect(unknown, unknown.join(', ')).toEqual([]);
  });

  it('only tags questions that are actually in P1', () => {
    // A P1-SAFETY tag on a P3 question would be a label nobody acts on.
    for (const q of ALL_QUESTIONS) {
      const { priority, tags } = priorityOf(q);
      if (priority !== 'P1') expect(tags, q.id).toHaveLength(0);
    }
  });

  it('gives every P1 question at least one reason it is there', () => {
    for (const q of p1) {
      const tags = tagsOf(q);
      expect(tags.some((t) => t === 'P1-NUMERIC' || t === 'P1-VOLATILE' || t === 'P1-ADMIN'), q.id).toBe(
        true,
      );
    }
  });

  it('only marks an exception as P1 when there is a hard rule to except from', () => {
    const q = {
      ...ALL_QUESTIONS[0]!,
      prompt: 'Detta gäller utom när vägen är enkelriktad.',
      shortExplanation: 'Ett undantag.',
      deepExplanation: '',
      ruleTested: 'Undantag',
      subcategory: 'grundregler',
      sourceReferences: [],
    } as Question;
    // No number, no statute: an exception on its own is a P2.
    expect(priorityOf(q).priority).toBe('P2');
  });
});

describe('review batches', () => {
  const subcategoryIds = new Set(SUBCATEGORIES.map((s) => s.id));

  it('names only subcategories that exist', () => {
    const unknown = BATCHES.flatMap((b) => b.subcategories).filter((s) => !subcategoryIds.has(s));
    expect(unknown, unknown.join(', ')).toHaveLength(0);
  });

  it('never puts one subcategory in two batches', () => {
    const all = BATCHES.flatMap((b) => b.subcategories);
    expect(new Set(all).size, 'en delkategori i flera omgångar').toBe(all.length);
  });

  it('leaves almost nothing in the catch-all batch', () => {
    // A reviewer works a subject at a time. Questions that fall outside every
    // batch have to be worked without that benefit, so there should be few.
    const orphans = p1.filter((q) => !batchOfSubcategory.has(q.subcategory));
    expect(orphans.length / Math.max(1, p1.length)).toBeLessThan(0.1);
  });

  it('keeps each batch to something a person could sit down and finish', () => {
    for (const b of BATCHES) {
      const n = p1.filter((q) => batchOfSubcategory.get(q.subcategory)?.id === b.id).length;
      expect(n, `${b.id} ${b.title}`).toBeLessThan(40);
    }
  });
});

describe('the reviewer tool never reaches production', () => {
  /**
   * The generated reviewer page carries the entire question bank with the
   * correct answers marked, every source citation, and — when the local cache
   * exists — words taken from the licensed book. It is exactly what preparing
   * verification needs and exactly what a learner must not be handed.
   */
  const root = process.cwd();

  it('is written outside the app and is not tracked', () => {
    const gitignore = readFileSync(resolve(root, '.gitignore'), 'utf8');
    expect(gitignore).toMatch(/^\/review\/?$/m);
  });

  it('is not imported by anything the app builds', () => {
    const report = readFileSync(resolve(root, 'scripts/verification-report.ts'), 'utf8');
    expect(report).toContain("'review/index.html'");
    // Nothing under src/ may reach for the reviewer output or the page cache.
    const appSources = readFileSync(resolve(root, 'src/app/App.tsx'), 'utf8');
    expect(appSources).not.toContain('review/');
    expect(appSources).not.toContain('.page-text');
  });

  it('has a build guard that would catch it if it ever did', () => {
    const guard = readFileSync(resolve(root, 'scripts/verify-build.mjs'), 'utf8');
    expect(guard).toContain('DEV_ONLY_ARTEFACTS');
    expect(guard).toContain('.page-text.json');
    expect(guard).toContain('granskningsverktyg');
  });
});
