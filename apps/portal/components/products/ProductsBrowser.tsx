"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  getLocalizedLabel,
  MOCK_PRODUCTS,
  PRODUCT_CATEGORY_LABELS,
  ProductCategory,
} from "@hiwhale/shared/constants";
import { ProductCard } from "./ProductCard";

/** 产品列表：品类筛选（读取 ?category= 作为初始值）+ 产品网格 */
export function ProductsBrowser() {
  const locale = useLocale();
  const t = useTranslations("products");
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "";
  const [active, setActive] = useState<ProductCategory | "all">(() =>
    (Object.values(ProductCategory) as string[]).includes(initialCategory)
      ? (initialCategory as ProductCategory)
      : "all",
  );

  const categories = Object.values(ProductCategory);
  const filtered =
    active === "all" ? MOCK_PRODUCTS : MOCK_PRODUCTS.filter((p) => p.category === active);

  const tabClass = (selected: boolean) =>
    `shrink-0 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
      selected
        ? "bg-brand-blue border-brand-blue text-white"
        : "border-slate-200 bg-white text-muted hover:border-blue-300 hover:text-brand-blue"
    }`;

  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
        <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
          <div className="flex gap-2 pb-2 md:flex-wrap">
            <button
              type="button"
              onClick={() => setActive("all")}
              className={tabClass(active === "all")}
            >
              {t("filters.all")}
            </button>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActive(category)}
                className={tabClass(active === category)}
              >
                {getLocalizedLabel(PRODUCT_CATEGORY_LABELS, category, locale)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product, index) => (
            <ProductCard key={product.slug} product={product} delay={index * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}
