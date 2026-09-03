import {
  PRODUCT_CATEGORY_GROUPS,
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_GROUP_LABELS,
} from "@hiwhale/shared/constants";
import { adminApi } from "./api";

/** 分类树节点（DB 实体形状） */
export type TaxonomyCategory = {
  id: string;
  key: string;
  nameJson: { en: string; zh: string };
  sort: number;
};
export type TaxonomyGroup = {
  id: string;
  key: string;
  nameJson: { en: string; zh: string };
  icon?: string | null;
  sort: number;
  categories: TaxonomyCategory[];
};

/** 静态回退：代码内分类体系 */
export const STATIC_ADMIN_TAXONOMY: TaxonomyGroup[] = PRODUCT_CATEGORY_GROUPS.map(
  ({ group, categories }, gi) => ({
    id: group,
    key: group,
    nameJson: PRODUCT_GROUP_LABELS[group],
    sort: gi,
    categories: categories.map((c, ci) => ({
      id: c,
      key: c,
      nameJson: PRODUCT_CATEGORY_LABELS[c],
      sort: ci,
    })),
  }),
);

/** 获取分类树：优先 API（DB 实体），失败回退静态常量 */
export async function fetchAdminTaxonomy(): Promise<TaxonomyGroup[]> {
  try {
    const data = await adminApi<TaxonomyGroup[]>("/api/taxonomy");
    if (Array.isArray(data) && data.length > 0) return data;
  } catch {
    // fall through
  }
  return STATIC_ADMIN_TAXONOMY;
}
