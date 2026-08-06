# claudewar / workflows — saved machine workflows

Reusable workflow scripts = the machine's components. Run with `Workflow({ scriptPath, args })`.

## study-project.js — STEP 0 of the generator (the deep-study front end)
**When:** before authoring any operating prompt, to make it the most complete possible.
**Run:** `Workflow({ scriptPath: "…/workflows/study-project.js", args: { idea: "<one-paragraph project description>", type?: "game|web-app|trading|…", constraints?: "…" } })`
**⚠ Known platform gotcha:** `{scriptPath}` invocation may NOT wire `args` (the script throws "pass args.idea"). Recovery: invoke the workflow by NAME with args, or temporarily inline `const idea = "…"` for the single run, then revert.

**What it does** (fan-out → adversarial-verify → completeness-critic → synthesize):
1. **Study** — one agent per aspect, grounded on REAL free signals (not vibes): human/market (JTBD + demand), references/benchmark, tech feasibility+stack, free-gen capability map, risk/falsification (bear case), role team, ship-gate(EARS)+grounding signal, phase ladder.
2. **Verify** — 3 BATCHED skeptic verifiers (themed groups: market+refs+risk / tech+free-gen / team+gate+ladder) refute the studies (kills synthetic optimism; batched per owner preference, not per-aspect).
3. **Close-gaps** — a completeness critic (given the canonical 8-aspect list + any MISSING aspects) finds missing/unverified aspects → one more parallel study round on them.
4. **Synthesize** — returns `{ doc (PROJECT_BRIEF.md), operating_prompt_draft (filled _TEMPLATE), go_verdict, ship_gate_ears, team_topology, capabilities, open_unverified }`. Retried once on failure; on double failure returns `{ brief: null, aspects, gapFindings, missing }` so the prompt-author hand-synthesizes without journal archaeology.

**Output handling (prompt-author Claude):** the workflow RETURNS the brief; it does NOT write files (scripts have no FS). The prompt-author then MATERIALIZES the project folder: copy `_TEMPLATE/` → `projects/<name>/`, write `PROJECT_BRIEF.md`, finalize `PROJECT_OPERATING_PROMPT.md` + `STATUS.md` + `PLAN.md` from the draft, write the role subagents into `.claude/agents/`, run one prompt-master MICRO loop to tighten — then hand the folder to the builder Claude.

This is the front half of the UNIVERSAL_BUILD_MACHINE generator (STEP 0 → feeds STEP 5 EMIT).
