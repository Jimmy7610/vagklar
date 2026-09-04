import { SOURCE_BY_ID } from '@/content/sources';
import type { Question } from './types';

/**
 * How the verification queue is ordered.
 *
 * Vägklar's content is *reviewed*, not *verified*, and the difference matters.
 * Reviewed means it was written carefully and read again. Verified means a
 * named person checked the statement against a named source on a named date.
 * Nothing here sets that status — this only decides what a reviewer should
 * look at first, so the scarce thing (a person's attention) goes where being
 * wrong would cost the most.
 *
 * Priority is about consequence, not difficulty:
 *
 *   P1  a legal number, date, interval or limit, or a rule that changes on its
 *       own. Wrong here and a learner walks into the real test — or the road —
 *       with a false fact.
 *   P2  exceptions and calculations. Wrong here and the learner has the right
 *       fact but applies it in the wrong situation.
 *   P3  explanatory knowledge. Wrong here and the reasoning is weaker, but
 *       nothing false is learned as fact.
 *
 * This lives in the domain rather than in the report script so that the rules
 * can be tested. They were wrong once in a way only a measurement showed: an
 * earlier version promoted anything citing a statute or touching a
 * safety-critical subject, which put 376 of 442 questions in P1. A queue that
 * size is not triage.
 */

export type Priority = 'P1' | 'P2' | 'P3';

/** A number followed by a unit that carries legal weight. */
export const LEGAL_NUMBER =
  /\d+(?:[.,]\d+)?\s*(?:km\/h|promille|mg\/l|mm|cm|kg|ton|månader?|år\b|tim(?:mar)?\b|minuter|meter\b|m\b|%|kr\b)/i;

/**
 * Subcategories whose content is set by regulation that changes on its own
 * schedule. Even a question with no number in it can go stale here.
 */
const VOLATILE_SUBCATEGORIES = new Set([
  'alkohol-gransvarden',
  'alkohol-effekter',
  // Added after batch 01. The narcotics rule is an absolute set by statute —
  // nolltolerans, with a carve-out for prescribed use — and the substance
  // schedules it points at are amended on their own schedule. But it contains
  // no digit, so LEGAL_NUMBER never fired and five questions about the one
  // subject in the bank with a zero-tolerance criminal rule sat in P3, below
  // questions about tyre tread. A legal absolute is not less checkable for
  // being spelled out in words.
  'droger-lakemedel',
  'dack-och-bromsar',
  'kontroll-besiktning',
  'registrering',
  'forsakring',
  'hastighetsgranser',
  'slapvagn',
  'lastning',
  'fordonsslag',
  'parkeringsregler',
  'parkeringsforbud',
]);

/** Words that mark a rule as conditional — the shape mistakes live in. */
const EXCEPTION_WORDS =
  /\b(utom|undantag|gäller inte|förutom|endast om|bara om|om inte|till skillnad|däremot|men inte)\b/i;

export function textOf(q: Question): string {
  return [
    q.prompt,
    ...q.answers.map((a) => a.text),
    q.shortExplanation,
    q.deepExplanation ?? '',
    q.ruleTested,
  ].join(' ');
}

/**
 * Why a question is in the queue, not just how urgently.
 *
 * A flat P1 tells a reviewer to look at 118 questions and nothing about how to
 * approach them. Checking a promille limit means opening a statute; checking an
 * inspection interval means checking whether the rule has changed this year;
 * checking a child-restraint rule means being careful because being wrong is
 * dangerous rather than merely incorrect. Those are different jobs and they are
 * done in different sittings.
 *
 * A question can carry several tags. The first one is what it is mostly about.
 */
export type P1Tag = 'P1-LAW' | 'P1-NUMERIC' | 'P1-EXCEPTION' | 'P1-ADMIN' | 'P1-SAFETY' | 'P1-VOLATILE';

export const TAG_MEANING: Record<P1Tag, string> = {
  'P1-LAW': 'Bygger på en författningstext som går att slå upp ordagrant.',
  'P1-NUMERIC': 'Innehåller ett tal som är rätt eller fel — gräns, mått, intervall.',
  'P1-EXCEPTION': 'Ett rättsligt tal som dessutom har undantag; både talet och undantaget måste stämma.',
  'P1-ADMIN': 'Administrativ regel — besiktning, registrering, försäkring, körkort.',
  'P1-SAFETY': 'Fel här kan leda till skada, inte bara till ett felaktigt svar.',
  'P1-VOLATILE': 'Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan.',
};

