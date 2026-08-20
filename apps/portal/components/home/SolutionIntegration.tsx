import { useTranslations } from "next-intl";
import { Boxes, Network, Package } from "lucide-react";
import { Placeholder } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";

/** 已就绪的真实素材（public/images/home/ 下存在即用真图，否则占位） */
const LAYERS = [
  { key: "equipment", icon: Package, imageName: "home-layer-equipment.png", hasImage: true },
  { key: "system", icon: Network, imageName: "home-layer-system.png", hasImage: false },
  { key: "solution", icon: Boxes, imageName: "home-layer-solution.png", hasImage: false },
] as const;

/** 首页分区 3：方案集成三层能力（设备层 → 系统层 → 方案层，左右交替） */
export function SolutionIntegration() {
  const t = useTranslations("home.integration");

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-foreground text-3xl font-bold md:text-4xl">
            {t("title")}
          </h2>
          <p className="text-muted mt-4 text-lg">{t("subtitle")}</p>
        </div>

        <div className="mt-12 space-y-12">
          {LAYERS.map((layer, index) => {
            const Icon = layer.icon;
            const reversed = index % 2 === 1;
            return (
              <Reveal key={layer.key} delay={index * 100}>
                <div
                  className={`flex flex-col items-center gap-8 md:flex-row ${
                    reversed ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="bg-brand-light text-brand-blue font-heading flex h-10 w-10 items-center justify-center rounded-lg font-bold">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <Icon className="text-brand-blue h-6 w-6" />
                      <h3 className="font-heading text-foreground text-2xl font-bold">
                        {t(`layers.${layer.key}.title`)}
                      </h3>
                    </div>
                    <p className="text-muted mt-4 leading-relaxed">
                      {t(`layers.${layer.key}.description`)}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {[0, 1, 2].map((i) => (
                        <li key={i} className="text-muted flex items-center gap-2 text-sm">
                          <span className="bg-brand-blue h-1.5 w-1.5 rounded-full" />
                          {t(`layers.${layer.key}.points.${i}`)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="w-full flex-1">
                    {layer.hasImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`/images/home/${layer.imageName}`}
                        alt={t(`layers.${layer.key}.title`)}
                        className="aspect-[4/3] w-full rounded-xl border border-slate-200 object-cover"
                      />
                    ) : (
                      <Placeholder
                        ratio="aspect-[4/3]"
                        label={t(`layers.${layer.key}.image`)}
                        size={t("imageSize")}
                        name={layer.imageName}
                      />
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
