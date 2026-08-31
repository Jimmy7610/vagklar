import { useCallback } from 'react';
import { useLearner, useLearnerActions } from '@/app/state/useLearner';
import { resolveTheme } from '@/app/state/theme';

/**
 * Light/dark toggle for the landing page.
 *
 * Writes through to the same preference the app uses, so a visitor who flips
 * the theme here keeps it when they walk into the product.
 */
export function useThemeToggle() {
  const { preferences } = useLearner();
  const { setPreferences } = useLearnerActions();
  const resolved = resolveTheme(preferences.theme);

  const toggle = useCallback(() => {
    setPreferences({ theme: resolved === 'dark' ? 'light' : 'dark' });
  }, [resolved, setPreferences]);

  return { preference: preferences.theme, resolved, toggle };
}
