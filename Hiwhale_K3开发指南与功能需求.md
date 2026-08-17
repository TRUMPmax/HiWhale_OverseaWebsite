# Hiwhale Robotics 项目 — Kimi K3 单模型开发指南

> **本文档用途**：专门为使用 Kimi Code（K3 模型）单 AI 开发本项目而整理。
> 包含：AI 编写注意事项、功能需求清单、分阶段执行计划、可直接复制的 Prompt 模板。
> **版本**：v1.1（增加 RAG 系统详细设计） ｜ **日期**：2026-08-17

---

## 第一部分：AI 编写注意事项（必读）

### 1.1 核心策略：分阶段、小步走、每步可验证

K3 单次上下文有限，**绝不能一次性要求它写完整个项目**。正确做法：

1. **按阶段拆分**：把项目拆成 10 个阶段，每个阶段是一次独立对话
2. **每阶段只做一件事**：一个阶段完成后，开新对话进入下一阶段
3. **先骨架后填充**：先把项目结构、路由、共享类型搭好，再逐页填充
4. **每步可运行**：每个阶段结束时项目必须能 `pnpm dev` 跑起来，不报错
5. **每步可验证**：每个阶段有明确的验收标准，在浏览器里确认后再继续

### 1.2 与 K3 协作的 Prompt 规则

每次给 K3 发任务时，Prompt 必须包含以下要素：

```
【角色】你是一个资深全栈工程师，使用 Next.js 14 + TypeScript + Tailwind CSS。
【任务】明确说明本次要做什么（只做这一件事）。
【上下文】当前项目已完成什么、文件结构是什么、本次任务依赖什么。
【规范】引用本文档中的设计规范、代码规范、禁止事项。
【产出】明确要创建/修改哪些文件，文件路径是什么。
【验收】完成后应该看到什么效果。
```

### 1.3 上下文管理技巧

| 技巧                    | 说明                                                            |
| ----------------------- | --------------------------------------------------------------- |
| **每阶段开新对话**      | 避免上下文过长导致 K3 遗忘早期规范                              |
| **新对话先贴规范**      | 每个新对话开头，把"第二部分设计规范"和"第三部分代码规范"贴给 K3 |
| **提供文件树**          | 每次任务附上当前项目文件结构，让 K3 知道在哪写                  |
| **提供已有代码**        | 如果要修改已有文件，把该文件完整内容贴给 K3                     |
| **一次只改 3-5 个文件** | 单次任务涉及的文件不要超过 5 个，多了拆成子任务                 |
| **让 K3 先输出计划**    | 复杂任务先让 K3 说实现思路，确认后再让它写代码                  |
| **及时修正**            | K3 写错了立刻指出，不要攒到最后                                 |

### 1.4 代码规范（每次对话都要提醒 K3）

#### 必须遵守

- ✅ TypeScript 严格模式，所有变量/函数有类型，禁止 `any`（实在不行用 `unknown`）
- ✅ 组件使用函数式组件 + hooks，不写 class 组件
- ✅ 样式用 Tailwind CSS，禁止内联 style（动态值除外）
- ✅ 布局使用 flex/grid/rem/%，**禁止写死固定 px 宽高**（边框、阴影除外）
- ✅ 所有文案通过 next-intl 的 `t('key')` 获取，**禁止硬编码中英文**
- ✅ 图标用 Lucide React，**绝对禁止 emoji**
- ✅ 组件不超过 300 行，超过就拆分子组件或抽 hook
- ✅ 公共逻辑抽自定义 hook，放 `hooks/` 目录
- ✅ 所有 API 调用通过 `@hiwhale/shared/api`，禁止组件内直接 fetch
- ✅ 每个组件文件顶部加简短注释说明用途

#### 绝对禁止

- ❌ 紫色、靛蓝、青色作为主色（主色只能是深蓝 `#0A2540` + 品牌蓝 `#1A56DB`）
- ❌ 全篇渐变底色（渐变只能用于按钮或极小装饰）
- ❌ emoji 作为图标或装饰
- ❌ 霓虹发光、3D blob、高饱和撞色
- ❌ `console.log` 留在生产代码中（调试完删掉）
- ❌ 未使用的 import 和变量
- ❌ 写死的 px 宽高（如 `width: 300px`）
- ❌ 硬编码的 API 地址（用环境变量）

### 1.5 K3 常见问题与应对

| K3 可能犯的错                | 你的应对                                                |
| ---------------------------- | ------------------------------------------------------- |
| 忘记用 next-intl，直接写英文 | 检查代码，发现硬编码文案就让它改成 `t('key')`           |
| 用了 emoji                   | 直接说"把所有 emoji 替换成 Lucide 图标"                 |
| 写死 px 宽高                 | 说"用 flex/grid/rem 替代固定 px"                        |
| 颜色用了紫色/渐变            | 说"严格按设计规范的色值，用 #0A2540 和 #1A56DB"         |
| 组件太大（>300行）           | 说"把这个组件拆成 X 和 Y 两个子组件"                    |
| 一次改太多文件导致出错       | 拆成更小的任务，一次只做一个模块                        |
| 忘记类型定义                 | 说"给所有 props 和函数参数加上 TypeScript 类型"         |
| 动效卡顿                     | 说"动画只用 transform 和 opacity，加 will-change"       |
| 3D 模型报错                  | 先用 Three.js 内置 BoxGeometry 占位，确保功能跑通       |
| 双语排版错位                 | 说"检查中文状态下的字号和行高，用 [lang=zh] 选择器调整" |

### 1.6 项目结构（最终目标，供 K3 参考）

```
hiwhale-platform/
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
├── docker-compose.yml
├── .env.example
├── deploy.sh
├── docker/
│   ├── portal.Dockerfile
│   ├── admin.Dockerfile
│   ├── api.Dockerfile
│   ├── nginx.Dockerfile
│   └── nginx.conf
├── apps/
│   ├── portal/                    # 海外独立站（端口3000）
│   │   ├── app/[locale]/
│   │   │   ├── page.tsx           # 首页
│   │   │   ├── products/
│   │   │   ├── solutions/
│   │   │   ├── cases/
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   └── dashboard/
│   │   ├── app/auth/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   ├── home/
│   │   │   ├── products/
│   │   │   ├── solutions/
│   │   │   ├── cases/
│   │   │   ├── ai-chat/
│   │   │   └── auth/
│   │   ├── messages/en.json
│   │   ├── messages/zh.json
│   │   └── public/
│   └── admin/                     # 管理后台（端口3001）
│       ├── app/
│       │   ├── login/
│       │   ├── dashboard/
│       │   ├── products/
│       │   ├── inquiries/
│       │   ├── users/
│       │   ├── chat-logs/
│       │   ├── knowledge-base/
│       │   ├── ai-settings/
│       │   ├── content/
│       │   ├── staff/
│       │   └── settings/
│       └── components/
├── packages/
│   └── shared/                    # 共享包 @hiwhale/shared
│       └── src/
│           ├── types/
│           ├── api/
│           ├── constants/
│           └── utils/
└── api/                           # 后端服务（端口4000）
    ├── src/
    └── prisma/
```

---

## 第二部分：设计规范（每次新对话贴给 K3）

### 2.1 色彩

| 角色     | 色值      | 用途                   |
| -------- | --------- | ---------------------- |
| 品牌深蓝 | `#0A2540` | 标题、深色区块、导航栏 |
| 品牌蓝   | `#1A56DB` | 主按钮、链接、强调     |
| 品牌浅蓝 | `#E8F0FE` | 标签背景、hover        |
| 纯白     | `#FFFFFF` | 主背景                 |
| 近白灰   | `#F8FAFC` | 交替区块背景           |
| 深灰文字 | `#1E293B` | 正文标题               |
| 中灰文字 | `#475569` | 正文                   |
| 浅灰文字 | `#94A3B8` | 辅助说明               |
| 边框灰   | `#E2E8F0` | 卡片边框               |

**规则**：白色为主背景，蓝色为强调；深色区块不超过页面30%；禁止渐变底色、禁止紫色/靛蓝、禁止高饱和撞色。

