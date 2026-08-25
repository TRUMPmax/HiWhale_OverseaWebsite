import { useLocale, useTranslations } from "next-intl";
import { getLocalizedLabel, PRODUCT_CATEGORY_LABELS } from "@hiwhale/shared/constants";
import type { MockProduct } from "@hiwhale/shared/constants";
import { Link } from "@/navigation";
import { Placeholder } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";

type ProductCardProps = {
  product: MockProduct;
  delay?: number;
  className?: string;
};

/** 产品卡片：列表页网格与详情页相关产品共用 */
export function ProductCard({ product, delay = 0, className = "" }: ProductCardProps) {
  const locale = useLocale();
  const t = useTranslations("products");
  const loc = locale === "zh" ? "zh" : "en";

  return (
    <Reveal delay={delay} className={`h-full ${className}`}>
      <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name[loc]}
            className="aspect-[4/3] w-full rounded-xl border border-slate-200 object-cover"
          />
        ) : (
          <Placeholder
            ratio="aspect-[4/3]"
            className="p-4"
            label={`${product.name[loc]}产品实拍图（45° 角，白色/浅灰背景）`}
            size="4:3 · 建议 1200×900"
            name={product.imageName}
          />
        )}
        <span className="mt-5 inline-flex w-fit items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
          {getLocalizedLabel(PRODUCT_CATEGORY_LABELS, product.category, locale)}
        </span>
        <h3 className="font-heading text-foreground mt-3 text-lg font-bold">{product.name[loc]}</h3>
        <p className="text-muted mt-1 font-mono text-sm">{product.model}</p>
        <dl className="mt-4 flex-1 space-y-1.5">
          {product.quickSpecs.slice(0, 3).map((spec) => (
            <div key={spec.label.en} className="flex items-center justify-between gap-2 text-sm">
              <dt className="text-subtle">{spec.label[loc]}</dt>
              <dd className="text-foreground text-right font-medium">{spec.value}</dd>
            </div>
          ))}
        </dl>
        <Link
          href={`/products/${product.slug}`}
          className="text-brand-blue mt-4 text-sm font-medium hover:underline"
        >
          {t("viewDetails")} →
        </Link>
      </div>
    </Reveal>
  );
}
