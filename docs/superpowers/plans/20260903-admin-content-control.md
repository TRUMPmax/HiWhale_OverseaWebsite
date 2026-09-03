# 后台全方位管理前台展示数据 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让后台可管理前台全部实体展示数据：方案交付周期、各类展示图标（分组/痛点/特性/指标）、首页行业卡片，均不再写死。

**Architecture:** 沿袭项目两个成熟范式——分类体系 DB 化（taxonomy）与 site_settings KV。图标走"shared 纯数据白名单 + 各端组件映射"（shared 不依赖 React/lucide，避免 api/seed 被污染）；JSON 列条目加可选 `icon` 字段（零迁移）；`Solution.duration` 与 `ProductGroupEntity.icon` 走一次 prisma 迁移；首页行业卡片走 site_settings 新 key `home-industries`。

**Tech Stack:** pnpm + Turborepo；Next.js 14（portal/admin）；NestJS + Prisma + PostgreSQL；next-intl；zustand；react-hook-form + zod；shadcn/ui；lucide-react ^1.31.0（portal/admin 均有）。

**Spec:** `docs/superpowers/specs/2026-09-03-admin-content-control-design.md`

## Global Constraints

- **禁止任何 git 提交/变更操作**（git mutation 需用户显式要求；本次全部留给用户提交）。
- dev server 运行期间禁止 `pnpm build`（会清空 .next 导致 500）；校验用 `pnpm format` + `pnpm lint` + `pnpm type-check`。
- shared 改动后必须 `pnpm --filter @hiwhale/shared build`（apps 引用的是 dist），再跑 type-check。
- messages：`apps/portal/messages/en.json` 与 `zh.json` 必须同步增改。
- 品牌：禁紫色/渐变底色/emoji，图标用 lucide；admin 纯中文 UI。
- **工作区有未提交在途修改**：`apps/admin/components/cases/CaseFormDialog.tsx`、`apps/admin/components/solutions/SolutionFormDialog.tsx`、`apps/admin/store/cases.ts`、`apps/admin/store/solutions.ts`——在其当前内容基础上追加，禁止 `git checkout` 回退。
- 本项目无单元测试框架；每个任务的"测试"= 该任务涉及的 type-check/lint 通过 + 指定的手工验证点。
- 全部前台消费点保持"字段缺失/API 失败 → 现状默认值"回退，不白屏；所有新字段均可选，旧数据行为不变。

---

### Task 1: shared 图标白名单注册表 + 类型扩展

**Files:**

- Create: `packages/shared/src/constants/icons.ts`
- Modify: `packages/shared/src/constants/solutions/types.ts`
- Modify: `packages/shared/src/constants/cases/types.ts`
- Modify: `packages/shared/src/constants/products/types.ts`
- Modify: `packages/shared/src/constants/index.ts`（第 134-137 行 export 区）

**Interfaces:**

- Produces（后续任务依赖）:
  - `PORTAL_ICON_OPTIONS: readonly { name: string; zh: string }[]`
  - `type PortalIconName = (typeof PORTAL_ICON_OPTIONS)[number]["name"]`
  - `isPortalIconName(name: unknown): name is PortalIconName`
  - `DEFAULT_GROUP_ICONS: Record<string, PortalIconName>`（7 个大类 key → 图标名）
  - `MockSolution.duration?: LocalizedText`；`MockSolution.painPoints: Array<LocalizedText | MockSolutionPainPoint>`
  - `type MockSolutionPainPoint = { text: LocalizedText; icon?: string }`；`normalizePainPoint(p)`
  - `MockSolutionResult.icon?: string`；`MockCaseResult.icon?: string`
  - `type MockProductFeature = { text: LocalizedText; icon?: string }`；`normalizeFeature(f)`；`MockProduct.features: Array<LocalizedText | MockProductFeature>`

- [ ] **Step 1: 创建 `packages/shared/src/constants/icons.ts`（纯数据，禁止 import React/lucide——seed.js 会经 constants 桶加载本文件）**

```ts
/**
 * 门户可选图标白名单（纯数据）。
 * 各端（portal IconByName / admin IconPicker）各自维护 name → lucide 组件的映射，
 * 并用 PortalIconName 联合类型约束，保证白名单与组件映射不漂移。
 * 注意：本文件被 api/prisma/seed.js 间接加载，禁止引入 React/lucide-react。
 */
export const PORTAL_ICON_OPTIONS = [
  { name: "truck", zh: "运输/叉车" },
  { name: "bot", zh: "机器人" },
  { name: "cog", zh: "机械/设置" },
  { name: "container", zh: "集装箱" },
  { name: "sparkles", zh: "洁净/闪耀" },
  { name: "package-open", zh: "拆包/配送" },
  { name: "monitor", zh: "软件/屏幕" },
  { name: "shapes", zh: "通用/其他" },
  { name: "zap", zh: "高效/速度" },
  { name: "shield-check", zh: "安全/合规" },
  { name: "radar", zh: "感知/雷达" },
  { name: "wifi", zh: "互联/通讯" },
  { name: "clock", zh: "时间/周期" },
  { name: "package", zh: "设备/包裹" },
  { name: "quote", zh: "证言/引用" },
  { name: "alert-triangle", zh: "痛点/警告" },
  { name: "boxes", zh: "仓储/箱体" },
  { name: "network", zh: "系统/网络" },
  { name: "warehouse", zh: "仓库" },
  { name: "factory", zh: "工厂" },
  { name: "timer", zh: "效率/计时" },
  { name: "trending-up", zh: "增长" },
  { name: "trending-down", zh: "下降/降本" },
  { name: "coins", zh: "成本/回报" },
  { name: "gauge", zh: "性能/仪表" },
  { name: "battery-charging", zh: "续航/能源" },
  { name: "leaf", zh: "环保" },
  { name: "snowflake", zh: "冷链" },
  { name: "pill", zh: "医药" },
  { name: "car", zh: "汽车" },
  { name: "ship", zh: "港口/航运" },
  { name: "shopping-cart", zh: "电商/零售" },
  { name: "building-2", zh: "企业/楼宇" },
  { name: "cpu", zh: "芯片/算力" },
  { name: "scan-line", zh: "识别/扫码" },
  { name: "route", zh: "路径/调度" },
  { name: "clipboard-check", zh: "验收/清单" },
  { name: "users", zh: "人力/团队" },
  { name: "award", zh: "认证/荣誉" },
  { name: "target", zh: "目标/精准" },
  { name: "rocket", zh: "上线/提速" },
  { name: "wrench", zh: "运维/工具" },
  { name: "globe", zh: "全球/网络" },
  { name: "activity", zh: "运行/监控" },
  { name: "layers", zh: "分层/集成" },
] as const;

export type PortalIconName = (typeof PORTAL_ICON_OPTIONS)[number]["name"];

export function isPortalIconName(name: unknown): name is PortalIconName {
  return typeof name === "string" && PORTAL_ICON_OPTIONS.some((o) => o.name === name);
}

/** 产品大类默认图标（DB ProductGroupEntity.icon 为空时的回退；亦用于 seed 初始值） */
export const DEFAULT_GROUP_ICONS: Record<string, PortalIconName> = {
  FORKLIFT: "truck",
  MOBILE_ROBOT: "bot",
  ROBOTIC_ARM: "cog",
  GANTRY_CRANE: "container",
  CLEANING_ROBOT: "sparkles",
  DELIVERY_ROBOT: "package-open",
  SOFTWARE: "monitor",
};
```

