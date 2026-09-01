import { buildQuestions, no, ok, teori, trf, tsv, vmf } from './authoring';
import type { AuthoredQuestion } from './authoring';

/**
 * Cirkulationsplatser.
 *
 * Two things decide almost every roundabout question: you give way to
 * everything already circulating, and you always signal right on the way out.
 * Left-signalling on the way in is genuinely unregulated, and the questions
 * say so rather than pretending there is a rule.
 */

const seeds: AuthoredQuestion[] = [
  {
    id: 'cir-001',
    category: 'korsningar',
    subcategory: 'cirkulationsplats',
    difficulty: 1,
    ruleTested: 'Väjningsplikt vid infart i cirkulationsplats',
    prompt: 'Du ska köra in i en cirkulationsplats. Mot vilka har du väjningsplikt?',
    answers: [
      ok('Mot varje fordon som redan befinner sig i cirkulationen.'),
      no('Endast mot motordrivna fordon i cirkulationen.', 'cirk-vem-vajer'),
      no('Mot ingen — högerregeln gäller vid infarten.', 'cirk-vem-vajer'),
      no('Mot ingen, eftersom du kör på huvudled fram till cirkulationsplatsen.', 'cirk-vem-vajer'),
    ],
    short:
      'Väjningsplikten gäller mot varje fordon i cirkulationen — även cyklar, mopeder och traktorer.',
    deep:
      'Ordet i förordningen är "varje fordon", inte "varje motorfordon". En cyklist som redan cirkulerar har alltså företräde framför dig. Att du kört på huvudled fram till cirkulationsplatsen ändrar ingenting: huvudleden upphör vid cirkulationsplatsen.',
    memory: 'Alla som redan snurrar går före.',
    sources: [trf('3 kap. 22 §'), vmf('2 kap. D3'), teori('Cirkulationsplats', 58)],
    tags: ['cirkulation', 'vajningsplikt'],
  },
  {
    id: 'cir-002',
    category: 'korsningar',
    subcategory: 'cirkulationsplats',
    difficulty: 1,
    ruleTested: 'Körriktning i cirkulationsplats',
    prompt: 'Åt vilket håll kör du i en cirkulationsplats i Sverige?',
    answers: [
      ok('Moturs — du svänger in åt höger och kör runt rondellen.'),
      no('Medurs — du svänger in åt vänster.', 'cirk-riktning'),
      no('Åt det håll som ger kortast väg till din avfart.', 'cirk-riktning'),
      no('Åt det håll pilarna i rondellen visar, vilket varierar.', 'cirk-riktning'),
    ],
    short:
      'Du svänger alltid in åt höger och kör moturs. Rondellen är det runda området i mitten; cirkulationsplatsen är hela anläggningen.',
    sources: [trf('3 kap. 22 §'), teori('Cirkulationsplats', 58)],
    tags: ['cirkulation'],
  },
  {
    id: 'cir-003',
    category: 'korsningar',
    subcategory: 'cirkulation-korfalt',
    difficulty: 2,
    ruleTested: 'Tecken vid utfart ur cirkulationsplats',
    prompt:
      'Du kör rakt fram genom en cirkulationsplats, alltså rakt ut på andra sidan. Måste du blinka?',
    answers: [
      ok('Ja, du ska blinka höger när du lämnar cirkulationsplatsen.'),
      no('Nej, du blinkar bara om du svänger höger eller vänster.', 'cirk-blinka-ut'),
      no('Nej, blinkers används bara vid körfältsbyte i en cirkulationsplats.', 'cirk-blinka-ut'),
      no('Ja, men du ska blinka vänster eftersom du inte svänger.', 'cirk-blinka-ut'),
    ],
    short:
      'Utfarten är alltid en högersväng ur cirkulationen, hur rakt fram det än känns. Blinka höger.',
    deep:
      'Signalen är till för de andra, inte för dig. En förare som väntar vid nästa infart behöver veta att du ska ut, annars måste hen stå kvar i onödan — eller chansa. Blinka när du passerar refugen till avfarten före din egen, så att tecknet inte kan missförstås som att du ska ut tidigare.',
    memory: 'Ut ur cirkulationen = höger blinkers, alltid.',
    sources: [trf('3 kap. 64 §'), teori('Köra rakt fram i cirkulationsplats', 59)],
    tags: ['cirkulation', 'tecken'],
  },
  {
    id: 'cir-004',
    category: 'korsningar',
    subcategory: 'cirkulation-korfalt',
    difficulty: 2,
    ruleTested: 'Tecken vid infart i cirkulationsplats',
    prompt:
      'Du ska köra rakt fram genom en cirkulationsplats. Ska du blinka när du kör in?',
    answers: [
      ok('Nej. Vid infart blinkar du inte när du ska rakt fram.'),
      no('Ja, du ska blinka höger eftersom du svänger in åt höger.', 'cirk-blinka-in'),
      no('Ja, du ska blinka vänster för att visa att du inte tar första avfarten.', 'cirk-blinka-in'),
      no('Ja, varningsblinkers ska användas i cirkulationsplatser.', 'cirk-blinka-in'),
    ],
    short:
      'Vid infarten finns bara ett möjligt körriktningsval, så ett tecken tillför ingenting. Blinka i stället höger när du ska ut.',
    deep:
      'Skulle du blinka höger vid infarten läser andra det som att du ska ta första avfarten — precis fel budskap. Placera dig i stället i rätt körfält, kör in utan tecken och blinka höger när du passerar refugen före din avfart.',
    sources: [tsv('Cirkulationsplatser'), teori('Köra rakt fram i cirkulationsplats', 59)],
    tags: ['cirkulation', 'tecken'],
    related: ['cir-003'],
  },
  {
    id: 'cir-005',
    category: 'korsningar',
    subcategory: 'cirkulation-korfalt',
    difficulty: 3,
    ruleTested: 'Vänsterblinkning i cirkulationsplats',
    prompt:
      'Du ska köra nästan hela varvet runt i en cirkulationsplats. Vad gäller för vänsterblinkning på vägen in?',
    answers: [
      ok('Det finns ingen tydlig regel. Många trafikskolor rekommenderar det för att visa att du ska fortsätta runt.'),
      no('Vänsterblinkning vid infart är obligatorisk när du ska förbi halva varvet.', 'cirk-vanster-regel'),
      no('Vänsterblinkning i cirkulationsplats är förbjuden.', 'cirk-vanster-regel'),
      no('Vänsterblinkning ersätter kravet på att blinka höger vid utfart.', 'cirk-vanster-regel'),
    ],
    short:
      'Vänsterblinkning är ett oreglerat område. Högerblinkning vid utfart är däremot alltid ett krav.',
    deep:
      'Nyttan med vänsterblinkning är att avskräcka förare vid kommande infarter från att chansa. Men den är inte alltid lämplig: ligger du i höger körfält och blinkar vänster kan det läsas som att du vill byta körfält. Då är tydlighet om körfältsbytet viktigare än att visa fortsatt färdriktning.',
    sources: [teori('Förtydligande angående blinkning till vänster', 62)],
    tags: ['cirkulation', 'tecken'],
    related: ['cir-003'],
  },
  {
    id: 'cir-006',
    category: 'korsningar',
    subcategory: 'cirkulation-korfalt',
    difficulty: 2,
    ruleTested: 'Körfältsval i cirkulationsplats',
    prompt:
      'Du kör in i en cirkulationsplats med två körfält och ska ut vid sista avfarten. Vilket körfält väljer du?',
    answers: [
      ok('Det som är lämpligast för din fortsatta färd enligt märken och markeringar — normalt vänster körfält.'),
      no('Alltid höger körfält, eftersom man ska hålla till höger.', 'cirk-korfaltsval'),
      no('Det körfält där det är minst trafik just då.', 'cirk-korfaltsval'),
      no('Det spelar ingen roll, körfälten är likvärdiga i cirkulationsplatser.', 'cirk-korfaltsval'),
    ],
    short:
      'Välj körfält efter vart du ska, och följ vägmärken och vägmarkeringar. Ska du långt runt är vänster körfält oftast rätt.',
    deep:
      'Försök att ligga i det högra körfältet innan du kör ut. Det är inget krav, men det minskar risken för att korsa någon annans väg i utfarten. Byter du körfält inne i cirkulationen ska det ske utan hinder eller fara för andra, och med blinkers.',
    sources: [trf('3 kap. 22 §'), teori('Hur man ska köra i cirkulationsplatser', 58)],
    tags: ['cirkulation', 'korfalt'],
  },
  {
    id: 'cir-007',
    category: 'korsningar',
    subcategory: 'cirkulation-korfalt',
    difficulty: 3,
    ruleTested: 'Körfältsbyte inne i cirkulationsplats',
    prompt:
      'Du ligger i vänster körfält i en cirkulationsplats och närmar dig din avfart. Vad gäller för att ta dig till höger körfält?',
    answers: [
      ok('Du får byta bara om det kan ske utan hinder eller fara, och du ska ge tecken.'),
      no('Du har företräde eftersom du redan är i cirkulationen.', 'cirk-korfaltsbyte'),
      no('Du får byta utan tecken, eftersom alla vet att du ska ut.', 'cirk-korfaltsbyte'),
      no('Du måste köra ett varv till om höger körfält är upptaget.', 'cirk-korfaltsbyte'),
    ],
    short:
      'Att vara i cirkulationen ger företräde mot dem som ska in — inte mot den som redan ligger i körfältet du vill byta till.',
    deep:
      'De två företrädena blandas lätt ihop. Väjningsplikten vid infart handlar om att komma in i cirkulationen. Ett körfältsbyte inuti den är ett vanligt körfältsbyte med vanliga regler: kolla, blinka, och genomför det bara om det inte hindrar någon. Missar du din avfart är ett extra varv alltid billigare än ett påtvingat körfältsbyte.',
    sources: [trf('3 kap. 12 §'), teori('Hur man ska köra i cirkulationsplatser', 58)],
    tags: ['cirkulation', 'korfalt'],
    related: ['cir-006'],
  },
  {
    id: 'cir-008',
    category: 'korsningar',
    subcategory: 'cirkulationsplats',
    difficulty: 3,
    ruleTested: 'Cirkelformad korsning som inte är cirkulationsplats',
    prompt:
      'Du närmar dig en cirkelformad vägkorsning. Det finns inget vägmärke för cirkulationsplats och ingen väjningspliktsskylt vid infarten. Vad gäller?',
    answers: [
      ok('Det är ingen cirkulationsplats. Högerregeln gäller om inget annat är skyltat.'),
      no('Det är en cirkulationsplats — den runda formen avgör.', 'cirk-utan-skylt'),
      no('Du har väjningsplikt mot alla i cirkeln ändå, av säkerhetsskäl.', 'cirk-utan-skylt'),
      no('Du har alltid företräde i en oskyltad cirkelformad korsning.', 'cirk-utan-skylt'),
    ],
    short:
      'Det är skylten som gör en cirkulationsplats, inte formen. Utan märke är det en vanlig korsning — och då gäller högerregeln.',
    deep:
      'Det är ovanligt men förekommer, ofta på äldre platser och i villaområden. Ett tecken att leta efter är baksidan av en väjningspliktsskylt som gäller trafiken från annat håll. Konsekvensen är stor: i en cirkulationsplats väjer du för alla inne i cirkulationen, i en vanlig rund korsning väjer du för trafiken från höger.',
    memory: 'Ingen D3-skylt, ingen cirkulationsplats.',
    sources: [vmf('2 kap. D3'), teori('Cirkelformad vägkorsning', 63)],
    tags: ['cirkulation', 'hogerregeln'],
    related: ['cir-001'],
  },
  {
    id: 'cir-009',
    category: 'korsningar',
    subcategory: 'cirkulationsplats',
    difficulty: 2,
    ruleTested: 'Oskyddade trafikanter vid cirkulationsplats',
    prompt:
      'Du är på väg ut ur en cirkulationsplats och korsar då en obevakad cykelpassage. Vad gäller?',
    answers: [
      ok('Du ska köra med låg hastighet och lämna cyklande tillfälle att passera.'),
      no('Du har företräde eftersom du kommer från cirkulationen.', 'cirk-utfart-cykel'),
      no('Cyklisten har full väjningsplikt mot dig.', 'cirk-utfart-cykel'),
      no('Du behöver bara anpassa hastigheten, precis som när du kör rakt fram.', 'cirk-utfart-cykel'),
    ],
    short:
      'Utfart ur en cirkulationsplats jämställs med sväng: låg hastighet och lämna cyklande tillfälle att passera.',
    deep:
      'Regeln finns för att utfarten är den plats där en förare är som mest upptagen av trafiken bakom och inuti cirkulationen, samtidigt som cyklister kommer i en vinkel som är lätt att missa. Det är samma situation som en högersväng över en cykelpassage.',
    sources: [trf('3 kap. 61 a §'), teori('Obevakad cykelpassage', 50)],
    tags: ['cirkulation', 'cykel'],
    related: ['pas-009'],
  },
  {
    id: 'cir-010',
    category: 'korsningar',
    subcategory: 'cirkulationsplats',
    difficulty: 1,
    ruleTested: 'Varför cirkulationsplatser byggs',
    prompt: 'Vilken är den främsta trafiksäkerhetsvinsten med en cirkulationsplats?',
    answers: [
      ok('De låga hastigheterna gör att olyckor som ändå sker sällan blir allvarliga.'),
      no('Fordon kan aldrig kollidera i en cirkulationsplats.', 'cirk-fordelar'),
      no('De ger alltid högre kapacitet än en korsning med trafiksignal.', 'cirk-fordelar'),
      no('De kräver ingen väjningsplikt, vilket minskar antalet beslut.', 'cirk-fordelar'),
    ],
    short:
      'Farten hålls nere och krockvinklarna blir mindre farliga. Dessutom blir trafikflödet jämnare och köerna kortare.',
    sources: [teori('Fördelar med cirkulationsplatser', 58)],
    tags: ['cirkulation'],
  },
  {
    id: 'cir-011',
    category: 'korsningar',
    subcategory: 'cirkulation-korfalt',
    difficulty: 2,
    ruleTested: 'Att underlätta andras körfältsbyten',
    prompt:
      'En bil bredvid dig i en cirkulationsplats blinkar och behöver komma över i ditt körfält för att kunna köra ut. Vad är lämpligast?',
    answers: [
      ok('Anpassa hastigheten så att bilen får plats.'),
      no('Hålla farten — den som byter körfält har hela ansvaret.', 'cirk-underlatta'),
      no('Öka farten så att bilen får plats bakom dig.', 'cirk-underlatta'),
      no('Blinka tillbaka för att visa att du sett bilen.', 'cirk-underlatta'),
    ],
    short:
      'Att underlätta andras körfältsbyten är en uttrycklig del av hur man kör i cirkulationsplatser.',
    deep:
      'Det juridiska ansvaret för bytet ligger visserligen på den som byter. Men alternativet — att bilen missar sin avfart eller pressar sig över — skapar en sämre situation för alla, och aktsamhetsplikten gäller även när du har rätt.',
    sources: [teori('Hur man ska köra i cirkulationsplatser', 58)],
    tags: ['cirkulation', 'samspel'],
  },
  {
    id: 'cir-012',
    category: 'korsningar',
    subcategory: 'cirkulationsplats',
    difficulty: 3,
    ruleTested: 'Huvudled och cirkulationsplats',
    prompt:
      'Du kör på en huvudled som leder in i en cirkulationsplats. Vad gäller vid infarten?',
    answers: [
      ok('Huvudleden upphör, och du har väjningsplikt mot fordon i cirkulationen.'),
      no('Huvudleden fortsätter genom cirkulationsplatsen, så du har företräde.', 'huvudled-slutar'),
      no('Du har företräde tills du passerat rondellens mitt.', 'huvudled-slutar'),
      no('Högerregeln gäller, eftersom huvudleden upphör.', 'huvudled-slutar'),
    ],
    short:
      'En huvudled tar slut vid cirkulationsplatsen. Där gäller väjningsplikt mot alla som redan cirkulerar.',
    deep:
      'Detta är samma tankefel som när man tror att huvudleden följer med genom en korsning där den svänger av. Huvudledens sträckning avgörs av märkena, inte av hur bred eller viktig vägen känns.',
    sources: [trf('3 kap. 22 §'), vmf('2 kap. D3'), teori('Cirkulationsplats', 58)],
    tags: ['cirkulation', 'huvudled'],
    related: ['cir-001'],
  },
];

export const cirkulationQuestions = buildQuestions(seeds);
