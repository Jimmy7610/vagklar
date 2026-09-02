import { PRIMARY_SOURCE_ID } from '@/content/sources';

/**
 * The source image registry.
 *
 * Photographs from the licensed theory source, used with permission and
 * curated by hand. This registry is the single place that knows what an image
 * shows, where it comes from and who owns it — questions and lessons refer to
 * an entry by id and never carry attribution of their own.
 *
 * Curation, not import. 263 photographs were extracted and 11 diagrams rendered and
 * cropped from the page, into working areas that are never committed; 66
 * entries were selected across four passes. The extraction and
 * optimisation steps are reproducible scripts, documented in
 * docs/SOURCE-IMAGES.md.
 *
 * The rights holder's own watermark is visible in these photographs and is
 * deliberately preserved rather than cropped out.
 */

/** How the image is used, so the UI can present it appropriately. */
export type SourceImageUsage =
  /** Illustrates a rule inside a theory lesson. */
  | 'theory-lesson'
  /** The question cannot be answered without looking at it. */
  | 'question-image'
  /** Extra context; the surrounding text stands on its own without it. */
  | 'supporting-reference';

export type SourceImageStatus = 'approved' | 'candidate' | 'retired';

/**
 * What the asset actually is, which decides how it should be presented.
 *
 * A photograph of a road is read as a whole: the eye takes in the scene and
 * the interesting part may be anywhere in it. A technical drawing is read for
 * its labels — "40 cm", "3 m", a numbered zone — and those labels have a size
 * below which the picture stops being a picture and becomes a smudge. The two
 * therefore need different minimum sizes and different backgrounds, so the
 * registry says which it is rather than the layout guessing from proportions.
 */
export type SourceImageKind =
  /** A photograph: a road situation, a component, a control. */
  | 'photo'
  /** A drawn figure from the book: dimensions, zones, light beams. */
  | 'diagram';

export interface SourceImage {
  id: string;
  /** Entry in the source registry (src/content/sources.ts). */
  sourceId: string;
  /** Printed page in that source. */
  sourcePage: number;
  title: string;
  /** Folder the asset lives in, matching the curriculum topic. */
  topic: string;
  /** Vägklar subcategory the image supports. */
  subcategory: string;
  /** Curriculum chapter id. */
  chapter: string;
  rightsHolder: string;
  usedWithPermission: boolean;
  /**
   * Short alternative text. Describes what is *in* the picture, not what the
   * learner is supposed to conclude — the conclusion is the exercise.
   */
  altText: string;
  /**
   * Longer description for anyone who cannot see the image, detailed enough
   * that the question or lesson still works without it.
   */
  longDescription: string;
  /** Shown under the image. */
  caption: string;
  usage: SourceImageUsage;
  /** Photograph or drawn figure. Defaults to a photograph. */
  kind?: SourceImageKind;
  /**
   * Words printed inside the picture, reproduced as text.
   *
   * A diagram's numbers are its content. Rendered as pixels they are invisible
   * to a screen reader, unsearchable, and the first thing to disappear when the
   * image is scaled down on a phone. Listing them here means the information
   * survives all three.
   */
  labelText?: string[];
  /** Slug used to resolve the asset files. */
  asset: string;
  /** Intrinsic size of the largest variant, so the layout can reserve space. */
  width: number;
  height: number;
  status: SourceImageStatus;
  notes?: string;
}

const RIGHTS_HOLDER = 'Hagberg Media AB';

/** Shorthand so the entries stay readable. */
function img(entry: Omit<SourceImage, 'sourceId' | 'rightsHolder' | 'usedWithPermission'>): SourceImage {
  return {
    ...entry,
    sourceId: PRIMARY_SOURCE_ID,
    rightsHolder: RIGHTS_HOLDER,
    usedWithPermission: true,
  };
}

