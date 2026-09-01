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
  /* ------------------------------------------------------------------ */
  /* Järnvägskorsning                                                     */
  /* ------------------------------------------------------------------ */
  {
    id: 'sc-plankorsning-1',
    title: 'Var ligger risken vid plankorsningen?',
    categoryId: 'jarnvag',
    subcategory: 'plankorsning-korning',
    difficulty: 2,
    kind: 'risk-spotting',
    prompt:
      'Du närmar dig en plankorsning utan bommar. Tryck på den plats där risken är störst.',
    layout: 'railway-crossing',
    vehicles: [
      {
        id: 'a',
        label: 'A',
        description: 'Din bil. Kör norrut mot plankorsningen.',
        role: 'car',
        x: 56,
        y: 82,
        heading: 0,
        intent: 'straight',
        isEgo: true,
      },
    ],
    markings: [{ id: 'm-stop', kind: 'stop-line', x: 56, y: 64, length: 12 }],
    hotspots: [
      {
        id: 'skymd-sikt',
        label: 'Vegetationen som skymmer spåret åt vänster',
        x: 22,
        y: 38,
        radius: 12,
        isRisk: true,
        explanation:
          'Det är sikten längs spåret som avgör allt annat här. Kan du inte överblicka spåret måste du stanna, titta åt båda håll och först därefter köra över. Fart kan inte ersätta information du inte har.',
      },
      {
        id: 'sparet',
        label: 'Själva spåret',
        x: 56,
        y: 50,
        radius: 9,
        isRisk: false,
        explanation:
          'Spåret i sig är inte risken — det är förutsägbart och står stilla. Risken ligger i det du inte kan se innan du kör ut på det.',
      },
      {
        id: 'vagen-efter',
        label: 'Vägen efter korsningen',
        x: 56,
        y: 18,
        radius: 9,
        isRisk: false,
        explanation:
          'Vägen efter korsningen är värd en tanke — du ska inte stanna direkt efter spåret — men den största risken finns före korsningen.',
      },
    ],
    ruleTested: 'Sikt vid plankorsning',
    explanation:
      'Ordningen är alltid densamma: bilda dig först en uppfattning om sikten, anpassa sedan hastigheten till den. God sikt kan betyda att du knappt behöver sakta ner. Dålig sikt betyder stanna, titta åt båda håll och sedan köra över.',
    accessibilityText:
      'En plankorsning sedd uppifrån. En väg går i nord–sydlig riktning och korsas av ett järnvägsspår som löper i öst–västlig riktning. Din bil A kör norrut och närmar sig spåret söderifrån. Till vänster om vägen, väster om korsningen, skymmer vegetation sikten längs spåret. Korsningen saknar bommar och ljussignal.',
    sourceReferences: [
      {
        name: 'Teoribok 2026-1 (Körkortonline.se)',
        reference: 'Hur man korsar en järnväg säkert',
        verifiedAt: null,
        sourceId: 'teoribok-2026-1',
        sourcePages: [109],
      },
    ],
    status: 'reviewed',
  },

  /* ------------------------------------------------------------------ */
  /* Cirkulationsplats                                                    */
  /* ------------------------------------------------------------------ */
  {
    id: 'sc-cirkulation-2',
    title: 'Vem kör först in i cirkulationen?',
    categoryId: 'korsningar',
    subcategory: 'cirkulationsplats',
    difficulty: 2,
    kind: 'order-of-passage',
    prompt:
      'Du ska in i cirkulationsplatsen. Tryck på fordonen i den ordning de kan köra — först den som kör först.',
    layout: 'roundabout',
    vehicles: [
      {
        id: 'a',
        label: 'A',
        description: 'Din bil. Väntar vid infarten söderifrån och ska in i cirkulationen.',
        role: 'car',
        x: 56,
        y: 80,
        heading: 0,
        intent: 'straight',
        isEgo: true,
        path: [
          { x: 56, y: 80 },
          { x: 56, y: 68 },
          { x: 62, y: 52 },
          { x: 50, y: 34 },
          { x: 44, y: 8 },
        ],
      },
      {
        id: 'b',
        label: 'B',
        description: 'Bil som redan kör i cirkulationen och närmar sig din infart.',
        role: 'car',
        x: 72,
        y: 44,
        heading: 250,
        intent: 'left',
        path: [
          { x: 72, y: 44 },
          { x: 62, y: 34 },
          { x: 44, y: 34 },
          { x: 44, y: 8 },
        ],
      },
      {
        id: 'c',
        label: 'C',
        description: 'Cyklist som redan kör i cirkulationen, strax bakom bil B.',
        role: 'bicycle',
        x: 78,
        y: 58,
        heading: 300,
        intent: 'left',
        path: [
          { x: 78, y: 58 },
          { x: 66, y: 58 },
          { x: 56, y: 46 },
          { x: 56, y: 8 },
        ],
      },
    ],
    signs: [
      { id: 's-cirk', sign: 'cirkulationsplats', x: 74, y: 82, label: 'Cirkulationsplats' },
      { id: 's-vajning', sign: 'vajningsplikt', x: 40, y: 78, label: 'Väjningsplikt' },
    ],
    markings: [{ id: 'm-yield', kind: 'yield-line', x: 56, y: 70, length: 12 }],
    overlays: [
      { kind: 'yield', id: 'o-ab', from: 'a', to: 'b', label: 'A väjer för B' },
      { kind: 'yield', id: 'o-ac', from: 'a', to: 'c', label: 'A väjer även för cyklisten' },
      {
        kind: 'note',
        id: 'o-note',
        x: 30,
        y: 88,
        text: 'Väjningsplikten gäller varje fordon i cirkulationen — även cyklar.',
      },
    ],
    correctOrder: ['b', 'c', 'a'],
    ruleTested: 'Väjningsplikt vid infart i cirkulationsplats',
    explanation:
      'Du som kör in i en cirkulationsplats har väjningsplikt mot varje fordon som redan befinner sig i cirkulationen. B kör först eftersom bilen redan är inne. Sedan cyklisten C, som också redan cirkulerar — väjningsplikten gäller alla fordon, inte bara motorfordon. Du (A) kör sist.',
    stepExplanations: [
      'B kör först. Bilen befinner sig redan i cirkulationen, och du som ska in har väjningsplikt mot den.',
      'C kör som nummer två. Cyklisten är också redan i cirkulationen, och väjningsplikten gäller varje fordon — inte bara motorfordon.',
      'Du (A) kör sist, när både B och C har passerat din infart.',
    ],
    variants: [
      {
        id: 'tom-cirkulation',
        label: 'Om cirkulationen är tom',
        question: 'Vad gäller om inget fordon befinner sig i cirkulationen när du kommer fram?',
        patch: {
          prompt:
            'Cirkulationen är tom när du kommer fram. Tryck på fordonen i den ordning de kan köra.',
          correctOrder: ['a', 'b', 'c'],
          explanation:
            'Väjningsplikten gäller mot fordon som befinner sig i cirkulationen. Är den tom när du kommer fram får du köra in direkt — men du måste fortfarande blinka höger när du lämnar cirkulationsplatsen.',
          stepExplanations: [
            'Du (A) kör först. Det finns inget fordon i cirkulationen att väja för.',
            'B kör efter dig och kommer in i cirkulationen bakom.',
            'C kör sist.',
          ],
          overlays: [
            {
              kind: 'note',
              id: 'o-note-tom',
              x: 30,
              y: 88,
              text: 'Tom cirkulation: du får köra in — men blinka höger när du ska ut.',
            },
          ],
          accessibilityText:
            'Samma cirkulationsplats sedd uppifrån, men nu utan trafik i själva cirkulationen. Din bil A står vid den södra infarten bakom väjningslinjen. Bil B och cyklisten C har ännu inte hunnit fram till cirkulationsplatsen och befinner sig utanför den.',
        },
      },
    ],
    accessibilityText:
      'En cirkulationsplats sedd uppifrån med fyra infarter. Din bil A står vid den södra infarten bakom en väjningslinje och ska in i cirkulationen. Bil B kör redan i cirkulationen och närmar sig din infart från öster. Cyklisten C kör också redan i cirkulationen, strax bakom bil B. Vid infarten sitter märket för cirkulationsplats och ett märke för väjningsplikt.',
    sourceReferences: [
      {
        name: 'Trafikförordningen (1998:1276)',
        reference: '3 kap. 22 §',
        verifiedAt: null,
      },
      {
        name: 'Teoribok 2026-1 (Körkortonline.se)',
        reference: 'Cirkulationsplats',
        verifiedAt: null,
        sourceId: 'teoribok-2026-1',
        sourcePages: [58],
      },
    ],
    status: 'reviewed',
  },

  /* ------------------------------------------------------------------ */
  /* Cykelöverfart                                                        */
  /* ------------------------------------------------------------------ */
  {
    id: 'sc-cykeloverfart-1',
    title: 'Cykelöverfart vid högersväng',
    categoryId: 'trafikregler',
    subcategory: 'cykelpassage-overfart',
    difficulty: 3,
    kind: 'order-of-passage',
    prompt:
      'Du ska svänga höger och korsar då en cykelöverfart. Tryck på trafikanterna i den ordning de kan passera.',
    layout: 'crossroads',
    vehicles: [
      {
        id: 'a',
        label: 'A',
        description: 'Din bil. Kommer söderifrån och ska svänga höger, österut.',
        role: 'car',
        x: 56,
        y: 84,
        heading: 0,
        intent: 'right',
        isEgo: true,
        path: [
          { x: 56, y: 84 },
          { x: 56, y: 62 },
          { x: 92, y: 56 },
        ],
      },
      {
        id: 'b',
        label: 'B',
        description: 'Cyklist som närmar sig cykelöverfarten från norr och ska korsa din väg.',
        role: 'bicycle',
        x: 74,
        y: 26,
        heading: 180,
        intent: 'straight',
        path: [
          { x: 74, y: 26 },
          { x: 74, y: 78 },
        ],
      },
    ],
    signs: [{ id: 's-overfart', sign: 'vajningsplikt', x: 66, y: 70, label: 'Väjningsplikt' }],
    markings: [
      { id: 'm-cykel', kind: 'cycle-crossing', x: 74, y: 56, rotation: 90, length: 20 },
      { id: 'm-vaj', kind: 'yield-line', x: 74, y: 66, rotation: 90, length: 12 },
    ],
    overlays: [
      { kind: 'yield', id: 'o-ab', from: 'a', to: 'b', label: 'A har väjningsplikt mot cyklisten' },
      { kind: 'conflict', id: 'o-conf', x: 74, y: 56, label: 'Här korsas era vägar' },
      {
        kind: 'note',
        id: 'o-note',
        x: 22,
        y: 88,
        text: 'Cykelöverfart: vägmärke och väjningslinje — full väjningsplikt.',
      },
    ],
    correctOrder: ['b', 'a'],
    ruleTested: 'Väjningsplikt vid cykelöverfart',
    explanation:
      'Vid en cykelöverfart har du väjningsplikt mot cyklande som är ute på eller just ska färdas ut på överfarten. Cyklisten B kör därför först. Överfarten känns igen på att det finns både vägmärke, vägmarkering och en väjningslinje för biltrafiken — till skillnad från en cykelpassage, som bara har vägmarkering.',
    stepExplanations: [
      'B kör först. Vid en cykelöverfart har du väjningsplikt mot cyklande som är ute på eller just ska färdas ut på överfarten.',
      'Du (A) kör sedan, när cyklisten har passerat. Väjningsplikten kräver att du tydligt visar din avsikt genom att i god tid sänka farten eller stanna.',
    ],
    variants: [
      {
        id: 'cykelpassage',
        label: 'Om det vore en cykelpassage',
        question:
          'Vad gäller om skylten och väjningslinjen saknas, så att det bara är en cykelpassage?',
        patch: {
          prompt:
            'Det är en obevakad cykelpassage, inte en cykelöverfart. Tryck på trafikanterna i den ordning de kan passera.',
          ruleTested: 'Obevakad cykelpassage i samband med sväng',
          signs: [],
          markings: [
            { id: 'm-cykel', kind: 'cycle-crossing', x: 74, y: 56, rotation: 90, length: 20 },
          ],
          correctOrder: ['b', 'a'],
          explanation:
            'Även vid en cykelpassage kör cyklisten först i praktiken — men av en annan anledning. Eftersom du svänger ska du köra med låg hastighet och lämna cyklande som är ute på eller just ska färdas ut på passagen tillfälle att passera. Det är en starkare skyldighet än när du kör rakt fram, men det är formellt inte väjningsplikt: cyklisten har i sin tur väjningsplikt mot dig.',
          stepExplanations: [
            'B passerar först. Du svänger, och då gäller låg hastighet och att lämna cyklande tillfälle att passera.',
            'Du (A) kör sedan. Skillnaden mot cykelöverfarten är att skyldigheten här är ömsesidig — cyklisten ska också väja och får bara korsa om det kan ske utan fara.',
          ],
          overlays: [
            {
              kind: 'note',
              id: 'o-note-passage',
              x: 22,
              y: 88,
              text: 'Cykelpassage: bara vägmarkering. Vid sväng gäller låg fart och lämna tillfälle.',
            },
            { kind: 'conflict', id: 'o-conf', x: 74, y: 56, label: 'Här korsas era vägar' },
          ],
          accessibilityText:
            'Samma fyrvägskorsning sedd uppifrån, men nu utan vägmärke och utan väjningslinje. Din bil A kommer söderifrån och ska svänga höger, österut. Tvärs över den östra utfarten löper en cykelpassage, markerad enbart med rutor i vägbanan. Cyklisten B kommer norrifrån och är på väg ut på passagen.',
        },
      },
    ],
    accessibilityText:
      'En fyrvägskorsning sedd uppifrån. Din bil A kommer söderifrån och ska svänga höger, österut. Tvärs över den östra utfarten löper en cykelöverfart, markerad med rutor i vägbanan, ett vägmärke och en väjningslinje för biltrafiken. Cyklisten B kommer norrifrån längs en cykelbana på korsningens östra sida och är på väg ut på cykelöverfarten.',
    sourceReferences: [
      { name: 'Trafikförordningen (1998:1276)', reference: '3 kap. 61 b §', verifiedAt: null },
      {
        name: 'Teoribok 2026-1 (Körkortonline.se)',
        reference: 'Cykelöverfart',
        verifiedAt: null,
        sourceId: 'teoribok-2026-1',
        sourcePages: [52],
      },
    ],
    status: 'reviewed',
  },

  /* ------------------------------------------------------------------ */
  /* Motorvägspåfart                                                      */
  /* ------------------------------------------------------------------ */
  {
    id: 'sc-pafart-1',
    title: 'Var ligger risken vid påfarten?',
    categoryId: 'motorvag',
    subcategory: 'pafart-avfart',
    difficulty: 2,
    kind: 'risk-spotting',
    prompt:
      'Du kör på accelerationsfältet och ska ut på motorvägen. Tryck på den plats där risken är störst.',
    layout: 'motorway-merge',
    vehicles: [
      {
        id: 'a',
        label: 'A',
        description: 'Din bil. Kör i accelerationsfältet och ska ut på motorvägen.',
        role: 'car',
        x: 26,
        y: 58,
        heading: 90,
        intent: 'straight',
        isEgo: true,
        path: [
          { x: 26, y: 58 },
          { x: 58, y: 58 },
          { x: 84, y: 42 },
        ],
      },
      {
        id: 'b',
        label: 'B',
        description: 'Lastbil som kör i motorvägens högra körfält, strax bakom dig.',
        role: 'truck',
        x: 12,
        y: 42,
        heading: 90,
        intent: 'straight',
        path: [
          { x: 12, y: 42 },
          { x: 76, y: 42 },
        ],
      },
    ],
    hotspots: [
      {
        id: 'doda-vinkeln',
        label: 'Området bakom och till vänster om dig',
        x: 16,
        y: 47,
        radius: 11,
        isRisk: true,
        explanation:
          'Lastbilen ligger i din döda vinkel. Speglarna räcker inte — du måste vrida på huvudet innan du går ut i körfältet. En påfart är dessutom den plats där hastighetsskillnaden mellan dig och trafiken är som störst.',
      },
      {
        id: 'slutet',
        label: 'Där accelerationsfältet tar slut',
        x: 66,
        y: 58,
        radius: 10,
        isRisk: false,
        explanation:
          'Att fältet tar slut är förutsägbart och syns i god tid. Det är värt att planera för, men det är inte den dolda risken här.',
      },
      {
        id: 'framfor',
        label: 'Vägen framför dig',
        x: 84,
        y: 42,
        radius: 9,
        isRisk: false,
        explanation:
          'Framför dig är fritt just nu. Faran kommer bakifrån, från det körfält du ska in i.',
      },
    ],
    ruleTested: 'Påfart och döda vinkeln',
    explanation:
      'Anpassa farten till trafiken på motorvägen redan i accelerationsfältet, och kontrollera döda vinkeln innan du går ut. Du har inte företräde till motorvägens körfält — men trafiken där bör i sin tur underlätta din infogning genom att byta körfält eller anpassa farten.',
    accessibilityText:
      'En motorvägspåfart sedd uppifrån. Motorvägen löper i öst–västlig riktning. Din bil A kör i accelerationsfältet längs motorvägens södra sida och ska väva in i det högra körfältet. En lastbil B kör i motorvägens högra körfält, snett bakom dig till vänster, i ungefär samma höjd som din bakre del.',
    sourceReferences: [
      { name: 'Trafikförordningen (1998:1276)', reference: '3 kap. 44 §', verifiedAt: null },
      {
        name: 'Teoribok 2026-1 (Körkortonline.se)',
        reference: 'Motorväg',
        verifiedAt: null,
        sourceId: 'teoribok-2026-1',
        sourcePages: [90],
      },
    ],
    status: 'reviewed',
  },

  /* ------------------------------------------------------------------ */
  /* Halka                                                                */
  /* ------------------------------------------------------------------ */
  {
    id: 'sc-halka-1',
    title: 'Var är vägen halast?',
    categoryId: 'halka',
    subcategory: 'halka',
    difficulty: 3,
    kind: 'risk-spotting',
    prompt:
      'Det är någon minusgrad och vägen ser torr ut. Tryck på den plats där halkan är mest sannolik.',
    layout: 'street-scene',
    vehicles: [
      {
        id: 'a',
        label: 'A',
        description: 'Din bil. Kör österut på vägen.',
        role: 'car',
        x: 22,
        y: 56,
        heading: 90,
        intent: 'straight',
        isEgo: true,
      },
    ],
    hotspots: [
      {
        id: 'bron',
        label: 'Bron längre fram',
        x: 70,
        y: 50,
        radius: 12,
        isRisk: true,
        explanation:
          'Broar kyls av både uppifrån och underifrån och blir därför isiga före resten av vägen. Samma sak gäller skuggiga partier och platser nära vatten. Vägen kan vara bar hela sträckan fram och sedan plötsligt vara isbelagd just där.',
      },
      {
        id: 'raksträcka',
        label: 'Den soliga raksträckan',
        x: 40,
        y: 50,
        radius: 10,
        isRisk: false,
        explanation:
          'En solbelyst raksträcka torkar upp snabbast och är den minst troliga platsen för underkylt väglag.',
      },
      {
        id: 'vagkanten',
        label: 'Vägkanten till höger',
        x: 40,
        y: 68,
        radius: 9,
        isRisk: false,
        explanation:
          'Vägkanten kan vara lös och grusig, vilket är värt att veta — men det är inte halka, och det är inte den största risken vid några minusgrader.',
      },
    ],
    ruleTested: 'Förrädiskt väglag',
    explanation:
      'Väglaget kan växla på några meter. Broar, skuggpartier och platser nära vatten fryser först och håller sig hala längst. Sänk farten före den typen av avsnitt i stället för på dem, och undvik att bromsa eller styra kraftigt när du är på dem.',
    accessibilityText:
      'En väg sedd uppifrån vid några minusgrader. Din bil A kör österut. Vägen går först över en öppen, solbelyst raksträcka och passerar sedan över en bro längre fram i öster. Vägbanan ser torr ut hela vägen.',
    sourceReferences: [
      {
        name: 'Teoribok 2026-1 (Körkortonline.se)',
        reference: 'Förrädiskt väglag',
        verifiedAt: null,
        sourceId: 'teoribok-2026-1',
        sourcePages: [124],
      },
    ],
    status: 'reviewed',
  },
];

export const SCENARIO_BY_ID: ReadonlyMap<string, Scenario> = new Map(
  SCENARIOS.map((s) => [s.id, s]),
);

export function getScenario(id: string): Scenario | undefined {
  return SCENARIO_BY_ID.get(id);
}
