@echo off
setlocal

pushd "%~dp0.."

node .\tools\build.mjs
set "EXIT_CODE=%ERRORLEVEL%"

popd
exit /b %EXIT_CODE%
