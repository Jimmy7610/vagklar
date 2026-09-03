import { useEffect, useId, useRef, useState } from 'react';
import styles from './SourceImageFigure.module.css';
import { getSourceImage } from '@/content/source-images';
import { getSource } from '@/content/sources';
import { resolveSourceImage } from './sourceImageAssets';
import { Icon } from '@/ui/icons/Icon';

/**
 * Where the photograph sits, which decides how much room it may take.
 *
 * A lesson image is the thing being discussed, so it gets the reading column
 * and room to breathe. A question image is evidence the learner has to weigh
 * against four alternatives, and those alternatives have to stay on screen —
 * a photograph that pushes them below the fold turns a reasoning task into a
 * scrolling task.
 */
export type SourceImageVariant = 'lesson' | 'question';

interface SourceImageFigureProps {
  /** Id in the source-image registry. */
  imageId: string;
  /** Override the registry caption, e.g. to pose a question about the image. */
  caption?: string;
  /** Prompt shown above the image in lessons: "Vad ska du lägga märke till?" */
  prompt?: string;
  /** How much room the image may take. Defaults to the lesson treatment. */
  variant?: SourceImageVariant;
  /**
   * `sizes` for the responsive srcset. Defaults to the reading column width,
   * which is what almost every use needs.
   */
  sizes?: string;
  /** Eager only for an image that is above the fold on load. */
  priority?: boolean;
  /**
   * Whether to show the descriptive caption.
   *
   * Off for questions. The registry caption explains what the picture teaches,
   * which is exactly the thing a question is asking the learner to work out —
   * showing it next to the alternatives would hand over the answer. The credit
   * line is never suppressed.
   */
  showCaption?: boolean;
}

/**
 * A licensed source photograph, presented with its caption, its accessible
 * description and its attribution.
 *
 * Attribution is not optional decoration here: the image belongs to a third
 * party and the figure is the only place that says so, so it is rendered from
 * the registry rather than passed in by the caller.
 *
 * The long description is always in the DOM (visually hidden), so a learner
 * using a screen reader gets the detail the exercise depends on rather than a
 * one-line alt text.
 *
 * Nothing here crops. Traffic photographs carry their meaning at the edges —
 * the sign on the verge, the cyclist alongside the parked cars — so the frame
 * fits the whole picture and lets the height fall where the aspect ratio puts
 * it, capped so a tall image cannot take over a phone screen.
 */
