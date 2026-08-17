# Stage 1 Shared 包 + 设计系统 + 全局布局实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 完善 `@hiwhale/shared` 共享层，建立 `portal` 的设计 Token、全局布局组件和 next-intl 双语架构。

**Architecture:** Shared 包补充业务常量/类型/API Client；portal 引入 next-intl、设计 Token、字体，并构建 Navbar/Footer/Placeholder 三个全局组件，最终在 `app/[locale]/layout.tsx` 中整合。

**Tech Stack:** Next.js 14 App Router、TypeScript 5.x (strict)、Tailwind CSS v3、next-intl、axios、lucide-react、next/font

## Global Constraints

- Node.js >= 20.0.0，pnpm >= 9.0.0（当前已装 11.22.0）
- TypeScript strict 模式，禁止 `any`
- 函数式组件，文件顶部加简短注释
- 样式用 Tailwind CSS，禁止写死 px 宽高（边框/阴影除外）
- 图标用 Lucide React，禁止 emoji
- 所有文案通过 `next-intl` 的 `t('key')` 获取，禁止硬编码
- 布局使用 flex/grid/rem/%
- 组件不超过 300 行
- 主色：深蓝 `#0A2540` + 品牌蓝 `#1A56DB` + 白色
- 浅色背景：`#FFFFFF` / `#F8FAFC`；文字：`#1E293B` / `#475569` / `#94A3B8`
- 边框：`#E2E8F0`；浅蓝标签底：`#E8F0FE`
- 字体：英文 Space Grotesk(标题) + Inter(正文)，中文 Noto Sans SC
- 双语：next-intl，所有文案 `t('key')`，中文标题比英文小一号

---

## File Map

| 文件/目录                                           | 职责                                                     |
| --------------------------------------------------- | -------------------------------------------------------- |
| `packages/shared/src/constants/index.ts`            | 业务枚举与中英文标签                                     |
| `packages/shared/src/types/index.ts`                | Product/Solution/CaseStudy/Inquiry/User/ChatMessage 类型 |
| `packages/shared/src/api/client.ts`                 | axios 实例（baseURL + token 拦截器）                     |
| `packages/shared/package.json`                      | 新增 axios 依赖                                          |
| `apps/portal/messages/en.json`                      | 英文文案                                                 |
| `apps/portal/messages/zh.json`                      | 中文文案                                                 |
| `apps/portal/middleware.ts`                         | next-intl 路由中间件                                     |
| `apps/portal/next.config.mjs`                       | next-intl 插件配置                                       |
| `apps/portal/i18n.ts` / `apps/portal/navigation.ts` | next-intl 辅助文件                                       |
| `apps/portal/app/[locale]/layout.tsx`               | locale 根布局                                            |
| `apps/portal/app/[locale]/page.tsx`                 | 首页占位                                                 |
| `apps/portal/app/layout.tsx`                        | 根布局（可被替换或保留）                                 |
| `apps/portal/components/layout/Navbar.tsx`          | 顶部导航                                                 |
| `apps/portal/components/layout/Footer.tsx`          | 页脚                                                     |
| `apps/portal/components/ui/Placeholder.tsx`         | 素材占位组件                                             |
| `apps/portal/components/providers.tsx`              | NextIntlClientProvider 包装                              |
| `apps/portal/lib/utils.ts`                          | cn 工具函数（如需要）                                    |
| `apps/portal/tailwind.config.ts`                    | 品牌色扩展                                               |
| `apps/portal/globals.css`                           | CSS 变量 + 中文排版覆盖                                  |
| `apps/portal/package.json`                          | 新增 next-intl、lucide-react、axios 等依赖               |

---

### Task 1: 完善 Shared 包常量与类型

**Files:**

- Modify: `packages/shared/src/constants/index.ts`
- Modify: `packages/shared/src/types/index.ts`
- Modify: `packages/shared/src/api/index.ts`
- Create: `packages/shared/src/api/client.ts`
- Modify: `packages/shared/src/index.ts`
- Modify: `packages/shared/package.json`

**Interfaces:**

- Produces: `ProductCategory`, `Industry`, `UserRole`, `InquiryStatus` enums + 标签映射
- Produces: `Product`, `Solution`, `CaseStudy`, `Inquiry`, `User`, `ChatMessage` types
- Produces: `client` axios instance exported from `@hiwhale/shared/api`

