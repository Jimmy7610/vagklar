/**
 * Where the licensed pictures are, and where they are not.
 *
 *   npm run report:images
 *
 * Writes docs/IMAGE-COVERAGE.md.
 *
 * Coverage reports for text answer "is the concept taught at all". This one
 * answers a different question: which parts of the theory would be easier to
 * understand if the learner could see a real road, and are any of them still
 * relying on prose alone.
 *
 * It also lists approved images nobody uses. An unused image is not free — it
 * ships in the build, it was licensed for a purpose, and it usually means
 * somebody curated it for a lesson that was never written.
 */

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ALL_QUESTIONS } from '../src/content/questions';
import { ORIGINAL_VISUALS } from '../src/content/original-visuals';
import { ROAD_SIGNS } from '../src/content/road-signs';
import signAssets from '../src/content/road-sign-assets.json';
import { LESSONS } from '../src/content/lessons';
import { SOURCE_IMAGES } from '../src/content/source-images';
import { SCENARIOS } from '../src/content/scenarios';
import { CURRICULUM_CHAPTERS, CURRICULUM_CONCEPTS } from '../src/content/curriculum/curriculum';
import { getSubcategoryName } from '../src/content/taxonomy';
import {
  SOURCE_IMAGE_WIDTHS,
  availableSourceImageWidths,
} from '../src/ui/media/sourceImageAssets';

const approved = SOURCE_IMAGES.filter((i) => i.status === 'approved');
const widths = availableSourceImageWidths();

/* ---- Usage ---------------------------------------------------------- */

const questionUse = new Map<string, string[]>();
for (const q of ALL_QUESTIONS) {
  if (!q.sourceImageId) continue;
  const list = questionUse.get(q.sourceImageId);
  if (list) list.push(q.id);
  else questionUse.set(q.sourceImageId, [q.id]);
}

const lessonUse = new Map<string, string[]>();
for (const lesson of LESSONS) {
  for (const block of lesson.blocks) {
    // A photograph can be used two ways now: on its own, or paired with the
    // book's own artwork of a sign that is visible in it.
    if (block.kind !== 'sourceImage' && block.kind !== 'signInContext') continue;
    const list = lessonUse.get(block.imageId);
    if (list) list.push(lesson.id);
    else lessonUse.set(block.imageId, [lesson.id]);
  }
}

const usedIds = new Set([...questionUse.keys(), ...lessonUse.keys()]);
const imageBackedLessons = new Set(
  LESSONS.filter((l) => l.blocks.some((b) => b.kind === 'sourceImage')).map((l) => l.id),
);
const imageBackedQuestions = ALL_QUESTIONS.filter((q) => q.sourceImageId);

/* ---- Chapter coverage ------------------------------------------------ */

const imagesPerChapter = new Map<string, number>();
for (const image of approved) {
  imagesPerChapter.set(image.chapter, (imagesPerChapter.get(image.chapter) ?? 0) + 1);
}

/** Concepts whose subcategory has at least one approved photograph. */
const subcategoriesWithImage = new Set(approved.map((i) => i.subcategory));
const conceptsWithPhoto = CURRICULUM_CONCEPTS.filter(
  (c) => c.subcategory !== null && subcategoriesWithImage.has(c.subcategory),
);

const lines: string[] = [];
lines.push('# Bildstöd');
lines.push('');
lines.push('GENERERAD — kör `npm run report:images`. Redigera inte för hand.');
lines.push('');
lines.push('Rapporten mäter var de licensierade fotografierna sitter, inte om de är bra.');
lines.push('Ett foto som ingen lektion tolkar är dekoration oavsett hur rätt det är.');
lines.push('');

lines.push('## Sammanfattning');
lines.push('');
lines.push('| | Antal |');
lines.push('| --- | ---: |');
lines.push(`| Godkända källbilder | ${approved.length} |`);
lines.push(`| Använda av lektion eller fråga | ${usedIds.size} |`);
lines.push(`| Oanvända | ${approved.length - usedIds.size} |`);
lines.push(`| Lektioner med källbild | ${imageBackedLessons.size} av ${LESSONS.length} |`);
lines.push(`| Frågor med källbild | ${imageBackedQuestions.length} av ${ALL_QUESTIONS.length} |`);
lines.push(
  `| Kapitel med minst en bild | ${imagesPerChapter.size} av ${CURRICULUM_CHAPTERS.length} |`,
);
lines.push(
  `| Begrepp vars delområde har foto | ${conceptsWithPhoto.length} av ${CURRICULUM_CONCEPTS.length} |`,
);
lines.push(`| Scenarier (interaktiva, ej foto) | ${SCENARIOS.length} |`);
lines.push('');

