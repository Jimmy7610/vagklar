# -*- coding: utf-8 -*-
"""Cut the actual road-sign artwork out of the licensed book.

    python scripts/extract-book-signs.py            # extract every sign found
    python scripts/extract-book-signs.py --pages 328

Vägklar has permission to use the book's images, and the book contains the real
sign artwork — drawn as vector page content, which is why the earlier
raster-extraction pass never saw it. Redrawing those signs by hand was always a
second-best, and it went wrong three times: A36 had a cross instead of a
locomotive, A30 and D3 circulated the wrong way, and A25, B6 and B7 were all
mirrored with one of them additionally in the wrong colour. Using the book's own
artwork removes that whole category of mistake.

How a sign is found:

  1. The page is rendered at high resolution.
  2. Coloured regions are located — body text is greyscale, signs are not.
  3. The page's own text is searched for the printed codes, "(A25)" and so on,
     with the position of each.
  4. Each code is paired with the figure sitting directly above it.

Pairing by position rather than by reading order matters: pages carry a
publisher's logo and the occasional stray mark, so counting boxes and codes and
zipping them together silently shifts every assignment after the first
discrepancy.

Output goes to references/extracted/signs/ — gitignored, like every other
intermediate. Only the optimised WebP files produced from these ever ship.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

import numpy as np
import pypdfium2 as pdfium
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
PDF = ROOT / 'references' / 'teoribok-2026-1.pdf'
OUT = ROOT / 'references' / 'extracted' / 'signs'
MANIFEST = OUT / 'manifest.json'

# Rendered at this scale before cropping. A sign occupies roughly a tenth of the
# page width, so 6× gives a crop around 700 px across — enough for a 480/960
# responsive pair without upscaling.
SCALE = 6.0

CODE = re.compile(r'\(([ABCDEFHJSTX]\d{1,2}(?:-\d)?)\)')

# The pages that hold the sign appendix, from the book's own section headings.
SIGN_PAGES = list(range(324, 362))


def text_mask(page, height_pt: float, scale: float, shape) -> np.ndarray:
    """Every character on the page, as a mask.

    Needed only for the line-art pass. Searching for dark pixels finds the
    framed supplementary plates, and it finds the captions under them just as
    well — so several codes were paired with the words "Avstånd" and "Riktning"
    rather than with the plates those words name. Painting the page's own text
    out first leaves only the drawings.
    """
    mask = np.zeros(shape, dtype=bool)
    h, w = shape
    textpage = page.get_textpage()
    for i in range(textpage.count_chars()):
        try:
            left, bottom, right, top = textpage.get_charbox(i, loose=True)
        except Exception:
            continue
        x0 = max(0, int(left * scale) - 2)
        x1 = min(w, int(right * scale) + 3)
        y0 = max(0, int((height_pt - top) * scale) - 2)
        y1 = min(h, int((height_pt - bottom) * scale) + 3)
        if x1 > x0 and y1 > y0:
            mask[y0:y1, x0:x1] = True
    return mask


def figure_boxes(image: Image.Image, gap: int, min_area_frac: float = 0.00010, dark: bool = False,
                 exclude: np.ndarray | None = None):
    """Regions on the page that belong to a figure rather than to body text.

    Two ways of telling them apart, because the book uses two kinds of artwork.

    Most signs are coloured and the page around them is greyscale, so
    saturation separates them cleanly. But the supplementary plates and the
    vehicle symbols are black line art on white — invisible to that test. For
    those, darkness is the signal instead, which also catches the caption
    underneath; the caption is discarded later by requiring that a figure sit
    *above* the code it is paired with.
    """
    arr = np.asarray(image.convert('RGB'), dtype=np.int16)
    hi = arr.max(axis=2)
    lo = arr.min(axis=2)
    if dark:
        mask = hi <= 170
    else:
        mask = (hi >= 40) & ((hi - lo) >= 40)
    if exclude is not None:
        mask &= ~exclude

    h, w = mask.shape
    grown = ndimage.binary_dilation(mask, structure=np.ones((gap, gap), bool))
    labels, count = ndimage.label(grown)
    if count == 0:
        return []

    boxes = []
    min_area = max(1, int(w * h * min_area_frac))
    pad = gap // 2
    for y_slice, x_slice in ndimage.find_objects(labels):
        x0 = max(0, x_slice.start + pad)
        x1 = min(w - 1, x_slice.stop - 1 - pad)
        y0 = max(0, y_slice.start + pad)
        y1 = min(h - 1, y_slice.stop - 1 - pad)
        if x1 <= x0 or y1 <= y0:
            continue
        if int(mask[y0:y1 + 1, x0:x1 + 1].sum()) < min_area:
            continue
        boxes.append((x0, y0, x1, y1))
    return boxes


def codes_on_page(page, height_pt: float, scale: float):
    """Every printed sign code on the page, with where it sits in pixels."""
    textpage = page.get_textpage()
    text = textpage.get_text_range()
    found = []
    for match in CODE.finditer(text):
        boxes = []
        for i in range(match.start(), match.end()):
            try:
                boxes.append(textpage.get_charbox(i, loose=False))
            except Exception:
                continue
        if not boxes:
            continue
        left = min(b[0] for b in boxes)
        right = max(b[2] for b in boxes)
        bottom = min(b[1] for b in boxes)
        top = max(b[3] for b in boxes)
        # PDF space has y increasing upward; the render has it increasing down.
        found.append({
            'code': match.group(1),
            'cx': (left + right) / 2 * scale,
            'top_px': (height_pt - top) * scale,
        })
    return found


def pair(boxes, codes, page_w: int):
    """Assign each printed code the figure standing above it.

    A caption belongs to the picture whose horizontal centre it sits under and
    whose bottom edge is just above it. Both conditions are needed: columns are
    narrow, and a sign three rows up shares the same column.
    """
    used: set[int] = set()
    pairs = []
    for entry in sorted(codes, key=lambda c: (c['top_px'], c['cx'])):
        best = None
        best_cost = None
        for i, (x0, y0, x1, y1) in enumerate(boxes):
            if i in used:
                continue
            if y1 > entry['top_px']:
                continue  # sits below the caption, so it is not this one
            gap = entry['top_px'] - y1
            if gap > page_w * 0.16:
                continue  # too far above to be this caption's picture
            dx = abs((x0 + x1) / 2 - entry['cx'])
            if dx > page_w * 0.14:
                continue  # a different column
            cost = gap + dx * 2
            if best_cost is None or cost < best_cost:
                best, best_cost = i, cost
        if best is not None:
            used.add(best)
            pairs.append((entry['code'], boxes[best]))
    return pairs


def extract(pages: list[int]) -> list[dict]:
    pdf = pdfium.PdfDocument(str(PDF))
    OUT.mkdir(parents=True, exist_ok=True)
    manifest: list[dict] = []
    seen: dict[str, int] = {}

    for number in pages:
        page = pdf[number - 1]
        height_pt = page.get_height()
        image = page.render(scale=SCALE).to_pil()
        w, h = image.size

        codes = codes_on_page(page, height_pt, SCALE)
        if not codes:
            continue

        boxes = figure_boxes(image, gap=max(3, int(w * 0.008)))
        matched = pair(boxes, codes, w)

        # Anything the colour pass could not place is probably line art. Try
        # again on darkness for just those codes, with a tighter dilation so a
        # framed plate does not swallow the caption beneath it.
        placed = {code for code, _ in matched}
        remaining = [c for c in codes if c['code'] not in placed]
        if remaining:
            words = text_mask(page, height_pt, SCALE, (h, w))
            dark_boxes = figure_boxes(image, gap=max(3, int(w * 0.004)), dark=True, exclude=words)
            matched += pair(dark_boxes, remaining, w)
        for code, (x0, y0, x1, y1) in matched:
            if code in seen:
                continue  # the first printing wins; later ones are references
            seen[code] = number

            # A little air so an outer border is never shaved off.
            m = int(max(x1 - x0, y1 - y0) * 0.03) + 2
            cx0, cy0 = max(0, x0 - m), max(0, y0 - m)
            cx1, cy1 = min(w, x1 + 1 + m), min(h, y1 + 1 + m)
            crop = image.crop((cx0, cy0, cx1, cy1))

            path = OUT / f'{code}.png'
            crop.save(path)
            manifest.append({
                'code': code,
                'page': number,
                'file': path.name,
                'crop': [round(cx0 / w, 5), round(cy0 / h, 5), round(cx1 / w, 5), round(cy1 / h, 5)],
                'width': crop.width,
                'height': crop.height,
                'ratio': round(crop.width / crop.height, 3),
            })
        print(f'  s.{number}: {len(matched)} av {len(codes)} koder parade ({len(boxes)} figurer)')

    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=1), 'utf-8')
    return manifest


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--pages', help='t.ex. 328 eller 324-336')
    args = ap.parse_args()

    if not PDF.exists():
        print(f'Källan saknas: {PDF}', file=sys.stderr)
        return 1

    if args.pages:
        a, _, b = args.pages.partition('-')
        pages = list(range(int(a), int(b or a) + 1))
    else:
        pages = SIGN_PAGES

    print(f'Klipper ut märken ur {len(pages)} sidor …')
    manifest = extract(pages)

    by_series: dict[str, int] = {}
    for entry in manifest:
        series = entry['code'][0]
        by_series[series] = by_series.get(series, 0) + 1
    print(f'\n{len(manifest)} märken: ' + ', '.join(f'{k} {v}' for k, v in sorted(by_series.items())))
    print(f'{MANIFEST.relative_to(ROOT)} skriven (gitignorerad).')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
