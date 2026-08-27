import { TIRE, L } from "../products/helpers";
import type { MockSolution } from "./types";

export const tireRubberLogistics: MockSolution = {
  slug: "tire-rubber-logistics",
  industry: TIRE,
  title: L("Tire & Rubber Plant Logistics Automation", "轮胎橡胶智能厂内物流方案"),
  summary: L(
    "Automated flow from mixing to curing to finished-tire warehousing for 24/7 tire plants.",
    "覆盖密炼到硫化再到成品仓储的自动化物流，支撑轮胎工厂 24/7 连续生产。",
  ),
  description: L(
    "Tire manufacturing combines many interlocked processes — mixing, calendering, cutting, building, curing and inspection — under nonstop 24/7 operation with dense, time-critical in-plant logistics and a wide variety of material specifications. This solution automates every transfer and buffer between workshops: raw material and chemical AS/RS, compound transfer between mixing stages, green-tire handling into curing, and finished-tire warehousing with sortation and dispatch. Latent AGVs, AGV forklifts and RGV shuttles replace the heavy forklift-and-tractor traffic around carriages and green-tire carts, removing people from carbon-black dust, heat and fumes. Orchestrated by HiWhale WCS + IWMS, every buffer position carries real-time inventory data, ending the manual stocktaking and information silos that plague multi-stage tire production.",
    "轮胎制造将密炼、压延、裁断、成型、硫化、检测等众多工序环环相扣，在 24/7 连续生产下，厂内中间物流繁杂、时效要求高、物料品规众多。本方案自动化车间之间的每一次转运与缓存：原材料与小料立体库、密炼各段之间的胶料转运、成型到硫化的胎胚搬运，以及成品轮胎的仓储、分拣与发运。潜伏式 AGV、无人叉车与 RGV 穿梭车取代围绕台车、百叶车与胎胚车的密集叉车牵引作业，让人员远离炭黑粉尘、高温与蒸汽环境。在浩鲸 WCS + IWMS 的统一调度下，每个缓存位都有实时库存数据，终结多工序轮胎生产中的人工盘点与信息孤岛。",
  ),
  painPoints: [
    L(
      "Demanding production: many processes, huge transfer volumes and tight timing overwhelm manual logistics",
      "生产要求高：工序多、流转量大、时效性强，人工物流低效易错",
    ),
    L(
      "Harsh environments: carbon black dust, heat and fumes in mixing and curing are unfit for long-term manual work",
      "生产环境差：密炼、硫化车间炭黑粉尘、高温、蒸汽，不宜人员长期作业",
    ),
    L(
      "Poor traceability: multi-stage buffers rely on manual stocktaking with no real-time inventory",
      "信息追溯差：工序缓存物料多，依赖人工定期盘点，无实时库存数据",
    ),
    L(
      "Safety exposure: heavy carriages and dense forklift traffic between workshops create constant risk",
      "安全隐患大：台车转运重量大、车间间叉车流量高，成品吞吐与存储管理压力大",
    ),
  ],
  productSlugs: [
    "mba12t-latent-jacking-agv",
    "mbv15r-counterbalanced-agv-forklift",
    "mbr04g-rail-guided-shuttle-rgv",
    "hiwhale-wcs-fleet-scheduling-system",
    "hiwhale-iwms",
  ],
  process: [
    {
      title: L("Raw Material & Chemical AS/RS", "原材料与小料立体库"),
      description: L(
        "Rubber, chemicals and auxiliary materials are stored in high-bay warehouses with automated putaway and retrieval.",
        "橡胶、小料与辅料进入高位立体库，自动化完成存取，批次信息全程绑定。",
      ),
    },
    {
      title: L("Automated Compound Transfer", "胶料自动转运"),
      description: L(
        "AGVs move masterbatch and final-mix compounds between mixing, calendering and cutting stages on takt-synchronized routes.",
        "AGV 按节拍同步的路径在密炼、压延、裁断各段之间自动转运母炼胶与终炼胶。",
      ),
    },
    {
      title: L("Semi-finished & Green Tire Logistics", "半部件与胎胚物流"),
      description: L(
        "Line-side AS/RS buffers semi-finished components; automated carriage handling feeds building machines and curing presses.",
        "半部件线边立库自动上下料，胎胚由自动化台车系统对接成型机与硫化机。",
      ),
    },
    {
      title: L("Inspection & Finished Goods Putaway", "检测与成品入库"),
      description: L(
        "After inspection, tires are sorted, palletized and put away into the finished-goods AS/RS automatically.",
        "检测后的轮胎经自动分拣、组盘，由系统调度入成品立体库。",
      ),
    },
    {
      title: L("Outbound Sortation & Dispatch", "出库分拣与发运"),
      description: L(
        "Order-driven sortation and automated loading keep high-volume finished-tire dispatch accurate and on schedule.",
        "按订单自动分拣出库、对接装车发运，大吞吐成品发货准确、准时。",
      ),
    },
  ],
  results: [
    { value: "+90%", label: L("Space Utilization", "空间利用率提升") },
    { value: "-85%", label: L("Manual Labor", "人工用量减少") },
    { value: "+90%", label: L("Logistics Efficiency", "物流效率提升") },
    { value: "24/7", label: L("Continuous Production Support", "全天候连续生产支撑") },
  ],
  imageName: "solution-tire.png",
};
