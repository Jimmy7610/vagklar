import { PRIMARY_SOURCE_ID } from '@/content/sources';

/**
 * The Vägklar curriculum map.
 *
 * Derived from the table of contents and chapter headings of
 * "Teoribok — Körkortsboken 2026 för B-körkort" (edition 2026-1, 367 pages),
 * used with permission from Hagberg Media AB. Page ranges were extracted from
 * the source document, not estimated.
 *
 * This file is deliberately *structure only*. It records what the curriculum
 * contains and where it lives in the source, so Vägklar can answer "which
 * parts of the theory do we actually cover?" — it contains no reproduced text
 * from the book.
 *
 * The `subcategory` field links a concept to Vägklar's own taxonomy
 * (src/content/taxonomy.ts). `null` means the concept has no home in the
 * taxonomy yet, which is exactly the signal the coverage report surfaces.
 */

export type MajorAreaId = 'trafikregler' | 'manniskan' | 'fordon' | 'miljo' | 'vagmarken' | 'rattsfall';

export type ConceptImportance = 'core' | 'supporting' | 'peripheral';

export interface CurriculumConcept {
  id: string;
  chapterId: string;
  majorArea: MajorAreaId;
  /** Human-readable concept name. */
  topic: string;
  /** Pages in the source that cover it. */
  sourcePages: number[];
  importance: ConceptImportance;
  /** Vägklar subcategory id, or null when nothing in the taxonomy covers it. */
  subcategory: string | null;
}

export interface CurriculumChapter {
  id: string;
  majorArea: MajorAreaId;
  title: string;
  startPage: number;
  endPage: number;
  /** Vägklar subcategories this chapter maps onto. */
  subcategories: string[];
}

export interface MajorArea {
  id: MajorAreaId;
  title: string;
  summary: string;
}

export const MAJOR_AREAS: MajorArea[] = [
  { id: 'trafikregler', title: 'Trafikregler', summary: 'Reglerna som styr hur trafiken fungerar.' },
  { id: 'manniskan', title: 'Människan', summary: 'Föraren som riskfaktor och resurs.' },
  { id: 'fordon', title: 'Fordon', summary: 'Bilens teknik, skick och fysik.' },
  { id: 'miljo', title: 'Miljö', summary: 'Utsläpp, drivmedel och sparsam körning.' },
  { id: 'vagmarken', title: 'Vägmärken', summary: 'Märken, markeringar och signaler.' },
  { id: 'rattsfall', title: 'Rättsfall', summary: 'Hur domstolar har dömt i trafikmål.' },
];

