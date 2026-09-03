import type { Industry } from "../index";
import type { LocalizedText } from "../products/types";

export type MockCaseResult = {
  value: string;
  label: LocalizedText;
  /** 可选展示图标（PORTAL_ICON_OPTIONS 白名单 name；空 → 前台不渲染图标） */
  icon?: string;
};

export type MockCaseTestimonial = {
  quote: LocalizedText;
  author: LocalizedText;
  role: LocalizedText;
};

/** Stage 5 客户案例 Mock 类型（后续由数据库 CaseStudy 替换） */
export type MockCase = {
  slug: string;
  clientName: LocalizedText;
  industry: Industry;
  /** 项目标题 */
  project: LocalizedText;
  background: LocalizedText;
  challenge: LocalizedText;
  solution: LocalizedText;
  /** 投入设备清单（文字） */
  equipment: LocalizedText[];
  /** 关联产品 slug 数组（门户"相关产品"区块数据源） */
  productSlugs: string[];
  /** 交付周期，如 "14 weeks" / "14 周" */
  duration: LocalizedText;
  /** 前后对比式成效指标，3-4 条 */
  results: MockCaseResult[];
  testimonial: MockCaseTestimonial;
  /** 客户 Logo 素材文件名 */
  logoName: string;
  /** 项目现场图素材文件名 */
  imageName: string;
};
