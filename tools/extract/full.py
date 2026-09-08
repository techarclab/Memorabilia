"""
Second cut: the whole catalogue page, nothing cropped away.

The earlier pass hunted for the product and threw the page furniture out. This
one does the opposite — every page goes through whole, title, badge, swatch row
and all, because that is what the client asked to see.

Two things still have to be done for a grid to hold together. The pages are not
all the same shape (the gift-set sheets are A4 at 1:1.41, the luxury sheets are
nearly square), so each one is padded out to a single 3:4 canvas rather than
cropped to it — padding adds, cropping removes, and removing is the thing we
are avoiding here. The pad colour is sampled from the page's own border, so a
cream sheet pads cream and a black sheet pads black instead of both sitting on
a grey box.
"""
import os, sys, json, glob
import numpy as np
from PIL import Image
sys.path.insert(0, "/home/claude/ex")
from family import render, sheet

# its own scratch dir, so a second run can never clobber a first
PG = "/home/claude/ex/pgfull"

OUT = "/home/claude/ex/imgfull"
ASPECT = 0.75          # 3:4 portrait — close to A4, so the pads stay small
OUT_W = 900            # keeps the whole set inside a 20 MB transfer
DPI = 200


def trim_white(im: Image.Image) -> Image.Image:
    """Drop any uniform paper margin the renderer left around the artwork."""
    a = np.asarray(im.convert("L"))
    h, w = a.shape
    rows = np.where((a < 248).sum(1) > w * 0.02)[0]
    cols = np.where((a < 248).sum(0) > h * 0.02)[0]
    if len(rows) < 10 or len(cols) < 10:
        return im
    return im.crop((int(cols[0]), int(rows[0]), int(cols[-1]) + 1, int(rows[-1]) + 1))


def border_colour(im: Image.Image):
    """The page's own edge tone, so the padding reads as part of the sheet."""
    a = np.asarray(im.convert("RGB"))
    h, w, _ = a.shape
    e = max(2, int(min(h, w) * 0.02))
    edge = np.concatenate([
        a[:e].reshape(-1, 3), a[-e:].reshape(-1, 3),
        a[:, :e].reshape(-1, 3), a[:, -e:].reshape(-1, 3),
    ])
    return tuple(int(v) for v in np.median(edge, axis=0))


def pad_to(im: Image.Image, aspect=ASPECT, out_w=OUT_W) -> Image.Image:
    """Fit the whole page inside one canvas shape without losing a pixel of it."""
    W, H = im.size
    if W / H > aspect:          # page is wider than the canvas: pad top and bottom
        cw, ch = W, round(W / aspect)
    else:                        # taller: pad left and right
        ch, cw = H, round(H * aspect)
    canvas = Image.new("RGB", (cw, ch), border_colour(im))
    canvas.paste(im, ((cw - W) // 2, (ch - H) // 2))
    return canvas.resize((out_w, round(out_w / aspect)), Image.LANCZOS)


def main(only=None):
    specs = json.load(open("/home/claude/ex/specs.json"))
    os.makedirs(OUT, exist_ok=True)
    for s in specs:
        if only and s["pre"] not in only:
            continue
        files = render(s["pdf"], dpi=DPI, into=PG)
        n = min(len(files), len(s["codes"]))
        for f, code in zip(files[:n], s["codes"][:n]):
            im = pad_to(trim_white(Image.open(f).convert("RGB")))
            im.save(f"{OUT}/{code}.webp", "WEBP", quality=76, method=6)
        print(f'{s["pre"]:5s} {n:3d} pages', flush=True)


if __name__ == "__main__":
    main(sys.argv[1].split(",") if len(sys.argv) > 1 and sys.argv[1] != "-" else None)
