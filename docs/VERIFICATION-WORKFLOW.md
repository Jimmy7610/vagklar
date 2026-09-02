# Verifieringsflöde

Vägklars innehåll är **granskat**, inte **verifierat**, och den skillnaden är
avsiktlig.

*Granskat* betyder att frågan är skriven med omsorg, kontrollerad mot en källa
under författandet, läst igen och godkänd internt. *Verifierat* betyder att en
namngiven person har kontrollerat påståendet mot en namngiven källa ett
namngivet datum. Det andra är ett starkare påstående, och det görs inte av en
maskin. Ingenting i det här förvaret sätter status `verified` automatiskt.

Det vore lätt att märka hela banken som verifierad och se bra ut i en tabell.
Det skulle också vara osant, och för ett läromedel om trafikregler är det den
sämsta möjliga sortens fel.

## Statusarna

`QuestionStatus` i [`domain/content/types.ts`](../src/domain/content/types.ts):

| Status | Betyder | Visas för eleven |
| --- | --- | --- |
| `draft` | Skriven, ännu inte läst av någon annan. | Nej |
| `reviewed` | Läst och godkänd internt. Här ligger allt seed-innehåll. | Ja |
| `verified` | Kontrollerad mot namngiven källa av namngiven person. | Ja |
| `rejected` | Underkänd i granskning. Motiveringen sparas. | Nej |
| `retired` | Har varit publicerad, återkallad. Sparad progress löser fortfarande upp den. | Nej |

`LEARNER_VISIBLE_STATUSES` är den enda plats som avgör vad som når banken, så
en ny status kan inte råka bli synlig.

## Vad `verified` kräver

Statusen bär sin egen bevisbörda. Validatorn avvisar en `verified` fråga som
saknar något av:

| Fält | Varför |
| --- | --- |
| `verifiedAt` | När kontrollen gjordes. Regler ändras. |
| `verifiedBy` | Vem som står för den. Ett påstående utan ägare är ingen kontroll. |
| `verificationSourceIds` | Vilka källor som faktiskt öppnades, som id in i källregistret. |
| `lastReviewedAt` | Den vanliga granskningsstämpeln. |

Felkoderna heter `verified-without-signoff-date`, `verified-without-verifier`,
`verified-without-sources` och `verification-unknown-source`. Motsatt håll ger
en varning: verifieringsuppgifter på något som inte har status `verified`
(`signoff-without-verified-status`) är en halvfärdig granskning som annars
skulle bli liggande.

`reviewNotes` är granskarens anteckning — obligatorisk i praktiken för
`rejected`, där varningen `rejected-without-reason` annars slår till.

## Kön

```bash
npm run report:verification
```

Skriver två saker:

- **[docs/VERIFICATION-QUEUE.md](VERIFICATION-QUEUE.md)** — incheckad. Vad som
  bör kontrolleras, i vilken ordning, grupperat per kapitel.
- **`review/index.html`** — lokal, gitignorerad. Verktyget man faktiskt
  granskar i.

### Prioritet handlar om konsekvens, inte svårighet

| | Vad | Vad som står på spel |
| --- | --- | --- |
| **P1** | Rättsliga tal, gränsvärden, intervall, datum — och delområden vars regler ändras på egen hand (alkohol, däck, besiktning, hastighet, släp, miljözon). | Fel här och eleven går till provet, eller ut på vägen, med ett falskt faktum. |
| **P2** | Undantag, villkorade regler och beräkningar. | Fel här och eleven har rätt faktum men tillämpar det i fel situation. |
| **P3** | Förklarande kunskap utan rättsligt tal. | Fel här och resonemanget blir svagare, men inget osant lärs in som fakta. |

Klassificeringen är automatisk och avsiktligt trubbig: ett tal följt av en
enhet som bär rättslig vikt räcker för P1. Hellre för många i P1 än en
promillegräns som hamnade i P3.

## Granskningsverktyget

`review/index.html` öppnas direkt i en webbläsare — ingen server, ingen
inloggning, ingen admin-panel i produktion. Det är en genererad fil som bäddar
in hela banken och regenereras när innehållet ändras.

Filtrera på prioritet, kapitel eller status, sök på id eller text, och stega
med piltangenterna eller `j`/`k`. Varje kort visar frågan, alternativen med
rätt svar markerat, förklaringen, fördjupningen, minnesregeln, källorna med
paragraf och sidnummer, missuppfattningarna, och varför frågan hamnade i kön.
Knappen med frågans id kopierar id:t.

Det finns med flit ingen "godkänn"-knapp. Verktyget hjälper en människa att
läsa; ändringen görs i innehållsfilen, där den syns i en diff.

## Arbetsgång för en granskare

1. `npm run report:verification`
2. Öppna `review/index.html`, filtrera på **P1**
3. Kontrollera påståendet mot källorna som kortet listar
4. Om det stämmer — sätt i frågans definition:

   ```ts
   status: 'verified',
   lastReviewedAt: '2026-09-15',
   verifiedAt: '2026-09-15',
   verifiedBy: 'JE',
   verificationSourceIds: ['trafikforordningen', 'teoribok-2026-1'],
   ```

5. Om det inte stämmer — rätta frågan, eller sätt `status: 'rejected'` med
   `reviewNotes` som säger varför
