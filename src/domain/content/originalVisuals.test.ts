import { describe, expect, it } from 'vitest';
import { ORIGINAL_VISUALS, getOriginalVisual } from '@/content/original-visuals';
import { ORIGINAL_VISUAL_GLYPHS } from '@/ui/visuals/originalVisualGlyphs';
import { SOURCE_IMAGES } from '@/content/source-images';
import { SUBCATEGORIES } from '@/content/taxonomy';
import { CURRICULUM_CHAPTERS } from '@/content/curriculum/curriculum';
import { LESSONS } from '@/content/lessons';
import { ALL_QUESTIONS } from '@/content/questions';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { validateContent } from './validation';
import type { OriginalVisual } from '@/content/original-visuals';

/**
 * Vägklar's own drawings, checked as a system.
 *
 * These carry a different risk from the licensed photographs. A licensed image
 * can fail by losing its attribution; an original can fail by *gaining* one —
 * by drifting into the licensed registry, or by being credited to the book's
 * rights holder because it sits next to material that is. The separation is the
 * whole point of having two registries, so most of what follows is about
 * keeping the two apart.
 *
 * The rest is the same promise the licensed diagrams make: whatever is drawn
 * can be understood by someone who cannot see it.
 */

const approved = ORIGINAL_VISUALS.filter((v) => v.status === 'approved');
const subcategoryIds = new Set(SUBCATEGORIES.map((s) => s.id));
const chapterIds = new Set(CURRICULUM_CHAPTERS.map((c) => c.id));

