# 后台体验增强（预览/图标上传/导航分组）实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 后台编辑案例/产品时实时预览近似前台布局；图标支持管理员上传自定义文件；侧边栏改一级类目+下拉二级索引。

**Architecture:** 预览 = admin 侧纯展示组件直接消费表单实时 state（案例 useState / 产品 RHF watch），仿门户布局但跨 app 不可复用组件、仅近似；图标 URL 化复用既有 `POST /api/uploads?kind=image`（零 API 改动），icon 字段值扩展为"白名单 name 或 URL"双形态；侧边栏扁平数组改分组 + 折叠 + localStorage 持久。

**Tech Stack:** Next.js 14（admin/portal）、react-hook-form + zod、shadcn/ui、lucide-react、zustand。

**Spec:** `docs/superpowers/specs/2026-09-03-admin-preview-icon-upload-nav-design.md`

## Global Constraints

- **禁止任何 git 提交/变更命令**；改动留在工作区。
- 禁止 `pnpm build`；验证 = `pnpm lint` + `pnpm type-check`（必要时先 `pnpm --filter @hiwhale/shared build`——本计划不动 shared）。
- **4 个在途基线文件禁止回退**：`apps/admin/components/cases/CaseFormDialog.tsx`、`apps/admin/components/solutions/SolutionFormDialog.tsx`、`apps/admin/store/cases.ts`、`apps/admin/store/solutions.ts`（含上一功能已加的 IconPicker/duration 增量）。
- admin 纯中文 UI；门户不引入新依赖；图标白名单契约 `PORTAL_ICON_OPTIONS`/`isPortalIconName` 不变。
- 图标双形态判别规则（两端一致）：`isPortalIconName(v)` → lucide；否则 `v.startsWith("http") || v.startsWith("/")` → `<img>`；否则 → fallback。
- 无测试框架；每任务验证 = admin/portal type-check + lint 全绿。
- 本项目无单元测试；不要新增测试脚手架。

---

### Task 1: 图标自定义上传（IconGlyph + IconPicker 上传 + portal IconByName URL 形态）

**Files:**
- Create: `apps/admin/components/ui/IconGlyph.tsx`
- Modify: `apps/admin/components/ui/IconPicker.tsx`（现含内部 ICONS 映射，Task 4 上一功能所建）
- Modify: `apps/portal/components/ui/IconByName.tsx`

**Interfaces:**
- Produces:
  - `IconGlyph({ value?: string | null; fallback?: LucideIcon | null; className?: string })`（admin 侧统一图标渲染：白名单 lucide / URL img / fallback / null）
  - `ICONS: Record<PortalIconName, LucideIcon>` 从 IconGlyph.tsx 导出（IconPicker 改为从此 import）
  - portal `IconByName` 新增 URL 形态支持（props 签名不变）

- [ ] **Step 1: 创建 `apps/admin/components/ui/IconGlyph.tsx`**

把 `apps/admin/components/ui/IconPicker.tsx` 里的 lucide import 块与 `ICONS` 映射**整体迁入**本文件并 export，再加渲染组件：

```tsx
"use client";

import { useState } from "react";
import { /* …从 IconPicker 迁入的 45 个 lucide import… */ type LucideIcon } from "lucide-react";
import { isPortalIconName, type PortalIconName } from "@hiwhale/shared/constants";

/** name → 组件映射（与 shared PORTAL_ICON_OPTIONS 一一对应；漏项 TS 报错） */
export const ICONS: Record<PortalIconName, LucideIcon> = {
  // …从 IconPicker 逐字迁入…
};

/** 判断是否为自定义上传的图标 URL（/files 或 http 开头） */
export function isIconUrl(value: string): boolean {
  return value.startsWith("http") || value.startsWith("/");
}

/**
 * 统一图标渲染：白名单 name → lucide；URL → img；空/未知 → fallback（未给 → null）。
 */
export function IconGlyph({
  value,
  fallback: Fallback,
  className,
}: {
  value?: string | null;
  fallback?: LucideIcon | null;
  className?: string;
}) {
  const [imgError, setImgError] = useState(false);
  if (value && isPortalIconName(value)) {
    const Icon = ICONS[value];
    return <Icon className={className} aria-hidden="true" />;
  }
  if (value && isIconUrl(value) && !imgError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={value}
        alt=""
        aria-hidden="true"
        className={className}
        onError={() => setImgError(true)}
      />
    );
  }
  if (!Fallback) return null;
  return <Fallback className={className} aria-hidden="true" />;
}
```

