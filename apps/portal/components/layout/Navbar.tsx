"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/navigation";
import { Menu, X, Globe, User } from "lucide-react";
import { BrandName } from "@/components/ui/BrandName";

/** 顶部导航栏：滚动变白 + 模糊 + 高度收缩 */
export function Navbar() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const currentLocale = pathname.startsWith("/zh") ? "zh" : "en";

  const switchLocale = (locale: string) => {
    router.replace(pathname, { locale });
  };

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
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-foreground hover:text-brand-blue text-sm font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <div className="relative flex items-center gap-1">
            <Globe className="text-muted h-4 w-4" />
            <select
              aria-label={tc("language")}
              className="text-foreground bg-transparent text-sm outline-none"
              value={currentLocale}
              onChange={(e) => switchLocale(e.target.value)}
            >
              <option value="en">{tc("english")}</option>
              <option value="zh">{tc("chinese")}</option>
            </select>
          </div>
          <Link
            href="/auth/login"
            className="bg-brand-blue flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <User className="h-4 w-4" />
            {tc("login")}
          </Link>
        </div>

        <button
          className="md:hidden"
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
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground text-base font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 pt-2">
              <Globe className="text-muted h-4 w-4" />
              <select
                aria-label={tc("language")}
                className="bg-transparent text-sm"
                value={currentLocale}
                onChange={(e) => switchLocale(e.target.value)}
              >
                <option value="en">{tc("english")}</option>
                <option value="zh">{tc("chinese")}</option>
              </select>
            </div>
            <Link
              href="/auth/login"
              className="bg-brand-blue rounded-lg px-4 py-2 text-center text-sm font-medium text-white"
            >
              {tc("login")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
