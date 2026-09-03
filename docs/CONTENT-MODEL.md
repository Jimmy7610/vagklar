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

## Vägmärken

[`src/content/road-signs.ts`](../src/content/road-signs.ts) beskriver varje märke
Vägklar kan rita: kod ur Vägmärkesförordningen, namn, kategori, kort och lång
innebörd, alt-text, delområde och vilka märken det förväxlas med. Ritningarna ligger
separat i `ui/illustrations/signGlyphs.tsx`, så registret är ren data som domänlagret
kan validera utan React.

Lektioner visar märken med blocken `signGrid` och `signCompare`; frågor renderar ett
märke med `image: sign(id, alt)`. Se [ROAD-SIGNS.md](ROAD-SIGNS.md).

## Vägmarkeringar

[`src/content/road-markings.ts`](../src/content/road-markings.ts) är samma sorts register
för markeringar i vägbanan, med M-koder ur Vägmärkesförordningen. Två fält i stället för
ett meningsfält: `meaning` säger vad markeringen är, `forDriver` vad den kräver av dig.
De hålls isär för att en längsgående linje betyder olika saker för de två
körriktningarna — en kombinerad linje är heldragen för den ena föraren och streckad för
den andra samtidigt.

Lektioner använder `markingGrid` och `markingCompare`; frågor pekar ut en markering med
`image: marking(id, alt)`. Renderaren väljer register på id, så en fråga författas
likadant oavsett om bilden är ett märke eller en markering. Se
[ROAD-MARKINGS.md](ROAD-MARKINGS.md).

## Granskningsstatus

`status` är inte dekoration. `LEARNER_VISIBLE_STATUSES` avgör vad som når banken,
och `verified` bär sin egen bevisbörda: validatorn avvisar den utan `verifiedAt`,
`verifiedBy` och `verificationSourceIds`. `rejected` behåller `reviewNotes` så att
skälet överlever. Se [VERIFICATION-WORKFLOW.md](VERIFICATION-WORKFLOW.md).

## Källbilder i innehållet

En fråga pekar på ett fotografi med `sourceImageId`; en lektion med blocket
`sourceImage` (`imageId`, valfri `prompt` och `caption`). Ingetdera bär
attribution — den kommer ur registret, så den kan inte glömmas på anropsplatsen.

Bildtexten visas i lektioner men **inte** i frågor: den säger vad bilden lär ut,
vilket är precis det frågan ber eleven komma fram till. Ett test kontrollerar
dessutom att bildtexten inte smugit sig in i frågetexten i stället.

Varje yta som visar en fråga måste visa alla tre sorters illustration —
fotografi, vägmarkering och vägmärke. Provet renderade länge bara märkena, vilket
gjorde varje bildburen fråga obesvarbar just där. Ett test går igenom källkoden
för både `QuestionCard` och `ExamRunnerPage` och kräver alla tre.

## Frågeindexet

[`src/content/question-index.ts`](../src/content/question-index.ts) är en **genererad**
sammanfattning av banken — id, kategori, delområde, svårighet, status, regel — som
hydreringen och behärskningsmodellen använder i stället för hela frågor. Kör
`npm run generate:index` efter varje bankändring; ett test jämför den mot banken. Se
[CONTENT-LOADING.md](CONTENT-LOADING.md).

## Källbilder

Fotografier ur den licensierade källan beskrivs i
[`src/content/source-images.ts`](../src/content/source-images.ts). Registret är den enda
plats som vet vad en bild visar, var den kommer ifrån och vem som äger den — frågor och
lektioner refererar till en post via id och bär aldrig egen attribution.

```ts
interface SourceImage {
  id: string;
  sourceId: string;        // post i SOURCES
  sourcePage: number;      // sida i den källan
  subcategory: string;     // Vägklars taxonomi
  chapter: string;         // kursplanens kapitel
  rightsHolder: string;
  usedWithPermission: boolean;
  altText: string;         // kort, beskriver vad som syns
  longDescription: string; // så uppgiften går att lösa utan att se bilden
  caption: string;
  usage: 'theory-lesson' | 'question-image' | 'supporting-reference';
  asset: string;           // slug som pekar ut filerna
  width: number; height: number;   // filens verkliga mått, testat mot disken
  kind?: 'photo' | 'diagram';      // utelämnat betyder foto
  labelText?: string[];            // text tryckt inne i bilden, ordagrant
  status: 'approved' | 'candidate' | 'retired';
}
```