/**
 * Subcategories where a wrong answer is a safety matter, not only an error.
 *
 * Exported so a test can assert that every one of them actually reaches P1 on
 * its own. Being listed here only describes *how* to check a question, never
 * whether to — and `droger-lakemedel` sat here for months while nothing
 * promoted it into the queue at all.
 */
export const SAFETY_SUBCATEGORY_IDS = [
  'alkohol-gransvarden',
  'alkohol-effekter',
  'droger-lakemedel',
  'krocksakerhet',
  'barn-och-oskyddade',
  'oskyddade-trafikanter',
  'cykelpassage-overfart',
  'plankorsning-korning',
  'plankorsning-marken',
  'plankorsning-omkorning',
  'dack-och-bromsar',
  'vattenplaning',
  'halka',
  'trotthet',
] as const;

const SAFETY_SUBCATEGORIES = new Set<string>(SAFETY_SUBCATEGORY_IDS);

/**
 * Subcategories that are paperwork rather than driving.
 *
 * These names are checked against the taxonomy by a test. Four of them were
 * wrong when this model was first written — including `besiktning`, which is
 * actually `kontroll-besiktning` — so the rules simply never fired, and the
 * most date-sensitive questions in the bank were quietly missing from P1. A
 * misspelled id in a Set is invisible: it does not throw, it just never
 * matches.
 */
const ADMIN_SUBCATEGORIES = new Set([
  'kontroll-besiktning',
  'registrering',
  'forsakring',
  'fordonsslag',
  'drivmedel',
]);

const ADMIN_WORDS =
  /\b(besiktning|kontrollbesiktning|registrerings|försäkring|trafikförsäkring|körkortstillstånd|handledar|prövotid|fordonsskatt|avställ|påställ)\w*/i;

/**
 * What puts a question in P1 at all.
 *
 * Only three things do, and they were chosen by measurement rather than
 * instinct. A statute reference sounds like it should promote a question, but
 * 277 of 442 questions carry one; a safety-critical subject sounds like it
 * should too, but that is another 107. Promoting on those produced a P1 queue
 * of 376 out of 442, which is not triage — it is the bank with a label on it.
 *
 * So membership is: a legal number, a subject whose rules move on their own, or
 * an administrative rule. That is 130 questions, and it is a queue a person can
 * actually work through.
 */
const PROMOTING: readonly P1Tag[] = ['P1-NUMERIC', 'P1-VOLATILE', 'P1-ADMIN'];

/**
 * The rest of the tags describe *how* to check one, not whether to.
 *
 * P1-LAW means the answer can be looked up word for word in a statute, which
 * is a different afternoon's work from P1-VOLATILE, where the job is to find
 * out whether anything changed this year. P1-SAFETY means being wrong hurts
 * somebody, so it is worth a second reader.
 */
export function tagsOf(q: Question): P1Tag[] {
  const text = textOf(q);

  const numeric = LEGAL_NUMBER.test(text);
  const admin = ADMIN_SUBCATEGORIES.has(q.subcategory) || ADMIN_WORDS.test(text);
  const volatile = VOLATILE_SUBCATEGORIES.has(q.subcategory);

  const promoted: P1Tag[] = [];
  if (numeric) promoted.push('P1-NUMERIC');
  if (volatile) promoted.push('P1-VOLATILE');
  if (admin) promoted.push('P1-ADMIN');
  if (promoted.length === 0) return [];

  const statute = q.sourceReferences.some(
    (r) => r.sourceId && SOURCE_BY_ID.get(r.sourceId)?.kind === 'regulation',
  );
  const facets: P1Tag[] = [];
  if (statute) facets.push('P1-LAW');
  if (SAFETY_SUBCATEGORIES.has(q.subcategory)) facets.push('P1-SAFETY');
  // An exception only raises the stakes when there is a hard rule to except
  // from. On its own it is a P2 — a conditional rule, not a legal number.
  if (EXCEPTION_WORDS.test(text)) facets.push('P1-EXCEPTION');

  return [...promoted, ...facets];
}

