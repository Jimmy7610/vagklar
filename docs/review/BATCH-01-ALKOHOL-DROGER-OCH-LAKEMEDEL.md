# Granskningsblad — omgång 01: Alkohol, droger och läkemedel

GENERERAD — kör `npm run worksheet -- 01`. Redigera inte för hand.

19 frågor. Alla har status `reviewed`. Ingen är verifierad, och
ingenting i det här förvaret får ändra på det — bara en människa som faktiskt
kontrollerat påståendet mot källan.

## Så använder du bladet

En fråga i taget. Öppna källan i kolumnen, läs vad den säger, och fyll i beslutet.

| Beslut | Vad du gör i banken |
| --- | --- |
| **GODKÄNN** | `status: 'verified'` plus `verifiedBy`, `verifiedAt`, `verificationSourceIds`, `verifiedFingerprint` (avtrycket nedan) och gärna `verifiedAgainstEditions`. Validatorn kräver alla utom den sista. |
| **AVVISA** | `status: 'rejected'` plus `reviewNotes` (skälet), `reviewedBy` och `lastReviewedAt`. Frågan tas ur banken men skälet finns kvar. |
| **BEHÖVER ÄNDRAS** | Låt statusen vara `reviewed`. Skriv `reviewNotes`, `reviewedBy` och `lastReviewedAt`. Ingen verifiering sätts. |

Ändras texten efter ett godkännande stämmer inte avtrycket längre, och
validatorn säger till. Det är meningen: en signatur gäller den formulering
som lästes, inte frågan som idé.

## Källor att ha uppslagna

| Källa | Länk |
| --- | --- |
| 1177 Vårdguiden | <https://www.1177.se/liv--halsa/tobak-och-alkohol/alkohol/sa-paverkas-kroppen-av-alkohol/> |
| Brottsbalk (1962:700) | <https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/brottsbalk-1962700_sfs-1962-700/> |
| Körkortslagen (1998:488) | <https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/korkortslag-1998488_sfs-1998-488/> |
| Lag (1951:649) om straff för vissa trafikbrott | <https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-1951649-om-straff-for-vissa-trafikbrott_sfs-1951-649/> |
| Läkemedelsverket | <https://www.lakemedelsverket.se> |
| Polismyndigheten | <https://polisen.se/lagar-och-regler/trafik-och-fordon/ratt--och-sjofylleri/> |
| Teoribok — Körkortsboken 2026 för B-körkort | <https://korkortonline.se> |

## Frågor

### `alk-001` — Promillegräns

**Fråga:** Vid vilken alkoholhalt i blodet döms man för rattfylleri i Sverige?

- **RÄTT**: 0,2 promille eller mer.
- fel: 0,8 promille eller mer.
- fel: 0,5 promille eller mer.
- fel: 1,0 promille eller mer.

**Kort förklaring:** Gränsen för rattfylleri går vid 0,2 promille i blodet, eller 0,10 milligram per liter i utandningsluften.

**Fördjupning:** Utandningsprovet är det du möter vid en kontroll, och gränsen där är 0,10 milligram per liter. Vid 1,0 promille eller mer rubriceras brottet normalt som grovt, liksom när körningen inneburit en påtaglig fara även vid lägre halt. Straffskalan går från böter till fängelse. Körkortet återkallas som huvudregel — men understiger halten 0,5 promille kan en varning räcka om det finns särskilda skäl.

| | |
| --- | --- |
| Kapitel · delområde | alkohol · alkohol-gransvarden |
| Svårighet | 1 |
| Varför P1 | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| P1-typer | P1-NUMERIC, P1-VOLATILE, P1-LAW, P1-SAFETY |
| Källhänvisning | Lag (1951:649) om straff för vissa trafikbrott 4 § · Polismyndigheten · Körkortslagen (1998:488) 5 kap. 3 och 9 §§ |
| Nuvarande status | `reviewed` |
| Avtryck att signera | `16e32fa7` |
| Rätt svar | 0,2 promille eller mer. |

| Beslut | Granskare | Datum | Källa som kontrollerades | Anteckning |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

### `alk-002` — Grovt rattfylleri

**Fråga:** Vad gäller normalt vid 1,0 promille eller mer?

