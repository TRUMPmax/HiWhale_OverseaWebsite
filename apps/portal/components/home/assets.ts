import { Industry, ProductCategory, ProductGroup } from "@hiwhale/shared/constants";

/** 分类 key → slug（STACKER_CRANE → stacker-crane，与后端动态素材位文件名规则一致） */
export function slugifyKey(key: string): string {
  return key.toLowerCase().replaceAll("_", "-");
}

/** 各产品大类（一级）组合图素材文件名 */
export const GROUP_IMAGE_NAMES: Record<ProductGroup, string> = {
  [ProductGroup.FORKLIFT]: "product-group-forklift.png",
  [ProductGroup.MOBILE_ROBOT]: "product-group-mobile-robot.png",
  [ProductGroup.ROBOTIC_ARM]: "product-group-robotic-arm.png",
  [ProductGroup.GANTRY_CRANE]: "product-group-gantry-crane.png",
  [ProductGroup.CLEANING_ROBOT]: "product-group-cleaning-robot.png",
  [ProductGroup.DELIVERY_ROBOT]: "product-group-delivery-robot.png",
  [ProductGroup.SOFTWARE]: "product-group-software.png",
};

/** 分组组合图文件名：已知枚举走映射表，后台新增分组按 slug 规则派生 */
export function groupImageName(key: string): string {
  return GROUP_IMAGE_NAMES[key as ProductGroup] ?? `product-group-${slugifyKey(key)}.png`;
}

/** 各品类产品图素材文件名（与占位块一一对应，后期按名替换） */
export const CATEGORY_IMAGE_NAMES: Record<ProductCategory, string> = {
  [ProductCategory.MANNED_FORKLIFT]: "product-manned-forklift.png",
  [ProductCategory.AGV_FORKLIFT]: "product-agv-forklift.png",
  [ProductCategory.RGV]: "product-rgv.png",
  [ProductCategory.AGV]: "product-agv.png",
  [ProductCategory.AMR]: "product-amr.png",
  [ProductCategory.ROBOTIC_ARM]: "product-robotic-arm.png",
  [ProductCategory.GANTRY_CRANE]: "product-gantry-crane.png",
  [ProductCategory.CLEANING_ROBOT]: "product-cleaning-robot.png",
  [ProductCategory.DELIVERY_ROBOT]: "product-delivery-robot.png",
  [ProductCategory.WCS]: "product-wcs.png",
  [ProductCategory.IWMS]: "product-iwms.png",
};

/** 各行业场景图素材文件名 */
export const INDUSTRY_IMAGE_NAMES: Record<Industry, string> = {
  [Industry.E_COMMERCE]: "industry-ecommerce.png",
  [Industry.AUTOMOTIVE]: "industry-automotive.png",
  [Industry.THIRD_PARTY_LOGISTICS]: "industry-3pl.png",
  [Industry.FOOD_COLD_CHAIN]: "industry-cold-chain.png",
  [Industry.PHARMACEUTICAL]: "industry-pharmaceutical.png",
  [Industry.PORT]: "industry-port.png",
};
