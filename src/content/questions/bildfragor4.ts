import { buildQuestions, no, ok, teori, trf, tvk } from './authoring';
import type { AuthoredQuestion } from './authoring';

/**
 * Bildfrågor, omgång fyra: ritade figurer ur källan.
 *
 * De tidigare omgångarna använde fotografier av verklig trafik. De här
 * frågorna vilar i stället på bokens egna ritningar, och kvalificerar sig av
 * en annan anledning: figuren bär ett *mått* eller ett *förhållande* som är
 * omständligt i text och omedelbart i bild. "40 cm ut på ena sidan" är en
 * mening att läsa två gånger; det är en bild att förstå på en sekund.
 *
 * Måtten i figurerna finns också som text i bildregistrets `labelText`, så
 * frågan går att besvara av någon som inte kan se ritningen.
 */
const seeds: AuthoredQuestion[] = [
  {
    id: 'bl4-001',
    category: 'last',
    subcategory: 'lastning',
    difficulty: 3,
    ruleTested: 'Last som skjuter ut i sidled',
    prompt: 'Varför är lastningen på bilden inte tillåten?',
    sourceImageId: 'lastbredd-otillaten',
    answers: [
      ok('För att lasten skjuter ut mer än 20 cm på ena sidan.'),
      no('För att den sammanlagda bredden överstiger 260 cm.', 'lastbredd-tva-krav'),
      no('För att lasten ligger på taket i stället för i bagageutrymmet.', 'lastbredd-tva-krav'),
      no('För att lasten inte är utmärkt med flagga.', 'lastbredd-tva-krav'),
    ],
    short:
      'Två krav gäller samtidigt: högst 260 cm totalbredd och högst 20 cm utanför bilen åt sidan. Här klaras det första men inte det andra.',
    deep:
      'Det är därför måttet 260 cm i figuren inte räddar situationen. Lasten är förskjuten, så den sticker ut 40 cm på ena sidan — dubbelt så mycket som tillåtet — trots att bredden i sig är godkänd. Lägg lasten mitt på, eller korta den.',
    sources: [trf('4 kap. 15 §'), teori('På bredden', 244, 245)],
    tags: ['last', 'matt'],
  },
  {
    id: 'bl4-002',
    category: 'last',
    subcategory: 'slapvagn',
    difficulty: 3,
    ruleTested: 'Lastens placering i släpet',
    prompt: 'Vad blir följden av att lasten ligger som på bilden?',
    sourceImageId: 'kultryck-lagt',
    answers: [
      ok('Bilens bakhjul avlastas, och det är de som håller ekipaget rakt.'),
      no('Släpet får bättre väggrepp eftersom vikten hamnar över dess hjul.', 'kultryck'),
      no('Ingenting — vikten är densamma oavsett var i släpet den ligger.', 'kultryck'),
      no('Bilens framvagn trycks ned och styrningen blir tyngre.', 'kultryck'),
    ],
    short:
      'Last längst bak tippar släpet bakåt och lyfter kopplingen. Lyftet tar bort tryck från bilens bakhjul, som är de som stabiliserar ekipaget.',
    deep:
      'Ett släp som börjar vandra i sidled stabiliseras av bilens bakvagn, och den kan bara göra sitt jobb om den har tyngd på sig. Lägg därför den tunga delen av lasten strax framför släpets hjulaxel — inte längst bak, och inte längst fram heller.',
    sources: [teori('Kultryck', 256), tvk()],
    tags: ['slapvagn', 'lastning'],
  },
  {
    id: 'bl4-003',
    category: 'morker',
    subcategory: 'mote-i-morker',
    difficulty: 2,
    ruleTested: 'När helljuset ska tillbaka',
    prompt: 'Bilarna befinner sig i läget på bilden. Vad gäller för helljuset?',
    sourceImageId: 'avblandning-mote-3',
    answers: [
      ok('Det ska slås på igen — i jämnhöjd kan du inte längre blända den mötande.'),
      no('Det ska vara släckt tills den mötande bilen syns i backspegeln.', 'helljus-mote'),
      no('Det ska vara släckt ytterligare några sekunder efter mötet.', 'helljus-mote'),
      no('Det spelar ingen roll, eftersom mötet redan är över.', 'helljus-mote'),
    ],
    short:
      'I mötesögonblicket är den andra föraren bredvid dig, inte framför. Då kan ditt ljus inte nå in i hens ögon längre.',
    deep:
      'Att vänta med helljuset tills mötet är avslutat kostar sikt i just den sekund du behöver den mest: vägen framför dig är fortfarande mörk och du har precis passerat något. Bilden visar exakt när ljuset ska tillbaka.',
    sources: [teori('Korrekt avbländning — möte', 266), trf('3 kap. 69 §')],
    tags: ['morker', 'avblandning'],
  },
  {
    id: 'bl4-004',
    category: 'morker',
    subcategory: 'mote-i-morker',
    difficulty: 3,
    ruleTested: 'Avbländning i kurva',
    prompt: 'Vem av förarna på bilden måste blända av först?',
    sourceImageId: 'helljus-i-kurva',
    answers: [
      ok('Bil A, eftersom kurvan riktar dess ljus rakt mot bil B.'),
      no('Bil B, eftersom den är närmast kurvans utsida.', 'helljus-kurva'),
      no('Båda samtidigt, när de ser varandras ljus.', 'helljus-kurva'),
      no('Ingen av dem förrän de är på rakt sträcka igen.', 'helljus-kurva'),
    ],
    short:
      'I en kurva pekar ljuset inte dit bilen ska. A:s kägla sveper in mot B långt innan bilarna möts, medan B:s kägla pekar bort från A.',
    deep:
      'Det betyder att de två inte ska blända av samtidigt: A måste göra det tidigt, B kan behålla helljuset längre. Regeln är alltid densamma — du bländar av när ditt ljus når den andre — men i en kurva inträffar det vid olika tidpunkter för de två.',
    sources: [teori('Kurvor', 268), trf('3 kap. 69 §')],
    tags: ['morker', 'avblandning'],
  },
  {
    id: 'bl4-005',
    category: 'fordonet',
    subcategory: 'krocksakerhet',
    difficulty: 2,
    ruleTested: 'Passagerarkrockkudde och bakåtvänd stol',
    prompt: 'Panelen på bilden lyser som den gör. Får en bakåtvänd bilbarnstol sitta i framsätet?',
    sourceImageId: 'krockkudde-indikator',
    answers: [
      ok('Nej — ON betyder att krockkudden är aktiv.'),
      no('Ja, om barnet är över tre år.', 'krockkudde-bakatvand'),
      no('Ja, om stolen är fastspänd med ISOFIX.', 'krockkudde-bakatvand'),
      no('Ja, om sätet är skjutet så långt bak som möjligt.', 'krockkudde-bakatvand'),
    ],
    short:
      'En bakåtvänd stol får aldrig placeras framför en aktiv krockkudde. Kudden löser ut mot stolens rygg, alltså mot barnets huvud.',
    deep:
      'Krockkudden blåses upp på några hundradels sekunder och med stor kraft. Mot en framåtvänd vuxen är det ett skydd; mot ryggen på en bakåtvänd barnstol är det ett slag rakt mot huvudet. Är kudden urkopplad, och panelen visar OFF, är placeringen däremot tillåten.',
    sources: [trf('4 kap. 10 §'), teori('Krockkudde (airbag)', 233)],
    tags: ['barn', 'krocksakerhet'],
  },
  {
    id: 'bl4-006',
    category: 'last',
    subcategory: 'slapvagn',
    difficulty: 2,
    ruleTested: 'Utmärkning av bogserlina',
    prompt: 'Avståndet mellan bilarna på bilden är fyra meter. Vad krävs?',
    sourceImageId: 'bogsering-utmarkning',
    answers: [
      ok('Bogserlinan ska märkas ut, eftersom avståndet är över två meter.'),
      no('Ingenting särskilt — linan syns tillräckligt bra ändå.', 'bogsering-utmarkning'),
      no('Varningsblinkers på båda bilarna under hela bogseringen.', 'bogsering-utmarkning'),
      no('En varningstriangel placerad mitt emellan bilarna.', 'bogsering-utmarkning'),
    ],
    short:
      'Är avståndet mellan fordonen över två meter ska linan märkas ut, så att andra ser att där finns något spänt mellan bilarna.',
    deep:
      'En spänd lina i knähöjd är nära nog osynlig från sidan. Markeringen finns för korsande trafik och för gående, inte för de två förarna. Kom också ihåg att bogsering sker i högst 30 km/h, och på motorväg bara till närmaste avfart.',
    sources: [trf('5 kap. 1 §'), teori('Utmärkning vid bogsering', 248)],
    tags: ['bogsering', 'slapvagn'],
  },
];

export const bildfragor4Questions = buildQuestions(seeds);