lines.push('## Per användning');
lines.push('');
lines.push('| Användning | Antal |');
lines.push('| --- | ---: |');
for (const usage of ['theory-lesson', 'question-image', 'supporting-reference'] as const) {
  lines.push(`| \`${usage}\` | ${approved.filter((i) => i.usage === usage).length} |`);
}
lines.push('');

/* Vägklars egna ritningar räknas separat och redovisas separat. De fyller
   luckor där källan inte har någon figur alls, så att slå ihop dem med de
   licenserade bilderna skulle dölja exakt den sak rapporten finns för att
   visa: vilka kapitel som saknar bildstöd i källan. */
const originals = ORIGINAL_VISUALS.filter((v) => v.status === 'approved');
const originalsPerChapter = new Map<string, number>();
for (const v of originals) {
  originalsPerChapter.set(v.chapter, (originalsPerChapter.get(v.chapter) ?? 0) + 1);
}

/* The signs are their own category. They come from the same licensed source as
   the photographs and diagrams, but they behave differently: tiny, flat,
   precached rather than runtime-cached, and with a hand-drawn fallback for the
   handful the book cannot supply. */
const licensedSignIds = new Set(signAssets.map((a) => a.id));
const vectorSigns = ROAD_SIGNS.filter((s) => !licensedSignIds.has(s.id));

lines.push('## Vägmärken');
lines.push('');
lines.push('Märkena visas med bokens egen bild där en sådan finns. De som står kvar på');
lines.push('Vägklars ritning gör det för att koden täcker flera varianter i verkligheten:');
lines.push('C31 är varje hastighetsgräns, D1 varje påbjuden riktning, T6 varje tidtavla, och');
lines.push('boken trycker en bild per kod. Bokens C31 visar 30 — den kan inte illustrera');
lines.push('`hastighet-90`.');
lines.push('');
lines.push('| | Antal |');
lines.push('| --- | ---: |');
lines.push(`| Märken i registret | ${ROAD_SIGNS.length} |`);
lines.push(`| Med licensierad bokbild | ${signAssets.length} |`);
lines.push(`| Kvar på Vägklars ritning | ${vectorSigns.length} |`);
lines.push('');
if (vectorSigns.length > 0) {
  lines.push('| Märke | Kod | Varför ritning |');
  lines.push('| --- | --- | --- |');
  for (const sign of vectorSigns) {
    lines.push(`| \`${sign.id}\` | ${sign.code} | koden täcker flera varianter |`);
  }
  lines.push('');
}

lines.push('## Vägklars egna ritningar');
lines.push('');
lines.push('Ritade för Vägklar, inte hämtade ur källan. De finns där boken inte har någon');
lines.push('figur som lär ut saken — mönsterdjup, lufttryck, krockvåld — eller har en som');
lines.push('gör det sämre än en ritning gjord för ändamålet. Upphovsrätt © 2026 Jimmy');
lines.push('Eliasson, och de krediteras "Illustration: Vägklar" i appen.');
lines.push('');
lines.push('| | Antal |');
lines.push('| --- | ---: |');
lines.push(`| Godkända ritningar | ${originals.length} |`);
lines.push(`| Lektionsritningar | ${originals.filter((v) => v.usage === 'theory-lesson').length} |`);
lines.push(
  `| Frågevarianter (utan facit i bilden) | ${originals.filter((v) => v.usage === 'question-image').length} |`,
);
lines.push('');
lines.push('| Ritning | Kapitel | Delområde | Användning |');
lines.push('| --- | --- | --- | --- |');
for (const v of originals) {
  const chapter = CURRICULUM_CHAPTERS.find((c) => c.id === v.chapter);
  lines.push(
    `| \`${v.id}\` | ${chapter?.title ?? v.chapter} | ${getSubcategoryName(v.subcategory)} | ${v.usage} |`,
  );
}
lines.push('');

