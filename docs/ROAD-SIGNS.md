# Vägmärken

Vägmärken är det område där igenkänning och tillämpning måste sitta ihop. Att veta
att en gul triangel varnar är värdelöst om man inte vet att den *inte* ger företräde.
Därför består systemet av två delar som gör olika saker:

| | Bäst på | Var |
| --- | --- | --- |
| **Ritade märken** | Exakt igenkänning — form, färg, symbol | `ui/illustrations/signGlyphs.tsx` |
| **Fotografier** | Sammanhang — var märket sitter och vad det gör med situationen | `content/source-images.ts` |

Markeringarna i vägbanan är ett eget, likadant uppbyggt system — se
[ROAD-MARKINGS.md](ROAD-MARKINGS.md). Ett märke gäller alla; en markering gäller ofta
bara den ena körriktningen, och den skillnaden är värd sitt eget register.

Ingen av dem ersätter den andra. Ett foto av en skylt i motljus är dålig igenkänning;
en ritad skylt säger ingenting om att den sitter tillsammans med två andra på samma
stolpe.

## Registret

[`src/content/road-signs.ts`](../src/content/road-signs.ts) är den enda plats som vet
vad ett märke betyder.

```ts
{
  id: 'huvudled',
  code: 'B4',
  name: 'Huvudled',
  category: 'vajningsplikt',
  shortMeaning: 'Korsande trafik har väjningsplikt mot dig.',
  longMeaning: 'Huvudleden gäller tills den upphör med B5 — eller tills du kör in i …',
  altText: 'Väjningspliktsmärke: gul kvadrat ställd på hörn med vit ram.',
  tags: ['huvudled', 'foretrade'],
  similarSignIds: ['huvudled-upphor', 'varning-vagkorsning'],
  subcategory: 'huvudled',
}
```

`code` kommer från Vägmärkesförordningen (2007:90) och är hämtad ur källans
märkeskatalog, inte gissad. Ett märke vars kod inte gick att fastställa lämnas hellre
utan kod än med ett trovärdigt påhitt.

`similarSignIds` är inte dekoration. Den driver jämförelsekorten i teoriskolan, och ett
test avvisar ett jämförelsekort som parar ihop två märken som inte är listade som
förväxlingsbara — annars lär kortet ut en skillnad ingen ändå hade missat.

Registret innehåller **ingen JSX**. Det är data som domänlagret kan validera utan att
dra in React.

## Ritningarna

[`signGlyphs.tsx`](../src/ui/illustrations/signGlyphs.tsx) innehåller en ritning per
id i registret. Ramarna är delade komponenter, inte kopierade konturer:

| Ram | Används av |
| --- | --- |
| `WarnFrame` | Varningsmärken (A) — gul triangel, röd ram, spets uppåt |
| `YieldFrame` | Väjningsplikt (B1) — spets nedåt |
| `ProhibitFrame` | Förbudsmärken (C) — gul botten, röd ring |
| `ProhibitBlueFrame` | Parkeringsförbud (C35/C39) — blå botten, röd ring |
| `MandatoryFrame` | Påbudsmärken (D) — heltäckande blå cirkel |
| `InfoFrame` | Anvisningsmärken (E) — blå rektangel |
| `PlateFrame` | Tilläggstavlor (T) — vit eller gul tavla med svart ram |

Ett nytt märke är alltså en symbol plus en ram, och ramarna kan inte glida isär mellan
märken.

Allt ritas i en 100×100-ruta. **Rita inte en romb som en roterad `<rect>`** — det var
en verklig bugg i den första versionen: rotationen la diamanten utanför mitten och
klippte den mot viewBox. Använd en `<polygon>` med centrerade punkter.

Färgerna behålls i både ljust och mörkt tema, eftersom färgen är en del av det som ska
läras in. Märkena ligger därför alltid på en ljus, neutral platta — en gul varnings-
triangel på en mörk kortyta läser sig som en varning *i gränssnittet*, vilket är fel
budskap.

## Att lägga till ett märke

1. Rita symbolen i `signGlyphs.tsx` med rätt ram.
2. Lägg till posten i `road-signs.ts` med kod, namn, båda nivåerna av innebörd,
   alt-text, delområde och eventuella förväxlingspar.
3. Kör `npm test`. Sviten kontrollerar att ritning och post hänger ihop åt båda hållen,
   att kodprefixet matchar kategorin, och att förväxlingsparen pekar på märken som finns.

