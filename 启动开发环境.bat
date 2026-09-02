@echo off
title HiWhale Dev Environment
cd /d %~dp0

echo ============================================
echo   HiWhale One-Click Start (Local Dev)
echo ============================================
echo.

echo [0/3] Switching frontend env to LOCAL mode...
"C:\Program Files\Git\bin\bash.exe" scripts/use-local-env.sh
if errorlevel 1 (
  echo Env switch failed.
  pause
  exit /b 1
)
echo.

echo [1/3] Infrastructure (Docker + database + seed)...
"C:\Program Files\Git\bin\bash.exe" scripts/dev-up.sh
if errorlevel 1 (
  echo.
  echo Infrastructure failed. Check Docker Desktop and retry.
  pause
  exit /b 1
)

echo.
echo [3/3] Starting dev servers (Ctrl+C to stop all)...
echo   Portal   http://localhost:3000/zh
echo   Admin    http://localhost:3001  (admin@hiwhale.com / admin123)
echo   API      http://localhost:4000/health
echo.
pnpm dev:all
