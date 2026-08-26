# syntax=docker/dockerfile:1

# HiWhale API（NestJS）生产镜像
# 注意：构建上下文为 monorepo 根目录

FROM node:20-alpine AS base
RUN corepack enable
WORKDIR /app

# ---- deps：仅拷贝清单文件，最大化利用缓存 ----
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/portal/package.json apps/portal/package.json
COPY apps/admin/package.json apps/admin/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY api/package.json api/package.json
RUN pnpm install --frozen-lockfile

# ---- build：生成 Prisma Client 并编译 NestJS ----
FROM base AS build
COPY --from=deps /app/ /app/
COPY . .
RUN pnpm --filter @hiwhale/api exec prisma generate \
  && pnpm --filter @hiwhale/api build

# ---- runner ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=4000
RUN addgroup -S nodejs && adduser -S api -G nodejs
# pnpm workspace：依赖符号链接需保持目录结构（根 node_modules + api/node_modules）
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/api/node_modules ./api/node_modules
COPY --from=build /app/api/package.json ./api/package.json
COPY --from=build /app/api/dist ./dist
COPY --from=build /app/api/prisma ./prisma
# 运维脚本（init-minio 等，供 migrate 一次性服务使用）
COPY --from=build /app/api/scripts ./scripts
# 站点素材目录初始化：把 portal 已有素材烘进镜像，命名卷 portal_images 首次挂载时即含全部素材
COPY --from=build /app/apps/portal/public/images /portal-public/images
RUN mkdir -p /portal-public/images && chown -R api:nodejs /portal-public
USER api
EXPOSE 4000
CMD ["node", "dist/main.js"]
