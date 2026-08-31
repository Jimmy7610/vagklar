import { buildQuestions, general, no, ok, trf } from './authoring';
import type { AuthoredQuestion } from './authoring';

const seeds: AuthoredQuestion[] = [
  {
    id: 'omk-001',
    category: 'omkorning',
    subcategory: 'omkorningsregler',
    difficulty: 1,
    ruleTested: 'Omkörningens huvudregel',
    prompt: 'På vilken sida sker en omkörning normalt?',
    answers: [
      ok('Till vänster.'),
      no('Till höger, eftersom du då inte behöver korsa mittlinjen.', 'omkorning-hoger'),
      no('På den sida där det finns mest utrymme.', 'omkorning-hoger'),
      no('Till vänster på landsväg och till höger i tätort.', 'omkorning-hoger'),
    ],
    short: 'Omkörning sker till vänster. Höger är undantaget, inte regeln.',
    deep:
      'Regeln bygger på att förare i högertrafik i första hand bevakar det som händer till vänster om dem. En omkörning där ligger i förarens naturliga blickfång och i spegeln.',
    sources: [trf('3 kap. 33 §')],
    related: ['omk-002'],
  },
  {
    id: 'omk-002',
    category: 'omkorning',
    subcategory: 'omkorningsregler',
    difficulty: 2,
    ruleTested: 'Omkörning till höger',
    prompt: 'I vilket fall får du köra om till höger?',
    answers: [
      ok('När fordonet framför har svängt eller tydligt förbereder en vänstersväng.'),
      no('När föraren framför kör långsammare än hastighetsgränsen.', 'omkorning-hoger'),
      no('När det finns en vägren att använda.', 'omkorning-hoger'),
      no('Aldrig — höger omkörning är alltid förbjuden.', 'omkorning-hoger'),
    ],
    short: 'Höger omkörning är tillåten bland annat när fordonet framför ska svänga vänster.',
    deep:
      'Andra fall är körfältsindelad trafik där fordonen i olika körfält rör sig i olika takt, samt spårvagn som ligger till vänster. Att köra om till höger på en vanlig landsväg för att någon kör långsamt är däremot inte tillåtet.',
    sources: [trf('3 kap. 34 §')],
    related: ['omk-001'],
  },
  {
    id: 'omk-003',
    category: 'omkorning',
    subcategory: 'omkorningsforbud',
    difficulty: 2,
    ruleTested: 'Omkörning vid övergångsställe',
    prompt: 'Vad gäller för omkörning strax före ett obevakat övergångsställe?',
    answers: [
      ok('Omkörning är förbjuden.'),
      no('Tillåten om du håller låg hastighet.'),
      no('Tillåten om ingen gående syns.'),
      no('Tillåten om det finns två körfält i din riktning.'),
    ],
    short: 'Du får inte köra om strax före eller på ett obevakat övergångsställe.',
    deep:
      'Fordonet du kör om skymmer sikten mot övergångsstället — för dig, och dig för den gående. Ett fordon som saktar in före ett övergångsställe gör det ofta för att någon ska gå över. Att passera det i det läget är en av de mest typiska allvarliga olyckorna med gående.',
    memory: 'Bromsar bilen framför vid ett övergångsställe — bromsa också.',
    sources: [trf('3 kap. 40 §')],
  },
  {
    id: 'omk-004',
    category: 'omkorning',
    subcategory: 'omkorningsforbud',
    difficulty: 2,
    ruleTested: 'Omkörning före korsning',
    prompt: 'Får du köra om precis före en vägkorsning?',
    answers: [
      ok('Nej, omkörning strax före och i en korsning är i regel förbjuden.'),
      no('Ja, om du har fri sikt genom korsningen.'),
      no('Ja, om du kör om till höger.', 'omkorning-hoger'),
      no('Ja, om korsningen har huvudled.'),
    ],
    short: 'Korsningar är förbjudna omkörningszoner — där kan fordon komma från sidan.',
    deep:
      'Undantag finns, bland annat i cirkulationsplats och när körbanan har minst två markerade körfält i din riktning, eller när du kör på en huvudled i korsningen. Grundinställningen bör ändå vara att aldrig påbörja en omkörning som avslutas i en korsning.',
    sources: [trf('3 kap. 40 §')],
  },
  {
    id: 'omk-005',
    category: 'omkorning',
    subcategory: 'omkorningsregler',
    difficulty: 3,
    ruleTested: 'Omkörningens tid och sträcka',
    prompt:
      'Du ska köra om en lastbil som håller 70 km/h. Du kan köra 90 km/h. Vad innebär den lilla hastighetsskillnaden?',
    answers: [
      ok('Omkörningen tar lång tid och kräver en mycket lång fri sträcka.'),
      no('Att omkörningen blir säkrare eftersom farten är låg.'),
      no('Att du kan ligga kvar nära lastbilen under omkörningen.'),
      no('Att du inte behöver kontrollera mötande trafik.'),
    ],
    short: 'Liten hastighetsskillnad ger lång omkörning — och lång tid i mötande körfält.',
    deep:
      'Med 20 km/h skillnad tar du in ungefär 5,6 meter per sekund. Ska du passera ett 20 meter långt ekipage plus säkerhetsavstånd före och efter, handlar det om åtskilliga sekunder i fel körfält. Under den tiden kommer en mötande bil i 90 km/h dig till mötes med 25 meter per sekund. Är du osäker: vänta.',
    memory: 'Kort fartskillnad, lång omkörning.',
    type: 'calculation',
    sources: [general('Körstrategi: omkörningens tidsåtgång')],
  },
  {
    id: 'omk-006',
    category: 'omkorning',
    subcategory: 'mote',
    difficulty: 2,
    ruleTested: 'Möte på smal väg',
    prompt: 'Du möter en bred lastbil på en smal väg. Vad är rätt?',
    answers: [
      ok('Sänk farten och håll åt höger, var beredd att stanna om utrymmet inte räcker.'),
      no('Håll farten och räkna med att lastbilen flyttar sig.'),
      no('Blinka med helljuset så att lastbilen saktar in.'),
      no('Kör ut på vägrenen i oförändrad hastighet.'),
    ],
    short: 'Vid trångt möte: sänk farten, håll höger, var beredd att stanna.',
    deep:
      'Vid höga hastigheter blir marginalerna små och det finns ingen tid att korrigera. En mjuk vägren kan dessutom dra ner bilen i diket. Att sakta in kostar några sekunder; att inte göra det kan kosta betydligt mer.',
    sources: [trf('3 kap. 30 §')],
  },
  {
    id: 'omk-007',
    category: 'omkorning',
    subcategory: 'omkorningsregler',
    difficulty: 2,
    ruleTested: 'Att bli omkörd',
    prompt: 'En bil håller på att köra om dig. Vad ska du göra?',
    answers: [
      ok('Hålla jämn fart eller sakta ner något, och hålla dig åt höger.'),
      no('Öka farten så att omkörningen går fortare.'),
      no('Bromsa kraftigt för att skapa en lucka.'),
      no('Ligga kvar i mitten av körfältet för att markera din plats.'),
    ],
    short: 'Underlätta omkörningen: jämn eller lägre fart, och håll åt höger.',
    deep:
      'Att öka farten när någon kör om är både förbjudet och farligt — det förlänger omkörningen precis när den andra föraren behöver att den ska ta slut. Att bromsa kraftigt är inte heller rätt; en mjuk fartminskning ger den omkörande både tid och plats.',
    sources: [trf('3 kap. 38 §')],
  },
  {
    id: 'omk-008',
    category: 'omkorning',
    subcategory: 'omkorningsforbud',
    difficulty: 3,
    ruleTested: 'Sikt vid omkörning',
    prompt: 'Vilken sikt behöver du för att påbörja en omkörning på en landsväg?',
    answers: [
      ok('Fri sikt över hela den sträcka omkörningen kräver, plus marginal för mötande.'),
      no('Sikt fram till nästa kurva räcker.'),
      no('Sikt motsvarande ungefär fem billängder.'),
      no('Det räcker att inget möte syns just nu.'),
    ],
    short: 'Du måste se hela omkörningssträckan — inte bara fram till nästa krön eller kurva.',
    deep:
      'Ett backkrön eller en kurva döljer exakt det fordon som gör omkörningen omöjlig. Sikten fram till krönet är därför irrelevant: det är sikten bortom den som avgör. Kan du inte se att sträckan är fri hela vägen, ligg kvar och vänta på nästa raksträcka.',
    sources: [trf('3 kap. 36 §')],
    related: ['ris-002'],
  },
];

export const omkorningQuestions = buildQuestions(seeds);
