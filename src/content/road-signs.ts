/**
 * The road sign registry.
 *
 * One entry per sign Vägklar can draw. This is the only place that knows what a
 * sign means, what it is called, what its official code is and which signs it is
 * routinely confused with — questions and lessons reference an entry by id.
 *
 * `code` is the identifier from Vägmärkesförordningen (2007:90): A for warning
 * signs, B for priority signs, C for prohibitions, D for mandatory signs, E for
 * information signs and T for supplementary plates. Codes are taken from the
 * source catalogue, not guessed; a sign whose code could not be established
 * from the source is left without one rather than given a plausible-looking
 * value.
 *
 * The drawings live in ui/illustrations/signGlyphs.tsx. That split is on
 * purpose: this file is data the domain layer can validate without pulling in
 * React.
 */

export type SignCategory =
  | 'varning'
  | 'vajningsplikt'
  | 'forbud'
  | 'pabud'
  | 'anvisning'
  | 'tillaggstavla'
  /** F-serien: vägvisning och lokalisering. */
  | 'lokalisering'
  /**
   * S-serien: fordonssymboler. De sitter inte på egen stolpe utan är det som
   * ritas på en symboltavla för att peka ut vilket fordonsslag en regel gäller.
   */
  | 'symbol';

/**
 * What a supplementary plate does to the sign above it.
 *
 * A plate never means anything alone: it narrows the main sign. The kind says
 * *which* dimension it narrows, which is what lets the app say something useful
 * about a combination it has never seen before — a distance plate under any
 * sign means "the rule starts there", whatever the sign is.
 */
export type PlateKind =
  | 'distance'
  | 'extent'
  | 'direction'
  | 'time'
  | 'vehicle'
  | 'condition'
  | 'information';

export interface SupplementaryPlate {
  /** How the plate narrows the sign above it. */
  kind: PlateKind;
  /**
   * The words printed on this particular plate, if any. Plates are a family:
   * T2 is "a distance", and the book prints one example of it. This is what
   * *this* asset actually says, so a description can be accurate about the
   * picture rather than about the family.
   */
  printedText?: string;
  /** Read out with the main sign, e.g. "gäller om 100 m". */
  combinedPhrase: string;
}

/**
 * Which of several real signs share one official code.
 *
 * The regulation gives C31 to every speed limit, D1 to every mandatory
 * direction and T6 to every time plate. The book prints one picture per code,
 * so its C31 shows 30. Modelling the variant explicitly is what keeps the app
 * from claiming that a picture of a 30 sign is a 90 sign — and what lets the
 * renderer compose the right one from the authentic base.
 */
export interface SignVariant {
  /** Distinguishes siblings under one code, e.g. 'speed-90'. */
  key: string;
  /** The number on the face, when the variant is a number. */
  numericValue?: number;
  /** The direction the arrow points, when the variant is a direction. */
  arrowDirection?: 'up' | 'down' | 'left' | 'right';
  /** Free text on the face, when the variant is words. */
  text?: string;
}

/**
 * Facts about the picture, kept apart from facts about the meaning.
 *
 * These exist so a test can check the written description against the artwork
 * rather than against another description. The previous pass found twelve
 * descriptions that disagreed with the sign — motorway signs called blue when
 * they are green — precisely because nothing ever compared the two.
 */
export interface SignVisualTraits {
  background: 'yellow' | 'blue' | 'green' | 'red' | 'white' | 'black';
  border?: 'red' | 'blue' | 'white' | 'black' | 'none';
  /** Words printed on the face, verbatim. */
  text?: string;
  arrowDirection?: 'up' | 'down' | 'left' | 'right' | 'both';
  numericValue?: number;
}

export interface RoadSign {
  /** Stable id, also the glyph key. */
  id: string;
  /** Code from Vägmärkesförordningen, e.g. "B1". */
  code: string;
  /**
   * Set when several registry entries share one official code. The code stays
   * the real one — inventing "C31-90" would be pretending the regulation says
   * something it does not.
   */
  variant?: SignVariant;
  /** Set on T-series entries. A plate is a different kind of object. */
  plate?: SupplementaryPlate;
  /** Facts about the picture, for checking the description against it. */
  visualTraits?: SignVisualTraits;
  /**
   * Appearance only, for use while a question is unanswered.
   *
   * `altText` may name what the sign *is* — a lesson needs that. A question
   * asking what it means cannot say it out loud. Where the two differ, this one
   * is what a question surface uses.
   */
  quizSafeAltText?: string;
  name: string;
  category: SignCategory;
  /** One line: what it means. */
  shortMeaning: string;
  /** What it means for your driving, beyond the label. */
  longMeaning: string;
  /** Described for someone who cannot see it — shape, colour, symbol. */
  altText: string;
  tags: string[];
  /** Signs this one is genuinely confused with. Must be symmetric-ish and real. */
  similarSignIds: string[];
  /** Vägklar's own subcategory, so signs tie into the taxonomy. */
  subcategory: string;
}

function sign(entry: RoadSign): RoadSign {
  return entry;
}

