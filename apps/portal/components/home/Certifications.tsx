import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";

const CERTS = [
  { key: "ce", src: "/images/certs/cert-ce.svg" },
  { key: "iso9001", src: "/images/certs/cert-iso9001.svg" },
  { key: "iso3691", src: "/images/certs/cert-iso3691-4.svg" },
  { key: "iso13849", src: "/images/certs/cert-iso13849.svg" },
  { key: "ul", src: "/images/certs/cert-ul.svg" },
] as const;

/** 首页分区 8：全球认证标志墙（公开通用标识，真实素材已嵌入） */
export function Certifications() {
  const t = useTranslations("home.certifications");

  return (
    <section className="bg-white/75 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-foreground text-3xl font-bold md:text-4xl">
            {t("title")}
          </h2>
          <p className="text-muted mt-4 text-lg">{t("subtitle")}</p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
          {CERTS.map((cert, index) => (
            <Reveal key={cert.key} delay={index * 80}>
              <div className="flex flex-col items-center gap-3">
                <div className="flex aspect-square w-full items-center justify-center rounded-xl border border-slate-200 bg-white p-8 transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg">
                  {/* 公开通用认证标识（本地 SVG 素材） */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cert.src}
                    alt={t(`items.${cert.key}.name`)}
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                </div>
                <span className="text-foreground text-sm font-medium">
                  {t(`items.${cert.key}.name`)}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
