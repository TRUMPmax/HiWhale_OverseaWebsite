"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { MessageSquareText, X } from "lucide-react";

export type StoredChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  ts: number;
};

type ChatHistoryViewerProps = {
  /** 静态消息列表（本地缓存模式） */
  messages?: StoredChatMessage[];
  /** 点击卡片时按需加载消息（API 模式） */
  fetchMessages?: () => Promise<StoredChatMessage[]>;
  /** 卡片标题/副标题覆盖（会话列表模式） */
  title?: string;
  subtitle?: string;
};

/** AI 对话历史：摘要卡片 → 点击打开完整会话弹窗 */
export function ChatHistoryViewer({
  messages: staticMessages,
  fetchMessages,
  title,
  subtitle,
}: ChatHistoryViewerProps) {
  const t = useTranslations("dashboard.chatHistory");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<StoredChatMessage[]>(staticMessages ?? []);

  const lastMessage = messages[messages.length - 1];

  const openViewer = async () => {
    if (fetchMessages) {
      setLoading(true);
      try {
        setMessages(await fetchMessages());
      } catch {
        // 加载失败也打开（显示已有内容/空态）
      } finally {
        setLoading(false);
      }
    }
    setOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={openViewer}
        className="flex w-full items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 text-left transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
      >
        <span className="bg-brand-blue/10 text-brand-blue flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
          <MessageSquareText className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="text-foreground block truncate text-sm font-semibold">
            {title ?? t("messagesCount", { count: messages.length })}
          </span>
          <span className="text-subtle mt-0.5 block truncate text-xs">
            {loading
              ? "…"
              : (subtitle ??
                (lastMessage
                  ? `${t("lastActive")}: ${new Date(lastMessage.ts).toLocaleString(locale)}`
                  : ""))}
          </span>
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex max-h-[80vh] w-full max-w-2xl flex-col rounded-xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-border flex items-center justify-between border-b px-6 py-4">
              <h2 className="font-heading text-foreground text-lg font-bold">{t("viewTitle")}</h2>
              <button
                type="button"
                aria-label={t("close")}
                onClick={() => setOpen(false)}
                className="text-subtle hover:text-foreground rounded-lg p-1.5 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-6">
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
                      <div
                        className={`mb-0.5 text-[0.625rem] ${
                          message.role === "user" ? "text-white/60" : "text-subtle"
                        }`}
                      >
                        {message.role === "user" ? t("you") : t("assistant")} ·{" "}
                        {new Date(message.ts).toLocaleString(locale)}
                      </div>
                      {message.content}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
