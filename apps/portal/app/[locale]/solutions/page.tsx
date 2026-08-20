import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { getLocalizedLabel, INDUSTRY_LABELS, MOCK_SOLUTIONS } from "@hiwhale/shared/constants";
import { Link } from "@/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { INDUSTRY_IMAGE_NAMES } from "@/components/home/assets";

/** 行业方案列表页 */
export default function SolutionsPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = useTranslations("solutions");
  const loc = locale === "zh" ? ("zh" as const) : ("en" as const);

  return (
    <>
      <section className="bg-brand-navy text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
          <h1 className="font-heading text-3xl font-bold md:text-5xl">{t("banner.title")}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/70">{t("banner.subtitle")}</p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
          <div className="grid gap-6 md:grid-cols-2">
            {MOCK_SOLUTIONS.map((solution, index) => (
              <Reveal key={solution.slug} delay={index * 80} className="h-full">
                <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/images/industries/${INDUSTRY_IMAGE_NAMES[solution.industry]}`}
                    alt={getLocalizedLabel(INDUSTRY_LABELS, solution.industry, locale)}
                    className="aspect-video w-full rounded-lg object-cover"
                  />
                  <span className="mt-5 inline-flex w-fit items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                    {getLocalizedLabel(INDUSTRY_LABELS, solution.industry, locale)}
                  </span>
                  <h2 className="font-heading text-foreground mt-3 text-xl font-bold">
                    {solution.title[loc]}
                  </h2>
                  <p className="text-muted mt-2 flex-1 text-sm leading-relaxed">
                    {solution.summary[loc]}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {solution.results.slice(0, 2).map((result) => (
                      <span
                        key={result.value}
                        className="border-brand-blue/30 text-brand-blue rounded-full border px-3 py-1 text-xs font-medium"
                      >
                        {result.value} · {result.label[loc]}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/solutions/${solution.slug}`}
                    className="text-brand-blue mt-4 text-sm font-medium hover:underline"
                  >
                    {t("viewSolution")} →
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
