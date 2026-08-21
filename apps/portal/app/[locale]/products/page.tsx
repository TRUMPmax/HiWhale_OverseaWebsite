import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MOCK_PRODUCTS } from "@hiwhale/shared/constants";
import type { MockProduct } from "@hiwhale/shared/constants";
import { apiGet } from "@/lib/api";
import { ProductsBrowser } from "@/components/products/ProductsBrowser";

/** 从 API 获取产品列表；API 不可用时回退到内置 Mock（站点永不白屏） */
async function fetchProducts(): Promise<MockProduct[]> {
  try {
    const data = await apiGet<{ items: MockProduct[] }>("/api/products?pageSize=100");
    return data.items.length > 0 ? data.items : MOCK_PRODUCTS;
  } catch {
    return MOCK_PRODUCTS;
  }
}

/** 产品列表页：顶部横幅（服务端渲染）+ 可筛选产品网格（客户端组件） */
export default async function ProductsPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations("products");
  const products = await fetchProducts();

  return (
    <>
      <section className="bg-brand-navy text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
          <h1 className="font-heading text-3xl font-bold md:text-5xl">{t("banner.title")}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/70">{t("banner.subtitle")}</p>
        </div>
      </section>
      <Suspense fallback={null}>
        <ProductsBrowser products={products} />
      </Suspense>
    </>
  );
}
