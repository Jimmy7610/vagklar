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
        kind: 'sourceImage',
        imageId: 'oskyltad-korsning',
        prompt: 'Vad ska du leta efter först?',
        caption: 'Inga märken, inga markeringar, ingen signal. Då är det högerregeln som gäller.',
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
        kind: 'sourceImage',
        imageId: 'p-skylt-avgift-boende',
        prompt: 'Vad ska du lägga märke till?',
        caption:
          'Tilläggstavlorna gäller samtidigt och läses uppifrån och ner. Gul botten med röd ring betyder förbud.',
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
        kind: 'sourceImage',
        imageId: 'vintervag-hjulspar',
        prompt: 'Var skiljer sig greppet?',
        caption: 'I hjulspåren syns asfalten, mellan dem ligger snön kvar. Greppet växlar i sidled.',
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
        kind: 'sourceImage',
        imageId: 'traktor-vintervag',
        prompt: 'Vad talar emot en omkörning här?',
        caption: 'Sikten är god — men snömodden mellan körfälten avgör om omkörningen är säker.',
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
  {
    id: 'les-plankorsning',
    categoryId: 'jarnvag',
    subcategoryIds: ['plankorsning-korning', 'plankorsning-marken', 'plankorsning-omkorning'],
    title: 'Järnvägskorsningar',
    summary: 'Den enda plats där motparten inte kan väja.',
    estimatedMinutes: 5,
    order: 11,
    blocks: [
      {
        kind: 'paragraph',
        text: 'En plankorsning skiljer sig från all annan trafik på en punkt: motparten kan varken väja eller stanna för dig. Ett tåg i 160 km/h rör sig drygt 44 meter i sekunden och behöver flera hundra meter för att bromsa. Hela ansvaret för att mötet inte sker ligger därför på dig.',
      },
      {
        kind: 'rule',
        title: 'Sikten bestämmer farten',
        text: 'Bilda dig först en uppfattning om sikten längs spåret, och anpassa sedan hastigheten till den. God sikt: du kan rulla över i stort sett oförändrad fart. Halvbra sikt: sakta ner och växla ner. Dålig sikt: stanna, titta åt båda håll och kör sedan över.',
      },
      {
        kind: 'list',
        title: 'Läs avståndsmärkena som en nedräkning',
        items: [
          'Tre markeringar: du är längst bort från korsningen.',
          'Två markeringar: två tredjedelar av avståndet återstår.',
          'En markering: sista tredjedelen — korsningen är nära.',
        ],
      },
      {
        kind: 'sourceImage',
        imageId: 'plankorsning-bommar',
        prompt: 'Vad ska du lägga märke till?',
        caption:
          'Kryssmärket säger att här finns en plankorsning. Bommarna avgör dessutom omkörningsfrågan.',
      },
      {
        kind: 'warning',
        text: 'Det är ljussignalen som gäller, inte bommen. Bommarna hinner ofta upp innan lamporna slutar blinka, men du får inte köra förrän det röda ljuset har slocknat — ett andra tåg kan vara på väg.',
      },
      {
        kind: 'rule',
        title: 'Kör bara in om du kommer ut',
        text: 'Du får aldrig köra in i en plankorsning om du riskerar att bli stående på spåret. Står kön still framför dig ska du vänta, även om signalen är släckt just nu.',
      },
      {
        kind: 'example',
        title: 'Om bilen ändå får stopp på spåret',
        text: 'Försök flytta bilen. En manuellt växlad bil kan ofta knuffas fram några meter med startmotorn: släpp kopplingen och håll nyckeln vriden. En automat puttas i friläge. Bommarna är gjorda av ett svagt material och går att köra igenom. Går bilen inte att flytta: lämna den och ring 112.',
      },
      {
        kind: 'rule',
        title: 'Omkörning',
        text: 'I samband med en plankorsning är omkörning förbjuden — utom när det finns bommar eller en fullständig trafiksignal med rött, gult och grönt ljus. En anordning som bara blinkar rött räcker inte. Förbudet gäller aldrig tvåhjuliga fordon.',
      },
      {
        kind: 'memory',
        text: 'Sikten bestämmer farten. Lampan bestämmer när. Kön bestämmer om.',
      },
    ],
    curriculumChapterIds: ['jarnvagskorsningar'],
    checkQuestionIds: ['jvg-001', 'jvg-005', 'jvg-007', 'jvg-013'],
  },
  {
    id: 'les-passager',
    categoryId: 'trafikregler',
    subcategoryIds: ['oskyddade-trafikanter', 'cykelpassage-overfart'],
    title: 'Passager',
    summary: 'Övergångsställe, cykelpassage och cykelöverfart — tre olika skyldigheter.',
    estimatedMinutes: 6,
    order: 12,
    blocks: [
      {
        kind: 'paragraph',
        text: 'Tre platser ser nästan likadana ut i vägbanan men ger dig helt olika skyldigheter. Att hålla isär dem är en av de mest praktiskt användbara sakerna i hela teorin.',
      },
      {
        kind: 'rule',
        title: 'Obevakat övergångsställe',
        text: 'Du har väjningsplikt mot gående som är på eller just ska gå ut på övergångsstället. Väjningsplikten ska dessutom synas: sänk farten eller stanna i god tid så att den gående vågar gå.',
      },
      {
        kind: 'rule',
        title: 'Obevakad cykelpassage',
        text: 'Här har du ingen väjningsplikt. Du ska anpassa hastigheten så att ingen fara uppstår för cyklister på passagen. Cyklisten har i sin tur väjningsplikt mot dig och får bara korsa om det kan ske utan fara.',
      },
      {
        kind: 'rule',
        title: 'Cykelöverfart',
        text: 'Här har du full väjningsplikt mot cyklande och förare av moped klass II som är ute på eller just ska färdas ut på överfarten — samma styrka som mot gående på ett obevakat övergångsställe.',
      },
      {
        kind: 'sourceImage',
        imageId: 'cykeloverfart',
        prompt: 'Vad ska du lägga märke till?',
        caption:
          'Vägmärke, rutor och väjningslinje tillsammans. Saknas märket och linjen är det en cykelpassage.',
      },
      {
        kind: 'list',
        title: 'Så ser du skillnaden',
        items: [
          'Cykelöverfart: vägmärke, vägmarkering och en väjningslinje för biltrafiken.',
          'Cykelpassage: bara vägmarkering, inget vägmärke och ingen väjningslinje.',
          'Miljön vid en cykelöverfart ska vara byggd så att det inte är lämpligt att köra fortare än 30 km/h.',
        ],
      },
      {
        kind: 'warning',
        text: 'Svänger du — eller kör ut ur en cirkulationsplats — över en cykelpassage skärps kravet: du ska köra med låg hastighet och lämna cyklande tillfälle att passera. Det är i den situationen de flesta olyckorna mellan bil och cyklist sker.',
      },
      {
        kind: 'example',
        title: 'Bevakat betyder att signalen fungerar',
        text: 'Ett övergångsställe med trafiksignaler som är släckta räknas som obevakat, och då gäller väjningsplikten mot gående. Bevakat kräver en fungerande signal eller en polis på platsen. Har någon gått ut på grönt och inte hinner över måste du låta personen gå färdigt.',
      },
      {
        kind: 'memory',
        text: 'Skylt och väjningslinje = du väjer. Bara rutor = du anpassar farten.',
      },
    ],
    curriculumChapterIds: ['passager'],
    checkQuestionIds: ['pas-008', 'pas-011', 'pas-014', 'pas-009'],
  },
  {
    id: 'les-cirkulation',
    categoryId: 'korsningar',
    subcategoryIds: ['cirkulationsplats', 'cirkulation-korfalt'],
    title: 'Cirkulationsplats',
    summary: 'Väj för alla som redan snurrar — och blinka alltid ut.',
    estimatedMinutes: 4,
    order: 13,
    blocks: [
      {
        kind: 'paragraph',
        text: 'Cirkulationsplatsen är en av de säkraste korsningstyper som finns, just för att den tvingar ner farten och tar bort de raka nittiogradiga krockvinklarna. Två regler bär upp nästan allt du behöver kunna.',
      },
      {
        kind: 'rule',
        title: 'Väjningsplikt vid infart',
        text: 'Du har väjningsplikt mot varje fordon som redan befinner sig i cirkulationen. Ordet är "varje fordon" — cyklar och mopeder räknas också. Kör in åt höger och färdas moturs.',
      },
      {
        kind: 'rule',
        title: 'Blinka alltid ut',
        text: 'Varje utfart ur cirkulationen är en högersväng, hur rakt fram det än känns. Ge tecken åt höger när du passerar refugen till avfarten före din egen.',
      },
      {
        kind: 'list',
        title: 'Körfältsval',
        items: [
          'Välj det körfält som passar din fortsatta färd, enligt märken och markeringar.',
          'Försök ligga i det högra körfältet innan du kör ut — inget krav, men säkrare.',
          'Byt körfält inne i cirkulationen bara om det kan ske utan hinder eller fara, och blinka.',
          'Underlätta för andra som behöver byta körfält genom att anpassa farten.',
        ],
      },
      {
        kind: 'warning',
        text: 'En huvudled tar slut vid cirkulationsplatsen. Att du kört på huvudled fram till infarten ger dig alltså inget företräde där.',
      },
      {
        kind: 'sourceImage',
        imageId: 'rund-korsning-utan-skylt',
        prompt: 'Vad saknas på bilden?',
        caption:
          'Rund form, men inget märke för cirkulationsplats. Då gäller högerregeln.',
      },
      {
        kind: 'example',
        title: 'Vänsterblinkning är oreglerat',
        text: 'Många trafikskolor rekommenderar vänsterblinkning vid infart när du ska långt runt, för att avskräcka väntande förare från att chansa. Det finns dock ingen tydlig regel om det, och det är olämpligt om du ligger i höger körfält — då läses det som ett körfältsbyte. Högerblinkning vid utfart är däremot alltid ett krav.',
      },
      {
        kind: 'warning',
        text: 'Är cirkulationsplatsen tom när du kommer fram får du köra in direkt. Men en rund korsning utan märket för cirkulationsplats är ingen cirkulationsplats — där gäller högerregeln.',
      },
      { kind: 'memory', text: 'Alla som redan snurrar går före. Ut ur cirkulationen: höger blinkers.' },
    ],
    curriculumChapterIds: ['cirkulationsplats'],
    checkQuestionIds: ['cir-001', 'cir-003', 'cir-008', 'cir-012'],
  },
];

export const LESSON_BY_ID: ReadonlyMap<string, Lesson> = new Map(LESSONS.map((l) => [l.id, l]));

export function getLesson(id: string): Lesson | undefined {
  return LESSON_BY_ID.get(id);
}
