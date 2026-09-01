/**
 * Generates docs/CONTENT-COVERAGE.md from the real curriculum map and the real
 * question bank.
 *
 * The report is computed, never hand-maintained: add a question or a
 * curriculum concept and the numbers change on the next run.
 *
 *   npm run report:coverage
 *
 * Nothing here reproduces source text. Page numbers are references into the
 * licensed source document, which is never shipped — see
 * docs/SOURCES-AND-RIGHTS.md.
 */

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CURRICULUM_CHAPTERS } from '../src/content/curriculum/curriculum';
import { LESSONS } from '../src/content/lessons';
import { getSource, PRIMARY_SOURCE_ID, RIGHTS } from '../src/content/sources';
import { APPROVED_SOURCE_IMAGES } from '../src/content/source-images';
import { ALL_QUESTIONS } from '../src/content/questions';
import { computeCoverage, gapsByPriority, COVERAGE_THRESHOLDS } from '../src/domain/curriculum/coverage';
import type { CoverageStatus } from '../src/domain/curriculum/coverage';

const report = computeCoverage();
const source = getSource(PRIMARY_SOURCE_ID);
const t = report.totals;

const pct = (n: number, of: number) => (of === 0 ? '0' : ((n / of) * 100).toFixed(0));

/** Concepts that have some questions but not enough to count as covered. */
const thin = t.concepts - t.conceptsCovered - t.conceptsMissing;

const STATUS: Record<CoverageStatus, string> = {
  missing: 'Saknas',
  thin: 'Tunn',
  covered: 'Täckt',
  strong: 'Stark',
};

/** A chapter's status is the weakest thing you can honestly say about it. */
function chapterStatus(covered: number, total: number): string {
  if (total === 0) return '—';
  if (covered === 0) return STATUS.missing;
  if (covered === total) return STATUS.strong;
  return covered * 2 >= total ? STATUS.covered : STATUS.thin;
}

const out: string[] = [];
const w = (line = '') => out.push(line);

w('# Innehållstäckning');
w();
w('> **Genererad fil.** Redigera den inte för hand — kör `npm run report:coverage`.');
w();
w('## Vad rapporten mäter');
w();
w('Kursplanen i `src/content/curriculum/curriculum.ts` beskriver vad ett B-körkort');
w('kräver, kapitel för kapitel och begrepp för begrepp. Rapporten jämför den kartan');
w('mot frågebanken, teoriskolan och Scenariolabbet, och visar var Vägklar har');
w('material och var det saknas.');
w();
w('Ett begrepp räknas som **täckt** först när det har tillräckligt många frågor —');
w('inte så snart det har en enda. Det är därför "täckta" alltid är färre än');
w('"begrepp med något material alls".');
w();
w(`Trösklar per begrepp: **Tunn** = 1–${COVERAGE_THRESHOLDS.covered - 1} frågor, ` +
  `**Täckt** = ${COVERAGE_THRESHOLDS.covered}–${COVERAGE_THRESHOLDS.strong - 1}, ` +
  `**Stark** = ${COVERAGE_THRESHOLDS.strong} eller fler.`);
w();
w('Rapporten mäter *mängd*, inte *kvalitet*. "Stark" betyder att det finns frågor —');
w('inte att någon har granskat dem, och inte att de är verifierade mot gällande rätt.');
w();

w('## Sammanfattning');
w();
w('| Mått | Värde |');
w('| --- | ---: |');
w(`| Huvudområden | ${report.areas.length} |`);
w(`| Kapitel | ${t.chapters} |`);
w(`| Begrepp | ${t.concepts} |`);
w(`| Begrepp med tillräckligt (≥ ${COVERAGE_THRESHOLDS.covered} frågor) | ${t.conceptsCovered} (${pct(t.conceptsCovered, t.concepts)} %) |`);
w(`| Begrepp med för få (1–${COVERAGE_THRESHOLDS.covered - 1} frågor) | ${thin} |`);
w(`| Begrepp helt utan frågor | ${t.conceptsMissing} |`);
w(`| Begrepp utan plats i taxonomin | ${t.conceptsUnmapped} |`);
w(`| Frågor i banken | ${t.questions} |`);
w(`| Frågor kopplade till ett begrepp | ${t.mappedQuestions} |`);
w(`| Frågor utan koppling | ${t.unmappedQuestions} |`);
w(`| Lektioner | ${t.lessons} |`);
w(`| Scenarier | ${t.scenarios} |`);
w(`| Luckor | ${report.gaps.length} |`);
w();

w('## Per huvudområde');
w();
w('| Område | Kapitel | Begrepp | Täckta | Andel täckta | Frågor |');
w('| --- | ---: | ---: | ---: | ---: | ---: |');
for (const area of report.areas) {
  w(`| ${area.title} | ${area.chapters.length} | ${area.conceptsTotal} | ` +
    `${area.conceptsCovered} | ${pct(area.conceptsCovered, area.conceptsTotal)} % | ${area.questionCount} |`);
}
w();

