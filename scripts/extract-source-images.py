# -*- coding: utf-8 -*-
"""
Extract candidate images from the licensed theory source into a NON-PUBLIC
working area.

    python scripts/extract-source-images.py --inventory
    python scripts/extract-source-images.py --extract

Nothing this script writes is part of the app. Output goes to
references/extracted/, which .gitignore excludes, exactly like the PDF itself.
Only images that are later curated, optimised and registered reach
src/assets/source-images/ — see docs/SOURCE-IMAGES.md.

The toolchain is deliberately minimal: pypdf (already a transitive dev
dependency of nothing, installed locally) plus Pillow. No poppler binaries
beyond pdftotext are available on this machine, and installing a heavier
pipeline was not justified for a one-off curation pass.
"""

import argparse
import csv
import io
import os
import sys
from pathlib import Path

try:
    from pypdf import PdfReader
except ImportError:  # pragma: no cover
    sys.exit('pypdf saknas. Kör: pip install pypdf')

try:
    from PIL import Image
except ImportError:  # pragma: no cover
    sys.exit('Pillow saknas. Kör: pip install Pillow')

ROOT = Path(__file__).resolve().parent.parent
PDF = ROOT / 'references' / 'teoribok-2026-1.pdf'
OUT = ROOT / 'references' / 'extracted' / 'teoribok-2026-1'

# Below this an image is a logo, an icon or a rendering artefact, not a figure.
MIN_PIXELS = 120 * 120
MIN_BYTES = 8_000


def iter_images(reader):
    for index, page in enumerate(reader.pages):
        printed = index + 1
        try:
            images = page.images
        except Exception as exc:  # a damaged XObject should not stop the run
            print(f'  ! sida {printed}: {exc}', file=sys.stderr)
            continue
        for order, image in enumerate(images):
            yield printed, order, image


def measure(data):
    try:
        with Image.open(io.BytesIO(data)) as im:
            return im.width, im.height, (im.format or '').lower()
    except Exception:
        return 0, 0, ''


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--inventory', action='store_true', help='Lista utan att skriva filer')
    parser.add_argument('--extract', action='store_true', help='Skriv ut bilderna')
    parser.add_argument('--min-pixels', type=int, default=MIN_PIXELS)
    args = parser.parse_args()

    if not args.inventory and not args.extract:
        parser.error('Ange --inventory eller --extract')

    if not PDF.exists():
        sys.exit(f'Källdokumentet saknas: {PDF}')

    reader = PdfReader(str(PDF))
    rows = []
    kept = skipped = 0

    if args.extract:
        OUT.mkdir(parents=True, exist_ok=True)

    for printed, order, image in iter_images(reader):
        data = image.data
        width, height, fmt = measure(data)
        if width * height < args.min_pixels or len(data) < MIN_BYTES:
            skipped += 1
            continue
        kept += 1
        name = f'p{printed:03d}-{order}.{fmt or "bin"}'
        rows.append(
            {
                'file': name,
                'page': printed,
                'order': order,
                'width': width,
                'height': height,
                'format': fmt,
                'bytes': len(data),
            }
        )
        if args.extract:
            (OUT / name).write_bytes(data)

    if args.extract:
        with (OUT / 'inventory.csv').open('w', newline='', encoding='utf-8') as fh:
            writer = csv.DictWriter(fh, fieldnames=list(rows[0].keys()) if rows else ['file'])
            writer.writeheader()
            writer.writerows(rows)
        print(f'Skrev {kept} bilder till {OUT.relative_to(ROOT)}')
    else:
        for row in rows:
            print(
                f"s.{row['page']:>3}  {row['width']:>4}x{row['height']:<4} "
                f"{row['format']:<5} {row['bytes'] // 1024:>5} kB  {row['file']}"
            )

    print(f'\n{kept} kandidater, {skipped} för små/ointressanta.', file=sys.stderr)


if __name__ == '__main__':
    main()
