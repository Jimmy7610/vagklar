/** Content-side domain types: questions, categories, lessons, scenarios. */

/**
 * Where a question stands in the review pipeline.
 *
 * `draft`    — written, not yet read by anyone else.
 * `reviewed` — read and accepted internally. This is where seed content sits.
 * `verified` — checked against named sources by a named person on a date.
 * `rejected` — failed review. Kept so the reason survives, never shown.
 * `retired`  — was live, withdrawn. Kept so saved progress still resolves.
 *
 * `reviewed` is deliberately not a synonym for correct. Only `verified` makes
 * that claim, and the validator refuses it without the evidence to back it up.
 * See docs/VERIFICATION-WORKFLOW.md.
 */
export type QuestionStatus = 'draft' | 'reviewed' | 'verified' | 'rejected' | 'retired';

/** Statuses a learner may be shown. Everything else stays out of the bank. */
export const LEARNER_VISIBLE_STATUSES: readonly QuestionStatus[] = ['reviewed', 'verified'];

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
  /**
   * Id into the source registry (src/content/sources.ts). Preferred over
   * repeating publisher, edition and rights-holder strings here — the registry
   * owns those, so attribution stays consistent and editions are updated in
   * one place.
   */
  sourceId?: string;
  /** Pages in the referenced source that support the statement. */
  sourcePages?: number[];
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
  /**
   * Human sign-off. Set only by a person who checked the statement against the
   * sources listed in `verificationSourceIds` — never by a generator, and never
   * because a model agreed with itself.
   */
  verifiedAt?: string | null;
  /** Who signed off. A name or initials, so the claim has an owner. */
  verifiedBy?: string | null;
  /** Ids into the source registry that the verifier actually opened. */
  verificationSourceIds?: string[];
  /**
   * Fingerprint of the material content at the moment of sign-off, from
   * `contentFingerprint`. Verification is a claim about a specific wording; if
   * the wording changes afterwards the claim is about something else, and the
   * validator says so rather than letting it stand.
   */
  verifiedFingerprint?: string;
  /**
   * Which edition of each source the verifier actually worked from, keyed by
   * source id — `{ 'teoribok-2026-1': '2026-1' }`. A new edition of the book
   * does not make the answer wrong, but it does mean nobody has checked the
   * answer against the book that is now cited.
   */
  verifiedAgainstEditions?: Record<string, string>;
  /**
   * Reviewer's note: why it was rejected, or what still needs checking.
   *
   * This is the record of the two decisions that are not an approval. A
   * reviewer who reads a question and wants it changed leaves the status at
   * `reviewed` and writes here; one who rejects it sets `rejected` and writes
   * here. Either way the note needs an owner and a date — an unsigned "needs
   * work" is a message from nobody, and six months later nobody knows whether
   * it was acted on.
   */
  reviewNotes?: string;
  /**
   * Who made a review decision short of approval, and when.
   *
   * Kept apart from `verifiedBy` on purpose: that field is a claim that
   * somebody checked the content against named sources and stands behind it.
   * Rejecting a question, or asking for a change, is a different and weaker
   * act, and blurring the two would let a rejection read as a verification in
   * any code that only looks for a name.
   */
  reviewedBy?: string | null;
  image?: QuestionImage;
  /**
   * Id in the source-image registry (src/content/source-images.ts). Used when
   * the question genuinely needs a photograph of a real situation. Attribution
   * and the accessible description come from the registry, never from here.
   */
  sourceImageId?: string;
  /**
   * Id in the original-visual registry (src/content/original-visuals.ts).
   * A Vägklar-drawn diagram rather than licensed material — kept in its own
   * field so the two can never be confused for one another, in the renderer or
   * in the credit line.
   */
  originalVisualId?: string;
  /**
   * A main sign with the supplementary plates hanging under it.
   *
   * Its own field rather than a sign id, because a combination is a different
   * question from a sign: the plate narrows the rule, and what is being asked
   * is what the two mean together.
   */
  signAssembly?: { mainSignId: string; plateIds: string[] };
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
  | 'jarnvag'
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
  /**
   * A group of road signs from the registry, shown as a grid the learner can
   * open one at a time. Signs are named by id so the meanings, codes and
   * confusion pairs come from one place.
   */
  | { kind: 'signGrid'; title?: string; signIds: string[] }
  /** Two signs side by side that are genuinely confused with each other. */
  | { kind: 'signCompare'; title: string; leftId: string; rightId: string; note: string }
  /** A group of road markings from the marking registry. */
  | { kind: 'markingGrid'; title?: string; markingIds: string[] }
  /** Two markings side by side that are genuinely confused with each other. */
  | {
      kind: 'markingCompare';
      title: string;
      leftId: string;
      rightId: string;
      note: string;
    }
  | { kind: 'rule'; title: string; text: string }
  | { kind: 'list'; title?: string; items: string[] }
  | { kind: 'memory'; text: string }
  | { kind: 'example'; title: string; text: string }
  | { kind: 'illustration'; illustration: string; caption?: string; alt: string }
  | {
      kind: 'sourceImage';
      /** Id in the source-image registry. */
      imageId: string;
      /** "Vad ska du lägga märke till?" — asked before the learner looks. */
      prompt?: string;
      /** Overrides the registry caption when the lesson needs a sharper point. */
      caption?: string;
    }
  | { kind: 'signCatalogue'; title?: string }
  | {
      kind: 'signInContext';
      signId: string;
      /** A licensed photograph in which that sign is genuinely visible. */
      imageId: string;
      /** What to look for. Never states what the sign means. */
      notice: string;
    }
  | {
      kind: 'markingInContext';
      markingId: string;
      /** A licensed photograph in which that marking is genuinely visible. */
      imageId: string;
      /** What to look for. Never states what the marking means. */
      notice: string;
    }
  | {
      kind: 'signAssembly';
      mainSignId: string;
      plateIds: string[];
      /** Asked before the learner looks. */
      prompt?: string;
      /** Overrides the composed interpretation. */
      caption?: string;
    }
  | {
      kind: 'originalVisual';
      /** Id in the original-visual registry. */
      visualId: string;
      /** Asked before the learner looks at the drawing. */
      prompt?: string;
      /** Overrides the registry caption. */
      caption?: string;
    }
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
  /**
   * Curriculum chapters (src/content/curriculum/curriculum.ts) this lesson
   * teaches. The theory school and the coverage report therefore answer the
   * same question — "which part of the syllabus is this?" — from one map
   * rather than two hand-kept lists.
   */
  curriculumChapterIds: string[];
  order: number;
}


