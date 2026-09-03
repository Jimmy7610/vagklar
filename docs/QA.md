# QA

Det här dokumentet beskriver vad som faktiskt har kontrollerats, hur, och vad som **inte** har
kontrollerats. Inget här är påstått utan att ha körts.

Senast genomförd: 2026-09-01, mot produktionsbygget serverat med `npm run preview`
(`http://localhost:4173/vagklar/`) i en Chromium-baserad webbläsare.

---

## Automatiserade tester

`npm test` — **456 tester i 24 filer, alla gröna.**

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

## Betaberedskap (2026-09-02)

Sammanfattningen med kryssrutor ligger i [BETA-READINESS.md](BETA-READINESS.md).
Här står hur siffrorna togs fram och vad som gick sönder på vägen.

### Automatiserade tester

420 tester i 23 filer. Nya sedan förra omgången:

| Fil | Täcker |
| --- | --- |
| `domain/exam/examFlow.test.ts` | Provet från start till resultat: klocka, markering, navigering, omladdning, gränsvärde, oräknade frågor, tidsutgång |
| `domain/exam/examDistribution.test.ts` | 1 000 simulerade prov: kategorifördelning, delområdesdominans, svårighet, bildandel, bankens bredd |
| `domain/selection/selectionStress.test.ts` | 240 syntetiska Dagens 10-pass över sex elevprofiler, plus rekommendationen |
| `storage/persistence.test.ts` | Export/import fält för fält, avbrutet pass och prov, migrationsmaskineri, halvförstörda poster |

### Sidgranskning av källhänvisningar

Ny kontroll (`npm run audit:pages`) som jämför varje sidhänvisning mot den
faktiska texten på sidan. Den hittade **27 felaktiga hänvisningar** som alla
tidigare kontroller släppt igenom, eftersom de kontrollerade att sidnumret låg
inom bokens omfång — vilket det gjorde.

| Sort | Antal | Exempel |
| --- | ---: | --- |
| Pekade på ett självtest eller dess facit | 9 | `ber-009` hänvisade till s. 203, som är en kapitelavdelare |
| Pekade på fel bildplansch i märkesuppslaget | 11 | `vmk-016` (påbudsmärke) hänvisade till förbudsplanschen |
| Pekade på en sida utan text alls | 1 | `bl2-014` hänvisade till s. 86, en helsidesbild |
| Fel sida i löptexten | 6 | `ber-008` hänvisade till s. 80; ordet "tresekundersregeln" står på s. 81 |

Efter rättning: **0 fel, 45 varningar, 2 dokumenterade undantag** av 286
hänvisningar. Undantagen är fall där Vägklar och boken namnger samma sak olika;
de står namngivna i skriptet med vad som faktiskt står på sidan, och rapporten
skriver ut dem.

### Visuell granskning av märken och markeringar

Alla 58 märken och 15 markeringar ritade i 220–420 px och granskade en och en.

**Två ritfel hittade och rättade:**

- **A36 "Varning för järnvägskorsning utan bommar"** var ritat som ett kryss.
  Krysset är A39 Kryssmärke — ett annat märke, med annan form, som står vid
  korsningen i stället för att varna för den. A36 ritas nu som ett ånglok.
- **A30 och D3 (cirkulationsplats)** ritade cirkulationen medurs. Svenska
  cirkulationsplatser körs moturs, vilket märkenas egen text i registret säger.
  Båda är speglade.

Dessutom kontrollerades **alla 58 koder mot källans planschuppslag** —
varningsmärken s. 324–327, väjningsplikt 328, förbud 329–332, påbud 333,
anvisning 334–336, tilläggstavlor 345–347. Samtliga stämmer.

**Inte löst:** pilarnas sida i A25, B6 och B7. De tre är inbördes konsekventa
och följer den europeiska utformningen, men källan visar dem som vektorplanscher
utan text och det gick inte att bekräfta. Att gissa vore värre än att lämna det
öppet, så det står i [BETA-READINESS.md](BETA-READINESS.md).

### Provets fördelning över 1 000 simulerade prov

| Kategori | Frågor per prov | Andel |
| --- | ---: | ---: |
| Trafikregler och grunder | 12 | 17 % |
| Korsningar och väjningsregler | 8 | 11 % |
| Hastighet och avstånd | 6 | 9 % |
| Risker | 5 | 7 % |
| Stannande och parkering, Motorväg, Omkörning, Halka | 4 vardera | 6 % |
| Järnväg, Alkohol, Mörker, Miljö, Fordonet, Last, Människan | 3 vardera | 4 % |
| Trötthet och stress | 2 | 3 % |

Spridningen är noll: kvoterna är fasta per kategori och det är avsiktligt.
Variationen ligger i vilka frågor som väljs, inte i hur många per ämne.

Svårighet per prov i snitt: 12,7 lätta, 39,1 medel, 18,3 svåra. Bildfrågor 11,7
(min 4, max 20). Skyltfrågor 3,8. Över 1 000 prov användes **423 av 423 frågor**,
och inga två prov var identiska.

Vägklar gör inget anspråk på att återskapa Trafikverkets viktning, som inte är
publicerad. Det här är Vägklars egen, dokumenterade balans.

### Tillgänglighet

Strukturgranskning över 14 vyer i produktionsbygget. **Tre defekter rättade:**

- Scenariovyn saknade `<main>` — den renderas utanför `AppLayout` och ärvde
  därför aldrig skalets landmärke.
- Importfältet på Inställningar (dolt filfält bakom en knapp) saknade etikett.
- `CardTitle` och `EmptyState` låg hårdkodat på `h3`, vilket gav ett hoppat
  steg från sidans `h1` på varje vy som lägger kort direkt under rubriken.

**Två kontrastdefekter rättade:** `dangerGhost`-knappens text låg på 4,18:1 mot
ytan i ljust tema, och ramen som markerar en flaggad provfråga på 1,79:1 —
alltså i praktiken osynlig som enda markör. Båda använder nu `-strong`-tonerna
som designsystemet redan hade.

