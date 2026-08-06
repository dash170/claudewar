# verify.ps1 — Windows twin of verify.sh. Runs the grounding signal, writes RESULTS.json.
Set-Location $PSScriptRoot

$output = & node test/convert.test.js 2>&1 | Out-String
$green = ($LASTEXITCODE -eq 0)
Write-Output $output.TrimEnd()

$match = [regex]::Match($output, '\d+/\d+ passed, \d+ failed')
$value = if ($match.Success) { $match.Value } else { 'suite did not report' }

$results = [ordered]@{
  gate     = 'WHEN the assertion suite is run over the fixture corpus THE SYSTEM SHALL convert SRT<->WebVTT with byte-identical reference output, millisecond-exact timing and every skipped block reported, at zero failing assertions'
  signal   = 'node test/convert.test.js'
  value    = $value
  green    = $green
  evidence = 'RESULTS.json'
  ts       = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
}
$results | ConvertTo-Json | Out-File -FilePath ./RESULTS.json -Encoding utf8

Write-Output "[verify] green=$green  $value"
if (-not $green) { exit 1 }
