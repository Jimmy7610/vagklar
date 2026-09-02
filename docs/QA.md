# QA

Det här dokumentet beskriver vad som faktiskt har kontrollerats, hur, och vad som **inte** har
kontrollerats. Inget här är påstått utan att ha körts.

Senast genomförd: 2026-09-01, mot produktionsbygget serverat med `npm run preview`
(`http://localhost:4173/vagklar/`) i en Chromium-baserad webbläsare.

---

## Automatiserade tester

`npm test` — **354 tester i 19 filer, alla gröna.**

| Område                     | Fil                                   | Täcker                                                                 |
| -------------------------- | ------------------------------------- | ---------------------------------------------------------------------- |
| Frågebankens integritet    | `domain/content/bank.test.ts`         | id:n, svar, svarsposition, taxonomi, källor, statusregler               |
| Behärskning                | `domain/mastery/mastery.test.ts`      | kvalitet, säkerhetsviktning, svårighet, svarstid, konvergens, nivåer    |
| Repetition                 | `domain/repetition/repetition.test.ts`| betyg, intervall, återfall, lätthetsgränser, förfallosortering          |
| Provberedskap              | `domain/readiness/readiness.test.ts`  | delar, viktomnormalisering, avdrag, preliminärt tak, determinism        |
| Frågeurval                 | `domain/selection/selection.test.ts`  | Dagens 10, pooler, syskonval, filter, nivåtest, nästa bästa steg        |
| Prov                       | `domain/exam/exam.test.ts`            | 70 frågor, kvot per område, 5 oräknade, rättning, 52-gränsen, utgång    |
| Svarsapplicering           | `domain/learner/applyAnswer.test.ts`  | totaler, missuppfattningar, schemaläggning, svit                       |
| Store                      | `app/state/learnerStore.test.ts`      | passflöde, prov utan återkoppling, återupptagning, radering             |
| Hydreringsgrind            | `app/HydrationGate.test.tsx`          | rutter hålls tills lagringen lästs in                                  |
| Säkerhetskopia             | `storage/backup.test.ts`              | rundresa, format-/schemaavvisning, fientlig indata                      |
| Lagring                    | `storage/repository.test.ts`          | omladdning, skadade poster, radering, import, minnesläge                |
| Frågekortet                | `features/practice/QuestionCard.test.tsx` | val, återkoppling, tangentbord, säkerhet, sparning               |
| Provläget                  | `features/exam/ExamRunnerPage.test.tsx`   | ingen återkoppling, markering, navigering, inlämning              |
| Scenariolabbet             | `domain/scenarios/scenario.test.ts`   | ordningar, första avvikelsen, varianter, uppspelning, körfält           |
| Kursplan och täckning      | `domain/curriculum/coverage.test.ts`  | kapitel, begrepp, sidintervall, luckor, källregister, rättighetstext    |
| Innehållsvalidering        | `domain/content/validation.test.ts`   | 18 planterade fel, dubbletter, källsidor, attribution, bildmetadata     |
| Vägmärkesregistret         | `domain/content/roadSigns.test.ts`    | ritning ↔ post, koder, förväxlingspar, 8 planterade fel                |

Några tester finns specifikt för att låsa fast beteenden som är lätta att råka förstöra:

- provberedskapen får **inte** straffa en elev för delar som inte går att mäta än
- provsvar får **inte** röra behärskningen förrän provet lämnats in
- en skrivning som var i luften när eleven raderade allt får **inte** återuppliva datan
- ett rätt svar man gissat sig till får **inte** väga lika mycket som ett man var säker på
- ett scenariofordon får **inte** avsluta sin färdväg i mötande körfält
- en fråga får **inte** hänvisa till ett `sourceId` som inte finns i källregistret
- rättighetstexten får **inte** tillskriva Vägklar tredjepartsmaterial, och måste
  friskriva sig från koppling till Trafikverket

---

## Bygge och statisk analys

