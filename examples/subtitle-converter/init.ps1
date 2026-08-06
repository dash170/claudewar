# init.ps1 — Windows twin of init.sh. Reach a runnable state, then verify.
Set-Location $PSScriptRoot

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Error 'Node 18+ required (https://nodejs.org)'
  exit 1
}
Write-Output "[init] node $(node --version)"
Write-Output '[init] no dependencies to install'
& "$PSScriptRoot/verify.ps1"
