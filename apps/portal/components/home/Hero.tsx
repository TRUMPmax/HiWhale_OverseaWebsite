import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { Placeholder } from "@/components/ui/Placeholder";

/** 首页分区 1：首屏 Hero（静态版，滚轮叙事动效后续叠加） */
export function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section className="bg-brand-navy text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 md:px-8 md:py-24 lg:grid-cols-2 lg:px-12">
        <div>
          <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm text-blue-100">
            {t("badge")}
          </span>
          <h1 className="font-heading mt-6 text-4xl font-bold leading-tight md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">{t("subtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="bg-brand-blue rounded-lg px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
            >
              {t("ctaPrimary")}
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-white/30 px-6 py-3 font-medium text-white transition-colors hover:bg-white/10"
            >
              {t("ctaSecondary")}
            </Link>
          </div>
        </div>

        <Placeholder
          variant="dark"
          ratio="aspect-video"
          label={t("placeholder.label")}
          size={t("placeholder.size")}
          name="home-hero-product-family.png"
        />
      </div>
    </section>
  );
}
