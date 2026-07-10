$ErrorActionPreference = "Stop"

node .\tools\check.mjs
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
