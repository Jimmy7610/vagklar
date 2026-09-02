# Betaberedskap

Version **1.1.0-beta.1** · granskad 2026-09-02 · commit på `main`

Kryssen nedan betyder *kontrollerat i den här omgången med bevis som går att
återskapa*, inte *ser rimligt ut*. Där något inte kontrollerats står rutan tom
och skälet anges. Listan är avsiktligt obekväm att läsa: den är till för att
hitta det som saknas, inte för att se färdig ut.

---

## Innehåll

- [x] **179 av 179 begrepp i kursplanen täckta**, 0 luckor
      (`npm run report:coverage` → [CONTENT-COVERAGE.md](CONTENT-COVERAGE.md))
- [x] **431 frågor**, 0 fel, 0 varningar, 0 dubblettkandidater
      (`npm run report:content` → [CONTENT-VALIDATION.md](CONTENT-VALIDATION.md))
- [x] Svårighetsbalans 20 % lätt / 56 % medel / 25 % svår — inom målet 20–30 % lätt
- [x] Varje fråga har minst en källhänvisning; 0 frågor utan källa
- [x] 554 av 612 hänvisningar länkade till källregistret; resten är
      beskrivande kunskapskällor utan registerpost, vilket `general()` är till för
- [x] En validatorregel (`source-not-linked`) hindrar att en registrerad källa
      citeras utan att länkas
- [x] **286 sidhänvisningar granskade mot den faktiska sidtexten**, 0 fel,
      45 varningar, 2 dokumenterade undantag
      (`npm run audit:pages` → [SOURCE-PAGE-AUDIT.md](SOURCE-PAGE-AUDIT.md))
- [x] 27 felaktiga sidhänvisningar hittade och rättade i den här omgången
- [x] Höga risktal kontrollerade mot källan: promillegränser, mönsterdjup,
      bashastigheter, släpvikter, fordonsslagens hastigheter, bogsering, moped
- [ ] **Ingen fråga är expertverifierad.** Alla 431 har status `reviewed`.
      Kön finns i [VERIFICATION-QUEUE.md](VERIFICATION-QUEUE.md). Se
      [VERIFICATION-WORKFLOW.md](VERIFICATION-WORKFLOW.md).

## Källbilder

- [x] **63 godkända källbilder** — 52 fotografier och 11 ritningar ur källan —
      plus **15 egna ritningar**, och samtliga används av en lektion eller fråga
      (`npm run report:images` → [IMAGE-COVERAGE.md](IMAGE-COVERAGE.md))
- [x] 25 av 39 kapitel har bildstöd; rapporten redovisar foto, bokritning och
      egen ritning i skilda kolumner, så det syns vilket slag ett kapitel fått
- [x] Egna ritningar ligger i ett eget register och kan inte förväxlas med
      licensierat material: samma id i båda registren, eller en egen ritning
      tillskriven källans rättighetshavare, är ett valideringsfel
- [x] Varje egen ritning bär alt-text, långbeskrivning och avskriven bildtext,
      och används av en lektion eller fråga — inga oanvända
- [x] Frågor använder bara ritningar utan facit i bilden; lektionsversionen av
      samma figur är spärrad från frågor av ett test
- [x] Alla fyra bildsorterna renderas av **en** komponent, som varje frågeyta
      går genom. Ett test underkänner en yta som börjar rita på egen hand
- [x] De egna ritningarna fungerar offline direkt, utan tidigare visning —
      kontrollerat med servern avstängd
- [x] Ritningarna bär mått som text i `labelText`, upprepade i långbeskrivningen
      — kontrollerat av test, så en måttfråga är lösbar utan att se figuren
- [x] Registrets `width`/`height` stämmer med filerna, läst ur WebP-huvudet.
      Sju poster gjorde det inte och ritades därför mindre än sin egen ruta
- [x] Ritningar krediteras `Illustration:`, foton `Foto:`
- [x] Varje godkänd bilds sidhänvisning finns i källan och ligger i rätt
      kapitel (`npm run audit:pages`, 0 fel)
- [x] Varje bild bär alt-text, långbeskrivning, bildtext, källa, sida,
      rättighetshavare och tillståndsmarkering — validerat
- [x] Varje godkänd bild finns i båda responsiva bredderna — validerat
- [x] Ingen fil ligger i bygget utan att någon post gör anspråk på den
- [x] Inget fotografi är registrerat två gånger — regel `duplicate-image-asset`
      efter att tre var det, varav ett par var oense om vad bilden visar
