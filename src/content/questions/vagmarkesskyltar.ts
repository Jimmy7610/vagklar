import { buildQuestions, no, ok, sign, teori, trf, tsv, vmf } from './authoring';
import type { AuthoredQuestion } from './authoring';

/**
 * Vägmärken, tränade mot de ritade skyltarna.
 *
 * Uppbyggnaden speglar hur märkessystemet faktiskt fungerar: först formen och
 * färgen, sedan innebörden, sedan de par som förväxlas, och sist tavlorna som
 * ändrar huvudmärket. Många av frågorna är medvetet lätta — grundläggande
 * igenkänning är den bas allt annat vilar på, och den saknades i banken.
 */

const seeds: AuthoredQuestion[] = [
  /* ================= Form och färg — grunden ================= */
  {
    id: 'vmk-001',
    category: 'vagmarken',
    subcategory: 'varningsmarken',
    difficulty: 1,
    ruleTested: 'Varningsmärkenas form och färg',
    prompt: 'Vad betyder ett märke som är en gul triangel med röd ram?',
    answers: [
      ok('Det varnar för något oväntat längre fram.'),
      no('Det förbjuder något.', 'form-farg-system'),
      no('Det talar om att du har företräde.', 'form-farg-system'),
      no('Det påbjuder en viss körriktning.', 'form-farg-system'),
    ],
    short:
      'Gul triangel med röd ram är alltid ett varningsmärke. Det förbereder dig — det ger dig aldrig företräde.',
    memory: 'Triangel varnar, ring förbjuder, blå rund påbjuder, blå fyrkant upplyser.',
    sources: [vmf('2 kap.'), teori('Varningsmärken (A)', 324)],
    tags: ['vagmarke', 'grundregel'],
  },
  {
    id: 'vmk-002',
    category: 'vagmarken',
    subcategory: 'forbudsmarken',
    difficulty: 1,
    ruleTested: 'Förbudsmärkenas form',
    prompt: 'Vilken form och färg har ett förbudsmärke?',
    answers: [
      ok('Rund med röd ram.'),
      no('Rund och helblå.', 'form-farg-system'),
      no('Gul triangel med röd ram.', 'form-farg-system'),
      no('Blå fyrkant.', 'form-farg-system'),
    ],
    short:
      'Den röda ringen är förbudets signatur. En rund blå skylt utan röd ram är tvärtom ett påbud.',
    sources: [vmf('2 kap.'), teori('Förbudsmärken (C)', 329)],
    tags: ['vagmarke', 'grundregel'],
    related: ['vmk-001'],
  },
  {
    id: 'vmk-003',
    category: 'vagmarken',
    subcategory: 'pabudsmarken',
    difficulty: 1,
    ruleTested: 'Påbudsmärkenas innebörd',
    prompt: 'Vad betyder en rund blå skylt med en vit symbol?',
    answers: [
      ok('Ett påbud — så här ska du göra.'),
      no('Ett förbud — så här får du inte göra.', 'form-farg-system'),
      no('En upplysning utan bindande verkan.', 'form-farg-system'),
      no('En varning för något längre fram.', 'form-farg-system'),
    ],
    short:
      'Blå rund skylt påbjuder. Blå fyrkantig skylt upplyser. Skillnaden mellan rund och fyrkantig avgör om det är ett krav eller information.',
    sources: [vmf('2 kap.'), teori('Påbudsmärken (D)', 333)],
    tags: ['vagmarke', 'grundregel'],
    related: ['vmk-001'],
  },

  /* ================= Väjningspliktsmärken ================= */
  {
    id: 'vmk-004',
    category: 'vagmarken',
    subcategory: 'varningsmarken',
    difficulty: 1,
    ruleTested: 'Väjningsplikt (B1)',
    prompt: 'Du närmar dig en korsning med det här märket. Vad krävs av dig?',
    image: sign('vajningsplikt', 'Gul triangel med röd ram och spetsen nedåt.'),
    type: 'road-sign',
    answers: [
      ok('Du har väjningsplikt mot korsande trafik.'),
      no('Du måste stanna helt innan du kör vidare.', 'stopp-vs-vajning'),
      no('Du har företräde framför korsande trafik.', 'stopp-vs-vajning'),
      no('Högerregeln gäller i korsningen.', 'stopp-vs-vajning'),
    ],
    short:
      'Triangeln med spetsen nedåt betyder väjningsplikt. Du behöver inte stanna om vägen är fri, men du ska tydligt sänka farten och visa att du väjer.',
    sources: [vmf('2 kap. B1'), trf('3 kap. 5 §'), teori('Väjningspliktsmärken (B)', 327)],
    tags: ['vagmarke', 'vajningsplikt'],
  },
  {
    id: 'vmk-005',
    category: 'vagmarken',
    subcategory: 'varningsmarken',
    difficulty: 1,
    ruleTested: 'Huvudled (B4)',
    prompt: 'Du kör på en väg där det här märket är uppsatt. Vem väjer för vem?',
    image: sign('huvudled', 'Gul kvadrat ställd på hörn med vit ram.'),
    type: 'road-sign',
    answers: [
      ok('Du kör på huvudled — korsande trafik har väjningsplikt mot dig.'),
      no('Du har väjningsplikt mot korsande trafik.', 'huvudled-innebord'),
      no('Du närmar dig en cirkulationsplats.', 'huvudled-innebord'),
      no('Parkering är tillåten längs vägen.', 'huvudled-innebord'),
    ],
    short:
      'Den gula romben betyder huvudled. Korsande trafik väjer för dig — men företräde är något du får, inte något du tar.',
    deep:
      'Huvudleden gäller tills den upphör med B5, eller tills du kör in i en cirkulationsplats, där den tar slut. Utanför tättbebyggt område är det dessutom förbjudet att parkera på huvudled.',
    sources: [vmf('2 kap. B4'), teori('Väjningspliktsmärken (B)', 327)],
    tags: ['vagmarke', 'huvudled'],
  },
  {
    id: 'vmk-006',
    category: 'vagmarken',
    subcategory: 'varningsmarken',
    difficulty: 2,
    ruleTested: 'Huvudled upphör (B5)',
    prompt: 'Du passerar det här märket. Vad gäller i nästa korsning, om inget annat är skyltat?',
    image: sign('huvudled-upphor', 'Gul kvadrat på hörn med vit ram och ett svart streck tvärs över.'),
    type: 'road-sign',
    answers: [
      ok('Högerregeln gäller.'),
      no('Du har fortfarande företräde eftersom du kör på samma väg.', 'huvudled-slutar'),
      no('Du får väjningsplikt mot all korsande trafik.', 'huvudled-slutar'),
      no('Du måste stanna i korsningen.', 'huvudled-slutar'),
    ],
    short:
      'Strecket över märket betyder att huvudleden slutar. Efter det gäller högerregeln, om inget annat anges.',
    deep:
      'Det här är den plats där förare oftast behåller känslan av företräde för länge. Ett slutmärke ändrar ingenting i vägens utseende — bara i vem som ska väja.',
    sources: [vmf('2 kap. B5'), trf('3 kap. 18 §'), teori('Väjningspliktsmärken (B)', 327)],
    tags: ['vagmarke', 'huvudled'],
    related: ['vmk-005'],
  },
  {
    id: 'vmk-007',
    category: 'vagmarken',
    subcategory: 'varningsmarken',
    difficulty: 2,
    ruleTested: 'Stopplikt kontra väjningsplikt',
    prompt:
      'Du närmar dig en korsning med stopplikt. Sikten är fri och ingen annan trafik syns. Vad gäller?',
    image: sign('stopp', 'Röd åttakantig skylt med texten STOPP.'),
    type: 'road-sign',
    answers: [
      ok('Du måste stanna helt, trots att vägen är fri.'),
      no('Du får rulla vidare i låg fart eftersom inget kommer.', 'stopplikt-rullstopp'),
      no('Du behöver bara sänka farten och visa din avsikt.', 'stopplikt-rullstopp'),
      no('Du får köra utan att sakta ner när sikten är fri.', 'stopplikt-rullstopp'),
    ],
    short:
      'Stopplikt betyder att fordonet ska stå helt stilla. Att vägen är fri ändrar ingenting — det är just det som skiljer stopplikt från väjningsplikt.',
    sources: [vmf('2 kap. B2'), trf('3 kap. 5 §'), teori('Väjningspliktsmärken (B)', 327)],
    tags: ['vagmarke', 'stopplikt'],
    related: ['vmk-004'],
  },
  {
    id: 'vmk-008',
    category: 'vagmarken',
    subcategory: 'varningsmarken',
    difficulty: 3,
    ruleTested: 'Flervägsstopp (T14)',
    prompt:
      'Under stoppmärket sitter en tilläggstavla med texten flervägsstopp. Vad innebär den?',
    answers: [
      ok('Att samtliga tillfarter till korsningen har stopplikt.'),
      no('Att du slipper stanna om du kommer från huvudleden.', 'flervagsstopp'),
      no('Att stopplikten gäller flera korsningar framåt.', 'flervagsstopp'),
      no('Att du får köra först eftersom du stannat först.', 'flervagsstopp'),
    ],
    short:
      'Flervägsstopp säger att alla ska stanna — inte att du slipper. När alla har stannat avgör högerregeln vem som kör.',
    deep:
      'Tavlan finns för att du ska veta att den korsande trafiken också stannar, vilket gör situationen läsbar. Den upphäver inte din egen stopplikt och ger dig inget företräde.',
    sources: [vmf('2 kap. T14'), teori('Tilläggstavlor (T)', 346)],
    tags: ['vagmarke', 'tillaggstavla', 'stopplikt'],
    related: ['vmk-007'],
  },

  /* ================= Förbudsmärken ================= */
  {
    id: 'vmk-009',
    category: 'vagmarken',
    subcategory: 'forbudsmarken',
    difficulty: 1,
    ruleTested: 'Förbud mot att parkera (C35)',
    prompt: 'Får du släppa av en passagerare där det här märket sitter?',
    image: sign('forbud-parkera', 'Rund blå skylt med röd ram och ett rött diagonalt streck.'),
    type: 'road-sign',
    answers: [
      ok('Du får stanna, men inte parkera.'),
      no('Du får varken stanna eller parkera.', 'stanna-vs-parkera'),
      no('Du får parkera högst en timme.', 'stanna-vs-parkera'),
      no('Parkering är tillåten endast för boende.', 'stanna-vs-parkera'),
    ],
    short:
      'Ett streck betyder parkeringsförbud. Att stanna för av- och påstigning eller av- och pålastning är fortfarande tillåtet.',
    memory: 'Ett streck: får stanna. Kryss: får inte ens stanna.',
    sources: [vmf('2 kap. C35'), teori('Förbudsmärken (C)', 330)],
    tags: ['vagmarke', 'parkering'],
  },
  {
    id: 'vmk-010',
    category: 'vagmarken',
    subcategory: 'forbudsmarken',
    difficulty: 1,
    ruleTested: 'Förbud mot att stanna och parkera (C39)',
    prompt: 'Du vill stanna en kort stund där det här märket sitter. Är det tillåtet?',
    image: sign('forbud-stanna', 'Rund blå skylt med röd ram och två röda diagonala streck.'),
    type: 'road-sign',
    answers: [
      ok('Du får varken stanna eller parkera.'),
      no('Du får stanna kort men inte parkera.', 'stanna-vs-parkera'),
      no('Du får stanna för av- och påstigning.', 'stanna-vs-parkera'),
      no('Förbudet gäller bara nattetid.', 'stanna-vs-parkera'),
    ],
    short:
      'Två streck som bildar ett kryss är det starkare förbudet. Du får bara stanna om trafiken kräver det eller för att undvika fara.',
    sources: [vmf('2 kap. C39'), teori('Förbudsmärken (C)', 331)],
    tags: ['vagmarke', 'parkering'],
    related: ['vmk-009'],
  },
  {
    id: 'vmk-011',
    category: 'vagmarken',
    subcategory: 'forbudsmarken',
    difficulty: 1,
    ruleTested: 'Förbud mot infart (C1)',
    prompt: 'Du ser det här märket i mynningen av en gata. Vad säger det om gatan?',
    image: sign('forbud-infart', 'Rund röd skylt med ett brett vitt vågrätt streck.'),
    type: 'road-sign',
    answers: [
      ok('Förbud mot infart med fordon.'),
      no('Förbud mot att stanna.', 'forbud-infart-innebord'),
      no('Vägen är avstängd för all trafik, även gående.', 'forbud-infart-innebord'),
      no('Enkelriktad trafik i din färdriktning.', 'forbud-infart-innebord'),
    ],
    short:
      'Märket sitter oftast i mynningen av en enkelriktad gata. Ser du det åt ditt håll är gatan enkelriktad åt det andra.',
    sources: [vmf('2 kap. C1'), teori('Förbudsmärken (C)', 328)],
    tags: ['vagmarke', 'enkelriktat'],
  },
  {
    id: 'vmk-012',
    category: 'vagmarken',
    subcategory: 'forbudsmarken',
    difficulty: 1,
    ruleTested: 'Hastighetsbegränsning (C31)',
    prompt: 'Vilken hastighet anger det här märket, och på vilket sätt?',
    image: sign('hastighet-70', 'Rund skylt med gul botten, röd ram och siffran 70.'),
    type: 'road-sign',
    answers: [
      ok('Högsta tillåtna hastighet är 70 km/h.'),
      no('Rekommenderad hastighet är 70 km/h.', 'rekommenderad-vs-grans'),
      no('Lägsta tillåtna hastighet är 70 km/h.', 'rekommenderad-vs-grans'),
      no('Hastighetsbegränsningen 70 km/h upphör här.', 'rekommenderad-vs-grans'),
    ],
    short:
      'Röd ring betyder förbud: 70 är ett tak. Sikt, väglag och trafik kan kräva betydligt lägre fart.',
    sources: [vmf('2 kap. C31'), teori('Förbudsmärken (C)', 331)],
    tags: ['vagmarke', 'hastighet'],
  },
  {
    id: 'vmk-013',
    category: 'vagmarken',
    subcategory: 'anvisningsmarken',
    difficulty: 2,
    ruleTested: 'Rekommenderad lägre hastighet (E11)',
    prompt: 'Hur ska du läsa siffran på det här märket?',
    image: sign('rekommenderad-hastighet-30', 'Blå rektangulär skylt med en vit ring runt siffran 30.'),
    type: 'road-sign',
    answers: [
      ok('Rekommenderad lägre hastighet är 30 km/h — den skyltade gränsen gäller fortfarande.'),
      no('Högsta tillåtna hastighet är 30 km/h.', 'rekommenderad-vs-grans'),
      no('Lägsta tillåtna hastighet är 30 km/h.', 'rekommenderad-vs-grans'),
      no('Hastighetsbegränsningen upphör och bashastigheten gäller.', 'rekommenderad-vs-grans'),
    ],
    short:
      'Blått är anvisning, rött är förbud. Den blå skylten rekommenderar 30 — den ersätter inte hastighetsbegränsningen.',
    deep:
      'Det praktiska är att platsen ofta är byggd så att 30 km/h är den fart som fungerar. Att köra fortare är kanske tillåtet men sällan lämpligt, och aktsamhetsplikten gäller ändå.',
    sources: [vmf('2 kap. E11'), teori('Anvisningsmärken (E)', 334)],
    tags: ['vagmarke', 'hastighet'],
    related: ['vmk-012'],
  },
  {
    id: 'vmk-014',
    category: 'vagmarken',
    subcategory: 'forbudsmarken',
    difficulty: 2,
    ruleTested: 'Förbud mot omkörning (C27)',
    prompt:
      'Du passerar märket för förbud mot omkörning. Vilket fordon får du fortfarande passera?',
    image: sign('forbud-omkorning', 'Rund skylt med gul botten och röd ram, en röd och en svart bil.'),
    type: 'road-sign',
    answers: [
      ok('En cykel eller en moped — förbudet gäller inte tvåhjuliga fordon.'),
      no('En personbil, om den kör långsamt.', 'omkorningsforbud-omfattning'),
      no('En traktor, eftersom den räknas som ett långsamt fordon.', 'omkorningsforbud-omfattning'),
      no('Inget fordon alls får passeras.', 'omkorningsforbud-omfattning'),
    ],
    short:
      'Omkörningsförbudet gäller motordrivna fordon på fler än två hjul. Cykel och moped får du fortfarande köra om.',
    sources: [vmf('2 kap. C27'), trf('3 kap. 40 §'), teori('Förbudsmärken (C)', 330)],
    tags: ['vagmarke', 'omkorning'],
  },
  {
    id: 'vmk-015',
    category: 'vagmarken',
    subcategory: 'forbudsmarken',
    difficulty: 2,
    ruleTested: 'Slut på förbud mot omkörning (C28)',
    prompt: 'Du passerar det här märket. Vad innebär det?',
    image: sign('forbud-omkorning-upphor', 'Rund skylt med gul botten, röd ram, två svarta bilar och ett streck.'),
    type: 'road-sign',
    answers: [
      ok('Omkörningsförbudet upphör — men omkörning måste ändå vara säker.'),
      no('Omkörning är nu tillåten oavsett sikt och heldragen linje.', 'slutmarke-tillater'),
      no('Omkörningsförbudet börjar gälla här.', 'slutmarke-tillater'),
      no('Du måste köra om det fordon som ligger framför dig.', 'slutmarke-tillater'),
    ],
    short:
      'Ett slutmärke tar bort ett förbud — det ger inget tillstånd. Sikt, mötande trafik och vägmarkeringar avgör fortfarande.',
    sources: [vmf('2 kap. C28'), teori('Förbudsmärken (C)', 330)],
    tags: ['vagmarke', 'omkorning'],
    related: ['vmk-014'],
  },

  /* ================= Påbudsmärken ================= */
  {
    id: 'vmk-016',
    category: 'vagmarken',
    subcategory: 'pabudsmarken',
    difficulty: 1,
    ruleTested: 'Cirkulationsplats (D3)',
    prompt: 'Vad talar det här märket om för dig när du närmar dig platsen?',
    image: sign('cirkulationsplats', 'Rund blå skylt med tre vita pilar i en ring.'),
    type: 'road-sign',
    answers: [
      ok('Cirkulationsplats — kör moturs runt rondellen.'),
      no('Varning för cirkulationsplats längre fram.', 'cirk-marke-vs-varning'),
      no('Du har företräde in i cirkulationsplatsen.', 'cirk-marke-vs-varning'),
      no('Vändplats för fordon.', 'cirk-marke-vs-varning'),
    ],
    short:
      'Märket gör platsen till en cirkulationsplats. Saknas det är en rund korsning en helt vanlig korsning, där högerregeln gäller.',
    sources: [vmf('2 kap. D3'), teori('Påbudsmärken (D)', 333)],
    tags: ['vagmarke', 'cirkulation'],
  },
  {
    id: 'vmk-017',
    category: 'vagmarken',
    subcategory: 'pabudsmarken',
    difficulty: 2,
    ruleTested: 'Påbjuden cykelbana (D4)',
    prompt: 'Du ska svänga in på en väg och korsar då en cykelbana märkt med D4. Vad gäller?',
    image: sign('pabud-cykelbana', 'Rund blå skylt med en vit cykel.'),
    type: 'road-sign',
    answers: [
      ok('Du får korsa cykelbanan, men har väjningsplikt mot cyklisterna på den.'),
      no('Du får inte korsa cykelbanan alls.', 'cykelbana-korsning'),
      no('Cyklisterna har väjningsplikt mot dig.', 'cykelbana-korsning'),
      no('Väjningsplikt gäller bara om det finns en cykelpassage markerad.', 'cykelbana-korsning'),
    ],
    short:
      'D4 gör banan till cykelbana. Det påbudet riktar sig till cyklisterna — för dig betyder det att du bara får korsa banan, och då med väjningsplikt.',
    deep:
      'Ett påbudsmärke talar om vad banan är avsedd för. Konsekvensen för andra trafikanter följer av det: en yta som är avsedd för cykeltrafik får du korsa, inte färdas i.',
    sources: [vmf('2 kap. D4'), trf('3 kap. 61 §'), teori('Påbudsmärken (D)', 333)],
    tags: ['vagmarke', 'cykel'],
  },
  {
    id: 'vmk-018',
    category: 'vagmarken',
    subcategory: 'pabudsmarken',
    difficulty: 2,
    ruleTested: 'Kollektivkörfält (D10)',
    prompt: 'Vad får du göra med ett körfält märkt med D10, kollektivkörfält?',
    image: sign('pabud-kollektivkorfalt', 'Rund blå skylt med en vit buss.'),
    type: 'road-sign',
    answers: [
      ok('Korsa det, till exempel för att svänga — men inte köra i det.'),
      no('Köra i det när köerna i övriga körfält står still.', 'kollektivkorfalt'),
      no('Köra i det om du håller samma fart som bussarna.', 'kollektivkorfalt'),
      no('Varken korsa eller köra i det.', 'kollektivkorfalt'),
    ],
    short:
      'Bussfilen får korsas men inte användas som färdväg. Får andra fordon använda den anges det på en tilläggstavla.',
    sources: [vmf('2 kap. D10'), teori('Kollektivkörfält (bussfil)', 18)],
    tags: ['vagmarke', 'korfalt'],
  },

  /* ================= Anvisningsmärken ================= */
  {
    id: 'vmk-019',
    category: 'vagmarken',
    subcategory: 'anvisningsmarken',
    difficulty: 1,
    ruleTested: 'Motorväg (E1)',
    prompt: 'Vilka regler börjar gälla när du passerar det här märket?',
    image: sign('motorvag', 'Blå rektangulär skylt med en vit stiliserad bro över två körbanor.'),
    type: 'road-sign',
    answers: [
      ok('Motorväg börjar — motorvägens regler gäller från här.'),
      no('Motortrafikled börjar.', 'motorvag-vs-motortrafikled'),
      no('Motorvägen upphör.', 'motorvag-vs-motortrafikled'),
      no('Vägen leder till en färja.', 'motorvag-vs-motortrafikled'),
    ],
    short:
      'Efter märket gäller motorvägens regler: bara motordrivna fordon som får köra minst 40 km/h, och förbud mot att stanna, backa, vända eller gå på vägbanan.',
    sources: [vmf('2 kap. E1'), teori('Anvisningsmärken (E)', 333)],
    tags: ['vagmarke', 'motorvag'],
  },
  {
    id: 'vmk-020',
    category: 'vagmarken',
    subcategory: 'anvisningsmarken',
    difficulty: 2,
    ruleTested: 'Motorväg upphör (E2)',
    prompt: 'Du passerar märket för att motorvägen upphör. Vad är viktigast direkt efter det?',
    image: sign('motorvag-upphor', 'Blå skylt med motorvägssymbolen och ett rött streck tvärs över.'),
    type: 'road-sign',
    answers: [
      ok('Att sänka farten i god tid — du kan möta korsande trafik och gående.'),
      no('Att hålla farten tills en ny hastighetsskylt syns.', 'motorvag-upphor-fart'),
      no('Att byta till vänster körfält.', 'motorvag-upphor-fart'),
      no('Att slå på varningsblinkers.', 'motorvag-upphor-fart'),
    ],
    short:
      'Efter märket kan det finnas korsningar, oskyddade trafikanter och betydligt lägre hastigheter. Fartblindhet efter en lång motorvägssträcka är verklig.',
    sources: [vmf('2 kap. E2'), teori('Anvisningsmärken (E)', 333)],
    tags: ['vagmarke', 'motorvag'],
    related: ['vmk-019'],
  },
  {
    id: 'vmk-023',
    category: 'vagmarken',
    subcategory: 'anvisningsmarken',
    difficulty: 3,
    ruleTested: 'Gågata kontra gångfartsområde',
    prompt: 'Vad är den viktigaste skillnaden mellan en gågata och ett gångfartsområde?',
    answers: [
      ok('På gågatan får du köra bara för särskilda ändamål; i gångfartsområdet får du köra, men på de gåendes villkor.'),
      no('På gågatan är hastigheten 30 km/h, i gångfartsområdet gångfart.', 'gagata-vs-gangfart'),
      no('I gångfartsområdet har gående väjningsplikt mot fordon.', 'gagata-vs-gangfart'),
      no('Gågatan gäller bara sommartid.', 'gagata-vs-gangfart'),
    ],
    short:
      'Gågatan begränsar *vem* som får köra där. Gångfartsområdet begränsar *hur* du får köra.',
    deep:
      'På gågata får du till exempel köra för varutransport eller till en fastighet vid gatan. I båda fallen gäller gångfart och väjningsplikt mot gående, och när du kör ut från området har du väjningsplikt.',
    sources: [vmf('2 kap. E7, E9'), teori('Speciella gator', 116)],
    tags: ['vagmarke', 'gagata', 'gangfart'],

  },
  {
    id: 'vmk-024',
    category: 'vagmarken',
    subcategory: 'anvisningsmarken',
    difficulty: 2,
    ruleTested: 'Tättbebyggt område (E5)',
    prompt: 'Du passerar märket för tättbebyggt område utan att se någon hastighetsskylt. Vad gäller?',
    image: sign('tattbebyggt-omrade', 'Blå rektangulär skylt med vita husiluetter.'),
    type: 'road-sign',
    answers: [
      ok('Bashastigheten 50 km/h.'),
      no('Bashastigheten 70 km/h.', 'bashastighet-tatort'),
      no('30 km/h, eftersom tätorter alltid har sänkt hastighet.', 'bashastighet-tatort'),
      no('Föregående hastighetsbegränsning fortsätter gälla.', 'bashastighet-tatort'),
    ],
    short:
      'Inom tättbebyggt område är bashastigheten 50 km/h. Utanför är den 70 km/h.',
    deep:
      'Märket kompletteras normalt med en hastighetsangivelse. Sitter ett förbudsmärke tillsammans med E5 gäller förbudet i hela området fram till slutmärket E6.',
    sources: [vmf('2 kap. E5'), trf('3 kap. 17 §'), teori('Tättbebyggt område (E5)', 116)],
    tags: ['vagmarke', 'hastighet'],
  },

  /* ================= Tilläggstavlor ================= */
  {
    id: 'vmk-025',
    category: 'vagmarken',
    subcategory: 'anvisningsmarken',
    difficulty: 1,
    ruleTested: 'Tidsangivelse på tilläggstavla (T6)',
    prompt: 'Under ett parkeringsmärke sitter en tavla med svarta siffror: 8–18. När gäller den?',
    image: sign('tavla-tid', 'Vit tilläggstavla med svarta siffror 8–18.'),
    type: 'road-sign',
    answers: [
      ok('Vardagar utom dag före sön- och helgdag.'),
      no('Alla dagar i veckan.', 'parentes-tider'),
      no('Endast lördagar.', 'parentes-tider'),
      no('Endast sön- och helgdagar.', 'parentes-tider'),
    ],
    short:
      'Svarta siffror utan parentes gäller vardagar. Parentes betyder lördag och dag före helgdag, röda siffror sön- och helgdag.',
    memory: 'Svart = vardag. Parentes = lördag. Rött = söndag.',
    sources: [vmf('2 kap. T6'), teori('Tilläggstavlor (T)', 346)],
    tags: ['vagmarke', 'tillaggstavla', 'parkering'],
  },
  {
    id: 'vmk-026',
    category: 'vagmarken',
    subcategory: 'anvisningsmarken',
    difficulty: 2,
    ruleTested: 'Parentestider på tilläggstavla',
    prompt:
      'Under ett parkeringsförbud sitter en tavla med siffrorna (8–14). Det är lördag klockan 10. Vad gäller?',
    image: sign('tavla-tid-lordag', 'Vit tilläggstavla med siffrorna (8–14) inom parentes.'),
    type: 'road-sign',
    answers: [
      ok('Förbudet gäller — parentesen betyder lördag och dag före helgdag.'),
      no('Förbudet gäller inte, eftersom parentesen betyder att tiden är vägledande.', 'parentes-tider'),
      no('Förbudet gäller inte på helger.', 'parentes-tider'),
      no('Förbudet gäller bara mellan 8 och 14 på vardagar.', 'parentes-tider'),
    ],
    short:
      'Parentesen är hela skillnaden: den anger lördag och dag före helgdag. Klockan 10 på en lördag ligger inom 8–14.',
    sources: [vmf('2 kap. T6'), teori('Tilläggstavlor (T)', 346)],
    tags: ['vagmarke', 'tillaggstavla', 'parkering'],
    related: ['vmk-025'],
  },
  {
    id: 'vmk-027',
    category: 'vagmarken',
    subcategory: 'anvisningsmarken',
    difficulty: 3,
    ruleTested: 'Tilläggstavlan Boende (T19)',
    prompt:
      'Under ett parkeringsmärke sitter tavlan "Boende". Du bor i en annan stadsdel. Vad gäller?',
    image: sign('tavla-boende', 'Vit tilläggstavla med texten Boende.'),
    type: 'road-sign',
    answers: [
      ok('Parkeringsrätten gäller inte dig — den är begränsad till boende med tillstånd.'),
      no('Du får parkera, men högst två timmar.', 'boende-tavla'),
      no('Du får parkera mot avgift.', 'boende-tavla'),
      no('Du får parkera på kvällar och helger.', 'boende-tavla'),
    ],
    short:
      'En tilläggstavla kan inskränka huvudmärket till en viss grupp. Har du inte boendetillståndet gäller inte parkeringsrätten dig.',
    sources: [vmf('2 kap. T19'), tsv('Parkeringsregler'), teori('Tilläggstavlor (T)', 346)],
    tags: ['vagmarke', 'tillaggstavla', 'parkering'],
  },
  {
    id: 'vmk-028',
    category: 'vagmarken',
    subcategory: 'anvisningsmarken',
    difficulty: 3,
    ruleTested: 'Avstånd kontra utsträckning',
    prompt: 'Vad är skillnaden mellan tilläggstavlan "Avstånd" (T2) och "Utsträckning" (T11)?',
    answers: [
      ok('Avstånd säger var regeln börjar; utsträckning säger hur långt den gäller.'),
      no('De betyder samma sak men används för olika märkestyper.', 'avstand-vs-utstrackning'),
      no('Avstånd gäller i meter, utsträckning i minuter.', 'avstand-vs-utstrackning'),
      no('Utsträckning säger var regeln börjar och avstånd hur långt den gäller.', 'avstand-vs-utstrackning'),
    ],
    short:
      'T2 pekar framåt mot en punkt. T11 anger en sträcka som börjar vid märket.',
    deep:
      'Skillnaden avgör om du ska leta efter något längre fram eller redan är inne i det som regeln gäller. Under ett parkeringsmärke betyder utsträckning hur lång sträcka platserna omfattar.',
    sources: [vmf('2 kap. T2, T11'), teori('Tilläggstavlor (T)', 346)],
    tags: ['vagmarke', 'tillaggstavla'],
  },
  {
    id: 'vmk-029',
    category: 'vagmarken',
    subcategory: 'anvisningsmarken',
    difficulty: 2,
    ruleTested: 'Tilläggstavlan Riktning (T12)',
    prompt: 'Under ett parkeringsmärke sitter en tavla med en pil. Vad anger den?',
    image: sign('tavla-riktning', 'Vit tilläggstavla med en svart pil.'),
    type: 'road-sign',
    answers: [
      ok('Åt vilket håll från skylten parkeringen gäller.'),
      no('I vilken riktning du ska ställa fordonet.', 'riktning-tavla'),
      no('Att du måste svänga i pilens riktning.', 'riktning-tavla'),
      no('Hur långt parkeringen sträcker sig.', 'riktning-tavla'),
    ],
    short:
      'Riktningstavlan visar om platserna ligger framför eller bakom skylten — inte hur bilen ska stå.',
    sources: [vmf('2 kap. T12'), teori('Tilläggstavlor (T)', 346)],
    tags: ['vagmarke', 'tillaggstavla', 'parkering'],
    related: ['vmk-028'],
  },

  /* ================= Varningsmärken i tillämpning ================= */
  {
    id: 'vmk-030',
    category: 'vagmarken',
    subcategory: 'varningsmarken',
    difficulty: 2,
    ruleTested: 'Varning för vägkorsning (A28)',
    prompt: 'Du ser det här märket. Vem har företräde i korsningen som kommer?',
    image: sign('varning-vagkorsning', 'Gul triangel med röd ram och ett svart kors.'),
    type: 'road-sign',
    answers: [
      ok('Högerregeln gäller — fordon från höger kör först.'),
      no('Du har företräde, eftersom du är förvarnad.', 'varning-ger-foretrade'),
      no('Du har väjningsplikt mot all korsande trafik.', 'varning-ger-foretrade'),
      no('Den som kommer på den bredare vägen kör först.', 'varning-ger-foretrade'),
    ],
    short:
      'Ett varningsmärke reglerar aldrig företrädet. Det varnar för en korsning där högerregeln gäller.',
    memory: 'Varning förbereder. Väjningspliktsmärke reglerar.',
    sources: [vmf('2 kap. A28'), trf('3 kap. 18 §'), teori('Varningsmärken (A)', 325)],
    tags: ['vagmarke', 'hogerregeln'],
    related: ['vmk-001'],
  },
  {
    id: 'vmk-031',
    category: 'vagmarken',
    subcategory: 'varningsmarken',
    difficulty: 1,
    ruleTested: 'Varning för barn (A15)',
    prompt: 'Vad ska du göra när du passerar det här märket?',
    image: sign('varning-barn', 'Gul triangel med röd ram och två gående barnfigurer.'),
    type: 'road-sign',
    answers: [
      ok('Sänka farten och räkna med att ett barn kan springa ut.'),
      no('Tuta för att göra barnen uppmärksamma.', 'varning-barn-reaktion'),
      no('Hålla farten men vara beredd att bromsa.', 'varning-barn-reaktion'),
      no('Ingenting särskilt — barn har väjningsplikt.', 'varning-barn-reaktion'),
    ],
    short:
      'Barn bedömer hastighet och avstånd sämre än vuxna och kan lämna trottoaren utan förvarning. Marginal är det enda som hjälper.',
    sources: [vmf('2 kap. A15'), trf('3 kap. 1 §'), teori('Varningsmärken (A)', 324)],
    tags: ['vagmarke', 'barn'],
  },
  {
    id: 'vmk-032',
    category: 'vagmarken',
    subcategory: 'varningsmarken',
    difficulty: 2,
    ruleTested: 'Varning för slirig väg (A10)',
    prompt: 'Vad varnar det här märket för?',
    image: sign('varning-slirig-vag', 'Gul triangel med röd ram och en bil med slirspår.'),
    type: 'road-sign',
    answers: [
      ok('Varning för slirig väg — vägbanan kan vara halare än den ser ut.'),
      no('Varning för vägarbete.', 'varningsmarken-symbol'),
      no('Förbud mot att köra om.', 'varningsmarken-symbol'),
      no('Varning för sidvind.', 'varningsmarken-symbol'),
    ],
    short:
      'Märket sätts upp där halka är särskilt vanlig. Öka avståndet och undvik kraftiga styr- och bromsrörelser.',
    sources: [vmf('2 kap. A10'), teori('Varningsmärken (A)', 324)],
    tags: ['vagmarke', 'halka'],
  },
  {
    id: 'vmk-033',
    category: 'vagmarken',
    subcategory: 'varningsmarken',
    difficulty: 2,
    ruleTested: 'Järnvägskorsning med eller utan bommar',
    prompt:
      'Två varningsmärken finns för järnvägskorsning: ett med bom och ett med kryss. Vad betyder skillnaden för din omkörningsrätt?',
    answers: [
      ok('Med bommar upphävs omkörningsförbudet; utan bommar står det kvar om inte en fullständig trafiksignal finns.'),
      no('Ingen skillnad — omkörning är alltid förbjuden vid plankorsning.', 'jvg-omkorning'),
      no('Ingen skillnad — omkörning är alltid tillåten vid plankorsning.', 'jvg-omkorning'),
      no('Utan bommar får du köra om, med bommar inte.', 'jvg-omkorning'),
    ],
    short:
      'Bommar eller en trafiksignal med rött, gult och grönt upphäver omkörningsförbudet. Utan dem får bara tvåhjuliga fordon köras om.',
    sources: [vmf('2 kap. A35, A36'), trf('3 kap. 40 §'), teori('Omkörning vid plankorsning', 111)],
    tags: ['vagmarke', 'plankorsning', 'omkorning'],
  },

  /* ================= Vägmarkeringar ================= */
  {
    id: 'vmk-034',
    category: 'vagmarken',
    subcategory: 'vagmarkeringar',
    difficulty: 1,
    ruleTested: 'Heldragen linje',
    prompt: 'Vad betyder en heldragen linje på din sida av mittlinjen?',
    answers: [
      ok('Du får inte köra över den.'),
      no('Du får köra över den vid omkörning om sikten är fri.', 'heldragen-linje'),
      no('Den är en rekommendation om var du bör ligga.', 'heldragen-linje'),
      no('Den markerar var vägrenen börjar.', 'heldragen-linje'),
    ],
    short:
      'Linjen närmast dig styr. Är den heldragen får du inte korsa den — även om föraren i motsatt riktning får korsa sin.',
    sources: [vmf('3 kap. M2'), trf('3 kap. 11 §'), teori('Vägmarkeringar', 350)],
    tags: ['vagmarkering', 'omkorning'],
  },
  {
    id: 'vmk-035',
    category: 'vagmarken',
    subcategory: 'vagmarkeringar',
    difficulty: 1,
    ruleTested: 'Stopplinje',
    prompt: 'Vad anger en heldragen tvärgående linje vid en korsning med stoppmärke?',
    answers: [
      ok('Var du ska stanna.'),
      no('Var du får börja köra om.', 'stopplinje'),
      no('Gränsen för parkeringsförbud.', 'stopplinje'),
      no('Att övergångsställe finns direkt efter.', 'stopplinje'),
    ],
    short:
      'Stopplinjen visar var fordonet ska stå stilla. Saknas den stannar du där du har sikt över korsande trafik.',
    sources: [vmf('3 kap. M13'), teori('Vägmarkeringar', 351)],
    tags: ['vagmarkering', 'stopplikt'],
  },
  {
    id: 'vmk-036',
    category: 'vagmarken',
    subcategory: 'vagmarkeringar',
    difficulty: 2,
    ruleTested: 'Väjningslinje',
    prompt: 'Du ser en rad vita trianglar målade tvärs över körbanan. Vad betyder de?',
    answers: [
      ok('Väjningslinje — du har väjningsplikt och ska lämna företräde här.'),
      no('Att en cykelpassage korsar vägen.', 'vajningslinje'),
      no('Att du måste stanna helt.', 'vajningslinje'),
      no('Att körfältet tar slut.', 'vajningslinje'),
    ],
    short:
      'Väjningslinjen, ofta kallad hajtänder, markerar var väjningsplikten gäller. Den kombineras med märket B1 eller med en cykelöverfart.',
    sources: [vmf('3 kap. M14'), teori('Vägmarkeringar', 351)],
    tags: ['vagmarkering', 'vajningsplikt'],
    related: ['vmk-004'],
  },

  /* ================= Märkeshierarki ================= */
  {
    id: 'vmk-037',
    category: 'vagmarken',
    subcategory: 'varningsmarken',
    difficulty: 3,
    ruleTested: 'Rangordning av anvisningar',
    prompt:
      'En polis vinkar dig att köra fram, men trafiksignalen visar rött. Vad gäller?',
    answers: [
      ok('Polisens tecken gäller före signalen.'),
      no('Signalen gäller före polisens tecken.', 'rangordning-anvisningar'),
      no('Du ska stanna tills signalen slår om till grönt.', 'rangordning-anvisningar'),
      no('Det avgörs av vilket som kom först.', 'rangordning-anvisningar'),
    ],
    short:
      'Ordningen är: polis före trafiksignal, trafiksignal före vägmärke, vägmärke före generella regler.',
    memory: 'Polis — signal — märke — regel.',
    sources: [trf('2 kap. 3 §'), teori('Rangordning av anvisningar', 8)],
    tags: ['vagmarke', 'rangordning'],
  },
  {
    id: 'vmk-038',
    category: 'vagmarken',
    subcategory: 'varningsmarken',
    difficulty: 3,
    ruleTested: 'Vägmärke före generell regel',
    prompt:
      'Du kör i en korsning där högerregeln normalt gäller. Ett väjningspliktsmärke är uppsatt för din väg. Vad gäller?',
    answers: [
      ok('Märket gäller — du har väjningsplikt, oavsett varifrån den andra kommer.'),
      no('Högerregeln gäller ändå, eftersom den är en grundregel.', 'rangordning-anvisningar'),
      no('Du har företräde mot fordon från vänster.', 'rangordning-anvisningar'),
      no('Ni har lika stort ansvar att komma överens.', 'rangordning-anvisningar'),
    ],
    short:
      'Ett vägmärke slår ut den generella regeln. Väjningsplikt gäller mot all korsande trafik, inte bara den från höger.',
    sources: [trf('2 kap. 3 §'), trf('3 kap. 18 §'), teori('Rangordning av anvisningar', 8)],
    tags: ['vagmarke', 'rangordning', 'hogerregeln'],
    related: ['vmk-037'],
  },
];

export const vagmarkesskyltarQuestions = buildQuestions(seeds);
