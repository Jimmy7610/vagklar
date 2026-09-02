/**
 * Content validation and duplicate report.
 *
 *   npm run report:content
 *
 * Writes docs/CONTENT-VALIDATION.md from the real bank. Exits non-zero if the
 * validator found errors, so it can be used as a gate as well as a report.
 */

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ALL_QUESTIONS } from '../src/content/questions';
import { CURRICULUM_CONCEPTS } from '../src/content/curriculum/curriculum';
import { MISCONCEPTIONS } from '../src/content/misconceptions';
import { SOURCES, RIGHTS } from '../src/content/sources';
import { SUBCATEGORIES, CATEGORIES } from '../src/content/taxonomy';
import { SOURCE_IMAGES } from '../src/content/source-images';
import { LESSONS } from '../src/content/lessons';
import {
  SOURCE_IMAGE_WIDTHS,
  availableSourceImageAssets,
  availableSourceImageWidths,
} from '../src/ui/media/sourceImageAssets';
import { ROAD_SIGNS } from '../src/content/road-signs';
import { SIGN_GLYPHS } from '../src/ui/illustrations/signGlyphs';
import { ROAD_MARKINGS } from '../src/content/road-markings';
import { MARKING_GLYPHS } from '../src/ui/illustrations/markingGlyphs';
import { findDuplicates, validateContent } from '../src/domain/content/validation';

const report = validateContent({
  questions: ALL_QUESTIONS,
  subcategoryIds: new Set(SUBCATEGORIES.map((s) => s.id)),
  categoryBySubcategory: new Map(SUBCATEGORIES.map((s) => [s.id, s.categoryId as string])),
  misconceptionIds: new Set(MISCONCEPTIONS.map((m) => m.id)),
  concepts: CURRICULUM_CONCEPTS,
  sources: SOURCES,
  sourceImages: SOURCE_IMAGES,
  availableAssets: availableSourceImageAssets(),
  availableAssetWidths: availableSourceImageWidths(),
  requiredAssetWidths: SOURCE_IMAGE_WIDTHS,
  lessons: LESSONS,
  roadSigns: ROAD_SIGNS,
  availableSignGlyphs: new Set(Object.keys(SIGN_GLYPHS)),
  roadMarkings: ROAD_MARKINGS,
  availableMarkingGlyphs: new Set(Object.keys(MARKING_GLYPHS)),
});

const duplicates = findDuplicates(ALL_QUESTIONS, { threshold: 0.7 });

const byDifficulty = ALL_QUESTIONS.reduce<Record<number, number>>((acc, q) => {
  acc[q.difficulty] = (acc[q.difficulty] ?? 0) + 1;
  return acc;
}, {});
const byType = ALL_QUESTIONS.reduce<Record<string, number>>((acc, q) => {
  acc[q.questionType] = (acc[q.questionType] ?? 0) + 1;
  return acc;
}, {});
const byStatus = ALL_QUESTIONS.reduce<Record<string, number>>((acc, q) => {
  acc[q.status] = (acc[q.status] ?? 0) + 1;
  return acc;
}, {});

const total = ALL_QUESTIONS.length;
const pct = (n: number) => ((n / total) * 100).toFixed(0);

const out: string[] = [];
const w = (line = '') => out.push(line);

w('# Innehållsvalidering');
w();
w('> **Genererad fil.** Redigera den inte för hand — kör `npm run report:content`.');
w();
w('## Vad som kontrolleras');
w();
w('[`src/domain/content/validation.ts`](../src/domain/content/validation.ts) är en ren');
w('funktion som körs både här och i testsviten. Den skiljer på **fel**, som inte får');
w('finnas i banken, och **varningar**, som en människa bör titta på.');
w();
w('Fel som avvisas:');
w();
w('| Kod | Betyder |');
w('| --- | --- |');
w('| `duplicate-id` | Två frågor har samma id |');
w('| `unknown-subcategory` | Delområdet finns inte i taxonomin |');
w('| `category-mismatch` | Området stämmer inte med delområdet |');
w('| `unmapped-subcategory` | Delområdet saknar begrepp i kursplanen |');
w('| `answer-count` | Färre än 3 eller fler än 4 alternativ |');
w('| `duplicate-answer-id` / `duplicate-answer-text` | Två alternativ är identiska |');
w('| `missing-correct-answer` | Det rätta svaret finns inte bland alternativen |');
w('| `empty-answer` / `missing-prompt` / `missing-explanation` | Tomt obligatoriskt fält |');
w('| `bad-difficulty` | Svårighetsgrad utanför 1–3 |');
w('| `missing-source` / `source-without-name` | Källhänvisning saknas |');
w('| `unknown-source-id` | Källan finns inte i källregistret |');
w('| `bad-source-page` / `source-page-out-of-range` | Omöjligt sidnummer |');
w('| `missing-rights-holder` | Tredjepartskälla utan rättighetshavare |');
w('| `unknown-misconception` | Missuppfattningen finns inte |');
w('| `misconception-on-correct` | Det rätta svaret är taggat som en missuppfattning |');
w('| `verified-without-date` | Status `verified` utan verifieringsdatum |');
w('| `dangling-related` | Länk till en fråga som inte finns |');
w();
w('Bildbaserat innehåll:');
w();
w('| Kod | Betyder |');
w('| --- | --- |');
w('| `unknown-source-image` | Frågan eller lektionen pekar på en bild som inte finns |');
w('| `unapproved-source-image` | Bilden har inte status `approved` |');
w('| `missing-image-asset` | Bildfilen saknas på disk |');
w('| `duplicate-image-id` | Två bilder har samma id |');
w('| `image-without-alt` | Bilden saknar alt-text |');
w('| `image-without-description` | Bilden saknar användbar långbeskrivning |');
w('| `image-without-rights-holder` | Bilden saknar rättighetshavare |');
w('| `image-without-permission` | Bilden är inte markerad som använd med tillstånd |');
w('| `image-unknown-subcategory` | Bildens delområde finns inte i taxonomin |');
w('| `image-unknown-source` / `image-bad-source-page` / `image-source-page-out-of-range` | Felaktig källhänvisning |');
w();
w('Varje kontroll har ett test som medvetet planterar felet och kontrollerar att');
w('validatorn fångar det — se');
w('[`validation.test.ts`](../src/domain/content/validation.test.ts).');
w();

