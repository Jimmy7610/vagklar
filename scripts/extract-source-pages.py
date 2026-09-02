"""Builds a per-page text cache from the licensed theory source.

    python scripts/extract-source-pages.py

Writes references/.page-text.json — a map of page number to the words on that
page, lowercased and deduplicated. The cache is gitignored: it is derived from
licensed material and never leaves the machine, exactly like the PDF itself.

Why a cache: scripts/audit-source-pages.ts checks that every `sourcePages`
citation in the question bank actually lands on a page that discusses the rule
being tested. Re-parsing 367 pages on every audit run would make that check
slow enough that nobody runs it.

Only words are kept, not sentences. The audit needs to know whether a page
talks about "vattenplaning", not to reproduce what the book says about it — and
storing loose vocabulary rather than prose keeps the cache useless as a copy of
the source.
"""

from __future__ import annotations

import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PDF = ROOT / "references" / "teoribok-2026-1.pdf"
OUT = ROOT / "references" / ".page-text.json"

WORD = re.compile(r"[a-zåäöéèü]{3,}", re.IGNORECASE)


def page_text(page: int) -> str:
    result = subprocess.run(
        ["pdftotext", "-f", str(page), "-l", str(page), "-enc", "UTF-8", str(PDF), "-"],
        capture_output=True,
    )
    if result.returncode != 0:
        raise RuntimeError(f"pdftotext failed on page {page}: {result.stderr.decode(errors='replace')}")
    return result.stdout.decode("utf-8", errors="replace")


def main() -> int:
    if not PDF.exists():
        print(f"Källdokumentet saknas: {PDF}", file=sys.stderr)
        print("Sidgranskningen hoppas över — inget att göra.", file=sys.stderr)
        return 1
    if shutil.which("pdftotext") is None:
        print("pdftotext saknas (poppler-utils). Sidgranskningen kan inte köras.", file=sys.stderr)
        return 1

    # One call for the whole document, split on the form feed pdftotext emits
    # between pages — 367 separate subprocesses take minutes, this takes seconds.
    result = subprocess.run(
        ["pdftotext", "-enc", "UTF-8", str(PDF), "-"], capture_output=True
    )
    if result.returncode != 0:
        print(result.stderr.decode(errors="replace"), file=sys.stderr)
        return 1

    pages = result.stdout.decode("utf-8", errors="replace").split("\f")
    cache: dict[str, list[str]] = {}
    for i, text in enumerate(pages, start=1):
        words = sorted({w.lower() for w in WORD.findall(text)})
        if words:
            cache[str(i)] = words

    OUT.write_text(
        json.dumps({"pageCount": len(pages), "pages": cache}, ensure_ascii=False),
        encoding="utf-8",
    )
    print(f"{OUT.relative_to(ROOT)} skriven — {len(cache)} sidor med text av {len(pages)}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
