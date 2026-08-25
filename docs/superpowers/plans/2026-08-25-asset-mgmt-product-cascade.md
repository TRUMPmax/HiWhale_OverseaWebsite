# 素材管理改造 + 产品删除级联 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 后台素材管理支持重命名与全量素材位（静态+动态）上传；方案/案例改为真实产品 slug 关联，删除产品时级联清理。

**Architecture:** Prisma schema 迁移（Solution.equipment → productSlugs；CaseStudy 新增 productSlugs）→ API 层 DTO/service/级联清理 → admin 选择器改走实时 API + media 页改版 → portal 按 productSlugs 渲染并收敛图片白名单为 onError 回退 → Docker 命名卷共享 portal public/images。

**Tech Stack:** NestJS + Prisma（PostgreSQL）/ Next.js 14 App Router + zustand（admin）/ next-intl（portal）/ MinIO / Docker Compose。

**Spec:** `docs/superpowers/specs/2026-08-25-asset-management-and-product-cascade-design.md`

## Global Constraints

- 仓库根目录执行命令；校验用 `pnpm type-check` + `pnpm lint`（**dev server 运行期间禁止 `pnpm build`**，会清空 .next）。
- `@hiwhale/shared` 改动后必须 `pnpm --filter @hiwhale/shared build`（tsup → dist 被 apps 引用；此命令安全，不涉及 .next）。
- 本仓库**没有单元测试设施**（api/portal/admin 均无 test runner，AGENTS.md 约定校验 = format + lint + type-check）。每个任务的"测试"= type-check/lint + 给定的 curl/手动验证脚本。不要新增测试框架。
- 品牌约定：禁止 emoji，图标用 lucide；admin 纯中文 UI。
- mock 仅作 API 不可用时的回退（portal 与 admin 选择器均遵守）。
- 数据库操作前先确保基础设施已启动：`pnpm dev:setup`。
- 现有方案的品类关联数据**直接清空**（迁移即丢弃 `solutions.equipment` 列），用户重新关联。

## 关键类型/接口约定（跨任务契约）

- `Solution.productSlugs: String[]`（Prisma，`@map("product_slugs")`）；`CaseStudy.productSlugs: String[]`（同上）。
- API 出入参字段名均为 `productSlugs`（camelCase，Prisma 默认）。
- `MockSolution.productSlugs: string[]`（替代原 `equipment: ProductCategory[]`）；`MockCase.productSlugs: string[]`（新增，`equipment: LocalizedText[]` 自由文本保留）。
- 动态素材位 id：`solution-<slug>` / `case-<slug>` / `case-logo-<slug>`；文件分别为 `solutions/solution-<slug>.png`、`cases/case-<slug>.png`、`cases/case-logo-<slug>.png`（与 DB 默认 imageName/logoName 对齐）。
- 素材位 API 返回元素：`{ id, filename, subdir, area, purpose, exists, size }`（动态槽 area 为 "方案"/"案例"）。

---

### Task 1: Schema 迁移 + shared 类型/mock + seed + portal 详情页

**Files:**

- Modify: `api/prisma/schema.prisma`（Solution L208-227、CaseStudy L229-249）
- Modify: `packages/shared/src/constants/solutions/types.ts`
- Modify: `packages/shared/src/constants/solutions/{ecommerce-fulfillment,automotive-line-side,3pl-multi-client,cold-chain-automation,pharma-compliant-logistics,port-container-yard}.ts`
- Modify: `packages/shared/src/constants/cases/types.ts`
- Modify: `packages/shared/src/constants/cases/{globalecom-fulfillment,nordauto-line-side,swiftserve-multiclient,freshchain-cold,medipharma-gmp,harborlink-port}.ts`
- Modify: `api/prisma/seed.js`（L84-127）
- Modify: `apps/portal/app/[locale]/solutions/[slug]/page.tsx`
- Modify: `apps/portal/app/[locale]/cases/[slug]/page.tsx`

**Interfaces:**

- Consumes: 无（首个任务）。
- Produces: `MockSolution.productSlugs: string[]`、`MockCase.productSlugs: string[]`；DB 列 `solutions.product_slugs`、`case_studies.product_slugs`；portal 详情页按 slug 关联渲染。

- [ ] **Step 1: 修改 Prisma schema**

`api/prisma/schema.prisma` Solution 模型中，将：

```prisma
  // ProductCategory 枚举值数组
  equipment   String[]
```

替换为：

```prisma
  // 关联产品 slug 数组（真实产品引用，删除产品时级联清理）
  productSlugs String[]      @default([]) @map("product_slugs")
```

CaseStudy 模型中，在 `equipment   Json` 之后新增一行：

```prisma
  // 关联产品 slug 数组（门户"相关产品"区块数据源）
  productSlugs String[]      @default([]) @map("product_slugs")
```

- [ ] **Step 2: 执行迁移**

确保数据库已启动（`pnpm dev:setup`），然后：

```bash
cd api && pnpm exec prisma migrate dev --name product-slug-associations
```

Expected: 迁移成功，提示 `solutions.equipment` 列被删除（数据丢失警告，确认继续）。

- [ ] **Step 3: 改 shared 方案类型**

`packages/shared/src/constants/solutions/types.ts` 全文替换为：

```ts
import type { LocalizedText } from "../products/types";

export type MockSolutionStep = {
  title: LocalizedText;
  description: LocalizedText;
};

export type MockSolutionResult = {
  value: string;
  label: LocalizedText;
};

/** 行业方案类型（与 API Solution 形状一致） */
export type MockSolution = {
  slug: string;
  /** 行业：内置 Industry 枚举 key，或管理后台手输的自定义行业文本 */
  industry: string;
  title: LocalizedText;
  summary: LocalizedText;
  description: LocalizedText;
  /** 行业痛点，4 条 */
  painPoints: LocalizedText[];
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

- [ ] **Step 4: 改 6 个 mock 方案数据文件**

每个文件：删除 `equipment: [...]` 行，替换为给定的 `productSlugs` 行，并从首行 import 中移除不再使用的品类常量（`L` 和行业常量保留）。逐文件如下：

`ecommerce-fulfillment.ts`：import 改为 `import { E_COMMERCE, L } from "../products/helpers";`，`equipment: [AMR, AGV_FORKLIFT, WCS, IWMS],` 替换为：

```ts
  productSlugs: [
    "mbt10r-roller-top-amr",
    "mbv15r-counterbalanced-agv-forklift",
    "hiwhale-wcs-fleet-scheduling-system",
    "hiwhale-iwms",
  ],