- [ ] **Step 2: 改 `packages/shared/src/constants/solutions/types.ts`**

将 `MockSolutionResult`、`MockSolution` 替换为（新增 `MockSolutionPainPoint` 与 `normalizePainPoint`）：

```ts
import type { LocalizedText } from "../products/types";

export type MockSolutionStep = {
  title: LocalizedText;
  description: LocalizedText;
};

export type MockSolutionResult = {
  value: string;
  label: LocalizedText;
  /** 可选展示图标（PORTAL_ICONS 白名单 name；空 → 前台不渲染图标） */
  icon?: string;
};

/** 痛点条目：新形状可带 icon；旧数据为纯 LocalizedText（兼容） */
export type MockSolutionPainPoint = {
  text: LocalizedText;
  icon?: string;
};

/** 兼容旧形状（纯 LocalizedText）与新形状（{text, icon}） */
export function normalizePainPoint(
  p: LocalizedText | MockSolutionPainPoint,
): MockSolutionPainPoint {
  return "text" in p ? p : { text: p };
}

/** 行业方案类型（与 API Solution 形状一致） */
export type MockSolution = {
  slug: string;
  /** 行业：内置 Industry 枚举 key，或管理后台手输的自定义行业文本 */
  industry: string;
  title: LocalizedText;
  summary: LocalizedText;
  description: LocalizedText;
  /** 交付周期（可选，如 "8-12 weeks" / "8-12 周"）；空 → 前台不展示 */
  duration?: LocalizedText;
  /** 行业痛点，4 条（兼容旧纯文本形状） */
  painPoints: Array<LocalizedText | MockSolutionPainPoint>;
  /** 关联产品 slug 数组 */
  productSlugs: string[];
  /** 部署流程，5 步 */
  process: MockSolutionStep[];
  /** 关键成效，3-4 条 */
  results: MockSolutionResult[];
  /** 方案场景图素材文件名 */
  imageName: string;
};
```

- [ ] **Step 3: 改 `packages/shared/src/constants/cases/types.ts`**

`MockCaseResult` 加可选 icon（其余不动）：

```ts
export type MockCaseResult = {
  value: string;
  label: LocalizedText;
  /** 可选展示图标（PORTAL_ICONS 白名单 name；空 → 前台不渲染图标） */
  icon?: string;
};
```

- [ ] **Step 4: 改 `packages/shared/src/constants/products/types.ts`**

在 `MockSpecGroup` 后新增，并改 `MockProduct.features` 类型：

```ts
/** 产品特性条目：新形状可带 icon；旧数据为纯 LocalizedText（兼容） */
export type MockProductFeature = {
  text: LocalizedText;
  icon?: string;
};

/** 兼容旧形状（纯 LocalizedText）与新形状（{text, icon}） */
export function normalizeFeature(f: LocalizedText | MockProductFeature): MockProductFeature {
  return "text" in f ? f : { text: f };
}
```

`MockProduct.features` 改为：

```ts
/** 核心特性，3-4 条（兼容旧纯文本形状） */
features: Array<LocalizedText | MockProductFeature>;
```

- [ ] **Step 5: 导出 icons**

`packages/shared/src/constants/index.ts` 在 `export * from "./product-groups";` 一行后加：

```ts
export * from "./icons";
```

- [ ] **Step 6: 构建 + 验证**

Run: `pnpm --filter @hiwhale/shared build && pnpm --filter @hiwhale/shared type-check`
Expected: 构建成功无错误（此时 portal/admin 类型错误属预期，后续任务修复——不要在本任务跑根目录 type-check）。

---

### Task 2: API——schema 迁移 + DTO/service + seed

**Files:**

- Modify: `api/prisma/schema.prisma`（Solution 约 210-229 行；ProductGroupEntity 约 161-172 行）
- Create: `api/prisma/migrations/20260903120000_group_icon_solution_duration/migration.sql`
- Modify: `api/src/modules/solutions/dto/solutions.dto.ts`
- Modify: `api/src/modules/solutions/solutions.service.ts`（create 40-53、update 69-85）
- Modify: `api/src/modules/taxonomy/dto/taxonomy.dto.ts`（UpsertGroupDto 19-31）
- Modify: `api/src/modules/taxonomy/taxonomy.service.ts`（createGroup 49-62、updateGroup 64-77）
- Modify: `api/prisma/seed.js`

**Interfaces:**

- Consumes: Task 1 的 `DEFAULT_GROUP_ICONS`、`MockSolution.duration`。
- Produces: `UpsertSolutionDto.duration?: { en: string; zh: string }`；`UpsertGroupDto.icon?: string`；DB 列 `solutions.duration JSONB NULL`、`product_groups.icon TEXT NULL`。

- [ ] **Step 1: schema.prisma**

`Solution` 模型在 `summary Json` 行后加：

```prisma
  // 交付周期（可选；{en, zh}，空对象/空串前台不展示）
  duration    Json?
```

`ProductGroupEntity` 在 `nameJson Json @map("name_json")` 行后加：

```prisma
  icon      String?   // 门户首页分组图标（PORTAL_ICONS 白名单 name；空 → 代码内默认）
```

- [ ] **Step 2: 手写迁移 `api/prisma/migrations/20260903120000_group_icon_solution_duration/migration.sql`（生产走 `prisma migrate deploy`，与既有迁移一致）**

