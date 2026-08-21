import { getTranslations, setRequestLocale } from "next-intl/server";
import { fetchCases } from "@/lib/content";
import { CasesBrowser } from "@/components/cases/CasesBrowser";

/** 客户案例列表页（数据来自 API，失败回退 Mock） */
export default async function CasesPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations("cases");
  const cases = await fetchCases();

  return (
    <>
      <section className="bg-brand-navy text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
          <h1 className="font-heading text-3xl font-bold md:text-5xl">{t("banner.title")}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/70">{t("banner.subtitle")}</p>
        </div>
      </section>
      <CasesBrowser cases={cases} />
    </>
  );
}