```

`automotive-line-side.ts`：import 改为 `import { AUTOMOTIVE, L } from "../products/helpers";`，`equipment: [AGV, AGV_FORKLIFT, WCS],` 替换为：

```ts
  productSlugs: [
    "mba12t-latent-jacking-agv",
    "mbv15r-counterbalanced-agv-forklift",
    "hiwhale-wcs-fleet-scheduling-system",
  ],
```

`3pl-multi-client.ts`：import 改为 `import { L, THIRD_PARTY_LOGISTICS } from "../products/helpers";`，`equipment: [AMR, MANNED_FORKLIFT, IWMS, WCS],` 替换为：

```ts
  productSlugs: [
    "mbt10r-roller-top-amr",
    "mbf35e-electric-counterbalanced-forklift",
    "hiwhale-iwms",
    "hiwhale-wcs-fleet-scheduling-system",
  ],
```

`cold-chain-automation.ts`：import 改为 `import { FOOD_COLD_CHAIN, L } from "../products/helpers";`，`equipment: [AGV_FORKLIFT, RGV, MANNED_FORKLIFT, WCS],` 替换为：

```ts
  productSlugs: [
    "mbv20p-stacker-agv-forklift",
    "mbr04g-rail-guided-shuttle-rgv",
    "mbf35e-electric-counterbalanced-forklift",
    "hiwhale-wcs-fleet-scheduling-system",
  ],
```

`pharma-compliant-logistics.ts`：import 改为 `import { L, PHARMACEUTICAL } from "../products/helpers";`，`equipment: [AMR, RGV, IWMS, WCS],` 替换为：

```ts
  productSlugs: [
    "mbh08l-latent-lifting-amr",
    "mbr04g-rail-guided-shuttle-rgv",
    "hiwhale-iwms",
    "hiwhale-wcs-fleet-scheduling-system",
  ],
```

`port-container-yard.ts`：import 改为 `import { L, PORT } from "../products/helpers";`，`equipment: [GANTRY_CRANE, AGV, WCS],` 替换为：

```ts
  productSlugs: [
    "mbg40t-rail-mounted-gantry-crane",
    "mba12t-latent-jacking-agv",
    "hiwhale-wcs-fleet-scheduling-system",
  ],
```

- [ ] **Step 5: 改 shared 案例类型与 6 个 mock 案例**

`packages/shared/src/constants/cases/types.ts` 中 `equipment: LocalizedText[];` 之后新增：

```ts
  /** 关联产品 slug 数组（门户"相关产品"区块数据源） */
  productSlugs: string[];
```

6 个案例文件各自在 `equipment: [...]` 数组结束后新增一行 `productSlugs`（equipment 自由文本数组保留不动）：

- `globalecom-fulfillment.ts`：`productSlugs: ["mbt10r-roller-top-amr", "hiwhale-wcs-fleet-scheduling-system"],`
- `nordauto-line-side.ts`：`productSlugs: ["mba12t-latent-jacking-agv", "mbv15r-counterbalanced-agv-forklift"],`
- `swiftserve-multiclient.ts`：`productSlugs: ["mbf35e-electric-counterbalanced-forklift", "mbt10r-roller-top-amr"],`
- `freshchain-cold.ts`：`productSlugs: ["mbv20p-stacker-agv-forklift", "mbr04g-rail-guided-shuttle-rgv"],`
- `medipharma-gmp.ts`：`productSlugs: ["mbh08l-latent-lifting-amr", "hiwhale-iwms"],`
- `harborlink-port.ts`：`productSlugs: ["mbg40t-rail-mounted-gantry-crane"],`

- [ ] **Step 6: 改 seed.js**

`api/prisma/seed.js` 方案段（L94）：`equipment: s.equipment,` 改为 `productSlugs: s.productSlugs,`。
案例段（L116）：`equipment: c.equipment,` 保留，其后新增一行 `productSlugs: c.productSlugs,`。

- [ ] **Step 7: 重建 shared 并跑 seed**

```bash
pnpm --filter @hiwhale/shared build && pnpm db:seed
```

Expected: shared 构建成功；seed 输出 `solutions upserted: 6` / `cases upserted: 6` 无报错。

- [ ] **Step 8: 改 portal 方案详情页**

`apps/portal/app/[locale]/solutions/[slug]/page.tsx`：

1. L37-41 替换为：

```tsx
// 相关产品：按 productSlugs 精确关联
const allProducts = await fetchProducts();
const relatedProducts = solution.productSlugs
  .map((slug) => allProducts.find((p) => p.slug === slug))
  .filter((p) => p !== undefined);
```

2. "设备组合"区块（L107-123）改为从关联产品推导品类：

```tsx
{
  /* 设备组合（品类芯片由关联产品推导，去重） */
}
<section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
  <Reveal>
    <h2 className="font-heading text-foreground text-2xl font-bold md:text-3xl">
      {t("equipmentTitle")}
    </h2>
    <div className="mt-6 flex flex-wrap gap-3">
      {Array.from(new Set(relatedProducts.map((p) => p.category))).map((category) => (
        <span
          key={category}
          className="rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700"
        >
          {getLocalizedLabel(PRODUCT_CATEGORY_LABELS, category, locale)}
        </span>
      ))}
    </div>
  </Reveal>
</section>;
```

3. 若 `relatedProducts.length === 0` 时设备组合区块无芯片可显示属正常（区块保留标题即可，不额外处理）。

- [ ] **Step 9: 改 portal 案例详情页**

`apps/portal/app/[locale]/cases/[slug]/page.tsx` L29：

```tsx
const relatedProducts = (await fetchProducts()).slice(0, 3);
```

替换为：

```tsx
const allProducts = await fetchProducts();
const relatedProducts = item.productSlugs
  .map((slug) => allProducts.find((p) => p.slug === slug))
  .filter((p) => p !== undefined);