- [ ] **Step 2: 改 `IconPicker.tsx`**

a) 删除内部 lucide import 与 ICONS 定义，改为 `import { ICONS, IconGlyph, isIconUrl } from "./IconGlyph";`（`isPortalIconName`、`PortalIconName`、`PORTAL_ICON_OPTIONS` 仍从 shared import）。
b) 触发按钮的选中展示改为：

```tsx
        {value ? (
          <>
            <IconGlyph value={value} className="h-4 w-4" />
            {isPortalIconName(value)
              ? (PORTAL_ICON_OPTIONS.find((o) => o.name === value)?.zh ?? value)
              : "自定义图标"}
          </>
        ) : (
          "默认图标"
        )}
```

（原 `Selected` 变量逻辑删除；清除按钮条件从 `Selected` 改为 `value`。）
c) 弹窗网格 `</div>` 之后、`</DialogContent>` 之前加上传区：

```tsx
          <div className="mt-4 border-t border-slate-100 pt-4">
            <p className="mb-2 text-xs font-medium text-slate-500">自定义图标（SVG/PNG/WebP）</p>
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" size="sm" disabled={uploading} asChild>
                <label className="cursor-pointer">
                  {uploading ? "上传中…" : "上传图标"}
                  <input
                    type="file"
                    accept=".svg,.png,.webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      if (file) void uploadIcon(file);
                    }}
                  />
                </label>
              </Button>
              {value && isIconUrl(value) && (
                <IconGlyph value={value} className="h-6 w-6" />
              )}
            </div>
          </div>
```

d) 组件内加状态与上传函数（token 取自 `useAdminAuthStore`，模式照抄 `ProductForm.tsx` 的 `uploadAsset`）：

```tsx
  const [uploading, setUploading] = useState(false);

  /** 上传自定义图标到 MinIO（复用 /api/uploads?kind=image，支持 svg/png/webp） */
  const uploadIcon = async (file: File) => {
    setUploading(true);
    try {
      const token = useAdminAuthStore.getState().token;
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/uploads?kind=image`,
        { method: "POST", headers: token ? { Authorization: `Bearer ${token}` } : {}, body: fd },
      );
      const data = (await res.json().catch(() => ({}))) as { url?: string; message?: string };
      if (!res.ok || !data.url) throw new Error(data.message ?? "上传失败");
      onChange(data.url);
      setOpen(false);
      toast.success("图标已上传");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "上传失败");
    } finally {
      setUploading(false);
    }
  };
```

需补 import：`toast`（sonner）、`useAdminAuthStore`（`@/store/auth`）。

- [ ] **Step 3: portal `IconByName.tsx` 加 URL 形态**

改为 client 组件并在 name 判处加 URL 分支：

```tsx
"use client";

import { useState } from "react";
// …原有 import 保留…

