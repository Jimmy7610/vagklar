import { useId } from 'react';
import styles from './ScenarioStage.module.css';
import { RoadSign, hasRoadSign } from './RoadSign';
import type {
  Scenario,
  ScenarioLayout,
  ScenarioMarking,
  ScenarioPoint,
  ScenarioVehicle,
} from '@/domain/content/types';

/**
 * The Scenario Lab stage.
 *
 * One renderer for every situation. Everything is driven by the scenario data:
 * layout, road markings, signs, vehicles, teaching overlays and replay
 * positions. Vehicles are addressable (`A`, `B`, `C`) with a persistent badge,
 * and the ego vehicle carries a written "DIN BIL" tag so it is never
 * identified by colour alone.
 *
 * Drawn in a 100×100 viewBox with `preserveAspectRatio`, so the stage scales to
 * whatever box the layout gives it without ever distorting or overflowing.
 */

/* ------------------------------------------------------------------ */
/* Roads                                                               */
/* ------------------------------------------------------------------ */

function DashedCentre({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="var(--lane)"
      strokeWidth="0.7"
      strokeDasharray="5 4"
      opacity="0.85"
    />
  );
}

function Roads({ layout }: { layout: ScenarioLayout }) {
  const kerb = (
    <>
      <rect x="0" y="34.5" width="100" height="2.5" fill="var(--kerb)" />
      <rect x="0" y="63" width="100" height="2.5" fill="var(--kerb)" />
    </>
  );

  const horizontal = (
    <>
      <rect x="0" y="37" width="100" height="26" fill="var(--asphalt)" />
      <DashedCentre x1={0} y1={50} x2={100} y2={50} />
    </>
  );

  const vertical = (
    <>
      <rect x="37" y="0" width="26" height="100" fill="var(--asphalt)" />
      <DashedCentre x1={50} y1={0} x2={50} y2={100} />
    </>
  );

  switch (layout) {
    case 'roundabout':
      return (
        <>
          {horizontal}
          {vertical}
          <circle cx="50" cy="50" r="22" fill="var(--asphalt)" />
          <circle cx="50" cy="50" r="10" fill="var(--ground-alt)" stroke="var(--lane)" strokeWidth="0.8" />
          <circle
            cx="50"
            cy="50"
            r="16"
            fill="none"
            stroke="var(--lane)"
            strokeWidth="0.6"
            strokeDasharray="3 3"
            opacity="0.7"
          />
        </>
      );

    case 't-junction':
      return (
        <>
          {horizontal}
          <rect x="40" y="63" width="20" height="37" fill="var(--asphalt-dark)" />
          {/* Kerb line broken by the exit, so the "not a road" reading is visible. */}
          <rect x="0" y="63" width="40" height="2.2" fill="var(--kerb)" />
          <rect x="60" y="63" width="40" height="2.2" fill="var(--kerb)" />
          <rect x="0" y="34.8" width="100" height="2.2" fill="var(--kerb)" />
          <text x="50" y="92" className={styles.noteText} textAnchor="middle">
            Parkering
          </text>
        </>
      );

    case 'street-scene':
      return (
        <>
          {horizontal}
          {kerb}
          <rect x="0" y="28" width="100" height="6.5" fill="var(--ground-alt)" />
          <rect x="0" y="65.5" width="100" height="6.5" fill="var(--ground-alt)" />
        </>
      );

    case 'motorway-merge':
      return (
        <>
          <rect x="0" y="30" width="100" height="34" fill="var(--asphalt)" />
          <DashedCentre x1={0} y1={47} x2={100} y2={47} />
        </>
      );

    case 'crossroads':
    default:
      return (
        <>
          {horizontal}
          {vertical}
          {/* Clear the dashes through the junction box. */}
          <rect x="37" y="37" width="26" height="26" fill="var(--asphalt)" />
        </>
      );
  }
}

/* ------------------------------------------------------------------ */
/* Road markings                                                       */
/* ------------------------------------------------------------------ */

