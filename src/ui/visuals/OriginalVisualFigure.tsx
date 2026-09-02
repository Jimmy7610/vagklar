import { useId } from 'react';
import { ORIGINAL_VISUAL_GLYPHS } from './originalVisualGlyphs';
import { getOriginalVisual } from '@/content/original-visuals';
import styles from './OriginalVisualFigure.module.css';

/**
 * Renders one of Vägklar's own teaching diagrams.
 *
 * The counterpart to SourceImageFigure, and deliberately built to look like it:
 * a learner should not have to care which pictures Vägklar drew and which it
 * licensed. What differs is the credit line and where the pixels come from.
 *
 * These are vectors held in code, which has three consequences worth knowing.
 * They are available offline the moment the app is, because they ship inside a
 * JavaScript chunk rather than as files fetched later. They stay sharp at any
 * zoom, so there is no expand control — the browser's own zoom does a better
 * job than a modal would. And they cost bytes in a chunk rather than in the
 * image cache, which is why the drawings live in a module that only the lesson
 * and question routes pull in.
 */

export interface OriginalVisualFigureProps {
  visualId: string;
  /** Question above the drawing, to point the reader at what to look for. */
  prompt?: string;
  /** Overrides the registry caption. */
  caption?: string;
  /**
   * Captions explain what the drawing teaches, which in a question is the
   * answer. Question surfaces pass false.
   */
  showCaption?: boolean;
}

export function OriginalVisualFigure({
  visualId,
  prompt,
  caption,
  showCaption = true,
}: OriginalVisualFigureProps) {
  const reactId = useId();
  const visual = getOriginalVisual(visualId);

  if (!visual || visual.status !== 'approved') return null;

  const glyph = ORIGINAL_VISUAL_GLYPHS[visual.rendererId];
  if (!glyph) return null;

  const descriptionId = `${reactId}-desc`;

  return (
    <figure className={styles.figure}>
      {prompt && <p className={styles.prompt}>{prompt}</p>}

      <div className={styles.plate}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${visual.width} ${visual.height}`}
          role="img"
          aria-labelledby={descriptionId}
          preserveAspectRatio="xMidYMid meet"
        >
          {glyph}
        </svg>
      </div>

      {/* The drawing's own words, plus everything printed inside it. Text drawn
          as vector paths is invisible to a screen reader, so it is repeated
          here — the same rule the licensed diagrams follow. */}
      <p id={descriptionId} className={styles.srOnly}>
        {visual.longDescription}
        {visual.labelText.length > 0 ? ` Text i bilden: ${visual.labelText.join(', ')}.` : ''}
      </p>

      <figcaption className={styles.caption}>
        {showCaption && <span className={styles.captionText}>{caption ?? visual.caption}</span>}
        <span className={styles.credit}>Illustration: Vägklar · {visual.copyright}</span>
      </figcaption>
    </figure>
  );
}

export function hasOriginalVisual(id: string | undefined): boolean {
  if (!id) return false;
  const visual = getOriginalVisual(id);
  return Boolean(visual && visual.status === 'approved' && visual.rendererId in ORIGINAL_VISUAL_GLYPHS);
}
