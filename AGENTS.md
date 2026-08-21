# HiWhale Robotics 海外独立站 — AGENTS.md

> 智能机器人/智能仓储企业海外官网 + 管理后台。pnpm + Turborepo monorepo。

## 结构

- `apps/portal` — 海外门户站（Next.js 14 App Router + next-intl 中英双语 + Tailwind v3 + GSAP/Lenis），端口 3000
- `apps/admin` — 管理后台（Next.js 14 + shadcn/ui TW3 + zustand），端口 3001，纯中文
- `packages/shared` — `@hiwhale/shared`：枚举/标签、类型、mock 数据注册表（tsup 构建 dist 后被 apps 引用）
- `api/` — 后端占位（plain node server，/health）；正式后端 NestJS 待开发
- `docker/` — Dockerfile ×4 + nginx.conf；`deploy.sh` 一键部署
- `assets/inbox/` — **用户素材收件箱**（主仓库根目录，不入 worktree）

## 常用命令（仓库根目录）

- 开发：`pnpm dev:portal` / `pnpm dev:admin`
- 校验：`pnpm format` + `pnpm lint` + `pnpm type-check`（**dev server 运行期间禁止 `pnpm build`**——会清空 .next 导致 dev server 500）
- 部署：`bash deploy.sh`（需 Docker daemon）

## 关键约定

- **品牌**：深蓝 #0A2540 + 品牌蓝 #1A56DB + 星辰黄 #FFD25A（仅深色背景点缀）+ 夜空 #061529/#050D1F；禁止紫色/渐变底色/emoji（图标用 lucide）
- **品牌名**写作 `HiWhale Robotics`（W 大写），组件 `components/ui/BrandName.tsx`（Hi 黄 + Whale Robotics 蓝）
- **双语**：portal 所有文案走 next-intl `t()`，`messages/en.json` + `zh.json` 必须同步；占位图说明文字刻意用中文（双语文件里都写中文，方便用户备料）
- **占位素材**：`Placeholder` 组件（label=图片需求、size=比例+建议尺寸、name=素材文件名）；用户把素材放进 `assets/inbox/<类别>/`，接入时移动到 `apps/portal/public/images/<类别>/` 并在组件里加白名单开关（参考 IndustrySolutions 的 `INDUSTRIES_WITH_IMAGE` 模式）
- **mock 数据**：全部集中在 `packages/shared/src/constants/{products,solutions,cases}/`（每实体一个文件 + index 注册表）；后端就绪后只换数据访问层
- **公司真实信息**：浩鲸机器人（青岛）有限公司 / 广东浩鲸科技有限公司；联系 mia@gdhjtech.com / +86 176-8558-8160；深圳总部 + 苏州/青岛基地；禁止再写"上海"
- **认证标识**：本地手绘 SVG（CE 按官方构造；UL 为示意版待官方素材；ISO 用文字徽章——ISO 禁止 logo 商用）

## 网络环境备注

本机网络仅 GitHub 系（raw.githubusercontent/jsdelivr）、npm 镜像、NASA 系可直连；Wikimedia/大多数图床被墙。下载素材优先走可达源。

## 进度

阶段 0–10 全部完成（基座/设计系统/首页滚轮叙事/产品中心/方案案例关于联系/AI客服+用户中心/后台框架/后台CRUD/后台全模块/Docker）。
后端全部完成：NestJS+Prisma+pgvector schema / 认证（JWT+邮箱验证码）/ 产品·方案·案例·询盘·用户·员工 CRUD / MinIO 文件上传 / DeepSeek 流式对话 / 站点设置与内容持久化 / 收藏夹 / 仪表盘统计 / 操作日志。前后台全链路真实 API，mock 仅作 API 不可用时的回退。
唯一待做：RAG 检索管线（混合检索/重排，`api/src/modules/knowledge/retrieval.service.ts` 有接口桩，指南第六部分）——业主自行接入产品手册后实施。
