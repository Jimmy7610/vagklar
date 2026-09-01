import {
  CURRICULUM_CHAPTERS,
  CURRICULUM_CONCEPTS,
  MAJOR_AREAS,
} from '@/content/curriculum/curriculum';
import type {
  ConceptImportance,
  CurriculumConcept,
  MajorAreaId,
} from '@/content/curriculum/curriculum';
import { QUESTIONS } from '@/domain/content/bank';
import { LESSONS } from '@/content/lessons';
import { SCENARIOS } from '@/content/scenarios';
import type { Question } from '@/domain/content/types';

/**
 * Curriculum coverage.
 *
 * Answers one question honestly: how much of the theory does Vägklar actually
 * teach? Coverage is computed, never hand-maintained, so it cannot drift away
 * from the real content. Everything here is pure.
 *
 * A concept is matched to content through Vägklar's own taxonomy: the concept
 * declares which subcategory it belongs to, and questions, lessons and
 * scenarios declare the same. Concepts with `subcategory: null` are parts of
 * the curriculum that have no home in the taxonomy yet — those are the most
 * important gaps, and they are reported as such rather than quietly ignored.
 */

export type CoverageStatus = 'missing' | 'thin' | 'covered' | 'strong';

export interface ConceptCoverage {
  concept: CurriculumConcept;
  questionCount: number;
  /** Question ids backing this concept, for drill-down. */
  questionIds: string[];
  lessonCount: number;
  scenarioCount: number;
  status: CoverageStatus;
  /** True when the concept has no subcategory in the taxonomy at all. */
  unmapped: boolean;
}

export interface ChapterCoverage {
  chapterId: string;
  title: string;
  majorArea: MajorAreaId;
  startPage: number;
  endPage: number;
  concepts: ConceptCoverage[];
  questionCount: number;
  conceptsCovered: number;
  conceptsTotal: number;
  /** 0–1. */
  ratio: number;
}

export interface AreaCoverage {
  majorArea: MajorAreaId;
  title: string;
  chapters: ChapterCoverage[];
  questionCount: number;
  conceptsCovered: number;
  conceptsTotal: number;
  ratio: number;
}

export type GapPriority = 1 | 2 | 3;

export interface CoverageGap {
  conceptId: string;
  topic: string;
  chapterTitle: string;
  majorArea: MajorAreaId;
  importance: ConceptImportance;
  sourcePages: number[];
  questionCount: number;
  unmapped: boolean;
  priority: GapPriority;
  reason: string;
}

export interface CoverageReport {
  areas: AreaCoverage[];
  gaps: CoverageGap[];
  totals: {
    questions: number;
    /** Questions whose subcategory matches at least one curriculum concept. */
    mappedQuestions: number;
    unmappedQuestions: number;
    concepts: number;
    conceptsCovered: number;
    conceptsMissing: number;
    conceptsUnmapped: number;
    chapters: number;
    lessons: number;
    scenarios: number;
    ratio: number;
  };
}

/** Thresholds for how much content a concept needs to count as covered. */
export const COVERAGE_THRESHOLDS = { thin: 1, covered: 3, strong: 6 } as const;

function statusFor(questionCount: number): CoverageStatus {
  if (questionCount === 0) return 'missing';
  if (questionCount < COVERAGE_THRESHOLDS.covered) return 'thin';
  if (questionCount < COVERAGE_THRESHOLDS.strong) return 'covered';
  return 'strong';
}

function priorityFor(concept: CurriculumConcept, questionCount: number): GapPriority {
  if (concept.importance === 'core' && questionCount === 0) return 1;
  if (concept.importance === 'core') return 2;
  if (concept.importance === 'supporting' && questionCount === 0) return 2;
  return 3;
}

function reasonFor(concept: CurriculumConcept, questionCount: number, unmapped: boolean): string {
  if (unmapped) {
    return 'Ingår i kursplanen men saknar delområde i Vägklars taxonomi.';
  }
  if (questionCount === 0) {
    return `Inga frågor täcker begreppet (${concept.importance === 'core' ? 'kärnbegrepp' : 'stödbegrepp'}).`;
  }
  return `Endast ${questionCount} ${questionCount === 1 ? 'fråga' : 'frågor'} — behöver fler för variation.`;
}

export interface CoverageInput {
  questions: readonly Question[];
  lessonSubcategories: readonly string[][];
  scenarioSubcategories: readonly string[];
}

function defaultInput(): CoverageInput {
  return {
    questions: QUESTIONS,
    lessonSubcategories: LESSONS.map((l) => l.subcategoryIds),
    scenarioSubcategories: SCENARIOS.map((s) => s.subcategory),
  };
}

/**
 * Build the full coverage report.
 *
 * Injectable so tests can drive it with fixtures rather than the live bank.
 */
