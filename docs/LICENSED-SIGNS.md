# Vägmärken från källan

Vägklar visar bokens egna vägmärkesbilder. 48 av registrets 58 märken ritas med
licensierat material; 10 står kvar på Vägklars vektorritning, och det är ett val
snarare än en lucka.

## Varför bytet gjordes

Märkena ritades från början för hand. Det gick fel tre gånger, och varje gång
tog det arbete att hitta:

- **A36** hade ett kryss där föreskriften har ett ånglok
- **A30 och D3** cirkulerade medurs; båda ska gå moturs
- **A25, B6 och B7** var speglade, och A25 hade dessutom en röd pil där märket
  har två svarta

Det är fel som en efterteckning kan göra och en extraktion inte kan. Så snart
bilderna gick att få ut ur källan fanns det ingen anledning att fortsätta rita.

Bytet avslöjade omedelbart tolv fel till — inte i bilderna, utan i **texten**.
Fem beskrivningar namngav en färg märket inte har (motorvägsmärkena är gröna i
Sverige och beskrevs som blå), och sju beskrev fel innehåll: E11 sades ha "en
vit ring runt siffran 30" när skylten läser *max 30 km/tim*, T14 beskrevs som
vit när den är röd, T9 som en gående med käpp när den visar fem punkter. De
felen var osynliga så länge ritningen var gjord efter samma beskrivning.

## Var bilderna kommer ifrån

Märkesbilagan i *Körkortsboken 2026*, sidorna 324–361. Märkena ligger där som
**vektorinnehåll på sidan**, inte som inbäddade rasterbilder — vilket är
förklaringen till att den tidigare fotoinriktade extraktionen aldrig såg dem.

`scripts/extract-book-signs.py` renderar varje sida i hög upplösning, letar upp
figurerna, letar upp de tryckta koderna i sidans egen text, och parar ihop varje
kod med figuren som står ovanför den.

Parningen sker på **position**, inte på ordning. Sidorna bär en förlagslogotyp
och enstaka lösa märken, så att räkna figurer och koder och lägga dem sida vid
sida förskjuter tyst alla tilldelningar efter första avvikelsen.

Två sorters figurer måste hittas på två sätt. De flesta märken är färgade mot en
gråskalig sida, så mättnad räcker. Tilläggstavlorna och fordonssymbolerna är
svart streckteckning på vitt och är osynliga för det testet; för dem används
mörker i stället, och sidans egen text maskeras bort först — annars paras koden
ihop med bildtexten under grannfiguren, vilket hände för sju koder innan
maskningen fanns.

## Varför tio märken behåller sin ritning

Tre officiella koder täcker var sin familj:

| Kod | Täcker | Boken trycker |
| --- | --- | --- |
| C31 | varje hastighetsgräns | en bild, som visar 30 |
| D1 | varje påbjuden körriktning | en bild, som pekar vänster |
| T6 | varje tidtavla | en bild |

Registret har fem C31, två D1 och tre T6. Att använda bokens C31 för
`hastighet-90` vore att visa en elev fel siffra. Ritningen vet vilken variant
den är; fotografiet gör det inte.

Ett test håller det valet på plats: de tio ska sakna licensierad bild och ha en
ritning, och varje märke i registret ska gå att rita på det ena eller andra
sättet.

## Filformat och storlek

Ett märke per fil, i källans egen upplösning upp till 640 px, som **palettiserad
lossless WebP**. Båda besluten är mätta.

*En bredd, inte en responsiv uppsättning.* Beskärningarna är omkring 450 px
breda och visas 110–132 px infällda. Att skala ner dem till 320 px gav en
*större* fil: platt vektorgrafik har en handfull exakta färger, och omsampling
uppfinner hundratals mellanliggande som sedan måste kodas. 48 märken kostar
212 kB i originalupplösning och 227 kB nedskalade.

*Lossless, inte kvalitet 92.* Ett vägmärke är sex platta färger. Förstörande
kodning lägger ringningar runt de svarta symbolerna, vilket är precis den detalj
eleven ska läsa. Kvantisering till 32 färger och lossless kodning är både mindre
och skarpare: 212 kB mot 864 kB.

## Offline

Märkena **precachas**; fotografierna gör det inte.

Uppdelningen är mätt. Alla 48 märkesbilder är tillsammans 212 kB mot ungefär
6 MB för fotografierna, så att lägga märkena i installationen kostar cirka 15 %.
Vad det köper är att provet fungerar offline: ungefär var tionde provfråga visar
ett märke, och en märkesfråga utan sitt märke är inte en svårare fråga utan en
olöslig. Exakt den defekten har funnits här förut.

Filnamnen bär prefixet `sign-` just för att den skillnaden ska överleva att Vite
plattar ut alla resurser till `/assets/`. `verify-build` kontrollerar båda
riktningarna: inga fotografier i förhandscachen, och minst 40 märken i den.

## Tillgänglighet och att inte avslöja svaret

Det tillgängliga namnet kommer alltid från registret, oavsett vilken bild som
ligger bakom. Registrets `name` är märkets *betydelse* — "Varning för mötande
trafik" — och att läsa upp det på en fråga om vad märket betyder är svaret,
uppläst. Därför beskriver frågornas alt-text hur märket **ser ut**, aldrig vad
det heter.

Undantaget är en tavla vars betydelse står tryckt på den: en skylt som läser
"Boende" går inte att beskriva utan ordet.

En fråga som handlar om *utseendet* får inte visa märket alls. `vag-011` frågade
vilken form och färg väjningspliktsmärket har — och visade det, med alt-text som
beskrev svaret och en `accessibilityText` som upprepade det ordagrant. Tre vägar
till svaret, en av dem uppläst. Den frågan visar inte längre någon bild.

En läcka är accepterad i stället för stängd, och det är värt att säga rakt ut:
flera märkes-id *är* betydelsen — `huvudled`, `stopp`, `parkering` — och id:t
ingår i filnamnet. Att byta namn på dem skulle beröra varje fråga, lektion och
scenario som refererar ett märke, för att skydda mot någon som valt att öppna
nätverksfliken mitt i en fråga och lika gärna kunde läsa svaret ur paketet.

## Att lägga till fler

```bash
python scripts/extract-book-signs.py     # klipper ut ur källan, gitignorerat
python scripts/optimise-book-signs.py    # optimerar de märken registret känner
```

Optimeraren tar bara med märken som finns i `road-signs.ts`. Bilagan innehåller
257 märkesbilder; att skeppa alla vore byte ingen tittar på.

## Rättigheter

Bilderna är hämtade ur *Körkortsboken 2026 för B-körkort*, © Hagberg Media AB /
Körkortonline.se, och används med tillstånd. Själva vägmärkessystemet är
Vägmärkesförordningen (2007:90) och tillhör ingen av oss.

Vägklars egna ritningar — de tio kvarvarande märkena, vägmarkeringarna och
undervisningsritningarna — är © 2026 Jimmy Eliasson. Se
[SOURCES-AND-RIGHTS.md](SOURCES-AND-RIGHTS.md).