| Kontroll            | Resultat                                                        |
| ------------------- | --------------------------------------------------------------- |
| `npm run lint`      | 0 fel, 9 varningar (samtliga `react-refresh/only-export-components`, rör bara HMR i utveckling) |
| `npm run typecheck` | Rent. Strikt TypeScript, `noUncheckedIndexedAccess` på, inga `any` |
| `npm run build`     | Lyckas                                                           |

Startpaketet — det webbläsaren måste hämta innan landningssidan kan ritas (gzip):

| Chunk        | Gzip   |
| ------------ | ------ |
| `vendor`     | 62 kB  |
| `content`    | 47 kB  |
| `index`      | 37 kB  |
| `router`     | 14 kB  |
| CSS          | 10 kB  |
| **Summa JS** | **160 kB** |

Frågetexterna ligger inte där. De hämtas genom en dynamisk import i `learnerStore.init()`
och precachas ändå av service workern. Se [CONTENT-LOADING.md](CONTENT-LOADING.md).

---

## Responsiv QA

Metod: appen kördes vid varje bredd och varje rutt besöktes, med en mätning av
`document.documentElement.scrollWidth` mot `clientWidth` efter att rutten renderats. Horisontell
sidoscroll fångas alltså mätt, inte med ögonmått.

Kontrollerade bredder:

| Bredd | Resultat |
| ----- | -------- |
| 320 × 568  | Ingen överflödning |
| 360 × 800  | Ingen överflödning |
| 375 × 812  | Ingen överflödning |
| 390 × 844  | Ingen överflödning |
| 412 × 915  | Ingen överflödning |
| 430 × 932  | Ingen överflödning |
| 667 × 375 (liggande) | Ingen överflödning |
| 844 × 390 (liggande) | Ingen överflödning |
| 768 × 1024 | Ingen överflödning |
| 1024 × 768 | Ingen överflödning |
| 1280 × 720 | Ingen överflödning |
| 1440 × 900 | Ingen överflödning |
| 1920 × 1080| Ingen överflödning |

Rutter i varje mätning: landningssida, hem, träna, prov, utveckling, misstag, teori, lektion,
scenarier, scenario, mer, inställningar, om.

### Bugg hittad och åtgärdad

Vid 320–430px överflödade träningspasset sidan med ~120px. Orsaken var att ett rutnät med implicit
kolumn får sin bredd av innehållets min-content, och delområdesetiketten
("ALKOHOL, DROGER OCH LÄKEMEDEL · GRÄNSVÄRDEN OCH STRAFF") har `white-space: nowrap`. Kolumnen blev
481px bred i en 375px vy.

Åtgärd: enspaltsrutnät sätter `grid-template-columns: minmax(0, 1fr)` genomgående. Fixen gick
igenom hela kodbasen, inte bara den skärm där symptomet syntes.

Även kontrollerat: ljust och mörkt tema, bottennavigation på telefon, sidopanel från 1024px,
provets frågeöversikt (ark på mobil, sidopanel på desktop), modaler, kunskapskartan.

### Omkörd efter Scenariolabbet (2026-09-01)

Hela svepet kördes om efter uppgraderingen av Scenariolabbet, med samma mätmetod och
med tillägg av rutten `/kallor` och de nya bredderna 820 × 1180 och 1366 × 768:

| Bredd | Överflödning | Scenariodetalj |
| ----- | ------------ | -------------- |
| 320 × 568   | 0 px | Kontroller 645 px ned |
| 375 × 812   | 0 px | Kontroller 700 px ned |
| 430 × 932   | 0 px | Kontroller 729 px ned |
| 667 × 375   | 0 px | Kontroller 593 px ned |
| 844 × 390   | 0 px | Kontroller 580 px ned |
| 768 × 1024  | 0 px | Kontroller 873 px ned (inom vyn) |
| 820 × 1180  | 0 px | Kontroller 874 px ned (inom vyn) |
| 1024 × 768  | 0 px | **Kontroller 247 px ned** |
| 1280 × 720  | 0 px | **Kontroller 248 px ned** |
| 1366 × 768  | 0 px | **Kontroller 248 px ned** |
| 1440 × 900  | 0 px | **Kontroller 248 px ned** |
| 1920 × 1080 | 0 px | **Kontroller 221 px ned** |

