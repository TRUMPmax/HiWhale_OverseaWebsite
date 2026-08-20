/** 门户注册用户 Mock 数据 */
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

export const MOCK_PORTAL_USERS: MockPortalUser[] = [
  {
    id: "u-01",
    name: "Thomas Müller",
    company: "Bavaria Logistics GmbH",
    email: "t.mueller@bavaria-logistics.de",
    country: "德国",
    registeredAt: "2026-07-02",
    aiChatCount: 34,
    status: "active",
  },
  {
    id: "u-02",
    name: "Sarah Johnson",
    company: "Midwest Fulfillment Inc.",
    email: "sarah.j@midwestfulfill.com",
    country: "美国",
    registeredAt: "2026-07-15",
    aiChatCount: 57,
    status: "active",
  },
  {
    id: "u-03",
    name: "Kenji Tanaka",
    company: "Tanaka Seiki Co., Ltd.",
    email: "tanaka@tanakaseiki.jp",
    country: "日本",
    registeredAt: "2026-06-21",
    aiChatCount: 12,
    status: "active",
  },
  {
    id: "u-04",
    name: "Ahmad Rahman",
    company: "HarborLink Terminal",
    email: "a.rahman@harborlink.sg",
    country: "新加坡",
    registeredAt: "2026-05-30",
    aiChatCount: 89,
    status: "active",
  },
  {
    id: "u-05",
    name: "Emma Dubois",
    company: "FraisChaîne SAS",
    email: "emma.dubois@fraischaine.fr",
    country: "法国",
    registeredAt: "2026-07-28",
    aiChatCount: 8,
    status: "disabled",
  },
  {
    id: "u-06",
    name: "Carlos Mendes",
    company: "Mercado Sul Logística",
    email: "carlos@mercadosul.com.br",
    country: "巴西",
    registeredAt: "2026-08-01",
    aiChatCount: 21,
    status: "active",
  },
  {
    id: "u-07",
    name: "Anna Kowalska",
    company: "PolPharma Distribution",
    email: "a.kowalska@polpharma.pl",
    country: "波兰",
    registeredAt: "2026-06-10",
    aiChatCount: 45,
    status: "active",
  },
  {
    id: "u-08",
    name: "James Wilson",
    company: "Outback Parts Pty Ltd",
    email: "jwilson@outbackparts.com.au",
    country: "澳大利亚",
    registeredAt: "2026-07-19",
    aiChatCount: 6,
    status: "active",
  },
  {
    id: "u-09",
    name: "Fatima Al-Sayed",
    company: "Gulf Cold Chain LLC",
    email: "fatima@gulfcoldchain.ae",
    country: "阿联酋",
    registeredAt: "2026-08-05",
    aiChatCount: 18,
    status: "active",
  },
  {
    id: "u-10",
    name: "Luca Rossi",
    company: "Rossi Automotive SpA",
    email: "l.rossi@rossiauto.it",
    country: "意大利",
    registeredAt: "2026-04-22",
    aiChatCount: 63,
    status: "disabled",
  },
];

/** 用户近期询盘 Mock（详情抽屉展示） */
export const MOCK_USER_INQUIRIES: Record<string, Array<{ date: string; summary: string }>> = {
  default: [
    { date: "2026-08-12", summary: "咨询无人叉车载重与货架适配" },
    { date: "2026-07-28", summary: "索取 WCS 调度系统演示环境" },
  ],
};
