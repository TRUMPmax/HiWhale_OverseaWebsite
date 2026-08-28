import { E_COMMERCE, L } from "../products/helpers";
import type { MockCase } from "./types";

export const caseGlobalEcom: MockCase = {
  slug: "case-globalecom-fulfillment",
  clientName: L("GlobalEcom Logistics", "环球电商物流"),
  industry: E_COMMERCE,
  project: L("45,000 m² Goods-to-Person Fulfillment Center", "4.5 万平方米“货到人”履约中心"),
  background: L(
    "GlobalEcom Logistics runs cross-border fulfillment for 200+ brands across Southeast Asia. Its Manila hub processed 80,000 orders daily with 400 pickers, and every promotion season meant emergency hiring and missed SLAs.",
    "环球电商物流为 200 多个品牌提供东南亚跨境履约服务。其马尼拉枢纽仓日处理 8 万单、依赖 400 名拣选工，每逢大促就要紧急招工，SLA 频频失守。",
  ),
  challenge: L(
    "Order volume doubled year over year while the labor market tightened. The client needed to triple peak capacity within the same building — without interrupting daily operations during deployment.",
    "订单量逐年翻番，用工市场却持续收紧。客户需要在同一仓库内将峰值产能提升至三倍，且部署期间不能中断日常作业。",
  ),
  solution: L(
    "HiWhale deployed 180 latent AMRs with 24 goods-to-person workstations, orchestrated by IWMS + WCS. Rollout was phased by zone over 14 weeks, keeping live operations running throughout. AI slotting cut average travel distance per order by 40%.",
    "浩鲸部署 180 台潜伏式 AMR 与 24 个“货到人”工作站，由 IWMS + WCS 统一调度。按分区在 14 周内滚动上线，全程不影响日常作业。AI 货位优化将单均行走距离缩短 40%。",
  ),
  equipment: [
    L("180 × MBH08L Latent Lifting AMR", "180 台 MBH08L 潜伏顶升式 AMR"),
    L("24 × Goods-to-person workstations", "24 个货到人工作站"),
    L("HiWhale IWMS + WCS software stack", "浩鲸 IWMS + WCS 软件栈"),
    L("Automated packing line integration", "自动包装线对接"),
  ],
  productSlugs: ["mba12t-latent-jacking-agv", "mbt10r-roller-top-amr", "hiwhale-wcs-fleet-scheduling-system"],
  duration: L("14 weeks", "14 周"),
  results: [
    { value: "80K→240K", label: L("Daily Order Capacity", "日订单处理能力") },
    { value: "99.99%", label: L("Order Accuracy", "订单准确率") },
    { value: "-52%", label: L("Labor per Order", "单均人力下降") },
    { value: "2.1 yrs", label: L("Payback Period", "投资回收期") },
  ],
  testimonial: {
    quote: L(
      "We survived our biggest 11.11 ever without hiring a single temp worker. The robots simply absorbed the surge.",
      "史上最猛的双十一，我们一名临时工都没招。机器人硬生生吃下了订单洪峰。",
    ),
    author: L("Maria Santos", "Maria Santos"),
    role: L("VP of Operations, GlobalEcom Logistics", "环球电商物流 运营副总裁"),
  },
  logoName: "case-logo-globalecom.png",
  imageName: "case-globalecom.png",
};
