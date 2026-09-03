import { SIGN_GLYPHS } from './signGlyphs';
import { getRoadSign } from '@/content/road-signs';
import { licensedSignAsset } from './roadSignAssets';

/**
 * Renders a Swedish road sign by id.
 *
 * Two possible sources, and the choice is made per sign rather than globally.
 * Where the licensed book has the sign's own artwork, that is what is shown —
 * it is authentic, and it cannot carry the drafting mistakes a redrawing can.
 * Where it does not, the vector drawing remains.
 *
 * The accessible name always comes from the registry, so a sign describes
 * itself the same way whichever picture is behind it.
 */

export interface RoadSignProps {
  name: string;
  size?: number;
  /**
   * Overrides the registry's altText.
   *
   * A question passes its own description here, because the registry's is
   * written for a lesson and can name the sign — which in "what does this sign
   * mean?" is the answer read aloud.
   */
  alt?: string;
  /** Decorative use: the sign is already described by adjacent text. */
  decorative?: boolean;
}

export function RoadSign({ name, size = 96, alt, decorative = false }: RoadSignProps) {
  const registryEntry = getRoadSign(name);
  const label = alt ?? registryEntry?.altText ?? name;
  const licensed = licensedSignAsset(name);

  if (licensed) {
    return (
      <img
        src={licensed.src}
        width={licensed.width}
        height={licensed.height}
        alt={decorative ? '' : label}
        {...(decorative ? { 'aria-hidden': true } : {})}
        loading="lazy"
        decoding="async"
        style={{
          display: 'block',
          width: size,
          height: 'auto',
          // The artwork is cropped to the sign face, so nothing is letterboxed
          // and nothing needs a background of its own.
          maxWidth: '100%',
        }}
      />
    );
  }

  const glyph = SIGN_GLYPHS[name];
  if (!glyph) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role={decorative ? 'presentation' : 'img'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      style={{ display: 'block' }}
    >
      {glyph}
    </svg>
  );
}

/** Whether anything can be drawn for this id at all. */
export function hasRoadSign(name: string | undefined): boolean {
  if (!name) return false;
  return licensedSignAsset(name) !== undefined || name in SIGN_GLYPHS;
}

/** Whether this sign is shown as the book's own artwork rather than a drawing. */
export function isLicensedSign(name: string | undefined): boolean {
  return Boolean(name && licensedSignAsset(name) !== undefined);
}
