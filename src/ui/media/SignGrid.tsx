import { useId, useState } from 'react';
import styles from './SignGrid.module.css';
import { RoadSign } from '@/ui/illustrations/RoadSign';
import { RoadMarking } from '@/ui/illustrations/RoadMarking';
import { getRoadSign } from '@/content/road-signs';
import { getRoadMarking } from '@/content/road-markings';

/**
 * A group of road signs, shown as a grid.
 *
 * Progressive disclosure on purpose: a wall of sixty icons teaches nothing, so
 * the grid shows the sign and its name, and the meaning appears only for the
 * one the learner opens. Exactly one is open at a time, which keeps the page
 * from growing under the reader's thumb.
 */

export interface SignGridProps {
  signIds: string[];
  title?: string;
}

export function SignGrid({ signIds, title }: SignGridProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const panelId = useId();

  const signs = signIds.map((id) => getRoadSign(id)).filter((s) => s !== undefined);
  if (signs.length === 0) return null;

  return (
    <section className={styles.wrap}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <ul className={styles.grid}>
        {signs.map((sign) => {
          const open = openId === sign.id;
          return (
            <li key={sign.id} className={styles.cell}>
              <button
                type="button"
                className={[styles.card, open ? styles.cardOpen : ''].filter(Boolean).join(' ')}
                aria-expanded={open}
                aria-controls={open ? `${panelId}-${sign.id}` : undefined}
                onClick={() => setOpenId(open ? null : sign.id)}
              >
                <span className={styles.art}>
                  <RoadSign name={sign.id} size={64} decorative />
                </span>
                <span className={styles.name}>{sign.name}</span>
                <span className={styles.code}>{sign.code}</span>
              </button>
              {open && (
                <div className={styles.detail} id={`${panelId}-${sign.id}`}>
                  <p className={styles.short}>{sign.shortMeaning}</p>
                  <p className={styles.long}>{sign.longMeaning}</p>
                  <p className={styles.alt}>{sign.altText}</p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export interface SignCompareProps {
  title: string;
  leftId: string;
  rightId: string;
  note: string;
}

/**
 * Two signs that are genuinely confused with each other, side by side.
 *
 * The pairing is the teaching: seeing them apart is easy, seeing them together
 * is what makes the difference stick.
 */
export function SignCompare({ title, leftId, rightId, note }: SignCompareProps) {
  const left = getRoadSign(leftId);
  const right = getRoadSign(rightId);
  if (!left || !right) return null;

  return (
    <section className={styles.compare}>
      <h2 className={styles.compareTitle}>{title}</h2>
      <div className={styles.pair}>
        {[left, right].map((sign) => (
          <div key={sign.id} className={styles.pairItem}>
            <RoadSign name={sign.id} size={72} />
            <span className={styles.pairName}>{sign.name}</span>
            <span className={styles.pairMeaning}>{sign.shortMeaning}</span>
          </div>
        ))}
      </div>
      <p className={styles.compareNote}>{note}</p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Road markings                                                       */
/* ------------------------------------------------------------------ */

export interface MarkingGridProps {
  markingIds: string[];
  title?: string;
}

/**
 * The same disclosure pattern as the sign grid, for markings.
 *
 * Markings need a second line the signs do not: what the marking *is* and what
 * it *requires of you* are different things, because a line's meaning depends
 * on which side of it you are driving.
 */
export function MarkingGrid({ markingIds, title }: MarkingGridProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const panelId = useId();

  const markings = markingIds.map((id) => getRoadMarking(id)).filter((m) => m !== undefined);
  if (markings.length === 0) return null;

  return (
    <section className={styles.wrap}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <ul className={styles.grid}>
        {markings.map((marking) => {
          const open = openId === marking.id;
          return (
            <li key={marking.id} className={styles.cell}>
              <button
                type="button"
                className={[styles.card, open ? styles.cardOpen : ''].filter(Boolean).join(' ')}
                aria-expanded={open}
                aria-controls={open ? `${panelId}-${marking.id}` : undefined}
                onClick={() => setOpenId(open ? null : marking.id)}
              >
                <span className={styles.artPlain}>
                  <RoadMarking name={marking.id} size={64} decorative />
                </span>
                <span className={styles.name}>{marking.name}</span>
                <span className={styles.code}>{marking.code}</span>
              </button>
              {open && (
                <div className={styles.detail} id={`${panelId}-${marking.id}`}>
                  <p className={styles.short}>{marking.meaning}</p>
                  <p className={styles.long}>{marking.forDriver}</p>
                  <p className={styles.alt}>{marking.altText}</p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export interface MarkingCompareProps {
  title: string;
  leftId: string;
  rightId: string;
  note: string;
}

export function MarkingCompare({ title, leftId, rightId, note }: MarkingCompareProps) {
  const left = getRoadMarking(leftId);
  const right = getRoadMarking(rightId);
  if (!left || !right) return null;

  return (
    <section className={styles.compare}>
      <h2 className={styles.compareTitle}>{title}</h2>
      <div className={styles.pair}>
        {[left, right].map((marking) => (
          <div key={marking.id} className={styles.pairItemPlain}>
            <RoadMarking name={marking.id} size={80} />
            <span className={styles.pairNameLight}>{marking.name}</span>
            <span className={styles.pairMeaningLight}>{marking.meaning}</span>
          </div>
        ))}
      </div>
      <p className={styles.compareNote}>{note}</p>
    </section>
  );
}