### 2.2 字体

- 英文标题：Space Grotesk；英文正文：Inter
- 中文：Noto Sans SC
- 使用 `next/font` 加载

### 2.3 布局

- 根字号 16px，全部用 rem/%/flex/grid
- 容器 `max-w-7xl`（80rem），居中，`px-4 md:px-8 lg:px-12`
- 区块间距 `py-16 md:py-24`
- 卡片圆角 `rounded-xl`，按钮 `rounded-lg`
- 禁止写死固定 px 宽高

### 2.4 组件风格

- 按钮：主按钮蓝底白字 `rounded-lg`，次按钮白底蓝边蓝字
- 卡片：白底 + `border border-slate-200` + `rounded-xl`，hover 时 `border-blue-300 shadow-lg -translate-y-1`
- 标签：`bg-blue-50 text-blue-700 rounded-md px-2 py-1 text-xs`
- 图标：Lucide React 线性图标，`w-5 h-5`

### 2.5 双语排版

- next-intl，默认 en，URL 前缀 `/en/`、`/zh/`
- 中文标题字号比英文小一号（英文 `text-5xl` → 中文 `text-4xl`）
- 中文行高略大（`leading-relaxed`）
- 用 `[lang="zh"]` CSS 选择器覆盖
- 卡片不固定高度，用 `flex flex-col h-full` 等高

---

## 第三部分：功能需求总表

### 3.1 海外独立站（apps/portal）

| 页面     | 路由                | 核心功能                                                     |
| -------- | ------------------- | ------------------------------------------------------------ |
| 首页     | `/`                 | 滚轮叙事动效（产品家族→场景上浮→数据→幕布Logo）+ 8个常规模块 |
| 产品列表 | `/products`         | 6大品类筛选 + 产品卡片网格                                   |
| 产品详情 | `/products/[slug]`  | 产品图、360°3D模型、参数表、Ask AI按钮（需登录）、相关推荐   |
| 方案列表 | `/solutions`        | 6个行业方案卡片                                              |
| 方案详情 | `/solutions/[slug]` | 痛点、方案、流程、成果数据、相关产品                         |
| 案例列表 | `/cases`            | 行业筛选 + 案例卡片                                          |
| 案例详情 | `/cases/[slug]`     | 客户背景、挑战、方案、成果、评价                             |
| 关于我们 | `/about`            | 公司介绍、定位、历程、全球布局、认证                         |
| 联系我们 | `/contact`          | 联系信息 + 询盘表单（含Turnstile人机验证）                   |
| 登录     | `/auth/login`       | 邮箱密码登录                                                 |
| 注册     | `/auth/register`    | 姓名、公司、邮箱、密码                                       |
| 用户中心 | `/dashboard`        | 咨询记录、AI对话历史、收藏、个人信息                         |

**全局组件**：

- Navbar（滚动变白+模糊）
- Footer（深蓝背景）
- AI客服（仅登录后显示右下角按钮，聊天窗口，API预留）
- Cookie横幅（GDPR合规）
- Placeholder占位组件（统一素材占位）

**首页动效分镜**（400vh ScrollTrigger pin）：

- 0-15%：全品类产品家族（AGV/AMR/叉车/机械臂/龙门吊/软件）从底部上浮
- 15-45%：6个行业场景卡片逐个上浮（电商/汽车/3PL/冷链/医药/港口）
- 45-75%：方案集成理念文字 + 4个数据指标CountUp
- 75-100%：深蓝幕布上升 + 镂空Hiwhale Robotics™ Logo收尾

**3D模型查看器**：R3F + OrbitControls，可拖拽旋转/滚轮缩放/自动旋转/型号切换，无模型时用BoxGeometry占位。

### 3.2 管理后台（apps/admin）

| 页面       | 核心功能                                        |
| ---------- | ----------------------------------------------- |
| 登录       | 账号密码 + 双因素（可选）                       |
| Dashboard  | 数据卡片 + 趋势图 + 最近询盘                    |
| 产品管理   | CRUD + 图片/规格书/3D模型上传 + 分类 + 上下架   |
| 方案管理   | 解决方案 CRUD                                   |
| 案例管理   | 客户案例 CRUD                                   |
| 询盘管理   | 列表 + 详情 + 状态流转 + 导出Excel + 分配负责人 |
| 用户管理   | 前台用户列表 + AI使用量 + 禁用                  |
| AI对话记录 | 全部对话日志 + 搜索 + 标注 + 导出               |
| AI知识库   | 文档上传 + 向量化 + FAQ管理 + 测试问答          |
| AI设置     | 模型选择 + API Key + Prompt + 限频 + 月度预算   |
| 内容管理   | Banner + 多语言文案 + 隐私政策编辑              |
| 员工管理   | 账号CRUD + 角色分配 + 权限矩阵                  |
| 系统设置   | SMTP + 通知 + 操作日志 + 备份                   |

**后台布局**：固定左侧边栏（240px）+ 顶栏 + 内容区，UI用 shadcn/ui。
**权限角色**：超级管理员、销售、产品/技术、运营。

### 3.3 后端 API（api/）

| 模块     | 核心接口                                   |
| -------- | ------------------------------------------ |
| 认证     | 注册、登录、JWT、密码加密                  |
| 产品     | CRUD、分类、搜索、分页                     |
| 方案     | CRUD                                       |
| 案例     | CRUD                                       |
| 询盘     | 创建、列表、详情、状态更新、导出           |
| 用户     | 列表、详情、AI使用量、禁用                 |
| AI客服   | 发送消息（RAG检索+大模型）、历史记录、限频 |
| 知识库   | 文档上传、向量化、FAQ CRUD                 |
| 文件上传 | 图片/PDF/3D模型上传到MinIO                 |
| 管理后台 | 员工CRUD、角色权限、操作日志、数据统计     |

**技术**：NestJS + Prisma + PostgreSQL + Redis + pgvector + MinIO + BullMQ。

### 3.4 Docker 部署

- 6个容器：nginx、portal、admin、api、postgres、redis（+minio可选）
- `docker compose up -d` 一键启动
- 多阶段构建，非root用户运行
- Nginx 三域名反向代理 + SSL + Gzip
- `deploy.sh` 一键部署脚本

---

## 第四部分：分阶段执行计划（含 Prompt 模板）

> 每个阶段开一个新对话，把【通用前缀】+【阶段Prompt】一起发给 K3。
> 每阶段完成后，在浏览器验证通过再进入下一阶段。

### 通用前缀（每个新对话都要贴）

```
你是一个资深全栈工程师，正在开发 Hiwhale Robotics（浩鲸机器人）的海外独立站项目。

【项目定位】我们是智能仓储与货物转运的方案集成商，不是单一设备制造商。产品线包括：无人叉车AGV、AMR、有人叉车、机械臂、龙门吊、调度系统软件。

【技术栈】
- Monorepo: pnpm workspace + Turborepo
- 前端: Next.js 14 App Router + TypeScript + Tailwind CSS v3
- 动效: GSAP + ScrollTrigger + Framer Motion + Lenis（仅portal）
- 3D: Three.js + React Three Fiber + Drei（仅portal）
- 国际化: next-intl（中英双语）
- 图标: Lucide React（禁止emoji）
- 状态: Zustand
- 表单: React Hook Form + Zod
- 认证: NextAuth.js
- 后台UI: shadcn/ui
- 后端: NestJS + Prisma + PostgreSQL + Redis
- 部署: Docker + docker-compose + Nginx

【设计规范】
- 主色: 深蓝 #0A2540 + 品牌蓝 #1A56DB + 白色
- 浅色背景: #FFFFFF / #F8FAFC；文字: #1E293B / #475569 / #94A3B8
- 边框: #E2E8F0；浅蓝标签底: #E8F0FE
- 禁止: emoji、全篇渐变、紫色/靛蓝主色、霓虹发光、写死px宽高
- 布局: rem/%/flex/grid，容器 max-w-7xl，区块 py-16 md:py-24
- 字体: 英文 Space Grotesk(标题)+Inter(正文)，中文 Noto Sans SC
- 双语: next-intl，所有文案 t('key')，中文标题比英文小一号

【代码规范】
- TypeScript 严格模式，禁止 any
- 函数式组件，组件<300行，公共逻辑抽hook
- API调用走 @hiwhale/shared/api
- 禁止硬编码文案、禁止console.log残留

请严格按以上规范执行。
```

