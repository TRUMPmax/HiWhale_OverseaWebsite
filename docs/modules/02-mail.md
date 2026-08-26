# 02 · 邮件模块（MailModule）

> **状态：暂缓实施（2026-08-25 业主决策）**。纯海外站上线不接 SMTP：注册仅校验邮箱格式、无验证码环节（auth 的 send-code/验证码链路已移除）。将来需要询盘邮件提醒/找回密码时再按本文档实施。
> 先读 [README.md](README.md) §0 项目速览。范围：仅 `api/` 后端 + `apps/admin` 设置页。portal 无需改动。

## 目标

把散落在 `auth.service.ts` 里的内联 nodemailer 抽成全局 `MailModule`，承载：注册验证码、询盘通知（新询盘邮件提醒销售）、SMTP 配置的自检与测试邮件。生产环境未配 SMTP 时**禁止泄露 devCode**。

## 边界

- **负责**：SMTP 连接管理、发信、HTML 模板、发送失败降级（记日志不炸主流程）
- **不负责**：定时清理 `email_codes` 表（属运维，可选）、站内通知（属 [03-notifications.md](03-notifications.md)）、营销邮件/订阅（无此需求，YAGNI）

## 现有资产（已存在，直接使用）

- 依赖已装：`nodemailer@9`（api/package.json）
- 内联实现待迁移：`api/src/modules/auth/auth.service.ts:38-58`（transporter 构建 + 验证码邮件 HTML）
- 验证码业务：`sendCode()`（auth.service.ts:28-63）、`verifyCode()`（:65-74）；`EmailCode` 表已建
- 环境变量约定：`SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASSWORD/SMTP_FROM`（`.env.example` 已有）
- 询盘创建点：`api/src/modules/inquiries/inquiries.service.ts` 的 `create()`（员工角色 SALES 名单可从 `prisma.staffUser.findMany({ where: { role: { in: ["SALES","SUPER_ADMIN"] }, status: "ACTIVE" } })` 取收件人）
- 站点设置 KV：`api/src/modules/settings/` — `GET /api/settings/:key`（公开）、`PUT /api/settings/:key`（员工），适合存"询盘通知开关/收件邮箱覆盖"等

## 实施规格

### 1. 新建 `api/src/modules/mail/mail.module.ts`

```ts
@Global()
@Module({ providers: [MailService], exports: [MailService] })
export class MailModule {}
```

在 `app.module.ts` imports 注册。

### 2. `api/src/modules/mail/mail.service.ts`

接口（实现者按此签名，不得更改）：

```ts
@Injectable()
export class MailService {
  /** 是否已配置 SMTP（SMTP_HOST 非空） */
  isConfigured(): boolean;

  /** 通用发信。未配置 SMTP 时：console.warn 并返回 false（不 throw）。发送失败：console.error 并返回 false。 */
  send(opts: { to: string | string[]; subject: string; html: string }): Promise<boolean>;

  /** 验证码邮件（迁移 auth.service.ts:47-56 的现有 HTML 模板，保持品牌色 #0A2540/#1A56DB） */
  sendVerificationCode(to: string, code: string): Promise<boolean>;

  /** 新询盘通知：收件人为全体 ACTIVE 的 SALES + SUPER_ADMIN 员工邮箱 */
  sendInquiryNotification(inquiry: {
    fullName: string;
    company: string;
    email: string;
    country: string;
    description: string;
  }): Promise<boolean>;

  /** SMTP 连接自检（transporter.verify()），供 admin "发送测试邮件" 用 */
  verify(): Promise<{ ok: boolean; error?: string }>;
}
```

transporter 惰性创建并缓存（首次 send 时构建）；`secure` 规则沿用现状（465→true）。

### 3. 改造 auth（`auth.service.ts`）

- 注入 `MailService`，删除内联 nodemailer 代码
- `sendCode()` 新逻辑：
  ```
  if (mail.isConfigured()) { await mail.sendVerificationCode(email, code); return { sent: true }; }
  // 未配置 SMTP：
  if (process.env.NODE_ENV === "production") throw new ServiceUnavailableException("邮件服务未配置");
  console.log(`[auth] dev code for ${email}: ${code}`);
  return { sent: true, devCode: code };   // 仅开发环境
  ```
- `send-code` 端点加限频（`auth.controller.ts`）：按 email 每 10 分钟最多 3 次，进程内存 Map 即可（参照 `chat.service.ts:8-16` 的 throttle 模式）

### 4. 询盘通知（`inquiries.service.ts`）

`create()` 成功后 `void this.mail.sendInquiryNotification(...)`（fire-and-forget，不阻塞响应）。邮件含：客户姓名/公司/邮箱/国家/需求描述前 200 字 + 管理台链接 `https://admin.hiwhale.com/inquiries`。

### 5. admin 设置页接通（`apps/admin/app/(dashboard)/settings/page.tsx`）

现状：SMTP 区"保存"和"发送测试邮件"是假 toast（:184-193）。改造：

- 保存 → `PUT /api/settings/smtp-config`，body 为 `{ host, port, user, from, enabled }` 的 JSON（**密码字段不入库**；密码只能走服务器 .env，UI 上密码框改为只读提示"在服务器环境变量配置"）
- 发送测试邮件 → 新端点 `POST /api/mail/test`（员工鉴权，body `{ to }`）：调用 `mail.verify()` 后向 `to` 发测试信，返回 `{ ok, error? }`。新建 `MailController` 承载，仅 SUPER_ADMIN 可用（参照 staff.controller.ts 的 requireSuperAdmin 模式）
- 通知设置开关（新询盘邮件提醒开/关）→ `PUT /api/settings/notification-prefs`；`sendInquiryNotification` 读取该键，`enabled === false` 时跳过

### 6. .env.example

确认 `SMTP_*` 段注释完整（host/port/user/password/from 含义、465 与 587 区别）。已在则不重复。

## 数据流

```
portal 注册 → POST /api/auth/send-code → AuthService → MailService.sendVerificationCode
portal 询盘 → POST /api/inquiries → InquiriesService.create → (fire-and-forget) MailService.sendInquiryNotification → SALES/SUPER_ADMIN 邮箱
admin 设置页 → POST /api/mail/test → MailService.verify + 测试信
```

## 验收

1. 未配 SMTP + `NODE_ENV=production`：`POST /api/auth/send-code` 返回 503，响应体**不含** devCode
2. 未配 SMTP + 开发环境：控制台打印验证码，响应含 devCode（保持现状体验）
3. 配好 SMTP：注册收到 HTML 验证码邮件；提交询盘后销售邮箱收到通知
4. admin 设置页点"发送测试邮件"有真实结果反馈（成功/失败原因）
5. 通知开关关闭后询盘不再发邮件
6. `pnpm type-check && pnpm lint` 全绿

## 禁止事项

- 不在邮件发送失败时让主流程（注册/询盘提交）失败
- 不把 SMTP_PASSWORD 存进 site_settings 表或任何数据库
- 不引入邮件队列（当前量级 nodemailer 直发即可，YAGNI）
