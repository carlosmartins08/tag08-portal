param(
  [Parameter(Mandatory = $true)]
  [ValidateSet("dev", "build", "preview")]
  [string]$Mode
)

$projectRoot = Split-Path -Parent $PSScriptRoot
$sourceBinary = Join-Path $projectRoot 'node_modules\@esbuild\win32-x64\esbuild.exe'
$runtimeDir = Join-Path $env:TEMP 'tag08-esbuild-runtime'
$runtimeBinary = Join-Path $runtimeDir 'esbuild.exe'

if (-not (Test-Path -LiteralPath $sourceBinary)) {
  throw "Não encontrei o binário do esbuild em $sourceBinary"
}

if (-not (Test-Path -LiteralPath $runtimeDir)) {
  New-Item -ItemType Directory -Path $runtimeDir -Force | Out-Null
}

Copy-Item -LiteralPath $sourceBinary -Destination $runtimeBinary -Force
$env:ESBUILD_BINARY_PATH = $runtimeBinary
Set-Location -LiteralPath $projectRoot

if ($Mode -eq "build") {
  node generate-sitemap.js
  node .\node_modules\vite\bin\vite.js build --configLoader native
} elseif ($Mode -eq "dev") {
  node .\node_modules\vite\bin\vite.js --configLoader native --port=3000 --strictPort --host=0.0.0.0
} elseif ($Mode -eq "preview") {
  node .\node_modules\vite\bin\vite.js preview --configLoader native --strictPort
}
