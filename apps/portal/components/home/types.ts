/** 首页行业卡片（site_settings["home-industries"] 值形状；数组顺序即展示顺序） */
export type HomeIndustryCard = {
  /** Industry 枚举 key 或自定义行业文本 */
  industry: string;
  /** 跳转方案详情 slug；空 → 链到 /solutions 列表 */
  solutionSlug?: string;
  /** 卡片描述；空且为核心行业 → 回退 messages 内置文案 */
  description?: { en: string; zh: string };
  /** 痛点 chip；空且为核心行业 → 回退 messages 内置文案 */
  painPoint?: { en: string; zh: string };
};