- fel: Det ger körkortsingripande men inget straffrättsligt ansvar.
- fel: Det ger enbart en varning första gången.
- fel: Det räknas som ringa rattfylleri och ger böter.
- **RÄTT**: Det räknas som grovt rattfylleri, med fängelse i straffskalan.

**Kort förklaring:** Från 1,0 promille — eller 0,50 milligram per liter i utandningsluften — är brottet normalt grovt. Fängelse ingår i straffskalan.

**Fördjupning:** Lagen räknar upp vad som särskilt ska beaktas, så halten avgör inte ensam: brottet kan bedömas som grovt även under 1,0 promille om föraren varit avsevärt påverkad eller körningen inneburit en påtaglig fara för trafiksäkerheten. Straffskalan går till fängelse i högst två år, och körkortet återkallas.

| | |
| --- | --- |
| Kapitel · delområde | alkohol · alkohol-gransvarden |
| Svårighet | 2 |
| Varför P1 | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| P1-typer | P1-NUMERIC, P1-VOLATILE, P1-LAW, P1-SAFETY |
| Källhänvisning | Lag (1951:649) om straff för vissa trafikbrott 4 a § · Polismyndigheten · Körkortslagen (1998:488) 5 kap. 3 § |
| Nuvarande status | `reviewed` |
| Avtryck att signera | `0e8ec82d` |
| Rätt svar | Det räknas som grovt rattfylleri, med fängelse i straffskalan. |

| Beslut | Granskare | Datum | Källa som kontrollerades | Anteckning |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

### `alk-003` — Alkoholens nedbrytning

**Fråga:** Vad påskyndar kroppens nedbrytning av alkohol?

- fel: Motion och svettning. — avslöjar: Alkohol antas försvinna snabbare
- **RÄTT**: Ingenting i praktiken — bara tid.
- fel: Starkt kaffe. — avslöjar: Alkohol antas försvinna snabbare
- fel: En kall dusch. — avslöjar: Alkohol antas försvinna snabbare

**Kort förklaring:** Bara tid bryter ner alkohol. Kaffe gör dig vaken, inte nykter.

**Fördjupning:** Levern bryter ner alkohol i en i stort sett konstant takt, och den takten går inte att skynda på. En vanlig tumregel är ungefär ett glas i timmen för en genomsnittlig vuxen — men den är för grov för att avgöra om du är laglig, eftersom takten skiljer sig mellan personer. Kaffe eller en dusch kan göra att du känner dig piggare, vilket är farligt: du blir mer benägen att sätta dig i bilen utan att omdömet faktiskt återvänt.

| | |
| --- | --- |
| Kapitel · delområde | alkohol · alkohol-effekter |
| Svårighet | 2 |
| Varför P1 | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| P1-typer | P1-VOLATILE, P1-SAFETY |
| Källhänvisning | 1177 Vårdguiden |
| Nuvarande status | `reviewed` |
| Avtryck att signera | `bf13f11c` |
| Rätt svar | Ingenting i praktiken — bara tid. |

| Beslut | Granskare | Datum | Källa som kontrollerades | Anteckning |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

### `alk-004` — Dagen efter

**Fråga:** Du drack mycket alkohol på kvällen och sov åtta timmar. Vad gäller på morgonen?

- fel: Bara om du druckit sprit finns risk kvar på morgonen. — avslöjar: Alkohol antas försvinna snabbare
- **RÄTT**: Du kan fortfarande ha alkohol kvar i blodet och vara olaglig att köra.
- fel: Sömn bryter ner alkoholen snabbare, så du är nykter. — avslöjar: Alkohol antas försvinna snabbare
- fel: Efter sex timmars sömn är man alltid under gränsen. — avslöjar: Alkohol antas försvinna snabbare

**Kort förklaring:** Nedbrytningen tar tid oavsett sömn. Dagen efter är en vanlig rattfyllerisituation.

**Fördjupning:** Nedbrytningen är långsam och börjar först när du slutat dricka. Tumregeln om ett glas i timmen duger för att inse att det tar tid, men inte för att räkna ut när du är under gränsen — den enda säkra marginalen är att låta bilen stå. Har du druckit sent och mycket kan du ha promille kvar långt in på nästa dag. Lägg till att sömnen efter alkohol är sämre: du är dessutom trött.

