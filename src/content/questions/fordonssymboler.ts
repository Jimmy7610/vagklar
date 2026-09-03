import { buildQuestions, no, ok, sign, teori, trf, vmf } from './authoring';
import type { AuthoredQuestion } from './authoring';

/**
 * Frågor på fordonssymboler och vägvisning.
 *
 * Båda serierna kom in i registret när bokens märkesbilaga blev användbar, och
 * båda är värda frågor av samma skäl: de ändrar vad ett annat märke betyder
 * utan att själva förbjuda något.
 *
 * En fordonssymbol under ett märke avgör *vem* regeln gäller. En vägvisare
 * avgör *vilket körfält* du behöver ligga i, och läses långt före korsningen.
 * Ingen av dem är igenkänningsfrågor — det som prövas är följden.
 */
const seeds: AuthoredQuestion[] = [
  {
    id: 'sym-001',
    category: 'parkering',
    subcategory: 'parkeringsforbud',
    difficulty: 2,
    ruleTested: 'Fordonssymbol som avgränsar ett förbud',
    prompt:
      'Under ett parkeringsförbud sitter en symboltavla med en lastbil. Du kör personbil. Vad gäller för dig?',
    answers: [
      ok('Du får parkera — förbudet gäller bara tung lastbil.'),
      no('Du får inte parkera; symbolen är bara en upplysning.', 'symboltavla-avgransning'),
      no('Du får parkera i högst 24 timmar.', 'symboltavla-avgransning'),
      no('Du får parkera bara om du också kör med släp.', 'symboltavla-avgransning'),
    ],
    short:
      'En symboltavla begränsar märket ovanför till det fordonsslag som är avbildat. Är symbolen en lastbil gäller förbudet lastbilar.',
    deep:
      'Tänk på tavlan som en mening som fortsätter märket: "parkering förbjuden — för tung lastbil". Utan symbolen gällde förbudet alla. Med den gäller det bara det avbildade slaget, och alla andra får parkera som vanligt.',
    sources: [vmf('T8'), trf('3 kap. 54 §')],
    type: 'road-sign',
    image: sign('symbol-tung-lastbil', 'Svart konturteckning av en lastbil med skåp, sedd från sidan.'),
    tags: ['tillaggstavla', 'parkering', 'fordonsslag'],
  },
  {
    id: 'sym-002',
    category: 'last',
    subcategory: 'slapvagn',
    difficulty: 3,
    ruleTested: 'Symboltavla med släpkärra',
    prompt:
      'Du kör personbil med tillkopplad släpkärra. Under ett förbudsmärke sitter en tavla med den här symbolen. Vad betyder det?',
    answers: [
      ok('Förbudet gäller dig, eftersom du kör med släp.'),
      no('Förbudet gäller bara den som kör släpet utan dragbil.', 'symboltavla-avgransning'),
      no('Förbudet gäller bara tunga släp över 750 kg.', 'symboltavla-avgransning'),
      no('Symbolen upphäver förbudet för personbilar med släp.', 'symboltavla-avgransning'),
    ],
    short:
      'Symbolen pekar ut fordonskombinationen. Kör du med släp är det ekipaget som omfattas, inte bilen ensam.',
    deep:
      'Det är samma logik som för lastbilssymbolen, fast åt andra hållet: här är du innanför avgränsningen i stället för utanför. Kopplar du loss släpet gäller förbudet inte längre dig.',
    sources: [vmf('T8'), teori('Tilläggstavlor', 346)],
    type: 'road-sign',
    // Beskriven utan att namnge fordonsslaget: frågan handlar om vem regeln
    // gäller, och att läsa upp namnet vore att peka ut svaret.
    image: sign('symbol-slapkarra', 'Svart konturteckning av ett litet öppet fordon med dragstång och ett synligt hjul, sett från sidan.'),
    tags: ['tillaggstavla', 'slapvagn'],
  },
  {
    id: 'sym-003',
    category: 'vagmarken',
    subcategory: 'anvisningsmarken',
    difficulty: 2,
    ruleTested: 'Att läsa en tabellvägvisare',
    prompt:
      'Du närmar dig en korsning med en tabellvägvisare där tre orter står på var sin rad. Hur läser du den?',
    answers: [
      ok('Du följer pilen på raden där ditt mål står.'),
      no('Du följer den översta pilen, som gäller hela skylten.', 'vagvisning-rad'),
      no('Du följer den nedersta pilen, som gäller närmaste avfart.', 'vagvisning-rad'),
      no('Pilarna visar bara avstånd, inte riktning.', 'vagvisning-rad'),
    ],
    short:
      'Varje rad är sitt eget besked: ett mål, ett vägnummer och en pil som hör ihop. Raderna gäller olika håll.',
    deep:
      'Skylten sitter före korsningen just för att du ska hinna byta körfält. Att läsa fel rad märks först när du redan står i fel fält, och då är omkörningen eller filbytet tvunget att ske sent — vilket är precis det vägvisningen finns för att slippa.',
    sources: [vmf('F6'), teori('Lokaliseringsmärken', 337)],
    type: 'road-sign',
    image: sign(
      'tabellvagvisare',
      'Blå fyrkantig skylt med vit ram och tre rader, var och en med en vit pil, ett vägnummer i en ruta och ett ortnamn.',
    ),
    tags: ['vagvisning', 'korfalt'],
  },
  {
    id: 'sym-004',
    category: 'vagmarken',
    subcategory: 'anvisningsmarken',
    difficulty: 2,
    ruleTested: 'Vad ett lokaliseringsmärke inte gör',
    prompt: 'Vad reglerar ett vägvisningsmärke?',
    answers: [
      ok('Ingenting — det upplyser om vart vägen leder.'),
      no('Det anger högsta tillåtna hastighet mot det målet.', 'vagvisning-reglerar'),
      no('Det ger företräde åt trafik mot det utpekade målet.', 'vagvisning-reglerar'),
      no('Det påbjuder att du kör den vägen.', 'vagvisning-reglerar'),
    ],
    short:
      'Vägvisning är information. Den ändrar inga regler — hastighet, väjningsplikt och förbud står på andra märken.',
    deep:
      'Det spelar roll i en korsning där mycket information möts samtidigt. Vägvisaren talar om vart du ska; väjningsmärket talar om vem som får köra. Att blanda ihop dem är att tro att den som följer skyltningen också har företräde.',
    sources: [vmf('F5'), teori('Lokaliseringsmärken', 337)],
    type: 'road-sign',
    image: sign('vagvisare', 'Blå pilformad skylt med vit ram och ett ortnamn följt av en siffra.'),
    tags: ['vagvisning'],
  },
];

export const fordonssymbolerQuestions = buildQuestions(seeds);