Noll horisontell överflödning på samtliga bredder och rutter.

### Bugg hittad och åtgärdad — Scenariolabbets skala

Scenen är kvadratisk och saknade takhöjd. På en bred skärm växte den till kolumnens
bredd och blev därmed högre än fönstret: grafiken såg absurt stor ut och
svarskontrollerna hamnade flera skärmar ned.

Åtgärd: scenen begränsas av både kolumnbredd och fönsterhöjd
(`max-width: min(100%, 54vh, 620px)` från 1024px, `68vh` i låga fönster).
Mätt efteråt ligger den första svarskontrollen 221–248 px från toppen på alla
skrivbordsbredder, och hela scenariodetaljen ryms på 1,0–1,6 skärmar.

### Buggar hittade och åtgärdade — Scenariolabbets detaljer

- **Dubblerad identitet.** Fordonet visade både en A-bricka och en positionsbricka på
  samma plats. Brickan är nu identitet, positionen en separat pill på fordonets bakkant.
- **Hopklistrad text.** `label` och `meta` låg som inline-element i samma rad och
  rann ihop. Båda är nu `display: block`.
- **Dubblerad knapp.** "Visa reglerna" fanns både i scenens fot och i åtgärdsraden.
  Scenens kopia togs bort.
- **Upprepad uppläsning.** "DIN BIL"-chippet lästes upp två gånger i knappens
  tillgängliga namn. Chippet är nu `aria-hidden`.
- **Fel körfält.** Den vänstersvängande bilen i `sc-hogerregeln-1` slutade sin färdväg
  i mötande körfält (x = 44 i stället för x = 56). Rättad, och skyddad av ett nytt test
  som kontrollerar körfältsdisciplin för varje färdväg — testet verifierades genom att
  återinföra felet, varpå det föll.

### Reducerad rörelse

Tidigare hoppade fordonen direkt till slutpositionen vid reducerad rörelse. Det är
fortfarande rörelse. Nu skickas ingen position alls till scenen: bilarna står stilla
och sekvensen drivs av nummerbrickor, framhävning av aktivt fordon och stegtexten.

---

## Innehållsexpansion (2026-09-01)

### Automatiserad innehållsvalidering

Banken kontrolleras nu maskinellt av
[`validation.ts`](../src/domain/content/validation.ts), som körs både i testsviten
och via `npm run report:content`. Varje kontroll har ett test som **planterar felet**
och kontrollerar att validatorn fångar det — validatorn kan alltså inte passera för
att banken råkar vara ren.

Resultat: **259 frågor, 0 fel, 0 varningar, 0 dubblettkandidater.**

### Buggar hittade av de nya kontrollerna

Verktygen hittade fel i material som skrivits i samma pass:

- **Fyra dubbletter.** Dubblettdetektorn hittade fyra nya frågor som upprepade
  befintliga med bara ett ändrat tal (`ber-005`/`has-006`, `ber-007`/`has-005`,
  `ber-006`/`hal-003`, `pas-001`/`tra-003`). Tre togs bort och deras bättre
  förklaringar fördes in i originalen; den fjärde skrevs om till att pröva en annan
  kunskapspunkt.
- **Bruten korsreferens.** Efter borttagningen pekade `ber-008` på en fråga som inte
  längre fanns. `dangling-related` fångade det direkt.
- **Saknad variantbeskrivning.** Två nya scenariovarianter saknade egen
  `accessibilityText`, vilket hade gett en skärmläsaranvändare en beskrivning som
  motsäger uppgiften.
- **Fel körfält i ett scenario.** Se avsnittet om körfältsdisciplin ovan.
- **Hårdkodad varianttext.** Grundvariantens chip sa "Korsningen utan extra
  skyltning" även i en cirkulationsplats som faktiskt har skyltar. Texten är nu
  neutral.

