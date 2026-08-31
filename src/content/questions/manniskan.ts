import { buildQuestions, general, no, ok, trf } from './authoring';
import type { AuthoredQuestion } from './authoring';

const seeds: AuthoredQuestion[] = [
  {
    id: 'man-001',
    category: 'manniskan',
    subcategory: 'reaktion-och-sinnen',
    difficulty: 2,
    ruleTested: 'Stoppsträckans delar',
    prompt: 'Vad består stoppsträckan av?',
    answers: [
      ok('Reaktionssträckan plus bromssträckan.'),
      no('Enbart bromssträckan.', 'reaktion-vs-broms'),
      no('Reaktionssträckan plus säkerhetsavståndet.', 'reaktion-vs-broms'),
      no('Bromssträckan plus fordonets längd.', 'reaktion-vs-broms'),
    ],
    short: 'Stoppsträcka = reaktionssträcka + bromssträcka.',
    deep:
      'Reaktionssträckan är den sträcka du hinner köra innan bromsen börjar verka, typiskt runt en sekund. Bromssträckan är sträckan från att bromsarna griper till stillastående. De växer olika: reaktionssträckan linjärt med hastigheten, bromssträckan med hastigheten i kvadrat.',
    memory: 'Reaktion + broms = stopp.',
    sources: [general('Fysik och körteknik: stoppsträcka')],
    related: ['man-002', 'has-006'],
  },
  {
    id: 'man-002',
    category: 'manniskan',
    subcategory: 'reaktion-och-sinnen',
    difficulty: 3,
    ruleTested: 'Reaktionssträcka i praktiken',
    prompt:
      'Du kör i 90 km/h och har en reaktionstid på ungefär en sekund. Hur lång blir reaktionssträckan?',
    answers: [
      ok('Cirka 25 meter.'),
      no('Cirka 9 meter.', 'reaktion-vs-broms'),
      no('Cirka 15 meter.', 'reaktion-vs-broms'),
      no('Cirka 45 meter.', 'reaktion-vs-broms'),
    ],
    short: '90 km/h är 25 m/s. På en sekunds reaktionstid hinner du 25 meter.',
    deep:
      'Räkna om med 90 ÷ 3,6 = 25 m/s. Till det kommer bromssträckan, som på torr asfalt i 90 km/h är i storleksordningen 40 meter. Total stoppsträcka blir alltså omkring 65 meter — betydligt längre än de flesta gissar, och längre än ett halvljus når.',
    type: 'calculation',
    sources: [general('Fysik: hastighet, tid och sträcka')],
    related: ['man-001', 'has-005'],
  },
  {
    id: 'man-003',
    category: 'manniskan',
    subcategory: 'reaktion-och-sinnen',
    difficulty: 2,
    ruleTested: 'Faktorer som förlänger reaktionstiden',
    prompt: 'Vad förlänger din reaktionstid mest?',
    answers: [
      ok('Att du är trött, påverkad eller uppmärksam på något annat än trafiken.'),
      no('Att du kör en tyngre bil.'),
      no('Att du kör i lägre hastighet.'),
      no('Att vägen är kurvig.'),
    ],
    short: 'Trötthet, påverkan och delad uppmärksamhet är de stora förlängarna.',
    deep:
      'En reaktionstid på en sekund gäller en utvilad, uppmärksam förare som är beredd på att något ska hända. Är du oförberedd blir den längre. Läser du ett meddelande kan den vara flera sekunder — i 90 km/h motsvarar varje sekund 25 meter.',
    sources: [general('Trafikpsykologi: reaktionstid')],
    related: ['man-002', 'man-004'],
  },
  {
    id: 'man-004',
    category: 'manniskan',
    subcategory: 'reaktion-och-sinnen',
    difficulty: 1,
    ruleTested: 'Mobiltelefon under körning',
    prompt: 'Vad gäller för mobiltelefon under körning?',
    answers: [
      ok('Du får inte hålla telefonen i handen medan du kör.'),
      no('Du får hålla telefonen om du kör under 50 km/h.'),
      no('Du får hålla telefonen om du bara läser och inte skriver.'),
      no('All telefonanvändning är tillåten så länge du har handsfree eller inte.'),
    ],
    short: 'Det är förbjudet att hålla mobiltelefonen i handen under körning.',
    deep:
      'Utöver det uttryckliga förbudet gäller den allmänna regeln att du inte får ägna dig åt något som gör att du inte kan köra trafiksäkert. Även handsfree tar uppmärksamhet: det är inte handen som är problemet, utan att du tänker på något annat än trafiken.',
    sources: [trf('4 kap. 10 e §')],
  },
  {
    id: 'man-005',
    category: 'manniskan',
    subcategory: 'reaktion-och-sinnen',
    difficulty: 2,
    ruleTested: 'Synens roll',
    prompt: 'Hur stor del av den information du använder i trafiken kommer från synen?',
    answers: [
      ok('Den helt dominerande delen.'),
      no('Ungefär hälften.'),
      no('Ungefär en fjärdedel.'),
      no('Lika mycket som från hörseln.'),
    ],
    short: 'Nästan all information du kör på kommer från synen.',
    deep:
      'Därför är allt som försämrar sikten så allvarligt: mörker, dimma, smutsiga rutor, bländning. Det skarpa seendet täcker dessutom bara ett par grader — du måste flytta blicken aktivt och söka av vägen framför, speglarna och sidorna i stället för att stirra rakt fram.',
    sources: [general('Trafikpsykologi: perception och seende')],
  },
  {
    id: 'man-006',
    category: 'manniskan',
    subcategory: 'attityd-och-grupptryck',
    difficulty: 2,
    ruleTested: 'Grupptryck',
    prompt: 'Dina passagerare tycker att du kör för långsamt och vill att du ökar farten. Vad gör du?',
    answers: [
      ok('Kör i den hastighet du bedömer som säker — ansvaret är ditt.'),
      no('Ökar farten något för att inte skapa dålig stämning.'),
      no('Låter den mest erfarna passageraren avgöra.'),
      no('Ökar farten på raksträckor men inte i kurvor.'),
    ],
    short: 'Föraren bär ansvaret. Grupptryck ändrar inte det.',
    deep:
      'Unga förare med jämnåriga passagerare har en tydligt förhöjd olycksrisk, och grupptryck är en del av förklaringen. Att säga nej är enklare om du bestämt dig i förväg. Kom också ihåg att du som förare är den som blir prövad rättsligt, inte de som tyckte till.',
    sources: [general('Trafikpsykologi: grupptryck och ungas olycksrisk')],
    related: ['tro-005'],
  },
  {
    id: 'man-007',
    category: 'manniskan',
    subcategory: 'attityd-och-grupptryck',
    difficulty: 3,
    ruleTested: 'Överskattning av egen förmåga',
    prompt: 'Vilken attityd är farligast hos en nybliven förare?',
    answers: [
      ok('Att överskatta sin egen förmåga och underskatta riskerna.'),
      no('Att vara osäker och köra försiktigt.'),
      no('Att fråga andra om råd.'),
      no('Att köra långsammare än hastighetsgränsen.'),
    ],
    short: 'Överskattad förmåga i kombination med underskattad risk är den farligaste kombinationen.',
    deep:
      'Körskickligheten växer snabbt de första åren, men riskbedömningen växer långsamt. Glappet däremellan är den period då olycksrisken är som högst. En förare som är medveten om sina begränsningar skapar marginaler — och marginaler är det enda som räddar dig när något oväntat händer.',
    sources: [general('Trafikpsykologi: förarutveckling och risk')],
  },
  {
    id: 'man-008',
    category: 'manniskan',
    subcategory: 'korstrategi',
    difficulty: 2,
    ruleTested: 'Blickteknik',
    prompt: 'Var bör du rikta blicken när du kör?',
    answers: [
      ok('Långt fram och rörligt — sök av vägen, sidorna och speglarna växelvis.'),
      no('Fast på vägbanan strax framför bilen.'),
      no('På bilen närmast framför dig.'),
      no('Omväxlande på hastighetsmätaren och vägen.'),
    ],
    short: 'Titta långt fram och håll blicken rörlig. Det ger dig tid.',
    deep:
      'Blickar du långt fram upptäcker du förändringar tidigt och kan agera mjukt i stället för akut. Bilen tenderar dessutom att följa blicken, vilket gör körningen jämnare. En användbar vana: kontrollera speglarna med några sekunders mellanrum så att du alltid vet vad som finns bakom.',
    memory: 'Blicken långt fram ger dig tid.',
    sources: [general('Körstrategi: blickteknik')],
    related: ['ris-010'],
  },
  {
    id: 'man-009',
    category: 'manniskan',
    subcategory: 'korstrategi',
    difficulty: 3,
    ruleTested: 'Uppmärksamhetens gränser',
    prompt: 'Varför är det svårt att göra två krävande saker samtidigt under körning?',
    answers: [
      ok('Uppmärksamheten är en begränsad resurs — hjärnan växlar mellan uppgifter i stället för att göra båda.'),
      no('Ögonen kan bara fokusera på ett håll åt gången.'),
      no('Bilens system störs av flera intryck samtidigt.'),
      no('Det är bara svårt för ovana förare.'),
    ],
    short: 'Vi växlar mellan uppgifter, vi gör dem inte parallellt. Under växlingen missar du saker.',
    deep:
      'Det kallas ibland uppmärksamhetsblindhet: du kan titta rakt på en cyklist utan att uppfatta honom om tanken är någon annanstans. Rutinerade moment som växling kräver lite kapacitet, men samtal om något känsloladdat, navigering eller sökande efter en adress kräver mycket. Lägg krävande uppgifter till stunder när bilen står still.',
    sources: [general('Kognitionsforskning: uppmärksamhet och körning')],
    related: ['man-004'],
  },
];

export const manniskanQuestions = buildQuestions(seeds);
