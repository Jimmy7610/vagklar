import { useMemo } from 'react';
import { useLearner } from './useLearner';
import { buildInsights, groupMistakes } from '@/domain/insights/insights';
import type { Insight, MistakeGroup } from '@/domain/insights/insights';
import { dailySeed, nextBestStep } from '@/domain/selection/selection';
import type { Recommendation, SelectionContext } from '@/domain/selection/selection';
import { useMinuteClock } from './clock';
import type { LearnerData } from '@/domain/learner/types';

/**
 * Hooks that need the question bank.
 *
 * Split out of useLearner so the app shell — which imports that module — does
 * not pull the bank into the startup bundle. Everything here is used only by
 * lazily loaded route pages, which run after HydrationGate has waited for the
 * bank to load.
 */

const insightsCache = new WeakMap<LearnerData, Insight[]>();
const mistakeCache = new WeakMap<LearnerData, MistakeGroup[]>();

export function useInsights(): Insight[] {
  const data = useLearner();
  return useMemo(() => {
    const cached = insightsCache.get(data);
    if (cached) return cached;
    const result = buildInsights(data);
    insightsCache.set(data, result);
    return result;
  }, [data]);
}

export function useMistakeGroups(): MistakeGroup[] {
  const data = useLearner();
  return useMemo(() => {
    const cached = mistakeCache.get(data);
    if (cached) return cached;
    const result = groupMistakes(data.answers);
    mistakeCache.set(data, result);
    return result;
  }, [data]);
}

/** A selection context pinned to the current learner state. */
export function useSelectionContext(seed?: number): SelectionContext {
  const data = useLearner();
  const now = useMinuteClock();
  return useMemo(
    () => ({
      mastery: data.mastery,
      questionStates: data.questionStates,
      answers: data.answers,
      now,
      seed: seed ?? dailySeed(data.profile.id, now),
    }),
    [data, seed, now],
  );
}

export function useRecommendation(): Recommendation {
  const context = useSelectionContext();
  return useMemo(() => nextBestStep(context), [context]);
}
