import { buildQuestions, general, no, ok, teori } from './authoring';
import type { AuthoredQuestion } from './authoring';

/**
 * Beräkningsfrågor: reaktionssträcka, bromssträcka och stoppsträcka.
 *
 * All questions use the same two tumregler throughout, so a learner can build
 * one habit instead of memorising numbers:
 *
 *   reaktionssträcka = (hastighetens första siffra) × reaktionstid × 3
 *   bromssträcka     = (hastighetens första siffra)² × 0,4   [torr asfalt]
 *   stoppsträcka     = reaktionssträcka + bromssträcka
 *
 * Every explanation shows the arithmetic, because the point is the method,
 * not the answer.
 */

const seeds: AuthoredQuestion[] = [
  {
    id: 'ber-002',
    category: 'manniskan',
    subcategory: 'reaktion-och-sinnen',
    difficulty: 2,
    ruleTested: 'Reaktionssträcka vid längre reaktionstid',
    prompt:
      'Du kör i 50 km/h. Trötthet gör att din reaktionstid är 2 sekunder i stället för 1. Hur mycket längre blir reaktionssträckan?',
    answers: [
      ok('Den fördubblas, från cirka 15 till cirka 30 meter.'),
      no('Den ökar med cirka 50 procent.', 'reaktionstid-effekt'),
      no('Den fyrdubblas, eftersom sträckan ökar kvadratiskt.', 'reaktionstid-effekt'),
      no('Den påverkas inte — reaktionstiden ingår inte i reaktionssträckan.', 'reaktionstid-effekt'),
    ],
    short:
      'Reaktionssträckan växer rakt av med reaktionstiden: 5 × 1 × 3 = 15 m, och 5 × 2 × 3 = 30 m.',
    deep:
      'Notera skillnaden mot bromssträckan, som växer kvadratiskt med hastigheten. Reaktionssträckan är linjär i både hastighet och reaktionstid. Det är därför trötthet, alkohol och distraktion slår så direkt: de förlänger sträckan innan du ens hunnit röra bromsen.',
    type: 'calculation',
    sources: [general('Trafikverket'), teori('Reaktionssträckan kan bli längre av', 196)],
    tags: ['berakning', 'trotthet'],
  },
  {
    id: 'ber-003',
    category: 'manniskan',
    subcategory: 'reaktion-och-sinnen',
    difficulty: 2,
    ruleTested: 'Bromssträcka på torr asfalt',
    prompt:
      'Du kör i 50 km/h på torr asfalt med bra däck och bromsar. Ungefär hur lång blir bromssträckan?',
    answers: [
      ok('Cirka 10 meter.'),
      no('Cirka 15 meter.', 'bromsstracka-berakning'),
      no('Cirka 25 meter.', 'bromsstracka-berakning'),
      no('Cirka 5 meter.', 'bromsstracka-berakning'),
    ],
    short: 'Stryk sista siffran: 50 → 5. Sedan 5 × 5 = 25, och 25 × 0,4 = 10 meter.',
    deep:
      'Faktorn 0,4 kommer av att bromssträckan från 10 km/h på torrt underlag är ungefär 0,4 meter. Formeln utgår från det värdet och ökar det kvadratiskt. Den mer exakta varianten är s = v² / (250 × f), där f är friktionstalet — cirka 0,8 på torr asfalt: 50² / (250 × 0,8) = 12,5 meter.',
    memory: 'Stryk nollan, kvadrera, gånger 0,4.',
    type: 'calculation',
    sources: [general('Trafikverket'), teori('Räkna ut bromssträckan', 199)],
    tags: ['berakning', 'strackor'],
  },
  {
    id: 'ber-004',
    category: 'manniskan',
    subcategory: 'reaktion-och-sinnen',
    difficulty: 3,
    ruleTested: 'Stoppsträcka',
    prompt:
      'Sommar, torr väg, bra däck och bromsar. Du kör i 90 km/h med reaktionstiden 1 sekund. Ungefär hur lång blir stoppsträckan?',
    answers: [
      ok('Cirka 59 meter.'),
      no('Cirka 32 meter.', 'stoppstracka-berakning'),
      no('Cirka 27 meter.', 'stoppstracka-berakning'),
      no('Cirka 90 meter.', 'stoppstracka-berakning'),
    ],
    short:
      'Reaktionssträcka: 9 × 1 × 3 = 27 m. Bromssträcka: 9 × 9 × 0,4 = 32 m. Stoppsträcka: 27 + 32 = 59 meter.',
    deep:
      'Stoppsträckan är alltid summan av de två. Att svara 32 meter är att glömma sträckan du färdas innan bromsen tar; att svara 27 meter är att glömma själva inbromsningen. Det är just den summan som avgör om du hinner stanna före ett hinder du precis fått syn på.',
    memory: 'Stoppsträcka = reaktion + broms. Alltid båda.',
    type: 'calculation',
    sources: [general('Trafikverket'), teori('Räkna ut stoppsträckan', 200)],
    tags: ['berakning', 'strackor'],
    related: ['ber-003'],
  },
  {
    id: 'ber-008',
    category: 'hastighet',
    subcategory: 'avstand',
    difficulty: 3,
    ruleTested: 'Tresekundersregeln',
    prompt:
      'Du kör i 80 km/h och håller tre sekunders avstånd till bilen framför. Ungefär hur långt är avståndet i meter?',
    answers: [
      ok('Cirka 67 meter.'),
      no('Cirka 24 meter.', 'sekundregel-avstand'),
      no('Cirka 40 meter.', 'sekundregel-avstand'),
      no('Cirka 100 meter.', 'sekundregel-avstand'),
    ],
    short:
      '80 / 3,6 ≈ 22 meter per sekund. Tre sekunder blir alltså cirka 67 meter.',
    deep:
      'Poängen med att räkna i sekunder i stället för meter är att avståndet då anpassar sig automatiskt till farten. Vid halt väglag bör du utöka rejält — tänk snarare sex sekunder än tre, eftersom bromssträckan kan bli flera gånger längre.',
    type: 'calculation',
    sources: [general('Trafikverket'), teori('Hålla rätt avstånd', 80)],
    tags: ['berakning', 'avstand'],
    related: ['has-005'],
  },
  {
    id: 'ber-009',
    category: 'manniskan',
    subcategory: 'reaktion-och-sinnen',
    difficulty: 3,
    ruleTested: 'Vad reaktionstiden beror på',
    prompt: 'Hur påverkas reaktionstiden av att bilens däck är slitna?',
    answers: [
      ok('Inte alls — reaktionstiden beror på dig som människa, inte på bilen.'),
      no('Den blir längre, eftersom bilen reagerar långsammare.', 'reaktionstid-bilen'),
      no('Den blir kortare, eftersom du kör mer försiktigt.', 'reaktionstid-bilen'),
      no('Den blir längre, men bara på vått väglag.', 'reaktionstid-bilen'),
    ],
    short:
      'Slitna däck förlänger bromssträckan, inte reaktionstiden. Reaktionstiden är din, inte bilens.',
    deep:
      'Det som förlänger reaktionstiden är trötthet, alkohol, droger, läkemedel och att du måste välja mellan handlingsalternativ. Det som förkortar den är att du redan förväntar dig faran. Bilens skick hör hemma i bromssträckan.',
    type: 'calculation',
    sources: [general('Trafikverket'), teori('Testa dina kunskaper', 203)],
    tags: ['berakning', 'strackor'],
    related: ['ber-002'],
  },
  {
    id: 'ber-010',
    category: 'manniskan',
    subcategory: 'reaktion-och-sinnen',
    difficulty: 2,
    ruleTested: 'Vad som påverkar bromssträckan',
    prompt: 'Vilket av följande påverkar INTE bromssträckans längd?',
    answers: [
      ok('Din reaktionstid.'),
      no('Vägens lutning och väglag.', 'bromsstracka-faktorer'),
      no('Bilens last.', 'bromsstracka-faktorer'),
      no('Bromsarnas skick.', 'bromsstracka-faktorer'),
    ],
    short:
      'Reaktionstiden hör till reaktionssträckan. Bromssträckan påverkas av hastighet, väglag, lutning, last och bromsarnas skick.',
    type: 'calculation',
    sources: [general('Trafikverket'), teori('Bromssträckans längd påverkas av', 198)],
    tags: ['berakning', 'strackor'],
    related: ['ber-009'],
  },
  {
    id: 'rtp-003',
    category: 'trafikregler',
    subcategory: 'rattspraxis',
    difficulty: 3,
    ruleTested: 'Hastighet som bedömningsgrund',
    prompt:
      'Efter en olycka i en kurva med skymd sikt bedöms förarens hastighet. Vad väger tyngst i en sådan bedömning?',
    answers: [
      ok('Om hastigheten var anpassad till sikten och väglaget, inte bara om skylten följdes.'),
      no('Enbart om hastighetsgränsen överskreds.', 'skylt-som-facit'),
      no('Om föraren hade kört sträckan tidigare.', 'skylt-som-facit'),
      no('Om bilen var besiktigad i tid.', 'skylt-som-facit'),
    ],
    short:
      'Skylten anger ett tak, inte en rekommendation. Kravet är att du ska kunna stanna framför förutsägbara hinder.',
    deep:
      'Att hålla skyltad hastighet i en kurva med skymd sikt och halt väglag kan alltså vara för fort. Bedömningen utgår från vad föraren hade kunnat se och hinna göra — samma resonemang som ligger bakom regeln om anpassad hastighet.',
    sources: [teori('Anpassa hastigheten', 9), teori('Rättsfall', 362)],
    tags: ['rattsfall', 'hastighet'],
    related: ['rtp-001'],
  },
];

export const berakningarQuestions = buildQuestions(seeds);
