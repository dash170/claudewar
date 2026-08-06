# claudewar

**A prompt-authoring machine for Claude Code.** One Claude writes the operating prompt and the project folder. A *different* Claude builds it, full-auto, until it ships.

Most agent setups fail the same way: someone writes a paragraph of intent, the agent starts coding immediately, and forty minutes later it reports success from inside the same context that produced the failure. claudewar puts a **manufacturing process** in front of that — the prompt is a deliverable with its own definition of done, its own quality gate, and its own retro.

---

## The core idea: split the author from the builder

You do not brief an agent. You **author an operating prompt**, then hand it to a builder that has never seen the conversation.

```
        AUTHOR Claude                              BUILDER Claude
   (opened at claudewar root)                  (opened in the project dir)
                                    hand off
  intake → study → materialize  ─────────────▶  reads the operating prompt
  → tighten → eval gate ≥ 85                    → builds non-stop to SHIP
                                                → self-improves each milestone
             ▲                                                │
             └──────────── retro: the machine learns ─────────┘
```

Why the split matters: the builder starts on a **clean context seam**. It has no memory of the hesitations, the abandoned approaches, or the half-formed assumptions that produced the prompt. It reads a self-contained document and executes. Nothing structural enforces this — it is a discipline, and it is the single cheapest quality lever in the repo.

---

## The workflow, in six steps

Each step has a **definition-of-done artifact**. A step is not done until that artifact physically exists on disk. No step advances on vibes, and none is skipped under time pressure or context compaction.

**1 · INTAKE** — classify the request: type, greenfield or existing, stakes, clarity. Ask the human only what genuinely cannot be inferred.

**2 · STUDY** — run a deep-study workflow that fans agents across every axis (human/market, references, tech, risk, team, ship gate, build ladder), adversarially verifies what they return, and closes the gaps. Output: a project brief citing **real named sources**, not impressions.
> *Gate:* the brief must exist and cite real signals. If the study cannot run, you fan the agents by hand — you never quietly downgrade to a one-shot draft.

**3 · MATERIALIZE** — copy the project template, then fill it from the brief: the operating prompt, the status file, the plan, the constitution, the rails, and a team of role subagents tailored to the project type.
> *Gate:* the full file set exists and **zero `{{placeholder}}` survives**. A half-filled folder is a failed run, not a partial success.

**4 · TIGHTEN** — one micro-loop over the generated prompt, then an automated score:
```bash
node tests/eval_prompt.js projects/<name> --gate 85
```
The rubric is falsifiable: is the ship gate written in EARS form with a **named evidence artifact**? Is the grounding signal actually runnable? Are the rails and the safety hook wired? Zero placeholders? A minimal-covering team — a maker, a *separate* critic, a human lens? Below 85, the breakdown names exactly what to fix.
> *Honest scope:* this is a **structural** completeness gate. It proves the prompt has its load-bearing parts. It does not prove the project will succeed.

**5 · HAND OFF** — the human opens a fresh Claude Code in the project directory and points it at the operating prompt. The author's job ends here.

**6 · RETRO** — mandatory, never skipped. Append what the run taught to the lessons file; fix the template or the doctrine **now** for anything the builder had to work around; commit. *The machine self-improves or it rots.*

---

## What gets baked into every authored prompt

**Rails that a long run cannot argue with.** A `CONSTITUTION.md` the run is not allowed to rewrite, a deny-set in settings, and a `PreToolUse` hook that enforces semantics the literal deny-set can't. Keeping the immutable rails in a *separate file* from the mutable plan matters: an autonomous run will happily loosen its own instructions to make its life easier. Where both speak, the stricter wins.

**A falsifiable definition of done.** Every ship-gate clause reads `WHEN <condition> THE SYSTEM SHALL <behaviour>` and names the artifact that proves it. "The feature works" is not a gate. A measured number with a file next to it is.

**A grounding signal.** Every project type has one runnable command that says green or red — tests, a smoke suite, a pipeline, a reproduction. `verify.sh` runs it and writes a machine-readable result. Claims are checked against that, not against the agent's confidence.

