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
| Frågor i banken | 423 |
| Frågor kopplade till ett begrepp | 423 |
| Frågor utan koppling | 0 |
| Lektioner | 15 |
| Scenarier | 14 |
| Luckor | 0 |

## Per huvudområde

| Område | Kapitel | Begrepp | Täckta | Andel täckta | Frågor |
| --- | ---: | ---: | ---: | ---: | ---: |
| Trafikregler | 12 | 79 | 79 | 100 % | 213 |
| Människan | 7 | 38 | 38 | 100 % | 85 |
| Fordon | 15 | 48 | 48 | 100 % | 103 |
| Miljö | 3 | 5 | 5 | 100 % | 28 |
| Vägmärken | 1 | 8 | 8 | 100 % | 66 |
| Rättsfall | 1 | 1 | 1 | 100 % | 3 |

## Per kapitel

| Kapitel | Område | Sidor | Begrepp | Täckta | Frågor | Status |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Inledning | Trafikregler | 6–13 | 9 | 9 | 28 | Stark |
| Körfält | Trafikregler | 14–21 | 7 | 7 | 22 | Stark |
| Väjningsregler | Trafikregler | 22–45 | 13 | 13 | 27 | Stark |
| Passager | Trafikregler | 46–57 | 6 | 6 | 24 | Stark |
| Cirkulationsplats | Trafikregler | 58–67 | 5 | 5 | 16 | Stark |
| Stanna & parkera | Trafikregler | 68–77 | 6 | 6 | 12 | Stark |
| Landsväg | Trafikregler | 78–89 | 7 | 7 | 7 | Stark |
| Motorväg & motortrafikled | Trafikregler | 90–97 | 5 | 5 | 15 | Stark |
| Omkörningar | Trafikregler | 98–107 | 5 | 5 | 13 | Stark |
| Järnvägskorsningar | Trafikregler | 108–115 | 5 | 5 | 19 | Stark |
| Speciella gator | Trafikregler | 116–123 | 5 | 5 | 23 | Stark |
| Vinter | Trafikregler | 124–131 | 6 | 6 | 7 | Stark |
| Inlärning & mognad | Människan | 132–139 | 6 | 6 | 19 | Stark |
| Alkohol | Människan | 140–147 | 7 | 7 | 19 | Stark |
| Trötthet | Människan | 148–153 | 3 | 3 | 9 | Stark |
| Synen | Människan | 154–161 | 5 | 5 | 12 | Stark |
| Nedsatt förmåga | Människan | 162–167 | 4 | 4 | 7 | Stark |
| Barn | Människan | 168–173 | 4 | 4 | 7 | Stark |
| Trafikolyckor | Människan | 174–187 | 9 | 9 | 12 | Stark |
| Indelning av fordon | Fordon | 188–195 | 4 | 4 | 9 | Stark |
| Sträckor | Fordon | 196–203 | 3 | 3 | 12 | Stark |
| Däck | Fordon | 204–213 | 6 | 6 | 9 | Stark |
| Styrning | Fordon | 214–223 | 4 | 4 | 8 | Stark |
| Bromsar | Fordon | 224–231 | 6 | 6 | 5 | Stark |
| Krocksäkerhet | Fordon | 232–237 | 3 | 3 | 8 | Stark |
| Bilbarnstolar | Fordon | 238–243 | 1 | 1 | 3 | Stark |
| Längd & bredd | Fordon | 244–251 | 1 | 1 | 3 | Stark |
| Last | Fordon | 252–261 | 3 | 3 | 6 | Stark |
| Belysning | Fordon | 262–271 | 9 | 9 | 23 | Stark |
| Säkerhetskontroller | Fordon | 272–277 | 1 | 1 | 3 | Stark |
| Besiktning | Fordon | 278–283 | 2 | 2 | 3 | Stark |
| Service | Fordon | 284–289 | 1 | 1 | 3 | Stark |
| Registreringsbevis | Fordon | 290–297 | 2 | 2 | 4 | Stark |
| Försäkring | Fordon | 298–303 | 2 | 2 | 4 | Stark |
| Miljö | Miljö | 304–311 | 3 | 3 | 6 | Stark |
| Sparsam körning | Miljö | 312–317 | 1 | 1 | 12 | Stark |
| Drivmedel | Miljö | 318–323 | 1 | 1 | 10 | Stark |
| Vägmärken | Vägmärken | 324–361 | 8 | 8 | 66 | Stark |
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

## Visuellt stöd

Utvalda fotografier ur källan används i lektioner och frågor där bilden gör
skillnad för förståelsen. Tabellen visar var det visuella stödet finns i dag.

| Mått | Antal |
| --- | ---: |
| Godkända källbilder | 44 |
| Kapitel med visuellt stöd | 12 av 39 |
| Bildbaserade frågor | 34 |
| Lektioner med bild | 9 av 15 |

| Kapitel | Bilder |
| --- | ---: |
| Körfält | 3 |
| Väjningsregler | 6 |
| Passager | 6 |
| Cirkulationsplats | 2 |
| Stanna & parkera | 3 |
| Landsväg | 4 |
| Motorväg & motortrafikled | 3 |
| Omkörningar | 4 |
| Järnvägskorsningar | 2 |
| Speciella gator | 1 |
| Vinter | 3 |
| Vägmärken | 7 |

Kapitel utan visuellt stöd: **27**. De viktigaste att komplettera
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
