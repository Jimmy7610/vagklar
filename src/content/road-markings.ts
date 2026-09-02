/**
 * The road marking registry.
 *
 * The counterpart to road-signs.ts, and built the same way: one entry per
 * marking Vägklar can draw, holding the only description of what it means.
 * Questions, lessons and Scenario Lab reference an entry by id.
 *
 * `code` is the identifier from Vägmärkesförordningen (2007:90), M-series,
 * taken from the source catalogue rather than guessed.
 *
 * Markings are harder to teach than signs for one specific reason: a line's
 * meaning depends on which side of it you are on. That is why `meaning` and
 * `forDriver` are separate fields — the first says what the marking *is*, the
 * second what it demands of the person reading it.
 */

export type MarkingCategory = 'langsgaende' | 'tvargaende' | 'symbol' | 'omrade';

export interface RoadMarking {
  id: string;
  /** Code from Vägmärkesförordningen, e.g. "M13". */
  code: string;
  name: string;
  category: MarkingCategory;
  /** What the marking is. */
  meaning: string;
  /** What it requires of you. Kept apart because a line's meaning is sided. */
  forDriver: string;
  /** Described for someone who cannot see it. */
  altText: string;
  tags: string[];
  /** Signs that normally appear with this marking. */
  relatedSignIds: string[];
  /** Markings genuinely confused with this one. */
  similarMarkingIds: string[];
  /** Vägklar subcategory, so markings tie into the taxonomy. */
  subcategory: string;
}

function marking(entry: RoadMarking): RoadMarking {
  return entry;
}

