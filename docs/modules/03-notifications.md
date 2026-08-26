# 03 · 后台通知系统（站内通知）

> 先读 [README.md](README.md) §0 项目速览。范围：`api/` 新模块 + `apps/admin` Topbar。与 [02-mail.md](02-mail.md) 共享"询盘创建"触发点，但两模块可独立实施、独立上线。

## 目标

管理后台 Topbar 的通知铃铛从装饰变成真实功能：新询盘 / 新注册用户 / 知识库向量化失败等事件产生站内通知，员工可查看、标记已读。

## 边界

- **负责**：通知的产生、存储、列表、已读状态、Topbar 铃铛 UI + 下拉面板
- **不负责**：邮件通知（02 模块）、WebSocket 实时推送（用 30s 轮询即可，YAGNI）、门户用户通知（无需求）

## 现状

- `apps/admin/components/layout/Topbar.tsx:37-44`：铃铛按钮 + 常亮红点，无下拉、无数据源
- 无任何 notifications 表 / API
- 触发点现状：询盘创建 `api/src/modules/inquiries/inquiries.service.ts create()`；用户注册 `auth.service.ts register()`

## 实施规格

### 1. Schema（`api/prisma/schema.prisma`）

```prisma
model Notification {
  id        String   @id @default(uuid()) @db.Uuid
  // 事件类型：inquiry_new / user_registered / knowledge_failed ...
  type      String
  title     String
  // 可选跳转链接（admin 内路由，如 /inquiries）
  href      String?
  payload   Json?
  readAt    DateTime? @map("read_at")
  createdAt DateTime @default(now()) @map("created_at")

  @@index([readAt, createdAt])
  @@map("notifications")
}
```

简化设计：**不按员工分发**，通知全局共享，已读状态按员工存——但为控制规模，v1 采用"全局通知 + 每员工已读"太重；改为**每条通知带 readBy String[]**（员工 id 数组，Prisma `String[] @default([])`），已读即 push 自己 id。列表接口按当前员工过滤已读状态。

迁移：`cd api && pnpm prisma migrate dev --name notifications`。

### 2. 后端 `api/src/modules/notifications/`

- `NotificationsModule`：`AppModule` 注册；`NotificationsService` 提供：
  - `create(data: { type, title, href?, payload? })` — 供其他模块注入调用
  - `list(staffId)` — 最近 50 条，每条附加 `read: boolean`（readBy 含 staffId）+ 顶层 `unreadCount`
  - `markRead(staffId, id)` / `markAllRead(staffId)`
- `NotificationsController`（`/api/notifications`，全部 `JwtAuthGuard` + staff 校验）：
  - `GET /` → `{ items, unreadCount }`
  - `PATCH /:id/read`、`POST /read-all`

### 3. 触发点接入

- `inquiries.service.ts create()`：创建后 `void this.notifications.create({ type: "inquiry_new", title: \`新询盘：${dto.fullName}（${dto.company}）\`, href: "/inquiries" })`
- `auth.service.ts register()`：`type: "user_registered", title: \`新注册用户：${user.name}\`, href: "/users"`
- 两模块注入 `NotificationsService`（module exports 它）

### 4. admin Topbar（`apps/admin/components/layout/Topbar.tsx`）

- 移除常亮红点；改为 `useEffect` 挂载后轮询 `GET /api/notifications`（30s 间隔，`setInterval` + 卸载清理）
- 红点/角标显示 `unreadCount`（>0 才显示）
- 点击铃铛弹 shadcn `DropdownMenu`：最近 10 条（类型图标 + 标题 + 相对时间 + 未读加粗），点击条目 → `markRead` 并 `router.push(href)`；底部"全部已读"按钮
- shadcn 组件用现有的 dropdown-menu（若无则 `pnpm dlx shadcn add dropdown-menu`，遵循项目 shadcn 现有配置）

## 验收

1. 提交一条询盘 → 30s 内 Topbar 出现未读角标 → 下拉可见该通知 → 点击跳转询盘页且角标减少
2. 另一员工账号登录看到同一通知为未读（互不影响）
3. "全部已读"后角标清零
4. 迁移文件入库，`pnpm type-check && pnpm lint` 全绿

## 禁止事项

- 不引入 WebSocket / SSE / Redis pub-sub（轮询足够）
- 不做门户用户侧通知
- 通知不产生邮件（那是 02 模块的可选扩展）
