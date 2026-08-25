import { useTranslations, useLocale } from "next-intl";
import { Bot, Cog, Container, Monitor, Sparkles, Truck, PackageOpen, Shapes } from "lucide-react";
import { Link } from "@/navigation";
import { SlottedImage } from "@/components/ui/SlottedImage";
import { Reveal } from "@/components/ui/Reveal";
import { GROUP_IMAGE_NAMES } from "./assets";
import { ProductGroup } from "@hiwhale/shared/constants";
import { STATIC_TAXONOMY, taxonomyLabel, type TaxonomyGroup } from "@/lib/taxonomy";

const GROUP_ICONS: Record<ProductGroup, typeof Truck> = {
  [ProductGroup.FORKLIFT]: Truck,
  [ProductGroup.MOBILE_ROBOT]: Bot,
  [ProductGroup.ROBOTIC_ARM]: Cog,
  [ProductGroup.GANTRY_CRANE]: Container,
  [ProductGroup.CLEANING_ROBOT]: Sparkles,
  [ProductGroup.DELIVERY_ROBOT]: PackageOpen,
  [ProductGroup.SOFTWARE]: Monitor,
};

/** 首页分区 2：产品生态（分类体系由服务端传入，API 失败时回退静态常量） */
export function ProductEcosystem({ taxonomy }: { taxonomy: TaxonomyGroup[] }) {
  const t = useTranslations("home.ecosystem");
  const locale = useLocale();
  const knownKeys = new Set(STATIC_TAXONOMY.map((g) => g.key));

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
          {taxonomy.map((group, index) => {
            const Icon = GROUP_ICONS[group.key as ProductGroup] ?? Shapes;
            const known = knownKeys.has(group.key);
            const name = taxonomyLabel(taxonomy, group.key, locale) ?? group.key;
            const subcategories = group.categories
              .map((c) => taxonomyLabel(taxonomy, c.key, locale))
              .join(" · ");
            // 文案仅静态分类有 i18n 键；新增分类回退到名称本身
            const description = known
              ? t(`items.${group.key}.description`)
              : taxonomyLabel(taxonomy, group.key, "zh");
            const groupKey = group.key as ProductGroup;
            return (
              <Reveal key={group.key} delay={index * 80} className="h-full">
                <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg">
                  <SlottedImage
                    src={`/images/products/${GROUP_IMAGE_NAMES[groupKey] ?? `product-group-${group.key.toLowerCase()}.png`}`}
                    alt={name}
                    className="aspect-[4/3] w-full rounded-lg object-cover"
                    placeholder={{
                      ratio: "aspect-[4/3]",
                      className: "p-4",
                      label: known
                        ? t(`items.${group.key}.image`)
                        : `${taxonomyLabel(taxonomy, group.key, "zh")} 组合图（占位）`,
                      size: t("imageSize"),
                      name:
                        GROUP_IMAGE_NAMES[groupKey] ??
                        `product-group-${group.key.toLowerCase()}.png`,
                    }}
                  />
                  <div className="mt-5 flex items-center gap-3">
                    <Icon className="text-brand-blue h-5 w-5" />
                    <h3 className="font-heading text-foreground text-lg font-bold">{name}</h3>
                  </div>
                  <p className="text-brand-blue mt-1 text-xs font-medium">{subcategories}</p>
                  <p className="text-muted mt-2 flex-1 text-sm leading-relaxed">{description}</p>
                  <Link
                    href={`/products?group=${group.key}`}
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
