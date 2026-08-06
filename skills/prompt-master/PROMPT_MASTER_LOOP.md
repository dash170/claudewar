# Master Prompting Loop — Reference

> Subject-agnostic iterative refinement loop for producing the best possible **prompt** or **answer/artifact** on any topic.
> Installed as the `prompt-master` skill (`<CLAUDE_SKILLS_DIR>\prompt-master\SKILL.md`). This doc is the human-readable reference with rationales + sources.
> **Not** the `/loop` scheduler (recurring execution) — this is an *in-context* draft→critique→revise→score loop.

Built 2026-06-13 by deep-researching 95 techniques across: the local `/loop` & `/deep-research` skills, Anthropic/Claude prompt-engineering docs, web SOTA (2024-2026), and top GitHub frameworks — then synthesizing the highest-signal subset into one loop.

---

## Core thesis

Iterative self-refinement only helps when it is **grounded** and **monotonic**:
- **Grounded** — each revision is gated on a real external signal (tests, tool/retrieval, rubric, vote). Ungrounded "self-correction" on reasoning/closed-form tasks often makes the answer *worse* (*LLMs Cannot Self-Correct Reasoning Yet*, ICLR 2024).
- **Monotonic** — keep a **best-so-far** pointer; never ship a revision that scores lower or reintroduces a confirmed defect.

Everything else is in service of those two rules.

---

## The loop — 8 stages (full)

**0. FRAME** — *Pin down what "good" means before writing a line, so the loop has a target to converge on.*
Restate the subject as a one-sentence objective. Capture audience, success criteria, hard constraints, and the EXACT output contract (format/schema/length). Pick an effort tier (quick-check = 1 pass + single verify | standard = full loop | audit = wide fan-out + 3-5 critique lenses + synthesis). Decompose into 3-6 orthogonal angles, simplest-first (least-to-most). **Lock the rubric NOW — never invent the bar after seeing the draft.**
*Exit:* objective + audience + constraints + contract + tier + rubric written. Underspecified → ask 2-3 clarifying questions instead of guessing.

**1. GROUND** — *Establish the verification signal — the single biggest determinant of whether the loop helps or hurts.*
Name the signal: tests/execution, tool/retrieval result, a labeled example, a domain rubric, or self-consistency voting. If NO external signal exists (pure style/open-ended), say so — then the loop may only refine, never "correct on vibes." Gather context: retrieve docs, pull 2-5 few-shot examples, run scouting tools. Long context → source material on top, ask last; ground answers in verbatim quotes first. Research → extract 2-5 FALSIFIABLE claims per source, each with quote + source-quality rating.
*Exit:* a concrete pass/fail (or scored) signal is reachable, OR the task is explicitly flagged ungrounded/style-only.

**2. DRAFT** — *Produce candidate(s); breadth when the space is wide, depth when narrow.*
Narrow/well-defined → one focused draft. Wide-open design/strategy → 2-3 independent candidates from DIFFERENT priorities (MVP-first / risk-first / user-first) so iteration doesn't stick in a local optimum. Reason step-by-step in a scratchpad for multi-step problems (skip explicit CoT on reasoning-tuned models — raise effort instead). Write to the contract from the start.
*Exit:* ≥1 complete candidate attempting the full objective (no TODO stubs).

**3. CRITIQUE** *(the engine)* — *Find every real defect with a skeptical, distinct-from-generator lens.*
Adopt a critic persona separate from the generator. Verify against the Stage-1 signal — run the tests/tool, or answer independent verification questions in isolation from the draft (Chain-of-Verification). Perspective-diverse lenses (correctness / completeness / robustness / contract-adherence; + security & reproducibility for code), not N identical skeptics. Label each finding **CONFIRMED** (name triggering input + wrong output, quote the line) / **PLAUSIBLE** (mechanism real, trigger uncertain) / **REFUTED** (factually wrong / provably impossible / already-guarded — quote the proving line — or pure style). Default realistic-but-uncertain → PLAUSIBLE; don't over-refute. Feedback LOCALIZED + evidence-cited, never a bare scalar. Discovery → loop-until-dry: find until K consecutive rounds (K=2) surface zero NEW items, deduping against the SEEN set (not the confirmed set).
*Exit:* ranked defect list; OR zero CONFIRMED/PLAUSIBLE two checks in a row (clean).

