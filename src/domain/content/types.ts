/** Content-side domain types: questions, categories, lessons, scenarios. */

export type QuestionStatus = 'draft' | 'reviewed' | 'verified' | 'retired';

/** 1 = easy, 2 = medium, 3 = hard. */
export type Difficulty = 1 | 2 | 3;

export type QuestionType =
  | 'multiple-choice'
  | 'image-scenario'
  | 'road-sign'
  | 'calculation'
  | 'situational-judgement'
  | 'ordering'
  | 'risk-spotting'
  | 'interactive-placement';

/**
 * Question types that are answered with a single choice from a list.
 * Everything else is delivered through the Scenario Lab renderer.
 */
export const SINGLE_CHOICE_TYPES: readonly QuestionType[] = [
  'multiple-choice',
  'image-scenario',
  'road-sign',
  'calculation',
  'situational-judgement',
];

export type ScenarioType =
  | 'intersection'
  | 'roundabout'
  | 'motorway'
  | 'urban-street'
  | 'rural-road'
  | 'parking'
  | 'night'
  | 'weather';

/**
 * Where a rule statement comes from. Content can be audited later and
 * re-verified when regulations change.
 */
export interface SourceReference {
  /** e.g. "Trafikförordningen (1998:1276)" */
  name: string;
  /** e.g. "3 kap. 21 §" */
  reference?: string;
  url?: string;
  /** ISO date of the last human verification. `null` = not yet verified. */
  verifiedAt: string | null;
  /** Which version/edition of the rule the statement was checked against. */
  ruleVersion?: string;
}

export interface QuestionAnswer {
  id: string;
  text: string;
  /**
   * The misconception a learner reveals by choosing this (incorrect) answer.
   * This is what makes "Mina misstag" pattern-aware rather than a list of
   * wrong answers.
   */
  misconceptionId?: string;
}

export interface QuestionImage {
  /** Path relative to the app base, or an inline illustration key. */
  src?: string;
  /** Built-in vector illustration identifier (see ui/illustrations). */
  illustration?: string;
  alt: string;
  aspectRatio?: number;
}

export interface Question {
  id: string;
  version: number;
  status: QuestionStatus;
  category: CategoryId;
  subcategory: string;
  difficulty: Difficulty;
  questionType: QuestionType;
  scenarioType?: ScenarioType;
  /** Human-readable identifier of the rule under test, e.g. "Högerregeln". */
  ruleTested: string;
  /** Misconceptions this item is designed to expose. */
  misconceptions: string[];
  prompt: string;
  answers: QuestionAnswer[];
  correctAnswerId: string;
  shortExplanation: string;
  deepExplanation?: string;
  memoryRule?: string;
  sourceReferences: SourceReference[];
  lastReviewedAt?: string | null;
  image?: QuestionImage;
  relatedQuestionIds?: string[];
  tags?: string[];
  /** Seconds a well-prepared learner is expected to need. */
  estimatedTimeSec: number;
  /** Extra description read by assistive tech when the prompt relies on an image. */
  accessibilityText?: string;
}

export interface Misconception {
  id: string;
  /** Short label shown in "Mina misstag", e.g. "Utfartsregeln vs högerregeln". */
  label: string;
  /** One sentence explaining the confusion. */
  description: string;
  /** The correct mental model. */
  correction: string;
  subcategory: string;
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: CategoryId;
  /** Relative importance inside its category (used for weighting). */
  weight: number;
}

export type CategoryId =
  | 'trafikregler'
  | 'vagmarken'
  | 'hastighet'
  | 'korsningar'
  | 'parkering'
  | 'motorvag'
  | 'omkorning'
  | 'risker'
  | 'alkohol'
  | 'trotthet'
  | 'morker'
  | 'halka'
  | 'miljo'
  | 'fordonet'
  | 'last'
  | 'manniskan';

export interface Category {
  id: CategoryId;
  name: string;
  /** One line, shown under the category name. */
  summary: string;
  /** Icon key from ui/icons. */
  icon: string;
  /**
   * Share of a simulated exam this area should occupy. Values are relative;
   * the exam builder normalises them.
   */
  examWeight: number;
  subcategories: Subcategory[];
}

/* ---- Theory school ------------------------------------------------------ */

export type LessonBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'rule'; title: string; text: string }
  | { kind: 'list'; title?: string; items: string[] }
  | { kind: 'memory'; text: string }
  | { kind: 'example'; title: string; text: string }
  | { kind: 'illustration'; illustration: string; caption?: string; alt: string }
  | { kind: 'warning'; text: string };

export interface Lesson {
  id: string;
  categoryId: CategoryId;
  subcategoryIds: string[];
  title: string;
  summary: string;
  /** Minutes of reading. */
  estimatedMinutes: number;
  blocks: LessonBlock[];
  /** Ids of questions used as the end-of-lesson check. */
  checkQuestionIds: string[];
  order: number;
}

/* ---- Scenario Lab ------------------------------------------------------- */

export interface ScenarioVehicle {
  id: string;
  label: string;
  /** Grid position in the 100×100 scenario coordinate space. */
  x: number;
  y: number;
  /** Direction of travel in degrees; 0 = north/up. */
  heading: number;
  /** Where the vehicle intends to go. */
  intent: 'straight' | 'left' | 'right';
  kind: 'car' | 'truck' | 'bicycle' | 'pedestrian' | 'tram' | 'emergency';
  /** True for the vehicle the learner is driving. */
  isEgo?: boolean;
}

export interface ScenarioHotspot {
  id: string;
  label: string;
  x: number;
  y: number;
  radius: number;
  isRisk: boolean;
  explanation: string;
}

export interface Scenario {
  id: string;
  title: string;
  categoryId: CategoryId;
  subcategory: string;
  difficulty: Difficulty;
  kind: 'order-of-passage' | 'risk-spotting' | 'placement';
  prompt: string;
  /** Layout key rendered by the scenario stage. */
  layout: 'crossroads' | 't-junction' | 'roundabout' | 'street-scene';
  vehicles: ScenarioVehicle[];
  hotspots?: ScenarioHotspot[];
  /** For order-of-passage: the correct sequence of vehicle ids. */
  correctOrder?: string[];
  ruleTested: string;
  explanation: string;
  stepExplanations?: string[];
  accessibilityText: string;
  sourceReferences: SourceReference[];
  status: QuestionStatus;
}
