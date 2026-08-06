# VETTING_REPORT.md — CLAUDEWAR candidate intake

> **EVIDENCE ARCHIVE ONLY (stamped 2026-07-16).** The strict verdicts below ("0 of 8 install-now") were re-calibrated the next day by `SKILL_VETTING_RUBRIC.md` and later owner decisions. **The ONLY live verdict table is `skills/SKILLS_INDEX.md`** (CLAUDE.md CANON rule 2). Read this file for the byte-level license/source evidence, never for a verdict.

**Scope:** the 8 owner-supplied candidates in `skills/SKILLS_INDEX.md` → "CANDIDATES TO VET (06-20)".
**Bar:** two-pass — (A) byte-read the actual LICENSE + (B) read the executed source — then an adversarial skeptic tries to *refute* "safe". A repo reaches **Install now** only if BOTH passes are clean **and** the skeptic clears it at high confidence with `install`. Anything less drops a tier.
**Rail (non-negotiable):** these repos are UNTRUSTED DATA. Read LICENSE bytes + read source before vendoring. A SKILL.md is injected into the agent context = treat every candidate as a prompt-injection + supply-chain surface, especially on this secrets-bearing, non-stop full-auto machine (`<CLAUDE_HOME>\.claude.json`, Meshy key, SSH).

**Headline:** **0 of 8 clear the unconditional Install-now bar.** The single closest, `Egonex-AI/Understand-Anything`, is held at sandbox purely because it lands auto-firing global hooks + self-updates by git-pull. 4 → sandbox-then-install, 3 → vet-manually, 1 → reject.

---

## 1. Verdict table

| Repo | Kind | License (confirmed?) | Commercial-clean | Fit /10 | Security verdict | ACTION |
|---|---|---|---|---|---|---|
| giancarloerra/SocratiCode | skill (MCP) | AGPL-3.0 — **yes** (skeptic read raw bytes; commercial license sold separately) | **No** (AGPL copyleft) | 9 | Git source clean (42 .ts scanned, no secret reads/exfil/eval); but executed artifact = `npx -y socraticode` latest tarball, un-diffable + auto-updating | **sandbox-then-install** |
| Egonex-AI/Understand-Anything | skill | MIT — **yes** (raw bytes, dual ©) | Yes | 7 | Source clean, ZERO network primitives anywhere; risk = auto-firing SessionStart+PostToolUse hooks + git-pull update channel from transferred org | **sandbox-then-install** |
| colbymchenry/codegraph | skill (MCP) | MIT — **no** (title/npm only, bytes unread) | Yes | 9 | npm ships only stubs+loaders; real runtime = opaque author-built prebuilt bundle (best-effort SHA, env-overridable base); telemetry default-ON | **sandbox-then-install** |
| eyaltoledano/claude-task-master | agent (MCP) | MIT + Commons Clause — **yes** (tarball bytes) | Yes (internal tooling permitted) | 8 | No malware; provenance/SLSA-signed; BUT telemetry default-ON w/ sendDefaultPii+recordInputs/Outputs+100% sampling → ships prompt I/O off-device | **sandbox-then-install** |
| mukul975/Anthropic-Cybersecurity-Skills | skill pack | Apache-2.0 — **yes** (raw bytes) | Yes | 7 | No malware found; but only ~5/1039 unique scripts fully read; dual-use offensive (Sliver/LaZagne/PtT); "Anthropic-" name = trust-laundering 3rd party | **sandbox-then-install** |
| mvanhorn/last30days-skill | skill | MIT — **yes** (raw bytes) | Yes | **2** | Bytes clean to declared APIs; BUT reads X/TruthSocial auth cookies + Codex JWT + many API keys; SessionStart hook; `npx` off-repo install. **Role mismatch** (researches external topics, not local resume) | **vet-manually** |
| multica-ai/andrej-karpathy-skills | skill | MIT — **no** (declared in metadata only, **no LICENSE file**, API null) | **Unknown** | 7 | 100% inert markdown/JSON, no executable, no injection; risks = absent legal grant + 179k stars on 5-mo 20KB repo (inflation) + unpinned upstream | **vet-manually** |
| Glint-Research/Fable-5-traces | dataset (HF) | AGPL-3.0 — **no** (web-reported, uninspectable) | **No** | 3 | Uninspectable; AGPL §13; distilled Claude/Fable-5 outputs = Anthropic-ToS taint; unsanitized traces likely embed live secrets + injection payloads; TeichAI red-flag family | **reject** |

