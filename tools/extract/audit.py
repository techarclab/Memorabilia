"""One labelled strip per family so every layout can be judged at once."""
import sys, json, glob
from PIL import Image, ImageDraw
sys.path.insert(0, "/home/claude/ex")
from family import sheet

specs = json.load(open("/home/claude/ex/specs.json"))
per = int(sys.argv[2]) if len(sys.argv) > 2 else 4
want = sys.argv[1].split(",") if len(sys.argv) > 1 and sys.argv[1] != "-" else None

panels = []
for s in specs:
    if want and s["pre"] not in want:
        continue
    codes = s["codes"]
    step = max(1, len(codes) // per)
    for c in codes[::step][:per]:
        f = f"/home/claude/ex/img/{c}.webp"
        try:
            im = Image.open(f).convert("RGB")
        except Exception:
            continue
        d = ImageDraw.Draw(im)
        d.rectangle([0, 0, 300, 40], fill=(0, 0, 0))
        d.text((10, 12), f'{s["pre"]}  {c}', fill=(255, 215, 0))
        panels.append(im)

for k in range(0, len(panels), 16):
    print(sheet(panels[k:k + 16], f"/home/claude/ex/try/audit_{k//16}.jpg", 4, 460))