/* ==========================================================================
   Scenario Lab
   --------------------------------------------------------------------------
   A scenario is data, not code. Everything the stage draws — roads, markings,
   signs, vehicles, overlays — and everything the learner interacts with is
   described here, in a single 100×100 coordinate space with y pointing down
   and heading 0 pointing north. New situations are authored by adding data;
   no new drawing code is required.
   ========================================================================== */

export type ScenarioLayout =
  | 'crossroads'
  | 't-junction'
  | 'roundabout'
  | 'street-scene'
  | 'motorway-merge'
  | 'railway-crossing';

export type ScenarioVehicleRole =
  | 'car'
  | 'truck'
  | 'bus'
  | 'bicycle'
  | 'pedestrian'
  | 'tram'
  | 'emergency';

export type ScenarioIntent = 'straight' | 'left' | 'right' | 'stop';

export interface ScenarioPoint {
  x: number;
  y: number;
}

export interface ScenarioVehicle {
  id: string;
  /** Short badge shown in the scene and the answer list: "A", "B", "C". */
  label: string;
  /** Full description, used by assistive technology and the answer list. */
  description: string;
  role: ScenarioVehicleRole;
  /** Position in the 100×100 space. */
  x: number;
  y: number;
  /** Direction of travel in degrees; 0 = north. */
  heading: number;
  intent: ScenarioIntent;
  /** True for the vehicle the learner is driving. Marked with a label, not just colour. */
  isEgo?: boolean;
  /**
   * Waypoints the vehicle follows during replay, starting from its position.
   * Omitted for vehicles that stay put.
   */
  path?: ScenarioPoint[];
}

/** A road sign placed in the scene, drawn from the shared sign set. */
export interface ScenarioSign {
  id: string;
  /** Key into ui/illustrations/RoadSign. */
  sign: string;
  x: number;
  y: number;
  /** Named so it can be read aloud and listed in the description. */
  label: string;
}

/** Road markings drawn on top of the base layout. */
export type ScenarioMarkingKind =
  | 'stop-line'
  | 'yield-line'
  | 'crossing'
  | 'cycle-crossing'
  | 'arrow';

export interface ScenarioMarking {
  id: string;
  kind: ScenarioMarkingKind;
  x: number;
  y: number;
  /** Degrees; 0 means the marking runs east–west. */
  rotation?: number;
  /** Length along the road, in scene units. */
  length?: number;
}

/**
 * Pedagogical overlays, shown only when the learner asks for "Visa reglerna".
 * They explain *why* the order is what it is.
 */
export type ScenarioOverlay =
  /** `from` must give way to `to`. Drawn as an arrow between them. */
  | { kind: 'yield'; id: string; from: string; to: string; label: string }
  /** The point where two paths would meet. */
  | { kind: 'conflict'; id: string; x: number; y: number; label: string }
  /** Highlights a vehicle's intended path. */
  | { kind: 'path'; id: string; vehicleId: string; label: string }
  /** A free-standing annotation. */
  | { kind: 'note'; id: string; x: number; y: number; text: string };

export type ScenarioKind = 'order-of-passage' | 'risk-spotting' | 'placement';

export interface ScenarioHotspot {
  id: string;
  label: string;
  x: number;
  y: number;
  radius: number;
  isRisk: boolean;
  explanation: string;
}

/**
 * A variant changes one condition of the base scenario — "what if this became
 * a main road?" — by patching it rather than duplicating it.
 */
export interface ScenarioVariant {
  id: string;
  /** Chip label: "Om vägen blir huvudled". */
  label: string;
  /** The full question posed to the learner. */
  question: string;
  /** What changes, merged over the base scenario. */
  patch: Partial<
    Pick<
      Scenario,
      | 'prompt'
      | 'correctOrder'
      | 'explanation'
      | 'stepExplanations'
      | 'overlays'
      | 'signs'
      | 'markings'
      | 'accessibilityText'
      | 'ruleTested'
    >
  >;
}

export interface Scenario {
  id: string;
  title: string;
  categoryId: CategoryId;
  subcategory: string;
  difficulty: Difficulty;
  kind: ScenarioKind;
  prompt: string;
  layout: ScenarioLayout;
  vehicles: ScenarioVehicle[];
  signs?: ScenarioSign[];
  markings?: ScenarioMarking[];
  overlays?: ScenarioOverlay[];
  hotspots?: ScenarioHotspot[];
  /** For order-of-passage: the correct sequence of vehicle ids. */
  correctOrder?: string[];
  ruleTested: string;
  explanation: string;
  /** One sentence per position in `correctOrder`, explaining that step. */
  stepExplanations?: string[];
  /** Complete description of the situation, so the task is solvable unseen. */
  accessibilityText: string;
  variants?: ScenarioVariant[];
  sourceReferences: SourceReference[];
  status: QuestionStatus;
}