---

### 阶段 0：Monorepo 初始化

**目标**：搭建 pnpm workspace + Turborepo + 两个 app 脚手架 + shared 包骨架，能同时启动。

**Prompt**：

```
【任务】初始化 Monorepo 项目结构。

请创建以下结构：
1. 根目录 package.json，配置 pnpm workspace 和 Turborepo
2. pnpm-workspace.yaml，包含 apps/* 和 packages/*
3. turbo.json 配置
4. tsconfig.base.json 共享TS配置
5. apps/portal：用 create-next-app 初始化（TypeScript + Tailwind + App Router），端口3000
6. apps/admin：用 create-next-app 初始化，端口3001
7. packages/shared：创建 @hiwhale/shared 包，包含 src/types、src/api、src/constants、src/utils 的 index.ts 骨架
8. 根 package.json scripts 配置：
   - dev:portal / dev:admin / dev:all
   - build:portal / build:admin / build
   - lint / type-check

要求：
- portal 和 admin 都能独立 pnpm dev 启动
- shared 包能被两个 app 通过 @hiwhale/shared 引用
- 配置 ESLint + Prettier
- 创建 .env.example 模板
- 创建 .gitignore

完成后告诉我如何验证（启动命令和预期效果）。
```

**验收**：`pnpm dev:portal` 访问 localhost:3000 看到 Next.js 默认页；`pnpm dev:admin` 访问 localhost:3001 看到默认页。

---

### 阶段 1：Shared 包 + 设计系统 + 全局布局

**目标**：完成共享类型/常量/API Client，portal 的设计 Token、Navbar、Footer、Placeholder 组件、双语架构。

**Prompt**：

```
【任务】完成基础设施：shared包 + portal全局布局 + 双语架构。

1. packages/shared/src/constants/ 定义：
   - 产品品类枚举：AGV_FORKLIFT, AMR, MANNED_FORKLIFT, ROBOTIC_ARM, GANTRY_CRANE, SYSTEM_SOFTWARE（含中英文名称）
   - 行业枚举：E_COMMERCE, AUTOMOTIVE, THIRD_PARTY_LOGISTICS, FOOD_COLD_CHAIN, PHARMACEUTICAL, PORT
   - 用户角色枚举
   - 询盘状态枚举

2. packages/shared/src/types/ 定义核心类型：
   - Product（id, slug, name, category, model, specs, images, description, features）
   - Solution, CaseStudy, Inquiry, User, ChatMessage

3. packages/shared/src/api/ 创建 axios 实例 client.ts（baseURL 从环境变量读取，请求拦截加 token）

4. apps/portal 配置 next-intl：
   - 默认语言 en，支持 zh
   - URL 前缀 /en/ /zh/
   - 创建 messages/en.json 和 messages/zh.json，先放导航和通用文案
   - 配置 next/font（Space Grotesk + Inter + Noto Sans SC）

5. apps/portal 全局样式 globals.css：
   - CSS 变量定义所有色值
   - [lang="zh"] 选择器调整中文标题字号
   - Tailwind 配置中扩展品牌色

6. 创建组件：
   - components/layout/Navbar.tsx：logo + 导航链接 + 语言切换 + 登录按钮，滚动时背景变白+backdrop-blur+高度收缩
   - components/layout/Footer.tsx：深蓝背景，公司信息、产品分类、方案、联系方式、隐私政策链接
   - components/ui/Placeholder.tsx：通用素材占位组件，props: label, format, size, description，浅灰虚线边框+居中文字

7. app/[locale]/layout.tsx 整合 Navbar + Footer + 语言切换

注意：所有文案用 t('key')，导航链接包括 Home/Products/Solutions/Cases/About/Contact。
```

**验收**：切换中英文导航正常，滚动 Navbar 变白，Footer 深蓝，Placeholder 组件显示占位信息。

---

### 阶段 2：首页沉浸式滚轮动效（核心）

**目标**：完成首页阶段A的 400vh 滚轮叙事动效。

**Prompt**：

```
【任务】完成首页沉浸式滚轮叙事动效（这是项目最核心的部分）。

技术：Lenis 平滑滚动 + GSAP ScrollTrigger pin + perspective 景深分层。

创建 components/home/HeroNarrative.tsx，实现以下分镜：

容器：固定高度 400vh，内部 pin 一个 100vh 的舞台，perspective: 1200px。

进度 0-15%（首屏）：
- 背景：深蓝 #0A2540，底部极微妙蓝色渐变（透明度<10%）+ 细网格装饰线
- 中央展示5-6款产品占位图（用Placeholder组件，分别标注AGV Forklift/AMR/Manned Forklift/Robotic Arm/Gantry Crane/Software）
- 产品图从底部上浮 opacity 0→1，各产品 translateZ 不同（0px到80px）形成前后层次
- 主标题 t('home.hero.title') 从下方30px上浮
- 副标题淡入
- 底部 "Scroll to explore" 呼吸动画

进度 15-45%（场景上浮）：
- 6个行业场景卡片从下方依次上浮（每个间隔5%进度），3×2网格
- 卡片 scale 0.9→1 + opacity 0→1
- 场景：E-commerce, Automotive, 3PL, Food Cold Chain, Pharmaceutical, Port
- 产品家族图缩小上移，透明度降至0.25退居背景

进度 45-75%（数据指标）：
- 场景卡片向两侧散开
- 左侧："From Equipment to System" 方案集成理念文字
- 右侧：4个数据指标 CountUp 动画：500+ Projects, 30+ Countries, 99.9% Uptime, 24/7 Support

进度 75-100%（幕布收尾）：
- 深蓝幕布 #061529 从底部向上滑动覆盖视口
- 幕布中央镂空 "Hiwhale Robotics ™" Logo（用文字+SVG实现镂空效果，或Placeholder标注）
- Logo scale 1.2→1 收缩居中
- 底部 "Discover Our Solutions" 引导文字

景深分层：背景层 translateZ(-200px)，产品层 0px，场景层 100px，数据层 150px，幕布层 200px。
鼠标移动时各层 ±10px 视差跟随。
移动端（<768px）简化：单列布局，景深改为基础淡入。

所有文案放 messages/en.json 和 zh.json。
```

**验收**：滚动页面时四个阶段丝滑过渡，产品有前后层次，场景逐个上浮，幕布Logo收尾，中英文切换正常。

---

### 阶段 3：首页常规模块

**目标**：完成首页阶段B的8个模块。

**Prompt**：

```
【任务】完成首页幕布之后的8个常规模块，每个模块创建独立组件，在 app/[locale]/page.tsx 中按顺序引入。

模块1 ProductEcosystem（近白灰背景）：
- 标题 "Our Product Ecosystem"
- 6张品类卡片（3列网格，移动端1列）：AGV Forklift, AMR, Manned Forklift, Robotic Arm, Gantry Crane, System Software
- 每张卡片：Placeholder图 + Lucide图标 + 品类名 + 描述 + Explore链接
- hover: -translate-y-1 + border-blue-300 + shadow-lg

模块2 SolutionIntegration（纯白背景）：
- 展示三层能力：Equipment Layer → System Layer → Solution Layer
- 每层：图标+标题+描述+能力列表
- 左右交替布局

模块3 IndustrySolutions（近白灰背景）：
- 6个行业方案卡片（2列大图卡片）
- 每张：Placeholder大图（带蓝色20%透明蒙层）+ 行业名 + 描述 + 痛点标签 + View Solution链接

模块4 Product3DViewer（纯白背景）⭐：
- 左右分栏：左侧3D查看器，右侧产品信息+型号切换Tab
- 用 @react-three/fiber + @react-three/drei
- OrbitControls 拖拽旋转、滚轮缩放、自动旋转（交互后暂停）
- 无模型时用不同颜色的 BoxGeometry 代表不同产品
- 右下角重置视角按钮
- 右侧：产品名+型号+参数列表+View Full Specs链接+Request Consultation按钮

模块5 VideoShowcase（深蓝背景）：
- 标题（白字）+ 16:9视频播放器
- 用Placeholder标注视频格式MP4+WebM 1920x1080
- 中央播放按钮图标

模块6 CaseStudies（近白灰背景）：
- 4个大数字 CountUp：500+ Projects, 30+ Countries, 99.9% Uptime, 50M+ Pallets
- 下方8个客户Logo占位（grayscale hover:grayscale-0）

模块7 Certifications（纯白背景）：
- 标题 "Globally Certified, Trusted Worldwide"
- 5个认证标志占位：CE, ISO 9001, ISO 3691-4, ISO 13849, UL

模块8 CTASection（深蓝背景）：
- 大标题 "Ready to Transform Your Warehouse?"
- 副标题 + 两个按钮：Request a Consultation（主按钮→/contact）、Explore Products（白底蓝字→/products）

所有文案双语，所有图片用Placeholder组件，区块间距 py-16 md:py-24，交替白/灰背景。
```

