type ReplyLocale = "en" | "zh";

type ReplyRule = {
  keywords: string[];
  en: string;
  zh: string;
};

/** 关键词匹配的 Mock 回复库（后续接入真实 AI 服务） */
const RULES: ReplyRule[] = [
  {
    keywords: ["load", "capacity", "payload", "lift", "载重", "负载", "承载", "吨位"],
    en: "Our AGV forklifts cover 1.5–2 t rated loads with lift heights up to 4,500 mm; AMRs handle 800–1,200 kg payloads; and our RMG cranes lift 40.5 t. Tell me your load and rack height and I can point you to the right model.",
    zh: "我们的无人叉车额定载重覆盖 1.5–2 吨、起升高度最高 4,500 mm；AMR 负载 800–1,200 kg；轨道吊可吊 40.5 吨。告诉我您的货物重量与货架高度，我可以帮您推荐型号。",
  },
  {
    keywords: ["certification", "certificate", "certified", "ce", "iso", "ul", "认证", "证书"],
    en: "All HiWhale equipment is CE certified; unmanned forklifts comply with ISO 3691-4, safety functions with ISO 13849, and quality management is ISO 9001 certified. UL certification is available for North American projects.",
    zh: "浩鲸全系列设备均通过 CE 认证；无人叉车符合 ISO 3691-4，安全功能符合 ISO 13849，质量管理通过 ISO 9001 认证；北美项目可提供 UL 认证。",
  },
  {
    keywords: ["price", "quote", "cost", "quotation", "报价", "价格", "多少钱", "费用"],
    en: "Pricing depends on your warehouse layout, fleet size and software scope. Leave your project details via the inquiry form and our sales engineer will send a tailored quotation within 24 hours.",
    zh: "价格取决于您的仓库布局、车队规模与软件范围。请通过询盘表单留下项目信息，销售工程师将在 24 小时内为您出具定制报价。",
  },
  {
    keywords: ["recommend", "solution", "suggest", "which", "推荐", "方案", "怎么选", "选型"],
    en: "Happy to help! Which industry are you in — e-commerce, automotive, 3PL, cold chain, pharmaceutical or port? And roughly how many orders or pallets do you handle per day? With that I can recommend a matching solution.",
    zh: "很乐意帮您选型！请问您所在行业是电商、汽车、第三方物流、冷链、医药还是港口？每天大约处理多少订单或托盘？有了这些信息我就能推荐匹配的方案。",
  },
  {
    keywords: ["deliver", "shipping", "lead time", "warranty", "交付", "货期", "保修", "售后"],
    en: "Standard equipment ships in 4–8 weeks; turnkey projects typically take 12–24 weeks from design to acceptance. All equipment includes a 12-month warranty and 24/7 global support.",
    zh: "标准设备 4–8 周发货；交钥匙项目从设计到验收通常 12–24 周。所有设备含 12 个月质保与 24/7 全球支持。",
  },
];

const DEFAULT_REPLY: Record<ReplyLocale, string> = {
  en: "Thanks for your question! I can help with product specs, certifications, solution selection and delivery timelines. For anything more specific, our solution engineers are one inquiry away — or try one of the quick questions above.",
  zh: "感谢您的提问！我可以解答产品参数、认证、方案选型与交付周期等问题。更具体的需求，欢迎提交询盘联系方案工程师，或试试上方的快捷问题。",
};

/** 按关键词匹配返回 Mock 回复 */
export function getMockReply(input: string, locale: ReplyLocale): string {
  const lower = input.toLowerCase();
  const hit = RULES.find((rule) => rule.keywords.some((k) => lower.includes(k.toLowerCase())));
  return hit ? hit[locale] : DEFAULT_REPLY[locale];
}
