import type { ProductCategory, ProductGroup } from "./index";

/** 大类 → 品类 的两级映射（顺序即站点展示顺序） */
export const PRODUCT_CATEGORY_GROUPS: Array<{
  group: ProductGroup;
  categories: ProductCategory[];
}> = [
  {
    group: "FORKLIFT" as ProductGroup,
    categories: ["MANNED_FORKLIFT", "AGV_FORKLIFT"] as ProductCategory[],
  },
  {
    group: "MOBILE_ROBOT" as ProductGroup,
    categories: ["RGV", "AGV", "AMR"] as ProductCategory[],
  },
  {
    group: "ROBOTIC_ARM" as ProductGroup,
    categories: ["ROBOTIC_ARM"] as ProductCategory[],
  },
  {
    group: "GANTRY_CRANE" as ProductGroup,
    categories: ["GANTRY_CRANE"] as ProductCategory[],
  },
  {
    group: "CLEANING_ROBOT" as ProductGroup,
    categories: ["CLEANING_ROBOT"] as ProductCategory[],
  },
  {
    group: "DELIVERY_ROBOT" as ProductGroup,
    categories: ["DELIVERY_ROBOT"] as ProductCategory[],
  },
  {
    group: "SOFTWARE" as ProductGroup,
    categories: ["WCS", "IWMS"] as ProductCategory[],
  },
];

/** 查询品类所属大类 */
export function getGroupOfCategory(category: ProductCategory): ProductGroup {
  const found = PRODUCT_CATEGORY_GROUPS.find((g) => g.categories.includes(category));
  return (found ?? PRODUCT_CATEGORY_GROUPS[0]).group;
}
