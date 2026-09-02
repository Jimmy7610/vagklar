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
| `reviewed` | 442 | Läst och godkänd internt. Inget påstående om expertgranskning. |
| `verified` | 0 | Kontrollerad mot namngiven källa av namngiven person. |

## Kön

| Prioritet | Antal | Vad som står på spel |
| --- | ---: | --- |
| P1 | 131 | Rättsliga tal, gränsvärden, intervall och volatila regelområden. |
| P2 | 64 | Undantag, villkorade regler och beräkningar. |
| P3 | 247 | Förklarande kunskap utan rättsligt tal. |
| **Totalt** | **442** | |

## P1 efter typ

En fråga kan bära flera. De tre första avgör att den hamnar i P1; resten säger
vad slags kontroll den kräver.

| Typ | Antal | Betyder |
| --- | ---: | --- |
| `P1-NUMERIC` | 89 | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| `P1-VOLATILE` | 59 | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| `P1-ADMIN` | 33 | Administrativ regel — besiktning, registrering, försäkring, körkort. |
| `P1-LAW` | 66 | Bygger på en författningstext som går att slå upp ordagrant. |
| `P1-SAFETY` | 32 | Fel här kan leda till skada, inte bara till ett felaktigt svar. |
| `P1-EXCEPTION` | 29 | Ett rättsligt tal som dessutom har undantag; både talet och undantaget måste stämma. |

## Var arbetet ligger

| Kapitel | P1 |
| --- | ---: |
| Alkohol | 14 |
| Indelning av fordon | 11 |
| Inledning | 11 |
| Stanna & parkera | 9 |
| Däck | 7 |
| Speciella gator | 7 |
| Synen | 7 |
| Motorväg & motortrafikled | 5 |
| Belysning | 4 |
| Bilbarnstolar | 4 |
| Drivmedel | 4 |
| Försäkring | 4 |

| Grupp som kräver extra omsorg | Antal |
| --- | ---: |
| Bär tre eller fler P1-typer | 54 |
| Rättsligt tal med undantag | 29 |
| Bildburna P1 (foto eller ritning) | 13 |
| Beräkningar i P1 | 11 |
| Utan hänvisning till författning | 65 |

## Verifieringar som gått ur takt

Inga. En verifiering blir ogiltig när frågans text, svar, regel, förklaring
eller källhänvisning ändras efter signeringen — validatorn fångar det.

## P1 i granskningsomgångar

En omgång är ett arbetspass: samma ämne, samma källor uppslagna. Ordningen
inom en omgång är godtycklig; ordningen mellan dem är det inte — de tidiga
rör tal som står i författning och går att slå upp direkt.

| Omgång | Antal |
| --- | ---: |
| 01 — Alkohol, droger och läkemedel | 14 |
| 02 — Hastigheter | 8 |
| 03 — Däck, väglag och vinter | 8 |
| 04 — Last, släp och vikter | 9 |
| 05 — Stanna, parkera och tidsregler | 9 |
| 06 — Belysning och mörker | 4 |
| 07 — Väjning, stopp och korsningar | 1 |
| 08 — Oskyddade trafikanter och passager | 3 |
| 09 — Motorväg, landsväg och omkörning | 14 |
| 10 — Järnvägskorsningar | 2 |
| 11 — Krocksäkerhet och bilbälte | 3 |
| 12 — Vägmärken och vägmarkeringar | 12 |
| 13 — Fordon, miljö och administration | 25 |
| 14 — Risk, trötthet och olyckor | 19 |

### Omgång 01 — Alkohol, droger och läkemedel · 14 frågor

#### `alk-001` · Promillegräns

Vid vilken alkoholhalt i blodet döms man för rattfylleri i Sverige?

**Rätt svar:** 0,2 promille eller mer.

**Förklaring:** Gränsen för rattfylleri går vid 0,2 promille.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-VOLATILE, P1-LAW, P1-SAFETY |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Alkohol · Gränsvärden och straff |
| Källa och exakt hänvisning | Lag (1951:649) om straff för vissa trafikbrott |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `ac460d72` |

#### `alk-002` · Grovt rattfylleri

Vad gäller normalt vid 1,0 promille eller mer?

**Rätt svar:** Det räknas som grovt rattfylleri, med fängelse i straffskalan.

**Förklaring:** Från 1,0 promille är brottet grovt. Fängelse ingår i straffskalan.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-VOLATILE, P1-LAW, P1-SAFETY |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Alkohol · Gränsvärden och straff |
| Källa och exakt hänvisning | Lag (1951:649) om straff för vissa trafikbrott |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `70d7d75d` |

#### `alk-003` · Alkoholens nedbrytning

Vad påskyndar kroppens nedbrytning av alkohol?

**Rätt svar:** Ingenting i praktiken — bara tid.

**Förklaring:** Bara tid bryter ner alkohol. Kaffe gör dig vaken, inte nykter.

| | |
| --- | --- |
| Typ | P1-VOLATILE, P1-SAFETY |
| Varför i kön | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| Kapitel · delområde | Alkohol · Effekter på körförmågan |
| Källa och exakt hänvisning | Medicinsk grundkunskap om alkohol |
| Status | `reviewed` |
| Missuppfattning | Alkohol antas försvinna snabbare |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `5cad8935` |

#### `alk-004` · Dagen efter

Du drack mycket alkohol på kvällen och sov åtta timmar. Vad gäller på morgonen?

**Rätt svar:** Du kan fortfarande ha alkohol kvar i blodet och vara olaglig att köra.

**Förklaring:** Nedbrytningen tar tid oavsett sömn. Dagen efter är en vanlig rattfyllerisituation.

| | |
| --- | --- |
| Typ | P1-VOLATILE, P1-SAFETY, P1-EXCEPTION |
| Varför i kön | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| Kapitel · delområde | Alkohol · Effekter på körförmågan |
| Källa och exakt hänvisning | Medicinsk grundkunskap om alkohol |
| Status | `reviewed` |
| Missuppfattning | Alkohol antas försvinna snabbare |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `af6e207d` |

#### `alk-005` · Alkoholens effekt på körförmågan

Vad påverkas först och tydligast av alkohol vid bilkörning?

**Rätt svar:** Omdömet och förmågan att bedöma risker.

**Förklaring:** Alkohol slår först mot omdömet — därför märker den påverkade det inte själv.

| | |
| --- | --- |
| Typ | P1-VOLATILE, P1-SAFETY |
| Varför i kön | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| Kapitel · delområde | Alkohol · Effekter på körförmågan |
| Källa och exakt hänvisning | Medicinsk grundkunskap om alkohol |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `229d4b05` |

#### `alk-008` · Ansvar för annan förare

Din kompis har druckit och tänker köra hem. Vad gäller för dig?

**Rätt svar:** Du bör hindra körningen — att låta det ske kan vara straffbart medhjälp.

**Förklaring:** Att medvetet låta någon köra påverkad kan vara straffbart — och du kan förhindra det.

| | |
| --- | --- |
| Typ | P1-VOLATILE, P1-SAFETY, P1-EXCEPTION |
| Varför i kön | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| Kapitel · delområde | Alkohol · Gränsvärden och straff |
| Källa och exakt hänvisning | Brottsbalken 23 kap. om medverkan |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `01b9ec85` |

#### `grd-006` · Grovt rattfylleri

Vid vilken alkoholhalt i blodet räknas brottet som grovt rattfylleri?

**Rätt svar:** 1,0 promille eller mer.

**Förklaring:** Rattfylleri börjar vid 0,2 promille. Vid 1,0 promille eller mer räknas brottet som grovt, med fängelse i straffskalan.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-VOLATILE, P1-LAW, P1-SAFETY |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Alkohol · Gränsvärden och straff |
| Källa och exakt hänvisning | Lag (1951:649) om straff för vissa trafikbrott 4 § · Teoribok — Körkortsboken 2026 för B-körkort Alkohol s. 140 |
| Status | `reviewed` |
| Missuppfattning | Gränsen för grovt rattfylleri |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `eb05a3f2` |

#### `mns-014` · Effekt vid låg promillehalt

Vad händer redan vid 0,1–0,4 promille?

**Rätt svar:** Vissa mentala spärrar släpper, den egna förmågan överskattas och reaktionstiden försämras.

**Förklaring:** Den farligaste effekten kommer först: omdömet försämras innan man känner sig berusad, och den egna förmågan överskattas.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-VOLATILE, P1-SAFETY |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Alkohol · Effekter på körförmågan |
| Källa och exakt hänvisning | Teoribok — Körkortsboken 2026 för B-körkort Promille s. 140 |
| Status | `reviewed` |
| Missuppfattning | Tidig alkoholpåverkan underskattas |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `06005d21` |

#### `mns-015` · Individuell variation i promillehalt

Två personer dricker exakt lika mycket alkohol. Varför kan de ändå få olika promillehalt?

**Rätt svar:** Vikt, kön, hälsa, drickhastighet och vad de ätit påverkar halten.

**Förklaring:** Samma mängd ger inte samma promillehalt. Även samma person kan få olika halt vid olika tillfällen, till exempel beroende på matintag.

| | |
| --- | --- |
| Typ | P1-VOLATILE, P1-SAFETY |
| Varför i kön | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| Kapitel · delområde | Alkohol · Effekter på körförmågan |
| Källa och exakt hänvisning | Teoribok — Körkortsboken 2026 för B-körkort Alkoholupplysning s. 141 |
| Status | `reviewed` |
| Missuppfattning | Promillehalten antas följa mängden |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `8d014c5f` |

#### `mns-016` · Dagen efter

Du har druckit mycket kvällen innan men är säker på att alkoholen hunnit gå ur kroppen. Vad gäller?

**Rätt svar:** Du kan fortfarande vara sliten och sämre som förare, även om promillehalten är noll.

**Förklaring:** Noll promille betyder inte återställd. Trötthet och sämre koncentration finns ofta kvar dagen efter.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-VOLATILE, P1-SAFETY |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Alkohol · Effekter på körförmågan |
| Källa och exakt hänvisning | Teoribok — Körkortsboken 2026 för B-körkort Alkoholupplysning s. 141 |
| Status | `reviewed` |
| Missuppfattning | Noll promille tas för återställd |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `966b55a2` |

#### `mns-017` · Rattfylleri under gränsvärdet

Kan det räknas som rattfylleri om alkoholhalten ligger under 0,2 promille?

**Rätt svar:** Ja, om körningen varit vårdslös på grund av påverkan.

**Förklaring:** Gränsvärdet är en undre gräns för när halten ensam räcker. Vårdslös körning på grund av påverkan kan bedömas som rattfylleri även därunder.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-VOLATILE, P1-LAW, P1-SAFETY |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Alkohol · Gränsvärden och straff |
| Källa och exakt hänvisning | Lag (1951:649) om straff för vissa trafikbrott 4 § · Teoribok — Körkortsboken 2026 för B-körkort Alkoholupplysning s. 141 |
| Status | `reviewed` |
| Missuppfattning | Gränsen för grovt rattfylleri |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `b335ddde` |

#### `mns-018` · Medhjälp till rattfylleri

Du lånar ut bilen till en vän som du vet har druckit. Vad kan det innebära?

**Rätt svar:** Att du kan straffas för medhjälp till rattfylleri.

**Förklaring:** Att låna ut bilen till någon du vet är påverkad, eller att bjuda någon som ska köra, kan vara straffbar medhjälp.

| | |
| --- | --- |
| Typ | P1-VOLATILE, P1-ADMIN, P1-SAFETY, P1-EXCEPTION |
| Varför i kön | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| Kapitel · delområde | Alkohol · Gränsvärden och straff |
| Källa och exakt hänvisning | Teoribok — Körkortsboken 2026 för B-körkort Alkoholupplysning s. 141 |
| Status | `reviewed` |
| Missuppfattning | Ansvaret antas ligga bara på föraren |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `f683797c` |

#### `mns-019` · Var rattfyllerilagen gäller

Var gäller rattfyllerilagstiftningen?

**Rätt svar:** Överallt — även inom inhägnat område och på privat mark.

**Förklaring:** Lagen gäller överallt och för alla motordrivna fordon, inte bara bilar och inte bara på allmän väg.

| | |
| --- | --- |
| Typ | P1-VOLATILE, P1-SAFETY |
| Varför i kön | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| Kapitel · delområde | Alkohol · Gränsvärden och straff |
| Källa och exakt hänvisning | Teoribok — Körkortsboken 2026 för B-körkort Alkoholupplysning s. 141 |
| Status | `reviewed` |
| Missuppfattning | Rattfyllerilagens räckvidd begränsas |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `6d9a249d` |

#### `mns-023` · Alkohol kombinerat med läkemedel

Du har tagit en receptfri medicin som varnar för trötthet, och druckit ett glas vin. Hur bedöms kombinationen?

**Rätt svar:** Effekterna kan förstärka varandra så att påverkan blir större än summan av delarna.

**Förklaring:** Kombinationen är svår att förutse och ofta kraftigare än väntat. Varningstexten på förpackningen gäller även vid små mängder alkohol.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-SAFETY |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Alkohol · Droger och läkemedel |
| Källa och exakt hänvisning | Teoribok — Körkortsboken 2026 för B-körkort Läkemedel & mediciner i trafiken s. 141 · Läkemedelsverket |
| Status | `reviewed` |
| Missuppfattning | Kombinationseffekter underskattas |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `8f09d74f` |

### Omgång 02 — Hastigheter · 8 frågor

#### `has-001` · Bashastighet

Du kör inom tätbebyggt område och ser inget hastighetsmärke. Vilken hastighet gäller?

**Rätt svar:** 50 km/h.

**Förklaring:** Utan skylt gäller bashastigheten: 50 km/h inom tätbebyggt område.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-VOLATILE, P1-LAW |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Inledning · Hastighetsgränser |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 3 kap. 17 § |
| Status | `reviewed` |
| Missuppfattning | Bashastighet blandas ihop med skyltad hastighet |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `f67c0bfe` |

#### `has-002` · Bashastighet utanför tätort

Vilken hastighet gäller utanför tätbebyggt område om inga vägmärken finns?

**Rätt svar:** 70 km/h.

**Förklaring:** Bashastigheten utanför tätbebyggt område är 70 km/h.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-VOLATILE, P1-LAW |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Inledning · Hastighetsgränser |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 3 kap. 17 § |
| Status | `reviewed` |
| Missuppfattning | Bashastighet blandas ihop med skyltad hastighet |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `2e8453e7` |

#### `has-003` · Anpassad hastighet

Skylten visar 80 km/h. Det är kraftigt regn och sikten är dålig. Vad är rätt hastighet?

**Rätt svar:** Lägre än 80 — hastigheten ska anpassas till sikt, väglag och trafik.