export const SOURCE_IMAGES: SourceImage[] = [
  /* ---- Fordonets säkerhet: ritade figurer (omgång 4) ------------------- */
  img({
    id: 'deformationszoner',
    sourcePage: 232,
    title: 'Deformationszoner',
    topic: 'fordonet',
    subcategory: 'krocksakerhet',
    chapter: 'krocksakerhet',
    kind: 'diagram',
    labelText: ['1', '2'],
    altText:
      'Ritning av en bil sedd uppifrån där fram- och bakpartiet är markerat med 1 och sidorna med 2.',
    longDescription:
      'En schematisk bil sedd rakt uppifrån, ritad i blått mot en grön bakgrund. Fram- och bakpartiet är inramade med streckade rutor märkta 1 — det är deformationszonerna, som är byggda för att tryckas ihop vid en krock. Sidorna, i höjd med kupén, är inramade med streckade rutor märkta 2. Där finns nästan inget utrymme mellan plåten och den som sitter i bilen.',
    caption:
      'Zon 1 är byggd för att tryckas ihop. Zon 2 har knappt något utrymme alls att ge.',
    usage: 'theory-lesson',
    asset: 'fordonet/deformationszoner',
    width: 960,
    height: 817,
    status: 'approved',
  }),
  img({
    id: 'lastbredd-tillaten',
    sourcePage: 244,
    title: 'Tillåten lastbredd',
    topic: 'last',
    subcategory: 'lastning',
    chapter: 'langd-bredd',
    kind: 'diagram',
    labelText: ['260 cm'],
    altText:
      'Ritning av en bil framifrån med en bräda på taket, måttsatt till 260 cm och lika mycket utanför på båda sidor.',
    longDescription:
      'En bil sedd rakt framifrån med en lång bräda tvärs över takräcket. Ett måttstreck över lasten visar 260 cm. Brädan sticker ut lika mycket på båda sidor om bilen, ungefär 20 cm åt varje håll. Rubriken över figuren lyder "Exempel 1, tillåtet".',
    caption: 'Totalbredden håller sig inom 260 cm och lasten sticker ut högst 20 cm åt sidan.',
    usage: 'theory-lesson',
    asset: 'last/lastbredd-tillaten',
    width: 960,
    height: 746,
    status: 'approved',
  }),
  img({
    id: 'lastbredd-otillaten',
    sourcePage: 245,
    title: 'Otillåten lastbredd',
    topic: 'last',
    subcategory: 'lastning',
    chapter: 'langd-bredd',
    kind: 'diagram',
    labelText: ['260 cm', '40 cm'],
    altText:
      'Ritning av en bil framifrån med en bräda på taket, måttsatt till 260 cm men 40 cm utanför bilen på ena sidan, överkryssad med rött.',
    longDescription:
      'Samma bil framifrån med en bräda på taket. Måttstrecket över lasten visar 260 cm, alltså inom gränsen för totalbredd. Men brädan är förskjuten åt ena sidan: ett mått nere till höger visar att den sticker ut 40 cm utanför bilen. Ett stort rött kryss ligger över hela figuren. Rubriken lyder "Exempel 2, ej tillåtet".',
    caption: 'Bredden är godkänd, men lasten sticker ut 40 cm åt ena sidan. Det är det som fäller den.',
    usage: 'question-image',
    asset: 'last/lastbredd-otillaten',
    width: 960,
    height: 811,
    status: 'approved',
  }),
  img({
    id: 'lastlangd-utmarkning',
    sourcePage: 247,
    title: 'Utskjutande last i längd',
    topic: 'last',
    subcategory: 'lastning',
    chapter: 'langd-bredd',
    kind: 'diagram',
    labelText: ['3 m', '4 m'],
    altText:
      'Ritning av en bil från sidan med en lång last som skjuter ut 3 meter fram och 4 meter bak, med markeringsflaggor i ändarna.',
    longDescription:
      'En bil sedd från sidan med en lång bräda på takräcket. Brädan skjuter ut framför bilen, måttsatt till 3 meter, och bakom bilen, måttsatt till 4 meter. I båda ändarna av lasten sitter en markering i rött och gult. Fordon plus last blir tillsammans 13 meter, alltså under den högsta tillåtna längden på 24 meter.',
    caption: 'Skjuter lasten ut mer än en meter bak, eller alls framför bilen, ska den märkas ut.',
    usage: 'theory-lesson',
    asset: 'last/lastlangd-utmarkning',
    width: 960,
    height: 336,
    status: 'approved',
  }),
  img({
    id: 'bogsering-utmarkning',
    sourcePage: 248,
    title: 'Utmärkning vid bogsering',
    topic: 'last',
    subcategory: 'slapvagn',
    chapter: 'langd-bredd',
    kind: 'diagram',
    labelText: ['4 m'],
    altText:
      'Ritning av två bilar efter varandra med en bogserlina emellan, där avståndet är måttsatt till 4 meter och linan är märkt.',
    longDescription:
      'En grön bil bogserar en lila bil. Mellan dem löper en streckad bogserlina, och avståndet mellan bilarna är måttsatt till 4 meter. Mitt på linan sitter en liten röd och gul markering. Är avståndet mellan fordonen över 2 meter ska linan märkas ut så att andra ser den.',
    caption: 'Över två meter mellan bilarna: då måste linan märkas ut.',
    usage: 'question-image',
    asset: 'last/bogsering-utmarkning',
    width: 960,
    height: 284,
    status: 'approved',
  }),
  img({
    id: 'kultryck-hogt',
    sourcePage: 256,
    title: 'Högt kultryck',
    topic: 'last',
    subcategory: 'slapvagn',
    chapter: 'last',
    kind: 'diagram',
    altText:
      'Ritning av bil med släpvagn där lasten ligger längst fram i släpet och en pil pekar nedåt vid kopplingen.',
    longDescription:
      'En röd bil drar en släpvagn, sedda från sidan. Lasten — en brun låda — ligger längst fram i släpet, precis bakom kopplingen. En pil vid kopplingen pekar rakt nedåt. Bilens framvagn har lyfts något, så att fronten pekar uppåt och bakvagnen trycks ned.',
    caption: 'Lasten fram trycker kopplingen nedåt. Bilens framhjul lättar och greppet fram blir sämre.',
    usage: 'theory-lesson',
    asset: 'last/kultryck-hogt',
    width: 960,
    height: 299,
    status: 'approved',
  }),
  img({
    id: 'kultryck-lagt',
    sourcePage: 256,
    title: 'Lågt kultryck',
    topic: 'last',
    subcategory: 'slapvagn',
    chapter: 'last',
    kind: 'diagram',
    altText:
      'Ritning av bil med släpvagn där lasten ligger längst bak i släpet och en pil pekar uppåt vid kopplingen.',
    longDescription:
      'Samma bil och släpvagn från sidan, men nu ligger den bruna lådan längst bak i släpet. Släpet tippar bakåt kring sitt hjul och en pil vid kopplingen pekar rakt uppåt. Bilens bakvagn lyfts.',
    caption: 'Lasten bak lyfter kopplingen. Bilens bakhjul lättar, och det är de som håller bilen rak.',
    usage: 'question-image',
    asset: 'last/kultryck-lagt',
    width: 960,
    height: 308,
    status: 'approved',
  }),
  img({
    id: 'avblandning-mote-1',
    sourcePage: 266,
    title: 'Avbländning steg 1',
    topic: 'morker',
    subcategory: 'mote-i-morker',
    chapter: 'belysning',
    kind: 'diagram',
    altText:
      'Ritning uppifrån av en mörk väg där två mötande bilar långt från varandra båda lyser med långa ljuskäglor.',
    longDescription:
      'En mörk väg sedd rakt uppifrån. Två bilar möter varandra men är fortfarande långt ifrån varandra. Båda kastar en lång, ljus kägla framför sig som når långt fram på vägen utan att nå den andra bilen.',
    caption: 'Långt ifrån varandra: båda kör med helljus och ser så mycket som möjligt.',
    usage: 'theory-lesson',
    asset: 'morker/avblandning-mote-1',
    width: 960,
    height: 355,
    status: 'approved',
  }),
  img({
    id: 'avblandning-mote-2',
    sourcePage: 266,
    title: 'Avbländning steg 2',
    topic: 'morker',
    subcategory: 'mote-i-morker',
    chapter: 'belysning',
    kind: 'diagram',
    altText:
      'Ritning uppifrån där de två bilarnas ljuskäglor möts och båda har växlat till kortare, mörkare käglor.',
    longDescription:
      'Samma mörka väg uppifrån. Bilarna har närmat sig varandra och deras ljuskäglor når nu fram till varandra. Båda käglorna har blivit kortare och mörkare, vilket visar att förarna slagit om till halvljus.',
    caption: 'När käglorna möts är det dags att blända av — inte när du redan är bländad.',
    usage: 'theory-lesson',
    asset: 'morker/avblandning-mote-2',
    width: 960,
    height: 355,
    status: 'approved',
  }),
  img({
    id: 'avblandning-mote-3',
    sourcePage: 266,
    title: 'Avbländning steg 3',
    topic: 'morker',
    subcategory: 'mote-i-morker',
    chapter: 'belysning',
    kind: 'diagram',
    altText:
      'Ritning uppifrån där bilarna är i jämnhöjd med varandra och båda åter lyser med långa ljuskäglor.',
    longDescription:
      'Samma väg uppifrån. Bilarna är nu i jämnhöjd med varandra, sida vid sida i var sin körriktning. Båda har långa ljusa käglor igen, riktade framåt förbi den andra bilen.',
    caption: 'I jämnhöjd kan ingen blända den andra. Då ska helljuset tillbaka direkt.',
    usage: 'question-image',
    asset: 'morker/avblandning-mote-3',
    width: 960,
    height: 354,
    status: 'approved',
  }),
  img({
    id: 'helljus-i-kurva',
    sourcePage: 268,
    title: 'Helljus i kurva',
    topic: 'morker',
    subcategory: 'mote-i-morker',
    chapter: 'belysning',
    kind: 'diagram',
    labelText: ['A', 'B'],
    altText:
      'Ritning uppifrån av en kurva där bil A:s ljuskägla sveper in mot mötande bil B, medan bil B:s kägla pekar bort från A.',
    longDescription:
      'En vänsterkurva sedd uppifrån i mörker. Bil A kommer från vänster på insidan av kurvan och bil B från höger. Bil A:s ljuskägla sveper rakt in mot bil B, eftersom kurvan riktar ljuset mot den mötande. Bil B:s kägla pekar däremot bort från A, ut mot kurvans utsida.',
    caption: 'I kurvan når den enes ljus fram tidigare än den andres. De ska alltså inte blända av samtidigt.',
    usage: 'question-image',
    asset: 'morker/helljus-i-kurva',
    width: 960,
    height: 434,
    status: 'approved',
  }),

  /* ---- Fordonets säkerhet: komponenter och reglage --------------------- */
  img({
    id: 'bilbarnstol-bakatvand',
    sourcePage: 238,
    title: 'Bakåtvänt babyskydd',
    topic: 'fordonet',
    subcategory: 'krocksakerhet',
    chapter: 'bilbarnstolar',
    labelText: ['AIRBAG'],
    altText:
      'Ett bakåtvänt babyskydd med bärhandtag, med en gul varningsdekal om airbag på sidan.',
    longDescription:
      'Ett mörkt bakåtvänt babyskydd med bärhandtag uppfällt, ställt på en pall utomhus. På skyddets sida sitter en gul varningsdekal med texten AIRBAG och en symbol med ett överkryssat barn framför en krockkudde. Skyddets fempunktssele ligger öppen i sitsen.',
    caption: 'Dekalen på sidan säger det som gäller: aldrig i ett framsäte med aktiv krockkudde.',
    usage: 'theory-lesson',
    asset: 'fordonet/bilbarnstol-bakatvand',
    width: 706,
    height: 706,
    status: 'approved',
  }),
  img({
    id: 'krockkudde-indikator',
    sourcePage: 233,
    title: 'Indikator för passagerarkrockkudde',
    topic: 'fordonet',
    subcategory: 'krocksakerhet',
    chapter: 'krocksakerhet',
    labelText: ['PASSENGER AIR BAG', 'OFF', 'ON'],
    altText:
      'Panel i bilens innertak med texten PASSENGER AIR BAG samt lägena OFF och ON, där ON lyser gult.',
    longDescription:
      'En smal panel i takkonsolen ovanför framrutan. Till vänster står texten PASSENGER AIR BAG, sedan ordet OFF med en symbol för ett barn i bakåtvänd stol, och längst till höger ordet ON som lyser i gult. Lampan visar alltså att passagerarkrockkudden just nu är aktiv.',
    caption: 'Här lyser ON. Krockkudden är aktiv, och då får ingen bakåtvänd stol sitta i framsätet.',
    usage: 'question-image',
    asset: 'fordonet/krockkudde-indikator',
    width: 705,
    height: 524,
    status: 'approved',
  }),
  img({
    id: 'bromsskiva',
    sourcePage: 224,
    title: 'Bromsskiva och ok',
    topic: 'fordonet',
    subcategory: 'dack-och-bromsar',
    chapter: 'bromsar',
    altText: 'En bromsskiva av metall med ett blått bromsok, fotograferad med hjulet avtaget.',
    longDescription:
      'En bromsskiva i blank metall sedd snett framifrån med hjulet avmonterat. Runt skivans kant sitter ett blått bromsok som greppar om skivan. Innanför oket skymtar bromsbeläggen. Skivans yta har fina spår efter beläggen.',
    caption: 'Oket klämmer belägget mot skivan. Friktionen där är hela bromsverkan.',
    usage: 'theory-lesson',
    asset: 'fordonet/bromsskiva',
    width: 520,
    height: 490,
    status: 'approved',
  }),
  img({
    id: 'spannband',
    sourcePage: 252,
    title: 'Spännband med spärr',
    topic: 'last',
    subcategory: 'lastning',
    chapter: 'last',
    altText: 'Ett orange spännband med metallkrokar och en spännanordning med spak.',
    longDescription:
      'Ett orange spännband i två delar med blå etiketter som anger bandets hållfasthet. I ena änden sitter en böjd metallkrok, i den andra en spännanordning av metall med spak som drar åt bandet. Banden är gjorda för att surra fast last så att den inte kan glida.',
    caption: 'Etiketten anger hur mycket bandet håller. Ett band som inte är spänt håller ingenting.',
    usage: 'theory-lesson',
    asset: 'last/spannband',
    width: 388,
    height: 517,
    status: 'approved',
  }),
  /* ---- Verklig trafikmiljö (omgång 3) ---------------------------------- */
  img({
    id: 'signal-over-vajningsmarke',
    sourcePage: 11,
    title: 'Grön signal under väjningspliktsmärke',
    topic: 'vajningsregler',
    subcategory: 'polisens-tecken',
    chapter: 'inledning',
    altText:
      'Korsning där trafiksignalen lyser grönt samtidigt som väjningspliktsmärken står uppsatta på båda sidor om vägen.',
    longDescription:
      'Vy framåt från förarplatsen mot en fyrvägskorsning på en landsväg. På båda sidor om körbanan står en trafiksignal som lyser grönt, och strax intill varje signal står ett väjningspliktsmärke — en gul triangel med röd ram, spetsen nedåt. Tvärs över körbanan löper en bred vit stopplinje, och på båda sidor korsar två rader vita rutor som markerar en cykelpassage. En mörk personbil rullar framför dig genom korsningen.',
    caption:
      'Signalen och märket säger olika saker samtidigt. Rangordningen avgör vilket som gäller.',
    usage: 'theory-lesson',
    asset: 'vajningsregler/signal-over-vajningsmarke',
    width: 960,
    height: 540,
    status: 'approved',
    notes: 'Visar rangordningen konkret: signal före vägmärke.',
  }),
  img({
    id: 'sparvagn-kryssmarke',
    sourcePage: 39,
    title: 'Kryssmärke vid spårvägskorsning',
    topic: 'vajningsregler',
    subcategory: 'vagens-anvandning',
    chapter: 'vajningsregler',
    altText:
      'Stadsgata med spårvagnsspår i körbanan och en märkesstolpe med varning för spårväg, kryssmärke och texten Lämna fri väg för spårvagn.',
    longDescription:
      'En bred stadsgata sedd framåt från förarplatsen. Spårvagnsspår löper i körbanan och korsar den snett framför dig, med kontaktledningar spända över gatan. Till höger står en stolpe med tre märken ovanpå varandra: överst en gul varningstriangel med en spårvagn, därunder ett vitt kryssmärke med röda spetsar, och underst en gul tavla med texten "Lämna fri väg för spårvagn". Längre fram syns en spårvagn och en buss vid en hållplats.',
    caption:
      'Kryssmärket står vid själva korsningen. Varningstriangeln varnade för den redan tidigare.',
    usage: 'theory-lesson',
    asset: 'vajningsregler/sparvagn-kryssmarke',
    width: 960,
    height: 540,
    status: 'approved',
    notes: 'Kompletterar vektormärkena A37 och A39 med hur de faktiskt sitter på plats.',
  }),
  img({
    id: 'huvudled-cykelpassage',
    sourcePage: 51,
    title: 'Huvudled med cykelpassage',
    topic: 'passager',
    subcategory: 'cykelpassage-overfart',
    chapter: 'passager',
    altText:
      'Stadsgata med ett gult huvudledsmärke till höger och en cykelpassage markerad med vita rutor tvärs över vägen.',
    longDescription:
      'En stadsgata sedd framåt från förarplatsen. Till höger står ett huvudledsmärke — en gul kvadrat ställd på hörn med vit ram — på en stolpe intill en cykelbana. Tvärs över körbanan strax framför dig löper en cykelpassage markerad med två rader vita rutor. Längre fram till vänster syns ett övergångsställe med blått märke och vita band över vägen. En mörk bil kör bort från dig i fjärran.',
    caption:
      'Huvudleden gäller mot korsande vägar. Cykelpassagen framför dig är en egen sak.',
    usage: 'question-image',
    asset: 'passager/huvudled-cykelpassage',
    width: 960,
    height: 540,
    status: 'approved',
  }),
  img({
    id: 'cyklist-mellan-parkerade',
    sourcePage: 7,
    title: 'Cyklist längs parkerade bilar',
    topic: 'risker',
    subcategory: 'skymd-sikt',
    chapter: 'inledning',
    altText:
      'Stadsgata med bilar parkerade längs båda sidor och en cyklist som kör tätt intill de parkerade bilarna till höger.',
    longDescription:
      'En smal stadsgata med bostadshus på båda sidor, sedd framåt från förarplatsen. Längs vänster kant står en lång rad parkerade bilar, och längs höger kant står ytterligare parkerade bilar. En cyklist kör i samma riktning som du, tätt intill de parkerade bilarna på höger sida, med bara någon meter mellan cykeln och bildörrarna. Körbanan mellan bilraderna är knappt bred nog för två fordon i bredd.',
    caption: 'Cyklisten kör i dörrzonen. Det utrymme som ser ledigt ut är inte ledigt.',
    usage: 'question-image',
    asset: 'risker/cyklist-mellan-parkerade',
    width: 960,
    height: 540,
    status: 'approved',
  }),
  img({
    id: 'gaende-mellan-parkerade',
    sourcePage: 155,
    title: 'Parkerad rad på gatstensgata',
    topic: 'risker',
    subcategory: 'skymd-sikt',
    chapter: 'synen',
    altText:
      'Rad med parkerade bilar och en lastbil längs en gatstensgata, med parkeringsmärke och huvudledsmärke på husväggen.',
    longDescription:
      'En smal gatstensgata sedd snett framifrån. Längs höger sida står en tät rad parkerade personbilar och längre fram en vit lastbil. På husväggen ovanför bilraden sitter ett gult huvudledsmärke och ett blått parkeringsmärke. Mellan fordonen längre fram skymtar en person i ljusa kläder, delvis dold av lastbilen.',
    caption: 'Mellan fordonen finns luckor. Det är i luckorna någon kliver ut.',
    usage: 'question-image',
    asset: 'risker/gaende-mellan-parkerade',
    width: 794,
    height: 783,
    status: 'approved',
  }),
  img({
    id: 'bussar-vid-hallplats',
    sourcePage: 168,
    title: 'Bussar vid hållplats',
    topic: 'risker',
    subcategory: 'barn-och-oskyddade',
    chapter: 'barn',
    altText:
      'Två röda bussar som står vid en hållplats till höger om körbanan, med en gångbro över gatan och en hållplatsyta till vänster.',
    longDescription:
      'En gata vid en bussterminal, sedd framåt från förarplatsen. Två röda ledbussar står stilla vid kanten på höger sida, den närmaste alldeles framför dig. En gångbro med glasräcken går över gatan ovanför bussarna. Till vänster ligger en hållplatsyta med väderskydd och cykelparkering, och mellan körbanorna löper en upphöjd refug. Bortom bussarna fortsätter gatan och en mörk bil är på väg bort från dig.',
    caption: 'Bussarna skymmer allt som rör sig framför dem.',
    usage: 'question-image',
    asset: 'risker/bussar-vid-hallplats',
    width: 960,
    height: 540,
    status: 'approved',
    notes: 'Samma situation som scenariot sc-risk-barn-buss, men i verklig miljö.',
  }),
  img({
    id: 'smal-viadukt-skymd-utfart',
    sourcePage: 198,
    title: 'Smal viadukt under järnvägen',
    topic: 'risker',
    subcategory: 'skymd-sikt',
    chapter: 'strackor',
    altText:
      'Smal väg som går genom en enfilig viadukt under en järnvägsbro, med gula höjdmarkeringar i valvet.',
    longDescription:
      'En smal landsväg sedd framåt från förarplatsen, på väg in i en viadukt under en järnvägsbro av sten. Öppningen rymmer bara ett fordon i taget och är markerad med gula pilar i taket. Bakom valvet svänger vägen och fortsätter bort mellan träd, så det går inte att se om något är på väg emot dig. Till vänster reser sig en stenmur och en slänt, till höger växer buskar tätt intill vägen.',
    caption: 'Passagen rymmer ett fordon. Du ser inte om någon redan är inne i den.',
    usage: 'question-image',
    asset: 'risker/smal-viadukt-skymd-utfart',
    width: 960,
    height: 540,
    status: 'approved',
  }),
  img({
    id: 'viltvarning-med-tillaggstavla',
    sourcePage: 178,
    title: 'Viltvarning med avståndstavla',
    topic: 'landsvag',
    subcategory: 'djur-pa-vagen',
    chapter: 'trafikolyckor',
    altText:
      'Landsväg genom höstskog med ett varningsmärke för älg och en tilläggstavla som anger 0–800 meter.',
    longDescription:
      'En landsväg som svänger svagt åt vänster genom höstfärgad skog, sedd framåt från förarplatsen. Vägen har heldragna vita kantlinjer och en streckad mittlinje. Till höger står ett varningsmärke — gul triangel med röd ram och en svart älg — och under det en gul tilläggstavla med texten "0–800 m". Bakom märket öppnar sig en gräsyta mot skogsbrynet.',
    caption: 'Tilläggstavlan säger hur länge varningen gäller, inte hur farlig den är.',
    usage: 'theory-lesson',
    asset: 'landsvag/viltvarning-med-tillaggstavla',
    width: 960,
    height: 540,
    status: 'approved',
    notes: 'Visar A19 med tilläggstavla T2 i verklig miljö.',
  }),
  img({
    id: 'isig-landsvag-utan-linjer',
    sourcePage: 9,
    title: 'Isig väg i solsken',
    topic: 'vinter',
    subcategory: 'vinterkorning',
    chapter: 'inledning',
    altText:
      'Smal landsväg täckt av packad snö och is, med hjulspår och en kurva framåt, i klart solsken.',
    longDescription:
      'En smal landsväg genom vinterlandskap, sedd framåt från förarplatsen. Vägbanan är täckt av packad snö och is med tydliga hjulspår, och inga vägmarkeringar syns någonstans. Vägen svänger åt vänster längre fram så att fortsättningen skyms av skogsbrynet. Solen skiner från klarblå himmel och snön ligger fläckvis på marken runt omkring. En snöstör står i vägkanten till vänster.',
    caption: 'Solsken säger ingenting om greppet. Det gör hjulspåren.',
    usage: 'question-image',
    asset: 'vinter/isig-landsvag-utan-linjer',
    width: 960,
    height: 540,
    status: 'approved',
  }),
  img({
    id: 'skymning-belyst-vag',
    sourcePage: 262,
    title: 'Skymning på belyst väg',
    topic: 'morker',
    subcategory: 'morkerkorning',
    chapter: 'belysning',
    altText:
      'Bred väg i skymning med tända gatlyktor, en mötande buss med tända lyktor och en avstängning med orange koner till höger.',
    longDescription:
      'En bred väg med två körfält i vardera riktningen, sedd framåt från förarplatsen i skymning. Gatlyktorna längs vägen är tända och himlen är gråblå. En buss möter dig i vänster körriktning med lyktorna tända, och längre fram kör en mörk bil bort från dig. Vägmarkeringarna syns tydligt: streckad körfältslinje i mitten och heldragen kantlinje åt höger. Vid högra kanten står en rad orange koner framför ett avstängt område.',
    caption: 'Belyst väg tar inte bort kravet på ljus. Den gör bara att du ser mer.',
    usage: 'theory-lesson',
    asset: 'morker/skymning-belyst-vag',
    width: 794,
    height: 657,
    status: 'approved',
  }),
  /* ---- Körfält --------------------------------------------------------- */
  img({
    id: 'korfaltsval-motorvag',
    sourcePage: 16,
    title: 'Körfältsvägvisare över motorväg',
    topic: 'korfalt',
    subcategory: 'placering',
    chapter: 'korfalt',
    altText:
      'Motorväg med fyra körfält märkta A, B, C och D, en skylt som visar 80 km/h och en körfältsvägvisare över vägen.',
    longDescription:
      'Vy framåt från förarplatsen på en motorväg med fyra körfält i färdriktningen, märkta A, B, C och D från vänster. Till vänster står ett hastighetsmärke som visar 80. Över vägen hänger en körfältsvägvisare: de tre vänstra körfälten visar raka pilar mot Helsingborg och Göteborg, E4 och E20, medan det högra körfältet visar avfart mot Västertorp, Hägersten och Fruängen om 500 meter.',
    caption: 'Körfältsvägvisaren visar att det högra körfältet leder till ett annat mål än de övriga.',
    usage: 'question-image',
    asset: 'korfalt/korfaltsval-motorvag',
    width: 960,
    height: 540,
    status: 'approved',
  }),
  img({
    id: 'placering-landsvag',
    sourcePage: 14,
    title: 'Landsväg med kurva',
    topic: 'korfalt',
    subcategory: 'placering',
    chapter: 'korfalt',
    altText: 'Tvåfilig landsväg som svänger åt höger, med vägräcke på högra sidan och berg till vänster.',
    longDescription:
      'En landsväg med ett körfält i vardera riktningen, sedd framåt från förarplatsen. Vägen böjer av åt höger så att fortsättningen skyms. Ett vägräcke löper längs högerkanten och en bergssida reser sig till vänster.',
    caption: 'Bakom kurvan kan det finnas både mötande trafik och hinder vid vägkanten.',
    usage: 'theory-lesson',
    asset: 'korfalt/placering-landsvag',
    width: 960,
    height: 443,
    status: 'approved',
  }),
  img({
    id: 'enkelriktat-svang',
    sourcePage: 15,
    title: 'Enkelriktad gata med svängpilar',
    topic: 'korfalt',
    subcategory: 'korfalt-och-sving',
    chapter: 'korfalt',
    altText: 'Smal gata med ett gult vägmärke som visar tillåtna körriktningar rakt fram och åt höger.',
    longDescription:
      'En smal gata mellan hus, sedd framåt från förarplatsen. Vägbanan är våt. Till höger står ett gult vägmärke med två pilar, rakt fram och åt höger, och intill det står en parkerad bil.',
    caption: 'På enkelriktade gator behöver du inte ta hänsyn till mötande trafik.',
    usage: 'theory-lesson',
    asset: 'korfalt/enkelriktat-svang',
    width: 960,
    height: 540,
    status: 'retired',
    notes: 'Ingen lektion behandlar sväng på enkelriktad gata, och bilden lär inget som frågorna inte redan säger i text.',
  }),

  /* ---- Väjningsregler --------------------------------------------------- */
  img({
    id: 'korsning-tva-fordon',
    sourcePage: 22,
    title: 'Korsning med två fordon',
    topic: 'vajningsregler',
    subcategory: 'hogerregeln',
    chapter: 'vajningsregler',
    altText: 'Stadskorsning där två bilar är markerade med A och B, och ett märke för övergångsställe syns.',
    longDescription:
      'En korsning i stadsmiljö sedd framåt från förarplatsen. Två bilar är markerade med bokstäverna A och B: A står till vänster i korsningen och B till höger. Ett märke för övergångsställe sitter uppe till vänster, och husfasader omger korsningen på alla sidor.',
    caption: 'Två fordon i samma korsning — ordningen avgörs av reglerna, inte av vem som kom först.',
    usage: 'question-image',
    asset: 'vajningsregler/korsning-tva-fordon',
    width: 960,
    height: 540,
    status: 'retired',
    notes: 'Högerregelslektionen använder oskyltad-korsning, som visar samma sak tydligare. Två bilder av samma situation lär inte dubbelt.',
  }),
  img({
    id: 'stopplikt-buss',
    sourcePage: 24,
    title: 'Stopplikt där en buss korsar',
    topic: 'vajningsregler',
    subcategory: 'stopplikt',
    chapter: 'vajningsregler',
    altText: 'Ett stoppmärke vid en korsning där en röd buss kör förbi framför bilen.',
    longDescription:
      'Sett framåt från förarplatsen vid en korsning på landsbygden. Till vänster står ett rött åttkantigt stoppmärke tillsammans med ett blått märke. Rakt framför korsar en röd ledbuss från höger till vänster.',
    caption: 'Vid stopplikt ska fordonet stanna helt, oavsett om något kommer eller inte.',
    usage: 'question-image',
    asset: 'vajningsregler/stopplikt-buss',
    width: 960,
    height: 540,
    status: 'approved',
  }),
  img({
    id: 'oskyltad-korsning',
    sourcePage: 31,
    title: 'Oskyltad korsning på stadsgata',
    topic: 'vajningsregler',
    subcategory: 'hogerregeln',
    chapter: 'vajningsregler',
    altText: 'Korsning mellan bostadsgator utan väjningsmärken, med en bil på tvärgatan.',
    longDescription:
      'En korsning mellan två bostadsgator, sedd framåt från förarplatsen. Det finns inga väjningspliktsmärken, inga stoppmärken och ingen trafiksignal vid korsningen. Ett höstträd står i mitten av bilden och en bil skymtar på den korsande gatan.',
    caption: 'Utan märken och signaler är det högerregeln som gäller.',
    usage: 'theory-lesson',
    asset: 'vajningsregler/oskyltad-korsning',
    width: 960,
    height: 540,
    status: 'approved',
  }),
  img({
    id: 'lastbil-korsar',
    sourcePage: 34,
    title: 'Lastbil korsar framför',
    topic: 'vajningsregler',
    subcategory: 'vajningsplikt',
    chapter: 'vajningsregler',
    altText: 'En stor lastbil kör in i korsningen framför bilen på en vinterdag.',
    longDescription:
      'Sett framåt från förarplatsen mot en öppen korsning med snö på marken. En stor lastbil kommer från höger och är på väg in i korsningen framför dig.',
    caption: 'Ett tungt fordon behöver längre tid genom korsningen än en personbil.',
    usage: 'question-image',
    asset: 'vajningsregler/lastbil-korsar',
    width: 960,
    height: 540,
    status: 'approved',
  }),
  img({
    id: 'stop-flervagsstopp',
    sourcePage: 21,
    title: 'Stoppmärke med tilläggstavlan Flervägsstopp',
    topic: 'vajningsregler',
    subcategory: 'stopplikt',
    chapter: 'vajningsregler',
    altText: 'Ett rött stoppmärke med en vit tilläggstavla där det står Flervägsstopp.',
    longDescription:
      'Närbild på ett rött åttkantigt stoppmärke med texten STOP. Under märket sitter en vit tilläggstavla med texten Flervägsstopp. I bakgrunden syns ett gult bostadshus och en korsning.',
    caption: 'Tilläggstavlan talar om att alla tillfarter till korsningen har stopplikt.',
    usage: 'question-image',
    asset: 'vajningsregler/stop-flervagsstopp',
    width: 960,
    height: 960,
    status: 'approved',
  }),
  img({
    id: 'overgangsstalle-vajningsplikt',
    sourcePage: 45,
    title: 'Övergångsställe före cirkulationsplats',
    topic: 'vajningsregler',
    subcategory: 'oskyddade-trafikanter',
    chapter: 'vajningsregler',
    altText:
      'Ett övergångsställe med märken för övergångsställe, väjningsplikt och cirkulationsplats på samma stolpe.',
    longDescription:
      'Sett framåt från förarplatsen mot ett målat övergångsställe. På en stolpe till vänster sitter tre märken över varandra: överst märket för övergångsställe, därunder märket för väjningsplikt och underst märket för cirkulationsplats. I bakgrunden syns höghus och en bil.',
    caption: 'Flera märken på samma stolpe gäller samtidigt — läs dem uppifrån och ner.',
    usage: 'theory-lesson',
    asset: 'vajningsregler/overgangsstalle-vajningsplikt',
    width: 960,
    height: 960,
    status: 'retired',
    notes: 'Passagerlektionen har redan cykeloverfart och huvudled-cykelpassage. En tredje bild på samma sida blir dekoration.',
  }),

  /* ---- Passager --------------------------------------------------------- */
  img({
    id: 'obevakat-overgangsstalle',
    sourcePage: 47,
    title: 'Obevakat övergångsställe',
    topic: 'passager',
    subcategory: 'oskyddade-trafikanter',
    chapter: 'passager',
    altText:
      'Ett övergångsställe utan trafiksignal där en röd pil pekar mot en gående vid vägkanten.',
    longDescription:
      'En stadsgata sedd framåt från förarplatsen. Tvärs över vägen löper ett målat övergångsställe utan trafiksignal. En röd pil i bilden pekar ner mot en person som står vid vänster vägkant, i höjd med övergångsstället. En bil kör framför dig i samma riktning.',
    caption: 'Personen vid kanten är just på väg ut på övergångsstället.',
    usage: 'question-image',
    asset: 'passager/obevakat-overgangsstalle',
    width: 960,
    height: 540,
    status: 'approved',
  }),
  img({
    id: 'cykelpassage-landsvag',
    sourcePage: 51,
    title: 'Cykelpassage på landsväg',
    topic: 'passager',
    subcategory: 'cykelpassage-overfart',
    chapter: 'passager',
    altText:
      'En landsväg med målad cykelpassage tvärs över vägbanan och märken för övergångsställe på båda sidor.',
    longDescription:
      'En landsväg genom skog, sedd framåt från förarplatsen. Tvärs över vägbanan löper en cykelpassage markerad med målade rutor. På båda sidor av vägen står märken för övergångsställe. En röd pil pekar mot passagen. Det finns ingen väjningslinje för biltrafiken.',
    caption: 'Rutor i vägbanan men ingen väjningslinje: detta är en cykelpassage, inte en cykelöverfart.',
    usage: 'theory-lesson',
    asset: 'passager/cykelpassage-landsvag',
    width: 960,
    height: 540,
    status: 'retired',
    notes: 'Samma sak: passagerlektionen täcker skillnaden passage/överfart med två bilder redan.',
  }),
  img({
    id: 'overgangsstalle-cykelpassage',
    sourcePage: 52,
    title: 'Övergångsställe kombinerat med cykelpassage',
    topic: 'passager',
    subcategory: 'cykelpassage-overfart',
    chapter: 'passager',
    altText:
      'En stadskorsning där ett övergångsställe och en cykelpassage löper bredvid varandra tvärs över vägen.',
    longDescription:
      'En bred stadsgata sedd framåt från förarplatsen. Tvärs över vägbanan löper ett övergångsställe med breda vita ränder, och intill det en cykelpassage markerad med rutor. På en stolpe till höger sitter märket för övergångsställe tillsammans med ett märke för väjningsplikt. En buss och flera bilar syns längre bort.',
    caption: 'Övergångsställe och cykelpassage kombineras ofta — men skyldigheterna skiljer sig åt.',
    usage: 'question-image',
    asset: 'passager/overgangsstalle-cykelpassage',
    width: 960,
    height: 540,
    status: 'approved',
  }),
  img({
    id: 'cykelbana-korsning',
    sourcePage: 54,
    title: 'Cykelbana vid vägkorsning',
    topic: 'passager',
    subcategory: 'cykelpassage-overfart',
    chapter: 'passager',
    altText:
      'En vägkorsning där en cykelbana är markerad med bokstäverna A och B på var sin sida av vägen.',
    longDescription:
      'En korsning i utkanten av ett bostadsområde, sedd framåt från förarplatsen. En cykelbana löper längs vägen och är markerad med bokstaven A på vänster sida av korsningen och B på höger sida. Mellan A och B saknas målad cykelpassage tvärs över körbanan.',
    caption: 'Cykelbanan slutar vid A och börjar igen vid B — den är alltså bruten och korsar inte vägen.',
    usage: 'question-image',
    asset: 'passager/cykelbana-korsning',
    width: 960,
    height: 540,
    status: 'approved',
  }),
  img({
    id: 'cykeloverfart',
    sourcePage: 55,
    title: 'Cykelöverfart före cirkulationsplats',
    topic: 'passager',
    subcategory: 'cykelpassage-overfart',
    chapter: 'passager',
    altText:
      'En cykelöverfart med eget vägmärke, målade rutor i vägbanan och en väjningslinje för biltrafiken.',
    longDescription:
      'Sett framåt från förarplatsen mot en upphöjd passage strax före en cirkulationsplats. Tvärs över vägbanan löper målade rutor, och framför dem finns en väjningslinje av trianglar för biltrafiken. På stolpar till höger sitter märket för cykelöverfart tillsammans med märken för övergångsställe och cirkulationsplats.',
    caption: 'Vägmärke, rutor och väjningslinje tillsammans: det här är en cykelöverfart.',
    usage: 'question-image',
    asset: 'passager/cykeloverfart',
    width: 960,
    height: 540,
    status: 'approved',
  }),
  img({
    id: 'gangbana-utfart',
    sourcePage: 49,
    title: 'Gångbana vid utfart',
    topic: 'passager',
    subcategory: 'oskyddade-trafikanter',
    chapter: 'passager',
    altText: 'En utfart från en fastighet där en röd pil visar färdvägen över en gångbana.',
    longDescription:
      'En smal utfart mellan hus, sedd framåt från förarplatsen. En röd pil visar färdriktningen ut mot gatan. På vägen ut korsar färdvägen en gångbana som löper längs husfasaden.',
    caption: 'På väg ut korsar du gångbanan — och har väjningsplikt mot dem som går där.',
    usage: 'theory-lesson',
    asset: 'passager/gangbana-utfart',
    width: 960,
    height: 540,
    status: 'approved',
  }),

  /* ---- Cirkulationsplats ------------------------------------------------ */
  img({
    id: 'cirkulation-med-trafik',
    sourcePage: 65,
    title: 'Infart till cirkulationsplats med trafik',
    topic: 'cirkulationsplats',
    subcategory: 'cirkulationsplats',
    chapter: 'cirkulationsplats',
    altText:
      'Infart till en cirkulationsplats med märken för väjningsplikt och cirkulationsplats, och en gul bil inne i cirkulationen.',
    longDescription:
      'Sett framåt från förarplatsen mot infarten till en cirkulationsplats. På stolpar står märket för väjningsplikt tillsammans med märket för cirkulationsplats, på båda sidor av infarten. En gul bil kör redan inne i cirkulationen, från höger. En röd pil märkt A visar din färdriktning in mot cirkulationsplatsen.',
    caption: 'Fordonet i cirkulationen är redan inne — du som ska in har väjningsplikt.',
    usage: 'question-image',
    asset: 'cirkulationsplats/cirkulation-med-trafik',
    width: 960,
    height: 540,
    status: 'approved',
  }),
  img({
    id: 'rund-korsning-utan-skylt',
    sourcePage: 63,
    title: 'Cirkelformad korsning utan märke',
    topic: 'cirkulationsplats',
    subcategory: 'cirkulationsplats',
    chapter: 'cirkulationsplats',
    altText:
      'En cirkelformad vägkorsning med en gräsbevuxen mittrefug, utan märke för cirkulationsplats och utan väjningspliktsmärke.',
    longDescription:
      'Sett framåt från förarplatsen mot en rundad vägkorsning med en gräsbevuxen ö i mitten. Det finns inget märke för cirkulationsplats och inget märke för väjningsplikt vid infarten. Byggnader och en parkering syns i bakgrunden.',
    caption: 'Rund form, men inga märken — det här är ingen cirkulationsplats.',
    usage: 'question-image',
    asset: 'cirkulationsplats/rund-korsning-utan-skylt',
    width: 960,
    height: 540,
    status: 'approved',
    notes: 'Bra motexempel: formen lockar till fel slutsats.',
  }),

  /* ---- Parkering -------------------------------------------------------- */
  img({
    id: 'p-skylt-avgift-boende',
    sourcePage: 67,
    title: 'Parkeringsmärke med avgift och boendeparkering',
    topic: 'parkering',
    subcategory: 'parkeringsregler',
    chapter: 'stanna-parkera',
    altText:
      'Ett blått parkeringsmärke med tilläggstavlor om avgift klockan 7 till 19, taxa 3, onsdag 0 till 6 och boendeparkering.',
    longDescription:
      'Närbild på en stolpe med ett blått parkeringsmärke. Under märket sitter flera tilläggstavlor: överst en blå tavla med texten Avgift 7–19, inom parentes 11–17, och Taxa 3. Därunder en gul tavla med en röd ring och texten Onsd 0–6. Underst en vit tavla med texten Boende. I bakgrunden syns en gata med husfasader.',
    caption: 'Tilläggstavlorna läses uppifrån och ner och gäller alla samtidigt.',
    usage: 'question-image',
    asset: 'parkering/p-skylt-avgift-boende',
    width: 960,
    height: 960,
    status: 'approved',
  }),
  img({
    id: 'p-skylt-tidsbegransning',
    sourcePage: 75,
    title: 'Parkeringsmärke med tidsbegränsning',
    topic: 'parkering',
    subcategory: 'parkeringsregler',
    chapter: 'stanna-parkera',
    altText:
      'Ett blått parkeringsmärke med tilläggstavlor om 2 timmar klockan 9 till 18 och en gul tavla om torsdag 7 till 9.',
    longDescription:
      'En stolpe vid en gata med ett stort blått parkeringsmärke. Under det sitter en blå tilläggstavla med texten 2 tim, 9–18, och inom parentes 9–15. Underst sitter en gul tilläggstavla med en röd ring och texten 1/12–31/5 Torsdag 7–9. Gatan och husfasader syns i bakgrunden.',
    caption: 'Siffror inom parentes gäller lördag; röd ring på gul botten betyder förbud.',
    usage: 'question-image',
    asset: 'parkering/p-skylt-tidsbegransning',
    width: 960,
    height: 540,
    status: 'approved',
  }),
  img({
    id: 'forbud-att-stanna',
    sourcePage: 70,
    title: 'Förbud att stanna vid övergångsställe',
    topic: 'parkering',
    subcategory: 'stannande-forbud',
    chapter: 'stanna-parkera',
    altText:
      'Ett märke om förbud att stanna och parkera står strax efter ett övergångsställe på en stadsgata.',
    longDescription:
      'En gata sedd framåt från förarplatsen. Tvärs över vägbanan löper ett målat övergångsställe. På en stolpe till höger sitter märket för övergångsställe och under det ett blått runt märke med rött kryss, som betyder förbud att stanna och parkera.',
    caption: 'Ett stannandeförbud gäller från märket och i färdriktningen.',
    usage: 'theory-lesson',
    asset: 'parkering/forbud-att-stanna',
    width: 960,
    height: 540,
    status: 'approved',
  }),

  /* ---- Omkörning -------------------------------------------------------- */
  img({
    id: 'traktor-vintervag',
    sourcePage: 100,
    title: 'Långsamt fordon på vinterväg',
    topic: 'omkorning',
    subcategory: 'omkorningsregler',
    chapter: 'omkorningar',
    altText: 'En traktor med varningsskylt kör långsamt framför bilen på en snömodig landsväg.',
    longDescription:
      'En landsväg med snö vid vägkanterna och snömodd i körfälten, sedd framåt från förarplatsen. Ett långsamtgående fordon med en röd och gul varningsskylt baktill kör i samma riktning en bit framför dig. Vägen är rak men vägbanan är blöt och delvis snötäckt.',
    caption: 'Ett långsamt fordon frestar till omkörning — men väglaget bestämmer vad som är möjligt.',
    usage: 'question-image',
    asset: 'omkorning/traktor-vintervag',
    width: 960,
    height: 540,
    status: 'approved',
  }),
  img({
    id: 'motande-landsvag',
    sourcePage: 101,
    title: 'Möte på landsväg',
    topic: 'omkorning',
    subcategory: 'mote',
    chapter: 'omkorningar',
    altText: 'En mötande vit bil ligger nära mittlinjen på en smal landsväg.',
    longDescription:
      'En landsväg genom skog, sedd framåt från förarplatsen. En vit bil möter dig och ligger nära mittlinjen. Vägen har ett körfält i vardera riktningen och gräsbevuxna kanter.',
    caption: 'Vid möte är sidoavståndet det du faktiskt kan påverka.',
    usage: 'theory-lesson',
    asset: 'omkorning/motande-landsvag',
    width: 960,
    height: 540,
    status: 'retired',
    notes:
      'Samma fotografi som omkorning-landsvag. Kurerades två gånger under olika slug; den posten är den som används.',
  }),

  /* ---- Järnvägskorsningar ----------------------------------------------- */
  img({
    id: 'plankorsning-bommar',
    sourcePage: 107,
    title: 'Plankorsning med bommar',
    topic: 'jarnvag',
    subcategory: 'plankorsning-marken',
    chapter: 'jarnvagskorsningar',
    altText:
      'En järnvägskorsning med röd-vita kryssmärken och bommar tvärs över vägen.',
    longDescription:
      'En järnvägskorsning sedd framåt från förarplatsen. På båda sidor av vägen står höga stolpar med röd-vita kryssmärken och ljussignaler. Bommar sträcker sig ut över vägbanan. Spåret korsar vägen vinkelrätt och ett industriområde syns i bakgrunden.',
    caption: 'Kryssmärket är plankorsningens kännetecken. Bommarna gör att omkörningsförbudet upphör.',
    usage: 'question-image',
    asset: 'jarnvag/plankorsning-bommar',
    width: 960,
    height: 960,
    status: 'approved',
  }),
  img({
    id: 'plankorsning-ljussignal',
    sourcePage: 108,
    title: 'Plankorsning med ljussignal i stadsmiljö',
    topic: 'jarnvag',
    subcategory: 'plankorsning-marken',
    chapter: 'jarnvagskorsningar',
    altText:
      'En plankorsning mitt i en stad med kryssmärke, ljussignal och bom vid vägbanan.',
    longDescription:
      'En plankorsning i tät stadsmiljö, sedd framåt från förarplatsen. Till höger står en stolpe med kryssmärke, en ljussignal med runda lampor och en fälld bom vid kanten. Spåret löper tvärs över gatan framför en modern byggnad med mönstrad fasad.',
    caption: 'Plankorsningar finns även mitt inne i städer, där sikten ofta är sämst.',
    usage: 'theory-lesson',
    asset: 'jarnvag/plankorsning-ljussignal',
    width: 960,
    height: 540,
    status: 'approved',
  }),

  /* ---- Speciella gator --------------------------------------------------- */
  img({
    id: 'gangfartsomrade',
    sourcePage: 119,
    title: 'Gångfartsområde',
    topic: 'speciella-gator',
    subcategory: 'anvisningsmarken',
    chapter: 'speciella-gator',
    altText:
      'En stensatt gata med blå märken för gångfartsområde på båda sidor av infarten.',
    longDescription:
      'En stensatt gata i en äldre stadskärna, sedd framåt från förarplatsen. På båda sidor av infarten står blå fyrkantiga märken som visar gångfartsområde, med symboler för gående, hus och en bil. Vägbanan saknar körfältsmarkeringar och ligger i nivå med gångytorna.',
    caption: 'I ett gångfartsområde gäller gångfart, väjningsplikt mot gående och parkeringsförbud.',
    usage: 'question-image',
    asset: 'speciella-gator/gangfartsomrade',
    width: 960,
    height: 540,
    status: 'approved',
  }),

  /* ---- Vinter ------------------------------------------------------------ */
  img({
    id: 'vintervag-hjulspar',
    sourcePage: 124,
    title: 'Vinterväg med hjulspår',
    topic: 'vinter',
    subcategory: 'vinterkorning',
    chapter: 'vinter',
    altText: 'En snötäckt väg där hjulspår har frilagt asfalten och en lastbil möter längre fram.',
    longDescription:
      'En landsväg vintertid, sedd framåt från förarplatsen. Snö täcker vägbanan utom i två hjulspår där asfalten syns. Snövallar ligger längs kanterna och en lastbil kommer emot dig längre fram. Vägen är rak och omgiven av avlövade träd.',
    caption: 'Mellan hjulspåren och utanför dem kan greppet skilja sig kraftigt.',
    usage: 'theory-lesson',
    asset: 'vinter/vintervag-hjulspar',
    width: 960,
    height: 540,
    status: 'approved',
  }),

  /* ---- Vägmärken i verklig miljö --------------------------------------- */
  img({
    id: 'motorvag-portal-vagvisare',
    sourcePage: 89,
    title: 'Vägvisning över motorväg',
    topic: 'vagmarken',
    subcategory: 'anvisningsmarken',
    chapter: 'vagmarken',
    altText:
      'En motorväg med en portal över körbanan. Till vänster en grön vägvisare mot E6 Oslo och E20 E45 Malmö, till höger en blå vägvisare mot Mölndal och Kållered med en pil som böjer av åt höger.',
    longDescription:
      'Sett framåt från förarplatsen på en motorväg med tre körfält. Över körbanan hänger två vägvisare. Den vänstra är grön och visar den fortsatta färden rakt fram mot E6 Oslo och E20 E45 Malmö. Den högra är blå, gäller avfarten och visar Mölndal, Kållered och Liseberg med en pil som böjer av uppåt höger. Ovanför den blå skylten sitter ett litet gult avfartsnummer.',
    caption:
      'Grön botten visar den fortsatta motorvägsfärden, blå botten det du når via avfarten.',
    usage: 'question-image',
    asset: 'vagmarken/motorvag-portal-vagvisare',
    width: 960,
    height: 959,
    status: 'approved',
  }),
  img({
    id: 'korfaltsvagvisare-korsning',
    sourcePage: 84,
    title: 'Vägvisare före korsning',
    topic: 'vagmarken',
    subcategory: 'anvisningsmarken',
    chapter: 'vagmarken',
    altText:
      'En bred väg mot en korsning. Till höger står en blå vägvisartavla med flera färdmål och pilar som pekar rakt fram, åt höger och mot centrum.',
    longDescription:
      'Sett framåt från förarplatsen på en flerfilig väg som närmar sig en korsning. Till höger om vägen står en stor blå vägvisartavla med flera rader: färdmål rakt fram, färdmål åt höger, och längst ned en pil mot Centrum. En bil kör framför i det vänstra körfältet, och grönska skiljer körbanorna åt.',
    caption: 'Vägvisaren talar om vilket körfält som leder dit du ska — läs den i god tid.',
    usage: 'question-image',
    asset: 'vagmarken/korfaltsvagvisare-korsning',
    width: 960,
    height: 540,
    status: 'approved',
  }),
  img({
    id: 'hastighet-100-ledsnummer',
    sourcePage: 95,
    title: 'Hastighet och huvudled på landsväg',
    topic: 'vagmarken',
    subcategory: 'hastighetsgranser',
    chapter: 'vagmarken',
    altText:
      'En landsväg med räcke. Till höger sitter en hastighetsskylt med siffran 100, under den en gul romb för huvudled, och under den en blå skylt med vägnumren 55 och 56.',
    longDescription:
      'Sett framåt från förarplatsen på en bred landsväg med vajerräcke på båda sidor. På en stolpe till höger sitter tre märken ovanför varandra: överst en rund skylt med gul botten, röd ram och siffran 100, i mitten en gul romb med vit ram som anger huvudled, och underst en blå skylt med vägnumren 55 och 56.',
    caption: 'Tre märken på samma stolpe: högsta hastighet, huvudled och vägnummer.',
    usage: 'question-image',
    asset: 'vagmarken/hastighet-100-ledsnummer',
    width: 960,
    height: 540,
    status: 'approved',
  }),
  img({
    id: 'avfart-hastighet-50',
    sourcePage: 92,
    title: 'Avfart med sänkt hastighet',
    topic: 'vagmarken',
    subcategory: 'pafart-avfart',
    chapter: 'vagmarken',
    altText:
      'En motorväg där ett körfält viker av åt höger. En röd pil pekar mot avfarten, och vid den sitter en hastighetsskylt med siffran 50.',
    longDescription:
      'Sett framåt från förarplatsen på en motorväg med flera körfält. Ett körfält viker av åt höger som avfart, markerat med en röd pil i bilden. Vid avfarten sitter en rund hastighetsskylt med siffran 50 och ovanför den en blå skylt. Bilar kör framför i de genomgående körfälten.',
    caption: 'Hastigheten på avfarten gäller avfarten — inte den motorväg du lämnar.',
    usage: 'question-image',
    asset: 'vagmarken/avfart-hastighet-50',
    width: 960,
    height: 540,
    status: 'approved',
  }),
  img({
    id: 'plankorsning-kryssmarken',
    sourcePage: 107,
    title: 'Plankorsning med kryssmärken och bommar',
    topic: 'vagmarken',
    subcategory: 'plankorsning-marken',
    chapter: 'vagmarken',
    altText:
      'En järnvägskorsning i en tätort. På båda sidor av vägen står röd-vita kryssmärken och fällbara bommar, och spåret korsar vägen framför bilen.',
    longDescription:
      'Sett framåt från förarplatsen mot en plankorsning i en mindre tätort. På båda sidor av vägen står röd-vita kryssmärken på stolpar, tillsammans med uppfällda bommar. Spåret korsar vägen tvärs framför bilen, och bakom korsningen syns en stationsbyggnad. En blå skylt står vid vägkanten till höger.',
    caption: 'Kryssmärket markerar själva korsningen. Bommarna avgör dessutom omkörningsfrågan.',
    usage: 'question-image',
    asset: 'vagmarken/plankorsning-kryssmarken',
    width: 960,
    height: 540,
    status: 'retired',
    notes:
      'Samma fotografi som plankorsning-bommar. Kurerades två gånger under olika slug; den posten är den som används.',
  }),
  img({
    id: 'gagata-skyltad',
    sourcePage: 119,
    title: 'Gågata',
    topic: 'vagmarken',
    subcategory: 'anvisningsmarken',
    chapter: 'vagmarken',
    altText:
      'En smal stenlagd gata mellan husfasader. På båda sidor av infarten sitter blå skyltar för gågata.',
    longDescription:
      'Sett framåt från förarplatsen in mot en smal, stenlagd gata mellan husfasader i en äldre stadskärna. På var sin sida om infarten sitter en blå skylt för gågata. Gatan saknar tydlig uppdelning i körbana och trottoar, och möbler och skyltställ står ute på ytan.',
    caption: 'På gågata får du köra bara för särskilda ändamål, och alltid i gångfart.',
    usage: 'question-image',
    asset: 'vagmarken/gagata-skyltad',
    width: 960,
    height: 540,
    status: 'approved',
  }),
  img({
    id: 'pabjuden-korriktning-parkering',
    sourcePage: 131,
    title: 'Påbjuden körriktning vid parkeringshus',
    topic: 'vagmarken',
    subcategory: 'pabudsmarken',
    chapter: 'vagmarken',
    altText:
      'En infart till ett parkeringshus. Vid vägen står en rund blå skylt med en vit pil som pekar snett uppåt höger, och över körbanan går ett övergångsställe.',
    longDescription:
      'Sett framåt från förarplatsen mot infarten till ett flerfärgat parkeringshus. Vid vägkanten står en rund blå skylt med en vit pil som anger påbjuden körriktning. Tvärs över körbanan framför bilen löper ett målat övergångsställe.',
    caption: 'Rund blå skylt är ett påbud: pilen är inte ett förslag.',
    usage: 'question-image',
    asset: 'vagmarken/pabjuden-korriktning-parkering',
    width: 960,
    height: 960,
    status: 'approved',
  }),

  /* ---- Motorväg -------------------------------------------------------- */
  img({
    id: 'motorvag-bro-korfalt',
    sourcePage: 90,
    title: 'Motorväg med två körfält',
    topic: 'motorvag',
    subcategory: 'motorvag-regler',
    chapter: 'motorvag',
    altText:
      'En motorväg med två körfält i färdriktningen, streckad körfältslinje och en bro tvärs över vägen längre fram.',
    longDescription:
      'Sett framåt från förarplatsen på en motorväg med två körfält i färdriktningen, avgränsade av en streckad linje. Vägrenen till höger är bred och markerad med en heldragen kantlinje. Längre fram går en bro över vägen, och en ensam bil syns i fjärran.',
    caption: 'Grundregeln gäller även här: ligg i högra körfältet när du inte kör om.',
    usage: 'theory-lesson',
    asset: 'motorvag/motorvag-bro-korfalt',
    width: 960,
    height: 540,
    status: 'approved',
  }),
  img({
    id: 'motorvag-stillastaende-fordon',
    sourcePage: 92,
    title: 'Stillastående fordon på vägrenen',
    topic: 'motorvag',
    subcategory: 'motorvag-regler',
    chapter: 'motorvag',
    altText:
      'En motorväg där en vit bil står stilla på vägrenen till höger, medan trafiken passerar i körfälten.',
    longDescription:
      'Sett framåt från förarplatsen på en motorväg med två körfält i färdriktningen. En vit personbil står stilla på vägrenen längre fram till höger, delvis utanför körbanan. Räcke och skogsbryn kantar vägen.',
    caption: 'Ett stillastående fordon på vägrenen betyder människor nära körbanan.',
    usage: 'question-image',
    asset: 'motorvag/motorvag-stillastaende-fordon',
    width: 960,
    height: 540,
    status: 'approved',
  }),
  img({
    id: 'motortrafikled-avsmalning',
    sourcePage: 85,
    title: 'Körfält som tar slut',
    topic: 'motorvag',
    subcategory: 'pafart-avfart',
    chapter: 'motorvag',
    altText:
      'En bred väg där vägbanan smalnar av och pilar målade i körbanan visar att ett körfält går samman med nästa.',
    longDescription:
      'Sett framåt från förarplatsen på en bred väg utanför tätort. I körbanan är pilar målade som visar att körfältet går samman med det till vänster. Kantlinjer och spärrområde markerar avsmalningen, och en blå skylt står vid vägkanten längre fram.',
    caption: 'Vävning fungerar bara om båda parter anpassar farten i tid.',
    usage: 'question-image',
    asset: 'motorvag/motortrafikled-avsmalning',
    width: 960,
    height: 540,
    status: 'approved',
  }),

  /* ---- Landsväg -------------------------------------------------------- */
  img({
    id: 'landsvag-kantlinjer',
    sourcePage: 80,
    title: 'Landsväg med kantlinjer',
    topic: 'landsvag',
    subcategory: 'landsvag',
    chapter: 'landsvag',
    altText:
      'En landsväg genom skogsmark med heldragna kantlinjer på båda sidor och en streckad mittlinje.',
    longDescription:
      'Sett framåt från förarplatsen på en landsväg som går genom skogsmark. Vägen har heldragna vita kantlinjer på båda sidor och en streckad mittlinje. Vägrenen är smal och övergår direkt i grus och vegetation. Långt fram syns ett fordon och en blå skylt.',
    caption: 'Kantlinjen visar var körbanan slutar — inte var det är säkert att köra.',
    usage: 'theory-lesson',
    asset: 'landsvag/landsvag-kantlinjer',
    width: 960,
    height: 540,
    status: 'approved',
  }),
  img({
    id: 'landsvag-omkorningssikt',
    sourcePage: 80,
    title: 'Sikt inför omkörning',
    topic: 'landsvag',
    subcategory: 'omkorningsregler',
    chapter: 'landsvag',
    altText:
      'En landsväg med räcke där två punkter är markerade med bokstäverna A och B, och en röd pil pekar bakåt längs vägen.',
    longDescription:
      'Sett framåt från förarplatsen på en landsväg med vajerräcke till vänster och åkermark till höger. Två punkter längre fram är markerade med bokstäverna A och B, och en röd pil pekar bakåt längs vägen. Vägen är rak och sikten lång.',
    caption: 'Omkörningen kräver fri sikt hela sträckan — inte bara fram till mötande.',
    usage: 'question-image',
    asset: 'landsvag/landsvag-omkorningssikt',
    width: 960,
    height: 540,
    status: 'approved',
  }),
  img({
    id: 'landsvag-vagkant',
    sourcePage: 78,
    title: 'Mjuk vägkant',
    topic: 'landsvag',
    subcategory: 'landsvag',
    chapter: 'landsvag',
    altText:
      'En landsväg i höstmiljö där en röd pil pekar mot den gräsbevuxna vägkanten till höger.',
    longDescription:
      'Sett framåt från förarplatsen på en landsväg med höstfärgade träd. En röd pil i bilden pekar mot vägkanten till höger, där asfalten övergår i gräs och grus utan tydlig kant. Vägen är rak och trafikfri.',
    caption: 'En lös vägkant förlåter inte en hjulnedsläppning i hög fart.',
    usage: 'question-image',
    asset: 'landsvag/landsvag-vagkant',
    width: 960,
    height: 540,
    status: 'approved',
  }),
  img({
    id: 'vagarbete-omledning',
    sourcePage: 82,
    title: 'Vägarbete med omledning',
    topic: 'landsvag',
    subcategory: 'landsvag',
    chapter: 'landsvag',
    altText:
      'Ett vägarbete där gul-svarta pilmarkeringar leder trafiken åt vänster förbi ett avstängt område.',
    longDescription:
      'Sett framåt från förarplatsen mot ett vägarbete. Gul-svarta pilmarkeringar och avstängningsmaterial leder trafiken åt vänster förbi ett uppgrävt område. Betongbarriärer och arbetsfordon står innanför avspärrningen.',
    caption: 'Tillfälliga anvisningar vid vägarbete gäller före de ordinarie märkena.',
    usage: 'question-image',
    asset: 'landsvag/vagarbete-omledning',
    width: 960,
    height: 540,
    status: 'approved',
  }),
  img({
    id: 'omkorning-landsvag',
    sourcePage: 101,
    title: 'Omkörning på landsväg',
    topic: 'landsvag',
    subcategory: 'omkorningsregler',
    chapter: 'omkorningar',
    altText:
      'En landsväg där en vit bil befinner sig i det mötande körfältet under en omkörning.',
    longDescription:
      'Sett framåt från förarplatsen på en landsväg genom skogsmark. En vit personbil är ute i det mötande körfältet under en pågående omkörning och håller på att passera fordonet framför. Vägen har streckad mittlinje och heldragna kantlinjer.',
    caption: 'Under omkörningen är du i mötandes körfält — sikten avgör allt.',
    usage: 'question-image',
    asset: 'landsvag/omkorning-landsvag',
    width: 960,
    height: 540,
    status: 'approved',
  }),
  img({
    id: 'buss-vid-hallplats',
    sourcePage: 105,
    title: 'Buss vid hållplats',
    topic: 'landsvag',
    subcategory: 'omkorningsregler',
    chapter: 'omkorningar',
    altText:
      'En stadsgata där en röd buss står vid en hållplats till höger och en vit skåpbil står parkerad till vänster.',
    longDescription:
      'Sett framåt från förarplatsen på en trädkantad stadsgata. En röd buss står stilla vid en hållplats i högerkanten längre fram. En vit skåpbil står parkerad i vänsterkanten närmare bilen, så att den fria bredden mellan dem är begränsad.',
    caption: 'En stillastående buss betyder människor som kan kliva ut framför den.',
    usage: 'question-image',
    asset: 'landsvag/buss-vid-hallplats',
    width: 960,
    height: 540,
    status: 'approved',
  }),

  /* ---- Vinter ---------------------------------------------------------- */
  img({
    id: 'omkorning-vintervag',
    sourcePage: 100,
    title: 'Omkörning på vinterväg',
    topic: 'vinter',
    subcategory: 'vinterkorning',
    chapter: 'vinter',
    altText:
      'En snötäckt landsväg där ett arbetsfordon kör framför, med snövallar längs båda vägkanterna.',
    longDescription:
      'Sett framåt från förarplatsen på en snötäckt landsväg. Ett långsamtgående arbetsfordon kör framför i samma riktning. Vägbanan är delvis snötäckt med hjulspår, och snövallar kantar vägen på båda sidor. Sikten framåt är god men vägmarkeringarna är dolda.',
    caption: 'Sikten kan vara god samtidigt som greppet inte räcker för omkörningen.',
    usage: 'question-image',
    asset: 'vinter/omkorning-vintervag',
    width: 960,
    height: 540,
    status: 'retired',
    notes:
      'Samma fotografi som traktor-vintervag. Kurerades två gånger under olika slug; den posten är den som används.',
  }),
  img({
    id: 'snotackt-skogsvag',
    sourcePage: 123,
    title: 'Snötäckt skogsväg',
    topic: 'vinter',
    subcategory: 'vinterkorning',
    chapter: 'vinter',
    altText:
      'En helt snötäckt smal väg genom granskog, utan synliga vägmarkeringar.',
    longDescription:
      'Sett framåt från förarplatsen på en smal väg genom snötyngd granskog. Vägbanan är helt snötäckt utan synliga vägmarkeringar eller kantlinjer, och det går inte att se var körbanan slutar och vägkanten börjar.',
    caption: 'Utan synliga markeringar är vägens bredd en gissning — sänk farten.',
    usage: 'theory-lesson',
    asset: 'vinter/snotackt-skogsvag',
    width: 960,
    height: 961,
    status: 'approved',
  }),

];

export const SOURCE_IMAGE_BY_ID: ReadonlyMap<string, SourceImage> = new Map(
  SOURCE_IMAGES.map((image) => [image.id, image]),
);

export function getSourceImage(id: string): SourceImage | undefined {
  return SOURCE_IMAGE_BY_ID.get(id);
}

/** Approved images only — the set the app is allowed to render. */
export const APPROVED_SOURCE_IMAGES: SourceImage[] = SOURCE_IMAGES.filter(
  (image) => image.status === 'approved',
);
