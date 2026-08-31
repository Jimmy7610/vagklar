import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HydrationGate } from './HydrationGate';

const status = vi.hoisted(() => ({ current: 'loading' as 'loading' | 'ready' }));

vi.mock('./state/useLearner', () => ({
  useLearnerState: () => ({ status: status.current }),
}));

/**
 * Regression guard.
 *
 * Reading the learner record from IndexedDB is asynchronous. Before this gate
 * existed, a reload rendered screens against the empty placeholder profile for
 * a few frames — long enough for the home screen to decide "no onboarding yet"
 * and for the exam runner to decide "no exam running", throwing a returning
 * learner out of their session.
 */
describe('HydrationGate', () => {
  it('holds the route while the learner record is still loading', () => {
    status.current = 'loading';
    render(
      <HydrationGate>
        <div>Skyddat innehåll</div>
      </HydrationGate>,
    );

    expect(screen.queryByText('Skyddat innehåll')).not.toBeInTheDocument();
    expect(screen.getByText('Laddar')).toBeInTheDocument();
  });

  it('renders the route once the record is available', () => {
    status.current = 'ready';
    render(
      <HydrationGate>
        <div>Skyddat innehåll</div>
      </HydrationGate>,
    );

    expect(screen.getByText('Skyddat innehåll')).toBeInTheDocument();
  });
});