**4. REVISE** — *Apply the critique fully and remember the lesson.*
Feed {objective + previous candidate + critique + running memory} and rewrite to address EVERY confirmed/plausible point — not a cosmetic touch-up. Append a one-line Reflexion note to a persistent memory buffer ("what failed + the lesson") and prepend it next iteration so repeated mistakes stop recurring.
*Exit:* every CONFIRMED finding resolved or explicitly deferred-with-reason; memory note written.

**5. SCORE & SELECT** — *Quantify progress and guarantee you never ship worse than a prior draft.*
Re-run the verifier, score 0-100 on the weighted rubric. Compare to best-so-far. **ROLLBACK:** if the revision regresses the total or reintroduces a CONFIRMED defect, discard it and keep the prior best. Maintain a best-so-far pointer (or a small Pareto set when metrics conflict).
*Exit:* score recorded, best-so-far pointer updated (kept or rolled back).

**6. CONVERGENCE GATE** — *Decide stop vs iterate without looping forever or quitting early.*
Completeness critic: "what's still uncovered — an angle unsearched, a claim unverified, an edge case untested, a cap that silently dropped items?" Non-empty → that list seeds the next iteration's Stage 3. Log any coverage limit explicitly.
*Exit:* STOP if total ≥ 90 AND zero CONFIRMED blockers; OR plateau (2 iterations gain < 3 pts); OR budget reached (default 4, scaled to tier). Else loop back to Stage 3 with the completeness list.

**7. FINALIZE** — *Emit the best-so-far cleanly, per contract.*
Return the highest-scoring candidate (graft best elements from runners-up if multiple). Conform exactly to the output contract. Separate body from citations. State residual uncertainty, assumptions, and any logged coverage limits up front rather than burying them.
*Exit:* output matches contract; uncertainties + caps disclosed; sources attached to load-bearing claims.

---

## Scoring rubric (0-100)

| Dimension | Weight | 0 → max |
|-----------|:------:|---------|
| Clarity | 15 | confusing/contradictory → single crystal interpretation a fresh reader follows |
| Specificity | 20 | generic → precisely on-target, correctly scoped, no drift, no unrequested work |
| Structure | 15 | wall of text → cleanly partitioned (sections/XML), data separated from instructions |
| Reasoning scaffold | 15 | leap-to-conclusion or padding → right-sized decomposition/depth for the difficulty |
| Output contract | 20 | off-format → exact match to schema/format/length, parseable, no stray preamble |
| Robustness | 20 | fragile/unverified → survives verification, edges handled, uncertainty stated, no silent caps |

**Any CONFIRMED critical defect caps Robustness ≤5 and total ≤70.**

**Convergence — stop on the FIRST that triggers, return best-so-far:**
- **ACCEPT** — total ≥ 90 AND zero CONFIRMED blockers AND every dimension ≥ 60% of its max.
- **PLATEAU** — two consecutive iterations gain < 3 total points.
- **BUDGET** — max iterations reached (default 4; quick-check 1-2, audit 5-6).
- **ROLLBACK** — discard any regressing/defect-reintroducing revision; keep prior best.

---

## The 15 levers (why they matter + how to apply)

