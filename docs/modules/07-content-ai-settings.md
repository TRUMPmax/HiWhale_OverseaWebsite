# 07 · 内容管理接通 + AI 设置生效 + 仪表盘真实数据

> **状态：已由主会话实施完成（2026-08-25）**。执行情况：A1 Banner tab 已下线、A2 多语言文案 tab 已下线、A3 Footer 链接已接通（portal Footer 消费 `content-footer-links`）、C 死链已删、B AI 设置已生效（model/systemPrompt/ratePerMin/dailyLimit/fallback，密钥只走环境变量）、D 假待办/假浏览量已清。本文档留作实现记录。
> 先读 [README.md](README.md) §0 项目速览。范围：`apps/admin` 三个页面 + `apps/portal` 消费端 + `api` chat/settings 小改。

## 目标

消灭"保存成功但不生效"的假功能：admin 内容管理保存的东西 portal 真的能渲染，AI 设置保存后 chat 真的按配置走，仪表盘数字全部来自真实统计。

## 现状与决策点

### A. 内容管理页（`apps/admin/app/(dashboard)/content/page.tsx`）

保存后端已通（site_settings KV），但 portal 消费情况：

| 设置键                                             | portal 消费方            | 状态         |
| -------------------------------------------------- | ------------------------ | ------------ |
| `content-privacy`                                  | 隐私政策页               | ✅ 已消费    |
| `company-stats` / `company-about` / `contact-info` | 首页统计/about 页/Footer | ✅ 已消费    |
| `content-banners`                                  | **无**                   | ❌ 决策点 A1 |
| `content-copy`                                     | **无**                   | ❌ 决策点 A2 |
| `content-footer-links`                             | **无**                   | ❌ 决策点 A3 |

- **A1 推荐：接通**——portal 首页 Hero 区已是单主视觉，无 banner 轮播；如无轮播设计则**下线该 tab**。推荐下线（首页设计已定型，YAGNI）
- **A2 推荐：下线**——portal 文案走 next-intl 双文件，DB 单语文案与双语体系冲突；接通会破坏 i18n。推荐下线该 tab
- **A3 推荐：接通**——Footer 链接（`apps/portal/components/layout/Footer.tsx:18-33` 已有 settings 消费模式）按 `content-footer-links` 渲染链接列；同时顺手修复死链：链接目标页面不存在时不渲染该项（/terms、/sitemap、/cookie-policy 页面不存在，见下方 C）

### B. AI 设置（`apps/admin/app/(dashboard)/ai-settings/page.tsx` ↔ `api/src/modules/chat/`）

现状：保存到 `/api/settings/ai-settings`（真实落库），但 `chat.service.ts` 从不读取 → 保存不生效。页头注释":24 Mock 保存"已过时。

**接通规格**（chat.service.ts 改动，小）：

- 缓存读取：`getAiConfig()`——读 `site_settings` 键 `ai-settings`，60s 内存缓存
- 生效字段映射：
  - `model` → DeepSeek 请求体 `model`（默认 `deepseek-chat`）
  - `systemPromptExtra` → 追加到 `BASE_SYSTEM_PROMPT` 后
  - `rateLimitPerMinute` → 替换 `throttle()` 硬编码的 20
  - `enabled === false` → chat 端点直接 fail("AI 客服已下线维护")
  - API Key **不从这个设置读**（密钥只走环境变量 `DEEPSEEK_API_KEY`；UI 上的 key 输入框改为只读说明）
- admin 页头注释删"Mock 保存"；保存成功后 toast 注明"约 1 分钟内生效"

### C. portal 页脚死链（`Footer.tsx:126-134`）

`/terms`、`/sitemap`、`/cookie-policy` 三链接 404。处理（主会话可直接做，若 A3 接通则由设置驱动）：

- **推荐：删链接**（最简，符合 YAGNI）；保留 `/privacy-policy`（页面存在）
- 若业主要条款页：走 `content-terms` 设置键 + 仿照 privacy-policy 页渲染（此场景才写页面）

### D. 仪表盘真实数据（`apps/admin/app/(dashboard)/dashboard/page.tsx`）

- 假待办 `TODOS`（:47-60）→ 改为真实派生：`GET /api/stats/dashboard` 已有聚合；待办 = 新询盘数（status=NEW 计数，inquiries API 已有筛选）+ 向量化失败文档数（knowledge list API 有 vectorStatus）。渲染规则：无待办显示"全部处理完毕"，不造假
- 假浏览量卡片（:94-98，"产品浏览量 8,209 示例数据"）→ **删除该卡片**（埋点未接入，无真实数据源；将来接统计后恢复）
- `TrendChart.tsx:27-38` 伪随机回退 → `stats.trend` 为空时显示"暂无数据"空态，并在图角加"演示数据"水印的条件分支删除

## 实施清单（按文件）

1. `admin/content/page.tsx`：按 A1/A2 决策删 Banner/多语言文案 tab（保留 Banner 素材位管理在"素材管理"页，不受影响）；Footer 链接 tab 保留并按 A3 接通
2. `portal/Footer.tsx`：链接列读 `content-footer-links`（fetchSetting 模式已有，失败回退现有 i18n 默认链接并剔除死链）
3. `api/chat.service.ts`：B 节四处字段生效 + `getAiConfig()` 缓存
4. `admin/ai-settings/page.tsx`：key 输入框只读化 + 注释清理 + toast 文案
5. `admin/dashboard/page.tsx` + `TrendChart.tsx`：D 节

## 验收

1. admin 改 Footer 链接保存 → portal 页脚 1 分钟内变化；死链不再出现
2. admin 把 AI 客服 enabled 关掉 → portal 聊天发消息收到维护提示；改 model 后对话响应元数据变化
3. 仪表盘无硬编码数字；空数据时显示空态而非假曲线
4. `pnpm type-check && pnpm lint` 全绿；`messages/en.json`/`zh.json` key 同步

## 禁止事项

- 不把 DEEPSEEK_API_KEY 存进 site_settings
- content-copy 若决定接通必须先解决双语问题（推荐直接下线，勿过度设计）
- 不新建统计/埋点系统（浏览量卡片删除即可）