```sql
-- AlterTable
ALTER TABLE "product_groups" ADD COLUMN "icon" TEXT;

-- AlterTable
ALTER TABLE "solutions" ADD COLUMN "duration" JSONB;
```

- [ ] **Step 3: `solutions.dto.ts` 的 `UpsertSolutionDto` 在 `description` 字段后加**

```ts
  /** 交付周期 {en, zh}（可选） */
  @IsOptional()
  @IsObject()
  duration?: { en: string; zh: string };
```

- [ ] **Step 4: `solutions.service.ts`**

create 的 `data` 里在 `description: dto.description ?? { en: "", zh: "" },` 后加：

```ts
          ...(dto.duration !== undefined ? { duration: dto.duration } : {}),
```

update 的 `data` 里在 `...(dto.description !== undefined ? { description: dto.description } : {}),` 后加：

```ts
          ...(dto.duration !== undefined ? { duration: dto.duration } : {}),
```

- [ ] **Step 5: `taxonomy.dto.ts` 的 `UpsertGroupDto` 在 `nameJson` 后加**

```ts
  /** 门户首页分组图标（PORTAL_ICONS 白名单 name；空串=清除，回退默认） */
  @IsOptional()
  @IsString()
  icon?: string;
```

- [ ] **Step 6: `taxonomy.service.ts`**

createGroup 的 `data` 改为：

```ts
        data: { key: dto.key, nameJson: dto.nameJson, sort: dto.sort ?? 0, icon: dto.icon ?? null },
```

updateGroup 的 `data` 里在 `...(dto.sort !== undefined ? { sort: dto.sort } : {}),` 后加：

```ts
        ...(dto.icon !== undefined ? { icon: dto.icon || null } : {}),
```

- [ ] **Step 7: seed.js**

a) 顶部动态 import 的解构列表加 `DEFAULT_GROUP_ICONS`；
b) 大类 upsert 的 `create` 改为（update 保持 `{}` 不动，不覆盖后台已改图标）：

```js
      create: {
        key: group,
        nameJson: PRODUCT_GROUP_LABELS[group],
        sort: groupOrder,
        icon: DEFAULT_GROUP_ICONS[group] ?? null,
      },
```

c) 方案 data 加一行 `duration: s.duration ?? null,`；
d) **修正 seed 覆盖行为**（原注释声称"仅补缺不覆盖后台编辑"，但方案/案例实际 `update: data` 会覆盖）：方案的 `update: data` 改为 `update: {}`，案例同样改为 `update: {}`，与产品行为对齐。

- [ ] **Step 8: 验证**

Run: `pnpm --filter api exec prisma generate`（刷新 client 类型；若本地 DB 已起，再跑 `pnpm db:migrate` 应用迁移，未起则跳过并在汇报中注明）
Run: `pnpm --filter api type-check`（若 api 无 type-check script 则 `pnpm --filter api exec tsc --noEmit -p tsconfig.json`）
Expected: 通过。

---

### Task 3: portal——IconByName + 四处消费点 + messages

**Files:**

- Create: `apps/portal/components/ui/IconByName.tsx`
- Modify: `apps/portal/lib/taxonomy.ts`（TaxonomyGroup 14-19 行）
- Modify: `apps/portal/components/home/ProductEcosystem.tsx`（38、65-67 行）
- Modify: `apps/portal/app/[locale]/products/[slug]/page.tsx`（246-256 行）
- Modify: `apps/portal/app/[locale]/solutions/[slug]/page.tsx`（84-101、149-169 行，及顶部横幅区 46-56）
- Modify: `apps/portal/app/[locale]/cases/[slug]/page.tsx`（128-148 行）
- Modify: `apps/portal/messages/zh.json`、`apps/portal/messages/en.json`（solutions.detail 加 durationLabel）

**Interfaces:**

- Consumes: Task 1 的 `PortalIconName`/`normalizePainPoint`/`normalizeFeature`/`MockSolutionResult.icon`/`MockCaseResult.icon`/`MockSolution.duration`；Task 2 的 taxonomy `icon` 字段。
- Produces: `IconByName({ name?, fallback?, className? })`（Task 5 不依赖；admin 自己的 IconPicker 与其平行）。

- [ ] **Step 1: 创建 `apps/portal/components/ui/IconByName.tsx`**

```tsx
import {
  Activity,
  AlertTriangle,
  Award,
  BatteryCharging,
  Bot,
  Boxes,
  Building2,
  Car,
  ClipboardCheck,
  Clock,
  Cog,
  Coins,
  Container,
  Cpu,
  Factory,
  Gauge,
  Globe,
  Layers,
  Leaf,
  Monitor,
  Network,
  Package,
  PackageOpen,
  Pill,
  Quote,
  Radar,
  Rocket,
  Route,
  ScanLine,
  Shapes,
  ShieldCheck,
  Ship,
  ShoppingCart,
  Snowflake,
  Sparkles,
  Target,
  Timer,
  TrendingDown,
  TrendingUp,
  Truck,
  Users,
  Warehouse,
  Wifi,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { isPortalIconName, type PortalIconName } from "@hiwhale/shared/constants";

/** name → 组件映射（与 shared PORTAL_ICON_OPTIONS 一一对应；漏项会被 TS 报错） */
const ICONS: Record<PortalIconName, LucideIcon> = {
  truck: Truck,
  bot: Bot,
  cog: Cog,
  container: Container,
  sparkles: Sparkles,
  "package-open": PackageOpen,
  monitor: Monitor,
  shapes: Shapes,
  zap: Zap,
  "shield-check": ShieldCheck,
  radar: Radar,
  wifi: Wifi,
  clock: Clock,
  package: Package,
  quote: Quote,
  "alert-triangle": AlertTriangle,
  boxes: Boxes,
  network: Network,
  warehouse: Warehouse,
  factory: Factory,
  timer: Timer,
  "trending-up": TrendingUp,
  "trending-down": TrendingDown,
  coins: Coins,
  gauge: Gauge,
  "battery-charging": BatteryCharging,
  leaf: Leaf,
  snowflake: Snowflake,
  pill: Pill,
  car: Car,
  ship: Ship,
  "shopping-cart": ShoppingCart,
  "building-2": Building2,
  cpu: Cpu,
  "scan-line": ScanLine,
  route: Route,
  "clipboard-check": ClipboardCheck,
  users: Users,
  award: Award,
  target: Target,
  rocket: Rocket,
  wrench: Wrench,
  globe: Globe,
  activity: Activity,
  layers: Layers,
};

/**
 * 按白名单 name 渲染图标。
 * name 为空/未知 → 渲染 fallback（也未给 → 渲染 null，调用方版面需容忍无图标）。
 */
export function IconByName({
  name,
  fallback: Fallback,
  className,
}: {
  name?: string | null;
  fallback?: LucideIcon | null;
  className?: string;
}) {
  const Icon = (isPortalIconName(name) ? ICONS[name] : undefined) ?? Fallback ?? null;
  if (!Icon) return null;
  return <Icon className={className} aria-hidden="true" />;
}
```

