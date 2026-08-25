import { useTranslations, useLocale } from "next-intl";
import { Bot, Cog, Container, Monitor, Sparkles, Truck, PackageOpen } from "lucide-react";
import { Link } from "@/navigation";
import { Placeholder } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { GROUP_IMAGE_NAMES } from "./assets";
import {
  getLocalizedLabel,
  PRODUCT_CATEGORY_GROUPS,
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_GROUP_LABELS,
  ProductGroup,
} from "@hiwhale/shared/constants";

const GROUP_ICONS: Record<ProductGroup, typeof Truck> = {
  [ProductGroup.FORKLIFT]: Truck,
  [ProductGroup.MOBILE_ROBOT]: Bot,
  [ProductGroup.ROBOTIC_ARM]: Cog,
  [ProductGroup.GANTRY_CRANE]: Container,
  [ProductGroup.CLEANING_ROBOT]: Sparkles,
  [ProductGroup.DELIVERY_ROBOT]: PackageOpen,
  [ProductGroup.SOFTWARE]: Monitor,
};

/** 已投放真实素材的产品组（public/images/products/ 下有图即用真图） */
const GROUPS_WITH_IMAGE: ReadonlySet<ProductGroup> = new Set([ProductGroup.ROBOTIC_ARM]);

/** 首页分区 2：产品生态（5 大类产品卡片） */
export function ProductEcosystem() {
  const t = useTranslations("home.ecosystem");
  const locale = useLocale();

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
          {PRODUCT_CATEGORY_GROUPS.map(({ group, categories }, index) => {
            const Icon = GROUP_ICONS[group];
            const subcategories = categories
              .map((c) => getLocalizedLabel(PRODUCT_CATEGORY_LABELS, c, locale))
              .join(" · ");
            return (
              <Reveal key={group} delay={index * 80} className="h-full">
                <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg">
                  {GROUPS_WITH_IMAGE.has(group) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`/images/products/${GROUP_IMAGE_NAMES[group]}`}
                      alt={getLocalizedLabel(PRODUCT_GROUP_LABELS, group, locale)}
                      className="aspect-[4/3] w-full rounded-lg object-cover"
                    />
                  ) : (
                    <Placeholder
                      ratio="aspect-[4/3]"
                      className="p-4"
                      label={t(`items.${group}.image`)}
                      size={t("imageSize")}
                      name={GROUP_IMAGE_NAMES[group]}
                    />
                  )}
                  <div className="mt-5 flex items-center gap-3">
                    <Icon className="text-brand-blue h-5 w-5" />
                    <h3 className="font-heading text-foreground text-lg font-bold">
                      {getLocalizedLabel(PRODUCT_GROUP_LABELS, group, locale)}
                    </h3>
                  </div>
                  <p className="text-brand-blue mt-1 text-xs font-medium">{subcategories}</p>
                  <p className="text-muted mt-2 flex-1 text-sm leading-relaxed">
                    {t(`items.${group}.description`)}
                  </p>
                  <Link
                    href={`/products?group=${group}`}
                    className="text-brand-blue mt-4 text-sm font-medium hover:underline"
                  >
                    {t("explore")} →
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