Fokusmarkering kontrollerades med riktiga tabbtryck, inte programmatisk fokus:
`:focus-visible` matchar bara efter tangentbordsinteraktion, så ett skript som
anropar `.focus()` rapporterar falska brister. Scenariolabbets ytor i scenen har
en egen fokusring i SVG i stället för `outline`, och den fungerar.

### Reflow och textstorlek

| Kombination | Resultat |
| --- | --- |
| 14 vyer × 14 skärmbredder, normal text | Inget överflöd |
| 640 px med 200 % textstorlek | Inget överflöd |
| 320 px med 200 % textstorlek | Överflöd kvar på sex vyer |

Tre orsaker hittades och rättades:

1. **Bottennavigationen.** `repeat(5, 1fr)` krymper inte under sitt innehåll;
   `minmax(0, 1fr)` gör det. Etiketten trunkeras nu i stället för att skjuta
   sidan i sidled.
2. **Snabbstartsrutorna på Hem.** Ett enda oböjligt ord — "Provsimulering" —
   satte rutans minsta bredd.
3. **Den globala radbrytningsregeln.** `overflow-wrap: break-word` bryter rader
   men påverkar inte min-content-bredden, så en grid-kolumn vägrade ändå krympa.
   `anywhere` gör båda.

320 px kombinerat med 200 % text är hårdare än både WCAG 1.4.10 och 1.4.4 kräver
var för sig. Det är förbättrat, inte löst, och står som känd begränsning.

### Offline — verifierat med servern avstängd

Det här är den kontroll som betyder något efter att frågebanken gjordes lat.
Preview-servern stoppades och sidan laddades om:

| Yta | Resultat med servern nere |
| --- | --- |
| Landningssidan | Renderas helt |
| Hem, Träna, Provsimulering, Utveckling | Laddar |
| Teoriskolan och en lektion | Laddar |
| Scenariolabbet, ett scenario | Laddar |
| **Ett helt träningspass** | **Startade och visade frågor** |
| Tidigare visad källbild | Renderas ur `vagklar-images` |

Ett `fetch` mot servern gav `Failed to fetch` i samma session, så det var
verkligen offline.

**Noterat:** service workern tar kontroll först vid andra besöket. Det följer av
`registerType: 'prompt'` utan `clientsClaim` och är avsiktligt — inga
överraskande uppdateringar mitt i ett pass — men det betyder att den allra
första sidvisningen inte är offline-skyddad.

### Byggets grindar

`verify-build` gör nu tre saker till, utöver att stoppa källdokument:

- **Startbudget.** Avbryter över 185 000 B gzip. Kontrollerat genom att sänka
  taket och se bygget falla — en grind som aldrig testats är en förhoppning.
- **Frågechunken i startgrafen.** Avbryter om `questions-*.js` blir ivrigt laddad.
- **Basvägen.** Kontrollerar att index.html och manifestet håller sig under
  `/vagklar/`. En absolut sökväg som glömt basen fungerar i `vite preview` på
  roten och ger 404 först i produktion.

### Ostabil test

`ExamRunnerPage > never reveals whether an answer is correct` föll en gång under
parallell last och gick igenom både ensam och vid omkörning. Den är DOM-tung
(cirka 0,6 s). Ostabil, inte trasig — men inte utredd, och därför noterad i
stället för bortförklarad.

## Bokbilder i produkten (2026-09-02)

Omgången handlade om att få de licensierade fotografierna att fungera i appen,
inte om att lägga till fler av dem. Två av de tre viktigaste fynden var buggar
som fanns redan innan en enda ny bild kurerades.

### Provet visade inte frågornas bilder

`ExamRunnerPage` renderade `question.image` (de ritade märkena) men aldrig
`question.sourceImageId` och aldrig vägmarkeringarna. Effekten: varje
fotografiburen fråga — "vad ser du på bilden?" — kom upp **utan bild** i
provsimuleringen, medan samma fråga fungerade i träningen. Ungefär var tionde
fråga i ett prov var alltså obesvarbar.

Upptäckt genom att stega igenom 51 provfrågor och inte hitta en enda `<img>`.
Rättat, och skyddat av ett test som läser källkoden för varje yta som visar en
fråga och kräver att alla tre illustrationssorterna finns där. Ett källtest med
flit: felet var en saknad gren, och en renderingstest av de grenar som *finns*
hade aldrig sett den.

Provvyn saknade dessutom `<main>`, precis som scenariovyn gjorde före förra
omgången. Även det rättat.

### Tre fotografier var registrerade två gånger

`p100-0`, `p101-0` och `p107-0` hade var och en kurerats in i två ämnesmappar
med två slugar, två bildtexter och två långbeskrivningar. Vite deduplicerar
identiska filer, så bygget levererade bara en kopia — vilket är varför ingen
märkte det — men registret påstod sex bilder där det finns tre.

Värre: ett av paren var oense om vad bilden visar. `p101-0` är en vit bil i
mötande körfält sedd bakifrån, mitt i en omkörning. Posten `motande-landsvag`
beskrev den som en mötande bil nära mittlinjen. Den korrekta posten lever
vidare, den felaktiga är pensionerad, och en validatorregel
(`duplicate-image-asset`) gör att samma fil inte kan få två poster igen.

### Cachen matchade fel

Den nya regeln som skulle ge fotografierna en egen cache träffade aldrig:
`url.pathname.includes('/assets/source-images/')` fungerar i förvaret men inte i
produktion, eftersom Vite plattar ut alla resurser till `/assets/`. Bilderna
hamnade fortfarande i den delade `vagklar-images` med tak på 120 poster.

Rättat till att matcha på `.webp`, vilket är exakt: fotografierna är det enda
WebP appen levererar. `verify-build` avbryter nu om en WebP dyker upp utanför
`assets/`, så antagandet inte kan ruttna.

### Beskuren bild