**验收**：首页完整可滚动，8个模块布局正确，3D查看器可旋转缩放，hover动效正常，中英文正常。

---

### 阶段 4：产品列表 + 产品详情

**目标**：完成产品中心两个页面。

**Prompt**：

```
【任务】完成产品列表页和产品详情页。

1. app/[locale]/products/page.tsx：
- 顶部Banner：标题 "Product Center" + 描述
- 品类筛选Tab：All + 6大品类，横向可滚动
- 产品卡片网格（3列→移动端1列），用mock数据（在shared/constants里定义6-8个示例产品）
- 每张卡片：Placeholder图 + 品类标签 + 产品名 + 型号 + 2-3个核心参数 + View Details链接
- 点击筛选Tab切换品类

2. app/[locale]/products/[slug]/page.tsx：
- 面包屑导航
- 产品头部：左侧大图（Placeholder）+ 缩略图切换；右侧：品类标签、产品名、型号、描述、参数速览、按钮组
  - Request Consultation → /contact
  - Download Spec Sheet（占位）
  - "Ask AI about this product" 按钮 → 点击检查登录状态，未登录弹出AuthModal
- 360° 3D模型查看器（复用首页Product3DViewer组件）
- 详细参数表（分类：General/Performance/Battery/Safety/Communication）
- 核心卖点（图标+文字，3-4个）
- 适用场景标签
- 相关产品推荐（同品类横向滑动3个）
- 底部CTA

3. 创建 components/auth/AuthModal.tsx：
- 模态框，包含登录/注册两个Tab切换
- 登录：邮箱+密码
- 注册：姓名+公司+邮箱+密码+确认密码+同意条款checkbox
- 用React Hook Form + Zod校验
- 提交先console.log（后端未就绪），成功后关闭模态框
- 用Zustand管理登录状态（简单mock：登录后存localStorage）

所有文案双语，参数表用表格组件，响应式适配。
```

**验收**：产品列表可筛选，产品详情信息完整，3D查看器正常，Ask AI点击弹出登录框，登录后按钮状态变化。

---

### 阶段 5：其他页面（方案/案例/关于/联系）

**目标**：完成剩余4个前台页面。

**Prompt**：

```
【任务】完成以下4个页面，每个页面独立组件，mock数据放shared/constants。

1. /solutions 方案列表：
- Banner + 6个行业方案卡片（2列大图），每张：Placeholder图+行业名+描述+关键指标+View Solution
- /solutions/[slug] 详情：Banner图+痛点（3-4个图标+文字）+方案描述+设备组合+部署流程时间线（5步）+成果数据+相关产品+CTA

2. /cases 案例列表：
- Banner + 行业筛选 + 案例卡片网格（2列）：客户Logo占位+行业+项目名+描述+成果数字+Read Case
- /cases/[slug] 详情：客户背景+挑战+解决方案（设备清单+实施周期）+成果数据（前后对比）+客户评价引用+相关产品+CTA

3. /about 关于我们：
- 公司简介Banner（使命陈述）
- 定位说明（方案集成商，强调定制化）
- 发展历程时间线（5-6个里程碑）
- 全球布局（Placeholder世界地图+标注）
- 研发实力（Placeholder工厂图+数据）
- 合作伙伴Logo墙+认证

4. /contact 联系我们：
- 左右分栏：左侧联系信息（邮箱/电话/地址/WhatsApp/LinkedIn）+Placeholder地图；右侧询盘表单
- 表单字段：Full Name, Company, Email, Phone, Country(select), Product Category(multi-select), Project Description(textarea, min 20 chars), Privacy Policy checkbox
- React Hook Form + Zod校验
- 提交按钮+成功提示
- Cloudflare Turnstile占位（div标注）

所有文案双语，响应式，mock数据真实合理（B2B工业风格）。
```

**验收**：4个页面布局完整，表单校验正常，中英文切换正常，响应式无错位。

---

### 阶段 6：AI 客服 + 用户中心

**目标**：完成AI客服组件和用户中心。

**Prompt**：

```
【任务】完成AI客服组件和用户中心页面。

1. AI客服（仅登录用户可见）：
- components/ai-chat/AIChatWidget.tsx：
  - 用Zustand读取登录状态，未登录返回null（不渲染任何东西）
  - 已登录：右下角悬浮按钮 w-12 h-12 品牌蓝圆形+Lucide机器人图标，bottom-6 right-6
  - 点击展开聊天窗口 w-96 h-[32rem] max-h-[80vh]，移动端全屏
  - 窗口头部：AI Assistant名称+在线状态+关闭按钮
  - 消息区：AI消息左侧浅蓝底bg-blue-50，用户消息右侧品牌蓝底白字
  - 输入区：文本框+发送按钮，回车发送
  - 首次打开显示3个快捷问题按钮
  - 发送消息调用 POST /api/chat（先mock：根据关键词返回预设回复，打字机效果）
  - 对话历史存localStorage

2. 用户中心 /dashboard：
- 需要登录才能访问（未登录跳转/auth/login）
- 左侧Tab导航：My Inquiries, AI Chat History, Saved Products, Profile
- My Inquiries：咨询记录列表（mock数据）
- AI Chat History：对话历史列表，点击可查看
- Saved Products：收藏的产品（mock）
- Profile：个人信息编辑表单（姓名/公司/邮箱/电话/国家）

3. 在产品详情页的"Ask AI"按钮逻辑：
- 未登录：打开AuthModal
- 已登录：打开AI客服窗口，并传入当前产品上下文（产品名作为初始问题）

4. Navbar右侧：未登录显示Login/Sign Up按钮；已登录显示用户头像下拉菜单（Dashboard/Logout）

所有文案双语，AI客服窗口设计简洁不突兀。
```

**验收**：未登录看不到AI客服按钮，登录后出现，聊天可发送并收到mock回复，用户中心各Tab正常，退出登录后AI客服消失。

---

### 阶段 7：管理后台布局 + 登录 + Dashboard

**目标**：搭建admin后台框架。

**Prompt**：

```
【任务】完成管理后台基础框架。

1. 安装 shadcn/ui 到 apps/admin（npx shadcn@latest init），添加常用组件：button, input, card, table, dialog, select, badge, avatar, dropdown-menu, tabs, form, toast

2. admin 全局布局 app/layout.tsx：
- 固定左侧边栏 w-60：Logo + 导航菜单（Dashboard/Products/Solutions/Cases/Inquiries/Users/AI Chat Logs/Knowledge Base/AI Settings/Content/Staff/Settings）
- 顶栏：搜索框+通知铃铛+管理员头像下拉
- 内容区：浅灰背景 bg-slate-50，p-6
- 配色：侧边栏白底+右边框，选中项浅蓝底蓝字，顶栏白底+下边框
- 最小宽度1024px

3. /login 登录页：
- 居中卡片：邮箱+密码+登录按钮
- 简单mock登录（admin@hiwhale.com / admin123），登录后存localStorage，跳转/dashboard
- 未登录访问任何后台页面跳转/login

4. /dashboard 仪表盘：
- 4个数据卡片：今日询盘、本月用户、AI对话量、产品浏览量（mock数字）
- 一个趋势图（用Recharts，mock近30天数据）
- 最近询盘列表（5条mock）
- 待办提醒

5. 侧边栏导航根据角色显示（先mock超级管理员，显示全部）

admin 只需要中文界面（不需要双语）。
```