若 lucide-react@1.31 缺某个导出（如 `ScanLine`/`Building2`），type-check 会报错——把该图标从 shared 白名单与本映射同步删除即可（保持一致）。

- [ ] **Step 2: `apps/portal/lib/taxonomy.ts` 的 `TaxonomyGroup` 加字段**

```ts
export type TaxonomyGroup = {
  key: string;
  nameJson: { en: string; zh: string };
  /** 首页产品生态分组图标（DB 可配；空 → 代码内默认） */
  icon?: string | null;
  sort?: number;
  categories: TaxonomyCategory[];
};
```

- [ ] **Step 3: `ProductEcosystem.tsx`**

a) import 区加 `import { IconByName } from "@/components/ui/IconByName";` 和 `import { DEFAULT_GROUP_ICONS } from "@hiwhale/shared/constants";`（删掉不再直接使用的 Shapes import 若变成未使用——保留下一步判断）。
b) 第 38 行 `const Icon = GROUP_ICONS[group.key as ProductGroup] ?? Shapes;` 改为：

```tsx
const fallbackIcon = GROUP_ICONS[group.key as ProductGroup] ?? Shapes;
```

c) 第 65-67 行的 `<Icon className="text-brand-blue h-5 w-5" />` 改为：

```tsx
<IconByName
  name={group.icon ?? DEFAULT_GROUP_ICONS[group.key]}
  fallback={fallbackIcon}
  className="text-brand-blue h-5 w-5"
/>
```

（DB 有 icon 用 DB；无则按大类 key 走 shared 默认名；再兜 GROUP_ICONS 组件映射与 Shapes。）

- [ ] **Step 4: 产品详情页特性图标**

`apps/portal/app/[locale]/products/[slug]/page.tsx`：
a) import 加 `import { IconByName } from "@/components/ui/IconByName";`，`@hiwhale/shared/constants` 的 import 加 `normalizeFeature`。
b) 246-256 行渲染块改为：

```tsx
{
  product.features.map((raw, index) => {
    const feature = normalizeFeature(raw);
    const fallbackIcon = FEATURE_ICONS[index % FEATURE_ICONS.length];
    return (
      <Reveal key={feature.text.en} delay={index * 80} className="h-full">
        <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6">
          <IconByName
            name={feature.icon}
            fallback={fallbackIcon}
            className="text-brand-blue h-6 w-6"
          />
          <p className="text-foreground mt-3 text-sm leading-relaxed">{feature.text[loc]}</p>
        </div>
      </Reveal>
    );
  });
}
```

- [ ] **Step 5: 方案详情页**

`apps/portal/app/[locale]/solutions/[slug]/page.tsx`：
a) import：`lucide-react` 行改为 `import { AlertTriangle, Clock } from "lucide-react";`；加 `import { IconByName } from "@/components/ui/IconByName";`；shared import 加 `normalizePainPoint`。
b) 顶部横幅（54 行 `<p ...>{solution.summary[loc]}</p>` 之后）加交付周期（仅当有值）：

```tsx
{
  solution.duration?.[loc]?.trim() ? (
    <div className="mt-6 flex items-center gap-2 text-sm text-white/80">
      <Clock className="h-4 w-4" />
      <span>
        {t("durationLabel")}: {solution.duration[loc]}
      </span>
    </div>
  ) : null;
}
```

c) 痛点卡（91-98 行）：

```tsx
{
  solution.painPoints.map((raw, index) => {
    const point = normalizePainPoint(raw);
    return (
      <Reveal key={point.text.en} delay={index * 80} className="h-full">
        <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6">
          <IconByName
            name={point.icon}
            fallback={AlertTriangle}
            className="text-brand-blue h-6 w-6"
          />
          <p className="text-foreground mt-3 text-sm leading-relaxed">{point.text[loc]}</p>
        </div>
      </Reveal>
    );
  });
}
```

d) 成效指标卡（156-166 行）在数值上方加可选图标：

```tsx
{
  solution.results.map((result) => (
    <div key={result.value} className="rounded-xl border border-slate-200 bg-white p-6 text-center">
      <IconByName name={result.icon} className="text-brand-blue mx-auto mb-2 h-6 w-6" />
      <span className="font-heading text-brand-blue text-3xl font-bold md:text-4xl">
        {result.value}
      </span>
      <div className="text-muted mt-2 text-sm">{result.label[loc]}</div>
    </div>
  ));
}
```

- [ ] **Step 6: 案例详情页指标图标**

`apps/portal/app/[locale]/cases/[slug]/page.tsx`：import 加 `IconByName`；135-145 行指标卡同样在 `<span>` 数值上方加：

```tsx
<IconByName name={result.icon} className="text-brand-blue mx-auto mb-2 h-6 w-6" />
```

（Clock/Package/Quote 三个版式图标保持全站统一写死，不做 per-case 配置——spec §2 已明确。）

- [ ] **Step 7: messages 同步**

`apps/portal/messages/zh.json` 的 `solutions.detail` 加 `"durationLabel": "交付周期",`；`apps/portal/messages/en.json` 同位置加 `"durationLabel": "Delivery Timeline",`。

- [ ] **Step 8: 验证**

Run: `pnpm --filter @hiwhale/shared build && pnpm --filter portal type-check && pnpm --filter portal lint`
Expected: 全绿。手工验证点：方案详情页出现交付周期行；痛点/特性/指标图标与现状一致（全部走回退）。

---

### Task 4: admin——IconPicker + 五个表单/页面接入

**Files:**

