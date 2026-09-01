import type { Scenario, ScenarioVehicle } from '@/domain/content/types';

/**
 * Scenario logic.
 *
 * Pure functions over the scenario model: resolving "what changes if…"
 * variants, judging an ordering attempt, and building the replay sequence.
 * None of it knows about React, so all of it is testable directly.
 */

/* ------------------------------------------------------------------ */
/* Variants                                                            */
/* ------------------------------------------------------------------ */

/**
 * Apply a variant on top of its base scenario.
 *
 * A variant patches a handful of fields rather than duplicating the whole
 * situation, so the layout, vehicles and accessibility scaffolding stay in one
 * place. An unknown id resolves to the base, which keeps a stale link from
 * breaking the page.
 */
export function resolveScenario(base: Scenario, variantId?: string | null): Scenario {
  if (!variantId) return base;
  const variant = base.variants?.find((v) => v.id === variantId);
  if (!variant) return base;

  return {
    ...base,
    ...variant.patch,
    // A variant may replace the signs, markings and overlays wholesale; when it
    // does not mention them, the base ones stay.
    signs: variant.patch.signs ?? base.signs,
    markings: variant.patch.markings ?? base.markings,
    overlays: variant.patch.overlays ?? base.overlays,
  };
}

/** Vehicles the learner is asked to order (parked cars are scenery). */
export function orderableVehicles(scenario: Scenario): ScenarioVehicle[] {
  return scenario.vehicles.filter((v) => v.intent !== 'stop');
}

/* ------------------------------------------------------------------ */
/* Ordering                                                            */
/* ------------------------------------------------------------------ */

export interface OrderStep {
  position: number;
  vehicleId: string;
  label: string;
  description: string;
  isEgo: boolean;
  /** Why this vehicle goes at this position. */
  explanation: string;
}

export interface OrderEvaluation {
  correct: boolean;
  /** Index of the first position that differs, or null when fully correct. */
  firstMistakeIndex: number | null;
  /** One sentence naming the specific mistake, or null when correct. */
  mistakeSummary: string | null;
  /** The correct sequence, with the reasoning for each step. */
  steps: OrderStep[];
}

function describe(scenario: Scenario, vehicleId: string): ScenarioVehicle | undefined {
  return scenario.vehicles.find((v) => v.id === vehicleId);
}

/** The correct sequence with its per-step reasoning. */
export function correctSteps(scenario: Scenario): OrderStep[] {
  const order = scenario.correctOrder ?? [];
  return order.flatMap((vehicleId, index) => {
    const vehicle = describe(scenario, vehicleId);
    if (!vehicle) return [];
    return [
      {
        position: index + 1,
        vehicleId,
        label: vehicle.label,
        description: vehicle.description,
        isEgo: Boolean(vehicle.isEgo),
        explanation: scenario.stepExplanations?.[index] ?? scenario.explanation,
      },
    ];
  });
}

/**
 * Judge an attempt.
 *
 * When it is wrong we name the *first* divergence rather than reporting a bare
 * "fel" — that is the point at which the learner's reasoning went astray, and
 * it is the only part they can act on.
 */
export function evaluateOrder(scenario: Scenario, chosen: readonly string[]): OrderEvaluation {
  const expected = scenario.correctOrder ?? [];
  const steps = correctSteps(scenario);

  if (chosen.length !== expected.length) {
    return {
      correct: false,
      firstMistakeIndex: chosen.length,
      mistakeSummary: 'Alla fordon är inte placerade i ordningen än.',
      steps,
    };
  }

  const firstMistakeIndex = expected.findIndex((id, i) => chosen[i] !== id);
  if (firstMistakeIndex === -1) {
    return { correct: true, firstMistakeIndex: null, mistakeSummary: null, steps };
  }

  const chosenVehicle = describe(scenario, chosen[firstMistakeIndex] ?? '');
  const expectedVehicle = describe(scenario, expected[firstMistakeIndex] ?? '');

  const ordinal =
    firstMistakeIndex === 0 ? 'först' : `som nummer ${firstMistakeIndex + 1}`;

  const mistakeSummary =
    chosenVehicle && expectedVehicle
      ? `Du valde ${chosenVehicle.label} ${ordinal}, men där ska ${expectedVehicle.label} köra.`
      : 'Ordningen stämmer inte.';

  return { correct: false, firstMistakeIndex, mistakeSummary, steps };
}

/* ------------------------------------------------------------------ */
/* Replay                                                              */
/* ------------------------------------------------------------------ */

export interface ReplayStep {
  index: number;
  vehicleId: string;
  label: string;
  /** Sentence read out and shown while this step plays. */
  caption: string;
  /** Whether the vehicle actually travels, or just gets highlighted. */
  hasPath: boolean;
}

/**
 * The replay sequence: the correct order, one vehicle at a time.
 *
 * Also used as the textual sequence for reduced motion and screen readers, so
 * the replay is never purely visual.
 */
export function buildReplaySequence(scenario: Scenario): ReplayStep[] {
  return correctSteps(scenario).map((step, index) => {
    const vehicle = describe(scenario, step.vehicleId);
    return {
      index,
      vehicleId: step.vehicleId,
      label: step.label,
      caption: step.explanation,
      hasPath: Boolean(vehicle?.path && vehicle.path.length > 1),
    };
  });
}

/**
 * Progress for each vehicle at a given point in the replay.
 *
 * Vehicles that already went are left at the end of their path; the active one
 * is partway along; the rest have not moved. Returning a plain map keeps the
 * renderer dumb.
 */
export function replayProgressAt(
  sequence: readonly ReplayStep[],
  activeIndex: number,
  activeProgress: number,
): Record<string, number> {
  const progress: Record<string, number> = {};
  sequence.forEach((step, index) => {
    if (index < activeIndex) progress[step.vehicleId] = 1;
    else if (index === activeIndex) progress[step.vehicleId] = Math.max(0, Math.min(1, activeProgress));
    else progress[step.vehicleId] = 0;
  });
  return progress;
}

/* ------------------------------------------------------------------ */
/* Risk spotting                                                       */
/* ------------------------------------------------------------------ */

export function evaluateHotspot(
  scenario: Scenario,
  hotspotId: string | null,
): { correct: boolean; explanation: string | null } {
  if (!hotspotId) return { correct: false, explanation: null };
  const hotspot = scenario.hotspots?.find((h) => h.id === hotspotId);
  if (!hotspot) return { correct: false, explanation: null };
  return { correct: hotspot.isRisk, explanation: hotspot.explanation };
}
