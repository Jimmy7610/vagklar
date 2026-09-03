# Vägmärkesbiblioteket

GENERERAD — kör `npm run report:signs`. Redigera inte för hand.

Märkena kommer från källans märkesbilaga där en användbar bild finns, och
från Vägklars egna ritningar där koden täcker flera varianter. Se
[LICENSED-SIGNS.md](LICENSED-SIGNS.md).

| | Antal |
| --- | ---: |
| Märken i registret | 115 |
| Med licensierad bokbild | 105 |
| På Vägklars ritning | 10 |
| Utan bild alls | 0 |
| Tilläggstavlor | 17 |
| Med visualTraits | 115 av 115 |
| Med foto i verklig trafik | 13 |
| Märke–foto-par | 16 |
| Använda i en lektion | 72 |
| Använda i en fråga | 53 |
| Bildmaterial på disk | 481 kB |

## Per serie

| Serie | Kategori | Antal | Licensierad bild | Ritning |
| --- | --- | ---: | ---: | ---: |
| A | Varningsmärken | 29 | 29 | 0 |
| B | Väjningspliktsmärken | 8 | 8 | 0 |
| C | Förbudsmärken | 27 | 22 | 5 |
| D | Påbudsmärken | 9 | 7 | 2 |
| E | Anvisningsmärken | 15 | 15 | 0 |
| F | Vägvisning | 4 | 4 | 0 |
| S | Fordonssymboler | 6 | 6 | 0 |
| T | Tilläggstavlor | 17 | 14 | 3 |

## Varianter under en kod

Föreskriften ger en kod till en hel familj. C31 är varje hastighetsgräns, D1
varje påbjuden riktning, T6 varje tidtavla — och boken trycker en bild per kod.
Att använda bokens C31 för `hastighet-90` vore att visa fel siffra, så de här
behåller sin ritning med flit.

| Kod | Varianter | Bild |
| --- | --- | --- |
| C31 | `hastighet-30`, `hastighet-50`, `hastighet-70`, `hastighet-90`, `hastighet-110` | Vägklars ritning |
| D1 | `pabud-rakt`, `pabud-hoger` | Vägklars ritning |
| T6 | `tavla-tid`, `tavla-tid-lordag`, `tavla-tid-helgdag` | Vägklars ritning |

## Märken med foto i verklig trafik

Varje par är kontrollerat genom att titta på fotografiet, inte genom att läsa
kapitelrubriken. Där utsnittet inte avgjorde vilket märke det var gjordes inget par.

| Märke | Kod | Fotografi |
| --- | --- | --- |
| `forbud-omkorning` | C27 | `omkorningsforbud-landsvag` |
| `forbud-parkera` | C35 | `forbud-att-parkera-overgangsstalle` |
| `forbud-stanna` | C39 | `forbud-stanna-gata` |
| `gagata` | E7 | `gagata-skyltad` |
| `hastighet-110` | C31 | `hastighet-100-ledsnummer` |
| `hastighet-50` | C31 | `hastighetsskylt-snotackt` |
| `kryssmarke` | A39 | `plankorsning-bommar` |
| `parkering` | E19 | `p-skylt-avgift-boende` |
| `stopp` | B2 | `stop-flervagsstopp`, `stopp-vid-signal` |
| `tavla-rorelsehindrade` | T7 | `p-skylt-rorelsehindrad-tid` |
| `vajningsplikt` | B1 | `cirkulation-med-trafik`, `korfaltspilar-cirkulation` |
| `varning-djur` | A19 | `viltvarning-med-tillaggstavla` |
| `varning-vagkorsning` | A28 | `varning-vagkorsning-stad`, `varning-vagkorsning-i-kurva` |

## Lätt att blanda ihop

Relationen läses åt båda hållen: skriver en post att den förväxlas med en
annan syns förväxlingen från båda märkena. Fyrtioåtta av kanterna i registret
är skrivna åt ett håll, och innan detaljvyn fanns nådde ingen av dem en läsare
över huvud taget.

| | Antal |
| --- | ---: |
| Märken med minst en förväxling | 111 av 115 |
| Skrivna på märket självt | 109 |
| Tillkommer genom att läsa relationen åt andra hållet | 2 |

Utan förväxling — och det är ett svar, inte en lucka. De här märkena har
inget bildspråk gemensamt med något annat i registret.