function Marking({ marking }: { marking: ScenarioMarking }) {
  const { x, y, rotation = 0, length = 12 } = marking;
  const half = length / 2;

  switch (marking.kind) {
    case 'stop-line':
      return (
        <g transform={`translate(${x} ${y}) rotate(${rotation})`}>
          <rect x={-half} y={-0.9} width={length} height={1.8} fill="var(--lane)" />
        </g>
      );

    case 'yield-line':
      return (
        <g transform={`translate(${x} ${y}) rotate(${rotation})`}>
          {Array.from({ length: Math.max(2, Math.round(length / 2.6)) }, (_, i) => (
            <rect
              key={i}
              x={-half + i * 2.6}
              y={-0.85}
              width={1.5}
              height={1.7}
              fill="var(--lane)"
            />
          ))}
        </g>
      );

    case 'crossing':
      return (
        <g transform={`translate(${x} ${y}) rotate(${rotation})`}>
          {Array.from({ length: 6 }, (_, i) => (
            <rect key={i} x={-half + i * (length / 6)} y={-4} width={length / 11} height={8} fill="var(--lane)" />
          ))}
        </g>
      );

    case 'cycle-crossing':
      return (
        <g transform={`translate(${x} ${y}) rotate(${rotation})`}>
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={i} x={-half + i * (length / 8)} y={-2.2} width={1.4} height={1.6} fill="var(--lane)" />
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={`b${i}`} x={-half + i * (length / 8)} y={0.8} width={1.4} height={1.6} fill="var(--lane)" />
          ))}
        </g>
      );

    case 'arrow':
    default:
      return (
        <g transform={`translate(${x} ${y}) rotate(${rotation})`}>
          <path
            d={`M 0 ${half} L 0 ${-half + 2}`}
            stroke="var(--lane)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path d={`M -2.2 ${-half + 3.2} L 0 ${-half} L 2.2 ${-half + 3.2}`} fill="var(--lane)" />
        </g>
      );
  }
}

/* ------------------------------------------------------------------ */
/* Vehicles                                                            */
/* ------------------------------------------------------------------ */

function vehicleFill(vehicle: ScenarioVehicle): string {
  if (vehicle.isEgo) return 'var(--ego)';
  if (vehicle.intent === 'stop') return 'var(--parked)';
  if (vehicle.role === 'bicycle') return 'var(--bike)';
  if (vehicle.role === 'pedestrian') return 'var(--pedestrian)';
  return 'var(--other)';
}

