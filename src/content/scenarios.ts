import type { Scenario } from '@/domain/content/types';

/**
 * Scenario Lab content.
 *
 * Everything is data: layout, vehicles, their paths, signs, road markings,
 * teaching overlays and "what changes if…" variants. Adding a situation means
 * adding an object here — the stage renders it without new drawing code.
 *
 * Coordinates live in a 100×100 space with y pointing down. Heading 0 is
 * north. Sweden drives on the right, so a northbound vehicle sits east of the
 * centre line (x ≈ 56) and a westbound vehicle sits north of it (y ≈ 44).
 *
 * Every scenario carries an `accessibilityText` that describes the situation
 * completely, and every interaction has a list-based equivalent, so no
 * exercise depends on seeing the picture.
 */

const TRF = (reference: string) => ({
  name: 'Trafikförordningen (1998:1276)',
  reference,
  verifiedAt: null,
  sourceId: 'trafikforordningen',
});

export const SCENARIOS: Scenario[] = [
  /* ================================================================== */
  {
    id: 'sc-hogerregeln-1',
    title: 'Vem kör först?',
    categoryId: 'korsningar',
    subcategory: 'hogerregeln',
    difficulty: 2,
    kind: 'order-of-passage',
    prompt:
      'En korsning utan vägmärken. Tryck på fordonen i den ordning de kan köra — först den som kör först.',
    layout: 'crossroads',
    vehicles: [
      {
        id: 'a',
        label: 'A',
        description: 'Din bil. Kommer söderifrån och ska rakt fram.',
        role: 'car',
        x: 56,
        y: 84,
        heading: 0,
        intent: 'straight',
        isEgo: true,
        path: [
          { x: 56, y: 84 },
          { x: 56, y: 8 },
        ],
      },
      {
        id: 'b',
        label: 'B',
        description: 'Bil som kommer från öster, till höger om dig, och ska rakt fram.',
        role: 'car',
        x: 84,
        y: 44,
        heading: 270,
        intent: 'straight',
        path: [
          { x: 84, y: 44 },
          { x: 8, y: 44 },
        ],
      },
      {
        id: 'c',
        label: 'C',
        description: 'Bil som kommer från väster, till vänster om dig, och ska svänga vänster.',
        role: 'car',
        x: 16,
        y: 56,
        heading: 90,
        intent: 'left',
        path: [
          // A left turn ends in the northbound lane (x ≈ 56), not the oncoming
          // southbound one — the scene has to model correct lane discipline.
          { x: 16, y: 56 },
          { x: 48, y: 56 },
          { x: 56, y: 44 },
          { x: 56, y: 8 },
        ],
      },
    ],
    correctOrder: ['b', 'a', 'c'],
    ruleTested: 'Högerregeln',
    explanation:
      'Utan vägmärken gäller högerregeln. B kommer från höger sett från dig och kör först. Sedan kör du, eftersom C har väjningsplikt mot dig. C kör sist — dels har C dig på sin högra sida, dels ska C svänga vänster och måste lämna företräde åt mötande.',
    stepExplanations: [
      'B kör först. B kommer från höger sett från din bil, och du har väjningsplikt mot fordon från höger.',
      'Du (A) kör som nummer två. C har dig på sin högra sida och ska dessutom svänga vänster — C måste vänta.',
      'C kör sist. C svänger vänster och lämnar företräde både åt B som möter och åt dig.',
    ],
    overlays: [
      { kind: 'yield', id: 'o1', from: 'a', to: 'b', label: 'A väjer för B (högerregeln)' },
      { kind: 'yield', id: 'o2', from: 'c', to: 'a', label: 'C väjer för A (högerregeln)' },
      { kind: 'yield', id: 'o3', from: 'c', to: 'b', label: 'C väjer för B (vänstersväng mot mötande)' },
      { kind: 'conflict', id: 'o4', x: 56, y: 44, label: 'A och B korsar varandra här' },
      { kind: 'conflict', id: 'o5', x: 56, y: 56, label: 'A och C korsar varandra här' },
    ],
    accessibilityText:
      'En fyrvägskorsning utan vägmärken, sedd rakt uppifrån. Bil A är din bil; den står söder om korsningen och ska rakt fram norrut. Bil B kommer från öster, alltså från höger sett från din bil, och ska rakt fram västerut. Bil C kommer från väster, alltså från vänster sett från din bil, och ska svänga vänster upp mot norr.',
    variants: [
      {
        id: 'vajningsplikt',
        label: 'Om du får väjningsplikt',
        question: 'Vad förändras om din väg får väjningsplikt mot den korsande vägen?',
        patch: {
          prompt:
            'Samma korsning, men nu har din väg väjningsplikt mot den korsande vägen. I vilken ordning kan fordonen köra?',
          correctOrder: ['b', 'c', 'a'],
          ruleTested: 'Väjningsplikt',
          explanation:
            'Med väjningsplikt gäller inte högerregeln för dig längre — du lämnar företräde åt alla på den korsande vägen. B kör först, C kör som nummer två efter att ha väntat in mötande B, och du kör sist.',
          stepExplanations: [
            'B kör först. B har företräde mot dig, och möts inte av något hinder.',
            'C kör som nummer två. C ska svänga vänster och väntar in mötande B — men har företräde mot dig.',
            'Du (A) kör sist. Väjningspliktsmärket gäller mot all trafik på den korsande vägen.',
          ],
          signs: [
            { id: 's1', sign: 'vajningsplikt', x: 68, y: 72, label: 'Väjningsplikt för din väg' },
          ],
          markings: [
            { id: 'm1', kind: 'yield-line', x: 56, y: 66, rotation: 0, length: 13 },
          ],
          overlays: [
            { kind: 'yield', id: 'v1', from: 'a', to: 'b', label: 'A väjer för B (skyltad väjningsplikt)' },
            { kind: 'yield', id: 'v2', from: 'a', to: 'c', label: 'A väjer för C (skyltad väjningsplikt)' },
            { kind: 'yield', id: 'v3', from: 'c', to: 'b', label: 'C väjer för B (vänstersväng mot mötande)' },
          ],
          accessibilityText:
            'Samma fyrvägskorsning, men nu står ett väjningspliktsmärke vid din tillfart söderifrån och en väjningslinje är målad i vägbanan. Bil A är din bil och ska rakt fram. Bil B kommer från öster och ska rakt fram. Bil C kommer från väster och ska svänga vänster.',
        },
      },
      {
        id: 'huvudled',
        label: 'Om din väg blir huvudled',
        question: 'Vad förändras om din väg blir huvudled?',
        patch: {
          prompt:
            'Samma korsning, men nu är din väg huvudled. I vilken ordning kan fordonen köra?',
          correctOrder: ['a', 'b', 'c'],
          ruleTested: 'Huvudled',
          explanation:
            'På huvudled har du företräde mot korsande trafik. Du kör först. B kör som nummer två, och C sist eftersom C både har väjningsplikt mot huvudleden och ska svänga vänster mot mötande B.',
          stepExplanations: [
            'Du (A) kör först. Du kör på huvudled och korsande trafik har väjningsplikt mot dig.',
            'B kör som nummer två, efter att ha lämnat företräde åt huvudleden.',
            'C kör sist. C väjer både för huvudleden och för mötande B.',
          ],
          signs: [{ id: 's1', sign: 'huvudled', x: 68, y: 72, label: 'Huvudled' }],
          overlays: [
            { kind: 'yield', id: 'h1', from: 'b', to: 'a', label: 'B väjer för A (huvudled)' },
            { kind: 'yield', id: 'h2', from: 'c', to: 'a', label: 'C väjer för A (huvudled)' },
            { kind: 'yield', id: 'h3', from: 'c', to: 'b', label: 'C väjer för B (vänstersväng mot mötande)' },
          ],
          accessibilityText:
            'Samma fyrvägskorsning, men nu står ett huvudledsmärke vid din tillfart söderifrån. Bil A är din bil på huvudleden och ska rakt fram. Bil B kommer från öster och ska rakt fram. Bil C kommer från väster och ska svänga vänster.',
        },
      },
    ],
    sourceReferences: [TRF('3 kap. 18 §')],
    status: 'reviewed',
  },

  /* ================================================================== */
  {
    id: 'sc-stopplikt-1',
    title: 'Stopplikt i korsningen',
    categoryId: 'korsningar',
    subcategory: 'stopplikt',
    difficulty: 1,
    kind: 'order-of-passage',
    prompt:
      'Du har stopplikt. Vägen ser fri ut åt vänster. Tryck på fordonen i den ordning de kan köra.',
    layout: 'crossroads',
    vehicles: [
      {
        id: 'a',
        label: 'A',
        description: 'Din bil. Står vid stopplinjen söder om korsningen och ska rakt fram.',
        role: 'car',
        x: 56,
        y: 78,
        heading: 0,
        intent: 'straight',
        isEgo: true,
        path: [
          { x: 56, y: 78 },
          { x: 56, y: 8 },
        ],
      },
      {
        id: 'b',
        label: 'B',
        description: 'Lastbil som kommer från öster och ska rakt fram västerut.',
        role: 'truck',
        x: 86,
        y: 44,
        heading: 270,
        intent: 'straight',
        path: [
          { x: 86, y: 44 },
          { x: 8, y: 44 },
        ],
      },
    ],
    correctOrder: ['b', 'a'],
    ruleTested: 'Stopplikt',
    explanation:
      'Stopplikt betyder att du måste stanna helt vid stopplinjen, oavsett hur fri sikten är. Först därefter gäller väjningsplikten: lastbilen B passerar, och sedan kan du köra.',
    stepExplanations: [
      'B kör först. Du har väjningsplikt mot all trafik på den korsande vägen.',
      'Du (A) kör efter att ha stannat helt vid stopplinjen och sett att vägen är fri.',
    ],
    signs: [{ id: 's1', sign: 'stopp', x: 68, y: 72, label: 'Stopplikt' }],
    markings: [{ id: 'm1', kind: 'stop-line', x: 56, y: 66, rotation: 0, length: 13 }],
    overlays: [
      { kind: 'yield', id: 'o1', from: 'a', to: 'b', label: 'A väjer för B' },
      { kind: 'note', id: 'o2', x: 56, y: 70, text: 'Stanna helt — även med fri sikt' },
      { kind: 'conflict', id: 'o3', x: 56, y: 44, label: 'Konfliktpunkt' },
    ],
    accessibilityText:
      'En fyrvägskorsning där din tillfart söderifrån har stopplikt, utmärkt med stoppmärke och en målad stopplinje. Bil A är din bil vid stopplinjen och ska rakt fram norrut. Fordon B är en lastbil som kommer från öster och kör rakt fram västerut.',
    sourceReferences: [TRF('3 kap. 19 §')],
    status: 'reviewed',
  },

  /* ================================================================== */
  {
    id: 'sc-utfart-1',
    title: 'Ut från parkeringen',
    categoryId: 'korsningar',
    subcategory: 'utfartsregeln',
    difficulty: 2,
    kind: 'order-of-passage',
    prompt:
      'Du kör ut från en parkeringsplats och ska svänga höger. Tryck på trafikanterna i den ordning de kan passera.',
    layout: 't-junction',
    vehicles: [
      {
        id: 'a',
        label: 'A',
        description: 'Din bil. Står i parkeringsutfarten och ska svänga höger, österut.',
        role: 'car',
        x: 50,
        y: 82,
        heading: 0,
        intent: 'right',
        isEgo: true,
        path: [
          { x: 50, y: 82 },
          { x: 50, y: 60 },
          { x: 92, y: 56 },
        ],
      },
      {
        id: 'b',
        label: 'B',
        description: 'Cyklist som kommer från väster på vägen och fortsätter österut.',
        role: 'bicycle',
        x: 26,
        y: 56,
        heading: 90,
        intent: 'straight',
        path: [
          { x: 26, y: 56 },
          { x: 92, y: 56 },
        ],
      },
      {
        id: 'c',
        label: 'C',
        description: 'Bil som kommer bakom cyklisten, också västerifrån, och fortsätter österut.',
        role: 'car',
        x: 6,
        y: 56,
        heading: 90,
        intent: 'straight',
        path: [
          { x: 6, y: 56 },
          { x: 92, y: 56 },
        ],
      },
    ],
    correctOrder: ['b', 'c', 'a'],
    ruleTested: 'Utfartsregeln',
    explanation:
      'Du kommer ut från ett område som inte är en väg och har därför väjningsplikt mot alla på vägen — högerregeln gäller inte här. Cyklisten B passerar först, bilen C som ligger bakom passerar sedan, och du kör sist.',
    stepExplanations: [
      'B kör först. Cyklisten är närmast och färdas på vägen, där du har väjningsplikt.',
      'C kör som nummer två. Bilen ligger bakom cyklisten i samma körfält.',
      'Du (A) kör sist. Utfartsregeln ger dig väjningsplikt mot alla — även mot cyklister.',
    ],
    overlays: [
      { kind: 'yield', id: 'o1', from: 'a', to: 'b', label: 'A väjer för B (utfartsregeln)' },
      { kind: 'yield', id: 'o2', from: 'a', to: 'c', label: 'A väjer för C (utfartsregeln)' },
      { kind: 'note', id: 'o3', x: 50, y: 70, text: 'Du kommer inte från en väg' },
    ],
    accessibilityText:
      'En parkeringsutfart som möter en väg. Bil A är din bil, den står i utfarten söder om vägen och ska svänga höger, österut. Cyklist B närmar sig västerifrån på vägen. Bakom cyklisten kommer bil C, också västerifrån. Båda fortsätter österut.',
    sourceReferences: [TRF('3 kap. 21 §')],
    status: 'reviewed',
  },

  /* ================================================================== */
  {
    id: 'sc-vanstersvang-1',
    title: 'Vänstersväng med mötande',
    categoryId: 'korsningar',
    subcategory: 'vajningsplikt',
    difficulty: 2,
    kind: 'order-of-passage',
    prompt:
      'Du ska svänga vänster. Ett fordon möter dig och ska rakt fram. Tryck i den ordning ni kan köra.',
    layout: 'crossroads',
    vehicles: [
      {
        id: 'a',
        label: 'A',
        description: 'Din bil. Kommer söderifrån och ska svänga vänster, västerut.',
        role: 'car',
        x: 56,
        y: 84,
        heading: 0,
        intent: 'left',
        isEgo: true,
        path: [
          { x: 56, y: 84 },
          { x: 56, y: 50 },
          { x: 8, y: 44 },
        ],
      },
      {
        id: 'b',
        label: 'B',
        description: 'Mötande bil som kommer norrifrån och ska rakt fram söderut.',
        role: 'car',
        x: 44,
        y: 16,
        heading: 180,
        intent: 'straight',
        path: [
          { x: 44, y: 16 },
          { x: 44, y: 92 },
        ],
      },
    ],
    correctOrder: ['b', 'a'],
    ruleTested: 'Svängningsregeln',
    explanation:
      'Den som svänger vänster lämnar företräde åt mötande trafik som kör rakt fram. B passerar först, och sedan kan du svänga.',
    stepExplanations: [
      'B kör först. Mötande trafik som kör rakt fram har företräde.',
      'Du (A) svänger vänster när vägen är fri.',
    ],
    overlays: [
      { kind: 'yield', id: 'o1', from: 'a', to: 'b', label: 'A väjer för B (svängningsregeln)' },
      { kind: 'conflict', id: 'o2', x: 46, y: 48, label: 'Här korsar din väg B:s väg' },
    ],
    accessibilityText:
      'En fyrvägskorsning. Bil A är din bil, den kommer söderifrån och ska svänga vänster mot väster. Bil B möter dig norrifrån och ska rakt fram söderut.',
    sourceReferences: [TRF('3 kap. 24 §')],
    status: 'reviewed',
  },

  /* ================================================================== */
  {
    id: 'sc-cirkulation-1',
    title: 'In i cirkulationsplatsen',
    categoryId: 'korsningar',
    subcategory: 'cirkulationsplats',
    difficulty: 2,
    kind: 'order-of-passage',
    prompt:
      'Du ska köra in i en cirkulationsplats med väjningsplikt vid infarten. Tryck i den ordning ni kan köra.',
    layout: 'roundabout',
    vehicles: [
      {
        id: 'a',
        label: 'A',
        description: 'Din bil. Står vid den södra infarten och ska in i cirkulationen.',
        role: 'car',
        x: 56,
        y: 84,
        heading: 0,
        intent: 'straight',
        isEgo: true,
        path: [
          { x: 56, y: 84 },
          { x: 58, y: 66 },
          { x: 66, y: 56 },
          { x: 64, y: 40 },
          { x: 50, y: 30 },
          { x: 44, y: 8 },
        ],
      },
      {
        id: 'b',
        label: 'B',
        description: 'Bil som redan befinner sig inne i cirkulationen, i norra delen på väg västerut.',
        role: 'car',
        x: 50,
        y: 30,
        heading: 270,
        intent: 'straight',
        path: [
          { x: 50, y: 30 },
          { x: 34, y: 40 },
          { x: 30, y: 52 },
          { x: 8, y: 56 },
        ],
      },
    ],
    correctOrder: ['b', 'a'],
    ruleTested: 'Väjningsplikt vid cirkulationsplats',
    explanation:
      'Väjningsplikt vid infarten betyder att fordon som redan kör i cirkulationen har företräde. B fortsätter, och du kör in när det finns en lucka. Högerregeln har ingen roll här.',
    stepExplanations: [
      'B kör först. Fordon som redan är inne i cirkulationen har företräde.',
      'Du (A) kör in i cirkulationen när det finns en lucka, och ger tecken när du ska ut.',
    ],
    signs: [{ id: 's1', sign: 'cirkulationsplats', x: 70, y: 74, label: 'Cirkulationsplats' }],
    markings: [{ id: 'm1', kind: 'yield-line', x: 56, y: 72, rotation: 0, length: 12 }],
    overlays: [
      { kind: 'yield', id: 'o1', from: 'a', to: 'b', label: 'A väjer för B (väjningsplikt vid infart)' },
      { kind: 'note', id: 'o2', x: 50, y: 88, text: 'Högerregeln gäller inte här' },
    ],
    accessibilityText:
      'En cirkulationsplats sedd uppifrån, med väjningsplikt vid infarterna. Bil A är din bil vid den södra infarten. Bil B befinner sig redan inne i cirkulationen, i den norra delen, på väg västerut.',
    sourceReferences: [TRF('3 kap. 18 §')],
    status: 'reviewed',
  },

  /* ================================================================== */
  {
    id: 'sc-risk-stadsgata',
    title: 'Vad är risken här?',
    categoryId: 'risker',
    subcategory: 'skymd-sikt',
    difficulty: 2,
    kind: 'risk-spotting',
    prompt: 'Du kör på en bostadsgata. Välj det som utgör den största risken.',
    layout: 'street-scene',
    vehicles: [
      {
        id: 'a',
        label: 'A',
        description: 'Din bil. Kör österut på bostadsgatan.',
        role: 'car',
        x: 18,
        y: 56,
        heading: 90,
        intent: 'straight',
        isEgo: true,
      },
      {
        id: 'p1',
        label: 'P1',
        description: 'Parkerad bil längs gatans norra kant.',
        role: 'car',
        x: 50,
        y: 41,
        heading: 90,
        intent: 'stop',
      },
      {
        id: 'p2',
        label: 'P2',
        description: 'Ytterligare en parkerad bil, med ett mellanrum till den första.',
        role: 'car',
        x: 72,
        y: 41,
        heading: 90,
        intent: 'stop',
      },
    ],
    hotspots: [
      {
        id: 'between-cars',
        label: 'Mellanrummet mellan de parkerade bilarna',
        x: 61,
        y: 41,
        radius: 9,
        isRisk: true,
        explanation:
          'Parkerade bilar döljer människor. Ett barn eller en gående kan kliva ut i mellanrummet utan att se dig, och du hinner inte upptäcka dem förrän de är vid körbanan.',
      },
      {
        id: 'road-ahead',
        label: 'Den fria vägen längre fram',
        x: 90,
        y: 56,
        radius: 8,
        isRisk: false,
        explanation: 'Den fria sträckan längre fram är inte problemet — risken finns i det du inte ser.',
      },
      {
        id: 'own-lane',
        label: 'Ditt eget körfält',
        x: 32,
        y: 56,
        radius: 8,
        isRisk: false,
        explanation: 'Ditt körfält är fritt just nu. Faran ligger i sidled, inte rakt fram.',
      },
    ],
    ruleTested: 'Skymd sikt vid parkerade fordon',
    explanation:
      'Den största risken är mellanrummet mellan de parkerade bilarna. Sänk farten och öka sidoavståndet så att du både ser tidigare och hinner stanna.',
    accessibilityText:
      'En bostadsgata sedd uppifrån. Din bil A kör österut. Två bilar, P1 och P2, står parkerade längs gatans norra kant med ett tydligt mellanrum mellan sig. Vägen framför dig är fri.',
    sourceReferences: [{ name: 'Riskutbildning: stadsmiljö', verifiedAt: null }],
    status: 'reviewed',
  },
];

export const SCENARIO_BY_ID: ReadonlyMap<string, Scenario> = new Map(
  SCENARIOS.map((s) => [s.id, s]),
);

export function getScenario(id: string): Scenario | undefined {
  return SCENARIO_BY_ID.get(id);
}
