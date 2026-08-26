import { Injectable } from "@nestjs/common";
import type { Response } from "express";
import { PrismaService } from "../../common/prisma/prisma.service";
import { RetrievalService } from "../knowledge/retrieval.service";
import type { ChatMessageDto } from "./chat.dto";

/** 用户聊天限频：每用户每分钟 N 条（内存实现，单实例够用；N 由 ai-settings.ratePerMin 配置，默认 20） */
const chatTimestamps = new Map<string, number[]>();
function throttle(userId: string, limit: number): boolean {
  const now = Date.now();
  const list = (chatTimestamps.get(userId) ?? []).filter((t) => t > now - 60_000);
  if (list.length >= limit) return false;
  list.push(now);
  chatTimestamps.set(userId, list);
  return true;
}

const BASE_SYSTEM_PROMPT = `You are HiWhale Robotics' AI product assistant. Answer questions about intelligent warehousing, AGV/AMR products, industry solutions and certifications in a professional, concise tone. Reply in the same language the user writes in (English or Chinese). Never invent specifications not provided to you. For pricing, quotations and delivery timelines, politely tell the customer that our sales engineers will contact them with a tailored proposal.`;

/** FAQ 上下文缓存（60s；FAQ 由后台维护，低成本替代 RAG） */
let faqCache: { text: string; ts: number } | null = null;

/** admin「AI 设置」保存的运行时配置（site_settings 键 ai-settings；密钥只走环境变量 DEEPSEEK_API_KEY，不入库） */
type AiConfig = {
  model?: string;
  systemPrompt?: string;
  ratePerMin?: string;
  dailyLimit?: string;
  fallback?: string;
};
let aiConfigCache: { cfg: AiConfig; ts: number } | null = null;

