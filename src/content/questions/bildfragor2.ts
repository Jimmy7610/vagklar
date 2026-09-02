import { buildQuestions, no, ok, teori, trf, vmf } from './authoring';
import type { AuthoredQuestion } from './authoring';

/**
 * Bildfrågor, omgång två: vägmärken i verklig miljö, motorväg och landsväg.
 *
 * Samma inträdesprov som i första omgången — bilden ska bära något texten inte
 * klarar. Här är det oftast att avgöra *vilket* märke som gäller, vad som sitter
 * på samma stolpe, eller hur långt sikten faktiskt räcker.
 */

const seeds: AuthoredQuestion[] = [
  /* ---- Vägmärken i verklig miljö --------------------------------------- */
  {
    id: 'bl2-001',
    category: 'hastighet',
    subcategory: 'hastighetsgranser',
    difficulty: 2,
    ruleTested: 'Flera märken på samma stolpe',
    prompt: 'Vilka tre besked ger märkena på stolpen till höger?',
    sourceImageId: 'hastighet-100-ledsnummer',
    type: 'image-scenario',
    answers: [
      ok('Högsta hastighet 100, att du kör på huvudled, och vilka vägnummer vägen har.'),
      no('Rekommenderad hastighet 100, väjningsplikt, och avstånd till nästa ort.', 'flera-marken-stolpe'),
      no('Högsta hastighet 100, parkering tillåten, och vägnummer.', 'flera-marken-stolpe'),
      no('Lägsta hastighet 100, huvudled, och avfartsnummer.', 'flera-marken-stolpe'),
    ],
    short:
      'Röd ring runt 100 är ett tak. Den gula romben betyder huvudled, alltså att korsande trafik väjer för dig. Den blå skylten anger vägnummer.',
    deep:
      'Att läsa en stolpe uppifrån och ner är en vana värd att skaffa: hastigheten först, sedan vem som har företräde, sist orienteringen. De två första påverkar din körning omedelbart.',
    sources: [vmf('2 kap. C31, B4'), teori('Vägmärken', 324)],
    tags: ['vagmarke', 'hastighet', 'huvudled'],
  },
  {
    id: 'bl2-002',
    category: 'motorvag',
    subcategory: 'pafart-avfart',
    difficulty: 2,
    ruleTested: 'Hastighet på avfart',
    prompt: 'Vad gäller hastighetsskylten vid avfarten som pilen pekar mot?',
    sourceImageId: 'avfart-hastighet-50',
    type: 'image-scenario',
    answers: [
      ok('Den gäller avfarten — inte de genomgående körfälten du lämnar.'),
      no('Den gäller hela motorvägen från och med skylten.', 'avfart-hastighet'),
      no('Den är en rekommendation för avfarten.', 'avfart-hastighet'),
      no('Den gäller först när du nått avfartens slut.', 'avfart-hastighet'),
    ],
    short:
      'Avfartens hastighetsskylt gäller avfarten. Sänk farten i retardationsfältet, inte i det genomgående körfältet.',
    deep:
      'Det praktiska misstaget är att bromsa för sent och ta med sig motorvägsfarten in i en kurva som är byggd för hälften. Fartblindhet gör dessutom att 50 känns långsammare än det är.',
    sources: [trf('3 kap. 44 §'), teori('Motorväg', 92)],
    tags: ['motorvag', 'hastighet'],
  },
  {
    id: 'bl2-003',
    category: 'vagmarken',
    subcategory: 'anvisningsmarken',
    difficulty: 2,
    ruleTested: 'Grön och blå vägvisning',
    prompt: 'Vad betyder det att den ena vägvisaren på portalen är grön och den andra blå?',
    sourceImageId: 'motorvag-portal-vagvisare',
    type: 'image-scenario',
    answers: [
      ok('Den gröna visar den fortsatta motorvägsfärden, den blå vad du når via avfarten.'),
      no('Den gröna gäller tung trafik, den blå personbilar.', 'gron-bla-vagvisning'),
      no('Den gröna är en rekommenderad väg, den blå en obligatorisk.', 'gron-bla-vagvisning'),
      no('Färgerna saknar betydelse och varierar mellan kommuner.', 'gron-bla-vagvisning'),
    ],
    short:
      'Grön botten hör till motorvägen och de långa färdmålen. Blå botten visar det du når genom att lämna den.',
    sources: [vmf('2 kap. F-märken'), teori('Vägmärken', 337)],
    tags: ['vagmarke', 'motorvag'],
  },
  {
    id: 'bl2-004',
    category: 'jarnvag',
    subcategory: 'plankorsning-marken',
    difficulty: 1,
    ruleTested: 'Kryssmärke vid plankorsning',
    prompt: 'Vad markerar de röd-vita kryssen på båda sidor av vägen?',
    sourceImageId: 'plankorsning-bommar',
    type: 'image-scenario',
    answers: [
      ok('Att här korsar järnvägen vägen.'),
      no('Att vägen är avstängd för genomfart.', 'kryssmarke'),
      no('Att du måste stanna innan du kör vidare.', 'kryssmarke'),
      no('Att spåret inte längre används.', 'kryssmarke'),
    ],
    short:
      'Kryssmärket markerar själva plankorsningen. Det säger inte i sig att du ska stanna — det är signalen och sikten som avgör.',
    sources: [vmf('2 kap. A39'), teori('Järnvägskorsningar', 108)],
    tags: ['vagmarke', 'plankorsning'],
  },
  {
    id: 'bl2-005',
    category: 'jarnvag',
    subcategory: 'plankorsning-omkorning',
    difficulty: 3,
    ruleTested: 'Bommar och omkörningsförbud',
    prompt: 'Plankorsningen på bilden har bommar. Vad betyder det för omkörning i samband med korsningen?',
    sourceImageId: 'plankorsning-bommar',
    type: 'image-scenario',
    answers: [
      ok('Omkörningsförbudet upphävs — du får köra om alla fordon.'),
      no('Endast tvåhjuliga fordon får köras om.', 'jvg-omkorning'),
      no('Omkörning är förbjuden eftersom bommarna är uppfällda.', 'jvg-omkorning'),
      no('Omkörning är förbjuden vid alla plankorsningar utan undantag.', 'jvg-omkorning'),
    ],
    short:
      'Bommar eller en fullständig trafiksignal upphäver omkörningsförbudet vid plankorsningen. Bara ett av dem behövs.',
    sources: [trf('3 kap. 40 §'), teori('Omkörning vid plankorsning', 111)],
    tags: ['plankorsning', 'omkorning'],
    related: ['bl2-004'],
  },
  {
    id: 'bl2-006',
    category: 'vagmarken',
    subcategory: 'anvisningsmarken',
    difficulty: 2,
    ruleTested: 'Gågata',
    prompt: 'Du ser skyltarna vid infarten till gatan på bilden. Får du köra in?',
    sourceImageId: 'gagata-skyltad',
    type: 'image-scenario',
    answers: [
      ok('Bara för särskilda ändamål, till exempel varutransport eller till en fastighet vid gatan.'),
      no('Ja, men bara i gångfart.', 'gagata-vs-gangfart'),
      no('Ja, gatan är öppen för all trafik.', 'gagata-vs-gangfart'),
      no('Nej, motortrafik är helt förbjuden.', 'gagata-vs-gangfart'),
    ],
    short:
      'Gågatan begränsar vem som får köra där. I ett gångfartsområde får du däremot köra, men på de gåendes villkor.',
    deep:
      'Kör du in med stöd av ett sådant ändamål gäller gångfart och väjningsplikt mot gående, och när du kör ut från gatan har du väjningsplikt.',
    sources: [vmf('2 kap. E7'), teori('Speciella gator', 116)],
    tags: ['vagmarke', 'gagata'],
  },
  {
    id: 'bl2-007',
    category: 'vagmarken',
    subcategory: 'pabudsmarken',
    difficulty: 1,
    ruleTested: 'Påbjuden körriktning',
    prompt: 'Vad kräver den runda blå skylten med pil vid infarten?',
    sourceImageId: 'pabjuden-korriktning-parkering',
    type: 'image-scenario',
    answers: [
      ok('Att du kör i pilens riktning — det är ett påbud.'),
      no('Att du rekommenderas köra i pilens riktning.', 'pabud-vs-rekommendation'),
      no('Att trafik från pilens håll har företräde.', 'pabud-vs-rekommendation'),
      no('Att parkering finns i pilens riktning.', 'pabud-vs-rekommendation'),
    ],
    short:
      'Rund blå skylt med vit symbol är ett påbud. Fyrkantig blå skylt hade varit en upplysning.',
    sources: [vmf('2 kap. D1'), teori('Påbudsmärken (D)', 333)],
    tags: ['vagmarke', 'pabud'],
  },
  {
    id: 'bl2-008',
    category: 'vagmarken',
    subcategory: 'anvisningsmarken',
    difficulty: 2,
    ruleTested: 'Körfältsvägvisare',
    prompt: 'Vad ska du använda vägvisartavlan till redan här, långt före korsningen?',
    sourceImageId: 'korfaltsvagvisare-korsning',
    type: 'image-scenario',
    answers: [
      ok('Att välja körfält i tid, så att du slipper byta sent.'),
      no('Att avgöra vem som har väjningsplikt i korsningen.', 'vagvisare-anvandning'),
      no('Att bedöma vilken hastighet som gäller efter korsningen.', 'vagvisare-anvandning'),
      no('Att avgöra om du får köra om före korsningen.', 'vagvisare-anvandning'),
    ],
    short:
      'Vägvisaren talar om vilket körfält som leder dit du ska. Ett sent körfältsbyte i en korsning är både förbjudet och farligt.',
    sources: [vmf('2 kap. F8'), teori('Vilket körfält du ska välja', 16)],
    tags: ['vagmarke', 'korfalt'],
  },

  /* ---- Motorväg och landsväg -------------------------------------------- */
  {
    id: 'bl2-009',
    category: 'motorvag',
    subcategory: 'motorvag-regler',
    difficulty: 2,
    ruleTested: 'Stillastående fordon på vägrenen',
    prompt: 'En bil står på vägrenen längre fram. Vad är rätt att göra?',
    sourceImageId: 'motorvag-stillastaende-fordon',
    type: 'situational-judgement',
    answers: [
      ok('Öka avståndet i sidled om det går, och var beredd på människor utanför bilen.'),
      no('Hålla farten och positionen — fordonet står utanför körbanan.', 'stillastaende-vagren'),
      no('Bromsa kraftigt för att kunna stanna om någon kliver ut.', 'stillastaende-vagren'),
      no('Slå på varningsblinkers för att varna bakomvarande.', 'stillastaende-vagren'),
    ],
    short:
      'Ett stillastående fordon på motorväg betyder nästan alltid människor nära körbanan. Byt till vänster körfält om det är fritt.',
    deep:
      'Kraftig inbromsning i hög fart är sin egen risk när det finns trafik bakom. Det du kan styra är sidoavståndet och uppmärksamheten.',
    sources: [trf('3 kap. 1 §'), teori('Motorväg', 91)],
    tags: ['motorvag', 'risk'],
  },
  {
    id: 'bl2-010',
    category: 'motorvag',
    subcategory: 'pafart-avfart',
    difficulty: 3,
    ruleTested: 'Sammanvävning',
    prompt: 'Pilarna i körbanan visar att ditt körfält går samman med nästa. Vad gäller?',
    sourceImageId: 'motortrafikled-avsmalning',
    type: 'image-scenario',
    answers: [
      ok('Ingen av er har företräde — vävningen bygger på att båda anpassar farten.'),
      no('Den som är i det genomgående körfältet har alltid företräde.', 'sammanvavning'),
      no('Den som kommer först till punkten där fälten möts har företräde.', 'sammanvavning'),
      no('Högerregeln avgör vem som kör först.', 'sammanvavning'),
    ],
    short:
      'Vid sammanvävning ska förarna underlätta för varandra genom att anpassa farten. Det är inte en väjningspliktssituation.',
    deep:
      'Praktiskt fungerar det bäst om varannan bil släpps in. Att accelerera för att stänga luckan skapar precis den situation regeln finns för att undvika.',
    sources: [trf('3 kap. 44 §'), teori('Körfältsbyte', 17)],
    tags: ['motorvag', 'korfalt'],
  },
  {
    id: 'bl2-011',
    category: 'omkorning',
    subcategory: 'omkorningsregler',
    difficulty: 3,
    ruleTested: 'Sikt vid omkörning',
    prompt:
      'Du överväger en omkörning på sträckan i bilden. Hur långt måste sikten räcka?',
    sourceImageId: 'landsvag-omkorningssikt',
    type: 'image-scenario',
    answers: [
      ok('Hela sträckan du behöver för att köra om och komma tillbaka in med marginal.'),
      no('Fram till det fordon du ska köra om.', 'omkorning-sikt'),
      no('Ungefär hundra meter framför fordonet du ska köra om.', 'omkorning-sikt'),
      no('Så långt att du hinner avbryta omkörningen halvvägs.', 'omkorning-sikt'),
    ],
    short:
      'Omkörningen är klar först när du är tillbaka i ditt körfält med säkert avstånd. Sikten måste räcka för hela det förloppet.',
    deep:
      'En vanlig felbedömning är att räkna sikten fram till mötande trafik i stället för att räkna in mötets hastighet. Två fordon i 90 km/h närmar sig varandra med 50 meter i sekunden.',
    sources: [trf('3 kap. 30–36 §§'), teori('Omkörningar', 98)],
    tags: ['omkorning', 'landsvag'],
  },
  {
    id: 'bl2-012',
    category: 'omkorning',
    subcategory: 'omkorningsregler',
    difficulty: 2,
    ruleTested: 'Omkörning på vinterväg',
    prompt: 'Sikten är god på den snötäckta vägen. Vad talar ändå emot en omkörning här?',
    sourceImageId: 'traktor-vintervag',
    type: 'situational-judgement',
    answers: [
      ok('Greppet — snömodden mellan hjulspåren gör accelerationen och återinträdet oförutsägbara.'),
      no('Ingenting, eftersom sikten är det som avgör.', 'omkorning-vinter'),
      no('Att omkörning alltid är förbjuden vid snötäckt vägbana.', 'omkorning-vinter'),
      no('Att arbetsfordon aldrig får köras om.', 'omkorning-vinter'),
    ],
    short:
      'Omkörningen kräver grepp både för att accelerera förbi och för att komma tillbaka in. Snösträngen mellan spåren är den svåraste delen.',
    sources: [trf('3 kap. 30 §'), teori('Vinter', 124)],
    tags: ['omkorning', 'vinter'],
  },
  {
    id: 'bl2-013',
    category: 'motorvag',
    subcategory: 'landsvag',
    difficulty: 2,
    ruleTested: 'Vägkantens bärighet',
    prompt: 'Pilen pekar mot vägkanten. Varför är den värd att hålla avstånd till?',
    sourceImageId: 'landsvag-vagkant',
    type: 'image-scenario',
    answers: [
      ok('Den är lös och kan dra ner bilen om ett hjul hamnar utanför asfalten.'),
      no('Den är avsedd för gående och cyklister.', 'vagkant-risk'),
      no('Det är förbjudet att köra närmare än en meter från kanten.', 'vagkant-risk'),
      no('Den är hal på grund av vägmarkeringen.', 'vagkant-risk'),
    ],
    short:
      'En lös vägkant ger efter under hjulet. Rätt placering är en bit in i körfältet, inte så långt höger som möjligt.',
    deep:
      'Kommer ett hjul utanför asfalten är den farliga reaktionen att rycka tillbaka ratten. Rätt hantering är att släppa gasen, hålla stadigt och styra tillbaka mjukt när farten sjunkit.',
    sources: [trf('3 kap. 7 §'), teori('Landsväg', 78)],
    tags: ['landsvag', 'placering'],
  },
  {
    id: 'bl2-014',
    category: 'trafikregler',
    subcategory: 'korfalt-och-sving',
    difficulty: 2,
    ruleTested: 'Tillfälliga anvisningar vid vägarbete',
    prompt: 'Vad gäller vid omledningen på bilden om den strider mot de ordinarie märkena?',
    sourceImageId: 'vagarbete-omledning',
    type: 'image-scenario',
    answers: [
      ok('De tillfälliga anvisningarna gäller före de ordinarie.'),
      no('De ordinarie märkena gäller, eftersom de är permanenta.', 'tillfalliga-anvisningar'),
      no('Du väljer själv vilken anvisning som verkar säkrast.', 'tillfalliga-anvisningar'),
      no('Vägmarkeringen i körbanan gäller före båda.', 'tillfalliga-anvisningar'),
    ],
    short:
      'Vid vägarbete är det de tillfälliga anvisningarna som gäller. Räkna dessutom med människor nära körbanan och löst grus.',
    sources: [trf('2 kap. 3 §'), teori('Vägarbeten', 82)],
    tags: ['vagarbete', 'rangordning'],
  },
  {
    id: 'bl2-015',
    category: 'risker',
    subcategory: 'skymd-sikt',
    difficulty: 2,
    ruleTested: 'Stillastående buss',
    prompt: 'Bussen står vid hållplatsen längre fram. Vilken risk är störst?',
    sourceImageId: 'buss-vid-hallplats',
    type: 'situational-judgement',
    answers: [
      ok('Att en person kliver ut i vägbanan framför bussen, dold av den.'),
      no('Att bussen svänger ut i din körriktning utan att blinka.', 'buss-risk'),
      no('Att skåpbilen till vänster börjar backa.', 'buss-risk'),
      no('Att bussen blockerar sikten mot vägmärken.', 'buss-risk'),
    ],
    short:
      'Den som kliver av bussen ser inte dig, och du ser inte dem. Sänk farten och håll så stort sidoavstånd som utrymmet tillåter.',
    deep:
      'Inom tättbebyggt område ska du dessutom lämna företräde åt en buss som blinkar ut från en hållplats där hastighetsgränsen är högst 50 km/h.',
    sources: [trf('3 kap. 25 §'), teori('Barn', 169)],
    tags: ['risk', 'oskyddade'],
  },

  /* ---- Grundläggande, lätta ------------------------------------------- */
  {
    id: 'bl2-016',
    category: 'motorvag',
    subcategory: 'motorvag-regler',
    difficulty: 1,
    ruleTested: 'Körfältsval på motorväg',
    prompt: 'I vilket körfält ska du normalt ligga på en motorväg när du inte kör om?',
    sourceImageId: 'motorvag-bro-korfalt',
    type: 'image-scenario',
    answers: [
      ok('Det högra.'),
      no('Det vänstra, så att påfarande trafik kommer in lättare.', 'korfaltsval-hoger'),
      no('Det som har minst trafik just då.', 'korfaltsval-hoger'),
      no('Det spelar ingen roll på motorväg.', 'korfaltsval-hoger'),
    ],
    short:
      'Grundregeln är högra körfältet. Vänster körfält används för omkörning och lämnas så snart omkörningen är klar.',
    sources: [trf('3 kap. 7 §'), teori('Motorväg', 90)],
    tags: ['motorvag', 'korfalt'],
  },
  {
    id: 'bl2-017',
    category: 'halka',
    subcategory: 'vinterkorning',
    difficulty: 1,
    ruleTested: 'Snötäckt vägbana',
    prompt: 'Vad är svårast att bedöma på en helt snötäckt väg som den på bilden?',
    sourceImageId: 'snotackt-skogsvag',
    type: 'image-scenario',
    answers: [
      ok('Var körbanan slutar och vägkanten börjar.'),
      no('Vilken hastighet som är skyltad.', 'snotackt-vag'),
      no('Åt vilket håll vägen lutar.', 'snotackt-vag'),
      no('Hur brett fordonet är.', 'snotackt-vag'),
    ],
    short:
      'Utan synliga kantlinjer är vägens bredd en gissning. Sänk farten och håll dig efter tidigare fordons spår där det går.',
    sources: [teori('Vinter', 125)],
    tags: ['vinter', 'halka'],
  },
  {
    id: 'bl2-018',
    category: 'motorvag',
    subcategory: 'landsvag',
    difficulty: 1,
    ruleTested: 'Kantlinjens betydelse',
    prompt: 'Vad markerar den heldragna vita linjen längs vägens ytterkant?',
    sourceImageId: 'landsvag-kantlinjer',
    type: 'image-scenario',
    answers: [
      ok('Var körbanan slutar.'),
      no('Att omkörning är förbjuden.', 'kantlinje'),
      no('Att parkering är tillåten utanför linjen.', 'kantlinje'),
      no('Att vägrenen får användas som körfält.', 'kantlinje'),
    ],
    short:
      'Kantlinjen visar körbanans ytterkant. Utanför den är vägren, som inte är avsedd för normal körning.',
    sources: [vmf('3 kap. M5'), teori('Landsväg', 80)],
    tags: ['vagmarkering', 'landsvag'],
  },
];

export const bildfragor2Questions = buildQuestions(seeds);
