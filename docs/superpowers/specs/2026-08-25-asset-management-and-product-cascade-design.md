# 素材管理改造 + 产品删除级联 — 设计文档

日期：2026-08-25
状态：已获用户批准（分两节确认）

## 背景与问题

1. **素材无法重命名**：后端 `POST /api/uploads/rename` 已实现（复制→删旧→同步 DB 引用），但 admin 素材管理页（`apps/admin/app/(dashboard)/media/page.tsx`）无对应 UI，素材名称混乱不易查找。
2. **素材位不可见**：门户站大量展示位（Placeholder 约 20 处）当前无图时在素材管理界面无入口。后端已写好（未提交）`api/src/modules/uploads/asset-slots.ts` 静态注册表 + 三个 site-assets 端点，但 admin 前端未接入，且注册表不含动态实体（新增方案/案例的图）。
3. **产品删除幻影**：admin 方案管理的产品选择器（`apps/admin/components/solutions/SolutionFormDialog.tsx:187`、知识库页）直接渲染 `packages/shared` 的 `MOCK_PRODUCTS`，删除 MBF35E 后仍可选；且后端关联存的是品类枚举（`Solution.equipment String[]`），`products.service.delete()` 的级联清理逻辑假设错误（把 `CaseStudy.equipment` 的 `{en,zh}` 对象数组当字符串数组清、用品类字段匹配 slug），实际清不掉任何东西。

## 决策记录（用户已确认）

- 关联语义：**存真实产品 slug**，不再存品类。
- 素材位：**静态注册表 + 按 DB 记录动态生成的槽位**。
- 部署：**Docker 命名卷共享** portal public/images。
- 现有方案的品类关联数据**直接清空**，由用户重新关联（数据量小，映射规则易错）。
- 动态槽**不含产品图**（产品图留在产品表单，走 MinIO + DB 字段的成熟链路）。
- portal 白名单收敛为**构建期 manifest**。

## 设计

### 一、产品删除级联 + 真实产品关联

#### Schema（`api/prisma/schema.prisma`）

- `Solution`：`equipment String[]`（品类枚举）→ `productSlugs String[]`（产品 slug）。
- `CaseStudy`：新增 `productSlugs String[]`；`equipment Json`（本地化自由文本，如"12 台 MBF35E"）保留，仅作展示文案，不参与关联。
- 迁移：一次 migrate，旧 `equipment` 数据直接清空。

#### API

- `products.service.delete()` 级联改为：
  - 查出所有 `productSlugs` 含该 slug 的 Solution / CaseStudy，读出-过滤-写回（Prisma 无 array_remove，用应用层过滤）。
  - 保留已有 `chatConversation.productContext` 清理。
  - `Favorite.productId` 已是 `onDelete: Cascade`，不动。
  - 删除 `CaseStudy.equipment` 的错误清理代码（自由文本不清）。
- solutions / cases 模块的 DTO、service、controller 同步改用 `productSlugs`（校验 slug 存在于 products）。

#### Admin

- `SolutionFormDialog.tsx`、知识库页产品选择器：`MOCK_PRODUCTS` → 实时查 `/api/products`（复用 products store 的 fetch；API 不可用时回退 mock，与项目现有约定一致）。
- `CaseFormDialog.tsx`：新增"关联产品"多选（同样走 API）。
- `store/solutions.ts`：删除品类⇄slug 转换层（L28-50），直接透传 slug 数组；cases store 同步。

#### Portal

- 方案详情页 `solutions/[slug]/page.tsx`：删除"品类→该品类第一款产品"逻辑（L37-41），按 `productSlugs` 渲染 ProductCard。
- 案例详情页 `cases/[slug]/page.tsx`：`relatedProducts` 从"取前 3 个产品"（L29）改为按 `productSlugs` 取真实关联；为空则隐藏该区块。

### 二、素材管理：重命名 + 全量素材位

#### 重命名

