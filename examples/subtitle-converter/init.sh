#!/usr/bin/env bash
# init.sh — reach a runnable state. This project has zero dependencies on
# purpose: the whole point of an example is that it runs on a bare machine.
set -euo pipefail
cd "$(dirname "$0")"

command -v node >/dev/null || { echo "error: Node 18+ required (https://nodejs.org)"; exit 1; }
echo "[init] node $(node --version)"
echo "[init] no dependencies to install"
bash verify.sh
