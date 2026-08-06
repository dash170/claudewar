# ROLE_SPEC — canonical role normalizer

Every role (whether picked from the library, imported from VoltAgent/wshobson/CrewAI, or authored fresh) is normalized to these fields before it becomes a subagent in `.claude/agents/`. One role = one deliverable + one decision authority (DROP rule kills anything the lead can do inline).

| Field | Meaning |
|---|---|
| **name** | short kebab id (= subagent `name`) |
| **mandate** | the ONE thing this role owns; its distinct deliverable |
| **lens** | the skeptical/creative angle it argues from (correctness / security / market-human / taste / risk / perf …) |
| **tools** | least-privilege grant (reader roles get read-only; no high-privilege tool to any agent reading untrusted input) |
| **model-tier** | haiku (cheap explore/classify) / sonnet (build/middle) / opus (hard reasoning, gate) — cheapest that passes |
| **fires-when** | the `description` trigger the lead routes on |
| **gates-owned** | which milestone gate(s) this role must pass before green (esp. critic + HUMAN-lens veto) |
| **handoff-contract** | returns summary-only + pass/fail; control returns to lead; payload = STATUS delta / artifact pointer |
| **source + license** | library / repo URL + LICENSE status (commercial-clean before vendoring) |

**Pairing rule:** every active pillar carries one **maker** + one **independent critic** (separate context, the +7% lever). Any human-facing artifact also carries the **HUMAN-lens** role (vetoing). Scan free skills first; author last.

Role library + per-type rosters + free-gen capability map: `../../machine_roleLibrary.json`, `../../machine_perTypeTeams.json`, `../../machine_capabilityResolver.json` (full prose in `../../TEAM_AND_HUMAN_LAYER.md`).