- media 页每个条目加"重命名"按钮 + 弹窗：仅可改文件名部分，扩展名锁定，key 首段目录前缀（`image/ spec/ model/ doc/`）不可改。
- 复用后端 `POST /api/uploads/rename`；新 key 已存在时后端返回 409，前端提示。

#### 素材位

- **静态槽**：以 `asset-slots.ts` 现有注册表为基础，逐一核对 portal 全部静态 Placeholder（约 20 处）补齐缺口。注意：产品详情缩略图、3D 模型等**随产品动态变化的资产不纳入静态槽**（与"产品图走产品表单"的决策一致）。
- **动态槽**：`GET /api/uploads/site-assets` 返回 = 静态槽 + 由 DB 实时生成：
  - 每个 Solution：封面图槽 `solution-<slug>-cover`
  - 每个 CaseStudy：封面图槽 `case-<slug>-cover`、现场图槽 `case-<slug>-site`、客户 Logo 槽 `case-<slug>-logo`
  - 产品图不纳入（走产品表单 + MinIO）。
- 槽位元数据沿用 `{id, filename, subdir, area, purpose}` + `exists` 检测；动态槽额外带实体标题便于分组展示。
- **Admin media 页改版**：两个分区 tab——
  1. "通用文件库"：现有 MinIO 列表 + 新增重命名。
  2. "站点素材位"：按 area / 实体分组的槽位网格；有文件显示缩略图 + 替换/删除，无文件显示虚线上传框，标注用途 + 建议尺寸 + 文件名（沿用 Placeholder 的 label/size/name 约定）。
- **白名单收敛**：portal 废弃 `GROUPS_WITH_IMAGE` / `INDUSTRIES_WITH_IMAGE` 等 `*_WITH_IMAGE` Set；新增构建期脚本扫描 `apps/portal/public/images` 生成 manifest（JSON），组件查 manifest 决定渲染真图或 Placeholder。
- portal 端方案/案例图同步从"仅渲染 Placeholder"接入 manifest 真图渲染（原 `imageName/logoName` 文件名约定保留，与素材位 filename 对齐）。

#### 上传校验与错误处理

- 素材位上传：仅图片（png/jpg/webp/svg），大小上限 5MB，超限/类型错误返回 400 并前端提示。
- 删除素材位文件：纯文件操作，无 DB 副作用。
- `PORTAL_PUBLIC_DIR` 未配置或目录不可写时，site-asset 上传返回 503 + 明确错误信息（不静默失败）。

### 三、部署适配（Docker 共享卷）

- `docker-compose.yml`：新增命名卷 `portal-images`；portal 容器挂载到 `public/images`，api 容器挂载到约定路径并设置 `PORTAL_PUBLIC_DIR` 环境变量。
- `deploy.sh`、`docker/api.Dockerfile`（如需）、`AGENTS.md` 同步更新。

## 错误处理总览

| 场景 | 行为 |
|---|---|
| 重命名目标已存在 | 409 + 前端提示 |
| 删除被引用产品 | 级联从方案/案例移除，响应中返回受影响计数 |
| 素材位上传类型/大小不合规 | 400 + 前端提示 |
| 生产环境卷未挂载 | 503 + 明确错误信息 |
| products API 不可用（admin） | 选择器回退 mock（现有约定） |

## 测试

- API：产品删除后方案/案例 `productSlugs` 已清理（含多关联场景）；rename 后 products/knowledge 引用已同步；site-assets 列表含动态槽。
- Admin：手动验证选择器不再出现已删产品；media 页重命名、槽位上传/替换/删除。
- Portal：方案/案例详情页真实关联产品渲染与跳转；manifest 有无图两种状态的 Placeholder 回退。

## 不做的事（YAGNI）

- 素材引用计数 / 引用追踪界面。
- 产品图纳入素材位管理。
- MinIO 存储素材位文件（共享卷已满足）。
- CaseStudy.equipment 自由文本的结构化改造。