**Förklaring:** Skyltad hastighet är ett tak. Förhållandena avgör vad som faktiskt är rätt fart.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-LAW |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Inledning · Anpassad hastighet |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 3 kap. 14 § |
| Status | `reviewed` |
| Missuppfattning | Skyltad hastighet ses som ett krav |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `9a804121` |

#### `has-005` · Sträcka per sekund

Ungefär hur långt färdas du på en sekund i 70 km/h?

**Rätt svar:** Cirka 19 meter.

**Förklaring:** Dela hastigheten med 3,6: 70 / 3,6 ≈ 19 meter per sekund. Snabbvariant: stryk sista siffran och ta gånger 3.

| | |
| --- | --- |
| Typ | P1-NUMERIC |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Inledning · Anpassad hastighet |
| Källa och exakt hänvisning | Fysik: enhetsomvandling km/h till m/s |
| Status | `reviewed` |
| Missuppfattning | Reaktionssträcka vs bromssträcka |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `744ab323` |

#### `has-006` · Bromssträckans förhållande till hastigheten

Du fördubblar hastigheten från 40 till 80 km/h. Hur påverkas bromssträckan?

**Rätt svar:** Den blir ungefär fyra gånger så lång.

**Förklaring:** Bromssträckan växer med hastigheten i kvadrat: 4 × 4 × 0,4 = 6,4 m vid 40 km/h, men 8 × 8 × 0,4 = 25,6 m vid 80 km/h — fyra gånger så långt.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-EXCEPTION |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Inledning · Anpassad hastighet |
| Källa och exakt hänvisning | Fysik: rörelseenergi och friktion |
| Status | `reviewed` |
| Missuppfattning | Reaktionssträcka vs bromssträcka |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `6d2f52e5` |

#### `has-009` · Hastighet med släp

En obromsad släpvagn väger högst halva bilens tjänstevikt och under 750 kg. Vilken högsta hastighet gäller för ekipaget?

**Rätt svar:** 80 km/h.

**Förklaring:** Håller släpet sig inom viktgränsen gäller 80 km/h. Är det tyngre sjunker taket till 40 km/h.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-VOLATILE, P1-ADMIN, P1-LAW, P1-EXCEPTION |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Inledning · Hastighetsgränser |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 4 kap. 20 § · Teoribok — Körkortsboken 2026 för B-körkort Hastigheter för olika fordon s. 190 |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `8a1c3e06` |

#### `bl2-001` · Flera märken på samma stolpe

Vilka tre besked ger märkena på stolpen till höger?

**Rätt svar:** Högsta hastighet 100, att du kör på huvudled, och vilka vägnummer vägen har.

**Förklaring:** Röd ring runt 100 är ett tak. Den gula romben betyder huvudled, alltså att korsande trafik väjer för dig. Den blå skylten anger vägnummer.

| | |
| --- | --- |
| Typ | P1-VOLATILE, P1-LAW |
| Varför i kön | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| Kapitel · delområde | Inledning · Hastighetsgränser |
| Källa och exakt hänvisning | Vägmärkesförordningen (2007:90) 2 kap. C31, B4 · Teoribok — Körkortsboken 2026 för B-körkort Vägmärken s. 324 |
| Status | `reviewed` |
| Missuppfattning | Flera märken på samma stolpe läses inte ihop |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `1428c2eb` |

#### `grd-003` · Bashastighet utanför tätort

Du kör utanför tättbebyggt område och ser ingen hastighetsskylt. Vilken hastighet gäller?

**Rätt svar:** 70 km/h.

**Förklaring:** Bashastigheten är 70 km/h utanför tättbebyggt område och 50 km/h inom. Skyltar gäller alltid före bashastigheten.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-VOLATILE, P1-LAW |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Inledning · Hastighetsgränser |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 3 kap. 17 § · Teoribok — Körkortsboken 2026 för B-körkort Hastighet och bashastighet s. 9 |
| Status | `reviewed` |
| Missuppfattning | Bashastighet blandas ihop med skyltad hastighet |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `be7ec2eb` |

### Omgång 03 — Däck, väglag och vinter · 8 frågor

#### `hal-009` · Sikt och snö på fordonet

Vad gäller för snö och is på bilen innan du kör?

**Rätt svar:** Rutor, lyktor och skyltar ska vara fria — och snö på taket kan yra ner och skymma sikten.

**Förklaring:** Fri sikt åt alla håll, rena lyktor och registreringsskylt — och ta bort snön på taket.

| | |
| --- | --- |
| Typ | P1-ADMIN, P1-LAW |
| Varför i kön | Administrativ regel — besiktning, registrering, försäkring, körkort. |
| Kapitel · delområde | Vinter · Vinterkörning |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 3 kap. 84 § |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `94ea5cc7` |

#### `for-001` · Mönsterdjup

Vilket är det lägsta tillåtna mönsterdjupet för sommardäck på personbil?

**Rätt svar:** 1,6 mm.

**Förklaring:** Sommardäck: minst 1,6 mm. Vinterdäck vid vinterväglag: minst 3 mm.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-VOLATILE, P1-LAW, P1-SAFETY |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Däck · Däck och bromsar |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 4 kap. 18 § |
| Status | `reviewed` |
| Missuppfattning | Mönsterdjup blandas ihop |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `3eefe6bf` |

#### `for-002` · Lufttryck i däck

Vad händer om lufttrycket i däcken är för lågt?

**Rätt svar:** Bränsleförbrukningen ökar, däcken slits ojämnt och värms upp — med risk för däckhaveri.

**Förklaring:** För lågt tryck ger högre förbrukning, sämre egenskaper och risk för överhettning.

| | |
| --- | --- |
| Typ | P1-VOLATILE, P1-SAFETY |
| Varför i kön | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| Kapitel · delområde | Däck · Däck och bromsar |
| Källa och exakt hänvisning | Fordonskunskap: däck och lufttryck |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `119c2737` |

#### `for-003` · ABS-bromsar

Vad gör ABS-systemet?

**Rätt svar:** Hindrar hjulen från att låsa sig, så att du kan styra samtidigt som du bromsar.

**Förklaring:** ABS bevarar styrförmågan under hård inbromsning. Det skapar inte mer grepp.

| | |
| --- | --- |
| Typ | P1-VOLATILE, P1-SAFETY |
| Varför i kön | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| Kapitel · delområde | Däck · Däck och bromsar |
| Källa och exakt hänvisning | Fordonsteknik: ABS |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `ef768dd7` |

#### `for-008` · Blandning av däcktyper

Vad gäller för att blanda däcktyper på samma bil?

**Rätt svar:** Alla fyra hjulen ska ha däck av samma typ — blanda inte vinter- och sommardäck.

**Förklaring:** Samma däcktyp runt om. Olika grepp fram och bak gör bilen oförutsägbar.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-VOLATILE, P1-LAW, P1-SAFETY |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Däck · Däck och bromsar |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 4 kap. 18 § |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `4fb74106` |

#### `egr-001` · Slitagemönster som tecken på lufttryck

Däcket på bilden är nedslitet vid båda kanterna men har full mönsterhöjd kvar i mitten. Vad beror det oftast på?

**Rätt svar:** Att däcket körts med för lågt lufttryck.

**Förklaring:** För lite luft gör att däcket buktar ut och mitten lyfter. Då bär kanterna hela bilen, och det är kanterna som slits.

| | |
| --- | --- |
| Typ | P1-VOLATILE, P1-SAFETY |
| Varför i kön | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| Kapitel · delområde | Däck · Däck och bromsar |
| Källa och exakt hänvisning | Teoribok — Körkortsboken 2026 för B-körkort Fel på hjulen s. 207 · Trafikverket |
| Status | `reviewed` |
| Missuppfattning | Slitagemönstret antas bara betyda ålder |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `ad78eab6` |

#### `egr-002` · Blåsa på däcksidan

Du hittar det som syns på bilden vid en kontroll av däcket. Vad gäller?

**Rätt svar:** Däcket ska bytas — utbuktningen betyder att stommen inuti har gått av.

**Förklaring:** En bula i däcksidan betyder att stommen brustit och att bara det yttre gummit håller emot trycket. Däcket kan brista utan förvarning.

| | |
| --- | --- |
| Typ | P1-VOLATILE, P1-SAFETY |
| Varför i kön | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| Kapitel · delområde | Däck · Däck och bromsar |
| Källa och exakt hänvisning | Teoribok — Körkortsboken 2026 för B-körkort Fel på hjulen s. 207 · Trafikverket |
| Status | `reviewed` |
| Missuppfattning | Mönsterdjupet antas avgöra om däcket duger |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `239f8ae2` |

#### `grd-010` · Mönsterdjup på sommardäck

Vilket är det minsta tillåtna mönsterdjupet på ett sommardäck?

**Rätt svar:** 1,6 mm.

**Förklaring:** Sommardäck kräver minst 1,6 mm. Vinterdäck kräver minst 3 mm när vinterdäckskravet gäller.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-VOLATILE, P1-SAFETY |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Däck · Däck och bromsar |
| Källa och exakt hänvisning | Teoribok — Körkortsboken 2026 för B-körkort Däck s. 204 |
| Status | `reviewed` |
| Missuppfattning | Mönsterdjup blandas ihop |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `95228b42` |

### Omgång 04 — Last, släp och vikter · 9 frågor

#### `las-001` · B-behörighet och släp

Vad gäller för bil och släpvagn med vanlig B-behörighet?

**Rätt svar:** Bilens och släpets sammanlagda totalvikt får vara högst 3 500 kg.

**Förklaring:** Räkna på ekipaget: bilens totalvikt plus släpets totalvikt, högst 3 500 kg.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-VOLATILE, P1-ADMIN, P1-EXCEPTION |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Indelning av fordon · Släpvagn |
| Källa och exakt hänvisning | Körkortslagen, behörighet B |
| Status | `reviewed` |
| Missuppfattning | B-behörighet och släpvagnsvikt |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `aa120d73` |

#### `las-002` · Obromsat släp

Vad begränsar hur tungt ett obromsat släp får vara?

**Rätt svar:** Släpets totalvikt får normalt inte överstiga halva bilens tjänstevikt.

**Förklaring:** Ett obromsat släp begränsas normalt till halva dragbilens tjänstevikt.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-VOLATILE, P1-ADMIN, P1-LAW |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Indelning av fordon · Släpvagn |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 4 kap. 12 § |
| Status | `reviewed` |
| Missuppfattning | B-behörighet och släpvagnsvikt |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `6df0033d` |

#### `las-003` · Lastsäkring

Varför måste last i bilen surras eller säkras?

**Rätt svar:** Vid en inbromsning eller krock fortsätter lasten framåt med stor kraft.

**Förklaring:** Osäkrad last blir ett projektil i kupén vid en inbromsning.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-VOLATILE, P1-ADMIN, P1-LAW |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Bilbarnstolar · Lastning och lastsäkring |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 3 kap. 81 § |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `0d94968c` |

#### `las-004` · Utskjutande last

Du transporterar en last som skjuter ut mer än en meter bakom bilen. Vad gäller?

**Rätt svar:** Lasten ska märkas ut så att den syns tydligt, i mörker även med ljus och reflex.

**Förklaring:** Utskjutande last ska markeras — med flagga i dagsljus, ljus och reflex i mörker.

| | |
| --- | --- |
| Typ | P1-VOLATILE, P1-ADMIN, P1-LAW |
| Varför i kön | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| Kapitel · delområde | Bilbarnstolar · Lastning och lastsäkring |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 3 kap. 81 § |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `1b670332` |

#### `las-005` · Släpvagnens köregenskaper

Vad ökar risken för att ett släp börjar vingla i högre hastighet?

**Rätt svar:** För lite vikt på dragkroken och tyngdpunkten placerad för långt bak i släpet.

**Förklaring:** Lasta tyngst över eller strax framför släpets axel, så att kultrycket blir korrekt.

| | |
| --- | --- |
| Typ | P1-VOLATILE |
| Varför i kön | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| Kapitel · delområde | Indelning av fordon · Släpvagn |
| Källa och exakt hänvisning | Fordonsdynamik: släpvagnspendling |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `0abb5c0b` |

#### `las-006` · Passagerare och bälte

Vem ansvarar för att ett barn under 15 år använder bilbälte?

**Rätt svar:** Föraren.

**Förklaring:** Föraren ansvarar för att barn under 15 år är korrekt fastspända.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-VOLATILE, P1-LAW |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Bilbarnstolar · Lastning och lastsäkring |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 4 kap. 10 § |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `f29aaea1` |

#### `bl4-001` · Last som skjuter ut i sidled

Varför är lastningen på bilden inte tillåten?

**Rätt svar:** För att lasten skjuter ut mer än 20 cm på ena sidan.

**Förklaring:** Två krav gäller samtidigt: högst 260 cm totalbredd och högst 20 cm utanför bilen åt sidan. Här klaras det första men inte det andra.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-VOLATILE, P1-LAW, P1-EXCEPTION |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Bilbarnstolar · Lastning och lastsäkring |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 4 kap. 15 § · Teoribok — Körkortsboken 2026 för B-körkort På bredden s. 244, 245 |
| Status | `reviewed` |
| Missuppfattning | Bara ett av lastens breddkrav räknas |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `610b15d9` |

#### `bl4-002` · Lastens placering i släpet

Vad blir följden av att lasten ligger som på bilden?

**Rätt svar:** Bilens bakhjul avlastas, och det är de som håller ekipaget rakt.

**Förklaring:** Last längst bak tippar släpet bakåt och lyfter kopplingen. Lyftet tar bort tryck från bilens bakhjul, som är de som stabiliserar ekipaget.

| | |
| --- | --- |
| Typ | P1-VOLATILE |
| Varför i kön | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| Kapitel · delområde | Indelning av fordon · Släpvagn |
| Källa och exakt hänvisning | Teoribok — Körkortsboken 2026 för B-körkort Kultryck s. 256 · Trafikverket |
| Status | `reviewed` |
| Missuppfattning | Lastens placering i släpet antas sakna betydelse |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `123c39e0` |

#### `bl4-006` · Utmärkning av bogserlina

Avståndet mellan bilarna på bilden är fyra meter. Vad krävs?

**Rätt svar:** Bogserlinan ska märkas ut, eftersom avståndet är över två meter.

**Förklaring:** Är avståndet mellan fordonen över två meter ska linan märkas ut, så att andra ser att där finns något spänt mellan bilarna.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-VOLATILE, P1-LAW |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Indelning av fordon · Släpvagn |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 5 kap. 1 § · Teoribok — Körkortsboken 2026 för B-körkort Utmärkning vid bogsering s. 248 |
| Status | `reviewed` |
| Missuppfattning | Bogserlinan antas synas av sig själv |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `0b097983` |

