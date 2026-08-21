import { Injectable } from "@nestjs/common";
import type { Response } from "express";
import { PrismaService } from "../../common/prisma/prisma.service";
import { RetrievalService } from "../knowledge/retrieval.service";
import type { ChatMessageDto } from "./chat.dto";

/** 用户聊天限频：每用户每分钟 20 条（内存实现，单实例够用） */
const chatTimestamps = new Map<string, number[]>();
function throttle(userId: string): boolean {
  const now = Date.now();
  const list = (chatTimestamps.get(userId) ?? []).filter((t) => t > now - 60_000);
  if (list.length >= 20) return false;
  list.push(now);
  chatTimestamps.set(userId, list);
  return true;
}

const BASE_SYSTEM_PROMPT = `You are HiWhale Robotics' AI product assistant. Answer questions about intelligent warehousing, AGV/AMR products, industry solutions and certifications in a professional, concise tone. Reply in the same language the user writes in (English or Chinese). Never invent specifications not provided to you. For pricing, quotations and delivery timelines, politely tell the customer that our sales engineers will contact them with a tailored proposal.`;

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly retrieval: RetrievalService,
  ) {}

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

    if (!throttle(userId)) {
      fail("发送太频繁，请稍后再试（每分钟最多 20 条）");
      return;
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

      // 4. RAG 检索桩（无结果时不附加上下文）
      const chunks = await this.retrieval.retrieveContext(dto.message, {
        productModel: conversation.productContext ?? undefined,
      });
      let systemPrompt = BASE_SYSTEM_PROMPT;
      if (dto.productModel ?? conversation.productContext) {
        systemPrompt += `\nThe customer is currently viewing product model: ${dto.productModel ?? conversation.productContext}.`;
      }
      if (chunks.length > 0) {
        systemPrompt += `\n\nRetrieved knowledge base context:\n${chunks.map((c) => c.content).join("\n---\n")}`;
      }

      // 5. 调用 DeepSeek（流式）
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
            model: "deepseek-chat",
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
        fail(`AI 服务暂时不可用（上游 ${dsRes.status}），请稍后再试`);
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
}