| | |
| --- | --- |
| Kapitel · delområde | alkohol · alkohol-effekter |
| Svårighet | 2 |
| Varför P1 | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| P1-typer | P1-VOLATILE, P1-LAW, P1-SAFETY, P1-EXCEPTION |
| Källhänvisning | 1177 Vårdguiden · Lag (1951:649) om straff för vissa trafikbrott 4 § |
| Nuvarande status | `reviewed` |
| Avtryck att signera | `40a14a07` |
| Rätt svar | Du kan fortfarande ha alkohol kvar i blodet och vara olaglig att köra. |

| Beslut | Granskare | Datum | Källa som kontrollerades | Anteckning |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

### `alk-005` — Alkoholens effekt på körförmågan

**Fråga:** Vad påverkas först och tydligast av alkohol vid bilkörning?

- fel: Muskelstyrkan i benen.
- fel: Hörseln.
- **RÄTT**: Omdömet och förmågan att bedöma risker.
- fel: Synskärpan på långt håll.

**Kort förklaring:** Alkohol slår först mot omdömet — därför märker den påverkade det inte själv.

**Fördjupning:** Det är den farliga kombinationen: förmågan att bedöma den egna förmågan försämras tidigast. Föraren känner sig kompetent, tar större risker, och reagerar dessutom långsammare. Redan små mängder försämrar samordning, reaktionstid och förmågan att dela uppmärksamhet.

| | |
| --- | --- |
| Kapitel · delområde | alkohol · alkohol-effekter |
| Svårighet | 2 |
| Varför P1 | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| P1-typer | P1-VOLATILE, P1-SAFETY |
| Källhänvisning | 1177 Vårdguiden |
| Nuvarande status | `reviewed` |
| Avtryck att signera | `bef78461` |
| Rätt svar | Omdömet och förmågan att bedöma risker. |

| Beslut | Granskare | Datum | Källa som kontrollerades | Anteckning |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

### `alk-006` — Läkemedel och körning

**Fråga:** Du har fått ett läkemedel utskrivet som kan göra dig dåsig. Vad gäller?

- fel: Reglerna gäller bara narkotikaklassade läkemedel.
- fel: Utskrivna läkemedel är alltid tillåtna att kombinera med bilkörning.
- fel: Det räcker att du känner dig pigg för stunden.
- **RÄTT**: Du ansvarar själv för att inte köra om läkemedlet påverkar din körförmåga.

**Kort förklaring:** Receptet fritar dig inte. Påverkar medicinen körförmågan får du inte köra.

**Fördjupning:** Läkemedelsförpackningar märks med en varningstriangel när preparatet kan påverka körförmågan. Fråga läkare eller apotekspersonal, och var särskilt uppmärksam i början av en behandling och vid dosändringar. Kombination med alkohol förstärker effekten kraftigt.

| | |
| --- | --- |
| Kapitel · delområde | alkohol · droger-lakemedel |
| Svårighet | 2 |
| Varför P1 | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| P1-typer | P1-VOLATILE, P1-LAW, P1-SAFETY |
| Källhänvisning | Lag (1951:649) om straff för vissa trafikbrott 4 § · Läkemedelsverket |
| Nuvarande status | `reviewed` |
| Avtryck att signera | `bfef2f4b` |
| Rätt svar | Du ansvarar själv för att inte köra om läkemedlet påverkar din körförmåga. |

| Beslut | Granskare | Datum | Källa som kontrollerades | Anteckning |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

### `alk-007` — Nolltolerans mot narkotika

**Fråga:** Vad gäller för narkotika i blodet vid bilkörning?

- fel: Det gäller bara om du orsakat en olycka.
- fel: Det är tillåtet om du inte känner dig påverkad.
- fel: Samma promillegräns som för alkohol.
- **RÄTT**: Nolltolerans — varje spårbar mängd är drograttfylleri.

**Kort förklaring:** För narkotika finns ingen tillåten nivå. Nolltolerans gäller — med ett undantag för läkemedel du använder enligt ordination.

