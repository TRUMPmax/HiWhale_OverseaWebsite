import type { Industry, ProductCategory } from "../index";
import type { LocalizedText, MockSpecItem } from "./types";

/**
 * 枚举值常量（与 ProductCategory / Industry 字符串枚举一致）。
 * 使用类型导入 + 值断言，避免 products/* 与 constants/index 之间的运行时循环依赖。
 */
export const MANNED_FORKLIFT = "MANNED_FORKLIFT" as ProductCategory;
export const AGV_FORKLIFT = "AGV_FORKLIFT" as ProductCategory;
export const RGV = "RGV" as ProductCategory;
export const AGV = "AGV" as ProductCategory;
export const AMR = "AMR" as ProductCategory;
export const ROBOTIC_ARM = "ROBOTIC_ARM" as ProductCategory;
export const GANTRY_CRANE = "GANTRY_CRANE" as ProductCategory;
export const CLEANING_ROBOT = "CLEANING_ROBOT" as ProductCategory;
export const DELIVERY_ROBOT = "DELIVERY_ROBOT" as ProductCategory;
export const WCS = "WCS" as ProductCategory;
export const IWMS = "IWMS" as ProductCategory;

export const E_COMMERCE = "E_COMMERCE" as Industry;
export const AUTOMOTIVE = "AUTOMOTIVE" as Industry;
export const THIRD_PARTY_LOGISTICS = "THIRD_PARTY_LOGISTICS" as Industry;
export const FOOD_COLD_CHAIN = "FOOD_COLD_CHAIN" as Industry;
export const PHARMACEUTICAL = "PHARMACEUTICAL" as Industry;
export const PORT = "PORT" as Industry;

/** 便捷构造本地化文案 */
export function L(en: string, zh: string): LocalizedText {
  return { en, zh };
}

/** 便捷构造规格项 */
/** 便捷构造规格项（标签与值均为双语；缺省英文值时与中文一致） */
export function S(en: string, zh: string, valueZh: string, valueEn?: string): MockSpecItem {
  return { label: L(en, zh), value: L(valueEn ?? valueZh, valueZh) };
}

/** 常用规格组标题 */
export const GROUP_GENERAL = L("General", "基本参数");
export const GROUP_PERFORMANCE = L("Performance", "性能参数");
export const GROUP_BATTERY = L("Battery", "电池系统");
export const GROUP_SAFETY = L("Safety", "安全防护");
export const GROUP_COMMUNICATION = L("Communication", "通信与调度");
