# Scenariolabbet

Scenariolabbet är Vägklars svar på den svåraste delen av teorin: situationer där
flera regler gäller samtidigt och svaret inte går att slå upp. En fråga kan bara
fråga *vad* som gäller. Ett scenario kan visa *varför*.

## Vad en övning består av

1. **Scenen** — en vektorritad trafiksituation. Vägar, markeringar, skyltar och
   fordon, ritade i ett kvadratiskt 100×100-koordinatsystem.
2. **Uppgiften** — antingen en ordningsövning ("vem kör först?") eller en
   riskövning ("var är risken?").
3. **Två likvärdiga sätt att svara** — tryck på fordonen i scenen, eller använd
   listan bredvid. Listan är inte ett tillgänglighetsalternativ i andra klass;
   det är samma interaktion i en annan form, och båda uppdaterar samma tillstånd.
4. **Strukturerad återkoppling** — inte "rätt/fel", utan vilken regel som
   avgjorde, i vilken ordning fordonen kör, och vid fel: *var* resonemanget
   först gick isär från det rätta.
5. **Uppspelning** — sekvensen spelas upp steg för steg med en förklaring per steg.
6. **Regelöverlägg** — pilar för väjningsplikt, kryss där banorna korsas,
   streckade färdvägar och korta noteringar, som kan tändas och släckas.
7. **Varianter** — "vad förändras om…". Samma korsning, ett ändrat villkor,
   ett annat rätt svar.

## Datamodellen

Ett scenario är **data, inte kod**. Allt scenen ritar beskrivs i
[`src/domain/content/types.ts`](../src/domain/content/types.ts):

| Typ | Vad den beskriver |
| --- | --- |
| `ScenarioLayout` | Vägnätet: fyrvägskorsning, T-korsning, cirkulation, gata, motorvägspåfart, plankorsning |
| `ScenarioVehicle` | Fordon med `label`, `description`, `role`, startpunkt, riktning och `path` |
| `ScenarioSign` | Vägmärke placerat i scenen |
| `ScenarioMarking` | Stopplinje, väjningslinje, övergångsställe, cykelöverfart, pil |
| `ScenarioOverlay` | Väjningspil, konfliktkryss, färdvägsstreck eller notering |
| `ScenarioVariant` | En `patch` som ändrar scenariot och därmed det rätta svaret |

En ny situation författas genom att lägga till data i
[`src/content/scenarios.ts`](../src/content/scenarios.ts). Ingen ny ritkod behövs.

`ScenarioVehicleRole` skiljer `ego` (din bil) från övriga, vilket är det som gör
att scenen kan säga "DIN BIL" och att återkopplingen kan formulera sig i andra
person där det hjälper.

## Ren logik, separat från ritandet

All bedömning ligger i [`src/domain/scenarios/scenario.ts`](../src/domain/scenarios/scenario.ts)
och är fri från React:

- `resolveScenario(scenario, variantId)` — applicerar en variants patch.
- `orderableVehicles(scenario)` — vilka fordon som ingår i ordningen.
- `correctSteps(scenario)` — rätt sekvens med motivering per steg.
- `evaluateOrder(scenario, order)` — bedömer svaret och pekar ut **första**
  avvikelsen, inte alla.
- `buildReplaySequence(scenario)` / `replayProgressAt(...)` — uppspelningen som
  rena funktioner av tid, så komponenten bara renderar.
- `evaluateHotspot(scenario, id)` — riskövningen.

Ritandet ligger i [`src/ui/illustrations/ScenarioStage.tsx`](../src/ui/illustrations/ScenarioStage.tsx),
som bara får data och återanrop.

## Entydiga svar

Ett scenario med flera rimliga svar lär ut fel sak. Situationerna är därför
konstruerade så att **alla fordon står i konflikt parvis** — då finns exakt en
korrekt ordning, och den går att härleda ur reglerna.

I `sc-hogerregeln-1` svänger till exempel bil C vänster, vilket gör att den
korsar både A:s och B:s banor. Utan den detaljen hade C och B kunnat passera
samtidigt och ordningen varit tvetydig.

Varje variant har sitt eget entydiga svar:

| Variant | Rätt ordning | Varför |
| --- | --- | --- |
| Grundläge (inga märken) | B → A → C | Högerregeln hela vägen |
| Väjningsplikt mot din väg | B → C → A | Din väjningsplikt vänder ordningen |
| Din väg blir huvudled | A → B → C | Korsande trafik lämnar företräde |

Att varje variant har ett eget rätt svar och egna stegförklaringar är testat i
[`src/domain/scenarios/scenario.test.ts`](../src/domain/scenarios/scenario.test.ts).
Att svaret är *entydigt* går inte att testa mekaniskt — det är ett krav på den
som författar scenariot.

### Körfältsdisciplin

Scenen ritar högertrafik, och det måste stämma: en vänstersväng får inte sluta i
det mötande körfältet. Mittlinjen ligger på 50, så ett fordon på väg norrut
slutar på x > 50, söderut på x < 50, österut på y > 50 och västerut på y < 50.
Ett test kontrollerar det för varje färdväg i korsnings- och T-korsningsscener.
Testet infördes efter att den vänstersvängande bilen i `sc-hogerregeln-1`
visade sig hamna i mötande körfält.

## Layout: varför scenen har ett tak

