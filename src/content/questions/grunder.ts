import { buildQuestions, no, ok, sign, tbl, teori, trf, vmf } from './authoring';
import type { AuthoredQuestion } from './authoring';

/**
 * Grunderna.
 *
 * Lätta frågor, men inte triviala. Var och en prövar en enda sak som allt annat
 * vilar på — den sortens kunskap som ska sitta så hårt att den inte kostar
 * någon uppmärksamhet i trafiken.
 *
 * Banken hade för få av dem. Ett prov som bara innehåller svåra frågor mäter
 * inte om grunden finns, och en elev som saknar grunden behöver få veta det
 * innan hon möter kombinationsfrågorna.
 */

const seeds: AuthoredQuestion[] = [
  {
    id: 'grd-001',
    category: 'korsningar',
    subcategory: 'hogerregeln',
    difficulty: 1,
    ruleTested: 'Högerregeln',
    prompt:
      'Du kommer till en korsning utan vägmärken, vägmarkeringar och trafiksignal. Vem kör först?',
    answers: [
      ok('Fordon som kommer från höger.'),
      no('Fordon som kommer från vänster.', 'hoger-utan-skylt'),
      no('Den som kommer först till korsningen.', 'hoger-utan-skylt'),
      no('Den som kör på den bredare vägen.', 'hoger-utan-skylt'),
    ],
    short: 'Utan skyltar och signaler gäller högerregeln: fordon från höger kör först.',
    memory: 'Ingen skylt? Titta höger.',
    sources: [trf('3 kap. 18 §'), teori('Väjningsregler', 22)],
    tags: ['grundregel', 'korsning'],
  },
  {
    id: 'grd-002',
    category: 'trafikregler',
    subcategory: 'trafiksignaler',
    difficulty: 1,
    ruleTested: 'Gult ljus',
    prompt: 'Vad betyder gult ljus i en trafiksignal?',
    answers: [
      ok('Stanna, om du kan göra det utan fara.'),
      no('Öka farten så att du hinner igenom.', 'gult-ljus'),
      no('Kör vidare — gult är en förvarning utan verkan.', 'gult-ljus'),
      no('Stanna alltid, oavsett hur nära korsningen du är.', 'gult-ljus'),
    ],
    short:
      'Gult betyder stopp. Undantaget är att du hunnit så nära att en inbromsning skulle skapa fara, till exempel för fordonet bakom.',
    sources: [trf('3 kap. 4 §'), teori('Trafiksignaler', 40)],
    tags: ['grundregel', 'signal'],
  },
  {
    id: 'grd-003',
    category: 'hastighet',
    subcategory: 'hastighetsgranser',
    difficulty: 1,
    ruleTested: 'Bashastighet utanför tätort',
    prompt:
      'Du kör utanför tättbebyggt område och ser ingen hastighetsskylt. Vilken hastighet gäller?',
    answers: [
      ok('70 km/h.'),
      no('50 km/h.', 'bashastighet-tatort'),
      no('80 km/h.', 'bashastighet-tatort'),
      no('90 km/h.', 'bashastighet-tatort'),
    ],
    short:
      'Bashastigheten är 70 km/h utanför tättbebyggt område och 50 km/h inom. Skyltar gäller alltid före bashastigheten.',
    sources: [trf('3 kap. 17 §'), teori('Hastighet och bashastighet', 9)],
    tags: ['grundregel', 'hastighet'],
  },
  {
    id: 'grd-004',
    category: 'trafikregler',
    subcategory: 'grundregler',
    difficulty: 1,
    ruleTested: 'Bältesanvändning',
    prompt: 'Vem ansvarar för att du som vuxen passagerare använder bilbälte?',
    answers: [
      ok('Du själv, från 15 års ålder.'),
      no('Föraren, oavsett passagerarens ålder.', 'baltesansvar'),
      no('Fordonets ägare.', 'baltesansvar'),
      no('Ingen — bältestvång gäller bara i framsätet.', 'baltesansvar'),
    ],
    short:
      'Från 15 år ansvarar passageraren själv. Föraren ansvarar för att passagerare under 15 år använder bälte.',
    sources: [trf('4 kap. 10 §'), teori('Säkerhetsbälte', 232)],
    tags: ['grundregel', 'krocksakerhet'],
  },
  {
    id: 'grd-005',
    category: 'vagmarken',
    subcategory: 'vagmarkeringar',
    difficulty: 1,
    ruleTested: 'Mittlinje och kantlinje',
    prompt: 'Vad skiljer en mittlinje från en kantlinje?',
    answers: [
      ok('Mittlinjen delar trafik i olika riktningar; kantlinjen visar var körbanan slutar.'),
      no('Mittlinjen är heldragen och kantlinjen streckad.', 'mittlinje-kantlinje'),
      no('Mittlinjen är vit och kantlinjen gul.', 'mittlinje-kantlinje'),
      no('De betyder samma sak på olika vägtyper.', 'mittlinje-kantlinje'),
    ],
    short:
      'Mittlinjen skiljer körriktningar åt. Kantlinjen markerar körbanans ytterkant — utanför den är vägren.',
    sources: [vmf('3 kap.'), teori('Vägmarkeringar', 350)],
    tags: ['grundregel', 'vagmarkering'],
  },
  {
    id: 'grd-006',
    category: 'alkohol',
    subcategory: 'alkohol-gransvarden',
    difficulty: 1,
    ruleTested: 'Grovt rattfylleri',
    prompt: 'Vid vilken alkoholhalt i blodet räknas brottet som grovt rattfylleri?',
    answers: [
      ok('1,0 promille eller mer.'),
      no('0,2 promille eller mer.', 'rattfylleri-grans'),
      no('0,5 promille eller mer.', 'rattfylleri-grans'),
      no('1,5 promille eller mer.', 'rattfylleri-grans'),
    ],
    short:
      'Rattfylleri börjar vid 0,2 promille. Vid 1,0 promille eller mer räknas brottet som grovt, med fängelse i straffskalan.',
    sources: [
      tbl('4 §'),
      teori('Alkohol', 140),
    ],
    tags: ['grundregel', 'alkohol'],
  },
  {
    id: 'grd-007',
    category: 'morker',
    subcategory: 'ljusanvandning',
    difficulty: 1,
    ruleTested: 'Halvljus',
    prompt: 'När måste du använda minst halvljus?',
    answers: [
      ok('I mörker, gryning, skymning och när sikten är nedsatt av väderförhållanden.'),
      no('Endast när det är helt mörkt ute.', 'halvljus-nar'),
      no('Endast utanför tättbebyggt område.', 'halvljus-nar'),
      no('Endast när vägen saknar gatubelysning.', 'halvljus-nar'),
    ],
    short:
      'Kravet gäller inte bara mörker utan också gryning, skymning och nedsatt sikt — till exempel vid regn, dimma eller snöfall.',
    sources: [trf('3 kap. 68 §'), teori('Belysning', 262)],
    tags: ['grundregel', 'morker'],
  },
  {
    id: 'grd-008',
    category: 'trafikregler',
    subcategory: 'vagens-anvandning',
    difficulty: 1,
    ruleTested: 'Fri väg för utryckningsfordon',
    prompt:
      'Ett utryckningsfordon närmar sig bakifrån med blåljus och siren. Vad ska du göra?',
    answers: [
      ok('Lämna fri väg så snart du kan göra det säkert — men aldrig genom att bryta mot rött ljus.'),
      no('Omedelbart stanna där du är, oavsett var på vägen du befinner dig.', 'utryckning-reaktion'),
      no('Köra mot rött om det behövs för att komma undan.', 'utryckning-reaktion'),
      no('Öka farten tills du når en plats där du kan svänga av.', 'utryckning-reaktion'),
    ],
    short:
      'Du ska lämna fri väg, men inte skapa en ny fara för att göra det. Att tvärstanna mitt i en korsning hjälper ingen.',
    deep:
      'Praktiskt betyder det att blinka, sakta ner och dra åt sidan där det finns utrymme. Blockerar du en korsning är det ofta bättre att köra fram några meter och sedan lämna plats.',
    sources: [trf('2 kap. 6 §'), teori('Utryckningsfordon', 39)],
    tags: ['grundregel', 'utryckning'],
  },
  {
    id: 'grd-009',
    category: 'trafikregler',
    subcategory: 'grundregler',
    difficulty: 1,
    ruleTested: 'Aktsamhetsplikten',
    prompt: 'Vad innebär den grundläggande aktsamhetsplikten i trafiken?',
    answers: [
      ok('Att du ska göra vad som krävs för att undvika en olycka, även när någon annan gör fel.'),
      no('Att du bara ansvarar för att följa de skrivna reglerna.', 'foretrade-tas'),
      no('Att den som har företräde saknar ansvar om något händer.', 'foretrade-tas'),
      no('Att ansvaret alltid delas lika mellan inblandade.', 'foretrade-tas'),
    ],
    short:
      'Att ha rätt hjälper inte om olyckan ändå sker. Företräde är något du får, aldrig något du tar.',
    sources: [trf('2 kap. 1 §'), teori('Trafikens grundregler', 6)],
    tags: ['grundregel'],
  },
  {
    id: 'grd-010',
    category: 'fordonet',
    subcategory: 'dack-och-bromsar',
    difficulty: 1,
    ruleTested: 'Mönsterdjup på sommardäck',
    prompt: 'Vilket är det minsta tillåtna mönsterdjupet på ett sommardäck?',
    answers: [
      ok('1,6 mm.'),
      no('3 mm.', 'monsterdjup'),
      no('1,0 mm.', 'monsterdjup'),
      no('5 mm.', 'monsterdjup'),
    ],
    short:
      'Sommardäck kräver minst 1,6 mm. Vinterdäck kräver minst 3 mm när vinterdäckskravet gäller.',
    sources: [teori('Däck', 204)],
    tags: ['grundregel', 'dack'],
  },
  {
    id: 'grd-011',
    category: 'trafikregler',
    subcategory: 'oskyddade-trafikanter',
    difficulty: 1,
    ruleTested: 'Väjningsplikt vid obevakat övergångsställe',
    prompt: 'Vem har väjningsplikt vid ett obevakat övergångsställe?',
    answers: [
      ok('Fordonsföraren, mot gående som är på eller just ska gå ut.'),
      no('Den gående, mot fordon på körbanan.', 'overgang-just-ska-ga'),
      no('Ingen — man får komma överens på plats.', 'overgang-just-ska-ga'),
      no('Fordonsföraren, men bara om den gående redan är ute på vägbanan.', 'overgang-just-ska-ga'),
    ],
    short:
      'Du väjer, och du ska visa det genom att sänka farten eller stanna i god tid. Väjningsplikten gäller även den som just ska gå ut.',
    sources: [trf('3 kap. 61 §'), teori('Obevakat övergångsställe', 46)],
    tags: ['grundregel', 'oskyddade'],
  },
  {
    id: 'grd-012',
    category: 'motorvag',
    subcategory: 'motorvag-regler',
    difficulty: 1,
    ruleTested: 'Förbjudet på motorväg',
    prompt: 'Vilket av följande är förbjudet på motorväg?',
    answers: [
      ok('Att backa, vända eller stanna annat än vid nödsituation.'),
      no('Att köra om till vänster.', 'motorvag-forbud'),
      no('Att köra med släpvagn.', 'motorvag-forbud'),
      no('Att byta körfält.', 'motorvag-forbud'),
    ],
    short:
      'Motorvägens grundförbud gäller att backa, vända, stanna och gå på vägbanan. Omkörning och körfältsbyte är tillåtna som vanligt.',
    sources: [trf('3 kap. 44–48 §§'), teori('Motorväg', 90)],
    tags: ['grundregel', 'motorvag'],
  },
  {
    id: 'grd-013',
    category: 'vagmarken',
    subcategory: 'anvisningsmarken',
    difficulty: 1,
    ruleTested: 'Parkeringsmärket',
    prompt: 'Vad betyder ett blått fyrkantigt märke med ett vitt P?',
    image: sign('parkering', 'Blå rektangulär skylt med ett vitt P.'),
    type: 'road-sign',
    answers: [
      ok('Att parkering är tillåten där.'),
      no('Att parkering är förbjuden där.', 'p-skylt'),
      no('Att endast betald parkering är tillåten.', 'p-skylt'),
      no('Att platsen är reserverad för rörelsehindrade.', 'p-skylt'),
    ],
    short:
      'Blå fyrkant med P betyder tillåten parkering. Tilläggstavlorna under avgör när, hur länge och för vem.',
    sources: [vmf('2 kap. E19'), teori('Anvisningsmärken (E)', 334)],
    tags: ['grundregel', 'parkering', 'vagmarke'],
  },
  {
    id: 'grd-014',
    category: 'trotthet',
    subcategory: 'trotthet',
    difficulty: 1,
    ruleTested: 'Åtgärd mot trötthet',
    prompt: 'Vad är den enda åtgärd som faktiskt hjälper mot trötthet bakom ratten?',
    answers: [
      ok('Att stanna och sova en stund.'),
      no('Att öppna fönstret och sätta på musik.', 'trotthet-motmedel'),
      no('Att dricka kaffe och fortsätta köra.', 'trotthet-motmedel'),
      no('Att byta körställning ofta.', 'trotthet-motmedel'),
    ],
    short:
      'Sömn är det enda som återställer vakenheten. Frisk luft, musik och kaffe skjuter på problemet några minuter.',
    sources: [teori('Trötthet', 148)],
    tags: ['grundregel', 'trotthet'],
  },
];

export const grunderQuestions = buildQuestions(seeds);
