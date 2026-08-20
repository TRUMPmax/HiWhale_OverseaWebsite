import { useTranslations } from "next-intl";
import { Starfield } from "@/components/ui/Starfield";

/** 关于我们 1：使命横幅（深蓝夜幕 + 星空） */
export function MissionBanner() {
  const t = useTranslations("about.mission");

  return (
    <section className="bg-brand-navy relative overflow-hidden text-white">
      <Starfield
        className="absolute inset-0 h-full w-full opacity-60"
        density={0.0004}
        yellowRatio={0.15}
      />
      <div className="relative mx-auto max-w-7xl px-4 py-16 text-center md:px-8 md:py-24 lg:px-12">
        <h1 className="font-heading text-3xl font-bold md:text-5xl">{t("title")}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70">{t("text")}</p>
      </div>
    </section>
  );
}
