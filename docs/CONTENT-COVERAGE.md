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
| Begrepp med tillräckligt (≥ 3 frågor) | 139 (78 %) |
| Begrepp med för få (1–2 frågor) | 40 |
| Begrepp helt utan frågor | 0 |
| Begrepp utan plats i taxonomin | 0 |
| Frågor i banken | 275 |
| Frågor kopplade till ett begrepp | 275 |
| Frågor utan koppling | 0 |
| Lektioner | 13 |
| Scenarier | 11 |
| Luckor | 40 |

## Per huvudområde

| Område | Kapitel | Begrepp | Täckta | Andel täckta | Frågor |
| --- | ---: | ---: | ---: | ---: | ---: |
| Trafikregler | 12 | 79 | 60 | 76 % | 155 |
| Människan | 7 | 38 | 25 | 66 % | 43 |
| Fordon | 15 | 48 | 43 | 90 % | 83 |
| Miljö | 3 | 5 | 5 | 100 % | 28 |
| Vägmärken | 1 | 8 | 5 | 63 % | 13 |
| Rättsfall | 1 | 1 | 1 | 100 % | 3 |

## Per kapitel

| Kapitel | Område | Sidor | Begrepp | Täckta | Frågor | Status |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Inledning | Trafikregler | 6–13 | 9 | 2 | 15 | Tunn |
| Körfält | Trafikregler | 14–21 | 7 | 7 | 19 | Stark |
| Väjningsregler | Trafikregler | 22–45 | 13 | 9 | 19 | Täckt |
| Passager | Trafikregler | 46–57 | 6 | 6 | 22 | Stark |
| Cirkulationsplats | Trafikregler | 58–67 | 5 | 5 | 16 | Stark |
| Stanna & parkera | Trafikregler | 68–77 | 6 | 6 | 12 | Stark |
| Landsväg | Trafikregler | 78–89 | 7 | 2 | 5 | Tunn |
| Motorväg & motortrafikled | Trafikregler | 90–97 | 5 | 3 | 8 | Täckt |
| Omkörningar | Trafikregler | 98–107 | 5 | 4 | 9 | Täckt |
| Järnvägskorsningar | Trafikregler | 108–115 | 5 | 5 | 17 | Stark |
| Speciella gator | Trafikregler | 116–123 | 5 | 5 | 7 | Stark |
| Vinter | Trafikregler | 124–131 | 6 | 6 | 6 | Stark |
| Inlärning & mognad | Människan | 132–139 | 6 | 0 | 6 | Saknas |
| Alkohol | Människan | 140–147 | 7 | 5 | 8 | Täckt |
| Trötthet | Människan | 148–153 | 3 | 3 | 4 | Stark |
| Synen | Människan | 154–161 | 5 | 5 | 10 | Stark |
| Nedsatt förmåga | Människan | 162–167 | 4 | 4 | 7 | Stark |
| Barn | Människan | 168–173 | 4 | 0 | 2 | Saknas |
| Trafikolyckor | Människan | 174–187 | 9 | 8 | 6 | Täckt |
| Indelning av fordon | Fordon | 188–195 | 4 | 4 | 9 | Stark |
| Sträckor | Fordon | 196–203 | 3 | 3 | 10 | Stark |
| Däck | Fordon | 204–213 | 6 | 6 | 7 | Stark |
| Styrning | Fordon | 214–223 | 4 | 3 | 5 | Täckt |
| Bromsar | Fordon | 224–231 | 6 | 6 | 4 | Stark |
| Krocksäkerhet | Fordon | 232–237 | 3 | 3 | 8 | Stark |
| Bilbarnstolar | Fordon | 238–243 | 1 | 1 | 3 | Stark |
| Längd & bredd | Fordon | 244–251 | 1 | 1 | 3 | Stark |
| Last | Fordon | 252–261 | 3 | 3 | 6 | Stark |
| Belysning | Fordon | 262–271 | 9 | 5 | 11 | Täckt |
| Säkerhetskontroller | Fordon | 272–277 | 1 | 1 | 3 | Stark |
| Besiktning | Fordon | 278–283 | 2 | 2 | 3 | Stark |
| Service | Fordon | 284–289 | 1 | 1 | 3 | Stark |
| Registreringsbevis | Fordon | 290–297 | 2 | 2 | 4 | Stark |
| Försäkring | Fordon | 298–303 | 2 | 2 | 4 | Stark |
| Miljö | Miljö | 304–311 | 3 | 3 | 6 | Stark |
| Sparsam körning | Miljö | 312–317 | 1 | 1 | 12 | Stark |
| Drivmedel | Miljö | 318–323 | 1 | 1 | 10 | Stark |
| Vägmärken | Vägmärken | 324–361 | 8 | 5 | 13 | Täckt |
| Rättsfall | Rättsfall | 362–367 | 1 | 1 | 3 | Stark |

## Luckor

Prioritet 1 = kärnbegrepp helt utan frågor. Prioritet 2 = kärnbegrepp med för få.
Prioritet 3 = stödjande eller perifera begrepp utan material.

### Prioritet 1 — 0 st

Inga.

### Prioritet 2 — 30 st

