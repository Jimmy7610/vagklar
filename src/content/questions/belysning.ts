import { buildQuestions, no, ok, teori, trf, tvk } from './authoring';
import type { AuthoredQuestion } from './authoring';

/**
 * Fordonets belysning, dimma och avbländning.
 *
 * Täckningsrapporten pekade ut det här som områdets tunnaste hörn: banken
 * frågade om mörkerkörning och om varningsblinkers, men inte om varselljus,
 * dimljus eller dimbakljus — trots att det är där reglerna faktiskt är
 * lätta att blanda ihop. Frågorna nedan täpper till den luckan.
 *
 * Avbländningsfrågorna prövar ordningsföljden, inte principen. Att man ska
 * blända av vid möte vet de flesta; att helljuset ska tillbaka redan i
 * mötesögonblicket, och att det är den omkörda bilen som bländar av vid en
 * omkörning, är det som skiljer en van förare från en nybliven.
 */
const seeds: AuthoredQuestion[] = [
  {
    id: 'bel-001',
    category: 'fordonet',
    subcategory: 'belysning-fordon',
    difficulty: 1,
    ruleTested: 'Varselljus',
    prompt: 'När får du köra med enbart varselljus?',
    answers: [
      ok('I dagsljus när sikten är bra.'),
      no('I mörker, om vägen är belyst.', 'dimljus-kombination'),
      no('När som helst, så länge du också har halvljus tänt.', 'dimljus-kombination'),
      no('Bara på motorväg och motortrafikled.', 'dimljus-kombination'),
    ],
    short:
      'Varselljus finns för att bilen ska synas i dagsljus. I mörker eller nedsatt sikt räcker de inte.',
    deep:
      'Varselljus lyser framåt men lyser inte upp vägen, och bak har bilen ofta inget alls tänt. Därför är de en synlighetsåtgärd för dagsljus, inte ett alternativ till halvljus. Att kombinera varselljus med halvljus eller dimljus är dessutom förbjudet — ljusbilden ska vara entydig för den som möter dig.',
    memory: 'Varselljus syns. Halvljus ser.',
    sources: [teori('Varselljus', 264), trf('3 kap. 68 §')],
    tags: ['belysning', 'varselljus'],
  },
  {
    id: 'bel-002',
    category: 'fordonet',
    subcategory: 'belysning-fordon',
    difficulty: 2,
    ruleTested: 'Kombination av ljus',
    prompt: 'Vilken ljuskombination är förbjuden?',
    answers: [
      ok('Varselljus tillsammans med halvljus eller dimljus.'),
      no('Halvljus tillsammans med dimbakljus.', 'dimljus-kombination'),
      no('Helljus tillsammans med dimbakljus.', 'dimljus-kombination'),
      no('Halvljus tillsammans med positionsljus.', 'dimljus-kombination'),
    ],
    short:
      'Varselljus får inte kombineras med halvljus eller dimljus. Det ska vara tydligt vilket ljus bilen kör med.',
    sources: [teori('Varselljus', 264), trf('3 kap. 68 §')],
    tags: ['belysning', 'varselljus'],
  },
  {
    id: 'bel-003',
    category: 'fordonet',
    subcategory: 'belysning-fordon',
    difficulty: 2,
    ruleTested: 'Främre dimljus',
    prompt: 'När får du använda främre dimljus i stället för halvljus i mörker?',
    answers: [
      ok('Bara när det är dimma eller regnar kraftigt.'),
      no('Alltid, dimljus är starkare än halvljus.', 'dimljus-kombination'),
      no('När vägen är obelyst, oavsett väder.', 'dimljus-kombination'),
      no('Aldrig — dimljus får bara användas i dagsljus.', 'dimljus-kombination'),
    ],
    short:
      'I mörker får dimljus ersätta halvljus enbart vid dimma eller kraftigt regn. I dagsljus är det tillåtet oavsett väder.',
    deep:
      'Det främre dimljuset ger ett starkare sken än halvljuset och sitter lågt, vilket är poängen: ljuset går under dimman i stället för att reflekteras tillbaka. Just därför blir det bländande för andra när sikten är god, och då är halvljus rätt ljus.',
    sources: [teori('Dimljus', 264), trf('3 kap. 70 §')],
    tags: ['belysning', 'dimljus'],
  },
  {
    id: 'bel-004',
    category: 'fordonet',
    subcategory: 'belysning-fordon',
    difficulty: 2,
    ruleTested: 'Dimbakljus',
    prompt: 'Du har tänt dimbakljuset i dimma. När ska du släcka det?',
    answers: [
      ok('Så fort du bedömer att fordonet bakom har sett dig.'),
      no('När du kommer fram — det ska vara tänt hela resan.', 'dimbakljus-kvar'),
      no('När dimman lättar helt, inte tidigare.', 'dimbakljus-kvar'),
      no('Först när du stannar bilen.', 'dimbakljus-kvar'),
    ],
    short:
      'Dimbakljuset är mycket starkt och bländar den bakom. Det ska vara tänt bara så länge det behövs för att synas.',
    deep:
      'Ett dimbakljus som lyser i onödan gör den bakomvarande föraren sämre på att bedöma avstånd, eftersom en stark punkt äter upp allt annat i ljusbilden — bland annat dina bromsljus. Ett kvarglömt dimbakljus tar alltså bort just den signal som betyder mest.',
    sources: [teori('Dimbakljus', 264), trf('3 kap. 70 §')],
    tags: ['belysning', 'dimma'],
  },
  {
    id: 'bel-005',
    category: 'halka',
    subcategory: 'dimma',
    difficulty: 2,
    ruleTested: 'Helljus i dimma',
    prompt: 'Du kör i kraftig dimma med helljus och ser dåligt. Vad är rimligast att prova?',
    answers: [
      ok('Slå om till halvljus och se om sikten blir bättre.'),
      no('Behålla helljuset — mer ljus ger alltid mer sikt.', 'helljus-dimma'),
      no('Tända både helljus och dimljus samtidigt.', 'helljus-dimma'),
      no('Släcka allt utom varselljusen.', 'helljus-dimma'),
    ],
    short:
      'Helljuset reflekteras tillbaka i dimman och bildar en vit vägg. Halvljus lyser lägre och ger ofta bättre sikt.',
    deep:
      'Samma sak händer i kraftigt snöfall. Ljus som träffar miljontals droppar eller flingor sprids tillbaka mot dig, och det du får är bländning från ditt eget ljus. Testa halvljus — och om bilen har främre dimljus är de byggda just för det här: de sitter lågt och lyser under dimman.',
    memory: 'I dimma: mindre ljus, lägre ljus.',
    sources: [teori('Dimma och snöfall', 263), teori('Dimljus', 264)],
    tags: ['dimma', 'belysning'],
  },
  {
    id: 'bel-006',
    category: 'halka',
    subcategory: 'dimma',
    difficulty: 3,
    ruleTested: 'Hastighet vid kraftigt nedsatt sikt',
    prompt:
      'Sikten i dimman är ungefär 50 meter. Vad ska styra din hastighet?',
    answers: [
      ok('Att du hinner stanna inom de 50 meter du faktiskt ser.'),
      no('Den skyltade hastigheten, eftersom den redan tar höjd för väder.', 'morker-hastighet'),
      no('Farten hos bilen framför, så att kön håller ihop.', 'morker-hastighet'),
      no('Att du kör så fort att du snabbt är igenom dimbanken.', 'morker-hastighet'),
    ],
    short:
      'Sikten sätter taket. Kan du inte stanna inom det du ser, kör du för fort — oavsett vad skylten säger.',
    deep:
      'Dimma kommer dessutom ofta fläckvis, så sikten kan gå från hundratals meter till några tiotal på ett par sekunder. Den skyltade hastigheten är ett tak för goda förhållanden, aldrig ett golv du måste hålla.',
    sources: [teori('Dimma och snöfall', 263), trf('3 kap. 14 §')],
    tags: ['dimma', 'hastighet'],
  },
  {
    id: 'bel-007',
    category: 'morker',
    subcategory: 'mote-i-morker',
    difficulty: 2,
    ruleTested: 'Avbländning vid möte',
    prompt: 'När ska du slå tillbaka till helljus vid ett möte i mörker?',
    answers: [
      ok('Precis i mötesögonblicket, när ni är i jämnhöjd.'),
      no('När det mötande fordonets baklyktor syns i backspegeln.', 'helljus-mote'),
      no('Ett par sekunder efter att ni passerat varandra.', 'helljus-mote'),
      no('Först när vägen framför är helt tom igen.', 'helljus-mote'),
    ],
    short:
      'Kör med helljus så länge du kan, blända av när ljusen möts, och slå tillbaka redan i mötesögonblicket.',
    deep:
      'Att vänta med helljuset tills mötet är över kostar dig sikt i just den sekund du behöver den mest: när du precis passerat och vägen framför fortfarande är mörk. I mötesögonblicket kan du inte längre blända föraren du möter — hen är bredvid dig, inte framför.',
    sources: [teori('Korrekt avbländning — möte', 266), trf('3 kap. 69 §')],
    tags: ['morker', 'avblandning'],
  },
  {
    id: 'bel-008',
    category: 'morker',
    subcategory: 'mote-i-morker',
    difficulty: 3,
    ruleTested: 'Avbländning vid omkörning',
    prompt:
      'Du blir omkörd på en mörk landsväg. Vem ska blända av, och när?',
    answers: [
      ok('Du, när den omkörande bilen är framför dig — så att du inte bländar den.'),
      no('Den omkörande, hela omkörningen igenom.', 'helljus-mote'),
      no('Ingen — avbländning gäller bara vid möte.', 'helljus-mote'),
      no('Båda, tills omkörningen är helt avslutad.', 'helljus-mote'),
    ],
    short:
      'Den som kör om håller helljuset tills den är nära, och slår tillbaka i omkörningsögonblicket. Då tar den omkörda över och bländar av.',
    deep:
      'Avbländning följer alltid samma logik: den som riskerar att blända någon framför sig är den som ska blända av. Vid en omkörning byter den rollen ägare mitt i manövern, vilket är precis varför den är lätt att missa.',
    sources: [teori('Korrekt avbländning — omkörning', 267), trf('3 kap. 69 §')],
    tags: ['morker', 'avblandning'],
  },
  {
    id: 'bel-009',
    category: 'morker',
    subcategory: 'mote-i-morker',
    difficulty: 3,
    ruleTested: 'Möte med lastbil i backkrön',
    prompt:
      'Du möter en tung lastbil i ett backkrön i mörker. När ska du blända av?',
    answers: [
      ok('Så snart du ser positionsljusen på lastbilens tak.'),
      no('När du ser lastbilens strålkastare.', 'helljus-mote'),
      no('När lastbilen bländar av mot dig.', 'helljus-mote'),
      no('Efter krönet, när ni har fri sikt mot varandra.', 'helljus-mote'),
    ],
    short:
      'Förarhytten sitter högt. Positionsljusen på taket syns före strålkastarna — och då är föraren redan i din ljuskägla.',
    sources: [teori('Avbländning vid möte med lastbil', 263), trf('3 kap. 69 §')],
    tags: ['morker', 'avblandning'],
  },
  {
    id: 'bel-010',
    category: 'morker',
    subcategory: 'mote-i-morker',
    difficulty: 2,
    ruleTested: 'Helljus vid korsning i mörker',
    prompt:
      'Du närmar dig en korsning med mycket trafik i mörker. Varför kan det vara klokt att släcka helljuset?',
    answers: [
      ok('Annars riskerar du att blända den korsande trafiken.'),
      no('Helljus är förbjudet i korsningar.', 'helljus-mote'),
      no('Halvljus lyser längre in i korsningen.', 'helljus-mote'),
      no('Helljuset gör att signalerna syns sämre.', 'helljus-mote'),
    ],
    short:
      'Korsande trafik kommer från sidan och möts inte av dig — men hamnar ändå rakt i din ljuskägla.',
    sources: [teori('Helljus vid korsning', 263), trf('3 kap. 69 §')],
    tags: ['morker', 'avblandning'],
  },
  {
    id: 'bel-011',
    category: 'morker',
    subcategory: 'mote-i-morker',
    difficulty: 1,
    ruleTested: 'Blickpunkt vid bländning',
    prompt: 'Vart ska du rikta blicken när du blir bländad av ett mötande fordon?',
    answers: [
      ok('Mot vägens högra kant.'),
      no('Mot det mötande fordonets strålkastare, för att se var det är.', 'helljus-mote'),
      no('Mot mittlinjen, för att hålla placeringen.', 'helljus-mote'),
      no('Rakt fram, och blunda en kort stund.', 'helljus-mote'),
    ],
    short:
      'Högerkanten ger dig en referens att styra efter utan att du tittar in i ljuset.',
    deep:
      'Ögat behöver flera sekunder för att återfå mörkerseendet efter en bländning, och varje sekund du tittar mot ljuset förlänger den tiden. Kantlinjen finns kvar i utkanten av synfältet, vilket räcker för att hålla kursen tills mötet är över.',
    sources: [teori('Undvika bländning', 263), tvk()],
    tags: ['morker', 'syn'],
  },
];

export const belysningQuestions = buildQuestions(seeds);
