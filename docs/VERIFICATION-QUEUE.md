# Verifieringskö

GENERERAD — kör `npm run report:verification`. Redigera inte för hand.

Vägklars innehåll är **granskat**, inte **verifierat**. Skillnaden är avsiktlig:
granskat betyder skrivet med omsorg och läst igen, verifierat betyder att en
namngiven person kontrollerat påståendet mot en namngiven källa ett namngivet
datum. Den här kön säger vad som bör kontrolleras först, inte vad som är fel.

Så här går verifieringen till: [VERIFICATION-WORKFLOW.md](VERIFICATION-WORKFLOW.md).

## Status i banken

| Status | Antal | Betyder |
| --- | ---: | --- |
| `reviewed` | 431 | Läst och godkänd internt. Inget påstående om expertgranskning. |
| `verified` | 0 | Kontrollerad mot namngiven källa av namngiven person. |

## Kön

| Prioritet | Antal | Vad som står på spel |
| --- | ---: | --- |
| P1 | 113 | Rättsliga tal, gränsvärden, intervall och volatila regelområden. |
| P2 | 65 | Undantag, villkorade regler och beräkningar. |
| P3 | 253 | Förklarande kunskap utan rättsligt tal. |
| **Totalt** | **431** | |

## P1 — 113 frågor

### Alkohol — 14

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `alk-001` | Gränsvärden och straff | Promillegräns | Lag (1951:649) om straff för vissa trafikbrott |
| `alk-002` | Gränsvärden och straff | Grovt rattfylleri | Lag (1951:649) om straff för vissa trafikbrott |
| `alk-003` | Effekter på körförmågan | Alkoholens nedbrytning | Medicinsk grundkunskap om alkohol |
| `alk-004` | Effekter på körförmågan | Dagen efter | Medicinsk grundkunskap om alkohol |
| `alk-005` | Effekter på körförmågan | Alkoholens effekt på körförmågan | Medicinsk grundkunskap om alkohol |
| `alk-008` | Gränsvärden och straff | Ansvar för annan förare | Brottsbalken 23 kap. om medverkan |
| `grd-006` | Gränsvärden och straff | Grovt rattfylleri | Lag (1951:649) om straff för vissa trafikbrott 4 § · Teoribok — Körkortsboken 2026 för B-körkort Alkohol s. 140 |
| `mns-014` | Effekter på körförmågan | Effekt vid låg promillehalt | Teoribok — Körkortsboken 2026 för B-körkort Promille s. 140 |
| `mns-015` | Effekter på körförmågan | Individuell variation i promillehalt | Teoribok — Körkortsboken 2026 för B-körkort Alkoholupplysning s. 141 |
| `mns-016` | Effekter på körförmågan | Dagen efter | Teoribok — Körkortsboken 2026 för B-körkort Alkoholupplysning s. 141 |
| `mns-017` | Gränsvärden och straff | Rattfylleri under gränsvärdet | Lag (1951:649) om straff för vissa trafikbrott 4 § · Teoribok — Körkortsboken 2026 för B-körkort Alkoholupplysning s. 141 |
| `mns-018` | Gränsvärden och straff | Medhjälp till rattfylleri | Teoribok — Körkortsboken 2026 för B-körkort Alkoholupplysning s. 141 |
| `mns-019` | Gränsvärden och straff | Var rattfyllerilagen gäller | Teoribok — Körkortsboken 2026 för B-körkort Alkoholupplysning s. 141 |
| `mns-023` | Droger och läkemedel | Alkohol kombinerat med läkemedel | Teoribok — Körkortsboken 2026 för B-körkort Läkemedel & mediciner i trafiken s. 141 · Läkemedelsverket |

### Barn — 1

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `ris-009` | Barn och oskyddade | Passage av buss | Trafikförordningen (1998:1276) 3 kap. 12 § |

### Belysning — 3

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `bel-006` | Dimma | Hastighet vid kraftigt nedsatt sikt | Teoribok — Körkortsboken 2026 för B-körkort Dimma och snöfall s. 263 · Trafikförordningen (1998:1276) 3 kap. 14 § |
| `mor-001` | Mörkerkörning | Hastighet i mörker | Trafikförordningen (1998:1276) 3 kap. 14 § |
| `mor-005` | Mörkerkörning | Att upptäcka gående i mörker | Trafiksäkerhet: synbarhet i mörker |

### Bilbarnstolar — 3

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `las-003` | Lastning och lastsäkring | Lastsäkring | Trafikförordningen (1998:1276) 3 kap. 81 § |
| `las-004` | Lastning och lastsäkring | Utskjutande last | Trafikförordningen (1998:1276) 3 kap. 81 § |
| `las-006` | Lastning och lastsäkring | Passagerare och bälte | Trafikförordningen (1998:1276) 4 kap. 10 § |

### Däck — 5

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `for-001` | Däck och bromsar | Mönsterdjup | Trafikförordningen (1998:1276) 4 kap. 18 § |
| `for-002` | Däck och bromsar | Lufttryck i däck | Fordonskunskap: däck och lufttryck |
| `for-003` | Däck och bromsar | ABS-bromsar | Fordonsteknik: ABS |
| `for-008` | Däck och bromsar | Blandning av däcktyper | Trafikförordningen (1998:1276) 4 kap. 18 § |
| `grd-010` | Däck och bromsar | Mönsterdjup på sommardäck | Teoribok — Körkortsboken 2026 för B-körkort Däck s. 204 |

### Försäkring — 4

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `frs-001` | Försäkring | Trafikförsäkringens omfattning | Transportstyrelsen Trafikförsäkring · Teoribok — Körkortsboken 2026 för B-körkort Trafikförsäkring s. 298 |
| `frs-002` | Försäkring | Krav på trafikförsäkring | Transportstyrelsen Trafikförsäkring · Teoribok — Körkortsboken 2026 för B-körkort Trafikförsäkring s. 298 |
| `frs-003` | Försäkring | Halvförsäkring | Teoribok — Körkortsboken 2026 för B-körkort Halvförsäkring (delkaskoförsäkring) s. 298 |
| `frs-004` | Försäkring | Regressrätt | Teoribok — Körkortsboken 2026 för B-körkort Trafikförsäkring s. 298 |

### Indelning av fordon — 9

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `las-001` | Släpvagn | B-behörighet och släp | Körkortslagen, behörighet B |
| `las-002` | Släpvagn | Obromsat släp | Trafikförordningen (1998:1276) 4 kap. 12 § |
| `las-005` | Släpvagn | Släpvagnens köregenskaper | Fordonsdynamik: släpvagnspendling |
| `fsl-001` | Fordonsslag och hastigheter | Begreppet trafikant | Teoribok — Körkortsboken 2026 för B-körkort Trafikant s. 188 |
| `fsl-002` | Fordonsslag och hastigheter | Högsta hastighet för lätt lastbil | Transportstyrelsen Hastighetsbestämmelser för olika fordon · Teoribok — Körkortsboken 2026 för B-körkort Hastigheter för olika fordon s. 190 |
| `fsl-003` | Fordonsslag och hastigheter | Högsta hastighet med bromsad släpvagn | Trafikförordningen (1998:1276) 4 kap. 20 § · Teoribok — Körkortsboken 2026 för B-körkort Hastigheter för olika fordon s. 190 |
| `fsl-004` | Fordonsslag och hastigheter | Högsta hastighet vid bogsering | Trafikförordningen (1998:1276) 4 kap. 20 § · Teoribok — Körkortsboken 2026 för B-körkort Hastigheter för olika fordon s. 190 |
| `fsl-005` | Fordonsslag och hastigheter | Moped klass I och klass II | Teoribok — Körkortsboken 2026 för B-körkort Indelning av fordon s. 189 · Teoribok — Körkortsboken 2026 för B-körkort Kollektivkörfält s. 18 |
| `fsl-006` | Fordonsslag och hastigheter | Varför andra fordons hastigheter spelar roll | Teoribok — Körkortsboken 2026 för B-körkort Hastigheter för olika fordon s. 190 |

### Inledning — 11

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `tra-009` | Vägens användning | Busshållplats i tätort | Trafikförordningen (1998:1276) 3 kap. 12 § |
| `has-001` | Hastighetsgränser | Bashastighet | Trafikförordningen (1998:1276) 3 kap. 17 § |
| `has-002` | Hastighetsgränser | Bashastighet utanför tätort | Trafikförordningen (1998:1276) 3 kap. 17 § |
| `has-003` | Anpassad hastighet | Anpassad hastighet | Trafikförordningen (1998:1276) 3 kap. 14 § |
| `has-005` | Anpassad hastighet | Sträcka per sekund | Fysik: enhetsomvandling km/h till m/s |
| `has-006` | Anpassad hastighet | Bromssträckans förhållande till hastigheten | Fysik: rörelseenergi och friktion |
| `has-009` | Hastighetsgränser | Hastighet med släp | Trafikförordningen (1998:1276) 4 kap. 20 § · Teoribok — Körkortsboken 2026 för B-körkort Hastigheter för olika fordon s. 190 |
| `bl2-001` | Hastighetsgränser | Flera märken på samma stolpe | Vägmärkesförordningen (2007:90) 2 kap. C31, B4 · Teoribok — Körkortsboken 2026 för B-körkort Vägmärken s. 324 |
| `bl2-015` | Skymd sikt | Stillastående buss | Trafikförordningen (1998:1276) 3 kap. 25 § · Teoribok — Körkortsboken 2026 för B-körkort Barn s. 169 |
| `grd-003` | Hastighetsgränser | Bashastighet utanför tätort | Trafikförordningen (1998:1276) 3 kap. 17 § · Teoribok — Körkortsboken 2026 för B-körkort Hastighet och bashastighet s. 9 |
| `grd-004` | Grundläggande bestämmelser | Bältesanvändning | Trafikförordningen (1998:1276) 4 kap. 10 § · Teoribok — Körkortsboken 2026 för B-körkort Säkerhetsbälte s. 232 |

### Järnvägskorsningar — 2

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `jvg-010` | Att korsa en plankorsning | Bedömning av tågets hastighet | Teoribok — Körkortsboken 2026 för B-körkort Hur man korsar en järnväg säkert s. 109 · Trafikförordningen (1998:1276) 3 kap. 25 § |
| `jvg-016` | Märken och signaler | Varning för järnvägskorsning | Vägmärkesförordningen (2007:90) 2 kap. A35–A38 · Teoribok — Körkortsboken 2026 för B-körkort Avstånd till järnvägskorsning s. 109 |

### Krocksäkerhet — 3

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `krk-003` | Krocksäkerhet | Ansvar för bältesanvändning | Trafikförordningen (1998:1276) 4 kap. 10 § · Teoribok — Körkortsboken 2026 för B-körkort Säkerhetsbälte s. 232 |
| `krk-006` | Krocksäkerhet | Krockkudde och bälte | Teoribok — Körkortsboken 2026 för B-körkort Krockkudde (airbag) s. 233 |
| `krk-008` | Krocksäkerhet | Barnskydd i bil | Trafikförordningen (1998:1276) 4 kap. 10 § · Teoribok — Körkortsboken 2026 för B-körkort Bilbarnstolar s. 238 |