`kind` styr både utseende och kreditering: en ritning läggs på en fast ljus platta
som inte vänds i mörkt läge, och krediteras `Illustration:` i stället för `Foto:`.

`labelText` är den text som är *tryckt inne i bilden* — måttet `260 cm`, panelen som
lyser `ON`. Renderad som pixlar når den ingen som använder skärmläsare, och ingen
alls när filen saknas offline, så den läses ut i den dolda beskrivningen och i
textreservet. Ett test kräver att varje etikett också finns i `longDescription`.

`width` och `height` är inte dekoration: de sätter den bildruta layouten reserverar
innan filen kommit fram. Fel mått ger fel form på rutan, bilden ritas mindre än
utrymmet den fått och sidan hoppar när filen landar. Ett test läser därför de
verkliga måtten ur WebP-huvudet och jämför.

En fråga kopplas med `sourceImageId`, en lektion med blocket
`{ kind: 'sourceImage', imageId, prompt?, caption? }`. Bara `approved` renderas.

Två block till bär ett fotografi, och de gör det som par: `signInContext` sätter
bokens märkesbild bredvid ett foto där samma märke syns, `markingInContext` gör
detsamma för en markering och dess ritning. Båda tar ett `notice` — vad man ska
leta efter i fotot, aldrig vad märket eller markeringen betyder.

```ts
{ kind: 'signInContext',    signId,    imageId, notice }
{ kind: 'markingInContext', markingId, imageId, notice }
```

Paret är en påstådd koppling och kontrolleras som en sådan i
`src/domain/content/contextPairs.test.ts`: fotots beskrivning måste nämna
märkets egen fältfärg. Det låter enkelt och fångar just den sortens fel som
faktiskt inträffat — ett foto registrerat som stannandeförbud visade ett
parkeringsförbud, och lektionen lärde ut fel regel ur rätt bild.

`quizSafeAltText` och `quizSafeDescription` på en källbild är den text som läses
upp så länge en fråga på bilden är obesvarad. De finns bara där den ordagranna
beskrivningen skulle säga för mycket — och måttet är likvärdighet, inte tystnad:
texten får säga allt en seende ser, och ingenting en seende hade behövt räkna
ut. `src/domain/content/quizSafeText.test.ts` letar efter ordagranna fraser ur
det rätta svaret i det som läses upp.

Se [SOURCE-IMAGES.md](SOURCE-IMAGES.md) för extrahering, urval och optimering, och
[SOURCE-DIAGRAMS.md](SOURCE-DIAGRAMS.md) för bokens figurer.

### Egna ritningar

Vägklars egna undervisningsritningar ligger i ett **eget register**,
`src/content/original-visuals.ts`, inte som en flagga i källbildsregistret. De två
bär olika löften — en licensierad bild måste bevisa rättighetshavare, sida och
tillstånd; en egen ritning måste bevisa att den lär ut något — och att blanda dem
skulle göra båda otydliga.

```ts
interface OriginalVisual {
  id: string;
  kind: 'comparison' | 'sequence' | 'diagram';
  subcategory: string;     // Vägklars taxonomi
  chapter: string;         // kursplanens kapitel
  altText: string;
  longDescription: string; // så uppgiften går att lösa utan att se ritningen
  labelText: string[];     // text tryckt i figuren, ordagrant
  caption: string;
  rendererId: string;      // nyckel in i ORIGINAL_VISUAL_GLYPHS
  width: number; height: number;   // ritningens viewBox
  usage: 'theory-lesson' | 'question-image' | 'supporting-reference';
  status: 'approved' | 'draft' | 'retired';
  createdBy: string;       // alltid 'Vägklar'
  copyright: string;       // © 2026 Jimmy Eliasson
}
```

En fråga kopplas med `originalVisualId`, en lektion med blocket
`{ kind: 'originalVisual', visualId, prompt?, caption? }`. Validatorn avvisar samma
id i båda registren, en ritning som tillskrivs källans rättighetshavare, och en
fråga som pekar med fel fält — med ett meddelande som säger vilket fält som avsågs.