- Create: `apps/admin/components/ui/IconPicker.tsx`
- Modify: `apps/admin/lib/taxonomy.ts`（TaxonomyGroup 15-21 行）
- Modify: `apps/admin/app/(dashboard)/categories/page.tsx`（表单 state、group 弹窗 486-522、submitForm 约 274-283、编辑入口约 380-386）
- Modify: `apps/admin/store/solutions.ts`（在途修改版，见现状）
- Modify: `apps/admin/components/solutions/SolutionFormDialog.tsx`（在途修改版）
- Modify: `apps/admin/store/cases.ts`（在途修改版）
- Modify: `apps/admin/components/cases/CaseFormDialog.tsx`（在途修改版）
- Modify: `apps/admin/components/products/ProductForm.tsx`（zod schema 47 行、initial map 227、EMPTY 236、特性行 486-500、submit 约 301）

**Interfaces:**

- Consumes: Task 1 白名单；Task 2 API 字段。
- Produces: `IconPicker({ value?, onChange, disabled? })`，`onChange(name: string | undefined)`。

- [ ] **Step 1: 创建 `apps/admin/components/ui/IconPicker.tsx`**

组件映射表与 portal `IconByName.tsx` 完全相同（复制其 import 与 `ICONS`，漏项 TS 会拦）。组件：

```tsx
"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import {
  PORTAL_ICON_OPTIONS,
  isPortalIconName,
  type PortalIconName,
} from "@hiwhale/shared/constants";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// ……（import 与 ICONS 映射同 portal IconByName，逐字复制）

/** 图标选择器：网格弹窗；value 为空表示"默认"（前台回退内置图标） */
export function IconPicker({
  value,
  onChange,
  disabled,
}: {
  value?: string;
  onChange: (name: string | undefined) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const Selected = isPortalIconName(value) ? ICONS[value] : undefined;

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        {Selected ? (
          <>
            <Selected className="h-4 w-4" />
            {PORTAL_ICON_OPTIONS.find((o) => o.name === value)?.zh ?? value}
          </>
        ) : (
          "默认图标"
        )}
      </Button>
      {Selected && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="恢复默认"
          onClick={() => onChange(undefined)}
        >
          <X className="h-4 w-4 text-slate-400" />
        </Button>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>选择图标</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {PORTAL_ICON_OPTIONS.map((opt) => {
              const Icon = ICONS[opt.name as PortalIconName];
              const active = value === opt.name;
              return (
                <button
                  key={opt.name}
                  type="button"
                  onClick={() => {
                    onChange(opt.name);
                    setOpen(false);
                  }}
                  className={`flex flex-col items-center gap-1 rounded-lg border p-3 text-xs hover:border-blue-300 hover:bg-blue-50 ${
                    active ? "border-brand-blue bg-blue-50" : "border-slate-200"
                  }`}
                >
                  <span className="relative">
                    <Icon className="h-5 w-5 text-slate-700" />
                    {active && (
                      <Check className="text-brand-blue absolute -right-2 -top-2 h-3 w-3" />
                    )}
                  </span>
                  {opt.zh}
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

- [ ] **Step 2: `apps/admin/lib/taxonomy.ts` 的 `TaxonomyGroup` 加 `icon?: string | null;`（在 `nameJson` 后）**

- [ ] **Step 3: 品类管理页（categories/page.tsx）**

a) import 加 `import { IconPicker } from "@/components/ui/IconPicker";`。
b) 表单 state 类型（约 46 行附近，form 对象）加 `icon?: string`；`EMPTY_FORM` 加 `icon: undefined as string | undefined`（保持类型一致）。
c) 编辑入口（约 380-386 行 setForm）加 `icon: group.icon ?? undefined,`。
d) submitForm 的 group 分支 body 改为 `{ key, nameJson, sort: form.sort, icon: form.icon ?? "" }`。
e) 弹窗表单（486-522 行）在"排序"栅格 div 之后加（仅大类显示）：

```tsx
{
  form?.kind === "group" && (
    <div className="space-y-1.5">
      <Label>首页分组图标</Label>
      <IconPicker
        value={form?.icon}
        onChange={(name) => form && setForm({ ...form, icon: name })}
      />
      <p className="text-xs text-slate-500">用于门户首页「产品生态」分组卡片；默认 = 内置图标。</p>
    </div>
  );
}
```

- [ ] **Step 4: `store/solutions.ts`**

a) `AdminSolution` 加 `duration: Pair;`，`painPoints` 类型改为 `Array<Pair & { icon?: string }>`，`results` 类型改为 `Array<{ value: string; label: Pair; icon?: string }>`。
b) `ApiSolution` 加 `duration?: Pair;`，`painPoints` 改为 `Array<Pair | { text?: Pair; icon?: string }>`，`results` 加可选 icon：`Array<{ value: string; label: Pair; icon?: string }>`。
c) `toRow`：加 `duration: pairOf(s.duration)`（文件内新增 `pairOf` helper，同 store/cases.ts 第 46 行写法）；painPoints map 改为：

```ts
    painPoints: (s.painPoints ?? []).map((p) => {
      if (p && typeof p === "object" && "text" in p) {
        const obj = p as { text?: Pair; icon?: string };
        return { zh: obj.text?.zh ?? "", en: obj.text?.en ?? "", icon: obj.icon };
      }
      const pair = p as Pair;
      return { zh: pair?.zh ?? "", en: pair?.en ?? "" };
    }),
```

results map 加 icon 透传：`icon: r.icon`。
d) `saveSolution` 的 body：`duration: payload.duration` 加入；painPoints 改为写出新形状：

```ts
      duration: payload.duration,
      painPoints: payload.painPoints
        .filter((p) => p.zh.trim() || p.en.trim())
        .map((p) => ({ text: { zh: p.zh, en: p.en }, ...(p.icon ? { icon: p.icon } : {}) })),
      results: payload.results
        .filter((r) => r.value.trim() || r.label.zh.trim())
        .map((r) => ({ value: r.value, label: r.label, ...(r.icon ? { icon: r.icon } : {}) })),
```

- [ ] **Step 5: `SolutionFormDialog.tsx`**

a) import 加 `IconPicker`。
b) `EMPTY` 加 `duration: pair(),`；painPoints 元素类型 `Array<Pair & { icon?: string }>`（`pair()` 返回值加 `as Pair & { icon?: string }` 处不需要——直接 `painPoints: [pair()] as Array<Pair & { icon?: string }>`）；results 元素加 `icon?: string`。
c) initial 填充（92-111 行）加 `duration: initial.duration,`，painPoints/process/results 按新类型透传（initial.painPoints 已是新形状）。
d) submit 校验后 payload 加 `duration: form.duration`。
e) 表单 UI："方案描述"块之后加交付周期：

```tsx
<div className="space-y-1.5">
  <Label>交付周期</Label>
  <PairInputs
    value={form.duration}
    onChange={(v) => set("duration", v)}
    placeholderZh="如：8-12 周"
    placeholderEn="e.g. 8-12 weeks"
  />
