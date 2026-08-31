# QA

Det här dokumentet beskriver vad som faktiskt har kontrollerats, hur, och vad som **inte** har
kontrollerats. Inget här är påstått utan att ha körts.

Senast genomförd: 2026-09-01, mot produktionsbygget serverat med `npm run preview`
(`http://localhost:4173/vagklar/`) i en Chromium-baserad webbläsare.

---

## Automatiserade tester

`npm test` — **190 tester i 13 filer, alla gröna.**

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

Några tester finns specifikt för att låsa fast beteenden som är lätta att råka förstöra:

- provberedskapen får **inte** straffa en elev för delar som inte går att mäta än
- provsvar får **inte** röra behärskningen förrän provet lämnats in
- en skrivning som var i luften när eleven raderade allt får **inte** återuppliva datan
- ett rätt svar man gissat sig till får **inte** väga lika mycket som ett man var säker på

---

## Bygge och statisk analys

| Kontroll            | Resultat                                                        |
| ------------------- | --------------------------------------------------------------- |
| `npm run lint`      | 0 fel, 3 varningar (samtliga `react-refresh/only-export-components`, rör bara HMR i utveckling) |
| `npm run typecheck` | Rent. Strikt TypeScript, `noUncheckedIndexedAccess` på, inga `any` |
| `npm run build`     | Lyckas                                                           |

Bundlestorlek (gzip):

| Chunk        | Rå      | Gzip   |
| ------------ | ------- | ------ |
| `vendor`     | 198 kB  | 62 kB  |
| `content`    | 166 kB  | 49 kB  |
| `index`      | 129 kB  | 39 kB  |
| `router`     | 39 kB   | 14 kB  |
| CSS          | 48 kB   | 10 kB  |

`content` är frågebanken, lektionerna och scenarierna. Den är stor för att den *är* produkten, och
den precachas en gång.

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
