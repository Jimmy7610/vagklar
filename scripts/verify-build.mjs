/**
 * Post-build safety check.
 *
 * Vägklar's curriculum is derived from licensed third-party material that we
 * have permission to *use* but never to redistribute. The source documents live
 * in references/ and must never reach the published site — not in dist/, not in
 * the service-worker precache, not embedded in a bundle.
 *
 * This runs as part of `npm run build`, so shipping the source becomes a build
 * failure rather than something a reviewer has to catch.
 *
 * Usage: node scripts/verify-build.mjs
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join, resolve, extname, relative, sep } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

/** File types that must never appear in a published build. */
const FORBIDDEN_EXTENSIONS = new Set(['.pdf', '.epub', '.mobi', '.docx']);

/**
 * Strings that would indicate source material leaked into a bundle. Kept
 * narrow on purpose: the *titles* legitimately appear in the attribution UI,
 * so we look for the document filenames and the references directory instead.
 */
const FORBIDDEN_STRINGS = ['teoribok-2026-1.pdf', 'references/teoribok', 'references\\teoribok'];

/**
 * Things that exist to help build the product and must never be shipped with
 * it.
 *
 * The reviewer tool is the sharp one. It contains the whole question bank with
 * the correct answers marked, every source page citation, and — where the
 * local cache exists — words taken from the licensed book. It is exactly what
 * a person preparing verification needs and exactly what a learner must not be
 * handed. It lives in `review/`, outside the Vite root, and is gitignored;
 * this checks that no route, no copy step and no future refactor has moved it
 * into a build.
 *
 * The page-text cache is the same story: derived from the licensed source, fine
 * on a maintainer's disk, not something to publish.
 */
const DEV_ONLY_ARTEFACTS = [
  'granskningsverktyg',
  'vagklar-granskning',
  'granskningsanteckningar',
  '.page-text.json',
  'VERIFICATION-QUEUE',
];

/** Files the build must produce for GitHub Pages to work. */
const REQUIRED = ['index.html', 'manifest.webmanifest', 'sw.js'];

const failures = [];

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

if (!existsSync(DIST)) {
  console.error('verify-build: dist/ saknas — kör "npm run build" först.');
  process.exit(1);
}

const files = walk(DIST);

/* ---- 1. No source documents shipped ---------------------------------- */
for (const file of files) {
  if (FORBIDDEN_EXTENSIONS.has(extname(file).toLowerCase())) {
    failures.push(`Källdokument i bygget: ${relative(ROOT, file)}`);
  }
}

/* ---- 2. No references to them inside text assets ---------------------- */
const textLike = new Set(['.js', '.css', '.html', '.json', '.webmanifest', '.map', '.txt']);
for (const file of files) {
  if (!textLike.has(extname(file).toLowerCase())) continue;
  const contents = readFileSync(file, 'utf8');
  for (const needle of FORBIDDEN_STRINGS) {
    if (contents.includes(needle)) {
      failures.push(`Referens till källdokument i ${relative(ROOT, file)}: "${needle}"`);
    }
  }
}

/* ---- 2b. Reviewer tooling and verification data stay out of the build -- */
for (const file of files) {
  const rel = relative(DIST, file).split(sep).join('/');
  if (rel.startsWith('review/') || rel === 'review') {
    failures.push(`Granskningsverktyget ligger i bygget: ${rel}`);
  }
  if (!textLike.has(extname(file).toLowerCase())) continue;
  const contents = readFileSync(file, 'utf8');
  for (const needle of DEV_ONLY_ARTEFACTS) {
    if (contents.includes(needle)) {
      failures.push(`Utvecklingsartefakt i ${rel}: "${needle}"`);
    }
  }
}

/* ---- 3. Service worker must not precache one ------------------------- */
const swPath = join(DIST, 'sw.js');
if (existsSync(swPath)) {
  const sw = readFileSync(swPath, 'utf8');
  const precached = [...sw.matchAll(/url:\s*"([^"]+)"/g)].map((m) => m[1]);
  for (const url of precached) {
    if (FORBIDDEN_EXTENSIONS.has(extname(url).toLowerCase())) {
      failures.push(`Service workern precachar ett källdokument: ${url}`);
    }
  }
}

/* ---- 4. The build is actually deployable ----------------------------- */
for (const required of REQUIRED) {
  if (!existsSync(join(DIST, required))) failures.push(`Bygget saknar ${required}`);
}

/* ---- 5. Approved source images actually shipped ---------------------- */
/*
 * The opposite failure to the one above: the pipeline silently produces no
 * images and every lesson renders its text fallback. Counting them here means
 * a broken extraction step fails the build instead of quietly degrading it.
 */
const webp = files.filter((f) => extname(f).toLowerCase() === '.webp');
if (webp.length === 0) {
  failures.push('Inga källbilder i bygget — bildpipelinen verkar trasig.');
}

/*
 * The service worker routes the licensed photographs to their own cache by
 * matching the .webp extension, because Vite flattens the folder they live in.
 * That rule is exact only as long as WebP means "source photograph" — so a
 * WebP that is not one, or a photograph in another format, has to fail here
 * rather than quietly land in the wrong cache with the wrong eviction policy.
 */
