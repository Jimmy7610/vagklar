import type { Misconception } from '@/domain/content/types';

/**
 * Named misconceptions.
 *
 * This is what makes "Mina misstag" concept-aware: a wrong answer is tagged
 * with *why* it is tempting, so the app can group mistakes by faulty mental
 * model rather than by question id.
 */
export const MISCONCEPTIONS: Misconception[] = [
  {
    id: 'utfart-vs-hoger',
    label: 'Utfartsregeln vs högerregeln',
    description:
      'Högerregeln antas gälla även när du kommer ut från en parkering, en fastighet eller en bensinstation.',
    correction:
      'Kör du ut från ett område som inte är en väg har du väjningsplikt mot alla — högerregeln gäller inte där.',
    subcategory: 'utfartsregeln',
  },
  {
    id: 'hoger-utan-skylt',
    label: 'Högerregeln glöms i oskyltad korsning',
    description: 'Man letar efter en skylt och kör vidare när ingen finns.',
    correction: 'Saknas skyltar och signaler gäller högerregeln — lämna företräde åt höger.',
    subcategory: 'hogerregeln',
  },
  {
    id: 'huvudled-slutar',
    label: 'Huvudled antas fortsätta genom korsningen',
    description: 'Huvudleden antas gälla tills ett slutmärke syns, även när den svänger.',
    correction:
      'Huvudleden kan svänga. Följ vägmärkena i varje korsning — ett tilläggsmärke visar huvudledens sträckning.',
    subcategory: 'huvudled',
  },
  {
    id: 'stopp-utan-stopp',
    label: 'Stopplikt tolkas som väjningsplikt',
    description: 'Man rullar sakta förbi stopplinjen när sikten är fri.',
    correction: 'Vid stopplikt måste fordonet stå helt stilla, oavsett hur fri sikten är.',
    subcategory: 'stopplikt',
  },
  {
    id: 'cirkulation-hoger',
    label: 'Högerregeln antas gälla i cirkulationsplats',
    description: 'Man tror att fordon inne i rondellen ska väja för fordon som kör in.',
    correction:
      'Vid infart till en cirkulationsplats finns nästan alltid väjningsplikt — de som redan är i rondellen kör först.',
    subcategory: 'cirkulationsplats',
  },
  {
    id: 'blinkers-som-lofte',
    label: 'Blinkers tolkas som en garanti',
    description: 'Man kör ut för att en annan förare blinkar.',
    correction:
      'En blinkers är en avsikt, inte ett löfte. Vänta tills fordonet faktiskt börjar svänga.',
    subcategory: 'vajningsplikt',
  },
  {
    id: 'reaktion-vs-broms',
    label: 'Reaktionssträcka vs bromssträcka',
    description: 'De två sträckorna blandas ihop eller antas växa på samma sätt.',
    correction:
      'Reaktionssträckan växer linjärt med hastigheten. Bromssträckan växer med kvadraten — dubbel fart ger fyrdubbel bromssträcka.',
    subcategory: 'reaktion-och-sinnen',
  },
  {
    id: 'bashastighet-tatort',
    label: 'Bashastighet blandas ihop med skyltad hastighet',
    description: 'Man antar 30 eller 70 där inget märke finns.',
    correction:
      'Utan vägmärke gäller bashastigheten: 50 km/h inom tätbebyggt område, 70 km/h utanför.',
    subcategory: 'hastighetsgranser',
  },
  {
    id: 'skyltad-som-mal',
    label: 'Skyltad hastighet ses som ett krav',
    description: 'Man kör den skyltade hastigheten även när väglaget är dåligt.',
    correction:
      'Skyltad hastighet är ett tak, aldrig ett mål. Hastigheten ska anpassas till sikt, väglag och trafik.',
    subcategory: 'anpassad-hastighet',
  },
  {
    id: 'stanna-vs-parkera',
    label: 'Stannande vs parkering',
    description: 'Förbud att parkera antas också innebära förbud att stanna.',
    correction:
      'Att stanna är ett kort uppehåll för av- och påstigning eller lastning. Parkeringsförbud hindrar inte det, men stannandeförbud gör det.',
    subcategory: 'parkeringsforbud',
  },
  {
    id: 'huvudled-parkering',
    label: 'Parkering på huvudled',
    description: 'Man tror att det räcker att stå utanför körbanan.',
    correction: 'På en huvudled är det förbjudet att parkera. Att stanna kort är däremot tillåtet.',
    subcategory: 'parkeringsforbud',
  },
  {
    id: 'overgangsstalle-avstand',
    label: 'Avstånd till övergångsställe och korsning',
    description: 'Tio-metersregeln glöms bort eller antas gälla bara efter.',
    correction:
      'Du får inte stanna eller parkera inom tio meter före ett övergångsställe eller en korsande körbana.',
    subcategory: 'stannande-forbud',
  },
  {
    id: 'omkorning-hoger',
    label: 'Omkörning till höger',
    description: 'Höger omkörning antas alltid vara förbjuden — eller alltid tillåten.',
    correction:
      'Omkörning sker normalt till vänster. Höger är tillåtet i vissa fall, till exempel när det framförvarande fordonet svänger vänster.',
    subcategory: 'omkorningsregler',
  },
  {
    id: 'helljus-mote',
    label: 'Helljus vid möte',
    description: 'Helljuset behålls för länge, eller släcks alldeles för tidigt.',
    correction:
      'Blända av i god tid före möte, men inte så tidigt att du förlorar sikten i onödan. Bländas du — sänk farten och titta mot vägkanten till höger.',
    subcategory: 'mote-i-morker',
  },
  {
    id: 'morker-hastighet',
    label: 'Kör fortare än ljuset räcker',
    description: 'Hastigheten anpassas inte efter halvljusets räckvidd.',
    correction:
      'Du måste kunna stanna inom den sträcka du ser. På halvljus är den sträckan kort.',
    subcategory: 'morkerkorning',
  },
  {
    id: 'motorvag-nodfil',
    label: 'Vägrenen ses som ett körfält',
    description: 'Man tror att man får köra eller stanna på vägrenen för att vila.',
    correction:
      'Vägrenen på motorväg är till för nödsituationer. Stanna där bara om du måste.',
    subcategory: 'motorvag-regler',
  },
  {
    id: 'pafart-vantar',
    label: 'Stannar på påfartsrampen',
    description: 'Man saktar in eller stannar i slutet av accelerationsfältet.',
    correction:
      'Anpassa farten till trafiken på motorvägen och flyt in. Att stanna på påfarten skapar en farlig situation.',
    subcategory: 'pafart-avfart',
  },
  {
    id: 'promille-tid',
    label: 'Alkohol antas försvinna snabbare',
    description: 'Kaffe, mat, dusch eller sömn antas snabba på nedbrytningen.',
    correction:
      'Kroppen bryter ner alkohol i ungefär samma takt oavsett vad du gör. Bara tid hjälper.',
    subcategory: 'alkohol-effekter',
  },
  {
    id: 'trotthet-motmedel',
    label: 'Trötthet antas gå att köra bort',
    description: 'Musik, öppet fönster eller kaffe antas lösa trötthet.',
    correction:
      'Det enda som fungerar är att sova. En kort paus med vila är den enda pålitliga åtgärden.',
    subcategory: 'trotthet',
  },
  {
    id: 'vattenplaning-bromsa',
    label: 'Fel åtgärd vid vattenplaning',
    description: 'Man bromsar eller styr kraftigt när bilen tappar väggreppet.',
    correction:
      'Släpp gasen, håll ratten stilla och undvik att bromsa tills däcken får kontakt igen.',
    subcategory: 'vattenplaning',
  },
  {
    id: 'vinterdack-datum',
    label: 'Vinterdäcksperioden blandas ihop',
    description: 'Datum och väglagsvillkor blandas ihop.',
    correction:
      'Kravet gäller vid vinterväglag under perioden 1 december – 31 mars. Det är väglaget som avgör, inte bara datumet.',
    subcategory: 'vinterkorning',
  },
  {
    id: 'motorbroms-forbrukning',
    label: 'Sparsam körning missförstås',
    description: 'Man tror att lågt varvtal alltid är sparsamt, eller att frihjulning sparar mest.',
    correction:
      'Motorbromsning med ilagd växel förbrukar i princip inget bränsle på moderna bilar. Jämn fart och tidig växling sparar mest.',
    subcategory: 'sparsam-korning',
  },
  {
    id: 'monsterdjup',
    label: 'Mönsterdjup blandas ihop',
    description: 'Kraven för sommar- och vinterdäck blandas ihop.',
    correction:
      'Sommardäck kräver minst 1,6 mm. Vinterdäck kräver minst 3 mm vid vinterväglag.',
    subcategory: 'dack-och-bromsar',
  },
  {
    id: 'slap-totalvikt',
    label: 'B-behörighet och släpvagnsvikt',
    description: 'Man räknar bara på släpets vikt, inte på ekipaget.',
    correction:
      'Med vanlig B-behörighet får bilens och släpets sammanlagda totalvikt vara högst 3 500 kg.',
    subcategory: 'slapvagn',
  },
  {
    id: 'cykeloverfart-passage',
    label: 'Cykelöverfart vs cykelpassage',
    description: 'De två begreppen antas ge samma väjningsregler.',
    correction:
      'Vid en cykelöverfart har du väjningsplikt mot cyklande. Vid en cykelpassage har du det inte, men du måste ändå anpassa farten.',
    subcategory: 'oskyddade-trafikanter',
  },
  {
    id: 'signal-gult',
    label: 'Gult ljus tolkas som "skynda"',
    description: 'Gult ljus antas betyda att man ska öka farten för att hinna.',
    correction:
      'Gult betyder stanna, om du kan göra det utan fara. Bara om du är så nära att en inbromsning blir farlig får du köra vidare.',
    subcategory: 'trafiksignaler',
  },
  {
    id: 'polis-over-signal',
    label: 'Rangordning mellan tecken',
    description: 'Man följer trafiksignalen trots att en polis reglerar trafiken.',
    correction:
      'Polisens tecken gäller före både trafiksignaler och vägmärken.',
    subcategory: 'polisens-tecken',
  },
  {
    id: 'avstand-tid',
    label: 'Avstånd mäts i meter i stället för tid',
    description: 'Man håller samma avstånd oavsett hastighet.',
    correction:
      'Använd tid: minst tre sekunder till fordonet framför, mer vid halka eller dålig sikt.',
    subcategory: 'avstand',
  },
  {
    id: 'skymd-sikt-fart',
    label: 'Skymd sikt kompenseras inte',
    description: 'Farten hålls uppe fram till en punkt där sikten är skymd.',
    correction:
      'Där du inte ser måste du kunna stanna. Sänk farten innan, inte när något dyker upp.',
    subcategory: 'skymd-sikt',
  },
  {
    id: 'djur-vika',
    label: 'Väjer för litet vilt',
    description: 'Man gör en kraftig undanmanöver för mindre djur.',
    correction:
      'Väj inte så att du hamnar i mötande fil eller i diket. Bromsa rakt fram om en undanmanöver är farlig.',
    subcategory: 'djur-pa-vagen',
  },
];

export const MISCONCEPTION_BY_ID: ReadonlyMap<string, Misconception> = new Map(
  MISCONCEPTIONS.map((m) => [m.id, m]),
);

export function getMisconception(id: string): Misconception | undefined {
  return MISCONCEPTION_BY_ID.get(id);
}