- [x] **Provet visar nu frågornas bilder.** Det gjorde det inte: varje
      fotografiburen fråga var obesvarbar i provsimuleringen. Skyddat av ett test
      som kräver att varje frågevy renderar foto, markering och märke
- [x] Bilder beskärs aldrig — ramen följer bildens egna proportioner
- [x] Bildtexten visas aldrig i frågeläget, och kan inte smyga in via frågetexten
- [x] Förstoring via `<dialog>` med `showModal()`: äkta modal, fokusfälla,
      fokus återlämnas, kreditering följer med
- [x] Fotografierna precachas inte; `verify-build` avbryter om de gör det
- [x] Egen runtime-cache `vagklar-source-images`, så en lektionsbild inte kan
      vräkas ut av en ikon
- [x] En bild som aldrig cachats faller tillbaka till sin skrivna beskrivning —
      kontrollerat med servern avstängd
- [x] Elva bredder × tio bildbärande lektioner utan överflöd, uppskalning eller
      trasiga filer, i båda teman
- [ ] **14 av 39 kapitel saknar fortfarande bildstöd.** Flera behöver inget —
      ett kapitel om registreringsbevis blir inte tydligare av ett foto. Däck
      och Trafikolyckor, som stod kvar som luckor, är nu fyllda med egna
      ritningar eftersom källan saknar användbara figurer för dem.
- [x] Inga godkända bilder ligger oanvända. Fyra som dubblerade undervisning en
      bättre bild redan skötte är satta till `retired` med skäl och borttagna
      ur bygget.

## Vägmärken och vägmarkeringar

- [x] Alla **58 märken** granskade förstorade i 220–420 px
      (`npm run report:visuals` → `review/visual-qa.html`)
- [x] Alla **58 märkeskoder kontrollerade mot källans planscher** — samtliga rätt
- [x] Alla **15 vägmarkeringar** granskade förstorade; linjetyper, riktning,
      stopp- och väjningslinjer, pilar och passager stämmer med sin text
- [x] 2 ritfel hittade och rättade: A36 ritades som ett kryss (det är A39
      Kryssmärke) och ritas nu som ett ånglok; A30 och D3 cirkulerade medurs
      och cirkulerar nu moturs, vilket är vad deras egen text säger
- [x] Märkesfärger inverteras inte med tema — fasta hexvärden, inte tokens
- [x] **Pilarnas sida i A25, B6 och B7 är löst.** Avgjord mot källans egna
      märkesplanscher (s. 326 och 328). Alla tre var speglade och A25 hade
      dessutom fel färg — märket bär två svarta pilar. Rättat, och låst av
      `opposedArrowSigns.test.ts`.
- [x] Märkets ritning och dess alt-text säger samma sak åt samma håll — testat
      för de tre tvåpilsmärkena, där alt-texten tidigare sa "en svart och en
      röd" om ett märke med två svarta pilar

## Adaptiv träning och prov

- [x] Provet genererar 70 frågor, varav 65 räknas och 5 är oräknade
- [x] Godkäntgräns 52 av 65; kontrollerat exakt på gränsen och ett steg under
- [x] 50-minutersklockan är väggtid och överlever omladdning
- [x] Ett tidsutgånget försök klampas till deadline, inte till upptäcktsögonblicket
- [x] Ingen rättningsinformation finns i ett pågående försök
- [x] Markera, bläddra fram och tillbaka, byta svar, återuppta efter omladdning
- [x] Obesvarade frågor räknas som fel, inte som överhoppade
- [x] Kategorifördelningen i resultatet summerar till poängen
- [x] **1 000 simulerade prov analyserade**: varje kategori inom ±0 frågors
      spridning, inget delområde över 7 av 70, medelsvårighet 1,8–2,4,
      100 % av banken använd, inga två identiska prov
- [x] **240 syntetiska Dagens 10-pass över sex elevprofiler** — ny, svag,
      avancerad, ett svagt område, många misstag, repetitionsskuld —
      minst 4 delområden, högst 4 per kategori, högst 3 per delområde
- [x] Ett svagt område når passet i över 40 % av fallen utan att någonsin ta över
- [x] En elev med repetitionsskuld får aldrig ett pass som bara är förfallna frågor

## Uthållighet

