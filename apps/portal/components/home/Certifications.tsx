import { useTranslations } from "next-intl";
import { Placeholder } from "@/components/ui/Placeholder";

const CERTS = [
  { key: "ce", imageName: "cert-ce.png" },
  { key: "iso9001", imageName: "cert-iso9001.png" },
  { key: "iso3691", imageName: "cert-iso3691-4.png" },
  { key: "iso13849", imageName: "cert-iso13849.png" },
  { key: "ul", imageName: "cert-ul.png" },
] as const;

/** 首页分区 8：全球认证标志墙 */
export function Certifications() {
  const t = useTranslations("home.certifications");

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-foreground text-3xl font-bold md:text-4xl">
            {t("title")}
          </h2>
          <p className="text-muted mt-4 text-lg">{t("subtitle")}</p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
          {CERTS.map((cert) => (
            <div key={cert.key} className="flex flex-col items-center gap-3">
              <Placeholder
                ratio="aspect-square"
                className="w-full p-4"
                label={t(`items.${cert.key}.image`)}
                size={t("imageSize")}
                name={cert.imageName}
              />
              <span className="text-foreground text-sm font-medium">
                {t(`items.${cert.key}.name`)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
