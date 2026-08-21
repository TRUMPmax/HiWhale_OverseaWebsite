# syntax=docker/dockerfile:1

# HiWhale 门户（apps/portal）生产镜像
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
RUN pnpm install --frozen-lockfile

# ---- build：先构建 shared（tsup → dist），再构建 Next standalone ----
FROM base AS build
COPY --from=deps /app/ /app/
COPY . .
RUN pnpm --filter @hiwhale/shared build \
  && pnpm --filter portal build

# ---- runner：standalone 精简产物 ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
# outputFileTracingRoot 指向 monorepo 根，server.js 位于 apps/portal/server.js
COPY --from=build /app/apps/portal/.next/standalone ./
COPY --from=build /app/apps/portal/.next/static ./apps/portal/.next/static
COPY --from=build /app/apps/portal/public ./apps/portal/public
USER nextjs
EXPOSE 3000
CMD ["node", "apps/portal/server.js"]
