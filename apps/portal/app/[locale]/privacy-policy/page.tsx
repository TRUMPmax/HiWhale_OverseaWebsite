import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/ui/Reveal";
import { fetchSetting } from "@/lib/settings";

type PrivacySection = { h: string; body: string };

/** 隐私政策页：优先展示内容管理中的内容（非空时），否则展示内置完整政策 */
export default async function PrivacyPolicyPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations("privacy");
  const apiContent = await fetchSetting<string>("content-privacy");
  const sections = apiContent ? null : (t.raw("sections") as PrivacySection[]);

  return (
    <>
      <section className="bg-brand-navy text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
          <h1 className="font-heading text-3xl font-bold md:text-5xl">{t("title")}</h1>
          <p className="mt-4 text-lg text-white/70">{t("updated")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
        <Reveal>
          {apiContent ? (
            <div className="text-foreground whitespace-pre-wrap leading-relaxed">{apiContent}</div>
          ) : (
            <>
              <p className="text-muted leading-relaxed">{t("intro")}</p>
              <div className="mt-10 space-y-8">
                {sections?.map((section) => (
                  <div key={section.h}>
                    <h2 className="font-heading text-foreground text-xl font-bold">{section.h}</h2>
                    <p className="text-muted mt-2 leading-relaxed">{section.body}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </Reveal>
      </section>
    </>
  );
}
