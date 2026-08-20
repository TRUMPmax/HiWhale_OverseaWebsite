/** 共享常量与枚举 */
export const APP_NAME = "HiWhale Robotics";

export type Locale = "en" | "zh";

export function getLocalizedLabel<T>(
  map: Record<string, Record<Locale, T>>,
  key: string,
  locale: string,
  fallback: Locale = "en",
): T {
  const labels = map[key];
  if (!labels) return map[Object.keys(map)[0]]?.[fallback];
  return labels[locale as Locale] ?? labels[fallback];
}

/** 产品大类（一级分类） */
export enum ProductGroup {
  FORKLIFT = "FORKLIFT",
  MOBILE_ROBOT = "MOBILE_ROBOT",
  ROBOTIC_ARM = "ROBOTIC_ARM",
  GANTRY_CRANE = "GANTRY_CRANE",
  SOFTWARE = "SOFTWARE",
}

export const PRODUCT_GROUP_LABELS: Record<ProductGroup, { en: string; zh: string }> = {
  [ProductGroup.FORKLIFT]: { en: "Forklifts", zh: "叉车产品" },
  [ProductGroup.MOBILE_ROBOT]: { en: "Mobile Robots", zh: "移动机器人" },
  [ProductGroup.ROBOTIC_ARM]: { en: "Robotic Arms", zh: "机械臂" },
  [ProductGroup.GANTRY_CRANE]: { en: "Gantry Cranes", zh: "龙门吊" },
  [ProductGroup.SOFTWARE]: { en: "Software", zh: "软件系统" },
};

/** 产品品类（二级分类） */
export enum ProductCategory {
  MANNED_FORKLIFT = "MANNED_FORKLIFT",
  AGV_FORKLIFT = "AGV_FORKLIFT",
  RGV = "RGV",
  AGV = "AGV",
  AMR = "AMR",
  ROBOTIC_ARM = "ROBOTIC_ARM",
  GANTRY_CRANE = "GANTRY_CRANE",
  WCS = "WCS",
  IWMS = "IWMS",
}

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, { en: string; zh: string }> = {
  [ProductCategory.MANNED_FORKLIFT]: { en: "Manned Forklift", zh: "有人叉车" },
  [ProductCategory.AGV_FORKLIFT]: { en: "AGV Forklift", zh: "无人叉车 AGV" },
  [ProductCategory.RGV]: { en: "RGV", zh: "有轨制导车 RGV" },
  [ProductCategory.AGV]: { en: "AGV", zh: "自动导引车 AGV" },
  [ProductCategory.AMR]: { en: "AMR", zh: "自主移动机器人 AMR" },
  [ProductCategory.ROBOTIC_ARM]: { en: "Robotic Arm", zh: "机械臂" },
  [ProductCategory.GANTRY_CRANE]: { en: "Gantry Crane", zh: "龙门吊" },
  [ProductCategory.WCS]: { en: "WCS Scheduler", zh: "调度系统 WCS" },
  [ProductCategory.IWMS]: { en: "IWMS Platform", zh: "仓储管理系统 IWMS" },
};

export enum Industry {
  E_COMMERCE = "E_COMMERCE",
  AUTOMOTIVE = "AUTOMOTIVE",
  THIRD_PARTY_LOGISTICS = "THIRD_PARTY_LOGISTICS",
  FOOD_COLD_CHAIN = "FOOD_COLD_CHAIN",
  PHARMACEUTICAL = "PHARMACEUTICAL",
  PORT = "PORT",
}

export const INDUSTRY_LABELS: Record<Industry, { en: string; zh: string }> = {
  [Industry.E_COMMERCE]: { en: "E-commerce", zh: "电商" },
  [Industry.AUTOMOTIVE]: { en: "Automotive", zh: "汽车" },
  [Industry.THIRD_PARTY_LOGISTICS]: { en: "3PL", zh: "第三方物流" },
  [Industry.FOOD_COLD_CHAIN]: { en: "Food & Cold Chain", zh: "食品冷链" },
  [Industry.PHARMACEUTICAL]: { en: "Pharmaceutical", zh: "医药" },
  [Industry.PORT]: { en: "Port", zh: "港口" },
};

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  SALES = "SALES",
  PRODUCT_TECH = "PRODUCT_TECH",
  OPERATIONS = "OPERATIONS",
}

export const USER_ROLE_LABELS: Record<UserRole, { en: string; zh: string }> = {
  [UserRole.SUPER_ADMIN]: { en: "Super Admin", zh: "超级管理员" },
  [UserRole.SALES]: { en: "Sales", zh: "销售" },
  [UserRole.PRODUCT_TECH]: { en: "Product / Tech", zh: "产品/技术" },
  [UserRole.OPERATIONS]: { en: "Operations", zh: "运营" },
};

export enum InquiryStatus {
  NEW = "NEW",
  FOLLOWING = "FOLLOWING",
  WON = "WON",
  CLOSED = "CLOSED",
}

export * from "./product-groups";
export * from "./products";
export * from "./solutions";
export * from "./cases";

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, { en: string; zh: string }> = {
  [InquiryStatus.NEW]: { en: "New", zh: "新询盘" },
  [InquiryStatus.FOLLOWING]: { en: "Following", zh: "跟进中" },
  [InquiryStatus.WON]: { en: "Won", zh: "已成交" },
  [InquiryStatus.CLOSED]: { en: "Closed", zh: "已关闭" },
};
