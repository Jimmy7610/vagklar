import styles from './IntersectionScene.module.css';
import type { Scenario, ScenarioVehicle } from '@/domain/content/types';

/**
 * Top-down traffic scene.
 *
 * A single 100×100 coordinate space that every scenario is authored in, so new
 * layouts and new vehicle arrangements need no new drawing code. Vehicles can
 * be made selectable for order-of-passage exercises; selection is exposed as
 * real buttons so the exercise is fully keyboard operable.
 */

interface Props {
  scenario: Scenario;
  /** Vehicle id -> position in the learner's chosen order (1-based). */
  order?: Record<string, number>;
  onSelect?: (vehicleId: string) => void;
  /** Show the correct order instead of the learner's. */
  revealed?: boolean;
  size?: number;
}

function Roads({ layout }: { layout: Scenario['layout'] }) {
  const horizontal = (
    <>
      <rect x="0" y="37" width="100" height="26" fill="var(--asphalt)" />
      <line
        x1="0"
        y1="50"
        x2="100"
        y2="50"
        stroke="var(--lane)"
        strokeWidth="0.7"
        strokeDasharray="5 4"
      />
    </>
  );

  const vertical = (
    <>
      <rect x="37" y="0" width="26" height="100" fill="var(--asphalt)" />
      <line
        x1="50"
        y1="0"
        x2="50"
        y2="100"
        stroke="var(--lane)"
        strokeWidth="0.7"
        strokeDasharray="5 4"
      />
    </>
  );

  if (layout === 'roundabout') {
    return (
      <>
        {horizontal}
        {vertical}
        <circle cx="50" cy="50" r="21" fill="var(--asphalt)" />
        <circle cx="50" cy="50" r="9.5" fill="var(--ground)" stroke="var(--lane)" strokeWidth="0.8" />
      </>
    );
  }

  if (layout === 't-junction') {
    return (
      <>
        {horizontal}
        <rect x="37" y="37" width="26" height="63" fill="var(--asphalt)" />
        <line
          x1="50"
          y1="63"
          x2="50"
          y2="100"
          stroke="var(--lane)"
          strokeWidth="0.7"
          strokeDasharray="5 4"
        />
      </>
    );
  }

  if (layout === 'street-scene') {
    return (
      <>
        {horizontal}
        <rect x="0" y="30" width="100" height="7" fill="var(--asphalt-edge)" opacity="0.5" />
        <rect x="0" y="63" width="100" height="7" fill="var(--asphalt-edge)" opacity="0.5" />
      </>
    );
  }

  return (
    <>
      {horizontal}
      {vertical}
      {/* Clear the dashed lines through the junction box. */}
      <rect x="37" y="37" width="26" height="26" fill="var(--asphalt)" />
    </>
  );
}

function VehicleShape({ vehicle }: { vehicle: ScenarioVehicle }) {
  const fill = vehicle.isEgo ? 'var(--ego)' : 'var(--other)';

  if (vehicle.kind === 'pedestrian') {
    return (
      <>
        <circle cx="0" cy="-2.5" r="2" fill={fill} className={styles.vehicleBody} />
        <rect x="-1.6" y="-0.4" width="3.2" height="5.4" rx="1.4" fill={fill} />
      </>
    );
  }

  if (vehicle.kind === 'bicycle') {
    return (
      <>
        <rect
          x="-2"
          y="-4.5"
          width="4"
          height="9"
          rx="1.8"
          fill={fill}
          className={styles.vehicleBody}
        />
        <circle cx="0" cy="-3.4" r="1.1" fill="var(--lane)" opacity="0.85" />
      </>
    );
  }

  const height = vehicle.kind === 'truck' ? 15 : 10.5;
  return (
    <>
      <rect
        x="-3.4"
        y={-height / 2}
        width="6.8"
        height={height}
        rx="1.8"
        fill={fill}
        className={styles.vehicleBody}
      />
      {/* Windscreen marks the front, so heading is readable at a glance. */}
      <rect x="-2.3" y={-height / 2 + 1.4} width="4.6" height="2.4" rx="0.9" fill="var(--lane)" opacity="0.85" />
      <rect x="-2.3" y={height / 2 - 3.4} width="4.6" height="2" rx="0.8" fill="var(--lane)" opacity="0.35" />
    </>
  );
}

export function IntersectionScene({ scenario, order, onSelect, revealed, size }: Props) {
  const displayedOrder: Record<string, number> = revealed
    ? Object.fromEntries((scenario.correctOrder ?? []).map((id, index) => [id, index + 1]))
    : (order ?? {});

  return (
    <svg
      className={styles.scene}
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label={scenario.accessibilityText}
    >
      <rect x="0" y="0" width="100" height="100" fill="var(--ground)" />
      <Roads layout={scenario.layout} />

      {scenario.vehicles.map((vehicle) => {
        const position = displayedOrder[vehicle.id];
        const content = (
          <g transform={`translate(${vehicle.x} ${vehicle.y}) rotate(${vehicle.heading})`}>
            <VehicleShape vehicle={vehicle} />
          </g>
        );

        return (
          <g key={vehicle.id} className={styles.vehicle}>
            {onSelect ? (
              <g
                className={styles.selectable}
                role="button"
                tabIndex={0}
                aria-label={`${vehicle.label}${position ? `, vald som nummer ${position}` : ''}`}
                onClick={() => onSelect(vehicle.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onSelect(vehicle.id);
                  }
                }}
              >
                {/* Generous invisible hit area — the cars themselves are small. */}
                <circle cx={vehicle.x} cy={vehicle.y} r="9" fill="transparent" />
                {content}
              </g>
            ) : (
              content
            )}

            {position !== undefined && (
              <g>
                <circle
                  cx={vehicle.x + 6.5}
                  cy={vehicle.y - 6.5}
                  r="4.6"
                  fill={revealed ? 'var(--color-success)' : 'var(--highlight)'}
                  stroke="var(--ground)"
                  strokeWidth="1"
                />
                <text
                  x={vehicle.x + 6.5}
                  y={vehicle.y - 6.5}
                  className={styles.orderBadge}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#0f2e33"
                >
                  {position}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