/** Chapters with page ranges taken directly from the source's contents. */
export const CURRICULUM_CHAPTERS: CurriculumChapter[] = [
  // ---- Trafikregler --------------------------------------------------
  { id: 'inledning', majorArea: 'trafikregler', title: 'Inledning', startPage: 6, endPage: 13, subcategories: ['grundregler', 'vagens-anvandning', 'hastighetsgranser', 'anpassad-hastighet', 'polisens-tecken', 'skymd-sikt', 'korstrategi'] },
  { id: 'korfalt', majorArea: 'trafikregler', title: 'Körfält', startPage: 14, endPage: 21, subcategories: ['korfalt-och-sving', 'placering', 'korfaltsbyte'] },
  { id: 'vajningsregler', majorArea: 'trafikregler', title: 'Väjningsregler', startPage: 22, endPage: 45, subcategories: ['hogerregeln', 'vajningsplikt', 'stopplikt', 'huvudled', 'utfartsregeln', 'trafiksignal-korsning', 'trafiksignaler'] },
  { id: 'passager', majorArea: 'trafikregler', title: 'Passager', startPage: 46, endPage: 57, subcategories: ['oskyddade-trafikanter', 'cykelpassage-overfart'] },
  { id: 'cirkulationsplats', majorArea: 'trafikregler', title: 'Cirkulationsplats', startPage: 58, endPage: 67, subcategories: ['cirkulationsplats', 'cirkulation-korfalt'] },
  { id: 'stanna-parkera', majorArea: 'trafikregler', title: 'Stanna & parkera', startPage: 68, endPage: 77, subcategories: ['stannande-forbud', 'parkeringsforbud', 'parkeringsregler'] },
  { id: 'landsvag', majorArea: 'trafikregler', title: 'Landsväg', startPage: 78, endPage: 89, subcategories: ['landsvag', 'avstand'] },
  { id: 'motorvag', majorArea: 'trafikregler', title: 'Motorväg & motortrafikled', startPage: 90, endPage: 97, subcategories: ['motorvag-regler', 'pafart-avfart', 'motortrafikled'] },
  { id: 'omkorningar', majorArea: 'trafikregler', title: 'Omkörningar', startPage: 98, endPage: 107, subcategories: ['omkorningsregler', 'omkorningsforbud', 'mote'] },
  { id: 'jarnvagskorsningar', majorArea: 'trafikregler', title: 'Järnvägskorsningar', startPage: 108, endPage: 115, subcategories: ['plankorsning-marken', 'plankorsning-korning', 'plankorsning-omkorning'] },
  { id: 'speciella-gator', majorArea: 'trafikregler', title: 'Speciella gator', startPage: 116, endPage: 123, subcategories: ['anvisningsmarken', 'hastighetsgranser'] },
  { id: 'vinter', majorArea: 'trafikregler', title: 'Vinter', startPage: 124, endPage: 131, subcategories: ['vinterkorning', 'halka'] },

  // ---- Människan -----------------------------------------------------
  { id: 'inlarning-mognad', majorArea: 'manniskan', title: 'Inlärning & mognad', startPage: 132, endPage: 139, subcategories: ['attityd-och-grupptryck', 'korstrategi', 'stress-och-kanslor'] },
  { id: 'alkohol', majorArea: 'manniskan', title: 'Alkohol', startPage: 140, endPage: 147, subcategories: ['alkohol-gransvarden', 'alkohol-effekter', 'droger-lakemedel'] },
  { id: 'trotthet', majorArea: 'manniskan', title: 'Trötthet', startPage: 148, endPage: 153, subcategories: ['trotthet'] },
  { id: 'synen', majorArea: 'manniskan', title: 'Synen', startPage: 154, endPage: 161, subcategories: ['reaktion-och-sinnen'] },
  { id: 'nedsatt-formaga', majorArea: 'manniskan', title: 'Nedsatt förmåga', startPage: 162, endPage: 167, subcategories: ['nedsatt-formaga'] },
  { id: 'barn', majorArea: 'manniskan', title: 'Barn', startPage: 168, endPage: 173, subcategories: ['barn-och-oskyddade'] },
  { id: 'trafikolyckor', majorArea: 'manniskan', title: 'Trafikolyckor', startPage: 174, endPage: 187, subcategories: ['riskbedomning', 'djur-pa-vagen'] },

  // ---- Fordon --------------------------------------------------------
  { id: 'indelning-fordon', majorArea: 'fordon', title: 'Indelning av fordon', startPage: 188, endPage: 195, subcategories: ['fordonsslag', 'slapvagn'] },
  { id: 'strackor', majorArea: 'fordon', title: 'Sträckor', startPage: 196, endPage: 203, subcategories: ['reaktion-och-sinnen'] },
  { id: 'dack', majorArea: 'fordon', title: 'Däck', startPage: 204, endPage: 213, subcategories: ['dack-och-bromsar', 'vinterkorning'] },
  { id: 'styrning', majorArea: 'fordon', title: 'Styrning', startPage: 214, endPage: 223, subcategories: ['vattenplaning', 'halka'] },
  { id: 'bromsar', majorArea: 'fordon', title: 'Bromsar', startPage: 224, endPage: 231, subcategories: ['dack-och-bromsar'] },
  { id: 'krocksakerhet', majorArea: 'fordon', title: 'Krocksäkerhet', startPage: 232, endPage: 237, subcategories: ['krocksakerhet'] },
  { id: 'bilbarnstolar', majorArea: 'fordon', title: 'Bilbarnstolar', startPage: 238, endPage: 243, subcategories: ['lastning'] },
  { id: 'langd-bredd', majorArea: 'fordon', title: 'Längd & bredd', startPage: 244, endPage: 251, subcategories: ['lastning'] },
  { id: 'last', majorArea: 'fordon', title: 'Last', startPage: 252, endPage: 261, subcategories: ['lastning', 'slapvagn'] },
  { id: 'belysning', majorArea: 'fordon', title: 'Belysning', startPage: 262, endPage: 271, subcategories: ['belysning-fordon', 'ljusanvandning', 'morkerkorning', 'mote-i-morker', 'dimma'] },
  { id: 'sakerhetskontroller', majorArea: 'fordon', title: 'Säkerhetskontroller', startPage: 272, endPage: 277, subcategories: ['kontroll-besiktning'] },
  { id: 'besiktning', majorArea: 'fordon', title: 'Besiktning', startPage: 278, endPage: 283, subcategories: ['kontroll-besiktning'] },
  { id: 'service', majorArea: 'fordon', title: 'Service', startPage: 284, endPage: 289, subcategories: ['kontroll-besiktning'] },
  { id: 'registreringsbevis', majorArea: 'fordon', title: 'Registreringsbevis', startPage: 290, endPage: 297, subcategories: ['registrering'] },
  { id: 'forsakring', majorArea: 'fordon', title: 'Försäkring', startPage: 298, endPage: 303, subcategories: ['forsakring'] },

  // ---- Miljö ---------------------------------------------------------
  { id: 'miljo', majorArea: 'miljo', title: 'Miljö', startPage: 304, endPage: 311, subcategories: ['miljopaverkan'] },
  { id: 'sparsam-korning', majorArea: 'miljo', title: 'Sparsam körning', startPage: 312, endPage: 317, subcategories: ['sparsam-korning'] },
  { id: 'drivmedel', majorArea: 'miljo', title: 'Drivmedel', startPage: 318, endPage: 323, subcategories: ['miljopaverkan', 'drivmedel'] },

  // ---- Vägmärken -----------------------------------------------------
  { id: 'vagmarken', majorArea: 'vagmarken', title: 'Vägmärken', startPage: 324, endPage: 361, subcategories: ['varningsmarken', 'forbudsmarken', 'pabudsmarken', 'anvisningsmarken', 'vagmarkeringar'] },

  // ---- Rättsfall -----------------------------------------------------
  { id: 'rattsfall', majorArea: 'rattsfall', title: 'Rättsfall', startPage: 362, endPage: 367, subcategories: ['rattspraxis'] },
];

