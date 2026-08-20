import { FOOD_COLD_CHAIN, L } from "../products/helpers";
import type { MockCase } from "./types";

export const caseFreshChain: MockCase = {
  slug: "case-freshchain-cold",
  clientName: L("FreshChain Cold Storage", "鲜链冷链仓储"),
  industry: FOOD_COLD_CHAIN,
  project: L("-25°C Fully Automated Frozen Distribution Center", "-25°C 全自动化冷冻配送中心"),
  background: L(
    "FreshChain operates frozen food distribution centers for quick-service restaurant chains across northern China. Its Tianjin DC relied on workers rotating through -25°C freezer shifts of no more than 40 minutes.",
    "鲜链冷链为中国北方的连锁餐饮品牌运营冷冻食品配送中心。其天津仓依赖工人在 -25°C 冷库中轮班，每班不得超过 40 分钟。",
  ),
  challenge: L(
    "Labor scarcity and frost-bite risk capped throughput, while manual FEFO picking caused 3% annual write-offs. The client needed unmanned freezer operations with complete cold-chain traceability.",
    "用工稀缺与冻伤风险限制了产能，人工 FEFO 拣选每年造成 3% 的报损。客户需要无人化冷库作业与完整的冷链追溯。",
  ),
  solution: L(
    "HiWhale deployed cold-rated AGV forklifts and RGV shuttles with heated components and frost-tolerant sensors, fully unmanned inside the freezer. WCS enforces FEFO automatically and binds temperature records to every pallet movement.",
    "浩鲸部署了配备加热部件与抗凝露传感器的耐低温无人叉车与 RGV 穿梭车，冷库内实现全无人作业。WCS 自动执行 FEFO，并将温度记录绑定每一次托盘移动。",
  ),
  equipment: [
    L("12 × Cold-rated MBV15R AGV Forklift", "12 台耐低温 MBV15R 无人叉车"),
    L("8 × MBR04G Rail-Guided Shuttle", "8 台 MBR04G 有轨制导穿梭车"),
    L("Automated high-speed freezer doors", "自动高速冷库门"),
    L("HiWhale WCS with FEFO engine", "浩鲸 WCS（内置 FEFO 引擎）"),
  ],
  duration: L("18 weeks", "18 周"),
  results: [
    { value: "24/7", label: L("Unmanned Freezer Operation", "冷库无人化连续作业") },
    { value: "3%→0.2%", label: L("Annual Write-off Rate", "年报损率") },
    { value: "100%", label: L("FEFO Compliance", "FEFO 合规率") },
    { value: "-32%", label: L("Energy per Pallet", "单托盘能耗下降") },
  ],
  testimonial: {
    quote: L(
      "Our people moved from freezers to control rooms. Recruitment stopped being a bottleneck the day the robots took over the cold.",
      "我们的员工从冷库走进了控制室。机器人接管严寒的那天起，招工再也不是瓶颈。",
    ),
    author: L("Zhang Wei", "张伟"),
    role: L("General Manager, FreshChain Tianjin DC", "鲜链冷链天津仓 总经理"),
  },
  logoName: "case-logo-freshchain.png",
  imageName: "case-freshchain.png",
};
