@echo off
chcp 65001 >nul
title HiWhale 开发环境
cd /d %~dp0

echo ============================================
echo   HiWhale 一键启动开发环境
echo ============================================
echo.

echo [1/2] 基础设施 (Docker + 数据库 + 种子数据)...
"C:\Program Files\Git\bin\bash.exe" scripts/dev-up.sh
if errorlevel 1 (
  echo.
  echo 基础设施启动失败，请检查 Docker Desktop 后重试。
  pause
  exit /b 1
)

echo.
echo [2/2] 启动开发服务器 (按 Ctrl+C 全部停止)...
echo   门户站   http://localhost:3000/zh
echo   管理后台 http://localhost:3001  (admin@hiwhale.com / admin123)
echo   API      http://localhost:4000/health
echo.
pnpm dev:all
