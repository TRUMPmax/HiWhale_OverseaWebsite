"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/navigation";
import { BrandName } from "@/components/ui/BrandName";
import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";
import type { ContactInfo } from "@/components/about/types";
import { STATIC_TAXONOMY, taxonomyLabel, type TaxonomyGroup } from "@/lib/taxonomy";

/** 页脚：深蓝背景，公司/产品/方案/联系方式 */
export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  // 产品分类体系：优先 API（DB 实体），失败回退静态常量
  const [taxonomy, setTaxonomy] = useState<TaxonomyGroup[]>(STATIC_TAXONOMY);
  useEffect(() => {
    fetch(`${API_BASE}/api/taxonomy`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: TaxonomyGroup[]) => {
        if (Array.isArray(data) && data.length > 0) setTaxonomy(data);
      })
      .catch(() => {});
    // 联系方式：优先公司数据中台
    fetch(`${API_BASE}/api/settings/contact-info`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: { value?: ContactInfo }) => {
        if (data.value) setContact(data.value);
      })
      .catch(() => {});
  }, []);
  const [contact, setContact] = useState<ContactInfo | null>(null);

  return (
    <footer className="bg-brand-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 lg:px-12">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-heading text-lg font-bold">
              <BrandName variant="dark" />
            </h3>
            <p className="mt-4 text-sm text-white/70">{t("tagline")}</p>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider">
              {t("products")}
            </h4>
            {/* 只展示一级类目（产品分组）；超过 5 个时自动分两列 */}
            <ul
              className={`mt-4 ${
                taxonomy.length > 5 ? "grid grid-cols-2 gap-x-4 gap-y-2" : "space-y-2"
              }`}
            >
              {taxonomy.map((group) => (
                <li key={group.key}>
                  <Link
                    href={`/products?group=${group.key}`}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {taxonomyLabel(taxonomy, group.key, locale)}
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
              <li>{contact?.email ?? t("contactEmail")}</li>
              <li>{contact?.phone ?? t("contactPhone")}</li>
              <li>
                {locale === "zh"
                  ? (contact?.address ?? t("contactAddress"))
                  : (contact?.addressEn ?? contact?.address ?? t("contactAddress"))}
              </li>
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
