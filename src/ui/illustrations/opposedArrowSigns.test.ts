import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { SIGN_GLYPHS } from './signGlyphs';
import { getRoadSign } from '@/content/road-signs';

/**
 * The three signs that show two opposed arrows.
 *
 * A25, B6 and B7 were all drawn mirrored, and A25 additionally had one arrow in
 * the wrong colour — it shows two black arrows in the regulation, not a black
 * one and a red one. The three were mirrored *consistently*, which is exactly
 * why nobody caught it: they looked right next to each other, and reading the
 * path data tells you nothing about which way round a sign is supposed to be.
 *
 * It was settled by rendering the source's own sign plates and looking at them:
 * Körkortsboken 2026 s. 326 for A25, s. 328 for B6 and B7. This test writes
 * down what those plates show, so the next person to touch these paths finds
 * out immediately rather than in a year.
 *
 * The colours also carry the rule. On B6 the arrow pointing your way is red —
 * you are the one who yields. On B7 it is white — you go first. A mirrored
 * drawing keeps that pairing intact, which is why the meaning survived the
 * defect and only the picture was wrong.
 */

interface Arrow {
  x: number;
  colour: string;
  direction: 'up' | 'down';
}

/**
 * Reads the arrows out of a rendered sign.
 *
 * Each is drawn as one path: a shaft (`M x y1 V y2`) followed by a head
 * (`M x y3 l…`). The head sitting below the shaft's end means the arrow points
 * down; above it, up.
 */
function arrowsOf(signId: string): Arrow[] {
  const markup = renderToStaticMarkup(
    createElement('svg', { xmlns: 'http://www.w3.org/2000/svg' }, SIGN_GLYPHS[signId]),
  );
  const doc = new DOMParser().parseFromString(markup, 'image/svg+xml');
  const arrows: Arrow[] = [];
  for (const node of doc.querySelectorAll('path')) {
    const d = node.getAttribute('d') ?? '';
    const match = /^M(\d+(?:\.\d+)?) (\d+(?:\.\d+)?) V(\d+(?:\.\d+)?) M\1 (\d+(?:\.\d+)?)/.exec(d);
    if (!match) continue;
    const shaftEnd = Number(match[3]);
    const headTip = Number(match[4]);
    arrows.push({
      x: Number(match[1]),
      colour: (node.getAttribute('fill') ?? '').toLowerCase(),
      direction: headTip > shaftEnd ? 'down' : 'up',
    });
  }
  return arrows.sort((a, b) => a.x - b.x);
}

const BLACK = '#1a1a1a';
const RED = '#c8102e';
const WHITE = '#ffffff';

describe('signs with two opposed arrows match the source plates', () => {
  it('reads two arrows out of each of them', () => {
    for (const id of ['varning-motande-trafik', 'vajningsplikt-motande', 'motande-har-vajningsplikt']) {
      expect(arrowsOf(id), id).toHaveLength(2);
    }
  });

  it('A25 shows two black arrows, down on the left and up on the right', () => {
    const [left, right] = arrowsOf('varning-motande-trafik');
    expect(left!.direction).toBe('down');
    expect(right!.direction).toBe('up');
    // Neither direction has priority here, so neither arrow is red.
    expect(left!.colour).toBe(BLACK);
    expect(right!.colour).toBe(BLACK);
  });

  it('B6 puts the black arrow down on the left and the red one up on the right', () => {
    const [left, right] = arrowsOf('vajningsplikt-motande');
    expect(left!.colour).toBe(BLACK);
    expect(left!.direction).toBe('down');
    expect(right!.colour).toBe(RED);
    expect(right!.direction).toBe('up');
  });

  it('B7 puts the red arrow down on the left and the white one up on the right', () => {
    const [left, right] = arrowsOf('motande-har-vajningsplikt');
    expect(left!.colour).toBe(RED);
    expect(left!.direction).toBe('down');
    expect(right!.colour).toBe(WHITE);
    expect(right!.direction).toBe('up');
  });

  it('B6 and B7 are opposites, which is the whole point of the pair', () => {
    const b6 = arrowsOf('vajningsplikt-motande');
    const b7 = arrowsOf('motande-har-vajningsplikt');
    // Same layout, and on both signs the arrow pointing your way is the one
    // that says who yields: red on B6, white on B7.
    expect(b6.map((a) => a.direction)).toEqual(b7.map((a) => a.direction));
    expect(b6[1]!.colour).toBe(RED);
    expect(b7[1]!.colour).toBe(WHITE);
  });

  it('describes the arrows in words the same way round', () => {
    // The written description is what a screen reader gets, so it has to agree
    // with the drawing rather than with the old mirrored version.
    expect(getRoadSign('varning-motande-trafik')?.altText).toContain('två svarta pilar');
    expect(getRoadSign('vajningsplikt-motande')?.altText).toContain('vänster en svart pil nedåt');
    expect(getRoadSign('motande-har-vajningsplikt')?.altText).toContain('vänster en röd pil nedåt');
  });
});
