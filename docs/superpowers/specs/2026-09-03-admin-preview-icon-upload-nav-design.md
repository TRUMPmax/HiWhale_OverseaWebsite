# 后台体验增强：编辑实时预览 / 图标自定义上传 / 侧边栏分组 — 设计文档

日期：2026-09-03
状态：已定稿（自动模式）

## 需求

1. 后台新建案例 / 编辑产品时无法即时看到前台效果，需保存后刷新门户查看 → 编辑过程中实时预览大致布局。
2. 图标除 45 项白名单外，支持管理员上传自定义图标（SVG/PNG）。
3. 后台侧边栏 14 个条目过多 → 一级类目 + 下拉二级索引（如 AI 三个板块归入 AI 类目）。

## 设计

### 1. 编辑实时预览

不能跨 app 复用 portal 组件，故在 admin 侧写**近似门户布局**的轻量预览组件（纯展示，无交互），数据直接来自表单实时状态——天然"实时"，无需额外同步。

- **案例**：`CaseFormDialog` 弹窗 `max-w-3xl` → `max-w-6xl`，内部 grid 双栏：左=现有表单（自身滚动），右=预览（自身滚动）。预览组件 `apps/admin/components/cases/CasePreview.tsx`：
  - 结构仿 portal 案例详情：行业徽章 + 项目名 + 客户名 → 背景/挑战/方案三卡 → 设备清单 + 交付周期卡 → 成果指标网格（含图标）→ 客户证言。
  - props 直接吃表单 state（Pair 形状）；顶部带 中/EN 切换（预览用本地 state，默认 zh）。
  - 图标渲染用 admin 侧 `IconGlyph`（见 §2）。
- **产品**：`ProductForm` 用于 `products/new` 与 `products/[id]` 两个页面（页面容器现为 `max-w-3xl`）。页面容器改 `max-w-7xl`；ProductForm 内部改为双栏：左=现有表单，右=`sticky top-6` 预览。预览组件 `apps/admin/components/products/ProductPreview.tsx`：
  - 结构仿 portal 产品详情：品类徽章 + 名称/型号 + 卖点 → 主图（表单 images[0] 的 URL，无则占位块）→ 核心参数芯片 → 核心特性卡（含图标）→ 描述。
  - 数据经 react-hook-form `watch()` 实时获取 + 现有 `images` state；中/EN 切换同上。
- 预览仅示意布局，不追求像素级还原（字体/间距以门户实际为准，组件注释写明）。
- 方案表单不做（用户未点名；模式相同，后续可一行接入）。

### 2. 图标自定义上传

- icon 字段值扩展为两种形态：**白名单 name**（现状）或 **URL**（上传所得）。
- 上传复用既有 `POST /api/uploads?kind=image`（KIND_RULES 已含 image/svg+xml、png、jpeg、webp；返回 `{key, url}` 公网 URL）。**API 零改动**。
- admin：
  - 抽出 `apps/admin/components/ui/IconGlyph.tsx`：`{ value?: string; className?: string }`——白名单名 → lucide 组件；`http`/`/` 开头 → `<img src>`；空 → null。IconPicker 的 ICONS 映射迁入该文件供复用。
  - `IconPicker`：弹窗底部加"上传自定义图标"区（file input，accept `.svg,.png,.webp`）→ 上传（带 JWT，同 ProductForm 的 uploadAsset 模式）→ onChange(url)；value 为 URL 时触发按钮显示小图预览；清除按钮同样置 undefined。
- portal：`IconByName` 扩展——`isPortalIconName(name)` → lucide；否则若以 `http` 或 `/` 开头 → `<img src={name} className>`（不用 next/image，MinIO 域名未必在 remotePatterns）；否则回退 fallback。
- 安全：SVG 经 `<img>` 加载不执行脚本；上传端已有 mime/大小白名单。DB 里 URL 只是字符串，迁移无需变。
- 分组图标（ProductGroupEntity.icon）同样受益（taxonomy DTO 本来就是 string）。

### 3. 侧边栏二级分组

`apps/admin/components/layout/Sidebar.tsx`：`NAV_ITEMS` 扁平数组 → `NAV_GROUPS`：

```
总览：仪表盘
门户内容：产品管理、品类管理、素材管理、方案管理、案例管理、内容管理
线索与客户：询盘管理、用户管理
AI：AI 对话记录、AI 知识库、AI 设置
系统：员工管理、系统设置
```

- 每组一个可折叠 header（图标 + 组名 + ChevronDown 旋转），子项缩进渲染，active 样式逻辑不变。
- 展开状态：`useState<Set<string>>`，初始 = 当前 pathname 所在组（其余收起）；点击 header 切换；写入 localStorage `admin-nav-expanded`，挂载时读取（SSR 安全：useEffect 内读）。
- "总览"只有一项也成组，保持结构统一（也可特判直链——选择统一成组，简单）。

## 错误处理与兼容

- 预览组件对空值全容忍（空 Pair 渲染占位淡文字）；不发起任何网络请求。
- 自定义图标 URL 加载失败：`<img>` onError 隐藏（portal IconByName 内做，回退 fallback 组件）。
- localStorage 读失败/键缺失 → 默认展开当前组。
- 全部改动 admin 侧为主 + portal 仅 IconByName 一处扩展；无 DB/API 变更。

## 测试与验证

- `pnpm --filter @hiwhale/shared build`（若动 shared——本设计不动）+ `pnpm lint` + `pnpm type-check`。
- 手工验证：案例/产品编辑时右侧预览随输入实时变化；上传 SVG 图标后前台对应位置显示；侧边栏分组折叠/展开、刷新后状态保持、active 高亮正确。

## 涉及文件（预判）

- admin 新增：`components/ui/IconGlyph.tsx`、`components/cases/CasePreview.tsx`、`components/products/ProductPreview.tsx`
- admin 修改：`components/ui/IconPicker.tsx`（接入 IconGlyph + 上传）、`components/cases/CaseFormDialog.tsx`（双栏 + 预览）、`components/products/ProductForm.tsx`（双栏 + 预览）、`app/(dashboard)/products/new/page.tsx`、`app/(dashboard)/products/[id]/page.tsx`（容器加宽）、`components/layout/Sidebar.tsx`（分组）
- portal 修改：`components/ui/IconByName.tsx`（URL 形态支持）
- AGENTS.md 进度节追加一行
