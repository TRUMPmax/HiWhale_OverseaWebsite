# Stage 0 Monorepo 初始化实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 使用 pnpm workspace + Turborepo 初始化 `apps/portal`、`apps/admin` 两个 Next.js 14 应用和 `@hiwhale/shared` 共享包，使两者能独立/同时开发启动并通过 lint 与类型检查。

**Architecture:** 根目录保留统一配置（package.json、turbo.json、tsconfig.base.json、ESLint/Prettier），两个 app 通过 workspace 引用 `@hiwhale/shared`，共享包按 `types/api/constants/utils` 分目录导出。

**Tech Stack:** Next.js 14 App Router、TypeScript 5.x (strict)、Tailwind CSS v3、pnpm workspace、Turborepo、ESLint、Prettier

## Global Constraints

- Node.js >= 20.0.0，pnpm >= 9.0.0（当前已装 11.22.0）
- TypeScript strict 模式，禁止 `any`
- 函数式组件，文件顶部加简短注释
- 样式用 Tailwind CSS，禁止写死 px 宽高
- 图标用 Lucide React，禁止 emoji
- 所有文案通过 next-intl 管理（本阶段先搭框架，文案阶段 1 完善）
- 前端交互与动效后续阶段对标行业优秀案例，追求视觉冲击力

---

## File Map

| 文件/目录 | 职责 |
|---|---|
| `apps/portal/` | 海外独立站 Next.js 应用，端口 3000 |
| `apps/admin/` | 管理后台 Next.js 应用，端口 3001 |
| `packages/shared/src/types/index.ts` | 共享 TypeScript 类型 |
| `packages/shared/src/api/index.ts` | 共享 API client 骨架 |
| `packages/shared/src/constants/index.ts` | 共享常量与枚举 |
| `packages/shared/src/utils/index.ts` | 共享工具函数 |
| `packages/shared/package.json` | 共享包配置与 exports |
| `.eslintrc.js` | 根 ESLint 配置 |
| `prettier.config.js` | 根 Prettier 配置 |
| `package.json` | 根脚本与 workspace 依赖 |

---

### Task 1: 初始化 apps/portal

**Files:**
- Create: `apps/portal/` (via `create-next-app@14`)
- Modify: `apps/portal/package.json` dev script

**Interfaces:**
- Produces: Next.js app named `portal` on port 3000

- [ ] **Step 1: Run create-next-app for portal**

```bash
cd E:/HiWhale/HiWhaleWebDev
pnpm dlx create-next-app@14 apps/portal --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-pnpm --yes
```

Expected: `apps/portal/` created with `app/`, `package.json`, `next.config.mjs`, `tsconfig.json`, etc.

- [ ] **Step 2: Set portal dev port to 3000**

Modify `apps/portal/package.json`:

```json
{
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000",
    "lint": "next lint"
  }
}
```

- [ ] **Step 3: Verify portal starts**

```bash
pnpm dev:portal
```

Expected: `http://localhost:3000` shows Next.js default page.

- [ ] **Step 4: Stop dev server**

Press `Ctrl+C`.

---

### Task 2: 初始化 apps/admin

**Files:**
- Create: `apps/admin/` (via `create-next-app@14`)
- Modify: `apps/admin/package.json` dev script

**Interfaces:**
- Produces: Next.js app named `admin` on port 3001

- [ ] **Step 1: Run create-next-app for admin**

```bash
cd E:/HiWhale/HiWhaleWebDev
pnpm dlx create-next-app@14 apps/admin --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-pnpm --yes
```

- [ ] **Step 2: Set admin dev port to 3001**

Modify `apps/admin/package.json`:

```json
{
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001",
    "lint": "next lint"
  }
}
```

- [ ] **Step 3: Verify admin starts**

```bash
pnpm dev:admin
```

Expected: `http://localhost:3001` shows Next.js default page.

- [ ] **Step 4: Stop dev server**

Press `Ctrl+C`.

---

### Task 3: 创建 packages/shared 共享包

**Files:**
- Create: `packages/shared/package.json`
- Create: `packages/shared/tsconfig.json`
- Create: `packages/shared/src/types/index.ts`
- Create: `packages/shared/src/api/index.ts`
- Create: `packages/shared/src/constants/index.ts`
- Create: `packages/shared/src/utils/index.ts`

**Interfaces:**
- Produces: `@hiwhale/shared` importable as `@hiwhale/shared/types`, `@hiwhale/shared/api`, `@hiwhale/shared/constants`, `@hiwhale/shared/utils`

- [ ] **Step 1: Create shared package.json**

```json
{
  "name": "@hiwhale/shared",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./types": "./src/types/index.ts",
    "./api": "./src/api/index.ts",
    "./constants": "./src/constants/index.ts",
    "./utils": "./src/utils/index.ts"
  },
  "scripts": {
    "type-check": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.6.0"
  }
}
```

