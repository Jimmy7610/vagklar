import type { Scenario } from '@/domain/content/types';

/**
 * Scenario Lab content.
 *
 * The model is deliberately data-driven: a scenario is a layout plus a list of
 * positioned vehicles, so new situations are authored as data rather than as
 * new drawing code. Every scenario carries an `accessibilityText` that fully
 * describes the situation, so the exercise never depends on seeing the image.
 */
export const SCENARIOS: Scenario[] = [
  {
    id: 'sc-hogerregeln-1',
    title: 'Vem kör först?',
    categoryId: 'korsningar',
    subcategory: 'hogerregeln',
    difficulty: 1,
    kind: 'order-of-passage',
    prompt:
      'En oskyltad fyrvägskorsning. Alla tre fordonen ska rakt fram. Tryck på fordonen i den ordning de kan köra.',
    layout: 'crossroads',
    vehicles: [
      { id: 'ego', label: 'Din bil, kommer söderifrån', x: 44, y: 82, heading: 0, intent: 'straight', kind: 'car', isEgo: true },
      { id: 'v-right', label: 'Bil från höger', x: 82, y: 44, heading: 270, intent: 'straight', kind: 'car' },
      { id: 'v-left', label: 'Bil från vänster', x: 18, y: 56, heading: 90, intent: 'straight', kind: 'car' },
    ],
    correctOrder: ['v-right', 'ego', 'v-left'],
    ruleTested: 'Högerregeln',
    explanation:
      'Utan vägmärken gäller högerregeln. Bilen från höger kör först. Sedan kan du köra, eftersom bilen till vänster i sin tur har väjningsplikt mot dig — du är till höger om den.',
    stepExplanations: [
      'Bilen från höger har företräde mot dig och kör först.',
      'Du är till höger om bilen från vänster, så du kör som nummer två.',
      'Bilen från vänster har väjningsplikt mot dig och kör sist.',
    ],
    accessibilityText:
      'En fyrvägskorsning utan vägmärken sedd uppifrån. Din bil kommer söderifrån och ska rakt fram. En bil kommer från höger, österifrån, och ska rakt fram. En bil kommer från vänster, västerifrån, och ska rakt fram.',
    sourceReferences: [
      { name: 'Trafikförordningen (1998:1276)', reference: '3 kap. 18 §', verifiedAt: null },
    ],
    status: 'reviewed',
  },
  {
    id: 'sc-utfart-1',
    title: 'Ut från parkeringen',
    categoryId: 'korsningar',
    subcategory: 'utfartsregeln',
    difficulty: 2,
    kind: 'order-of-passage',
    prompt:
      'Du kör ut från en parkeringsplats. En cyklist kommer från vänster och en bil från höger. Tryck på trafikanterna i den ordning de kan passera.',
    layout: 't-junction',
    vehicles: [
      { id: 'ego', label: 'Din bil, på väg ut från parkeringen', x: 50, y: 80, heading: 0, intent: 'right', kind: 'car', isEgo: true },
      { id: 'bike', label: 'Cyklist från vänster', x: 16, y: 56, heading: 90, intent: 'straight', kind: 'bicycle' },
      { id: 'car', label: 'Bil från höger', x: 84, y: 44, heading: 270, intent: 'straight', kind: 'car' },
    ],
    correctOrder: ['bike', 'car', 'ego'],
    ruleTested: 'Utfartsregeln',
    explanation:
      'Du kommer ut från ett område som inte är en väg och har därför väjningsplikt mot alla — både cyklisten och bilen. Högerregeln gäller inte här. Cyklisten och bilen färdas på vägen och passerar före dig.',
    stepExplanations: [
      'Cyklisten kör på vägen och har företräde mot dig.',
      'Bilen kör också på vägen och har företräde mot dig.',
      'Du kör sist — utfartsregeln ger dig väjningsplikt mot alla.',
    ],
    accessibilityText:
      'En parkeringsutfart som möter en väg, sedd uppifrån. Din bil står i utfarten och ska svänga ut. En cyklist närmar sig från vänster på vägen. En bil närmar sig från höger på vägen.',
    sourceReferences: [
      { name: 'Trafikförordningen (1998:1276)', reference: '3 kap. 21 §', verifiedAt: null },
    ],
    status: 'reviewed',
  },
  {
    id: 'sc-vanstersvang-1',
    title: 'Vänstersväng med mötande',
    categoryId: 'korsningar',
    subcategory: 'vajningsplikt',
    difficulty: 2,
    kind: 'order-of-passage',
    prompt:
      'Du ska svänga vänster i en oskyltad korsning. Ett fordon möter dig och ska rakt fram. Tryck i den ordning ni kan köra.',
    layout: 'crossroads',
    vehicles: [
      { id: 'ego', label: 'Din bil, ska svänga vänster', x: 44, y: 80, heading: 0, intent: 'left', kind: 'car', isEgo: true },
      { id: 'oncoming', label: 'Mötande bil, ska rakt fram', x: 56, y: 18, heading: 180, intent: 'straight', kind: 'car' },
    ],
    correctOrder: ['oncoming', 'ego'],
    ruleTested: 'Vänstersväng mot mötande',
    explanation:
      'Den som svänger vänster ska lämna företräde åt mötande trafik som kör rakt fram eller svänger höger. Vänta tills fordonet passerat innan du svänger.',
    stepExplanations: [
      'Den mötande bilen kör rakt fram och passerar först.',
      'Du svänger vänster när vägen är fri.',
    ],
    accessibilityText:
      'En fyrvägskorsning sedd uppifrån. Din bil kommer söderifrån och ska svänga vänster. En mötande bil kommer norrifrån och ska rakt fram.',
    sourceReferences: [
      { name: 'Trafikförordningen (1998:1276)', reference: '3 kap. 24 §', verifiedAt: null },
    ],
    status: 'reviewed',
  },
  {
    id: 'sc-cirkulation-1',
    title: 'In i cirkulationsplatsen',
    categoryId: 'korsningar',
    subcategory: 'cirkulationsplats',
    difficulty: 2,
    kind: 'order-of-passage',
    prompt:
      'Du ska köra in i en cirkulationsplats med väjningsplikt vid infarten. Ett fordon är redan inne i cirkulationen. Tryck i den ordning ni kan köra.',
    layout: 'roundabout',
    vehicles: [
      { id: 'ego', label: 'Din bil, vid infarten söderifrån', x: 44, y: 84, heading: 0, intent: 'straight', kind: 'car', isEgo: true },
      { id: 'inside', label: 'Bil inne i cirkulationen', x: 50, y: 29, heading: 90, intent: 'straight', kind: 'car' },
    ],
    correctOrder: ['inside', 'ego'],
    ruleTested: 'Väjningsplikt vid cirkulationsplats',
    explanation:
      'Väjningsplikt vid infarten betyder att fordon som redan befinner sig i cirkulationen kör först. Högerregeln har ingen roll här.',
    stepExplanations: [
      'Bilen inne i cirkulationen fortsätter — den har företräde.',
      'Du kör in när det finns en lucka.',
    ],
    accessibilityText:
      'En cirkulationsplats sedd uppifrån. Din bil står vid den södra infarten. En bil befinner sig redan inne i cirkulationen, i den norra delen, på väg österut.',
    sourceReferences: [
      { name: 'Trafikförordningen (1998:1276)', reference: '3 kap. 18 §', verifiedAt: null },
    ],
    status: 'reviewed',
  },
  {
    id: 'sc-risk-stadsgata',
    title: 'Vad är risken här?',
    categoryId: 'risker',
    subcategory: 'skymd-sikt',
    difficulty: 2,
    kind: 'risk-spotting',
    prompt: 'Du kör på en bostadsgata. Tryck på det som utgör den största risken.',
    layout: 'street-scene',
    vehicles: [
      { id: 'ego', label: 'Din bil', x: 20, y: 56, heading: 90, intent: 'straight', kind: 'car', isEgo: true },
      { id: 'parked-1', label: 'Parkerad bil', x: 52, y: 41, heading: 90, intent: 'straight', kind: 'car' },
      { id: 'parked-2', label: 'Parkerad bil', x: 70, y: 41, heading: 90, intent: 'straight', kind: 'car' },
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
          'Parkerade bilar döljer människor. Ett barn eller en gående kan kliva ut i mellanrummet utan att se dig, och du hinner inte se dem förrän de är framme vid körbanan.',
      },
      {
        id: 'road-ahead',
        label: 'Den fria vägen längre fram',
        x: 88,
        y: 50,
        radius: 8,
        isRisk: false,
        explanation:
          'Den fria sträckan längre fram är inte problemet — risken finns i det du inte ser.',
      },
      {
        id: 'own-lane',
        label: 'Ditt eget körfält',
        x: 32,
        y: 56,
        radius: 8,
        isRisk: false,
        explanation:
          'Ditt körfält är fritt just nu. Faran ligger i sidled, inte rakt fram.',
      },
    ],
    ruleTested: 'Skymd sikt vid parkerade fordon',
    explanation:
      'Den största risken är mellanrummet mellan de parkerade bilarna. Sänk farten och öka sidoavståndet så att du både ser tidigare och hinner stanna.',
    accessibilityText:
      'En bostadsgata sedd uppifrån. Din bil kör österut. Två bilar står parkerade längs den norra kanten med ett mellanrum mellan sig. Vägen framför är fri.',
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
