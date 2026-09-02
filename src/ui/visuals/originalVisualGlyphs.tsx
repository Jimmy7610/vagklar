import type { ReactElement, ReactNode } from 'react';

/**
 * Vägklar's own teaching diagrams, drawn as vectors.
 *
 * These are not licensed material. Everything in this file was drawn for
 * Vägklar because the source book has no figure that teaches the thing, or has
 * one that teaches it worse than a purpose-built drawing would. Tyres and crash
 * mechanics are the two places where that gap was widest: the chapters are full
 * of prose about tread depth and impact energy, and almost empty of pictures.
 *
 * Three rules shape every drawing here.
 *
 * **Fixed colours, not theme tokens.** A diagram whose meaning lives in colour
 * cannot be inverted. Red means "wrong" and green means "right" in both themes,
 * water is blue in both, and asphalt is dark in both. The figure component puts
 * a light plate behind the drawing so the fixed palette always has the contrast
 * it was drawn for — the same treatment the licensed diagrams get.
 *
 * **Nothing is carried by colour alone.** Every contrast is also a shape, a
 * position or a word: the worn tyre is visibly shorter, the wrong belt visibly
 * crosses the belly, and both are labelled.
 *
 * **Text inside a drawing is duplicated in the registry.** A measurement drawn
 * as pixels reaches nobody using a screen reader. Whatever is printed here is
 * transcribed into `labelText` in original-visuals.ts, and a test enforces it.
 */

export const VISUAL_COLOURS = {
  ink: '#1D2226',
  inkSoft: '#5B6469',
  rubber: '#33383B',
  rubberWorn: '#787F84',
  carcass: '#22262A',
  ground: '#9AA1A6',
  road: '#4A5154',
  paint: '#FFFFFF',
  water: '#5AA9D6',
  waterDeep: '#2C7DAB',
  good: '#1B7F45',
  bad: '#BE3125',
  warn: '#C9821A',
  body: '#2F6FB2',
  bodySoft: '#A9C8E4',
  skin: '#4A5154',
  plate: '#F2F3F5',
} as const;

const C = VISUAL_COLOURS;

const FONT = 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif';

/** A caption under a panel. */
function label(x: number, y: number, text: string, fill: string = C.ink, size = 12) {
  return (
    <text x={x} y={y} fontFamily={FONT} fontSize={size} fontWeight={600} fill={fill} textAnchor="middle">
      {text}
    </text>
  );
}

/** A small note, lighter than a label. */
function note(x: number, y: number, text: string, anchor: 'middle' | 'start' | 'end' = 'middle', size = 10) {
  return (
    <text x={x} y={y} fontFamily={FONT} fontSize={size} fill={C.inkSoft} textAnchor={anchor}>
      {text}
    </text>
  );
}

/** A verdict chip: the word plus a shape, so the judgement never rests on hue. */
function verdict(x: number, y: number, ok: boolean, text: string) {
  const fill = ok ? C.good : C.bad;
  return (
    <g>
      <circle cx={x - 34} cy={y - 4} r={7} fill={fill} />
      {ok ? (
        <path d={`M ${x - 37.5} ${y - 4} l 2.5 2.5 l 5 -5.5`} stroke="#fff" strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d={`M ${x - 37} ${y - 7} l 6 6 M ${x - 31} ${y - 7} l -6 6`} stroke="#fff" strokeWidth={1.8} strokeLinecap="round" />
      )}
      <text x={x - 22} y={y} fontFamily={FONT} fontSize={12} fontWeight={700} fill={fill} textAnchor="start">
        {text}
      </text>
    </g>
  );
}

/** An arrow, used for direction of travel and for force. */
function arrow(x1: number, y1: number, x2: number, y2: number, colour: string, width = 3) {
  const id = `ah-${Math.round(x1)}-${Math.round(y1)}-${Math.round(x2)}-${Math.round(y2)}`;
  return (
    <g>
      <defs>
        <marker id={id} markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill={colour} />
        </marker>
      </defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={colour} strokeWidth={width} markerEnd={`url(#${id})`} strokeLinecap="round" />
    </g>
  );
}

/* ===================== DÄCK ===================== */

/**
 * Tread depth, as a cross-section.
 *
 * Drawn rather than photographed because the thing being taught is a distance
 * that is a few millimetres across. A photograph of a worn tyre shows a worn
 * tyre; it does not show how far down the groove goes, which is the entire
 * legal test.
 */