1. **External-signal gating + best-so-far rollback** *(verification)* — The most important rule: ungrounded intrinsic self-correction often DEGRADES reasoning (ICLR'24). The loop is only trustworthy if revisions are gated on a real signal and you can never ship worse than a prior draft. *Apply:* name a signal (tests/execution/tool/retrieval/rubric/vote); accept a revision only if the signal improves or holds; if none exists, refine but never overwrite a correct closed-form answer "on reconsideration."

2. **Generator–Critic separation (adversarial, default-skeptical)** *(loop)* — A critic sharing the generator's persona inherits its blind spots. *Apply:* critique as a distinct persona instructed to REFUTE and default-refuted-when-uncertain. Thorough work → 3-5 votes, keep only on < majority refute. Solo → fresh skeptical re-read before committing.

3. **Calibrated verdicts CONFIRMED / PLAUSIBLE / REFUTED (plausible-by-default)** *(verification)* — Binary pass/fail loses calibration; it both over-trusts and over-rejects. *Apply:* CONFIRMED = triggering input + wrong output, quote the line. PLAUSIBLE = mechanism real, trigger uncertain (state what would confirm). REFUTED = factually wrong / provably impossible / already-guarded (quote proving line) / pure style. Default realistic-but-uncertain → PLAUSIBLE.

4. **Chain-of-Verification** *(verification)* — Answering verification questions in isolation from the draft removes the draft's bias; cheap, tool-free anti-hallucination. *Apply:* draft → 3-7 factual verification Qs → answer in a FRESH context that does NOT see the draft → rewrite consistent with verified facts, drop anything contradicted.

5. **Reflexion memory buffer (verbal gradients)** *(loop)* — Converts pass/fail into a written lesson stored across attempts, so iterations improve instead of repeating mistakes. *Apply:* after each weak attempt write 3-5 sentences (what tried, why failed, lesson); prepend to next attempt; cap trials, stop on success.

6. **Self-Refine with localized, evidence-cited feedback** *(loop)* — Rich textual feedback carries far more optimization signal per iteration than a scalar (the GEPA/TextGrad lesson). *Apply:* critique points at concrete spans/lines/failing tests and says exactly how to fix each. Never accept "7/10, improve it." Critic emits an explicit stop token (ACCEPT / NO_FURTHER_CHANGES) when clean.

7. **Decompose into orthogonal angles / least-to-most** *(decomposition)* — One query has blind spots; ordered sub-problems beat a single pass on compositional/discovery tasks. *Apply:* enumerate 3-6 orthogonal angles (simplest-first), solve sequentially feeding earlier answers forward, then compose. Discovery → sweep by-file/by-entity/by-time. Scout cheaply inline to find the work-list, THEN fan out.

8. **Loop-until-dry + completeness critic + no-silent-caps** *(loop)* — Fixed `while count<N` loops miss the tail; silent truncation makes partial coverage masquerade as complete. *Apply:* repeat finding rounds until K=2 rounds yield zero NEW items; dedup against the SEEN set (not confirmed, or rejects reappear forever). End with a critic listing what's still uncovered. Log every coverage bound.

9. **XML tags + separate data from instructions** *(structure)* — Claude is trained to attend to XML delimiters; tagging removes ambiguity and mitigates injection. *Apply:* wrap parts in `<instructions>`/`<context>`/`<data>`/`<example>`, reference by name ("using only the text in `<data>`"). Put variable/user content inside tags so it's never read as a command.

10. **Few-shot examples (relevant, diverse, structured)** *(context)* — Showing beats telling — highest-ROI lever for locking format/tone/decision boundaries. *Apply:* 2-5 examples in `<example>` tags covering edge cases + the full label space, format identical to desired output. If unstable, fix order and test a couple orderings.

11. **Explicit output contract (schema / structured output)** *(output-format)* — "Reply only in JSON" prose silently breaks; a real contract guarantees parseable output. *Apply:* state the exact shape + give a template to fill; use provider-enforced structured outputs / constrained decoding when available; still validate types/ranges/cross-field consistency downstream.

12. **Be clear and direct: state scope, add the WHY** *(Claude-specific)* — Opus 4.8 follows literally and won't silently generalize scope; explaining WHY lets it generalize correctly to unenumerated cases. *Apply:* treat the model like a brilliant new hire — spell out what to do, in order, with constraints; say when a rule applies broadly ("every section, not just the first"); append rationale to non-obvious rules; prefer positive directives over "don't."

13. **Scale effort to the ask (adaptive thinking + effort)** *(Claude-specific)* — Right-sizing rigor avoids under-thinking hard problems and over-spending on trivial ones; on current models shallow reasoning is fixed by raising effort, not by scripting more loop stages. *Apply:* "quick/just-check" → 1 pass + single verify; "audit/comprehensive" → wide fan-out + 3-5 votes + synthesis. Opus 4.8 → effort high/xhigh + large (64k) output budget for intelligence-sensitive work; lower for scoped latency-sensitive tasks. Steer thinking with one line ("think carefully" / "when in doubt respond directly").

14. **Self-consistency / breadth sampling + judge panel** *(verification)* — Much apparent "self-correction" gain is really averaging out inconsistent errors; sampling breadth then selecting beats iterating one draft when the space is wide. *Apply:* closed-form → sample N CoT paths at temp>0, take the modal answer. Open design → independent candidates from different priorities, score each on the same rubric, synthesize the winner + graft best of runners-up.

15. **Hallucination guard: explicit "out" + quote-then-answer** *(verification)* — Permitting "I don't know" and forcing evidence quoting sharply cuts fabrication in RAG/factual/compliance. *Apply:* "If the answer is not in `<context>`, reply exactly: Not found in source. Before answering, quote the supporting sentence in `<evidence>`." Constrain grounded tasks to provided context.

---

## Domain adapters

- **Trading / quant** — signal = backtest under walk-forward + DSR + regime/CPCV; a strategy is REFUTED the moment out-of-sample or a robustness test falsifies it. CRITIQUE hunts look-ahead / survivorship / overfit; require EV + win-rate + sample size (n) before any claim is PLAUSIBLE. "Passes in-sample" = CONFIRMED-nothing. Convergence = edge survives all four validators, not a high Sharpe.
- **Memecoin / KOL signal validation** — signal = FORWARD precision/WR/ROI over n trades in a stated window, never the caller's self-report. Every claim PLAUSIBLE until forward-validated; default-refute survivorship framing (only winners shown). Require explicit n + window + filter definition; log skipped/losing trades. Shippable only with positive EV/trade AND forward confirmation.
- **UE5 game dev (3D game)** — mandatory PERFORMANCE lens every CRITIQUE (draw calls, World Partition streaming, replication/network cost, memory, shader/material complexity, scalability on non-extreme PCs). Every verdict states altitude (prototype / vertical-slice / production). Benchmark vs named shipped titles in the genre ("plays like X, looks like Y"). Grounding = a LIVE playtest with cvars+logs that *I* run, not an assertion. Identity-threatening or perf-regressing decision = CONFIRMED-blocker.
- **Web / app micro-business (web app, report tool, browser game)** — effort tier = lean (1 builder + 1 verify, no panels/votes). Grounding = a FUN/utility gate + smallest shippable slice tested against a real user task, not feature count. Favor ship-then-measure over polish; ROBUSTNESS = "does the core loop work for one real user." Keep human curation gates where correctness is non-recoverable (e.g. PDF report accuracy). Minimal markdown.
- **Deep research / audits** — full 5-phase: Scope (4-6 blind angles) → Search (parallel) → Fetch (dedup by normalized URL, 2-5 FALSIFIABLE claims each w/ quote + source-quality) → Verify (3-vote adversarial, kill on 2/3 refute, default-refuted) → Synthesize (merge semantic dupes, rank by confidence × source quality). Rank-then-cap before the expensive verify; completeness critic at the end; separate prose body from citation list; never fabricate on a failed fetch (return claims:[]).

---

## Antipatterns

- Ungrounded self-correction rewriting a correct answer "on reconsideration" — gate on a signal or keep best-so-far.
- No rollback — letting a lower-scoring or defect-reintroducing revision ship.
- Same persona for generator and critic — self-bias rubber-stamps the draft.
- Bare-scalar feedback ("7/10, make it better") instead of localized, cited fixes pointing at concrete spans/lines/failing tests.
- Fixed `while count<N` discovery loops that miss the tail; deduping found items against the CONFIRMED set instead of the SEEN set (rejects reappear, never converges).
- Silent caps — truncating top-N / sampling / skipping retries, then presenting partial coverage as complete.
- Persona cargo-cult — "you are a world-class expert" to boost *factual* accuracy (controlled studies: no consistent gain; personas help tone/style only).
- Acronym-framework stacking (CRISPE/RISEN/RACE/TAG/COSTAR/CARE) — collapses to role+context+task+constraints+format; keep the primitives, drop the mnemonics + tokens.
- "Think step by step" on reasoning-tuned models (redundant, +20-80% latency); negation-heavy "don't do X" the model overlooks.
- "Reply only in JSON" prose instead of a real schema / structured output / constrained decoding.
- Looping with no budget/plateau exit (burns past convergence); or quitting after one pass when the ask said "audit/thorough."
- Prefilling the LAST assistant turn on Claude 4.6+/Opus 4.8 (HTTP 400) — use structured outputs / tool enums / "respond without preamble" instead.

---

## Quick pre-flight checklist

1. Write objective, audience, success criteria, EXACT output contract — before drafting.
2. Pick effort tier (quick / standard / audit); size the loop to it.
3. Decompose into 3-6 orthogonal angles, simplest-first; scout inline, then fan out.
4. Separate data from instructions with XML tags; long context on top, ask last; quote evidence before answering.
5. Name the external verification signal; if none, refine only — never overwrite a correct answer on vibes.
6. Critique with a distinct skeptical persona; label CONFIRMED / PLAUSIBLE / REFUTED, plausible-by-default.
7. Localized, evidence-cited feedback; for facts, answer verification questions blind to the draft.
8. Score on the rubric each iteration; roll back any regression (keep best-so-far).
9. Keep a Reflexion note (what failed + lesson); prepend next iteration.
10. Run a completeness critic; log any caps/dropped items before declaring done.
11. Exit at score ≥ 90 (zero CONFIRMED blockers) / plateau < 3 pts ×2 / budget; emit per contract with citations + stated uncertainty.
12. Prefer positive directives, state scope explicitly, raise effort rather than padding with redundant CoT.

---

## Copy-paste master template

The full subject-agnostic template (with `{{SUBJECT}}` placeholder) lives in the skill at
`<CLAUDE_SKILLS_DIR>\prompt-master\SKILL.md` under "Copy-paste master template" — paste it, fill `{{SUBJECT}}` and `<output_contract>`, run.

---

## Provenance

Synthesized 2026-06-13 from a 7-agent research workflow (`master-prompting-loop-research`, run `wf_5c962f21-b39`): 95 raw techniques → deduped/ranked to 15 levers + 8-stage loop. Sources spanned: local `/loop` + `/deep-research` skills; Anthropic prompt-engineering docs; web SOTA (Self-Refine, Reflexion, Chain-of-Verification, OPRO, APE, DSPy, TextGrad/GEPA, self-consistency, ToT); top GitHub frameworks (anthropics/prompt-eng-interactive-tutorial, dair-ai/Prompt-Engineering-Guide, stanfordnlp/dspy, microsoft/promptflow, learnprompting). Key falsification: *LLMs Cannot Self-Correct Reasoning Yet* (ICLR 2024) — the reason the loop is grounding-gated, not vibes-based. (Domain-tuning agent failed on API-overload; adapters synthesized from user context instead.)
