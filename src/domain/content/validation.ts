import type { Question } from './types';
import type { CurriculumConcept } from '@/content/curriculum/curriculum';
import type { SourceEntry } from '@/content/sources';
import type { SourceImage } from '@/content/source-images';
import type { RoadSign } from '@/content/road-signs';
import type { RoadMarking } from '@/content/road-markings';
import type { Lesson } from './types';

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
  /** The source-image registry, for validating image-backed content. */
  sourceImages?: readonly SourceImage[];
  /** Asset slugs that actually exist on disk. */
  availableAssets?: ReadonlySet<string>;
  /** Lessons, so lesson image blocks are validated too. */
  lessons?: readonly Lesson[];
  /** The road sign registry. */
  roadSigns?: readonly RoadSign[];
  /** Sign ids that actually have a drawing. */
  availableSignGlyphs?: ReadonlySet<string>;
  /** The road marking registry. */
  roadMarkings?: readonly RoadMarking[];
  /** Marking ids that actually have a drawing. */
  availableMarkingGlyphs?: ReadonlySet<string>;
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
  // Reverse lookup by the strings a reference is likely to carry. A reference
  // that names a registered source but does not link to it cannot be traced
  // back to its rights holder, edition or page count — which is the whole
  // reason the registry exists.
  const sourceIdByName = new Map<string, string>();
  for (const source of input.sources) {
    for (const name of [source.title, source.attribution, source.publisher]) {
      if (name) sourceIdByName.set(name.trim().toLowerCase(), source.id);
    }
  }
  const imageById = new Map((input.sourceImages ?? []).map((i) => [i.id, i]));
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
      if (ref.sourceId === undefined) {
        const known = sourceIdByName.get((ref.name ?? '').trim().toLowerCase());
        if (known) {
          add(
            'error',
            'source-not-linked',
            q.id,
            `Hänvisningen "${ref.name}" motsvarar källan "${known}" men saknar sourceId.`,
          );
        }
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
    // "Verified" is the only status that claims a human checked the statement
    // against a named source. It therefore has to carry the evidence: who,
    // when, and against what. Without that the word means nothing, and a bank
    // full of unearned "verified" is worse than one that admits it is unverified.
    if (q.status === 'verified') {
      if (!q.lastReviewedAt) {
        add('error', 'verified-without-date', q.id, 'Status "verified" utan granskningsdatum.');
      }
      if (!q.verifiedAt) {
        add('error', 'verified-without-signoff-date', q.id, 'Status "verified" utan verifiedAt.');
      }
      if (!q.verifiedBy || q.verifiedBy.trim().length === 0) {
        add('error', 'verified-without-verifier', q.id, 'Status "verified" utan namngiven granskare.');
      }
      if (!q.verificationSourceIds || q.verificationSourceIds.length === 0) {
        add(
          'error',
          'verified-without-sources',
          q.id,
          'Status "verified" utan angivna källor som kontrollerats.',
        );
      }
      for (const id of q.verificationSourceIds ?? []) {
        if (!sourceById.has(id)) {
          add('error', 'verification-unknown-source', q.id, `Okänd verifieringskälla "${id}".`);
        }
      }
    }

    // The reverse: sign-off metadata on something that is not verified is a
    // half-finished review, and it would otherwise sit unnoticed forever.
    if (q.status !== 'verified' && (q.verifiedAt || q.verifiedBy)) {
      add(
        'warning',
        'signoff-without-verified-status',
        q.id,
        `Har verifieringsuppgifter men status "${q.status}".`,
      );
    }

    if (q.status === 'rejected' && !q.reviewNotes) {
      add('warning', 'rejected-without-reason', q.id, 'Avvisad fråga utan motivering i reviewNotes.');
    }

    /* ---- Source images -------------------------------------------------- */
    if (q.sourceImageId !== undefined) {
      const image = imageById.get(q.sourceImageId);
      if (!image) {
        add('error', 'unknown-source-image', q.id, `Okänd källbild "${q.sourceImageId}".`);
      } else {
        if (image.status !== 'approved') {
          add(
            'error',
            'unapproved-source-image',
            q.id,
            `Källbilden "${image.id}" har status "${image.status}" och får inte visas.`,
          );
        }
        if (input.availableAssets && !input.availableAssets.has(image.asset)) {
          add(
            'error',
            'missing-image-asset',
            q.id,
            `Bildfilen för "${image.asset}" saknas på disk.`,
          );
        }
      }
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

  /* ---- The road sign registry ------------------------------------------ */
  const signIds = new Set<string>();
  const validCategories = new Set([
    'varning',
    'vajningsplikt',
    'forbud',
    'pabud',
    'anvisning',
    'tillaggstavla',
  ]);
  for (const roadSign of input.roadSigns ?? []) {
    const where = `skylt:${roadSign.id}`;
    if (signIds.has(roadSign.id)) {
      add('error', 'duplicate-sign-id', where, `Skylt-id ${roadSign.id} används mer än en gång.`);
    }
    signIds.add(roadSign.id);

    if (!validCategories.has(roadSign.category)) {
      add('error', 'sign-bad-category', where, `Okänd kategori "${roadSign.category}".`);
    }
    if (roadSign.name.trim().length === 0) {
      add('error', 'sign-without-name', where, 'Skylten saknar namn.');
    }
    if (roadSign.shortMeaning.trim().length === 0 || roadSign.longMeaning.trim().length < 30) {
      add('error', 'sign-without-meaning', where, 'Skylten saknar användbar innebörd.');
    }
    if (roadSign.altText.trim().length < 15) {
      add('error', 'sign-without-alt', where, 'Skylten saknar beskrivande alt-text.');
    }
    if (!input.subcategoryIds.has(roadSign.subcategory)) {
      add('error', 'sign-unknown-subcategory', where, `Okänt delområde "${roadSign.subcategory}".`);
    }
    if (input.availableSignGlyphs && !input.availableSignGlyphs.has(roadSign.id)) {
      add('error', 'sign-without-glyph', where, `Skylten "${roadSign.id}" saknar ritning.`);
    }
  }

  // Confusion pairs must point at signs that exist, and never at themselves.
  for (const roadSign of input.roadSigns ?? []) {
    for (const similar of roadSign.similarSignIds) {
      if (similar === roadSign.id) {
        add('error', 'sign-self-similar', `skylt:${roadSign.id}`, 'Skylten listar sig själv som förväxlingsbar.');
      } else if (!signIds.has(similar)) {
        add(
          'error',
          'sign-dangling-similar',
          `skylt:${roadSign.id}`,
          `Hänvisar till okänd skylt "${similar}".`,
        );
      }
    }
  }

  // A question illustration must resolve against one of the two vector
  // registries — signs or markings. The renderer picks by id, so either is
  // valid; naming neither is a broken image.
  if (input.availableSignGlyphs || input.availableMarkingGlyphs) {
    for (const q of input.questions) {
      const illustration = q.image?.illustration;
      if (!illustration) continue;
      const drawable =
        (input.availableSignGlyphs?.has(illustration) ?? false) ||
        (input.availableMarkingGlyphs?.has(illustration) ?? false);
      if (!drawable) {
        add('error', 'unknown-sign-illustration', q.id, `Okänd ritning "${illustration}".`);
      }
    }
  }

  /* ---- The road marking registry ---------------------------------------- */
  const markingIds = new Set<string>();
  const validMarkingCategories = new Set(['langsgaende', 'tvargaende', 'symbol', 'omrade']);
  for (const m of input.roadMarkings ?? []) {
    const where = `markering:${m.id}`;
    if (markingIds.has(m.id)) {
      add('error', 'duplicate-marking-id', where, `Markerings-id ${m.id} används mer än en gång.`);
    }
    markingIds.add(m.id);

    if (!validMarkingCategories.has(m.category)) {
      add('error', 'marking-bad-category', where, `Okänd kategori "${m.category}".`);
    }
    if (m.name.trim().length === 0) {
      add('error', 'marking-without-name', where, 'Markeringen saknar namn.');
    }
    // Both halves matter: what it is, and what it demands of the driver.
    if (m.meaning.trim().length < 20 || m.forDriver.trim().length < 30) {
      add('error', 'marking-without-meaning', where, 'Markeringen saknar användbar innebörd.');
    }
    if (m.altText.trim().length < 15) {
      add('error', 'marking-without-alt', where, 'Markeringen saknar beskrivande alt-text.');
    }
    if (!input.subcategoryIds.has(m.subcategory)) {
      add('error', 'marking-unknown-subcategory', where, `Okänt delområde "${m.subcategory}".`);
    }
    if (input.availableMarkingGlyphs && !input.availableMarkingGlyphs.has(m.id)) {
      add('error', 'marking-without-glyph', where, `Markeringen "${m.id}" saknar ritning.`);
    }
    for (const signId of m.relatedSignIds) {
      if (signIds.size > 0 && !signIds.has(signId)) {
        add('error', 'marking-dangling-sign', where, `Hänvisar till okänd skylt "${signId}".`);
      }
    }
  }

  for (const m of input.roadMarkings ?? []) {
    for (const similar of m.similarMarkingIds) {
      if (similar === m.id) {
        add('error', 'marking-self-similar', `markering:${m.id}`, 'Markeringen listar sig själv.');
      } else if (!markingIds.has(similar)) {
        add(
          'error',
          'marking-dangling-similar',
          `markering:${m.id}`,
          `Hänvisar till okänd markering "${similar}".`,
        );
      }
    }
  }

  /* ---- Lesson marking blocks -------------------------------------------- */
  for (const lesson of input.lessons ?? []) {
    for (const block of lesson.blocks) {
      const where = `lektion:${lesson.id}`;
      if (block.kind === 'markingGrid') {
        for (const id of block.markingIds) {
          if (markingIds.size > 0 && !markingIds.has(id)) {
            add('error', 'unknown-marking', where, `Okänd markering "${id}".`);
          }
        }
      }
      if (block.kind === 'markingCompare') {
        for (const id of [block.leftId, block.rightId]) {
          if (markingIds.size > 0 && !markingIds.has(id)) {
            add('error', 'unknown-marking', where, `Okänd markering "${id}".`);
          }
        }
      }
    }
  }

  /* ---- The source-image registry itself -------------------------------- */
  const seenImageIds = new Set<string>();
  for (const image of input.sourceImages ?? []) {
    const where = `bild:${image.id}`;
    if (seenImageIds.has(image.id)) {
      add('error', 'duplicate-image-id', where, `Bild-id ${image.id} används mer än en gång.`);
    }
    seenImageIds.add(image.id);

    if (image.altText.trim().length === 0) {
      add('error', 'image-without-alt', where, 'Källbilden saknar alt-text.');
    }
    if (image.longDescription.trim().length < 40) {
      add(
        'error',
        'image-without-description',
        where,
        'Källbilden saknar en användbar långbeskrivning.',
      );
    }
    if (!image.rightsHolder || image.rightsHolder.trim().length === 0) {
      add('error', 'image-without-rights-holder', where, 'Källbilden saknar rättighetshavare.');
    }
    if (!image.usedWithPermission) {
      add(
        'error',
        'image-without-permission',
        where,
        'Källbilden är inte markerad som använd med tillstånd.',
      );
    }
    if (!input.subcategoryIds.has(image.subcategory)) {
      add('error', 'image-unknown-subcategory', where, `Okänt delområde "${image.subcategory}".`);
    }

    const source = sourceById.get(image.sourceId);
    if (!source) {
      add('error', 'image-unknown-source', where, `Okänd källa "${image.sourceId}".`);
    } else if (source.pageCount !== undefined) {
      if (!Number.isInteger(image.sourcePage) || image.sourcePage < 1) {
        add('error', 'image-bad-source-page', where, `Ogiltigt sidnummer ${image.sourcePage}.`);
      } else if (image.sourcePage > source.pageCount) {
        add(
          'error',
          'image-source-page-out-of-range',
          where,
          `Sidan ${image.sourcePage} finns inte i "${source.id}".`,
        );
      }
    }

    if (input.availableAssets && image.status === 'approved' && !input.availableAssets.has(image.asset)) {
      add('error', 'missing-image-asset', where, `Bildfilen för "${image.asset}" saknas på disk.`);
    }
  }

  /* ---- Lesson image blocks --------------------------------------------- */
  for (const lesson of input.lessons ?? []) {
    for (const block of lesson.blocks) {
      if (block.kind !== 'sourceImage') continue;
      const where = `lektion:${lesson.id}`;
      const image = imageById.get(block.imageId);
      if (!image) {
        add('error', 'unknown-source-image', where, `Okänd källbild "${block.imageId}".`);
      } else if (image.status !== 'approved') {
        add(
          'error',
          'unapproved-source-image',
          where,
          `Källbilden "${image.id}" har status "${image.status}".`,
        );
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
