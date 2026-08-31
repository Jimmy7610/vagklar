import { buildQuestions, general, no, ok, trf } from './authoring';
import type { AuthoredQuestion } from './authoring';

const seeds: AuthoredQuestion[] = [
  {
    id: 'tra-001',
    category: 'trafikregler',
    subcategory: 'grundregler',
    difficulty: 1,
    ruleTested: 'Allmän aktsamhetsplikt',
    prompt: 'Vilken princip ligger till grund för alla trafikregler?',
    answers: [
      ok('Du ska vara aktsam och göra vad som krävs för att undvika en olycka.'),
      no('Den som följer skyltarna kan aldrig göra fel.'),
      no('Den som kommer först i en korsning har alltid rätt.'),
      no('Reglerna gäller bara när det finns annan trafik.'),
    ],
    short:
      'Grundregeln är omsorg och varsamhet — att undvika olyckan går före att ha rätt.',
    deep:
      'Alla detaljregler är byggda ovanpå en generell aktsamhetsplikt. Den innebär att du ska anpassa dig efter förhållandena och ta hänsyn till andra, särskilt barn, äldre och personer med funktionsnedsättning. Regeln fyller luckorna: när ingen specifik regel passar situationen är det aktsamheten som avgör.',
    sources: [trf('2 kap. 1 §')],
  },
  {
    id: 'tra-002',
    category: 'trafikregler',
    subcategory: 'trafiksignaler',
    difficulty: 1,
    ruleTested: 'Signalbilder',
    prompt: 'Vad betyder en blinkande gul signal i en korsning?',
    answers: [
      ok('Signalen är ur funktion eller avstängd — korsningens vägmärken eller högerregeln gäller.'),
      no('Du får köra, men bara om ingen annan syns.', 'signal-gult'),
      no('Alla har stopplikt.', 'stopp-utan-stopp'),
      no('Signalen visar att det snart blir grönt.', 'signal-gult'),
    ],
    short: 'Blinkande gult betyder att signalen inte reglerar korsningen. Gå tillbaka till skyltarna.',
    deep:
      'När signalen inte gäller faller regleringen tillbaka till nästa nivå: finns väjningsplikt, stopplikt eller huvudled så gäller det. Finns ingenting alls gäller högerregeln. Kör extra försiktigt — andra förare kanske tror att de har företräde.',
    sources: [trf('3 kap. 6 §')],
  },
  {
    id: 'tra-003',
    category: 'trafikregler',
    subcategory: 'oskyddade-trafikanter',
    difficulty: 2,
    ruleTested: 'Obevakat övergångsställe',
    prompt:
      'Du närmar dig ett obevakat övergångsställe. En person står vid kanten och är på väg att gå ut. Vad gäller?',
    answers: [
      ok('Du har väjningsplikt och ska låta personen gå över.'),
      no('Personen ska vänta tills det inte kommer några bilar.'),
      no('Du har väjningsplikt först när personen satt foten på vägbanan.'),
      no('Du behöver bara sänka farten och kan sedan köra vidare.'),
    ],
    short:
      'Vid obevakat övergångsställe har du väjningsplikt mot gående som gått ut på eller just ska gå ut.',
    deep:
      'Väjningsplikten gäller alltså redan innan personen är ute på vägen. Kör fram med en fart som gör att du hinner stanna, och undvik att vinka fram — en gående som går ut på din signal kan bli påkörd av ett fordon i nästa körfält.',
    memory: 'Står någon vid kanten — då gäller det redan dig.',
    sources: [trf('3 kap. 61 §')],
  },
  {
    id: 'tra-004',
    category: 'trafikregler',
    subcategory: 'oskyddade-trafikanter',
    difficulty: 3,
    ruleTested: 'Cykelöverfart och cykelpassage',
    prompt: 'Vad är skillnaden mellan en cykelöverfart och en cykelpassage?',
    answers: [
      ok(
        'Vid en cykelöverfart har du väjningsplikt mot cyklande. Vid en cykelpassage har du det inte, men ska ändå anpassa farten.',
      ),
      no('Ingen skillnad — båda ger cyklisten företräde.', 'cykeloverfart-passage'),
      no('Vid båda har cyklisten väjningsplikt mot bilar.', 'cykeloverfart-passage'),
      no('Cykelöverfart gäller bara i tätort, cykelpassage bara på landsväg.', 'cykeloverfart-passage'),
    ],
    short:
      'Cykelöverfart ger cyklisten företräde och är utmärkt med vägmärke och markering. Cykelpassage gör det inte.',
    deep:
      'En cykelöverfart har vägmärke, vägmarkering och en utformning som håller nere fordonens hastighet — där har du väjningsplikt. En cykelpassage är bara en markerad plats att korsa på; där har cyklisten väjningsplikt, men du måste ändå köra med låg fart och vara beredd. Skillnaden syns i skyltningen, inte i målningen på marken.',
    sources: [trf('3 kap. 61 a §')],
  },
  {
    id: 'tra-005',
    category: 'trafikregler',
    subcategory: 'vagens-anvandning',
    difficulty: 1,
    ruleTested: 'Grundregel för placering',
    prompt: 'Var på vägen ska du normalt köra?',
    answers: [
      ok('Så långt till höger som är lämpligt med hänsyn till säkerhet och framkomlighet.'),
      no('Så nära mitten som möjligt för att ha marginal åt höger.'),
      no('I mitten av körfältet oavsett vad som finns i vägkanten.'),
      no('Så nära vägkanten som det överhuvudtaget går.'),
    ],
    short: 'Högertrafik betyder så långt till höger som är lämpligt — inte så långt höger som möjligt.',
    deep:
      'Ordet "lämpligt" gör arbetet. Du ska ge utrymme åt mötande, men samtidigt hålla avstånd till cyklister, parkerade bilar och en vägkant som kan vara lös eller isig. På en smal väg med dålig kant är rätt placering en bit in i körfältet.',
    sources: [trf('3 kap. 7 §')],
  },
  {
    id: 'tra-006',
    category: 'trafikregler',
    subcategory: 'korfalt-och-sving',
    difficulty: 2,
    ruleTested: 'Placering före sväng',
    prompt: 'Hur ska du placera dig innan du svänger vänster i en korsning på en tvåfilig gata?',
    answers: [
      ok('Så nära mittlinjen som möjligt, utan att korsa den.'),
      no('Så långt till höger som möjligt för att andra ska kunna passera.'),
      no('Mitt i körfältet, oavsett riktning.'),
      no('Delvis över i mötande körfält för att korta svängen.'),
    ],
    short: 'Vänstersväng förbereds nära mitten, högersväng nära högerkanten.',
    deep:
      'Rätt placering gör din avsikt läsbar innan du blinkar och släpper fram trafik bakom dig. Vid högersväng ska du dessutom ligga nära kanten för att inte lämna ett gap där en cyklist kan hamna på insidan av svängen.',
    sources: [trf('3 kap. 25 §')],
  },
  {
    id: 'tra-007',
    category: 'trafikregler',
    subcategory: 'trafiksignaler',
    difficulty: 2,
    ruleTested: 'Utryckningsfordon',
    prompt: 'Ett utryckningsfordon med blåljus och sirén närmar sig bakifrån. Vad gör du?',
    answers: [
      ok('Underlättar passagen på ett säkert sätt, till exempel genom att köra åt sidan och stanna.'),
      no('Bromsar tvärt direkt så att fordonet kan köra om.'),
      no('Kör mot rött ljus för att komma ur vägen.'),
      no('Ökar farten så att du hinner ur vägen längre fram.'),
    ],
    short: 'Du ska lämna fri väg — men på ett sätt som inte skapar en ny farlig situation.',
    deep:
      'Att göra plats får inte innebära att du bryter mot andra regler så att det blir farligt: kör inte upp på trottoaren, in i en korsning eller mot rött. Blinka gärna åt höger, sakta ner mjukt och stanna där det finns utrymme. På flerfilig väg lägger sig fordon i vänsterfil åt vänster och övriga åt höger.',
    sources: [trf('2 kap. 6 §')],
  },
  {
    id: 'tra-008',
    category: 'trafikregler',
    subcategory: 'grundregler',
    difficulty: 2,
    ruleTested: 'Tecken',
    prompt: 'När ska du ge tecken med körriktningsvisare?',
    answers: [
      ok('I god tid innan manövern, så länge det behövs för att andra ska förstå din avsikt.'),
      no('Först när du påbörjar manövern, annars kan andra missförstå.'),
      no('Bara när det finns andra trafikanter i närheten.'),
      no('Under hela färden i den riktning du så småningom ska.'),
    ],
    short: 'Tecken ges i god tid före manövern och tas bort direkt efteråt.',
    deep:
      'Tecknet ska ge andra tid att anpassa sig — men om du blinkar för tidigt vid flera avfarter i rad blir signalen tvetydig. Kom ihåg att tecknet inte ger dig någon rätt: du måste fortfarande kontrollera att manövern kan göras säkert.',
    sources: [trf('3 kap. 64 §')],
  },
  {
    id: 'tra-009',
    category: 'trafikregler',
    subcategory: 'vagens-anvandning',
    difficulty: 2,
    ruleTested: 'Busshållplats i tätort',
    prompt:
      'Du kör i tätbebyggt område på en väg med 50 km/h. En buss vid en hållplats blinkar för att köra ut. Vad gäller?',
    answers: [
      ok('Du ska sänka farten och låta bussen köra ut.'),
      no('Bussen har väjningsplikt mot dig eftersom du kör på vägen.'),
      no('Regeln gäller bara om bussen redan börjat rulla.'),
      no('Du får köra om bussen om du hinner före.'),
    ],
    short:
      'Inom tätbebyggt område där hastighetsgränsen är högst 50 km/h ska du släppa ut en buss från hållplats.',
    deep:
      'Regeln gäller bussar i linjetrafik som ger tecken för att lämna hållplatsen. Bussföraren måste ändå göra det utan fara — regeln flyttar inte över hela ansvaret på dig, men du får inte gasa förbi.',
    sources: [trf('3 kap. 12 §')],
  },
  {
    id: 'tra-010',
    category: 'trafikregler',
    subcategory: 'korfalt-och-sving',
    difficulty: 3,
    ruleTested: 'Körfältsbyte',
    prompt: 'Vad måste du kontrollera innan du byter körfält?',
    answers: [
      ok('Speglar och död vinkel, samt att bytet kan ske utan fara eller hinder för andra.'),
      no('Bara sidospegeln — den täcker hela området bakom.'),
      no('Att du blinkat i minst tre sekunder, då har andra ansvar att släppa fram dig.', 'blinkers-som-lofte'),
      no('Att det finns en streckad linje, då är bytet automatiskt tillåtet.'),
    ],
    short:
      'Backspegel, sidospegel, blinkers, blick över axeln — och byte först när det inte stör någon.',
    deep:
      'Den döda vinkeln är den del av utrymmet bredvid bilen som inte syns i speglarna. En snabb blick över axeln är enda sättet att kontrollera den. Ordningen spelar roll: kontrollera först, blinka sedan, byt sist — så hinner du avbryta om något dyker upp.',
    memory: 'Spegel – blinkers – axelblick – byte.',
    sources: [trf('3 kap. 33 §'), general('Körkortsutbildning, körfältsbyte')],
  },
];

export const trafikreglerQuestions = buildQuestions(seeds);
