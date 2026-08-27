import { WIRE_CABLE, L } from "../products/helpers";
import type { MockSolution } from "./types";

export const wireCableManufacturing: MockSolution = {
  slug: "wire-cable-manufacturing",
  industry: WIRE_CABLE,
  title: L("Wire & Cable Manufacturing Logistics", "电线电缆智能制造物流方案"),
  summary: L(
    "Reel and WIP logistics that connect drawing, stranding, insulating and cabling into one digital flow.",
    "盘具与在制品物流打通拉丝、绞线、绝缘、成缆，形成一条数字化物料流。",
  ),
  description: L(
    "Wire and cable is a hybrid process-plus-discrete industry: copper and aluminum conductors are drawn, stranded, insulated, cabled and jacketed in long process chains, with frequent changeovers across small-batch, multi-spec orders. Raw material dominates cost, while semi-finished reels and auxiliary materials are typically floor-stacked and managed manually — consuming space and scattering data. This solution automates reel and WIP logistics end to end: conductor and reel management, AGV transfer between drawing and stranding lines, line-side AS/RS for semi-finished goods across insulating, cabling and jacketing, and automated warehousing of finished cable after testing. HiWhale WCS + IWMS replace paper travelers with live production and inventory data, integrating with MES and ERP to make every meter of cable traceable.",
    "电线电缆是典型的流程型+离散型结合行业：铜、铝导体经拉丝、绞线、绝缘、成缆、护套等长工序链连续成型，小批量、多规格订单带来频繁换型。原料占成本极高，而半成品盘具与辅材通常地堆缓存、人工管理——占地大、数据散。本方案端到端自动化盘具与在制品物流：导体与盘具管理、拉丝绞线工序间 AGV 转运、绝缘成缆护套各段的半制品线边立体库，以及检测后成品电缆的自动化仓储。浩鲸 WCS + IWMS 以实时生产与库存数据取代纸质流转，与 MES、ERP 深度集成，让每一米线缆全程可追溯。",
  ),
  painPoints: [
    L(
      "Long process chains: process-plus-discrete flow with frequent changeovers and many handover points",
      "工艺环节多：流程+离散混合制造，换型频繁、衔接点多、换线时间长",
    ),
    L(
      "Manual logistics: pallet jacks and forklifts move WIP and auxiliaries, breaking material and information flow",
      "物流自动化低：人工地牛+叉车转运半成品与辅材，物料流、信息流断点多",
    ),
    L(
      "Space-hungry buffers: floor-stacked semi-finished reels and materials consume floor area and evade monitoring",
      "缓存占地大：半成品与辅材地堆缓存，空间占用大、人工粗放管理、无法实时监控",
    ),
    L(
      "Low digitalization: paper-based routing and isolated systems undermine lean management",
      "数字化程度低：生产纸质流转、各系统集成度低，数据孤岛制约精益管理",
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
      title: L("Conductor & Reel Management", "铜铝原料与盘具管理"),
      description: L(
        "Copper and aluminum rods, reels and auxiliary materials are registered and stored with automated handling.",
        "铜铝杆材、盘具与辅材登记入库，自动化存取，资产与物料状态实时可见。",
      ),
    },
    {
      title: L("Drawing & Stranding Transfer", "拉丝绞线间自动转运"),
      description: L(
        "AGVs shuttle reels between drawing, stranding and aging stations on demand from the production schedule.",
        "AGV 按生产计划调度，在拉丝、绞线、时效工位间自动转运盘具。",
      ),
    },
    {
      title: L("WIP Line-side AS/RS", "半制品线边立体库"),
      description: L(
        "Semi-finished reels are buffered in line-side high-bay storage feeding insulating, cabling and jacketing lines.",
        "半制品盘具进入线边立体库缓存，按序供给绝缘、成缆、护套产线。",
      ),
    },
    {
      title: L("Testing & Finished Warehousing", "成品检测与入库"),
      description: L(
        "After partial-discharge and electrical testing, finished cable is palletized and stored automatically.",
        "局放与电气测试合格后，成品线缆自动装盘、入成品立体库。",
      ),
    },
    {
      title: L("Sortation & Dispatch", "分拣发货"),
      description: L(
        "Order-driven retrieval, sequenced staging and loading keep multi-spec outbound accurate and traceable.",
        "按订单出库、排序集货与装车，多规格发货准确且全程可追溯。",
      ),
    },
  ],
  results: [
    { value: "+70%", label: L("Space Utilization", "空间利用率提升") },
    { value: "+30%", label: L("Logistics Efficiency", "物流效率提升") },
    { value: "-40%", label: L("Manual Handling", "人工搬运减少") },
    { value: "100%", label: L("Production Traceability", "生产全程追溯") },
  ],
  imageName: "solution-wire-cable.png",
};
