# Vägklars egna ritningar

Vägklar visar fyra sorters bilder, och de kommer från två helt skilda håll.

**Licensierat material** ur *Körkortsboken 2026* (Hagberg Media AB,
Körkortonline.se): fotografier av verklig svensk trafik, och bokens egna
figurer. De ligger i [`src/content/source-images.ts`](../src/content/source-images.ts)
och beskrivs i [SOURCE-IMAGES.md](SOURCE-IMAGES.md) och
[SOURCE-DIAGRAMS.md](SOURCE-DIAGRAMS.md).

**Vägklars eget material**: vektorritade vägmärken och vägmarkeringar, och —
det den här filen handlar om — egna undervisningsritningar. De ligger i
[`src/content/original-visuals.ts`](../src/content/original-visuals.ts).

De två registren hålls isär med flit. De bär olika slags löften, och att blanda
dem skulle göra båda otydliga.

| | Licensierad källbild | Egen ritning |
| --- | --- | --- |
| Register | `source-images.ts` | `original-visuals.ts` |
| Måste bevisa | rättighetshavare, sida, tillstånd | att den lär ut något |
| Kreditering i appen | `Foto:` / `Illustration: Körkortonline.se … © Hagberg Media AB` | `Illustration: Vägklar · © 2026 Jimmy Eliasson` |
| Levereras som | WebP-filer, hämtas vid behov | SVG i kod, följer med appskalet |
| Offline | fungerar efter första visningen | fungerar alltid |
| Fält i frågan | `sourceImageId` | `originalVisualId` |
| Lektionsblock | `{ kind: 'sourceImage' }` | `{ kind: 'originalVisual' }` |

En validator upprätthåller gränsen: samma id får inte finnas i båda registren,
en egen ritning får inte tillskrivas källans rättighetshavare, och en fråga som
pekar med `originalVisualId` på en licensierad bild får ett felmeddelande som
säger vilket fält den borde ha använt i stället.

## När en egen ritning ska göras

Bara när källan inte löser det. Ordningen är:

1. **Finns ett fotografi i källan?** Använd det. Ett foto av en verklig gata lär
   ut något ingen ritning kan.
2. **Finns en figur i källan?** Använd den.
3. **Först då**: rita själv.

Däck och krockvåld är de två ställen där steg 1 och 2 tog slut. Kapitlen är
fulla av text om mönsterdjup, lufttryck och rörelseenergi, och innehåller
nästan inga bilder av det. Ingen fotograferar heller ett mönsterdjup på ett
begripligt sätt — det är ett par millimeter — och ingen fotograferar en
vattenkil under ett rullande däck.

Rita **inte** något som texten redan säger lika bra. En ritning som bara
upprepar en mening är dekoration, och dekoration kostar bytes i ett paket varje
elev laddar ner.

## Lektionsritning eller frågeritning

Två `usage`-värden, och skillnaden är viktig.

En **lektionsritning** (`theory-lesson`) sätter ut sitt eget facit. Den säger
"För lågt tryck" och "Rätt", eftersom en lektion är där svaret hör hemma.

En **frågeritning** (`question-image`) gör inte det. Den visar ett enda fall
utan omdöme: ett däck slitet vid kanterna, ett bälte som ligger över magen. Att
ta lektionsversionen och dölja orden vore fel sätt — det är en annan bild som
behövs, inte samma bild med mindre text.

Ett test kräver att varje fråga med `originalVisualId` pekar på en ritning med
`usage: 'question-image'`, så en lektionsritning kan inte råka bli ett facit.

## Så lägger du till en

1. **Rita** i [`src/ui/visuals/originalVisualGlyphs.tsx`](../src/ui/visuals/originalVisualGlyphs.tsx).
   Ett `<g>`-element utan `<svg>` runt — komponenten sätter `viewBox`. Använd
   `VISUAL_COLOURS`, aldrig temavariabler (se nedan).
2. **Registrera** i `original-visuals.ts`. `width`/`height` ska vara den
   `viewBox` du ritat mot.
3. **Skriv av** all text som står tryckt i figuren i `labelText`, och se till
   att samma ord finns i `longDescription`. Validatorn kräver det.
4. **Använd** den — i ett `originalVisual`-block eller via `originalVisualId`.
   Ett test underkänner en godkänd ritning som ingen använder.
5. Kör `npm run report:content` och `npm test`.

## Regler för ritandet

**Fasta färger, aldrig temavariabler.** Meningen ligger i färgen: grönt är det
mönster som fortfarande når vägbanan, rött är bältet på fel ställe, blått är
vatten. En ritning som inverteras i mörkt läge är en annan ritning. Därför
ligger alla ritningar på en fast ljus platta som inte vänds — samma lösning som
för bokens figurer.

**Ingenting bärs av färg ensam.** Varje kontrast är också en form, ett läge
eller ett ord. Det slitna däcket är synligt lägre, det felplacerade bältet
korsar synligt magen, och båda är märkta med både ikon och text.

**Text i SVG bryts inte.** En mening som är bredare än din `viewBox` klipps rätt
av, tyst. Håll etiketter korta och lägg förklaringen i bildtexten, som kan
radbrytas. Det gick fel två gånger under första omgången.

**Räkna med 320 px.** Vid den bredden renderas en 320-enheters `viewBox`
ungefär 1:1, så 10 enheter är ungefär 10 px. Under det blir text svårläst.

## Tillgänglighet

Varje ritning bär:

- `altText` — kort, det tillgängliga namnet
- `longDescription` — så utförlig att uppgiften går att lösa utan att se bilden
- `labelText` — det som står tryckt inne i figuren, ordagrant

Komponenten sätter `role="img"` och `aria-labelledby` mot en dold text som
innehåller både beskrivningen och etiketterna. Text som ritats som vektorpaths
når ingen skärmläsare, så den måste finnas som ord någon annanstans.

Ingen ritning har förstoringsknapp. De är vektorer och blir skarpa när
webbläsaren zoomar, vilket är bättre än en modal — till skillnad från ett
fotografi, som har en ändlig upplösning och därför behöver en.

## Rendering

Allt som visar en fråga går genom
[`QuestionIllustration`](../src/ui/media/QuestionIllustration.tsx), som känner
till alla fyra sorterna. Det är avsiktligt en enda komponent: tidigare skrev
varje skärm ut sin egen lista över bildtyper, och det var precis så
provsimuleringen en gång slutade visa fotografier. Ett test underkänner en
frågeskärm som börjar rita på egen hand igen.

Lektioner renderar `originalVisual`-block genom `OriginalVisualFigure`.

## Prestanda

Registret och ritningarna ligger utanför startpaketet — `vite.config.ts` håller
`src/content/original-visuals` och `src/ui/visuals/` ur `content`-chunken. De
följer i stället med den lazy-laddade chunk som lektions- och frågevyerna redan
hämtar, och Workbox precachar den. Därför fungerar de offline direkt, utan att
kosta något vid start.
