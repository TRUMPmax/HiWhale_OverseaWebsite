#!/usr/bin/env bash
# 本地开发模式：前端 API 地址指向本机
# 由 启动开发环境.bat 调用
set -e
cd "$(dirname "$0")/.."
for f in apps/portal/.env.local apps/admin/.env.local; do
  sed -i 's|^NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=http://localhost:4000|' "$f"
done
sed -i 's|^NEXT_PUBLIC_PORTAL_URL=.*|NEXT_PUBLIC_PORTAL_URL=http://localhost:3000|' apps/admin/.env.local
echo "[env] 已切换为本地模式：NEXT_PUBLIC_API_URL=http://localhost:4000"
