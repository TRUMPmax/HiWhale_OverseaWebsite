import type { InquiryStatus, ProductCategory } from "@hiwhale/shared/constants";

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

/** 可分配的销售负责人（Mock 员工列表） */
export const STAFF_OPTIONS = ["张三", "李四", "王五", "Mia"];

/** 询盘管理 Mock 数据 */
export const MOCK_ADMIN_INQUIRIES: MockAdminInquiry[] = [
  {
    id: "INQ-0820-01",
    customer: "Thomas Müller",
    company: "Bavaria Logistics GmbH",
    country: "德国",
    email: "t.mueller@bavaria-logistics.de",
    phone: "+49 89 1234567",
    categories: ["AGV_FORKLIFT", "WCS"] as ProductCategory[],
    message:
      "我们在慕尼黑附近有一座 15,000 平米的电商仓，计划引入 8 台无人叉车与调度系统，货架高度 5 米，请提供方案与报价。",
    status: "NEW" as InquiryStatus,
    assignee: null,
    createdAt: "2026-08-20 09:42",
    followUps: [],
  },
  {
    id: "INQ-0820-02",
    customer: "Sarah Johnson",
    company: "Midwest Fulfillment Inc.",
    country: "美国",
    email: "sarah.j@midwestfulfill.com",
    categories: ["AMR"] as ProductCategory[],
    message: "评估货到人 AMR 系统，现有 WMS 为 Blue Yonder，需要确认接口对接能力与 UL 认证。",
    status: "FOLLOWING" as InquiryStatus,
    assignee: "陈凯文",
    createdAt: "2026-08-20 08:15",
    followUps: [
      {
        ts: "2026-08-20 10:30",
        author: "陈凯文",
        note: "已电话沟通，确认客户仓库面积 2 万平米，日均 1.2 万单。已发送 AMR 产品资料与 UL 认证清单。",
      },
    ],
  },
  {
    id: "INQ-0819-01",
    customer: "Kenji Tanaka",
    company: "Tanaka Seiki Co., Ltd.",
    country: "日本",
    email: "tanaka@tanakaseiki.jp",
    phone: "+81 3 4567 8901",
    categories: ["ROBOTIC_ARM"] as ProductCategory[],
    message: "汽车零部件码垛工位自动化，节拍要求每小时 900 箱，请评估机械臂方案。",
    status: "FOLLOWING" as InquiryStatus,
    assignee: "李晓梅",
    createdAt: "2026-08-19 17:33",
    followUps: [
      {
        ts: "2026-08-20 09:00",
        author: "李晓梅",
        note: "发送了 MBR160 节拍测算表，客户要求补充夹具快换演示视频。",
      },
      {
        ts: "2026-08-19 18:20",
        author: "李晓梅",
        note: "首次响应，确认工件尺寸与托盘规格。",
      },
    ],
  },
  {
    id: "INQ-0819-02",
    customer: "Ahmad Rahman",
    company: "HarborLink Terminal",
    country: "新加坡",
    email: "a.rahman@harborlink.sg",
    categories: ["GANTRY_CRANE"] as ProductCategory[],
    message: "集装箱堆场 4 台轨道吊无人化改造，已完成签约，项目启动会排期中。",
    status: "WON" as InquiryStatus,
    assignee: "陈凯文",
    createdAt: "2026-08-19 14:08",
    followUps: [
      {
        ts: "2026-08-19 16:00",
        author: "陈凯文",
        note: "合同已签署，项目启动会定于 8 月 24 日。",
      },
    ],
  },
  {
    id: "INQ-0818-01",
    customer: "Emma Dubois",
    company: "FraisChaîne SAS",
    country: "法国",
    email: "emma.dubois@fraischaine.fr",
    categories: ["WCS"] as ProductCategory[],
    message: "冷链仓咨询调度系统，预算冻结，下一财年再议。",
    status: "CLOSED" as InquiryStatus,
    assignee: "张伟",
    createdAt: "2026-08-18 11:26",
    followUps: [
      {
        ts: "2026-08-18 15:40",
        author: "张伟",
        note: "客户预算冻结，约定 2027 年 1 月重启沟通，询盘关闭。",
      },
    ],
  },
  {
    id: "INQ-0818-02",
    customer: "Carlos Mendes",
    company: "Mercado Sul Logística",
    country: "巴西",
    email: "carlos@mercadosul.com.br",
    categories: ["AMR", "IWMS"] as ProductCategory[],
    message: "圣保罗 3PL 仓，多客户多 SKU 场景，咨询 AMR + IWMS 组合方案与葡萄牙语界面支持。",
    status: "NEW" as InquiryStatus,
    assignee: null,
    createdAt: "2026-08-18 09:12",
    followUps: [],
  },
  {
    id: "INQ-0817-01",
    customer: "Anna Kowalska",
    company: "PolPharma Distribution",
    country: "波兰",
    email: "a.kowalska@polpharma.pl",
    categories: ["RGV", "WCS"] as ProductCategory[],
    message: "医药仓穿梭车密集库咨询，需要 GMP 验证文档与批次追溯演示。",
    status: "FOLLOWING" as InquiryStatus,
    assignee: "李晓梅",
    createdAt: "2026-08-17 16:45",
    followUps: [
      {
        ts: "2026-08-18 10:20",
        author: "李晓梅",
        note: "已发送 GMP 验证包目录，预约下周视频演示批次追溯流程。",
      },
    ],
  },
  {
    id: "INQ-0817-02",
    customer: "James Wilson",
    company: "Outback Parts Pty Ltd",
    country: "澳大利亚",
    email: "jwilson@outbackparts.com.au",
    categories: ["MANNED_FORKLIFT"] as ProductCategory[],
    message: "询价 5 台 3.5 吨电动叉车，悉尼奥配件仓，需要了解海运周期与本地售后。",
    status: "FOLLOWING" as InquiryStatus,
    assignee: "王五",
    createdAt: "2026-08-17 11:08",
    followUps: [
      {
        ts: "2026-08-17 14:30",
        author: "王五",
        note: "已回复报价与 6 周海运周期，介绍悉尼服务伙伴。",
      },
    ],
  },
  {
    id: "INQ-0816-01",
    customer: "Fatima Al-Sayed",
    company: "Gulf Cold Chain LLC",
    country: "阿联酋",
    email: "fatima@gulfcoldchain.ae",
    phone: "+971 4 555 0123",
    categories: ["AGV_FORKLIFT", "RGV"] as ProductCategory[],
    message: "迪拜 -25°C 冷库全自动化项目，咨询耐低温无人叉车与穿梭车组合，规模约 2 万托位。",
    status: "NEW" as InquiryStatus,
    assignee: null,
    createdAt: "2026-08-16 13:55",
    followUps: [],
  },
  {
    id: "INQ-0815-01",
    customer: "Luca Rossi",
    company: "Rossi Automotive SpA",
    country: "意大利",
    email: "l.rossi@rossiauto.it",
    categories: ["AGV"] as ProductCategory[],
    message: "汽车总装车间线边配送，咨询二维码 AGV 与 MES（SAP ME）对接能力。",
    status: "WON" as InquiryStatus,
    assignee: "Mia",
    createdAt: "2026-08-15 15:20",
    followUps: [
      {
        ts: "2026-08-18 09:15",
        author: "Mia",
        note: "客户确认 PO，首期 12 台 MBA12T，交期待排产确认。",
      },
      {
        ts: "2026-08-16 11:00",
        author: "Mia",
        note: "完成 SAP ME 接口方案评审，客户认可。",
      },
    ],
  },
  {
    id: "INQ-0814-01",
    customer: "Nguyen Van An",
    company: "Saigon E-Commerce Hub",
    country: "越南",
    email: "an.nguyen@sgnehub.vn",
    categories: ["AMR", "WCS"] as ProductCategory[],
    message: "胡志明市电商履约中心，日均 3 万单，希望了解货到人方案的投资回报测算。",
    status: "FOLLOWING" as InquiryStatus,
    assignee: "陈凯文",
    createdAt: "2026-08-14 10:32",
    followUps: [
      {
        ts: "2026-08-15 16:40",
        author: "陈凯文",
        note: "已发送 ROI 测算模型（基于 3PL 同业案例），等待客户补充租金与人力成本数据。",
      },
    ],
  },
  {
    id: "INQ-0813-01",
    customer: "Olivia Brown",
    company: "Thames Distribution Ltd",
    country: "英国",
    email: "olivia.b@thamesdist.co.uk",
    categories: ["IWMS"] as ProductCategory[],
    message: "现有仓库软件老旧，咨询 IWMS 替换方案与数据迁移服务。",
    status: "CLOSED" as InquiryStatus,
    assignee: "张伟",
    createdAt: "2026-08-13 14:18",
    followUps: [
      {
        ts: "2026-08-14 09:30",
        author: "张伟",
        note: "客户决定先续约现有供应商一年，关闭询盘，保持季度回访。",
      },
    ],
  },
];