`SourceImageFigure` använde `object-fit: cover` inuti en höjdbegränsad ram.
På en bred kolumn klipptes toppen och botten av ett fotografi bort — och i en
trafikbild är det kanterna som bär betydelsen: skylten i vägrenen, cyklisten vid
de parkerade bilarna, konerna vid kanten. Ramen följer nu bildens egna
proportioner och det är bredden som begränsas, så ingenting försvinner.

### Kurering

10 nya bilder valda genom att titta på kandidaterna i en genererad kontaktkarta,
inte genom att läsa filnamn. Urvalskriteriet var att bilden lär ut något en
ritning inte kan.

Avvisade exempel: de kvadratiska ~1220×1220-bilderna är kapitelöppnare, inte
lärobilder. Närbilden på ljusreglaget (s. 265) valdes bort därför att den röda
pilen pekar på ett läge vars innebörd inte gick att fastställa säkert — en
bildtext som hedgar är fyllnad. Vinterutrustningen (s. 126) är en produktbild,
inte en trafikmiljö.

Dessutom fick 5 redan licensierade men oanvända bilder ett hem. De låg i bygget
utan att undervisa någonting, vilket `npm run report:images` numera skriver ut.

### Bildernas plats i lektionerna

| Lektion | Bild | Vad den gör |
| --- | --- | --- |
| Grundreglerna | `signal-over-vajningsmarke` | Visar rangordningen i stället för att påstå den: grön signal och väjningspliktsmärke samtidigt |
| Grundreglerna | `placering-landsvag` | Vad "så långt höger som är lämpligt" ser ut som |
| Mörkerkörning | `skymning-belyst-vag` | Belyst väg tar inte bort ljuskravet |
| Riskbedömning | `bussar-vid-hallplats` | Hur mycket två bussar döljer |
| Vägmärken | `viltvarning-med-tillaggstavla` | Det ritade märket bredvid samma märke i vägkanten |
| Halka | `isig-landsvag-utan-linjer` | Solsken säger ingenting om greppet |
| Passager | `huvudled-cykelpassage` | Huvudleden gäller inte mot passagen tvärs din egen körbana |
| Utfartsregeln | `gangbana-utfart` | Gångbanan du korsar innan du ens nått bilvägen |
| Omkörning | `omkorning-landsvag` | Var den vita bilen faktiskt befinner sig |
| Stanna och parkera | `forbud-att-stanna` | Från vilken punkt förbudet gäller |
| Järnvägskorsningar | `plankorsning-ljussignal` | Plankorsning mitt i stan, där sikten är sämst |

### Bildstorlek

Två varianter, av samma skäl som en lektion och en fråga är olika saker.

| Variant | Tak | Varför |
| --- | --- | --- |
| `lesson` | `min(100%, 62vh × 16/9)` | Bilden *är* det som diskuteras och får läskolumnen |
| `question` | `min(100%, 38vh × 16/9)`, 46vh från 768 px | Bilden är bevis, och de fyra alternativen måste rymmas bredvid |

Kontrollerat på en 390 px-telefon i provet: fotografiet blir 199 px högt och tre
av fyra svarsalternativ syns utan att man scrollar.

### Förstoring

Detaljerna i en trafikbild är små — en skyltyta, en blinkers, en cyklist vid
kanten. Knappen i bildens hörn öppnar en `<dialog>` med `showModal()`, alltså
webbläsarens egen fokusfälla, inerta bakgrund och Escape-hantering i stället för
en handbyggd overlay.

Kontrollerat: dialogen öppnas som äkta modal (`:modal`), fokus landar på Stäng,
Tab stannar kvar inuti, stängning återlämnar fokus till knappen som öppnade den,
och krediteringen följer med in i det förstorade läget. Escape gick inte att
skicka genom automationen, men ingenting förhindrar `cancel`-händelsen som
webbläsaren stänger på.

### Offline

Fotografierna precachas inte — 6 MB ska inte tvingas på varje enhet vid
installationen. `verify-build` avbryter om en enda källbild hamnar i
förhandscachen.

Kontrollerat med servern avstängd:

| | Resultat |
| --- | --- |
| Lektion vars bild setts tidigare | Renderas ur `vagklar-source-images` |
| Lektion vars bild aldrig setts | Faller tillbaka till långbeskrivningen |
| Bildtext och kreditering i fallbacket | Kvar |
| Precachade poster | 53, varav 0 källbilder |

Fallbacket är nytt i den här omgången. Tidigare visade webbläsaren sin trasiga
bild-ikon och lektionens poäng försvann under tystnad.

### Responsiv kontroll

Tio bildbärande lektioner kontrollerade på elva bredder — 320, 360, 375, 390,
412, 430, 768, 1024, 1366, 1440 och 1920 px — mot fem villkor per bild: inget
horisontellt överflöd, ingen bild bredare än kolumnen, ingen högre än 85 % av
skärmen, ingen trasig, ingen uppskalad mer än 1,35× sin egen upplösning.

Inga fynd. Kontrollerat i både ljust och mörkt läge.

## Bokens ritningar i fordonsdelen (2026-09-02)

Elva ritningar och fyra komponentfoton ur källan togs in i kapitlen om
krocksäkerhet, last, släp och belysning. Genomgången nedan är körd i
webbläsaren mot ett riktigt bygge (`npm run preview`), inte mot dev-servern.

### Vad som kontrollerades

| Yta | Resultat |
| --- | --- |
| Lektionen *Last och släp* — 7 figurer | Alla renderar, mått läsbara ned till 320 px |
| Lektionen *Krockskydd i bilen* — 4 figurer | Alla renderar |
| Frågekortet (kontrollfrågorna) | Ritningen visas, bildtexten döljs — inget svar läcker |
| Provsimuleringen | Ett prov innehöll två ritningsfrågor (nr 40 och 51) och fyra foton; båda renderade |
| Förstoringen | Öppnar, visar samma bild i full bredd, `Esc` stänger, fokus återgår |
| Mörkt läge | Ritningen ligger på fast ljus platta — röda kryss och gula markeringar behåller sin betydelse |
| Ljust läge, 320 px | Ingen horisontell scroll, `260 cm` och `40 cm` läsbara |
| Nätverk | 62 förfrågningar, samtliga 200 |
| Konsolen | Inga fel från appen |

