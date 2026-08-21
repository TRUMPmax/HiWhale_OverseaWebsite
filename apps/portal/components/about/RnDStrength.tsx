import { useTranslations } from "next-intl";
import { CountUp } from "@/components/ui/CountUp";
import { Placeholder } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";

/** 关于我们 5：研发实力 */
export function RnDStrength() {
  const t = useTranslations("about.rd");

  const stats = [
    { end: 200, suffix: "+", label: t("stats.engineers") },
    { end: 120, suffix: "+", label: t("stats.patents") },
    { end: 30, suffix: "+", label: t("stats.countries") },
  ];

  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-heading text-foreground text-2xl font-bold md:text-3xl">
              {t("title")}
            </h2>
            <p className="text-muted mt-4 leading-relaxed">{t("text")}</p>
            <div className="mt-8 grid grid-cols-3 gap-6">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <CountUp
                    end={stat.end}
                    suffix={stat.suffix}
                    className="font-heading text-brand-blue text-3xl font-bold md:text-4xl"
                  />
                  <div className="text-muted mt-1 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <Placeholder
              ratio="aspect-video"
              label="研发中心/工厂实拍图"
              size="16:9 · 建议 1600×900"
              name="about-factory.png"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
