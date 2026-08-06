# SKILL_VETTING_RUBRIC — calibrated, proportionate repo/skill/model/dataset vetting

*Whenever the machine (or any project's `study-project` run) evaluates a GitHub repo, Claude skill, model, or dataset, the verdict MUST match the ACTUAL risk. Default-deny is for genuine danger only. **Rejecting inert/readable/safe content "for nothing" is a BUG, not caution.** This rubric is what makes the security pass coherent — it is the proportionate form of CONSTITUTION rail #4 (replaces "treat everything as malware").*

## Core principle
**Verdict = f(what the artifact actually DOES on your machine) — NOT f(license name, star count, or vibe).**

Two risk axes only:
1. **EXECUTION** — does it run code? Can you read that code?
2. **EXFILTRATION** — does it read secrets or send data off-device?

License and popularity are SEPARATE axes that produce **caveats, never security rejects**:
- **License** = a USE-vs-REDISTRIBUTE question. No-license / GPL / AGPL = fine to USE locally; it only blocks VENDORING into shipped/distributed work. Never a reason to refuse to use a tool yourself.
- **Stars / age** = a soft trust signal. Low or inflated → read more carefully. Never a sole blocker.

## The 5 tiers (assign the HIGHEST that genuinely applies)

| Tier | What it is | Real risk | Gate | Default verdict |
|---|---|---|---|---|
| **T0 — Inert** | markdown / JSON / config; no executable, no hook | prompt-injection into agent context only | read it; grep injection/exfil patterns ("ignore previous", exfil, `curl`/`base64`/`eval`, secret/key/.env/ssh paths) | **USE** if scan clean. License = caveat only. |
| **T1 — Declarative + hook** | SKILL.md + a hook / plugin manifest that fires | hook auto-executes on session/tool events | read the hook; confirm benign + you control WHEN it fires | **USE** (optionally disable auto-fire / pin commit) |
| **T2 — Readable code** | open-source scripts / `src/` / npm with readable source | supply-chain at run time | read entry points; pin a reviewed version; first run secrets-free if unsure | **USE after pin** |
| **T3 — Opaque or phones-home** | prebuilt/minified bundle you can't read, OR default-ON telemetry shipping prompt I/O, OR `npx -y x@latest` (un-diffable each run) | can't verify what runs / data leaves device | sandbox (secrets-free container + egress proxy) OR neutralize the phone-home flag FIRST | **SANDBOX or NEUTRALIZE-then-use** |
| **T4 — Exfil / taint / uninspectable-data** | reads secrets/credentials as core behavior + sends off-device, OR ToS/legal taint, OR uninspectable dataset likely embedding secrets/injection payloads | direct compromise / legal | none cheap enough | **REJECT** (or hard-gate to a throwaway, only if value justifies) |

## The anti-over-rejection rules (this is the fix)
1. **Never reject inert/readable content for a license or popularity reason.** Those append as caveats to a USE verdict; they are not blockers.
2. **Separate the parts.** A repo that ships inert markdown (T0) AND an opaque binary (T3) → adopt the T0 part alone, leave the T3 part. Don't tar the whole repo with its worst file when the parts are separable.
3. **"Could not inspect" ≠ "malicious."** It CAPS the verdict at vet-manually / sandbox — it does NOT mean reject. **Reject needs a POSITIVE bad finding** (exfil, taint, or an opaque binary you'd be forced to run).
4. **Match the gate to the USE.** Using a markdown CLAUDE.md = read-and-copy. Running an MCP server = the npm/exec gate. Never apply the server gate to a markdown file.
5. **Proportionate + logged.** Every verdict states the tier + ONE concrete reason. "Rejected, no reason" is invalid output and must be re-done.

## Applies to
- The candidate-skill intake (`skills/SKILLS_INDEX.md`).
- **Any project's `study-project` run** when its free-gen / tech aspects evaluate OSS repos/models/datasets — same tiers, same anti-over-rejection rules. A project must NOT skip a perfectly good free OSS tool because the pass was blanket-strict.
- `CONSTITUTION.md` rail #4 = this rubric (proportionate), not a blanket "everything is malware."

---

## Verdicts live elsewhere (de-duplicated 2026-07-16)

This rubric is **rules only**. The calibrated per-candidate verdicts that used to sit here drifted against the other copies (SocratiCode was simultaneously "sandbox" / "use-local" / "SKIP" across three files). Per CLAUDE.md CANON rule 2: **`skills/SKILLS_INDEX.md` is the single live verdict table** — read verdicts there; read byte-level license/source evidence in `VETTING_REPORT.md` (stamped evidence-only). The calibration PRINCIPLE stands: verdict proportionate to what the artifact DOES, same facts — never strict-pass "0/8 install" for license/popularity reasons.
