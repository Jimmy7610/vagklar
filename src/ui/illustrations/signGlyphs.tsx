import type { ReactElement, ReactNode } from 'react';

/**
 * Swedish road signs, drawn as vectors.
 *
 * These are *content*, not interface icons: they keep their authentic colours
 * in both light and dark themes, because recognising the real colour is part of
 * what is being taught. The surrounding UI never borrows these colours.
 *
 * Swedish signs use a yellow field where much of Europe uses white — on warning
 * signs, on prohibition signs and on the speed limit. That is deliberate and
 * preserved here.
 *
 * Everything is drawn in a 100×100 box. Frames are shared components rather
 * than copied outlines, so a new sign is a symbol plus a frame, and the frames
 * stay consistent across the whole set.
 */

export const SIGN_COLOURS = {
  yellow: '#F6C700',
  red: '#C8102E',
  blue: '#0B4EA2',
  white: '#FFFFFF',
  black: '#1A1A1A',
  green: '#007A33',
} as const;

const { yellow, red, blue, white, black } = SIGN_COLOURS;

const FONT = 'system-ui, -apple-system, Segoe UI, sans-serif';

/* ------------------------------------------------------------------ */
/* Frames                                                              */
/* ------------------------------------------------------------------ */

/** Warning (A): yellow triangle, red border, point up. */
function WarnFrame({ children }: { children?: ReactNode }) {
  return (
    <>
      <path d="M50 7 L96 88 L4 88 Z" fill={yellow} stroke={red} strokeWidth="9" strokeLinejoin="round" />
      {children}
    </>
  );
}

/** Yield (B1): yellow triangle, red border, point down. */
function YieldFrame({ children }: { children?: ReactNode }) {
  return (
    <>
      <path d="M4 13 L96 13 L50 92 Z" fill={yellow} stroke={red} strokeWidth="9" strokeLinejoin="round" />
      {children}
    </>
  );
}

/** Prohibition (C) on a yellow field: yellow disc, red ring. */
function ProhibitFrame({ children }: { children?: ReactNode }) {
  return (
    <>
      <circle cx="50" cy="50" r="46" fill={yellow} />
      <circle cx="50" cy="50" r="40.5" fill="none" stroke={red} strokeWidth="11" />
      {children}
    </>
  );
}

/** Parking prohibitions (C35/C39): blue disc, red ring. */
function ProhibitBlueFrame({ children }: { children?: ReactNode }) {
  return (
    <>
      <circle cx="50" cy="50" r="46" fill={blue} />
      <circle cx="50" cy="50" r="41" fill="none" stroke={red} strokeWidth="10" />
      {children}
    </>
  );
}

/** Mandatory (D): solid blue disc, white symbol. */
function MandatoryFrame({ children }: { children?: ReactNode }) {
  return (
    <>
      <circle cx="50" cy="50" r="46" fill={blue} />
      {children}
    </>
  );
}

/** Information (E): blue rectangle, white symbol. */
function InfoFrame({ children }: { children?: ReactNode }) {
  return (
    <>
      <rect x="6" y="10" width="88" height="80" rx="5" fill={blue} />
      {children}
    </>
  );
}

/** Supplementary plate (T): white field, black border. */
function PlateFrame({ children, fill = white }: { children?: ReactNode; fill?: string }) {
  return (
    <>
      <rect x="6" y="22" width="88" height="56" rx="3" fill={fill} stroke={black} strokeWidth="4" />
      {children}
    </>
  );
}

/**
 * The plate's own bounds inside the 100×100 drawing area.
 *
 * x from 4 to 96 and y from 20 to 80: the rect above plus half its 4-unit
 * stroke on each side.
 */
const PLATE_VIEW_BOX = '4 20 92 60';

