import { APP_VERSION } from '@/domain/constants';

/**
 * What a beta tester can paste into a bug report.
 *
 * A report that says "the exam froze on my phone" costs a round trip to answer
 * three questions: which browser, was it the installed app or a tab, and was
 * the service worker serving an old build. This produces those answers as text
 * the tester can copy in one tap.
 *
 * It is deliberately not telemetry. Nothing is sent anywhere; the app has no
 * backend and this pass is not the one that gives it one. The tester reads what
 * they are about to share, and chooses to share it.
 *
 * What it must never contain is the more interesting half of the design. No
 * name, no identifier that follows a person between sessions, no answers, no
 * filesystem paths, and nothing from the licensed source. Counts, yes — how
 * many answers are stored says something useful about whether a bug involves a
 * full database or an empty one — but never which questions or what was
 * answered. `diagnostics.test.ts` checks the produced text against that list
 * rather than trusting this comment.
 */

export interface DiagnosticsInput {
  /** Counts only, never contents. */
  answers: number;
  exams: number;
  sessions: number;
  masteryAreas: number;
  /** Current route, so a report says where it happened. */
  route: string;
  /** Persistence schema version, for "my progress vanished after an update". */
  storageVersion: number | string;
}

export interface DiagnosticsReport {
  generatedAt: string;
  appVersion: string;
  route: string;
  display: string;
  viewport: string;
  devicePixelRatio: number;
  language: string;
  userAgent: string;
  online: boolean;
  serviceWorker: string;
  storage: string;
  counts: string;
  preferences: string;
}

/** Standalone, or a browser tab? The commonest thing a bug report leaves out. */
function displayMode(): string {
  if (typeof window === 'undefined' || !window.matchMedia) return 'okänt';
  for (const mode of ['standalone', 'minimal-ui', 'fullscreen']) {
    if (window.matchMedia(`(display-mode: ${mode})`).matches) return `installerad (${mode})`;
  }
  // iOS Safari reports installation here rather than through display-mode.
  const iosStandalone = (window.navigator as { standalone?: boolean }).standalone;
  if (iosStandalone) return 'installerad (iOS)';
  return 'webbläsarflik';
}

function serviceWorkerState(): string {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return 'stöds inte';
  const reg = navigator.serviceWorker.controller;
  return reg ? 'aktiv' : 'ingen kontrollerar sidan';
}

/**
 * The accessibility preferences the browser exposes.
 *
 * These change how the app renders, so a screenshot that looks wrong is often
 * explained by one of them. They are settings, not identity.
 */
function preferences(): string {
  if (typeof window === 'undefined' || !window.matchMedia) return 'okänt';
  const on = (query: string) => (window.matchMedia(query).matches ? 'ja' : 'nej');
  return [
    `reducerad rörelse: ${on('(prefers-reduced-motion: reduce)')}`,
    `mörkt läge: ${on('(prefers-color-scheme: dark)')}`,
    `hög kontrast: ${on('(prefers-contrast: more)')}`,
  ].join(' · ');
}

export function collectDiagnostics(input: DiagnosticsInput): DiagnosticsReport {
  const w = typeof window === 'undefined' ? undefined : window;
  return {
    generatedAt: new Date().toISOString(),
    appVersion: APP_VERSION,
    route: input.route,
    display: displayMode(),
    viewport: w ? `${w.innerWidth}×${w.innerHeight}` : 'okänt',
    devicePixelRatio: w?.devicePixelRatio ?? 1,
    language: typeof navigator === 'undefined' ? 'okänt' : navigator.language,
    userAgent: typeof navigator === 'undefined' ? 'okänt' : navigator.userAgent,
    online: typeof navigator === 'undefined' ? true : navigator.onLine,
    serviceWorker: serviceWorkerState(),
    storage: `schema ${input.storageVersion}`,
    counts: `${input.answers} svar · ${input.exams} prov · ${input.sessions} pass · ${input.masteryAreas} områden`,
    preferences: preferences(),
  };
}

const LABELS: Record<keyof DiagnosticsReport, string> = {
  generatedAt: 'Tidpunkt',
  appVersion: 'Appversion',
  route: 'Sida',
  display: 'Läge',
  viewport: 'Fönster',
  devicePixelRatio: 'Pixelkvot',
  language: 'Språk',
  userAgent: 'Webbläsare',
  online: 'Nätverk',
  serviceWorker: 'Service worker',
  storage: 'Lagring',
  counts: 'Sparat lokalt',
  preferences: 'Inställningar i systemet',
};

/** Plain text, because a bug report is a message and not a file upload. */
export function formatDiagnostics(report: DiagnosticsReport): string {
  const lines = (Object.keys(LABELS) as (keyof DiagnosticsReport)[]).map((key) => {
    const value = report[key];
    const shown = typeof value === 'boolean' ? (value ? 'uppkopplad' : 'offline') : String(value);
    return `${LABELS[key]}: ${shown}`;
  });
  return ['Vägklar — teknisk information', ...lines].join('\n');
}
