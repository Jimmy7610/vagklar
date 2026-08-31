import { buildQuestions, general, no, ok, trf } from './authoring';
import type { AuthoredQuestion } from './authoring';

const seeds: AuthoredQuestion[] = [
  {
    id: 'mor-001',
    category: 'morker',
    subcategory: 'morkerkorning',
    difficulty: 2,
    ruleTested: 'Hastighet i mörker',
    prompt: 'Vad avgör hur fort du får köra på en mörk landsväg med halvljus?',
    answers: [
      ok('Att du kan stanna inom den sträcka som ljuset räcker.'),
      no('Den skyltade hastigheten, ljuset spelar ingen roll.', 'morker-hastighet'),
      no('Att du håller samma fart som trafiken omkring dig.', 'morker-hastighet'),
      no('Att du ser vägmarkeringarna tydligt.', 'morker-hastighet'),
    ],
    short: 'Kör aldrig fortare än att du hinner stanna inom ljuskäglan.',
    deep:
      'Halvljus lyser typiskt ungefär 50–70 meter framåt. Stoppsträckan i 90 km/h på torr väg är längre än så när reaktionssträckan räknas in — vilket betyder att du i praktiken kör "blint" en del av sträckan. Därför är hastighetsanpassning i mörker inte en artighet utan en förutsättning.',
    memory: 'Ser du 50 meter kan du inte stanna på 90.',
    sources: [trf('3 kap. 14 §')],
    related: ['mor-002'],
  },
  {
    id: 'mor-002',
    category: 'morker',
    subcategory: 'ljusanvandning',
    difficulty: 1,
    ruleTested: 'Halvljus',
    prompt: 'När ska halvljuset vara tänt?',
    answers: [
      ok('I mörker, gryning, skymning och vid dålig sikt.'),
      no('Bara mellan solnedgång och soluppgång.'),
      no('Bara utanför tätbebyggt område.'),
      no('Enbart när gatubelysningen är släckt.'),
    ],
    short: 'Halvljus krävs i mörker, gryning, skymning och vid nedsatt sikt.',
    deep:
      'Varselljus räcker inte när det är mörkt: de lyser framåt men saknar oftast bakljus, vilket gör bilen osynlig bakifrån. Ett vanligt fel i moderna bilar med automatiska instrumentpaneler är att köra i mörker med enbart varselljus utan att märka det. Kontrollera att bakljusen faktiskt lyser.',
    sources: [trf('3 kap. 68 §')],
  },
  {
    id: 'mor-003',
    category: 'morker',
    subcategory: 'mote-i-morker',
    difficulty: 2,
    ruleTested: 'Bländning vid möte',
    prompt: 'Du blir bländad av ett mötande fordon. Vad gör du?',
    answers: [
      ok('Sänker farten och riktar blicken mot vägkanten till höger.'),
      no('Tittar rakt in i ljuset för att bedöma avståndet.', 'helljus-mote'),
      no('Slår på ditt eget helljus för att kompensera.', 'helljus-mote'),
      no('Blundar tills fordonet passerat.', 'helljus-mote'),
    ],
    short: 'Sänk farten och styr efter högra vägkanten tills bländningen släpper.',
    deep:
      'Ögat behöver flera sekunder för att återhämta sig efter kraftig bländning, och under den tiden ser du i praktiken ingenting i mörkret. Högra vägkantens linje eller kantstolpar ger dig en referens att styra efter. Att svara med eget helljus förvärrar situationen för båda.',
    memory: 'Bländ inte tillbaka — titta höger och sakta ner.',
    sources: [trf('3 kap. 71 §')],
    related: ['mor-004'],
  },
  {
    id: 'mor-004',
    category: 'morker',
    subcategory: 'ljusanvandning',
    difficulty: 2,
    ruleTested: 'Helljus',
    prompt: 'När måste du blända av från helljus till halvljus?',
    answers: [
      ok('Vid möte, när du närmar dig ett fordon bakifrån, och där vägen är tillräckligt belyst.'),
      no('Endast vid möte med personbilar.', 'helljus-mote'),
      no('Först när den mötande blinkar åt dig.', 'helljus-mote'),
      no('Bara inom tätbebyggt område.', 'helljus-mote'),
    ],
    short: 'Blända av i god tid vid möte, vid upphinnande och på belyst väg.',
    deep:
      'Kravet gäller mot alla trafikanter, alltså även cyklister, gående och ryttare. Tänk på att ljuset från en bil ofta syns långt innan bilen gör det — börja blända av när du ser skenet, inte när du ser fordonet. På belyst väg ska helljuset vara släckt.',
    sources: [trf('3 kap. 71 §')],
    related: ['mor-003'],
  },
  {
    id: 'mor-005',
    category: 'morker',
    subcategory: 'morkerkorning',
    difficulty: 2,
    ruleTested: 'Att upptäcka gående i mörker',
    prompt: 'På ungefär vilket avstånd ser du en mörkklädd gående i halvljus?',
    answers: [
      ok('Omkring 20–30 meter.'),
      no('Omkring 100 meter.'),
      no('Omkring 150 meter.'),
      no('Ungefär lika långt som en ljusklädd gående.'),
    ],
    short: 'En mörkklädd gående syns först på mycket kort avstånd — kortare än din stoppsträcka.',
    deep:
      'Med reflex syns en gående på flera hundra meter. Utan reflex, i mörka kläder, handlar det om några tiotal meter — mindre än stoppsträckan i 70 km/h. Det är en av de starkaste anledningarna att hålla nere farten på oupplysta vägar där gående kan förekomma.',
    sources: [general('Trafiksäkerhet: synbarhet i mörker')],
    related: ['mor-001'],
  },
  {
    id: 'mor-006',
    category: 'morker',
    subcategory: 'morkerkorning',
    difficulty: 3,
    ruleTested: 'Avståndsbedömning i mörker',
    prompt: 'Varför är det svårare att bedöma avstånd och hastighet i mörker?',
    answers: [
      ok('Referenspunkter i omgivningen försvinner, så hjärnan har mindre att jämföra med.'),
      no('Ögat blir närsynt i mörker.'),
      no('Ljuset färdas långsammare i kall luft.'),
      no('Hastighetsmätaren visar fel i mörker.'),
    ],
    short: 'Utan omgivning att jämföra med blir avståndsbedömningen osäker.',
    deep:
      'I dagsljus använder du träd, hus, vägkanter och skuggor för att uppfatta rörelse och djup. I mörker återstår ett par ljuspunkter. Det gör det svårt att avgöra hur fort ett mötande fordon närmar sig, vilket i sin tur gör omkörningar och vänstersvängar särskilt riskabla nattetid.',
    sources: [general('Trafikpsykologi: perception i mörker')],
  },
  {
    id: 'mor-007',
    category: 'morker',
    subcategory: 'ljusanvandning',
    difficulty: 2,
    ruleTested: 'Dimljus',
    prompt: 'När får du använda dimbakljus?',
    answers: [
      ok('Vid kraftigt nedsatt sikt, till exempel tät dimma eller kraftigt snöfall.'),
      no('Alltid i mörker, för att synas bättre.'),
      no('Vid regn på motorväg.'),
      no('När du kör med släpvagn.'),
    ],
    short: 'Dimbakljus är till för kraftigt nedsatt sikt — och ska släckas när sikten blir bättre.',
    deep:
      'Dimbakljuset är mycket starkare än det vanliga bakljuset. I klart väder bländar det föraren bakom och gör det svårt att se dina bromsljus. Släck det så snart sikten förbättras.',
    sources: [trf('3 kap. 74 §')],
    related: ['hal-008'],
  },
  {
    id: 'mor-008',
    category: 'morker',
    subcategory: 'mote-i-morker',
    difficulty: 3,
    ruleTested: 'Mötet i mörker',
    prompt: 'Vilken risk är störst just i det ögonblick du möter ett fordon på en mörk landsväg?',
    answers: [
      ok('Att en oskyddad trafikant vid vägkanten inte syns i det bländande ljuset.'),
      no('Att din bils generator överbelastas.'),
      no('Att du automatiskt drar dig åt vänster.'),
      no('Att bromsarna blir mindre effektiva.'),
    ],
    short: 'Precis vid mötet är sikten som sämst — och där går ofta den gående.',
    deep:
      'Kombinationen av bländning och ett ljusfält som pekar snett åt höger gör att en gående eller cyklist vid vägkanten kan vara praktiskt taget osynlig i mötesögonblicket. Sänk farten inför mötet i stället för efter — då har du marginal när det behövs.',
    sources: [general('Trafiksäkerhet: möte i mörker')],
    related: ['mor-003', 'mor-005'],
  },
];

export const morkerQuestions = buildQuestions(seeds);
