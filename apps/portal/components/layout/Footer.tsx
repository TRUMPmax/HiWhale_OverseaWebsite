"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/navigation";
import {
  APP_NAME,
  getLocalizedLabel,
  PRODUCT_CATEGORY_LABELS,
  ProductCategory,
} from "@hiwhale/shared/constants";

/** 页脚：深蓝背景，公司/产品/方案/联系方式 */
export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  const productCategories = Object.values(ProductCategory);

  return (
    <footer className="bg-brand-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 lg:px-12">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-heading text-lg font-bold">{APP_NAME}</h3>
            <p className="mt-4 text-sm text-white/70">{t("tagline")}</p>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider">
              {t("products")}
            </h4>
            <ul className="mt-4 space-y-2">
              {productCategories.map((category) => (
                <li key={category}>
                  <Link
                    href={`/products?category=${category}`}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {getLocalizedLabel(PRODUCT_CATEGORY_LABELS, category, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider">
              {t("solutions")}
            </h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/solutions" className="text-sm text-white/70 hover:text-white">
                  {t("solutionsEcommerce")}
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="text-sm text-white/70 hover:text-white">
                  {t("solutionsAutomotive")}
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="text-sm text-white/70 hover:text-white">
                  {t("solutions3pl")}
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="text-sm text-white/70 hover:text-white">
                  {t("solutionsColdChain")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider">
              {t("contact")}
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>{t("contactEmail")}</li>
              <li>{t("contactPhone")}</li>
              <li>{t("contactAddress")}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 企业信息条：近黑深色，与蓝白主体区分（版权/备案/法律链接） */}
      <div className="bg-[#061529]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row md:px-8 lg:px-12">
          <div className="flex flex-col items-center gap-1 text-center md:items-start md:text-left">
            <p className="text-sm text-white/50">{t("copyright", { year: currentYear })}</p>
            <p className="text-xs text-white/40">{t("icp")}</p>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="/privacy-policy" className="text-xs text-white/50 hover:text-white">
              {t("privacyPolicy")}
            </Link>
            <Link href="/terms" className="text-xs text-white/50 hover:text-white">
              {t("terms")}
            </Link>
            <Link href="/sitemap" className="text-xs text-white/50 hover:text-white">
              {t("sitemap")}
            </Link>
            <Link href="/cookie-policy" className="text-xs text-white/50 hover:text-white">
              {t("cookiePolicy")}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