</div>
```

f) 痛点行（209-237 行）在 PairInputs 与删除按钮之间插 IconPicker：

```tsx
<IconPicker
  value={point.icon}
  onChange={(name) =>
    set(
      "painPoints",
      form.painPoints.map((p, i) => (i === index ? { ...p, icon: name } : p)),
    )
  }
/>
```

g) 成效指标行（315-359 行）在数值 Input 后同行插 IconPicker（更新 `results[i].icon`）；并在"成效指标（大数字卡片）"Label 行下加提示：

```tsx
<p className="text-xs text-slate-500">
  回本周期/ROI 作为一项指标在此维护（数值如 2.1 yrs，标签填「投资回收期 / Payback
  Period」）；图标留空则前台不显示图标。
</p>
```

- [ ] **Step 6: `store/cases.ts` + `CaseFormDialog.tsx`**

a) store：`AdminCase.results` / `ApiCase.results` 元素加 `icon?: string`；`toRow` 的 results map 加 `icon: r.icon`；`saveCase` body 的 results 改为：

```ts
      results: payload.results
        .filter((r) => r.value.trim() || r.label.zh.trim())
        .map((r) => ({ value: r.value, label: r.label, ...(r.icon ? { icon: r.icon } : {}) })),
```

b) 表单：成果数据行插 IconPicker（同方案 g 模式，更新 `results[i].icon`）；成果数据 Label 下加同样提示文案。
（案例交付周期字段已存在，不动。）

- [ ] **Step 7: `ProductForm.tsx`**

a) zod schema（47 行）改为：

```ts
  features: z.array(z.object({ zh: z.string(), en: z.string(), icon: z.string().optional() })),
```

b) initial map（227 行）：`features: initial.record.features.map((f) => ("text" in f ? { zh: f.text.zh, en: f.text.en, icon: f.icon } : { zh: f.zh, en: f.en })),`（兼容新旧形状；`initial.record.features` 元素类型来自 shared `LocalizedText | MockProductFeature`）
c) EMPTY（236 行）保持 `features: [{ zh: "", en: "" }]`（icon 可选无需改）。
d) submit（约 301 行）features 透传 icon：map 时 `...(f.icon ? { icon: f.icon } : {})`。
e) 特性行（486-500 行）在两个 Input 后加：

```tsx
<IconPicker
  value={watch(`features.${index}.icon`)}
  onChange={(name) => setValue(`features.${index}.icon`, name)}
/>
```

（`watch`/`setValue` 从现有 `useForm` 解构补上。）

- [ ] **Step 8: 验证**

Run: `pnpm --filter admin type-check && pnpm --filter admin lint`
Expected: 全绿。手工验证点：方案表单可见交付周期与图标选择；品类管理大类弹窗可见图标选择。

---

### Task 5: 首页行业卡片可配置（site_settings `home-industries`）

**Files:**

- Create: `apps/portal/components/home/types.ts`
- Modify: `apps/portal/app/[locale]/page.tsx`（16-44 行）
- Modify: `apps/portal/components/home/IndustrySolutions.tsx`
- Modify: `apps/portal/components/home/HeroNarrative.tsx`（props 40-46、59、319-345 行）
- Create: `apps/admin/components/content/HomeIndustriesTab.tsx`
- Modify: `apps/admin/app/(dashboard)/content/page.tsx`（TabsList 66-71、TabsContent 区）

**Interfaces:**

- Produces: `type HomeIndustryCard = { industry: string; solutionSlug?: string; description?: { en: string; zh: string }; painPoint?: { en: string; zh: string } }`（portal `components/home/types.ts`；admin 的 Tab 自定义同形本地类型，不跨 app 引用）。

- [ ] **Step 1: 创建 `apps/portal/components/home/types.ts`**

```ts
/** 首页行业卡片（site_settings["home-industries"] 值形状；数组顺序即展示顺序） */
export type HomeIndustryCard = {
  /** Industry 枚举 key 或自定义行业文本 */
  industry: string;
  /** 跳转方案详情 slug；空 → 链到 /solutions 列表 */
  solutionSlug?: string;
  /** 卡片描述；空且为核心行业 → 回退 messages 内置文案 */
  description?: { en: string; zh: string };
  /** 痛点 chip；空且为核心行业 → 回退 messages 内置文案 */
  painPoint?: { en: string; zh: string };
};
```

- [ ] **Step 2: `page.tsx`**

fetch 区改为：

```tsx
const [taxonomy, companyStats, homeIndustries] = await Promise.all([
  fetchTaxonomy(),
  fetchSetting<CompanyStatItem[]>("company-stats"),
  fetchSetting<HomeIndustryCard[]>("home-industries"),
]);
```

import 加 `import type { HomeIndustryCard } from "@/components/home/types";`。
`<HeroNarrative taxonomy={taxonomy} stats={companyStats} />` 改为加 prop `industryCards={homeIndustries}`；`<IndustrySolutions />` 改为 `<IndustrySolutions cards={homeIndustries} />`。

- [ ] **Step 3: `IndustrySolutions.tsx`**

a) 签名改为 `export function IndustrySolutions({ cards }: { cards?: HomeIndustryCard[] | null })`；import 加 `industryLabel`（替换或并存的 `getLocalizedLabel` 用法见下）、`Industry`、`HomeIndustryCard` 类型。
b) 渲染逻辑：函数体开头 `const override = cards && cards.length > 0 ? cards : null;`，`const loc = locale === "zh" ? ("zh" as const) : ("en" as const);`。
c) 现有 `industries.map(...)`（35-71 行）整体改为渲染 `override ?? CORE_INDUSTRIES.map((i) => ({ industry: i as string }))`，循环变量 `card`：

```tsx
{
  (override ?? CORE_INDUSTRIES.map((i) => ({ industry: i as string }))).map((card, index) => {
    const isCore = (CORE_INDUSTRIES as string[]).includes(card.industry);
    const name = industryLabel(card.industry, locale);
    const imageName =
      INDUSTRY_IMAGE_NAMES[card.industry as Industry] ?? `industry-${card.industry}.png`;
    const description =
      card.description?.[loc]?.trim() || (isCore ? t(`items.${card.industry}.description`) : "");
    const painPoint =
      card.painPoint?.[loc]?.trim() || (isCore ? t(`items.${card.industry}.painPoint`) : "");
    const href = card.solutionSlug ? `/solutions/${card.solutionSlug}` : "/solutions";
    return (
      <Reveal key={card.industry} delay={index * 80} className="h-full">
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg">
          <SlottedImage
            src={`/images/industries/${imageName}`}
            alt={name}
            className="aspect-video w-full object-cover"
            placeholder={{
              ratio: "aspect-video",
              className: "rounded-none border-0",
              label: `行业场景图：${name}`,
              size: t("imageSize"),
              name: imageName,
            }}
          />
          <div className="flex flex-1 flex-col p-6">
            <h3 className="font-heading text-foreground text-xl font-bold">{name}</h3>
            <p className="text-muted mt-2 flex-1 text-sm leading-relaxed">{description}</p>
            <div className="mt-4 flex items-center justify-between">
              {painPoint ? (
                <span className="rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700">
                  {painPoint}
                </span>
              ) : (
                <span />
              )}
              <Link href={href} className="text-brand-blue text-sm font-medium hover:underline">
                {t("viewSolution")} →
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    );
  });
}
```

（`isCore` 守卫必须保留：next-intl 对缺失 key 的 `t()` 会抛错，自定义行业禁止走 messages。）
d) `INDUSTRY_SOLUTION_SLUG` 映射删除（被 setting 的 solutionSlug 取代；无 setting 时核心行业链接需保留原行为——fallback 路径 href 用 `INDUSTRY_SOLUTION_SLUG`）：因此**不删**该映射，fallback 分支 href = `card.solutionSlug ? ... : INDUSTRY_SOLUTION_SLUG[card.industry as Industry] ? `/solutions/${...}` : "/solutions"`。统一为：

```tsx
const slug = card.solutionSlug ?? INDUSTRY_SOLUTION_SLUG[card.industry as Industry];
const href = slug ? `/solutions/${slug}` : "/solutions";
```

- [ ] **Step 4: `HeroNarrative.tsx`**

a) props 加 `industryCards?: HomeIndustryCard[] | null;`（与 taxonomy/stats 并列），import 类型。
b) 59 行 `const industries = CORE_INDUSTRIES;` 改为：

```tsx
// 第二幕场景卡片：后台「内容管理 → 首页行业」配置优先；未配置回退 6 个核心行业
const industries: Array<{ industry: string; painPoint?: { en: string; zh: string } }> =
  industryCards && industryCards.length > 0
    ? industryCards.slice(0, 6)
    : CORE_INDUSTRIES.map((i) => ({ industry: i as string }));
