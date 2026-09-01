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
| Begrepp | 173 |
| Begrepp med tillräckligt (≥ 3 frågor) | 90 (52 %) |
| Begrepp med för få (1–2 frågor) | 64 |
| Begrepp helt utan frågor | 19 |
| Begrepp utan plats i taxonomin | 19 |
| Frågor i banken | 147 |
| Frågor kopplade till ett begrepp | 136 |
| Frågor utan koppling | 11 |
| Lektioner | 10 |
| Scenarier | 6 |
| Luckor | 83 |

## Per huvudområde

| Område | Kapitel | Begrepp | Täckta | Andel täckta | Frågor |
| --- | ---: | ---: | ---: | ---: | ---: |
| Trafikregler | 12 | 77 | 31 | 40 % | 76 |
| Människan | 7 | 38 | 21 | 55 % | 31 |
| Fordon | 15 | 44 | 32 | 73 % | 47 |
| Miljö | 3 | 5 | 1 | 20 % | 8 |
| Vägmärken | 1 | 8 | 5 | 63 % | 12 |
| Rättsfall | 1 | 1 | 0 | 0 % | 0 |

## Per kapitel

| Kapitel | Område | Sidor | Begrepp | Täckta | Frågor | Status |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Inledning | Trafikregler | 6–13 | 7 | 1 | 11 | Tunn |
| Körfält | Trafikregler | 14–21 | 7 | 0 | 4 | Saknas |
| Väjningsregler | Trafikregler | 22–45 | 13 | 5 | 15 | Tunn |
| Passager | Trafikregler | 46–57 | 6 | 0 | 2 | Saknas |
| Cirkulationsplats | Trafikregler | 58–67 | 5 | 0 | 2 | Saknas |
| Stanna & parkera | Trafikregler | 68–77 | 6 | 6 | 10 | Stark |
| Landsväg | Trafikregler | 78–89 | 7 | 1 | 4 | Tunn |
| Motorväg & motortrafikled | Trafikregler | 90–97 | 5 | 3 | 8 | Täckt |
| Omkörningar | Trafikregler | 98–107 | 5 | 4 | 8 | Täckt |
| Järnvägskorsningar | Trafikregler | 108–115 | 5 | 0 | 0 | Saknas |
| Speciella gator | Trafikregler | 116–123 | 5 | 5 | 6 | Stark |
| Vinter | Trafikregler | 124–131 | 6 | 6 | 6 | Stark |
| Inlärning & mognad | Människan | 132–139 | 6 | 0 | 6 | Saknas |
| Alkohol | Människan | 140–147 | 7 | 5 | 8 | Täckt |
| Trötthet | Människan | 148–153 | 3 | 3 | 4 | Stark |
| Synen | Människan | 154–161 | 5 | 5 | 5 | Stark |
| Nedsatt förmåga | Människan | 162–167 | 4 | 0 | 0 | Saknas |
| Barn | Människan | 168–173 | 4 | 0 | 2 | Saknas |
| Trafikolyckor | Människan | 174–187 | 9 | 8 | 6 | Täckt |
| Indelning av fordon | Fordon | 188–195 | 4 | 1 | 0 | Tunn |
| Sträckor | Fordon | 196–203 | 3 | 3 | 5 | Stark |
| Däck | Fordon | 204–213 | 6 | 6 | 7 | Stark |
| Styrning | Fordon | 214–223 | 4 | 3 | 5 | Täckt |
| Bromsar | Fordon | 224–231 | 6 | 6 | 4 | Stark |
| Krocksäkerhet | Fordon | 232–237 | 3 | 1 | 0 | Tunn |
| Bilbarnstolar | Fordon | 238–243 | 1 | 1 | 3 | Stark |
| Längd & bredd | Fordon | 244–251 | 1 | 1 | 3 | Stark |
| Last | Fordon | 252–261 | 3 | 3 | 6 | Stark |
| Belysning | Fordon | 262–271 | 5 | 3 | 5 | Täckt |
| Säkerhetskontroller | Fordon | 272–277 | 1 | 1 | 3 | Stark |
| Besiktning | Fordon | 278–283 | 2 | 2 | 3 | Stark |
| Service | Fordon | 284–289 | 1 | 1 | 3 | Stark |
| Registreringsbevis | Fordon | 290–297 | 2 | 0 | 0 | Saknas |
| Försäkring | Fordon | 298–303 | 2 | 0 | 0 | Saknas |
| Miljö | Miljö | 304–311 | 3 | 0 | 2 | Saknas |
| Sparsam körning | Miljö | 312–317 | 1 | 1 | 4 | Stark |
| Drivmedel | Miljö | 318–323 | 1 | 0 | 2 | Saknas |
| Vägmärken | Vägmärken | 324–361 | 8 | 5 | 12 | Täckt |
| Rättsfall | Rättsfall | 362–367 | 1 | 0 | 0 | Saknas |

