import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Download, Radar, ShieldCheck, Wifi, Zap } from "lucide-react";
import {
  getGroupOfCategory,
  getLocalizedLabel,
  getRelatedProducts,
  INDUSTRY_LABELS,
  MOCK_PRODUCTS,
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_GROUP_LABELS,
  ProductCategory,
} from "@hiwhale/shared/constants";
import type { MockProduct } from "@hiwhale/shared/constants";
import { fetchProduct, fetchProducts } from "@/lib/content";
import { Link } from "@/navigation";
import { Placeholder } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { Starfield } from "@/components/ui/Starfield";
import { ProductCard } from "@/components/products/ProductCard";
import { AskAIButton } from "@/components/products/AskAIButton";
import {
  InterfaceShowcaseSection,
  Viewer3DSection,
} from "@/components/products/ProductMediaSections";

const FEATURE_ICONS = [Zap, ShieldCheck, Radar, Wifi];

/** 软件类产品：详情页以“界面展示”替代 360° 3D 查看器 */
const SOFTWARE_CATEGORIES: ProductCategory[] = [ProductCategory.WCS, ProductCategory.IWMS];

export function generateStaticParams() {
  return MOCK_PRODUCTS.map((product) => ({ slug: product.slug }));
}

/** 相关产品：优先 API 列表，失败回退 Mock */
async function fetchRelated(product: MockProduct): Promise<MockProduct[]> {
  try {
    const all = await fetchProducts();
    return all
      .filter((p) => p.category === product.category && p.slug !== product.slug)
      .slice(0, 3);
  } catch {
    return getRelatedProducts(product, 3);
  }
}

/** 产品详情页 */
export default async function ProductDetailPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(locale);
  const product = await fetchProduct(slug);
  if (!product) notFound();

  const t = await getTranslations("products.detail");
  const tCta = await getTranslations("products.cta");
  const loc = locale === "zh" ? ("zh" as const) : ("en" as const);
  const imageBase = product.imageName.replace(/\.[^.]+$/, "");
  const group = getGroupOfCategory(product.category);
  const groupLabel = getLocalizedLabel(PRODUCT_GROUP_LABELS, group, locale);
  const related = await fetchRelated(product);
  const isSoftware = SOFTWARE_CATEGORIES.includes(product.category);

  return (
    <>
      {/* 面包屑 + 产品头部 */}
      <section className="mx-auto max-w-7xl px-4 pt-10 md:px-8 lg:px-12">
        <nav className="text-muted text-sm" aria-label="breadcrumb">
          <Link href="/" className="hover:text-brand-blue">
            {t("breadcrumbHome")}
          </Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-brand-blue">
            {t("breadcrumbProducts")}
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/products?group=${group}`} className="hover:text-brand-blue">
            {groupLabel}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name[loc]}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <Reveal>
            <Placeholder
              ratio="aspect-[4/3]"
              label={`${product.name[loc]}产品主图`}
              size="4:3 · 建议 1600×1200"
              name={product.imageName}
            />
            <div className="mt-3 grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <Placeholder
                  key={i}
                  ratio="aspect-square"
                  className="rounded-lg p-3"
                  label={`产品细节图 ${i}`}
                  name={`${imageBase}-thumb-${i}.png`}
                />
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
              {getLocalizedLabel(PRODUCT_CATEGORY_LABELS, product.category, locale)}
            </span>
            <h1 className="font-heading text-foreground mt-3 text-3xl font-bold md:text-4xl">
              {product.name[loc]}
            </h1>
            <p className="text-muted mt-1 font-mono text-sm">{product.model}</p>
            <p className="text-muted mt-4 text-lg">{product.tagline[loc]}</p>
            <p className="text-muted mt-3 leading-relaxed">{product.description[loc]}</p>

            <h2 className="font-heading text-foreground mt-8 text-lg font-bold">
              {t("quickSpecs")}
            </h2>
            <dl className="mt-3 space-y-2">
              {product.quickSpecs.map((spec) => (
                <div
                  key={spec.label.en}
                  className="border-border flex items-center justify-between gap-4 border-b pb-2 text-sm"
                >
                  <dt className="text-subtle">{spec.label[loc]}</dt>
                  <dd className="text-foreground text-right font-medium">{spec.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="bg-brand-blue rounded-lg px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
              >
                {t("requestConsultation")}
              </Link>
              <a
                href="#"
                className="text-brand-blue border-brand-blue inline-flex items-center gap-2 rounded-lg border bg-white px-6 py-3 font-medium transition-colors hover:bg-blue-50"
              >
                <Download className="h-4 w-4" />
                {t("downloadSpec")}
              </a>
              <AskAIButton productName={product.name[loc]} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 媒体分区：硬件 → 360° 3D 查看器占位；软件 → 界面展示 */}
      {isSoftware ? (
        <InterfaceShowcaseSection product={product} loc={loc} />
      ) : (
        <Viewer3DSection slug={slug} />
      )}

      {/* 技术规格表 */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
        <Reveal>
          <h2 className="font-heading text-foreground text-2xl font-bold md:text-3xl">
            {t("specsTitle")}
          </h2>
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 md:p-10">
            <div className="space-y-10">
              {product.specGroups.map((group) => (
                <div key={group.group.en}>
                  <h3 className="font-heading text-brand-navy text-lg font-bold">
                    {group.group[loc]}
                  </h3>
                  <dl className="mt-4 grid gap-x-10 sm:grid-cols-2">
                    {group.items.map((item) => (
                      <div
                        key={item.label.en}
                        className="border-border flex items-center justify-between gap-4 border-b py-3 text-sm"
                      >
                        <dt className="text-subtle">{item.label[loc]}</dt>
                        <dd className="text-foreground text-right font-medium">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* 核心特性 */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
          <h2 className="font-heading text-foreground text-2xl font-bold md:text-3xl">
            {t("featuresTitle")}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {product.features.map((feature, index) => {
              const Icon = FEATURE_ICONS[index % FEATURE_ICONS.length];
              return (
                <Reveal key={feature.en} delay={index * 80} className="h-full">
                  <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6">
                    <Icon className="text-brand-blue h-6 w-6" />
                    <p className="text-foreground mt-3 text-sm leading-relaxed">{feature[loc]}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 适用行业 */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
        <Reveal>
          <h2 className="font-heading text-foreground text-2xl font-bold md:text-3xl">
            {t("scenariosTitle")}
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {product.scenarios.map((industry) => (
              <span
                key={industry}
                className="rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700"
              >
                {getLocalizedLabel(INDUSTRY_LABELS, industry, locale)}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 相关产品 */}
      {related.length > 0 && (
        <section className="bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
            <h2 className="font-heading text-foreground text-2xl font-bold md:text-3xl">
              {t("relatedTitle")}
            </h2>
            <div className="mt-8 flex gap-6 overflow-x-auto pb-4">
              {related.map((item, index) => (
                <ProductCard
                  key={item.slug}
                  product={item}
                  delay={index * 80}
                  className="w-72 shrink-0"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 底部 CTA */}
      <section className="bg-night-sky relative overflow-hidden text-white">
        <Starfield
          className="absolute inset-0 h-full w-full opacity-80"
          density={0.0005}
          yellowRatio={0.2}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 text-center md:px-8 md:py-24 lg:px-12">
          <h2 className="font-heading mx-auto max-w-2xl text-3xl font-bold md:text-4xl">
            {tCta("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">{tCta("subtitle")}</p>
          <Link
            href="/contact"
            className="bg-brand-blue mt-8 inline-block rounded-lg px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
          >
            {tCta("button")}
          </Link>
        </div>
      </section>
    </>
  );
}
