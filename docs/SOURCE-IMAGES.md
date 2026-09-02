# Källbilder

Vägklar använder ett urval bilder ur den licensierade teoriboken: dels fotografier
av verkliga svenska trafiksituationer sedda från förarplatsen, dels bokens egna
ritningar. Fotografiet visar hur något ser ut genom vindrutan; ritningen visar ett
mått eller ett förhållande som inte går att fotografera. Varken vektorgrafik eller
text ersätter dem.

Den här filen beskriver fotografierna och kedjan de delar. Ritningarna har egna
krav — de bär tryckta mått som måste finnas som text också — och beskrivs i
[SOURCE-DIAGRAMS.md](SOURCE-DIAGRAMS.md).

Den här filen beskriver hela kedjan: hur bilder tas ut ur källan, hur de väljs, hur de
optimeras, var de bor och hur de kopplas till innehåll.

## Principen

**Kurering, inte import.** 263 bilder togs ut ur källan till en arbetsyta som aldrig
checkas in. 62 har valts i fyra omgångar — 51 fotografier och 11 ritningar. Resten
ligger kvar utanför appen. Fyra tidigare godkända fotografier har satts till
`retired`: de dubblerade undervisning som en bättre bild i samma lektion redan
skötte, och en godkänd bild som ingen använder är inte gratis.

Bilden ska bära något texten inte klarar. Kan frågan ställas lika bra i ord hör den
hemma i en vanlig frågefil, inte bland bildfrågorna.

**Rättighetshavarens vattenstämpel tas aldrig bort.** Den finns i fotografierna och är
en del av attributionen.

## Kedjan

```
references/teoribok-2026-1.pdf          licensierad källa, aldrig incheckad
        │  scripts/extract-source-images.py --extract
        ▼
references/extracted/teoribok-2026-1/   263 kandidater, aldrig incheckade
        │  scripts/review-source-images.py  → kontaktkarta att titta i
        │  hand: urval till CURATED-listan i optimise-source-images.py
        │  scripts/optimise-source-images.py
        ▼
src/assets/source-images/teoribok-2026-1/<ämne>/   51 bilder × 2 bredder, incheckade
        │  src/content/source-images.ts  (registret)
        ▼
lektioner och frågor
```

### 1. Extrahera

```bash
python scripts/extract-source-images.py --inventory   # lista utan att skriva
python scripts/extract-source-images.py --extract     # skriv ut kandidaterna
```

Verktygskedjan är avsiktligt minimal: **pypdf** för att plocka ut inbäddade bilder och
**Pillow** för att mäta och konvertera. Poppler finns bara som `pdftotext` på den här
maskinen, och att dra in en tyngre pipeline var inte motiverat för en engångskurering.

Utdata hamnar i `references/extracted/`, som `.gitignore` utesluter på samma sätt som
själva PDF:en. Skriptet hoppar över allt under 120×120 px eller 8 kB — logotyper,
ikoner och renderingsartefakter.

### 2. Välja

Urvalet gjordes genom att bygga kontaktkartor per kapitel och granska dem. Kriterier:

- Bilden avgör något. Utan den går uppgiften inte att lösa.
- Detaljen som avgör syns tydligt: skyltens text, linjens typ, fordonets läge.
- Situationen är typisk, inte en kuriositet.
- Den täcker ett prioriterat område (väjningsregler, passager, körfält,
  cirkulationsplats, parkering, landsväg, omkörning, mörker, halka, vägmärken).

### 3. Optimera

```bash
python scripts/optimise-source-images.py
```

Skriptet läser `CURATED`-listan och skriver WebP i två bredder:

| Fil | Används av |
| --- | --- |
| `<slug>-640.webp` | telefoner, och skrivbord vid låg pixeltäthet |
| `<slug>-960.webp` | surfplatta, skrivbord, och telefoner med DPR 2 |

Kvalitet 78 vid högst 960 px bredd. Värdet är valt genom granskning, inte gissning: vid
de inställningarna är portaltexten, 80-skylten och körfältsbokstäverna i
`korfaltsval-motorvag` fortfarande läsbara, samtidigt som filen går från 194 kB till
74 kB. Trafikfoton bär små men avgörande detaljer — granska en ny bild i 100 % innan du
sänker kvaliteten ytterligare.

Resultat: 44 bilder, 9 497 kB original → 5 664 kB WebP i 88 filer.

### 4. Registrera

Varje bild får en post i [`src/content/source-images.ts`](../src/content/source-images.ts):

