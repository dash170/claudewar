# PLAN — {{PROJECT_NAME}} phase ladder

*Ordered, simplest-first, dependency-ordered. Each item = one individually-shippable slice with its EARS acceptance clause. The BUILDER pulls the next UNCHECKED item and may NOT jump ahead (structural anti-scope-drift). Check the box only when `verify.ps1` → RESULTS.json is green.*

- [ ] **P0 — {{slice}}** · acceptance: WHEN {{trigger}} THE SYSTEM SHALL {{response}} · evidence: {{artifact}}
- [ ] **P1 — {{slice}}** · acceptance: WHEN {{trigger}} THE SYSTEM SHALL {{response}} · evidence: {{artifact}}
- [ ] **P2 — {{...}}**
- [ ] ...

*Each phase traces back to a SHIP-GATE EARS clause in `PROJECT_OPERATING_PROMPT.md §1`.*
