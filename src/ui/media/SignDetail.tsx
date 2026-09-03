import { useEffect, useId, useRef } from 'react';
import { RoadSign } from '@/ui/illustrations/RoadSign';
import { Icon } from '@/ui/icons/Icon';
import {
  confusableSigns,
  getRoadSign,
  signVariants,
  SIGN_CATEGORY_LABELS,
} from '@/content/road-signs';
import styles from './SignDetail.module.css';

/**
 * Everything the registry knows about one sign, opened from the catalogue.
 *
 * The catalogue card can hold a name, a code and one line of meaning. That is
 * enough to find a sign and not enough to learn it: the long meaning, the
 * written description, the variants that share the code, and above all the two
 * or three signs it is genuinely mistaken for all have to go somewhere.
 *
 * A dialog rather than a route. The catalogue is a search you are in the middle
 * of — a filter typed, a category chosen, a scroll position — and navigating
 * away throws all of it out and makes Back the only way home. A dialog keeps
 * the search underneath and closes onto exactly the card you opened.
 *
 * Native <dialog> with showModal(), for the same reason SourceImageFigure uses
 * one: the focus trap, the inert background, Escape-to-close and the modal
 * semantics are the browser's, not a hand-rolled approximation that is subtly
 * wrong on one platform. Focus return is the one part that is ours, because
 * the browser only restores focus if the opener is still in the DOM — and
 * filtering the catalogue can remove it.
 *
 * `signId` is the single source of truth for whether the dialog is open, and
 * every way of closing it — the button, the backdrop, Escape — goes through
 * `onClose` rather than calling `dialog.close()` and waiting for the `close`
 * event to feed the state back. Routing state through an event the element
 * fires about itself means a missed event leaves the component believing a
 * closed dialog is still open, and the next click on the same card sets the
 * state it already has and therefore reopens nothing.
 */

export interface SignDetailProps {
  /** Sign to show, or null when the dialog is closed. */
  signId: string | null;
  onClose: () => void;
  /**
   * Called once the dialog has actually closed, for putting the keyboard back.
   *
   * The timing is the whole point. close() runs the browser's own focus
   * restoration as part of closing, and that restoration aims at whatever was
   * focused when showModal() ran. Moving focus before the dialog closes
   * therefore gets overwritten a moment later; moving it here does not.
   */
  onClosed?: () => void;
}

export function SignDetail({ signId, onClose, onClosed }: SignDetailProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  const sign = signId ? getRoadSign(signId) : undefined;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    if (signId && !dialog.open) dialog.showModal();
    if (!signId && dialog.open) {
      dialog.close();
      onClosed?.();
    }

    // Escape is the browser's to handle, and it closes the dialog without
    // asking us. This is how that gets back into the state.
    const handleClose = () => onClose();
    const handleBackdrop = (event: MouseEvent) => {
      // The backdrop belongs to the dialog's own box, so there is no element
      // of its own to hang a handler on — a click that lands on the dialog
      // itself rather than on its content is a backdrop click.
      if (event.target === dialog) onClose();
    };
    dialog.addEventListener('close', handleClose);
    dialog.addEventListener('click', handleBackdrop);
    return () => {
      dialog.removeEventListener('close', handleClose);
      dialog.removeEventListener('click', handleBackdrop);
    };
  }, [signId, onClose, onClosed]);

  const family = sign ? signVariants(sign.code) : [];
  const confusable = sign ? confusableSigns(sign.id) : [];

  return (
    <dialog ref={dialogRef} className={styles.dialog} aria-labelledby={headingId}>
      {sign && (
        <div className={styles.inner}>
          <div className={styles.head}>
            {/* Decorative: the "Så ser märket ut" group below states the same
                description in text, and announcing the artwork as well read the
                whole sentence twice in a row. */}
            <span className={styles.art}>
              <RoadSign name={sign.id} size={104} decorative />
            </span>
            <div className={styles.headText}>
              {/* The only heading in the dialog. Everything below it is a
                  labelled group, so a screen reader's heading list stays a
                  list of signs rather than a list of section names repeated
                  once per sign. */}
              <h2 id={headingId} className={styles.name}>
                {sign.name}
              </h2>
              <p className={styles.meta}>
                <span className={styles.code}>{sign.code}</span>
                <span className={styles.category}>{SIGN_CATEGORY_LABELS[sign.category]}</span>
              </p>
            </div>
          </div>

          <p className={styles.short}>{sign.shortMeaning}</p>
          <p className={styles.long}>{sign.longMeaning}</p>

          <div className={styles.group} role="group" aria-label="Så ser märket ut">
            <p className={styles.groupLabel}>Så ser märket ut</p>
            <p className={styles.alt}>{sign.altText}</p>
          </div>

          {family.length > 1 && (
            <div className={styles.group} role="group" aria-label="Varianter under samma kod">
              <p className={styles.groupLabel}>Samma kod, olika utföranden</p>
              <ul className={styles.variants}>
                {family.map((variant) => (
                  <li key={variant.id} className={styles.variant}>
                    <RoadSign name={variant.id} size={44} decorative />
                    <span className={styles.variantName}>{variant.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {confusable.length > 0 && (
            <div className={styles.group} role="group" aria-label="Märken som är lätta att blanda ihop med detta">
              <p className={styles.groupLabel}>Lätt att blanda ihop med</p>
              <ul className={styles.confusable}>
                {confusable.map((other) => (
                  <li key={other.id} className={styles.confusableCard}>
                    <RoadSign name={other.id} size={52} decorative />
                    <span className={styles.confusableName}>{other.name}</span>
                    <span className={styles.confusableCode}>{other.code}</span>
                    <span className={styles.confusableMeaning}>{other.shortMeaning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="button"
            className={styles.close}
            // The only focusable element in here, so showModal() lands the
            // keyboard on it. That is the right place: the heading and the
            // meaning are read out from the dialog's label and content, and
            // the one action available is to leave.
            onClick={onClose}
          >
            <Icon name="close" size={16} />
            Stäng
          </button>
        </div>
      )}
    </dialog>
  );
}
