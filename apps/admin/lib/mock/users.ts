/** 门户注册用户类型（数据来自 /api/users，无 mock 数据） */
export type MockPortalUser = {
  id: string;
  name: string;
  company: string;
  email: string;
  country: string;
  registeredAt: string;
  aiChatCount: number;
  status: "active" | "disabled";
};
