import { describe, expect, it } from 'vitest';
import { SOURCE_IMAGES, getSourceImage } from '@/content/source-images';
import { SOURCES, SOURCE_BY_ID } from '@/content/sources';
import { SUBCATEGORIES } from '@/content/taxonomy';
import { CURRICULUM_CHAPTERS } from '@/content/curriculum/curriculum';
import { LESSONS } from '@/content/lessons';
import { ALL_QUESTIONS } from '@/content/questions';
import { MISCONCEPTIONS } from '@/content/misconceptions';
import {
  SOURCE_IMAGE_WIDTHS,
  availableSourceImageAssets,
  availableSourceImageWidths,
  resolveSourceImage,
} from '@/ui/media/sourceImageAssets';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { validateContent } from './validation';
import type { SourceImage } from '@/content/source-images';

/**
 * The licensed photographs, checked as a system.
 *
 * These images belong to somebody else and are used with permission, so the
 * registry has to keep three promises at once: every picture is described well
 * enough that the lesson works without seeing it, every picture carries its
 * attribution, and every picture actually exists as a file in every size the
 * layout asks for. A photograph that quietly fails one of those does not look
 * broken — it just teaches less, or credits nobody.
 */

const approved = SOURCE_IMAGES.filter((i) => i.status === 'approved');
const assets = availableSourceImageAssets();
const widths = availableSourceImageWidths();
const subcategoryIds = new Set(SUBCATEGORIES.map((s) => s.id));
const chapterIds = new Set(CURRICULUM_CHAPTERS.map((c) => c.id));

