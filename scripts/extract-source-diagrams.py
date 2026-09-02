# -*- coding: utf-8 -*-
"""
Render and crop technical diagrams from the licensed theory source.

    python scripts/extract-source-diagrams.py --pages 196-201 204-212
    python scripts/extract-source-diagrams.py --crop

Why this exists alongside extract-source-images.py:

The photograph extractor pulls embedded raster objects out of the PDF. That
works for photographs, which the book stores as JPEGs — and finds nothing at
all for its technical drawings, which are *vector content drawn onto the page*.
Whole chapters that matter most for vehicle theory have no embedded image on a
single page: stopping distances, vehicle dimensions, safety checks. A brake
diagram is not a file inside the document; it is lines and text laid out by the
typesetter.

So diagrams have to be rendered rather than extracted, and then cropped, which
makes the two pipelines genuinely different jobs rather than one job with a
flag.

Two modes:

  (default)  render whole pages into review/diagram-pages/ so a human can see
             what is on them and decide what is worth cropping.

  --crop     produce the curated crops listed in CROPS below, into
             references/extracted/diagrams/, ready for the optimiser.

Nothing here is committed. The rendered pages are working material and the
crops are inputs to scripts/optimise-source-images.py, exactly like the
extracted photographs. Only the optimised, approved WebP files ship.

Crop rectangles are fractions of the page (0-1), not pixels, so they survive a
change of render scale. Each one is written down with the page it comes from
and what it is meant to show, because a crop with no stated purpose is how a
page header ends up in a lesson.
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

try:
    import pypdfium2 as pdfium
except ImportError:  # pragma: no cover
    sys.exit('pypdfium2 saknas. Kör: pip install pypdfium2')

try:
    from PIL import Image
except ImportError:  # pragma: no cover
    sys.exit('Pillow saknas. Kör: pip install Pillow')

ROOT = Path(__file__).resolve().parent.parent
PDF = ROOT / 'references' / 'teoribok-2026-1.pdf'
PAGE_DIR = ROOT / 'review' / 'diagram-pages'
CROP_DIR = ROOT / 'references' / 'extracted' / 'diagrams'

# Render scale for review pages. 2.0 gives ~1190x1685, enough to read the
# labels on a technical drawing without producing files nobody can open.
REVIEW_SCALE = 2.0

# Crops are rendered larger: the optimiser resizes down to 640/960, and
# starting from more pixels keeps small label text legible after that.
CROP_SCALE = 4.0

# (output name, printed page, (left, top, right, bottom) as page fractions, what it shows)
#
# Boxes were found by scanning each rendered page for coloured or solid-dark
# regions — the book sets its body text in black on white and draws its figures
# in colour, so saturation separates the two cleanly — and then checked by eye.
# Fractions rather than pixels so a change of CROP_SCALE does not move them.
CROPS: list[tuple[str, int, tuple[float, float, float, float], str]] = [
    # --- Krocksäkerhet ---------------------------------------------------
    ('deformationszoner', 232, (0.50, 0.205, 0.915, 0.455),
     'Bil uppifrån med deformationszoner 1 och särskilt sårbara sidor 2'),
    # --- Längd & bredd ---------------------------------------------------
    ('lastbredd-tillaten', 244, (0.115, 0.292, 0.885, 0.715),
     'Exempel 1: last 260 cm, 20 cm ut på varje sida — tillåtet'),
    ('lastbredd-otillaten', 245, (0.115, 0.115, 0.885, 0.575),
     'Exempel 2: last 260 cm men 40 cm ut på en sida — ej tillåtet'),
    ('lastlangd-utmarkning', 247, (0.088, 0.538, 0.912, 0.742),
     'Bil i profil med last 3 m fram och 4 m bak, totalt 13 m, med markeringsflaggor'),
    ('bogsering-utmarkning', 248, (0.087, 0.172, 0.832, 0.328),
     'Två bilar med bogserlina och avståndet 4 m utmärkt'),
    # --- Last -------------------------------------------------------------
    # Split for the same reason as the meeting sequence: the book prints a
    # heading and an italic caption around each figure, and a single crop would
    # ship all of that as pixels. Two figures, and the lesson does the talking.
    ('kultryck-hogt', 256, (0.090, 0.278, 0.909, 0.458),
     'Släp med lasten längst fram; pil nedåt vid kopplingen'),
    ('kultryck-lagt', 256, (0.090, 0.616, 0.909, 0.802),
     'Släp med lasten längst bak; pil uppåt vid kopplingen'),
    # --- Belysning --------------------------------------------------------
    # The three meeting stages are cropped one by one rather than as one tall
    # figure. The book prints a numbered sentence under each panel; taken as a
    # single crop those sentences ship as pixels — unselectable, untranslatable
    # and invisible to a screen reader. The panels are the diagram; the steps
    # belong in the lesson as real text.
    ('avblandning-mote-1', 266, (0.093, 0.167, 0.587, 0.296),
     'Steg 1: båda bilarna kör med helljus, långt från varandra'),
    ('avblandning-mote-2', 266, (0.093, 0.368, 0.587, 0.497),
     'Steg 2: ljuskäglorna möts och båda har slagit om till halvljus'),
    ('avblandning-mote-3', 266, (0.093, 0.570, 0.587, 0.699),
     'Steg 3: bilarna är i jämnhöjd och helljuset är tillbaka'),
    ('helljus-i-kurva', 268, (0.089, 0.246, 0.589, 0.406),
     'Kurva där bil A måste blända av tidigare än bil B'),
]


def render_page(pdf: pdfium.PdfDocument, page_number: int, scale: float) -> Image.Image:
    """Render one printed page. Page numbers are 1-based, as printed in the book."""
    page = pdf[page_number - 1]
    return page.render(scale=scale).to_pil()


def parse_ranges(values: list[str]) -> list[int]:
    pages: list[int] = []
    for value in values:
        first, _, last = value.partition('-')
        pages.extend(range(int(first), int(last or first) + 1))
    return sorted(set(pages))


def do_render(pages: list[int]) -> int:
    pdf = pdfium.PdfDocument(str(PDF))
    PAGE_DIR.mkdir(parents=True, exist_ok=True)
    for number in pages:
        if not 1 <= number <= len(pdf):
            print(f'  hoppar över s. {number}: utanför boken', file=sys.stderr)
            continue
        image = render_page(pdf, number, REVIEW_SCALE)
        out = PAGE_DIR / f'p{number:03d}.png'
        image.save(out)
    print(f'{len(pages)} sidor renderade till {PAGE_DIR.relative_to(ROOT)}')
    print('Titta på dem, bestäm beskärningar, och lägg dem i CROPS.')
    return 0


def do_crop() -> int:
    if not CROPS:
        print('CROPS är tom — inget att beskära än.', file=sys.stderr)
        return 1
    pdf = pdfium.PdfDocument(str(PDF))
    CROP_DIR.mkdir(parents=True, exist_ok=True)
    written = 0
    for name, page_number, box, purpose in CROPS:
        page = render_page(pdf, page_number, CROP_SCALE)
        width, height = page.size
        left, top, right, bottom = box
        crop = page.crop(
            (round(left * width), round(top * height), round(right * width), round(bottom * height))
        )
        out = CROP_DIR / f'{name}.png'
        crop.save(out)
        written += 1
        print(f'  {name:34s} s.{page_number:<4} {crop.size[0]}x{crop.size[1]}  {purpose}')
    print(f'{written} beskärningar skrivna till {CROP_DIR.relative_to(ROOT)}')
    return 0


def main() -> int:
    if not PDF.exists():
        print(f'Källdokumentet saknas: {PDF}', file=sys.stderr)
        return 1

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--pages', nargs='+', default=[], help='sidor eller intervall, t.ex. 204-212')
    parser.add_argument('--crop', action='store_true', help='producera de kurerade beskärningarna')
    args = parser.parse_args()

    if args.crop:
        return do_crop()
    if not args.pages:
        parser.print_help()
        return 1
    return do_render(parse_ranges(args.pages))


if __name__ == '__main__':
    raise SystemExit(main())
