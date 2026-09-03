# -*- coding: utf-8 -*-
"""Catalogue every visual in the licensed theory book.

    python scripts/audit-book-visuals.py            # full catalogue
    python scripts/audit-book-visuals.py --signs    # only the sign appendix

Writes review/book-visuals.json (gitignored), a machine-readable inventory of
what the book actually contains, page by page.

Why render rather than pull out embedded images: the earlier extraction pass
worked on embedded rasters, which found the photographs and missed everything
drawn as vector page content. The road signs are vectors. So is most of the
pedagogical artwork. Rendering each page and looking at the pixels finds both
kinds, at the cost of having to work out where one figure ends and the next
begins.

Nothing here ships. The renders and the catalogue live in review/ and
references/, both gitignored; only deliberately cropped and optimised assets
ever reach the app.
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from dataclasses import dataclass, asdict
from pathlib import Path

import numpy as np
import pypdfium2 as pdfium
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
PDF = ROOT / 'references' / 'teoribok-2026-1.pdf'
OUT = ROOT / 'review'

# Sign codes as the book prints them, e.g. "(A25)" under the picture.
SIGN_CODE = re.compile(r'\((?P<code>[ABCDEFHJSTX]\d{1,2}(?:-\d)?)\)')

# A rendered page is examined at this scale when hunting for figures. High
# enough that a small supplementary plate is still tens of pixels across.
SCAN_SCALE = 2.0


@dataclass
class Figure:
    page: int
    kind: str
    # Fractions of the page, so a crop can be re-rendered at any resolution.
    x0: float
    y0: float
    x1: float
    y1: float
    width_px: int
    height_px: int
    saturation: float
    code: str | None = None


def page_text(page_number: int) -> str:
    """The text of one page, via pdftotext."""
    result = subprocess.run(
        ['pdftotext', '-f', str(page_number), '-l', str(page_number), '-layout', str(PDF), '-'],
        capture_output=True,
    )
    return result.stdout.decode('utf-8', 'replace')


def figure_boxes(image: Image.Image, min_area_frac: float, gap: int):
    """Where the figures are on a rendered page.

    Body text is black on white and therefore unsaturated; signs, photographs
    and diagrams carry colour. Working from saturation rather than darkness
    keeps headings and paragraphs out of the way without any layout knowledge.

    A single sign is drawn as several disconnected coloured shapes — a red
    ring, a yellow field, a black pictogram the saturation test drops entirely —
    so the mask is dilated before labelling. That reassembles one sign into one
    box without merging it with its neighbour, provided the dilation is smaller
    than the gutter between them.
    """
    arr = np.asarray(image.convert('RGB'), dtype=np.int16)
    hi = arr.max(axis=2)
    lo = arr.min(axis=2)
    mask = (hi >= 40) & ((hi - lo) >= 40)

    h, w = mask.shape
    if gap > 0:
        mask = ndimage.binary_dilation(mask, structure=np.ones((gap, gap), bool))

    labels, count = ndimage.label(mask)
    if count == 0:
        return []

    boxes = []
    min_area = max(1, int(w * h * min_area_frac))
    for y_slice, x_slice in ndimage.find_objects(labels):
        x0, x1 = x_slice.start, x_slice.stop - 1
        y0, y1 = y_slice.start, y_slice.stop - 1
        # Undo the dilation so the box hugs the artwork again.
        pad = gap // 2
        x0, y0 = max(0, x0 + pad), max(0, y0 + pad)
        x1, y1 = min(w - 1, x1 - pad), min(h - 1, y1 - pad)
        if x1 <= x0 or y1 <= y0:
            continue
        region = mask[y0:y1 + 1, x0:x1 + 1]
        area = int(region.sum())
        if area < min_area:
            continue
        boxes.append((x0, y0, x1, y1, area))
    return boxes


def classify(w: int, h: int, area: int, page_w: int, page_h: int) -> str:
    """A first guess at what a figure is, from its shape and size alone."""
    ratio = w / max(1, h)
    fill = area / max(1, w * h)
    page_share = (w * h) / (page_w * page_h)

    if page_share > 0.35:
        return 'photo'
    if 0.75 <= ratio <= 1.35 and w < page_w * 0.22:
        # Square-ish, small, densely coloured: the shape of a sign face.
        return 'road-sign' if fill > 0.35 else 'illustration'
    if ratio > 2.2:
        return 'diagram'
    if page_share > 0.12:
        return 'photo'
    return 'illustration'


def scan(pages: list[int], out_json: Path, save_renders: bool) -> list[Figure]:
    pdf = pdfium.PdfDocument(str(PDF))
    found: list[Figure] = []
    render_dir = OUT / 'book-pages'
    if save_renders:
        render_dir.mkdir(parents=True, exist_ok=True)

    for number in pages:
        page = pdf[number - 1]
        image = page.render(scale=SCAN_SCALE).to_pil()
        w, h = image.size
        if save_renders:
            image.save(render_dir / f'p{number:03d}.png')

        boxes = figure_boxes(image, min_area_frac=0.00012, gap=max(3, int(w * 0.010)))

        codes = SIGN_CODE.findall(page_text(number))
        for (x0, y0, x1, y1, area) in sorted(boxes, key=lambda b: (b[1], b[0])):
            bw, bh = x1 - x0 + 1, y1 - y0 + 1
            if bw < 24 or bh < 24:
                continue
            found.append(Figure(
                page=number,
                kind=classify(bw, bh, area, w, h),
                x0=round(x0 / w, 5), y0=round(y0 / h, 5),
                x1=round((x1 + 1) / w, 5), y1=round((y1 + 1) / h, 5),
                width_px=bw, height_px=bh,
                saturation=round(area / max(1, bw * bh), 3),
            ))
        if codes:
            # Record what codes the page prints, so a human can pair them up.
            for fig in found:
                if fig.page == number and fig.code is None:
                    fig.code = ''
            print(f'  s.{number}: {len(boxes)} figurer, koder: {" ".join(codes[:14])}')
        else:
            print(f'  s.{number}: {len(boxes)} figurer')

    out_json.parent.mkdir(parents=True, exist_ok=True)
    out_json.write_text(json.dumps([asdict(f) for f in found], ensure_ascii=False, indent=1), 'utf-8')
    return found


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--pages', help='t.ex. 324-361 eller 1-367')
    ap.add_argument('--signs', action='store_true', help='bara teckenbilagan')
    ap.add_argument('--renders', action='store_true', help='spara helsidesrenderingar i review/')
    args = ap.parse_args()

    if not PDF.exists():
        print(f'Källan saknas: {PDF}', file=sys.stderr)
        return 1

    pdf = pdfium.PdfDocument(str(PDF))
    total = len(pdf)

    if args.signs:
        pages = list(range(324, 362))
    elif args.pages:
        a, _, b = args.pages.partition('-')
        pages = list(range(int(a), int(b or a) + 1))
    else:
        pages = list(range(1, total + 1))

    print(f'Genomsöker {len(pages)} av {total} sidor …')
    figures = scan(pages, OUT / 'book-visuals.json', args.renders)

    kinds: dict[str, int] = {}
    for f in figures:
        kinds[f.kind] = kinds.get(f.kind, 0) + 1
    print(f'\n{len(figures)} figurer: ' + ', '.join(f'{k} {v}' for k, v in sorted(kinds.items())))
    print(f'review/book-visuals.json skriven (gitignorerad).')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
