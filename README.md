# Vägklar

**Lär dig teorin. Förstå trafiken. Klara provet.**

Vägklar är en adaptiv teoriutbildning för svenskt B-körkort. Appen lär sig vad du kan, hittar dina
svaga områden och bygger nästa träningspass åt dig — helt lokalt i din webbläsare, utan konto och
utan server.

> Vägklar är en fristående träningsprodukt och är inte ansluten till eller godkänd av Trafikverket.
> Alla frågor är skrivna för Vägklar. Appen innehåller inga officiella provfrågor.

---

## Kom igång

```bash
npm install
npm run dev
```

Öppna adressen som skrivs ut (som standard `http://localhost:5173/vagklar/`).

### Skript

| Kommando            | Vad det gör                                                  |
| ------------------- | ------------------------------------------------------------ |
| `npm run dev`       | Utvecklingsserver med HMR                                    |
| `npm run build`     | Typkontroll + produktionsbygge + `verify:build`               |
| `npm run preview`   | Serverar `dist/` lokalt, inklusive service worker            |
| `npm run lint`      | ESLint                                                       |
| `npm run typecheck` | `tsc -b --force`                                             |
| `npm test`          | Vitest                                                       |
| `npm run verify`    | lint → typecheck → test → build (kör detta före commit)       |
| `npm run verify:build` | Kontrollerar att inga källdokument hamnat i `dist/`        |
| `npm run report:coverage` | Genererar om `docs/CONTENT-COVERAGE.md`                 |

Ikoner och Open Graph-bilden genereras från kod:

```bash
node scripts/generate-icons.mjs
```

---

## Arkitektur i korthet

```
src/
  content/     Frågebank, taxonomi, lektioner, scenarier, missuppfattningar (ren data)
  domain/      Ren affärslogik utan React — mastery, readiness, repetition, urval, prov
  storage/     IndexedDB-wrapper, schema, migrationer, defensiv inläsning, export/import
  app/         Store, React-bindningar, routing, layout, tema
  ui/          Designsystem: tokens, primitiver, ikoner, illustrationer
  features/    Skärmar (landing, hem, träning, prov, utveckling, teori, scenarier, inställningar)
```

Domänlagret är avsiktligt fritt från React. Hela den adaptiva motorn — behärskning,
provberedskap, repetitionsschema, frågeurval och provrättning — är rena funktioner som testas
utan att rendera något.

Läs vidare:

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — lagerindelning, tillstånd, routing
- [docs/KNOWLEDGE-ENGINE.md](docs/KNOWLEDGE-ENGINE.md) — behärsknings- och beredskapsmodellen
- [docs/PERSISTENCE.md](docs/PERSISTENCE.md) — lagring, schema, migrationer, export/import
- [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md) — tokens, komponenter, färgsemantik
- [docs/CONTENT-MODEL.md](docs/CONTENT-MODEL.md) — datamodellen för frågor och innehåll
- [docs/QUESTION-AUTHORING.md](docs/QUESTION-AUTHORING.md) — så skrivs och granskas nya frågor
- [docs/QA.md](docs/QA.md) — vad som testats och hur

---

## Lokalt först

Det finns ingen inloggning och ingen server. All utveckling sparas i webbläsarens IndexedDB:

- varje enhet och webbläsare har sin egen profil
- rensad webbplatsdata raderar utvecklingen — därför finns export
- `Inställningar → Exportera utveckling` skriver en versionerad JSON-fil
- import validerar varje post och visar en sammanfattning innan något ersätts

Om IndexedDB inte är tillgängligt (privat läge, blockerad lagring) faller appen tillbaka på
minnesläge och säger det rakt ut i gränssnittet.

---

## Distribution till GitHub Pages

Vägklar är byggd för att köras som statiska filer. Det finns ingen backend, inga API-nycklar och
inget serverberoende.

### 1. Sätt bas-sökvägen

Bas-sökvägen finns på **ett** ställe, i [`vite.config.ts`](vite.config.ts):

```ts
const BASE_PATH = process.env.VAGKLAR_BASE ?? '/vagklar/';
```

- Projektsida (`https://<användare>.github.io/<repo>/`): sätt den till `/<repo>/`
- Användar- eller organisationssida (`https://<användare>.github.io/`): sätt den till `/`