---

## 2. Install now

**None.** No candidate satisfies *license-confirmed-clean + source-inspected-clean + skeptic high-confidence `install`* simultaneously.

Closest miss, for transparency:
- **Egonex-AI/Understand-Anything** — passes both content passes (MIT byte-confirmed; source has zero network sinks). It is held back **only** because installation lands **auto-firing global hooks** (SessionStart + PostToolUse-on-Bash) and the update channel is a **git pull from a transferred org**, so a future unreviewed commit would auto-execute on every session of a full-auto secrets machine. That standing-capability risk is exactly what the rail exists to stop, so it stays one tier down until pinned and hook-audited (see §3).

---

## 3. Sandbox-then-install

Promising; read-source-in-isolation (secrets-free throwaway VM/container, outbound traffic on a proxy) and verify the specifics below before promoting to the owner's machine. Map to `SKILLS_INDEX.md` "CANDIDATES TO VET".

### 3.1 Egonex-AI/Understand-Anything — slot: *intake / explain-any-artifact* (code comprehension, local knowledge graph)
- **Install:** Claude Code plugin marketplace (manifest `.claude-plugin/plugin.json`). Other platforms: `bash -s -- <platform> < <(curl -fsSL https://raw.githubusercontent.com/Egonex-AI/Understand-Anything/main/install.sh)`.
- **Check in sandbox:** (1) **pin the commit** — do NOT track `main` (transferred org, future commits unreviewed); (2) read `hooks.json` + `auto-update-prompt.md` and **disable the SessionStart/PostToolUse auto-fire** ("just do it" autopilot) before it touches a real repo; (3) confirm the symlink-only installer still runs no npm/pnpm lifecycle scripts; (4) point it at a hostile test repo and confirm no instruction-injection escapes into the agent. Source was fully read and is clean today — this is forward-risk control only.

