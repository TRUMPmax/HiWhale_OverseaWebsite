"use client";

import { useLocale, useTranslations } from "next-intl";
import { Globe } from "lucide-react";
import { Link, usePathname } from "@/navigation";

type LocaleSwitcherProps = {
  /** dark：深色夜幕背景（未滚动的导航栏）；light：白色背景 */
  variant?: "dark" | "light";
};

/** 语言切换：EN / 中文 双段胶囊（Link 直切当前页面对应语言） */
export function LocaleSwitcher({ variant = "dark" }: LocaleSwitcherProps) {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();

  const isDark = variant === "dark";
  const base = "rounded-full px-2.5 py-1 text-sm transition-colors";
  const active = isDark ? "bg-white/15 text-white" : "bg-brand-light text-brand-blue";
  const inactive = isDark ? "text-white/60 hover:text-white" : "text-muted hover:text-foreground";

  return (
    <div
      className={`flex items-center gap-1 rounded-full border px-1.5 py-0.5 ${
        isDark ? "border-white/20" : "border-border"
      }`}
    >
      <Globe className={`h-4 w-4 ${isDark ? "text-white/60" : "text-muted"}`} />
      <Link
        href={pathname}
        locale="en"
        aria-label={t("english")}
        aria-current={locale === "en" ? "true" : undefined}
        className={`${base} ${locale === "en" ? active : inactive}`}
      >
        EN
      </Link>
      <Link
        href={pathname}
        locale="zh"
        aria-label={t("chinese")}
        aria-current={locale === "zh" ? "true" : undefined}
        className={`${base} ${locale === "zh" ? active : inactive}`}
      >
        中文
      </Link>
    </div>
  );
}
