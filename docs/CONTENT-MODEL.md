# Innehållsmodell

Allt innehåll är statisk, typad TypeScript-data i `src/content/`. Ingen databas, inget CMS, inga
nätverksanrop — det är vad som gör hela appen körbar offline och deploybar som statiska filer.

## Taxonomi

16 kunskapsområden, 58 delområden. Området är det eleven ser; **delområdet är det motorn
resonerar om**. Skillnaden spelar roll: "svag på korsningar" är inte användbart, "svag på
utfartsregeln" är det.

Varje område bär en `examWeight` som styr hur stor plats det får i en provsimulering, och varje
delområde en `weight` för sin relativa tyngd inom området.

Se [`src/content/taxonomy.ts`](../src/content/taxonomy.ts).

## Fråga

```ts
interface Question {
  id: string;
  version: number;
  status: 'draft' | 'reviewed' | 'verified' | 'retired';
  category: CategoryId;
  subcategory: string;
  difficulty: 1 | 2 | 3;
  questionType: QuestionType;
  scenarioType?: ScenarioType;
  ruleTested: string;          // människoläsbar regelidentitet, t.ex. "Högerregeln"
  misconceptions: string[];    // vilka feltankar frågan är byggd för att avslöja
  prompt: string;
  answers: QuestionAnswer[];
  correctAnswerId: string;
  shortExplanation: string;    // visas direkt
  deepExplanation?: string;    // bakom "Förklara mer"
  memoryRule?: string;
  sourceReferences: SourceReference[];
  lastReviewedAt?: string | null;
  image?: QuestionImage;
  relatedQuestionIds?: string[];
  tags?: string[];
  estimatedTimeSec: number;
  accessibilityText?: string;  // beskriver bilden när frågan bygger på den
}
```

### Fälten som gör motorn möjlig

- **`ruleTested`** — grupperar frågor som testar samma sak. Det är så "Öva liknande" kan välja en
  *annan* fråga om samma regel, och så repetitionen kan variera i stället för att upprepa.
- **`misconceptionId` per svarsalternativ** — varje *felaktigt* alternativ kan märkas med den
  feltanke det avslöjar. Det är hela grunden för misstagsanalysen: fel grupperas efter tankefel,
  inte efter fråga.
- **`estimatedTimeSec`** — ger passens tidsuppskattningar och kalibrerar svarstidssignalen.
- **`accessibilityText`** — gör bildberoende frågor lösbara utan att se bilden.

### Svarsordning

Författare skriver alltid det rätta alternativet först. Byggaren
([`authoring.ts`](../src/content/questions/authoring.ts)) blandar sedan alternativen med en
deterministisk, id-fröad blandning. Positionen bär alltså ingen signal, samtidigt som ordningen är
stabil mellan sessioner och enheter. Ett test verifierar att det rätta svaret inte hamnar på samma
plats för ofta.

## Frågetyper

Modellen rymmer åtta typer. Fem besvaras med ett val ur en lista och delar renderare:
`multiple-choice`, `image-scenario`, `road-sign`, `calculation`, `situational-judgement`.

De tre interaktiva — `ordering`, `risk-spotting`, `interactive-placement` — levereras genom
Scenariolabbets egen modell, eftersom de har en helt annan interaktion. Arkitekturen hindrar dem
alltså inte; de bor bara på rätt ställe.

## Missuppfattningar

```ts
interface Misconception {
  id: string;
  label: string;        // "Utfartsregeln vs högerregeln"
  description: string;  // vad som brukar hända
  correction: string;   // hur det faktiskt ligger till
  subcategory: string;
}
```

30 namngivna feltankar, delade av flera frågor. De driver misstagsgruppering, insikter och
avdraget för återkommande missuppfattningar i provberedskapen.

## Källhänvisningar

```ts
interface SourceReference {
  name: string;          // "Trafikförordningen (1998:1276)"
  reference?: string;    // "3 kap. 21 §"
  url?: string;
  verifiedAt: string | null;  // null = ännu inte verifierad av sakkunnig
  ruleVersion?: string;
  sourceId?: string;     // post i SOURCES
  sourcePages?: number[];// sidor i den källan
}
```

`verifiedAt: null` är avsiktligt ärligt. Se
[QUESTION-AUTHORING.md](QUESTION-AUTHORING.md) för granskningsflödet.

