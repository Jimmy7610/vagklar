# NVDA-testning

**Status: förberedd, inte körd.** Det här är ett testprotokoll, inte ett
testresultat. Ingen rad nedan är avbockad, och ingen ska bockas av av något
annat än en människa med NVDA igång.

Sidan beskriver vad som *finns* i markupen — landmärken, rubriker, namn på
kontroller, live-regioner — kontrollerat i webbläsaren 2026-09-04. Vad NVDA
faktiskt läser upp är en annan fråga, och den besvaras bara av att lyssna.

## Förutsättningar

| | |
| --- | --- |
| Skärmläsare | NVDA 2024.1 eller senare |
| Webbläsare | Chrome och Firefox, senaste stabila |
| Bygge | `npm run build && npm run preview` — testa produktionsbygget, inte dev-servern |
| Adress | <http://localhost:4173/vagklar/> |
| Utgångsläge | Nollställ i Inställningar → Återställ, så att flödena börjar från början |

Kör med **hörlurar** och **skärmen avstängd eller täckt** minst en gång per
flöde. Det är den enda kontrollen som fångar "man ser ju vad som händer".

## Kommandon du behöver

| Tangent | Gör |
| --- | --- |
| `NVDA + Mellanslag` | Växlar bläddringsläge / fokusläge |
| `H` / `Skift + H` | Nästa / föregående rubrik |
| `1`–`6` | Rubrik på den nivån |
| `D` / `Skift + D` | Nästa / föregående landmärke |
| `F` | Nästa formulärfält |
| `B` | Nästa knapp |
| `K` | Nästa länk |
| `Tabb` | Nästa fokuserbara kontroll |
| `Retur` / `Mellanslag` | Aktivera |
| `Esc` | Stäng dialog |
| `NVDA + F7` | Elementlista (rubriker, länkar, landmärken) |
| `NVDA + Ned` | Läs allt härifrån |

## Så fyller du i

Varje rad har en förväntan. Skriv **OK**, **AVVIKER** eller **BLOCKERAR**, och
vid avvikelse: exakt vad NVDA sa i stället.

`BLOCKERAR` betyder att en användare med skärmläsare inte kan slutföra
uppgiften. Det är den enda allvarlighetsgraden som stoppar extern beta.

---

## 1. Landningssidan

| # | Steg | Förväntat | Utfall |
| --- | --- | --- | --- |
| 1.1 | Ladda `/vagklar/` | Sidtiteln läses: "Vägklar — Lär dig teorin…" |  |
| 1.2 | `D` genom landmärken | banner → main → contentinfo, ingen dubblett |  |
| 1.3 | `H` från toppen | Exakt en `H1`, sedan `H2` i fallande ordning utan hopp |  |
| 1.4 | `Tabb` en gång från adressfältet | Första stoppet är "Hoppa till innehållet" |  |
| 1.5 | Aktivera hoppa-till-innehållet | Fokus hamnar i `main`, inte kvar i sidhuvudet |  |

## 2. Hem

| # | Steg | Förväntat | Utfall |
| --- | --- | --- | --- |
| 2.1 | Gå till Hem | `H1` är hälsningen ("God morgon" / "God kväll") |  |
| 2.2 | `D` | `main` och `nav` med namnet "Huvudmeny" |  |
| 2.3 | `H` | `H2` för varje sektion: Kom igång, Snabbt igång, Vad din träning visar |  |
| 2.4 | Tabba till "Hur räknas det?" | Länken har ett eget namn, inte "läs mer" |  |
| 2.5 | Bottenmenyn | Fem länkar med namn: Hem, Träna, Prov, Utveckling, Mer |  |
| 2.6 | Aktuell sida i menyn | Meddelas som aktuell (`aria-current`) |  |

## 3. Teorilektion

