# THE PROMPTING ARSENAL — Claude Code

*Upgrade plan for the Master Prompting Loop (`prompt-master` skill) → best-prompt-on-any-project. From a 9-agent A-Z deep-search (wf wuhhc5u6k, 2026-06-20): 8 clusters, 102 items, skills.mp + GitHub + official Anthropic docs. Owner rule: FREE permissive first; paid listed separately. URLs are from the research — pin commits + re-verify before automating (WebFetch was hook-intercepted, so doc anchors are search-derived, not byte-verified).*

> **Owner standard baked on top of this (06-20):** every prompt I author embeds a `<self_improvement_loop>` (micro self-improve + macro non-stop-until-ship; a blocker is never a stop; compact/clear = pause-checkpoint via resume anchor). See `feedback_embed_continuous_loop_in_prompts` memory + the skill's master template.

## TL;DR — what to change in my prompting system

1. **Make SCORE/CONVERGENCE empirical, not self-graded.** For any prompt you'll REUSE, externalize the 6-axis rubric into a `promptfooconfig.yaml` golden set and accept a revision only if assertions pass *and* the score beats best-so-far on a held-out split. promptfoo ships an official Claude Code skill, so Claude drives it. ([promptfoo](https://github.com/promptfoo/promptfoo), [getsentry prompt-optimizer](https://github.com/getsentry/skills/blob/main/skills/prompt-optimizer/SKILL.md))
2. **Make generator–critic separation REAL.** Run CRITIQUE as a Claude Code *subagent* with a fresh context window and a Read-only tools allowlist that never saw the draft — not an in-context persona that self-flatters. ([sub-agents docs](https://code.claude.com/docs/en/sub-agents))
3. **Persist memory across sessions as an append-only playbook.** Replace the in-context-only Reflexion buffer with a per-domain `playbook.md` updated by deduped *delta* bullets (never a full rewrite, which causes context-collapse), loaded at FRAME. This automates the manual MEMORY.md. ([ACE](https://arxiv.org/abs/2510.04618), [Memory tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool))
4. **Add a complexity/intent ROUTER at FRAME.** Count task elements → Simple (≤3) = a single silent pre-pass; Complex (6+) = full 8 stages. Operationalizes "scale-effort-to-ask" instead of running 8 stages on trivial asks. ([dreamor optimizer](https://skillsmp.com/skills/dreamor-prompt-optimizer-skill-skill-md), [prompt-architect](https://github.com/ckelsoe/prompt-architect))
5. **Package the loop as slash commands on a cache-stable prefix.** Ship `/score` and `/finalize` as `.claude/commands/*.md`; freeze rubric + adapters as a static prefix (order tools→system→messages) so many CRITIQUE→REVISE passes are nearly free. ([slash commands](https://code.claude.com/docs/en/slash-commands), [prompt-caching lessons](https://claude.com/blog/lessons-from-building-claude-code-prompt-caching-is-everything))
6. **Adopt a Pareto archive + reflect-on-trace mutation for reused prompts.** Replace the single best-so-far pointer with a small Pareto set (keep the variant that wins each eval case) and make REVISE a reflection on the failing *trace*, not just the 0-100 score. ([GEPA](https://github.com/gepa-ai/gepa))
7. **Stand up a scheduled re-research + propose-and-test job.** A headless `claude -p` / `/schedule` agent that diffs the awesome-claude-code resource table monthly and proposes SKILL.md edits accepted only if eval score rises. ([GitHub Actions / headless](https://code.claude.com/docs/en/github-actions), [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code), [SkillOpt](https://microsoft.github.io/SkillOpt/))
8. **Add Opus-4.8 model levers:** a "don't over-constrain creative/frontend" check in CRITIQUE, Structured Outputs for machine-checkable verdicts, and long-context docs-on-top/query-last/quote-first in GROUND. ([Opus 4.8 prompting](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-4-8), [long-context tips](https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/long-context-tips))
9. **Refactor the skill with progressive disclosure.** Move the 5 domain adapters into `references/` loaded on demand and rewrite the description with pushy third-person triggers (Claude under-triggers skills). ([skill best-practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices), [skill-creator](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md))

---

## INSTALL/ADOPT NOW (free)

Ranked by leverage. Install via `npx skills add <repo>` ([vercel-labs/skills](https://github.com/vercel-labs/skills), MIT) or `npx claude-code-templates@latest`.

| Thing | URL | License | What it upgrades |
|---|---|---|---|
| promptfoo + `promptfoo-evals` CC skill | https://github.com/promptfoo/promptfoo | MIT (core) | Turns SCORE + CONVERGENCE GATE into a real assertion-based eval suite; `npx promptfoo eval` per REVISE candidate; CI regression gate = cross-session memory |
| anthropics/claude-cookbooks (`evaluator_optimizer`, `misc/metaprompt.ipynb`) | https://github.com/anthropics/claude-cookbooks | MIT | Canonical generator-critic loop template + a DRAFT-stage `{$VAR}` metaprompt seed for the blank page |
| getsentry/skills `prompt-optimizer` | https://github.com/getsentry/skills/blob/main/skills/prompt-optimizer/SKILL.md | verify (Sentry) | Eval-cases-FIRST method; cluster CRITIQUE failures by root cause; layer-separation (stable policy→system, dynamic→user) |
| anthropics/skills (`skill-creator`) | https://github.com/anthropics/skills | Apache-2.0 | Mechanically scaffold/lint prompt-master with progressive disclosure + trigger descriptions |
| vercel-labs/skills (`npx skills` + find-skills) | https://github.com/vercel-labs/skills | MIT | One-command install for every item here; GROUND-time skill discovery |
| anthropics/prompt-eng-interactive-tutorial | https://github.com/anthropics/prompt-eng-interactive-tutorial | Anthropic | Canonical source for two missing levers: response prefilling (non-Opus) + prompt chaining |
| gepa-ai/gepa (also `dspy.GEPA`) | https://github.com/gepa-ai/gepa | MIT (verify) | Pareto archive + reflect-on-trace mutation = the continuous-improvement engine |
| Piebald-AI/claude-code-system-prompts | https://github.com/Piebald-AI/claude-code-system-prompts | verify (mirror) | Ground-truth agent-creation meta-prompt + tool-description schema; diff per CC release = free freshness check |
| hesreallyhim/awesome-claude-code (`THE_RESOURCES_TABLE.csv`) | https://github.com/hesreallyhim/awesome-claude-code | verify | Machine-readable feed for the scheduled re-research job |
| qdhenry/Claude-Command-Suite (`handoff-continue.md`) | https://github.com/qdhenry/Claude-Command-Suite | MIT | Cross-session persistence: write best-so-far + critique log at FINALIZE, re-prime next session |
| davila7/claude-code-templates | https://github.com/davila7/claude-code-templates | MIT | Battle-tested hooks/commands + session analytics CLI → Reflexion telemetry |
| SuperClaude-Org/SuperClaude_Framework | https://github.com/SuperClaude-Org/SuperClaude_Framework | MIT | Explicit quality-gate + termination-detection logic for a principled CONVERGENCE stop rule |
| DSPy + MIPROv2 | https://github.com/stanfordnlp/dspy | MIT | Compile *recurring production* prompts (narrative classifier, director/art review, VIP labeler) against a devset instead of vibes-tuning |
| MadcowD/ell | https://github.com/MadcowD/ell | MIT | Git-like versioned prompt history → real best-so-far/rollback across sessions with diffs |
| VoltAgent/awesome-claude-code-subagents | https://github.com/VoltAgent/awesome-claude-code-subagents | MIT | Droppable subagent skeletons; `08-business-product/product-manager.md` seeds the web-micro-biz adapter |

---

## Claude-Code-specific levers

Mechanics unique to the Claude Code harness that the current loop (written as generic in-context prose) underuses.

- **Subagents = generator-critic machinery.** A subagent has its own context window, system prompt, model field, tools allowlist; only its final summary returns to the parent ([docs](https://code.claude.com/docs/en/sub-agents)). Implement CRITIQUE as a critic subagent with `tools: Read, Grep` (read-only — cannot "fix" while judging) and a fresh context that never saw the draft. Set `model:` per task. *(CLAUDEWAR doctrine #4 override: critique is load-bearing judgment → Opus for BOTH critique and synthesis here; the haiku/sonnet-for-critique split is generic-Claude-Code advice, superseded in this tree — downgrade only genuinely-trivial rote sub-calls.)* Keeps verbose output OUT of the main loop context.
- **Plan Mode is the gate before DRAFT.** Explore→Plan→Code→Commit ([best practices](https://www.anthropic.com/engineering/claude-code-best-practices)): require a written plan (read-only mode) before edits on code-heavy/high-stakes asks.
- **Thinking-budget escalation = the scale-effort knob.** `think → think hard → ultrathink`; reserve max thinking for CRITIQUE/SCORE ([ClaudeLog](https://claudelog.com/)). On Opus 4.6+ this is an adaptive `effort` parameter, not `budget_tokens`.
- **Slash commands package the loop.** `.claude/commands/*.md` with frontmatter (`allowed-tools`, `argument-hint`, `model`) + `$ARGUMENTS` ([docs](https://code.claude.com/docs/en/slash-commands)). Ship `/score` and `/finalize`. Gotcha: frontmatter field names (`allowed-tools` vs `tools`) drifted across releases — verify against installed version (anthropics/claude-code#8501).
- **Prompt caching makes the loop affordable.** Render order tools→system→messages, static first/dynamic last, never mutate the prefix ([lessons](https://claude.com/blog/lessons-from-building-claude-code-prompt-caching-is-everything)). At FINALIZE keep rubric/adapters/examples as a stable cached prefix; a rewrite = full cache miss, so feed new info as a new message.
- **Skills with progressive disclosure.** Keep SKILL.md lean; push adapters/rubrics into linked files loaded on demand ([best-practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)). Third-person pushy triggers (Claude under-triggers skills); replace ALL-CAPS MUST/NEVER with "rule + why".
- **Long-running harness = the multi-context loop.** Initializer writes `PROGRESS.md` + feature list + `init.sh`; incremental workers self-verify + leave handoff artifacts → loop survives `/clear` ([harnesses](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents), [cwc repo](https://github.com/anthropics/cwc-long-running-agents)). Built-in `/goal` generator-evaluator = a SCORE→GATE mechanism.
- **Memory tool + context editing for unattended runs.** File-based memory outside context (+39% on long tasks) ([memory tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool)) + auto stale-context trimming (+29%, header `context-management-2025-06-27`) ([context editing](https://platform.claude.com/docs/en/build-with-claude/context-editing)).
- **Context hygiene as a first-class rule.** `/clear` between unrelated tasks; offload bulk to files/subagents ([context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)). Lever: "context is finite — smallest high-signal token set."
- **Headless + GitHub Actions = scheduled self-running.** `claude -p` with JSON output in CI/cron opens a PR with proposed improvements ([docs](https://code.claude.com/docs/en/github-actions)) — the concrete continuous-re-research mechanism.

---

## Loop upgrades — mapped to the 8 stages

**FRAME (0)** — *NEW* intent+complexity router (create/transform/reason/critique/**RECOVER**) + element count → effort tier ([prompt-architect](https://github.com/ckelsoe/prompt-architect), [dreamor](https://skillsmp.com/skills/dreamor-prompt-optimizer-skill-skill-md)); *NEW* Self-Discover reasoning-module composition cached per task-type ([arxiv 2402.03620](https://arxiv.org/abs/2402.03620)); *NEW* agent-shape routing (single | evaluator-optimizer | orchestrator+subagents) with "don't spawn workflows unless a single prompt fails" gate ([Building Effective Agents](https://www.anthropic.com/research/building-effective-agents)). *Covered:* objective/contract/rubric lock, orthogonal angles, clarifying gate.

**GROUND (1)** — *NEW* long-context placement: source ABOVE instruction, ask LAST, quote-first (~30% gain), wrap `<document><source>…</source><document_content>…</document_content></document>` ([long-context](https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/long-context-tips)); *NEW* agentic search over RAG ([multi-agent research](https://www.anthropic.com/engineering/multi-agent-research-system)); *NEW* Ragas faithfulness → verdicts ([Ragas](https://github.com/explodinggradients/ragas)). *Covered:* name signal, quote-then-answer, examples.

**DRAFT (2)** — *NEW* `{$VAR}` metaprompt seed ([metaprompt.ipynb](https://github.com/anthropics/claude-cookbooks/blob/main/misc/metaprompt.ipynb)); *NEW* intent-matched framework scaffold (CO-STAR create / TIDD-EC instruction) ([prompt-architect](https://github.com/ckelsoe/prompt-architect)). *Covered:* 2-3 candidates from different priorities, no stubs.

**CRITIQUE (3)** — *NEW* critic as a REAL subagent (fresh ctx, Read-only) ([sub-agents](https://code.claude.com/docs/en/sub-agents)); *NEW* textual-gradient feedback ([TextGrad](https://github.com/zou-group/textgrad)); *NEW* multi-agent debate / verdict jury for high-stakes facts ([debate](https://arxiv.org/abs/2305.14325), [Verdict](https://github.com/haizelabs/verdict)) — sparingly; *NEW* don't-over-constrain check (Opus 4.8). *Covered:* skeptical lens, CoV, CONFIRMED/PLAUSIBLE/REFUTED, loop-until-dry, dedup vs SEEN.

**REVISE (4)** — *NEW* meta-prompt diff micro-stage (targeted add/delete phrase edits + reasons, not full rewrite) ([OpenAI cookbook](https://github.com/openai/openai-cookbook/blob/main/examples/gpt-5/prompt-optimization-cookbook.ipynb)); *NEW* joint optimization for multi-component prompts ([AdalFlow](https://github.com/SylphAI-Inc/AdalFlow)), structure-level mutation ([SAMMO](https://github.com/microsoft/sammo)). *Covered:* address every confirmed point, Reflexion note.

**SCORE (5)** — *NEW* empirical pairwise gate (`Battle`, `Factuality`/`ClosedQA`) ([Autoevals](https://github.com/braintrustdata/autoevals)) or per-axis `GEval` ([DeepEval](https://github.com/confident-ai/deepeval)); *NEW* Pareto archive ([GEPA](https://github.com/gepa-ai/gepa)); *NEW* structured-output verdicts ([Structured Outputs](https://docs.claude.com/en/docs/build-with-claude/structured-outputs)). *Covered:* 0-100 rubric, rollback-on-regression.

**CONVERGENCE (6)** — *NEW* held-out test split (anti prompt-overfit) ([Promptimizer](https://github.com/hinthornw/promptimizer)); *NEW* principled termination detection ([SuperClaude](https://github.com/SuperClaude-Org/SuperClaude_Framework)); *GAP:* no harness gives confidence intervals — require a minimum case count before trusting a pass. *Covered:* completeness critic, plateau/budget stop, log caps.

**FINALIZE (7)** — *NEW* target-tool adapter (XML for Claude / grounding anchors for Gemini / system-developer split for OpenAI) ([nidhinjs/prompt-master](https://github.com/nidhinjs/prompt-master)); *NEW* one-source-many-harness command+subagent pairing ([wshobson/agents](https://github.com/wshobson/agents)); *NEW* cache-stable CLAUDE.md module schema (task-context → rules → numbered-steps → examples) ([ClaudeLog](https://claudelog.com/)). *Covered:* best-so-far emit, body/citations separation, uncertainty up front.

---

## CONTINUOUS self-improvement loop

The current loop improves a single *artifact* in-context; it does not improve the *system* across sessions. Concrete design, built only from free Claude Code mechanics:

1. **Persistent memory substrate.** One append-only `playbook.md` per domain under the skill's `references/`. Load at GROUND; append deduped *delta* bullets at REVISE, never rewrite (full rewrites cause brevity-bias/context-collapse — [ACE](https://arxiv.org/abs/2510.04618)). Distill recurring successful step-sequences into named workflows ([AWM](https://arxiv.org/abs/2409.07429)). Back with the file-based Memory tool so it survives `/clear`. Automated version of the manual MEMORY.md.
2. **A real eval harness (the prerequisite the research keeps flagging).** Tiny per-domain golden set (3-8 labeled cases each, "ideal output" column — [Console Evaluate](https://console.anthropic.com/docs/en/build-with-claude/prompt-engineering/prompt-improver)). Each rubric axis as a promptfoo assertion: contract = deterministic (`is-json`/`contains`/latency-cost), clarity/specificity/robustness = `llm-rubric` (`provider: anthropic:messages:claude-…`). Commit to repo → cross-session regression memory.
3. **Eval-gated auto-refinement (propose-and-test, never blind self-edit).** Scheduled job re-runs prompt-master vs held-out set, asks a critic for a structured SKILL.md diff, commits **only if eval accuracy rises**, keeping a rejected-edits buffer so failed edits don't recur ([SkillOpt](https://microsoft.github.io/SkillOpt/), +23.5 avg acc). For recurring production prompts run GEPA/MIPROv2 offline once, ship compiled ([GEPA](https://github.com/gepa-ai/gepa), [DSPy](https://github.com/stanfordnlp/dspy)).
4. **Meta-level: improve the loop itself.** Evolve a pool of CRITIQUE/REVISE meta-prompts against the devset ([Promptbreeder](https://arxiv.org/abs/2309.16797)); optionally a meta-agent proposes loop variants scored on the benchmark ([ADAS](https://github.com/ShengranHu/ADAS)).
5. **Scheduled re-research cadence.** Monthly headless `claude -p` (JSON) / `/schedule`: (a) diff `THE_RESOURCES_TABLE.csv` + CC system-prompt mirror for harness drift; (b) query marketplace for newer skills; (c) open a PR with adapter updates that must pass the eval gate. Pin commits, re-verify URLs (leaked-prompt repos drift/DMCA).

**What to measure:** per-run log (a) eval score on held-out set, (b) tokens + iterations to convergence ([davila7 analytics](https://github.com/davila7/claude-code-templates)), (c) rollback rate, (d) judge-vs-human agreement on a calibration sample. A revision is "better" only if score rises without cost blowing up. **Caveat (edges-not-validated applies to prompts too):** any eval gain = hypothesis until it holds on a held-out split with a non-trivial case count — no DSR-equivalent for LLM-judge pass-rates; a 5-case win is in-sample noise.

---

## skills.mp findings

*Caveat: skillsmp.com could not be first-party fetched (context-mode hook intercepted WebFetch); rests on search summaries. SkillsMP only INDEXES third-party GitHub SKILL.md — check per-skill license individually.*

**Free, worth taking:**
- **dreamor prompt-optimizer** ([listing](https://skillsmp.com/skills/dreamor-prompt-optimizer-skill-skill-md)) — element-count complexity tiering → lift into FRAME router; 61-framework lookup table.
- **prompt-architect** ([GitHub](https://github.com/ckelsoe/prompt-architect)) — 7-intent classifier → framework routing. README says 7 frameworks; marketplace claims 27 — version drift, verify installed catalog.
- **nidhinjs/prompt-master** ([GitHub](https://github.com/nidhinjs/prompt-master), MIT) — target-tool adapter + "max 3 clarifying questions" discipline. (Same name, different codebase from yours.)
- **skill-meta-prompt** ([skills.rest](https://skills.rest/skill/skill-meta-prompt)) — 6-phase build + dynamic expert-role + verification sub-prompt (strengthens CoV).
- **Hashaam101/prompt-optimizer** ([GitHub](https://github.com/Hashaam101/prompt-optimizer)) — AUTO silent-refine = low-stakes cheap path.
- **Discovery tooling:** skillsmp-mcp-server ([GitHub](https://github.com/anilcancakir/skillsmp-mcp-server)) + skillmp-api ([GitHub](https://github.com/kevintsai1202/skillmp-api)) — semantic search/install marketplace skills at runtime; scripts the re-research poll (`SKILLSMP_API_KEY`).

**Paid / gated:** ClaudSkills Skill Optimizer ([claudskills.com](https://claudskills.com/skills/skill-optimizer/)) — diagnoses a SKILL.md from session data; paid tiers.

**Reality check:** no marketplace skill publishes an independent benchmark; only Microsoft SkillOpt reports a measured gain. Treat every marketplace prompting skill as unvalidated until run against your own eval slice — your 6-axis rubric is already more rigorous than anything published in this cluster.

---

## Opus 4.x model levers

| Lever | Situation | Gotcha |
|---|---|---|
| Be explicit + add the WHY | Non-obvious directives; want generalization | Vague "can you suggest" makes 4.x *suggest* not *act* — say "Change X to do Y" |
| **Don't over-constrain** | Creative/frontend/design | Over-specification *degrades* 4.8 — strip redundant micro-instructions |
| No assistant-prefill | Forcing JSON/format | Opus 4.6/4.7/4.8 = HTTP 400 on prefilled last turn — use Structured Outputs / forced tool / system instruction |
| Structured Outputs (`json_schema`) | Machine-checkable scores for unattended runs | Beta header `structured-outputs-2025-11-13`; docs cited Sonnet 4.5 / Opus 4.1+ — **verify Opus 4.8 support** |
| Interleaved extended thinking | Agentic GROUND search | Header `interleaved-thinking-2025-05-14`; cannot force `tool_choice: any/tool`, cannot prefill |
| `effort` parameter | Raise reasoning depth | On 4.6+ replaces `budget_tokens` (adaptive) — old budget config dead |
| Parallel tool calls | Multi-source GROUND | "invoke all independent tools simultaneously"; NEVER parallelize dependent calls |
| Long-context placement | Inputs >~20K tokens | Docs top, ask LAST, quote-first → ~30% gain |
| Positive directives | Any constraint | "Don't X" pushes a different fixed mode; rewrite "do Y instead" |
| Prompt caching | Many loop re-runs | Order tools→system→messages; 5-min TTL (1-hr paid); never mutate prefix |
| Forced tool use | Always emit structured verdict | Suppresses preamble AND incompatible with extended thinking — use `tool_choice: auto` + Structured Outputs |
| Drop `token-efficient-tools-2025-02-19` | Migrating old agents | No-op on Claude 4 — dead config to remove |

---

## Domain adapter boosts

- **Trading / quant.** Replace the single generator-critic pair with a **bull-agent vs bear-agent debate → risk-committee → PM final-call** gate where the bear must argue NO-TRADE — matches the "edge-falsification, default NO TRADE" memory ([HKUDS/Vibe-Trading](https://github.com/HKUDS/Vibe-Trading) investment-committee shape; its MCP layout templates wiring market-data scripts/backtests as CC MCP tools). Feed [awesome-quant-ai](https://github.com/leoncuhk/awesome-quant-ai) + [LLM-quant-trading-papers](https://github.com/Tom-roujiang/Awesome-LLM-Quantitative-Trading-Papers) to the re-research so the overfit-method inventory refreshes.
- **UE5 gamedev (3D game).** Ground in REAL project state: read scene/Blueprint/draw-call/collision via [ue-llm-toolkit](https://github.com/ColtonWilley/ue-llm-toolkit) (read-only) + drive editor via [UnrealGenAISupport](https://github.com/prajwalshettydev/UnrealGenAISupport) MCP — serves the Perf Mandate + MF-BUG-WP-001 collision class. GDD section checklist as a FINALIZE contract ([game-design-document](https://github.com/saeidzebardast/game-design-document)); shared UE/GoF pattern vocab so reviews name a concrete remedy ([UE5 patterns](https://github.com/PacktPublishing/Game-Development-Patterns-with-Unreal-Engine-5)).
- **Web / app micro-business.** Drop `product-manager.md` into `~/.claude/agents/`; lift market-analysis → user-need → strategy so prompts for lead-gen products / report tools / web apps force a JTBD + positioning + pricing-tier section into the contract ([VoltAgent 08-business-product](https://github.com/VoltAgent/awesome-claude-code-subagents/blob/main/categories/08-business-product/product-manager.md)).
- **Image / 3D-asset gen (NEW adapter).** Enforce `[Subject] + [Modifiers: material/color/wear] + [Style]`, one object/no scene, ≤5 details ([Meshy](https://help.meshy.ai/en/articles/11972484-best-practices-for-creating-a-text-prompt)), + two slots Meshy omits: explicit **SILHOUETTE** + **BUILD-CONSTRAINT** (poly budget / clean topology / single mesh) — stops fall-through + atlas-conform pain in game asset pipelines ([Tripo3D](https://www.tripo3d.ai/blog/text-to-3d-prompt-engineering)). For SDXL: 6-layer labeled order + dedicated NEGATIVE block ([neurocanvas](https://neurocanvas.net/blog/sdxl-best-practices-guide/)); one locked style-JSON per project art-direction ([PromptStylers](https://github.com/wolfden/ComfyUi_PromptStylers)). Put "silhouette + build-constraint present?" in the robustness axis.

---

## PAID — worth-the-money appendix

Everything load-bearing above is free. Optional paid layers only if you outgrow the free tier:

- **Confident AI** (cloud behind [DeepEval](https://github.com/confident-ai/deepeval), Apache-2.0 core) — hosted eval dashboards. Library free; pay for team UI.
- **Braintrust** (behind [Autoevals](https://github.com/braintrustdata/autoevals), MIT core) — scorers free, hosted tracking paid.
- **promptfoo Enterprise** — `npx promptfoo` core is MIT and sufficient; SaaS paid. (Governance: promptfoo acquired by OpenAI ~Mar 2026 per search — still MIT, re-check before deep dependence.)
- **ClaudSkills Skill Optimizer** — registry tiers may gate it; free skill-creator + getsentry prompt-optimizer cover most value.
- **Anthropic Console** (prompt improver + Evaluate tab) — tooling free with account but bills API tokens; treat eval-gate integration as a design pattern, not a one-click export.

---

## GAPS / not worth adding

- **No single turnkey Anthropic "self-improving prompt system" doc** — assemble from four primitives (Console prompt-improver + memory tool + long-running harness + GitHub Actions). Don't hunt for one product.
- **No Claude-Code-native auto-optimizer** — DSPy/GEPA/TextGrad are Python libs needing a labeled devset + numeric metric; glue is DIY. For *subjective* prompts (creative direction, GDD review) there is no clean metric — the LLM-judge rubric stays necessary.
- **Acronym-framework stacking is cargo-cult** — "27/61 frameworks" collapse to role+context+task+constraints+format; mine the *router idea*, not the mnemonics.
- **`guidance`/constrained decoding only a partial fit** — hosted Claude doesn't expose full CFG; output-contract falls back to tool-use/JSON anyway.
- **EXCLUDE hermes-agent-self-evolution** — in the hermes-agent family flagged as key-stealer/backdoored LiteLLM. Pattern fine; that repo is not.
- **Leaked-system-prompt repos** ([x1xhlol](https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools), Piebald) drift each release + can be DMCA'd — pin a commit, re-verify, never trust a cached snapshot.
- **No statistical rigor in any eval harness** — raw judge pass-rates, no confidence intervals; no LLM-eval equivalent of DSR/CPCV. Small-n GATE is untrustworthy. A real gap, not a tool.
- **Plan-and-Solve / Reflexion / Self-Refine / CoV / ReAct / self-consistency** — already in the loop; re-surfacing adds nothing.
- **Own validators ahead of public work** for backtest/overfit prompt structure + prompt-quality rubrics. Steal the multi-agent *shape*, not a ready prompt.

*Caveat across this report: WebFetch was intercepted during research, so exact doc-page anchors/beta-header names were not byte-verified — confirm against live pages before automating.*

---

## CONCRETE SKILL UPGRADES (apply to `prompt-master/SKILL.md`)

1. **SCORE/GATE empirical eval-gate branch** — reused prompts → promptfooconfig.yaml golden set (3-8 cases), contract=deterministic assertions, clarity/specificity/robustness=llm-rubric; accept only if assertions pass AND total rises on a HELD-OUT split. *(promptfoo + getsentry + promptimizer)*
2. **CRITIQUE → real subagent** — fresh ctx, `tools: Read, Grep`, never saw the draft; haiku/sonnet critique, opus synthesis. *(sub-agents docs)*
3. **Cross-session memory** — per-domain `references/<domain>-playbook.md`, APPEND-ONLY deduped deltas, loaded FRAME / updated REVISE, backed by Memory tool. *(ACE + memory tool)*
4. **FRAME intent+complexity ROUTER** — classify intent incl. RECOVER mode; element count → Simple/Medium/Complex effort tier. *(dreamor + prompt-architect)*
5. **CONTINUOUS-IMPROVEMENT section** — scheduled headless job: re-run vs held-out set, diff resources table + system-prompt mirror, propose SKILL.md diff committed only if eval rises, rejected-edits buffer. *(SkillOpt + GH Actions + awesome-claude-code)*
6. **GROUND long-context wrapper** — `<document><source>…</source><document_content>…</document_content></document>`, ask last, quote-first (~30%). *(long-context tips)*
7. **Structured-output verdicts** — scores + CONFIRMED/PLAUSIBLE/REFUTED as schema JSON (header `structured-outputs-2025-11-13`, verify Opus 4.8). *(structured outputs)*
8. **Antipattern: over-constraining creative/frontend on Opus 4.8** + CRITIQUE check flagging redundant micro-instructions. *(Opus 4.8 prompting)*
9. **Progressive-disclosure refactor** — adapters + long levers → `references/`, lean SKILL.md, pushy third-person triggers; scaffold with skill-creator. *(skill best-practices)*
10. **Pareto archive + reflect-on-trace** — keep variant winning each eval case; REVISE feeds failing TRACE + reason; periodically merge frontier prompts. *(GEPA)*
11. **Trading adapter: bull vs bear debate → risk-committee → PM** (bear argues NO-TRADE) + FINALIZE target-tool adapter line. *(Vibe-Trading + nidhinjs/prompt-master)*
12. **New Image/3D-asset adapter** — contract + one-object/≤5-details + mandatory SILHOUETTE + BUILD-CONSTRAINT slots; robustness axis checks them; CRITIQUE rejects whole-scene/>5-detail asset prompts. *(Tripo3D + Meshy)*

## TOP-6 INSTALL FIRST (free, highest leverage)

1. **promptfoo + promptfoo-evals CC skill** — https://github.com/promptfoo/promptfoo — SCORE/CONVERGENCE → real assertion eval + CI regression gate = cross-session memory.
2. **anthropics/claude-cookbooks** — https://github.com/anthropics/claude-cookbooks — evaluator_optimizer loop + `{$VAR}` metaprompt seed.
3. **vercel-labs/skills (`npx skills`)** — https://github.com/vercel-labs/skills — one-command installer + find-skills discovery.
4. **gepa-ai/gepa** — https://github.com/gepa-ai/gepa — Pareto archive + reflect-on-trace = continuous-improvement engine.
5. **hesreallyhim/awesome-claude-code** — https://github.com/hesreallyhim/awesome-claude-code — machine-readable feed for the scheduled re-research.
6. **qdhenry/Claude-Command-Suite (handoff-continue.md)** — https://github.com/qdhenry/Claude-Command-Suite — best-so-far + critique log survive `/clear`.
