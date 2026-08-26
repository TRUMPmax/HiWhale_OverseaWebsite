# 05 · Cloudflare Turnstile 防刷

> 先读 [README.md](README.md) §0 项目速览。范围：`apps/portal` 询盘表单/注册表单 + `api` 对应两个端点。规模小，前后端一次做完。

## 目标

堵住两个裸奔的公开端点：`POST /api/inquiries`（询盘）与 `POST /api/auth/send-code`（邮件验证码）。用人机验证替代/叠加现有内存限频。

## 现状

- `apps/portal/components/contact/ContactForm.tsx:192-195`：虚线框占位"上线前接入 Turnstile"
- `.env.example:69-70`：`NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` 已预留，**代码零引用**
- 现有防护： inquiries.service.ts:8 内存 Map 限频；auth send-code 无限频（02 模块会加，与本模块互补不冲突）
- 业主需先在 Cloudflare 控制台（免费）创建站点拿 site key + secret key

## 实施规格

### 1. portal 组件（新建 `apps/portal/components/ui/Turnstile.tsx`）

- 加载 `https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit`（useEffect 动态插 script，防重复加载）
- 渲染隐式 widget（`size: "invisible"` 或 normal，按设计稿选 normal 紧凑模式），拿到 token 后回调给父组件
- site key 读 `process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY`；**未配置时组件渲染 null 且回调 `null` token**（开发环境不阻塞流程）
- 组件需 `"use client"`；样式遵循品牌约定（README §0）

### 2. 接入两个表单

- `ContactForm.tsx`：删除 :192-195 占位框，挂 Turnstile；submit 时把 token 放进 POST body 字段 `turnstileToken`；token 为空且 site key 已配置时禁止提交（按钮 disabled + 提示）
- 注册表单（`components/auth/forms.tsx` send-code 流程）：同样挂 Turnstile，`POST /api/auth/send-code` body 加 `turnstileToken`
- 文案：双语言走 next-intl，`messages/{en,zh}.json` 同步加 key（如 `contact.verify.hint`）

### 3. api 校验（新建 `api/src/common/turnstile.ts`）

```ts
/** 校验 Turnstile token。未配置 TURNSTILE_SECRET_KEY 时直接放行（开发环境）。失败抛 BadRequestException("人机验证失败，请重试")。 */
export async function verifyTurnstile(token: string | undefined): Promise<void>;
```

实现：POST `https://challenges.cloudflare.com/turnstile/v0/siteverify`，`form: { secret, response: token }`，检查 `success === true`。

接入点：

- `inquiries.controller.ts` 的 create → DTO 加 `@IsOptional() @IsString() turnstileToken?: string`，service 或 controller 开头 `await verifyTurnstile(dto.turnstileToken)`
- `auth.controller.ts` send-code → 同上

## 数据流

```
浏览器表单 → Turnstile widget 拿 token → POST body.turnstileToken
  → api verifyTurnstile()（未配 secret 放行）→ 通过才进入业务逻辑
```

## 验收

1. 配置双 key 后：正常用户可无感通过（或一次点选）；curl 不带 token 直接 POST `/api/inquiries` 返回 400
2. 不配 key（开发机）：两个端点行为与现在完全一致
3. `messages/en.json` 与 `zh.json` key 集合保持同步
4. `pnpm type-check && pnpm lint` 全绿

## 禁止事项

- 不在未配置 site key 时阻塞任何表单（开发体验优先）
- 不把 secret key 写到任何前端文件或 .env.local 以外的地方（secret 只在 api）
- 不替换现有内存限频（两者叠加：Turnstile 防机器人、限频防滥刷）
