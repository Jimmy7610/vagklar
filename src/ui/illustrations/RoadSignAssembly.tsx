import { RoadSign } from './RoadSign';
import { getRoadSign, interpretSignAssembly } from '@/content/road-signs';
import styles from './RoadSignAssembly.module.css';

/**
 * A main sign with the supplementary plates that belong under it.
 *
 * This exists because a plate has no meaning on its own. "100 m" is not a rule;
 * it is a change to whatever rule is stated above it. Showing the two apart —
 * a sign here, a plate there, each with its own caption — teaches the pieces
 * and hides the thing that is actually hard, which is reading them together.
 *
 * So the assembly is one object: one picture, one accessible description, one
 * combined meaning. Screen readers get the whole post as a single figure rather
 * than two unrelated images, because that is what a driver sees.
 *
 * Real posts stack the plate directly beneath the sign, narrower or equal in
 * width and touching. That is what is drawn here.
 */

export interface RoadSignAssemblyProps {
  mainSignId: string;
  /** In the order they appear on the post, top to bottom. */
  plateIds?: readonly string[];
  size?: number;
  /**
   * A question shows the post and asks what it means, so it must not be
   * described by its meaning. With `quizSafe` the accessible description says
   * only what is visible, and no combined interpretation is rendered.
   */
  quizSafe?: boolean;
  /** Shown under the assembly in a lesson. Never in a question. */
  showMeaning?: boolean;
}

export function RoadSignAssembly({
  mainSignId,
  plateIds = [],
  size = 132,
  quizSafe = false,
  showMeaning = false,
}: RoadSignAssemblyProps) {
  const main = getRoadSign(mainSignId);
  if (!main) return null;

  const plates = plateIds
    .map((id) => getRoadSign(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  // What a screen reader hears. Appearance only while the question is open;
  // the plate's own description follows the sign's, in the order they hang.
  const described = [
    quizSafe ? (main.quizSafeAltText ?? main.altText) : main.altText,
    ...plates.map((p) => (quizSafe ? (p.quizSafeAltText ?? p.altText) : p.altText)),
  ].join(' Under märket: ');

  const label =
    plates.length > 0
      ? `Vägmärke med ${plates.length === 1 ? 'tilläggstavla' : 'tilläggstavlor'}. ${described}`
      : described;

  return (
    <figure className={styles.assembly} role="group" aria-label={label}>
      <div className={styles.post}>
        {/* The pictures themselves are hidden from assistive technology: the
            group above already describes the whole post, and announcing each
            image again would read the same sign twice. */}
        <RoadSign name={main.id} size={size} decorative />
        {plates.map((plate) => (
          <div key={plate.id} className={styles.plate} style={{ width: size }}>
            <RoadSign name={plate.id} size={size} decorative />
          </div>
        ))}
      </div>

      {showMeaning && !quizSafe && (
        <figcaption className={styles.meaning}>
          {interpretSignAssembly(main.id, plates.map((p) => p.id))}
        </figcaption>
      )}
    </figure>
  );
}