| # | Steg | Förväntat | Utfall |
| --- | --- | --- | --- |
| 3.1 | Öppna en lektion från Teoriskolan | `H1` är lektionens titel |  |
| 3.2 | `H` genom lektionen | Rubriknivåerna hoppar inte över steg |  |
| 3.3 | Ett foto i lektionen | Alt-texten beskriver bilden; den långa beskrivningen läses också |  |
| 3.4 | Förstora-knappen på ett foto | Namnet innehåller bildens titel, inte bara "förstora" |  |
| 3.5 | Öppna förstoringen | Fokus hamnar i dialogen; `Esc` stänger; fokus tillbaka på knappen |  |
| 3.6 | Ett `signInContext`-block | Märkesbilden läses en gång, inte två (bilden är dekorativ, texten bär beskrivningen) |  |
| 3.7 | Ett `markingInContext`-block | Ritningens namn och kod läses, sedan fotot |  |

## 4. Träningsfråga

Markupen: svarsalternativen är `button` med `aria-pressed`, inne i en
`div[role="group"]` med namnet "Svarsalternativ". Framstegsräknaren och
återkopplingen är `aria-live="polite"`.

| # | Steg | Förväntat | Utfall |
| --- | --- | --- | --- |
| 4.1 | Starta ett pass | `H1` är frågetexten |  |
| 4.2 | Lyssna på framsteget | "Fråga 1 av 10" läses upp |  |
| 4.3 | `Tabb` genom alternativen | Fyra knappar, var och en läser bokstav + svarstext |  |
| 4.4 | Tillstånd före svar | Varje alternativ meddelas som ej intryckt |  |
| 4.5 | Svara | Återkopplingen läses upp utan att fokus behöver flyttas manuellt |  |
| 4.6 | Lyssna på återkopplingen | Verdikt ("Rätt" / "Inte riktigt") och förklaring hörs båda |  |
| 4.7 | **Lyssna särskilt** | Verdikt och förklaring ligger i samma live-region och kan läsas ihop utan paus. Notera om det låter hopklistrat |  |
| 4.8 | `Tabb` efter svar | Når "Förklara mer", "Spara frågan" och säkerhetsknapparna |  |
| 4.9 | Säkerhetsknapparna | "Visste det", "Osäker", "Gissade" — namnen räcker utan att se dem |  |
| 4.10 | Nästa fråga | Den nya frågetexten meddelas; fokus står inte kvar på gammalt innehåll |  |

## 5. Bildburen fråga

| # | Steg | Förväntat | Utfall |
| --- | --- | --- | --- |
| 5.1 | Nå en fråga med fotografi | Alt-texten beskriver vad som syns |  |
| 5.2 | **Kontrollera läckan** | Beskrivningen får inte innehålla det rätta svaret ordagrant |  |
| 5.3 | Den långa beskrivningen | Läses upp, och räcker för att kunna svara utan att se bilden |  |
| 5.4 | Efter svar | Bildtexten blir tillgänglig — den var dold medan frågan var öppen |  |

## 6. Märkesfråga och märkesstolpe

| # | Steg | Förväntat | Utfall |
| --- | --- | --- | --- |
| 6.1 | En fråga med ett vägmärke | Märket beskrivs till utseende, inte till betydelse |  |
| 6.2 | En fråga med stolpe (märke + tavla) | Läses som *en* figur, uppifrån och ned: märket, sedan tavlan |  |
| 6.3 | Före svar | Ingen sammanlagd innebörd läses upp |  |
| 6.4 | Efter svar | Den sammanlagda innebörden blir tillgänglig |  |

## 7. Provsimulering

