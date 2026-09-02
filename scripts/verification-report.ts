/**
 * Builds the verification queue.
 *
 *   npm run report:verification
 *
 * Writes two things:
 *
 *   docs/VERIFICATION-QUEUE.md   committed — what still needs a human, in order
 *   review/index.html            local only — the tool for doing it
 *
 * Vägklar's content is *reviewed*, not *verified*, and the difference matters.
 * Reviewed means it was written carefully and read again. Verified means a
 * named person checked the statement against a named source on a named date.
 * Nothing in this script sets that status — it only decides what a reviewer
 * should look at first, so the scarce thing (a person's attention) goes where
 * being wrong would cost the most.
 *
 * Priority is about consequence, not difficulty:
 *
 *   P1  a legal number, date, interval or limit. Wrong here and a learner
 *       walks into the real test — or the road — with a false fact.
 *   P2  exceptions and priority rules. Wrong here and the learner has the
 *       right fact but applies it in the wrong situation.
 *   P3  explanatory knowledge. Wrong here and the reasoning is weaker, but
 *       nothing false is learned as fact.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ALL_QUESTIONS } from '../src/content/questions';
import { SOURCE_BY_ID } from '../src/content/sources';
import { CURRICULUM_CHAPTERS, CURRICULUM_CONCEPTS } from '../src/content/curriculum/curriculum';
import { MISCONCEPTION_BY_ID } from '../src/content/misconceptions';
import { contentFingerprint } from '../src/domain/content/fingerprint';
import { existsSync, readFileSync } from 'node:fs';
import { getSubcategoryName } from '../src/content/taxonomy';
import type { Question } from '../src/domain/content/types';
import {
  OTHER_BATCH,
  TAG_MEANING,
  batchOfSubcategory,
  priorityOf,
  textOf,
} from '../src/domain/content/verificationPriority';
import type { P1Tag, Priority } from '../src/domain/content/verificationPriority';

const chapterOfSubcategory = new Map<string, string>();
for (const chapter of CURRICULUM_CHAPTERS) {
  for (const sub of chapter.subcategories) {
    if (!chapterOfSubcategory.has(sub)) chapterOfSubcategory.set(sub, chapter.title);
  }
}
for (const concept of CURRICULUM_CONCEPTS) {
  if (concept.subcategory && !chapterOfSubcategory.has(concept.subcategory)) {
    const chapter = CURRICULUM_CHAPTERS.find((c) => c.id === concept.chapterId);
    if (chapter) chapterOfSubcategory.set(concept.subcategory, chapter.title);
  }
}

interface Row {
  q: Question;
  priority: Priority;
  because: string;
  tags: P1Tag[];
  batchId: string;
  batchTitle: string;
  chapter: string;
  sources: string;
  needsVerification: boolean;
}

const rows: Row[] = ALL_QUESTIONS.map((q) => {
  const { priority, because, tags } = priorityOf(q);
  const batch = batchOfSubcategory.get(q.subcategory) ?? OTHER_BATCH;
  return {
    q,
    priority,
    because,
    tags,
    batchId: batch.id,
    batchTitle: batch.title,
    chapter: chapterOfSubcategory.get(q.subcategory) ?? 'Utanför kursplanens kapitel',
    sources: q.sourceReferences
      .map((r) => {
        const name = r.sourceId ? (SOURCE_BY_ID.get(r.sourceId)?.title ?? r.sourceId) : r.name;
        const where = r.reference ? ` ${r.reference}` : '';
        const pages = r.sourcePages?.length ? ` s. ${r.sourcePages.join(', ')}` : '';
        return `${name}${where}${pages}`;
      })
      .join(' · '),
    needsVerification: q.status !== 'verified' && q.status !== 'retired' && q.status !== 'rejected',
  };
});

const byStatus = new Map<string, number>();
for (const q of ALL_QUESTIONS) byStatus.set(q.status, (byStatus.get(q.status) ?? 0) + 1);

const queue = rows.filter((r) => r.needsVerification);
const count = (p: Priority) => queue.filter((r) => r.priority === p).length;

/* ------------------------------------------------------------------ */
/* Markdown queue                                                      */
/* ------------------------------------------------------------------ */