### Körfält — 4

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `has-008` | Placering i körfält | Sidoavstånd till cyklist | Trafikförordningen (1998:1276) 3 kap. 32 § |
| `krf-006` | Placering i körfält | Val av körfält vid olika hastighetsgränser | Trafikförordningen (1998:1276) 3 kap. 7 § · Teoribok — Körkortsboken 2026 för B-körkort Vilket körfält du ska välja s. 16 |
| `krf-007` | Placering i körfält | Fri körfältsplacering vid låg hastighet | Trafikförordningen (1998:1276) 3 kap. 7 § · Teoribok — Körkortsboken 2026 för B-körkort Vilket körfält du ska välja s. 16 |
| `bld-001` | Placering i körfält | Körfältsval enligt körfältsvägvisare | Trafikförordningen (1998:1276) 3 kap. 7 § · Vägmärkesförordningen (2007:90) 2 kap. F8 · Teoribok — Körkortsboken 2026 för B-körkort Vilket körfält du ska välja s. 16 |

### Landsväg — 3

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `has-004` | Avstånd till andra | Avstånd till framförvarande | Trafikförordningen (1998:1276) 3 kap. 2 § · Körstrategi och avståndsbedömning |
| `has-010` | Avstånd till andra | Avstånd bakom tungt fordon | Körstrategi, sikt och tunga fordon |
| `ber-008` | Avstånd till andra | Tresekundersregeln | Trafikverket · Teoribok — Körkortsboken 2026 för B-körkort Hålla rätt avstånd s. 81 |

### Motorväg & motortrafikled — 5

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `mot-001` | Påfart och avfart | Påfart till motorväg | Trafikförordningen (1998:1276) 3 kap. 44 § |
| `mot-002` | Regler på motorväg | Fordon som inte får köra på motorväg | Trafikförordningen (1998:1276) 9 kap. 1 § |
| `mot-004` | Regler på motorväg | Förbjudna manövrar | Trafikförordningen (1998:1276) 9 kap. 2 § |
| `mot-006` | Regler på motorväg | Hastighetsanpassning efter motorväg | Trafikpsykologi: hastighetsanpassning |
| `mot-007` | Motortrafikled | Motortrafikled | Trafikförordningen (1998:1276) 9 kap. 1 § |

### Nedsatt förmåga — 1

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `ned-004` | Nedsatt förmåga och samspel | Ålder och olycksrisk | Teoribok — Körkortsboken 2026 för B-körkort Äldre i trafiken s. 163 |

### Omkörningar — 2

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `omk-005` | Omkörningsregler | Omkörningens tid och sträcka | Körstrategi: omkörningens tidsåtgång |
| `bl2-011` | Omkörningsregler | Sikt vid omkörning | Trafikförordningen (1998:1276) 3 kap. 30–36 §§ · Teoribok — Körkortsboken 2026 för B-körkort Omkörningar s. 98 |

### Passager — 2

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `pas-013` | Cykelpassage och cykelöverfart | Utformning av cykelöverfart | Teoribok — Körkortsboken 2026 för B-körkort Cykelöverfart s. 52 |
| `bld-007` | Cykelpassage och cykelöverfart | Att skilja cykelöverfart från cykelpassage | Vägmärkesförordningen (2007:90) 2 kap. B8 · Trafikförordningen (1998:1276) 3 kap. 61 b § · Teoribok — Körkortsboken 2026 för B-körkort Cykelöverfart s. 52 |

### Registreringsbevis — 4

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `reg-001` | Registrering och avställning | Registreringsbevisets delar | Transportstyrelsen Registreringsbevis · Teoribok — Körkortsboken 2026 för B-körkort Registreringsbevis s. 290 |
| `reg-002` | Registrering och avställning | Avställning sker aldrig automatiskt | Transportstyrelsen Avställning · Teoribok — Körkortsboken 2026 för B-körkort Avställning och påställning s. 292 |
| `reg-003` | Registrering och avställning | Körning med avställt fordon | Transportstyrelsen Avställning · Teoribok — Körkortsboken 2026 för B-körkort Avställning och påställning s. 293 |
| `reg-004` | Registrering och avställning | Försäkring vid ägarbyte | Transportstyrelsen Ägarbyte · Teoribok — Körkortsboken 2026 för B-körkort Hur ägarbyte av fordon går till s. 292 |

### Sparsam körning — 4

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `mil-002` | Sparsam körning | Faktorer som påverkar förbrukningen | Sparsam körning, ecodriving |
| `mil-006` | Sparsam körning | Hastighet och förbrukning | Sparsam körning, ecodriving |
| `drv-002` | Sparsam körning | Växelval vid sparsam körning | Trafikverket Sparsam körning · Teoribok — Körkortsboken 2026 för B-körkort Kör på så höga växlar som möjligt s. 312 |
| `drv-007` | Sparsam körning | Motorvärmare | Teoribok — Körkortsboken 2026 för B-körkort Motorvärmare s. 305 |

### Speciella gator — 7

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `vag-006` | Anvisningsmärken | Gågata | Trafikförordningen (1998:1276) 8 kap. 1 § |
| `vag-007` | Anvisningsmärken | Gångfartsområde | Trafikförordningen (1998:1276) 8 kap. 1 § |
| `bld-015` | Anvisningsmärken | Gångfartsområde | Vägmärkesförordningen (2007:90) 2 kap. E9 · Trafikförordningen (1998:1276) 8 kap. 1 § · Teoribok — Körkortsboken 2026 för B-körkort Gångfartsområde s. 116 |
| `vmk-013` | Anvisningsmärken | Rekommenderad lägre hastighet (E11) | Vägmärkesförordningen (2007:90) 2 kap. E11 · Teoribok — Körkortsboken 2026 för B-körkort Anvisningsmärken (E) s. 334 |
| `vmk-019` | Anvisningsmärken | Motorväg (E1) | Vägmärkesförordningen (2007:90) 2 kap. E1 · Teoribok — Körkortsboken 2026 för B-körkort Anvisningsmärken (E) s. 333 |
| `vmk-023` | Anvisningsmärken | Gågata kontra gångfartsområde | Vägmärkesförordningen (2007:90) 2 kap. E7, E9 · Teoribok — Körkortsboken 2026 för B-körkort Speciella gator s. 116 |
| `vmk-024` | Anvisningsmärken | Tättbebyggt område (E5) | Vägmärkesförordningen (2007:90) 2 kap. E5 · Trafikförordningen (1998:1276) 3 kap. 17 § · Teoribok — Körkortsboken 2026 för B-körkort Tättbebyggt område (E5) s. 116 |

### Stanna & parkera — 9

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `par-001` | Förbud att parkera | Skillnad stannande och parkering | Trafikförordningen (1998:1276) 1 kap. 4 § |
| `par-004` | Förbud att parkera | Parkering på huvudled | Trafikförordningen (1998:1276) 3 kap. 55 § |
| `par-005` | Parkeringsregler | Parkering i färdriktningen | Trafikförordningen (1998:1276) 3 kap. 52 § |
| `par-007` | Parkeringsregler | Parkering och utfarter | Trafikförordningen (1998:1276) 3 kap. 54 § |
| `par-008` | Förbud att parkera | Parkering på backkrön och i kurva | Trafikförordningen (1998:1276) 3 kap. 53 § |
| `par-009` | Parkeringsregler | Parkeringsskyltens tilläggstavlor | Vägmärkesförordningen (2007:90) T6 |
| `par-010` | Förbud att stanna | Stannande i cykelfält | Trafikförordningen (1998:1276) 3 kap. 53 § |
| `bld-012` | Parkeringsregler | Att läsa tilläggstavlor vid parkering | Vägmärkesförordningen (2007:90) 2 kap. T6 · Teoribok — Körkortsboken 2026 för B-körkort Tilläggstavlor vid parkering s. 73 |
| `bld-013` | Parkeringsregler | Tider inom parentes på tilläggstavla | Vägmärkesförordningen (2007:90) 2 kap. T6 · Teoribok — Körkortsboken 2026 för B-körkort Tilläggstavlor vid parkering s. 73 |

### Synen — 7

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `man-002` | Reaktion och sinnen | Reaktionssträcka i praktiken | Fysik: hastighet, tid och sträcka |
| `man-003` | Reaktion och sinnen | Faktorer som förlänger reaktionstiden | Trafikpsykologi: reaktionstid |
| `man-004` | Reaktion och sinnen | Mobiltelefon under körning | Trafikförordningen (1998:1276) 4 kap. 10 e § |
| `ber-002` | Reaktion och sinnen | Reaktionssträcka vid längre reaktionstid | Trafikverket · Teoribok — Körkortsboken 2026 för B-körkort Reaktionssträckan kan bli längre av s. 196 |
| `ber-003` | Reaktion och sinnen | Bromssträcka på torr asfalt | Trafikverket · Teoribok — Körkortsboken 2026 för B-körkort Räkna ut bromssträckan s. 199 |
| `ber-004` | Reaktion och sinnen | Stoppsträcka | Trafikverket · Teoribok — Körkortsboken 2026 för B-körkort Räkna ut stoppsträckan s. 200 |
| `mns-040` | Reaktion och sinnen | Blicktid och sträcka | Trafikverket · Teoribok — Körkortsboken 2026 för B-körkort Km/h omräknat till meter per sekund s. 103 |

### Trafikolyckor — 2

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `ris-008` | Riskbedömning | Krockvåld och hastighet | Trafiksäkerhet: krockvåld och hastighet |
| `mns-034` | Djur på vägen | Undanmanöver vid älg | Teoribok — Körkortsboken 2026 för B-körkort Älgolyckor s. 177 |

### Trötthet — 3

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `tro-001` | Trötthet | Åtgärd mot trötthet | Trafikmedicin: trötthet och vakenhet |
| `tro-002` | Trötthet | Tecken på trötthet | Trafikmedicin: trötthet och vakenhet |
| `mns-027` | Trötthet | Mikrosömn | Teoribok — Körkortsboken 2026 för B-körkort Faror & risker s. 150 |

### Vägmärken — 4

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `vag-003` | Förbudsmärken | Förbudsmärkens giltighet | Vägmärkesförordningen (2007:90) 2 kap. |
| `vag-010` | Förbudsmärken | Hastighetsmärke | Vägmärkesförordningen (2007:90) C31 |
| `vag-012` | Varningsmärken | Avstånd till faran | Vägmärkesförordningen (2007:90) 2 kap. |
| `vmk-012` | Förbudsmärken | Hastighetsbegränsning (C31) | Vägmärkesförordningen (2007:90) 2 kap. C31 · Teoribok — Körkortsboken 2026 för B-körkort Förbudsmärken (C) s. 331 |

### Väjningsregler — 1

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `kor-008` | Huvudled | Huvudled | Vägmärkesförordningen (2007:90) B4 · Trafikförordningen (1998:1276) 3 kap. 55 § |

