# Ritningar ur källan

Vägklar använder två sorters licensierat bildmaterial ur *Körkortsboken 2026*
(Hagberg Media AB, Körkortonline.se), och de gör olika saker.

Ett **fotografi** visar hur en situation ser ut genom vindrutan. Det svarar på
"hur ser det ut när det händer" — en cyklist mellan parkerade bilar, en portal
över motorvägen, ett hjulspår i snömodd.

En **ritning** visar ett mått eller ett förhållande som inte går att fotografera.
Ingen bild av en riktig bil kan visa att lasten sticker ut fyrtio centimeter för
långt åt ena sidan; till det krävs måttstreck. Ingen bild av ett riktigt möte i
mörker kan visa var två ljuskäglor tar slut.

Registret skiljer dem åt med `kind: 'photo' | 'diagram'`.

## När en ritning tas in

En ritning kvalificerar sig när den bär ett **mått** eller ett **förhållande**
som är omständligt i text och omedelbart i bild. "Lasten är 260 cm bred men
skjuter ut 40 cm på ena sidan" är en mening att läsa två gånger; det är en bild
att förstå på en sekund.

Den kvalificerar sig **inte** för att den finns. Boken innehåller också
formelrutor, hastighetstabeller och rubriksatta textstycken som är satta som
grafik. De är bokens text, inte bokens pedagogik, och de hör inte hemma här —
Vägklar skriver sin egen text. Vid genomgången av kapitlen om fordonet och
lasten valdes elva ritningar av flera dussin kandidater; resten var textrutor,
självtest, kapitelavdelare eller tomma fyllnadssidor.

## Vad en ritning måste bära med sig

Utöver det varje källbild måste ha (alt-text, lång beskrivning, rättighetsinnehavare,
sida, tillstånd) gäller för ritningar:

**`labelText`** — den text som är *tryckt inne i figuren*, avskriven ordagrant.
`['260 cm', '40 cm']`. Fältet finns också på fotografier som är bilder av text:
en krockkuddepanel som lyser `ON`, en varningsdekal på ett babyskydd.

Måtten är hela poängen med figuren. Renderade som pixlar når de ingen som
använder skärmläsare, och de når ingen alls den dagen filen inte hunnit ned i
offline-cachen. Därför upprepas de i `longDescription`, och `SourceImageFigure`
läser ut dem både i den dolda beskrivningen och i textreservet när bilden
uteblir. Ett test kontrollerar att varje `labelText` verkligen återfinns i
beskrivningen.

## Hur de ser ut i appen

Ritningarna är tecknade på ljus botten. De läggs därför på en fast ljus platta
som inte vänds i mörkt läge — en inverterad ritning blir en annan ritning, och
röda kryss och gula markeringar slutar betyda det de betyder.

Förstoringsknappen ligger under plattan i stället för i hörnet på den. Ett
fotografi har slack i hörnen; en ritning är beskuren till sitt innehåll, så
knappen skulle hamna ovanpå det som ska läras ut.

Bildtexten döljs i frågeläge, precis som för fotografier, eftersom en bildtext
som förklarar figuren också avslöjar svaret.

## Så framställs de

`scripts/extract-source-diagrams.py` har två lägen:

```bash
python scripts/extract-source-diagrams.py --pages 204-212   # renderar hela sidor för genomgång
python scripts/extract-source-diagrams.py --crop            # klipper ut de kuraterade figurerna
```

Genomgångsläget skriver till `review/diagram-pages/`, beskärningarna till
`references/extracted/diagrams/`. Båda är gitignorerade. Beskärningarna anges
som sidandelar (0–1) i `CROPS` och renderas i fyra gångers skala, så att en
figur som upptar en fjärdedel av sidan ändå blir knivskarp på 960 px.

`scripts/optimise-source-images.py` gör om dem till WebP i två bredder. Ritningar
körs med högre kvalitet än fotografier (92 mot 82): hårda kanter och tunna
måttstreck faller sönder tidigare än fotografiskt brus gör.

Beskärningen tar bara figuren. Sidhuvuden, sidnummer, brödtext och intilliggande
facit följer aldrig med. Källans egna vattenmärken beskärs däremot inte bort.

## Vad som kontrolleras automatiskt

- Varje `labelText` återfinns i `longDescription`
- Varje ritning har en beskrivning som räcker för att bygga upp figuren i huvudet
- Ingen ritning ligger oanvänd i bygget
- Minst fyra ritningar prövas som frågor, inte bara som illustration
- `SourceImageFigure` renderar faktiskt `labelText`
- Registrets `width`/`height` stämmer med filen på disk — läses ur WebP-huvudet
- Sidhänvisningen finns i källan och ligger i rätt kapitel (`npm run audit:pages`)
- Provet renderar källbilder, vägmarkeringar och vägmärken (`sourceImages.test.ts`)

## Var de sitter

Se `docs/IMAGE-COVERAGE.md`, som redovisar foto och ritning i skilda kolumner
per kapitel. Tyngdpunkten ligger där måtten finns: Längd & bredd, Belysning,
Last och Krocksäkerhet.

## Rättigheter

Samma som för fotografierna, se `docs/SOURCES-AND-RIGHTS.md`. Materialet är inte
Vägklars. Bildtexten under varje ritning säger `Illustration: Körkortonline.se,
s. NNN · © Hagberg Media AB · används med tillstånd`, och ordet *Illustration*
väljs av `kind` — att kreditera en ritning som fotografi vore fel både mot
läsaren och mot rättighetsinnehavaren.
