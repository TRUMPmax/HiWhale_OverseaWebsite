import { AUTOMOTIVE, L } from "../products/helpers";
import type { MockSolution } from "./types";

export const automotiveLineSide: MockSolution = {
  slug: "automotive-line-side",
  industry: AUTOMOTIVE,
  title: L("Automotive Line-Side Logistics", "汽车产线边物流方案"),
  summary: L(
    "Just-in-sequence delivery that keeps your production line never waiting for parts.",
    "准时制排序配送，让产线永远不等料。",
  ),
  description: L(
    "Designed for automotive OEMs and Tier-1 suppliers, this solution uses QR-guided AGVs and AGV forklifts orchestrated by WCS to deliver parts to the line just in sequence. Takt-synchronized dispatching eliminates line stoppages caused by material shortages, even in mixed-model production.",
    "面向汽车主机厂与一级供应商，本方案以二维码 AGV 与无人叉车为运力，由 WCS 统一调度，实现零部件准时制排序上线。与节拍同步的配送调度，即使在混线生产下也杜绝缺料停线。",
  ),
  painPoints: [
    L("Strict takt times leave zero tolerance for material delays", "严格生产节拍，物料延迟零容忍"),
    L("Line stoppages cost tens of thousands per minute", "停线一分钟损失数以万计"),
    L(
      "Mixed-model production demands just-in-sequence delivery",
      "混线生产要求严格的 JIS 排序配送",
    ),
    L(
      "Line-side space is scarce and forklift traffic is risky",
      "线边空间紧张，叉车穿梭安全隐患大",
    ),
  ],
  productSlugs: ["mbt10r-roller-top-amr", "mba12t-latent-jacking-agv", "t300-industrial-delivery-robot", "mbv15r-counterbalanced-agv-forklift", "hiwhale-wcs-fleet-scheduling-system"],
  process: [
    {
      title: L("Takt & Flow Analysis", "节拍与物流分析"),
      description: L(
        "We map every material flow against your production takt and line-side buffer constraints.",
        "对照生产节拍与线边缓存约束，梳理每一条物料流。",
      ),
    },
    {
      title: L("Route & Fleet Design", "路径与车队设计"),
      description: L(
        "QR routes, pulling loops and fleet size are designed to match takt with 20% headroom.",
        "设计二维码路径、循环拉动机制与车队规模，预留 20% 节拍余量。",
      ),
    },
    {
      title: L("MES/ERP Integration", "MES/ERP 集成"),
      description: L(
        "WCS receives production plans and andon calls directly from your MES for automatic dispatching.",
        "WCS 直接接收 MES 的生产计划与安灯呼叫，自动触发配送任务。",
      ),
    },
    {
      title: L("Pilot Line Rollout", "示范线导入"),
      description: L(
        "One production line goes live first to validate sequencing accuracy under real takt.",
        "先导入一条产线，在真实节拍下验证排序准确率。",
      ),
    },
    {
      title: L("Plant-wide Scale-up", "全厂推广"),
      description: L(
        "Proven routes and playbooks are replicated across all lines with unified WCS scheduling.",
        "验证成熟的路径与作业规范复制到全部产线，统一 WCS 调度。",
      ),
    },
  ],
  results: [
    { value: "99.9%", label: L("On-time Delivery to Line", "上线准时率") },
    { value: "-60%", label: L("Line-side Inventory", "线边库存下降") },
    { value: "0", label: L("Mis-sequence Incidents", "错序事故") },
    { value: "-45%", label: L("Forklift Traffic", "厂内叉车流量下降") },
  ],
  imageName: "solution-automotive.png",
};
