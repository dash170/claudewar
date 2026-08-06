# VISUAL_PERCEPTION_LAYER.md

**The perception arm of the CLAUDEWAR machine.** Project-agnostic. Free/OSS-first. Drop-in.

> **The pain this kills:** Claude Code cannot reliably *perceive* rendered output, so it lies — it says "looks good / it's working" when the texture is broken, the animation foot-slides, the PDF overlaps, the caption is mis-timed, the SDXL hand has six fingers, the dashboard overflows on mobile. This layer gives Claude genuine human-like eyes **and** a verification GATE that refuses to emit "pass" unless a defect-hunting judge, anchored to an explicit rubric/reference, finds nothing wrong — on ANY artifact type.

---

## 0. THE THREE LOAD-BEARING TRUTHS (read first)

1. **The lie is born in the JUDGMENT, not the capture.** Every capture tool only turns an artifact into pixels. The "it's good" lie happens when the *same model that built the thing* grades its own render with an open-ended "is this ok?". Capture is ~50% of the fix. The other ~50% is **gate-prompt discipline + a separate critic + a deterministic anchor**.
2. **The native `Read`→vision channel is documented-unreliable.** On some platforms/providers (Bedrock/Vertex/some terminals), oversized (>5MB), transparent, or odd-format PNGs are silently dropped or narrated-not-seen (Anthropic issues #36488, #35866, #18588, #42256). A confident verdict on an image the model never actually saw = MORE lying. → **Every gate run starts with a PERCEPTION CANARY.** If the canary fails, the gate is VOID — output `PERCEPTION-BLIND`, never `PASS`.
3. **Deterministic-first, VLM-second.** Anything provable by a number (pixel-diff %, OCR-vs-source mismatch, mesh-not-watertight, navmesh-disconnected, black-frame brightness, bbox-overflow) must hard-FAIL the build *before* any model is asked for an opinion. The VLM only adds (a) human-readable diagnosis and (b) the "looks-wrong-but-parses-fine" class (ugly layout, wrong values, empty section). Removing Claude's discretion on the cheap-to-check failures is the single biggest anti-lying move.

---

## 1. THE SEE-LIKE-A-HUMAN GATE (the reusable, artifact-agnostic harness)

The gate is **identical for every project**. Only the per-modality `capture()` and `rubric` differ. Pipeline:

```
CANARY → CAPTURE(right diagnostic view, settled) → [DETERMINISTIC ANCHOR] → REFUTE-BIASED VLM JUDGE → STRUCTURED VERDICT → GATE
```

### Stage A — PERCEPTION CANARY (mandatory, ~free)
Before trusting any verdict, have the judging context `Read` a known control image (`canary.png`) containing a secret token + specific shapes/colors, and require it to report them verbatim.
- **Pass:** token + shapes reported correctly → vision channel is live, proceed.
- **Fail:** → output `PERCEPTION-BLIND`, abort, surface "cannot perceive — fix capture/transport", **never emit PASS**.
- Keep `canary.png` ≤1MB, opaque, plain PNG/JPEG (the safe-transport format), regenerate the token per run so it can't be answered from memory.

### Stage B — CAPTURE THE RIGHT DIAGNOSTIC VIEW (one good view > 500 bad)
Not "more screenshots." The *right* view that makes the defect class visible, in a **settled** frame:
- **Readiness oracle = SIGNAL then STABILITY.** Never `sleep`. Phase 1 *Signal*: modality-specific "render started" marker (DOM `[data-ready]` / `__frame_count>10` for WebGL / `GATE_READY` log line for engines / subprocess exit-0 for PDF/video/mesh / stable-file-size for image-gen). Phase 2 *Stability*: capture twice 150ms apart, pixel-diff; only "settled" when change-ratio < 0.001. If never settles → `CAPTURE_UNSTABLE` (treated as FAIL, blocks the judge). This kills the blank/black/loading-placeholder false-OK.
- **Drive the STATES** (declared in a manifest, never discovered ad-hoc): empty / populated-max / error / loading / post-click-modal / hover-focus / scrolled-to-overflow. A state whose action recipe fails → `STATE_UNDRIVEN`, not OK.
- **Drive the ENVIRONMENT MATRIX** where it applies (web/email): viewport × theme × DPI × client. One config certifying OK while others are silently broken is itself a lie. Only *failing* configs surface to the judge (efficiency: one diff-crop per failing config, not N full-page shots).

### Stage C — DETERMINISTIC ANCHOR (when one exists — hard FAIL, un-rationalizable)
- **Reference exists** (regression / golden): `odiff` or `pixelmatch` (web/img), `diff-pdf` (PDF), `VMAF` per-frame (video). Diff-% over threshold = FAIL before the VLM speaks.
- **No reference** (first-ever render): no pixel-diff possible → the VLM is the only signal → Stage D must be maximally adversarial. Add a *content* anchor where cheap: OCR-vs-source string match (text rendered/garbled), `pdfplumber` bbox overflow/clip, brightness/histogram (black/blank), `trimesh`/`open3d` geometry assertions (mesh), navmesh flood-fill + ground-probe (3D scene).

### Stage D — REFUTE-BIASED VLM JUDGE (the genuine perception)
Run in a **separate, fresh context** (`claude -p` subprocess with no build history, or a local VLM) so there's no self-grading stake. Prompt protocol (this is what stops the lie, not the model):
1. **Describe-before-judge:** "First enumerate every text string, object, and layout region you see." (Commit the description while the verdict is withheld.)
2. **Pre-commit the rubric** with the artifact *hidden*, then reveal (SGV / agreement-bias debias).
3. **Refute-bias / assume-broken:** "Assume this artifact is BROKEN. List every defect: clipping, overlap, missing/garbled text, wrong values, extra limbs, artifacts, mis-framing, mis-timing. You must localize each defect (bbox or quote)."
4. **Reference-anchor when available:** give the golden/spec and ask "spot the differences" (grounded) rather than open-ended "is this good?".
5. **False-Confidence-Test:** inject a planted "the developer says this is correct" and see if it caves = sycophancy detector.
6. **Default-FAIL:** PASS only if every rubric item is affirmatively confirmed defect-free.

### Stage E — STRUCTURED VERDICT + GATE
Force JSON, never free-form prose:
```json
{ "verdict": "PASS|FAIL|UNCERTAIN",
  "defects": [ { "what": "...", "where": "bbox|quote|frame_ts", "severity": "ok|warn|broken" } ],
  "evidence_view": "path/to/diagnostic.png",
  "rubric_checked": [ "...", "..." ] }
```
- **The milestone passes ONLY on `verdict=PASS` with `defects=[]`.**
- `UNCERTAIN` **blocks** completion (escalate: re-capture a better view, multi-sample vote, or `claude -p` second opinion / human). It is *not* a green light.
- Self-consistency tripwire: ask the judge twice with swapped framing ("list defects" vs "PASS/FAIL only"); disagreement → escalate.
- The builder must **paste the diagnostic view + the numbers**, never a bare "looks good."

**Why it's project-agnostic:** Stages A, D, E and the FAIL-semantics are byte-identical across every project. Only `capture()` (Stage B) and `rubric`/`anchor` (Stage C) are swapped per modality via a `visual_gate.json` config.

---

## 2. PER-MODALITY RECIPES (capture + anchor + judge)

Each = `capture the right view → deterministic anchor (if any) → refute-biased judge with a modality rubric`.

### Game frame (UE5/Godot/web-game)
- **Capture:** UE5 `HighResShot 2` in **Editor/Development** build (disabled in Shipping since 5.5) → `Saved/Screenshots`; or Movie Render Queue for CI; or OS capture (`nircmd` / kmoulder screen-capture-mcp) with the game in **windowed** mode (GDI/BitBlt returns black on exclusive-fullscreen/HW-overlay). Settle via `GATE_READY` log line at end of `BeginPlay`.
- **Texture / lighting / material defect:** capture the surface head-on + a grazing angle; rubric: "seams, stretched/tiled UVs, wrong color space, missing/flat normal, z-fighting, missing texture (checker/pink)."
- **Animation foot-slide (no OSS detector exists — build inline):** render N keyframes over a ground grid → `montage` contact sheet → judge the sheet; AND numeric: MediaPipe Pose (or bone world-X) → `foot_world_dx` vs `root_dx` per frame; |delta| above tol on a planted foot = FAIL. Pixel-frame can't encode motion → use the sheet, not one frame.
- **Spatial/topological (fall-through, unreachable room, navmesh hole, interpenetration) — never in a frame:** UE5 Automation `-nullrhi`: `SweepSingleByChannel` ground probe at every room/spawn (resting-Z in band), `FindPathToLocationSynchronously` + `IsPartial()` reachability per room, `OverlapMultiByChannel` at doorways. Web: `recast-navigation-js` `findPath` + `rapier-node` capsule-settle + BFS over tile grid. Deterministic PASS/FAIL, no screenshot.

### 3D mesh / model (TRELLIS/Hunyuan3D, Blender furni, STL)
- **Defects invisible in any beauty render** → 3-layer gate:
  - **L0 deterministic (trimesh + open3d):** `is_watertight`, `is_winding_consistent`, `split()` fragment_count==1, `is_edge_manifold`, bbox in real-world scale band, zero degenerate faces. Hard FAIL, <200ms, no render.
  - **L1 diagnostic renders (pyrender headless):** face-normal-as-RGB (flipped normals = color discontinuity), wireframe (holes = open loops), component-color (>1 color = floating fragment). 6 angles × 3 modes → one grid.
  - **L2 judge** reads the *diagnostic grid* (not the beauty shot) with the per-mode rubric.
  - **Repair-then-reassert:** PyMeshLab / ManifoldPlus before final FAIL.

### Web / app UI + dashboard / chart
- **Capture:** Playwright (Apache-2.0) parameterized over the **matrix** (viewport × `color_scheme` × `device_scale_factor`), `full_page`, `wait_for_load_state('networkidle')` + `document.fonts.ready` + no `.loading/.skeleton/[aria-busy]`. Prefer `just-every/mcp-screenshot-website-fast` (tiles to ~1.15MP = Claude-vision sweet spot). Drive states (modal/hover/scrolled/empty/error) per manifest.
- **Anchor:** `odiff`/`pixelmatch` vs blessed baseline (regression); BackstopJS for matrix history.
- **Judge rubric:** "overflow, clipping, overlap, off-canvas, contrast/legibility (esp. dark mode), broken grid, empty-state collapse, wrong/garbled labels." For charts add: "axis labels present, legend matches series, values plausible vs source data, no truncated bars."
- **Mobile (emulator/sim):** `adb exec-out screencap -p` (Android) / `xcrun simctl io booted screenshot --mask alpha` (iOS); detect black-frame via PIL mean-brightness<5 → relaunch emulator `-gpu swiftshader_indirect`; `appium-mcp get_screenshot_file` for the Claude-native path.
- **Email (cross-client):** MJML compile (structural) → Playwright + Gmail `<style>`-strip sim + Outlook CSS-reset injection (TedGoas) + Mailpit round-trip render; Testi.at free tier (3/mo) for true Outlook-Word engine at milestones only.

### PDF / report / document
- **Capture:** `pdf2image`/`pdftoppm` (poppler, MIT path) or PyMuPDF (AGPL — internal-only) → PNG per page. Settle = subprocess exit-0.
- **Anchor (deterministic, the real teeth):** `pdfplumber` per-char bbox overflow (`x1>width`, `y1>height`, `x0<0`, `y0<0`) = clipping FAIL; `pytesseract` OCR-vs-known-source-string mismatch = invisible/garbled-text FAIL; `diff-pdf` exit-code vs golden = regression FAIL.
- **Judge rubric:** "overlapping blocks, clipped/cut-off text, empty section, broken table grid, image not rendered, page-break mid-element." (CJK → Surya OCR for non-Latin.)

### Video / animation
- **Capture:** never frame 0. `ffmpeg -ss 1.5 -frames:v 1` past the GOP black leader; or PySceneDetect to grab semantic keyframes; `ffmpeg ... tile=3x3` contact sheet (zero extra dep). Black-video guard: `ffprobe blackdetect` — >80% black = `BLACK_VIDEO` FAIL.
- **Caption timing (short video):** WhisperX forced-alignment → compare word timestamps to the caption track → `caption_offset_ms` over tolerance = FAIL (numeric, no model). Then judge the frame *at* each caption timestamp for framing.
- **Judge rubric:** "caption present + legible + on-screen + matches audio at this ts, subject framed, no frozen/duplicated frame, transition not broken." VMAF per-frame dip catches a 2s broken transition the global average hides.

### Gen-image (SDXL / diffusion)
- **Capture:** already a PNG — but transport via `itrimble/image-viewer-mcp` (downscales/safe-format) not raw `Read`.
- **Anchor (no-reference, semantic):** CLIP-IQA (IQA-PyTorch) for content-aware quality — **NOT NIQE/BRISQUE** (blind to extra limbs/garbled text). Reference exists → LPIPS.
- **Region-crop judge:** crop to hands/face/text → judge with region-specific rubric ("count fingers, garbled text, extra/merged limbs, melted features, watermark"). HADM for human-figure artifacts (narrow); ArtifactLens/TextPecker as research recipes.

### Diagram (architecture / flow / chart-as-figure)
- **Capture:** render to PNG (mermaid-cli / graphviz / export). Settle = exit-0.
- **Anchor:** node/edge count vs the source spec (deterministic where the source is structured).
- **Judge rubric:** "all labeled nodes present, no overlapping/crossing-illegible edges, arrows correct direction, no clipped labels, legend complete, text legible at render DPI." Set-of-Mark (heavy, GPU) only for dense HUD/dashboard label grids.

---

## 3. VETTED FREE TOOL/SKILL STACK (tier-tagged; install map)

Tiers per SKILL_VETTING_RUBRIC: **T0** inert text · **T1** declarative+hook · **T2** readable code · **T3** opaque/phones-home · **T4** exfil-taint. Adopt free+useful after injection-scan; never reject on license/popularity alone.

**Judge / gate core (any modality):** `claude -p` separate-critic (T1, the keystone — already in a 3D-game night-build system) · DeepEval `MultimodalGEval` with `DEEPEVAL_TELEMETRY_OPT_OUT=1` (T2, Apache-2.0) · Qwen2.5-VL-**7B** via Ollama (T2, Apache-2.0 — 7B only; 3B/72B non-commercial) · LLaVA-Critic (T2, dedicated critic) · Prometheus-2 rubric prompts (T2, Apache-2.0) · Moondream-0.5B gross-defect tripwire (T2, Apache-2.0).

**Capture:** Playwright (+`@playwright/mcp` vision-mode) (T2, web) · `just-every/mcp-screenshot-website-fast` (T2, web, 1.15MP-aware) · `erichowens/playwright-screenshot-inspector` (T2, web) · `kmoulder/screen-capture-mcp` (T2, Windows desktop/game, windowed) · `itrimble/image-viewer-mcp` (T2, on-disk PNG) · `pdf2image`+poppler (T2, doc) · ffmpeg (T2, video) · PySceneDetect (T2, video) · `claude-video-vision` Whisper-local (T2, video) · UE5 HighResShot/MRQ (T2, game) · nircmd/PS-BitBlt (T1, win app) · `appium-mcp` (T2, mobile).

**Deterministic anchor:** odiff (T2, MIT) · pixelmatch (T2, ISC) · ez-img-diff/SSIM (T2) · diff-pdf vslavik (T2, GPL-2) · pdfplumber (T2, MIT) · pytesseract (T1/T2, Apache-2.0) · CLIP-IQA via IQA-PyTorch (T2, MIT) · LPIPS (T2, BSD) · VMAF/libvmaf (T2, BSD) · Q-Align/OneAlign (T2, MIT) · trimesh (T2, MIT) · Open3D (T2, MIT) · pyrender (T2, MIT) · PyMeshLab (T2, GPL) · recast-navigation-js (T2, Zlib) · rapier-node (T2, Apache-2.0) · MediaPipe Pose (T2, Apache-2.0) · WhisperX (T2) · BackstopJS (T2, MIT).

**Sandbox-then-install:** Visual-Regression-Tracker (T2/T3, self-host DB+server) · HADM (T2/T3, weights license) · sworddut ffmpeg-helper (T3, CN repo audit) · DeepEval (vet telemetry-off).

**Vet-manually:** PyMuPDF (AGPL — internal tooling only) · DOVER/FAST-VQA (T2 tech, S-Lab **non-commercial** — internal gating only) · ArtifactLens/TextPecker (research code).

**SKIP / REJECT:** visual-explainer (generates HTML, does NOT perceive) · vidlens-mcp + gemini-video MCP (T3, phones home / Gemini key — not free-local) · TwelveLabs plugin (paid) · screen-view-mcp (paid outbound Vision call) · NIQE/BRISQUE *for artifacts* (semantically blind) · alexop app-screenshots / mcpmarket QA-Screenshot/Visual-Verdict (screenshot-spam or unsourced T3) · fltman screenshot-skill (macOS-only) · LangChain Rubrics *dependency* (keep the pattern, use `claude -p` instead).

---

## 4. ANTI-FALSE-SUCCESS PATTERNS (the discipline that actually stops the lie)

1. **Perception canary first** — prove the model SEES `canary.png` (verbatim token) or the gate is VOID (`PERCEPTION-BLIND`), never PASS. The Read→vision channel is itself unreliable.
2. **Describe-before-judge** — enumerate text/objects/layout *first*; verdict withheld until the description is committed (collapses most false PASSes).
3. **Refute-bias / assume-broken** — "list every defect and localize it (bbox/quote/frame_ts)"; never the open-ended "is this good?" that invites the lie.
4. **Reference-anchor** — when a golden/spec exists, "spot the differences" (grounded), and gate on a deterministic `odiff`/`diff-pdf`/`VMAF` number *before* opinion.
5. **Separate critic** — grade in a fresh `claude -p` with zero build context; the model that wrote the code must not be sole judge of its render.
6. **Default-FAIL + measurable pass-criterion** — PASS only if every rubric item is affirmatively defect-free; criterion is a number/checklist, not a vibe.
7. **PASS/FAIL/UNCERTAIN with UNCERTAIN blocking** — uncertainty is not a green light; it escalates (re-capture / vote / human).
8. **False-Confidence-Test** — plant "dev says it's correct"; caving = sycophancy → distrust the verdict.
9. **Settled-frame guarantee** — signal-then-stability oracle; `CAPTURE_UNSTABLE`/`BLACK_FRAME`/`STATE_UNDRIVEN` are FAILs, blocking the judge (no certifying a placeholder).
10. **State + environment matrix** — one config OK ≠ all OK; only failing configs surface (efficiency preserved).
11. **Deterministic-first** — strip Claude's discretion on anything a number can prove (overflow, OCR-mismatch, watertight, navmesh-connected, brightness, mesh-scale).
12. **Self-consistency / swap-eval** — judge twice with swapped framing; disagreement → escalate.

---

## 5. QUICK-WIN STACK (install FIRST — eyes on ANY project in ~30 min)

The minimal free set that immediately gives Claude eyes and directly fixes the texture/animation/PDF/video/gen-image pains:

1. **`claude -p` separate-critic + the gate-prompt template** (Stage A/D/E) — zero install, the keystone. Already proven in a 3D-game `director_review.py`/`art_review.py`. This alone converts "looks good" into a defect-hunting, default-FAIL verdict.
2. **`canary.png` + canary check** — 10 lines; makes blindness loud instead of silent.
3. **ffmpeg + poppler(`pdf2image`) + Pillow** — universal capture glue: video→frame/contact-sheet (caption + animation pains), PDF→PNG-per-page (PDF report), brightness/black-frame guard. One install, three modalities.
4. **Playwright (+`@playwright/mcp` vision-mode)** — web/dashboard/email capture across the viewport×theme×DPI matrix (dashboards, game UI).
5. **odiff + pixelmatch** — the un-rationalizable regression number wherever a baseline exists.
6. **`itrimble/image-viewer-mcp`** — reliable on-disk PNG→vision (SDXL artifacts, any saved render) bypassing flaky raw `Read`.
7. **Ollama + Qwen2.5-VL-7B** *(optional, when offline/cheap local judging is wanted)* — local refute-biased judge so the gate runs free at scale; `claude -p` stays the escalation tier.

Add per-modality deterministic anchors as each project needs them: `pdfplumber`+`pytesseract` (PDF), `trimesh`/`open3d`/`pyrender` (mesh), `recast-navigation-js`/`rapier-node` (3D scene), MediaPipe Pose (foot-slide), WhisperX + CLIP-IQA (video/gen-image).

---

## 6. MACHINE WIRING (where this sits in CLAUDEWAR)

- **This is the perception arm of the MICRO loop's GROUND step.** In `FRAME→GROUND→DRAFT→CRITIQUE→REVISE→SCORE→GATE`, GROUND must include *seeing the current artifact*. The gate produces the structured verdict that feeds CRITIQUE (the defect list is the critique) and SCORE (PASS=1 / FAIL=0 / UNCERTAIN=block).
- **It is the HUMAN-lens, operationalized.** "Would a human looking at this say it's broken?" becomes the refute-biased judge + reference rubric — the empathy/market-lens doctrine made measurable.
- **It GATES any visual milestone on any project type.** A milestone with a visual artifact cannot be marked done until its `visual_gate.json` returns PASS with empty defects. This is the MICRO "self-improve each milestone" enforcement and a hard precondition for the MACRO "non-stop until SHIP" loop — a FAILED visual gate is a blocker to *resolve* (re-capture, fix, re-judge), never a stop, and never a false-pass.
- **Config-driven, not code-fork.** Each project drops a `visual_gate.json` (`type`, capture target, state matrix, env matrix, rubric, threshold, baseline path). The harness routes `type`→capture recipe. The gate logic, canary, judge protocol, and FAIL-semantics never change. That is the project-agnostic contract: **same gate, swap only the capture + rubric.**
- **Eco / token-economy:** deterministic anchors run first and free; the VLM is invoked only when the cheap checks pass or when a human-readable diagnosis is needed; local Qwen for the every-frame cheap pass, `claude -p` only on flagged/ambiguous views. One good diagnostic view over 500 bad ones.
