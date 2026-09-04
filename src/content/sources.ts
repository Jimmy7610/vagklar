/**
 * Source registry.
 *
 * Every piece of theory content in Vägklar points at an entry here by id
 * rather than repeating publisher strings, editions and rights holders across
 * hundreds of question definitions. One place to update when an edition
 * changes; one place to read when we render attribution.
 *
 * Rights principle: Vägklar's own software, design, original illustrations and
 * original content belong to Jimmy Eliasson. Third-party theory material
 * remains the property of its rights holder and is used with permission.
 * Traffic law, public regulations and official information are not claimed as
 * anyone's proprietary content — see docs/SOURCES-AND-RIGHTS.md.
 */

import { DISCLAIMER } from '@/domain/constants';

export type SourceKind = 'book' | 'regulation' | 'authority' | 'general';

export type PermissionStatus =
  /** Third-party material we have explicit permission from the rights holder to use. */
  | 'granted'
  /** Public legal texts and regulations — no permission needed to describe them. */
  | 'public-legal'
  /** Vägklar's own material. */
  | 'own-work';

export interface SourceEntry {
  id: string;
  kind: SourceKind;
  /** Full title as published. */
  title: string;
  /** Publisher or issuing body. */
  publisher?: string;
  /** Legal rights holder, when different from the publisher's trading name. */
  rightsHolder?: string;
  edition?: string;
  publishedAt?: string;
  isbn?: string;
  url?: string;
  /** Total pages, for validating page citations. */
  pageCount?: number;
  permission: PermissionStatus;
  /** Shown in the UI wherever this source is credited. */
  attribution: string;
  /** Internal note about how the material may be used. */
  usageNote?: string;
}

