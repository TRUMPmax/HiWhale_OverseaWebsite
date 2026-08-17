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
    <footer className="bg-brand-navy py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
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

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-white/60">{t("copyright", { year: currentYear })}</p>
          <Link href="/privacy-policy" className="text-sm text-white/60 hover:text-white">
            {t("privacyPolicy")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
