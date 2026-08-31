import { useSyncExternalStore } from 'react';

/**
 * Shared clocks.
 *
 * Reading `Date.now()` during render makes a component impure — the same props
 * can produce different output, which breaks memoisation and the React
 * compiler's assumptions. Time is therefore modelled as an external store:
 * the value is cached, updated on an interval, and read through
 * `useSyncExternalStore`.
 *
 * Two granularities, because the exam needs per-second precision and
 * everything else does not:
 *   - `useSecondClock()` for countdowns
 *   - `useMinuteClock()` for readiness, scheduling and recommendations
 *
 * The interval only runs while something is subscribed.
 */
class Clock {
  private current: number;
  private timer: ReturnType<typeof setInterval> | null = null;
  private readonly intervalMs: number;
  private readonly listeners = new Set<() => void>();

  constructor(intervalMs: number) {
    this.intervalMs = intervalMs;
    // Evaluated at module load, outside of any render.
    this.current = Date.now();
  }

  private tick = (): void => {
    const next = Date.now();
    if (next === this.current) return;
    this.current = next;
    for (const listener of this.listeners) listener();
  };

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    if (this.timer === null) {
      this.timer = setInterval(this.tick, this.intervalMs);
    }
    // `subscribe` runs after commit, so refreshing here is safe and makes a
    // newly mounted consumer accurate immediately rather than up to one
    // interval late.
    this.tick();

    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0 && this.timer !== null) {
        clearInterval(this.timer);
        this.timer = null;
      }
    };
  };

  getSnapshot = (): number => this.current;
}

const secondClock = new Clock(1000);
const minuteClock = new Clock(30_000);

export function useSecondClock(): number {
  return useSyncExternalStore(secondClock.subscribe, secondClock.getSnapshot, secondClock.getSnapshot);
}

export function useMinuteClock(): number {
  return useSyncExternalStore(minuteClock.subscribe, minuteClock.getSnapshot, minuteClock.getSnapshot);
}