const md: string[] = [];
md.push('# Verifieringskö');
md.push('');
md.push('GENERERAD — kör `npm run report:verification`. Redigera inte för hand.');
md.push('');
md.push('Vägklars innehåll är **granskat**, inte **verifierat**. Skillnaden är avsiktlig:');
md.push('granskat betyder skrivet med omsorg och läst igen, verifierat betyder att en');
md.push('namngiven person kontrollerat påståendet mot en namngiven källa ett namngivet');
md.push('datum. Den här kön säger vad som bör kontrolleras först, inte vad som är fel.');
md.push('');
md.push('Så här går verifieringen till: [VERIFICATION-WORKFLOW.md](VERIFICATION-WORKFLOW.md).');
md.push('');
md.push('## Status i banken');
md.push('');
md.push('| Status | Antal | Betyder |');
md.push('| --- | ---: | --- |');
const meaning: Record<string, string> = {
  draft: 'Skriven, ännu inte läst av någon annan.',
  reviewed: 'Läst och godkänd internt. Inget påstående om expertgranskning.',
  verified: 'Kontrollerad mot namngiven källa av namngiven person.',
  rejected: 'Underkänd i granskning. Visas aldrig.',
  retired: 'Har varit publicerad, återkallad. Visas aldrig.',
};
for (const status of ['draft', 'reviewed', 'verified', 'rejected', 'retired']) {
  const n = byStatus.get(status) ?? 0;
  if (n === 0 && status !== 'verified') continue;
  md.push(`| \`${status}\` | ${n} | ${meaning[status]} |`);
}
md.push('');
md.push('## Kön');
md.push('');
md.push('| Prioritet | Antal | Vad som står på spel |');
md.push('| --- | ---: | --- |');
md.push(`| P1 | ${count('P1')} | Rättsliga tal, gränsvärden, intervall och volatila regelområden. |`);
md.push(`| P2 | ${count('P2')} | Undantag, villkorade regler och beräkningar. |`);
md.push(`| P3 | ${count('P3')} | Förklarande kunskap utan rättsligt tal. |`);
md.push(`| **Totalt** | **${queue.length}** | |`);
md.push('');

md.push('## P1 efter typ');
md.push('');
md.push('En fråga kan bära flera. De tre första avgör att den hamnar i P1; resten säger');
md.push('vad slags kontroll den kräver.');
md.push('');
md.push('| Typ | Antal | Betyder |');
md.push('| --- | ---: | --- |');
for (const tag of ['P1-NUMERIC', 'P1-VOLATILE', 'P1-ADMIN', 'P1-LAW', 'P1-SAFETY', 'P1-EXCEPTION'] as const) {
  const n = queue.filter((r) => r.tags.includes(tag)).length;
  md.push(`| \`${tag}\` | ${n} | ${TAG_MEANING[tag]} |`);
}
md.push('');

const p1 = queue.filter((r) => r.priority === 'P1');

md.push('## Var arbetet ligger');
md.push('');
md.push('| Kapitel | P1 |');
md.push('| --- | ---: |');
const burden = [...new Set(p1.map((r) => r.chapter))]
  .map((c) => ({ c, n: p1.filter((r) => r.chapter === c).length }))
  .sort((a, b) => b.n - a.n || a.c.localeCompare(b.c, 'sv'));
for (const b of burden.slice(0, 12)) md.push(`| ${b.c} | ${b.n} |`);
md.push('');

md.push('| Grupp som kräver extra omsorg | Antal |');
md.push('| --- | ---: |');
md.push(`| Bär tre eller fler P1-typer | ${p1.filter((r) => r.tags.length >= 3).length} |`);
md.push(`| Rättsligt tal med undantag | ${p1.filter((r) => r.tags.includes('P1-EXCEPTION')).length} |`);
md.push(`| Bildburna P1 (foto eller ritning) | ${p1.filter((r) => r.q.sourceImageId || r.q.originalVisualId).length} |`);
md.push(`| Beräkningar i P1 | ${p1.filter((r) => r.q.questionType === 'calculation').length} |`);
md.push(`| Utan hänvisning till författning | ${p1.filter((r) => !r.tags.includes('P1-LAW')).length} |`);
md.push('');