### Omgång 05 — Stanna, parkera och tidsregler · 9 frågor

#### `par-001` · Skillnad stannande och parkering

Vad är skillnaden mellan att stanna och att parkera?

**Rätt svar:** Att stanna är ett kort uppehåll för av- och påstigning eller lastning. Allt annat uppehåll räknas som parkering.

**Förklaring:** Syftet avgör, inte tiden eller om motorn går.

| | |
| --- | --- |
| Typ | P1-VOLATILE, P1-LAW |
| Varför i kön | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| Kapitel · delområde | Stanna & parkera · Förbud att parkera |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 1 kap. 4 § |
| Status | `reviewed` |
| Missuppfattning | Stannande vs parkering |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `02b9eb00` |

#### `par-004` · Parkering på huvudled

Får du parkera på en huvudled?

**Rätt svar:** Nej, det är förbjudet att parkera på huvudled. Du får däremot stanna kort.

**Förklaring:** Parkering är förbjuden på huvudled. Kort stannande är tillåtet om det sker säkert.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-VOLATILE, P1-LAW, P1-EXCEPTION |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Stanna & parkera · Förbud att parkera |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 3 kap. 55 § |
| Status | `reviewed` |
| Missuppfattning | Parkering på huvudled; Stannande vs parkering |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `1f244009` |

#### `par-005` · Parkering i färdriktningen

Hur ska du parkera på en gata med dubbelriktad trafik?

**Rätt svar:** På högra sidan i färdriktningen.

**Förklaring:** Parkera i färdriktningen på högra sidan av vägen.

| | |
| --- | --- |
| Typ | P1-VOLATILE, P1-LAW, P1-EXCEPTION |
| Varför i kön | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| Kapitel · delområde | Stanna & parkera · Parkeringsregler |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 3 kap. 52 § |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `481e2f44` |

#### `par-007` · Parkering och utfarter

Vad gäller för att parkera framför en utfart från en fastighet?

**Rätt svar:** Du får inte parkera så att du hindrar fordon från att komma ut.

**Förklaring:** Du får aldrig parkera så att du blockerar en in- eller utfart.

| | |
| --- | --- |
| Typ | P1-VOLATILE, P1-LAW |
| Varför i kön | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| Kapitel · delområde | Stanna & parkera · Parkeringsregler |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 3 kap. 54 § |
| Status | `reviewed` |
| Missuppfattning | Stannande vs parkering |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `102a970d` |

#### `par-008` · Parkering på backkrön och i kurva

Varför är det förbjudet att stanna på ett backkrön eller i en kurva med skymd sikt?

**Rätt svar:** Ett fordon som inte syns förrän på nära håll ger andra för kort tid att reagera.

**Förklaring:** Där sikten är skymd hinner ingen upptäcka ett stillastående fordon i tid.

| | |
| --- | --- |
| Typ | P1-VOLATILE, P1-LAW |
| Varför i kön | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| Kapitel · delområde | Stanna & parkera · Förbud att parkera |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 3 kap. 53 § |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `074aa0d2` |

#### `par-009` · Parkeringsskyltens tilläggstavlor

Under en parkeringsskylt sitter en tilläggstavla med texten "8–18". Vad betyder det?

**Rätt svar:** Parkering är tillåten enligt skylten under de angivna tiderna på vardagar.

**Förklaring:** Svarta siffror utan parentes anger vardagar. Regleringen gäller under de tiderna.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-VOLATILE, P1-LAW |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Stanna & parkera · Parkeringsregler |
| Källa och exakt hänvisning | Vägmärkesförordningen (2007:90) T6 |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `b30096e8` |

#### `par-010` · Stannande i cykelfält

Får du stanna i ett cykelfält för att släppa av en passagerare?

**Rätt svar:** Nej, du får inte stanna i ett cykelfält.

**Förklaring:** Cykelfält, cykelbana och busshållplats är ytor du varken får stanna eller parkera på.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-LAW, P1-EXCEPTION |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Stanna & parkera · Förbud att stanna |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 3 kap. 53 § |
| Status | `reviewed` |
| Missuppfattning | Stannande vs parkering |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `b7aa8dce` |

#### `bld-012` · Att läsa tilläggstavlor vid parkering

Vad betyder den gula tavlan med röd ring och texten "Onsd 0–6" på bilden?

**Rätt svar:** Att det är förbjudet att parkera onsdagar mellan klockan 0 och 6.

**Förklaring:** Gul botten med röd ring betyder förbud. Tiderna anger när förbudet gäller — här natten mot onsdag, ofta för gaturenhållning.

| | |
| --- | --- |
| Typ | P1-VOLATILE, P1-LAW |
| Varför i kön | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| Kapitel · delområde | Stanna & parkera · Parkeringsregler |
| Källa och exakt hänvisning | Vägmärkesförordningen (2007:90) 2 kap. T6 · Teoribok — Körkortsboken 2026 för B-körkort Tilläggstavlor vid parkering s. 73 |
| Status | `reviewed` |
| Missuppfattning | Gul tilläggstavla läses som tillåtelse |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `bd340859` |

#### `bld-013` · Tider inom parentes på tilläggstavla

På tavlan står "2 tim 9–18 (9–15)". Vad betyder siffrorna inom parentes?

**Rätt svar:** Att tiderna gäller lördagar och dag före helgdag.

**Förklaring:** Svarta siffror gäller vardagar, siffror inom parentes gäller lördag och dag före helgdag, röda siffror gäller sön- och helgdag.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-VOLATILE, P1-LAW |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Stanna & parkera · Parkeringsregler |
| Källa och exakt hänvisning | Vägmärkesförordningen (2007:90) 2 kap. T6 · Teoribok — Körkortsboken 2026 för B-körkort Tilläggstavlor vid parkering s. 73 |
| Status | `reviewed` |
| Missuppfattning | Tider inom parentes misstolkas |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `35a5a903` |

### Omgång 06 — Belysning och mörker · 4 frågor

#### `bel-006` · Hastighet vid kraftigt nedsatt sikt

Sikten i dimman är ungefär 50 meter. Vad ska styra din hastighet?

**Rätt svar:** Att du hinner stanna inom de 50 meter du faktiskt ser.

**Förklaring:** Sikten sätter taket. Kan du inte stanna inom det du ser, kör du för fort — oavsett vad skylten säger.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-LAW |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Belysning · Dimma |
| Källa och exakt hänvisning | Teoribok — Körkortsboken 2026 för B-körkort Dimma och snöfall s. 263 · Trafikförordningen (1998:1276) 3 kap. 14 § |
| Status | `reviewed` |
| Missuppfattning | Kör fortare än ljuset räcker |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `1bf03368` |

#### `mor-001` · Hastighet i mörker

Vad avgör hur fort du får köra på en mörk landsväg med halvljus?

**Rätt svar:** Att du kan stanna inom den sträcka som ljuset räcker.

**Förklaring:** Kör aldrig fortare än att du hinner stanna inom ljuskäglan.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-LAW |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Belysning · Mörkerkörning |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 3 kap. 14 § |
| Status | `reviewed` |
| Missuppfattning | Kör fortare än ljuset räcker |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `b6ee35b2` |

#### `mor-005` · Att upptäcka gående i mörker

På ungefär vilket avstånd ser du en mörkklädd gående i halvljus?

**Rätt svar:** Omkring 20–30 meter.

**Förklaring:** En mörkklädd gående syns först på mycket kort avstånd — kortare än din stoppsträcka.

| | |
| --- | --- |
| Typ | P1-NUMERIC |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Belysning · Mörkerkörning |
| Källa och exakt hänvisning | Trafiksäkerhet: synbarhet i mörker |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `e9e3b0ba` |

#### `for-004` · Trasig lykta

Du upptäcker att en av bilens bromslyktor inte fungerar. Vad gäller?

**Rätt svar:** Felet ska åtgärdas — bilen får inte köras med bristfällig belysning.

**Förklaring:** Belysningen ska fungera. En trasig bromslykta ska åtgärdas.

| | |
| --- | --- |
| Typ | P1-ADMIN, P1-LAW |
| Varför i kön | Administrativ regel — besiktning, registrering, försäkring, körkort. |
| Kapitel · delområde | Belysning · Belysning |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 3 kap. 68 § |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `1de36d54` |

### Omgång 07 — Väjning, stopp och korsningar · 1 frågor

#### `kor-008` · Huvudled

Vad innebär märket huvudled för dig som kör på leden?

**Rätt svar:** Korsande trafik har väjningsplikt mot dig, och du får inte parkera på leden.

**Förklaring:** Huvudled ger företräde mot korsande trafik — och parkeringsförbud på leden.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-LAW, P1-EXCEPTION |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Väjningsregler · Huvudled |
| Källa och exakt hänvisning | Vägmärkesförordningen (2007:90) B4 · Trafikförordningen (1998:1276) 3 kap. 55 § |
| Status | `reviewed` |
| Missuppfattning | Bashastighet blandas ihop med skyltad hastighet; Parkering på huvudled |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `d35172db` |

### Omgång 08 — Oskyddade trafikanter och passager · 3 frågor

#### `pas-013` · Utformning av cykelöverfart

Trafikmiljön vid en cykelöverfart ska vara utformad så att en viss hastighet inte är lämplig att överskrida. Vilken?

**Rätt svar:** 30 km/h.

**Förklaring:** En cykelöverfart ska vara byggd så att det inte är lämpligt att köra fortare än 30 km/h, ofta genom en upphöjning.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-SAFETY |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Passager · Cykelpassage och cykelöverfart |
| Källa och exakt hänvisning | Teoribok — Körkortsboken 2026 för B-körkort Cykelöverfart s. 52 |
| Status | `reviewed` |
| Missuppfattning | Utformningskravet vid cykelöverfart glöms |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `6beeed92` |

#### `ris-009` · Passage av buss

En buss står vid en hållplats och släpper av passagerare. Vad bör du göra?

**Rätt svar:** Sänka farten kraftigt och vara beredd på att någon springer ut framför bussen.

**Förklaring:** Bussen skymmer sikten. Räkna med att någon korsar vägen framför den.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-LAW, P1-SAFETY |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Barn · Barn och oskyddade |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 3 kap. 12 § |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `dfb93d37` |

#### `bld-007` · Att skilja cykelöverfart från cykelpassage

Vad på bilden visar att det här är en cykelöverfart och inte en cykelpassage?

**Rätt svar:** Vägmärket för cykelöverfart tillsammans med väjningslinjen för biltrafiken.

**Förklaring:** Rutorna finns vid båda. Det är vägmärket och väjningslinjen som gör skillnaden — och som ger dig full väjningsplikt.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-LAW, P1-SAFETY |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Passager · Cykelpassage och cykelöverfart |
| Källa och exakt hänvisning | Vägmärkesförordningen (2007:90) 2 kap. B8 · Trafikförordningen (1998:1276) 3 kap. 61 b § · Teoribok — Körkortsboken 2026 för B-körkort Cykelöverfart s. 52 |
| Status | `reviewed` |
| Missuppfattning | Cykelpassage förväxlas med cykelöverfart |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `a7984d44` |

### Omgång 09 — Motorväg, landsväg och omkörning · 14 frågor

#### `has-004` · Avstånd till framförvarande

Vilket avstånd bör du normalt hålla till fordonet framför på torr väg?

**Rätt svar:** Minst tre sekunder, mätt när fordonet framför passerar en fast punkt.

**Förklaring:** Mät i tid, inte i meter. Tre sekunder på torr väg, mer när det är halt.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-LAW |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Landsväg · Avstånd till andra |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 3 kap. 2 § · Körstrategi och avståndsbedömning |
| Status | `reviewed` |
| Missuppfattning | Avstånd mäts i meter i stället för tid |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `f6c0c782` |

#### `has-008` · Sidoavstånd till cyklist

Du ska passera en cyklist på en landsväg i 70 km/h. Vad är rätt?

**Rätt svar:** Håll gott sidoavstånd, väl över en meter, och sänk farten om utrymmet är trångt.

**Förklaring:** Ge cyklisten rejält sidoavstånd — och sänk farten när du inte kan ge det.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-LAW |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Körfält · Placering i körfält |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 3 kap. 32 § |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `ee1a174e` |

#### `has-010` · Avstånd bakom tungt fordon

Varför bör du hålla extra långt avstånd bakom en lastbil?

**Rätt svar:** Du ser mindre av vägen framför, och lastbilsförarens speglar täcker inte allt bakom.

**Förklaring:** Långt avstånd ger dig sikt förbi lastbilen — och gör att föraren kan se dig.

| | |
| --- | --- |
| Typ | P1-NUMERIC |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Landsväg · Avstånd till andra |
| Källa och exakt hänvisning | Körstrategi, sikt och tunga fordon |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `84a05377` |

#### `mot-001` · Påfart till motorväg

Hur ska du köra ut på en motorväg från en påfart med accelerationsfält?

**Rätt svar:** Anpassa farten till trafiken på motorvägen och väv in i en lucka.

**Förklaring:** Accelerationsfältet är till för att accelerera. Matcha farten och väv in.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-LAW |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Motorväg & motortrafikled · Påfart och avfart |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 3 kap. 44 § |
| Status | `reviewed` |
| Missuppfattning | Stannar på påfartsrampen |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `8a159267` |

#### `mot-002` · Fordon som inte får köra på motorväg

Vilket fordon får inte köras på motorväg?

**Rätt svar:** Ett fordon som inte kan eller får köra fortare än 40 km/h.

**Förklaring:** Motorväg kräver att fordonet kan hålla minst 40 km/h.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-LAW |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Motorväg & motortrafikled · Regler på motorväg |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 9 kap. 1 § |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `62be631d` |

#### `mot-004` · Förbjudna manövrar

Vilken manöver är alltid förbjuden på motorväg?

**Rätt svar:** Backning och U-sväng.

**Förklaring:** Du får aldrig backa eller vända på en motorväg.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-LAW |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Motorväg & motortrafikled · Regler på motorväg |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 9 kap. 2 § |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `40a49778` |

#### `mot-006` · Hastighetsanpassning efter motorväg

Du har kört i 110 km/h i en timme och svänger av mot en tätort med 50 km/h. Vad är den vanligaste risken?

**Rätt svar:** Att du uppfattar din hastighet som lägre än den är och kör för fort.

**Förklaring:** Efter lång tid i hög fart känns 70 km/h som krypfart. Läs av mätaren.

| | |
| --- | --- |
| Typ | P1-NUMERIC |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Motorväg & motortrafikled · Regler på motorväg |
| Källa och exakt hänvisning | Trafikpsykologi: hastighetsanpassning |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `10b4ffd5` |

