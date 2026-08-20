import { Industry, ProductCategory } from "@hiwhale/shared/constants";

/** 各品类产品图素材文件名（与占位块一一对应，后期按名替换） */
export const CATEGORY_IMAGE_NAMES: Record<ProductCategory, string> = {
  [ProductCategory.AGV_FORKLIFT]: "product-agv-forklift.png",
  [ProductCategory.AMR]: "product-amr.png",
  [ProductCategory.MANNED_FORKLIFT]: "product-manned-forklift.png",
  [ProductCategory.ROBOTIC_ARM]: "product-robotic-arm.png",
  [ProductCategory.GANTRY_CRANE]: "product-gantry-crane.png",
  [ProductCategory.SYSTEM_SOFTWARE]: "product-system-software.png",
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