const monsterdjup: ReactElement = (
  <g>
    <rect x={0} y={0} width={320} height={180} fill="none" />

    {[
      { x: 18, top: 66, depth: 70, name: 'Nytt däck', mm: '8 mm', ok: true },
      { x: 178, top: 114, depth: 22, name: 'Vid slitgränsen', mm: '1,6 mm', ok: false },
    ].map((p) => {
      const base = 136;
      const blocks = [0, 1, 2, 3];
      return (
        <g key={p.name}>
          {/* Carcass: the part that never wears away. */}
          <rect x={p.x} y={base} width={104} height={16} rx={3} fill={C.carcass} />
          {/* Tread blocks, with the grooves as the gaps between them. */}
          {blocks.map((b) => (
            <rect
              key={b}
              x={p.x + 4 + b * 25}
              y={p.top}
              width={17}
              height={base - p.top + 2}
              rx={2}
              fill={p.ok ? C.rubber : C.rubberWorn}
            />
          ))}
          {/* The measurement itself. */}
          <line x1={p.x + 112} y1={p.top} x2={p.x + 112} y2={base} stroke={C.ink} strokeWidth={1.4} />
          <line x1={p.x + 108} y1={p.top} x2={p.x + 116} y2={p.top} stroke={C.ink} strokeWidth={1.4} />
          <line x1={p.x + 108} y1={base} x2={p.x + 116} y2={base} stroke={C.ink} strokeWidth={1.4} />
          {/* Above the panel, not beside it: beside it the second panel's
              label ran past the right edge of the viewBox and was clipped. */}
          <text
            x={p.x + 52}
            y={p.top - 10}
            fontFamily={FONT}
            fontSize={13}
            fontWeight={700}
            fill={p.ok ? C.good : C.bad}
            textAnchor="middle"
          >
            {p.mm}
          </text>
          {label(p.x + 52, 170, p.name)}
        </g>
      );
    })}

    {/* Short enough to fit. The sentence that explains why lives in the
        lesson caption, where it can wrap. */}
    <text x={160} y={26} fontFamily={FONT} fontSize={12} fontWeight={700} fill={C.ink} textAnchor="middle">
      Minst 1,6 mm · vinterdäck minst 3 mm
    </text>
  </g>
);

/**
 * Summer versus winter tread, seen from above.
 *
 * The difference that matters to a learner is not the rubber compound, which
 * cannot be drawn, but the pattern: a winter tyre has far more edges, and edges
 * are what bite into snow.
 */
const sommarVinterdack: ReactElement = (
  <g>
    {/* Summer: wide ribs, long grooves, few cuts. */}
    <g>
      <rect x={30} y={26} width={100} height={118} rx={12} fill={C.rubber} />
      {[0, 1].map((i) => (
        <rect key={i} x={57 + i * 30} y={26} width={9} height={118} fill={C.plate} />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={34} y={36 + i * 24} width={19} height={4} rx={2} fill={C.plate} />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={107} y={36 + i * 24} width={19} height={4} rx={2} fill={C.plate} />
      ))}
      {label(80, 162, 'Sommardäck')}
      {note(80, 16, 'Få kanter, breda spår')}
    </g>

    {/* Winter: blocks broken up by many fine sipes. */}
    <g>
      <rect x={190} y={26} width={100} height={118} rx={12} fill={C.rubber} />
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2].map((c) => (
          <g key={`${r}-${c}`}>
            <rect x={195 + c * 31} y={31 + r * 28} width={25} height={22} rx={3} fill={C.rubber} stroke={C.plate} strokeWidth={2} />
            {[0, 1, 2].map((s) => (
              <line
                key={s}
                x1={196 + c * 31}
                y1={37 + r * 28 + s * 5}
                x2={219 + c * 31}
                y2={37 + r * 28 + s * 5}
                stroke={C.plate}
                strokeWidth={1.3}
              />
            ))}
          </g>
        )),
      )}
      {label(240, 162, 'Vinterdäck')}
      {note(240, 16, 'Många kanter som biter i snö')}
    </g>
  </g>
);

/**
 * Aquaplaning, as three moments rather than as physics.
 *
 * The speeds are deliberately named and not numbered. The speed at which a tyre
 * lifts depends on water depth, tread depth, load and tyre width, so a figure
 * that printed "80 km/h" would be teaching a number that is not true in
 * general.
 */
