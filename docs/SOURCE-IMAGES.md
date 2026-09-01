# Källbilder

Vägklar använder ett urval fotografier ur den licensierade teoriboken. De visar
verkliga svenska trafiksituationer sedda från förarplatsen — något varken vektorgrafik
eller text kan ersätta när man ska lära sig att *läsa en gata*.

Den här filen beskriver hela kedjan: hur bilder tas ut ur källan, hur de väljs, hur de
optimeras, var de bor och hur de kopplas till innehåll.

## Principen

**Kurering, inte import.** 263 bilder togs ut ur källan till en arbetsyta som aldrig
checkas in. 26 valdes. Resten ligger kvar utanför appen.

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
        │  hand: urval till CURATED-listan i optimise-source-images.py
        │  scripts/optimise-source-images.py
        ▼
src/assets/source-images/teoribok-2026-1/<ämne>/   26 bilder × 2 bredder, incheckade
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

Resultat: 26 bilder, 5 671 kB original → 3 319 kB WebP i 52 filer.

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

## Att lägga till en ny bild

1. Kör extraheringen om `references/extracted/` saknas.
2. Leta upp kandidaten och lägg till en rad i `CURATED` i
   `scripts/optimise-source-images.py`: `('p123-0.jpeg', 'ämne', 'slug')`.
3. Kör `python scripts/optimise-source-images.py`.
4. Lägg till en post i `src/content/source-images.ts` med alt-text, långbeskrivning,
   bildtext och rätt sidnummer.
5. Kör `npm run report:content`. Validatorn kontrollerar att filen finns, att sidan finns
   i källan och att rättighetsfälten är ifyllda.

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

Uppmätt effekt av hela passet på startpaketet: **+5 kB gzip**.

## Offline

Bilderna **precachas inte**. Det vore fel att lägga 3,2 MB i varje användares cache
för bilder de kanske aldrig ser.

I stället fångas de av den befintliga `runtimeCaching`-regeln i `vite.config.ts`:
`CacheFirst` för allt med `request.destination === 'image'`, med tak på 120 poster och
60 dagars livslängd. En bild du sett en gång fungerar alltså offline efteråt, medan en
bild du aldrig öppnat aldrig kostar något.

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

## Kapitel utan visuellt stöd

Nio av 39 kapitel har bilder i dag. De mest värdefulla att komplettera härnäst:

1. **Vägmärken** — märken i verklig miljö, inte bara som ikoner
2. **Motorväg** — påfart, avfart och körfältsbyte i hög fart
3. **Landsväg** — kurvor, backkrön och mötesplatser
4. **Mörker** — halvljus, helljus och avbländning
5. **Trafikolyckor** — varningstriangel och säkring av olycksplats

Aktuella siffror finns i [CONTENT-COVERAGE.md](CONTENT-COVERAGE.md) under
*Visuellt stöd*.