**Fördjupning:** Undantaget står i lagen: har substansen använts i enlighet med läkares eller annan behörig receptutfärdares ordination gäller inte nolltoleransen. Men även då får du inte köra om körförmågan är påverkad. Många substanser är spårbara långt efter att ruset gått över.

| | |
| --- | --- |
| Kapitel · delområde | alkohol · droger-lakemedel |
| Svårighet | 1 |
| Varför P1 | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| P1-typer | P1-VOLATILE, P1-LAW, P1-SAFETY, P1-EXCEPTION |
| Källhänvisning | Lag (1951:649) om straff för vissa trafikbrott 4 § · Polismyndigheten |
| Nuvarande status | `reviewed` |
| Avtryck att signera | `c82b7760` |
| Rätt svar | Nolltolerans — varje spårbar mängd är drograttfylleri. |

| Beslut | Granskare | Datum | Källa som kontrollerades | Anteckning |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

### `alk-008` — Ansvar för annan förare

**Fråga:** Din kompis har druckit och tänker köra hem. Vad gäller för dig?

- **RÄTT**: Du bör hindra körningen — att låta det ske kan vara straffbart medhjälp.
- fel: Du har ansvar bara om du åker med.
- fel: Det är helt och hållet förarens eget ansvar.
- fel: Du har ansvar bara om det är din bil.

**Kort förklaring:** Att medvetet låta någon köra påverkad kan vara straffbart — och du kan förhindra det.

**Fördjupning:** Den som uppmuntrar, möjliggör eller lämnar över nycklarna till en påverkad förare kan dömas för medhjälp. Praktiskt: ta nycklarna, ordna taxi, erbjud en soffa. Att ringa polisen när någon ändå kör iväg är inte att svika en vän — det är att förhindra en möjlig dödsolycka.

| | |
| --- | --- |
| Kapitel · delområde | alkohol · alkohol-gransvarden |
| Svårighet | 3 |
| Varför P1 | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| P1-typer | P1-VOLATILE, P1-LAW, P1-SAFETY, P1-EXCEPTION |
| Källhänvisning | Brottsbalk (1962:700) 23 kap. 4 § · Lag (1951:649) om straff för vissa trafikbrott 4 § |
| Nuvarande status | `reviewed` |
| Avtryck att signera | `3e3052d7` |
| Rätt svar | Du bör hindra körningen — att låta det ske kan vara straffbart medhjälp. |

| Beslut | Granskare | Datum | Källa som kontrollerades | Anteckning |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

### `grd-006` — Grovt rattfylleri

**Fråga:** Vid vilken alkoholhalt i blodet räknas brottet som grovt rattfylleri?

- fel: 1,5 promille eller mer. — avslöjar: Gränsen för grovt rattfylleri
- fel: 0,2 promille eller mer. — avslöjar: Gränsen för grovt rattfylleri
- **RÄTT**: 1,0 promille eller mer.
- fel: 0,5 promille eller mer. — avslöjar: Gränsen för grovt rattfylleri

**Kort förklaring:** Rattfylleri börjar vid 0,2 promille. Vid 1,0 promille eller mer räknas brottet som grovt, med fängelse i straffskalan.

| | |
| --- | --- |
| Kapitel · delområde | alkohol · alkohol-gransvarden |
| Svårighet | 1 |
| Varför P1 | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| P1-typer | P1-NUMERIC, P1-VOLATILE, P1-LAW, P1-SAFETY |
| Källhänvisning | Lag (1951:649) om straff för vissa trafikbrott 4 § · Teoribok 2026-1 (Körkortonline.se) Alkohol s. 140 |
| Nuvarande status | `reviewed` |
| Avtryck att signera | `eb05a3f2` |
| Rätt svar | 1,0 promille eller mer. |

| Beslut | Granskare | Datum | Källa som kontrollerades | Anteckning |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

### `mns-014` — Effekt vid låg promillehalt

**Fråga:** Vad händer redan vid 0,1–0,4 promille?

- fel: Balansen försämras och dubbelseende uppstår. — avslöjar: Tidig alkoholpåverkan underskattas
- **RÄTT**: Vissa mentala spärrar släpper, den egna förmågan överskattas och reaktionstiden försämras.
- fel: Ingenting mätbart — påverkan börjar först vid 0,5 promille. — avslöjar: Tidig alkoholpåverkan underskattas
- fel: Endast synen påverkas. — avslöjar: Tidig alkoholpåverkan underskattas

