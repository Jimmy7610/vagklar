# Test på riktig enhet — installation och offline

**Status: förberedd, inte körd.** Ingenting nedan är avbockat, och ingen rad
får bockas av från en emulator. Hela poängen med det här dokumentet är att
emulatorn inte prövar det som brukar gå sönder: installationsdialogen, ikonen
på hemskärmen, ett riktigt flygplansläge, en riktig hemindikator och en
service worker som överlever att appen stängts helt.

Det som *går* att pröva utan enhet är redan prövat i bygget: förhandscachen
innehåller 169 poster och noll fotografier, appskalet och manifestet finns, och
startpaketet ligger under budgeten. Det står i [QA.md](QA.md). Det säger
ingenting om huruvida appen går att installera.

## Bygget som ska testas

Testa **produktionsbygget**, aldrig dev-servern — service workern finns bara i
bygget.

```
npm run build
npm run preview
```

Lokalt: <http://localhost:4173/vagklar/>. Publicerat:
<https://jimmy7610.github.io/vagklar/>.

För test från telefon mot en dator på samma nät: `npm run preview -- --host`.
Observera att service workers kräver `https` eller `localhost` — mot en
IP-adress installeras ingen. Testa installation mot den publicerade adressen.

## Före varje omgång

1. Avinstallera en tidigare installerad Vägklar från hemskärmen
2. Rensa webbplatsdata för domänen
3. Notera exakt: modell, OS-version, webbläsarversion
4. Sätt textstorleken i systemet till standard — förutom i steget som prövar den

---

## Android — Chrome

| # | Steg | Förväntat | Utfall |
| --- | --- | --- | --- |
| A1 | Öppna adressen i Chrome | Sidan laddar; ingen konsolfel-banner |  |
| A2 | Vänta / öppna menyn | "Installera app" eller "Lägg till på startskärmen" erbjuds |  |
| A3 | Installera | Ikonen hamnar på hemskärmen med rätt namn och ikon |  |
| A4 | Starta från hemskärmen | Appen öppnas utan adressfält (standalone) |  |
| A5 | Kontrollera i appen | Inställningar → Teknisk information säger "installerad (standalone)" |  |
| A6 | Träna tio frågor | Svar sparas; utvecklingen uppdateras |  |
| A7 | Starta ett prov, svara på fem, stäng appen helt | — |  |
| A8 | Öppna igen | Provet går att återuppta; klockan har fortsatt räkna |  |
| A9 | Slå på flygplansläge | — |  |
| A10 | Starta appen från hemskärmen | Appen startar. Det här är själva offlinetestet |  |
| A11 | Öppna en teorilektion | Texten finns |  |
| A12 | Vägmärken i lektionen | Märkesbilderna syns — de är förhandscachade |  |
| A13 | Ett fotografi du redan sett | Syns — det ligger i körtidscachen |  |
| A14 | Ett fotografi du **inte** sett | Den skrivna beskrivningen visas i stället för en trasig bild |  |
| A15 | Träna offline | Frågor går att svara på; svaren sparas |  |
| A16 | Provsimulering offline | Går att starta och slutföra |  |
| A17 | Stäng av flygplansläget | Appen fortsätter utan omstart |  |
| A18 | Vrid till liggande | Layouten flyter om; ingen horisontell scroll |  |
| A19 | Systemets textstorlek → största | Appen är användbar; bottenmenyn syns |  |
| A20 | Chrome → Inställningar → textskalning 200 % | Ingen horisontell scroll på Hem, Träna, Prov |  |
| A21 | Provets frågeöversikt | Cellerna går att träffa med tummen |  |
| A22 | Exportera utveckling | Filen hamnar i Nedladdningar |  |
| A23 | Importera samma fil | Sammanfattningen visas; inget dubbleras |  |
| A24 | Bygg om appen och publicera | Uppdateringsprompten dyker upp i den installerade appen |  |

## iOS — Safari

| # | Steg | Förväntat | Utfall |
| --- | --- | --- | --- |
| I1 | Öppna adressen i Safari | Sidan laddar |  |
| I2 | Dela → Lägg till på hemskärmen | Namn och ikon stämmer |  |
| I3 | Starta från hemskärmen | Öppnas utan adressfält |  |
| I4 | Teknisk information | Säger "installerad (iOS)" |  |
| I5 | Säkert område nedtill | Bottenmenyn ligger ovanför hemindikatorn, inte under |  |
| I6 | Säkert område upptill | Sidhuvudet hamnar inte under kameran i liggande läge |  |
| I7 | Träna tio frågor | Svaren sparas |  |
| I8 | Starta ett prov, stäng appen helt (svep bort) | — |  |
| I9 | Öppna igen | Provet går att återuppta |  |
| I10 | Flygplansläge, starta från hemskärmen | Appen startar |  |
| I11 | Teorilektion offline | Text och märkesbilder finns |  |
| I12 | Osett fotografi offline | Beskrivningen visas i stället |  |
| I13 | Dynamisk text på max | Appen är användbar |  |
| I14 | Vrid till liggande och tillbaka | Inget innehåll försvinner |  |
| I15 | Tangentbord i ett textfält | Fältet skyms inte av tangentbordet |  |
| I16 | Låt appen ligga en dag, öppna igen | Utvecklingen finns kvar (se varningen nedan) |  |
| I17 | VoiceOver-protokollet | Kör [VOICEOVER-TESTING.md](VOICEOVER-TESTING.md) i installerat läge |  |

### En känd risk på iOS som testet ska mäta

Safari rensar lagring för webbplatser som inte besökts på sju dagar. En
installerad app räknas normalt inte in, men beteendet har ändrats mellan
versioner. Steg I16 finns för att mäta det på riktigt, och om utvecklingen
försvinner är det ett fynd som hör hemma i README:s begränsningar — inte en bugg
att tysta.

## Vad som stoppar extern beta

- Appen går inte att installera
- Appen startar inte offline
- Ett påbörjat prov går inte att återuppta
- Utveckling försvinner mellan sessioner
- Bottenmenyn ligger under hemindikatorn så att flikarna inte går att träffa
- Horisontell scroll vid 200 % text

Allt annat noteras och prioriteras.

## När testet är kört

Skriv resultatet i [QA.md](QA.md) — modell, OS, webbläsare, datum — och byt
statusen högst upp. Skriv aldrig "testad" om något steg hoppades över; skriv
vilket.
