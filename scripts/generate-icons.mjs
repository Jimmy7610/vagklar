/**
 * Generates Vägklar's PWA icons and the Open Graph image.
 *
 * Everything is drawn here rather than committed as opaque binaries, so the
 * brand mark has exactly one source of truth (this file plus the matching SVG)
 * and the assets can be regenerated at any size.
 *
 * The renderer is a small signed-distance rasteriser: shapes report a distance
 * per pixel, coverage is derived from that distance, and the result is blended
 * source-over. That gives clean anti-aliasing without pulling in a canvas
 * dependency. PNGs are encoded with Node's built-in zlib.
 *
 * Usage:  node scripts/generate-icons.mjs
 */

import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = resolve(ROOT, 'public/icons');

/* ------------------------------------------------------------------ */
/* Colours (must match src/styles/tokens.css)                          */
/* ------------------------------------------------------------------ */

const INK = [15, 46, 51, 255]; // --color-primary-dark
const TEAL = [23, 107, 104, 255]; // --color-primary
const MINT = [83, 185, 174, 255]; // --color-primary-darkmode
const PAPER = [247, 248, 245, 255]; // --color-bg
const SURFACE = [255, 255, 255, 255];

/* ------------------------------------------------------------------ */
/* Canvas                                                              */
/* ------------------------------------------------------------------ */

function createCanvas(width, height) {
  return { width, height, data: new Float64Array(width * height * 4) };
}

function fillCanvas(canvas, color) {
  const [r, g, b, a] = color;
  for (let i = 0; i < canvas.data.length; i += 4) {
    canvas.data[i] = r;
    canvas.data[i + 1] = g;
    canvas.data[i + 2] = b;
    canvas.data[i + 3] = a;
  }
}

/** Source-over blend of `color` at `coverage` (0–1). */
function blendPixel(canvas, index, color, coverage) {
  if (coverage <= 0) return;
  const alpha = (color[3] / 255) * Math.min(1, coverage);
  if (alpha <= 0) return;
  const d = canvas.data;
  const dstA = d[index + 3] / 255;
  const outA = alpha + dstA * (1 - alpha);
  if (outA <= 0) {
    d[index] = 0;
    d[index + 1] = 0;
    d[index + 2] = 0;
    d[index + 3] = 0;
    return;
  }
  for (let c = 0; c < 3; c += 1) {
    d[index + c] = (color[c] * alpha + d[index + c] * dstA * (1 - alpha)) / outA;
  }
  d[index + 3] = outA * 255;
}

/**
 * Paint a shape described by a signed distance function.
 * Negative distance = inside. Coverage is a 1px linear ramp across the edge.
 */
function paint(canvas, sdf, color, bounds) {
  const x0 = Math.max(0, Math.floor(bounds?.[0] ?? 0));
  const y0 = Math.max(0, Math.floor(bounds?.[1] ?? 0));
  const x1 = Math.min(canvas.width, Math.ceil(bounds?.[2] ?? canvas.width));
  const y1 = Math.min(canvas.height, Math.ceil(bounds?.[3] ?? canvas.height));

  for (let y = y0; y < y1; y += 1) {
    for (let x = x0; x < x1; x += 1) {
      const distance = sdf(x + 0.5, y + 0.5);
      if (distance > 1) continue;
      const coverage = Math.min(1, Math.max(0, 0.5 - distance));
      if (coverage <= 0) continue;
      blendPixel(canvas, (y * canvas.width + x) * 4, color, coverage);
    }
  }
}

/* ------------------------------------------------------------------ */
/* Signed distance functions                                           */
/* ------------------------------------------------------------------ */

function sdRoundedRect(px, py, cx, cy, halfW, halfH, radius) {
  const qx = Math.abs(px - cx) - (halfW - radius);
  const qy = Math.abs(py - cy) - (halfH - radius);
  const ax = Math.max(qx, 0);
  const ay = Math.max(qy, 0);
  return Math.hypot(ax, ay) + Math.min(Math.max(qx, qy), 0) - radius;
}

