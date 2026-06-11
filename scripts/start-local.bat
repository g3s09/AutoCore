@echo off
setlocal
cd /d "%~dp0\.."
set "PROJECT_ROOT=%CD%"

start "AutoCore Backend" cmd /k "cd /d %PROJECT_ROOT%\backend && npm.cmd run dev"
start "AutoCore Frontend" cmd /k "cd /d %PROJECT_ROOT%\frontend && npm.cmd run dev -- --hostname 127.0.0.1 --port 3000"

timeout /t 5 /nobreak >nul

where msedge >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  start "" msedge --app=http://127.0.0.1:3000/dashboard
  exit /b 0
)

where chrome >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  start "" chrome --app=http://127.0.0.1:3000/dashboard
  exit /b 0
)

start "" http://127.0.0.1:3000/dashboard
