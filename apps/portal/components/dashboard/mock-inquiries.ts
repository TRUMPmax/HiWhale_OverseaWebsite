import type { InquiryStatus, ProductCategory } from "@hiwhale/shared/constants";
import type { LocalizedText } from "@hiwhale/shared/constants";

/** Dashboard 我的询盘 Mock 数据（后续接入真实询盘 API） */
export type MockInquiry = {
  id: string;
  date: string;
  categories: ProductCategory[];
  status: InquiryStatus;
  description: LocalizedText;
};

export const MOCK_INQUIRIES: MockInquiry[] = [
  {
    id: "INQ-20260810-01",
    date: "2026-08-10",
    categories: ["AGV_FORKLIFT", "WCS"] as ProductCategory[],
    status: "FOLLOWING" as InquiryStatus,
    description: {
      en: "Need 6 AGV forklifts and WCS scheduling for a 12,000 m² e-commerce warehouse in Rotterdam. Rack height 4.5 m, target go-live Q1 2027.",
      zh: "鹿特丹 1.2 万平米电商仓，需要 6 台无人叉车与 WCS 调度系统。货架高度 4.5 米，目标 2027 年一季度上线。",
    },
  },
  {
    id: "INQ-20260722-02",
    date: "2026-07-22",
    categories: ["AMR"] as ProductCategory[],
    status: "NEW" as InquiryStatus,
    description: {
      en: "Evaluating goods-to-person AMR system for a pharma distribution center; GMP compliance documentation required.",
      zh: "为医药配送中心评估货到人 AMR 系统，需要 GMP 合规文档。",
    },
  },
  {
    id: "INQ-20260615-03",
    date: "2026-06-15",
    categories: ["GANTRY_CRANE"] as ProductCategory[],
    status: "WON" as InquiryStatus,
    description: {
      en: "RMG automation retrofit for 4 cranes at container terminal — project signed, kickoff scheduled.",
      zh: "集装箱码头 4 台轨道吊自动化改造——项目已签约，启动会已排期。",
    },
  },
  {
    id: "INQ-20260508-04",
    date: "2026-05-08",
    categories: ["MANNED_FORKLIFT", "IWMS"] as ProductCategory[],
    status: "CLOSED" as InquiryStatus,
    description: {
      en: "Initial inquiry for manned forklifts with IWMS. Project postponed by client to next fiscal year.",
      zh: "有人叉车与 IWMS 的初步询盘。客户将项目推迟至下一财年。",
    },
  },
];
