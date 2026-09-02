import { describe, expect, it } from 'vitest';
import {
  MARKING_BY_ID,
  ROAD_MARKINGS,
  SCENARIO_MARKING_KIND_TO_ID,
  getRoadMarking,
} from '@/content/road-markings';
import { MARKING_GLYPHS } from '@/ui/illustrations/markingGlyphs';
import { SIGN_BY_ID } from '@/content/road-signs';
import { SUBCATEGORIES } from '@/content/taxonomy';
import { LESSONS } from '@/content/lessons';
import { SCENARIOS } from '@/content/scenarios';
import { ALL_QUESTIONS } from '@/content/questions';
import { CURRICULUM_CONCEPTS } from '@/content/curriculum/curriculum';
import { MISCONCEPTIONS } from '@/content/misconceptions';
import { SOURCES } from '@/content/sources';
import { validateContent } from './validation';
import type { RoadMarking } from '@/content/road-markings';

const glyphIds = new Set(Object.keys(MARKING_GLYPHS));
const subcategoryIds = new Set(SUBCATEGORIES.map((s) => s.id));

describe('road marking registry', () => {
  it('has a unique id for every marking', () => {
    const ids = ROAD_MARKINGS.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has a drawing for every registered marking', () => {
    const missing = ROAD_MARKINGS.filter((m) => !glyphIds.has(m.id)).map((m) => m.id);
    expect(missing, missing.join(', ')).toHaveLength(0);
  });

  it('registers every drawing it can render', () => {
    const unregistered = [...glyphIds].filter((id) => !MARKING_BY_ID.has(id));
    expect(unregistered, unregistered.join(', ')).toHaveLength(0);
  });

  it('uses an M-code for every marking', () => {
    for (const m of ROAD_MARKINGS) {
      expect(m.code, m.id).toMatch(/^M\d+[a-z]?$/);
    }
  });

  it('says both what the marking is and what it requires of the driver', () => {
    // Kept apart on purpose: a line's meaning depends on which side you are on,
    // so "what it is" and "what you must do" are genuinely different sentences.
    for (const m of ROAD_MARKINGS) {
      expect(m.meaning.length, m.id).toBeGreaterThan(20);
      expect(m.forDriver.length, m.id).toBeGreaterThan(30);
      expect(m.forDriver, m.id).not.toBe(m.meaning);
    }
  });

  it('describes every marking for someone who cannot see it', () => {
    for (const m of ROAD_MARKINGS) {
      expect(m.altText.length, m.id).toBeGreaterThan(20);
      expect(m.altText.toLowerCase(), m.id).toContain('vägmarkering');
    }
  });

  it('maps every marking onto a subcategory that exists', () => {
    for (const m of ROAD_MARKINGS) {
      expect(subcategoryIds.has(m.subcategory), `${m.id} -> ${m.subcategory}`).toBe(true);
    }
  });

  it('only points at related signs that exist', () => {
    for (const m of ROAD_MARKINGS) {
      for (const signId of m.relatedSignIds) {
        expect(SIGN_BY_ID.has(signId), `${m.id} -> ${signId}`).toBe(true);
      }
    }
  });

  it('only points at confusion pairs that exist, and never at itself', () => {
    for (const m of ROAD_MARKINGS) {
      for (const similar of m.similarMarkingIds) {
        expect(similar, m.id).not.toBe(m.id);
        expect(MARKING_BY_ID.has(similar), `${m.id} -> ${similar}`).toBe(true);
      }
    }
  });

  it('resolves a marking by id', () => {
    expect(getRoadMarking('stopplinje')?.code).toBe('M13');
    expect(getRoadMarking('finns-inte')).toBeUndefined();
  });
});

describe('marking-backed content', () => {
  it('only lists markings that exist in lesson grids', () => {
    for (const lesson of LESSONS) {
      for (const block of lesson.blocks) {
        if (block.kind === 'markingGrid') {
          for (const id of block.markingIds) {
            expect(MARKING_BY_ID.has(id), `${lesson.id} -> ${id}`).toBe(true);
          }
        }
        if (block.kind === 'markingCompare') {
          expect(MARKING_BY_ID.has(block.leftId), `${lesson.id} -> ${block.leftId}`).toBe(true);
          expect(MARKING_BY_ID.has(block.rightId), `${lesson.id} -> ${block.rightId}`).toBe(true);
        }
      }
    }
  });

  it('compares markings that are actually declared as confusable', () => {
    for (const lesson of LESSONS) {
      for (const block of lesson.blocks) {
        if (block.kind !== 'markingCompare') continue;
        const left = MARKING_BY_ID.get(block.leftId);
        const right = MARKING_BY_ID.get(block.rightId);
        const linked =
          left?.similarMarkingIds.includes(block.rightId) ||
          right?.similarMarkingIds.includes(block.leftId);
        expect(linked, `${block.leftId} vs ${block.rightId}`).toBe(true);
      }
    }
  });

  it('has at least one question for every marking category', () => {
    const used = new Set(
      ALL_QUESTIONS.map((q) => q.image?.illustration).filter(
        (id): id is string => id !== undefined && MARKING_BY_ID.has(id),
      ),
    );
    const categories = new Set([...used].map((id) => MARKING_BY_ID.get(id)!.category));
    expect(categories.size).toBeGreaterThanOrEqual(3);
  });
});

