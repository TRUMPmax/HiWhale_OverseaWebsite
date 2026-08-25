import { useTranslations } from "next-intl";
import { Placeholder } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import type { CompanyAbout } from "./types";

const DEFAULT_CERTS = ["CE", "ISO 9001", "ISO 3691-4", "ISO 13849", "UL"];

/** 关于我们 6：合作伙伴 + 认证（认证列表可来自公司数据中台） */
export function Partners({ data }: { data?: CompanyAbout | null }) {
  const t = useTranslations("about.partners");
  const certs =
    data?.certifications && data.certifications.length > 0 ? data.certifications : DEFAULT_CERTS;

  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
        <Reveal>
          <h2 className="font-heading text-foreground text-2xl font-bold md:text-3xl">
            {t("title")}
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Placeholder
                key={i}
                ratio="aspect-[2/1]"
                className="rounded-lg p-3"
                label="合作伙伴 Logo"
                size="2:1 · 建议 240×120"
                name={`partner-logo-0${i}.png`}
              />
            ))}
          </div>
          <h3 className="font-heading text-foreground mt-10 text-lg font-bold">
            {t("certsTitle")}
          </h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {certs.map((cert) => (
              <span
                key={cert}
                className="text-muted rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium"
              >
                {cert}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