## Luckor

Prioritet 1 = kärnbegrepp helt utan frågor. Prioritet 2 = kärnbegrepp med för få.
Prioritet 3 = stödjande eller perifera begrepp utan material.

### Prioritet 1 — 13 st

| Begrepp | Kapitel | Sidor | Frågor | Varför |
| --- | --- | --- | ---: | --- |
| Avstånd till järnvägskorsning | Järnvägskorsningar | 109 | 0 | Ingår i kursplanen men saknar delområde i Vägklars taxonomi. |
| Deformationszoner | Krocksäkerhet | 232 | 0 | Ingår i kursplanen men saknar delområde i Vägklars taxonomi. |
| Funktionsnedsättning i trafiken | Nedsatt förmåga | 162 | 0 | Ingår i kursplanen men saknar delområde i Vägklars taxonomi. |
| Hastigheter för olika fordon | Indelning av fordon | 190, 191 | 0 | Ingår i kursplanen men saknar delområde i Vägklars taxonomi. |
| Hur man korsar en järnväg säkert | Järnvägskorsningar | 109, 110 | 0 | Ingår i kursplanen men saknar delområde i Vägklars taxonomi. |
| Krockkudde | Krocksäkerhet | 233, 234 | 0 | Ingår i kursplanen men saknar delområde i Vägklars taxonomi. |
| Olika typer av järnvägsbommar | Järnvägskorsningar | 112, 113 | 0 | Ingår i kursplanen men saknar delområde i Vägklars taxonomi. |
| Registreringsbevis | Registreringsbevis | 290, 291 | 0 | Ingår i kursplanen men saknar delområde i Vägklars taxonomi. |
| Signaler med vit käpp | Nedsatt förmåga | 162 | 0 | Ingår i kursplanen men saknar delområde i Vägklars taxonomi. |
| Stopp mitt på spåret | Järnvägskorsningar | 110 | 0 | Ingår i kursplanen men saknar delområde i Vägklars taxonomi. |
| Trafikant | Indelning av fordon | 188 | 0 | Ingår i kursplanen men saknar delområde i Vägklars taxonomi. |
| Trafikförsäkring | Försäkring | 298, 299 | 0 | Ingår i kursplanen men saknar delområde i Vägklars taxonomi. |
| Äldre i trafiken | Nedsatt förmåga | 163, 164 | 0 | Ingår i kursplanen men saknar delområde i Vägklars taxonomi. |

### Prioritet 2 — 54 st

