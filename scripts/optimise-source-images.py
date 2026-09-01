# -*- coding: utf-8 -*-
"""
Optimise the curated source images for the app.

    python scripts/optimise-source-images.py

Reads the curation list below, takes the matching extracted originals from
references/extracted/ (never committed), and writes optimised WebP files into
src/assets/source-images/teoribok-2026-1/<topic>/.

Only images listed here reach the app. The extraction step is deliberately
separate: extraction is broad and disposable, curation is narrow and committed.

Two widths are produced so the UI can serve a responsive srcset:

    <name>-640.webp    phones
    <name>-960.webp    tablet and desktop

Quality is 78 at a maximum width of 960. That was chosen by inspection, not by
guesswork: at these settings the gantry text, the 80 sign and the lane letters
in korfaltsval-motorvag are all still legible, while the file drops from 194 kB
to 74 kB. Traffic photographs carry small but decisive detail — sign faces,
lane markings, indicator lamps — so spot-check any new image at 100 % before
lowering this further.

The rights holder's own watermark is present in the source photographs and is
NOT removed: it is part of the attribution.
"""

import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:  # pragma: no cover
    sys.exit('Pillow saknas. Kör: pip install Pillow')

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'references' / 'extracted' / 'teoribok-2026-1'
DEST = ROOT / 'src' / 'assets' / 'source-images' / 'teoribok-2026-1'

WIDTHS = (640, 960)
QUALITY = 78

# (extracted file, topic folder, output slug)
CURATED = [
    # --- Körfält -----------------------------------------------------------
    ('p016-0.jpeg', 'korfalt', 'korfaltsval-motorvag'),
    ('p014-0.jpeg', 'korfalt', 'placering-landsvag'),
    ('p015-0.jpeg', 'korfalt', 'enkelriktat-svang'),
    # --- Väjningsregler ----------------------------------------------------
    ('p022-0.jpeg', 'vajningsregler', 'korsning-tva-fordon'),
    ('p024-0.jpeg', 'vajningsregler', 'stopplikt-buss'),
    ('p031-0.jpeg', 'vajningsregler', 'oskyltad-korsning'),
    ('p034-1.jpeg', 'vajningsregler', 'lastbil-korsar'),
    ('p021-0.jpeg', 'vajningsregler', 'stop-flervagsstopp'),
    ('p045-0.jpeg', 'vajningsregler', 'overgangsstalle-vajningsplikt'),
    # --- Passager ----------------------------------------------------------
    ('p047-0.jpeg', 'passager', 'obevakat-overgangsstalle'),
    ('p051-0.jpeg', 'passager', 'cykelpassage-landsvag'),
    ('p052-0.jpeg', 'passager', 'overgangsstalle-cykelpassage'),
    ('p054-1.jpeg', 'passager', 'cykelbana-korsning'),
    ('p055-0.jpeg', 'passager', 'cykeloverfart'),
    ('p049-0.jpeg', 'passager', 'gangbana-utfart'),
    # --- Cirkulationsplats -------------------------------------------------
    ('p065-0.jpeg', 'cirkulationsplats', 'cirkulation-med-trafik'),
    ('p063-1.jpeg', 'cirkulationsplats', 'rund-korsning-utan-skylt'),
    # --- Parkering ---------------------------------------------------------
    ('p067-0.jpeg', 'parkering', 'p-skylt-avgift-boende'),
    ('p075-0.jpeg', 'parkering', 'p-skylt-tidsbegransning'),
    ('p070-0.jpeg', 'parkering', 'forbud-att-stanna'),
    # --- Omkörning ---------------------------------------------------------
    ('p100-0.jpeg', 'omkorning', 'traktor-vintervag'),
    ('p101-0.jpeg', 'omkorning', 'motande-landsvag'),
    # --- Järnvägskorsningar ------------------------------------------------
    ('p107-0.jpeg', 'jarnvag', 'plankorsning-bommar'),
    ('p108-0.jpeg', 'jarnvag', 'plankorsning-ljussignal'),
    # --- Speciella gator ---------------------------------------------------
    ('p119-0.jpeg', 'speciella-gator', 'gangfartsomrade'),
    # --- Vinter ------------------------------------------------------------
    ('p124-0.jpeg', 'vinter', 'vintervag-hjulspar'),
]


def main() -> int:
    if not SRC.exists():
        sys.exit(
            f'{SRC.relative_to(ROOT)} saknas. Kör först:\n'
            '  python scripts/extract-source-images.py --extract'
        )

    total_before = total_after = 0
    written = 0
    missing = []

    for filename, topic, slug in CURATED:
        origin = SRC / filename
        if not origin.exists():
            missing.append(filename)
            continue

        folder = DEST / topic
        folder.mkdir(parents=True, exist_ok=True)

        with Image.open(origin) as im:
            im = im.convert('RGB')
            total_before += origin.stat().st_size
            for width in WIDTHS:
                if im.width <= width and width != WIDTHS[-1]:
                    # Never upscale; the largest width still gets written so
                    # every image has a full-size variant to point at.
                    continue
                scale = min(width / im.width, 1.0)
                size = (round(im.width * scale), round(im.height * scale))
                out = folder / f'{slug}-{width}.webp'
                im.resize(size, Image.LANCZOS).save(
                    out, 'WEBP', quality=QUALITY, method=6
                )
                total_after += out.stat().st_size
                written += 1

    if missing:
        print('Saknade original: ' + ', '.join(missing), file=sys.stderr)

    print(
        f'{written} filer skrivna till {DEST.relative_to(ROOT)}\n'
        f'{len(CURATED) - len(missing)} bilder, '
        f'{total_before // 1024} kB original -> {total_after // 1024} kB webp'
    )
    return 1 if missing else 0


if __name__ == '__main__':
    raise SystemExit(main())