function sdSegment(px, py, ax, ay, bx, by, radius) {
  const pax = px - ax;
  const pay = py - ay;
  const bax = bx - ax;
  const bay = by - ay;
  const lengthSq = bax * bax + bay * bay;
  const t = lengthSq === 0 ? 0 : Math.min(1, Math.max(0, (pax * bax + pay * bay) / lengthSq));
  return Math.hypot(pax - bax * t, pay - bay * t) - radius;
}

/** Distance to a stroked polyline (round joins and caps). */
function sdPolyline(px, py, points, radius) {
  let best = Infinity;
  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i];
    const b = points[i + 1];
    const d = sdSegment(px, py, a[0], a[1], b[0], b[1], radius);
    if (d < best) best = d;
  }
  return best;
}

function boundsOfPoints(points, pad) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [x, y] of points) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  return [minX - pad, minY - pad, maxX + pad, maxY + pad];
}

function strokePolyline(canvas, points, radius, color) {
  paint(
    canvas,
    (x, y) => sdPolyline(x, y, points, radius),
    color,
    boundsOfPoints(points, radius + 2),
  );
}

function fillCircle(canvas, cx, cy, radius, color) {
  paint(
    canvas,
    (x, y) => Math.hypot(x - cx, y - cy) - radius,
    color,
    [cx - radius - 2, cy - radius - 2, cx + radius + 2, cy + radius + 2],
  );
}

function fillRoundedRect(canvas, x, y, w, h, radius, color) {
  paint(
    canvas,
    (px, py) => sdRoundedRect(px, py, x + w / 2, y + h / 2, w / 2, h / 2, radius),
    color,
    [x - 2, y - 2, x + w + 2, y + h + 2],
  );
}

/* ------------------------------------------------------------------ */
/* The Vägklar mark                                                    */
/* ------------------------------------------------------------------ */

/**
 * The mark is a checkmark whose long arm doubles as a road, drawn in a
 * 32×32 space to match src/ui/brand/Logo.tsx.
 */
function drawMark(canvas, originX, originY, size, strokeColor, laneColor) {
  const s = size / 32;
  // Optical centring: the check's ink sits slightly high-right in the 32×32
  // box, so nudge it back for icon compositions.
  const px = (x, y) => [originX + (x - 0.5) * s, originY + (y + 0.9) * s];

  const check = [px(5.5, 17.2), px(12.4, 24), px(26.5, 6.5)];
  strokePolyline(canvas, check, 2.5 * s, strokeColor);

  if (!laneColor) return;

  // Dashed centre line along the long arm — the detail that turns the
  // checkmark into a road. Skipped at small sizes where it would smear.
  if (size < 96) return;
  const from = px(13.6, 21.2);
  const to = px(24.2, 8.1);
  const dashes = 5;
  for (let i = 0; i < dashes; i += 1) {
    const t0 = i / dashes + 0.06;
    const t1 = (i + 1) / dashes - 0.06;
    const a = [from[0] + (to[0] - from[0]) * t0, from[1] + (to[1] - from[1]) * t0];
    const b = [from[0] + (to[0] - from[0]) * t1, from[1] + (to[1] - from[1]) * t1];
    strokePolyline(canvas, [a, b], 0.62 * s, laneColor);
  }
}

/* ------------------------------------------------------------------ */
/* A minimal geometric stroke alphabet (only the letters we need)      */
/* ------------------------------------------------------------------ */

function arcPoints(cx, cy, radius, startDeg, endDeg, steps = 24) {
  const points = [];
  for (let i = 0; i <= steps; i += 1) {
    const angle = ((startDeg + ((endDeg - startDeg) * i) / steps) * Math.PI) / 180;
    points.push([cx + radius * Math.cos(angle), cy - radius * Math.sin(angle)]);
  }
  return points;
}

/**
 * Letters are polylines in a unit box (x 0–1, y 0–1, y downward), plus an
 * advance width. Enough for the wordmark; not a general-purpose font.
 */
