import { describe, expect, it } from 'vitest';
import { ALL_QUESTIONS } from '@/content/questions';
import { CURRICULUM_CONCEPTS } from '@/content/curriculum/curriculum';
import { MISCONCEPTIONS } from '@/content/misconceptions';
import { SOURCES } from '@/content/sources';
import { SUBCATEGORIES } from '@/content/taxonomy';
import {
  findDuplicates,
  normalisePrompt,
  similarity,
  validateContent,
} from './validation';
import type { Question } from './types';

const subcategoryIds = new Set(SUBCATEGORIES.map((s) => s.id));
const categoryBySubcategory = new Map(SUBCATEGORIES.map((s) => [s.id, s.categoryId as string]));
const misconceptionIds = new Set(MISCONCEPTIONS.map((m) => m.id));

function baseInput(questions: readonly Question[]) {
  return {
    questions,
    subcategoryIds,
    categoryBySubcategory,
    misconceptionIds,
    concepts: CURRICULUM_CONCEPTS,
    sources: SOURCES,
  };
}

/** A minimal, valid question to mutate in the failure-mode tests. */
function validQuestion(overrides: Partial<Question> = {}): Question {
  return {
    id: 'test-001',
    version: 1,
    status: 'reviewed',
    category: 'korsningar',
    subcategory: 'hogerregeln',
    difficulty: 2,
    questionType: 'multiple-choice',
    ruleTested: 'Högerregeln',
    misconceptions: [],
    prompt: 'En testfråga som beskriver en situation i en korsning utan vägmärken.',
    answers: [
      { id: 'a', text: 'Du har väjningsplikt mot fordon från höger.' },
      { id: 'b', text: 'Du har företräde framför fordon från höger.' },
      { id: 'c', text: 'Ingen av er har väjningsplikt i korsningen.' },
    ],
    correctAnswerId: 'a',
    shortExplanation:
      'Saknas vägmärken och signaler gäller högerregeln, så fordon från höger kör först.',
    sourceReferences: [{ name: 'Trafikförordningen (1998:1276)', verifiedAt: null }],
    lastReviewedAt: null,
    estimatedTimeSec: 30,
    ...overrides,
  };
}

describe('validateContent — the real bank', () => {
  const report = validateContent(baseInput(ALL_QUESTIONS));

  it('checks every question', () => {
    expect(report.checked).toBe(ALL_QUESTIONS.length);
  });

  it('reports no errors', () => {
    const summary = report.errors
      .slice(0, 10)
      .map((e) => `${e.questionId}: [${e.code}] ${e.message}`)
      .join('\n');
    expect(report.errors, `\n${summary}`).toHaveLength(0);
  });

  it('maps every active question to a curriculum concept', () => {
    const unmapped = report.issues.filter((i) => i.code === 'unmapped-subcategory');
    expect(unmapped).toHaveLength(0);
  });

  it('keeps every cited page inside its source', () => {
    const bad = report.issues.filter(
      (i) => i.code === 'source-page-out-of-range' || i.code === 'bad-source-page',
    );
    expect(bad).toHaveLength(0);
  });

  it('never attaches a misconception to a correct answer', () => {
    expect(report.issues.filter((i) => i.code === 'misconception-on-correct')).toHaveLength(0);
  });
});

