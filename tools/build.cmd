@echo off
setlocal

pushd "%~dp0.."

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command ""& { $env:ESBUILD_BINARY_PATH = '.\node_modules\@esbuild\win32-x64\esbuild.exe'; node .\generate-sitemap.js; node .\node_modules\vite\bin\vite.js build --configLoader native }""
set "EXIT_CODE=%ERRORLEVEL%"

popd
exit /b %EXIT_CODE%