## P2 — 65 frågor

### Alkohol — 3

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `alk-007` | Droger och läkemedel | Nolltolerans mot narkotika | Lag (1951:649) om straff för vissa trafikbrott |
| `mns-021` | Droger och läkemedel | Nolltolerans mot narkotika | Teoribok — Körkortsboken 2026 för B-körkort Droger & narkotika i trafiken s. 142 |
| `mns-022` | Droger och läkemedel | Vakenhetshöjande droger | Teoribok — Körkortsboken 2026 för B-körkort Droger & narkotika i trafiken s. 142 |

### Barn — 1

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `mns-029` | Barn och oskyddade | Barns riskbedömning | Teoribok — Körkortsboken 2026 för B-körkort Oförmögna att förutse risker s. 169 |

### Belysning — 2

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `bel-005` | Dimma | Helljus i dimma | Teoribok — Körkortsboken 2026 för B-körkort Dimma och snöfall s. 263 · Teoribok — Körkortsboken 2026 för B-körkort Dimljus s. 264 |
| `grd-007` | Ljusanvändning | Halvljus | Trafikförordningen (1998:1276) 3 kap. 68 § · Teoribok — Körkortsboken 2026 för B-körkort Belysning s. 262 |

### Cirkulationsplats — 3

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `cir-003` | Körfält och tecken i cirkulation | Tecken vid utfart ur cirkulationsplats | Trafikförordningen (1998:1276) 3 kap. 64 § · Teoribok — Körkortsboken 2026 för B-körkort Köra rakt fram i cirkulationsplats s. 59 |
| `cir-005` | Körfält och tecken i cirkulation | Vänsterblinkning i cirkulationsplats | Teoribok — Körkortsboken 2026 för B-körkort Förtydligande angående blinkning till vänster s. 62 |
| `cir-007` | Körfält och tecken i cirkulation | Körfältsbyte inne i cirkulationsplats | Trafikförordningen (1998:1276) 3 kap. 12 § · Teoribok — Körkortsboken 2026 för B-körkort Hur man ska köra i cirkulationsplatser s. 58 |

### Drivmedel — 1

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `drv-013` | Drivmedel och utsläppsklasser | Bensin jämfört med diesel | Teoribok — Körkortsboken 2026 för B-körkort Bensin och diesel s. 318 |

### Inledning — 2

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `vaj-001` | Polisens tecken | Rangordning: signal före vägmärke | Teoribok — Körkortsboken 2026 för B-körkort Rangordning s. 8 · Trafikförordningen (1998:1276) 2 kap. 2 § |
| `grd-008` | Vägens användning | Fri väg för utryckningsfordon | Trafikförordningen (1998:1276) 2 kap. 6 § · Teoribok — Körkortsboken 2026 för B-körkort Utryckningsfordon s. 39 |

### Inlärning & mognad — 2

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `man-006` | Attityd och grupptryck | Grupptryck | Trafikpsykologi: grupptryck och ungas olycksrisk |
| `mns-008` | Attityd och grupptryck | Positivt grupptryck | Teoribok — Körkortsboken 2026 för B-körkort Grupptryck s. 135 |

### Järnvägskorsningar — 5

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `jvg-009` | Att korsa en plankorsning | Motorstopp på spåret | Teoribok — Körkortsboken 2026 för B-körkort Stopp mitt på spåret s. 110 |
| `jvg-013` | Omkörning vid plankorsning | Omkörningsförbud vid plankorsning | Trafikförordningen (1998:1276) 3 kap. 40 § · Teoribok — Körkortsboken 2026 för B-körkort Omkörning vid plankorsning s. 111 |
| `jvg-014` | Omkörning vid plankorsning | Vilken signal som upphäver omkörningsförbudet | Trafikförordningen (1998:1276) 3 kap. 40 § · Teoribok — Körkortsboken 2026 för B-körkort Rätt typ av signal s. 111 |
| `bld-014` | Omkörning vid plankorsning | Omkörning vid plankorsning med bommar | Trafikförordningen (1998:1276) 3 kap. 40 § · Teoribok — Körkortsboken 2026 för B-körkort Omkörning vid plankorsning s. 111 |
| `bl2-005` | Omkörning vid plankorsning | Bommar och omkörningsförbud | Trafikförordningen (1998:1276) 3 kap. 40 § · Teoribok — Körkortsboken 2026 för B-körkort Omkörning vid plankorsning s. 111 |

### Körfält — 8

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `has-007` | Placering i körfält | Placering på flerfilig väg | Trafikförordningen (1998:1276) 3 kap. 7 § |
| `krf-002` | Placering i körfält | Placering i körfältet | Trafikförordningen (1998:1276) 3 kap. 7 § · Teoribok — Körkortsboken 2026 för B-körkort Hur bilen ska placeras i körfältet s. 14 |
| `krf-005` | Körfält och sväng | Sväng på enkelriktad väg | Trafikförordningen (1998:1276) 3 kap. 6 § · Teoribok — Körkortsboken 2026 för B-körkort I samband med sväng på enkelriktad väg s. 15 |
| `krf-009` | Körfältsbyte | Heldragen linje vid körfältsbyte | Vägmärkesförordningen (2007:90) 3 kap. M2 · Trafikförordningen (1998:1276) 3 kap. 11 § · Teoribok — Körkortsboken 2026 för B-körkort Körfältsbyte s. 18 |
| `krf-012` | Körfältsbyte | Kollektivkörfält | Vägmärkesförordningen (2007:90) 2 kap. D10 · Teoribok — Körkortsboken 2026 för B-körkort Kollektivkörfält (bussfil) s. 18 |
| `krf-014` | Körfältsbyte | Tecken vid körfältsbyte | Trafikförordningen (1998:1276) 3 kap. 64 § · Teoribok — Körkortsboken 2026 för B-körkort Förtydligande om blinkersanvändning s. 263 |
| `mrk-011` | Körfält och sväng | Körfältspilar (M19) | Vägmärkesförordningen (2007:90) 3 kap. M19 · Trafikförordningen (1998:1276) 3 kap. 64 § · Teoribok — Körkortsboken 2026 för B-körkort Vägmarkeringar s. 351 |
| `mrk-012` | Körfältsbyte | Bussymbol i körfältet (M28) | Vägmärkesförordningen (2007:90) 3 kap. M28 · Teoribok — Körkortsboken 2026 för B-körkort Kollektivkörfält (bussfil) s. 18 |

### Miljö — 1

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `drv-010` | Miljöpåverkan | Kolmonoxid | Teoribok — Körkortsboken 2026 för B-körkort Kemiska föroreningar s. 307 |

### Motorväg & motortrafikled — 1

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `vaj-009` | Motortrafikled | Regler på motortrafikled | Teoribok — Körkortsboken 2026 för B-körkort Motortrafikled s. 93 · Trafikförordningen (1998:1276) 3 kap. 3 § |

### Omkörningar — 2

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `omk-002` | Omkörningsregler | Omkörning till höger | Trafikförordningen (1998:1276) 3 kap. 34 § |
| `omk-004` | Förbud mot omkörning | Omkörning före korsning | Trafikförordningen (1998:1276) 3 kap. 40 § |

### Passager — 10

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `pas-001` | Gående och cyklister | Att visa sin avsikt att väja | Trafikförordningen (1998:1276) 3 kap. 5 § · Trafikförordningen (1998:1276) 3 kap. 61 § · Teoribok — Körkortsboken 2026 för B-körkort Obevakat övergångsställe s. 46 |
| `pas-006` | Gående och cyklister | Att korsa en gångbana | Trafikförordningen (1998:1276) 3 kap. 59 § · Teoribok — Körkortsboken 2026 för B-körkort Gångbana s. 48 |
| `pas-007` | Gående och cyklister | Gångbana som inte korsar vägen | Trafikförordningen (1998:1276) 3 kap. 60 § · Teoribok — Körkortsboken 2026 för B-körkort Gångbana s. 48 |
| `pas-010` | Cykelpassage och cykelöverfart | Cyklistens skyldighet vid cykelpassage | Trafikförordningen (1998:1276) 3 kap. 61 a § · Teoribok — Körkortsboken 2026 för B-körkort Obevakad cykelpassage s. 50 |
| `pas-011` | Cykelpassage och cykelöverfart | Cykelöverfart | Trafikförordningen (1998:1276) 3 kap. 61 b § · Vägmärkesförordningen (2007:90) 2 kap. B8 · Teoribok — Körkortsboken 2026 för B-körkort Cykelöverfart s. 52 |
| `pas-012` | Cykelpassage och cykelöverfart | Vilka väjningsplikten vid cykelöverfart omfattar | Trafikförordningen (1998:1276) 3 kap. 61 b § · Teoribok — Körkortsboken 2026 för B-körkort Cykelöverfart s. 52 |
| `pas-015` | Cykelpassage och cykelöverfart | Att korsa en cykelbana | Trafikförordningen (1998:1276) 3 kap. 61 § · Teoribok — Körkortsboken 2026 för B-körkort Cykelbana s. 53 |
| `bld-009` | Cykelpassage och cykelöverfart | Övergångsställe kombinerat med cykelpassage | Trafikförordningen (1998:1276) 3 kap. 61 § · Trafikförordningen (1998:1276) 3 kap. 61 a § · Teoribok — Körkortsboken 2026 för B-körkort Cykelpassage s. 52 |
| `bl3-005` | Cykelpassage och cykelöverfart | Huvudled och cykelpassage | Trafikförordningen (1998:1276) 3 kap. 61 § · Vägmärkesförordningen (2007:90) 2 kap. B4 · Teoribok — Körkortsboken 2026 för B-körkort Cykelpassage s. 51 |
| `grd-011` | Gående och cyklister | Väjningsplikt vid obevakat övergångsställe | Trafikförordningen (1998:1276) 3 kap. 61 § · Teoribok — Körkortsboken 2026 för B-körkort Obevakat övergångsställe s. 46 |

### Rättsfall — 1

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `rtp-003` | Rättsfall och praxis | Hastighet som bedömningsgrund | Teoribok — Körkortsboken 2026 för B-körkort Anpassa hastigheten s. 9 · Teoribok — Körkortsboken 2026 för B-körkort Rättsfall s. 362 |

### Speciella gator — 4

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `vmk-025` | Anvisningsmärken | Tidsangivelse på tilläggstavla (T6) | Vägmärkesförordningen (2007:90) 2 kap. T6 · Teoribok — Körkortsboken 2026 för B-körkort Tilläggstavlor (T) s. 346 |
| `vmk-026` | Anvisningsmärken | Parentestider på tilläggstavla | Vägmärkesförordningen (2007:90) 2 kap. T6 · Teoribok — Körkortsboken 2026 för B-körkort Tilläggstavlor (T) s. 346 |
| `vmk-027` | Anvisningsmärken | Tilläggstavlan Boende (T19) | Vägmärkesförordningen (2007:90) 2 kap. T19 · Transportstyrelsen Parkeringsregler · Teoribok — Körkortsboken 2026 för B-körkort Tilläggstavlor (T) s. 346 |
| `bl2-006` | Anvisningsmärken | Gågata | Vägmärkesförordningen (2007:90) 2 kap. E7 · Teoribok — Körkortsboken 2026 för B-körkort Speciella gator s. 116 |

