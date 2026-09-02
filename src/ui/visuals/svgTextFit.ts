/**
 * Estimating how wide a piece of SVG text will be drawn.
 *
 * SVG does not wrap text. A label wider than its `viewBox` is not shrunk or
 * broken — it is drawn past the edge and clipped, silently. That defect is
 * invisible in code review and easy to miss on screen, and five of them
 * shipped into the first draft of the original visuals before a measurement
 * pass in a real browser found them.
 *
 * A browser can measure this exactly with `getBBox`. jsdom cannot: it has no
 * layout engine, so every text node reports zero width. So the automated gate
 * estimates instead, from the character mix and the font size.
 *
 * The estimate is deliberately **generous** — it assumes text is wider than it
 * usually is. That means it can occasionally complain about a label that would
 * in fact have fitted, which costs a few units of margin, and it means a label
 * that really does overflow is very unlikely to slip through. The browser
 * measurement stays the ground truth; this is the gate that runs on every
 * commit.
 */

/**
 * Advance width per character, as a fraction of the font size.
 *
 * Rough figures for a humanist sans at the weights used here. Capitals and
 * digits are wide, lowercase middling, spaces and thin punctuation narrow.
 * Anything unlisted falls back to the lowercase figure.
 */
const NARROW = new Set([...' .,:;!|\'’`·']);
const THIN = new Set([...'iíjltfrI1()[]{}/\\-–—×']);
const WIDE = new Set([...'ABCDEFGHKLNOPQRSTUVXYZÅÄÖmwMW@%&']);

export function estimateTextWidth(text: string, fontSize: number, bold = false): number {
  let units = 0;
  for (const ch of text) {
    if (NARROW.has(ch)) units += 0.3;
    else if (THIN.has(ch)) units += 0.34;
    else if (WIDE.has(ch)) units += 0.78;
    else if (ch >= '0' && ch <= '9') units += 0.6;
    else units += 0.56;
  }
  // Bold text is a little wider, and the estimate carries a safety margin so
  // that being wrong tends toward a false alarm rather than a missed clip.
  return units * fontSize * (bold ? 1.06 : 1) * 1.06;
}

export interface TextBox {
  text: string;
  left: number;
  right: number;
  bottom: number;
}

/** Where a `<text>` element will actually sit, given its anchor. */
export function textBox(
  text: string,
  x: number,
  y: number,
  fontSize: number,
  anchor: 'start' | 'middle' | 'end',
  bold = false,
): TextBox {
  const width = estimateTextWidth(text, fontSize, bold);
  const left = anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width : x;
  // y is the baseline; descenders reach a little below it.
  return { text, left, right: left + width, bottom: y + fontSize * 0.22 };
}