### Offline — servern verkligen avstängd

Servern stoppades och sidan laddades om:

- *Last och släp*, tidigare besökt: **7 av 7 ritningar** hämtades ur
  `vagklar-source-images`.
- *Krockskydd i bilen*, aldrig besökt medan servicearbetaren styrde: **0 av 4**
  bilder fanns i cachen, och alla fyra föll tillbaka på den skrivna
  beskrivningen med bildtext och kreditering intakta. Ingen trasig bildikon.

Det är det avsedda beteendet, inte en brist: källbilderna precachas inte, vilket
håller installationen liten. En lektion man har läst fungerar offline; en man
aldrig öppnat degraderar till text — och gör det läsbart.

### Vad genomgången hittade och som rättades

1. **Registret angav fel mått för sju bilder.** `kultryck-hogt` stod som
   960×211 men filen är 960×299, och tre äldre foton stod som 960×540 fast de
   är närmast kvadratiska. Layouten reserverar en ruta ur de talen, så bilden
   ritades mindre än utrymmet den fått. Måtten rättades mot filerna, och ett
   test läser dem nu ur WebP-huvudet.
2. **Förstoringsknappen låg ovanpå ritningen.** På ett foto finns slack i
   hörnet; en ritning är beskuren till sitt innehåll, så knappen hamnade på den
   bogserade bilen. Den ligger nu under plattan. (Två mellansteg dit fungerade
   inte: `padding` på ramen kröp ihop bilden, och `position: static` inuti ramen
   klipptes bort av `overflow: hidden`.)
3. **Ritningar krediterades som `Foto:`.** Nu `Illustration:`, valt av `kind`.
4. **Fyra godkända foton användes inte av något.** De dubblerade undervisning
   som en bättre bild i samma lektion redan skötte, och är satta till `retired`
   med skäl. Filerna är borttagna ur bygget.

### Kvarstående

- Förstoringen ger lite för en bred remsritning: figuren fyller redan spalten,
  så helskärm tillför ingen upplösning. Den fungerar, men den hjälper mindre än
  den gör på ett foto.
- Sju bilder ligger utanför sitt kapitels sidintervall i
  `docs/SOURCE-PAGE-AUDIT.md`. Samtliga är foton vars *ämne* hör till ett annat
  kapitel än sidan de trycktes på — förväntat, och redovisat i rapporten.

## Egna ritningar för däck och trafikolyckor (2026-09-02)

Femton ritningar gjorda för Vägklar togs in där källan inte har någon bild som
lär ut saken. Genomgången kördes mot ett riktigt bygge (`npm run preview`).

### Vad som kontrollerades

| Yta | Resultat |
| --- | --- |
| Lektionen *Däcken* — 5 ritningar | Alla renderar |
| Lektionen *När det går fel* — 3 ritningar | Alla renderar |
| Lektionen *Krockskydd i bilen* — 3 ritningar + 3 källbilder | Alla renderar |
| Kontrollfrågorna | Ritningen visas, bildtexten döljs — inget svar läcker |
| Provsimuleringen | Ett prov innehöll en ritningsfråga (nr 41); den renderade med rätt kreditering |
| Kreditering | `Illustration: Vägklar · © 2026 Jimmy Eliasson`, aldrig källans rättighetshavare |
| Mörkt och ljust läge | Ritningen ligger på fast ljus platta; grönt/rött behåller sin betydelse |
| 320, 360, 375, 412 px | Ingen horisontell scroll, inga figurer bredare än sidan |
| Textöverflöd | 20 figurrenderingar granskade automatiskt, 0 klippta etiketter |

### Textöverflöd — mätt, inte ögonmätt

SVG bryter inte text. En etikett som är bredare än sin `viewBox` klipps rätt av,
tyst, och syns bara om man råkar titta på just den figuren. Genomgången kör
därför en mätning i webbläsaren: varje `<text>` i varje renderad figur jämförs
med figurens `viewBox`.

Första körningen hittade **fem** klippta etiketter som inte hade upptäckts vid
en vanlig genomläsning:

1. `monsterdjup` — två rader brödtext bredare än figuren, och måttet `1,6 mm`
   utanför högerkanten
2. `krockvald-hastighet` — `4×` utanför kanten, och en förklarande mening 21
   enheter för bred åt båda hållen
3. `nackskydd-position` — ordet `påkörd` delvis utanför kanten
4. `dackslitage-fraga` — `ursprunglig höjd` klippt i vänsterkanten

Samtliga rättade. Efter rättning: 0 av 20 figurrenderingar med överflöd.

### Två ritningar gjordes om efter att ha setts i appen

**`dackslitage-fraga`** var först ritad uppifrån. Slitna och hela partier blev då
två snarlika gråtoner, och bilden gick inte att läsa utan att först få veta vad
man såg. Ritad i genomskärning i stället är slitaget en *höjd*, och skillnaden
syns direkt.

**`tre-kollisioner`** hade bilen ritad en bit ifrån hindret, vilket läste som en
bil parkerad nära en vägg snarare än en som kört in i den. Nosen ligger nu mot
ett streckat hinder, och den åkande är ritad som en egen figur ovanpå bilen.

### Offline — servern verkligen avstängd

Servern stoppades och sidan laddades om. **Samtliga 11 lektionsritningar
renderade**, i alla tre lektionerna.

Det är en verklig skillnad mot de licensierade bilderna, som inte precachas: en
lektion man aldrig besökt visar dem som text. Ritningarna är vektorer i en
JavaScript-chunk som Workbox precachar, så de finns där från första
installationen — det syntes tydligt i *Krockskydd i bilen*, där de egna
ritningarna ritades ut medan det licensierade fotografiet föll tillbaka på sin
beskrivning.

### Prestanda

