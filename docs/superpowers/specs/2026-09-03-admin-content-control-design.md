# 后台全方位管理前台展示数据 — 设计文档

日期：2026-09-03
状态：已定稿（自动模式，用户诉求明确：前台展示数据全部由后台可管，不再写死）

## 背景与问题

用户反馈：前台展示信息不少写死，后台管理不到位。点名案例/方案的"交付时间、回本周期、展示 Icon"。

调查结论（详见探索报告）：

- 案例交付周期 `CaseStudy.duration` **已全链路可管理**（DB → DTO → 后台表单双语输入 → portal 渲染）。
- "回本周期"**不是独立字段**，是 `results[]` 成果指标里的一条，后台表单已可增删改（但用户感知不到）。
- **真正写死的**：
  1. `Solution` 无交付周期字段（CaseStudy 有，Solution 没有）；
  2. 全部展示图标硬编码：案例详情 Clock/Package/Quote（`cases/[slug]/page.tsx`）、方案痛点 AlertTriangle（`solutions/[slug]/page.tsx`）、产品特性按下标循环取 icon（`products/[slug]/page.tsx` FEATURE_ICONS）、首页产品大类 GROUP_ICONS（`ProductEcosystem.tsx`）；
  3. 首页行业卡片：6 个核心行业（CORE_INDUSTRIES）、行业→方案 slug 映射（INDUSTRY_SOLUTION_SLUG）、卡片文案（messages `home.industries.items.*`）三处写死；
  4. 页面级杂项：认证墙 CERTS、StatsAndClients 默认值等（部分已有 site_settings 覆盖通道）。

## 路线选择

方案 A（采纳）：**结构化字段补齐 + 图标注册表 + 复用 site_settings 通道**。

- 否决 B（纯 KV）：无类型约束、无 per-entity 粒度，长期更乱。
- 否决 C（通用内容块 CMS）：数倍工程量，YAGNI。

项目已有两个成熟范式可直接沿袭：分类体系 DB 化（taxonomy 模块 + 拖拽排序）与 site_settings KV 内容管理（content 页 5 Tab）。

## 设计

### 1. 图标体系（核心新增）

- `packages/shared/src/constants/icons.ts`：lucide 白名单注册表 `PORTAL_ICONS`（约 40 个常用图标），`name → lucide 组件` 映射 + 分类；导出 `isPortalIcon(name)` 校验。
  - 白名单而非全量 lucide：控制 bundle、避免后台选到风格不统一图标。
- portal：`apps/portal/components/ui/IconByName.tsx`，按 name 渲染；未知名/空 → 调用方给定的回退图标（保持现状视觉）。
- admin：`apps/admin/components/ui/IconPicker.tsx`，按钮 + 弹窗网格选择，显示图标+名称，支持清除（回退默认）。

### 2. 图标挂接点

| 挂接点            | 存储                                        | 迁移?  | 后台编辑处                    | 前台消费处                         | 回退                               |
| ----------------- | ------------------------------------------- | ------ | ----------------------------- | ---------------------------------- | ---------------------------------- |
| 产品大类图标      | `ProductGroupEntity.icon String?`           | **是** | 品类管理页分组编辑            | `ProductEcosystem.tsx`             | 现有 GROUP_ICONS 枚举映射 → Shapes |
| 方案痛点图标      | `painPoints[]` 条目加可选 `icon`（JSON 内） | 否     | 方案表单痛点行动内 IconPicker | `solutions/[slug]/page.tsx` 痛点卡 | AlertTriangle                      |
| 产品特性图标      | `features[]` 条目加可选 `icon`              | 否     | 产品表单特性行                | `products/[slug]/page.tsx` 特性卡  | 现有按下标循环                     |
| 案例/方案指标图标 | `results[]` 条目加可选 `icon`               | 否     | 案例/方案表单成果行动内       | 两详情页指标区 + 列表卡片芯片      | 无图标（现状）                     |

- 案例详情三个 section 图标（Clock=交付周期 / Package=设备 / Quote=证言）属版式图标、全站统一，**保持写死不做 per-case 配置**（在 spec 中显式说明，避免误读为遗漏）。
- JSON 列加可选字段无需迁移：DTO 现为 `@IsArray() unknown[]` 宽松校验，结构契约由 shared 类型维持。

### 3. 方案交付周期