### Synen — 2

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `ber-009` | Reaktion och sinnen | Vad reaktionstiden beror på | Trafikverket · Teoribok — Körkortsboken 2026 för B-körkort Reaktionssträcka och bromssträcka s. 200 |
| `ber-010` | Reaktion och sinnen | Vad som påverkar bromssträckan | Trafikverket · Teoribok — Körkortsboken 2026 för B-körkort Bromssträckans längd påverkas av s. 198 |

### Säkerhetskontroller — 1

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `for-005` | Kontroll och besiktning | Körförbud | Fordonslagen och besiktningsregler |

### Trafikolyckor — 1

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `ris-006` | Djur på vägen | Anmälningsplikt vid viltolycka | Jaktförordningen, anmälningsplikt vid sammanstötning med vilt |

### Vägmärken — 8

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `vag-008` | Vägmarkeringar | Heldragen linje | Trafikförordningen (1998:1276) 3 kap. 11 § |
| `vmk-009` | Förbudsmärken | Förbud mot att parkera (C35) | Vägmärkesförordningen (2007:90) 2 kap. C35 · Teoribok — Körkortsboken 2026 för B-körkort Förbudsmärken (C) s. 330 |
| `vmk-010` | Förbudsmärken | Förbud mot att stanna och parkera (C39) | Vägmärkesförordningen (2007:90) 2 kap. C39 · Teoribok — Körkortsboken 2026 för B-körkort Förbudsmärken (C) s. 331 |
| `vmk-014` | Förbudsmärken | Förbud mot omkörning (C27) | Vägmärkesförordningen (2007:90) 2 kap. C27 · Trafikförordningen (1998:1276) 3 kap. 40 § · Teoribok — Körkortsboken 2026 för B-körkort Förbudsmärken (C) s. 330 |
| `vmk-017` | Påbudsmärken | Påbjuden cykelbana (D4) | Vägmärkesförordningen (2007:90) 2 kap. D4 · Trafikförordningen (1998:1276) 3 kap. 61 § · Teoribok — Körkortsboken 2026 för B-körkort Påbudsmärken (D) s. 333 |
| `vmk-018` | Påbudsmärken | Kollektivkörfält (D10) | Vägmärkesförordningen (2007:90) 2 kap. D10 · Teoribok — Körkortsboken 2026 för B-körkort Kollektivkörfält (bussfil) s. 18 |
| `vmk-033` | Varningsmärken | Järnvägskorsning med eller utan bommar | Vägmärkesförordningen (2007:90) 2 kap. A35, A36 · Trafikförordningen (1998:1276) 3 kap. 40 § · Teoribok — Körkortsboken 2026 för B-körkort Omkörning vid plankorsning s. 111 |
| `mrk-008` | Vägmarkeringar | Väjningslinje (M14) | Vägmärkesförordningen (2007:90) 3 kap. M14 · Trafikförordningen (1998:1276) 3 kap. 5 § · Teoribok — Körkortsboken 2026 för B-körkort Vägmarkeringar s. 351 |

### Väjningsregler — 7

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `tra-002` | Trafiksignaler och tecken | Signalbilder | Trafikförordningen (1998:1276) 3 kap. 6 § |
| `vaj-007` | Trafiksignal i korsning | Släckt pil vid rund grön signal | Teoribok — Körkortsboken 2026 för B-körkort Vanlig signal med pil s. 41 · Vägmärkesförordningen (2007:90) 3 kap. 3 § |
| `vaj-008` | Trafiksignal i korsning | Grön pil | Teoribok — Körkortsboken 2026 för B-körkort Grön pil s. 41 · Vägmärkesförordningen (2007:90) 3 kap. 3 § |
| `kor-002` | Utfartsregeln | Utfartsregeln | Trafikförordningen (1998:1276) 3 kap. 21 § |
| `kor-003` | Utfartsregeln | Utfartsregeln | Trafikförordningen (1998:1276) 3 kap. 21 § |
| `kor-011` | Trafiksignal i korsning | Gult ljus | Trafikförordningen (1998:1276) 3 kap. 6 § |
| `bld-002` | Stopplikt | Tilläggstavlan Flervägsstopp | Vägmärkesförordningen (2007:90) 2 kap. B2 · Trafikförordningen (1998:1276) 3 kap. 21 § · Teoribok — Körkortsboken 2026 för B-körkort Flervägsstopp s. 24 |

## P3 — 253 frågor

### Alkohol — 2

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `alk-006` | Droger och läkemedel | Läkemedel och körning | Lag (1951:649) om straff för vissa trafikbrott |
| `mns-020` | Droger och läkemedel | Ansvar för läkemedelspåverkan | Teoribok — Körkortsboken 2026 för B-körkort Läkemedel & mediciner i trafiken s. 141 |

### Barn — 6

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `ris-004` | Barn och oskyddade | Barn i trafiken | Trafikpsykologi: barns utveckling i trafiken |
| `bl3-002` | Barn och oskyddade | Stannade bussar skymmer | Trafikförordningen (1998:1276) 3 kap. 1 § · Teoribok — Körkortsboken 2026 för B-körkort Barn s. 168 |
| `mns-028` | Barn och oskyddade | Barns sinnen | Teoribok — Körkortsboken 2026 för B-körkort Sinnena är inte färdigutvecklade s. 169 |
| `mns-030` | Barn och oskyddade | Barn bakom parkerade fordon | Teoribok — Körkortsboken 2026 för B-körkort Barn är små s. 169 |
| `mns-031` | Barn och oskyddade | Ögonkontakt med barn | Teoribok — Körkortsboken 2026 för B-körkort Lekande och impulsiva s. 168 · Trafikförordningen (1998:1276) 3 kap. 1 § |
| `mns-032` | Barn och oskyddade | Barn vid bussar | Teoribok — Körkortsboken 2026 för B-körkort Barn s. 168 |

### Belysning — 18

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `bel-001` | Belysning | Varselljus | Teoribok — Körkortsboken 2026 för B-körkort Varselljus s. 264 · Trafikförordningen (1998:1276) 3 kap. 68 § |
| `bel-002` | Belysning | Kombination av ljus | Teoribok — Körkortsboken 2026 för B-körkort Varselljus s. 264 · Trafikförordningen (1998:1276) 3 kap. 68 § |
| `bel-003` | Belysning | Främre dimljus | Teoribok — Körkortsboken 2026 för B-körkort Dimljus s. 264 · Trafikförordningen (1998:1276) 3 kap. 70 § |
| `bel-004` | Belysning | Dimbakljus | Teoribok — Körkortsboken 2026 för B-körkort Dimbakljus s. 264 · Trafikförordningen (1998:1276) 3 kap. 70 § |
| `bel-007` | Möte i mörker | Avbländning vid möte | Teoribok — Körkortsboken 2026 för B-körkort Korrekt avbländning — möte s. 266 · Trafikförordningen (1998:1276) 3 kap. 69 § |
| `bel-008` | Möte i mörker | Avbländning vid omkörning | Teoribok — Körkortsboken 2026 för B-körkort Korrekt avbländning — omkörning s. 267 · Trafikförordningen (1998:1276) 3 kap. 69 § |
| `bel-009` | Möte i mörker | Möte med lastbil i backkrön | Teoribok — Körkortsboken 2026 för B-körkort Avbländning vid möte med lastbil s. 263 · Trafikförordningen (1998:1276) 3 kap. 69 § |
| `bel-010` | Möte i mörker | Helljus vid korsning i mörker | Teoribok — Körkortsboken 2026 för B-körkort Helljus vid korsning s. 263 · Trafikförordningen (1998:1276) 3 kap. 69 § |
| `bel-011` | Möte i mörker | Blickpunkt vid bländning | Teoribok — Körkortsboken 2026 för B-körkort Undvika bländning s. 263 · Trafikverket |
| `mor-002` | Ljusanvändning | Halvljus | Trafikförordningen (1998:1276) 3 kap. 68 § |
| `mor-003` | Möte i mörker | Bländning vid möte | Trafikförordningen (1998:1276) 3 kap. 71 § |
| `mor-004` | Ljusanvändning | Helljus | Trafikförordningen (1998:1276) 3 kap. 71 § |
| `mor-006` | Mörkerkörning | Avståndsbedömning i mörker | Trafikpsykologi: perception i mörker |
| `mor-007` | Ljusanvändning | Dimljus | Trafikförordningen (1998:1276) 3 kap. 74 § |
| `mor-008` | Möte i mörker | Mötet i mörker | Trafiksäkerhet: möte i mörker |
| `hal-008` | Dimma | Körning i dimma | Trafikförordningen (1998:1276) 3 kap. 74 § |
| `for-004` | Belysning | Trasig lykta | Trafikförordningen (1998:1276) 3 kap. 68 § |
| `for-007` | Belysning | Varningsblinkers | Trafikförordningen (1998:1276) 3 kap. 74 § |

### Cirkulationsplats — 13

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `kor-005` | Cirkulationsplats | Cirkulationsplats | Trafikförordningen (1998:1276) 3 kap. 18 § · Vägmärkesförordningen (2007:90) D3 |
| `kor-006` | Cirkulationsplats | Tecken i cirkulationsplats | Trafikförordningen (1998:1276) 3 kap. 64 § |
| `cir-001` | Cirkulationsplats | Väjningsplikt vid infart i cirkulationsplats | Trafikförordningen (1998:1276) 3 kap. 22 § · Vägmärkesförordningen (2007:90) 2 kap. D3 · Teoribok — Körkortsboken 2026 för B-körkort Cirkulationsplats s. 58 |
| `cir-002` | Cirkulationsplats | Körriktning i cirkulationsplats | Trafikförordningen (1998:1276) 3 kap. 22 § · Teoribok — Körkortsboken 2026 för B-körkort Cirkulationsplats s. 58 |
| `cir-004` | Körfält och tecken i cirkulation | Tecken vid infart i cirkulationsplats | Transportstyrelsen Cirkulationsplatser · Teoribok — Körkortsboken 2026 för B-körkort Köra rakt fram i cirkulationsplats s. 59 |
| `cir-006` | Körfält och tecken i cirkulation | Körfältsval i cirkulationsplats | Trafikförordningen (1998:1276) 3 kap. 22 § · Teoribok — Körkortsboken 2026 för B-körkort Hur man ska köra i cirkulationsplatser s. 58 |
| `cir-008` | Cirkulationsplats | Cirkelformad korsning som inte är cirkulationsplats | Vägmärkesförordningen (2007:90) 2 kap. D3 · Teoribok — Körkortsboken 2026 för B-körkort Cirkelformad vägkorsning s. 63 |
| `cir-009` | Cirkulationsplats | Oskyddade trafikanter vid cirkulationsplats | Trafikförordningen (1998:1276) 3 kap. 61 a § · Teoribok — Körkortsboken 2026 för B-körkort Obevakad cykelpassage s. 50 |
| `cir-010` | Cirkulationsplats | Varför cirkulationsplatser byggs | Teoribok — Körkortsboken 2026 för B-körkort Fördelar med cirkulationsplatser s. 58 |
| `cir-011` | Körfält och tecken i cirkulation | Att underlätta andras körfältsbyten | Teoribok — Körkortsboken 2026 för B-körkort Hur man ska köra i cirkulationsplatser s. 58 |
| `cir-012` | Cirkulationsplats | Huvudled och cirkulationsplats | Trafikförordningen (1998:1276) 3 kap. 22 § · Vägmärkesförordningen (2007:90) 2 kap. D3 · Teoribok — Körkortsboken 2026 för B-körkort Cirkulationsplats s. 58 |
| `bld-010` | Cirkulationsplats | Väjningsplikt vid infart | Trafikförordningen (1998:1276) 3 kap. 22 § · Vägmärkesförordningen (2007:90) 2 kap. D3 · Teoribok — Körkortsboken 2026 för B-körkort Väjningsplikt vid infart s. 62 |
| `bld-011` | Cirkulationsplats | Cirkelformad korsning som inte är cirkulationsplats | Vägmärkesförordningen (2007:90) 2 kap. D3 · Trafikförordningen (1998:1276) 3 kap. 18 § · Teoribok — Körkortsboken 2026 för B-körkort Cirkelformad vägkorsning s. 63 |