Att bara göra det ena går inte: ett märke utan ritning och en ritning utan post är
båda testfel.

## Presentation i teoriskolan

Två lektionsblock finns:

```ts
{ kind: 'signGrid', title: 'Varningsmärken', signIds: ['varning-vagkorsning', …] }
{ kind: 'signCompare', title: 'Lätt att blanda ihop',
  leftId: 'forbud-parkera', rightId: 'forbud-stanna', note: 'Räkna strecken. …' }
```

Rutnätet visar märke, namn och kod. Innebörden fälls ut för **ett** märke i taget —
en vägg av sextio ikoner lär inte ut någonting, och en sida som växer under läsarens
tumme är svår att läsa.

Jämförelsekortet visar två märken bredvid varandra. Parandet *är* pedagogiken: att se
dem var för sig är lätt, att se dem tillsammans är det som fastnar.

## Frågor med märken

Två sorter, med olika syfte:

**Ritade märken** — `image: sign('vajningsplikt', '…')` med `type: 'road-sign'`.
Används för igenkänning och för att skilja på märken som liknar varandra.

**Fotografier** — `sourceImageId: 'hastighet-100-ledsnummer'`. Används när frågan
handlar om sammanhanget: vilka märken som sitter på samma stolpe, om en hastighet
gäller avfarten eller vägen, vad som saknas på platsen.

Två regler:

- **Ställ inte samma fråga elva gånger.** "Vad betyder det här märket?" i varje fråga
  är både tråkigt och dåligt — dubblettdetektorn fångar det numera som exakt
  dubblett, eftersom den inte ser bilden. Fråga i stället efter konsekvensen:
  *"Du närmar dig en korsning med det här märket. Vad krävs av dig?"*
- **Bildtexten visas inte i frågor.** Registrets bildtext förklarar vad bilden lär ut,
  vilket är precis det frågan ber eleven räkna ut. Krediteringen visas alltid.

## Validering

[`validation.ts`](../src/domain/content/validation.ts) avvisar:

| Kod | Betyder |
| --- | --- |
| `duplicate-sign-id` | Två märken har samma id |
| `sign-bad-category` | Okänd kategori |
| `sign-without-name` / `sign-without-meaning` / `sign-without-alt` | Tomt eller för kort obligatoriskt fält |
| `sign-unknown-subcategory` | Delområdet finns inte i taxonomin |
| `sign-without-glyph` | Märket saknar ritning |
| `sign-dangling-similar` | Förväxlingspar pekar på ett märke som inte finns |
| `sign-self-similar` | Märket listar sig själv |
| `unknown-sign-illustration` | En fråga renderar ett märke som inte kan ritas |

Den sista fångade ett verkligt fel i det här passet: `varning-korsning` döptes om till
`varning-vagkorsning`, och en befintlig fråga pekade fortfarande på det gamla namnet.

Varje kontroll har ett test som planterar felet först — se
[`roadSigns.test.ts`](../src/domain/content/roadSigns.test.ts).

## Rättigheter

Ritningarna är Vägklars eget material, © 2026 Jimmy Eliasson. De återger de officiella
svenska vägmärkenas utformning enligt Vägmärkesförordningen, som är offentlig
föreskrift — inget äganderättsanspråk görs på själva märkessystemet.

Fotografierna tillhör Hagberg Media AB och används med tillstånd, med kreditering per
bild. Se [SOURCE-IMAGES.md](SOURCE-IMAGES.md) och
[SOURCES-AND-RIGHTS.md](SOURCES-AND-RIGHTS.md).

## Visuell granskning

```bash
npm run report:visuals
```

Ritar alla märken och markeringar i 220 px bredvid sin kod och sin skrivna
innebörd, i `review/visual-qa.html` (lokal, gitignorerad). Reglaget går upp till
380 px och en kryssruta byter kortyta till mörk.

Det här steget är inte valfritt inför en release. Ett märke som kompilerar är
inte ett märke som är rätt: i 64 px i ett lektionsrutnät ser i stort sett
allting rimligt ut. Förstoringen har hittat åtta ritfel över två omgångar —
senast att A36 var ritat som ett kryss (krysset är A39 Kryssmärke, ett annat
märke) och att båda cirkulationsplatsmärkena cirkulerade medurs.

Koderna kontrolleras separat mot källans planschuppslag; samtliga 58 stämmer.