/* ---- Stale verifications ---------------------------------------------
   Nothing is verified yet, so this is normally empty. It is here so that the
   day something is signed off, an edit to it shows up as work to redo rather
   than sitting silently as a stale claim. */
const stale = rows.filter(
  (r) => r.q.status === 'verified' && r.q.verifiedFingerprint !== contentFingerprint(r.q),
);
md.push('## Verifieringar som gått ur takt');
md.push('');
if (stale.length === 0) {
  md.push('Inga. En verifiering blir ogiltig när frågans text, svar, regel, förklaring');
  md.push('eller källhänvisning ändras efter signeringen — validatorn fångar det.');
} else {
  md.push('| Fråga | Signerad av | Datum |');
  md.push('| --- | --- | --- |');
  for (const r of stale) md.push(`| \`${r.q.id}\` | ${r.q.verifiedBy ?? '—'} | ${r.q.verifiedAt ?? '—'} |`);
}
md.push('');

/* ---- P1, batch by batch ---------------------------------------------- */
md.push('## P1 i granskningsomgångar');
md.push('');
md.push('En omgång är ett arbetspass: samma ämne, samma källor uppslagna. Ordningen');
md.push('inom en omgång är godtycklig; ordningen mellan dem är det inte — de tidiga');
md.push('rör tal som står i författning och går att slå upp direkt.');
md.push('');
md.push('| Omgång | Antal |');
md.push('| --- | ---: |');
const batchIds = [...new Set(p1.map((r) => r.batchId))].sort();
for (const id of batchIds) {
  const group = p1.filter((r) => r.batchId === id);
  md.push(`| ${id} — ${group[0]!.batchTitle} | ${group.length} |`);
}
md.push('');

for (const id of batchIds) {
  const group = p1.filter((r) => r.batchId === id);
  md.push(`### Omgång ${id} — ${group[0]!.batchTitle} · ${group.length} frågor`);
  md.push('');
  for (const r of group) {
    const correct = r.q.answers.find((a) => a.id === r.q.correctAnswerId);
    const misconceptions = r.q.misconceptions
      .map((m) => MISCONCEPTION_BY_ID.get(m)?.label ?? m)
      .join('; ');
    md.push(`#### \`${r.q.id}\` · ${r.q.ruleTested}`);
    md.push('');
    md.push(`${r.q.prompt}`);
    md.push('');
    md.push(`**Rätt svar:** ${correct?.text ?? '—'}`);
    md.push('');
    md.push(`**Förklaring:** ${r.q.shortExplanation}`);
    md.push('');
    md.push('| | |');
    md.push('| --- | --- |');
    md.push(`| Typ | ${r.tags.join(', ') || '—'} |`);
    md.push(`| Varför i kön | ${r.because} |`);
    md.push(`| Kapitel · delområde | ${r.chapter} · ${getSubcategoryName(r.q.subcategory)} |`);
    md.push(`| Källa och exakt hänvisning | ${r.sources || '—'} |`);
    md.push(`| Status | \`${r.q.status}\` |`);
    md.push(`| Missuppfattning | ${misconceptions || '—'} |`);
    md.push(`| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint \`${contentFingerprint(r.q)}\` |`);
    md.push('');
  }
}

/* ---- P2 and P3 stay compact ------------------------------------------ */
for (const priority of ['P2', 'P3'] as const) {
  const group = queue.filter((r) => r.priority === priority);
  md.push(`## ${priority} — ${group.length} frågor`);
  md.push('');
  if (group.length === 0) {
    md.push('Inga.');
    md.push('');
    continue;
  }
  md.push('| Fråga | Delområde | Regel |');
  md.push('| --- | --- | --- |');
  for (const r of group) {
    md.push(`| \`${r.q.id}\` | ${getSubcategoryName(r.q.subcategory)} | ${r.q.ruleTested} |`);
  }
  md.push('');
}

writeFileSync(resolve(process.cwd(), 'docs/VERIFICATION-QUEUE.md'), md.join('\n'), 'utf8');

/* ------------------------------------------------------------------ */
/* Local reviewer                                                      */
/* ------------------------------------------------------------------ */

