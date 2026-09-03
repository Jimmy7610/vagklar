import { GLYPH_VIEW_BOX, SIGN_GLYPHS, glyphAspect } from './signGlyphs';
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

interface RoadSignBase {
  name: string;
  size?: number;
}

/**
 * Either the sign is described, or it is explicitly decorative.
 *
 * Expressed as a union rather than an optional string so that forgetting the
 * description is a compile error instead of a silently unlabelled image. A sign
 * inside an assembly is decorative because the assembly describes the whole
 * post; a sign on its own never is.
 */
export type RoadSignProps =
  | (RoadSignBase & { decorative: true; alt?: string })
  | (RoadSignBase & { decorative?: false;
  /**
   * How the sign is described to someone who cannot see it.
   *
   * Required, and deliberately not defaulted from the registry here. The
   * registry is 99 signs of Swedish prose, and the landing page renders a
   * scenario with two signs on it — importing the whole thing to look up an
   * alt text that the caller already has cost 23 kB gzip on the startup path.
   * Callers that do want the registry's wording use `signAltText`, which lives
   * on the lazy side of the split.
   */
  alt: string });

export function RoadSign({ name, size = 96, alt, decorative = false }: RoadSignProps) {
  const label = alt ?? '';
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

  // `size` is the width in both branches, so a vector sign and a photographed
  // one line up on the same post. The height follows the drawing.
  return (
    <svg
      width={size}
      height={size * glyphAspect(name)}
      viewBox={GLYPH_VIEW_BOX[name] ?? '0 0 100 100'}
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
