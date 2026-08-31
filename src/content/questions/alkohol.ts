import { buildQuestions, general, no, ok } from './authoring';
import type { AuthoredQuestion } from './authoring';

const seeds: AuthoredQuestion[] = [
  {
    id: 'alk-001',
    category: 'alkohol',
    subcategory: 'alkohol-gransvarden',
    difficulty: 1,
    ruleTested: 'Promillegräns',
    prompt: 'Vid vilken alkoholhalt i blodet döms man för rattfylleri i Sverige?',
    answers: [
      ok('0,2 promille eller mer.'),
      no('0,5 promille eller mer.'),
      no('0,8 promille eller mer.'),
      no('1,0 promille eller mer.'),
    ],
    short: 'Gränsen för rattfylleri går vid 0,2 promille.',
    deep:
      'Vid 1,0 promille eller mer rubriceras brottet som grovt rattfylleri, liksom när körningen inneburit en påtaglig fara även vid lägre halt. Straffskalan går från böter till fängelse, och körkortet återkallas i praktiken alltid.',
    sources: [general('Lag (1951:649) om straff för vissa trafikbrott')],
    related: ['alk-002'],
  },
  {
    id: 'alk-002',
    category: 'alkohol',
    subcategory: 'alkohol-gransvarden',
    difficulty: 2,
    ruleTested: 'Grovt rattfylleri',
    prompt: 'Vad gäller normalt vid 1,0 promille eller mer?',
    answers: [
      ok('Det räknas som grovt rattfylleri, med fängelse i straffskalan.'),
      no('Det räknas som ringa rattfylleri och ger böter.'),
      no('Det ger enbart en varning första gången.'),
      no('Det ger körkortsingripande men inget straffrättsligt ansvar.'),
    ],
    short: 'Från 1,0 promille är brottet grovt. Fängelse ingår i straffskalan.',
    deep:
      'Brottet kan bedömas som grovt även under 1,0 promille om föraren varit avsevärt påverkad eller körningen inneburit en påtaglig fara. Utöver straffet återkallas körkortet, och spärrtiden är ofta lång.',
    sources: [general('Lag (1951:649) om straff för vissa trafikbrott')],
    related: ['alk-001'],
  },
  {
    id: 'alk-003',
    category: 'alkohol',
    subcategory: 'alkohol-effekter',
    difficulty: 2,
    ruleTested: 'Alkoholens nedbrytning',
    prompt: 'Vad påskyndar kroppens nedbrytning av alkohol?',
    answers: [
      ok('Ingenting i praktiken — bara tid.'),
      no('Starkt kaffe.', 'promille-tid'),
      no('En kall dusch.', 'promille-tid'),
      no('Motion och svettning.', 'promille-tid'),
    ],
    short: 'Bara tid bryter ner alkohol. Kaffe gör dig vaken, inte nykter.',
    deep:
      'Levern bryter ner alkohol i en i stort sett konstant takt, ungefär motsvarande ett glas i timmen för en genomsnittlig vuxen. Kaffe eller en dusch kan göra att du känner dig piggare, vilket är farligt: du blir mer benägen att sätta dig i bilen utan att omdömet faktiskt återvänt.',
    memory: 'Kaffe ger en pigg fyllerist, inte en nykter förare.',
    sources: [general('Medicinsk grundkunskap om alkohol')],
    related: ['alk-004'],
  },
  {
    id: 'alk-004',
    category: 'alkohol',
    subcategory: 'alkohol-effekter',
    difficulty: 2,
    ruleTested: 'Dagen efter',
    prompt: 'Du drack mycket alkohol på kvällen och sov åtta timmar. Vad gäller på morgonen?',
    answers: [
      ok('Du kan fortfarande ha alkohol kvar i blodet och vara olaglig att köra.'),
      no('Sömn bryter ner alkoholen snabbare, så du är nykter.', 'promille-tid'),
      no('Efter sex timmars sömn är man alltid under gränsen.', 'promille-tid'),
      no('Bara om du druckit sprit finns risk kvar på morgonen.', 'promille-tid'),
    ],
    short: 'Nedbrytningen tar tid oavsett sömn. Dagen efter är en vanlig rattfyllerisituation.',
    deep:
      'Räkna grovt med att kroppen gör sig av med motsvarande ett glas i timmen, och att nedbrytningen börjar först när du slutat dricka. Har du druckit sent och mycket kan du ha promille kvar långt in på nästa dag. Lägg till att sömnen efter alkohol är sämre — du är dessutom trött.',
    sources: [general('Medicinsk grundkunskap om alkohol')],
    related: ['alk-003', 'tro-001'],
  },
  {
    id: 'alk-005',
    category: 'alkohol',
    subcategory: 'alkohol-effekter',
    difficulty: 2,
    ruleTested: 'Alkoholens effekt på körförmågan',
    prompt: 'Vad påverkas först och tydligast av alkohol vid bilkörning?',
    answers: [
      ok('Omdömet och förmågan att bedöma risker.'),
      no('Synskärpan på långt håll.'),
      no('Hörseln.'),
      no('Muskelstyrkan i benen.'),
    ],
    short: 'Alkohol slår först mot omdömet — därför märker den påverkade det inte själv.',
    deep:
      'Det är den farliga kombinationen: förmågan att bedöma den egna förmågan försämras tidigast. Föraren känner sig kompetent, tar större risker, och reagerar dessutom långsammare. Redan små mängder försämrar samordning, reaktionstid och förmågan att dela uppmärksamhet.',
    sources: [general('Medicinsk grundkunskap om alkohol')],
  },
  {
    id: 'alk-006',
    category: 'alkohol',
    subcategory: 'droger-lakemedel',
    difficulty: 2,
    ruleTested: 'Läkemedel och körning',
    prompt: 'Du har fått ett läkemedel utskrivet som kan göra dig dåsig. Vad gäller?',
    answers: [
      ok('Du ansvarar själv för att inte köra om läkemedlet påverkar din körförmåga.'),
      no('Utskrivna läkemedel är alltid tillåtna att kombinera med bilkörning.'),
      no('Det räcker att du känner dig pigg för stunden.'),
      no('Reglerna gäller bara narkotikaklassade läkemedel.'),
    ],
    short: 'Receptet fritar dig inte. Påverkar medicinen körförmågan får du inte köra.',
    deep:
      'Läkemedelsförpackningar märks med en varningstriangel när preparatet kan påverka körförmågan. Fråga läkare eller apotekspersonal, och var särskilt uppmärksam i början av en behandling och vid dosändringar. Kombination med alkohol förstärker effekten kraftigt.',
    sources: [general('Lag (1951:649) om straff för vissa trafikbrott')],
  },
  {
    id: 'alk-007',
    category: 'alkohol',
    subcategory: 'droger-lakemedel',
    difficulty: 1,
    ruleTested: 'Nolltolerans mot narkotika',
    prompt: 'Vad gäller för narkotika i blodet vid bilkörning?',
    answers: [
      ok('Nolltolerans — varje spårbar mängd är drograttfylleri.'),
      no('Samma promillegräns som för alkohol.'),
      no('Det är tillåtet om du inte känner dig påverkad.'),
      no('Det gäller bara om du orsakat en olycka.'),
    ],
    short: 'För narkotika finns ingen tillåten nivå. Nolltolerans gäller.',
    deep:
      'Undantaget är narkotikaklassade läkemedel som du använder enligt läkares ordination — men även då gäller att du inte får köra om körförmågan är påverkad. Många substanser är spårbara långt efter att ruset gått över.',
    sources: [general('Lag (1951:649) om straff för vissa trafikbrott')],
  },
  {
    id: 'alk-008',
    category: 'alkohol',
    subcategory: 'alkohol-gransvarden',
    difficulty: 3,
    ruleTested: 'Ansvar för annan förare',
    prompt: 'Din kompis har druckit och tänker köra hem. Vad gäller för dig?',
    answers: [
      ok('Du bör hindra körningen — att låta det ske kan vara straffbart medhjälp.'),
      no('Det är helt och hållet förarens eget ansvar.'),
      no('Du har ansvar bara om det är din bil.'),
      no('Du har ansvar bara om du åker med.'),
    ],
    short: 'Att medvetet låta någon köra påverkad kan vara straffbart — och du kan förhindra det.',
    deep:
      'Den som uppmuntrar, möjliggör eller lämnar över nycklarna till en påverkad förare kan dömas för medhjälp. Praktiskt: ta nycklarna, ordna taxi, erbjud en soffa. Att ringa polisen när någon ändå kör iväg är inte att svika en vän — det är att förhindra en möjlig dödsolycka.',
    sources: [general('Brottsbalken 23 kap. om medverkan')],
  },
];

export const alkoholQuestions = buildQuestions(seeds);