export const ROAD_SIGNS: RoadSign[] = [
  /* ================= Varningsmärken (A) ================= */
  sign({
    id: 'varning-kurva',
    visualTraits: { background: 'yellow', border: 'red' },
    code: 'A1',
    name: 'Varning för farlig kurva',
    category: 'varning',
    shortMeaning: 'En kurva som är skarpare än den ser ut.',
    longMeaning:
      'Sänk farten före kurvan, inte i den. Bromsning mitt i en kurva minskar sidogreppet just när du behöver det som mest.',
    altText: 'Varningsmärke: gul triangel med röd ram och en svart pil som böjer av åt höger.',
    tags: ['kurva', 'landsvag'],
    similarSignIds: ['varning-flera-kurvor'],
    subcategory: 'varningsmarken',
  }),
  sign({
    id: 'varning-flera-kurvor',
    visualTraits: { background: 'yellow', border: 'red' },
    code: 'A2',
    name: 'Varning för flera farliga kurvor',
    category: 'varning',
    shortMeaning: 'Minst två kurvor efter varandra.',
    longMeaning:
      'Den första kurvan säger inget om den andra. Håll en fart du kan behålla genom hela serien i stället för att accelerera mellan dem.',
    altText: 'Varningsmärke: gul triangel med röd ram och en svart S-formad linje.',
    tags: ['kurva', 'landsvag'],
    similarSignIds: ['varning-kurva'],
    subcategory: 'varningsmarken',
  }),
  sign({
    id: 'varning-slirig-vag',
    visualTraits: { background: 'yellow', border: 'red' },
    code: 'A10',
    name: 'Varning för slirig väg',
    category: 'varning',
    shortMeaning: 'Vägbanan kan vara halare än den ser ut.',
    longMeaning:
      'Märket sätts upp där halka är särskilt vanlig. Öka avståndet och undvik kraftiga styr- och bromsrörelser.',
    altText: 'Varningsmärke: gul triangel med röd ram och en bil med slirspår bakom hjulen.',
    tags: ['halka', 'vinter'],
    similarSignIds: [],
    subcategory: 'varningsmarken',
  }),
  sign({
    id: 'varning-overgangsstalle',
    visualTraits: { background: 'yellow', border: 'red' },
    code: 'A13',
    name: 'Varning för övergångsställe',
    category: 'varning',
    shortMeaning: 'Ett övergångsställe finns längre fram.',
    longMeaning:
      'Det här är en förvarning, inte själva övergångsstället. Övergångsstället märks ut med B3 och vägmarkering — det är där väjningsplikten mot gående gäller.',
    altText: 'Varningsmärke: gul triangel med röd ram och en gående figur.',
    tags: ['oskyddade', 'gaende'],
    similarSignIds: ['overgangsstalle-b3', 'varning-barn'],
    subcategory: 'varningsmarken',
  }),
  sign({
    id: 'varning-barn',
    visualTraits: { background: 'yellow', border: 'red' },
    code: 'A15',
    name: 'Varning för barn',
    category: 'varning',
    shortMeaning: 'Barn rör sig ofta i området.',
    longMeaning:
      'Barn bedömer hastighet och avstånd sämre än vuxna och kan lämna trottoaren utan förvarning. Sänk farten och räkna med det oväntade.',
    altText: 'Varningsmärke: gul triangel med röd ram och två gående barnfigurer.',
    tags: ['barn', 'oskyddade'],
    similarSignIds: ['varning-overgangsstalle'],
    subcategory: 'varningsmarken',
  }),
  sign({
    id: 'varning-cyklande',
    visualTraits: { background: 'yellow', border: 'red' },
    code: 'A16',
    name: 'Varning för cyklande och mopedförare',
    category: 'varning',
    shortMeaning: 'Cyklister och mopedister korsar eller finns i vägbanan.',
    longMeaning:
      'Vanlig före cykelpassager och där en cykelbana möter körbanan. Var särskilt uppmärksam vid högersväng.',
    altText: 'Varningsmärke: gul triangel med röd ram och en cyklist.',
    tags: ['cykel', 'oskyddade'],
    similarSignIds: ['pabud-cykelbana', 'cykeloverfart'],
    subcategory: 'varningsmarken',
  }),
  sign({
    id: 'varning-vagarbete',
    visualTraits: { background: 'yellow', border: 'red' },
    code: 'A20',
    name: 'Varning för vägarbete',
    category: 'varning',
    shortMeaning: 'Vägarbete längre fram.',
    longMeaning:
      'Räkna med människor nära körbanan, ändrad körfältsindelning och löst grus. Tillfälliga hastighetsbegränsningar gäller före de ordinarie.',
    altText: 'Varningsmärke: gul triangel med röd ram och en figur som arbetar med en spade.',
    tags: ['vagarbete'],
    similarSignIds: [],
    subcategory: 'varningsmarken',
  }),
  sign({
    id: 'varning-vagkorsning',
    visualTraits: { background: 'yellow', border: 'red' },
    code: 'A28',
    name: 'Varning för vägkorsning',
    category: 'varning',
    shortMeaning: 'En korsning där högerregeln gäller.',
    longMeaning:
      'Märket varnar för en korsning utan väjningsplikt eller stopplikt för dig — alltså en korsning där högerregeln gäller. Det ger dig inte företräde.',
    altText: 'Varningsmärke: gul triangel med röd ram och ett svart kors.',
    tags: ['korsning', 'hogerregeln'],
    similarSignIds: ['huvudled', 'vajningsplikt'],
    subcategory: 'varningsmarken',
  }),
  sign({
    id: 'varning-cirkulationsplats',
    visualTraits: { background: 'yellow', border: 'red' },
    code: 'A30',
    name: 'Varning för cirkulationsplats',
    category: 'varning',
    shortMeaning: 'En cirkulationsplats längre fram.',
    longMeaning:
      'Förvarning på väg mot cirkulationsplatsen. Själva väjningsplikten vid infarten anges av D3 tillsammans med B1.',
    altText: 'Varningsmärke: gul triangel med röd ram och tre svarta pilar i en ring.',
    tags: ['cirkulation'],
    similarSignIds: ['cirkulationsplats'],
    subcategory: 'varningsmarken',
  }),
  sign({
    id: 'varning-motande-trafik',
    visualTraits: { background: 'yellow', border: 'red' },
    code: 'A25',
    name: 'Varning för mötande trafik',
    category: 'varning',
    shortMeaning: 'Mötande trafik börjar på en väg som saknat den.',
    longMeaning:
      'Typiskt där en enkelriktad sträcka eller en fyrfältsväg övergår i tvåvägstrafik. Placera dig åt höger och räkna med möte.',
    altText:
      'Varningsmärke: gul triangel med röd ram och två svarta pilar mot varandra, den vänstra nedåt och den högra uppåt.',
    tags: ['mote', 'landsvag'],
    similarSignIds: ['vajningsplikt-motande', 'motande-har-vajningsplikt'],
    subcategory: 'varningsmarken',
  }),
  sign({
    id: 'varning-jarnvag-bommar',
    visualTraits: { background: 'yellow', border: 'red' },
    code: 'A35',
    name: 'Varning för järnvägskorsning med bommar',
    category: 'varning',
    shortMeaning: 'Plankorsning med bommar längre fram.',
    longMeaning:
      'Bommar innebär också att omkörningsförbudet vid plankorsningen upphävs. Ljussignalen styr ändå när du får köra.',
    altText: 'Varningsmärke: gul triangel med röd ram och en bom.',
    tags: ['plankorsning'],
    similarSignIds: ['varning-jarnvag-utan-bommar'],
    subcategory: 'varningsmarken',
  }),
  sign({
    id: 'varning-jarnvag-utan-bommar',
    visualTraits: { background: 'yellow', border: 'red' },
    code: 'A36',
    name: 'Varning för järnvägskorsning utan bommar',
    category: 'varning',
    shortMeaning: 'Plankorsning utan bommar längre fram.',
    longMeaning:
      'Utan bommar finns ingen fysisk spärr. Sikten längs spåret avgör om du kan rulla över eller måste stanna, och omkörningsförbudet står kvar om inte en fullständig trafiksignal finns.',
    altText:
      'Varningsmärke: gul triangel med röd ram och ett svart ånglok sett från sidan.',
    tags: ['plankorsning'],
    similarSignIds: ['varning-jarnvag-bommar'],
    subcategory: 'varningsmarken',
  }),
  sign({
    id: 'varning-djur',
    visualTraits: { background: 'yellow', border: 'red' },
    code: 'A19',
    name: 'Varning för djur',
    category: 'varning',
    shortMeaning: 'Vilt kan korsa vägen.',
    longMeaning:
      'Störst risk i gryning och skymning. Ser du ett djur, räkna med fler — och sikta hellre bakom djuret än framför det.',
    altText: 'Varningsmärke: gul triangel med röd ram och en älg i siluett.',
    tags: ['djur', 'landsvag'],
    similarSignIds: [],
    subcategory: 'varningsmarken',
  }),

  /* ================= Väjningspliktsmärken (B) ================= */
  sign({
    id: 'vajningsplikt',
    visualTraits: { background: 'yellow', border: 'red' },
    code: 'B1',
    name: 'Väjningsplikt',
    category: 'vajningsplikt',
    shortMeaning: 'Du har väjningsplikt mot korsande trafik.',
    longMeaning:
      'Du behöver inte stanna om vägen är fri, men du ska tydligt visa din avsikt att väja genom att i god tid sänka farten. Högerregeln gäller inte här.',
    altText: 'Väjningspliktsmärke: gul triangel med röd ram och spetsen nedåt.',
    tags: ['vajningsplikt', 'korsning'],
    similarSignIds: ['stopp', 'varning-vagkorsning'],
    subcategory: 'vajningsplikt',
  }),
  sign({
    id: 'stopp',
    visualTraits: { background: 'red' },
    code: 'B2',
    name: 'Stopplikt',
    category: 'vajningsplikt',
    shortMeaning: 'Du måste stanna helt, även om vägen är fri.',
    longMeaning:
      'Stanna vid stopplinjen, eller där du har sikt om linjen saknas. Att rulla långsamt förbi är inte att stanna, oavsett hur fri vägen är.',
    altText: 'Väjningspliktsmärke: röd åttakantig skylt med texten STOP i vitt.',
    tags: ['stopplikt', 'korsning'],
    similarSignIds: ['vajningsplikt'],
    subcategory: 'stopplikt',
  }),
  sign({
    id: 'huvudled',
    visualTraits: { background: 'yellow' },
    code: 'B4',
    name: 'Huvudled',
    category: 'vajningsplikt',
    shortMeaning: 'Korsande trafik har väjningsplikt mot dig.',
    longMeaning:
      'Huvudleden gäller tills den upphör med B5 — eller tills du kör in i en cirkulationsplats, där den tar slut. Att parkera på huvudled utanför tättbebyggt område är förbjudet.',
    altText: 'Väjningspliktsmärke: gul kvadrat ställd på hörn med vit ram.',
    tags: ['huvudled', 'foretrade'],
    similarSignIds: ['huvudled-upphor', 'varning-vagkorsning'],
    subcategory: 'huvudled',
  }),
  sign({
    id: 'huvudled-upphor',
    visualTraits: { background: 'yellow', border: 'white' },
    code: 'B5',
    name: 'Huvudled upphör',
    category: 'vajningsplikt',
    shortMeaning: 'Företrädet tar slut här.',
    longMeaning:
      'Efter märket gäller högerregeln igen, om inget annat anges. Det är just här förare oftast behåller känslan av företräde för länge.',
    altText: 'Väjningspliktsmärke: gul kvadrat på hörn med vit ram och ett svart streck tvärs över.',
    tags: ['huvudled'],
    similarSignIds: ['huvudled'],
    subcategory: 'huvudled',
  }),
  sign({
    id: 'overgangsstalle-b3',
    visualTraits: { background: 'blue' },
    code: 'B3',
    name: 'Övergångsställe',
    category: 'vajningsplikt',
    shortMeaning: 'Här är ett övergångsställe.',
    longMeaning:
      'Vid ett obevakat övergångsställe har du väjningsplikt mot gående som är på eller just ska gå ut på det. Märket sitter vid platsen, till skillnad från varningsmärket A13 som är en förvarning.',
    altText: 'Blå kvadratisk skylt med en vit triangel och en gående figur.',
    tags: ['oskyddade', 'gaende'],
    similarSignIds: ['varning-overgangsstalle', 'cykeloverfart'],
    subcategory: 'oskyddade-trafikanter',
  }),
  sign({
    id: 'cykeloverfart',
    visualTraits: { background: 'blue' },
    code: 'B8',
    name: 'Cykelöverfart',
    category: 'vajningsplikt',
    shortMeaning: 'Du har väjningsplikt mot cyklande på överfarten.',
    longMeaning:
      'Märket är det som skiljer en cykelöverfart från en cykelpassage. Vid överfarten gäller full väjningsplikt mot cyklande och förare av moped klass II, och det finns dessutom en väjningslinje för biltrafiken.',
    altText: 'Blå kvadratisk skylt med en vit triangel och en cykel.',
    tags: ['cykel', 'oskyddade'],
    similarSignIds: ['overgangsstalle-b3', 'varning-cyklande'],
    subcategory: 'cykelpassage-overfart',
  }),
  sign({
    id: 'vajningsplikt-motande',
    visualTraits: { background: 'yellow', border: 'red' },
    code: 'B6',
    name: 'Väjningsplikt mot mötande trafik',
    category: 'vajningsplikt',
    shortMeaning: 'Mötande trafik kör först genom passagen.',
    longMeaning:
      'Sätts upp där vägen smalnar av så att bara ett fordon kommer fram, till exempel vid en bro eller ett avsmalnande parti.',
    altText:
      'Rund skylt med gul botten och röd ram. Till vänster en svart pil nedåt, till höger en röd pil uppåt — den röda pekar åt ditt håll.',
    tags: ['mote'],
    similarSignIds: ['motande-har-vajningsplikt'],
    subcategory: 'mote',
  }),
  sign({
    id: 'motande-har-vajningsplikt',
    visualTraits: { background: 'blue' },
    code: 'B7',
    name: 'Mötande trafik har väjningsplikt',
    category: 'vajningsplikt',
    shortMeaning: 'Du kör först genom passagen.',
    longMeaning:
      'Motsatsen till B6, och den lätta att blanda ihop med den. Det avgörande är färgen: den vita pilen är din körriktning, den röda är den som ska vänta.',
    altText:
      'Blå fyrkantig skylt. Till vänster en röd pil nedåt, till höger en vit pil uppåt — den vita pekar åt ditt håll.',
    tags: ['mote'],
    similarSignIds: ['vajningsplikt-motande'],
    subcategory: 'mote',
  }),

  /* ================= Förbudsmärken (C) ================= */
  sign({
    id: 'forbud-infart',
    visualTraits: { background: 'red' },
    code: 'C1',
    name: 'Förbud mot infart med fordon',
    category: 'forbud',
    shortMeaning: 'Du får inte köra in här.',
    longMeaning:
      'Vanligast i mynningen av en enkelriktad gata. Gående och ofta cyklister berörs inte — förbudet gäller fordonstrafik in i gatan.',
    altText: 'Rund röd skylt med ett brett vitt vågrätt streck.',
    tags: ['forbud', 'enkelriktat'],
    similarSignIds: ['forbud-trafik-fordon', 'enkelriktad'],
    subcategory: 'forbudsmarken',
  }),
  sign({
    id: 'forbud-trafik-fordon',
    visualTraits: { background: 'yellow', border: 'red' },
    code: 'C2',
    name: 'Förbud mot trafik med fordon',
    category: 'forbud',
    shortMeaning: 'All fordonstrafik är förbjuden i båda riktningarna.',
    longMeaning:
      'Skiljer sig från C1 genom att gälla åt båda hållen, inte bara infart. Tilläggstavla kan göra undantag, till exempel för behörig trafik.',
    altText: 'Rund skylt med gul botten och bred röd ram, utan symbol.',
    tags: ['forbud'],
    similarSignIds: ['forbud-infart'],
    subcategory: 'forbudsmarken',
  }),
  sign({
    id: 'forbud-omkorning',
    visualTraits: { background: 'yellow', border: 'red' },
    code: 'C27',
    name: 'Förbud mot omkörning',
    category: 'forbud',
    shortMeaning: 'Du får inte köra om andra motordrivna fordon.',
    longMeaning:
      'Förbudet gäller till nästa korsning eller tills det upphävs av C28. Tvåhjuliga fordon som cykel och moped får du fortfarande passera.',
    altText: 'Rund skylt med gul botten och röd ram, med en röd och en svart bil sedda bakifrån.',
    tags: ['omkorning'],
    similarSignIds: ['forbud-omkorning-upphor'],
    subcategory: 'omkorningsforbud',
  }),
  sign({
    id: 'forbud-omkorning-upphor',
    visualTraits: { background: 'yellow' },
    code: 'C28',
    name: 'Slut på förbud mot omkörning',
    category: 'forbud',
    shortMeaning: 'Omkörningsförbudet upphör.',
    longMeaning:
      'Att förbudet upphör betyder inte att omkörning är lämplig — sikt, mötande trafik och heldragen linje avgör fortfarande.',
    altText:
      'Rund skylt med gul botten utan röd ram, två grå bilar och svarta streck snett över — upphörandemärken saknar den röda ringen.',
    tags: ['omkorning'],
    similarSignIds: ['forbud-omkorning'],
    subcategory: 'omkorningsforbud',
  }),
  sign({
    id: 'hastighet-30',
    visualTraits: { background: 'yellow', border: 'red', numericValue: 30 },
    variant: { key: 'speed-30', numericValue: 30 },
    code: 'C31',
    name: 'Hastighetsbegränsning 30',
    category: 'forbud',
    shortMeaning: 'Högsta tillåtna hastighet är 30 km/h.',
    longMeaning:
      'Skylten anger ett tak, inte en rekommendation. Sikt, väglag och trafik kan kräva lägre fart än den skyltade.',
    altText: 'Rund skylt med gul botten, röd ram och siffran 30 i svart.',
    tags: ['hastighet'],
    similarSignIds: ['rekommenderad-hastighet-30', 'hastighet-50'],
    subcategory: 'hastighetsgranser',
  }),
  sign({
    id: 'hastighet-50',
    visualTraits: { background: 'yellow', border: 'red', numericValue: 50 },
    variant: { key: 'speed-50', numericValue: 50 },
    code: 'C31',
    name: 'Hastighetsbegränsning 50',
    category: 'forbud',
    shortMeaning: 'Högsta tillåtna hastighet är 50 km/h.',
    longMeaning:
      'Samma som bashastigheten inom tättbebyggt område. Saknas skylt gäller ändå 50 km/h där E5 satts upp.',
    altText: 'Rund skylt med gul botten, röd ram och siffran 50 i svart.',
    tags: ['hastighet'],
    similarSignIds: ['hastighet-30', 'hastighet-70'],
    subcategory: 'hastighetsgranser',
  }),
  sign({
    id: 'hastighet-70',
    visualTraits: { background: 'yellow', border: 'red', numericValue: 70 },
    variant: { key: 'speed-70', numericValue: 70 },
    code: 'C31',
    name: 'Hastighetsbegränsning 70',
    category: 'forbud',
    shortMeaning: 'Högsta tillåtna hastighet är 70 km/h.',
    longMeaning:
      'Samma som bashastigheten utanför tättbebyggt område. Med bromsad släpvagn gäller ändå taket 80 km/h, aldrig mer än skylten.',
    altText: 'Rund skylt med gul botten, röd ram och siffran 70 i svart.',
    tags: ['hastighet'],
    similarSignIds: ['hastighet-50', 'hastighet-90'],
    subcategory: 'hastighetsgranser',
  }),
  sign({
    id: 'hastighet-90',
    visualTraits: { background: 'yellow', border: 'red', numericValue: 90 },
    variant: { key: 'speed-90', numericValue: 90 },
    code: 'C31',
    name: 'Hastighetsbegränsning 90',
    category: 'forbud',
    shortMeaning: 'Högsta tillåtna hastighet är 90 km/h.',
    longMeaning:
      'Vanlig på landsväg och motortrafikled. En tung lastbil får ändå högst köra 80 km/h här, vilket är värt att veta inför en omkörning.',
    altText: 'Rund skylt med gul botten, röd ram och siffran 90 i svart.',
    tags: ['hastighet', 'landsvag'],
    similarSignIds: ['hastighet-70', 'hastighet-110'],
    subcategory: 'hastighetsgranser',
  }),
  sign({
    id: 'hastighet-110',
    visualTraits: { background: 'yellow', border: 'red', numericValue: 110 },
    variant: { key: 'speed-110', numericValue: 110 },
    code: 'C31',
    name: 'Hastighetsbegränsning 110',
    category: 'forbud',
    shortMeaning: 'Högsta tillåtna hastighet är 110 km/h.',
    longMeaning:
      'Förekommer på motorväg. Fordon med släp får inte köras fortare än 80 km/h även här.',
    altText: 'Rund skylt med gul botten, röd ram och siffran 110 i svart.',
    tags: ['hastighet', 'motorvag'],
    similarSignIds: ['hastighet-90'],
    subcategory: 'hastighetsgranser',
  }),
  sign({
    id: 'forbud-parkera',
    visualTraits: { background: 'blue', border: 'red' },
    code: 'C35',
    name: 'Förbud mot att parkera fordon',
    category: 'forbud',
    shortMeaning: 'Du får stanna, men inte parkera.',
    longMeaning:
      'Att stanna för av- och påstigning eller av- och pålastning är tillåtet. Ett streck betyder parkeringsförbud; två streck betyder att inte ens stannande är tillåtet.',
    altText: 'Rund blå skylt med röd ram och ett rött diagonalt streck.',
    tags: ['parkering'],
    similarSignIds: ['forbud-stanna'],
    subcategory: 'parkeringsforbud',
  }),
  sign({
    id: 'forbud-stanna',
    visualTraits: { background: 'blue', border: 'red' },
    code: 'C39',
    name: 'Förbud mot att stanna och parkera fordon',
    category: 'forbud',
    shortMeaning: 'Du får varken stanna eller parkera.',
    longMeaning:
      'Det starkare av de två förbuden. Du får bara stanna för att undvika fara eller för att trafiken kräver det — inte för att släppa av en passagerare.',
    altText: 'Rund blå skylt med röd ram och två röda diagonala streck som bildar ett kryss.',
    tags: ['parkering'],
    similarSignIds: ['forbud-parkera'],
    subcategory: 'stannande-forbud',
  }),

  /* ================= Påbudsmärken (D) ================= */
  sign({
    id: 'pabud-rakt',
    visualTraits: { background: 'blue', arrowDirection: 'up' },
    variant: { key: 'direction-up', arrowDirection: 'up' },
    code: 'D1',
    name: 'Påbjuden körriktning, rakt fram',
    category: 'pabud',
    shortMeaning: 'Du måste köra i pilens riktning.',
    longMeaning:
      'Ett påbud, inte ett förslag. Blå rund skylt med vit symbol betyder alltid "så här ska du göra", till skillnad från förbudsmärkenas röda ram.',
    altText: 'Rund blå skylt med en vit pil rakt uppåt.',
    tags: ['pabud'],
    similarSignIds: ['pabud-hoger', 'enkelriktad'],
    subcategory: 'pabudsmarken',
  }),
  sign({
    id: 'pabud-hoger',
    visualTraits: { background: 'blue', arrowDirection: 'right' },
    variant: { key: 'direction-right', arrowDirection: 'right' },
    code: 'D1',
    name: 'Påbjuden körriktning, höger',
    category: 'pabud',
    shortMeaning: 'Du måste svänga höger.',
    longMeaning:
      'Samma påbudsmärke som D1 rakt fram, med pilen vriden. Vanlig där en gata är enkelriktad åt andra hållet.',
    altText: 'Rund blå skylt med en vit pil åt höger.',
    tags: ['pabud'],
    similarSignIds: ['pabud-rakt'],
    subcategory: 'pabudsmarken',
  }),
  sign({
    id: 'cirkulationsplats',
    visualTraits: { background: 'blue' },
    code: 'D3',
    name: 'Cirkulationsplats',
    category: 'pabud',
    shortMeaning: 'Här är en cirkulationsplats — kör moturs.',
    longMeaning:
      'Märket är det som gör platsen till en cirkulationsplats. Saknas det är en rund korsning en helt vanlig korsning, där högerregeln gäller.',
    altText: 'Rund blå skylt med tre vita pilar som bildar en ring moturs.',
    tags: ['cirkulation'],
    similarSignIds: ['varning-cirkulationsplats'],
    subcategory: 'cirkulationsplats',
  }),
  sign({
    id: 'pabud-cykelbana',
    visualTraits: { background: 'blue' },
    code: 'D4',
    name: 'Påbjuden cykelbana',
    category: 'pabud',
    shortMeaning: 'Banan är avsedd för cykeltrafik.',
    longMeaning:
      'Andra förare får bara korsa cykelbanan, och har då väjningsplikt mot cyklisterna på den.',
    altText: 'Rund blå skylt med en vit cykel.',
    tags: ['cykel'],
    similarSignIds: ['pabud-gang-cykelbana', 'varning-cyklande'],
    subcategory: 'pabudsmarken',
  }),
  sign({
    id: 'pabud-gangbana',
    visualTraits: { background: 'blue' },
    code: 'D5',
    name: 'Påbjuden gångbana',
    category: 'pabud',
    shortMeaning: 'Banan är avsedd för gående.',
    longMeaning:
      'Fordonsförare får endast korsa gångbanan, och har väjningsplikt mot gående på den — typiskt vid in- och utfart från en fastighet.',
    altText: 'Rund blå skylt med en vit gående figur.',
    tags: ['gaende'],
    similarSignIds: ['pabud-gang-cykelbana', 'gagata'],
    subcategory: 'pabudsmarken',
  }),
  sign({
    id: 'pabud-gang-cykelbana',
    visualTraits: { background: 'blue' },
    code: 'D7',
    name: 'Påbjudna gång- och cykelbanor',
    category: 'pabud',
    shortMeaning: 'Delad bana med skild yta för gående och cyklister.',
    longMeaning:
      'Den lodräta linjen visar att ytorna är åtskilda. Utan linje delar de samma yta.',
    altText: 'Rund blå skylt delad av en lodrät linje, med en gående figur på ena sidan och en cykel på den andra.',
    tags: ['cykel', 'gaende'],
    similarSignIds: ['pabud-cykelbana', 'pabud-gangbana'],
    subcategory: 'pabudsmarken',
  }),
  sign({
    id: 'pabud-kollektivkorfalt',
    visualTraits: { background: 'blue' },
    code: 'D10',
    name: 'Påbjudet körfält för fordon i linjetrafik',
    category: 'pabud',
    shortMeaning: 'Kollektivkörfält — bussfil.',
    longMeaning:
      'Du får korsa körfältet, till exempel för att svänga, men inte köra i det. Cykel och moped klass II får använda det när det ligger till höger i färdriktningen.',
    altText: 'Rund blå skylt med en vit buss sedd framifrån.',
    tags: ['korfalt', 'buss'],
    similarSignIds: [],
    subcategory: 'korfaltsbyte',
  }),

  /* ================= Anvisningsmärken (E) ================= */
  sign({
    id: 'motorvag',
    visualTraits: { background: 'green' },
    code: 'E1',
    name: 'Motorväg',
    category: 'anvisning',
    shortMeaning: 'Motorvägens regler börjar gälla här.',
    longMeaning:
      'Endast motordrivna fordon som får köra minst 40 km/h. Förbjudet att stanna, backa, vända eller gå på vägbanan. Bashastigheten är 110 km/h om inget annat anges.',
    altText:
      'Grön rektangulär skylt med en vit symbol: en bro över två åtskilda körbanor.',
    tags: ['motorvag'],
    similarSignIds: ['motortrafikled', 'motorvag-upphor'],
    subcategory: 'motorvag-regler',
  }),
  sign({
    id: 'motorvag-upphor',
    visualTraits: { background: 'green' },
    code: 'E2',
    name: 'Motorväg upphör',
    category: 'anvisning',
    shortMeaning: 'Motorvägens regler slutar gälla.',
    longMeaning:
      'Efter märket kan du möta korsande trafik, gående och betydligt lägre hastigheter. Sänk farten i god tid — fartblindhet efter en lång motorvägssträcka är verklig.',
    altText:
      'Grön rektangulär skylt med motorvägssymbolen och ett rött streck snett över.',
    tags: ['motorvag'],
    similarSignIds: ['motorvag'],
    subcategory: 'motorvag-regler',
  }),
  sign({
    id: 'motortrafikled',
    visualTraits: { background: 'green' },
    code: 'E3',
    name: 'Motortrafikled',
    category: 'anvisning',
    shortMeaning: 'Motortrafikledens regler börjar gälla här.',
    longMeaning:
      'Liknar motorväg men har ofta bara ett körfält i vardera riktningen och kan ha mötande trafik. Bashastigheten är inte 110 km/h — läs skyltarna.',
    altText: 'Grön rektangulär skylt med en vit bil sedd framifrån.',
    tags: ['motortrafikled'],
    similarSignIds: ['motorvag'],
    subcategory: 'motortrafikled',
  }),
  sign({
    id: 'tattbebyggt-omrade',
    visualTraits: { background: 'white', border: 'black' },
    code: 'E5',
    name: 'Tättbebyggt område',
    category: 'anvisning',
    shortMeaning: 'Bashastigheten 50 km/h och tätortens regler gäller.',
    longMeaning:
      'Märket kompletteras alltid med en hastighetsangivelse. Sitter ett förbudsmärke tillsammans med det gäller förbudet i hela området fram till slutmärket E6.',
    altText:
      'Vit rektangulär skylt med svart ram och en svart stadssiluett av hus och ett kyrktorn.',
    tags: ['tatort', 'hastighet'],
    similarSignIds: ['gagata', 'gangfartsomrade'],
    subcategory: 'hastighetsgranser',
  }),
  sign({
    id: 'gagata',
    visualTraits: { background: 'blue' },
    code: 'E7',
    name: 'Gågata',
    category: 'anvisning',
    shortMeaning: 'Gata avsedd för gående — motortrafik bara undantagsvis.',
    longMeaning:
      'Du får köra endast för vissa ändamål, till exempel varutransport eller till en fastighet vid gatan. Gångfart gäller och du har väjningsplikt mot gående.',
    altText: 'Blå rektangulär skylt med vita gående figurer.',
    tags: ['gagata', 'tatort'],
    similarSignIds: ['gangfartsomrade', 'pabud-gangbana'],
    subcategory: 'anvisningsmarken',
  }),
  sign({
    id: 'gangfartsomrade',
    visualTraits: { background: 'blue' },
    code: 'E9',
    name: 'Gångfartsområde',
    category: 'anvisning',
    shortMeaning: 'Gångfart, väjningsplikt mot gående, parkering bara på anvisade platser.',
    longMeaning:
      'Till skillnad från gågatan är motortrafik tillåten här — men på de gåendes villkor. När du kör ut från området har du väjningsplikt.',
    altText: 'Blå rektangulär skylt med gående figurer och en bil.',
    tags: ['gangfart', 'tatort'],
    similarSignIds: ['gagata', 'tattbebyggt-omrade'],
    subcategory: 'anvisningsmarken',
  }),
  sign({
    id: 'rekommenderad-hastighet-30',
    visualTraits: { background: 'blue' },
    code: 'E11',
    name: 'Rekommenderad lägre hastighet',
    category: 'anvisning',
    shortMeaning: 'En rekommendation, inte en gräns.',
    longMeaning:
      'Blå skylt betyder anvisning, inte förbud. Den skyltade hastighetsbegränsningen gäller fortfarande — men platsen är byggd eller trafikerad så att den lägre farten är lämplig.',
    altText: 'Blå fyrkantig skylt med texten max 30 km/tim i vitt.',
    tags: ['hastighet'],
    similarSignIds: ['hastighet-30'],
    subcategory: 'anvisningsmarken',
  }),
  sign({
    id: 'enkelriktad',
    visualTraits: { background: 'blue' },
    code: 'E16',
    name: 'Enkelriktad trafik',
    category: 'anvisning',
    shortMeaning: 'Trafiken går bara åt ett håll.',
    longMeaning:
      'På enkelriktad gata finns ingen mötande trafik, så vid vänstersväng placerar du dig nära körbanans vänsterkant — inte bara nära ditt eget körfälts kant.',
    altText: 'Blå rektangulär skylt med en vit pil åt höger.',
    tags: ['enkelriktat'],
    similarSignIds: ['forbud-infart', 'pabud-rakt'],
    subcategory: 'anvisningsmarken',
  }),
  sign({
    id: 'parkering',
    visualTraits: { background: 'blue' },
    code: 'E19',
    name: 'Parkering',
    category: 'anvisning',
    shortMeaning: 'Här får du parkera.',
    longMeaning:
      'Skylten säger sällan allt själv. Tilläggstavlorna under den avgör när, hur länge och för vem parkeringen gäller.',
    altText: 'Blå rektangulär skylt med ett vitt P.',
    tags: ['parkering'],
    similarSignIds: ['forbud-parkera'],
    subcategory: 'parkeringsregler',
  }),

  /* ================= Tilläggstavlor (T) ================= */
  sign({
    id: 'tavla-tid',
    visualTraits: { background: 'white', border: 'black', text: '8–18' },
    variant: { key: 'time-weekday' },
    plate: {
      kind: 'time',
      combinedPhrase: 'gäller under den angivna tiden',
    },
    code: 'T6',
    name: 'Tidsangivelse, vardag',
    category: 'tillaggstavla',
    shortMeaning: 'Svarta siffror utan parentes gäller vardagar utom dag före helgdag.',
    longMeaning:
      'Tidsangivelsen begränsar huvudmärket till de angivna timmarna. Utanför dem gäller huvudmärket inte.',
    altText: 'Vit rektangulär tilläggstavla med svarta siffror, till exempel 8–18.',
    tags: ['tillaggstavla', 'parkering'],
    similarSignIds: ['tavla-tid-lordag', 'tavla-tid-helgdag'],
    subcategory: 'parkeringsregler',
  }),
  sign({
    id: 'tavla-tid-lordag',
    visualTraits: { background: 'white', border: 'black', text: '(8–14)' },
    variant: { key: 'time-saturday' },
    plate: {
      kind: 'time',
      combinedPhrase: 'gäller lördagar under angiven tid',
    },
    code: 'T6',
    name: 'Tidsangivelse, lördag',
    category: 'tillaggstavla',
    shortMeaning: 'Siffror inom parentes gäller lördag och dag före helgdag.',
    longMeaning:
      'Parentesen är hela skillnaden. Den är lätt att läsa förbi, och den är ofta det som avgör om du får parkera just den dagen.',
    altText: 'Vit rektangulär tilläggstavla med svarta siffror inom parentes, till exempel (8–14).',
    tags: ['tillaggstavla', 'parkering'],
    similarSignIds: ['tavla-tid', 'tavla-tid-helgdag'],
    subcategory: 'parkeringsregler',
  }),
  sign({
    id: 'tavla-tid-helgdag',
    visualTraits: { background: 'white', border: 'black', text: '9–13' },
    variant: { key: 'time-sunday' },
    plate: {
      kind: 'time',
      combinedPhrase: 'gäller söndagar och helgdagar under angiven tid',
    },
    code: 'T6',
    name: 'Tidsangivelse, sön- och helgdag',
    category: 'tillaggstavla',
    shortMeaning: 'Röda siffror gäller sön- och helgdagar.',
    longMeaning:
      'Färgen bär informationen: svart för vardag, parentes för lördag, rött för sön- och helgdag.',
    altText: 'Vit rektangulär tilläggstavla med röda siffror, till exempel 9–13.',
    tags: ['tillaggstavla', 'parkering'],
    similarSignIds: ['tavla-tid', 'tavla-tid-lordag'],
    subcategory: 'parkeringsregler',
  }),
  sign({
    id: 'tavla-avstand',
    visualTraits: { background: 'white' },
    plate: {
      kind: 'distance',
      printedText: '100 m',
      combinedPhrase: 'märket gäller 100 m längre fram',
    },
    code: 'T2',
    name: 'Avstånd',
    category: 'tillaggstavla',
    shortMeaning: 'Avståndet fram till det som huvudmärket gäller.',
    longMeaning:
      'Tavlan säger var regeln börjar, inte hur långt den sträcker sig. För det används T11 utsträckning.',
    altText: 'Vit rektangulär tilläggstavla med svart ram och ett avstånd i meter, här 100 m.',
    tags: ['tillaggstavla'],
    similarSignIds: ['tavla-utstrackning'],
    subcategory: 'anvisningsmarken',
  }),
  sign({
    id: 'tavla-utstrackning',
    visualTraits: { background: 'white' },
    plate: {
      kind: 'extent',
      combinedPhrase: 'märket gäller på hela den utmärkta sträckan',
    },
    code: 'T11',
    name: 'Utsträckning',
    category: 'tillaggstavla',
    shortMeaning: 'Hur lång sträcka huvudmärket gäller.',
    longMeaning:
      'Skiljer sig från T2 avstånd: utsträckningen börjar vid märket och gäller den angivna längden framåt.',
    altText: 'Vit rektangulär tilläggstavla med svart ram och en dubbelriktad pil som pekar åt både vänster och höger.',
    tags: ['tillaggstavla'],
    similarSignIds: ['tavla-avstand', 'tavla-riktning'],
    subcategory: 'anvisningsmarken',
  }),
  sign({
    id: 'tavla-riktning',
    visualTraits: { background: 'white' },
    plate: {
      kind: 'direction',
      combinedPhrase: 'märket gäller i pilens riktning',
    },
    code: 'T12',
    name: 'Riktning',
    category: 'tillaggstavla',
    shortMeaning: 'Åt vilket håll huvudmärket gäller.',
    longMeaning:
      'Vanlig under parkeringsmärken: pilen visar om platserna ligger framför eller bakom skylten.',
    altText: 'Vit rektangulär tilläggstavla med svart ram och en bred svart pil som böjer av åt höger.',
    tags: ['tillaggstavla', 'parkering'],
    similarSignIds: ['tavla-utstrackning'],
    subcategory: 'parkeringsregler',
  }),
  sign({
    id: 'tavla-boende',
    visualTraits: { background: 'blue' },
    plate: {
      kind: 'condition',
      printedText: 'Boende',
      combinedPhrase: 'gäller endast boende med tillstånd',
    },
    code: 'T19',
    name: 'Boende',
    category: 'tillaggstavla',
    shortMeaning: 'Gäller den som har boendetillstånd i området.',
    longMeaning:
      'Tavlan inskränker huvudmärket till en viss grupp. Har du inte tillståndet gäller inte parkeringsrätten dig.',
    altText: 'Blå rektangulär tilläggstavla med texten Boende i vitt.',
    tags: ['tillaggstavla', 'parkering'],
    similarSignIds: ['tavla-avgift'],
    subcategory: 'parkeringsregler',
  }),
  sign({
    id: 'tavla-avgift',
    visualTraits: { background: 'blue' },
    plate: {
      kind: 'condition',
      printedText: 'Avgift',
      combinedPhrase: 'parkeringen är avgiftsbelagd',
    },
    code: 'T16',
    name: 'Avgift',
    category: 'tillaggstavla',
    shortMeaning: 'Parkeringen är avgiftsbelagd.',
    longMeaning:
      'Ofta kombinerad med en tidsangivelse som säger när avgiften tas ut. Utanför de tiderna kan parkeringen vara gratis men fortfarande tidsbegränsad.',
    altText: 'Blå rektangulär tilläggstavla med texten Avgift i vitt.',
    tags: ['tillaggstavla', 'parkering'],
    similarSignIds: ['tavla-boende', 'tavla-tid'],
    subcategory: 'parkeringsregler',
  }),
  sign({
    id: 'tavla-flervagsstopp',
    visualTraits: { background: 'red' },
    plate: {
      kind: 'information',
      printedText: 'Flervägs-stopp',
      combinedPhrase: 'alla tillfarter i korsningen har stopplikt',
    },
    code: 'T14',
    name: 'Flervägsstopp',
    category: 'tillaggstavla',
    shortMeaning: 'Alla tillfarter till korsningen har stopplikt.',
    longMeaning:
      'Tavlan säger inte att du slipper stanna — den säger att de andra också ska stanna. Ordningen avgörs sedan av högerregeln mellan dem som stannat.',
    altText: 'Röd rektangulär tilläggstavla med texten Flervägs-stopp i vitt.',
    tags: ['tillaggstavla', 'stopplikt'],
    similarSignIds: ['stopp'],
    subcategory: 'stopplikt',
  }),
  sign({
    id: 'tavla-nedsatt-syn',
    visualTraits: { background: 'yellow', border: 'red' },
    plate: {
      kind: 'information',
      combinedPhrase: 'personer med nedsatt syn rör sig i området',
    },
    code: 'T9',
    name: 'Nedsatt syn',
    category: 'tillaggstavla',
    shortMeaning: 'Personer med nedsatt syn är vanliga här.',
    longMeaning:
      'Tavlan har alltid gul bottenfärg. Räkna med att den gående inte kan se din bil, och var försiktig med ljud när du väntar.',
    altText: 'Gul rektangulär tilläggstavla med röd ram och fem svarta punkter i rad.',
    tags: ['tillaggstavla', 'oskyddade'],
    similarSignIds: ['overgangsstalle-b3'],
    subcategory: 'nedsatt-formaga',
  }),

  /* ---- Omgång 2: fler varningsmärken ur källan ---- */
  sign({
    id: 'varning-nedforslutning',
    code: 'A3',
    name: 'Varning för nedförslutning',
    category: 'varning',
    shortMeaning: 'Brant nedförsbacke, med lutningen angiven i procent.',
    longMeaning:
      'Växla ner före backen i stället för att bromsa hela vägen ner. Håller du farten med motorbromsen slipper du bromsar som blir varma och tappar verkan.',
    altText: 'Varningsmärke: gul triangel med röd ram och en svart backe som lutar nedåt med lutningen 10 % angiven.',
    visualTraits: { background: 'yellow', border: 'red', text: '10%' },
    tags: ['backe', 'landsvag'],
    similarSignIds: ['varning-stigning'],
    subcategory: 'varningsmarken',
  }),
  sign({
    id: 'varning-stigning',
    code: 'A4',
    name: 'Varning för stigning',
    category: 'varning',
    shortMeaning: 'Brant uppförsbacke, med lutningen angiven i procent.',
    longMeaning:
      'Räkna med långsamma tunga fordon och med att din egen fart sjunker. Lägg om till lägre växel innan farten redan gått förlorad.',
    altText: 'Varningsmärke: gul triangel med röd ram och en svart backe som lutar uppåt med lutningen 10 % angiven.',
    visualTraits: { background: 'yellow', border: 'red', text: '10%' },
    tags: ['backe', 'landsvag'],
    similarSignIds: ['varning-nedforslutning'],
    subcategory: 'varningsmarken',
  }),
  sign({
    id: 'varning-avsmalnande-vag',
    code: 'A5',
    name: 'Varning för avsmalnande väg',
    category: 'varning',
    shortMeaning: 'Vägen blir smalare längre fram.',
    longMeaning:
      'Två fordon får inte längre plats bredvid varandra på samma sätt. Titta efter mötande innan avsmalningen och var beredd att lämna företräde.',
    altText: 'Varningsmärke: gul triangel med röd ram och två svarta kanter som buktar in mot varandra.',
    visualTraits: { background: 'yellow', border: 'red' },
    tags: ['mote', 'landsvag'],
    similarSignIds: ['vajningsplikt-motande'],
    subcategory: 'varningsmarken',
  }),
  sign({
    id: 'varning-ojamn-vag',
    code: 'A8',
    name: 'Varning för ojämn väg',
    category: 'varning',
    shortMeaning: 'Ojämn vägbana — gropar, spår eller ojämna skarvar.',
    longMeaning:
      'Sänk farten. Ojämnheter gör att däcken tidvis lättar från vägbanan, och ett hjul som är i luften varken styr eller bromsar.',
    altText: 'Varningsmärke: gul triangel med röd ram och en svart vågig linje som visar en ojämn vägbana.',
    visualTraits: { background: 'yellow', border: 'red' },
    tags: ['vaglag'],
    similarSignIds: ['varning-farthinder'],
    subcategory: 'varningsmarken',
  }),
  sign({
    id: 'varning-farthinder',
    code: 'A9',
    name: 'Varning för farthinder',
    category: 'varning',
    shortMeaning: 'Ett farthinder i vägbanan, till exempel ett gupp.',
    longMeaning:
      'Sänk farten före hindret. Farthinder sitter oftast där gående och cyklister korsar, så det är sällan bara komforten som är skälet.',
    altText: 'Varningsmärke: gul triangel med röd ram och ett svart gupp i vägbanan sett från sidan.',
    visualTraits: { background: 'yellow', border: 'red' },
    tags: ['tatort'],
    similarSignIds: ['varning-ojamn-vag'],
    subcategory: 'varningsmarken',
  }),
  sign({
    id: 'varning-stenskott',
    code: 'A11',
    name: 'Varning för stenskott',
    category: 'varning',
    shortMeaning: 'Löst grus som kan slungas upp av fordon.',
    longMeaning:
      'Öka avståndet till fordonet framför. Grus från ett däck i hög fart spräcker rutor, och löst grus ger dessutom sämre grepp vid inbromsning.',
    altText: 'Varningsmärke: gul triangel med röd ram och en bil med grus som slungas upp bakom hjulen.',
    visualTraits: { background: 'yellow', border: 'red' },
    tags: ['grus', 'avstand'],
    similarSignIds: ['varning-stenras'],
    subcategory: 'varningsmarken',
  }),
  sign({
    id: 'varning-stenras',
    code: 'A12',
    name: 'Varning för stenras',
    category: 'varning',
    shortMeaning: 'Sten kan falla ned på vägen från en slänt.',
    longMeaning:
      'Titta efter sten som redan ligger i vägbanan, särskilt efter regn och tjällossning. Stanna inte under släntens branta parti.',
    altText: 'Varningsmärke: gul triangel med röd ram och stenar som faller ned från en brant slänt.',
    visualTraits: { background: 'yellow', border: 'red' },
    tags: ['landsvag'],
    similarSignIds: ['varning-stenskott'],
    subcategory: 'varningsmarken',
  }),
  sign({
    id: 'varning-gaende',
    code: 'A14',
    name: 'Varning för gående',
    category: 'varning',
    shortMeaning: 'Gående kan finnas i eller vid körbanan.',
    longMeaning:
      'Skillnaden mot märket för övergångsställe är att här finns ingen utmärkt plats där de korsar — de kan komma var som helst längs sträckan.',
    altText: 'Varningsmärke: gul triangel med röd ram och en vuxen och ett barn som går.',
    visualTraits: { background: 'yellow', border: 'red' },
    tags: ['oskyddade'],
    similarSignIds: ['varning-overgangsstalle', 'varning-barn'],
    subcategory: 'oskyddade-trafikanter',
  }),
  sign({
    id: 'varning-ridande',
    code: 'A18',
    name: 'Varning för ridande',
    category: 'varning',
    shortMeaning: 'Hästar och ryttare kan finnas på vägen.',
    longMeaning:
      'Passera långsamt och med stort sidoavstånd, och undvik att gasa eller tuta i närheten. En häst som blir skrämd rör sig i sidled utan förvarning.',
    altText: 'Varningsmärke: gul triangel med röd ram och en häst med ryttare.',
    visualTraits: { background: 'yellow', border: 'red' },
    tags: ['djur', 'landsvag'],
    similarSignIds: ['varning-djur'],
    subcategory: 'varningsmarken',
  }),
  sign({
    id: 'varning-flerfargssignal',
    code: 'A22',
    name: 'Varning för flerfärgssignal',
    category: 'varning',
    shortMeaning: 'En trafiksignal längre fram som är svår att upptäcka i tid.',
    longMeaning:
      'Sätts där signalen kommer oväntat — efter ett krön, i en kurva eller på en sträcka med hög hastighet. Var beredd på att den kan slå om.',
    altText: 'Varningsmärke: gul triangel med röd ram och en trafiksignal med rött, gult och grönt ljus.',
    visualTraits: { background: 'yellow', border: 'red' },
    tags: ['signal'],
    similarSignIds: ['varning-vagkorsning'],
    subcategory: 'varningsmarken',
  }),
  sign({
    id: 'varning-sidvind',
    code: 'A24',
    name: 'Varning för sidvind',
    category: 'varning',
    shortMeaning: 'Kraftig vind i sidled på en utsatt sträcka.',
    longMeaning:
      'Håll stadigt i ratten och sänk farten, särskilt på broar och när du kör om eller möter ett stort fordon — vinden försvinner och återkommer plötsligt i lä bakom det.',
    altText: 'Varningsmärke: gul triangel med röd ram och en vindstrut som blåser åt sidan.',
    visualTraits: { background: 'yellow', border: 'red' },
    tags: ['vader', 'bro'],
    similarSignIds: [],
    subcategory: 'varningsmarken',
  }),
  sign({
    id: 'varning-vajningsplikt-korsning',
    code: 'A29',
    name: 'Varning för vägkorsning där anslutande väg har väjningsplikt',
    category: 'varning',
    shortMeaning: 'En korsning där de som kommer från sidan ska väja för dig.',
    longMeaning:
      'Märket säger att du har företräde — inte att du kan sluta titta. Det sitter ofta just där sikten är dålig, och den som ska väja hinner inte alltid se dig.',
    altText: 'Varningsmärke: gul triangel med röd ram och ett svart kors där den lodräta linjen är bredare än den vågräta.',
    visualTraits: { background: 'yellow', border: 'red' },
    tags: ['korsning', 'vajningsplikt'],
    similarSignIds: ['varning-vagkorsning', 'huvudled'],
    subcategory: 'vajningsplikt',
  }),
  sign({
    id: 'varning-ko',
    code: 'A34',
    name: 'Varning för kö',
    category: 'varning',
    shortMeaning: 'Köbildning kan förekomma på sträckan.',
    longMeaning:
      'Öka avståndet framåt och titta långt fram. Upphinnandeolyckor i kö sker nästan alltid för att någon upptäckte den stillastående kön för sent.',
    altText: 'Varningsmärke: gul triangel med röd ram och tre bilar tätt bakom varandra.',
    visualTraits: { background: 'yellow', border: 'red' },
    tags: ['avstand', 'motorvag'],
    similarSignIds: [],
    subcategory: 'varningsmarken',
  }),
  sign({
    id: 'varning-annan-fara',
    code: 'A40',
    name: 'Varning för annan fara',
    category: 'varning',
    shortMeaning: 'En fara som inget annat varningsmärke täcker.',
    longMeaning:
      'Vad faran är framgår nästan alltid av en tilläggstavla under märket. Utan tavla betyder det bara att något ovanligt finns längre fram.',
    altText: 'Varningsmärke: gul triangel med röd ram och ett brett svart utropstecken utan punkt.',
    visualTraits: { background: 'yellow', border: 'red' },
    tags: ['tillaggstavla'],
    similarSignIds: [],
    subcategory: 'varningsmarken',
  }),

  /* ---- Omgång 2: fler förbudsmärken ---- */
  sign({
    id: 'forbud-motordrivet',
    code: 'C3',
    name: 'Förbud mot trafik med annat motordrivet fordon än moped klass II',
    category: 'forbud',
    shortMeaning: 'Bilar och motorcyklar får inte köra in. Moped klass II får.',
    longMeaning:
      'Det breda förbudet mot motortrafik. Cykel och moped klass II omfattas inte, vilket är hela poängen med formuleringen.',
    altText: 'Rund skylt med gul botten och bred röd ram, en bil och en motorcykel överstrukna med ett rött streck.',
    visualTraits: { background: 'yellow', border: 'red' },
    tags: ['forbud'],
    similarSignIds: ['forbud-trafik-fordon', 'forbud-infart'],
    subcategory: 'forbudsmarken',
  }),
  sign({
    id: 'forbud-slap',
    code: 'C6',
    name: 'Förbud mot trafik med motordrivet fordon med tillkopplad släpvagn',
    category: 'forbud',
    shortMeaning: 'Fordon med släp får inte köra in.',
    longMeaning:
      'Sitter där ett ekipage inte får plats eller inte kan vända. Gäller oavsett hur litet släpet är.',
    altText: 'Rund skylt med gul botten och bred röd ram, en bil med tillkopplat släp, överstrukna med ett rött streck.',
    visualTraits: { background: 'yellow', border: 'red' },
    tags: ['slap', 'forbud'],
    similarSignIds: ['forbud-tung-lastbil'],
    subcategory: 'forbudsmarken',
  }),
  sign({
    id: 'forbud-tung-lastbil',
    code: 'C7',
    name: 'Förbud mot trafik med tung lastbil',
    category: 'forbud',
    shortMeaning: 'Tung lastbil får inte köra in.',
    longMeaning:
      'Gäller lastbil över 3,5 ton totalvikt. Personbil och lätt lastbil berörs inte.',
    altText: 'Rund skylt med gul botten och bred röd ram, en lastbil sedd från sidan, överstruken med ett rött streck.',
    visualTraits: { background: 'yellow', border: 'red' },
    tags: ['forbud', 'tung-trafik'],
    similarSignIds: ['forbud-slap', 'forbud-omkorning-lastbil'],
    subcategory: 'forbudsmarken',
  }),
  sign({
    id: 'forbud-farligt-gods',
    code: 'C9',
    name: 'Förbud mot trafik med fordon lastat med farligt gods',
    category: 'forbud',
    shortMeaning: 'Fordon med farligt gods får inte köra in.',
    longMeaning:
      'Sitter typiskt före tunnlar, vattentäkter och tät bebyggelse. Berör dig som B-förare bara om du kör sådant gods.',
    altText: 'Rund skylt med gul botten och bred röd ram, en lastbil med en orange skylt, överstruken med ett rött streck.',
    visualTraits: { background: 'yellow', border: 'red' },
    tags: ['farligt-gods'],
    similarSignIds: ['forbud-tung-lastbil'],
    subcategory: 'forbudsmarken',
  }),
  sign({
    id: 'forbud-bredd',
    code: 'C16',
    name: 'Begränsad fordonsbredd',
    category: 'forbud',
    shortMeaning: 'Fordon bredare än angivet mått får inte passera.',
    longMeaning:
      'Måttet gäller fordonet med last. Det är lasten som oftast fäller ett ekipage här, inte bilen.',
    altText: 'Rund skylt med gul botten och bred röd ram, måttet 2,2 m mellan två svarta pilspetsar som pekar mot varandra.',
    visualTraits: { background: 'yellow', border: 'red', text: '2,2 m' },
    tags: ['matt', 'last'],
    similarSignIds: ['forbud-hojd', 'forbud-langd'],
    subcategory: 'forbudsmarken',
  }),
  sign({
    id: 'forbud-hojd',
    code: 'C17',
    name: 'Begränsad fordonshöjd',
    category: 'forbud',
    shortMeaning: 'Fordon högre än angivet mått får inte passera.',
    longMeaning:
      'Sitter före broar, portar och tunnlar. Måttet gäller fordonet med last, och det är takräcket eller lasten som fastnar.',
    altText: 'Rund skylt med gul botten och bred röd ram, måttet 3,5 m mellan en pilspets uppåt och en nedåt.',
    visualTraits: { background: 'yellow', border: 'red', text: '3,5 m' },
    tags: ['matt', 'last'],
    similarSignIds: ['forbud-bredd', 'forbud-langd'],
    subcategory: 'forbudsmarken',
  }),
  sign({
    id: 'forbud-langd',
    code: 'C18',
    name: 'Begränsad fordonslängd',
    category: 'forbud',
    shortMeaning: 'Fordon eller fordonståg längre än angivet mått får inte passera.',
    longMeaning:
      'Räknas på hela ekipaget, alltså bil plus släp plus utskjutande last.',
    altText: 'Rund skylt med gul botten och bred röd ram, en lastbil med måttet 20 m under sig, mellan två pilar.',
    visualTraits: { background: 'yellow', border: 'red', text: '20 m' },
    tags: ['matt', 'slap'],
    similarSignIds: ['forbud-bredd', 'forbud-hojd'],
    subcategory: 'forbudsmarken',
  }),
  sign({
    id: 'forbud-bruttovikt',
    code: 'C20',
    name: 'Begränsad bruttovikt på fordon',
    category: 'forbud',
    shortMeaning: 'Fordon som väger mer än angivet får inte passera.',
    longMeaning:
      'Bruttovikt är fordonets verkliga vikt just nu, alltså tjänstevikt plus last och passagerare — inte vad det får väga enligt registreringsbeviset.',
    altText: 'Rund skylt med gul botten och bred röd ram, texten 12 t i svart.',
    visualTraits: { background: 'yellow', border: 'red', text: '12 t', numericValue: 12 },
    tags: ['vikt', 'bro'],
    similarSignIds: ['forbud-langd'],
    subcategory: 'forbudsmarken',
  }),
  sign({
    id: 'forbud-svang',
    code: 'C25',
    name: 'Förbud mot sväng i korsning',
    category: 'forbud',
    shortMeaning: 'Du får inte svänga åt det håll pilen visar.',
    longMeaning:
      'Gäller den korsning märket står vid. En tilläggstavla kan begränsa förbudet till vissa tider eller fordonsslag.',
    altText: 'Rund skylt med gul botten och bred röd ram, en svart pil som böjer av åt vänster, överstruken med ett rött streck.',
    visualTraits: { background: 'yellow', border: 'red', arrowDirection: 'left' },
    tags: ['korsning', 'sväng'],
    similarSignIds: ['forbud-u-svang'],
    subcategory: 'forbudsmarken',
  }),
  sign({
    id: 'forbud-u-svang',
    code: 'C26',
    name: 'Förbud mot U-sväng',
    category: 'forbud',
    shortMeaning: 'Du får inte vända och köra tillbaka.',
    longMeaning:
      'Gäller från märket till nästa korsning. Sitter där en vändning skulle blockera körfältet eller ske i skymd sikt.',
    altText: 'Rund skylt med gul botten och bred röd ram, en svart pil som vänder tillbaka i en U-form, överstruken med ett rött streck.',
    visualTraits: { background: 'yellow', border: 'red' },
    tags: ['sväng'],
    similarSignIds: ['forbud-svang'],
    subcategory: 'forbudsmarken',
  }),
  sign({
    id: 'forbud-omkorning-lastbil',
    code: 'C29',
    name: 'Förbud mot omkörning med tung lastbil',
    category: 'forbud',
    shortMeaning: 'Tung lastbil får inte köra om andra motordrivna fordon.',
    longMeaning:
      'Berör inte dig som kör personbil — du får fortfarande köra om. Märket finns för att en omkörande lastbil blockerar vägen mycket länge.',
    altText: 'Rund skylt med gul botten och bred röd ram, en röd lastbil bredvid en grå bil, överstrukna med ett rött streck.',
    visualTraits: { background: 'yellow', border: 'red' },
    tags: ['omkorning', 'tung-trafik'],
    similarSignIds: ['forbud-omkorning', 'forbud-tung-lastbil'],
    subcategory: 'omkorningsforbud',
  }),
  sign({
    id: 'vandplats',
    code: 'C42',
    name: 'Vändplats',
    category: 'forbud',
    shortMeaning: 'Platsen får bara användas för att vända.',
    longMeaning:
      'Att stanna eller parkera här är förbjudet — hela ytan behövs för att någon annan ska kunna vända.',
    altText:
      'Gul rektangulär skylt med röd ram, texten Vändplats och under den symbolen för förbud att parkera.',
    visualTraits: { background: 'yellow', border: 'red', text: 'Vändplats' },
    tags: ['parkering'],
    similarSignIds: ['forbud-parkera'],
    subcategory: 'parkeringsforbud',
  }),

  /* ---- Omgång 2: påbud och anvisning ---- */
  sign({
    id: 'pabud-korbana',
    code: 'D2',
    name: 'Påbjuden körbana',
    category: 'pabud',
    shortMeaning: 'Du ska köra förbi hindret på den sida pilen visar.',
    longMeaning:
      'Sitter vid refuger och andra hinder mitt i vägen. Pilen är sned, inte rak — den visar vilken sida du ska passera på.',
    altText: 'Rund blå skylt med en vit pil som pekar snett nedåt höger.',
    visualTraits: { background: 'blue', arrowDirection: 'right' },
    tags: ['refug', 'placering'],
    similarSignIds: ['pabud-rakt', 'pabud-hoger'],
    subcategory: 'pabudsmarken',
  }),
  sign({
    id: 'pabud-gang-cykelbana-gemensam',
    code: 'D6',
    name: 'Påbjuden gång- och cykelbana',
    category: 'pabud',
    shortMeaning: 'Gemensam bana för gående och cyklister.',
    longMeaning:
      'Till skillnad från D7 är banan inte delad. Alla samsas om hela ytan, och cyklisten har ingen egen halva att räkna med.',
    altText: 'Rund blå skylt med en gående figur ovanför en cykel.',
    visualTraits: { background: 'blue' },
    tags: ['cykel', 'oskyddade'],
    similarSignIds: ['pabud-gang-cykelbana', 'pabud-cykelbana'],
    subcategory: 'pabudsmarken',
  }),
  sign({
    id: 'motortrafikled-upphor',
    code: 'E4',
    name: 'Motortrafikled upphör',
    category: 'anvisning',
    shortMeaning: 'Motortrafikledens regler slutar gälla här.',
    longMeaning:
      'Räkna med korsande trafik, långsamma fordon och gående igen. Bashastigheten gäller om inget annat skyltas.',
    altText: 'Grön rektangulär skylt med en vit bil framifrån och ett rött streck snett över.',
    visualTraits: { background: 'green', text: undefined },
    tags: ['motortrafikled'],
    similarSignIds: ['motortrafikled', 'motorvag-upphor'],
    subcategory: 'motortrafikled',
  }),
  sign({
    id: 'tattbebyggt-omrade-upphor',
    code: 'E6',
    name: 'Tättbebyggt område upphör',
    category: 'anvisning',
    shortMeaning: 'Du lämnar tättbebyggt område.',
    longMeaning:
      'Bashastigheten går från 50 till 70 km/h om inget annat skyltas. Kontrollera alltid om det står en hastighetsskylt strax efter.',
    altText:
      'Vit rektangulär skylt med svart ram, en svart stadssiluett och ett rött streck snett över.',
    visualTraits: { background: 'white', border: 'black' },
    tags: ['hastighet', 'tatort'],
    similarSignIds: ['tattbebyggt-omrade'],
    subcategory: 'hastighetsgranser',
  }),
  sign({
    id: 'gagata-upphor',
    code: 'E8',
    name: 'Gågata upphör',
    category: 'anvisning',
    shortMeaning: 'Gågatans regler slutar gälla.',
    longMeaning: 'Vanliga trafikregler och vanlig bashastighet gäller igen.',
    altText: 'Blå fyrkantig skylt med gående figurer och ett rött streck snett över.',
    visualTraits: { background: 'blue' },
    tags: ['gagata'],
    similarSignIds: ['gagata', 'gangfartsomrade-upphor'],
    subcategory: 'anvisningsmarken',
  }),
  sign({
    id: 'gangfartsomrade-upphor',
    code: 'E10',
    name: 'Gångfartsområde upphör',
    category: 'anvisning',
    shortMeaning: 'Gångfartsområdets regler slutar gälla.',
    longMeaning:
      'Du behöver inte längre hålla gångfart och lämna företräde åt alla gående — men du har utfartsregel när du lämnar området.',
    altText:
      'Blå fyrkantig skylt med gående figurer, en bil och ett hus, med ett rött streck snett över.',
    visualTraits: { background: 'blue' },
    tags: ['gangfart'],
    similarSignIds: ['gangfartsomrade', 'gagata-upphor'],
    subcategory: 'anvisningsmarken',
  }),
  sign({
    id: 'rekommenderad-hastighet-upphor',
    code: 'E12',
    name: 'Rekommenderad lägre hastighet upphör',
    category: 'anvisning',
    shortMeaning: 'Rekommendationen om lägre hastighet slutar gälla.',
    longMeaning:
      'Rekommendationen var aldrig en gräns, och att den upphör betyder bara att skälet till den är passerat.',
    altText:
      'Blå fyrkantig skylt med texten max 30 km/tim och ett rött streck snett över.',
    visualTraits: { background: 'blue', text: 'max 30 km/tim', numericValue: 30 },
    tags: ['hastighet'],
    similarSignIds: ['rekommenderad-hastighet-30'],
    subcategory: 'hastighetsgranser',
  }),
  sign({
    id: 'sammanvavning',
    code: 'E15',
    name: 'Sammanvävning',
    category: 'anvisning',
    shortMeaning: 'Två körfält vävs samman till ett.',
    longMeaning:
      'Ingen av de två har företräde. Det fungerar bara om båda släpper fram varannan bil — kör växelvis och håll jämn fart.',
    altText:
      'Vit skylt med en röd symbol där två pilar vävs samman till en enda pil uppåt.',
    visualTraits: { background: 'white', arrowDirection: 'up' },
    tags: ['korfalt', 'motorvag'],
    similarSignIds: ['pabud-korbana'],
    subcategory: 'korfaltsbyte',
  }),

  /* ---- Omgång 2: fler tilläggstavlor ---- */
  sign({
    id: 'tavla-strackans-langd',
    code: 'T1',
    name: 'Vägsträckas längd',
    category: 'tillaggstavla',
    plate: {
      kind: 'extent',
      printedText: '1,2 km',
      combinedPhrase: 'gäller den närmaste sträckan på 1,2 km',
    },
    shortMeaning: 'Märket ovanför gäller den angivna sträckan.',
    longMeaning:
      'Skillnaden mot avståndstavlan är viktig: den här säger hur långt regeln gäller, inte hur långt bort den börjar.',
    altText: 'Vit rektangulär tilläggstavla med svart ram och texten 1,2 km mellan två ändstreck.',
    quizSafeAltText: 'Vit rektangulär tilläggstavla med svart ram och texten 1,2 km.',
    visualTraits: { background: 'white', border: 'black', text: '1,2 km' },
    tags: ['tillaggstavla'],
    similarSignIds: ['tavla-avstand'],
    subcategory: 'anvisningsmarken',
  }),
  sign({
    id: 'tavla-avstand-stopplikt',
    code: 'T3',
    name: 'Avstånd till stopplikt',
    category: 'tillaggstavla',
    plate: {
      kind: 'distance',
      printedText: 'STOPP 200 m',
      combinedPhrase: 'stopplikten kommer om 200 m',
    },
    shortMeaning: 'Stopplikt längre fram, på det angivna avståndet.',
    longMeaning:
      'Sitter under väjningspliktsmärket där stopplikten kommer så snart efteråt att en förvarning behövs.',
    altText: 'Gul rektangulär tilläggstavla med röd ram och texten STOPP 200 m i svart.',
    quizSafeAltText: 'Gul rektangulär tilläggstavla med röd ram och texten STOPP 200 m.',
    visualTraits: { background: 'yellow', border: 'red', text: 'STOPP 200 m' },
    tags: ['tillaggstavla', 'stopplikt'],
    similarSignIds: ['tavla-avstand'],
    subcategory: 'stopplikt',
  }),
  sign({
    id: 'tavla-fri-bredd',
    code: 'T4',
    name: 'Fri bredd',
    category: 'tillaggstavla',
    plate: {
      kind: 'condition',
      printedText: '3,5 m',
      combinedPhrase: 'den fria bredden är 3,5 m',
    },
    shortMeaning: 'Hur bred passagen faktiskt är.',
    longMeaning: 'Måttet gäller fordonet med last, inte bara karossen.',
    altText: 'Gul rektangulär tilläggstavla med röd ram och måttet 3,5 m mellan två pilspetsar.',
    quizSafeAltText: 'Gul rektangulär tilläggstavla med röd ram och texten 3,5 m mellan två pilspetsar.',
    visualTraits: { background: 'yellow', border: 'red', text: '3,5 m' },
    tags: ['tillaggstavla', 'matt'],
    similarSignIds: ['forbud-bredd'],
    subcategory: 'forbudsmarken',
  }),
  sign({
    id: 'tavla-totalvikt',
    code: 'T5',
    name: 'Totalvikt',
    category: 'tillaggstavla',
    plate: {
      kind: 'vehicle',
      printedText: '3,5 t',
      combinedPhrase: 'gäller fordon över 3,5 t totalvikt',
    },
    shortMeaning: 'Märket ovanför gäller fordon över den angivna vikten.',
    longMeaning:
      'Tavlan begränsar alltså vem regeln träffar. En personbil under gränsen berörs inte av märket ovanför.',
    altText: 'Gul rektangulär tilläggstavla med röd ram och texten 3,5 t i svart.',
    quizSafeAltText: 'Gul rektangulär tilläggstavla med röd ram och texten 3,5 t.',
    visualTraits: { background: 'yellow', border: 'red', text: '3,5 t' },
    tags: ['tillaggstavla', 'vikt'],
    similarSignIds: ['forbud-bruttovikt'],
    subcategory: 'forbudsmarken',
  }),
  sign({
    id: 'tavla-rorelsehindrade',
    code: 'T7',
    name: 'Rörelsehindrade',
    category: 'tillaggstavla',
    plate: {
      kind: 'vehicle',
      combinedPhrase: 'gäller endast fordon med parkeringstillstånd för rörelsehindrad',
    },
    shortMeaning: 'Märket ovanför gäller bara den som har parkeringstillstånd.',
    longMeaning:
      'Tavlan kan både ge en rättighet och begränsa en — under en parkeringsskylt reserverar den platsen, under ett förbud undantar den.',
    altText: 'Blå fyrkantig tilläggstavla med en vit rullstolssymbol.',
    visualTraits: { background: 'blue' },
    tags: ['tillaggstavla', 'parkering'],
    similarSignIds: ['parkering'],
    subcategory: 'parkeringsregler',
  }),
  sign({
    id: 'tavla-flervagsvajning',
    code: 'T13',
    name: 'Flervägsväjning',
    category: 'tillaggstavla',
    plate: {
      kind: 'information',
      printedText: 'Flervägs-väjning',
      combinedPhrase: 'alla tillfarter i korsningen har väjningsplikt',
    },
    shortMeaning: 'Alla som kommer till korsningen har väjningsplikt.',
    longMeaning:
      'Då gäller högerregeln mellan er. Tavlan finns för att ingen ska tro att den egna väjningsplikten betyder att någon annan har företräde.',
    altText: 'Gul rektangulär tilläggstavla med röd ram och texten Flervägs-väjning i svart.',
    quizSafeAltText: 'Gul rektangulär tilläggstavla med röd ram och texten Flervägs-väjning.',
    visualTraits: { background: 'yellow', border: 'red', text: 'Flervägs-väjning' },
    tags: ['tillaggstavla', 'korsning'],
    similarSignIds: ['tavla-flervagsstopp', 'vajningsplikt'],
    subcategory: 'vajningsplikt',
  }),
  sign({
    id: 'tavla-vagars-fortsattning',
    code: 'T15',
    name: 'Vägars fortsättning i korsning',
    category: 'tillaggstavla',
    plate: {
      kind: 'information',
      combinedPhrase: 'den tjocka linjen visar hur den prioriterade vägen går genom korsningen',
    },
    shortMeaning: 'Visar hur huvudleden eller den prioriterade vägen går genom korsningen.',
    longMeaning:
      'Behövs när huvudleden svänger. Utan tavlan är det lätt att tro att den fortsätter rakt fram och att man därför har företräde.',
    altText:
      'Gul rektangulär tilläggstavla med röd ram och ett svart korsningsdiagram där en gren är tjockare än de andra.',
    visualTraits: { background: 'yellow', border: 'red' },
    tags: ['tillaggstavla', 'huvudled'],
    similarSignIds: ['huvudled'],
    subcategory: 'huvudled',
  }),

  /* ================= Tillägg: spårväg och plankorsning ================= */
  sign({
    id: 'varning-sparvagn',
    code: 'A37',
    name: 'Varning för korsning med spårväg',
    category: 'varning',
    visualTraits: { background: 'yellow', border: 'red' },
    shortMeaning: 'En spårvagn kan korsa vägen strax framför dig.',
    longMeaning:
      'Spårvagnen kan inte väja och har mycket lång bromssträcka. Räkna med att det är du som ska lämna företräde, och titta åt båda hållen längs spåret innan du kör över.',
    altText: 'Varningsmärke: gul triangel med röd ram och en svart spårvagn sedd framifrån.',
    tags: ['sparvagn', 'korsning'],
    similarSignIds: ['varning-jarnvag-utan-bommar'],
    subcategory: 'vagens-anvandning',
  }),
  sign({
    id: 'kryssmarke',
    code: 'A39',
    name: 'Kryssmärke',
    category: 'varning',
    visualTraits: { background: 'yellow', border: 'red' },
    shortMeaning: 'Här korsar vägen ett järnvägsspår.',
    longMeaning:
      'Märket står omedelbart vid själva korsningen, till skillnad från varningsmärkena som står i förväg. Ett kryss betyder ett spår, ett dubbelkryss betyder två eller fler — och med flera spår kan ett tåg dölja ett annat.',
    altText:
      'Ett liggande kryss av två armar i rött och gult, format som en X-vinge, monterat vid en järnvägskorsning.',
    tags: ['jarnvag', 'plankorsning'],
    similarSignIds: ['varning-jarnvag-bommar', 'varning-jarnvag-utan-bommar'],
    subcategory: 'plankorsning-marken',
  }),

  /* ================= Tillägg: förbud mot trafikantslag ================= */
  sign({
    id: 'forbud-cykel-moped',
    code: 'C10',
    name: 'Förbud mot trafik med cykel och moped klass II',
    category: 'forbud',
    visualTraits: { background: 'yellow', border: 'red' },
    shortMeaning: 'Cykel och moped klass II får inte köras här.',
    longMeaning:
      'Förbudet gäller att *köra* fordonet. Att leda cykeln är att gå, och den som går lyder under reglerna för gående.',
    altText: 'Rund skylt med gul botten och röd ram, en svart cykel och ett rött snedstreck över.',
    tags: ['cykel', 'moped', 'forbud'],
    similarSignIds: ['forbud-moped-klass-2', 'pabud-cykelbana'],
    subcategory: 'forbudsmarken',
  }),
  sign({
    id: 'forbud-moped-klass-2',
    code: 'C11',
    name: 'Förbud mot trafik med moped klass II',
    category: 'forbud',
    visualTraits: { background: 'yellow', border: 'red' },
    shortMeaning: 'Moped klass II får inte köras här — cykel får det.',
    longMeaning:
      'Skillnaden mot C10 är att cykeln inte är förbjuden. Symbolen visar både en cykel och en moped, men det är mopeden strecket gäller.',
    altText:
      'Rund skylt med gul botten och röd ram, en svart cykel bakom en svart moped och ett rött snedstreck över.',
    tags: ['moped', 'forbud'],
    similarSignIds: ['forbud-cykel-moped'],
    subcategory: 'forbudsmarken',
  }),
  sign({
    id: 'forbud-ridning',
    code: 'C14',
    name: 'Förbud mot ridning',
    category: 'forbud',
    visualTraits: { background: 'yellow', border: 'red' },
    shortMeaning: 'Ridning är förbjuden här.',
    longMeaning:
      'Ryttare räknas som trafikanter och har egna regler. Där ridning är förbjuden är hästen ofta hänvisad till en egen led vid sidan av vägen.',
    altText: 'Rund skylt med gul botten och röd ram, en svart häst med ryttare och ett rött snedstreck över.',
    tags: ['ridning', 'forbud'],
    similarSignIds: ['varning-ridande'],
    subcategory: 'forbudsmarken',
  }),
  sign({
    id: 'forbud-gangtrafik',
    code: 'C15',
    name: 'Förbud mot gångtrafik',
    category: 'forbud',
    visualTraits: { background: 'yellow', border: 'red' },
    shortMeaning: 'Gående får inte gå här.',
    longMeaning:
      'Sätts där det saknas utrymme att gå säkert, till exempel på en bro eller i en tunnel. Den som leder en cykel räknas som gående och omfattas därför också.',
    altText: 'Rund skylt med gul botten och röd ram, en svart gående figur och ett rött snedstreck över.',
    tags: ['gaende', 'forbud'],
    similarSignIds: ['pabud-gangbana'],
    subcategory: 'forbudsmarken',
  }),

  /* ================= Lokaliseringsmärken (F) ================= */
  sign({
    id: 'vagvisare',
    code: 'F5',
    name: 'Vägvisare',
    category: 'lokalisering',
    visualTraits: { background: 'blue', border: 'white', text: 'NYKÖPING 23' },
    shortMeaning: 'Åt det hållet ligger orten, och så långt är det.',
    longMeaning:
      'Pilformen pekar åt det håll du ska svänga. Siffran är avståndet i kilometer. Blå botten betyder att vägen inte är motorväg eller motortrafikled — de har grön respektive blå vägvisning på annat sätt.',
    altText: 'Blå pilformad skylt med vit ram och texten NYKÖPING 23 i vitt.',
    tags: ['vagvisning', 'lokalisering'],
    similarSignIds: ['tabellvagvisare', 'avfartsvisare'],
    subcategory: 'anvisningsmarken',
  }),
  sign({
    id: 'tabellvagvisare',
    code: 'F6',
    name: 'Tabellvägvisare',
    category: 'lokalisering',
    visualTraits: { background: 'blue', border: 'white' },
    shortMeaning: 'Flera mål samtidigt, med en pil och ett vägnummer för varje.',
    longMeaning:
      'Sätts före korsningar där du behöver välja tidigt. Läs raden för ditt mål och följ pilen på just den raden — inte den översta.',
    altText:
      'Blå fyrkantig skylt med vit ram och tre rader, var och en med en vit pil, ett vägnummer i en ruta och ett ortnamn.',
    tags: ['vagvisning', 'korsning'],
    similarSignIds: ['vagvisare', 'korfaltsvagvisare'],
    subcategory: 'anvisningsmarken',
  }),
  sign({
    id: 'avfartsvisare',
    code: 'F7',
    name: 'Avfartsvisare',
    category: 'lokalisering',
    visualTraits: { background: 'blue', border: 'white' },
    shortMeaning: 'Här är avfarten, och dit leder den.',
    longMeaning:
      'Den snedställda pilen visar att du lämnar den väg du kör på. Sitter i själva avfarten, efter att förberedande vägvisning redan talat om att den kommer.',
    altText:
      'Blå skylt med vit ram, ett vägnummer i ruta, två ortnamn och en vit pil som pekar snett uppåt höger.',
    tags: ['vagvisning', 'avfart', 'motorvag'],
    similarSignIds: ['vagvisare', 'korfaltsvagvisare'],
    subcategory: 'pafart-avfart',
  }),
  sign({
    id: 'korfaltsvagvisare',
    code: 'F8',
    name: 'Körfältsvägvisare',
    category: 'lokalisering',
    visualTraits: { background: 'blue', border: 'white', arrowDirection: 'up' },
    shortMeaning: 'Det här körfältet leder dit.',
    longMeaning:
      'Sitter oftast över körbanan, ett märke per körfält. Pilen pekar rakt upp för det fält den hänger över — byt fält i god tid, inte i korsningen.',
    altText:
      'Blå skylt med vit ram, en vit pil rakt uppåt, ett vägnummer i ruta och ett ortnamn.',
    tags: ['vagvisning', 'korfalt'],
    similarSignIds: ['tabellvagvisare', 'avfartsvisare'],
    subcategory: 'placering',
  }),

  /* ================= Fordonssymboler (S) =================
     Symbolerna sitter inte på egen stolpe. De ritas på en symboltavla (T8)
     under ett märke, och talar om vilket fordonsslag regeln gäller. Därför är
     de registrerade som egen kategori och inte som märken. */
  sign({
    id: 'symbol-tung-lastbil',
    code: 'S1',
    name: 'Tung lastbil',
    category: 'symbol',
    visualTraits: { background: 'white', border: 'black' },
    shortMeaning: 'Symbolen för tung lastbil på en tilläggstavla.',
    longMeaning:
      'Står symbolen under ett märke gäller märket bara tung lastbil — alltså lastbil med totalvikt över 3,5 ton.',
    altText: 'Svart konturteckning av en lastbil med skåp, sedd från sidan, i en tunn svart ram.',
    tags: ['fordonsslag', 'symbol'],
    similarSignIds: ['symbol-personbil', 'symbol-buss'],
    subcategory: 'fordonsslag',
  }),
  sign({
    id: 'symbol-personbil',
    code: 'S3',
    name: 'Personbil',
    category: 'symbol',
    visualTraits: { background: 'white', border: 'black' },
    shortMeaning: 'Symbolen för personbil på en tilläggstavla.',
    longMeaning:
      'Under ett märke betyder den att regeln gäller personbil. Det är det fordonsslag ett B-körkort i första hand ger rätt att köra.',
    altText: 'Svart konturteckning av en personbil sedd från sidan, i en tunn svart ram.',
    tags: ['fordonsslag', 'symbol'],
    similarSignIds: ['symbol-tung-lastbil', 'symbol-personbil-klass-2'],
    subcategory: 'fordonsslag',
  }),
  sign({
    id: 'symbol-buss',
    code: 'S5',
    name: 'Buss',
    category: 'symbol',
    visualTraits: { background: 'white', border: 'black' },
    shortMeaning: 'Symbolen för buss på en tilläggstavla.',
    longMeaning:
      'Används bland annat för att peka ut att ett körfält eller en uppställningsplats är till för buss.',
    altText: 'Svart konturteckning av en buss med fönsterrad, sedd från sidan, i en tunn svart ram.',
    tags: ['fordonsslag', 'symbol'],
    similarSignIds: ['symbol-tung-lastbil', 'pabud-kollektivkorfalt'],
    subcategory: 'fordonsslag',
  }),
  sign({
    id: 'symbol-motorcykel',
    code: 'S7',
    name: 'Motorcykel',
    category: 'symbol',
    visualTraits: { background: 'white', border: 'black' },
    shortMeaning: 'Symbolen för motorcykel på en tilläggstavla.',
    longMeaning:
      'Avgränsar regeln till motorcykel. En moped är inte en motorcykel och omfattas alltså inte av en tavla med den här symbolen.',
    altText: 'Svart konturteckning av en motorcykel sedd från sidan, i en tunn svart ram.',
    tags: ['fordonsslag', 'symbol'],
    similarSignIds: ['symbol-personbil'],
    subcategory: 'fordonsslag',
  }),
  sign({
    id: 'symbol-slapkarra',
    code: 'S9',
    name: 'Släpkärra',
    category: 'symbol',
    visualTraits: { background: 'white', border: 'black' },
    shortMeaning: 'Symbolen för släpkärra på en tilläggstavla.',
    longMeaning:
      'Pekar ut att regeln gäller fordon med släp. Ett parkeringsförbud med den här symbolen gäller alltså ekipaget, inte bilen ensam.',
    altText: 'Svart konturteckning av en liten släpkärra med ett hjul, sedd från sidan, i en tunn svart ram.',
    tags: ['fordonsslag', 'slapvagn', 'symbol'],
    similarSignIds: ['symbol-personbil'],
    subcategory: 'fordonsslag',
  }),
  sign({
    id: 'symbol-personbil-klass-2',
    code: 'S12',
    name: 'Personbil klass II',
    category: 'symbol',
    visualTraits: { background: 'white', border: 'black' },
    shortMeaning: 'Symbolen för husbil på en tilläggstavla.',
    longMeaning:
      'Personbil klass II är den formella beteckningen på en husbil. Symbolen används där reglerna för husbil skiljer sig från reglerna för en vanlig personbil.',
    altText:
      'Svart konturteckning av en husbil med hytt och boddel, sedd från sidan, i en tunn svart ram.',
    tags: ['fordonsslag', 'symbol'],
    similarSignIds: ['symbol-personbil'],
    subcategory: 'fordonsslag',
  }),
];

