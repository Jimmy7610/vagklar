import styles from './Toaster.module.css';
import { Icon } from '@/ui/icons/Icon';
import { useUi } from '@/app/state/UiProvider';

const toneClass = {
  neutral: '',
  success: styles.success,
  warning: styles.warning,
  danger: styles.danger,
} as const;

/**
 * Toast region.
 *
 * Uses a polite live region so announcements never interrupt a learner
 * mid-question, and every toast can be dismissed by keyboard.
 */
export function Toaster() {
  const { toasts, dismissToast } = useUi();

  return (
    <div className={styles.region} role="status" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <div key={toast.id} className={[styles.toast, toneClass[toast.tone]].filter(Boolean).join(' ')}>
          {toast.icon && <Icon name={toast.icon} size={18} />}
          <span className={styles.message}>{toast.message}</span>
          <button
            type="button"
            className={styles.dismiss}
            onClick={() => dismissToast(toast.id)}
            aria-label="Stäng meddelande"
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