/** admin 模型选项 → DeepSeek 真实模型名 */
const MODEL_MAP: Record<string, string> = {
  "deepseek-v3": "deepseek-chat",
  "deepseek-r1": "deepseek-reasoner",
};

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly retrieval: RetrievalService,
  ) {}

  /** 读取 FAQ 列表并格式化为上下文文本（中英文问题都带上，bge 无关、纯 prompt 注入） */
  private async getFaqContext(): Promise<string> {
    if (faqCache && Date.now() - faqCache.ts < 60_000) return faqCache.text;
    const faqs = await this.prisma.faq.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
    const text = faqs
      .map((f) => {
        const q = f.questionEn ? `${f.question} / ${f.questionEn}` : f.question;
        const a = f.answerEn ? `${f.answer} / ${f.answerEn}` : f.answer;
        return `Q: ${q}\nA: ${a}`;
      })
      .join("\n---\n");
    faqCache = { text, ts: Date.now() };
    return text;
  }

  /** 读取 admin 保存的 AI 设置（60s 缓存；读取失败回退默认配置） */
  private async getAiConfig(): Promise<AiConfig> {
    if (aiConfigCache && Date.now() - aiConfigCache.ts < 60_000) return aiConfigCache.cfg;
    const row = await this.prisma.siteSetting.findUnique({ where: { key: "ai-settings" } });
    const cfg = (row?.value ?? {}) as AiConfig;
    aiConfigCache = { cfg, ts: Date.now() };
    return cfg;
  }

  /** SSE 流式对话：DeepSeek → token 事件 → 客户端 */
  async streamChat(userId: string, dto: ChatMessageDto, res: Response) {
    // SSE 响应头
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    res.flushHeaders();
    const send = (payload: object | string) =>
      res.write(`data: ${typeof payload === "string" ? payload : JSON.stringify(payload)}\n\n`);
    const fail = (message: string) => {
      send({ type: "error", message });
      send("[DONE]");
      res.end();
    };

    const aiConfig = await this.getAiConfig().catch(() => ({}) as AiConfig);

    if (!throttle(userId, Math.max(1, Number(aiConfig.ratePerMin) || 20))) {
      fail("发送太频繁，请稍后再试（每分钟最多 20 条）");
      return;
    }

    // 每日上限（每用户，按当日用户消息数计）
    const dailyLimit = Number(aiConfig.dailyLimit) || 0;
    if (dailyLimit > 0) {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayCount = await this.prisma.chatMessage.count({
        where: {
          role: "user",
          createdAt: { gte: todayStart },
          conversation: { userId },
        },
      });
      if (todayCount >= dailyLimit) {
        fail("今日 AI 对话次数已达上限，请明天再来或提交询盘联系我们");
        return;
      }
    }

    try {
      // 1. 会话：加载或创建
      let conversation = dto.conversationId
        ? await this.prisma.chatConversation.findFirst({
            where: { id: dto.conversationId, userId },
          })
        : null;
      if (!conversation) {
        conversation = await this.prisma.chatConversation.create({
          data: { userId, productContext: dto.productModel },
        });
      }

      // 2. 历史（最近 10 条）
      const history = await this.prisma.chatMessage.findMany({
        where: { conversationId: conversation.id },
        orderBy: { createdAt: "desc" },
        take: 10,
      });
      history.reverse();

      // 3. 用户消息入库
      const userMessage = await this.prisma.chatMessage.create({
        data: { conversationId: conversation.id, role: "user", content: dto.message },
      });
      await this.prisma.chatConversation.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() },
      });

      // 4. FAQ 上下文（低成本知识来源）+ RAG 检索桩（无结果时不附加上下文）
      const [faqText, chunks] = await Promise.all([
        this.getFaqContext().catch(() => ""),
        this.retrieval.retrieveContext(dto.message, {
          productModel: conversation.productContext ?? undefined,
        }),
      ]);
      let systemPrompt = aiConfig.systemPrompt?.trim() || BASE_SYSTEM_PROMPT;
      if (dto.productModel ?? conversation.productContext) {
        systemPrompt += `\nThe customer is currently viewing product model: ${dto.productModel ?? conversation.productContext}.`;
      }
      if (faqText) {
        systemPrompt += `\n\nFrequently asked questions (answer from these when relevant):\n${faqText}`;
      }
      if (chunks.length > 0) {
        systemPrompt += `\n\nRetrieved knowledge base context:\n${chunks.map((c) => c.content).join("\n---\n")}`;
      }

      // 5. 调用 DeepSeek（流式；模型由 ai-settings.model 映射，默认 deepseek-chat）
      const apiKey = process.env.DEEPSEEK_API_KEY;
      if (!apiKey) {
        fail("AI 服务未配置（缺少 DEEPSEEK_API_KEY）");
        return;
      }
      const dsRes = await fetch(
        `${process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com"}/chat/completions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: MODEL_MAP[aiConfig.model ?? ""] ?? "deepseek-chat",
            stream: true,
            stream_options: { include_usage: true },
            messages: [
              { role: "system", content: systemPrompt },
              ...history.map((m) => ({
                role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
                content: m.content,
              })),
              { role: "user", content: dto.message },
            ],
          }),
        },
      );
      if (!dsRes.ok || !dsRes.body) {
        fail(
          aiConfig.fallback === "human"
            ? `AI 服务暂时不可用（上游 ${dsRes.status}），请提交询盘或联系 mia@gdhjtech.com，我们的销售工程师将尽快回复`
            : `AI 服务暂时不可用（上游 ${dsRes.status}），请稍后再试`,
        );
        return;
      }

      // 6. 解析上游 SSE 并逐 token 转发
      const reader = dsRes.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let full = "";
      let tokens: number | null = null;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";
        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (data === "[DONE]") continue;
          try {
            const json = JSON.parse(data) as {
              choices?: Array<{ delta?: { content?: string } }>;
              usage?: { total_tokens?: number };
            };
            const content = json.choices?.[0]?.delta?.content;
            if (content) {
              full += content;
              send({ type: "token", content });
            }
            if (json.usage?.total_tokens) tokens = json.usage.total_tokens;
          } catch {
            // 忽略不完整分片
          }
        }
      }

      // 7. 助手消息入库
      const assistantMessage = await this.prisma.chatMessage.create({
        data: {
          conversationId: conversation.id,
          role: "assistant",
          content: full,
          tokens,
        },
      });
      await this.prisma.user.update({
        where: { id: userId },
        data: { aiUsageCount: { increment: 1 } },
      });

      send({ type: "done", conversationId: conversation.id, messageId: assistantMessage.id });
      send("[DONE]");
      res.end();
      void userMessage;
    } catch (e) {
      console.error("[chat] stream error:", e);
      fail("AI 服务暂时不可用，请稍后再试");
    }
  }

  /** 我的会话列表 */
  async listConversations(userId: string) {
    const items = await this.prisma.chatConversation.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: {
        _count: { select: { messages: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });
    return {
      items: items.map((c) => ({
        id: c.id,
        productModel: c.productContext,
        updatedAt: c.updatedAt.toISOString(),
        messageCount: c._count.messages,
        lastMessage: c.messages[0]?.content.slice(0, 80) ?? "",
      })),
    };
  }

  /** 会话消息（仅本人） */
  async listMessages(userId: string, conversationId: string) {
    const conversation = await this.prisma.chatConversation.findFirst({
      where: { id: conversationId, userId },
    });
    if (!conversation) return null;
    const messages = await this.prisma.chatMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });
    return {
      conversation: {
        id: conversation.id,
        productModel: conversation.productContext,
        updatedAt: conversation.updatedAt.toISOString(),
      },
      items: messages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        ts: m.createdAt.getTime(),
      })),
    };
  }

  /** 删除会话（仅本人） */
  async removeConversation(userId: string, conversationId: string) {
    const conversation = await this.prisma.chatConversation.findFirst({
      where: { id: conversationId, userId },
    });
    if (!conversation) return null;
    await this.prisma.chatConversation.delete({ where: { id: conversationId } });
    return { deleted: true };
  }

  // ---------- 管理端（staff） ----------

  /** 全部会话列表（含用户信息） */
  async adminListConversations() {
    const items = await this.prisma.chatConversation.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { messages: true } },
      },
    });
    return {
      items: items.map((c) => ({
        id: c.id,
        user: c.user.name,
        email: c.user.email,
        productModel: c.productContext,
        messageCount: c._count.messages,
        lastActive: c.updatedAt.toISOString().slice(0, 16).replace("T", " "),
        status: c.status,
      })),
    };
  }

  /** 会话消息（staff 查看） */
  async adminListMessages(conversationId: string) {
    const conversation = await this.prisma.chatConversation.findUnique({
      where: { id: conversationId },
      include: { user: { select: { name: true } } },
    });
    if (!conversation) return null;
    const messages = await this.prisma.chatMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });
    return {
      user: conversation.user.name,
      items: messages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        ts: m.createdAt.toISOString().slice(11, 16),
      })),
    };
  }

  /** 标注会话状态（normal / flagged / review） */
  async adminSetStatus(conversationId: string, status: string) {
    const exists = await this.prisma.chatConversation.findUnique({
      where: { id: conversationId },
    });
    if (!exists) return null;
    await this.prisma.chatConversation.update({
      where: { id: conversationId },
      data: { status },
    });
    return { ok: true, status };
  }
}