6. `npm run report:content` — validatorn kontrollerar att sign-offen är komplett
7. `npm run generate:index && npm test`

## Sidhänvisningar

Ett sidnummer som bara ligger inom bokens omfång bevisar ingenting.

```bash
python scripts/extract-source-pages.py   # en gång, bygger den lokala cachen
npm run audit:pages
```

Granskningen jämför varje `sourcePages`-hänvisning mot den faktiska texten på
sidan och skriver [docs/SOURCE-PAGE-AUDIT.md](SOURCE-PAGE-AUDIT.md). Den skiljer
på sidtyper, eftersom boken inte är 367 sidor löptext:

| Sidtyp | Bedömning |
| --- | --- |
| Löptext | Måste dela nyckelord med frågan |
| Bildplansch (märkes- och markeringsuppslagen) | Räcker att planschen namnger frågans regel |
| Kapitelavdelare | Alltid fel — stödjer ingen regel |
| Självtest och facit | Alltid fel — är inte källtext |

Cachen byggs ur det licensierade källdokumentet och är gitignorerad, precis som
dokumentet självt. Utan den avbryter granskningen och säger det, i stället för
att tyst gå igenom.

Enstaka hänvisningar kan vara korrekta trots att kontrollen flaggar dem —
Vägklar och boken namnger inte alltid samma sak likadant. Sådana undantag ligger
i en namngiven lista i `scripts/audit-source-pages.ts` tillsammans med vad som
faktiskt står på sidan, och rapporten skriver ut dem i stället för att dölja
dem. Ett undantag som slutat flaggas listas som inaktuellt så listan inte växer
av gammal vana.

## Vad flödet inte gör

- Det märker ingenting som verifierat åt dig.
- Det räknar inte "granskat" som "kontrollerat av sakkunnig".
- Det ger ingen siffra på hur rätt banken är. Det säger vad som är kontrollerat
  och av vem, och lämnar resten öppet.

Produkten kan vara betaklar med en dokumenterad verifieringskö. Den kan inte
vara det med en påhittad verifieringsgrad.


## P1-typer

En platt P1 säger bara *att* något ska granskas först. Typerna säger *vad slags
kontroll* det kräver, vilket är skillnaden mellan att slå upp en paragraf och
att ta reda på om något ändrats i år. En fråga kan bära flera.

De tre första avgör att frågan hamnar i P1:

| Typ | Vad det betyder | Vad granskaren gör |
| --- | --- | --- |
| `P1-NUMERIC` | Innehåller ett tal som är rätt eller fel | Slår upp talet |
| `P1-VOLATILE` | Regelområdet ändras på egen hand | Kontrollerar om något ändrats sedan senast |
| `P1-ADMIN` | Administrativ regel — besiktning, registrering, försäkring | Kontrollerar mot myndighetens aktuella besked |

De övriga beskriver hur:

| Typ | Vad det betyder |
| --- | --- |
| `P1-LAW` | Går att slå upp ordagrant i författning |
| `P1-SAFETY` | Fel här kan leda till skada, inte bara till ett felaktigt svar — värt en andra läsare |
| `P1-EXCEPTION` | Ett rättsligt tal som dessutom har undantag; både talet och undantaget måste stämma |

Modellen ligger i `src/domain/content/verificationPriority.ts` och testas. Att
den ligger i domänen och inte i rapportskriptet är en följd av att den haft fel
två gånger: en tidig version befordrade allt som hänvisade till en författning
och satte 376 av 442 frågor i P1, och en senare version stavade fyra
delområdes-id fel så att reglerna aldrig utlöstes. Ett felstavat id i en `Set`
kastar inget fel — det matchar bara aldrig.

## Granskningsomgångar

Kön är grupperad i fjorton omgångar. En omgång är ett arbetspass: samma ämne,
samma källor uppslagna. Att hoppa mellan promillegränser och släpvagnsvikter
slösar bort arbetet med att ha slagit upp något.

Varje P1-fråga står i [VERIFICATION-QUEUE.md](VERIFICATION-QUEUE.md) med sin
frågetext, sitt rätta svar, sin förklaring, sin exakta källhänvisning, sina
typer och det fingeravtryck som ska klistras in vid signering.

## När en verifiering går ur takt

Verifiering är ett påstående om ett ögonblick: den här personen kontrollerade
den här formuleringen mot de här sidorna det här datumet. Ändras formuleringen
efteråt handlar påståendet plötsligt om något annat.

Därför bär en signerad fråga ett `verifiedFingerprint` — en hash av det som
faktiskt granskades: frågetext, svar, vilket svar som är rätt, regeln,
förklaringarna och källhänvisningarna. Ändras något av det stämmer inte
fingeravtrycket längre och validatorn ger `verification-stale-content`.

Metadata som inte påverkar påståendet ingår inte: svårighetsgrad, taggar,
uppskattad tid och granskningsnoteringar går att ändra utan att verifieringen
faller.

`verifiedAgainstEditions` noterar vilken utgåva av varje källa som användes. En
ny utgåva av boken gör inte svaret fel, men den betyder att ingen har
kontrollerat svaret mot den bok som nu står i hänvisningen —
`verification-stale-source`.

**Ingenting räknar om ett fingeravtryck automatiskt.** Det vore att signera i
någon annans namn. Vägen tillbaka är alltid att en människa läser om och
signerar på nytt.
