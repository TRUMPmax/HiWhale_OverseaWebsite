@echo off
setlocal enabledelayedexpansion
title HiWhale Public Test Environment
cd /d %~dp0

echo ============================================
echo   HiWhale One-Click Start (Public Test)
echo   Domain: https://hiwhalerob.com
echo ============================================
echo.

REM If pages return 500 or images fail, run with fix arg first: this.bat fix
if "%1"=="fix" (
  echo [FIX] Clearing Next.js caches...
  if exist apps\portal\.next rmdir /s /q apps\portal\.next
  if exist apps\admin\.next rmdir /s /q apps\admin\.next
  echo [FIX] Done, continuing...
  echo.
)

REM Port pre-check: starting with occupied ports creates orphan processes
set "OCCUPIED="
for %%p in (3000 3001 4000) do (
  netstat -ano | findstr "LISTENING" | findstr /C:":%%p " >nul 2>&1 && set "OCCUPIED=!OCCUPIED! %%p"
)
if defined OCCUPIED (
  echo [WARN] Ports occupied: !OCCUPIED!
  echo Usually leftover processes from a previous run.
  set /p KILLCONFIRM="Kill them and continue? (Y/n): "
  if /i "!KILLCONFIRM!"=="n" (
    echo Cancelled. Close the old "HiWhale Dev Servers" window and retry.
    pause
    exit /b 1
  )
  for %%p in (3000 3001 4000) do (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr "LISTENING" ^| findstr /C:":%%p "') do (
      taskkill /F /PID %%a >nul 2>&1
    )
  )
  echo Processes cleaned.
  echo.
)

echo [1/5] Switching frontend env to PUBLIC mode...
"C:\Program Files\Git\bin\bash.exe" scripts/use-public-env.sh
if errorlevel 1 (
  echo Env switch failed.
  pause
  exit /b 1
)

echo.
echo [2/5] Infrastructure (Docker: PostgreSQL + Redis + MinIO)...
"C:\Program Files\Git\bin\bash.exe" scripts/dev-up.sh
if errorlevel 1 (
  echo.
  echo Infrastructure failed. Check Docker Desktop and retry.
  pause
  exit /b 1
)

echo.
echo [3/5] Dev servers (new window: portal:3000 + admin:3001 + api:4000)...
start "HiWhale Dev Servers" cmd /k "cd /d %~dp0 && pnpm dev:all"

echo.
echo [4/5] Waiting for services (up to ~2 min)...
set /a tries=0
:wait
curl -fsS -m 2 http://localhost:4000/health >nul 2>&1
if not errorlevel 1 goto ready
set /a tries+=1
if !tries! geq 40 (
  echo Timed out. Check the "HiWhale Dev Servers" window logs.
  pause
  exit /b 1
)
ping -n 4 127.0.0.1 >nul
goto wait

:ready
echo Services ready.
echo.
echo [5/5] Starting public tunnel (new window)...
start "HiWhale Tunnel" cmd /k cloudflared tunnel --config "C:\Users\Administrator\.cloudflared\config-hiwhale.yml" run hiwhale-local

echo Waiting for tunnel...
ping -n 9 127.0.0.1 >nul

echo.
echo ============================================
echo   Done. Opening browser...
echo   Portal   https://hiwhalerob.com
echo   Admin    https://admin.hiwhalerob.com  (admin@hiwhale.com)
echo   Local    http://localhost:3000/zh
echo ============================================
start https://hiwhalerob.com
start https://admin.hiwhalerob.com
echo.
echo Close the "HiWhale Dev Servers" and "HiWhale Tunnel" windows to stop.
pause
