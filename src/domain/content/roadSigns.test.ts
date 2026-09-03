import { describe, expect, it } from 'vitest';
import { ROAD_SIGNS, SIGN_BY_ID, SIGNS_BY_CATEGORY, getRoadSign } from '@/content/road-signs';
import { SIGN_GLYPHS } from '@/ui/illustrations/signGlyphs';
import signAssets from '@/content/road-sign-assets.json';
import { MARKING_GLYPHS } from '@/ui/illustrations/markingGlyphs';
import { SUBCATEGORIES } from '@/content/taxonomy';
import { ALL_QUESTIONS } from '@/content/questions';
import { LESSONS } from '@/content/lessons';
import { validateContent } from './validation';
import { CURRICULUM_CONCEPTS } from '@/content/curriculum/curriculum';
import { MISCONCEPTIONS } from '@/content/misconceptions';
import { SOURCES } from '@/content/sources';
import type { RoadSign } from '@/content/road-signs';

const glyphIds = new Set(Object.keys(SIGN_GLYPHS));
/**
 * A sign can now be drawn two ways: the licensed book artwork, or Vägklar's
 * own vector. Most use the book's — the vectors that remain are the variant
 * families, where one official code covers several real signs and the book
 * prints one picture per code.
 */
const licensedIds = new Set(signAssets.map((a) => a.id));
const drawableIds = new Set([...glyphIds, ...licensedIds]);
const subcategoryIds = new Set(SUBCATEGORIES.map((s) => s.id));

describe('road sign registry', () => {
  it('has a unique id for every sign', () => {
    const ids = ROAD_SIGNS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has a drawing for every registered sign', () => {
    const missing = ROAD_SIGNS.filter((s) => !drawableIds.has(s.id)).map((s) => s.id);
    expect(missing, missing.join(', ')).toHaveLength(0);
  });

  it('registers every drawing it can render', () => {
    // The other direction: a glyph nobody can look up is dead weight and has no
    // meaning, alt text or code attached to it.
    const unregistered = [...glyphIds].filter((id) => !SIGN_BY_ID.has(id));
    expect(unregistered, unregistered.join(', ')).toHaveLength(0);
  });

  it('gives every sign a code, a name and both levels of meaning', () => {
    for (const s of ROAD_SIGNS) {
      expect(s.code.length, s.id).toBeGreaterThan(1);
      expect(s.name.length, s.id).toBeGreaterThan(3);
      expect(s.shortMeaning.length, s.id).toBeGreaterThan(10);
      expect(s.longMeaning.length, s.id).toBeGreaterThan(30);
    }
  });

  it('describes every sign for someone who cannot see it', () => {
    for (const s of ROAD_SIGNS) {
      expect(s.altText.length, s.id).toBeGreaterThan(20);
      // The description has to say what it looks like, not just repeat the name.
      expect(s.altText.toLowerCase(), s.id).toMatch(/skylt|triangel|rund|kvadrat|rektangul|tavla|åttakant/);
    }
  });

  it('uses a code prefix that matches the category', () => {
    const prefixes: Record<string, string> = {
      varning: 'A',
      vajningsplikt: 'B',
      forbud: 'C',
      pabud: 'D',
      anvisning: 'E',
      tillaggstavla: 'T',
    };
    for (const s of ROAD_SIGNS) {
      expect(s.code.charAt(0), `${s.id} (${s.code})`).toBe(prefixes[s.category]);
    }
  });

  it('maps every sign onto a subcategory that exists', () => {
    for (const s of ROAD_SIGNS) {
      expect(subcategoryIds.has(s.subcategory), `${s.id} -> ${s.subcategory}`).toBe(true);
    }
  });

  it('only points at confusion pairs that exist, and never at itself', () => {
    for (const s of ROAD_SIGNS) {
      for (const similar of s.similarSignIds) {
        expect(similar, s.id).not.toBe(s.id);
        expect(SIGN_BY_ID.has(similar), `${s.id} -> ${similar}`).toBe(true);
      }
    }
  });

  it('covers every sign category', () => {
    for (const [category, signs] of SIGNS_BY_CATEGORY) {
      expect(signs.length, category).toBeGreaterThan(0);
    }
  });

  it('resolves a sign by id', () => {
    expect(getRoadSign('stopp')?.code).toBe('B2');
    expect(getRoadSign('finns-inte')).toBeUndefined();
  });
});

