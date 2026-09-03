# HiWhale Robotics 海外独立站 — AGENTS.md

> 智能机器人/智能仓储企业海外官网 + 管理后台。pnpm + Turborepo monorepo。

## 结构

- `apps/portal` — 海外门户站（Next.js 14 App Router + next-intl 中英双语 + Tailwind v3 + GSAP/Lenis），端口 3000
- `apps/admin` — 管理后台（Next.js 14 + shadcn/ui TW3 + zustand），端口 3001，纯中文
- `packages/shared` — `@hiwhale/shared`：枚举/标签、类型、mock 数据注册表（tsup 构建 dist 后被 apps 引用）
- `api/` — 后端占位（plain node server，/health）；正式后端 NestJS 待开发
- `docker/` — Dockerfile ×4 + nginx.conf；`deploy.sh` 一键部署
- `docs/modules/` — 未实装模块的接口契约文档（部署加固/邮件/通知/RAG/Turnstile/RBAC/内容接通），供 AI 编码模型独立实施；总报告 `docs/上线查漏补缺-总报告.md`
- `assets/inbox/` — **用户素材收件箱**（主仓库根目录，不入 worktree）

## 常用命令（仓库根目录）

- **一键启动（推荐）**：双击根目录 `启动开发环境.bat`，或 `pnpm dev:up`(= `scripts/dev-up.sh` 基础设施 + `pnpm dev:all` 三个服务）
- 单独开发：`pnpm dev:portal` / `pnpm dev:admin` / `pnpm dev:api`；基础设施单独起：`pnpm dev:setup`
- 校验：`pnpm format` + `pnpm lint` + `pnpm type-check`（**dev server 运行期间禁止 `pnpm build`**——会清空 .next 导致 dev server 500）
- 数据库：`pnpm db:migrate` / `pnpm db:seed`
- 部署：`bash deploy.sh`（需 Docker daemon）
- 素材位文件经命名卷 portal_images 在 api 与 portal 容器间共享（PORTAL_PUBLIC_DIR=/portal-public）

## 关键约定

- **品牌**：深蓝 #0A2540 + 品牌蓝 #1A56DB + 星辰黄 #FFD25A（仅深色背景点缀）+ 夜空 #061529/#050D1F；禁止紫色/渐变底色/emoji（图标用 lucide）
- **品牌名**写作 `HiWhale Robotics`（W 大写），组件 `components/ui/BrandName.tsx`（Hi 黄 + Whale Robotics 蓝）
- **双语**：portal 所有文案走 next-intl `t()`，`messages/en.json` + `zh.json` 必须同步；占位图说明文字刻意用中文（双语文件里都写中文，方便用户备料）
- **占位素材**：`Placeholder` 组件（label=图片需求、size=比例+建议尺寸、name=素材文件名）；用户把素材放进 `assets/inbox/<类别>/`，接入时移动到 `apps/portal/public/images/<类别>/`；站点素材位已由后端注册表 + DB 动态槽统一管理（admin 素材管理 → 站点素材位；动态槽：产品分组组合图随分类体系生成、方案场景图、案例现场图/客户 Logo），portal 端用 SlottedImage onError 自动回退占位块，白名单模式（_\_WITH_IMAGE）已废弃；视频槽（home-brand-video）已接 portal 播放（preload=none 点击加载）；3D 模型板块已整体下线（R3F 依赖已移除，model glb 素材槽已删，2026-08-27）
- **mock 数据**：全部集中在 `packages/shared/src/constants/{products,solutions,cases}/`（每实体一个文件 + index 注册表）；后端就绪后只换数据访问层；方案/案例与产品的关联为真实 productSlugs（删除产品时 API 级联清理）
- **公司真实信息**：浩鲸机器人（青岛）有限公司 / 广东浩鲸科技有限公司；联系 mia@gdhjtech.com / +86 176-8558-8160；深圳总部 + 苏州/青岛基地；禁止再写"上海"
- **认证标识**：本地手绘 SVG（CE 按官方构造；UL 为示意版待官方素材；ISO 用文字徽章——ISO 禁止 logo 商用）

## 网络环境备注

本机网络仅 GitHub 系（raw.githubusercontent/jsdelivr）、npm 镜像、NASA 系可直连；Wikimedia/大多数图床被墙。下载素材优先走可达源。

## 进度

阶段 0–10 全部完成（基座/设计系统/首页滚轮叙事/产品中心/方案案例关于联系/AI客服+用户中心/后台框架/后台CRUD/后台全模块/Docker）。
后端全部完成：NestJS+Prisma+pgvector schema / 认证（JWT+邮箱验证码）/ 产品·方案·案例·询盘·用户·员工 CRUD / MinIO 文件上传 / DeepSeek 流式对话 / 站点设置与内容持久化 / 收藏夹 / 仪表盘统计 / 操作日志。前后台全链路真实 API，mock 仅作 API 不可用时的回退。
唯一待做：RAG 检索管线（混合检索/重排，`api/src/modules/knowledge/retrieval.service.ts` 有接口桩，指南第六部分）——业主自行接入产品手册后实施。
方案扩充（2026-08-27）：行业方案 6→11（新增化工化纤/轮胎橡胶/锂电材料/家居/电线电缆），导航栏方案悬停下拉；产品/品类/大类支持拖动排序（reorder API + Product.sort）；产品详情图片 1~N 张灵活渲染。
素材管理：重命名 + 站点素材位（静态注册表 + 分类体系/方案/案例动态槽，新增分组自动出现上传位）；产品删除级联清理方案/案例关联（2026-08）。
行业方案扩展（2026-08-27）：Industry 枚举 6→11（新增化工化纤/轮胎橡胶/锂电材料/家居制造/电线电缆），方案 6→11；首页 HeroNarrative 第二幕与 IndustrySolutions 卡片区经 `CORE_INDUSTRIES`（components/home/assets.ts）固定只渲染原 6 个核心行业，方案中心/案例筛选不受影响；行业回退图 industry-*.png 已入 API 静态素材位注册表。
上线查漏补缺（2026-08-25）：mock 假数据已清（门户假询盘/admin 假待办假浏览量/lib mock 数据/Topbar 装饰件/死链死按钮）；未实装模块已文档化到 docs/modules/（邮件/通知/RAG/Turnstile/RBAC/部署加固/内容接通），待按文档实施；业主待办见 docs/上线查漏补缺-总报告.md §6。
上线决策执行（2026-08-25 第二轮）：纯海外发布（无 ICP）；注册邮箱验证码（Resend，02 文档已实施）；AI 客服 FAQ 驱动（RAG 暂缓，FAQ 支持 CSV 批量导入/导出：GET/POST `/api/knowledge/faqs/export|import`，追加模式按 question 去重）；AI 设置/内容管理已真实生效；部署加固核心项已落地（构建期 NEXT_PUBLIC 注入、compose env 补全、migrate 自动化、JWT_SECRET 生产强制、nginx 安全头+限频）；HTTPS 待域名购买后按 01 文档启用。
后台全量内容管理（2026-09-03）：Solution 补 duration 交付周期字段（对齐案例，迁移 20260903120000）；图标体系上线——shared `PORTAL_ICON_OPTIONS` 白名单（45 项纯数据，禁 React 依赖）+ portal `IconByName` + admin `IconPicker`，挂接点：产品大类 `icon` 列（品类管理可选，首页产品生态区消费）/方案痛点/产品特性/案例与方案指标（JSON 条目可选 `icon`；空则回退默认——大类/痛点/特性回退原写死图标，指标原本无图标则不渲染）；首页行业卡片走 site_settings `home-industries`（内容管理新 Tab，HeroNarrative 第二幕 + IndustrySolutions 消费，无配置回退 CORE_INDUSTRIES + messages）；回本周期作为成果/成效指标的一行维护（表单已有提示）；seed 方案/案例 upsert 改为仅补缺（不再覆盖后台编辑）。
后台体验增强（2026-09-03）：案例/产品编辑实时预览（admin 侧 `CasePreview`/`ProductPreview` 近似门户布局，随表单 state 实时渲染，中/EN 切换；案例弹窗 max-w-6xl 双栏，产品表单页 grid-cols-5 + sticky 预览）；图标支持上传自定义文件（icon 字段双形态：白名单 name 或 MinIO URL，复用 `/api/uploads?kind=image`；admin 统一渲染组件 `IconGlyph`，portal `IconByName` 改 client 组件且 fallback 改传 `fallbackName` 名称）；后台侧边栏改一级类目+下拉二级（总览/门户内容/线索与客户/AI/系统，当前路由所在组自动展开，展开状态 localStorage `admin-nav-expanded` 持久化；`NAV_ITEMS` 保留为 flatMap 兼容导出供 Topbar）。
