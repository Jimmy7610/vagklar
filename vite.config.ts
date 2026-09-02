import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url';

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
        runtimeCaching: [
          {
            // Scenario / sign illustrations are fetched on demand and cached
            // with a hard ceiling so we never balloon the user's storage.
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'vagklar-images',
              expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 60 },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  build: {
    target: 'es2022',
    emptyOutDir: true,
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
