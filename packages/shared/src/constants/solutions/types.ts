import type { LocalizedText } from "../products/types";

export type MockSolutionStep = {
  title: LocalizedText;
  description: LocalizedText;
};

export type MockSolutionResult = {
  value: string;
  label: LocalizedText;
};

/** 行业方案类型（与 API Solution 形状一致） */
export type MockSolution = {
  slug: string;
  /** 行业：内置 Industry 枚举 key，或管理后台手输的自定义行业文本 */
  industry: string;
  title: LocalizedText;
  summary: LocalizedText;
  description: LocalizedText;
  /** 行业痛点，4 条 */
  painPoints: LocalizedText[];
  /** 关联产品 slug 数组 */
  productSlugs: string[];
  /** 部署流程，5 步 */
  process: MockSolutionStep[];
  /** 关键成效，3-4 条 */
  results: MockSolutionResult[];
  /** 方案场景图素材文件名 */
  imageName: string;
};
