import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Clock } from "lucide-react";
import {
  getLocalizedLabel,
  industryLabel,
  normalizePainPoint,
  Industry,
  MOCK_SOLUTIONS,
  PRODUCT_CATEGORY_LABELS,
} from "@hiwhale/shared/constants";
import { fetchProducts, fetchSolution } from "@/lib/content";
import { Link } from "@/navigation";
import { IconByName } from "@/components/ui/IconByName";
import { SlottedImage } from "@/components/ui/SlottedImage";
import { Reveal } from "@/components/ui/Reveal";
import { Starfield } from "@/components/ui/Starfield";
import { ProductCard } from "@/components/products/ProductCard";
import { INDUSTRY_IMAGE_NAMES } from "@/components/home/assets";

export function generateStaticParams() {
  return MOCK_SOLUTIONS.map((solution) => ({ slug: solution.slug }));
}

/** 行业方案详情页（数据来自 API，失败回退 Mock） */
export default async function SolutionDetailPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(locale);
  const solution = await fetchSolution(slug);
  if (!solution) notFound();

  const t = await getTranslations("solutions.detail");
  const tCta = await getTranslations("solutions.cta");
  const loc = locale === "zh" ? ("zh" as const) : ("en" as const);

  // 相关产品：按 productSlugs 精确关联
  const allProducts = await fetchProducts();
  const relatedProducts = solution.productSlugs
    .map((slug) => allProducts.find((p) => p.slug === slug))
    .filter((p) => p !== undefined);

  return (
    <>
      {/* 顶部横幅 */}
      <section className="bg-brand-navy text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
          <span className="inline-flex items-center rounded-md bg-white/10 px-2 py-1 text-xs font-medium text-white/90">
            {industryLabel(solution.industry, locale)}
          </span>
          <h1 className="font-heading mt-4 text-3xl font-bold md:text-5xl">
            {solution.title[loc]}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/70">{solution.summary[loc]}</p>
          {solution.duration?.[loc]?.trim() ? (
            <div className="mt-6 flex items-center gap-2 text-sm text-white/80">
              <Clock className="h-4 w-4" />
              <span>
                {t("durationLabel")}: {solution.duration[loc]}
              </span>
            </div>
          ) : null}
        </div>
      </section>

      {/* 场景图 + 方案描述 */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <SlottedImage
              src={`/images/solutions/${solution.imageName}`}
              fallbackSrc={`/images/industries/${INDUSTRY_IMAGE_NAMES[solution.industry as Industry] ?? `industry-${solution.industry}.png`}`}
              alt={industryLabel(solution.industry, locale)}
              className="aspect-video w-full rounded-xl border border-slate-200 object-cover"
              placeholder={{
                ratio: "aspect-video",
                label: `行业方案场景图：${solution.industry}`,
                size: "16:9 · 建议 1600×900",
                name: solution.imageName,
              }}
            />
          </Reveal>
          <Reveal delay={120}>
            <h2 className="font-heading text-foreground text-2xl font-bold md:text-3xl">
              {t("solutionTitle")}
            </h2>
            <p className="text-muted mt-4 leading-relaxed">{solution.description[loc]}</p>
          </Reveal>
        </div>
      </section>

      {/* 行业痛点 */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
          <h2 className="font-heading text-foreground text-2xl font-bold md:text-3xl">
            {t("painPointsTitle")}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {solution.painPoints.map((raw, index) => {
              const point = normalizePainPoint(raw);
              return (
                <Reveal key={point.text.en} delay={index * 80} className="h-full">
                  <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6">
                    <IconByName
                      name={point.icon}
                      fallbackName="alert-triangle"
                      className="text-brand-blue h-6 w-6"
                    />
                    <p className="text-foreground mt-3 text-sm leading-relaxed">
                      {point.text[loc]}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 设备组合（品类芯片由关联产品推导，去重） */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
        <Reveal>
          <h2 className="font-heading text-foreground text-2xl font-bold md:text-3xl">
            {t("equipmentTitle")}
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {Array.from(new Set(relatedProducts.map((p) => p.category))).map((category) => (
              <span
                key={category}
                className="rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700"
              >
                {getLocalizedLabel(PRODUCT_CATEGORY_LABELS, category, locale)}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 部署流程时间线 */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
          <h2 className="font-heading text-foreground text-2xl font-bold md:text-3xl">
            {t("processTitle")}
          </h2>
          <div className="relative mt-10">
            <div className="bg-border absolute bottom-0 left-4 top-0 w-px" aria-hidden="true" />
            <div className="space-y-10">
              {solution.process.map((step, index) => (
                <Reveal key={step.title.en} delay={index * 80}>
                  <div className="relative pl-12">
                    <span className="bg-brand-blue absolute left-4 top-1 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <h3 className="font-heading text-foreground font-bold">{step.title[loc]}</h3>
                    <p className="text-muted mt-1 text-sm leading-relaxed">
                      {step.description[loc]}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 成效指标（静态大数字） */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
        <Reveal>
          <h2 className="font-heading text-foreground text-2xl font-bold md:text-3xl">
            {t("resultsTitle")}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {solution.results.map((result) => (
              <div
                key={result.value}
                className="rounded-xl border border-slate-200 bg-white p-6 text-center"
              >
                <IconByName name={result.icon} className="text-brand-blue mx-auto mb-2 h-6 w-6" />
                <span className="font-heading text-brand-blue text-3xl font-bold md:text-4xl">
                  {result.value}
                </span>
                <div className="text-muted mt-2 text-sm">{result.label[loc]}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 相关产品 */}
      {relatedProducts.length > 0 && (
        <section className="bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
            <h2 className="font-heading text-foreground text-2xl font-bold md:text-3xl">
              {t("relatedProductsTitle")}
            </h2>
            <div className="mt-8 flex gap-6 overflow-x-auto pb-4">
              {relatedProducts.map((product, index) => (
                <ProductCard
                  key={product.slug}
                  product={product}
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
