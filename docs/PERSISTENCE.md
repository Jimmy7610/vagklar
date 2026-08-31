# Uthållighet

## Modellen

Hela elevdatan är liten nog att hållas i minnet. Appen läser den en gång vid start och skriver
sedan igenom granulärt. Det gör varje skärm omedelbar och håller det reaktiva lagret fritt från
asynkrona läsningar.

- **Minnet är sanningen** medan appen körs
- **IndexedDB är den varaktiga spegeln**
- En misslyckad skrivning bryter aldrig sessionen

`localStorage` används enbart för tre små gränssnittsinställningar (tema, rörelse, textstorlek), och
bara som en snabb spegel så att rätt tema kan målas på första bildrutan. Sanningen ligger även för
dem i IndexedDB.

## Objektlager

| Lager            | Nyckel          | Index                                   |
| ---------------- | --------------- | --------------------------------------- |
| `meta`           | `key`           | –                                       |
| `answers`        | `id`            | `byQuestion`, `byTime`, `bySubcategory` |
| `questionStates` | `questionId`    | `byDue`                                 |
| `mastery`        | `subcategoryId` | –                                       |
| `sessions`       | `id`            | `byTime`                                |
| `exams`          | `id`            | `byTime`                                |
| `lessons`        | `lessonId`      | –                                       |
| `achievements`   | `id`            | –                                       |
| `readiness`      | `date`          | –                                       |

`meta` håller profil, inställningar, schemaversion, appversion, pågående pass och aktuellt prov.

## Vad som överlever

Allt utom övergående gränssnittstillstånd:

- profil, introduktionsläge, svit och totaler
- varje svar, med säkerhet, svarstid, läge och eventuell missuppfattning
- behärskning per delområde och repetitionsschema per fråga
- **påbörjat träningspass** — inklusive vilken fråga du står på
- **pågående prov** — inklusive markeringar, svar och deadline
- lektionsframsteg, milstolpar, beredskapshistorik, sparade frågor

Verifierat i praktiken: se [QA.md](QA.md).

## Versionering och migrationer

Två versioner hålls isär:

- `DATABASE_VERSION` — objektlager och index (IndexedDB-uppgradering)
- `SCHEMA_VERSION` — formen på *innehållet* i posterna

Innehållsmigrationer ligger i [`src/storage/schema.ts`](../src/storage/schema.ts) som rena
funktioner `payload → payload`, en per version. De körs både vid inläsning och vid import.

Data skriven av en **nyare** version läses aldrig in — appen kan inte veta vad den betyder. Den
säger det rakt ut i stället för att gissa.

## Defensiv inläsning

Sparade poster är otillförlitlig indata: de kan komma från ett äldre bygge, en halvskriven
transaktion eller en importerad fil. Varje post går genom en läsare i
[`src/storage/sanitize.ts`](../src/storage/sanitize.ts) som antingen returnerar ett välformat värde
eller `null`. Ingenting kastar.

- Svar på frågor som inte längre finns förkastas
- Behärskning för okända delområden förkastas
- Tal klampas till sina giltiga intervall, uppräkningar faller tillbaka på ett känt värde
- Ett pass vars frågor alla försvunnit är inte återupptagbart och förkastas
- Antalet förkastade poster rapporteras i gränssnittet: *"N sparade poster kunde inte läsas"*

## Export och import

`Inställningar → Exportera utveckling` skriver en versionerad JSON-fil:

```json
{
  "format": "vagklar-backup",
  "formatVersion": 1,
  "schemaVersion": 1,
  "appVersion": "1.0.0",
  "exportedAt": "2026-09-01T10:00:00.000Z",
  "data": { }
}
```

Import validerar **varje** post med samma läsare som används för lagrad data, migrerar äldre
scheman, och visar en sammanfattning — antal svar, områden, pass, prov, exportdatum och hur många
poster som inte gick att läsa — **innan** något ersätts. Filer från ett nyare format avvisas.

## Återställning

`Radera all utveckling` kräver att eleven skriver `RADERA`. Den raderar databasen och öppnar en ny.

Den subtila delen är att en skrivning som redan var i luften inte får återuppliva raderad
utveckling — en `pagehide`-hanterare kan fyra av efter att raderingen slutförts. Lösningen är att
en post inte är inaktuell för att den *skrevs sent*, utan för att den *bär gammal tid*:
`resetAll` sätter en tidsstämpel, och varje skrivning vars egen tidsstämpel är äldre än den
förkastas. Import lyfter spärren, eftersom en säkerhetskopias poster med rätta är äldre.

Det finns ett test som just simulerar en fördröjd skrivning över en radering.

## När lagring saknas

Privat läge, blockerad lagring eller en gammal webbläsare ger minnesläge. Appen fungerar under
sessionen, och gränssnittet säger rakt ut att utvecklingen inte sparas till nästa besök. Inga
skrivningar kastar.