Se [ORIGINAL-VISUALS.md](ORIGINAL-VISUALS.md).

## Validering

[`src/domain/content/validation.ts`](../src/domain/content/validation.ts) är en ren
funktion som kontrollerar hela banken och skiljer på **fel** (får inte finnas) och
**varningar** (en människa bör titta). Den körs både i testsviten och av
`npm run report:content`, som skriver [CONTENT-VALIDATION.md](CONTENT-VALIDATION.md)
och avslutar med felkod om något är trasigt.

Vägmärkesregistret valideras på samma sätt: att ritning och post finns åt båda hållen,
att kodprefixet matchar kategorin, att förväxlingsparen pekar på märken som finns, och
att ingen fråga renderar ett märke som inte kan ritas.

Bildbaserat innehåll valideras på samma sätt: att bildfilen finns på disk, att bilden är
godkänd, att alt-text, långbeskrivning, rättighetshavare och tillståndsmarkering finns,
och att sidnumret ligger inom källan.

Samma modul innehåller en enkel dubblettdetektor: normaliserad jämförelse plus
Jaccard-likhet på ord. Exakt lika frågetext, och identiska svarsuppsättningar inom
samma delområde, behandlas som fel. Liknande formuleringar rapporteras bara — en
variant som med avsikt ändrar ett villkor ligger nära utan att vara fel.

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


## Verifieringens fingeravtryck

En fråga som är `verified` bär fyra saker utöver statusen: `verifiedBy`,
`verifiedAt`, `verificationSourceIds` och `verifiedFingerprint`.

Fingeravtrycket är en hash av frågans **materiella** innehåll — det som en
granskare faktiskt tog ställning till:

```
prompt · svaren och vilket som är rätt · ruleTested ·
shortExplanation · deepExplanation · källhänvisningarna
```

Allt annat är utanför. Svårighetsgrad, taggar, uppskattad tid och
granskningsnoteringar går att ändra på en verifierad fråga utan att
verifieringen faller, eftersom de inte ändrar vad som påstods.

`verifiedAgainstEditions` noterar utgåvan per källa, så att en ny upplaga av
boken syns som arbete att göra om snarare än som ett tyst antagande.

Se [VERIFICATION-WORKFLOW.md](VERIFICATION-WORKFLOW.md).


## Var ett vägmärkes bild kommer ifrån

Registret i `road-signs.ts` beskriver märket — kod, namn, betydelse, alt-text,
förväxlingar. Det säger ingenting om vilken bild som ritas.

Det avgörs av `src/content/road-sign-assets.json`, som genereras av
`scripts/optimise-book-signs.py`. Finns märket där ritas källans egen bild;
annars ritas Vägklars vektor. `RoadSign` gör valet per märke, och det
tillgängliga namnet kommer från registret i båda fallen.

Manifestet bär proveniensen: kod, sida i källan, beskärningens koordinater som
sidandelar, och måtten. Det gör extraktionen reproducerbar och gör att ett test
kan kontrollera att ingen beskärning används till två märken.

Se [LICENSED-SIGNS.md](LICENSED-SIGNS.md).


## Tilläggstavlor och varianter

Ett vägmärke kan nu bära tre fält utöver de vanliga.

`plate` gör posten till en tilläggstavla: den säger vilken dimension tavlan
begränsar och med vilken fras den fortsätter märkets mening.

`variant` skiljer poster som delar en officiell kod — C31 är varje
hastighetsgräns, D1 varje påbjuden riktning, T6 varje tidtavla. Koden förblir
den riktiga; varianten bär skillnaden.

`visualTraits` beskriver *bilden* — bakgrundsfärg, ram, text, pilriktning,
siffra — skilt från beskrivningen av vad märket betyder. Det finns för att ett
test ska kunna jämföra texten mot bilden i stället för mot en annan text, vilket
är precis vad som saknades när tolv beskrivningar visade sig vara fel om färg
eller innehåll.

`quizSafeAltText` är beskrivningen som används medan en fråga är obesvarad, för
de poster vars vanliga `altText` skulle säga för mycket.

Se [SIGN-ASSEMBLIES.md](SIGN-ASSEMBLIES.md).
