import { describe, expect, it } from 'vitest';
import { ALL_QUESTIONS } from '@/content/questions';
import { MISCONCEPTION_BY_ID } from '@/content/misconceptions';
import { SUBCATEGORY_BY_ID } from '@/content/taxonomy';
import { COVERED_CATEGORY_IDS, QUESTIONS, bankStats } from './bank';
import { CATEGORIES } from '@/content/taxonomy';

describe('question bank integrity', () => {
  it('has unique question ids', () => {
    const ids = ALL_QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every question exactly one correct answer that exists', () => {
    for (const question of ALL_QUESTIONS) {
      const match = question.answers.filter((a) => a.id === question.correctAnswerId);
      expect(match, `question ${question.id}`).toHaveLength(1);
    }
  });

  it('gives every question at least three alternatives with unique ids', () => {
    for (const question of ALL_QUESTIONS) {
      expect(question.answers.length, `question ${question.id}`).toBeGreaterThanOrEqual(3);
      const ids = question.answers.map((a) => a.id);
      expect(new Set(ids).size, `question ${question.id}`).toBe(ids.length);
    }
  });

  it('does not put the correct answer in the same position every time', () => {
    const positions = new Map<string, number>();
    for (const question of ALL_QUESTIONS) {
      const index = question.answers.findIndex((a) => a.id === question.correctAnswerId);
      positions.set(String(index), (positions.get(String(index)) ?? 0) + 1);
    }
    // With a deterministic shuffle we expect all four positions to be used and
    // no single position to dominate.
    expect(positions.size).toBeGreaterThanOrEqual(3);
    for (const count of positions.values()) {
      expect(count).toBeLessThan(ALL_QUESTIONS.length * 0.55);
    }
  });

  it('references only known subcategories, and consistent categories', () => {
    for (const question of ALL_QUESTIONS) {
      const subcategory = SUBCATEGORY_BY_ID.get(question.subcategory);
      expect(subcategory, `question ${question.id} subcategory ${question.subcategory}`).toBeDefined();
      expect(subcategory?.categoryId, `question ${question.id}`).toBe(question.category);
    }
  });

  it('references only known misconceptions', () => {
    for (const question of ALL_QUESTIONS) {
      for (const answer of question.answers) {
        if (!answer.misconceptionId) continue;
        expect(
          MISCONCEPTION_BY_ID.has(answer.misconceptionId),
          `question ${question.id} -> ${answer.misconceptionId}`,
        ).toBe(true);
      }
    }
  });

  it('only links to related questions that exist', () => {
    const ids = new Set(ALL_QUESTIONS.map((q) => q.id));
    for (const question of ALL_QUESTIONS) {
      for (const related of question.relatedQuestionIds ?? []) {
        expect(ids.has(related), `question ${question.id} -> ${related}`).toBe(true);
      }
    }
  });

  it('gives every question a short explanation and at least one source', () => {
    for (const question of ALL_QUESTIONS) {
      expect(question.shortExplanation.length, `question ${question.id}`).toBeGreaterThan(10);
      expect(question.sourceReferences.length, `question ${question.id}`).toBeGreaterThan(0);
    }
  });

  it('never claims a question is verified without a verification date', () => {
    for (const question of ALL_QUESTIONS) {
      if (question.status !== 'verified') continue;
      const allVerified = question.sourceReferences.every((s) => s.verifiedAt !== null);
      expect(allVerified, `question ${question.id} claims verified status`).toBe(true);
    }
  });

  it('covers every top-level category', () => {
    for (const category of CATEGORIES) {
      expect(COVERED_CATEGORY_IDS, `category ${category.id}`).toContain(category.id);
    }
  });

  it('includes all three difficulty levels in meaningful numbers', () => {
    const stats = bankStats();
    expect(stats.byDifficulty.easy).toBeGreaterThan(5);
    expect(stats.byDifficulty.medium).toBeGreaterThan(20);
    expect(stats.byDifficulty.hard).toBeGreaterThan(10);
    expect(stats.total).toBe(QUESTIONS.length);
  });
});
