/**
 * Resolves a source-image slug to the hashed asset URLs Vite emits.
 *
 * `import.meta.glob` with `query: '?url'` and `eager: true` puts only the URL
 * *strings* into the bundle — a few kB for the whole set — while the WebP files
 * stay separate assets that the browser fetches when an image is actually
 * rendered. That is what keeps 26 photographs off the startup path.
 */

const files = import.meta.glob<string>('@/assets/source-images/**/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
});

/** Widths produced by scripts/optimise-source-images.py. */
export const SOURCE_IMAGE_WIDTHS = [640, 960] as const;

export interface ResolvedSourceImage {
  /** Largest variant, used as the `src` fallback. */
  src: string;
  /** `srcset` string covering every available width. */
  srcSet: string;
}

function urlFor(asset: string, width: number): string | undefined {
  // Keys arrive as absolute project paths; match on the tail we control.
  const suffix = `/assets/source-images/teoribok-2026-1/${asset}-${width}.webp`;
  for (const [key, value] of Object.entries(files)) {
    if (key.endsWith(suffix)) return value;
  }
  return undefined;
}

/**
 * Resolve one registry `asset` slug, e.g. `passager/cykeloverfart`.
 * Returns undefined when no file exists, so callers can degrade to text
 * rather than rendering a broken image.
 */
export function resolveSourceImage(asset: string): ResolvedSourceImage | undefined {
  const entries: Array<{ width: number; url: string }> = [];
  for (const width of SOURCE_IMAGE_WIDTHS) {
    const url = urlFor(asset, width);
    if (url !== undefined) entries.push({ width, url });
  }
  if (entries.length === 0) return undefined;

  const largest = entries[entries.length - 1]!;
  return {
    src: largest.url,
    srcSet: entries.map((entry) => `${entry.url} ${entry.width}w`).join(', '),
  };
}

/**
 * Which widths exist for each slug on disk.
 *
 * The validator needs the widths, not just the names: an image that shipped
 * only its 640 variant still renders, but every phone and desktop gets the
 * same small file and nobody finds out until someone looks closely at a sign
 * face. A missing width is a silent quality regression, so it is an error.
 */
export function availableSourceImageWidths(): Map<string, number[]> {
  const found = new Map<string, number[]>();
  const prefix = '/assets/source-images/teoribok-2026-1/';
  for (const key of Object.keys(files)) {
    const at = key.indexOf(prefix);
    if (at === -1) continue;
    const tail = key.slice(at + prefix.length);
    const match = tail.match(/^(.*)-(\d+)\.webp$/);
    if (!match) continue;
    const slug = match[1]!;
    const width = Number(match[2]);
    const widths = found.get(slug);
    if (widths) widths.push(width);
    else found.set(slug, [width]);
  }
  for (const widths of found.values()) widths.sort((a, b) => a - b);
  return found;
}

/** Every slug that actually has files on disk. Used by the content validator. */
export function availableSourceImageAssets(): Set<string> {
  return new Set(availableSourceImageWidths().keys());
}