/**
 * Glyphs whose drawing is not square, and the box that actually contains them.
 *
 * Every other vector sign is a circle or a triangle inscribed in the square, so
 * rendering the SVG at size × size shows it at its true proportions. A
 * supplementary plate is not: it is a wide rectangle occupying the middle 60 %
 * of the height, so a square element left roughly 30 % of its height empty
 * above and below. On a post that is the gap between the sign and the plate —
 * the gap that says the plate belongs to *that* sign — and it was three times
 * wider under a T6 than under any of the fourteen plates that have the book's
 * own artwork and are sized from their real pixels.
 *
 * Cropping the viewBox to the drawing rather than rescaling it means nothing is
 * stretched; the plate is simply no longer padded with empty space.
 */
export const GLYPH_VIEW_BOX: Record<string, string> = {
  'tavla-tid': PLATE_VIEW_BOX,
  'tavla-tid-lordag': PLATE_VIEW_BOX,
  'tavla-tid-helgdag': PLATE_VIEW_BOX,
};

/** Height-to-width of a glyph's drawing, 1 for the square majority. */
export function glyphAspect(name: string): number {
  const box = GLYPH_VIEW_BOX[name];
  if (!box) return 1;
  const parts = box.split(' ').map(Number);
  const width = parts[2] ?? 100;
  const height = parts[3] ?? 100;
  return height / width;
}

/** A cancellation bar: the diagonal that turns a sign into its "upphör" form. */
function EndBar({ colour = black }: { colour?: string }) {
  return <line x1="16" y1="84" x2="84" y2="16" stroke={colour} strokeWidth="6" strokeLinecap="round" />;
}

function Label({ text, y = 52, size = 38, fill = black }: { text: string; y?: number; size?: number; fill?: string }) {
  return (
    <text
      x="50"
      y={y}
      fill={fill}
      fontSize={size}
      fontWeight="700"
      fontFamily={FONT}
      textAnchor="middle"
      dominantBaseline="central"
    >
      {text}
    </text>
  );
}

/* ------------------------------------------------------------------ */
/* Shared symbols                                                      */
/* ------------------------------------------------------------------ */