**Kort förklaring:** Den farligaste effekten kommer först: omdömet försämras innan man känner sig berusad, och den egna förmågan överskattas.

**Fördjupning:** Vid 0,4–1,0 promille försämras dessutom syn, tal och koordination. Vid 1,0–2,0 blir det svårt att kontrollera kroppen. Men det är den tidiga, omärkliga fasen som gör att någon sätter sig bakom ratten alls.

| | |
| --- | --- |
| Kapitel · delområde | alkohol · alkohol-effekter |
| Svårighet | 2 |
| Varför P1 | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| P1-typer | P1-NUMERIC, P1-VOLATILE, P1-SAFETY |
| Källhänvisning | Teoribok 2026-1 (Körkortonline.se) Promille s. 140 · 1177 Vårdguiden |
| Nuvarande status | `reviewed` |
| Avtryck att signera | `d866959a` |
| Rätt svar | Vissa mentala spärrar släpper, den egna förmågan överskattas och reaktionstiden försämras. |

| Beslut | Granskare | Datum | Källa som kontrollerades | Anteckning |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

### `mns-015` — Individuell variation i promillehalt

**Fråga:** Två personer dricker exakt lika mycket alkohol. Varför kan de ändå få olika promillehalt?

- fel: Skillnaden uppstår först vid höga mängder. — avslöjar: Promillehalten antas följa mängden
- fel: Skillnaden beror enbart på kroppsvikt. — avslöjar: Promillehalten antas följa mängden
- fel: Promillehalten beror bara på mängden alkohol. — avslöjar: Promillehalten antas följa mängden
- **RÄTT**: Vikt, kön, hälsa, drickhastighet och vad de ätit påverkar halten.

**Kort förklaring:** Samma mängd ger inte samma promillehalt. Även samma person kan få olika halt vid olika tillfällen, till exempel beroende på matintag.

**Fördjupning:** Det gör att egna tumregler av typen "ett glas i timmen" inte går att lita på. Nedbrytningen går dessutom inte att påskynda — bara att vänta ut.

| | |
| --- | --- |
| Kapitel · delområde | alkohol · alkohol-effekter |
| Svårighet | 3 |
| Varför P1 | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| P1-typer | P1-VOLATILE, P1-SAFETY |
| Källhänvisning | Teoribok 2026-1 (Körkortonline.se) Alkoholupplysning s. 141 · 1177 Vårdguiden |
| Nuvarande status | `reviewed` |
| Avtryck att signera | `a28eb1c4` |
| Rätt svar | Vikt, kön, hälsa, drickhastighet och vad de ätit påverkar halten. |

| Beslut | Granskare | Datum | Källa som kontrollerades | Anteckning |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

### `mns-016` — Dagen efter

**Fråga:** Du har druckit mycket kvällen innan men är säker på att alkoholen hunnit gå ur kroppen. Vad gäller?

- fel: Du är opåverkad så snart promillehalten är noll. — avslöjar: Noll promille tas för återställd
- **RÄTT**: Du kan fortfarande vara sliten och sämre som förare, även om promillehalten är noll.
- fel: Du är opåverkad efter åtta timmars sömn oavsett mängd. — avslöjar: Noll promille tas för återställd
- fel: Det räknas fortfarande som rattfylleri i 24 timmar. — avslöjar: Noll promille tas för återställd

**Kort förklaring:** Noll promille betyder inte återställd. Trötthet och sämre koncentration finns ofta kvar dagen efter.

**Fördjupning:** Kombinationen är dessutom vanlig: dålig sömn plus resterande utmattning ger en reaktionsförmåga som liknar den hos en trött förare, utan att något visar sig i ett utandningsprov.