export function IconByName({
  name,
  fallback: Fallback,
  className,
}: {
  name?: string | null;
  fallback?: LucideIcon | null;
  className?: string;
}) {
  const [imgError, setImgError] = useState(false);
  const Icon = (isPortalIconName(name) ? ICONS[name] : undefined) ?? null;
  if (Icon) return <Icon className={className} aria-hidden="true" />;
  if (name && (name.startsWith("http") || name.startsWith("/")) && !imgError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={name}
        alt=""
        aria-hidden="true"
        className={className}
        onError={() => setImgError(true)}
      />
    );
  }
  if (!Fallback) return null;
  return <Fallback className={className} aria-hidden="true" />;
}
```

注意：加 `"use client"` 后检查所有消费点（Server Component 中渲染 client 组件是合法的，props 仅字符串/组件引用——`fallback` 是 lucide 组件引用，属函数，**不能从 Server Component 传给 Client Component**！）。处置：`fallback` 改为传 **name 字符串**而非组件——
- 签名改为 `{ name?: string | null; fallbackName?: PortalIconName; className?: string }`，fallbackName 经 ICONS 解析。
- 消费点逐一调整（均在 portal）：
  - `ProductEcosystem.tsx`：`fallback={fallbackIcon}` → `fallbackName={...}`；原 `GROUP_ICONS` 组件映射改为直接使用 shared `DEFAULT_GROUP_ICONS` 名称映射 + 未知回退 `"shapes"`，即删除本地 GROUP_ICONS/Shapes import，统一 `fallbackName={DEFAULT_GROUP_ICONS[group.key] ?? "shapes"}`，name 传 `group.icon`。
  - `products/[slug]/page.tsx`：FEATURE_ICONS 组件数组 → 名称数组 `["zap", "shield-check", "radar", "wifi"] as const`，`fallbackName={FEATURE_ICON_NAMES[index % 4]}`。
  - `solutions/[slug]/page.tsx`：`fallbackName="alert-triangle"`（删除 AlertTriangle import；Clock 仍直接用 lucide 组件，保留）。
  - `cases/[slug]/page.tsx`：指标 `<IconByName name={result.icon}>` 无 fallback，不动。
- [ ] **Step 4: 验证**

Run: `pnpm --filter portal type-check && pnpm --filter admin type-check && pnpm --filter portal lint && pnpm --filter admin lint`
Expected: 全绿。手工点：IconPicker 弹窗出现上传区；上传 SVG 后按钮显示"自定义图标"。

---

### Task 2: 侧边栏二级分组

**Files:**
- Modify: `apps/admin/components/layout/Sidebar.tsx`（全文 75 行，扁平 NAV_ITEMS）

**Interfaces:**
- Produces: `NAV_GROUPS` 结构（组 key/label/icon/items）；行为：当前路由所在组默认展开，其余收起；localStorage key `admin-nav-expanded`。

- [ ] **Step 1: 重写 Sidebar.tsx**

```tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Bot,
  ChevronDown,
  FileText,
  FolderOpen,
  FolderTree,
  Images,
  Inbox,
  Layers,
  LayoutDashboard,
  MessageSquareText,
  MonitorCog,
  Package,
  Settings,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: LucideIcon };
type NavGroup = { key: string; label: string; icon: LucideIcon; items: NavItem[] };

/** 一级类目 → 二级条目（顺序即展示顺序） */
export const NAV_GROUPS: NavGroup[] = [
  {
    key: "overview",
    label: "总览",
    icon: LayoutDashboard,
    items: [{ href: "/dashboard", label: "仪表盘", icon: LayoutDashboard }],
  },
  {
    key: "site",
    label: "门户内容",
    icon: FileText,
    items: [
      { href: "/products", label: "产品管理", icon: Package },
      { href: "/categories", label: "品类管理", icon: FolderTree },
      { href: "/media", label: "素材管理", icon: Images },
      { href: "/solutions", label: "方案管理", icon: Layers },
      { href: "/cases", label: "案例管理", icon: FolderOpen },
      { href: "/content", label: "内容管理", icon: FileText },
    ],
  },
  {
    key: "crm",
    label: "线索与客户",
    icon: Inbox,
    items: [
      { href: "/inquiries", label: "询盘管理", icon: Inbox },
      { href: "/users", label: "用户管理", icon: Users },
    ],
  },
  {
    key: "ai",
    label: "AI",
    icon: Bot,
    items: [
      { href: "/chat-logs", label: "AI 对话记录", icon: MessageSquareText },
      { href: "/knowledge-base", label: "AI 知识库", icon: BookOpen },
      { href: "/ai-settings", label: "AI 设置", icon: Bot },
    ],
  },
  {
    key: "system",
    label: "系统",
    icon: MonitorCog,
    items: [
      { href: "/staff", label: "员工管理", icon: UserCog },
      { href: "/settings", label: "系统设置", icon: Settings },
    ],
  },
];

const STORAGE_KEY = "admin-nav-expanded";

