import { AGV_FORKLIFT, AMR, E_COMMERCE, IWMS, L, WCS } from "../products/helpers";
import type { MockSolution } from "./types";

export const ecommerceFulfillment: MockSolution = {
  slug: "e-commerce-fulfillment",
  industry: E_COMMERCE,
  title: L("E-commerce Fulfillment Automation", "电商履约自动化方案"),
  summary: L(
    "Goods-to-person picking and automated sortation that scales with your order peaks.",
    "“货到人”拣选 + 自动化分拣，随订单峰值弹性扩容。",
  ),
  description: L(
    "Built for high-SKU, high-velocity e-commerce warehouses, this solution combines latent AMRs for goods-to-person picking, AGV forklifts for pallet movement, and the HiWhale IWMS + WCS software stack. The system absorbs promotional order surges without adding headcount, while keeping order accuracy near perfect.",
    "面向多 SKU、高周转的电商仓库，本方案以潜伏式 AMR 实现“货到人”拣选，无人叉车负责托盘搬运，并由浩鲸 IWMS + WCS 软件栈统一调度。大促订单洪峰无需临时加人即可消化，订单准确率接近满分。",
  ),
  painPoints: [
    L(
      "Promotional order surges overwhelm manual picking capacity",
      "大促订单洪峰，人工拣选产能不足",
    ),
    L(
      "SKU explosion makes manual finding slow and error-prone",
      "SKU 爆炸式增长，人工找货慢、差错高",
    ),
    L("Rising labor cost and high turnover in peak seasons", "用工成本上升，旺季人员流动大"),
    L("Order accuracy directly drives return rates and CSAT", "订单准确率直接影响退货率与满意度"),
  ],
  equipment: [AMR, AGV_FORKLIFT, WCS, IWMS],
  process: [
    {
      title: L("Site Survey & Data Analysis", "现场勘测与数据分析"),
      description: L(
        "We analyze 12 months of order data, SKU profiles and warehouse layout to model throughput requirements.",
        "分析 12 个月订单数据、SKU 特征与仓库布局，建立吞吐量需求模型。",
      ),
    },
    {
      title: L("Solution Design & Simulation", "方案设计与仿真"),
      description: L(
        "Digital twin simulation validates robot fleet size, workstation count and peak-hour performance.",
        "数字孪生仿真验证机器人车队规模、工作站数量与峰值时段表现。",
      ),
    },
    {
      title: L("Phased Deployment", "分阶段部署"),
      description: L(
        "Robots and workstations go live zone by zone, keeping your daily fulfillment running throughout.",
        "机器人与工作站分区上线，部署期间日常履约不中断。",
      ),
    },
    {
      title: L("System Integration & Testing", "系统集成与测试"),
      description: L(
        "IWMS/WCS connects to your OMS and ERP; end-to-end order flow is tested under simulated peak load.",
        "IWMS/WCS 对接 OMS 与 ERP，在模拟峰值压力下完成端到端订单流测试。",
      ),
    },
    {
      title: L("Ramp-up & Continuous Optimization", "爬坡与持续优化"),
      description: L(
        "AI-driven slotting and wave strategies keep improving throughput after go-live.",
        "上线后，AI 货位优化与波次策略持续提升吞吐。",
      ),
    },
  ],
  results: [
    { value: "+180%", label: L("Peak Throughput", "峰值吞吐提升") },
    { value: "99.99%", label: L("Order Accuracy", "订单准确率") },
    { value: "-35%", label: L("Labor Cost", "人力成本下降") },
    { value: "2.5 yrs", label: L("Typical ROI", "平均投资回收期") },
  ],
  imageName: "solution-ecommerce.png",
};
