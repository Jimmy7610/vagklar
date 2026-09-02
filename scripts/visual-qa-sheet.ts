/**
 * Renders every road sign and road marking large, on one page, for eyeballing.
 *
 *   npm run report:visuals
 *
 * Writes review/visual-qa.html (gitignored — it is a working artefact, not a
 * deliverable). Open it and look.
 *
 * This exists because a sign that compiles is not a sign that is right. The
 * pass that introduced the sign set found six wrong drawings — a mirrored
 * arrow, a symbol clipped by its own frame, a border on the wrong side — and
 * found none of them at 64 px in a lesson grid. All six were obvious at 220 px
 * next to the official code and the written meaning.
 *
 * So the sheet deliberately shows three things side by side: the drawing, the
 * code, and the sentence the app tells the learner it means. A defect is
 * usually a disagreement between those three, not something wrong with the
 * picture on its own.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { SIGN_GLYPHS } from '../src/ui/illustrations/signGlyphs';
import { MARKING_GLYPHS } from '../src/ui/illustrations/markingGlyphs';
import { ROAD_SIGNS, SIGN_CATEGORY_LABELS } from '../src/content/road-signs';
import { MARKING_CATEGORY_LABELS, ROAD_MARKINGS } from '../src/content/road-markings';

const svg = (glyph: unknown, size: number) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 100 100" role="img">` +
  `${renderToStaticMarkup(glyph as never)}</svg>`;

const esc = (t: string) =>
  t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const signCards = ROAD_SIGNS.map((s) => {
  const glyph = SIGN_GLYPHS[s.id];
  return `<figure class="card${glyph ? '' : ' broken'}" id="${s.id}">
    <div class="art">${glyph ? svg(glyph, 220) : '<span class="missing">ingen ritning</span>'}</div>
    <figcaption>
      <div class="code">${esc(s.code)}</div>
      <div class="name">${esc(s.name)}</div>
      <div class="cat">${esc(SIGN_CATEGORY_LABELS[s.category] ?? s.category)} · <code>${esc(s.id)}</code></div>
      <p class="meaning">${esc(s.shortMeaning)}</p>
      <p class="alt"><b>Alt:</b> ${esc(s.altText)}</p>
      ${s.similarSignIds.length ? `<p class="alt"><b>Förväxlas med:</b> ${esc(s.similarSignIds.join(', '))}</p>` : ''}
    </figcaption>
  </figure>`;
}).join('\n');

const markingCards = ROAD_MARKINGS.map((m) => {
  const glyph = MARKING_GLYPHS[m.id];
  return `<figure class="card${glyph ? '' : ' broken'}" id="${m.id}">
    <div class="art">${glyph ? svg(glyph, 220) : '<span class="missing">ingen ritning</span>'}</div>
    <figcaption>
      <div class="code">${esc(m.code)}</div>
      <div class="name">${esc(m.name)}</div>
      <div class="cat">${esc(MARKING_CATEGORY_LABELS[m.category] ?? m.category)} · <code>${esc(m.id)}</code></div>
      <p class="meaning">${esc(m.meaning)}</p>
      <p class="alt"><b>För dig:</b> ${esc(m.forDriver)}</p>
      <p class="alt"><b>Alt:</b> ${esc(m.altText)}</p>
    </figcaption>
  </figure>`;
}).join('\n');

const html = `<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Vägklar — visuell granskning</title>
<style>
  :root { color-scheme: light dark; --bg:#fbfbfa; --fg:#16181d; --muted:#5d6470;
          --line:#e2e4e8; --card:#fff; }
  @media (prefers-color-scheme: dark) {
    :root { --bg:#0f1114; --fg:#e8eaed; --muted:#9aa2af; --line:#262a31; --card:#171a1f; }
  }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--bg); color:var(--fg);
         font:15px/1.5 -apple-system,"Segoe UI",Roboto,system-ui,sans-serif; }
  header { position:sticky; top:0; z-index:2; background:var(--bg);
           border-bottom:1px solid var(--line); padding:14px 24px; display:flex;
           gap:14px; align-items:center; flex-wrap:wrap; }
  h1 { font-size:15px; margin:0; font-weight:650; }
  h2 { font-size:13px; letter-spacing:.08em; text-transform:uppercase;
       color:var(--muted); margin:36px 0 14px; }
  main { max-width:1400px; margin:0 auto; padding:24px; }
  .grid { display:grid; gap:18px; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); }
  .card { margin:0; background:var(--card); border:1px solid var(--line);
          border-radius:14px; padding:18px; }
  .card.broken { border-color:#b3261e; }
  .art { display:flex; justify-content:center; align-items:center; min-height:236px;
         background:#f2f3f5; border-radius:10px; margin-bottom:14px; }
  @media (prefers-color-scheme: dark) { .art { background:#f2f3f5; } }
  .missing { color:#b3261e; font-weight:600; }
  .code { font:600 13px ui-monospace,SFMono-Regular,Menlo,monospace; color:var(--muted); }
  .name { font-weight:650; font-size:16px; margin:2px 0 4px; }
  .cat { font-size:12.5px; color:var(--muted); margin-bottom:8px; }
  .cat code { font-size:12px; }
  .meaning { margin:0 0 8px; }
  .alt { margin:0 0 6px; font-size:13px; color:var(--muted); }
  label { font-size:13px; color:var(--muted); display:flex; gap:6px; align-items:center; }
  body.light .art { background:#f2f3f5; }
  body.dark { --bg:#0f1114; --fg:#e8eaed; --muted:#9aa2af; --line:#262a31; --card:#171a1f; }
  body.dark .art { background:#1e2127; }
</style>
</head>
<body>
<header>
  <h1>Visuell granskning</h1>
  <span style="color:var(--muted);font-size:13px">
    ${ROAD_SIGNS.length} vägmärken · ${ROAD_MARKINGS.length} vägmarkeringar · ritade i 220 px
  </span>
  <label><input type="checkbox" id="dark"> Mörk kortyta</label>
  <label><input type="range" id="zoom" min="120" max="380" value="220"> Storlek</label>
</header>
<main>
  <h2>Vägmärken</h2>
  <div class="grid">${signCards}</div>
  <h2>Vägmarkeringar</h2>
  <div class="grid">${markingCards}</div>
</main>
<script>
  document.getElementById('dark').onchange = (e) => {
    document.body.classList.toggle('dark', e.target.checked);
  };
  document.getElementById('zoom').oninput = (e) => {
    const v = e.target.value;
    for (const s of document.querySelectorAll('.art svg')) {
      s.setAttribute('width', v); s.setAttribute('height', v);
    }
    for (const a of document.querySelectorAll('.art')) a.style.minHeight = (+v + 16) + 'px';
  };
</script>
</body>
</html>
`;

mkdirSync(resolve(process.cwd(), 'review'), { recursive: true });
writeFileSync(resolve(process.cwd(), 'review/visual-qa.html'), html, 'utf8');
console.log(
  `review/visual-qa.html skriven — ${ROAD_SIGNS.length} märken och ` +
    `${ROAD_MARKINGS.length} markeringar i 220 px.`,
);
