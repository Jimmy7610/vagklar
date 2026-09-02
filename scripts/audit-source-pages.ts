/**
 * Audits every page citation in the question bank against the real source.
 *
 *   python scripts/extract-source-pages.py   # once, builds the local cache
 *   npm run audit:pages
 *
 * A page number that merely falls inside 1–367 proves nothing. This checks that
 * the cited page actually *talks about* what the question tests, by comparing
 * the question's own vocabulary against the words on that page.
 *
 * The cache it reads is built from the licensed PDF and is gitignored, so this
 * audit only runs on a machine that holds the source. Without the cache it
 * exits cleanly and says so rather than pretending everything checked out —
 * an audit that silently passes when it cannot run is worse than no audit.
 *
 * Findings are advisory, not gospel. Swedish compounds mean a page can support
 * a rule while sharing few words with the question, so a flagged citation is a
 * prompt to look, not proof of an error. The report says which is which.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ALL_QUESTIONS } from '../src/content/questions';
import { SOURCE_IMAGES } from '../src/content/source-images';
import { PRIMARY_SOURCE_ID, SOURCES } from '../src/content/sources';
import { CURRICULUM_CHAPTERS, CURRICULUM_CONCEPTS } from '../src/content/curriculum/curriculum';

const root = process.cwd();
const cachePath = resolve(root, 'references/.page-text.json');

interface Cache {
  pageCount: number;
  pages: Record<string, string[]>;
}

if (!existsSync(cachePath)) {
  console.log('Sidcachen saknas. Kör:');
  console.log('  python scripts/extract-source-pages.py');
  console.log('Granskningen kräver det licensierade källdokumentet lokalt och hoppas över.');
  process.exit(0);
}

const cache = JSON.parse(readFileSync(cachePath, 'utf8')) as Cache;
const book = SOURCES.find((s) => s.id === PRIMARY_SOURCE_ID);
const pageCount = book?.pageCount ?? cache.pageCount;

/** Words too common in a driving-theory book to prove a page is on topic. */
const STOPWORDS = new Set([
  'och', 'att', 'som', 'för', 'med', 'den', 'det', 'ett', 'inte', 'kan', 'ska', 'har', 'man',
  'är', 'på', 'till', 'från', 'vid', 'när', 'där', 'blir', 'bli', 'får', 'ger', 'gör', 'går',
  'vara', 'varit', 'vilket', 'vilken', 'eller', 'andra', 'annan', 'sedan', 'mer', 'mest',
  'bara', 'även', 'också', 'utan', 'över', 'under', 'efter', 'före', 'genom', 'mellan',
  'trafik', 'trafiken', 'fordon', 'fordonet', 'bilen', 'bil', 'väg', 'vägen', 'körning',
  'kör', 'köra', 'förare', 'föraren', 'därför', 'eftersom', 'exempel', 'alltid', 'aldrig',
  'måste', 'behöver', 'betyder', 'innebär', 'gäller', 'regler', 'regel', 'situationen',
]);

/** Content words of a text, long enough to carry meaning on their own. */
function terms(text: string): string[] {
  return (text.toLowerCase().match(/[a-zåäöéèü]{5,}/g) ?? []).filter((w) => !STOPWORDS.has(w));
}

/**
 * Swedish builds compounds freely — a page may say "vattenplaningen" or
 * "halkrisk" where the question says "vattenplaning" or "halka". Matching on a
 * shared prefix catches those without matching everything.
 */
function pageSupports(pageWords: Set<string>, wanted: string[]): string[] {
  const hits: string[] = [];
  for (const term of wanted) {
    const stem = term.slice(0, Math.max(5, Math.min(7, term.length - 1)));
    for (const word of pageWords) {
      if (word.startsWith(stem) || (word.length > stem.length + 2 && word.includes(stem))) {
        hits.push(term);
        break;
      }
    }
  }
  return hits;
}

/**
 * What kind of page a citation landed on.
 *
 * The book is not 367 pages of prose. It has chapter dividers, "Testa dina
 * kunskaper" self-tests with their answer pages, and a reference appendix of
 * sign and marking plates where the only text is the label under each picture.
 * Judging all four by the same rule either passes citations that support
 * nothing, or floods the report with false positives from the appendix.
 */
type PageKind = 'content' | 'divider' | 'selftest' | 'plate';

function classifyPage(words: string[]): PageKind {
  const set = new Set(words);
  if (words.length <= 6 && set.has('teoribok')) return 'divider';
  if (
    words.length < 60 &&
    (set.has('testa') || set.has('kunskaper') || (set.has('svar') && set.has('förklaring')))
  ) {
    return 'selftest';
  }
  // A plate is a picture with a caption: too few words to be prose, but the
  // words that are there are the domain nouns the plate is illustrating.
  if (words.length < 45) return 'plate';
  return 'content';
}

