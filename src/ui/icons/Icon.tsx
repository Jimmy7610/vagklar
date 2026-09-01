import type { ReactElement, SVGProps } from 'react';

/**
 * The Vägklar icon set.
 *
 * One family, one grid (24×24), one stroke weight. Drawn inline rather than
 * pulled from an icon package so the whole set costs a couple of kilobytes and
 * never drifts stylistically. Road signs are *content* and live separately in
 * ui/illustrations — they are never used as interface icons.
 */

export type IconName =
  // navigation
  | 'home'
  | 'practice'
  | 'exam'
  | 'progress'
  | 'more'
  | 'book'
  // categories
  | 'rules'
  | 'sign'
  | 'speed'
  | 'intersection'
  | 'train'
  | 'parking'
  | 'motorway'
  | 'overtake'
  | 'risk'
  | 'alcohol'
  | 'fatigue'
  | 'night'
  | 'weather'
  | 'eco'
  | 'car'
  | 'trailer'
  | 'person'
  // interface
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-down'
  | 'chevron-up'
  | 'arrow-right'
  | 'arrow-left'
  | 'close'
  | 'check'
  | 'check-circle'
  | 'x-circle'
  | 'plus'
  | 'minus'
  | 'settings'
  | 'bookmark'
  | 'bookmark-filled'
  | 'refresh'
  | 'download'
  | 'upload'
  | 'trash'
  | 'info'
  | 'alert'
  | 'flag'
  | 'stack'
  | 'trend'
  | 'target'
  | 'map'
  | 'calendar'
  | 'clock'
  | 'lightbulb'
  | 'sun'
  | 'moon'
  | 'monitor'
  | 'play'
  | 'sparkle'
  | 'list'
  | 'grid'
  | 'shield'
  | 'offline'
  | 'share'
  | 'volume'
  | 'eye'
  | 'filter'
  | 'flame';

