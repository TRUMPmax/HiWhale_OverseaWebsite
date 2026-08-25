import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/navigation";
import { Starfield } from "@/components/ui/Starfield";
import { MissionBanner } from "@/components/about/MissionBanner";
import { Positioning } from "@/components/about/Positioning";
import { Milestones } from "@/components/about/Milestones";
import { GlobalPresence } from "@/components/about/GlobalPresence";
import { RnDStrength } from "@/components/about/RnDStrength";
import { Partners } from "@/components/about/Partners";
import type { CompanyAbout } from "@/components/about/types";
import { fetchSetting } from "@/lib/settings";

/** 关于我们页（内容优先公司数据中台，失败回退 i18n 文案） */
export default async function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations("about.cta");
  const about = await fetchSetting<CompanyAbout>("company-about");

  return (
    <>
      <MissionBanner data={about} />
      <Positioning data={about} />
      <Milestones data={about} />
      <GlobalPresence data={about} />
      <RnDStrength data={about} />
      <Partners data={about} />

      {/* 底部 CTA */}
      <section className="bg-night-sky relative overflow-hidden text-white">
        <Starfield
          className="absolute inset-0 h-full w-full opacity-80"
          density={0.0005}
          yellowRatio={0.2}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 text-center md:px-8 md:py-24 lg:px-12">
          <h2 className="font-heading mx-auto max-w-2xl text-3xl font-bold md:text-4xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">{t("subtitle")}</p>
          <Link
            href="/contact"
            className="bg-brand-blue mt-8 inline-block rounded-lg px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
          >
            {t("button")}
          </Link>
        </div>
      </section>
    </>
  );
}
