import { useTranslations } from "next-intl";
import { Link } from "@/navigation";

/** 首页分区 9：底部 CTA（深蓝背景） */
export function CTASection() {
  const t = useTranslations("home.cta");

  return (
    <section className="bg-brand-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 text-center md:px-8 md:py-24 lg:px-12">
        <h2 className="font-heading mx-auto max-w-2xl text-3xl font-bold md:text-4xl">
          {t("title")}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">{t("subtitle")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="bg-brand-blue rounded-lg px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
          >
            {t("primary")}
          </Link>
          <Link
            href="/products"
            className="text-brand-navy rounded-lg bg-white px-6 py-3 font-medium transition-opacity hover:opacity-90"
          >
            {t("secondary")}
          </Link>
        </div>
      </div>
    </section>
  );
}