const SIGN_QUESTION_TYPES = new Set(['road-sign', 'image-scenario']);

/**
 * Citations checked by hand and found correct, despite sharing no vocabulary
 * with the page.
 *
 * The check compares words, so it cannot see that Vägklar and the book name the
 * same idea differently. Rather than bend the question's wording to satisfy a
 * tool, or quietly relax the rule until nothing is flagged, each exception is
 * listed here with what was found on the page. Anyone can re-check it against
 * the source in a minute, and the report prints them rather than hiding them.
 */
const ACCEPTED: Record<string, string> = {
  'grd-009:6': 'Sidan beskriver aktsamhetsplikten i bokens egna ord — hänsyn, omsorg, ' +
    'varsamhet, "hindra eller störa i onödan" — men använder aldrig ordet aktsamhetsplikt.',
  'mns-037:134': 'Sidan är bokens avsnitt om sannolikhetsinlärning och bygger resonemanget ' +
    'på erfarenhet vid järnvägskorsning. Vägklar formulerar samma sak som tillbud och utfall.',
};

const chapterBySubcategory = new Map<string, Set<string>>();
for (const concept of CURRICULUM_CONCEPTS) {
  if (concept.subcategory === null) continue;
  const bucket = chapterBySubcategory.get(concept.subcategory);
  if (bucket) bucket.add(concept.chapterId);
  else chapterBySubcategory.set(concept.subcategory, new Set([concept.chapterId]));
}
const chapterById = new Map(CURRICULUM_CHAPTERS.map((c) => [c.id, c]));

type Severity = 'error' | 'warning';
interface Finding {
  severity: Severity;
  questionId: string;
  page: number;
  code: string;
  message: string;
}

const findings: Finding[] = [];
let citationsChecked = 0;
let questionsWithCitations = 0;
let supported = 0;

for (const q of ALL_QUESTIONS) {
  const refs = q.sourceReferences.filter(
    (r) => r.sourceId === PRIMARY_SOURCE_ID && r.sourcePages?.length,
  );
  if (refs.length === 0) continue;
  questionsWithCitations += 1;

  const wanted = [
    ...terms(q.ruleTested),
    ...terms(q.prompt),
    ...terms(q.shortExplanation),
  ];
  const unique = [...new Set(wanted)];
  const ruleTerms = new Set(terms(q.ruleTested));

  const allowedChapters = chapterBySubcategory.get(q.subcategory) ?? new Set<string>();
  const allowedRanges = [...allowedChapters]
    .map((id) => chapterById.get(id))
    .filter((c): c is NonNullable<typeof c> => c !== undefined)
    .map((c) => [c.startPage, c.endPage] as const);

  for (const ref of refs) {
    for (const page of ref.sourcePages ?? []) {
      citationsChecked += 1;

      if (!Number.isInteger(page) || page < 1 || page > pageCount) {
        findings.push({
          severity: 'error',
          questionId: q.id,
          page,
          code: 'page-out-of-range',
          message: `Sidan finns inte i källan (1–${pageCount}).`,
        });
        continue;
      }

      const words = cache.pages[String(page)];
      if (!words || words.length === 0) {
        findings.push({
          severity: 'error',
          questionId: q.id,
          page,
          code: 'page-without-text',
          message: 'Sidan innehåller ingen extraherbar text — sannolikt en helsidesbild.',
        });
        continue;
      }

      const kind = classifyPage(words);
      if (kind === 'divider') {
        findings.push({
          severity: 'error',
          questionId: q.id,
          page,
          code: 'page-is-divider',
          message: 'Sidan är en kapitelavdelare och stödjer ingen regel.',
        });
        continue;
      }
      if (kind === 'selftest') {
        findings.push({
          severity: 'error',
          questionId: q.id,
          page,
          code: 'page-is-selftest',
          message: 'Sidan är ett självtest eller dess facit, inte källtext för regeln.',
        });
        continue;
      }

      const set = new Set(words);
      const hits = pageSupports(set, unique);
      const ruleHits = hits.filter((h) => ruleTerms.has(h));

      // A plate carries labels, not sentences. For a sign or marking question
      // that is exactly the right citation — it is where the sign is shown and
      // named — so one label hit is enough. For a prose rule it is not.
      if (kind === 'plate') {
        // The plate names what it shows. If the rule under test is one of those
        // names, this is the right citation — that is where the sign, marking
        // or tilläggstavla is officially depicted and named. Generic overlap is
        // not enough: it is how a citation lands one plate off its target.
        if (ruleHits.length > 0) {
          supported += 1;
          continue;
        }
        const isVisual = SIGN_QUESTION_TYPES.has(q.questionType) || q.image !== undefined;
        findings.push({
          severity: hits.length === 0 ? 'error' : 'warning',
          questionId: q.id,
          page,
          code: 'page-is-plate',
          message: `Bildplansch som inte namnger "${q.ruleTested}"${
            isVisual ? '' : ' (och frågan är inte bildburen)'
          }.`,
        });
        continue;
      }

      if (hits.length === 0) {
        findings.push({
          severity: 'error',
          questionId: q.id,
          page,
          code: 'page-off-topic',
          message: `Inget av frågans ${unique.length} nyckelord finns på sidan.`,
        });
        continue;
      }

      if (ruleHits.length === 0 && hits.length < 3) {
        findings.push({
          severity: 'warning',
          questionId: q.id,
          page,
          code: 'page-weak-support',
          message: `Svag överlappning (${hits.join(', ')}) och inget ord ur "${q.ruleTested}".`,
        });
        continue;
      }

      // Outside every chapter the syllabus maps this subcategory to. Not an
      // error on its own — a rule can be mentioned in more than one chapter —
      // but it is the shape a copy-pasted page number takes.
      if (
        allowedRanges.length > 0 &&
        !allowedRanges.some(([from, to]) => page >= from - 2 && page <= to + 2)
      ) {
        findings.push({
          severity: 'warning',
          questionId: q.id,
          page,
          code: 'page-outside-chapter',
          message: `Sidan ligger utanför kapitlen för "${q.subcategory}" (${allowedRanges
            .map(([f, t]) => `${f}–${t}`)
            .join(', ')}).`,
        });
        continue;
      }

      supported += 1;
    }
  }
}

