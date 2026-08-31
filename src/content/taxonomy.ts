import type { Category, CategoryId, Subcategory } from '@/domain/content/types';

/**
 * The Vägklar knowledge taxonomy.
 *
 * Top-level areas mirror how Swedish driving theory is normally taught; the
 * subcategories are the level the adaptive engine actually reasons about.
 * `examWeight` controls how much space an area gets in a simulated exam.
 */
type CategorySeed = Omit<Category, 'subcategories'> & {
  subcategories: Array<Omit<Subcategory, 'categoryId'>>;
};

const seed: CategorySeed[] = [
  {
    id: 'trafikregler',
    name: 'Trafikregler',
    summary: 'Grundreglerna som allt annat vilar på.',
    icon: 'rules',
    examWeight: 10,
    subcategories: [
      { id: 'grundregler', name: 'Grundläggande bestämmelser', weight: 1 },
      { id: 'trafiksignaler', name: 'Trafiksignaler och tecken', weight: 1 },
      { id: 'vagens-anvandning', name: 'Vägens användning', weight: 1 },
      { id: 'korfalt-och-sving', name: 'Körfält och sväng', weight: 1 },
      { id: 'oskyddade-trafikanter', name: 'Gående och cyklister', weight: 1.1 },
    ],
  },
  {
    id: 'vagmarken',
    name: 'Vägmärken och vägmarkeringar',
    summary: 'Läs vägen innan du behöver tänka på den.',
    icon: 'sign',
    examWeight: 11,
    subcategories: [
      { id: 'varningsmarken', name: 'Varningsmärken', weight: 1 },
      { id: 'forbudsmarken', name: 'Förbudsmärken', weight: 1.1 },
      { id: 'pabudsmarken', name: 'Påbudsmärken', weight: 0.9 },
      { id: 'anvisningsmarken', name: 'Anvisningsmärken', weight: 1 },
      { id: 'vagmarkeringar', name: 'Vägmarkeringar', weight: 1 },
    ],
  },
  {
    id: 'hastighet',
    name: 'Hastighet och placering',
    summary: 'Rätt fart och rätt plats på vägen.',
    icon: 'speed',
    examWeight: 8,
    subcategories: [
      { id: 'hastighetsgranser', name: 'Hastighetsgränser', weight: 1.2 },
      { id: 'anpassad-hastighet', name: 'Anpassad hastighet', weight: 1 },
      { id: 'placering', name: 'Placering i körfält', weight: 1 },
      { id: 'avstand', name: 'Avstånd till andra', weight: 1 },
    ],
  },
  {
    id: 'korsningar',
    name: 'Korsningar och väjningsregler',
    summary: 'Vem kör först — och varför.',
    icon: 'intersection',
    examWeight: 12,
    subcategories: [
      { id: 'hogerregeln', name: 'Högerregeln', weight: 1.3 },
      { id: 'vajningsplikt', name: 'Väjningsplikt', weight: 1.2 },
      { id: 'stopplikt', name: 'Stopplikt', weight: 1 },
      { id: 'utfartsregeln', name: 'Utfartsregeln', weight: 1.2 },
      { id: 'cirkulationsplats', name: 'Cirkulationsplats', weight: 1 },
      { id: 'huvudled', name: 'Huvudled', weight: 1 },
      { id: 'trafiksignal-korsning', name: 'Trafiksignal i korsning', weight: 1 },
      { id: 'polisens-tecken', name: 'Polisens tecken', weight: 0.8 },
    ],
  },
  {
    id: 'parkering',
    name: 'Stannande och parkering',
    summary: 'Var du får stanna, och var du absolut inte får.',
    icon: 'parking',
    examWeight: 7,
    subcategories: [
      { id: 'stannande-forbud', name: 'Förbud att stanna', weight: 1.2 },
      { id: 'parkeringsforbud', name: 'Förbud att parkera', weight: 1.2 },
      { id: 'parkeringsregler', name: 'Parkeringsregler', weight: 1 },
    ],
  },
  {
    id: 'motorvag',
    name: 'Motorväg och landsväg',
    summary: 'Höga hastigheter kräver tidiga beslut.',
    icon: 'motorway',
    examWeight: 7,
    subcategories: [
      { id: 'motorvag-regler', name: 'Regler på motorväg', weight: 1.2 },
      { id: 'pafart-avfart', name: 'Påfart och avfart', weight: 1.1 },
      { id: 'landsvag', name: 'Landsväg', weight: 1 },
      { id: 'motortrafikled', name: 'Motortrafikled', weight: 0.8 },
    ],
  },
  {
    id: 'omkorning',
    name: 'Omkörning och möte',
    summary: 'Den mest riskfyllda manövern du gör.',
    icon: 'overtake',
    examWeight: 6,
    subcategories: [
      { id: 'omkorningsregler', name: 'Omkörningsregler', weight: 1.2 },
      { id: 'omkorningsforbud', name: 'Förbud mot omkörning', weight: 1.1 },
      { id: 'mote', name: 'Möte', weight: 1 },
    ],
  },
  {
    id: 'risker',
    name: 'Risker',
    summary: 'Se faran innan den blir akut.',
    icon: 'risk',
    examWeight: 8,
    subcategories: [
      { id: 'riskbedomning', name: 'Riskbedömning', weight: 1.2 },
      { id: 'skymd-sikt', name: 'Skymd sikt', weight: 1 },
      { id: 'barn-och-oskyddade', name: 'Barn och oskyddade', weight: 1.1 },
      { id: 'djur-pa-vagen', name: 'Djur på vägen', weight: 0.9 },
    ],
  },
  {
    id: 'alkohol',
    name: 'Alkohol, droger och läkemedel',
    summary: 'Regler och verklig påverkan.',
    icon: 'alcohol',
    examWeight: 5,
    subcategories: [
      { id: 'alkohol-gransvarden', name: 'Gränsvärden och straff', weight: 1.2 },
      { id: 'alkohol-effekter', name: 'Effekter på körförmågan', weight: 1 },
      { id: 'droger-lakemedel', name: 'Droger och läkemedel', weight: 1 },
    ],
  },
  {
    id: 'trotthet',
    name: 'Trötthet och stress',
    summary: 'Din egen förmåga är också en trafikfaktor.',
    icon: 'fatigue',
    examWeight: 4,
    subcategories: [
      { id: 'trotthet', name: 'Trötthet', weight: 1.2 },
      { id: 'stress-och-kanslor', name: 'Stress och känslor', weight: 1 },
    ],
  },
  {
    id: 'morker',
    name: 'Mörker',
    summary: 'Kör aldrig fortare än du ser.',
    icon: 'night',
    examWeight: 5,
    subcategories: [
      { id: 'morkerkorning', name: 'Mörkerkörning', weight: 1.2 },
      { id: 'ljusanvandning', name: 'Ljusanvändning', weight: 1.2 },
      { id: 'mote-i-morker', name: 'Möte i mörker', weight: 1 },
    ],
  },
  {
    id: 'halka',
    name: 'Halka och väder',
    summary: 'Väglaget bestämmer vad som är möjligt.',
    icon: 'weather',
    examWeight: 6,
    subcategories: [
      { id: 'halka', name: 'Halka', weight: 1.2 },
      { id: 'vinterkorning', name: 'Vinterkörning', weight: 1.1 },
      { id: 'vattenplaning', name: 'Regn och vattenplaning', weight: 1 },
      { id: 'dimma', name: 'Dimma', weight: 0.8 },
    ],
  },
  {
    id: 'miljo',
    name: 'Miljö och sparsam körning',
    summary: 'Mjukare körning, lägre förbrukning.',
    icon: 'eco',
    examWeight: 4,
    subcategories: [
      { id: 'sparsam-korning', name: 'Sparsam körning', weight: 1.2 },
      { id: 'miljopaverkan', name: 'Miljöpåverkan', weight: 1 },
    ],
  },
  {
    id: 'fordonet',
    name: 'Fordonet',
    summary: 'Bilens skick är en del av din säkerhet.',
    icon: 'car',
    examWeight: 5,
    subcategories: [
      { id: 'dack-och-bromsar', name: 'Däck och bromsar', weight: 1.2 },
      { id: 'belysning-fordon', name: 'Belysning', weight: 1 },
      { id: 'kontroll-besiktning', name: 'Kontroll och besiktning', weight: 1 },
    ],
  },
  {
    id: 'last',
    name: 'Last och släp',
    summary: 'Vikt, behörighet och lastsäkring.',
    icon: 'trailer',
    examWeight: 4,
    subcategories: [
      { id: 'lastning', name: 'Lastning och lastsäkring', weight: 1 },
      { id: 'slapvagn', name: 'Släpvagn', weight: 1.2 },
    ],
  },
  {
    id: 'manniskan',
    name: 'Människan och beteende',
    summary: 'Uppmärksamhet, attityd och samspel.',
    icon: 'person',
    examWeight: 5,
    subcategories: [
      { id: 'reaktion-och-sinnen', name: 'Reaktion och sinnen', weight: 1.2 },
      { id: 'attityd-och-grupptryck', name: 'Attityd och grupptryck', weight: 1 },
      { id: 'korstrategi', name: 'Körstrategi', weight: 1 },
    ],
  },
];

export const CATEGORIES: Category[] = seed.map((c) => ({
  ...c,
  subcategories: c.subcategories.map((s) => ({ ...s, categoryId: c.id })),
}));

export const CATEGORY_BY_ID: ReadonlyMap<CategoryId, Category> = new Map(
  CATEGORIES.map((c) => [c.id, c]),
);

export const SUBCATEGORIES: Subcategory[] = CATEGORIES.flatMap((c) => c.subcategories);

export const SUBCATEGORY_BY_ID: ReadonlyMap<string, Subcategory> = new Map(
  SUBCATEGORIES.map((s) => [s.id, s]),
);

export function getCategory(id: CategoryId): Category | undefined {
  return CATEGORY_BY_ID.get(id);
}

export function getCategoryName(id: CategoryId): string {
  return CATEGORY_BY_ID.get(id)?.name ?? id;
}

export function getSubcategoryName(id: string): string {
  return SUBCATEGORY_BY_ID.get(id)?.name ?? id;
}

export function getCategoryIdForSubcategory(id: string): CategoryId | undefined {
  return SUBCATEGORY_BY_ID.get(id)?.categoryId;
}
