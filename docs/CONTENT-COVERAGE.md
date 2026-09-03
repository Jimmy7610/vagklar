# Innehållstäckning

> **Genererad fil.** Redigera den inte för hand — kör `npm run report:coverage`.

## Vad rapporten mäter

Kursplanen i `src/content/curriculum/curriculum.ts` beskriver vad ett B-körkort
kräver, kapitel för kapitel och begrepp för begrepp. Rapporten jämför den kartan
mot frågebanken, teoriskolan och Scenariolabbet, och visar var Vägklar har
material och var det saknas.

Ett begrepp räknas som **täckt** först när det har tillräckligt många frågor —
inte så snart det har en enda. Det är därför "täckta" alltid är färre än
"begrepp med något material alls".

Trösklar per begrepp: **Tunn** = 1–2 frågor, **Täckt** = 3–5, **Stark** = 6 eller fler.

Rapporten mäter *mängd*, inte *kvalitet*. "Stark" betyder att det finns frågor —
inte att någon har granskat dem, och inte att de är verifierade mot gällande rätt.

## Sammanfattning

| Mått | Värde |
| --- | ---: |
| Huvudområden | 6 |
| Kapitel | 39 |
| Begrepp | 179 |
| Begrepp med tillräckligt (≥ 3 frågor) | 179 (100 %) |
| Begrepp med för få (1–2 frågor) | 0 |
| Begrepp helt utan frågor | 0 |
| Begrepp utan plats i taxonomin | 0 |
| Frågor i banken | 458 |
| Frågor kopplade till ett begrepp | 458 |
| Frågor utan koppling | 0 |
| Lektioner | 19 |
| Scenarier | 14 |
| Luckor | 0 |

## Per huvudområde

| Område | Kapitel | Begrepp | Täckta | Andel täckta | Frågor |
| --- | ---: | ---: | ---: | ---: | ---: |
| Trafikregler | 12 | 79 | 79 | 100 % | 232 |
| Människan | 7 | 38 | 38 | 100 % | 86 |
| Fordon | 15 | 48 | 48 | 100 % | 123 |
| Miljö | 3 | 5 | 5 | 100 % | 28 |
| Vägmärken | 1 | 8 | 8 | 100 % | 71 |
| Rättsfall | 1 | 1 | 1 | 100 % | 3 |

## Per kapitel

| Kapitel | Område | Sidor | Begrepp | Täckta | Frågor | Status |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Inledning | Trafikregler | 6–13 | 9 | 9 | 33 | Stark |
| Körfält | Trafikregler | 14–21 | 7 | 7 | 22 | Stark |
| Väjningsregler | Trafikregler | 22–45 | 13 | 13 | 31 | Stark |
| Passager | Trafikregler | 46–57 | 6 | 6 | 25 | Stark |
| Cirkulationsplats | Trafikregler | 58–67 | 5 | 5 | 16 | Stark |
| Stanna & parkera | Trafikregler | 68–77 | 6 | 6 | 17 | Stark |
| Landsväg | Trafikregler | 78–89 | 7 | 7 | 7 | Stark |
| Motorväg & motortrafikled | Trafikregler | 90–97 | 5 | 5 | 15 | Stark |
| Omkörningar | Trafikregler | 98–107 | 5 | 5 | 14 | Stark |
| Järnvägskorsningar | Trafikregler | 108–115 | 5 | 5 | 19 | Stark |
| Speciella gator | Trafikregler | 116–123 | 5 | 5 | 25 | Stark |
| Vinter | Trafikregler | 124–131 | 6 | 6 | 8 | Stark |
| Inlärning & mognad | Människan | 132–139 | 6 | 6 | 19 | Stark |
| Alkohol | Människan | 140–147 | 7 | 7 | 19 | Stark |
| Trötthet | Människan | 148–153 | 3 | 3 | 9 | Stark |
| Synen | Människan | 154–161 | 5 | 5 | 12 | Stark |
| Nedsatt förmåga | Människan | 162–167 | 4 | 4 | 7 | Stark |
| Barn | Människan | 168–173 | 4 | 4 | 8 | Stark |
| Trafikolyckor | Människan | 174–187 | 9 | 9 | 12 | Stark |
| Indelning av fordon | Fordon | 188–195 | 4 | 4 | 12 | Stark |
| Sträckor | Fordon | 196–203 | 3 | 3 | 12 | Stark |
| Däck | Fordon | 204–213 | 6 | 6 | 12 | Stark |
| Styrning | Fordon | 214–223 | 4 | 4 | 9 | Stark |
| Bromsar | Fordon | 224–231 | 6 | 6 | 7 | Stark |
| Krocksäkerhet | Fordon | 232–237 | 3 | 3 | 11 | Stark |
| Bilbarnstolar | Fordon | 238–243 | 1 | 1 | 4 | Stark |
| Längd & bredd | Fordon | 244–251 | 1 | 1 | 4 | Stark |
| Last | Fordon | 252–261 | 3 | 3 | 10 | Stark |
| Belysning | Fordon | 262–271 | 9 | 9 | 25 | Stark |
| Säkerhetskontroller | Fordon | 272–277 | 1 | 1 | 3 | Stark |
| Besiktning | Fordon | 278–283 | 2 | 2 | 3 | Stark |
| Service | Fordon | 284–289 | 1 | 1 | 3 | Stark |
| Registreringsbevis | Fordon | 290–297 | 2 | 2 | 4 | Stark |
| Försäkring | Fordon | 298–303 | 2 | 2 | 4 | Stark |
| Miljö | Miljö | 304–311 | 3 | 3 | 6 | Stark |
| Sparsam körning | Miljö | 312–317 | 1 | 1 | 12 | Stark |
| Drivmedel | Miljö | 318–323 | 1 | 1 | 10 | Stark |
| Vägmärken | Vägmärken | 324–361 | 8 | 8 | 71 | Stark |
| Rättsfall | Rättsfall | 362–367 | 1 | 1 | 3 | Stark |

