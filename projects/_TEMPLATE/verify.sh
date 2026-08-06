#!/usr/bin/env bash
# verify.sh — POSIX twin of verify.ps1. Runs the grounding signal, writes RESULTS.json.
set -euo pipefail

# {{ run grounding signal for this type (smoke / paper P&L / tests / cited claims / pipeline) }}
GATE='{{ship-gate EARS clause}}'
SIGNAL='{{signal name}}'
VALUE='{{measured value}}'
GREEN=false   # {{ true only when value meets gate }}
EVIDENCE='{{artifact path}}'
TS="$(date -Is)"

cat > ./RESULTS.json <<EOF
{"gate":"$GATE","signal":"$SIGNAL","value":"$VALUE","green":$GREEN,"evidence":"$EVIDENCE","ts":"$TS"}
EOF
echo "[verify] green=$GREEN  $SIGNAL=$VALUE"
[ "$GREEN" = "true" ] || exit 1