| Begrepp | Kapitel | Sidor | Frågor | Varför |
| --- | --- | --- | ---: | --- |
| Fordonsskatt och avställning | Registreringsbevis | 292, 293 | 0 | Ingår i kursplanen men saknar delområde i Vägklars taxonomi. |
| Halv- och helförsäkring | Försäkring | 300 | 0 | Ingår i kursplanen men saknar delområde i Vägklars taxonomi. |
| Ledarhund | Nedsatt förmåga | 163 | 0 | Ingår i kursplanen men saknar delområde i Vägklars taxonomi. |
| Omkörning vid plankorsning | Järnvägskorsningar | 111 | 0 | Ingår i kursplanen men saknar delområde i Vägklars taxonomi. |
| Motortrafikled | Motorväg & motortrafikled | 93 | 1 | Endast 1 fråga — behöver fler för variation. |
| Möte | Omkörningar | 101 | 1 | Endast 1 fråga — behöver fler för variation. |
| Påbudsmärken | Vägmärken | 338, 339 | 1 | Endast 1 fråga — behöver fler för variation. |
| Rangordning av anvisningar | Inledning | 8 | 1 | Endast 1 fråga — behöver fler för variation. |
| Att korsa gång- eller cykelbana | Väjningsregler | 35 | 2 | Endast 2 frågor — behöver fler för variation. |
| Avgaser och utsläpp | Miljö | 304, 305 | 2 | Endast 2 frågor — behöver fler för variation. |
| Barns sinnen är inte färdigutvecklade | Barn | 169 | 2 | Endast 2 frågor — behöver fler för variation. |
| Bevakat övergångsställe | Passager | 46 | 2 | Endast 2 frågor — behöver fler för variation. |
| Blinkning i cirkulationsplats | Cirkulationsplats | 62, 63 | 2 | Endast 2 frågor — behöver fler för variation. |
| Cykelpassage | Passager | 50, 51 | 2 | Endast 2 frågor — behöver fler för variation. |
| Cykelöverfart | Passager | 52, 53, 54 | 2 | Endast 2 frågor — behöver fler för variation. |
| Defensiv körning | Inledning | 7 | 2 | Endast 2 frågor — behöver fler för variation. |
| Drivmedel och bränsletyper | Drivmedel | 318, 319, 320 | 2 | Endast 2 frågor — behöver fler för variation. |
| Droger och narkotika i trafiken | Alkohol | 142 | 2 | Endast 2 frågor — behöver fler för variation. |
| Grundläggande säkerhet | Inledning | 7 | 2 | Endast 2 frågor — behöver fler för variation. |
| Grupptryck | Inlärning & mognad | 135 | 2 | Endast 2 frågor — behöver fler för variation. |
| Hur bilen ska placeras i körfältet | Körfält | 14 | 2 | Endast 2 frågor — behöver fler för variation. |
| Hur man kör i cirkulationsplatser | Cirkulationsplats | 58 | 2 | Endast 2 frågor — behöver fler för variation. |
| Huvudled | Väjningsregler | 25 | 2 | Endast 2 frågor — behöver fler för variation. |
| Hålla rätt avstånd | Landsväg | 81 | 2 | Endast 2 frågor — behöver fler för variation. |
| Högerregeln | Väjningsregler | 26, 27, 28, 29, 30, 31, 32 | 2 | Endast 2 frågor — behöver fler för variation. |
| Katalysator | Miljö | 306 | 2 | Endast 2 frågor — behöver fler för variation. |
| Köra rakt fram i cirkulationsplats | Cirkulationsplats | 59 | 2 | Endast 2 frågor — behöver fler för variation. |
| Körfältsbyte steg för steg | Körfält | 17 | 2 | Endast 2 frågor — behöver fler för variation. |
| Läkemedel och mediciner i trafiken | Alkohol | 141 | 2 | Endast 2 frågor — behöver fler för variation. |
| När högerregeln inte gäller | Väjningsregler | 26 | 2 | Endast 2 frågor — behöver fler för variation. |
| Obevakat övergångsställe | Passager | 46 | 2 | Endast 2 frågor — behöver fler för variation. |
| Olika grader av mognad | Inlärning & mognad | 132 | 2 | Endast 2 frågor — behöver fler för variation. |
| Olika typer av körfält | Körfält | 14 | 2 | Endast 2 frågor — behöver fler för variation. |
| Placering i samband med sväng | Körfält | 15 | 2 | Endast 2 frågor — behöver fler för variation. |
| Påfart till motorväg | Motorväg & motortrafikled | 91 | 2 | Endast 2 frågor — behöver fler för variation. |
| Skolbussar och skolskjuts | Barn | 169 | 2 | Endast 2 frågor — behöver fler för variation. |
| Stopplikt | Väjningsregler | 24 | 2 | Endast 2 frågor — behöver fler för variation. |
| Stress | Inlärning & mognad | 134 | 2 | Endast 2 frågor — behöver fler för variation. |
| Svårigheter med barn i trafiken | Barn | 168 | 2 | Endast 2 frågor — behöver fler för variation. |
| Svänga höger i cirkulationsplats | Cirkulationsplats | 60 | 2 | Endast 2 frågor — behöver fler för variation. |
| Svänga på landsväg | Landsväg | 78, 79, 80 | 2 | Endast 2 frågor — behöver fler för variation. |
| Svänga vänster i cirkulationsplats | Cirkulationsplats | 61 | 2 | Endast 2 frågor — behöver fler för variation. |
| Trafikens grundregler | Inledning | 6 | 2 | Endast 2 frågor — behöver fler för variation. |
| Trafiksignaler: röd, gul, grön | Väjningsregler | 40, 41, 42 | 2 | Endast 2 frågor — behöver fler för variation. |
| Unga bilförare | Inlärning & mognad | 133 | 2 | Endast 2 frågor — behöver fler för variation. |
| Utfartsregeln | Väjningsregler | 35, 36, 37 | 2 | Endast 2 frågor — behöver fler för variation. |
| Varselljus | Belysning | 264 | 2 | Endast 2 frågor — behöver fler för variation. |
| Vattenplaning | Styrning | 219, 220 | 2 | Endast 2 frågor — behöver fler för variation. |
| Vilket körfält du ska välja | Körfält | 16 | 2 | Endast 2 frågor — behöver fler för variation. |
| Viltolyckor och anmälningsplikt | Trafikolyckor | 177, 178 | 2 | Endast 2 frågor — behöver fler för variation. |
| Väg, körbana, körfält och vägren | Inledning | 6 | 2 | Endast 2 frågor — behöver fler för variation. |
| Vägmarkeringar | Vägmärken | 350, 351, 352, 353 | 2 | Endast 2 frågor — behöver fler för variation. |
| Väjningspliktsmärken | Vägmärken | 331, 332 | 2 | Endast 2 frågor — behöver fler för variation. |
| Övergångsställe | Passager | 46, 47 | 2 | Endast 2 frågor — behöver fler för variation. |