- [ ] **Step 1: Add axios dependency to shared package**

```bash
cd E:/HiWhale/HiWhaleWebDev
pnpm add --filter=@hiwhale/shared axios
pnpm add -D --filter=@hiwhale/shared @types/node
```

- [ ] **Step 2: Rewrite constants with enums and labels**

Modify `packages/shared/src/constants/index.ts`:

```ts
/** 共享常量与枚举 */
export const APP_NAME = "Hiwhale Robotics";

export enum ProductCategory {
  AGV_FORKLIFT = "AGV_FORKLIFT",
  AMR = "AMR",
  MANNED_FORKLIFT = "MANNED_FORKLIFT",
  ROBOTIC_ARM = "ROBOTIC_ARM",
  GANTRY_CRANE = "GANTRY_CRANE",
  SYSTEM_SOFTWARE = "SYSTEM_SOFTWARE",
}

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, { en: string; zh: string }> = {
  [ProductCategory.AGV_FORKLIFT]: { en: "AGV Forklift", zh: "无人叉车 AGV" },
  [ProductCategory.AMR]: { en: "AMR", zh: "自主移动机器人 AMR" },
  [ProductCategory.MANNED_FORKLIFT]: { en: "Manned Forklift", zh: "有人叉车" },
  [ProductCategory.ROBOTIC_ARM]: { en: "Robotic Arm", zh: "机械臂" },
  [ProductCategory.GANTRY_CRANE]: { en: "Gantry Crane", zh: "龙门吊" },
  [ProductCategory.SYSTEM_SOFTWARE]: { en: "System Software", zh: "调度系统软件" },
};

export enum Industry {
  E_COMMERCE = "E_COMMERCE",
  AUTOMOTIVE = "AUTOMOTIVE",
  THIRD_PARTY_LOGISTICS = "THIRD_PARTY_LOGISTICS",
  FOOD_COLD_CHAIN = "FOOD_COLD_CHAIN",
  PHARMACEUTICAL = "PHARMACEUTICAL",
  PORT = "PORT",
}

export const INDUSTRY_LABELS: Record<Industry, { en: string; zh: string }> = {
  [Industry.E_COMMERCE]: { en: "E-commerce", zh: "电商" },
  [Industry.AUTOMOTIVE]: { en: "Automotive", zh: "汽车" },
  [Industry.THIRD_PARTY_LOGISTICS]: { en: "3PL", zh: "第三方物流" },
  [Industry.FOOD_COLD_CHAIN]: { en: "Food & Cold Chain", zh: "食品冷链" },
  [Industry.PHARMACEUTICAL]: { en: "Pharmaceutical", zh: "医药" },
  [Industry.PORT]: { en: "Port", zh: "港口" },
};

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  SALES = "SALES",
  PRODUCT_TECH = "PRODUCT_TECH",
  OPERATIONS = "OPERATIONS",
}

export const USER_ROLE_LABELS: Record<UserRole, { en: string; zh: string }> = {
  [UserRole.SUPER_ADMIN]: { en: "Super Admin", zh: "超级管理员" },
  [UserRole.SALES]: { en: "Sales", zh: "销售" },
  [UserRole.PRODUCT_TECH]: { en: "Product / Tech", zh: "产品/技术" },
  [UserRole.OPERATIONS]: { en: "Operations", zh: "运营" },
};

export enum InquiryStatus {
  NEW = "NEW",
  FOLLOWING = "FOLLOWING",
  WON = "WON",
  CLOSED = "CLOSED",
}

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, { en: string; zh: string }> = {
  [InquiryStatus.NEW]: { en: "New", zh: "新询盘" },
  [InquiryStatus.FOLLOWING]: { en: "Following", zh: "跟进中" },
  [InquiryStatus.WON]: { en: "Won", zh: "已成交" },
  [InquiryStatus.CLOSED]: { en: "Closed", zh: "已关闭" },
};
```

- [ ] **Step 3: Define business types**

Modify `packages/shared/src/types/index.ts`:

