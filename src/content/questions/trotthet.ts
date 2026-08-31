import { buildQuestions, general, no, ok } from './authoring';
import type { AuthoredQuestion } from './authoring';

const seeds: AuthoredQuestion[] = [
  {
    id: 'tro-001',
    category: 'trotthet',
    subcategory: 'trotthet',
    difficulty: 1,
    ruleTested: 'Åtgärd mot trötthet',
    prompt: 'Du blir trött under en längre körning. Vilken åtgärd fungerar?',
    answers: [
      ok('Stanna och sova en stund.'),
      no('Öppna fönstret och sätta på musik.', 'trotthet-motmedel'),
      no('Dricka energidryck och köra vidare.', 'trotthet-motmedel'),
      no('Prata med en passagerare för att hålla dig vaken.', 'trotthet-motmedel'),
    ],
    short: 'Det enda som verkligen hjälper mot trötthet är sömn.',
    deep:
      'Frisk luft, musik och koffein ger en kort och opålitlig effekt, och de döljer tröttheten snarare än tar bort den. En kort vila på 15–20 minuter, gärna med koffein strax innan, ger betydligt mer. Känner du att ögonlocken blir tunga eller att du missar vägmärken — stanna nu, inte vid nästa avfart.',
    memory: 'Trötthet går bara att sova bort.',
    sources: [general('Trafikmedicin: trötthet och vakenhet')],
    related: ['tro-002'],
  },
  {
    id: 'tro-002',
    category: 'trotthet',
    subcategory: 'trotthet',
    difficulty: 2,
    ruleTested: 'Tecken på trötthet',
    prompt: 'Vilket är ett tidigt varningstecken på att du är för trött för att köra?',
    answers: [
      ok('Du minns inte de senaste kilometrarna du kört.'),
      no('Du känner dig hungrig.'),
      no('Du behöver justera stolen.'),
      no('Du blir irriterad på andra förare.'),
    ],
    short: 'Minnesluckor under körningen är ett tydligt tecken på mikrosömn.',
    deep:
      'Andra tecken är att blicken låser sig, att du gäspar upprepat, att du missar avfarter eller skyltar, och att du börjar korrigera styrningen ryckigt. En mikrosömn på fyra sekunder i 90 km/h innebär att du kör 100 meter helt utan uppsikt.',
    sources: [general('Trafikmedicin: trötthet och vakenhet')],
    related: ['tro-001'],
  },
  {
    id: 'tro-003',
    category: 'trotthet',
    subcategory: 'trotthet',
    difficulty: 2,
    ruleTested: 'Trötthetens riskperioder',
    prompt: 'När på dygnet är risken för trötthetsrelaterade olyckor som störst?',
    answers: [
      ok('Sent på natten och tidigt på morgonen, samt tidig eftermiddag.'),
      no('Under rusningstrafiken på morgonen.'),
      no('Sen förmiddag.'),
      no('Direkt efter en måltid, oavsett tid på dygnet.'),
    ],
    short: 'Dygnsrytmen ger två svackor: natt/tidig morgon och tidig eftermiddag.',
    deep:
      'Kroppens inre klocka sänker vakenheten kraftigast mellan ungefär klockan 02 och 06, och ger en mindre svacka mitt på dagen. Har du dessutom sovit för lite adderas effekterna. Planera längre resor så att du undviker de tiderna, eller lägg in ordentliga pauser.',
    sources: [general('Trafikmedicin: dygnsrytm och vakenhet')],
  },
  {
    id: 'tro-004',
    category: 'trotthet',
    subcategory: 'stress-och-kanslor',
    difficulty: 2,
    ruleTested: 'Stress i trafiken',
    prompt: 'Hur påverkar stress din körning?',
    answers: [
      ok('Uppmärksamheten smalnar av och du missar information i periferin.'),
      no('Du blir mer uppmärksam eftersom du är på helspänn.'),
      no('Reaktionstiden blir kortare, vilket gör körningen säkrare.'),
      no('Stress påverkar bara komforten, inte körförmågan.'),
    ],
    short: 'Stress ger tunnelseende: du ser mindre och tolkar färre saker rätt.',
    deep:
      'Under press prioriterar hjärnan det som känns akut — ofta klockan och bilen närmast framför. Cyklisten i periferin, skylten och den mötande försvinner ur bilden. Motmedlen är praktiska: åk tidigare, planera rutten, och acceptera att du kommer fram några minuter senare.',
    sources: [general('Trafikpsykologi: stress och uppmärksamhet')],
    related: ['tro-005'],
  },
  {
    id: 'tro-005',
    category: 'trotthet',
    subcategory: 'stress-och-kanslor',
    difficulty: 2,
    ruleTested: 'Känslor och körning',
    prompt: 'Du är arg efter ett bråk och ska köra hem. Vad är rimligast?',
    answers: [
      ok('Vänta några minuter och lugna ner dig innan du kör.'),
      no('Köra, men extra försiktigt.'),
      no('Köra en längre väg för att lugna ner dig under färden.'),
      no('Sätta på musik högt för att byta fokus och köra direkt.'),
    ],
    short: 'Starka känslor försämrar omdömet. Vänta tills du landat.',
    deep:
      'Ilska och upprördhet ökar risktagandet, kortar avstånden och gör att du tolkar andras körning som avsiktligt provocerande. Att "köra försiktigt" räcker sällan, eftersom det är just bedömningsförmågan som är nedsatt. Några minuters paus är en billig försäkring.',
    sources: [general('Trafikpsykologi: känslor och risktagande')],
    related: ['tro-004', 'man-006'],
  },
  {
    id: 'tro-006',
    category: 'trotthet',
    subcategory: 'trotthet',
    difficulty: 3,
    ruleTested: 'Trötthet jämfört med alkohol',
    prompt: 'Hur förhåller sig kraftig trötthet till alkoholpåverkan?',
    answers: [
      ok('Ett dygn utan sömn kan försämra körförmågan lika mycket som betydande alkoholpåverkan.'),
      no('Trötthet är alltid ofarligare än alkohol.'),
      no('Trötthet påverkar bara komforten, inte prestationen.'),
      no('Effekterna går inte att jämföra på något sätt.'),
    ],
    short: 'Långvarig sömnbrist ger mätbart samma typ av försämring som alkohol.',
    deep:
      'Studier har jämfört reaktionstid, uppmärksamhet och precision hos sömnberövade och alkoholpåverkade förare och funnit likartade nedsättningar. Skillnaden är att det inte finns någon gräns att blåsa i och ingen tydlig känsla av att vara påverkad — vilket gör tröttheten svårare att fånga i tid.',
    sources: [general('Trafikmedicin: sömnbrist och prestation')],
    related: ['tro-001'],
  },
];

export const trotthetQuestions = buildQuestions(seeds);
