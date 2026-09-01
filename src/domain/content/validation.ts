import type { Question } from './types';
import type { CurriculumConcept } from '@/content/curriculum/curriculum';
import type { SourceEntry } from '@/content/sources';

/**
 * Content validation.
 *
 * The question bank is data, and data rots quietly. This module is the
 * mechanical conscience: it answers "is this bank internally consistent and
 * honestly attributed?" as a pure function, so the same checks run in tests,
 * in CI and from a report script without drifting apart.
 *
 * Severity matters. An `error` is a defect that must not ship — a broken
 * reference, a question with no correct answer, an impossible source page.
 * A `warning` is something a human should look at but which does not make the
 * content wrong, such as an unusually short explanation.
 */

export type IssueSeverity = 'error' | 'warning';

export interface ValidationIssue {
  severity: IssueSeverity;
  /** Stable machine-readable code, e.g. 'unknown-subcategory'. */
  code: string;
  /** Question id, or a bank-level identifier such as '<bank>'. */
  questionId: string;
  message: string;
}

export interface ValidationInput {
  questions: readonly Question[];
  /** Every subcategory id that exists in the taxonomy. */
  subcategoryIds: ReadonlySet<string>;
  /** Subcategory id -> category id, for cross-checking. */
  categoryBySubcategory: ReadonlyMap<string, string>;
  /** Every misconception id that exists. */
  misconceptionIds: ReadonlySet<string>;
  concepts: readonly CurriculumConcept[];
  sources: readonly SourceEntry[];
}

export interface ValidationReport {
  issues: ValidationIssue[];
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  checked: number;
}

/** Answer counts we accept. Fewer than three makes guessing too cheap. */
const MIN_ANSWERS = 3;
const MAX_ANSWERS = 4;

/** Below this an explanation is very unlikely to actually teach the rule. */
const MIN_EXPLANATION_CHARS = 40;

/**
 * Normalise a prompt for duplicate comparison: lowercase, strip punctuation
 * and collapse whitespace. Deliberately crude — the goal is to catch
 * copy-paste, not to do semantic matching.
 */
