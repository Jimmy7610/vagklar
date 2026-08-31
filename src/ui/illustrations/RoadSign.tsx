import type { ReactElement } from 'react';

/**
 * Swedish road signs, drawn as vectors.
 *
 * These are *content*, not interface icons: they keep their authentic
 * colours in both light and dark themes, because recognising the real colour
 * is part of what the learner is being taught. The surrounding UI never
 * borrows these colours.
 *
 * Swedish signs use a yellow field where much of Europe uses white — that is
 * deliberate and preserved here.
 */

const YELLOW = '#F6C700';
const RED = '#C8102E';
const BLUE = '#0B4EA2';
const WHITE = '#FFFFFF';
const BLACK = '#1A1A1A';

export type RoadSignName =
  | 'stopp'
  | 'vajningsplikt'
  | 'huvudled'
  | 'forbud-infart'
  | 'forbud-stanna'
  | 'forbud-parkera'
  | 'pabud-rakt'
  | 'hastighet-70'
  | 'varning-korsning'
  | 'cirkulationsplats';

const signs: Record<RoadSignName, ReactElement> = {
  stopp: (
    <>
      <polygon
        points="33,4 67,4 96,33 96,67 67,96 33,96 4,67 4,33"
        fill={RED}
        stroke={WHITE}
        strokeWidth="4"
      />
      <text
        x="50"
        y="50"
        fill={WHITE}
        fontSize="24"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
        textAnchor="middle"
        dominantBaseline="central"
        letterSpacing="0.5"
      >
        STOPP
      </text>
    </>
  ),
  vajningsplikt: (
    <>
      <path d="M5 12 L95 12 L50 92 Z" fill={YELLOW} stroke={RED} strokeWidth="11" strokeLinejoin="round" />
    </>
  ),
  huvudled: (
    <>
      <rect
        x="50"
        y="6"
        width="62"
        height="62"
        transform="rotate(45 50 50)"
        fill={WHITE}
        stroke={WHITE}
        strokeWidth="2"
        rx="4"
      />
      <rect
        x="50"
        y="15"
        width="49"
        height="49"
        transform="rotate(45 50 50)"
        fill={YELLOW}
        rx="3"
      />
    </>
  ),
  'forbud-infart': (
    <>
      <circle cx="50" cy="50" r="45" fill={RED} />
      <rect x="18" y="42" width="64" height="16" rx="2" fill={WHITE} />
    </>
  ),
  'forbud-stanna': (
    <>
      <circle cx="50" cy="50" r="45" fill={BLUE} />
      <circle cx="50" cy="50" r="45" fill="none" stroke={RED} strokeWidth="9" />
      <line x1="21" y1="21" x2="79" y2="79" stroke={RED} strokeWidth="9" strokeLinecap="round" />
      <line x1="79" y1="21" x2="21" y2="79" stroke={RED} strokeWidth="9" strokeLinecap="round" />
    </>
  ),
  'forbud-parkera': (
    <>
      <circle cx="50" cy="50" r="45" fill={BLUE} />
      <circle cx="50" cy="50" r="45" fill="none" stroke={RED} strokeWidth="9" />
      <line x1="79" y1="21" x2="21" y2="79" stroke={RED} strokeWidth="9" strokeLinecap="round" />
    </>
  ),
  'pabud-rakt': (
    <>
      <circle cx="50" cy="50" r="45" fill={BLUE} />
      <path
        d="M50 74 V32 M50 26 l-14 14 M50 26 l14 14"
        stroke={WHITE}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </>
  ),
  'hastighet-70': (
    <>
      <circle cx="50" cy="50" r="46" fill={YELLOW} />
      <circle cx="50" cy="50" r="41" fill="none" stroke={RED} strokeWidth="11" />
      <text
        x="50"
        y="52"
        fill={BLACK}
        fontSize="40"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
        textAnchor="middle"
        dominantBaseline="central"
      >
        70
      </text>
    </>
  ),
  'varning-korsning': (
    <>
      <path
        d="M50 8 L95 88 L5 88 Z"
        fill={YELLOW}
        stroke={RED}
        strokeWidth="10"
        strokeLinejoin="round"
      />
      <path d="M50 40 V78 M32 60 H68" stroke={BLACK} strokeWidth="7" strokeLinecap="square" />
    </>
  ),
  cirkulationsplats: (
    <>
      <circle cx="50" cy="50" r="45" fill={BLUE} />
      <g stroke={WHITE} strokeWidth="7" fill="none" strokeLinecap="round">
        <path d="M50 22 a24 24 0 0 1 22 33" />
        <path d="M66 60 a24 24 0 0 1-38 5" />
        <path d="M30 42 a24 24 0 0 1 12-16" />
      </g>
      <path d="M70 50 l6 10 l-13 1 Z" fill={WHITE} />
      <path d="M32 66 l-9 -5 l10 -8 Z" fill={WHITE} />
      <path d="M44 20 l10 6 l-10 6 Z" fill={WHITE} />
    </>
  ),
};

export interface RoadSignProps {
  name: RoadSignName | string;
  size?: number;
  alt: string;
}

export function RoadSign({ name, size = 96, alt }: RoadSignProps) {
  const glyph = signs[name as RoadSignName];
  if (!glyph) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={alt}
      style={{ display: 'block' }}
    >
      {glyph}
    </svg>
  );
}

export function hasRoadSign(name: string | undefined): name is RoadSignName {
  return Boolean(name && name in signs);
}
