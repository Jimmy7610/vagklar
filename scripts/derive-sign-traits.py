# -*- coding: utf-8 -*-
"""Read each sign's colours off its own artwork.

    python scripts/derive-sign-traits.py            # proposal to stdout
    python scripts/derive-sign-traits.py --write    # patch road-signs.ts

`visualTraits` exists so a test can check a written description against the
picture instead of against another description. That only works if the traits
themselves come from the picture — deriving them from the alt text would make
the test tautological, and it was wrong alt text that started all this.

So the background is sampled from the middle of the sign and the border from a
thin frame just inside its edge, and both are classified into the handful of
colours Swedish signs actually use.

Signs that keep a hand-drawn vector have no artwork to read, so they are listed
as needing a human decision rather than guessed at.
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
ASSETS = ROOT / 'src' / 'assets' / 'road-signs'
REGISTRY = ROOT / 'src' / 'content' / 'road-signs.ts'
MANIFEST = ROOT / 'src' / 'content' / 'road-sign-assets.json'


def classify(pixels: np.ndarray) -> str | None:
    """The dominant Swedish sign colour in a patch, or None if it is mixed."""
    if pixels.size == 0:
        return None
    r = pixels[:, 0].astype(np.int16)
    g = pixels[:, 1].astype(np.int16)
    b = pixels[:, 2].astype(np.int16)
    hi = pixels.max(axis=1).astype(np.int16)
    lo = pixels.min(axis=1).astype(np.int16)
    sat = hi - lo

    tests = {
        'red': (sat > 60) & (r > 120) & (r > g + 55) & (r > b + 45),
        'yellow': (sat > 60) & (r > 150) & (g > 120) & (b < g - 45),
        'blue': (sat > 45) & (b > 80) & (b > r + 35) & (b > g + 15),
        'green': (sat > 35) & (g > 70) & (g > r + 25) & (g > b + 10),
        'white': (sat <= 40) & (hi > 200),
        'black': (hi < 80),
    }
    counts = {name: int(mask.sum()) for name, mask in tests.items()}
    total = len(pixels)
    best, n = max(counts.items(), key=lambda kv: kv[1])
    return best if n / total >= 0.45 else None


def _colour_shares(pixels: np.ndarray) -> dict[str, float]:
    if len(pixels) == 0:
        return {}
    r = pixels[:, 0].astype(np.int16)
    g = pixels[:, 1].astype(np.int16)
    b = pixels[:, 2].astype(np.int16)
    hi = pixels.max(axis=1).astype(np.int16)
    lo = pixels.min(axis=1).astype(np.int16)
    sat = hi - lo
    n = len(pixels)
    return {
        'red': float(((sat > 60) & (r > 120) & (r > g + 55) & (r > b + 45)).sum()) / n,
        'yellow': float(((sat > 60) & (r > 150) & (g > 120) & (b < g - 45)).sum()) / n,
        'blue': float(((sat > 45) & (b > 80) & (b > r + 35) & (b > g + 15)).sum()) / n,
        'green': float(((sat > 35) & (g > 70) & (g > r + 25) & (g > b + 10)).sum()) / n,
        'white': float(((sat <= 40) & (hi > 200)).sum()) / n,
        'black': float((hi < 80).sum()) / n,
    }


def traits_for(path: Path) -> dict[str, str]:
    """Background and border, read off the sign's own shape.

    Two simpler ideas were tried and both were wrong, in ways worth recording
    because they look reasonable until you check them.

    Sampling the middle and the rim fails because a triangle's centre lands on
    the black pictogram and the corners of its crop are white page, not the red
    border — the first run concluded that every warning sign is black with a
    white border.

    Ranking colours by area fails because on an A-series triangle the red border
    covers more of the crop than the yellow field does. That run concluded the
    warning signs are red.

    So the shape has to be respected. The page is flood-filled away from the
    edges, leaving the sign; the sign is then eroded, and whatever colour fills
    the core is the field. The border is what lies in the band between the two.
    """
    image = Image.open(path).convert('RGB')
    arr = np.asarray(image)
    h, w = arr.shape[:2]

    hi = arr.max(axis=2).astype(np.int16)
    lo = arr.min(axis=2).astype(np.int16)
    page_like = (hi - lo <= 40) & (hi > 200)

    # The page is the near-white region connected to the edge of the crop. White
    # *inside* the sign — the field of a STOP or the arrow on a blue plate — is
    # not connected to the edge and therefore survives.
    labels, count = ndimage.label(page_like)
    edge_labels = set(labels[0, :]) | set(labels[-1, :]) | set(labels[:, 0]) | set(labels[:, -1])
    edge_labels.discard(0)
    page = np.isin(labels, list(edge_labels)) if edge_labels else np.zeros_like(page_like)
    sign = ~page
    if sign.sum() < h * w * 0.05:
        sign = np.ones_like(page_like)

    # Erode by a fraction of the sign's size so the core is clear of the border.
    radius = max(2, int(min(h, w) * 0.17))
    core = ndimage.binary_erosion(sign, structure=np.ones((radius, radius), bool))
    if core.sum() < 40:
        core = sign

    core_share = _colour_shares(arr[core])
    field = {k: v for k, v in core_share.items() if k not in ('black',)}
    background = max(field, key=lambda k: field[k]) if field else 'white'
    if field.get(background, 0) < 0.15:
        background = 'white'

    out: dict[str, str] = {'background': background}

    band = sign & ~core
    band_share = _colour_shares(arr[band])
    for name in ('red', 'blue', 'black'):
        if name == background:
            continue
        if band_share.get(name, 0) >= 0.25:
            out['border'] = name
            break
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--write', action='store_true')
    args = ap.parse_args()

    source = REGISTRY.read_text('utf-8')
    licensed = {e['id'] for e in json.loads(MANIFEST.read_text('utf-8'))}

    entries = re.findall(r"    id: '([a-z0-9-]+)',\n(.*?)\n  \}\),", source, re.S)
    proposals: dict[str, dict[str, str]] = {}
    unreadable: list[str] = []
    already = 0

    for sign_id, body in entries:
        if 'visualTraits:' in body:
            already += 1
            continue
        path = ASSETS / f'sign-{sign_id}.webp'
        if sign_id not in licensed or not path.exists():
            unreadable.append(sign_id)
            continue
        traits = traits_for(path)
        if 'background' in traits:
            proposals[sign_id] = traits
        else:
            unreadable.append(sign_id)

    print(f'{already} märken har redan visualTraits')
    print(f'{len(proposals)} kan läsas ur bilden')
    print(f'{len(unreadable)} kan inte läsas automatiskt: {", ".join(unreadable[:12])}')

    if not args.write:
        for sign_id, traits in list(proposals.items())[:15]:
            print(f'  {sign_id}: {traits}')
        print('\nKör med --write för att skriva in dem.')
        return 0

    patched = 0
    for sign_id, traits in proposals.items():
        anchor = f"    id: '{sign_id}',\n"
        idx = source.index(anchor) + len(anchor)
        fields = ', '.join(f"{k}: '{v}'" for k, v in traits.items())
        source = source[:idx] + f"    visualTraits: {{ {fields} }},\n" + source[idx:]
        patched += 1

    REGISTRY.write_text(source, 'utf-8', newline='\n')
    print(f'{patched} märken fick visualTraits ur sin egen bild')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
