import { describe, expect, it } from 'vitest';
import {
  CHAPTER_BY_ID,
  CURRICULUM_CHAPTERS,
  CURRICULUM_CONCEPTS,
  MAJOR_AREAS,
} from '@/content/curriculum/curriculum';
import { LESSONS } from '@/content/lessons';
import { SOURCES, SOURCE_BY_ID, getSource, RIGHTS } from '@/content/sources';
import { SUBCATEGORY_BY_ID } from '@/content/taxonomy';
import { ALL_QUESTIONS } from '@/content/questions';
import { computeCoverage, gapsByPriority } from './coverage';
import type { Question } from '@/domain/content/types';

const report = computeCoverage();
const primary = getSource('teoribok-2026-1')!;

describe('curriculum integrity', () => {
  it('has unique chapter and concept ids', () => {
    const chapters = CURRICULUM_CHAPTERS.map((c) => c.id);
    const concepts = CURRICULUM_CONCEPTS.map((c) => c.id);
    expect(new Set(chapters).size).toBe(chapters.length);
    expect(new Set(concepts).size).toBe(concepts.length);
  });

  it('assigns every chapter to a known major area', () => {
    const areas = new Set(MAJOR_AREAS.map((a) => a.id));
    for (const chapter of CURRICULUM_CHAPTERS) {
      expect(areas.has(chapter.majorArea), chapter.id).toBe(true);
    }
  });

  it('attaches every concept to a real chapter, in the same area', () => {
    const byId = new Map(CURRICULUM_CHAPTERS.map((c) => [c.id, c]));
    for (const concept of CURRICULUM_CONCEPTS) {
      const chapter = byId.get(concept.chapterId);
      expect(chapter, concept.id).toBeDefined();
      expect(chapter?.majorArea, concept.id).toBe(concept.majorArea);
    }
  });

  it('keeps chapter page ranges ordered and non-overlapping', () => {
    const sorted = [...CURRICULUM_CHAPTERS].sort((a, b) => a.startPage - b.startPage);
    for (let i = 0; i < sorted.length; i += 1) {
      const chapter = sorted[i]!;
      expect(chapter.endPage, chapter.id).toBeGreaterThanOrEqual(chapter.startPage);
      const next = sorted[i + 1];
      if (next) expect(next.startPage, `${chapter.id} → ${next.id}`).toBeGreaterThan(chapter.endPage);
    }
  });

  it('cites only pages that exist in the source', () => {
    expect(primary.pageCount).toBeGreaterThan(0);
    for (const chapter of CURRICULUM_CHAPTERS) {
      expect(chapter.startPage, chapter.id).toBeGreaterThan(0);
      expect(chapter.endPage, chapter.id).toBeLessThanOrEqual(primary.pageCount!);
    }
    for (const concept of CURRICULUM_CONCEPTS) {
      expect(concept.sourcePages.length, concept.id).toBeGreaterThan(0);
      for (const p of concept.sourcePages) {
        expect(p, concept.id).toBeGreaterThan(0);
        expect(p, concept.id).toBeLessThanOrEqual(primary.pageCount!);
      }
    }
  });

  it('keeps every concept inside its own chapter page range', () => {
    const byId = new Map(CURRICULUM_CHAPTERS.map((c) => [c.id, c]));
    for (const concept of CURRICULUM_CONCEPTS) {
      const chapter = byId.get(concept.chapterId)!;
      for (const p of concept.sourcePages) {
        expect(p, `${concept.id} page ${p}`).toBeGreaterThanOrEqual(chapter.startPage);
        expect(p, `${concept.id} page ${p}`).toBeLessThanOrEqual(chapter.endPage);
      }
    }
  });

  it('only maps concepts onto subcategories that exist', () => {
    for (const concept of CURRICULUM_CONCEPTS) {
      if (concept.subcategory === null) continue;
      expect(SUBCATEGORY_BY_ID.has(concept.subcategory), concept.id).toBe(true);
    }
    for (const chapter of CURRICULUM_CHAPTERS) {
      for (const id of chapter.subcategories) {
        expect(SUBCATEGORY_BY_ID.has(id), `${chapter.id} → ${id}`).toBe(true);
      }
    }
  });
});

