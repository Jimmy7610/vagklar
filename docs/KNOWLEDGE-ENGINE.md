# Kunskapsmotorn

Allt här är rena, deterministiska funktioner. Samma indata och samma tidpunkt ger alltid samma
utdata, vilket är vad som gör modellen testbar — och vad som gör att "Dagens 10" ligger still under
en dag.

Alla siffror nedan är konstanter i [`src/domain/constants.ts`](../src/domain/constants.ts).

---

## 1. Svarskvalitet

Ett svar blir ett **kvalitetsvärde** mellan 0 och 1. Det är inte samma sak som rätt/fel.

```
kvalitet = grundvärde(korrekt, säkerhet) × svårighetsfaktor × svarstidsfaktor
```

### Grundvärde

|                  | Visste det | Osäker | Gissade | Ingen uppgift |
| ---------------- | ---------- | ------ | ------- | ------------- |
| **Rätt svar**    | 1,00       | 0,80   | 0,55    | 0,90          |
| **Fel svar**     | 0,00       | 0,05   | 0,12    | 0,03          |

Två saker är avsiktliga:

- Ett **rätt svar man gissat sig till** väger ungefär hälften så mycket som ett man var säker på.
  Kunskapen bakom det är inte stabil.
- Ett **säkert fel svar** är det sämsta möjliga värdet. Det betyder en missuppfattning, inte en
  lucka — och missuppfattningar är svårare att träna bort.

### Svårighet

| Svårighet | Vid rätt svar | Vid fel svar |
| --------- | ------------- | ------------ |
| Lätt      | ×0,96         | ×0,70        |
| Medel     | ×1,00         | ×1,00        |
| Svår      | ×1,06         | ×1,35        |

Att ha rätt på en svår fråga är värt mer. Att ha fel på en lätt fråga gör mer ont.

### Svarstid — en svag stödsignal, aldrig en drivande

Svarstid får bara *dämpa* ett rätt svar, aldrig höja det:

- snabbare än 30 % av frågans tidsuppskattning → ×0,95 (kan vara igenkänning snarare än resonemang)
- långsammare än 3,5× uppskattningen → ×0,98

Långsamma svar bestraffas alltså knappt alls. Det är medvetet: den som läser noggrant eller använder
hjälpmedel ska inte få en sämre kunskapsbild. Signalen kan stängas av helt i inställningarna
(`useResponseTimeSignal`), och den används aldrig för provsvar.

Vägklar gamifierar inte hastighet. Att belöna snabbhet skulle uppmuntra precis fel beteende.

---

## 2. Behärskning per delområde

Behärskning är ett exponentiellt viktat glidande medelvärde av kvalitetsvärden — **inte** andel
rätt.

```
α      = max(0,18, 0,5 / √(observationer + 1))
poäng' = poäng + α × (kvalitet − poäng)
```

Inlärningstakten är hög i början och planar ut mot ett golv, så att modellen svarar snabbt på nya
elever men inte hoppar runt för en van elev. Golvet på 0,18 gör att en verklig förbättring
fortfarande syns även efter hundra svar.

### Tillförlitlighet

```
tillförlitlighet = 1 − e^(−observationer / 5)
effektiv        = poäng × tillförlitlighet
```

Ett område med 90 % efter ett enda svar är inte samma sak som 90 % efter tjugo. Den **effektiva**
behärskningen används överallt där modellen jämför områden mot varandra; den råa poängen visas för
eleven.

Under tre observationer säger gränssnittet rakt ut att underlaget är för tunt.

### Områdesnivå

Behärskning för ett helt kunskapsområde är ett viktat medelvärde över delområden **som har frågor**,
där ett obesökt delområde räknas som noll. Det är den ärliga läsningen — "det här har du inte lärt
dig än" — och hindrar att ett område visar 90 % efter ett enda delområde.

---

## 3. Provberedskap

Provberedskapen är sju delar minus två avdrag. Den är **inte** andel rätt.

| Del                  | Vikt | Vad den mäter                                                     |
| -------------------- | ---- | ----------------------------------------------------------------- |
| Kunskapstäckning     | 0,34 | Viktat medel av *effektiv* behärskning över alla delområden        |
| Bredd                | 0,12 | Andel delområden med minst tre observationer                       |
| Senaste resultaten   | 0,18 | Andel rätt på de senaste 60 svaren                                 |
| Provresultat         | 0,16 | Senaste tre proven, tyngst på det senaste                          |
| Repetition           | 0,08 | 1 − andel schemalagda frågor som förfallit                         |
| Regelbundenhet       | 0,06 | Aktiva dagar de senaste 14, mot ett mål på 8                       |
| Självkännedom        | 0,06 | Hur väl angiven säkerhet stämmer med utfallet                      |

**Delar som inte går att mäta hoppas över och vikterna normaliseras om.** En elev som aldrig gjort
ett prov jämförs alltså inte med noll på den delen — de bedöms på det de faktiskt gjort. Det finns
ett test som låser fast just det beteendet.

