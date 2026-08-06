#!/usr/bin/env python3
"""Perception canary (Visual Gate Stage A).
Generates canary.png (a control image with a fresh random TOKEN + 3 known colored shapes)
and canary_expected.json (the ground truth). The visual-gate judge must Read canary.png and
report the token + shapes verbatim BEFORE judging any real artifact. If it can't, the vision
channel is dead -> verdict PERCEPTION-BLIND, never PASS. Regenerate per run so it can't be
answered from memory.

SECURITY: the ground truth must NEVER be readable by the judge. canary.png goes to out_dir
(shared with the judge); the expected answer goes to STDOUT ONLY by default — the RUNNER
captures it and compares AFTER the judge answers. Pass expected_dir (a runner-only directory
the judge has no file access to) only if you need it on disk.

Usage:  python make_canary.py [out_dir] [expected_dir]
Deps:   Pillow  (pip install Pillow)
"""
import json, os, random, string, sys
from PIL import Image, ImageDraw

OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__))
EXPECTED_DIR = sys.argv[2] if len(sys.argv) > 2 else None
if EXPECTED_DIR and os.path.abspath(EXPECTED_DIR) == os.path.abspath(OUT):
    sys.exit("make_canary: expected_dir must NOT be the same directory as out_dir — the judge could read the answer.")
os.makedirs(OUT, exist_ok=True)

token = "".join(random.choices(string.ascii_uppercase + string.digits, k=8))
COLORS = {"red": (220, 40, 40), "green": (40, 180, 80), "blue": (50, 100, 230),
          "yellow": (235, 200, 40), "purple": (150, 60, 200)}
SHAPES = ["circle", "square", "triangle"]

picks = [(random.choice(SHAPES), c) for c in random.sample(list(COLORS), 3)]

img = Image.new("RGB", (512, 512), (245, 245, 245))  # opaque, plain PNG = safe-transport
d = ImageDraw.Draw(img)
d.text((24, 22), f"TOKEN: {token}", fill=(10, 10, 10))
d.text((24, 44), "(perception canary - report token + 3 shapes)", fill=(90, 90, 90))

slots = [(70, 150), (210, 150), (350, 150)]
for (shape, color), (x, y) in zip(picks, slots):
    rgb = COLORS[color]
    if shape == "circle":
        d.ellipse([x, y, x + 110, y + 110], fill=rgb)
    elif shape == "square":
        d.rectangle([x, y, x + 110, y + 110], fill=rgb)
    else:  # triangle
        d.polygon([(x + 55, y), (x, y + 110), (x + 110, y + 110)], fill=rgb)

img.save(os.path.join(OUT, "canary.png"))
expected = {"token": token, "shapes": [{"shape": s, "color": c} for s, c in picks]}
if EXPECTED_DIR:
    os.makedirs(EXPECTED_DIR, exist_ok=True)
    with open(os.path.join(EXPECTED_DIR, "canary_expected.json"), "w") as f:
        json.dump(expected, f, indent=2)

print(json.dumps(expected))