### Testet som blev fel när innehållet blev bättre

Ett befintligt test hävdade att banken *har* minst en prioritet 1-lucka. När luckorna
fylldes föll testet — inte för att koden gick sönder, utan för att påståendet inte
längre var sant. Testet skrevs om till att pröva rangordningslogiken mot syntetisk
indata, så att det inte går sönder nästa gång innehållet förbättras.

### Startpaketets storlek

Frågebanken växte från 147 till 259 frågor. `manualChunks` tvingade in lektioner och
scenarier i det startkritiska `content`-paketet trots att deras vyer laddas lazy;
efter att de undantagits sjönk startpaketet med cirka 6 kB gzip. Frågebanken själv
når fortfarande startpaketet, eftersom `learnerStore` importerar den synkront — det
är en medveten arkitektur som inte ändrades i den här omgången.

Uppmätt startpaket (gzip): content 90 kB, vendor 62 kB, index 50 kB, router 14 kB.

### Responsiv QA, ny omgång

Samma mätmetod som tidigare, med de nya rutterna. **Noll horisontell överflödning och
`h1` på varje rutt** vid 375×812, 390×844, 430×932, 768×1024, 1024×768, 1366×768,
1440×900 och 1920×1080.

Rutter: landningssida, hem, träna, prov, utveckling, misstag, teori, de tre nya
lektionerna, scenariolistan, de fem nya scenarierna, mer, om och källor.

Dessutom kört: Dagens 10 igenom åtta frågor på 390×844 utan överflödning, samt
ordnings- och riskövningarna i de nya scenarierna med korrekt utfall.

---

## Uthållighet — verifierat i webbläsaren

Metod: läsning direkt ur IndexedDB efter varje steg, inte enbart via gränssnittet.

| Kontroll | Resultat |
| -------- | -------- |
| Genomfört pass sparas | 10 svar, 5 behärskningsposter, 1 passammanfattning i lagringen |
| Profiltotaler | `answered: 10, correct: 2, sessionsCompleted: 1` |
| Omladdning | Data intakt, hemskärmen visar "10 besvarade frågor hittills", 5 % beredskap, svit 1 |
| Rekommendation efter omladdning | "Behöver repeteras — 8 frågor har legat och väntat" |
| Radering kräver bekräftelse | Knappen är inaktiv tills `RADERA` skrivits |
| Radering | 0 svar, 0 behärskning, 0 pass i lagringen; profilen nollställd |
| Radering efter omladdning | Fortfarande tom — ingen återuppliving |
| Ny elev efter radering | Landar korrekt i introduktionen |

### Bugg hittad och åtgärdad

En omladdning kastade ut eleven till introduktionen trots sparad data. Orsaken var att inläsningen
är asynkron: under de första bildrutorna såg skärmarna en tom platshållarprofil och agerade på den.
Samma kapplöpning hade kastat ut en elev ur ett **pågående prov**.

Åtgärd: [`HydrationGate`](../src/app/HydrationGate.tsx) håller rutter som fattar beslut av
elevdatan tills posten lästs in. Ett regressionstest låser fast beteendet.

---

## PWA och offline — verifierat i webbläsaren

| Kontroll | Resultat |
| -------- | -------- |
| Service worker registrerad | Ja, scope `http://localhost:4173/vagklar/` — underkatalog fungerar |
| Kontrollerar sidan | Ja |
| Precache | 42 poster, 703 kB |
| Appskal i cache | `index.html` → 200 ur cachen |
| JS/CSS i cache | Huvudchunk och CSS → 200 ur cachen |
| Frågebanken i cache | `content-*.js` → 200 ur cachen |
| Manifest i cache | Ja |
| Ikoner i cache | 6 av 6 (og-bilden utesluten avsiktligt) |
| Uppdateringsflöde | Nytt bygge gick till `waiting`; appen visar "Ny version finns" och byter först på elevens kommando |
| Gamla cachar städas | Ja, `cleanupOutdatedCaches` — bara en cache kvar efter uppdatering |

