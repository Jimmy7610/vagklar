import styles from './SourceImageFigure.module.css';
import { getSourceImage } from '@/content/source-images';
import { getSource } from '@/content/sources';
import { resolveSourceImage } from './sourceImageAssets';

interface SourceImageFigureProps {
  /** Id in the source-image registry. */
  imageId: string;
  /** Override the registry caption, e.g. to pose a question about the image. */
  caption?: string;
  /** Prompt shown above the image in lessons: "Vad ska du lägga märke till?" */
  prompt?: string;
  /**
   * `sizes` for the responsive srcset. Defaults to the lesson/question column
   * width, which is what almost every use needs.
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
 */
export function SourceImageFigure({
  imageId,
  caption,
  prompt,
  sizes = '(min-width: 1024px) 640px, 100vw',
  priority = false,
  showCaption = true,
}: SourceImageFigureProps) {
  const image = getSourceImage(imageId);
  if (!image) return null;

  const resolved = resolveSourceImage(image.asset);
  const source = getSource(image.sourceId);
  const descriptionId = `${image.id}-desc`;

  // No asset on disk: fall back to the written description rather than a
  // broken image. The content is still usable.
  if (!resolved) {
    return (
      <figure className={styles.figure}>
        <p className={styles.fallback}>{image.longDescription}</p>
        <figcaption className={styles.caption}>{caption ?? image.caption}</figcaption>
      </figure>
    );
  }

  return (
    <figure className={styles.figure}>
      {prompt && <p className={styles.prompt}>{prompt}</p>}
      <div className={styles.frame} style={{ aspectRatio: `${image.width} / ${image.height}` }}>
        <img
          className={styles.image}
          src={resolved.src}
          srcSet={resolved.srcSet}
          sizes={sizes}
          width={image.width}
          height={image.height}
          alt={image.altText}
          aria-describedby={descriptionId}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
        />
      </div>
      <p id={descriptionId} className={styles.srOnly}>
        {image.longDescription}
      </p>
      <figcaption className={styles.caption}>
        {showCaption && <span className={styles.captionText}>{caption ?? image.caption}</span>}
        <span className={styles.credit}>
          Foto: {source?.publisher ?? 'Körkortonline.se'}, s. {image.sourcePage} · ©{' '}
          {image.rightsHolder} · används med tillstånd
        </span>
      </figcaption>
    </figure>
  );
}
