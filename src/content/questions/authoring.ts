import type {
  CategoryId,
  Difficulty,
  Question,
  QuestionAnswer,
  QuestionImage,
  QuestionStatus,
  QuestionType,
  ScenarioType,
  SourceReference,
} from '@/domain/content/types';

/**
 * Authoring helpers for the seed question bank.
 *
 * Authors always write the correct alternative first. The builder then applies
 * a deterministic, id-seeded shuffle, so option position carries no signal and
 * the presented order is still stable across sessions and devices.
 */

export interface AuthoredAnswer {
  text: string;
  correct: boolean;
  misconceptionId?: string;
}

/** The correct alternative. */
export function ok(text: string): AuthoredAnswer {
  return { text, correct: true };
}

/** An incorrect alternative, optionally tagged with the misconception it reveals. */
export function no(text: string, misconceptionId?: string): AuthoredAnswer {
  return misconceptionId ? { text, correct: false, misconceptionId } : { text, correct: false };
}

/** Trafikförordningen reference. Seed content is authored, not yet human-verified. */
export function trf(reference: string): SourceReference {
  return {
    name: 'Trafikförordningen (1998:1276)',
    reference,
    verifiedAt: null,
    ruleVersion: '2024',
  };
}

/** Vägmärkesförordningen reference. */
export function vmf(reference: string): SourceReference {
  return {
    name: 'Vägmärkesförordningen (2007:90)',
    reference,
    verifiedAt: null,
    ruleVersion: '2024',
  };
}

/** A reference to a general body of knowledge rather than a specific paragraph. */
export function general(name: string): SourceReference {
  return { name, verifiedAt: null };
}

export interface AuthoredQuestion {
  id: string;
  category: CategoryId;
  subcategory: string;
  difficulty: Difficulty;
  ruleTested: string;
  prompt: string;
  answers: AuthoredAnswer[];
  short: string;
  deep?: string;
  memory?: string;
  sources: SourceReference[];
  type?: QuestionType;
  scenarioType?: ScenarioType;
  image?: QuestionImage;
  tags?: string[];
  estimatedTimeSec?: number;
  accessibilityText?: string;
  related?: string[];
  status?: QuestionStatus;
  version?: number;
}

/** Deterministic 32-bit hash of a string (FNV-1a). */
export function hashString(value: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

/** Small deterministic PRNG (mulberry32). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher–Yates using a supplied PRNG. Pure: returns a new array. */
export function shuffleWith<T>(items: readonly T[], random: () => number): T[] {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const a = result[i];
    const b = result[j];
    if (a === undefined || b === undefined) continue;
    result[i] = b;
    result[j] = a;
  }
  return result;
}

const OPTION_IDS = ['a', 'b', 'c', 'd', 'e', 'f'];

const DEFAULT_TIME_BY_DIFFICULTY: Record<Difficulty, number> = { 1: 22, 2: 32, 3: 45 };

/** Build a runtime `Question` from an authored seed. */
export function buildQuestion(seed: AuthoredQuestion): Question {
  const correctCount = seed.answers.filter((a) => a.correct).length;
  if (correctCount !== 1) {
    throw new Error(`Question ${seed.id} must have exactly one correct answer`);
  }

  const shuffled = shuffleWith(seed.answers, mulberry32(hashString(seed.id)));

  const answers: QuestionAnswer[] = shuffled.map((answer, index) => {
    const id = OPTION_IDS[index] ?? `opt${index}`;
    return answer.misconceptionId
      ? { id, text: answer.text, misconceptionId: answer.misconceptionId }
      : { id, text: answer.text };
  });

  const correctIndex = shuffled.findIndex((a) => a.correct);
  const correctAnswerId = answers[correctIndex]?.id;
  if (!correctAnswerId) throw new Error(`Question ${seed.id} lost its correct answer`);

  const misconceptions = Array.from(
    new Set(seed.answers.flatMap((a) => (a.misconceptionId ? [a.misconceptionId] : []))),
  );

  const question: Question = {
    id: seed.id,
    version: seed.version ?? 1,
    status: seed.status ?? 'reviewed',
    category: seed.category,
    subcategory: seed.subcategory,
    difficulty: seed.difficulty,
    questionType: seed.type ?? 'multiple-choice',
    ruleTested: seed.ruleTested,
    misconceptions,
    prompt: seed.prompt,
    answers,
    correctAnswerId,
    shortExplanation: seed.short,
    sourceReferences: seed.sources,
    lastReviewedAt: null,
    estimatedTimeSec: seed.estimatedTimeSec ?? DEFAULT_TIME_BY_DIFFICULTY[seed.difficulty],
  };

  if (seed.deep) question.deepExplanation = seed.deep;
  if (seed.memory) question.memoryRule = seed.memory;
  if (seed.scenarioType) question.scenarioType = seed.scenarioType;
  if (seed.image) question.image = seed.image;
  if (seed.tags) question.tags = seed.tags;
  if (seed.accessibilityText) question.accessibilityText = seed.accessibilityText;
  if (seed.related) question.relatedQuestionIds = seed.related;

  return question;
}

export function buildQuestions(seeds: AuthoredQuestion[]): Question[] {
  return seeds.map(buildQuestion);
}

/** Convenience for road-sign questions rendered with a built-in vector sign. */
export function sign(illustration: string, alt: string): QuestionImage {
  return { illustration, alt, aspectRatio: 1 };
}
