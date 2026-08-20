import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/navigation";
import { Placeholder } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { INDUSTRY_IMAGE_NAMES } from "./assets";
import { getLocalizedLabel, INDUSTRY_LABELS, Industry } from "@hiwhale/shared/constants";

/** 已投放真实素材的行业（public/images/industries/ 下有图即用真图） */
const INDUSTRIES_WITH_IMAGE: ReadonlySet<Industry> = new Set([
  Industry.E_COMMERCE,
  Industry.AUTOMOTIVE,
  Industry.THIRD_PARTY_LOGISTICS,
  Industry.FOOD_COLD_CHAIN,
  Industry.PHARMACEUTICAL,
  Industry.PORT,
]);

/** 行业 → 对应方案详情页 */
const INDUSTRY_SOLUTION_SLUG: Record<Industry, string> = {
  [Industry.E_COMMERCE]: "e-commerce-fulfillment",
  [Industry.AUTOMOTIVE]: "automotive-line-side",
  [Industry.THIRD_PARTY_LOGISTICS]: "3pl-multi-client",
  [Industry.FOOD_COLD_CHAIN]: "cold-chain-automation",
  [Industry.PHARMACEUTICAL]: "pharma-compliant-logistics",
  [Industry.PORT]: "port-container-yard",
};

/** 首页分区 4：行业解决方案（6 个大图卡片，2 列） */
export function IndustrySolutions() {
  const t = useTranslations("home.industries");
  const locale = useLocale();
  const industries = Object.values(Industry);

  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-foreground text-3xl font-bold md:text-4xl">
            {t("title")}
          </h2>
          <p className="text-muted mt-4 text-lg">{t("subtitle")}</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {industries.map((industry, index) => (
            <Reveal key={industry} delay={index * 80} className="h-full">
              <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg">
                {INDUSTRIES_WITH_IMAGE.has(industry) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`/images/industries/${INDUSTRY_IMAGE_NAMES[industry]}`}
                    alt={getLocalizedLabel(INDUSTRY_LABELS, industry, locale)}
                    className="aspect-video w-full object-cover"
                  />
                ) : (
                  <Placeholder
                    ratio="aspect-video"
                    className="rounded-none border-0"
                    label={t(`items.${industry}.image`)}
                    size={t("imageSize")}
                    name={INDUSTRY_IMAGE_NAMES[industry]}
                  />
                )}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-heading text-foreground text-xl font-bold">
                    {getLocalizedLabel(INDUSTRY_LABELS, industry, locale)}
                  </h3>
                  <p className="text-muted mt-2 flex-1 text-sm leading-relaxed">
                    {t(`items.${industry}.description`)}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700">
                      {t(`items.${industry}.painPoint`)}
                    </span>
                    <Link
                      href={`/solutions/${INDUSTRY_SOLUTION_SLUG[industry]}`}
                      className="text-brand-blue text-sm font-medium hover:underline"
                    >
                      {t("viewSolution")} →
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