```ts
import { InquiryStatus, ProductCategory, UserRole } from "../constants";

/** 共享 TypeScript 类型定义 */

export type ProductSpec = {
  label: string;
  value: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  model: string;
  specs: ProductSpec[];
  images: string[];
  description: string;
  features: string[];
};

export type SolutionStep = {
  title: string;
  description: string;
};

export type Solution = {
  id: string;
  slug: string;
  industry: string;
  title: string;
  description: string;
  painPoints: string[];
  process: SolutionStep[];
  results: string[];
  relatedProducts: string[];
};

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

export type CaseStudy = {
  id: string;
  slug: string;
  clientName: string;
  industry: string;
  background: string;
  challenge: string;
  solution: string;
  results: string[];
  testimonial?: Testimonial;
};

export type Inquiry = {
  id: string;
  fullName: string;
  company: string;
  email: string;
  phone?: string;
  country: string;
  categories: ProductCategory[];
  description: string;
  status: InquiryStatus;
  createdAt: string;
};

export type User = {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  country?: string;
  role: UserRole;
  status: "active" | "disabled";
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
};
```

- [ ] **Step 4: Create axios client**

Create `packages/shared/src/api/client.ts`:

```ts
/** 共享 API client 与请求工具 */
import axios from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
```

- [ ] **Step 5: Update api/index.ts to re-export client**

Modify `packages/shared/src/api/index.ts`:

```ts
export { API_BASE_URL, client } from "./client";
```

- [ ] **Step 6: Update shared index.ts**

Modify `packages/shared/src/index.ts`:

```ts
export * from "./types";
export * from "./api";
export * from "./constants";
export * from "./utils";
```

- [ ] **Step 7: Verify shared package builds and type-checks**

```bash
pnpm --filter=@hiwhale/shared type-check
pnpm --filter=@hiwhale/shared build
```

Expected: both pass without errors.

- [ ] **Step 8: Commit**

```bash
git add packages/shared/
git commit -m "feat(shared): add business constants, types, and axios client"
```

---

### Task 2: Portal 国际化（next-intl）配置

**Files:**

- Modify: `apps/portal/package.json`
- Modify: `apps/portal/next.config.mjs`
- Create: `apps/portal/middleware.ts`
- Create: `apps/portal/i18n.ts`
- Create: `apps/portal/navigation.ts`
- Create: `apps/portal/messages/en.json`
- Create: `apps/portal/messages/zh.json`
- Create: `apps/portal/components/providers.tsx`
- Modify: `apps/portal/tsconfig.json` (if needed)

**Interfaces:**

- Consumes: existing Next.js 14 App Router structure
- Produces: `/en/*` and `/zh/*` routes, default redirect to `/en`, messages available via `useTranslations`

- [ ] **Step 1: Install next-intl and lucide-react**

```bash
cd E:/HiWhale/HiWhaleWebDev
pnpm add --filter=portal next-intl lucide-react
```

- [ ] **Step 2: Configure next.config.mjs with next-intl plugin**

Modify `apps/portal/next.config.mjs`:

```js
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withNextIntl(nextConfig);
```

- [ ] **Step 3: Create i18n request config**

Create `apps/portal/i18n.ts`:

```ts
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 4: Create navigation helpers**

Create `apps/portal/navigation.ts`:

```ts
import { createSharedPathnamesNavigation } from "next-intl/navigation";

export const locales = ["en", "zh"] as const;
export const defaultLocale = "en";

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({
  locales,
  localePrefix: "always",
});
```

- [ ] **Step 5: Create middleware**

Create `apps/portal/middleware.ts`:

```ts
import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "./navigation";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
```

- [ ] **Step 6: Create message files**

Create `apps/portal/messages/en.json`:

```json
{
  "metadata": {
    "title": "Hiwhale Robotics",
    "description": "Intelligent warehousing and material handling solutions"
  },
  "nav": {
    "home": "Home",
    "products": "Products",
    "solutions": "Solutions",
    "cases": "Cases",
    "about": "About",
    "contact": "Contact"
  },
  "common": {
    "login": "Login",
    "signup": "Sign Up",
    "language": "Language",
    "english": "English",
    "chinese": "中文"
  },
  "footer": {
    "company": "Company",
    "products": "Products",
    "solutions": "Solutions",
    "contact": "Contact",
    "privacyPolicy": "Privacy Policy",
    "copyright": "© {year} Hiwhale Robotics. All rights reserved."
  }
}
```

Create `apps/portal/messages/zh.json`:

```json
{
  "metadata": {
    "title": "浩鲸机器人",
    "description": "智能仓储与货物转运解决方案"
  },
  "nav": {
    "home": "首页",
    "products": "产品",
    "solutions": "方案",
    "cases": "案例",
    "about": "关于我们",
    "contact": "联系我们"
  },
  "common": {
    "login": "登录",
    "signup": "注册",
    "language": "语言",
    "english": "English",
    "chinese": "中文"
  },
  "footer": {
    "company": "公司",
    "products": "产品",
    "solutions": "方案",
    "contact": "联系方式",
    "privacyPolicy": "隐私政策",
    "copyright": "© {year} 浩鲸机器人。保留所有权利。"
  }
}
```

- [ ] **Step 7: Create providers component**

Create `apps/portal/components/providers.tsx`:

```tsx
"use client";

