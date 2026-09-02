import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { ORIGINAL_VISUAL_GLYPHS } from './originalVisualGlyphs';
import { ORIGINAL_VISUALS } from '@/content/original-visuals';
import { textBox } from './svgTextFit';

/**
 * The permanent gate against clipped labels.
 *
 * SVG text does not wrap and does not shrink. A label wider than its `viewBox`
 * is drawn past the edge and cut off without any error, which is how five
 * clipped labels reached a build of the original visuals: reading the code
 * does not reveal it, and on screen it looks like a label that happens to be
 * worded oddly.
 *
 * A browser measures this exactly. jsdom has no layout engine, so this
 * estimates the width instead — generously, so it errs toward complaining. The
 * browser pass in docs/QA.md remains the ground truth; this is what runs on
 * every commit.
 */

interface ParsedText {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  anchor: 'start' | 'middle' | 'end';
  bold: boolean;
}

function textsOf(rendererId: string): ParsedText[] {
  const glyph = ORIGINAL_VISUAL_GLYPHS[rendererId];
  const markup = renderToStaticMarkup(
    createElement('svg', { xmlns: 'http://www.w3.org/2000/svg' }, glyph),
  );
  const doc = new DOMParser().parseFromString(markup, 'image/svg+xml');
  return [...doc.querySelectorAll('text')].map((node) => {
    const weight = node.getAttribute('font-weight');
    const anchor = node.getAttribute('text-anchor');
    return {
      text: node.textContent ?? '',
      x: Number(node.getAttribute('x') ?? 0),
      y: Number(node.getAttribute('y') ?? 0),
      fontSize: Number(node.getAttribute('font-size') ?? 12),
      anchor: anchor === 'middle' || anchor === 'end' ? anchor : 'start',
      bold: weight !== null && Number(weight) >= 600,
    };
  });
}

describe('SVG text stays inside its viewBox', () => {
  const approved = ORIGINAL_VISUALS.filter((v) => v.status === 'approved');

  it('measures something at all', () => {
    const total = approved.reduce((n, v) => n + textsOf(v.rendererId).length, 0);
    expect(total).toBeGreaterThan(40);
  });

  for (const visual of approved) {
    it(`${visual.id} draws no label past its own edge`, () => {
      const outside: string[] = [];
      for (const t of textsOf(visual.rendererId)) {
        const box = textBox(t.text, t.x, t.y, t.fontSize, t.anchor, t.bold);
        if (box.left < -1) {
          outside.push(`"${t.text}" ${Math.round(-box.left)} utanför vänsterkanten`);
        }
        if (box.right > visual.width + 1) {
          outside.push(`"${t.text}" ${Math.round(box.right - visual.width)} utanför högerkanten`);
        }
        if (box.bottom > visual.height + 1) {
          outside.push(`"${t.text}" ${Math.round(box.bottom - visual.height)} under nederkanten`);
        }
      }
      expect(outside, outside.join('; ')).toHaveLength(0);
    });
  }
});

describe('the estimator catches the clipping it was built for', () => {
  /**
   * The five labels that actually shipped clipped, before the browser pass
   * found them. If the estimator cannot see these, it is not a gate — it is
   * decoration that passes.
   */
  const realDefects: { name: string; box: ReturnType<typeof textBox>; limit: number }[] = [
    {
      name: 'monsterdjup: förklarande mening som bröt figuren',
      box: textBox(
        'Mönsterdjupet är hur långt ner spåret går — inte hur mycket gummi som finns kvar',
        160,
        26,
        10,
        'middle',
      ),
      limit: 320,
    },
    {
      name: 'monsterdjup: kravraden',
      box: textBox('Minst 1,6 mm sommartid · minst 3 mm på vinterdäck vintertid', 160, 46, 12, 'middle', true),
      limit: 320,
    },
    {
      name: 'monsterdjup: måttet bredvid högra panelen',
      box: textBox('1,6 mm', 298, 125, 12, 'start', true),
      limit: 320,
    },
    {
      name: 'krockvald-hastighet: multiplikatorn efter den långa stapeln',
      box: textBox('4×', 316, 111, 13, 'start', true),
      limit: 320,
    },
    {
      name: 'krockvald-hastighet: förklarande mening',
      box: textBox(
        'Energin växer med kvadraten på hastigheten — och allt måste tas upp någonstans',
        160,
        182,
        10,
        'middle',
      ),
      limit: 320,
    },
    {
      name: 'dackslitage-fraga: etiketten till vänster om linjen',
      box: textBox('ursprunglig höjd', 52, 59, 9, 'end'),
      limit: 320,
    },
  ];

  for (const d of realDefects) {
    it(`ser att ${d.name} inte får plats`, () => {
      const overflows = d.box.left < -1 || d.box.right > d.limit + 1;
      expect(overflows, `${d.box.left} … ${d.box.right} i 0 … ${d.limit}`).toBe(true);
    });
  }
});
