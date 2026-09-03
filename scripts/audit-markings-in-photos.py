# -*- coding: utf-8 -*-
"""Leta vägmarkeringar i källans fotografier.

Motstycket till scripts/audit-signs-in-photos.py, fast för färgen i körbanan i
stället för märkena bredvid den. Delområdet vägmarkeringar hade länge noll
fotografier: varje linje lärdes ut som ren vektor, i idealform och rakt uppifrån.
På vägen är samma linje sliten, sedd i perspektiv och inbäddad i en korsning.

Signalen som används är den enda som en vägmarkering pålitligt har: den är
*ljus och omättad på mörk asfalt*, den ligger i bildens nedre del, och den är
utdragen. Alltså — tröskla fram vita och gula ytor, kasta allt som ligger i den
övre delen av bilden (himmel, husfasader, vita bilar), och poängsätt det som
blir kvar efter hur mycket av körbanan det täcker.

Skriptet väljer ingenting. Det rangordnar, klipper ut den nedre halvan och
skriver en kontaktkarta som en människa tittar på. Att titta är hela poängen:
en vit skåpbil i solljus ser för den här sortens tröskel exakt ut som ett
övergångsställe.

    python scripts/audit-markings-in-photos.py [--limit N] [--used]

Skriver till review/markings-in-photos/ som är gitignorerad.
"""
from __future__ import annotations

import argparse
import csv
import json
import re
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
CANDIDATES = ROOT / 'references' / 'extracted' / 'teoribok-2026-1'
OUT = ROOT / 'review' / 'markings-in-photos'
OPTIMISER = ROOT / 'scripts' / 'optimise-source-images.py'

# Bara den nedre delen av bilden kan innehålla körbana. Fotona är tagna från
# förarplatsen, så horisonten ligger nära mitten; 45 % nedifrån är generöst.
ROAD_BAND = 0.55
# Målad linje mot asfalt: ljus, men inte kulör. Bilar och skyltar är kulörta,
# himmel är blå, och asfalt är mörk.
MIN_VALUE = 150
MAX_SATURATION = 70
# En markering är avlång. Ett område som är lika brett som högt och kompakt är
# oftast en bil, en husvägg eller en ljus grusfläck.
MIN_AREA_PX = 400
MIN_ELONGATION = 2.2
# Boken trycker samma foto både stort och som liten inforuta. Miniatyrerna är
# 362x204 och kan aldrig bli en 960-bred bild i appen, så de tar inte upp
# granskningsplatser — de fanns i första körningen och åt upp halva arken.
MIN_SOURCE_WIDTH = 700


def road_paint_score(im: Image.Image) -> tuple[float, int]:
    """Andel av körbanebandet som är målad yta, och antal avlånga områden."""
    w, h = im.size
    band = im.crop((0, int(h * (1 - ROAD_BAND)), w, h)).convert('HSV')
    hsv = np.asarray(band, dtype=np.int16)
    sat, val = hsv[:, :, 1], hsv[:, :, 2]

    painted = (val >= MIN_VALUE) & (sat <= MAX_SATURATION)
    # Asfalten runtomkring måste vara mörkare, annars är det snö eller himmel.
    if painted.mean() > 0.45:
        return 0.0, 0

    labelled, count = ndimage.label(painted)
    if count == 0:
        return 0.0, 0

    elongated = 0
    area = 0
    for sl in ndimage.find_objects(labelled):
        bh = sl[0].stop - sl[0].start
        bw = sl[1].stop - sl[1].start
        size = int((labelled[sl] > 0).sum())
        if size < MIN_AREA_PX:
            continue
        long_side, short_side = max(bh, bw), max(1, min(bh, bw))
        if long_side / short_side < MIN_ELONGATION:
            continue
        elongated += 1
        area += size

    return area / painted.size, elongated


def used_slugs() -> set[str]:
    text = OPTIMISER.read_text(encoding='utf-8')
    return {m.group(1) for m in re.finditer(r"\('(p\d+-\d+)\.jpe?g'", text)}


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('--limit', type=int, default=40, help='hur många kandidater som klipps ut')
    ap.add_argument('--used', action='store_true', help='ta även med redan kurerade foton')
    args = ap.parse_args()

    already = used_slugs()
    rows = []
    for path in sorted(CANDIDATES.glob('p*.jpeg')):
        stem = path.stem
        if not args.used and stem in already:
            continue
        with Image.open(path) as im:
            if im.width < MIN_SOURCE_WIDTH:
                continue
            im = im.convert('RGB')
            score, lines = road_paint_score(im)
            size = im.size
        if lines == 0:
            continue
        rows.append({'file': path.name, 'score': round(score, 5), 'lines': lines, 'size': size})

    rows.sort(key=lambda r: (-r['score'], r['file']))
    picked = rows[: args.limit]

    OUT.mkdir(parents=True, exist_ok=True)
    for old in OUT.glob('*'):
        old.unlink()

    # Åtta per ark, nedre halvan förstorad — samma format som fungerade för
    # märkessvepet. Större ark blir oläsliga när de skalas ner i visningen.
    per_sheet, tile = 8, (420, 236)
    for index in range(0, len(picked), per_sheet):
        chunk = picked[index : index + per_sheet]
        sheet = Image.new('RGB', (tile[0] * 2, tile[1] * ((len(chunk) + 1) // 2)), 'white')
        for n, row in enumerate(chunk):
            with Image.open(CANDIDATES / row['file']) as im:
                im = im.convert('RGB')
                w, h = im.size
                crop = im.crop((0, int(h * (1 - ROAD_BAND)), w, h)).resize(tile, Image.LANCZOS)
            sheet.paste(crop, ((n % 2) * tile[0], (n // 2) * tile[1]))
        sheet.save(OUT / f'm{index // per_sheet}.jpg', quality=88)

    (OUT / 'index.json').write_text(
        json.dumps({'reviewed': len(rows), 'sheets': picked}, ensure_ascii=False, indent=2),
        encoding='utf-8',
    )
    with (OUT / 'index.csv').open('w', encoding='utf-8', newline='') as fh:
        writer = csv.DictWriter(fh, fieldnames=['sheet', 'slot', 'file', 'score', 'lines'])
        writer.writeheader()
        for n, row in enumerate(picked):
            writer.writerow(
                {
                    'sheet': f'm{n // per_sheet}',
                    'slot': n % per_sheet,
                    'file': row['file'],
                    'score': row['score'],
                    'lines': row['lines'],
                }
            )

    print(f'{len(rows)} foton med målad yta i körbanan, {len(picked)} utklippta till {OUT}')


if __name__ == '__main__':
    main()