- [ ] **Step 2: Create shared tsconfig.json**

```json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 3: Create placeholder exports**

`packages/shared/src/types/index.ts`:

```ts
/** 共享 TypeScript 类型定义 */
export type ExampleType = {
  id: string;
  name: string;
};
```

`packages/shared/src/api/index.ts`:

```ts
/** 共享 API client 与请求工具 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
```

`packages/shared/src/constants/index.ts`:

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
```

`packages/shared/src/utils/index.ts`:

```ts
/** 共享工具函数 */
export function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}
```

`packages/shared/src/index.ts`:

```ts
export * from "./types";
export * from "./api";
export * from "./constants";
export * from "./utils";
```

---

### Task 4: 配置根目录 ESLint + Prettier

**Files:**
- Create: `.eslintrc.js`
- Create: `prettier.config.js`
- Modify: `package.json` lint/type-check scripts

**Interfaces:**
- Produces: 统一的代码格式与 lint 规则，两个 app 继承

- [ ] **Step 1: Create root .eslintrc.js**

```js
/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ["next/core-web-vitals", "next/typescript", "prettier"],
  rules: {
    "no-console": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-explicit-any": "error",
  },
};
```

- [ ] **Step 2: Create root prettier.config.js**

```js
/** @type {import('prettier').Config} */
module.exports = {
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",
  printWidth: 100,
  plugins: ["prettier-plugin-tailwindcss"],
};
```

- [ ] **Step 3: Add prettier deps and update root package.json**

```bash
pnpm add -D prettier prettier-plugin-tailwindcss eslint-config-prettier
```

Update root `package.json` scripts (保留现有并补充):

```json
{
  "scripts": {
    "format": "prettier --write \"**/*.{ts,tsx,js,json,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,json,md}\""
  }
}
```

---

### Task 5: 联通 workspace 并全局验证

**Files:**
- Modify: `apps/portal/app/page.tsx` (import shared package)
- Modify: `apps/admin/app/page.tsx` (import shared package)
- Modify: `apps/portal/package.json` (add dependency)
- Modify: `apps/admin/package.json` (add dependency)
- Modify: `turbo.json` (add type-check task)

**Interfaces:**
- Consumes: `@hiwhale/shared` exports
- Produces: verified monorepo where both apps can import shared package

- [ ] **Step 1: Add shared dependency to apps**

In both `apps/portal/package.json` and `apps/admin/package.json`，add:

```json
{
  "dependencies": {
    "@hiwhale/shared": "workspace:*"
  }
}
```

- [ ] **Step 2: Run pnpm install**

```bash
pnpm install
```

Expected: lockfile updated, workspace link created.

- [ ] **Step 3: Import shared package in portal page**

Modify `apps/portal/app/page.tsx`:

```tsx
import { APP_NAME, ProductCategory } from "@hiwhale/shared/constants";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">{APP_NAME}</h1>
      <p className="mt-4 text-slate-600">Portal App</p>
      <p className="mt-2 text-sm text-slate-500">{ProductCategory.AGV_FORKLIFT}</p>
    </main>
  );
}
```

- [ ] **Step 4: Import shared package in admin page**

Modify `apps/admin/app/page.tsx`:

```tsx
import { APP_NAME } from "@hiwhale/shared/constants";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">{APP_NAME}</h1>
      <p className="mt-4 text-slate-600">Admin App</p>
    </main>
  );
}
```

- [ ] **Step 5: Update turbo.json type-check task**

```json
{
  "tasks": {
    "type-check": {
      "dependsOn": ["^build"],
      "outputs": []
    }
  }
}
```

- [ ] **Step 6: Run global lint and type-check**

```bash
pnpm lint
pnpm type-check
```

Expected: both commands complete without errors.

- [ ] **Step 7: Verify both dev servers**

Terminal 1:

```bash
pnpm dev:portal
```

Expected: `http://localhost:3000` shows "Hiwhale Robotics - Portal App".

Terminal 2:

```bash
pnpm dev:admin
```

Expected: `http://localhost:3001` shows "Hiwhale Robotics - Admin App".

- [ ] **Step 8: Stop dev servers**

Press `Ctrl+C` in both terminals.

---

## Self-Review

**Spec coverage:**
- ✅ pnpm workspace + Turborepo：已有根配置
- ✅ create-next-app 初始化 portal/admin：Task 1/2
- ✅ @hiwhale/shared 共享包：Task 3
- ✅ ESLint + Prettier：Task 4
- ✅ 根脚本 dev:portal / dev:admin / dev:all / build / lint / type-check：Task 5

**Placeholder scan:**
- ✅ 无 TBD/TODO
- ✅ 每个步骤含具体命令或代码
- ✅ 文件路径完整

**Type consistency:**
- ✅ `@hiwhale/shared/*` 路径与 `tsconfig.base.json` 映射一致
- ✅ `workspace:*` 版本协议正确
