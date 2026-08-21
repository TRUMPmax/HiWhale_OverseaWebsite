import type { InquiryStatus, LocalizedText, ProductCategory } from "@hiwhale/shared/constants";

/** 询盘跟进记录 */
export type MockInquiryFollowUp = {
  ts: string;
  author: LocalizedText;
  note: LocalizedText;
};

/** Dashboard 我的询盘 Mock 数据（后续接入真实询盘 API） */
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
    details: {
      en: "Full scope: 12,000 m² fulfillment center in Rotterdam, NL. 6 × counterbalanced AGV forklifts (1.5 t, 4.5 m rack height), WCS scheduling with OMS/ERP integration, 2 inbound docks + 3 outbound docks. Daily volume ~9,000 orders, peak 25,000. Budget approved, target go-live Q1 2027. Existing WMS is Manhattan — REST integration expected.",
      zh: "完整需求：荷兰鹿特丹 1.2 万平米履约中心。6 台平衡重式无人叉车（1.5 吨，货架 4.5 米），WCS 调度需对接 OMS/ERP，2 个入库月台 + 3 个出库月台。日均 9,000 单，峰值 25,000 单。预算已批，目标 2027 年一季度上线。现有 WMS 为 Manhattan，预期 REST 对接。",
    },
    followUps: [
      {
        ts: "2026-08-18T14:30:00+08:00",
        author: { en: "Kevin Chen (HiWhale Sales)", zh: "Kevin Chen（浩鲸销售）" },
        note: {
          en: "Shared rack layout drawings. Solution team is running the throughput simulation — results expected this week.",
          zh: "客户已提供货架布局图。方案团队正在做吞吐仿真，预计本周出结果。",
        },
      },
      {
        ts: "2026-08-14T10:05:00+08:00",
        author: { en: "Kevin Chen (HiWhale Sales)", zh: "Kevin Chen（浩鲸销售）" },
        note: {
          en: "Video call held. Client confirmed Manhattan WMS version and dock door dimensions. Preliminary quotation range accepted.",
          zh: "已视频会议。客户确认了 Manhattan WMS 版本与月台门尺寸，初步报价区间已获认可。",
        },
      },
      {
        ts: "2026-08-11T09:20:00+08:00",
        author: { en: "System", zh: "系统" },
        note: {
          en: "Inquiry assigned to sales engineer Kevin Chen. First response sent within 2 hours.",
          zh: "询盘已分配给销售工程师 Kevin Chen，2 小时内完成首次响应。",
        },
      },
    ],
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
    details: {
      en: "Pharma DC, ~8,000 m², ambient + 2-8°C cold room zones. Needs goods-to-person AMRs with batch traceability. Client asks for GMP validation package (IQ/OQ/PQ) references and EU GMP Annex 11 compliance statement before shortlisting vendors.",
      zh: "医药配送中心约 8,000 平米，含常温区与 2-8°C 冷库区。需要带批次追溯的货到人 AMR 系统。客户要求在供应商入围前提供 GMP 验证包（IQ/OQ/PQ）案例与欧盟 GMP 附录 11 合规声明。",
    },
    followUps: [
      {
        ts: "2026-07-23T11:00:00+08:00",
        author: { en: "System", zh: "系统" },
        note: {
          en: "Inquiry received and queued for assignment to a pharma-sector sales engineer.",
          zh: "询盘已接收，等待分配给医药行业销售工程师。",
        },
      },
    ],
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
    details: {
      en: "Retrofit 4 existing RMG cranes (32 m span, 40 t) with positioning, anti-sway and auto-stacking packages; remote operations room with 2 consoles. Terminal TOS integration via ECS adapter. Signed contract value covers hardware, software and commissioning.",
      zh: "改造 4 台现有轨道吊（跨距 32 米，40 吨），加装定位、防摇与自动堆垛套件；远程操控室配置 2 个操控台。通过 ECS 适配器对接码头 TOS。合同范围含硬件、软件与调试验收。",
    },
    followUps: [
      {
        ts: "2026-08-05T16:45:00+08:00",
        author: { en: "Kevin Chen (HiWhale Sales)", zh: "Kevin Chen（浩鲸销售）" },
        note: {
          en: "Contract signed. Kickoff meeting scheduled for Aug 24; site survey team arrives Aug 26.",
          zh: "合同已签署。启动会定于 8 月 24 日，现场勘测团队 8 月 26 日进场。",
        },
      },
      {
        ts: "2026-07-20T15:10:00+08:00",
        author: { en: "Kevin Chen (HiWhale Sales)", zh: "Kevin Chen（浩鲸销售）" },
        note: {
          en: "Commercial terms agreed. Legal review of the maintenance SLA clause in progress.",
          zh: "商务条款已达成一致，法务正在审核维保 SLA 条款。",
        },
      },
      {
        ts: "2026-07-02T10:30:00+08:00",
        author: { en: "Kevin Chen (HiWhale Sales)", zh: "Kevin Chen（浩鲸销售）" },
        note: {
          en: "On-site survey completed. Confirmed rail condition and power supply capacity for retrofit.",
          zh: "现场勘测完成，确认轨道状况与供电容量满足改造要求。",
        },
      },
      {
        ts: "2026-06-16T09:00:00+08:00",
        author: { en: "System", zh: "系统" },
        note: {
          en: "Inquiry assigned to sales engineer Kevin Chen.",
          zh: "询盘已分配给销售工程师 Kevin Chen。",
        },
      },
    ],
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
    details: {
      en: "3PL operator evaluating 10 × electric counterbalanced forklifts (3.5 t) plus IWMS for a shared-user warehouse. Proposal delivered; client postponed capex to next fiscal year due to budget freeze. Follow-up reminder set for January 2027.",
      zh: "第三方物流客户评估 10 台 3.5 吨电动平衡重叉车及 IWMS，用于共享仓。方案已提交；客户因预算冻结将资本开支推迟至下一财年。已设置 2027 年 1 月的跟进提醒。",
    },
    followUps: [
      {
        ts: "2026-06-01T17:20:00+08:00",
        author: { en: "Kevin Chen (HiWhale Sales)", zh: "Kevin Chen（浩鲸销售）" },
        note: {
          en: "Client informed us of the budget freeze. Agreed to reconnect in January 2027; inquiry closed as postponed.",
          zh: "客户告知预算冻结。双方约定 2027 年 1 月重启沟通，询盘按延期关闭。",
        },
      },
      {
        ts: "2026-05-15T14:00:00+08:00",
        author: { en: "Kevin Chen (HiWhale Sales)", zh: "Kevin Chen（浩鲸销售）" },
        note: {
          en: "Formal proposal and TCO analysis sent. Client procurement acknowledged receipt.",
          zh: "正式方案与 TCO 分析已发送，客户采购确认收到。",
        },
      },
    ],
  },
];
