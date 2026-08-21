import { useTranslations } from "next-intl";
import { RotateCw } from "lucide-react";
import { Link } from "@/navigation";
import { Placeholder } from "@/components/ui/Placeholder";

const MODELS = ["MBV15R", "MBV20S", "MFV30"] as const;
const SPEC_KEYS = ["loadCapacity", "liftHeight", "navigation", "battery"] as const;

/** 首页分区 5：3D 产品预览（静态占位版，R3F 交互后续接入） */
export function ProductViewer3D() {
  const t = useTranslations("home.viewer3d");

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-foreground text-3xl font-bold md:text-4xl">
            {t("title")}
          </h2>
          <p className="text-muted mt-4 text-lg">{t("subtitle")}</p>
        </div>

        <div className="mt-12 grid items-start gap-12 lg:grid-cols-2">
          <div className="relative">
            <Placeholder
              ratio="aspect-square"
              label={t("placeholder.label")}
              size={t("placeholder.size")}
              name="model-agv-mbv15r.glb"
            />
            <button
              type="button"
              className="border-border text-muted absolute bottom-4 right-4 flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm shadow-sm"
            >
              <RotateCw className="h-4 w-4" />
              {t("resetView")}
            </button>
          </div>

          <div>
            <div className="flex gap-2">
              {MODELS.map((model, index) => (
                <button
                  key={model}
                  type="button"
                  className={`rounded-lg px-4 py-2 text-sm font-medium ${
                    index === 0
                      ? "bg-brand-blue text-white"
                      : "border-border text-muted border bg-white hover:border-blue-300"
                  }`}
                >
                  {model}
                </button>
              ))}
            </div>

            <h3 className="font-heading text-foreground mt-6 text-2xl font-bold">
              {t("productName")}
            </h3>
            <p className="text-muted mt-2">{t("productDescription")}</p>

            <dl className="mt-6 space-y-3">
              {SPEC_KEYS.map((key) => (
                <div
                  key={key}
                  className="border-border flex items-center justify-between border-b pb-3"
                >
                  <dt className="text-muted text-sm">{t(`specs.${key}.label`)}</dt>
                  <dd className="text-foreground text-sm font-medium">{t(`specs.${key}.value`)}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="text-brand-blue text-sm font-medium hover:underline"
              >
                {t("viewFullSpecs")} →
              </Link>
              <Link
                href="/contact"
                className="bg-brand-blue rounded-lg px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
              >
                {t("requestConsultation")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
