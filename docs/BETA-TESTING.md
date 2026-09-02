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

## Så delar du din träningsdata

Under **Mer → Inställningar** finns *Exportera min data*. Det ger dig en
JSON-fil med din egen träningshistorik: vilka frågor du svarat på, vad du
svarade och när.

Filen innehåller **inget om vem du är** — inget namn, ingen e-post, ingen
enhetsidentifierare, ingen position. Vägklar samlar aldrig in något om dig,
varken lokalt eller någon annanstans, så det finns inget sådant att exportera.

Skicka bara filen om du vill och om du blir ombedd. Den hjälper när något
beter sig konstigt och vi behöver se vilken följd av händelser som ledde dit.

Samma meny har *Radera all min data*. Den tar bort allt omedelbart och
oåterkalleligt.

## Kända begränsningar

Så att du inte lägger tid på att rapportera det vi redan vet:

- **Innehållet är granskat, inte expertverifierat.** 131 frågor står i kö för
  expertkontroll — de som innehåller ett rättsligt tal eller en regel som
  ändras över tid. Se [VERIFICATION-QUEUE.md](VERIFICATION-QUEUE.md).
- **Provsimuleringen är Vägklars egen balans**, inte Trafikverkets. Deras
  viktning är inte publicerad, och vi påstår inte att vi återskapar den.
- **Provberedskapen är en uppskattning**, inte en sannolikhet att klara provet.
- **Ingen skärmläsargranskning är gjord än.** Strukturen är förberedd och
  testad automatiskt, men ingen har kört appen med NVDA eller VoiceOver.
- **Bilder som du aldrig har sett** visas som text när du är offline. Det är
  avsiktligt — det håller installationen liten — men det kan förvåna.

## Vad appen aldrig gör

Ingen inloggning, ingen server, ingen analys, ingen spårning, inga cookies för
annat än det du själv ställer in. Vägklar vet inte att du finns.