#### `mot-007` · Motortrafikled

Vad skiljer en motortrafikled från en motorväg?

**Rätt svar:** Motortrafikleden har oftast bara ett körfält i varje riktning och kan sakna mittseparering.

**Förklaring:** Samma fordonsregler som motorväg, men enklare vägutformning — och därmed mötande trafik.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-LAW |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Motorväg & motortrafikled · Motortrafikled |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 9 kap. 1 § |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `45d4a797` |

#### `omk-005` · Omkörningens tid och sträcka

Du ska köra om en lastbil som håller 70 km/h. Du kan köra 90 km/h. Vad innebär den lilla hastighetsskillnaden?

**Rätt svar:** Omkörningen tar lång tid och kräver en mycket lång fri sträcka.

**Förklaring:** Liten hastighetsskillnad ger lång omkörning — och lång tid i mötande körfält.

| | |
| --- | --- |
| Typ | P1-NUMERIC |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Omkörningar · Omkörningsregler |
| Källa och exakt hänvisning | Körstrategi: omkörningens tidsåtgång |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `fba75a12` |

#### `krf-006` · Val av körfält vid olika hastighetsgränser

Du kör på en väg med tre körfält i din riktning och 80 km/h. Alla körfält leder till samma mål. Du har precis kört om. Vad gäller?

**Rätt svar:** Du ska tillbaka till det högra körfältet när omkörningen är klar.

**Förklaring:** Grundregeln är högra körfältet. Fri körfältsplacering kräver antingen 70 km/h eller lägre, eller att körfälten leder till olika mål.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-LAW |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Körfält · Placering i körfält |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 3 kap. 7 § · Teoribok — Körkortsboken 2026 för B-körkort Vilket körfält du ska välja s. 16 |
| Status | `reviewed` |
| Missuppfattning | Fri körfältsplacering antas gälla alltid |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `8810550a` |

#### `krf-007` · Fri körfältsplacering vid låg hastighet

Du kör i tätort på en gata med två markerade körfält i din riktning och 50 km/h. Får du välja körfält fritt?

**Rätt svar:** Ja, du får välja det körfält som passar din fortsatta färd bäst.

**Förklaring:** Minst två markerade körfält i din riktning och högst 70 km/h ger dig fri körfältsplacering.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-LAW, P1-EXCEPTION |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Körfält · Placering i körfält |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 3 kap. 7 § · Teoribok — Körkortsboken 2026 för B-körkort Vilket körfält du ska välja s. 16 |
| Status | `reviewed` |
| Missuppfattning | Fri körfältsplacering antas gälla alltid |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `0cc3c190` |

#### `ber-008` · Tresekundersregeln

Du kör i 80 km/h och håller tre sekunders avstånd till bilen framför. Ungefär hur långt är avståndet i meter?

**Rätt svar:** Cirka 67 meter.

**Förklaring:** 80 / 3,6 ≈ 22 meter per sekund. Tre sekunder blir alltså cirka 67 meter.

| | |
| --- | --- |
| Typ | P1-NUMERIC |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Landsväg · Avstånd till andra |
| Källa och exakt hänvisning | Trafikverket · Teoribok — Körkortsboken 2026 för B-körkort Hålla rätt avstånd s. 81 |
| Status | `reviewed` |
| Missuppfattning | Sekundregeln räknas inte om till meter |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `1a3da133` |

#### `bld-001` · Körfältsval enligt körfältsvägvisare

Du ska mot Göteborg och kör i körfält B. Vad säger körfältsvägvisaren om ditt körfältsval här?

**Rätt svar:** Körfälten leder till olika mål, så du får välja det körfält som passar din fortsatta färd.

**Förklaring:** Vägvisaren visar att det högra körfältet leder till en avfart medan de övriga fortsätter mot Göteborg. Då gäller undantaget om olika färdmål.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-LAW, P1-EXCEPTION |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Körfält · Placering i körfält |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 3 kap. 7 § · Vägmärkesförordningen (2007:90) 2 kap. F8 · Teoribok — Körkortsboken 2026 för B-körkort Vilket körfält du ska välja s. 16 |
| Status | `reviewed` |
| Missuppfattning | Körfältsvägvisarens undantag missas |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `d4856a68` |

#### `bl2-011` · Sikt vid omkörning

Du överväger en omkörning på sträckan i bilden. Hur långt måste sikten räcka?

**Rätt svar:** Hela sträckan du behöver för att köra om och komma tillbaka in med marginal.

**Förklaring:** Omkörningen är klar först när du är tillbaka i ditt körfält med säkert avstånd. Sikten måste räcka för hela det förloppet.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-LAW |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Omkörningar · Omkörningsregler |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 3 kap. 30–36 §§ · Teoribok — Körkortsboken 2026 för B-körkort Omkörningar s. 98 |
| Status | `reviewed` |
| Missuppfattning | Siktkravet vid omkörning underskattas |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `d8d130ae` |

### Omgång 10 — Järnvägskorsningar · 2 frågor

#### `jvg-010` · Bedömning av tågets hastighet

Du står vid en obevakad plankorsning och ser ett tåg långt bort. Varför är det svårt att bedöma om du hinner över?

**Rätt svar:** Ett tåg som närmar sig rakt framifrån ändrar knappt storlek, vilket får det att verka långsammare och längre bort än det är.

**Förklaring:** Ett stort föremål som kommer rakt emot dig ser ut att röra sig långsamt. Ser du ett tåg alls ska du stå kvar.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-LAW, P1-SAFETY |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Järnvägskorsningar · Att korsa en plankorsning |
| Källa och exakt hänvisning | Teoribok — Körkortsboken 2026 för B-körkort Hur man korsar en järnväg säkert s. 109 · Trafikförordningen (1998:1276) 3 kap. 25 § |
| Status | `reviewed` |
| Missuppfattning | Tågets hastighet underskattas |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `129f5669` |

#### `jvg-016` · Varning för järnvägskorsning

Vilket är det säkraste sättet att veta att du närmar dig en plankorsning innan du ser själva spåret?

**Rätt svar:** Varningsmärket för korsning med järnväg, ofta följt av avståndsmärken.

**Förklaring:** Varningsmärket kommer först, sedan avståndsmärkena som räknar ner. Det är förvarningen du ska agera på, inte spåret.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-LAW, P1-SAFETY |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Järnvägskorsningar · Märken och signaler |
| Källa och exakt hänvisning | Vägmärkesförordningen (2007:90) 2 kap. A35–A38 · Teoribok — Körkortsboken 2026 för B-körkort Avstånd till järnvägskorsning s. 109 |
| Status | `reviewed` |
| Missuppfattning | Plankorsningen upptäcks först vid rälsen |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `5ef0937a` |

### Omgång 11 — Krocksäkerhet och bilbälte · 3 frågor

#### `krk-003` · Ansvar för bältesanvändning

Vem ansvarar för att en 12-åring i baksätet använder bilbälte?

**Rätt svar:** Föraren.

**Förklaring:** Föraren ansvarar för att passagerare under 15 år använder bälte. Från 15 år ansvarar passageraren själv.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-LAW, P1-SAFETY |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Krocksäkerhet · Krocksäkerhet |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 4 kap. 10 § · Teoribok — Körkortsboken 2026 för B-körkort Säkerhetsbälte s. 232 |
| Status | `reviewed` |
| Missuppfattning | Ansvaret för barns bältesanvändning |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `2df4b6b5` |

#### `krk-006` · Krockkudde och bälte

Vad gäller om krockkudden löser ut och du inte har bälte på dig?

**Rätt svar:** Krockkudden kan ge svåra skador i stället för att skydda.

**Förklaring:** Krockkudden är ett komplement till bältet, aldrig en ersättning. Utan bälte möter du kudden med full fart.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-SAFETY |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Krocksäkerhet · Krocksäkerhet |
| Källa och exakt hänvisning | Teoribok — Körkortsboken 2026 för B-körkort Krockkudde (airbag) s. 233 |
| Status | `reviewed` |
| Missuppfattning | Krockkudden antas ersätta bältet |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `397803fa` |

#### `krk-008` · Barnskydd i bil

Vilken gräns avgör om ett barn måste ha särskilt barnskydd i bilen?

**Rätt svar:** Barn kortare än 135 cm ska ha ett särskilt barnskydd.

**Förklaring:** Gränsen går vid längden 135 cm, inte vid ålder. Föraren ansvarar för att barn under 15 år är rätt skyddade.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-LAW, P1-SAFETY, P1-EXCEPTION |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Krocksäkerhet · Krocksäkerhet |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 4 kap. 10 § · Teoribok — Körkortsboken 2026 för B-körkort Bilbarnstolar s. 238 |
| Status | `reviewed` |
| Missuppfattning | Gränsen för barnskydd antas vara ålder |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `8c49f9e6` |

### Omgång 12 — Vägmärken och vägmarkeringar · 12 frågor

#### `tra-009` · Busshållplats i tätort

Du kör i tätbebyggt område på en väg med 50 km/h. En buss vid en hållplats blinkar för att köra ut. Vad gäller?

**Rätt svar:** Du ska sänka farten och låta bussen köra ut.

**Förklaring:** Inom tätbebyggt område där hastighetsgränsen är högst 50 km/h ska du släppa ut en buss från hållplats.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-LAW, P1-EXCEPTION |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Inledning · Vägens användning |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 3 kap. 12 § |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `236d5961` |

#### `vag-003` · Förbudsmärkens giltighet

Hur länge gäller normalt ett förbudsmärke som satts upp vid en väg?

**Rätt svar:** Fram till nästa korsning, om inget annat anges med tilläggstavla.

**Förklaring:** Förbudsmärken gäller normalt fram till nästa korsning.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-LAW, P1-EXCEPTION |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Vägmärken · Förbudsmärken |
| Källa och exakt hänvisning | Vägmärkesförordningen (2007:90) 2 kap. |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `0ab4794a` |

#### `vag-006` · Gågata

Vad gäller för motorfordon på en gågata?

**Rätt svar:** Körning är tillåten bara i vissa undantagsfall, i gångfart, och du har väjningsplikt mot gående.

**Förklaring:** På gågata gäller gångfart, väjningsplikt mot gående och parkeringsförbud.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-LAW, P1-EXCEPTION |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Speciella gator · Anvisningsmärken |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 8 kap. 1 § |
| Status | `reviewed` |
| Missuppfattning | Bashastighet blandas ihop med skyltad hastighet |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `4599bf79` |

#### `vag-007` · Gångfartsområde

Vilken hastighet gäller i ett gångfartsområde?

**Rätt svar:** Gångfart — omkring 7 km/h, alltså inte fortare än en person går.

**Förklaring:** I gångfartsområde kör du i gångfart och har väjningsplikt mot gående.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-LAW |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Speciella gator · Anvisningsmärken |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 8 kap. 1 § |
| Status | `reviewed` |
| Missuppfattning | Bashastighet blandas ihop med skyltad hastighet |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `8c95b7d5` |

#### `vag-010` · Hastighetsmärke

Du passerar en rund skylt med gul botten, röd ram och siffran 70. Vad betyder det?

**Rätt svar:** Högsta tillåtna hastighet är 70 km/h.

**Förklaring:** Rund skylt med röd ram anger högsta tillåtna hastighet — ett tak, inte ett mål.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-LAW, P1-EXCEPTION |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Vägmärken · Förbudsmärken |
| Källa och exakt hänvisning | Vägmärkesförordningen (2007:90) C31 |
| Status | `reviewed` |
| Missuppfattning | Skyltad hastighet ses som ett krav |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `4a46f0e5` |

#### `vag-012` · Avstånd till faran

På hur långt avstånd före faran sitter ett varningsmärke normalt utanför tätort?

**Rätt svar:** Avståndet anpassas efter hastigheten — ju högre hastighet, desto längre före.

**Förklaring:** Placeringen följer hastigheten så att du hinner reagera och anpassa farten.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-LAW |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Vägmärken · Varningsmärken |
| Källa och exakt hänvisning | Vägmärkesförordningen (2007:90) 2 kap. |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `778ec740` |

#### `bld-015` · Gångfartsområde

Du kör in på gatan på bilden. Vad gäller där?

**Rätt svar:** Gångfart, väjningsplikt mot gående och parkering endast på anvisade platser.

**Förklaring:** I ett gångfartsområde gäller gångfart, cirka 7 km/h, väjningsplikt mot gående och parkeringsförbud utom på anvisade platser.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-LAW, P1-EXCEPTION |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Speciella gator · Anvisningsmärken |
| Källa och exakt hänvisning | Vägmärkesförordningen (2007:90) 2 kap. E9 · Trafikförordningen (1998:1276) 8 kap. 1 § · Teoribok — Körkortsboken 2026 för B-körkort Gångfartsområde s. 116 |
| Status | `reviewed` |
| Missuppfattning | Gångfartsområdets regler blandas ihop |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `35e08a8a` |

#### `vmk-012` · Hastighetsbegränsning (C31)

Vilken hastighet anger det här märket, och på vilket sätt?

**Rätt svar:** Högsta tillåtna hastighet är 70 km/h.

**Förklaring:** Röd ring betyder förbud: 70 är ett tak. Sikt, väglag och trafik kan kräva betydligt lägre fart.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-LAW |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Vägmärken · Förbudsmärken |
| Källa och exakt hänvisning | Vägmärkesförordningen (2007:90) 2 kap. C31 · Teoribok — Körkortsboken 2026 för B-körkort Förbudsmärken (C) s. 331 |
| Status | `reviewed` |
| Missuppfattning | Rekommenderad hastighet tas för en gräns |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `2d159bd3` |

#### `vmk-013` · Rekommenderad lägre hastighet (E11)

Hur ska du läsa siffran på det här märket?

**Rätt svar:** Rekommenderad lägre hastighet är 30 km/h — den skyltade gränsen gäller fortfarande.

**Förklaring:** Blått är anvisning, rött är förbud. Den blå skylten rekommenderar 30 — den ersätter inte hastighetsbegränsningen.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-LAW |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Speciella gator · Anvisningsmärken |
| Källa och exakt hänvisning | Vägmärkesförordningen (2007:90) 2 kap. E11 · Teoribok — Körkortsboken 2026 för B-körkort Anvisningsmärken (E) s. 334 |
| Status | `reviewed` |
| Missuppfattning | Rekommenderad hastighet tas för en gräns |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `cafca482` |

#### `vmk-019` · Motorväg (E1)

Vilka regler börjar gälla när du passerar det här märket?

**Rätt svar:** Motorväg börjar — motorvägens regler gäller från här.

