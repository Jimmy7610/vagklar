/**
 * The registry of Vägklar's own teaching diagrams.
 *
 * Deliberately a separate registry from source-images.ts, not a flag inside it.
 * The two hold different kinds of promise. A licensed image is somebody else's
 * work used with permission, and every entry has to carry a rights holder, a
 * page in their book and a record that permission exists. An original visual is
 * Vägklar's own, and the only thing it has to prove is that it teaches
 * something and can be understood without seeing it.
 *
 * Mixing them would make both claims mushy. Keeping them apart means a drawing
 * can never accidentally be credited to Hagberg Media AB, and a photograph can
 * never accidentally be presented as Vägklar's own — and a validator can say so
 * out loud rather than trusting an author to remember.
 *
 * A visual earns its place here only if the source book has no figure that
 * teaches the thing, or has one that teaches it worse than a purpose-built
 * drawing would. See docs/ORIGINAL-VISUALS.md.
 */

export type OriginalVisualKind = 'comparison' | 'sequence' | 'diagram';

export interface OriginalVisual {
  id: string;
  kind: OriginalVisualKind;
  title: string;
  /** Broad area, mostly for reports. */
  topic: string;
  /** Vägklar's taxonomy, so the visual ties into subject coverage. */
  subcategory: string;
  /** Syllabus chapter, so image coverage can be measured per chapter. */
  chapter: string;
  /** Short, for the accessible name. */
  altText: string;
  /** Long enough that the lesson or question works without seeing the drawing. */
  longDescription: string;
  /** Words printed inside the drawing, verbatim. Read out with the description. */
  labelText: string[];
  /** Shown under the figure in a lesson. Never in a question — it gives the answer. */
  caption: string;
  /** Key into ORIGINAL_VISUAL_GLYPHS. */
  rendererId: string;
  /** The drawing's viewBox, so layout can reserve the right shape. */
  width: number;
  height: number;
  usage: 'theory-lesson' | 'question-image' | 'supporting-reference';
  status: 'approved' | 'draft' | 'retired';
  createdBy: string;
  copyright: string;
  notes?: string;
}

function visual(entry: Omit<OriginalVisual, 'createdBy' | 'copyright'>): OriginalVisual {
  return { ...entry, createdBy: 'Vägklar', copyright: '© 2026 Jimmy Eliasson' };
}