| # | Steg | Förväntat | Utfall |
| --- | --- | --- | --- |
| 7.1 | Starta ett prov | Bekräftelsedialogen får fokus; `Esc` avbryter |  |
| 7.2 | Provets `H1` | Innehåller frågenummer eller frågetext, inte bara "Prov" |  |
| 7.3 | Klockan | **Lyssna**: läses tiden om varje sekund? Det ska den inte |  |
| 7.4 | Klockan vid larmnivå | Om appen varnar när tiden tar slut, hörs det en gång |  |
| 7.5 | "Markera" | Namnet säger vad som markeras; tillståndet meddelas när det ändras |  |
| 7.6 | "Föregående" / "Nästa" | Namn utan att se dem; inaktiv knapp meddelas som inaktiv |  |
| 7.7 | "Översikt över frågorna" | Öppnar dialog, fokus hamnar i den |  |
| 7.8 | Cellerna i översikten | Varje cell heter "Fråga N, obesvarad" / "besvarad" / "markerad" |  |
| 7.9 | Välj en cell | Dialogen stängs, den valda frågan meddelas |  |
| 7.10 | `Esc` i översikten | Stänger; fokus tillbaka på knappen som öppnade |  |
| 7.11 | "Lämna in" | Bekräftelse först; antalet obesvarade läses upp |  |
| 7.12 | Resultatet | `H1` säger utfallet; poängen läses utan att man ser diagrammet |  |

## 8. Mina misstag

| # | Steg | Förväntat | Utfall |
| --- | --- | --- | --- |
| 8.1 | Öppna Mina misstag | `H1` finns; tom lista har en begriplig text |  |
| 8.2 | Ett listobjekt | Frågan och vad som gick fel läses ihop, inte som lösa fragment |  |

## 9. Vägmärkeskatalogen

| # | Steg | Förväntat | Utfall |
| --- | --- | --- | --- |
| 9.1 | Nå katalogen i vägmärkeslektionen | Sökfältet har en etikett ("Sök bland 115 märken") |  |
| 9.2 | Skriv i sökfältet | Träffantalet meddelas via live-regionen |  |
| 9.3 | Filterknapparna | Grupp med namn; varje knapps intryckta tillstånd meddelas |  |
| 9.4 | `Tabb` genom korten | Varje kort är en knapp som läser namn, kod, betydelse |  |
| 9.5 | Öppna ett kort | Dialog med **exakt en rubrik** — märkets namn |  |
| 9.6 | I dialogen | Grupperna "Så ser märket ut", "Samma kod…", "Lätt att blanda ihop med" har namn |  |
| 9.7 | Märkesbilden i dialogen | Läses **inte** — beskrivningen står som text under |  |
| 9.8 | `Esc` | Stänger; fokus tillbaka på kortet |  |
| 9.9 | Sök så att kortet försvinner, öppna, stäng | Fokus hamnar i sökfältet, inte i tomma intet |  |

## 10. Inställningar

| # | Steg | Förväntat | Utfall |
| --- | --- | --- | --- |
| 10.1 | Varje sektion | Har rubrik och läses som en region |  |
| 10.2 | Segmenterade val (tema, textstorlek) | Grupp med namn; valt alternativ meddelas |  |
| 10.3 | Ändra textstorlek | Ändringen får inte flytta fokus |  |
| 10.4 | Switcharna | Namn plus på/av |  |
| 10.5 | "Exportera utveckling" | Namn utan att se det; nedladdningen bekräftas |  |
| 10.6 | "Importera utveckling" | Filväljaren nås via knappen, inte bara via det dolda fältet |  |
| 10.7 | Efter import | Sammanfattningen läses upp |  |
| 10.8 | "Kopiera teknisk information" | Bekräftelsen "Teknisk information kopierad" meddelas |  |
| 10.9 | "Visa vad som kopieras" | `aria-expanded` ändras; texten blir läsbar |  |
| 10.10 | Radera all utveckling | Bekräftelsen kräver inskriven text; fältet har etikett |  |

## Vad som räknas som blockerande

- En kontroll utan namn på ett flöde som måste gå att slutföra
- Fokus som lämnar dokumentet eller fastnar i en stängd dialog
- Återkoppling på en fråga som aldrig meddelas
- Klockan i provet som läses om oavbrutet
- Det rätta svaret uppläst innan man svarat

## När testet är kört

Skriv resultatet i [QA.md](QA.md) med datum, NVDA-version och webbläsare, och
byt status högst upp i det här dokumentet. **Ändra inte statusen förrän testet
faktiskt är kört.**