- `Solution` 加 `duration Json?`（`{en, zh}`，可空）→ prisma 迁移。
- `UpsertSolutionDto` 加 `duration`；service 沿用 `...(dto.x !== undefined ? {x} : {})` 部分更新。
- 方案表单加"交付周期"双语输入（对齐案例表单 PairInputs）。
- portal 方案详情页渲染（仅当有值），messages 补 `solutions.detail.durationLabel`（en/zh 同步）。
- shared `MockSolution` 类型加 `duration?`，mock 数据可暂不填。

### 4. 首页行业卡片可配置

- site_settings 新 key `home-industries`：`[{ industry, solutionSlug, description:{en,zh}, painPoint:{en,zh} }]`，数组顺序即展示顺序。
- admin 内容管理页加"首页行业"Tab：动态行编辑（行业下拉、方案下拉、双语 description/painPoint），行数不限（前台渲染条数以设置为准）。
- portal `IndustrySolutions.tsx` + `HeroNarrative.tsx` 第二幕：优先读 `home-industries`，缺省/缺字段回退现状（CORE_INDUSTRIES + messages 文案 + INDUSTRY_SOLUTION_SLUG）。
- `lib/settings.ts` 的 `fetchSetting<T>` 通道现成，无需新 API。

### 5. 顺带修正

- 后台案例"成果数据"、方案"成效指标"编辑区加一行说明文案，点明"回本周期/ROI 作为一项指标在此维护（label 填'投资回收期/Payback Period'）"。

### 6. 明确不做（后续清单）

- Industry 枚举 DB 化（影响面：首页 CORE_INDUSTRIES、各筛选器、行业回退图槽）——独立立项。
- 认证墙 CERTS、StatsAndClients 默认统计、Partners LOGO_COUNT、Footer 方案链接、Navbar 导航项、ContactForm 国家列表——低价值或已有覆盖通道，需要时走 site_settings 逐个补齐。
- 案例 section 版式图标 per-case 化（见 §2）。

## 数据流

- 实体字段：admin 表单 → `PUT /api/{solutions,cases}/:id` → Prisma JSON/列 → portal `lib/content.ts`（API 优先、mock 回退）。
- 分组图标：品类管理 → taxonomy API → portal `lib/taxonomy.ts`。
- 首页行业：内容管理 → `PUT /api/settings/home-industries` → portal `fetchSetting("home-industries")`。

## 错误处理与兼容

- 全部前台消费点保持"API 失败/字段缺失 → 现状默认值"回退，不白屏。
- 旧数据无 icon/duration 字段时行为与现状完全一致（全部可选）。
- seed.js 同步更新：Solution 补 duration 种子值（upsert 不覆盖用户已改数据——seed 已是 upsert by slug，新增字段仅在记录中合并写入，注意 upsert update 分支不覆盖既有非空值；实现时核对 seed 行为）。

## 测试与验证

- `pnpm format` + `pnpm lint` + `pnpm type-check` 全绿。
- dev server 运行期间禁止 `pnpm build`（AGENTS.md 约定）。
- 手工验证清单：后台改方案交付周期/痛点图标 → 前台方案详情生效；品类管理改分组图标 → 首页产品生态区生效；内容管理改首页行业 → 首页卡片生效；清空设置 → 回退现状。

## 涉及文件（预判）

- 迁移：`api/prisma/schema.prisma`（Solution.duration、ProductGroupEntity.icon）+ 新迁移目录；`api/prisma/seed.js`。
- API：`solutions.dto.ts`、`solutions.service.ts`（duration 透传）；`taxonomy` 模块 group DTO/service 加 icon；无新路由。
- shared：`constants/icons.ts`（新）；`solutions/types.ts`（duration?）；`products/types.ts`、`cases/types.ts`（条目 icon?）；taxonomy 类型加 icon?。
- portal：`IconByName.tsx`（新）；`ProductEcosystem.tsx`、`solutions/[slug]/page.tsx`、`products/[slug]/page.tsx`、`cases/[slug]/page.tsx`、`IndustrySolutions.tsx`、`HeroNarrative.tsx`；messages en/zh 同步。
- admin：`IconPicker.tsx`（新）；品类管理页、`SolutionFormDialog.tsx`、`CaseFormDialog.tsx`、`ProductForm.tsx`、内容管理页；store/cases|solutions 形状转换。
- 注意：工作区 4 个 admin 文件有未提交在途修改（双语全字段化），在其基础上追加，不回退。
- AGENTS.md 进度节追加一行。
