import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";
import { pickLang, type CompanyAbout } from "./types";

const DEFAULT_MILESTONES = ["m2016", "m2018", "m2020", "m2022", "m2024", "m2026"] as const;

/** 关于我们 3：里程碑时间线（桌面端左右交错；内容可来自公司数据中台） */
export function Milestones({ data }: { data?: CompanyAbout | null }) {
  const t = useTranslations("about.milestones");
  const locale = useLocale();

  const items: Array<{ year: string; event: string; eventEn?: string }> =
    data?.milestones && data.milestones.length > 0
      ? data.milestones
      : DEFAULT_MILESTONES.map((key) => ({
          year: t(`items.${key}.year`),
          event: t(`items.${key}.event`),
        }));

  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
        <h2 className="font-heading text-foreground text-center text-2xl font-bold md:text-3xl">
          {t("title")}
        </h2>
        <div className="relative mt-12">
          <div
            className="bg-border absolute bottom-0 left-4 top-0 w-px md:left-1/2"
            aria-hidden="true"
          />
          <div className="space-y-10 md:space-y-12">
            {items.map((item, index) => (
              <Reveal key={`${item.year}-${index}`} delay={index * 60}>
                <div className="relative md:grid md:grid-cols-2 md:gap-12">
                  <span className="bg-brand-blue absolute left-4 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full ring-4 ring-slate-50 md:left-1/2" />
                  <div
                    className={
                      index % 2 === 0
                        ? "pl-12 md:col-start-1 md:pl-0 md:text-right"
                        : "pl-12 md:col-start-2 md:pl-0"
                    }
                  >
                    <span className="font-heading text-brand-blue text-2xl font-bold">
                      {item.year}
                    </span>
                    <p className="text-foreground mt-1 font-medium">
                      {pickLang(locale, item.event, item.eventEn, item.event)}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
