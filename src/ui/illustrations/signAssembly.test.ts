import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  ROAD_SIGNS,
  SUPPLEMENTARY_PLATES,
  MAIN_SIGNS,
  getRoadSign,
  interpretSignAssembly,
  signVariants,
} from '@/content/road-signs';
import { ALL_QUESTIONS } from '@/content/questions';
import { LESSONS } from '@/content/lessons';

/**
 * Signs with the plates that hang under them.
 *
 * A supplementary plate has no meaning on its own. "100 m" is not a rule; it is
 * a change to whatever rule is stated above it. The thing a learner gets wrong
 * is not either half — it is reading them apart, which is exactly what showing
 * them as two separate pictures encourages.
 *
 * So an assembly is one object here: one figure, one accessible description,
 * one combined meaning. These tests are about the joins — that a plate knows
 * how it narrows the sign, that the combination reads as one sentence, and that
 * none of it says the answer out loud while the question is still open.
 */

const ROOT = process.cwd();

describe('supplementary plates', () => {
  it('has plates, and they are all T-series', () => {
    expect(SUPPLEMENTARY_PLATES.length).toBeGreaterThanOrEqual(15);
    for (const plate of SUPPLEMENTARY_PLATES) {
      expect(plate.code.startsWith('T'), `${plate.id} har koden ${plate.code}`).toBe(true);
      expect(plate.category, plate.id).toBe('tillaggstavla');
    }
  });

  it('splits the registry cleanly into plates and the signs they sit under', () => {
    expect(SUPPLEMENTARY_PLATES.length + MAIN_SIGNS.length).toBe(ROAD_SIGNS.length);
    // Nothing is both.
    const plateIds = new Set(SUPPLEMENTARY_PLATES.map((p) => p.id));
    expect(MAIN_SIGNS.some((s) => plateIds.has(s.id))).toBe(false);
  });

  it('says how each plate narrows the sign above it', () => {
    for (const plate of SUPPLEMENTARY_PLATES) {
      expect(plate.plate!.kind, plate.id).toBeTruthy();
      // The phrase has to read as a continuation of the sign's meaning, so it
      // starts lower case and is not a sentence of its own.
      const phrase = plate.plate!.combinedPhrase;
      expect(phrase.length, plate.id).toBeGreaterThan(10);
      expect(phrase[0], `${plate.id}: "${phrase}" ska fortsätta meningen`).toBe(
        phrase[0]!.toLocaleLowerCase('sv'),
      );
      expect(phrase.endsWith('.'), `${plate.id} ska inte sluta med punkt`).toBe(false);
    }
  });

  it('describes the words printed on a plate exactly once, in the alt text', () => {
    for (const plate of SUPPLEMENTARY_PLATES) {
      const printed = plate.plate!.printedText;
      if (!printed) continue;
      expect(plate.altText, `${plate.id} beskriver inte texten "${printed}"`).toContain(printed);
    }
  });
});

describe('reading a sign and its plates together', () => {
  it('joins the sign meaning and the plate into one sentence', () => {
    const text = interpretSignAssembly('varning-annan-fara', ['tavla-avstand']);
    expect(text).toContain(getRoadSign('varning-annan-fara')!.shortMeaning.replace(/\.$/, ''));
    expect(text).toContain('100 m');
    expect(text.endsWith('.')).toBe(true);
  });

  it('carries every plate through, in the order they hang', () => {
    const text = interpretSignAssembly('parkering', ['tavla-tid', 'tavla-avgift']);
    const time = text.indexOf('angivna tiden');
    const fee = text.indexOf('avgiftsbelagd');
    expect(time).toBeGreaterThan(-1);
    expect(fee).toBeGreaterThan(time);
  });

  it('falls back to the sign alone when there are no plates', () => {
    expect(interpretSignAssembly('stopp', [])).toBe(getRoadSign('stopp')!.shortMeaning);
  });

  it('says nothing at all for a sign that does not exist', () => {
    expect(interpretSignAssembly('finns-inte', ['tavla-avstand'])).toBe('');
  });
});