Workflowet nedan sätter `VAGKLAR_BASE` automatiskt från repots namn, så i normalfallet behöver du
inte ändra något.

### 2. Aktivera Pages

I repots inställningar: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

### 3. Pusha

Workflowet i [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) bygger och publicerar
vid varje push till `main`.

### Varför hash-routing?

GitHub Pages har inget omskrivningslager, så en direktladdning av `/utveckling/omrade/hogerregeln`
skulle ge 404. Vägklar använder därför `HashRouter`: varje adress går att ladda om, dela och
bokmärka, även under en underkatalog. Se [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## Innehåll

| Sak                            | Antal                                  |
| ------------------------------ | -------------------------------------- |
| Frågor                         | 147 (26 lätta, 92 medel, 29 svåra)     |
| Kunskapsområden                | 16                                     |
| Delområden med frågor          | 58 av 58                               |
| Lektioner                      | 10                                     |
| Scenarier                      | 6 (med varianter)                      |
| Namngivna missuppfattningar    | 30                                     |
| Kursplanekapitel               | 39 (173 begrepp)                       |

Allt innehåll är original, skrivet för Vägklar. Varje fråga bär källhänvisningar och en
granskningsstatus. Seedinnehållet har status `reviewed` — det är internt granskat men ännu inte
signerat av en sakkunnig. Se [docs/QUESTION-AUTHORING.md](docs/QUESTION-AUTHORING.md).

### Kursplan och täckning

Innehållet mäts mot en kursplan i [`src/content/curriculum/curriculum.ts`](src/content/curriculum/curriculum.ts):
39 kapitel och 173 begrepp, med sidhänvisningar till den licensierade källan.
Täckningsrapporten i [docs/CONTENT-COVERAGE.md](docs/CONTENT-COVERAGE.md) **genereras**
ur den kartan och den verkliga frågebanken — kör `npm run report:coverage`. Den visar
öppet var materialet är tunt: 90 av 173 begrepp är täckta, 19 saknar frågor helt.

Källorna redovisas i [docs/SOURCES-AND-RIGHTS.md](docs/SOURCES-AND-RIGHTS.md) och i appen
under **Källor**.

---

## Provsimulering

Simuleringen följer kunskapsprovets struktur. Värdena är konstanter i
[`src/domain/constants.ts`](src/domain/constants.ts), aldrig utspridda i koden:

| Värde                    | Konstant                 |
| ------------------------ | ------------------------ |
| 70 frågor                | `EXAM.totalQuestions`    |
| 5 räknas inte            | `EXAM.unscoredQuestions` |
| 52 av 65 för godkänt     | `EXAM.passThreshold`     |
| 50 minuter               | `EXAM.durationMinutes`   |

Vi gör inga anspråk på att veta vilka frågor som är oräknade i det riktiga provet. I Vägklar väljs
de fem deterministiskt utifrån provets startvärde och redovisas öppet efter inlämning.

---

## Licens, rättigheter och innehållsansvar

Innehållet i Vägklar är utbildningsmaterial, inte juridisk rådgivning. Trafikregler ändras — se
granskningsrutinen i [docs/QUESTION-AUTHORING.md](docs/QUESTION-AUTHORING.md) innan innehållet
används skarpt.

Vägklars programvara, design, egna illustrationer och eget originalinnehåll är
**© 2026 Jimmy Eliasson**. Material från Körkortonline.se / Hagberg Media AB används med
tillstånd och tillhör respektive rättighetshavare. På offentliga rättskällor görs inga
äganderättsanspråk.

Frågorna är originalfrågor skrivna för Vägklar — inte kopior av Trafikverkets provfrågor.
**Vägklar är ett självständigt träningsverktyg och är inte ansluten till, sponsrad av eller
godkänd av Trafikverket.**

Källdokumenten i `references/` är licensierat tredjepartsmaterial. De checkas aldrig in
(`.gitignore`), bundlas aldrig och publiceras aldrig; `scripts/verify-build.mjs` gör varje
sådant försök till ett byggfel, både lokalt och i CI. Se
[docs/SOURCES-AND-RIGHTS.md](docs/SOURCES-AND-RIGHTS.md).
