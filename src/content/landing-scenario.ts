import type { Scenario } from '@/domain/content/types';

/**
 * The single scenario the landing page renders as a live demo.
 *
 * It lives in its own module rather than in `scenarios.ts` for a measurable
 * reason: the landing page is the only thing outside the lazily loaded routes
 * that draws a scenario, and a bundler cannot split one module across two
 * chunks. Reaching for `SCENARIOS[0]` therefore put every scenario — about
 * 48 kB of source — into the startup payload to show one picture.
 *
 * `SCENARIOS` lists this first, so the demo is a real exercise the learner can
 * open in Scenario Lab, not a separate mock that could drift out of sync.
 */
export const LANDING_SCENARIO: Scenario = {
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
  sourceReferences: [
    {
      name: 'Trafikförordningen (1998:1276)',
      reference: '3 kap. 18 §',
      verifiedAt: null,
      sourceId: 'trafikforordningen',
    },
  ],
  status: 'reviewed',
};
