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
import { join, resolve, extname, relative } from 'node:path';
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
    `${webp.length} källbilder, appskal och manifest på plats.`,
);
