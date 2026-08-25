import type { Industry, Locale, ProductCategory } from "../index";

/** 本地化文案 */
export type LocalizedText = Record<Locale, string>;

export type MockSpecItem = {
  label: LocalizedText;
  value: LocalizedText;
};

export type MockSpecGroup = {
  group: LocalizedText;
  items: MockSpecItem[];
};

/** Stage 4 产品详情页使用的 Mock 产品类型（后续由数据库 Product 替换） */
export type MockProduct = {
  /** 数据库 ID（API 数据存在；内置 Mock 无） */
  id?: string;
  slug: string;
  model: string;
  category: ProductCategory;
  name: LocalizedText;
  tagline: LocalizedText;
  description: LocalizedText;
  /** 核心参数（列表卡片 / 详情页头部），3-4 项 */
  quickSpecs: MockSpecItem[];
  /** 分组完整规格表 */
  specGroups: MockSpecGroup[];
  /** 核心特性，3-4 条 */
  features: LocalizedText[];
  /** 适用行业，2-3 个 */
  scenarios: Industry[];
  /** 产品实拍图素材文件名 */
  imageName: string;
  /** 已上传素材 URL（MinIO）；为空时前端显示占位块 */
  imageUrl?: string | null;
  specUrl?: string | null;
  modelUrl?: string | null;
  /** 全部已上传图片 URL（主图在前，细节图随后） */
  imageUrls?: string[];
};
