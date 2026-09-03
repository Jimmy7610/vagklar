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
        title: 'Rangordningen',
        text: 'Får du flera budskap samtidigt gäller de i den här ordningen: polisens tecken, trafiksignal, vägmärke, allmän regel. Det som står högre upp ersätter det som står lägre.',
      },
      {
        kind: 'sourceImage',
        imageId: 'signal-over-vajningsmarke',
        prompt: 'Två anvisningar samtidigt — vilken gäller?',
        caption:
          'Signalen lyser grönt och väjningspliktsmärket står kvar bredvid den. Signalen står högre i rangordningen, så du får köra utan att väja. Slocknar signalen är det märket som gäller igen.',
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
        kind: 'sourceImage',
        imageId: 'placering-landsvag',
        prompt: 'Var lägger du bilen här?',
        caption:
          'Kurvan döljer både mötande trafik och vägkanten bakom den. Placeringen en bit in i körfältet ger marginal åt båda hållen — så långt höger som är lämpligt, inte så långt höger som går.',
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
        kind: 'sourceImage',
        imageId: 'gangbana-utfart',
        prompt: 'Vem väjer du för på väg ut?',
        caption:
          'Ut från fastigheten korsar du först gångbanan och sedan cykelbanan, och har väjningsplikt mot båda — innan du ens är framme vid bilvägen.',
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
        imageId: 'forbud-att-stanna',
        prompt: 'Från var gäller förbudet?',
        caption:
          'Märket gäller framåt i din färdriktning, från stolpen och tills något upphäver det. Bakom stolpen gäller det inte — och tio meter före övergångsstället gäller förbudet ändå, med eller utan märke.',
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
        kind: 'sourceImage',
        imageId: 'avblandning-mote-1',
        prompt: 'Steg 1 — långt ifrån varandra',
        caption: 'Båda kör med helljus. Ljuset når långt fram på vägen utan att nå den mötande.',
      },
      {
        kind: 'sourceImage',
        imageId: 'avblandning-mote-2',
        prompt: 'Steg 2 — käglorna möts',
        caption:
          'Nu når ljuset fram till den andra bilen. Det är här du bländar av — inte när du själv blir bländad.',
      },
      {
        kind: 'sourceImage',
        imageId: 'avblandning-mote-3',
        prompt: 'Steg 3 — i jämnhöjd',
        caption:
          'Bredvid varandra kan ingen blända den andre. Helljuset ska tillbaka direkt, inte efter mötet.',
      },
      {
        kind: 'sourceImage',
        imageId: 'skymning-belyst-vag',
        prompt: 'Vad ska du lägga märke till?',
        caption:
          'Skymning på belyst väg. Gatlyktorna gör att du ser vägbanan, men halvljuset krävs ändå — främst för att du ska synas. Helljuset ska däremot vara släckt här, både för den mötande bussen och för den belysta vägen.',
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
        kind: 'sourceImage',
        imageId: 'isig-landsvag-utan-linjer',
        prompt: 'Hur mycket grepp finns här?',
        caption:
          'Klar himmel och sol säger ingenting om underlaget. Vägbanan är packad snö, hjulspåren är blankslitna och inga vägmarkeringar syns — så vägens bredd och kant får du bedöma själv.',
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
        imageId: 'omkorning-landsvag',
        prompt: 'Var befinner sig den vita bilen?',
        caption:
          'Ute i mötande körfält, mitt i en omkörning. Linjen på din sida är heldragen — det är den som avgör vad du själv får göra, oavsett vad någon annan gör.',
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
        kind: 'sourceImage',
        imageId: 'bussar-vid-hallplats',
        prompt: 'Var kan någon dyka upp här?',
        caption:
          'Två bussar vid hållplatsen skymmer hela ytan framför sig. Den som klivit av syns inte förrän hen är ute i din körbana — så farten måste vara vald redan innan du är i jämnhöjd med den första bussen.',
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
        imageId: 'plankorsning-ljussignal',
        prompt: 'Vad gör den här korsningen svårare än en på landet?',
        caption:
          'Mitt i stan konkurrerar plankorsningen med allt annat om uppmärksamheten, och husen tar bort sikten längs spåret. Ljussignalen är då det enda du har att gå på.',
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
        imageId: 'huvudled-cykelpassage',
        prompt: 'Vad ändrar huvudledsmärket här?',
        caption:
          'Huvudleden ger dig företräde mot korsande vägar. Den säger ingenting om cykelpassagen tvärs över din egen körbana — där gäller anpassad hastighet oavsett vilket märke som står i vägkanten.',
      },
      {
        kind: 'sourceImage',
        imageId: 'bevakat-overgangsstalle',
        prompt: 'Övergångsstället med signal — vad avgör här?',
        caption:
          'Målningen i körbanan är densamma som vid ett obevakat övergångsställe. Skillnaden är signalen: när den är tänd är det den som bestämmer, inte väjningsplikten mot gående.',
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
  {
    id: 'les-vagmarken',
    categoryId: 'vagmarken',
    subcategoryIds: ['varningsmarken', 'forbudsmarken', 'pabudsmarken', 'anvisningsmarken'],
    title: 'Vägmärken',
    summary: 'Formen och färgen säger vad märket vill innan du hunnit läsa det.',
    estimatedMinutes: 8,
    order: 14,
    blocks: [
      {
        kind: 'paragraph',
        text: 'Du hinner sällan läsa ett vägmärke i lugn och ro. Därför är märkena byggda så att form och färg bär budskapet på håll: du ska veta vilken *sorts* besked du får långt innan du kan urskilja symbolen.',
      },
      {
        kind: 'rule',
        title: 'Fyra former, fyra budskap',
        text: 'Gul triangel med röd ram varnar. Rund med röd ram förbjuder. Rund och blå påbjuder — så här ska du göra. Fyrkantig och blå upplyser. Lär dig de fyra så har du redan halva vägmärkeskapitlet.',
      },
      {
        kind: 'signGrid',
        title: 'Varningsmärken — något oväntat längre fram',
        signIds: [
          'varning-vagkorsning',
          'varning-cirkulationsplats',
          'varning-overgangsstalle',
          'varning-barn',
          'varning-cyklande',
          'varning-kurva',
          'varning-flera-kurvor',
          'varning-slirig-vag',
          'varning-motande-trafik',
          'varning-vagarbete',
          'varning-djur',
          'varning-jarnvag-bommar',
          'varning-jarnvag-utan-bommar',
        ],
      },
      {
        kind: 'sourceImage',
        imageId: 'viltvarning-med-tillaggstavla',
        prompt: 'Så här ser märket ut när du möter det.',
        caption:
          'Samma varningsmärke som i rutnätet ovan, men på plats: i vägkanten, i ögonvrån, med en tilläggstavla under sig. Tavlan säger 0–800 m — hur långt varningen gäller, inte hur stor risken är.',
      },
      {
        kind: 'warning',
        text: 'Ett varningsmärke ger dig aldrig företräde. Varning för vägkorsning betyder att korsningen kommer — inte att du kör först. Där gäller högerregeln.',
      },
      {
        kind: 'signGrid',
        title: 'Väjningspliktsmärken — vem som kör först',
        signIds: [
          'vajningsplikt',
          'stopp',
          'huvudled',
          'huvudled-upphor',
          'overgangsstalle-b3',
          'cykeloverfart',
          'vajningsplikt-motande',
          'motande-har-vajningsplikt',
        ],
      },
      {
        kind: 'signCompare',
        title: 'Lätt att blanda ihop',
        leftId: 'vajningsplikt',
        rightId: 'stopp',
        note: 'Väjningsplikt betyder att du ska lämna företräde — du får rulla vidare om vägen är fri. Stopplikt betyder att fordonet ska stå helt stilla, även när du ser att inget kommer. Det är den enda skillnaden, och den är absolut.',
      },
      {
        kind: 'signGrid',
        title: 'Förbudsmärken — det här får du inte',
        signIds: [
          'forbud-infart',
          'forbud-trafik-fordon',
          'hastighet-30',
          'hastighet-50',
          'hastighet-70',
          'hastighet-90',
          'hastighet-110',
          'forbud-omkorning',
          'forbud-omkorning-upphor',
          'forbud-parkera',
          'forbud-stanna',
        ],
      },
      {
        kind: 'signCompare',
        title: 'Lätt att blanda ihop',
        leftId: 'forbud-parkera',
        rightId: 'forbud-stanna',
        note: 'Räkna strecken. Ett streck förbjuder parkering — du får fortfarande stanna för av- och påstigning. Två streck som bildar ett kryss förbjuder även att stanna.',
      },
      {
        kind: 'signGrid',
        title: 'Påbudsmärken — så här ska du göra',
        signIds: [
          'pabud-rakt',
          'pabud-hoger',
          'cirkulationsplats',
          'pabud-cykelbana',
          'pabud-gangbana',
          'pabud-gang-cykelbana',
          'pabud-kollektivkorfalt',
        ],
      },
      {
        kind: 'signGrid',
        title: 'Anvisningsmärken — vad som gäller här',
        signIds: [
          'motorvag',
          'motorvag-upphor',
          'motortrafikled',
          'tattbebyggt-omrade',
          'gagata',
          'gangfartsomrade',
          'rekommenderad-hastighet-30',
          'enkelriktad',
          'parkering',
        ],
      },
      {
        kind: 'signCompare',
        title: 'Lätt att blanda ihop',
        leftId: 'gagata',
        rightId: 'gangfartsomrade',
        note: 'På en gågata får du köra bara för särskilda ändamål, till exempel varutransport eller till en fastighet vid gatan. I ett gångfartsområde får du köra, men på de gåendes villkor: gångfart, väjningsplikt mot gående och parkering endast på anvisade platser.',
      },
      {
        kind: 'signCompare',
        title: 'Lätt att blanda ihop',
        leftId: 'hastighet-30',
        rightId: 'rekommenderad-hastighet-30',
        note: 'Röd ram är ett förbud: 30 är taket. Blå skylt är en anvisning: 30 är rekommenderat, medan den skyltade hastighetsbegränsningen fortfarande gäller. Färgen avgör om siffran är en gräns eller ett råd.',
      },
      {
        kind: 'signGrid',
        title: 'Tilläggstavlor — de ändrar huvudmärket',
        signIds: [
          'tavla-tid',
          'tavla-tid-lordag',
          'tavla-tid-helgdag',
          'tavla-avstand',
          'tavla-utstrackning',
          'tavla-riktning',
          'tavla-avgift',
          'tavla-boende',
          'tavla-flervagsstopp',
          'tavla-nedsatt-syn',
        ],
      },
      {
        kind: 'rule',
        title: 'Läs tiderna rätt',
        text: 'Svarta siffror gäller vardagar. Siffror inom parentes gäller lördag och dag före helgdag. Röda siffror gäller sön- och helgdag. Parentesen är den som oftast läses förbi — och den avgör ofta om du får parkera just den dagen.',
      },
      {
        kind: 'sourceImage',
        imageId: 'p-skylt-avgift-boende',
        prompt: 'Vilka tavlor gäller samtidigt?',
        caption:
          'Huvudmärket säger att parkering är tillåten. Tavlorna under säger när, hur länge och för vem.',
      },
      {
        kind: 'rule',
        title: 'Katalogen är inte vägen',
        text: 'Ett märke du känner igen på vit botten kan du ändå missa i trafiken. Där är det litet, står vid sidan, ses snett och kommer medan du tittar på något annat. Nedan står bokens bild bredvid ett fotografi av samma märke på plats.',
      },
      {
        kind: 'signInContext',
        signId: 'varning-djur',
        imageId: 'viltvarning-med-tillaggstavla',
        notice:
          'Märket står långt ute på vägrenen och tavlan under det anger en sträcka. På den här sträckan är det alltså inte en punkt du ska passera utan en hel kilometer att vara vaksam på.',
      },
      {
        kind: 'signInContext',
        signId: 'varning-vagkorsning',
        imageId: 'varning-vagkorsning-i-kurva',
        notice:
          'Det finns ingen korsning att se i bilden. Märket sitter före kurvan, och platsen det varnar för ligger bortom den.',
      },
      {
        kind: 'signInContext',
        signId: 'parkering',
        imageId: 'p-skylt-avgift-boende',
        notice:
          'Fyra skyltar på samma stolpe. Läs dem uppifrån och ned, och läs klart innan du bestämmer dig — det är den nedersta som avgör om du får stå här.',
      },
      {
        kind: 'signInContext',
        signId: 'vajningsplikt',
        imageId: 'korfaltspilar-cirkulation',
        notice:
          'Märket står på en refug mitt framför dig, tillsammans med cirkulationsmärket. I körbanan finns dessutom en pil som säger vart körfältet leder.',
      },
      {
        kind: 'rule',
        title: 'Tilläggstavlan ändrar märket ovanför',
        text: 'Ett märke säger *vad* som gäller. Tilläggstavlan säger *när*, *var*, *hur långt* eller *för vem*. Ingen av dem betyder något ensam — det är kombinationen som är regeln, och den läses uppifrån och ned.',
      },
      {
        kind: 'signAssembly',
        mainSignId: 'varning-annan-fara',
        plateIds: ['tavla-avstand'],
        prompt: 'Var börjar regeln?',
      },
      {
        kind: 'paragraph',
        text: 'Utan tavlan hade märket bara sagt att något oväntat finns längre fram. Med tavlan vet du också hur långt fram — och att du inte behöver göra något ännu.',
      },
      {
        kind: 'signAssembly',
        mainSignId: 'forbud-parkera',
        plateIds: ['tavla-utstrackning'],
        prompt: 'Hur långt gäller förbudet?',
      },
      {
        kind: 'signAssembly',
        mainSignId: 'parkering',
        plateIds: ['tavla-tid', 'tavla-avgift'],
        prompt: 'Två tavlor under samma märke',
      },
      {
        kind: 'paragraph',
        text: 'Flera tavlor läses tillsammans, uppifrån och ned. Här får du parkera — under den angivna tiden, och mot avgift. Faller en av förutsättningarna bort gäller inte tillståndet.',
      },
      {
        kind: 'signAssembly',
        mainSignId: 'vajningsplikt',
        plateIds: ['tavla-flervagsvajning'],
        prompt: 'Den tavla som ändrar mest',
      },
      {
        kind: 'warning',
        text: 'Flervägsväjning betyder att *alla* tillfarter har väjningsplikt. Då finns ingen som har företräde, och högerregeln avgör mellan er. Det är lätt att läsa sin egen väjningsplikt som att någon annan har rätt att köra.',
      },
      {
        kind: 'list',
        title: 'Fyra saker en tilläggstavla kan göra',
        items: [
          'Flytta regeln: avstånd, som "gäller om 100 m"',
          'Sträcka ut den: utsträckning, som "gäller hela sträckan"',
          'Rikta den: en pil, som "gäller åt det hållet"',
          'Begränsa vem eller när: tid, fordonsvikt, rörelsehindrad',
        ],
      },
      {
        kind: 'memory',
        text: 'Märket säger vad. Tavlan säger när, var eller för vem. Läs uppifrån och ned, och läs klart innan du bestämmer dig.',
      },
      {
        kind: 'signCatalogue',
        title: 'Slå upp vilket märke som helst',
      },
      {
        kind: 'memory',
        text: 'Gul triangel varnar. Röd ring förbjuder. Blå rund påbjuder. Blå fyrkant upplyser.',
      },
    ],
    curriculumChapterIds: ['vagmarken'],
    checkQuestionIds: ['vmk-001', 'vmk-004', 'vmk-009', 'vmk-013'],
  },
  {
    id: 'les-vagmarkeringar',
    categoryId: 'vagmarken',
    subcategoryIds: ['vagmarkeringar', 'korfalt-och-sving'],
    title: 'Vägmarkeringar',
    summary: 'Linjen närmast dig är den som gäller för dig.',
    estimatedMinutes: 6,
    order: 15,
    blocks: [
      {
        kind: 'paragraph',
        text: 'Vägmärken sitter vid sidan av vägen och gäller alla. Vägmarkeringar ligger i vägbanan och gäller ofta bara den ena körriktningen. Det är därför en och samma markering kan säga olika saker till dig och till den som möter dig.',
      },
      {
        kind: 'rule',
        title: 'Läs linjen närmast dig',
        text: 'Vid en kombinerad linje — heldragen på ena sidan, streckad på den andra — är det linjen på din sida som avgör. Är den heldragen får du inte korsa den, även om den mötande föraren får korsa sin.',
      },
      {
        kind: 'markingGrid',
        title: 'Längsgående markeringar',
        markingIds: [
          'mittlinje',
          'varningslinje',
          'heldragen-linje',
          'kombinerad-linje',
          'kantlinje',
          'ledlinje',
          'sparromrade',
        ],
      },
      {
        kind: 'markingCompare',
        title: 'Lätt att blanda ihop',
        leftId: 'mittlinje',
        rightId: 'varningslinje',
        note: 'Titta på förhållandet mellan streck och mellanrum. Mittlinjen har korta streck och långa mellanrum. Varningslinjen har långa streck och korta mellanrum, och varnar för att sikten eller utrymmet är begränsat. Båda får korsas — men den ena ber dig tänka efter först.',
      },
      {
        kind: 'markingGrid',
        title: 'Tvärgående markeringar',
        markingIds: ['stopplinje', 'vajningslinje', 'overgangsstalle-m15', 'cykelpassage-m16'],
      },
      {
        kind: 'markingCompare',
        title: 'Lätt att blanda ihop',
        leftId: 'stopplinje',
        rightId: 'vajningslinje',
        note: 'Stopplinjen är en bred obruten linje: här ska fordonet stå helt stilla. Väjningslinjen är en rad trianglar: här gäller väjningsplikt, och du får rulla vidare om vägen är fri. Formen på markeringen talar alltså om ifall du måste stanna eller bara lämna företräde.',
      },
      {
        kind: 'markingCompare',
        title: 'Lätt att blanda ihop',
        leftId: 'overgangsstalle-m15',
        rightId: 'cykelpassage-m16',
        note: 'Övergångsstället är breda band längs körriktningen. Cykelpassagen är två rader rutor. Rutorna ensamma betyder att du ska anpassa hastigheten — först när det också finns ett vägmärke och en väjningslinje är det en cykelöverfart med full väjningsplikt.',
      },
      {
        kind: 'markingGrid',
        title: 'Symboler i körbanan',
        markingIds: ['korfaltspilar', 'markering-cykel', 'markering-buss', 'markering-hastighet'],
      },
      {
        kind: 'sourceImage',
        imageId: 'korfaltspilar-cirkulation',
        prompt: 'Så ser en körfältspil ut på riktigt.',
        caption:
          'Pilen är målad långt före korsningen och sedd i skarp vinkel — inte rakt uppifrån som i katalogen. Det är den vyn du ska känna igen i farten.',
      },
      {
        kind: 'warning',
        text: 'Körfältspilar ersätter inte blinkersen. Mötande och korsande trafikanter ser inte pilarna i vägbanan — de ser bara din blinkers.',
      },
      {
        kind: 'markingGrid',
        title: 'Så ritas väjningslinjen',
        markingIds: ['vajningslinje'],
      },
      {
        kind: 'sourceImage',
        imageId: 'vajningslinje-utfart',
        prompt: 'Och så ser den ut på vägen.',
        caption:
          'Samma markering, fotograferad från förarplatsen. Färgen är sliten, linjen ses snett och krönet döljer en del av den — men kravet är detsamma: väjningsplikt, utan skyldighet att stanna om vägen är fri.',
      },
      {
        kind: 'paragraph',
        text: 'Det är värt att titta på båda. I katalogen är markeringen skarp, vit och sedd rakt uppifrån. På vägen är den nött, grå och sedd i perspektiv — och det är den versionen du ska känna igen i farten.',
      },
      {
        kind: 'sourceImage',
        imageId: 'landsvag-kantlinjer',
        prompt: 'Vilka linjer ser du?',
        caption:
          'Heldragna kantlinjer på båda sidor och en streckad mittlinje. Kantlinjen visar var körbanan slutar.',
      },
      {
        kind: 'memory',
        text: 'Korta streck: kör om. Långa streck: tänk efter. Heldragen på din sida: stanna i ditt körfält.',
      },
    ],
    curriculumChapterIds: ['vagmarken', 'korfalt'],
    checkQuestionIds: ['mrk-001', 'mrk-004', 'mrk-007', 'mrk-009'],
  },
  {
    id: 'les-krockskydd',
    categoryId: 'fordonet',
    subcategoryIds: ['krocksakerhet', 'dack-och-bromsar'],
    title: 'Krockskydd i bilen',
    summary: 'Vad som tar upp krocken, och var det inte finns något att ta upp den med.',
    estimatedMinutes: 5,
    order: 16,
    curriculumChapterIds: ['krocksakerhet', 'bilbarnstolar', 'bromsar'],
    checkQuestionIds: ['bl4-005', 'krk-002', 'krk-007'],
    blocks: [
      {
        kind: 'paragraph',
        text: 'En modern bil är byggd för att offra sig. Plåten längst fram och längst bak är gjord för att tryckas ihop, eftersom varje centimeter som viks ihop är en centimeter som kroppen inne i bilen slipper bromsas på.',
      },
      {
        kind: 'sourceImage',
        imageId: 'deformationszoner',
        prompt: 'Titta på bilden — var finns utrymmet?',
        caption:
          'Zonerna märkta 1 är byggda för att tryckas ihop. Zonerna märkta 2 är sidorna, där det knappt finns någon plåt alls mellan vägen och den som sitter i bilen.',
      },
      {
        kind: 'rule',
        title: 'Därför är sidokrockar värre',
        text: 'Fram och bak finns en halvmeter konstruktion att ta av. I sidled finns en dörr. Det är hela förklaringen till varför en korsning är farligare än en upphinnandeolycka i samma hastighet.',
      },
      {
        kind: 'paragraph',
        text: 'Krockkudden är inte ett mjukt skydd utan en kraftig gasgenerator. Den blåses upp på några hundradels sekunder och är beräknad för en framåtvänd vuxen som har bältet på sig. Möter den något annat blir den ett slag i stället för ett skydd.',
      },
      {
        kind: 'sourceImage',
        imageId: 'krockkudde-indikator',
        prompt: 'Vad står det i taket?',
        caption:
          'Panelen visar om passagerarkrockkudden är på. Här lyser ON — kudden är aktiv, och då får ingen bakåtvänd barnstol sitta i framsätet.',
      },
      {
        kind: 'sourceImage',
        imageId: 'bilbarnstol-bakatvand',
        prompt: 'Samma besked, på stolen.',
        caption:
          'Den gula dekalen på babyskyddets sida säger det med en symbol i stället för ord. Skyddet ska sitta bakåtvänt, och aldrig framför en aktiv krockkudde.',
      },
      {
        kind: 'warning',
        text: 'Ingen omständighet gör undantag från det: inte barnets ålder, inte ISOFIX-fästen, inte att sätet är skjutet långt bak. Antingen är kudden urkopplad, eller så sitter stolen i baksättet.',
      },
      {
        kind: 'originalVisual',
        visualId: 'baltets-vag',
        prompt: 'Och bältet under kudden?',
      },
      {
        kind: 'originalVisual',
        visualId: 'nackskydd-position',
        prompt: 'Det skydd som är lättast att ställa in fel',
      },
      {
        kind: 'list',
        title: 'Vanliga missuppfattningar',
        items: [
          'Att bältet räcker i låg fart — vid 50 km/h motsvarar krocken ett fall från tredje våningen',
          'Att en krockkudde ersätter bältet — den är beräknad för att komplettera det, inte ersätta det',
          'Att barn under 15 år är passagerarens eget ansvar — det är förarens',
          'Att nackskyddet är en kudde — det är ett skydd mot pisksnärt och ska nå upp i höjd med hjässan',
        ],
      },
      {
        kind: 'paragraph',
        text: 'Allt detta förutsätter att bilen kan bromsa. Skivbromsen arbetar genom att bromsoket klämmer ett belägg mot en roterande skiva; hela bromsverkan är friktionen mellan de två ytorna.',
      },
      {
        kind: 'sourceImage',
        imageId: 'bromsskiva',
        prompt: 'Så fungerar det',
        caption:
          'Oket sitter runt skivans kant och klämmer belägget mot den. Sjunker bromspedalen långsamt mot golvet är det oftast läckage i systemet; känns den fjädrande är det luft.',
      },
      {
        kind: 'memory',
        text: 'Bilen skyddar dig genom att gå sönder på rätt ställe. Sidorna är inte ett av dem.',
      },
    ],
  },
  {
    id: 'les-last-och-slap',
    categoryId: 'last',
    subcategoryIds: ['lastning', 'slapvagn'],
    title: 'Last och släp',
    summary: 'Måtten, markeringen och var i släpet tyngden ska ligga.',
    estimatedMinutes: 6,
    order: 17,
    curriculumChapterIds: ['last', 'langd-bredd'],
    checkQuestionIds: ['bl4-001', 'bl4-002', 'bl4-006'],
    blocks: [
      {
        kind: 'paragraph',
        text: 'Reglerna om last handlar om två saker som är lätta att blanda ihop: hur brett och långt ekipaget får vara, och hur lasten ska sitta fast. Det första är mått, det andra är fysik.',
      },
      {
        kind: 'rule',
        title: 'På bredden gäller två krav samtidigt',
        text: 'Totalbredden får vara högst 260 cm, och lasten får skjuta ut högst 20 cm utanför bilen åt sidan. Båda måste vara uppfyllda — det räcker inte att klara ett av dem.',
      },
      {
        kind: 'sourceImage',
        imageId: 'lastbredd-tillaten',
        prompt: 'Vad händer här?',
        caption:
          'Lasten är 260 cm bred och ligger mitt på, så den sticker ut ungefär lika mycket åt båda hållen. Båda kraven är uppfyllda.',
      },
      {
        kind: 'sourceImage',
        imageId: 'lastbredd-otillaten',
        prompt: 'Och här?',
        caption:
          'Samma bredd, 260 cm — men lasten är förskjuten och sticker ut 40 cm på ena sidan. Måttet på bredden räddar inte situationen.',
      },
      {
        kind: 'rule',
        title: 'På längden gäller utmärkning',
        text: 'Skjuter lasten ut mer än en meter bakåt ska den märkas ut. Skjuter den ut framför bilen ska den märkas ut oavsett hur lite. I dagsljus med flagga eller tydlig färg, i mörker med lykta och reflex — vitt framåt, rött bakåt.',
      },
      {
        kind: 'sourceImage',
        imageId: 'lastlangd-utmarkning',
        prompt: 'Titta på markeringarna.',
        caption:
          'Lasten skjuter ut 3 meter fram och 4 meter bak, och båda ändarna är märkta. Bil och last blir tillsammans 13 meter, alltså långt under den högsta tillåtna längden på 24 meter.',
      },
      {
        kind: 'paragraph',
        text: 'Släpvagnen lyder under samma tanke men med en extra faktor: var tyngden ligger i förhållande till släpets hjulaxel. Det avgör hur mycket av lasten som vilar på bilens dragkrok — kultrycket.',
      },
      {
        kind: 'sourceImage',
        imageId: 'kultryck-hogt',
        prompt: 'Lasten längst fram',
        caption:
          'Tyngden pressar kopplingen nedåt. Bilens framvagn lättar, styrningen blir vag och halvljuset pekar upp i ögonen på mötande.',
      },
      {
        kind: 'sourceImage',
        imageId: 'kultryck-lagt',
        prompt: 'Lasten längst bak',
        caption:
          'Släpet tippar bakåt och lyfter kopplingen. Nu lättar bilens bakvagn i stället — och det är bakvagnen som håller ekipaget rakt när släpet börjar vandra.',
      },
      {
        kind: 'memory',
        text: 'Tungt strax framför släpets hjulaxel. Varken längst fram eller längst bak.',
      },
      {
        kind: 'sourceImage',
        imageId: 'spannband',
        prompt: 'Kom ihåg',
        caption:
          'Etiketten på bandet anger hur mycket det håller. Vid en inbromsning från 50 km/h drar lasten framåt med långt mer än sin egen vikt — ett oskyddat bagage i kupén blir ett projektil.',
      },
      {
        kind: 'sourceImage',
        imageId: 'bogsering-utmarkning',
        prompt: 'Och vid bogsering',
        caption:
          'Är avståndet mellan bilarna över två meter ska linan märkas ut. Bogsering sker i högst 30 km/h, och på motorväg bara fram till närmaste avfart.',
      },
    ],
  },
  {
    id: 'les-dack',
    categoryId: 'fordonet',
    subcategoryIds: ['dack-och-bromsar', 'vinterkorning'],
    title: 'Däcken',
    summary: 'Fyra ytor stora som varsin handflata — och allt bilen gör går genom dem.',
    estimatedMinutes: 7,
    order: 18,
    curriculumChapterIds: ['dack', 'styrning'],
    checkQuestionIds: ['egr-001', 'egr-002', 'egr-003'],
    blocks: [
      {
        kind: 'paragraph',
        text: 'Allt en bil gör — styra, bromsa, accelerera — sker genom fyra ytor mot vägen som tillsammans är ungefär lika stora som fyra handflator. Ingen krockkudde, inget bromssystem och ingen stabilitetskontroll kan skapa grepp som inte finns i den ytan.',
      },
      {
        kind: 'originalVisual',
        visualId: 'monsterdjup',
        prompt: 'Titta på däcket — var mäts djupet?',
      },
      {
        kind: 'rule',
        title: 'Kraven på mönsterdjup',
        text: 'Minst 1,6 mm gäller alltid. Vid vinterväglag mellan 1 december och 31 mars ska däcken dessutom vara vinterdäck med minst 3 mm mönsterdjup. Kravet mäts i huvudspårets botten.',
      },
      {
        kind: 'originalVisual',
        visualId: 'dacktryck',
        prompt: 'Vad ska du lägga märke till?',
      },
      {
        kind: 'paragraph',
        text: 'Lufttrycket syns inte, men dess spår gör det. Ett däck slitet på båda kanterna har rullat med för lite luft; ett slitet i mitten med för mycket. Är slitaget ojämnt bara på ena sidan sitter felet i stället oftast i hjulinställningen.',
      },
      {
        kind: 'originalVisual',
        visualId: 'dackskador',
        prompt: 'Vanlig fälla',
      },
      {
        kind: 'warning',
        text: 'Ett däck kan ha gott om mönster kvar och ändå vara odugligt. En blåsa betyder att stommen inne i däcket har gått av, och den syns ofta först dagar efter smällen mot kantstenen som orsakade den.',
      },
      {
        kind: 'originalVisual',
        visualId: 'sommar-vinterdack',
        prompt: 'Vad är det egentligen som skiljer?',
      },
      {
        kind: 'paragraph',
        text: 'Skillnaden mellan sommar- och vinterdäck är inte att det ena har mer gummi. Det är antalet kanter. Varje skåra i en vinterdäcksklack är en kant till som kan hugga tag i snö, och gummiblandningen håller sig mjuk i kyla i stället för att hårdna.',
      },
      {
        kind: 'originalVisual',
        visualId: 'vattenplaning',
        prompt: 'Så påverkar det körningen',
      },
      {
        kind: 'rule',
        title: 'Vid vattenplaning gör du ingenting',
        text: 'Hjulet rör inte vägen, så ratten och bromsen har inget att verka mot. Släpp gasen, håll ratten stilla och låt farten sjunka. Att bromsa eller styra gör skada när greppet kommer tillbaka.',
      },
      {
        kind: 'list',
        title: 'Vanliga missuppfattningar',
        items: [
          'Att mönsterdjup är samma sak som hur mycket gummi som syns — det mäts i spåret',
          'Att slitage bara betyder ålder — var det sitter avslöjar lufttrycket',
          'Att vattenplaning går att bromsa eller styra ur',
          'Att vinterdäck bara handlar om mönstret — det handlar lika mycket om gummits kyltålighet',
          'Att ett däck med bra mönster alltid är godkänt',
        ],
      },
      {
        kind: 'memory',
        text: 'Kontakten med vägen är fyra handflator stor. Allt annat i bilen förhandlar om vad de fyra ytorna klarar.',
      },
    ],
  },
  {
    id: 'les-trafikolyckor',
    categoryId: 'manniskan',
    subcategoryIds: ['riskbedomning'],
    title: 'När det går fel',
    summary: 'Vad farten gör med krockvåldet, vad som händer inne i bilen, och vad du gör på plats.',
    estimatedMinutes: 6,
    order: 19,
    curriculumChapterIds: ['trafikolyckor'],
    checkQuestionIds: ['ris-008', 'ris-003', 'ris-001'],
    blocks: [
      {
        kind: 'paragraph',
        text: 'En olycka är sällan ett enda misstag. Den är en kedja: något oväntat, för lite marginal, för sen reaktion. Det mesta i den kedjan går att påverka innan den börjar — och det som påverkar mest är farten.',
      },
      {
        kind: 'originalVisual',
        visualId: 'krockvald-hastighet',
        prompt: 'Före olyckan — vad gör farten?',
      },
      {
        kind: 'rule',
        title: 'Energin växer med kvadraten på farten',
        text: 'Dubbla farten ger fyra gånger rörelseenergin. Det är därför en påkörning i 60 km/h inte är dubbelt så allvarlig som en i 30, och därför en sänkning med några få km/h betyder mer än den känns.',
      },
      {
        kind: 'originalVisual',
        visualId: 'tre-kollisioner',
        prompt: 'Under kollisionen — vad händer, i vilken ordning?',
      },
      {
        kind: 'paragraph',
        text: 'Bilen stannar på några hundradels sekunder. Den som sitter i den gör det inte av sig själv, utan fortsätter framåt i den fart bilen hade tills något tar emot. Det är bältets hela uppgift — och den tredje kollisionen, inuti kroppen, är skälet till att även låga farter räknas.',
      },
      {
        kind: 'example',
        title: 'Vad 50 km/h motsvarar',
        text: 'En krock i 50 km/h utan bälte motsvarar ungefär ett fall från tredje våningen. Kroppen väger då tillfälligt tiotals gånger sin egen vikt, och det finns inget sätt att ta emot med armarna.',
      },
      {
        kind: 'originalVisual',
        visualId: 'varningstriangel',
        prompt: 'Efteråt — var ställer du triangeln?',
      },
      {
        kind: 'list',
        title: 'På en olycksplats, i den här ordningen',
        items: [
          'Varna — varningsblinkers, och varningstriangel så långt bak att trafiken hinner reagera',
          'Rädda — men flytta bara den som är i omedelbar fara',
          'Larma 112 och säg var du är innan du säger något annat',
          'Ge första hjälpen: fria luftvägar, andning, stoppa stora blödningar',
          'Stanna kvar tills du inte behövs — att köra från platsen är brottsligt',
        ],
      },
      {
        kind: 'warning',
        text: 'Vilt är en egen regel. Har du kört på älg, hjort, rådjur, vildsvin, björn, varg, järv, lo, utter, örn eller mufflonfår ska det anmälas till polisen även om djuret springer vidare och även om bilen är oskadd.',
      },
      {
        kind: 'list',
        title: 'Vanliga missuppfattningar',
        items: [
          'Att dubbla farten ger dubbelt krockvåld — den ger fyra gånger',
          'Att bältet behövs först i högre farter',
          'Att varningstriangeln ska stå strax bakom bilen',
          'Att man får lämna platsen om ingen verkar skadad',
          'Att en viltolycka bara behöver anmälas om djuret dör',
        ],
      },
      {
        kind: 'memory',
        text: 'Farten avgör hur mycket energi som ska tas upp. Bältet avgör vem som tar upp den.',
      },
    ],
  },
];

export const LESSON_BY_ID: ReadonlyMap<string, Lesson> = new Map(LESSONS.map((l) => [l.id, l]));

export function getLesson(id: string): Lesson | undefined {
  return LESSON_BY_ID.get(id);
}
