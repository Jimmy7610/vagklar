import { describe, expect, it } from 'vitest';
import { ROAD_SIGNS } from '@/content/road-signs';

/**
 * The description has to agree with the picture.
 *
 * An earlier pass found twelve signs whose written description contradicted the
 * artwork — the motorway signs were called blue when they are green, E11 was
 * said to carry "a white ring around the digit 30" when it reads *max 30
 * km/tim*, T14 was called white when it is red. Every one of them had survived
 * for the same reason: the drawing had been made from the description, so there
 * was nothing to disagree with.
 *
 * `visualTraits` breaks that circle. The traits are read off the artwork by
 * scripts/derive-sign-traits.py — never from the prose — so comparing prose
 * against traits is a real check rather than a tautology.
 *
 * The comparison is deliberately structured rather than regex-driven. A first
 * attempt at this matched the word "gul" and found it inside *rektangulär*,
 * reporting eleven defects that did not exist. So a colour counts as "claimed"
 * only when it appears as a whole word.
 */

/**
 * Swedish colour words, matched as whole words.
 *
 * Not with `\b`. JavaScript's word boundary is ASCII-only, so `\bblå\b` never
 * matches anything at all — å is not a word character to it, and the boundary
 * after it can never be satisfied. That silently turned the check off for every
 * blue sign in the registry, which is how twenty-eight of them were reported as
 * having no colour in their description when they all say "Blå".
 *
 * So the boundaries are spelled out against the Swedish alphabet instead.
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

/** Words that name the sign itself rather than something drawn on it. */
const SHAPE = '(?:skylt|skylten|triangel|kvadrat|rektangul\\w*|rund|runt|cirkel|tavla|åttakant\\w*|fyrkantig|pilformad|märke|märket)';

/**
 * Which colour the prose claims the *sign* is.
 *
 * The distinction matters. "Blå fyrkantig skylt med en röd pil" says the sign is
 * blue and something on it is red, and only the first of those is a claim about
 * the field. Checking every colour word instead would flag every prohibition
 * sign for mentioning its own red slash — and a gate that cries wolf is a gate
 * people stop reading.
 */
function fieldColourClaimed(text: string): string | undefined {
  // Nearest wins, not first-in-the-object. "Vit skylt med en röd symbol" names
  // a white sign carrying a red symbol; testing red before white reported it as
  // a red sign, which is the opposite of what the sentence says.
  let best: { colour: string; distance: number } | undefined;
  for (const [colour, pattern] of Object.entries(COLOUR_WORDS)) {
    const source = pattern.source;
    for (const shape of [
      new RegExp(`(${source})([^.,;]{0,24}?)${SHAPE}`, 'i'),
      new RegExp(`${SHAPE}([^.,;]{0,16}?)(${source})`, 'i'),
    ]) {
      const found = shape.exec(text);
      if (!found) continue;
      const gap = (found[2] ?? found[1] ?? '').length;
      if (!best || gap < best.distance) best = { colour, distance: gap };
    }
  }
  return best?.colour;
}

/** Which sign colours a piece of Swedish prose mentions at all. */
function coloursClaimed(text: string): Set<string> {
  const found = new Set<string>();
  for (const [colour, pattern] of Object.entries(COLOUR_WORDS)) {
    if (pattern.test(text)) found.add(colour);
  }
  return found;
}

describe('every sign records what its picture looks like', () => {
  it('has visualTraits on all of them', () => {
    const missing = ROAD_SIGNS.filter((s) => !s.visualTraits).map((s) => s.id);
    expect(missing, missing.join(', ')).toHaveLength(0);
  });

  it('records a background colour that is one Swedish signs actually use', () => {
    const allowed = new Set(['yellow', 'blue', 'green', 'red', 'white', 'black']);
    for (const s of ROAD_SIGNS) {
      expect(allowed.has(s.visualTraits!.background), `${s.id}: ${s.visualTraits!.background}`).toBe(
        true,
      );
    }
  });
});