### Drivmedel — 3

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `drv-014` | Drivmedel och utsläppsklasser | Hybridbil | Teoribok — Körkortsboken 2026 för B-körkort Hybrid s. 318 |
| `drv-015` | Drivmedel och utsläppsklasser | Elbilens miljöpåverkan | Teoribok — Körkortsboken 2026 för B-körkort El s. 318 · Teoribok — Körkortsboken 2026 för B-körkort Miljözoner s. 319 |
| `drv-016` | Drivmedel och utsläppsklasser | Miljözoner | Teoribok — Körkortsboken 2026 för B-körkort Miljözoner s. 319 · Teoribok — Körkortsboken 2026 för B-körkort Utsläppsklasser s. 319 |

### Inledning — 20

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `tra-001` | Grundläggande bestämmelser | Allmän aktsamhetsplikt | Trafikförordningen (1998:1276) 2 kap. 1 § |
| `tra-005` | Vägens användning | Grundregel för placering | Trafikförordningen (1998:1276) 3 kap. 7 § |
| `tra-008` | Grundläggande bestämmelser | Tecken | Trafikförordningen (1998:1276) 3 kap. 64 § |
| `vaj-002` | Polisens tecken | Rangordning när signalen är ur funktion | Teoribok — Körkortsboken 2026 för B-körkort Rangordning s. 8 · Trafikförordningen (1998:1276) 2 kap. 2 § |
| `kor-013` | Polisens tecken | Rangordning mellan tecken | Trafikförordningen (1998:1276) 2 kap. 3 § |
| `ris-002` | Skymd sikt | Hastighet vid skymd sikt | Trafikförordningen (1998:1276) 3 kap. 14 § |
| `ris-007` | Skymd sikt | Parkerade bilar som risk | Riskutbildning: stadsmiljö |
| `man-008` | Körstrategi | Blickteknik | Körstrategi: blickteknik |
| `man-009` | Körstrategi | Uppmärksamhetens gränser | Kognitionsforskning: uppmärksamhet och körning |
| `bl3-001` | Skymd sikt | Sidoavstånd till cyklist | Trafikförordningen (1998:1276) 3 kap. 33 § · Teoribok — Körkortsboken 2026 för B-körkort Defensiv körning s. 7 |
| `bl3-003` | Skymd sikt | Enfilig passage med skymd utfart | Trafikförordningen (1998:1276) 3 kap. 8 § · Trafikverket |
| `bl3-006` | Skymd sikt | Luckor mellan parkerade fordon | Trafikförordningen (1998:1276) 3 kap. 1 § · Teoribok — Körkortsboken 2026 för B-körkort Bedöma vad som händer s. 155 |
| `bl3-007` | Vägens användning | Kryssmärke vid spårväg | Vägmärkesförordningen (2007:90) 2 kap. A37, A39 · Trafikförordningen (1998:1276) 3 kap. 24 § |
| `bl3-008` | Polisens tecken | Signal före vägmärke | Trafikförordningen (1998:1276) 2 kap. 2 § · Teoribok — Körkortsboken 2026 för B-körkort Rangordning s. 8 |
| `grd-009` | Grundläggande bestämmelser | Aktsamhetsplikten | Trafikförordningen (1998:1276) 2 kap. 1 § · Teoribok — Körkortsboken 2026 för B-körkort Trafikens grundregler s. 6 |
| `mns-001` | Körstrategi | Överinlärning | Teoribok — Körkortsboken 2026 för B-körkort Olika typer av inlärning s. 132 |
| `mns-002` | Körstrategi | Ytinlärning | Teoribok — Körkortsboken 2026 för B-körkort Olika typer av inlärning s. 132 |
| `mns-003` | Körstrategi | Sannolikhetsinlärning | Teoribok — Körkortsboken 2026 för B-körkort Sannolikhetsinlärning s. 134 |
| `mns-004` | Körstrategi | Imitationsinlärning | Teoribok — Körkortsboken 2026 för B-körkort Olika typer av inlärning s. 132 |
| `mns-009` | Körstrategi | Att frångå reglerna med gott omdöme | Teoribok — Körkortsboken 2026 för B-körkort Frångå trafikreglerna ibland s. 133 |

### Inlärning & mognad — 10

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `tro-004` | Stress och känslor | Stress i trafiken | Trafikpsykologi: stress och uppmärksamhet |
| `tro-005` | Stress och känslor | Känslor och körning | Trafikpsykologi: känslor och risktagande |
| `man-007` | Attityd och grupptryck | Överskattning av egen förmåga | Trafikpsykologi: förarutveckling och risk |
| `mns-005` | Attityd och grupptryck | Mognadsgrader hos förare | Teoribok — Körkortsboken 2026 för B-körkort Olika grader av mognad s. 132 |
| `mns-006` | Attityd och grupptryck | Unga förares riskökning | Teoribok — Körkortsboken 2026 för B-körkort Unga bilförare s. 133 |
| `mns-007` | Attityd och grupptryck | Negativt grupptryck | Teoribok — Körkortsboken 2026 för B-körkort Grupptryck s. 135 |
| `mns-010` | Stress och känslor | Stressnivå och prestation | Teoribok — Körkortsboken 2026 för B-körkort Stress s. 134 |
| `mns-011` | Stress och känslor | Följder av hög stress | Teoribok — Körkortsboken 2026 för B-körkort För hög stress kan leda till s. 134 |
| `mns-012` | Stress och känslor | Att minska stress | Teoribok — Körkortsboken 2026 för B-körkort Minska risken för stress s. 134 |
| `mns-013` | Stress och känslor | Känslor och körning | Teoribok — Körkortsboken 2026 för B-körkort Stress s. 134 |

### Järnvägskorsningar — 12

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `jvg-001` | Märken och signaler | Avstånd till plankorsning (A38) | Vägmärkesförordningen (2007:90) 2 kap. A38 · Teoribok — Körkortsboken 2026 för B-körkort Avstånd till järnvägskorsning s. 109 |
| `jvg-002` | Märken och signaler | Ljussignal vid plankorsning | Trafikförordningen (1998:1276) 3 kap. 25 § · Teoribok — Körkortsboken 2026 för B-körkort Olika typer av järnvägsbommar s. 112 |
| `jvg-003` | Märken och signaler | Helbom och halvbom | Teoribok — Körkortsboken 2026 för B-körkort Olika typer av järnvägsbommar s. 112 |
| `jvg-004` | Märken och signaler | Plankorsning utan bommar | Trafikförordningen (1998:1276) 3 kap. 25 § · Teoribok — Körkortsboken 2026 för B-körkort Hur man korsar en järnväg säkert s. 109 |
| `jvg-005` | Att korsa en plankorsning | Anpassning efter sikt vid plankorsning | Teoribok — Körkortsboken 2026 för B-körkort Hur man korsar en järnväg säkert s. 109 |
| `jvg-006` | Att korsa en plankorsning | Växelval vid plankorsning | Teoribok — Körkortsboken 2026 för B-körkort Hur man korsar en järnväg säkert s. 109 |
| `jvg-007` | Att korsa en plankorsning | Köbildning vid plankorsning | Trafikförordningen (1998:1276) 3 kap. 25 § · Teoribok — Körkortsboken 2026 för B-körkort Stopp mitt på spåret s. 110 |
| `jvg-008` | Att korsa en plankorsning | Motorstopp på spåret | Teoribok — Körkortsboken 2026 för B-körkort Stopp mitt på spåret s. 110 |
| `jvg-011` | Att korsa en plankorsning | Efter plankorsningen | Trafikförordningen (1998:1276) 3 kap. 25 § · Teoribok — Körkortsboken 2026 för B-körkort Stopp mitt på spåret s. 110 |
| `jvg-012` | Att korsa en plankorsning | Långsamma fordon vid plankorsning | Teoribok — Körkortsboken 2026 för B-körkort Hur man korsar en järnväg säkert s. 109 |
| `jvg-015` | Omkörning vid plankorsning | Omkörning vid plankorsning med bommar | Trafikförordningen (1998:1276) 3 kap. 40 § · Teoribok — Körkortsboken 2026 för B-körkort Omkörningstabell s. 111 |
| `bl2-004` | Märken och signaler | Kryssmärke vid plankorsning | Vägmärkesförordningen (2007:90) 2 kap. A39 · Teoribok — Körkortsboken 2026 för B-körkort Järnvägskorsningar s. 108 |

### Krocksäkerhet — 5

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `krk-001` | Krocksäkerhet | Deformationszoner | Teoribok — Körkortsboken 2026 för B-körkort Deformationszoner s. 232 |
| `krk-002` | Krocksäkerhet | Sidokollisionens särskilda risk | Teoribok — Körkortsboken 2026 för B-körkort Särskilt sårbara områden s. 232 |
| `krk-004` | Krocksäkerhet | Bältets placering | Teoribok — Körkortsboken 2026 för B-körkort Säkerhetsbälte s. 233 |
| `krk-005` | Krocksäkerhet | Krockkudde och bakåtvänd bilbarnstol | Teoribok — Körkortsboken 2026 för B-körkort Krockkudde (airbag) s. 233 · Teoribok — Körkortsboken 2026 för B-körkort Bilbarnstolar s. 238 |
| `krk-007` | Krocksäkerhet | Nackskydd och whiplash | Teoribok — Körkortsboken 2026 för B-körkort Nackskydd s. 234 |

