# STATUS — subtitle-converter  (SINGLE SOURCE OF TRUTH)

*Update every milestone. This is the resume anchor: on `/compact` or `/clear`, the next instance reads this and continues.*

## NOW
- **Phase:** P3 complete — ship gate MET
- **Milestone in progress:** none; the ladder is finished
- **Next task:** none required. To extend: add a slice from the "Not in scope" list in `PLAN.md` with its own EARS acceptance clause, then run the loop on it.
- **Ship gate:** WHEN the assertion suite is run over the fixture corpus THE SYSTEM SHALL convert SRT↔WebVTT with byte-identical reference output, millisecond-exact timing and every skipped block reported, at zero failing assertions — status: **MET**
- **Grounding signal:** `node test/convert.test.js` — last result: **21/21 passed, 0 failed**
- **Grounding signal value (this milestone):** 21/21, 0 failed
- **RESULTS.json green:** true (regenerate with `bash verify.sh`)
- **Rails checksum:** `sc-rails-12-v1`

## TEAM (assembled — re-plan at milestone boundaries on logged scope change)
- **Topology:** builder+critic, human lens as final veto
- **Roster + model tiers:** builder → Opus · correctness-critic → Opus · cli-human-lens → Opus. No tier below Opus anywhere; no exception was needed on this build.
- **Ship owner:** lead
- **HUMAN-lens gate:** required at P3 (the CLI surface is the only human-facing artifact)
- **Free-gen capabilities equipped:** none — no generated media in this project
- **Fan-out cap:** 3 | no-recursive-spawn: enforced

## MACHINE-COMPLETENESS SELF-AUDIT
Every machine layer, and why it is wired in or deliberately not. Recording the *unused* ones is the point — an unexplained absence is indistinguishable from an oversight.

| Layer | Wired? | Why |
|---|---|---|
| study-project (STEP 0 deep study) | **Partial, declared** | Both formats are published specifications; the study collapsed to reading them. No market or reference study was warranted for an example project, and pretending otherwise would fake the artifact this repo says must be real. |
| team-assembler | **Yes** | builder + a *separate* correctness critic + a human lens with veto. Minimal covering set for a correctness-shaped, low-stakes build. |
| IMAGINATION MODE | **No — deliberate** | The work is closed-form correctness against two specs. Divergent generation would add noise. It belongs on open-ended sub-tasks. |
| visual-perception gate | **No — deliberate** | A CLI emits text; there is no artifact to look at. Any project that renders something would wire `visual_gate/GATE_PROMPT.md` into MICRO step 3. |
| skill-vetting rubric | **Not exercised** | Zero third-party dependencies were installed, so nothing reached T0–T4 triage. The rubric fires at EQUIP; there was no EQUIP. |
| rails + deny-set + PreToolUse hook | **Yes** | `CONSTITUTION.md`, the deny-set in `.claude/settings.json`, and the live `safety_gate.js` hook. Rail #5 is load-bearing here: subtitle files are attacker-controlled input. |
| `<self_improvement_loop>` | **Yes** | Both loops in `PROJECT_OPERATING_PROMPT.md §2`. |
| free-gen capability resolver | **No — deliberate** | No media capability needed. |

## HUMAN-LENS VERDICT
- **Job (JTBD):** someone with a subtitle file the player refuses to load is trying to convert it so that it works, without learning a format spec first.
- **Real signal grounded on:** the CLI run by hand against a malformed file, a BOM'd file and an empty file — judged on what a stranger sees, not on what the author knows.
- **Appeal verdict:** the tool must say what it did (`21 cues converted to vtt, 0 skipped`) and why it refused (`error: bad timestamp: "1:2:3"`). Silence on success is wrong here: the user's whole question is "did it actually do anything".
- **Verdict:** GO — diagnostics go to stderr so stdout stays pipeable, and every skip is named.

## DONE
- P3 — CLI surface, stdout/stderr split, skip reporting, non-zero exit on parse failure. RESULTS.json green.
- P2 — SRT and WebVTT emitters; byte-identical against reference fixtures; zero round-trip drift.
- P1 — parser into one neutral cue model; BOM, CRLF, multi-line cues, WebVTT cue settings, NOTE blocks, backwards-cue rejection.
- P0 — timestamp core in integer milliseconds, both dialects, loud failure on malformed input.

## BACKLOG (ordered)
1. SubStation Alpha input (needs a styling model — a real design decision, not a parser tweak).
2. `--shift <ms>` for re-syncing a track that drifts against the video.
3. Cue-overlap detection as a warning, not an error.

## BLOCKERS (with what has been tried — a blocker is never a stop)
- none

## COVERAGE LEDGER (no silent caps)
- Assertions: 21/21 passing, 0 failed.
- Formats covered: SRT and WebVTT only. `.ass`/`.ssa`/TTML/SAMI are **out of scope by decision**, recorded in `PLAN.md` — not attempted and not claimed.
- Encoding: UTF-8 with or without BOM. Other encodings are not detected; a UTF-16 file will fail at the timestamp parse with a named error rather than produce silent garbage.
- The two `fixtures/*.expected` reference files were generated by the implementation and then **verified by hand against the format specifications** — a generated expectation that nobody read is circular, and this repo's own lessons file says so.

## AUDIT (privileged/irreversible actions — append-only)
- none — this project writes only inside its own directory, and only to a path the user passed explicitly.

## REFLEXION (volatile — this project only)
- Splitting the timestamp regex to accept both `,` and `.` in one pattern removed an entire class of "which format am I in" branching downstream. The neutral cue model is what made the round-trip test one line.
- The first parser dropped metadata blocks silently. The critic caught it against rail #6: a skip nobody is told about is data loss with good manners.

## HANDOFF (for the next instance after `/clear`)
- The ship gate is met and the ladder is complete. To resume: pick a `PLAN.md` backlog item, write its EARS acceptance clause first, then run the MICRO loop. Verify with `bash verify.sh` — green means `RESULTS.json` reports 0 failed.
