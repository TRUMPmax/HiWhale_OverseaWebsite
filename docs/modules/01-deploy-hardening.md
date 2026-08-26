# 01 · 部署与环境加固

> 先读 [README.md](README.md) §0 项目速览。本模块只动 `docker/`、`docker-compose.yml`、`deploy.sh`、`.env.example`、`api/src/main.ts` 等配置层，不动业务逻辑。

## 目标

让 `bash deploy.sh` 在生产服务器上跑一次即可得到：正确构建的前端镜像（API 地址内联正确）、数据库自动迁移、MinIO 桶自动初始化、HTTPS、安全头与限频、无默认弱密钥。

## 背景问题（现状 → 后果）

| 问题                                               | 位置                                                                                | 后果                                                                                                                                                         |
| -------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_API_URL` 构建期未传入                 | `docker/portal.Dockerfile`、`docker/admin.Dockerfile` 无 ARG                        | Next.js standalone 在 `next build` 时内联 NEXT_PUBLIC_*，运行时 env 无效 → 生产前端 API 指向 `localhost:4000`，全站 API 失败并静默回退 mock                  |
| api 容器只传 4 个环境变量                          | `docker-compose.yml` api 服务 environment（约 :85-89）                              | `JWT_SECRET`/`DEEPSEEK_API_KEY`/`SMTP_*`/`CORS_ORIGINS`/`MINIO_ACCESS_KEY/SECRET_KEY`/`MINIO_PUBLIC_URL` 全部缺失 → JWT 用公开默认密钥、AI 死、SMTP 演示模式 |
| `JWT_SECRET` 代码 fallback `dev-secret-change-me`  | `api/src/modules/auth/auth.module.ts:12`、`api/src/modules/auth/jwt.strategy.ts:18` | 任何人可伪造 SUPER_ADMIN token                                                                                                                               |
| compose 变量替换只读根 `.env`（不读 `.env.local`） | 部署流程                                                                            | 服务器上所有 `${VAR:-default}` 落回 `*_dev` 默认值                                                                                                           |
| `prisma migrate deploy` 无自动化                   | compose migrate 服务整段注释（约 :107-119）                                         | 新库不会自动建表                                                                                                                                             |
| MinIO 桶初始化手动                                 | `api/scripts/init-minio.js`（`pnpm init:minio`）                                    | 部署后上传功能 500                                                                                                                                           |
| HTTPS 未启用                                       | `docker/nginx.conf` 443 块整段注释（约 :120-183）；compose 只映射 80                | 明文传输                                                                                                                                                     |
| 无安全头/限频                                      | nginx.conf                                                                          | 暴力破解/点击劫持面                                                                                                                                          |
| postgres/redis/minio 端口映射宿主机                | compose :11-12, :33, :50-51                                                         | 数据库直接暴露公网                                                                                                                                           |
| api 不 depends_on minio                            | compose :94-98                                                                      | MinIO 未就绪时上传失败                                                                                                                                       |
| 备份无轮转且未 gitignore                           | deploy.sh pg_dump 到仓库根                                                          | 仓库目录膨胀/误提交                                                                                                                                          |

## 实施规格

### 1. 前端镜像构建期注入（两个 Dockerfile 同样处理）

`docker/portal.Dockerfile` 与 `docker/admin.Dockerfile` 在 build 阶段加：

```dockerfile
ARG NEXT_PUBLIC_API_URL=https://api.hiwhale.com
ARG NEXT_PUBLIC_PORTAL_URL=https://hiwhale.com   # 仅 portal 需要（admin 的 SiteAssetsPanel 用到 NEXT_PUBLIC_PORTAL_URL，给 admin 也加）
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_PORTAL_URL=$NEXT_PUBLIC_PORTAL_URL
```

（置于 `RUN pnpm build` 之前。）

`docker-compose.yml` 两个服务的 `build:` 加：

```yaml
build:
  args:
    NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL:-https://api.hiwhale.com}
    NEXT_PUBLIC_PORTAL_URL: ${NEXT_PUBLIC_PORTAL_URL:-https://hiwhale.com}
```

删除 portal 服务 environment 里无效的 `NEXT_PUBLIC_API_URL: http://api:4000` 运行时注入。

### 2. compose api 服务 environment 补全

```yaml
environment:
  NODE_ENV: production
  DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
  JWT_SECRET: ${JWT_SECRET} # 无默认值，缺失即变量展开警告
  DEEPSEEK_API_KEY: ${DEEPSEEK_API_KEY:-}
  DEEPSEEK_BASE_URL: ${DEEPSEEK_BASE_URL:-https://api.deepseek.com}
  CORS_ORIGINS: ${CORS_ORIGINS:-https://hiwhale.com,https://www.hiwhale.com,https://admin.hiwhale.com}
  SMTP_HOST: ${SMTP_HOST:-}
  SMTP_PORT: ${SMTP_PORT:-587}
  SMTP_USER: ${SMTP_USER:-}
  SMTP_PASSWORD: ${SMTP_PASSWORD:-}
  SMTP_FROM: ${SMTP_FROM:-noreply@hiwhale.com}
  MINIO_ENDPOINT: minio
  MINIO_ACCESS_KEY: ${MINIO_ROOT_USER}
  MINIO_SECRET_KEY: ${MINIO_ROOT_PASSWORD}
  MINIO_PUBLIC_URL: ${MINIO_PUBLIC_URL:-https://api.hiwhale.com/files}
  PORTAL_PUBLIC_DIR: /portal-public
  TURNSTILE_SECRET_KEY: ${TURNSTILE_SECRET_KEY:-}
```

同时：api `depends_on` 增加 `minio: condition: service_started`；postgres/redis/minio 删除宿主机 `ports:` 映射（仅 nginx 暴露 80/443）；redis healthcheck 密码改用 `${REDIS_PASSWORD}`。

### 3. 迁移与初始化自动化

启用 compose 中已注释的 `migrate` 一次性服务（`prisma migrate deploy`），并在其成功后追加 MinIO 初始化：可将 `api/scripts/init-minio.js` 包进同一 command（`node prisma/... && node scripts/init-minio.js`），api 服务 `depends_on` 该 migrate 服务 `condition: service_completed_successfully`。

`deploy.sh` 在 `up -d` 后追加健康检查：

```bash
for i in $(seq 1 30); do
  curl -fsS http://localhost/api/health >/dev/null 2>&1 && break || sleep 2
done
curl -fsS -o /dev/null -w "portal:%{http_code}\n" http://localhost/
```

备份目录改为 `./backups/` 并在 `.gitignore` 加 `backups/`；保留最近 7 份（`ls -t backups/backup-*.sql | tail -n +8 | xargs -r rm`）。

### 4. JWT_SECRET 去兜底（代码改动，仅两处）

`auth.module.ts:12` 与 `jwt.strategy.ts:18`：读取后判空——`NODE_ENV === "production"` 且未配置时 `throw new Error("JWT_SECRET is required in production")`；开发环境允许 fallback。两处共用一个 helper（放 `api/src/common/env.ts`）。

### 5. nginx 加固（docker/nginx.conf）

- 启用 443 server 块（已有注释模板），证书挂载 `./certs`（compose nginx volumes 加 `./certs:/etc/nginx/certs:ro`），80 端口对非 ACME 路径 301 到 https
- **删掉 nginx 层 CORS**（api.hiwhale.com server 块内 `add_header Access-Control-*`），CORS 统一交给 Nest（`CORS_ORIGINS` 已含 admin 域）——现状双层 CORS 会产生重复头被浏览器拒绝
- http 级加：`limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;` 并在 api server 的 `/auth/`、`/inquiries` location 加 `limit_req zone=api burst=20 nodelay;`
- 各 server 加安全头：`X-Frame-Options SAMEORIGIN`、`X-Content-Type-Options nosniff`、`Referrer-Policy strict-origin-when-cross-origin`、（HTTPS 后）`Strict-Transport-Security max-age=31536000`

### 6. .env.example 同步

补：`JWT_SECRET`（标注"生产必填，openssl rand -hex 32 生成"）、`MINIO_ACCESS_KEY/SECRET_KEY`（说明容器内=root 凭据）、`MINIO_PUBLIC_URL`、`CORS_ORIGINS`、`NEXT_PUBLIC_PORTAL_URL`；删除死变量 `AUTH_SECRET`、`NEXTAUTH_URL`、`NEXT_PUBLIC_APP_URL`、`NEXT_PUBLIC_WEB_URL`、`NEXT_PUBLIC_ADMIN_URL`（代码零引用）。

### 7. seed 超管弱密码

`api/prisma/seed.js:22-30`：`admin123` 改为从 `process.env.SEED_ADMIN_PASSWORD` 读取，未配置时生成随机密码并打印一次到控制台（提示立即登录改密）。邮箱 `admin@hiwhale.com` 可通过 `SEED_ADMIN_EMAIL` 覆盖。

## 验收

1. 服务器上只有根 `.env`（从 `.env.example` 复制填值），`docker compose config` 无警告
2. 全新环境 `bash deploy.sh` 后：`curl https://hiwhale.com` 200、`curl https://api.hiwhale.com/api/health` 200、admin 登录成功、门户注册验证码不发 devCode（SMTP 已配则收到真实邮件）、上传图片 URL 为公网域名
3. 生产容器内 `node -e "console.log(process.env.JWT_SECRET)"` 非默认值；去掉 JWT_SECRET 后 api 容器启动即报错
4. `pnpm type-check` 全绿（api 改动后）

## 禁止事项

- 不要把任何真实密钥写进 git 跟踪文件
- 不要改 nginx 的 `/_next/static/`、`/images/` 转发规则
- 不要给 postgres/redis/minio 重新加回宿主机端口映射
