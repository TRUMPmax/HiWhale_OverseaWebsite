import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Clock, Package, Quote } from "lucide-react";
import { getLocalizedLabel, INDUSTRY_LABELS, MOCK_CASES } from "@hiwhale/shared/constants";
import { fetchCase, fetchProducts } from "@/lib/content";
import { Link } from "@/navigation";
import { SlottedImage } from "@/components/ui/SlottedImage";
import { Reveal } from "@/components/ui/Reveal";
import { Starfield } from "@/components/ui/Starfield";
import { ProductCard } from "@/components/products/ProductCard";

export function generateStaticParams() {
  return MOCK_CASES.map((item) => ({ slug: item.slug }));
}

/** 客户案例详情页（数据来自 API，失败回退 Mock） */
export default async function CaseDetailPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(locale);
  const item = await fetchCase(slug);
  if (!item) notFound();

  const t = await getTranslations("cases.detail");
  const tCta = await getTranslations("cases.cta");
  const loc = locale === "zh" ? ("zh" as const) : ("en" as const);
  const allProducts = await fetchProducts();
  const relatedProducts = item.productSlugs
    .map((slug) => allProducts.find((p) => p.slug === slug))
    .filter((p) => p !== undefined);

  const narrative = [
    { title: t("backgroundTitle"), text: item.background[loc] },
    { title: t("challengeTitle"), text: item.challenge[loc] },
    { title: t("solutionTitle"), text: item.solution[loc] },
  ];

  return (
    <>
      {/* 面包屑 + 头部 */}
      <section className="mx-auto max-w-7xl px-4 pt-10 md:px-8 lg:px-12">
        <nav className="text-muted text-sm" aria-label="breadcrumb">
          <Link href="/" className="hover:text-brand-blue">
            {t("breadcrumbHome")}
          </Link>
          <span className="mx-2">/</span>
          <Link href="/cases" className="hover:text-brand-blue">
            {t("breadcrumbCases")}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{item.clientName[loc]}</span>
        </nav>

        <Reveal>
          <div className="mt-8">
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
              {getLocalizedLabel(INDUSTRY_LABELS, item.industry, locale)}
            </span>
            <h1 className="font-heading text-foreground mt-3 text-3xl font-bold md:text-4xl">
              {item.project[loc]}
            </h1>
            <p className="text-muted mt-2 text-lg">{item.clientName[loc]}</p>
          </div>
          <SlottedImage
            src={`/images/cases/${item.imageName}`}
            alt={item.clientName[loc]}
            className="mt-8 aspect-[21/9] w-full rounded-xl border border-slate-200 object-cover"
            placeholder={{
              ratio: "aspect-[21/9]",
              className: "mt-8",
              label: "客户项目现场图",
              size: "21:9 · 建议 2100×900",
              name: item.imageName,
            }}
          />
        </Reveal>
      </section>

      {/* 背景 / 挑战 / 方案 */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-3">
          {narrative.map((section, index) => (
            <Reveal key={section.title} delay={index * 80} className="h-full">
              <div className="h-full rounded-xl border border-slate-200 bg-white p-6">
                <h2 className="font-heading text-foreground text-lg font-bold">{section.title}</h2>
                <p className="text-muted mt-3 text-sm leading-relaxed">{section.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 设备清单 + 交付周期 */}
      <section className="bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-16 md:grid-cols-3 md:px-8 md:py-24 lg:px-12">
          <Reveal className="md:col-span-2">
            <div className="h-full rounded-xl border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-2">
                <Package className="text-brand-blue h-5 w-5" />
                <h2 className="font-heading text-foreground text-lg font-bold">
                  {t("equipmentTitle")}
                </h2>
              </div>
              <ul className="mt-4 space-y-2">
                {item.equipment.map((equipment) => (
                  <li key={equipment.en} className="text-muted flex items-start gap-2 text-sm">
                    <span className="bg-brand-blue mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
                    {equipment[loc]}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="flex h-full flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6 text-center">
              <Clock className="text-brand-blue h-8 w-8" />
              <div className="font-heading text-brand-blue mt-3 text-3xl font-bold">
                {item.duration[loc]}
              </div>
              <div className="text-muted mt-1 text-sm">{t("durationLabel")}</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 成效指标 */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
        <Reveal>
          <h2 className="font-heading text-foreground text-2xl font-bold md:text-3xl">
            {t("resultsTitle")}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {item.results.map((result) => (
              <div
                key={result.value}
                className="rounded-xl border border-slate-200 bg-white p-6 text-center"
              >
                <span className="font-heading text-brand-blue text-2xl font-bold md:text-3xl">
                  {result.value}
                </span>
                <div className="text-muted mt-2 text-sm">{result.label[loc]}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 客户证言 */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
          <Reveal>
            <blockquote className="rounded-xl border border-slate-200 bg-white p-8 md:p-10">
              <Quote className="text-brand-blue h-8 w-8" />
              <p className="text-foreground mt-4 text-lg leading-relaxed md:text-xl">
                {item.testimonial.quote[loc]}
              </p>
              <footer className="mt-6">
                <div className="text-foreground font-semibold">{item.testimonial.author[loc]}</div>
                <div className="text-muted text-sm">{item.testimonial.role[loc]}</div>
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* 相关产品 */}
      {relatedProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
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