/**
 * The same check, applied to where each picture came from.
 *
 * A photograph or a drawing cites a page just as a question does, and the page
 * number is just as easy to mistype. Keyword overlap means little here — a
 * figure page carries labels, not prose — so what is checked instead is that
 * the page exists, is not a divider or a self-test, and falls inside the
 * chapter the picture is filed under. That is the shape a wrong number takes.
 */
const imageFindings: Finding[] = [];
let imagePagesChecked = 0;
let imagePagesSupported = 0;

for (const image of SOURCE_IMAGES) {
  if (image.status !== 'approved' || image.sourceId !== PRIMARY_SOURCE_ID) continue;
  const page = image.sourcePage;
  imagePagesChecked += 1;

  if (!Number.isInteger(page) || page < 1 || page > pageCount) {
    imageFindings.push({
      severity: 'error',
      questionId: image.id,
      page,
      code: 'page-out-of-range',
      message: `Sidan finns inte i källan (1–${pageCount}).`,
    });
    continue;
  }

  // Deliberately no divider or self-test check here. Those pages cannot
  // support a *rule*, which is why a question citing one is an error — but in
  // this book a chapter divider is a full-page traffic photograph and the
  // self-tests are illustrated. As the origin of a *picture* they are exactly
  // right, and flagging them would be the audit misreading its own evidence.
  const chapter = chapterById.get(image.chapter);
  if (chapter && (page < chapter.startPage - 2 || page > chapter.endPage + 2)) {
    imageFindings.push({
      severity: 'warning',
      questionId: image.id,
      page,
      code: 'page-outside-chapter',
      message: `Sidan ligger utanför kapitlet "${image.chapter}" (${chapter.startPage}–${chapter.endPage}).`,
    });
    continue;
  }

  imagePagesSupported += 1;
}

const imageErrors = imageFindings.filter((f) => f.severity === 'error');
const imageWarnings = imageFindings.filter((f) => f.severity === 'warning');

const accepted = findings.filter((f) => ACCEPTED[`${f.questionId}:${f.page}`] !== undefined);
const open = findings.filter((f) => ACCEPTED[`${f.questionId}:${f.page}`] === undefined);
const errors = open.filter((f) => f.severity === 'error');
const warnings = open.filter((f) => f.severity === 'warning');

const staleExceptions = Object.keys(ACCEPTED).filter(
  (key) => !findings.some((f) => `${f.questionId}:${f.page}` === key),
);

const lines: string[] = [];
lines.push('# Sidgranskning av källhänvisningar');
lines.push('');
lines.push('GENERERAD — kör `npm run audit:pages`. Kräver det licensierade källdokumentet lokalt.');
lines.push('');
lines.push('Granskningen jämför varje sidhänvisning mot den faktiska texten på sidan. En sida');
lines.push('som bara ligger inom 1–' + pageCount + ' bevisar ingenting; det som kontrolleras är om');
lines.push('sidan verkligen handlar om det frågan prövar.');
lines.push('');
lines.push('| | Antal |');
lines.push('| --- | ---: |');
lines.push(`| Frågor med sidhänvisning | ${questionsWithCitations} |`);
lines.push(`| Sidhänvisningar granskade | ${citationsChecked} |`);
lines.push(`| Bekräftat stöd | ${supported} |`);
lines.push(`| Fel | ${errors.length} |`);
lines.push(`| Varningar | ${warnings.length} |`);
lines.push(`| Granskade undantag | ${accepted.length} |`);
lines.push('');

