import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { statSync, existsSync } from 'node:fs';
import {
  ROAD_SIGNS,
  SUPPLEMENTARY_PLATES,
  SIGN_CATEGORY_LABELS,
  signVariants,
} from '../src/content/road-signs';
import { LESSONS } from '../src/content/lessons';
import { ALL_QUESTIONS } from '../src/content/questions';
import signAssets from '../src/content/road-sign-assets.json';
import { SIGN_GLYPHS } from '../src/ui/illustrations/signGlyphs';
import type { SignCategory } from '../src/content/road-signs';

/**
 * What the sign library actually contains.
 *
 *   npm run report:signs
 *
 * Writes docs/SIGN-LIBRARY.md.
 *
 * The registry has grown from 58 signs to a size where nobody can hold it in
 * their head, and most of the interesting facts are about *joins*: which signs
 * have the book's own artwork and which keep a drawing, which are drawn but
 * never taught, which carry a photograph of themselves in real traffic. Those
 * are exactly the things that rot quietly, so they get counted rather than
 * remembered.
 */

const licensed = new Set(signAssets.map((a) => a.id));
const root = process.cwd();

/* ---- Where each sign is used ---------------------------------------- */
const inLessons = new Map<string, string[]>();
const inContext = new Map<string, string>();
for (const lesson of LESSONS) {
  for (const block of lesson.blocks) {
    const note = (id: string) =>
      inLessons.set(id, [...(inLessons.get(id) ?? []), lesson.id]);
    if (block.kind === 'signGrid') block.signIds.forEach(note);
    if (block.kind === 'signCompare') [block.leftId, block.rightId].forEach(note);
    if (block.kind === 'signInContext') {
      note(block.signId);
      inContext.set(block.signId, block.imageId);
    }
    if (block.kind === 'signAssembly') {
      note(block.mainSignId);
      block.plateIds.forEach(note);
    }
  }
}

const inQuestions = new Map<string, number>();
for (const q of ALL_QUESTIONS) {
  const id = q.image?.illustration;
  if (id) inQuestions.set(id, (inQuestions.get(id) ?? 0) + 1);
  for (const plate of q.signAssembly?.plateIds ?? []) {
    inQuestions.set(plate, (inQuestions.get(plate) ?? 0) + 1);
  }
  if (q.signAssembly?.mainSignId) {
    const main = q.signAssembly.mainSignId;
    inQuestions.set(main, (inQuestions.get(main) ?? 0) + 1);
  }
}

const md: string[] = [];
md.push('# Vägmärkesbiblioteket');
md.push('');
md.push('GENERERAD — kör `npm run report:signs`. Redigera inte för hand.');
md.push('');
md.push('Märkena kommer från källans märkesbilaga där en användbar bild finns, och');
md.push('från Vägklars egna ritningar där koden täcker flera varianter. Se');
md.push('[LICENSED-SIGNS.md](LICENSED-SIGNS.md).');
md.push('');

const vectors = ROAD_SIGNS.filter((s) => !licensed.has(s.id));
const withTraits = ROAD_SIGNS.filter((s) => s.visualTraits !== undefined);
const undrawable = ROAD_SIGNS.filter((s) => !licensed.has(s.id) && !(s.id in SIGN_GLYPHS));

let assetBytes = 0;
for (const asset of signAssets) {
  const file = resolve(root, `src/assets/road-signs/sign-${asset.id}.webp`);
  if (existsSync(file)) assetBytes += statSync(file).size;
}

md.push('| | Antal |');
md.push('| --- | ---: |');
md.push(`| Märken i registret | ${ROAD_SIGNS.length} |`);
md.push(`| Med licensierad bokbild | ${signAssets.length} |`);
md.push(`| På Vägklars ritning | ${vectors.length} |`);
md.push(`| Utan bild alls | ${undrawable.length} |`);
md.push(`| Tilläggstavlor | ${SUPPLEMENTARY_PLATES.length} |`);
md.push(`| Med visualTraits | ${withTraits.length} av ${ROAD_SIGNS.length} |`);
md.push(`| Med foto i verklig trafik | ${inContext.size} |`);
md.push(`| Använda i en lektion | ${inLessons.size} |`);
md.push(`| Använda i en fråga | ${inQuestions.size} |`);
md.push(`| Bildmaterial på disk | ${Math.round(assetBytes / 1024)} kB |`);
md.push('');