Att den gamla versionen fortsatte serveras efter ett nytt bygge, tills uppdateringen accepterades,
är i sig ett direkt bevis på att appen serveras ur cachen och inte från nätet.

### Bugg hittad och åtgärdad

En tidigare, trasig `typecheck`-skriptrad hade emitterat en kompilerad `vite.config.js` bredvid
`vite.config.ts`. Vite löser upp `.js` före `.ts`, så den inaktuella filen användes som konfiguration
— alla senare PWA-ändringar var tysta no-ops.

Åtgärd: filerna borttagna, skriptet lagat, båda tillagda i `.gitignore`. Efter det visade sig
`globPatterns`/`globIgnores` inte konsulteras alls i det här plugin-läget; publika resurser läggs i
precachen med `includeAssets`, vilket nu är gjort explicit.

### Omprövat 2026-09-01

Service workern gick **inte** att registrera om i den inbäddade QA-webbläsaren:
`register()` faller med "An unknown error occurred when fetching the script",
trots att `sw.js`, `workbox-*.js` och `manifest.webmanifest` alla serveras med
status 200 och rätt MIME-typ.

Felet är bevisat vara miljöns, inte appens: en minimal en-radig service worker
som serverades från samma server föll med exakt samma fel. Webbläsaren i QA-miljön
tillåter alltså inte SW-skriptbämtning över huvud taget.

Bygget är däremot kontrollerat direkt: `dist/sw.js` innehåller 44 precache-poster,
appskalet ingår, och inga källdokument finns bland dem. **Men PWA-beteendet är
inte ombekräftat i webbläsare i den här omgången** — det bör göras i en vanlig
webbläsare mot den publicerade sajten.

### Inte verifierat

- **Äkta nätverksfrånkoppling.** Miljön saknar möjlighet att stänga av nätet. Offline är verifierat
  genom att varje skalresurs bevisligen löser ut ur cachen, plus det observerade cache-först-beteendet
  ovan — men inte genom att faktiskt dra ur sladden.
- **Installation på riktig enhet** (iOS "Lägg till på hemskärmen", Android-installation).
- **Verkliga enheter.** All responsiv QA är gjord med viewport-emulering i en desktopwebbläsare.

---

## Tillgänglighet

Kontrollerat:

- Semantisk HTML: `main`, `nav`, `header`, `section` med rubriker, listor som listor
- Rubrikordning: ett `h1` per skärm, `SectionHeading` tar en nivå
- Tangentbord: svarsalternativ nås och aktiveras med tangentbord; A–D och 1–4 väljer; Enter går
  vidare **först när frågan är besvarad**; piltangenter navigerar i provet
- Inga destruktiva åtgärder på genvägar
- Synlig fokusmarkering (`:focus-visible`), aldrig bortdesignad
- Modaler: `role="dialog"`, `aria-modal`, kopplad rubrik och beskrivning, fokusfälla, fokus
  återlämnas, Escape stänger, sidan bakom låses
- Statusfärger åtföljs alltid av ord eller ikon
- Träffytor minst 44px för primära åtgärder; övrigt är inline-textlänkar
- `prefers-reduced-motion` respekteras, plus en egen inställning; reducerad rörelse tar aldrig bort
  information
- Textstorlek: tre steg i inställningarna, och layouten tål webbläsarens egen zoom
- Bildberoende frågor och scenarier har textbeskrivning; scenarierna har dessutom listbaserad
  interaktion så att inget kräver att man pekar på en bild
- Ringen visar `—`, inte 0, när beredskapen inte är mätt

Inte gjort: granskning med riktig skärmläsare (NVDA/VoiceOver), och maskinell kontrastmätning av
varje färgpar. Paletten är vald för AA-kontrast men det är inte instrumentellt verifierat.

---

## Konsolen

Inga fel i konsolen under genomgången: landningssida, introduktion, träningspass, passammanfattning,
utveckling, misstag, teori, lektion, scenarier, inställningar, radering, provläge.

---