**Förklaring:** Efter märket gäller motorvägens regler: bara motordrivna fordon som får köra minst 40 km/h, och förbud mot att stanna, backa, vända eller gå på vägbanan.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-LAW |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Speciella gator · Anvisningsmärken |
| Källa och exakt hänvisning | Vägmärkesförordningen (2007:90) 2 kap. E1 · Teoribok — Körkortsboken 2026 för B-körkort Anvisningsmärken (E) s. 333 |
| Status | `reviewed` |
| Missuppfattning | Motorväg förväxlas med motortrafikled |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `8cd708bc` |

#### `vmk-023` · Gågata kontra gångfartsområde

Vad är den viktigaste skillnaden mellan en gågata och ett gångfartsområde?

**Rätt svar:** På gågatan får du köra bara för särskilda ändamål; i gångfartsområdet får du köra, men på de gåendes villkor.

**Förklaring:** Gågatan begränsar *vem* som får köra där. Gångfartsområdet begränsar *hur* du får köra.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-LAW |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Speciella gator · Anvisningsmärken |
| Källa och exakt hänvisning | Vägmärkesförordningen (2007:90) 2 kap. E7, E9 · Teoribok — Körkortsboken 2026 för B-körkort Speciella gator s. 116 |
| Status | `reviewed` |
| Missuppfattning | Gågata förväxlas med gångfartsområde |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `9feb03eb` |

#### `vmk-024` · Tättbebyggt område (E5)

Du passerar märket för tättbebyggt område utan att se någon hastighetsskylt. Vad gäller?

**Rätt svar:** Bashastigheten 50 km/h.

**Förklaring:** Inom tättbebyggt område är bashastigheten 50 km/h. Utanför är den 70 km/h.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-LAW |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Speciella gator · Anvisningsmärken |
| Källa och exakt hänvisning | Vägmärkesförordningen (2007:90) 2 kap. E5 · Trafikförordningen (1998:1276) 3 kap. 17 § · Teoribok — Körkortsboken 2026 för B-körkort Tättbebyggt område (E5) s. 116 |
| Status | `reviewed` |
| Missuppfattning | Bashastighet blandas ihop med skyltad hastighet |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `3e8d0b39` |

### Omgång 13 — Fordon, miljö och administration · 25 frågor

#### `mil-002` · Faktorer som påverkar förbrukningen

Vilket av följande ökar bränsleförbrukningen mest på en längre resa?

**Rätt svar:** Takbox eller takräcke som ökar luftmotståndet.

**Förklaring:** Luftmotståndet dominerar vid högre hastigheter — ta av takboxen när den inte används.

| | |
| --- | --- |
| Typ | P1-NUMERIC |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Sparsam körning · Sparsam körning |
| Källa och exakt hänvisning | Sparsam körning, ecodriving |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `2d2d8666` |

#### `mil-006` · Hastighet och förbrukning

Du sänker farten från 110 till 90 km/h på en längre sträcka. Vad händer?

**Rätt svar:** Bränsleförbrukningen minskar märkbart, medan restiden bara ökar något.

**Förklaring:** Luftmotståndet växer i kvadrat — en liten fartsänkning ger en stor besparing.

| | |
| --- | --- |
| Typ | P1-NUMERIC |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Sparsam körning · Sparsam körning |
| Källa och exakt hänvisning | Sparsam körning, ecodriving |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `900e5b08` |

#### `for-005` · Körförbud

Vad innebär det att en bil har fått körförbud efter en besiktning?

**Rätt svar:** Bilen får inte köras, förutom kortaste lämpliga väg till en verkstad eller besiktning.

**Förklaring:** Vid körförbud får bilen bara köras till verkstad eller ny besiktning.

| | |
| --- | --- |
| Typ | P1-VOLATILE, P1-ADMIN, P1-EXCEPTION |
| Varför i kön | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| Kapitel · delområde | Säkerhetskontroller · Kontroll och besiktning |
| Källa och exakt hänvisning | Fordonslagen och besiktningsregler |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `5f6895ed` |

#### `for-006` · Förarens ansvar

Vem ansvarar för att bilen är i trafiksäkert skick när du kör den?

**Rätt svar:** Föraren — även om bilen är lånad eller hyrd.

**Förklaring:** Som förare ansvarar du för fordonets skick, oavsett vem som äger det.

| | |
| --- | --- |
| Typ | P1-VOLATILE, P1-ADMIN, P1-LAW |
| Varför i kön | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| Kapitel · delområde | Säkerhetskontroller · Kontroll och besiktning |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 3 kap. 84 § |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `bce22a9f` |

#### `for-009` · Varningslampor

En röd varningslampa tänds på instrumentpanelen under körning. Vad gör du?

**Rätt svar:** Stannar på en säker plats så snart det går och tar reda på vad lampan betyder.

**Förklaring:** Rött betyder stanna snarast. Gult betyder åtgärda snart.

| | |
| --- | --- |
| Typ | P1-VOLATILE, P1-ADMIN |
| Varför i kön | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| Kapitel · delområde | Säkerhetskontroller · Kontroll och besiktning |
| Källa och exakt hänvisning | Fordonskunskap: instrumentpanelens symboler |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `d6aabffa` |

#### `fsl-001` · Begreppet trafikant

Vem räknas som trafikant?

**Rätt svar:** Alla som befinner sig på en väg, till exempel förare, gående, cyklister och ryttare.

**Förklaring:** Trafikant är ett brett begrepp: alla som befinner sig på vägen. Det är därför trafikreglerna kan rikta sig till fotgängare lika väl som till bilister.

| | |
| --- | --- |
| Typ | P1-VOLATILE, P1-ADMIN, P1-EXCEPTION |
| Varför i kön | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| Kapitel · delområde | Indelning av fordon · Fordonsslag och hastigheter |
| Källa och exakt hänvisning | Teoribok — Körkortsboken 2026 för B-körkort Trafikant s. 188 |
| Status | `reviewed` |
| Missuppfattning | Trafikant antas betyda bilförare |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `e661293a` |

#### `fsl-002` · Högsta hastighet för lätt lastbil

Hur fort får en lätt lastbil högst köras?

**Rätt svar:** Så fort som vägens hastighetsbegränsning tillåter.

**Förklaring:** För en lätt lastbil gäller vägens hastighetsbestämmelser, precis som för personbil. Det är de tunga fordonen som har egna tak.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-VOLATILE, P1-ADMIN |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Indelning av fordon · Fordonsslag och hastigheter |
| Källa och exakt hänvisning | Transportstyrelsen Hastighetsbestämmelser för olika fordon · Teoribok — Körkortsboken 2026 för B-körkort Hastigheter för olika fordon s. 190 |
| Status | `reviewed` |
| Missuppfattning | Lätt lastbil antas ha eget hastighetstak |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `0c599be7` |

#### `fsl-003` · Högsta hastighet med bromsad släpvagn

Hur fort får du högst köra med en bromsad släpvagn efter personbilen?

**Rätt svar:** 80 km/h.

**Förklaring:** Med bromsad släpvagn är taket 80 km/h, även på en väg där det annars är tillåtet att köra fortare.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-VOLATILE, P1-ADMIN, P1-LAW, P1-EXCEPTION |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Indelning av fordon · Fordonsslag och hastigheter |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 4 kap. 20 § · Teoribok — Körkortsboken 2026 för B-körkort Hastigheter för olika fordon s. 190 |
| Status | `reviewed` |
| Missuppfattning | Hastighetstaket med släp glöms |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `bd23e806` |

#### `fsl-004` · Högsta hastighet vid bogsering

Du bogserar en annan bil. Hur fort får ni högst köra?

**Rätt svar:** 30 km/h.

**Förklaring:** Vid bogsering av en annan bil är gränsen 30 km/h. Det är också skälet till att bogsering på motorväg bara är tillåten till närmaste avfart.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-VOLATILE, P1-ADMIN, P1-LAW |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Indelning av fordon · Fordonsslag och hastigheter |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 4 kap. 20 § · Teoribok — Körkortsboken 2026 för B-körkort Hastigheter för olika fordon s. 190 |
| Status | `reviewed` |
| Missuppfattning | Hastigheten vid bogsering överskattas |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `f9d6c28d` |

#### `fsl-005` · Moped klass I och klass II

Vad skiljer en moped klass I från en moped klass II?

**Rätt svar:** Klass I (EU-moped) får köras i högst 45 km/h och räknas som motorfordon; klass II är långsammare och får ofta använda cykelbana.

**Förklaring:** Klass I är en EU-moped med konstruktiv hastighet upp till 45 km/h. Klass II är långsammare och behandlas i många regler som en cykel.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-VOLATILE, P1-ADMIN, P1-EXCEPTION |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Indelning av fordon · Fordonsslag och hastigheter |
| Källa och exakt hänvisning | Teoribok — Körkortsboken 2026 för B-körkort Indelning av fordon s. 189 · Teoribok — Körkortsboken 2026 för B-körkort Kollektivkörfält s. 18 |
| Status | `reviewed` |
| Missuppfattning | Mopedklasserna blandas ihop |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `4e7ceadb` |

#### `fsl-006` · Varför andra fordons hastigheter spelar roll

Du ligger bakom en tung lastbil på en landsväg med 90 km/h. Varför är det bra att veta att lastbilen får köra högst 80 km/h?

**Rätt svar:** Du vet att den inte kommer att öka farten, vilket gör omkörningen möjlig att planera.

**Förklaring:** Att veta motpartens maxfart gör skillnaden mellan en planerad omkörning och en chansning.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-VOLATILE, P1-ADMIN |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Indelning av fordon · Fordonsslag och hastigheter |
| Källa och exakt hänvisning | Teoribok — Körkortsboken 2026 för B-körkort Hastigheter för olika fordon s. 190 |
| Status | `reviewed` |
| Missuppfattning | Andras hastighetstak används fel |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `1e71cb3e` |

#### `frs-001` · Trafikförsäkringens omfattning

Vilken skada ersätts inte av trafikförsäkringen?

**Rätt svar:** Skada på ditt eget fordon.

**Förklaring:** Trafikförsäkringen täcker personskador och skador du orsakar på andras fordon och egendom — men aldrig din egen bil.

| | |
| --- | --- |
| Typ | P1-VOLATILE, P1-ADMIN, P1-EXCEPTION |
| Varför i kön | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| Kapitel · delområde | Försäkring · Försäkring |
| Källa och exakt hänvisning | Transportstyrelsen Trafikförsäkring · Teoribok — Körkortsboken 2026 för B-körkort Trafikförsäkring s. 298 |
| Status | `reviewed` |
| Missuppfattning | Trafikförsäkringen antas täcka egen bil |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `84e47ed7` |

#### `frs-002` · Krav på trafikförsäkring

Vilka fordon måste ha trafikförsäkring?

**Rätt svar:** Alla motordrivna fordon som är i trafik.

**Förklaring:** Trafikförsäkring är obligatorisk för alla motordrivna fordon. Ställer du av fordonet slipper du både den och fordonsskatten.

| | |
| --- | --- |
| Typ | P1-VOLATILE, P1-ADMIN |
| Varför i kön | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| Kapitel · delområde | Försäkring · Försäkring |
| Källa och exakt hänvisning | Transportstyrelsen Trafikförsäkring · Teoribok — Körkortsboken 2026 för B-körkort Trafikförsäkring s. 298 |
| Status | `reviewed` |
| Missuppfattning | Kravet på trafikförsäkring begränsas |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `c43bd72b` |

#### `frs-003` · Halvförsäkring

Vad ingår i en halvförsäkring utöver trafikförsäkringen?

**Rätt svar:** Bland annat stöld, brand, glas, maskinskada och rättsskydd.

**Förklaring:** Halvförsäkring täcker sådant som händer bilen utan att du kör in i något. Skador på egen bil vid en olycka kräver helförsäkring.

| | |
| --- | --- |
| Typ | P1-VOLATILE, P1-ADMIN |
| Varför i kön | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| Kapitel · delområde | Försäkring · Försäkring |
| Källa och exakt hänvisning | Teoribok — Körkortsboken 2026 för B-körkort Halvförsäkring (delkaskoförsäkring) s. 298 |
| Status | `reviewed` |
| Missuppfattning | Halv- och helförsäkring blandas ihop |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `0f944802` |

#### `frs-004` · Regressrätt

Du döms för rattfylleri efter en olycka. Vad kan försäkringsbolaget göra?

**Rätt svar:** Kräva tillbaka pengar från dig för det bolaget betalat ut.

**Förklaring:** Det kallas regressrätt. Den skadade får sin ersättning, men bolaget kan sedan kräva pengarna av dig.

| | |
| --- | --- |
| Typ | P1-VOLATILE, P1-ADMIN, P1-EXCEPTION |
| Varför i kön | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| Kapitel · delområde | Försäkring · Försäkring |
| Källa och exakt hänvisning | Teoribok — Körkortsboken 2026 för B-körkort Trafikförsäkring s. 298 |
| Status | `reviewed` |
| Missuppfattning | Försäkringen antas skydda vid rattfylleri |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `d4823128` |

#### `reg-001` · Registreringsbevisets delar

Vilken del av registreringsbeviset används vid ägarbyte?

**Rätt svar:** Del 2, ägarbeviset.

**Förklaring:** Del 2 är ägarbeviset och används vid ägarbyte och avregistrering. Del 1 innehåller tekniska uppgifter och används för på- och avställning.

| | |
| --- | --- |
| Typ | P1-VOLATILE, P1-ADMIN, P1-EXCEPTION |
| Varför i kön | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| Kapitel · delområde | Registreringsbevis · Registrering och avställning |
| Källa och exakt hänvisning | Transportstyrelsen Registreringsbevis · Teoribok — Körkortsboken 2026 för B-körkort Registreringsbevis s. 290 |
| Status | `reviewed` |
| Missuppfattning | Registreringsbevisets delar förväxlas |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `dda7b2a3` |

#### `reg-002` · Avställning sker aldrig automatiskt

Vad är sant om avställning av ett fordon?

**Rätt svar:** Ett fordon ställs aldrig av automatiskt — du måste själv anmäla det.

**Förklaring:** Avställning kräver alltid en aktiv anmälan. Körförbud, obetald skatt eller lång stillestånd ändrar ingenting av sig självt.

| | |
| --- | --- |
| Typ | P1-VOLATILE, P1-ADMIN |
| Varför i kön | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| Kapitel · delområde | Registreringsbevis · Registrering och avställning |
| Källa och exakt hänvisning | Transportstyrelsen Avställning · Teoribok — Körkortsboken 2026 för B-körkort Avställning och påställning s. 292 |
| Status | `reviewed` |
| Missuppfattning | Avställning antas ske automatiskt |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `962d05d9` |

