import { buildQuestions, no, ok, teori, trf, tvk, vmf } from './authoring';
import type { AuthoredQuestion } from './authoring';

/**
 * Bildfrågor, omgång tre: verklig trafikmiljö.
 *
 * Samma inträdesprov som i de tidigare omgångarna — bilden måste bära något
 * texten inte klarar. Det som kvalificerar här är nästan alltid *hur lite* man
 * ser: hur smal luckan mellan cyklisten och de parkerade bilarna faktiskt är,
 * hur mycket två bussar döljer, hur en isig väg ser hanterbar ut i solsken.
 * Det går att beskriva i en mening, men det övertygar ingen förrän man ser det.
 *
 * Bildtexten är avstängd i frågeläget. Registrets bildtext förklarar vad
 * fotot lär ut, vilket är precis det frågan ber eleven komma fram till.
 */
const seeds: AuthoredQuestion[] = [
  {
    id: 'bl3-001',
    category: 'risker',
    subcategory: 'skymd-sikt',
    difficulty: 2,
    ruleTested: 'Sidoavstånd till cyklist',
    prompt: 'Du närmar dig cyklisten på bilden. Vad är viktigast just nu?',
    sourceImageId: 'cyklist-mellan-parkerade',
    answers: [
      ok('Att sänka farten och vänta med att passera tills du kan ge ordentligt sidoavstånd.'),
      no('Att passera snabbt så att cyklisten slipper ha dig bakom sig.', 'omkorning-cyklist'),
      no('Att ligga kvar precis bakom cyklisten och blinka så att hen flyttar sig.', 'omkorning-cyklist'),
      no('Att köra förbi tätt intill, eftersom cyklisten ska hålla sig till kanten.', 'omkorning-cyklist'),
    ],
    short:
      'Cyklisten kör i dörrzonen längs de parkerade bilarna och kan behöva svänga ut när som helst. Utan utrymme att ge finns det ingen omkörning att göra.',
    deep:
      'Gatan är precis så bred att en omkörning känns möjlig, och det är just därför den är farlig. En bildörr som öppnas tvingar cyklisten åt vänster i samma sekund — mot den plats du skulle ha varit på. Vänta tills du kan lämna det utrymme som en öppen dörr kräver, inte det som ryms.',
    sources: [trf('3 kap. 33 §'), teori('Defensiv körning', 7)],
    tags: ['cyklist', 'sidoavstand', 'stadsmiljo'],
  },
  {
    id: 'bl3-002',
    category: 'risker',
    subcategory: 'barn-och-oskyddade',
    difficulty: 2,
    ruleTested: 'Stannade bussar skymmer',
    prompt: 'Vad ska du framför allt vara beredd på i den här situationen?',
    sourceImageId: 'bussar-vid-hallplats',
    answers: [
      ok('Att någon kliver ut i körbanan framför den främre bussen.'),
      no('Att den främre bussen backar ut från hållplatsen.', 'buss-hallplats'),
      no('Att bussarna svänger vänster utan att blinka.', 'buss-hallplats'),
      no('Att trafiken bakom dig kör om till höger.', 'buss-hallplats'),
    ],
    short:
      'En stannad buss döljer hela ytan framför sig. Den som klivit av syns först när hen redan är ute i din körbana.',
    deep:
      'Farten måste alltså vara vald innan du är i jämnhöjd med den första bussen, inte när du ser något röra sig. Räkna dessutom med att fler bussar innebär fler passagerare och fler riktningar de kan gå åt.',
    sources: [trf('3 kap. 1 §'), teori('Barn', 168)],
    tags: ['barn', 'buss', 'skymd-sikt'],
  },
  {
    id: 'bl3-003',
    category: 'risker',
    subcategory: 'skymd-sikt',
    difficulty: 3,
    ruleTested: 'Enfilig passage med skymd utfart',
    prompt: 'Hur bör du köra in i viadukten på bilden?',
    sourceImageId: 'smal-viadukt-skymd-utfart',
    answers: [
      ok('Sänk farten och var beredd att stanna — passagen rymmer bara ett fordon och du ser inte igenom den.'),
      no('Håll farten, eftersom du kom fram till öppningen först.', 'foretrade-tas'),
      no('Tuta innan du kör in, så vet mötande att du kommer.', 'foretrade-tas'),
      no('Kör in i mitten av valvet så att du får marginal åt båda hållen.', 'foretrade-tas'),
    ],
    short:
      'Ingen väjningsregel avgör den här passagen. Det som avgör är att du inte kan se om någon redan är inne i den.',
    deep:
      'Är passagen skyltad med väjningsplikt mot mötande gäller den. Saknas skylt får den som har fri väg köra först, men "fri väg" kan du inte avgöra här — vägen svänger direkt bakom valvet. Farten ska därför vara sådan att du kan stanna inom den sträcka du faktiskt överblickar.',
    sources: [trf('3 kap. 8 §'), tvk()],
    tags: ['skymd-sikt', 'mote', 'landsvag'],
  },
  {
    id: 'bl3-004',
    category: 'halka',
    subcategory: 'vinterkorning',
    difficulty: 2,
    ruleTested: 'Väglag i solsken',
    prompt: 'Vad säger vägbanan på bilden om greppet?',
    sourceImageId: 'isig-landsvag-utan-linjer',
    answers: [
      ok('Att greppet är dåligt — vägbanan är packad snö och is, oavsett att solen skiner.'),
      no('Att greppet är bra, eftersom vägen är torr i solen.', 'solsken-grepp'),
      no('Att greppet är bra i hjulspåren och dåligt utanför dem.', 'solsken-grepp'),
      no('Att det inte går att avgöra utan att bromsa och känna efter.', 'solsken-grepp'),
    ],
    short:
      'Packad snö och blankslitna hjulspår ger lite grepp. Klart väder gör underlaget synligt, inte bättre.',
    deep:
      'Att inga vägmarkeringar syns är den andra upplysningen bilden ger: du vet inte var körbanan slutar, så både fart och placering får bedömas på hjulspåren och på snöstörarna i kanten. Kurvan längre fram gör att marginalen behöver finnas redan nu.',
    sources: [teori('Förrädiskt väglag', 124), trf('3 kap. 14 §')],
    tags: ['vinter', 'halka', 'vaglag'],
  },
  {
    id: 'bl3-005',
    category: 'trafikregler',
    subcategory: 'cykelpassage-overfart',
    difficulty: 3,
    ruleTested: 'Huvudled och cykelpassage',
    prompt:
      'Du kör på huvudleden och närmar dig cykelpassagen på bilden. Vad gäller mot cyklisterna?',
    sourceImageId: 'huvudled-cykelpassage',
    answers: [
      ok('Du ska anpassa hastigheten så att ingen fara uppstår — huvudleden gäller inte mot passagen.'),
      no('Du har företräde, eftersom huvudledsmärket gäller för hela sträckan.', 'huvudled-innebord'),
      no('Du har full väjningsplikt mot alla cyklister på passagen.', 'cykelpassage-vajning'),
      no('Cyklisterna har alltid väjningsplikt, så du kan hålla farten.', 'cykelpassage-vajning'),
    ],
    short:
      'Huvudleden ger dig företräde mot korsande vägar. En cykelpassage tvärs över din egen körbana är något annat: där gäller anpassad hastighet.',
    deep:
      'Skillnaden mot en cykelöverfart är avgörande. En överfart har vägmärket B8 och en väjningslinje och ger full väjningsplikt; en passage har bara rutorna i vägbanan och ger krav på anpassad hastighet. Huvudledsmärket ändrar ingetdera.',
    sources: [trf('3 kap. 61 §'), vmf('2 kap. B4'), teori('Cykelpassage', 51)],
    tags: ['huvudled', 'cykelpassage'],
  },
  {
    id: 'bl3-006',
    category: 'risker',
    subcategory: 'skymd-sikt',
    difficulty: 2,
    ruleTested: 'Luckor mellan parkerade fordon',
    prompt: 'Var är risken störst på den här gatan?',
    sourceImageId: 'gaende-mellan-parkerade',
    answers: [
      ok('I luckorna mellan de parkerade fordonen.'),
      no('Bakom den vita lastbilen, där gatan smalnar av.', 'skymd-sikt-parkerade'),
      no('Vid husväggen, där någon kan öppna en port.', 'skymd-sikt-parkerade'),
      no('På gatstenen, som är hal när den är blöt.', 'skymd-sikt-parkerade'),
    ],
    short:
      'Där fordonen står tätt ser du ingen. Där det finns en lucka kan någon kliva ut — och det är där du också först kan upptäcka dem.',
    deep:
      'Lastbilen skymmer mest, men den skymmer också konsekvent: du vet att du inte ser bakom den. Luckorna är svårare, eftersom de ger en känsla av överblick utan att ge tid. Sänk farten och lägg dig så långt från fordonsraden som gatan tillåter.',
    sources: [trf('3 kap. 1 §'), teori('Bedöma vad som händer', 155)],
    tags: ['skymd-sikt', 'parkerade-fordon', 'stadsmiljo'],
  },
  {
    id: 'bl3-007',
    category: 'trafikregler',
    subcategory: 'vagens-anvandning',
    difficulty: 3,
    ruleTested: 'Kryssmärke vid spårväg',
    prompt: 'Vad betyder det vita kryssmärket på stolpen till höger?',
    sourceImageId: 'sparvagn-kryssmarke',
    answers: [
      ok('Att korsningen med spårvägen är här — märket står vid själva korsningen.'),
      no('Att spårvägen korsar vägen längre fram.', 'kryssmarke-varning'),
      no('Att spårvagnen har väjningsplikt mot dig.', 'kryssmarke-varning'),
      no('Att det är förbjudet att stanna på spåren.', 'kryssmarke-varning'),
    ],
    short:
      'Kryssmärket markerar platsen. Varningstriangeln ovanför varnade för den redan innan du kom fram.',
    deep:
      'Den gula tavlan under märkena säger dessutom vad korsningen kräver: lämna fri väg för spårvagn. En spårvagn kan varken väja eller stanna på samma sträcka som du — det är hela skälet till att företrädet ligger där det ligger.',
    sources: [vmf('2 kap. A37, A39'), trf('3 kap. 24 §')],
    tags: ['sparvagn', 'vagmarke', 'stadsmiljo'],
  },
  {
    id: 'bl3-008',
    category: 'korsningar',
    subcategory: 'polisens-tecken',
    difficulty: 2,
    ruleTested: 'Signal före vägmärke',
    prompt: 'Signalen lyser grönt och väjningspliktsmärket står kvar. Vad gäller?',
    sourceImageId: 'signal-over-vajningsmarke',
    answers: [
      ok('Du får köra utan att väja — signalen står över vägmärket.'),
      no('Du måste ändå väja, eftersom märket gäller hela korsningen.', 'rangordning-anvisningar'),
      no('Du väjer för trafik från höger, eftersom märket upphäver signalen.', 'rangordning-anvisningar'),
      no('De tar ut varandra, så du kör efter eget omdöme.', 'rangordning-anvisningar'),
    ],
    short:
      'Rangordningen är polisens tecken, trafiksignal, vägmärke, allmän regel. Grön signal betyder kör, även under ett väjningspliktsmärke.',
    deep:
      'Märket är inte fel och ska inte tas ner: det är det som gäller när signalen är släckt eller ur funktion. Räkna ändå med att någon annan läser situationen tvärtom, och håll marginalen ut i korsningen.',
    sources: [trf('2 kap. 2 §'), teori('Rangordning', 8)],
    tags: ['rangordning', 'trafiksignal'],
  },
];

export const bildfragor3Questions = buildQuestions(seeds);