describe('validateContent — failure modes', () => {
  // Each of these proves the validator actually catches the defect, rather
  // than passing because the bank happens to be clean.
  const cases: Array<[string, Partial<Question>, string]> = [
    ['an unknown subcategory', { subcategory: 'finns-inte' }, 'unknown-subcategory'],
    ['a category that contradicts the subcategory', { category: 'miljo' }, 'category-mismatch'],
    ['a correct answer id that does not exist', { correctAnswerId: 'zz' }, 'missing-correct-answer'],
    ['too few alternatives', { answers: [{ id: 'a', text: 'Ett' }, { id: 'b', text: 'Två' }] }, 'answer-count'],
    ['an empty explanation', { shortExplanation: '   ' }, 'missing-explanation'],
    ['no source at all', { sourceReferences: [] }, 'missing-source'],
    ['verified without a date', { status: 'verified', lastReviewedAt: null }, 'verified-without-date'],
    ['a dangling related id', { relatedQuestionIds: ['does-not-exist'] }, 'dangling-related'],
    [
      'an unknown misconception',
      {
        answers: [
          { id: 'a', text: 'Rätt svar här.' },
          { id: 'b', text: 'Fel svar här.', misconceptionId: 'hittepa' },
          { id: 'c', text: 'Annat fel svar.' },
        ],
      },
      'unknown-misconception',
    ],
    [
      'a page beyond the end of the source',
      {
        sourceReferences: [
          { name: 'Teoribok', verifiedAt: null, sourceId: 'teoribok-2026-1', sourcePages: [9999] },
        ],
      },
      'source-page-out-of-range',
    ],
    [
      'two alternatives with the same text',
      {
        answers: [
          { id: 'a', text: 'Samma text.' },
          { id: 'b', text: 'Samma text.' },
          { id: 'c', text: 'Annan text.' },
        ],
      },
      'duplicate-answer-text',
    ],
    [
      'a misconception on the correct answer',
      {
        answers: [
          { id: 'a', text: 'Rätt svar.', misconceptionId: 'hoger-utan-skylt' },
          { id: 'b', text: 'Fel svar.' },
          { id: 'c', text: 'Annat fel.' },
        ],
      },
      'misconception-on-correct',
    ],
  ];

  for (const [name, override, code] of cases) {
    it(`catches ${name}`, () => {
      const report = validateContent(baseInput([validQuestion(override)]));
      expect(report.errors.map((e) => e.code)).toContain(code);
    });
  }

  it('accepts the untouched control question', () => {
    const report = validateContent(baseInput([validQuestion()]));
    expect(report.errors).toHaveLength(0);
  });

  it('catches a duplicate id', () => {
    const report = validateContent(
      baseInput([validQuestion(), validQuestion({ prompt: 'En annan fråga om samma sak i korsning.' })]),
    );
    expect(report.errors.map((e) => e.code)).toContain('duplicate-id');
  });

  it('warns rather than errors on a very short explanation', () => {
    const report = validateContent(baseInput([validQuestion({ shortExplanation: 'Kort.' })]));
    expect(report.errors).toHaveLength(0);
    expect(report.warnings.map((w) => w.code)).toContain('short-explanation');
  });
});

describe('normalisePrompt', () => {
  it('ignores case, punctuation and spacing', () => {
    expect(normalisePrompt('Vad gäller?  Här!')).toBe('vad gäller här');
  });

  it('keeps Swedish letters', () => {
    expect(normalisePrompt('Väjningsplikt förändras')).toBe('väjningsplikt förändras');
  });
});

describe('similarity', () => {
  it('is 1 for the same sentence', () => {
    const s = 'Du närmar dig en korsning utan vägmärken och en bil kommer från höger.';
    expect(similarity(s, s)).toBe(1);
  });

  it('is low for unrelated sentences', () => {
    expect(
      similarity(
        'Hur länge bör motorvärmaren vara på vid noll grader?',
        'Vilket ljus ska du använda i tät dimma?',
      ),
    ).toBeLessThan(0.3);
  });

  it('is high for a reworded near-duplicate', () => {
    expect(
      similarity(
        'Du närmar dig en obevakad cykelpassage och ska köra rakt fram.',
        'Du närmar dig en obevakad cykelpassage och ska köra rakt fram nu.',
      ),
    ).toBeGreaterThan(0.8);
  });
});

describe('findDuplicates', () => {
  it('finds an exact duplicate prompt', () => {
    const pairs = findDuplicates([
      validQuestion({ id: 'q1' }),
      validQuestion({ id: 'q2' }),
    ]);
    expect(pairs.some((p) => p.kind === 'exact-prompt')).toBe(true);
  });

  it('finds identical answer sets', () => {
    const pairs = findDuplicates([
      validQuestion({ id: 'q1' }),
      validQuestion({ id: 'q2', prompt: 'En helt annan formulering av något annat ämne.' }),
    ]);
    expect(pairs.some((p) => p.kind === 'identical-answers')).toBe(true);
  });

  it('returns nothing for genuinely different questions', () => {
    const pairs = findDuplicates([
      validQuestion({ id: 'q1' }),
      validQuestion({
        id: 'q2',
        prompt: 'Hur länge bör motorvärmaren vara igång vid noll grader innan avfärd?',
        answers: [
          { id: 'a', text: 'Ungefär en timme.' },
          { id: 'b', text: 'Ungefär tio minuter.' },
          { id: 'c', text: 'Hela natten.' },
        ],
        shortExplanation:
          'Cirka en timme vid noll grader. Längre tid än så ger ingen ytterligare nytta.',
      }),
    ]);
    expect(pairs).toHaveLength(0);
  });

  it('finds no exact duplicates in the real bank', () => {
    const pairs = findDuplicates(ALL_QUESTIONS).filter((p) => p.kind === 'exact-prompt');
    const shown = pairs.map((p) => `${p.a} ~ ${p.b}`).join(', ');
    expect(pairs, shown).toHaveLength(0);
  });

  it('finds no identical answer sets within a subcategory in the real bank', () => {
    const pairs = findDuplicates(ALL_QUESTIONS).filter((p) => p.kind === 'identical-answers');
    const shown = pairs.map((p) => `${p.a} ~ ${p.b}`).join(', ');
    expect(pairs, shown).toHaveLength(0);
  });
});
