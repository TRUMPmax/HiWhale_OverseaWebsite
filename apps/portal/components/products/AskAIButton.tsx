"use client";

import { useTranslations } from "next-intl";
import { Bot } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useChatStore } from "@/store/chat";

type AskAIButtonProps = {
  /** 当前产品名称（作为聊天上下文） */
  productName: string;
};

/**
 * “Ask AI”按钮：未登录 → 打开登录/注册弹窗；
 * 已登录 → 带上产品上下文打开 AI 聊天窗。
 */
export function AskAIButton({ productName }: AskAIButtonProps) {
  const t = useTranslations("products.detail");
  const openAuthModal = useAuthStore((s) => s.openAuthModal);
  const openChat = useChatStore((s) => s.openChat);
  const setProductContext = useChatStore((s) => s.setProductContext);

  return (
    <button
      type="button"
      onClick={() => {
        const isLoggedIn = Boolean(useAuthStore.getState().user);
        if (!isLoggedIn) {
          openAuthModal();
          return;
        }
        setProductContext(productName);
        openChat();
      }}
      className="text-brand-blue border-brand-blue inline-flex items-center gap-2 rounded-lg border bg-white px-6 py-3 font-medium transition-colors hover:bg-blue-50"
    >
      <Bot className="h-4 w-4" />
      {t("askAI")}
    </button>
  );
}
