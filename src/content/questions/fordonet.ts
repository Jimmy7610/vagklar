import { buildQuestions, general, no, ok, trf } from './authoring';
import type { AuthoredQuestion } from './authoring';

const seeds: AuthoredQuestion[] = [
  {
    id: 'for-001',
    category: 'fordonet',
    subcategory: 'dack-och-bromsar',
    difficulty: 2,
    ruleTested: 'Mönsterdjup',
    prompt: 'Vilket är det lägsta tillåtna mönsterdjupet för sommardäck på personbil?',
    answers: [
      ok('1,6 mm.'),
      no('3,0 mm.', 'monsterdjup'),
      no('1,0 mm.', 'monsterdjup'),
      no('5,0 mm.', 'monsterdjup'),
    ],
    short: 'Sommardäck: minst 1,6 mm. Vinterdäck vid vinterväglag: minst 3 mm.',
    deep:
      'Lagkravet är en absolut miniminivå, inte en rekommendation. Redan under 3 mm försämras förmågan att leda undan vatten märkbart, och risken för vattenplaning ökar. Kontrollera på flera ställen runt däcket — slitaget är sällan jämnt.',
    memory: 'Sommar 1,6 — vinter 3,0.',
    sources: [trf('4 kap. 18 §')],
    related: ['hal-005', 'hal-002'],
  },
  {
    id: 'for-002',
    category: 'fordonet',
    subcategory: 'dack-och-bromsar',
    difficulty: 2,
    ruleTested: 'Lufttryck i däck',
    prompt: 'Vad händer om lufttrycket i däcken är för lågt?',
    answers: [
      ok('Bränsleförbrukningen ökar, däcken slits ojämnt och värms upp — med risk för däckhaveri.'),
      no('Greppet blir bättre eftersom kontaktytan ökar.'),
      no('Bilen blir lättare att styra i höga hastigheter.'),
      no('Bromssträckan blir kortare.'),
    ],
    short: 'För lågt tryck ger högre förbrukning, sämre egenskaper och risk för överhettning.',
    deep:
      'Ett underdimensionerat lufttryck gör att däcksidan arbetar mer, vilket bygger upp värme. I höga hastigheter kan det leda till att däcket havererar. Dessutom blir styrningen svampig och bilen mindre stabil vid undanmanövrar. Kontrollera trycket på kalla däck, och höj det vid tung last enligt bilens anvisning.',
    sources: [general('Fordonskunskap: däck och lufttryck')],
    related: ['mil-002'],
  },
  {
    id: 'for-003',
    category: 'fordonet',
    subcategory: 'dack-och-bromsar',
    difficulty: 2,
    ruleTested: 'ABS-bromsar',
    prompt: 'Vad gör ABS-systemet?',
    answers: [
      ok('Hindrar hjulen från att låsa sig, så att du kan styra samtidigt som du bromsar.'),
      no('Förkortar alltid bromssträckan oavsett underlag.'),
      no('Bromsar automatiskt när ett hinder upptäcks.'),
      no('Fördelar kraften mellan fram- och bakhjul vid acceleration.'),
    ],
    short: 'ABS bevarar styrförmågan under hård inbromsning. Det skapar inte mer grepp.',
    deep:
      'Ett låst hjul kan inte styra. ABS pulserar bromstrycket så att hjulen fortsätter rulla, vilket gör att du kan bromsa hårt och väja samtidigt. På lös grus eller snö kan bromssträckan faktiskt bli något längre än med låsta hjul, men förmågan att styra undan är oftast värd mer. Vid en nödbromsning: tryck hårt och håll kvar — pedalen kommer att vibrera, det är systemet som arbetar.',
    sources: [general('Fordonsteknik: ABS')],
  },
  {
    id: 'for-004',
    category: 'fordonet',
    subcategory: 'belysning-fordon',
    difficulty: 1,
    ruleTested: 'Trasig lykta',
    prompt: 'Du upptäcker att en av bilens bromslyktor inte fungerar. Vad gäller?',
    answers: [
      ok('Felet ska åtgärdas — bilen får inte köras med bristfällig belysning.'),
      no('Det är tillåtet så länge den andra bromslyktan fungerar.'),
      no('Det är tillåtet i dagsljus.'),
      no('Det är tillåtet fram till nästa besiktning.'),
    ],
    short: 'Belysningen ska fungera. En trasig bromslykta ska åtgärdas.',
    deep:
      'Bromslyktan är den signal som ger fordonet bakom tid att reagera. Kontrollera belysningen regelbundet — det är svårt att upptäcka själv under körning. Be någon stå bakom bilen medan du trampar på bromsen, eller använd en reflekterande yta.',
    sources: [trf('3 kap. 68 §')],
  },
  {
    id: 'for-005',
    category: 'fordonet',
    subcategory: 'kontroll-besiktning',
    difficulty: 2,
    ruleTested: 'Körförbud',
    prompt: 'Vad innebär det att en bil har fått körförbud efter en besiktning?',
    answers: [
      ok('Bilen får inte köras, förutom kortaste lämpliga väg till en verkstad eller besiktning.'),
      no('Bilen får köras i två månader innan förbudet börjar gälla.'),
      no('Bilen får köras men inte på motorväg.'),
      no('Bilen får köras om felen är av mindre betydelse.'),
    ],
    short: 'Vid körförbud får bilen bara köras till verkstad eller ny besiktning.',
    deep:
      'Körförbud meddelas vid brister som gör fordonet trafikfarligt. Att köra i strid med förbudet är straffbart och kan påverka försäkringsskyddet. Efter reparation krävs en ombesiktning innan bilen får användas normalt igen.',
    sources: [general('Fordonslagen och besiktningsregler')],
  },
  {
    id: 'for-006',
    category: 'fordonet',
    subcategory: 'kontroll-besiktning',
    difficulty: 2,
    ruleTested: 'Förarens ansvar',
    prompt: 'Vem ansvarar för att bilen är i trafiksäkert skick när du kör den?',
    answers: [
      ok('Föraren — även om bilen är lånad eller hyrd.'),
      no('Ägaren, alltid.'),
      no('Besiktningsföretaget fram till nästa besiktning.'),
      no('Försäkringsbolaget.'),
    ],
    short: 'Som förare ansvarar du för fordonets skick, oavsett vem som äger det.',
    deep:
      'Innan du kör en lånad bil bör du kontrollera belysning, däck, rutor och att varningslampor slocknar. Ägaren har ett eget ansvar för fordonets underhåll, men det befriar inte dig som förare i det ögonblick du kör.',
    sources: [trf('3 kap. 84 §')],
  },
  {
    id: 'for-007',
    category: 'fordonet',
    subcategory: 'belysning-fordon',
    difficulty: 2,
    ruleTested: 'Varningsblinkers',
    prompt: 'När ska du använda varningsblinkers?',
    answers: [
      ok('När fordonet står stilla på ett sätt som kan utgöra en fara, eller vid plötslig kö i hög hastighet.'),
      no('När du parkerar olagligt en kort stund.', 'stanna-vs-parkera'),
      no('När du kör långsammare än övrig trafik.'),
      no('Vid körning i regn.'),
    ],
    short: 'Varningsblinkers varnar för en fara — inte ett tillstånd att stå fel.',
    deep:
      'Klassisk användning: du får motorstopp, eller du ser att kön framför står stilla på en motorväg och vill varna dem bakom. Att slå på varningsblinkers för att kunna stanna på ett förbjudet ställe är varken tillåtet eller meningsfullt.',
    sources: [trf('3 kap. 74 §')],
    related: ['ris-003'],
  },
  {
    id: 'for-008',
    category: 'fordonet',
    subcategory: 'dack-och-bromsar',
    difficulty: 3,
    ruleTested: 'Blandning av däcktyper',
    prompt: 'Vad gäller för att blanda däcktyper på samma bil?',
    answers: [
      ok('Alla fyra hjulen ska ha däck av samma typ — blanda inte vinter- och sommardäck.'),
      no('Det räcker att drivhjulen har rätt däcktyp.'),
      no('Vinterdäck fram och sommardäck bak är tillåtet.'),
      no('Blandning är tillåten om alla däck har minst 3 mm mönster.'),
    ],
    short: 'Samma däcktyp runt om. Olika grepp fram och bak gör bilen oförutsägbar.',
    deep:
      'Om bakhjulen har sämre grepp än framhjulen kan bilen få en sladdtendens som är svår att korrigera. Även dubbdäck ska sitta på alla fyra hjulen. Att spara pengar på två däck kan alltså kosta bilens stabilitet just när den behövs.',
    sources: [trf('4 kap. 18 §')],
    related: ['for-001'],
  },
  {
    id: 'for-009',
    category: 'fordonet',
    subcategory: 'kontroll-besiktning',
    difficulty: 2,
    ruleTested: 'Varningslampor',
    prompt: 'En röd varningslampa tänds på instrumentpanelen under körning. Vad gör du?',
    answers: [
      ok('Stannar på en säker plats så snart det går och tar reda på vad lampan betyder.'),
      no('Fortsätter till målet och kontrollerar sedan.'),
      no('Startar om motorn så att lampan släcks.'),
      no('Ignorerar den om bilen känns normal att köra.'),
    ],
    short: 'Rött betyder stanna snarast. Gult betyder åtgärda snart.',
    deep:
      'Färgkoden är genomgående: rött signalerar ett fel som kan skada dig eller motorn omedelbart, till exempel oljetryck eller bromsar. Gult eller orange signalerar ett fel som behöver åtgärdas men som sällan kräver att du stannar direkt. Instruktionsboken förklarar symbolerna.',
    sources: [general('Fordonskunskap: instrumentpanelens symboler')],
  },
];

export const fordonetQuestions = buildQuestions(seeds);
