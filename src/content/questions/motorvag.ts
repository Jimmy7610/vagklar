import { buildQuestions, general, no, ok, trf } from './authoring';
import type { AuthoredQuestion } from './authoring';

const seeds: AuthoredQuestion[] = [
  {
    id: 'mot-001',
    category: 'motorvag',
    subcategory: 'pafart-avfart',
    difficulty: 2,
    ruleTested: 'Påfart till motorväg',
    prompt: 'Hur ska du köra ut på en motorväg från en påfart med accelerationsfält?',
    answers: [
      ok('Anpassa farten till trafiken på motorvägen och väv in i en lucka.'),
      no('Stanna i slutet av accelerationsfältet och vänta på en lucka.', 'pafart-vantar'),
      no('Köra ut direkt så att trafiken hinner anpassa sig.', 'pafart-vantar'),
      no('Hålla låg fart och räkna med att andra släpper fram dig.', 'pafart-vantar'),
    ],
    short: 'Accelerationsfältet är till för att accelerera. Matcha farten och väv in.',
    deep:
      'En bil som kommer in i 60 km/h i en trafikström som håller 110 skapar en kraftig hastighetsskillnad, och det är hastighetsskillnaden som orsakar krockar. Titta tidigt över axeln, välj din lucka medan du accelererar, och gå in mjukt. Att stanna i slutet av påfarten är farligast av allt — då måste du starta från noll rakt in i snabb trafik.',
    memory: 'Påfarten är en fartramp, inte ett väntrum.',
    sources: [trf('3 kap. 44 §')],
  },
  {
    id: 'mot-002',
    category: 'motorvag',
    subcategory: 'motorvag-regler',
    difficulty: 1,
    ruleTested: 'Fordon som inte får köra på motorväg',
    prompt: 'Vilket fordon får inte köras på motorväg?',
    answers: [
      ok('Ett fordon som inte kan eller får köra fortare än 40 km/h.'),
      no('En personbil med släpvagn.'),
      no('En husbil.'),
      no('En lastbil med släp.'),
    ],
    short: 'Motorväg kräver att fordonet kan hålla minst 40 km/h.',
    deep:
      'Gränsen finns för att låg hastighet i snabb trafik är farligt. Mopeder, traktorer och långsamtgående fordon är därför utestängda. Gående, cyklister och ridande får heller inte vistas på motorväg.',
    sources: [trf('9 kap. 1 §')],
  },
  {
    id: 'mot-003',
    category: 'motorvag',
    subcategory: 'motorvag-regler',
    difficulty: 2,
    ruleTested: 'Vägren på motorväg',
    prompt: 'När får du stanna på vägrenen längs en motorväg?',
    answers: [
      ok('Bara vid nödsituation eller när fordonet fått ett fel.'),
      no('När du behöver vila en stund.', 'motorvag-nodfil'),
      no('När du vill svara i telefon.', 'motorvag-nodfil'),
      no('När du vill läsa kartan eller ställa in navigationen.', 'motorvag-nodfil'),
    ],
    short: 'Vägrenen är en nödficka, inte en rastplats.',
    deep:
      'Fordon på vägrenen är inblandade i en oproportionerligt stor andel av allvarliga motorvägsolyckor. Måste du stanna: kör så långt ut som möjligt, sätt på varningsblinkers, ta på varselväst och gå bakom räcket — inte kvar i bilen.',
    sources: [trf('3 kap. 47 §')],
  },
  {
    id: 'mot-004',
    category: 'motorvag',
    subcategory: 'motorvag-regler',
    difficulty: 1,
    ruleTested: 'Förbjudna manövrar',
    prompt: 'Vilken manöver är alltid förbjuden på motorväg?',
    answers: [
      ok('Backning och U-sväng.'),
      no('Omkörning till vänster.'),
      no('Körfältsbyte i en tunnel.'),
      no('Att köra med släpvagn.'),
    ],
    short: 'Du får aldrig backa eller vända på en motorväg.',
    deep:
      'Missar du en avfart är den enda rätta åtgärden att fortsätta till nästa. Att backa på vägrenen eller korsa mittremsan innebär att du rör dig mot trafik som kommer i 110 km/h och som inte kan förutse dig.',
    sources: [trf('9 kap. 2 §')],
  },
  {
    id: 'mot-005',
    category: 'motorvag',
    subcategory: 'pafart-avfart',
    difficulty: 2,
    ruleTested: 'Avfart från motorväg',
    prompt: 'Hur ska du köra av från en motorväg?',
    answers: [
      ok('Behåll hastigheten till du är inne i retardationsfältet och bromsa där.'),
      no('Börja bromsa redan i det högra körfältet.'),
      no('Bromsa kraftigt i god tid innan avfarten.'),
      no('Blinka och byt fil direkt när du ser avfartsskylten en kilometer bort.'),
    ],
    short: 'Bromsa i retardationsfältet, inte i genomfartstrafiken.',
    deep:
      'Retardationsfältet finns just för att inbromsningen ska ske utanför den snabba trafikströmmen. Bromsar du för tidigt riskerar du en påkörning bakifrån. Var uppmärksam på att hastigheten känns lägre än den är efter en lång sträcka i hög fart — titta på mätaren i slutet av avfarten, kurvan är ofta skarpare än den ser ut.',
    memory: 'Håll farten ut, bromsa in i fältet.',
    sources: [trf('3 kap. 45 §')],
    related: ['mot-006'],
  },
  {
    id: 'mot-006',
    category: 'motorvag',
    subcategory: 'motorvag-regler',
    difficulty: 3,
    ruleTested: 'Hastighetsanpassning efter motorväg',
    prompt:
      'Du har kört i 110 km/h i en timme och svänger av mot en tätort med 50 km/h. Vad är den vanligaste risken?',
    answers: [
      ok('Att du uppfattar din hastighet som lägre än den är och kör för fort.'),
      no('Att motorn går för kallt efter den snabba körningen.'),
      no('Att bromsarna blivit överhettade av motorvägskörningen.'),
      no('Att däcktrycket sjunkit under körningen.'),
    ],
    short: 'Efter lång tid i hög fart känns 70 km/h som krypfart. Läs av mätaren.',
    deep:
      'Fenomenet kallas hastighetsanpassning: sinnena kalibrerar om sig efter den fart du haft en stund. Det gör att både din upplevda hastighet och din bedömning av avstånd blir fel. Motmedlet är enkelt men aktivt — titta på hastighetsmätaren i stället för att lita på känslan de första minuterna efter avfarten.',
    sources: [general('Trafikpsykologi: hastighetsanpassning')],
    related: ['mot-005'],
  },
  {
    id: 'mot-007',
    category: 'motorvag',
    subcategory: 'motortrafikled',
    difficulty: 2,
    ruleTested: 'Motortrafikled',
    prompt: 'Vad skiljer en motortrafikled från en motorväg?',
    answers: [
      ok('Motortrafikleden har oftast bara ett körfält i varje riktning och kan sakna mittseparering.'),
      no('På motortrafikled är det tillåtet att cykla.'),
      no('Motortrafikled har alltid lägre hastighetsgräns än 70 km/h.'),
      no('På motortrafikled får du backa om du missat avfarten.'),
    ],
    short: 'Samma fordonsregler som motorväg, men enklare vägutformning — och därmed mötande trafik.',
    deep:
      'Eftersom motortrafikleder ofta saknar mitträcke finns risk för frontalkollisioner, som är den allvarligaste olyckstypen. Korsningar kan förekomma i plan. Behandla vägtypen med större respekt än hastighetsskylten antyder.',
    sources: [trf('9 kap. 1 §')],
  },
  {
    id: 'mot-008',
    category: 'motorvag',
    subcategory: 'landsvag',
    difficulty: 2,
    ruleTested: 'Mötesfri landsväg',
    prompt: 'Du kör på en mötesfri landsväg med mitträcke och omväxlande ett och två körfält. Vad är viktigast?',
    answers: [
      ok('Att planera omkörningar innan tvåfältssträckan tar slut.'),
      no('Att alltid ligga i vänster körfält när det finns två.'),
      no('Att köra om till höger när det är trångt.', 'omkorning-hoger'),
      no('Att öka farten strax innan filerna går ihop.'),
    ],
    short: 'Börja aldrig en omkörning du inte hinner avsluta innan körfälten går ihop.',
    deep:
      'Mitträcket tar bort risken för frontalkrock men skapar en ny konfliktpunkt där två körfält blir ett. Titta efter skyltarna som förvarnar om sammanslagningen, och avbryt hellre en omkörning tidigt än att pressa dig förbi i sista stund.',
    sources: [general('Vägutformning: mötesfria vägar')],
  },
  {
    id: 'mot-009',
    category: 'motorvag',
    subcategory: 'motorvag-regler',
    difficulty: 2,
    ruleTested: 'Körfältsval på motorväg',
    prompt: 'Du kör på en trefilig motorväg med fri väg framför dig. Vilket körfält ska du använda?',
    answers: [
      ok('Det högra.'),
      no('Det mittersta, för att slippa väva med påfartstrafik.'),
      no('Det vänstra, om du håller hastighetsgränsen.'),
      no('Valfritt, körfälten är likvärdiga på motorväg.'),
    ],
    short: 'Högra körfältet är normalläget. Övriga fält används för omkörning.',
    deep:
      'Att ligga kvar i mitt- eller vänsterfil utan anledning minskar vägens kapacitet och lockar fram omkörningar till höger, vilket är både förbjudet i de flesta fall och farligt. Kör om, och gå tillbaka höger när det är klart.',
    sources: [trf('3 kap. 7 §')],
  },
  {
    id: 'mot-010',
    category: 'motorvag',
    subcategory: 'landsvag',
    difficulty: 3,
    ruleTested: 'Landsvägens risker',
    prompt: 'Varför sker många allvarliga olyckor på vanlig landsväg utan mitträcke?',
    answers: [
      ok('Höga hastigheter kombineras med mötande trafik och oskyddade sidoområden.'),
      no('Landsvägar har generellt sämre asfalt än motorvägar.'),
      no('Hastighetsgränsen är oftast högre än på motorväg.'),
      no('Det finns färre vägmärken på landsväg.'),
    ],
    short: 'Mötande trafik i hög fart är den farligaste kombinationen i trafiken.',
    deep:
      'Vid en frontalkollision adderas fordonens hastigheter i krockvåldet. En avåkning i ett hårt sidoområde med stolpar, diken och träd är den andra vanliga allvarliga olyckstypen. Marginalen finns i din placering, ditt avstånd och din hastighet — inte i vägens utformning.',
    sources: [general('Trafiksäkerhet: olyckstyper på landsväg')],
  },
];

export const motorvagQuestions = buildQuestions(seeds);
