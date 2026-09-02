# Sidgranskning av källhänvisningar

GENERERAD — kör `npm run audit:pages`. Kräver det licensierade källdokumentet lokalt.

Granskningen jämför varje sidhänvisning mot den faktiska texten på sidan. En sida
som bara ligger inom 1–367 bevisar ingenting; det som kontrolleras är om
sidan verkligen handlar om det frågan prövar.

| | Antal |
| --- | ---: |
| Frågor med sidhänvisning | 288 |
| Sidhänvisningar granskade | 299 |
| Bekräftat stöd | 251 |
| Fel | 0 |
| Varningar | 46 |
| Granskade undantag | 2 |

## Fel — 0 st

Inga.

## Varningar — 46 st

| Fråga | Sida | Kod | Vad |
| --- | ---: | --- | --- |
| `vaj-008` | 41 | page-weak-support | Svag överlappning (pilens, riktning) och inget ord ur "Grön pil". |
| `has-009` | 190 | page-outside-chapter | Sidan ligger utanför kapitlen för "hastighetsgranser" (6–13, 116–123). |
| `cir-009` | 50 | page-outside-chapter | Sidan ligger utanför kapitlen för "cirkulationsplats" (58–67). |
| `jvg-002` | 112 | page-is-plate | Bildplansch som inte namnger "Ljussignal vid plankorsning" (och frågan är inte bildburen). |
| `jvg-012` | 109 | page-weak-support | Svag överlappning (långt) och inget ord ur "Långsamma fordon vid plankorsning". |
| `rtp-001` | 362 | page-weak-support | Svag överlappning (korsning) och inget ord ur "Aktsamhetsplikten framför formell rätt". |
| `rtp-002` | 362 | page-weak-support | Svag överlappning (varför, rättsfall) och inget ord ur "Bevisning och eget ansvar". |
| `krf-014` | 263 | page-outside-chapter | Sidan ligger utanför kapitlen för "korfaltsbyte" (14–21). |
| `fsl-005` | 18 | page-outside-chapter | Sidan ligger utanför kapitlen för "fordonsslag" (188–195). |
| `drv-005` | 306 | page-outside-chapter | Sidan ligger utanför kapitlen för "sparsam-korning" (312–317). |
| `drv-006` | 306 | page-outside-chapter | Sidan ligger utanför kapitlen för "sparsam-korning" (312–317). |
| `drv-007` | 305 | page-outside-chapter | Sidan ligger utanför kapitlen för "sparsam-korning" (312–317). |
| `drv-008` | 306 | page-outside-chapter | Sidan ligger utanför kapitlen för "sparsam-korning" (312–317). |
| `drv-015` | 319 | page-weak-support | Svag överlappning (ingen, utsläpp) och inget ord ur "Elbilens miljöpåverkan". |
| `rtp-003` | 9 | page-outside-chapter | Sidan ligger utanför kapitlen för "rattspraxis" (362–367). |
| `rtp-003` | 362 | page-weak-support | Svag överlappning (förarens) och inget ord ur "Hastighet som bedömningsgrund". |
| `bld-004` | 31 | page-is-plate | Bildplansch som inte namnger "Att läsa av en korsning" (och frågan är inte bildburen). |
| `bld-005` | 34 | page-weak-support | Svag överlappning (lastbilen, långt) och inget ord ur "Tunga fordon i korsning". |
| `vmk-004` | 327 | page-is-plate | Bildplansch som inte namnger "Väjningsplikt (B1)". |
| `vmk-005` | 327 | page-is-plate | Bildplansch som inte namnger "Huvudled (B4)". |
| `vmk-006` | 327 | page-is-plate | Bildplansch som inte namnger "Huvudled upphör (B5)". |
| `vmk-007` | 327 | page-is-plate | Bildplansch som inte namnger "Stopplikt kontra väjningsplikt". |
| `vmk-011` | 328 | page-is-plate | Bildplansch som inte namnger "Förbud mot infart (C1)". |
| `vmk-018` | 18 | page-outside-chapter | Sidan ligger utanför kapitlen för "pabudsmarken" (324–361). |
| `vmk-019` | 333 | page-is-plate | Bildplansch som inte namnger "Motorväg (E1)". |
| `vmk-020` | 333 | page-is-plate | Bildplansch som inte namnger "Motorväg upphör (E2)". |
| `vmk-033` | 111 | page-outside-chapter | Sidan ligger utanför kapitlen för "varningsmarken" (324–361). |
| `vmk-037` | 8 | page-outside-chapter | Sidan ligger utanför kapitlen för "varningsmarken" (324–361). |
| `vmk-038` | 8 | page-outside-chapter | Sidan ligger utanför kapitlen för "varningsmarken" (324–361). |
| `bl2-008` | 16 | page-outside-chapter | Sidan ligger utanför kapitlen för "anvisningsmarken" (116–123, 324–361). |
| `bl2-009` | 91 | page-weak-support | Svag överlappning (motorväg) och inget ord ur "Stillastående fordon på vägrenen". |
| `bl2-010` | 17 | page-weak-support | Svag överlappning (körfält) och inget ord ur "Sammanvävning". |
| `bl2-012` | 124 | page-outside-chapter | Sidan ligger utanför kapitlen för "omkorningsregler" (98–107). |
| `bl2-013` | 78 | page-is-plate | Bildplansch som inte namnger "Vägkantens bärighet". |
| `bl2-014` | 82 | page-outside-chapter | Sidan ligger utanför kapitlen för "korfalt-och-sving" (14–21). |
| `bl2-015` | 169 | page-outside-chapter | Sidan ligger utanför kapitlen för "skymd-sikt" (6–13). |
| `bl2-018` | 80 | page-weak-support | Svag överlappning (vägens) och inget ord ur "Kantlinjens betydelse". |
| `bl3-006` | 155 | page-outside-chapter | Sidan ligger utanför kapitlen för "skymd-sikt" (6–13). |
| `grd-004` | 232 | page-outside-chapter | Sidan ligger utanför kapitlen för "grundregler" (6–13). |
| `grd-008` | 39 | page-outside-chapter | Sidan ligger utanför kapitlen för "vagens-anvandning" (6–13). |
| `grd-013` | 334 | page-is-plate | Bildplansch som inte namnger "Parkeringsmärket". |
| `mns-013` | 134 | page-weak-support | Svag överlappning (risken, innan) och inget ord ur "Känslor och körning". |
| `mns-036` | 124 | page-weak-support | Svag överlappning (först) och inget ord ur "Riskkompensation". |
| `mns-038` | 134 | page-outside-chapter | Sidan ligger utanför kapitlen för "riskbedomning" (174–187). |
| `mns-040` | 103 | page-outside-chapter | Sidan ligger utanför kapitlen för "reaktion-och-sinnen" (78–89, 140–147, 154–161, 196–203). |
| `mrk-013` | 8 | page-outside-chapter | Sidan ligger utanför kapitlen för "vagmarkeringar" (324–361). |