w('## Per kapitel');
w();
w('| Kapitel | Område | Sidor | Begrepp | Täckta | Frågor | Status |');
w('| --- | --- | ---: | ---: | ---: | ---: | --- |');
for (const area of report.areas) {
  for (const chapter of area.chapters) {
    w(`| ${chapter.title} | ${area.title} | ${chapter.startPage}–${chapter.endPage} | ` +
      `${chapter.conceptsTotal} | ${chapter.conceptsCovered} | ${chapter.questionCount} | ` +
      `${chapterStatus(chapter.conceptsCovered, chapter.conceptsTotal)} |`);
  }
}
w();

w('## Luckor');
w();
w('Prioritet 1 = kärnbegrepp helt utan frågor. Prioritet 2 = kärnbegrepp med för få.');
w('Prioritet 3 = stödjande eller perifera begrepp utan material.');
w();
for (const priority of [1, 2, 3] as const) {
  const gaps = gapsByPriority(report, priority);
  w(`### Prioritet ${priority} — ${gaps.length} st`);
  w();
  if (gaps.length === 0) {
    w('Inga.');
    w();
    continue;
  }
  w('| Begrepp | Kapitel | Sidor | Frågor | Varför |');
  w('| --- | --- | --- | ---: | --- |');
  for (const gap of gaps) {
    w(`| ${gap.topic} | ${gap.chapterTitle} | ${gap.sourcePages.join(', ')} | ` +
      `${gap.questionCount} | ${gap.reason} |`);
  }
  w();
}

w('## Teoriskolan mot kursplanen');
w();
w('| Lektion | Kapitel i kursplanen |');
w('| --- | --- |');
for (const lesson of [...LESSONS].sort((a, b) => a.order - b.order)) {
  const titles = lesson.curriculumChapterIds
    .map((id) => CURRICULUM_CHAPTERS.find((c) => c.id === id)?.title ?? id)
    .join(', ');
  w(`| ${lesson.title} | ${titles} |`);
}
w();

w('## Visuellt stöd');
w();
w('Utvalda fotografier ur källan används i lektioner och frågor där bilden gör');
w('skillnad för förståelsen. Tabellen visar var det visuella stödet finns i dag.');
w();
{
  const imagesByChapter = new Map<string, number>();
  for (const image of APPROVED_SOURCE_IMAGES) {
    imagesByChapter.set(image.chapter, (imagesByChapter.get(image.chapter) ?? 0) + 1);
  }
  const questionsWithImage = ALL_QUESTIONS.filter((q) => q.sourceImageId !== undefined);
  const lessonsWithImage = LESSONS.filter((l) =>
    l.blocks.some((b) => b.kind === 'sourceImage'),
  );

  w('| Mått | Antal |');
  w('| --- | ---: |');
  w(`| Godkända källbilder | ${APPROVED_SOURCE_IMAGES.length} |`);
  w(`| Kapitel med visuellt stöd | ${imagesByChapter.size} av ${t.chapters} |`);
  w(`| Bildbaserade frågor | ${questionsWithImage.length} |`);
  w(`| Lektioner med bild | ${lessonsWithImage.length} av ${LESSONS.length} |`);
  w();

  w('| Kapitel | Bilder |');
  w('| --- | ---: |');
  for (const chapter of CURRICULUM_CHAPTERS) {
    const n = imagesByChapter.get(chapter.id);
    if (n) w(`| ${chapter.title} | ${n} |`);
  }
  w();
  const without = CURRICULUM_CHAPTERS.filter((c) => !imagesByChapter.has(c.id));
  w(`Kapitel utan visuellt stöd: **${without.length}**. De viktigaste att komplettera`);
  w('härnäst listas i [SOURCE-IMAGES.md](SOURCE-IMAGES.md).');
  w();
}

w('## Källa och rättigheter');
w();
if (source) {
  w(`Kursplanens struktur och sidhänvisningar kommer från *${source.title}* ` +
    `(${source.edition}, ${source.pageCount} sidor), utgiven av ${source.publisher}. ` +
    `Rättigheterna till det verket tillhör ${source.rightsHolder}.`);
  w();
}
w('Vägklar återger ingen text ur källan. Kartan består av kapitelrubriker,');
w('sidintervall och begreppsnamn — precis det som behövs för att kunna svara på');
w('frågan "täcker vi det här?". Källdokumentet bundlas inte, publiceras inte och');
w('checkas inte in; `scripts/verify-build.mjs` gör varje sådant försök till ett byggfel.');
w();
w(RIGHTS.ownWork);
w();
w(RIGHTS.disclaimer);
w();
w('Se [SOURCES-AND-RIGHTS.md](SOURCES-AND-RIGHTS.md) för hela redovisningen.');
w();

writeFileSync(resolve(process.cwd(), 'docs/CONTENT-COVERAGE.md'), out.join('\n'), 'utf8');
console.log(
  `docs/CONTENT-COVERAGE.md skriven — ${t.concepts} begrepp, ${t.conceptsCovered} täckta, ` +
    `${report.gaps.length} luckor.`,
);