| Märke | Kod | Bild |
| --- | --- | --- |
| `varning-slirig-vag` | A10 | Varningsmärke: gul triangel med röd ram och en bil med slirspår bakom hjulen. |
| `varning-vagarbete` | A20 | Varningsmärke: gul triangel med röd ram och en figur som arbetar med en spade. |
| `varning-sidvind` | A24 | Varningsmärke: gul triangel med röd ram och en vindstrut som blåser åt sidan. |
| `varning-annan-fara` | A40 | Varningsmärke: gul triangel med röd ram och ett brett svart utropstecken utan punkt. |

## Tilläggstavlor

| Tavla | Kod | Vad den begränsar | Läses som |
| --- | --- | --- | --- |
| `tavla-tid` | T6 | time | gäller under den angivna tiden |
| `tavla-tid-lordag` | T6 | time | gäller lördagar under angiven tid |
| `tavla-tid-helgdag` | T6 | time | gäller söndagar och helgdagar under angiven tid |
| `tavla-avstand` | T2 | distance | märket gäller 100 m längre fram |
| `tavla-utstrackning` | T11 | extent | märket gäller på hela den utmärkta sträckan |
| `tavla-riktning` | T12 | direction | märket gäller i pilens riktning |
| `tavla-boende` | T19 | condition | gäller endast boende med tillstånd |
| `tavla-avgift` | T16 | condition | parkeringen är avgiftsbelagd |
| `tavla-flervagsstopp` | T14 | information | alla tillfarter i korsningen har stopplikt |
| `tavla-nedsatt-syn` | T9 | information | personer med nedsatt syn rör sig i området |
| `tavla-strackans-langd` | T1 | extent | gäller den närmaste sträckan på 1,2 km |
| `tavla-avstand-stopplikt` | T3 | distance | stopplikten kommer om 200 m |
| `tavla-fri-bredd` | T4 | condition | den fria bredden är 3,5 m |
| `tavla-totalvikt` | T5 | vehicle | gäller fordon över 3,5 t totalvikt |
| `tavla-rorelsehindrade` | T7 | vehicle | gäller endast fordon med parkeringstillstånd för rörelsehindrad |
| `tavla-flervagsvajning` | T13 | information | alla tillfarter i korsningen har väjningsplikt |
| `tavla-vagars-fortsattning` | T15 | information | den tjocka linjen visar hur den prioriterade vägen går genom korsningen |

## Märken som ingen lektion och ingen fråga använder

Ett märke som ingen undervisning rör vid kostar ändå bytes i förhandscachen.
Det är inte automatiskt fel — katalogen finns för att slås upp i — men listan
ska vara läsbar och motiverad.

| Märke | Kod | Serie |
| --- | --- | --- |
| `varning-nedforslutning` | A3 | A |
| `varning-stigning` | A4 | A |
| `varning-avsmalnande-vag` | A5 | A |
| `varning-ojamn-vag` | A8 | A |
| `varning-farthinder` | A9 | A |
| `varning-stenskott` | A11 | A |
| `varning-stenras` | A12 | A |
| `varning-gaende` | A14 | A |
| `varning-ridande` | A18 | A |
| `varning-flerfargssignal` | A22 | A |
| `varning-sidvind` | A24 | A |
| `varning-vajningsplikt-korsning` | A29 | A |
| `varning-ko` | A34 | A |
| `forbud-motordrivet` | C3 | C |
| `forbud-slap` | C6 | C |
| `forbud-tung-lastbil` | C7 | C |
| `forbud-farligt-gods` | C9 | C |
| `forbud-bredd` | C16 | C |
| `forbud-hojd` | C17 | C |
| `forbud-langd` | C18 | C |
| `forbud-bruttovikt` | C20 | C |
| `forbud-svang` | C25 | C |
| `forbud-u-svang` | C26 | C |
| `forbud-omkorning-lastbil` | C29 | C |
| `vandplats` | C42 | C |
| `pabud-korbana` | D2 | D |
| `pabud-gang-cykelbana-gemensam` | D6 | D |
| `motortrafikled-upphor` | E4 | E |
| `tattbebyggt-omrade-upphor` | E6 | E |
| `gagata-upphor` | E8 | E |
| `gangfartsomrade-upphor` | E10 | E |
| `rekommenderad-hastighet-upphor` | E12 | E |
| `sammanvavning` | E15 | E |
| `tavla-fri-bredd` | T4 | T |
| `varning-sparvagn` | A37 | A |
| `forbud-cykel-moped` | C10 | C |
| `forbud-moped-klass-2` | C11 | C |
| `forbud-ridning` | C14 | C |
| `forbud-gangtrafik` | C15 | C |