describe('coverage report', () => {
  it('counts every question and every concept', () => {
    expect(report.totals.questions).toBe(ALL_QUESTIONS.length);
    expect(report.totals.concepts).toBe(CURRICULUM_CONCEPTS.length);
    expect(report.totals.chapters).toBe(CURRICULUM_CHAPTERS.length);
  });

  it('splits questions into mapped and unmapped without losing any', () => {
    expect(report.totals.mappedQuestions + report.totals.unmappedQuestions).toBe(
      report.totals.questions,
    );
    expect(report.totals.mappedQuestions).toBeGreaterThan(0);
  });

  it('covers every major area in the report', () => {
    expect(report.areas).toHaveLength(MAJOR_AREAS.length);
    for (const area of report.areas) {
      expect(area.conceptsTotal).toBeGreaterThan(0);
      expect(area.ratio).toBeGreaterThanOrEqual(0);
      expect(area.ratio).toBeLessThanOrEqual(1);
    }
  });

  it('reports concepts with no taxonomy home as unmapped gaps', () => {
    const unmapped = CURRICULUM_CONCEPTS.filter((c) => c.subcategory === null);
    expect(report.totals.conceptsUnmapped).toBe(unmapped.length);
    for (const concept of unmapped) {
      const gap = report.gaps.find((g) => g.conceptId === concept.id);
      expect(gap, concept.id).toBeDefined();
      expect(gap?.unmapped).toBe(true);
    }
  });

  it('ranks core gaps with no questions as priority 1', () => {
    for (const gap of gapsByPriority(report, 1)) {
      expect(gap.importance).toBe('core');
      expect(gap.questionCount).toBe(0);
    }
    expect(gapsByPriority(report, 1).length).toBeGreaterThan(0);
  });

  it('sorts gaps most severe first', () => {
    for (let i = 1; i < report.gaps.length; i += 1) {
      expect(report.gaps[i]!.priority).toBeGreaterThanOrEqual(report.gaps[i - 1]!.priority);
    }
  });

  it('gives every gap an actionable reason and its source pages', () => {
    for (const gap of report.gaps) {
      expect(gap.reason.length, gap.conceptId).toBeGreaterThan(10);
      expect(gap.sourcePages.length, gap.conceptId).toBeGreaterThan(0);
    }
  });

  it('is driven by the content, not hard-coded', () => {
    const question = ALL_QUESTIONS[0]!;
    const fake: Question[] = Array.from({ length: 12 }, (_, i) => ({
      ...question,
      id: `fake-${i}`,
      subcategory: 'hogerregeln',
    }));

    const custom = computeCoverage({
      questions: fake,
      lessonSubcategories: [],
      scenarioSubcategories: [],
    });

    expect(custom.totals.questions).toBe(12);
    const hogerregeln = custom.areas
      .flatMap((a) => a.chapters)
      .flatMap((c) => c.concepts)
      .find((c) => c.concept.id === 'hogerregeln');
    expect(hogerregeln?.questionCount).toBe(12);
    expect(hogerregeln?.status).toBe('strong');
  });

  it('counts a chapter question only once when concepts share a subcategory', () => {
    const vajning = report.areas
      .flatMap((a) => a.chapters)
      .find((c) => c.chapterId === 'vajningsregler');
    expect(vajning).toBeDefined();
    const summed = vajning!.concepts.reduce((s, c) => s + c.questionCount, 0);
    // Concepts share subcategories, so the naive sum overstates the chapter.
    expect(vajning!.questionCount).toBeLessThan(summed);
  });
});