```ts
img({
  id: 'cykeloverfart',
  sourcePage: 55,
  title: 'Cykelöverfart före cirkulationsplats',
  topic: 'passager',
  subcategory: 'cykelpassage-overfart',
  chapter: 'passager',
  altText: 'En cykelöverfart med eget vägmärke, målade rutor …',
  longDescription: 'Sett framåt från förarplatsen mot en upphöjd passage …',
  caption: 'Vägmärke, rutor och väjningslinje tillsammans …',
  usage: 'question-image',
  asset: 'passager/cykeloverfart',
  width: 960,
  height: 540,
  status: 'approved',
})
```

`sourceId`, `rightsHolder` och `usedWithPermission` sätts av hjälparen, så attributionen
kan inte glömmas bort i en enskild post.

`status` styr om bilden får visas. Bara `approved` renderas; validatorn avvisar en fråga
eller lektion som pekar på något annat.

## Att titta på kandidaterna

```bash
python scripts/review-source-images.py            # hela boken
python scripts/review-source-images.py 148-173    # eller ett sidintervall
```

Skriver `review/source-image-candidates.html` — lokal, gitignorerad, med varje
kandidat inbäddad som miniatyr bredvid sidnummer, mått, om den redan är kurerad
och vilka ord som står på den sidan i boken. Filtren delar upp på kapitel, på
kurerad eller ej, och på form:

| Form | Vad det är | Duger som lärobild |
| --- | --- | --- |
| `photo` | Bred 1325×745-bild ur löptexten | Oftast ja |
| `diagram` | Figur, urklipp eller närbild | Ibland |
| `divider` | Kvadratisk ~1220×1220 kapitelöppnare | Nej — dekoration |

Det här steget är inte valfritt. Att välja bilder ur en filnamnslista är precis
så en kapitelöppnare hamnar som illustration till en regel den inte handlar om.
Hela boken blir ungefär 6 MB inbäddade miniatyrer, vilket vissa visare vägrar
öppna — ta ett sidintervall i taget.

## Att lägga till en ny bild

1. Kör extraheringen om `references/extracted/` saknas.
2. Titta på kandidaterna med `review-source-images.py`.
3. Lägg till en rad i `CURATED` i
   `scripts/optimise-source-images.py`: `('p123-0.jpeg', 'ämne', 'slug')`.
4. Kör `python scripts/optimise-source-images.py`.
5. Lägg till en post i `src/content/source-images.ts` med alt-text, långbeskrivning,
   bildtext och rätt sidnummer.
6. Kör `npm run report:content` och `npm run report:images`.

Validatorn kontrollerar att filen finns i **båda** bredderna, att måtten är
rimliga, att sidan finns i källan, att rättighetsfälten är ifyllda — och att
inget annat fotografi redan registrerats under samma fil. Den sista regeln
finns för att tre bilder en gång kurerades två gånger var, med två bildtexter
och två beskrivningar som kunde säga emot varandra. En av dem gjorde det.

### Koppla till en lektion

```ts
{
  kind: 'sourceImage',
  imageId: 'cykeloverfart',
  prompt: 'Vad ska du lägga märke till?',
  caption: 'Vägmärke, rutor och väjningslinje tillsammans.',
}
```

### Koppla till en fråga

```ts
{
  id: 'bld-007',
  // …
  sourceImageId: 'cykeloverfart',
}
```

**Bildtexten visas inte i frågor.** Registrets bildtext förklarar vad bilden lär ut,
vilket är precis det frågan ber eleven räkna ut. Krediteringen visas alltid.

## Presentation

[`SourceImageFigure`](../src/ui/media/SourceImageFigure.tsx) renderar bilden med:

- `srcset` och `sizes`, så rätt bredd hämtas för skärm och pixeltäthet
- `width`/`height` och `aspect-ratio` på ramen, så layouten inte hoppar under laddning
- `loading="lazy"` i lektioner, `eager` i frågor där bilden är hela uppgiften
- höjdtak `min(58vh, 460px)`, så ett kvadratiskt foto inte tar över en telefonskärm
- alt-text för snabb orientering **och** en visuellt dold långbeskrivning kopplad med
  `aria-describedby`, detaljerad nog att uppgiften går att lösa utan att se bilden
- krediteringsrad: `Foto: <utgivare>, s. <sida> · © <rättighetshavare> · används med tillstånd`

Saknas filen på disk renderas långbeskrivningen som text i stället för en trasig bild.

## Prestanda

Bilderna når **aldrig** startpaketet.

[`sourceImageAssets.ts`](../src/ui/media/sourceImageAssets.ts) använder
`import.meta.glob` med `query: '?url'`, så bundlen innehåller bara URL-strängar medan
WebP-filerna är separata resurser som webbläsaren hämtar när en bild faktiskt renderas.

