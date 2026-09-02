import { MARKING_GLYPHS } from './markingGlyphs';
import { getRoadMarking } from '@/content/road-markings';

/**
 * Renders a Swedish road marking by id.
 *
 * The drawing comes from markingGlyphs; the accessible name comes from the
 * marking registry, so a marking describes itself the same way everywhere.
 */

export interface RoadMarkingProps {
  name: string;
  size?: number;
  /** Overrides the registry's altText. Rarely needed. */
  alt?: string;
  /** Decorative use: the marking is already described by adjacent text. */
  decorative?: boolean;
}

export function RoadMarking({ name, size = 96, alt, decorative = false }: RoadMarkingProps) {
  const glyph = MARKING_GLYPHS[name];
  if (!glyph) return null;

  const label = alt ?? getRoadMarking(name)?.altText ?? name;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role={decorative ? 'presentation' : 'img'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      style={{ display: 'block', borderRadius: 6 }}
    >
      {glyph}
    </svg>
  );
}

export function hasRoadMarking(name: string | undefined): boolean {
  return Boolean(name && name in MARKING_GLYPHS);
}