w('## Resultat');
w();
w(`Kontrollerade frågor: **${report.checked}**`);
w();
w(`- Fel: **${report.errors.length}**`);
w(`- Varningar: **${report.warnings.length}**`);
w();
if (report.errors.length > 0) {
  w('### Fel');
  w();
  w('| Fråga | Kod | Meddelande |');
  w('| --- | --- | --- |');
  for (const issue of report.errors) w(`| ${issue.questionId} | \`${issue.code}\` | ${issue.message} |`);
  w();
}
if (report.warnings.length > 0) {
  w('### Varningar');
  w();
  w('| Fråga | Kod | Meddelande |');
  w('| --- | --- | --- |');
  for (const issue of report.warnings) w(`| ${issue.questionId} | \`${issue.code}\` | ${issue.message} |`);
  w();
}

w('## Dubblettkontroll');
w();
w('Enkel normaliserad jämförelse plus Jaccard-likhet på ord — inget beroende, ingen');
w('modell. Exakt lika frågetext och identiska svarsuppsättningar *inom samma');
w('delområde* behandlas som fel i testsviten. Liknande formuleringar rapporteras');
w('bara, eftersom en variant som ändrar ett villkor med avsikt kan ligga nära.');
w();
if (duplicates.length === 0) {
  w(`Inga dubbletter över tröskeln 0,70 bland ${total} frågor.`);
} else {
  w('| Typ | A | B | Likhet |');
  w('| --- | --- | --- | ---: |');
  for (const d of duplicates) w(`| \`${d.kind}\` | ${d.a} | ${d.b} | ${d.score.toFixed(2)} |`);
}
w();

w('## Bankens sammansättning');
w();
w('| Mått | Antal | Andel |');
w('| --- | ---: | ---: |');
w(`| Frågor totalt | ${total} | 100 % |`);
w(`| Lätta (1) | ${byDifficulty[1] ?? 0} | ${pct(byDifficulty[1] ?? 0)} % |`);
w(`| Medel (2) | ${byDifficulty[2] ?? 0} | ${pct(byDifficulty[2] ?? 0)} % |`);
w(`| Svåra (3) | ${byDifficulty[3] ?? 0} | ${pct(byDifficulty[3] ?? 0)} % |`);
w();
w('| Frågetyp | Antal |');
w('| --- | ---: |');
for (const [type, n] of Object.entries(byType).sort((a, b) => b[1] - a[1])) {
  w(`| ${type} | ${n} |`);
}
w();
w('| Granskningsstatus | Antal |');
w('| --- | ---: |');
for (const [status, n] of Object.entries(byStatus).sort((a, b) => b[1] - a[1])) {
  w(`| ${status} | ${n} |`);
}
w();
w(`Godkända källbilder: **${SOURCE_IMAGES.filter((i) => i.status === 'approved').length}**, `
  + `varav ${ALL_QUESTIONS.filter((q) => q.sourceImageId !== undefined).length} används i frågor.`);
w(`Namngivna missuppfattningar: **${MISCONCEPTIONS.length}**.`);
w(`Områden: **${CATEGORIES.length}**, delområden: **${SUBCATEGORIES.length}**.`);
w();
w('> Ingen fråga har status `verified`. Det är avsiktligt: innehållet är skrivet');
w('> mot källorna och internt granskat, men inte signerat av en sakkunnig. Se');
w('> [QUESTION-AUTHORING.md](QUESTION-AUTHORING.md).');
w();

w('## Rättigheter');
w();
w(RIGHTS.ownWork);
w();
w(RIGHTS.thirdParty);
w();
w(RIGHTS.disclaimer);
w();

writeFileSync(resolve(process.cwd(), 'docs/CONTENT-VALIDATION.md'), out.join('\n'), 'utf8');

console.log(
  `docs/CONTENT-VALIDATION.md skriven — ${report.checked} frågor, ` +
    `${report.errors.length} fel, ${report.warnings.length} varningar, ` +
    `${duplicates.length} dubblettkandidater.`,
);

if (report.errors.length > 0) {
  console.error('\ncontent-report: banken har fel som måste åtgärdas.\n');
  process.exit(1);
}