md.push('## Per serie');
md.push('');
md.push('| Serie | Kategori | Antal | Licensierad bild | Ritning |');
md.push('| --- | --- | ---: | ---: | ---: |');
const series = [...new Set(ROAD_SIGNS.map((s) => s.code[0]!))].sort();
for (const letter of series) {
  const group = ROAD_SIGNS.filter((s) => s.code.startsWith(letter));
  const category = group[0]!.category as SignCategory;
  const withArt = group.filter((s) => licensed.has(s.id)).length;
  md.push(
    `| ${letter} | ${SIGN_CATEGORY_LABELS[category]} | ${group.length} | ${withArt} | ${group.length - withArt} |`,
  );
}
md.push('');

md.push('## Varianter under en kod');
md.push('');
md.push('Föreskriften ger en kod till en hel familj. C31 är varje hastighetsgräns, D1');
md.push('varje påbjuden riktning, T6 varje tidtavla — och boken trycker en bild per kod.');
md.push('Att använda bokens C31 för `hastighet-90` vore att visa fel siffra, så de här');
md.push('behåller sin ritning med flit.');
md.push('');
md.push('| Kod | Varianter | Bild |');
md.push('| --- | --- | --- |');
for (const code of [...new Set(ROAD_SIGNS.filter((s) => s.variant).map((s) => s.code))]) {
  const family = signVariants(code);
  const source = family.every((s) => licensed.has(s.id)) ? 'bokens' : 'Vägklars ritning';
  md.push(`| ${code} | ${family.map((s) => `\`${s.id}\``).join(', ')} | ${source} |`);
}
md.push('');

md.push('## Märken med foto i verklig trafik');
md.push('');
if (inContext.size === 0) {
  md.push('Inga.');
} else {
  md.push('Varje par är kontrollerat genom att titta på fotografiet, inte genom att läsa');
  md.push('kapitelrubriken. Där utsnittet inte avgjorde vilket märke det var gjordes inget par.');
  md.push('');
  md.push('| Märke | Kod | Fotografi |');
  md.push('| --- | --- | --- |');
  for (const [signId, imageId] of [...inContext].sort()) {
    const sign = ROAD_SIGNS.find((s) => s.id === signId);
    md.push(`| \`${signId}\` | ${sign?.code ?? '?'} | \`${imageId}\` |`);
  }
}
md.push('');

md.push('## Tilläggstavlor');
md.push('');
md.push('| Tavla | Kod | Vad den begränsar | Läses som |');
md.push('| --- | --- | --- | --- |');
for (const plate of SUPPLEMENTARY_PLATES) {
  md.push(`| \`${plate.id}\` | ${plate.code} | ${plate.plate!.kind} | ${plate.plate!.combinedPhrase} |`);
}
md.push('');

md.push('## Märken som ingen lektion och ingen fråga använder');
md.push('');
const idle = ROAD_SIGNS.filter((s) => !inLessons.has(s.id) && !inQuestions.has(s.id));
if (idle.length === 0) {
  md.push('Inga.');
} else {
  md.push('Ett märke som ingen undervisning rör vid kostar ändå bytes i förhandscachen.');
  md.push('Det är inte automatiskt fel — katalogen finns för att slås upp i — men listan');
  md.push('ska vara läsbar och motiverad.');
  md.push('');
  md.push('| Märke | Kod | Serie |');
  md.push('| --- | --- | --- |');
  for (const s of idle) md.push(`| \`${s.id}\` | ${s.code} | ${s.code[0]} |`);
}
md.push('');

writeFileSync(resolve(root, 'docs/SIGN-LIBRARY.md'), md.join('\n'), 'utf8');
console.log(
  `docs/SIGN-LIBRARY.md skriven — ${ROAD_SIGNS.length} märken, ${signAssets.length} med bokbild, ` +
    `${vectors.length} ritningar, ${withTraits.length} med visualTraits, ${inContext.size} med trafikfoto.`,
);