describe('the description agrees with the artwork', () => {
  it('never calls the sign a colour it is not', () => {
    /**
     * The defect this exists for: "Blå rektangulär skylt" written about a sign
     * that is green. Only the claim about the field is checked — a blue sign
     * described as having a red arrow on it is describing the sign correctly.
     */
    const wrong: string[] = [];
    for (const s of ROAD_SIGNS) {
      const background = s.visualTraits!.background;
      const claimed = fieldColourClaimed(s.altText);
      if (claimed && claimed !== background) {
        wrong.push(`${s.id} (${s.code}): kallar den ${claimed}, bilden är ${background}`);
      }
    }
    expect(wrong, wrong.join('; ')).toHaveLength(0);
  });

  it('describes the background colour it records, rather than staying silent', () => {
    // A description that mentions no colour at all is not wrong, but for a sign
    // whose whole identity is its colour it is a description that has not done
    // its job.
    const silent = ROAD_SIGNS.filter((s) => {
      const background = s.visualTraits!.background;
      if (background === 'white' || background === 'black') return false;
      return !coloursClaimed(s.altText).has(background);
    }).map((s) => `${s.id} (${s.visualTraits!.background})`);
    expect(silent, silent.join(', ')).toHaveLength(0);
  });

  it('states the number on a sign whose meaning is a number', () => {
    for (const s of ROAD_SIGNS) {
      const value = s.visualTraits!.numericValue ?? s.variant?.numericValue;
      if (value === undefined) continue;
      expect(s.altText, `${s.id} nämner inte ${value}`).toContain(String(value));
    }
  });

  it('keeps the variant number and the drawn number the same', () => {
    // Two places record the number a speed sign shows: the variant, which says
    // which sibling this is, and the traits, which say what the picture has on
    // it. They disagreeing would mean the app is showing one number and
    // reasoning about another.
    for (const s of ROAD_SIGNS) {
      if (s.variant?.numericValue === undefined) continue;
      if (s.visualTraits?.numericValue === undefined) continue;
      expect(s.visualTraits.numericValue, s.id).toBe(s.variant.numericValue);
    }
  });

  it('keeps the variant arrow and the drawn arrow pointing the same way', () => {
    for (const s of ROAD_SIGNS) {
      if (!s.variant?.arrowDirection || !s.visualTraits?.arrowDirection) continue;
      expect(s.visualTraits.arrowDirection, s.id).toBe(s.variant.arrowDirection);
    }
  });

  it('quotes text that is printed on the sign', () => {
    // Where the traits say the face carries words, the description has to
    // contain them. This is what would have caught B2 being described as
    // reading "STOPP" when the sign reads STOP.
    const missing: string[] = [];
    for (const s of ROAD_SIGNS) {
      const text = s.visualTraits?.text;
      if (!text) continue;
      const squash = (value: string) => value.replace(/\s+/g, '');
      const described = squash(`${s.altText} ${s.quizSafeAltText ?? ''}`);
      if (!described.includes(squash(text))) missing.push(`${s.id}: "${text}"`);
    }
    expect(missing, missing.join('; ')).toHaveLength(0);
  });
});

describe('the colour-word matcher itself', () => {
  /**
   * Guarding the guard. The first version of this check matched "gul" as a
   * substring and found it inside "rektangulär", producing eleven false
   * reports. A gate that cries wolf gets ignored, so the matcher is tested.
   */
  it('does not find a colour inside a longer word', () => {
    expect(coloursClaimed('Blå rektangulär skylt').has('yellow')).toBe(false);
    expect(coloursClaimed('En rektangulär tavla').size).toBe(0);
  });

  it('matches a colour word that ends in a Swedish letter', () => {
    // The regression that made this file necessary: JavaScript's \\b is
    // ASCII-only, so a pattern anchored with it can never match "blå" and the
    // check quietly passes for every blue sign there is.
    expect(coloursClaimed('Blå fyrkantig skylt').has('blue')).toBe(true);
    expect(coloursClaimed('En grå dag').has('blue')).toBe(false);
  });

  it('separates what the sign is from what is drawn on it', () => {
    expect(fieldColourClaimed('Blå fyrkantig skylt med en röd pil')).toBe('blue');
    expect(fieldColourClaimed('Grön rektangulär skylt med vit symbol')).toBe('green');
    // The colour touching the shape word wins over one further away.
    expect(fieldColourClaimed('Vit skylt med en röd symbol')).toBe('white');
  });

  it('does find a colour used as a word, in its inflected forms', () => {
    expect(coloursClaimed('gul triangel').has('yellow')).toBe(true);
    expect(coloursClaimed('med gult fält').has('yellow')).toBe(true);
    expect(coloursClaimed('två svarta pilar').has('black')).toBe(true);
    expect(coloursClaimed('grön rektangulär skylt').has('green')).toBe(true);
  });
});
