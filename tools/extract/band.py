"""
Locate the product on a catalogue page by ink mass, not by position.

Looking at all seventeen line sheets side by side, the layouts differ in almost
every way — title left or centred, code badge in any corner, colour swatches
below or beside, light marble ground or black marble ground — but one thing
holds everywhere: the product is a big object that covers a wide, unbroken run
of rows, while every piece of chrome (titles, captions, swatch dots, feature
icons, rules) is thin and sparse.

So: measure, for each row, how much of it differs from the page's own
background, and keep the longest run of rows that are substantially covered.
Then do the same across the columns of that band. Text never survives it,
because a line of type only ever covers a small fraction of a row.
"""
import numpy as np
from PIL import Image
from scipy import ndimage

AW = 460          # analysis width
EDGE = 0.03       # ignore the outermost 3% — decorative borders live there


def _bg_luma(l: np.ndarray) -> float:
    """The page's ground tone, taken from its margins."""
    h, w = l.shape
    m = np.concatenate([
        l[:int(h * 0.03)].ravel(), l[-int(h * 0.03):].ravel(),
        l[:, :int(w * 0.03)].ravel(), l[:, -int(w * 0.03):].ravel(),
    ])
    return float(np.median(m))


def _run(mass: np.ndarray, frac: float, lo: int, hi: int):
    """Longest contiguous run of `mass` above `frac` of its peak, within [lo,hi)."""
    m = mass.copy()
    m[:lo] = 0
    m[hi:] = 0
    peak = m.max()
    if peak <= 0:
        return 0, len(mass)
    on = m > peak * frac
    # Bridge small dips inside the product (a pale gap between two boxes, a
    # shadow) without bridging the clear space between the title and the
    # product — that gap is what separates chrome from subject.
    on = ndimage.binary_closing(on, np.ones(globals().get("_BRIDGE", 8)))
    lab, n = ndimage.label(on)
    if n == 0:
        return 0, len(mass)
    sizes = ndimage.sum(on, lab, range(1, n + 1))
    # prefer the longest run; break ties by total mass inside it
    order = np.argsort(sizes)[::-1]
    best = None
    for i in order[:3]:
        idx = np.where(lab == i + 1)[0]
        score = len(idx) * 1.0 + m[idx].sum() / peak * 0.25
        if best is None or score > best[0]:
            best = (score, idx[0], idx[-1] + 1)
    return best[1], best[2]


def subject_box(im: Image.Image, thr=42, row_frac=0.34, col_frac=0.22):
    """(x0, y0, x1, y1) in 0..1 page coordinates."""
    W0, H0 = im.size
    ah = max(1, round(AW * H0 / W0))
    l = np.asarray(im.convert("L").resize((AW, ah), Image.LANCZOS), dtype=np.float32)
    l = ndimage.uniform_filter(l, 3)
    bg = _bg_luma(l)
    ink = np.abs(l - bg) > thr

    # Keep only marks that are thick in BOTH directions. Type is thin whichever
    # way you measure it — a stem is narrow, a bar is shallow — so an opening
    # by a small square erases every headline, caption and swatch label while
    # a box, a notebook or a flask barely notices. This is what finally
    # separates the chrome from the subject on all three page layouts.
    k = max(3, int(round(ah * 0.022)))
    ink = ndimage.binary_opening(ink, np.ones((k, k)))
    ink = ink.astype(np.float32)

    ey, ex = int(ah * EDGE), int(AW * EDGE)
    rows = ink[:, ex:AW - ex].mean(axis=1)
    y0, y1 = _run(rows, row_frac, ey, ah - ey)

    band = ink[y0:y1, :]
    cols = band.mean(axis=0) if band.size else np.zeros(AW)
    x0, x1 = _run(cols, col_frac, ex, AW - ex)

    return (x0 / AW, y0 / ah, x1 / AW, y1 / ah)


def frame(im: Image.Image, box, aspect=1.5, inset=0.012, out_w=1200):
    """
    Inscribe the largest `aspect` rectangle *inside* the detected band and
    centre it on the product.

    Inscribing rather than expanding is the whole point: growing a short band
    up to 3:2 is what dragged the headline and the "AVAILABLE COLOURS" strip
    back into the picture. An A4 page is 1:1.41, so a full-width 3:2 frame is
    only 0.47 of the page height while a detected product band is typically
    0.5-0.6 — the frame fits with room to spare, and any page where it doesn't
    loses a sliver of product rather than gaining a line of type.
    """
    W, H = im.size
    px0, py0, px1, py1 = box[0] * W, box[1] * H, box[2] * W, box[3] * H
    # pull in slightly so a shadow edge at the band boundary is not included
    dx, dy = (px1 - px0) * inset, (py1 - py0) * inset
    px0, py0, px1, py1 = px0 + dx, py0 + dy, px1 - dx, py1 - dy

    cx, cy = (px0 + px1) / 2, (py0 + py1) / 2
    bw = max(8.0, min(px1 - px0, (py1 - py0) * aspect))
    bh = bw / aspect

    left = min(max(cx - bw / 2, 0), W - bw)
    top = min(max(cy - bh / 2, 0), H - bh)
    c = im.crop((round(left), round(top), round(left + bw), round(top + bh)))
    return c.resize((out_w, round(out_w / aspect)), Image.LANCZOS)


def solid_box(im: Image.Image, thr=40, k_frac=0.026, keep=0.55):
    """
    For the single-accessory sheets — a keychain, a pen — where a text column
    fills one side of the page and the product floats on the other.

    Here the run-of-rows idea is no use: the product is small and the text is
    the biggest thing on the page. But the solidity opening already deletes
    type, so once it has run, whatever ink is left IS the product. Take the
    largest surviving blob and any blob that touches its neighbourhood.
    """
    W0, H0 = im.size
    ah = max(1, round(AW * H0 / W0))
    l = np.asarray(im.convert("L").resize((AW, ah), Image.LANCZOS), dtype=np.float32)
    l = ndimage.uniform_filter(l, 3)
    ink = np.abs(l - _bg_luma(l)) > thr

    k = max(3, int(round(ah * k_frac)))
    ink = ndimage.binary_opening(ink, np.ones((k, k)))
    ink = ndimage.binary_closing(ink, np.ones((k, k)))

    ey, ex = int(ah * EDGE), int(AW * EDGE)
    ink[:ey] = ink[-ey:] = False
    ink[:, :ex] = ink[:, -ex:] = False

    lab, n = ndimage.label(ink)
    if n == 0:
        return (0.05, 0.2, 0.95, 0.8)
    sizes = ndimage.sum(ink, lab, range(1, n + 1))
    objs = ndimage.find_objects(lab)
    big = int(np.argmax(sizes))
    ys, xs = objs[big]
    y0, y1, x0, x1 = ys.start, ys.stop, xs.start, xs.stop

    # absorb neighbours of comparable weight that sit alongside the main blob
    for i, sl in enumerate(objs):
        if i == big or sizes[i] < sizes[big] * keep:
            continue
        bys, bxs = sl
        if (min(y1, bys.stop) - max(y0, bys.start) > -ah * 0.06 and
                min(x1, bxs.stop) - max(x0, bxs.start) > -AW * 0.06):
            y0, y1 = min(y0, bys.start), max(y1, bys.stop)
            x0, x1 = min(x0, bxs.start), max(x1, bxs.stop)

    return (x0 / AW, y0 / ah, x1 / AW, y1 / ah)
