import { buildQuestions, no, ok, teori, trf, tvk, vmf } from './authoring';
import type { AuthoredQuestion } from './authoring';

/**
 * De sista tunna begreppen i väjnings-, väg- och halkkapitlen.
 *
 * Täckningsrapporten listade elva begrepp med bara en eller två frågor.
 * Frågorna här stänger dem, men inte genom att ställa samma fråga en gång
 * till med andra ord: varje post prövar en detalj som den befintliga frågan
 * inte rör vid — var huvudledsmärket sitter och varför, när utfartsregeln
 * *inte* gäller, vad en släckt pil betyder, varför breda däck är sämre i
 * vatten, och varför en rak väg är svårast att bedöma ett möte på.
 */
const seeds: AuthoredQuestion[] = [
  /* ---- Rangordning av anvisningar ---------------------------------- */
  {
    id: 'vaj-001',
    category: 'korsningar',
    subcategory: 'polisens-tecken',
    difficulty: 2,
    ruleTested: 'Rangordning: signal före vägmärke',
    prompt:
      'Du kommer till en korsning med stoppskylt. Trafiksignalen bredvid lyser grönt. Vad gäller?',
    answers: [
      ok('Du får köra utan att stanna — signalen gäller före vägmärket.'),
      no('Du måste ändå stanna vid stopplinjen.', 'rangordning-anvisningar'),
      no('Du måste stanna, men bara om någon annan närmar sig.', 'rangordning-anvisningar'),
      no('Skylten och signalen upphäver varandra, högerregeln gäller.', 'rangordning-anvisningar'),
    ],
    short:
      'Trafiksignaler står över vägmärken. Grön signal betyder kör, även under en stoppskylt.',
    deep:
      'Ordningen är polisens tecken, sedan trafiksignaler, sedan vägmärken, sedan allmänna regler. Det som står högre upp ersätter det som står lägre. Skylten är alltså inte fel — den är det som gäller när signalen inte säger något.',
    memory: 'Polis → signal → märke → regel.',
    sources: [teori('Rangordning', 8), trf('2 kap. 2 §')],
    tags: ['rangordning'],
  },
  {
    id: 'vaj-002',
    category: 'korsningar',
    subcategory: 'polisens-tecken',
    difficulty: 2,
    ruleTested: 'Rangordning när signalen är ur funktion',
    prompt:
      'Trafiksignalen i korsningen är helt släckt. Under den sitter en stoppskylt. Vad gäller?',
    answers: [
      ok('Stoppskylten gäller — du ska stanna helt.'),
      no('Högerregeln gäller, eftersom signalen inte fungerar.', 'rangordning-anvisningar'),
      no('Ingenting gäller, du kör efter eget omdöme.', 'rangordning-anvisningar'),
      no('Du har väjningsplikt men behöver inte stanna.', 'rangordning-anvisningar'),
    ],
    short:
      'En släckt signal säger ingenting. Då gäller nästa nivå i rangordningen, alltså vägmärket.',
    sources: [teori('Rangordning', 8), trf('2 kap. 2 §')],
    tags: ['rangordning'],
  },

  /* ---- Huvudled ----------------------------------------------------- */
  {
    id: 'vaj-003',
    category: 'korsningar',
    subcategory: 'huvudled',
    difficulty: 3,
    ruleTested: 'Var huvudledsmärket sitter',
    prompt: 'Var upprepas huvudledsmärket i förhållande till en korsning?',
    answers: [
      ok('Efter korsningen, så att även anslutande fordon ser det.'),
      no('Före korsningen, som en påminnelse till dig på leden.', 'huvudled-innebord'),
      no('På båda sidor om korsningen.', 'huvudled-innebord'),
      no('Bara vid huvudledens början, aldrig i korsningar.', 'huvudled-innebord'),
    ],
    short:
      'Märket sätts upp efter korsningen. Den som svänger in på leden ska också få veta att den kör in på en huvudled.',
    deep:
      'Det förklarar också varför du inte ser märket precis innan en korsning du kör rakt igenom: du fick informationen när du kom in på leden, på samma sätt som du håller reda på hastighetsgränsen utan att skylten upprepas hela vägen. Sitter märket efter en korsning har vägen normalt varit huvudled även före den.',
    sources: [teori('Huvudled', 25), vmf('2 kap. B4'), tvk()],
    tags: ['huvudled', 'vagmarken'],
  },
  {
    id: 'vaj-004',
    category: 'korsningar',
    subcategory: 'huvudled',
    difficulty: 2,
    ruleTested: 'När huvudleden upphör',
    prompt: 'Hur vet du att en huvudled har tagit slut?',
    answers: [
      ok('Ett slutmärke (B5) är uppsatt.'),
      no('Huvudleden slutar i första korsningen utan märke.', 'huvudled-slutar'),
      no('Den slutar där tättbebyggt område börjar.', 'huvudled-slutar'),
      no('Den slutar där vägen byter hastighetsgräns.', 'huvudled-slutar'),
    ],
    short:
      'Huvudleden fortsätter tills ett slutmärke säger något annat. Ett uteblivet märke i en korsning avslutar den inte.',
    sources: [teori('Huvudled', 25), vmf('2 kap. B5')],
    tags: ['huvudled', 'vagmarken'],
  },

  /* ---- Utfartsregeln ------------------------------------------------ */
  {
    id: 'vaj-005',
    category: 'korsningar',
    subcategory: 'utfartsregeln',
    difficulty: 3,
    ruleTested: 'När utfartsregeln inte gäller',
    prompt:
      'Du kör ut på en gata och korsar först en cykelbana. På platsen finns ett övergångsställe och en cykelpassage. Gäller utfartsregeln?',
    answers: [
      ok('Nej — cykelbanan är bruten där, så andra regler gäller.'),
      no('Ja, du korsar en cykelbana och har alltid väjningsplikt då.', 'utfart-brutet-overgangsstalle'),
      no('Ja, men bara mot cyklisterna, inte mot bilarna.', 'utfart-brutet-overgangsstalle'),
      no('Nej, för då har du i stället företräde.', 'utfart-brutet-overgangsstalle'),
    ],
    short:
      'Utfartsregeln gäller obrutna gång- och cykelbanor. Ett övergångsställe eller en cykelpassage bryter banan.',
    deep:
      'Det är en distinktion med praktisk följd: bryts banan är det korsningsreglerna som gäller i stället, ofta högerregeln. Vanligast är att gång- och cykelbanan tar slut före vägkorsningen och börjar om på andra sidan — och då gäller utfartsregeln alltså inte.',
    sources: [teori('Utfartsregeln — brutna banor', 35, 36), trf('3 kap. 21 §')],
    tags: ['utfartsregeln'],
  },
  {
    id: 'vaj-006',
    category: 'korsningar',
    subcategory: 'utfartsregeln',
    difficulty: 2,
    ruleTested: 'Platser som utlöser utfartsregeln',
    prompt: 'Från vilken av platserna har du INTE väjningsplikt enligt utfartsregeln?',
    answers: [
      ok('En vanlig sidogata i ett bostadsområde.'),
      no('En bensinstation.', 'utfart-vs-hoger'),
      no('Ett gångfartsområde.', 'utfart-vs-hoger'),
      no('En vägren du kört på.', 'utfart-vs-hoger'),
    ],
    short:
      'Utfartsregeln gäller när du kommer från något som inte är en väg: parkering, fastighet, gågata, gångfartsområde, vägren eller terräng.',
    deep:
      'En sidogata är en väg, och där gäller vanliga korsningsregler — oftast högerregeln. Gränsfallet är områden som ser ut som gator: har området flera sidogator och genomfart räknas det som väg, medan en infart till ett fåtal bostäder med parkering inte gör det.',
    sources: [teori('Utfartsregeln', 35, 37), trf('3 kap. 21 §')],
    tags: ['utfartsregeln'],
  },

  /* ---- Vanlig signal med pil ---------------------------------------- */
  {
    id: 'vaj-007',
    category: 'korsningar',
    subcategory: 'trafiksignal-korsning',
    difficulty: 3,
    ruleTested: 'Släckt pil vid rund grön signal',
    prompt:
      'Den runda signalen lyser grönt. Pilen till höger bredvid den är släckt. Vad gäller?',
    answers: [
      ok('Du får köra i alla riktningar, även höger — den runda gröna gäller.'),
      no('Du får köra åt alla håll utom höger.', 'signal-pil-slackt'),
      no('Du måste stanna tills pilen tänds.', 'signal-pil-slackt'),
      no('Du får bara köra rakt fram.', 'signal-pil-slackt'),
    ],
    short:
      'En släckt pil säger ingenting. Det är den runda gröna signalen som gäller, och den tillåter alla riktningar.',
    deep:
      'Pilen är ett tillägg, inte en inskränkning. När den lyser ger den dig fri väg i just den riktningen — alla vars färdväg korsar din har då rött. När den är släckt är du tillbaka på den vanliga gröna signalens villkor, där du själv får lämna företräde åt mötande och åt gående som korsar.',
    sources: [teori('Vanlig signal med pil', 41), vmf('3 kap. 3 §')],
    tags: ['trafiksignal'],
  },
  {
    id: 'vaj-008',
    category: 'korsningar',
    subcategory: 'trafiksignal-korsning',
    difficulty: 2,
    ruleTested: 'Grön pil',
    prompt: 'Vad innebär en tänd grön pil?',
    answers: [
      ok('Du får köra i pilens riktning, och alla som korsar din färdväg har rött.'),
      no('Du får köra i pilens riktning efter att ha lämnat företräde.', 'signal-pil-slackt'),
      no('Du får svänga men bara om ingen mötande kommer.', 'signal-pil-slackt'),
      no('Pilen visar rekommenderad riktning, inget mer.', 'signal-pil-slackt'),
    ],
    short:
      'Grön pil ger fri väg i pilens riktning. Var ändå uppmärksam — andra kan köra eller gå mot rött.',
    sources: [teori('Grön pil', 41), vmf('3 kap. 3 §')],
    tags: ['trafiksignal'],
  },

  /* ---- Motortrafikled ----------------------------------------------- */
  {
    id: 'vaj-009',
    category: 'motorvag',
    subcategory: 'motortrafikled',
    difficulty: 2,
    ruleTested: 'Regler på motortrafikled',
    prompt: 'Vilka regler och förbud gäller på en motortrafikled?',
    answers: [
      ok('Samma som på motorväg.'),
      no('Samma som på vanlig landsväg.', 'motorvag-vs-motortrafikled'),
      no('Motorvägens regler, men utan förbudet mot att backa.', 'motorvag-vs-motortrafikled'),
      no('Landsvägens regler, men med motorvägens hastigheter.', 'motorvag-vs-motortrafikled'),
    ],
    short:
      'Motortrafikleden har motorvägens regler och förbud. Skillnaden ligger i vägens utformning, inte i regelverket.',
    deep:
      'Utformningen är däremot en verklig skillnad: påfarterna är kortare, utrymmet i sidled mindre, och möten kan förekomma. Motortrafikleder är därför mer olycksdrabbade än motorvägar trots samma regler.',
    sources: [teori('Motortrafikled', 93), trf('3 kap. 3 §')],
    tags: ['motortrafikled'],
  },
  {
    id: 'vaj-010',
    category: 'motorvag',
    subcategory: 'motortrafikled',
    difficulty: 3,
    ruleTested: 'Mötesfri väg som inte är motortrafikled',
    prompt:
      'Du kör på en mötesfri 2+1-väg med vajerräcke. Inget vägmärke för motortrafikled finns. Vad gäller?',
    answers: [
      ok('Det är en vanlig landsväg — korsande trafik kan förekomma.'),
      no('Vajerräcket gör den till motortrafikled.', 'vajerracke-motortrafikled'),
      no('Motorvägens regler gäller så länge räcket finns.', 'vajerracke-motortrafikled'),
      no('Det är motortrafikled, men utan hastighetskravet.', 'vajerracke-motortrafikled'),
    ],
    short:
      'Motortrafikled märks alltid ut med vägmärket. Utan märket är det en landsväg, oavsett räcke.',
    deep:
      'Skillnaden betyder något i praktiken: på en mötesfri landsväg kan det finnas korsningar, utfarter och långsamtgående fordon som aldrig hade fått finnas på en motortrafikled. Räcket skyddar mot möten, inte mot korsande trafik.',
    memory: 'Inget märke, ingen motortrafikled.',
    sources: [teori('Motortrafikled', 93), vmf('2 kap. E3')],
    tags: ['motortrafikled'],
  },

  /* ---- Möte ---------------------------------------------------------- */
  {
    id: 'vaj-011',
    category: 'omkorning',
    subcategory: 'mote',
    difficulty: 3,
    ruleTested: 'Bedöma mötande fordon',
    prompt:
      'På vilken vägtyp är det svårast att bedöma ett mötande fordons avstånd och hastighet?',
    answers: [
      ok('På en helt rak väg.'),
      no('På en krokig väg.', 'mote-rak-vag'),
      no('På en väg med många backkrön.', 'mote-rak-vag'),
      no('Vägens form spelar ingen roll för bedömningen.', 'mote-rak-vag'),
    ],
    short:
      'Rakt framifrån växer fordonet bara långsamt i synfältet. På en krokig väg ser du det från sidan och bedömer farten bättre.',
    deep:
      'Det är därför en omkörning på en lång rak sträcka känns tryggare än den är: sikten är god, men just den information ögat använder för att uppskatta fart — rörelse i sidled — saknas nästan helt. Bedöm hellre på tid och avståndsmärken än på känsla.',
    sources: [teori('Möte och bedömning', 101), tvk()],
    tags: ['mote', 'omkorning'],
  },
  {
    id: 'vaj-012',
    category: 'omkorning',
    subcategory: 'mote',
    difficulty: 2,
    ruleTested: 'Skyldighet vid otillåten omkörning',
    prompt:
      'En bil kör om dig trots heldragen linje. Vad gäller för dig?',
    answers: [
      ok('Du får inte öka farten eller på annat sätt försvåra omkörningen.'),
      no('Du får hålla farten uppe — omkörningen är ju otillåten.', 'omkorning-forsvara'),
      no('Du ska bromsa kraftigt så att den kommer förbi snabbare.', 'omkorning-forsvara'),
      no('Du ska tuta och blinka för att markera felet.', 'omkorning-forsvara'),
    ],
    short:
      'Att någon annan bryter mot en regel tar inte bort dina skyldigheter. Försvåra inte omkörningen — låt den bli klar.',
    deep:
      'Den som redan ligger ute i mötande fil har ingenstans att ta vägen om du ökar farten. Din uppgift i det läget är att göra situationen kortare, inte att markera vem som hade rätt.',
    sources: [teori('Omkörning över heldragen linje', 101), trf('3 kap. 43 §')],
    tags: ['mote', 'omkorning'],
  },

  /* ---- Vattenplaning -------------------------------------------------- */
  {
    id: 'vaj-013',
    category: 'halka',
    subcategory: 'vattenplaning',
    difficulty: 3,
    ruleTested: 'Däckbredd och vattenplaning',
    prompt: 'Hur påverkar breda däck risken för vattenplaning?',
    answers: [
      ok('Risken ökar — mer vatten måste pressas undan på samma tid.'),
      no('Risken minskar, eftersom kontaktytan blir större.', 'vattenplaning-breda-dack'),
      no('Bredden spelar ingen roll, bara mönsterdjupet.', 'vattenplaning-breda-dack'),
      no('Risken minskar, eftersom bilen blir stabilare.', 'vattenplaning-breda-dack'),
    ],
    short:
      'Ett brett däck har mer vatten framför sig att tränga undan. Hinner det inte, lyfter däcket från vägen.',
    deep:
      'De fyra faktorerna som driver risken är stora vattensamlingar, hög hastighet, breda däck och dåligt mönsterdjup. Bara två av dem sitter i bilen — de andra två bestämmer du i stunden.',
    sources: [teori('Vattenplaning', 219)],
    tags: ['vattenplaning', 'dack'],
  },
  {
    id: 'vaj-014',
    category: 'halka',
    subcategory: 'vattenplaning',
    difficulty: 2,
    ruleTested: 'Ratten vid vattenplaning',
    prompt: 'Varför ska hjulen peka rakt fram medan bilen vattenplanar?',
    answers: [
      ok('Annars kastar bilen till i det ögonblick greppet kommer tillbaka.'),
      no('För att däcken ska pressa undan vattnet snabbare.', 'vattenplaning-bromsa'),
      no('För att ABS-bromsen ska fungera.', 'vattenplaning-bromsa'),
      no('För att styrningen ska kännas lättare.', 'vattenplaning-bromsa'),
    ],
    short:
      'Under vattenplaningen styr du ingenting. När greppet återvänder gör bilen det du redan bett den om — så be den köra rakt.',
    deep:
      'Resten av åtgärden hänger ihop med samma tanke: släpp gasen, tryck ner kopplingen, bromsa inte. Allt som skulle ha ändrat riktning eller varvtal i samma sekund som greppet kommer tillbaka gör övergången våldsam i stället för mjuk.',
    memory: 'Rakt fram, ingen broms, invänta greppet.',
    sources: [teori('Att göra vid vattenplaning', 219)],
    tags: ['vattenplaning'],
  },
  {
    id: 'vaj-015',
    category: 'halka',
    subcategory: 'vattenplaning',
    difficulty: 2,
    ruleTested: 'Moddplaning',
    prompt: 'Vad är moddplaning?',
    answers: [
      ok('Samma sak som vattenplaning, fast i snö och slask.'),
      no('När snö packas i däckmönstret så att det blir slätt.', 'vattenplaning-breda-dack'),
      no('När bilen glider på en isfläck under snön.', 'vattenplaning-breda-dack'),
      no('När snömodd fastnar i hjulhuset och låser hjulet.', 'vattenplaning-breda-dack'),
    ],
    short:
      'Däcket hinner inte pressa undan snömodden och tappar kontakten med vägen — precis som i vatten.',
    sources: [teori('Vattenplaning och moddplaning', 219)],
    tags: ['vattenplaning', 'vinter'],
  },
];

export const vajning2Questions = buildQuestions(seeds);
