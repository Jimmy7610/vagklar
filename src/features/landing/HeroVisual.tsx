import { useEffect, useRef, useState } from 'react';
import styles from './HeroVisual.module.css';
import { ProgressRing, masteryColor } from '@/ui/components/ProgressRing';
import { Icon } from '@/ui/icons/Icon';
import { prefersReducedMotion } from '@/app/state/theme';

/**
 * The hero composition.
 *
 * Built from the same components the product uses, not a screenshot: the ring
 * is the real `ProgressRing`, the mastery bars use the real mastery colour
 * ramp. The numbers are illustrative sample data and are clearly labelled as
 * an example — the actual dashboard never shows invented progress.
 */

interface SampleArea {
  name: string;
  value: number;
  tag: string;
  className: string;
}

const SAMPLE_AREAS: SampleArea[] = [
  { name: 'Högerregeln', value: 81, tag: 'Stark', className: 'cardA' },
  { name: 'Utfartsregeln', value: 43, tag: 'Svag', className: 'cardB' },
  { name: 'Mörkerkörning', value: 72, tag: 'På väg', className: 'cardC' },
];

/** Very small parallax. Purely decorative and disabled for reduced motion. */
function useParallax(strength: number) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(max-width: 899px)').matches) return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const element = ref.current;
        if (!element) return;
        const offset = Math.max(-60, Math.min(60, window.scrollY * strength));
        element.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [strength]);

  return ref;
}

export function HeroVisual() {
  const deviceRef = useParallax(-0.018);
  const [ringValue, setRingValue] = useState<number | null>(null);

  // Fill the ring once on mount so the hero reads as a live measurement.
  useEffect(() => {
    const timer = setTimeout(() => setRingValue(86), 120);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.stage}>
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.device} ref={deviceRef}>
        <div className={styles.notch} aria-hidden="true" />
        <div className={styles.screen}>
          <div className={styles.screenHead}>
            <span className={styles.screenGreeting}>God kväll</span>
            <span className={styles.screenStreak}>
              <Icon name="flame" size={11} />6
            </span>
          </div>

          <div className={styles.ringWrap}>
            <ProgressRing
              value={ringValue}
              size={148}
              thickness={11}
              label="Provberedskap"
              valueFontSize="2.75rem"
              ariaLabel="Exempel: provberedskap 86 procent"
            />
            <p className={styles.ringCaption}>Du är nära provklar</p>
          </div>

          <div className={styles.nextStep}>
            <div className={styles.nextStepLabel}>Nästa bästa steg</div>
            <div className={styles.nextStepTitle}>Väjningsregler</div>
            <div className={styles.nextStepMeta}>7 frågor · ca 4 min</div>
            <div className={styles.nextStepCta}>Fortsätt träna</div>
          </div>
        </div>
      </div>

      <div className={styles.cards}>
        {SAMPLE_AREAS.map((area) => (
          <div
            key={area.name}
            className={[styles.card, styles[area.className]].filter(Boolean).join(' ')}
          >
            <div className={styles.cardName}>{area.name}</div>
            <div className={styles.cardValue}>
              <span className={styles.cardNumber} style={{ color: masteryColor(area.value) }}>
                {area.value}%
              </span>
              <span className={styles.cardTag}>{area.tag}</span>
            </div>
            <div className={styles.bar}>
              <div
                className={styles.barFill}
                style={{ width: `${area.value}%`, backgroundColor: masteryColor(area.value) }}
              />
            </div>
          </div>
        ))}

        <div className={[styles.card, styles.cardD, styles.recommendation].join(' ')}>
          <div className={styles.cardName}>Rekommenderat</div>
          <div className={styles.recommendationTitle}>Repetera 5 frågor</div>
          <div className={styles.recommendationMeta}>Utfartsregeln · förfaller idag</div>
        </div>
      </div>
    </div>
  );
}
