import type { ProductCategory, ProductGroup } from "../index";
import { getGroupOfCategory } from "../product-groups";
import type { MockProduct } from "./types";
import { mbv15r } from "./mbv15r";
import { mbv20p } from "./mbv20p";
import { mba12t } from "./mba12t";
import { mbh08l } from "./mbh08l";
import { mbt10r } from "./mbt10r";
import { mbr04g } from "./mbr04g";
import { mbf35e } from "./mbf35e";
import { mbr160 } from "./mbr160";
import { mbg40t } from "./mbg40t";
import { hiwhaleWcs } from "./hiwhale-wcs";
import { hiwhaleIwms } from "./hiwhale-iwms";

export * from "./types";

/** Mock 产品全集（11 款，覆盖全部 5 大类 / 9 品类） */
export const MOCK_PRODUCTS: MockProduct[] = [
  mbv15r,
  mbv20p,
  mba12t,
  mbh08l,
  mbt10r,
  mbr04g,
  mbf35e,
  mbr160,
  mbg40t,
  hiwhaleWcs,
  hiwhaleIwms,
];

/** 按 slug 查询产品 */
export function getProductBySlug(slug: string): MockProduct | undefined {
  return MOCK_PRODUCTS.find((p) => p.slug === slug);
}

/** 按品类（二级）查询产品 */
export function getProductsByCategory(category: ProductCategory): MockProduct[] {
  return MOCK_PRODUCTS.filter((p) => p.category === category);
}

/** 按大类（一级）查询产品 */
export function getProductsByGroup(group: ProductGroup): MockProduct[] {
  return MOCK_PRODUCTS.filter((p) => getGroupOfCategory(p.category) === group);
}

/** 相关推荐：同品类其他产品 */
export function getRelatedProducts(product: MockProduct, limit = 3): MockProduct[] {
  return MOCK_PRODUCTS.filter(
    (p) => p.category === product.category && p.slug !== product.slug,
  ).slice(0, limit);
}