export const ROAD_MARKINGS: RoadMarking[] = [
  /* ================= Längsgående markeringar ================= */
  marking({
    id: 'mittlinje',
    code: 'M1',
    name: 'Mittlinje eller körfältslinje',
    category: 'langsgaende',
    meaning: 'Korta streck med långa mellanrum. Skiljer körriktningar eller körfält åt.',
    forDriver:
      'Du får korsa den när det kan ske utan fara — vid omkörning, körfältsbyte eller sväng. Det är den vanligaste linjen på svenska vägar.',
    altText: 'Vägmarkering: korta vita streck med långa mellanrum längs vägen.',
    tags: ['linje', 'omkorning'],
    relatedSignIds: [],
    similarMarkingIds: ['varningslinje', 'heldragen-linje'],
    subcategory: 'vagmarkeringar',
  }),
  marking({
    id: 'varningslinje',
    code: 'M3',
    name: 'Varningslinje',
    category: 'langsgaende',
    meaning: 'Långa streck med korta mellanrum. Varnar för att sikten eller utrymmet är begränsat.',
    forDriver:
      'Du får fortfarande korsa den, men den är en varning: omkörning eller körfältsbyte här kräver mer marginal än linjens utseende ger intryck av.',
    altText: 'Vägmarkering: långa vita streck med korta mellanrum längs vägen.',
    tags: ['linje', 'omkorning', 'sikt'],
    relatedSignIds: [],
    similarMarkingIds: ['mittlinje', 'heldragen-linje'],
    subcategory: 'vagmarkeringar',
  }),
  marking({
    id: 'heldragen-linje',
    code: 'M8',
    name: 'Heldragen linje',
    category: 'langsgaende',
    meaning: 'En obruten linje längs vägen, utan uppehåll att korsa i.',
    forDriver:
      'Du får inte köra över den. Avgörande är linjen på *din* sida — den andra föraren kan ha en streckad linje och därmed få korsa åt sitt håll.',
    altText: 'Vägmarkering: en obruten vit linje längs vägen.',
    tags: ['linje', 'omkorning'],
    relatedSignIds: ['forbud-omkorning'],
    similarMarkingIds: ['mittlinje', 'kombinerad-linje'],
    subcategory: 'vagmarkeringar',
  }),
  marking({
    id: 'kombinerad-linje',
    code: 'M10',
    name: 'Mittlinje och heldragen linje',
    category: 'langsgaende',
    meaning: 'Streckad linje på ena sidan, heldragen på den andra.',
    forDriver:
      'Läs linjen närmast dig. Är den heldragen får du inte korsa; är den streckad får du. Samma markering ger alltså olika besked åt de två körriktningarna.',
    altText:
      'Vägmarkering: två linjer bredvid varandra — en streckad och en obruten vit linje.',
    tags: ['linje', 'omkorning'],
    relatedSignIds: [],
    similarMarkingIds: ['heldragen-linje', 'mittlinje'],
    subcategory: 'vagmarkeringar',
  }),
  marking({
    id: 'kantlinje',
    code: 'M2',
    name: 'Kantlinje',
    category: 'langsgaende',
    meaning: 'Markerar körbanans ytterkant.',
    forDriver:
      'Utanför linjen är vägren, som inte är avsedd för normal körning. Den är också din referens för placering när sikten är dålig.',
    altText: 'Vägmarkering: en vit linje längs vägens ytterkant.',
    tags: ['linje', 'placering'],
    relatedSignIds: [],
    similarMarkingIds: ['heldragen-linje'],
    subcategory: 'vagmarkeringar',
  }),
  marking({
    id: 'ledlinje',
    code: 'M4',
    name: 'Ledlinje',
    category: 'langsgaende',
    meaning: 'Korta streck med korta mellanrum, som leder trafiken genom en korsning eller förbi en öppning.',
    forDriver:
      'Följ den. Den visar var körfältet fortsätter där vägbanan annars vore otydlig.',
    altText: 'Vägmarkering: korta vita streck tätt efter varandra genom en korsning.',
    tags: ['linje', 'korsning'],
    relatedSignIds: [],
    similarMarkingIds: ['mittlinje'],
    subcategory: 'vagmarkeringar',
  }),
  marking({
    id: 'sparromrade',
    code: 'M9',
    name: 'Spärrområde',
    category: 'omrade',
    meaning: 'En yta med snedställda streck, oftast där körfält delas eller går samman.',
    forDriver:
      'Ytan ska inte köras på. Den finns för att skilja trafikströmmar åt och ge utrymme åt fordon som väntar på att svänga.',
    altText: 'Vägmarkering: en yta med snedställda vita streck mellan körfälten.',
    tags: ['omrade', 'korfalt'],
    relatedSignIds: [],
    similarMarkingIds: [],
    subcategory: 'vagmarkeringar',
  }),

  /* ================= Tvärgående markeringar ================= */
  marking({
    id: 'stopplinje',
    code: 'M13',
    name: 'Stopplinje',
    category: 'tvargaende',
    meaning: 'En bred obruten linje tvärs över körbanan.',
    forDriver:
      'Här ska fordonet stå helt stilla. Saknas linjen stannar du där du har sikt över den korsande trafiken.',
    altText: 'Vägmarkering: en bred obruten vit linje tvärs över körbanan.',
    tags: ['stopplikt', 'korsning'],
    relatedSignIds: ['stopp'],
    similarMarkingIds: ['vajningslinje'],
    subcategory: 'vagmarkeringar',
  }),
  marking({
    id: 'vajningslinje',
    code: 'M14',
    name: 'Väjningslinje',
    category: 'tvargaende',
    meaning: 'En rad vita trianglar tvärs över körbanan, ofta kallade hajtänder.',
    forDriver:
      'Här gäller väjningsplikt. Du behöver inte stanna om vägen är fri — det är just det som skiljer den från stopplinjen.',
    altText: 'Vägmarkering: en rad vita trianglar tvärs över körbanan, med spetsarna mot dig.',
    tags: ['vajningsplikt', 'korsning'],
    relatedSignIds: ['vajningsplikt', 'cykeloverfart'],
    similarMarkingIds: ['stopplinje'],
    subcategory: 'vagmarkeringar',
  }),
  marking({
    id: 'overgangsstalle-m15',
    code: 'M15',
    name: 'Övergångsställe',
    category: 'tvargaende',
    meaning: 'Breda vita band längs körriktningen, tvärs över vägen.',
    forDriver:
      'Vid ett obevakat övergångsställe har du väjningsplikt mot gående som är på eller just ska gå ut på det.',
    altText: 'Vägmarkering: breda vita band tvärs över vägen, som ett zebramönster.',
    tags: ['oskyddade', 'gaende'],
    relatedSignIds: ['overgangsstalle-b3'],
    similarMarkingIds: ['cykelpassage-m16'],
    subcategory: 'oskyddade-trafikanter',
  }),
  marking({
    id: 'cykelpassage-m16',
    code: 'M16',
    name: 'Cykelpassage eller cykelöverfart',
    category: 'tvargaende',
    meaning: 'Två rader vita rutor tvärs över vägen.',
    forDriver:
      'Rutorna ensamma betyder cykelpassage: anpassa hastigheten. Finns dessutom vägmärket B8 och en väjningslinje är det en cykelöverfart, och då har du väjningsplikt.',
    altText: 'Vägmarkering: två rader vita rutor tvärs över vägen.',
    tags: ['cykel', 'oskyddade'],
    relatedSignIds: ['cykeloverfart'],
    similarMarkingIds: ['overgangsstalle-m15', 'vajningslinje'],
    subcategory: 'cykelpassage-overfart',
  }),

  /* ================= Symboler i körbanan ================= */
  marking({
    id: 'korfaltspilar',
    code: 'M19',
    name: 'Körfältspilar',
    category: 'symbol',
    meaning: 'Pilar målade i körbanan som visar vilken färdriktning körfältet är avsett för.',
    forDriver:
      'Välj körfält efter pilen i god tid. Pilen ersätter inte blinkersen — mötande och korsande trafik ser inte markeringen i vägbanan.',
    altText: 'Vägmarkering: vita pilar i körbanan som pekar rakt fram och åt höger.',
    tags: ['korfalt', 'sving'],
    relatedSignIds: ['pabud-rakt', 'pabud-hoger'],
    similarMarkingIds: [],
    subcategory: 'korfalt-och-sving',
  }),
  marking({
    id: 'markering-cykel',
    code: 'M26',
    name: 'Cykel',
    category: 'symbol',
    meaning: 'En cykelsymbol målad i körbanan.',
    forDriver:
      'Ytan är avsedd för cykeltrafik. Andra förare får korsa den, och har då väjningsplikt mot cyklisterna.',
    altText: 'Vägmarkering: en vit cykelsymbol målad i körbanan.',
    tags: ['cykel'],
    relatedSignIds: ['pabud-cykelbana'],
    similarMarkingIds: ['cykelpassage-m16'],
    subcategory: 'cykelpassage-overfart',
  }),
  marking({
    id: 'markering-buss',
    code: 'M28',
    name: 'Buss',
    category: 'symbol',
    meaning: 'Ordet BUSS eller en bussymbol målad i körfältet.',
    forDriver:
      'Körfältet är reserverat för fordon i linjetrafik. Du får korsa det, till exempel för att svänga, men inte köra i det.',
    altText: 'Vägmarkering: en vit bussymbol målad i ett körfält.',
    tags: ['korfalt', 'buss'],
    relatedSignIds: ['pabud-kollektivkorfalt'],
    similarMarkingIds: [],
    subcategory: 'korfaltsbyte',
  }),
  marking({
    id: 'markering-hastighet',
    code: 'M29',
    name: 'Hastighet',
    category: 'symbol',
    meaning: 'En hastighetssiffra målad i körbanan.',
    forDriver:
      'Markeringen upprepar den hastighet som gäller. Den ersätter inte vägmärket utan påminner om det.',
    altText: 'Vägmarkering: en hastighetssiffra målad i körbanan.',
    tags: ['hastighet'],
    relatedSignIds: ['hastighet-30', 'hastighet-50'],
    similarMarkingIds: [],
    subcategory: 'hastighetsgranser',
  }),
];

