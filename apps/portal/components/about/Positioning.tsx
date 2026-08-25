import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";
import { SlottedImage } from "@/components/ui/SlottedImage";
import { pickLang, type CompanyAbout } from "./types";

/** 关于我们 2：方案集成商定位（内容可来自公司数据中台） */
export function Positioning({ data }: { data?: CompanyAbout | null }) {
  const t = useTranslations("about.positioning");
  const locale = useLocale();
  const p = data?.positioning;

  return (
    <section>
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-8 md:py-24 lg:px-12">
        <Reveal>
          <h2 className="font-heading text-foreground text-2xl font-bold md:text-3xl">
            {pickLang(locale, p?.title, p?.titleEn, t("title"))}
          </h2>
          <p className="text-muted mt-4 leading-relaxed">
            {pickLang(locale, p?.text, p?.textEn, t("text"))}
          </p>
          <p className="text-muted mt-3 leading-relaxed">
            {pickLang(locale, p?.text2, p?.text2En, t("text2"))}
          </p>
        </Reveal>
        <Reveal delay={120}>
          <SlottedImage
            src="/images/about/about-team.png"
            alt="公司团队/办公场景图"
            className="aspect-[4/3] w-full rounded-xl border border-slate-200 object-cover"
            placeholder={{
              ratio: "aspect-[4/3]",
              label: "公司团队/办公场景图",
              size: "4:3 · 建议 1200×900",
              name: "about-team.png",
            }}
          />
        </Reveal>
      </div>
    </section>
  );
}
