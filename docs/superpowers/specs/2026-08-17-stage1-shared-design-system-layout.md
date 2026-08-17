# Stage 1: Shared 包 + 设计系统 + 全局布局设计文档

**日期**: 2026-08-17  
**对应开发指南**: 《Hiwhale_K3开发指南与功能需求.md》第四部分 阶段 1  
**目标**: 完善 `@hiwhale/shared` 共享层，建立 `portal` 的设计 Token、全局布局组件和 next-intl 双语架构。

## 1. 上下文

上一阶段（Stage 0）已完成：
- Monorepo 骨架：`apps/portal`、`apps/admin`、`packages/shared`
- 根目录 ESLint / Prettier / Turbo 配置
- `@hiwhale/shared` 已具备最小 placeholder 导出和 tsup 构建
- 两个 app 均可独立/同时启动并通过 lint、type-check、build

本阶段在 Stage 0 基础上填充 shared 包业务内容，并为 portal 建立设计系统、双语架构和全局布局组件。

## 2. 架构

```
hiwhale-platform/
├── packages/shared/
│   └── src/
│       ├── constants/index.ts    # 枚举与多语言标签
│       ├── types/index.ts        # 业务类型
│       └── api/client.ts         # axios 实例
├── apps/portal/
│   ├── app/[locale]/
│   │   ├── layout.tsx            # 带 Navbar/Footer 的根布局
│   │   └── page.tsx              # 首页占位
│   ├── components/
│   │   ├── layout/Navbar.tsx     # 顶部导航
│   │   ├── layout/Footer.tsx     # 页脚
│   │   └── ui/Placeholder.tsx    # 素材占位
│   ├── messages/
│   │   ├── en.json               # 英文文案
│   │   └── zh.json               # 中文文案
│   ├── middleware.ts             # next-intl 路由前缀
│   ├── next.config.mjs           # next-intl 插件
│   ├── tailwind.config.ts        # 品牌色扩展
│   └── globals.css               # CSS 变量 + 中文排版覆盖
```

## 3. 技术选型

| 项 | 选型 | 说明 |
|---|---|---|
| 国际化 | next-intl | App Router 官方推荐方案，URL 前缀 `/en/` `/zh/` |
| 字体 | next/font | Space Grotesk + Inter + Noto Sans SC |
| HTTP Client | axios | shared/api/client.ts |
| 图标 | lucide-react | 禁止 emoji |
| 样式 | Tailwind CSS v3 | 扩展品牌色 |

## 4. 实现要点

### 4.1 Shared 常量

定义以下枚举，并附带中英文显示名称的映射对象：
- `ProductCategory`：AGV_FORKLIFT / AMR / MANNED_FORKLIFT / ROBOTIC_ARM / GANTRY_CRANE / SYSTEM_SOFTWARE
- `Industry`：E_COMMERCE / AUTOMOTIVE / THIRD_PARTY_LOGISTICS / FOOD_COLD_CHAIN / PHARMACEUTICAL / PORT
- `UserRole`：SUPER_ADMIN / SALES / PRODUCT_TECH / OPERATIONS
- `InquiryStatus`：NEW / FOLLOWING / WON / CLOSED

### 4.2 Shared 类型

定义核心业务类型：
- `Product`：id, slug, name, category, model, specs, images, description, features
- `Solution`：id, slug, industry, title, description, painPoints, process, results, relatedProducts
- `CaseStudy`：id, slug, clientName, industry, background, challenge, solution, results, testimonial
- `Inquiry`：id, fullName, company, email, phone, country, categories, description, status, createdAt
- `User`：id, name, company, email, phone, country, role, status
- `ChatMessage`：id, role, content, createdAt

### 4.3 Shared API Client

- 文件：`packages/shared/src/api/client.ts`
- 使用 axios.create
- `baseURL` 从 `process.env.NEXT_PUBLIC_API_URL` 读取，默认 `http://localhost:4000`
- 请求拦截器：从 `localStorage` 读取 `token` 并加入 `Authorization: Bearer <token>`
- 导出 `client` 实例

### 4.4 Portal 国际化

- `next-intl` 版本与 Next.js 14 兼容
- `middleware.ts`：匹配 `/en` 和 `/zh`，默认重定向到 `/en`
- `next.config.mjs`：使用 `createNextIntlPlugin`
- `app/[locale]/layout.tsx`：接收 `params.locale`，传给 `NextIntlClientProvider`
- `messages/en.json` / `messages/zh.json`：先包含导航与通用文案

### 4.5 Portal 字体

- `Space Grotesk`：英文标题
- `Inter`：英文正文
- `Noto Sans SC`：中文
- 通过 `next/font/google` 加载，CSS 变量注入

### 4.6 Portal 设计 Token

`globals.css` 定义 CSS 变量：
- `--brand-navy: #0A2540`
- `--brand-blue: #1A56DB`
- `--brand-light-blue: #E8F0FE`
- `--background: #FFFFFF`
- `--foreground: #1E293B`
- `--muted: #475569`
- `--subtle: #94A3B8`
- `--border: #E2E8F0`

Tailwind 扩展：
- `colors.brand.navy`, `colors.brand.blue`, `colors.brand.light`
- `colors.background`, `colors.foreground`

中文覆盖：
- `[lang="zh"] h1 { font-size: ... }` 等

### 4.7 布局组件

**Navbar**
- 固定顶部，默认透明
- 滚动超过阈值后：白色背景 + `backdrop-blur-md` + 高度收缩 + 阴影
- Logo（文字 Logo）
- 导航链接：Home / Products / Solutions / Cases / About / Contact
- 语言切换按钮（EN / ZH）
- 登录按钮

**Footer**
- 深蓝背景 `#0A2540`
- 公司信息、产品分类、方案、联系方式、隐私政策链接
- 分栏布局，响应式

**Placeholder**
- props: `label`, `format`, `size`, `description`
- 浅灰虚线边框，居中文字，显示格式/尺寸

### 4.8 路由结构

- `app/[locale]/layout.tsx` 作为 locale 根布局
- `app/[locale]/page.tsx` 首页
- 非 locale 路径通过 middleware 重定向

## 5. 数据流 / 依赖关系

- `apps/portal` 依赖 `@hiwhale/shared/constants`、`@hiwhale/shared/types`、`@hiwhale/shared/api`
- `@hiwhale/shared` 依赖 `axios`、`@types/node`
- 组件通过 `next-intl` 的 `useTranslations` 获取文案

## 6. 验收标准

- `pnpm lint` 无错误
- `pnpm type-check` 无错误
- `pnpm build:portal` 成功
- 访问 `/en` 和 `/zh` 导航文案切换正常
- 滚动页面 Navbar 变白 + 模糊 + 高度收缩
- Footer 深蓝背景，链接可点击
- Placeholder 组件渲染 label/format/size/description
- 无 emoji、无紫色、无写死 px 宽高（边框/阴影除外）

## 7. 质量要求

- TypeScript strict，禁止 `any`
- 函数式组件，文件顶部注释
- 所有文案通过 `t('key')`，禁止硬编码
- 图标用 Lucide React
- 布局使用 flex/grid/rem/%
- 组件不超过 300 行
