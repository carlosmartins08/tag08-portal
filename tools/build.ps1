$ErrorActionPreference = "Stop"

node .\tools\build.mjs
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
