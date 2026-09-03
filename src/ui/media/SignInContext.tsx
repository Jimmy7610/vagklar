import { RoadSign } from '@/ui/illustrations/RoadSign';
import { signAltText } from '@/ui/illustrations/roadSignAlt';
import { SourceImageFigure } from '@/ui/media/SourceImageFigure';
import { getRoadSign } from '@/content/road-signs';
import styles from './SignInContext.module.css';

/**
 * The sign as the catalogue draws it, next to the sign as you actually meet it.
 *
 * A learner who can name every sign on a white background can still miss one on
 * the road, because nothing on the road looks like the catalogue. The sign is
 * small, off to the side, at an angle, half in front of a tree, and it arrives
 * while you are looking at something else.
 *
 * Both pictures here are the book's: the sign face from its sign appendix, the
 * photograph from the chapter that teaches the rule. Putting them side by side
 * is the whole point — neither half teaches recognition on its own.
 */

export interface SignInContextProps {
  signId: string;
  imageId: string;
  /** What to look for in the photograph. Never states the sign's meaning. */
  notice: string;
}

export function SignInContext({ signId, imageId, notice }: SignInContextProps) {
  const sign = getRoadSign(signId);
  if (!sign) return null;

  return (
    <div className={styles.pair}>
      <figure className={styles.ideal}>
        <span className={styles.art}>
          <RoadSign name={sign.id} size={96} alt={signAltText(sign.id)} />
        </span>
        <figcaption className={styles.idealCaption}>
          <strong className={styles.name}>{sign.name}</strong>
          <span className={styles.code}>{sign.code}</span>
          <span className={styles.label}>Så ser märket ut</span>
        </figcaption>
      </figure>

      <div className={styles.real}>
        <SourceImageFigure
          imageId={imageId}
          prompt="Så möter du det i verkligheten"
          caption={notice}
          sizes="(min-width: 1024px) 520px, 100vw"
        />
      </div>
    </div>
  );
}