- [x] Export innehåller alla tolv delar av `LearnerData`, fält för fält
- [x] Export → import återställer behärskning, historik, repetitionsschema,
      avbrutet pass, avbrutet prov, avslutat prov med resultat, lektioner,
      utmärkelser, streak och provberedskapshistorik
- [x] Round trip är stabil över två varv
- [x] Skadade poster hoppas över och räknas i importsammanfattningen
- [x] Ett trasigt repetitionsschema lagas i stället för att kasta historiken
- [x] Migrationsmaskineriet testat, och ett test kräver en migration för varje
      framtida schemaversion
- [x] Återställ allt: generationsräknaren gör köade skrivningar till no-ops,
      så en `pagehide`-skrivning kan inte återuppliva raderad data
- [x] Import lyfter spärren avsiktligt — importerade poster föregår resetten

## PWA och offline

Kontrollerat mot produktionsbygget i webbläsaren, med servern **avstängd**:

- [x] Service worker registrerad på `/vagklar/sw.js` och tar kontroll
- [x] Precachen innehåller appskal, manifest, frågechunken och 24 lata ruttchunkar
- [x] Landningssidan, Hem, Träna, Provsimulering, Teoriskolan, en lektion,
      Scenariolabbet och Utveckling laddar med servern nere
- [x] **Ett helt träningspass startades och visade frågor offline** — beviset
      att den lata frågeladdningen inte kostade offline
- [x] En tidigare visad källbild renderas offline ur `vagklar-source-images`;
      en aldrig visad faller tillbaka till sin skrivna beskrivning
- [x] Okända adresser leder till närmaste rimliga sida, aldrig en stacktrace
- [ ] **Installationsupplevelsen är inte testad.** Fristående fönster, ikon i
      aktivitetsfältet och installationsdialogen kräver en vanlig
      webbläsarsession; det som gick att mäta här är service worker, precache
      och offline-beteende.

## Tillgänglighet

Automatiserad strukturgranskning över 14 vyer, i produktionsbygget:

- [x] `<main>`, en `<h1>` per vy, inga hoppade rubriknivåer — provvyn saknade
      `<main>` och har det nu
- [x] Alla interaktiva element har ett tillgängligt namn
- [x] Alla formulärfält har en etikett
- [x] Alla bilder har alt-text; alla `svg[role="img"]` har namn
- [x] Tangentbordsordning: hoppa-till-innehållet först, sedan sidan
- [x] Synlig fokusmarkering på varje fokuserbart element, inklusive
      scenariolabbets ytor i scenen (egen fokusring, inte `outline`)
- [x] 3 defekter hittade och rättade: scenariovyn saknade `<main>`,
      importfältet saknade etikett, och kortrubriker låg på `h3` under en `h1`
- [x] Kontrast: brödtext och sekundärtext ≥ 4,5:1 i båda teman
- [x] 2 kontrastdefekter rättade: `dangerGhost`-text låg på 4,18:1 och
      markeringsramen för flaggade provfrågor på 1,79:1 i ljust tema
- [x] Reflow: inget horisontellt överflöd vid 320 px och normal textstorlek
- [x] Textstorlek: inget överflöd vid 200 % text i ett 640 px-fönster
- [x] **320 px och 200 % text samtidigt: alla 15 rutter rena.** Hårdare än både
      WCAG 1.4.10 och 1.4.4 kräver var för sig. Sju rutter överflödade innan;
      orsakerna var `white-space: nowrap` på knappar och pills, flex-objekt
      utan `min-width: 0`, rutnät med implicita `auto`-spår, och saknad
      `overflow-wrap: anywhere` på listrader och callouts
- [x] Bottennavigeringens etiketter klipps inte längre med ellips utan bryts —
      "Utveckl…" är en etikett läsaren får gissa
- [x] Provets frågeöversikt fungerar vid 320 px och 200 % text: 70 mål,
      36×36 px, ingen horisontell scroll
- [x] Fokusmarkering kontrollerad med riktiga tangenttryckningar. Programmatiskt
      `focus()` utlöser inte `:focus-visible` och gav först ett falskt larm om
      17 kontroller utan markering — den mätningen var fel, inte appen
- [ ] **Ingen skärmläsargranskning är gjord.** Strukturen är förberedd och
      testad automatiskt, men ingen har kört appen med NVDA eller VoiceOver.
      Automatiska kontroller ersätter inte det.
- [ ] Ingen granskning med riktig skärmläsare. Strukturen är kontrollerad,
      upplevelsen är det inte.

