import { useLocale, useTranslations } from "next-intl";
import { SlottedImage } from "@/components/ui/SlottedImage";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { parseCountValue, type CompanyStatItem } from "@/components/about/types";

const DEFAULT_STATS = [
  { value: "500+", key: "projects" },
  { value: "30+", key: "countries" },
  { value: "99.9%", key: "uptime" },
  { value: "50M+", key: "pallets" },
] as const;

const CLIENT_LOGO_COUNT = 8;

/** 首页分区 7：成果数据（CountUp 滚动计数；数据可来自公司数据中台）+ 客户 Logo 墙 */
export function StatsAndClients({ stats }: { stats?: CompanyStatItem[] | null }) {
  const t = useTranslations("home.stats");
  const locale = useLocale();

  const items =
    stats && stats.length > 0
      ? stats.slice(0, 6).map((s) => ({
          ...parseCountValue(s.value),
          label: locale === "zh" ? s.label : (s.labelEn ?? s.label),
        }))
      : DEFAULT_STATS.map((s) => ({
          ...parseCountValue(s.value),
          label: t(`items.${s.key}.label`),
        }));

  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-foreground text-3xl font-bold md:text-4xl">
            {t("title")}
          </h2>
          <p className="text-muted mt-4 text-lg">{t("subtitle")}</p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {items.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 100}>
              <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
                <CountUp
                  end={stat.end}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                  className="font-heading text-brand-blue text-4xl font-bold md:text-5xl"
                />
                <div className="text-muted mt-2 text-sm">{stat.label}</div>
              </div>
            </Reveal>
          ))}
        </div>

        <h3 className="text-subtle mt-16 text-center text-sm font-medium uppercase tracking-wider">
          {t("clientsTitle")}
        </h3>
        <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
          {Array.from({ length: CLIENT_LOGO_COUNT }, (_, i) => (
            <Reveal key={i} delay={i * 60}>
              <SlottedImage
                src={`/images/clients/client-logo-${String(i + 1).padStart(2, "0")}.png`}
                alt={t("clientLogo.label")}
                className="w-full rounded-xl object-contain grayscale transition-all hover:grayscale-0"
                placeholder={{
                  className: "p-4 grayscale transition-all hover:grayscale-0",
                  label: t("clientLogo.label"),
                  size: t("clientLogo.size"),
                  name: `client-logo-${String(i + 1).padStart(2, "0")}.png`,
                }}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