**A perception gate for anything visual.** Capture the artifact, run a perception canary, then hand it to a **fresh, refute-biased critic** that defaults to FAIL and must list defects. The milestone passes only on `verdict=PASS` with `defects=[]`. `UNCERTAIN` blocks. This exists because "looks good" is the most common lie in agent output.

**A separate critic, always.** The role that makes something never signs off on it. The team assembler puts a maker, an independent critic, and a human/market lens on every project — the lens can veto.

**A tool-vetting rubric.** Should you install this skill, MCP server, or model? A T0–T4 verdict **proportionate to the actual risk**, so safe-and-inert things get installed instead of blanket-refused, and only genuine exfiltration risk goes to a human.

**A self-improvement loop.** A micro loop that tightens each milestone, and a macro loop that runs to ship. A blocker is logged and routed around, not treated as a stop.

---

## Two modes

**Greenfield** — the six steps above produce a runnable project folder from an idea.

**Existing project** — the machine installs as an **additive overlay**. It maps the codebase first, studies only the remaining work, and adds the missing layers on top. It never scaffolds over existing code, never blanks an existing status file, and grounds on the project's *real* build and test commands. If a project already has its own driver, that driver stays the operating prompt and only the missing machine layers are added.

---

## What you get in the repo

| Piece | What it is | Time to value |
|---|---|---|
| **`projects/_TEMPLATE/`** | The project skeleton: constitution, operating prompt, status, plan, safety hook, `init`/`verify`. Copy it and fill it. | ~10 min |
| **`visual_gate/`** | The refute-biased judge prompt + a perception canary generator. Drop-in for any project that renders anything. | ~30 min |
| **`tests/eval_prompt.js`** | Scores an authored prompt against the falsifiable rubric. This is what makes step 4 objective. | immediate |
| **`SKILL_VETTING_RUBRIC.md`** | T0–T4 install decision for skills, MCP servers and models. | read once |
| **`workflows/study-project.js`** | The step-2 deep-study front end. | — |
| **`references/LESSONS.md`** | Append-only retro memory. Every entry is a scar. | read once |
| The long docs | `UNIVERSAL_BUILD_MACHINE.md` (the spine), `TEAM_AND_HUMAN_LAYER.md` (team + human lens), `WORKFLOW_PATTERNS.md`, `VISUAL_PERCEPTION_LAYER.md`, `arsenals/` (convergent + divergent prompting research). ~150 KB of *why*. | you don't need it to start |

---

## Three ideas worth stealing even if you never clone this

**The canary proves the channel, not the artifact.** Before asking a model to judge an image, hand it a generated test image whose correct answer you already know — and keep that answer somewhere the judge **cannot read**. If it can find the expected answer next to the image, it will use it, and you have proven nothing. If it fails the canary, its verdict on your real artifact is meaningless. Almost every "the AI reviewed my UI" setup skips this and never discovers the vision channel was degraded.

**Refute-bias beats approval-bias.** A judge asked *"is this good?"* says yes. The same model asked *"find what is wrong, default to FAIL, list every defect"* finds real ones. Identical capability, opposite outcome, one line of prompt.

**A gate that is always red gets ignored — and then hides the next real failure.** If a check has been failing for weeks on known-irrelevant noise, nobody reads it any more, and the first genuine breakage arrives invisible. Scope gates to what actually ships, or they train you to look away.

---

## Install

