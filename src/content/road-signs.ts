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
  | 'tillaggstavla';

export interface RoadSign {
  /** Stable id, also the glyph key. */
  id: string;
  /** Code from Vägmärkesförordningen, e.g. "B1". */
  code: string;
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
    code: 'A25',
    name: 'Varning för mötande trafik',
    category: 'varning',
    shortMeaning: 'Mötande trafik börjar på en väg som saknat den.',
    longMeaning:
      'Typiskt där en enkelriktad sträcka eller en fyrfältsväg övergår i tvåvägstrafik. Placera dig åt höger och räkna med möte.',
    altText: 'Varningsmärke: gul triangel med röd ram och två pilar mot varandra, en svart och en röd.',
    tags: ['mote', 'landsvag'],
    similarSignIds: ['vajningsplikt-motande', 'motande-har-vajningsplikt'],
    subcategory: 'varningsmarken',
  }),
  sign({
    id: 'varning-jarnvag-bommar',
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
    code: 'A36',
    name: 'Varning för järnvägskorsning utan bommar',
    category: 'varning',
    shortMeaning: 'Plankorsning utan bommar längre fram.',
    longMeaning:
      'Utan bommar finns ingen fysisk spärr. Sikten längs spåret avgör om du kan rulla över eller måste stanna, och omkörningsförbudet står kvar om inte en fullständig trafiksignal finns.',
    altText: 'Varningsmärke: gul triangel med röd ram och ett kryss som liknar ett kors av två streck.',
    tags: ['plankorsning'],
    similarSignIds: ['varning-jarnvag-bommar'],
    subcategory: 'varningsmarken',
  }),
  sign({
    id: 'varning-djur',
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
    code: 'B2',
    name: 'Stopplikt',
    category: 'vajningsplikt',
    shortMeaning: 'Du måste stanna helt, även om vägen är fri.',
    longMeaning:
      'Stanna vid stopplinjen, eller där du har sikt om linjen saknas. Att rulla långsamt förbi är inte att stanna, oavsett hur fri vägen är.',
    altText: 'Väjningspliktsmärke: röd åttakantig skylt med texten STOPP i vitt.',
    tags: ['stopplikt', 'korsning'],
    similarSignIds: ['vajningsplikt'],
    subcategory: 'stopplikt',
  }),
  sign({
    id: 'huvudled',
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
    code: 'B6',
    name: 'Väjningsplikt mot mötande trafik',
    category: 'vajningsplikt',
    shortMeaning: 'Mötande trafik kör först genom passagen.',
    longMeaning:
      'Sätts upp där vägen smalnar av så att bara ett fordon kommer fram, till exempel vid en bro eller ett avsmalnande parti.',
    altText: 'Rund skylt med gul botten och röd ram, en röd pil uppåt och en svart pil nedåt.',
    tags: ['mote'],
    similarSignIds: ['motande-har-vajningsplikt'],
    subcategory: 'mote',
  }),
  sign({
    id: 'motande-har-vajningsplikt',
    code: 'B7',
    name: 'Mötande trafik har väjningsplikt',
    category: 'vajningsplikt',
    shortMeaning: 'Du kör först genom passagen.',
    longMeaning:
      'Motsatsen till B6, och den lätta att blanda ihop med den. Det avgörande är färgen: den vita pilen är din körriktning, den röda är den som ska vänta.',
    altText: 'Blå rektangulär skylt med en stor vit pil uppåt och en mindre röd pil nedåt.',
    tags: ['mote'],
    similarSignIds: ['vajningsplikt-motande'],
    subcategory: 'mote',
  }),

  /* ================= Förbudsmärken (C) ================= */
  sign({
    id: 'forbud-infart',
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
    code: 'C28',
    name: 'Slut på förbud mot omkörning',
    category: 'forbud',
    shortMeaning: 'Omkörningsförbudet upphör.',
    longMeaning:
      'Att förbudet upphör betyder inte att omkörning är lämplig — sikt, mötande trafik och heldragen linje avgör fortfarande.',
    altText: 'Rund skylt med gul botten och röd ram, två svarta bilar och ett svart streck tvärs över.',
    tags: ['omkorning'],
    similarSignIds: ['forbud-omkorning'],
    subcategory: 'omkorningsforbud',
  }),
  sign({
    id: 'hastighet-30',
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
    code: 'E1',
    name: 'Motorväg',
    category: 'anvisning',
    shortMeaning: 'Motorvägens regler börjar gälla här.',
    longMeaning:
      'Endast motordrivna fordon som får köra minst 40 km/h. Förbjudet att stanna, backa, vända eller gå på vägbanan. Bashastigheten är 110 km/h om inget annat anges.',
    altText: 'Blå rektangulär skylt med en vit stiliserad bro över två körbanor.',
    tags: ['motorvag'],
    similarSignIds: ['motortrafikled', 'motorvag-upphor'],
    subcategory: 'motorvag-regler',
  }),
  sign({
    id: 'motorvag-upphor',
    code: 'E2',
    name: 'Motorväg upphör',
    category: 'anvisning',
    shortMeaning: 'Motorvägens regler slutar gälla.',
    longMeaning:
      'Efter märket kan du möta korsande trafik, gående och betydligt lägre hastigheter. Sänk farten i god tid — fartblindhet efter en lång motorvägssträcka är verklig.',
    altText: 'Blå rektangulär skylt med motorvägssymbolen och ett rött streck tvärs över.',
    tags: ['motorvag'],
    similarSignIds: ['motorvag'],
    subcategory: 'motorvag-regler',
  }),
  sign({
    id: 'motortrafikled',
    code: 'E3',
    name: 'Motortrafikled',
    category: 'anvisning',
    shortMeaning: 'Motortrafikledens regler börjar gälla här.',
    longMeaning:
      'Liknar motorväg men har ofta bara ett körfält i vardera riktningen och kan ha mötande trafik. Bashastigheten är inte 110 km/h — läs skyltarna.',
    altText: 'Blå rektangulär skylt med en vit bil sedd framifrån.',
    tags: ['motortrafikled'],
    similarSignIds: ['motorvag'],
    subcategory: 'motortrafikled',
  }),
  sign({
    id: 'tattbebyggt-omrade',
    code: 'E5',
    name: 'Tättbebyggt område',
    category: 'anvisning',
    shortMeaning: 'Bashastigheten 50 km/h och tätortens regler gäller.',
    longMeaning:
      'Märket kompletteras alltid med en hastighetsangivelse. Sitter ett förbudsmärke tillsammans med det gäller förbudet i hela området fram till slutmärket E6.',
    altText: 'Blå rektangulär skylt med vita husiluetter.',
    tags: ['tatort', 'hastighet'],
    similarSignIds: ['gagata', 'gangfartsomrade'],
    subcategory: 'hastighetsgranser',
  }),
  sign({
    id: 'gagata',
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
    code: 'E11',
    name: 'Rekommenderad lägre hastighet',
    category: 'anvisning',
    shortMeaning: 'En rekommendation, inte en gräns.',
    longMeaning:
      'Blå skylt betyder anvisning, inte förbud. Den skyltade hastighetsbegränsningen gäller fortfarande — men platsen är byggd eller trafikerad så att den lägre farten är lämplig.',
    altText: 'Blå rektangulär skylt med en vit ring runt siffran 30.',
    tags: ['hastighet'],
    similarSignIds: ['hastighet-30'],
    subcategory: 'anvisningsmarken',
  }),
  sign({
    id: 'enkelriktad',
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
    code: 'T2',
    name: 'Avstånd',
    category: 'tillaggstavla',
    shortMeaning: 'Avståndet fram till det som huvudmärket gäller.',
    longMeaning:
      'Tavlan säger var regeln börjar, inte hur långt den sträcker sig. För det används T11 utsträckning.',
    altText: 'Vit rektangulär tilläggstavla med ett avstånd i meter, till exempel 200 m.',
    tags: ['tillaggstavla'],
    similarSignIds: ['tavla-utstrackning'],
    subcategory: 'anvisningsmarken',
  }),
  sign({
    id: 'tavla-utstrackning',
    code: 'T11',
    name: 'Utsträckning',
    category: 'tillaggstavla',
    shortMeaning: 'Hur lång sträcka huvudmärket gäller.',
    longMeaning:
      'Skiljer sig från T2 avstånd: utsträckningen börjar vid märket och gäller den angivna längden framåt.',
    altText: 'Vit rektangulär tilläggstavla med en vågrät linje med ändstreck och en längd i meter.',
    tags: ['tillaggstavla'],
    similarSignIds: ['tavla-avstand', 'tavla-riktning'],
    subcategory: 'anvisningsmarken',
  }),
  sign({
    id: 'tavla-riktning',
    code: 'T12',
    name: 'Riktning',
    category: 'tillaggstavla',
    shortMeaning: 'Åt vilket håll huvudmärket gäller.',
    longMeaning:
      'Vanlig under parkeringsmärken: pilen visar om platserna ligger framför eller bakom skylten.',
    altText: 'Vit rektangulär tilläggstavla med en svart pil.',
    tags: ['tillaggstavla', 'parkering'],
    similarSignIds: ['tavla-utstrackning'],
    subcategory: 'parkeringsregler',
  }),
  sign({
    id: 'tavla-boende',
    code: 'T19',
    name: 'Boende',
    category: 'tillaggstavla',
    shortMeaning: 'Gäller den som har boendetillstånd i området.',
    longMeaning:
      'Tavlan inskränker huvudmärket till en viss grupp. Har du inte tillståndet gäller inte parkeringsrätten dig.',
    altText: 'Vit rektangulär tilläggstavla med texten Boende.',
    tags: ['tillaggstavla', 'parkering'],
    similarSignIds: ['tavla-avgift'],
    subcategory: 'parkeringsregler',
  }),
  sign({
    id: 'tavla-avgift',
    code: 'T16',
    name: 'Avgift',
    category: 'tillaggstavla',
    shortMeaning: 'Parkeringen är avgiftsbelagd.',
    longMeaning:
      'Ofta kombinerad med en tidsangivelse som säger när avgiften tas ut. Utanför de tiderna kan parkeringen vara gratis men fortfarande tidsbegränsad.',
    altText: 'Vit rektangulär tilläggstavla med texten Avgift.',
    tags: ['tillaggstavla', 'parkering'],
    similarSignIds: ['tavla-boende', 'tavla-tid'],
    subcategory: 'parkeringsregler',
  }),
  sign({
    id: 'tavla-flervagsstopp',
    code: 'T14',
    name: 'Flervägsstopp',
    category: 'tillaggstavla',
    shortMeaning: 'Alla tillfarter till korsningen har stopplikt.',
    longMeaning:
      'Tavlan säger inte att du slipper stanna — den säger att de andra också ska stanna. Ordningen avgörs sedan av högerregeln mellan dem som stannat.',
    altText: 'Vit rektangulär tilläggstavla med ett korsningssymbol och ordet STOPP.',
    tags: ['tillaggstavla', 'stopplikt'],
    similarSignIds: ['stopp'],
    subcategory: 'stopplikt',
  }),
  sign({
    id: 'tavla-nedsatt-syn',
    code: 'T9',
    name: 'Nedsatt syn',
    category: 'tillaggstavla',
    shortMeaning: 'Personer med nedsatt syn är vanliga här.',
    longMeaning:
      'Tavlan har alltid gul bottenfärg. Räkna med att den gående inte kan se din bil, och var försiktig med ljud när du väntar.',
    altText: 'Gul rektangulär tilläggstavla med en gående figur med vit käpp.',
    tags: ['tillaggstavla', 'oskyddade'],
    similarSignIds: ['overgangsstalle-b3'],
    subcategory: 'nedsatt-formaga',
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
};