const vattenplaning: ReactElement = (
  <g>
    {[
      { x: 8, name: 'Låg fart', wedge: 10, contact: 44, verdictOk: true, text: 'Spåren hinner leda undan vattnet' },
      { x: 110, name: 'Högre fart', wedge: 30, contact: 22, verdictOk: false, text: 'Vattnet hinner inte undan' },
      { x: 212, name: 'Vattenplaning', wedge: 56, contact: 0, verdictOk: false, text: 'Däcket rider på vattnet' },
    ].map((s) => {
      const road = 118;
      const cx = s.x + 50;
      return (
        <g key={s.name}>
          {/* Road and the standing water on it. */}
          <rect x={s.x} y={road} width={100} height={16} fill={C.road} />
          <rect x={s.x} y={road - 7} width={100} height={7} fill={C.water} opacity={0.75} />

          {/* The wedge of water that the tyre climbs as speed rises. */}
          {s.wedge > 0 && (
            <path
              d={`M ${cx - 6} ${road} L ${cx - 6 - s.wedge} ${road} L ${cx - 6} ${road - 13} Z`}
              fill={C.waterDeep}
            />
          )}

          <circle cx={cx} cy={road - 30} r={30} fill={C.rubber} />
          <circle cx={cx} cy={road - 30} r={13} fill={C.ground} />
          {/* Direction of travel. */}
          {arrow(cx + 4, road - 30, cx - 30, road - 30, C.paint, 2.5)}

          {/* How much rubber is still touching. */}
          {s.contact > 0 ? (
            <rect x={cx - s.contact / 2} y={road - 3} width={s.contact} height={4} fill={C.good} />
          ) : (
            <rect x={cx - 22} y={road - 3} width={44} height={4} fill={C.bad} />
          )}

          {label(cx, 150, s.name, s.verdictOk ? C.good : C.bad, 11)}
          <text x={cx} y={167} fontFamily={FONT} fontSize={10} fill={C.inkSoft} textAnchor="middle">
            {s.text.split(' ').slice(0, 3).join(' ')}
          </text>
          <text x={cx} y={180} fontFamily={FONT} fontSize={10} fill={C.inkSoft} textAnchor="middle">
            {s.text.split(' ').slice(3).join(' ')}
          </text>
        </g>
      );
    })}
    {note(160, 14, 'Samma däck, samma vattendjup — bara farten skiljer')}
    {note(160, 196, 'Risken växer med farten, vattendjupet och slitna däck')}
  </g>
);

/**
 * Inflation pressure, shown through the footprint it produces.
 *
 * Pressure itself is invisible. What a learner can be taught to see is the
 * consequence: which part of the tread is carrying the car, and therefore which
 * part wears out first.
 */
const dacktryck: ReactElement = (
  <g>
    {[
      {
        x: 10,
        name: 'För lågt tryck',
        bulge: 9,
        patch: [{ o: -26, w: 18 }, { o: 8, w: 18 }],
        wear: 'Slits på kanterna',
        ok: false,
      },
      { x: 112, name: 'Rätt tryck', bulge: 0, patch: [{ o: -26, w: 52 }], wear: 'Slits jämnt', ok: true },
      { x: 214, name: 'För högt tryck', bulge: -7, patch: [{ o: -10, w: 20 }], wear: 'Slits i mitten', ok: false },
    ].map((p) => {
      const cx = p.x + 48;
      const top = 34;
      const bottom = 104;
      return (
        <g key={p.name}>
          {/* Tyre seen head-on. The sidewalls bow outward when it is soft. */}
          <path
            d={`M ${cx - 26} ${top}
                C ${cx - 26 - p.bulge} ${top + 24}, ${cx - 26 - p.bulge} ${bottom - 24}, ${cx - 26} ${bottom}
                L ${cx + 26} ${bottom}
                C ${cx + 26 + p.bulge} ${bottom - 24}, ${cx + 26 + p.bulge} ${top + 24}, ${cx + 26} ${top} Z`}
            fill={C.rubber}
          />
          <rect x={cx - 15} y={top + 10} width={30} height={bottom - top - 20} rx={4} fill={C.ground} />

          {/* The road, and the part of the tread actually on it. */}
          <rect x={p.x + 6} y={bottom} width={84} height={7} fill={C.road} />
          {p.patch.map((seg, i) => (
            <rect key={i} x={cx + seg.o} y={bottom - 3} width={seg.w} height={5} fill={p.ok ? C.good : C.bad} />
          ))}

          {label(cx, 126, p.name, C.ink, 11)}
          {note(cx, 142, p.wear)}
          {note(cx, 158, p.ok ? 'och håller längst' : 'i förtid')}
        </g>
      );
    })}
    {note(160, 18, 'Grönt och rött visar vilken del av mönstret som bär bilen')}
  </g>
);