function c(
  id: string,
  chapterId: string,
  majorArea: MajorAreaId,
  topic: string,
  sourcePages: number[],
  importance: ConceptImportance,
  subcategory: string | null,
): CurriculumConcept {
  return { id, chapterId, majorArea, topic, sourcePages, importance, subcategory };
}

/**
 * Concepts, with the pages that cover them in the source.
 *
 * Page numbers come from the extracted chapter headings; where a concept spans
 * a chapter's discussion the chapter's own range is used. Nothing here is
 * invented.
 */
export const CURRICULUM_CONCEPTS: CurriculumConcept[] = [
  // --- Concepts added so that subcategories the question bank already uses
  // --- are anchored in the syllabus rather than floating unmapped.
  c('anpassa-hastigheten', 'inledning', 'trafikregler', 'Anpassa hastigheten efter förhållandena', [8, 9], 'core', 'anpassad-hastighet'),
  c('skymd-sikt-bedomning', 'inledning', 'trafikregler', 'Skymd sikt och förutsägbara hinder', [9], 'core', 'skymd-sikt'),
  c('korning-i-morker', 'belysning', 'fordon', 'Körning i mörker', [262, 263], 'core', 'morkerkorning'),
  c('synlighet-morker', 'belysning', 'fordon', 'Synlighet i mörker för gående', [267, 268], 'core', 'morkerkorning'),
  c('avblandning-mote', 'belysning', 'fordon', 'Avbländning vid möte och omkörning', [266, 267], 'core', 'mote-i-morker'),
  c('korning-i-dimma', 'belysning', 'fordon', 'Dimma och kraftigt nedsatt sikt', [263, 264], 'core', 'dimma'),

  /* ---- Inledning (6–13) ---- */
  c('trafikens-grundregler', 'inledning', 'trafikregler', 'Trafikens grundregler', [6], 'core', 'grundregler'),
  c('vag-korbana-korfalt', 'inledning', 'trafikregler', 'Väg, körbana, körfält och vägren', [6], 'core', 'vagens-anvandning'),
  c('grundlaggande-sakerhet', 'inledning', 'trafikregler', 'Grundläggande säkerhet', [7], 'core', 'grundregler'),
  c('defensiv-korning', 'inledning', 'trafikregler', 'Defensiv körning', [7], 'core', 'korstrategi'),
  c('rangordning', 'inledning', 'trafikregler', 'Rangordning av anvisningar', [8], 'core', 'polisens-tecken'),
  c('bashastighet', 'inledning', 'trafikregler', 'Hastighet och bashastighet', [9], 'core', 'hastighetsgranser'),
  c('otydliga-trafikregler', 'inledning', 'trafikregler', 'Otydliga trafikregler', [10], 'supporting', 'grundregler'),

  /* ---- Körfält (14–21) ---- */
  c('korfaltstyper', 'korfalt', 'trafikregler', 'Olika typer av körfält', [14], 'core', 'korfalt-och-sving'),
  c('placering-i-korfalt', 'korfalt', 'trafikregler', 'Hur bilen ska placeras i körfältet', [14], 'core', 'placering'),
  c('placering-vid-svang', 'korfalt', 'trafikregler', 'Placering i samband med sväng', [15], 'core', 'korfalt-och-sving'),
  c('svang-enkelriktad', 'korfalt', 'trafikregler', 'Sväng på enkelriktad väg', [15], 'supporting', 'korfalt-och-sving'),
  c('val-av-korfalt', 'korfalt', 'trafikregler', 'Vilket körfält du ska välja', [16], 'core', 'placering'),
  c('korfaltsbyte', 'korfalt', 'trafikregler', 'Körfältsbyte steg för steg', [17], 'core', 'korfaltsbyte'),
  c('korfaltsbyte-forbud', 'korfalt', 'trafikregler', 'Förbjudet att byta körfält', [17], 'supporting', 'korfaltsbyte'),

  /* ---- Väjningsregler (22–45) ---- */
  c('inga-rattigheter', 'vajningsregler', 'trafikregler', 'Inga rättigheter, bara skyldigheter', [22], 'core', 'vajningsplikt'),
  c('vajningsplikt', 'vajningsregler', 'trafikregler', 'Väjningsplikt', [23], 'core', 'vajningsplikt'),
  c('stopplikt', 'vajningsregler', 'trafikregler', 'Stopplikt', [24], 'core', 'stopplikt'),
  c('huvudled', 'vajningsregler', 'trafikregler', 'Huvudled', [25], 'core', 'huvudled'),
  c('hogerregeln', 'vajningsregler', 'trafikregler', 'Högerregeln', [26, 27, 28, 29, 30, 31, 32], 'core', 'hogerregeln'),
  c('hogerregeln-undantag', 'vajningsregler', 'trafikregler', 'När högerregeln inte gäller', [26], 'core', 'hogerregeln'),
  c('svangningsregeln', 'vajningsregler', 'trafikregler', 'Svängningsregeln', [33, 34], 'core', 'vajningsplikt'),
  c('utfartsregeln', 'vajningsregler', 'trafikregler', 'Utfartsregeln', [35, 36, 37], 'core', 'utfartsregeln'),
  c('korsa-gang-cykelbana', 'vajningsregler', 'trafikregler', 'Att korsa gång- eller cykelbana', [35], 'core', 'oskyddade-trafikanter'),
  c('blockeringsregeln', 'vajningsregler', 'trafikregler', 'Blockeringsregeln', [38], 'core', 'vajningsplikt'),
  c('bussregeln', 'vajningsregler', 'trafikregler', 'Bussregeln', [39], 'core', 'vajningsplikt'),
  c('trafiksignaler', 'vajningsregler', 'trafikregler', 'Trafiksignaler: röd, gul, grön', [40, 41, 42], 'core', 'trafiksignaler'),
  c('signal-med-pil', 'vajningsregler', 'trafikregler', 'Vanlig signal med pil', [41], 'supporting', 'trafiksignal-korsning'),

  /* ---- Passager (46–57) ---- */
  c('overgangsstalle', 'passager', 'trafikregler', 'Övergångsställe', [46, 47], 'core', 'oskyddade-trafikanter'),
  c('bevakat-overgangsstalle', 'passager', 'trafikregler', 'Bevakat övergångsställe', [46], 'core', 'oskyddade-trafikanter'),
  c('obevakat-overgangsstalle', 'passager', 'trafikregler', 'Obevakat övergångsställe', [46], 'core', 'oskyddade-trafikanter'),
  c('gangbana', 'passager', 'trafikregler', 'Gångbana', [48, 49], 'supporting', 'oskyddade-trafikanter'),
  c('cykelpassage', 'passager', 'trafikregler', 'Cykelpassage', [50, 51], 'core', 'cykelpassage-overfart'),
  c('cykeloverfart', 'passager', 'trafikregler', 'Cykelöverfart', [52, 53, 54], 'core', 'cykelpassage-overfart'),

  /* ---- Cirkulationsplats (58–67) ---- */
  c('cirkulation-grund', 'cirkulationsplats', 'trafikregler', 'Hur man kör i cirkulationsplatser', [58], 'core', 'cirkulationsplats'),
  c('cirkulation-rakt-fram', 'cirkulationsplats', 'trafikregler', 'Köra rakt fram i cirkulationsplats', [59], 'core', 'cirkulationsplats'),
  c('cirkulation-hoger', 'cirkulationsplats', 'trafikregler', 'Svänga höger i cirkulationsplats', [60], 'core', 'cirkulationsplats'),
  c('cirkulation-vanster', 'cirkulationsplats', 'trafikregler', 'Svänga vänster i cirkulationsplats', [61], 'core', 'cirkulationsplats'),
  c('cirkulation-blinkning', 'cirkulationsplats', 'trafikregler', 'Blinkning i cirkulationsplats', [62, 63], 'core', 'cirkulation-korfalt'),

  /* ---- Stanna & parkera (68–77) ---- */
  c('stanna-definition', 'stanna-parkera', 'trafikregler', 'Vad som räknas som att stanna', [68], 'core', 'stannande-forbud'),
  c('parkera-definition', 'stanna-parkera', 'trafikregler', 'Vad som räknas som parkering', [68], 'core', 'parkeringsforbud'),
  c('avstand-overgangsstalle', 'stanna-parkera', 'trafikregler', 'Avstånd före och efter övergångsställe', [69, 70], 'core', 'stannande-forbud'),
  c('allmant-stannande', 'stanna-parkera', 'trafikregler', 'Allmänt om stannande och parkerande', [71, 72], 'core', 'parkeringsregler'),
  c('tidsangivelser', 'stanna-parkera', 'trafikregler', 'Tidsangivelser på tilläggstavla', [73], 'core', 'parkeringsregler'),
  c('omradesmarke', 'stanna-parkera', 'trafikregler', 'Områdesmärke', [74], 'supporting', 'parkeringsregler'),

  /* ---- Landsväg (78–89) ---- */
  c('svanga-landsvag', 'landsvag', 'trafikregler', 'Svänga på landsväg', [78, 79, 80], 'core', 'landsvag'),
  c('halla-avstand', 'landsvag', 'trafikregler', 'Hålla rätt avstånd', [81], 'core', 'avstand'),
  c('kantstolpar', 'landsvag', 'trafikregler', 'Kantstolpar', [81], 'supporting', 'landsvag'),
  c('km-till-meter', 'landsvag', 'trafikregler', 'Km/h omräknat till meter per sekund', [81], 'core', 'reaktion-och-sinnen'),
  c('vagarbeten', 'landsvag', 'trafikregler', 'Vägarbeten', [82], 'supporting', 'landsvag'),
  c('hastar', 'landsvag', 'trafikregler', 'Hästar i trafiken', [83], 'peripheral', 'landsvag'),
  c('enskild-vag', 'landsvag', 'trafikregler', 'Enskild väg', [83, 84], 'supporting', 'landsvag'),

  /* ---- Motorväg (90–97) ---- */
  c('motorvag-regler', 'motorvag', 'trafikregler', 'Regler på motorväg', [90], 'core', 'motorvag-regler'),
  c('pafart-motorvag', 'motorvag', 'trafikregler', 'Påfart till motorväg', [91], 'core', 'pafart-avfart'),
  c('motorvag-forbud', 'motorvag', 'trafikregler', 'Förbjudet på motorväg', [91], 'core', 'motorvag-regler'),
  c('motorvag-risker', 'motorvag', 'trafikregler', 'Risker med motorvägar', [91, 92], 'core', 'motorvag-regler'),
  c('motortrafikled', 'motorvag', 'trafikregler', 'Motortrafikled', [93], 'core', 'motortrafikled'),

  /* ---- Omkörningar (98–107) ---- */
  c('omkorning-grundprinciper', 'omkorningar', 'trafikregler', 'Grundprinciper för omkörningar', [98], 'core', 'omkorningsregler'),
  c('omkorningsforbud', 'omkorningar', 'trafikregler', 'Omkörningsförbud', [99], 'core', 'omkorningsforbud'),
  c('bli-omkord', 'omkorningar', 'trafikregler', 'Att göra när du blir omkörd', [100], 'core', 'omkorningsregler'),
  c('rakna-omkorningar', 'omkorningar', 'trafikregler', 'Räkna på omkörningar och tidsvinst', [102, 103], 'supporting', 'omkorningsregler'),
  c('mote', 'omkorningar', 'trafikregler', 'Möte', [101], 'core', 'mote'),

  /* ---- Järnvägskorsningar (108–115) — no taxonomy home yet ---- */
  c('jarnvag-avstand', 'jarnvagskorsningar', 'trafikregler', 'Avstånd till järnvägskorsning', [109], 'core', 'plankorsning-marken'),
  c('jarnvag-korsa-sakert', 'jarnvagskorsningar', 'trafikregler', 'Hur man korsar en järnväg säkert', [109, 110], 'core', 'plankorsning-korning'),
  c('jarnvag-stopp-pa-spar', 'jarnvagskorsningar', 'trafikregler', 'Stopp mitt på spåret', [110], 'core', 'plankorsning-korning'),
  c('jarnvag-omkorning', 'jarnvagskorsningar', 'trafikregler', 'Omkörning vid plankorsning', [111], 'supporting', 'plankorsning-omkorning'),
  c('jarnvag-bommar', 'jarnvagskorsningar', 'trafikregler', 'Olika typer av järnvägsbommar', [112, 113], 'core', 'plankorsning-marken'),

  /* ---- Speciella gator (116–123) ---- */
  c('tattbebyggt-omrade', 'speciella-gator', 'trafikregler', 'Tättbebyggt område', [116], 'core', 'hastighetsgranser'),
  c('gangfartsomrade', 'speciella-gator', 'trafikregler', 'Gångfartsområde', [116], 'core', 'anvisningsmarken'),
  c('gagata', 'speciella-gator', 'trafikregler', 'Gågata', [117], 'core', 'anvisningsmarken'),
  c('cykelgata', 'speciella-gator', 'trafikregler', 'Cykelgata', [117], 'supporting', 'anvisningsmarken'),
  c('rekommenderad-lagre-hastighet', 'speciella-gator', 'trafikregler', 'Rekommenderad lägre hastighet', [118], 'supporting', 'anvisningsmarken'),

  /* ---- Vinter (124–131) ---- */
  c('forradiskt-vaglag', 'vinter', 'trafikregler', 'Förrädiskt väglag', [124], 'core', 'halka'),
  c('snostrangar', 'vinter', 'trafikregler', 'Snösträngar', [124], 'supporting', 'vinterkorning'),
  c('underkylt-regn', 'vinter', 'trafikregler', 'Underkylt regn', [125], 'core', 'halka'),
  c('snorok', 'vinter', 'trafikregler', 'Snörök', [125], 'supporting', 'vinterkorning'),
  c('vinterutrustning', 'vinter', 'trafikregler', 'Vinterutrustning', [126], 'core', 'vinterkorning'),
  c('arstider', 'vinter', 'trafikregler', 'Väglag under vår, sommar och höst', [127, 128], 'supporting', 'halka'),

  /* ---- Inlärning & mognad (132–139) ---- */
  c('inlarningstyper', 'inlarning-mognad', 'manniskan', 'Olika typer av inlärning', [132], 'supporting', 'korstrategi'),
  c('mognad', 'inlarning-mognad', 'manniskan', 'Olika grader av mognad', [132], 'core', 'attityd-och-grupptryck'),
  c('unga-bilforare', 'inlarning-mognad', 'manniskan', 'Unga bilförare', [133], 'core', 'attityd-och-grupptryck'),
  c('sannolikhetsinlarning', 'inlarning-mognad', 'manniskan', 'Sannolikhetsinlärning', [134], 'supporting', 'korstrategi'),
  c('stress', 'inlarning-mognad', 'manniskan', 'Stress', [134], 'core', 'stress-och-kanslor'),
  c('grupptryck', 'inlarning-mognad', 'manniskan', 'Grupptryck', [135], 'core', 'attityd-och-grupptryck'),

  /* ---- Alkohol (140–147) ---- */
  c('rattfylleri', 'alkohol', 'manniskan', 'Rattfylleri', [140], 'core', 'alkohol-gransvarden'),
  c('grovt-rattfylleri', 'alkohol', 'manniskan', 'Grovt rattfylleri', [140], 'core', 'alkohol-gransvarden'),
  c('promille', 'alkohol', 'manniskan', 'Promille och nedbrytning', [140], 'core', 'alkohol-effekter'),
  c('lakemedel', 'alkohol', 'manniskan', 'Läkemedel och mediciner i trafiken', [141], 'core', 'droger-lakemedel'),
  c('droger', 'alkohol', 'manniskan', 'Droger och narkotika i trafiken', [142], 'core', 'droger-lakemedel'),
  c('mobiltelefon', 'alkohol', 'manniskan', 'Mobiltelefon under körning', [143], 'core', 'reaktion-och-sinnen'),
  c('rakna-alkohol', 'alkohol', 'manniskan', 'Räkna på alkohol', [144, 145], 'supporting', 'alkohol-effekter'),

  /* ---- Trötthet (148–153) ---- */
  c('trotthet-orsaker', 'trotthet', 'manniskan', 'Orsaker till trötthet', [148], 'core', 'trotthet'),
  c('trotthetssignaler', 'trotthet', 'manniskan', 'Trötthetssignaler', [149], 'core', 'trotthet'),
  c('undvik-trotthet', 'trotthet', 'manniskan', 'Undvik och minska trötthet', [149, 150], 'core', 'trotthet'),

  /* ---- Synen (154–161) ---- */
  c('synfalt', 'synen', 'manniskan', 'Synfält, direkt- och periferiseende', [154], 'core', 'reaktion-och-sinnen'),
  c('bedomningar', 'synen', 'manniskan', 'Bedömningar av avstånd och hastighet', [155], 'core', 'reaktion-och-sinnen'),
  c('synvillor', 'synen', 'manniskan', 'Synvillor', [156], 'supporting', 'reaktion-och-sinnen'),
  c('tunnelseende', 'synen', 'manniskan', 'Tunnelseende', [157], 'core', 'reaktion-och-sinnen'),
  c('ovriga-sinnen', 'synen', 'manniskan', 'De övriga sinnena', [157, 158], 'supporting', 'reaktion-och-sinnen'),

  /* ---- Nedsatt förmåga (162–167) — no taxonomy home yet ---- */
  c('funktionsnedsattning', 'nedsatt-formaga', 'manniskan', 'Funktionsnedsättning i trafiken', [162], 'core', 'nedsatt-formaga'),
  c('vit-kapp', 'nedsatt-formaga', 'manniskan', 'Signaler med vit käpp', [162], 'core', 'nedsatt-formaga'),
  c('ledarhund', 'nedsatt-formaga', 'manniskan', 'Ledarhund', [163], 'supporting', 'nedsatt-formaga'),
  c('aldre-i-trafiken', 'nedsatt-formaga', 'manniskan', 'Äldre i trafiken', [163, 164], 'core', 'nedsatt-formaga'),

  /* ---- Barn (168–173) ---- */
  c('barn-svarigheter', 'barn', 'manniskan', 'Svårigheter med barn i trafiken', [168], 'core', 'barn-och-oskyddade'),
  c('barn-sinnen', 'barn', 'manniskan', 'Barns sinnen är inte färdigutvecklade', [169], 'core', 'barn-och-oskyddade'),
  c('skolbuss', 'barn', 'manniskan', 'Skolbussar och skolskjuts', [169], 'core', 'barn-och-oskyddade'),
  c('skolpatrull', 'barn', 'manniskan', 'Skolpatrull', [170], 'supporting', 'barn-och-oskyddade'),

  /* ---- Trafikolyckor (174–187) ---- */
  c('olycksorsaker', 'trafikolyckor', 'manniskan', 'Orsaker till olyckor', [174], 'core', 'riskbedomning'),
  c('riskbeteende', 'trafikolyckor', 'manniskan', 'Riskbeteende', [174], 'core', 'riskbedomning'),
  c('storre-olyckor', 'trafikolyckor', 'manniskan', 'Att göra vid större olyckor', [175], 'core', 'riskbedomning'),
  c('forsta-hjalpen', 'trafikolyckor', 'manniskan', 'Första hjälpen (LABC)', [175, 176], 'core', 'riskbedomning'),
  c('farligt-gods', 'trafikolyckor', 'manniskan', 'Farligt gods', [176], 'supporting', 'riskbedomning'),
  c('mindre-olyckor', 'trafikolyckor', 'manniskan', 'Att göra vid mindre olyckor', [176, 177], 'core', 'riskbedomning'),
  c('viltolyckor', 'trafikolyckor', 'manniskan', 'Viltolyckor och anmälningsplikt', [177, 178], 'core', 'djur-pa-vagen'),
  c('varningstriangel', 'trafikolyckor', 'manniskan', 'Varningstriangel', [179], 'core', 'riskbedomning'),
  c('nollvisionen', 'trafikolyckor', 'manniskan', 'Nollvisionen', [183], 'supporting', 'riskbedomning'),

  /* ---- Indelning av fordon (188–195) — no taxonomy home yet ---- */
  c('trafikant', 'indelning-fordon', 'fordon', 'Trafikant', [188], 'core', 'fordonsslag'),
  c('slapfordon', 'indelning-fordon', 'fordon', 'Släpfordon', [189], 'core', 'slapvagn'),
  c('efterfordon', 'indelning-fordon', 'fordon', 'Efterfordon', [189], 'peripheral', 'fordonsslag'),
  c('hastigheter-fordon', 'indelning-fordon', 'fordon', 'Hastigheter för olika fordon', [190, 191], 'core', 'fordonsslag'),

  /* ---- Sträckor (196–203) ---- */
  c('reaktionsstracka', 'strackor', 'fordon', 'Reaktionssträcka', [196, 197], 'core', 'reaktion-och-sinnen'),
  c('bromsstracka', 'strackor', 'fordon', 'Bromssträcka', [198, 199], 'core', 'reaktion-och-sinnen'),
  c('stoppstracka', 'strackor', 'fordon', 'Stoppsträcka', [200, 201], 'core', 'reaktion-och-sinnen'),

  /* ---- Däck (204–213) ---- */
  c('dacktyper', 'dack', 'fordon', 'Olika däcktyper', [204], 'core', 'dack-och-bromsar'),
  c('monsterdjup', 'dack', 'fordon', 'Mönsterdjup', [204], 'core', 'dack-och-bromsar'),
  c('vinterdack-krav', 'dack', 'fordon', 'När man måste använda vinterdäck', [205], 'core', 'vinterkorning'),
  c('dackfakta', 'dack', 'fordon', 'Däckfakta och blandning av däck', [206], 'core', 'dack-och-bromsar'),
  c('fel-pa-hjulen', 'dack', 'fordon', 'Fel på hjulen', [207], 'supporting', 'dack-och-bromsar'),
  c('reservhjul', 'dack', 'fordon', 'Reservhjul vid punktering', [207], 'supporting', 'dack-och-bromsar'),

  /* ---- Styrning (214–223) ---- */
  c('overstyrning', 'styrning', 'fordon', 'Överstyrning', [214, 215], 'core', 'halka'),
  c('understyrning', 'styrning', 'fordon', 'Understyrning', [216, 217], 'core', 'halka'),
  c('esc', 'styrning', 'fordon', 'Elektronisk stabilitetskontroll', [218], 'supporting', 'dack-och-bromsar'),
  c('vattenplaning', 'styrning', 'fordon', 'Vattenplaning', [219, 220], 'core', 'vattenplaning'),

  /* ---- Bromsar (224–231) ---- */
  c('tvakrets', 'bromsar', 'fordon', 'Tvåkrets bromssystem', [224], 'supporting', 'dack-och-bromsar'),
  c('skiv-trumbromsar', 'bromsar', 'fordon', 'Skiv- och trumbromsar', [224], 'peripheral', 'dack-och-bromsar'),
  c('abs', 'bromsar', 'fordon', 'ABS-bromsar', [224, 225], 'core', 'dack-och-bromsar'),
  c('bromsfel', 'bromsar', 'fordon', 'Fel på bromsarna', [225], 'core', 'dack-och-bromsar'),
  c('bromsvatska', 'bromsar', 'fordon', 'Bromsvätska och bromsservo', [226], 'supporting', 'kontroll-besiktning'),
  c('parkeringsbroms', 'bromsar', 'fordon', 'Parkeringsbroms', [227], 'supporting', 'dack-och-bromsar'),

  /* ---- Krocksäkerhet (232–237) — thin taxonomy coverage ---- */
  c('deformationszoner', 'krocksakerhet', 'fordon', 'Deformationszoner', [232], 'core', 'krocksakerhet'),
  c('bilbalte', 'krocksakerhet', 'fordon', 'Säkerhetsbälte', [232], 'core', 'krocksakerhet'),
  c('krockkudde', 'krocksakerhet', 'fordon', 'Krockkudde', [233, 234], 'core', 'krocksakerhet'),

  /* ---- Bilbarnstolar (238–243) ---- */
  c('bilbarnstol', 'bilbarnstolar', 'fordon', 'Bilbarnstolar och bältesstol', [238, 239, 240], 'core', 'lastning'),

  /* ---- Längd & bredd (244–251) ---- */
  c('utskjutande-last', 'langd-bredd', 'fordon', 'Utskjutande last och markering', [244, 245, 246], 'core', 'lastning'),

  /* ---- Last (252–261) ---- */
  c('viktbegrepp', 'last', 'fordon', 'Viktbegrepp (tjänstevikt, totalvikt, lastvikt)', [252, 253], 'core', 'slapvagn'),
  c('lastsakring', 'last', 'fordon', 'Lastsäkring', [254, 255], 'core', 'lastning'),
  c('slapvagn-behorighet', 'last', 'fordon', 'Släpvagn och B-behörighet', [256, 257, 258], 'core', 'slapvagn'),

  /* ---- Belysning (262–271) ---- */
  c('halvljus', 'belysning', 'fordon', 'Halvljus', [262, 263], 'core', 'ljusanvandning'),
  c('helljus', 'belysning', 'fordon', 'Helljus och avbländning', [263, 264], 'core', 'ljusanvandning'),
  c('varselljus', 'belysning', 'fordon', 'Varselljus', [264], 'core', 'belysning-fordon'),
  c('dimljus', 'belysning', 'fordon', 'Dimljus och dimbakljus', [265], 'core', 'ljusanvandning'),
  c('ovrig-belysning', 'belysning', 'fordon', 'Övrig belysning och lyktor', [266, 267], 'supporting', 'belysning-fordon'),

  /* ---- Säkerhetskontroller (272–277) ---- */
  c('sakerhetskontroll', 'sakerhetskontroller', 'fordon', 'Säkerhetskontroller före färd', [272, 273, 274], 'core', 'kontroll-besiktning'),

  /* ---- Besiktning (278–283) ---- */
  c('besiktning', 'besiktning', 'fordon', 'Kontrollbesiktning', [278, 279], 'core', 'kontroll-besiktning'),
  c('korforbud', 'besiktning', 'fordon', 'Körförbud', [280], 'core', 'kontroll-besiktning'),

  /* ---- Service (284–289) ---- */
  c('service', 'service', 'fordon', 'Service och underhåll', [284, 285], 'supporting', 'kontroll-besiktning'),

  /* ---- Registreringsbevis (290–297) — no taxonomy home yet ---- */
  c('registreringsbevis', 'registreringsbevis', 'fordon', 'Registreringsbevis', [290, 291], 'core', 'registrering'),
  c('fordonsskatt', 'registreringsbevis', 'fordon', 'Fordonsskatt och avställning', [292, 293], 'supporting', 'registrering'),

  /* ---- Försäkring (298–303) — no taxonomy home yet ---- */
  c('trafikforsakring', 'forsakring', 'fordon', 'Trafikförsäkring', [298, 299], 'core', 'forsakring'),
  c('halvforsakring', 'forsakring', 'fordon', 'Halv- och helförsäkring', [300], 'supporting', 'forsakring'),

  /* ---- Miljö (304–311) ---- */
  c('avgaser', 'miljo', 'miljo', 'Avgaser och utsläpp', [304, 305], 'core', 'miljopaverkan'),
  c('katalysator', 'miljo', 'miljo', 'Katalysator', [306], 'core', 'miljopaverkan'),
  c('miljozoner', 'miljo', 'miljo', 'Miljözoner', [307], 'supporting', 'drivmedel'),

  /* ---- Sparsam körning (312–317) ---- */
  c('sparsam-korning', 'sparsam-korning', 'miljo', 'Sparsam körning (ecodriving)', [312, 313, 314], 'core', 'sparsam-korning'),

  /* ---- Drivmedel (318–323) ---- */
  c('drivmedel', 'drivmedel', 'miljo', 'Drivmedel och bränsletyper', [318, 319, 320], 'core', 'drivmedel'),

  /* ---- Vägmärken (324–361) ---- */
  c('varningsmarken', 'vagmarken', 'vagmarken', 'Varningsmärken', [326, 327, 328, 329, 330], 'core', 'varningsmarken'),
  c('vajningsmarken', 'vagmarken', 'vagmarken', 'Väjningspliktsmärken', [331, 332], 'core', 'vagmarkeringar'),
  c('forbudsmarken', 'vagmarken', 'vagmarken', 'Förbudsmärken', [333, 334, 335, 336, 337], 'core', 'forbudsmarken'),
  c('pabudsmarken', 'vagmarken', 'vagmarken', 'Påbudsmärken', [338, 339], 'core', 'pabudsmarken'),
  c('anvisningsmarken', 'vagmarken', 'vagmarken', 'Anvisningsmärken', [340, 341, 342, 343], 'core', 'anvisningsmarken'),
  c('lokaliseringsmarken', 'vagmarken', 'vagmarken', 'Lokaliseringsmärken', [344, 345, 346], 'supporting', 'anvisningsmarken'),
  c('vagmarkeringar', 'vagmarken', 'vagmarken', 'Vägmarkeringar', [350, 351, 352, 353], 'core', 'vagmarkeringar'),
  c('tillaggstavlor', 'vagmarken', 'vagmarken', 'Tilläggstavlor', [354, 355], 'core', 'anvisningsmarken'),

  /* ---- Rättsfall (362–367) ---- */
  c('rattsfall', 'rattsfall', 'rattsfall', 'Hur domstolar har dömt i trafikmål', [362, 363, 364, 365, 366, 367], 'peripheral', 'rattspraxis'),
];

export const CHAPTER_BY_ID: ReadonlyMap<string, CurriculumChapter> = new Map(
  CURRICULUM_CHAPTERS.map((c) => [c.id, c]),
);

export const CONCEPT_BY_ID: ReadonlyMap<string, CurriculumConcept> = new Map(
  CURRICULUM_CONCEPTS.map((c) => [c.id, c]),
);

export const MAJOR_AREA_BY_ID: ReadonlyMap<MajorAreaId, MajorArea> = new Map(
  MAJOR_AREAS.map((a) => [a.id, a]),
);

/** The source every page reference in this file points into. */
export const CURRICULUM_SOURCE_ID = PRIMARY_SOURCE_ID;
