import { useTranslations } from "next-intl";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { normalizeFeature, type Locale, type MockProduct } from "@hiwhale/shared/constants";
import { Placeholder } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";

/** 详情页媒体分区（硬件）：360° 3D 模型查看器占位 */
export function Viewer3DSection({ slug }: { slug: string }) {
  const t = useTranslations("products.detail");

  return (
    <section className="mt-16 bg-slate-50 md:mt-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-8 md:py-24 lg:px-12">
        <Reveal>
          <Placeholder
            ratio="aspect-square"
            variant="block"
            label="360° 3D 模型查看器占位：React Three Fiber + OrbitControls，拖拽旋转/滚轮缩放/自动旋转"
            size="1:1 · GLB/GLTF ≤10MB"
            name={`model-${slug}.glb`}
          />
        </Reveal>
        <Reveal delay={120}>
          <h2 className="font-heading text-foreground text-2xl font-bold md:text-3xl">
            {t("viewerTitle")}
          </h2>
          <p className="text-muted mt-4 leading-relaxed">{t("viewerNote")}</p>
          <button
            type="button"
            className="text-brand-blue border-brand-blue mt-6 inline-flex items-center gap-2 rounded-lg border bg-white px-5 py-2.5 text-sm font-medium transition-colors hover:bg-blue-50"
          >
            <RotateCcw className="h-4 w-4" />
            {t("resetView")}
          </button>
        </Reveal>
      </div>
    </section>
  );
}

/** 详情页媒体分区（软件）：界面展示 —— 平台核心截图 + 能力要点 */
export function InterfaceShowcaseSection({ product, loc }: { product: MockProduct; loc: Locale }) {
  const t = useTranslations("products.detail");

  const screenshots = [
    { label: "界面截图：库存总览看板", name: `${product.slug}-ui-dashboard.png` },
    { label: "界面截图：订单履约流转", name: `${product.slug}-ui-orders.png` },
    { label: "界面截图：数据分析报表", name: `${product.slug}-ui-analytics.png` },
  ];

  return (
    <section className="mt-16 bg-slate-50 md:mt-24">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
        <Reveal>
          <h2 className="font-heading text-foreground text-2xl font-bold md:text-3xl">
            {t("interface.title")}
          </h2>
          <p className="text-muted mt-2">{t("interface.subtitle")}</p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {screenshots.map((shot, index) => (
              <Placeholder
                key={shot.name}
                ratio="aspect-video"
                variant="block"
                className={index === 0 ? "md:col-span-2" : ""}
                label={shot.label}
                size="16:9 · 建议 1920×1080"
                name={shot.name}
              />
            ))}
          </div>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {product.features.map((raw) => {
              const feature = normalizeFeature(raw);
              return (
                <li
                  key={feature.text.en}
                  className="text-foreground flex items-start gap-2 text-sm"
                >
                  <CheckCircle2 className="text-brand-blue mt-0.5 h-4 w-4 shrink-0" />
                  {feature.text[loc]}
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