### 3.2 giancarloerra/SocratiCode — slot: *BUILDER brownfield codebase intake (Socratic)*
- **Install:** `claude plugin marketplace add giancarloerra/socraticode && claude plugin install socraticode@socraticode` (canonical `giancarloerra` ONLY — forks `nxpatterns`, `oltivex` exist).
- **Check in sandbox:** (1) **pin a specific reviewed npm version** — replace bare `npx -y socraticode` (executes *latest* each run, un-diffable from the clean git commit); diff that exact tarball; (2) first-run with NO cloud keys (default provider = local Ollama) and confirm egress stays localhost; (3) confirm Docker images are official pinned `qdrant/qdrant:v1.17.0` + `ollama/ollama:latest`; (4) review `socraticode.env` defaults + what the cloud-beta option transmits.
- **License gate:** AGPL-3.0 is fine for **internal local-tool use** (does NOT contaminate the owner's own projects) but is **not vendorable** into anything distributed/networked without Altaire's separate commercial license. Keep it as a private dev tool only.

### 3.3 colbymchenry/codegraph — slot: *brownfield detect + architect-role grounding (code-graph)*
- **Install:** `npm install -g @colbymchenry/codegraph && codegraph install` — **prefix `DO_NOT_TRACK=1` (or `CODEGRAPH_TELEMETRY=0`)**.
- **Check in sandbox:** (1) the npm package is only `.d.ts` stubs + 2 loaders — the **real runtime is an opaque prebuilt bundle**; extract and read `lib/dist/index.js` and watch its network egress; (2) **pin + verify the GitHub-Release SHA256** (checksum is silently skipped if `SHA256SUMS` is missing/unreachable, and `CODEGRAPH_DOWNLOAD_BASE` is env-overridable); (3) decline any autoAllow; (4) read `LICENSE` raw bytes to upgrade MIT from "reported" to "confirmed". The "Hermes Agent" mention in the repo desc is a compatibility listing, NOT a link to the banned hermes-agent.

### 3.4 eyaltoledano/claude-task-master — slot: *phase-ladder / BACKLOG / STATUS task layer*
- **Install:** `npm install -g task-master-ai`.
- **Neutralize BEFORE first real use:** (1) set `anonymousTelemetry:false` in `.taskmaster/config.json` — it **defaults ON** and the Sentry init uses `sendDefaultPii:true + recordInputs/Outputs:true + tracesSampleRate:1`, i.e. ships AI prompt inputs/outputs off-device; (2) **never** enable the "Hamster" cloud login (tryhamster.com); (3) run once in isolation with outbound watched — confirm only AI-provider + Sentry hosts. No install lifecycle scripts; the local RSA key is for cloud auth, not exfil. Commons Clause permits internal tooling to build/ship commercial products; it only bars reselling Task Master itself. **Migration caution:** this supersedes the manual `STATUS.md`+`BACKLOG` pattern — plan migration to avoid doc-drift with existing project SoT files.

### 3.5 mukul975/Anthropic-Cybersecurity-Skills — slot: *security-reviewer + safety-rail knowledge*
- **Install:** `claude mcp install https://github.com/mukul975/Anthropic-Cybersecurity-Skills` — but **do NOT enable full auto-invocation**.
- **Check in sandbox:** (1) **pin a specific commit** (third-party repo wearing an "Anthropic-" name = trust-laundering; 17k stars in <4 months; auto-updates) — today's clean HEAD ≠ tomorrow's; (2) install **only the defensive review subset** actually needed (e.g. credential-dumping detection, k8s audit-log analysis), NOT the 762-skill firehose — only ~5/1039 unique scripts were read end-to-end, so a novel non-keyword payload in an unread SKILL.md can't be 100% excluded; (3) the **dual-use offensive content** (Sliver C2, LaZagne, pass-the-ticket, RAT extraction) auto-invoked inside the documented non-stop full-auto loop is an operational hazard — gate invocation behind explicit human approval. *Confidence on this one is medium, not high — closest of the four to a vet-manually.*

---

## 4. Vet-manually

License or fit/source could not be fully confirmed; a human decision is required.

### 4.1 multica-ai/andrej-karpathy-skills — slot: *coding-discipline guidance (Karpathy principles)*
- **What's missing:** **no LICENSE file** — `main/LICENSE`, `master/LICENSE`, `LICENSE.md` all 404; GitHub API license field = `null`. "MIT" appears only as a metadata/frontmatter string with no copyright holder and no permission text = **incomplete legal grant** → `commercial_clean = unknown`. Content itself is 100% inert markdown/JSON (full tree read, zero executable, zero injection, byte-identical to the `forrestchang` original — same artifact via rename, not a divergent fork), so the *security* surface is clean.
- **Also flag:** 179k stars on a 5-month-old 20 KB pure-markdown repo is implausible (trust-signal inflation); `/plugin marketplace add` subscribes to an **unpinned** upstream → a future LICENSE-less malicious commit auto-re-injects on update.
- **Cheapest safe path:** skip the plugin install entirely and **copy the `CLAUDE.md` discipline text directly into the project's own `CLAUDE.md`** — the content is public and permissive in intent, which sidesteps the license ambiguity and the unpinned-upstream risk in one move.

### 4.2 mvanhorn/last30days-skill — slot tagged: *cross-session resume / "what changed"* — **ROLE MISMATCH**
- **What's missing:** human confirmation that it has ANY value here. License is clean (MIT byte-confirmed) and shipped bytes only reach declared first-party/provider APIs — but **fit is 2/10**: it researches *external internet topics* (Reddit/X/YouTube/TikTok/HN over 30 days), it **cannot read local repos, produce session diffs, or persist project context** — i.e. it does not do the CLAUDEWAR local-resume/STATUS-handoff job it was tagged for.
- **Why not auto-install even for a narrow use:** it reads **X/TruthSocial auth cookies + the Codex JWT + many paid API keys**, installs a **SessionStart hook** (auto-exec every session), and its setup wizard runs an **`npx` install of an off-repo npm package** — all disclosed, but invasive enough to require conscious owner consent. For the tagged role this is effectively a reject; only consider if the owner genuinely wants external-topic research (and even then, behind the cookie/hook/`npx` consents).

---

## 5. Reject

### 5.1 Glint-Research/Fable-5-traces — slot: *reference/eval dataset*
**Reject — three independent grounds, skeptic high-confidence:**
1. **Uninspectable** — WebFetch is hard-blocked by the local context-mode redirect on the dataset card, file tree, and raw `/LICENSE`; the AGPL-3.0 string and the trace bytes were never byte-verified. Cannot clear what cannot be read.
2. **License not commercial-clean** — reported AGPL-3.0 (strong copyleft). AGPL §13 network-source-disclosure makes it unvendorable into the closed-source CLAUDEWAR machine; any model trained on it inherits forced source disclosure.
3. **Legal/ToS taint + unsanitized data** — provenance is TeichAI scraping ~953 Claude Code sessions against the Fable-5 preview API right before Anthropic globally suspended Fable-5 = **distilled Claude outputs**, which Anthropic flags and actively classifies against. Real shell/file-edit/web tool trajectories with no documented sanitization pass → likely embed **live secrets + prompt-injection payloads** in tool-output fields. Same TeichAI red-flag family as previously banned repos.

**Worst case if ingested:** injection payloads in tool-output fields hijack a Claude Code agent into reading/exfiltrating `<CLAUDE_HOME>\.claude.json` + the Meshy key + SSH creds; and any fine-tune on it taints the commercial product with AGPL §13 + an Anthropic distillation-ToS violation. Do not pull onto the machine.

---

## 6. Caveats

- **WebFetch reachability:**
  - **Reached / byte-confirmed LICENSE:** Understand-Anything (MIT), Anthropic-Cybersecurity-Skills (Apache-2.0), last30days-skill (MIT), SocratiCode (AGPL-3.0, read during the refute pass). claude-task-master (MIT+Commons) was confirmed from the **shipped npm tarball bytes**, not a web LICENSE fetch.
  - **NOT reached / license NOT yet cleared (`license_confirmed=false`):** **codegraph** (MIT from page-title/npm only — raw bytes unread; gh CLI unavailable, WebFetch redirected), **andrej-karpathy-skills** (no LICENSE file exists; API null — there is nothing to confirm), **Fable-5-traces** (HF-only, WebFetch hard-blocked by context-mode redirect — entirely uninspectable). Treat all three as **NOT cleared** until bytes are read; karpathy and Fable additionally fail the *commercial-clean* test today.
- **Source-read coverage gaps to close in sandbox:** codegraph's real runtime is an opaque prebuilt bundle (never read); cybersec pack was spot-checked (~5/1039 scripts); SocratiCode's *executed* artifact is the auto-updating `npx -y` tarball, not the reviewed git commit; Understand-Anything's auto-update is an unreviewed future git-pull. "Clean today" ≠ "clean on next update" for every git-pull/`npx`/Release-download channel above — **pin commits/versions and re-review on bump.**
- **Telemetry / data-egress that must be neutralized pre-use:** claude-task-master (default-ON Sentry with PII + prompt I/O capture) and codegraph (default-ON usage telemetry). Both leak by default on a secrets-heavy box — kill switches in §3.3 / §3.4.
- **Hermes disambiguation:** the "Hermes" strings in codegraph, the cybersec pack, and last30days are NOT the banned hermes-agent/backdoored-LiteLLM key-stealer — verified distinct in every case. None of the 8 is a hermes-class overt key-stealer. The residual risk across the sandbox tier is **un-verifiable runtime + auto-update supply-chain + default telemetry**, not present malice.
- **Rail reaffirmed:** read LICENSE bytes + read the *executed* source before vendoring; pin versions; install into a secrets-free sandbox first; treat every SKILL.md / dataset / tool-output as untrusted input that can carry prompt injection. On this full-auto machine, prefer copying inert guidance text (e.g. Karpathy `CLAUDE.md`) over subscribing to unpinned plugin marketplaces.