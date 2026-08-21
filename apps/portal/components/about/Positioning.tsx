import { useTranslations } from "next-intl";
import { Placeholder } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";

/** 关于我们 2：方案集成商定位 */
export function Positioning() {
  const t = useTranslations("about.positioning");

  return (
    <section>
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-8 md:py-24 lg:px-12">
        <Reveal>
          <h2 className="font-heading text-foreground text-2xl font-bold md:text-3xl">
            {t("title")}
          </h2>
          <p className="text-muted mt-4 leading-relaxed">{t("text")}</p>
          <p className="text-muted mt-3 leading-relaxed">{t("text2")}</p>
        </Reveal>
        <Reveal delay={120}>
          <Placeholder
            ratio="aspect-[4/3]"
            label="公司团队/办公场景图"
            size="4:3 · 建议 1200×900"
            name="about-team.png"
          />
        </Reveal>
      </div>
    </section>
  );
}
