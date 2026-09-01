import type { Lesson } from '@/domain/content/types';

/**
 * The theory school.
 *
 * Short, structured lessons — not walls of text. Each one explains the rule,
 * shows why it exists, gives a memory hook where one genuinely helps, and ends
 * with a handful of questions drawn from the same question bank the adaptive
 * engine uses, so a lesson check feeds real mastery data.
 */
export const LESSONS: Lesson[] = [
  {
    id: 'les-grundregler',
    categoryId: 'trafikregler',
    subcategoryIds: ['grundregler', 'vagens-anvandning'],
    title: 'Grundreglerna',
    summary: 'Aktsamhetsplikten som allt annat vilar på.',
    estimatedMinutes: 4,
    order: 1,
    blocks: [
      {
        kind: 'paragraph',
        text: 'Trafikreglerna är inte en samling lösa förbud. De hänger ihop och bygger på en enda grundtanke: du ska köra så att ingen skadas.',
      },
      {
        kind: 'rule',
        title: 'Aktsamhetsplikten',
        text: 'Du ska vara aktsam och göra vad som krävs för att undvika en olycka — även när någon annan gör fel. Regeln fyller luckorna där ingen detaljregel passar.',
      },
      {
        kind: 'paragraph',
        text: 'Det får två praktiska följder. Den första: att ha rätt hjälper dig inte om olyckan ändå sker, så företräde är något du får, aldrig något du tar. Den andra: du ska ta särskild hänsyn till barn, äldre och personer med funktionsnedsättning.',
      },
      {
        kind: 'rule',
        title: 'Placering',
        text: 'Kör så långt till höger som är lämpligt med hänsyn till säkerhet och framkomlighet — inte så långt höger som fysiskt möjligt.',
      },
      {
        kind: 'example',
        title: 'Vad "lämpligt" betyder',
        text: 'På en smal väg med lös grusvägkant är rätt placering en bit in i körfältet. Ligger du för nära kanten riskerar du att dra ner bilen i diket, och du tar bort din egen marginal om något dyker upp.',
      },
      {
        kind: 'memory',
        text: 'Alla detaljregler kan sammanfattas i en fråga: vad skulle en försiktig förare göra här?',
      },
    ],
    curriculumChapterIds: ['inledning', 'korfalt'],
    checkQuestionIds: ['tra-001', 'tra-005', 'kor-014'],
  },
  {
    id: 'les-hogerregeln',
    categoryId: 'korsningar',
    subcategoryIds: ['hogerregeln', 'vajningsplikt'],
    title: 'Högerregeln',
    summary: 'Grundregeln i korsningar utan skyltar.',
    estimatedMinutes: 5,
    order: 2,
    blocks: [
      {
        kind: 'paragraph',
        text: 'Högerregeln är den regel som gäller när ingen annan reglering finns. Den är enkel att formulera och lätt att glömma i verkligheten, eftersom man reflexmässigt letar efter en skylt.',
      },
      {
        kind: 'rule',
        title: 'Högerregeln',
        text: 'I en korsning utan vägmärken, vägmarkeringar eller trafiksignal har du väjningsplikt mot fordon som kommer från höger.',
      },
      {
        kind: 'list',
        title: 'Detta upphäver högerregeln',
        items: [
          'Polisens tecken',
          'Trafiksignal',
          'Vägmärke: väjningsplikt, stopplikt eller huvudled',
          'Att du kommer från ett område som inte är en väg — då gäller utfartsregeln i stället',
        ],
      },
      {
        kind: 'illustration',
        illustration: 'crossroads',
        alt: 'En fyrvägskorsning utan vägmärken sedd uppifrån, med tre bilar.',
        caption: 'Utan skyltar avgör högerregeln vem som kör först.',
      },
      {
        kind: 'paragraph',
        text: 'Vägens bredd, beläggning och trafikmängd spelar ingen roll. En bred asfalterad gata har inte automatiskt företräde framför en smal grusväg — det krävs en skylt för det.',
      },
      {
        kind: 'warning',
        text: 'Räkna aldrig med att den andra föraren kan regeln. Kör in i korsningen med en fart som gör att du hinner stanna.',
      },
      { kind: 'memory', text: 'Ingen skylt? Titta höger.' },
    ],
    curriculumChapterIds: ['vajningsregler', 'cirkulationsplats'],
    checkQuestionIds: ['kor-001', 'kor-009', 'kor-014'],
  },
  {
    id: 'les-utfartsregeln',
    categoryId: 'korsningar',
    subcategoryIds: ['utfartsregeln'],
    title: 'Utfartsregeln',
    summary: 'När högerregeln inte gäller alls.',
    estimatedMinutes: 4,
    order: 3,
    blocks: [
      {
        kind: 'paragraph',
        text: 'Det här är ett av de vanligaste feltänken i hela teorin: att högerregeln skulle gälla när du kör ut från en parkering. Det gör den inte.',
      },
      {
        kind: 'rule',
        title: 'Utfartsregeln',
        text: 'Kommer du ut på en väg från ett område som inte är en väg har du väjningsplikt mot alla trafikanter på vägen — från båda hållen.',
      },
      {
        kind: 'list',
        title: 'Platser där utfartsregeln gäller',
        items: [
          'Parkeringsplats',
          'Fastighet, gård eller tomt',
          'Bensinstation',
          'Gågata och gångfartsområde',
          'Cykelgata',
          'Terräng',
        ],
      },
      {
        kind: 'example',
        title: 'Gränsfallet',
        text: 'En smal grusväg är fortfarande en väg. Kör du ut därifrån gäller vanliga korsningsregler, alltså oftast högerregeln. Skillnaden går mellan väg och icke-väg, inte mellan stor och liten.',
      },
      {
        kind: 'warning',
        text: 'Väjningsplikten gäller även mot cyklister och gående, inklusive dem som kommer på en gångbana du korsar.',
      },
      { kind: 'memory', text: 'Kommer du inte från en väg — då väjer du för alla.' },
    ],
    curriculumChapterIds: ['vajningsregler', 'passager'],
    checkQuestionIds: ['kor-002', 'kor-003'],
  },
  {
    id: 'les-hastighet',
    categoryId: 'hastighet',
    subcategoryIds: ['hastighetsgranser', 'anpassad-hastighet'],
    title: 'Hastighet',
    summary: 'Bashastighet, skyltat tak och anpassad fart.',
    estimatedMinutes: 5,
    order: 4,
    blocks: [
      {
        kind: 'rule',
        title: 'Bashastighet',
        text: 'Utan vägmärke gäller 50 km/h inom tätbebyggt område och 70 km/h utanför.',
      },
      {
        kind: 'paragraph',
        text: 'Allt annat måste skyltas. En bred och fin landsväg utan skylt ger dig alltså inte rätt att köra i 90.',
      },
      {
        kind: 'rule',
        title: 'Anpassad hastighet',
        text: 'Hastigheten ska anpassas efter väg-, terräng-, väderleks- och siktförhållanden. Den skyltade hastigheten är ett tak, aldrig ett mål.',
      },
      {
        kind: 'paragraph',
        text: 'Den praktiska formuleringen: du ska kunna stanna inom den sträcka du överblickar. Det gäller i mörker, i dimma, före ett backkrön och i en kurva med skymd sikt.',
      },
      {
        kind: 'example',
        title: 'Varför fart straffar sig så hårt',
        text: 'Reaktionssträckan växer linjärt med hastigheten, men bromssträckan växer med hastigheten i kvadrat. Dubbel fart ger dubbel reaktionssträcka och fyrdubbel bromssträcka. Därför blir "bara lite för fort" ingen liten avvikelse.',
      },
      { kind: 'memory', text: 'Skylten är taket, väglaget är verkligheten.' },
    ],
    curriculumChapterIds: ['inledning', 'speciella-gator', 'landsvag'],
    checkQuestionIds: ['has-001', 'has-002', 'has-003', 'has-006'],
  },
  {
    id: 'les-stoppstracka',
    categoryId: 'manniskan',
    subcategoryIds: ['reaktion-och-sinnen'],
    title: 'Stoppsträckan',
    summary: 'Reaktion plus bromsning — och hur du räknar.',
    estimatedMinutes: 6,
    order: 5,
    blocks: [
      {
        kind: 'rule',
        title: 'Stoppsträcka',
        text: 'Stoppsträcka = reaktionssträcka + bromssträcka.',
      },
      {
        kind: 'paragraph',
        text: 'Reaktionssträckan är den sträcka du hinner köra innan bromsen börjar verka. För en utvilad och uppmärksam förare räknar man med ungefär en sekund.',
      },
      {
        kind: 'example',
        title: 'Räkna om till meter per sekund',
        text: 'Dela hastigheten med 3,6. 70 km/h blir 70 ÷ 3,6 ≈ 19,4 m/s. 90 km/h blir 25 m/s. Delningen kommer av att en kilometer är 1 000 meter och en timme är 3 600 sekunder.',
      },
      {
        kind: 'paragraph',
        text: 'I 90 km/h innebär alltså en sekunds reaktionstid 25 meter. Till det kommer bromssträckan, som på torr asfalt i 90 km/h ligger i storleksordningen 40 meter. Total stoppsträcka: omkring 65 meter — betydligt längre än halvljuset når.',
      },
      {
        kind: 'warning',
        text: 'Trötthet, påverkan och delad uppmärksamhet förlänger reaktionstiden. En blick på telefonen kan kosta flera sekunder, alltså långt över hundra meter i landsvägsfart.',
      },
      { kind: 'memory', text: 'Reaktion växer rakt. Bromsning växer i kvadrat.' },
    ],
    curriculumChapterIds: ['bromsar', 'dack', 'strackor'],
    checkQuestionIds: ['man-001', 'man-002', 'has-005', 'man-003'],
  },
  {
    id: 'les-parkering',
    categoryId: 'parkering',
    subcategoryIds: ['stannande-forbud', 'parkeringsforbud', 'parkeringsregler'],
    title: 'Stanna och parkera',
    summary: 'Skillnaden mellan att stanna och att parkera — och var det är förbjudet.',
    estimatedMinutes: 5,
    order: 6,
    blocks: [
      {
        kind: 'rule',
        title: 'Definitionen',
        text: 'Att stanna är ett kort uppehåll för av- och påstigning eller lastning. Allt annat uppehåll räknas som parkering — oavsett hur kort det är och oavsett om motorn går.',
      },
      {
        kind: 'paragraph',
        text: 'Skillnaden avgör vilka förbud som slår till. Vid parkeringsförbud får du fortfarande stanna kort. Vid förbud att stanna får du ingetdera.',
      },
      {
        kind: 'list',
        title: 'Här får du varken stanna eller parkera',
        items: [
          'Inom tio meter före ett övergångsställe, en cykelöverfart eller en cykelpassage',
          'I en korsning och inom tio meter från den korsande körbanans närmaste ytterkant',
          'På eller inom tio meter före en cykelbana eller ett cykelfält du korsar',
          'På ett backkrön eller i en kurva med skymd sikt',
          'I ett cykelfält, på en cykelbana eller på en busshållplats (med vissa undantag för av- och påstigning)',
        ],
      },
      {
        kind: 'list',
        title: 'Här får du stanna men inte parkera',
        items: [
          'På en huvudled',
          'Bredvid ett annat fordon som stannat eller parkerat vid körbanans kant',
          'På en väg där det finns märket förbud att parkera',
        ],
      },
      {
        kind: 'memory',
        text: 'Ett rött streck på skylten: du får stanna. Två streck som bildar ett kryss: du får ingetdera.',
      },
    ],
    curriculumChapterIds: ['stanna-parkera'],
    checkQuestionIds: ['par-001', 'par-002', 'par-004', 'par-006'],
  },
  {
    id: 'les-morker',
    categoryId: 'morker',
    subcategoryIds: ['morkerkorning', 'ljusanvandning', 'mote-i-morker'],
    title: 'Mörkerkörning',
    summary: 'Ljus, sikt och den fart som faktiskt går att hålla.',
    estimatedMinutes: 5,
    order: 7,
    blocks: [
      {
        kind: 'paragraph',
        text: 'I mörker är sikten den begränsande faktorn, inte hastighetsskylten. Halvljus lyser typiskt 50–70 meter framåt, vilket är kortare än stoppsträckan i landsvägsfart.',
      },
      {
        kind: 'rule',
        title: 'Grundregeln i mörker',
        text: 'Kör aldrig fortare än att du kan stanna inom den sträcka ljuset räcker.',
      },
      {
        kind: 'list',
        title: 'Ljusanvändning',
        items: [
          'Halvljus krävs i mörker, gryning, skymning och vid dålig sikt',
          'Blända av i god tid vid möte och när du närmar dig ett fordon bakifrån',
          'Helljuset ska vara släckt på belyst väg',
          'Dimbakljus används bara vid kraftigt nedsatt sikt — och släcks när sikten blir bättre',
        ],
      },
      {
        kind: 'warning',
        text: 'Varselljus räcker inte i mörker. De saknar ofta bakljus, vilket gör bilen osynlig bakifrån. Kontrollera att bakljusen faktiskt lyser.',
      },
      {
        kind: 'paragraph',
        text: 'Blir du bländad: sänk farten och rikta blicken mot vägkantens högra linje tills bländningen släpper. Att svara med eget helljus gör bara situationen värre för båda.',
      },
      {
        kind: 'example',
        title: 'Det farligaste ögonblicket',
        text: 'Precis i mötet är sikten som sämst samtidigt som ljuskäglan pekar snett åt höger. En mörkklädd gående i vägkanten kan då vara praktiskt taget osynlig. Sänk farten inför mötet, inte efter.',
      },
      { kind: 'memory', text: 'Ser du 50 meter kan du inte stanna på 90.' },
    ],
    curriculumChapterIds: ['belysning', 'synen'],
    checkQuestionIds: ['mor-001', 'mor-003', 'mor-004', 'mor-005'],
  },
  {
    id: 'les-halka',
    categoryId: 'halka',
    subcategoryIds: ['halka', 'vinterkorning', 'vattenplaning'],
    title: 'Halka och väglag',
    summary: 'Grepp är en begränsad resurs.',
    estimatedMinutes: 5,
    order: 8,
    blocks: [
      {
        kind: 'paragraph',
        text: 'Däckens grepp delas mellan att bromsa, styra och accelerera. Gör du två saker samtidigt tar greppet slut fortare — det är hela förklaringen till varför mjuka, tidiga rörelser fungerar på halt underlag.',
      },
      {
        kind: 'rule',
        title: 'Vinterdäck',
        text: 'Vid vinterväglag under perioden 1 december till 31 mars krävs vinterdäck. Både datumet och väglaget måste stämma.',
      },
      {
        kind: 'list',
        title: 'Mönsterdjup',
        items: [
          'Sommardäck: minst 1,6 mm',
          'Vinterdäck vid vinterväglag: minst 3 mm',
          'Alla fyra hjulen ska ha samma däcktyp',
        ],
      },
      {
        kind: 'paragraph',
        text: 'Halkan uppstår först på broar, i skuggiga partier och där vägen går nära vatten. En bro kyls både uppifrån och underifrån och saknar markvärme.',
      },
      {
        kind: 'rule',
        title: 'Vid vattenplaning',
        text: 'Släpp gasen, håll ratten stilla och undvik att bromsa tills däcken får kontakt igen. Varje kraftig manöver får effekt först när greppet återvänder — och blir då plötslig.',
      },
      { kind: 'memory', text: 'Broar fryser först. Släpp gasen, håll rakt, gör ingenting.' },
    ],
    curriculumChapterIds: ['vinter', 'dack'],
    checkQuestionIds: ['hal-001', 'hal-004', 'hal-005', 'for-001'],
  },
  {
    id: 'les-omkorning',
    categoryId: 'omkorning',
    subcategoryIds: ['omkorningsregler', 'omkorningsforbud'],
    title: 'Omkörning',
    summary: 'Den mest riskfyllda manövern du gör.',
    estimatedMinutes: 4,
    order: 9,
    blocks: [
      {
        kind: 'rule',
        title: 'Huvudregeln',
        text: 'Omkörning sker till vänster. Höger är undantaget — till exempel när fordonet framför förbereder en vänstersväng, eller i körfältsindelad trafik.',
      },
      {
        kind: 'list',
        title: 'Omkörning är förbjuden',
        items: [
          'Strax före och på ett obevakat övergångsställe',
          'Strax före och i en vägkorsning, med vissa undantag',
          'När sikten inte räcker för hela omkörningssträckan',
          'Där heldragen linje eller vägmärke förbjuder det',
        ],
      },
      {
        kind: 'example',
        title: 'Räkna på tiden',
        text: 'Ska du köra om en lastbil som håller 70 när du kan hålla 90 tar du in 20 km/h, alltså 5,6 meter per sekund. Att passera ett långt ekipage med marginal före och efter tar då många sekunder — under vilka en mötande bil i 90 km/h kommer emot dig med 25 meter per sekund.',
      },
      {
        kind: 'warning',
        text: 'Sikten fram till ett backkrön säger ingenting. Det är sikten bortom krönet som avgör.',
      },
      { kind: 'memory', text: 'Kort fartskillnad, lång omkörning.' },
    ],
    curriculumChapterIds: ['omkorningar', 'motorvag'],
    checkQuestionIds: ['omk-001', 'omk-002', 'omk-003', 'omk-008'],
  },
  {
    id: 'les-risker',
    categoryId: 'risker',
    subcategoryIds: ['riskbedomning', 'skymd-sikt', 'barn-och-oskyddade'],
    title: 'Riskbedömning',
    summary: 'Kör efter vad som kan hända.',
    estimatedMinutes: 5,
    order: 10,
    blocks: [
      {
        kind: 'paragraph',
        text: 'Snabb reaktion är en sista utväg med små marginaler. Det som verkligen skiljer en säker förare från en osäker är att marginalerna skapas i förväg.',
      },
      {
        kind: 'rule',
        title: 'Grundfrågan',
        text: 'Fråga dig hela tiden: vad skulle jag göra om något dök upp här — och har jag utrymmet att göra det?',
      },
      {
        kind: 'list',
        title: 'Tre saker som ger dig tid',
        items: [
          'Sänkt fart där sikten är skymd',
          'Ökat sidoavstånd till parkerade bilar, cyklister och tunga fordon',
          'Blicken långt fram i stället för på bilen närmast framför',
        ],
      },
      {
        kind: 'paragraph',
        text: 'Barn är särskilt utsatta eftersom förmågan att bedöma hastighet och avstånd utvecklas sent, och eftersom deras synfält i sidled är smalare än vuxnas. En boll som rullar ut på gatan går före allt annat i ett barns huvud.',
      },
      {
        kind: 'warning',
        text: 'Ett fordon som saktar in före ett övergångsställe gör det ofta för att någon ska gå över. Att passera det i det läget är en av de mest typiska allvarliga olyckorna med gående.',
      },
      { kind: 'memory', text: 'Ser du en boll — bromsa för barnet.' },
    ],
    curriculumChapterIds: ['trafikolyckor', 'trotthet', 'alkohol', 'nedsatt-formaga', 'barn'],
    checkQuestionIds: ['ris-001', 'ris-002', 'ris-004', 'ris-007'],
  },
];

export const LESSON_BY_ID: ReadonlyMap<string, Lesson> = new Map(LESSONS.map((l) => [l.id, l]));

export function getLesson(id: string): Lesson | undefined {
  return LESSON_BY_ID.get(id);
}
