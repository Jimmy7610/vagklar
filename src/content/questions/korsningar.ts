import { buildQuestions, general, no, ok, sign, trf, vmf } from './authoring';
import type { AuthoredQuestion } from './authoring';

const seeds: AuthoredQuestion[] = [
  {
    id: 'kor-001',
    category: 'korsningar',
    subcategory: 'hogerregeln',
    difficulty: 1,
    ruleTested: 'Högerregeln',
    prompt:
      'Du närmar dig en korsning på en villagata. Det finns inga vägmärken, inga vägmarkeringar och ingen trafiksignal. En bil kommer samtidigt från höger. Vad gäller?',
    answers: [
      ok('Du har väjningsplikt mot bilen från höger.'),
      no('Bilen från höger ska väja, eftersom du redan är närmast korsningen.', 'hoger-utan-skylt'),
      no('Den som kör på den bredare gatan kör först.', 'hoger-utan-skylt'),
      no('Ingen har väjningsplikt — ni får komma överens på plats.', 'hoger-utan-skylt'),
    ],
    short: 'Saknas skyltar och signaler gäller högerregeln. Fordon från höger kör först.',
    deep:
      'Högerregeln är grundregeln i korsningar där inget annat anges. Den gäller oavsett vägarnas bredd, beläggning eller hur mycket trafik de har. Leta alltid efter märken först: väjningsplikt, stopplikt, huvudled eller en signal ersätter högerregeln. Finns inget av det — titta åt höger.',
    memory: 'Ingen skylt? Titta höger.',
    sources: [trf('3 kap. 18 §')],
    tags: ['grundregel'],
  },
  {
    id: 'kor-002',
    category: 'korsningar',
    subcategory: 'utfartsregeln',
    difficulty: 2,
    ruleTested: 'Utfartsregeln',
    prompt:
      'Du kör ut från en bensinstation och ska in på gatan utanför. En cyklist kommer från vänster och en bil från höger. Vad gäller?',
    answers: [
      ok('Du har väjningsplikt mot både cyklisten och bilen.'),
      no('Du har väjningsplikt bara mot bilen från höger.', 'utfart-vs-hoger'),
      no('Du har företräde mot cyklisten men inte mot bilen.', 'utfart-vs-hoger'),
      no('Högerregeln gäller, så cyklisten från vänster ska väja för dig.', 'utfart-vs-hoger'),
    ],
    short:
      'Kör du ut från en bensinstation, parkering eller fastighet har du väjningsplikt mot alla trafikanter på vägen.',
    deep:
      'Utfartsregeln gäller när du kommer ut på en väg från ett område som inte räknas som väg: parkeringsplats, fastighet, bensinstation, gågata, cykelgata eller terräng. Då är högerregeln irrelevant — du ska lämna företräde åt alla, från båda hållen, inklusive cyklister och gående.',
    memory: 'Kommer du inte från en väg — då väjer du för alla.',
    sources: [trf('3 kap. 21 §')],
    tags: ['vanlig-fälla'],
    related: ['kor-003'],
  },
  {
    id: 'kor-003',
    category: 'korsningar',
    subcategory: 'utfartsregeln',
    difficulty: 2,
    ruleTested: 'Utfartsregeln',
    prompt: 'I vilken av situationerna har du INTE väjningsplikt enligt utfartsregeln?',
    answers: [
      ok('Du svänger ut från en mindre grusväg som är en allmän väg.'),
      no('Du kör ut från en parkeringsplats.', 'utfart-vs-hoger'),
      no('Du kör ut från en gågata.', 'utfart-vs-hoger'),
      no('Du kör ut från en fastighet.', 'utfart-vs-hoger'),
    ],
    short:
      'En mindre väg är fortfarande en väg. Där gäller vanliga korsningsregler, oftast högerregeln.',
    deep:
      'Poängen med utfartsregeln är skillnaden mellan väg och icke-väg. En grusväg, skogsbilväg eller smal byväg är en väg — där gäller högerregeln om inget annat är skyltat. Parkeringar, gårdar, gågator och terräng är däremot inte vägar, och därifrån har du alltid väjningsplikt.',
    sources: [trf('3 kap. 21 §')],
    related: ['kor-002'],
  },
  {
    id: 'kor-004',
    category: 'korsningar',
    subcategory: 'stopplikt',
    difficulty: 1,
    ruleTested: 'Stopplikt',
    prompt:
      'Du kommer till en korsning med stopplikt. Du ser tydligt åt båda hållen och det finns ingen annan trafik. Vad ska du göra?',
    answers: [
      ok('Stanna helt vid stopplinjen innan du kör vidare.'),
      no('Rulla sakta fram och kör vidare eftersom sikten är fri.', 'stopp-utan-stopp'),
      no('Sakta ner till gångfart och köra vidare.', 'stopp-utan-stopp'),
      no('Köra vidare utan att sakta ner, eftersom vägen är tom.', 'stopp-utan-stopp'),
    ],
    short: 'Vid stopplikt måste fordonet stå helt stilla — oavsett hur fri sikten är.',
    deep:
      'Stopplikt sätts där sikten är eller kan vara dålig, eller där konsekvensen av ett misstag är stor. Kravet är absolut: fordonet ska stanna vid stopplinjen, eller om linje saknas, precis innan du kör in i korsningen. Först därefter gäller väjningsplikten mot korsande trafik.',
    memory: 'Stopp betyder noll km/h.',
    sources: [trf('3 kap. 19 §'), vmf('B2')],
    type: 'road-sign',
    image: sign('stopp', 'Vägmärke: röd åttakantig skylt med texten STOPP.'),
    accessibilityText: 'Ett rött åttakantigt vägmärke med vit text STOPP.',
  },
  {
    id: 'kor-005',
    category: 'korsningar',
    subcategory: 'cirkulationsplats',
    difficulty: 1,
    ruleTested: 'Cirkulationsplats',
    prompt: 'Du närmar dig en cirkulationsplats med märket väjningsplikt vid infarten. Vad gäller?',
    answers: [
      ok('Du lämnar företräde åt fordon som redan befinner sig i cirkulationen.'),
      no('Högerregeln gäller, så du kör före fordon som kommer från vänster.', 'cirkulation-hoger'),
      no('Fordon i cirkulationen ska väja för dig som kör in.', 'cirkulation-hoger'),
      no('Den som kör snabbast in i cirkulationen har företräde.', 'cirkulation-hoger'),
    ],
    short:
      'Väjningsplikt vid infarten betyder att du lämnar företräde åt alla som redan kör i cirkulationen.',
    deep:
      'En cirkulationsplats är i grunden en korsning, men med väjningsplikt vid infarterna. Inne i cirkulationen ska du ge tecken när du ska köra ut, och du ska vara uppmärksam på cyklister och fordon i det yttre körfältet. Högerregeln har ingen roll här.',
    memory: 'De som är inne kör först.',
    sources: [trf('3 kap. 18 §'), vmf('D3')],
  },
  {
    id: 'kor-006',
    category: 'korsningar',
    subcategory: 'cirkulationsplats',
    difficulty: 2,
    ruleTested: 'Tecken i cirkulationsplats',
    prompt: 'När ska du ge tecken med blinkers i en cirkulationsplats?',
    answers: [
      ok('När du ska lämna cirkulationen — höger blinkers efter avfarten före din.'),
      no('Alltid vänster blinkers när du kör in, oavsett vart du ska.'),
      no('Blinkers behövs inte alls i cirkulationsplatser.'),
      no('Höger blinkers redan innan du kör in i cirkulationen.'),
    ],
    short: 'Tecken ges när du ska ut ur cirkulationen, inte när du kör in.',
    deep:
      'Ska du ta första avfarten kan höger blinkers ges redan vid infarten. Ska du längre, ge tecken först när du passerat avfarten före din — annars läser andra av det som att du kör av tidigare. Vänster blinkers vid infart kan användas när du ska mer än halvvägs runt, men det viktigaste är den tydliga högerblinkern vid utfarten.',
    sources: [trf('3 kap. 64 §')],
  },
  {
    id: 'kor-007',
    category: 'korsningar',
    subcategory: 'huvudled',
    difficulty: 2,
    ruleTested: 'Huvudled',
    prompt:
      'Du kör på en huvudled. I nästa korsning ser du märket huvudled med ett tilläggsmärke som visar att huvudleden svänger åt höger. Du ska köra rakt fram. Vad gäller?',
    answers: [
      ok('Du lämnar huvudleden och har väjningsplikt mot trafiken på huvudleden.'),
      no('Du behåller företrädet eftersom du kom in i korsningen på huvudleden.', 'huvudled-slutar'),
      no('Högerregeln gäller eftersom huvudleden svänger.', 'huvudled-slutar'),
      no('Du har företräde men måste ge tecken.', 'huvudled-slutar'),
    ],
    short:
      'Huvudleden följer den sträckning tilläggsmärket visar. Lämnar du den har du väjningsplikt.',
    deep:
      'Ett vanligt misstag är att tro att huvudled är en egenskap hos fordonet, inte hos vägen. Om huvudleden svänger och du kör rakt fram, så är det du som lämnar huvudleden — och då gäller väjningsplikt mot dem som fortsätter på den. Tilläggsmärket under huvudledsmärket visar alltid hur leden går.',
    memory: 'Huvudled tillhör vägen, inte dig.',
    sources: [vmf('B4'), trf('3 kap. 21 §')],
    type: 'road-sign',
    image: sign('huvudled', 'Vägmärke: gul fyrkant ställd på hörn med vit ram.'),
    accessibilityText: 'Ett vägmärke format som en gul romb med vit kant — huvudled.',
  },
  {
    id: 'kor-008',
    category: 'korsningar',
    subcategory: 'huvudled',
    difficulty: 1,
    ruleTested: 'Huvudled',
    prompt: 'Vad innebär märket huvudled för dig som kör på leden?',
    answers: [
      ok('Korsande trafik har väjningsplikt mot dig, och du får inte parkera på leden.'),
      no('Du får köra 70 km/h även inom tätbebyggt område.', 'bashastighet-tatort'),
      no('Du har alltid företräde, även mot utryckningsfordon.'),
      no('Du får parkera fritt eftersom vägen är prioriterad.', 'huvudled-parkering'),
    ],
    short: 'Huvudled ger företräde mot korsande trafik — och parkeringsförbud på leden.',
    deep:
      'Huvudled påverkar inte hastighetsgränsen. Två saker följer med märket: korsande trafik har väjningsplikt, och det är förbjudet att parkera på leden. Att stanna kort för av- eller påstigning är däremot tillåtet om det kan ske utan fara.',
    sources: [vmf('B4'), trf('3 kap. 55 §')],
    related: ['par-005'],
  },
  {
    id: 'kor-009',
    category: 'korsningar',
    subcategory: 'vajningsplikt',
    difficulty: 2,
    ruleTested: 'Väjningsplikt i praktiken',
    prompt: 'Vad innebär det att ha väjningsplikt?',
    answers: [
      ok('Du ska tydligt visa att du tänker väja och får bara köra vidare om det kan ske utan fara.'),
      no('Du måste alltid stanna helt innan du kör vidare.', 'stopp-utan-stopp'),
      no('Du får köra så snart du hinner före det mötande fordonet.'),
      no('Du behöver bara sakta ner om något fordon syns.'),
    ],
    short:
      'Väjningsplikt betyder att du ska sänka farten, visa din avsikt och köra först när det är riskfritt.',
    deep:
      'Skillnaden mot stopplikt är att du inte måste stå stilla, men du måste vara beredd att göra det. Kravet är att andra inte ska behöva bromsa, väja eller ändra sin körning på grund av dig. "Jag hann precis" är inte att lämna företräde.',
    sources: [trf('3 kap. 5 §')],
  },
  {
    id: 'kor-010',
    category: 'korsningar',
    subcategory: 'vajningsplikt',
    difficulty: 3,
    ruleTested: 'Blinkers som avsikt',
    prompt:
      'Du står vid en väjningspliktskylt. Bilen på den korsande vägen har höger blinkers på och verkar ska svänga in på din väg. Vad är rätt bedömning?',
    answers: [
      ok('Vänta tills bilen faktiskt börjat svänga innan du kör ut.'),
      no('Kör ut direkt — blinkers betyder att bilen svänger.', 'blinkers-som-lofte'),
      no('Kör ut om bilen sänkt farten, det räcker som bekräftelse.', 'blinkers-som-lofte'),
      no('Blinka tillbaka för att bekräfta och kör sedan ut.', 'blinkers-som-lofte'),
    ],
    short: 'En blinkers är en avsikt, inte ett löfte. Vänta på rörelsen, inte på lampan.',
    deep:
      'Blinkers glöms kvar, sätts på av misstag eller ändras i sista stund. Eftersom du har väjningsplikt är det ditt ansvar att undvika krocken. Titta efter hjulens riktning och att farten faktiskt minskar in mot svängen — det är rörelsen som bekräftar avsikten.',
    memory: 'Lita på rörelsen, inte på lampan.',
    sources: [general('Riskutbildning och körstrategi')],
  },
  {
    id: 'kor-011',
    category: 'korsningar',
    subcategory: 'trafiksignal-korsning',
    difficulty: 2,
    ruleTested: 'Gult ljus',
    prompt: 'Signalen slår om till gult när du närmar dig korsningen. Vad gäller?',
    answers: [
      ok('Du ska stanna, om du kan göra det utan fara för trafiken bakom.'),
      no('Du ska öka farten så att du hinner över innan det blir rött.', 'signal-gult'),
      no('Gult betyder att du får köra om du blinkar.', 'signal-gult'),
      no('Gult betyder alltid att du måste stanna, oavsett situation.', 'signal-gult'),
    ],
    short: 'Gult betyder stanna — utom när en inbromsning skulle bli farlig.',
    deep:
      'Undantaget finns för att en tvärnit strax före korsningen kan orsaka en påkörning bakifrån. Är du så nära att du inte kan stanna på ett säkert sätt får du fortsätta. Undantaget är inte en generell rätt att köra på gult; det förutsätter att du redan är för nära.',
    sources: [trf('3 kap. 6 §')],
  },
  {
    id: 'kor-012',
    category: 'korsningar',
    subcategory: 'trafiksignal-korsning',
    difficulty: 2,
    ruleTested: 'Grön signal och väjningsplikt',
    prompt:
      'Du har grön signal och ska svänga vänster i korsningen. Gående korsar den väg du svänger in på, också de på grönt. Vad gäller?',
    answers: [
      ok('Du har väjningsplikt mot de gående.'),
      no('De gående ska vänta eftersom du redan är inne i korsningen.'),
      no('Den som kom först in i korsningen har företräde.'),
      no('Grönt ljus ger dig företräde mot alla trafikanter.'),
    ],
    short: 'Grönt ljus betyder att du får köra in i korsningen, inte att andra ska väja för dig.',
    deep:
      'Vid vänstersväng på grönt ska du lämna företräde både åt mötande trafik som kör rakt fram och åt gående och cyklister som korsar den väg du svänger in på. Grön signal reglerar när du får köra fram — den upphäver inte väjningsplikten inne i korsningen.',
    sources: [trf('3 kap. 61 §')],
  },
  {
    id: 'kor-013',
    category: 'korsningar',
    subcategory: 'polisens-tecken',
    difficulty: 2,
    ruleTested: 'Rangordning mellan tecken',
    prompt:
      'En polis reglerar trafiken i en korsning och tecknar att du ska stanna. Trafiksignalen visar samtidigt grönt. Vad gäller?',
    answers: [
      ok('Du stannar — polisens tecken gäller före signalen.'),
      no('Du kör, eftersom trafiksignalen är den formella regleringen.', 'polis-over-signal'),
      no('Du kör försiktigt förbi och visar att du sett polisen.', 'polis-over-signal'),
      no('Du väntar tills signalen slår om till rött och stannar då.', 'polis-over-signal'),
    ],
    short: 'Rangordningen är: polisens tecken, trafiksignal, vägmärke, allmän regel.',
    deep:
      'Kedjan finns för att en människa på plats alltid har mer information än en fast installation. Samma logik gäller vid olyckor och vägarbeten: en vakt eller polis som reglerar trafiken går före det som står på skylten.',
    memory: 'Person före lampa, lampa före skylt, skylt före grundregel.',
    sources: [trf('2 kap. 3 §')],
  },
  {
    id: 'kor-014',
    category: 'korsningar',
    subcategory: 'hogerregeln',
    difficulty: 3,
    ruleTested: 'Högerregeln i praktiken',
    prompt:
      'Du kör i en korsning där högerregeln gäller. Bilen från höger saktar inte in och verkar inte ha sett dig. Vad är rätt handling?',
    answers: [
      ok('Du bromsar och släpper fram bilen, även om du enligt reglerna hade företräde.'),
      no('Du kör vidare eftersom du har företräde och tutar.', 'blinkers-som-lofte'),
      no('Du håller farten men är beredd att gasa förbi.'),
      no('Du blinkar med helljuset och kör vidare.'),
    ],
    short:
      'Ingen har rätt att köra in i en olycka. Företräde är något du får, inte något du tar.',
    deep:
      'Trafikförordningen ålägger alla en allmän aktsamhetsplikt: du ska göra vad som krävs för att undvika en olycka, även när någon annan gör fel. I praktiken betyder det att du håller uppsikt in i varje korsning och är beredd att avstå ditt företräde.',
    memory: 'Företräde ger dig ingen krockkudde.',
    sources: [trf('2 kap. 1 §'), trf('3 kap. 18 §')],
  },
  {
    id: 'kor-015',
    category: 'korsningar',
    subcategory: 'vajningsplikt',
    difficulty: 3,
    ruleTested: 'Blockerad korsning',
    prompt:
      'Kön framför dig står stilla på andra sidan korsningen. Signalen visar grönt. Vad gör du?',
    answers: [
      ok('Du väntar före korsningen tills du säkert kan köra igenom och ut.'),
      no('Du kör fram i korsningen eftersom du har grönt.'),
      no('Du kör fram till mitten av korsningen och väntar där.'),
      no('Du kör in i korsningen om minst en bil får plats framför dig.'),
    ],
    short: 'Kör aldrig in i en korsning om du inte kan köra ut ur den.',
    deep:
      'Ett fordon som blir stående i korsningen blockerar korsande trafik när signalen slår om, och skapar dessutom en fälla för utryckningsfordon. Regeln gäller även vid grön signal: grönt ger dig tillstånd att köra fram, inte skyldighet att göra det.',
    sources: [trf('3 kap. 8 §')],
  },
  {
    id: 'kor-016',
    category: 'korsningar',
    subcategory: 'stopplikt',
    difficulty: 2,
    ruleTested: 'Stopplinje',
    prompt: 'Var ska du stanna vid stopplikt om det saknas stopplinje?',
    answers: [
      ok('Precis innan du kör in i den korsande vägen, där du har bäst sikt.'),
      no('Minst tio meter före korsningen.', 'overgangsstalle-avstand'),
      no('Vid vägmärket, oavsett hur långt det står från korsningen.'),
      no('Var som helst innan korsningen, så länge du stannar helt.'),
    ],
    short: 'Utan stopplinje stannar du strax före korsande körbana, där sikten är som bäst.',
    deep:
      'Märket kan stå en bit före själva korsningen för att synas i tid. Stoppet ska ändå ske där det gör nytta: precis innan den korsande körbanan. Behöver du krypa fram lite för att se, gör det efter att du stannat.',
    sources: [trf('3 kap. 19 §')],
  },
];

export const korsningarQuestions = buildQuestions(seeds);
