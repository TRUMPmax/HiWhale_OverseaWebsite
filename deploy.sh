#!/usr/bin/env bash
#
# HiWhale 部署脚本：拉取代码 → 构建镜像 → 备份数据库 → 滚动上线（含迁移/MinIO 初始化）→ 健康检查
# 用法：bash deploy.sh（在 monorepo 根目录执行，需 Docker daemon 运行中）
# 前提：根目录存在 .env（从 .env.example 复制并填好生产值；compose 变量替换只读 .env）

set -euo pipefail

if [ ! -f .env ]; then
  echo "⚠️  未找到根目录 .env，将使用 docker-compose.yml 中的开发默认值（生产请务必先创建 .env）"
fi

echo "==> [1/6] 拉取最新代码"
git pull

echo "==> [2/6] 构建 Docker 镜像"
docker compose build

echo "==> [3/6] 备份 PostgreSQL（若数据库未运行则跳过；保留最近 7 份）"
mkdir -p backups
if docker compose ps --status running postgres 2>/dev/null | grep -q postgres; then
  BACKUP_FILE="backups/backup-$(date +%Y%m%d-%H%M%S).sql"
  docker compose exec -T postgres pg_dump -U "${POSTGRES_USER:-hiwhale}" "${POSTGRES_DB:-hiwhale}" > "$BACKUP_FILE"
  echo "    备份完成：$BACKUP_FILE"
  ls -t backups/backup-*.sql 2>/dev/null | tail -n +8 | xargs -r rm
else
  echo "    数据库未运行，跳过备份"
fi

echo "==> [4/6] 启动服务（数据库迁移 + MinIO 初始化由 migrate 一次性服务自动完成）"
docker compose up -d

echo "==> [5/6] 健康检查"
ok=0
for i in $(seq 1 30); do
  if curl -fsS http://localhost/health >/dev/null 2>&1 || curl -fsS -H "Host: api.hiwhale.com" http://localhost/health >/dev/null 2>&1; then
    ok=1
    break
  fi
  sleep 2
done
if [ "$ok" = "1" ]; then
  echo "    API 健康检查通过"
else
  echo "    ❌ API 健康检查超时，请执行 docker compose logs api 排查" >&2
  exit 1
fi
curl -fsS -o /dev/null -w "    portal HTTP %{http_code}\n" http://localhost/ || echo "    ⚠️  portal 未就绪"

echo "==> [6/6] 服务状态"
docker compose ps

echo ""
echo "部署完成。访问地址（域名购买后挂载，当前为规划值）："
echo "  门户:     http://hiwhale.com        (本地测试: http://localhost)"
echo "  管理后台: http://admin.hiwhale.com  (本地测试: 添加 hosts 或使用 http://localhost + Host 头)"
echo "  API:      http://api.hiwhale.com    (健康检查: /health)"
echo ""
echo "首次部署后请创建超管账号（seed 依赖 monorepo 的 shared 包，需在仓库环境执行）："
echo "  DATABASE_URL=<生产库连接串> SEED_ADMIN_PASSWORD=<强密码> pnpm --filter @hiwhale/api db:seed"
echo "  然后立即登录管理后台改密。"
