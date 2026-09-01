import { buildQuestions, no, ok, teori, trf, vmf } from './authoring';
import type { AuthoredQuestion } from './authoring';

/**
 * Bildfrågor — questions built on licensed source photographs.
 *
 * Every question here fails without the picture. That is the entry test: if
 * the same thing can be asked in words, it belongs in one of the other files.
 * What the photographs add is the step the theory book cannot teach in prose —
 * reading a real street, finding the sign that decides the rule, and noticing
 * what is *absent*.
 *
 * Attribution and the accessible description live in the source-image
 * registry, never here.
 */

const seeds: AuthoredQuestion[] = [
  /* ---- Körfält ---------------------------------------------------------- */
  {
    id: 'bld-001',
    category: 'hastighet',
    subcategory: 'placering',
    difficulty: 3,
    ruleTested: 'Körfältsval enligt körfältsvägvisare',
    prompt:
      'Du ska mot Göteborg och kör i körfält B. Vad säger körfältsvägvisaren om ditt körfältsval här?',
    sourceImageId: 'korfaltsval-motorvag',
    answers: [
      ok('Körfälten leder till olika mål, så du får välja det körfält som passar din fortsatta färd.'),
      no('Du måste ligga i det högra körfältet, eftersom hastigheten är 80 km/h.', 'vagvisare-undantag'),
      no('Du måste byta till körfält D, eftersom det är längst till höger.', 'vagvisare-undantag'),
      no('Körfältsvägvisaren gäller bara tung trafik.', 'vagvisare-undantag'),
    ],
    short:
      'Vägvisaren visar att det högra körfältet leder till en avfart medan de övriga fortsätter mot Göteborg. Då gäller undantaget om olika färdmål.',
    deep:
      'Grundregeln är högra körfältet, och vid 80 km/h gäller inte undantaget om två markerade körfält och högst 70 km/h. Men det andra undantaget gäller: när körfälten leder till olika färdmål enligt en körfältsvägvisare får du välja det som passar din resa. Skulle alla fyra körfälten peka mot samma mål vore svaret det motsatta — då skulle du tillbaka åt höger.',
    memory: 'Olika mål på vägvisaren = fritt val av körfält.',
    sources: [trf('3 kap. 7 §'), vmf('2 kap. F8'), teori('Vilket körfält du ska välja', 16)],
    tags: ['bild', 'korfalt'],
    related: ['krf-006'],
  },

  /* ---- Väjningsregler ---------------------------------------------------- */
  {
    id: 'bld-002',
    category: 'korsningar',
    subcategory: 'stopplikt',
    difficulty: 2,
    ruleTested: 'Tilläggstavlan Flervägsstopp',
    prompt: 'Vad innebär tilläggstavlan under stoppmärket på bilden?',
    sourceImageId: 'stop-flervagsstopp',
    answers: [
      ok('Att alla tillfarter till korsningen har stopplikt.'),
      no('Att du har stopplikt flera gånger längs vägen.', 'flervagsstopp'),
      no('Att stopplikten gäller i flera körfält på din egen väg.', 'flervagsstopp'),
      no('Att du får köra vidare utan att stanna om ingen annan syns.', 'flervagsstopp'),
    ],
    short:
      'Flervägsstopp betyder att varje tillfart till korsningen har stopplikt — inte att du slipper stanna.',
    deep:
      'Tavlan är en upplysning, inte en lättnad. Du ska fortfarande stanna helt vid stopplinjen. Att veta att även de andra har stopplikt hjälper dig däremot att förutse hur korsningen kommer att avvecklas: den som stannat först kör först, och sedan turas man om.',
    sources: [vmf('2 kap. B2'), trf('3 kap. 21 §'), teori('Väjningsregler', 21)],
    tags: ['bild', 'vagmarke'],
  },
  {
    id: 'bld-003',
    category: 'korsningar',
    subcategory: 'stopplikt',
    difficulty: 2,
    ruleTested: 'Stopplikt i praktiken',
    prompt:
      'Du närmar dig korsningen på bilden. Bussen har passerat och vägen är fri åt båda håll. Vad gäller?',
    sourceImageId: 'stopplikt-buss',
    answers: [
      ok('Du måste stanna helt vid stopplinjen, även om vägen är fri.'),
      no('Du får rulla vidare eftersom ingen korsande trafik finns kvar.', 'stopplikt-rullstopp'),
      no('Du får köra om du saktat ner till gångfart.', 'stopplikt-rullstopp'),
      no('Stopplikten gäller bara när sikten är skymd.', 'stopplikt-rullstopp'),
    ],
    short:
      'Stopplikt betyder stillastående fordon. Att vägen är fri ändrar ingenting — det är därför märket finns i stället för väjningsplikt.',
    memory: 'Stopplikt = hjulen står still.',
    sources: [vmf('2 kap. B2'), trf('3 kap. 21 §'), teori('Väjningsregler', 24)],
    tags: ['bild', 'stopplikt'],
  },
  {
    id: 'bld-004',
    category: 'korsningar',
    subcategory: 'hogerregeln',
    difficulty: 2,
    ruleTested: 'Att läsa av en korsning',
    prompt:
      'Titta på korsningen. Vilket är det viktigaste du behöver kontrollera innan du avgör vem som ska köra först?',
    sourceImageId: 'oskyltad-korsning',
    answers: [
      ok('Om det finns något vägmärke, någon vägmarkering eller någon signal som ersätter högerregeln.'),
      no('Vilken av gatorna som är bredast.', 'bredaste-vagen'),
      no('Vilken av gatorna som har mest trafik.', 'bredaste-vagen'),
      no('Vem som kom fram till korsningen först.', 'bredaste-vagen'),
    ],
    short:
      'Leta efter märken och signaler först. Finns inget av det gäller högerregeln — oavsett hur gatorna ser ut.',
    deep:
      'Vägens bredd, beläggning och trafikmängd betyder ingenting för väjningsplikten. Det är lätt att tolka en bredare gata som en huvudled, men huvudled kräver ett märke. Saknas märke, markering och signal är svaret alltid högerregeln.',
    sources: [trf('3 kap. 18 §'), teori('Väjningsregler', 31)],
    tags: ['bild', 'hogerregeln'],
  },
  {
    id: 'bld-005',
    category: 'korsningar',
    subcategory: 'vajningsplikt',
    difficulty: 2,
    ruleTested: 'Tunga fordon i korsning',
    prompt:
      'Lastbilen på bilden är på väg in i korsningen framför dig. Vad bör du särskilt räkna med?',
    sourceImageId: 'lastbil-korsar',
    answers: [
      ok('Att den behöver betydligt längre tid för att komma igenom korsningen än en personbil.'),
      no('Att den kan stanna lika snabbt som du om något händer.', 'tungt-fordon-tid'),
      no('Att den alltid har väjningsplikt mot personbilar.', 'tungt-fordon-tid'),
      no('Att den svänger snävare än en personbil.', 'tungt-fordon-tid'),
    ],
    short:
      'Ett långt och tungt fordon accelererar sämre, bromsar sämre och är kvar i korsningen längre. Marginalen du behöver är större än den ser ut.',
    deep:
      'Väglaget på bilden är dessutom vinterväg, vilket förlänger lastbilens bromssträcka ytterligare. Att ha formell rätt hjälper inte om motparten inte kan stanna — aktsamhetsplikten gäller även när du har företräde.',
    sources: [trf('2 kap. 1 §'), teori('Väjningsregler', 34)],
    tags: ['bild', 'risk'],
  },

  /* ---- Passager ---------------------------------------------------------- */
  {
    id: 'bld-006',
    category: 'trafikregler',
    subcategory: 'oskyddade-trafikanter',
    difficulty: 2,
    ruleTested: 'Obevakat övergångsställe',
    prompt:
      'Den röda pilen pekar på en person vid vägkanten intill övergångsstället. Vad gäller för dig?',
    sourceImageId: 'obevakat-overgangsstalle',
    answers: [
      ok('Du har väjningsplikt och ska sänka farten eller stanna i god tid.'),
      no('Du har väjningsplikt först när personen gått ut på övergångsstället.', 'overgang-just-ska-ga'),
      no('Personen ska vänta tills körbanan är fri.', 'overgang-just-ska-ga'),
      no('Du kan hålla farten eftersom det finns en bil framför dig som skymmer.', 'overgang-just-ska-ga'),
    ],
    short:
      'Väjningsplikten omfattar den som just ska gå ut, inte bara den som redan står på övergångsstället.',
    sources: [trf('3 kap. 61 §'), teori('Obevakat övergångsställe', 47)],
    tags: ['bild', 'oskyddade'],
    related: ['pas-001'],
  },
  {
    id: 'bld-007',
    category: 'trafikregler',
    subcategory: 'cykelpassage-overfart',
    difficulty: 3,
    ruleTested: 'Att skilja cykelöverfart från cykelpassage',
    prompt:
      'Vad på bilden visar att det här är en cykelöverfart och inte en cykelpassage?',
    sourceImageId: 'cykeloverfart',
    answers: [
      ok('Vägmärket för cykelöverfart tillsammans med väjningslinjen för biltrafiken.'),
      no('De målade rutorna tvärs över vägbanan.', 'passage-vs-overfart'),
      no('Att den ligger strax före en cirkulationsplats.', 'passage-vs-overfart'),
      no('Att vägbanan är upphöjd på platsen.', 'passage-vs-overfart'),
    ],
    short:
      'Rutorna finns vid båda. Det är vägmärket och väjningslinjen som gör skillnaden — och som ger dig full väjningsplikt.',
    deep:
      'Upphöjningen är inte heller beviset, även om en cykelöverfart ska vara utformad så att det inte är lämpligt att köra fortare än 30 km/h. Leta efter märket och triangelraden i vägbanan: finns de är det en överfart, saknas de är det en passage.',
    memory: 'Rutor räcker inte. Märke plus väjningslinje avgör.',
    sources: [vmf('2 kap. B8'), trf('3 kap. 61 b §'), teori('Cykelöverfart', 52)],
    tags: ['bild', 'cykel'],
    related: ['pas-014'],
  },
  {
    id: 'bld-008',
    category: 'trafikregler',
    subcategory: 'cykelpassage-overfart',
    difficulty: 3,
    ruleTested: 'Bruten cykelbana',
    prompt:
      'Cykelbanan är markerad med A på ena sidan och B på andra sidan av korsningen. Vad innebär det?',
    sourceImageId: 'cykelbana-korsning',
    answers: [
      ok('Cykelbanan är bruten och korsar alltså inte körbanan.'),
      no('Cykelbanan är obruten, så du har väjningsplikt mot cyklisterna.', 'cykelbana-korsning'),
      no('A och B markerar två olika cykelbanor med olika riktning.', 'cykelbana-korsning'),
      no('Cyklister får korsa körbanan var som helst mellan A och B.', 'cykelbana-korsning'),
    ],
    short:
      'Cykelbanan slutar vid A och börjar igen vid B. Däremellan finns ingen cykelbana, och alltså ingen cykelbana att korsa.',
    deep:
      'Det är svårt att avgöra i verkligheten, eftersom en obruten cykelbana saknar standardiserad utformning. En användbar ledtråd: ser du vägmarkeringen för cykelpassage eller cykelöverfart är cykelbanan alltid bruten. Är du osäker — handla på det säkraste sättet och släpp hellre fram en gång för mycket.',
    sources: [trf('3 kap. 61 §'), teori('Förtydligande om att korsa en cykelbana', 53)],
    tags: ['bild', 'cykel'],
    related: ['pas-015'],
  },
  {
    id: 'bld-009',
    category: 'trafikregler',
    subcategory: 'cykelpassage-overfart',
    difficulty: 2,
    ruleTested: 'Övergångsställe kombinerat med cykelpassage',
    prompt:
      'På bilden ligger ett övergångsställe och en cykelpassage bredvid varandra. Vad gäller om en gående och en cyklist samtidigt närmar sig?',
    sourceImageId: 'overgangsstalle-cykelpassage',
    answers: [
      ok('Du har väjningsplikt mot den gående, och ska anpassa hastigheten så att ingen fara uppstår för cyklisten.'),
      no('Du har väjningsplikt mot båda på samma sätt.', 'passage-vs-overfart'),
      no('Du har väjningsplikt mot cyklisten men inte mot den gående.', 'passage-vs-overfart'),
      no('Ingen av dem har företräde eftersom passagerna är obevakade.', 'passage-vs-overfart'),
    ],
    short:
      'Samma plats, två olika skyldigheter: full väjningsplikt mot gående på övergångsstället, anpassad hastighet mot cyklist på cykelpassagen.',
    deep:
      'Att de ligger intill varandra är vanligt och är precis det som gör situationen svår. Praktiskt är rådet enkelt: låt båda passera. Men på provet är skillnaden i formulering — "väjningsplikt" mot "anpassa hastigheten" — det som prövas.',
    sources: [trf('3 kap. 61 §'), trf('3 kap. 61 a §'), teori('Cykelpassage', 52)],
    tags: ['bild', 'cykel', 'oskyddade'],
    related: ['pas-008'],
  },

  /* ---- Cirkulationsplats -------------------------------------------------- */
  {
    id: 'bld-010',
    category: 'korsningar',
    subcategory: 'cirkulationsplats',
    difficulty: 2,
    ruleTested: 'Väjningsplikt vid infart',
    prompt:
      'Du kör i pilens riktning mot infarten. Den gula bilen är redan inne i cirkulationen. Vad gäller?',
    sourceImageId: 'cirkulation-med-trafik',
    answers: [
      ok('Du har väjningsplikt mot den gula bilen.'),
      no('Den gula bilen ska väja, eftersom du kommer från höger.', 'cirk-vem-vajer'),
      no('Ni har lika stort ansvar att anpassa er efter varandra.', 'cirk-vem-vajer'),
      no('Du får köra in om du hinner före utan att den gula bilen behöver bromsa.', 'cirk-vem-vajer'),
    ],
    short:
      'Märkena vid infarten visar väjningsplikt och cirkulationsplats. Du väjer för varje fordon som redan cirkulerar.',
    sources: [trf('3 kap. 22 §'), vmf('2 kap. D3'), teori('Cirkulationsplats', 65)],
    tags: ['bild', 'cirkulation'],
    related: ['cir-001'],
  },
  {
    id: 'bld-011',
    category: 'korsningar',
    subcategory: 'cirkulationsplats',
    difficulty: 3,
    ruleTested: 'Cirkelformad korsning som inte är cirkulationsplats',
    prompt:
      'Korsningen på bilden är rund, men något saknas. Vilken väjningsregel gäller när du kör in här?',
    sourceImageId: 'rund-korsning-utan-skylt',
    answers: [
      ok('Högerregeln, eftersom märket för cirkulationsplats saknas.'),
      no('Väjningsplikt mot alla i cirkulationen, precis som i en cirkulationsplats.', 'cirk-utan-skylt'),
      no('Du har företräde, eftersom du kommer in på den större vägen.', 'cirk-utan-skylt'),
      no('Stopplikt, eftersom sikten runt mittön är skymd.', 'cirk-utan-skylt'),
    ],
    short:
      'Det är märket som gör en cirkulationsplats, inte formen. Utan märket och utan väjningspliktsskylt är det en vanlig korsning.',
    deep:
      'Skillnaden är stor i praktiken: i en cirkulationsplats väjer du för alla som redan är inne, i en vanlig rund korsning väjer du för trafik från höger. Leta efter det blå runda märket med tre pilar. Ett annat tecken är baksidan av en väjningspliktsskylt som gäller trafik från ett annat håll.',
    memory: 'Ingen D3-skylt, ingen cirkulationsplats.',
    sources: [vmf('2 kap. D3'), trf('3 kap. 18 §'), teori('Cirkelformad vägkorsning', 63)],
    tags: ['bild', 'cirkulation'],
    related: ['cir-008'],
  },

  /* ---- Parkering ---------------------------------------------------------- */
  {
    id: 'bld-012',
    category: 'parkering',
    subcategory: 'parkeringsregler',
    difficulty: 3,
    ruleTested: 'Att läsa tilläggstavlor vid parkering',
    prompt: 'Vad betyder den gula tavlan med röd ring och texten "Onsd 0–6" på bilden?',
    sourceImageId: 'p-skylt-avgift-boende',
    answers: [
      ok('Att det är förbjudet att parkera onsdagar mellan klockan 0 och 6.'),
      no('Att parkering är tillåten onsdagar mellan klockan 0 och 6.', 'gul-tavla-forbud'),
      no('Att avgiften gäller onsdagar mellan klockan 0 och 6.', 'gul-tavla-forbud'),
      no('Att boendeparkering endast gäller onsdagar 0 till 6.', 'gul-tavla-forbud'),
    ],
    short:
      'Gul botten med röd ring betyder förbud. Tiderna anger när förbudet gäller — här natten mot onsdag, ofta för gaturenhållning.',
    deep:
      'Tilläggstavlorna läses uppifrån och ner och gäller samtidigt: avgift 7–19 på vardagar, avgift 11–17 på lördagar, taxa 3, förbud natten mot onsdag, och boendeparkering. Det är kombinationen som avgör om du får stå — inte den översta tavlan ensam.',
    memory: 'Gul botten och röd ring = förbud, inte tillåtelse.',
    sources: [vmf('2 kap. T6'), teori('Stanna & parkera', 67)],
    tags: ['bild', 'parkering'],
  },
  {
    id: 'bld-013',
    category: 'parkering',
    subcategory: 'parkeringsregler',
    difficulty: 3,
    ruleTested: 'Tider inom parentes på tilläggstavla',
    prompt: 'På tavlan står "2 tim 9–18 (9–15)". Vad betyder siffrorna inom parentes?',
    sourceImageId: 'p-skylt-tidsbegransning',
    answers: [
      ok('Att tiderna gäller lördagar och dag före helgdag.'),
      no('Att tiderna gäller söndagar och helgdagar.', 'parentes-tider'),
      no('Att tiderna är en rekommendation och inte bindande.', 'parentes-tider'),
      no('Att tiderna gäller under sommarmånaderna.', 'parentes-tider'),
    ],
    short:
      'Svarta siffror gäller vardagar, siffror inom parentes gäller lördag och dag före helgdag, röda siffror gäller sön- och helgdag.',
    deep:
      'Systemet är detsamma på alla tilläggstavlor med tider, vilket gör det värt att lära sig en gång. På den här skylten gäller alltså två timmars parkering 9–18 på vardagar och 9–15 på lördagar. Den gula tavlan underst lägger dessutom på ett förbud torsdagar 7–9 under vinterhalvåret.',
    memory: 'Svart = vardag, parentes = lördag, rött = söndag.',
    sources: [vmf('2 kap. T6'), teori('Stanna & parkera', 75)],
    tags: ['bild', 'parkering'],
  },

  /* ---- Järnvägskorsning ---------------------------------------------------- */
  {
    id: 'bld-014',
    category: 'jarnvag',
    subcategory: 'plankorsning-omkorning',
    difficulty: 3,
    ruleTested: 'Omkörning vid plankorsning med bommar',
    prompt:
      'Plankorsningen på bilden har bommar. Får du köra om en personbil i samband med korsningen?',
    sourceImageId: 'plankorsning-bommar',
    answers: [
      ok('Ja. Bommarna upphäver omkörningsförbudet vid plankorsningen.'),
      no('Nej, omkörning är alltid förbjuden vid plankorsningar.', 'jvg-omkorning'),
      no('Nej, det krävs dessutom en trafiksignal med rött, gult och grönt.', 'jvg-omkorning'),
      no('Ja, men bara om bommarna är uppfällda.', 'jvg-omkorning'),
    ],
    short:
      'Antingen bommar eller en fullständig trafiksignal räcker för att upphäva förbudet — båda behövs inte.',
    deep:
      'Utan bommar och utan fullständig trafiksignal får du bara köra om tvåhjuliga fordon. Kryssmärket på bilden talar bara om att här finns en plankorsning; det är bommarna som avgör omkörningsfrågan.',
    sources: [trf('3 kap. 40 §'), teori('Omkörning vid plankorsning', 111)],
    tags: ['bild', 'plankorsning'],
    related: ['jvg-015'],
  },

  /* ---- Speciella gator ------------------------------------------------------ */
  {
    id: 'bld-015',
    category: 'vagmarken',
    subcategory: 'anvisningsmarken',
    difficulty: 2,
    ruleTested: 'Gångfartsområde',
    prompt: 'Du kör in på gatan på bilden. Vad gäller där?',
    sourceImageId: 'gangfartsomrade',
    answers: [
      ok('Gångfart, väjningsplikt mot gående och parkering endast på anvisade platser.'),
      no('Högsta hastighet 30 km/h och väjningsplikt mot gående.', 'gangfartsomrade-regler'),
      no('Gångfart, men gående har väjningsplikt mot fordon.', 'gangfartsomrade-regler'),
      no('Samma regler som på en vanlig gata inom tättbebyggt område.', 'gangfartsomrade-regler'),
    ],
    short:
      'I ett gångfartsområde gäller gångfart, cirka 7 km/h, väjningsplikt mot gående och parkeringsförbud utom på anvisade platser.',
    deep:
      'När du sedan kör ut från gångfartsområdet har du väjningsplikt. Märket känns igen på den blå fyrkanten med gående, hus och en bil — det är ett anvisningsmärke, inte ett hastighetsmärke.',
    memory: 'Gångfartsområde: du är gäst hos de gående.',
    sources: [vmf('2 kap. E9'), trf('8 kap. 1 §'), teori('Gångfartsområde', 116)],
    tags: ['bild', 'vagmarke'],
  },

  /* ---- Omkörning ------------------------------------------------------------ */
  {
    id: 'bld-016',
    category: 'omkorning',
    subcategory: 'omkorningsregler',
    difficulty: 3,
    ruleTested: 'Omkörningsbeslut på vinterväg',
    prompt:
      'Du ligger bakom det långsamma fordonet på bilden. Vad talar starkast emot att köra om just här?',
    sourceImageId: 'traktor-vintervag',
    answers: [
      ok('Snömodden i körfälten gör greppet oförutsägbart, särskilt när du korsar strängen i mitten.'),
      no('Att långsamtgående fordon aldrig får köras om.', 'omkorning-vinter'),
      no('Att vägen är rak, vilket ger för lite sikt.', 'omkorning-vinter'),
      no('Att traktorn kan öka farten under omkörningen.', 'omkorning-vinter'),
    ],
    short:
      'En omkörning kräver grepp för både acceleration och styrning. Snömodd mellan körfälten kan dra fordonet i sidled precis när du behöver stabilitet.',
    deep:
      'Sikten är faktiskt god här, och det är en del av fällan: den ena förutsättningen är uppfylld medan den andra inte är det. Väglaget avgör hur lång sträcka omkörningen tar och hur säkert återinträdet i ditt körfält blir.',
    sources: [trf('3 kap. 30 §'), teori('Omkörningar', 100)],
    tags: ['bild', 'omkorning', 'halka'],
  },
];

export const bildfragorQuestions = buildQuestions(seeds);
