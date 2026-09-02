import { buildQuestions, no, ok, teori, tvk } from './authoring';
import type { AuthoredQuestion } from './authoring';

/**
 * Miljö, drivmedel och sparsam körning.
 *
 * The environment chapter is easy to answer with slogans, so these questions
 * are built around mechanisms instead: why engine braking uses no fuel, what
 * a catalytic converter actually needs, what a roof box costs you.
 */

const seeds: AuthoredQuestion[] = [
  /* ---- Sparsam körning -------------------------------------------------- */
  {
    id: 'drv-001',
    category: 'miljo',
    subcategory: 'sparsam-korning',
    difficulty: 2,
    ruleTested: 'Motorbromsning och bränsleförbrukning',
    prompt: 'Vad händer med bränsleförbrukningen när du motorbromsar?',
    answers: [
      ok('Den upphör i praktiken — bränsletillförseln stängs av så länge varvtalet är tillräckligt högt.'),
      no('Den ökar, eftersom motorn arbetar mot bilens rörelse.', 'motorbroms-forbrukning'),
      no('Den är oförändrad jämfört med att rulla på tomgång.', 'motorbroms-forbrukning'),
      no('Den ökar först och minskar sedan när farten sjunkit.', 'motorbroms-forbrukning'),
    ],
    short:
      'Släpper du gasen helt vid högt varvtal tillförs inget bränsle alls. Bromsverkan kommer från friktionen i motorn.',
    deep:
      'När varvtalet sjunker till omkring 1 200–1 300 varv per minut börjar motorn förbruka bränsle igen. Växla därför ner strax innan dess om du vill behålla nollförbrukningen. Att i stället lägga i friläge och rulla ger tomgångsförbrukning — alltså mer bränsle, inte mindre.',
    memory: 'Gasen släppt och växeln i = noll förbrukning.',
    sources: [tvk('Sparsam körning'), teori('Motorbromsa ofta', 313)],
    tags: ['sparsam'],
  },
  {
    id: 'drv-002',
    category: 'miljo',
    subcategory: 'sparsam-korning',
    difficulty: 2,
    ruleTested: 'Växelval vid sparsam körning',
    prompt: 'Vilket växelbeteende hör till sparsam körning?',
    answers: [
      ok('Växla upp tidigt och kör på så hög växel som bilen klarar utan att hacka.'),
      no('Ligga kvar på låg växel, eftersom motorn då arbetar lättare.', 'vaxel-sparsam'),
      no('Använda ettan så länge som möjligt efter start.', 'vaxel-sparsam'),
      no('Undvika att hoppa över växlar, eftersom det sliter på växellådan.', 'vaxel-sparsam'),
    ],
    short:
      'Hög växel och lågt varvtal drar mindre. Ettan är stark men törstig — växla upp efter några meter.',
    deep:
      'De flesta moderna bilar klarar femman i 50 km/h. Blir bilen slö eller börjar hacka har du växlat för tidigt och ska ner ett steg. Att hoppa över växlar, till exempel andra till fjärde, sparar både bränsle och kopplingsarbete.',
    sources: [tvk('Sparsam körning'), teori('Kör på så höga växlar som möjligt', 312)],
    tags: ['sparsam'],
  },
  {
    id: 'drv-003',
    category: 'miljo',
    subcategory: 'sparsam-korning',
    difficulty: 3,
    ruleTested: 'Acceleration vid sparsam körning',
    prompt: 'Hur bör du accelerera för att köra bränslesnålt?',
    answers: [
      ok('Ganska rask acceleration upp till önskad fart, men håll varvtalet under cirka 2 500 varv/min.'),
      no('Så långsamt och mjukt som möjligt, oavsett hur lång tid det tar.', 'acceleration-sparsam'),
      no('Med full gas, så att accelerationsfasen blir kortast möjlig.', 'acceleration-sparsam'),
      no('Accelerationen påverkar inte förbrukningen nämnvärt.', 'acceleration-sparsam'),
    ],
    short:
      'En bil i konstant fart drar mindre än en som accelererar. Kom därför upp i fart utan att dra ut på det — men utan att varva upp.',
    deep:
      'Det låter motsägelsefullt att rask acceleration skulle vara sparsamt, men logiken håller: accelerationsfasen är den dyra delen, så den ska vara kort. Taket på ungefär 2 500 varv finns för att förbrukningen stiger brant över det.',
    sources: [tvk('Sparsam körning'), teori('Accelerera ganska snabbt', 312)],
    tags: ['sparsam'],
    related: ['drv-002'],
  },
  {
    id: 'drv-004',
    category: 'miljo',
    subcategory: 'sparsam-korning',
    difficulty: 2,
    ruleTested: 'Sparsam körning kontra trafiksäkerhet',
    prompt:
      'Ett barn springer ut i vägen och du måste bromsa kraftigt. Vad gäller för sparsam körning i det läget?',
    answers: [
      ok('Trafiksäkerheten går alltid först — trampa på bromsen.'),
      no('Motorbromsa så långt det går innan du använder färdbromsen.', 'sparsam-fore-sakerhet'),
      no('Växla ner stegvis för att undvika onödig bränsleförbrukning.', 'sparsam-fore-sakerhet'),
      no('Bromsa mjukt så att bränsle inte slösas i onödan.', 'sparsam-fore-sakerhet'),
    ],
    short:
      'Sparsam körning gäller när det är lämpligt. Den ska aldrig tävla med en inbromsning som behövs.',
    sources: [teori('Förtydligande angående sparsam körning', 314)],
    tags: ['sparsam', 'risk'],
  },
  {
    id: 'drv-005',
    category: 'miljo',
    subcategory: 'sparsam-korning',
    difficulty: 1,
    ruleTested: 'Takbox och luftmotstånd',
    prompt: 'Varför bör du montera av takboxen när du inte använder den?',
    answers: [
      ok('Den ökar luftmotståndet och därmed bränsleförbrukningen.'),
      no('Den kan lossna och bli en trafikfara.', 'takbox'),
      no('Plasten i takboxar avger skadliga partiklar.', 'takbox'),
      no('Den räknas som last och kräver särskild märkning.', 'takbox'),
    ],
    short:
      'En takbox kan öka förbrukningen med mer än en deciliter per mil. Vindfångande ytor kostar bränsle även när de är tomma.',
    deep:
      'Samma logik gäller öppna sidorutor och taklucka i högre farter: luftflödet runt bilen störs. Även mycket breda däck ökar motståndet. Vid släp är det inte bara vikten utan också den extra frontytan som syns i förbrukningen.',
    sources: [tvk(), teori('Minska luftmotståndet', 306)],
    tags: ['sparsam'],
  },
  {
    id: 'drv-006',
    category: 'miljo',
    subcategory: 'sparsam-korning',
    difficulty: 2,
    ruleTested: 'Däcktryck och förbrukning',
    prompt: 'Hur påverkar för lågt lufttryck i däcken bilen?',
    answers: [
      ok('Bilen rullar trögare, förbrukningen ökar och däcken slits mer.'),
      no('Bilen rullar lättare eftersom däcken är mjukare.', 'dacktryck-forbrukning'),
      no('Förbrukningen påverkas inte, men väggreppet blir bättre.', 'dacktryck-forbrukning'),
      no('Endast komforten påverkas.', 'dacktryck-forbrukning'),
    ],
    short:
      'Hårt pumpade däck rullar lättare. Lågt tryck ger både högre förbrukning och snabbare slitage.',
    deep:
      'Rätt tryck står i bilens instruktionsbok och hos däcktillverkaren, ofta också på en dekal i dörrkarmen. Kontrollera trycket kallt, och höj det enligt tabellen vid tung last.',
    sources: [teori('Rätt däcktryck', 306)],
    tags: ['sparsam', 'dack'],
  },
  {
    id: 'drv-007',
    category: 'miljo',
    subcategory: 'sparsam-korning',
    difficulty: 2,
    ruleTested: 'Motorvärmare',
    prompt: 'Ungefär hur länge bör motorvärmaren vara på vid cirka 0 °C?',
    answers: [
      ok('Omkring en timme före färd.'),
      no('Omkring 15 minuter före färd.', 'motorvarmare-tid'),
      no('Minst tre timmar före färd.', 'motorvarmare-tid'),
      no('Hela natten, för säkerhets skull.', 'motorvarmare-tid'),
    ],
    short:
      'Cirka 30 minuter vid +10 °C, en timme vid 0 °C och omkring 1,5 timme vid −20 °C. Längre än så är bortkastad el.',
    deep:
      'Vinsten är konkret: katalysatorn kommer upp i arbetstemperatur snabbare, förbrukningen sjunker och motorslitaget minskar. Kallstarter är den del av körningen där utsläppen per kilometer är som allra högst.',
    sources: [teori('Motorvärmare', 305)],
    tags: ['sparsam', 'miljo'],
  },
  {
    id: 'drv-008',
    category: 'miljo',
    subcategory: 'sparsam-korning',
    difficulty: 1,
    ruleTested: 'Luftkonditionering och förbrukning',
    prompt: 'Hur mycket bränsle kan du ungefär spara genom att stänga av AC:n?',
    answers: [
      ok('5–10 procent.'),
      no('Under 1 procent.', 'ac-forbrukning'),
      no('Omkring 25 procent.', 'ac-forbrukning'),
      no('AC påverkar inte bränsleförbrukningen.', 'ac-forbrukning'),
    ],
    short:
      'Luftkonditioneringen kräver mycket energi. Avstängd AC kan sänka förbrukningen med 5–10 procent.',
    sources: [teori('AC', 306)],
    tags: ['sparsam'],
  },

  /* ---- Miljöpåverkan ---------------------------------------------------- */
  {
    id: 'drv-009',
    category: 'miljo',
    subcategory: 'miljopaverkan',
    difficulty: 2,
    ruleTested: 'Katalysatorns funktion',
    prompt: 'Vad gör katalysatorn?',
    answers: [
      ok('Omvandlar skadliga ämnen i avgaserna till främst koldioxid och vatten.'),
      no('Filtrerar bort koldioxiden ur avgaserna.', 'katalysator-funktion'),
      no('Renar bränslet innan det når motorn.', 'katalysator-funktion'),
      no('Sänker motorns bränsleförbrukning.', 'katalysator-funktion'),
    ],
    short:
      'Katalysatorn tar bort 80–95 procent av de skadliga ämnena — men den tar inte bort koldioxid, som är slutprodukten.',
    deep:
      'Den behöver 400–600 °C för att fungera optimalt, vilket är skälet till att korta kallstarter förorenar oproportionerligt mycket. Det är också därför motorvärmare ger miljövinst: katalysatorn når arbetstemperatur snabbare.',
    memory: 'Katalysatorn löser hälsoproblemet, inte klimatproblemet.',
    sources: [teori('Katalysator', 305)],
    tags: ['miljo'],
    related: ['drv-007'],
  },
  {
    id: 'drv-010',
    category: 'miljo',
    subcategory: 'miljopaverkan',
    difficulty: 2,
    ruleTested: 'Kolmonoxid',
    prompt: 'Vad gör kolmonoxid (CO) med kroppen?',
    answers: [
      ok('Försämrar blodets förmåga att ta upp syre, vilket ger trötthet och i stora mängder är livsfarligt.'),
      no('Orsakar cancer och påverkar arvsanlagen.', 'avgaser-effekter'),
      no('Bidrar till försurning av mark och övergödning av sjöar.', 'avgaser-effekter'),
      no('Skadar växtlighet nära marken men påverkar inte människor.', 'avgaser-effekter'),
    ],
    short:
      'Kolmonoxid slår mot syreupptagningen. Kolväten är de cancerframkallande, och kväveoxider står för försurning och övergödning.',
    deep:
      'Att hålla isär dem är hela poängen med frågan: kolväten (HC) orsakar cancer och bidrar till marknära ozon, kväveoxider (NOx) försurar mark och göder sjöar, och koldioxid (CO2) är växthusgasen. Katalysatorn minskar CO, HC och NOx — men inte CO2.',
    sources: [teori('Kemiska föroreningar', 307)],
    tags: ['miljo'],
    related: ['drv-009'],
  },
  {
    id: 'drv-011',
    category: 'miljo',
    subcategory: 'miljopaverkan',
    difficulty: 1,
    ruleTested: 'Koldioxid och växthuseffekten',
    prompt: 'Vilket ämne från biltrafiken bidrar mest till växthuseffekten?',
    answers: [
      ok('Koldioxid (CO2).'),
      no('Kolmonoxid (CO).', 'vaxthusgas'),
      no('Kväveoxider (NOx).', 'vaxthusgas'),
      no('Marknära ozon.', 'vaxthusgas'),
    ],
    short:
      'Koldioxid är den dominerande växthusgasen från trafiken, och den bildas vid all förbränning av fossila bränslen.',
    sources: [teori('Kemiska föroreningar', 307)],
    tags: ['miljo'],
  },
  {
    id: 'drv-012',
    category: 'miljo',
    subcategory: 'miljopaverkan',
    difficulty: 2,
    ruleTested: 'Biltvätt',
    prompt: 'Varför bör du tvätta bilen på en biltvätt i stället för på gatan?',
    answers: [
      ok('Biltvättar har golvbrunnar som samlar upp de skadliga restprodukterna.'),
      no('Det är förbjudet att tvätta bilen någon annanstans.', 'biltvatt'),
      no('Vattenförbrukningen blir lägre på en biltvätt.', 'biltvatt'),
      no('Lacken tar skada av att tvättas utomhus.', 'biltvatt'),
    ],
    short:
      'Tvättvattnet innehåller olja, tungmetaller och kemikalier. På gatan går det rakt ut i dagvattnet.',
    deep:
      'Att vaxa bilen ger dessutom en skyddande hinna som gör att mindre smuts fastnar, vilket i sin tur ger färre tvättar.',
    sources: [teori('Tvätta bilen rätt', 307)],
    tags: ['miljo'],
  },

  /* ---- Drivmedel och utsläppsklasser ------------------------------------ */
  {
    id: 'drv-013',
    category: 'miljo',
    subcategory: 'drivmedel',
    difficulty: 2,
    ruleTested: 'Bensin jämfört med diesel',
    prompt: 'Vad är sant om diesel jämfört med bensin?',
    answers: [
      ok('Dieselmotorn förbrukar mindre bränsle, men avgaserna är mer hälsofarliga.'),
      no('Dieselmotorn förbrukar mer bränsle men ger renare avgaser.', 'diesel-vs-bensin'),
      no('Diesel är ett förnybart bränsle, till skillnad från bensin.', 'diesel-vs-bensin'),
      no('Diesel och bensin ger identisk miljöpåverkan.', 'diesel-vs-bensin'),
    ],
    short:
      'Lägre förbrukning, farligare avgaser. Båda är fossila bränslen som bidrar till växthuseffekten.',
    deep:
      'All bensin och diesel som säljs på svenska bensinstationer är av miljöklass 1, vilket innebär lägre halter av skadliga ämnen. E10 är standardbensinen och innehåller upp till 10 procent etanol.',
    sources: [teori('Bensin och diesel', 318)],
    tags: ['drivmedel', 'miljo'],
  },
  {
    id: 'drv-014',
    category: 'miljo',
    subcategory: 'drivmedel',
    difficulty: 1,
    ruleTested: 'Hybridbil',
    prompt: 'Vad kännetecknar en hybridbil?',
    answers: [
      ok('Den har två motorer, vanligast el tillsammans med bensin.'),
      no('Den drivs enbart av el.', 'hybrid-definition'),
      no('Den drivs av solceller på taket.', 'hybrid-definition'),
      no('Den är en bil som förbrukar under 0,3 liter per mil.', 'hybrid-definition'),
    ],
    short:
      'Två motorer. Elmotorn används på korta sträckor i stan, och bensinmotorn kopplas in när det behövs mer räckvidd eller kraft.',
    deep:
      'En laddhybrid skiljer sig genom att batteriet kan laddas med kabel, vilket gör att den rena elsträckan blir betydligt längre.',
    sources: [teori('Hybrid', 318)],
    tags: ['drivmedel'],
  },
  {
    id: 'drv-015',
    category: 'miljo',
    subcategory: 'drivmedel',
    difficulty: 3,
    ruleTested: 'Elbilens miljöpåverkan',
    prompt: 'Vad är sant om elbilens miljöpåverkan?',
    answers: [
      ok('Den ger inga hälsofarliga avgaser vid körning, men batteritillverkningen kräver gruvdrift med egna utsläpp.'),
      no('Den har ingen miljöpåverkan alls.', 'elbil-miljo'),
      no('Den ger lika stora avgasutsläpp som en bensinbil, fast på kraftverket.', 'elbil-miljo'),
      no('Den får inte köras i miljözoner klass 3.', 'elbil-miljo'),
    ],
    short:
      'Ingen avgas vid körning, men batteriet kräver stora mängder metaller från gruvor — med utsläpp och ibland dåliga arbetsförhållanden.',
    deep:
      'I Sverige kommer dessutom en stor del av elen från fossilfria källor, vilket gör driftsfasen jämförelsevis ren. I miljözon klass 3 är elfordon tvärtom bland de få som får köra.',
    sources: [teori('El', 318), teori('Miljözoner', 319)],
    tags: ['drivmedel', 'miljo'],
  },
  {
    id: 'drv-016',
    category: 'miljo',
    subcategory: 'drivmedel',
    difficulty: 3,
    ruleTested: 'Miljözoner',
    prompt: 'Vad gäller i en miljözon klass 1?',
    answers: [
      ok('Den berör endast tunga fordon. Du får köra där med personbil oavsett drivmedel.'),
      no('Endast elfordon och gasfordon får köra där.', 'miljozoner'),
      no('Bensinbilar måste uppfylla Euro 5 eller Euro 6.', 'miljozoner'),
      no('Dieselbilar är helt förbjudna.', 'miljozoner'),
    ],
    short:
      'Klass 1 gäller tunga fordon. Klass 2 ställer euro-krav på personbilar, och klass 3 släpper i princip bara in el-, bränslecells- och gasfordon.',
    deep:
      'Kommunerna får själva införa miljözoner för att förbättra luftkvaliteten. Vilken euroklass en bil tillhör står i registreringsbeviset — högre siffra betyder lägre utsläpp.',
    sources: [teori('Miljözoner', 319), teori('Utsläppsklasser', 319)],
    tags: ['drivmedel', 'miljo'],
    related: ['reg-001'],
  },
];

export const drivmedelQuestions = buildQuestions(seeds);
