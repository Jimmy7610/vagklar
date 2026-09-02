# -*- coding: utf-8 -*-
"""
Contact sheet for reviewing extracted image candidates.

    python scripts/extract-source-images.py --extract     # once, fills references/extracted/
    python scripts/review-source-images.py                # then look at them
    python scripts/review-source-images.py 148-173 262-271 # or just some pages

Writes review/source-image-candidates.html — a local, gitignored page showing
every extracted candidate at a size where you can actually judge it, next to
its page number, its dimensions, whether it is already curated, and the words
that appear on that page of the book.

This is the missing middle step of the pipeline. Extraction is broad and
disposable; curation is narrow and committed. Between them somebody has to
*look*, and picking images from a filename list is how a chapter-divider photo
ends up illustrating a rule it has nothing to do with.

Thumbnails are embedded as data URIs so the sheet is a single self-contained
file that never links back to the originals. It only works on a machine that
holds the licensed source, and neither the sheet nor the originals are ever
committed.

Pass page ranges to narrow the sheet. The whole set is 263 candidates and about
6 MB of embedded previews, which some viewers refuse to open; a range or two
keeps it small enough to actually work with.

Filters at the top narrow by chapter, by whether the candidate is already in
use, and by shape — the book uses wide 1325×745 photographs for teaching and
square ~1220×1220 images as chapter dividers, and the divider images are
decorative openers rather than anything a lesson should lean on.
"""

from __future__ import annotations

import base64
import csv
import io as _io
import json
import re
import sys
from html import escape
from pathlib import Path

try:
    from PIL import Image
except ImportError:  # pragma: no cover
    sys.exit('Pillow saknas. Kör: pip install Pillow')

ROOT = Path(__file__).resolve().parent.parent
EXTRACTED = ROOT / 'references' / 'extracted' / 'teoribok-2026-1'
INVENTORY = EXTRACTED / 'inventory.csv'
PAGE_TEXT = ROOT / 'references' / '.page-text.json'
OUT = ROOT / 'review' / 'source-image-candidates.html'

# Chapter ranges, mirroring src/content/curriculum/curriculum.ts. Kept here so
# the sheet can group by chapter without importing TypeScript.
CHAPTERS = [
    ('Inledning', 6, 13), ('Körfält', 14, 21), ('Väjningsregler', 22, 45),
    ('Passager', 46, 57), ('Cirkulationsplats', 58, 67), ('Stanna & parkera', 68, 77),
    ('Landsväg', 78, 89), ('Motorväg & motortrafikled', 90, 97), ('Omkörningar', 98, 107),
    ('Järnvägskorsningar', 108, 115), ('Speciella gator', 116, 123), ('Vinter', 124, 131),
    ('Inlärning & mognad', 132, 139), ('Alkohol', 140, 147), ('Trötthet', 148, 153),
    ('Synen', 154, 161), ('Nedsatt förmåga', 162, 167), ('Barn', 168, 173),
    ('Trafikolyckor', 174, 187), ('Indelning av fordon', 188, 195), ('Sträckor', 196, 203),
    ('Däck', 204, 213), ('Styrning', 214, 223), ('Bromsar', 224, 231),
    ('Krocksäkerhet', 232, 237), ('Bilbarnstolar', 238, 243), ('Längd & bredd', 244, 251),
    ('Last', 252, 261), ('Belysning', 262, 271), ('Säkerhetskontroller', 272, 277),
    ('Besiktning', 278, 283), ('Service', 284, 289), ('Registreringsbevis', 290, 297),
    ('Försäkring', 298, 303), ('Miljö', 304, 311), ('Drivmedel', 312, 317),
    ('Sparsam körning', 312, 323), ('Vägmärken', 324, 351), ('Rättsfall', 352, 367),
]


def chapter_of(page: int) -> str:
    for title, start, end in CHAPTERS:
        if start <= page <= end:
            return title
    return 'Utanför kapitelindelningen'


