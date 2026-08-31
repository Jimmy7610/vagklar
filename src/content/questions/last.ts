import { buildQuestions, general, no, ok, trf } from './authoring';
import type { AuthoredQuestion } from './authoring';

const seeds: AuthoredQuestion[] = [
  {
    id: 'las-001',
    category: 'last',
    subcategory: 'slapvagn',
    difficulty: 2,
    ruleTested: 'B-behörighet och släp',
    prompt: 'Vad gäller för bil och släpvagn med vanlig B-behörighet?',
    answers: [
      ok('Bilens och släpets sammanlagda totalvikt får vara högst 3 500 kg.'),
      no('Släpets totalvikt får vara högst 3 500 kg, oavsett bilens vikt.', 'slap-totalvikt'),
      no('Släpets tjänstevikt får vara högst 750 kg, alltid.', 'slap-totalvikt'),
      no('Det finns ingen viktgräns så länge släpet är bromsat.', 'slap-totalvikt'),
    ],
    short: 'Räkna på ekipaget: bilens totalvikt plus släpets totalvikt, högst 3 500 kg.',
    deep:
      'Undantag finns: du får dra ett lätt släp med totalvikt högst 750 kg även om summan överstiger 3 500 kg, förutsatt att bilens egen totalvikt ryms inom behörigheten. För tyngre ekipage krävs utökad B-behörighet eller BE. Uppgifterna finns i bilens och släpets registreringsbevis.',
    memory: 'Summan av totalvikterna — inte bara släpet.',
    sources: [general('Körkortslagen, behörighet B')],
    related: ['las-002'],
  },
  {
    id: 'las-002',
    category: 'last',
    subcategory: 'slapvagn',
    difficulty: 2,
    ruleTested: 'Obromsat släp',
    prompt: 'Vad begränsar hur tungt ett obromsat släp får vara?',
    answers: [
      ok('Släpets totalvikt får normalt inte överstiga halva bilens tjänstevikt.'),
      no('Släpets totalvikt får inte överstiga bilens totalvikt.', 'slap-totalvikt'),
      no('Obromsade släp får väga högst 1 500 kg.', 'slap-totalvikt'),
      no('Det finns ingen begränsning för obromsade släp.', 'slap-totalvikt'),
    ],
    short: 'Ett obromsat släp begränsas normalt till halva dragbilens tjänstevikt.',
    deep:
      'Regeln finns eftersom hela ekipaget då bromsas av bilens bromsar. Bilens registreringsbevis anger dessutom en högsta släpvagnsvikt som tillverkaren fastställt — den gränsen gäller alltid, även om räkneregeln skulle tillåta mer.',
    sources: [trf('4 kap. 12 §')],
    related: ['las-001', 'has-009'],
  },
  {
    id: 'las-003',
    category: 'last',
    subcategory: 'lastning',
    difficulty: 2,
    ruleTested: 'Lastsäkring',
    prompt: 'Varför måste last i bilen surras eller säkras?',
    answers: [
      ok('Vid en inbromsning eller krock fortsätter lasten framåt med stor kraft.'),
      no('För att lasten annars kan repa inredningen.'),
      no('För att bilen annars drar mer bränsle.'),
      no('För att det krävs vid besiktning.'),
    ],
    short: 'Osäkrad last blir ett projektil i kupén vid en inbromsning.',
    deep:
      'Ett föremål som väger 20 kg kan vid en krock i 50 km/h utveckla en kraft som motsvarar många gånger sin egen vikt. Tunga saker ska ligga i bagageutrymmet, mot ryggstödet och så lågt som möjligt. Lastnät eller spännband behövs så snart lasten kan röra sig.',
    sources: [trf('3 kap. 81 §')],
  },
  {
    id: 'las-004',
    category: 'last',
    subcategory: 'lastning',
    difficulty: 2,
    ruleTested: 'Utskjutande last',
    prompt: 'Du transporterar en last som skjuter ut mer än en meter bakom bilen. Vad gäller?',
    answers: [
      ok('Lasten ska märkas ut så att den syns tydligt, i mörker även med ljus och reflex.'),
      no('Ingen märkning behövs om lasten är väl surrad.'),
      no('Det räcker med varningsblinkers.'),
      no('Utskjutande last är alltid förbjuden på personbil.'),
    ],
    short: 'Utskjutande last ska markeras — med flagga i dagsljus, ljus och reflex i mörker.',
    deep:
      'Lasten får inte heller skymma din sikt, dina lyktor eller registreringsskylten. Skjuter lasten ut framtill gäller strängare regler. Tänk också på att fordonets längd och beteende ändras — sväng vidare och kontrollera extra vid backning.',
    sources: [trf('3 kap. 81 §')],
  },
  {
    id: 'las-005',
    category: 'last',
    subcategory: 'slapvagn',
    difficulty: 3,
    ruleTested: 'Släpvagnens köregenskaper',
    prompt: 'Vad ökar risken för att ett släp börjar vingla i högre hastighet?',
    answers: [
      ok('För lite vikt på dragkroken och tyngdpunkten placerad för långt bak i släpet.'),
      no('För mycket vikt på dragkroken.'),
      no('Att släpet är för lätt lastat överhuvudtaget.'),
      no('Att bilen har för högt lufttryck i däcken.'),
    ],
    short: 'Lasta tyngst över eller strax framför släpets axel, så att kultrycket blir korrekt.',
    deep:
      'Ett släp med tyngdpunkten bakom axeln blir instabilt och kan börja pendla, en rörelse som förstärker sig själv med farten. Börjar släpet vingla: släpp gasen mjukt, håll ratten rakt och undvik att bromsa hårt. Kontrollera kultrycket enligt bilens och dragkrokens anvisningar.',
    sources: [general('Fordonsdynamik: släpvagnspendling')],
    related: ['las-002'],
  },
  {
    id: 'las-006',
    category: 'last',
    subcategory: 'lastning',
    difficulty: 2,
    ruleTested: 'Passagerare och bälte',
    prompt: 'Vem ansvarar för att ett barn under 15 år använder bilbälte?',
    answers: [
      ok('Föraren.'),
      no('Barnet självt.'),
      no('Barnets vårdnadshavare, även om denne inte är med i bilen.'),
      no('Ingen — det är en rekommendation.'),
    ],
    short: 'Föraren ansvarar för att barn under 15 år är korrekt fastspända.',
    deep:
      'Barn kortare än 135 cm ska använda en särskild skyddsanordning, till exempel bilbarnstol eller bälteskudde. En bakåtvänd barnstol får inte placeras i ett framsäte med aktiv krockkudde. Passagerare från 15 år ansvarar själva för sitt bälte, men som förare bör du ändå se till att alla är fastspända.',
    sources: [trf('4 kap. 10 §')],
  },
];

export const lastQuestions = buildQuestions(seeds);
