import { buildQuestions, no, ok, teori, trf, vmf } from './authoring';
import type { AuthoredQuestion } from './authoring';

/**
 * Järnvägskorsningar (plankorsningar).
 *
 * The one place in traffic where a misjudgement meets several hundred tonnes
 * that cannot brake for you. The set is built around the three things that
 * actually decide the outcome: how far away the crossing is, how good the
 * sight is, and what you do when something goes wrong on the track.
 */

const seeds: AuthoredQuestion[] = [
  /* ---- Märken och signaler ------------------------------------------- */
  {
    id: 'jvg-001',
    category: 'jarnvag',
    subcategory: 'plankorsning-marken',
    difficulty: 1,
    ruleTested: 'Avstånd till plankorsning (A38)',
    prompt:
      'Du passerar ett avståndsmärke med tre snedställda markeringar före en plankorsning. Vad betyder det?',
    answers: [
      ok('Att du är längst bort från plankorsningen — det är det första av tre märken.'),
      no('Att du är närmast plankorsningen, eftersom tre streck betyder högsta beredskap.', 'jvg-avstandsmarken'),
      no('Att det finns tre spår att korsa.', 'jvg-avstandsmarken'),
      no('Att det är tre hundra meter kvar till korsningen.', 'jvg-avstandsmarken'),
    ],
    short:
      'Märkena räknar ner: tre markeringar först, sedan två, sedan en. Ett streck betyder att korsningen är nära.',
    deep:
      'Avståndsmärket A38 delar in sträckan till plankorsningen i tredjedelar. Märket med tre markeringar sitter längst bort, oftast under varningsmärket för järnvägskorsning. Två markeringar betyder två tredjedelars avstånd kvar, och en markering betyder att du är inne på den sista tredjedelen. Läs dem som en nedräkning, inte som en mängdangivelse.',
    memory: 'Många streck = långt kvar. Ett streck = strax framme.',
    sources: [vmf('2 kap. A38'), teori('Avstånd till järnvägskorsning', 109)],
    tags: ['vagmarke', 'plankorsning'],
  },
  {
    id: 'jvg-002',
    category: 'jarnvag',
    subcategory: 'plankorsning-marken',
    difficulty: 2,
    ruleTested: 'Ljussignal vid plankorsning',
    prompt:
      'Bommarna vid en plankorsning har börjat gå upp, men de röda lamporna blinkar fortfarande. Vad gäller?',
    answers: [
      ok('Du måste vänta. Du får inte köra förrän lamporna slutat blinka rött.'),
      no('Du får köra, eftersom bommarna är på väg upp.', 'jvg-bom-vs-lampa'),
      no('Du får köra om du först stannar helt och sedan kryper över.', 'jvg-bom-vs-lampa'),
      no('Du får köra om inget tåg syns åt något håll.', 'jvg-bom-vs-lampa'),
    ],
    short:
      'Det är lamporna som styr, inte bommarna. Blinkar det rött ska du stå kvar även om bommen är uppe.',
    deep:
      'Bommarna hinner ofta upp innan lamporna slocknar. Det är lätt att läsa den uppgående bommen som ett klartecken, men signalen är det som gäller — och en av de vanligaste orsakerna till att lamporna fortsätter blinka är att ytterligare ett tåg är på väg, ofta från andra hållet.',
    memory: 'Bommen är en grind. Lampan är beskedet.',
    sources: [trf('3 kap. 25 §'), teori('Olika typer av järnvägsbommar', 112)],
    tags: ['signal', 'plankorsning'],
  },
  {
    id: 'jvg-003',
    category: 'jarnvag',
    subcategory: 'plankorsning-marken',
    difficulty: 1,
    ruleTested: 'Helbom och halvbom',
    prompt: 'Vad är skillnaden mellan en helbom och en halvbom vid en plankorsning?',
    answers: [
      ok('Helbommen spärrar hela vägbanan, halvbommen bara din körriktning.'),
      no('Helbommen fälls automatiskt, halvbommen måste fällas av en vakt.', 'jvg-bomtyper'),
      no('Halvbommen används bara vid spårvägar, helbommen bara vid järnväg.', 'jvg-bomtyper'),
      no('Helbommen betyder att du måste stanna, halvbommen att du får köra försiktigt.', 'jvg-bomtyper'),
    ],
    short:
      'Helbom stänger av hela vägen. Halvbom stänger bara av din sida, så det finns fysiskt utrymme att köra runt — men det är förbjudet.',
    deep:
      'Att halvbommen lämnar en öppning är en konstruktionsdetalj, inte ett erbjudande. Öppningen finns för att ett fordon som redan hunnit ut på spåret ska kunna ta sig av. Att slingra sig förbi en fälld halvbom är både förbjudet och en av de vanligaste orsakerna till dödsolyckor i plankorsningar.',
    sources: [teori('Olika typer av järnvägsbommar', 112)],
    tags: ['plankorsning'],
  },
  {
    id: 'jvg-004',
    category: 'jarnvag',
    subcategory: 'plankorsning-marken',
    difficulty: 2,
    ruleTested: 'Plankorsning utan bommar',
    prompt:
      'Du närmar dig en plankorsning som varken har bommar eller ljussignal. Vad innebär det för dig?',
    answers: [
      ok('Att hela ansvaret för att bedöma om det är fritt ligger på dig.'),
      no('Att spåret är oanvänt, eftersom aktiva spår alltid har bommar eller signal.', 'jvg-passiv-korsning'),
      no('Att tåget alltid tutar innan det kommer, så du kan lita på hörseln.', 'jvg-passiv-korsning'),
      no('Att du har företräde, eftersom ingen anordning ger tåget företräde.', 'jvg-passiv-korsning'),
    ],
    short:
      'Saknas bommar och signal finns ingen teknik som varnar dig. Du måste själv skaffa sikt åt båda håll innan du kör ut.',
    deep:
      'En obevakad plankorsning är fortfarande ett trafikerat spår. Det enda som skyddar dig är att du saktar ner tillräckligt för att hinna se, och att du tittar åt båda håll — inte bara åt det håll du senast såg ett tåg komma ifrån.',
    sources: [trf('3 kap. 25 §'), teori('Hur man korsar en järnväg säkert', 109)],
    tags: ['plankorsning', 'risk'],
  },

  /* ---- Att korsa ------------------------------------------------------ */
  {
    id: 'jvg-005',
    category: 'jarnvag',
    subcategory: 'plankorsning-korning',
    difficulty: 2,
    ruleTested: 'Anpassning efter sikt vid plankorsning',
    prompt:
      'Du närmar dig en plankorsning där träd och en byggnad skymmer sikten längs spåret. Hur bör du köra?',
    answers: [
      ok('Stanna före korsningen, titta åt båda håll och kör sedan över.'),
      no('Håll farten uppe så att du är över spåret så kort tid som möjligt.', 'jvg-fart-over-sikt'),
      no('Sakta in lite och lita på att ett tåg skulle höras i tid.', 'jvg-fart-over-sikt'),
      no('Kör över i normal hastighet — vid dålig sikt är det tåget som ska sakta ner.', 'jvg-fart-over-sikt'),
    ],
    short:
      'Dålig sikt betyder stanna, titta och sedan köra. Fart kan inte ersätta information du inte har.',
    deep:
      'Ordningen är alltid densamma: bilda dig först en uppfattning om sikten, anpassa sedan hastigheten till den. God sikt kan betyda att du knappt behöver sakta ner. Halvbra sikt betyder sakta ner och växla ner. Dålig sikt betyder stanna. Att köra fort över ett spår du inte kan överblicka minskar bara tiden du är utsatt — det tar inte bort risken för att tåget redan är där.',
    memory: 'Sikten bestämmer farten, inte tvärtom.',
    sources: [teori('Hur man korsar en järnväg säkert', 109)],
    tags: ['plankorsning', 'risk'],
  },
  {
    id: 'jvg-006',
    category: 'jarnvag',
    subcategory: 'plankorsning-korning',
    difficulty: 2,
    ruleTested: 'Växelval vid plankorsning',
    prompt:
      'Du ska köra över en plankorsning med dålig sikt och har stannat före spåret. Varför är det olämpligt att växla mitt på spåret?',
    answers: [
      ok('Varje växling ökar risken för motorstopp just där du minst har råd med det.'),
      no('Det är förbjudet enligt lag att växla i en plankorsning.', 'jvg-vaxling'),
      no('Växellådan tar skada av spårens ojämnheter.', 'jvg-vaxling'),
      no('Det spelar ingen roll — motorstopp på spår är ändå ovanligt.', 'jvg-vaxling'),
    ],
    short:
      'Välj växel före spåret och behåll den tills bilen är helt över. En växling är ett tillfälle för motorn att dö.',
    deep:
      'Vid dålig sikt är rådet att köra över på ettans växel och växla upp först när hela bilen är på andra sidan. Ettan ger mest kraft och minst risk för att motorn ska stanna. Vid halvbra sikt växlar du ner före korsningen av samma skäl — kraften ska redan finnas där när du rullar ut på spåret.',
    sources: [teori('Hur man korsar en järnväg säkert', 109)],
    tags: ['plankorsning', 'teknik'],
  },
  {
    id: 'jvg-007',
    category: 'jarnvag',
    subcategory: 'plankorsning-korning',
    difficulty: 2,
    ruleTested: 'Köbildning vid plankorsning',
    prompt:
      'Trafiken framför dig står stilla och kön sträcker sig förbi en plankorsning. Signalen är släckt och inget tåg är på väg. Vad gäller?',
    answers: [
      ok('Du får inte köra in i korsningen förrän du säkert kan ta dig hela vägen över.'),
      no('Du får köra fram till spåret så länge signalen är släckt.', 'jvg-ko-over-spar'),
      no('Du får ställa dig på spåret om du är beredd att backa om ett tåg kommer.', 'jvg-ko-over-spar'),
      no('Du får köra fram, eftersom kön ändå kommer att röra på sig.', 'jvg-ko-over-spar'),
    ],
    short:
      'Kör aldrig in i en plankorsning om du riskerar att bli stående på spåret. Vänta tills bilen framför har flyttat sig tillräckligt.',
    deep:
      'Det här är den vanligaste situationen där bilar hamnar på spår: inte för att någon körde mot rött, utan för att någon körde fram i en kö och sedan inte kom vidare. Signalen som är släckt just nu säger ingenting om var du kommer att stå om trettio sekunder.',
    memory: 'Kör bara in om du vet att du kommer ut.',
    sources: [trf('3 kap. 25 §'), teori('Stopp mitt på spåret', 110)],
    tags: ['plankorsning', 'ko'],
  },
  {
    id: 'jvg-008',
    category: 'jarnvag',
    subcategory: 'plankorsning-korning',
    difficulty: 3,
    ruleTested: 'Motorstopp på spåret',
    prompt:
      'Bilen får motorstopp mitt på ett järnvägsspår och startar inte om. Bommarna har börjat fällas. Vad gör du?',
    answers: [
      ok('Får du inte bort bilen: se till att alla lämnar bilen och ring 112.'),
      no('Stannar i bilen och försöker starta om tills tåget syns.', 'jvg-stanna-i-bilen'),
      no('Går ut och försöker lyfta bommen så att den inte skadas.', 'jvg-stanna-i-bilen'),
      no('Väntar på att någon annan trafikant ska larma.', 'jvg-stanna-i-bilen'),
    ],
    short:
      'Bilen går att ersätta. Flytta den om du kan, men får du inte bort den — ut ur bilen och ring 112.',
    deep:
      'Försök först att flytta bilen: en manuellt växlad bil kan ofta knuffas fram några meter med startmotorn om du släpper kopplingen och vrider om nyckeln, och en automat eller helt död bil går att putta i friläge. Bommarna är gjorda av ett svagt material som går att köra igenom, så en bom är aldrig ett skäl att stanna kvar på spåret. Men i det ögonblick bilen inte går att flytta är den bara plåt.',
    memory: 'Flytta bilen — annars flytta dig själv.',
    sources: [teori('Stopp mitt på spåret', 110)],
    tags: ['plankorsning', 'nodlage'],
  },
  {
    id: 'jvg-009',
    category: 'jarnvag',
    subcategory: 'plankorsning-korning',
    difficulty: 1,
    ruleTested: 'Motorstopp på spåret',
    prompt:
      'Du står med motorstopp på ett spår och bommarna är fällda framför bilen. Kan du köra igenom bommen om motorn startar?',
    answers: [
      ok('Ja. Bommarna är gjorda av ett svagt material och ska köras igenom hellre än att du blir kvar.'),
      no('Nej, du måste vänta tills bommarna går upp av sig själva.', 'jvg-bom-hinder'),
      no('Nej, att skada en bom är skadegörelse och du blir ersättningsskyldig.', 'jvg-bom-hinder'),
      no('Ja, men bara om du först backar ut och kör runt bommen.', 'jvg-bom-hinder'),
    ],
    short:
      'Att stå kvar på spåret är alltid farligare än en trasig bom. Bommarna är konstruerade för att ge vika.',
    sources: [teori('Stopp mitt på spåret', 110)],
    tags: ['plankorsning', 'nodlage'],
  },
  {
    id: 'jvg-010',
    category: 'jarnvag',
    subcategory: 'plankorsning-korning',
    difficulty: 3,
    ruleTested: 'Bedömning av tågets hastighet',
    prompt:
      'Du står vid en obevakad plankorsning och ser ett tåg långt bort. Varför är det svårt att bedöma om du hinner över?',
    answers: [
      ok('Ett tåg som närmar sig rakt framifrån ändrar knappt storlek, vilket får det att verka långsammare och längre bort än det är.'),
      no('Tåg kör så sällan att hjärnan inte hinner reagera på dem.', 'jvg-tagets-fart'),
      no('Tåg saknar strålkastare, så avståndet går inte att uppskatta.', 'jvg-tagets-fart'),
      no('Det är inte svårt — ett tåg som syns är alltid tillräckligt långt bort.', 'jvg-tagets-fart'),
    ],
    short:
      'Ett stort föremål som kommer rakt emot dig ser ut att röra sig långsamt. Ser du ett tåg alls ska du stå kvar.',
    deep:
      'Samma synvilla gör att man underskattar farten hos mötande fordon i mörker. Vid en plankorsning är marginalen dessutom osymmetrisk: bedömer du fel om tåget hinner du inte korrigera, och tåget kan inte väja. Ett tåg i 160 km/h tillryggalägger drygt 44 meter i sekunden och har en bromssträcka på flera hundra meter.',
    memory: 'Ser du tåget — vänta.',
    sources: [teori('Hur man korsar en järnväg säkert', 109), trf('3 kap. 25 §')],
    tags: ['plankorsning', 'risk', 'sinnen'],
  },
  {
    id: 'jvg-011',
    category: 'jarnvag',
    subcategory: 'plankorsning-korning',
    difficulty: 2,
    ruleTested: 'Efter plankorsningen',
    prompt:
      'Du har precis kört över en plankorsning med ett fordon efter dig. Vad är viktigast direkt efter spåret?',
    answers: [
      ok('Att du fortsätter framåt och inte stannar direkt efter korsningen.'),
      no('Att du stannar och kontrollerar att bilen inte tagit skada av spåren.', 'jvg-stanna-efter'),
      no('Att du blinkar för att tacka bakomvarande.', 'jvg-stanna-efter'),
      no('Att du saktar ner kraftigt så att bakomvarande hinner över.', 'jvg-stanna-efter'),
    ],
    short:
      'Stannar du strax efter spåret riskerar du att fordonet bakom blir stående mitt i korsningen.',
    deep:
      'Plankorsningen är inte över för kön bakom dig förrän alla är igenom. Samma tanke som gäller när du kör in — kör bara in om du kommer ut — gäller åt andra hållet: lämna plats så att den bakom också kommer ut.',
    sources: [trf('3 kap. 25 §'), teori('Stopp mitt på spåret', 110)],
    tags: ['plankorsning'],
  },
  {
    id: 'jvg-012',
    category: 'jarnvag',
    subcategory: 'plankorsning-korning',
    difficulty: 3,
    ruleTested: 'Långsamma fordon vid plankorsning',
    prompt:
      'Du kör med en tungt lastad husvagn och närmar dig en plankorsning med god sikt. Vad förändras jämfört med att köra utan släp?',
    answers: [
      ok('Ekipaget är längre och accelererar sämre, så du behöver större luckor och en tidigare bedömning.'),
      no('Ingenting — reglerna för plankorsningar är desamma oavsett fordon.', 'jvg-slap-samma'),
      no('Du får köra långsammare över spåret eftersom släpet är tyngre.', 'jvg-slap-samma'),
      no('Du måste alltid stanna före spåret när du har släp.', 'jvg-slap-samma'),
    ],
    short:
      'Reglerna är desamma, men marginalerna är inte det. Ett långt ekipage behöver mer tid både för att komma igång och för att bli klart över.',
    deep:
      'Det som avgör är hur länge någon del av ekipaget befinner sig på spåret. Ett längre fordon som dessutom accelererar sämre är kvar i korsningen betydligt längre än en personbil — och det är den tiden, inte hastigheten på skylten, som är den verkliga risken.',
    sources: [teori('Hur man korsar en järnväg säkert', 109)],
    tags: ['plankorsning', 'slap'],
  },

  /* ---- Omkörning vid plankorsning ------------------------------------- */
  {
    id: 'jvg-013',
    category: 'jarnvag',
    subcategory: 'plankorsning-omkorning',
    difficulty: 2,
    ruleTested: 'Omkörningsförbud vid plankorsning',
    prompt:
      'Du närmar dig en plankorsning som varken har bommar eller trafiksignal. Får du köra om bilen framför?',
    answers: [
      ok('Nej, inte en bil. Endast tvåhjuliga fordon får köras om där.'),
      no('Ja, om sikten är fri och du hinner före korsningen.', 'jvg-omkorning'),
      no('Ja, omkörningsförbud gäller bara när bommarna är fällda.', 'jvg-omkorning'),
      no('Nej, all omkörning är förbjuden vid alla plankorsningar.', 'jvg-omkorning'),
    ],
    short:
      'Utan bommar och utan trafiksignal råder omkörningsförbud i samband med plankorsningen — men förbudet gäller inte tvåhjuliga fordon.',
    deep:
      'Förbudet upphävs om plankorsningen har bommar eller en riktig trafiksignal med rött, gult och grönt ljus. En anordning som bara blinkar rött räcker inte. Undantaget för tvåhjuliga fordon finns för att en omkörning av en cykel eller moped kräver mycket lite utrymme och tid.',
    memory: 'Bom eller riktig signal — annars bara tvåhjulingar.',
    sources: [trf('3 kap. 40 §'), teori('Omkörning vid plankorsning', 111)],
    tags: ['omkorning', 'plankorsning'],
  },
  {
    id: 'jvg-014',
    category: 'jarnvag',
    subcategory: 'plankorsning-omkorning',
    difficulty: 3,
    ruleTested: 'Vilken signal som upphäver omkörningsförbudet',
    prompt:
      'En plankorsning saknar bommar men har en signalanordning som blinkar rött när ett tåg närmar sig. Får du köra om en personbil där?',
    answers: [
      ok('Nej. Endast en trafiksignal med rött, gult och grönt ljus upphäver förbudet.'),
      no('Ja, en signalanordning räcker oavsett vilka ljus den har.', 'jvg-signaltyp'),
      no('Ja, så länge signalen inte blinkar just då.', 'jvg-signaltyp'),
      no('Nej, omkörning är förbjuden vid alla plankorsningar utan undantag.', 'jvg-signaltyp'),
    ],
    short:
      'Blinkande rött räcker inte. Det ska vara en fullständig trafiksignal — röd, gul och grön — för att omkörningsförbudet ska upphävas.',
    deep:
      'Skillnaden är inte formalia. En fullständig trafiksignal reglerar trafiken kontinuerligt och ger dig ett aktivt klartecken. En anordning som bara blinkar rött ger ingen information alls när den är släckt — den säger "inget tåg just nu", inte "det är fritt att köra om".',
    sources: [trf('3 kap. 40 §'), teori('Rätt typ av signal', 111)],
    tags: ['omkorning', 'plankorsning', 'signal'],
  },
  {
    id: 'jvg-015',
    category: 'jarnvag',
    subcategory: 'plankorsning-omkorning',
    difficulty: 2,
    ruleTested: 'Omkörning vid plankorsning med bommar',
    prompt:
      'En plankorsning har bommar men ingen trafiksignal. Vilka fordon får du köra om i samband med korsningen?',
    answers: [
      ok('Alla fordon — bommarna räcker för att upphäva omkörningsförbudet.'),
      no('Endast tvåhjuliga fordon.', 'jvg-omkorning'),
      no('Inga fordon, eftersom trafiksignal saknas.', 'jvg-omkorning'),
      no('Endast fordon som står stilla framför bommen.', 'jvg-omkorning'),
    ],
    short:
      'Bommar ensamma räcker. Antingen bommar eller en fullständig trafiksignal upphäver förbudet — båda behövs inte.',
    sources: [trf('3 kap. 40 §'), teori('Omkörningstabell', 111)],
    tags: ['omkorning', 'plankorsning'],
    related: ['jvg-013', 'jvg-014'],
  },
  {
    id: 'jvg-016',
    category: 'jarnvag',
    subcategory: 'plankorsning-marken',
    difficulty: 2,
    ruleTested: 'Varning för järnvägskorsning',
    prompt:
      'Vilket är det säkraste sättet att veta att du närmar dig en plankorsning innan du ser själva spåret?',
    answers: [
      ok('Varningsmärket för korsning med järnväg, ofta följt av avståndsmärken.'),
      no('Att vägen börjar luta uppåt strax före spåret.', 'jvg-forvarning'),
      no('Att hastighetsbegränsningen alltid sänks till 30 km/h.', 'jvg-forvarning'),
      no('Att det alltid finns en vägbula före korsningen.', 'jvg-forvarning'),
    ],
    short:
      'Varningsmärket kommer först, sedan avståndsmärkena som räknar ner. Det är förvarningen du ska agera på, inte spåret.',
    deep:
      'Att vänta med att bedöma sikten tills du ser rälsen är för sent vid en korsning med skymd sikt. Hela poängen med förvarningen är att du ska hinna bestämma dig för om det här är en korsning där du kan rulla över, sakta ner eller stanna.',
    sources: [vmf('2 kap. A35–A38'), teori('Avstånd till järnvägskorsning', 109)],
    tags: ['vagmarke', 'plankorsning'],
    related: ['jvg-001'],
  },
];

export const jarnvagQuestions = buildQuestions(seeds);