describe('Scenario Lab reuse', () => {
  it('only uses signs that exist in the central registry', () => {
    for (const scenario of SCENARIOS) {
      for (const sign of scenario.signs ?? []) {
        expect(SIGN_BY_ID.has(sign.sign), `${scenario.id} -> ${sign.sign}`).toBe(true);
      }
      for (const variant of scenario.variants ?? []) {
        for (const sign of variant.patch.signs ?? []) {
          expect(SIGN_BY_ID.has(sign.sign), `${scenario.id}/${variant.id} -> ${sign.sign}`).toBe(true);
        }
      }
    }
  });

  it('maps every in-scene marking kind onto a central marking', () => {
    const kinds = new Set<string>();
    for (const scenario of SCENARIOS) {
      for (const m of scenario.markings ?? []) kinds.add(m.kind);
      for (const variant of scenario.variants ?? []) {
        for (const m of variant.patch.markings ?? []) kinds.add(m.kind);
      }
    }
    expect(kinds.size).toBeGreaterThan(0);
    for (const kind of kinds) {
      const id = SCENARIO_MARKING_KIND_TO_ID[kind];
      expect(id, `scenario marking kind "${kind}" has no central marking`).toBeDefined();
      expect(MARKING_BY_ID.has(id!), `${kind} -> ${id}`).toBe(true);
    }
  });

  it('keeps the scenario mapping pointing at real markings', () => {
    for (const [kind, id] of Object.entries(SCENARIO_MARKING_KIND_TO_ID)) {
      expect(MARKING_BY_ID.has(id), `${kind} -> ${id}`).toBe(true);
    }
  });
});

describe('marking registry validation', () => {
  const base = {
    questions: [] as never[],
    subcategoryIds,
    categoryBySubcategory: new Map(SUBCATEGORIES.map((s) => [s.id, s.categoryId as string])),
    misconceptionIds: new Set(MISCONCEPTIONS.map((m) => m.id)),
    concepts: CURRICULUM_CONCEPTS,
    sources: SOURCES,
    availableMarkingGlyphs: glyphIds,
  };

  const sample = ROAD_MARKINGS[0]!;
  const mutate = (patch: Partial<RoadMarking>) =>
    validateContent({ ...base, roadMarkings: [{ ...sample, ...patch }] }).errors.map((e) => e.code);

  it('accepts the real registry', () => {
    const report = validateContent({ ...base, roadMarkings: ROAD_MARKINGS });
    const shown = report.errors.map((e) => `${e.questionId}: ${e.message}`).join(' | ');
    expect(report.errors, shown).toHaveLength(0);
  });

  it('catches a marking without a drawing', () => {
    expect(mutate({ id: 'ritas-inte' })).toContain('marking-without-glyph');
  });

  it('catches a marking without a usable meaning', () => {
    expect(mutate({ forDriver: 'kort' })).toContain('marking-without-meaning');
  });

  it('catches a marking without usable alt text', () => {
    expect(mutate({ altText: 'kort' })).toContain('marking-without-alt');
  });

  it('catches an unknown subcategory', () => {
    expect(mutate({ subcategory: 'finns-inte' })).toContain('marking-unknown-subcategory');
  });

  it('catches a dangling confusion pair', () => {
    expect(mutate({ similarMarkingIds: ['finns-inte'] })).toContain('marking-dangling-similar');
  });

  it('catches a marking that lists itself as confusable', () => {
    expect(mutate({ similarMarkingIds: [sample.id] })).toContain('marking-self-similar');
  });

  it('catches a duplicate marking id', () => {
    const codes = validateContent({ ...base, roadMarkings: [sample, sample] }).errors.map(
      (e) => e.code,
    );
    expect(codes).toContain('duplicate-marking-id');
  });
});