**验收**：登录页可登录，后台布局完整，侧边栏导航可跳转，Dashboard显示数据和图表。

---

### 阶段 8：管理后台核心页面（产品 + 询盘）

**目标**：完成产品管理和询盘管理（最核心的两个业务模块）。

**Prompt**：

```
【任务】完成管理后台的产品管理和询盘管理。

1. /products 产品管理：
- 顶部：搜索框+品类筛选+新增产品按钮
- 数据表格（shadcn Table）：图片缩略图、产品名、型号、品类、状态（上架/下架Badge）、创建时间、操作列（编辑/删除）
- 分页
- 新增/编辑用Dialog或独立页面 /products/new 和 /products/[id]/edit：
  - 表单：产品名、型号、品类(select)、描述(textarea)、核心参数（动态键值对列表）、卖点（动态列表）、图片上传（Placeholder标注）、规格书PDF上传（Placeholder）、3D模型上传（Placeholder）、上下架开关
  - React Hook Form + Zod
  - 提交mock（console.log）

2. /inquiries 询盘管理：
- 顶部：状态筛选Tab（All/New/Following/Won/Closed）+搜索+导出按钮
- 表格：客户名、公司、国家、感兴趣品类、状态(Badge不同颜色)、提交时间、负责人、操作（查看）
- 分页
- /inquiries/[id] 详情页：
  - 客户信息卡片
  - 需求描述
  - 关联产品
  - 跟进记录时间线（可添加新跟进记录）
  - 状态变更下拉
  - 分配负责人下拉
  - 操作按钮：导出、返回列表

所有数据用mock（在admin/components下定义mock数据文件），表格支持排序，删除有确认Dialog。
```

**验收**：产品CRUD流程完整（表单可填可提交），询盘列表可筛选，详情页可改状态加跟进记录。

---

### 阶段 9：管理后台其余页面

**目标**：完成剩余后台页面。

**Prompt**：

```
【任务】完成管理后台剩余页面，每个页面功能完整但数据mock。

1. /solutions 方案管理：列表+新增/编辑表单（标题、行业、描述、痛点、关联产品多选、图片）
2. /cases 案例管理：列表+新增/编辑表单（客户名、行业、背景、挑战、方案、成果数据、评价、Logo上传）
3. /users 用户管理：表格（姓名、公司、邮箱、国家、注册时间、AI对话数、状态）+查看详情抽屉+禁用/启用
4. /chat-logs AI对话记录：表格（用户、消息数、最后消息时间、状态Badge）+查看完整对话弹窗+搜索+标注按钮
5. /knowledge-base 知识库：文档列表（上传按钮+文件名+类型+上传时间+状态）+FAQ管理（可增删问答对）+测试问答输入框
6. /ai-settings AI设置：表单（模型选择select、API Key输入、System Prompt textarea、每分钟限频、每日上限、月度预算数字输入、降级策略）
7. /content 内容管理：Tab切换（首页Banner管理、多语言文案编辑、Footer链接、隐私政策富文本占位）
8. /staff 员工管理：表格+新增员工表单（姓名、邮箱、角色select、状态）+权限矩阵展示
9. /settings 系统设置：Tab（基本信息、SMTP配置、通知设置、操作日志列表）

统一风格：shadcn组件，卡片+表格+表单，页面标题+描述+操作区布局。
```

**验收**：所有页面可访问，表单可填写提交（mock），导航无死链。

---

### 阶段 10：Docker 容器化 + 部署

**目标**：完成 Docker 配置和一键部署。

**Prompt**：

```
【任务】完成 Docker 容器化配置。

1. 创建 docker/portal.Dockerfile：
- 多阶段构建：node:20-alpine builder 安装依赖+构建，runner 复制 standalone 产物
- 非root用户运行，EXPOSE 3000
- Next.js output: 'standalone'

2. 创建 docker/admin.Dockerfile：同上，端口3001

3. 创建 docker/api.Dockerfile：后端构建（如果后端还没写，先创建占位Dockerfile）

4. 创建 docker/nginx.conf：
- 三个server块：hiwhale.com→portal:3000, admin.hiwhale.com→admin:3001, api.hiwhale.com→api:4000
- HTTP 80重定向HTTPS 443
- SSL证书路径 /etc/nginx/ssl/
- Gzip压缩
- 静态资源缓存
- API的CORS头
- client_max_body_size 50M

5. 创建 docker-compose.yml：
- 服务：nginx, portal, admin, api, postgres, redis, minio
- portal/admin 只expose不ports（通过nginx访问）
- postgres/redis 用volume持久化
- 环境变量从 .env.production 读取
- restart: unless-stopped
- healthcheck for postgres
- 自定义bridge网络

6. 创建 .env.example（所有环境变量模板）

7. 创建 deploy.sh：
- git pull → docker compose build → 数据库备份 → docker compose up -d → prisma migrate
- 输出服务状态和访问地址

8. 创建 .dockerignore

注意：后端API如果还没开发，api服务先创建一个简单的健康检查占位（NestJS hello world），确保docker compose能全部启动。
```

**验收**：`docker compose up -d` 启动全部容器，访问 localhost 能看到 portal，配置hosts后能访问admin，api/health返回ok。

---

## 第五部分：后端开发（可选，前端完成后再做）

> 后端可以在前端全部完成、mock 数据验证通过后再开发。如果 K3 上下文允许，按以下模块逐个实现。

### 后端开发顺序

| 顺序 | 模块                            | 说明                                  |
| ---- | ------------------------------- | ------------------------------------- |
| 1    | NestJS 初始化 + Prisma + Docker | 项目骨架、数据库连接、健康检查        |
| 2    | 认证模块                        | 注册/登录/JWT/bcrypt                  |
| 3    | 产品模块                        | CRUD + 分类 + 分页 + 搜索             |
| 4    | 方案/案例模块                   | CRUD                                  |
| 5    | 询盘模块                        | 创建 + 列表 + 状态 + 导出             |
| 6    | 用户模块                        | 列表 + AI使用量 + 禁用                |
| 7    | 文件上传                        | Multer + MinIO                        |
| 8    | AI客服 + RAG                    | pgvector向量检索 + 大模型API + 限频   |
| 9    | 知识库                          | 文档上传 + 分块向量化 + FAQ           |
| 10   | 后台管理                        | 员工CRUD + 角色权限 + 操作日志 + 统计 |

### 后端 Prompt 要点

- 每个模块开新对话
- 先定义 Prisma schema，再生成 CRUD
- AI客服RAG部分单独一个对话，重点实现：文档分块→embedding→pgvector存储→检索→拼接prompt→调用大模型
- 大模型API用DeepSeek国际端点（兼容OpenAI SDK格式）

---

## 第六部分：AI 客服 RAG 系统详细设计

> 本章节是后端 AI 客服模块的完整实现规范，必须严格按照此链路实现，禁止简单的"用户提问→向量检索→丢给LLM"三步式 RAG。

### 6.1 RAG 完整链路（必须实现）