/** Walking figure, used on crossing and pedestrian signs. */
function Pedestrian({ fill = black, scale = 1, x = 50, y = 56 }: { fill?: string; scale?: number; x?: number; y?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale}) translate(-50 -56)`} fill={fill}>
      <circle cx="50" cy="34" r="6" />
      <path d="M50 41 l9 13 -4 3 -5 -7 z" />
      <path d="M50 41 l-8 12 2 12 -5 10 5 3 7 -13 z" />
      <path d="M50 46 l7 12 6 11 -5 3 -8 -13 z" />
    </g>
  );
}

/** Car seen from behind, used on overtaking signs. */
function CarRear({ x, fill }: { x: number; fill: string }) {
  return (
    <g fill={fill} transform={`translate(${x} 0)`}>
      {/* Cabin, body and wheels — enough shape to read as a car at 64 px. */}
      <path d="M-8 36 h16 l4 8 h-24 z" />
      <rect x="-13" y="44" width="26" height="14" rx="3" />
      <rect x="-14" y="57" width="8" height="6" rx="2" />
      <rect x="6" y="57" width="8" height="6" rx="2" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* The sign set                                                        */
/* ------------------------------------------------------------------ */

export const SIGN_GLYPHS: Record<string, ReactElement> = {
  /* ---- Varningsmärken (A) ------------------------------------------ */
  'varning-kurva': (
    <WarnFrame>
      <path
        d="M42 80 V60 c0-13 16-13 16-26 V44"
        fill="none"
        stroke={black}
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path d="M58 34 l-8 12 h16 z" fill={black} />
    </WarnFrame>
  ),
  'varning-flera-kurvor': (
    <WarnFrame>
      <path
        d="M42 82 c0-12 16-12 16-24 c0-11-14-11-14-22"
        fill="none"
        stroke={black}
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path d="M44 38 l-7 11 h14 z" fill={black} />
    </WarnFrame>
  ),
  'varning-slirig-vag': (
    <WarnFrame>
      <rect x="41" y="40" width="18" height="30" rx="4" fill={black} />
      <rect x="45" y="33" width="10" height="8" rx="2" fill={black} />
      <path d="M24 62 c6-8 12-2 17-10" fill="none" stroke={black} strokeWidth="5" strokeLinecap="round" />
      <path d="M60 52 c5 8 11 2 17 10" fill="none" stroke={black} strokeWidth="5" strokeLinecap="round" />
    </WarnFrame>
  ),
  'varning-overgangsstalle': (
    <WarnFrame>
      <Pedestrian scale={0.72} y={58} />
      <path d="M31 78 h38" stroke={black} strokeWidth="4" strokeLinecap="round" />
    </WarnFrame>
  ),
  'varning-barn': (
    <WarnFrame>
      <Pedestrian scale={0.6} x={42} y={58} />
      <Pedestrian scale={0.48} x={60} y={62} />
    </WarnFrame>
  ),
  'varning-cyklande': (
    <WarnFrame>
      <circle cx="35" cy="68" r="10" fill="none" stroke={black} strokeWidth="4.5" />
      <circle cx="66" cy="68" r="10" fill="none" stroke={black} strokeWidth="4.5" />
      <path d="M35 68 L48 50 L60 50 M48 50 L66 68 M42 50 h12" fill="none" stroke={black} strokeWidth="4.5" strokeLinecap="round" />
      <circle cx="58" cy="42" r="5" fill={black} />
    </WarnFrame>
  ),
  'varning-vagarbete': (
    <WarnFrame>
      {/* Worker: head, torso, legs, and a shovel angled into a mound. */}
      <circle cx="45" cy="42" r="5" fill={black} />
      <path d="M45 48 l6 3 -2 13 h-9 l-1 -13 z" fill={black} />
      <path d="M40 64 l-3 14 h5 l3 -10 z" fill={black} />
      <path d="M49 64 l4 14 h-5 l-3 -10 z" fill={black} />
      <path d="M48 52 L68 66" stroke={black} strokeWidth="4" strokeLinecap="round" />
      <path d="M66 62 l9 5 -4 7 -8 -6 z" fill={black} />
      <path d="M28 80 h44" stroke={black} strokeWidth="4" strokeLinecap="round" />
    </WarnFrame>
  ),
  'varning-vagkorsning': (
    <WarnFrame>
      <path d="M50 40 V80 M28 60 H72" stroke={black} strokeWidth="7" strokeLinecap="square" />
    </WarnFrame>
  ),
  'varning-cirkulationsplats': (
    <WarnFrame>
      {/* Mirrored so the circulation runs counter-clockwise, as it does in
          Sweden. Drawn clockwise the sign contradicts its own meaning. */}
      <g transform="translate(100 0) scale(-1 1)">
      <g fill="none" stroke={black} strokeWidth="6" strokeLinecap="round">
        <path d="M50 44 a16 16 0 0 1 14 22" />
        <path d="M60 74 a16 16 0 0 1-24-6" />
        <path d="M36 56 a16 16 0 0 1 8-11" />
      </g>
      <path d="M64 62 l5 9 -11 1 z" fill={black} />
      <path d="M38 76 l-8-4 8-7 z" fill={black} />
      <path d="M45 42 l9 5 -9 5 z" fill={black} />
      </g>
    </WarnFrame>
  ),
  /* A25, B6 and B7 all show two opposed arrows, and all three were drawn
     mirrored — and A25 additionally had one arrow in the wrong colour. The
     three were consistent with each other, which is why reading the code never
     revealed it; what settled it was rendering the source's own sign plates
     (Körkortsboken 2026, s. 326 for A25 and s. 328 for B6/B7) and looking.

     A25 carries two *black* arrows: down on the left, up on the right. It
     warns that oncoming traffic begins — neither direction has priority, so
     neither arrow is red. */
  'varning-motande-trafik': (
    <WarnFrame>
      <path d="M40 42 V72 M40 80 l-8-10 h16 z" fill={black} stroke={black} strokeWidth="6" strokeLinejoin="round" />
      <path d="M61 78 V48 M61 40 l-8 10 h16 z" fill={black} stroke={black} strokeWidth="6" strokeLinejoin="round" />
    </WarnFrame>
  ),
  'varning-jarnvag-bommar': (
    <WarnFrame>
      <rect x="26" y="52" width="48" height="7" rx="2" fill={black} />
      <rect x="26" y="44" width="7" height="26" rx="2" fill={black} />
    </WarnFrame>
  ),
  'varning-jarnvag-utan-bommar': (
    // A36 is a steam locomotive seen from the side, not a cross. The cross is
    // A39 Kryssmärke — a separate, differently shaped sign that stands at the
    // crossing itself rather than warning of one ahead.
    <WarnFrame>
      {/* Boiler, cab, chimney, smoke box door and the two wheels. */}
      <path d="M26 60 h30 v-14 h12 v14 h6 v9 h-48 z" fill={black} />
      <rect x="30" y="40" width="8" height="8" rx="1" fill={black} />
      <rect x="24" y="69" width="52" height="4" rx="2" fill={black} />
      <circle cx="37" cy="76" r="5" fill={black} />
      <circle cx="63" cy="76" r="5" fill={black} />
    </WarnFrame>
  ),
  'varning-djur': (
    <WarnFrame>
      {/* Elk: body, four legs, neck, muzzle and palmate antlers. */}
      <path d="M30 58 h26 v13 h-26 z" fill={black} />
      <path d="M31 71 h4 v11 h-4 z M50 71 h4 v11 h-4 z M36 71 h3 v9 h-3 z M46 71 h3 v9 h-3 z" fill={black} />
      <path d="M56 58 l8 -13 h6 l-3 13 z" fill={black} />
      <path d="M64 45 l10 -3 -1 4 -7 3 z" fill={black} />
      <path d="M62 45 l-4 -11 3 1 3 9 z M66 44 l5 -10 2 2 -4 9 z" fill={black} />
    </WarnFrame>
  ),

  /* ---- Väjningspliktsmärken (B) ------------------------------------ */
  vajningsplikt: <YieldFrame />,
  stopp: (
    <>
      <polygon
        points="33,4 67,4 96,33 96,67 67,96 33,96 4,67 4,33"
        fill={red}
        stroke={white}
        strokeWidth="4"
      />
      <Label text="STOPP" size={22} fill={white} y={50} />
    </>
  ),
  huvudled: (
    <>
      {/* Drawn as centred polygons. A rotated <rect> puts the diamond
          off-centre and clips it against the viewBox. */}
      <polygon points="50,6 94,50 50,94 6,50" fill={white} />
      <polygon points="50,18 82,50 50,82 18,50" fill={yellow} />
    </>
  ),
  'huvudled-upphor': (
    <>
      <polygon points="50,6 94,50 50,94 6,50" fill={white} />
      <polygon points="50,18 82,50 50,82 18,50" fill={yellow} />
      <line x1="26" y1="74" x2="74" y2="26" stroke={black} strokeWidth="7" strokeLinecap="round" />
    </>
  ),
  'overgangsstalle-b3': (
    <>
      <rect x="6" y="10" width="88" height="80" rx="5" fill={blue} />
      <path d="M50 24 L76 74 H24 Z" fill={white} />
      <Pedestrian scale={0.5} y={64} />
    </>
  ),
  /* B6: black down on the left, red up on the right. The red arrow is the one
     pointing the way you are travelling — you are the one who yields. */
  'vajningsplikt-motande': (
    <ProhibitFrame>
      <path d="M40 34 V66 M40 76 l-9-12 h18 z" fill={black} stroke={black} strokeWidth="6" strokeLinejoin="round" />
      <path d="M61 76 V44 M61 34 l-9 12 h18 z" fill={red} stroke={red} strokeWidth="6" strokeLinejoin="round" />
    </ProhibitFrame>
  ),
  /* B7: red down on the left, white up on the right. The mirror image of B6 in
     meaning — your direction is the white one, so you go first. */
  'motande-har-vajningsplikt': (
    <>
      <rect x="6" y="10" width="88" height="80" rx="5" fill={blue} />
      <path d="M40 30 V64 M40 78 l-10-14 h20 z" fill={red} stroke={red} strokeWidth="6" strokeLinejoin="round" />
      <path d="M62 78 V38 M62 26 l-10 14 h20 z" fill={white} stroke={white} strokeWidth="6" strokeLinejoin="round" />
    </>
  ),
  cykeloverfart: (
    <>
      <rect x="6" y="10" width="88" height="80" rx="5" fill={blue} />
      <path d="M50 24 L76 74 H24 Z" fill={white} />
      <circle cx="39" cy="63" r="9" fill="none" stroke={black} strokeWidth="3.5" />
      <circle cx="62" cy="63" r="9" fill="none" stroke={black} strokeWidth="3.5" />
      <path d="M39 63 L50 47 L58 47 M50 47 L62 63 M45 47 h10" fill="none" stroke={black} strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="56" cy="41" r="4" fill={black} />
    </>
  ),

  /* ---- Förbudsmärken (C) ------------------------------------------- */
  'forbud-infart': (
    <>
      <circle cx="50" cy="50" r="45" fill={red} />
      <rect x="18" y="42" width="64" height="16" rx="2" fill={white} />
    </>
  ),
  'forbud-trafik-fordon': <ProhibitFrame />,
  'forbud-omkorning': (
    <ProhibitFrame>
      <CarRear x={37} fill={red} />
      <CarRear x={64} fill={black} />
    </ProhibitFrame>
  ),
  'forbud-omkorning-upphor': (
    <ProhibitFrame>
      <CarRear x={37} fill={black} />
      <CarRear x={64} fill={black} />
      <EndBar />
    </ProhibitFrame>
  ),
  'hastighet-30': (
    <ProhibitFrame>
      <Label text="30" />
    </ProhibitFrame>
  ),
  'hastighet-50': (
    <ProhibitFrame>
      <Label text="50" />
    </ProhibitFrame>
  ),
  'hastighet-70': (
    <ProhibitFrame>
      <Label text="70" />
    </ProhibitFrame>
  ),
  'hastighet-90': (
    <ProhibitFrame>
      <Label text="90" />
    </ProhibitFrame>
  ),
  'hastighet-110': (
    <ProhibitFrame>
      <Label text="110" size={31} />
    </ProhibitFrame>
  ),
  'forbud-parkera': (
    <ProhibitBlueFrame>
      <line x1="78" y1="22" x2="22" y2="78" stroke={red} strokeWidth="10" strokeLinecap="round" />
    </ProhibitBlueFrame>
  ),
  'forbud-stanna': (
    <ProhibitBlueFrame>
      <line x1="22" y1="22" x2="78" y2="78" stroke={red} strokeWidth="10" strokeLinecap="round" />
      <line x1="78" y1="22" x2="22" y2="78" stroke={red} strokeWidth="10" strokeLinecap="round" />
    </ProhibitBlueFrame>
  ),

  /* ---- Påbudsmärken (D) -------------------------------------------- */
  'pabud-rakt': (
    <MandatoryFrame>
      <path
        d="M50 76 V34 M50 26 l-15 15 M50 26 l15 15"
        stroke={white}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </MandatoryFrame>
  ),
  'pabud-hoger': (
    <MandatoryFrame>
      <path
        d="M26 50 H68 M76 50 l-15-15 M76 50 l-15 15"
        stroke={white}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </MandatoryFrame>
  ),
  cirkulationsplats: (
    <MandatoryFrame>
      {/* Counter-clockwise, like every Swedish roundabout. See A30 above. */}
      <g transform="translate(100 0) scale(-1 1)">
      <g stroke={white} strokeWidth="7" fill="none" strokeLinecap="round">
        <path d="M50 22 a24 24 0 0 1 22 33" />
        <path d="M66 60 a24 24 0 0 1-38 5" />
        <path d="M30 42 a24 24 0 0 1 12-16" />
      </g>
      <path d="M70 50 l6 10 l-13 1 Z" fill={white} />
      <path d="M32 66 l-9 -5 l10 -8 Z" fill={white} />
      <path d="M44 20 l10 6 l-10 6 Z" fill={white} />
      </g>
    </MandatoryFrame>
  ),
  'pabud-cykelbana': (
    <MandatoryFrame>
      <circle cx="34" cy="64" r="11" fill="none" stroke={white} strokeWidth="4.5" />
      <circle cx="67" cy="64" r="11" fill="none" stroke={white} strokeWidth="4.5" />
      <path d="M34 64 L48 44 L61 44 M48 44 L67 64 M42 44 h12" fill="none" stroke={white} strokeWidth="4.5" strokeLinecap="round" />
      <circle cx="58" cy="35" r="5.5" fill={white} />
    </MandatoryFrame>
  ),
  'pabud-gangbana': (
    <MandatoryFrame>
      <Pedestrian fill={white} scale={0.95} y={54} />
    </MandatoryFrame>
  ),
  'pabud-gang-cykelbana': (
    <MandatoryFrame>
      <line x1="50" y1="16" x2="50" y2="84" stroke={white} strokeWidth="3" />
      <Pedestrian fill={white} scale={0.62} x={30} y={54} />
      <circle cx="62" cy="64" r="8" fill="none" stroke={white} strokeWidth="3.5" />
      <circle cx="82" cy="64" r="8" fill="none" stroke={white} strokeWidth="3.5" />
      <path d="M62 64 L72 49 L80 49 M72 49 L82 64" fill="none" stroke={white} strokeWidth="3.5" strokeLinecap="round" />
    </MandatoryFrame>
  ),
  'pabud-kollektivkorfalt': (
    <MandatoryFrame>
      <rect x="31" y="28" width="38" height="44" rx="6" fill={white} />
      <rect x="36" y="34" width="28" height="14" rx="2" fill={blue} />
      <circle cx="39" cy="66" r="4" fill={blue} />
      <circle cx="61" cy="66" r="4" fill={blue} />
    </MandatoryFrame>
  ),

  /* ---- Anvisningsmärken (E) ---------------------------------------- */
  motorvag: (
    <InfoFrame>
      <path d="M50 26 L74 74 H62 L50 46 L38 74 H26 Z" fill={white} />
      <rect x="46" y="60" width="8" height="16" fill={white} />
    </InfoFrame>
  ),
  'motorvag-upphor': (
    <InfoFrame>
      <path d="M50 26 L74 74 H62 L50 46 L38 74 H26 Z" fill={white} />
      <rect x="46" y="60" width="8" height="16" fill={white} />
      <EndBar colour={red} />
    </InfoFrame>
  ),
  motortrafikled: (
    <InfoFrame>
      <rect x="28" y="34" width="44" height="30" rx="5" fill={white} />
      <rect x="34" y="39" width="32" height="11" rx="2" fill={blue} />
      <circle cx="37" cy="66" r="5" fill={white} />
      <circle cx="63" cy="66" r="5" fill={white} />
    </InfoFrame>
  ),
  'tattbebyggt-omrade': (
    <InfoFrame>
      <rect x="22" y="46" width="18" height="30" fill={white} />
      <rect x="43" y="34" width="16" height="42" fill={white} />
      <rect x="62" y="52" width="16" height="24" fill={white} />
    </InfoFrame>
  ),
  gagata: (
    <InfoFrame>
      <Pedestrian fill={white} scale={0.62} x={40} y={52} />
      <Pedestrian fill={white} scale={0.48} x={60} y={58} />
      <rect x="20" y="76" width="60" height="4" rx="2" fill={white} />
    </InfoFrame>
  ),
  gangfartsomrade: (
    <InfoFrame>
      <Pedestrian fill={white} scale={0.55} x={34} y={48} />
      <Pedestrian fill={white} scale={0.42} x={50} y={54} />
      <rect x="56" y="56" width="30" height="14" rx="4" fill={white} />
      <circle cx="63" cy="72" r="4" fill={white} />
      <circle cx="80" cy="72" r="4" fill={white} />
    </InfoFrame>
  ),
  'rekommenderad-hastighet-30': (
    <InfoFrame>
      <circle cx="50" cy="50" r="30" fill="none" stroke={white} strokeWidth="5" />
      <Label text="30" size={30} fill={white} y={51} />
    </InfoFrame>
  ),
  enkelriktad: (
    <InfoFrame>
      <rect x="18" y="44" width="52" height="12" rx="2" fill={white} />
      <path d="M66 34 l18 16 -18 16 z" fill={white} />
    </InfoFrame>
  ),
  parkering: (
    <InfoFrame>
      <Label text="P" size={58} fill={white} y={52} />
    </InfoFrame>
  ),

  /* ---- Tilläggstavlor (T) ------------------------------------------ */
  'tavla-tid': (
    <PlateFrame>
      <Label text="8–18" size={26} y={50} />
    </PlateFrame>
  ),
  'tavla-tid-lordag': (
    <PlateFrame>
      <Label text="(8–14)" size={24} y={50} />
    </PlateFrame>
  ),
  'tavla-tid-helgdag': (
    <PlateFrame>
      <Label text="9–13" size={26} y={50} fill={red} />
    </PlateFrame>
  ),
  'tavla-avstand': (
    <PlateFrame>
      <Label text="200 m" size={24} y={50} />
    </PlateFrame>
  ),
  'tavla-utstrackning': (
    <PlateFrame>
      <path d="M28 50 h44" stroke={black} strokeWidth="5" strokeLinecap="round" />
      <path d="M28 42 v16 M72 42 v16" stroke={black} strokeWidth="5" strokeLinecap="round" />
      <Label text="60 m" size={17} y={68} />
    </PlateFrame>
  ),
  'tavla-riktning': (
    <PlateFrame>
      <path d="M30 50 h34 M64 50 l-11-9 M64 50 l-11 9" stroke={black} strokeWidth="5" strokeLinecap="round" fill="none" />
    </PlateFrame>
  ),
  'tavla-boende': (
    <PlateFrame>
      <Label text="Boende" size={19} y={50} />
    </PlateFrame>
  ),
  'tavla-avgift': (
    <PlateFrame>
      <Label text="Avgift" size={21} y={50} />
    </PlateFrame>
  ),
  'tavla-flervagsstopp': (
    <PlateFrame>
      <path d="M50 30 V58 M34 44 H66" stroke={black} strokeWidth="5" strokeLinecap="square" />
      <Label text="STOPP" size={13} y={68} fill={red} />
    </PlateFrame>
  ),
  'tavla-nedsatt-syn': (
    <PlateFrame fill={yellow}>
      <Pedestrian scale={0.5} x={42} y={50} />
      {/* The cane: held high at the hand, tip low and forward. */}
      <path d="M52 44 L70 70" stroke={black} strokeWidth="4" strokeLinecap="round" />
      <circle cx="70" cy="70" r="3" fill={black} />
    </PlateFrame>
  ),
};

export type RoadSignName = keyof typeof SIGN_GLYPHS;

export function hasSignGlyph(name: string | undefined): boolean {
  return Boolean(name && name in SIGN_GLYPHS);
}
