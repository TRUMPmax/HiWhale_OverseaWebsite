import type { Industry, ProductCategory } from "../index";
import type { LocalizedText } from "../products/types";

export type MockSolutionStep = {
  title: LocalizedText;
  description: LocalizedText;
};

export type MockSolutionResult = {
  value: string;
  label: LocalizedText;
};

/** Stage 5 行业方案 Mock 类型（后续由数据库 Solution 替换） */
export type MockSolution = {
  slug: string;
  industry: Industry;
  title: LocalizedText;
  summary: LocalizedText;
  description: LocalizedText;
  /** 行业痛点，4 条 */
  painPoints: LocalizedText[];
  /** 设备组合（品类），3-5 个 */
  equipment: ProductCategory[];
  /** 部署流程，5 步 */
  process: MockSolutionStep[];
  /** 关键成效，3-4 条 */
  results: MockSolutionResult[];
  /** 方案场景图素材文件名 */
  imageName: string;
};
