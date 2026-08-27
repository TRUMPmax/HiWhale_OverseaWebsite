import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";
import { SlottedImage } from "@/components/ui/SlottedImage";
import type { CompanyAbout } from "./types";

/** 关于我们 4：全球布局（世界地图素材位；地点标签已移除） */
export function GlobalPresence({ data }: { data?: CompanyAbout | null }) {
  void data;
  const t = useTranslations("about.presence");

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
        </Reveal>
      </div>
    </section>
  );
}
