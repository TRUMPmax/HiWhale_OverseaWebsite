"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/navigation";
import { useAuthStore } from "@/store/auth";
import { LoginForm, RegisterForm } from "./forms";

type AuthPageCardProps = {
  mode: "login" | "register";
};

/** 登录/注册页卡片：已登录时重定向到 dashboard（挂载后再读取持久化登录态，避免水合不一致） */
export function AuthPageCard({ mode }: AuthPageCardProps) {
  const t = useTranslations("auth");
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && user) router.replace("/dashboard");
  }, [mounted, user, router]);

  if (!mounted || user) {
    return <div className="h-96 w-full max-w-md" aria-hidden="true" />;
  }

  return (
    <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <h1 className="font-heading text-foreground text-xl font-bold">
        {mode === "login" ? t("loginTitle") : t("registerTitle")}
      </h1>

      {mode === "login" ? (
        <LoginForm onSuccess={() => router.replace("/dashboard")} />
      ) : (
        <RegisterForm onSuccess={() => router.replace("/dashboard")} />
      )}

      <p className="text-muted mt-6 text-center text-sm">
        {mode === "login" ? t("noAccount") : t("hasAccount")}{" "}
        <Link
          href={mode === "login" ? "/auth/register" : "/auth/login"}
          className="text-brand-blue font-medium hover:underline"
        >
          {mode === "login" ? t("registerTab") : t("loginTab")}
        </Link>
      </p>
    </div>
  );
}
