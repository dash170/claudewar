# CLAUDEWAR — SKILLS INDEX

Every skill the auto-machine can use. **This file is the SINGLE LIVE VERDICT TABLE** (CLAUDE.md CANON rule 2 — VETTING_REPORT = evidence archive, the rubric = rules only). **Owner rule: FREE permissive first.** License caveat (rescoped 2026-07-16): "verify" flags apply to the TO-INSTALL tables only — the 8 vetted candidates below have byte-confirmed licenses per `../VETTING_REPORT.md` §6. Read LICENSE before vendoring anything still marked "verify".
The TO-INSTALL tables are **on-demand per project** (CLAUDE.md EQUIP installs at materialization when the study flags a need) — NOT a standing backlog; nothing here is overdue by sitting uninstalled.

## INSTALLED (local, owner's master)

- **prompt-master** — `skills/prompt-master/SKILL.md` (+ `PROMPT_MASTER_LOOP.md` full doc). Live at `<CLAUDE_SKILLS_DIR>\prompt-master\`. The 8-stage Master Prompting Loop + the baked `<self_improvement_loop>` (micro self-improve + macro non-stop-until-ship) + IMAGINATION MODE (divergent pre-loop). This is the spine; everything else feeds it.
- **Karpathy code discipline** — T0 inert, injection-scan clean, but **NOT vendored in this repo**: upstream [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) ships **no LICENSE file**, so the text is use-locally / never-redistribute. What ships here is a credited paraphrase of the four principles inside `_TEMPLATE/CLAUDE.md` — Think-Before-Coding / Simplicity-First / Surgical-Changes / Goal-Driven-Execution — so every builder inherits them. Fetch the original yourself if you want the full text.

## TO INSTALL — PROMPTING / QUALITY (free)
*(makes output correct/convergent — see `arsenals/PROMPTING_ARSENAL_CLAUDE_CODE.md`)*

| Skill / repo | Install | License | Role in the machine |
|---|---|---|---|
| promptfoo (+ promptfoo-evals CC skill) | `npm i -D promptfoo` / `npx skills add promptfoo/promptfoo` | MIT | Eval-gate for SCORE/CONVERGENCE; CI regression = cross-session memory |
| anthropics/claude-cookbooks | clone | MIT | evaluator_optimizer loop + `{$VAR}` metaprompt seed |
| vercel-labs/skills (`npx skills`) | `npx skills` | MIT | one-command installer for everything here + find-skills discovery |
| gepa-ai/gepa | `pip install gepa` | MIT (verify) | Pareto archive + reflect-on-trace = continuous-improvement engine |
| hesreallyhim/awesome-claude-code | clone | verify | machine-readable resources CSV → scheduled re-research feed |
| qdhenry/Claude-Command-Suite (handoff-continue) | `npx skills add ...` | MIT | cross-session persistence (best-so-far survives /clear) |
| getsentry/skills prompt-optimizer | clone | verify | eval-cases-first + failure-clustering |
| anthropics/skills (skill-creator) | clone | Apache-2.0 | scaffold/lint skills with progressive disclosure |

## TO INSTALL — CREATIVITY / IMAGINATION (free)
*(makes output original/divergent — see `arsenals/CREATIVITY_IMAGINATION_ARSENAL.md`)*

| Skill / repo | Install | License | Role in the machine |
|---|---|---|---|
| CHATS-lab/verbalized-sampling | technique (prompt) | Apache-2.0 | #1 lever: k-candidates-favor-the-tail, ~1.6-2.1× diversity |
| smixs/creative-director-skill | `npx skills add smixs/creative-director-skill` | verify | drop-in diverge-then-converge tri-lens engine + anti-cliché corpus |
| MadeByTokens/claude-brainstorm | clone (hook) | verify | PreToolUse hook blocks premature solutioning |
| UditAkhourii/adhd | clone | verify | isolated parallel idea branches + critic prune |
| davila7/claude-code-templates (scientific-brainstorming) | `npx claude-code-templates@latest` | **MIT (confirmed)** | morphological + TRIZ + biomimicry combinators |
| jayolson/divergent-association-task | clone (py) | PNAS 2021 | novelty scorer (embedding distance) — the "are these actually different?" gate |
| Jeffallan/claude-skills (the-fool) | clone | verify | constructive STRESS-TEST (steelman → pre-mortem → red-team) |
| jakedahn/oblique-skill | clone | verify | random-constraint lateral jolt mid-task |

## VISUAL PERCEPTION — QUICK-WIN STACK INSTALLED ✅ (06-21, this machine → `../visual_gate/`)
*(makes Claude SEE & not lie about visual success — see `../VISUAL_PERCEPTION_LAYER.md`, 44 free tools tier-tagged in `../visual_skills.json`, runbook in `../visual_gate/README.md`). The GATE: canary → capture right view → deterministic anchor → refute-biased VLM judge → pass ONLY if zero defect.*

**Installed + verified:**
| Tool | Tier | Status | Role |
|---|---|---|---|
| `GATE_PROMPT.md` (`claude -p` separate-critic) | T1 | ✅ **keystone, written** | turns "looks good" into defect-hunting default-FAIL verdict |
| Perception **canary** (`make_canary.py`) | T1 | ✅ **VALIDATED** (vision reads token+shapes) | makes vision-blindness LOUD (`PERCEPTION-BLIND`) vs certifying unseen images |
| ffmpeg 8.1.1 | T2 | ✅ winget | video→frame/contact-sheet+blackdetect (contact-sheet smoke passed) |
| Pillow / PyMuPDF / pdf2image / pytesseract | T2 | ✅ pip — the gate venv at `<PYTHON>` (imports verified 2026-07-16) | img handling · PDF→PNG (no binary via fitz) · OCR-vs-source |
| Tesseract 5.4 | T2 | ✅ winget — **NOT on PATH**: use `C:\Program Files\Tesseract-OCR\tesseract.exe` via `pytesseract.pytesseract.tesseract_cmd` | OCR engine behind pytesseract |
| odiff-bin + pixelmatch + pngjs | T2 | ✅ npm (`visual_gate/`) | the un-rationalizable regression NUMBER vs baseline |

**Not installed:** Playwright+chromium = on-demand (`npm i -D playwright && npx playwright install chromium` when a web project needs it; trap: defaults to ARIA-tree not pixels) · itrimble/image-viewer-mcp = on-demand (needs MCP-config wiring) · **Ollama+Qwen2.5-VL-7B = DECIDED SKIP (06-21)** — models are GB; the gate judge is `claude -p` (higher quality, already available). Only revisit for offline / zero-API-cost judging.

Per-modality detectors (install as the project needs): pdfplumber (PDF overflow/clip), pytesseract (OCR-vs-source garbled-text FAIL), MediaPipe Pose (foot-slide numeric gate), trimesh/Open3D/PyMeshLab (mesh watertight/manifold), recast-navigation-js + rapier (navmesh reachability + ground-settle), CLIP-IQA/LPIPS/Q-Align (gen-image quality), VMAF/WhisperX (video quality + caption-sync). **SKIP:** vidlens-mcp / screen-view-mcp (paid outbound), visual-explainer, NIQE/BRISQUE (low signal).

## DISCOVERY HUBS (keep mining for new skills)
- travisvn/awesome-claude-skills (filters commercial-funnel) · ComposioHQ/awesome-claude-skills · VoltAgent/awesome-agent-skills · VoltAgent/awesome-claude-code-subagents

## EXCLUDE (security)
- **hermes-agent-self-evolution** + the whole hermes-agent family — key-stealer / backdoored LiteLLM. Pattern fine; repo is not.
- Any wallet/keypair skill that transmits a secret key off-device.

## CANDIDATES — VETTED & RE-CALIBRATED (06-21 — full detail in `../VETTING_REPORT.md`, rubric in `../SKILL_VETTING_RUBRIC.md`)
The first workflow pass (wf wei490i1n) was over-strict — held inert/readable content at sandbox/reject for license-or-popularity reasons. **Re-verdicted by `SKILL_VETTING_RUBRIC.md`: verdict proportional to what each actually DOES** (T0 inert → T4 exfil). Same facts, calibrated.

| Repo | Tier | VERDICT | One reason |
|---|---|---|---|
| **multica-ai/andrej-karpathy-skills** | T0 | **✅ USED — principles paraphrased + credited in `_TEMPLATE/CLAUDE.md`; text NOT redistributed** | inert markdown, injection-scan clean. **No LICENSE file upstream** — fine to read and apply, not to ship the file. |
| mukul975/Anthropic-Cybersecurity-Skills | T0 skills/ · T2 tools/ | **USE skills/ markdown selectively; leave tools/** | Apache real; defensive knowledge = T0, offensive executables = don't run. Separate the parts. |
| Egonex-AI/Understand-Anything | T1/T3 | **USE skill-only** — copy plugin markdown, pin commit, skip install.sh, disable auto-fire hooks | MIT, source byte-clean; only risk = auto hooks + git-pull updater. Neutralize → use. |
| eyaltoledano/claude-task-master | T2/T3 | **NEUTRALIZE-then-use** — `anonymousTelemetry:false`, then npm install | readable + SLSA-signed; telemetry default-ON ships prompt I/O. Off the flag → high-value task layer. |
| giancarloerra/SocratiCode | T2/T3 | **DECIDED SKIP (06-21)** — drags Docker+qdrant+Ollama+model for marginal gain; native `Read`/`Grep`/`Explore` already covers code comprehension. Revisit only for a huge unfamiliar codebase. (was: use local-only, pin version) | src readable; AGPL local-only. |
| colbymchenry/codegraph | T3 | **SANDBOX first** (genuinely) | opaque prebuilt bundle you'd run + telemetry default-ON. Real "can't inspect" → isolate. Not over-strict. |
| mvanhorn/last30days-skill | T2/T4 | **SKIP — role mismatch** (not fear) | reads X/TruthSocial cookies+JWT (its function), but fit=2: researches external topics, not local resume. |
| Glint-Research/Fable-5-traces | T4 | **REJECT** (legit) | uninspectable + AGPL §13 + distilled Claude/Fable-5 = ToS taint + traces likely embed live secrets/injection. Positive bad finding. |

**Decision (aligned with the 06-21 owner doctrine "execution-safe → just install", per CLAUDE.md EQUIP):** Karpathy principles in (paraphrased, credited — the no-LICENSE file itself is not redistributed). mukul975 skills/ + the neutralize-then-use repos (Egonex, task-master) = **NEUTRALIZE-then-install automatically at the next EQUIP that needs them** — no per-repo owner greenlight required; the neutralize step (pin commit / telemetry-off / skip installer) IS the gate. Owner greenlight stays required ONLY for genuine-risk tiers: codegraph (T3-opaque → sandbox) and any T4. SocratiCode = DECIDED SKIP (fit). last30days skip (fit). Fable reject. **Pending (GitHub API rate-limited since 06-21):** inspect Egonex plugin internals + mukul975 skills/ list via raw-fetch before copying, to confirm the T0/T1 markdown subset — do this AT the EQUIP that first needs them.

## DOCTRINE
- **`../WORKFLOW_PATTERNS.md`** = the 6 Dynamic-Workflow patterns (classify-and-act / fan-out-synthesize / adversarial-verify / generate-and-filter / tournament / loop-until-done) + failure-mode→pattern map + /goal//loop + quarantine + save-as-skill. The machine's orchestration brain — every workflow picks the pattern SHAPE that prevents its failure mode (doctrine #4 governs spend: Opus, no caps).

## NEXT
The 8 owner candidates = VETTED (above). The "TO INSTALL" tables install **on-demand at EQUIP time** — when a project's study flags a need, vet-then-install per the Decision rule above (safe/neutralizable = automatic; T3-opaque/T4 = owner gate). Anything still marked "verify" gets its LICENSE byte-read at that moment. The byte-confirmed-MIT ones (promptfoo, claude-cookbooks, vercel-labs/skills, davila7) are the safest first installs.