/**
 * What to look for on a sidewall.
 *
 * Numbered rather than colour-coded, because the three faults look different
 * from each other and the numbers survive a black-and-white printout and a
 * screen reader alike.
 */
const dackskador: ReactElement = (
  <g>
    {/* A stretch of sidewall, seen from the side. */}
    <path d="M 20 118 Q 160 58 300 118" stroke={C.rubber} strokeWidth={34} fill="none" strokeLinecap="round" />
    <path d="M 20 118 Q 160 58 300 118" stroke={C.carcass} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.5} />

    {/* 1 — a bulge: the carcass has let go underneath. */}
    <path d="M 68 96 q 14 -19 28 0" fill={C.rubber} stroke={C.bad} strokeWidth={2.5} />
    <circle cx={82} cy={64} r={11} fill={C.bad} />
    <text x={82} y={68} fontFamily={FONT} fontSize={12} fontWeight={700} fill="#fff" textAnchor="middle">1</text>

    {/* 2 — a cut. */}
    <path d="M 152 66 l 10 16 l -6 3 l -8 -16 z" fill={C.plate} stroke={C.bad} strokeWidth={2} />
    <circle cx={160} cy={44} r={11} fill={C.bad} />
    <text x={160} y={48} fontFamily={FONT} fontSize={12} fontWeight={700} fill="#fff" textAnchor="middle">2</text>

    {/* 3 — age cracking. */}
    {[0, 1, 2, 3].map((i) => (
      <line key={i} x1={228 + i * 10} y1={76 + i * 5} x2={234 + i * 10} y2={88 + i * 5} stroke={C.warn} strokeWidth={2} strokeLinecap="round" />
    ))}
    <circle cx={248} cy={56} r={11} fill={C.warn} />
    <text x={248} y={60} fontFamily={FONT} fontSize={12} fontWeight={700} fill="#fff" textAnchor="middle">3</text>

    <text x={16} y={148} fontFamily={FONT} fontSize={11} fill={C.ink} textAnchor="start">
      1 Blåsa — byt däcket, det kan brista
    </text>
    <text x={16} y={163} fontFamily={FONT} fontSize={11} fill={C.ink} textAnchor="start">
      2 Skärskada in i stommen — byt däcket
    </text>
    <text x={185} y={148} fontFamily={FONT} fontSize={11} fill={C.ink} textAnchor="start">
      3 Sprickor av ålder
    </text>
    <text x={185} y={163} fontFamily={FONT} fontSize={11} fill={C.ink} textAnchor="start">
      — låt kontrollera däcket
    </text>
  </g>
);

/* ===================== TRAFIKOLYCKOR ===================== */

/** A plain car silhouette, seen from the side, nose pointing right. */
function car(x: number, y: number, scale: number, fill: string) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path
        d="M 4 26 L 10 12 Q 12 8 18 8 L 40 8 Q 46 8 50 12 L 62 24 L 68 26 Q 72 27 72 31 L 72 36 L 4 36 Q 0 36 0 32 Z"
        fill={fill}
      />
      <path d="M 16 12 L 36 12 L 36 23 L 12 23 Z" fill={C.bodySoft} opacity={0.85} />
      <path d="M 40 12 L 46 12 L 56 23 L 40 23 Z" fill={C.bodySoft} opacity={0.85} />
      <circle cx={18} cy={36} r={7} fill={C.carcass} />
      <circle cx={57} cy={36} r={7} fill={C.carcass} />
    </g>
  );
}

/**
 * Why speed matters, expressed as energy rather than as outcome.
 *
 * The relationship drawn is the one that is actually derivable: kinetic energy
 * rises with the square of the speed, so twice the speed is four times the
 * energy that has to go somewhere in a collision. No injury statistics are
 * shown, because none could be sourced honestly at this level.
 */