import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";

type ProvidersProps = {
  children: ReactNode;
  locale: string;
  messages: Record<string, unknown>;
};

/** 全局 Provider 包装 */
export function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
```

- [ ] **Step 8: Verify type-check**

```bash
pnpm --filter=portal type-check
```

Expected: passes.

- [ ] **Step 9: Commit**

```bash
git add apps/portal/
git commit -m "feat(portal): configure next-intl with en/zh messages"
```

---

### Task 3: Portal 字体与设计 Token

**Files:**

- Modify: `apps/portal/app/layout.tsx`
- Modify: `apps/portal/app/[locale]/layout.tsx` (create/replace)
- Modify: `apps/portal/tailwind.config.ts`
- Modify: `apps/portal/globals.css`
- Create: `apps/portal/app/[locale]/page.tsx`
- Delete: `apps/portal/app/page.tsx` (after creating locale version)

**Interfaces:**

- Consumes: next-intl setup from Task 2
- Produces: design tokens via CSS variables and Tailwind, fonts loaded via next/font

- [ ] **Step 1: Update globals.css with design tokens**

Modify `apps/portal/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #ffffff;
  --foreground: #1e293b;
  --muted: #475569;
  --subtle: #94a3b8;
  --border: #e2e8f0;
  --brand-navy: #0a2540;
  --brand-blue: #1a56db;
  --brand-light-blue: #e8f0fe;
  --brand-light: #f8fafc;
}

html {
  scroll-behavior: smooth;
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: var(--font-inter), var(--font-noto-sans-sc), system-ui, sans-serif;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: var(--font-space-grotesk), var(--font-noto-sans-sc), system-ui, sans-serif;
}

[lang="zh"] h1 {
  font-size: 2.25rem;
  line-height: 1.2;
}

[lang="zh"] h2 {
  font-size: 1.875rem;
  line-height: 1.25;
}

[lang="zh"] h3 {
  font-size: 1.5rem;
  line-height: 1.3;
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

- [ ] **Step 2: Extend Tailwind config with brand colors and fonts**

Modify `apps/portal/tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        subtle: "var(--subtle)",
        border: "var(--border)",
        brand: {
          navy: "var(--brand-navy)",
          blue: "var(--brand-blue)",
          light: "var(--brand-light-blue)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-noto-sans-sc)", "system-ui", "sans-serif"],
        heading: [
          "var(--font-space-grotesk)",
          "var(--font-noto-sans-sc)",
          "system-ui",
          "sans-serif",
        ],
      },
      maxWidth: {
        "7xl": "80rem",
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 3: Configure fonts in root layout**

Modify `apps/portal/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Inter, Noto_Sans_SC, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-sc",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hiwhale Robotics",
  description: "Intelligent warehousing and material handling solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${notoSansSC.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Create locale layout**

Create `apps/portal/app/[locale]/layout.tsx`:

```tsx
import { getMessages, unstable_setRequestLocale } from "next-intl/server";
import { Providers } from "@/components/providers";
import { locales } from "@/navigation";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <Providers locale={locale} messages={messages}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Create locale home page and remove old page**

Create `apps/portal/app/[locale]/page.tsx`:

```tsx
import { APP_NAME } from "@hiwhale/shared/constants";
import { useTranslations } from "next-intl";

/** 首页占位 */
export default function HomePage() {
  const t = useTranslations("metadata");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-24">
      <h1 className="font-heading text-foreground text-4xl font-bold md:text-5xl">{APP_NAME}</h1>
      <p className="text-muted mt-4 text-lg">{t("description")}</p>
    </main>
  );
}
```

Delete `apps/portal/app/page.tsx`:

```bash
rm apps/portal/app/page.tsx
```

- [ ] **Step 6: Verify type-check and build**

```bash
pnpm --filter=portal type-check
pnpm --filter=portal build
```

Expected: both pass.

- [ ] **Step 7: Commit**

```bash
git add apps/portal/
git commit -m "feat(portal): add design tokens, fonts, and locale layout"
```

---

### Task 4: 创建布局组件（Navbar / Footer / Placeholder）

**Files:**

- Create: `apps/portal/components/layout/Navbar.tsx`
- Create: `apps/portal/components/layout/Footer.tsx`
- Create: `apps/portal/components/ui/Placeholder.tsx`
- Modify: `apps/portal/app/[locale]/layout.tsx`
- Modify: `apps/portal/app/[locale]/page.tsx`

**Interfaces:**

- Consumes: next-intl translations, navigation helpers, design tokens
- Produces: reusable layout components used by locale layout

- [ ] **Step 1: Create Placeholder component**

Create `apps/portal/components/ui/Placeholder.tsx`:

```tsx
import { ImageIcon } from "lucide-react";

