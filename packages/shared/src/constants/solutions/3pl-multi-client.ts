import { AMR, IWMS, L, MANNED_FORKLIFT, THIRD_PARTY_LOGISTICS, WCS } from "../products/helpers";
import type { MockSolution } from "./types";

export const threePlMultiClient: MockSolution = {
  slug: "3pl-multi-client",
  industry: THIRD_PARTY_LOGISTICS,
  title: L("3PL Multi-Client Warehouse Automation", "第三方物流多客户仓自动化方案"),
  summary: L(
    "Flexible automation that serves dozens of clients and thousands of SKUs in one building.",
    "柔性自动化，一个仓库服务数十个客户、数千种 SKU。",
  ),
  description: L(
    "3PL operators win contracts with flexibility. This solution pairs latent AMRs and manned forklifts with an IWMS that isolates inventory, billing and SLAs per client. Capacity shifts between clients in minutes — not days — so you can say yes to any contract profile.",
    "第三方物流靠柔性赢得合同。本方案以潜伏式 AMR 加有人叉车为执行层，IWMS 按客户隔离库存、计费与 SLA。产能在客户之间分钟级切换，从容应对任何合同形态。",
  ),
  painPoints: [
    L(
      "Multi-client, multi-SKU operations defy rigid automation",
      "多客户多 SKU，刚性自动化难以适配",
    ),
    L("Client volumes fluctuate unpredictably by season", "客户业务量随季节不可预测地波动"),
    L(
      "Every client brings different SLAs and system interfaces",
      "每个客户的 SLA 与系统接口都不同",
    ),
    L("New client onboarding takes weeks of re-layout", "新客户入驻需要数周的库区调整"),
  ],
  equipment: [AMR, MANNED_FORKLIFT, IWMS, WCS],
  process: [
    {
      title: L("Client Portfolio Analysis", "客户组合分析"),
      description: L(
        "We profile each client's SKU velocity and order patterns to design shared vs. dedicated zones.",
        "分析各客户的 SKU 动销与订单形态，规划共享区与专属区。",
      ),
    },
    {
      title: L("Flexible Zone Design", "柔性分区设计"),
      description: L(
        "Modular AMR zones scale independently; manned areas handle oversized and exception flows.",
        "模块化 AMR 分区独立扩容，有人区处理大件与异常流程。",
      ),
    },
    {
      title: L("Multi-tenant IWMS Setup", "多租户 IWMS 配置"),
      description: L(
        "Client-level inventory isolation, billing rules and SLA dashboards are configured per contract.",
        "按合同配置客户级库存隔离、计费规则与 SLA 看板。",
      ),
    },
    {
      title: L("Interface Integration", "接口集成"),
      description: L(
        "Standard API adapters connect each client's ERP/OMS in days, not months.",
        "标准 API 适配器在数天内完成各客户 ERP/OMS 对接。",
      ),
    },
    {
      title: L("Go-live & Elastic Operation", "上线与弹性运营"),
      description: L(
        "Robot capacity is reallocated between clients with one click as volumes shift.",
        "业务量变化时，机器人产能在客户间一键再分配。",
      ),
    },
  ],
  results: [
    { value: "3×", label: L("Storage Density", "存储密度提升") },
    { value: "-50%", label: L("Order Cycle Time", "订单履约时长缩短") },
    { value: "7 days", label: L("New Client Onboarding", "新客户入驻周期") },
    { value: "+40%", label: L("Contract Win Rate", "中标率提升") },
  ],
  imageName: "solution-3pl.png",
};