| Begrepp | Kapitel | Sidor | Frågor | Varför |
| --- | --- | --- | ---: | --- |
| Dimma och kraftigt nedsatt sikt | Belysning | 263, 264 | 1 | Endast 1 fråga — behöver fler för variation. |
| Motortrafikled | Motorväg & motortrafikled | 93 | 1 | Endast 1 fråga — behöver fler för variation. |
| Möte | Omkörningar | 101 | 1 | Endast 1 fråga — behöver fler för variation. |
| Påbudsmärken | Vägmärken | 338, 339 | 1 | Endast 1 fråga — behöver fler för variation. |
| Rangordning av anvisningar | Inledning | 8 | 1 | Endast 1 fråga — behöver fler för variation. |
| Avbländning vid möte och omkörning | Belysning | 266, 267 | 2 | Endast 2 frågor — behöver fler för variation. |
| Barns sinnen är inte färdigutvecklade | Barn | 169 | 2 | Endast 2 frågor — behöver fler för variation. |
| Defensiv körning | Inledning | 7 | 2 | Endast 2 frågor — behöver fler för variation. |
| Droger och narkotika i trafiken | Alkohol | 142 | 2 | Endast 2 frågor — behöver fler för variation. |
| Grundläggande säkerhet | Inledning | 7 | 2 | Endast 2 frågor — behöver fler för variation. |
| Grupptryck | Inlärning & mognad | 135 | 2 | Endast 2 frågor — behöver fler för variation. |
| Huvudled | Väjningsregler | 25 | 2 | Endast 2 frågor — behöver fler för variation. |
| Läkemedel och mediciner i trafiken | Alkohol | 141 | 2 | Endast 2 frågor — behöver fler för variation. |
| Olika grader av mognad | Inlärning & mognad | 132 | 2 | Endast 2 frågor — behöver fler för variation. |
| Påfart till motorväg | Motorväg & motortrafikled | 91 | 2 | Endast 2 frågor — behöver fler för variation. |
| Skolbussar och skolskjuts | Barn | 169 | 2 | Endast 2 frågor — behöver fler för variation. |
| Skymd sikt och förutsägbara hinder | Inledning | 9 | 2 | Endast 2 frågor — behöver fler för variation. |
| Stress | Inlärning & mognad | 134 | 2 | Endast 2 frågor — behöver fler för variation. |
| Svårigheter med barn i trafiken | Barn | 168 | 2 | Endast 2 frågor — behöver fler för variation. |
| Svänga på landsväg | Landsväg | 78, 79, 80 | 2 | Endast 2 frågor — behöver fler för variation. |
| Trafikens grundregler | Inledning | 6 | 2 | Endast 2 frågor — behöver fler för variation. |
| Trafiksignaler: röd, gul, grön | Väjningsregler | 40, 41, 42 | 2 | Endast 2 frågor — behöver fler för variation. |
| Unga bilförare | Inlärning & mognad | 133 | 2 | Endast 2 frågor — behöver fler för variation. |
| Utfartsregeln | Väjningsregler | 35, 36, 37 | 2 | Endast 2 frågor — behöver fler för variation. |
| Varselljus | Belysning | 264 | 2 | Endast 2 frågor — behöver fler för variation. |
| Vattenplaning | Styrning | 219, 220 | 2 | Endast 2 frågor — behöver fler för variation. |
| Viltolyckor och anmälningsplikt | Trafikolyckor | 177, 178 | 2 | Endast 2 frågor — behöver fler för variation. |
| Väg, körbana, körfält och vägren | Inledning | 6 | 2 | Endast 2 frågor — behöver fler för variation. |
| Vägmarkeringar | Vägmärken | 350, 351, 352, 353 | 2 | Endast 2 frågor — behöver fler för variation. |
| Väjningspliktsmärken | Vägmärken | 331, 332 | 2 | Endast 2 frågor — behöver fler för variation. |

### Prioritet 3 — 10 st

| Begrepp | Kapitel | Sidor | Frågor | Varför |
| --- | --- | --- | ---: | --- |
| Enskild väg | Landsväg | 83, 84 | 2 | Endast 2 frågor — behöver fler för variation. |
| Hästar i trafiken | Landsväg | 83 | 2 | Endast 2 frågor — behöver fler för variation. |
| Kantstolpar | Landsväg | 81 | 2 | Endast 2 frågor — behöver fler för variation. |
| Olika typer av inlärning | Inlärning & mognad | 132 | 2 | Endast 2 frågor — behöver fler för variation. |
| Otydliga trafikregler | Inledning | 10 | 2 | Endast 2 frågor — behöver fler för variation. |
| Sannolikhetsinlärning | Inlärning & mognad | 134 | 2 | Endast 2 frågor — behöver fler för variation. |
| Skolpatrull | Barn | 170 | 2 | Endast 2 frågor — behöver fler för variation. |
| Vanlig signal med pil | Väjningsregler | 41 | 2 | Endast 2 frågor — behöver fler för variation. |
| Vägarbeten | Landsväg | 82 | 2 | Endast 2 frågor — behöver fler för variation. |
| Övrig belysning och lyktor | Belysning | 266, 267 | 2 | Endast 2 frågor — behöver fler för variation. |

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

## Visuellt stöd

Utvalda fotografier ur källan används i lektioner och frågor där bilden gör
skillnad för förståelsen. Tabellen visar var det visuella stödet finns i dag.

| Mått | Antal |
| --- | ---: |
| Godkända källbilder | 26 |
| Kapitel med visuellt stöd | 9 av 39 |
| Bildbaserade frågor | 16 |
| Lektioner med bild | 7 av 13 |

| Kapitel | Bilder |
| --- | ---: |
| Körfält | 3 |
| Väjningsregler | 6 |
| Passager | 6 |
| Cirkulationsplats | 2 |
| Stanna & parkera | 3 |
| Omkörningar | 2 |
| Järnvägskorsningar | 2 |
| Speciella gator | 1 |
| Vinter | 1 |

Kapitel utan visuellt stöd: **30**. De viktigaste att komplettera
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
