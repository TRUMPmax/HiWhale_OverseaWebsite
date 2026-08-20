"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Bot, Maximize2, Minimize2, Send, Trash2, X } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useChatStore } from "@/store/chat";
import { getMockReply } from "./mock-replies";

type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  ts: number;
};

const STORAGE_KEY = "hiwhale-chat";
const QUICK_KEYS = ["quick1", "quick2", "quick3"] as const;

/** AI 聊天窗：FAB + 对话窗口，仅登录用户可见；Mock 回复 + 打字机效果 */
export function AIChatWidget() {
  const t = useTranslations("chat");
  const locale = useLocale();
  const user = useAuthStore((s) => s.user);
  const isChatOpen = useChatStore((s) => s.isChatOpen);
  const openChat = useChatStore((s) => s.openChat);
  const closeChat = useChatStore((s) => s.closeChat);
  const productContext = useChatStore((s) => s.productContext);
  const setProductContext = useChatStore((s) => s.setProductContext);

  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  /** 打字机进行中（禁用输入） */
  const [typing, setTyping] = useState(false);
  /** 回复前的“正在输入”指示 */
  const [awaitingReply, setAwaitingReply] = useState(false);
  /** 窗口放大（桌面端居中最大化） */
  const [maximized, setMaximized] = useState(false);
  /** 窗口拖动偏移（相对默认右下角锚点，仅桌面端） */
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; baseX: number; baseY: number } | null>(
    null,
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  // 挂载后读取历史
  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setMessages(JSON.parse(raw) as ChatMessage[]);
    } catch {
      // 损坏数据忽略
    }
  }, []);

  // 持久化（保留最近 100 条）
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-100)));
  }, [messages, mounted]);

  // 产品上下文：打开聊天窗时插入一条系统提示行
  useEffect(() => {
    if (isChatOpen && productContext) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ctx-${Date.now()}`,
          role: "system",
          content: t("contextLine", { name: productContext }),
          ts: Date.now(),
        },
      ]);
      setProductContext(null);
    }
  }, [isChatOpen, productContext, setProductContext, t]);

  // 自动滚动到底部
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, awaitingReply, isChatOpen]);

  const send = (text: string) => {
    const content = text.trim();
    if (!content || typing || awaitingReply) return;

    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", content, ts: Date.now() },
    ]);
    setInput("");
    setAwaitingReply(true);

    const reply = getMockReply(content, locale === "zh" ? "zh" : "en");
    const replyId = `a-${Date.now()}`;

    window.setTimeout(() => {
      setAwaitingReply(false);
      setTyping(true);
      setMessages((prev) => [
        ...prev,
        { id: replyId, role: "assistant", content: "", ts: Date.now() },
      ]);
      let index = 0;
      const timer = window.setInterval(() => {
        index += 15 + Math.floor(Math.random() * 10);
        const done = index >= reply.length;
        const slice = reply.slice(0, index);
        setMessages((prev) => prev.map((m) => (m.id === replyId ? { ...m, content: slice } : m)));
        if (done) {
          window.clearInterval(timer);
          setTyping(false);
        }
      }, 50);
    }, 600);
  };

  const clearHistory = () => setMessages([]);

  /** 头部拖动（仅桌面端、非最大化时；点在按钮上不触发） */
  const onHeaderPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (maximized || window.innerWidth < 640) return;
    if ((e.target as HTMLElement).closest("button")) return;
    dragRef.current = { startX: e.clientX, startY: e.clientY, baseX: pos.x, baseY: pos.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onHeaderPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    // 限制在视口内，保证窗口始终可用
    const nx = Math.min(
      Math.max(drag.baseX + e.clientX - drag.startX, -(window.innerWidth - 160)),
      window.innerWidth - 160,
    );
    const ny = Math.min(
      Math.max(drag.baseY + e.clientY - drag.startY, -(window.innerHeight - 120)),
      window.innerHeight - 120,
    );
    setPos({ x: nx, y: ny });
  };
  const onHeaderPointerUp = () => {
    dragRef.current = null;
  };

  // 未挂载（SSR/水合前）或未登录：不渲染
  if (!mounted || !user) return null;

  return (
    <>
      {/* FAB */}
      {!isChatOpen && (
        <button
          type="button"
          onClick={openChat}
          aria-label={t("title")}
          className="bg-brand-blue fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-110"
        >
          <Bot className="h-6 w-6" />
        </button>
      )}

      {/* 聊天窗口（移动端全屏；桌面端可拖动 + 可放大） */}
      {isChatOpen && (
        <div
          style={
            !maximized && (pos.x !== 0 || pos.y !== 0)
              ? { transform: `translate(${pos.x}px, ${pos.y}px)` }
              : undefined
          }
          className={`fixed inset-0 z-40 flex flex-col border border-slate-200 bg-white shadow-2xl ${
            maximized
              ? "sm:inset-0 sm:m-auto sm:h-[85vh] sm:w-[min(56rem,92vw)] sm:max-w-none sm:rounded-xl"
              : "sm:inset-auto sm:bottom-20 sm:right-6 sm:h-[32rem] sm:max-h-[80vh] sm:w-96 sm:max-w-[calc(100vw-2rem)] sm:rounded-xl"
          }`}
        >
          {/* 头部（桌面端可拖动） */}
          <div
            onPointerDown={onHeaderPointerDown}
            onPointerMove={onHeaderPointerMove}
            onPointerUp={onHeaderPointerUp}
            className={`bg-brand-navy flex touch-none select-none items-center gap-2 px-4 py-3 text-white sm:rounded-t-xl ${
              maximized ? "" : "sm:cursor-move"
            }`}
          >
            <Bot className="h-5 w-5" />
            <span className="font-heading text-sm font-bold">{t("title")}</span>
            <span className="ml-1 flex items-center gap-1 text-xs text-white/70">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              {t("online")}
            </span>
            <div className="ml-auto flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMaximized((v) => !v)}
                aria-label={maximized ? t("minimize") : t("maximize")}
                className="hidden rounded p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:block"
              >
                {maximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={clearHistory}
                aria-label={t("clear")}
                className="rounded p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={closeChat}
                aria-label={t("close")}
                className="rounded p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* 消息区 */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                <p className="text-muted max-w-xs text-sm leading-relaxed">{t("welcome")}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {QUICK_KEYS.map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => send(t(key))}
                      className="text-brand-blue rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs transition-colors hover:bg-blue-100"
                    >
                      {t(key)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) =>
              message.role === "system" ? (
                <p key={message.id} className="text-subtle text-center text-xs">
                  {message.content}
                </p>
              ) : (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                      message.role === "user"
                        ? "bg-brand-blue text-white"
                        : "text-foreground bg-blue-50"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ),
            )}

            {awaitingReply && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-xl bg-blue-50 px-3 py-2">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="bg-brand-blue/60 h-1.5 w-1.5 animate-bounce rounded-full"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 输入区 */}
          <form
            className="border-border flex items-center gap-2 border-t p-3"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("inputPlaceholder")}
              disabled={typing || awaitingReply}
              className="border-border focus:border-brand-blue flex-1 rounded-lg border px-3 py-2 text-sm outline-none transition-colors disabled:opacity-60"
            />
            <button
              type="submit"
              aria-label={t("send")}
              disabled={typing || awaitingReply || !input.trim()}
              className="bg-brand-blue flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
