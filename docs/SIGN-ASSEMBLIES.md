# Märke plus tilläggstavla

En tilläggstavla betyder ingenting ensam. "100 m" är inte en regel — det är en
ändring av regeln som står ovanför. Det som är svårt för en elev är därför inte
någon av halvorna, utan att läsa dem tillsammans, och att visa dem som två
separata bilder med var sin bildtext uppmuntrar precis fel sak.

Därför är en stolpe ett objekt i Vägklar: en figur, en tillgänglig beskrivning,
en sammanlagd innebörd.

## Modellen

En tilläggstavla är en post i vägmärkesregistret som dessutom bär ett
`plate`-fält:

```ts
plate: {
  kind: 'distance',
  printedText: '100 m',
  combinedPhrase: 'märket gäller 100 m längre fram',
}
```

`kind` säger **vilken dimension** tavlan begränsar, och det är den som gör att
appen kan säga något vettigt om en kombination den aldrig sett: en
avståndstavla under vilket märke som helst betyder att regeln börjar längre
fram.

| `kind` | Vad tavlan gör | Exempel |
| --- | --- | --- |
| `distance` | Flyttar regeln framåt | T2 Avstånd, T3 Avstånd till stopplikt |
| `extent` | Sträcker ut den | T1 Vägsträckas längd, T11 Utsträckning |
| `direction` | Riktar den | T12 Riktning |
| `time` | Begränsar när | T6 Tidsangivelse |
| `vehicle` | Begränsar vilka fordon | T5 Totalvikt, T7 Rörelsehindrade |
| `condition` | Ställer ett villkor | T16 Avgift, T19 Boende |
| `information` | Upplyser om korsningen | T13 Flervägsväjning, T14 Flervägsstopp |

`combinedPhrase` är skriven för att **fortsätta** märkets mening, inte stå
själv. Den börjar med liten bokstav och saknar punkt, och ett test kontrollerar
båda — annars blir den sammansatta meningen två meningar i trenchcoat.

## Att läsa dem tillsammans

```ts
interpretSignAssembly('varning-annan-fara', ['tavla-avstand'])
// "En fara som inget annat varningsmärke täcker — märket gäller 100 m längre fram."
```

Funktionen är avsiktligt grund. Den sätter ihop märkets korta innebörd med varje
tavlas fras. Den försöker inte modellera hur godtyckliga kombinationer samverkar
juridiskt — det blir sprött och fel i kanterna, och en elev har inte nytta av en
regelmotor som ibland har fel.

## Rendering

`RoadSignAssembly` ritar stolpen som en stolpe: tavlan direkt under märket,
samma bredd, med några få pixlars mellanrum. Avståndet är det som talar om att
tavlan hör till *det* märket och inte till nästa längre bort.

Hela stolpen är **en** figur för hjälpmedel. De enskilda bilderna är märkta
dekorativa, eftersom gruppen redan beskriver posten — annars läses samma märke
upp två gånger.

## Att inte avslöja svaret

En fråga som visar en stolpe och frågar vad den betyder får inte beskrivas med
vad den betyder.

Med `quizSafe`:

- beskrivningen säger bara hur stolpen ser ut — *"Väjningspliktsmärke: gul
  triangel med röd ram och spetsen nedåt. Under märket: gul rektangulär
  tilläggstavla med röd ram och texten STOPP 200 m."*
- den sammanlagda innebörden renderas inte alls

Registret har `quizSafeAltText` för de poster vars vanliga `altText` skulle
säga för mycket. `QuestionIllustration` sätter `quizSafe` så länge bildtexten är
dold, vilket är precis så länge frågan är obesvarad.

## Varianter av samma kod

Tre officiella koder täcker var sin familj: C31 är varje hastighetsgräns, D1
varje påbjuden riktning, T6 varje tidtavla. Boken trycker en bild per kod.

Koden i registret förblir den riktiga — att hitta på "C31-90" vore att påstå att
föreskriften säger något den inte säger. Skillnaden bärs i stället av `variant`:

```ts
{ id: 'hastighet-90', code: 'C31', variant: { key: 'speed-90', numericValue: 90 } }
```

De tio variantposterna ritas med Vägklars vektor, inte med bokens bild. Bokens
C31 visar 30, och att använda den för `hastighet-90` vore att visa en elev fel
siffra.

**Sammansättning prövades och förkastades.** Bokens C31 har ett rent gult fält,
så det går att måla över siffran och skriva en ny — men boken trycker bara
siffrorna 0, 1, 2, 3 och 5 någonstans i hela märkesbilagan. 4, 6, 7, 8 och 9
finns inte att hämta. En jämförelse mot Arial Bold visade tydligt synlig
skillnad: bokens siffror är smalare, högre och har annan form. Att kalla det
resultatet bokens artwork vore fel, och det står i
[LICENSED-SIGNS.md](LICENSED-SIGNS.md) tillsammans med resten.

## Märket i verkligheten

`SignInContext` ställer bokens märkesbild bredvid ett av bokens fotografier där
samma märke faktiskt syns:

```ts
{ kind: 'signInContext', signId: 'varning-djur',
  imageId: 'viltvarning-med-tillaggstavla',
  notice: 'Märket står långt ute på vägrenen och tavlan under det anger en sträcka…' }
```

En elev som kan varje märke på vit botten kan ändå missa ett i trafiken, där det
är litet, står vid sidan, ses snett och kommer medan man tittar på något annat.
`notice` säger vad man ska lägga märke till i fotografiet — aldrig vad märket
betyder.

Paren väljs bara när märket verkligen går att identifiera i bilden. Att gissa
från kapitelrubriken är hur man får en bildtext som beskriver möte när
fotografiet visar en omkörning, vilket har hänt här förut.

Sexton par finns. `src/domain/content/contextPairs.test.ts` kontrollerar dem som
påståenden: fotots beskrivning måste nämna märkets egen fältfärg, och `notice`
får inte innehålla märkets betydelse. Den kontrollen hittade två fel första
gången den kördes — ett kryssmärke beskrivet som rött och vitt när A39 är rött
och gult, och ett foto vars bommar sades sträcka sig över vägbanan när de står
uppfällda i bilden.

## Detaljvyn

Katalogkortet rymmer namn, kod och en rad. `SignDetail` öppnar resten i en
`<dialog>`: den långa betydelsen, bildbeskrivningen, varianterna under samma kod
och två till tre märken som märket verkligen förväxlas med.

En dialog och inte en egen route. Katalogen är en sökning man är mitt uppe i —
ett filter, en vald kategori, en scrollposition — och att navigera bort slänger
allt det. Native `<dialog>` med `showModal()` ger fokusfällan, den inerta
bakgrunden och Escape gratis. Fokusåtergången är vår egen, och sker *efter* att
dialogen stängts: `close()` kör webbläsarens egen fokusåterställning som en del
av stängningen, så en `focus()` innan dess skrivs över en stund senare.

Tillståndet är det som öppnar och stänger dialogen — inte elementets eget
`close`-event. Att låta eventet mata tillbaka tillståndet gör att ett uteblivet
event lämnar komponenten i tron att en stängd dialog är öppen, och nästa klick
på samma kort sätter det tillstånd som redan gäller och öppnar därför ingenting.

`confusableSigns()` läser `similarSignIds` åt båda hållen. Fyrtioåtta av
relationerna i registret är skrivna åt ett håll, och en förväxling som bara går
att hitta från det ena märket är halva nyttan. 111 av 115 märken har minst en;
de fyra som saknar delar inget bildspråk med något annat i registret.
