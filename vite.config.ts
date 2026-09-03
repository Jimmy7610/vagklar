import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url';
import { readFileSync } from 'node:fs';

/**
 * The product version has exactly one home: package.json. It is injected here
 * so the footer, the "about" page and every exported backup report the same
 * string as the published package — a second copy in source is a second thing
 * to forget.
 */
const PKG_VERSION = JSON.parse(
  readFileSync(fileURLToPath(new URL('./package.json', import.meta.url)), 'utf8'),
).version as string;

/**
 * GitHub Pages deployment
 * ------------------------------------------------------------------
 * `base` must match the repository name when deploying to
 * https://<user>.github.io/<repo>/.
 *
 * Change it in ONE place: the `VAGKLAR_BASE` environment variable, or
 * the fallback below. The GitHub Actions workflow sets it automatically
 * from the repository name.
 *
 * For a user/organisation page (https://<user>.github.io/) set it to "/".
 */
const BASE_PATH = process.env.VAGKLAR_BASE ?? '/vagklar/';



export default defineConfig({
  base: BASE_PATH,
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: null,
      manifest: false, // we ship a hand-authored manifest in /public
      /*
       * The precache list is Vite's build output plus exactly these public
       * assets. Listed one by one rather than globbed so the social preview
       * image — 54 kB that only crawlers ever fetch — stays out of every
       * learner's cache.
       */
      includeAssets: [
        'manifest.webmanifest',
        'icons/icon.svg',
        'icons/icon-32.png',
        'icons/icon-192.png',
        'icons/icon-512.png',
        'icons/icon-512-maskable.png',
        'icons/apple-touch-icon.png',
      ],
      workbox: {
        navigateFallback: `${BASE_PATH}index.html`,
        cleanupOutdatedCaches: true,
        /*
         * The road signs are precached; the photographs are not.
         *
         * That split is measured rather than assumed. All 48 licensed sign
         * faces together are 212 kB — they are flat artwork of six colours,
         * palettised and losslessly encoded — against roughly 6 MB for the
         * photographs. Precaching the signs grows the install by about 15 %.
         *
         * What that buys: an exam works offline. Roughly one exam question in
         * ten shows a sign, and a sign question without its sign is not a
         * harder question, it is an unanswerable one. That exact defect has
         * happened here before, and it is worth 212 kB not to have it again on
         * a train with no signal.
         *
         * The photographs stay on the runtime cache for the opposite reason:
         * they are thirty times the size and a learner meets them a lesson at
         * a time, so paying for them on first view costs nothing at install.
         */
        globPatterns: ['**/*.{js,css,html,svg,png,webmanifest}', 'assets/sign-*.webp'],
        runtimeCaching: [
          {
            /*
             * The licensed photographs get their own cache.
             *
             * They used to share one bucket with every other image, under a
             * 120-entry ceiling. With 54 photographs in two widths that bucket
             * could evict a lesson's picture to make room for an icon, and the
             * learner would meet the written fallback instead — offline, with
             * no way to fetch it again. A dedicated cache makes the eviction
             * behaviour predictable: photographs only ever push out other
             * photographs, and the ceiling is set above the whole set.
             *
             * CacheFirst because these files never change: the filename carries
             * a content hash, so a new picture is a new URL.
             *
             * Matched on the extension, not the folder: Vite flattens every
             * asset into /assets/ at build time, so the source-images path the
             * files live under in the repository does not survive into
             * production. WebP is exact here — the photographs are the only
             * WebP the app ships, and the icons are PNG and SVG. A test in
             * verify-build keeps that true.
             */
            urlPattern: ({ url }) =>
              url.pathname.endsWith('.webp') && !url.pathname.includes('/sign-'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'vagklar-source-images',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 180 },
            },
          },
          {
            // Everything else that is an image: scenario art, icons, anything
            // added later. Kept small on purpose.
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'vagklar-images',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 60 },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(PKG_VERSION),
  },
  build: {
    target: 'es2022',
    emptyOutDir: true,
    /*
     * Never inline an asset as a data URI.
     *
     * Vite inlines anything under 4 kB by default, and 21 of the 48 licensed
     * road signs are smaller than that. Base64 in a JavaScript chunk is a
     * third larger than the file, cannot be cached separately, and — because
     * the landing page reaches the sign renderer through the scenario stage —
     * landed in the startup payload, where it cost 62 kB gzip. As separate
     * files they are fetched only when a sign is actually shown.
     */
    assetsInlineLimit: 0,
    cssCodeSplit: true,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router')) return 'router';
            return 'vendor';
          }
          // Lessons and scenarios are only needed by lazily loaded routes, so
          // let them ride along with those route chunks. Forcing them into
          // 'content' put them in the eagerly preloaded startup payload.
          if (id.includes('/src/content/lessons')) return undefined;
          if (id.includes('/src/content/scenarios')) return undefined;
          // The source-image registry carries long accessible descriptions and
          // is only read when a photograph is actually rendered, which happens
          // on lazily loaded routes.
          if (id.includes('/src/content/source-images')) return undefined;
          // Same for Vägklar's own drawings: the registry is long prose and the
          // drawings themselves are a big block of JSX, and neither is touched
          // until a lesson or a question actually renders one.
          if (id.includes('/src/content/original-visuals')) return undefined;
          if (id.includes('/src/ui/visuals/')) return undefined;
          // The licensed sign artwork brings a URL map and a crop manifest with
          // it. Neither is needed to paint the landing page, and letting Rollup
          // hoist the illustration code into the entry cost 60 kB gzip.
          //
          // Named individually rather than by folder: ScenarioStage lives in
          // the same directory and the landing page needs it at once, so
          // pinning the whole folder pulled the entire sign chunk back into
          // the entry through a single import.
          if (id.includes('/src/content/road-sign-assets')) return 'signs';
          // The registries are deliberately NOT pinned to the sign chunk. The
          // landing page reaches the sign *renderer* through the scenario
          // stage, so that chunk is eager — and pinning 99 signs of Swedish
          // prose into it put all of that on the startup path. Left
          // unassigned, they ride with the lazy routes that actually read
          // them: the catalogue, the lessons and the question surfaces.
          if (id.includes('/src/content/road-signs')) return undefined;
          if (id.includes('/src/content/road-markings')) return undefined;
          // Exact filenames. A prefix match on 'RoadSign' also caught
          // RoadSignAssembly, which imports the registry — so the whole 99-sign
          // registry ended up in the eager chunk through a component only the
          // lazy routes use.
          if (id.includes('/src/ui/illustrations/RoadSign.tsx')) return 'signs';
          if (id.includes('/src/ui/illustrations/RoadMarking.tsx')) return 'signs';
          if (id.includes('/src/ui/illustrations/signGlyphs')) return 'signs';
          if (id.includes('/src/ui/illustrations/markingGlyphs')) return 'signs';
          if (id.includes('/src/ui/illustrations/roadSignAssets')) return 'signs';
          // The question bodies are the single heaviest thing in the app and
          // nothing on the landing page needs them. Leaving them out of the
          // eager 'content' chunk lets them follow the dynamic import in
          // learnerStore into their own chunk, which Workbox still precaches.
          // The generated question-index stays behind, because hydration and
          // the mastery model do need it at startup.
          // Startup-critical engine modules. They read the generated index,
          // never a question body, and the app shell needs them to hydrate.
          // Naming them keeps Rollup from folding them into the questions
          // chunk, which would make the entry import it statically again.
          if (id.includes('/src/domain/content/indexView')) return 'content';
          if (id.includes('/src/domain/mastery/')) return 'content';
          if (id.includes('/src/domain/repetition/')) return 'content';
          if (id.includes('/src/domain/insights/mistakeCount')) return 'content';
          if (id.includes('/src/content/questions/')) return 'questions';
          // The bank and the modules that read it whole go with the questions.
          // Eight lazily loaded routes import them, and without this Rollup
          // hoists that shared code into the entry chunk — which drags the
          // question bodies back into the eagerly preloaded startup payload.
          // The startup path reaches the bank only through the dynamic import
          // in learnerStore, so nothing here is needed to paint the landing
          // page. Workbox still precaches the chunk, so offline is unaffected.
          if (id.includes('/src/domain/content/bank')) return 'questions';
          if (id.includes('/src/domain/selection/')) return 'questions';
          if (id.includes('/src/domain/insights/insights')) return 'questions';
          // The rest — questions, taxonomy, sources, misconceptions — is
          // reached synchronously from the learner store, so it is startup
          // critical whatever we do with it.
          if (id.includes('/src/content/')) return 'content';
          return undefined;
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    css: false,
    include: ['src/**/*.test.{ts,tsx}'],
    restoreMocks: true,
    /*
     * The component tests render a full 70-question exam and drive it with
     * real user events. That comfortably fits in a second on an idle machine,
     * but the 5s default is tight enough to flake when the suite runs
     * alongside anything else — which is exactly what CI does.
     */
    testTimeout: 20_000,
    hookTimeout: 20_000,
  },
});
