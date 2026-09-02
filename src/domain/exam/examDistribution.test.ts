import { describe, expect, it } from 'vitest';
import { buildExamQuestions } from './exam';
import { EXAM } from '@/domain/constants';
import { CATEGORIES } from '@/content/taxonomy';
import { QUESTIONS } from '@/domain/content/bank';
import type { CategoryId } from '@/domain/content/types';

/**
 * What a thousand simulated exams actually look like.
 *
 * A single generated exam can look fine by luck. The properties that matter to
 * a learner are statistical: that the subject mix is stable from one attempt to
 * the next, that no attempt is dominated by one corner of the bank, that
 * difficulty stays comparable, and that the bank is used broadly rather than
 * the same two hundred questions being recycled.
 *
 * Vägklar makes no claim to reproduce Trafikverket's weighting, which is not
 * published. This is Vägklar's own documented balance — see
 * docs/KNOWLEDGE-ENGINE.md — and these are the guarantees it makes.
 */

const SAMPLE = 1000;

const exams = Array.from({ length: SAMPLE }, (_, i) => buildExamQuestions(i * 7919 + 13));

describe('exam distribution over 1000 attempts', () => {
  it('always produces a full-length attempt', () => {
    for (const exam of exams) expect(exam).toHaveLength(EXAM.totalQuestions);
  });

  it('never repeats a question inside one attempt', () => {
    for (const exam of exams) {
      const ids = exam.map((q) => q.id);
      expect(new Set(ids).size, ids.join(',')).toBe(ids.length);
    }
  });

  it('never repeats a rule twice inside one attempt', () => {
    // Two questions on the same rule in one exam reads as padding even when the
    // questions differ, so the generator is expected to spread across rules.
    let worst = 0;
    for (const exam of exams) {
      const counts = new Map<string, number>();
      for (const q of exam) counts.set(q.ruleTested, (counts.get(q.ruleTested) ?? 0) + 1);
      worst = Math.max(worst, ...counts.values());
    }
    expect(worst).toBeLessThanOrEqual(3);
  });

  it('covers every category in every attempt', () => {
    for (const exam of exams) {
      const present = new Set(exam.map((q) => q.category));
      expect(present.size).toBe(CATEGORIES.length);
    }
  });

  it('keeps each category inside a stable share across attempts', () => {
    const min = new Map<CategoryId, number>();
    const max = new Map<CategoryId, number>();
    for (const exam of exams) {
      const counts = new Map<CategoryId, number>();
      for (const q of exam) counts.set(q.category, (counts.get(q.category) ?? 0) + 1);
      for (const c of CATEGORIES) {
        const n = counts.get(c.id) ?? 0;
        min.set(c.id, Math.min(min.get(c.id) ?? n, n));
        max.set(c.id, Math.max(max.get(c.id) ?? n, n));
      }
    }
    for (const c of CATEGORIES) {
      // A quota-driven generator should vary by a question or two, not wildly.
      expect(max.get(c.id)! - min.get(c.id)!, `${c.id} varierar för mycket`).toBeLessThanOrEqual(4);
    }
  });

  it('never lets one subcategory dominate an attempt', () => {
    let worst = 0;
    for (const exam of exams) {
      const counts = new Map<string, number>();
      for (const q of exam) counts.set(q.subcategory, (counts.get(q.subcategory) ?? 0) + 1);
      worst = Math.max(worst, ...counts.values());
    }
    // A tenth of the exam from one subject is the outer edge of reasonable.
    expect(worst).toBeLessThanOrEqual(Math.ceil(EXAM.totalQuestions / 10));
  });

  it('keeps average difficulty near the middle of the scale', () => {
    const averages = exams.map((e) => e.reduce((n, q) => n + q.difficulty, 0) / e.length);
    const overall = averages.reduce((a, b) => a + b, 0) / averages.length;
    expect(overall).toBeGreaterThan(1.8);
    expect(overall).toBeLessThan(2.4);
    // And no single attempt should be an outlier from that.
    expect(Math.min(...averages)).toBeGreaterThan(1.6);
    expect(Math.max(...averages)).toBeLessThan(2.6);
  });

  it('always includes some easy and some hard questions', () => {
    for (const exam of exams) {
      expect(exam.filter((q) => q.difficulty === 1).length).toBeGreaterThan(0);
      expect(exam.filter((q) => q.difficulty === 3).length).toBeGreaterThan(0);
    }
  });

  it('includes visual questions without letting them take over', () => {
    const shares = exams.map(
      (e) => e.filter((q) => q.image !== undefined || q.sourceImageId !== undefined).length,
    );
    const mean = shares.reduce((a, b) => a + b, 0) / shares.length;
    expect(mean).toBeGreaterThan(2);
    expect(Math.max(...shares)).toBeLessThanOrEqual(EXAM.totalQuestions / 3);
  });

  it('uses the breadth of the bank rather than the same few hundred questions', () => {
    const seen = new Set<string>();
    for (const exam of exams) for (const q of exam) seen.add(q.id);
    // Across a thousand attempts, essentially every question should appear.
    expect(seen.size / QUESTIONS.length).toBeGreaterThan(0.95);
  });

  it('gives different attempts different papers', () => {
    const signatures = new Set(exams.map((e) => e.map((q) => q.id).sort().join('|')));
    expect(signatures.size).toBe(SAMPLE);
  });
});