def shape_of(width: int, height: int) -> str:
    ratio = width / height if height else 0
    if 0.95 <= ratio <= 1.05 and width > 1100:
        return 'divider'      # square chapter opener
    if ratio >= 1.6:
        return 'photo'        # wide teaching photograph
    return 'diagram'          # figure, chart or cut-out


THUMB_WIDTH = 460


def thumbnail(path: Path) -> str:
    """A small embedded preview. Big enough to judge, small enough to inline."""
    with Image.open(path) as im:
        im = im.convert('RGB')
        if im.width > THUMB_WIDTH:
            im = im.resize(
                (THUMB_WIDTH, max(1, round(im.height * THUMB_WIDTH / im.width))),
                Image.LANCZOS,
            )
        buffer = _io.BytesIO()
        im.save(buffer, 'JPEG', quality=62, optimize=True)
    return 'data:image/jpeg;base64,' + base64.b64encode(buffer.getvalue()).decode('ascii')


def curated_slugs() -> dict[str, str]:
    """Which extracted files the optimise script already ships, and as what."""
    text = (ROOT / 'scripts' / 'optimise-source-images.py').read_text(encoding='utf-8')
    found = {}
    for m in re.finditer(r"\('([^']+\.(?:jpeg|jpg|png))',\s*'([^']+)',\s*'([^']+)'\)", text):
        found[m.group(1)] = f'{m.group(2)}/{m.group(3)}'
    return found


