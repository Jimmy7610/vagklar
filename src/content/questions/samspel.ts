import { buildQuestions, no, ok, teori, trf, vmf } from './authoring';
import type { AuthoredQuestion } from './authoring';

/**
 * Nedsatt förmåga och samspel i trafiken, plus rättspraxis.
 *
 * Written to be factual rather than moralising: what the signals mean, what
 * the numbers actually say about age and risk, and how a court has reasoned
 * when a rule met reality.
 */

const seeds: AuthoredQuestion[] = [
  /* ---- Nedsatt förmåga -------------------------------------------------- */
  {
    id: 'ned-001',
    category: 'manniskan',
    subcategory: 'nedsatt-formaga',
    difficulty: 2,
    ruleTested: 'Signaler med vit käpp',
    prompt:
      'En person med vit käpp står vid ett övergångsställe och håller käppen snett framåt. Vad betyder det?',
    answers: [
      ok('Att personen tänker börja gå.'),
      no('Att personen väntar och lyssnar.', 'vit-kapp-signal'),
      no('Att personen ber om hjälp att komma över.', 'vit-kapp-signal'),
      no('Att personen vill att du kör förbi först.', 'vit-kapp-signal'),
    ],
    short:
      'Käppen snett framåt betyder att personen tänker gå ut. Käppen rakt ner mot marken betyder att personen väntar och lyssnar.',
    deep:
      'Den vita käppen används för att orientera sig och för att göra andra uppmärksamma på synnedsättningen. Den är känd över hela världen. Att kunna läsa de två lägena gör att du kan agera innan personen behöver ta ett steg ut i ovisshet.',
    memory: 'Nedåt = väntar. Framåt = går.',
    sources: [teori('Signaler med vit käpp', 162)],
    tags: ['oskyddade', 'samspel'],
  },
  {
    id: 'ned-002',
    category: 'manniskan',
    subcategory: 'nedsatt-formaga',
    difficulty: 2,
    ruleTested: 'Att släppa över en synskadad',
    prompt:
      'Du har stannat för att släppa över en person med vit käpp vid ett övergångsställe. Vad är viktigast medan du väntar?',
    answers: [
      ok('Att vara försiktig med ljud och inte köra vidare förrän personen är helt över vägen.'),
      no('Att tuta kort för att visa att du har stannat.', 'synskadad-ljud'),
      no('Att köra vidare så snart personen lämnat ditt körfält.', 'synskadad-ljud'),
      no('Att gasa lätt så att personen hör var bilen står.', 'synskadad-ljud'),
    ],
    short:
      'Varva inte motorn och tuta bara i nödfall. Vänta tills personen är helt över — inte bara förbi ditt körfält.',
    deep:
      'En synskadad orienterar sig till stor del på ljud. En accelererande motor bredvid kan tolkas som att bilen börjat rulla, vilket är precis den osäkerhet du försökte ta bort genom att stanna. Stanna dessutom med god marginal till övergångsstället.',
    sources: [teori('När du släpper över en synskadad', 162)],
    tags: ['oskyddade', 'samspel'],
    related: ['ned-001'],
  },
  {
    id: 'ned-003',
    category: 'manniskan',
    subcategory: 'nedsatt-formaga',
    difficulty: 1,
    ruleTested: 'Ledarhund',
    prompt: 'Vad gäller för en ledarhund i sele?',
    answers: [
      ok('Den arbetar och ska aldrig störas eller kontaktas.'),
      no('Den bedömer trafikläget åt sin förare och kan lita på helt.', 'ledarhund-formaga'),
      no('Den ska lockas fram så att den vågar gå över vägen.', 'ledarhund-formaga'),
      no('Den har företräde i trafiken på samma sätt som utryckningsfordon.', 'ledarhund-formaga'),
    ],
    short:
      'Ledarhunden hjälper sin förare att undvika hinder, men kan inte bedöma trafiken som en människa. Stör den aldrig.',
    sources: [teori('Ledarhund', 163)],
    tags: ['oskyddade', 'samspel'],
  },
  {
    id: 'ned-004',
    category: 'manniskan',
    subcategory: 'nedsatt-formaga',
    difficulty: 3,
    ruleTested: 'Ålder och olycksrisk',
    prompt: 'Vad gäller för åldersgruppen 65–74 år som bilförare?',
    answers: [
      ok('De kör i regel säkrare än nyblivna 18-åriga förare, tack vare mognad och trafikvana.'),
      no('De har samma förhöjda olycksrisk som förare över 75 år.', 'aldre-risk'),
      no('De har högst olycksrisk av alla åldersgrupper.', 'aldre-risk'),
      no('Deras olycksrisk är densamma som för 18-åringar.', 'aldre-risk'),
    ],
    short:
      'Gruppen 65–74 år har stor trafikvana och kör säkrare än de allra yngsta förarna. Först över 75 år stiger risken märkbart.',
    deep:
      'Över 75 år är sinnena ofta nedsatta och hjärnan bearbetar intryck långsammare, vilket ger en olycksrisk 5–6 gånger högre än genomsnittsförarens — ungefär samma nivå som för 18–19-åringar. Det som försämras med åldern är framför allt synen, hörseln, balansen, reaktionstiden och förmågan att snabbt tolka intryck.',
    sources: [teori('Äldre i trafiken', 163)],
    tags: ['risk', 'samspel'],
  },
  {
    id: 'ned-005',
    category: 'manniskan',
    subcategory: 'nedsatt-formaga',
    difficulty: 2,
    ruleTested: 'Dolda funktionsnedsättningar',
    prompt: 'Varför är tålamod särskilt viktigt mot trafikanter som verkar tveka?',
    answers: [
      ok('Många funktionsnedsättningar syns inte, till exempel hörselskada eller epilepsi.'),
      no('Alla funktionsnedsättningar är synliga om man tittar noga.', 'dold-funktionsnedsattning'),
      no('Den som tvekar i trafiken saknar alltid körvana.', 'dold-funktionsnedsattning'),
      no('Tveksamhet i trafiken beror nästan alltid på ouppmärksamhet.', 'dold-funktionsnedsattning'),
    ],
    short:
      'Synliga funktionsnedsättningar som rullstol och vit käpp är undantaget. Hörselskada och epilepsi syns inte alls.',
    sources: [teori('Funktionsnedsättning', 162)],
    tags: ['samspel'],
  },
  {
    id: 'ned-006',
    category: 'manniskan',
    subcategory: 'nedsatt-formaga',
    difficulty: 2,
    ruleTested: 'Tilläggstavla nedsatt syn',
    prompt:
      'Under märket för övergångsställe sitter en gul tilläggstavla. Vad betyder den kombinationen normalt?',
    answers: [
      ok('Att personer med nedsatt syn är vanligt förekommande där.'),
      no('Att övergångsstället är särskilt olycksdrabbat.', 'tillaggstavla-syn'),
      no('Att övergångsstället är bevakat med signal.', 'tillaggstavla-syn'),
      no('Att övergångsstället endast får användas av gående med ledsagare.', 'tillaggstavla-syn'),
    ],
    short:
      'Tilläggstavlan för nedsatt syn har alltid gul bottenfärg och varnar för att synskadade ofta korsar där.',
    deep:
      'Det finns en motsvarande tavla för nedsatt hörsel. Båda är förvarningar om att de gående kan behöva längre tid och kanske inte kan uppfatta din bil på vanligt sätt — sänk farten i god tid och räkna med att behöva stanna.',
    sources: [vmf('2 kap. T9'), teori('Nedsatt syn (T9)', 163)],
    tags: ['vagmarke', 'oskyddade'],
    related: ['ned-002'],
  },
  {
    id: 'ned-007',
    category: 'manniskan',
    subcategory: 'nedsatt-formaga',
    difficulty: 2,
    ruleTested: 'Särskild hänsyn mot barn',
    prompt:
      'Ett barn står stilla vid trottoarkanten och har ögonkontakt med dig. Vad kan du utgå från?',
    answers: [
      ok('Ingenting säkert — barnet kan plötsligt springa ut ändå.'),
      no('Att barnet har uppfattat situationen och kommer att vänta.', 'barn-ogonkontakt'),
      no('Att barnet har väjningsplikt och därför står kvar.', 'barn-ogonkontakt'),
      no('Att du kan hålla farten så länge ni har ögonkontakt.', 'barn-ogonkontakt'),
    ],
    short:
      'Ögonkontakt med ett barn är ingen överenskommelse. Ropar en kompis på andra sidan kan bilarna vara som bortblåsta.',
    deep:
      'Trafikförordningen kräver att du visar särskild hänsyn mot barn. Praktiskt betyder det marginal snarare än förväntan: sänk farten, öka avståndet och räkna med det oväntade. Se särskilt upp för barn som springer ut mellan bussar och parkerade fordon.',
    sources: [trf('3 kap. 1 §'), teori('Barn', 168)],
    tags: ['barn', 'risk'],
  },

  /* ---- Rättsfall och praxis -------------------------------------------- */
  {
    id: 'rtp-001',
    category: 'trafikregler',
    subcategory: 'rattspraxis',
    difficulty: 3,
    ruleTested: 'Aktsamhetsplikten framför formell rätt',
    prompt:
      'Du har företräde i en korsning, men ser att en bil från sidan inte verkar tänka stanna. Vad säger regelverkets grundtanke?',
    answers: [
      ok('Du är skyldig att göra vad som krävs för att undvika olyckan, även när du har rätt.'),
      no('Du får köra vidare — ansvaret ligger helt på den som bryter mot regeln.', 'foretrade-tas'),
      no('Du ska tuta och behålla farten så att din avsikt blir tydlig.', 'foretrade-tas'),
      no('Du måste stanna helt varje gång, oavsett situation.', 'foretrade-tas'),
    ],
    short:
      'Företräde är något du får, aldrig något du tar. Aktsamhetsplikten gäller även när någon annan gör fel.',
    deep:
      'Det här är den princip domstolar återkommer till när skulden ska fördelas efter en olycka: att ha haft rätt befriar inte från skyldigheten att undvika en olycka man hade kunnat undvika. Praktiskt betyder det att ett formellt företräde aldrig är ett skäl att sluta titta.',
    memory: 'Företräde ges, det tas aldrig.',
    sources: [trf('2 kap. 1 §'), teori('Rättsfall', 362)],
    tags: ['grundregel', 'rattsfall'],
  },
  {
    id: 'rtp-002',
    category: 'trafikregler',
    subcategory: 'rattspraxis',
    difficulty: 3,
    ruleTested: 'Bevisning och eget ansvar',
    prompt:
      'Varför är det relevant för dig som förare att känna till hur domstolar resonerat i trafikmål?',
    answers: [
      ok('För att det visar hur reglerna tillämpas i verkliga situationer där flera regler krockar.'),
      no('För att domstolarnas beslut ersätter trafikförordningen.', 'rattsfall-roll'),
      no('För att det avgör vilka frågor som kommer på kunskapsprovet.', 'rattsfall-roll'),
      no('För att en dom befriar dig från ansvar i liknande situationer.', 'rattsfall-roll'),
    ],
    short:
      'Rättsfall visar hur en regel faller ut när verkligheten är rörig. De ersätter inte lagen — de tolkar den.',
    deep:
      'Teorin lär ut regler var för sig. På vägen möter du dem samtidigt, ofta med ofullständig information. Rättsfall är den närmaste motsvarigheten till facit för hur den avvägningen värderas i efterhand — och nästan alltid handlar bedömningen om vad föraren hade kunnat se och göra i tid.',
    sources: [teori('Rättsfall', 362)],
    tags: ['rattsfall'],
    related: ['rtp-001'],
  },
];

export const samspelQuestions = buildQuestions(seeds);
