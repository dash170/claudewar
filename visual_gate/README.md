# visual_gate — the SEE-like-a-human gate (installed quick-win stack)

The drop-in perception gate for ANY project. Keystone (`GATE_PROMPT.md` + canary) needs no deps; the rest is the installed free tool layer. Full design: `../VISUAL_PERCEPTION_LAYER.md`.

## What's installed (06-21, this machine)
| Tool | Where | Modality | Use |
|---|---|---|---|
| **GATE_PROMPT.md** | this folder | any | the refute-biased judge prompt for a fresh `claude -p` critic — the keystone |
| **make_canary.py** | this folder | any | Stage-A perception canary (token + 3 shapes) — VALIDATED: vision channel reads it. Expected answer → STDOUT (runner-only), never next to the image |
| Pillow | gate venv — `<PYTHON>` (verified 2026-07-16: PIL 12.2.0, fitz, pytesseract all import) | img | image handling / canary |
| PyMuPDF (`fitz`) | gate venv (path above) | doc | PDF page → PNG, NO external binary (the PDF capture path) |
| pdf2image / pytesseract | gate venv (path above) | doc | PDF→PNG (needs poppler) / OCR-vs-source garbled-text FAIL (needs Tesseract) |
| odiff-bin + pixelmatch + pngjs | `visual_gate/node_modules` | any | the un-rationalizable pixel-diff NUMBER vs a baseline. NOTE: does NOT travel with a copy of this folder — `npm i` at destination |
| ffmpeg | system (winget), on PATH | video | frame extract / contact-sheet (`tile`) / `blackdetect` |
| Tesseract | `C:\Program Files\Tesseract-OCR\tesseract.exe` — NOT on PATH; set `pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"` | doc/ui | OCR engine behind pytesseract |

Not installed (optional / heavier): Playwright+chromium (web capture — `npm i -D playwright && npx playwright install chromium` when a web project needs it), Ollama+Qwen2.5-VL-7B (offline local judge), itrimble/image-viewer-mcp (MCP — needs MCP-config wiring).

## Run the gate (any modality)
```
1. CANARY    <PYTHON> visual_gate/make_canary.py <workdir>
             # -> canary.png in <workdir>; EXPECTED ANSWER printed to stdout — the RUNNER keeps it.
             # NEVER write canary_expected.json where the judge can Read it (that lets it cheat).
2. NORMALIZE every judged image to the canary-safe envelope: opaque plain PNG, <=1MB, <=~1.15MP
             (flatten transparency, downscale) — a canary pass proves the CHANNEL, not the artifact.
3. CAPTURE   the RIGHT diagnostic view (settled, not spammed) — per modality below
4. ANCHOR    deterministic FAIL where a number exists (pixel-diff / OCR / bbox / black-frame)
5. JUDGE     fresh separate critic with: canary.png + the diagnostic view(s) + the milestone rubric (+ reference)
             PowerShell 5.1:  Get-Content visual_gate\GATE_PROMPT.md -Raw | claude -p
             bash:            claude -p < visual_gate/GATE_PROMPT.md
             (bare `claude -p < file` is a PARSE ERROR in PowerShell — `<` is reserved)
6. COMPARE   the judge's canary answer vs the runner-held expected JSON — mismatch = PERCEPTION-BLIND.
7. GATE      pass ONLY if verdict=PASS & defects=[].  UNCERTAIN/PERCEPTION-BLIND = blocked, not green.
```

## Per-modality capture one-liners (installed tools)
- **PDF / report** (PDF report): `python -c "import fitz; [p.get_pixmap(dpi=150).save(f'pg{p.number}.png') for p in fitz.open('out.pdf')]"` → judge each page (overflow/clipping/garbled).
- **Video / animation / TikTok** (short video): `ffmpeg -i clip.mp4 -vf "fps=2,tile=4x4" sheet.png` (contact sheet) + `ffmpeg -i clip.mp4 -vf blackdetect -f null -` (black-frame guard) → judge timing/framing/foot-slide.
- **Generated image** (SDXL etc.): judge the saved PNG directly (artifacts/extra-limbs/garbled-text); regression vs a golden via `npx odiff golden.png new.png diff.png`.
- **Web / dashboard** (dashboards, browser games): Playwright headless PNG across viewport×theme → judge overflow/misrender (install Playwright when needed).
- **Game frame / texture** (3D game): in-engine `HighResShot` (Editor build) or `screen-capture-mcp` windowed → judge seams/stretched-UV/missing-texture; mesh checks via `trimesh` when 3D assets change.
- **Regression (any)**: `npx odiff baseline.png current.png diff.png` → diff% over threshold = hard FAIL before the judge speaks.