export const SIGN_BY_ID: ReadonlyMap<string, RoadSign> = new Map(ROAD_SIGNS.map((s) => [s.id, s]));

export function getRoadSign(id: string): RoadSign | undefined {
  return SIGN_BY_ID.get(id);
}

export const SIGNS_BY_CATEGORY: ReadonlyMap<SignCategory, RoadSign[]> = new Map(
  (['varning', 'vajningsplikt', 'forbud', 'pabud', 'anvisning', 'tillaggstavla'] as SignCategory[]).map(
    (category) => [category, ROAD_SIGNS.filter((s) => s.category === category)],
  ),
);

export const SIGN_CATEGORY_LABELS: Record<SignCategory, string> = {
  varning: 'Varningsmärken',
  vajningsplikt: 'Väjningspliktsmärken',
  forbud: 'Förbudsmärken',
  pabud: 'Påbudsmärken',
  anvisning: 'Anvisningsmärken',
  tillaggstavla: 'Tilläggstavlor',
  lokalisering: 'Vägvisning',
  symbol: 'Fordonssymboler',
};

/* ------------------------------------------------------------------ */
/* Lookups                                                             */
/* ------------------------------------------------------------------ */

/** Every supplementary plate, in registry order. */
export const SUPPLEMENTARY_PLATES: RoadSign[] = ROAD_SIGNS.filter((s) => s.plate !== undefined);

/** Signs that are not plates — the ones a plate can sit under. */
export const MAIN_SIGNS: RoadSign[] = ROAD_SIGNS.filter((s) => s.plate === undefined);

/** All registry entries sharing one official code, e.g. every C31. */
export function signVariants(code: string): RoadSign[] {
  return ROAD_SIGNS.filter((s) => s.code === code);
}

/**
 * What a sign and its plates mean together.
 *
 * A plate narrows the sign above it, and reading them apart is how a learner
 * gets a combination wrong. This produces one sentence for the pair rather than
 * two sentences side by side.
 *
 * Deliberately shallow. It composes the phrase each plate carries with the
 * sign's own meaning; it does not attempt to model the legal interaction of
 * arbitrary combinations, which would be brittle and wrong at the edges.
 */
export function interpretSignAssembly(mainSignId: string, plateIds: readonly string[]): string {
  const main = getRoadSign(mainSignId);
  if (!main) return '';
  const phrases = plateIds
    .map((id) => getRoadSign(id)?.plate?.combinedPhrase)
    .filter((p): p is string => Boolean(p));
  if (phrases.length === 0) return main.shortMeaning;
  return `${main.shortMeaning.replace(/\.$/, '')} — ${phrases.join(', ')}.`;
}
