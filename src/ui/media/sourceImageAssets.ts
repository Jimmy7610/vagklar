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

/** Every slug that actually has files on disk. Used by the content validator. */
export function availableSourceImageAssets(): Set<string> {
  const slugs = new Set<string>();
  const prefix = '/assets/source-images/teoribok-2026-1/';
  for (const key of Object.keys(files)) {
    const at = key.indexOf(prefix);
    if (at === -1) continue;
    const tail = key.slice(at + prefix.length).replace(/-\d+\.webp$/, '');
    slugs.add(tail);
  }
  return slugs;
}
