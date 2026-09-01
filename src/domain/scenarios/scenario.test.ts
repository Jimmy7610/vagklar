import { describe, expect, it } from 'vitest';
import { SCENARIOS, getScenario } from '@/content/scenarios';
import {
  buildReplaySequence,
  correctSteps,
  evaluateHotspot,
  evaluateOrder,
  orderableVehicles,
  replayProgressAt,
  resolveScenario,
} from './scenario';
import { pointAtProgress } from '@/ui/illustrations/ScenarioStage';

const hogerregeln = getScenario('sc-hogerregeln-1')!;
const risk = getScenario('sc-risk-stadsgata')!;

describe('scenario content integrity', () => {
  it('gives every scenario a unique id and a full text description', () => {
    const ids = SCENARIOS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const scenario of SCENARIOS) {
      expect(scenario.accessibilityText.length, scenario.id).toBeGreaterThan(60);
      expect(scenario.explanation.length, scenario.id).toBeGreaterThan(30);
    }
  });

  it('labels every vehicle and describes it in words, never by colour alone', () => {
    for (const scenario of SCENARIOS) {
      for (const vehicle of scenario.vehicles) {
        expect(vehicle.label.length, `${scenario.id}/${vehicle.id}`).toBeGreaterThan(0);
        expect(vehicle.description.length, `${scenario.id}/${vehicle.id}`).toBeGreaterThan(10);
      }
      // Exactly one ego vehicle, and it is described as such.
      const egos = scenario.vehicles.filter((v) => v.isEgo);
      expect(egos, scenario.id).toHaveLength(1);
      expect(egos[0]!.description.toLowerCase()).toContain('din bil');
    }
  });

  it('gives ordering scenarios a correct order covering every orderable vehicle', () => {
    for (const scenario of SCENARIOS) {
      if (scenario.kind !== 'order-of-passage') continue;
      const orderable = orderableVehicles(scenario).map((v) => v.id).sort();
      const order = [...(scenario.correctOrder ?? [])].sort();
      expect(order, scenario.id).toEqual(orderable);
    }
  });

  it('explains every step of every correct order', () => {
    for (const scenario of SCENARIOS) {
      if (scenario.kind !== 'order-of-passage') continue;
      const steps = correctSteps(scenario);
      expect(steps.length, scenario.id).toBe(scenario.correctOrder?.length);
      for (const step of steps) {
        expect(step.explanation.length, `${scenario.id}/${step.vehicleId}`).toBeGreaterThan(20);
      }
    }
  });

  it('only references real vehicles from overlays', () => {
    for (const scenario of SCENARIOS) {
      const ids = new Set(scenario.vehicles.map((v) => v.id));
      for (const overlay of scenario.overlays ?? []) {
        if (overlay.kind === 'yield') {
          expect(ids.has(overlay.from), `${scenario.id}/${overlay.id}`).toBe(true);
          expect(ids.has(overlay.to), `${scenario.id}/${overlay.id}`).toBe(true);
        }
        if (overlay.kind === 'path') {
          expect(ids.has(overlay.vehicleId), `${scenario.id}/${overlay.id}`).toBe(true);
        }
      }
    }
  });

  it('gives risk-spotting scenarios exactly one correct hotspot', () => {
    for (const scenario of SCENARIOS) {
      if (scenario.kind !== 'risk-spotting') continue;
      const risks = (scenario.hotspots ?? []).filter((h) => h.isRisk);
      expect(risks, scenario.id).toHaveLength(1);
      for (const hotspot of scenario.hotspots ?? []) {
        expect(hotspot.explanation.length, hotspot.id).toBeGreaterThan(20);
      }
    }
  });

  it('keeps every coordinate inside the scene', () => {
    for (const scenario of SCENARIOS) {
      for (const vehicle of scenario.vehicles) {
        expect(vehicle.x, `${scenario.id}/${vehicle.id}`).toBeGreaterThanOrEqual(0);
        expect(vehicle.x).toBeLessThanOrEqual(100);
        expect(vehicle.y).toBeGreaterThanOrEqual(0);
        expect(vehicle.y).toBeLessThanOrEqual(100);
        for (const point of vehicle.path ?? []) {
          expect(point.x).toBeGreaterThanOrEqual(0);
          expect(point.x).toBeLessThanOrEqual(100);
        }
      }
    }
  });
});