### Prioritet 3 — 16 st

| Begrepp | Kapitel | Sidor | Frågor | Varför |
| --- | --- | --- | ---: | --- |
| Efterfordon | Indelning av fordon | 189 | 0 | Ingår i kursplanen men saknar delområde i Vägklars taxonomi. |
| Hur domstolar har dömt i trafikmål | Rättsfall | 362, 363, 364, 365, 366, 367 | 0 | Ingår i kursplanen men saknar delområde i Vägklars taxonomi. |
| Enskild väg | Landsväg | 83, 84 | 2 | Endast 2 frågor — behöver fler för variation. |
| Förbjudet att byta körfält | Körfält | 17 | 2 | Endast 2 frågor — behöver fler för variation. |
| Gångbana | Passager | 48, 49 | 2 | Endast 2 frågor — behöver fler för variation. |
| Hästar i trafiken | Landsväg | 83 | 2 | Endast 2 frågor — behöver fler för variation. |
| Kantstolpar | Landsväg | 81 | 2 | Endast 2 frågor — behöver fler för variation. |
| Miljözoner | Miljö | 307 | 2 | Endast 2 frågor — behöver fler för variation. |
| Olika typer av inlärning | Inlärning & mognad | 132 | 2 | Endast 2 frågor — behöver fler för variation. |
| Otydliga trafikregler | Inledning | 10 | 2 | Endast 2 frågor — behöver fler för variation. |
| Sannolikhetsinlärning | Inlärning & mognad | 134 | 2 | Endast 2 frågor — behöver fler för variation. |
| Skolpatrull | Barn | 170 | 2 | Endast 2 frågor — behöver fler för variation. |
| Sväng på enkelriktad väg | Körfält | 15 | 2 | Endast 2 frågor — behöver fler för variation. |
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

## Källa och rättigheter

Kursplanens struktur och sidhänvisningar kommer från *Teoribok — Körkortsboken 2026 för B-körkort* (2026-1, 367 sidor), utgiven av Körkortonline.se. Rättigheterna till det verket tillhör Hagberg Media AB.

Vägklar återger ingen text ur källan. Kartan består av kapitelrubriker,
sidintervall och begreppsnamn — precis det som behövs för att kunna svara på
frågan "täcker vi det här?". Källdokumentet bundlas inte, publiceras inte och
checkas inte in; `scripts/verify-build.mjs` gör varje sådant försök till ett byggfel.

Vägklars programvara, design, egna illustrationer och eget originalinnehåll är © 2026 Jimmy Eliasson, om inget annat anges.

Vägklar är en fristående träningsprodukt och är inte ansluten till eller godkänd av Trafikverket.

Se [SOURCES-AND-RIGHTS.md](SOURCES-AND-RIGHTS.md) för hela redovisningen.
