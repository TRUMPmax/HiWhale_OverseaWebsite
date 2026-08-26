import type { InquiryStatus, LocalizedText, ProductCategory } from "@hiwhale/shared/constants";

/** 询盘跟进记录 */
export type MockInquiryFollowUp = {
  ts: string;
  author: LocalizedText;
  note: LocalizedText;
};

/** Dashboard 我的询盘类型（数据来自 /api/inquiries/mine，无 mock 数据） */
export type MockInquiry = {
  id: string;
  date: string;
  categories: ProductCategory[];
  status: InquiryStatus;
  description: LocalizedText;
  /** 完整需求描述（抽屉内展示） */
  details: LocalizedText;
  /** 销售跟进时间线 */
  followUps: MockInquiryFollowUp[];
};
