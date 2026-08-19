import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/navigation";
import { Placeholder } from "@/components/ui/Placeholder";
import { getLocalizedLabel, INDUSTRY_LABELS, Industry } from "@hiwhale/shared/constants";

const INDUSTRY_IMAGE_NAMES: Record<Industry, string> = {
  [Industry.E_COMMERCE]: "industry-ecommerce.png",
  [Industry.AUTOMOTIVE]: "industry-automotive.png",
  [Industry.THIRD_PARTY_LOGISTICS]: "industry-3pl.png",
  [Industry.FOOD_COLD_CHAIN]: "industry-cold-chain.png",
  [Industry.PHARMACEUTICAL]: "industry-pharmaceutical.png",
  [Industry.PORT]: "industry-port.png",
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
          {industries.map((industry) => (
            <div
              key={industry}
              className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
            >
              <Placeholder
                ratio="aspect-video"
                className="rounded-none border-0"
                label={t(`items.${industry}.image`)}
                size={t("imageSize")}
                name={INDUSTRY_IMAGE_NAMES[industry]}
              />
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
                    href="/solutions"
                    className="text-brand-blue text-sm font-medium hover:underline"
                  >
                    {t("viewSolution")} →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
