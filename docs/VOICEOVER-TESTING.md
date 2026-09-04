# VoiceOver-testning (iOS)

**Status: förberedd, inte körd.** Ingen rad är avbockad. Ingen ska bockas av av
något annat än en människa med VoiceOver påslaget på en riktig iPhone.

Kortare än [NVDA-protokollet](NVDA-TESTING.md) med flit. VoiceOver på iOS
prövar delvis andra saker: svepgester i stället för tabbordning, rotorn i
stället för snabbtangenter, och en installerad app utan webbläsarens
adressfält och tillbakaknapp.

## Förutsättningar

| | |
| --- | --- |
| Enhet | iPhone med iOS 17 eller senare |
| Läsare | VoiceOver (Inställningar → Hjälpmedel → VoiceOver) |
| Webbläsare | Safari |
| Adress | <https://jimmy7610.github.io/vagklar/> |
| Läge | Kör hela protokollet **två gånger**: en gång i Safari-fliken, en gång som installerad app från hemskärmen |

Skärmridån på (`trippeltryck med tre fingrar`) minst en gång per flöde.

## Gester

| Gest | Gör |
| --- | --- |
| Svep höger / vänster | Nästa / föregående element |
| Dubbeltryck | Aktivera |
| Två fingrar, svep upp | Läs allt från toppen |
| Rotor (vrid två fingrar) | Byt navigeringsenhet — rubrik, länk, formulärfält |
| Svep upp / ned efter rotorval | Hoppa till nästa av den sorten |
| Två fingrar, Z | Tillbaka / avbryt |

## Flöden

### A. Hem och navigering

| # | Steg | Förväntat | Utfall |
| --- | --- | --- | --- |
| A1 | Öppna appen | Sidtiteln läses upp |  |
| A2 | Rotor → Rubrik, svep ned | En `H1`, sedan `H2` per sektion |  |
| A3 | Bottenmenyn | Fem flikar med namn; den aktuella meddelas som vald |  |
| A4 | Dubbeltryck på en flik | Ny sida meddelas — inte tystnad |  |
| A5 | Träffytorna i menyn | Går att träffa utan att zooma |  |

### B. Träning

| # | Steg | Förväntat | Utfall |
| --- | --- | --- | --- |
| B1 | Starta ett pass | Frågan läses som rubrik |  |
| B2 | Svep genom alternativen | Fyra knappar; bokstav och text hörs |  |
| B3 | Dubbeltryck på ett svar | Återkopplingen läses upp automatiskt |  |
| B4 | Efter svar | Fokus står på återkopplingen, inte kvar på knappen |  |
| B5 | Säkerhetsknapparna | "Visste det", "Osäker", "Gissade" hörs som knappar |  |
| B6 | Nästa fråga | Den nya frågan meddelas |  |

### C. Bild och märke

| # | Steg | Förväntat | Utfall |
| --- | --- | --- | --- |
| C1 | En fråga med fotografi | Alt-texten läses |  |
| C2 | **Läckkontroll** | Beskrivningen avslöjar inte svaret |  |
| C3 | Ett vägmärke i en fråga | Beskrivs till utseende, inte betydelse |  |
| C4 | Förstora-knappen | Har namn; dialogen får fokus; två fingrar Z stänger |  |

### D. Prov

| # | Steg | Förväntat | Utfall |
| --- | --- | --- | --- |
| D1 | Starta provet | Bekräftelsedialogen får fokus |  |
| D2 | Klockan | **Lyssna**: avbryter den uppläsningen upprepade gånger? |  |
| D3 | Föregående / Nästa | Namn hörs; inaktiv knapp meddelas |  |
| D4 | Översikt över frågorna | Dialogen får fokus; cellerna heter "Fråga N, obesvarad" |  |
| D5 | Cellerna | Går att träffa med ett finger utan att zooma |  |
| D6 | Lämna in | Bekräftelse först; antalet obesvarade hörs |  |
| D7 | Resultatet | Utfallet hörs utan att man ser diagrammet |  |

### E. Märkesdetaljvyn

| # | Steg | Förväntat | Utfall |
| --- | --- | --- | --- |
| E1 | Öppna ett kort i katalogen | Dialogen får fokus |  |
| E2 | Svep genom dialogen | Exakt en rubrik; grupperna har namn |  |
| E3 | Märkesbilden | Läses inte upp separat — beskrivningen står som text |  |
| E4 | Två fingrar Z | Stänger; fokus tillbaka på kortet |  |

### F. Inställningar

| # | Steg | Förväntat | Utfall |
| --- | --- | --- | --- |
| F1 | Segmenterade val | Valt alternativ meddelas |  |
| F2 | Ändra textstorlek | Layouten håller; fokus flyttas inte |  |
| F3 | Kopiera teknisk information | Bekräftelsen hörs |  |

### G. Installerad app (kör om A–F)

| # | Steg | Förväntat | Utfall |
| --- | --- | --- | --- |
| G1 | Lägg till på hemskärmen | Appen öppnas utan adressfält |  |
| G2 | Bottenmenyn mot hemindikatorn | Menyn ligger ovanför, inte under |  |
| G3 | Två fingrar Z i en dialog | Fungerar även utan webbläsarens tillbakaknapp |  |
| G4 | Vrid till liggande | Innehållet flyter om; inget faller utanför |  |
| G5 | Dynamisk textstorlek på max | Appen är fortfarande användbar |  |

## Blockerande

Samma lista som för NVDA, plus:

- Bottenmenyn under hemindikatorn i installerat läge
- En dialog som inte går att stänga utan webbläsarens tillbakaknapp

## När testet är kört

Skriv resultatet i [QA.md](QA.md) med datum, iOS-version och modell, och byt
statusen högst upp. **Inte förrän dess.**
