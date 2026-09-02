# Innehållsladdning

Frågebanken är det tyngsta Vägklar har: 423 frågor med svar, förklaringar och
källhänvisningar väger cirka 470 kB som JSON. Det här dokumentet beskriver hur den
kommer in i appen — och varför den inte gör det direkt.

## Problemet

Landningssidan behöver inte en enda fråga. Den visar en rubrik, ett scenario och
statistik. Ändå låg hela banken i startpaketet, därför att `learnerStore` — som körs
innan något ritas — importerade `@/domain/content/bank` synkront för att kunna slå
upp frågor när ett pass körs.

Kostnaden var mätbar: **246 kB gzip kritisk JS** innan sidan kunde ritas, varav
drygt 110 kB var frågetexter som ingen ännu bett om.

## Lösningen: index och bank

Banken delades i två halvor efter vad som faktiskt behövs när:

| | Innehåll | Storlek | När |
| --- | --- | --- | --- |
| **Indexet** | id, kategori, delområde, svårighet, status, regel | ~39 kB | Direkt |
| **Banken** | frågetext, svar, förklaringar, källor, bilder | ~470 kB | Vid första passet |

[`src/content/question-index.ts`](../src/content/question-index.ts) är **genererad**
— kör `npm run generate:index` efter varje ändring i banken. Ett test jämför den fält
för fält mot banken, så en inaktuell fil får sviten att fallera i stället för att
tyst avvika.

Indexet räcker för allt skalet gör innan läraren börjat träna:

- **hydrering** — `sanitize.ts` avgör om ett sparat svar pekar på en fråga som finns
- **behärskning och provberedskap** — `mastery.ts` och `readiness.ts` behöver veta
  vilka delområden som finns och hur de väger, inte vad frågorna säger
- **landningssidan** — `BANK_TOTALS` ger antal och svårighetsfördelning

Den härledningen ligger samlad i
[`src/domain/content/indexView.ts`](../src/domain/content/indexView.ts), så det finns
en enda plats där "vilka ämnen finns" besvaras.

## Den dynamiska gränsen

Banken laddas på **ett** ställe:

```ts
async function loadContentModules(): Promise<void> {
  if (bank && exam) return;
  const [bankModule, examModule] = await Promise.all([
    import('@/domain/content/bank'),
    import('@/domain/exam/exam'),
  ]);
  …
}
```

`LearnerStore.init()` inväntar det innan lagringen läses. Eftersom `HydrationGate`
håller alla appens rutter tills `status === 'ready'` hinner ingen skärm efterfråga en
fråga innan banken finns. Resten av appen ser inget async — `questionBank()` returnerar
modulen synkront och kastar med ett begripligt felmeddelande om någon skulle kalla den
för tidigt.

Det är avsiktligt att gränsen ligger just där. Att göra `getQuestion` async i hela
appen hade spridit `await` genom varje sida för att lösa ett problem som bara finns
under de första hundra millisekunderna.

## Chunkarna

Att flytta en import räcker inte. Rollup lyfter moduler som delas av flera lata
rutter till närmaste gemensamma förälder — vilket är startchunken. Åtta rutter
importerar banken statiskt, så den hamnade i startpaketet igen trots den dynamiska
importen.

`vite.config.ts` löser det genom att namnge chunkarna:

| Chunk | Innehåll | Laddas |
| --- | --- | --- |
| `index` | appskal, store, lagring, landningssida | direkt |
| `content` | index, taxonomi, källor, märken, markeringar, mastery, repetition | direkt |
| `questions` | frågetexter, `bank.ts`, `selection.ts`, `insights.ts` | vid första passet |
| `router`, `vendor` | react-router, React | direkt |

Två detaljer är lätta att missa och båda är kommenterade i konfigurationen:

- **`bank.ts`, `selection.ts` och `insights.ts` pinnas till `questions`.** Utan det
  lyfts de till startchunken, som då statiskt importerar frågetexterna.
- **`indexView.ts`, `mastery.ts`, `repetition.ts` och `mistakeCount.ts` pinnas till
  `content`.** De läser bara indexet, men eftersom de ligger nära banken i grafen
  vek Rollup in dem i `questions` — och då importerade skalet den chunken ändå.

Två saker till flyttades ut ur startpaketet av samma skäl:

- **Hemsidan laddas lazy.** Den läser banken via `useContent`, så länge den var
  ivrigt importerad drog den in allt. Den ligger bakom `HydrationGate` ändå.
- **Landningsscenariot bor i egen modul.** Sidan ritade `SCENARIOS[0]`, och eftersom
  en modul inte kan delas mellan två chunkar tog det med sig alla scenarier (~48 kB
  källa) för att visa en bild. `LANDING_SCENARIO` ligger nu i
  [`landing-scenario.ts`](../src/content/landing-scenario.ts) och listas först i
  `SCENARIOS`, så demon är en riktig övning och inte en kopia som kan glida isär.

## Offline påverkas inte

Workbox precachar **alla** JS-chunkar, inte bara de som laddas direkt. `questions`
hämtas alltså vid installationen tillsammans med resten och finns i cachen innan
läraren öppnar sitt första pass. Skillnaden är när webbläsaren måste vänta på den för
att kunna rita — inte om den finns.

Det går att kontrollera i webbläsaren:

```js
const c = await caches.open('workbox-precache-v2-' + location.origin + '/vagklar/');
(await c.keys()).map((r) => r.url).filter((u) => u.includes('questions-'));
```

## Resultat

| | Före | Efter |
| --- | --- | --- |
| Kritisk JS (gzip) | 246 151 B | 161 944 B |
| Frågetexter vid start | ja | nej |
| Budget i bygget | nej | 185 000 B |

**−84 kB gzip, −34 %** — samtidigt som banken växte från 343 till 423 frågor och ett
helt vägmarkeringssystem tillkom.

## Budgeten

Ett test som beskriver strukturen räcker inte: grafen kan vara korrekt medan
paketet ändå växer ur sitt sammanhang. Därför mäter `scripts/verify-build.mjs`
startpaketet efter varje bygge och avbryter över **185 000 B gzip**, med
nuvarande läge på cirka 162 000 B. Den avbryter också om `questions-*.js` skulle
dyka upp bland de ivrigt laddade chunkarna.

Grindarna är kontrollerade genom att sänka taket och se bygget falla. En grind
som aldrig sett ett fel är en förhoppning, inte ett skydd.

## Skyddet

[`src/app/state/contentLoading.test.ts`](../src/app/state/contentLoading.test.ts)
går igenom den verkliga importgrafen från `main.tsx` och följer bara statiska
importer. Den fallerar om `bank.ts`, `selection.ts`, `insights.ts`, `exam.ts`,
`useContent.ts` eller någon frågemodul blir nåbar utan en dynamisk import — och även
om indexet, `indexView` eller `mastery` skulle *sluta* vara nåbara, så att garantin
inte kan bli sann av misstag.

Det är ett strukturtest, inte ett storlekstest: det säger vad som får ligga var, inte
hur många byte det blev. Siffrorna i tabellen ovan mäts om för hand vid behov:

```bash
npm run build && for f in $(grep -o 'assets/[a-zA-Z0-9_.-]*\.js' dist/index.html | sort -u); do gzip -c "dist/$f" | wc -c; done
```

## När du lägger till frågor

1. Skriv frågorna i `src/content/questions/`
2. `npm run generate:index`
3. `npm test` — indexet jämförs mot banken, och grafen kontrolleras

Inget mer. Chunkindelningen är regelbaserad på sökväg, så en ny frågefil hamnar rätt
av sig själv.
