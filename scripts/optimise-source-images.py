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
DIAGRAM_SRC = ROOT / 'references' / 'extracted' / 'diagrams'
DEST = ROOT / 'src' / 'assets' / 'source-images' / 'teoribok-2026-1'

WIDTHS = (640, 960)
QUALITY = 78

# Diagrams get a higher quality setting than photographs.
#
# A photograph hides compression artefacts in its own noise. A technical drawing
# is flat colour and hard edges, and it carries small numerals — "40 cm", "3 m"
# — that turn to mush at the quality a photograph tolerates. The files are
# small anyway because flat colour compresses well, so the extra quality costs
# very little and buys the thing the diagram exists for.
DIAGRAM_QUALITY = 92

# (extracted file, topic folder, output slug)
CURATED = [
    # --- Omgång 7: vägmärke i verkligheten ---------------------------------
    # Ett varningsmärke för vägkorsning som står i en kurva, där korsningen
    # ännu inte syns. Just det är poängen: märket kommer innan platsen gör det.
    ('p180-0.jpeg', 'vajningsregler', 'varning-vagkorsning-i-kurva'),
    # --- Omgång 6: fler vägmarkeringar i verkligheten ----------------------
    # Två motiv som ingen godkänd bild visade: pilar målade i körbanan, och ett
    # övergångsställe som är bevakat av trafiksignal. Det senare är inte samma
    # sak som det obevakade — där avgör signalen, inte väjningsplikten.
    ('p023-0.jpeg', 'vagmarkeringar', 'korfaltspilar-cirkulation'),
    ('p042-0.jpeg', 'vagmarkeringar', 'bevakat-overgangsstalle'),
    # --- Omgång 5: vägmarkering i verkligheten -----------------------------
    # Delområdet vägmarkeringar hade noll fotografier: varje markering lärdes
    # ut som ren vektor, i idealform. På vägen är färgen sliten, sedd i
    # perspektiv och inbäddad i en korsning. Den här är vald för att
    # väjningslinjen är bildens motiv och inte en detalj i kanten.
    ('p025-0.jpeg', 'vagmarkeringar', 'vajningslinje-utfart'),
    # --- Omgång 4: fordonets säkerhet --------------------------------------
    # Närbilder på komponenter och reglage, för kapitel som saknat all visuell
    # hjälp. Det som lärs ut är en etikett eller ett läge, inte en trafikmiljö.
    ('p238-0.jpeg', 'fordonet', 'bilbarnstol-bakatvand'),
    ('p233-0.jpeg', 'fordonet', 'krockkudde-indikator'),
    ('p224-0.jpeg', 'fordonet', 'bromsskiva'),
    ('p252-0.jpeg', 'last', 'spannband'),
    # --- Omgång 3: verklig trafikmiljö -------------------------------------
    # Valda genom att titta på varje kandidat i review/source-image-candidates.html
    # och behålla de som lär ut något en ritning inte kan: hur en skylt faktiskt
    # ser ut på plats, hur lite man ser mellan parkerade bilar, hur en isig väg
    # ser bedrägligt hanterbar ut i solsken.
    ('p011-0.jpeg', 'vajningsregler', 'signal-over-vajningsmarke'),
    ('p039-0.jpeg', 'vajningsregler', 'sparvagn-kryssmarke'),
    ('p051-1.jpeg', 'passager', 'huvudled-cykelpassage'),
    ('p007-0.jpeg', 'risker', 'cyklist-mellan-parkerade'),
    ('p155-0.jpeg', 'risker', 'gaende-mellan-parkerade'),
    ('p168-0.jpeg', 'risker', 'bussar-vid-hallplats'),
    ('p198-0.jpeg', 'risker', 'smal-viadukt-skymd-utfart'),
    ('p178-0.jpeg', 'landsvag', 'viltvarning-med-tillaggstavla'),
    ('p009-0.jpeg', 'vinter', 'isig-landsvag-utan-linjer'),
    ('p262-0.jpeg', 'morker', 'skymning-belyst-vag'),
    # --- Körfält -----------------------------------------------------------
    ('p016-0.jpeg', 'korfalt', 'korfaltsval-motorvag'),
    ('p014-0.jpeg', 'korfalt', 'placering-landsvag'),
    # --- Väjningsregler ----------------------------------------------------
    ('p024-0.jpeg', 'vajningsregler', 'stopplikt-buss'),
    ('p031-0.jpeg', 'vajningsregler', 'oskyltad-korsning'),
    ('p034-1.jpeg', 'vajningsregler', 'lastbil-korsar'),
    ('p021-0.jpeg', 'vajningsregler', 'stop-flervagsstopp'),
    # --- Passager ----------------------------------------------------------
    ('p047-0.jpeg', 'passager', 'obevakat-overgangsstalle'),
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
    # --- Järnvägskorsningar ------------------------------------------------
    ('p107-0.jpeg', 'jarnvag', 'plankorsning-bommar'),
    ('p108-0.jpeg', 'jarnvag', 'plankorsning-ljussignal'),
    # --- Speciella gator ---------------------------------------------------
    ('p119-0.jpeg', 'speciella-gator', 'gangfartsomrade'),
    # --- Vinter ------------------------------------------------------------
    ('p124-0.jpeg', 'vinter', 'vintervag-hjulspar'),
    # --- Vägmärken i verklig miljö (pass 2) --------------------------------
    ('p089-0.jpeg', 'vagmarken', 'motorvag-portal-vagvisare'),
    ('p084-0.jpeg', 'vagmarken', 'korfaltsvagvisare-korsning'),
    ('p095-0.jpeg', 'vagmarken', 'hastighet-100-ledsnummer'),
    ('p092-1.jpeg', 'vagmarken', 'avfart-hastighet-50'),
    ('p119-1.jpeg', 'vagmarken', 'gagata-skyltad'),
    ('p131-0.jpeg', 'vagmarken', 'pabjuden-korriktning-parkering'),
    # --- Motorväg ----------------------------------------------------------
    ('p090-0.jpeg', 'motorvag', 'motorvag-bro-korfalt'),
    ('p092-0.jpeg', 'motorvag', 'motorvag-stillastaende-fordon'),
    ('p085-0.jpeg', 'motorvag', 'motortrafikled-avsmalning'),
    # --- Landsväg ----------------------------------------------------------
    ('p080-0.jpeg', 'landsvag', 'landsvag-kantlinjer'),
    ('p080-1.jpeg', 'landsvag', 'landsvag-omkorningssikt'),
    ('p078-0.jpeg', 'landsvag', 'landsvag-vagkant'),
    ('p082-0.jpeg', 'landsvag', 'vagarbete-omledning'),
    ('p101-0.jpeg', 'landsvag', 'omkorning-landsvag'),
    ('p105-0.jpeg', 'landsvag', 'buss-vid-hallplats'),
    # --- Vinter och mörker -------------------------------------------------
    ('p123-0.jpeg', 'vinter', 'snotackt-skogsvag'),

]

