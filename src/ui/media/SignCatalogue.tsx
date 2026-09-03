import { useCallback, useMemo, useRef, useState, useId } from 'react';
import { RoadSign } from '@/ui/illustrations/RoadSign';
import { ROAD_SIGNS } from '@/content/road-signs';
import { SignDetail } from './SignDetail';
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
 * sync; the registry is small enough to filter on every keystroke.
 *
 * A card holds a name, a code and one line. Opening one gives the rest in a
 * dialog — the long meaning, the written description, the variants under the
 * same code, and the two or three signs it is genuinely mistaken for. The
 * search you were in the middle of stays underneath.
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
  const [openId, setOpenId] = useState<string | null>(null);
  const searchId = useId();
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  /**
   * Put the keyboard back where it came from, once the dialog has closed.
   *
   * The browser's own restoration aims at whatever was focused when the dialog
   * opened, and that is only the card when the card was clicked with a mouse.
   * Opened from the keyboard, or reached any other way, it can be the search
   * field or nothing at all — so the opener is remembered explicitly. If it is
   * gone from the DOM by the time the dialog closes, the search field keeps the
   * keyboard inside the catalogue rather than at the top of the document.
   */
  const closeDetail = useCallback(() => setOpenId(null), []);

  const restoreFocus = useCallback(() => {
    const opener = openerRef.current;
    // Idempotent: the dialog reports its close once, but the button, Escape
    // and a backdrop click all ask for it, so the second caller must not drag
    // the keyboard somewhere the first one did not put it.
    if (!opener) return;
    openerRef.current = null;
    if (opener.isConnected) opener.focus();
    else searchRef.current?.focus();
  }, []);

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
          ref={searchRef}
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
          <li key={sign.id} className={styles.cell}>
            <button
              type="button"
              className={styles.card}
              onClick={(event) => {
                openerRef.current = event.currentTarget;
                setOpenId(sign.id);
              }}
            >
              {/* The artwork is described by the name and meaning beside it,
                  so a second reading of the same sign would be noise. */}
              <span className={styles.art}>
                <RoadSign name={sign.id} size={64} decorative />
              </span>
              <span className={styles.name}>{sign.name}</span>
              <span className={styles.code}>{sign.code}</span>
              <span className={styles.meaning}>{sign.shortMeaning}</span>
              <span className={styles.srOnly}>Visa detaljer</span>
            </button>
          </li>
        ))}
      </ul>

      <SignDetail signId={openId} onClose={closeDetail} onClosed={restoreFocus} />
    </section>
  );
}