export function SourceImageFigure({
  imageId,
  caption,
  prompt,
  variant = 'lesson',
  sizes = '(min-width: 1024px) 640px, 100vw',
  priority = false,
  showCaption = true,
}: SourceImageFigureProps) {
  const image = getSourceImage(imageId);
  const [expanded, setExpanded] = useState(false);
  /**
   * Set when the file cannot be fetched.
   *
   * The photographs are cached at runtime, not precached, so a learner who
   * goes offline before ever seeing a particular one will find it missing.
   * Without this the browser draws its broken-image placeholder and the
   * lesson loses its point silently. With it the learner gets the written
   * description instead, which is written to carry the same information —
   * the same fallback a screen-reader user always gets.
   */
  const [failed, setFailed] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const reactId = useId();

  /**
   * A native <dialog> rather than a div with a role.
   *
   * showModal() gives the modal semantics, the focus trap, the inert
   * background and Escape-to-close for free — all things a hand-rolled
   * overlay gets subtly wrong. Clicking the backdrop closes it too, wired
   * through a native listener because the backdrop is part of the dialog's
   * own box and has no element of its own to put a handler on.
   */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    if (expanded && !dialog.open) dialog.showModal();

    const onClose = () => {
      setExpanded(false);
      openerRef.current?.focus();
    };
    const onBackdropClick = (event: MouseEvent) => {
      if (event.target === dialog) dialog.close();
    };
    dialog.addEventListener('close', onClose);
    dialog.addEventListener('click', onBackdropClick);
    return () => {
      dialog.removeEventListener('close', onClose);
      dialog.removeEventListener('click', onBackdropClick);
    };
  }, [expanded]);

  if (!image) return null;

  const kind = image.kind ?? 'photo';

  /**
   * The caption is hidden exactly while a question is open, so the same flag
   * decides whether the accessible text has to hold back too. Falling through
   * to the literal text is right: most descriptions give nothing away, and a
   * missing quiz-safe variant should degrade to a full description rather than
   * to silence.
   */
  const quizSafe = !showCaption;
  const altText = quizSafe ? (image.quizSafeAltText ?? image.altText) : image.altText;
  const description = quizSafe
    ? (image.quizSafeDescription ?? image.quizSafeAltText ?? image.longDescription)
    : image.longDescription;
  // Words printed inside a diagram are its content, but in a question they can
  // also be the answer. Held back under the same flag.
  const labels = quizSafe && image.quizSafeAltText ? undefined : image.labelText;

  const resolved = resolveSourceImage(image.asset);
  const source = getSource(image.sourceId);
  const descriptionId = `${reactId}-desc`;
  // A drawing is not a photograph, and crediting it as one misdescribes what
  // the reader is looking at as well as what the rights holder supplied.
  const credit = (
    <span className={styles.credit}>
      {kind === 'diagram' ? 'Illustration' : 'Foto'}: {source?.publisher ?? 'Körkortonline.se'}, s.{' '}
      {image.sourcePage} · © {image.rightsHolder} · används med tillstånd
    </span>
  );

  // No asset on disk: fall back to the written description rather than a broken
  // image. This is also what a learner sees if the file has not reached the
  // cache offline, so the content stays usable either way.
  if (!resolved || failed) {
    return (
      <figure className={styles.figure}>
        {prompt && <p className={styles.prompt}>{prompt}</p>}
        <p className={styles.fallback}>
          {description}
          {labels && labels.length > 0 ? ` Text i bilden: ${labels.join(', ')}.` : ''}
        </p>
        <figcaption className={styles.caption}>
          {showCaption && <span className={styles.captionText}>{caption ?? image.caption}</span>}
          {credit}
        </figcaption>
      </figure>
    );
  }

  const picture = (
    <img
      className={styles.image}
      src={resolved.src}
      srcSet={resolved.srcSet}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={altText}
      aria-describedby={descriptionId}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
    />
  );

  const expandButton = (
    <button
      ref={openerRef}
      type="button"
      className={styles.expand}
      onClick={() => setExpanded(true)}
      aria-label={`Förstora bilden: ${image.title}`}
    >
      <Icon name="maximize" size={16} />
    </button>
  );

  return (
    <figure
      className={[styles.figure, styles[variant], kind === 'diagram' ? styles.diagram : '']
        .filter(Boolean)
        .join(' ')}
    >
      {prompt && <p className={styles.prompt}>{prompt}</p>}

      {/* Traffic detail is small: a sign face, an indicator, a cyclist at the
          kerb. The expand exists so a learner can look closer without the page
          having to give the photograph that much room by default.

          On a photograph it sits in a corner, where there is slack. A diagram
          is cropped to its content, so the same corner holds the towed car or
          the drawbar of a trailer — there the button goes underneath instead
          of on top. */}
      <div
        className={styles.frame}
        style={{ aspectRatio: `${image.width} / ${image.height}` }}
      >
        {picture}
        {kind === 'diagram' ? null : expandButton}
      </div>

      {kind === 'diagram' ? <div className={styles.expandRow}>{expandButton}</div> : null}

      <p id={descriptionId} className={styles.srOnly}>
        {description}
        {/* The numbers drawn inside a diagram are its content. Rendered as
            pixels they reach nobody using a screen reader, so they are read
            out here as well. */}
        {labels && labels.length > 0 ? ` Text i bilden: ${labels.join(', ')}.` : ''}
      </p>

      <figcaption className={styles.caption}>
        {showCaption && <span className={styles.captionText}>{caption ?? image.caption}</span>}
        {credit}
      </figcaption>

      <dialog ref={dialogRef} className={styles.overlay} aria-label={image.title}>
        {expanded && (
          <div className={styles.overlayInner}>
            <img
              className={styles.overlayImage}
              src={resolved.src}
              srcSet={resolved.srcSet}
              sizes="100vw"
              alt={altText}
              decoding="async"
            />
            <p className={styles.overlayCredit}>{credit}</p>
            <button
              type="button"
              className={styles.close}
              // showModal() focuses the first focusable child, which is this
              // button — so no autoFocus is needed to land the keyboard here.
              onClick={() => dialogRef.current?.close()}
            >
              <Icon name="close" size={16} />
              Stäng
            </button>
          </div>
        )}
      </dialog>
    </figure>
  );
}