## Källbildsintegration (2026-09-01)

26 fotografier ur den licensierade källan integrerades i lektioner och frågor.

### Verifierat i webbläsaren

- **Lektionsbilder** renderas med prompt, bildtext och kreditering
  (`Foto: Körkortonline.se, s. 55 · © Hagberg Media AB · används med tillstånd`).
- **Bildfrågor** dyker upp i vanlig träning och visar bilden ovanför svarsalternativen.
- **Responsivt urval fungerar mätt, inte antaget**: vid DPR 1 och 585 px ruta hämtas
  640-varianten, vid DPR 2 och 394 px ruta hämtas 960-varianten.
- **Ingen layoutförskjutning**: ramen bär `aspect-ratio` och bilden `width`/`height`,
  så platsen är reserverad innan filen laddats.
- **Höjdtaket håller**: uppmätta bildhöjder 191–458 px, alltid under taket
  `min(58vh, 460px)`. En kvadratisk bild tar inte över en telefonskärm.

### Responsiv QA

| Bredd | Överflödning | Bilder för breda | Max bildhöjd |
| --- | ---: | ---: | ---: |
| 375 × 812 | 0 px | 0 | 341 px |
| 390 × 844 | 0 px | 0 | 356 px |
| 430 × 932 | 0 px | 0 | 221 px |
| 768 × 1024 | 0 px | 0 | 458 px |
| 1024 × 768 | 0 px | 0 | 443 px |
| 1366 × 768 | 0 px | 0 | 443 px |
| 1440 × 900 | 0 px | 0 | 458 px |
| 1920 × 1080 | 0 px | 0 | 458 px |

Kört i både mörkt och ljust läge över de sju lektioner som har bild.

### Bugg hittad och åtgärdad — bildtexten avslöjade svaret

Den första versionen visade registrets bildtext även i frågor. På frågan om
gångfartsområde stod det då *"I ett gångfartsområde gäller gångfart, väjningsplikt mot
gående och parkeringsförbud"* rakt ovanför svarsalternativ B, som sa exakt samma sak.

Bildtexten är skriven för att förklara vad bilden lär ut — vilket är precis det en fråga
ber eleven räkna ut. Åtgärd: `SourceImageFigure` tar en `showCaption`-flagga som
frågekortet sätter till `false`. Krediteringen visas fortfarande alltid.

### Inte ett fel: `naturalWidth` ser för litet ut

Under mätningarna rapporterade `img.naturalWidth` 389 för en fil som är 960 px bred.
Det är korrekt beteende: med `srcset`-deskriptorer i `w` delar webbläsaren den
inneboende storleken med den upplösta densiteten. Filen kontrollerades separat med
`createImageBitmap` och är 960 × 540.

### Miljöartefakt: lazy-laddning under viewport-emulering

`loading="lazy"`-bilder laddades ibland inte när de rullades in i vyn programmatiskt
under emulerad viewport. Samma bilder laddas direkt med `loading="eager"` och laddades
korrekt vid vanlig rullning. Mätningarna gjordes därför med påtvingad `eager`.

### PWA

Bilderna precachas **inte** — 0 av 47 precache-poster är bilder. De fångas av den
befintliga `runtimeCaching`-regeln (`CacheFirst`, tak 120 poster, 60 dagar), så en bild
du sett en gång fungerar offline efteråt utan att kosta något för den som aldrig öppnar
den.

---

## Vägmärken och visuell täckning (2026-09-01)

60 vägmärken ritades som vektorer, 18 nya fotografier kurerades, och frågebanken gick
från 275 till 343 frågor.

### Buggar hittade av verktygen

- **Elva identiska frågetexter.** Dubblettdetektorn fångade att alla nya
  igenkänningsfrågor började med "Vad betyder det här märket?". Den ser inte bilden,
  så de var exakta dubbletter — och pedagogiskt var repetitionen lika illa. Varje
  fråga fick en egen formulering som frågar efter konsekvensen.