const GLYPHS = {
  V: { strokes: [[[0, 0], [0.5, 1], [1, 0]]], advance: 1 },
  A: {
    strokes: [
      [[0, 1], [0.5, 0], [1, 1]],
      [[0.19, 0.62], [0.81, 0.62]],
    ],
    advance: 1,
  },
  G: {
    strokes: [
      [
        ...arcPoints(0.5, 0.5, 0.5, 45, 315, 30),
        [1.0, 0.5],
        [0.6, 0.5],
      ],
    ],
    advance: 1.02,
  },
  K: {
    strokes: [
      [[0, 0], [0, 1]],
      [[0.92, 0], [0.06, 0.56]],
      [[0.17, 0.47], [1, 1]],
    ],
    advance: 0.98,
  },
  L: { strokes: [[[0, 0], [0, 1], [0.82, 1]]], advance: 0.86 },
  R: {
    strokes: [
      [[0, 1], [0, 0], [0.55, 0]],
      arcPointsBowl(),
      [[0.55, 0.5], [0, 0.5]],
      [[0.4, 0.5], [1, 1]],
    ],
    advance: 1,
  },
};

function arcPointsBowl() {
  const points = [];
  for (let i = 0; i <= 16; i += 1) {
    const angle = ((90 - (180 * i) / 16) * Math.PI) / 180;
    points.push([0.55 + 0.25 * Math.cos(angle), 0.25 - 0.25 * Math.sin(angle)]);
  }
  return points;
}

/** Umlaut dots are drawn separately so they can sit above the box. */
const DIAERESIS = [
  [0.3, -0.17],
  [0.7, -0.17],
];

function drawWord(canvas, word, originX, baselineY, capHeight, strokeWidth, color, tracking = 0.1) {
  let cursor = originX;
  for (const char of word) {
    const isDiaeresis = char === 'Ä';
    const key = isDiaeresis ? 'A' : char;
    const glyph = GLYPHS[key];
    if (!glyph) continue;

    for (const stroke of glyph.strokes) {
      const points = stroke.map(([x, y]) => [
        cursor + x * capHeight * 0.72,
        baselineY - capHeight + y * capHeight,
      ]);
      strokePolyline(canvas, points, strokeWidth / 2, color);
    }

    if (isDiaeresis) {
      for (const [dx, dy] of DIAERESIS) {
        fillCircle(
          canvas,
          cursor + dx * capHeight * 0.72,
          baselineY - capHeight + dy * capHeight,
          strokeWidth * 0.58,
          color,
        );
      }
    }

    cursor += glyph.advance * capHeight * 0.72 + tracking * capHeight;
  }
  return cursor - tracking * capHeight;
}

// Reserved for future text layout in generated art.
export function measureWord(word, capHeight, tracking = 0.1) {
  let width = 0;
  for (const char of word) {
    const glyph = GLYPHS[char === 'Ä' ? 'A' : char];
    if (!glyph) continue;
    width += glyph.advance * capHeight * 0.72 + tracking * capHeight;
  }
  return width - tracking * capHeight;
}