| | |
| --- | --- |
| Kapitel · delområde | alkohol · alkohol-effekter |
| Svårighet | 2 |
| Varför P1 | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| P1-typer | P1-NUMERIC, P1-VOLATILE, P1-SAFETY |
| Källhänvisning | Teoribok 2026-1 (Körkortonline.se) Alkoholupplysning s. 141 · 1177 Vårdguiden |
| Nuvarande status | `reviewed` |
| Avtryck att signera | `6a64ab9d` |
| Rätt svar | Du kan fortfarande vara sliten och sämre som förare, även om promillehalten är noll. |

| Beslut | Granskare | Datum | Källa som kontrollerades | Anteckning |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

### `mns-017` — Rattfylleri under gränsvärdet

**Fråga:** Kan det räknas som rattfylleri om alkoholhalten ligger under 0,2 promille?

- fel: Ja, men bara för yrkesförare. — avslöjar: Gränsen för grovt rattfylleri
- fel: Nej, men det kan ge böter för ovarsam körning. — avslöjar: Gränsen för grovt rattfylleri
- fel: Nej, gränsvärdet är absolut. — avslöjar: Gränsen för grovt rattfylleri
- **RÄTT**: Ja, om du är så påverkad att du inte kan köra på ett betryggande sätt.

**Kort förklaring:** Gränsvärdet säger när halten ensam räcker för fällande dom. Lagen har också en andra väg in: den som är så påverkad att fordonet inte kan föras på ett betryggande sätt döms för rattfylleri oavsett halt.

**Fördjupning:** Det är två skilda saker som ofta blandas ihop. Rattfylleri handlar om påverkan — antingen mätt som halt, eller bedömd som oförmåga att köra betryggande. Vårdslöshet i trafik är ett eget brott i samma lag och handlar om hur du körde, med eller utan alkohol inblandad. Samma körning kan träffas av båda.

| | |
| --- | --- |
| Kapitel · delområde | alkohol · alkohol-gransvarden |
| Svårighet | 3 |
| Varför P1 | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| P1-typer | P1-NUMERIC, P1-VOLATILE, P1-LAW, P1-SAFETY |
| Källhänvisning | Lag (1951:649) om straff för vissa trafikbrott 4 § · Teoribok 2026-1 (Körkortonline.se) Alkoholupplysning s. 141 |
| Nuvarande status | `reviewed` |
| Avtryck att signera | `65cdd4ca` |
| Rätt svar | Ja, om du är så påverkad att du inte kan köra på ett betryggande sätt. |

| Beslut | Granskare | Datum | Källa som kontrollerades | Anteckning |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

### `mns-018` — Medhjälp till rattfylleri

**Fråga:** Du lånar ut bilen till en vän som du vet har druckit. Vad kan det innebära?

- fel: Att din försäkring blir dyrare men inget mer. — avslöjar: Ansvaret antas ligga bara på föraren
- fel: Ingenting — ansvaret ligger helt på föraren. — avslöjar: Ansvaret antas ligga bara på föraren
- **RÄTT**: Att du kan straffas för medhjälp till rattfylleri.
- fel: Att du blir ersättningsskyldig men inte straffas. — avslöjar: Ansvaret antas ligga bara på föraren

**Kort förklaring:** Att låna ut bilen till någon du vet är påverkad, eller att bjuda någon som ska köra, kan vara straffbar medhjälp.

**Fördjupning:** Medverkansansvaret står i brottsbalken och gäller den som främjar gärningen med råd eller dåd. Att lämna över nycklarna till någon du vet har druckit är att möjliggöra körningen.

| | |
| --- | --- |
| Kapitel · delområde | alkohol · alkohol-gransvarden |
| Svårighet | 2 |
| Varför P1 | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| P1-typer | P1-VOLATILE, P1-ADMIN, P1-LAW, P1-SAFETY, P1-EXCEPTION |
| Källhänvisning | Brottsbalk (1962:700) 23 kap. 4 § · Lag (1951:649) om straff för vissa trafikbrott 4 § · Teoribok 2026-1 (Körkortonline.se) Alkoholupplysning s. 141 |
| Nuvarande status | `reviewed` |
| Avtryck att signera | `1f2c80e8` |
| Rätt svar | Att du kan straffas för medhjälp till rattfylleri. |

| Beslut | Granskare | Datum | Källa som kontrollerades | Anteckning |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

### `mns-019` — Var rattfyllerilagen gäller

