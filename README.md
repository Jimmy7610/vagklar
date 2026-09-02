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
| `npm run verify`    | lint → typecheck → test → innehållsvalidering → build         |
| `npm run verify:build` | Kontrollerar att inga källdokument hamnat i `dist/`        |
| `npm run report:coverage` | Genererar om `docs/CONTENT-COVERAGE.md`                 |
| `npm run report:content` | Validerar banken och skriver `docs/CONTENT-VALIDATION.md` |
| `npm run generate:index` | Genererar om `src/content/question-index.ts` efter bankändringar |
| `npm run report:verification` | Bygger verifieringskön och det lokala granskningsverktyget |
| `npm run report:images` | Skriver `docs/IMAGE-COVERAGE.md` — var källbilderna sitter och var de saknas |
| `python scripts/review-source-images.py` | Kontaktkarta över bildkandidaterna, att välja ur |
| `npm run report:visuals` | Ritar alla märken och markeringar förstorade för visuell granskning |
| `npm run audit:pages` | Granskar varje sidhänvisning mot den faktiska sidtexten |
| `python scripts/extract-source-pages.py` | Bygger den lokala sidtextcachen som sidgranskningen kräver |
| `python scripts/extract-source-images.py --extract` | Tar ut bildkandidater ur källan (aldrig incheckade) |
| `python scripts/optimise-source-images.py` | Optimerar de kurerade bilderna till WebP |
| `python scripts/extract-source-diagrams.py` | Renderar sidor och klipper ut kuraterade ritningar |
| `npm run report:verification` | Bygger granskningskön och det lokala granskningsverktyget |

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
- [docs/CONTENT-LOADING.md](docs/CONTENT-LOADING.md) — index kontra bank, chunkar, startbudget
- [docs/ROAD-MARKINGS.md](docs/ROAD-MARKINGS.md) — registret för vägmarkeringar
- [docs/VERIFICATION-WORKFLOW.md](docs/VERIFICATION-WORKFLOW.md) — granskat kontra verifierat, och hur man verifierar
- [docs/BETA-READINESS.md](docs/BETA-READINESS.md) — vad som är kontrollerat, vad som inte är det
- [docs/IMAGE-COVERAGE.md](docs/IMAGE-COVERAGE.md) — bildstöd per kapitel, och oanvända bilder

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
| Frågor                         | 431 (84 lätta, 240 medel, 107 svåra)   |
| Kunskapsområden                | 17                                     |
| Delområden                     | 71                                     |
| Lektioner                      | 15                                     |
| Scenarier                      | 14 (med varianter)                     |
| Namngivna missuppfattningar    | 253                                    |
| Källbilder (används med tillstånd) | 63 (52 foton, 11 ritningar)        |
| Vägklars egna ritningar           | 15                                 |
| Ritade vägmärken               | 58                                     |
| Ritade vägmarkeringar          | 15                                     |
| Kursplanetäckning              | 179 av 179 begrepp i 39 kapitel        |

Allt innehåll är original, skrivet för Vägklar. Varje fråga bär källhänvisningar och en
granskningsstatus. Samtliga 423 frågor har status `reviewed` — internt granskat, inte
signerat av en sakkunnig. **Ingen fråga är verifierad**, och det är avsiktligt: statusen
`verified` kräver namn, datum och vilka källor som kontrollerades, och sätts bara av en
människa. Kön över vad som bör kontrolleras först finns i
[docs/VERIFICATION-QUEUE.md](docs/VERIFICATION-QUEUE.md); flödet i
[docs/VERIFICATION-WORKFLOW.md](docs/VERIFICATION-WORKFLOW.md).

Sidhänvisningarna är maskinellt granskade mot den faktiska texten på de citerade
sidorna — se [docs/SOURCE-PAGE-AUDIT.md](docs/SOURCE-PAGE-AUDIT.md).

### Kursplan och täckning