/* ------------------------------------------------------------------ */
/* PNG encoding                                                        */
/* ------------------------------------------------------------------ */

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buffer) {
  let crc = 0xffffffff;
  for (let i = 0; i < buffer.length; i += 1) {
    crc = CRC_TABLE[(crc ^ buffer[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuffer = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuffer, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([length, body, crc]);
}

function encodePng(canvas) {
  const { width, height, data } = canvas;
  const raw = Buffer.alloc(height * (width * 4 + 1));
  let offset = 0;
  for (let y = 0; y < height; y += 1) {
    raw[offset] = 0; // filter: none
    offset += 1;
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      raw[offset] = Math.round(Math.min(255, Math.max(0, data[index])));
      raw[offset + 1] = Math.round(Math.min(255, Math.max(0, data[index + 1])));
      raw[offset + 2] = Math.round(Math.min(255, Math.max(0, data[index + 2])));
      raw[offset + 3] = Math.round(Math.min(255, Math.max(0, data[index + 3])));
      offset += 4;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/* ------------------------------------------------------------------ */
/* Compositions                                                        */
/* ------------------------------------------------------------------ */

function appIcon(size, { maskable = false } = {}) {
  const canvas = createCanvas(size, size);
  // A maskable icon must survive an aggressive circular crop, so the mark
  // shrinks into the 80% safe zone and the background bleeds to the edges.
  const radius = maskable ? 0 : size * 0.22;
  fillRoundedRect(canvas, 0, 0, size, size, radius, INK);

  const markSize = maskable ? size * 0.5 : size * 0.62;
  const origin = (size - markSize) / 2;
  drawMark(canvas, origin, origin, markSize, MINT, INK);
  return canvas;
}

function faviconIcon(size) {
  const canvas = createCanvas(size, size);
  fillRoundedRect(canvas, 0, 0, size, size, size * 0.2, INK);
  const markSize = size * 0.74;
  const origin = (size - markSize) / 2;
  drawMark(canvas, origin, origin, markSize, MINT, null);
  return canvas;
}

function appleTouchIcon(size) {
  // iOS applies its own corner mask, so we draw a full-bleed square.
  const canvas = createCanvas(size, size);
  fillRoundedRect(canvas, 0, 0, size, size, 0, INK);
  const markSize = size * 0.6;
  const origin = (size - markSize) / 2;
  drawMark(canvas, origin, origin, markSize, MINT, INK);
  return canvas;
}

function ogImage() {
  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height);

  // Vertical gradient from the brand ink to a warmer teal.
  for (let y = 0; y < height; y += 1) {
    const t = y / height;
    const r = 15 + (18 - 15) * t;
    const g = 46 + (72 - 46) * t;
    const b = 51 + (74 - 51) * t;
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      canvas.data[index] = r;
      canvas.data[index + 1] = g;
      canvas.data[index + 2] = b;
      canvas.data[index + 3] = 255;
    }
  }

  // Soft radial glow behind the ring.
  const glowX = 940;
  const glowY = 300;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const d = Math.hypot(x - glowX, y - glowY);
      if (d > 340) continue;
      const strength = (1 - d / 340) ** 2 * 0.22;
      const index = (y * width + x) * 4;
      canvas.data[index] += (MINT[0] - canvas.data[index]) * strength;
      canvas.data[index + 1] += (MINT[1] - canvas.data[index + 1]) * strength;
      canvas.data[index + 2] += (MINT[2] - canvas.data[index + 2]) * strength;
    }
  }

  // A readiness ring, the product's signature visual.
  const ringX = 940;
  const ringY = 315;
  const ringR = 132;
  paint(
    canvas,
    (x, y) => Math.abs(Math.hypot(x - ringX, y - ringY) - ringR) - 11,
    [255, 255, 255, 34],
    [ringX - ringR - 20, ringY - ringR - 20, ringX + ringR + 20, ringY + ringR + 20],
  );
  // 86% of the circumference, starting at the top and going clockwise.
  strokePolyline(
    canvas,
    arcPoints(ringX, ringY, ringR, 90, 90 - 360 * 0.86, 90),
    11,
    MINT,
  );

  // Wordmark and tagline.
  drawMark(canvas, 96, 92, 96, MINT, INK);

  const capHeight = 96;
  drawWord(canvas, 'VÄGKLAR', 96, 340, capHeight, 15, SURFACE, 0.17);

  // Three mastery bars in place of a tagline. The stroke alphabet above only
  // covers the wordmark, and bars read better than cramped text at the sizes
  // social previews are actually shown at.
  const barY = 420;
  const barWidths = [420, 340, 260];
  barWidths.forEach((barWidth, index) => {
    fillRoundedRect(canvas, 96, barY + index * 46, barWidth, 14, 7, [255, 255, 255, 26]);
    fillRoundedRect(canvas, 96, barY + index * 46, barWidth * 0.86, 14, 7, MINT);
  });

  fillRoundedRect(canvas, 96, 566, 300, 6, 3, [255, 255, 255, 20]);

  return canvas;
}

/* ------------------------------------------------------------------ */
/* Entry point                                                         */
/* ------------------------------------------------------------------ */

function write(name, canvas) {
  const target = resolve(OUT_DIR, name);
  writeFileSync(target, encodePng(canvas));
  console.log(`  ${name} — ${canvas.width}×${canvas.height}`);
}

mkdirSync(OUT_DIR, { recursive: true });
console.log('Genererar Vägklar-ikoner…');

write('icon-32.png', faviconIcon(32));
write('icon-192.png', appIcon(192));
write('icon-512.png', appIcon(512));
write('icon-512-maskable.png', appIcon(512, { maskable: true }));
write('apple-touch-icon.png', appleTouchIcon(180));
write('og-image.png', ogImage());

// Silence the unused-colour lint in editors without touching the palette.
void TEAL;
void PAPER;

console.log('Klart.');