**Fråga:** Var gäller rattfyllerilagstiftningen?

- fel: Endast inom tättbebyggt område. — avslöjar: Rattfyllerilagens räckvidd begränsas
- fel: Endast där det finns vägmärken uppsatta. — avslöjar: Rattfyllerilagens räckvidd begränsas
- fel: Endast på allmän väg. — avslöjar: Rattfyllerilagens räckvidd begränsas
- **RÄTT**: Överallt — även inom inhägnat område och på privat mark.

**Kort förklaring:** Lagen gäller överallt och för alla motordrivna fordon, inte bara bilar och inte bara på allmän väg.

**Fördjupning:** Paragrafen träffar den som för ett motordrivet fordon eller en spårvagn. Den säger ingenting om var — till skillnad från stora delar av trafikförordningen, som gäller på väg. Därför omfattas också en parkeringsplats, en gårdsplan och ett inhägnat område.

| | |
| --- | --- |
| Kapitel · delområde | alkohol · alkohol-gransvarden |
| Svårighet | 2 |
| Varför P1 | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| P1-typer | P1-VOLATILE, P1-LAW, P1-SAFETY, P1-EXCEPTION |
| Källhänvisning | Lag (1951:649) om straff för vissa trafikbrott 4 § · Teoribok 2026-1 (Körkortonline.se) Alkoholupplysning s. 141 |
| Nuvarande status | `reviewed` |
| Avtryck att signera | `c1769bfc` |
| Rätt svar | Överallt — även inom inhägnat område och på privat mark. |

| Beslut | Granskare | Datum | Källa som kontrollerades | Anteckning |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

### `mns-020` — Ansvar för läkemedelspåverkan

**Fråga:** Du har fått en medicin utskriven av läkare och känner dig dåsig av den. Vad gäller?

- **RÄTT**: Du får inte köra om du uppträder trafikfarligt — receptet ändrar inte det.
- fel: Du får köra om du håller lägre hastighet. — avslöjar: Receptet antas fria från ansvar
- fel: Du får köra, eftersom läkaren skrivit ut medicinen. — avslöjar: Receptet antas fria från ansvar
- fel: Du får köra de första dagarna innan medicinen börjat verka fullt. — avslöjar: Receptet antas fria från ansvar

**Kort förklaring:** Ansvaret att bedöma om ett läkemedel gör dig trafikfarlig är ditt. Bipacksedel, apotek och läkare är hjälpmedel — inte en ansvarsfriskrivning.

**Fördjupning:** Kör du trafikfarligt på grund av läkemedel tillämpas rattfyllerilagstiftningen, oavsett om medlet är utskrivet.

| | |
| --- | --- |
| Kapitel · delområde | alkohol · droger-lakemedel |
| Svårighet | 2 |
| Varför P1 | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| P1-typer | P1-VOLATILE, P1-SAFETY |
| Källhänvisning | Teoribok 2026-1 (Körkortonline.se) Läkemedel & mediciner i trafiken s. 141 |
| Nuvarande status | `reviewed` |
| Avtryck att signera | `4fd190f0` |
| Rätt svar | Du får inte köra om du uppträder trafikfarligt — receptet ändrar inte det. |

| Beslut | Granskare | Datum | Källa som kontrollerades | Anteckning |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

### `mns-021` — Nolltolerans mot narkotika

**Fråga:** Vilken gräns gäller för narkotika i trafiken?

- fel: Ingen gräns, men körningen bedöms i efterhand. — avslöjar: Gränsen för narkotika i trafiken
- fel: Samma promillegräns som för alkohol. — avslöjar: Gränsen för narkotika i trafiken
- **RÄTT**: Nolltolerans — inte det minsta spår får finnas.
- fel: En gräns som varierar med preparatet. — avslöjar: Gränsen för narkotika i trafiken

**Kort förklaring:** Nolltolerans gäller. Undantaget är narkotikaklassade läkemedel som läkare skrivit ut — och bara om du inte blir trafikfarlig.

