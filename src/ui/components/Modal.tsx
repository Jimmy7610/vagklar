import { useCallback, useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';
import { Icon } from '@/ui/icons/Icon';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
  /** Set false for confirmations that must be answered explicitly. */
  dismissible?: boolean;
}

/**
 * An accessible dialog.
 *
 * Renders as a bottom sheet on phones and a centred dialog from 600px up —
 * same component, same semantics. Focus is trapped while open, restored on
 * close, and the page behind is locked from scrolling.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  wide,
  dismissible = true,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!open) return;

      if (event.key === 'Escape' && dismissible) {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const container = dialogRef.current;
      if (!container) return;

      const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (element) => element.offsetParent !== null || element === document.activeElement,
      );
      if (focusable.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [open, onClose, dismissible],
  );

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    // Focus the dialog itself so screen readers announce the title first.
    const frame = requestAnimationFrame(() => {
      const container = dialogRef.current;
      const target = container?.querySelector<HTMLElement>('[data-autofocus]') ?? container;
      target?.focus();
    });

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused.current?.focus?.();
    };
  }, [open, handleKeyDown]);

  if (!open) return null;
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className={styles.scrim} role="presentation">
      {/*
        A real button rather than a click handler on the scrim div: semantic,
        and it keeps the interaction out of a non-interactive element. It is
        removed from the tab order because Escape and the visible close button
        already cover keyboard users.
      */}
      {dismissible && (
        <button
          type="button"
          className={styles.scrimButton}
          tabIndex={-1}
          aria-hidden="true"
          onClick={onClose}
        />
      )}
      <div
        ref={dialogRef}
        className={[styles.dialog, wide ? styles.wide : ''].filter(Boolean).join(' ')}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
      >
        <div className={styles.grabber} aria-hidden="true" />
        <div className={styles.header}>
          <div>
            <h2 className={styles.title} id={titleId}>
              {title}
            </h2>
            {description && (
              <p className={styles.description} id={descriptionId}>
                {description}
              </p>
            )}
          </div>
          {dismissible && (
            <button type="button" className={styles.close} onClick={onClose} aria-label="Stäng">
              <Icon name="close" size={20} />
            </button>
          )}
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
