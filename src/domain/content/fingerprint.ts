import type { Question } from './types';

/**
 * A fingerprint of everything about a question that a verifier signed off on.
 *
 * Verification is a claim about a moment: on this date, this person checked
 * this wording against these pages. Edit the wording afterwards and the claim
 * silently becomes a claim about something else — which is the quiet way a
 * bank full of "verified" stops meaning anything.
 *
 * So the fingerprint covers the **material** content and nothing else. Change
 * the prompt, an answer, which answer is correct, the rule under test, the
 * explanations or the source references, and verification lapses. Change the
 * tags, the estimated time, the difficulty or the review notes, and it does
 * not — those do not alter what was checked.
 *
 * It is a hash, not a database. Nothing is stored anywhere except a short
 * string on the question itself, so this works the same in a checkout as it
 * does in a build.
 */

/** FNV-1a, 32-bit, rendered as eight hex digits. Same function the bank uses. */
function hash(value: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

/**
 * The parts of a question a verifier is signing off on.
 *
 * Answers are taken in their authored order together with which one is
 * correct, so reordering them alone does not lapse verification but changing
 * the correct one does.
 */
export function materialContent(q: Question): string {
  const answers = q.answers
    .map((a) => `${a.id === q.correctAnswerId ? '+' : '-'}${a.text}`)
    .join('');

  const sources = q.sourceReferences
    .map((r) =>
      [r.sourceId ?? r.name, r.reference ?? '', (r.sourcePages ?? []).join(',')].join(''),
    )
    .join('');

  return [
    q.prompt,
    answers,
    q.ruleTested,
    q.shortExplanation,
    q.deepExplanation ?? '',
    sources,
  ].join('');
}

export function contentFingerprint(q: Question): string {
  return hash(materialContent(q));
}