describe('evaluateOrder', () => {
  it('accepts the correct sequence', () => {
    const result = evaluateOrder(hogerregeln, ['b', 'a', 'c']);
    expect(result.correct).toBe(true);
    expect(result.firstMistakeIndex).toBeNull();
    expect(result.mistakeSummary).toBeNull();
  });

  it('names the first divergence rather than just failing', () => {
    const result = evaluateOrder(hogerregeln, ['a', 'b', 'c']);
    expect(result.correct).toBe(false);
    expect(result.firstMistakeIndex).toBe(0);
    expect(result.mistakeSummary).toContain('A');
    expect(result.mistakeSummary).toContain('B');
  });

  it('points at the later position when the start is right', () => {
    const result = evaluateOrder(hogerregeln, ['b', 'c', 'a']);
    expect(result.correct).toBe(false);
    expect(result.firstMistakeIndex).toBe(1);
    expect(result.mistakeSummary).toContain('nummer 2');
  });

  it('treats an incomplete answer as unfinished, not wrong reasoning', () => {
    const result = evaluateOrder(hogerregeln, ['b']);
    expect(result.correct).toBe(false);
    expect(result.mistakeSummary).toContain('inte placerade');
  });

  it('always returns the full reasoning, right or wrong', () => {
    expect(evaluateOrder(hogerregeln, ['b', 'a', 'c']).steps).toHaveLength(3);
    expect(evaluateOrder(hogerregeln, ['c', 'b', 'a']).steps).toHaveLength(3);
  });
});

describe('variants', () => {
  it('returns the base scenario when no variant is selected', () => {
    expect(resolveScenario(hogerregeln, null)).toBe(hogerregeln);
    expect(resolveScenario(hogerregeln)).toBe(hogerregeln);
  });

  it('falls back to the base for an unknown variant instead of breaking', () => {
    expect(resolveScenario(hogerregeln, 'does-not-exist')).toBe(hogerregeln);
  });

  it('changes the correct answer when a condition changes', () => {
    const base = resolveScenario(hogerregeln, null);
    const yielding = resolveScenario(hogerregeln, 'vajningsplikt');
    const priority = resolveScenario(hogerregeln, 'huvudled');

    expect(base.correctOrder).toEqual(['b', 'a', 'c']);
    expect(yielding.correctOrder).toEqual(['b', 'c', 'a']);
    expect(priority.correctOrder).toEqual(['a', 'b', 'c']);
  });

  it('keeps the vehicles and layout of the base scenario', () => {
    const variant = resolveScenario(hogerregeln, 'huvudled');
    expect(variant.vehicles).toBe(hogerregeln.vehicles);
    expect(variant.layout).toBe(hogerregeln.layout);
    expect(variant.id).toBe(hogerregeln.id);
  });

  it('gives each variant its own explanation, steps and description', () => {
    for (const scenario of SCENARIOS) {
      for (const variant of scenario.variants ?? []) {
        const resolved = resolveScenario(scenario, variant.id);
        expect(resolved.explanation, variant.id).not.toBe(scenario.explanation);
        expect(resolved.accessibilityText, variant.id).not.toBe(scenario.accessibilityText);
        expect(resolved.stepExplanations?.length, variant.id).toBe(resolved.correctOrder?.length);
      }
    }
  });

  it('evaluates an attempt against the resolved variant, not the base', () => {
    const variant = resolveScenario(hogerregeln, 'huvudled');
    expect(evaluateOrder(variant, ['a', 'b', 'c']).correct).toBe(true);
    expect(evaluateOrder(variant, ['b', 'a', 'c']).correct).toBe(false);
  });
});

describe('replay', () => {
  it('produces one step per vehicle in the correct order', () => {
    const sequence = buildReplaySequence(hogerregeln);
    expect(sequence.map((s) => s.vehicleId)).toEqual(['b', 'a', 'c']);
    expect(sequence.map((s) => s.index)).toEqual([0, 1, 2]);
  });

  it('carries a caption for every step, so the replay is never purely visual', () => {
    for (const step of buildReplaySequence(hogerregeln)) {
      expect(step.caption.length).toBeGreaterThan(20);
    }
  });

  it('follows the variant when one is active', () => {
    const variant = resolveScenario(hogerregeln, 'vajningsplikt');
    expect(buildReplaySequence(variant).map((s) => s.label)).toEqual(['B', 'C', 'A']);
  });

  it('advances vehicles one at a time', () => {
    const sequence = buildReplaySequence(hogerregeln);

    const atStart = replayProgressAt(sequence, 0, 0);
    expect(atStart).toEqual({ b: 0, a: 0, c: 0 });

    const midFirst = replayProgressAt(sequence, 0, 0.5);
    expect(midFirst.b).toBe(0.5);
    expect(midFirst.a).toBe(0);

    const secondStep = replayProgressAt(sequence, 1, 0.25);
    expect(secondStep.b).toBe(1);
    expect(secondStep.a).toBe(0.25);
    expect(secondStep.c).toBe(0);

    const done = replayProgressAt(sequence, 2, 1);
    expect(done).toEqual({ b: 1, a: 1, c: 1 });
  });

  it('clamps progress to the path', () => {
    const sequence = buildReplaySequence(hogerregeln);
    expect(replayProgressAt(sequence, 0, -2).b).toBe(0);
    expect(replayProgressAt(sequence, 0, 4).b).toBe(1);
  });

  it('reports whether a vehicle actually travels', () => {
    for (const step of buildReplaySequence(hogerregeln)) {
      expect(step.hasPath).toBe(true);
    }
  });
});

