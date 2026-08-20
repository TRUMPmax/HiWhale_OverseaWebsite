"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Bot, X } from "lucide-react";
import { useAuthStore } from "@/store/auth";

/**
 * “Ask AI”按钮：未登录 → 打开登录/注册弹窗；已登录 → 展示可关闭的提示气泡。
 */
export function AskAIButton() {
  const t = useTranslations("products.detail");
  const user = useAuthStore((s) => s.user);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);
  const [showNotice, setShowNotice] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => (user ? setShowNotice((v) => !v) : openAuthModal())}
        className="text-brand-blue border-brand-blue inline-flex items-center gap-2 rounded-lg border bg-white px-6 py-3 font-medium transition-colors hover:bg-blue-50"
      >
        <Bot className="h-4 w-4" />
        {t("askAI")}
      </button>
      {showNotice && user && (
        <div className="text-muted absolute left-0 top-full z-20 mt-2 w-64 rounded-lg border border-slate-200 bg-white p-3 pr-8 text-sm shadow-lg">
          <button
            type="button"
            aria-label={t("dismiss")}
            onClick={() => setShowNotice(false)}
            className="text-subtle hover:text-foreground absolute right-2 top-2"
          >
            <X className="h-4 w-4" />
          </button>
          {t("aiReady")}
        </div>
      )}
    </div>
  );
}