/** 左侧固定导航栏（一级类目 + 下拉二级条目；展开状态持久化到 localStorage） */
export function Sidebar() {
  const pathname = usePathname();
  const activeGroupKey =
    NAV_GROUPS.find((g) =>
      g.items.some((i) => pathname === i.href || pathname.startsWith(`${i.href}/`)),
    )?.key ?? "overview";
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set([activeGroupKey]));

  // 挂载后读取持久化的展开状态（SSR 安全）
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const arr = JSON.parse(raw) as string[];
        setExpanded(new Set([...arr, activeGroupKey]));
      }
    } catch {
      // 忽略损坏的本地数据
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (key: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        // 隐私模式等场景忽略
      }
      return next;
    });

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-5 py-5">
        <div className="text-xl font-bold tracking-tight">
          <span className="text-amber-500">Hi</span>
          <span className="text-brand-navy">Whale Robotics</span>
        </div>
        <div className="mt-0.5 text-xs text-slate-500">管理后台</div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => {
          const isOpen = expanded.has(group.key);
          const groupActive = group.key === activeGroupKey;
          return (
            <div key={group.key}>
              <button
                type="button"
                onClick={() => toggle(group.key)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  groupActive
                    ? "text-brand-blue bg-blue-50 font-medium"
                    : "text-slate-600 hover:bg-slate-50",
                )}
              >
                <group.icon className="h-4 w-4" />
                {group.label}
                <ChevronDown
                  className={cn(
                    "ml-auto h-3.5 w-3.5 transition-transform",
                    isOpen ? "rotate-0" : "-rotate-90",
                  )}
                />
              </button>
              {isOpen && (
                <div className="mt-0.5 space-y-0.5">
                  {group.items.map((item) => {
                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg py-2 pl-9 pr-3 text-[13px] transition-colors",
                          active
                            ? "text-brand-blue bg-blue-50 font-medium"
                            : "text-slate-500 hover:bg-slate-50",
                        )}
                      >
                        <item.icon className="h-3.5 w-3.5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
```

注：`MonitorCog` 若 lucide 版本没有，换 `Settings` 组图标用 `Wrench`——type-check 会拦。

- [ ] **Step 2: 验证**

Run: `pnpm --filter admin type-check && pnpm --filter admin lint`
Expected: 全绿。手工点：五个组渲染；点 header 折叠/展开；刷新后保持；当前页所在组自动展开且高亮。

---

### Task 3: 案例表单实时预览

**Files:**
- Create: `apps/admin/components/cases/CasePreview.tsx`
- Modify: `apps/admin/components/cases/CaseFormDialog.tsx`（DialogContent 现约 167 行 `max-h-[85vh] max-w-3xl overflow-y-auto`；表单 state 为 `form`（EMPTY 形状，clientName/industry/project/background/challenge/solution/duration/equipment/results/quote/author/role/products，Pair={zh,en}））

**Interfaces:**
- Consumes: Task 1 的 `IconGlyph`。
- Produces: `CasePreview({ form, industryLabel }: { form: CaseFormState; ... })`——实际签名以 EMPTY 的 `typeof` 推导：预览组件定义 `type CasePreviewData = { clientName: Pair; industry: string; project: Pair; background: Pair; challenge: Pair; solution: Pair; duration: Pair; equipment: Pair[]; results: Array<{ value: string; label: Pair; icon?: string }>; quote: Pair; author: Pair; role: Pair }`。

- [ ] **Step 1: 创建 `apps/admin/components/cases/CasePreview.tsx`**

```tsx
"use client";

import { useState } from "react";
import { Clock, Package, Quote } from "lucide-react";
import { getLocalizedLabel, INDUSTRY_LABELS, type Industry } from "@hiwhale/shared/constants";
import { IconGlyph } from "@/components/ui/IconGlyph";
import { cn } from "@/lib/utils";

type Pair = { zh: string; en: string };

export type CasePreviewData = {
  clientName: Pair;
  industry: string;
  project: Pair;
  background: Pair;
  challenge: Pair;
  solution: Pair;
  duration: Pair;
  equipment: Pair[];
  results: Array<{ value: string; label: Pair; icon?: string }>;
  quote: Pair;
  author: Pair;
  role: Pair;
};

/** 案例详情近似预览（仿门户布局的示意渲染，非像素级还原；数据随表单实时变化） */
export function CasePreview({ data }: { data: CasePreviewData }) {
  const [lang, setLang] = useState<"zh" | "en">("zh");
  const pick = (p: Pair) => p[lang] || p[lang === "zh" ? "en" : "zh"] || "—";
  const industryLabel =
    data.industry in INDUSTRY_LABELS
      ? getLocalizedLabel(INDUSTRY_LABELS, data.industry as Industry, lang)
      : data.industry || "—";
  const results = data.results.filter((r) => r.value.trim() || r.label.zh.trim());
  const equipment = data.equipment.filter((e) => e.zh.trim() || e.en.trim());

  return (
    <div className="space-y-4 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">预览（近似门户案例详情页）</span>
        <div className="flex gap-1">
          {(["zh", "en"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={cn(
                "rounded px-2 py-0.5 text-xs",
                lang === l ? "bg-brand-blue text-white" : "bg-slate-100 text-slate-500",
              )}
            >
              {l === "zh" ? "中文" : "EN"}
            </button>
          ))}
        </div>
      </div>

      {/* 头部 */}
      <div className="rounded-lg border border-slate-200 p-4">
        <span className="inline-block rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
          {industryLabel}
        </span>
        <div className="mt-2 text-lg font-bold text-slate-900">{pick(data.project)}</div>
        <div className="text-xs text-slate-500">{pick(data.clientName)}</div>
      </div>

      {/* 背景 / 挑战 / 方案 */}
      <div className="grid grid-cols-3 gap-2">
        {(
          [
            ["项目背景", data.background],
            ["挑战", data.challenge],
            ["解决方案", data.solution],
          ] as const
        ).map(([title, p]) => (
          <div key={title} className="rounded-lg border border-slate-200 p-2.5">
            <div className="text-xs font-bold text-slate-700">{title}</div>
            <div className="mt-1 line-clamp-4 text-xs text-slate-500">{pick(p)}</div>
          </div>
        ))}
      </div>

      {/* 设备 + 交付周期 */}
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2 rounded-lg border border-slate-200 p-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Package className="h-3.5 w-3.5 text-blue-600" /> 投入设备
          </div>
          <ul className="mt-2 space-y-1">
            {equipment.length === 0 && <li className="text-xs text-slate-400">—</li>}
            {equipment.map((e, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-slate-500">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-blue-600" />
                {pick(e)}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border border-slate-200 p-3 text-center">
          <Clock className="h-5 w-5 text-blue-600" />
          <div className="mt-1 text-base font-bold text-blue-700">{pick(data.duration)}</div>
          <div className="text-xs text-slate-400">交付周期</div>
        </div>
      </div>

      {/* 成果指标 */}
      {results.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {results.map((r, i) => (
            <div key={i} className="rounded-lg border border-slate-200 p-2.5 text-center">
              <IconGlyph value={r.icon} className="mx-auto mb-1 h-4 w-4 text-blue-600" />
              <div className="text-sm font-bold text-blue-700">{r.value || "—"}</div>
              <div className="mt-0.5 text-xs text-slate-400">{pick(r.label)}</div>
            </div>
          ))}
        </div>
      )}

      {/* 客户证言 */}
      <div className="rounded-lg border border-slate-200 p-3">
        <Quote className="h-4 w-4 text-blue-600" />
        <p className="mt-1 text-xs text-slate-600">{pick(data.quote)}</p>
        <div className="mt-2 text-xs">
          <span className="font-medium text-slate-700">{pick(data.author)}</span>
          <span className="ml-2 text-slate-400">{pick(data.role)}</span>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: CaseFormDialog 双栏改造**

a) `DialogContent` 行改为：

```tsx
      <DialogContent className="flex max-h-[85vh] max-w-6xl flex-col overflow-hidden">
```

b) 原 `<div className="space-y-4">`（表单区，DialogHeader 之后）改为双栏布局：

```tsx
        <div className="grid min-h-0 flex-1 grid-cols-2 gap-6">
          <div className="space-y-4 overflow-y-auto pr-2">
            …现有全部表单字段原样保留…
          </div>
          <div className="overflow-y-auto rounded-lg bg-slate-50 p-4">
            <CasePreview data={form} />
          </div>
        </div>
```

c) import 加 `import { CasePreview } from "./CasePreview";`。`form` 的形状（`typeof EMPTY`）与 `CasePreviewData` 结构兼容（products 字段多余不影响——TS 结构类型允许超集；若报类型错，在 CasePreview props 用 `data: CasePreviewData` 而调用处 `data={form}` 可直接通过，因为 EMPTY 含全部必需字段）。

- [ ] **Step 3: 验证**

Run: `pnpm --filter admin type-check && pnpm --filter admin lint`
Expected: 全绿。手工点：新增/编辑案例弹窗右侧实时预览，输入即变；中/EN 切换；指标图标随 IconPicker 选择即时出现在预览。

---

### Task 4: 产品表单实时预览

**Files:**
- Create: `apps/admin/components/products/ProductPreview.tsx`
- Modify: `apps/admin/components/products/ProductForm.tsx`（`<form onSubmit={...} className="space-y-6">` 约 339 行；`watch` 已从 useForm 解构；`images: string[]`、`tagline`、`description`、`scenarios` 为组件内 state——实现时先 Read 确认名称）
- Modify: `apps/admin/app/(dashboard)/products/new/page.tsx`、`apps/admin/app/(dashboard)/products/[id]/page.tsx`（容器 `max-w-3xl` → `max-w-7xl`）

**Interfaces:**
- Consumes: Task 1 的 `IconGlyph`。
- Produces: `ProductPreview({ data }: { data: ProductPreviewData })`；`ProductPreviewData = { nameZh: string; nameEn: string; model: string; category: string; tagline: Pair; description: Pair; quickSpecs: Array<{ labelZh: string; labelEn: string; valueZh: string; valueEn: string }>; features: Array<{ zh: string; en: string; icon?: string }>; images: string[] }`。

- [ ] **Step 1: 创建 `apps/admin/components/products/ProductPreview.tsx`**

```tsx
"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import { PRODUCT_CATEGORY_LABELS, getLocalizedLabel } from "@hiwhale/shared/constants";
import { IconGlyph } from "@/components/ui/IconGlyph";
import { cn } from "@/lib/utils";

type Pair = { zh: string; en: string };

export type ProductPreviewData = {
  nameZh: string;
  nameEn: string;
  model: string;
  category: string;
  tagline: Pair;
  description: Pair;
  quickSpecs: Array<{ labelZh: string; labelEn: string; valueZh: string; valueEn: string }>;
  features: Array<{ zh: string; en: string; icon?: string }>;
  images: string[];
};

const FEATURE_ICON_FALLBACKS = ["zap", "shield-check", "radar", "wifi"] as const;

/** 产品详情近似预览（仿门户布局的示意渲染，非像素级还原；数据随表单实时变化） */
export function ProductPreview({ data }: { data: ProductPreviewData }) {
  const [lang, setLang] = useState<"zh" | "en">("zh");
  const zh = lang === "zh";
  const categoryLabel =
    data.category in PRODUCT_CATEGORY_LABELS
      ? getLocalizedLabel(PRODUCT_CATEGORY_LABELS, data.category, lang)
      : data.category || "—";
  const specs = data.quickSpecs.filter((s) => s.labelZh.trim() && s.valueZh.trim());
  const features = data.features.filter((f) => f.zh.trim() || f.en.trim());

  return (
    <div className="space-y-4 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">预览（近似门户产品详情页）</span>
        <div className="flex gap-1">
          {(["zh", "en"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={cn(
                "rounded px-2 py-0.5 text-xs",
                lang === l ? "bg-brand-blue text-white" : "bg-slate-100 text-slate-500",
              )}
            >
              {l === "zh" ? "中文" : "EN"}
            </button>
          ))}
        </div>
      </div>

      {/* 头部：徽章 + 名称 + 型号 + 卖点 */}
      <div className="rounded-lg border border-slate-200 p-4">
        <span className="inline-block rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
          {categoryLabel}
        </span>
        <div className="mt-2 text-lg font-bold text-slate-900">
          {(zh ? data.nameZh : data.nameEn) || data.nameZh || "—"}
        </div>
        <div className="text-xs text-slate-400">{data.model || "—"}</div>
        <p className="mt-1 text-xs text-slate-500">
          {(zh ? data.tagline.zh : data.tagline.en) || data.tagline.zh || "—"}
        </p>
      </div>

      {/* 主图 */}
      {data.images[0] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={data.images[0]}
          alt="产品主图"
          className="aspect-video w-full rounded-lg border border-slate-200 object-cover"
        />
      ) : (
        <div className="flex aspect-video w-full flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 text-slate-300">
          <ImageOff className="h-8 w-8" />
          <span className="mt-1 text-xs">未上传产品图</span>
        </div>
      )}

      {/* 核心参数 */}
      {specs.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {specs.slice(0, 6).map((s, i) => (
            <div key={i} className="rounded-lg border border-slate-200 p-2 text-center">
              <div className="text-sm font-bold text-slate-900">
                {(zh ? s.valueZh : s.valueEn) || s.valueZh}
              </div>
              <div className="mt-0.5 text-xs text-slate-400">
                {(zh ? s.labelZh : s.labelEn) || s.labelZh}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 核心特性 */}
      {features.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {features.map((f, i) => (
            <div key={i} className="rounded-lg border border-slate-200 p-2.5">
              <IconGlyph
                value={f.icon}
                fallback={undefined}
                className="h-4 w-4 text-blue-600"
              />
              {!f.icon && (
                <IconGlyph
                  value={FEATURE_ICON_FALLBACKS[i % FEATURE_ICON_FALLBACKS.length]}
                  className="h-4 w-4 text-blue-600 -mt-4"
                />
              )}
              <p className="mt-1 text-xs text-slate-600">{(zh ? f.zh : f.en) || f.zh}</p>
            </div>
          ))}
        </div>
      )}

      {/* 描述 */}
      <div className="rounded-lg border border-slate-200 p-3">
        <div className="text-xs font-bold text-slate-700">产品描述</div>
        <p className="mt-1 line-clamp-6 text-xs text-slate-500">
          {(zh ? data.description.zh : data.description.en) || data.description.zh || "—"}
        </p>
      </div>
    </div>
  );
}
```

注：特性图标回退用上面的双 IconGlyph 写法较绕——允许实现者简化为单个 `<IconGlyph value={f.icon ?? FEATURE_ICON_FALLBACKS[i % 4]} … />`（`??` 即可，空串需 `||`：`f.icon || FEATURE_ICON_FALLBACKS[i % 4]`）。

- [ ] **Step 2: ProductForm 双栏改造**

a) 先 Read 确认 state 名称（tagline/description/images/scenarios 的声明处）。
b) `<form ... className="space-y-6">` 改为双栏：

```tsx
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-5 gap-8">
      <div className="col-span-3 space-y-6">
        …现有表单内容原样…
      </div>
      <div className="col-span-2">
        <div className="sticky top-6 rounded-lg bg-slate-50 p-4">
          <ProductPreview data={previewData} />
        </div>
      </div>
    </form>
```

c) `previewData` 组装（`watch()` 无参返回全部表单值；放 return 前）：

```tsx
  const watched = watch();
  const previewData = {
    nameZh: watched.nameZh,
    nameEn: watched.nameEn,
    model: watched.model,
    category: watched.category,
    tagline,
    description,
    quickSpecs: watched.quickSpecs,
    features: watched.features,
    images,
  };
```

d) 两个页面容器 `max-w-3xl` → `max-w-7xl`。

- [ ] **Step 3: 验证**

Run: `pnpm --filter admin type-check && pnpm --filter admin lint`
Expected: 全绿。手工点：新增/编辑产品页右侧 sticky 预览随输入实时变化；上传图片后主图即时出现；中/EN 切换。

---

### Task 5: 总验证 + AGENTS.md

- [ ] **Step 1: 全量校验**

Run: `pnpm lint && pnpm type-check`（根目录）
Expected: 全绿。**不要跑 `pnpm format --write 全仓`**（上一功能已发现全仓 47 个既有文件不过 prettier，会产生无关 churn）；只对本计划触及的文件跑 `pnpm exec prettier --check <files>`，如需格式化用 `--write` 指定这些文件。

- [ ] **Step 2: AGENTS.md 进度节追加一行**

```markdown
后台体验增强（2026-09-03）：案例/产品编辑实时预览（admin 侧近似门户布局的预览组件，随表单 state 实时渲染，中/EN 切换）；图标支持上传自定义文件（icon 字段双形态：白名单 name 或 MinIO URL，复用 /api/uploads kind=image，portal IconByName 与 admin IconGlyph 同步支持，IconByName 改 client 组件、fallback 改传 fallbackName）；后台侧边栏改一级类目+下拉二级（总览/门户内容/线索与客户/AI/系统，展开状态 localStorage 持久化）。
```

- [ ] **Step 3: 汇报手工验证清单**（预览实时性、图标上传端到端、导航分组交互）

---

## Self-Review 记录

- Spec 覆盖：§1 预览→Task 3/4；§2 图标上传→Task 1；§3 导航→Task 2；验证与 AGENTS→Task 5。
- 类型一致性：`IconGlyph`/`isIconUrl`/`ICONS`（Task 1）被 Task 3/4 消费；`fallbackName` 改签名后 portal 四个消费点已在 Task 1 Step 3 逐一列出；`CasePreviewData`/`ProductPreviewData` 与两个表单实际 state 形状对齐（EMPTY/FormValues 已核对）。
- 风险：IconByName 转 client 组件的 fallback 组件引用不可跨 RSC 边界→已改为 fallbackName 名称方案；Sidebar `MonitorCog` 版本兼容→Step 1 已注处置。