### Körfält — 10

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `tra-006` | Körfält och sväng | Placering före sväng | Trafikförordningen (1998:1276) 3 kap. 25 § |
| `tra-010` | Körfält och sväng | Körfältsbyte | Trafikförordningen (1998:1276) 3 kap. 33 § · Körkortsutbildning, körfältsbyte |
| `krf-001` | Körfält och sväng | Definitionen av körfält | Teoribok — Körkortsboken 2026 för B-körkort Olika typer av körfält s. 14 |
| `krf-003` | Placering i körfält | Placering vid god sikt framåt men skymd sikt åt sidorna | Teoribok — Körkortsboken 2026 för B-körkort Hur bilen ska placeras i körfältet s. 14 |
| `krf-004` | Körfält och sväng | Placering vid sväng | Trafikförordningen (1998:1276) 3 kap. 6 § · Teoribok — Körkortsboken 2026 för B-körkort I samband med sväng s. 15 |
| `krf-008` | Körfältsbyte | Kontroller före körfältsbyte | Trafikförordningen (1998:1276) 3 kap. 12 § · Teoribok — Körkortsboken 2026 för B-körkort Körfältsbyte s. 17 |
| `krf-010` | Körfältsbyte | Upprepade körfältsbyten i tät trafik | Trafikförordningen (1998:1276) 3 kap. 12 § · Teoribok — Körkortsboken 2026 för B-körkort Förbjudet att byta körfält s. 17 |
| `krf-011` | Körfältsbyte | Hastighet vid körfältsbyte | Teoribok — Körkortsboken 2026 för B-körkort Körfältsbyte s. 17 |
| `krf-013` | Körfältsbyte | Reversibelt körfält | Vägmärkesförordningen (2007:90) 3 kap. M7 · Teoribok — Körkortsboken 2026 för B-körkort Reversibelt körfält s. 18 |
| `bl2-014` | Körfält och sväng | Tillfälliga anvisningar vid vägarbete | Trafikförordningen (1998:1276) 2 kap. 3 § · Teoribok — Körkortsboken 2026 för B-körkort Vägarbeten s. 82 |

### Landsväg — 4

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `mot-008` | Landsväg | Mötesfri landsväg | Vägutformning: mötesfria vägar |
| `mot-010` | Landsväg | Landsvägens risker | Trafiksäkerhet: olyckstyper på landsväg |
| `bl2-013` | Landsväg | Vägkantens bärighet | Trafikförordningen (1998:1276) 3 kap. 7 § · Teoribok — Körkortsboken 2026 för B-körkort Landsväg s. 78 |
| `bl2-018` | Landsväg | Kantlinjens betydelse | Vägmärkesförordningen (2007:90) 3 kap. M5 · Teoribok — Körkortsboken 2026 för B-körkort Landsväg s. 80 |

### Miljö — 5

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `mil-004` | Miljöpåverkan | Avgasers påverkan | Miljökunskap: vägtrafikens utsläpp |
| `mil-005` | Miljöpåverkan | Partiklar och dubbdäck | Miljökunskap: partiklar och dubbdäck |
| `drv-009` | Miljöpåverkan | Katalysatorns funktion | Teoribok — Körkortsboken 2026 för B-körkort Katalysator s. 305 |
| `drv-011` | Miljöpåverkan | Koldioxid och växthuseffekten | Teoribok — Körkortsboken 2026 för B-körkort Kemiska föroreningar s. 307 |
| `drv-012` | Miljöpåverkan | Biltvätt | Teoribok — Körkortsboken 2026 för B-körkort Tvätta bilen rätt s. 307 |

### Motorväg & motortrafikled — 9

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `vaj-010` | Motortrafikled | Mötesfri väg som inte är motortrafikled | Teoribok — Körkortsboken 2026 för B-körkort Motortrafikled s. 93 · Vägmärkesförordningen (2007:90) 2 kap. E3 |
| `mot-003` | Regler på motorväg | Vägren på motorväg | Trafikförordningen (1998:1276) 3 kap. 47 § |
| `mot-005` | Påfart och avfart | Avfart från motorväg | Trafikförordningen (1998:1276) 3 kap. 45 § |
| `mot-009` | Regler på motorväg | Körfältsval på motorväg | Trafikförordningen (1998:1276) 3 kap. 7 § |
| `bl2-002` | Påfart och avfart | Hastighet på avfart | Trafikförordningen (1998:1276) 3 kap. 44 § · Teoribok — Körkortsboken 2026 för B-körkort Motorväg s. 92 |
| `bl2-009` | Regler på motorväg | Stillastående fordon på vägrenen | Trafikförordningen (1998:1276) 3 kap. 1 § · Teoribok — Körkortsboken 2026 för B-körkort Motorväg s. 91 |
| `bl2-010` | Påfart och avfart | Sammanvävning | Trafikförordningen (1998:1276) 3 kap. 44 § · Teoribok — Körkortsboken 2026 för B-körkort Körfältsbyte s. 17 |
| `bl2-016` | Regler på motorväg | Körfältsval på motorväg | Trafikförordningen (1998:1276) 3 kap. 7 § · Teoribok — Körkortsboken 2026 för B-körkort Motorväg s. 90 |
| `grd-012` | Regler på motorväg | Förbjudet på motorväg | Trafikförordningen (1998:1276) 3 kap. 44–48 §§ · Teoribok — Körkortsboken 2026 för B-körkort Motorväg s. 90 |

### Nedsatt förmåga — 6

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `ned-001` | Nedsatt förmåga och samspel | Signaler med vit käpp | Teoribok — Körkortsboken 2026 för B-körkort Signaler med vit käpp s. 162 |
| `ned-002` | Nedsatt förmåga och samspel | Att släppa över en synskadad | Teoribok — Körkortsboken 2026 för B-körkort När du släpper över en synskadad s. 162 |
| `ned-003` | Nedsatt förmåga och samspel | Ledarhund | Teoribok — Körkortsboken 2026 för B-körkort Ledarhund s. 163 |
| `ned-005` | Nedsatt förmåga och samspel | Dolda funktionsnedsättningar | Teoribok — Körkortsboken 2026 för B-körkort Funktionsnedsättning s. 162 |
| `ned-006` | Nedsatt förmåga och samspel | Tilläggstavla nedsatt syn | Vägmärkesförordningen (2007:90) 2 kap. T9 · Teoribok — Körkortsboken 2026 för B-körkort Nedsatt syn (T9) s. 163 |
| `ned-007` | Nedsatt förmåga och samspel | Särskild hänsyn mot barn | Trafikförordningen (1998:1276) 3 kap. 1 § · Teoribok — Körkortsboken 2026 för B-körkort Barn s. 168 |

### Omkörningar — 9

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `vaj-011` | Möte | Bedöma mötande fordon | Teoribok — Körkortsboken 2026 för B-körkort Möte och bedömning s. 101 · Trafikverket |
| `vaj-012` | Möte | Skyldighet vid otillåten omkörning | Teoribok — Körkortsboken 2026 för B-körkort Omkörning över heldragen linje s. 101 · Trafikförordningen (1998:1276) 3 kap. 43 § |
| `omk-001` | Omkörningsregler | Omkörningens huvudregel | Trafikförordningen (1998:1276) 3 kap. 33 § |
| `omk-003` | Förbud mot omkörning | Omkörning vid övergångsställe | Trafikförordningen (1998:1276) 3 kap. 40 § |
| `omk-006` | Möte | Möte på smal väg | Trafikförordningen (1998:1276) 3 kap. 30 § |
| `omk-007` | Omkörningsregler | Att bli omkörd | Trafikförordningen (1998:1276) 3 kap. 38 § |
| `omk-008` | Förbud mot omkörning | Sikt vid omkörning | Trafikförordningen (1998:1276) 3 kap. 36 § |
| `bld-016` | Omkörningsregler | Omkörningsbeslut på vinterväg | Trafikförordningen (1998:1276) 3 kap. 30 § · Teoribok — Körkortsboken 2026 för B-körkort Omkörningar s. 100 |
| `bl2-012` | Omkörningsregler | Omkörning på vinterväg | Trafikförordningen (1998:1276) 3 kap. 30 § · Teoribok — Körkortsboken 2026 för B-körkort Vinter s. 124 |

### Passager — 13

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `tra-003` | Gående och cyklister | Obevakat övergångsställe | Trafikförordningen (1998:1276) 3 kap. 61 § |
| `tra-004` | Gående och cyklister | Cykelöverfart och cykelpassage | Trafikförordningen (1998:1276) 3 kap. 61 a § |
| `pas-002` | Gående och cyklister | Bevakat övergångsställe | Trafikförordningen (1998:1276) 3 kap. 61 § · Teoribok — Körkortsboken 2026 för B-körkort Bevakat övergångsställe s. 46 |
| `pas-003` | Gående och cyklister | Bevakat eller obevakat övergångsställe | Trafikförordningen (1998:1276) 3 kap. 61 § · Teoribok — Körkortsboken 2026 för B-körkort Obevakat övergångsställe s. 47 |
| `pas-004` | Gående och cyklister | Vem som räknas som gående | Trafikförordningen (1998:1276) 2 kap. · Teoribok — Körkortsboken 2026 för B-körkort Övergångsställe s. 46 |
| `pas-005` | Gående och cyklister | Att vinka fram gående | Teoribok — Körkortsboken 2026 för B-körkort Övergångsställe s. 46 |
| `pas-008` | Cykelpassage och cykelöverfart | Obevakad cykelpassage | Trafikförordningen (1998:1276) 3 kap. 61 a § · Teoribok — Körkortsboken 2026 för B-körkort Obevakad cykelpassage s. 50 |
| `pas-009` | Cykelpassage och cykelöverfart | Cykelpassage i samband med sväng | Trafikförordningen (1998:1276) 3 kap. 61 a § · Teoribok — Körkortsboken 2026 för B-körkort Obevakad cykelpassage s. 50 · Teoribok — Körkortsboken 2026 för B-körkort Cykelpassage vid sväng s. 51 |
| `pas-014` | Cykelpassage och cykelöverfart | Att skilja passage från överfart | Vägmärkesförordningen (2007:90) 2 kap. B8 · Teoribok — Körkortsboken 2026 för B-körkort Cykelöverfart s. 52 · Teoribok — Körkortsboken 2026 för B-körkort Cykelpassage s. 50 |
| `pas-016` | Cykelpassage och cykelöverfart | Bevakad cykelpassage | Trafikförordningen (1998:1276) 3 kap. 61 a § · Teoribok — Körkortsboken 2026 för B-körkort Bevakad cykelpassage s. 50 |
| `bld-006` | Gående och cyklister | Obevakat övergångsställe | Trafikförordningen (1998:1276) 3 kap. 61 § · Teoribok — Körkortsboken 2026 för B-körkort Obevakat övergångsställe s. 47 |
| `bld-008` | Cykelpassage och cykelöverfart | Bruten cykelbana | Trafikförordningen (1998:1276) 3 kap. 61 § · Teoribok — Körkortsboken 2026 för B-körkort Förtydligande om att korsa en cykelbana s. 53 |
| `mrk-009` | Cykelpassage och cykelöverfart | Rutmarkering utan vägmärke | Vägmärkesförordningen (2007:90) 3 kap. M16 · Trafikförordningen (1998:1276) 3 kap. 61 a § · Teoribok — Körkortsboken 2026 för B-körkort Cykelpassage s. 50 |

