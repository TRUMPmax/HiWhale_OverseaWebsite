@echo off
chcp 65001 >nul
title HiWhale 开发环境
cd /d %~dp0

echo ============================================
echo   HiWhale 一键启动开发环境（本地模式）
echo ============================================
echo.

echo [0/3] 切换前端环境变量为本地模式...
"C:\Program Files\Git\bin\bash.exe" scripts/use-local-env.sh
if errorlevel 1 (
  echo 环境变量切换失败。
  pause
  exit /b 1
)
echo.

echo [1/3] 基础设施 (Docker + 数据库 + 种子数据)...
"C:\Program Files\Git\bin\bash.exe" scripts/dev-up.sh
if errorlevel 1 (
  echo.
  echo 基础设施启动失败，请检查 Docker Desktop 后重试。
  pause
  exit /b 1
)

echo.
echo [3/3] 启动开发服务器 (按 Ctrl+C 全部停止)...
echo   门户站   http://localhost:3000/zh
echo   管理后台 http://localhost:3001  (admin@hiwhale.com / admin123)
echo   API      http://localhost:4000/health
echo.
pnpm dev:all
