# -*- coding: utf-8 -*-
"""Turn the extracted sign crops into the files the app ships.

    python scripts/optimise-book-signs.py

Reads references/extracted/signs/ (gitignored) and writes WebP into
src/assets/road-signs/, plus a manifest the registry and the tests read.

Only the signs Vägklar actually teaches are optimised. The book's appendix holds
257 sign faces; the registry describes 58, and shipping the rest would be bytes
nobody looks at.

Ten of those 58 keep their hand-drawn vector on purpose. Three official codes
cover several signs each — C31 is every speed limit, D1 is every mandatory
direction, T6 is every time plate — and the book draws each code once. Using the
book's C31 for `hastighet-90` would show a learner a 30.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'references' / 'extracted' / 'signs'
OUT = ROOT / 'src' / 'assets' / 'road-signs'
MANIFEST = ROOT / 'src' / 'content' / 'road-sign-assets.json'

# One file per sign, at the source's own resolution up to this cap.
#
# Two decisions worth writing down, both measured rather than assumed.
#
# *One width, not a responsive set.* A sign is shown at 110-132 px inline and
# full width when expanded, and the crops are around 450 px across. Downscaling
# to 320 px turned out to produce a *larger* file than leaving them alone: flat
# vector art has a handful of exact colours, and resampling invents hundreds of
# intermediate ones that then have to be encoded. 48 signs cost 212 kB at
# native resolution and 227 kB at 320 px.
#
# *Palettised lossless WebP.* A road sign is six flat colours. Lossy encoding
# puts ringing around the black pictograms, which is exactly the detail a
# learner is being asked to read. Quantising to 32 colours and encoding
# losslessly is both smaller and sharper than quality-92 lossy: 212 kB against
# 864 kB.
MAX_WIDTH = 640
PALETTE_COLOURS = 32


def registry_entries() -> list[tuple[str, str, bool]]:
    """Every sign in the registry as (id, code, is_variant).

    Parsed block by block rather than with one regex over the whole file. An
    earlier version matched `id` followed immediately by `code`, which quietly
    skipped every entry that had gained a `variant` or `plate` field in between
    — seventeen of them — and still reported success.
    """
    source = (ROOT / 'src' / 'content' / 'road-signs.ts').read_text('utf-8')
    entries = []
    for block in source.split('\n  sign({')[1:]:
        block = block.split('\n  }),')[0]
        sign_id = re.search(r"id: '([a-z0-9-]+)'", block)
        code = re.search(r"code: '([^']+)'", block)
        if not sign_id or not code:
            continue
        entries.append((sign_id.group(1), code.group(1), 'variant:' in block))
    return entries


def main() -> int:
    crops = {e['code']: e for e in json.loads((SRC / 'manifest.json').read_text('utf-8'))}
    entries = registry_entries()

    OUT.mkdir(parents=True, exist_ok=True)
    for stale in OUT.glob('*.webp'):
        stale.unlink()

    manifest = []
    skipped = []
    total_before = total_after = 0

    for sign_id, code, is_variant in entries:
        if is_variant:
            # The registry marks these explicitly: several entries share one
            # official code and the book prints one picture per code. Its C31
            # shows 30, so using it for hastighet-90 would show a wrong number.
            skipped.append((sign_id, code, 'variant av en kod som boken ritar en gång'))
            continue
        crop = crops.get(code)
        if crop is None:
            skipped.append((sign_id, code, 'ingen bild hittad i källan'))
            continue

        origin = SRC / crop['file']
        total_before += origin.stat().st_size
        image = Image.open(origin).convert('RGB')

        # Never upscale: a 51 px plate blown up to 640 is not detail.
        target = min(MAX_WIDTH, image.width)
        if target != image.width:
            image = image.resize((target, round(image.height * target / image.width)), Image.LANCZOS)
        flat = image.quantize(colors=PALETTE_COLOURS, method=Image.MEDIANCUT, dither=Image.NONE)
        # The 'sign-' prefix survives Vite flattening every asset into
        # /assets/, and is what lets the service worker precache the signs
        # while leaving the photographs to the runtime cache.
        path = OUT / f'sign-{sign_id}.webp'
        flat.convert('RGB').save(path, 'WEBP', lossless=True, method=6)
        total_after += path.stat().st_size

        manifest.append({
            'id': sign_id,
            'code': code,
            'page': crop['page'],
            'crop': crop['crop'],
            'width': image.width,
            'height': image.height,
        })

    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=1) + '\n', 'utf-8')

    print(f'{len(manifest)} märken optimerade till {OUT.relative_to(ROOT)}')
    print(f'  {total_before // 1024} kB png -> {total_after // 1024} kB webp')
    print(f'{len(skipped)} behåller sin vektor:')
    for sign_id, code, why in skipped:
        print(f'  {code:5s} {sign_id:24s} {why}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
