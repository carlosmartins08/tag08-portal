@echo off
setlocal

pushd "%~dp0.."

node .\tools\check.mjs
set "EXIT_CODE=%ERRORLEVEL%"

popd
exit /b %EXIT_CODE%