describe('original visual registry', () => {
  it('has drawings at all', () => {
    expect(approved.length).toBeGreaterThan(8);
  });

  it('gives every visual a unique id', () => {
    const ids = ORIGINAL_VISUALS.map((v) => v.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has a drawing behind every entry', () => {
    const missing = approved.filter((v) => !(v.rendererId in ORIGINAL_VISUAL_GLYPHS)).map((v) => v.id);
    expect(missing, missing.join(', ')).toHaveLength(0);
  });

  it('draws nothing it has not registered', () => {
    const claimed = new Set(ORIGINAL_VISUALS.map((v) => v.rendererId));
    const orphans = Object.keys(ORIGINAL_VISUAL_GLYPHS).filter((id) => !claimed.has(id));
    expect(orphans, orphans.join(', ')).toHaveLength(0);
  });

  it('never uses one drawing for two entries', () => {
    const renderers = approved.map((v) => v.rendererId);
    expect(new Set(renderers).size, renderers.join(', ')).toBe(renderers.length);
  });

  it('describes every drawing for someone who cannot see it', () => {
    for (const v of approved) {
      expect(v.altText.length, `${v.id} saknar alt-text`).toBeGreaterThan(20);
      expect(v.longDescription.length, `${v.id} har för tunn beskrivning`).toBeGreaterThan(140);
      expect(v.caption.length, `${v.id} saknar bildtext`).toBeGreaterThan(20);
    }
  });

  it('repeats the words printed in the drawing, so they survive alone', () => {
    const lost: string[] = [];
    for (const v of approved) {
      const described = v.longDescription.toLocaleLowerCase('sv');
      for (const printed of v.labelText) {
        if (!described.includes(printed.toLocaleLowerCase('sv'))) lost.push(`${v.id}: ${printed}`);
      }
    }
    expect(lost, lost.join('; ')).toHaveLength(0);
  });

  it('maps every drawing onto a subcategory and a chapter that exist', () => {
    for (const v of ORIGINAL_VISUALS) {
      expect(subcategoryIds.has(v.subcategory), `${v.id}: ${v.subcategory}`).toBe(true);
      expect(chapterIds.has(v.chapter), `${v.id}: ${v.chapter}`).toBe(true);
    }
  });

  it('records a viewBox the layout can use', () => {
    for (const v of ORIGINAL_VISUALS) {
      expect(v.width, `${v.id}`).toBeGreaterThan(0);
      expect(v.height, `${v.id}`).toBeGreaterThan(0);
      const ratio = v.width / v.height;
      expect(ratio, `${v.id} har orimliga proportioner`).toBeGreaterThan(0.5);
      expect(ratio, `${v.id} har orimliga proportioner`).toBeLessThan(4);
    }
  });

  it('resolves by id', () => {
    expect(getOriginalVisual('monsterdjup')?.title).toBe('Mönsterdjup');
    expect(getOriginalVisual('finns-inte')).toBeUndefined();
  });
});

describe('original visuals stay separate from licensed material', () => {
  const licensedIds = new Set(SOURCE_IMAGES.map((i) => i.id));

  it('shares no id with the licensed registry', () => {
    const clash = ORIGINAL_VISUALS.filter((v) => licensedIds.has(v.id)).map((v) => v.id);
    expect(clash, clash.join(', ')).toHaveLength(0);
  });

  it('credits Vägklar, and only Vägklar', () => {
    for (const v of ORIGINAL_VISUALS) {
      expect(v.createdBy, v.id).toBe('Vägklar');
      expect(v.copyright, v.id).toContain('Jimmy Eliasson');
      // The failure that would matter: a drawing quietly carrying the book's
      // rights holder because it was written next to entries that do.
      expect(`${v.copyright} ${v.createdBy} ${v.notes ?? ''}`, v.id).not.toMatch(
        /Hagberg|Körkortonline/i,
      );
    }
  });

  it('never claims a page in the source book', () => {
    // An original has no source page, and adding one would be a claim that it
    // was extracted from the licensed PDF. Nothing in the type allows it; this
    // guards the day somebody widens the type.
    for (const v of ORIGINAL_VISUALS) {
      expect(Object.keys(v), v.id).not.toContain('sourcePage');
      expect(Object.keys(v), v.id).not.toContain('sourceId');
      expect(Object.keys(v), v.id).not.toContain('rightsHolder');
    }
  });

  it('says "Illustration: Vägklar" rather than crediting a publisher', () => {
    const figure = readFileSync(
      resolve(process.cwd(), 'src/ui/visuals/OriginalVisualFigure.tsx'),
      'utf8',
    );
    expect(figure).toContain('Illustration: Vägklar');
    expect(figure).not.toMatch(/Hagberg|Körkortonline/i);
  });
});

describe('original visuals in content', () => {
  const used = new Set<string>();
  for (const q of ALL_QUESTIONS) if (q.originalVisualId) used.add(q.originalVisualId);
  for (const lesson of LESSONS) {
    for (const block of lesson.blocks) {
      if (block.kind === 'originalVisual') used.add(block.visualId);
    }
  }

  it('only references drawings that exist and are approved', () => {
    const known = new Map(ORIGINAL_VISUALS.map((v) => [v.id, v]));
    for (const id of used) {
      const visual = known.get(id);
      expect(visual, `okänd ritning ${id}`).toBeDefined();
      expect(visual!.status, id).toBe('approved');
    }
  });

  it('uses every drawing it ships', () => {
    // These cost bytes in a chunk every learner downloads, so an unused one is
    // not merely untidy.
    const idle = approved.filter((v) => !used.has(v.id)).map((v) => v.id);
    expect(idle, idle.join(', ')).toHaveLength(0);
  });

  it('asks questions on the unlabelled variants, never on the teaching ones', () => {
    // A teaching diagram names what it shows — "För lågt tryck" — which in a
    // question is the answer key. Question-backed drawings are registered with
    // usage 'question-image' and drawn without the verdict.
    const asked = ALL_QUESTIONS.filter((q) => q.originalVisualId);
    expect(asked.length).toBeGreaterThanOrEqual(4);
    for (const q of asked) {
      const visual = getOriginalVisual(q.originalVisualId!)!;
      expect(visual.usage, `${q.id} använder lektionsritningen ${visual.id}`).toBe('question-image');
    }
  });

  it('never puts the drawing caption into the question prompt', () => {
    for (const q of ALL_QUESTIONS) {
      if (!q.originalVisualId) continue;
      const visual = getOriginalVisual(q.originalVisualId)!;
      expect(q.prompt, `${q.id} upprepar bildtexten`).not.toContain(visual.caption);
    }
  });
});

describe('original visual validation', () => {
  const sample: OriginalVisual = {
    id: 'prov-ritning',
    kind: 'diagram',
    title: 'Provritning',
    topic: 'dack',
    subcategory: 'dack-och-bromsar',
    chapter: 'dack',
    altText: 'En ritning som används för att pröva valideringen och ingenting annat.',
    longDescription:
      'En påhittad ritning vars enda uppgift är att pröva valideringsreglerna. Den visar 5 mm mellan två streck, och beskrivningen är lång nog att räknas som en riktig beskrivning av vad som syns.',
    labelText: ['5 mm'],
    caption: 'En bildtext som är lagom lång för att räknas.',
    rendererId: 'monsterdjup',
    width: 320,
    height: 180,
    usage: 'theory-lesson',
    status: 'approved',
    createdBy: 'Vägklar',
    copyright: '© 2026 Jimmy Eliasson',
  };

  const base = {
    questions: [],
    subcategoryIds,
    categoryBySubcategory: new Map<string, string>(),
    misconceptionIds: new Set<string>(),
    concepts: [],
    sources: [],
    availableVisualGlyphs: new Set(Object.keys(ORIGINAL_VISUAL_GLYPHS)),
  };

  const codesFor = (patch: Partial<OriginalVisual>) =>
    validateContent({ ...base, originalVisuals: [{ ...sample, ...patch }] }).errors.map((e) => e.code);

  it('accepts the real registry', () => {
    const report = validateContent({
      ...base,
      originalVisuals: ORIGINAL_VISUALS,
    });
    expect(report.errors.map((e) => `${e.questionId} ${e.code}`)).toEqual([]);
  });

  it('catches a missing alt text', () => {
    expect(codesFor({ altText: '  ' })).toContain('visual-without-alt');
  });

  it('catches a description too thin to replace the drawing', () => {
    expect(codesFor({ longDescription: 'Kort.' })).toContain('visual-description-too-thin');
  });

  it('catches a label that exists in the drawing but not in words', () => {
    expect(codesFor({ labelText: ['1,6 mm'] })).toContain('visual-label-not-described');
  });

  it('catches a drawing credited to somebody else', () => {
    expect(codesFor({ createdBy: 'Hagberg Media AB' })).toContain(
      'visual-not-attributed-to-vagklar',
    );
    expect(codesFor({ copyright: '© 2026 Hagberg Media AB' })).toContain(
      'visual-claims-licensed-source',
    );
  });

  it('catches a renderer that does not exist', () => {
    expect(codesFor({ rendererId: 'finns-inte' })).toContain('visual-renderer-missing');
  });

  it('catches an unknown subcategory', () => {
    expect(codesFor({ subcategory: 'hittepa' })).toContain('visual-unknown-subcategory');
  });

  it('catches nonsense dimensions', () => {
    expect(codesFor({ width: 0 })).toContain('visual-bad-dimensions');
  });

  it('catches two entries drawing the same figure', () => {
    const codes = validateContent({
      ...base,
      originalVisuals: [sample, { ...sample, id: 'kopia' }],
    }).errors.map((e) => e.code);
    expect(codes).toContain('duplicate-visual-renderer');
  });

  it('catches an id that collides with the licensed registry', () => {
    const codes = validateContent({
      ...base,
      originalVisuals: [{ ...sample, id: 'monsterdjup-licensierad' }],
      sourceImages: [
        {
          ...(SOURCE_IMAGES[0] as (typeof SOURCE_IMAGES)[number]),
          id: 'monsterdjup-licensierad',
        },
      ],
    }).errors.map((e) => e.code);
    expect(codes).toContain('visual-id-collides-with-source-image');
  });

  it('tells an author who reached into the wrong registry which one they hit', () => {
    const report = validateContent({
      ...base,
      questions: [
        {
          ...(ALL_QUESTIONS[0] as (typeof ALL_QUESTIONS)[number]),
          originalVisualId: 'deformationszoner',
        },
      ],
      originalVisuals: ORIGINAL_VISUALS,
      sourceImages: SOURCE_IMAGES,
    });
    const issue = report.errors.find((e) => e.code === 'unknown-original-visual');
    expect(issue?.message).toContain('sourceImageId');
  });
});