Registret self är dessutom undantaget från `content`-paketet i `vite.config.ts`,
eftersom långbeskrivningarna bara behövs på rutter som laddas lazy.

Uppmätt effekt på startpaketet: **+5 kB gzip** i första omgången, och bilderna själva
når aldrig startpaketet.

## Offline

Bilderna **precachas inte**. Det vore fel att lägga 6 MB i varje användares cache
för bilder de kanske aldrig ser. `verify-build` avbryter bygget om en enda
källbild hamnar i förhandscachen.

De fångas i stället av en egen `runtimeCaching`-regel i `vite.config.ts`:
`CacheFirst` mot `vagklar-source-images`, tak 160 poster, 180 dagar. Egen cache
för att de tidigare delade hink med alla andra bilder under ett tak på 120 —
och då kunde en lektionsbild vräkas ut för att ge plats åt en ikon, offline och
utan möjlighet att hämta den igen.

Regeln matchar på filändelsen `.webp`, inte på mappen: Vite plattar ut alla
resurser till `/assets/` vid bygget, så sökvägen bilderna ligger under i förvaret
finns inte i produktion. WebP är exakt här — fotografierna är det enda WebP
appen levererar, ikonerna är PNG och SVG — och `verify-build` avbryter om det
antagandet slutar stämma.

### När bilden inte finns

En bild du aldrig sett finns inte i cachen. Går du offline och öppnar den
lektionen visar `SourceImageFigure` långbeskrivningen i stället för en trasig
bild — samma text som en skärmläsare alltid får, skriven för att bära samma
innehåll. Bildtexten och krediteringen står kvar.

Kontrollerat med servern avstängd: en förhandsvisad bild renderas ur cachen, en
aldrig visad faller tillbaka till text.

## Rättigheter

Fotografierna tillhör **Hagberg Media AB** (Körkortonline.se) och används med tillstånd.
De är *inte* Vägklars eget material.

- Varje bild bär rättighetshavare och `usedWithPermission` i registret.
- Krediteringen renderas ur registret, aldrig från anropsplatsen — den kan inte glömmas.
- Vattenstämpeln i fotografierna behålls.
- Validatorn avvisar en bild utan rättighetshavare eller utan tillståndsmarkering.

Vägklars kod, design, egna illustrationer och egen text är © 2026 Jimmy Eliasson. Se
[SOURCES-AND-RIGHTS.md](SOURCES-AND-RIGHTS.md).

## Vad som inte får hända

Rå-PDF:en och rå-extraheringen får aldrig publiceras.

- `.gitignore` utesluter `references/*.pdf` och `references/**/extracted/`.
- `scripts/verify-build.mjs` avbryter bygget om ett källdokument hamnar i `dist/`, om en
  textresurs nämner källfilen, eller om service workern förhandscachar ett sådant
  dokument. Kontrollen är testad genom att medvetet lägga en PDF i `dist/`.
- Samma kontroll körs i CI direkt före publicering.

Kontrollen skiljer på **källdokument** och **härledda bildresurser**: `.pdf`, `.epub`,
`.mobi` och `.docx` blockeras, medan de optimerade WebP-filerna är godkänt appinnehåll.
Bygget kontrollerar dessutom att bilderna faktiskt *finns* — försvinner de tyst är det
också ett byggfel.

## Vad som inte gick att extrahera

Märkeskatalogen i källan är vektorgrafik eller typsnitt, inte inbäddade rasterbilder.
Kapitlet Vägmärken (s. 324–361) gav därför bara fyra bildkandidater, varav en i hög
upplösning. Det är skälet till att de svenska vägmärkena ritas som vektorer i Vägklar
i stället för att hämtas ur källan — se [ROAD-SIGNS.md](ROAD-SIGNS.md).

Fotografierna bidrar i stället med märken *i verklig miljö*: flera märken på samma
stolpe, hastighet på en avfart, kryssmärken vid en plankorsning, gågata i en gammal
stadskärna.

En kandidat valdes bort medvetet: `p097-0` visar ett runt gult märke som inte gick att
läsa säkert i den upplösning som fanns. Att beskriva ett märke man inte kan identifiera
vore att gissa i ett läromedel.

## Kapitel utan visuellt stöd

Tolv av 39 kapitel har bilder i dag. De mest värdefulla att komplettera härnäst:

1. **Mörker** — halvljus, helljus och avbländning
2. **Trafikolyckor** — varningstriangel och säkring av olycksplats
3. **Synen** — siktfält och tunnelseende
4. **Krocksäkerhet** — bältesplacering och krockkudde
5. **Däck** — mönsterdjup och slitage

Aktuella siffror finns i [CONTENT-COVERAGE.md](CONTENT-COVERAGE.md) under
*Visuellt stöd*.