## Responsivitet

Inget horisontellt överflöd på någon av de 14 vyerna vid:

- [x] 320 × 568 · 360 × 800 · 375 × 812 · 390 × 844 · 412 × 915 · 430 × 932
- [x] 640 × 512 · 768 × 1024 · 820 × 1180 · 1024 × 768
- [x] 1280 × 900 · 1366 × 768 · 1440 × 900 · 1920 × 1080
- [x] Ljust, mörkt och systemtema — alla tokens löser ut i alla tre
- [x] Bottennavigationen krymper i stället för att tvinga sidan i sidled

## Prestanda

- [x] Startpaket **162 814 B gzip** (`content` 47 kB, `index` 37 kB,
      `router` 14 kB, `vendor` 62 kB)
- [x] **Budget i bygget**: `verify-build` avbryter över 185 000 B
- [x] Budgetgrindarna är bevisat verkningsfulla — kontrollerade med sänkt tak
- [x] Frågechunken får inte ligga i startgrafen; bygget avbryter om den gör det
- [x] Importgrafstestet hindrar att frågetexterna smyger tillbaka
- [x] Frågechunken precachas fortfarande, så offline är oförändrat

## Rättigheter och källor

- [x] Råa källdokument varken i git, i bygget eller i precachen —
      `verify-build` avbryter på förekomst
- [x] Sidtextcachen för sidgranskningen är gitignorerad
- [x] Källregistret bär rättighetshavare, upplaga och behörighet;
      validatorn kräver rättighetshavare för licensierat material
- [x] Källbilder krediterade i gränssnittet med sida och rättighetshavare
- [x] Vattenstämplar i källbilder är inte bortbeskurna
- [x] Ingen äganderätt hävdas över märkes-, markerings- eller regelsystem
- [x] Trafikverket-disclaimern finns kvar

## Teknik

- [x] `npm run lint` — 0 fel, 9 varningar (samtliga `react-refresh`, rör bara HMR)
- [x] `npm run typecheck` — rent, strikt TypeScript
- [x] `npm test` — **456 tester i 24 filer**
- [x] `npm run build` — lyckas, inklusive alla bygggrindar
- [x] Basvägen `/vagklar/` kontrollerad i produktionsbygget och i bygget
- [x] Versionen kommer från en källa: `package.json`, injicerad vid bygge
- [ ] En DOM-tung provtest (`ExamRunnerPage`) föll en gång under parallell
      last och gick igenom ensam och vid omkörning. Ostabil, inte trasig —
      men den är inte utredd.

## Kvar att göra

Inget av nedanstående hindrar en beta, men allt är känt:

1. Expertverifiering av P1-kön — 131 frågor, indelade i fjorton
   granskningsomgångar med allt en granskare behöver per fråga
2. Installations-PWA i en riktig webbläsarsession
3. Skärmläsargranskning med NVDA eller VoiceOver
4. Delområdet vägmarkeringar har nu ett verkligt fotografi (väjningslinje), men
   bara ett. Fler markeringar skulle tjäna på samma vektor-plus-foto-par
5. Frågeöversiktens mål är 36×36 px vid 200 % text — över WCAG 2.2 AA:s krav på
   24 px men under de 44 px som är bekvämt

## Omdöme

**BETAKLAR MED KÄNDA BEGRÄNSNINGAR.**

Tekniken bär: uthålligheten är testad mot skadade och avbrutna tillstånd,
provet är kontrollerat från start till resultat, den adaptiva motorn är
belastad med sex elevprofiler, offline är verifierat med servern avstängd, och
bygget har grindar som gör de här egenskaperna svåra att tappa igen.

Innehållet är komplett mot kursplanen och internt konsekvent, men det är
granskat och inte expertverifierat — och det står tydligt både här, i
gränssnittet och i kön. Det är rätt läge för en beta, och fel läge för att
kalla produkten färdig.

Sedan förra omdömet har tre saker som stod som kända brister blivit gjorda: det
instabila provtestet har en fastställd orsak och är deterministiskt, pilarnas
sida i A25/B6/B7 är avgjord mot källan och rättad, och 320 px vid 200 % text är
rent på samtliga rutter. Kön är dessutom inte längre en lista över id utan ett
arbetsmaterial: fjorton omgångar, med frågetext, facit, källhänvisning och
signeringsfält per fråga.

Kvar står det som bara en människa kan göra: expertgranskningen och en riktig
skärmläsarsession.
