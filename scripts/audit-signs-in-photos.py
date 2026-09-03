# -*- coding: utf-8 -*-
"""Find the road signs that are actually visible in the book's photographs.

    python scripts/audit-signs-in-photos.py            # every candidate
    python scripts/audit-signs-in-photos.py --used     # only approved photos

Writes review/signs-in-photos/ (gitignored): one enlarged crop per candidate
sign region, plus an index. Nothing here ships.

Why this exists. Pairing a sign with a photograph of that sign in the road is
one of the better things Vägklar can do with the licensed material, but it is
only worth anything if the sign in the photograph really is the sign claimed.
The temptation is to read the chapter heading and assume — and an earlier pass
in this repo did exactly that once, labelling an overtaking photograph as a
meeting. So identity has to come from looking at the picture.

264 photographs is too many to squint at whole. Instead the sign faces are found
the way they were found in the sign appendix: Swedish signs are saturated red,
yellow and blue against a world that mostly is not, and a sign face is compact
and roughly as wide as it is tall. Each candidate region is cropped and enlarged
so a person can identify it, or reject it as a car tail light.

The output is a proposal. Nothing is registered from it automatically.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
CANDIDATES = ROOT / 'references' / 'extracted' / 'teoribok-2026-1'
OUT = ROOT / 'review' / 'signs-in-photos'

# A sign face in a windscreen photograph is small. Anything under this fraction
# of the frame is a reflector or a tail light; anything over it is sky or a car.
MIN_AREA = 0.00035
MAX_AREA = 0.09

# Signs are compact. A long thin red streak is a bus, a kerb or a brake light.
MIN_FILL = 0.42
MIN_RATIO, MAX_RATIO = 0.55, 1.85


def sign_like_regions(image: Image.Image) -> list[tuple[int, int, int, int, str]]:
    """Compact, saturated patches that could be a sign face.

    Three colour tests rather than one: Swedish signs are red-bordered, yellow
    or blue, and each needs its own thresholds. Running them separately also
    means the reported colour is a hint for whoever looks at the crop.
    """
    arr = np.asarray(image.convert('RGB'), dtype=np.int16)
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    hi = arr.max(axis=2)
    lo = arr.min(axis=2)
    sat = hi - lo

    masks = {
        'röd': (sat > 55) & (r > 105) & (r > g + 45) & (r > b + 35),
        'gul': (sat > 60) & (r > 135) & (g > 110) & (b < g - 35),
        'blå': (sat > 45) & (b > 85) & (b > r + 30) & (b > g + 12),
    }

    h, w = hi.shape
    frame = h * w
    found: list[tuple[int, int, int, int, str]] = []

    for colour, mask in masks.items():
        grown = ndimage.binary_closing(mask, structure=np.ones((5, 5), bool))
        labels, count = ndimage.label(grown)
        if count == 0:
            continue
        for y_slice, x_slice in ndimage.find_objects(labels):
            x0, x1 = x_slice.start, x_slice.stop
            y0, y1 = y_slice.start, y_slice.stop
            bw, bh = x1 - x0, y1 - y0
            if bw < 12 or bh < 12:
                continue
            box_area = bw * bh
            if not (frame * MIN_AREA <= box_area <= frame * MAX_AREA):
                continue
            ratio = bw / bh
            if not (MIN_RATIO <= ratio <= MAX_RATIO):
                continue
            filled = int(grown[y0:y1, x0:x1].sum()) / box_area
            if filled < MIN_FILL:
                continue
            found.append((x0, y0, x1, y1, colour))

    # Two colour tests firing on one sign — a red-bordered yellow triangle —
    # should produce one candidate, not two.
    found.sort(key=lambda f: (f[2] != 'röd', -(f[2] - f[0]) if False else 0))
    merged: list[tuple[int, int, int, int, str]] = []
    for box in found:
        x0, y0, x1, y1, colour = box
        overlap = None
        for i, (mx0, my0, mx1, my1, mcol) in enumerate(merged):
            if x0 < mx1 and mx0 < x1 and y0 < my1 and my0 < y1:
                overlap = i
                break
        if overlap is None:
            merged.append(box)
        else:
            mx0, my0, mx1, my1, mcol = merged[overlap]
            merged[overlap] = (
                min(mx0, x0), min(my0, y0), max(mx1, x1), max(my1, y1),
                mcol if mcol == colour else f'{mcol}+{colour}',
            )
    return merged


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--used', action='store_true', help='bara redan godkända foton')
    ap.add_argument('--limit', type=int, default=0)
    args = ap.parse_args()

    if not CANDIDATES.exists():
        print(f'Kandidatmappen saknas: {CANDIDATES}')
        return 1

    used: set[str] | None = None
    if args.used:
        optimiser = (ROOT / 'scripts' / 'optimise-source-images.py').read_text('utf-8')
        used = set(re.findall(r"\('(p\d+-\d+\.\w+)'", optimiser))

    OUT.mkdir(parents=True, exist_ok=True)
    for stale in OUT.glob('*.jpg'):
        stale.unlink()

    files = sorted([*CANDIDATES.glob('p*.jpeg'), *CANDIDATES.glob('p*.png')])
    if used is not None:
        files = [f for f in files if f.name in used]
    if args.limit:
        files = files[: args.limit]

    index: list[dict] = []
    with_signs = 0
    for path in files:
        image = Image.open(path).convert('RGB')
        if image.width < 500:
            continue
        regions = sign_like_regions(image)
        if not regions:
            index.append({'file': path.name, 'regions': 0})
            continue
        with_signs += 1
        page = int(re.match(r'p(\d+)', path.name).group(1))
        for n, (x0, y0, x1, y1, colour) in enumerate(regions):
            pad = int(max(x1 - x0, y1 - y0) * 0.35) + 6
            crop = image.crop((
                max(0, x0 - pad), max(0, y0 - pad),
                min(image.width, x1 + pad), min(image.height, y1 + pad),
            ))
            # Enlarge so the pictogram is readable; nearest-neighbour would be
            # sharper but lanczos is kinder to a small, slightly blurred sign.
            scale = min(6.0, max(1.0, 260 / max(crop.width, crop.height)))
            crop = crop.resize((int(crop.width * scale), int(crop.height * scale)), Image.LANCZOS)
            name = f'{path.stem}-{n}.jpg'
            crop.save(OUT / name, quality=92)
            index.append({
                'file': path.name, 'page': page, 'crop': name, 'colour': colour,
                'box': [x0, y0, x1, y1], 'regions': len(regions),
            })

    (OUT / 'index.json').write_text(json.dumps(index, ensure_ascii=False, indent=1), 'utf-8')
    crops = len([i for i in index if 'crop' in i])
    print(f'{len(files)} foton genomsökta')
    print(f'  {with_signs} med minst en märkesliknande yta')
    print(f'  {crops} utsnitt skrivna till {OUT.relative_to(ROOT)} (gitignorerad)')
    print('Titta på dem. Inget registreras härifrån automatiskt.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