## Luckor

Prioritet 1 = kärnbegrepp helt utan frågor. Prioritet 2 = kärnbegrepp med för få.
Prioritet 3 = stödjande eller perifera begrepp utan material.

### Prioritet 1 — 0 st

Inga.

### Prioritet 2 — 0 st

Inga.

### Prioritet 3 — 0 st

Inga.

## Teoriskolan mot kursplanen

| Lektion | Kapitel i kursplanen |
| --- | --- |
| Grundreglerna | Inledning, Körfält |
| Högerregeln | Väjningsregler, Cirkulationsplats |
| Utfartsregeln | Väjningsregler, Passager |
| Hastighet | Inledning, Speciella gator, Landsväg |
| Stoppsträckan | Bromsar, Däck, Sträckor |
| Stanna och parkera | Stanna & parkera |
| Mörkerkörning | Belysning, Synen |
| Halka och väglag | Vinter, Däck |
| Omkörning | Omkörningar, Motorväg & motortrafikled |
| Riskbedömning | Trafikolyckor, Trötthet, Alkohol, Nedsatt förmåga, Barn |
| Järnvägskorsningar | Järnvägskorsningar |
| Passager | Passager |
| Cirkulationsplats | Cirkulationsplats |
| Vägmärken | Vägmärken |
| Vägmarkeringar | Vägmärken, Körfält |
| Krockskydd i bilen | Krocksäkerhet, Bilbarnstolar, Bromsar |
| Last och släp | Last, Längd & bredd |
| Däcken | Däck, Styrning |
| När det går fel | Trafikolyckor |

## Visuellt stöd

Utvalda fotografier ur källan används i lektioner och frågor där bilden gör
skillnad för förståelsen. Tabellen visar var det visuella stödet finns i dag.

| Mått | Antal |
| --- | ---: |
| Godkända källbilder | 66 |
| Kapitel med visuellt stöd | 23 av 39 |
| Bildbaserade frågor | 48 |
| Lektioner med bild | 15 av 19 |

| Kapitel | Bilder |
| --- | ---: |
| Inledning | 3 |
| Körfält | 2 |
| Väjningsregler | 7 |
| Passager | 7 |
| Cirkulationsplats | 2 |
| Stanna & parkera | 3 |
| Landsväg | 4 |
| Motorväg & motortrafikled | 3 |
| Omkörningar | 3 |
| Järnvägskorsningar | 2 |
| Speciella gator | 1 |
| Vinter | 2 |
| Synen | 1 |
| Barn | 1 |
| Trafikolyckor | 2 |
| Sträckor | 1 |
| Bromsar | 1 |
| Krocksäkerhet | 2 |
| Bilbarnstolar | 1 |
| Längd & bredd | 4 |
| Last | 3 |
| Belysning | 5 |
| Vägmärken | 6 |

Kapitel utan visuellt stöd: **16**. De viktigaste att komplettera
härnäst listas i [SOURCE-IMAGES.md](SOURCE-IMAGES.md).

## Källa och rättigheter

Kursplanens struktur och sidhänvisningar kommer från *Teoribok — Körkortsboken 2026 för B-körkort* (2026-1, 367 sidor), utgiven av Körkortonline.se. Rättigheterna till det verket tillhör Hagberg Media AB.

Vägklar återger ingen text ur källan. Kartan består av kapitelrubriker,
sidintervall och begreppsnamn — precis det som behövs för att kunna svara på
frågan "täcker vi det här?". Källdokumentet bundlas inte, publiceras inte och
checkas inte in; `scripts/verify-build.mjs` gör varje sådant försök till ett byggfel.

Vägklars programvara, design, egna illustrationer och eget originalinnehåll är © 2026 Jimmy Eliasson, om inget annat anges.

Vägklar är en fristående träningsprodukt och är inte ansluten till eller godkänd av Trafikverket.

Se [SOURCES-AND-RIGHTS.md](SOURCES-AND-RIGHTS.md) för hela redovisningen.
