$ErrorActionPreference = "Stop"

$env:ESBUILD_BINARY_PATH = ".\node_modules\@esbuild\win32-x64\esbuild.exe"

node .\generate-sitemap.js
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

node .\node_modules\vite\bin\vite.js build --configLoader bundle
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