const krockvaldHastighet: ReactElement = (
  <g>
    {[
      // Widths are exactly 1:4, and short enough that the multiplier printed
      // after the longer bar still lands inside the viewBox.
      { y: 40, speed: '30 km/h', units: 1, w: 44, colour: C.good },
      { y: 108, speed: '60 km/h', units: 4, w: 176, colour: C.bad },
    ].map((r) => (
      <g key={r.speed}>
        {car(10, r.y - 22, 0.62, C.body)}
        <text x={62} y={r.y + 22} fontFamily={FONT} fontSize={12} fontWeight={700} fill={C.ink} textAnchor="middle">
          {r.speed}
        </text>
        <rect x={100} y={r.y - 16} width={r.w} height={26} rx={4} fill={r.colour} />
        <text
          x={100 + r.w + 8}
          y={r.y + 3}
          fontFamily={FONT}
          fontSize={13}
          fontWeight={700}
          fill={r.colour}
          textAnchor="start"
        >
          {r.units}×
        </text>
      </g>
    ))}
    {note(160, 18, 'Rörelseenergi vid dubbla farten')}
    <text x={160} y={168} fontFamily={FONT} fontSize={12} fontWeight={700} fill={C.ink} textAnchor="middle">
      Dubbla farten ger fyra gånger rörelseenergin
    </text>
  </g>
);

/**
 * The three collisions in one crash.
 *
 * The classic teaching sequence, and the reason a seat belt is not optional:
 * the car stopping is only the first of three impacts, and the two that follow
 * happen inside it.
 */
const treKollisioner: ReactElement = (
  <g>
    {[
      { y: 6, n: '1', title: 'Bilen stannar', text: 'mot det den träffar' },
      { y: 72, n: '2', title: 'Kroppen fortsätter', text: 'tills bältet tar emot' },
      { y: 138, n: '3', title: 'Inre organ fortsätter', text: 'ytterligare ett ögonblick' },
    ].map((f, i) => (
      <g key={f.n}>
        <circle cx={16} cy={f.y + 30} r={11} fill={C.ink} />
        <text x={16} y={f.y + 34} fontFamily={FONT} fontSize={12} fontWeight={700} fill="#fff" textAnchor="middle">
          {f.n}
        </text>

        {/* The obstacle, with the car's nose actually against it. An earlier
            version left a gap, which read as a car parked near a wall rather
            than one that had hit it. */}
        <rect x={124} y={f.y + 8} width={9} height={44} fill={C.ground} />
        {[0, 1, 2].map((h) => (
          <line key={h} x1={124} y1={f.y + 14 + h * 13} x2={133} y2={f.y + 20 + h * 13} stroke={C.inkSoft} strokeWidth={1.2} />
        ))}
        {car(80, f.y + 14, 0.58, C.body)}

        {/* The occupant: head and torso, drawn over the car so the body is
            visibly a separate thing from the shell around it. */}
        <circle cx={i === 0 ? 100 : 105} cy={f.y + 20} r={5.5} fill={C.ink} />
        <path
          d={`M ${(i === 0 ? 100 : 105) - 5} ${f.y + 26} h 10 v 11 h -10 z`}
          fill={C.ink}
        />
        {/* Belt: slack in frame 1, taut once it is doing its job. */}
        <path
          d={`M ${(i === 0 ? 96 : 101)} ${f.y + 25} L ${(i === 0 ? 104 : 109)} ${f.y + 37}`}
          stroke={i === 0 ? C.inkSoft : C.good}
          strokeWidth={2.4}
          strokeLinecap="round"
        />
        {/* What is still moving, marked above the roof where nothing collides. */}
        {i === 0 ? arrow(58, f.y + 8, 78, f.y + 8, C.ink, 2.2) : arrow(96, f.y + 8, 120, f.y + 8, C.bad, 2.2)}
        {i === 2 && <circle cx={107} cy={f.y + 31} r={3.2} fill={C.bad} />}

        <text x={146} y={f.y + 26} fontFamily={FONT} fontSize={12} fontWeight={700} fill={C.ink} textAnchor="start">
          {f.title}
        </text>
        <text x={146} y={f.y + 42} fontFamily={FONT} fontSize={10} fill={C.inkSoft} textAnchor="start">
          {f.text}
        </text>
      </g>
    ))}
  </g>
);