### Avdrag

- **Svaga områden:** −0,035 per kunskapsområde under 50 % (med minst 5 observationer), max −0,15
- **Återkommande missuppfattningar:** −0,02 per mönster som återkommer minst 3 gånger bland de
  senaste 40 felen, max −0,06

### Preliminär fas

Under 20 besvarade frågor är siffran märkt *Preliminär* och taket är 60. Fem rätta svar ska inte
kunna se ut som provberedskap.

### Vad siffran inte är

Provberedskapen är Vägklars egen uppskattning av hur väl förberedd eleven är. Den är **inte** en
sannolikhet att bli godkänd på det riktiga kunskapsprovet, och gränssnittet säger det på varje
plats där siffran visas.

---

## 4. Repetition

En SM-2-härledd schemaläggare där **säkerheten**, inte bara korrektheten, sätter betyget:

| Svar                  | Betyg |
| --------------------- | ----- |
| Rätt, visste det      | 5     |
| Rätt, osäker          | 4     |
| Rätt, gissade         | 3     |
| Fel, osäker/gissade   | 1     |
| Fel, visste det       | 0     |

Godkänt betyg (≥3) ger intervallen 1 dag → 3 dagar → föregående × lätthet, upp till 120 dagar.
Underkänt nollställer serien och tar tillbaka frågan efter 20 minuter.

Lättheten rör sig inom 1,3–2,7. Ett rätt svar man gissat sig till ger alltså ett kortare intervall
än ett man var säker på, trots att båda är "rätt".

### Variation i stället för upprepning

Är en fråga besvarad inom två dagar väljer motorn hellre en **syskonfråga** — en annan fråga om
samma regel i samma delområde. Eleven tränar regeln, inte svarsalternativets placering.

---

## 5. Frågeurval

Alla passtyper går genom samma pipeline: samla kandidatpooler, poängsätt, sätt ihop under
mångfaldsvillkor.

| Pool          | Innehåll                                                                  |
| ------------- | ------------------------------------------------------------------------- |
| Svag          | De svagaste delområdena **med data** — ett obesökt område är outforskat, inte svagt |
| Förfallen     | Frågor vars repetitionsintervall gått ut, mest försenade först             |
| Misstag       | Nyligen missade frågor, eller en syskonfråga om samma regel                |
| Förstärkning  | Delområden i mittenbandet, där träning ger mest                            |
| Osedd         | Frågor eleven aldrig mött                                                  |

Sammansättningen begränsar hur många frågor som får komma från samma delområde, så att ett pass
aldrig blir enahanda. Taket släpps bara om passet annars inte kan fyllas.

### Dagens 10

3 svaga + 2 förfallna + 2 misstag + 2 förstärkning + 1 osedd, med efterfyllnad i prioritetsordning
när en pool är tom. Fröet är stabilt per profil och kalenderdag, så listan ligger still under dagen.
Passet sorteras med de lättare frågorna först.

### Nästa bästa steg

Hemskärmen svarar på en enda fråga. Prioritetsordningen är:

1. Inget besvarat än → ett kort brett pass
2. Minst 5 förfallna repetitioner → rensa ryggsäcken innan nytt material
3. Ett tydligt svagt område med data → träna det
4. Kvarstående misstag → repetera begreppet
5. Annars → bredda täckningen

---

## 6. Provrättning

Se [`src/domain/exam/exam.ts`](../src/domain/exam/exam.ts).

Frågorna fördelas över kunskapsområden proportionellt mot `examWeight` med största-rest-metoden,
begränsat av hur många frågor varje område faktiskt har. Fem frågor markeras som oräknade,
deterministiskt utifrån provets frö.

Provsvar rörs **inte** in i inlärningsdatan förrän provet lämnats in. Att uppdatera behärskningen
under provet vore i praktiken samma sak som att ge återkoppling.

Klockan lever på det sparade försöket (`deadlineAt`). Att ladda om, stänga fliken eller gå offline
kan inte köpa mer tid — ett försök vars deadline passerat rättas vid inläsning.

---

## 7. Vad motorn *inte* vet

Motorn mäter hur du svarar på det Vägklar faktiskt frågar om. Den vet ingenting om
delar av kursplanen där det inte finns några frågor — där kan behärskningen varken
vara hög eller låg, den är omätt.

Därför hör [CONTENT-COVERAGE.md](CONTENT-COVERAGE.md) ihop med den här filen.
Täckningsrapporten är motorns synfält: 90 av 173 kursplanebegrepp har tillräckligt
med material, 19 har inga frågor alls. Provberedskapen räknas på det som gått att
mäta och normaliserar om vikterna för resten — den låtsas inte att omätta delar är
godkända, men den kan heller inte varna för en lucka den inte känner till.

Det är också skälet till att beredskapen håller tyst helt under de första
`READINESS.firstEstimateAnswers` svaren och i stället räknar ned: en siffra byggd på
tre svar är inte försiktig, den är påhittad.
