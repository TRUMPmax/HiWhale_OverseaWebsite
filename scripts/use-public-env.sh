#!/usr/bin/env bash
# 公网测试模式：前端 API 地址指向 Cloudflare 隧道域名（需隧道运行）
# 由 启动公网测试环境.bat 调用
set -e
cd "$(dirname "$0")/.."
for f in apps/portal/.env.local apps/admin/.env.local; do
  sed -i 's|^NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=https://api.hiwhalerob.com|' "$f"
done
sed -i 's|^NEXT_PUBLIC_PORTAL_URL=.*|NEXT_PUBLIC_PORTAL_URL=https://hiwhalerob.com|' apps/admin/.env.local
echo "[env] 已切换为公网模式：NEXT_PUBLIC_API_URL=https://api.hiwhalerob.com"
