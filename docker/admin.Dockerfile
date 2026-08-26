# syntax=docker/dockerfile:1

# HiWhale 管理后台（apps/admin）生产镜像
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
# NEXT_PUBLIC_* 在 next build 时内联，必须构建期传入（运行时 env 无效）
ARG NEXT_PUBLIC_API_URL=http://localhost:4000
ARG NEXT_PUBLIC_PORTAL_URL=http://localhost:3000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_PORTAL_URL=$NEXT_PUBLIC_PORTAL_URL
COPY --from=deps /app/ /app/
COPY . .
RUN pnpm --filter @hiwhale/shared build \
  && pnpm --filter admin build

# ---- runner：standalone 精简产物 ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3001 \
    HOSTNAME=0.0.0.0
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
# outputFileTracingRoot 指向 monorepo 根，server.js 位于 apps/admin/server.js
COPY --from=build /app/apps/admin/.next/standalone ./
COPY --from=build /app/apps/admin/.next/static ./apps/admin/.next/static
COPY --from=build /app/apps/admin/public ./apps/admin/public
USER nextjs
EXPOSE 3001
CMD ["node", "apps/admin/server.js"]