const paths: Record<IconName, ReactElement> = {
  home: (
    <>
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6 9.6V19a1 1 0 0 0 1 1h3.5v-4.5h3V20H17a1 1 0 0 0 1-1V9.6" />
    </>
  ),
  practice: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 4V2M12 22v-2M4 12H2M22 12h-2" />
    </>
  ),
  exam: (
    <>
      <path d="M6 3.5h8.5L19 8v12.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z" />
      <path d="M14 3.5V8h5" />
      <path d="M8.5 14.5l2 2 4-4.5" />
    </>
  ),
  progress: (
    <>
      <path d="M4 20V10M9.3 20V5M14.7 20v-7M20 20V8" />
    </>
  ),
  more: (
    <>
      <circle cx="5.5" cy="12" r="1.4" />
      <circle cx="12" cy="12" r="1.4" />
      <circle cx="18.5" cy="12" r="1.4" />
    </>
  ),
  book: (
    <>
      <path d="M5 4.5h9a3 3 0 0 1 3 3V21a2.5 2.5 0 0 0-2.5-2.5H5Z" />
      <path d="M5 4.5v14M19 6.5V21" />
    </>
  ),
  rules: (
    <>
      <path d="M5 4.5h14v15H5z" />
      <path d="M8.5 9h7M8.5 12.5h7M8.5 16h4" />
    </>
  ),
  sign: (
    <>
      <path d="M12 3.5 20 12l-8 8.5L4 12Z" />
      <path d="M12 8.5v4.5M12 15.6v.5" />
    </>
  ),
  speed: (
    <>
      <path d="M4 17a8 8 0 1 1 16 0" />
      <path d="m12 13 3.8-3.4" />
      <circle cx="12" cy="17" r="1.2" />
    </>
  ),
  intersection: (
    <>
      <path d="M4 9.5h6V4M14 4v5.5h6M20 14.5h-6V21M10 21v-6.5H4" />
    </>
  ),
  train: (
    <>
      {/* Level-crossing St Andrew's cross over a rail line. */}
      <path d="M4.5 4.5 19.5 19.5M19.5 4.5 4.5 19.5" />
      <path d="M2.5 12h19" />
    </>
  ),
  parking: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M10 16.5V8h3a2.7 2.7 0 0 1 0 5.4h-3" />
    </>
  ),
  motorway: (
    <>
      <path d="M6 20 9 4M18 20 15 4" />
      <path d="M12 5.5v2.5M12 11v2.5M12 16.5V19" />
    </>
  ),
  overtake: (
    <>
      <path d="M7.5 20V9.5M7.5 9.5 4.5 12.5M7.5 9.5l3 3" />
      <path d="M16.5 4v10.5M16.5 14.5l3-3M16.5 14.5l-3-3" />
    </>
  ),
  risk: (
    <>
      <path d="M12 4.5 21 19.5H3Z" />
      <path d="M12 10v4M12 16.8v.4" />
    </>
  ),
  alcohol: (
    <>
      <path d="M7 4h10l-4 7v7M13 18h3.5M13 18H9.5" />
      <path d="M7.6 7.5h8.8" />
    </>
  ),
  fatigue: (
    <>
      <path d="M13 4.5A7.5 7.5 0 1 0 19.5 13 8 8 0 0 1 13 4.5Z" />
      <path d="M4.5 6.5h3.5L4.5 10h3.5" />
    </>
  ),
  night: (
    <>
      <path d="M12 4.5v3M12 16.5v3M4.5 12h3M16.5 12h3M6.7 6.7l2.1 2.1M15.2 15.2l2.1 2.1M17.3 6.7l-2.1 2.1M8.8 15.2l-2.1 2.1" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  weather: (
    <>
      <path d="M7.5 15.5a3.5 3.5 0 0 1 .4-6.98 5 5 0 0 1 9.6 1.1 3.2 3.2 0 0 1-.5 5.88Z" />
      <path d="M9 19.5l-.7 1.4M13 19.5l-.7 1.4M17 19.5l-.7 1.4" />
    </>
  ),
  eco: (
    <>
      <path d="M19 5c0 8-4.5 12-9.5 12A5.5 5.5 0 0 1 4 11.5C4 6.5 9.5 4 19 5Z" />
      <path d="M14.5 8.5C11 11 8.5 15 7 20" />
    </>
  ),
  car: (
    <>
      <path d="M4.5 15.5v3h3v-3M16.5 15.5v3h3v-3" />
      <path d="M3.5 15.5v-3l2-5h13l2 5v3Z" />
      <path d="M6.5 12.5h2M15.5 12.5h2" />
    </>
  ),
  trailer: (
    <>
      <path d="M3 16h11V9H3ZM14 12.5h4.5l2.5 3.5H14" />
      <circle cx="7" cy="18.5" r="1.6" />
      <circle cx="17.5" cy="18.5" r="1.6" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </>
  ),
  'chevron-left': <path d="m14.5 5.5-6.5 6.5 6.5 6.5" />,
  'chevron-right': <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />,
  'chevron-down': <path d="m5.5 9.5 6.5 6.5 6.5-6.5" />,
  'chevron-up': <path d="m5.5 14.5 6.5-6.5 6.5 6.5" />,
  'arrow-right': (
    <>
      <path d="M4.5 12h15" />
      <path d="m13.5 6 6 6-6 6" />
    </>
  ),
  'arrow-left': (
    <>
      <path d="M19.5 12h-15" />
      <path d="m10.5 6-6 6 6 6" />
    </>
  ),
  close: <path d="m6 6 12 12M18 6 6 18" />,
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  'check-circle': (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8 12.2 2.8 2.8L16 9.5" />
    </>
  ),
  'x-circle': (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m9 9 6 6M15 9l-6 6" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2M12 18.5v2M20.5 12h-2M5.5 12h-2M18.01 5.99l-1.42 1.42M7.41 16.59l-1.42 1.42M18.01 18.01l-1.42-1.42M7.41 7.41 5.99 5.99" />
    </>
  ),
  bookmark: <path d="M7 4.5h10v15l-5-3.6-5 3.6Z" />,
  'bookmark-filled': <path d="M7 4.5h10v15l-5-3.6-5 3.6Z" fill="currentColor" />,
  refresh: (
    <>
      <path d="M19.5 12a7.5 7.5 0 1 1-2.4-5.5" />
      <path d="M19.5 4.5V9H15" />
    </>
  ),
  download: (
    <>
      <path d="M12 4v11" />
      <path d="m7.5 10.5 4.5 4.5 4.5-4.5" />
      <path d="M4.5 19.5h15" />
    </>
  ),
  upload: (
    <>
      <path d="M12 15.5V4.5" />
      <path d="m7.5 9 4.5-4.5L16.5 9" />
      <path d="M4.5 19.5h15" />
    </>
  ),
  trash: (
    <>
      <path d="M4.5 6.5h15" />
      <path d="M9.5 6.5V4.5h5v2" />
      <path d="M6.5 6.5 7.5 20h9l1-13.5" />
      <path d="M10.5 10v6M13.5 10v6" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5M12 7.8v.4" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4.5 21 19.5H3Z" />
      <path d="M12 10v4M12 16.8v.4" />
    </>
  ),
  flag: (
    <>
      <path d="M6 20V4.5" />
      <path d="M6 5.5h11l-2.5 3.5L17 12.5H6" />
    </>
  ),
  stack: (
    <>
      <path d="m12 4 8 4-8 4-8-4Z" />
      <path d="m4 12 8 4 8-4M4 16l8 4 8-4" />
    </>
  ),
  trend: (
    <>
      <path d="m4 16 5-5 3.5 3.5L20 7" />
      <path d="M15 7h5v5" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.9" fill="currentColor" />
    </>
  ),
  map: (
    <>
      <path d="m4 6.5 5-2 6 2 5-2v13l-5 2-6-2-5 2Z" />
      <path d="M9 4.5v13M15 6.5v13" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5.5" width="16" height="14" rx="2.5" />
      <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  lightbulb: (
    <>
      <path d="M9 17a6 6 0 1 1 6 0v1.5H9Z" />
      <path d="M10 21h4" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
    </>
  ),
  moon: <path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10Z" />,
  monitor: (
    <>
      <rect x="3.5" y="5" width="17" height="11" rx="2" />
      <path d="M9 20h6M12 16v4" />
    </>
  ),
  play: <path d="M8.5 5.5 18 12l-9.5 6.5Z" />,
  sparkle: (
    <>
      <path d="M12 4.5 13.6 9.4 18.5 11 13.6 12.6 12 17.5 10.4 12.6 5.5 11l4.9-1.6Z" />
      <path d="M18 16.5 18.7 18.3 20.5 19l-1.8.7-.7 1.8-.7-1.8L15.5 19l1.8-.7Z" />
    </>
  ),
  list: <path d="M8 6.5h11M8 12h11M8 17.5h11M4.6 6.5h.01M4.6 12h.01M4.6 17.5h.01" />,
  grid: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.6" />
      <rect x="13" y="4" width="7" height="7" rx="1.6" />
      <rect x="4" y="13" width="7" height="7" rx="1.6" />
      <rect x="13" y="13" width="7" height="7" rx="1.6" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.5 19 6v6c0 4-3 7-7 8.5C8 19 5 16 5 12V6Z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </>
  ),
  offline: (
    <>
      <path d="M3 4.5 21 20" />
      <path d="M5 11.5a11 11 0 0 1 4-2.4M2.5 8a15 15 0 0 1 4-2.7M17.5 8.6A15 15 0 0 0 10 5.1M15.4 12.3a11 11 0 0 0-2.3-1.1" />
      <path d="M9.4 15.2a6 6 0 0 1 1.6-.8M12 19.5h.01" />
    </>
  ),
  share: (
    <>
      <path d="M12 15V4.5" />
      <path d="m8 8.5 4-4 4 4" />
      <path d="M5.5 13v6a1.5 1.5 0 0 0 1.5 1.5h10a1.5 1.5 0 0 0 1.5-1.5v-6" />
    </>
  ),
  volume: (
    <>
      <path d="M5 9.5h3l4-3.5v12l-4-3.5H5Z" />
      <path d="M15.5 9.5a3.5 3.5 0 0 1 0 5M18 7a7 7 0 0 1 0 10" />
    </>
  ),
  eye: (
    <>
      <path d="M2.8 12S6 6.5 12 6.5 21.2 12 21.2 12 18 17.5 12 17.5 2.8 12 2.8 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  filter: <path d="M4 6h16l-6 7v6l-4-2v-4Z" />,
  flame: (
    <>
      <path d="M12 3.5s5 4 5 8.5a5 5 0 0 1-10 0c0-2 1-3.2 1.8-4.2.4 1 1 1.7 1.7 2 .3-2.5.8-4.5 1.5-6.3Z" />
    </>
  ),
};

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number | string;
  /** Provide a label to expose the icon to assistive technology. */
  label?: string;
}

export function Icon({ name, size = 20, label, ...rest }: IconProps) {
  const glyph = paths[name];
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : 'presentation'}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      focusable="false"
      {...rest}
    >
      {glyph}
    </svg>
  );
}
