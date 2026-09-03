import { describe, expect, it } from 'vitest';
import { ALL_QUESTIONS } from '@/content/questions';
import { SOURCE_IMAGES } from '@/content/source-images';
import { ROAD_SIGNS } from '@/content/road-signs';

/**
 * What a question reads out before it has been answered.
 *
 * A learner who cannot see the picture is given the alt text and the long
 * description instead, and gets them *before* choosing. So the standard those
 * texts have to meet is parity: they may say everything a sighted learner can
 * see, and they may not say anything a sighted learner would have to work out.
 *
 * That distinction is the whole thing, and it is not the same as "does not
 * mention the answer". A photograph of a road covered in packed snow may be
 * described as a road covered in packed snow even when the answer is that the
 * grip is poor, because the snow is simply visible. What is not allowed is a
 * conclusion smuggled into a factual field — and that is exactly what happened:
 * `snotackt-skogsvag` ended its description with "det går inte att se var
 * körbanan slutar och vägkanten börjar", which is a judgement, and is word for
 * word the correct answer to the question that used it.
 *
 * The check is therefore on *verbatim phrases* rather than on shared
 * vocabulary. A four-word run from the correct answer appearing in the text a
 * learner hears, and not already in the question's own prompt, is either a leak
 * or a case where the picture genuinely shows that phrase. There are three of
 * the latter and they are listed, with the reason, so a fourth has to be
 * argued for rather than absorbed.
 */

const PHRASE_LENGTH = 4;

/**
 * Overlaps that are parity rather than leaks.
 *
 * Keyed by question, with the reason the sighted learner has the same thing.
 */
const ALLOWED: Record<string, string> = {
  // Asks how a warning sign is recognised, over a picture of one. The shape and
  // the colours are the evidence; a sighted learner reads them straight off the
  // sign, so describing them is what makes the question answerable at all.
  'vag-001': 'gul triangel med röd ram',
  // "Öppningen rymmer bara ett fordon i taget" describes the arch. The answer
  // adds what to *do* about it — slow down, be ready to stop — and that half
  // appears nowhere in the description.
  'bl3-003': 'passagen rymmer bara ett fordon',
  // The road surface is packed snow and ice in the photograph. The answer is
  // that grip is therefore poor, which is the inference the question asks for.
  'bl3-004': 'vägbanan är packad snö och is',
};

const imageById = new Map(SOURCE_IMAGES.map((i) => [i.id, i]));
const signById = new Map(ROAD_SIGNS.map((s) => [s.id, s]));

const normalise = (text: string) =>
  text
    .toLocaleLowerCase('sv')
    .replace(/[^a-zåäö0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

function phrases(text: string, length: number): string[] {
  const words = normalise(text).split(' ').filter(Boolean);
  const out: string[] = [];
  for (let i = 0; i + length <= words.length; i += 1) {
    out.push(words.slice(i, i + length).join(' '));
  }
  return out;
}

/** Everything a screen reader is given while the question is still open. */
function spokenWhileUnanswered(question: (typeof ALL_QUESTIONS)[number]): string[] {
  const parts: string[] = [];

  if (question.sourceImageId) {
    const image = imageById.get(question.sourceImageId);
    if (image) {
      parts.push(image.quizSafeAltText ?? image.altText);
      parts.push(
        image.quizSafeDescription ?? image.quizSafeAltText ?? image.longDescription,
      );
    }
  }

  const illustration = question.image?.illustration;
  const drawn = illustration ? signById.get(illustration) : undefined;
  if (drawn) parts.push(drawn.quizSafeAltText ?? drawn.altText);
  if (question.image?.alt) parts.push(question.image.alt);
  if (question.accessibilityText) parts.push(question.accessibilityText);

  const assembled = [
    question.signAssembly?.mainSignId,
    ...(question.signAssembly?.plateIds ?? []),
  ];
  for (const id of assembled) {
    const sign = id ? signById.get(id) : undefined;
    if (sign) parts.push(sign.quizSafeAltText ?? sign.altText);
  }

  return parts;
}

const illustrated = ALL_QUESTIONS.filter((q) => spokenWhileUnanswered(q).length > 0);

describe('what a question reads out before it is answered', () => {
  it('has illustrated questions to check', () => {
    expect(illustrated.length).toBeGreaterThan(80);
  });

  it('never speaks the correct answer aloud', () => {
    const leaks: string[] = [];

    for (const question of illustrated) {
      const spoken = normalise(spokenWhileUnanswered(question).join(' '));
      const inPrompt = new Set(phrases(question.prompt, PHRASE_LENGTH));
      const correct = question.answers.find((a) => a.id === question.correctAnswerId);
      if (!correct) continue;

      const hits = phrases(correct.text, PHRASE_LENGTH).filter(
        (phrase) => spoken.includes(phrase) && !inPrompt.has(phrase),
      );
      if (hits.length === 0) continue;

      // Overlapping runs shift word by word, so several hits describe one
      // span. The exception names that span; every hit has to sit inside it.
      const allowed = ALLOWED[question.id];
      if (allowed && hits.every((hit) => normalise(allowed).includes(hit))) continue;

      leaks.push(`${question.id}: "${hits.join('", "')}"\n    Rätt svar: ${correct.text}`);
    }

    expect(leaks, `\n${leaks.join('\n')}\n`).toEqual([]);
  });

  it('keeps the allowlist honest — every entry still overlaps', () => {
    // An entry that no longer matches means the text was rewritten and the
    // exception is now just a comment nobody will read. Removing it is the
    // point of checking.
    for (const [questionId, phrase] of Object.entries(ALLOWED)) {
      const question = ALL_QUESTIONS.find((q) => q.id === questionId);
      expect(question, `okänd fråga ${questionId} i undantagslistan`).toBeDefined();
      const spoken = normalise(spokenWhileUnanswered(question!).join(' '));
      // The span is written as it reads in the answer; the picture's own
      // wording differs by a word or two ("öppningen" for "passagen"). Any
      // shared run of PHRASE_LENGTH words is enough to show the exception is
      // still doing work.
      const stillOverlaps = phrases(phrase, PHRASE_LENGTH).some((run) => spoken.includes(run));
      expect(stillOverlaps, `${questionId}: undantaget behövs inte längre`).toBe(true);
    }
  });

  it('describes every illustrated question for someone who cannot see it', () => {
    for (const question of illustrated) {
      const spoken = spokenWhileUnanswered(question).join(' ').trim();
      expect(spoken.length, question.id).toBeGreaterThan(20);
    }
  });
});

describe('quiz-safe overrides', () => {
  it('only exist where they differ from the normal text', () => {
    // A quiz-safe variant identical to the real one is dead weight that reads
    // as though somebody checked.
    for (const image of SOURCE_IMAGES) {
      if (image.quizSafeAltText) {
        expect(image.quizSafeAltText, image.id).not.toBe(image.altText);
      }
      if (image.quizSafeDescription) {
        expect(image.quizSafeDescription, image.id).not.toBe(image.longDescription);
      }
    }
    for (const sign of ROAD_SIGNS) {
      if (sign.quizSafeAltText) {
        expect(sign.quizSafeAltText, sign.id).not.toBe(sign.altText);
      }
    }
  });

  it('still describe the picture rather than saying nothing', () => {
    for (const image of SOURCE_IMAGES) {
      if (image.quizSafeAltText) {
        expect(image.quizSafeAltText.trim().length, image.id).toBeGreaterThan(20);
      }
      if (image.quizSafeDescription) {
        expect(image.quizSafeDescription.trim().length, image.id).toBeGreaterThan(80);
      }
    }
  });
});
