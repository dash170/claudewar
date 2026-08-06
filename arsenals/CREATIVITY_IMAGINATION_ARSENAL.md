# THE CREATIVITY & IMAGINATION ARSENAL — Claude Code

*How to make Claude maximally creative, imaginative, inventive on ANY project. From a 9-agent A-Z deep-search (wf wvxx6avf3, 2026-06-20): 8 clusters, 105 items, skills.mp + GitHub + research. Owner rule: FREE permissive first. Companion to `PROMPTING_ARSENAL_CLAUDE_CODE.md` — that one makes output CORRECT (convergent); this one makes it ORIGINAL (divergent). Use both: diverge to invent, then converge to ship. Caveat: WebFetch was hook-intercepted, so most repo licenses are repo-stated not file-verified (only davila7 = MIT confirmed) — read LICENSE before vendoring.*

## TL;DR — how to make Claude maximally creative

- **Bolt a divergent pre-loop in front of the Master Loop.** The convergent loop optimizes quality and *crushes* originality by design; an IMAGINATION MODE runs *before* FRAME and only hands survivors to it. LLMs fixate on the first idea ([Exploration vs Fixation, 2512.18388](https://arxiv.org/abs/2512.18388); [CreativeDC, 2512.23601](https://arxiv.org/abs/2512.23601)).
- **Use Verbalized Sampling, not temperature.** Ask for *k* candidates each tagged with a probability and mine the low-probability tail — ~1.6–2.1× idea diversity, works on Claude via plain prompt ([CHATS-lab/verbalized-sampling, Apache-2.0](https://github.com/CHATS-lab/verbalized-sampling)). Temperature buys incoherence, not novelty ([2405.00492](https://arxiv.org/abs/2405.00492)).
- **Rotate forced operators, don't free-associate.** Run the artifact through SCAMPER's 7 verbs, a TRIZ contradiction→principle lookup, a morphological/Zwicky box, and one analogical/bisociation leap — each manufactures branches a freeform pass skips.
- **Generate the analogy BEFORE solving.** "Name a distant domain with this problem's relational structure; solve it there; map the mechanism back" — +90–173% solution diversity ([Analogical Reasoning, 2605.11258](https://arxiv.org/abs/2605.11258)).
- **Run a conflicting-persona ensemble, blind.** 4–6 heterogeneous personas (contrarian, naive outsider, domain-maximalist, constraint-lover) brainstorm in parallel and write before seeing each other, then merge ([2512.04488](https://arxiv.org/abs/2512.04488); [2507.08350](https://arxiv.org/abs/2507.08350)).
- **Inject random constraints to derail the median.** One Oblique Strategies card per stuck iteration ([joelparkerhenderson/oblique-strategies](https://github.com/joelparkerhenderson/oblique-strategies)).
- **Score for NOVELTY separately from value, and dedup.** Partition k outputs into distinct equivalence classes (distinct_k) + semantic spread before converging — bigger models mode-collapse, so "more samples" ≠ "more ideas" ([NoveltyBench](https://novelty-bench.github.io/); [Stanford 2409.04109](https://arxiv.org/abs/2409.04109)).
- **Keep "rare ∩ good," not "best."** Select the rarest candidate that still clears the quality bar; Pareto archive, not one winner ([DivPO, 2501.18101](https://arxiv.org/abs/2501.18101)).
- **Recombine in structure space, not token space.** Lift ideas to an abstract tree, recombine via edit-distance, translate back ([Cooking Up Creativity, 2504.20643](https://arxiv.org/abs/2504.20643)).
- **Always pair divergence with the existing convergence gate.** Wild ideas are useless un-built; the Master Loop is the feasibility filter that keeps output shippable.

## The IMAGINATION MODE — a divergent layer for the loop

A divergent pre-loop that runs **before Stage 0 (FRAME)**. It generates many wild candidates, scores them for *novelty* (not quality), hands the best 2–3 survivors to the existing convergent loop. It never touches the quality machinery — only feeds it better raw material. ([2512.18388](https://arxiv.org/abs/2512.18388), [2512.23601](https://arxiv.org/abs/2512.23601)).

**Anti-fixation rule (whole time):** ban the first/obvious answer; require *K* genuinely distinct directions before convergence. *K* scales with effort: quick = 4, standard = 8, audit = 12.

### Stages

**I0 — IGNITE (seed, don't start from the literal brief).** Three ways, pick the most generative:
- *Emotional seed* — start from a feeling, not a premise ([worldbuilding-sdd](https://github.com/bathrobe/worldbuilding-sdd)).
- *Oracle collision* — draw 2 random words from a themed table + one random distant-domain noun, FORCE a single coherent interpretation (re-implement Mythic-GME meaning-table — best surprise-injector; [Worldbuilding-Prompt-Generator](https://github.com/apdupuis/Worldbuilding-Prompt-Generator)).
- *Minimal-context reframe* — compress brief to ONE keyword, span from there ([LiveIdeaBench, 2412.17596](https://arxiv.org/abs/2412.17596)).
- *Seed-conditioning* — prepend a random rare noun → different latent leap per run; more genuinely distinct than raising temperature ([2504.15266](https://arxiv.org/abs/2504.15266)).

**I1 — DIVERGE (generate-many via operator rotation × persona ensemble × forced randomness).** **Verbalized Sampling** as the generation primitive everywhere: "produce *k* candidates each tagged with its probability; favor the low-probability tail" ([VS](https://github.com/CHATS-lab/verbalized-sampling)). Fan out across three operator families ([creative-director-skill](https://github.com/smixs/creative-director-skill) tri-lens):
- *Structural* — SCAMPER 7 verbs, TRIZ contradiction→principle, Morphological/Zwicky box.
- *Collision* — Bisociation, Random Entry, Synectics analogy, Biomimicry function-transfer ([AskNature](https://asknature.org/)).
- *Inversion* — Reverse-brainstorm, Worst-possible-idea, **Denial prompting** (after each idea, ban the approach just used, solve again — [2407.09007](https://arxiv.org/abs/2407.09007)), Po provocation, First-principles.
Under a **conflicting-persona ensemble** (4–6 heterogeneous personas writing *blind*, then merging) + **branch isolation** ([ADHD skill](https://github.com/UditAkhourii/adhd)).

**I2 — RECOMBINE in structure space.** Lift each survivor to an abstract tree, recombine by min edit-distance, translate back ([Cooking Up Creativity, 2504.20643](https://arxiv.org/abs/2504.20643)). Blends: abstract up a generalization level → retrieve cross-domain analogues → recombine → *name the emergent property* ([2412.14141](https://arxiv.org/abs/2412.14141)).

**I3 — NOVELTY SCORE & SPREAD GATE (the part the Master Loop lacks).** Score on *originality*, not correctness:
- *distinct_k* — partition k candidates into functionally-distinct classes ("would a user benefit from seeing both?"); keep one best per class, drop paraphrases ([NoveltyBench](https://novelty-bench.github.io/)).
- *Semantic spread* — embed candidates, mean pairwise cosine distance; reject low-spread (clustered/clichéd) batches ([DAT](https://github.com/jayolson/divergent-association-task); [SemDis](http://semdis.wlu.psu.edu/)). Single artifact → within-text conceptual reach ([DSI, PMC10615993](https://pmc.ncbi.nlm.nih.gov/articles/PMC10615993/)).
- *Two-stage anti-cliché* — cheap n-gram-overlap flag, THEN LLM-as-judge for *conceptual* clichés (~91% of n-gram-"novel" phrases aren't actually creative — never trust word-rarity alone; [2509.22641](https://arxiv.org/abs/2509.22641)).
- *Multi-axis rubric* — novelty / surprise / diversity / usefulness as SEPARATE gates so value can't silently override originality ([CrPO, 2505.14442](https://arxiv.org/abs/2505.14442)).
- *Selection* — keep **rare ∩ good**: rarest candidate that still clears a min quality bar ([DivPO, 2501.18101](https://arxiv.org/abs/2501.18101)); maintain a novelty *archive* (Pareto), not one winner ([Lluminate](https://github.com/joel-simon/lluminate); [ELM, 2206.08896](https://arxiv.org/abs/2206.08896)).
- *Stop rule* — generate-till-you-repeat: reject any candidate cosine-sim > threshold to a prior; stop after N consecutive rejects ([AidanBench](https://github.com/aidanmclaughlin/AidanBench)).

**I4 — STRESS-TEST (constructive, not lethal).** Steelman each survivor, then pre-mortem / red-team across a few lenses ([The Fool](https://github.com/Jeffallan/claude-skills/blob/main/skills/the-fool/SKILL.md)). Kill fragile-AND-derivative; keep surprising-but-buildable. Only place ideas die — *after* divergence so fragile-but-original ideas aren't killed at birth.

**I5 — SELECT & HANDOFF.** Top 2–3 distinct survivors on the novelty × feasibility frontier → Master Loop **Stage 0 FRAME** as the candidate set. Convergent loop then grounds, critiques, refines, ships — on already-original material.

**Flow:** `IGNITE (random seed) → DIVERGE (VS × operator rotation × persona ensemble, K distinct, ban-the-obvious) → RECOMBINE (structure space) → NOVELTY-GATE (distinct_k + spread + anti-cliché + rare∩good) → STRESS-TEST (steelman→pre-mortem) → top-3 → [existing FRAME→…→FINALIZE]`.

## INSTALL/ADOPT NOW (free)

| # | Thing | URL | License | Creativity boost (actionable mechanic) |
|---|-------|-----|---------|----------------------------------------|
| 1 | Verbalized Sampling | https://github.com/CHATS-lab/verbalized-sampling | Apache-2.0 | "give 8–12 candidates each with a probability; favor the tail." Drop-in generate-N, ~1.6–2.1× diversity, orthogonal to temperature. |
| 2 | creative-director-skill (smixs) | https://github.com/smixs/creative-director-skill | verify | 3 parallel ideation lenses (structural/collision/inversion), scores vs a 571-campaign anti-cliché corpus, re-attacks weakest criterion with a *different* method each pass. |
| 3 | claude-brainstorm (MadeByTokens) | https://github.com/MadeByTokens/claude-brainstorm | verify | PreToolUse hook that *blocks* solution/code output, holds Claude divergent until a quota is met. Structural cure for premature convergence. |
| 4 | ADHD skill (UditAkhourii) | https://github.com/UditAkhourii/adhd | verify | Tree-of-thought: N *isolated* parallel branches each under a distinct frame, then a separate critic prunes + deepens. |
| 5 | scientific-brainstorming (davila7) | https://github.com/davila7/claude-code-templates | MIT (confirmed) | Combinatorial: morphological matrix + TRIZ principles + biomimicry transfer. Cross-domain combos freeform won't reach. |
| 6 | oblique-skill (jakedahn) | https://github.com/jakedahn/oblique-skill | verify | `/oblique` draws random constraint cards mid-task — forced lateral jolt when converging too fast. |
| 7 | oblique-strategies (deck) | https://github.com/joelparkerhenderson/oblique-strategies | text (card © Eno/Schmidt) | Machine-readable deck; inject 1 random card per iteration as a mutation operator. |
| 8 | The Fool (Jeffallan) | https://github.com/Jeffallan/claude-skills | verify | Steelmans then attacks via Socratic / pre-mortem / red-team / evidence-audit. The constructive STRESS-TEST. |
| 9 | DAT semantic-distance scorer | https://github.com/jayolson/divergent-association-task | PNAS 2021 | Concrete originality score: embed candidates, mean pairwise distance; reject clustered batches. |
| 10 | NoveltyBench (distinct_k) | https://novelty-bench.github.io/ | open | Partition k generations into classes; keep best-per-class. Verifies a divergence stage truly diverged. |
| 11 | AidanBench | https://github.com/aidanmclaughlin/AidanBench | verify | Generate-till-you-repeat + embedding-novelty score with a hard stop rule. |
| 12 | Lluminate (Joel Simon) | https://github.com/joel-simon/lluminate | verify | Quality-diversity engine: mutate each candidate with a random strategy card, keep a novelty archive, iterate. |
| 13 | Anthropic frontend-design skill | https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md | Anthropic | Commit to ONE named aesthetic up front, hard-ban AI-default moves (overused fonts, purple gradients, centered hero). Anti-cliché ruleset for visual work. |
| 14 | Machinations.io | https://machinations.io/ | freemium | Game/economy mechanic as a node graph; emergence = add an edge between two unconnected resources. |
| 15 | Three Hundred Mechanics | https://www.squidi.net/three/ | free | Forced-collision deck: draw 2–3 random mechanic numbers, mash onto your core verb. |

## Ideation frameworks to inject

Drop verbatim into DIVERGE:
- **SCAMPER** — "Run the artifact through all 7 verbs; ≥1 concrete idea per verb before evaluation: Substitute, Combine, Adapt, Modify/Magnify, Put-to-other-use, Eliminate, Reverse." Combine/Reverse/Put-to-other-use = mashup generators.
- **TRIZ contradiction matrix + 40 principles** — "State the contradiction as *improving A worsens B*, look up the matrix cell, instantiate ONLY the 3–4 returned principles (#13 The Other Way Round, #1 Segmentation, #15 Dynamization, #40 Composite)." Add: "for principle X give 3 concrete mechanisms, keep the most surprising-yet-buildable" ([TRIZ-GPT 2408.05897](https://arxiv.org/abs/2408.05897); [AutoTRIZ](https://github.com/shuojiangcn/AutoTRIZ-Repository)).
- **Morphological / Zwicky box** — "Decompose into 3–5 independent axes, list options per axis, force-combine one per axis *including illegal/surprising cells*, prune by cross-consistency."
- **Analogical reasoning** — "Name a DISTANT domain sharing this problem's relational structure; solve THERE; map back." Highest-leverage single move.
- **Bisociation / forced connection** — "Two unrelated domains, find the one point where structures intersect, build on that collision."
- **Lateral: Random Entry + Po** — Random Entry: "random noun → 5–6 attributes → force-connect each." Po: "assert something impossible ('the building has no doors'), harvest the movement."
- **Six Thinking Hats** — "Green Hat (wild ideas) as a dedicated pass; FORBID Black Hat (critique) during it."
- **Synectics** — Personal Analogy: "become the object." Fantasy Analogy: "magic-wand solution, then reverse-engineer toward feasibility."
- **Biomimicry** — "Restate as a pure function, retrieve a biological strategy, transfer the mechanism."
- **Denial prompting (ratchet)** — "After each idea, ban the approach just used; solve again without X, then without X and Y."
- **Inversion + First-principles** — "What would GUARANTEE failure? enumerate, avoid each." / "Strip to atomic truths, discard inherited assumptions, rebuild."
- **Oulipo constraints** — N+7/lipogram/snowball: "mechanical transform the draft, mine surprising mutations for keepers."
- **Crazy 8s / How-Might-We** — "8 ideas in 8 minutes" + reframe one problem into many HMW framings.

## Per-domain creative boosts

- **Game design (games)** — **Verb → Object → Consequence → Feedback-loop → Twist** pipeline: (1) perturb a player VERB (swap, smuggle, mourn, ferment, snitch — not genre defaults), (2) cross vs world OBJECTs on a grid, (3) force a feedback loop in [Machinations](https://machinations.io/) (emergence = a new edge between two unconnected resources → applies to a token loop + a survival loop), (4) add a Twist that VIOLATES a [400-Project](https://www.theinspiracy.com/the-400-project.html) rule, make the violation the fun. Feed forced collisions from [Three Hundred Mechanics](https://www.squidi.net/three/) + 3 random Deck of Lenses cards. Run [MDA](https://users.cs.northwestern.edu/~hunicke/MDA.pdf) backwards: target aesthetic ("paranoia"/"greed"/"belonging") → dynamics → novel mechanics.
- **Art / asset direction** — Hold SUBJECT constant, sweep STYLE: N-wide styled-variant matrix via [SDXL Prompt Styler](https://github.com/twri/sdxl_prompt_styler) (~80 templates) + [DynamicPrompts](https://github.com/adieyal/comfyui-dynamicprompts) `{a|b|c}`/wildcard sweeps; stack two stylers for cross-genre fusion ([PromptStylers](https://github.com/wolfden/ComfyUi_PromptStylers)). Pick *remote* references deliberately ([Styles-SD35L](https://github.com/EnragedAntelope/Styles-SD35L)). Force one named aesthetic + ban AI-defaults ([frontend-design skill](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md)).
- **Product / micro-business** — Staged pipeline separating DIVERGE from EVALUATE: Seed → Diverge → Evaluate → Deepen → Frame → Decide. Offer via morphological sweep (axis = customer × pain × channel × pricing × wedge), force-combine surprising cells, then gate with the micro-business adapter (FUN/utility gate + smallest slice). Denial prompting to escape the "another SaaS dashboard" attractor.
- **Trading hypotheses** — Analogical transfer for non-obvious edges ("what distant domain has this microstructure's relational shape — queueing theory, epidemiology, auction design?"), Inversion for falsifiers ("what would GUARANTEE this edge is fake? test each"). CRITICAL: every hypothesis is a *hypothesis only* until it survives the trading adapter (walk-forward + DSR + CPCV); divergence expands the *search*, never the *belief* — matches the standing "all edges unvalidated" rule.
- **Writing / worldbuilding** — EMOTIONAL seed + a stress-test stage poking for contradictions before locking ([worldbuilding-sdd](https://github.com/bathrobe/worldbuilding-sdd)). Oracle meaning-table for non-obvious twists. Promise/Payoff + Chekhov-gun ledger as *generative* pressure ([story-skills](https://github.com/danjdewhurst/story-skills)). Persona-agent ensemble, each owning one craft axis (architect/character/prose/continuity) ([howells/fiction](https://github.com/howells/fiction)).

## LLM-creativity levers (sampling, ensembles, divergent-then-convergent)

- **Verbalized Sampling (VS)** — k candidates + probabilities, sample the tail. ~1.6–2.1× diversity, training-free, Claude-API-native ([github](https://github.com/CHATS-lab/verbalized-sampling)). Highest-leverage prompt-time lever.
- **Min-p sampling** (self-hosted only — vLLM/llama.cpp) — dynamic truncation; push temp 1.5–3.0 for variety while coherent ([2407.01082](https://arxiv.org/abs/2407.01082)). NOT on Claude API; note for SDXL/asset pipelines.
- **Over-generate-and-rerank** — many candidates → LLM-rerank top-k; ideas judged *more* novel than human experts. Caveat: diversity plateaus under naive scaling → MUST insert dedup/novelty filter between generate and rank ([Stanford 2409.04109](https://arxiv.org/abs/2409.04109)).
- **Persona / multi-agent ensembles** — heterogeneous personas widen coverage; diversity rises with cohort size × dialogue depth × heterogeneity ([2512.04488](https://arxiv.org/abs/2512.04488)). Use occupations/eras/value-systems, not "expert vs expert."
- **Multi-View priming** — auto-derive 4–6 contrasting lenses, one idea per lens before free generation ([2502.12700](https://arxiv.org/abs/2502.12700)).
- **Structured recombination** — creative leap in abstract tree space, recombine via edit-distance, gate through novelty scorer ([2504.20643](https://arxiv.org/abs/2504.20643)).
- **Seed-conditioning + plan-before-write** — random seed/rare-noun token → different latent leap per run; add a planning step for coherence ([2504.15266](https://arxiv.org/abs/2504.15266)).
- **Quality-Diversity (ELM / MAP-Elites)** — 2–3 behavior axes, archive of best-per-cell (not one global best), LLM mutates cells ([ELM 2206.08896](https://arxiv.org/abs/2206.08896); [Lluminate](https://github.com/joel-simon/lluminate)).
- **Two-phase divergent→convergent scaffold** — pure EXPLORE (no quality filter), then SEPARATE convergent stage. Exactly the IMAGINATION-MODE-then-Master-Loop shape ([CreativeDC 2512.23601](https://arxiv.org/abs/2512.23601)).

## Originality / anti-cliche scoring

The Master Loop rubric rewards correctness; no novelty term → it quietly prefers the safe median. Add:
- **distinct_k** — sample k responses, cluster into equivalence classes, push for higher distinct_k. *Bigger models are often LESS diverse* ([NoveltyBench](https://novelty-bench.github.io/)).
- **Semantic-distance spread** — embed ideas, mean pairwise distance; reject clustered batches ([DAT](https://github.com/jayolson/divergent-association-task); [SemDis](http://semdis.wlu.psu.edu/)).
- **DSI (within-artifact reach)** — for one story/pitch/design doc, mean pairwise embedding distance across the text; explains ~72% of human originality ratings ([PMC10615993](https://pmc.ncbi.nlm.nih.gov/articles/PMC10615993/)).
- **Two-stage cliché detector** — n-gram-overlap flag → LLM-as-judge conceptual pass. ~91% of n-gram-"novel" phrases NOT judged creative ([2509.22641](https://arxiv.org/abs/2509.22641)).
- **Multi-axis rubric** — novelty / surprise / diversity / value as separate gates ([CrPO 2505.14442](https://arxiv.org/abs/2505.14442)).
- **Selection: rare ∩ good** — keep the rarest that clears the quality bar ([DivPO 2501.18101](https://arxiv.org/abs/2501.18101)).
- **Novelty × value frontier** — goal = Pareto frontier of original AND high-quality, not max novelty (= noise) ([2504.09389](https://arxiv.org/abs/2504.09389)).

Caveat: all validated text scorers (DAT/DSI/SemDis) are English-embedding based — weak/untested for FR/ZH/PT/ES; no validated *visual* originality scorer (CLIP-embedding diversity would be DIY for furni/facade/art).

## skills.mp creative findings

`skillsmp.com` surfaced no dedicated, exclusive creativity skill in search; the storefronts that appeared (mcpmarket.com, claudemarketplaces.com, agentskills.so) are mostly **re-packagers of free GitHub skills** — little reason to buy.
- The genuinely useful creative skills (creative-director-skill, claude-brainstorm, ADHD, oblique-skill, The Fool, davila7 scientific-brainstorming) are all free GitHub repos above. The marketplace `creative-brainstorming-ideation` ([mcpmarket](https://mcpmarket.com/tools/skills/creative-brainstorming-ideation)) appears to repackage davila7's MIT skill — install the [MIT original](https://github.com/davila7/claude-code-templates).
- Free discovery hubs to keep mining: [travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills) (filters commercial-funnel submissions), ComposioHQ/awesome-claude-skills, VoltAgent/awesome-agent-skills.
- Paid: nothing creativity-specific that isn't a wrapper around a free asset. Treat these marketplaces as *discovery*, not purchase.

## PAID — worth-the-money appendix

- **Mythic GME 2e** ([wordmillgames](https://www.wordmillgames.com/page/mythic-gme.html)) — canonical Oracle (Yes/No fate + Chaos Factor + 45 Meaning Tables). Method isn't copyrightable → re-implement free; buy the book only for polished tables.
- **77 Design Heuristics** ([designheuristics.com](https://www.designheuristics.com/)) — 77 validated transformation operators; documented in open-access papers. Source the papers; skip the deck.
- **Midjourney --chaos / --weird / --sref** ([docs](https://docs.midjourney.com/hc/en-us/articles/32099348346765-Chaos-Variety)) — only item with *quantified* visual divergence dials. Worth it if image divergence is a real bottleneck; free SDXL styler matrix covers most.
- **A Game Design Vocabulary** (Anthropy & Clark) — method (verb × object grid) free to apply; book optional.
- **Deck of Lenses** (Schell) — free companion app exists; only physical deck paid. Use the free app.

## GAPS / cargo-cult to avoid

- **Cranking temperature to "be creative."** Correlates with incoherence, only weakly with novelty ([2405.00492](https://arxiv.org/abs/2405.00492)). Spend budget on structural methods (VS, recombination, personas, oracle seeds, novelty scoring).
- **Trusting word-rarity / n-gram novelty.** ~91% of n-gram-"novel" phrases aren't creative ([2509.22641](https://arxiv.org/abs/2509.22641)). Always add the LLM-judge conceptual pass.
- **Naive sample-scaling = more ideas.** Diversity plateaus, duplicates after a burst; scaling can *reduce* diversity ([2409.04109](https://arxiv.org/abs/2409.04109)). Insert a dedup/novelty filter.
- **Assuming the bigger model is more creative.** Larger models often mode-collapse *more* ([NoveltyBench](https://novelty-bench.github.io/)). Diversity is a scaffolding property, not a free capability.
- **"You are a world-class creative genius" persona.** Single flattering persona doesn't raise novelty; the lever is *conflicting* personas writing blind.
- **Divergence with no convergence gate.** Amplifies the ideation-execution gap → ships wild garbage. Divergence expands the search; convergence keeps it buildable.
- **Acronym-framework stacking (CRISPE/RISEN/COSTAR).** Value is in the *operators* (SCAMPER/TRIZ/morphological), not branded wrappers.
- **Treating Oblique/Random-word output as the answer.** It's a *perturbation* to mine, not a deliverable; inject a *fresh* random constraint at EACH iteration.
- **Unverified-license adoption.** Most community-skill licenses are repo-stated, not file-verified (only davila7 = MIT confirmed). Read LICENSE before vendoring.
- **Open build-opportunities (no single tool solves):** (1) no skill wires a divergence STAGE to an embedding novelty-score GATE — build divergence → DSI/SemDis → reject-low-distance yourself; (2) no game-specific "distance-from-genre-prior 0–5" novelty score; (3) no visual/multilingual originality scorer; (4) no free machine-readable 300 Mechanics / 400 Rules dataset. Natural next builds.

---

## CONCRETE SKILL ADDITIONS (apply to `prompt-master`)

1. **New `<imagination_mode>` section** — divergent PRE-LOOP before FRAME (IGNITE→DIVERGE→RECOMBINE→NOVELTY-GATE→STRESS-TEST→top-3→FRAME). Activate for open-ended/creative asks; skip for closed-form/correctness. *(2512.18388 / 2512.23601 / 2504.20643)*
2. **Verbalized Sampling = default generate-N primitive** in DRAFT/DIVERGE: "8–12 candidates each with probability; favor the tail." New lever. *(VS, Apache-2.0 / 2510.01171)*
3. **Novelty scorer on Stage 5 SCORE** — distinct_k + semantic spread + two-stage cliché detector; novelty/surprise/value as separate gates; selection = rare ∩ good + Pareto archive. *(NoveltyBench / DAT / DSI / 2509.22641 / CrPO / DivPO)*
4. **Anti-fixation rule in FRAME** for creative tasks — ban first/obvious; require K distinct directions (quick=4/standard=8/audit=12) before convergence + matching antipattern. *(2512.18388 / 2409.04109)*
5. **Operator-rotation menu as a DIVERGE resource** — SCAMPER / TRIZ / morphological / analogical / bisociation / denial-prompting / inversion; ≥1 idea per operator before evaluation. *(2605.11258 / SCAMPER / AutoTRIZ / 2407.09007)*
6. **UE5/game-systems divergence adapter** — Verb→Object→Consequence→Feedback-loop→Twist, fed by Three Hundred Mechanics + Machinations loop + 400-Project-violation Twist + "distance-from-genre-prior 0–5" check. For token-economy + survival-game systems. *(Anthropy/Clark / Machinations / squidi / 400 Project)*
7. **Adopt 3 free front-end skills** — creative-director-skill (tri-lens engine), claude-brainstorm (divergence-lock hook), ADHD (isolated branches + prune). Verify LICENSE first.

## TOP-6 INSTALL FIRST (free)

1. **Verbalized Sampling** — https://github.com/CHATS-lab/verbalized-sampling (Apache-2.0) — zero-infra, ~1.6–2.1× diversity, Claude-API-native.
2. **creative-director-skill (smixs)** — https://github.com/smixs/creative-director-skill — drop-in diverge-then-converge tri-lens engine + anti-cliché corpus.
3. **claude-brainstorm (MadeByTokens)** — https://github.com/MadeByTokens/claude-brainstorm — hook that blocks premature solutioning.
4. **ADHD skill (UditAkhourii)** — https://github.com/UditAkhourii/adhd — isolated parallel branches + critic prune.
5. **scientific-brainstorming (davila7, MIT)** — https://github.com/davila7/claude-code-templates — morphological + TRIZ + biomimicry combinators.
6. **DAT semantic-distance scorer** — https://github.com/jayolson/divergent-association-task — the "are these actually different?" originality gate.