```
用户提问
  ↓
① 加载对话历史（Redis，最近10轮）
  ↓
② 查询改写（LLM）
   - 结合对话历史，把追问/省略句改写成完整独立问题
   - 提取实体：产品型号、参数类型、行业、认证类型
   - 判断问题类型：product_spec / certification / solution / pricing / general
  ↓
③ 查询路由
   - product_spec → 规格书向量库 + 产品数据库结构化查询
   - certification → 认证文档库
   - solution → 案例库 + 方案文档
   - pricing/delivery/contract → 不查文档，直接转人工
   - general → FAQ库 + 全部文档
  ↓
④ 混合检索（三路召回，RRF融合）
   ├─ 向量检索（pgvector，语义相似）Top 20
   ├─ 关键词检索（PostgreSQL tsvector，精确匹配型号/数字/标准号）Top 20
   └─ 元数据预过滤（product_model / category / doc_type 先缩小范围）
   → RRF 融合排序，取 Top 20
  ↓
⑤ Rerank 精排（bge-reranker-v2-m3）
   → 对 Top 20 逐条交叉编码，精排出 Top 5
  ↓
⑥ 上下文组装
   - System Prompt（角色规则 + 回答边界）
   - Top 5 文档片段（带来源标注：文档名+章节）
   - 对话历史摘要（最近3轮原文 + 更早的LLM摘要）
   - 改写后的用户问题
  ↓
⑦ LLM 生成回答（DeepSeek 国际版，流式输出）
   - 要求引用来源
   - 要求基于资料回答，资料不足时明确说明
  ↓
⑧ 后处理与兜底
   - 检索最高相似度 < 0.7 → 转人工
   - LLM 判断资料不足 → 转人工
   - 涉及报价/交期/合同 → 转人工
   - 保存对话记录到 PostgreSQL
   - 更新用户需求状态（Redis）
```

### 6.2 数据库设计（Prisma Schema）

```prisma
// 文档表（上传的原始文件）
model KnowledgeDocument {
  id          String   @id @default(uuid())
  title       String
  fileName    String
  fileType    String   // pdf / docx / md / faq
  docType     String   // spec_sheet / certification / case_study / solution / faq
  productModel String? // 关联产品型号（可空，表示通用文档）
  category    String?  // 产品品类
  language    String   @default("en") // en / zh
  fileUrl     String   // MinIO/S3 文件路径
  status      String   @default("processing") // processing / ready / failed
  chunkCount  Int      @default(0)
  uploadedAt  DateTime @default(now())
  updatedAt   DateTime @updatedAt
  chunks      DocumentChunk[]
}

// 文档分块表（向量化的最小单元）
model DocumentChunk {
  id          String   @id @default(uuid())
  documentId  String
  document    KnowledgeDocument @relation(fields: [documentId], references: [id], onDelete: Cascade)
  content     String   // 分块文本内容（Markdown格式，保留表格结构）
  // 父文档ID：小chunk检索命中后，返回父大块的完整上下文
  parentChunkId String? // 指向同表的大chunk
  chunkIndex  Int      // 在文档中的顺序
  // 向量字段（pgvector，1024维，bge-m3 输出维度）
  embedding   Unsupported("vector(1024)")?
  // 全文检索字段（PostgreSQL tsvector）
  searchVector Unsupported("tsvector")?
  // 元数据（冗余存储，方便过滤，避免 JOIN）
  productModel String?
  category    String?
  docType     String
  section     String?  // 章节标题，如"性能参数"
  language    String
  createdAt   DateTime @default(now())

  @@index([documentId])
  @@index([productModel])
  @@index([docType])
}

// FAQ 表（结构化问答，直接匹配）
model Faq {
  id        String  @id @default(uuid())
  question  String
  answer    String
  category  String?
  language  String  @default("en")
  hits      Int     @default(0) // 被命中次数
  enabled   Boolean @default(true)
  createdAt DateTime @default(now())
}

// AI 对话表
model ChatConversation {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  productModel String? // 对话发起时所在的产品页
  messages  ChatMessage[]
  status    String   @default("active") // active / transferred_to_human / closed
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model ChatMessage {
  id             String   @id @default(uuid())
  conversationId String
  conversation   ChatConversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  role           String   // user / assistant / system
  content        String
  sources        Json?    // 引用来源 [{docTitle, section}]
  tokens         Int      @default(0)
  createdAt      DateTime @default(now())
}
```

**pgvector 扩展启用**：在 Prisma migration 中执行 `CREATE EXTENSION IF NOT EXISTS vector;` 和 `CREATE EXTENSION IF NOT EXISTS pg_trgm;`。

### 6.3 文档分块规范（决定检索质量的关键）

#### 分块策略

| 文档类型   | 分块方式                              | 小块大小    | 父块大小            |
| ---------- | ------------------------------------- | ----------- | ------------------- |
| 规格书 PDF | 按章节/参数表切分，每个参数表一个小块 | 200-400字   | 整个章节 800-1200字 |
| 认证文档   | 按条款切分                            | 300-500字   | 整个条款章节        |
| 案例研究   | 按"背景/挑战/方案/成果"分段           | 300-500字   | 整篇案例            |
| FAQ        | 一问一答一个块                        | 不超过300字 | 不需要父块          |
| 方案文档   | 按标题层级切分                        | 300-500字   | 整个章节            |

#### 分块规则

1. **按文档结构切分，不按固定字数切**：用 PDF 解析工具（PyMuPDF / Unstructured）识别标题、表格、段落，按语义边界切
2. **保留表格结构**：参数表转成 Markdown 表格格式，不要拍平成纯文本
3. **每个小块必须携带元数据**：product_model、category、doc_type、section、language
4. **父子文档机制**：小块用于检索（精准命中），命中后返回父大块内容给 LLM（上下文完整）
5. **重叠切分**：相邻小块之间保留 50-100 字重叠，避免关键信息被切断
6. **型号别名扩展**：分块入库时，把型号别名（如 "15R" → "MBV15R"）追加到块内容末尾，提升关键词召回

#### 文档解析流程

```
上传 PDF/Word
  ↓
PyMuPDF / Unstructured 解析
  - 提取文本、表格、标题层级
  - 表格转 Markdown
  ↓
按结构切分小块 + 父块
  ↓
元数据标注（产品型号、品类、文档类型、章节）
  ↓
bge-m3 生成 embedding（1024维）
  ↓
写入 DocumentChunk 表（embedding + searchVector + metadata）
  ↓
更新 KnowledgeDocument.status = "ready"
```

### 6.4 查询改写模块（检索前处理）

#### 改写 Prompt（这不是回答模板，是改写规则）

```typescript
const QUERY_REWRITE_PROMPT = `
你是一个查询改写助手。根据对话历史，把用户的最新问题改写成一个完整、独立、适合检索的问题。

要求：
1. 补全省略的主语和指代（"它""这个"→具体产品型号）
2. 提取关键实体：产品型号、参数类型、行业、认证类型
3. 判断问题类型
4. 如果用户问题已经完整独立，直接返回

对话历史：
{chat_history}

用户最新问题：{user_query}

输出 JSON（不要输出其他内容）：
{
  "rewritten_query": "改写后的完整问题",
  "entities": {
    "product_model": "产品型号或null",
    "category": "产品品类或null",
    "param_type": "参数类型或null",
    "industry": "行业或null",
    "certification": "认证类型或null"
  },
  "query_type": "product_spec | certification | solution | pricing | general",
  "sub_queries": ["子查询1", "子查询2", "子查询3"]
}
`;
```

#### 查询类型路由逻辑

```typescript
switch (queryType) {
  case "product_spec":
    // 先查产品数据库结构化字段（精确参数）
    // 再查规格书向量库（补充说明）
    break;
  case "certification":
    // 只查认证文档库（doc_type = 'certification'）
    break;
  case "solution":
    // 查案例库 + 方案文档
    break;
  case "pricing":
    // 不查文档，直接返回转人工话术
    return { transferToHuman: true, reason: "pricing" };
  case "general":
  // FAQ 优先，再查全部文档
}
```

### 6.5 混合检索实现（核心）

#### SQL 实现（PostgreSQL + pgvector）