#### `reg-003` · Körning med avställt fordon

När får ett avställt fordon köras på väg?

**Rätt svar:** Endast till och från besiktning, om trafikförsäkring är betald och inga skatteskulder finns.

**Förklaring:** Ett avställt fordon får bara köras till och från besiktning, och bara om försäkringen är betald och skatteskulder saknas.

| | |
| --- | --- |
| Typ | P1-VOLATILE, P1-ADMIN, P1-EXCEPTION |
| Varför i kön | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| Kapitel · delområde | Registreringsbevis · Registrering och avställning |
| Källa och exakt hänvisning | Transportstyrelsen Avställning · Teoribok — Körkortsboken 2026 för B-körkort Avställning och påställning s. 293 |
| Status | `reviewed` |
| Missuppfattning | Avställt fordon antas få köras fritt |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `1a03e1a0` |

#### `reg-004` · Försäkring vid ägarbyte

Du köper en begagnad bil. När måste din trafikförsäkring börja gälla?

**Rätt svar:** Samma datum som ägarbytet registreras.

**Förklaring:** Försäkringen ska gälla från och med ägarbytets datum. Säljarens försäkring upphör att skydda dig i samma stund.

| | |
| --- | --- |
| Typ | P1-VOLATILE, P1-ADMIN |
| Varför i kön | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| Kapitel · delområde | Registreringsbevis · Registrering och avställning |
| Källa och exakt hänvisning | Transportstyrelsen Ägarbyte · Teoribok — Körkortsboken 2026 för B-körkort Hur ägarbyte av fordon går till s. 292 |
| Status | `reviewed` |
| Missuppfattning | Försäkringens startdatum vid ägarbyte |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `8c3a01da` |

#### `drv-002` · Växelval vid sparsam körning

Vilket växelbeteende hör till sparsam körning?

**Rätt svar:** Växla upp tidigt och kör på så hög växel som bilen klarar utan att hacka.

**Förklaring:** Hög växel och lågt varvtal drar mindre. Ettan är stark men törstig — växla upp efter några meter.

| | |
| --- | --- |
| Typ | P1-NUMERIC |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Sparsam körning · Sparsam körning |
| Källa och exakt hänvisning | Trafikverket Sparsam körning · Teoribok — Körkortsboken 2026 för B-körkort Kör på så höga växlar som möjligt s. 312 |
| Status | `reviewed` |
| Missuppfattning | Låg växel antas vara bränslesnål |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `0b0cdbd0` |

#### `drv-007` · Motorvärmare

Ungefär hur länge bör motorvärmaren vara på vid cirka 0 °C?

**Rätt svar:** Omkring en timme före färd.

**Förklaring:** Cirka 30 minuter vid +10 °C, en timme vid 0 °C och omkring 1,5 timme vid −20 °C. Längre än så är bortkastad el.

| | |
| --- | --- |
| Typ | P1-NUMERIC |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Sparsam körning · Sparsam körning |
| Källa och exakt hänvisning | Teoribok — Körkortsboken 2026 för B-körkort Motorvärmare s. 305 |
| Status | `reviewed` |
| Missuppfattning | Motorvärmaren används fel länge |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `53da5202` |

#### `drv-013` · Bensin jämfört med diesel

Vad är sant om diesel jämfört med bensin?

**Rätt svar:** Dieselmotorn förbrukar mindre bränsle, men avgaserna är mer hälsofarliga.

**Förklaring:** Lägre förbrukning, farligare avgaser. Båda är fossila bränslen som bidrar till växthuseffekten.

| | |
| --- | --- |
| Typ | P1-ADMIN, P1-EXCEPTION |
| Varför i kön | Administrativ regel — besiktning, registrering, försäkring, körkort. |
| Kapitel · delområde | Drivmedel · Drivmedel och utsläppsklasser |
| Källa och exakt hänvisning | Teoribok — Körkortsboken 2026 för B-körkort Bensin och diesel s. 318 |
| Status | `reviewed` |
| Missuppfattning | Diesel och bensin jämförs fel |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `c7ba1791` |

#### `drv-014` · Hybridbil

Vad kännetecknar en hybridbil?

**Rätt svar:** Den har två motorer, vanligast el tillsammans med bensin.

**Förklaring:** Två motorer. Elmotorn används på korta sträckor i stan, och bensinmotorn kopplas in när det behövs mer räckvidd eller kraft.

| | |
| --- | --- |
| Typ | P1-ADMIN |
| Varför i kön | Administrativ regel — besiktning, registrering, försäkring, körkort. |
| Kapitel · delområde | Drivmedel · Drivmedel och utsläppsklasser |
| Källa och exakt hänvisning | Teoribok — Körkortsboken 2026 för B-körkort Hybrid s. 318 |
| Status | `reviewed` |
| Missuppfattning | Hybridbilen definieras fel |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `cf223fb1` |

#### `drv-015` · Elbilens miljöpåverkan

Vad är sant om elbilens miljöpåverkan?

**Rätt svar:** Den ger inga hälsofarliga avgaser vid körning, men batteritillverkningen kräver gruvdrift med egna utsläpp.

**Förklaring:** Ingen avgas vid körning, men batteriet kräver stora mängder metaller från gruvor — med utsläpp och ibland dåliga arbetsförhållanden.

| | |
| --- | --- |
| Typ | P1-ADMIN |
| Varför i kön | Administrativ regel — besiktning, registrering, försäkring, körkort. |
| Kapitel · delområde | Drivmedel · Drivmedel och utsläppsklasser |
| Källa och exakt hänvisning | Teoribok — Körkortsboken 2026 för B-körkort El s. 318 · Teoribok — Körkortsboken 2026 för B-körkort Miljözoner s. 319 |
| Status | `reviewed` |
| Missuppfattning | Elbilen antas sakna miljöpåverkan |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `375f814e` |

#### `drv-016` · Miljözoner

Vad gäller i en miljözon klass 1?

**Rätt svar:** Den berör endast tunga fordon. Du får köra där med personbil oavsett drivmedel.

**Förklaring:** Klass 1 gäller tunga fordon. Klass 2 ställer euro-krav på personbilar, och klass 3 släpper i princip bara in el-, bränslecells- och gasfordon.

| | |
| --- | --- |
| Typ | P1-ADMIN |
| Varför i kön | Administrativ regel — besiktning, registrering, försäkring, körkort. |
| Kapitel · delområde | Drivmedel · Drivmedel och utsläppsklasser |
| Källa och exakt hänvisning | Teoribok — Körkortsboken 2026 för B-körkort Miljözoner s. 319 · Teoribok — Körkortsboken 2026 för B-körkort Utsläppsklasser s. 319 |
| Status | `reviewed` |
| Missuppfattning | Miljözonernas klasser blandas ihop |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `cbb663bb` |

### Omgång 14 — Risk, trötthet och olyckor · 19 frågor

#### `ris-006` · Anmälningsplikt vid viltolycka

Du kör på ett rådjur och det springer in i skogen. Vad gäller?

**Rätt svar:** Du måste märka ut olycksplatsen och anmäla händelsen till polisen.

**Förklaring:** Viltolycka ska alltid anmälas till polisen — även om djuret försvann.

| | |
| --- | --- |
| Typ | P1-ADMIN, P1-EXCEPTION |
| Varför i kön | Administrativ regel — besiktning, registrering, försäkring, körkort. |
| Kapitel · delområde | Trafikolyckor · Djur på vägen |
| Källa och exakt hänvisning | Jaktförordningen, anmälningsplikt vid sammanstötning med vilt |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `385ac669` |

#### `ris-008` · Krockvåld och hastighet

Varför är skillnaden mellan 30 och 50 km/h så stor vid en påkörning av en gående?

**Rätt svar:** Krockvåldet växer med hastigheten i kvadrat, så risken att dödas ökar dramatiskt.

**Förklaring:** Rörelseenergin fyrdubblas ungefär när farten går från 30 till 50 km/h.

| | |
| --- | --- |
| Typ | P1-NUMERIC |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Trafikolyckor · Riskbedömning |
| Källa och exakt hänvisning | Trafiksäkerhet: krockvåld och hastighet |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `ae89f730` |

#### `tro-001` · Åtgärd mot trötthet

Du blir trött under en längre körning. Vilken åtgärd fungerar?

**Rätt svar:** Stanna och sova en stund.

**Förklaring:** Det enda som verkligen hjälper mot trötthet är sömn.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-SAFETY |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Trötthet · Trötthet |
| Källa och exakt hänvisning | Trafikmedicin: trötthet och vakenhet |
| Status | `reviewed` |
| Missuppfattning | Trötthet antas gå att köra bort |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `998983af` |

#### `tro-002` · Tecken på trötthet

Vilket är ett tidigt varningstecken på att du är för trött för att köra?

**Rätt svar:** Du minns inte de senaste kilometrarna du kört.

**Förklaring:** Minnesluckor under körningen är ett tydligt tecken på mikrosömn.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-SAFETY |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Trötthet · Trötthet |
| Källa och exakt hänvisning | Trafikmedicin: trötthet och vakenhet |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `82534ebc` |

#### `tro-005` · Känslor och körning

Du är arg efter ett bråk och ska köra hem. Vad är rimligast?

**Rätt svar:** Vänta några minuter och lugna ner dig innan du kör.

**Förklaring:** Starka känslor försämrar omdömet. Vänta tills du landat.

| | |
| --- | --- |
| Typ | P1-ADMIN |
| Varför i kön | Administrativ regel — besiktning, registrering, försäkring, körkort. |
| Kapitel · delområde | Inlärning & mognad · Stress och känslor |
| Källa och exakt hänvisning | Trafikpsykologi: känslor och risktagande |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `78e4afec` |

#### `man-002` · Reaktionssträcka i praktiken

Du kör i 90 km/h och har en reaktionstid på ungefär en sekund. Hur lång blir reaktionssträckan?

**Rätt svar:** Cirka 25 meter.

**Förklaring:** 90 km/h är 25 m/s. På en sekunds reaktionstid hinner du 25 meter.

| | |
| --- | --- |
| Typ | P1-NUMERIC |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Synen · Reaktion och sinnen |
| Källa och exakt hänvisning | Fysik: hastighet, tid och sträcka |
| Status | `reviewed` |
| Missuppfattning | Reaktionssträcka vs bromssträcka |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `30c8876e` |

#### `man-003` · Faktorer som förlänger reaktionstiden

Vad förlänger din reaktionstid mest?

**Rätt svar:** Att du är trött, påverkad eller uppmärksam på något annat än trafiken.

**Förklaring:** Trötthet, påverkan och delad uppmärksamhet är de stora förlängarna.

| | |
| --- | --- |
| Typ | P1-NUMERIC |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Synen · Reaktion och sinnen |
| Källa och exakt hänvisning | Trafikpsykologi: reaktionstid |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `69e65fb4` |

#### `man-004` · Mobiltelefon under körning

Vad gäller för mobiltelefon under körning?

**Rätt svar:** Du får inte hålla telefonen i handen medan du kör.

**Förklaring:** Det är förbjudet att hålla mobiltelefonen i handen under körning.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-LAW |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Synen · Reaktion och sinnen |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 4 kap. 10 e § |
| Status | `reviewed` |
| Missuppfattning | — |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `b43a42ab` |

#### `ned-004` · Ålder och olycksrisk

Vad gäller för åldersgruppen 65–74 år som bilförare?

**Rätt svar:** De kör i regel säkrare än nyblivna 18-åriga förare, tack vare mognad och trafikvana.

**Förklaring:** Gruppen 65–74 år har stor trafikvana och kör säkrare än de allra yngsta förarna. Först över 75 år stiger risken märkbart.

| | |
| --- | --- |
| Typ | P1-NUMERIC |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Nedsatt förmåga · Nedsatt förmåga och samspel |
| Källa och exakt hänvisning | Teoribok — Körkortsboken 2026 för B-körkort Äldre i trafiken s. 163 |
| Status | `reviewed` |
| Missuppfattning | Alla äldre förare antas vara en riskgrupp |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `c1208d4c` |

#### `ber-002` · Reaktionssträcka vid längre reaktionstid

Du kör i 50 km/h. Trötthet gör att din reaktionstid är 2 sekunder i stället för 1. Hur mycket längre blir reaktionssträckan?

**Rätt svar:** Den fördubblas, från cirka 15 till cirka 30 meter.

**Förklaring:** Reaktionssträckan växer rakt av med reaktionstiden: 5 × 1 × 3 = 15 m, och 5 × 2 × 3 = 30 m.

| | |
| --- | --- |
| Typ | P1-NUMERIC |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Synen · Reaktion och sinnen |
| Källa och exakt hänvisning | Trafikverket · Teoribok — Körkortsboken 2026 för B-körkort Reaktionssträckan kan bli längre av s. 196 |
| Status | `reviewed` |
| Missuppfattning | Reaktionstidens effekt missförstås |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `1955bde3` |

#### `ber-003` · Bromssträcka på torr asfalt

Du kör i 50 km/h på torr asfalt med bra däck och bromsar. Ungefär hur lång blir bromssträckan?

**Rätt svar:** Cirka 10 meter.

**Förklaring:** Stryk sista siffran: 50 → 5. Sedan 5 × 5 = 25, och 25 × 0,4 = 10 meter.

| | |
| --- | --- |
| Typ | P1-NUMERIC |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Synen · Reaktion och sinnen |
| Källa och exakt hänvisning | Trafikverket · Teoribok — Körkortsboken 2026 för B-körkort Räkna ut bromssträckan s. 199 |
| Status | `reviewed` |
| Missuppfattning | Bromssträckan räknas fel |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `7e721f77` |

#### `ber-004` · Stoppsträcka

Sommar, torr väg, bra däck och bromsar. Du kör i 90 km/h med reaktionstiden 1 sekund. Ungefär hur lång blir stoppsträckan?

**Rätt svar:** Cirka 59 meter.

**Förklaring:** Reaktionssträcka: 9 × 1 × 3 = 27 m. Bromssträcka: 9 × 9 × 0,4 = 32 m. Stoppsträcka: 27 + 32 = 59 meter.

| | |
| --- | --- |
| Typ | P1-NUMERIC |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Synen · Reaktion och sinnen |
| Källa och exakt hänvisning | Trafikverket · Teoribok — Körkortsboken 2026 för B-körkort Räkna ut stoppsträckan s. 200 |
| Status | `reviewed` |
| Missuppfattning | Bara en av delsträckorna räknas |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `7b437fd2` |

#### `bl2-015` · Stillastående buss

Bussen står vid hållplatsen längre fram. Vilken risk är störst?

**Rätt svar:** Att en person kliver ut i vägbanan framför bussen, dold av den.