Ritningarna får inte kosta något vid start. Registret hamnade först i den
eagerly laddade `content`-chunken och drev upp startpaketet med 5 kB gzip;
`vite.config.ts` håller nu både registret och ritningarna utanför den.

| | Före | Efter |
| --- | ---: | ---: |
| Startpaket (gzip) | 163 581 B | 164 307 B |
| Precache | 53 poster / 1 335 KiB | 55 poster / 1 383 KiB |

De 726 byte som återstår är de fem nya frågorna i det genererade frågeindexet,
inte ritningarna.


## P1-kö, provtestets instabilitet och extrem reflow (2026-09-02)

### Det instabila provtestet — orsak, inte symptom

`ExamRunnerPage.test.tsx` föll sällan och oförklarligt. Orsaken visade sig vara
två saker som förstärkte varandra.

Provet genereras från `now ^ Math.random()`, så varje körning fick ett nytt
prov. Testet letade sedan upp svarsknappen genom att bygga ett **reguljärt
uttryck av de trettio första tecknen i det rätta svaret**. `omk-001`:s rätta
svar är `Till vänster.` — och punkten är ett jokertecken. Uttrycket matchade
därför även `Till vänster på landsväg och till höger i tätort.`, två knappar
träffades och `getByRole` kastade.

Sannolikheten mättes i stället för att gissas: över 2 000 genererade prov låg en
sådan fråga i plats ett i **0,30 %** av fallen. En körning på trehundra.

**Åtgärd**, båda halvorna:

- `Math.random` *och* `Date.now` låses i sviten. Bara den ena räckte inte —
  provets nedräkning mäts mot `Date.now`, så ett låst frö med levande klocka
  gav en deadline i det förflutna och provet omdirigerade innan det renderades.
  Klockan stubbas i stället för att fejkade timers installeras, så `userEvent`
  ligger kvar på riktiga timers.
- Svar matchas på **hela sin text som delsträng**, aldrig som mönster.

Att det är säkert att göra så vilar på ett innehållsvillkor, så villkoret
kontrolleras: `answers are distinguishable` underkänner ett svar vars text är en
delsträng av ett annat svar i samma fråga. Noll i dag.

**Stresskörning:** 100 hela körningar av testfilen i följd, **0 misslyckanden**.
Vid den gamla felfrekvensen hade 100 körningar gett ungefär 26 % chans till minst
ett fall — så körningen ensam bevisar inte stabilitet. Det som gör det är att
testet nu är deterministiskt till sin konstruktion, och ett test hävdar det
direkt: samma prov dras varje gång.

### Extrem reflow — 320 px vid 200 % text

Emulerat genom att dubbla rotens teckenstorlek till 32 px, vilket är rätt
motsvarighet eftersom hela typskalan är rem-baserad.

**Före:** 7 av 15 rutter orsakade horisontell scroll.
**Efter:** 0 av 15.

| Orsak | Var | Åtgärd |
| --- | --- | --- |
| `white-space: nowrap` på knappetiketter | överallt | Får radbrytas; "Exportera eller radera min data" höll knappen 439 px bred i en 204 px spalt |
| Flex-objekt utan `min-width: 0` | knappetikett | Ett flex-objekt krymper inte under sin min-content utan tillsägelse |
| Rutnät utan spårdefinition | `.panel` | Inline-stilar gör panelen till ett rutnät utan `grid-template-columns`; det implicita `auto`-spåret vägrar krympa och la ut en 350 px spalt i en 288 px panel |
| `white-space: nowrap` på pills | statusmärken | Får radbrytas |
| Saknad `overflow-wrap` | listrader, kategorinamn, callouts | `anywhere`, inte `break-word` — bara `anywhere` krymper min-content |
| Klippt text i bottennavigeringen | `.navLabel` | Ellips ersatt med radbrytning; en etikett kapad till "Utveckl…" är en etikett läsaren får gissa |

Bottennavigeringen visade sig vara ett *symptom* i fem av rutterna, inte en
orsak: med den dold var överflödet oförändrat. Kontrollmätning på en ren rutt
gav 320 px bredd och fem 64 px-spalter.

**Kontrollerat efteråt vid 320×568, 200 % text:** alla 15 rutter, träningsfråga,
frågeåterkoppling, provfråga och frågeöversikten. Översikten har 70 mål på
36×36 px — under 44 px men klart över WCAG 2.2 AA:s 24 px.

### Vanlig responsiv genomgång

| Bredd | Resultat |
| --- | --- |
| 320, 360, 375, 390, 412, 430, 768, 1024, 1366, 1440, 1920 | Ingen horisontell scroll på någon granskad rutt |
| 320 / 375 / 390 vid 200 % text | Ingen horisontell scroll |

### A25, B6 och B7 — löst

Den stående osäkerheten om pilarnas sida gick att avgöra genom att rendera
källans egna märkesplanscher (s. 326 för A25, s. 328 för B6 och B7) och titta.

Alla tre var **speglade**, och A25 hade dessutom **fel färg**: märket bär två
svarta pilar, inte en svart och en röd. Att de tre var konsekventa med varandra
är just därför ingen läsning av koden avslöjade det.

| Märke | Källan visar | Appen visade |
| --- | --- | --- |
| A25 | svart nedåt vänster, svart uppåt höger | svart uppåt vänster, **röd** nedåt höger |
| B6 | svart nedåt vänster, röd uppåt höger | speglat |
| B7 | röd nedåt vänster, vit uppåt höger | speglat |

Betydelsen överlevde felet — på B6 pekar den röda pilen åt ditt håll, på B7 den
vita — så det var bildens riktighet som var fel, inte det som lärdes ut.
Alt-texterna sa dock "en svart och en röd" om A25, vilket var sakfel.
`opposedArrowSigns.test.ts` låser nu båda.

### Automatiserad grind mot klippt SVG-text

