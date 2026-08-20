import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";
import { Placeholder } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";

const LOCATION_KEYS = ["hq", "frankfurt", "singapore", "houston"] as const;

/** 关于我们 4：全球布局 */
export function GlobalPresence() {
  const t = useTranslations("about.presence");

  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
        <Reveal>
          <h2 className="font-heading text-foreground text-2xl font-bold md:text-3xl">
            {t("title")}
          </h2>
          <p className="text-muted mt-2">{t("subtitle")}</p>
          <Placeholder
            ratio="aspect-[21/9]"
            className="mt-8"
            label="全球布局世界地图（标注：中国总部+海外服务点）"
            size="21:9 · 建议 2100×900"
            name="about-world-map.png"
          />
          <div className="mt-6 flex flex-wrap gap-3">
            {LOCATION_KEYS.map((key) => (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700"
              >
                <MapPin className="h-3.5 w-3.5" />
                {t(`locations.${key}`)}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
