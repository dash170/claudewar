# STATUS — {{PROJECT_NAME}}  (SINGLE SOURCE OF TRUTH)

*Update every milestone. This is the resume-anchor: on /compact or /clear, the next instance reads this and continues.*

## NOW
- **Phase:** {{current phase}}
- **Milestone in progress:** {{...}}
- **Next task:** {{the single next action}}
- **Ship gate:** {{define}} — status: NOT MET
- **Grounding signal:** {{tests/smoke/playtest/etc.}} — last result: {{n/0 | pass/fail}}
- **Grounding signal value (this milestone):** {{n/0 | metric | verdict}}
- **RESULTS.json green:** {{true | false}}
- **Rails checksum:** {{token}}

## TEAM (assembled — re-plan at milestone boundaries on logged scope change)
- **Topology:** {{tag}}
- **Roster + model tiers:** {{role → Haiku/Sonnet/Opus}}
- **Ship owner:** lead
- **HUMAN-lens gate:** {{required at <which gates> | n/a}}
- **Free-gen capabilities equipped:** {{... | none}}
- **Fan-out cap:** {{N}} | no-recursive-spawn: enforced

## HUMAN-LENS VERDICT (for product/game/content/niche)
- **Job (JTBD):** [who] is trying to [job] so that [outcome]
- **Real signal grounded on:** {{Steam reviews / Play reviews / Reddit+HN / TikTok trend / fake-door}} — last pull: {{ts | unavailable+fallback}}
- **Appeal score:** {{desirability % / Kano must-haves+delighter / GEQ subscales}}
- **Behavioral (fake-door) conversion:** {{% | not-run}}
- **Panel-vs-real delta check:** {{pass/fail}}
- **Verdict:** {{GO / NO-GO / REVISE}} — can veto a green build.

## RUN-TRACE
- See `RUN_TRACE.jsonl` (per-decision: role, call, tokens, verdict) — multi-agent non-determinism debuggable separately from this SoT.

## DONE
- {{shipped milestones, newest first}}

## BACKLOG (ordered)
1. {{...}}

## BLOCKERS (with what's been tried — a blocker is never a stop)
- {{none | blocker + avenues attempted}}

## COVERAGE LEDGER (no silent caps)
- Processed / total: {{n/N}} · Skipped (with reason): {{none | item — why}}

## AUDIT (privileged/irreversible actions — append-only)
- {{actor · action · target · ts · reason}}

## REFLEXION (volatile — this project only)
- {{what failed + the lesson — prepend next iteration}}
- *Promote durable, project-agnostic lessons to `../../references/PLAYBOOK_<type>.md` + the global `../../references/LESSONS.md`; NEVER promote paths/tokens/secrets/run-state.*

## HANDOFF (for the next instance after /clear)
- To resume: {{exact next step + how to verify}}