Webbläsarmätningen från förra passet är nu ett test. jsdom saknar layout, så
bredden uppskattas — medvetet generöst, så att den hellre klagar i onödan än
missar. Grinden bevisas åt båda hållen: den godkänner alla 15 ritningar och
underkänner alla sex etiketter som faktiskt låg klippta innan de rättades.

### Strukturell tillgänglighet

Genomsökning av sex rutter: **0 dubblettid, 0 rutter med fel antal `h1` eller
`main`, 0 namnlösa knappar eller länkar, 0 omärkta fält.**

Fokusmarkeringen kontrollerades med riktiga tangenttryckningar, inte
programmatiskt `focus()` — det senare utlöser inte `:focus-visible` och gav
först ett falskt larm om 17 kontroller utan markering. Med Tab: `:focus-visible`
matchar och ger 2 px heldragen kontur.

### Offline

Servern stoppades och sidan laddades om: skalet, hemvyn, träningsvyn och
provvyn renderade, Däck-lektionens fem egna ritningar ritades ut, och det
pågående provet gick fortfarande att återuppta.

### Prestanda

| | Före | Efter |
| --- | ---: | ---: |
| Startpaket (gzip) | 164 310 B | 164 341 B |

De 31 byten är CSS för radbrytning. Granskningsverktyget ligger utanför bygget
och kontrolleras av en byggrind som provades med planterade artefakter: både en
kopia av verktyget i `dist/` och en fil som innehöll ordet `granskningsverktyg`
fick bygget att falla.


## Vägmärken från källan (2026-09-03)

### Vad som gjordes

Bokens märkesbilaga (s. 324–361) katalogiserades och 257 märkesbilder klipptes
ut. 48 av dem ersätter Vägklars handritade vektorer; 10 märken behåller sin
ritning eftersom deras kod täcker flera varianter i verkligheten.

Märkena låg i PDF:en som **vektorinnehåll på sidan**, inte som inbäddade
rasterbilder, vilket är hela förklaringen till att tidigare extraktionspass
aldrig hittade dem.

### Vad extraktionen krävde

Tre saker som inte var självklara i förväg:

1. **Parning på position, inte ordning.** Sidorna bär en förlagslogotyp, så att
   räkna figurer och koder och zippa ihop dem förskjuter tyst allt efter första
   avvikelsen. Varje kods position hämtas ur sidans text och paras med figuren
   ovanför.
2. **Två sorters figurer.** Färgade märken hittas på mättnad. Tilläggstavlorna
   och fordonssymbolerna är svart streckteckning på vitt och är osynliga för det
   testet.
3. **Sidans text måste maskeras bort** innan streckteckningarna söks. Utan det
   parades sju koder med *bildtexten* i stället för med tavlan: T2 blev ordet
   "Avstånd", T11 blev "Utsträckning".

### Vad bytet avslöjade

Tolv fel i **beskrivningarna**, alla osynliga så länge ritningen var gjord efter
samma text som beskrev den.

Fem namngav en färg märket inte har:

| Märke | Beskrevs som | Är |
| --- | --- | --- |
| E1, E2, E3 motorväg / motortrafikled | blå | **gröna** |
| E5 tättbebyggt område | blå med vita hus | vit med svart siluett |
| C28 omkörning upphör | gul med röd ram | gul **utan** röd ram |

Sju beskrev fel innehåll: B2 sades läsa "STOPP" (skylten läser *STOP*), E11 "en
vit ring runt siffran 30" (skylten läser *max 30 km/tim*), T14 vit (röd), T19
och T16 vita (blå), T9 en gående med käpp (fem punkter), T11 en linje med
längdmått (en dubbelriktad pil).

En första automatisk färgkontroll flaggade 16 märken. Elva av dem var falska —
regexen `gul` matchade inuti ordet *rektangulär*. Kontrollen gjordes om med
ordgränser innan något rättades.

### En verklig svarsläcka

`vag-011` frågade *"Vilken form och färg har märket för väjningsplikt?"* — och
visade märket, med alt-texten "gul triangel med röd ram och spetsen nedåt" mot
det rätta svaret "En triangel med spetsen nedåt, gul yta och röd ram". Tre vägar
till svaret, en av dem uppläst av en skärmläsare.

Frågan visar inte längre någon bild. Ett test underkänner nu varje fråga som
både frågar om ett märkes utseende och visar det, och ett annat mäter
överlappet mellan `accessibilityText` och det rätta svaret.

Ett test som förbjöd märkets *namn* i frågetexten togs bort igen: sex frågor gör
det legitimt, som "Du passerar märket för tättbebyggt område … Vad gäller?", där
svaret är 50 km/h och namnet är premissen. Regeln var fel, inte innehållet.

### Filformat — mätt, inte antaget

| Kodning, 48 märken | Storlek |
| --- | ---: |
| WebP kvalitet 92, 320 px | 350 kB |
| PNG, 320 px | 903 kB |
| Palett-32 lossless WebP, 320 px | 227 kB |
| **Palett-32 lossless WebP, originalupplösning** | **212 kB** |

Originalupplösning blev *mindre* än nedskalat: platt vektorgrafik har en handfull
exakta färger, och omsampling uppfinner hundratals mellanliggande.

### Förhandscache — beslutet

Märkena precachas, fotografierna inte. 212 kB mot cirka 6 MB, alltså ungefär
15 % större installation. Vad det köper: var tionde provfråga visar ett märke,
och en märkesfråga utan sitt märke är olöslig snarare än svårare.

Kontrollerat med servern stoppad: fem slumpvis valda märkesfiler svarade
`image/webp`, medan ett fotografi som aldrig visats inte gick att hämta. Exakt
den avsedda uppdelningen.

### Prestandafälla som fångades

Startpaketet sköt först upp från 164 341 B till 225 169 B. Två orsaker:

1. Vite bäddar in resurser under 4 kB som base64, och 21 av de 48 märkena är
   mindre än så. `assetsInlineLimit: 0` löste det.
