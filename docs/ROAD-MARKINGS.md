# Vägmarkeringar

Vägmarkeringar är det område där de flesta felen kommer av samma missförstånd:
markeringen antas gälla vägen, när den i själva verket gäller *körriktningen*. En
kombinerad linje är heldragen för den ena föraren och streckad för den andra
samtidigt. Därför är registret byggt så att den skillnaden inte går att beskriva bort.

Systemet speglar [vägmärkessystemet](ROAD-SIGNS.md) medvetet: samma sorts register,
samma sorts ritningar, samma validering. Skillnaden ligger i vad som ritas — ett märke
står vid sidan av vägen, en markering ligger i den.

## Registret

[`src/content/road-markings.ts`](../src/content/road-markings.ts) är den enda plats
som vet vad en markering betyder.

```ts
{
  id: 'kombinerad-linje',
  code: 'M10',
  name: 'Mittlinje och heldragen linje',
  category: 'langsgaende',
  meaning: 'En heldragen och en streckad linje bredvid varandra, en åt varje håll.',
  forDriver: 'Linjen närmast dig avgör. Är den heldragen får du inte korsa den, …',
  altText: 'Vägmarkering: en heldragen vit linje bredvid en streckad vit linje …',
  tags: ['kombinerad', 'heldragen'],
  relatedSignIds: [],
  similarMarkingIds: ['heldragen-linje', 'mittlinje'],
  subcategory: 'vagmarkeringar',
}
```

`meaning` och `forDriver` hålls isär med flit. Det första säger vad markeringen *är*,
det andra vad den kräver av dig — och för längsgående linjer är det andra sidoberoende.
Ett test kräver att de skiljer sig åt och att båda är riktiga meningar, just för att
förhindra att någon skriver samma sak två gånger och tappar distinktionen.

Koderna följer Vägmärkesförordningen (2007:90), M-serien. `MARKING_BY_ID` och
`getRoadMarking()` är uppslagen; `MARKING_CATEGORY_LABELS` ger rubrikerna.

### Kategorier

| Kategori | Vad | Exempel |
| --- | --- | --- |
| `langsgaende` | Linjer längs körriktningen | M1 mittlinje, M8 heldragen, M2 kantlinje |
| `tvargaende` | Linjer tvärs körbanan | M13 stopplinje, M14 väjningslinje |
| `symbol` | Tecken målade i körbanan | M19 körfältspilar, M29 hastighet |
| `omrade` | Ytor | M9 spärrområde |

## Ritningarna

[`src/ui/illustrations/markingGlyphs.tsx`](../src/ui/illustrations/markingGlyphs.tsx)
ritar varje markering **i sitt sammanhang**: på en vägyta, sedd uppifrån, med
körriktningen uppåt. En heldragen linje på vit bakgrund är en linje; samma linje på
asfalt är en vägmarkering. Det är skillnaden mellan att känna igen formen och att
känna igen situationen.

Färgerna är fasta gråtoner, inte temavariabler. En vit linje på mörk asfalt måste se
likadan ut i ljust och mörkt läge — annars byter kontrasten håll och bilden blir
motsägelsefull.

Hjälparna `Road`, `DashRun`, `SolidRun` och `TravelArrow` gör att en ny markering
oftast är några rader, inte en ny ritning.

Renderas via [`RoadMarking`](../src/ui/illustrations/RoadMarking.tsx), som hämtar
tillgängligt namn ur registret. `decorative` stänger av det när markeringen redan
beskrivs i text intill.

## I innehållet

**Lektioner** använder två block, precis som märkena:

```ts
{ kind: 'markingGrid', title: 'Längsgående markeringar', markingIds: [...] }
{ kind: 'markingCompare', leftId: 'mittlinje', rightId: 'varningslinje', … }
```

Ett test kräver att varje `markingCompare` jämför två markeringar som faktiskt är
listade som förväxlingsbara i registret. En jämförelse mellan två orelaterade
markeringar lär ut en skillnad ingen skulle missa.

**Frågor** pekar på en markering genom `image.illustration`:

```ts
marking('vajningslinje', 'Vägmarkering: en rad vita trianglar tvärs över körbanan.')
```

Samma fält som för märken. `QuestionCard` väljer renderare på id, så en fråga är
författad likadant oavsett vilket register bilden kommer ur.

## Scenariolabbet

Scenarier ritar sina markeringar i scenen — en stopplinje ska ligga där i korsningen,
inte som en ikon bredvid. De använder därför `ScenarioStage`s egna former, men är
kopplade till registret **genom data**:

```ts
export const SCENARIO_MARKING_KIND_TO_ID: Record<string, string> = {
  'stop-line': 'stopplinje',
  'yield-line': 'vajningslinje',
  crossing: 'overgangsstalle-m15',
  'cycle-crossing': 'cykelpassage-m16',
  arrow: 'korfaltspilar',
};
```

Ett test kräver att varje markeringstyp som förekommer i något scenario finns i den
tabellen och pekar på en markering som existerar. Ett nytt scenario kan alltså inte
införa en markering som saknar betydelse, kod och alt-text någon annanstans i appen.

Märken i scenarier går längre: de renderas av samma `RoadSign`-komponent som resten av
appen, och ett test kräver att varje `scenario.signs[].sign` finns i det centrala
registret.

## Validering

`validateContent` kontrollerar registret vid varje testkörning och i
`npm run report:content`:

| Kod | Fångar |
| --- | --- |
| `duplicate-marking-id` | Två markeringar med samma id |
| `marking-bad-category` | Kategori utanför de fyra |
| `marking-without-name` | Namn som inte säger något |
| `marking-without-meaning` | `meaning` eller `forDriver` för tunn |
| `marking-without-alt` | Alt-text som inte beskriver utseendet |
| `marking-unknown-subcategory` | Delområde som inte finns i taxonomin |
| `marking-without-glyph` | Registrerad markering som inte kan ritas |
| `marking-dangling-sign` | `relatedSignIds` som pekar i tomma luften |
| `marking-self-similar` | Markering listad som förväxlingsbar med sig själv |
| `marking-dangling-similar` | Förväxlingspar som inte finns |
| `unknown-marking` | Fråga som pekar på en markering utan ritning |

Kontrollerna är testade mot planterade fel, inte bara mot det riktiga registret — ett
test som bara körs på korrekt data bevisar inte att det upptäcker något.

## Lägga till en markering

1. Lägg posten i `road-markings.ts` med M-kod, `meaning`, `forDriver` och alt-text
2. Rita den i `markingGlyphs.tsx` med `Road` + hjälparna
3. Länka förväxlingspar åt minst ett håll
4. `npm test` — registret, ritningarna och valideringen kontrolleras tillsammans

Vill du också fråga om den: lägg frågan i
[`vagmarkeringar.ts`](../src/content/questions/vagmarkeringar.ts), kör
`npm run generate:index` och testa igen.

## Rättigheter

Markeringssystemet är offentlig svensk reglering. Vägklar gör inget anspråk på
markeringarna som sådana — bara på ritningarna, texterna och koden i det här
förvaret. Se [SOURCES-AND-RIGHTS.md](SOURCES-AND-RIGHTS.md).