export function priorityOf(q: Question): { priority: Priority; because: string; tags: P1Tag[] } {
  const tags = tagsOf(q);
  const promoter = tags.find((t) => PROMOTING.includes(t));
  if (promoter) return { priority: 'P1', because: TAG_MEANING[promoter], tags };

  const text = textOf(q);
  if (EXCEPTION_WORDS.test(text)) {
    return { priority: 'P2', because: 'Formulerar ett undantag eller en villkorad regel.', tags };
  }
  if (q.questionType === 'calculation') {
    return { priority: 'P2', because: 'Beräkning — ett fel i formeln syns inte utan kontroll.', tags };
  }
  return { priority: 'P3', because: 'Förklarande kunskap utan rättsligt tal.', tags };
}

/**
 * Batches: a sitting's worth of related questions.
 *
 * A reviewer works through one subject at a time with one set of sources open.
 * Jumping between promille limits and trailer weights wastes the effort of
 * having looked something up. Batches are subject-shaped for that reason, and
 * ordered so the ones needing a statute open come together.
 */
export const BATCHES: { id: string; title: string; subcategories: string[] }[] = [
  { id: '01', title: 'Alkohol, droger och läkemedel', subcategories: ['alkohol-gransvarden', 'alkohol-effekter', 'droger-lakemedel'] },
  { id: '02', title: 'Hastigheter', subcategories: ['hastighetsgranser', 'anpassad-hastighet'] },
  { id: '03', title: 'Däck, väglag och vinter', subcategories: ['dack-och-bromsar', 'vinterkorning', 'halka', 'vattenplaning'] },
  { id: '04', title: 'Last, släp och vikter', subcategories: ['lastning', 'slapvagn'] },
  { id: '05', title: 'Stanna, parkera och tidsregler', subcategories: ['parkeringsregler', 'parkeringsforbud', 'stannande-forbud'] },
  { id: '06', title: 'Belysning och mörker', subcategories: ['belysning-fordon', 'morkerkorning', 'ljusanvandning', 'mote-i-morker', 'dimma'] },
  { id: '07', title: 'Väjning, stopp och korsningar', subcategories: ['hogerregeln', 'vajningsplikt', 'stopplikt', 'utfartsregeln', 'huvudled', 'trafiksignal-korsning', 'cirkulationsplats', 'cirkulation-korfalt', 'polisens-tecken'] },
  { id: '08', title: 'Oskyddade trafikanter och passager', subcategories: ['oskyddade-trafikanter', 'cykelpassage-overfart', 'barn-och-oskyddade'] },
  { id: '09', title: 'Motorväg, landsväg och omkörning', subcategories: ['motorvag-regler', 'pafart-avfart', 'motortrafikled', 'landsvag', 'omkorningsregler', 'omkorningsforbud', 'mote', 'placering', 'avstand', 'korfalt-och-sving', 'korfaltsbyte'] },
  { id: '10', title: 'Järnvägskorsningar', subcategories: ['plankorsning-marken', 'plankorsning-korning', 'plankorsning-omkorning'] },
  { id: '11', title: 'Krocksäkerhet och bilbälte', subcategories: ['krocksakerhet'] },
  { id: '12', title: 'Vägmärken och vägmarkeringar', subcategories: ['varningsmarken', 'forbudsmarken', 'pabudsmarken', 'anvisningsmarken', 'vagmarkeringar', 'trafiksignaler', 'vagens-anvandning'] },
  { id: '13', title: 'Fordon, miljö och administration', subcategories: ['fordonsslag', 'kontroll-besiktning', 'registrering', 'forsakring', 'drivmedel', 'sparsam-korning', 'miljopaverkan'] },
  { id: '14', title: 'Risk, trötthet och olyckor', subcategories: ['riskbedomning', 'skymd-sikt', 'trotthet', 'stress-och-kanslor', 'djur-pa-vagen', 'grundregler', 'rattspraxis', 'reaktion-och-sinnen', 'attityd-och-grupptryck', 'korstrategi', 'nedsatt-formaga'] },
];

export const batchOfSubcategory = new Map<string, { id: string; title: string }>();
for (const b of BATCHES) {
  for (const sub of b.subcategories) batchOfSubcategory.set(sub, { id: b.id, title: b.title });
}
export const OTHER_BATCH = { id: '99', title: 'Övrigt' };

