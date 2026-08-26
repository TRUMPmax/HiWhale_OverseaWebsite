@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
title HiWhale 公网测试环境
cd /d %~dp0

echo ============================================
echo   HiWhale 一键启动（公网测试模式）
echo   域名: https://hiwhalerob.com
echo ============================================
echo.

REM 若页面报 500 / Cannot find module './images.json'，先用参数 fix 跑一次清缓存：
REM   启动公网测试环境.bat fix
if "%1"=="fix" (
  echo [修复] 清理 Next.js 缓存...
  if exist apps\portal\.next rmdir /s /q apps\portal\.next
  if exist apps\admin\.next rmdir /s /q apps\admin\.next
  echo [修复] 完成，继续启动...
  echo.
)

REM 端口自检：3000/3001/4000 被占用时直接启动会产生孤儿进程（旧进程占用端口但缓存已失效，页面残缺）
set "OCCUPIED="
for %%p in (3000 3001 4000) do (
  netstat -ano | findstr /R /C:":%%p .*LISTENING" >nul 2>&1 && set "OCCUPIED=!OCCUPIED! %%p"
)
if defined OCCUPIED (
  echo [警告] 以下端口被占用：!OCCUPIED!
  echo 通常是上次启动残留的进程。直接继续会导致新实例起不来、页面加载残缺。
  set /p KILLCONFIRM="强制结束占用进程并继续？(Y/n): "
  if /i "!KILLCONFIRM!"=="n" (
    echo 已取消。请先关闭旧的 "HiWhale Dev Servers" 窗口再重试。
    pause
    exit /b 1
  )
  for %%p in (3000 3001 4000) do (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr /R /C:":%%p .*LISTENING"') do (
      taskkill /F /PID %%a >nul 2>&1
    )
  )
  echo 占用进程已清理。
  echo.
)

echo [1/4] 基础设施 (Docker: PostgreSQL + Redis + MinIO)...
"C:\Program Files\Git\bin\bash.exe" scripts/dev-up.sh
if errorlevel 1 (
  echo.
  echo 基础设施启动失败，请检查 Docker Desktop 后重试。
  pause
  exit /b 1
)

echo.
echo [2/4] 开发服务器（新窗口：portal:3000 + admin:3001 + api:4000）...
start "HiWhale Dev Servers" cmd /k "cd /d %~dp0 && pnpm dev:all"

echo.
echo [3/4] 等待服务就绪（最长约 2 分钟）...
set /a tries=0
:wait
curl -fsS -m 2 http://localhost:4000/health >nul 2>&1
if not errorlevel 1 goto ready
set /a tries+=1
if %tries% geq 40 (
  echo 服务启动超时，请查看 "HiWhale Dev Servers" 窗口的日志。
  pause
  exit /b 1
)
timeout /t 3 /nobreak >nul
goto wait

:ready
echo 服务已就绪。
echo.
echo [4/4] 启动公网隧道（新窗口）...
start "HiWhale Tunnel" cmd /k cloudflared tunnel --config "C:\Users\Administrator\.cloudflared\config-hiwhale.yml" run hiwhale-local

echo 等待隧道建连...
timeout /t 8 /nobreak >nul

echo.
echo ============================================
echo   启动完成，正在打开浏览器...
echo   门户站   https://hiwhalerob.com
echo   管理后台 https://admin.hiwhalerob.com  (admin@hiwhale.com)
echo   本地调试 http://localhost:3000/zh
echo ============================================
start https://hiwhalerob.com
start https://admin.hiwhalerob.com
echo.
echo 关闭 "HiWhale Dev Servers" 和 "HiWhale Tunnel" 两个窗口即停止服务。
pause
