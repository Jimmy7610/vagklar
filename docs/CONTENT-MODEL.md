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
}
```

`verifiedAt: null` är avsiktligt ärligt. Se
[QUESTION-AUTHORING.md](QUESTION-AUTHORING.md) för granskningsflödet.

## Lektioner

En lektion är en ordnad lista av block — `paragraph`, `rule`, `list`, `memory`, `example`,
`illustration`, `warning` — plus id:n till kontrollfrågor **ur den vanliga frågebanken**. Det
betyder att en lektionskontroll matar samma behärskningsdata som all annan träning.

## Scenarier

Ett scenario är data, inte kod: en layout, en lista positionerade trafikanter i ett 100×100-rum,
och antingen en korrekt ordning eller en uppsättning riskpunkter. Nya situationer författas som
data — ingen ny ritkod behövs.

Varje scenario bär `accessibilityText` som beskriver situationen fullständigt, och varje
interaktion har ett listbaserat alternativ. Övningen kräver alltså aldrig att man pekar på en bild.

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
