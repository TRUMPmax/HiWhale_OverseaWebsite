/** AI 对话记录 Mock 数据 */
export type MockChatMessage = {
  role: "user" | "assistant";
  content: string;
  ts: string;
};

export type MockChatConversation = {
  id: string;
  user: string;
  messageCount: number;
  lastActive: string;
  status: "normal" | "flagged" | "review";
  messages: MockChatMessage[];
};

export const MOCK_CHAT_LOGS: MockChatConversation[] = [
  {
    id: "chat-01",
    user: "Thomas Müller",
    messageCount: 12,
    lastActive: "2026-08-20 09:58",
    status: "normal",
    messages: [
      { role: "user", content: "你们的无人叉车最大载重是多少？", ts: "09:41" },
      {
        role: "assistant",
        content:
          "我们的无人叉车额定载重覆盖 1.5–2 吨，起升高度最高 4,500 mm；如需更大载重，堆垛式 MBV20P 可达 2,000 kg。",
        ts: "09:41",
      },
      { role: "user", content: "5 米货架可以用吗？", ts: "09:43" },
      {
        role: "assistant",
        content:
          "MBV20P 最大起升 4,500 mm。5 米货架属于高位场景，建议采用定制门架方案，我可以为您转接方案工程师。",
        ts: "09:43",
      },
    ],
  },
  {
    id: "chat-02",
    user: "Sarah Johnson",
    messageCount: 8,
    lastActive: "2026-08-20 08:44",
    status: "flagged",
    messages: [
      { role: "user", content: "AMR 支持 UL 认证吗？", ts: "08:36" },
      {
        role: "assistant",
        content: "支持。浩鲸全系列设备均通过 CE 认证，北美项目可提供 UL 认证选项。",
        ts: "08:36",
      },
      { role: "user", content: "报价大概多少？", ts: "08:38" },
      {
        role: "assistant",
        content:
          "价格取决于仓库布局、车队规模与软件范围。请提交询盘，销售工程师将在 24 小时内出具定制报价。",
        ts: "08:38",
      },
    ],
  },
  {
    id: "chat-03",
    user: "Ahmad Rahman",
    messageCount: 21,
    lastActive: "2026-08-19 22:10",
    status: "normal",
    messages: [
      { role: "user", content: "轨道吊改造的交付周期？", ts: "22:01" },
      {
        role: "assistant",
        content:
          "轨道吊自动化改造项目从设计到验收通常 12–24 周，含定位、防摇与自动堆垛套件安装调试。",
        ts: "22:01",
      },
    ],
  },
  {
    id: "chat-04",
    user: "Anna Kowalska",
    messageCount: 15,
    lastActive: "2026-08-19 17:26",
    status: "review",
    messages: [
      { role: "user", content: "GMP 验证文档能提供吗？", ts: "17:20" },
      {
        role: "assistant",
        content: "可以。我们提供 IQ/OQ/PQ 验证包模板与过往医药项目案例，请联系方案工程师获取。",
        ts: "17:20",
      },
    ],
  },
  {
    id: "chat-05",
    user: "Carlos Mendes",
    messageCount: 6,
    lastActive: "2026-08-19 11:02",
    status: "normal",
    messages: [
      { role: "user", content: "IWMS 支持葡萄牙语吗？", ts: "10:55" },
      {
        role: "assistant",
        content: "IWMS 目前支持中文与英文界面，多语言可扩展，葡萄牙语可作为定制项评估。",
        ts: "10:55",
      },
    ],
  },
  {
    id: "chat-06",
    user: "James Wilson",
    messageCount: 4,
    lastActive: "2026-08-18 16:37",
    status: "flagged",
    messages: [
      { role: "user", content: "电动叉车海运到悉尼要多久？", ts: "16:30" },
      {
        role: "assistant",
        content: "标准设备 4–8 周发货，海运至悉尼约 3–4 周，具体以物流方案为准。",
        ts: "16:30",
      },
    ],
  },
  {
    id: "chat-07",
    user: "Fatima Al-Sayed",
    messageCount: 18,
    lastActive: "2026-08-18 09:15",
    status: "normal",
    messages: [
      { role: "user", content: "冷库 -25°C 环境下电池续航如何？", ts: "09:02" },
      {
        role: "assistant",
        content: "耐低温机型采用加热电池仓设计，-25°C 下可连续作业 6–8 小时，支持机会充电。",
        ts: "09:02",
      },
    ],
  },
  {
    id: "chat-08",
    user: "Luca Rossi",
    messageCount: 9,
    lastActive: "2026-08-17 20:48",
    status: "normal",
    messages: [
      { role: "user", content: "AGV 能对接 SAP ME 吗？", ts: "20:40" },
      {
        role: "assistant",
        content: "可以。WCS 提供开放 REST API 与标准适配器，已有多例 SAP ME 集成案例。",
        ts: "20:40",
      },
    ],
  },
  {
    id: "chat-09",
    user: "Nguyen Van An",
    messageCount: 14,
    lastActive: "2026-08-17 14:29",
    status: "review",
    messages: [
      { role: "user", content: "日均 3 万单需要多少台 AMR？", ts: "14:20" },
      {
        role: "assistant",
        content:
          "按 3 万单/日与典型拣选效率估算，约需 120–150 台 AMR。准确数量需通过数字孪生仿真验证。",
        ts: "14:20",
      },
    ],
  },
  {
    id: "chat-10",
    user: "Olivia Brown",
    messageCount: 5,
    lastActive: "2026-08-16 10:51",
    status: "normal",
    messages: [
      { role: "user", content: "IWMS 能从旧系统迁移数据吗？", ts: "10:45" },
      {
        role: "assistant",
        content: "支持。我们提供库存、货主、批次等主数据迁移工具与实施服务。",
        ts: "10:45",
      },
    ],
  },
];