/**
 * Head restraint height.
 *
 * A rear-end collision throws the body forward against the seat and the head
 * backward relative to it. What stops the head is the restraint, and only if it
 * is high enough to be behind the head rather than behind the neck.
 */
const nackskyddPosition: ReactElement = (
  <g>
    {/* One label for both panels. Per-panel it collided with the seat back,
        and half the word disappeared behind it. */}
    {note(160, 18, 'Båda blir påkörda bakifrån — pilen visar varifrån')}
    {[
      { x: 14, name: 'Rätt inställt', top: 40, ok: true, hint: 'Överkanten i höjd med hjässan' },
      { x: 176, name: 'För lågt', top: 66, ok: false, hint: 'Stödet hamnar bakom nacken' },
    ].map((p) => {
      const headCx = p.x + 78;
      const headCy = 62;
      return (
        <g key={p.name}>
          {/* Seat back. */}
          <rect x={p.x + 96} y={54} width={20} height={72} rx={6} fill={C.body} />
          {/* Head restraint. */}
          <rect x={p.x + 94} y={p.top} width={24} height={26} rx={6} fill={p.ok ? C.good : C.bad} />
          {/* Occupant. */}
          <circle cx={headCx} cy={headCy} r={17} fill={C.skin} />
          <path d={`M ${p.x + 66} 88 Q ${p.x + 78} 82 ${p.x + 96} 88 L ${p.x + 96} 126 L ${p.x + 62} 126 Z`} fill={C.skin} />

          {/* The impulse comes from behind. */}
          {arrow(p.x + 136, 100, p.x + 122, 100, C.ink, 2.4)}

          {/* Where the head ends up. */}
          <path
            d={`M ${headCx + 14} ${headCy - 12} q 12 6 ${p.ok ? 8 : 14} ${p.ok ? 10 : 20}`}
            stroke={p.ok ? C.good : C.bad}
            strokeWidth={2}
            strokeDasharray="3 3"
            fill="none"
          />

          {/* A guide line at the top of the head, so "level with" is visible. */}
          <line
            x1={p.x + 52}
            y1={headCy - 17}
            x2={p.x + 124}
            y2={headCy - 17}
            stroke={C.inkSoft}
            strokeWidth={1}
            strokeDasharray="4 3"
          />

          {verdict(p.x + 78, 152, p.ok, p.name)}
          {note(p.x + 66, 170, p.hint)}
        </g>
      );
    })}
  </g>
);

/**
 * Where the belt has to sit.
 *
 * The lap belt belongs on the pelvis, which is bone and can take the load. Over
 * the belly it loads soft tissue instead, and a belt worn under the arm gives
 * the shoulder nothing to work against.
 */
const baltetsVag: ReactElement = (
  <g>
    {[
      { x: 16, name: 'Rätt', ok: true, lapY: 108, dx1: 56, dy1: 44, dx2: 96, dy2: 104, hint: 'Höftbältet lågt över bäckenet' },
      { x: 176, name: 'Fel', ok: false, lapY: 88, dx1: 92, dy1: 62, dx2: 98, dy2: 104, hint: 'Över magen, bältet under armen' },
    ].map((p) => (
      <g key={p.name}>
        {/* Seat. */}
        <rect x={p.x + 96} y={36} width={18} height={94} rx={6} fill={C.body} opacity={0.55} />
        {/* Torso and head. */}
        <circle cx={p.x + 70} cy={34} r={15} fill={C.skin} />
        <path d={`M ${p.x + 52} 56 Q ${p.x + 70} 50 ${p.x + 94} 56 L ${p.x + 96} 122 L ${p.x + 48} 122 Z`} fill={C.skin} />
        {/* Pelvis, drawn so "low over the hips" has something to be low over. */}
        <rect x={p.x + 48} y={104} width={48} height={12} rx={5} fill={C.ground} />
        {note(p.x + 40, 113, 'bäcken', 'end', 9)}

        {/* Lap belt. */}
        <line
          x1={p.x + 46}
          y1={p.lapY}
          x2={p.x + 98}
          y2={p.lapY}
          stroke={p.ok ? C.good : C.bad}
          strokeWidth={6}
          strokeLinecap="round"
        />
        {/* Diagonal belt: over the shoulder on the left, under the arm on the right. */}
        <line
          x1={p.x + p.dx1}
          y1={p.dy1}
          x2={p.x + p.dx2}
          y2={p.dy2}
          stroke={p.ok ? C.good : C.bad}
          strokeWidth={6}
          strokeLinecap="round"
        />

        {verdict(p.x + 72, 152, p.ok, p.name)}
        {note(p.x + 66, 170, p.hint)}
      </g>
    ))}
  </g>
);

