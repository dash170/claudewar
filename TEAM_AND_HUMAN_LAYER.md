# TEAM_AND_HUMAN_LAYER.md

*The per-project TEAM assembler + reusable ROLE library + HUMAN/market-empathy lens + FREE-generation capability resolver for CLAUDEWAR. This is the layer that sits ON TOP of the SPINE (`UNIVERSAL_BUILD_MACHINE.md`): the spine already owns intake/routing, per-type operating templates, the universal harness, the grounding-signal selector, the auto-prompt generator (SUPERSEDED naming: the `/new-project` skill was never built — the generator IS CLAUDE.md's 6-step INTAKE→…→RETRO pipeline; see UBM §120), the orchestration selector (cost-ranked rungs 1-6), cross-project memory, and the safety rails. This doc supplies only what the spine defers: when a build escalates past a solo agent (spine rung 4-5), WHICH roles get assembled, in WHICH topology, at WHICH model tier, equipped with WHICH free capabilities, and how a single Human/market lens veto is wired into the ship gate. It reuses the prompt-master `<self_improvement_loop>` + IMAGINATION MODE verbatim — it does not restate them.*

---

## TL;DR — team + human + free-gen in one view

- **Two-Claude split is a hard rule, not a nicety.** A generator↔critic separation across a context boundary measurably lifts quality (separate-critic ≈ +7% accuracy / fewer hallucinations vs same-agent self-critique; https://openreview.net/pdf?id=zj7YuTE4t8). So: the **prompt-author Claude** runs the ASSEMBLER (plans the team, writes the role `.md` files to disk), and a **separate builder Claude** opens the project and the on-disk team auto-delegates. The assembler must therefore emit FILES (`.claude/agents/*.md` + a TEAM block in `STATUS.md`), not just in-context plans.
- **Every role compiles to one native Claude Code subagent** — a Markdown file with YAML frontmatter (`name`, `description`, `tools`, `model`) and the body as system prompt; the lead auto-routes on `description` (https://docs.anthropic.com/en/docs/claude-code/sub-agents). The assembler's job is to fill a canonical Role-spec and render it to that file.
- **Eco by construction.** Full multi-agent burns ~15x single-chat tokens (https://www.anthropic.com/engineering/multi-agent-research-system), so the assembler DEFAULTS to a solo builder and climbs a 4-rung ladder only on a logged trigger. "Minimal team that covers": a DROP rule kills any role the lead could produce inline; an ADD rule admits a role only when a gate fails for a named missing capability. This refines — never replaces — the spine's orchestration selector.
- **HUMAN/market-empathy lens is a mandatory, grounded, vetoing role** for any human-facing artifact (game/product/content/niche), skipped for pure infra/library/trading-internals. It runs a 6-step procedure (FRAME the job → GROUND on a real free signal → CALIBRATE a persona panel ON that signal → SCORE appeal/features → BEHAVIORAL pay/fun test → GATE on agreement) and is calibrated against real data, never vibes — because synthetic persona panels mode-collapse and skew over-positive (https://arxiv.org/abs/2503.16527).
- **FREE-generation resolver** maps any capability (image/3D/video/audio/voice/STT/rig/scrape/finetune/local-LLM) to a free/OSS stack, stands up ONE generative backend (ComfyUI; https://github.com/comfyanonymous/ComfyUI), routes by VRAM tier, and gates every output through a mandatory conditioning + asset-QA node. Never a paid tool; paid is listed separately only where no free path exists.
- **One ship owner.** Workers return summaries + a pass/fail self-report; only the lead ships, after the harness is green and the critique gate passed — with the Human-lens veto as the final gate above the lead: **MANDATORY for any human-facing artifact type** (product/game/content/niche, per the roster's HUMAN-lens conditional), n/a for non-human-facing types (trading/ETL/infra).

---

## TEAM ASSEMBLER — how each project gets a precise team

The assembler is a deterministic, idempotent, re-runnable function the **prompt-author Claude** executes after spine intake/route and before the build. It consumes the spine's `{type, mode, methodology, stakes}` tag plus a complexity score, and emits a **team manifest** (roles + topology tag + model tiers + tool grants) to disk. It is the concrete realization of the VoltAgent `agent-organizer` pattern (https://github.com/VoltAgent/awesome-claude-code-subagents/blob/main/categories/09-meta-orchestration/agent-organizer.md), hardened with an explicit token-budget/model-router clause the original lacks.

### Inputs
- `type` (from spine Q2): web-app / game / trading / data-automation / content / research / infra / other.
- `complexity = #domains × scope × novelty × risk` (a 4-factor score; high on any cross-domain build, e.g. a cross-domain build = game + web-app + token-economy + LLM-NPC).
- `quality bar` (from the spine ship gate) and `stakes` (Q4 reversibility, Q6 perf/security).

### Step 1 — SIZE (cost-aware ladder; default = no team)
Climb only when the lower rung **demonstrably** fails and the reason is logged (Anthropic "simplest thing that works"; the 15x cost IS the gate). This is the team-sizing refinement of the spine selector, calibrated to Anthropic's research ladder (~1 agent simple / 2-4 comparison / 10+ complex; https://www.anthropic.com/engineering/multi-agent-research-system) — but those numbers are research-query-tuned, so CLAUDEWAR treats them as a starting prior to be re-measured per project type.

| Rung | Shape | When | Roles |
|------|-------|------|-------|
| 0 | **Solo builder** | trivial / single stack / clear scope (most data-automation, libs, small web) | 1 builder, loop-to-ship |
| 1 | **Builder + critic** (evaluator-optimizer) | quality-critical artifact, single domain | 2 roles across a context seam |
| 2 | **Lead + 2-4 workers** (one pillar) | medium, one stack, a real gate the lead can't self-cover | lead + builder + reviewer/QA + (1 specialist) |
| 3 | **Lead + 6-10 in named pillars** | large / cross-domain (game, full product, multi-pillar) | lead + design/build/quality/safety/human pillars |

### Step 2 — TOPOLOGY (pick from the 5-pattern menu, after sizing)
The canonical menu (https://www.anthropic.com/research/building-effective-agents): prompt-chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer. Decision rule:
- **Fixed known stages** (research→spec→build→test; ETL extract→transform→validate; trading hypothesis→backtest→validate→paper) → **prompt-chain**.
- **Unpredictable subtask count** (most app/game builds) → **orchestrator-workers**.
- **Quality-critical artifact** → wrap any role in **evaluator-optimizer** (the maker↔critic loop, which IS the two-Claude split and the prompt-master MICRO loop made into two subagents).
- **Independent facets** (art vs netcode vs economy; N research strands) → **parallelize** with an explicit count.
- **Classify-then-specialist** intake → **routing** (rarely needed; the spine intake already routes).
The chosen tag is written into `STATUS.md` so the spine orchestration selector consumes it; it never re-decides shape.

### Step 3 — FILL ROLE SLOTS (from the library, minimal covering set)
Select from the ROLE LIBRARY by required capability. Always include, per active pillar: **one maker + one independent critic** (separate context; this is the +7% lever). For any human-facing artifact, always include the **HUMAN-lens** role. **Scan first, author last:** before writing a new role, run the free-skill scan (skills.mp / ClaudeSkills / GitHub) and the in-env skills (`/code-review`, `/security-review`, `prompt-master`, `strategy-validator`, `awwwards-site`, `ui-ux-pro-max`) to see if a slot is already covered — vendor + adapt rather than re-derive (eco).

- **DROP RULE:** remove any role with no distinct deliverable, no decision authority, or whose output the lead can produce inline. Minimal team that covers.
- **ADD RULE:** add a role only when (a) a milestone gate fails for lack of a named capability, or (b) a single context is overloaded across unrelated domains (e.g. one agent juggling netcode + economy + art).

### Step 4 — MODEL TIER
> **SUPERSEDED (2026-07-17) by CLAUDE.md CANON #4 / doctrine #4.** The old wshobson Haiku/Sonnet/Opus complexity-router below is HISTORICAL rationale, not the rule. **Live rule: every assembled role = OPUS by default; token cost is NOT a constraint.** A role may drop to a smaller model ONLY for a genuinely-trivial, logged sub-call (e.g. a non-LLM VADER pre-rank, a pure grep-offload) — never for a load-bearing maker/critic/judge role. The canonical tables `machine_roleLibrary.json` / `machine_perTypeTeams.json` now stamp Opus everywhere; use them, not this router.
>
> ~~wshobson's map (superseded): Opus → lead/synthesis/HUMAN-lens/security/falsification/art-director; Sonnet → architect/builder/code-reviewer/QA/data-engineer/devops; Haiku → rote classification/scraping/asset-QA/fan-out/grep offload.~~ Kept only to explain where the old tiers came from.

### Step 5 — LEAST-PRIVILEGE TOOLS
Set each role's `tools:` to the smallest set that covers its mandate (planners read-only Read/Grep/Glob/WebSearch; builders full Read/Write/Edit/Bash/Git; reviewers diff + Read; QA Bash + Monitor). This is the per-role expression of the spine's least-privilege rail.

### Step 6 — EMIT TO DISK + DELEGATION BRIEF
Render each filled Role-spec to `.claude/agents/<role>.md` with frontmatter, write `description` so the builder lead auto-routes correctly, and write the lead's per-subagent **delegation brief** (objective / output format / tool budget / boundaries) — Anthropic's finding is that vague mandates cause duplicated/over-spawned work, so each brief is explicit. Write the TEAM block (roster, topology, model tiers, ship owner) into `STATUS.md`.

### Canonical Role-spec (the normalizer)
Libraries differ (VoltAgent vs wshobson vs CrewAI frontmatter), so the assembler transcodes every imported role into ONE machine-readable schema before emitting (CrewAI's Role+Goal+Backstory is the cleanest base; https://github.com/crewAIInc/crewAI):

```
name | mandate (goal) | backstory/lens | tools[] | model-tier | fires-when |
gates-it-owns | handoff-contract (what it returns) | source+license (attribution)
```

### Re-plan (runtime mutation)
Static `.md` subagents can't mutate mid-run the way CrewAI/LangGraph crews do, so the assembler RE-RUNS at milestone boundaries: it rewrites the `.claude/agents/` set when scope changes (a pillar finishes, a new domain appears). Anti-thrash guard: a role is only added/dropped if the scope delta is logged in `STATUS.md`; no rewrite without a recorded trigger.

### Hard caps (from the gaps — enforce at the orchestration layer, not prompt discipline)
- Claude Code subagents are effectively one level deep; **no recursive subagent spawn** — the lead coordinates deep pipelines.
- **Max fan-out count + max depth** are explicit (a recursive spawn + oversized tool return can multiply cost ~10x on top of the 15x baseline).
- Multi-agent (rung 3) requires BOTH booleans true: independent parallel directions exist AND output value justifies ~15x.

---

## ROLE LIBRARY

Reusable role-subagents. Each is authored once as a canonical Role-spec and adapted per project. Seeded by cloning + normalizing VoltAgent (100+ agents, 10 categories; https://github.com/VoltAgent/awesome-claude-code-subagents), wshobson (https://github.com/wshobson/agents), 0xfurai (https://github.com/0xfurai/claude-code-subagents), with the art-director and the HUMAN-lens/niche roles authored ORIGINAL (no strong free source). Vendor prompt text + attribute; do not import code deps; confirm each repo's license (VoltAgent/wshobson are MIT-style; Composio's SWE agent is under its repo's mixed license).

| Role (model) | Mandate | Tools | Lens | Fires-when |
|---|---|---|---|---|
| **team-assembler** (Opus) | Read intake/route, decompose goal into the MINIMAL covering role set, pick topology, assign model tiers + least-privilege tools, emit `.md` subagents + lead brief + TEAM block. Plans, never edits code. | Read, Grep, Glob, WebSearch | Eco-yet-ultracode (fewest roles that cover; no panels/votes) | ONCE at project start; again on scope change (re-plan) |
| **run-orchestrator / lead** (Opus) | Drive the build DAG full-auto: sequence handoffs, fan out parallel-safe roles with explicit counts, enforce STATUS.md SoT, run circuit-breakers/retries, OWN the single ship gate, never pause to ask. | Task spawn, Bash, Read, Write, Monitor | Non-stop-until-ship (autonomous build doctrine) | Continuously across the build lifecycle |
| **architect** (Sonnet/Opus) | Produce system design, module boundaries, data model, interface contracts + a perf/scaling/network budget BEFORE any code; constrain stack to FREE/OSS. Contracts become the builder's acceptance spec. | Read, Grep, Glob, WebSearch | 3D-game perf mandate (flag draw-calls/replication/memory/streaming up front) | FRAME→GROUND gate before build; on any architecture-changing diff |
| **builder / implementer** (Sonnet) | Execute the authored prompt end-to-end: read repo, edit code, run tests, iterate to green, self-fix each milestone. Split EDITOR vs CODE-ANALYSIS (Composio pattern; https://github.com/ComposioHQ/composio/tree/master/python/swe/agent) only when "find the code" ≠ "change the code". | Read, Write, Edit, Bash, Git, repo-index | Ship working software; smoke must not regress (494/0) | DRAFT→ship inner loop, non-stop |
| **code-reviewer** (Sonnet) | Diff-scoped review: correctness bugs FIRST, then reuse/simplify/efficiency/altitude. Block on real bugs; propose eco-consolidation. Cheapest as the built-in `/code-review` skill; escalate to subagent on security/arch diffs. | Read, Grep, git diff | Eco-yet-ultracode (kill duplication, inline over ceremony) | On every diff, before the QA gate |
| **qa / test-engineer** (Sonnet) | Turn contracts into a test plan, write+run unit/integration/e2e, own the universal smoke harness, HARD-GATE merges on green. | Bash, Read, Edit, Monitor | Regressions block ship; run tests LIVE yourself, never hand to user | After every builder milestone |
| **playtester** (Sonnet, game variant of QA) | Drive the real app live (cvars+logs, POV/FPS capture, boot-smoke) and score game-FEEL, not just pass/fail; administer GEQ items. | Bash, Monitor, Read | "Play it like ARK, looks like the game"; FUN is measurable | After each game build-slice |
| **security-reviewer** (Opus) | Audit authz/secrets/injection, threat-model the change, scan deps for CVEs, HARD-GATE anything touching money/keys/auth. Front-line = `/security-review` skill. | Read, Grep, Glob, dependency-scan Bash | Assume hostile input | Before ship on any security-surface diff (mint firewall, wallet/payout, admin) |
| **product / creative director — HUMAN lens** (Opus, web-enabled) | Judge every concept + playable/sellable milestone through today's real-human eyes (pleases / sells / fun NOW) vs named live competitors; own niche-finding + go/no-go; can VETO a green build. Runs the 6-step lens procedure. | WebSearch, Read, Bash (drive build) | game creative-framework + "run it like a real human" | At concept (niche pick) and at every FUN/SELL gate |
| **systems-designer** (Opus) | Spec loops/economy/progression/balance with concrete tuning tables for the builder (token-eco, Tower floors, survival loop vs ARK). | Write, WebSearch | Niche-fun + perf budget; study many games, stay UNIQUE | Design phase; re-fires on balance feedback |
| **art-director** (Opus) — ORIGINAL | Own visual identity + the free-gen asset pipeline; gate "premium / not-AI-looking". The bridge to the FREE-gen resolver (image→rembg→conform; TRELLIS/Hunyuan3D for 3D; Blender iso-render+atlas). | Write, WebSearch, gen scripts | Premium-or-reject; fixes "facade has no identity" class | Design phase; re-fires on art feedback |
| **falsification-quant / bear** (Opus) | Default to NO-TRADE and try to KILL every claimed edge: DSR / walk-forward / CPCV / regime tests, demand OOS proof, allowed to conclude "no edge". | Bash, Read, `strategy-validator` + `walk-forward-validation` skills | "ALL edges UNVALIDATED — hypotheses, never proven"; small-n/in-sample/survivorship = disqualifiers | On any trading/strategy/signal claim before paper or live |
| **risk-manager** (Opus) | Enforce position limits, R-multiples, drawdown caps, kill-switches; mandate paper-first + burner-only before any live capital. | Bash, Read, Monitor | Capital preservation > upside; size by validated EV only | Continuously on any paper/live loop; pre-deploy gate (downstream of the bear) |
| **data-engineer** (Sonnet) | Build reproducible ingestion (scrapers, market-data API pulls, dataset assembly), schema + caching, so analysis/backtests run on real fetched data. | Bash, Git, Read, Write, WebSearch | Zero paid infra; reproducible + leak-free | Whenever a project needs real data before analyst/quant work |
| **devops** (Sonnet) | Ship on FREE tiers only (Cloudflare Pages / owner VPS), wire CI + smoke harness, env/secret hygiene (mask+rotate keys). | Bash, Git, Read, Write | Zero paid infra; reproducible + cheap | At deploy; for the universal harness |
| **pain-classifier** (Haiku/Sonnet) | Tag scraped excerpts by frequency × intensity × willingness-to-pay against a SHARED taxonomy so signals compare across niches; VADER pre-rank before LLM-classify (eco). | Bash, Read, local-LLM | Real complaints, not vibes; token-saving pre-filter | During niche-discovery HARVEST |
| **capability-resolver / asset operator** (Haiku/Sonnet) | Run the free-gen backend: route a capability request to the right OSS stack by VRAM tier, run gen → conditioning → asset-QA, batch/queue/retry; reject off-spec. | Bash, Read, Write, gen scripts | Free-only; every output passes conditioning + QA before accepted | When any role needs a generated asset |
| **token-economy guardian** (Sonnet, lightweight) — ORIGINAL | Enforce the eco doctrine across the PROJECT, not per-agent: no panels/votes, cheapest passing model per role, kill duplicated work, hard fan-out cap, budget runaway stop. | Read, Monitor | Max quality per token; minimal team that covers | Continuously; hard-checks at each re-plan |

---

## Per-type team rosters

Each roster is the minimal covering set for the spine's per-type template; the assembler shrinks it toward solo when complexity is low and grows it only on a logged gate failure. Topology tag is written to `STATUS.md`.

- **web-app / SaaS** — **lead (Opus)** + architect (Sonnet) + builder (Sonnet) + code-reviewer (Sonnet) + QA/Playwright-smoke (Sonnet) + devops (Sonnet); CONDITIONAL: security-reviewer (Opus) only if auth/payments/PII, HUMAN-lens product critic (Opus) at concept + each shippable slice. **Topology: orchestrator-workers, sequential waves, with an evaluator-optimizer inner gate (builder ↔ code-reviewer ↔ QA).** Low-complexity CRUD collapses to rung-1 (builder + reviewer).
- **game** — **lead (Opus)** + systems-designer (Opus) + art-director (Opus, → free-gen resolver) + builder (Sonnet) + playtester (Sonnet, live cvars+logs) + perf-reviewer (Sonnet, 3D-game perf mandate) + **HUMAN-lens FUN-gate critic (Opus, web-enabled: GEQ + SteamDB benchmark)** + capability-resolver (Haiku/Sonnet). **Topology: orchestrator-workers; creative pillar (design+art) runs PARALLEL to the build pillar; an evaluator-optimizer FUN GATE wraps each slice.** Largest roster (rung 3).
- **trading / quant** — **lead (Opus)** + data-engineer (Sonnet, leak-free harness) + quant-implementer/builder (Sonnet) + **falsification-quant/bear (Opus, default NO-EDGE)** + risk-manager (Opus) + security-reviewer (Opus, keys/burner). NO art-director, NO HUMAN-lens (skip for internals). **Topology: prompt-chain (hypothesis → leak-free data → vectorized backtest+costs → robustness → paper-forward) wrapped in evaluator-optimizer, where the bear is the adversarial critic that must sign off before risk-manager allows any capital.**
- **data-automation / ETL** — **lead/solo-leaning (Sonnet)** + data-engineer (Sonnet) + builder (Sonnet) + contract-tester/QA (Sonnet, Great Expectations) + devops (Sonnet, orchestration/alerting); code-reviewer folded into the lead at low complexity. **Topology: prompt-chain (extract→transform→validate→orchestrate) with an evaluator-optimizer idempotency gate.** Frequently rung 0-1.
- **content / marketing site** — **lead (Opus)** + art-director (Opus, binds `awwwards-site` + free-gen heroes) + builder (Sonnet, Next.js static export) + **HUMAN-lens market-empathy critic (Opus, "not-AI-looking" + Desirability cards)** + perf/a11y QA (Haiku/Sonnet, Lighthouse) + capability-resolver (image/video/voice). **Topology: evaluator-optimizer as primary (builder ↔ art-director judge until it clears the Awwwards bar); orchestrator-workers only if multi-asset.**
- **research / analysis** — **lead/orchestrator (Opus)** + N fan-out searchers (Haiku/Sonnet, parallel, summary-only returns) + adversarial verifier (Sonnet/Opus, distinct from drafters) + synthesizer (the lead). Binds the `deep-research` skill. **Topology: orchestrator-workers + evaluator-optimizer (verifier), gated behind value ≥ 15x — the one type where parallel fan-out is the canonical Anthropic shape** (https://www.anthropic.com/engineering/multi-agent-research-system).

---

## HUMAN / market-empathy lens

The procedure the HUMAN-lens role (product/creative director critic) runs to judge like a skeptical real-2026 human in the target segment — **calibrated on a real free signal, never vibes.** Two tiers for eco: **lens-lite** (1 persona + 1 free signal) for low-stakes; **lens-full** (N-persona panel + multi-source grounding + behavioral test) for high-stakes go/no-go and FUN gates. It mirrors the owner's existing `director_review`/`art_review` virtual-self gates and the prompt-master IMAGINATION + critique loops — it does not re-derive them.

**Step 1 — FRAME the job (JTBD).** Convert the brief into "[who] is trying to [job] so that [outcome]" + 3-8 measurable desired-outcome statements, not features (Ulwick ODI; https://strategyn.com/jobs-to-be-done/). The prompt-author bakes these verbatim into the operating prompt's success criteria so the builder optimizes the human job.

**Step 2 — GROUND on a real free signal** (the anti-vibes step; pick by type, with a caching + circuit-breaker + "signal unavailable" fallback so a dead source degrades gracefully, never silently fakes data):
- products/apps → competitor review mining + LLM pain extraction (https://github.com/topics/review-analysis); Play Store low-star reviews (https://github.com/JoMingyu/google-play-scraper).
- games → Steam public review API (keyless read of full text/playtime/recommend; https://partner.steamgames.com/doc/store/getreviews) + SteamDB review% + concurrency (https://steamdb.info/).
- community demand → PRAW for Reddit (OAuth, rate-limited; https://github.com/praw-dev/praw) → keyless HN Algolia (https://hn.algolia.com/api) as fallback.
- trend timing → trendspyg / pytrends-modern (scrape-based forks; pytrends archived 2025; https://github.com/flack0x/trendspyg) + TikTok Creative Center 7d/120d delta (https://ads.tiktok.com/business/creativecenter/keyword-insights/pad/en).

**Step 3 — CALIBRATE a synthetic persona panel ON that signal.** Spin up N persona-subagents whose backstories are conditioned on the Step-2 evidence (the genagents interview-grounded design; https://github.com/joonspk-research/genagents) using silicon-sampling prompting — demographic/psychographic backstory + the real-signal quotes in-context, asked "react AS this person" (Argyle "Out of One, Many"; https://arxiv.org/abs/2402.18144). This is the per-project precise role team applied to the USER side.

**Step 4 — SCORE appeal + features.**
- appeal → each persona picks from the 118 Product Reaction Cards; report % positive + the top-5 word cluster (https://www.nngroup.com/articles/microsoft-desirability-toolkit/).
- features → Kano two-question classify (must-be / performance / delighter / indifferent / reverse); the operating prompt then orders the builder to ship ALL must-haves + ≥1 delighter and DROP "indifferent" work (https://www.kanosurveys.com/articles/about-kano).
- fun (games only) → GEQ subscales (Immersion / Flow / Competence / Positive-Affect / Tension / Challenge); low Flow/Competence/Positive-Affect = block ship (https://pure.tue.nl/ws/files/21666907/Game_Experience_Questionnaire_English.pdf).

**Step 5 — BEHAVIORAL pay/fun test (the hardest signal).** Fake-door / painted-door: deploy a landing page + "Upgrade/Join" button for the not-yet-built thing on free Cloudflare Pages (reuse the `awwwards-site` skill) and read real click→signup→deposit conversion (https://learningloop.io/plays/fake-door-testing). Opinion layers (steps 1-4) can't reveal willingness-to-pay; behavior can. CAVEAT: the bottleneck is traffic — a fake-door is worthless without eyeballs, and free channels (Reddit/HN self-promo) carry anti-spam friction, so this gate needs an ethical seeding plan (flagged in GAPS).

**Step 6 — GATE on agreement + calibration check.** Advance only if the appeal/feature/fun scores AND (for high-stakes) the behavioral conversion clear preset thresholds. **Mandatory guardrail:** before trusting the panel, validate panel output against the Step-2 real-signal distribution — LLM personas flatten into caricatures, mode-collapse, and skew over-positive (https://arxiv.org/abs/2503.16527); a "panel-vs-real delta" check (enforced by the spine harness) prevents the panel from manufacturing false product-market fit. The HUMAN-lens verdict can VETO a build even when tests are green, and feeds the FUN/SELL ship gate.

---

## FREE-generation capability resolver

Capability → free/OSS stack. **Never a paid tool.** The resolver stands up ONE generative backend (ComfyUI; the same headless server is reused for 2D/3D/video so the team runs one stack), is itself a **VRAM-tier router** (low/mid/high — probe the owner's GPU before promising any capability), runs a **batch/queue/retry job runner** (local gen is slow vs paid APIs, so nightly batch is required), and passes EVERY output through a mandatory **conditioning + asset-QA node** before acceptance. A **per-project license gate** ensures monetized products ship only commercial-clean models.

| Capability | Free/OSS stack | Notes / gate |
|---|---|---|
| **text→image** (sprites, icons, textures, key art) | ComfyUI (https://github.com/comfyanonymous/ComfyUI) running SDXL (OpenRAIL++) / Flux.1-schnell (Apache-2.0, commercial-safe) / Flux.1-dev (non-commercial); +LoRA/ControlNet/IPAdapter for pose/style lock | Default node; license gate: monetized → Flux-schnell, not Flux-dev |
| **image→3D / text→3D** (game/product mesh + PBR) | TRELLIS (MIT; https://github.com/microsoft/TRELLIS) + Hunyuan3D-2.1 (open weights, PBR) + InstantMesh; → Blender headless decimate/retopo + UV atlas + iso-render | Chains AFTER text→image (controllable silhouette); replaces paid Meshy. Gap: gen-mesh topology not quad-clean for animation |
| **video** (clips, trailers, loops) | Wan2.2 (Apache-2.0, 5B on a 4090; https://github.com/Wan-Video/Wan2.2) + LTX-Video + AnimateDiff (consumer-GPU fallback) + ffmpeg mux | VRAM router: Wan-14B big GPU → LTX/AnimateDiff small; degrades gracefully |
| **audio / music** (BGM, SFX, stingers) | AudioCraft/MusicGen+AudioGen (Meta MIT code, weights CC-BY-NC) + Stable Audio Open 1.0 (commercial-safe; https://github.com/facebookresearch/audiocraft) | License gate: monetized → Stable Audio Open; internal drafts → MusicGen |
| **voice / TTS** (narration, VO, i18n) | Chatterbox (MIT clone+emotion; https://github.com/resemble-ai/chatterbox) + F5-TTS + Piper (CPU, bulk) + Coqui | Piper for high-volume; Chatterbox/F5 for identity. Consent/deepfake policy gate required |
| **speech→text** (captions, voice intake) | Whisper via faster-whisper (CTranslate2; https://github.com/SYSTRAN/faster-whisper) / whisper.cpp (CPU) | Closes the AV loop; word-timestamps for kinetic captions |
| **rigging / animation** (mesh → animated avatar) | UniRig (SIGGRAPH 2025 auto skeleton+skin; https://github.com/VAST-AI-Research/UniRig) + Mixamo + Blender retarget | HARD LIMIT: UniRig rigs but authors NO motion — creature/non-biped locomotion is still a WALL (field note) |
| **asset conditioning** (cutout/upscale/conform — mandatory post node) | rembg (https://github.com/danielgatis/rembg) + SAM 2 + Real-ESRGAN + Pillow/Blender | EVERY image/3D output passes through; enforces per-project art contract (size/anchor/transparency/palette lock, e.g. foot=41) |
| **asset-QA gate** (accept/reject) | CLIP-score + aesthetic predictor + local-LLM-judge + spec-conformance check | ORIGINAL build (no free turnkey); without it the pipeline floods projects with off-spec gens |
| **web scraping / data** | crawl4ai (https://github.com/unclecode/crawl4ai) + Playwright + Scrapy + trafilatura (JSON-LD path) | Scrapers are PROJECT deliverables, not the agent's fetch path (owner rule: agent browses via WebSearch/WebFetch only). Centralize a polite rate-limit/robots wrapper |
| **ML training / finetune** (brand/style lock) | kohya_ss LoRA/DreamBooth (https://github.com/bmaltais/kohya_ss) + Diffusers/PEFT; Unsloth/Axolotl for LLM | Train once per project → every gen node inherits the identity (fixes "facade = no identity") |
| **local LLM inference** (free text/codegen + LLM-judge) | Ollama (https://github.com/ollama/ollama) / llama.cpp / vLLM running Llama/Qwen/Mistral/DeepSeek/Gemma | Routes high-volume/low-stakes calls (classification, asset-QA scoring, pain-classify) OFF the paid quota — directly serves the token-economy rule |

**Per-project github + skills.mp scan step (runs inside Step 3 of the assembler):** after role slots are fixed, query skills.mp (https://skillsmp.com/skills), ClaudeSkills.info, skills.sh, and GitHub per slot's needed capability; attach matches as the role's equipped skills/tools. **Security gate (non-negotiable):** an audit found prompt-injection in ~36% of marketplace skills, so every candidate is read-source + sandboxed + no-auto-exec + treated as untrusted DATA before granting — never equip an unaudited skill. This realizes the owner's "free/OSS only, scan GitHub + skills.mp per project" doctrine as a concrete, gated pipeline stage.

**Paid (listed separately, only where no free path is clean):** none required for the capabilities above. For reference only (owner-only note, out of scope): Meshy (3D) is replaced by TRELLIS/Hunyuan3D; lip-sync/talking-head free options (SadTalker/Hallo/LatentSync) lag paid avatars — flagged as a gap, not a paid recommendation.

---

## Team run-loop under the standing loops

The single canonical loop the assembled TEAM runs, layered on the prompt-master `<self_improvement_loop>` (MICRO self-improve / MACRO non-stop-until-ship / `/clear` = STATUS checkpoint) and the spine harness — eco by construction, not re-derived.

1. **FRAME** — lead reads intake/route + the per-type operating template (spine-owned).
2. **ASSEMBLE** — run the cost-aware ladder; DEFAULT solo, escalate only on a logged trigger. Emit `.md` subagents + lead delegation brief + TEAM block to disk.
3. **PLAN** — lead writes the plan + topology tag to `STATUS.md` (the resumable SoT == Anthropic's checkpoint/resume).
4. **SELECT parallel/sequential per wave** — INDEPENDENT subtasks (breadth, no shared mutable state) → parallel fan-out with an EXPLICIT count (Claude Code is conservative about parallelism by default; https://code.claude.com/docs/en/agent-teams); DEPENDENT subtasks → sequential chain; mixed → sequential waves of parallel batches. Default conservative; fan out only on proven independence (prevents merge conflicts from workers touching shared files — coding shares mutating context, so the spine already flags it as a poor fan-out fit).
5. **EXECUTE** — workers run in clean contexts and return **summary-only** + a pass/fail self-report (never raw context). The HANDOFF CONTRACT: every transition carries a structured payload (the `STATUS.md` delta / artifact pointer), control always RETURNS to the lead between outputs (supervisor shape, no peer-to-peer drift; https://github.com/langchain-ai/langgraph-supervisor-py). This keeps token cost flat as role count grows.
6. **CRITIQUE GATE** — an adversarial critic (separate context, often a different model) must pass the artifact BEFORE any commit (the AutoGen reflection/critic pattern; https://github.com/microsoft/autogen). The builder↔critic loop runs non-stop-until-clear via the prompt-master `self_improvement_loop` — it runs until the artifact clears, not once. For high-stakes design calls, instantiate 2-3 debating critics for ONE round instead of a lone reviewer.
7. **HARNESS** — the universal smoke / grounding signal must be green (spine-owned `verify` → `RESULTS.json`).
8. **SHIP GATE (lead-only)** — exactly one role ships. Workers NEVER self-ship/self-merge. The lead synthesizes, confirms harness green + critique passed, updates `STATUS.md`, then ships — with the HUMAN-lens veto as the **MANDATORY** final gate above the lead for any human-facing artifact type (product/game/content/niche — matching the roster conditional; n/a for trading/ETL/infra). A human-facing artifact NEVER ships without the veto firing.
9. **MEMORY WRITE** — one distilled Reflexion row to the global `LESSONS`/`PLAYBOOK_<type>` (spine-owned), plus the `STATUS.md` resume anchor.

Loop repeats per milestone; resume from `STATUS.md` on failure. **Cost-aware throughout:** the token-economy guardian enforces the hard fan-out cap, the no-recursive-spawn rule, and the budget runaway stop; every escalation up the ladder cites a concrete reason against the 15x reality.

**Conflict/merge policy** (gap-fill): when two parallel workers return contradictory artifacts, the lead resolves by (a) re-run with tighter briefs, then (b) one debate round, then (c) human escalation — never silent pick. Parallel writers get a worktree each (`EnterWorktree`) or a read-only contract + single-writer merge.

---

## NICHE / market discovery playbook

The free method to find a monetizable niche and validate appeal like a real human BEFORE committing build effort. Defines two reusable library slots — the **pain-classifier** (shared taxonomy so signals compare across niches) and the **market-empathy critic** (scores every candidate, can veto) — so the assembler drops it into any discovery project without re-deriving the method. Every API is fragile/ToS-bound, so each node is wrapped in caching + circuit-breaker + "signal unavailable" fallback.

1. **HARVEST** pains/desires across platforms: Reddit (PRAW; https://github.com/praw-dev/praw), HN Ask/Show (Algolia keyless; https://hn.algolia.com/api), incumbent low-star app reviews (https://github.com/JoMingyu/google-play-scraper), TikTok trends (https://ads.tiktok.com/business/creativecenter/keyword-insights/pad/en), and breadth via snscrape for Telegram/Reddit (Twitter path dead post-2023; https://github.com/JustAnotherArchivist/snscrape).
2. **PRE-RANK + CLASSIFY** — VADER (MIT, zero-cost; https://github.com/cjhutto/vaderSentiment) ranks thousands of comments by negativity intensity, then only the hottest pain goes to the (expensive) LLM classifier → tag each by frequency × intensity × WTP. Keeps discovery eco.
3. **TREND-GATE** — trendspyg slope + TikTok 7d/120d delta: PASS only if 12-mo slope is positive with rising related queries; reject flat/declining fads (https://github.com/flack0x/trendspyg). No single free source gives reliable search VOLUME — triangulate slope + subreddit/hashtag size, never trust one number.
4. **GAP-CHECK** — incumbents' 1-3 star reviews + Show HN points/saturation = an "it doesn't / I hate / I wish" backlog of features the market begs for.
5. **SIZE** — subreddit subscriber count + post velocity + hashtag/group counts as a free TAM proxy; for B2B/local, fold in the SIRENE + JSON-LD pattern. Game revenue: trust SteamDB review% + concurrency (https://steamdb.info/), treat SteamSpy/Gamalytic revenue figures as rough.
6. **MONETIZABILITY EVIDENCE** — mine Indie Hackers MRR/"how I built" threads to confirm real spend + price points (https://www.indiehackers.com/) — converts a "cool idea" into a priced business hypothesis.
7. **SMOKE-TEST KILL-GATE** — auto-generate a fake-door landing on free Cloudflare Pages (https://pages.cloudflare.com/), drive ethical free traffic, measure visit→signup conversion. **Build proceeds ONLY if conversion clears a preset bar** — the falsification gate that respects the owner's "edges UNVALIDATED, trending ≠ monetizable" doctrine.

**APPEAL SCORECARD** (each 0-2; niche advances only above a fixed cut AND a passing smoke test): acute recurring pain · growing trend · weak/expensive incumbents · reachable audience · clear willingness-to-pay · fast emotional "I want this now" · solo-buildable from free/OSS.

---

## Universal-machine integration

How this layer wires into the spine without duplicating it.

- **Where it runs (two-Claude split).** The ASSEMBLER executes in the **prompt-author Claude** during **MATERIALIZE** (CLAUDE.md STEP 3; the old `/new-project` skill name never shipped — see UBM §120), writing the team to disk: `.claude/agents/*.md` + a `## TEAM` block in `STATUS.md` + the lead delegation brief inside `PROJECT_OPERATING_PROMPT.md`. The **builder Claude** opens the project and the on-disk team auto-delegates. The context boundary between them IS the generator-critic seam.
- **Relation to the orchestration selector.** The spine selector decides the SHAPE (rungs 1-6, the 15x gate, cron mapping). This layer is what runs once the selector lands at rung 4-5 (deterministic workflow / multi-agent): it resolves the concrete roster, topology, model tiers, and tool grants. It REFINES the selector's output; it never re-decides shape. The team-sizing ladder here is the role-level expansion of the selector's cost ladder.
- **Grounding signal + ship gate.** Reuses the spine's grounding-signal decision table verbatim — the QA/playtester/falsification roles consume those exact signals; the HUMAN-lens FUN/SELL verdict plugs into the spine's "consumer-product/economy" and "game" gate rows. One ship owner = the lead, exactly as the spine's evaluator-optimizer-as-contract.
- **Memory + rails.** Role specs, topology choices, and `{shape→outcome→tokens}` accounting write to the spine's cross-project memory (PLAYBOOK/LESSONS) so the next build inherits the right team. All roles inherit the spine's universal rails (deny-set, secret non-exfiltration, license-clean, verify-before-done, no-silent-caps); the FREE-gen resolver's license gate + skill-audit gate are concrete expressions of rails #8 (license-clean) and #4 (untrusted-content).
- **Run-trace (gap-fill).** Add a per-decision `RUN_TRACE.jsonl` (which role made which call, tokens, verdict) alongside `STATUS.md`, since multi-agent runs are non-deterministic between identical runs and `STATUS.md` captures state but not the decision trace.

---

## GAPS / build-next

Ordered by leverage:

1. **Measure CLAUDEWAR's own team-vs-solo cost/quality curves per type** before trusting the borrowed 15x / 1-2-4-10 numbers (research-query-tuned). Build a small eval set on game/web/trading milestones; re-tune the escalation thresholds on the owner's real project mix.
2. **Verify the subagent nesting limit** in the current Claude Code build before designing any >2-tier topology; enforce the no-recursive-spawn + max-fan-out + max-depth caps at the orchestration layer (hooks), not by prompt discipline.
3. **Author the role-schema normalizer** (transcode VoltAgent/wshobson/CrewAI frontmatter → the canonical Role-spec) and confirm + record each source repo's license before vendoring prompt text (copy + attribute prompts only; no code deps; Composio is a mixed license).
4. **Harden the marketplace-skill audit gate** beyond "read source / no auto-exec" into a concrete sandbox + injection-scan pipeline (36% prevalence makes this load-bearing).
5. **Prove the re-plan loop doesn't thrash** — a tested rule for rewriting `.claude/agents/` at milestone boundaries (scope-delta-logged trigger only) with a regression set.
6. **Calibrate the HUMAN-lens against real outcomes** — the panel is unvalidated as a 2026-taste predictor and skews over-positive; enforce the panel-vs-real-signal delta check in the spine harness and track verdict-vs-actual hit-rate over time.
7. **A/B which critique topology** (single critic vs evaluator-optimizer vs 2-3 debate) gives best quality-per-token for BUILD tasks specifically — current choice rests on general research, not CLAUDEWAR data.
8. **Set the numeric gate bars per type** — the lens supplies instruments (desirability %, Kano class, GEQ subscale, fake-door conversion %) but not cutoffs; the spine must define "≥X% positive reaction words / ≥Y% signup" or "GATE on agreement" stays subjective.
9. **Build the free asset-QA harness** (CLIP-score + aesthetic predictor + local-LLM-judge + spec-conformance) — no turnkey free option; without it the resolver floods projects with off-spec gens.
10. **VRAM-probe + reproducible env per capability** — probe the owner's actual GPU class; pin CUDA/PyTorch/Blender via Docker/conda lock so the builder doesn't burn time on yak-shaving; the resolver auto-picks the model variant per tier.
11. **Animation authoring remains a WALL** — UniRig rigs but authors no creature/non-biped locomotion; no strong free text→motion. Flag as unsolved; don't promise it.
12. **Traffic acquisition for the behavioral gate** — a fake-door is worthless without eyeballs; the niche playbook needs an ethical, non-spammy seeding playbook (and possibly a tiny flagged paid-ads exception) or steps 5/7 only ever reach the opinion layer.
13. **Run-trace + conflict-merge policy** — ship `RUN_TRACE.jsonl` and the lead's tie-break rule (re-run → debate round → human escalation) as concrete artifacts.
14. **Geographic/language blind spot** — WebSearch + review/trend signal skew US/English; non-US niche-finding currently has no grounded signal.