export const ORIGINAL_VISUALS: OriginalVisual[] = [
  /* ========================= Däck ========================= */
  visual({
    id: 'monsterdjup',
    kind: 'comparison',
    title: 'Mönsterdjup',
    topic: 'dack',
    subcategory: 'dack-och-bromsar',
    chapter: 'dack',
    altText:
      'Genomskärning av två däckmönster. Det nya har djupa spår, det slitna nästan inga. Måtten 8 mm och 1,6 mm är utsatta.',
    longDescription:
      'Två däck i genomskärning, sedda från sidan så att spåren syns som gap mellan gummiklackarna. Till vänster ett nytt däck, där klackarna är höga och måttstrecket mellan spårets botten och mönstrets yta visar 8 mm. Till höger ett däck vid slitgränsen, där klackarna är nästan nedslitna och samma mått visar 1,6 mm. Under båda ligger stommen, den del av däcket som inte slits bort. Överst står kravet: minst 1,6 mm, och för vinterdäck minst 3 mm vid vinterväglag.',
    labelText: ['8 mm', '1,6 mm', 'Nytt däck', 'Vid slitgränsen', 'Minst 1,6 mm', 'vinterdäck minst 3 mm'],
    caption:
      'Mönsterdjupet mäts i spåret, inte på gummiklacken. Ett däck kan se helt ut och ändå ligga under gränsen.',
    rendererId: 'monsterdjup',
    width: 320,
    height: 180,
    usage: 'theory-lesson',
    status: 'approved',
  }),
  visual({
    id: 'sommar-vinterdack',
    kind: 'comparison',
    title: 'Sommardäck och vinterdäck',
    topic: 'dack',
    subcategory: 'vinterkorning',
    chapter: 'dack',
    altText:
      'Två däckmönster uppifrån. Sommardäcket har breda, sammanhängande spår. Vinterdäcket är uppdelat i många små klackar med fina skåror.',
    longDescription:
      'Två däckmönster sedda rakt uppifrån, som om däcket rullat i färg. Sommardäcket till vänster har två breda spår som löper hela vägen runt och i övrigt stora sammanhängande gummiytor: få kanter, breda spår. Vinterdäcket till höger är uppdelat i ett rutmönster av små klackar, och varje klack är dessutom skuren av tunna skåror. Resultatet är många kanter som biter i snö. Det är antalet kanter som skiljer dem åt, inte mängden gummi.',
    labelText: ['Sommardäck', 'Vinterdäck', 'Få kanter, breda spår', 'Många kanter som biter i snö'],
    caption:
      'Skillnaden syns i mönstret: vinterdäckets klackar är sönderskurna i tunna lameller, och varje skåra är en kant till som kan greppa.',
    rendererId: 'sommar-vinterdack',
    width: 320,
    height: 180,
    usage: 'theory-lesson',
    status: 'approved',
  }),
  visual({
    id: 'vattenplaning',
    kind: 'sequence',
    title: 'Vattenplaning',
    topic: 'dack',
    subcategory: 'vattenplaning',
    chapter: 'styrning',
    altText:
      'Ett däck i tre lägen på blöt väg. Med stigande fart växer vattenkilen under däcket tills gummit inte längre når asfalten.',
    longDescription:
      'Samma däck på samma vattendjup, i tre lägen med stigande fart. Vid låg fart hinner spåren leda undan vattnet och en bred grön remsa under däcket visar att gummit ligger an mot asfalten. Vid högre fart har en kil av vatten trängt in framför däcket, och den gröna remsan har krympt till hälften. I det tredje läget, vattenplaning, går kilen under hela däcket, remsan är röd och däcket rider på vattnet utan kontakt med vägen. Det enda som skiljer bilderna åt är farten.',
    labelText: ['Låg fart', 'Högre fart', 'Vattenplaning'],
    caption:
      'Vid vattenplaning styr och bromsar du ingenting, eftersom hjulet inte rör vägen. Släpp gasen, håll ratten stilla och låt farten sjunka.',
    rendererId: 'vattenplaning',
    width: 320,
    height: 200,
    usage: 'theory-lesson',
    status: 'approved',
  }),
  visual({
    id: 'dacktryck',
    kind: 'comparison',
    title: 'Lufttryck och slitage',
    topic: 'dack',
    subcategory: 'dack-och-bromsar',
    chapter: 'dack',
    altText:
      'Tre däck framifrån med sina anliggningsytor. För lågt tryck bär på kanterna, rätt tryck bär jämnt, för högt tryck bär bara i mitten.',
    longDescription:
      'Tre däck sedda rakt framifrån, var och en med den del av mönstret som faktiskt vilar mot vägen markerad under sig. Vid för lågt tryck buktar sidorna utåt, mitten lyfter och bara två smala remsor ute vid kanterna bär bilen — däcket slits på kanterna. Vid rätt tryck ligger hela bredden an i en enda sammanhängande remsa och däcket slits jämnt och håller längst. Vid för högt tryck buktar mitten nedåt i stället och en enda smal remsa mitt på bär hela lasten, så däcket slits i mitten i förtid.',
    labelText: ['För lågt tryck', 'Rätt tryck', 'För högt tryck', 'Slits på kanterna', 'Slits jämnt', 'Slits i mitten'],
    caption:
      'Slitagemönstret är en avläsning av lufttrycket. Kanterna slitna betyder för lite luft, mitten sliten betyder för mycket.',
    rendererId: 'dacktryck',
    width: 320,
    height: 170,
    usage: 'theory-lesson',
    status: 'approved',
  }),
  visual({
    id: 'dackskador',
    kind: 'diagram',
    title: 'Skador på däcksidan',
    topic: 'dack',
    subcategory: 'dack-och-bromsar',
    chapter: 'dack',
    altText:
      'En däcksida med tre markerade skador: en utbuktning, en skärskada och små sprickor av ålder.',
    longDescription:
      'En bit av ett däck sett från sidan, med tre fel utmärkta och numrerade. Nummer 1 är en blåsa, en utbuktning där stommen inne i däcket har gått av och bara det yttre gummit håller emot. Nummer 2 är en skärskada in i stommen, ett jack som går genom gummit. Nummer 3 är sprickor av ålder, ett nät av fina sprickor i gummiytan som kommer med tiden oavsett hur långt däcket rullat. Blåsa och skärskada betyder att däcket ska bytas; åldersprickor betyder att det ska kontrolleras.',
    labelText: ['Blåsa', 'Skärskada in i stommen', 'Sprickor av ålder'],
    caption:
      'Mönsterdjupet säger inget om de här felen. Ett däck med gott om mönster kan vara körförbjudet ändå.',
    rendererId: 'dackskador',
    width: 320,
    height: 175,
    usage: 'theory-lesson',
    status: 'approved',
  }),

  /* ==================== Trafikolyckor ==================== */
  visual({
    id: 'krockvald-hastighet',
    kind: 'comparison',
    title: 'Farten och rörelseenergin',
    topic: 'trafikolyckor',
    subcategory: 'riskbedomning',
    chapter: 'trafikolyckor',
    altText:
      'Två bilar, en i 30 km/h och en i 60 km/h, med staplar som visar att den dubbla farten ger fyra gånger så stor rörelseenergi.',
    longDescription:
      'Två bilar med var sin stapel som visar rörelseenergin. Den övre kör i 30 km/h och har en kort stapel märkt 1×. Den undre kör i 60 km/h — dubbelt så fort — men stapeln är fyra gånger så lång och märkt 4×. Under står att dubbla farten ger fyra gånger rörelseenergin, eftersom energin växer med kvadraten på hastigheten, och att allt måste tas upp någonstans vid en kollision.',
    labelText: ['30 km/h', '60 km/h', '1×', '4×', 'Dubbla farten ger fyra gånger rörelseenergin'],
    caption:
      'Det är därför en påkörning i 60 inte är dubbelt så allvarlig som en i 30. Energin som ska bromsas bort är fyra gånger så stor.',
    rendererId: 'krockvald-hastighet',
    width: 320,
    height: 180,
    usage: 'theory-lesson',
    status: 'approved',
  }),
  visual({
    id: 'tre-kollisioner',
    kind: 'sequence',
    title: 'De tre kollisionerna',
    topic: 'trafikolyckor',
    subcategory: 'riskbedomning',
    chapter: 'trafikolyckor',
    altText:
      'Tre steg i samma krock: bilen stannar, kroppen fortsätter tills bältet tar emot, och de inre organen fortsätter ytterligare ett ögonblick.',
    longDescription:
      'Samma krock i tre steg. Steg ett är märkt Bilen stannar: bilen träffar ett hinder och stannar mot det. Steg två är märkt Kroppen fortsätter, och en pil visar hur den som sitter i bilen fortfarande rör sig framåt med den fart bilen hade, tills bältet tar emot. Steg tre är märkt Inre organ fortsätter: kroppen har stannat men innehållet i den är kvar i rörelse ytterligare ett ögonblick. Poängen är att en krock inte är en händelse utan tre, och att bara den första drabbar plåten.',
    labelText: ['Bilen stannar', 'Kroppen fortsätter', 'Inre organ fortsätter'],
    caption:
      'Bilen stannar på några hundradels sekunder. Kroppen inuti den gör det inte av sig själv — det är bältets uppgift.',
    rendererId: 'tre-kollisioner',
    width: 320,
    height: 196,
    usage: 'theory-lesson',
    status: 'approved',
  }),
  visual({
    id: 'varningstriangel',
    kind: 'diagram',
    title: 'Varningstriangelns placering',
    topic: 'trafikolyckor',
    subcategory: 'riskbedomning',
    chapter: 'trafikolyckor',
    altText:
      'En stillastående bil med varningsblinkers och en varningstriangel placerad långt bakom den på vägen.',
    longDescription:
      'En väg sedd från sidan. Längst till höger står ett havererat fordon med varningsblinkers tända. Långt bakom det, till vänster på bilden, står varningstriangeln på vägbanan. Ett måttstreck mellan triangeln och bilen är avsiktligt utan siffra och märkt att avståndet ska vara så långt att trafiken hinner reagera — längre vid hög hastighet, och längre före krön och kurva där bilen inte syns förrän man är nära.',
    labelText: ['Varningstriangeln', 'Så långt att trafiken hinner reagera'],
    caption:
      'Avståndet står inte i meter i reglerna. Det avgörs av hur fort trafiken kommer och hur långt bort den kan se dig.',
    rendererId: 'varningstriangel',
    width: 320,
    height: 168,
    usage: 'theory-lesson',
    status: 'approved',
  }),
  visual({
    id: 'nackskydd-position',
    kind: 'comparison',
    title: 'Nackskyddets höjd',
    topic: 'trafikolyckor',
    subcategory: 'krocksakerhet',
    chapter: 'krocksakerhet',
    altText:
      'Två stolar sedda från sidan. På den ena når nackskyddets överkant upp i höjd med hjässan, på den andra sitter det så lågt att det hamnar bakom nacken.',
    longDescription:
      'Två personer i förarstol, sedda från sidan, båda påkörda bakifrån vilket en pil visar. Till vänster är nackskyddet rätt inställt: överkanten i höjd med hjässan, så att huvudet möter stödet och bara rör sig en kort bit bakåt. Till höger sitter skyddet för lågt, en streckad linje visar att överkanten hamnar nedanför hjässan, och stödet hamnar bakom nacken i stället för bakom huvudet. Då fortsätter huvudet bakåt förbi stödet, vilket en längre båge visar.',
    labelText: ['Rätt inställt', 'För lågt', 'Överkanten i höjd med hjässan', 'Stödet hamnar bakom nacken'],
    caption:
      'Nackskyddet är inte en kudde att luta huvudet mot. Det är ett stopp, och det fungerar bara om det står högt nog för att möta huvudet.',
    rendererId: 'nackskydd-position',
    width: 320,
    height: 180,
    usage: 'theory-lesson',
    status: 'approved',
  }),
  visual({
    id: 'baltets-vag',
    kind: 'comparison',
    title: 'Bältets väg över kroppen',
    topic: 'trafikolyckor',
    subcategory: 'krocksakerhet',
    chapter: 'krocksakerhet',
    altText:
      'Två sittande personer. Hos den ena ligger höftbältet lågt över bäckenet och axelbandet över axeln; hos den andra ligger det över magen och bandet under armen.',
    longDescription:
      'Två personer i en bilstol, sedda från sidan, med bäckenet utmärkt som en egen del. Den vänstra är märkt Rätt: höftbältet lågt över bäckenet, alltså över ben som tål belastningen, och axelbandet snett över axeln. Den högra är märkt Fel — där ligger bältet över magen, bältet under armen i stället för över axeln. Vid en inbromsning belastar det vänstra bältet skelettet och det högra de mjuka delarna.',
    labelText: ['Rätt', 'Fel', 'bäcken', 'Höftbältet lågt över bäckenet', 'Över magen, bältet under armen'],
    caption:
      'Bältet ska ligga mot skelettet, inte mot magen — och glappet ska dras ur, eftersom varje centimeter slack är fart kroppen hinner bygga upp innan bältet tar emot.',
    rendererId: 'baltets-vag',
    width: 320,
    height: 180,
    usage: 'theory-lesson',
    status: 'approved',
  }),

  /* ==================== Frågevarianter ====================
     Same subjects, drawn without the verdict. A teaching diagram says "För
     lågt tryck"; a question cannot, because that is what is being asked. These
     are single unlabelled cases rather than the teaching drawings with the
     words removed — the description still says precisely what is drawn, so the
     question stays answerable for someone who cannot see it. */
  visual({
    id: 'dackslitage-fraga',
    kind: 'diagram',
    title: 'Slitagemönster på ett däck',
    topic: 'dack',
    subcategory: 'dack-och-bromsar',
    chapter: 'dack',
    altText:
      'Ett däck i genomskärning. De tre mönsterklackarna i mitten har full höjd, medan klackarna ute vid båda kanterna är nedslitna till nästan ingenting.',
    longDescription:
      'Mönstret sett i genomskärning, med fem klackar i rad. De tre klackarna i mitten når upp till en streckad linje märkt ursprunglig höjd. Klackarna längst ut vid däckets båda kanter är däremot nedslitna till ungefär en tredjedel av den höjden, och måttstreck visar hur mycket gummi som saknas där. Slitaget är alltså lika stort vid vänster och höger kant, men helt annorlunda än i mitten.',
    labelText: ['kant', 'mitten', 'ursprunglig höjd', 'Mönstret sett i genomskärning'],
    caption: 'Klackarna vid båda kanterna är nedslitna medan mitten har full höjd kvar.',
    rendererId: 'dackslitage-fraga',
    width: 320,
    height: 158,
    usage: 'question-image',
    status: 'approved',
  }),
  visual({
    id: 'nackskydd-fraga',
    kind: 'diagram',
    title: 'Nackskydd sett från sidan',
    topic: 'trafikolyckor',
    subcategory: 'krocksakerhet',
    chapter: 'krocksakerhet',
    altText:
      'En person i förarstol sedd från sidan. Nackskyddets överkant når bara upp i nackhöjd, långt under en streckad linje vid hjässan.',
    longDescription:
      'En person i förarstol, sedd från sidan, påkörd bakifrån vilket en pil bakom stolen visar. Nackskyddet sitter på stolens ryggstöd, men dess överkant når bara upp i höjd med nacken. En streckad linje markerar var hjässan är, och nackskyddets överkant ligger tydligt under den linjen. Stolen sedd från sidan gör att avståndet mellan huvudets bakkant och stödet också syns.',
    labelText: ['hjässan', 'påkörd bakifrån', 'Stolen sedd från sidan'],
    caption: 'Skyddets överkant ligger under den streckade linjen vid hjässan.',
    rendererId: 'nackskydd-fraga',
    width: 320,
    height: 172,
    usage: 'question-image',
    status: 'approved',
  }),
  visual({
    id: 'balte-fraga',
    kind: 'diagram',
    title: 'Bältets läge över kroppen',
    topic: 'trafikolyckor',
    subcategory: 'krocksakerhet',
    chapter: 'krocksakerhet',
    altText:
      'En sittande person från sidan. Höftbältet ligger tvärs över magen, ovanför bäckenet, och axelbandet går snett ned innanför armen.',
    longDescription:
      'Bältets läge över kroppen, på en person i bilstol sedd från sidan, med bäckenet utmärkt som ett eget parti nedtill på bålen. Höftbältet ligger vågrätt tvärs över magen, en bra bit ovanför bäckenet. Det diagonala bandet går brant nedåt nära stolen i stället för snett över axeln. Bältet är ritat i neutral färg och utan omdöme, så bilden visar bara var det ligger.',
    labelText: ['bäcken', 'Bältets läge över kroppen'],
    caption: 'Höftbältet ligger över magen, ovanför bäckenet.',
    rendererId: 'balte-fraga',
    width: 320,
    height: 166,
    usage: 'question-image',
    status: 'approved',
  }),
  visual({
    id: 'vattenplaning-fraga',
    kind: 'diagram',
    title: 'Däck på blöt väg',
    topic: 'dack',
    subcategory: 'vattenplaning',
    chapter: 'styrning',
    altText:
      'Ett däck i genomskärning på en vattentäckt väg. En kil av vatten går in under hela däcket, som inte längre rör asfalten.',
    longDescription:
      'Däcket i genomskärning på blöt väg, rullande åt vänster på en vägbana som är täckt av ett lager vatten. Framför och under däcket har vattnet trängt in som en kil, och kilen fortsätter hela vägen bakåt under däcket. Mellan gummit och asfalten finns därför vatten längs hela anliggningsytan, och ingen del av mönstret rör vägbanan. Bilden är utan text om vad tillståndet heter.',
    labelText: ['Däcket i genomskärning på blöt väg'],
    caption: 'Vattnet går in under hela däcket, som inte längre rör vägbanan.',
    rendererId: 'vattenplaning-fraga',
    width: 320,
    height: 165,
    usage: 'question-image',
    status: 'approved',
  }),
  visual({
    id: 'dackskada-fraga',
    kind: 'diagram',
    title: 'Däcksida med utbuktning',
    topic: 'dack',
    subcategory: 'dack-och-bromsar',
    chapter: 'dack',
    altText:
      'En däcksida sedd från sidan med en tydlig rundad utbuktning som putar ut ur gummit.',
    longDescription:
      'Däcket sett från sidan, så att däcksidan mellan fälgen och mönstret syns. Mitt på däcksidan putar en rundad utbuktning i sidan ut ur gummit, som en bula. Resten av däcksidan är slät och hel. Bilden pekar ut bulan utan att säga vad den beror på eller vad den innebär.',
    labelText: ['utbuktning i sidan', 'Däcket sett från sidan'],
    caption: 'En rundad bula putar ut ur däcksidan.',
    rendererId: 'dackskada-fraga',
    width: 320,
    height: 165,
    usage: 'question-image',
    status: 'approved',
  }),
];

const BY_ID = new Map(ORIGINAL_VISUALS.map((v) => [v.id, v]));

export function getOriginalVisual(id: string): OriginalVisual | undefined {
  return BY_ID.get(id);
}