const strayWebp = webp.filter((f) => !relative(DIST, f).split(sep).join('/').startsWith('assets/'));
if (strayWebp.length > 0) {
  failures.push(
    `WebP utanför assets/: ${strayWebp.map((f) => relative(DIST, f)).join(', ')}. ` +
      'Service workern antar att alla .webp är källbilder.',
  );
}

/* ---- 5b. Source photographs stay out of the precache ------------------ */
/*
 * 6 MB of photographs must not be forced onto every device at install time.
 * They are runtime-cached the first time a lesson or question actually shows
 * one, which is what keeps the install small while still working offline
 * afterwards.
 */
if (existsSync(swPath)) {
  const swSource = readFileSync(swPath, 'utf8');
  const precachedWebp = swSource.match(/[\w./-]+\.webp/g) ?? [];
  const photographs = precachedWebp.filter((url) => !/\/?sign-/.test(url));
  if (photographs.length > 0) {
    failures.push(
      `${photographs.length} källfotografier ligger i förhandscachen. De ska cachas vid körning.`,
    );
  }
  // And the other way round: the signs are meant to be there, so an empty
  // precache means the glob stopped matching them and an offline exam would
  // quietly lose its pictures.
  const signs = precachedWebp.length - photographs.length;
  if (signs < 40) {
    failures.push(`Bara ${signs} vägmärken i förhandscachen — de ska precachas för prov offline.`);
  }
}

/* ---- 6. Startup budget ------------------------------------------------ */
/*
 * The question bank was moved out of the eagerly loaded payload deliberately,
 * and the way to lose that is not a bad decision but an ordinary import in the
 * wrong file. A budget here turns that from something nobody notices into a
 * build failure.
 *
 * The number is what the browser must download before the landing page can be
 * painted: the entry chunk and every chunk it statically imports. The ceiling
 * is set with headroom above the measured figure, so normal growth is fine and
 * a regression of the "the bank came back" size is not.
 */
const STARTUP_BUDGET_BYTES = 185_000;

const indexHtml = readFileSync(join(DIST, 'index.html'), 'utf8');
const eagerAssets = [...new Set([...indexHtml.matchAll(/assets\/[A-Za-z0-9_.-]+\.js/g)].map((m) => m[0]))];
let startupBytes = 0;
for (const asset of eagerAssets) {
  const file = join(DIST, asset);
  if (existsSync(file)) startupBytes += gzipSync(readFileSync(file)).length;
}
if (startupBytes > STARTUP_BUDGET_BYTES) {
  failures.push(
    `Startpaketet är ${startupBytes} B gzip, taket är ${STARTUP_BUDGET_BYTES} B. ` +
      'Något tungt har hamnat i startgrafen — se docs/CONTENT-LOADING.md.',
  );
}
if (eagerAssets.some((a) => a.includes('questions-'))) {
  failures.push('Frågebankens chunk laddas nu vid start. Se docs/CONTENT-LOADING.md.');
}

/* ---- 7. GitHub Pages base path ---------------------------------------- */
/*
 * The site is served from a subdirectory, so an absolute path that forgot the
 * base resolves against the domain root and 404s. That is invisible in `vite
 * preview` at the root and breaks only in production, which is exactly the
 * kind of failure worth catching mechanically.
 */
const BASE = '/vagklar/';
if (!indexHtml.includes(`src="${BASE}assets/`)) {
  failures.push(`index.html laddar inte sitt entryskript från ${BASE}.`);
}
for (const bad of [...indexHtml.matchAll(/(?:src|href)="(\/(?!vagklar\/)[^"]*)"/g)]) {
  failures.push(`index.html pekar på ${bad[1]} utan basvägen ${BASE}.`);
}
const manifestPath = join(DIST, 'manifest.webmanifest');
if (existsSync(manifestPath)) {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  // A relative value is resolved against the manifest's own URL, which already
  // sits under the base — so "./" is correct here, and only a root-absolute
  // path that forgot the base is wrong.
  const rootAbsoluteOutsideBase = (value) =>
    typeof value === 'string' && value.startsWith('/') && !value.startsWith(BASE);
  for (const [field, value] of [
    ['start_url', manifest.start_url],
    ['scope', manifest.scope],
  ]) {
    if (rootAbsoluteOutsideBase(value)) {
      failures.push(`manifest.${field} är "${value}" och saknar basvägen ${BASE}.`);
    }
  }
  for (const icon of manifest.icons ?? []) {
    if (rootAbsoluteOutsideBase(icon.src)) {
      failures.push(`Manifestikonen ${icon.src} saknar basvägen ${BASE}.`);
    }
  }
}

/* ---- Report ---------------------------------------------------------- */
if (failures.length > 0) {
  console.error('\nverify-build MISSLYCKADES:\n');
  for (const failure of failures) console.error(`  ✗ ${failure}`);
  console.error('');
  process.exit(1);
}

const pdfCount = files.filter((f) => extname(f).toLowerCase() === '.pdf').length;
console.log(
  `verify-build OK — ${files.length} filer, 0 källdokument (${pdfCount} PDF), ` +
    `${webp.length} källbilder, appskal och manifest på plats.
` +
    `                 startpaket ${startupBytes} B gzip av ${STARTUP_BUDGET_BYTES} B, ` +
    `basväg ${BASE} verifierad.`,
);
