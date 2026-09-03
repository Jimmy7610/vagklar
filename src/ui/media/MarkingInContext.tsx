import { RoadMarking } from '@/ui/illustrations/RoadMarking';
import { SourceImageFigure } from '@/ui/media/SourceImageFigure';
import { getRoadMarking } from '@/content/road-markings';
import styles from './SignInContext.module.css';

/**
 * The marking as Vägklar draws it, next to the same marking photographed.
 *
 * The counterpart to SignInContext, and needed for a sharper reason. A sign at
 * least looks like its catalogue picture: same colours, same shape, just
 * smaller and at an angle. A road marking does not. The drawing shows it from
 * directly above, at full contrast, in isolation. On the road you see it in
 * perspective, foreshortened to a sliver, worn through to the asphalt, wet, and
 * with three other markings crossing it.
 *
 * So the pair is the lesson: the drawing names the thing, the photograph is
 * what you will actually have to recognise.
 */

export interface MarkingInContextProps {
  markingId: string;
  imageId: string;
  /** What to look for in the photograph. Never states what the marking means. */
  notice: string;
}

export function MarkingInContext({ markingId, imageId, notice }: MarkingInContextProps) {
  const marking = getRoadMarking(markingId);
  if (!marking) return null;

  return (
    <div className={styles.pair}>
      <figure className={styles.ideal}>
        <span className={styles.art}>
          <RoadMarking name={marking.id} size={96} />
        </span>
        <figcaption className={styles.idealCaption}>
          <strong className={styles.name}>{marking.name}</strong>
          <span className={styles.code}>{marking.code}</span>
          <span className={styles.label}>Så ritas markeringen</span>
        </figcaption>
      </figure>

      <div className={styles.real}>
        <SourceImageFigure
          imageId={imageId}
          prompt="Så ser den ut i körbanan"
          caption={notice}
          sizes="(min-width: 1024px) 520px, 100vw"
        />
      </div>
    </div>
  );
}
