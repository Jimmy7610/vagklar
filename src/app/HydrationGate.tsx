import type { ReactNode } from 'react';
import { useLearnerState } from './state/useLearner';
import { RouteFallback } from '@/ui/components/RouteFallback';

/**
 * Holds a route until the learner record has been read from IndexedDB.
 *
 * Loading is asynchronous, so for a few frames after a reload the store still
 * holds an empty profile. Any screen that *decides something* from that state —
 * "no onboarding yet, redirect", "no exam running, go back" — would act on the
 * empty placeholder and throw a returning learner out of their session.
 *
 * The gate is deliberately not applied to the landing page, which needs no
 * learner data to render.
 */
export function HydrationGate({ children }: { children: ReactNode }) {
  const { status } = useLearnerState();
  if (status !== 'ready') return <RouteFallback />;
  return <>{children}</>;
}
