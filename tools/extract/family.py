"""
Find each catalogue family's photo zone by variance across its own pages.

Every page of one line sheet carries the same furniture — the same title, the
same rules, the same gold corners, even the same backdrop photograph. The only
thing that changes from page to page is the product. So stack a family's pages
and take the per-pixel standard deviation: the chrome cancels to nothing and
the product lights up. No thresholds about what a letter looks like, no
guessing which corner the text sits in — the pages themselves say where the
product is.

Two small regions also change per page and must be discarded: the code badge
(JPP 201 -> JPP 202) and the colour-option dots. Both are small and detached,
so keeping the largest connected region is enough.
"""
import os, glob, json, shutil, subprocess
import numpy as np
from PIL import Image
from scipy import ndimage

SRC = "/mnt/user-data/uploads/Client Website"
TMP = "/home/claude/ex/pg"
AW = 380          # analysis width
MAXP = 26         # pages sampled per family — plenty for a stable variance


def render(pdf, dpi=150, first=None, last=None, into=None):
    d = into or TMP
    shutil.rmtree(d, ignore_errors=True)
    os.makedirs(d)
    cmd = ["pdftoppm", "-jpeg", "-r", str(dpi)]
    if first:
        cmd += ["-f", str(first)]
    if last:
        cmd += ["-l", str(last)]
    cmd += [f"{SRC}/{pdf}.pdf", f"{d}/p"]
    subprocess.run(cmd, check=True, capture_output=True)
    return sorted(glob.glob(f"{d}/p-*.jpg"))


def photo_zone(files, pad=0.012):
    """(x0, y0, x1, y1) in 0..1, the region that changes from page to page."""
    step = max(1, len(files) // MAXP)
    picks = files[::step][:MAXP]

    stack = []
    ah = None
    for f in picks:
        im = Image.open(f).convert("RGB")
        if ah is None:
            ah = max(1, round(AW * im.size[1] / im.size[0]))
        stack.append(np.asarray(im.resize((AW, ah), Image.LANCZOS), dtype=np.float32))
    arr = np.stack(stack)                      # pages, h, w, 3
    var = arr.std(axis=0).max(axis=2)          # per-pixel change, worst channel

    # blur so a busy product reads as one region rather than speckle
    var = ndimage.gaussian_filter(var, 3.0)

    hi = var > max(6.0, float(np.percentile(var, 82)))
    hi = ndimage.binary_closing(hi, np.ones((9, 9)))
    hi = ndimage.binary_opening(hi, np.ones((5, 5)))
    hi = ndimage.binary_fill_holes(hi)

    lab, n = ndimage.label(hi)
    if n == 0:
        return (0.02, 0.20, 0.98, 0.84)
    sizes = ndimage.sum(hi, lab, range(1, n + 1))
    main = int(np.argmax(sizes)) + 1
    ys, xs = np.where(lab == main)
    x0, x1 = xs.min() / AW, (xs.max() + 1) / AW
    y0, y1 = ys.min() / ah, (ys.max() + 1) / ah

    return (max(0.0, x0 - pad), max(0.0, y0 - pad),
            min(1.0, x1 + pad), min(1.0, y1 + pad))


def sheet(ims, path, cols, cw, bg=(248, 248, 248)):
    sc = [i.resize((cw, round(cw * i.size[1] / i.size[0])), Image.LANCZOS) for i in ims]
    ch = max(i.size[1] for i in sc)
    rows = (len(sc) + cols - 1) // cols
    out = Image.new("RGB", (cw * cols, ch * rows), bg)
    for i, s in enumerate(sc):
        out.paste(s, ((i % cols) * cw, (i // cols) * ch))
    out.save(path, quality=88)
    return out.size


if __name__ == "__main__":
    specs = json.load(open("/home/claude/ex/specs.json"))
    zones = {}
    for s in specs:
        fs = render(s["pdf"], dpi=90)
        z = photo_zone(fs)
        zones[s["pre"]] = {"pdf": s["pdf"], "pages": len(fs),
                           "codes": len(s["codes"]), "zone": [round(v, 4) for v in z]}
        print(f'{s["pre"]:5s} pages={len(fs):3d} codes={len(s["codes"]):3d} '
              f'zone=({z[0]:.3f},{z[1]:.3f})-({z[2]:.3f},{z[3]:.3f})', flush=True)
    json.dump(zones, open("/home/claude/ex/zones.json", "w"), indent=1)
