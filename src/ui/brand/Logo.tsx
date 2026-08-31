import styles from './Logo.module.css';

/**
 * The Vägklar mark.
 *
 * A checkmark whose long arm is drawn as a road: the same stroke carries both
 * "correct" and "the way forward", with a dashed centre line that only reads
 * as a road once you look twice. Vector, two colours, no bitmap dependency.
 */
export function Mark({ size = 28, title }: { size?: number; title?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {/* The road / check stroke */}
      <path
        d="M5.5 17.2 12.4 24 26.5 6.5"
        stroke="var(--logo-primary, var(--color-primary))"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Centre line — the detail that turns the check into a road */}
      <path
        d="M13.6 21.2 24.2 8.1"
        stroke="var(--logo-accent, var(--color-surface))"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeDasharray="2.4 3"
        opacity="0.9"
      />
    </svg>
  );
}

export interface WordmarkProps {
  size?: number;
  /** Hide the text and show only the mark (used in tight navigation). */
  markOnly?: boolean;
  className?: string;
}

export function Wordmark({ size = 26, markOnly, className }: WordmarkProps) {
  return (
    <span className={[styles.wordmark, className].filter(Boolean).join(' ')}>
      <Mark size={size} />
      {!markOnly && <span className={styles.text}>Vägklar</span>}
      {markOnly && <span className="visually-hidden">Vägklar</span>}
    </span>
  );
}
