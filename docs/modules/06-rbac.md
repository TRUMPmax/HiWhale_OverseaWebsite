# 06 · RBAC 权限矩阵实装

> 先读 [README.md](README.md) §0 项目速览。范围：`api/` 全部业务 controller + `apps/admin` Sidebar/页面。涉及面广但每处改动都是同一模式。

## 目标

让 admin 员工页展示的权限矩阵从"静态示意图"变成真实强制：后端按角色拦截越权 API，前端按角色过滤导航。

## 现状

- 矩阵定义（`apps/admin/app/(dashboard)/staff/page.tsx:48-63`，纯静态展示）：

| 模块     | SUPER_ADMIN | SALES | PRODUCT_TECH | OPERATIONS |
| -------- | ----------- | ----- | ------------ | ---------- |
| 仪表盘   | ✓           | ✓     | ✓            | ✓          |
| 产品管理 | ✓           | —     | ✓            | —          |
| 询盘管理 | ✓           | ✓     | —            | ✓          |
| 用户管理 | ✓           | ✓     | —            | —          |
| AI 模块  | ✓           | ✓     | ✓            | —          |
| 内容管理 | ✓           | —     | ✓            | ✓          |
| 员工管理 | ✓           | —     | —            | —          |
| 系统设置 | ✓           | —     | —            | —          |

- 后端现状：`JwtAuthGuard` 只校验 `kind === "staff"`；SUPER_ADMIN 校验仅 staff.controller.ts（全部）与 users.controller.ts 的 DELETE。其余模块任何员工角色都能操作
- 前端现状：`components/layout/Sidebar.tsx:23-38` 导航不按角色过滤，任何角色看到全部 14 个菜单
- 登录响应已带 `role`（auth.service.ts staffLogin 返回 `role`，admin `store/auth.ts` 的 `admin.role` 可用）

## 实施规格

### 1. 矩阵单一来源（`packages/shared/src/constants/index.ts`）

新增并导出（admin 与文档共用；api 不依赖 shared 包，api 侧按下文装饰器自带映射）：

```ts
/** 角色 → 可访问模块 key 集合（与 staff 页矩阵一一对应） */
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  SUPER_ADMIN: [
    "dashboard",
    "products",
    "inquiries",
    "users",
    "ai",
    "content",
    "staff",
    "settings",
  ],
  SALES: ["dashboard", "inquiries", "users", "ai"],
  PRODUCT_TECH: ["dashboard", "products", "ai", "content"],
  OPERATIONS: ["dashboard", "inquiries", "content"],
};
```

改完 shared 要重新 build（`pnpm --filter @hiwhale/shared build`）。

### 2. 后端：模块级角色守卫

新建 `api/src/common/roles.decorator.ts` + 守卫，或在每个 controller 顶部加轻量 helper（项目现有风格是 controller 内私有方法，沿用之）：

```ts
// 推荐：可复用 guard
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(ctx: ExecutionContext) {
    const roles =
      this.reflector.get<string[]>("roles", ctx.getHandler()) ??
      this.reflector.get<string[]>("roles", ctx.getClass());
    if (!roles?.length) return true; // 未标注 = 任何 staff
    const payload = ctx.switchToHttp().getRequest().user as JwtPayload;
    if (payload.kind !== "staff") throw new ForbiddenException("仅后台员工可操作");
    if (!roles.includes(payload.role ?? "")) throw new ForbiddenException("无权访问该模块");
    return true;
  }
}
export const Roles = (...roles: string[]) => SetMetadata("roles", roles);
```

**controller 级映射表**（在类上加 `@Roles(...)`，逐个核对现有 controller）：

| Controller                                   | 允许角色                                              |
| -------------------------------------------- | ----------------------------------------------------- |
| products / taxonomy / uploads（素材）        | SUPER_ADMIN, PRODUCT_TECH                             |
| solutions / cases                            | SUPER_ADMIN, PRODUCT_TECH, OPERATIONS                 |
| inquiries                                    | SUPER_ADMIN, SALES, OPERATIONS                        |
| users                                        | SUPER_ADMIN, SALES（DELETE 仍仅 SUPER_ADMIN，已存在） |
| chat（admin 端点）/ knowledge / ai 相关      | SUPER_ADMIN, SALES, PRODUCT_TECH                      |
| content / settings（PUT）                    | SUPER_ADMIN, PRODUCT_TECH, OPERATIONS                 |
| staff / logs                                 | SUPER_ADMIN（staff 已有，logs 补上）                  |
| stats / settings（GET）/ uploads（GET 列表） | 全部 staff（不标注）                                  |

Guard 注册：各 controller 与 `JwtAuthGuard` 并列 `@UseGuards(JwtAuthGuard, RolesGuard)`，或全局 APP_GUARD 二选一（推荐局部显式，符合现状风格）。

### 3. 前端导航过滤（`apps/admin/components/layout/Sidebar.tsx`）

- 每个菜单项已有路由→模块映射；加 `module` 字段（"products"/"inquiries"/"users"/"ai"/"content"/"staff"/"settings"/"dashboard"）
- `const role = useAdminAuthStore((s) => s.admin?.role)`；按 `ROLE_PERMISSIONS[role]` 过滤（role 缺失时只显示 dashboard）
- staff 页矩阵改为从 `ROLE_PERMISSIONS` 派生渲染（删硬编码 MATRIX）

### 4. 越权直达的兜底

前端过滤只是体验；直接访问 URL（如 SALES 手输 `/staff`）时页面会在 API 403 后报错——给 admin 的 `adminApi` 403 响应统一 toast「无权限访问」并 router.replace 到 `/dashboard`（在 `lib/api.ts` 错误处理里加即可）。

## 验收

1. SALES 账号登录：导航只有 仪表盘/询盘/用户/AI 相关；直接 `curl -H "Bearer <sales token>" -X DELETE /api/products/<id>` 返回 403
2. SUPER_ADMIN 一切正常
3. staff 页矩阵与 `ROLE_PERMISSIONS` 一致（改一处两边同步）
4. `pnpm type-check && pnpm lint` 全绿

## 禁止事项

- 不改 JwtPayload 形状（`role?: string` 已够）
- 不做按钮级细粒度权限（模块级即可，YAGNI）
- portal 端不涉及任何改动
