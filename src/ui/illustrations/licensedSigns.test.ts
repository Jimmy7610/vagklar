import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import manifest from '@/content/road-sign-assets.json';
import { ROAD_SIGNS, getRoadSign } from '@/content/road-signs';
import { SIGN_GLYPHS } from './signGlyphs';
import { SOURCES } from '@/content/sources';
import { ALL_QUESTIONS } from '@/content/questions';

/**
 * The book's own sign artwork, checked as a system.
 *
 * Vägklar drew 58 road signs by hand for a long time, and three of them were
 * wrong in ways that took real effort to find: A36 carried a cross where the
 * regulation has a locomotive, A30 and D3 circulated the wrong way, and A25,
 * B6 and B7 were mirrored with A25 additionally in the wrong colour. All of
 * those are mistakes a redrawing can make and an extraction cannot.
 *
 * Switching to the licensed artwork immediately exposed twelve more: five
 * descriptions naming a colour the sign does not have — including the motorway
 * signs, which are green in Sweden and were described as blue — and seven
 * describing the wrong content. Those had been invisible because the drawing
 * had been made from the same wrong description.
 *
 * So the tests here are mostly about the join between the picture and the
 * words: that every sign has one, that they agree, and that neither gives away
 * an answer.
 */

const ROOT = process.cwd();
const assetPath = (id: string) => resolve(ROOT, `src/assets/road-signs/sign-${id}.webp`);

describe('licensed sign assets', () => {
  it('ships artwork for most of the signs Vägklar teaches', () => {
    expect(manifest.length).toBeGreaterThanOrEqual(45);
    expect(manifest.length).toBeLessThanOrEqual(ROAD_SIGNS.length);
  });

  it('has a file on disk for every manifest entry', () => {
    const missing = manifest.filter((e) => !existsSync(assetPath(e.id))).map((e) => e.id);
    expect(missing, missing.join(', ')).toHaveLength(0);
  });

  it('names only signs that exist in the registry, with the registry code', () => {
    for (const entry of manifest) {
      const sign = getRoadSign(entry.id);
      expect(sign, entry.id).toBeDefined();
      expect(sign!.code, entry.id).toBe(entry.code);
    }
  });

  it('cites a page inside the licensed source', () => {
    const book = SOURCES.find((s) => s.id === 'teoribok-2026-1')!;
    for (const entry of manifest) {
      expect(entry.page, entry.id).toBeGreaterThan(0);
      expect(entry.page, entry.id).toBeLessThanOrEqual(book.pageCount ?? 400);
      // The sign appendix, not somewhere in the middle of the prose.
      expect(entry.page, `${entry.id} ligger utanför märkesbilagan`).toBeGreaterThan(320);
    }
  });

  it('records the crop it came from, so the extraction is reproducible', () => {
    for (const entry of manifest) {
      expect(entry.crop, entry.id).toHaveLength(4);
      const [x0, y0, x1, y1] = entry.crop as number[];
      expect(x1! > x0! && y1! > y0!, entry.id).toBe(true);
      expect(x0!, entry.id).toBeGreaterThanOrEqual(0);
      expect(x1!, entry.id).toBeLessThanOrEqual(1);
    }
  });

  it('never uses one crop for two signs', () => {
    // The same picture registered twice would mean two signs illustrated
    // identically, which is worse than one of them having no picture.
    const seen = new Map<string, string>();
    for (const entry of manifest) {
      const key = `${entry.page}:${(entry.crop as number[]).join(',')}`;
      const owner = seen.get(key);
      expect(owner, `${entry.id} delar beskärning med ${owner}`).toBeUndefined();
      seen.set(key, entry.id);
    }
  });

  it('leaves the variant signs on their drawings, deliberately', () => {
    // C31 is every speed limit, D1 every mandatory direction, T6 every time
    // plate. The book prints one picture per code, so its C31 shows 30 — using
    // it for hastighet-90 would put a wrong number in front of a learner.
    const withArtwork = new Set(manifest.map((e) => e.id));
    for (const id of ['hastighet-90', 'hastighet-110', 'pabud-hoger', 'tavla-tid-lordag']) {
      expect(withArtwork.has(id), `${id} borde behålla sin vektor`).toBe(false);
      expect(SIGN_GLYPHS[id], `${id} saknar reservritning`).toBeDefined();
    }
  });

  it('can draw every registry sign one way or the other', () => {
    const withArtwork = new Set(manifest.map((e) => e.id));
    const undrawable = ROAD_SIGNS.filter(
      (s) => !withArtwork.has(s.id) && !(s.id in SIGN_GLYPHS),
    ).map((s) => s.id);
    expect(undrawable, undrawable.join(', ')).toHaveLength(0);
  });
});

