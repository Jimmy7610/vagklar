import { buildQuestions, general, no, ok } from './authoring';
import type { AuthoredQuestion } from './authoring';

const seeds: AuthoredQuestion[] = [
  {
    id: 'mil-001',
    category: 'miljo',
    subcategory: 'sparsam-korning',
    difficulty: 2,
    ruleTested: 'Sparsam körning',
    prompt: 'Vilket körsätt sänker bränsleförbrukningen mest?',
    answers: [
      ok('Jämn hastighet, tidig uppväxling och framförhållning så att du slipper bromsa.'),
      no('Låg växel och högt varvtal för bättre motorstyrning.', 'motorbroms-forbrukning'),
      no('Frihjulning i neutralläge i nedförsbackar.', 'motorbroms-forbrukning'),
      no('Snabb acceleration följt av utrullning.', 'motorbroms-forbrukning'),
    ],
    short: 'Jämn fart, tidig växling och framförhållning — varje inbromsning är bortkastad energi.',
    deep:
      'Det bränsle du använder för att accelerera omvandlas till värme i bromsarna varje gång du bromsar i onödan. Läs trafiken långt fram, släpp gasen tidigt mot rödljus, och håll en jämn hastighet. Frihjulning i neutralläge sparar inget: en modern motor med ilagd växel stryper bränsletillförseln nästan helt vid motorbromsning, medan tomgång alltid förbrukar bränsle.',
    memory: 'Varje onödig inbromsning är betald bensin som blir värme.',
    sources: [general('Sparsam körning, ecodriving')],
    related: ['mil-002'],
  },
  {
    id: 'mil-002',
    category: 'miljo',
    subcategory: 'sparsam-korning',
    difficulty: 2,
    ruleTested: 'Faktorer som påverkar förbrukningen',
    prompt: 'Vilket av följande ökar bränsleförbrukningen mest på en längre resa?',
    answers: [
      ok('Takbox eller takräcke som ökar luftmotståndet.'),
      no('En full tank bränsle.'),
      no('Att köra med luftkonditioneringen avstängd.'),
      no('Att köra med tända halvljus.'),
    ],
    short: 'Luftmotståndet dominerar vid högre hastigheter — ta av takboxen när den inte används.',
    deep:
      'Luftmotståndet växer med hastigheten i kvadrat och blir den dominerande faktorn över ungefär 80 km/h. En takbox kan öka förbrukningen med tiotals procent. Andra påverkande faktorer är lufttryck i däcken, onödig vikt i bilen och kortare resor med kall motor.',
    sources: [general('Sparsam körning, ecodriving')],
    related: ['mil-001', 'for-002'],
  },
  {
    id: 'mil-003',
    category: 'miljo',
    subcategory: 'sparsam-korning',
    difficulty: 2,
    ruleTested: 'Kallstart',
    prompt: 'Varför är korta resor med kall motor extra dåliga för miljön?',
    answers: [
      ok('Katalysatorn fungerar dåligt innan den blivit varm, och förbrukningen är då som högst.'),
      no('Motorn drar mer luft när den är kall.'),
      no('Bränslet fryser i ledningarna.'),
      no('Avgaserna blir varmare och därmed skadligare.'),
    ],
    short: 'Katalysatorn renar först när den är varm — och kallstarten drar mest bränsle.',
    deep:
      'Under de första kilometrarna kan förbrukningen vara betydligt högre än normalt samtidigt som reningen är sämst. Motorvärmare vid kall väderlek minskar både utsläpp och slitage. Att slå ihop flera korta ärenden till en resa ger stor effekt.',
    sources: [general('Fordonsteknik: avgasrening och kallstart')],
  },
  {
    id: 'mil-004',
    category: 'miljo',
    subcategory: 'miljopaverkan',
    difficulty: 2,
    ruleTested: 'Avgasers påverkan',
    prompt: 'Vilken effekt har koldioxid från vägtrafiken?',
    answers: [
      ok('Den bidrar till växthuseffekten och klimatförändringen.'),
      no('Den orsakar försurning av mark och vatten.'),
      no('Den bildar marknära ozon direkt.'),
      no('Den är direkt giftig att andas in i de halter som förekommer utomhus.'),
    ],
    short: 'Koldioxid är växthusgasen. Kväveoxider och partiklar är hälso- och närmiljöproblemen.',
    deep:
      'Kväveoxider bidrar till försurning, övergödning och bildning av marknära ozon, och är irriterande för luftvägarna. Partiklar, delvis från dubbdäckens vägslitage, påverkar hälsan i tätorter. Kolmonoxid är direkt giftigt men fångas till stor del av katalysatorn. Mängden koldioxid är direkt proportionell mot hur mycket bränsle du använder — därför är sparsam körning också klimatåtgärd.',
    sources: [general('Miljökunskap: vägtrafikens utsläpp')],
    related: ['mil-005'],
  },
  {
    id: 'mil-005',
    category: 'miljo',
    subcategory: 'miljopaverkan',
    difficulty: 2,
    ruleTested: 'Partiklar och dubbdäck',
    prompt: 'Vad är den främsta källan till partiklar i luften i svenska tätorter vintertid?',
    answers: [
      ok('Vägslitage från dubbdäck.'),
      no('Kondens från avgasrör.'),
      no('Vägsalt.'),
      no('Bromsvätska.'),
    ],
    short: 'Dubbdäck river upp asfalten och står för en stor del av partiklarna i städer.',
    deep:
      'Därför har flera kommuner infört förbud mot dubbdäck på vissa gator. Dubbfria vinterdäck fungerar väl på snö och i kyla, medan dubbdäck har fördel på ren is. Valet handlar om var och hur du kör.',
    sources: [general('Miljökunskap: partiklar och dubbdäck')],
    related: ['mil-004'],
  },
  {
    id: 'mil-006',
    category: 'miljo',
    subcategory: 'sparsam-korning',
    difficulty: 3,
    ruleTested: 'Hastighet och förbrukning',
    prompt: 'Du sänker farten från 110 till 90 km/h på en längre sträcka. Vad händer?',
    answers: [
      ok('Bränsleförbrukningen minskar märkbart, medan restiden bara ökar något.'),
      no('Förbrukningen är i princip oförändrad.'),
      no('Förbrukningen ökar eftersom motorn arbetar på lägre varvtal.'),
      no('Restiden ökar proportionellt mer än bränslebesparingen.'),
    ],
    short: 'Luftmotståndet växer i kvadrat — en liten fartsänkning ger en stor besparing.',
    deep:
      'På tio mil tar 90 km/h ungefär tolv minuter längre än 110 km/h, medan bränsleåtgången kan minska med i storleksordningen tiotals procent. Räknat i minuter per liter är sänkningen ofta en mycket god affär, och marginalerna i trafiken blir samtidigt större.',
    type: 'calculation',
    sources: [general('Sparsam körning, ecodriving')],
    related: ['mil-002'],
  },
];

export const miljoQuestions = buildQuestions(seeds);