describe('variants of one official code', () => {
  it('keeps the real code and distinguishes siblings by variant', () => {
    const speeds = signVariants('C31');
    expect(speeds.length).toBeGreaterThanOrEqual(5);
    for (const sign of speeds) {
      // Inventing "C31-90" would be claiming the regulation says something it
      // does not. The code stays real; the variant carries the difference.
      expect(sign.code).toBe('C31');
      expect(sign.variant, sign.id).toBeDefined();
      expect(sign.variant!.numericValue, sign.id).toBeGreaterThan(0);
    }
    const values = speeds.map((s) => s.variant!.numericValue);
    expect(new Set(values).size).toBe(values.length);
  });

  it('gives every entry sharing a code a variant key', () => {
    const byCode = new Map<string, string[]>();
    for (const sign of ROAD_SIGNS) {
      byCode.set(sign.code, [...(byCode.get(sign.code) ?? []), sign.id]);
    }
    const missing: string[] = [];
    for (const [code, ids] of byCode) {
      if (ids.length < 2) continue;
      for (const id of ids) {
        if (!getRoadSign(id)?.variant) missing.push(`${code}: ${id}`);
      }
    }
    expect(missing, missing.join(', ')).toHaveLength(0);
  });

  it('never gives two siblings the same variant key', () => {
    const seen = new Set<string>();
    for (const sign of ROAD_SIGNS) {
      if (!sign.variant) continue;
      const key = `${sign.code}/${sign.variant.key}`;
      expect(seen.has(key), key).toBe(false);
      seen.add(key);
    }
  });
});

describe('assemblies in content', () => {
  const questionAssemblies = ALL_QUESTIONS.filter((q) => q.signAssembly);
  const lessonAssemblies = LESSONS.flatMap((l) =>
    l.blocks.filter((b): b is Extract<typeof b, { kind: 'signAssembly' }> => b.kind === 'signAssembly'),
  );

  it('has combination questions and a lesson that teaches them', () => {
    expect(questionAssemblies.length).toBeGreaterThanOrEqual(8);
    expect(lessonAssemblies.length).toBeGreaterThanOrEqual(3);
  });

  it('points only at signs and plates that exist', () => {
    const all = [
      ...questionAssemblies.map((q) => q.signAssembly!),
      ...lessonAssemblies.map((b) => ({ mainSignId: b.mainSignId, plateIds: b.plateIds })),
    ];
    for (const assembly of all) {
      expect(getRoadSign(assembly.mainSignId), assembly.mainSignId).toBeDefined();
      for (const plateId of assembly.plateIds) {
        const plate = getRoadSign(plateId);
        expect(plate, plateId).toBeDefined();
        // The thing under a sign has to actually be a plate, or the combined
        // reading is nonsense.
        expect(plate!.plate, `${plateId} är inte en tilläggstavla`).toBeDefined();
      }
    }
  });

  it('never hangs a plate under another plate', () => {
    for (const q of questionAssemblies) {
      expect(getRoadSign(q.signAssembly!.mainSignId)!.plate, q.id).toBeUndefined();
    }
  });

  it('produces a readable combined meaning for every assembly used', () => {
    for (const q of questionAssemblies) {
      const text = interpretSignAssembly(q.signAssembly!.mainSignId, q.signAssembly!.plateIds);
      expect(text.length, q.id).toBeGreaterThan(25);
    }
  });
});

describe('an assembly question does not answer itself', () => {
  const source = readFileSync(resolve(ROOT, 'src/ui/illustrations/RoadSignAssembly.tsx'), 'utf8');

  it('describes the post by appearance while the question is open', () => {
    expect(source).toContain('quizSafeAltText');
    expect(source).toContain('quizSafe');
  });

  it('withholds the combined meaning until the question is answered', () => {
    expect(source).toContain('showMeaning && !quizSafe');
  });

  it('does not put the combined meaning into any prompt', () => {
    const leaks: string[] = [];
    for (const q of ALL_QUESTIONS) {
      if (!q.signAssembly) continue;
      const meaning = interpretSignAssembly(q.signAssembly.mainSignId, q.signAssembly.plateIds);
      // The distinctive half is the plate's phrase; the sign's own meaning may
      // legitimately be the premise of the question.
      for (const plateId of q.signAssembly.plateIds) {
        const phrase = getRoadSign(plateId)?.plate?.combinedPhrase;
        if (phrase && q.prompt.toLocaleLowerCase('sv').includes(phrase.toLocaleLowerCase('sv'))) {
          leaks.push(`${q.id}: "${phrase}"`);
        }
      }
      expect(meaning.length).toBeGreaterThan(0);
    }
    expect(leaks, leaks.join('; ')).toHaveLength(0);
  });

  it('describes the whole post as one group rather than as loose images', () => {
    // A screen reader should hear one post, not two unrelated pictures. The
    // individual signs are marked decorative for exactly that reason.
    expect(source).toContain("role=\"group\"");
    expect(source).toContain('decorative');
  });
});