/**
 * Short orientation for a cited page.
 *
 * The page-text cache holds a sorted bag of words per page, never sentences, so
 * nothing here can reproduce the book. What it can do is tell a reviewer
 * whether the page they are about to open is plausibly about the rule at hand:
 * the words shown are the ones the page and the question have in common.
 *
 * The cache is derived from the licensed source and is gitignored, so this is
 * empty for anyone who has not built it locally. That is fine — it degrades to
 * showing nothing.
 */
const cachePath = resolve(process.cwd(), 'references/.page-text.json');
const pageWords: Record<string, string[]> = existsSync(cachePath)
  ? (JSON.parse(readFileSync(cachePath, 'utf8')).pages ?? {})
  : {};

function citationContext(q: Question): { page: number; shared: string[] }[] {
  const words = new Set(
    textOf(q)
      .toLocaleLowerCase('sv')
      .split(/[^a-zà-ÿåäö0-9]+/)
      .filter((w) => w.length > 4),
  );
  const out: { page: number; shared: string[] }[] = [];
  for (const ref of q.sourceReferences) {
    for (const page of ref.sourcePages ?? []) {
      const onPage = pageWords[String(page)];
      if (!onPage) continue;
      const shared = onPage.filter((w) => words.has(w)).slice(0, 12);
      out.push({ page, shared });
    }
  }
  return out;
}

const payload = rows.map((r) => ({
  id: r.q.id,
  p: r.priority,
  tags: r.tags,
  batch: r.batchId + ' — ' + r.batchTitle,
  fingerprint: contentFingerprint(r.q),
  context: citationContext(r.q),
  because: r.because,
  chapter: r.chapter,
  sub: getSubcategoryName(r.q.subcategory),
  subId: r.q.subcategory,
  rule: r.q.ruleTested,
  status: r.q.status,
  difficulty: r.q.difficulty,
  type: r.q.questionType,
  prompt: r.q.prompt,
  answers: r.q.answers.map((a) => ({ t: a.text, ok: a.id === r.q.correctAnswerId })),
  short: r.q.shortExplanation,
  deep: r.q.deepExplanation ?? '',
  memory: r.q.memoryRule ?? '',
  misconceptions: r.q.misconceptions,
  sources: r.sources,
  notes: r.q.reviewNotes ?? '',
}));

const esc = (v: unknown) => JSON.stringify(v).replace(/</g, '\\u003c');

