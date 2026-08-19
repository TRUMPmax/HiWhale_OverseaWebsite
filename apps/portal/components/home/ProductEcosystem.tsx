import { useTranslations, useLocale } from "next-intl";
import { Bot, Cog, Container, Hand, Monitor, Truck } from "lucide-react";
import { Link } from "@/navigation";
import { Placeholder } from "@/components/ui/Placeholder";
import {
  getLocalizedLabel,
  PRODUCT_CATEGORY_LABELS,
  ProductCategory,
} from "@hiwhale/shared/constants";

const CATEGORY_ICONS: Record<ProductCategory, typeof Truck> = {
  [ProductCategory.AGV_FORKLIFT]: Truck,
  [ProductCategory.AMR]: Bot,
  [ProductCategory.MANNED_FORKLIFT]: Hand,
  [ProductCategory.ROBOTIC_ARM]: Cog,
  [ProductCategory.GANTRY_CRANE]: Container,
  [ProductCategory.SYSTEM_SOFTWARE]: Monitor,
};

const CATEGORY_IMAGE_NAMES: Record<ProductCategory, string> = {
  [ProductCategory.AGV_FORKLIFT]: "product-agv-forklift.png",
  [ProductCategory.AMR]: "product-amr.png",
  [ProductCategory.MANNED_FORKLIFT]: "product-manned-forklift.png",
  [ProductCategory.ROBOTIC_ARM]: "product-robotic-arm.png",
  [ProductCategory.GANTRY_CRANE]: "product-gantry-crane.png",
  [ProductCategory.SYSTEM_SOFTWARE]: "product-system-software.png",
};

/** 首页分区 2：产品生态（6 大品类卡片） */
export function ProductEcosystem() {
  const t = useTranslations("home.ecosystem");
  const locale = useLocale();
  const categories = Object.values(ProductCategory);

  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-foreground text-3xl font-bold md:text-4xl">
            {t("title")}
          </h2>
          <p className="text-muted mt-4 text-lg">{t("subtitle")}</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = CATEGORY_ICONS[category];
            return (
              <div
                key={category}
                className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
              >
                <Placeholder
                  ratio="aspect-[4/3]"
                  className="p-4"
                  label={t(`items.${category}.image`)}
                  size={t("imageSize")}
                  name={CATEGORY_IMAGE_NAMES[category]}
                />
                <div className="mt-5 flex items-center gap-3">
                  <Icon className="text-brand-blue h-5 w-5" />
                  <h3 className="font-heading text-foreground text-lg font-bold">
                    {getLocalizedLabel(PRODUCT_CATEGORY_LABELS, category, locale)}
                  </h3>
                </div>
                <p className="text-muted mt-2 flex-1 text-sm leading-relaxed">
                  {t(`items.${category}.description`)}
                </p>
                <Link
                  href={`/products?category=${category}`}
                  className="text-brand-blue mt-4 text-sm font-medium hover:underline"
                >
                  {t("explore")} →
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
