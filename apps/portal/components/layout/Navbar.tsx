"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { ChevronDown, Menu, X, User } from "lucide-react";
import { BrandName } from "@/components/ui/BrandName";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { useAuthStore } from "@/store/auth";
import {
  getLocalizedLabel,
  PRODUCT_CATEGORY_GROUPS,
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_GROUP_LABELS,
} from "@hiwhale/shared/constants";

/** 顶部导航栏：滚动变白 + 模糊 + 高度收缩；产品项带两级下拉（桌面端） */
export function Navbar() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  /** 挂载前不渲染登录态相关 UI，避免水合不一致 */
  const [mounted, setMounted] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/" as const, label: t("home") },
    { href: "/products" as const, label: t("products") },
    { href: "/solutions" as const, label: t("solutions") },
    { href: "/cases" as const, label: t("cases") },
    { href: "/about" as const, label: t("about") },
    { href: "/contact" as const, label: t("contact") },
  ];

  // 未滚动时导航栏透明，浮在深色 Hero 上，文字用浅色
  const navLinkClass = `text-sm font-medium transition-colors hover:text-brand-blue ${
    scrolled ? "text-foreground" : "text-white/85"
  }`;

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 py-3 shadow-sm backdrop-blur-md" : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-8 lg:px-12">
        <Link href="/" className="font-heading text-xl font-bold">
          <BrandName variant={scrolled ? "light" : "dark"} />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) =>
            item.href === "/products" ? (
              <div key={item.href} className="group relative">
                <Link href={item.href} className={`${navLinkClass} flex items-center gap-1`}>
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                </Link>
                {/* 两级产品下拉：大类 + 品类 */}
                <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 translate-y-2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="w-[30rem] rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                    {PRODUCT_CATEGORY_GROUPS.map(({ group, categories }) => (
                      <div
                        key={group}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-slate-50"
                      >
                        <Link
                          href={`/products?group=${group}`}
                          className="text-foreground hover:text-brand-blue w-32 shrink-0 text-sm font-semibold"
                        >
                          {getLocalizedLabel(PRODUCT_GROUP_LABELS, group, locale)}
                        </Link>
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                          {categories.map((category) => (
                            <Link
                              key={category}
                              href={`/products?category=${category}`}
                              className="text-muted hover:text-brand-blue text-sm"
                            >
                              {getLocalizedLabel(PRODUCT_CATEGORY_LABELS, category, locale)}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link key={item.href} href={item.href} className={navLinkClass}>
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <LocaleSwitcher variant={scrolled ? "light" : "dark"} />
          {/* 登录态：未登录 → 登录/注册；已登录 → 头像下拉 */}
          {mounted && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-label={user.name}
                className="bg-brand-blue flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90"
              >
                {user.name.charAt(0).toUpperCase()}
              </button>
              {userMenuOpen && (
                <>
                  <button
                    type="button"
                    aria-hidden="true"
                    tabIndex={-1}
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full z-50 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                    <div className="border-border truncate border-b px-3 py-2">
                      <div className="text-foreground truncate text-sm font-medium">
                        {user.name}
                      </div>
                      <div className="text-subtle truncate text-xs">{user.email}</div>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="text-foreground hover:text-brand-blue block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-slate-50"
                    >
                      {tc("dashboard")}
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="text-muted hover:text-brand-blue block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-slate-50"
                    >
                      {tc("logout")}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : mounted ? (
            <>
              <Link
                href="/auth/register"
                className="text-brand-blue border-brand-blue rounded-lg border bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-blue-50"
              >
                {tc("signup")}
              </Link>
              <Link
                href="/auth/login"
                className="bg-brand-blue flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                <User className="h-4 w-4" />
                {tc("login")}
              </Link>
            </>
          ) : null}
        </div>

        <button
          className={`md:hidden ${scrolled || mobileOpen ? "text-foreground" : "text-white"}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={tc("toggleMenu")}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-border border-t bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <div key={item.href} className="flex flex-col gap-4">
                <Link
                  href={item.href}
                  className="text-foreground text-base font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {/* 移动端：产品大类缩进列表 */}
                {item.href === "/products" && (
                  <div className="flex flex-col gap-3 border-l-2 border-slate-100 pl-4">
                    {PRODUCT_CATEGORY_GROUPS.map(({ group }) => (
                      <Link
                        key={group}
                        href={`/products?group=${group}`}
                        className="text-muted text-sm"
                        onClick={() => setMobileOpen(false)}
                      >
                        {getLocalizedLabel(PRODUCT_GROUP_LABELS, group, locale)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-2">
              <LocaleSwitcher variant="light" />
            </div>
            {/* 移动端登录态 */}
            {mounted && user ? (
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-center gap-3">
                  <span className="bg-brand-blue flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <div className="text-foreground truncate text-sm font-medium">{user.name}</div>
                    <div className="text-subtle truncate text-xs">{user.email}</div>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  className="bg-brand-blue rounded-lg px-4 py-2 text-center text-sm font-medium text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {tc("dashboard")}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="text-muted border-border rounded-lg border px-4 py-2 text-sm font-medium"
                >
                  {tc("logout")}
                </button>
              </div>
            ) : mounted ? (
              <div className="flex gap-3 pt-2">
                <Link
                  href="/auth/register"
                  className="text-brand-blue border-brand-blue flex-1 rounded-lg border px-4 py-2 text-center text-sm font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  {tc("signup")}
                </Link>
                <Link
                  href="/auth/login"
                  className="bg-brand-blue flex-1 rounded-lg px-4 py-2 text-center text-sm font-medium text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {tc("login")}
                </Link>
              </div>
            ) : null}
          </nav>
        </div>
      )}
    </header>
  );
}
