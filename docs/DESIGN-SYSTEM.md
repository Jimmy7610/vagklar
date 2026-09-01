# Designsystem

Visuell personlighet: **lugn, precis, intelligent, nordisk.** Närmare premium fintech och
högkvalitativa läromedel än myndighetswebb eller mobilspel.

## Tokens

Allt bor i [`src/styles/tokens.css`](../src/styles/tokens.css). Komponenter använder aldrig råa
hexvärden.

### Färg

Ljus botten `#F7F8F5`, ytor vita, text `#172126`, primär teal `#176B68`. Mörkt läge är designat,
inte inverterat: botten `#0C1518`, ytor `#142126`, primär `#53B9AE` — en ljusare teal, eftersom
den mörka fungerar dåligt mot mörk bakgrund.

Sekundär- och tertiärtext är satta på uppmätt kontrast, inte på ögonmått:
`--color-text-secondary` `#657478` (4,56:1 mot botten) och `--color-text-tertiary` `#687476`
(4,53:1). I mörkt läge lyftes tertiärtexten till `#8b9b9f` (5,71:1 mot yta). Samtliga
klarar WCAG AA för brödtext.

Det upplösta temat skrivs alltid till `<html data-theme>`. Ett litet skript i `index.html` läser
`localStorage`-spegeln före första målningen, så fel palett hinner aldrig blinka till.

### Färgsemantik

| Färg      | Betyder                                                     |
| --------- | ----------------------------------------------------------- |
| **Teal**  | Navigation, primära åtgärder, varumärke, fokus              |
| **Grön**  | Rätt, behärskat, slutfört                                    |
| **Gul**   | Uppmärksamhet, osäker kunskap, dags att repetera              |
| **Röd**   | Fel, fara, destruktiva åtgärder                              |
| **Blå**   | Enbart informativa tillstånd                                 |

Två regler som aldrig bryts:

1. **Färg är aldrig ensam bärare av status.** Varje statusmarkering har också ord eller ikon —
   `Pill` tar alltid text, rätt/fel visas med både ikon och ord.
2. **Vägmärken behåller sina äkta färger** i båda temana. De är *innehåll*, inte gränssnitt, och
   att känna igen den riktiga färgen är en del av det som lärs ut. Därför ligger de i
   `ui/illustrations/`, skilda från ikonuppsättningen — och det omgivande gränssnittet lånar
   aldrig deras färger.

### Behärskningsramp

En ramp, använd av varje behärskningsvisual (ring, kort, karta, staplar):

| Värde   | Färg |
| ------- | ---- |
| ingen data | neutral grå |
| < 50 %  | röd  |
| 50–69 % | gul  |
| 70–84 % | mjuk grön |
| ≥ 85 %  | grön |

### Typografi

Systemfontstack, medvetet valt. En webbfont hade kostat ett nätverksberoende, en extra
förfrågan och risk för FOUT — för en app som ska fungera offline är det en dålig affär. Stacken är
optimerad för svensk text (å, ä, ö) och renderar likvärdigt på alla målplattformar.

Skalan är flytande med `clamp()`, från `--text-display` ner till `--text-overline`. Siffror
(provberedskap, poäng, procent) sätts med `font-variant-numeric: tabular-nums` så de inte hoppar
när de ändras.

### Rum och form

Steg: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96. Sektionsrytmen på landningssidan är flytande
(`clamp(56px, 8vw, 120px)`).

Kortradier ligger på 16–18px beroende på hierarki. Skuggor används sparsamt — djup kommer i första
hand från ytfärg och luft, inte från skuggor. Allt är inte ett kort.

### Rörelse

`--ease-out: cubic-bezier(0.22, 1, 0.36, 1)` för det mesta, 90–560 ms.

Rörelse används för svarsval, rätt/fel-avslöjande, kort, modaler och milstolpar. Inga studsar,
ingen konfetti, inga kasinoeffekter.

`prefers-reduced-motion` respekteras, och det finns dessutom en inställning i appen. Reducerad
rörelse gör övergångar omedelbara — den tar aldrig bort information.

## Komponenter

`ui/components/` innehåller primitiverna: `Button`, `Card`, `ProgressRing`, `Meter`, `Pill`,
`Stat`, `SegmentedControl`, `Switch`, `Callout`, `EmptyState`, `Skeleton`, `Modal`, `Toaster`.

Några som bär mer vikt än de ser ut att göra:

- **`ProgressRing`** — ritar `—` när värdet är `null`. En omätt beredskap visas aldrig som noll.
- **`Modal`** — samma komponent är bottenark på telefon och centrerad dialog från 600px. Fokus
  fångas medan den är öppen, återlämnas vid stängning, sidan bakom låses från att scrolla.
- **`Pill`** — kräver alltid text, så status aldrig blir enbart färg.

## Ikoner

En familj, ett rutnät (24×24), en linjetjocklek — ritade inline i
[`src/ui/icons/Icon.tsx`](../src/ui/icons/Icon.tsx). Ingen ikonuppsättning som beroende: hela
setet kostar ett par kilobyte och kan aldrig glida isär stilmässigt. Inga emoji som gränssnitts­ikoner.

## Responsivitet

Layouterna är komponerade om, inte staplade. De två navigationsmönstren är genuint olika: en
tumvänlig bottenrad på telefon, en beständig sidopanel från 1024px där den vertikala ytan ändå är
ledig.

En fallgrop värd att känna till: ett rutnät med implicit kolumn får sin bredd av innehållets
min-content, så ett långt `white-space: nowrap`-element kan tvinga hela sidan bredare än skärmen.
Ensparts­rutnät sätter därför `grid-template-columns: minmax(0, 1fr)`. Det var en verklig bugg på
320–430px innan den fixades; se [QA.md](QA.md).

Säkerhetszoner (`env(safe-area-inset-*)`) respekteras i bottennavigationen, i fokuslägenas fotrader
och i modalerna.

### Kvadratiskt innehåll behöver takhöjd

En kvadratisk yta som bara begränsas av bredd blir högre än fönstret så snart kolumnen
är bred. Scenariolabbets scen begränsas därför av *både* bredd och fönsterhöjd:

```css
.stageBox { max-width: min(100%, 560px); aspect-ratio: 1 / 1; }
@media (min-width: 1024px) { .stageBox { max-width: min(100%, 54vh, 620px); } }
@media (max-height: 520px)  { .stageBox { max-width: min(100%, 68vh); } }
```

Regeln är generell: när en yta har fast proportion ska den mätas mot vyporten, inte
bara mot sin spalt. Se [SCENARIO-LAB.md](SCENARIO-LAB.md) och [QA.md](QA.md).
