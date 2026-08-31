# Att skriva och granska frågor

## Den viktigaste regeln

**Hitta aldrig på en trafikregel för att fylla banken.**

Om du inte är säker: markera innehållet som osäkert i källmetadatan i stället för att skriva något
självsäkert. Arkitektonisk fullständighet går före volym. En felaktig fråga är värre än en fråga som
inte finns — den lär ut fel sak, och eleven upptäcker det först på provet.

**Kopiera aldrig officiella provfrågor.** Vägklar tränar samma kunskapsområden och samma sorts
resonemang som kunskapsprovet, med sina egna frågor. Appen gör inga anspråk på anknytning till
Trafikverket.

## Granskningsstatus

| Status     | Betyder                                                                     |
| ---------- | --------------------------------------------------------------------------- |
| `draft`    | Skriven, inte granskad. Levereras inte till elever.                          |
| `reviewed` | Internt granskad. Formuleringen håller, sakinnehållet är inte signerat.      |
| `verified` | Kontrollerad mot angiven källa av sakkunnig. **Kräver `verifiedAt`.**        |
| `retired`  | Utgången eller ersatt. Filtreras bort ur banken men behålls för historiken.  |

Ett test misslyckas om en fråga påstår sig vara `verified` utan verifieringsdatum. Statusen kan
alltså inte höjas av misstag.

### Nuvarande läge

**Allt seedinnehåll har status `reviewed`, och alla källhänvisningar har `verifiedAt: null`.**

Det är ett medvetet, ärligt val. Frågorna är skrivna mot Trafikförordningen och etablerad
trafikkunskap, men de har inte kontrollerats mot källtexterna av en sakkunnig. Innan Vägklar
används skarpt bör innehållet gå igenom granskningsflödet nedan.

## Att lägga till en fråga

Frågor skrivs med hjälparna i
[`src/content/questions/authoring.ts`](../src/content/questions/authoring.ts):

```ts
{
  id: 'kor-017',
  category: 'korsningar',
  subcategory: 'hogerregeln',
  difficulty: 2,
  ruleTested: 'Högerregeln',
  prompt: 'Du närmar dig en korsning …',
  answers: [
    ok('Du lämnar företräde åt bilen från höger.'),
    no('Du kör först eftersom du är närmast.', 'hoger-utan-skylt'),
    no('Den som kör på den bredare gatan kör först.', 'hoger-utan-skylt'),
    no('Ingen har väjningsplikt.'),
  ],
  short: 'Saknas skyltar gäller högerregeln.',
  deep: 'Längre resonemang om varför regeln ser ut som den gör …',
  memory: 'Ingen skylt? Titta höger.',
  sources: [trf('3 kap. 18 §')],
}
```

Skriv alltid det rätta alternativet **först**. Byggaren blandar alternativen deterministiskt, så
positionen bär ingen signal.

### Checklista

- [ ] `id` följer områdesprefixet och är unikt
- [ ] `ruleTested` matchar formuleringen som används av syskonfrågor — det är så "Öva liknande" hittar dem
- [ ] Varje *lockande* felaktigt alternativ är märkt med sin `misconceptionId`
- [ ] Felaktiga alternativ är rimliga. Uppenbara skämtsvar mäter ingenting.
- [ ] `short` förklarar **varför**, inte bara vad
- [ ] `deep` finns om regeln har ett resonemang värt att förstå
- [ ] `memory` finns bara när minnesregeln faktiskt hjälper — inte som utfyllnad
- [ ] Minst en källhänvisning
- [ ] Bildberoende frågor har `accessibilityText`
- [ ] `npm test` går igenom (integritetstesterna fångar det mesta)

### Missuppfattningar

Behöver du en ny feltanke, lägg till den i
[`src/content/misconceptions.ts`](../src/content/misconceptions.ts) med `label`, `description` och
`correction`. Etiketten syns för eleven i "Mina misstag", så den ska namnge *förväxlingen*
("Utfartsregeln vs högerregeln"), inte frågan.

Återanvänd befintliga id:n där det går. Det är återkommande mönster över flera frågor som gör
misstagsanalysen värdefull.

## Granskningsflödet

1. **Skriv** med status `reviewed` och `verifiedAt: null`.
2. **Kontrollera mot källan.** Slå upp den angivna paragrafen i Trafikförordningen,
   Vägmärkesförordningen eller motsvarande. Bekräfta att formuleringen stämmer *och* att inget
   undantag saknas.
3. **Signera.** Sätt `verifiedAt` till dagens datum och `ruleVersion` till den utgåva du läste,
   och höj status till `verified`.
4. **Datera om vid regeländring.** Ändras en regel, sänk status till `reviewed`, nollställ
   `verifiedAt` och skicka frågan tillbaka genom flödet.

### Att granska om

Trafikregler ändras. `verifiedAt` och `ruleVersion` finns för att göra det möjligt att svara på
frågan "vilka frågor bygger på en regel som ändrades i år?" utan att läsa om hela banken.

En rimlig rutin är en genomgång per år, samt en riktad genomgång när en känd regeländring träder i
kraft.

## Balans i banken

Sikta på:

- alla tre svårighetsgrader i varje delområde
- minst 3–4 frågor per delområde, så repetitionen kan variera i stället för att upprepa
- flera frågor som delar `ruleTested`, så syskonurvalet har något att välja på
- flera frågor som delar `misconceptionId`, så mönstren i misstagsanalysen blir verkliga

Nuvarande fördelning finns i [README](../README.md#innehåll).
