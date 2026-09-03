import { buildQuestions, no, ok, teori, trf, vmf } from './authoring';
import type { AuthoredQuestion } from './authoring';

/**
 * Frågor på märke plus tilläggstavla.
 *
 * Det som är svårt med tilläggstavlor är inte att läsa dem var för sig. Det är
 * att en tavla inte betyder något ensam: den flyttar, sträcker ut, riktar eller
 * begränsar regeln ovanför. Ett märke man kan och en tavla man kan blir ändå
 * fel om man läser dem som två separata besked.
 *
 * Därför visar de här frågorna hela stolpen som ett objekt, och frågar efter
 * den sammanlagda innebörden. Bilden beskrivs medan frågan är obesvarad bara
 * med hur den ser ut — "gul triangel över en vit tavla med texten 100 m" — inte
 * med vad den betyder.
 */
const seeds: AuthoredQuestion[] = [
  {
    id: 'skk-001',
    category: 'vagmarken',
    subcategory: 'varningsmarken',
    difficulty: 2,
    ruleTested: 'Avståndstavla under varningsmärke',
    prompt: 'Vad betyder skylten med tavlan under?',
    signAssembly: { mainSignId: 'varning-annan-fara', plateIds: ['tavla-avstand'] },
    answers: [
      ok('Att något oväntat finns 100 meter längre fram.'),
      no('Att faran finns just här och gäller de närmaste 100 metrarna.', 'tavla-avstand-vs-utstrackning'),
      no('Att du ska hålla 100 meters avstånd till fordonet framför.', 'tavla-avstand-vs-utstrackning'),
      no('Att märket slutar gälla efter 100 meter.', 'tavla-avstand-vs-utstrackning'),
    ],
    short:
      'Avståndstavlan säger var regeln börjar. Faran finns alltså inte här utan hundra meter längre fram.',
    deep:
      'Blanda inte ihop den med utsträckningstavlan, som ser lik ut men säger något annat: hur långt regeln gäller när den väl börjat. Avstånd flyttar regeln framåt, utsträckning breder ut den.',
    sources: [vmf('T2'), teori('Tilläggstavlor', 346)],
    tags: ['tillaggstavla', 'varningsmarken'],
  },
  {
    id: 'skk-002',
    category: 'parkering',
    subcategory: 'parkeringsforbud',
    difficulty: 2,
    ruleTested: 'Utsträckningstavla under förbudsmärke',
    prompt: 'Hur långt gäller förbudet på bilden?',
    signAssembly: { mainSignId: 'forbud-parkera', plateIds: ['tavla-utstrackning'] },
    answers: [
      ok('På hela den sträcka som tavlan märker ut.'),
      no('Från märket fram till nästa korsning.', 'tavla-avstand-vs-utstrackning'),
      no('Först när du kört den sträcka som anges.', 'tavla-avstand-vs-utstrackning'),
      no('Bara vid själva stolpen.', 'tavla-avstand-vs-utstrackning'),
    ],
    short:
      'Den dubbelriktade pilen betyder utsträckning: förbudet gäller åt båda hållen längs den utmärkta sträckan.',
    deep:
      'Utan tavla hade parkeringsförbudet gällt från märket till nästa korsning. Tavlan finns just för att säga något annat än den grundregeln.',
    sources: [vmf('T11'), trf('3 kap. 55 §')],
    tags: ['tillaggstavla', 'parkering'],
  },
  {
    id: 'skk-003',
    category: 'parkering',
    subcategory: 'parkeringsregler',
    difficulty: 3,
    ruleTested: 'Parkering med tid och avgift',
    prompt: 'Vad gäller på platsen där den här stolpen står?',
    signAssembly: { mainSignId: 'parkering', plateIds: ['tavla-tid', 'tavla-avgift'] },
    answers: [
      ok('Du får parkera under den angivna tiden, och det kostar avgift.'),
      no('Du får parkera gratis under den angivna tiden.', 'flera-tavlor'),
      no('Du får bara stanna, inte parkera, under den angivna tiden.', 'flera-tavlor'),
      no('Avgiften gäller bara utanför den angivna tiden.', 'flera-tavlor'),
    ],
    short:
      'Två tavlor läses tillsammans, uppifrån och ned: parkering tillåten, under den tiden, mot avgift.',
    deep:
      'En vanlig felläsning är att ta den nedersta tavlan som ett undantag från den övre. Tavlor staplas inte som undantag utan som villkor — alla ska vara uppfyllda samtidigt.',
    sources: [vmf('T6'), vmf('T16')],
    tags: ['tillaggstavla', 'parkering'],
  },
  {
    id: 'skk-004',
    category: 'korsningar',
    subcategory: 'vajningsplikt',
    difficulty: 3,
    ruleTested: 'Flervägsväjning',
    prompt: 'Du kommer fram till korsningen och ser den här stolpen. Vad gäller?',
    signAssembly: { mainSignId: 'vajningsplikt', plateIds: ['tavla-flervagsvajning'] },
    answers: [
      ok('Alla tillfarter har väjningsplikt, så högerregeln avgör mellan er.'),
      no('Du har väjningsplikt mot alla andra i korsningen.', 'flervagsvajning'),
      no('Du har företräde, eftersom de andra också ska väja.', 'flervagsvajning'),
      no('Den som kommer först till korsningen kör först.', 'flervagsvajning'),
    ],
    short:
      'Tavlan säger att ingen tillfart är prioriterad. Eftersom ni alla har väjningsplikt återstår högerregeln.',
    deep:
      'Utan tavlan hade din väjningsplikt betytt att någon annan hade företräde. Med tavlan finns ingen sådan — det är just därför den sitter där.',
    sources: [vmf('T13'), trf('3 kap. 18 §')],
    tags: ['tillaggstavla', 'korsning'],
  },
  {
    id: 'skk-005',
    category: 'korsningar',
    subcategory: 'stopplikt',
    difficulty: 2,
    ruleTested: 'Förvarning om stopplikt',
    prompt: 'Vad ska du göra när du ser den här stolpen?',
    signAssembly: { mainSignId: 'vajningsplikt', plateIds: ['tavla-avstand-stopplikt'] },
    answers: [
      ok('Förbereda dig på att stanna helt om 200 meter.'),
      no('Stanna helt vid stolpen.', 'forvarning-stopplikt'),
      no('Väja här och sedan köra vidare utan att stanna.', 'forvarning-stopplikt'),
      no('Hålla 200 meters avstånd fram till korsningen.', 'forvarning-stopplikt'),
    ],
    short:
      'Tavlan förvarnar: stopplikten kommer om 200 meter. Här behöver du inte stanna, men du ska anpassa farten så att du hinner.',
    deep:
      'Förvarningen sitter där stopplikten annars skulle komma för plötsligt — efter ett krön eller i en kurva. Vid själva stopplinjen gäller sedan full stopplikt: stillastående fordon, inte bara låg fart.',
    sources: [vmf('T3'), trf('3 kap. 19 §')],
    tags: ['tillaggstavla', 'stopplikt'],
  },
  {
    id: 'skk-006',
    category: 'parkering',
    subcategory: 'parkeringsregler',
    difficulty: 2,
    ruleTested: 'Tavla för rörelsehindrade',
    prompt: 'Vem får parkera på platsen?',
    signAssembly: { mainSignId: 'parkering', plateIds: ['tavla-rorelsehindrade'] },
    answers: [
      ok('Bara den som har parkeringstillstånd för rörelsehindrad.'),
      no('Alla, men rörelsehindrade har förtur.', 'tavla-rorelsehindrade'),
      no('Alla, om platsen är ledig.', 'tavla-rorelsehindrade'),
      no('Bara den som har rörelsehinder, oavsett tillstånd.', 'tavla-rorelsehindrade'),
    ],
    short:
      'Tavlan reserverar platsen. Det är tillståndet som gäller, inte en bedömning av vem som verkar behöva platsen.',
    deep:
      'Samma tavla under ett förbudsmärke gör tvärtom: den undantar tillståndshavaren från förbudet. Tavlan begränsar alltid vem märket ovanför träffar — åt det ena eller andra hållet.',
    sources: [vmf('T7'), trf('13 kap. 8 §')],
    tags: ['tillaggstavla', 'parkering'],
  },
  {
    id: 'skk-007',
    category: 'korsningar',
    subcategory: 'huvudled',
    difficulty: 3,
    ruleTested: 'Vägars fortsättning i korsning',
    prompt: 'Vad talar den nedre tavlan om?',
    signAssembly: { mainSignId: 'huvudled', plateIds: ['tavla-vagars-fortsattning'] },
    answers: [
      ok('Hur huvudleden går genom korsningen.'),
      no('Vilken väg som har flest körfält.', 'huvudled-svanger'),
      no('Att huvudleden upphör i korsningen.', 'huvudled-svanger'),
      no('Vilken riktning du själv måste välja.', 'huvudled-svanger'),
    ],
    short:
      'Den tjocka linjen i diagrammet är huvudleden. Svänger den, så svänger också ditt företräde — kör du rakt fram lämnar du huvudleden.',
    deep:
      'Det är den vanligaste fällan med huvudled: att anta att den fortsätter rakt fram. Gör den inte det har du väjningsplikt mot den som följer leden runt kurvan.',
    sources: [vmf('T15'), trf('3 kap. 21 §')],
    tags: ['tillaggstavla', 'huvudled'],
  },
  {
    id: 'skk-008',
    category: 'omkorning',
    subcategory: 'omkorningsforbud',
    difficulty: 2,
    ruleTested: 'Sträckans längd under omkörningsförbud',
    prompt: 'Du får inte köra om här. När upphör det?',
    signAssembly: { mainSignId: 'forbud-omkorning', plateIds: ['tavla-strackans-langd'] },
    answers: [
      ok('Under de närmaste 1,2 kilometrarna.'),
      no('Från och med 1,2 kilometer längre fram.', 'tavla-avstand-vs-utstrackning'),
      no('Till nästa korsning, oavsett vad tavlan säger.', 'tavla-avstand-vs-utstrackning'),
      no('Bara på den plats där märket står.', 'tavla-avstand-vs-utstrackning'),
    ],
    short:
      'Tavlan för vägsträckas längd säger hur långt regeln gäller från märket räknat — inte hur långt bort den börjar.',
    deep:
      'Ett omkörningsförbud gäller annars fram till att det upphör med ett eget märke eller vid nästa korsning. Med den här tavlan vet du i stället exakt när det tar slut, vilket gör det lättare att avstå från en omkörning som ändå inte hinns med.',
    sources: [vmf('T1'), trf('3 kap. 33 §')],
    tags: ['tillaggstavla', 'omkorning'],
  },
  {
    id: 'skk-009',
    category: 'vagmarken',
    subcategory: 'forbudsmarken',
    difficulty: 3,
    ruleTested: 'Viktbegränsning genom tilläggstavla',
    prompt: 'Vem träffas av förbudet på bilden?',
    signAssembly: { mainSignId: 'forbud-trafik-fordon', plateIds: ['tavla-totalvikt'] },
    answers: [
      ok('Fordon med en totalvikt över 3,5 ton.'),
      no('Alla fordon — tavlan anger bara vad vägen tål.', 'tavla-begransar-vem'),
      no('Fordon som lastar mer än 3,5 ton.', 'tavla-begransar-vem'),
      no('Bara lastbilar, oavsett vikt.', 'tavla-begransar-vem'),
    ],
    short:
      'Tavlan begränsar vem märket gäller. En personbil under gränsen får alltså köra, trots förbudsmärket.',
    deep:
      'Totalvikt är vad fordonet högst får väga enligt registreringsbeviset. Det är alltså en egenskap hos fordonet, inte hur mycket du råkar ha lastat just idag.',
    sources: [vmf('T5'), teori('Tilläggstavlor', 346)],
    tags: ['tillaggstavla', 'vikt'],
  },
  {
    id: 'skk-010',
    category: 'parkering',
    subcategory: 'stannande-forbud',
    difficulty: 3,
    ruleTested: 'Riktningstavla under förbudsmärke',
    prompt: 'Åt vilket håll gäller förbudet?',
    signAssembly: { mainSignId: 'forbud-stanna', plateIds: ['tavla-riktning'] },
    answers: [
      ok('Åt det håll pilen på tavlan pekar.'),
      no('Åt båda hållen från stolpen räknat.', 'tavla-riktning'),
      no('Bara på den sida av vägen där stolpen står.', 'tavla-riktning'),
      no('I din egen körriktning, oavsett vart pilen pekar.', 'tavla-riktning'),
    ],
    short:
      'Riktningstavlan pekar ut vilken del av gatan förbudet omfattar. Utan den hade förbudet gällt framåt från märket.',
    deep:
      'Tavlan används ofta där ett märke måste sitta en bit från den sträcka det gäller, till exempel vid en infart. Läs pilen innan du bestämmer var du kan stanna.',
    sources: [vmf('T12'), trf('3 kap. 53 §')],
    tags: ['tillaggstavla', 'parkering'],
  },
  {
    id: 'skk-011',
    category: 'korsningar',
    subcategory: 'stopplikt',
    difficulty: 2,
    ruleTested: 'Flervägsstopp',
    prompt: 'Vad innebär tavlan under stoppmärket?',
    signAssembly: { mainSignId: 'stopp', plateIds: ['tavla-flervagsstopp'] },
    answers: [
      ok('Att alla tillfarter till korsningen har stopplikt.'),
      no('Att du ska stanna två gånger innan du kör ut.', 'flervagsvajning'),
      no('Att stopplikten gäller i flera korsningar framåt.', 'flervagsvajning'),
      no('Att du får köra utan att stanna om korsningen är tom.', 'flervagsvajning'),
    ],
    short:
      'Alla stannar. Sedan gäller högerregeln mellan er, precis som vid flervägsväjning.',
    deep:
      'Stopplikten i sig ändras inte av tavlan — du ska fortfarande stanna helt. Det tavlan säger är att ingen av de andra har företräde bara för att de kom på en annan väg.',
    sources: [vmf('T14'), trf('3 kap. 19 §')],
    tags: ['tillaggstavla', 'stopplikt'],
  },
  {
    id: 'skk-012',
    category: 'vagmarken',
    subcategory: 'varningsmarken',
    difficulty: 2,
    ruleTested: 'Märke utan tilläggstavla',
    prompt: 'Ett varningsmärke för annan fara står helt utan tilläggstavla. Vad vet du då?',
    answers: [
      ok('Bara att något ovanligt finns längre fram — inte vad.'),
      no('Att faran är mindre allvarlig än om det hade funnits en tavla.', 'annan-fara'),
      no('Att märket är felaktigt uppsatt.', 'annan-fara'),
      no('Att faran alltid är vägarbete.', 'annan-fara'),
    ],
    short:
      'Märket för annan fara får normalt sin innebörd av tavlan under. Utan tavla återstår bara beskedet att något kräver din uppmärksamhet.',
    deep:
      'Sänk farten och läs av vägen i stället för att gissa. Just för att märket inte säger vad faran är, är det ett av få där en lägre fart är hela den rimliga reaktionen.',
    sources: [vmf('A40'), teori('Varningsmärken', 324)],
    tags: ['tillaggstavla', 'varningsmarken'],
  },
];

export const skyltkombinationerQuestions = buildQuestions(seeds);
