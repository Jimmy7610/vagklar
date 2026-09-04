# För dig som testar Vägklar

Tack för att du provar. Det här är en beta: innehållet är genomarbetat men inte
expertgranskat, och det står i appen på de ställen där det spelar roll.

Appen finns på <https://jimmy7610.github.io/vagklar/>. Den behöver inget konto,
ingen inloggning och ingen uppkoppling efter första besöket. Allt du gör sparas
bara i din egen webbläsare.

## Vad som är mest värdefullt att prova

Ungefär i den här ordningen — de tidigare punkterna säger mest.

1. **Läs en lektion och gör kontrollfrågorna.** Fastnar du på formuleringar?
   Förklarar texten *varför*, eller bara *vad*?
2. **Kör Dagens 10 några dagar i rad.** Känns urvalet relevant? Kommer det
   tillbaka till sådant du hade fel på?
3. **Gör en hel provsimulering.** 70 frågor, 50 minuter. Känns tidspressen rätt?
   Är något obesvarbart — till exempel en fråga om en bild du inte kan se?
4. **Gå igenom Mina misstag.** Förstår du varför svaret var fel?
5. **Prova Scenariolabben.** Är situationerna igenkännbara?
6. **Stäng av nätet mitt i ett pass.** Allt ska fortsätta fungera.
7. **Installera appen** på hemskärmen och kör den därifrån.

Prova gärna också med större text än vanligt — inställningen finns i appen, och
webbläsarens egen zoom fungerar också.

## Vad vi särskilt vill höra

- **Fel i sak.** Ett svar du är säker på är fel, eller en regel som ändrats.
  Det här är det viktigaste av allt.
- **Frågor som är otydliga** snarare än svåra. En bra fråga ska vara svår att
  svara på men lätt att förstå.
- **Något som känns långsamt, hackigt eller trasigt.**
- **Något du inte hittade** — en funktion du letade efter och gav upp på.
- **Text som är svår att läsa** i din vanliga textstorlek.

## Så rapporterar du en fråga

Varje fråga har ett id. Det syns när du expanderar förklaringen efter att du
svarat, och det ser ut som `alk-001` eller `bl4-003`.

Skriv gärna så här:

```
Fråga: alk-001
Vad jag förväntade mig: 0,2 promille
Vad appen sa: ...
Varför jag tror att det är fel: ...
```

Ett id räcker långt. Utan det får vi leta efter frågan på formuleringen, och
flera frågor kan likna varandra.

## Så rapporterar du något som inte fungerar

Fyra rader räcker, och de här fyra är de som annars kostar en extra runda:

```
Vad jag gjorde:
Vad jag förväntade mig:
Vad som hände i stället:
Teknisk information: (klistra in, se nedan)
```

Bifoga gärna en skärmbild. En bild av en trasig layout säger mer än en
beskrivning av den.

### Teknisk information

Under **Mer → Inställningar → Teknisk information** finns en knapp som kopierar
en kort text: appversion, webbläsare, fönsterstorlek, om du kör appen
installerad eller i en flik, om du var uppkopplad, och hur mycket du har sparat.

Tryck på **Visa vad som kopieras** först om du vill läsa den innan du skickar
den. Den innehåller inga svar, inget om vem du är, och skickas inte någonstans
av sig själv — den hamnar bara i urklipp när du trycker på knappen.

De tre uppgifterna som oftast avgör om ett fel går att återskapa är just:
**vilken webbläsare**, **installerad app eller flik**, och **online eller
offline**. Alla tre står i texten.

## Så delar du din träningsdata

Under **Mer → Inställningar → Din data** finns *Exportera utveckling*. Det ger
dig en JSON-fil med din egen träningshistorik: vilka frågor du svarat på, vad du
svarade och när.

Filen innehåller **inget om vem du är** — inget namn, ingen e-post, ingen
enhetsidentifierare, ingen position. Vägklar samlar aldrig in något om dig,
varken lokalt eller någon annanstans, så det finns inget sådant att exportera.

Skicka bara filen om du vill och om du blir ombedd. Den hjälper när något
beter sig konstigt och vi behöver se vilken följd av händelser som ledde dit.

Samma sida har *Återställ*, som tar bort allt omedelbart och oåterkalleligt.

## Kända begränsningar

Så att du inte lägger tid på att rapportera det vi redan vet:

- **Innehållet är granskat, inte expertverifierat.** 144 frågor står i kö för
  expertkontroll — de som innehåller ett rättsligt tal eller en regel som
  ändras över tid. Se [VERIFICATION-QUEUE.md](VERIFICATION-QUEUE.md). Den
  första omgången, alkohol och läkemedel, är förberedd för granskning men ännu
  inte signerad av någon: [granskningsbladet](review/BATCH-01-ALKOHOL-DROGER-OCH-LAKEMEDEL.md).
- **Provsimuleringen är Vägklars egen balans**, inte Trafikverkets. Deras
  viktning är inte publicerad, och vi påstår inte att vi återskapar den.
- **Provberedskapen är en uppskattning**, inte en sannolikhet att klara provet.
- **Ingen skärmläsargranskning är gjord än.** Strukturen är förberedd och
  testad automatiskt, och testprotokollen finns skrivna
  ([NVDA](NVDA-TESTING.md), [VoiceOver](VOICEOVER-TESTING.md)) — men ingen har
  kört dem.
- **Ingen har installerat appen på en riktig telefon och testat offline.**
  Bygget kontrolleras automatiskt, men installationsdialogen, hemskärmsikonen
  och ett riktigt flygplansläge är inte prövade. Protokollet finns i
  [REAL-DEVICE-PWA-QA.md](REAL-DEVICE-PWA-QA.md).
- **Bilder som du aldrig har sett** visas som text när du är offline. Det är
  avsiktligt — det håller installationen liten — men det kan förvåna.

## Vad appen aldrig gör

Ingen inloggning, ingen server, ingen analys, ingen spårning, inga cookies för
annat än det du själv ställer in. Vägklar vet inte att du finns.