type PlaceholderProps = {
  label: string;
  format?: string;
  size?: string;
  description?: string;
};

/** 通用素材占位组件 */
export function Placeholder({ label, format, size, description }: PlaceholderProps) {
  return (
    <div className="border-border bg-brand-light flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center">
      <ImageIcon className="text-subtle h-10 w-10" />
      <span className="text-foreground mt-3 font-medium">{label}</span>
      {format && <span className="text-muted mt-1 text-sm">{format}</span>}
      {size && <span className="text-muted text-sm">{size}</span>}
      {description && <p className="text-subtle mt-2 max-w-xs text-sm">{description}</p>}
    </div>
  );
}
```

- [ ] **Step 2: Create Navbar component**

Create `apps/portal/components/layout/Navbar.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter, locales } from "@/navigation";
import { APP_NAME } from "@hiwhale/shared/constants";
import { Menu, X, Globe, User } from "lucide-react";

/** 顶部导航栏：滚动变白 + 模糊 + 高度收缩 */
export function Navbar() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/" as const, label: t("home") },
    { href: "/products" as const, label: t("products") },
    { href: "/solutions" as const, label: t("solutions") },
    { href: "/cases" as const, label: t("cases") },
    { href: "/about" as const, label: t("about") },
    { href: "/contact" as const, label: t("contact") },
  ];

  const switchLocale = (locale: string) => {
    router.replace(pathname, { locale });
  };

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 py-3 shadow-sm backdrop-blur-md" : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-8 lg:px-12">
        <Link href="/" className="font-heading text-brand-navy text-xl font-bold">
          {APP_NAME}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-foreground hover:text-brand-blue text-sm font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <div className="relative flex items-center gap-1">
            <Globe className="text-muted h-4 w-4" />
            <select
              aria-label={tc("language")}
              className="text-foreground bg-transparent text-sm outline-none"
              onChange={(e) => switchLocale(e.target.value)}
              defaultValue={pathname.startsWith("/zh") ? "zh" : "en"}
            >
              <option value="en">{tc("english")}</option>
              <option value="zh">{tc("chinese")}</option>
            </select>
          </div>
          <Link
            href="/auth/login"
            className="bg-brand-blue flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <User className="h-4 w-4" />
            {tc("login")}
          </Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-border border-t bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground text-base font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 pt-2">
              <Globe className="text-muted h-4 w-4" />
              <select
                aria-label={tc("language")}
                className="bg-transparent text-sm"
                onChange={(e) => switchLocale(e.target.value)}
              >
                <option value="en">{tc("english")}</option>
                <option value="zh">{tc("chinese")}</option>
              </select>
            </div>
            <Link
              href="/auth/login"
              className="bg-brand-blue rounded-lg px-4 py-2 text-center text-sm font-medium text-white"
            >
              {tc("login")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 3: Create Footer component**

Create `apps/portal/components/layout/Footer.tsx`:

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { APP_NAME, PRODUCT_CATEGORY_LABELS, ProductCategory } from "@hiwhale/shared/constants";

/** 页脚：深蓝背景，公司/产品/方案/联系方式 */
export function Footer() {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  const productCategories = Object.values(ProductCategory);

  return (
    <footer className="bg-brand-navy py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-heading text-lg font-bold">{APP_NAME}</h3>
            <p className="mt-4 text-sm text-white/70">
              Intelligent warehousing and material handling solutions for global customers.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider">
              {t("products")}
            </h4>
            <ul className="mt-4 space-y-2">
              {productCategories.map((category) => (
                <li key={category}>
                  <Link
                    href={`/products?category=${category}`}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {PRODUCT_CATEGORY_LABELS[category].en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider">
              {t("solutions")}
            </h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/solutions" className="text-sm text-white/70 hover:text-white">
                  E-commerce
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="text-sm text-white/70 hover:text-white">
                  Automotive
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="text-sm text-white/70 hover:text-white">
                  3PL
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="text-sm text-white/70 hover:text-white">
                  Cold Chain
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider">
              {t("contact")}
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>info@hiwhale.com</li>
              <li>+86 400-000-0000</li>
              <li>Shanghai, China</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-white/60">{t("copyright", { year: currentYear })}</p>
          <Link href="/privacy-policy" className="text-sm text-white/60 hover:text-white">
            {t("privacyPolicy")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Wire Navbar and Footer into locale layout**

Modify `apps/portal/app/[locale]/layout.tsx`:

```tsx
import { getMessages, unstable_setRequestLocale } from "next-intl/server";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { locales } from "@/navigation";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="flex min-h-screen flex-col">
        <Providers locale={locale} messages={messages}>
          <Navbar />
          <main className="flex-1 pt-20">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Update home page to include Placeholder**

Modify `apps/portal/app/[locale]/page.tsx`:

```tsx
import { APP_NAME } from "@hiwhale/shared/constants";
import { useTranslations } from "next-intl";
import { Placeholder } from "@/components/ui/Placeholder";

/** 首页占位 */
export default function HomePage() {
  const t = useTranslations("metadata");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-24">
      <h1 className="font-heading text-foreground text-4xl font-bold md:text-5xl">{APP_NAME}</h1>
      <p className="text-muted mt-4 text-lg">{t("description")}</p>
      <div className="mt-12 w-full max-w-md">
        <Placeholder
          label="Hero Image"
          format="JPG / WebP"
          size="1920x1080"
          description="Homepage hero visual placeholder"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Verify lint, type-check, build**

```bash
pnpm lint
pnpm type-check
pnpm build:portal
```

Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add apps/portal/
git commit -m "feat(portal): add Navbar, Footer, Placeholder components"
```

---

### Task 5: 最终验证与验收

**Files:**

- None (verification task)

**Interfaces:**

- Consumes: all previous tasks
- Produces: verified Stage 1 deliverables

- [ ] **Step 1: Run full lint and type-check**

```bash
cd E:/HiWhale/HiWhaleWebDev
pnpm lint
pnpm type-check
```

Expected: no errors or warnings.

- [ ] **Step 2: Run portal build**

```bash
pnpm build:portal
```

Expected: successful static generation.

- [ ] **Step 3: Start dev server and verify in browser**

```bash
pnpm dev:portal
```

Verify:

- `http://localhost:3000/en` redirects or loads with English navigation
- `http://localhost:3000/zh` loads with Chinese navigation
- Scroll down: Navbar background turns white with blur effect
- Footer has dark blue background and all link sections
- Placeholder component shows label/format/size/description
- No emoji, no purple, no fixed px widths

- [ ] **Step 4: Stop dev server**

Press `Ctrl+C`.

- [ ] **Step 5: Final commit if any changes**

```bash
git status --short
```

If there are changes, commit them:

```bash
git add -A
git commit -m "chore(portal): stage 1 verification and polish"
```

---

## Self-Review

**Spec coverage:**

- ✅ Shared constants: Task 1
- ✅ Shared types: Task 1
- ✅ Shared API client: Task 1
- ✅ next-intl config and messages: Task 2
- ✅ Fonts and design tokens: Task 3
- ✅ Navbar/Footer/Placeholder: Task 4
- ✅ Locale layout integration: Task 4
- ✅ Verification: Task 5

**Placeholder scan:**

- ✅ 无 TBD/TODO
- ✅ 每个步骤含具体命令或代码
- ✅ 文件路径完整

**Type consistency:**

- ✅ `ProductCategory` / `Industry` / `UserRole` / `InquiryStatus` 枚举与标签映射一致
- ✅ `client` axios 实例从 `@hiwhale/shared/api` 导出
- ✅ `locales` 和 `defaultLocale` 在 `navigation.ts` 和 `middleware.ts` 中一致
- ✅ Tailwind 品牌色与 CSS 变量一致