```

c) 场景卡片渲染（319-345 行）：`industries.map((industry) => ...` 改为 `industries.map((scene) => ...`，内部：

- `key={scene.industry}`；
- 图片 src/name/alt 用 `INDUSTRY_IMAGE_NAMES[scene.industry as Industry] ?? `industry-${scene.industry}.png`` 与 `industryLabel(scene.industry, locale)`（import `industryLabel`、`Industry`）；
- painPoint chip（340 行）改为：

```tsx
{
  (() => {
    const loc = locale === "zh" ? ("zh" as const) : ("en" as const);
    const isCore = (CORE_INDUSTRIES as string[]).includes(scene.industry);
    const pain =
      scene.painPoint?.[loc]?.trim() ||
      (isCore ? t(`industries.items.${scene.industry}.painPoint`) : "");
    return pain ? (
      <span className="mt-1 inline-block rounded-md bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
        {pain}
      </span>
    ) : null;
  })();
}
```

（同样保留 isCore 守卫防 next-intl 抛错。）

- [ ] **Step 5: 创建 `apps/admin/components/content/HomeIndustriesTab.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getLocalizedLabel, INDUSTRY_LABELS, Industry } from "@hiwhale/shared/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminApi } from "@/lib/api";

type Row = {
  industry: string;
  solutionSlug: string;
  descZh: string;
  descEn: string;
  painZh: string;
  painEn: string;
};

type SavedCard = {
  industry: string;
  solutionSlug?: string;
  description?: { en: string; zh: string };
  painPoint?: { en: string; zh: string };
};

const emptyRow = (): Row => {
  return { industry: "", solutionSlug: "", descZh: "", descEn: "", painZh: "", painEn: "" };
};

/** 首页行业卡片（site_settings["home-industries"]；portal 首页 HeroNarrative 第二幕 + 行业方案区消费） */
export function HomeIndustriesTab() {
  const [rows, setRows] = useState<Row[]>([]);
  const [solutionOptions, setSolutionOptions] = useState<Array<{ slug: string; zh: string }>>([]);

  useEffect(() => {
    adminApi<{ value: SavedCard[] | null }>("/api/settings/home-industries")
      .then((r) => {
        if (Array.isArray(r.value)) {
          setRows(
            r.value.map((c) => ({
              industry: c.industry ?? "",
              solutionSlug: c.solutionSlug ?? "",
              descZh: c.description?.zh ?? "",
              descEn: c.description?.en ?? "",
              painZh: c.painPoint?.zh ?? "",
              painEn: c.painPoint?.en ?? "",
            })),
          );
        }
      })
      .catch(() => {});
    adminApi<{ items: Array<{ slug: string; title: { zh: string } }> }>("/api/solutions")
      .then((r) => setSolutionOptions(r.items.map((s) => ({ slug: s.slug, zh: s.title.zh }))))
      .catch(() => {});
  }, []);

  const patch = (index: number, part: Partial<Row>) =>
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...part } : r)));

  const save = () => {
    const value: SavedCard[] = rows
      .filter((r) => r.industry.trim())
      .map((r) => ({
        industry: r.industry.trim(),
        ...(r.solutionSlug.trim() ? { solutionSlug: r.solutionSlug.trim() } : {}),
        description: { zh: r.descZh, en: r.descEn },
        painPoint: { zh: r.painZh, en: r.painEn },
      }));
    adminApi("/api/settings/home-industries", { method: "PUT", body: { value } })
      .then(() => toast.success("保存成功"))
      .catch((e) => toast.error(e instanceof Error ? e.message : "保存失败"));
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">首页行业卡片</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setRows((prev) => [...prev, emptyRow()])}
        >
          <Plus /> 添加卡片
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-slate-500">
          配置门户首页「行业解决方案」卡片区与 Hero 第二幕场景卡片，顺序即展示顺序（Hero 最多取前 6
          张）。行业可下拉选择或手输自定义文本；行业场景图仍在「素材管理 → 站点素材位 → 行业」按
          industry-行业.png 上传。无任何卡片时前台回退内置 6
          个核心行业；核心行业文案留空时回退内置双语文案。
        </p>
        {rows.map((row, index) => (
          <div key={index} className="space-y-2 rounded-lg border border-slate-100 p-3">
            <div className="flex items-center gap-2">
              <Input
                list="home-industry-options"
                placeholder="行业（可选可输，如 E_COMMERCE 或 新能源）"
                className="w-64"
                value={row.industry}
                onChange={(e) => patch(index, { industry: e.target.value })}
              />
              <datalist id="home-industry-options">
                {Object.values(Industry).map((ind) => (
                  <option key={ind} value={ind}>
                    {getLocalizedLabel(INDUSTRY_LABELS, ind, "zh")}
                  </option>
                ))}
              </datalist>
              <Input
                list="home-solution-options"
                placeholder="跳转方案 slug（可空）"
                value={row.solutionSlug}
                onChange={(e) => patch(index, { solutionSlug: e.target.value })}
              />
              <datalist id="home-solution-options">
                {solutionOptions.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.zh}
                  </option>
                ))}
              </datalist>
              <Button
                variant="ghost"
                size="icon"
                aria-label="删除卡片"
                className="ml-auto"
                onClick={() => setRows((prev) => prev.filter((_, i) => i !== index))}
              >
                <Trash2 className="h-4 w-4 text-slate-400" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="卡片描述（中文）"
                value={row.descZh}
                onChange={(e) => patch(index, { descZh: e.target.value })}
              />
              <Input
                placeholder="Description (EN)"
                value={row.descEn}
                onChange={(e) => patch(index, { descEn: e.target.value })}
              />
              <Input
                placeholder="痛点标签（中文），如：大促爆单"
                value={row.painZh}
                onChange={(e) => patch(index, { painZh: e.target.value })}
              />
              <Input
                placeholder="Pain point (EN)"
                value={row.painEn}
                onChange={(e) => patch(index, { painEn: e.target.value })}
              />
            </div>
          </div>
        ))}
        <div>
          <Label className="sr-only">保存</Label>
          <Button className="bg-brand-blue hover:bg-brand-blue/90" onClick={save}>
            <Save /> 保存
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 6: content/page.tsx 接入**