`sourceId` pekar in i källregistret i [`src/content/sources.ts`](../src/content/sources.ts),
som är den enda platsen där en källa beskrivs — titel, utgivare, rättighetshavare,
upplaga och vilken rätt vi har att använda den. Källsidan i appen, kursplanen och
rättighetstexterna läser alla samma register, så attributionen inte kan glida isär.
Se [SOURCES-AND-RIGHTS.md](SOURCES-AND-RIGHTS.md).

## Kursplan

[`src/content/curriculum/curriculum.ts`](../src/content/curriculum/curriculum.ts) är
Vägklars karta över vad ett B-körkort kräver: 6 huvudområden, 39 kapitel och 173
begrepp, var och en med sidhänvisning till källan och en koppling till Vägklars egen
taxonomi.

```ts
interface CurriculumConcept {
  id: string;
  chapterId: string;
  majorArea: MajorAreaId;
  topic: string;
  sourcePages: number[];
  importance: 'core' | 'supporting' | 'peripheral';
  subcategory: string | null;  // null = ingen plats i taxonomin ännu
}
```

`subcategory: null` är den viktigaste signalen i hela filen: det är en del av
kursplanen som Vägklar ännu inte har någonstans att placera. Den räknas som en
lucka i stället för att tyst försvinna.

Filen innehåller **struktur, inte text** — rubriker, sidintervall och begreppsnamn.
Ingen brödtext ur källan återges.

## Täckning

[`src/domain/curriculum/coverage.ts`](../src/domain/curriculum/coverage.ts) jämför
kursplanen med frågebanken, lektionerna och scenarierna. Funktionen är ren, så
täckningen kan aldrig glida ifrån verkligheten: den *räknas fram*, den underhålls
inte för hand. `npm run report:coverage` skriver om
[CONTENT-COVERAGE.md](CONTENT-COVERAGE.md) ur samma funktion.

Ett begrepp räknas som täckt först vid tre frågor, starkt vid sex. Luckor
prioriteras 1–3 efter hur central kunskapen är.

## Lektioner

En lektion är en ordnad lista av block — `paragraph`, `rule`, `list`, `memory`, `example`,
`illustration`, `warning` — plus id:n till kontrollfrågor **ur den vanliga frågebanken**. Det
betyder att en lektionskontroll matar samma behärskningsdata som all annan träning.

## Scenarier

Ett scenario är data, inte kod: en layout, en lista positionerade trafikanter i ett 100×100-rum,
och antingen en korrekt ordning eller en uppsättning riskpunkter. Nya situationer författas som
data — ingen ny ritkod behövs.

Modellen bär numera också vägmärken (`signs`), vägmarkeringar (`markings`),
regelöverlägg (`overlays`) och varianter (`variants`). En variant är en `patch` som
ändrar situationen — "vad händer om din väg blir huvudled?" — och därmed det rätta
svaret. Fordon har `label`, `description`, `role` och en `path` som uppspelningen följer.

Varje scenario bär `accessibilityText` som beskriver situationen fullständigt, och varje
interaktion har ett listbaserat alternativ. Övningen kräver alltså aldrig att man pekar på en bild.

Se [SCENARIO-LAB.md](SCENARIO-LAB.md) för hela modellen och författningsreglerna.

## Integritetstester

[`src/domain/content/bank.test.ts`](../src/domain/content/bank.test.ts) håller innehållet ärligt:

- unika id:n
- exakt ett rätt svar, som finns bland alternativen
- minst tre alternativ med unika id:n
- rätt svar fördelat över positioner
- bara kända delområden, och området stämmer med delområdet
- bara kända missuppfattningar
- bara existerande `relatedQuestionIds`
- kort förklaring och minst en källa på varje fråga
- **ingen fråga får ha status `verified` utan verifieringsdatum**
- alla 16 områden täckta, och alla tre svårighetsgrader representerade

[`src/domain/curriculum/coverage.test.ts`](../src/domain/curriculum/coverage.test.ts)
gör samma sak för kursplanen: att varje begrepp hör till ett verkligt kapitel, att
varje kapitel hör till ett verkligt huvudområde, att kapitlens sidintervall varken
överlappar eller pekar utanför källans 367 sidor, att varje lektion pekar på kapitel
som finns, att en fråga bara får ange ett `sourceId` som existerar i registret — och
att rättighetstexterna faktiskt namnger tredjepartsinnehavaren och friskriver sig
från koppling till Trafikverket.
