# Arkitektur

## Principen

Vägklar är byggd runt en enkel regel: **domänlogiken vet ingenting om React.**

Behärskning, provberedskap, repetitionsschema, frågeurval och provrättning är rena funktioner över
rena datastrukturer. De tar in tillstånd och en tidpunkt, och returnerar nytt tillstånd. Det gör
att hela den adaptiva motorn kan testas utan att rendera något, och att ett gränssnittsbyte aldrig
riskerar att ändra hur inlärningen fungerar.

## Lager

```
content/    Data. Frågor, taxonomi, lektioner, scenarier, missuppfattningar,
               kursplan och källregister. Inga beroenden uppåt.
   ↓
domain/     Ren logik. Rena funktioner, ingen React, ingen lagring, ingen tid utifrån
               (allt "nu" skickas in som argument). Här ligger också kursplanens
               täckningsberäkning och Scenariolabbets bedömning och uppspelning.
   ↓
storage/    Uthållighet. IndexedDB, schema, migrationer, defensiv inläsning, export/import.
               Känner till domäntyperna men inte React.
   ↓
app/        Tillstånd och komposition. Store, React-bindningar, routing, tema.
   ↓
features/   Skärmar. Använder ui/ och app/, aldrig storage/ direkt.

ui/         Designsystem. Tokens, primitiver, ikoner, illustrationer.
               Känner varken till domänen eller lagringen.
```

Beroenden pekar bara nedåt i listan. `domain/` importerar aldrig från `app/` eller `features/`.

## Tillståndsarkitektur

Fyra tydligt åtskilda sorters tillstånd:

| Sort               | Var det bor                              | Överlever omladdning |
| ------------------ | ---------------------------------------- | -------------------- |
| Innehåll           | `content/` — statiskt, buntas med appen  | –                    |
| Elevdata           | `LearnerStore` → IndexedDB               | Ja                   |
| Sessionstillstånd  | `LearnerData.activeSession` / `exams`    | Ja (avsiktligt)      |
| Gränssnitt         | `UiProvider` (toaster, online, uppdatering) | Nej               |

### Varför en store och inte en context-reducer

`LearnerStore` ([`src/app/state/learnerStore.ts`](../src/app/state/learnerStore.ts)) är ett vanligt
observerbart objekt som React prenumererar på via `useSyncExternalStore`. Det ger tre saker:

1. Varje övergång är ett anrop till en ren domänfunktion — testbart utan rendering.
2. Uthållighet sker explicit vid varje övergång, inte som en bieffekt i en effekt.
3. Komponenter som inte läser elevdata renderas inte om när den ändras.

Härledda värden (provberedskap, insikter, misstagsgrupper) memoiseras mot identiteten hos
`LearnerData`-objektet i en `WeakMap`. Eftersom varje övergång skapar ett nytt objekt är cachen
exakt lika färsk som datan.

### Tid som extern källa

Att läsa `Date.now()` under rendering gör en komponent oren: samma props kan ge olika utdata.
Tiden modelleras därför som en extern store i
[`src/app/state/clock.ts`](../src/app/state/clock.ts), med två upplösningar — en sekundklocka för
provets nedräkning och en halvminutsklocka för beredskap och rekommendationer. Intervallet går
bara när något prenumererar.

### Hydreringsgrind

Inläsningen från IndexedDB är asynkron. Under de första bildrutorna efter en omladdning håller
storen fortfarande en tom profil. Skärmar som *fattar beslut* av det tillståndet — "ingen
introduktion gjord, omdirigera", "inget prov igång, gå tillbaka" — skulle då kasta ut en
återvändande elev ur sin session.

[`HydrationGate`](../src/app/HydrationGate.tsx) håller sådana rutter tills posten är inläst.
Landningssidan är avsiktligt undantagen; den behöver ingen elevdata för att renderas.

## Routing

Hash-routing (`HashRouter`), medvetet valt.

GitHub Pages har inget omskrivningslager. Med history-routing skulle en direktladdning av
`/utveckling/omrade/hogerregeln` ge 404. Den vanliga lösningen — en `404.html` som skriver om
adressen — fungerar men blinkar till och gör bakåtknappen subtilt trasig. Hash-routing är trist och
korrekt: varje adress går att ladda om, dela och bokmärka, även under en underkatalog.

Rutterna delas i två familjer:

- **Skalrutter** ligger i `AppLayout` och har navigation (bottenrad på mobil, sidopanel från 1024px)
- **Fokusrutter** — träningspass, pågående prov, scenario — renderas utan navigation så att
  ingenting konkurrerar med uppgiften

## Kodklyvning

Varje rutt utom landningssidan laddas lazy. Landningssidan ligger utanför
`HydrationGate` och ritas direkt; allt annat väntar på att lagringen lästs.

Frågebanken laddas inte vid start. Skalet klarar sig på ett genererat index — id,
kategori, delområde, svårighet — medan frågetexterna hämtas genom en dynamisk import i
`learnerStore.init()`, före hydreringen och därmed före första skärmen som kan behöva
dem. Chunkarna är namngivna i `vite.config.ts` för att hålla isär de två halvorna, och
service workern precachar båda, så offline är oförändrat.

Det halverade startpaketet — 246 kB gzip ned till 162 kB — och regeln för vad som får
ligga var beskrivs i [CONTENT-LOADING.md](CONTENT-LOADING.md). Två saker håller det kvar:
ett test som går igenom den verkliga importgrafen och fallerar om banken blir nåbar utan
dynamisk import, och en budget i `verify-build` som avbryter bygget om startpaketet
växer förbi taket eller om frågechunken hamnar i startgrafen.

`verify-build` kontrollerar i samma veva basvägen `/vagklar/` i index.html och manifestet,
eftersom en absolut sökväg som glömt basen fungerar i `vite preview` på roten och ger 404
först i produktion.

## Felhantering

- `ErrorBoundary` fångar renderingsfel och visar ett lugnt meddelande, aldrig en stacktrace
- Skadade poster i lagringen hoppas över vid inläsning, resten av utvecklingen behålls
- Misslyckade skrivningar bryter aldrig sessionen; minnet är sanningen medan appen körs
- Saknad eller blockerad service worker gör appen sämre, aldrig trasig

## Källmaterial lämnar aldrig maskinen

Kursplanen är härledd ur ett licensierat källdokument som ligger lokalt i
`references/`. Det dokumentet är inte en del av systemet: det är ignorerat av git,
det importeras inte av någon modul, och `scripts/verify-build.mjs` avbryter bygget
om något liknande hamnar i `dist/`, i en bundle eller i service workerns
förhandscache. Samma kontroll körs i CI direkt före publicering.

Arkitektoniskt betyder det att kunskapen ur källan bara finns i **härledd** form —
kapitelrubriker, sidintervall, begreppsnamn — i `content/curriculum/`, aldrig som
återgiven text. Se [SOURCES-AND-RIGHTS.md](SOURCES-AND-RIGHTS.md).
