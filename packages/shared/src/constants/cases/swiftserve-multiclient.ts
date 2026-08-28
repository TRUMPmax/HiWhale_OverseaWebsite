import { L, THIRD_PARTY_LOGISTICS } from "../products/helpers";
import type { MockCase } from "./types";

export const caseSwiftServe: MockCase = {
  slug: "case-swiftserve-multiclient",
  clientName: L("SwiftServe 3PL", "迅达第三方物流"),
  industry: THIRD_PARTY_LOGISTICS,
  project: L("Multi-Client Fulfillment Hub for 35 Brands", "服务 35 个品牌的多客户履约枢纽"),
  background: L(
    "SwiftServe 3PL operates shared-user warehouses for consumer brands in Rotterdam. Its legacy facility ran paper-based picking with client-specific zones that could never be rebalanced.",
    "迅达第三方物流在鹿特丹运营消费品品牌的共享仓。原有仓库采用纸质拣选，客户专属库区一旦划定便无法调剂。",
  ),
  challenge: L(
    "Client churn and seasonal swings left zones alternately overflowing or idle. SwiftServe needed one flexible automation platform that could onboard a new client in days and shift capacity overnight.",
    "客户进退与季节波动让库区时而爆仓时而闲置。迅达需要一个柔性自动化平台：新客户数天入驻，产能隔夜可调。",
  ),
  solution: L(
    "HiWhale delivered a modular AMR goods-to-person system with multi-tenant IWMS. Inventory, billing and SLA dashboards are isolated per client; robot capacity is reallocated between clients with one click as volumes shift.",
    "浩鲸交付了模块化 AMR“货到人”系统与多租户 IWMS：库存、计费与 SLA 看板按客户隔离，机器人产能随业务量一键再分配。",
  ),
  equipment: [
    L("96 × MBH08L Latent Lifting AMR", "96 台 MBH08L 潜伏顶升式 AMR"),
    L("12 × MBF35E Manned Forklift for oversized goods", "12 台 MBF35E 有人叉车（大件作业）"),
    L("HiWhale IWMS multi-tenant platform", "浩鲸 IWMS 多租户平台"),
    L("Standard ERP/OMS API adapters ×35", "35 套标准 ERP/OMS 接口适配器"),
  ],
  productSlugs: ["mba12t-latent-jacking-agv", "mbt10r-roller-top-amr", "mbr160-palletizing-robotic-arm"],
  duration: L("12 weeks", "12 周"),
  results: [
    { value: "2.8×", label: L("Storage Density", "存储密度提升") },
    { value: "5 days", label: L("New Client Onboarding", "新客户入驻周期") },
    { value: "-47%", label: L("Order Cycle Time", "订单履约时长缩短") },
    { value: "+41%", label: L("Contract Win Rate", "中标率提升") },
  ],
  testimonial: {
    quote: L(
      "We now quote automation-grade SLAs in every tender — and we win. Flexibility became our sales pitch.",
      "现在每次投标我们都能报出自动化级别的 SLA——而且真能赢单。柔性成了我们的卖点。",
    ),
    author: L("Daan van der Berg", "Daan van der Berg"),
    role: L("Commercial Director, SwiftServe 3PL", "迅达第三方物流 商务总监"),
  },
  logoName: "case-logo-swiftserve.png",
  imageName: "case-swiftserve.png",
};
