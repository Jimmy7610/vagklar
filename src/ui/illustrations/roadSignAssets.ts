import manifest from '@/content/road-sign-assets.json';

/**
 * The licensed sign artwork, resolved to the URLs Vite emits.
 *
 * Vägklar drew its own road signs for a long time because the book's artwork
 * sat in the PDF as vector page content, invisible to an extractor that was
 * looking for embedded photographs. Hand-drawing 58 signs from memory and
 * reference went wrong three times in ways that took a lot of work to find: A36
 * had a cross where the regulation has a locomotive, A30 and D3 circulated
 * clockwise, and A25, B6 and B7 were all mirrored — with A25 additionally
 * carrying a red arrow where the sign has two black ones.
 *
 * Now that the artwork can be extracted, it is used. Every one of those defects
 * is a defect the source cannot have.
 *
 * Ten signs still use the drawing, and that is deliberate rather than
 * unfinished. Three official codes each cover a family: C31 is every speed
 * limit, D1 is every mandatory direction, T6 is every time plate. The book
 * prints one picture per code, so its C31 shows 30 — using it for
 * `hastighet-90` would put a wrong number in front of a learner. The drawing
 * knows which variant it is; the photograph does not.
 */

const files = import.meta.glob<string>('@/assets/road-signs/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
});

export interface LicensedSignAsset {
  src: string;
  width: number;
  height: number;
  /** Page in the licensed source, for the credit line and the audit. */
  page: number;
  /** Official code, e.g. "A25". */
  code: string;
}

const byId = new Map<string, LicensedSignAsset>();

for (const entry of manifest) {
  const suffix = `/assets/road-signs/sign-${entry.id}.webp`;
  const url = Object.entries(files).find(([key]) => key.endsWith(suffix))?.[1];
  if (!url) continue;
  byId.set(entry.id, {
    src: url,
    width: entry.width,
    height: entry.height,
    page: entry.page,
    code: entry.code,
  });
}

/** The book's own artwork for a sign, when there is one. */
export function licensedSignAsset(id: string): LicensedSignAsset | undefined {
  return byId.get(id);
}

/** Every sign id that ships with licensed artwork rather than a drawing. */
export function licensedSignIds(): string[] {
  return [...byId.keys()];
}
