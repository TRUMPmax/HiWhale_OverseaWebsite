import { useLocale, useTranslations } from "next-intl";
import { Starfield } from "@/components/ui/Starfield";
import { pickLang, type CompanyAbout } from "./types";

/** 关于我们 1：使命横幅（深蓝夜幕 + 星空；内容可来自公司数据中台） */
export function MissionBanner({ data }: { data?: CompanyAbout | null }) {
  const t = useTranslations("about.mission");
  const locale = useLocale();

  return (
    <section className="bg-brand-navy relative overflow-hidden text-white">
      <Starfield
        className="absolute inset-0 h-full w-full opacity-60"
        density={0.0004}
        yellowRatio={0.15}
      />
      <div className="relative mx-auto max-w-7xl px-4 py-16 text-center md:px-8 md:py-24 lg:px-12">
        <h1 className="font-heading text-3xl font-bold md:text-5xl">{t("title")}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
          {pickLang(locale, data?.mission, data?.missionEn, t("text"))}
        </p>
      </div>
    </section>
  );
}
