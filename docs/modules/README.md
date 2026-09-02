# 模块实施文档索引

> 目的：每份文档自包含——AI 编码模型**无需通读项目代码**，仅凭单篇文档即可完成该模块实施。
> 公共约定集中在本文档 §0，各模块文档不再重复。

## §0 项目速览（所有模块共享的上下文）

**HiWhale Robotics 海外独立站**：pnpm + Turborepo monorepo，目录：

- `apps/portal` — 海外门户站，Next.js 14 App Router + next-intl（`messages/en.json`+`zh.json` 必须同步增删 key）+ Tailwind v3。端口 3000
- `apps/admin` — 管理后台，Next.js 14 + shadcn/ui + zustand（persist 到 localStorage），纯中文界面。端口 3001
- `api/` — NestJS 10 + Prisma + PostgreSQL(pgvector) + MinIO。端口 4000，全局前缀 `/api`（controller 里写 `@Controller("users")` 即 `/api/users`）
- `packages/shared` — `@hiwhale/shared`，tsup 构建到 dist 后被 apps 引用（改了要重新 build）
- `docker/` — 4 个 Dockerfile + nginx.conf；根目录 `docker-compose.yml`、`deploy.sh`

**硬性约定：**

1. 品牌：深蓝 `#0A2540` / 品牌蓝 `#1A56DB` / 星辰黄 `#FFD25A`（仅深色背景点缀）；禁紫色、渐变底色、emoji（图标一律 lucide-react）
2. 文案：portal 一切文案走 next-intl `t()`；admin 纯中文直写
3. 后端鉴权：`JwtAuthGuard` + `@CurrentUser() payload: JwtPayload`，payload 形状 `{ sub, email, kind: "user"|"staff", role?: string }`；员工角色 `StaffRole = SUPER_ADMIN | SALES | PRODUCT_TECH | OPERATIONS`
4. 后端操作日志：注入全局 `OperationLogService`（`api/src/modules/logs/logs.module.ts`），`await this.logs.log(staffId, "动作", target)`，失败不影响主流程
5. admin 调 API：`adminApi(path, { method, body })`（`apps/admin/lib/api.ts`，自动带 token，base 为 `NEXT_PUBLIC_API_URL`）；portal：`apiGet/apiPost`（`apps/portal/lib/api.ts`）
6. 校验：`pnpm format && pnpm lint && pnpm type-check`（仓库根）；**dev server 运行期间禁止 `pnpm build`**
7. 数据库变更：改 `api/prisma/schema.prisma` 后在 `api/` 下 `pnpm prisma migrate dev --name <名>` 生成迁移
8. Prisma 模型时间戳命名：`createdAt/updatedAt` 带 `@map("created_at")` 蛇形映射

## 模块文档清单

| #   | 文档                                                   | 模块                                                  | 状态                                                         |
| --- | ------------------------------------------------------ | ----------------------------------------------------- | ------------------------------------------------------------ |
| 01  | [01-deploy-hardening.md](01-deploy-hardening.md)       | 部署与环境加固（Dockerfile/compose/deploy.sh/env）    | ✅ 核心项已实施（HTTPS 待域名购买后启用）                    |
| 02  | [02-mail.md](02-mail.md)                               | 邮件模块（MailModule 抽象 + 询盘通知）                | ✅ 已实施（Resend 注册验证码） |
| 03  | [03-notifications.md](03-notifications.md)             | 后台通知系统（schema + API + Topbar 铃铛）            | 待实施                                                       |
| 04  | [04-rag-retrieval.md](04-rag-retrieval.md)             | RAG 检索管线（解析/分块/embedding/混合检索/rerank）   | ⏸️ 暂缓（成本考虑；当前 FAQ 注入 prompt 已实装）             |
| 05  | [05-turnstile.md](05-turnstile.md)                     | Cloudflare Turnstile 防刷（询盘表单 + 验证码接口）    | 待实施（需业主申请密钥对）                                   |
| 06  | [06-rbac.md](06-rbac.md)                               | 权限矩阵实装（后端角色校验 + 前端导航过滤）           | 待实施                                                       |
| 07  | [07-content-ai-settings.md](07-content-ai-settings.md) | 内容管理 ↔ portal 接通 + AI 设置生效 + 仪表盘真实数据 | ✅ 已实施                                                    |

## 主会话直接实施的散点修复（不在模块文档内）

这些修复跨模块且零碎，不适合外包给无上下文的模型，由主会话完成（见各文件 git log）：

- portal：用户中心假询盘初始值、`mock-inquiries.ts` 删除、about 页 i18n key 失配（`m2016`→`m2017`、GlobalPresence locations key）、页脚死链（/terms /sitemap /cookie-policy）、VideoShowcase 死播放按钮
- admin：仪表盘假待办/假浏览量、Topbar 装饰件（只读搜索框/常亮通知点/无效菜单项）、`lib/mock/` 死代码清理、`StubPage` 删除
- api：`JWT_SECRET` 生产强制、SMTP 缺失时禁返 `devCode`（production）、send-code 限频
- docker：portal/admin Dockerfile 构建期 ARG `NEXT_PUBLIC_*`、compose 环境补齐（属 01 文档范畴，主会话先修致命项）

## 需要业主决策/提供（任何 AI 都无法代劳）

1. ~~ICP 备案号~~ → 已删除（纯海外发布，无需备案）
2. **真实经营数字**：500+ 项目 / 30+ 国家 / 99.9% / 50M+ 托盘 / 200+ 工程师 / 120+ 专利——核对后在 admin 站点设置（company-stats / company-about）配置
3. **UL 认证**：若无证书须从认证清单移除（虚假声明风险）
4. ~~SMTP 服务商凭据~~ → 暂缓（02 模块，注册仅校验邮箱格式）
5. **Turnstile 密钥对**（05 模块上线前提，Cloudflare 控制台免费申请）
6. **真实案例/证言**：6 个 mock 案例为虚构，业主汇总中，上线前替换（admin 案例管理直接改）
7. **生产密码**：PostgreSQL/MinIO/Redis/超管账号全部 `*_dev` 默认值须替换；seed 超管密码走 `SEED_ADMIN_PASSWORD`
8. **域名购买后**：根 `.env` 填 NEXT_PUBLIC_API_URL/CORS_ORIGINS/MINIO_PUBLIC_URL 为正式域名，启用 nginx HTTPS 注释块（01 文档 §5）
