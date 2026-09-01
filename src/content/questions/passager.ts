import { buildQuestions, no, ok, teori, trf, vmf } from './authoring';
import type { AuthoredQuestion } from './authoring';

/**
 * Passager: övergångsställe, gångbana, cykelpassage och cykelöverfart.
 *
 * The distinction between a cykelpassage and a cykelöverfart is the single
 * most confused rule in this part of the theory, and the difference is real:
 * at one you adapt your speed, at the other you have an actual duty to give
 * way. The set is built to make that line sharp rather than to hide it.
 */

const seeds: AuthoredQuestion[] = [
  /* ---- Övergångsställe ------------------------------------------------ */
  {
    id: 'pas-001',
    category: 'trafikregler',
    subcategory: 'oskyddade-trafikanter',
    difficulty: 2,
    ruleTested: 'Att visa sin avsikt att väja',
    prompt:
      'Du har väjningsplikt mot en gående vid ett obevakat övergångsställe. Hur ska väjningsplikten utföras?',
    answers: [
      ok('Genom att i god tid sänka hastigheten eller stanna, så att din avsikt syns.'),
      no('Genom att hålla farten och bromsa först när personen gått ut.', 'visa-avsikt'),
      no('Genom att blinka med helljuset så att personen förstår.', 'visa-avsikt'),
      no('Genom att köra långsamt förbi bakom personen.', 'visa-avsikt'),
    ],
    short:
      'Att väja är inte bara att undvika krock. Du ska tydligt visa avsikten genom att sänka farten eller stanna i god tid.',
    deep:
      'Trafikförordningen är uttrycklig: den som har väjningsplikt ska tydligt visa sin avsikt att väja, och får köra vidare bara om det med hänsyn till andras placering, avstånd och hastighet inte uppstår fara eller hinder. En bil som håller farten in i sista sekunden och sedan tvärbromsar har uppfyllt bokstaven men inte regeln — den gående vågade ändå inte gå.',
    memory: 'Väjningsplikt syns utifrån, annars är den värdelös.',
    sources: [trf('3 kap. 5 §'), trf('3 kap. 61 §'), teori('Obevakat övergångsställe', 46)],
    tags: ['oskyddade'],
    related: ['tra-003'],
  },
  {
    id: 'pas-002',
    category: 'trafikregler',
    subcategory: 'oskyddade-trafikanter',
    difficulty: 2,
    ruleTested: 'Bevakat övergångsställe',
    prompt:
      'Du får grönt ljus i en korsning. En gående gick ut på övergångsstället när hen hade grönt, men hinner inte över. Vad gäller?',
    answers: [
      ok('Du måste låta personen gå färdigt innan du kör.'),
      no('Du får köra, eftersom du har grönt och personen har rött.', 'signal-slar-ut-gaende'),
      no('Du får köra förbi bakom personen om det går att göra utan kontakt.', 'signal-slar-ut-gaende'),
      no('Personen måste omedelbart återvända till trottoaren.', 'signal-slar-ut-gaende'),
    ],
    short:
      'Den som gått ut på rätt sätt har rätt att gå färdigt. Grönt för dig betyder inte att korsningen är tom.',
    deep:
      'Ett bevakat övergångsställe är bevakat därför att signalerna styr både dig och den gående. Signalen ger dig rätt att köra in i korsningen, inte rätt att köra genom någon som redan är där. Samma princip gäller vid cykelpassager med signal.',
    sources: [trf('3 kap. 61 §'), teori('Bevakat övergångsställe', 46)],
    tags: ['oskyddade', 'signal'],
  },
  {
    id: 'pas-003',
    category: 'trafikregler',
    subcategory: 'oskyddade-trafikanter',
    difficulty: 3,
    ruleTested: 'Bevakat eller obevakat övergångsställe',
    prompt:
      'Ett övergångsställe har trafiksignaler, men de är helt släckta och blinkar inte. Vad gäller?',
    answers: [
      ok('Övergångsstället räknas som obevakat, så du har väjningsplikt mot gående.'),
      no('Övergångsstället är bevakat, men signalen är ur funktion, så gående får inte gå.', 'slackt-signal'),
      no('Släckt signal betyder att övergångsstället är tillfälligt upphävt.', 'slackt-signal'),
      no('Du har företräde, eftersom en bevakad passage utan signal saknar reglering.', 'slackt-signal'),
    ],
    short:
      'Bevakat kräver en fungerande signal eller en polis. Är signalen släckt gäller väjningsplikten mot gående.',
    deep:
      'Det är en klurig men vanlig situation, särskilt nattetid och vid signaler som bara aktiveras på begäran. Definitionen är enkel: fungerande signaler eller polis på platsen betyder bevakat. Allt annat är obevakat, med den starkare skyldigheten för dig som förare.',
    memory: 'Ingen signal i drift = obevakat = du väjer.',
    sources: [trf('3 kap. 61 §'), teori('Obevakat övergångsställe', 47)],
    tags: ['oskyddade', 'signal'],
    related: ['pas-001', 'pas-002'],
  },
  {
    id: 'pas-004',
    category: 'trafikregler',
    subcategory: 'oskyddade-trafikanter',
    difficulty: 2,
    ruleTested: 'Vem som räknas som gående',
    prompt: 'Vem av dessa räknas som gående vid ett övergångsställe?',
    answers: [
      ok('Den som leder sin cykel över övergångsstället.'),
      no('Den som cyklar över övergångsstället.', 'cyklist-som-gaende'),
      no('Den som kör en EU-moped över övergångsstället.', 'cyklist-som-gaende'),
      no('Den som kör en elsparkcykel över övergångsstället.', 'cyklist-som-gaende'),
    ],
    short:
      'Den som leder sin cykel går. Den som sitter på och trampar är cyklist, och då gäller reglerna för cykelpassage eller cykelöverfart i stället.',
    deep:
      'Som gående räknas också den som färdas i rullstol, även eldriven, och den som åker rullskridskor, rullskidor, spark eller lekfordon. Skillnaden spelar roll: mot en gående på ett obevakat övergångsställe har du väjningsplikt, mot en cyklist på en obevakad cykelpassage har du en svagare skyldighet.',
    sources: [trf('2 kap.'), teori('Övergångsställe', 46)],
    tags: ['oskyddade', 'definitioner'],
  },
  {
    id: 'pas-005',
    category: 'trafikregler',
    subcategory: 'oskyddade-trafikanter',
    difficulty: 2,
    ruleTested: 'Att vinka fram gående',
    prompt:
      'Du har stannat vid ett obevakat övergångsställe på en gata med två körfält i din riktning. Varför bör du undvika att vinka fram den gående?',
    answers: [
      ok('Vinken kan uppfattas som att hela vägen är fri, men du kan inte svara för föraren i det andra körfältet.'),
      no('Det är förbjudet att ge tecken till gående.', 'vinka-fram'),
      no('Den gående blir stressad och går fortare än hen klarar.', 'vinka-fram'),
      no('Vinken innebär att du tar över ansvaret om något händer.', 'vinka-fram'),
    ],
    short:
      'Sök ögonkontakt i stället. En vink skapar en falsk trygghet som du inte har täckning för.',
    deep:
      'Risken är konkret: den gående slappnar av och går ut framför en bil i det andra körfältet som inte har sett situationen. Att stanna tydligt och tidigt är den signal som behövs — resten sköter den gående själv.',
    sources: [teori('Övergångsställe', 46)],
    tags: ['oskyddade', 'samspel'],
  },

  /* ---- Gångbana ------------------------------------------------------- */
  {
    id: 'pas-006',
    category: 'trafikregler',
    subcategory: 'oskyddade-trafikanter',
    difficulty: 2,
    ruleTested: 'Att korsa en gångbana',
    prompt:
      'Du kör ut från en fastighets infart och korsar en gångbana (trottoar). Vad gäller mot gående där?',
    answers: [
      ok('Du har väjningsplikt mot gående på gångbanan.'),
      no('Gående ska lämna företräde, eftersom du kommer från en utfart.', 'gangbana-utfart'),
      no('Ingen har väjningsplikt — gångbanan är ingen passage.', 'gangbana-utfart'),
      no('Du har väjningsplikt bara om det finns ett övergångsställe markerat.', 'gangbana-utfart'),
    ],
    short:
      'Gångbanan är till för gående. Du får korsa den, men du har väjningsplikt mot dem som går där.',
    deep:
      'Det här är en av få platser där utfartsregeln och väjningsplikten mot gående pekar åt samma håll: du väjer både mot trafiken på gatan du ska ut på och mot de gående på trottoaren du korsar på vägen dit. Ordningen är alltså trottoar först, gata sedan.',
    sources: [trf('3 kap. 59 §'), teori('Gångbana', 48)],
    tags: ['oskyddade', 'utfart'],
  },
  {
    id: 'pas-007',
    category: 'trafikregler',
    subcategory: 'oskyddade-trafikanter',
    difficulty: 3,
    ruleTested: 'Gångbana som inte korsar vägen',
    prompt:
      'Du kör på en vanlig gata. På andra sidan en korsning fortsätter en trottoar, men det finns inget övergångsställe och ingen upphöjning. Vad gäller för gående som vill korsa där?',
    answers: [
      ok('De får korsa endast om det kan ske utan fara eller hinder för trafiken.'),
      no('De har företräde eftersom trottoaren fortsätter på andra sidan.', 'gangbana-korsar-alltid'),
      no('Du har väjningsplikt, eftersom en gångbana alltid har företräde.', 'gangbana-korsar-alltid'),
      no('Det är förbjudet för dem att korsa vägen där.', 'gangbana-korsar-alltid'),
    ],
    short:
      'Att en trottoar fortsätter på andra sidan betyder inte att gångbanan korsar vägen. Utan övergångsställe är det de gående som ska välja sin lucka.',
    deep:
      'Platsens utformning avgör: beläggning, upphöjning och markeringar visar om gångbanan faktiskt löper över körbanan eller bara tar slut och börjar om. Var ändå försiktig — juridiken avgör vem som gjorde fel, inte vem som blir skadad. Gående är oskyddade trafikanter oavsett vad regeln säger.',
    sources: [trf('3 kap. 60 §'), teori('Gångbana', 48)],
    tags: ['oskyddade'],
    related: ['pas-006'],
  },

  /* ---- Cykelpassage --------------------------------------------------- */
  {
    id: 'pas-008',
    category: 'trafikregler',
    subcategory: 'cykelpassage-overfart',
    difficulty: 2,
    ruleTested: 'Obevakad cykelpassage',
    prompt:
      'Du kör rakt fram och närmar dig en obevakad cykelpassage. Vad är din skyldighet mot cyklister?',
    answers: [
      ok('Du ska anpassa hastigheten så att det inte uppstår fara för cyklister som är på passagen.'),
      no('Du har väjningsplikt mot cyklister precis som mot gående på övergångsställe.', 'passage-vs-overfart'),
      no('Du har inga skyldigheter — cyklisten ska väja för dig.', 'passage-vs-overfart'),
      no('Du måste alltid stanna före en cykelpassage.', 'passage-vs-overfart'),
    ],
    short:
      'Vid en obevakad cykelpassage anpassar du hastigheten. Full väjningsplikt gäller vid cykelöverfart, inte här.',
    deep:
      'Lagstiftaren har medvetet undvikit ordet väjningsplikt vid cykelpassager, för att cyklister inte ska invaggas i falsk trygghet: cyklisten har nämligen väjningsplikt mot dig och får bara korsa om det kan ske utan fara. Båda parter har alltså skyldigheter. Att i praktiken släppa fram cyklister är en bra vana — men det är inte samma regel som vid en cykelöverfart.',
    memory: 'Passage: anpassa farten. Överfart: väj.',
    sources: [trf('3 kap. 61 a §'), teori('Obevakad cykelpassage', 50)],
    tags: ['oskyddade', 'cykel'],
  },
  {
    id: 'pas-009',
    category: 'trafikregler',
    subcategory: 'cykelpassage-overfart',
    difficulty: 3,
    ruleTested: 'Cykelpassage i samband med sväng',
    prompt:
      'Du svänger höger i en korsning och korsar då en obevakad cykelpassage. Hur skiljer sig dina skyldigheter från när du kör rakt fram?',
    answers: [
      ok('Du ska köra med låg hastighet och lämna cyklande som är på eller just ska ut på passagen tillfälle att passera.'),
      no('Inget skiljer — samma anpassningsskyldighet gäller alltid.', 'sving-over-cykelpassage'),
      no('Vid sväng har cyklisten alltid väjningsplikt mot dig.', 'sving-over-cykelpassage'),
      no('Vid sväng måste du alltid stanna helt före passagen.', 'sving-over-cykelpassage'),
    ],
    short:
      'Svänger du — eller kör ut ur en cirkulationsplats — har du en starkare skyldighet: låg hastighet och lämna tillfälle att passera.',
    deep:
      'Skillnaden finns för att en svängande bil korsar cyklistens väg i en vinkel där sikten bakåt är dålig och där cyklisten ofta kommer från en cykelbana bredvid vägen. Det är precis den situation där högersvängsolyckor med cyklister uppstår.',
    memory: 'Svänger du över en cykelpassage: låg fart och släpp fram.',
    sources: [trf('3 kap. 61 a §'), teori('Obevakad cykelpassage', 50), teori('Cykelpassage vid sväng', 51)],
    tags: ['oskyddade', 'cykel', 'sving'],
    related: ['pas-008'],
  },
  {
    id: 'pas-010',
    category: 'trafikregler',
    subcategory: 'cykelpassage-overfart',
    difficulty: 2,
    ruleTested: 'Cyklistens skyldighet vid cykelpassage',
    prompt: 'Vad gäller för cyklisten vid en obevakad cykelpassage?',
    answers: [
      ok('Cyklisten har väjningsplikt mot dig och får korsa endast om det kan ske utan fara.'),
      no('Cyklisten har alltid företräde på en cykelpassage.', 'cyklist-har-foretrade'),
      no('Cyklisten måste kliva av och leda cykeln över.', 'cyklist-har-foretrade'),
      no('Cyklisten och bilföraren har exakt samma skyldigheter.', 'cyklist-har-foretrade'),
    ],
    short:
      'Cyklisten ska sänka farten och väja. Du ska anpassa hastigheten. Båda har skyldigheter — det är avsikten med konstruktionen.',
    sources: [trf('3 kap. 61 a §'), teori('Obevakad cykelpassage', 50)],
    tags: ['oskyddade', 'cykel'],
    related: ['pas-008'],
  },

  /* ---- Cykelöverfart --------------------------------------------------- */
  {
    id: 'pas-011',
    category: 'trafikregler',
    subcategory: 'cykelpassage-overfart',
    difficulty: 2,
    ruleTested: 'Cykelöverfart',
    prompt:
      'Du närmar dig en cykelöverfart, utmärkt med vägmärke, vägmarkering och väjningslinje. Vad gäller?',
    answers: [
      ok('Du har väjningsplikt mot cyklister som är på eller just ska ut på cykelöverfarten.'),
      no('Du ska anpassa hastigheten men har ingen väjningsplikt.', 'passage-vs-overfart'),
      no('Cyklisten har väjningsplikt mot dig, precis som vid en cykelpassage.', 'passage-vs-overfart'),
      no('Väjningsplikten gäller bara cyklister som redan är ute på överfarten.', 'passage-vs-overfart'),
    ],
    short:
      'Cykelöverfarten ger full väjningsplikt — samma styrka som mot gående på ett obevakat övergångsställe.',
    deep:
      'Väjningsplikt är ett starkare begrepp än att anpassa hastigheten. Det omfattar även den som närmar sig, och det kräver att du tydligt visar din avsikt genom att i god tid sänka farten eller stanna. Du får köra vidare bara om det med hänsyn till andras placering, avstånd och hastighet inte uppstår fara eller hinder.',
    memory: 'Vägmärke B8 och väjningslinje = du väjer.',
    sources: [trf('3 kap. 61 b §'), vmf('2 kap. B8'), teori('Cykelöverfart', 52)],
    tags: ['oskyddade', 'cykel'],
    related: ['pas-008'],
  },
  {
    id: 'pas-012',
    category: 'trafikregler',
    subcategory: 'cykelpassage-overfart',
    difficulty: 3,
    ruleTested: 'Vilka väjningsplikten vid cykelöverfart omfattar',
    prompt:
      'Vid en cykelöverfart närmar sig både en cyklist och en förare av moped klass II. Mot vem har du väjningsplikt?',
    answers: [
      ok('Mot båda — väjningsplikten omfattar cyklande och förare av moped klass II.'),
      no('Endast mot cyklisten. Mopeder räknas som motorfordon.', 'moped-vid-overfart'),
      no('Endast mot mopeden, eftersom den är snabbare.', 'moped-vid-overfart'),
      no('Mot ingen av dem om de inte redan är ute på överfarten.', 'moped-vid-overfart'),
    ],
    short:
      'Cyklande och moped klass II omfattas båda. Det som sägs om cyklister vid passager, överfarter och cykelbanor gäller även elsparkcyklar och moped klass II.',
    deep:
      'Moped klass I, EU-mopeden, hör däremot inte hit — den räknas som ett motorfordon och ska köra i körbanan. Skillnaden mellan klass I och klass II går igen på flera ställen i teorin, till exempel för rätten att använda kollektivkörfält.',
    sources: [trf('3 kap. 61 b §'), teori('Cykelöverfart', 52)],
    tags: ['oskyddade', 'cykel', 'moped'],
    related: ['pas-011'],
  },
  {
    id: 'pas-013',
    category: 'trafikregler',
    subcategory: 'cykelpassage-overfart',
    difficulty: 2,
    ruleTested: 'Utformning av cykelöverfart',
    prompt:
      'Trafikmiljön vid en cykelöverfart ska vara utformad så att en viss hastighet inte är lämplig att överskrida. Vilken?',
    answers: [
      ok('30 km/h.'),
      no('20 km/h.', 'overfart-hastighet'),
      no('40 km/h.', 'overfart-hastighet'),
      no('50 km/h.', 'overfart-hastighet'),
    ],
    short:
      'En cykelöverfart ska vara byggd så att det inte är lämpligt att köra fortare än 30 km/h, ofta genom en upphöjning.',
    deep:
      'Utformningskravet är en del av varför cykelöverfarten ger starkare skydd än cykelpassagen: farten är redan nedtvingad av vägens fysiska utformning, vilket gör väjningsplikten praktiskt möjlig att uppfylla.',
    sources: [teori('Cykelöverfart', 52)],
    tags: ['cykel', 'hastighet'],
    related: ['pas-011'],
  },
  {
    id: 'pas-014',
    category: 'trafikregler',
    subcategory: 'cykelpassage-overfart',
    difficulty: 1,
    ruleTested: 'Att skilja passage från överfart',
    prompt: 'Hur ser du skillnad på en cykelpassage och en cykelöverfart?',
    answers: [
      ok('Cykelöverfarten har ett vägmärke och en väjningslinje. Cykelpassagen har bara vägmarkering.'),
      no('Cykelöverfarten är bredare än cykelpassagen.', 'passage-vs-overfart'),
      no('Cykelpassagen är alltid kombinerad med ett övergångsställe.', 'passage-vs-overfart'),
      no('Det går inte att se skillnad — de är samma sak med olika namn.', 'passage-vs-overfart'),
    ],
    short:
      'Leta efter vägmärket för cykelöverfart och väjningslinjen. Finns de inte är det en cykelpassage.',
    memory: 'Skylt + väjningslinje = överfart. Bara rutor = passage.',
    sources: [vmf('2 kap. B8'), teori('Cykelöverfart', 52), teori('Cykelpassage', 50)],
    tags: ['cykel', 'vagmarke'],
    related: ['pas-008', 'pas-011'],
  },
  {
    id: 'pas-015',
    category: 'trafikregler',
    subcategory: 'cykelpassage-overfart',
    difficulty: 3,
    ruleTested: 'Att korsa en cykelbana',
    prompt:
      'Du svänger in på en liten infartsväg och korsar där en cykelbana som inte är bruten. Vad gäller?',
    answers: [
      ok('Du har väjningsplikt mot cyklister på cykelbanan.'),
      no('Cyklisten har väjningsplikt, eftersom cykelbanan korsar en körbana.', 'cykelbana-korsning'),
      no('Ingen väjningsplikt gäller om cykelbanan saknar vägmarkering.', 'cykelbana-korsning'),
      no('Du har väjningsplikt bara om det finns en cykelpassage markerad.', 'cykelbana-korsning'),
    ],
    short:
      'Andra förare får bara korsa en cykelbana, och har då väjningsplikt mot cyklisterna på den.',
    deep:
      'I praktiken är det svårt att veta om cykelbanan verkligen är obruten — det avgörs av kommunens detaljplan. En hjälpsam regel: ser du vägmarkeringen för cykelpassage eller cykelöverfart är cykelbanan bruten. Ser du ingen sådan markering kan cykelbanan vara obruten, och då gäller väjningsplikt. Handla på det säkraste sättet när du är osäker.',
    memory: 'Ingen markering vid korsningen? Räkna med väjningsplikt.',
    sources: [trf('3 kap. 61 §'), teori('Cykelbana', 53)],
    tags: ['cykel'],
    related: ['pas-014'],
  },
  {
    id: 'pas-016',
    category: 'trafikregler',
    subcategory: 'cykelpassage-overfart',
    difficulty: 2,
    ruleTested: 'Bevakad cykelpassage',
    prompt:
      'Du har grönt ljus och ska köra över en cykelpassage. En cyklist som körde ut på grönt hinner inte över. Vad gäller?',
    answers: [
      ok('Du måste låta cyklisten passera innan du kör.'),
      no('Du får köra, eftersom cyklisten nu har rött.', 'signal-slar-ut-gaende'),
      no('Cyklisten ska stanna kvar mitt på passagen tills du kört förbi.', 'signal-slar-ut-gaende'),
      no('Du får köra om du passerar bakom cyklisten.', 'signal-slar-ut-gaende'),
    ],
    short:
      'Samma princip som vid bevakat övergångsställe: den som kört ut på rätt sätt har rätt att göra klart.',
    sources: [trf('3 kap. 61 a §'), teori('Bevakad cykelpassage', 50)],
    tags: ['cykel', 'signal'],
    related: ['pas-002'],
  },
];

export const passagerQuestions = buildQuestions(seeds);