**Förklaring:** Den som kliver av bussen ser inte dig, och du ser inte dem. Sänk farten och håll så stort sidoavstånd som utrymmet tillåter.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-LAW |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Inledning · Skymd sikt |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 3 kap. 25 § · Teoribok — Körkortsboken 2026 för B-körkort Barn s. 169 |
| Status | `reviewed` |
| Missuppfattning | Risken vid en stillastående buss missbedöms |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `a997402c` |

#### `grd-004` · Bältesanvändning

Vem ansvarar för att du som vuxen passagerare använder bilbälte?

**Rätt svar:** Du själv, från 15 års ålder.

**Förklaring:** Från 15 år ansvarar passageraren själv. Föraren ansvarar för att passagerare under 15 år använder bälte.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-LAW |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Inledning · Grundläggande bestämmelser |
| Källa och exakt hänvisning | Trafikförordningen (1998:1276) 4 kap. 10 § · Teoribok — Körkortsboken 2026 för B-körkort Säkerhetsbälte s. 232 |
| Status | `reviewed` |
| Missuppfattning | Ansvaret för barns bältesanvändning |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `55a33577` |

#### `mns-006` · Unga förares riskökning

Varför ökar risktagandet hos många unga förare några år *efter* att de tagit körkort?

**Rätt svar:** Körvanan gör dem säkrare på sig själva, och den ökade självsäkerheten kommer före den faktiska erfarenheten.

**Förklaring:** Överskattning av den egna förmågan är en av huvudorsakerna till att unga förare är överrepresenterade. Den växer med upplevd, inte faktisk, skicklighet.

| | |
| --- | --- |
| Typ | P1-ADMIN |
| Varför i kön | Administrativ regel — besiktning, registrering, försäkring, körkort. |
| Kapitel · delområde | Inlärning & mognad · Attityd och grupptryck |
| Källa och exakt hänvisning | Teoribok — Körkortsboken 2026 för B-körkort Unga bilförare s. 133 |
| Status | `reviewed` |
| Missuppfattning | Risken antas sjunka direkt med erfarenhet |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `07679026` |

#### `mns-027` · Mikrosömn

Du kör på motorväg och "tappar" plötsligt några sekunder utan att minnas vägen. Vad har troligen hänt?

**Rätt svar:** Mikrosömn — hjärnan har kopplat bort under några sekunder utan att du märkt det.

**Förklaring:** Mikrosömn varar några sekunder. I 110 km/h är fem sekunder drygt 150 meter körda utan förare.

| | |
| --- | --- |
| Typ | P1-NUMERIC, P1-SAFETY |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Trötthet · Trötthet |
| Källa och exakt hänvisning | Teoribok — Körkortsboken 2026 för B-körkort Faror & risker s. 150 |
| Status | `reviewed` |
| Missuppfattning | Mikrosömn tolkas som ouppmärksamhet |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `2e5c540d` |

#### `mns-034` · Undanmanöver vid älg

En älg har börjat gå över vägen framför dig och du måste välja åt vilket håll du väjer. Vad är bäst?

**Rätt svar:** Styra bakom älgen — den fortsätter sannolikt åt det håll den redan går.

**Förklaring:** En älg som börjat gå över fortsätter oftast över. Sikta bakom den.

| | |
| --- | --- |
| Typ | P1-NUMERIC |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Trafikolyckor · Djur på vägen |
| Källa och exakt hänvisning | Teoribok — Körkortsboken 2026 för B-körkort Älgolyckor s. 177 |
| Status | `reviewed` |
| Missuppfattning | Fel undanmanöver vid älg |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `8c82d034` |

#### `mns-035` · Efter en viltolycka

Du har kört på ett rådjur som skadats och sprungit in i skogen. Vad är du skyldig att göra?

**Rätt svar:** Märka ut olycksplatsen och kontakta polisen.

**Förklaring:** Markeringen gör att jägare kan spåra det skadade djuret. Kontakt med polisen är obligatorisk vid större vilt.

| | |
| --- | --- |
| Typ | P1-ADMIN |
| Varför i kön | Administrativ regel — besiktning, registrering, försäkring, körkort. |
| Kapitel · delområde | Trafikolyckor · Djur på vägen |
| Källa och exakt hänvisning | Teoribok — Körkortsboken 2026 för B-körkort Att göra om du kör på ett större djur s. 177 |
| Status | `reviewed` |
| Missuppfattning | Skyldigheterna efter en viltolycka |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `4bae24c1` |

#### `mns-040` · Blicktid och sträcka

Du tittar ner på navigationen i två sekunder i 90 km/h. Ungefär hur långt kör du under tiden?

**Rätt svar:** Ungefär 50 meter.

**Förklaring:** 90 km/h är 25 meter i sekunden. Två sekunders blick nedåt är alltså femtio meter körda utan att du sett vägen.

| | |
| --- | --- |
| Typ | P1-NUMERIC |
| Varför i kön | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| Kapitel · delområde | Synen · Reaktion och sinnen |
| Källa och exakt hänvisning | Trafikverket · Teoribok — Körkortsboken 2026 för B-körkort Km/h omräknat till meter per sekund s. 103 |
| Status | `reviewed` |
| Missuppfattning | Blicktid räknas inte om till sträcka |
| Att fylla i vid signering | verifiedBy · verifiedAt · verificationSourceIds · verifiedFingerprint `b90a3b33` |

## P2 — 64 frågor

| Fråga | Delområde | Regel |
| --- | --- | --- |
| `tra-002` | Trafiksignaler och tecken | Signalbilder |
| `bel-005` | Dimma | Helljus i dimma |
| `vaj-001` | Polisens tecken | Rangordning: signal före vägmärke |
| `vaj-007` | Trafiksignal i korsning | Släckt pil vid rund grön signal |
| `vaj-008` | Trafiksignal i korsning | Grön pil |
| `vaj-009` | Motortrafikled | Regler på motortrafikled |
| `vag-008` | Vägmarkeringar | Heldragen linje |
| `has-007` | Placering i körfält | Placering på flerfilig väg |
| `kor-002` | Utfartsregeln | Utfartsregeln |
| `kor-003` | Utfartsregeln | Utfartsregeln |
| `kor-011` | Trafiksignal i korsning | Gult ljus |
| `cir-003` | Körfält och tecken i cirkulation | Tecken vid utfart ur cirkulationsplats |
| `cir-005` | Körfält och tecken i cirkulation | Vänsterblinkning i cirkulationsplats |
| `cir-007` | Körfält och tecken i cirkulation | Körfältsbyte inne i cirkulationsplats |
| `jvg-009` | Att korsa en plankorsning | Motorstopp på spåret |
| `jvg-013` | Omkörning vid plankorsning | Omkörningsförbud vid plankorsning |
| `jvg-014` | Omkörning vid plankorsning | Vilken signal som upphäver omkörningsförbudet |
| `pas-001` | Gående och cyklister | Att visa sin avsikt att väja |
| `pas-006` | Gående och cyklister | Att korsa en gångbana |
| `pas-007` | Gående och cyklister | Gångbana som inte korsar vägen |
| `pas-010` | Cykelpassage och cykelöverfart | Cyklistens skyldighet vid cykelpassage |
| `pas-011` | Cykelpassage och cykelöverfart | Cykelöverfart |
| `pas-012` | Cykelpassage och cykelöverfart | Vilka väjningsplikten vid cykelöverfart omfattar |
| `pas-015` | Cykelpassage och cykelöverfart | Att korsa en cykelbana |
| `omk-002` | Omkörningsregler | Omkörning till höger |
| `omk-004` | Förbud mot omkörning | Omkörning före korsning |
| `alk-007` | Droger och läkemedel | Nolltolerans mot narkotika |
| `man-006` | Attityd och grupptryck | Grupptryck |
| `krf-002` | Placering i körfält | Placering i körfältet |
| `krf-005` | Körfält och sväng | Sväng på enkelriktad väg |
| `krf-009` | Körfältsbyte | Heldragen linje vid körfältsbyte |
| `krf-012` | Körfältsbyte | Kollektivkörfält |
| `krf-014` | Körfältsbyte | Tecken vid körfältsbyte |
| `drv-010` | Miljöpåverkan | Kolmonoxid |
| `ber-009` | Reaktion och sinnen | Vad reaktionstiden beror på |
| `ber-010` | Reaktion och sinnen | Vad som påverkar bromssträckan |
| `rtp-003` | Rättsfall och praxis | Hastighet som bedömningsgrund |
| `bld-002` | Stopplikt | Tilläggstavlan Flervägsstopp |
| `bld-009` | Cykelpassage och cykelöverfart | Övergångsställe kombinerat med cykelpassage |
| `bld-014` | Omkörning vid plankorsning | Omkörning vid plankorsning med bommar |
| `vmk-009` | Förbudsmärken | Förbud mot att parkera (C35) |
| `vmk-010` | Förbudsmärken | Förbud mot att stanna och parkera (C39) |
| `vmk-014` | Förbudsmärken | Förbud mot omkörning (C27) |
| `vmk-017` | Påbudsmärken | Påbjuden cykelbana (D4) |
| `vmk-018` | Påbudsmärken | Kollektivkörfält (D10) |
| `vmk-025` | Anvisningsmärken | Tidsangivelse på tilläggstavla (T6) |
| `vmk-026` | Anvisningsmärken | Parentestider på tilläggstavla |
| `vmk-027` | Anvisningsmärken | Tilläggstavlan Boende (T19) |
| `vmk-033` | Varningsmärken | Järnvägskorsning med eller utan bommar |
| `bl2-005` | Omkörning vid plankorsning | Bommar och omkörningsförbud |
| `bl2-006` | Anvisningsmärken | Gågata |
| `bl3-005` | Cykelpassage och cykelöverfart | Huvudled och cykelpassage |
| `bl4-005` | Krocksäkerhet | Passagerarkrockkudde och bakåtvänd stol |
| `egr-004` | Krocksäkerhet | Nackskyddets höjd |
| `grd-007` | Ljusanvändning | Halvljus |
| `grd-008` | Vägens användning | Fri väg för utryckningsfordon |
| `grd-011` | Gående och cyklister | Väjningsplikt vid obevakat övergångsställe |
| `mns-008` | Attityd och grupptryck | Positivt grupptryck |
| `mns-021` | Droger och läkemedel | Nolltolerans mot narkotika |
| `mns-022` | Droger och läkemedel | Vakenhetshöjande droger |
| `mns-029` | Barn och oskyddade | Barns riskbedömning |
| `mrk-008` | Vägmarkeringar | Väjningslinje (M14) |
| `mrk-011` | Körfält och sväng | Körfältspilar (M19) |
| `mrk-012` | Körfältsbyte | Bussymbol i körfältet (M28) |

## P3 — 247 frågor