/**
 * Placing the warning triangle.
 *
 * The distance is not a fixed number in the rules — it is "so far back that
 * traffic is warned in time", which depends on speed and on what can be seen.
 * The drawing says exactly that rather than inventing metres.
 */
const varningstriangel: ReactElement = (
  <g>
    <rect x={0} y={78} width={320} height={34} fill={C.road} />
    <rect x={0} y={112} width={320} height={5} fill={C.ground} />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <rect key={i} x={8 + i * 56} y={93} width={26} height={4} fill={C.paint} />
    ))}

    {/* The broken-down car, on the shoulder, hazards on. */}
    {car(238, 60, 0.7, C.body)}
    <circle cx={244} cy={58} r={4} fill={C.warn} />
    <circle cx={288} cy={58} r={4} fill={C.warn} />

    {/* The triangle, well back down the road. */}
    <path d="M 62 84 L 76 60 L 90 84 Z" fill={C.bad} />
    <path d="M 68 81 L 76 67 L 84 81 Z" fill={C.plate} />

    {/* The distance between them, deliberately unnumbered. */}
    <line x1={94} y1={128} x2={232} y2={128} stroke={C.ink} strokeWidth={1.4} />
    <line x1={94} y1={124} x2={94} y2={132} stroke={C.ink} strokeWidth={1.4} />
    <line x1={232} y1={124} x2={232} y2={132} stroke={C.ink} strokeWidth={1.4} />
    <text x={163} y={144} fontFamily={FONT} fontSize={11} fontWeight={700} fill={C.ink} textAnchor="middle">
      Så långt att trafiken hinner reagera
    </text>
    {note(163, 158, 'Längre vid hög hastighet, och längre före krön och kurva')}
    {note(76, 52, 'Varningstriangeln')}
  </g>
);


/* ============ Frågevarianter ============
   A teaching diagram names what it shows — "För lågt tryck", "Rätt" — because
   a lesson is where the answer belongs. A question cannot use that drawing: the
   caption would be the answer key.

   So the question variants below draw the same physics with the labels taken
   out. They are not the teaching diagrams with the words hidden; they are
   single unlabelled cases, which is what a question actually needs. The
   description in the registry still says exactly what is drawn, so the question
   is answerable without seeing it. */

/**
 * One tread in cross-section, worn away at both shoulders.
 *
 * Drawn as a section rather than from above on purpose: from above, "worn"
 * and "not worn" are two similar shades of grey and the reader has to be told
 * which is which. In section it is a height, and the difference is simply
 * visible. The dashed line marks where the tread started, so what is missing
 * is as legible as what is left.
 */
const dackslitageFraga: ReactElement = (
  <g>
    {/* Carcass. */}
    <rect x={62} y={112} width={196} height={16} rx={3} fill={C.carcass} />

    {/* Five ribs. The middle three still have their full height; the two at
        the shoulders have been rubbed down to almost nothing. */}
    {[
      { x: 66, w: 30, top: 92 },
      { x: 104, w: 30, top: 56 },
      { x: 142, w: 30, top: 56 },
      { x: 180, w: 30, top: 56 },
      { x: 218, w: 30, top: 92 },
    ].map((b, i) => (
      <rect
        key={i}
        x={b.x}
        y={b.top}
        width={b.w}
        height={114 - b.top}
        rx={3}
        fill={b.top > 60 ? C.rubberWorn : C.rubber}
      />
    ))}

    {/* Where the tread began. */}
    <line x1={56} y1={58} x2={264} y2={58} stroke={C.ink} strokeWidth={1.2} strokeDasharray="5 4" />
    {/* Above the line and right-aligned inside it: anchored to the left of the
        line it ran off the edge of the viewBox and lost its first syllable. */}
    {note(264, 51, 'ursprunglig höjd', 'end', 9)}

    {/* The rubber that is gone, marked as a gap rather than named. */}
    {[81, 233].map((cx) => (
      <g key={cx}>
        <line x1={cx} y1={58} x2={cx} y2={90} stroke={C.ink} strokeWidth={1.2} />
        <line x1={cx - 4} y1={90} x2={cx + 4} y2={90} stroke={C.ink} strokeWidth={1.2} />
      </g>
    ))}

    {note(81, 145, 'kant')}
    {note(157, 145, 'mitten')}
    {note(233, 145, 'kant')}
    {note(160, 24, 'Mönstret sett i genomskärning')}
  </g>
);

