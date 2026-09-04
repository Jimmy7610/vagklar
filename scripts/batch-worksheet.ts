import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { ALL_QUESTIONS } from '../src/content/questions';
import { SOURCE_BY_ID } from '../src/content/sources';
import { MISCONCEPTIONS } from '../src/content/misconceptions';
import { contentFingerprint } from '../src/domain/content/fingerprint';
import { BATCHES, priorityOf } from '../src/domain/content/verificationPriority';
import type { Question } from '../src/domain/content/types';

/**
 * A sheet a person can actually sit down with.
 *
 *   npm run worksheet -- 01
 *
 * The verification queue lists everything and is generated for machines to keep
 * honest. This is the other half: one batch, one page, with a decision box per
 * question and the exact strings that have to be typed back into the bank if
 * the answer is "approve".
 *
 * Three things it deliberately does not contain.
 *
 * No passages from the licensed source. The page number is here so a reviewer
 * can open the book; reproducing the text would be republishing it.
 *
 * No reviewer identity. Nothing in this repository may fill in who checked
 * something — that is the one field a tool must never write, because the whole
 * value of the field is that a person put their name on it.
 *
 * No verdict. The "Källa säger" column is what an authority's own text says,
 * recorded during preparation; whether that settles the question is the
 * reviewer's call, not the generator's.
 */

const batchArg = process.argv[2] ?? '01';
const batch = BATCHES.find((b) => b.id === batchArg);
if (!batch) {
  console.error(`Okänd omgång "${batchArg}". Välj en av: ${BATCHES.map((b) => b.id).join(', ')}`);
  process.exit(1);
}

const misconceptionById = new Map(MISCONCEPTIONS.map((m) => [m.id, m]));

const inBatch = ALL_QUESTIONS.filter(
  (q) => priorityOf(q).priority === 'P1' && batch.subcategories.includes(q.subcategory),
);

/** The sources a reviewer has to open, deduplicated across the batch. */
const sourcesUsed = new Map<string, { title: string; url?: string }>();
for (const q of inBatch) {
  for (const ref of q.sourceReferences) {
    const entry = ref.sourceId ? SOURCE_BY_ID.get(ref.sourceId) : undefined;
    const key = ref.sourceId ?? ref.name;
    if (!sourcesUsed.has(key)) {
      sourcesUsed.set(key, {
        title: entry?.title ?? ref.name,
        ...(entry?.url ? { url: entry.url } : {}),
      });
    }
  }
}

function refLine(q: Question): string {
  return q.sourceReferences
    .map((r) => {
      const pages = r.sourcePages?.length ? ` s. ${r.sourcePages.join(', ')}` : '';
      return `${r.name}${r.reference ? ` ${r.reference}` : ''}${pages}`;
    })
    .join(' · ');
}

const md: string[] = [];
md.push(`# Granskningsblad — omgång ${batch.id}: ${batch.title}`);
md.push('');
md.push('GENERERAD — kör `npm run worksheet -- ' + batch.id + '`. Redigera inte för hand.');
md.push('');
md.push(`${inBatch.length} frågor. Alla har status \`reviewed\`. Ingen är verifierad, och`);
md.push('ingenting i det här förvaret får ändra på det — bara en människa som faktiskt');
md.push('kontrollerat påståendet mot källan.');
md.push('');
md.push('## Så använder du bladet');
md.push('');
md.push('En fråga i taget. Öppna källan i kolumnen, läs vad den säger, och fyll i beslutet.');
md.push('');
md.push('| Beslut | Vad du gör i banken |');
md.push('| --- | --- |');
md.push(
  '| **GODKÄNN** | `status: \'verified\'` plus `verifiedBy`, `verifiedAt`, ' +
    '`verificationSourceIds`, `verifiedFingerprint` (avtrycket nedan) och gärna ' +
    '`verifiedAgainstEditions`. Validatorn kräver alla utom den sista. |',
);
md.push(
  '| **AVVISA** | `status: \'rejected\'` plus `reviewNotes` (skälet), `reviewedBy` och ' +
    '`lastReviewedAt`. Frågan tas ur banken men skälet finns kvar. |',
);
md.push(
  '| **BEHÖVER ÄNDRAS** | Låt statusen vara `reviewed`. Skriv `reviewNotes`, ' +
    '`reviewedBy` och `lastReviewedAt`. Ingen verifiering sätts. |',
);
md.push('');
md.push('Ändras texten efter ett godkännande stämmer inte avtrycket längre, och');
md.push('validatorn säger till. Det är meningen: en signatur gäller den formulering');
md.push('som lästes, inte frågan som idé.');
md.push('');

md.push('## Källor att ha uppslagna');
md.push('');
md.push('| Källa | Länk |');
md.push('| --- | --- |');
for (const [, entry] of [...sourcesUsed].sort((a, b) => a[1].title.localeCompare(b[1].title, 'sv'))) {
  md.push(`| ${entry.title} | ${entry.url ? `<${entry.url}>` : '—'} |`);
}
md.push('');

md.push('## Frågor');
md.push('');

for (const q of inBatch) {
  const { tags, because } = priorityOf(q);
  const correct = q.answers.find((a) => a.id === q.correctAnswerId);
  md.push(`### \`${q.id}\` — ${q.ruleTested}`);
  md.push('');
  md.push(`**Fråga:** ${q.prompt}`);
  md.push('');
  for (const a of q.answers) {
    const mark = a.id === q.correctAnswerId ? '**RÄTT**' : 'fel';
    const mis = a.misconceptionId
      ? ` — avslöjar: ${misconceptionById.get(a.misconceptionId)?.label ?? a.misconceptionId}`
      : '';
    md.push(`- ${mark}: ${a.text}${mis}`);
  }
  md.push('');
  md.push(`**Kort förklaring:** ${q.shortExplanation}`);
  if (q.deepExplanation) {
    md.push('');
    md.push(`**Fördjupning:** ${q.deepExplanation}`);
  }
  md.push('');
  md.push('| | |');
  md.push('| --- | --- |');
  md.push(`| Kapitel · delområde | ${q.category} · ${q.subcategory} |`);
  md.push(`| Svårighet | ${q.difficulty} |`);
  md.push(`| Varför P1 | ${because} |`);
  md.push(`| P1-typer | ${tags.join(', ') || '—'} |`);
  md.push(`| Källhänvisning | ${refLine(q) || '—'} |`);
  md.push(`| Nuvarande status | \`${q.status}\` |`);
  md.push(`| Avtryck att signera | \`${contentFingerprint(q)}\` |`);
  md.push(`| Rätt svar | ${correct?.text ?? '—'} |`);
  md.push('');
  md.push('| Beslut | Granskare | Datum | Källa som kontrollerades | Anteckning |');
  md.push('| --- | --- | --- | --- | --- |');
  md.push('|  |  |  |  |  |');
  md.push('');
}

const out = resolve(process.cwd(), `docs/review/BATCH-${batch.id}-${slug(batch.title)}.md`);
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, md.join('\n') + '\n', 'utf8');
console.log(`${out} skriven — ${inBatch.length} frågor, ${sourcesUsed.size} källor.`);

function slug(title: string): string {
  return title
    .toLocaleLowerCase('sv')
    .replace(/å|ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toUpperCase();
}