- **Två frågor duplicerade befintliga.** `vmk-021` och `vmk-022` upprepade `mot-007`
  och `vag-007` ordagrant. Borttagna.
- **Identisk förklaringstext** delades av `pas-015` och `vmk-017`. Omskriven.
- **En frågas delområde hörde till fel område** (`hastighetsgranser` under
  `vagmarken`). Fångat av `category-mismatch`.
- **En stale skyltreferens.** `varning-korsning` döptes om till `varning-vagkorsning`,
  och en befintlig fråga pekade fortfarande på det gamla namnet. Fångat av den nya
  kontrollen `unknown-sign-illustration`.
- **En redundant grundfråga.** `grd-008` upprepade `par-002` om tiometersregeln.
  Ersatt med en fråga om utryckningsfordon, som saknades i banken.

### Buggar hittade vid visuell granskning

Alla 60 ritningar granskades i webbläsaren i förstorad form. Sex var felaktiga:

- **Varning för vägarbete** ritades som en båge i stället för en arbetande figur.
- **Varning för djur** ritades som en rundad klump utan igenkännbar älg.
- **Cykelöverfart** hade en cykel som knappt syntes i den vita triangeln.
- **Flervägsstopp** hade text som kolliderade med symbolen och klipptes av kanten.
- **Nedsatt syn** hade en vit käpp som inte lästes som en käpp.
- **Huvudled och Huvudled upphör** var ritade som roterade `<rect>`. Rotationen la
  romben utanför mitten och klippte den mot viewBox. Ritas nu som centrerad
  `<polygon>`. Detta var ett *befintligt* fel som ärvdes från den ursprungliga
  ritningen och först blev synligt när märket förstorades.

### Responsiv QA

| Bredd | Överflödning | Minsta skylt | Max bildhöjd |
| --- | ---: | ---: | ---: |
| 375 × 812 | 0 px | 64 px | 341 px |
| 390 × 844 | 0 px | 64 px | 356 px |
| 430 × 932 | 0 px | 64 px | 394 px |
| 768 × 1024 | 0 px | 64 px | 458 px |
| 1024 × 768 | 0 px | 64 px | 443 px |
| 1366 × 768 | 0 px | 64 px | 443 px |
| 1440 × 900 | 0 px | 64 px | 458 px |
| 1920 × 1080 | 0 px | 64 px | 458 px |

Kört i både mörkt och ljust läge.

**Bugg hittad och åtgärdad:** skyltrutnätet överflödade med 15 px vid 390 px och 2 px
vid 430 px. Långa namn som "Väjningsplikt mot mötande trafik" tvingade rutnätets spår
bredare än kolumnen. Åtgärd: `minmax(min(112px, 100%), 1fr)` på spåren plus
`overflow-wrap: anywhere` och `min-width: 0` på namnet.

### Skyltarnas färger i mörkt läge

Märkena behåller sina äkta färger i båda teman, eftersom färgen är en del av det som
ska läras in. De ligger därför alltid på en ljus neutral platta: en gul varningstriangel
direkt på en mörk kortyta läser sig som en varning *i gränssnittet*, vilket är fel
budskap.
## Människan, vägmarkeringar och innehållsladdning (2026-09-02)

### Automatiserade tester

354 tester i 19 filer, alla gröna. Nya sedan förra omgången:

| Fil | Täcker |
| --- | --- |
| `domain/content/roadMarkings.test.ts` | Markeringsregistret, M-koder, ritningar, förväxlingspar, lektionsblock, Scenariolabbets koppling, sju planterade fel |
| `app/state/contentLoading.test.ts` | Den statiska importgrafen från `main.tsx`, indexet mot banken, dubbletter över modulgränser |

`contentLoading.test.ts` är ett strukturtest, inte ett storlekstest. Den går igenom
grafen och fallerar om banken, urvalet, insikterna, provmodulen eller `useContent` blir
nåbara utan dynamisk import — och även om indexet eller behärskningsmodellen skulle
*sluta* vara nåbara, så att garantin inte kan bli sann av misstag.

### Regression hittad av testsviten