describe('sign-backed content', () => {
  it('only renders vector art that exists', () => {
    // An illustration id may resolve against either registry — the renderer
    // picks by id, so a sign and a marking are authored identically.
    const drawable = new Set([...drawableIds, ...Object.keys(MARKING_GLYPHS)]);
    for (const q of ALL_QUESTIONS) {
      const illustration = q.image?.illustration;
      if (!illustration) continue;
      expect(drawable.has(illustration), `${q.id} -> ${illustration}`).toBe(true);
    }
  });

  it('only lists signs that exist in lesson sign grids', () => {
    for (const lesson of LESSONS) {
      for (const block of lesson.blocks) {
        if (block.kind === 'signGrid') {
          for (const id of block.signIds) {
            expect(SIGN_BY_ID.has(id), `${lesson.id} -> ${id}`).toBe(true);
          }
        }
        if (block.kind === 'signCompare') {
          expect(SIGN_BY_ID.has(block.leftId), `${lesson.id} -> ${block.leftId}`).toBe(true);
          expect(SIGN_BY_ID.has(block.rightId), `${lesson.id} -> ${block.rightId}`).toBe(true);
        }
      }
    }
  });

  it('compares signs that are actually declared as confusable', () => {
    // A comparison card that pairs two unrelated signs teaches a distinction
    // nobody was going to get wrong.
    for (const lesson of LESSONS) {
      for (const block of lesson.blocks) {
        if (block.kind !== 'signCompare') continue;
        const left = SIGN_BY_ID.get(block.leftId);
        const right = SIGN_BY_ID.get(block.rightId);
        const linked =
          left?.similarSignIds.includes(block.rightId) ||
          right?.similarSignIds.includes(block.leftId);
        expect(linked, `${block.leftId} vs ${block.rightId}`).toBe(true);
      }
    }
  });
});

describe('sign registry validation', () => {
  const base = {
    questions: [] as never[],
    subcategoryIds,
    categoryBySubcategory: new Map(SUBCATEGORIES.map((s) => [s.id, s.categoryId as string])),
    misconceptionIds: new Set(MISCONCEPTIONS.map((m) => m.id)),
    concepts: CURRICULUM_CONCEPTS,
    sources: SOURCES,
    availableSignGlyphs: glyphIds,
    licensedSignIds: licensedIds,
  };

  const sample = ROAD_SIGNS[0]!;
  const mutate = (patch: Partial<RoadSign>) =>
    validateContent({ ...base, roadSigns: [{ ...sample, ...patch }] }).errors.map((e) => e.code);

  it('accepts the real registry', () => {
    const report = validateContent({ ...base, roadSigns: ROAD_SIGNS });
    const shown = report.errors.map((e) => `${e.questionId}: ${e.message}`).join(' | ');
    expect(report.errors, shown).toHaveLength(0);
  });

  it('catches a sign without a drawing', () => {
    expect(mutate({ id: 'ritas-inte' })).toContain('sign-without-artwork');
  });

  it('catches a sign with an unknown subcategory', () => {
    expect(mutate({ subcategory: 'finns-inte' })).toContain('sign-unknown-subcategory');
  });

  it('catches a sign without usable alt text', () => {
    expect(mutate({ altText: 'kort' })).toContain('sign-without-alt');
  });

  it('catches a sign without a real meaning', () => {
    expect(mutate({ longMeaning: 'kort' })).toContain('sign-without-meaning');
  });

  it('catches a dangling confusion pair', () => {
    expect(mutate({ similarSignIds: ['finns-inte'] })).toContain('sign-dangling-similar');
  });

  it('catches a sign that lists itself as confusable', () => {
    expect(mutate({ similarSignIds: [sample.id] })).toContain('sign-self-similar');
  });

  it('catches a duplicate sign id', () => {
    const codes = validateContent({ ...base, roadSigns: [sample, sample] }).errors.map((e) => e.code);
    expect(codes).toContain('duplicate-sign-id');
  });

  it('catches a question that renders a sign with no drawing', () => {
    const report = validateContent({
      ...base,
      roadSigns: ROAD_SIGNS,
      questions: [
        {
          id: 'x-1',
          version: 1,
          status: 'reviewed',
          category: 'vagmarken',
          subcategory: 'varningsmarken',
          difficulty: 1,
          questionType: 'road-sign',
          ruleTested: 'Test',
          misconceptions: [],
          prompt: 'En fråga som pekar på en skylt som inte kan ritas.',
          answers: [
            { id: 'a', text: 'Ett svar.' },
            { id: 'b', text: 'Ett annat svar.' },
            { id: 'c', text: 'Ett tredje svar.' },
          ],
          correctAnswerId: 'a',
          shortExplanation: 'En förklaring som är tillräckligt lång för att passera kontrollen.',
          sourceReferences: [{ name: 'Trafikförordningen (1998:1276)', verifiedAt: null }],
          lastReviewedAt: null,
          estimatedTimeSec: 20,
          image: { illustration: 'finns-inte-alls', alt: 'En skylt.' },
        },
      ] as never,
    });
    expect(report.errors.map((e) => e.code)).toContain('unknown-sign-illustration');
  });
});