```typescript
async function hybridSearch(params: {
  queryEmbedding: number[];
  queryText: string;
  filters: { productModel?: string; category?: string; docType?: string };
  topK: number;
}) {
  // ① 向量检索 Top 20
  const vectorResults = await prisma.$queryRaw`
    SELECT id, content, product_model, doc_type, section,
           1 - (embedding <=> ${params.queryEmbedding}::vector) AS similarity
    FROM document_chunks
    WHERE ${params.filters.productModel ? Prisma.sql`product_model = ${params.filters.productModel}` : Prisma.sql`1=1`}
      AND language = 'en'
    ORDER BY embedding <=> ${params.queryEmbedding}::vector
    LIMIT 20
  `;

  // ② 关键词检索 Top 20（全文检索 + 型号模糊匹配）
  const keywordResults = await prisma.$queryRaw`
    SELECT id, content, product_model, doc_type, section,
           ts_rank(search_vector, plainto_tsquery('english', ${params.queryText})) AS rank
    FROM document_chunks
    WHERE search_vector @@ plainto_tsquery('english', ${params.queryText})
      OR product_model ILIKE ${"%" + params.queryText + "%"}
      AND language = 'en'
    ORDER BY rank DESC
    LIMIT 20
  `;

  // ③ RRF 融合排序（Reciprocal Rank Fusion）
  const rrfK = 60; // RRF 常数
  const scores = new Map<string, { chunk: any; score: number }>();

  vectorResults.forEach((item, i) => {
    const s = 1 / (rrfK + i + 1);
    scores.set(item.id, { chunk: item, score: s });
  });
  keywordResults.forEach((item, i) => {
    const s = 1 / (rrfK + i + 1);
    if (scores.has(item.id)) {
      scores.get(item.id)!.score += s;
    } else {
      scores.set(item.id, { chunk: item, score: s });
    }
  });

  // 按融合分数排序，取 Top 20 给 Rerank
  return [...scores.values()].sort((a, b) => b.score - a.score).slice(0, 20);
}
```

#### 产品参数走结构化查询（Text-to-SQL，P1 阶段）

对于"载重两吨的平衡重AGV有哪些"这类问题，不要走向量检索，直接查产品表：

```typescript
// 当 query_type = 'product_spec' 且 entities 包含参数时
// 用 LLM 生成 Prisma 查询条件（白名单字段，防注入）
const allowedFields = ["loadCapacity", "liftHeight", "maxSpeed", "category", "batteryType"];
// LLM 输出：{ loadCapacity: { gte: 2000 }, category: 'AGV_FORKLIFT' }
const products = await prisma.product.findMany({ where: structuredFilter });
```

### 6.6 Rerank 精排

- 使用 **bge-reranker-v2-m3** 模型
- 部署方式：Docker 容器运行 `ghcr.io/huggingface/text-embeddings-inference`（TEI），加载 reranker 模型
- 对混合检索返回的 Top 20，逐条计算 (query, chunk) 相关性分数
- 取 Top 5 送入 LLM
- Rerank 服务地址通过环境变量配置 `RERANK_API_URL`

```typescript
async function rerank(query: string, chunks: any[], topN = 5) {
  const response = await fetch(`${process.env.RERANK_API_URL}/rerank`, {
    method: "POST",
    body: JSON.stringify({
      query,
      texts: chunks.map((c) => c.content),
      truncate: true,
    }),
  });
  const data = await response.json();
  // data: [{index: 0, score: 0.95}, ...]
  return data.slice(0, topN).map((r: any) => ({
    ...chunks[r.index],
    rerankScore: r.score,
  }));
}
```

### 6.7 对话上下文管理

#### 短期记忆（Redis）

```typescript
// Redis 存储最近 10 轮对话，TTL 24小时
// key: `chat:${conversationId}:history`
// value: JSON 数组，每条 {role, content, createdAt}
async function getChatHistory(conversationId: string) {
  const raw = await redis.lrange(`chat:${conversationId}:history`, 0, 19);
  return raw.map(JSON.parse); // 最近10轮（20条消息）
}
```

#### 长期记忆（对话摘要）

```typescript
// 当对话超过 10 轮时，把最早的 5 轮压缩成摘要
const SUMMARIZE_PROMPT = `
将以下对话历史压缩成一段简洁摘要，保留：
1. 用户的核心需求（品类、载重、行业、预算等）
2. 已推荐过的产品型号
3. 用户已确认的信息
4. 待解决的问题

对话历史：
{old_messages}

摘要：
`;
// 摘要存入 Redis key: `chat:${conversationId}:summary`
```

#### 用户需求状态（Redis Hash）

```typescript
// key: `chat:${conversationId}:state`
{
  intent: "product_selection",           // product_selection / tech_support / certification_inquiry
  interested_category: "AGV_FORKLIFT",
  requirements: {
    load_capacity: "2000kg",
    environment: "cold_storage",
    certification: "CE",
    country: "Germany"
  },
  recommended_products: ["MBV15R", "MFV20"],
  stage: "comparing_models"
}
```

每轮对话结束后用 LLM 更新此状态，检索时作为额外过滤条件。

### 6.8 System Prompt（回答规则，非回答模板）

```typescript
const SYSTEM_PROMPT = `
你是 Hiwhale Robotics 的 AI 产品助手，帮助海外客户了解我们的智能仓储产品和解决方案。

回答规则（必须严格遵守）：
1. 只基于下方提供的产品资料回答，不要编造任何参数、型号或认证信息
2. 如果资料中没有答案，明确告知"这个问题我需要让技术同事确认"，不要猜测
3. 回答时引用来源（文档名称和章节）
4. 绝不提供报价、交期、合同条款——这类问题统一回复"我会让销售同事与您联系"
5. 用专业、简洁的商务英语回答
6. 如果客户描述了需求，主动推荐合适的产品型号并说明理由
7. 参数数据必须精确，数字和单位必须与资料一致

以下是检索到的相关资料：

{context_documents}

对话历史摘要：
{chat_summary}

最近对话：
{recent_messages}
`;
```

### 6.9 兜底机制（三道防线）

| 防线       | 触发条件                                 | 处理                                                                   |
| ---------- | ---------------------------------------- | ---------------------------------------------------------------------- |
| 检索阈值   | Rerank 后 Top1 分数 < 0.6                | 不回答，回复"这个问题我需要让技术同事确认，已为您转接"，创建转人工记录 |
| LLM 自检   | LLM 输出中包含"资料不足""无法确认"等标记 | 同上，转人工                                                           |
| 业务硬规则 | 查询类型为 pricing/delivery/contract     | 直接转人工，不走检索                                                   |

转人工时：

1. 在 ChatConversation 表标记 status = 'transferred_to_human'
2. 通知销售（邮件/后台通知）
3. 前端显示"Our team will contact you within 24 hours" + 引导留资表单

### 6.10 技术选型

| 组件             | 选型                             | 部署方式                  |
| ---------------- | -------------------------------- | ------------------------- |
| Embedding 模型   | bge-m3（1024维，多语言）         | TEI Docker 容器，本地部署 |
| Rerank 模型      | bge-reranker-v2-m3               | TEI Docker 容器，本地部署 |
| 向量数据库       | pgvector（PostgreSQL 扩展）      | 随 PostgreSQL 容器        |
| 全文检索         | PostgreSQL tsvector              | 随 PostgreSQL 容器        |
| 对话缓存         | Redis                            | Docker 容器               |
| LLM              | DeepSeek 国际版（deepseek-chat） | API 调用，兼容 OpenAI SDK |
| 文档解析         | PyMuPDF + Unstructured           | API 服务容器（Python）    |
| 开发期 Embedding | Mac Studio 本地 Ollama 跑 bge-m3 | 本地开发                  |

**docker-compose.yml 需增加的服务**：

```yaml
# Embedding + Rerank 服务
tei:
  image: ghcr.io/huggingface/text-embeddings-inference:latest
  container_name: hiwhale-tei
  command: --model-id BAAI/bge-m3 --port 8080
  environment:
    - HUGGING_FACE_HUB_TOKEN=${HF_TOKEN}
  volumes:
    - tei_data:/data
  expose:
    - "8080"
  restart: unless-stopped
  networks:
    - hiwhale-network

# 文档解析服务（Python FastAPI）
doc-parser:
  build:
    context: ./api
    dockerfile: Dockerfile.parser
  container_name: hiwhale-doc-parser
  expose:
    - "8001"
  restart: unless-stopped
  networks:
    - hiwhale-network
```

### 6.11 实现优先级（分 4 个子阶段给 K3）