export function normalisePrompt(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Word set of a normalised string, for Jaccard similarity. */
function tokens(text: string): Set<string> {
  return new Set(normalisePrompt(text).split(' ').filter((w) => w.length > 2));
}

/** Jaccard similarity between two strings, 0–1. */
export function similarity(a: string, b: string): number {
  const ta = tokens(a);
  const tb = tokens(b);
  if (ta.size === 0 || tb.size === 0) return 0;
  let shared = 0;
  for (const word of ta) if (tb.has(word)) shared += 1;
  return shared / (ta.size + tb.size - shared);
}

export function validateContent(input: ValidationInput): ValidationReport {
  const issues: ValidationIssue[] = [];
  const add = (severity: IssueSeverity, code: string, questionId: string, message: string) =>
    issues.push({ severity, code, questionId, message });

  const conceptSubcategories = new Set(
    input.concepts.flatMap((c) => (c.subcategory ? [c.subcategory] : [])),
  );
  const sourceById = new Map(input.sources.map((s) => [s.id, s]));
  const seenIds = new Set<string>();

  for (const q of input.questions) {
    /* ---- Identity ---------------------------------------------------- */
    if (seenIds.has(q.id)) add('error', 'duplicate-id', q.id, `Fråge-id ${q.id} används mer än en gång.`);
    seenIds.add(q.id);

    /* ---- Taxonomy ---------------------------------------------------- */
    if (!input.subcategoryIds.has(q.subcategory)) {
      add('error', 'unknown-subcategory', q.id, `Okänt delområde "${q.subcategory}".`);
    } else {
      const expected = input.categoryBySubcategory.get(q.subcategory);
      if (expected && expected !== q.category) {
        add(
          'error',
          'category-mismatch',
          q.id,
          `Delområdet "${q.subcategory}" hör till "${expected}", inte "${q.category}".`,
        );
      }
    }

    // An active question must sit on a subcategory the curriculum knows about,
    // or the coverage report silently stops counting it.
    if (q.status !== 'retired' && !conceptSubcategories.has(q.subcategory)) {
      add(
        'error',
        'unmapped-subcategory',
        q.id,
        `Delområdet "${q.subcategory}" saknar begrepp i kursplanen — frågan räknas inte i täckningen.`,
      );
    }

    /* ---- Answers ------------------------------------------------------ */
    if (q.answers.length < MIN_ANSWERS || q.answers.length > MAX_ANSWERS) {
      add(
        'error',
        'answer-count',
        q.id,
        `Har ${q.answers.length} svarsalternativ; ${MIN_ANSWERS}–${MAX_ANSWERS} krävs.`,
      );
    }

    const answerIds = new Set(q.answers.map((a) => a.id));
    if (answerIds.size !== q.answers.length) {
      add('error', 'duplicate-answer-id', q.id, 'Två svarsalternativ har samma id.');
    }

    if (!answerIds.has(q.correctAnswerId)) {
      add('error', 'missing-correct-answer', q.id, 'Det rätta svaret finns inte bland alternativen.');
    }

    const answerTexts = q.answers.map((a) => normalisePrompt(a.text));
    if (new Set(answerTexts).size !== answerTexts.length) {
      add('error', 'duplicate-answer-text', q.id, 'Två svarsalternativ har samma text.');
    }

    for (const answer of q.answers) {
      if (answer.text.trim().length === 0) {
        add('error', 'empty-answer', q.id, 'Ett svarsalternativ saknar text.');
      }
      if (answer.misconceptionId && !input.misconceptionIds.has(answer.misconceptionId)) {
        add(
          'error',
          'unknown-misconception',
          q.id,
          `Okänd missuppfattning "${answer.misconceptionId}".`,
        );
      }
      if (answer.id === q.correctAnswerId && answer.misconceptionId) {
        add(
          'error',
          'misconception-on-correct',
          q.id,
          'Det rätta svaret är taggat med en missuppfattning.',
        );
      }
    }

    /* ---- Explanation and difficulty ----------------------------------- */
    if (q.shortExplanation.trim().length === 0) {
      add('error', 'missing-explanation', q.id, 'Saknar kort förklaring.');
    } else if (q.shortExplanation.trim().length < MIN_EXPLANATION_CHARS) {
      add(
        'warning',
        'short-explanation',
        q.id,
        `Förklaringen är bara ${q.shortExplanation.trim().length} tecken — lär den ut regeln?`,
      );
    }

    if (![1, 2, 3].includes(q.difficulty)) {
      add('error', 'bad-difficulty', q.id, `Ogiltig svårighetsgrad ${String(q.difficulty)}.`);
    }

    if (q.prompt.trim().length === 0) {
      add('error', 'missing-prompt', q.id, 'Saknar frågetext.');
    }

    /* ---- Sources ------------------------------------------------------ */
    if (q.sourceReferences.length === 0) {
      add('error', 'missing-source', q.id, 'Saknar källhänvisning.');
    }

    for (const ref of q.sourceReferences) {
      if (!ref.name || ref.name.trim().length === 0) {
        add('error', 'source-without-name', q.id, 'En källhänvisning saknar namn.');
      }
      if (ref.sourceId !== undefined) {
        const source = sourceById.get(ref.sourceId);
        if (!source) {
          add('error', 'unknown-source-id', q.id, `Okänd källa "${ref.sourceId}".`);
        } else {
          // Third-party material must carry a rights holder, or the
          // attribution shown to the user would be incomplete.
          if (source.permission !== 'own-work' && source.permission !== 'public-legal') {
            if (!source.rightsHolder) {
              add(
                'error',
                'missing-rights-holder',
                q.id,
                `Källan "${source.id}" saknar rättighetshavare.`,
              );
            }
          }
          for (const page of ref.sourcePages ?? []) {
            if (!Number.isInteger(page) || page < 1) {
              add('error', 'bad-source-page', q.id, `Ogiltigt sidnummer ${page}.`);
            } else if (source.pageCount !== undefined && page > source.pageCount) {
              add(
                'error',
                'source-page-out-of-range',
                q.id,
                `Sidan ${page} finns inte i "${source.id}" (${source.pageCount} sidor).`,
              );
            }
          }
        }
      }
      if (ref.sourcePages !== undefined && ref.sourceId === undefined) {
        add(
          'warning',
          'pages-without-source',
          q.id,
          'Sidhänvisning utan sourceId — attributionen kan inte slås upp i registret.',
        );
      }
    }

    /* ---- Review status ------------------------------------------------ */
    if (q.status === 'verified' && !q.lastReviewedAt) {
      add(
        'error',
        'verified-without-date',
        q.id,
        'Status "verified" utan verifieringsdatum.',
      );
    }

    /* ---- Cross-references --------------------------------------------- */
    for (const related of q.relatedQuestionIds ?? []) {
      if (related === q.id) {
        add('warning', 'self-reference', q.id, 'Frågan länkar till sig själv.');
      }
    }
  }

  /* ---- Bank-level: related ids must resolve --------------------------- */
  for (const q of input.questions) {
    for (const related of q.relatedQuestionIds ?? []) {
      if (!seenIds.has(related)) {
        add('error', 'dangling-related', q.id, `Länkar till okänd fråga "${related}".`);
      }
    }
  }

  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');
  return { issues, errors, warnings, checked: input.questions.length };
}

/* ------------------------------------------------------------------ */
/* Duplicate detection                                                 */
/* ------------------------------------------------------------------ */

export interface DuplicatePair {
  a: string;
  b: string;
  /** 1 = identical after normalisation. */
  score: number;
  kind: 'exact-prompt' | 'similar-prompt' | 'identical-answers' | 'repeated-explanation';
}

export interface DuplicateOptions {
  /** Similarity at or above which two prompts are reported. */
  threshold?: number;
}

/**
 * Find likely duplicates.
 *
 * Deliberately simple: normalised exact matches plus Jaccard token overlap.
 * No dependencies, no model. It reports rather than judges — near-identical
 * prompts are sometimes legitimate (a variant that changes one condition),
 * so the output is a list for a human to read.
 */
export function findDuplicates(
  questions: readonly Question[],
  options: DuplicateOptions = {},
): DuplicatePair[] {
  const threshold = options.threshold ?? 0.8;
  const pairs: DuplicatePair[] = [];

  const byPrompt = new Map<string, string[]>();
  const byAnswers = new Map<string, string[]>();
  const byExplanation = new Map<string, string[]>();

  for (const q of questions) {
    const prompt = normalisePrompt(q.prompt);
    byPrompt.set(prompt, [...(byPrompt.get(prompt) ?? []), q.id]);

    // Scoped to the subcategory on purpose. Two unrelated questions can
    // legitimately share an option set — "30 / 40 / 50 / 70 km/h" is a natural
    // list of plausible speeds for several different rules. Inside one
    // subcategory the same set is a copy-paste smell.
    const answerKey =
      q.subcategory +
      '::' +
      q.answers
        .map((a) => normalisePrompt(a.text))
        .sort()
        .join('|');
    byAnswers.set(answerKey, [...(byAnswers.get(answerKey) ?? []), q.id]);

    const explanation = normalisePrompt(q.shortExplanation);
    byExplanation.set(explanation, [...(byExplanation.get(explanation) ?? []), q.id]);
  }

  const emitGroups = (
    groups: Map<string, string[]>,
    kind: DuplicatePair['kind'],
  ) => {
    for (const ids of groups.values()) {
      if (ids.length < 2) continue;
      for (let i = 0; i < ids.length; i += 1) {
        for (let j = i + 1; j < ids.length; j += 1) {
          pairs.push({ a: ids[i]!, b: ids[j]!, score: 1, kind });
        }
      }
    }
  };

  emitGroups(byPrompt, 'exact-prompt');
  emitGroups(byAnswers, 'identical-answers');
  emitGroups(byExplanation, 'repeated-explanation');

  // Near-duplicate prompts. O(n²) on a few hundred items is fine.
  const exact = new Set(pairs.filter((p) => p.kind === 'exact-prompt').map((p) => `${p.a}|${p.b}`));
  for (let i = 0; i < questions.length; i += 1) {
    for (let j = i + 1; j < questions.length; j += 1) {
      const a = questions[i]!;
      const b = questions[j]!;
      if (exact.has(`${a.id}|${b.id}`)) continue;
      const score = similarity(a.prompt, b.prompt);
      if (score >= threshold) {
        pairs.push({ a: a.id, b: b.id, score: Math.round(score * 100) / 100, kind: 'similar-prompt' });
      }
    }
  }

  return pairs.sort((x, y) => y.score - x.score || x.a.localeCompare(y.a));
}
