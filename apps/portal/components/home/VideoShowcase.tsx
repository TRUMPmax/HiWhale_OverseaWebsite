import { useTranslations } from "next-intl";
import { Play } from "lucide-react";
import { Placeholder } from "@/components/ui/Placeholder";

/** 首页分区 6：企业宣传视频（深蓝背景，16:9 播放器占位） */
export function VideoShowcase() {
  const t = useTranslations("home.video");

  return (
    <section className="bg-brand-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold md:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-lg text-white/70">{t("subtitle")}</p>
        </div>

        <div className="relative mx-auto mt-12 max-w-4xl">
          <Placeholder
            variant="dark"
            ratio="aspect-video"
            label={t("placeholder.label")}
            size={t("placeholder.size")}
            name="home-brand-video.mp4"
          />
          <button
            type="button"
            aria-label={t("play")}
            className="bg-brand-blue absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full p-5 shadow-lg transition-transform hover:scale-105"
          >
            <Play className="h-8 w-8 fill-white text-white" />
          </button>
        </div>
      </div>
    </section>
  );
}
