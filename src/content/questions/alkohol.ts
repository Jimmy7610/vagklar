import { buildQuestions, bbk, kkl, lmv, no, ok, pol, tbl, v1177 } from './authoring';
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
    short:
      'Gränsen för rattfylleri går vid 0,2 promille i blodet, eller 0,10 milligram per liter i utandningsluften.',
    // Sa tidigare att körkortet "återkallas i praktiken alltid". Körkortslagen
    // 5 kap. 9 § tillåter varning i stället för återkallelse när halten inte
    // nått 0,5 promille och en varning av särskilda skäl kan anses tillräcklig.
    // "Alltid" var alltså fel om just den grupp frågan handlar om — den som
    // ligger strax över gränsen.
    deep:
      'Utandningsprovet är det du möter vid en kontroll, och gränsen där är 0,10 milligram per liter. Vid 1,0 promille eller mer rubriceras brottet normalt som grovt, liksom när körningen inneburit en påtaglig fara även vid lägre halt. Straffskalan går från böter till fängelse. Körkortet återkallas som huvudregel — men understiger halten 0,5 promille kan en varning räcka om det finns särskilda skäl.',
    sources: [tbl('4 §'), pol(), kkl('5 kap. 3 och 9 §§')],
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
    short:
      'Från 1,0 promille — eller 0,50 milligram per liter i utandningsluften — är brottet normalt grovt. Fängelse ingår i straffskalan.',
    deep:
      'Lagen räknar upp vad som särskilt ska beaktas, så halten avgör inte ensam: brottet kan bedömas som grovt även under 1,0 promille om föraren varit avsevärt påverkad eller körningen inneburit en påtaglig fara för trafiksäkerheten. Straffskalan går till fängelse i högst två år, och körkortet återkallas.',
    sources: [tbl('4 a §'), pol(), kkl('5 kap. 3 §')],
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
      'Levern bryter ner alkohol i en i stort sett konstant takt, och den takten går inte att skynda på. En vanlig tumregel är ungefär ett glas i timmen för en genomsnittlig vuxen — men den är för grov för att avgöra om du är laglig, eftersom takten skiljer sig mellan personer. Kaffe eller en dusch kan göra att du känner dig piggare, vilket är farligt: du blir mer benägen att sätta dig i bilen utan att omdömet faktiskt återvänt.',
    memory: 'Kaffe ger en pigg fyllerist, inte en nykter förare.',
    sources: [v1177()],
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
      'Nedbrytningen är långsam och börjar först när du slutat dricka. Tumregeln om ett glas i timmen duger för att inse att det tar tid, men inte för att räkna ut när du är under gränsen — den enda säkra marginalen är att låta bilen stå. Har du druckit sent och mycket kan du ha promille kvar långt in på nästa dag. Lägg till att sömnen efter alkohol är sämre: du är dessutom trött.',
    sources: [v1177(), tbl('4 §')],
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
    sources: [v1177()],
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
    sources: [tbl('4 §'), lmv()],
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
    short:
      'För narkotika finns ingen tillåten nivå. Nolltolerans gäller — med ett undantag för läkemedel du använder enligt ordination.',
    deep:
      'Undantaget står i lagen: har substansen använts i enlighet med läkares eller annan behörig receptutfärdares ordination gäller inte nolltoleransen. Men även då får du inte köra om körförmågan är påverkad. Många substanser är spårbara långt efter att ruset gått över.',
    sources: [tbl('4 §'), pol()],
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
    sources: [bbk('23 kap. 4 §'), tbl('4 §')],
  },
];

export const alkoholQuestions = buildQuestions(seeds);
