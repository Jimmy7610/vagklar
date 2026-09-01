# Innehållsvalidering

> **Genererad fil.** Redigera den inte för hand — kör `npm run report:content`.

## Vad som kontrolleras

[`src/domain/content/validation.ts`](../src/domain/content/validation.ts) är en ren
funktion som körs både här och i testsviten. Den skiljer på **fel**, som inte får
finnas i banken, och **varningar**, som en människa bör titta på.

Fel som avvisas:

| Kod | Betyder |
| --- | --- |
| `duplicate-id` | Två frågor har samma id |
| `unknown-subcategory` | Delområdet finns inte i taxonomin |
| `category-mismatch` | Området stämmer inte med delområdet |
| `unmapped-subcategory` | Delområdet saknar begrepp i kursplanen |
| `answer-count` | Färre än 3 eller fler än 4 alternativ |
| `duplicate-answer-id` / `duplicate-answer-text` | Två alternativ är identiska |
| `missing-correct-answer` | Det rätta svaret finns inte bland alternativen |
| `empty-answer` / `missing-prompt` / `missing-explanation` | Tomt obligatoriskt fält |
| `bad-difficulty` | Svårighetsgrad utanför 1–3 |
| `missing-source` / `source-without-name` | Källhänvisning saknas |
| `unknown-source-id` | Källan finns inte i källregistret |
| `bad-source-page` / `source-page-out-of-range` | Omöjligt sidnummer |
| `missing-rights-holder` | Tredjepartskälla utan rättighetshavare |
| `unknown-misconception` | Missuppfattningen finns inte |
| `misconception-on-correct` | Det rätta svaret är taggat som en missuppfattning |
| `verified-without-date` | Status `verified` utan verifieringsdatum |
| `dangling-related` | Länk till en fråga som inte finns |

Varje kontroll har ett test som medvetet planterar felet och kontrollerar att
validatorn fångar det — se
[`validation.test.ts`](../src/domain/content/validation.test.ts).

## Resultat

Kontrollerade frågor: **259**

- Fel: **0**
- Varningar: **0**

## Dubblettkontroll

Enkel normaliserad jämförelse plus Jaccard-likhet på ord — inget beroende, ingen
modell. Exakt lika frågetext och identiska svarsuppsättningar *inom samma
delområde* behandlas som fel i testsviten. Liknande formuleringar rapporteras
bara, eftersom en variant som ändrar ett villkor med avsikt kan ligga nära.

Inga dubbletter över tröskeln 0,70 bland 259 frågor.

## Bankens sammansättning

| Mått | Antal | Andel |
| --- | ---: | ---: |
| Frågor totalt | 259 | 100 % |
| Lätta (1) | 44 | 17 % |
| Medel (2) | 155 | 60 % |
| Svåra (3) | 60 | 23 % |

| Frågetyp | Antal |
| --- | ---: |
| multiple-choice | 239 |
| calculation | 12 |
| road-sign | 8 |

| Granskningsstatus | Antal |
| --- | ---: |
| reviewed | 259 |

Namngivna missuppfattningar: **140**.
Områden: **17**, delområden: **71**.

> Ingen fråga har status `verified`. Det är avsiktligt: innehållet är skrivet
> mot källorna och internt granskat, men inte signerat av en sakkunnig. Se
> [QUESTION-AUTHORING.md](QUESTION-AUTHORING.md).

## Rättigheter

Vägklars programvara, design, egna illustrationer och eget originalinnehåll är © 2026 Jimmy Eliasson, om inget annat anges.

Material från Körkortonline.se / Hagberg Media AB används med tillstånd och tillhör respektive rättighetshavare.

Vägklar är en fristående träningsprodukt och är inte ansluten till eller godkänd av Trafikverket.