# Diagrams cropped from rendered pages by scripts/extract-source-diagrams.py.
# Separate list because they come from a different place and are compressed
# differently — the crop names are already the output slugs, so the first field
# is the crop file rather than an extracted photograph.
#
# (crop file, topic folder, output slug)
CURATED_DIAGRAMS = [
    # --- Krocksäkerhet ----------------------------------------------------
    ('deformationszoner.png', 'fordonet', 'deformationszoner'),
    # --- Längd & bredd ----------------------------------------------------
    ('lastbredd-tillaten.png', 'last', 'lastbredd-tillaten'),
    ('lastbredd-otillaten.png', 'last', 'lastbredd-otillaten'),
    ('lastlangd-utmarkning.png', 'last', 'lastlangd-utmarkning'),
    ('bogsering-utmarkning.png', 'last', 'bogsering-utmarkning'),
    # --- Last / släp ------------------------------------------------------
    ('kultryck-hogt.png', 'last', 'kultryck-hogt'),
    ('kultryck-lagt.png', 'last', 'kultryck-lagt'),
    # --- Belysning --------------------------------------------------------
    ('avblandning-mote-1.png', 'morker', 'avblandning-mote-1'),
    ('avblandning-mote-2.png', 'morker', 'avblandning-mote-2'),
    ('avblandning-mote-3.png', 'morker', 'avblandning-mote-3'),
    ('helljus-i-kurva.png', 'morker', 'helljus-i-kurva'),
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

    for filename, topic, slug in CURATED + CURATED_DIAGRAMS:
        is_diagram = (filename, topic, slug) in CURATED_DIAGRAMS
        origin = (DIAGRAM_SRC if is_diagram else SRC) / filename
        if not origin.exists():
            missing.append(filename)
            continue

        folder = DEST / topic
        folder.mkdir(parents=True, exist_ok=True)

        with Image.open(origin) as im:
            im = im.convert('RGB')
            total_before += origin.stat().st_size
            quality = DIAGRAM_QUALITY if is_diagram else QUALITY
            for width in WIDTHS:
                if im.width <= width and width != WIDTHS[-1]:
                    # Never upscale; the largest width still gets written so
                    # every image has a full-size variant to point at.
                    continue
                scale = min(width / im.width, 1.0)
                size = (round(im.width * scale), round(im.height * scale))
                out = folder / f'{slug}-{width}.webp'
                im.resize(size, Image.LANCZOS).save(
                    out, 'WEBP', quality=quality, method=6
                )
                total_after += out.stat().st_size
                written += 1

    if missing:
        print('Saknade original: ' + ', '.join(missing), file=sys.stderr)

    print(
        f'{written} filer skrivna till {DEST.relative_to(ROOT)}\n'
        f'{len(CURATED) + len(CURATED_DIAGRAMS) - len(missing)} bilder, '
        f'{total_before // 1024} kB original -> {total_after // 1024} kB webp'
    )
    return 1 if missing else 0


if __name__ == '__main__':
    raise SystemExit(main())
