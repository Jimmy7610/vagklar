import { buildQuestions, no, ok, teori, trf, tvk } from './authoring';
import type { AuthoredQuestion } from './authoring';

/**
 * Frågor på Vägklars egna ritningar.
 *
 * De tidigare bildfrågorna vilar på källans material — fotografier av verklig
 * trafik och bokens egna figurer. De här vilar på ritningar Vägklar gjort
 * själv, av en anledning som är värd att vara tydlig med: för däck och för
 * krockskydd finns det som ska läras ut helt enkelt inte avbildat i källan.
 * Kapitlen är fulla av text om mönsterdjup och krockvåld och nästan tomma på
 * bilder.
 *
 * Varje fråga här ställer en *avläsning*: bilden visar ett tillstånd, och
 * frågan handlar om vad tillståndet beror på eller vad det kräver av föraren.
 * Därför används frågevarianterna ur bildregistret, som är ritade utan
 * omdöme — lektionens version av samma sak säger "För lågt tryck" i klartext
 * och vore ett facit.
 */
const seeds: AuthoredQuestion[] = [
  {
    id: 'egr-001',
    category: 'fordonet',
    subcategory: 'dack-och-bromsar',
    difficulty: 2,
    ruleTested: 'Slitagemönster som tecken på lufttryck',
    prompt: 'Däcket på bilden är nedslitet vid båda kanterna men har full mönsterhöjd kvar i mitten. Vad beror det oftast på?',
    originalVisualId: 'dackslitage-fraga',
    answers: [
      ok('Att däcket körts med för lågt lufttryck.'),
      no('Att däcket körts med för högt lufttryck.', 'dackslitage-tryck'),
      no('Att bilen bromsat hårt många gånger.', 'dackslitage-tryck'),
      no('Att däcket är för gammalt.', 'dackslitage-tryck'),
    ],
    short:
      'För lite luft gör att däcket buktar ut och mitten lyfter. Då bär kanterna hela bilen, och det är kanterna som slits.',
    deep:
      'Slitagemönstret går att läsa som en mätare. Slitna kanter med mitten kvar betyder för lågt tryck; sliten mitt med kanterna kvar betyder för högt. Ojämnt slitage bara på ena sidan är något annat — då sitter felet oftast i hjulinställningen.',
    sources: [teori('Fel på hjulen', 207), tvk()],
    tags: ['dack', 'sakerhetskontroll'],
  },
  {
    id: 'egr-002',
    category: 'fordonet',
    subcategory: 'dack-och-bromsar',
    difficulty: 2,
    ruleTested: 'Blåsa på däcksidan',
    prompt: 'Du hittar det som syns på bilden vid en kontroll av däcket. Vad gäller?',
    originalVisualId: 'dackskada-fraga',
    answers: [
      ok('Däcket ska bytas — utbuktningen betyder att stommen inuti har gått av.'),
      no('Det går bra att köra vidare om mönsterdjupet är godkänt.', 'dackskada-monsterdjup'),
      no('Det räcker att sänka lufttrycket något.', 'dackskada-monsterdjup'),
      no('Det är normalt slitage på ett äldre däck.', 'dackskada-monsterdjup'),
    ],
    short:
      'En bula i däcksidan betyder att stommen brustit och att bara det yttre gummit håller emot trycket. Däcket kan brista utan förvarning.',
    deep:
      'Skadan uppstår typiskt av en hård kantstenssmäll eller ett djupt slaghål, och den syns ofta först dagar senare. Mönsterdjupet säger ingenting om det: ett däck med gott om mönster kvar kan vara körförbjudet ändå.',
    sources: [teori('Fel på hjulen', 207), tvk()],
    tags: ['dack', 'sakerhetskontroll'],
  },
  {
    id: 'egr-003',
    category: 'halka',
    subcategory: 'vattenplaning',
    difficulty: 2,
    ruleTested: 'Att hantera vattenplaning',
    prompt: 'Bilden visar vad som händer under däcket. Vad ska du göra?',
    originalVisualId: 'vattenplaning-fraga',
    answers: [
      ok('Släppa gasen, hålla ratten stilla och låta farten sjunka.'),
      no('Bromsa hårt för att få tillbaka greppet snabbare.', 'vattenplaning-atgard'),
      no('Styra åt sidan för att komma ur vattnet.', 'vattenplaning-atgard'),
      no('Gasa lite för att pressa undan vattnet.', 'vattenplaning-atgard'),
    ],
    short:
      'Hjulet rör inte vägen, så varken broms eller ratt gör något. Det enda som hjälper är att farten sjunker tills gummit når asfalten igen.',
    deep:
      'Att bromsa eller styra under vattenplaning gör dessutom skada: när greppet plötsligt kommer tillbaka står hjulen låsta eller vridna, och bilen kastas åt det hållet. Håll ratten rakt och gör ingenting förrän du känner att däcken tar igen.',
    sources: [teori('Vattenplaning', 219), tvk()],
    tags: ['vattenplaning', 'halka'],
  },
  {
    id: 'egr-004',
    category: 'fordonet',
    subcategory: 'krocksakerhet',
    difficulty: 2,
    ruleTested: 'Nackskyddets höjd',
    prompt: 'Vad är problemet med nackskyddet på bilden?',
    originalVisualId: 'nackskydd-fraga',
    answers: [
      ok('Det sitter för lågt, så det tar emot nacken i stället för huvudet.'),
      no('Det sitter för långt från huvudet, men höjden spelar ingen roll.', 'nackskydd-hojd'),
      no('Ingenting — nackskyddet ska sitta i nackhöjd.', 'nackskydd-hojd'),
      no('Det är för mjukt för att stoppa en rörelse bakåt.', 'nackskydd-hojd'),
    ],
    short:
      'Nackskyddets överkant ska nå upp i höjd med hjässan. Sitter det lägre passerar huvudet ovanför stödet vid en påkörning bakifrån.',
    deep:
      'Vid en upphinnandeolycka trycks kroppen framåt i stolen medan huvudet blir kvar. Det som ska stoppa huvudet är nackskyddet, och det gör det bara om det står högt nog att möta hjässan i stället för nacken. Ställ in det när du ställer in stolen, inte efteråt.',
    sources: [teori('Nackskydd', 234), tvk()],
    tags: ['krocksakerhet', 'sakerhetskontroll'],
  },
  {
    id: 'egr-005',
    category: 'fordonet',
    subcategory: 'krocksakerhet',
    difficulty: 2,
    ruleTested: 'Bältets placering över kroppen',
    prompt: 'Vad är fel med bältet på bilden?',
    originalVisualId: 'balte-fraga',
    answers: [
      ok('Höftbältet ligger över magen i stället för lågt över bäckenet.'),
      no('Bältet är för hårt spänt över höften.', 'baltets-lage'),
      no('Ingenting — höftbältet ska ligga över magen.', 'baltets-lage'),
      no('Axelbandet ska gå under armen, men höftbältet är rätt.', 'baltets-lage'),
    ],
    short:
      'Höftbältet ska ligga lågt över bäckenet, som är ben och tål belastningen. Över magen belastar det mjuka delar i stället.',
    deep:
      'Samma sak gäller axelbandet: det ska gå snett över axeln, inte under armen. Ett bälte som ligger fel tar inte upp kraften där kroppen är byggd för det, och ett bälte med slack låter kroppen bygga upp fart innan det tar emot.',
    sources: [trf('4 kap. 10 §'), teori('Bilbältet', 233)],
    tags: ['krocksakerhet', 'balte'],
  },
];

export const egnaRitningarQuestions = buildQuestions(seeds);