## Bildernas sidhänvisningar — 62 st

Varje godkänd källbild anger sidan den är hämtad från. Kontrollen är enklare än
för frågorna — en figursida bär etiketter, inte meningar — men den fångar det som
faktiskt går fel: ett sidnummer utanför källan, eller ett som hamnat i fel
kapitel. Avdelare och självtestsidor räknas inte som fel här — i den här boken
är en kapitelavdelare ett helsidesfoto, och självtesten är illustrerade.

En varning här är sällan ett fel. En bilds kapitel är det kapitel den *lär ut*,
och ett fotografi av en vägvisarportal hör till vägmärken även när det är taget
ur motorvägskapitlet. Vad varningen fångar är sidnummer som hamnat helt fel.

| | Antal |
| --- | ---: |
| Bekräftade | 55 |
| Fel | 0 |
| Varningar | 7 |

| Bild | Sida | Kod | Vad |
| --- | ---: | --- | --- |
| `motorvag-portal-vagvisare` | 89 | page-outside-chapter | Sidan ligger utanför kapitlet "vagmarken" (324–361). |
| `korfaltsvagvisare-korsning` | 84 | page-outside-chapter | Sidan ligger utanför kapitlet "vagmarken" (324–361). |
| `hastighet-100-ledsnummer` | 95 | page-outside-chapter | Sidan ligger utanför kapitlet "vagmarken" (324–361). |
| `avfart-hastighet-50` | 92 | page-outside-chapter | Sidan ligger utanför kapitlet "vagmarken" (324–361). |
| `gagata-skyltad` | 119 | page-outside-chapter | Sidan ligger utanför kapitlet "vagmarken" (324–361). |
| `pabjuden-korriktning-parkering` | 131 | page-outside-chapter | Sidan ligger utanför kapitlet "vagmarken" (324–361). |
| `motortrafikled-avsmalning` | 85 | page-outside-chapter | Sidan ligger utanför kapitlet "motorvag" (90–97). |

## Granskade undantag — 2 st

Hänvisningar som kontrollen flaggar men som en människa läst sidan för och
funnit korrekta. De står kvar i rapporten i stället för att döljas.

| Fråga | Sida | Vad som faktiskt står där |
| --- | ---: | --- |
| `grd-009` | 6 | Sidan beskriver aktsamhetsplikten i bokens egna ord — hänsyn, omsorg, varsamhet, "hindra eller störa i onödan" — men använder aldrig ordet aktsamhetsplikt. |
| `mns-037` | 134 | Sidan är bokens avsnitt om sannolikhetsinlärning och bygger resonemanget på erfarenhet vid järnvägskorsning. Vägklar formulerar samma sak som tillbud och utfall. |

## Om varningarna

En varning betyder "titta på den här", inte "den är fel". Svenska sammansättningar
gör att en sida kan stödja en regel utan att dela ord med frågan, och en regel kan
nämnas i flera kapitel. Fel är hårdare: sidan finns inte, saknar text, eller delar
inte ett enda nyckelord med frågan.
