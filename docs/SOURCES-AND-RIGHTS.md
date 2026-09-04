# Källor och rättigheter

Vägklar är ett eget verk som lärt sig av andras. Den här filen redovisar vad som
är vems, och vilka spärrar som finns i koden för att hålla det så.

## 1. Vägklars eget material

Vägklars programvara, design, designsystem, egna vektorillustrationer,
Scenariolabbets grafik, lektionstexter, frågeformuleringar, förklaringar och
den adaptiva motorn är

> © 2026 Jimmy Eliasson. Alla rättigheter förbehållna.

om inget annat anges. Vägklar är utvecklad av Jimmy Eliasson.

## 2. Tredjepartsmaterial

| Källa | Rättighetshavare | Status | Hur den används |
| --- | --- | --- | --- |
| *Teoribok — Körkortsboken 2026 för B-körkort* (2026-1, 367 s., ISBN 978-91-991023-0-6), Körkortonline.se | Hagberg Media AB | Används med tillstånd | Kursplanens ryggrad och faktakontroll |
| Trafikförordningen (1998:1276) | Sveriges riksdag | Offentlig rättskälla | Regelkontroll, källhänvisning |
| Vägmärkesförordningen (2007:90) | Sveriges riksdag | Offentlig rättskälla | Vägmärken, markeringar |
| Körkortslagen (1998:488) | Sveriges riksdag | Offentlig rättskälla | Behörigheter, prövotid |
| Lag (1951:649) om straff för vissa trafikbrott | Sveriges riksdag | Offentlig rättskälla | Rattfylleri, vårdslöshet |

Registret finns maskinläsbart i [`src/content/sources.ts`](../src/content/sources.ts)
och visas för användaren på sidan **Källor** (`/kallor`).

### Vad "används med tillstånd" betyder här

Tillståndet omfattar både texten och bilderna i källan.

**Texten** används som källmaterial, inte som innehåll:

- Kursplanen i [`src/content/curriculum/curriculum.ts`](../src/content/curriculum/curriculum.ts)
  består av kapitelrubriker, sidintervall och begreppsnamn — den karta som krävs
  för att kunna svara på "täcker vi det här?".
- Ingen brödtext och ingen fråga ur boken återges.
- All text i Vägklar är skriven från grunden med egna ord och egna exempel.

**Bilderna** används däremot direkt, i ett kurerat urval:

- 65 bilder ur källan visas i lektioner och frågor: 54 fotografier och 11 ritningar.
- Fyra myndighets- och författningskällor tillkom när omgång 01 kontrollerades:
  brottsbalken, Polismyndigheten, 1177 Vårdguiden och Läkemedelsverket. Alla
  fyra är offentlig information eller offentlig rätt och används som
  hänvisning, aldrig som återgivet innehåll.
- 105 av de 115 vägmärkena ritas med källans egen märkesbild, hämtad ur
  märkesbilagan s. 324–361. Även märkenas namn är bokens egna, lästa ur
  bildtexterna. Se [LICENSED-SIGNS.md](LICENSED-SIGNS.md).
- De tio återstående ritas av Vägklar och är © 2026 Jimmy Eliasson. De är
  varianter av koder som boken ritar en gång, och ingen av dem presenteras
  som källans material.
- Själva vägmärkessystemet är Vägmärkesförordningen (2007:90) och tillhör
  varken Vägklar eller källan. Vägklar gör inga anspråk på det.
- Ritningarna krediteras som `Illustration:`, fotografierna som `Foto:`. Att kalla
  en ritning för ett fotografi vore fel både mot läsaren och mot rättighetshavaren.
- Varje bild visas med kreditering: utgivare, sidnummer, rättighetshavare och
  att den används med tillstånd.
- Rättighetshavarens egen vattenstämpel i fotografierna tas aldrig bort.
- Bilderna är **inte** Vägklars material och märks aldrig som sådant.
- Registret i [`src/content/source-images.ts`](../src/content/source-images.ts) bär
  rättighetsdata per bild, och innehållsvalidatorn avvisar en bild som saknar
  rättighetshavare eller tillståndsmarkering.

Se [SOURCE-IMAGES.md](SOURCE-IMAGES.md) för hela bildkedjan och
[SOURCE-DIAGRAMS.md](SOURCE-DIAGRAMS.md) för bokens figurer.

## Vägklars eget material

Vägklars kod, design, frågetexter, förklaringar, scenarier, vektorritade vägmärken
och vägmarkeringar samt de 15 egna undervisningsritningarna är Vägklars eget verk.
Upphovsrätt © 2026 Jimmy Eliasson.

De egna ritningarna ligger i ett **eget register** skilt från det licensierade,
och krediteras `Illustration: Vägklar · © 2026 Jimmy Eliasson` i appen. Skiljelinjen
upprätthålls av validatorn, inte av vaksamhet: samma id får inte finnas i båda
registren, och en post i det egna registret som tillskrivs Hagberg Media AB eller
Körkortonline.se är ett byggfel.

