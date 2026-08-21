import { Industry, ProductCategory, ProductGroup } from "@hiwhale/shared/constants";

/** 各产品大类（一级）组合图素材文件名 */
export const GROUP_IMAGE_NAMES: Record<ProductGroup, string> = {
  [ProductGroup.FORKLIFT]: "product-group-forklift.png",
  [ProductGroup.MOBILE_ROBOT]: "product-group-mobile-robot.png",
  [ProductGroup.ROBOTIC_ARM]: "product-group-robotic-arm.png",
  [ProductGroup.GANTRY_CRANE]: "product-group-gantry-crane.png",
  [ProductGroup.SOFTWARE]: "product-group-software.png",
};

/** 各品类产品图素材文件名（与占位块一一对应，后期按名替换） */
export const CATEGORY_IMAGE_NAMES: Record<ProductCategory, string> = {
  [ProductCategory.MANNED_FORKLIFT]: "product-manned-forklift.png",
  [ProductCategory.AGV_FORKLIFT]: "product-agv-forklift.png",
  [ProductCategory.RGV]: "product-rgv.png",
  [ProductCategory.AGV]: "product-agv.png",
  [ProductCategory.AMR]: "product-amr.png",
  [ProductCategory.ROBOTIC_ARM]: "product-robotic-arm.png",
  [ProductCategory.GANTRY_CRANE]: "product-gantry-crane.png",
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
