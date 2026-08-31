import { useEffect } from 'react';

/**
 * Service-worker registration.
 *
 * `registerType: 'prompt'` means a new build never swaps itself in under a
 * learner mid-exam. We surface a quiet "Ny version finns" affordance instead
 * and only reload when they choose to.
 */
export function useServiceWorker(
  onUpdate: (handler: { ready: boolean; apply: () => void }) => void,
): void {
  useEffect(() => {
    if (import.meta.env.DEV) return;
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;

    let cancelled = false;

    void import('virtual:pwa-register')
      .then(({ registerSW }) => {
        if (cancelled) return;
        const updateSW = registerSW({
          immediate: true,
          onNeedRefresh() {
            onUpdate({ ready: true, apply: () => void updateSW(true) });
          },
        });
      })
      .catch(() => {
        // A missing or blocked service worker must never break the app; the
        // product works fine without it, just without offline support.
      });

    return () => {
      cancelled = true;
    };
  }, [onUpdate]);
}
