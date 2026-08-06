# init.ps1 — idempotent boot to a runnable state (PowerShell 5.1-safe)
# Owner runs PS 5.1. Re-runnable: every step checks before acting. .sh twin = init.sh.
$ErrorActionPreference = 'Stop'

Write-Host '[init] env...'
# {{ install deps idempotently — e.g. if (-not (Test-Path .venv)) { py -3.11 -m venv .venv }; .\.venv\Scripts\pip install -r requirements.txt }}
# {{ or: if (-not (Test-Path node_modules)) { npm ci } }}

Write-Host '[init] build...'
# {{ build step — e.g. npm run build / dotnet build / nothing for scripts }}

Write-Host '[init] start (background if a server)...'
# {{ start step — launch dev server / nothing for a batch tool }}

Write-Host '[init] smoke...'
# {{ minimal smoke: hit the runnable surface once, assert non-error }}

Write-Host '[init] OK — runnable state reached.'
