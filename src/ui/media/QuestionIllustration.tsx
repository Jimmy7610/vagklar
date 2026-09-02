import { RoadSign, hasRoadSign } from '@/ui/illustrations/RoadSign';
import { RoadMarking, hasRoadMarking } from '@/ui/illustrations/RoadMarking';
import { SourceImageFigure } from '@/ui/media/SourceImageFigure';
import { OriginalVisualFigure } from '@/ui/visuals/OriginalVisualFigure';
import styles from './QuestionIllustration.module.css';
import type { Question } from '@/domain/content/types';

/**
 * Everything a question can be illustrated with, in one place.
 *
 * There are four kinds now — a licensed photograph, a licensed diagram, a drawn
 * sign or marking, and a Vägklar-original diagram — and each one used to be a
 * separate branch written out by hand in every screen that shows a question.
 * That is exactly how the exam once ended up rendering only the signs: someone
 * added photographs to the training card and there was no single place that
 * would have carried the change across.
 *
 * So the branches live here and the screens render a component. Adding a fifth
 * kind is one edit, not a hunt for every surface, and a surface that forgets to
 * call this shows no illustration at all rather than silently showing half of
 * one.
 */

export interface QuestionIllustrationProps {
  question: Question;
  /**
   * Lessons and review can show the teaching caption. A question being asked
   * cannot: the caption says what the picture teaches, which is the answer.
   */
  showCaption?: boolean;
  /** Load eagerly. True on the training card, where the image is above the fold. */
  priority?: boolean;
}

export function QuestionIllustration({
  question,
  showCaption = false,
  priority = false,
}: QuestionIllustrationProps) {
  const illustration = question.image?.illustration;
  const alt = question.image?.alt ?? '';

  return (
    <>
      {question.sourceImageId && (
        <div className={styles.block}>
          <SourceImageFigure
            imageId={question.sourceImageId}
            variant="question"
            sizes="(min-width: 1024px) 620px, 100vw"
            priority={priority}
            showCaption={showCaption}
          />
        </div>
      )}

      {question.originalVisualId && (
        <div className={styles.block}>
          <OriginalVisualFigure visualId={question.originalVisualId} showCaption={showCaption} />
        </div>
      )}

      {illustration && hasRoadMarking(illustration) && (
        <figure className={styles.plate}>
          <RoadMarking name={illustration} size={132} alt={alt} />
        </figure>
      )}

      {illustration && hasRoadSign(illustration) && (
        <figure className={styles.plate}>
          <RoadSign name={illustration} size={116} alt={alt} />
          {question.accessibilityText && (
            <figcaption className={styles.plateCaption}>{question.accessibilityText}</figcaption>
          )}
        </figure>
      )}
    </>
  );
}

/** Whether this question has anything to illustrate at all. */
export function hasIllustration(question: Question): boolean {
  const illustration = question.image?.illustration;
  return Boolean(
    question.sourceImageId ||
      question.originalVisualId ||
      (illustration && (hasRoadMarking(illustration) || hasRoadSign(illustration))),
  );
}