| Fråga | Delområde | Regel |
| --- | --- | --- |
| `tra-001` | Grundläggande bestämmelser | Allmän aktsamhetsplikt |
| `tra-003` | Gående och cyklister | Obevakat övergångsställe |
| `tra-004` | Gående och cyklister | Cykelöverfart och cykelpassage |
| `tra-005` | Vägens användning | Grundregel för placering |
| `tra-006` | Körfält och sväng | Placering före sväng |
| `tra-007` | Trafiksignaler och tecken | Utryckningsfordon |
| `tra-008` | Grundläggande bestämmelser | Tecken |
| `tra-010` | Körfält och sväng | Körfältsbyte |
| `bel-001` | Belysning | Varselljus |
| `bel-002` | Belysning | Kombination av ljus |
| `bel-003` | Belysning | Främre dimljus |
| `bel-004` | Belysning | Dimbakljus |
| `bel-007` | Möte i mörker | Avbländning vid möte |
| `bel-008` | Möte i mörker | Avbländning vid omkörning |
| `bel-009` | Möte i mörker | Möte med lastbil i backkrön |
| `bel-010` | Möte i mörker | Helljus vid korsning i mörker |
| `bel-011` | Möte i mörker | Blickpunkt vid bländning |
| `vaj-002` | Polisens tecken | Rangordning när signalen är ur funktion |
| `vaj-003` | Huvudled | Var huvudledsmärket sitter |
| `vaj-004` | Huvudled | När huvudleden upphör |
| `vaj-005` | Utfartsregeln | När utfartsregeln inte gäller |
| `vaj-006` | Utfartsregeln | Platser som utlöser utfartsregeln |
| `vaj-010` | Motortrafikled | Mötesfri väg som inte är motortrafikled |
| `vaj-011` | Möte | Bedöma mötande fordon |
| `vaj-012` | Möte | Skyldighet vid otillåten omkörning |
| `vaj-013` | Regn och vattenplaning | Däckbredd och vattenplaning |
| `vaj-014` | Regn och vattenplaning | Ratten vid vattenplaning |
| `vaj-015` | Regn och vattenplaning | Moddplaning |
| `vag-001` | Varningsmärken | Varningsmärkens form och färg |
| `vag-002` | Varningsmärken | Varningsmärkets innebörd |
| `vag-004` | Förbudsmärken | Förbud mot infart |
| `vag-005` | Påbudsmärken | Påbudsmärken |
| `vag-009` | Vägmarkeringar | Spärrområde |
| `vag-011` | Anvisningsmärken | Väjningsplikt |
| `kor-001` | Högerregeln | Högerregeln |
| `kor-004` | Stopplikt | Stopplikt |
| `kor-005` | Cirkulationsplats | Cirkulationsplats |
| `kor-006` | Cirkulationsplats | Tecken i cirkulationsplats |
| `kor-007` | Huvudled | Huvudled |
| `kor-009` | Väjningsplikt | Väjningsplikt i praktiken |
| `kor-010` | Väjningsplikt | Blinkers som avsikt |
| `kor-012` | Trafiksignal i korsning | Grön signal och väjningsplikt |
| `kor-013` | Polisens tecken | Rangordning mellan tecken |
| `kor-014` | Högerregeln | Högerregeln i praktiken |
| `kor-015` | Väjningsplikt | Blockerad korsning |
| `kor-016` | Stopplikt | Stopplinje |
| `cir-001` | Cirkulationsplats | Väjningsplikt vid infart i cirkulationsplats |
| `cir-002` | Cirkulationsplats | Körriktning i cirkulationsplats |
| `cir-004` | Körfält och tecken i cirkulation | Tecken vid infart i cirkulationsplats |
| `cir-006` | Körfält och tecken i cirkulation | Körfältsval i cirkulationsplats |
| `cir-008` | Cirkulationsplats | Cirkelformad korsning som inte är cirkulationsplats |
| `cir-009` | Cirkulationsplats | Oskyddade trafikanter vid cirkulationsplats |
| `cir-010` | Cirkulationsplats | Varför cirkulationsplatser byggs |
| `cir-011` | Körfält och tecken i cirkulation | Att underlätta andras körfältsbyten |
| `cir-012` | Cirkulationsplats | Huvudled och cirkulationsplats |
| `jvg-001` | Märken och signaler | Avstånd till plankorsning (A38) |
| `jvg-002` | Märken och signaler | Ljussignal vid plankorsning |
| `jvg-003` | Märken och signaler | Helbom och halvbom |
| `jvg-004` | Märken och signaler | Plankorsning utan bommar |
| `jvg-005` | Att korsa en plankorsning | Anpassning efter sikt vid plankorsning |
| `jvg-006` | Att korsa en plankorsning | Växelval vid plankorsning |
| `jvg-007` | Att korsa en plankorsning | Köbildning vid plankorsning |
| `jvg-008` | Att korsa en plankorsning | Motorstopp på spåret |
| `jvg-011` | Att korsa en plankorsning | Efter plankorsningen |
| `jvg-012` | Att korsa en plankorsning | Långsamma fordon vid plankorsning |
| `jvg-015` | Omkörning vid plankorsning | Omkörning vid plankorsning med bommar |
| `pas-002` | Gående och cyklister | Bevakat övergångsställe |
| `pas-003` | Gående och cyklister | Bevakat eller obevakat övergångsställe |
| `pas-004` | Gående och cyklister | Vem som räknas som gående |
| `pas-005` | Gående och cyklister | Att vinka fram gående |
| `pas-008` | Cykelpassage och cykelöverfart | Obevakad cykelpassage |
| `pas-009` | Cykelpassage och cykelöverfart | Cykelpassage i samband med sväng |
| `pas-014` | Cykelpassage och cykelöverfart | Att skilja passage från överfart |
| `pas-016` | Cykelpassage och cykelöverfart | Bevakad cykelpassage |
| `par-002` | Förbud att stanna | Tiometersregeln |
| `par-003` | Förbud att stanna | Stannande i korsning |
| `par-006` | Förbud att stanna | Förbud att stanna och parkera |
| `mot-003` | Regler på motorväg | Vägren på motorväg |
| `mot-005` | Påfart och avfart | Avfart från motorväg |
| `mot-008` | Landsväg | Mötesfri landsväg |
| `mot-009` | Regler på motorväg | Körfältsval på motorväg |
| `mot-010` | Landsväg | Landsvägens risker |
| `omk-001` | Omkörningsregler | Omkörningens huvudregel |
| `omk-003` | Förbud mot omkörning | Omkörning vid övergångsställe |
| `omk-006` | Möte | Möte på smal väg |
| `omk-007` | Omkörningsregler | Att bli omkörd |
| `omk-008` | Förbud mot omkörning | Sikt vid omkörning |
| `ris-001` | Riskbedömning | Riskbedömningens grunder |
| `ris-002` | Skymd sikt | Hastighet vid skymd sikt |
| `ris-003` | Riskbedömning | Varningstriangel |
| `ris-004` | Barn och oskyddade | Barn i trafiken |
| `ris-005` | Djur på vägen | Viltolycka |
| `ris-007` | Skymd sikt | Parkerade bilar som risk |
| `ris-010` | Riskbedömning | Flyktväg |
| `alk-006` | Droger och läkemedel | Läkemedel och körning |
| `tro-003` | Trötthet | Trötthetens riskperioder |
| `tro-004` | Stress och känslor | Stress i trafiken |
| `tro-006` | Trötthet | Trötthet jämfört med alkohol |
| `mor-002` | Ljusanvändning | Halvljus |
| `mor-003` | Möte i mörker | Bländning vid möte |
| `mor-004` | Ljusanvändning | Helljus |
| `mor-006` | Mörkerkörning | Avståndsbedömning i mörker |
| `mor-007` | Ljusanvändning | Dimljus |
| `mor-008` | Möte i mörker | Mötet i mörker |
| `hal-001` | Regn och vattenplaning | Åtgärd vid vattenplaning |
| `hal-002` | Regn och vattenplaning | Risk för vattenplaning |
| `hal-003` | Halka | Bromssträcka vid halka |
| `hal-004` | Halka | Var halkan uppstår först |
| `hal-005` | Vinterkörning | Vinterdäcksperiod |
| `hal-006` | Vinterkörning | Körteknik på halt underlag |
| `hal-007` | Halka | Underkylt regn |
| `hal-008` | Dimma | Körning i dimma |
| `mil-001` | Sparsam körning | Sparsam körning |
| `mil-003` | Sparsam körning | Kallstart |
| `mil-004` | Miljöpåverkan | Avgasers påverkan |
| `mil-005` | Miljöpåverkan | Partiklar och dubbdäck |
| `for-007` | Belysning | Varningsblinkers |
| `man-001` | Reaktion och sinnen | Stoppsträckans delar |
| `man-005` | Reaktion och sinnen | Synens roll |
| `man-007` | Attityd och grupptryck | Överskattning av egen förmåga |
| `man-008` | Körstrategi | Blickteknik |
| `man-009` | Körstrategi | Uppmärksamhetens gränser |
| `ned-001` | Nedsatt förmåga och samspel | Signaler med vit käpp |
| `ned-002` | Nedsatt förmåga och samspel | Att släppa över en synskadad |
| `ned-003` | Nedsatt förmåga och samspel | Ledarhund |
| `ned-005` | Nedsatt förmåga och samspel | Dolda funktionsnedsättningar |
| `ned-006` | Nedsatt förmåga och samspel | Tilläggstavla nedsatt syn |
| `ned-007` | Nedsatt förmåga och samspel | Särskild hänsyn mot barn |
| `rtp-001` | Rättsfall och praxis | Aktsamhetsplikten framför formell rätt |
| `rtp-002` | Rättsfall och praxis | Bevisning och eget ansvar |
| `krf-001` | Körfält och sväng | Definitionen av körfält |
| `krf-003` | Placering i körfält | Placering vid god sikt framåt men skymd sikt åt sidorna |
| `krf-004` | Körfält och sväng | Placering vid sväng |
| `krf-008` | Körfältsbyte | Kontroller före körfältsbyte |
| `krf-010` | Körfältsbyte | Upprepade körfältsbyten i tät trafik |
| `krf-011` | Körfältsbyte | Hastighet vid körfältsbyte |
| `krf-013` | Körfältsbyte | Reversibelt körfält |
| `krk-001` | Krocksäkerhet | Deformationszoner |
| `krk-002` | Krocksäkerhet | Sidokollisionens särskilda risk |
| `krk-004` | Krocksäkerhet | Bältets placering |
| `krk-005` | Krocksäkerhet | Krockkudde och bakåtvänd bilbarnstol |
| `krk-007` | Krocksäkerhet | Nackskydd och whiplash |
| `drv-001` | Sparsam körning | Motorbromsning och bränsleförbrukning |
| `drv-003` | Sparsam körning | Acceleration vid sparsam körning |
| `drv-004` | Sparsam körning | Sparsam körning kontra trafiksäkerhet |
| `drv-005` | Sparsam körning | Takbox och luftmotstånd |
| `drv-006` | Sparsam körning | Däcktryck och förbrukning |
| `drv-008` | Sparsam körning | Luftkonditionering och förbrukning |
| `drv-009` | Miljöpåverkan | Katalysatorns funktion |
| `drv-011` | Miljöpåverkan | Koldioxid och växthuseffekten |
| `drv-012` | Miljöpåverkan | Biltvätt |
| `bld-003` | Stopplikt | Stopplikt i praktiken |
| `bld-004` | Högerregeln | Att läsa av en korsning |
| `bld-005` | Väjningsplikt | Tunga fordon i korsning |
| `bld-006` | Gående och cyklister | Obevakat övergångsställe |
| `bld-008` | Cykelpassage och cykelöverfart | Bruten cykelbana |
| `bld-010` | Cirkulationsplats | Väjningsplikt vid infart |
| `bld-011` | Cirkulationsplats | Cirkelformad korsning som inte är cirkulationsplats |
| `bld-016` | Omkörningsregler | Omkörningsbeslut på vinterväg |
| `vmk-001` | Varningsmärken | Varningsmärkenas form och färg |
| `vmk-002` | Förbudsmärken | Förbudsmärkenas form |
| `vmk-003` | Påbudsmärken | Påbudsmärkenas innebörd |
| `vmk-004` | Varningsmärken | Väjningsplikt (B1) |
| `vmk-005` | Varningsmärken | Huvudled (B4) |
| `vmk-006` | Varningsmärken | Huvudled upphör (B5) |
| `vmk-007` | Varningsmärken | Stopplikt kontra väjningsplikt |
| `vmk-008` | Varningsmärken | Flervägsstopp (T14) |
| `vmk-011` | Förbudsmärken | Förbud mot infart (C1) |
| `vmk-015` | Förbudsmärken | Slut på förbud mot omkörning (C28) |
| `vmk-016` | Påbudsmärken | Cirkulationsplats (D3) |
| `vmk-020` | Anvisningsmärken | Motorväg upphör (E2) |
| `vmk-028` | Anvisningsmärken | Avstånd kontra utsträckning |
| `vmk-029` | Anvisningsmärken | Tilläggstavlan Riktning (T12) |
| `vmk-030` | Varningsmärken | Varning för vägkorsning (A28) |
| `vmk-031` | Varningsmärken | Varning för barn (A15) |
| `vmk-032` | Varningsmärken | Varning för slirig väg (A10) |
| `vmk-034` | Vägmarkeringar | Heldragen linje |
| `vmk-035` | Vägmarkeringar | Stopplinje |
| `vmk-036` | Vägmarkeringar | Väjningslinje |
| `vmk-037` | Varningsmärken | Rangordning av anvisningar |
| `vmk-038` | Varningsmärken | Vägmärke före generell regel |
| `bl2-002` | Påfart och avfart | Hastighet på avfart |
| `bl2-003` | Anvisningsmärken | Grön och blå vägvisning |
| `bl2-004` | Märken och signaler | Kryssmärke vid plankorsning |
| `bl2-007` | Påbudsmärken | Påbjuden körriktning |
| `bl2-008` | Anvisningsmärken | Körfältsvägvisare |
| `bl2-009` | Regler på motorväg | Stillastående fordon på vägrenen |
| `bl2-010` | Påfart och avfart | Sammanvävning |
| `bl2-012` | Omkörningsregler | Omkörning på vinterväg |
| `bl2-013` | Landsväg | Vägkantens bärighet |
| `bl2-014` | Körfält och sväng | Tillfälliga anvisningar vid vägarbete |
| `bl2-016` | Regler på motorväg | Körfältsval på motorväg |
| `bl2-017` | Vinterkörning | Snötäckt vägbana |
| `bl2-018` | Landsväg | Kantlinjens betydelse |
| `bl3-001` | Skymd sikt | Sidoavstånd till cyklist |
| `bl3-002` | Barn och oskyddade | Stannade bussar skymmer |
| `bl3-003` | Skymd sikt | Enfilig passage med skymd utfart |
| `bl3-004` | Vinterkörning | Väglag i solsken |
| `bl3-006` | Skymd sikt | Luckor mellan parkerade fordon |
| `bl3-007` | Vägens användning | Kryssmärke vid spårväg |
| `bl3-008` | Polisens tecken | Signal före vägmärke |
| `bl4-003` | Möte i mörker | När helljuset ska tillbaka |
| `bl4-004` | Möte i mörker | Avbländning i kurva |
| `egr-003` | Regn och vattenplaning | Att hantera vattenplaning |
| `egr-005` | Krocksäkerhet | Bältets placering över kroppen |
| `grd-001` | Högerregeln | Högerregeln |
| `grd-002` | Trafiksignaler och tecken | Gult ljus |
| `grd-005` | Vägmarkeringar | Mittlinje och kantlinje |
| `grd-009` | Grundläggande bestämmelser | Aktsamhetsplikten |
| `grd-012` | Regler på motorväg | Förbjudet på motorväg |
| `grd-013` | Anvisningsmärken | Parkeringsmärket |
| `grd-014` | Trötthet | Åtgärd mot trötthet |
| `mns-001` | Körstrategi | Överinlärning |
| `mns-002` | Körstrategi | Ytinlärning |
| `mns-003` | Körstrategi | Sannolikhetsinlärning |
| `mns-004` | Körstrategi | Imitationsinlärning |
| `mns-005` | Attityd och grupptryck | Mognadsgrader hos förare |
| `mns-007` | Attityd och grupptryck | Negativt grupptryck |
| `mns-009` | Körstrategi | Att frångå reglerna med gott omdöme |
| `mns-010` | Stress och känslor | Stressnivå och prestation |
| `mns-011` | Stress och känslor | Följder av hög stress |
| `mns-012` | Stress och känslor | Att minska stress |
| `mns-013` | Stress och känslor | Känslor och körning |
| `mns-020` | Droger och läkemedel | Ansvar för läkemedelspåverkan |
| `mns-024` | Trötthet | Sömnbrist jämfört med alkohol |
| `mns-025` | Trötthet | Monotoni som trötthetsorsak |
| `mns-026` | Trötthet | Trötthetssignaler |
| `mns-028` | Barn och oskyddade | Barns sinnen |
| `mns-030` | Barn och oskyddade | Barn bakom parkerade fordon |
| `mns-031` | Barn och oskyddade | Ögonkontakt med barn |
| `mns-032` | Barn och oskyddade | Barn vid bussar |
| `mns-033` | Djur på vägen | När viltrisken är störst |
| `mns-036` | Riskbedömning | Riskkompensation |
| `mns-037` | Riskbedömning | Tillbud som felaktig bekräftelse |
| `mns-038` | Riskbedömning | Rutin och uppmärksamhet |
| `mns-039` | Reaktion och sinnen | Mobiltelefon och uppmärksamhet |
| `mrk-001` | Vägmarkeringar | Mittlinje (M1) |
| `mrk-002` | Vägmarkeringar | Varningslinje (M3) |
| `mrk-003` | Vägmarkeringar | Mittlinje kontra varningslinje |
| `mrk-004` | Vägmarkeringar | Kombinerad linje (M10) |
| `mrk-005` | Vägmarkeringar | Kantlinje (M2) |
| `mrk-006` | Vägmarkeringar | Spärrområde (M9) |
| `mrk-007` | Vägmarkeringar | Stopplinje (M13) |
| `mrk-009` | Cykelpassage och cykelöverfart | Rutmarkering utan vägmärke |
| `mrk-010` | Vägmarkeringar | Övergångsställe kontra cykelpassage |
| `mrk-013` | Vägmarkeringar | Markering kontra vägmärke |
| `mrk-014` | Vägmarkeringar | Ledlinje (M4) |