En egen ritning kan mycket väl lära ut en regel som *hänvisas* till källan eller
till lagtext — frågans källhänvisning och bildens ursprung är två skilda saker och
hålls isär.

Rättigheterna till boken tillhör Hagberg Media AB. Inget i det här projektet gör
anspråk på dem, och Jimmy Eliasson äger inte det materialet.

Trafikregler, lagtext, myndighetsföreskrifter och annan offentlig information
görs inga äganderättsanspråk på.

## 3. Ingen koppling till Trafikverket

> Vägklar är ett självständigt träningsverktyg och är inte ansluten till,
> sponsrad av eller godkänd av Trafikverket.

Frågorna i Vägklar är **originalfrågor**, skrivna för den här appen. De är inte
kopior av Trafikverkets provfrågor, och Vägklar påstår inte att de är det.
Den kanoniska formuleringen finns i `DISCLAIMER`
([`src/domain/constants.ts`](../src/domain/constants.ts)) och återanvänds överallt
i gränssnittet, så texten inte kan glida isär mellan sidor.

## 4. Källdokumentet publiceras aldrig

Källdokumenten ligger lokalt i `references/` och lämnar aldrig utvecklingsmaskinen.
Tre oberoende spärrar:

1. **Git.** `.gitignore` ignorerar `references/*.pdf`, `references/*.epub`,
   `references/**/extracted/` och `references/.page-text.json` — sidtextcachen som
   sidgranskningen bygger, och som är härledd ur källan och därför omfattas av
   samma regel som källan själv. Verifierat med `git check-ignore -v`. Rå-extraheringen
   av bildkandidater (263 filer, 31 MB) omfattas av samma regel.
2. **Bygget.** `npm run build` kör [`scripts/verify-build.mjs`](../scripts/verify-build.mjs),
   som avbryter bygget om `dist/` innehåller `.pdf`, `.epub`, `.mobi` eller `.docx`,
   om någon textresurs nämner källfilens namn, eller om service workern
   förhandscachar ett sådant dokument.
3. **CI.** Samma kontroll körs igen i `.github/workflows/deploy.yml` direkt före
   uppladdningen till GitHub Pages, så det som publiceras är kontrollerat i
   samma steg som det publiceras.

Kontrollen är testad genom att medvetet placera en PDF i `dist/` och en
referenssträng i en bundle — bygget föll i båda fallen. Den skiljer på källdokument
och härledda bildresurser: `.pdf`, `.epub`, `.mobi` och `.docx` blockeras, medan de
optimerade WebP-bilderna är godkänt appinnehåll. Bygget kontrollerar dessutom att
bilderna faktiskt finns, så en trasig bildpipeline blir ett byggfel i stället för
tyst försämrat innehåll.

## 5. Vad rapporten inte påstår

[`docs/CONTENT-COVERAGE.md`](CONTENT-COVERAGE.md) mäter hur mycket material som
finns per begrepp. Den mäter inte kvalitet. Inget innehåll märks som "verifierat"
bara för att det är genererat eller för att det finns en sidhänvisning bredvid.
Sidhänvisningar visar var något kan läsas vidare i källan — de är inte ett intyg
om att Vägklars text är granskad mot den.

## 6. Sidhänvisningar granskas maskinellt

Sedan 1.1.0-beta.1 kontrolleras varje sidhänvisning mot den faktiska texten på
den citerade sidan (`npm run audit:pages`). Granskningen skiljer på löptext,
bildplanscher, kapitelavdelare och självtest, och underkänner en hänvisning som
pekar på en sida som inte stödjer regeln. Det gör en sidhänvisning till ett
kontrollerbart påstående i stället för ett ungefärligt.

Den säger fortfarande ingenting om huruvida Vägklars formulering är korrekt.
Det är vad [VERIFICATION-WORKFLOW.md](VERIFICATION-WORKFLOW.md) beskriver, och
det kräver en människa.

## 7. Bildattribution syns alltid

Varje fotografi renderas genom `SourceImageFigure`, som hämtar källa, sida och
rättighetshavare ur registret och skriver dem under bilden — i lektioner, i
frågor, i provet och i det förstorade läget. Krediteringen kan inte stängas av
med en prop; bara den beskrivande bildtexten kan det, och bara i frågeläget där
den skulle röja svaret.

Faller bilden tillbaka till sin skrivna beskrivning, till exempel offline,
följer krediteringen med.

## 8. Om något ska tas bort

Om en rättighetshavare vill att något tas bort räcker det att ta bort posten ur
`SOURCES` och de begrepp som pekar på den; kursplanen, täckningsrapporten och
källsidan följer automatiskt med, eftersom alla tre läser samma register.