def main() -> int:
    if not INVENTORY.exists():
        print(f'Saknar {INVENTORY.relative_to(ROOT)}.', file=sys.stderr)
        print('Kör: python scripts/extract-source-images.py --extract', file=sys.stderr)
        return 1

    rows = list(csv.DictReader(INVENTORY.open(encoding='utf-8')))

    ranges: list[tuple[int, int]] = []
    for arg in sys.argv[1:]:
        first, _, last = arg.partition('-')
        ranges.append((int(first), int(last or first)))
    if ranges:
        rows = [r for r in rows if any(a <= int(r['page']) <= b for a, b in ranges)]
        if not rows:
            print('Inga kandidater i det sidintervallet.', file=sys.stderr)
            return 1
    pages: dict[str, list[str]] = {}
    if PAGE_TEXT.exists():
        pages = json.loads(PAGE_TEXT.read_text(encoding='utf-8'))['pages']
    curated = curated_slugs()

    cards = []
    for row in rows:
        page = int(row['page'])
        width, height = int(row['width']), int(row['height'])
        shape = shape_of(width, height)
        slug = curated.get(row['file'])
        words = ' '.join(pages.get(str(page), [])[:26])
        try:
            rel = thumbnail(EXTRACTED / row['file'])
        except Exception as error:  # a candidate the decoder cannot open
            print(f'  hoppar över {row["file"]}: {error}', file=sys.stderr)
            continue
        cards.append(
            f'<figure class="card" data-chapter="{escape(chapter_of(page))}" '
            f'data-shape="{shape}" data-used="{"yes" if slug else "no"}">'
            f'<img loading="lazy" src="{escape(rel)}" alt="Kandidat s. {page}">'
            f'<figcaption>'
            f'<div class="meta"><b>s. {page}</b> · {width}×{height} · '
            f'<span class="tag {shape}">{shape}</span>'
            + (f' · <span class="tag used">{escape(slug)}</span>' if slug else '')
            + f'</div><div class="file">{escape(row["file"])}</div>'
            f'<div class="ch">{escape(chapter_of(page))}</div>'
            f'<p class="words">{escape(words)}</p>'
            f'</figcaption></figure>'
        )

    chapters = sorted({chapter_of(int(r['page'])) for r in rows})
    options = ''.join(f'<option>{escape(c)}</option>' for c in chapters)

    html = f"""<!doctype html>
<html lang="sv"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Vägklar — bildkandidater</title>
<style>
 :root {{ color-scheme: light dark; --bg:#fbfbfa; --fg:#16181d; --muted:#5d6470;
         --line:#e2e4e8; --card:#fff; }}
 @media (prefers-color-scheme: dark) {{ :root {{ --bg:#0f1114; --fg:#e8eaed;
         --muted:#9aa2af; --line:#262a31; --card:#171a1f; }} }}
 * {{ box-sizing:border-box; }}
 body {{ margin:0; background:var(--bg); color:var(--fg);
         font:14px/1.5 -apple-system,"Segoe UI",Roboto,system-ui,sans-serif; }}
 header {{ position:sticky; top:0; z-index:2; background:var(--bg);
           border-bottom:1px solid var(--line); padding:12px 20px;
           display:flex; gap:12px; align-items:center; flex-wrap:wrap; }}
 h1 {{ font-size:14px; margin:0; font-weight:650; }}
 select, input {{ font:inherit; padding:5px 9px; border:1px solid var(--line);
                  border-radius:7px; background:var(--card); color:var(--fg); }}
 main {{ max-width:1500px; margin:0 auto; padding:20px; }}
 .grid {{ display:grid; gap:16px; grid-template-columns:repeat(auto-fill,minmax(340px,1fr)); }}
 .card {{ margin:0; background:var(--card); border:1px solid var(--line);
          border-radius:12px; padding:12px; }}
 .card img {{ width:100%; height:auto; border-radius:8px; background:#e9ebee;
              display:block; }}
 figcaption {{ padding-top:9px; }}
 .meta {{ font-size:12.5px; color:var(--muted); }}
 .file {{ font:12px ui-monospace,SFMono-Regular,Menlo,monospace; color:var(--muted); }}
 .ch {{ font-weight:600; margin:3px 0; }}
 .words {{ font-size:12px; color:var(--muted); margin:5px 0 0;
           max-height:3.6em; overflow:hidden; }}
 .tag {{ border:1px solid var(--line); border-radius:999px; padding:1px 7px; }}
 .tag.photo {{ color:#0f7b52; border-color:currentColor; }}
 .tag.divider {{ color:#b3261e; border-color:currentColor; }}
 .tag.used {{ color:#4a5262; }}
 .count {{ color:var(--muted); }}
</style></head><body>
<header>
 <h1>Bildkandidater</h1>
 <select id="ch"><option value="">Alla kapitel</option>{options}</select>
 <select id="shape"><option value="">Alla former</option>
  <option value="photo">photo — bred lärobild</option>
  <option value="diagram">diagram — figur eller urklipp</option>
  <option value="divider">divider — kapitelöppnare</option></select>
 <select id="used"><option value="">Alla</option>
  <option value="no">Inte kurerade</option><option value="yes">Redan kurerade</option></select>
 <span class="count" id="count"></span>
</header>
<main><div class="grid" id="grid">{''.join(cards)}</div></main>
<script>
 const cards=[...document.querySelectorAll('.card')];
 const f=()=>{{ const c=ch.value,s=shape.value,u=used.value; let n=0;
  for(const el of cards){{ const ok=(!c||el.dataset.chapter===c)&&(!s||el.dataset.shape===s)&&(!u||el.dataset.used===u);
   el.style.display=ok?'':'none'; if(ok)n++; }}
  count.textContent=n+' av '+cards.length; }};
 for(const id of ['ch','shape','used']) document.getElementById(id).onchange=f;
 f();
</script></body></html>
"""
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(html, encoding='utf-8')
    size = OUT.stat().st_size / 1024 / 1024
    scope = ', '.join(f'{a}-{b}' for a, b in ranges) if ranges else 'hela boken'
    print(f'{OUT.relative_to(ROOT)} skriven — {len(cards)} kandidater ({scope}), '
          f'{size:.1f} MB.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
