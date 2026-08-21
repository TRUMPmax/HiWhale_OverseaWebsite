"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { LoginForm, RegisterForm } from "./forms";

type Tab = "login" | "register";

/** 全局登录/注册弹窗（挂载于 [locale] layout） */
export function AuthModal() {
  const t = useTranslations("auth");
  const isOpen = useAuthStore((s) => s.isAuthModalOpen);
  const closeAuthModal = useAuthStore((s) => s.closeAuthModal);
  const [tab, setTab] = useState<Tab>("login");

  if (!isOpen) return null;

  const tabClass = (selected: boolean) =>
    `flex-1 border-b-2 py-3 text-sm font-medium transition-colors ${
      selected
        ? "border-brand-blue text-brand-blue"
        : "border-border text-muted hover:text-foreground"
    }`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={closeAuthModal}
    >
      <div
        className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label={t("close")}
          onClick={closeAuthModal}
          className="text-subtle hover:text-foreground absolute right-4 top-4"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="font-heading text-foreground text-xl font-bold">
          {tab === "login" ? t("loginTitle") : t("registerTitle")}
        </h2>

        <div className="mt-4 flex">
          <button
            type="button"
            className={tabClass(tab === "login")}
            onClick={() => setTab("login")}
          >
            {t("loginTab")}
          </button>
          <button
            type="button"
            className={tabClass(tab === "register")}
            onClick={() => setTab("register")}
          >
            {t("registerTab")}
          </button>
        </div>

        {tab === "login" ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
}
