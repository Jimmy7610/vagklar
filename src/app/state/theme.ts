import { useEffect } from 'react';
import { STORAGE_KEYS } from '@/domain/constants';
import type { MotionPreference, Preferences, ThemePreference } from '@/domain/learner/types';

/**
 * Theme, motion and text-scale application.
 *
 * The *resolved* theme is always written to `<html data-theme>`, never left to
 * a media query alone. That keeps CSS simple and, together with the tiny
 * bootstrap script in index.html, means the correct theme is painted on the
 * very first frame — no flash of the wrong palette before IndexedDB loads.
 *
 * localStorage is used only as a fast mirror of these three UI preferences.
 * The durable source of truth remains IndexedDB.
 */

export type ResolvedTheme = 'light' | 'dark';

export function prefersDark(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference === 'system') return prefersDark() ? 'dark' : 'light';
  return preference;
}

export function resolveMotion(preference: MotionPreference): boolean {
  if (preference === 'system') return prefersReducedMotion();
  return preference === 'reduced';
}

function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable (private mode, blocked cookies). The app
    // still works; we just lose the pre-paint hint.
  }
}

export function applyTheme(preference: ThemePreference): ResolvedTheme {
  const resolved = resolveTheme(preference);
  const root = document.documentElement;
  root.dataset.theme = resolved;
  root.style.colorScheme = resolved;

  const themeColor = resolved === 'dark' ? '#0c1518' : '#f7f8f5';
  document
    .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    .forEach((meta) => meta.setAttribute('content', themeColor));

  safeSet(STORAGE_KEYS.theme, preference);
  return resolved;
}

export function applyMotion(preference: MotionPreference): void {
  const reduced = resolveMotion(preference);
  document.documentElement.dataset.reducedMotion = reduced ? 'true' : 'false';
  safeSet(STORAGE_KEYS.reducedMotion, preference);
}

export function applyTextScale(scale: number): void {
  document.documentElement.style.setProperty('--text-scale', String(scale));
  document.documentElement.style.fontSize = `${scale * 100}%`;
  safeSet(STORAGE_KEYS.textScale, String(scale));
}

/** Keeps the document in sync with the learner's preferences. */
export function useAppearance(preferences: Preferences): void {
  const { theme, motion, textScale } = preferences;

  useEffect(() => {
    applyTheme(theme);
    if (theme !== 'system' || typeof window === 'undefined' || !window.matchMedia) return;

    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => applyTheme('system');
    query.addEventListener('change', listener);
    return () => query.removeEventListener('change', listener);
  }, [theme]);

  useEffect(() => {
    applyMotion(motion);
    if (motion !== 'system' || typeof window === 'undefined' || !window.matchMedia) return;

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = () => applyMotion('system');
    query.addEventListener('change', listener);
    return () => query.removeEventListener('change', listener);
  }, [motion]);

  useEffect(() => {
    applyTextScale(textScale);
  }, [textScale]);
}
