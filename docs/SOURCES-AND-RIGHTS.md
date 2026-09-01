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

- 26 fotografier ur källan visas i lektioner och frågor, valda ur 263 kandidater.
- Varje bild visas med kreditering: utgivare, sidnummer, rättighetshavare och
  att den används med tillstånd.
- Rättighetshavarens egen vattenstämpel i fotografierna tas aldrig bort.
- Bilderna är **inte** Vägklars material och märks aldrig som sådant.
- Registret i [`src/content/source-images.ts`](../src/content/source-images.ts) bär
  rättighetsdata per bild, och innehållsvalidatorn avvisar en bild som saknar
  rättighetshavare eller tillståndsmarkering.

Se [SOURCE-IMAGES.md](SOURCE-IMAGES.md) för hela bildkedjan.

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

1. **Git.** `.gitignore` ignorerar `references/*.pdf`, `references/*.epub` och
   `references/**/extracted/`. Verifierat med `git check-ignore -v`. Rå-extraheringen
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

## 6. Om något ska tas bort

Om en rättighetshavare vill att något tas bort räcker det att ta bort posten ur
`SOURCES` och de begrepp som pekar på den; kursplanen, täckningsrapporten och
källsidan följer automatiskt med, eftersom alla tre läser samma register.