Scenen är kvadratisk. Utan begränsning växer den till kolumnens bredd, och på en
bred skärm blev den då högre än fönstret — grafiken såg absurt stor ut och
svarskontrollerna hamnade flera skärmar ned. Scenen begränsas därför av
**både** kolumnbredd och fönsterhöjd:

```css
.stageBox { max-width: min(100%, 560px); aspect-ratio: 1 / 1; }
@media (min-width: 1024px) { .stageBox { max-width: min(100%, 54vh, 620px); } }
@media (max-height: 520px)  { .stageBox { max-width: min(100%, 68vh); } }
```

Uppmätt efter ändringen: på 1024×768 till 1920×1080 ligger den första
svarskontrollen 221–248 px från sidans topp, alltså inom första skärmen.

## Tillgänglighet

Scenariovyn renderas utanför `AppLayout` och ärver därför inte skalets
landmärken. Den har ett eget `<main>` — utan det hade en skärmläsaranvändare
landat på en sida helt utan huvudlandmärke. Ytorna i scenen är fokuserbara och
har en egen fokusring i SVG i stället för `outline`, eftersom en `outline` runt
en `<g>` inte följer formen.


- Fordon i scenen är riktiga knappar med `role="button"`, `tabIndex`,
  `aria-pressed` och Enter/Space.
- Listan bredvid ger samma funktion utan pekprecision.
- Ordningen läses upp via `aria-live` när den ändras.
- Etiketter är korta och entydiga ("Fordon B", "Din bil"); dekorativa märken är
  `aria-hidden` så skärmläsaren inte upprepar samma sak två gånger.
- Uppspelningen har en textlogg som skärmläsare kan följa.

### Reducerad rörelse

Med reducerad rörelse **flyttas inga fordon alls** — inte ens som ett hopp.
Uppspelningen behåller varje bil där den står och driver i stället sekvensen med
statiska medel: nummerbrickan 1, 2, 3 tänds i tur och ordning, det aktiva
fordonet framhävs medan de övriga tonas ned, och stegförklaringen byts ut.
Inställningen läses både från operativsystemet (`prefers-reduced-motion`) och
från appens egen inställning, där användarens val vinner.

## Att lägga till ett scenario

1. Lägg till ett objekt i `SCENARIOS` med layout, fordon, markeringar och skyltar.
2. Skriv `correctOrder` och en motivering per steg.
3. Lägg till överlägg som visar regeln, inte bara svaret.
4. Lägg till varianter om situationen har ett naturligt "vad om…".
5. Kontrollera att svaret är entydigt: står varje par av fordon i konflikt?
6. Kör `npm test`. Sviten kontrollerar att ordningen omfattar varje fordon, att
   varje steg har en motivering, att varianter har egna svar och egna steg, att
   uppspelningen täcker alla fordon med en text per steg, att alla koordinater
   ligger inom scenen och att varje färdväg slutar i rätt körfält.
   Entydigheten i punkt 5 är en författningsregel, inte något testet mäter —
   den måste kontrolleras för hand.

## Scenariokatalogen

| Id | Situation | Typ | Varianter |
| --- | --- | --- | ---: |
| `sc-hogerregeln-1` | Korsning utan vägmärken | Ordning | 2 |
| `sc-stopplikt-1` | Stopplikt mot huvudled | Ordning | – |
| `sc-utfart-1` | Utfart från parkering | Ordning | – |
| `sc-vanstersvang-1` | Vänstersväng mot mötande | Ordning | – |
| `sc-cirkulation-1` | Cirkulationsplats | Ordning | – |
| `sc-cirkulation-2` | Väjningsplikt vid infart, med cyklist | Ordning | 1 |
| `sc-cykeloverfart-1` | Cykelöverfart vid högersväng | Ordning | 1 |
| `sc-plankorsning-1` | Plankorsning med skymd sikt | Risk | – |
| `sc-pafart-1` | Motorvägspåfart och döda vinkeln | Risk | – |
| `sc-halka-1` | Var vägen är halast | Risk | – |
| `sc-risk-stadsgata` | Parkerade bilar på bostadsgata | Risk | – |
| `sc-risk-barn-buss` | Barn vid stannad buss | Risk | – |
| `sc-risk-blandning` | Bländning av mötande helljus | Risk | – |
| `sc-risk-trotthet` | Trötthetens första tecken | Risk | – |

### Layouten `railway-crossing`

Plankorsningen är en **layout i det delade renderingssystemet**, inte en egen
ritfunktion: den lades till i `ScenarioLayout` och i samma `switch` som övriga
vägnät, och ritar en nord–sydlig väg som korsas av ett spår med rälsprofiler och
slipers. Alla scenarier använder därmed fortfarande samma stage, samma överlägg,
samma uppspelning och samma variantsystem.

### Två varianter som lär ut skillnaden

`sc-cykeloverfart-1` finns i två lägen som ser nästan likadana ut i vägbanan men ger
olika skyldigheter:

| Läge | Vad som syns | Din skyldighet |
| --- | --- | --- |
| Cykelöverfart | Vägmärke, markering och väjningslinje | Full väjningsplikt |
| Cykelpassage | Bara vägmarkering | Låg hastighet och lämna tillfälle att passera (vid sväng) |

Ordningen blir densamma i båda fallen — men av olika skäl, och stegförklaringarna
säger vilket. Det är precis den nyans som är svår att lära sig ur en textregel.
