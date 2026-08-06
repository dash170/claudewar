#!/usr/bin/env bash
# init.sh — POSIX twin of init.ps1. Idempotent boot to a runnable state.
set -euo pipefail

echo '[init] env...'
# {{ idempotent deps — e.g. [ -d .venv ] || python3 -m venv .venv; .venv/bin/pip install -r requirements.txt }}
echo '[init] build...'
# {{ build step }}
echo '[init] start...'
# {{ start step }}
echo '[init] smoke...'
# {{ minimal smoke }}
echo '[init] OK — runnable state reached.'
