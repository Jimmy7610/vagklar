import { Skeleton } from './Primitives';

/**
 * Route-level loading state.
 *
 * Chunks are local and tiny, so this is usually invisible. It exists to hold
 * the layout stable rather than to entertain — no spinner, no shifting.
 */
export function RouteFallback() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--space-4)',
        padding: 'var(--space-6) var(--space-gutter)',
        maxWidth: 'var(--container-max)',
        marginInline: 'auto',
        width: '100%',
      }}
      aria-busy="true"
      aria-live="polite"
    >
      <span className="visually-hidden">Laddar</span>
      <Skeleton width="42%" height={28} radius={8} />
      <Skeleton width="100%" height={140} radius={16} />
      <Skeleton width="100%" height={92} radius={16} />
      <Skeleton width="70%" height={92} radius={16} />
    </div>
  );
}
