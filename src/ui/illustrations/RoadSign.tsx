import { SIGN_GLYPHS } from './signGlyphs';
import { getRoadSign } from '@/content/road-signs';

/**
 * Renders a Swedish road sign by id.
 *
 * The drawing comes from signGlyphs; the accessible name comes from the sign
 * registry, so a sign always describes itself the same way wherever it appears.
 * An explicit `alt` overrides that only when the surrounding context needs a
 * different description.
 */

export type { RoadSignName } from './signGlyphs';

export interface RoadSignProps {
  name: string;
  size?: number;
  /** Overrides the registry's altText. Rarely needed. */
  alt?: string;
  /** Decorative use: the sign is already described by adjacent text. */
  decorative?: boolean;
}

export function RoadSign({ name, size = 96, alt, decorative = false }: RoadSignProps) {
  const glyph = SIGN_GLYPHS[name];
  if (!glyph) return null;

  const label = alt ?? getRoadSign(name)?.altText ?? name;

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

export function hasRoadSign(name: string | undefined): boolean {
  return Boolean(name && name in SIGN_GLYPHS);
}
