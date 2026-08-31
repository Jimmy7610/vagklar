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
