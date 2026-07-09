$ErrorActionPreference = "Stop"

node .\node_modules\typescript\bin\tsc --noEmit
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\tools\build.ps1
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
