import type { HTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from './Primitives.module.css';
import { Icon } from '@/ui/icons/Icon';
import type { IconName } from '@/ui/icons/Icon';

/* ---- Pill --------------------------------------------------------------- */

export type PillTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';

const pillClass: Record<PillTone, string> = {
  neutral: styles.pillNeutral!,
  primary: styles.pillPrimary!,
  success: styles.pillSuccess!,
  warning: styles.pillWarning!,
  danger: styles.pillDanger!,
  info: styles.pillInfo!,
  outline: styles.pillOutline!,
};

export interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: PillTone;
  icon?: IconName;
  children: ReactNode;
}

/**
 * Status chips always carry a word, never colour alone — the same rule applies
 * everywhere status is shown in Vägklar.
 */
export function Pill({ tone = 'neutral', icon, children, className, ...rest }: PillProps) {
  return (
    <span className={[styles.pill, pillClass[tone], className].filter(Boolean).join(' ')} {...rest}>
      {icon && <Icon name={icon} size={13} />}
      {children}
    </span>
  );
}

/* ---- Meter -------------------------------------------------------------- */

export interface MeterProps {
  value: number;
  max?: number;
  label?: ReactNode;
  valueText?: ReactNode;
  color?: string;
  height?: number;
  /** Draw a marker at this value (e.g. the exam pass line). */
  threshold?: number;
  thresholdLabel?: string;
  ariaLabel?: string;
}

export function Meter({
  value,
  max = 100,
  label,
  valueText,
  color,
  height,
  threshold,
  thresholdLabel,
  ariaLabel,
}: MeterProps) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  const thresholdPct =
    threshold !== undefined && max > 0 ? Math.max(0, Math.min(100, (threshold / max) * 100)) : null;

  return (
    <div className={styles.meter}>
      {(label || valueText) && (
        <div className={styles.meterHead}>
          {label && <span className={styles.meterLabel}>{label}</span>}
          {valueText && <span className={styles.meterValue}>{valueText}</span>}
        </div>
      )}
      <div
        className={styles.meterTrack}
        style={{
          ...(height ? { ['--meter-height' as string]: `${height}px` } : {}),
          ...(color ? { ['--meter-color' as string]: color } : {}),
        }}
        role="meter"
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={ariaLabel ?? (typeof label === 'string' ? label : undefined)}
      >
        <div className={styles.meterFill} style={{ width: `${pct}%` }} />
        {thresholdPct !== null && (
          <span
            className={styles.meterThreshold}
            style={{ left: `${thresholdPct}%` }}
            title={thresholdLabel}
          />
        )}
      </div>
    </div>
  );
}

/* ---- Stat --------------------------------------------------------------- */

export interface StatProps {
  value: ReactNode;
  unit?: string;
  label: ReactNode;
  size?: string;
}

export function Stat({ value, unit, label, size }: StatProps) {
  return (
    <div className={styles.stat}>
      <div
        className={styles.statValue}
        style={size ? { ['--stat-size' as string]: size } : undefined}
      >
        {value}
        {unit && <span className={styles.statUnit}>{unit}</span>}
      </div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

/* ---- Section heading ---------------------------------------------------- */

export interface SectionHeadingProps {
  overline?: string;
  title: ReactNode;
  action?: { label: string; to: string };
  id?: string;
  level?: 2 | 3;
}

export function SectionHeading({ overline, title, action, id, level = 2 }: SectionHeadingProps) {
  const Tag = level === 2 ? 'h2' : 'h3';
  return (
    <div className={styles.sectionHead}>
      <div>
        {overline && <div className={styles.overline}>{overline}</div>}
        <Tag className={styles.sectionTitle} id={id}>
          {title}
        </Tag>
      </div>
      {action && (
        <Link className={styles.sectionAction} to={action.to}>
          {action.label}
        </Link>
      )}
    </div>
  );
}

/* ---- Empty state -------------------------------------------------------- */

export interface EmptyStateProps {
  icon?: IconName;
  title: string;
  body?: string;
  action?: ReactNode;
  centered?: boolean;
}

export function EmptyState({ icon, title, body, action, centered }: EmptyStateProps) {
  return (
    <div className={[styles.empty, centered ? styles.emptyCentered : ''].filter(Boolean).join(' ')}>
      {icon && (
        <div className={styles.emptyIcon}>
          <Icon name={icon} size={20} />
        </div>
      )}
      <h3 className={styles.emptyTitle}>{title}</h3>
      {body && <p className={styles.emptyBody}>{body}</p>}
      {action}
    </div>
  );
}

/* ---- Skeleton ----------------------------------------------------------- */

export function Skeleton({
  width,
  height = 16,
  radius,
  className,
}: {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  className?: string;
}) {
  return (
    <div
      className={[styles.skeleton, className].filter(Boolean).join(' ')}
      style={{ width, height, borderRadius: radius }}
      aria-hidden="true"
    />
  );
}

/* ---- Segmented control -------------------------------------------------- */

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon?: IconName;
}

export interface SegmentedControlProps<T extends string> {
  options: ReadonlyArray<SegmentedOption<T>>;
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={[styles.segmented, className].filter(Boolean).join(' ')}
      role="radiogroup"
      aria-label={ariaLabel}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            className={[styles.segment, active ? styles.segmentActive : ''].filter(Boolean).join(' ')}
            onClick={() => onChange(option.value)}
          >
            {option.icon && <Icon name={option.icon} size={15} />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---- Switch ------------------------------------------------------------- */

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  hint?: string;
  id?: string;
}

export function Switch({ checked, onChange, label, hint, id }: SwitchProps) {
  return (
    <label className={styles.switchRow} htmlFor={id}>
      <span className={styles.switchText}>
        <span className={styles.switchLabel}>{label}</span>
        {hint && <span className={styles.switchHint}>{hint}</span>}
      </span>
      <input
        id={id}
        type="checkbox"
        className={['visually-hidden', styles.switchInput].join(' ')}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span
        className={[styles.switchTrack, checked ? styles.switchTrackOn : ''].filter(Boolean).join(' ')}
        aria-hidden="true"
      >
        <span className={styles.switchThumb} />
      </span>
    </label>
  );
}

/* ---- Callout ------------------------------------------------------------ */

export type CalloutTone = 'info' | 'warning' | 'danger' | 'success' | 'neutral';

const calloutClass: Record<CalloutTone, string> = {
  info: styles.calloutInfo!,
  warning: styles.calloutWarning!,
  danger: styles.calloutDanger!,
  success: styles.calloutSuccess!,
  neutral: styles.calloutNeutral!,
};

const calloutIcon: Record<CalloutTone, IconName> = {
  info: 'info',
  warning: 'alert',
  danger: 'alert',
  success: 'check-circle',
  neutral: 'info',
};

export function Callout({
  tone = 'neutral',
  icon,
  children,
}: {
  tone?: CalloutTone;
  icon?: IconName;
  children: ReactNode;
}) {
  return (
    <div className={[styles.callout, calloutClass[tone]].join(' ')}>
      <span className={styles.calloutIcon}>
        <Icon name={icon ?? calloutIcon[tone]} size={17} />
      </span>
      <div>{children}</div>
    </div>
  );
}

export function Divider() {
  return <hr className={styles.divider} />;
}