lines.push('## Kapitel med bildstöd');
lines.push('');
lines.push('Foto och ritning gör olika saker. Ett fotografi visar hur en situation faktiskt');
lines.push('ser ut genom vindrutan; en ritning visar ett mått eller ett förhållande som inte');
lines.push('går att fotografera. Ett kapitel om last behöver det senare, ett om sikt det');
lines.push('förra, och kolumnerna hålls isär så att den skillnaden syns.');
lines.push('');
lines.push('| Kapitel | Sidor | Foto | Bokritning | Egen ritning |');
lines.push('| --- | --- | ---: | ---: | ---: |');
for (const chapter of CURRICULUM_CHAPTERS) {
  const inChapter = approved.filter((i) => i.chapter === chapter.id);
  const own = originalsPerChapter.get(chapter.id) ?? 0;
  if (inChapter.length === 0 && own === 0) continue;
  const diagrams = inChapter.filter((i) => i.kind === 'diagram').length;
  lines.push(
    `| ${chapter.title} | ${chapter.startPage}–${chapter.endPage} | ` +
      `${inChapter.length - diagrams} | ${diagrams} | ${own} |`,
  );
}
lines.push('');

lines.push('## Kapitel utan bildstöd');
lines.push('');
lines.push('Inte alla behöver ett. Ett kapitel om registreringsbevis blir inte tydligare');
lines.push('av ett fotografi; ett om sikt, väglag eller samspel blir det nästan alltid.');
lines.push('');
lines.push('| Kapitel | Sidor |');
lines.push('| --- | --- |');
for (const chapter of CURRICULUM_CHAPTERS) {
  if ((imagesPerChapter.get(chapter.id) ?? 0) > 0) continue;
  if ((originalsPerChapter.get(chapter.id) ?? 0) > 0) continue;
  lines.push(`| ${chapter.title} | ${chapter.startPage}–${chapter.endPage} |`);
}
lines.push('');

lines.push('## Bilder och var de används');
lines.push('');
lines.push('| Bild | Slag | Delområde | Sida | Lektioner | Frågor |');
lines.push('| --- | --- | --- | ---: | --- | --- |');
for (const image of approved) {
  const lessons = lessonUse.get(image.id) ?? [];
  const questions = questionUse.get(image.id) ?? [];
  lines.push(
    `| \`${image.id}\` | ${image.kind === 'diagram' ? 'ritning' : 'foto'} | `+
      `${getSubcategoryName(image.subcategory)} | ${image.sourcePage} | ` +
      `${lessons.length ? lessons.join(', ') : '—'} | ${questions.length ? questions.join(', ') : '—'} |`,
  );
}
lines.push('');

const unused = approved.filter((i) => !usedIds.has(i.id));
lines.push(`## Oanvända godkända bilder — ${unused.length} st`);
lines.push('');
if (unused.length === 0) {
  lines.push('Inga. Varje godkänd bild används av minst en lektion eller fråga.');
} else {
  lines.push('De ligger i bygget utan att undervisa något. Antingen används de, eller så');
  lines.push('sätts de till `retired` så att de slutar följa med.');
  lines.push('');
  lines.push('| Bild | Delområde | Sida |');
  lines.push('| --- | --- | ---: |');
  for (const image of unused) {
    lines.push(
      `| \`${image.id}\` | ${getSubcategoryName(image.subcategory)} | ${image.sourcePage} |`,
    );
  }
}
lines.push('');

lines.push('## Filer');
lines.push('');
lines.push(`Varje godkänd bild ska finnas i bredderna ${SOURCE_IMAGE_WIDTHS.join(' och ')} px.`);
lines.push('Saknas någon avbryter innehållsvalideringen.');
lines.push('');
const incomplete = approved.filter((i) => {
  const have = widths.get(i.asset) ?? [];
  return SOURCE_IMAGE_WIDTHS.some((w) => !have.includes(w));
});
lines.push(
  incomplete.length === 0
    ? 'Alla godkända bilder har samtliga bredder.'
    : `Ofullständiga: ${incomplete.map((i) => i.id).join(', ')}`,
);
lines.push('');

writeFileSync(resolve(process.cwd(), 'docs/IMAGE-COVERAGE.md'), lines.join('\n'), 'utf8');
console.log(
  `docs/IMAGE-COVERAGE.md skriven — ${approved.length} godkända bilder, ` +
    `${usedIds.size} använda, ${unused.length} oanvända, ` +
    `${new Set([...imagesPerChapter.keys(), ...originalsPerChapter.keys()]).size}/${CURRICULUM_CHAPTERS.length} kapitel med bildstöd, ` +
    `${originals.length} egna ritningar, ${signAssets.length} licensierade vägmärken.`,
);
