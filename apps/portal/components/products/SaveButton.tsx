"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Heart } from "lucide-react";
import { API_BASE, apiGet } from "@/lib/api";
import { useAuthStore } from "@/store/auth";

type SaveButtonProps = {
  productId: string;
};

/** 收藏按钮：未登录 → 打开登录弹窗；已登录 → 切换收藏（API 持久化） */
export function SaveButton({ productId }: SaveButtonProps) {
  const t = useTranslations("products.detail");
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!token) return;
    apiGet<{ items: Array<{ productId: string }> }>("/api/favorites", token)
      .then((data) => setSaved(data.items.some((f) => f.productId === productId)))
      .catch(() => {});
  }, [token, productId]);

  const toggle = async () => {
    if (!user || !token) {
      openAuthModal();
      return;
    }
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch(
        saved ? `${API_BASE}/api/favorites/${productId}` : `${API_BASE}/api/favorites`,
        {
          method: saved ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: saved ? undefined : JSON.stringify({ productId }),
        },
      );
      if (res.ok) setSaved(!saved);
    } catch {
      // 静默失败，下次进入页面会重新同步
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      className={`inline-flex items-center gap-2 rounded-lg border px-6 py-3 font-medium transition-colors ${
        mounted && saved
          ? "border-red-300 bg-red-50 text-red-600 hover:bg-red-100"
          : "hover:text-brand-blue border-slate-300 bg-white text-slate-600 hover:border-blue-300"
      }`}
    >
      <Heart className={`h-4 w-4 ${mounted && saved ? "fill-red-500 text-red-500" : ""}`} />
      {mounted && saved ? t("saved") : t("save")}
    </button>
  );
}
