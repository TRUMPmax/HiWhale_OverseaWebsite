import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/navigation";
import { SlottedImage } from "@/components/ui/SlottedImage";
import { Reveal } from "@/components/ui/Reveal";
import { INDUSTRY_IMAGE_NAMES, CORE_INDUSTRIES } from "./assets";
import { industryLabel, Industry } from "@hiwhale/shared/constants";
import type { HomeIndustryCard } from "./types";

/** 核心行业 → 对应方案详情页（仅首页展示的 6 个行业） */
const INDUSTRY_SOLUTION_SLUG: Partial<Record<Industry, string>> = {
  [Industry.E_COMMERCE]: "e-commerce-fulfillment",
  [Industry.AUTOMOTIVE]: "automotive-line-side",
  [Industry.THIRD_PARTY_LOGISTICS]: "3pl-multi-client",
  [Industry.FOOD_COLD_CHAIN]: "cold-chain-automation",
  [Industry.PHARMACEUTICAL]: "pharma-compliant-logistics",
  [Industry.PORT]: "port-container-yard",
};

/** 首页分区 4：行业解决方案（大图卡片，2 列；后台「首页行业」配置优先，未配置回退 6 个核心行业） */
export function IndustrySolutions({ cards }: { cards?: HomeIndustryCard[] | null }) {
  const t = useTranslations("home.industries");
  const locale = useLocale();
  const override = cards && cards.length > 0 ? cards : null;
  const loc = locale === "zh" ? ("zh" as const) : ("en" as const);

  return (
    <section className="bg-slate-50/75 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-foreground text-3xl font-bold md:text-4xl">
            {t("title")}
          </h2>
          <p className="text-muted mt-4 text-lg">{t("subtitle")}</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {(override ?? CORE_INDUSTRIES.map((i): HomeIndustryCard => ({ industry: i }))).map(
            (card, index) => {
              // isCore 守卫必须保留：next-intl 对缺失 key 的 t() 会抛错，自定义行业禁止走 messages
              const isCore = (CORE_INDUSTRIES as string[]).includes(card.industry);
              const name = industryLabel(card.industry, locale);
              const imageName =
                INDUSTRY_IMAGE_NAMES[card.industry as Industry] ?? `industry-${card.industry}.png`;
              const description =
                card.description?.[loc]?.trim() ||
                (isCore ? t(`items.${card.industry}.description`) : "");
              const painPoint =
                card.painPoint?.[loc]?.trim() ||
                (isCore ? t(`items.${card.industry}.painPoint`) : "");
              const slug = card.solutionSlug ?? INDUSTRY_SOLUTION_SLUG[card.industry as Industry];
              const href = slug ? `/solutions/${slug}` : "/solutions";
              return (
                <Reveal key={`${card.industry}-${index}`} delay={index * 80} className="h-full">
                  <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg">
                    <SlottedImage
                      src={`/images/industries/${imageName}`}
                      alt={name}
                      className="aspect-video w-full object-cover"
                      placeholder={{
                        ratio: "aspect-video",
                        className: "rounded-none border-0",
                        label: `行业场景图：${name}`,
                        size: t("imageSize"),
                        name: imageName,
                      }}
                    />
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-heading text-foreground text-xl font-bold">{name}</h3>
                      <p className="text-muted mt-2 flex-1 text-sm leading-relaxed">
                        {description}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        {painPoint ? (
                          <span className="rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700">
                            {painPoint}
                          </span>
                        ) : (
                          <span />
                        )}
                        <Link
                          href={href}
                          className="text-brand-blue text-sm font-medium hover:underline"
                        >
                          {t("viewSolution")} →
                        </Link>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            },
          )}
        </div>
      </div>
    </section>
  );
}