### Rättsfall — 2

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `rtp-001` | Rättsfall och praxis | Aktsamhetsplikten framför formell rätt | Trafikförordningen (1998:1276) 2 kap. 1 § · Teoribok — Körkortsboken 2026 för B-körkort Rättsfall s. 362 |
| `rtp-002` | Rättsfall och praxis | Bevisning och eget ansvar | Teoribok — Körkortsboken 2026 för B-körkort Rättsfall s. 362 |

### Sparsam körning — 8

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `mil-001` | Sparsam körning | Sparsam körning | Sparsam körning, ecodriving |
| `mil-003` | Sparsam körning | Kallstart | Fordonsteknik: avgasrening och kallstart |
| `drv-001` | Sparsam körning | Motorbromsning och bränsleförbrukning | Trafikverket Sparsam körning · Teoribok — Körkortsboken 2026 för B-körkort Motorbromsa ofta s. 313 |
| `drv-003` | Sparsam körning | Acceleration vid sparsam körning | Trafikverket Sparsam körning · Teoribok — Körkortsboken 2026 för B-körkort Accelerera ganska snabbt s. 312 |
| `drv-004` | Sparsam körning | Sparsam körning kontra trafiksäkerhet | Teoribok — Körkortsboken 2026 för B-körkort Förtydligande angående sparsam körning s. 314 |
| `drv-005` | Sparsam körning | Takbox och luftmotstånd | Trafikverket · Teoribok — Körkortsboken 2026 för B-körkort Minska luftmotståndet s. 306 |
| `drv-006` | Sparsam körning | Däcktryck och förbrukning | Teoribok — Körkortsboken 2026 för B-körkort Rätt däcktryck s. 306 |
| `drv-008` | Sparsam körning | Luftkonditionering och förbrukning | Teoribok — Körkortsboken 2026 för B-körkort AC s. 306 |

### Speciella gator — 7

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `vag-011` | Anvisningsmärken | Väjningsplikt | Vägmärkesförordningen (2007:90) B1 |
| `vmk-020` | Anvisningsmärken | Motorväg upphör (E2) | Vägmärkesförordningen (2007:90) 2 kap. E2 · Teoribok — Körkortsboken 2026 för B-körkort Anvisningsmärken (E) s. 333 |
| `vmk-028` | Anvisningsmärken | Avstånd kontra utsträckning | Vägmärkesförordningen (2007:90) 2 kap. T2, T11 · Teoribok — Körkortsboken 2026 för B-körkort Tilläggstavlor (T) s. 346 |
| `vmk-029` | Anvisningsmärken | Tilläggstavlan Riktning (T12) | Vägmärkesförordningen (2007:90) 2 kap. T12 · Teoribok — Körkortsboken 2026 för B-körkort Tilläggstavlor (T) s. 346 |
| `bl2-003` | Anvisningsmärken | Grön och blå vägvisning | Vägmärkesförordningen (2007:90) 2 kap. F-märken · Teoribok — Körkortsboken 2026 för B-körkort Vägmärken s. 337 |
| `bl2-008` | Anvisningsmärken | Körfältsvägvisare | Vägmärkesförordningen (2007:90) 2 kap. F8 · Teoribok — Körkortsboken 2026 för B-körkort Vilket körfält du ska välja s. 16 |
| `grd-013` | Anvisningsmärken | Parkeringsmärket | Vägmärkesförordningen (2007:90) 2 kap. E19 · Teoribok — Körkortsboken 2026 för B-körkort Anvisningsmärken (E) s. 334 |

### Stanna & parkera — 3

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `par-002` | Förbud att stanna | Tiometersregeln | Trafikförordningen (1998:1276) 3 kap. 53 § |
| `par-003` | Förbud att stanna | Stannande i korsning | Trafikförordningen (1998:1276) 3 kap. 53 § |
| `par-006` | Förbud att stanna | Förbud att stanna och parkera | Vägmärkesförordningen (2007:90) C34 · Vägmärkesförordningen (2007:90) C35 |

### Styrning — 5

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `vaj-013` | Regn och vattenplaning | Däckbredd och vattenplaning | Teoribok — Körkortsboken 2026 för B-körkort Vattenplaning s. 219 |
| `vaj-014` | Regn och vattenplaning | Ratten vid vattenplaning | Teoribok — Körkortsboken 2026 för B-körkort Att göra vid vattenplaning s. 219 |
| `vaj-015` | Regn och vattenplaning | Moddplaning | Teoribok — Körkortsboken 2026 för B-körkort Vattenplaning och moddplaning s. 219 |
| `hal-001` | Regn och vattenplaning | Åtgärd vid vattenplaning | Fordonsdynamik: vattenplaning |
| `hal-002` | Regn och vattenplaning | Risk för vattenplaning | Fordonsdynamik: vattenplaning |

### Synen — 3

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `man-001` | Reaktion och sinnen | Stoppsträckans delar | Fysik och körteknik: stoppsträcka |
| `man-005` | Reaktion och sinnen | Synens roll | Trafikpsykologi: perception och seende |
| `mns-039` | Reaktion och sinnen | Mobiltelefon och uppmärksamhet | Trafikförordningen (1998:1276) 4 kap. 10 e § · Transportstyrelsen Mobiltelefon i trafiken |

### Säkerhetskontroller — 2

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `for-006` | Kontroll och besiktning | Förarens ansvar | Trafikförordningen (1998:1276) 3 kap. 84 § |
| `for-009` | Kontroll och besiktning | Varningslampor | Fordonskunskap: instrumentpanelens symboler |

### Trafikolyckor — 9

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `ris-001` | Riskbedömning | Riskbedömningens grunder | Riskutbildning del 1 och 2 |
| `ris-003` | Riskbedömning | Varningstriangel | Trafikförordningen (1998:1276) 3 kap. 84 § |
| `ris-005` | Djur på vägen | Viltolycka | Trafiksäkerhet: viltolyckor |
| `ris-010` | Riskbedömning | Flyktväg | Körstrategi: utrymme och flyktvägar |
| `mns-033` | Djur på vägen | När viltrisken är störst | Teoribok — Körkortsboken 2026 för B-körkort Störst risk för vilt på vägen s. 177 |
| `mns-035` | Djur på vägen | Efter en viltolycka | Teoribok — Körkortsboken 2026 för B-körkort Att göra om du kör på ett större djur s. 177 |
| `mns-036` | Riskbedömning | Riskkompensation | Trafiksäkerhetsforskning: riskkompensation · Teoribok — Körkortsboken 2026 för B-körkort Vinter s. 124 |
| `mns-037` | Riskbedömning | Tillbud som felaktig bekräftelse | Teoribok — Körkortsboken 2026 för B-körkort Sannolikhetsinlärning s. 134 · Trafikförordningen (1998:1276) 3 kap. 36 § |
| `mns-038` | Riskbedömning | Rutin och uppmärksamhet | Teoribok — Körkortsboken 2026 för B-körkort Sannolikhetsinlärning s. 134 |

### Trötthet — 6

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `tro-003` | Trötthet | Trötthetens riskperioder | Trafikmedicin: dygnsrytm och vakenhet |
| `tro-006` | Trötthet | Trötthet jämfört med alkohol | Trafikmedicin: sömnbrist och prestation |
| `grd-014` | Trötthet | Åtgärd mot trötthet | Teoribok — Körkortsboken 2026 för B-körkort Trötthet s. 148 |
| `mns-024` | Trötthet | Sömnbrist jämfört med alkohol | Teoribok — Körkortsboken 2026 för B-körkort Trötthet s. 148 · Trafikförordningen (1998:1276) 3 kap. 1 § |
| `mns-025` | Trötthet | Monotoni som trötthetsorsak | Teoribok — Körkortsboken 2026 för B-körkort Orsaker till trötthet s. 148 |
| `mns-026` | Trötthet | Trötthetssignaler | Teoribok — Körkortsboken 2026 för B-körkort Trötthetssignaler s. 149 |

### Vinter — 8

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `hal-003` | Halka | Bromssträcka vid halka | Fordonsdynamik: friktion och bromssträcka |
| `hal-004` | Halka | Var halkan uppstår först | Väglag och vinterväghållning |
| `hal-005` | Vinterkörning | Vinterdäcksperiod | Trafikförordningen (1998:1276) 4 kap. 18 a § |
| `hal-006` | Vinterkörning | Körteknik på halt underlag | Fordonsdynamik: friktionscirkeln |
| `hal-007` | Halka | Underkylt regn | Väglag och vinterväghållning |
| `hal-009` | Vinterkörning | Sikt och snö på fordonet | Trafikförordningen (1998:1276) 3 kap. 84 § |
| `bl2-017` | Vinterkörning | Snötäckt vägbana | Teoribok — Körkortsboken 2026 för B-körkort Vinter s. 125 |
| `bl3-004` | Vinterkörning | Väglag i solsken | Teoribok — Körkortsboken 2026 för B-körkort Förrädiskt väglag s. 124 · Trafikförordningen (1998:1276) 3 kap. 14 § |