#### RAG 阶段 A：基础 RAG（P0）

- Prisma schema（文档表、分块表、对话表）
- pgvector 启用 + 向量检索
- bge-m3 embedding 接入
- 文档上传 + 解析 + 分块 + 向量化（手动上传 PDF）
- 基础对话：用户提问 → 向量检索 Top 5 → LLM 回答
- 对话历史存 PostgreSQL

#### RAG 阶段 B：检索增强（P0）

- 查询改写（指代消解 + 实体提取）
- 混合检索（向量 + 关键词 + RRF 融合）
- 元数据过滤（按产品型号）
- 对话历史管理（Redis 短期记忆）
- 兜底机制（相似度阈值 + 转人工）

#### RAG 阶段 C：精排与上下文（P1）

- bge-reranker 接入 + 精排
- 父子文档分块
- 对话摘要（长期记忆）
- 用户需求状态机
- 来源引用标注

#### RAG 阶段 D：进阶（P2）

- Text-to-SQL 产品参数查询
- 多子查询
- 查询路由（按问题类型分库）
- FAQ 直接匹配
- 后台知识库管理页面（文档上传、向量化状态、FAQ CRUD、测试问答）
- AI 用量统计与限频

### 6.12 RAG 开发 Prompt 模板（给 K3）

**RAG 阶段 A 的 Prompt**：

```
【任务】实现 AI 客服 RAG 系统的基础版本（阶段A）。

技术栈：NestJS + Prisma + PostgreSQL(pgvector) + Redis + DeepSeek API(OpenAI SDK格式)

请实现：
1. Prisma schema 新增 KnowledgeDocument、DocumentChunk、ChatConversation、ChatMessage 四个模型（按文档第六部分6.2节的schema）
2. 启用 pgvector 扩展，DocumentChunk.embedding 字段类型 vector(1024)
3. 文档上传接口：POST /api/knowledge/upload（接收PDF，存MinIO，创建KnowledgeDocument记录，status=processing）
4. 文档处理服务：用 PyMuPDF 解析PDF文本，按500字分块（重叠100字），调用bge-m3生成embedding，批量写入DocumentChunk
5. AI 对话接口：POST /api/chat
   - 接收 {message, conversationId?, productModel?}
   - 把用户问题用bge-m3转向量
   - 向量检索Top5（如果带productModel则加WHERE过滤）
   - 组装 System Prompt + 检索结果 + 对话历史
   - 调用DeepSeek API（流式返回SSE）
   - 保存用户消息和AI回复到数据库
6. 对话历史接口：GET /api/chat/:conversationId/messages
7. bge-m3通过TEI服务调用（环境变量EMBEDDING_API_URL），DeepSeek通过OpenAI SDK调用

System Prompt 按文档6.8节编写。
所有接口需要登录态校验（从NextAuth session获取userId）。
```

**RAG 阶段 B 的 Prompt**：

```
【任务】增强 RAG 检索能力（阶段B）。

在阶段A基础上实现：
1. 查询改写：调用DeepSeek，按文档6.4节的Prompt把用户问题改写成完整问题+提取实体+判断类型，输出JSON
2. 混合检索：实现文档6.5节的hybridSearch函数，向量检索+关键词检索(tsvector)+RRF融合，返回Top20
3. 元数据过滤：根据改写提取的product_model/category/doc_type过滤
4. 查询路由：pricing类型直接转人工，不查文档
5. Redis对话历史：最近10轮存Redis（TTL 24h），超出部分存PostgreSQL
6. 兜底机制：Top1相似度<0.7时返回转人工话术，标记conversation.status=transferred_to_human
7. 给DocumentChunk添加searchVector字段，文档入库时用to_tsvector填充

注意：tsvector需要在分块入库时同步生成，用PostgreSQL生成列或触发器。
```

**RAG 阶段 C/D 的 Prompt** 按 6.11 节的优先级描述，参照同样的格式发给 K3。

---

## 第七部分：验收 Checklist

### 前端 portal

- [ ] 首页滚轮动效四阶段丝滑，景深明显
- [ ] 中英文切换所有文案变化，排版不错位
- [ ] 3D模型查看器可旋转/缩放/自动旋转/切换型号
- [ ] 产品列表可按品类筛选
- [ ] 产品详情 Ask AI 未登录弹登录框，登录后打开客服
- [ ] AI客服未登录不显示，登录后右下角出现
- [ ] 询盘表单校验完整，提交有成功提示
- [ ] 所有图片/视频/模型位置有 Placeholder 标注格式尺寸
- [ ] 移动端布局正常（汉堡菜单、单列、3D上下布局）
- [ ] 无 emoji、无紫色、无全篇渐变、无写死px
- [ ] Lighthouse 性能 LCP<2.5s

### 后台 admin

- [ ] 未登录访问任何页面跳转登录
- [ ] 侧边栏导航全部可跳转
- [ ] 产品CRUD完整
- [ ] 询盘列表筛选+详情+状态变更
- [ ] 其余页面无死链，表单可提交
- [ ] 表格分页/排序正常

### Docker

- [ ] `docker compose up -d` 一键启动全部服务
- [ ] 停掉 portal 不影响 admin
- [ ] 数据库数据持久化（重启不丢）
- [ ] deploy.sh 可执行

---

## 第八部分：常见问题速查

| 问题                        | 解决方案                                                                                  |
| --------------------------- | ----------------------------------------------------------------------------------------- |
| K3 上下文满了               | 开新对话，贴通用前缀+当前任务相关文件内容                                                 |
| GSAP ScrollTrigger 不生效   | 检查是否注册了插件 `gsap.registerPlugin(ScrollTrigger)`，用 useGSAP hook                  |
| Lenis 和 ScrollTrigger 冲突 | 用 Lenis 的 `raf` 事件调用 `ScrollTrigger.update()`                                       |
| next-intl 路由报错          | 检查 `[locale]` 动态段配置和 `middleware.ts`                                              |
| 3D 模型加载失败             | 先用 BoxGeometry 确保功能通，真实模型后补                                                 |
| Tailwind 样式不生效         | 检查 `tailwind.config.js` 的 content 路径                                                 |
| shadcn/ui 安装失败          | 确认 admin 是 Next.js App Router + Tailwind，用 `npx shadcn@latest init`                  |
| Docker 构建慢               | 先复制 package.json 再 pnpm install，利用层缓存                                           |
| 中文排版错位                | 用 `[lang="zh"] .title { font-size: ... }` 覆盖                                           |
| Prisma 迁移失败             | 检查 DATABASE_URL 连接串，docker 内用服务名 postgres 而非 localhost                       |
| pnpm workspace 包引用失败   | 检查 shared 的 package.json name 字段和 main/exports 配置                                 |
| 端口冲突                    | 修改对应 app 的 package.json dev 脚本 `next dev -p 3002`                                  |
| pgvector 类型报错           | Prisma 中用 `Unsupported("vector(1024)")`，migration 里手动执行 `CREATE EXTENSION vector` |
| bge-m3 embedding 维度不匹配 | bge-m3 输出 1024 维，确认 pgvector 字段是 vector(1024)，不是 1536                         |
| TEI 容器启动失败            | 需要设置 HF_TOKEN 环境变量，或用 `--model-id BAAI/bge-m3` 预下载模型                      |
| Rerank 服务慢               | Rerank 只对 Top20 做，不要对全库做；设置超时 5s，超时降级跳过 rerank                      |
| 混合检索 SQL 报错           | 确认 PostgreSQL 启用了 pg_trgm 扩展，tsvector 字段用生成列自动维护                        |
| AI 回答编造参数             | 检查 System Prompt 是否强调"只基于资料回答"，加兜底相似度阈值                             |
| 对话历史超长                | 最近3轮原文 + 早期摘要，不要把全部历史塞进 prompt                                         |
| 文档分块把表格切断          | 用 PyMuPDF 识别表格，按参数表整体作为一个 chunk，转 Markdown 表格                         |

---

**文档结束。使用方法：每个阶段开新对话 → 贴通用前缀 → 贴阶段Prompt → 验证通过 → 下一阶段。**
