import { buildQuestions, no, ok, teori, trf, tsv } from './authoring';
import type { AuthoredQuestion } from './authoring';

/**
 * Krocksäkerhet, fordonsslag, försäkring och registrering.
 *
 * The administrative half of the theory is easy to dismiss as paperwork, but
 * the questions that trip people up are the ones with a consequence attached:
 * an airbag that must be switched off, a vehicle that never de-registers
 * itself, an insurance level that does not cover your own car.
 */

const seeds: AuthoredQuestion[] = [
  /* ---- Krocksäkerhet --------------------------------------------------- */
  {
    id: 'krk-001',
    category: 'fordonet',
    subcategory: 'krocksakerhet',
    difficulty: 2,
    ruleTested: 'Deformationszoner',
    prompt: 'Varför är bilens front byggd för att tryckas ihop vid en krock?',
    answers: [
      ok('Den förlänger tiden krocken tar, vilket sänker krafterna på kroppen.'),
      no('Den gör bilen billigare att reparera efter en krock.', 'deformation-hard-battre'),
      no('En hård front hade varit säkrare, men den blir för dyr att tillverka.', 'deformation-hard-battre'),
      no('Den gör att bilen studsar tillbaka och tar upp mindre av kraften.', 'deformation-hard-battre'),
    ],
    short:
      'Deformationszonerna bromsar upp bilen under längre tid. Ju längre kroppen har på sig att stanna, desto lägre blir belastningen.',
    deep:
      'Jämför med att hoppa från ett tak: du vill ha en mjuk matta under dig, inte betong. Zonerna får dock inte vara för mjuka heller — då skulle kupén tryckas ihop och du klämmas. Det är balansen mellan att ta upp energi och att behålla ett intakt passagerarutrymme som är konstruktionens hela poäng.',
    memory: 'Mjuk front, hård kupé.',
    sources: [teori('Deformationszoner', 232)],
    tags: ['krocksakerhet'],
  },
  {
    id: 'krk-002',
    category: 'fordonet',
    subcategory: 'krocksakerhet',
    difficulty: 2,
    ruleTested: 'Sidokollisionens särskilda risk',
    prompt: 'Varför är en sidokollision ofta farligare än en frontalkrock i samma hastighet?',
    answers: [
      ok('Sidan har mycket mindre material mellan dig och det som träffar bilen.'),
      no('Sidokrockar sker alltid i högre hastighet.', 'sidokrock'),
      no('Bilbältet ger inget skydd alls vid sidokollisioner.', 'sidokrock'),
      no('Sidokrockar utlöser aldrig några krockkuddar.', 'sidokrock'),
    ],
    short:
      'Det finns nästan ingen deformationszon i sidled. Ytan som ska fånga upp kraften är bara några decimeter tjock.',
    deep:
      'Tillverkarna kompenserar med förstärkta balkar i dörrarna som fördelar kraften ut i karossen, och med sidokrockkuddar. Men grundproblemet kvarstår, och det är en av anledningarna till att korsningsolyckor i tätort ger allvarliga skador även i måttliga hastigheter.',
    sources: [teori('Särskilt sårbara områden', 232)],
    tags: ['krocksakerhet'],
    related: ['krk-001'],
  },
  {
    id: 'krk-003',
    category: 'fordonet',
    subcategory: 'krocksakerhet',
    difficulty: 1,
    ruleTested: 'Ansvar för bältesanvändning',
    prompt: 'Vem ansvarar för att en 12-åring i baksätet använder bilbälte?',
    answers: [
      ok('Föraren.'),
      no('Barnet självt, om det är över 10 år.', 'baltesansvar'),
      no('Barnets vårdnadshavare, även om någon annan kör.', 'baltesansvar'),
      no('Ingen — bältestvång gäller bara i framsätet.', 'baltesansvar'),
    ],
    short:
      'Föraren ansvarar för att passagerare under 15 år använder bälte. Från 15 år ansvarar passageraren själv.',
    sources: [trf('4 kap. 10 §'), teori('Säkerhetsbälte', 232)],
    tags: ['krocksakerhet', 'ansvar'],
  },
  {
    id: 'krk-004',
    category: 'fordonet',
    subcategory: 'krocksakerhet',
    difficulty: 2,
    ruleTested: 'Bältets placering',
    prompt: 'Var ska den övre delen av ett trepunktsbälte ligga?',
    answers: [
      ok('Så nära halsen som möjligt, inte ute på axeln.'),
      no('Ute på axelns yttre kant, så att det inte skaver mot halsen.', 'baltesplacering'),
      no('Under armen, om det känns obekvämt över axeln.', 'baltesplacering'),
      no('Det spelar ingen roll så länge bältet är fastspänt.', 'baltesplacering'),
    ],
    short:
      'Nära halsen. Ligger bältet ute på axeln kan det glida av vid en krock, och då tar kroppen kraften utan skydd.',
    deep:
      'Av samma skäl ska tjocka jackor av innan bältet spänns: allt som skapar avstånd mellan bältet och kroppen blir en sträcka som kroppen hinner accelerera över innan bältet börjar hålla emot. Vid graviditet ska bältets nedre del ligga under magen.',
    sources: [teori('Säkerhetsbälte', 233)],
    tags: ['krocksakerhet'],
    related: ['krk-003'],
  },
  {
    id: 'krk-005',
    category: 'fordonet',
    subcategory: 'krocksakerhet',
    difficulty: 1,
    ruleTested: 'Krockkudde och bakåtvänd bilbarnstol',
    prompt:
      'En bakåtvänd bilbarnstol ska monteras på det främre passagerarsätet. Vad gäller för krockkudden där?',
    answers: [
      ok('Den måste vara urkopplad.'),
      no('Den ska vara aktiverad, eftersom den skyddar även barnet.', 'airbag-barnstol'),
      no('Den får vara aktiverad om barnet är över tre år.', 'airbag-barnstol'),
      no('Det spelar ingen roll, eftersom krockkudden känner av låg vikt.', 'airbag-barnstol'),
    ],
    short:
      'Alltid urkopplad. En utlöst krockkudde pressar den bakåtvända stolen mot framsätet med mycket stor kraft.',
    deep:
      'Krockkudden fylls på ungefär en tiondels sekund och är konstruerad för att möta en vuxen kropp på väg framåt. En bakåtvänd stol har barnets huvud precis där kudden expanderar. Notera skillnaden mellan *monterad* och *aktiverad* — det är krockkudden som ska stängas av, inte stolen som ska flyttas.',
    memory: 'Bakåtvänd stol fram = krockkudden av.',
    sources: [teori('Krockkudde (airbag)', 233), teori('Bilbarnstolar', 238)],
    tags: ['krocksakerhet', 'barn'],
  },
  {
    id: 'krk-006',
    category: 'fordonet',
    subcategory: 'krocksakerhet',
    difficulty: 2,
    ruleTested: 'Krockkudde och bälte',
    prompt: 'Vad gäller om krockkudden löser ut och du inte har bälte på dig?',
    answers: [
      ok('Krockkudden kan ge svåra skador i stället för att skydda.'),
      no('Krockkudden ersätter bältet och skyddar lika bra.', 'airbag-ersatter-balte'),
      no('Krockkudden löser inte ut om bältet är olåst.', 'airbag-ersatter-balte'),
      no('Ingenting särskilt — kudden är byggd för att fungera utan bälte.', 'airbag-ersatter-balte'),
    ],
    short:
      'Krockkudden är ett komplement till bältet, aldrig en ersättning. Utan bälte möter du kudden med full fart.',
    deep:
      'Kudden blåses upp explosionsartat och är tänkt att möta en kropp som redan bromsats upp av bältet. Sitt dessutom minst 25 cm från ratten. Krockkuddar löser normalt ut först vid hastigheter över 20–30 km/h.',
    sources: [teori('Krockkudde (airbag)', 233)],
    tags: ['krocksakerhet'],
    related: ['krk-005'],
  },
  {
    id: 'krk-007',
    category: 'fordonet',
    subcategory: 'krocksakerhet',
    difficulty: 2,
    ruleTested: 'Nackskydd och whiplash',
    prompt: 'Hur ska nackskyddet ställas in för att skydda mot pisksnärtsskada?',
    answers: [
      ok('Så högt att huvudet inte kan åka över kanten när du lutar dig bakåt.'),
      no('Så lågt som möjligt, så att nacken kan röra sig fritt.', 'nackskydd'),
      no('I samma höjd som axlarna.', 'nackskydd'),
      no('Det behöver inte ställas in — det är en bekvämlighetsdetalj.', 'nackskydd'),
    ],
    short:
      'Nackskyddet ska fånga upp huvudet, inte sitta under det. Är det för lågt kastas huvudet bakåt över kanten.',
    deep:
      'Whiplash uppstår när nacken kastas runt häftigt, oftast vid påkörning bakifrån. Besvären går ofta över men kan bli långvariga med muskelsmärta, huvudvärk och sömnsvårigheter.',
    sources: [teori('Nackskydd', 234)],
    tags: ['krocksakerhet'],
  },
  {
    id: 'krk-008',
    category: 'fordonet',
    subcategory: 'krocksakerhet',
    difficulty: 2,
    ruleTested: 'Barnskydd i bil',
    prompt: 'Vilken gräns avgör om ett barn måste ha särskilt barnskydd i bilen?',
    answers: [
      ok('Barn kortare än 135 cm ska ha ett särskilt barnskydd.'),
      no('Barn under 7 år ska ha särskilt barnskydd.', 'barnskydd-grans'),
      no('Barn som väger under 36 kg ska ha särskilt barnskydd.', 'barnskydd-grans'),
      no('Barn under 15 år ska ha särskilt barnskydd.', 'barnskydd-grans'),
    ],
    short:
      'Gränsen går vid längden 135 cm, inte vid ålder. Föraren ansvarar för att barn under 15 år är rätt skyddade.',
    deep:
      'Det finns två undantag: tillfällig resa i baksätet på taxi för barn yngre än tre år, och tillfällig transport korta sträckor för barn äldre än tre år och kortare än 135 cm, om barnet sitter med bälte i baksätet.',
    sources: [trf('4 kap. 10 §'), teori('Bilbarnstolar', 238)],
    tags: ['krocksakerhet', 'barn'],
    related: ['krk-003'],
  },

  /* ---- Fordonsslag ----------------------------------------------------- */
  {
    id: 'fsl-001',
    category: 'fordonet',
    subcategory: 'fordonsslag',
    difficulty: 1,
    ruleTested: 'Begreppet trafikant',
    prompt: 'Vem räknas som trafikant?',
    answers: [
      ok('Alla som befinner sig på en väg, till exempel förare, gående, cyklister och ryttare.'),
      no('Endast den som kör ett motordrivet fordon.', 'trafikantbegrepp'),
      no('Endast den som har körkort.', 'trafikantbegrepp'),
      no('Alla utom gående, som räknas som en egen kategori.', 'trafikantbegrepp'),
    ],
    short:
      'Trafikant är ett brett begrepp: alla som befinner sig på vägen. Det är därför trafikreglerna kan rikta sig till fotgängare lika väl som till bilister.',
    sources: [teori('Trafikant', 188)],
    tags: ['definitioner'],
  },
  {
    id: 'fsl-002',
    category: 'fordonet',
    subcategory: 'fordonsslag',
    difficulty: 2,
    ruleTested: 'Högsta hastighet för lätt lastbil',
    prompt: 'Hur fort får en lätt lastbil högst köras?',
    answers: [
      ok('Så fort som vägens hastighetsbegränsning tillåter.'),
      no('Högst 70 km/h.', 'lattlastbil-fart'),
      no('Högst 80 km/h.', 'lattlastbil-fart'),
      no('Högst 90 km/h.', 'lattlastbil-fart'),
    ],
    short:
      'För en lätt lastbil gäller vägens hastighetsbestämmelser, precis som för personbil. Det är de tunga fordonen som har egna tak.',
    sources: [tsv('Hastighetsbestämmelser för olika fordon'), teori('Hastigheter för olika fordon', 190)],
    tags: ['hastighet', 'fordonsslag'],
  },
  {
    id: 'fsl-003',
    category: 'fordonet',
    subcategory: 'fordonsslag',
    difficulty: 2,
    ruleTested: 'Högsta hastighet med bromsad släpvagn',
    prompt: 'Hur fort får du högst köra med en bromsad släpvagn efter personbilen?',
    answers: [
      ok('80 km/h.'),
      no('90 km/h.', 'slap-hastighet'),
      no('70 km/h.', 'slap-hastighet'),
      no('Vägens hastighetsbegränsning, oavsett vilken den är.', 'slap-hastighet'),
    ],
    short:
      'Med bromsad släpvagn är taket 80 km/h, även på en väg där det annars är tillåtet att köra fortare.',
    deep:
      'En obromsad släpvagn får också dras i högst 80 km/h, men bara om dess totalvikt inte överstiger halva dragfordonets tjänstevikt och högst 750 kg. Är släpet tyngre än så sjunker taket till 40 km/h.',
    memory: 'Släp bakom bilen: 80 är taket.',
    sources: [trf('4 kap. 20 §'), teori('Hastigheter för olika fordon', 190)],
    tags: ['hastighet', 'slap'],
  },
  {
    id: 'fsl-004',
    category: 'fordonet',
    subcategory: 'fordonsslag',
    difficulty: 2,
    ruleTested: 'Högsta hastighet vid bogsering',
    prompt: 'Du bogserar en annan bil. Hur fort får ni högst köra?',
    answers: [
      ok('30 km/h.'),
      no('50 km/h.', 'bogsering-fart'),
      no('40 km/h.', 'bogsering-fart'),
      no('70 km/h.', 'bogsering-fart'),
    ],
    short:
      'Vid bogsering av en annan bil är gränsen 30 km/h. Det är också skälet till att bogsering på motorväg bara är tillåten till närmaste avfart.',
    sources: [trf('4 kap. 20 §'), teori('Hastigheter för olika fordon', 190)],
    tags: ['hastighet'],
  },
  {
    id: 'fsl-005',
    category: 'fordonet',
    subcategory: 'fordonsslag',
    difficulty: 2,
    ruleTested: 'Moped klass I och klass II',
    prompt: 'Vad skiljer en moped klass I från en moped klass II?',
    answers: [
      ok('Klass I (EU-moped) får köras i högst 45 km/h och räknas som motorfordon; klass II är långsammare och får ofta använda cykelbana.'),
      no('Klass I är eldriven och klass II bensindriven.', 'mopedklasser'),
      no('Klass I kräver körkort, klass II kräver inget alls.', 'mopedklasser'),
      no('Klass I får köras på motorväg, klass II får inte det.', 'mopedklasser'),
    ],
    short:
      'Klass I är en EU-moped med konstruktiv hastighet upp till 45 km/h. Klass II är långsammare och behandlas i många regler som en cykel.',
    deep:
      'Skillnaden återkommer på flera ställen: väjningsplikten vid cykelöverfart gäller moped klass II men inte klass I, och det är klass II som får använda ett kollektivkörfält som ligger till höger i färdriktningen.',
    sources: [teori('Indelning av fordon', 189), teori('Kollektivkörfält', 18)],
    tags: ['fordonsslag', 'moped'],
    related: ['pas-012'],
  },
  {
    id: 'fsl-006',
    category: 'fordonet',
    subcategory: 'fordonsslag',
    difficulty: 3,
    ruleTested: 'Varför andra fordons hastigheter spelar roll',
    prompt:
      'Du ligger bakom en tung lastbil på en landsväg med 90 km/h. Varför är det bra att veta att lastbilen får köra högst 80 km/h?',
    answers: [
      ok('Du vet att den inte kommer att öka farten, vilket gör omkörningen möjlig att planera.'),
      no('Du får köra om utan att bry dig om mötande, eftersom lastbilen är långsammare.', 'andra-fordons-fart'),
      no('Du har rätt att bli släppt förbi av lastbilen.', 'andra-fordons-fart'),
      no('Du får överskrida hastighetsgränsen under omkörningen.', 'andra-fordons-fart'),
    ],
    short:
      'Att veta motpartens maxfart gör skillnaden mellan en planerad omkörning och en chansning.',
    deep:
      'En omkörning bygger helt på en hastighetsskillnad du kan lita på. Vet du att fordonet framför inte kan accelerera ifrån dig blir sträckan förutsägbar. Hastighetsgränsen gäller ändå för dig — den upphävs aldrig av en omkörning.',
    sources: [teori('Hastigheter för olika fordon', 190)],
    tags: ['omkorning', 'fordonsslag'],
    related: ['fsl-002'],
  },

  /* ---- Försäkring ------------------------------------------------------ */
  {
    id: 'frs-001',
    category: 'fordonet',
    subcategory: 'forsakring',
    difficulty: 1,
    ruleTested: 'Trafikförsäkringens omfattning',
    prompt: 'Vilken skada ersätts inte av trafikförsäkringen?',
    answers: [
      ok('Skada på ditt eget fordon.'),
      no('Personskada på en annan trafikant.', 'trafikforsakring-omfattning'),
      no('Skada på någon annans bil.', 'trafikforsakring-omfattning'),
      no('Skada på någon annans egendom, till exempel ett staket.', 'trafikforsakring-omfattning'),
    ],
    short:
      'Trafikförsäkringen täcker personskador och skador du orsakar på andras fordon och egendom — men aldrig din egen bil.',
    deep:
      'Vill du ha ersättning för din egen bil vid en trafikolycka krävs helförsäkring (vagnskadeförsäkring). Halvförsäkring lägger till stöld, brand, glas, maskin och rättsskydd, men inte skador på den egna bilen vid en olycka.',
    memory: 'Trafikförsäkring skyddar andra, inte din bil.',
    sources: [tsv('Trafikförsäkring'), teori('Trafikförsäkring', 298)],
    tags: ['forsakring'],
  },
  {
    id: 'frs-002',
    category: 'fordonet',
    subcategory: 'forsakring',
    difficulty: 1,
    ruleTested: 'Krav på trafikförsäkring',
    prompt: 'Vilka fordon måste ha trafikförsäkring?',
    answers: [
      ok('Alla motordrivna fordon som är i trafik.'),
      no('Endast personbilar och lastbilar.', 'forsakringsplikt'),
      no('Endast fordon som är yngre än tio år.', 'forsakringsplikt'),
      no('Endast fordon som används yrkesmässigt.', 'forsakringsplikt'),
    ],
    short:
      'Trafikförsäkring är obligatorisk för alla motordrivna fordon. Ställer du av fordonet slipper du både den och fordonsskatten.',
    sources: [tsv('Trafikförsäkring'), teori('Trafikförsäkring', 298)],
    tags: ['forsakring'],
  },
  {
    id: 'frs-003',
    category: 'fordonet',
    subcategory: 'forsakring',
    difficulty: 2,
    ruleTested: 'Halvförsäkring',
    prompt: 'Vad ingår i en halvförsäkring utöver trafikförsäkringen?',
    answers: [
      ok('Bland annat stöld, brand, glas, maskinskada och rättsskydd.'),
      no('Skador på den egna bilen vid en trafikolycka.', 'halv-vs-hel'),
      no('Repor, bucklor och skadegörelse.', 'halv-vs-hel'),
      no('Bärgning efter en trafikolycka du själv orsakat.', 'halv-vs-hel'),
    ],
    short:
      'Halvförsäkring täcker sådant som händer bilen utan att du kör in i något. Skador på egen bil vid en olycka kräver helförsäkring.',
    sources: [teori('Halvförsäkring (delkaskoförsäkring)', 298)],
    tags: ['forsakring'],
    related: ['frs-001'],
  },
  {
    id: 'frs-004',
    category: 'fordonet',
    subcategory: 'forsakring',
    difficulty: 3,
    ruleTested: 'Regressrätt',
    prompt:
      'Du döms för rattfylleri efter en olycka. Vad kan försäkringsbolaget göra?',
    answers: [
      ok('Kräva tillbaka pengar från dig för det bolaget betalat ut.'),
      no('Ingenting — försäkringen gäller oavsett hur olyckan gick till.', 'regressratt'),
      no('Neka att betala ut något alls till den skadade motparten.', 'regressratt'),
      no('Höja premien, men inte kräva tillbaka något.', 'regressratt'),
    ],
    short:
      'Det kallas regressrätt. Den skadade får sin ersättning, men bolaget kan sedan kräva pengarna av dig.',
    deep:
      'Samma sak gäller vid grov vårdslöshet i trafik. Konstruktionen finns för att skydda den oskyldiga tredje parten utan att skydda den som orsakat skadan genom allvarligt regelbrott. En trafikförsäkring är alltså inget skydd mot de ekonomiska konsekvenserna av rattfylleri.',
    sources: [teori('Trafikförsäkring', 298)],
    tags: ['forsakring', 'alkohol'],
  },

  /* ---- Registrering ---------------------------------------------------- */
  {
    id: 'reg-001',
    category: 'fordonet',
    subcategory: 'registrering',
    difficulty: 2,
    ruleTested: 'Registreringsbevisets delar',
    prompt: 'Vilken del av registreringsbeviset används vid ägarbyte?',
    answers: [
      ok('Del 2, ägarbeviset.'),
      no('Del 1, som innehåller de tekniska uppgifterna.', 'regbevis-delar'),
      no('Båda delarna måste skickas in tillsammans.', 'regbevis-delar'),
      no('Ingen av delarna — ägarbyte sker bara digitalt.', 'regbevis-delar'),
    ],
    short:
      'Del 2 är ägarbeviset och används vid ägarbyte och avregistrering. Del 1 innehåller tekniska uppgifter och används för på- och avställning.',
    deep:
      'Eftersom Del 2 kan användas för att byta ägare på fordonet ska den förvaras säkert — inte i handskfacket i bilen. Del 1 är däremot den du behöver för att läsa av till exempel största tillåtna släpvagnsvikt.',
    memory: 'Del 1 om bilen, Del 2 om ägaren.',
    sources: [tsv('Registreringsbevis'), teori('Registreringsbevis', 290)],
    tags: ['registrering'],
  },
  {
    id: 'reg-002',
    category: 'fordonet',
    subcategory: 'registrering',
    difficulty: 3,
    ruleTested: 'Avställning sker aldrig automatiskt',
    prompt: 'Vad är sant om avställning av ett fordon?',
    answers: [
      ok('Ett fordon ställs aldrig av automatiskt — du måste själv anmäla det.'),
      no('Ett fordon ställs av automatiskt om det får körförbud.', 'avstallning-automatisk'),
      no('Ett fordon ställs av automatiskt om fordonsskatten inte betalas.', 'avstallning-automatisk'),
      no('Ett fordon ställs av automatiskt om det inte använts på fem år.', 'avstallning-automatisk'),
    ],
    short:
      'Avställning kräver alltid en aktiv anmälan. Körförbud, obetald skatt eller lång stillestånd ändrar ingenting av sig självt.',
    deep:
      'Det här är en av de vanligaste missuppfattningarna i hela området, och den kostar pengar: så länge fordonet är påställt löper både fordonsskatt och krav på trafikförsäkring, oavsett om bilen står still eller har körförbud.',
    memory: 'Ingen ställer av åt dig.',
    sources: [tsv('Avställning'), teori('Avställning och påställning', 292), teori('Testa dina kunskaper', 296)],
    tags: ['registrering'],
  },
  {
    id: 'reg-003',
    category: 'fordonet',
    subcategory: 'registrering',
    difficulty: 2,
    ruleTested: 'Körning med avställt fordon',
    prompt: 'När får ett avställt fordon köras på väg?',
    answers: [
      ok('Endast till och från besiktning, om trafikförsäkring är betald och inga skatteskulder finns.'),
      no('Korta sträckor i närområdet, om farten hålls låg.', 'avstallt-korning'),
      no('Aldrig, under några omständigheter.', 'avstallt-korning'),
      no('Fritt, så länge fordonet är trafikförsäkrat.', 'avstallt-korning'),
    ],
    short:
      'Ett avställt fordon får bara köras till och från besiktning, och bara om försäkringen är betald och skatteskulder saknas.',
    deep:
      'Det är dessutom förbjudet att bogsera ett avställt fordon. Undantaget för besiktningsresan finns just för att ett avställt fordon ska kunna göras trafikdugligt igen.',
    sources: [tsv('Avställning'), teori('Avställning och påställning', 293)],
    tags: ['registrering'],
    related: ['reg-002'],
  },
  {
    id: 'reg-004',
    category: 'fordonet',
    subcategory: 'registrering',
    difficulty: 2,
    ruleTested: 'Försäkring vid ägarbyte',
    prompt: 'Du köper en begagnad bil. När måste din trafikförsäkring börja gälla?',
    answers: [
      ok('Samma datum som ägarbytet registreras.'),
      no('Inom 30 dagar från ägarbytet.', 'agarbyte-forsakring'),
      no('Först när du hämtar bilen, oavsett datum för ägarbytet.', 'agarbyte-forsakring'),
      no('Säljarens försäkring gäller tills du hunnit teckna en egen.', 'agarbyte-forsakring'),
    ],
    short:
      'Försäkringen ska gälla från och med ägarbytets datum. Säljarens försäkring upphör att skydda dig i samma stund.',
    deep:
      'Ett fordon som står oförsäkrat en enda dag kan ge en avgift för trafikförsäkring, och du står dessutom personligen för skador du orsakar under tiden. Kontrollera varandras personuppgifter också — stämmer de inte kan Transportstyrelsen inte genomföra ägarbytet.',
    sources: [tsv('Ägarbyte'), teori('Hur ägarbyte av fordon går till', 292)],
    tags: ['registrering', 'forsakring'],
    related: ['reg-001', 'frs-002'],
  },
];

export const fordonsadminQuestions = buildQuestions(seeds);
