"""
Extract all 367 product images.

Per page the band detector proposes a box. Individual pages can fool it — a
very dark product merges with a dark title, a pale one loses its edges — so
the boxes are not used directly. Instead each family's boxes are reduced to
their median and every page in that family is cut to that one box.

That does two jobs at once. It throws away the outliers, because a detector
that is right on twenty pages out of twenty-three has a median that is right.
And it makes the images within a family land on identical framing, which is
what makes a grid of them read as one set instead of 367 separate crops.

OVERRIDE holds the families where the median still needed a human eye.
"""
import os, sys, json, glob
import numpy as np
from PIL import Image
sys.path.insert(0, "/home/claude/ex")
from family import render, sheet
from band import subject_box, frame

OUT = "/home/claude/ex/img"
SHEETS = "/home/claude/ex/try"
DPI = 200

# Hand-corrected boxes, keyed by family prefix: (x0, y0, x1, y1) of the page.
#
# The median is right for the plain gift-set sheets, where the product is a
# wide band between a title and a swatch row. It is wrong in three situations,
# and each correction below is one of them:
#
#   * a feature list runs down one side — right on most sheets, left on
#     the 4-in-1 premium combo — so x0 or x1 has to come in
#   * a swatch or icon strip sits under the product  -> pull y1 up
#   * the sheet is a single accessory with a text column beside it, where the
#     product is the smaller object on the page and no run-of-rows can find it
OVERRIDE = {
    # feature list down the right side
    "g2p":  (0.020, 0.330, 0.780, 0.775),
    "g3p":  (0.100, 0.340, 0.720, 0.745),
    "g4p":  (0.020, 0.330, 0.720, 0.735),
    "g3pc": (0.020, 0.300, 0.680, 0.800),
    "g4pc": (0.150, 0.320, 1.000, 0.775),
    "g5p":  (0.020, 0.300, 0.720, 0.800),
    # swatch / icon strip below the product
    "g4":   (0.030, 0.385, 0.970, 0.710),
    "g4c":  (0.030, 0.330, 0.970, 0.790),
    "g5c":  (0.030, 0.320, 0.970, 0.720),
    "g3x":  (0.030, 0.300, 0.970, 0.770),
    "lux":  (0.030, 0.360, 0.970, 0.790),
    # single accessories: text column left, product right
    "kc":   (0.360, 0.160, 1.000, 0.780),
    "pp":   (0.360, 0.240, 1.000, 0.900),
    "tp":   (0.300, 0.365, 0.980, 0.720),
}


def boxes_for(pdf, files):
    bs = []
    for f in files:
        im = Image.open(f).convert("RGB")
        bs.append(subject_box(im))
    return np.array(bs)


def main(only=None, write=True, review=True):
    specs = json.load(open("/home/claude/ex/specs.json"))
    os.makedirs(OUT, exist_ok=True)
    os.makedirs(SHEETS, exist_ok=True)
    report = {}

    for s in specs:
        pre = s["pre"]
        if only and pre not in only:
            continue
        files = render(s["pdf"], dpi=DPI)
        n = min(len(files), len(s["codes"]))
        files, codes = files[:n], s["codes"][:n]

        if pre in OVERRIDE:
            box = tuple(OVERRIDE[pre])
            src = "manual"
        else:
            bs = boxes_for(s["pdf"], files)
            box = tuple(np.median(bs, axis=0))
            src = "median"

        panels = []
        for f, code in zip(files, codes):
            im = Image.open(f).convert("RGB")
            out = frame(im, box, out_w=1200)
            if write:
                out.save(f"{OUT}/{code}.webp", "WEBP", quality=82, method=5)
            if review:
                panels.append(out)

        report[pre] = {"box": [round(float(v), 4) for v in box], "n": n, "src": src}
        print(f'{pre:5s} n={n:3d} {src:6s} '
              f'box=({box[0]:.3f},{box[1]:.3f})-({box[2]:.3f},{box[3]:.3f})', flush=True)

        if review:
            for k in range(0, len(panels), 12):
                sheet(panels[k:k + 12], f"{SHEETS}/rev_{pre}_{k//12}.jpg", 4, 400)

    json.dump(report, open("/home/claude/ex/report.json", "w"), indent=1)
    return report


if __name__ == "__main__":
    only = sys.argv[1].split(",") if len(sys.argv) > 1 and sys.argv[1] != "-" else None
    main(only)