import 加 `import { HomeIndustriesTab } from "@/components/content/HomeIndustriesTab";`；TabsList 加 `<TabsTrigger value="homeIndustries">首页行业</TabsTrigger>`；在 stats 的 TabsContent 后加：

```tsx
<TabsContent value="homeIndustries" className="mt-4">
  <HomeIndustriesTab />
</TabsContent>
```

- [ ] **Step 7: 验证**

Run: `pnpm --filter portal type-check && pnpm --filter admin type-check`
Expected: 全绿。手工验证点：后台保存 1 张自定义行业卡片 → 首页对应区出现；清空保存空数组 → 回退内置 6 行业。

---

### Task 6: 总验证 + 文档

**Files:**

- Modify: `AGENTS.md`（进度节追加）

- [ ] **Step 1: 全量校验（确认 dev server 未运行或只跑以下三项）**

Run: `pnpm format && pnpm lint && pnpm type-check`（仓库根目录）
Expected: 全绿。若红，回到对应任务修复。

- [ ] **Step 2: 若本地基础设施可用，跑迁移 + seed 验证**

Run: `pnpm dev:setup && pnpm db:migrate && pnpm db:seed`
Expected: 迁移应用成功；seed 不报错；DB 中 `product_groups.icon` 有默认值、`solutions.duration` 为 NULL（旧数据）。

- [ ] **Step 3: AGENTS.md 进度节追加一行**

```markdown
后台全量内容管理（2026-09-03）：Solution.duration 字段（对齐案例交付周期）；图标体系上线（shared PORTAL_ICON_OPTIONS 白名单 + portal IconByName + admin IconPicker，挂接：产品大类 icon 列/方案痛点/产品特性/案例与方案指标，全部可回退默认）；首页行业卡片走 site_settings["home-industries"]（内容管理新 Tab，HeroNarrative 第二幕 + IndustrySolutions 消费，核心行业文案/映射作回退）；seed 方案/案例 upsert 改为仅补缺（不再覆盖后台编辑）。
```

- [ ] **Step 4: 向用户汇报**

汇总改动清单 + 手工验证清单（见下），并提醒：git 提交由用户自行进行；生产部署经 `deploy.sh` 的 migrate 服务自动应用新迁移。

**手工验证清单（汇报给用户）：**

1. 后台方案编辑：填交付周期、给痛点/指标选图标 → 门户方案详情生效；清空 → 回退。
2. 后台案例编辑：给成果数据选图标 → 案例详情指标卡生效。
3. 品类管理：改大类图标 → 首页产品生态区生效。
4. 产品表单：给特性选图标 → 产品详情特性卡生效（不选 = 原按下标循环）。
5. 内容管理 → 首页行业：加/改卡片 → 首页两处生效；空数组 → 内置 6 行业。
6. 回本周期：在案例「成果数据」/方案「成效指标」中以一行指标维护（已有提示文案）。

---

## Self-Review 记录

- Spec 覆盖：§1 图标体系→Task 1/3/4；§2 四个挂接点→Task 2（大类 icon 列）/3/4；§3 方案交付周期→Task 2/3/4；§4 首页行业→Task 5；§5 提示文案→Task 4 Step 5g/6b；§6 不做的项未混入。seed 行为核对→Task 2 Step 7d。
- 类型一致性：`PortalIconName`/`normalizePainPoint`/`normalizeFeature`/`HomeIndustryCard`/`IconByName`/`IconPicker` 签名在 Tasks 1/3/4/5 间一致；portal 与 admin 各自的 ICONS 映射以 `Record<PortalIconName, LucideIcon>` 约束防漂移。
- 已知风险：lucide-react@1.31 个别图标导出可能缺失→Task 3 Step 1 给了处置方式；在途 dirty 文件的行号以当前工作区为准，实现时先 Read 再 Edit。