const html = `<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Vägklar — granskningsverktyg</title>
<style>
  :root { color-scheme: light dark; --bg:#fbfbfa; --fg:#16181d; --muted:#5d6470;
          --line:#e2e4e8; --card:#fff; --ok:#0f7b52; --p1:#b3261e; --p2:#8a5a00; --p3:#4a5262; }
  @media (prefers-color-scheme: dark) {
    :root { --bg:#0f1114; --fg:#e8eaed; --muted:#9aa2af; --line:#262a31; --card:#171a1f;
            --ok:#4ec08a; --p1:#ff8a80; --p2:#e0b25c; --p3:#9aa2af; }
  }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--bg); color:var(--fg); font:15px/1.55 -apple-system,
         "Segoe UI", Roboto, system-ui, sans-serif; }
  header { position:sticky; top:0; background:var(--bg); border-bottom:1px solid var(--line);
           padding:12px 20px; display:flex; gap:12px; align-items:center; flex-wrap:wrap; z-index:2; }
  h1 { font-size:15px; margin:0 12px 0 0; font-weight:650; }
  select, input, button { font:inherit; padding:6px 10px; border:1px solid var(--line);
           border-radius:7px; background:var(--card); color:var(--fg); }
  button { cursor:pointer; }
  main { max-width:860px; margin:0 auto; padding:24px 20px 80px; }
  .card { background:var(--card); border:1px solid var(--line); border-radius:12px;
          padding:20px 22px; margin-bottom:18px; }
  .meta { display:flex; gap:10px; flex-wrap:wrap; align-items:center;
          font-size:12.5px; color:var(--muted); margin-bottom:12px; }
  .tag { border:1px solid var(--line); border-radius:999px; padding:2px 9px; }
  .P1 { color:var(--p1); border-color:currentColor; font-weight:650; }
  .P2 { color:var(--p2); border-color:currentColor; }
  .P3 { color:var(--p3); }
  .prompt { font-size:17px; font-weight:600; margin:0 0 14px; }
  ul.answers { list-style:none; padding:0; margin:0 0 14px; }
  ul.answers li { padding:7px 12px; border:1px solid var(--line); border-radius:8px;
                  margin-bottom:6px; }
  ul.answers li.ok { border-color:var(--ok); color:var(--ok); font-weight:600; }
  .label { font-size:11px; letter-spacing:.07em; text-transform:uppercase;
           color:var(--muted); margin:14px 0 4px; }
  .src { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size:12.5px;
         color:var(--muted); word-break:break-word; }
  .count { color:var(--muted); font-size:13px; }
  .empty { color:var(--muted); padding:40px 0; text-align:center; }
</style>
</head>
<body>
<header>
  <h1>Vägklar — granskning</h1>
  <select id="prio">
    <option value="">Alla prioriteringar</option>
    <option value="P1">P1 — rättsliga tal</option>
    <option value="P2">P2 — undantag och beräkning</option>
    <option value="P3">P3 — förklarande</option>
  </select>
  <select id="tag"><option value="">Alla P1-typer</option></select>
  <select id="batch"><option value="">Alla omgångar</option></select>
  <select id="chapter"><option value="">Alla kapitel</option></select>
  <select id="status"><option value="">Alla statusar</option></select>
  <input id="q" type="search" placeholder="Sök id, regel eller text" size="24">
  <button id="prev">← Föregående</button>
  <button id="next">Nästa →</button>
  <span class="count" id="count"></span>
  <button id="export">Exportera anteckningar</button>
</header>
<main id="out"></main>
<script>
const DATA = ${esc(payload)};
const $ = (id) => document.getElementById(id);
for (const c of [...new Set(DATA.map(d => d.chapter))].sort()) {
  $('chapter').append(new Option(c, c));
}
for (const t of [...new Set(DATA.flatMap(d => d.tags))].sort()) {
  $('tag').append(new Option(t, t));
}
for (const b of [...new Set(DATA.map(d => d.batch))].sort()) {
  $('batch').append(new Option(b, b));
}
for (const s of [...new Set(DATA.map(d => d.status))].sort()) {
  $('status').append(new Option(s, s));
}
let index = 0;
function filtered() {
  const p = $('prio').value, c = $('chapter').value, s = $('status').value;
  const t = $('tag').value, b = $('batch').value;
  const term = $('q').value.trim().toLowerCase();
  return DATA.filter(d =>
    (!p || d.p === p) && (!c || d.chapter === c) && (!s || d.status === s) &&
    (!t || d.tags.includes(t)) && (!b || d.batch === b) &&
    (!term || (d.id + ' ' + d.rule + ' ' + d.prompt + ' ' + d.short).toLowerCase().includes(term)));
}

/* Reviewer notes live in this browser only. They are working notes, not the
   record: a question becomes verified when a person edits the content files
   and signs it there. Export writes them out so that edit can be made. */
const NOTES_KEY = 'vagklar-granskning';
let notes = {};
try { notes = JSON.parse(localStorage.getItem(NOTES_KEY) || '{}'); } catch { notes = {}; }
function saveNote(id, value) {
  if (value.trim()) notes[id] = value; else delete notes[id];
  try { localStorage.setItem(NOTES_KEY, JSON.stringify(notes)); } catch {}
  renderNoteCount();
}
function renderNoteCount() {
  const n = Object.keys(notes).length;
  $('export').textContent = n ? 'Exportera ' + n + ' anteckningar' : 'Exportera anteckningar';
}
function esc(t) { const n = document.createElement('div'); n.textContent = t; return n.innerHTML; }
function render() {
  const list = filtered();
  if (index >= list.length) index = Math.max(0, list.length - 1);
  $('count').textContent = list.length ? (index + 1) + ' av ' + list.length : '0 träffar';
  if (!list.length) { $('out').innerHTML = '<p class="empty">Inget matchar filtret.</p>'; return; }
  const d = list[index];
  $('out').innerHTML =
    '<div class="card">' +
      '<div class="meta">' +
        '<span class="tag ' + d.p + '">' + d.p + '</span>' +
        '<span class="tag">' + esc(d.status) + '</span>' +
        '<span class="tag">svårighet ' + d.difficulty + '</span>' +
        '<span class="tag">' + esc(d.type) + '</span>' +
        '<span>' + esc(d.chapter) + ' · ' + esc(d.sub) + '</span>' +
        '<button onclick="navigator.clipboard.writeText(' + JSON.stringify(d.id) + ')">' +
          esc(d.id) + ' ⧉</button>' +
      '</div>' +
      '<p class="prompt">' + esc(d.prompt) + '</p>' +
      '<ul class="answers">' + d.answers.map(a =>
        '<li class="' + (a.ok ? 'ok' : '') + '">' + esc(a.t) + '</li>').join('') + '</ul>' +
      '<div class="label">Regel</div><div>' + esc(d.rule) + '</div>' +
      '<div class="label">Förklaring</div><div>' + esc(d.short) + '</div>' +
      (d.deep ? '<div class="label">Fördjupning</div><div>' + esc(d.deep) + '</div>' : '') +
      (d.memory ? '<div class="label">Minnesregel</div><div>' + esc(d.memory) + '</div>' : '') +
      '<div class="label">Källor</div><div class="src">' + esc(d.sources) + '</div>' +
      (d.misconceptions.length
        ? '<div class="label">Missuppfattningar</div><div class="src">' +
          esc(d.misconceptions.join(', ')) + '</div>' : '') +
      '<div class="label">Varför i kön</div><div>' + esc(d.because) + '</div>' +
      (d.context.length
        ? '<div class="label">Ord som sidan och frågan delar</div>' +
          d.context.map(c =>
            '<div class="src">s. ' + c.page + ': ' +
            (c.shared.length ? esc(c.shared.join(', ')) : '<em>inga gemensamma ord</em>') +
            '</div>').join('') +
          '<div class="src" style="margin-top:4px">Bara en orientering — slå upp sidan innan du signerar.</div>'
        : '') +
      (d.notes ? '<div class="label">Notering i innehållsfilen</div><div>' + esc(d.notes) + '</div>' : '') +
      '<div class="label">Att fylla i vid signering</div>' +
      '<div class="src">verifiedFingerprint: ' + esc(d.fingerprint) +
        ' <button onclick="navigator.clipboard.writeText(' + JSON.stringify(d.fingerprint) + ')">⧉</button>' +
        ' · <button onclick="navigator.clipboard.writeText(' + JSON.stringify(d.sources) + ')">kopiera källhänvisning ⧉</button>' +
      '</div>' +
      '<div class="label">Granskarens anteckning (lokal)</div>' +
      '<textarea id="note" rows="3" style="width:100%">' + esc(notes[d.id] || '') + '</textarea>' +
      '<div class="src">Sparas bara i den här webbläsaren. Verifiering sker genom att ' +
        'redigera innehållsfilen och signera där.</div>' +
    '</div>';
  const note = document.getElementById('note');
  if (note) note.oninput = () => saveNote(d.id, note.value);
}
$('next').onclick = () => { index++; render(); };
$('prev').onclick = () => { index = Math.max(0, index - 1); render(); };
for (const id of ['prio', 'chapter', 'status', 'q', 'tag', 'batch']) {
  $(id).oninput = () => { index = 0; render(); };
}
$('export').onclick = () => {
  const lines = Object.entries(notes).map(([id, text]) => '## ' + id + '\n' + text);
  const blob = new Blob([lines.join('\n\n') || 'Inga anteckningar.'], { type: 'text/markdown' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'granskningsanteckningar.md';
  a.click();
};
renderNoteCount();
addEventListener('keydown', (e) => {
  if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
  if (e.key === 'ArrowRight' || e.key === 'j') $('next').click();
  if (e.key === 'ArrowLeft' || e.key === 'k') $('prev').click();
});
render();
</script>
</body>
</html>
`;

mkdirSync(resolve(process.cwd(), 'review'), { recursive: true });
writeFileSync(resolve(process.cwd(), 'review/index.html'), html, 'utf8');

console.log(
  `docs/VERIFICATION-QUEUE.md skriven — ${queue.length} frågor i kö ` +
    `(P1 ${count('P1')}, P2 ${count('P2')}, P3 ${count('P3')}).`,
);
console.log('review/index.html skriven — öppna den lokalt för att granska.');
