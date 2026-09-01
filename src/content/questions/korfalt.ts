import { buildQuestions, no, ok, teori, trf, vmf } from './authoring';
import type { AuthoredQuestion } from './authoring';

/**
 * Körfält: typer, placering, val av körfält och körfältsbyte.
 *
 * The lane chapter is where a lot of everyday driving mistakes live: sitting
 * in the wrong lane at 80 km/h, changing lanes across a solid line, or
 * treating a lane change as a manoeuvre that only needs a mirror glance.
 */

const seeds: AuthoredQuestion[] = [
  /* ---- Vad ett körfält är ---------------------------------------------- */
  {
    id: 'krf-001',
    category: 'trafikregler',
    subcategory: 'korfalt-och-sving',
    difficulty: 2,
    ruleTested: 'Definitionen av körfält',
    prompt:
      'En bred väg saknar helt vägmarkeringar, men det får tydligt plats två bilar i bredd med säkra marginaler. Hur många körfält har vägen?',
    answers: [
      ok('Två — ett körfält behöver inte vara markerat för att räknas.'),
      no('Ett, eftersom körfält alltid måste märkas ut med linjer.', 'korfalt-omarkerat'),
      no('Inget — utan markering finns inga körfält.', 'korfalt-omarkerat'),
      no('Så många som fysiskt får plats, oavsett marginaler.', 'korfalt-omarkerat'),
    ],
    short:
      'Ett körfält är antingen markerat med linjer eller tillräckligt brett för trafik i en fil med fyrhjuliga fordon.',
    deep:
      'Bedömningen ska göras med rimliga säkerhetsmarginaler, inte genom att räkna hur många bilar som får plats med decimetern. Det spelar roll i praktiken: har vägen två körfält i din riktning gäller reglerna om körfältsval och körfältsbyte, även utan en enda målad linje.',
    sources: [teori('Olika typer av körfält', 14), teori('Testa dina kunskaper', 20)],
    tags: ['definitioner', 'korfalt'],
  },
  {
    id: 'krf-002',
    category: 'hastighet',
    subcategory: 'placering',
    difficulty: 1,
    ruleTested: 'Placering i körfältet',
    prompt: 'Vad är grundregeln för hur du ska placera bilen i ditt körfält?',
    answers: [
      ok('I mitten av körfältet.'),
      no('Så långt till höger som fysiskt möjligt.', 'placering-langst-hoger'),
      no('Så långt till vänster som möjligt, för bättre sikt framåt.', 'placering-langst-hoger'),
      no('Där det känns bekvämast, placeringen är oreglerad.', 'placering-langst-hoger'),
    ],
    short:
      'Mitten av körfältet är grundregeln. Andra placeringar är undantag som kräver ett skäl.',
    deep:
      'Kravet att hålla till höger gäller vilket körfält du väljer, inte var i körfältet du ligger. Att pressa sig ut mot kanten tar bort din egen marginal mot diket, grus och oskyddade trafikanter utan att ge något tillbaka.',
    sources: [trf('3 kap. 7 §'), teori('Hur bilen ska placeras i körfältet', 14)],
    tags: ['placering'],
  },
  {
    id: 'krf-003',
    category: 'hastighet',
    subcategory: 'placering',
    difficulty: 3,
    ruleTested: 'Placering vid god sikt framåt men skymd sikt åt sidorna',
    prompt:
      'Du kör på en rak landsväg med tät skog tätt inpå vägkanterna. Det finns ingen mötande trafik just nu. Vilken placering kan vara motiverad?',
    answers: [
      ok('Något till vänster i ditt körfält, för att öka avståndet till skogskanten.'),
      no('Så långt till höger som möjligt, för att ge plats åt eventuell mötande.', 'placering-skog'),
      no('Mitt på vägen, eftersom mötande trafik saknas.', 'placering-skog'),
      no('Placeringen saknar betydelse när sikten framåt är god.', 'placering-skog'),
    ],
    short:
      'Vänsterplacering ger dig mer tid om något kommer ut ur skogen. Men undvik den om mötande trafik finns eller plötsligt kan dyka upp, till exempel i kurvor.',
    deep:
      'Motsatt situation gäller vid möte med breda fordon: då kan du placera dig till höger i körfältet, men måste samtidigt hålla extra uppsikt över vägkanten. Poängen är densamma — placeringen ska köpa dig marginal mot den risk som är störst just nu.',
    sources: [teori('Hur bilen ska placeras i körfältet', 14)],
    tags: ['placering', 'risk'],
    related: ['krf-002'],
  },
  {
    id: 'krf-004',
    category: 'trafikregler',
    subcategory: 'korfalt-och-sving',
    difficulty: 2,
    ruleTested: 'Placering vid sväng',
    prompt: 'Du ska svänga höger i en vanlig korsning. Hur placerar du dig?',
    answers: [
      ok('Så nära körbanans högra kant som möjligt.'),
      no('Mitt i körfältet, för att kunna svänga mjukare.', 'sving-placering'),
      no('Något till vänster, för att få bättre svängradie.', 'sving-placering'),
      no('Placeringen spelar ingen roll vid högersväng.', 'sving-placering'),
    ],
    short:
      'Högersväng görs nära högerkanten. Det hindrar andra från att smita in till höger om dig och gör din avsikt tydlig.',
    deep:
      'Vid vänstersväng placerar du dig så nära vänsterkanten av ditt körfält som möjligt, men utan att hindra mötande trafik. Kom ihåg att en högersväng ofta korsar en cykelpassage — placeringen nära kanten hjälper dig också att se cyklister tidigare.',
    sources: [trf('3 kap. 6 §'), teori('I samband med sväng', 15)],
    tags: ['sving', 'placering'],
    related: ['pas-009'],
  },
  {
    id: 'krf-005',
    category: 'trafikregler',
    subcategory: 'korfalt-och-sving',
    difficulty: 3,
    ruleTested: 'Sväng på enkelriktad väg',
    prompt:
      'Du kör på en enkelriktad gata och ska svänga vänster. Hur placerar du dig?',
    answers: [
      ok('Så nära körbanans vänstra kant som möjligt.'),
      no('Så nära vänsterkanten av ditt körfält, men inte av körbanan.', 'enkelriktad-sving'),
      no('I mitten av körbanan, eftersom gatan är enkelriktad.', 'enkelriktad-sving'),
      no('Nära högerkanten, precis som vid alla andra svängar.', 'enkelriktad-sving'),
    ],
    short:
      'På enkelriktat finns ingen mötande trafik att ta hänsyn till, så du får använda hela körbanans vänsterkant.',
    deep:
      'Skillnaden mot en vanlig väg är just den mötande trafiken. Tänk dock på att gatan du svänger in på kan vara en vanlig väg med trafik i båda riktningarna — placeringen gäller där du är, inte där du ska.',
    sources: [trf('3 kap. 6 §'), teori('I samband med sväng på enkelriktad väg', 15)],
    tags: ['sving', 'placering'],
    related: ['krf-004'],
  },

  /* ---- Val av körfält --------------------------------------------------- */
  {
    id: 'krf-006',
    category: 'hastighet',
    subcategory: 'placering',
    difficulty: 3,
    ruleTested: 'Val av körfält vid olika hastighetsgränser',
    prompt:
      'Du kör på en väg med tre körfält i din riktning och 80 km/h. Alla körfält leder till samma mål. Du har precis kört om. Vad gäller?',
    answers: [
      ok('Du ska tillbaka till det högra körfältet när omkörningen är klar.'),
      no('Du får ligga kvar i mittfältet så länge du håller hastighetsgränsen.', 'korfaltsval-hoger'),
      no('Du får välja fritt eftersom vägen har flera körfält.', 'korfaltsval-hoger'),
      no('Du ska ligga i det körfält där trafiken flyter bäst.', 'korfaltsval-hoger'),
    ],
    short:
      'Grundregeln är högra körfältet. Fri körfältsplacering kräver antingen 70 km/h eller lägre, eller att körfälten leder till olika mål.',
    deep:
      'De två undantagen är precisa. Det första kräver minst två markerade körfält i din riktning *och* högst 70 km/h. Det andra gäller när en körfältsvägvisare visar att fälten leder olika vägar. Är inget av dem uppfyllt — som här, med 80 km/h och samma mål — gäller höger körfält.',
    memory: 'Över 70? Tillbaka till höger efter omkörning.',
    sources: [trf('3 kap. 7 §'), teori('Vilket körfält du ska välja', 16)],
    tags: ['korfalt', 'placering'],
  },
  {
    id: 'krf-007',
    category: 'hastighet',
    subcategory: 'placering',
    difficulty: 2,
    ruleTested: 'Fri körfältsplacering vid låg hastighet',
    prompt:
      'Du kör i tätort på en gata med två markerade körfält i din riktning och 50 km/h. Får du välja körfält fritt?',
    answers: [
      ok('Ja, du får välja det körfält som passar din fortsatta färd bäst.'),
      no('Nej, du måste alltid ligga i höger körfält.', 'korfaltsval-hoger'),
      no('Ja, men bara om du ska svänga vänster inom kort.', 'korfaltsval-hoger'),
      no('Nej, vänster körfält får bara användas för omkörning.', 'korfaltsval-hoger'),
    ],
    short:
      'Minst två markerade körfält i din riktning och högst 70 km/h ger dig fri körfältsplacering.',
    sources: [trf('3 kap. 7 §'), teori('Vilket körfält du ska välja', 16)],
    tags: ['korfalt', 'placering'],
    related: ['krf-006'],
  },

  /* ---- Körfältsbyte ----------------------------------------------------- */
  {
    id: 'krf-008',
    category: 'trafikregler',
    subcategory: 'korfaltsbyte',
    difficulty: 2,
    ruleTested: 'Kontroller före körfältsbyte',
    prompt: 'I vilken ordning gör du kontrollerna före ett körfältsbyte?',
    answers: [
      ok('Trafiken framför, inre backspegeln, sidospegeln och sist döda vinkeln.'),
      no('Döda vinkeln först, sedan speglarna, sist trafiken framför.', 'korfaltsbyte-ordning'),
      no('Bara sidospegeln — den täcker hela området bredvid bilen.', 'korfaltsbyte-ordning'),
      no('Blinkers först, sedan en snabb blick i sidospegeln.', 'korfaltsbyte-ordning'),
    ],
    short:
      'Framåt först, sedan bakåt via speglarna, och döda vinkeln sist innan du blinkar. Kolla döda vinkeln en gång till precis före själva bytet.',
    deep:
      'Ordningen är inte godtycklig: du måste veta att avståndet framåt räcker innan du börjar titta bakåt, annars byter du körfält samtidigt som situationen framför dig förändras. Efter blinkers ska du dessutom avvakta några sekunder och se hur andra reagerar.',
    memory: 'Fram — spegel — spegel — axel — blinkers.',
    sources: [trf('3 kap. 12 §'), teori('Körfältsbyte', 17)],
    tags: ['korfaltsbyte'],
  },
  {
    id: 'krf-009',
    category: 'trafikregler',
    subcategory: 'korfaltsbyte',
    difficulty: 2,
    ruleTested: 'Heldragen linje vid körfältsbyte',
    prompt:
      'Mellan ditt körfält och nästa går en heldragen linje på din sida. Vad gäller?',
    answers: [
      ok('Du får inte köra över i det andra körfältet.'),
      no('Du får byta körfält om det sker utan fara.', 'heldragen-linje'),
      no('Du får byta om du bara korsar linjen med hjulen på ena sidan.', 'heldragen-linje'),
      no('Heldragen linje är en rekommendation, inte ett förbud.', 'heldragen-linje'),
    ],
    short:
      'Linjen på din sida styr. Är den heldragen får du inte korsa den — även om föraren i det andra fältet får korsa den åt sitt håll.',
    deep:
      'Det är en asymmetri som förvånar många: på en väg där mittlinjen är heldragen bara på ena sidan får det ena fordonet köra om men inte det andra. Titta alltså på linjen närmast dig, inte på linjekombinationen som helhet.',
    memory: 'Din sida heldragen = du stannar i ditt fält.',
    sources: [vmf('3 kap. M2'), trf('3 kap. 11 §'), teori('Körfältsbyte', 18)],
    tags: ['korfaltsbyte', 'vagmarkering'],
  },
  {
    id: 'krf-010',
    category: 'trafikregler',
    subcategory: 'korfaltsbyte',
    difficulty: 2,
    ruleTested: 'Upprepade körfältsbyten i tät trafik',
    prompt:
      'I tät trafik finns luckor i de andra körfälten. Vad gäller för att byta fram och tillbaka mellan dem?',
    answers: [
      ok('Det är inte tillåtet att köra slalom mellan fordonen för att ta sig fram snabbare.'),
      no('Det är tillåtet så länge varje enskilt byte sker utan fara.', 'slalomkorning'),
      no('Det är tillåtet om du blinkar före varje byte.', 'slalomkorning'),
      no('Det är tillåtet på vägar med minst tre körfält.', 'slalomkorning'),
    ],
    short:
      'Enstaka motiverade byten är en sak. Att väva mellan körfälten för att tjäna platser är inte tillåtet.',
    sources: [trf('3 kap. 12 §'), teori('Förbjudet att byta körfält', 17)],
    tags: ['korfaltsbyte'],
    related: ['krf-008'],
  },
  {
    id: 'krf-011',
    category: 'trafikregler',
    subcategory: 'korfaltsbyte',
    difficulty: 3,
    ruleTested: 'Hastighet vid körfältsbyte',
    prompt:
      'Du ska byta till ett körfält där ett fordon närmar sig ganska nära bakifrån. Vad är oftast lämpligast?',
    answers: [
      ok('Öka farten något i samband med bytet, om utrymmet framåt tillåter.'),
      no('Sakta ner så att fordonet hinner passera först — och byta direkt efter.', 'korfaltsbyte-fart'),
      no('Byta i oförändrad fart; hastigheten saknar betydelse.', 'korfaltsbyte-fart'),
      no('Blinka och byta direkt, så att fordonet bakom hinner anpassa sig.', 'korfaltsbyte-fart'),
    ],
    short:
      'En liten fartökning minskar hastighetsskillnaden och gör luckan större i praktiken.',
    deep:
      'Att i stället bromsa in i eller strax före ett körfältsbyte skapar precis den situation du vill undvika: du blir långsammare än trafiken du ska in i. Är luckan för liten är alternativet att avvakta, inte att pressa in bilen.',
    sources: [teori('Körfältsbyte', 17)],
    tags: ['korfaltsbyte'],
    related: ['krf-008'],
  },

  /* ---- Speciella körfält ------------------------------------------------ */
  {
    id: 'krf-012',
    category: 'trafikregler',
    subcategory: 'korfaltsbyte',
    difficulty: 2,
    ruleTested: 'Kollektivkörfält',
    prompt: 'Vad gäller för dig med personbil vid ett kollektivkörfält?',
    answers: [
      ok('Du får korsa det, till exempel för att svänga, men inte köra i det.'),
      no('Du får köra i det om trafiken i övriga körfält står still.', 'kollektivkorfalt'),
      no('Du får köra i det om du håller samma fart som bussarna.', 'kollektivkorfalt'),
      no('Du får varken korsa eller köra i det.', 'kollektivkorfalt'),
    ],
    short:
      'Kollektivkörfältet får korsas men inte användas som färdväg. Får andra fordon använda det anges det på en tilläggstavla.',
    deep:
      'Cykel och moped klass II får köra i ett kollektivkörfält som ligger till höger i färdriktningen. EU-mopeden, klass I, får det inte — den räknas som motorfordon.',
    sources: [vmf('2 kap. D10'), teori('Kollektivkörfält (bussfil)', 18)],
    tags: ['korfalt'],
    related: ['fsl-005'],
  },
  {
    id: 'krf-013',
    category: 'trafikregler',
    subcategory: 'korfaltsbyte',
    difficulty: 3,
    ruleTested: 'Reversibelt körfält',
    prompt: 'Vad kännetecknar ett reversibelt körfält?',
    answers: [
      ok('Körriktningen i körfältet kan vändas efter behov, till exempel beroende på tid på dygnet.'),
      no('Det är ett körfält som bara får användas i nödsituationer.', 'reversibelt-korfalt'),
      no('Det är ett körfält som växlar mellan buss- och biltrafik.', 'reversibelt-korfalt'),
      no('Det är ett körfält där omkörning är tillåten i båda riktningarna.', 'reversibelt-korfalt'),
    ],
    short:
      'Riktningen kan vändas för att ge extra kapacitet åt det håll trafiken går just då. Reversibla körfält är mycket ovanliga i Sverige.',
    sources: [vmf('3 kap. M7'), teori('Reversibelt körfält', 18)],
    tags: ['korfalt', 'vagmarkering'],
  },
  {
    id: 'krf-014',
    category: 'trafikregler',
    subcategory: 'korfaltsbyte',
    difficulty: 2,
    ruleTested: 'Tecken vid körfältsbyte',
    prompt:
      'Du placerar dig i vänster körfält där pilar i vägbanan visar vänstersväng. Måste du ändå blinka när du svänger?',
    answers: [
      ok('Ja. Mötande och korsande trafikanter ser inte pilarna i vägbanan.'),
      no('Nej, körfältspilarna visar redan din avsikt.', 'blinka-trots-pilar'),
      no('Nej, blinkers behövs bara vid byte av körfält.', 'blinka-trots-pilar'),
      no('Ja, men bara om det finns fordon bakom dig.', 'blinka-trots-pilar'),
    ],
    short:
      'Tecken ska ges vid sväng, körfältsbyte, vändning, start från vägkant och annan märkbar förflyttning i sidled — oavsett vad som står i vägbanan.',
    deep:
      'Vägmarkeringen talar om vad körfältet är avsett för, inte vad just du tänker göra härnäst. Den mötande föraren ser varken pilen eller ditt körfältsval på det avståndet — men ser blinkern.',
    sources: [trf('3 kap. 64 §'), teori('Förtydligande om blinkersanvändning', 263)],
    tags: ['tecken', 'korfalt'],
  },
];

export const korfaltQuestions = buildQuestions(seeds);
