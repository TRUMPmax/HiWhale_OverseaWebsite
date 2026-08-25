import {
  PRODUCT_CATEGORY_GROUPS,
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_GROUP_LABELS,
} from "@hiwhale/shared/constants";
import { apiGet } from "./api";

/** 分类树节点（DB 实体形状） */
export type TaxonomyCategory = {
  key: string;
  nameJson: { en: string; zh: string };
  sort?: number;
};
export type TaxonomyGroup = {
  key: string;
  nameJson: { en: string; zh: string };
  sort?: number;
  categories: TaxonomyCategory[];
};

/** 静态回退：代码内分类体系（API 不可用时门户照常工作） */
export const STATIC_TAXONOMY: TaxonomyGroup[] = PRODUCT_CATEGORY_GROUPS.map(
  ({ group, categories }) => ({
    key: group,
    nameJson: PRODUCT_GROUP_LABELS[group],
    categories: categories.map((c) => ({ key: c, nameJson: PRODUCT_CATEGORY_LABELS[c] })),
  }),
);

/** 服务端获取分类树：优先 API（DB 实体），失败/为空回退静态常量 */
export async function fetchTaxonomy(): Promise<TaxonomyGroup[]> {
  try {
    const data = await apiGet<TaxonomyGroup[]>("/api/taxonomy");
    if (Array.isArray(data) && data.length > 0) return data;
  } catch {
    // fall through
  }
  return STATIC_TAXONOMY;
}

/** 品类 key → 大类 key 映射（用于筛选与面包屑） */
export function categoryGroupMap(taxonomy: TaxonomyGroup[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const g of taxonomy) for (const c of g.categories) map.set(c.key, g.key);
  return map;
}

/** 分类树 → 标签查找（按 key） */
export function taxonomyLabel(
  taxonomy: TaxonomyGroup[],
  key: string,
  locale: string,
): string | undefined {
  const loc = locale === "zh" ? ("zh" as const) : ("en" as const);
  for (const g of taxonomy) {
    if (g.key === key) return g.nameJson[loc];
    const c = g.categories.find((c) => c.key === key);
    if (c) return c.nameJson[loc];
  }
  return undefined;
}