export const MARKING_BY_ID: ReadonlyMap<string, RoadMarking> = new Map(
  ROAD_MARKINGS.map((m) => [m.id, m]),
);

export function getRoadMarking(id: string): RoadMarking | undefined {
  return MARKING_BY_ID.get(id);
}

export const MARKING_CATEGORY_LABELS: Record<MarkingCategory, string> = {
  langsgaende: 'Längsgående markeringar',
  tvargaende: 'Tvärgående markeringar',
  symbol: 'Symboler i körbanan',
  omrade: 'Ytmarkeringar',
};

/**
 * Scenario Lab's in-scene marking kinds, mapped to the central registry.
 *
 * The Scenario Lab draws its markings at scene scale — a line across a road
 * inside the 100×100 stage — which is a different drawing problem from the
 * standalone tiles in markingGlyphs. Replacing one with the other would break
 * the scenes rather than unify them.
 *
 * What *can* be unified is the meaning. This map is the single link between the
 * two systems, so a scenario's stop line and the stop line taught in the theory
 * school are the same M13, and a test keeps them from drifting apart.
 */
export const SCENARIO_MARKING_KIND_TO_ID: Record<string, string> = {
  'stop-line': 'stopplinje',
  'yield-line': 'vajningslinje',
  crossing: 'overgangsstalle-m15',
  'cycle-crossing': 'cykelpassage-m16',
  arrow: 'korfaltspilar',
};