/** Body drawn pointing north, so the group rotation is the heading. */
function VehicleBody({ vehicle }: { vehicle: ScenarioVehicle }) {
  const fill = vehicleFill(vehicle);

  if (vehicle.role === 'pedestrian') {
    return (
      <>
        <circle cx="0" cy="-2.6" r="1.9" fill={fill} className={styles.body} />
        <rect x="-1.5" y="-0.5" width="3" height="5" rx="1.3" fill={fill} />
      </>
    );
  }

  if (vehicle.role === 'bicycle') {
    return (
      <>
        <rect x="-1.9" y="-4.6" width="3.8" height="9.2" rx="1.7" fill={fill} className={styles.body} />
        <circle cx="0" cy="-3.2" r="1.05" fill="var(--lane)" opacity="0.9" />
        <rect x="-2.6" y="-1.4" width="5.2" height="0.8" rx="0.4" fill={fill} />
      </>
    );
  }

  const long = vehicle.role === 'truck' || vehicle.role === 'bus' ? 17 : 11;
  const wide = vehicle.role === 'truck' || vehicle.role === 'bus' ? 7.4 : 6.6;

  return (
    <>
      {/* Wheels, so orientation reads even at small sizes. */}
      <rect x={-wide / 2 - 0.7} y={-long / 2 + 1.6} width="1.4" height="2.6" rx="0.6" fill="#2a3438" opacity="0.55" />
      <rect x={wide / 2 - 0.7} y={-long / 2 + 1.6} width="1.4" height="2.6" rx="0.6" fill="#2a3438" opacity="0.55" />
      <rect x={-wide / 2 - 0.7} y={long / 2 - 4.2} width="1.4" height="2.6" rx="0.6" fill="#2a3438" opacity="0.55" />
      <rect x={wide / 2 - 0.7} y={long / 2 - 4.2} width="1.4" height="2.6" rx="0.6" fill="#2a3438" opacity="0.55" />

      <rect
        x={-wide / 2}
        y={-long / 2}
        width={wide}
        height={long}
        rx="1.9"
        fill={fill}
        className={styles.body}
      />
      {/* Windscreen marks the front. */}
      <rect x={-wide / 2 + 1.1} y={-long / 2 + 1.5} width={wide - 2.2} height="2.4" rx="0.9" fill="var(--lane)" opacity="0.9" />
      <rect x={-wide / 2 + 1.1} y={long / 2 - 3.5} width={wide - 2.2} height="1.9" rx="0.8" fill="var(--lane)" opacity="0.35" />
      {vehicle.role === 'truck' && (
        <line x1={-wide / 2 + 0.6} y1={-long / 2 + 5.6} x2={wide / 2 - 0.6} y2={-long / 2 + 5.6} stroke="var(--lane)" strokeWidth="0.6" opacity="0.5" />
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Overlays                                                            */
/* ------------------------------------------------------------------ */

function curveBetween(a: ScenarioPoint, b: ScenarioPoint): string {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  // Bow the arrow away from the straight line so it never hides under a car.
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const cx = mx - (dy / len) * 9;
  const cy = my + (dx / len) * 9;
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
}

function pathData(points: ScenarioPoint[]): string {
  if (points.length === 0) return '';
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
}

/* ------------------------------------------------------------------ */
/* Stage                                                               */
/* ------------------------------------------------------------------ */

export interface ScenarioStageProps {
  scenario: Scenario;
  /** Vehicle id → 1-based position in the learner's chosen order. */
  order?: Record<string, number>;
  onSelectVehicle?: (vehicleId: string) => void;
  /** Show the correct order instead of the learner's choice. */
  revealed?: boolean;
  /** Draw the teaching overlays. */
  showOverlays?: boolean;
  /** Replay: vehicle id → position along its path, 0–1. */
  replayProgress?: Record<string, number>;
  /** Replay step currently highlighted, for the reduced-motion presentation. */
  replayStep?: number | null;
  /** Milliseconds a replay move takes, for the CSS transition. */
  replayDurationMs?: number;
  /** Selected hotspot for risk-spotting scenarios. */
  selectedHotspot?: string | null;
  onSelectHotspot?: (hotspotId: string) => void;
}

/** Position along a polyline at progress t (0–1). */
export function pointAtProgress(points: ScenarioPoint[], t: number): ScenarioPoint & { heading: number } {
  const first = points[0] ?? { x: 0, y: 0 };
  if (points.length < 2) return { ...first, heading: 0 };

  const segments: number[] = [];
  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1]!;
    const b = points[i]!;
    const d = Math.hypot(b.x - a.x, b.y - a.y);
    segments.push(d);
    total += d;
  }
  if (total === 0) return { ...first, heading: 0 };

  let target = Math.max(0, Math.min(1, t)) * total;
  for (let i = 0; i < segments.length; i += 1) {
    const seg = segments[i]!;
    if (target <= seg || i === segments.length - 1) {
      const a = points[i]!;
      const b = points[i + 1]!;
      const ratio = seg === 0 ? 0 : Math.min(1, target / seg);
      const heading = (Math.atan2(b.x - a.x, a.y - b.y) * 180) / Math.PI;
      return { x: a.x + (b.x - a.x) * ratio, y: a.y + (b.y - a.y) * ratio, heading };
    }
    target -= seg;
  }
  const last = points[points.length - 1]!;
  return { ...last, heading: 0 };
}

export function ScenarioStage({
  scenario,
  order,
  onSelectVehicle,
  revealed,
  showOverlays,
  replayProgress,
  replayStep,
  replayDurationMs = 1200,
  selectedHotspot,
  onSelectHotspot,
}: ScenarioStageProps) {
  const titleId = useId();

  const displayedOrder: Record<string, number> = revealed
    ? Object.fromEntries((scenario.correctOrder ?? []).map((id, index) => [id, index + 1]))
    : (order ?? {});

  const vehicleById = new Map(scenario.vehicles.map((v) => [v.id, v]));

  return (
    <svg
      className={styles.stage}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-labelledby={titleId}
      style={{ ['--replay-duration' as string]: `${replayDurationMs}ms` }}
    >
      <title id={titleId}>{scenario.accessibilityText}</title>

      <rect x="0" y="0" width="100" height="100" fill="var(--ground)" />
      <Roads layout={scenario.layout} />

      {(scenario.markings ?? []).map((m) => (
        <Marking key={m.id} marking={m} />
      ))}

      {/* ---- Teaching overlays, under the vehicles ---- */}
      {showOverlays &&
        (scenario.overlays ?? []).map((overlay) => {
          if (overlay.kind === 'yield') {
            const from = vehicleById.get(overlay.from);
            const to = vehicleById.get(overlay.to);
            if (!from || !to) return null;
            return (
              <g key={overlay.id}>
                <path className={styles.overlayLine} d={curveBetween(from, to)} markerEnd="url(#vk-arrow)" />
              </g>
            );
          }
          if (overlay.kind === 'path') {
            const vehicle = vehicleById.get(overlay.vehicleId);
            if (!vehicle?.path) return null;
            return <path key={overlay.id} className={styles.pathLine} d={pathData(vehicle.path)} />;
          }
          if (overlay.kind === 'conflict') {
            return (
              <g key={overlay.id}>
                <circle cx={overlay.x} cy={overlay.y} r="4.6" className={styles.conflictMark} />
                <line
                  x1={overlay.x - 2.6}
                  y1={overlay.y - 2.6}
                  x2={overlay.x + 2.6}
                  y2={overlay.y + 2.6}
                  className={styles.conflictMark}
                />
                <line
                  x1={overlay.x + 2.6}
                  y1={overlay.y - 2.6}
                  x2={overlay.x - 2.6}
                  y2={overlay.y + 2.6}
                  className={styles.conflictMark}
                />
              </g>
            );
          }
          return (
            <text key={overlay.id} x={overlay.x} y={overlay.y} className={styles.noteText} textAnchor="middle">
              {overlay.text}
            </text>
          );
        })}

      <defs>
        <marker id="vk-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--overlay-strong)" />
        </marker>
      </defs>

      {/* ---- Signs ---- */}
      {(scenario.signs ?? []).map((sign) =>
        hasRoadSign(sign.sign) ? (
          <g key={sign.id} transform={`translate(${sign.x - 5} ${sign.y - 5})`}>
            <circle cx="5" cy="12.5" r="0.9" fill="var(--kerb)" />
            <rect x="4.4" y="9" width="1.2" height="4" fill="var(--kerb)" />
            <g transform="scale(0.1)">
              <RoadSign name={sign.sign} size={100} alt={sign.label} />
            </g>
          </g>
        ) : null,
      )}

      {/* ---- Hotspots (risk spotting) ---- */}
      {scenario.kind === 'risk-spotting' &&
        (scenario.hotspots ?? []).map((hotspot) => {
          const active = selectedHotspot === hotspot.id;
          return (
            <g
              key={hotspot.id}
              className={[styles.vehicle, onSelectHotspot ? styles.selectable : ''].filter(Boolean).join(' ')}
              role={onSelectHotspot ? 'button' : undefined}
              tabIndex={onSelectHotspot ? 0 : undefined}
              aria-label={hotspot.label}
              aria-pressed={onSelectHotspot ? active : undefined}
              onClick={() => onSelectHotspot?.(hotspot.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelectHotspot?.(hotspot.id);
                }
              }}
            >
              <circle
                cx={hotspot.x}
                cy={hotspot.y}
                r={hotspot.radius}
                fill={active ? 'var(--overlay)' : 'transparent'}
                fillOpacity={active ? 0.28 : 0}
                stroke={active ? 'var(--overlay-strong)' : 'var(--lane)'}
                strokeWidth={active ? 1.4 : 0.9}
                strokeDasharray="3 2.4"
                opacity={active ? 1 : 0.75}
              />
              <circle cx={hotspot.x} cy={hotspot.y} r={hotspot.radius} className={styles.focusRing} />
            </g>
          );
        })}

      {/* ---- Vehicles ---- */}
      {scenario.vehicles.map((vehicle) => {
        const position = displayedOrder[vehicle.id];
        const progress = replayProgress?.[vehicle.id];
        const moved =
          progress !== undefined && vehicle.path
            ? pointAtProgress(vehicle.path, progress)
            : { x: vehicle.x, y: vehicle.y, heading: vehicle.heading };

        const interactive = Boolean(onSelectVehicle) && vehicle.intent !== 'stop';
        const isChosen = position !== undefined;

        // During replay exactly one vehicle is "on stage": the one whose place
        // in the correct order matches the current step. Everything else fades.
        // This is what carries the sequence when motion is switched off.
        const replaying = replayStep != null;
        const isActiveStep = replaying && position === replayStep + 1;

        const label = interactive
          ? `${vehicle.label}. ${vehicle.description}${position ? ` Vald som nummer ${position}.` : ''}`
          : `${vehicle.label}. ${vehicle.description}`;

        return (
          <g
            key={vehicle.id}
            className={[
              styles.vehicle,
              interactive ? styles.selectable : '',
              isChosen ? styles.chosen : '',
              replaying && !isActiveStep ? styles.dimmed : '',
              isActiveStep ? styles.replayActive : '',
            ]
              .filter(Boolean)
              .join(' ')}
            role={interactive ? 'button' : undefined}
            tabIndex={interactive ? 0 : undefined}
            aria-label={interactive ? label : undefined}
            aria-pressed={interactive ? isChosen : undefined}
            onClick={() => interactive && onSelectVehicle?.(vehicle.id)}
            onKeyDown={(event) => {
              if (!interactive) return;
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onSelectVehicle?.(vehicle.id);
              }
            }}
          >
            <g
              className={progress !== undefined ? styles.moving : undefined}
              style={{ transform: `translate(${moved.x}px, ${moved.y}px) rotate(${moved.heading}deg)` }}
            >
              {/* Generous invisible hit area — the cars themselves are small. */}
              <circle cx="0" cy="0" r="10" className={styles.hit} />
              <circle cx="0" cy="0" r="9" className={styles.focusRing} />
              <VehicleBody vehicle={vehicle} />
            </g>

            {/* Badge and ego tag are drawn upright, never rotated with the car. */}
            <text
              x={moved.x + 7.4}
              y={moved.y + 1.4}
              className={styles.badge}
              textAnchor="middle"
              aria-hidden="true"
            >
              {vehicle.label}
            </text>
            {vehicle.isEgo && (
              <text
                x={moved.x + 7.4}
                y={moved.y + 5.6}
                className={styles.egoTag}
                textAnchor="middle"
                aria-hidden="true"
              >
                DIN BIL
              </text>
            )}

            {position !== undefined && (
              <g className={isActiveStep ? styles.sequenceBadge : undefined}>
                <circle
                  cx={moved.x - 7}
                  cy={moved.y - 6.4}
                  r="4.4"
                  fill={revealed ? 'var(--color-success)' : 'var(--overlay)'}
                  stroke="var(--ground)"
                  strokeWidth="1"
                />
                <text
                  x={moved.x - 7}
                  y={moved.y - 6.4}
                  className={styles.orderBadgeText}
                  textAnchor="middle"
                  dominantBaseline="central"
                  aria-hidden="true"
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
