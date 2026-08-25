import { useLocale, useTranslations } from "next-intl";
import { MapPin } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SlottedImage } from "@/components/ui/SlottedImage";
import { pickLang, type CompanyAbout } from "./types";

const DEFAULT_LOCATIONS = ["hq", "frankfurt", "singapore", "houston"] as const;

/** 关于我们 4：全球布局（内容可来自公司数据中台） */
export function GlobalPresence({ data }: { data?: CompanyAbout | null }) {
  const t = useTranslations("about.presence");
  const locale = useLocale();

  const locations: Array<{ city: string; cityEn?: string }> =
    data?.locations && data.locations.length > 0
      ? data.locations
      : DEFAULT_LOCATIONS.map((key) => ({ city: t(`locations.${key}`) }));

  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
        <Reveal>
          <h2 className="font-heading text-foreground text-2xl font-bold md:text-3xl">
            {t("title")}
          </h2>
          <p className="text-muted mt-2">{t("subtitle")}</p>
          <SlottedImage
            src="/images/about/about-world-map.png"
            alt="全球布局世界地图"
            className="mt-8 aspect-[21/9] w-full rounded-xl border border-slate-200 object-cover"
            placeholder={{
              ratio: "aspect-[21/9]",
              className: "mt-8",
              label: "全球布局世界地图（标注：中国总部+海外服务点）",
              size: "21:9 · 建议 2100×900",
              name: "about-world-map.png",
            }}
          />
          <div className="mt-6 flex flex-wrap gap-3">
            {locations.map((location) => (
              <span
                key={location.city}
                className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700"
              >
                <MapPin className="h-3.5 w-3.5" />
                {pickLang(locale, location.city, location.cityEn, location.city)}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
