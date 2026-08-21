"use client";

import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/navigation";
import {
  getGroupOfCategory,
  getLocalizedLabel,
  PRODUCT_CATEGORY_GROUPS,
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_GROUP_LABELS,
  ProductCategory,
  ProductGroup,
} from "@hiwhale/shared/constants";
import type { MockProduct } from "@hiwhale/shared/constants";
import { ProductCard } from "./ProductCard";

const GROUP_VALUES = Object.values(ProductGroup) as string[];
const CATEGORY_VALUES = Object.values(ProductCategory) as string[];

/**
 * 产品列表：两级筛选（大类 → 品类），筛选状态存于 URL（?group= / ?category=），
 * 通过 router.replace(scroll:false) 更新，链接可分享且渲染平滑。
 * 数据由服务端页面传入（API 实时数据，失败时回退 Mock）。
 */
export function ProductsBrowser({ products }: { products: MockProduct[] }) {
  const locale = useLocale();
  const t = useTranslations("products");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get("category") ?? "";
  const groupParam = searchParams.get("group") ?? "";

  const activeCategory = CATEGORY_VALUES.includes(categoryParam)
    ? (categoryParam as ProductCategory)
    : null;
  // category 隐含其所属大类
  const activeGroup: ProductGroup | "all" = activeCategory
    ? getGroupOfCategory(activeCategory)
    : GROUP_VALUES.includes(groupParam)
      ? (groupParam as ProductGroup)
      : "all";

  const setParams = (params: Record<string, string>) => {
    const qs = new URLSearchParams(params).toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const filtered = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : activeGroup !== "all"
      ? products.filter((p) => getGroupOfCategory(p.category) === activeGroup)
      : products;

  const subcategories =
    activeGroup === "all"
      ? []
      : (PRODUCT_CATEGORY_GROUPS.find((g) => g.group === activeGroup)?.categories ?? []);

  const groupTabClass = (selected: boolean) =>
    `shrink-0 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
      selected
        ? "bg-brand-blue border-brand-blue text-white"
        : "border-slate-200 bg-white text-muted hover:border-blue-300 hover:text-brand-blue"
    }`;

  const chipClass = (selected: boolean) =>
    `shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
      selected
        ? "bg-blue-50 text-blue-700"
        : "bg-white text-muted border border-slate-200 hover:border-blue-300 hover:text-brand-blue"
    }`;

  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
        {/* 一级：大类 */}
        <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
          <div className="flex gap-2 pb-2 md:flex-wrap">
            <button
              type="button"
              onClick={() => setParams({})}
              className={groupTabClass(activeGroup === "all" && !activeCategory)}
            >
              {t("filters.all")}
            </button>
            {PRODUCT_CATEGORY_GROUPS.map(({ group }) => (
              <button
                key={group}
                type="button"
                onClick={() => setParams({ group })}
                className={groupTabClass(activeGroup === group)}
              >
                {getLocalizedLabel(PRODUCT_GROUP_LABELS, group, locale)}
              </button>
            ))}
          </div>
        </div>

        {/* 二级：品类（仅当所选大类含多个品类时显示） */}
        {subcategories.length > 1 && (
          <div className="-mx-4 mt-3 overflow-x-auto px-4 md:mx-0 md:px-0">
            <div className="flex items-center gap-2 pb-1 md:flex-wrap">
              <button
                type="button"
                onClick={() => setParams({ group: activeGroup })}
                className={chipClass(!activeCategory)}
              >
                {t("filters.allInGroup", {
                  group: getLocalizedLabel(PRODUCT_GROUP_LABELS, activeGroup, locale),
                })}
              </button>
              {subcategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setParams({ category })}
                  className={chipClass(activeCategory === category)}
                >
                  {getLocalizedLabel(PRODUCT_CATEGORY_LABELS, category, locale)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product, index) => (
            <ProductCard key={product.slug} product={product} delay={index * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}