export function computeCoverage(input: CoverageInput = defaultInput()): CoverageReport {
  const questionsBySubcategory = new Map<string, Question[]>();
  for (const question of input.questions) {
    const bucket = questionsBySubcategory.get(question.subcategory);
    if (bucket) bucket.push(question);
    else questionsBySubcategory.set(question.subcategory, [question]);
  }

  const lessonCounts = new Map<string, number>();
  for (const ids of input.lessonSubcategories) {
    for (const id of ids) lessonCounts.set(id, (lessonCounts.get(id) ?? 0) + 1);
  }

  const scenarioCounts = new Map<string, number>();
  for (const id of input.scenarioSubcategories) {
    scenarioCounts.set(id, (scenarioCounts.get(id) ?? 0) + 1);
  }

  const conceptsByChapter = new Map<string, CurriculumConcept[]>();
  for (const concept of CURRICULUM_CONCEPTS) {
    const bucket = conceptsByChapter.get(concept.chapterId);
    if (bucket) bucket.push(concept);
    else conceptsByChapter.set(concept.chapterId, [concept]);
  }

  const gaps: CoverageGap[] = [];

  const chapterCoverages: ChapterCoverage[] = CURRICULUM_CHAPTERS.map((chapter) => {
    const concepts = conceptsByChapter.get(chapter.id) ?? [];

    const conceptCoverages: ConceptCoverage[] = concepts.map((concept) => {
      const unmapped = concept.subcategory === null;
      const questions = concept.subcategory
        ? (questionsBySubcategory.get(concept.subcategory) ?? [])
        : [];
      const questionCount = questions.length;
      const status = statusFor(questionCount);

      if (status === 'missing' || status === 'thin' || unmapped) {
        gaps.push({
          conceptId: concept.id,
          topic: concept.topic,
          chapterTitle: chapter.title,
          majorArea: chapter.majorArea,
          importance: concept.importance,
          sourcePages: concept.sourcePages,
          questionCount,
          unmapped,
          priority: priorityFor(concept, questionCount),
          reason: reasonFor(concept, questionCount, unmapped),
        });
      }

      return {
        concept,
        questionCount,
        questionIds: questions.map((q) => q.id),
        lessonCount: concept.subcategory ? (lessonCounts.get(concept.subcategory) ?? 0) : 0,
        scenarioCount: concept.subcategory ? (scenarioCounts.get(concept.subcategory) ?? 0) : 0,
        status,
        unmapped,
      };
    });

    // A chapter's question count is the distinct questions across its
    // subcategories — summing per concept would double-count shared ones.
    const chapterQuestionIds = new Set<string>();
    for (const subcategory of chapter.subcategories) {
      for (const q of questionsBySubcategory.get(subcategory) ?? []) chapterQuestionIds.add(q.id);
    }

    const conceptsCovered = conceptCoverages.filter(
      (c) => c.status === 'covered' || c.status === 'strong',
    ).length;

    return {
      chapterId: chapter.id,
      title: chapter.title,
      majorArea: chapter.majorArea,
      startPage: chapter.startPage,
      endPage: chapter.endPage,
      concepts: conceptCoverages,
      questionCount: chapterQuestionIds.size,
      conceptsCovered,
      conceptsTotal: conceptCoverages.length,
      ratio: conceptCoverages.length > 0 ? conceptsCovered / conceptCoverages.length : 0,
    };
  });

  const areas: AreaCoverage[] = MAJOR_AREAS.map((area) => {
    const chapters = chapterCoverages.filter((c) => c.majorArea === area.id);
    const conceptsTotal = chapters.reduce((s, c) => s + c.conceptsTotal, 0);
    const conceptsCovered = chapters.reduce((s, c) => s + c.conceptsCovered, 0);
    return {
      majorArea: area.id,
      title: area.title,
      chapters,
      questionCount: chapters.reduce((s, c) => s + c.questionCount, 0),
      conceptsCovered,
      conceptsTotal,
      ratio: conceptsTotal > 0 ? conceptsCovered / conceptsTotal : 0,
    };
  });

  // Which questions land on a subcategory the curriculum actually names?
  const mappedSubcategories = new Set(
    CURRICULUM_CONCEPTS.flatMap((c) => (c.subcategory ? [c.subcategory] : [])),
  );
  const mappedQuestions = input.questions.filter((q) =>
    mappedSubcategories.has(q.subcategory),
  ).length;

  const conceptsCovered = chapterCoverages.reduce((s, c) => s + c.conceptsCovered, 0);
  const conceptsMissing = chapterCoverages.reduce(
    (s, c) => s + c.concepts.filter((x) => x.status === 'missing').length,
    0,
  );

  gaps.sort(
    (a, b) =>
      a.priority - b.priority ||
      a.questionCount - b.questionCount ||
      a.topic.localeCompare(b.topic, 'sv'),
  );

  return {
    areas,
    gaps,
    totals: {
      questions: input.questions.length,
      mappedQuestions,
      unmappedQuestions: input.questions.length - mappedQuestions,
      concepts: CURRICULUM_CONCEPTS.length,
      conceptsCovered,
      conceptsMissing,
      conceptsUnmapped: CURRICULUM_CONCEPTS.filter((c) => c.subcategory === null).length,
      chapters: CURRICULUM_CHAPTERS.length,
      lessons: input.lessonSubcategories.length,
      scenarios: input.scenarioSubcategories.length,
      ratio:
        CURRICULUM_CONCEPTS.length > 0 ? conceptsCovered / CURRICULUM_CONCEPTS.length : 0,
    },
  };
}

/** Gaps at a given priority, most severe first. */
export function gapsByPriority(report: CoverageReport, priority: GapPriority): CoverageGap[] {
  return report.gaps.filter((g) => g.priority === priority);
}