describe('source image registry', () => {
  it('has approved images at all', () => {
    expect(approved.length).toBeGreaterThan(40);
  });

  it('gives every image a unique id', () => {
    const ids = SOURCE_IMAGES.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('never registers the same photograph twice', () => {
    // Two entries on one file means two captions and two descriptions that can
    // disagree about what the picture shows. They did once, and one was wrong.
    const byAsset = new Map<string, string[]>();
    for (const image of SOURCE_IMAGES) {
      if (image.status === 'retired') continue;
      const list = byAsset.get(image.asset);
      if (list) list.push(image.id);
      else byAsset.set(image.asset, [image.id]);
    }
    const shared = [...byAsset].filter(([, ids]) => ids.length > 1);
    expect(shared.map(([asset, ids]) => `${asset}: ${ids.join(', ')}`)).toEqual([]);
  });

  it('describes every image for someone who cannot see it', () => {
    for (const image of approved) {
      expect(image.altText.trim().length, image.id).toBeGreaterThan(20);
      // The long description carries the exercise when the picture cannot.
      expect(image.longDescription.trim().length, image.id).toBeGreaterThan(80);
      expect(image.longDescription, image.id).not.toBe(image.altText);
    }
  });

  it('captions every image with something worth reading', () => {
    for (const image of approved) {
      expect(image.caption.trim().length, image.id).toBeGreaterThan(15);
    }
  });

  it('credits a rights holder and records the permission', () => {
    for (const image of approved) {
      expect(image.rightsHolder.trim().length, image.id).toBeGreaterThan(0);
      expect(image.usedWithPermission, image.id).toBe(true);
    }
  });

  it('points at a source that exists, on a page that exists', () => {
    for (const image of approved) {
      const source = SOURCE_BY_ID.get(image.sourceId);
      expect(source, `${image.id} -> ${image.sourceId}`).toBeTruthy();
      expect(Number.isInteger(image.sourcePage), image.id).toBe(true);
      expect(image.sourcePage, image.id).toBeGreaterThan(0);
      if (source?.pageCount) {
        expect(image.sourcePage, image.id).toBeLessThanOrEqual(source.pageCount);
      }
    }
  });

  it('maps every image onto a subcategory and a chapter that exist', () => {
    for (const image of approved) {
      expect(subcategoryIds.has(image.subcategory), `${image.id} -> ${image.subcategory}`).toBe(true);
      expect(chapterIds.has(image.chapter), `${image.id} -> ${image.chapter}`).toBe(true);
    }
  });

  it('records the intrinsic size, so the layout can reserve the space', () => {
    // Without this the page jumps as each photograph loads.
    for (const image of approved) {
      expect(image.width, image.id).toBeGreaterThan(0);
      expect(image.height, image.id).toBeGreaterThan(0);
      const ratio = image.width / image.height;
      expect(ratio, `${image.id} har orimliga proportioner`).toBeGreaterThan(0.3);
      expect(ratio, `${image.id} har orimliga proportioner`).toBeLessThan(4);
    }
  });

  it('resolves by id', () => {
    expect(getSourceImage(approved[0]!.id)?.asset).toBe(approved[0]!.asset);
    expect(getSourceImage('finns-inte')).toBeUndefined();
  });
});

describe('source image files', () => {
  it('has a file on disk for every approved image', () => {
    const missing = approved.filter((i) => !assets.has(i.asset)).map((i) => i.id);
    expect(missing, missing.join(', ')).toHaveLength(0);
  });

  it('ships every responsive width', () => {
    const incomplete = approved
      .filter((i) => SOURCE_IMAGE_WIDTHS.some((w) => !(widths.get(i.asset) ?? []).includes(w)))
      .map((i) => i.id);
    expect(incomplete, incomplete.join(', ')).toHaveLength(0);
  });

  it('resolves to a srcset covering every width', () => {
    for (const image of approved) {
      const resolved = resolveSourceImage(image.asset);
      expect(resolved, image.id).toBeTruthy();
      for (const width of SOURCE_IMAGE_WIDTHS) {
        expect(resolved!.srcSet, `${image.id} saknar ${width}w`).toContain(`${width}w`);
      }
    }
  });

  it('resolves to URLs that survive the GitHub Pages base path', () => {
    // Vite rewrites these at build time; in tests they are dev-server paths.
    // Either way they must be absolute and never bare relative, which would
    // resolve against the current hash route and 404 in production.
    for (const image of approved) {
      const resolved = resolveSourceImage(image.asset)!;
      expect(resolved.src.startsWith('/') || resolved.src.startsWith('http'), image.id).toBe(true);
      expect(resolved.src, image.id).not.toContain('..');
    }
  });

  it('degrades to nothing rather than a broken image for an unknown slug', () => {
    expect(resolveSourceImage('finns/inte-alls')).toBeUndefined();
  });

  it('ships no file that no image claims', () => {
    // An orphaned asset is dead weight in the bundle and usually the remains of
    // a curation that was undone somewhere other than the pipeline.
    const claimed = new Set(SOURCE_IMAGES.map((i) => i.asset));
    const orphans = [...assets].filter((slug) => !claimed.has(slug));
    expect(orphans, orphans.join(', ')).toHaveLength(0);
  });
});

describe('images in content', () => {
  const usedByQuestions = ALL_QUESTIONS.flatMap((q) => (q.sourceImageId ? [q.sourceImageId] : []));
  const usedByLessons = LESSONS.flatMap((l) =>
    l.blocks.flatMap((b) => (b.kind === 'sourceImage' ? [b.imageId] : [])),
  );

  it('only references images that exist and are approved', () => {
    for (const id of [...usedByQuestions, ...usedByLessons]) {
      const image = getSourceImage(id);
      expect(image, `okänd bild: ${id}`).toBeTruthy();
      expect(image!.status, id).toBe('approved');
    }
  });

  it('gives every image-backed question an accessible route to the answer', () => {
    // If the picture cannot be seen, the long description has to be enough to
    // answer the question. Anything else makes the item unanswerable rather
    // than merely harder.
    for (const q of ALL_QUESTIONS) {
      if (!q.sourceImageId) continue;
      const image = getSourceImage(q.sourceImageId)!;
      expect(image.longDescription.length, q.id).toBeGreaterThan(80);
    }
  });

  it('never puts the registry caption into the question prompt', () => {
    // The caption says what the picture teaches, which is the thing the
    // question asks the learner to work out. QuestionCard already hides it
    // (showCaption={false}); this stops it arriving through the prompt instead.
    // The explanation may repeat it freely — by then the answer is given.
    for (const q of ALL_QUESTIONS) {
      if (!q.sourceImageId) continue;
      const image = getSourceImage(q.sourceImageId)!;
      const head = image.caption.toLowerCase().slice(0, 40);
      expect(q.prompt.toLowerCase(), `${q.id} röjer bildtexten`).not.toContain(head);
    }
  });

  it('has image-backed questions at all', () => {
    expect(ALL_QUESTIONS.filter((q) => q.sourceImageId).length).toBeGreaterThan(30);
  });
});

describe('source image validation', () => {
  const base = {
    questions: [] as never[],
    subcategoryIds,
    categoryBySubcategory: new Map(SUBCATEGORIES.map((s) => [s.id, s.categoryId as string])),
    misconceptionIds: new Set(MISCONCEPTIONS.map((m) => m.id)),
    concepts: [],
    sources: SOURCES,
    availableAssets: assets,
    availableAssetWidths: widths,
    requiredAssetWidths: SOURCE_IMAGE_WIDTHS,
  };

  const sample = approved[0]!;
  const mutate = (patch: Partial<SourceImage>) =>
    validateContent({ ...base, sourceImages: [{ ...sample, ...patch }] }).errors.map((e) => e.code);

  it('accepts the real registry', () => {
    const report = validateContent({ ...base, sourceImages: SOURCE_IMAGES });
    const shown = report.errors.map((e) => `${e.questionId}: ${e.message}`).join(' | ');
    expect(report.errors, shown).toHaveLength(0);
  });

  it('catches a missing alt text', () => {
    expect(mutate({ altText: '   ' })).toContain('image-without-alt');
  });

  it('catches a description too thin to replace the picture', () => {
    expect(mutate({ longDescription: 'En bild.' })).toContain('image-without-description');
  });

  it('catches a missing rights holder', () => {
    expect(mutate({ rightsHolder: '' })).toContain('image-without-rights-holder');
  });

  it('catches an image not marked as used with permission', () => {
    expect(mutate({ usedWithPermission: false })).toContain('image-without-permission');
  });

  it('catches an unknown source', () => {
    expect(mutate({ sourceId: 'finns-inte' })).toContain('image-unknown-source');
  });

  it('catches a page outside the source', () => {
    expect(mutate({ sourcePage: 99999 })).toContain('image-source-page-out-of-range');
  });

  it('catches an unknown subcategory', () => {
    expect(mutate({ subcategory: 'finns-inte' })).toContain('image-unknown-subcategory');
  });

  it('catches an approved image whose file is missing', () => {
    expect(mutate({ id: 'ny-bild', asset: 'finns/inte' })).toContain('image-asset-missing');
  });

  it('catches an approved image that is missing a responsive width', () => {
    const codes = validateContent({
      ...base,
      availableAssetWidths: new Map([[sample.asset, [640]]]),
      sourceImages: [sample],
    }).errors.map((e) => e.code);
    expect(codes).toContain('image-missing-widths');
  });

  it('catches nonsense dimensions', () => {
    expect(mutate({ width: 0 })).toContain('image-bad-dimensions');
  });

  it('catches two entries pointing at the same photograph', () => {
    const codes = validateContent({
      ...base,
      sourceImages: [sample, { ...sample, id: 'kopia' }],
    }).errors.map((e) => e.code);
    expect(codes).toContain('duplicate-image-asset');
  });

  it('catches a question that uses an unapproved image', () => {
    const report = validateContent({
      ...base,
      sourceImages: [{ ...sample, status: 'retired' }],
      questions: [
        {
          id: 'x-1',
          version: 1,
          status: 'reviewed',
          category: 'risker',
          subcategory: sample.subcategory,
          difficulty: 2,
          questionType: 'image-scenario',
          ruleTested: 'Test',
          misconceptions: [],
          prompt: 'Vad ser du på bilden här?',
          answers: [
            { id: 'a', text: 'Ett svar.' },
            { id: 'b', text: 'Ett annat svar.' },
            { id: 'c', text: 'Ett tredje svar.' },
          ],
          correctAnswerId: 'a',
          shortExplanation: 'En förklaring som är tillräckligt lång för att passera kontrollen.',
          sourceReferences: [
            { name: 'Trafikförordningen (1998:1276)', verifiedAt: null, sourceId: 'trafikforordningen' },
          ],
          lastReviewedAt: null,
          estimatedTimeSec: 20,
          sourceImageId: sample.id,
        },
      ] as never,
    });
    expect(report.errors.map((e) => e.code)).toContain('unapproved-source-image');
  });
});

describe('every surface that shows a question shows its picture', () => {
  /**
   * The exam once rendered only the drawn signs.
   *
   * Photograph-backed questions arrived without their photograph and
   * marking questions without their marking, so roughly one question in ten
   * was unanswerable in the simulation while being perfectly fine in
   * training — the two screens render questions independently and only one
   * of them had been kept in step.
   *
   * This walks the source of every screen that renders a question and checks
   * it reaches for all three kinds of illustration the content model allows.
   * A source check rather than a render test on purpose: the failure was a
   * missing branch, and a missing branch is exactly what a render test of the
   * *existing* branches will never notice.
   */
  const surfaces = [
    'src/features/practice/QuestionCard.tsx',
    'src/features/exam/ExamRunnerPage.tsx',
  ];

  for (const file of surfaces) {
    it(`${file} renders photographs, markings and signs`, () => {
      const source = readFileSync(resolve(process.cwd(), file), 'utf8');
      expect(source, 'saknar källbild').toContain('sourceImageId');
      expect(source, 'saknar källbild').toContain('SourceImageFigure');
      expect(source, 'saknar vägmarkering').toContain('hasRoadMarking');
      expect(source, 'saknar vägmärke').toContain('hasRoadSign');
    });
  }

  it('keeps the exam free of the teaching caption', () => {
    const source = readFileSync(
      resolve(process.cwd(), 'src/features/exam/ExamRunnerPage.tsx'),
      'utf8',
    );
    expect(source).toContain('showCaption={false}');
  });
});
