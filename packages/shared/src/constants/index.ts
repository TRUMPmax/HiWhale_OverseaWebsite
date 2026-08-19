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

export enum ProductCategory {
  AGV_FORKLIFT = "AGV_FORKLIFT",
  AMR = "AMR",
  MANNED_FORKLIFT = "MANNED_FORKLIFT",
  ROBOTIC_ARM = "ROBOTIC_ARM",
  GANTRY_CRANE = "GANTRY_CRANE",
  SYSTEM_SOFTWARE = "SYSTEM_SOFTWARE",
}

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, { en: string; zh: string }> = {
  [ProductCategory.AGV_FORKLIFT]: { en: "AGV Forklift", zh: "无人叉车 AGV" },
  [ProductCategory.AMR]: { en: "AMR", zh: "自主移动机器人 AMR" },
  [ProductCategory.MANNED_FORKLIFT]: { en: "Manned Forklift", zh: "有人叉车" },
  [ProductCategory.ROBOTIC_ARM]: { en: "Robotic Arm", zh: "机械臂" },
  [ProductCategory.GANTRY_CRANE]: { en: "Gantry Crane", zh: "龙门吊" },
  [ProductCategory.SYSTEM_SOFTWARE]: { en: "System Software", zh: "调度系统软件" },
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

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, { en: string; zh: string }> = {
  [InquiryStatus.NEW]: { en: "New", zh: "新询盘" },
  [InquiryStatus.FOLLOWING]: { en: "Following", zh: "跟进中" },
  [InquiryStatus.WON]: { en: "Won", zh: "已成交" },
  [InquiryStatus.CLOSED]: { en: "Closed", zh: "已关闭" },
};
