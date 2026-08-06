# PLAN — subtitle-converter phase ladder

*Ordered, simplest-first, dependency-ordered. Each item is one individually-shippable slice with its EARS acceptance clause. The BUILDER pulls the next UNCHECKED item and may NOT jump ahead (structural anti-scope-drift). Check the box only when `verify.sh` → RESULTS.json is green.*

- [x] **P0 — timestamp core** · acceptance: WHEN a timestamp in either dialect (`HH:MM:SS,mmm`, `HH:MM:SS.mmm`, `MM:SS.mmm`) is parsed THE SYSTEM SHALL return integer milliseconds, pad a short fraction rather than misread it, and throw a named error on a malformed value · evidence: 6 assertions in `test/convert.test.js`, counted in `RESULTS.json`

- [x] **P1 — parser to one neutral cue model** · acceptance: WHEN a subtitle file is parsed THE SYSTEM SHALL strip a UTF-8 BOM, normalise CRLF, keep multi-line cue text intact, drop WebVTT cue settings from the end timestamp, report each metadata or empty block as skipped-with-reason, and reject a cue whose end precedes its start · evidence: 7 assertions in `test/convert.test.js`, counted in `RESULTS.json`

- [x] **P2 — emitters and round-trip fidelity** · acceptance: WHEN a fixture is converted to the other format THE SYSTEM SHALL produce output byte-identical to the reference fixture, renumber SRT indices from one whatever the source numbering, and preserve every cue boundary to the millisecond across a full round trip · evidence: 6 assertions in `test/convert.test.js` including the byte-comparison against `fixtures/*.expected`

- [x] **P3 — CLI surface and ship** · acceptance: WHEN the CLI is run on a file THE SYSTEM SHALL write converted data to stdout and diagnostics to stderr, default the target to the opposite of the detected input format, print the converted and skipped counts, and exit non-zero on any parse failure · evidence: `RESULTS.json` green with `21/21 passed, 0 failed`

*Each phase traces back to the SHIP-GATE EARS clause in `PROJECT_OPERATING_PROMPT.md §1`.*

## Not in scope (recorded so it stays a decision, not an omission)
- SubStation Alpha (`.ass`/`.ssa`), TTML, SAMI — a second format family would need its own styling model.
- Re-sync flags (`--shift`, `--scale`), cue-overlap detection, encoding detection beyond UTF-8.

These are the obvious next slices if you want to watch the loop run on something real. Each needs its own EARS acceptance clause before a builder is allowed to start it.