export const SOURCES: SourceEntry[] = [
  {
    id: 'teoribok-2026-1',
    kind: 'book',
    title: 'Teoribok — Körkortsboken 2026 för B-körkort',
    publisher: 'Körkortonline.se',
    rightsHolder: 'Hagberg Media AB',
    edition: '2026-1',
    publishedAt: '2026-01-01',
    isbn: '978-91-991023-0-6',
    url: 'https://korkortonline.se',
    pageCount: 367,
    permission: 'granted',
    attribution: 'Teoribok 2026-1, Körkortonline.se — © Hagberg Media AB, används med tillstånd',
    usageNote:
      'Used as curriculum backbone and fact-checking reference. The book itself is never ' +
      'redistributed, bundled or published through Vägklar. Content is rewritten into ' +
      "Vägklar's own learning units, questions and vector illustrations.",
  },
  {
    id: 'trafikforordningen',
    kind: 'regulation',
    title: 'Trafikförordningen (1998:1276)',
    publisher: 'Sveriges riksdag',
    url: 'https://www.riksdagen.se',
    permission: 'public-legal',
    attribution: 'Trafikförordningen (1998:1276)',
  },
  {
    id: 'vagmarkesforordningen',
    kind: 'regulation',
    title: 'Vägmärkesförordningen (2007:90)',
    publisher: 'Sveriges riksdag',
    url: 'https://www.riksdagen.se',
    permission: 'public-legal',
    attribution: 'Vägmärkesförordningen (2007:90)',
  },
  {
    id: 'korkortslagen',
    kind: 'regulation',
    title: 'Körkortslagen (1998:488)',
    publisher: 'Sveriges riksdag',
    url: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/korkortslag-1998488_sfs-1998-488/',
    permission: 'public-legal',
    attribution: 'Körkortslagen (1998:488)',
  },
  {
    id: 'trafikbrottslagen',
    kind: 'regulation',
    title: 'Lag (1951:649) om straff för vissa trafikbrott',
    publisher: 'Sveriges riksdag',
    url: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-1951649-om-straff-for-vissa-trafikbrott_sfs-1951-649/',
    permission: 'public-legal',
    attribution: 'Lag (1951:649) om straff för vissa trafikbrott',
  },
  {
    id: 'transportstyrelsen',
    kind: 'authority',
    title: 'Transportstyrelsen',
    publisher: 'Transportstyrelsen',
    url: 'https://www.transportstyrelsen.se',
    permission: 'public-legal',
    attribution: 'Transportstyrelsen',
    usageNote:
      'Issuing authority for vehicle registration, roadworthiness testing and driving ' +
      'licences. Cited for administrative rules, which the regulations themselves ' +
      'delegate to the agency.',
  },
  {
    id: 'trafikverket',
    kind: 'authority',
    title: 'Trafikverket',
    publisher: 'Trafikverket',
    url: 'https://www.trafikverket.se',
    permission: 'public-legal',
    attribution: 'Trafikverket',
    usageNote:
      'Road authority and examiner. Cited for road-safety guidance and the theory ' +
      'test format. Vägklar is not affiliated with Trafikverket.',
  },
  {
    id: 'brottsbalken',
    kind: 'regulation',
    title: 'Brottsbalk (1962:700)',
    publisher: 'Sveriges riksdag',
    url: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/brottsbalk-1962700_sfs-1962-700/',
    permission: 'public-legal',
    attribution: 'Brottsbalk (1962:700)',
    usageNote:
      'Cited for 23 kap. om medverkan — the chapter that makes handing the keys to '
      + 'an intoxicated driver punishable. Rattfylleri itself lives in trafikbrottslagen.',
  },
  {
    id: 'polisen',
    kind: 'authority',
    title: 'Polismyndigheten',
    publisher: 'Polismyndigheten',
    url: 'https://polisen.se/lagar-och-regler/trafik-och-fordon/ratt--och-sjofylleri/',
    permission: 'public-legal',
    attribution: 'Polismyndigheten',
    usageNote:
      'Enforcing authority. Cited for the breath-alcohol limits as they are actually '
      + 'measured at the roadside, and for how a sobriety check is carried out.',
  },
  {
    id: 'vardguiden-1177',
    kind: 'authority',
    title: '1177 Vårdguiden',
    publisher: 'Sveriges regioner i samverkan',
    url: 'https://www.1177.se/liv--halsa/tobak-och-alkohol/alkohol/sa-paverkas-kroppen-av-alkohol/',
    permission: 'public-legal',
    attribution: '1177 Vårdguiden',
    usageNote:
      'The regions\' joint health information service. Cited for how the body handles '
      + 'alcohol — a medical question, not a legal one, and one the traffic authorities '
      + 'do not answer. Statements sourced here are guidance, never statute.',
  },
  {
    id: 'lakemedelsverket',
    kind: 'authority',
    title: 'Läkemedelsverket',
    publisher: 'Läkemedelsverket',
    url: 'https://www.lakemedelsverket.se',
    permission: 'public-legal',
    attribution: 'Läkemedelsverket',
    usageNote:
      'Medicines agency. Cited for the warning triangle on packaging and for how '
      + 'medicines interact with alcohol.',
  },
  {
    id: 'vagklar-original',
    kind: 'general',
    title: 'Vägklars eget material',
    rightsHolder: 'Jimmy Eliasson',
    permission: 'own-work',
    attribution: '© 2026 Jimmy Eliasson',
  },
];

export const SOURCE_BY_ID: ReadonlyMap<string, SourceEntry> = new Map(
  SOURCES.map((s) => [s.id, s]),
);

export function getSource(id: string): SourceEntry | undefined {
  return SOURCE_BY_ID.get(id);
}

/** The primary curriculum source. Used by the curriculum map. */
export const PRIMARY_SOURCE_ID = 'teoribok-2026-1';

/* ------------------------------------------------------------------ */
/* Rights and attribution copy — one definition, used everywhere.      */
/* ------------------------------------------------------------------ */

export const RIGHTS = {
  year: 2026,
  author: 'Jimmy Eliasson',
  copyright: '© 2026 Jimmy Eliasson. Alla rättigheter förbehållna.',
  copyrightShort: '© 2026 Jimmy Eliasson',

  ownWork:
    'Vägklars programvara, design, egna illustrationer och eget originalinnehåll är ' +
    '© 2026 Jimmy Eliasson, om inget annat anges.',

  thirdParty:
    'Material från Körkortonline.se / Hagberg Media AB används med tillstånd och tillhör ' +
    'respektive rättighetshavare.',

  thirdPartyShort:
    'Vissa teori- och referensmaterial används med tillstånd från respektive rättighetshavare.',

  publicLaw:
    'Trafikregler, lagtext, myndighetsföreskrifter och annan offentlig information görs inga ' +
    'äganderättsanspråk på.',

  /** Canonical wording lives in domain/constants so it cannot drift. */
  disclaimer: DISCLAIMER,

  developedBy: 'Vägklar är utvecklad av Jimmy Eliasson.',
} as const;
