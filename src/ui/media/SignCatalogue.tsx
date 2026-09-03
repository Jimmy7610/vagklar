import { useMemo, useState, useId } from 'react';
import { RoadSign } from '@/ui/illustrations/RoadSign';
import { signAltText } from '@/ui/illustrations/roadSignAlt';
import { ROAD_SIGNS } from '@/content/road-signs';
import styles from './SignCatalogue.module.css';
import type { SignCategory } from '@/content/road-signs';

/**
 * All the signs, searchable.
 *
 * The registry went from 58 to 99 when the book's own artwork became usable,
 * and at that size a grid stops being a catalogue and becomes a wall. Someone
 * revising the evening before a test wants one sign — the yellow diamond, or
 * the one with the lorry — not a scroll through everything.
 *
 * So: search across code, name and meaning, and a filter by the four shapes the
 * theory actually teaches. No backend, no route of its own, no index to keep in
 * sync; 99 entries is small enough to filter on every keystroke.
 */

const GROUPS: { id: SignCategory | 'alla'; label: string }[] = [
  { id: 'alla', label: 'Alla' },
  { id: 'varning', label: 'Varning' },
  { id: 'vajningsplikt', label: 'Väjning' },
  { id: 'forbud', label: 'Förbud' },
  { id: 'pabud', label: 'Påbud' },
  { id: 'anvisning', label: 'Anvisning' },
  { id: 'tillaggstavla', label: 'Tilläggstavlor' },
];

export function SignCatalogue() {
  const [term, setTerm] = useState('');
  const [group, setGroup] = useState<SignCategory | 'alla'>('alla');
  const searchId = useId();

  const matches = useMemo(() => {
    const needle = term.trim().toLocaleLowerCase('sv');
    return ROAD_SIGNS.filter((sign) => {
      if (group !== 'alla' && sign.category !== group) return false;
      if (!needle) return true;
      return (
        sign.code.toLocaleLowerCase('sv').includes(needle) ||
        sign.name.toLocaleLowerCase('sv').includes(needle) ||
        sign.shortMeaning.toLocaleLowerCase('sv').includes(needle)
      );
    });
  }, [term, group]);

  return (
    <section className={styles.catalogue}>
      <div className={styles.controls}>
        <label className={styles.searchLabel} htmlFor={searchId}>
          Sök bland {ROAD_SIGNS.length} märken
        </label>
        <input
          id={searchId}
          className={styles.search}
          type="search"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Kod, namn eller betydelse — t.ex. A25 eller huvudled"
        />
        <div className={styles.filters} role="group" aria-label="Filtrera på sorts märke">
          {GROUPS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className={[styles.filter, group === entry.id ? styles.filterActive : '']
                .filter(Boolean)
                .join(' ')}
              aria-pressed={group === entry.id}
              onClick={() => setGroup(entry.id)}
            >
              {entry.label}
            </button>
          ))}
        </div>
      </div>

      {/* Announced, because filtering happens without any visible page change
          for someone who cannot see the grid shrink. */}
      <p className={styles.count} aria-live="polite">
        {matches.length === 0
          ? 'Inga märken matchar.'
          : `${matches.length} av ${ROAD_SIGNS.length} märken`}
      </p>

      <ul className={styles.grid}>
        {matches.map((sign) => (
          <li key={sign.id} className={styles.card}>
            <span className={styles.art}>
              <RoadSign name={sign.id} size={64} alt={signAltText(sign.id)} />
            </span>
            <span className={styles.name}>{sign.name}</span>
            <span className={styles.code}>{sign.code}</span>
            <span className={styles.meaning}>{sign.shortMeaning}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
