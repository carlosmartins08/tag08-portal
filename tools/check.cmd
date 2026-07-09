@echo off
setlocal

pushd "%~dp0.."

node .\node_modules\typescript\bin\tsc --noEmit
if errorlevel 1 (
  set "EXIT_CODE=%ERRORLEVEL%"
  popd
  exit /b %EXIT_CODE%
)

call .\tools\build.cmd
set "EXIT_CODE=%ERRORLEVEL%"

popd
exit /b %EXIT_CODE%