`selection.test.ts` fallerade på "blir inte ett enämnespass" efter att Människan växte
med 40 frågor: en helt ny elev fick **åtta alkoholfrågor av tio** i Dagens 10. Orsaken
var inte det nya innehållet utan en latent bugg det råkade avslöja — `maxPerSubcategory`
nollställdes för varje plats i passet, så varje plats kunde fylla sin egen kvot av samma
ämne. Åtgärd: `assemble` får med sig det redan valda (`taken`) och ett kompletterande
kategoritak. Resultat efter fix: 5 delområden och 4 kategorier i samma pass.

### Verifierat i webbläsaren

Kört mot `npm run preview` (produktionsbygge med service worker).

| Yta | Resultat |
| --- | --- |
| Landningssidan | Ritas utan frågebanken; hjältescenariot renderas |
| Hem (nu lazy) | Laddas efter hydrering, provberedskap och nästa steg visas |
| Träningspass | Frågor, svar och förklaring fungerar — banken löses ut dynamiskt |
| Teoriskolan → Vägmarkeringar | Rutnät, jämförelsekort och källbild med kreditering |
| Scenariolabbet → `sc-risk-barn-buss` | Scen, listalternativ, rättning och per-hotspot-förklaring |
| Konsolen | Inga fel på någon yta |

### Offline efter lazy-laddningen

Den viktigaste frågan i hela omgången: gör en dynamisk import att banken saknas offline?
Nej. Kontrollerat direkt i Workbox-cachen:

```js
const c = await caches.open('workbox-precache-v2-' + location.origin + '/vagklar/');
(await c.keys()).map((r) => r.url).filter((u) => u.includes('questions-'));
```

→ `questions-*.js` finns i precachen, tillsammans med samtliga 53 poster och alla lata
ruttchunkar. Service workern är registrerad och `vagklar-images` finns kvar. Skillnaden
är alltså *när* webbläsaren måste vänta på chunken, inte om den finns.

### Startpaketet

| | Före | Efter |
| --- | --- | --- |
| Kritisk JS (gzip) | 246 151 B | 159 788 B |
| Precachade poster | 48 | 53 |

**−86 363 B, −35 %**, samtidigt som banken växte från 343 till 397 frågor och ett helt
vägmarkeringssystem tillkom.

Tre saker krävdes, och bara den första var uppenbar:

1. `learnerStore` importerar banken och provmodulen dynamiskt före hydreringen
2. Chunkarna namnges i `vite.config.ts` — utan det lyfter Rollup den delade banken till
   startchunken, eftersom åtta lata rutter importerar den
3. Hemsidan laddas lazy och landningsscenariot bor i egen modul; båda drog in innehåll
   de bara behövde en liten del av

### Responsiv QA

Horisontellt överflöd mätt som `scrollingElement.scrollWidth − innerWidth` på Hem,
Träna, Teoriskolans markeringslektion, ett människoscenario, Utveckling och Mina misstag:

| Vy | Överflöd |
| --- | --- |
| 375 × 812 | 0 px |
| 390 × 844 | 0 px |
| 430 × 932 | 0 px |
| 768 × 1024 | 0 px |
| 1024 × 768 | 0 px |
| 1366 × 768 | 0 px |
| 1920 × 1080 | 0 px |

Markeringsrutnätet lägger sig två i bredd på 375 px utan att streckmönstren blir
otydliga.

### Markeringarnas färger i båda teman

Markeringsritningarna använder fasta gråtoner i stället för temavariabler. En vit linje
på mörk asfalt måste se likadan ut i ljust och mörkt läge — annars byter kontrasten håll
och bilden säger emot sig själv. Kontrollerat i båda lägena.

### Inte verifierat

Installerat PWA-läge i ett riktigt skrivbordsfönster (fristående fönster, ikon i
aktivitetsfältet) har inte kunnat provas i den här omgången. Service worker,
precachelista och manifest är kontrollerade i webbläsaren enligt ovan; själva
installationsupplevelsen är det inte.