### Vägmärken — 36

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `vag-001` | Varningsmärken | Varningsmärkens form och färg | Vägmärkesförordningen (2007:90) 2 kap. |
| `vag-002` | Varningsmärken | Varningsmärkets innebörd | Vägmärkesförordningen (2007:90) 2 kap. |
| `vag-004` | Förbudsmärken | Förbud mot infart | Vägmärkesförordningen (2007:90) C1 |
| `vag-005` | Påbudsmärken | Påbudsmärken | Vägmärkesförordningen (2007:90) D1 |
| `vag-009` | Vägmarkeringar | Spärrområde | Trafikförordningen (1998:1276) 3 kap. 11 § |
| `vmk-001` | Varningsmärken | Varningsmärkenas form och färg | Vägmärkesförordningen (2007:90) 2 kap. · Teoribok — Körkortsboken 2026 för B-körkort Varningsmärken (A) s. 324 |
| `vmk-002` | Förbudsmärken | Förbudsmärkenas form | Vägmärkesförordningen (2007:90) 2 kap. · Teoribok — Körkortsboken 2026 för B-körkort Förbudsmärken (C) s. 329 |
| `vmk-003` | Påbudsmärken | Påbudsmärkenas innebörd | Vägmärkesförordningen (2007:90) 2 kap. · Teoribok — Körkortsboken 2026 för B-körkort Påbudsmärken (D) s. 333 |
| `vmk-004` | Varningsmärken | Väjningsplikt (B1) | Vägmärkesförordningen (2007:90) 2 kap. B1 · Trafikförordningen (1998:1276) 3 kap. 5 § · Teoribok — Körkortsboken 2026 för B-körkort Väjningspliktsmärken (B) s. 327 |
| `vmk-005` | Varningsmärken | Huvudled (B4) | Vägmärkesförordningen (2007:90) 2 kap. B4 · Teoribok — Körkortsboken 2026 för B-körkort Väjningspliktsmärken (B) s. 327 |
| `vmk-006` | Varningsmärken | Huvudled upphör (B5) | Vägmärkesförordningen (2007:90) 2 kap. B5 · Trafikförordningen (1998:1276) 3 kap. 18 § · Teoribok — Körkortsboken 2026 för B-körkort Väjningspliktsmärken (B) s. 327 |
| `vmk-007` | Varningsmärken | Stopplikt kontra väjningsplikt | Vägmärkesförordningen (2007:90) 2 kap. B2 · Trafikförordningen (1998:1276) 3 kap. 5 § · Teoribok — Körkortsboken 2026 för B-körkort Väjningspliktsmärken (B) s. 327 |
| `vmk-008` | Varningsmärken | Flervägsstopp (T14) | Vägmärkesförordningen (2007:90) 2 kap. T14 · Teoribok — Körkortsboken 2026 för B-körkort Tilläggstavlor (T) s. 346 |
| `vmk-011` | Förbudsmärken | Förbud mot infart (C1) | Vägmärkesförordningen (2007:90) 2 kap. C1 · Teoribok — Körkortsboken 2026 för B-körkort Förbudsmärken (C) s. 328 |
| `vmk-015` | Förbudsmärken | Slut på förbud mot omkörning (C28) | Vägmärkesförordningen (2007:90) 2 kap. C28 · Teoribok — Körkortsboken 2026 för B-körkort Förbudsmärken (C) s. 330 |
| `vmk-016` | Påbudsmärken | Cirkulationsplats (D3) | Vägmärkesförordningen (2007:90) 2 kap. D3 · Teoribok — Körkortsboken 2026 för B-körkort Påbudsmärken (D) s. 333 |
| `vmk-030` | Varningsmärken | Varning för vägkorsning (A28) | Vägmärkesförordningen (2007:90) 2 kap. A28 · Trafikförordningen (1998:1276) 3 kap. 18 § · Teoribok — Körkortsboken 2026 för B-körkort Varningsmärken (A) s. 325 |
| `vmk-031` | Varningsmärken | Varning för barn (A15) | Vägmärkesförordningen (2007:90) 2 kap. A15 · Trafikförordningen (1998:1276) 3 kap. 1 § · Teoribok — Körkortsboken 2026 för B-körkort Varningsmärken (A) s. 324 |
| `vmk-032` | Varningsmärken | Varning för slirig väg (A10) | Vägmärkesförordningen (2007:90) 2 kap. A10 · Teoribok — Körkortsboken 2026 för B-körkort Varningsmärken (A) s. 324 |
| `vmk-034` | Vägmarkeringar | Heldragen linje | Vägmärkesförordningen (2007:90) 3 kap. M2 · Trafikförordningen (1998:1276) 3 kap. 11 § · Teoribok — Körkortsboken 2026 för B-körkort Vägmarkeringar s. 350 |
| `vmk-035` | Vägmarkeringar | Stopplinje | Vägmärkesförordningen (2007:90) 3 kap. M13 · Teoribok — Körkortsboken 2026 för B-körkort Vägmarkeringar s. 351 |
| `vmk-036` | Vägmarkeringar | Väjningslinje | Vägmärkesförordningen (2007:90) 3 kap. M14 · Teoribok — Körkortsboken 2026 för B-körkort Vägmarkeringar s. 351 |
| `vmk-037` | Varningsmärken | Rangordning av anvisningar | Trafikförordningen (1998:1276) 2 kap. 3 § · Teoribok — Körkortsboken 2026 för B-körkort Rangordning av anvisningar s. 8 |
| `vmk-038` | Varningsmärken | Vägmärke före generell regel | Trafikförordningen (1998:1276) 2 kap. 3 § · Trafikförordningen (1998:1276) 3 kap. 18 § · Teoribok — Körkortsboken 2026 för B-körkort Rangordning av anvisningar s. 8 |
| `bl2-007` | Påbudsmärken | Påbjuden körriktning | Vägmärkesförordningen (2007:90) 2 kap. D1 · Teoribok — Körkortsboken 2026 för B-körkort Påbudsmärken (D) s. 333 |
| `grd-005` | Vägmarkeringar | Mittlinje och kantlinje | Vägmärkesförordningen (2007:90) 3 kap. · Teoribok — Körkortsboken 2026 för B-körkort Vägmarkeringar s. 350 |
| `mrk-001` | Vägmarkeringar | Mittlinje (M1) | Vägmärkesförordningen (2007:90) 3 kap. M1 · Teoribok — Körkortsboken 2026 för B-körkort Vägmarkeringar s. 350 |
| `mrk-002` | Vägmarkeringar | Varningslinje (M3) | Vägmärkesförordningen (2007:90) 3 kap. M3 · Teoribok — Körkortsboken 2026 för B-körkort Vägmarkeringar s. 350 |
| `mrk-003` | Vägmarkeringar | Mittlinje kontra varningslinje | Vägmärkesförordningen (2007:90) 3 kap. M1, M3 · Teoribok — Körkortsboken 2026 för B-körkort Vägmarkeringar s. 350 |
| `mrk-004` | Vägmarkeringar | Kombinerad linje (M10) | Vägmärkesförordningen (2007:90) 3 kap. M10 · Trafikförordningen (1998:1276) 3 kap. 11 § · Teoribok — Körkortsboken 2026 för B-körkort Vägmarkeringar s. 350 |
| `mrk-005` | Vägmarkeringar | Kantlinje (M2) | Vägmärkesförordningen (2007:90) 3 kap. M2 · Teoribok — Körkortsboken 2026 för B-körkort Vägmarkeringar s. 350 |
| `mrk-006` | Vägmarkeringar | Spärrområde (M9) | Vägmärkesförordningen (2007:90) 3 kap. M9 · Teoribok — Körkortsboken 2026 för B-körkort Vägmarkeringar s. 350 |
| `mrk-007` | Vägmarkeringar | Stopplinje (M13) | Vägmärkesförordningen (2007:90) 3 kap. M13 · Teoribok — Körkortsboken 2026 för B-körkort Vägmarkeringar s. 351 |
| `mrk-010` | Vägmarkeringar | Övergångsställe kontra cykelpassage | Vägmärkesförordningen (2007:90) 3 kap. M15, M16 · Teoribok — Körkortsboken 2026 för B-körkort Vägmarkeringar s. 351 |
| `mrk-013` | Vägmarkeringar | Markering kontra vägmärke | Trafikförordningen (1998:1276) 2 kap. 3 § · Teoribok — Körkortsboken 2026 för B-körkort Rangordning av anvisningar s. 8 |
| `mrk-014` | Vägmarkeringar | Ledlinje (M4) | Vägmärkesförordningen (2007:90) 3 kap. M4 · Teoribok — Körkortsboken 2026 för B-körkort Vägmarkeringar s. 350 |

### Väjningsregler — 19

| Fråga | Delområde | Regel | Källor |
| --- | --- | --- | --- |
| `tra-007` | Trafiksignaler och tecken | Utryckningsfordon | Trafikförordningen (1998:1276) 2 kap. 6 § |
| `vaj-003` | Huvudled | Var huvudledsmärket sitter | Teoribok — Körkortsboken 2026 för B-körkort Huvudled s. 25 · Vägmärkesförordningen (2007:90) 2 kap. B4 · Trafikverket |
| `vaj-004` | Huvudled | När huvudleden upphör | Teoribok — Körkortsboken 2026 för B-körkort Huvudled s. 25 · Vägmärkesförordningen (2007:90) 2 kap. B5 |
| `vaj-005` | Utfartsregeln | När utfartsregeln inte gäller | Teoribok — Körkortsboken 2026 för B-körkort Utfartsregeln — brutna banor s. 35, 36 · Trafikförordningen (1998:1276) 3 kap. 21 § |
| `vaj-006` | Utfartsregeln | Platser som utlöser utfartsregeln | Teoribok — Körkortsboken 2026 för B-körkort Utfartsregeln s. 35, 37 · Trafikförordningen (1998:1276) 3 kap. 21 § |
| `kor-001` | Högerregeln | Högerregeln | Trafikförordningen (1998:1276) 3 kap. 18 § |
| `kor-004` | Stopplikt | Stopplikt | Trafikförordningen (1998:1276) 3 kap. 19 § · Vägmärkesförordningen (2007:90) B2 |
| `kor-007` | Huvudled | Huvudled | Vägmärkesförordningen (2007:90) B4 · Trafikförordningen (1998:1276) 3 kap. 21 § |
| `kor-009` | Väjningsplikt | Väjningsplikt i praktiken | Trafikförordningen (1998:1276) 3 kap. 5 § |
| `kor-010` | Väjningsplikt | Blinkers som avsikt | Riskutbildning och körstrategi |
| `kor-012` | Trafiksignal i korsning | Grön signal och väjningsplikt | Trafikförordningen (1998:1276) 3 kap. 61 § |
| `kor-014` | Högerregeln | Högerregeln i praktiken | Trafikförordningen (1998:1276) 2 kap. 1 § · Trafikförordningen (1998:1276) 3 kap. 18 § |
| `kor-015` | Väjningsplikt | Blockerad korsning | Trafikförordningen (1998:1276) 3 kap. 8 § |
| `kor-016` | Stopplikt | Stopplinje | Trafikförordningen (1998:1276) 3 kap. 19 § |
| `bld-003` | Stopplikt | Stopplikt i praktiken | Vägmärkesförordningen (2007:90) 2 kap. B2 · Trafikförordningen (1998:1276) 3 kap. 21 § · Teoribok — Körkortsboken 2026 för B-körkort Väjningsregler s. 24 |
| `bld-004` | Högerregeln | Att läsa av en korsning | Trafikförordningen (1998:1276) 3 kap. 18 § · Teoribok — Körkortsboken 2026 för B-körkort Väjningsregler s. 31 |
| `bld-005` | Väjningsplikt | Tunga fordon i korsning | Trafikförordningen (1998:1276) 2 kap. 1 § · Teoribok — Körkortsboken 2026 för B-körkort Väjningsregler s. 34 |
| `grd-001` | Högerregeln | Högerregeln | Trafikförordningen (1998:1276) 3 kap. 18 § · Teoribok — Körkortsboken 2026 för B-körkort Väjningsregler s. 22 |
| `grd-002` | Trafiksignaler och tecken | Gult ljus | Trafikförordningen (1998:1276) 3 kap. 4 § · Teoribok — Körkortsboken 2026 för B-körkort Trafiksignaler s. 40 |

## Grupperingar för planering

| Grupp | Antal |
| --- | ---: |
| Bildburna (foto ur källan) | 42 |
| Ritade märken eller markeringar | 44 |
| Beräkningar | 13 |
| Hänvisar till licensierad teoribok | 282 |
| Hänvisar till författning | 271 |
| Hänvisar till myndighet | 25 |
| Endast allmän kunskapskälla | 54 |
