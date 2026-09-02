import { buildQuestions, general, no, ok, teori, trf } from './authoring';
import type { AuthoredQuestion } from './authoring';

const seeds: AuthoredQuestion[] = [
  {
    id: 'has-001',
    category: 'hastighet',
    subcategory: 'hastighetsgranser',
    difficulty: 1,
    ruleTested: 'Bashastighet',
    prompt: 'Du kör inom tätbebyggt område och ser inget hastighetsmärke. Vilken hastighet gäller?',
    answers: [
      ok('50 km/h.'),
      no('30 km/h.', 'bashastighet-tatort'),
      no('40 km/h.', 'bashastighet-tatort'),
      no('70 km/h.', 'bashastighet-tatort'),
    ],
    short: 'Utan skylt gäller bashastigheten: 50 km/h inom tätbebyggt område.',
    deep:
      'Många orter har sänkt till 40 eller 30 på vissa gator, men då finns det skyltar. Ser du märket "Tättbebyggt område" utan siffra så gäller 50 km/h tills något annat anges. Utanför tätbebyggt område är bashastigheten 70 km/h.',
    memory: 'Ingen skylt: 50 inne, 70 ute.',
    sources: [trf('3 kap. 17 §')],
    related: ['has-002'],
  },
  {
    id: 'has-002',
    category: 'hastighet',
    subcategory: 'hastighetsgranser',
    difficulty: 1,
    ruleTested: 'Bashastighet utanför tätort',
    prompt: 'Vilken hastighet gäller utanför tätbebyggt område om inga vägmärken finns?',
    answers: [
      ok('70 km/h.'),
      no('90 km/h.', 'bashastighet-tatort'),
      no('80 km/h.', 'bashastighet-tatort'),
      no('110 km/h om vägen är bred.', 'bashastighet-tatort'),
    ],
    short: 'Bashastigheten utanför tätbebyggt område är 70 km/h.',
    deep:
      'Högre gränser som 80, 90, 100 eller 110 km/h måste alltid skyltas. En bred och fin väg utan skylt ger dig alltså inte rätt att köra fortare än 70.',
    sources: [trf('3 kap. 17 §')],
    related: ['has-001'],
  },
  {
    id: 'has-003',
    category: 'hastighet',
    subcategory: 'anpassad-hastighet',
    difficulty: 2,
    ruleTested: 'Anpassad hastighet',
    prompt:
      'Skylten visar 80 km/h. Det är kraftigt regn och sikten är dålig. Vad är rätt hastighet?',
    answers: [
      ok('Lägre än 80 — hastigheten ska anpassas till sikt, väglag och trafik.'),
      no('80 km/h, det är ju den tillåtna hastigheten.', 'skyltad-som-mal'),
      no('80 km/h så länge du har varselljus på.', 'skyltad-som-mal'),
      no('Exakt 60 km/h, det är regeln vid regn.', 'skyltad-som-mal'),
    ],
    short: 'Skyltad hastighet är ett tak. Förhållandena avgör vad som faktiskt är rätt fart.',
    deep:
      'Trafikförordningen kräver att hastigheten anpassas till väg-, terräng-, väderleks- och siktförhållanden. Kraftigt regn förlänger bromssträckan och kortar sikten samtidigt — två skäl att sänka. Det finns ingen fast siffra; kravet är att du ska kunna stanna inom den sträcka du överblickar.',
    memory: 'Skylten är taket, väglaget är verkligheten.',
    sources: [trf('3 kap. 14 §')],
  },
  {
    id: 'has-004',
    category: 'hastighet',
    subcategory: 'avstand',
    difficulty: 2,
    ruleTested: 'Avstånd till framförvarande',
    prompt: 'Vilket avstånd bör du normalt hålla till fordonet framför på torr väg?',
    answers: [
      ok('Minst tre sekunder, mätt när fordonet framför passerar en fast punkt.'),
      no('Minst tio meter oavsett hastighet.', 'avstand-tid'),
      no('En billängd per tio km/h.', 'avstand-tid'),
      no('Så nära att du ser fordonets bakhjul, för att spara bränsle.', 'avstand-tid'),
    ],
    short: 'Mät i tid, inte i meter. Tre sekunder på torr väg, mer när det är halt.',
    deep:
      'Tidsavstånd skalar automatiskt med hastigheten, vilket meter inte gör. Vid 90 km/h motsvarar tre sekunder ungefär 75 meter. Räkna genom att välja en skylt eller stolpe: när bilen framför passerar den ska du hinna säga en hel mening innan du är där själv. Vid halka eller dålig sikt: dubbla tiden.',
    memory: 'Tre sekunder torrt, sex sekunder halt.',
    sources: [trf('3 kap. 2 §'), general('Körstrategi och avståndsbedömning')],
  },
  {
    id: 'has-005',
    category: 'hastighet',
    subcategory: 'anpassad-hastighet',
    difficulty: 3,
    ruleTested: 'Sträcka per sekund',
    prompt: 'Ungefär hur långt färdas du på en sekund i 70 km/h?',
    answers: [
      ok('Cirka 19 meter.'),
      no('Cirka 7 meter.', 'reaktion-vs-broms'),
      no('Cirka 12 meter.', 'reaktion-vs-broms'),
      no('Cirka 35 meter.', 'reaktion-vs-broms'),
    ],
    short:
      'Dela hastigheten med 3,6: 70 / 3,6 ≈ 19 meter per sekund. Snabbvariant: stryk sista siffran och ta gånger 3.',
    deep:
      'Räkna om med 70 ÷ 3,6 = 19,4 m/s. Delningen med 3,6 kommer av att en kilometer är 1 000 meter och en timme är 3 600 sekunder. En genväg för överslag: ta bort sista siffran och multiplicera med tre — 70 blir 7 × 3 = 21, vilket är nära men något högt. Poängen: under en sekunds ouppmärksamhet passerar du en halv fotbollsplan.',
    memory: 'Dela hastigheten med 3,6 så får du meter per sekund.',
    type: 'calculation',
    sources: [general('Fysik: enhetsomvandling km/h till m/s')],
    related: ['man-001'],
  },
  {
    id: 'has-006',
    category: 'hastighet',
    subcategory: 'anpassad-hastighet',
    difficulty: 3,
    ruleTested: 'Bromssträckans förhållande till hastigheten',
    prompt: 'Du fördubblar hastigheten från 40 till 80 km/h. Hur påverkas bromssträckan?',
    answers: [
      ok('Den blir ungefär fyra gånger så lång.'),
      no('Den blir ungefär dubbelt så lång.', 'reaktion-vs-broms'),
      no('Den blir ungefär tre gånger så lång.', 'reaktion-vs-broms'),
      no('Den påverkas inte om bromsarna är i gott skick.', 'reaktion-vs-broms'),
    ],
    short:
      'Bromssträckan växer med hastigheten i kvadrat: 4 × 4 × 0,4 = 6,4 m vid 40 km/h, men 8 × 8 × 0,4 = 25,6 m vid 80 km/h — fyra gånger så långt.',
    deep:
      'Rörelseenergin är proportionell mot hastigheten i kvadrat, och all den energin måste bromsas bort. Reaktionssträckan däremot växer linjärt — dubbel fart ger dubbel reaktionssträcka. Det är därför en liten fartökning ger en oproportionerligt stor ökning av stoppsträckan.',
    memory: 'Reaktion växer rakt, bromsning växer i kvadrat.',
    type: 'calculation',
    sources: [general('Fysik: rörelseenergi och friktion')],
    related: ['man-001', 'has-005'],
  },
  {
    id: 'has-007',
    category: 'hastighet',
    subcategory: 'placering',
    difficulty: 2,
    ruleTested: 'Placering på flerfilig väg',
    prompt: 'Du kör på en väg med två körfält i din riktning utanför tätort. Var ska du normalt ligga?',
    answers: [
      ok('I det högra körfältet, och använda det vänstra främst för omkörning.'),
      no('I det vänstra körfältet om du håller hastighetsgränsen.'),
      no('Där det är minst trafik, oavsett fil.'),
      no('Växlande mellan filerna för att jämna ut slitaget.'),
    ],
    short: 'Högra körfältet är normalläget. Vänster är till för omkörning.',
    deep:
      'Att ligga kvar i vänsterfilen efter en omkörning skapar köer och lockar fram omkörningar till höger. Inom tätbebyggt område på väg med flera körfält får du däremot välja körfält friare.',
    sources: [trf('3 kap. 7 §')],
  },
  {
    id: 'has-008',
    category: 'hastighet',
    subcategory: 'placering',
    difficulty: 2,
    ruleTested: 'Sidoavstånd till cyklist',
    prompt: 'Du ska passera en cyklist på en landsväg i 70 km/h. Vad är rätt?',
    answers: [
      ok('Håll gott sidoavstånd, väl över en meter, och sänk farten om utrymmet är trångt.'),
      no('Håll samma fart men blinka så att cyklisten flyttar sig.'),
      no('Passera nära för att inte hamna i mötande fil.'),
      no('Tuta i god tid och passera i oförändrad hastighet.'),
    ],
    short: 'Ge cyklisten rejält sidoavstånd — och sänk farten när du inte kan ge det.',
    deep:
      'En cyklist kan svaja för en grop eller en vindby. Vid 70 km/h skapar din bil dessutom en tryckvåg. Kan du inte ge tillräckligt utrymme utan att komma över på mötande sida ska du vänta tills du kan, precis som vid en omkörning av ett fordon.',
    sources: [trf('3 kap. 32 §')],
  },
  {
    id: 'has-009',
    category: 'hastighet',
    subcategory: 'hastighetsgranser',
    difficulty: 2,
    ruleTested: 'Hastighet med släp',
    prompt:
      'En obromsad släpvagn väger högst halva bilens tjänstevikt och under 750 kg. Vilken högsta hastighet gäller för ekipaget?',
    answers: [
      ok('80 km/h.'),
      no('90 km/h.'),
      no('110 km/h om motorvägen tillåter det.'),
      no('40 km/h.'),
    ],
    short:
      'Håller släpet sig inom viktgränsen gäller 80 km/h. Är det tyngre sjunker taket till 40 km/h.',
    deep:
      'Gränsen gäller även om vägen är skyltad högre. Villkoret för 80 km/h är att släpets totalvikt varken överstiger halva dragfordonets tjänstevikt eller 750 kg — överskrids något av dem är det 40 km/h som gäller. En bromsad släpvagn får däremot alltid dras i 80 km/h. Kontrollera registreringsbeviset.',
    sources: [trf('4 kap. 20 §'), teori('Hastigheter för olika fordon', 190)],
    related: ['las-004'],
  },
  {
    id: 'has-010',
    category: 'hastighet',
    subcategory: 'avstand',
    difficulty: 3,
    ruleTested: 'Avstånd bakom tungt fordon',
    prompt: 'Varför bör du hålla extra långt avstånd bakom en lastbil?',
    answers: [
      ok('Du ser mindre av vägen framför, och lastbilsförarens speglar täcker inte allt bakom.'),
      no('Lastbilar bromsar alltid snabbare än personbilar.'),
      no('Det är förbjudet att köra närmare än 50 meter bakom lastbil.'),
      no('Lastbilar får inte köras om, så du måste ändå vänta.'),
    ],
    short: 'Långt avstånd ger dig sikt förbi lastbilen — och gör att föraren kan se dig.',
    deep:
      'Sikt är det som ger dig tid. Ligger du tätt bakom en lastbil ser du varken kön längre fram eller varför den bromsar. Dessutom har tunga fordon stora döda vinklar direkt bakom och snett till höger. Extra avstånd löser båda problemen och gör en eventuell omkörning möjlig att förbereda.',
    sources: [general('Körstrategi, sikt och tunga fordon')],
  },
];

export const hastighetQuestions = buildQuestions(seeds);
