#!/usr/bin/env bash
# HiWhale 开发环境一键初始化：Docker 基础设施 + 数据库迁移 + 种子数据
set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> [1/4] 检查 Docker daemon..."
if ! docker info >/dev/null 2>&1; then
  echo "    Docker 未运行，正在启动 Docker Desktop..."
  powershell -Command "Start-Process 'C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe'" || true
  for i in $(seq 1 36); do
    docker info >/dev/null 2>&1 && break
    echo "    等待 Docker 就绪... ($i)"
    sleep 5
  done
fi
docker info >/dev/null 2>&1 || { echo "Docker 启动失败，请手动启动 Docker Desktop 后重试"; exit 1; }
echo "    Docker OK"

echo "==> [2/4] 启动基础设施容器 (postgres / redis / minio)..."
# 幂等：容器已存在（可能由其他目录的 compose 项目创建）则直接启动，否则 compose 创建
for c in hiwhale-postgres hiwhale-redis hiwhale-minio; do
  if docker ps -a --format '{{.Names}}' | grep -qx "$c"; then
    docker start "$c" >/dev/null
  else
    docker compose up -d
    break
  fi
done

echo "==> [3/4] 等待 PostgreSQL 健康检查..."
for i in $(seq 1 30); do
  status=$(docker inspect --format '{{.State.Health.Status}}' hiwhale-postgres 2>/dev/null || echo "starting")
  [ "$status" = "healthy" ] && break
  sleep 3
done
echo "    PostgreSQL $status"

echo "==> [4/4] 数据库迁移 + 种子数据 + MinIO 桶..."
pnpm db:migrate
pnpm db:seed
pnpm --filter @hiwhale/api init:minio || true

echo ""
echo "✅ 基础设施就绪！"
echo "   PostgreSQL :5432  Redis :6379  MinIO :9000 (控制台 :9001)"
echo ""
echo "下一步启动全部开发服务器："
echo "   pnpm dev:all      # portal:3000 + admin:3001 + api:4000 同时拉起"
