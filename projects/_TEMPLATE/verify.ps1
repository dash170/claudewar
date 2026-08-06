# verify.ps1 — run the type's grounding signal, emit standardized RESULTS.json
# Replaces RUN-ENV prose. .sh twin = verify.sh.
$ErrorActionPreference = 'Stop'

# {{ run the grounding signal for this type:
#    game     -> smoke n/0 (cvars+logs playtest)
#    trading  -> OOS + paper P&L (walk-forward + DSR)
#    web-app  -> test suite + build green
#    research -> claims cited + corroborated
#    data     -> pipeline green + row counts }}

$gate     = '{{ship-gate EARS clause}}'
$signal   = '{{signal name}}'
$value    = '{{measured value, e.g. 494/0}}'
$green    = $false   # {{ set true only when value meets the gate }}
$evidence = '{{artifact path proving it}}'

$result = [ordered]@{
  gate     = $gate
  signal   = $signal
  value    = $value
  green    = $green
  evidence = $evidence
  ts       = (Get-Date).ToString('s')
}
$result | ConvertTo-Json | Out-File -FilePath './RESULTS.json' -Encoding utf8
Write-Host "[verify] green=$green  $signal=$value"
if (-not $green) { exit 1 }