| | |
| --- | --- |
| Kapitel · delområde | alkohol · droger-lakemedel |
| Svårighet | 2 |
| Varför P1 | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| P1-typer | P1-VOLATILE, P1-SAFETY, P1-EXCEPTION |
| Källhänvisning | Teoribok 2026-1 (Körkortonline.se) Droger & narkotika i trafiken s. 142 |
| Nuvarande status | `reviewed` |
| Avtryck att signera | `049c10ce` |
| Rätt svar | Nolltolerans — inte det minsta spår får finnas. |

| Beslut | Granskare | Datum | Källa som kontrollerades | Anteckning |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

### `mns-022` — Vakenhetshöjande droger

**Fråga:** Varför är vakenhetshöjande droger som amfetamin särskilt farliga i trafiken?

- fel: De ger omedelbar dåsighet redan efter någon minut. — avslöjar: Vakenhetshöjande droger antas motverka trötthet
- **RÄTT**: Tröttheten förträngs i stället för att försvinna, så föraren kan somna utan förvarning.
- fel: De påverkar bara omdömet på lång sikt. — avslöjar: Vakenhetshöjande droger antas motverka trötthet
- fel: De försämrar synen men inte reaktionsförmågan. — avslöjar: Vakenhetshöjande droger antas motverka trötthet

**Kort förklaring:** Vakenhetshöjande medel ger hyperaktivitet och kraftig överskattning av den egna förmågan. Tröttheten finns kvar under ytan och kommer tillbaka plötsligt.

**Fördjupning:** Vakenhetssänkande medel ger i stället dåsighet och förlängd reaktionstid. Båda kategorierna faller under rattfyllerilagstiftningen om körningen blir trafikfarlig.

| | |
| --- | --- |
| Kapitel · delområde | alkohol · droger-lakemedel |
| Svårighet | 3 |
| Varför P1 | Regelområdet ändras på egen hand; svaret kan bli fel utan att någon rör frågan. |
| P1-typer | P1-VOLATILE, P1-SAFETY, P1-EXCEPTION |
| Källhänvisning | Teoribok 2026-1 (Körkortonline.se) Droger & narkotika i trafiken s. 142 |
| Nuvarande status | `reviewed` |
| Avtryck att signera | `e10a43a7` |
| Rätt svar | Tröttheten förträngs i stället för att försvinna, så föraren kan somna utan förvarning. |

| Beslut | Granskare | Datum | Källa som kontrollerades | Anteckning |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

### `mns-023` — Alkohol kombinerat med läkemedel

**Fråga:** Du har tagit en receptfri medicin som varnar för trötthet, och druckit ett glas vin. Hur bedöms kombinationen?

- fel: Effekterna tar ut varandra om mängderna är små. — avslöjar: Kombinationseffekter underskattas
- fel: Kombinationen är ofarlig under gränsvärdet 0,2 promille. — avslöjar: Kombinationseffekter underskattas
- fel: Endast alkoholen räknas, eftersom medicinen är receptfri. — avslöjar: Kombinationseffekter underskattas
- **RÄTT**: Effekterna kan förstärka varandra så att påverkan blir större än summan av delarna.

**Kort förklaring:** Kombinationen är svår att förutse och ofta kraftigare än väntat. Varningstexten på förpackningen gäller även vid små mängder alkohol.

**Fördjupning:** Varningstriangeln på förpackningen är satt för läkemedlet ensamt. Tillsammans med alkohol kan effekten bli kraftigare än vad någon av dem ger var för sig, och hur mycket kraftigare går inte att räkna ut i förväg.

| | |
| --- | --- |
| Kapitel · delområde | alkohol · droger-lakemedel |
| Svårighet | 3 |
| Varför P1 | Innehåller ett tal som är rätt eller fel — gräns, mått, intervall. |
| P1-typer | P1-NUMERIC, P1-VOLATILE, P1-LAW, P1-SAFETY |
| Källhänvisning | Teoribok 2026-1 (Körkortonline.se) Läkemedel & mediciner i trafiken s. 141 · Läkemedelsverket · Lag (1951:649) om straff för vissa trafikbrott 4 § |
| Nuvarande status | `reviewed` |
| Avtryck att signera | `d36bfae3` |
| Rätt svar | Effekterna kan förstärka varandra så att påverkan blir större än summan av delarna. |

| Beslut | Granskare | Datum | Källa som kontrollerades | Anteckning |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