**Requirements:** [Claude Code](https://claude.com/claude-code), Node 18+, Python 3.10+.

```bash
git clone https://github.com/<you>/claudewar
cd claudewar
```

That is the whole install for the authoring machine — it is markdown and two scripts. Only the
visual gate has dependencies, and only if you intend to judge images, video or documents:

```bash
cd visual_gate
npm i                                   # pixel-diff tooling
python -m venv .venv                    # keep the gate's Python self-contained
.venv/Scripts/python -m pip install -r requirements.txt     # Windows
# .venv/bin/python -m pip install -r requirements.txt       # macOS / Linux
cd ..
```

> ⚠ **`npm i` must run at the destination.** `odiff-bin` ships a platform-specific binary that does
> **not** travel when you copy the folder somewhere else. This is the number-one first-run failure.

**Optional system tools**, only for the modalities that need them — neither is installable via pip:

| Tool | Needed for |
|---|---|
| `ffmpeg` | video: frame extraction, contact sheets, black-frame detection |
| `tesseract` | documents/UI: OCR-vs-source comparison to catch garbled text |

### The five path placeholders

Some docs quote **absolute** paths on purpose — a builder Claude working on a project *outside*
this repo cannot resolve a relative one. Those paths are shipped as placeholders. Substitute them
mentally, or run a one-time find-and-replace with your own values:

| Placeholder | What to put there |
|---|---|
| `<CLAUDEWAR>` | absolute path to your clone of this repo |
| `<CLAUDE_SKILLS_DIR>` | your Claude Code skills directory — `~/.claude/skills` |
| `<CLAUDE_HOME>` | your Claude Code config directory — `~/.claude` |
| `<PYTHON>` | the Python interpreter that has the visual-gate deps (`visual_gate/.venv/…`) |
| `<PYTHON_VENV>` | that virtualenv's root |

Nothing breaks if you leave them: they appear in prose and examples, never in executed code.

---

## Tutorial 1 — author and build a project

**Step 1. Open Claude Code at the claudewar root.** `CLAUDE.md` loads automatically and puts Claude
in *author* mode. It will not build anything here; that is the point.

**Step 2. Ask for a project.** Plain language, any phrasing:

> *"Author a project for a CLI that converts subtitle files between formats."*

Claude now runs the six steps. Expect it to ask a couple of questions it genuinely cannot infer
(stakes, audience, constraints), then to spend real time on the study before writing anything.

**Step 3. Watch for the artifacts, not the prose.** Each step is done when a file exists:

| Step | Artifact you should see appear |
|---|---|
| STUDY | `projects/<name>/PROJECT_BRIEF.md`, citing real named sources |
| MATERIALIZE | the full template file set, **no `{{placeholder}}` left anywhere** |
| TIGHTEN | an eval score ≥ 85 |

If a step announces success without its artifact, that run is wrong — say so and make it finish.

**Step 4. Check the prompt yourself before you build.**

```bash
node tests/eval_prompt.js projects/<name> --gate 85
```

Exit code 0 means the prompt has its load-bearing parts. The per-check breakdown names exactly
what is missing when it fails. Run it with no arguments to score every project you have authored.

**Step 5. Hand off to a fresh builder.** This is the step people skip, and it is the one that pays:

```bash
cd projects/<name>
claude          # a NEW session, in THIS directory
```
Then tell it: **"read `PROJECT_OPERATING_PROMPT.md` and go."**

Opening Claude *inside* the project folder is what makes it auto-load that project's `CLAUDE.md`,
its subagents in `.claude/agents/`, and its rails in `.claude/settings.json`. Opening it at the
repo root instead gives you the author again, and none of that wiring.

**Step 6. Let it run, then retro.** The builder works its plan, verifying against the project's own
grounding signal. When you come back, have the author append what the run taught to
`references/LESSONS.md` — and fix the template immediately for anything the builder had to work
around. A machine that does not record its scars repeats them.

---

## Tutorial 2 — run the visual gate

Use this whenever a milestone produces something you can *look at*: a UI, a rendered frame, a chart,
an exported document.

**Step 1. Generate the canary and keep its answer away from the judge.**

```bash
visual_gate/.venv/Scripts/python visual_gate/make_canary.py <workdir>
```

This writes `canary.png` into `<workdir>` and prints the expected answer **to stdout**. You — the
runner — keep that. Never write it to a file the judge can read: given the chance, the judge will
read the answer instead of looking at the image, and you will have proven nothing.

**Step 2. Capture your artifact in-engine, at real scale.** A cropped asset is not proof. Capture
what the user would actually see.

**Step 3. Normalise every judged image** to the canary-safe envelope: opaque plain PNG, ≤1 MB,
≤ ~1.15 MP. Flatten transparency, downscale oversized captures. This matters more than it sounds —
a large or transparent image can silently fail to reach the model while the small canary sails
through, and you would read that as a pass.

**Step 4. Judge in a fresh session with no stake in the result.**

```bash
claude -p "$(cat visual_gate/GATE_PROMPT.md)"   --attach <workdir>/canary.png   --attach <workdir>/artifact.png
```

Add your milestone rubric — the specific things this artifact must get right.

**Step 5. Read the verdict literally.** The judge returns JSON:

| Verdict | Meaning |
|---|---|
| `PASS` with `defects: []` | the only green light |
| `FAIL` | defects listed and localised — fix them |
| `UNCERTAIN` | **blocks.** It could not confirm; that is not a pass |
| `PERCEPTION-BLIND` | it could not read the canary. Its opinion of your artifact is worthless — fix the transport and rerun |

Never promote `UNCERTAIN` to a pass because the picture looked fine to you. The whole point of the
gate is that your own eyes are the thing being checked.

---

## Tutorial 3 — adopt an existing codebase

The machine installs as an **additive overlay**. It will not scaffold over your code.

Open Claude Code at the claudewar root and point it at the project:

> *"Use claudewar on the existing project at `/path/to/repo`. Goal: <what you want next>."*

What happens: it maps the codebase by reading it, studies **only the remaining work**, then writes
the overlay files into your repo — a `CLAUDE.md`, a `STATUS.md` seeded from the real current state
(merged with any status file you already have, never blanked), a plan of what is left, the rails,
the subagent team, and `init`/`verify` wired to *your* real build and test commands.

If your project already has a driver document, that stays the operating prompt. Only the missing
layers are added on top.

Then build it the same way: fresh Claude Code, inside your repo.

---

## What this is not

- **Not a framework.** No runtime, no SDK, no lock-in. Files you copy and edit.
- **Not model-agnostic in practice.** Built and proven on Claude Code. The ideas port; the layout assumes it.
- **Not a replacement for tests.** It catches what tests structurally cannot: an agent's confidence in its own broken output.
- **Not zero-effort.** The visual gate needs a capture path in *your* project. Nobody can supply that for you.
- **Not finished.** It is a working method, corrected by whatever broke last.

---

## Repo map

```
CLAUDE.md                       the author driver — the six steps + precedence canon
UNIVERSAL_BUILD_MACHINE.md      the spine: intake router → template → harness → grounding
TEAM_AND_HUMAN_LAYER.md         per-project team assembler + the vetoing human lens
VISUAL_PERCEPTION_LAYER.md      the full design behind visual_gate/
WORKFLOW_PATTERNS.md            orchestration patterns — pick the shape that prevents the failure
SKILL_VETTING_RUBRIC.md         should I install this? T0–T4
arsenals/                       convergent (correct) + divergent (original) prompting research
machine_*.json                  role library · per-type teams · capability resolver
skills/prompt-master/           the loop + self-improvement + imagination mode
visual_gate/                    GATE_PROMPT.md is the keystone
workflows/study-project.js      step-2 deep study
projects/_TEMPLATE/             copy this to start
tests/                          the prompt eval gate + the safety-hook tests
references/LESSONS.md           append-only retro memory
```

---

## Contributing

The most valuable contribution is **a retro**: something that broke, why the existing rails missed it, and the rule that would have caught it. Add it to `references/LESSONS.md` and open a PR. A rule with a scar is worth ten rules with a rationale.

## Credits

The *Code discipline* block in `projects/_TEMPLATE/CLAUDE.md` paraphrases the four coding-guideline
principles from [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills).
That repo ships no LICENSE file, so the original text is **not** redistributed here — only a credited
restatement. Fetch the upstream yourself if you want it verbatim.

## Licence

MIT. See `LICENSE`.