```

"相关产品"区块（L160-175）整体包一层条件（为空则隐藏）：

```tsx
{
  /* 相关产品 */
}
{
  relatedProducts.length > 0 && (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
      <h2 className="font-heading text-foreground text-2xl font-bold md:text-3xl">
        {t("relatedProductsTitle")}
      </h2>
      <div className="mt-8 flex gap-6 overflow-x-auto pb-4">
        {relatedProducts.map((product, index) => (
          <ProductCard
            key={product.slug}
            product={product}
            delay={index * 80}
            className="w-72 shrink-0"
          />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 10: 验证**

```bash
pnpm type-check && pnpm lint
```

Expected: 全部通过。注意此时 admin 的 `store/solutions.ts` 仍引用 `equipment` 字段（ApiSolution 类型是 admin 本地定义，不影响编译）；API 端 solutions/cases service 引用 `dto.equipment` 仍存在于 DTO 中（Task 2 才改），schema 已无 equipment 列——`solutions.service.ts` L48 `equipment: dto.equipment ?? []` 会**编译报错**（Prisma client 已重新生成）。若 type-check 在 api 报错，属预期，继续 Task 2 后消失。**因此本任务验证标准：`pnpm --filter portal type-check` 与 `pnpm --filter @hiwhale/shared build` 通过即可。**

- [ ] **Step 11: Commit**

```bash
git add api/prisma packages/shared apps/portal
git commit -m "feat: 方案/案例改为产品 slug 关联（schema+shared+portal）"
```

---

### Task 2: API — productSlugs DTO/service + 产品删除级联重写

**Files:**

- Modify: `api/src/modules/solutions/dto/solutions.dto.ts`
- Modify: `api/src/modules/solutions/solutions.service.ts`
- Modify: `api/src/modules/cases/dto/cases.dto.ts`
- Modify: `api/src/modules/cases/cases.service.ts`
- Modify: `api/src/modules/products/products.service.ts:146-192`

**Interfaces:**

- Consumes: Task 1 的 `productSlugs` DB 列。
- Produces: solutions/cases API 接受并返回 `productSlugs: string[]`；`DELETE /api/products/:id` 响应 `{ deleted: true, scrubbedRefs: number }`，并级联清理 Solution/CaseStudy.productSlugs 与 ChatConversation.productContext。

- [ ] **Step 1: solutions DTO**

`api/src/modules/solutions/dto/solutions.dto.ts` 中：

```ts
  /** ProductCategory 枚举值数组 */
  @IsOptional()
  @IsArray()
  equipment?: string[];
```

替换为：

```ts
  /** 关联产品 slug 数组 */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  productSlugs?: string[];
```

- [ ] **Step 2: solutions service**

`solutions.service.ts` create 中 `equipment: dto.equipment ?? [],` → `productSlugs: dto.productSlugs ?? [],`；
update 中 `...(dto.equipment !== undefined ? { equipment: dto.equipment } : {}),` → `...(dto.productSlugs !== undefined ? { productSlugs: dto.productSlugs } : {}),`。

- [ ] **Step 3: cases DTO + service**

`cases.dto.ts` 在 `equipment?: unknown[];` 之后新增：

```ts
  /** 关联产品 slug 数组 */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  productSlugs?: string[];
```

`cases.service.ts` create 的 data 中 `equipment: asJson(dto.equipment),` 之后新增 `productSlugs: dto.productSlugs ?? [],`；update 的 data 中 `...(dto.equipment !== undefined ? { equipment: asJson(dto.equipment) } : {}),` 之后新增 `...(dto.productSlugs !== undefined ? { productSlugs: dto.productSlugs } : {}),`。

- [ ] **Step 4: 重写产品删除级联**

`products.service.ts` 的 `remove()` 方法（L146-192）整体替换为：

```ts
  async remove(id: string, operatorId?: string) {
    const exists = await this.prisma.product.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException("产品不存在");
    await this.prisma.product.delete({ where: { id } });

    // 级联清理引用（favorites 由 FK onDelete: Cascade 自动清理）
    let scrubbedRefs = 0;
    // 1. AI 对话产品上下文
    scrubbedRefs += (
      await this.prisma.chatConversation.updateMany({
        where: { productContext: exists.slug },
        data: { productContext: null },
      })
    ).count;
    // 2. 方案关联产品（Prisma 无法操作数组元素，读出-过滤-写回）
    const solutions = await this.prisma.solution.findMany({
      where: { productSlugs: { has: exists.slug } },
    });
    for (const sol of solutions) {
      await this.prisma.solution.update({
        where: { id: sol.id },
        data: { productSlugs: sol.productSlugs.filter((s) => s !== exists.slug) },
      });
      scrubbedRefs++;
    }
    // 3. 案例关联产品
    const cases = await this.prisma.caseStudy.findMany({
      where: { productSlugs: { has: exists.slug } },
    });
    for (const c of cases) {
      await this.prisma.caseStudy.update({
        where: { id: c.id },
        data: { productSlugs: c.productSlugs.filter((s) => s !== exists.slug) },
      });
      scrubbedRefs++;
    }

    if (operatorId) {
      await this.logs.log(
        operatorId,
        "删除产品",
        `${exists.model}（级联清理引用 ${scrubbedRefs} 处）`,
      );
    }
    return { deleted: true, scrubbedRefs };
  }
```

注意：`CaseStudy.equipment`（Json 自由文本）的旧清理代码**整体删除**，不再触碰该字段。

- [ ] **Step 5: 验证（type-check + curl 冒烟）**

```bash
pnpm --filter @hiwhale/api lint
```

启动 api（`pnpm dev:api`）与基础设施后，用员工 token 冒烟（TOKEN 获取：admin 登录后 `POST /api/auth/staff/login`，或直接看 admin 前端 localStorage）：

```bash
# 1. 给方案设置关联产品
curl -X PUT http://localhost:4000/api/solutions/<solutionId> \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"productSlugs":["mbf35e-electric-counterbalanced-forklift"]}'
# 2. 删除该产品（先查 id：GET /api/products/admin/all）
curl -X DELETE http://localhost:4000/api/products/<productId> -H "Authorization: Bearer $TOKEN"
# Expected 响应: {"deleted":true,"scrubbedRefs":1}
# 3. 再查方案，productSlugs 应为 []
curl http://localhost:4000/api/solutions/<slug>
```

- [ ] **Step 6: Commit**

```bash
git add api/src/modules
git commit -m "feat(api): productSlugs 关联 + 产品删除级联清理"
```

---

### Task 3: Admin — 选择器改实时 API + 案例关联产品字段

**Files:**

- Modify: `apps/admin/store/solutions.ts`
- Modify: `apps/admin/store/cases.ts`
- Modify: `apps/admin/components/solutions/SolutionFormDialog.tsx`
- Modify: `apps/admin/components/cases/CaseFormDialog.tsx`
- Modify: `apps/admin/app/(dashboard)/knowledge-base/page.tsx:353-364`

**Interfaces:**

- Consumes: Task 2 的 `productSlugs` API；`useProductsStore`（已存在，`fetchProducts()` 拉 `/api/products/admin/all`，元素含 `slug/model/name.zh`）。
- Produces: `AdminCase.products: string[]`；选择器数据源 = products store（空且未加载时回退 `MOCK_PRODUCTS`）。

- [ ] **Step 1: solutions store**

`apps/admin/store/solutions.ts` 替换要点：

- 删除 `MOCK_PRODUCTS`/`ProductCategory` import、`toEquipment` 函数、以及 `toRow` 中品类映射注释。
- `ApiSolution.equipment: string[]` → `productSlugs: string[]`。
- `toRow` 中 `products: s.productSlugs ?? []`。
- `AdminSolution.products` 注释改为 `/** 关联产品 slug 列表 */`。
- `saveSolution` body 中 `equipment: toEquipment(payload.products),` → `productSlugs: payload.products,`。

改后关键片段：

```ts
import { create } from "zustand";
import { adminApi } from "@/lib/api";

export type AdminSolution = {
  id: string;
  titleZh: string;
  titleEn: string;
  industry: string;
  summary: string;
  painPoints: string[];
  /** 关联产品 slug 列表 */
  products: string[];
  status: "published" | "draft";
};

type ApiSolution = {
  id: string;
  industry: string;
  title: { en: string; zh: string };
  summary: { en: string; zh: string };
  painPoints: Array<{ en: string; zh: string }>;
  productSlugs: string[];
  status: "published" | "draft";
};

/** API → 页面形状 */
function toRow(s: ApiSolution): AdminSolution {
  return {
    id: s.id,
    titleZh: s.title.zh,
    titleEn: s.title.en,
    industry: s.industry,
    summary: s.summary.zh,
    painPoints: s.painPoints.map((p) => p.zh),
    products: s.productSlugs ?? [],
    status: s.status,
  };
}
```

（saveSolution 中 body 构造仅改 `productSlugs: payload.products` 一处，其余不动。）

- [ ] **Step 2: cases store**

`apps/admin/store/cases.ts`：

- `AdminCase` 新增 `products: string[];`。
- `ApiCase` 新增 `productSlugs?: string[];`。
- `toRow` 返回中新增 `products: c.productSlugs ?? [],`。
- `saveCase` body 新增 `productSlugs: payload.products,`。

- [ ] **Step 3: SolutionFormDialog 选择器改实时数据**

`apps/admin/components/solutions/SolutionFormDialog.tsx`：

- import 中从 `@hiwhale/shared/constants` 移除 `MOCK_PRODUCTS`，改为保留 `MOCK_PRODUCTS` 仅作回退（见下），并新增 `import { useProductsStore } from "@/store/products";`。
- 组件内新增：

```tsx
const products = useProductsStore((s) => s.products);
const fetchProducts = useProductsStore((s) => s.fetchProducts);

useEffect(() => {
  if (open && products.length === 0) {
    void fetchProducts().catch(() => toast.error("产品列表加载失败，已回退到内置数据"));
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [open]);
```

- "关联产品"网格（L186-201）的数据源改为：

```tsx
            <div className="grid grid-cols-2 gap-2">
              {(products.length > 0 ? products : MOCK_PRODUCTS).map((p) => (
```

（MOCK_PRODUCTS import 保留，类型上与 AdminProduct 均有 `slug/model/name.zh`，渲染代码不变。）

- [ ] **Step 4: CaseFormDialog 新增关联产品字段**

`apps/admin/components/cases/CaseFormDialog.tsx`：

- 新增 import：`import { MOCK_PRODUCTS } from "@hiwhale/shared/constants";`（合并进现有 shared import）与 `import { useProductsStore } from "@/store/products";`。
- `EMPTY` 新增 `products: [] as string[],`。
- 初始化 useEffect 的 initial 分支新增 `products: initial.products,`。
- 组件内接入 products store（同 Step 3 的 useEffect 模式）。
- 新增 toggle：

```tsx
const toggleProduct = (slug: string) =>
  set(
    "products",
    form.products.includes(slug)
      ? form.products.filter((s) => s !== slug)
      : [...form.products, slug],
  );
```

- submit 的 payload 新增 `products: form.products,`。
- 在"客户评价"区块之后、"客户 Logo"区块之前插入：

```tsx
<div className="space-y-2">
  <Label>关联产品</Label>
  <div className="grid grid-cols-2 gap-2">
    {(products.length > 0 ? products : MOCK_PRODUCTS).map((p) => (
      <label
        key={p.slug}
        className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600"
      >
        <input
          type="checkbox"
          className="accent-brand-blue h-4 w-4"
          checked={form.products.includes(p.slug)}
          onChange={() => toggleProduct(p.slug)}
        />
        {p.name.zh}（{p.model}）
      </label>
    ))}
  </div>
</div>
```

- [ ] **Step 5: 知识库页产品选择器**

`apps/admin/app/(dashboard)/knowledge-base/page.tsx`：

- 新增 `import { useProductsStore } from "@/store/products";`，组件内接入 store + 挂载时 fetch（无数据时回退 MOCK_PRODUCTS，同 Step 3 模式）。
- L359 的 `{MOCK_PRODUCTS.map((p) => (` 改为 `{(products.length > 0 ? products : MOCK_PRODUCTS).map((p) => (`。

- [ ] **Step 6: 验证**

```bash
pnpm --filter admin type-check && pnpm --filter admin lint
```

手动验证（admin dev server）：方案编辑弹窗的关联产品列表与产品管理页一致；删除某产品后重新打开弹窗，已删产品不再出现；案例弹窗可勾选关联产品并保存。

- [ ] **Step 7: Commit**

```bash
git add apps/admin
git commit -m "feat(admin): 方案/案例关联产品选择器改实时 API，案例新增关联产品字段"
```

---

### Task 4: API — 动态素材位 + 上传校验

**Files:**

- Modify: `api/src/modules/uploads/asset-slots.ts`
- Modify: `api/src/modules/uploads/uploads.service.ts:216-270`

**Interfaces:**

- Consumes: Prisma `solution.findMany` / `caseStudy.findMany`（Task 1 schema）。
- Produces: `listSiteAssets(): Promise<Array<AssetSlot & { exists: boolean; size: number }>>`（静态槽 + 动态槽）；`saveSiteAsset(slotId, file)` / `deleteSiteAsset(slotId)` 支持动态槽 id；素材位上传按扩展名校验类型/大小；目录不可写时抛 503。

- [ ] **Step 1: 移除硬编码案例槽**

`api/src/modules/uploads/asset-slots.ts`：删除 L70-83 全部 12 个"案例"槽（这些改由 DB 动态生成）。文件头部新增动态槽构造器：

```ts
export type AssetSlot = {
  id: string;
  filename: string;
  subdir: string;
  area: string;
  purpose: string;
};

/** 由 DB 实体动态生成素材位：方案场景图 + 案例现场图/客户 Logo */
export function buildDynamicSlots(
  solutions: Array<{ slug: string; title: unknown }>,
  cases: Array<{ slug: string; clientName: unknown }>,
): AssetSlot[] {
  const zh = (v: unknown) =>
    v && typeof v === "object" ? String((v as { zh?: string }).zh ?? "") : "";
  return [
    ...solutions.map((s) => ({
      id: `solution-${s.slug}`,
      filename: `solution-${s.slug}.png`,
      subdir: "solutions",
      area: "方案",
      purpose: `方案场景图：${zh(s.title) || s.slug}`,
    })),
    ...cases.flatMap((c) => [
      {
        id: `case-${c.slug}`,
        filename: `case-${c.slug}.png`,
        subdir: "cases",
        area: "案例",
        purpose: `案例现场图：${zh(c.clientName) || c.slug}`,
      },
      {
        id: `case-logo-${c.slug}`,
        filename: `case-logo-${c.slug}.png`,
        subdir: "cases",
        area: "案例",
        purpose: `案例客户 Logo：${zh(c.clientName) || c.slug}`,
      },
    ]),
  ];
}
```

（`export type AssetSlot` 原文件已有，保留原声明即可，勿重复声明。）

- [ ] **Step 2: uploads.service 素材位段重写**

`uploads.service.ts` 顶部 import 更新：

```ts
import { ASSET_SLOTS, buildDynamicSlots, type AssetSlot } from "./asset-slots";
import { ServiceUnavailableException } from "@nestjs/common"; // 合并进现有 @nestjs/common import
```

L216-270（"站点素材位"注释至文件尾）整体替换为：

```ts
  // ---------- 站点素材位（写入门户 public/images） ----------

  private portalPublicDir() {
    return process.env.PORTAL_PUBLIC_DIR ?? path.resolve(process.cwd(), "../apps/portal/public");
  }

  private slotPath(slot: AssetSlot) {
    return path.join(this.portalPublicDir(), "images", slot.subdir, slot.filename);
  }

  /** 全量素材位 = 静态注册表 + DB 动态槽（方案/案例） */
  private async allSlots(): Promise<AssetSlot[]> {
    const [solutions, cases] = await Promise.all([
      this.prisma.solution.findMany({ select: { slug: true, title: true } }),
      this.prisma.caseStudy.findMany({ select: { slug: true, clientName: true } }),
    ]);
    return [...ASSET_SLOTS, ...buildDynamicSlots(solutions, cases)];
  }

  /** 素材位列表（含存在状态与文件大小） */
  async listSiteAssets() {
    const slots = await this.allSlots();
    return slots.map((slot) => {
      let exists = false;
      let size = 0;
      try {
        const stat = fs.statSync(this.slotPath(slot));
        exists = stat.isFile();
        size = stat.size;
      } catch {
        // 缺失
      }
      return { ...slot, exists, size };
    });
  }

  /** 素材位扩展名校验规则 */
  private static SITE_ASSET_RULES: Record<string, { mimes: string[]; maxSize: number }> = {
    ".png": { mimes: ["image/png"], maxSize: 5 * 1024 * 1024 },
    ".jpg": { mimes: ["image/jpeg"], maxSize: 5 * 1024 * 1024 },
    ".jpeg": { mimes: ["image/jpeg"], maxSize: 5 * 1024 * 1024 },
    ".webp": { mimes: ["image/webp"], maxSize: 5 * 1024 * 1024 },
    ".svg": { mimes: ["image/svg+xml"], maxSize: 1 * 1024 * 1024 },
    ".mp4": { mimes: ["video/mp4"], maxSize: 100 * 1024 * 1024 },
    ".glb": { mimes: ["model/gltf-binary", "application/octet-stream"], maxSize: 50 * 1024 * 1024 },
  };

  /** 上传/替换素材位文件 */
  async saveSiteAsset(slotId: string, file: Express.Multer.File) {
    const slot = (await this.allSlots()).find((s) => s.id === slotId);
    if (!slot) throw new NotFoundException("素材位不存在");
    if (!file) throw new BadRequestException("请选择文件");
    const ext = path.extname(slot.filename).toLowerCase();
    const rule = UploadsService.SITE_ASSET_RULES[ext];
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (!rule || fileExt !== ext || !rule.mimes.includes(file.mimetype)) {
      throw new BadRequestException(`文件类型不符：需 ${ext}（${rule?.mimes.join("/") ?? "不支持"}）`);
    }
    if (file.size > rule.maxSize) {
      throw new BadRequestException(`文件超出大小限制（${Math.round(rule.maxSize / 1024 / 1024)}MB）`);
    }
    const target = this.slotPath(slot);
    try {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, file.buffer);
    } catch {
      throw new ServiceUnavailableException(
        "素材位目录不可写（生产环境请检查 PORTAL_PUBLIC_DIR 卷挂载）",
      );
    }
    return { ok: true, path: `/images/${slot.subdir}/${slot.filename}` };
  }

  /** 删除素材位文件（回到"缺失"状态） */
  async deleteSiteAsset(slotId: string) {
    const slot = (await this.allSlots()).find((s) => s.id === slotId);
    if (!slot) throw new NotFoundException("素材位不存在");
    try {
      fs.unlinkSync(this.slotPath(slot));
    } catch {
      return null;
    }
    return { deleted: true };
  }
}
```

controller 的 `deleteSiteAsset` 目前不是 async（L111-116），改为：

```ts
  async deleteSiteAsset(@CurrentUser() payload: JwtPayload, @Param("slotId") slotId: string) {
    if (payload.kind !== "staff") throw new ForbiddenException("仅后台员工可删除");
    const result = await this.uploads.deleteSiteAsset(slotId);
    if (!result) throw new NotFoundException("素材文件不存在");
    return result;
  }
```

- [ ] **Step 3: 验证**

```bash
pnpm --filter @hiwhale/api lint
```

curl 冒烟（需 api + DB 运行）：

```bash
curl http://localhost:4000/api/uploads/site-assets -H "Authorization: Bearer $TOKEN"
# Expected: 静态槽 + 每个方案的 solution-<slug> 槽 + 每个案例的 case-<slug>/case-logo-<slug> 槽，均带 exists/size
curl -X POST "http://localhost:4000/api/uploads/site-asset?slotId=case-globalecom-fulfillment" \
  -H "Authorization: Bearer $TOKEN" -F "file=@/path/to/test.png"
# Expected: {"ok":true,"path":"/images/cases/case-globalecom-fulfillment.png"}
```

- [ ] **Step 4: Commit**

```bash
git add api/src/modules/uploads
git commit -m "feat(api): 素材位支持 DB 动态槽（方案/案例）+ 类型大小校验 + 503 错误"
```

---

### Task 5: Admin media 页 — 重命名 + 站点素材位面板

**Files:**

- Modify: `apps/admin/app/(dashboard)/media/page.tsx`
- Create: `apps/admin/components/media/SiteAssetsPanel.tsx`
- Create: `apps/admin/components/media/RenameDialog.tsx`

**Interfaces:**

- Consumes: `POST /api/uploads/rename {key, newKey}`（已存在）；`GET /api/uploads/site-assets`、`POST /api/uploads/site-asset?slotId=`、`DELETE /api/uploads/site-assets/:slotId`（Task 4）；`adminApi`、`API_BASE`、`useAdminAuthStore`（现有）。
- Produces: media 页两个 tab："通用文件库"（现有网格 + 重命名）/"站点素材位"（分组槽位网格）。

- [ ] **Step 1: 重命名弹窗组件**

创建 `apps/admin/components/media/RenameDialog.tsx`：

```tsx
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { adminApi } from "@/lib/api";

type RenameDialogProps = {
  /** 当前要重命名的素材 key；null 时关闭 */
  itemKey: string | null;
  onClose: () => void;
  onRenamed: () => Promise<void>;
};

/** 素材重命名：仅可改文件名（扩展名与目录锁定） */
export function RenameDialog({ itemKey, onClose, onRenamed }: RenameDialogProps) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const fileName = itemKey?.split("/").pop() ?? "";
  const ext = fileName.includes(".") ? `.${fileName.split(".").pop()}` : "";

  useEffect(() => {
    if (itemKey) setName(fileName.replace(/\.[^.]+$/, ""));
  }, [itemKey, fileName]);

  const submit = async () => {
    if (!itemKey || !name.trim()) return;
    setSaving(true);
    try {
      const result = await adminApi<{ key: string; updatedRefs: number }>("/api/uploads/rename", {
        method: "POST",
        body: { key: itemKey, newKey: name.trim() },
      });
      toast.success(
        `已重命名为 ${result.key.split("/").pop()}（同步引用 ${result.updatedRefs} 处）`,
      );
      await onRenamed();
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "重命名失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={itemKey !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>重命名素材</DialogTitle>
          <DialogDescription>
            仅修改文件名，扩展名 {ext} 与所在目录不变；数据库中的引用会自动同步。
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label>新文件名</Label>
          <div className="flex items-center gap-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="小写字母/数字/中划线"
              onKeyDown={(e) => e.key === "Enter" && void submit()}
            />
            <span className="shrink-0 text-sm text-slate-500">{ext}</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button
            className="bg-brand-blue hover:bg-brand-blue/90"
            disabled={saving || !name.trim()}
            onClick={() => void submit()}
          >
            {saving ? "保存中…" : "确认重命名"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 2: 素材位面板组件**

创建 `apps/admin/components/media/SiteAssetsPanel.tsx`：

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { ImagePlus, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { adminApi, API_BASE } from "@/lib/api";
import { useAdminAuthStore } from "@/store/auth";

type SiteAsset = {
  id: string;
  filename: string;
  subdir: string;
  area: string;
  purpose: string;
  exists: boolean;
  size: number;
};

/** 站点素材位面板：全量展示位（含空位）的上传/替换/删除 */
export function SiteAssetsPanel() {
  const [slots, setSlots] = useState<SiteAsset[]>([]);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const fetchSlots = useCallback(async () => {
    const data = await adminApi<SiteAsset[]>("/api/uploads/site-assets");
    setSlots(data);
  }, []);

  useEffect(() => {
    void fetchSlots().catch((e) => toast.error(e instanceof Error ? e.message : "加载失败"));
  }, [fetchSlots]);

  const doUpload = async (slot: SiteAsset, file: File) => {
    setUploadingId(slot.id);
    try {
      const token = useAdminAuthStore.getState().token;
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(
        `${API_BASE}/api/uploads/site-asset?slotId=${encodeURIComponent(slot.id)}`,
        {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: fd,
        },
      );
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(data.message ?? "上传失败");
      }
      toast.success(`${slot.purpose} 已更新`);
      await fetchSlots();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "上传失败");
    } finally {
      setUploadingId(null);
    }
  };

  const doDelete = async (slot: SiteAsset) => {
    try {
      await adminApi(`/api/uploads/site-assets/${encodeURIComponent(slot.id)}`, {
        method: "DELETE",
      });
      toast.success("已删除，恢复为占位状态");
      await fetchSlots();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "删除失败");
    }
  };

  const areas = Array.from(new Set(slots.map((s) => s.area)));

  return (
    <div className="space-y-8">
      {areas.map((area) => (
        <div key={area}>
          <h3 className="mb-3 text-sm font-semibold text-slate-700">
            {area}
            <span className="ml-2 text-xs font-normal text-slate-400">
              {slots.filter((s) => s.area === area && s.exists).length}/
              {slots.filter((s) => s.area === area).length} 已投放
            </span>
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {slots
              .filter((s) => s.area === area)
              .map((slot) => (
                <div
                  key={slot.id}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                >
                  {slot.exists ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`${process.env.NEXT_PUBLIC_PORTAL_URL ?? "http://localhost:3000"}/images/${slot.subdir}/${slot.filename}`}
                      alt={slot.purpose}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-1 bg-slate-50 p-3 text-center">
                      <ImagePlus className="h-6 w-6 text-slate-300" />
                      <span className="text-xs text-slate-400">未投放素材</span>
                    </div>
                  )}
                  <div className="space-y-1.5 p-3">
                    <div className="text-xs font-medium text-slate-700">{slot.purpose}</div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="truncate font-mono text-xs text-slate-400"
                        title={slot.filename}
                      >
                        {slot.filename}
                      </span>
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {slot.subdir}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <label className="text-brand-blue cursor-pointer text-xs font-medium hover:underline">
                        <input
                          type="file"
                          className="hidden"
                          disabled={uploadingId === slot.id}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) void doUpload(slot, f);
                            e.target.value = "";
                          }}
                        />
                        {slot.exists ? (
                          <>
                            <RefreshCw className="mr-0.5 inline h-3 w-3" />
                            {uploadingId === slot.id ? "上传中…" : "替换"}
                          </>
                        ) : (
                          <>
                            <ImagePlus className="mr-0.5 inline h-3 w-3" />
                            {uploadingId === slot.id ? "上传中…" : "上传"}
                          </>
                        )}
                      </label>
                      {slot.exists && (
                        <button
                          type="button"
                          className="ml-auto text-xs font-medium text-red-600 hover:underline"
                          onClick={() => void doDelete(slot)}
                        >
                          <Trash2 className="mr-0.5 inline h-3 w-3" />
                          删除
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
      {slots.length === 0 && (
        <div className="flex h-40 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm text-slate-400">
          加载中…
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: media 页接入 tab + 重命名**

`apps/admin/app/(dashboard)/media/page.tsx`：

- 新增 import：`import { Pencil } from "lucide-react";`（合并进现有 lucide import）、`import { RenameDialog } from "@/components/media/RenameDialog";`、`import { SiteAssetsPanel } from "@/components/media/SiteAssetsPanel";`。
- 新增状态：

```tsx
const [tab, setTab] = useState<"files" | "slots">("files");
const [renaming, setRenaming] = useState<string | null>(null);
```

- PageHeader 的 description 改为 `"通用素材库（MinIO）与站点展示位素材的统一管理"`。
- PageHeader 之后、工具栏之前插入 tab 栏：

```tsx
<div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-1">
  {(
    [
      ["files", "通用文件库"],
      ["slots", "站点素材位"],
    ] as const
  ).map(([value, label]) => (
    <button
      key={value}
      type="button"
      onClick={() => setTab(value)}
      className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
        tab === value ? "bg-brand-blue text-white" : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  ))}
</div>
```

- 现有"工具栏 + 素材网格 + 分页"三段外层包 `{tab === "files" && (<>…</>)}`；其后加 `{tab === "slots" && <SiteAssetsPanel />}`。
- 素材卡片操作区（"替换"label 之前）新增重命名按钮：

```tsx
<button
  type="button"
  className="hover:text-brand-blue text-xs font-medium text-slate-500"
  onClick={() => setRenaming(item.key)}
>
  <Pencil className="mr-0.5 inline h-3 w-3" />
  重命名
</button>
```

- 文件末尾删除确认 Dialog 之后新增：

```tsx
<RenameDialog itemKey={renaming} onClose={() => setRenaming(null)} onRenamed={fetchItems} />
```

- [ ] **Step 4: 验证**

```bash
pnpm --filter admin type-check && pnpm --filter admin lint
```

手动验证：media 页切换两个 tab；通用文件库中重命名一个图片（引用它的产品图 URL 应同步更新）；站点素材位中给一个空槽上传图片、替换、删除。

- [ ] **Step 5: Commit**

```bash
git add apps/admin
git commit -m "feat(admin): 素材管理支持重命名 + 站点素材位全量管理面板"
```

---

### Task 6: Portal — 白名单收敛为 onError 回退

**Files:**

- Create: `apps/portal/components/ui/SlottedImage.tsx`
- Modify: `apps/portal/components/home/ProductEcosystem.tsx`
- Modify: `apps/portal/components/home/IndustrySolutions.tsx`
- Modify: `apps/portal/app/[locale]/solutions/[slug]/page.tsx:62-76`

**Interfaces:**

- Consumes: 素材位文件路径约定 `/images/<subdir>/<filename>`（Task 4）。
- Produces: `SlottedImage` 组件：`{ src: string; alt: string; className: string; placeholder: { label: string; size: string; name: string; ratio: string; className?: string } }`——图片加载失败时渲染 `Placeholder`。

- [ ] **Step 1: SlottedImage 组件**

创建 `apps/portal/components/ui/SlottedImage.tsx`：

```tsx
"use client";

import { useState } from "react";
import { Placeholder } from "./Placeholder";

type SlottedImageProps = {
  /** 图片路径（/images/...），加载失败时回退占位块 */
  src: string;
  alt: string;
  className: string;
  placeholder: {
    label: string;
    size: string;
    name: string;
    ratio: string;
    className?: string;
  };
};

/** 素材位图片：文件存在即显示真图，加载失败（未投放）自动回退占位块 */
export function SlottedImage({ src, alt, className, placeholder }: SlottedImageProps) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <Placeholder
        ratio={placeholder.ratio}
        className={placeholder.className}
        label={placeholder.label}
        size={placeholder.size}
        name={placeholder.name}
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />
  );
}
```

- [ ] **Step 2: ProductEcosystem 收敛**

`apps/portal/components/home/ProductEcosystem.tsx`：

- 删除 `GROUPS_WITH_IMAGE` 常量（L20-21）及其注释。
- import 中 `Placeholder` 替换为 `import { SlottedImage } from "@/components/ui/SlottedImage";`（Placeholder 不再直接使用则移除 import）。
- L55-77 的条件渲染替换为：

```tsx
<SlottedImage
  src={`/images/products/${GROUP_IMAGE_NAMES[groupKey] ?? `product-group-${group.key.toLowerCase()}.png`}`}
  alt={name}
  className="aspect-[4/3] w-full rounded-lg object-cover"
  placeholder={{
    ratio: "aspect-[4/3]",
    className: "p-4",
    label: known
      ? t(`items.${group.key}.image`)
      : `${taxonomyLabel(taxonomy, group.key, "zh")} 组合图（占位）`,
    size: t("imageSize"),
    name: GROUP_IMAGE_NAMES[groupKey] ?? `product-group-${group.key.toLowerCase()}.png`,
  }}
/>
```

- [ ] **Step 3: IndustrySolutions 收敛**

`apps/portal/components/home/IndustrySolutions.tsx`：

- 删除 `INDUSTRIES_WITH_IMAGE` 常量（L8-16）。
- `Placeholder` import 替换为 SlottedImage。
- L48-63 替换为：

```tsx
<SlottedImage
  src={`/images/industries/${INDUSTRY_IMAGE_NAMES[industry]}`}
  alt={getLocalizedLabel(INDUSTRY_LABELS, industry, locale)}
  className="aspect-video w-full object-cover"
  placeholder={{
    ratio: "aspect-video",
    className: "rounded-none border-0",
    label: t(`items.${industry}.image`),
    size: t("imageSize"),
    name: INDUSTRY_IMAGE_NAMES[industry],
  }}
/>
```

- [ ] **Step 4: 方案详情页行业图收敛**

`apps/portal/app/[locale]/solutions/[slug]/page.tsx` L62-76（INDUSTRY_IMAGE_NAMES 存在性判断）替换为：

```tsx
<SlottedImage
  src={`/images/industries/${INDUSTRY_IMAGE_NAMES[solution.industry as Industry] ?? `industry-${solution.industry}.png`}`}
  alt={industryLabel(solution.industry, locale)}
  className="aspect-video w-full rounded-xl border border-slate-200 object-cover"
  placeholder={{
    ratio: "aspect-video",
    label: `行业方案场景图：${solution.industry}`,
    size: "16:9 · 建议 1600×900",
    name: solution.imageName,
  }}
/>
```

并新增 import `import { SlottedImage } from "@/components/ui/SlottedImage";`（该文件 Placeholder 仍被其他位置使用则保留其 import；grep 确认后按需清理）。

- [ ] **Step 5: 验证**

```bash
pnpm --filter portal type-check && pnpm --filter portal lint
```

手动验证：首页产品生态/行业区块在素材缺失时显示占位块；向对应素材位上传图片后刷新即显示真图（无需改代码）。

- [ ] **Step 6: Commit**

```bash
git add apps/portal
git commit -m "feat(portal): 图片白名单收敛为 SlottedImage onError 回退"
```

---

### Task 7: Docker 共享卷 + 文档同步

**Files:**

- Modify: `docker-compose.yml`
- Modify: `AGENTS.md`

**Interfaces:**

- Consumes: `PORTAL_PUBLIC_DIR` 环境变量（uploads.service 已支持）。
- Produces: 命名卷 `portal_images`；portal 挂 `/app/apps/portal/public/images`，api 挂 `/portal-public/images` 且 `PORTAL_PUBLIC_DIR=/portal-public`。

- [ ] **Step 1: docker-compose.yml**

api 服务 environment 段新增一行、并新增 volumes 段：

```yaml
      MINIO_ENDPOINT: minio
      PORTAL_PUBLIC_DIR: /portal-public
    volumes:
      - portal_images:/portal-public/images
```

portal 服务新增 volumes 段（与 environment 同级）：

```yaml
volumes:
  - portal_images:/app/apps/portal/public/images
```

底部 volumes 段新增：

```yaml
portal_images:
```

（说明：命名卷首次创建时会用 portal 镜像内该目录的现有内容初始化，已有素材不丢失；api 容器以非 root 运行，若遇到权限问题，临时方案是给 api 服务加 `user: root`，验证时留意。）

- [ ] **Step 2: 验证 compose 配置**

```bash
docker compose config --quiet && echo OK
```

Expected: 输出 OK（仅校验配置语法，不需要启动）。

- [ ] **Step 3: 更新 AGENTS.md**

`AGENTS.md` 关键约定一节：

- "占位素材"条目末尾追加：`；站点素材位已由后端注册表 + DB 动态槽统一管理（admin 素材管理 → 站点素材位），portal 端用 SlottedImage onError 自动回退占位块，白名单模式（*_WITH_IMAGE）已废弃`。
- "mock 数据"条目末尾追加：`；方案/案例与产品的关联为真实 productSlugs（删除产品时 API 级联清理）`。
- "部署"命令行后追加一行说明：`- 素材位文件经命名卷 portal_images 在 api 与 portal 容器间共享（PORTAL_PUBLIC_DIR=/portal-public）`。
- "进度"一节追加一行：`素材管理：重命名 + 站点素材位（静态注册表 + 方案/案例动态槽）；产品删除级联清理方案/案例关联（2026-08）。`

- [ ] **Step 4: 全量校验 + Commit**

```bash
pnpm format && pnpm lint && pnpm type-check
```

```bash
git add docker-compose.yml AGENTS.md
git commit -m "feat(deploy): portal 素材目录命名卷共享 + 文档同步"
```

---

## Self-Review 记录

- **规格覆盖**：重命名（Task 5）✓；全量素材位静态+动态（Task 4/5）✓；产品级联删除（Task 2）✓；选择器实时化（Task 3）✓；白名单收敛——采用规格中枚举的"onError 回退"选项而非 manifest（Task 6）✓；Docker 共享卷（Task 7）✓；503 错误处理（Task 4）✓。
- **顺序依赖**：Task 1 后 api 编译暂时失败（solutions.service 引用旧 DTO 字段），Task 2 修复——两任务必须连做，中间不可用 `pnpm type-check`（根）作为门禁。
- **已知取舍**：portal 首页 SlottedImage 在素材缺失时会产生一次 404 请求再回退占位块，可接受；案例列表页（cases/page.tsx）的 Placeholder 未接入真图（案例封面图展示在详情页，列表页仍为占位——与现状一致，不扩大范围）。