2. En första chunk-regel band hela `src/ui/illustrations/` till en lazy chunk —
   men `ScenarioStage` ligger i samma mapp och landningssidan behöver den
   direkt, så hela märkeschunken drogs tillbaka in i entryn genom en enda
   import. Reglerna namnger nu modulerna i stället för mappen.

Slutresultat: **168 226 B**, upp 3 885 B, vilket är manifestet och URL-kartan.

### Reflow

En regression hittades och rättades: `_pairItem` i märkesjämförelsen var ett
rutnät utan spårdefinition — samma implicita `auto`-spår som `.panel` hade —
och la ut en 203 px spalt i ett 156 px kort vid 200 % text.

| Läge | Resultat |
| --- | --- |
| 320, 375, 768, 1920 px, normal text | Ingen horisontell scroll |
| 320 px @ 200 % text, 10 rutter | Ingen |
| 375 px @ 200 % text | Ingen |
| 390 px @ 200 % text, 12 rutter | Ingen efter rättningen |

### Nya fotografier

Två vägmarkeringsmotiv som ingen godkänd bild visade: körfältspilar målade i
körbanan (s. 23) och ett övergångsställe bevakat av trafiksignal (s. 42). Båda
beskrivna efter vad som faktiskt syns i bilden, inte efter vad kapitlet handlar
om.


## Fullt märkesbibliotek och tilläggstavlor (2026-09-03)

### Registret

58 → **99 märken**, varav 17 tilläggstavlor. 89 ritas med bokens egen bild, 10
med Vägklars vektor.

Namnen är bokens egna. Extraktorn läser bildtexten ovanför varje kod, vilket
krävde två saker som inte syntes i förväg: rader måste klustras på y-led, annars
flätas två rader ihop bokstav för bokstav i PDF:ens ritordning
("Varningförtunnel" blev "iföl V t arnngrunne"), och mellanslagen måste räknas
fram ur glyfernas positioner eftersom bildtexterna är satta utan
mellanslagstecken alls.

### Tilläggstavlor som komponerbara objekt

En tavla är nu en post med ett `plate`-fält som säger vilken dimension den
begränsar — avstånd, utsträckning, riktning, tid, fordon, villkor, upplysning —
och med vilken fras den fortsätter märkets mening.

`RoadSignAssembly` ritar stolpen som en stolpe och beskriver hela posten som
**en** figur för hjälpmedel. De enskilda bilderna är dekorativa, annars läses
samma märke upp två gånger.

`interpretSignAssembly` sätter ihop meningen: *"En fara som inget annat
varningsmärke täcker — märket gäller 100 m längre fram."* Den är avsiktligt
grund och försöker inte modellera hur godtyckliga kombinationer samverkar
juridiskt.

12 kombinationsfrågor och en lektionssektion använder den.

### Varianter — sammansättning prövad och förkastad

C31 är varje hastighetsgräns, D1 varje riktning, T6 varje tidtavla, och boken
trycker en bild per kod. Frågan var om bokens ring kunde återanvändas med en ny
siffra.

Bokens C31 har ett rent gult fält, så det går rent tekniskt. Två saker fällde
det:

1. Boken trycker bara siffrorna **0, 1, 2, 3 och 5** någonstans i hela bilagan.
   4, 6, 7, 8 och 9 finns inte att hämta ur källan.
2. En sida-vid-sida-jämförelse mot Arial Bold visade tydligt synlig skillnad —
   bokens siffror är smalare, högre och har annan form.

Att kalla resultatet bokens artwork vore fel. De tio behåller sin vektor.

### Märket i verkligheten

Fyra par av bokens märkesbild bredvid ett av bokens fotografier där samma märke
faktiskt syns: A19 med avståndstavla på landsväg, A28 uppsatt i en kurva där
korsningen inte syns, E19 på en stolpe med fyra skyltar, B1 på en refug före en
cirkulationsplats.

Paren väljs bara när märket verkligen går att identifiera i bilden. Ett nytt
fotografi togs in för A28-paret (s. 180); de tre andra använder redan godkända
bilder.

### Katalog med sökning

99 märken är för många för ett rutnät. Katalogen söker på kod, namn och
betydelse och filtrerar på de sex sorterna, utan backend och utan eget index —
99 poster går att filtrera på varje tangenttryckning. Antalet träffar annonseras
i en live-region, eftersom en filtrering annars inte märks för den som inte ser
rutnätet krympa.

### Prestandafällor som fångades

Startpaketet gick först från 168 226 B till **177 073 B**, och orsaken var mina
egna chunk-regler.

1. Registret var fastnaglat i samma namngivna chunk som renderaren. Renderaren
   är eager — landningssidan når den via scenariovyn — så 99 märken av svensk
   prosa hamnade på startvägen.
2. En prefixmatchning på `RoadSign` fångade även `RoadSignAssembly`, som
   importerar registret. Reglerna namnger nu exakta filer.
3. `RoadSign` slutade importera registret helt. Alt-texten är nu anroparens
   ansvar, och typen är en union: antingen `decorative`, eller så är `alt`
   obligatoriskt. Att glömma beskrivningen är ett kompileringsfel i stället för
   en tyst omärkt bild.

Resultat: **164 675 B** — 3 551 B *under* utgångsläget, med 41 fler märken, 12
fler frågor och en sökbar katalog.

| | Före | Efter |
| --- | ---: | ---: |
| Startpaket (gzip) | 168 226 B | **164 675 B** |
| Märkeschunk (gzip) | — | 11 kB (var 23 kB) |
| Märkesbilder | 212 kB (48 st) | 397 kB (89 st) |
| Förhandscache | 1 674 KiB | 1 921 KiB |

### Egna ritningar — granskningen som förra passet lämnade ogjord

Kapitlen renderades och lästes, inte antogs.

| Ritning | Bokens motsvarighet | Beslut |
| --- | --- | --- |
| `baltets-vag` | s. 233 är ren text om bältet | **BEHÅLL** |
| `nackskydd-position` | s. 234 är ren text om nackskydd | **BEHÅLL** |
| `varningstriangel` | s. 179 är ren text | **BEHÅLL** |
| `krockvald-hastighet` | ingen figur i s. 174–187 | **BEHÅLL** |
| `tre-kollisioner` | ingen figur i s. 174–187 | **BEHÅLL** |
| Däckritningarna | s. 204–213 saknar figurer | **BEHÅLL** |

