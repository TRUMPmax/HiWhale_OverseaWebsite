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
import { cc1 } from "./cc1";
import { cc1Pro } from "./cc1Pro";
import { bg1Pro } from "./bg1Pro";
import { mt1 } from "./mt1";
import { mt1Max } from "./mt1Max";
import { mt1Vac } from "./mt1Vac";
import { t150 } from "./t150";
import { t300 } from "./t300";
import { t600 } from "./t600";

export * from "./types";

/** Mock 产品全集（20 款，覆盖全部 7 大类 / 11 品类） */
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
  cc1,
  cc1Pro,
  bg1Pro,
  mt1,
  mt1Max,
  mt1Vac,
  t150,
  t300,
  t600,
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