Innehållet mäts mot en kursplan i [`src/content/curriculum/curriculum.ts`](src/content/curriculum/curriculum.ts):
39 kapitel och 179 begrepp, med sidhänvisningar till den licensierade källan.
Täckningsrapporten i [docs/CONTENT-COVERAGE.md](docs/CONTENT-COVERAGE.md) **genereras**
ur den kartan och den verkliga frågebanken — kör `npm run report:coverage`. Den visar
öppet var materialet är tunt: sedan 1.1.0-beta.1 är 179 av 179 begrepp täckta med
minst tre frågor vardera, och inga luckor kvarstår.

Innehållet valideras dessutom maskinellt. `npm run report:content` skriver
[docs/CONTENT-VALIDATION.md](docs/CONTENT-VALIDATION.md) och avbryter med felkod om
banken har brutna referenser, omöjliga sidhänvisningar eller saknad attribution —
se [docs/CONTENT-VALIDATION.md](docs/CONTENT-VALIDATION.md).

Källorna redovisas i [docs/SOURCES-AND-RIGHTS.md](docs/SOURCES-AND-RIGHTS.md) och i appen
under **Källor**.

### Vägmärken

58 svenska vägmärken är ritade som vektorer med officiella koder ur
Vägmärkesförordningen, och beskrivs i
[`src/content/road-signs.ts`](src/content/road-signs.ts) med innebörd, alt-text och
vilka märken de brukar förväxlas med. Teoriskolan visar dem som rutnät per kategori
med jämförelsekort för de par som faktiskt blandas ihop. Se
[docs/ROAD-SIGNS.md](docs/ROAD-SIGNS.md).

### Vägmarkeringar

15 vägmarkeringar med M-koder ur Vägmärkesförordningen ritas i sitt sammanhang — på en
vägyta, sedd uppifrån, med körriktningen uppåt. Registret i
[`src/content/road-markings.ts`](src/content/road-markings.ts) håller isär vad
markeringen *är* och vad den kräver av dig, eftersom en längsgående linje betyder olika
saker för de två körriktningarna. Scenariolabbets markeringar är kopplade till samma
register. Se [docs/ROAD-MARKINGS.md](docs/ROAD-MARKINGS.md).

### Källbilder

62 bilder ur den licensierade källan används i lektioner och frågor där bilden gör
skillnad — att läsa en riktig gata går inte att lära ut i ord. De är kurerade för hand ur
263 kandidater, optimerade till WebP i två bredder, och registrerade med alt-text,
långbeskrivning och rättighetsdata i
[`src/content/source-images.ts`](src/content/source-images.ts).

Bilderna tillhör Hagberg Media AB och används med tillstånd. Varje bild visas med
kreditering. Se [docs/SOURCE-IMAGES.md](docs/SOURCE-IMAGES.md) för hela arbetsflödet och
[docs/SOURCE-DIAGRAMS.md](docs/SOURCE-DIAGRAMS.md) för bokens figurer, som lyder under
egna regler: de bär mått, och måtten måste finnas som text också.

### Egna ritningar

Där källan inte har någon bild som lär ut saken ritar Vägklar själv. Mönsterdjup,
lufttryck, vattenplaning, krockvåld och bältets väg över kroppen är sådana fall:
kapitlen är fulla av text om dem och nästan tomma på bilder, och ett par millimeter
mönsterdjup går inte att fotografera begripligt.

De 15 ritningarna ligger i ett eget register,
[`src/content/original-visuals.ts`](src/content/original-visuals.ts), skilt från det
licensierade — så att en egen ritning aldrig kan krediteras källans rättighetshavare
och tvärtom. De krediteras `Illustration: Vägklar · © 2026 Jimmy Eliasson`, är
vektorer i kod och fungerar därför offline utan att först ha visats.
Se [docs/ORIGINAL-VISUALS.md](docs/ORIGINAL-VISUALS.md).

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

Fotografier ur källan används i appen med tillstånd och visas alltid med kreditering till
Hagberg Media AB. Rättighetshavarens vattenstämpel i bilderna behålls.

Källdokumenten i `references/` är licensierat tredjepartsmaterial. De checkas aldrig in
(`.gitignore`), bundlas aldrig och publiceras aldrig; `scripts/verify-build.mjs` gör varje
sådant försök till ett byggfel, både lokalt och i CI. Se
[docs/SOURCES-AND-RIGHTS.md](docs/SOURCES-AND-RIGHTS.md).
