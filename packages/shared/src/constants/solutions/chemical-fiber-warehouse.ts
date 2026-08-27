import { CHEMICAL, L } from "../products/helpers";
import type { MockSolution } from "./types";

export const chemicalFiberWarehouse: MockSolution = {
  slug: "chemical-fiber-warehouse",
  industry: CHEMICAL,
  title: L("Chemical & Fiber Intelligent Warehousing", "化工化纤智能仓储物流方案"),
  summary: L(
    "Continuous, safe and fully traceable material flow from raw materials to finished goods.",
    "贯通原料到成品的连续物流，内建安全合规与全程追溯。",
  ),
  description: L(
    "Chemical and chemical-fiber production runs as long, highly continuous processes — any logistics interruption ripples straight into output and quality. This solution tightly orchestrates raw material management, in-process transfer and finished-goods warehousing on one automated backbone. Stacker AGV forklifts and RGV shuttles handle palletized raw materials and intermediates in high-bay storage, while explosion-conscious routing and equipment selection keep personnel away from temperature-sensitive, flammable or corrosive materials. The HiWhale IWMS + WCS stack maintains lot-level traceability from intake to dispatch, giving you a production-logistics foundation that is safe, efficient and consistent — running unattended around the clock.",
    "化工化纤生产具有长流程、高连续的特性，任何物流中断都会直接传导到产量与品质。本方案将原料管理、在制品转运与成品仓储统一到一条自动化主干上精细协同。堆垛式无人叉车与 RGV 穿梭车承担高位库中托盘原料与中间品的存取，针对温敏、易燃、腐蚀性物料的工艺化路径规划与设备选型让人员远离风险作业。浩鲸 IWMS + WCS 软件栈维持从入库到发运的批次级追溯，构建安全、高效、品质一致的生产物流底座，全天候无人化连续运行。",
  ),
  painPoints: [
    L(
      "Diverse material forms: varied SKUs and pack formats defeat conventional racking",
      "物料形态复杂：SKU 繁多、规格差异大，传统货架难以高密度存储",
    ),
    L(
      "Traceability gaps: siloed systems break the chain from raw material to finished goods",
      "追溯断链：系统各自为政，原料到成品的全生命周期无法贯通",
    ),
    L(
      "Hazardous compliance: temperature-sensitive and flammable materials demand strict protection",
      "安全合规严苛：温敏、易燃物料要求行业级防护，人工接触风险高",
    ),
    L(
      "Manual forklift ceiling: the labor-plus-forklift model caps throughput and invites errors",
      "效能触顶：“人工+叉车”模式周转效率低、误操作率高，无法 24/7 运行",
    ),
  ],
  productSlugs: [
    "mbv20p-stacker-agv-forklift",
    "mbv15r-counterbalanced-agv-forklift",
    "mbr04g-rail-guided-shuttle-rgv",
    "hiwhale-wcs-fleet-scheduling-system",
    "hiwhale-iwms",
  ],
  process: [
    {
      title: L("Raw Material Intake & AS/RS Storage", "原料入库与立体存储"),
      description: L(
        "Vision-assisted receiving identifies and classifies incoming materials, which are put away into high-bay storage by stacker AGV forklifts.",
        "视觉识别协同系统完成原料快速接收与精准分类，由堆垛式无人叉车送入高位立体库。",
      ),
    },
    {
      title: L("In-process Transfer & Line-side Buffering", "在制品转运与线边缓存"),
      description: L(
        "RGVs and AGV forklifts move intermediates between process stages, with buffers dynamically matched to production rhythm.",
        "RGV 与无人叉车在工序间转运中间品，线边缓存随生产节拍动态管理，保障连续供料。",
      ),
    },
    {
      title: L("Line-integrated Conveying", "产线集成输送"),
      description: L(
        "High-stability conveying adapted to delicate materials such as chemical fiber reduces handling loss at every handover.",
        "适配化纤等易损物料的高平稳输送集成到产线，降低各交接环节的物料损耗。",
      ),
    },
    {
      title: L("Finished Goods Packing & Sortation", "成品包装与分拣"),
      description: L(
        "Automated packing, palletizing and sortation prepare finished goods for storage or direct dispatch.",
        "自动化包装、码垛与分拣完成成品下线处理，衔接入库或直接发运。",
      ),
    },
    {
      title: L("Automated Warehousing & Dispatch", "智能仓储与发运"),
      description: L(
        "IWMS directs storage, retrieval and loading with lot-level traceability, integrated with your ERP for paperless outbound.",
        "IWMS 统一指挥存储、出库与装车，批次级全程追溯，并与 ERP 集成实现无纸化发运。",
      ),
    },
  ],
  results: [
    { value: "+70%", label: L("Space Utilization", "空间利用率提升") },
    { value: "100%", label: L("Lot-level Traceability", "批次级追溯覆盖") },
    { value: "-50%", label: L("Manual Handling", "人工搬运减少") },
    { value: "24/7", label: L("Uninterrupted Operation", "全天候连续作业") },
  ],
  imageName: "solution-chemical.png",
};