describe('source registry', () => {
  it('has unique ids and an attribution for every source', () => {
    const ids = SOURCES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const source of SOURCES) {
      expect(source.attribution.length, source.id).toBeGreaterThan(5);
      expect(SOURCE_BY_ID.get(source.id), source.id).toBe(source);
    }
  });

  it('records the rights holder and permission for third-party material', () => {
    for (const source of SOURCES.filter((s) => s.permission === 'granted')) {
      expect(source.rightsHolder, source.id).toBeTruthy();
      expect(source.attribution.toLowerCase(), source.id).toContain('tillstånd');
    }
  });

  it('describes the primary curriculum source precisely', () => {
    expect(primary.rightsHolder).toBe('Hagberg Media AB');
    expect(primary.publisher).toBe('Körkortonline.se');
    expect(primary.edition).toBe('2026-1');
    expect(primary.isbn).toBe('978-91-991023-0-6');
    expect(primary.permission).toBe('granted');
  });

  it('never attributes third-party material to Vägklar', () => {
    for (const source of SOURCES) {
      if (source.permission === 'own-work') continue;
      expect(source.rightsHolder ?? '', source.id).not.toContain('Jimmy Eliasson');
    }
  });

  it('claims no ownership over public legal texts', () => {
    for (const source of SOURCES.filter((s) => s.kind === 'regulation')) {
      expect(source.permission, source.id).toBe('public-legal');
      expect(source.rightsHolder, source.id).toBeUndefined();
    }
  });
});

describe('rights copy', () => {
  it('names the author and the current year', () => {
    expect(RIGHTS.copyright).toContain('2026');
    expect(RIGHTS.copyright).toContain('Jimmy Eliasson');
    expect(RIGHTS.copyrightShort).toContain('Jimmy Eliasson');
  });

  it('credits the third-party rights holder', () => {
    expect(RIGHTS.thirdParty).toContain('Hagberg Media AB');
    expect(RIGHTS.thirdParty).toContain('tillstånd');
  });

  it('disclaims affiliation with Trafikverket', () => {
    expect(RIGHTS.disclaimer).toContain('Trafikverket');
    expect(RIGHTS.disclaimer).toContain('inte ansluten');
  });

  it('makes no ownership claim over traffic law', () => {
    expect(RIGHTS.publicLaw).toContain('inga');
    expect(RIGHTS.publicLaw.toLowerCase()).toContain('offentlig');
  });
});

describe('question source metadata', () => {
  it('accepts source ids only when they exist in the registry', () => {
    for (const question of ALL_QUESTIONS) {
      for (const reference of question.sourceReferences) {
        if (!reference.sourceId) continue;
        expect(SOURCE_BY_ID.has(reference.sourceId), `${question.id} → ${reference.sourceId}`).toBe(
          true,
        );
      }
    }
  });

  it('keeps cited page numbers inside the cited source', () => {
    for (const question of ALL_QUESTIONS) {
      for (const reference of question.sourceReferences) {
        if (!reference.sourcePages || !reference.sourceId) continue;
        const source = SOURCE_BY_ID.get(reference.sourceId);
        if (!source?.pageCount) continue;
        for (const p of reference.sourcePages) {
          expect(p, `${question.id} page ${p}`).toBeGreaterThan(0);
          expect(p, `${question.id} page ${p}`).toBeLessThanOrEqual(source.pageCount);
        }
      }
    }
  });
});

describe('theory school ↔ curriculum mapping', () => {
  it('gives every lesson at least one curriculum chapter', () => {
    for (const lesson of LESSONS) {
      expect(lesson.curriculumChapterIds.length, lesson.id).toBeGreaterThan(0);
    }
  });

  it('only references chapters that exist', () => {
    for (const lesson of LESSONS) {
      for (const chapterId of lesson.curriculumChapterIds) {
        expect(CHAPTER_BY_ID.has(chapterId), `${lesson.id} → ${chapterId}`).toBe(true);
      }
    }
  });

  it('does not name the same chapter twice in one lesson', () => {
    for (const lesson of LESSONS) {
      const unique = new Set(lesson.curriculumChapterIds);
      expect(unique.size, lesson.id).toBe(lesson.curriculumChapterIds.length);
    }
  });

  it('keeps the lesson and its chapters in compatible parts of the syllabus', () => {
    // A lesson may legitimately span areas (risk covers Människan and more),
    // but every chapter it claims must belong to a known major area.
    for (const lesson of LESSONS) {
      for (const chapterId of lesson.curriculumChapterIds) {
        const chapter = CHAPTER_BY_ID.get(chapterId);
        expect(MAJOR_AREAS.some((area) => area.id === chapter?.majorArea)).toBe(true);
      }
    }
  });
});
