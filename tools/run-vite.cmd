@echo off
setlocal enabledelayedexpansion

set "PROJECT_ROOT=%~dp0.."
set "SOURCE_BINARY=%PROJECT_ROOT%\node_modules\@esbuild\win32-x64\esbuild.exe"
set "RUNTIME_DIR=%TEMP%\tag08-esbuild-runtime"
set "RUNTIME_BINARY=%RUNTIME_DIR%\esbuild.exe"

if not exist "%SOURCE_BINARY%" (
  echo Could not find esbuild binary at "%SOURCE_BINARY%"
  exit /b 1
)

if not exist "%RUNTIME_DIR%" (
  mkdir "%RUNTIME_DIR%" >nul 2>nul
)

copy /Y "%SOURCE_BINARY%" "%RUNTIME_BINARY%" >nul
set "ESBUILD_BINARY_PATH=%RUNTIME_BINARY%"

pushd "%PROJECT_ROOT%"

set "EXIT_CODE=0"

if /I "%~1"=="build" (
  node generate-sitemap.js
  if errorlevel 1 set "EXIT_CODE=!errorlevel!"
  if "!EXIT_CODE!"=="0" (
    node .\node_modules\vite\bin\vite.js build --configLoader native
    set "EXIT_CODE=!errorlevel!"
  )
) else if /I "%~1"=="dev" (
  node .\node_modules\vite\bin\vite.js --configLoader native --port=3000 --strictPort --host=0.0.0.0
  set "EXIT_CODE=!errorlevel!"
) else if /I "%~1"=="preview" (
  node .\node_modules\vite\bin\vite.js preview --configLoader native --strictPort
  set "EXIT_CODE=!errorlevel!"
) else (
  echo Unknown mode: %~1
  set "EXIT_CODE=1"
)

popd
exit /b %EXIT_CODE%
