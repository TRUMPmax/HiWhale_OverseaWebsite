import { useLocale, useTranslations } from "next-intl";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { SlottedImage } from "@/components/ui/SlottedImage";
import { parseCountValue, pickLang, type CompanyAbout } from "./types";

/** 关于我们 5：研发实力（内容可来自公司数据中台） */
export function RnDStrength({ data }: { data?: CompanyAbout | null }) {
  const t = useTranslations("about.rd");
  const locale = useLocale();
  const rd = data?.rd;

  const stats = [
    {
      ...parseCountValue(rd?.engineers ?? "200+"),
      label: t("stats.engineers"),
    },
    {
      ...parseCountValue(rd?.patents ?? "120+"),
      label: t("stats.patents"),
    },
    {
      ...parseCountValue(rd?.countries ?? "30+"),
      label: t("stats.countries"),
    },
  ];

  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-heading text-foreground text-2xl font-bold md:text-3xl">
              {t("title")}
            </h2>
            <p className="text-muted mt-4 leading-relaxed">
              {pickLang(locale, rd?.text, rd?.textEn, t("text"))}
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <CountUp
                    end={stat.end}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                    className="font-heading text-brand-blue text-3xl font-bold md:text-4xl"
                  />
                  <div className="text-muted mt-1 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <SlottedImage
              src="/images/about/about-factory.png"
              alt="研发中心/工厂实拍图"
              className="aspect-video w-full rounded-xl border border-slate-200 object-cover"
              placeholder={{
                ratio: "aspect-video",
                label: "研发中心/工厂实拍图",
                size: "16:9 · 建议 1600×900",
                name: "about-factory.png",
              }}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
