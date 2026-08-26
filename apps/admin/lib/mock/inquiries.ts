import type { InquiryStatus, ProductCategory } from "@hiwhale/shared/constants";

/** 询盘跟进记录类型（数据来自 /api/inquiries，无 mock 数据） */
export type MockAdminFollowUp = {
  ts: string;
  author: string;
  note: string;
};

export type MockAdminInquiry = {
  id: string;
  customer: string;
  company: string;
  country: string;
  email: string;
  phone?: string;
  categories: ProductCategory[];
  message: string;
  status: InquiryStatus;
  assignee: string | null;
  createdAt: string;
  followUps: MockAdminFollowUp[];
};
