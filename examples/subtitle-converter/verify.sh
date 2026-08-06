#!/usr/bin/env bash
# verify.sh — runs the grounding signal, writes RESULTS.json. This is the only
# thing allowed to turn a milestone green.
set -uo pipefail
cd "$(dirname "$0")"

OUTPUT="$(node test/convert.test.js 2>&1)"
STATUS=$?
echo "$OUTPUT"

VALUE="$(printf '%s' "$OUTPUT" | grep -oE '[0-9]+/[0-9]+ passed, [0-9]+ failed' | tail -1)"
[ -n "$VALUE" ] || VALUE="suite did not report"
GREEN=false
[ "$STATUS" -eq 0 ] && GREEN=true

cat > ./RESULTS.json <<EOF
{"gate":"WHEN the assertion suite is run over the fixture corpus THE SYSTEM SHALL convert SRT<->WebVTT with byte-identical reference output, millisecond-exact timing and every skipped block reported, at zero failing assertions","signal":"node test/convert.test.js","value":"$VALUE","green":$GREEN,"evidence":"RESULTS.json","ts":"$(date -u +%Y-%m-%dT%H:%M:%SZ)"}
EOF

echo "[verify] green=$GREEN  $VALUE"
[ "$GREEN" = "true" ] || exit 1
