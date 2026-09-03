import { describe, expect, it } from 'vitest';
import { LESSONS } from '@/content/lessons';
import { SOURCE_IMAGES } from '@/content/source-images';
import { ROAD_SIGNS } from '@/content/road-signs';
import { ROAD_MARKINGS } from '@/content/road-markings';

/**
 * A context pair claims a sign is visible in a photograph. Is it?
 *
 * The claim is the whole value of the block — "this is the sign, and this is
 * what it looks like on a real post" — and it is also the easiest thing in the
 * app to get wrong, because the two halves are authored in different files and
 * nothing sits between them. It has been wrong: a photograph registered as
 * `forbud-att-stanna` actually showed C35, one diagonal rather than a cross,
 * and the lesson taught a stopping prohibition from a picture of a parking one.
 *
 * The check that would have caught it is cheap. Swedish signs carry their
 * meaning in colour and shape, and both halves of a pair describe those in
 * prose: the registry says what the sign looks like, the photograph's
 * description says what is on the post. If the photograph's description does
 * not mention the sign's own field colour, then either the photograph does not
 * show that sign or the description does not describe it — and both are worth
 * stopping for.
 *
 * It cannot prove the pair is right. Two yellow signs will both pass. It closes
 * the class of error where the pair is *obviously* wrong, which is the class
 * that actually occurred.
 */

/**
 * Whole-word Swedish colours.
 *
 * Not `\b`: JavaScript's word boundary is ASCII-only, so `\bblå\b` matches
 * nothing at all and would silently pass every blue sign. Same reasoning, and
 * the same fix, as in signTraits.test.ts.
 */
const LETTER = 'a-zA-ZåäöÅÄÖ';
const word = (...forms: string[]) =>
  new RegExp(`(?<![${LETTER}])(?:${forms.join('|')})(?![${LETTER}])`, 'i');

const COLOUR_WORDS: Record<string, RegExp> = {
  yellow: word('gul', 'gula', 'gult'),
  blue: word('blå', 'blått', 'blåa'),
  green: word('grön', 'grönt', 'gröna'),
  red: word('röd', 'rött', 'röda'),
  white: word('vit', 'vitt', 'vita'),
  black: word('svart', 'svarta'),
};

const imageById = new Map(SOURCE_IMAGES.map((i) => [i.id, i]));
const signById = new Map(ROAD_SIGNS.map((s) => [s.id, s]));
const markingById = new Map(ROAD_MARKINGS.map((m) => [m.id, m]));

interface SignPair {
  lessonId: string;
  signId: string;
  imageId: string;
  notice: string;
}
interface MarkingPair {
  lessonId: string;
  markingId: string;
  imageId: string;
  notice: string;
}

const signPairs: SignPair[] = [];
const markingPairs: MarkingPair[] = [];
for (const lesson of LESSONS) {
  for (const block of lesson.blocks) {
    if (block.kind === 'signInContext') {
      signPairs.push({
        lessonId: lesson.id,
        signId: block.signId,
        imageId: block.imageId,
        notice: block.notice,
      });
    }
    if (block.kind === 'markingInContext') {
      markingPairs.push({
        lessonId: lesson.id,
        markingId: block.markingId,
        imageId: block.imageId,
        notice: block.notice,
      });
    }
  }
}

describe('sign-in-context pairs', () => {
  it('exist in useful numbers', () => {
    expect(signPairs.length).toBeGreaterThanOrEqual(12);
  });

  it('name a sign and a photograph that both exist', () => {
    for (const pair of signPairs) {
      expect(signById.get(pair.signId), `${pair.lessonId} -> ${pair.signId}`).toBeDefined();
      expect(imageById.get(pair.imageId), `${pair.lessonId} -> ${pair.imageId}`).toBeDefined();
    }
  });

  it('only use approved photographs', () => {
    for (const pair of signPairs) {
      expect(imageById.get(pair.imageId)?.status, pair.imageId).toBe('approved');
    }
  });

  it('describes the sign in the photograph it is paired with', () => {
    const mismatched: string[] = [];

    for (const pair of signPairs) {
      const sign = signById.get(pair.signId);
      const image = imageById.get(pair.imageId);
      const field = sign?.visualTraits?.background;
      if (!sign || !image || !field) continue;

      const pattern = COLOUR_WORDS[field];
      if (!pattern) continue;

      // The whole entry, because the colour can reasonably sit in the short alt
      // or in the long description depending on how the sentence fell out.
      const described = `${image.altText} ${image.longDescription}`;
      if (!pattern.test(described)) {
        mismatched.push(
          `${pair.lessonId}: ${sign.code} ${pair.signId} är ${field}, men ` +
            `\`${pair.imageId}\` nämner inte den färgen`,
        );
      }
    }

    expect(mismatched, `\n${mismatched.join('\n')}\n`).toEqual([]);
  });

  it('never states what the sign means in the notice', () => {
    // The notice says what to look for. The meaning is the sign's own field and
    // the lesson's prose; repeating it here turns "find it on the post" into
    // "read the answer under the picture".
    for (const pair of signPairs) {
      const sign = signById.get(pair.signId);
      if (!sign) continue;
      expect(pair.notice, `${pair.lessonId} / ${pair.signId}`).not.toContain(sign.shortMeaning);
    }
  });
});

describe('marking-in-context pairs', () => {
  it('exist', () => {
    expect(markingPairs.length).toBeGreaterThanOrEqual(4);
  });

  it('name a marking and a photograph that both exist', () => {
    for (const pair of markingPairs) {
      expect(markingById.get(pair.markingId), `${pair.lessonId} -> ${pair.markingId}`).toBeDefined();
      expect(imageById.get(pair.imageId), `${pair.lessonId} -> ${pair.imageId}`).toBeDefined();
    }
  });

  it('only use approved photographs', () => {
    for (const pair of markingPairs) {
      expect(imageById.get(pair.imageId)?.status, pair.imageId).toBe('approved');
    }
  });

  it('never states what the marking means in the notice', () => {
    for (const pair of markingPairs) {
      const marking = markingById.get(pair.markingId);
      if (!marking) continue;
      expect(pair.notice, `${pair.lessonId} / ${pair.markingId}`).not.toContain(marking.meaning);
      expect(pair.notice, `${pair.lessonId} / ${pair.markingId}`).not.toContain(marking.forDriver);
    }
  });
});

describe('photograph descriptions', () => {
  it('never contradict their own caption about a colour', () => {
    // The description and the caption are written at different times and about
    // different things — one says what is there, the other says why it matters
    // — so they drift. A colour named in both has to be the same colour.
    const clashes: string[] = [];

    for (const image of SOURCE_IMAGES) {
      if (image.status !== 'approved') continue;
      const described = `${image.altText} ${image.longDescription}`;
      for (const [colour, pattern] of Object.entries(COLOUR_WORDS)) {
        if (!pattern.test(image.caption)) continue;
        if (!pattern.test(described)) {
          clashes.push(`${image.id}: bildtexten säger ${colour}, beskrivningen inte`);
        }
      }
    }

    expect(clashes, `\n${clashes.join('\n')}\n`).toEqual([]);
  });
});