/** A head restraint sitting too low, with nothing said about it. */
const nackskyddFraga: ReactElement = (
  <g>
    <rect x={150} y={54} width={22} height={80} rx={6} fill={C.body} />
    <rect x={148} y={72} width={26} height={28} rx={6} fill={C.rubber} />
    <circle cx={126} cy={58} r={19} fill={C.skin} />
    <path d="M 110 86 Q 126 80 150 86 L 150 134 L 106 134 Z" fill={C.skin} />
    <line x1={96} y1={39} x2={182} y2={39} stroke={C.inkSoft} strokeWidth={1} strokeDasharray="4 3" />
    {note(88, 43, 'hjässan', 'end')}
    {arrow(206, 100, 188, 100, C.ink, 2.4)}
    {note(210, 88, 'påkörd bakifrån', 'start')}
    {note(160, 158, 'Stolen sedd från sidan')}
  </g>
);

/** A lap belt lying across the abdomen instead of the pelvis. */
const balteFraga: ReactElement = (
  <g>
    <rect x={168} y={36} width={18} height={94} rx={6} fill={C.body} opacity={0.55} />
    <circle cx={140} cy={34} r={15} fill={C.skin} />
    <path d="M 122 56 Q 140 50 164 56 L 166 122 L 118 122 Z" fill={C.skin} />
    <rect x={118} y={104} width={48} height={12} rx={5} fill={C.ground} />
    {note(110, 113, 'bäcken', 'end', 9)}
    {/* The belt, drawn neutrally: no colour verdict, no words. */}
    <line x1={116} y1={88} x2={168} y2={88} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
    <line x1={162} y1={62} x2={168} y2={104} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
    {note(160, 152, 'Bältets läge över kroppen')}
  </g>
);

/** A tyre riding on a wedge of water, unlabelled. */
const vattenplaningFraga: ReactElement = (
  <g>
    <rect x={40} y={104} width={240} height={22} fill={C.road} />
    <rect x={40} y={94} width={240} height={10} fill={C.water} opacity={0.75} />
    <path d="M 154 104 L 100 104 L 154 80 Z" fill={C.waterDeep} />
    <rect x={132} y={100} width={56} height={5} fill={C.waterDeep} />
    <circle cx={160} cy={70} r={34} fill={C.rubber} />
    <circle cx={160} cy={70} r={15} fill={C.ground} />
    {arrow(166, 70, 118, 70, C.paint, 2.6)}
    {note(160, 150, 'Däcket i genomskärning på blöt väg')}
  </g>
);

/** A sidewall with a bulge, and no diagnosis printed. */
const dackskadaFraga: ReactElement = (
  <g>
    <path d="M 30 112 Q 160 54 290 112" stroke={C.rubber} strokeWidth={38} fill="none" strokeLinecap="round" />
    <path d="M 138 74 q 22 -26 44 0" fill={C.rubber} stroke={C.ink} strokeWidth={2} />
    <line x1={160} y1={40} x2={160} y2={58} stroke={C.ink} strokeWidth={1.4} />
    {note(160, 34, 'utbuktning i sidan')}
    {note(160, 150, 'Däcket sett från sidan')}
  </g>
);

/* ===================== Registry of drawings ===================== */

export const ORIGINAL_VISUAL_GLYPHS: Record<string, ReactNode> = {
  monsterdjup,
  'sommar-vinterdack': sommarVinterdack,
  vattenplaning,
  dacktryck,
  dackskador,
  'krockvald-hastighet': krockvaldHastighet,
  'tre-kollisioner': treKollisioner,
  'nackskydd-position': nackskyddPosition,
  'baltets-vag': baltetsVag,
  varningstriangel,

  'dackslitage-fraga': dackslitageFraga,
  'nackskydd-fraga': nackskyddFraga,
  'balte-fraga': balteFraga,
  'vattenplaning-fraga': vattenplaningFraga,
  'dackskada-fraga': dackskadaFraga,
};
