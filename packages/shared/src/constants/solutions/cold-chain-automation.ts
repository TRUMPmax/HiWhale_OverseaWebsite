import { FOOD_COLD_CHAIN, L } from "../products/helpers";
import type { MockSolution } from "./types";

export const coldChainAutomation: MockSolution = {
  slug: "cold-chain-automation",
  industry: FOOD_COLD_CHAIN,
  title: L("Cold Chain Warehouse Automation", "冷链仓储自动化方案"),
  summary: L(
    "Cold-rated robots that keep working at -25°C so your people don't have to.",
    "耐低温机器人代替人工作业，在 -25°C 环境持续运转。",
  ),
  description: L(
    "Cold storage is where automation pays back fastest: harsh conditions, scarce labor and strict traceability. Our cold-rated AGV forklifts and RGV shuttles run continuously in -25°C freezers, while WCS orchestrates FEFO picking and full cold-chain traceability for food safety compliance.",
    "冷链是自动化回报最快的场景：环境恶劣、人力稀缺、追溯严格。我们的耐低温无人叉车与 RGV 穿梭车在 -25°C 冷库中持续作业，WCS 调度 FEFO 先到期先出拣选，提供满足食品安全合规的全链路冷链追溯。",
  ),
  painPoints: [
    L(
      "Workers can only sustain short shifts in -25°C freezers",
      "-25°C 冷库中工人只能短时轮班作业",
    ),
    L("Cold-chain labor is scarce, expensive and high-turnover", "冷链用工稀缺、昂贵且流动率高"),
    L("FEFO compliance failures cause write-offs and recalls", "FEFO 执行不到位导致报损与召回"),
    L(
      "Door-open time wastes energy and risks product quality",
      "库门开启时间过长，浪费能耗且危及货品",
    ),
  ],
  productSlugs: ["mbv20p-stacker-agv-forklift", "mbv15r-counterbalanced-agv-forklift", "mbr04g-rail-guided-shuttle-rgv", "hiwhale-wcs-fleet-scheduling-system", "hiwhale-iwms"],
  process: [
    {
      title: L("Thermal & Flow Assessment", "热工与物流评估"),
      description: L(
        "We model temperature zones, door cycles and product flows to minimize cold loss.",
        "建模温区、库门开闭频次与货物流向，最大限度减少冷量损失。",
      ),
    },
    {
      title: L("Cold-rated Equipment Design", "耐低温设备选型"),
      description: L(
        "Robots are specified with heated components, cold-proof batteries and frost-tolerant sensors.",
        "设备选型包含加热部件、耐低温电池与抗凝露传感器。",
      ),
    },
    {
      title: L("Buffer Zone Automation", "缓冲区自动化"),
      description: L(
        "Automated high-speed doors and buffer conveyors separate temperature zones.",
        "自动高速门与缓冲输送线隔离不同温区。",
      ),
    },
    {
      title: L("Traceability Integration", "追溯体系集成"),
      description: L(
        "Batch and temperature records are bound to every pallet movement for full traceability.",
        "批次与温度记录绑定每一次托盘移动，实现全程追溯。",
      ),
    },
    {
      title: L("Cold commissioning & Handover", "低温联调与交付"),
      description: L(
        "Full-load testing is performed at operating temperature before handover.",
        "交付前在作业温度下完成满载测试。",
      ),
    },
  ],
  results: [
    { value: "-25°C", label: L("Continuous Operation", "连续作业温度") },
    { value: "100%", label: L("FEFO Compliance", "FEFO 合规率") },
    { value: "-30%", label: L("Energy Consumption", "能耗下降") },
    { value: "24/7", label: L("Unmanned Operation", "无人化连续作业") },
  ],
  imageName: "solution-cold-chain.png",
};
