import type { LocalizedText } from "../products/types";

export type MockSolutionStep = {
  title: LocalizedText;
  description: LocalizedText;
};

export type MockSolutionResult = {
  value: string;
  label: LocalizedText;
  /** 可选展示图标（PORTAL_ICON_OPTIONS 白名单 name；空 → 前台不渲染图标） */
  icon?: string;
};

/** 痛点条目：新形状可带 icon；旧数据为纯 LocalizedText（兼容） */
export type MockSolutionPainPoint = {
  text: LocalizedText;
  icon?: string;
};

/** 兼容旧形状（纯 LocalizedText）与新形状（{text, icon}） */
export function normalizePainPoint(
  p: LocalizedText | MockSolutionPainPoint,
): MockSolutionPainPoint {
  return "text" in p ? p : { text: p };
}

/** 行业方案类型（与 API Solution 形状一致） */
export type MockSolution = {
  slug: string;
  /** 行业：内置 Industry 枚举 key，或管理后台手输的自定义行业文本 */
  industry: string;
  title: LocalizedText;
  summary: LocalizedText;
  description: LocalizedText;
  /** 交付周期（可选，如 "8-12 weeks" / "8-12 周"）；空 → 前台不展示 */
  duration?: LocalizedText;
  /** 行业痛点，4 条（兼容旧纯文本形状） */
  painPoints: Array<LocalizedText | MockSolutionPainPoint>;
  /** 关联产品 slug 数组 */
  productSlugs: string[];
  /** 部署流程，5 步 */
  process: MockSolutionStep[];
  /** 关键成效，3-4 条 */
  results: MockSolutionResult[];
  /** 方案场景图素材文件名 */
  imageName: string;
};