for (const [title, group] of [
  ['Fel', errors],
  ['Varningar', warnings],
] as const) {
  lines.push(`## ${title} — ${group.length} st`);
  lines.push('');
  if (group.length === 0) {
    lines.push('Inga.');
    lines.push('');
    continue;
  }
  lines.push('| Fråga | Sida | Kod | Vad |');
  lines.push('| --- | ---: | --- | --- |');
  for (const f of group) lines.push(`| \`${f.questionId}\` | ${f.page} | ${f.code} | ${f.message} |`);
  lines.push('');
}

lines.push(`## Bildernas sidhänvisningar — ${imagePagesChecked} st`);
lines.push('');
lines.push('Varje godkänd källbild anger sidan den är hämtad från. Kontrollen är enklare än');
lines.push('för frågorna — en figursida bär etiketter, inte meningar — men den fångar det som');
lines.push('faktiskt går fel: ett sidnummer utanför källan, eller ett som hamnat i fel');
lines.push('kapitel. Avdelare och självtestsidor räknas inte som fel här — i den här boken');
lines.push('är en kapitelavdelare ett helsidesfoto, och självtesten är illustrerade.');
lines.push('');
lines.push('En varning här är sällan ett fel. En bilds kapitel är det kapitel den *lär ut*,');
lines.push('och ett fotografi av en vägvisarportal hör till vägmärken även när det är taget');
lines.push('ur motorvägskapitlet. Vad varningen fångar är sidnummer som hamnat helt fel.');
lines.push('');
lines.push('| | Antal |');
lines.push('| --- | ---: |');
lines.push(`| Bekräftade | ${imagePagesSupported} |`);
lines.push(`| Fel | ${imageErrors.length} |`);
lines.push(`| Varningar | ${imageWarnings.length} |`);
lines.push('');
if (imageFindings.length === 0) {
  lines.push('Inga anmärkningar.');
} else {
  lines.push('| Bild | Sida | Kod | Vad |');
  lines.push('| --- | ---: | --- | --- |');
  for (const f of imageFindings) {
    lines.push(`| \`${f.questionId}\` | ${f.page} | ${f.code} | ${f.message} |`);
  }
}
lines.push('');

lines.push(`## Granskade undantag — ${accepted.length} st`);
lines.push('');
if (accepted.length === 0) {
  lines.push('Inga.');
} else {
  lines.push('Hänvisningar som kontrollen flaggar men som en människa läst sidan för och');
  lines.push('funnit korrekta. De står kvar i rapporten i stället för att döljas.');
  lines.push('');
  lines.push('| Fråga | Sida | Vad som faktiskt står där |');
  lines.push('| --- | ---: | --- |');
  for (const f of accepted) {
    lines.push(`| \`${f.questionId}\` | ${f.page} | ${ACCEPTED[`${f.questionId}:${f.page}`]} |`);
  }
}
lines.push('');

if (staleExceptions.length > 0) {
  lines.push('## Inaktuella undantag');
  lines.push('');
  lines.push('Dessa står i undantagslistan men flaggas inte längre. Ta bort dem ur');
  lines.push('`scripts/audit-source-pages.ts` så att listan inte växer av gammal vana.');
  lines.push('');
  for (const key of staleExceptions) lines.push(`- \`${key}\``);
  lines.push('');
}

lines.push('## Om varningarna');
lines.push('');
lines.push('En varning betyder "titta på den här", inte "den är fel". Svenska sammansättningar');
lines.push('gör att en sida kan stödja en regel utan att dela ord med frågan, och en regel kan');
lines.push('nämnas i flera kapitel. Fel är hårdare: sidan finns inte, saknar text, eller delar');
lines.push('inte ett enda nyckelord med frågan.');
lines.push('');

writeFileSync(resolve(root, 'docs/SOURCE-PAGE-AUDIT.md'), lines.join('\n'), 'utf8');
console.log(
  `docs/SOURCE-PAGE-AUDIT.md skriven — ${citationsChecked} hänvisningar ` +
    `och ${imagePagesChecked} bildsidor, ${errors.length + imageErrors.length} fel, ` +
    `${warnings.length + imageWarnings.length} varningar.`,
);
process.exitCode = errors.length + imageErrors.length > 0 ? 1 : 0;
