import { buildQuestions, bbk, general, lmv, no, ok, tbl, teori, trf, tsv, tvk, v1177 } from './authoring';
import type { AuthoredQuestion } from './authoring';

/**
 * Människan: inlärning, mognad, stress, grupptryck, droger, barn och vilt.
 *
 * Området handlar om varför en förare som *kan* reglerna ändå kör fel. Frågorna
 * är därför formulerade kring bedömning och konsekvens, inte kring moral: vad
 * som händer med reaktionsförmågan, vilken risk som är störst, vilken
 * bedömning som är rimlig. Ingen fråga säger åt eleven att skärpa sig.
 */

const seeds: AuthoredQuestion[] = [
  /* ================= Inlärning och körstrategi ================= */
  {
    id: 'mns-001',
    category: 'manniskan',
    subcategory: 'korstrategi',
    difficulty: 2,
    ruleTested: 'Överinlärning',
    prompt:
      'Varför är det viktigt att själva handhavandet — koppling, växling, blickteknik — sitter i ryggmärgen?',
    answers: [
      ok('För att uppmärksamheten då kan läggas på trafiken runt omkring i stället för på bilen.'),
      no('För att du ska kunna köra fortare utan att göra fel.', 'overinlarning'),
      no('För att provet kräver att du kan momenten utantill.', 'overinlarning'),
      no('För att bränsleförbrukningen sjunker.', 'overinlarning'),
    ],
    short:
      'Överinlärning frigör uppmärksamhet. Så länge växlingen kräver eftertanke är det den, och inte trafiken, som får din kapacitet.',
    deep:
      'Uppmärksamhet är en begränsad resurs. Det är därför en ovan förare kan missa en cyklist som en van förare ser direkt — inte för att ögonen är sämre, utan för att kapaciteten går åt någon annanstans.',
    sources: [teori('Olika typer av inlärning', 132)],
    tags: ['korstrategi', 'inlarning'],
  },
  {
    id: 'mns-002',
    category: 'manniskan',
    subcategory: 'korstrategi',
    difficulty: 2,
    ruleTested: 'Ytinlärning',
    prompt:
      'Vad är problemet med att plugga in teorin utantill inför provet utan att förstå sammanhangen?',
    answers: [
      ok('Kunskapen glöms snabbt och hjälper inte i situationer som inte ser ut som frågorna.'),
      no('Det tar längre tid än att förstå reglerna.', 'ytinlarning'),
      no('Det är förbjudet enligt kursplanen.', 'ytinlarning'),
      no('Det fungerar bra, men bara för teoriprovet.', 'ytinlarning'),
    ],
    short:
      'Ytinlärning ger ingen helhetsförståelse. Trafiken ställer sällan frågan i samma form som ett prov gör.',
    deep:
      'Djupinlärning — att förstå varför regeln finns — är det som gör att du kan hantera en situation regeln inte uttryckligen täcker. Repetition är det som får kunskapen att sitta kvar.',
    sources: [teori('Olika typer av inlärning', 132)],
    tags: ['korstrategi', 'inlarning'],
    related: ['mns-001'],
  },
  {
    id: 'mns-003',
    category: 'manniskan',
    subcategory: 'korstrategi',
    difficulty: 3,
    ruleTested: 'Sannolikhetsinlärning',
    prompt:
      'Du passerar samma plankorsning varje dag och har aldrig sett ett tåg där. Hur påverkar det din körning?',
    answers: [
      ok('Risken är att du slutar kontrollera — erfarenheten säger "aldrig tåg", men den säger inget om i dag.'),
      no('Erfarenheten är tillförlitlig, så kontrollen kan förkortas.', 'sannolikhetsinlarning'),
      no('Den påverkar inte alls, eftersom rutin gör dig säkrare.', 'sannolikhetsinlarning'),
      no('Den gör dig mer uppmärksam, eftersom du känner platsen väl.', 'sannolikhetsinlarning'),
    ],
    short:
      'Sannolikhetsinlärning kan gå åt båda hållen. Att något sällan händer är inte samma sak som att det inte kan hända just nu.',
    deep:
      'Bra sannolikhetsinlärning: du vet att tåg passerar ofta här och är extra uppmärksam. Dålig: du vet att tåg nästan aldrig passerar och slutar titta. Samma mekanism, motsatt utfall.',
    memory: 'Erfarenhet är en hypotes, inte ett facit.',
    sources: [teori('Sannolikhetsinlärning', 134)],
    tags: ['korstrategi', 'riskbedomning'],
  },
  {
    id: 'mns-004',
    category: 'manniskan',
    subcategory: 'korstrategi',
    difficulty: 2,
    ruleTested: 'Imitationsinlärning',
    prompt:
      'Du lär dig köra genom att ta efter en förare du åker med ofta. Vad avgör om det är bra eller dåligt?',
    answers: [
      ok('Vem du tar efter — imitationen kopierar både goda och dåliga vanor.'),
      no('Hur länge du har åkt med personen.', 'imitationsinlarning'),
      no('Om personen har haft körkort i mer än fem år.', 'imitationsinlarning'),
      no('Ingenting — imitation är alltid en dålig inlärningsform.', 'imitationsinlarning'),
    ],
    short:
      'Imitationsinlärning är kraftfull och neutral. Den kopierar det du ser, oavsett om det du ser är bra körning.',
    sources: [teori('Olika typer av inlärning', 132)],
    tags: ['korstrategi', 'inlarning'],
  },

  /* ================= Mognad, attityd, grupptryck ================= */
  {
    id: 'mns-005',
    category: 'manniskan',
    subcategory: 'attityd-och-grupptryck',
    difficulty: 2,
    ruleTested: 'Mognadsgrader hos förare',
    prompt:
      'En förare följer alla regler men blir irriterad och tutar när någon får motorstopp vid ett rödljus. Hur beskrivs det beteendet bäst?',
    answers: [
      ok('Som en regelföljande förare som faller tillbaka i att hävda sin rätt när reglerna inte räcker.'),
      no('Som en tolerant och mogen förare som markerar tydligt.', 'mognadsgrader'),
      no('Som ett tecken på god situationsmedvetenhet.', 'mognadsgrader'),
      no('Som normal och önskvärd kommunikation i trafiken.', 'mognadsgrader'),
    ],
    short:
      'Att följa reglerna räcker inte alltid. Den mogna föraren har dessutom erfarenheten att hantera det oväntade lugnt.',
    deep:
      'Tre faser brukar beskrivas: omogen och självisk, regelföljande, och tolerant och mogen. Den regelföljande fungerar bra i de flesta lägen — men när reglerna tar slut är det omdömet som ska ta vid.',
    sources: [teori('Olika grader av mognad', 132)],
    tags: ['attityd', 'samspel'],
  },
  {
    id: 'mns-006',
    category: 'manniskan',
    subcategory: 'attityd-och-grupptryck',
    difficulty: 3,
    ruleTested: 'Unga förares riskökning',
    prompt:
      'Varför ökar risktagandet hos många unga förare några år *efter* att de tagit körkort?',
    answers: [
      ok('Körvanan gör dem säkrare på sig själva, och den ökade självsäkerheten kommer före den faktiska erfarenheten.'),
      no('Körkortsutbildningen glöms bort efter ett par år.', 'unga-forare-risk'),
      no('Bilarna de kör blir kraftfullare med tiden.', 'unga-forare-risk'),
      no('Prövotiden går ut, vilket gör reglerna mildare.', 'unga-forare-risk'),
    ],
    short:
      'Överskattning av den egna förmågan är en av huvudorsakerna till att unga förare är överrepresenterade. Den växer med upplevd, inte faktisk, skicklighet.',
    deep:
      'De andra kända faktorerna är liten erfarenhet av verklig trafik, låg mognadsgrad och fel förebilder. Unga män överskattar sin körförmåga mer än kvinnor i samma ålder.',
    sources: [teori('Unga bilförare', 133)],
    tags: ['attityd', 'riskbedomning'],
  },
  {
    id: 'mns-007',
    category: 'manniskan',
    subcategory: 'attityd-och-grupptryck',
    difficulty: 2,
    ruleTested: 'Negativt grupptryck',
    prompt:
      'Ni är sena till en konsert och passagerarna börjar oroa sig högt för att ni inte hinner. Vad är den största risken?',
    answers: [
      ok('Att du omedvetet ökar farten och tar chanser du annars inte skulle ta.'),
      no('Att du blir distraherad av samtalet i sig.', 'grupptryck'),
      no('Att passagerarna inte använder bälte.', 'grupptryck'),
      no('Att du missar avfarten och måste vända.', 'grupptryck'),
    ],
    short:
      'Grupptryck ändrar beteende utan att någon uttryckligen ber om det. Tidspressen översätts till fart och till marginaler som krymper.',
    deep:
      'Undersökningar pekar ut en ung förare med en grupp unga manliga passagerare som den farligaste kombinationen. Som passagerare är motsatsen också sann: att säga ifrån minskar pressen och uppskattas ofta.',
    sources: [teori('Grupptryck', 135)],
    tags: ['attityd', 'grupptryck'],
  },
  {
    id: 'mns-008',
    category: 'manniskan',
    subcategory: 'attityd-och-grupptryck',
    difficulty: 2,
    ruleTested: 'Positivt grupptryck',
    prompt:
      'Du åker med en förare som kör påtagligt fort. Vad är mest verkningsfullt att göra?',
    answers: [
      ok('Säga ifrån lugnt — det minskar ofta pressen på föraren i stället för att öka den.'),
      no('Vara tyst, eftersom kritik gör föraren stressad och sämre.', 'passagerarrollen'),
      no('Skoja om farten så att stämningen inte blir spänd.', 'passagerarrollen'),
      no('Vänta tills ni stannat och ta upp det efteråt.', 'passagerarrollen'),
    ],
    short:
      'Grupptryck fungerar åt båda hållen. Att någon säger till kan vara det som ger föraren tillåtelse att sakta ner.',
    deep:
      'Att skoja om farten är däremot riskabelt: en förare med lågt självförtroende kan uppfatta skämtet som en uppmaning snarare än en invändning.',
    sources: [teori('Grupptryck', 135)],
    tags: ['attityd', 'grupptryck'],
    related: ['mns-007'],
  },
  {
    id: 'mns-009',
    category: 'manniskan',
    subcategory: 'korstrategi',
    difficulty: 3,
    ruleTested: 'Att frångå reglerna med gott omdöme',
    prompt:
      'Kugghjulsprincipen — att varannan bil släpps fram vid en avsmalning — står inte i någon lagtext. När är det ändå rimligt att tillämpa den?',
    answers: [
      ok('När hela trafiksituationen tjänar på det, alla förstår vad som sker, och du är den som släpper fram.'),
      no('När du har bråttom och kön står still.', 'fragan-regler'),
      no('Aldrig — det som inte står i lagen får inte tillämpas.', 'fragan-regler'),
      no('När du kommer från höger och alltså har företräde ändå.', 'fragan-regler'),
    ],
    short:
      'Att frångå en regel kan vara gott omdöme, men bara när det är generöst och begripligt för alla inblandade — aldrig genom att ta för sig.',
    deep:
      'Kursplanen för B-körkort talar om gott omdöme i samspelet med andra trafikanter. Hundraprocentig regelföljsamhet i alla lägen är alltså inte målet; förutsägbarhet och säkerhet är det.',
    memory: 'Börja aldrig med att ta — börja med att ge.',
    sources: [teori('Frångå trafikreglerna ibland', 133)],
    tags: ['korstrategi', 'samspel'],
  },

  /* ================= Stress ================= */
  {
    id: 'mns-010',
    category: 'trotthet',
    subcategory: 'stress-och-kanslor',
    difficulty: 3,
    ruleTested: 'Stressnivå och prestation',
    prompt: 'Vilken stressnivå ger normalt bäst körprestation?',
    answers: [
      ok('Måttlig stress — helt avslappnad tas körningen inte på tillräckligt allvar.'),
      no('Ingen stress alls.', 'stressniva'),
      no('Hög stress, eftersom skärpan då är som störst.', 'stressniva'),
      no('Stressnivån påverkar inte prestationen.', 'stressniva'),
    ],
    short:
      'Måttlig stress höjer koncentrationen. Farligast är hög stress; helt avslappnad är inte heller optimalt.',
    sources: [teori('Stress', 134)],
    tags: ['stress'],
  },
  {
    id: 'mns-011',
    category: 'trotthet',
    subcategory: 'stress-och-kanslor',
    difficulty: 2,
    ruleTested: 'Följder av hög stress',
    prompt: 'Vilken av följande är en typisk följd av mycket hög stress bakom ratten?',
    answers: [
      ok('Tanketröghet — det går inte att tänka klart och logiskt.'),
      no('Förbättrad överblick över trafiken.', 'hog-stress-foljder'),
      no('Långsammare men säkrare beslut.', 'hog-stress-foljder'),
      no('Ökad förmåga att bedöma avstånd.', 'hog-stress-foljder'),
    ],
    short:
      'Hög stress kan ge panik, blackout, uppgivenhet, stirrighet eller tanketröghet. Gemensamt är att omdömet försämras just när det behövs.',
    sources: [teori('För hög stress kan leda till', 134)],
    tags: ['stress'],
    related: ['mns-010'],
  },
  {
    id: 'mns-012',
    category: 'trotthet',
    subcategory: 'stress-och-kanslor',
    difficulty: 1,
    ruleTested: 'Att minska stress',
    prompt: 'Vilken åtgärd minskar stressen inför en körning mest?',
    answers: [
      ok('Att ge dig själv gott om tid.'),
      no('Att välja en snabbare väg.', 'minska-stress'),
      no('Att köra i rusningstrafik när fler bilar håller jämn fart.', 'minska-stress'),
      no('Att lyssna på musik med högt tempo.', 'minska-stress'),
    ],
    short:
      'Tidsmarginal är det som tar bort själva orsaken. Att vara utvilad, köra defensivt och undvika rusningstrafik hjälper också.',
    sources: [teori('Minska risken för stress', 134)],
    tags: ['stress'],
  },
  {
    id: 'mns-013',
    category: 'trotthet',
    subcategory: 'stress-och-kanslor',
    difficulty: 3,
    ruleTested: 'Känslor och körning',
    prompt:
      'Du sätter dig i bilen direkt efter ett gräl och känner dig upprörd. Vad är den största risken?',
    answers: [
      ok('Att uppmärksamheten går åt till grälet och att besluten blir mer impulsiva.'),
      no('Att du kör långsammare än trafikrytmen.', 'kanslor-korning'),
      no('Att du glömmer att ta med körkortet.', 'kanslor-korning'),
      no('Ingen — känslor påverkar inte körförmågan.', 'kanslor-korning'),
    ],
    short:
      'Starka känslor tar kapacitet från trafiken och sänker tröskeln för impulsiva beslut. Vänta några minuter innan du kör.',
    type: 'situational-judgement',
    sources: [teori('Stress', 134)],
    tags: ['stress', 'uppmarksamhet'],
  },

  /* ================= Alkohol ================= */
  {
    id: 'mns-014',
    category: 'alkohol',
    subcategory: 'alkohol-effekter',
    difficulty: 2,
    ruleTested: 'Effekt vid låg promillehalt',
    prompt: 'Vad händer redan vid 0,1–0,4 promille?',
    answers: [
      ok('Vissa mentala spärrar släpper, den egna förmågan överskattas och reaktionstiden försämras.'),
      no('Ingenting mätbart — påverkan börjar först vid 0,5 promille.', 'alkohol-tidig-effekt'),
      no('Balansen försämras och dubbelseende uppstår.', 'alkohol-tidig-effekt'),
      no('Endast synen påverkas.', 'alkohol-tidig-effekt'),
    ],
    short:
      'Den farligaste effekten kommer först: omdömet försämras innan man känner sig berusad, och den egna förmågan överskattas.',
    deep:
      'Vid 0,4–1,0 promille försämras dessutom syn, tal och koordination. Vid 1,0–2,0 blir det svårt att kontrollera kroppen. Men det är den tidiga, omärkliga fasen som gör att någon sätter sig bakom ratten alls.',
    sources: [teori('Promille', 140), v1177()],
    tags: ['alkohol'],
  },
  {
    id: 'mns-015',
    category: 'alkohol',
    subcategory: 'alkohol-effekter',
    difficulty: 3,
    ruleTested: 'Individuell variation i promillehalt',
    prompt:
      'Två personer dricker exakt lika mycket alkohol. Varför kan de ändå få olika promillehalt?',
    answers: [
      ok('Vikt, kön, hälsa, drickhastighet och vad de ätit påverkar halten.'),
      no('Promillehalten beror bara på mängden alkohol.', 'alkohol-variation'),
      no('Skillnaden beror enbart på kroppsvikt.', 'alkohol-variation'),
      no('Skillnaden uppstår först vid höga mängder.', 'alkohol-variation'),
    ],
    short:
      'Samma mängd ger inte samma promillehalt. Även samma person kan få olika halt vid olika tillfällen, till exempel beroende på matintag.',
    deep:
      'Det gör att egna tumregler av typen "ett glas i timmen" inte går att lita på. Nedbrytningen går dessutom inte att påskynda — bara att vänta ut.',
    sources: [teori('Alkoholupplysning', 141), v1177()],
    tags: ['alkohol'],
  },
  {
    id: 'mns-016',
    category: 'alkohol',
    subcategory: 'alkohol-effekter',
    difficulty: 2,
    ruleTested: 'Dagen efter',
    prompt:
      'Du har druckit mycket kvällen innan men är säker på att alkoholen hunnit gå ur kroppen. Vad gäller?',
    answers: [
      ok('Du kan fortfarande vara sliten och sämre som förare, även om promillehalten är noll.'),
      no('Du är opåverkad så snart promillehalten är noll.', 'dagen-efter'),
      no('Du är opåverkad efter åtta timmars sömn oavsett mängd.', 'dagen-efter'),
      no('Det räknas fortfarande som rattfylleri i 24 timmar.', 'dagen-efter'),
    ],
    short:
      'Noll promille betyder inte återställd. Trötthet och sämre koncentration finns ofta kvar dagen efter.',
    deep:
      'Kombinationen är dessutom vanlig: dålig sömn plus resterande utmattning ger en reaktionsförmåga som liknar den hos en trött förare, utan att något visar sig i ett utandningsprov.',
    sources: [teori('Alkoholupplysning', 141), v1177()],
    tags: ['alkohol', 'trotthet'],
    related: ['mns-015'],
  },
  {
    id: 'mns-017',
    category: 'alkohol',
    subcategory: 'alkohol-gransvarden',
    difficulty: 3,
    ruleTested: 'Rattfylleri under gränsvärdet',
    prompt:
      'Kan det räknas som rattfylleri om alkoholhalten ligger under 0,2 promille?',
    answers: [
      ok('Ja, om du är så påverkad att du inte kan köra på ett betryggande sätt.'),
      no('Nej, gränsvärdet är absolut.', 'rattfylleri-grans'),
      no('Nej, men det kan ge böter för ovarsam körning.', 'rattfylleri-grans'),
      no('Ja, men bara för yrkesförare.', 'rattfylleri-grans'),
    ],
    short:
      'Gränsvärdet säger när halten ensam räcker för fällande dom. Lagen har också en andra väg in: den som är så påverkad att fordonet inte kan föras på ett betryggande sätt döms för rattfylleri oavsett halt.',
    deep:
      'Det är två skilda saker som ofta blandas ihop. Rattfylleri handlar om påverkan — antingen mätt som halt, eller bedömd som oförmåga att köra betryggande. Vårdslöshet i trafik är ett eget brott i samma lag och handlar om hur du körde, med eller utan alkohol inblandad. Samma körning kan träffas av båda.',
    sources: [
      tbl('4 §'),
      teori('Alkoholupplysning', 141),
    ],
    tags: ['alkohol'],
  },
  {
    id: 'mns-018',
    category: 'alkohol',
    subcategory: 'alkohol-gransvarden',
    difficulty: 2,
    ruleTested: 'Medhjälp till rattfylleri',
    prompt:
      'Du lånar ut bilen till en vän som du vet har druckit. Vad kan det innebära?',
    answers: [
      ok('Att du kan straffas för medhjälp till rattfylleri.'),
      no('Ingenting — ansvaret ligger helt på föraren.', 'medhjalp-rattfylleri'),
      no('Att din försäkring blir dyrare men inget mer.', 'medhjalp-rattfylleri'),
      no('Att du blir ersättningsskyldig men inte straffas.', 'medhjalp-rattfylleri'),
    ],
    short:
      'Att låna ut bilen till någon du vet är påverkad, eller att bjuda någon som ska köra, kan vara straffbar medhjälp.',
    deep:
      'Medverkansansvaret står i brottsbalken och gäller den som främjar gärningen med råd eller dåd. Att lämna över nycklarna till någon du vet har druckit är att möjliggöra körningen.',
    sources: [bbk('23 kap. 4 §'), tbl('4 §'), teori('Alkoholupplysning', 141)],
    tags: ['alkohol'],
  },
  {
    id: 'mns-019',
    category: 'alkohol',
    subcategory: 'alkohol-gransvarden',
    difficulty: 2,
    ruleTested: 'Var rattfyllerilagen gäller',
    prompt: 'Var gäller rattfyllerilagstiftningen?',
    answers: [
      ok('Överallt — även inom inhägnat område och på privat mark.'),
      no('Endast på allmän väg.', 'rattfylleri-plats'),
      no('Endast där det finns vägmärken uppsatta.', 'rattfylleri-plats'),
      no('Endast inom tättbebyggt område.', 'rattfylleri-plats'),
    ],
    short:
      'Lagen gäller överallt och för alla motordrivna fordon, inte bara bilar och inte bara på allmän väg.',
    deep:
      'Paragrafen träffar den som för ett motordrivet fordon eller en spårvagn. Den säger ingenting om var — till skillnad från stora delar av trafikförordningen, som gäller på väg. Därför omfattas också en parkeringsplats, en gårdsplan och ett inhägnat område.',
    sources: [tbl('4 §'), teori('Alkoholupplysning', 141)],
    tags: ['alkohol'],
  },

  /* ================= Droger och läkemedel ================= */
  {
    id: 'mns-020',
    category: 'alkohol',
    subcategory: 'droger-lakemedel',
    difficulty: 2,
    ruleTested: 'Ansvar för läkemedelspåverkan',
    prompt:
      'Du har fått en medicin utskriven av läkare och känner dig dåsig av den. Vad gäller?',
    answers: [
      ok('Du får inte köra om du uppträder trafikfarligt — receptet ändrar inte det.'),
      no('Du får köra, eftersom läkaren skrivit ut medicinen.', 'lakemedel-ansvar'),
      no('Du får köra om du håller lägre hastighet.', 'lakemedel-ansvar'),
      no('Du får köra de första dagarna innan medicinen börjat verka fullt.', 'lakemedel-ansvar'),
    ],
    short:
      'Ansvaret att bedöma om ett läkemedel gör dig trafikfarlig är ditt. Bipacksedel, apotek och läkare är hjälpmedel — inte en ansvarsfriskrivning.',
    deep:
      'Kör du trafikfarligt på grund av läkemedel tillämpas rattfyllerilagstiftningen, oavsett om medlet är utskrivet.',
    sources: [teori('Läkemedel & mediciner i trafiken', 141)],
    tags: ['lakemedel'],
  },
  {
    id: 'mns-021',
    category: 'alkohol',
    subcategory: 'droger-lakemedel',
    difficulty: 2,
    ruleTested: 'Nolltolerans mot narkotika',
    prompt: 'Vilken gräns gäller för narkotika i trafiken?',
    answers: [
      ok('Nolltolerans — inte det minsta spår får finnas.'),
      no('Samma promillegräns som för alkohol.', 'narkotika-grans'),
      no('En gräns som varierar med preparatet.', 'narkotika-grans'),
      no('Ingen gräns, men körningen bedöms i efterhand.', 'narkotika-grans'),
    ],
    short:
      'Nolltolerans gäller. Undantaget är narkotikaklassade läkemedel som läkare skrivit ut — och bara om du inte blir trafikfarlig.',
    sources: [teori('Droger & narkotika i trafiken', 142)],
    tags: ['droger'],
  },
  {
    id: 'mns-022',
    category: 'alkohol',
    subcategory: 'droger-lakemedel',
    difficulty: 3,
    ruleTested: 'Vakenhetshöjande droger',
    prompt:
      'Varför är vakenhetshöjande droger som amfetamin särskilt farliga i trafiken?',
    answers: [
      ok('Tröttheten förträngs i stället för att försvinna, så föraren kan somna utan förvarning.'),
      no('De ger omedelbar dåsighet redan efter någon minut.', 'vakenhetshojande'),
      no('De försämrar synen men inte reaktionsförmågan.', 'vakenhetshojande'),
      no('De påverkar bara omdömet på lång sikt.', 'vakenhetshojande'),
    ],
    short:
      'Vakenhetshöjande medel ger hyperaktivitet och kraftig överskattning av den egna förmågan. Tröttheten finns kvar under ytan och kommer tillbaka plötsligt.',
    deep:
      'Vakenhetssänkande medel ger i stället dåsighet och förlängd reaktionstid. Båda kategorierna faller under rattfyllerilagstiftningen om körningen blir trafikfarlig.',
    sources: [teori('Droger & narkotika i trafiken', 142)],
    tags: ['droger'],
    related: ['mns-021'],
  },
  {
    id: 'mns-023',
    category: 'alkohol',
    subcategory: 'droger-lakemedel',
    difficulty: 3,
    ruleTested: 'Alkohol kombinerat med läkemedel',
    prompt:
      'Du har tagit en receptfri medicin som varnar för trötthet, och druckit ett glas vin. Hur bedöms kombinationen?',
    answers: [
      ok('Effekterna kan förstärka varandra så att påverkan blir större än summan av delarna.'),
      no('Effekterna tar ut varandra om mängderna är små.', 'kombination-alkohol-lakemedel'),
      no('Endast alkoholen räknas, eftersom medicinen är receptfri.', 'kombination-alkohol-lakemedel'),
      no('Kombinationen är ofarlig under gränsvärdet 0,2 promille.', 'kombination-alkohol-lakemedel'),
    ],
    short:
      'Kombinationen är svår att förutse och ofta kraftigare än väntat. Varningstexten på förpackningen gäller även vid små mängder alkohol.',
    deep:
      'Varningstriangeln på förpackningen är satt för läkemedlet ensamt. Tillsammans med alkohol kan effekten bli kraftigare än vad någon av dem ger var för sig, och hur mycket kraftigare går inte att räkna ut i förväg.',
    sources: [teori('Läkemedel & mediciner i trafiken', 141), lmv(), tbl('4 §')],
    tags: ['lakemedel', 'alkohol'],
    related: ['mns-020'],
  },

  /* ================= Trötthet ================= */
  {
    id: 'mns-024',
    category: 'trotthet',
    subcategory: 'trotthet',
    difficulty: 3,
    ruleTested: 'Sömnbrist jämfört med alkohol',
    prompt: 'Hur påverkas reaktionstiden av en natt utan sömn?',
    answers: [
      ok('Den försämras till ungefär samma nivå som hos en rattfull förare.'),
      no('Den försämras något, men mindre än av en enda öl.', 'somnbrist-alkohol'),
      no('Den påverkas inte om man är van vid lite sömn.', 'somnbrist-alkohol'),
      no('Den försämras bara efter två nätter utan sömn.', 'somnbrist-alkohol'),
    ],
    short:
      'En natt utan sömn ger en reaktionstid i klass med rattfylleri. Det är dessutom förbjudet och straffbart att köra när tröttheten gör körningen otrygg.',
    sources: [teori('Trötthet', 148), trf('3 kap. 1 §')],
    tags: ['trotthet'],
  },
  {
    id: 'mns-025',
    category: 'trotthet',
    subcategory: 'trotthet',
    difficulty: 2,
    ruleTested: 'Monotoni som trötthetsorsak',
    prompt: 'Vilken vägtyp ökar risken för trötthet mest?',
    answers: [
      ok('Breda, långa och raka vägar utan avbrott.'),
      no('Kurviga landsvägar med varierande sikt.', 'monotoni'),
      no('Tätortsgator med många korsningar.', 'monotoni'),
      no('Smala grusvägar.', 'monotoni'),
    ],
    short:
      'Monotoni är en egen trötthetsorsak: enformig väg, motorljud och däckbuller tillsammans. Just den vägtyp som känns lättast att köra på är den som söver.',
    sources: [teori('Orsaker till trötthet', 148)],
    tags: ['trotthet'],
  },
  {
    id: 'mns-026',
    category: 'trotthet',
    subcategory: 'trotthet',
    difficulty: 2,
    ruleTested: 'Trötthetssignaler',
    prompt: 'Vilket av följande är ett tidigt tecken på att du håller på att bli farligt trött?',
    answers: [
      ok('Att du får svårt att hålla jämn hastighet.'),
      no('Att du blir varm och svettig.', 'trotthetssignaler'),
      no('Att du börjar köra närmare bilen framför.', 'trotthetssignaler'),
      no('Att musiken känns för hög.', 'trotthetssignaler'),
    ],
    short:
      'Ojämn hastighet, suddig blick, täta gäspningar, torr mun och att man blir frusen hör till signalerna. De kommer före mikrosömnen.',
    deep:
      'Senare tecken är tungt huvud, överreaktioner och synvillor. Har du kommit dit är marginalen redan borta — signalerna ska agera på när de fortfarande är milda.',
    sources: [teori('Trötthetssignaler', 149)],
    tags: ['trotthet'],
    related: ['mns-024'],
  },
  {
    id: 'mns-027',
    category: 'trotthet',
    subcategory: 'trotthet',
    difficulty: 2,
    ruleTested: 'Mikrosömn',
    prompt:
      'Du kör på motorväg och "tappar" plötsligt några sekunder utan att minnas vägen. Vad har troligen hänt?',
    answers: [
      ok('Mikrosömn — hjärnan har kopplat bort under några sekunder utan att du märkt det.'),
      no('Tunnelseende på grund av hög fart.', 'mikrosomn'),
      no('En kortvarig svimning som kräver läkarkontakt.', 'mikrosomn'),
      no('Normal automatiserad körning som inte är farlig.', 'mikrosomn'),
    ],
    short:
      'Mikrosömn varar några sekunder. I 110 km/h är fem sekunder drygt 150 meter körda utan förare.',
    deep:
      'Det farliga är att den inte känns som sömn efteråt — bara som ett minneshål. Har det hänt en gång är nästa episod nära, och den enda åtgärden är att stanna och sova.',
    type: 'situational-judgement',
    sources: [teori('Faror & risker', 150)],
    tags: ['trotthet', 'motorvag'],
  },

  /* ================= Barn ================= */
  {
    id: 'mns-028',
    category: 'risker',
    subcategory: 'barn-och-oskyddade',
    difficulty: 2,
    ruleTested: 'Barns sinnen',
    prompt: 'Vad skiljer ett barns sinnen från en vuxens i trafiken?',
    answers: [
      ok('Barnet tar längre tid på sig att växla mellan när- och fjärrseende och har svårare att avgöra varifrån ett ljud kommer.'),
      no('Barnet ser skarpare men hör sämre.', 'barns-sinnen'),
      no('Barnet har smalare synfält men snabbare reaktion.', 'barns-sinnen'),
      no('Det finns ingen mätbar skillnad före tio års ålder.', 'barns-sinnen'),
    ],
    short:
      'Sinnena är inte färdigutvecklade. Det gör att barnets reaktionstid kan vara betydligt längre än man förväntar sig.',
    sources: [teori('Sinnena är inte färdigutvecklade', 169)],
    tags: ['barn', 'oskyddade'],
  },
  {
    id: 'mns-029',
    category: 'risker',
    subcategory: 'barn-och-oskyddade',
    difficulty: 2,
    ruleTested: 'Barns riskbedömning',
    prompt: 'Hur bedömer ett litet barn en bil som närmar sig?',
    answers: [
      ok('Ungefär likadant oavsett fart — en långsam bil och en snabb bedöms på samma sätt.'),
      no('Barnet överskattar farten och blir därför onödigt försiktigt.', 'barns-riskbedomning'),
      no('Barnet bedömer fart lika bra som vuxna men avstånd sämre.', 'barns-riskbedomning'),
      no('Barnet undviker vägen helt om bilen kör fort.', 'barns-riskbedomning'),
    ],
    short:
      'Förmågan att beräkna risk är inte färdig. Ett barn kan gå ut framför en bil i hög fart lika gärna som framför en som nästan står still.',
    deep:
      'Det går att lära ett barn att stanna vid kanten, men inte att få barnet att förstå varför. När leken tar vid faller instruktionen bort.',
    sources: [teori('Oförmögna att förutse risker', 169)],
    tags: ['barn', 'oskyddade'],
    related: ['mns-028'],
  },
  {
    id: 'mns-030',
    category: 'risker',
    subcategory: 'barn-och-oskyddade',
    difficulty: 2,
    ruleTested: 'Barn bakom parkerade fordon',
    prompt:
      'Varför är en rad parkerade bilar farligare när det finns barn i området än när det bara finns vuxna?',
    answers: [
      ok('Ett barn kan döljas helt bakom en bil, så du får ingen förvarning alls.'),
      no('Barn rör sig snabbare än vuxna.', 'barn-skymd'),
      no('Barn hör inte motorljud.', 'barn-skymd'),
      no('Barn går oftare i vägbanan än på trottoaren.', 'barn-skymd'),
    ],
    short:
      'En vuxen syns oftast över eller bredvid en parkerad bil. Ett barn syns inte alls förrän det står i gatan.',
    type: 'situational-judgement',
    sources: [teori('Barn är små', 169)],
    tags: ['barn', 'skymd-sikt'],
  },
  {
    id: 'mns-031',
    category: 'risker',
    subcategory: 'barn-och-oskyddade',
    difficulty: 3,
    ruleTested: 'Ögonkontakt med barn',
    prompt:
      'Ett barn står stilla vid kanten och tittar rakt på dig. Hur mycket säger det om vad barnet kommer att göra?',
    answers: [
      ok('Nästan ingenting — ropar en kompis på andra sidan kan barnet springa ut direkt.'),
      no('Att barnet har uppfattat bilen och kommer att vänta.', 'barn-ogonkontakt'),
      no('Att barnet väntar på ett tecken från dig.', 'barn-ogonkontakt'),
      no('Att barnet är van vid trafik och därför förutsägbart.', 'barn-ogonkontakt'),
    ],
    short:
      'Lekens regler går före trafikens. Ögonkontakt är ingen överenskommelse med ett barn.',
    type: 'situational-judgement',
    sources: [teori('Lekande och impulsiva', 168), trf('3 kap. 1 §')],
    tags: ['barn', 'oskyddade'],
    related: ['mns-029'],
  },
  {
    id: 'mns-032',
    category: 'risker',
    subcategory: 'barn-och-oskyddade',
    difficulty: 2,
    ruleTested: 'Barn vid bussar',
    prompt:
      'Du passerar en buss som står vid en hållplats i en tätort. Var är risken störst?',
    answers: [
      ok('Framför bussen, där någon kan kliva ut utan att se dig.'),
      no('Bakom bussen, där påstigande samlas.', 'barn-buss'),
      no('I bussens blindzon till vänster.', 'barn-buss'),
      no('Vid bussens bakre hjulpar.', 'barn-buss'),
    ],
    short:
      'Både barn och vuxna springer ut mellan eller framför bussar. Framför bussen är sikten sämst åt båda håll.',
    sources: [teori('Barn', 168)],
    tags: ['barn', 'skymd-sikt'],
  },

  /* ================= Vilt ================= */
  {
    id: 'mns-033',
    category: 'risker',
    subcategory: 'djur-pa-vagen',
    difficulty: 2,
    ruleTested: 'När viltrisken är störst',
    prompt: 'När på dygnet är risken för vilt på vägen störst?',
    answers: [
      ok('I gryning och skymning.'),
      no('Mitt på dagen när djuren är mest aktiva.', 'vilt-tidpunkt'),
      no('Vid midnatt, när trafiken är gles.', 'vilt-tidpunkt'),
      no('Risken är jämn över dygnet.', 'vilt-tidpunkt'),
    ],
    short:
      'Gryning och skymning är värst. Risken är dessutom högre i maj–juni och september–oktober, vid öppna fält, nära vattendrag och där viltstängsel börjar eller slutar.',
    sources: [teori('Störst risk för vilt på vägen', 177)],
    tags: ['vilt', 'landsvag'],
  },
  {
    id: 'mns-034',
    category: 'risker',
    subcategory: 'djur-pa-vagen',
    difficulty: 3,
    ruleTested: 'Undanmanöver vid älg',
    prompt:
      'En älg har börjat gå över vägen framför dig och du måste välja åt vilket håll du väjer. Vad är bäst?',
    answers: [
      ok('Styra bakom älgen — den fortsätter sannolikt åt det håll den redan går.'),
      no('Styra framför älgen, som troligen vänder tillbaka.', 'alg-undanmanover'),
      no('Hålla kursen rakt fram och tuta.', 'alg-undanmanover'),
      no('Väja åt höger oavsett var älgen befinner sig.', 'alg-undanmanover'),
    ],
    short:
      'En älg som börjat gå över fortsätter oftast över. Sikta bakom den.',
    deep:
      'Älgolyckan är den farligaste viltolyckan: kroppen väger omkring 700 kg och sitter i vindrutans höjd, så vid en frontalkrock pressas älgen in mot kupén.',
    sources: [teori('Älgolyckor', 177)],
    tags: ['vilt', 'landsvag'],
  },
  {
    id: 'mns-035',
    category: 'risker',
    subcategory: 'djur-pa-vagen',
    difficulty: 2,
    ruleTested: 'Efter en viltolycka',
    prompt:
      'Du har kört på ett rådjur som skadats och sprungit in i skogen. Vad är du skyldig att göra?',
    answers: [
      ok('Märka ut olycksplatsen och kontakta polisen.'),
      no('Ingenting, eftersom djuret lämnade platsen av egen kraft.', 'viltolycka-atgard'),
      no('Endast anmäla skadan till ditt försäkringsbolag.', 'viltolycka-atgard'),
      no('Följa efter djuret för att bedöma skadorna.', 'viltolycka-atgard'),
    ],
    short:
      'Markeringen gör att jägare kan spåra det skadade djuret. Kontakt med polisen är obligatorisk vid större vilt.',
    deep:
      'Varna först andra trafikanter med varningsblinkers och varningstriangel. Har djuret dött ska du om möjligt flytta det från vägbanan.',
    sources: [teori('Att göra om du kör på ett större djur', 177)],
    tags: ['vilt', 'olycka'],
    related: ['mns-034'],
  },

  /* ================= Riskbedömning ================= */
  {
    id: 'mns-036',
    category: 'risker',
    subcategory: 'riskbedomning',
    difficulty: 3,
    ruleTested: 'Riskkompensation',
    prompt:
      'Du byter till en bil med vinterdäck, ABS och antisladdsystem. Vad är den vanligaste följden?',
    answers: [
      ok('Att man omedvetet kör lite fortare och tar ut en del av säkerhetsvinsten i tempo.'),
      no('Att säkerhetsmarginalen ökar i motsvarande grad.', 'riskkompensation'),
      no('Att bromssträckan blir kortare på is.', 'riskkompensation'),
      no('Att man kör långsammare eftersom systemen känns ovana.', 'riskkompensation'),
    ],
    short:
      'Bättre utrustning tenderar att ätas upp av högre fart. Vinsten blir verklig först om körsättet lämnas oförändrat.',
    deep:
      'ABS förkortar dessutom inte bromssträckan på is — det bevarar styrförmågan under inbromsningen, vilket är något annat.',
    sources: [general('Trafiksäkerhetsforskning: riskkompensation'), teori('Vinter', 124)],
    tags: ['riskbedomning', 'halka'],
  },
  {
    id: 'mns-037',
    category: 'risker',
    subcategory: 'riskbedomning',
    difficulty: 3,
    ruleTested: 'Tillbud som felaktig bekräftelse',
    prompt:
      'Du har flera gånger kört om strax före ett backkrön och det har alltid gått bra. Hur bör det påverka din bedömning?',
    answers: [
      ok('Inte alls — att det gått bra säger något om turen, inte om marginalen.'),
      no('Det visar att din bedömning av sikten är tillförlitlig.', 'utfall-vs-beslut'),
      no('Det betyder att sträckan är säkrare än den ser ut.', 'utfall-vs-beslut'),
      no('Det ger erfarenhet som gör manövern mindre riskabel.', 'utfall-vs-beslut'),
    ],
    short:
      'Ett bra utfall bevisar inte ett bra beslut. Vid omkörning före ett backkrön avgörs utgången av om någon kom, inte av hur du körde.',
    memory: 'Att det gick bra är inte samma sak som att det var säkert.',
    sources: [teori('Sannolikhetsinlärning', 134), trf('3 kap. 36 §')],
    tags: ['riskbedomning', 'omkorning'],
    related: ['mns-003'],
  },
  {
    id: 'mns-038',
    category: 'risker',
    subcategory: 'riskbedomning',
    difficulty: 2,
    ruleTested: 'Rutin och uppmärksamhet',
    prompt:
      'Du kör samma sträcka till jobbet varje dag. Vilken risk följer med rutinen?',
    answers: [
      ok('Att uppmärksamheten sjunker eftersom du förväntar dig det du brukar se.'),
      no('Att du kör långsammare än trafikrytmen.', 'rutin-uppmarksamhet'),
      no('Att bilen slits mer på kända vägar.', 'rutin-uppmarksamhet'),
      no('Ingen — rutin gör körningen säkrare.', 'rutin-uppmarksamhet'),
    ],
    short:
      'Förväntan styr vad vi ser. På en välkänd sträcka letar hjärnan efter det vanliga och missar lättare det ovanliga.',
    type: 'situational-judgement',
    sources: [teori('Sannolikhetsinlärning', 134)],
    tags: ['riskbedomning', 'uppmarksamhet'],
  },
  {
    id: 'mns-039',
    category: 'manniskan',
    subcategory: 'reaktion-och-sinnen',
    difficulty: 2,
    ruleTested: 'Mobiltelefon och uppmärksamhet',
    prompt:
      'Varför räcker det inte med handsfree för att ta bort risken med att tala i telefon under körning?',
    answers: [
      ok('Samtalet tar kognitiv kapacitet, så du ser mindre av det du tittar på.'),
      no('Handsfree tar bort risken helt om samtalet är kort.', 'handsfree'),
      no('Risken sitter enbart i att en hand är upptagen.', 'handsfree'),
      no('Ljudkvaliteten gör att du måste höja rösten.', 'handsfree'),
    ],
    short:
      'Det farliga är uppmärksamheten, inte handen. Blicken kan vara riktad framåt utan att informationen bearbetas.',
    deep:
      'Lagen kräver att mobilen inte hanteras på ett sätt som inverkar menligt på körningen. Men även ett lagligt samtal minskar den mängd trafik du faktiskt registrerar.',
    type: 'situational-judgement',
    sources: [trf('4 kap. 10 e §'), tsv('Mobiltelefon i trafiken')],
    tags: ['uppmarksamhet', 'distraktion'],
  },
  {
    id: 'mns-040',
    category: 'manniskan',
    subcategory: 'reaktion-och-sinnen',
    difficulty: 3,
    ruleTested: 'Blicktid och sträcka',
    prompt:
      'Du tittar ner på navigationen i två sekunder i 90 km/h. Ungefär hur långt kör du under tiden?',
    answers: [
      ok('Ungefär 50 meter.'),
      no('Ungefär 25 meter.', 'blicktid-strackan'),
      no('Ungefär 10 meter.', 'blicktid-strackan'),
      no('Ungefär 90 meter.', 'blicktid-strackan'),
    ],
    short:
      '90 km/h är 25 meter i sekunden. Två sekunders blick nedåt är alltså femtio meter körda utan att du sett vägen.',
    type: 'calculation',
    sources: [tvk(), teori('Km/h omräknat till meter per sekund', 103)],
    tags: ['uppmarksamhet', 'berakning'],
    related: ['mns-039'],
  },
];

export const manniskan2Questions = buildQuestions(seeds);
