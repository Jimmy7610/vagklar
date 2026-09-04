import { buildQuestions, marking, no, ok, teori, trf, vmf } from './authoring';
import type { AuthoredQuestion } from './authoring';

/**
 * Vägmarkeringar.
 *
 * En markering skiljer sig från ett vägmärke på en avgörande punkt: den ligger
 * i vägbanan och gäller ofta bara den ena körriktningen. Frågorna är därför
 * byggda kring *vilken sida som gäller för dig* och kring vad markeringen
 * kräver — inte kring att kunna namnge linjen.
 */

const seeds: AuthoredQuestion[] = [
  {
    id: 'mrk-001',
    category: 'vagmarken',
    subcategory: 'vagmarkeringar',
    difficulty: 1,
    ruleTested: 'Mittlinje (M1)',
    prompt: 'Du kör på vägen i bilden och vill köra om. Vad säger linjen i mitten?',
    image: marking('mittlinje', 'Vägbana med korta vita streck och långa mellanrum i mitten.'),
    type: 'image-scenario',
    answers: [
      ok('Att du får korsa den när det kan ske utan fara.'),
      no('Att omkörning är förbjuden på sträckan.', 'linjetyper'),
      no('Att du måste hålla dig i höger körfält.', 'linjetyper'),
      no('Att sikten är begränsad längre fram.', 'linjetyper'),
    ],
    short:
      'Korta streck med långa mellanrum är en vanlig mittlinje. Den får korsas när det går att göra säkert.',
    memory: 'Korta streck, långa mellanrum: vanlig mittlinje.',
    sources: [vmf('3 kap. M1'), teori('Vägmarkeringar', 350)],
    tags: ['vagmarkering', 'omkorning'],
  },
  {
    id: 'mrk-002',
    category: 'vagmarken',
    subcategory: 'vagmarkeringar',
    difficulty: 2,
    ruleTested: 'Varningslinje (M3)',
    prompt: 'Vad vill den här linjen säga dig?',
    image: marking('varningslinje', 'Vägbana med långa vita streck och korta mellanrum i mitten.'),
    type: 'image-scenario',
    answers: [
      ok('Att sikten eller utrymmet är begränsat — du får korsa, men behöver mer marginal.'),
      no('Att omkörning är förbjuden här.', 'varningslinje-forbud'),
      no('Att vägen snart blir enkelriktad.', 'varningslinje-forbud'),
      no('Att körfältet tar slut längre fram.', 'varningslinje-forbud'),
    ],
    short:
      'Långa streck med korta mellanrum är en varningslinje. Den förbjuder ingenting, men den finns där sikten inte räcker till för slentrianmässiga omkörningar.',
    deep:
      'Varningslinjen övergår ofta i en heldragen linje längre fram. Ser du den ska du räkna med att fönstret för en omkörning håller på att stängas.',
    sources: [vmf('3 kap. M3'), teori('Vägmarkeringar', 350)],
    tags: ['vagmarkering', 'omkorning'],
    related: ['mrk-001'],
  },
  {
    id: 'mrk-003',
    category: 'vagmarken',
    subcategory: 'vagmarkeringar',
    difficulty: 2,
    ruleTested: 'Mittlinje kontra varningslinje',
    prompt: 'Hur skiljer du en mittlinje från en varningslinje?',
    answers: [
      ok('På förhållandet mellan streck och mellanrum — varningslinjen har långa streck och korta mellanrum.'),
      no('På linjens färg.', 'linjetyper'),
      no('På linjens bredd.', 'linjetyper'),
      no('På om den ligger till höger eller vänster om dig.', 'linjetyper'),
    ],
    short:
      'Mittlinje: korta streck, långa mellanrum. Varningslinje: långa streck, korta mellanrum. Båda får korsas.',
    sources: [vmf('3 kap. M1, M3'), teori('Vägmarkeringar', 350)],
    tags: ['vagmarkering'],
    related: ['mrk-002'],
  },
  {
    id: 'mrk-004',
    category: 'vagmarken',
    subcategory: 'vagmarkeringar',
    difficulty: 3,
    ruleTested: 'Kombinerad linje (M10)',
    prompt:
      'Linjen till höger på bilden är den som ligger närmast dig. Får du köra om?',
    image: marking(
      'kombinerad-linje',
      'Vägbana med två linjer i mitten: en streckad till vänster och en obruten till höger.',
    ),
    type: 'image-scenario',
    answers: [
      ok('Nej — linjen på din sida är heldragen, så du får inte korsa den.'),
      no('Ja, eftersom en av linjerna är streckad.', 'kombinerad-linje-sida'),
      no('Ja, om du hinner tillbaka innan linjen tar slut.', 'kombinerad-linje-sida'),
      no('Nej, en kombinerad linje förbjuder omkörning åt båda håll.', 'kombinerad-linje-sida'),
    ],
    short:
      'Det är linjen närmast dig som gäller för dig. Den mötande föraren har en streckad linje på sin sida och får därför korsa åt sitt håll.',
    deep:
      'Asymmetrin förvånar många. Den finns för att sikten kan vara god åt ena hållet och dålig åt det andra — till exempel före ett backkrön eller i en kurva.',
    memory: 'Din sida avgör. Titta ner, inte över.',
    sources: [vmf('3 kap. M10'), trf('3 kap. 11 §'), teori('Vägmarkeringar', 350)],
    tags: ['vagmarkering', 'omkorning'],
  },
  {
    id: 'mrk-005',
    category: 'vagmarken',
    subcategory: 'vagmarkeringar',
    difficulty: 1,
    ruleTested: 'Kantlinje (M2)',
    prompt: 'Vad markerar linjen längs vägens ytterkant?',
    image: marking(
      'kantlinje',
      'Vägbana med obrutna vita linjer längs båda ytterkanterna och en streckad mittlinje.',
    ),
    type: 'image-scenario',
    answers: [
      ok('Var körbanan slutar.'),
      no('Att parkering är tillåten utanför linjen.', 'kantlinje'),
      no('Att omkörning är förbjuden.', 'kantlinje'),
      no('Att vägrenen får användas som körfält.', 'kantlinje'),
    ],
    short:
      'Kantlinjen markerar körbanans ytterkant åt dig. I mörker, dimma och snöyra är den ofta den enda referens du har för var vägen faktiskt tar slut.',
    deep:
      'Att lägga blicken längs högerkantens linje är dessutom det som rekommenderas när du blir bländad av mötande — då styr du efter linjen i stället för efter det du inte ser.',
    sources: [vmf('3 kap. M2'), teori('Vägmarkeringar', 350)],
    tags: ['vagmarkering', 'landsvag'],
  },
  {
    id: 'mrk-006',
    category: 'vagmarken',
    subcategory: 'vagmarkeringar',
    difficulty: 2,
    ruleTested: 'Spärrområde (M9)',
    prompt: 'Vad gäller för den snedstreckade ytan mellan körfälten?',
    image: marking('sparromrade', 'Vägbana med en yta av snedställda vita streck mellan körfälten.'),
    type: 'image-scenario',
    answers: [
      ok('Ytan ska inte köras på — den skiljer trafikströmmar åt.'),
      no('Ytan får användas för att köra om.', 'sparromrade'),
      no('Ytan är avsedd för fordon som ska svänga vänster.', 'sparromrade'),
      no('Ytan är en parkeringsficka.', 'sparromrade'),
    ],
    short:
      'Spärrområdet finns där körfält delas eller går samman. Det ger utrymme åt trafikströmmarna och ska hållas fritt.',
    sources: [vmf('3 kap. M9'), teori('Vägmarkeringar', 350)],
    tags: ['vagmarkering', 'korfalt'],
  },
  {
    id: 'mrk-007',
    category: 'vagmarken',
    subcategory: 'vagmarkeringar',
    difficulty: 1,
    ruleTested: 'Stopplinje (M13)',
    prompt: 'Vad ska du göra vid den breda tvärgående linjen på bilden?',
    image: marking('stopplinje', 'Vägbana med en bred obruten vit linje tvärs över körfältet.'),
    type: 'image-scenario',
    answers: [
      ok('Stanna helt före linjen.'),
      no('Sänka farten och köra vidare om vägen är fri.', 'stopplinje-vs-vajningslinje'),
      no('Vänta tills en gående har passerat.', 'stopplinje-vs-vajningslinje'),
      no('Byta körfält före linjen.', 'stopplinje-vs-vajningslinje'),
    ],
    short:
      'Stopplinjen visar var fordonet ska stå stilla. Saknas linjen stannar du där du har sikt över korsande trafik.',
    sources: [vmf('3 kap. M13'), teori('Vägmarkeringar', 351)],
    tags: ['vagmarkering', 'stopplikt'],
  },
  {
    id: 'mrk-008',
    category: 'vagmarken',
    subcategory: 'vagmarkeringar',
    difficulty: 2,
    ruleTested: 'Väjningslinje (M14)',
    prompt: 'Måste du stanna vid den här markeringen?',
    image: marking('vajningslinje', 'Vägbana med en rad vita trianglar tvärs över körfältet.'),
    type: 'image-scenario',
    answers: [
      ok('Nej — den anger väjningsplikt, så du får rulla vidare om vägen är fri.'),
      no('Ja, den betyder samma sak som en stopplinje.', 'stopplinje-vs-vajningslinje'),
      no('Ja, men bara om det finns korsande trafik.', 'stopplinje-vs-vajningslinje'),
      no('Nej, den markerar bara en cykelpassage.', 'stopplinje-vs-vajningslinje'),
    ],
    short:
      'Väjningslinjen, hajtänderna, markerar var väjningsplikten gäller. Skillnaden mot stopplinjen är just att du inte måste stanna.',
    deep:
      'Den kombineras med märket B1 väjningsplikt, eller med en cykelöverfart där märket B8 finns. Trianglarnas spetsar pekar mot dig som ska väja.',
    sources: [vmf('3 kap. M14'), trf('3 kap. 5 §'), teori('Vägmarkeringar', 351)],
    tags: ['vagmarkering', 'vajningsplikt'],
    related: ['mrk-007'],
  },
  {
    id: 'mrk-009',
    category: 'trafikregler',
    subcategory: 'cykelpassage-overfart',
    difficulty: 3,
    ruleTested: 'Rutmarkering utan vägmärke',
    prompt:
      'Du ser två rader vita rutor tvärs över vägen, men inget vägmärke och ingen väjningslinje. Vad gäller?',
    image: marking('cykelpassage-m16', 'Vägbana med två rader vita rutor tvärs över körbanan.'),
    type: 'image-scenario',
    answers: [
      ok('Det är en cykelpassage — du ska anpassa hastigheten så att ingen fara uppstår.'),
      no('Det är en cykelöverfart — du har väjningsplikt mot cyklande.', 'passage-vs-overfart'),
      no('Det är ett övergångsställe för gående.', 'passage-vs-overfart'),
      no('Rutorna saknar rättslig betydelse utan vägmärke.', 'passage-vs-overfart'),
    ],
    short:
      'Rutorna ensamma betyder cykelpassage. Först när vägmärket B8 och en väjningslinje också finns är det en cykelöverfart med full väjningsplikt.',
    sources: [vmf('3 kap. M16'), trf('3 kap. 61 a §'), teori('Cykelpassage', 50)],
    tags: ['vagmarkering', 'cykel'],
  },
  {
    id: 'mrk-010',
    category: 'vagmarken',
    subcategory: 'vagmarkeringar',
    difficulty: 2,
    ruleTested: 'Övergångsställe kontra cykelpassage',
    prompt: 'Hur skiljer du markeringen för övergångsställe från den för cykelpassage?',
    answers: [
      ok('Övergångsstället är breda band längs körriktningen; cykelpassagen är två rader rutor.'),
      no('Övergångsstället är gult och cykelpassagen vit.', 'overgang-vs-cykelruta'),
      no('Cykelpassagen är bredare än övergångsstället.', 'overgang-vs-cykelruta'),
      no('De ser likadana ut och skiljs bara av vägmärket.', 'overgang-vs-cykelruta'),
    ],
    short:
      'Band betyder gående, rutor betyder cyklande. De kombineras ofta på samma plats, och då gäller olika regler för de två ytorna.',
    sources: [vmf('3 kap. M15, M16'), teori('Vägmarkeringar', 351)],
    tags: ['vagmarkering', 'oskyddade'],
    related: ['mrk-009'],
  },
  {
    id: 'mrk-011',
    category: 'trafikregler',
    subcategory: 'korfalt-och-sving',
    difficulty: 2,
    ruleTested: 'Körfältspilar (M19)',
    prompt:
      'Du ligger i det högra körfältet där pilen visar rakt fram och höger. Måste du blinka när du svänger höger?',
    image: marking(
      'korfaltspilar',
      'Vägbana med två körfält. Vänster körfält har en pil rakt fram, höger körfält en pil rakt fram och en åt höger.',
    ),
    type: 'image-scenario',
    answers: [
      ok('Ja — mötande och korsande trafikanter ser inte pilarna i vägbanan.'),
      no('Nej, pilen visar redan din avsikt.', 'blinka-trots-pilar'),
      no('Nej, blinkers behövs bara vid körfältsbyte.', 'blinka-trots-pilar'),
      no('Ja, men bara om det finns fordon bakom dig.', 'blinka-trots-pilar'),
    ],
    short:
      'Markeringen talar om vad körfältet är avsett för. Blinkersen talar om vad just du tänker göra härnäst.',
    sources: [vmf('3 kap. M19'), trf('3 kap. 64 §'), teori('Vägmarkeringar', 351)],
    tags: ['vagmarkering', 'korfalt', 'tecken'],
  },
  {
    id: 'mrk-012',
    category: 'trafikregler',
    subcategory: 'korfaltsbyte',
    difficulty: 2,
    ruleTested: 'Bussymbol i körfältet (M28)',
    prompt: 'Vad betyder en bussymbol målad i körfältet?',
    image: marking('markering-buss', 'Vägbana med en vit bussymbol målad i körfältet.'),
    type: 'image-scenario',
    answers: [
      ok('Körfältet är reserverat för fordon i linjetrafik — du får korsa det men inte köra i det.'),
      no('Bussar har företräde men körfältet får användas av alla.', 'kollektivkorfalt'),
      no('Körfältet får användas när trafiken i övriga fält står still.', 'kollektivkorfalt'),
      no('Körfältet leder till en busshållplats och är avstängt.', 'kollektivkorfalt'),
    ],
    short:
      'Markeringen motsvarar vägmärket D10. Du får korsa körfältet, till exempel för att svänga, men inte färdas i det.',
    sources: [vmf('3 kap. M28'), teori('Kollektivkörfält (bussfil)', 18)],
    tags: ['vagmarkering', 'korfalt'],
  },
  {
    id: 'mrk-013',
    category: 'vagmarken',
    subcategory: 'vagmarkeringar',
    difficulty: 3,
    ruleTested: 'Markering kontra vägmärke',
    prompt:
      'En vägmarkering och ett vägmärke säger olika saker om samma sak. Vilket gäller?',
    answers: [
      ok('Vägmärket, eftersom det står högre i rangordningen än markeringen.'),
      no('Vägmarkeringen, eftersom den ligger närmare där du kör.', 'markering-vs-marke'),
      no('Den av dem som satts upp senast.', 'markering-vs-marke'),
      no('Du väljer själv vilken du följer.', 'markering-vs-marke'),
    ],
    short:
      'Rangordningen är polis, trafiksignal, vägmärke och sist generella regler. En vägmarkering står under vägmärket.',
    deep:
      'I praktiken är konflikten ovanlig och beror ofta på att en markering blivit kvar efter en ombyggnad. Följ märket och var extra uppmärksam på att andra kanske följer markeringen.',
    sources: [trf('2 kap. 3 §'), teori('Rangordning av anvisningar', 8)],
    tags: ['vagmarkering', 'rangordning'],
  },
  {
    id: 'mrk-014',
    category: 'vagmarken',
    subcategory: 'vagmarkeringar',
    difficulty: 2,
    ruleTested: 'Ledlinje (M4)',
    prompt: 'Vad gör en ledlinje — korta streck tätt efter varandra — i en korsning?',
    image: marking('ledlinje', 'Vägbana med korta vita streck tätt efter varandra genom en korsning.'),
    type: 'image-scenario',
    answers: [
      ok('Den visar var körfältet fortsätter genom korsningen.'),
      no('Den markerar att du måste väja.', 'ledlinje'),
      no('Den anger att körfältet tar slut.', 'ledlinje'),
      no('Den förbjuder körfältsbyte i korsningen.', 'ledlinje'),
    ],
    short:
      'Ledlinjen leder trafiken genom en korsning eller förbi en öppning, där körbanan annars vore otydlig.',
    sources: [vmf('3 kap. M4'), teori('Vägmarkeringar', 350)],
    tags: ['vagmarkering', 'korsning'],
  },
  {
    id: 'mrk-015',
    category: 'vagmarken',
    subcategory: 'vagmarkeringar',
    difficulty: 2,
    ruleTested: 'Tillfälliga markeringar vid vägarbete',
    prompt:
      'Vid vägarbetet på bilden är gula linjer målade i körbanan tillsammans med de vita. Vilka följer du?',
    sourceImageId: 'gula-tillfalliga-markeringar',
    type: 'image-scenario',
    answers: [
      ok('De gula — de gäller så länge de finns kvar, och de vita gäller inte under tiden.'),
      no('De vita, eftersom de är de permanenta markeringarna.', 'tillfalliga-anvisningar'),
      no('Båda samtidigt, och du väljer den som passar bäst.', 'tillfalliga-anvisningar'),
      no('De gula bara om det står personal på platsen.', 'tillfalliga-anvisningar'),
    ],
    short:
      'Gult går före vitt. Tillfälliga markeringar gäller före de ordinarie, och de vita under dem gäller inte medan arbetet pågår.',
    deep:
      'Det känns fel att köra över en heldragen vit linje, och det är just den känslan omledningen kräver att du går emot. Ordningen är densamma som för märken: det tillfälliga slår det permanenta, eftersom det tillfälliga är det som känner till hålet i vägen.',
    memory: 'Gult ovanpå vitt: glöm det vita.',
    sources: [vmf('3 kap.'), trf('2 kap. 3 §'), teori('Vägarbeten', 82)],
    tags: ['vagmarkering', 'vagarbete', 'bild'],
    related: ['mrk-005'],
  },
  {
    id: 'mrk-016',
    category: 'trafikregler',
    subcategory: 'cykelpassage-overfart',
    difficulty: 3,
    ruleTested: 'Skilja övergångsställe från cykelpassage i verkligheten',
    prompt:
      'På bilden ligger två tvärgående markeringar bredvid varandra. Vad krävs av dig vid den som består av rutor?',
    sourceImageId: 'overgangsstalle-och-cykelpassage',
    type: 'image-scenario',
    answers: [
      ok('Du ska anpassa hastigheten så att du inte utgör en fara för cyklande som är ute på passagen.'),
      no('Du har väjningsplikt mot alla cyklande som närmar sig.', 'cykelpassage-vajning'),
      no('Cyklande har väjningsplikt mot dig, så du kan hålla farten.', 'cykelpassage-vajning'),
      no('Samma regel gäller som vid banden intill — de är två delar av samma markering.', 'cykelpassage-vajning'),
    ],
    short:
      'Rutorna ensamma är en cykelpassage: anpassa hastigheten. Full väjningsplikt kräver dessutom vägmärket och en väjningslinje — det är en cykelöverfart, och den ser annorlunda ut.',
    deep:
      'Att de två markeringarna ligger några meter isär i samma korsning är hela svårigheten. Vid banden har den gående företräde när hen gått ut. Vid rutorna finns ingen sådan regel — men det finns människor på cykel som rör sig fortare än en gående och kommer in i bilden senare. Skillnaden i regel är alltså inte en skillnad i hur mycket du behöver titta.',
    memory: 'Band: gående har företräde. Rutor: sänk farten, men ingen väjningsplikt.',
    sources: [trf('3 kap. 61 §'), vmf('3 kap. M16'), teori('Cykelpassage', 51)],
    tags: ['vagmarkering', 'cykel', 'bild'],
    related: ['mrk-010'],
  },
  {
    id: 'mrk-017',
    category: 'vagmarken',
    subcategory: 'vagmarkeringar',
    difficulty: 2,
    ruleTested: 'Hastighet (M29)',
    prompt: 'Siffran 30 är målad i körbanan framför dig. Vad betyder det för hastighetsgränsen?',
    sourceImageId: 'malad-skola-30',
    type: 'image-scenario',
    answers: [
      ok('Den upprepar den gräns som redan gäller — gränsen sätts av vägmärket eller av föreskriften.'),
      no('Den sänker gränsen till 30 från och med markeringen.', 'markering-vs-marke'),
      no('Den gäller bara i det körfält där den är målad.', 'markering-vs-marke'),
      no('Den är en rekommendation som du får överskrida om vägen är fri.', 'markering-vs-marke'),
    ],
    short:
      'En hastighetssiffra i körbanan påminner om gränsen. Den ersätter inte märket, och den skapar ingen egen gräns.',
    deep:
      'Markeringen målas där någon har bedömt att gränsen behöver upprepas — utanför en skola, före en passage, i en långsträckt kurva. Att den finns är alltså i sig en upplysning: någon har räknat med att förare glömmer bort sig just här. Ordet som är målat bredvid siffran säger varför.',
    memory: 'Målad siffra: en påminnelse, inte en ny gräns.',
    sources: [vmf('3 kap. M29'), teori('Symboler i körbanan', 352)],
    tags: ['vagmarkering', 'hastighet', 'bild'],
    related: ['mrk-013'],
  },
];

export const vagmarkeringarQuestions = buildQuestions(seeds);
