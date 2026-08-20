#!/usr/bin/env bash
#
# HiWhale 部署脚本：拉取代码 → 构建镜像 → 备份数据库 → 滚动上线
# 用法：bash deploy.sh（在 monorepo 根目录执行，需 Docker daemon 运行中）

set -euo pipefail

echo "==> [1/5] 拉取最新代码"
git pull

echo "==> [2/5] 构建 Docker 镜像"
docker compose build

echo "==> [3/5] 备份 PostgreSQL（若数据库未运行则跳过）"
if docker compose ps --status running postgres 2>/dev/null | grep -q postgres; then
  BACKUP_FILE="backup-$(date +%Y%m%d-%H%M%S).sql"
  docker compose exec -T postgres pg_dump -U "${POSTGRES_USER:-hiwhale}" "${POSTGRES_DB:-hiwhale}" > "$BACKUP_FILE"
  echo "    备份完成：$BACKUP_FILE"
else
  echo "    数据库未运行，跳过备份"
fi

echo "==> [4/5] 启动服务"
docker compose up -d

echo "==> [5/5] 服务状态"
docker compose ps

echo ""
echo "部署完成。访问地址："
echo "  门户:     http://hiwhale.com        (本地测试: http://localhost)"
echo "  管理后台: http://admin.hiwhale.com  (本地测试: 添加 hosts 或使用 http://localhost + Host 头)"
echo "  API:      http://api.hiwhale.com    (健康检查: /health)"
