import type { ReactElement, ReactNode } from 'react';

/**
 * Swedish road markings, drawn as vectors.
 *
 * Markings differ from signs in one way that shapes the whole component: a
 * marking only makes sense on a piece of road. A stop line floating on a white
 * card teaches nothing — it is the asphalt, the direction of travel and the
 * position of the line that carry the meaning.
 *
 * So every glyph is drawn *in situ*, on a short stretch of carriageway, seen
 * from above with travel pointing up the screen. The viewBox is 100×100 to
 * match the sign set.
 *
 * The road surface uses fixed neutral greys rather than theme tokens: the
 * contrast between white paint and dark asphalt is the thing being taught, and
 * it must not invert with the interface theme.
 */

export const MARKING_COLOURS = {
  asphalt: '#4A5154',
  asphaltDark: '#3E4447',
  paint: '#FFFFFF',
  shoulder: '#6B7276',
  kerb: '#8C9296',
} as const;

const { asphalt, paint, shoulder } = MARKING_COLOURS;

/** A two-way carriageway seen from above, travel pointing up. */
function Road({ children }: { children?: ReactNode }) {
  return (
    <>
      <rect x="0" y="0" width="100" height="100" fill={shoulder} />
      <rect x="12" y="0" width="76" height="100" fill={asphalt} />
      {children}
    </>
  );
}

/** Repeats a dash pattern down the centre of the road. */
function DashRun({
  x = 50,
  width = 4,
  dash,
  gap,
  colour = paint,
}: {
  x?: number;
  width?: number;
  dash: number;
  gap: number;
  colour?: string;
}) {
  const items: ReactElement[] = [];
  for (let y = 2; y < 100; y += dash + gap) {
    items.push(
      <rect key={y} x={x - width / 2} y={y} width={width} height={Math.min(dash, 100 - y)} fill={colour} />,
    );
  }
  return <>{items}</>;
}

/** Solid line down the road. */
function SolidRun({ x = 50, width = 4, colour = paint }: { x?: number; width?: number; colour?: string }) {
  return <rect x={x - width / 2} y="0" width={width} height="100" fill={colour} />;
}

/** The arrow that shows which way "up" is, so the reader knows their side. */
function TravelArrow({ x = 70, colour = paint }: { x?: number; colour?: string }) {
  return (
    <g opacity="0.55">
      <rect x={x - 1.6} y="58" width="3.2" height="26" fill={colour} />
      <path d={`M${x} 50 l-8 10 h16 z`} fill={colour} />
    </g>
  );
}

export const MARKING_GLYPHS: Record<string, ReactElement> = {
  /* ---- Längsgående ------------------------------------------------- */
  mittlinje: (
    <Road>
      <DashRun dash={9} gap={16} />
      <TravelArrow />
    </Road>
  ),
  varningslinje: (
    <Road>
      <DashRun dash={20} gap={7} />
      <TravelArrow />
    </Road>
  ),
  'heldragen-linje': (
    <Road>
      <SolidRun />
      <TravelArrow />
    </Road>
  ),
  'kombinerad-linje': (
    <Road>
      {/* Solid on the right-hand side (the reader's side), broken on the left. */}
      <DashRun x={45} dash={9} gap={16} />
      <SolidRun x={55} />
      <TravelArrow />
    </Road>
  ),
  kantlinje: (
    <Road>
      <SolidRun x={15} width={3.5} />
      <SolidRun x={85} width={3.5} />
      <DashRun dash={9} gap={16} />
      <TravelArrow />
    </Road>
  ),
  ledlinje: (
    <Road>
      <DashRun dash={5} gap={5} />
      <TravelArrow />
    </Road>
  ),
  sparromrade: (
    <Road>
      <SolidRun x={38} width={3} />
      <SolidRun x={62} width={3} />
      {[10, 22, 34, 46, 58, 70, 82].map((y) => (
        <line key={y} x1="39" y1={y + 10} x2="61" y2={y} stroke={paint} strokeWidth="2.6" />
      ))}
      <TravelArrow x={76} />
    </Road>
  ),

  /* ---- Tvärgående -------------------------------------------------- */
  stopplinje: (
    <Road>
      <DashRun dash={9} gap={16} />
      <rect x="52" y="40" width="34" height="7" fill={paint} />
      <TravelArrow x={69} />
    </Road>
  ),
  vajningslinje: (
    <Road>
      <DashRun dash={9} gap={16} />
      {/* Shark's teeth: triangles pointing back at the approaching driver. */}
      {[54, 62, 70, 78].map((x) => (
        <path key={x} d={`M${x} 40 l7 0 l-3.5 8 z`} fill={paint} />
      ))}
      <TravelArrow x={69} />
    </Road>
  ),
  'overgangsstalle-m15': (
    <Road>
      {/* Broad bands running along the direction of travel. */}
      {[16, 27, 38, 49, 60, 71, 82].map((x) => (
        <rect key={x} x={x} y="34" width="7" height="30" fill={paint} />
      ))}
      <TravelArrow x={94} colour={shoulder} />
    </Road>
  ),
  'cykelpassage-m16': (
    <Road>
      {/* Two rows of squares — the cycle crossing's own pattern. */}
      {[15, 26, 37, 48, 59, 70, 81].map((x) => (
        <rect key={`a${x}`} x={x} y="36" width="7" height="7" fill={paint} />
      ))}
      {[15, 26, 37, 48, 59, 70, 81].map((x) => (
        <rect key={`b${x}`} x={x} y="52" width="7" height="7" fill={paint} />
      ))}
    </Road>
  ),

  /* ---- Symboler ----------------------------------------------------- */
  korfaltspilar: (
    <Road>
      <SolidRun x={50} width={3} />
      {/* Left lane: straight ahead. */}
      <g fill={paint}>
        <rect x="29.5" y="46" width="3.5" height="26" />
        <path d="M31 34 l-9 12 h18 z" />
      </g>
      {/* Right lane: straight ahead or right. */}
      <g fill={paint}>
        <rect x="66.5" y="46" width="3.5" height="26" />
        <path d="M68 34 l-8 11 h16 z" />
        <path d="M70 52 h9 v-6 l9 9 -9 9 v-6 h-9 z" />
      </g>
    </Road>
  ),
  'markering-cykel': (
    <Road>
      <circle cx="40" cy="62" r="11" fill="none" stroke={paint} strokeWidth="4" />
      <circle cx="66" cy="62" r="11" fill="none" stroke={paint} strokeWidth="4" />
      <path
        d="M40 62 L52 40 L62 40 M52 40 L66 62 M46 40 h12"
        fill="none"
        stroke={paint}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="60" cy="30" r="6" fill={paint} />
    </Road>
  ),
  'markering-buss': (
    <Road>
      <rect x="34" y="26" width="32" height="48" rx="6" fill={paint} />
      <rect x="39" y="33" width="22" height="15" rx="3" fill={asphalt} />
      <circle cx="42" cy="66" r="4" fill={asphalt} />
      <circle cx="58" cy="66" r="4" fill={asphalt} />
    </Road>
  ),
  'markering-hastighet': (
    <Road>
      <text
        x="50"
        y="52"
        fill={paint}
        fontSize="42"
        fontWeight="700"
        fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
        textAnchor="middle"
        dominantBaseline="central"
      >
        50
      </text>
    </Road>
  ),
};

export function hasMarkingGlyph(id: string | undefined): boolean {
  return Boolean(id && id in MARKING_GLYPHS);
}