describe('the renderer prefers the book over the drawing', () => {
  const source = readFileSync(resolve(ROOT, 'src/ui/illustrations/RoadSign.tsx'), 'utf8');

  it('reaches for the licensed asset first', () => {
    expect(source).toContain('licensedSignAsset');
    // The drawing is looked up only after the licensed asset has been tried.
    expect(source.indexOf('licensedSignAsset(name)')).toBeLessThan(source.indexOf('SIGN_GLYPHS[name]'));
  });

  it('still falls back to the drawing rather than rendering nothing', () => {
    expect(source).toContain('SIGN_GLYPHS[name]');
    expect(source).toContain('if (!glyph) return null');
  });

  it('never renders a sign without a description', () => {
    // The renderer no longer reaches into the registry for a default. It is
    // reached from the landing page through the scenario stage, and importing
    // 99 signs of prose to look up a string the caller already had cost 12 kB
    // gzip of startup. The description is now the caller's to supply, and the
    // props type makes forgetting it a compile error rather than a silently
    // unlabelled image: either `decorative` is set, or `alt` is required.
    expect(source).toContain('decorative: true; alt?: string');
    expect(source).toContain("decorative?: false;");
    expect(source).not.toContain("from '@/content/road-signs'");
  });

  it('still has somewhere to get the registry wording', () => {
    const helper = readFileSync(resolve(ROOT, 'src/ui/illustrations/roadSignAlt.ts'), 'utf8');
    expect(helper).toContain('getRoadSign');
  });
});

describe('a sign never tells the learner the answer', () => {
  /**
   * The registry's `name` is the sign's meaning — "Varning för mötande
   * trafik". Reading that out on a question that asks what the sign means is
   * the answer, spoken. So question alt text describes what the sign *looks
   * like* and never what it is called.
   *
   * The one legitimate exception is a sign whose meaning is printed on its
   * face: a plate reading "Boende" cannot be described without the word.
   */
  const signQuestions = ALL_QUESTIONS.filter((q) => q.image?.illustration);

  it('has sign-backed questions to check', () => {
    expect(signQuestions.length).toBeGreaterThan(20);
  });

  it('never puts the sign name into the alt text', () => {
    const leaks: string[] = [];
    for (const q of signQuestions) {
      const sign = getRoadSign(q.image!.illustration!);
      const alt = q.image?.alt ?? '';
      if (!sign || !alt) continue;
      // A plate that literally carries the word is not a leak.
      const printedOnTheSign = sign.altText.toLocaleLowerCase('sv').includes('texten');
      if (printedOnTheSign) continue;
      if (alt.toLocaleLowerCase('sv').includes(sign.name.toLocaleLowerCase('sv'))) {
        leaks.push(`${q.id}: "${alt}" avslöjar "${sign.name}"`);
      }
    }
    expect(leaks, leaks.join('; ')).toHaveLength(0);
  });

  /*
   * Naming the sign in the prompt is not, by itself, a leak.
   *
   * "Du passerar märket för tättbebyggt område utan att se någon
   * hastighetsskylt. Vad gäller?" names the sign and asks about the speed
   * limit; the answer is 50 km/h, and knowing what the sign is called is the
   * premise rather than the answer. Six questions do this and all six are
   * fine. A test that forbade it would push the content into contortions to
   * satisfy a rule that is not true.
   *
   * What is actually forbidden is above: the alt text naming the sign, and a
   * question about appearance showing the thing it asks you to describe.
   */

  /*
   * One leak is accepted rather than closed, and it is worth saying so plainly
   * instead of writing a test that pretends otherwise.
   *
   * Several sign ids are the sign's meaning — `huvudled`, `stopp`, `parkering`
   * — and the id becomes part of the asset filename, so a learner who opens
   * devtools during a question could read it. Renaming them would touch every
   * question, lesson and scenario that references a sign, to defend against
   * someone who has chosen to inspect network requests mid-quiz and could as
   * easily read the answer out of the bundle.
   *
   * What is defended is the surface a learner meets without trying: the alt
   * text, the prompt, the caption and the accessible name. Those are tested
   * above.
   */
});

/**
 * A picture must not answer the question it illustrates.
 *
 * `vag-011` asked what shape and colour the yield sign is — and showed the
 * yield sign, with alt text reading "gul triangel med röd ram och spetsen
 * nedåt" against a correct answer of "En triangel med spetsen nedåt, gul yta
 * och röd ram". Three separate routes to the answer, one of them read aloud by
 * a screen reader. It had been there for a long time; putting the authentic
 * artwork on the page is what made it obvious.
 *
 * A question about what a sign *means* can show it. A question about what it
 * *looks like* cannot.
 */
describe('a question about appearance never shows the sign', () => {
  const ASKS_ABOUT_LOOKS = /\b(vilken form|vilka färger|vilken färg|hur ser|vilket utseende)\b/i;

  it('has no question that both asks about the look of a sign and displays it', () => {
    const leaks = ALL_QUESTIONS.filter(
      (q) => q.image?.illustration && ASKS_ABOUT_LOOKS.test(q.prompt),
    ).map((q) => `${q.id}: ${q.prompt}`);
    expect(leaks, leaks.join('; ')).toHaveLength(0);
  });

  it('does not leak it through the extra accessible text either', () => {
    // `accessibilityText` is read out with the picture, so it is the same
    // surface as the alt and has to keep the same promise.
    const leaks: string[] = [];
    for (const q of ALL_QUESTIONS) {
      if (!q.accessibilityText) continue;
      const correct = q.answers.find((a) => a.id === q.correctAnswerId);
      if (!correct) continue;
      const words = correct.text
        .toLocaleLowerCase('sv')
        .replace(/[.,—-]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 3);
      if (words.length < 3) continue;
      const described = q.accessibilityText.toLocaleLowerCase('sv');
      const overlap = words.filter((w) => described.includes(w)).length / words.length;
      if (overlap > 0.8) leaks.push(`${q.id} (${Math.round(overlap * 100)} %)`);
    }
    expect(leaks, leaks.join('; ')).toHaveLength(0);
  });
});
