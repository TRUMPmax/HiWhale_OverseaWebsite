import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { fetchProducts } from "@/lib/content";
import { fetchTaxonomy } from "@/lib/taxonomy";
import { ProductsBrowser } from "@/components/products/ProductsBrowser";

/** 产品列表页：顶部横幅（服务端渲染）+ 可筛选产品网格（客户端组件） */
export default async function ProductsPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations("products");
  const [products, taxonomy] = await Promise.all([fetchProducts(), fetchTaxonomy()]);

  return (
    <>
      <section className="bg-brand-navy text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
          <h1 className="font-heading text-3xl font-bold md:text-5xl">{t("banner.title")}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/70">{t("banner.subtitle")}</p>
        </div>
      </section>
      <Suspense fallback={null}>
        <ProductsBrowser products={products} taxonomy={taxonomy} />
      </Suspense>
    </>
  );
}
