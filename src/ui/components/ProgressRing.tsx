import { useEffect, useId, useState } from 'react';
import styles from './ProgressRing.module.css';

export interface ProgressRingProps {
  /** 0–100. Pass null when there is genuinely no value yet. */
  value: number | null;
  size?: number;
  thickness?: number;
  label?: string;
  suffix?: string;
  /** Explicit colour; defaults to the mastery ramp for the given value. */
  color?: string;
  /** Text announced to assistive technology. */
  ariaLabel?: string;
  valueFontSize?: string;
  /** Skip the fill animation (e.g. inside a list of many rings). */
  animate?: boolean;
}

/** The mastery colour ramp, shared by every mastery visual in the product. */
export function masteryColor(value: number | null): string {
  if (value === null) return 'var(--color-mastery-none)';
  if (value < 50) return 'var(--color-mastery-low)';
  if (value < 70) return 'var(--color-mastery-mid)';
  if (value < 85) return 'var(--color-mastery-good)';
  return 'var(--color-mastery-high)';
}

/**
 * A ring gauge.
 *
 * The number is always rendered as text as well, so the ring is decoration
 * rather than the sole carrier of meaning. When `value` is null the ring shows
 * an em dash — we never draw a fake zero for "not measured yet".
 */
export function ProgressRing({
  value,
  size = 160,
  thickness = 10,
  label,
  suffix = '%',
  color,
  ariaLabel,
  valueFontSize,
  animate = true,
}: ProgressRingProps) {
  const gradientId = useId();
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  // Start empty and fill on mount so the ring reads as a measurement being
  // taken rather than a static graphic. Only the *first* frame is held back;
  // later value changes animate from wherever the ring currently is.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!animate) return;
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, [animate]);

  const displayValue = animate && !mounted ? 0 : (value ?? 0);
  const clamped = Math.max(0, Math.min(100, displayValue));
  const offset = circumference - (clamped / 100) * circumference;
  const stroke = color ?? masteryColor(value);

  return (
    <div
      className={styles.wrapper}
      style={{ width: size, height: size }}
      role="img"
      aria-label={ariaLabel ?? (value === null ? `${label ?? 'Värde'}: inte mätt än` : `${label ?? 'Värde'}: ${value}${suffix}`)}
    >
      <svg className={styles.svg} width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className={styles.track}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          stroke="currentColor"
        />
        {value !== null && (
          <circle
            className={styles.indicator}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            id={gradientId}
          />
        )}
      </svg>
      <div className={styles.content} aria-hidden="true">
        <div
          className={styles.value}
          style={valueFontSize ? { ['--ring-value-size' as string]: valueFontSize } : undefined}
        >
          {value === null ? (
            <span className={styles.placeholder}>—</span>
          ) : (
            <>
              {value}
              <span className={styles.suffix}>{suffix}</span>
            </>
          )}
        </div>
        {label && <div className={styles.label}>{label}</div>}
      </div>
    </div>
  );
}