Genomgången hittade däremot två fotografier med identifierbara märken på s. 178
och s. 180, varav det senare var oanvänt — det är nu ett av
märke-i-verkligheten-paren.

### Reflow

En regression rättad: `_pairItem` i märkesjämförelsen saknade spårdefinition,
samma implicita `auto`-spår som `.panel` hade, och la ut en 203 px spalt i ett
156 px kort vid 200 % text.

| Läge | Resultat |
| --- | --- |
| 320, 375, 768, 1920 px, normal text | Ingen horisontell scroll |
| 320 px @ 200 %, 10 rutter | Ingen |
| 375 px @ 200 % | Ingen |
| 390 px @ 200 % | Ingen |

### Svarsläckor

Provet kontrollerat: en kombinationsfråga beskrevs som *"Väjningspliktsmärke:
gul triangel med röd ram och spetsen nedåt. Under märket: Gul rektangulär
tilläggstavla med röd ram och texten STOPP 200 m."* — utseende, inte innebörd —
och den sammansatta meningen renderades inte alls.


## Fotosvep, märkeskontext och visualTraits (2026-09-03)

### Fotosvepet

263 av källans fotokandidater genomsöktes maskinellt efter synliga vägmärken.
Svenska märken är mättat röda, gula och blå mot en omvärld som mest inte är det,
och en märkesyta är kompakt och ungefär lika bred som hög — samma signal som
användes för att hitta märkena i bilagan. 114 foton hade minst en sådan yta;
varje kandidat klipptes ut och förstorades.

Att titta är hela poängen. Identiteten får inte komma från kapitelrubriken —
tidigare i det här arbetet märktes ett omkörningsfoto som ett möte just så.

Bland de 55 redan godkända fotona bekräftades märken i tjugo, och sex nya par
byggdes av dem. Där utsnittet inte avgjorde vilket märke det var gjordes inget
par: `korfaltsvagvisare-korsning` och `smal-viadukt-skymd-utfart` hade
märkesliknande ytor som vid förstoring visade träd respektive undersidan av en
viadukt.

### Ett verkligt fel som svepet hittade

Fotot som låg registrerat som `forbud-att-stanna` visar **C35, förbud mot att
parkera** — ett snedstreck, inte ett kryss. Beskrivningen sa ordagrant "ett
blått runt märke med rött kryss", och lektionens bildtext lärde ut ett
stannandeförbud.

Ett streck och ett kors är två olika regler: med ett kors får du inte ens
stanna, med ett streck får du stanna men inte parkera. Posten heter nu
`forbud-att-parkera-overgangsstalle`, beskrivningen säger vad bilden visar, och
lektionen lär ut skillnaden i stället för fel regel.

### visualTraits — från 41 till 115

Färgerna läses ur märkets egen bild av `scripts/derive-sign-traits.py`. Att
härleda dem ur alt-texten hade gjort testet cirkulärt, och det var fel alt-text
som startade hela det här arbetet.

Två enklare metoder prövades först och båda var fel på ett sätt som ser rimligt
ut tills man kontrollerar:

1. **Mitten och kanten.** En triangels mitt landar på den svarta symbolen och
   hörnen av dess utsnitt är vit sida, inte röd ram. Slutsats: varje
   varningsmärke är svart med vit ram.
2. **Störst yta vinner.** På ett A-märke täcker den röda ramen mer av utsnittet
   än det gula fältet. Slutsats: varningsmärkena är röda.

Det som fungerar är att respektera formen: sidan flood-fylls bort, märket
eroderas, och den färg som fyller kärnan är fältet. Kontrollerat mot nio kända
märken innan något skrevs.

Fyra fick ändå rättas för hand efteråt — B3 och B8 har en vit triangel som
fyller kärnan, B5 en bred vit ram — och det står i skriptets kommentar som en
känd begränsning snarare än som en lösning.

### Alt-mot-bild som permanent grind

Testet jämför nu strukturerade traits mot prosan. Tre buggar i grinden själv
fick rättas innan den var värd att lita på:

- `\b` i JavaScript är ASCII-baserat, så `\bblå\b` matchar **aldrig**. Det slog
  tyst av kontrollen för alla blå märken — tjugoåtta rapporterades sakna färg i
  sin beskrivning fast alla säger "Blå".
- Färgen närmast formordet vinner. "Vit skylt med en röd symbol" rapporterades
  som ett rött märke, alltså motsatsen till vad meningen säger.
- Tryckt text jämförs med mellanslag borttagna: skylten läser "10%", prosan
  skriver "10 %", och det är typografi, inte oenighet.

Grinden testar numera sig själv på alla tre.

### Registret

99 → 115 märken. A37 spårvägskorsning och A39 kryssmärke behövdes för par;
C10, C11, C14 och C15 var namngivna luckor; fyra F-märken och sex
S-fordonssymboler kom in med egen plats i vägmärkeslektionen — symbolerna hör
ihop med symboltavlan, vägvisningen med körfältsvalet.

| | Före | Efter |
| --- | ---: | ---: |
| Märken | 99 | 115 |
| Med bokens bild | 89 | 105 |
| visualTraits | 41 | 115 |
| Märken med trafikfoto | 4 | 10 |
| Märkesbilder på disk | 397 kB | 481 kB |
| Startpaket | 164 675 B | 165 891 B |
| Förhandscache | 1 921 KiB | 2 029 KiB |

### Reflow

| Läge | Resultat |
| --- | --- |
| 320, 375, 390, 1440 px normal text | Ingen horisontell scroll |
| 320 px @ 200 %, 10 rutter | Ingen |
| 375 px @ 200 % | Ingen |
| 390 px @ 200 % | Ingen |