describe('pointAtProgress', () => {
  const path = [
    { x: 0, y: 0 },
    { x: 0, y: 100 },
  ];

  it('starts at the beginning and ends at the end', () => {
    expect(pointAtProgress(path, 0)).toMatchObject({ x: 0, y: 0 });
    expect(pointAtProgress(path, 1).y).toBeCloseTo(100);
  });

  it('interpolates along the way', () => {
    expect(pointAtProgress(path, 0.5).y).toBeCloseTo(50);
  });

  it('handles a single point without throwing', () => {
    expect(pointAtProgress([{ x: 5, y: 6 }], 0.5)).toMatchObject({ x: 5, y: 6 });
  });

  it('follows multi-segment paths through the turn', () => {
    const turn = [
      { x: 50, y: 100 },
      { x: 50, y: 50 },
      { x: 0, y: 50 },
    ];
    const start = pointAtProgress(turn, 0);
    const end = pointAtProgress(turn, 1);
    expect(start).toMatchObject({ x: 50, y: 100 });
    expect(end.x).toBeCloseTo(0);
    expect(end.y).toBeCloseTo(50);
  });
});

describe('risk spotting', () => {
  it('accepts the hazardous hotspot and rejects the others', () => {
    const correct = evaluateHotspot(risk, 'between-cars');
    expect(correct.correct).toBe(true);
    expect(correct.explanation).toBeTruthy();

    const wrong = evaluateHotspot(risk, 'road-ahead');
    expect(wrong.correct).toBe(false);
    expect(wrong.explanation).toBeTruthy();
  });

  it('handles no selection and unknown ids', () => {
    expect(evaluateHotspot(risk, null).correct).toBe(false);
    expect(evaluateHotspot(risk, 'nope').correct).toBe(false);
  });
});

describe('orderableVehicles', () => {
  it('excludes parked scenery from the ordering task', () => {
    const orderable = orderableVehicles(risk).map((v) => v.id);
    expect(orderable).toEqual(['a']);
    expect(orderable).not.toContain('p1');
  });
});

describe('lane discipline', () => {
  /**
   * Right-hand traffic: a vehicle keeps to the right of the road it ends up on.
   * In the 100×100 scene the centre line is 50, so a northbound vehicle must
   * finish at x > 50, a southbound one at x < 50, and so on.
   *
   * This exists because a left-turning car in sc-hogerregeln-1 used to finish
   * in the oncoming lane — an app that teaches lane discipline must not draw
   * it wrong.
   */
  const AXIS_LAYOUTS = new Set(['crossroads', 't-junction']);

  it('ends every path in the lane its final heading implies', () => {
    for (const scenario of SCENARIOS) {
      if (!AXIS_LAYOUTS.has(scenario.layout)) continue;

      for (const vehicle of scenario.vehicles) {
        const path = vehicle.path;
        if (!path || path.length < 2) continue;
        // Cyclists and pedestrians travel on cycle paths and pavements, which
        // sit outside the carriageway. Carriageway lane geometry does not
        // describe them, so judging them by it would be wrong, not strict.
        if (vehicle.role === 'bicycle' || vehicle.role === 'pedestrian') continue;

        const end = path[path.length - 1]!;
        const before = path[path.length - 2]!;
        const dx = end.x - before.x;
        const dy = end.y - before.y;
        const where = `${scenario.id}/${vehicle.id}`;

        // Only judge a clearly axis-aligned final leg; a diagonal one is still
        // mid-manoeuvre and has no settled lane yet.
        if (Math.abs(dy) > Math.abs(dx) * 2) {
          if (dy < 0) expect(end.x, `${where} northbound`).toBeGreaterThan(50);
          else expect(end.x, `${where} southbound`).toBeLessThan(50);
        } else if (Math.abs(dx) > Math.abs(dy) * 2) {
          if (dx > 0) expect(end.y, `${where} eastbound`).toBeGreaterThan(50);
          else expect(end.y, `${where} westbound`).toBeLessThan(50);
        }
      }
    }
  });

  it('keeps a turning vehicle on the road it started from at the start', () => {
    for (const scenario of SCENARIOS) {
      if (!AXIS_LAYOUTS.has(scenario.layout)) continue;

      for (const vehicle of scenario.vehicles) {
        const path = vehicle.path;
        if (!path || path.length < 2) continue;
        // The path must actually begin where the vehicle is drawn, or the car
        // would jump the moment a replay starts.
        expect(path[0]!.x, `${scenario.id}/${vehicle.id} start x`).toBe(vehicle.x);
        expect(path[0]!.y, `${scenario.id}/${vehicle.id} start y`).toBe(vehicle.y);
      }
    }
  });
});
