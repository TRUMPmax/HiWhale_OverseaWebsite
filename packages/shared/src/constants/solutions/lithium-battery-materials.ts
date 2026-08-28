import { LITHIUM, L } from "../products/helpers";
import type { MockSolution } from "./types";

export const lithiumBatteryMaterials: MockSolution = {
  slug: "lithium-battery-materials",
  industry: LITHIUM,
  title: L("Lithium Battery Materials Logistics Automation", "锂电材料智能仓储物流方案"),
  summary: L(
    "Contamination-controlled, fire-safe logistics for cathode, anode and separator materials.",
    "为正极、负极与隔膜材料打造洁净受控、防火安全的自动化物流。",
  ),
  description: L(
    "Lithium battery materials — cathode, anode and separator — are the critical upstream of the EV and energy-storage supply chain, and their production logistics are unforgiving. Cathode materials are extremely sensitive to foreign metals such as copper and zinc, where dust or metal contamination directly undermines product consistency; anode graphite dust threatens both worker health and equipment reliability. This solution builds a closed, automated material flow covering raw-material intake, inter-process transfer through mixing, drying, sintering and milling, batch buffering, demagnetizing, packing and finished-goods warehousing. Storage zones are engineered for fire, explosion, moisture, acid, dust and static protection, while HiWhale IWMS + WCS deliver batch-level traceability across every buffer — turning a hazardous, labor-intensive workshop into a clean, data-driven operation ready for global capacity expansion.",
    "正极、负极、隔膜等锂电材料是新能源汽车与储能产业链的关键上游，其生产物流容不得半点马虎：正极材料对铜、锌等金属异物极度敏感，粉尘与金属污染直接损害产品一致性；负极石墨粉尘既危害人员健康，又威胁设备运行。本方案构建封闭式的自动化物料流，覆盖原料入库、混料、干燥、烧结、粉碎等工序间转运、批次缓存、除磁包装与成品仓储。存储区按防火、防爆、防潮、防酸碱、防尘、防静电多重标准设计，浩鲸 IWMS + WCS 实现跨缓存位的批次级追溯——把高危、重体力的车间升级为洁净、数据驱动的运营，支撑企业全球产能布局。",
  ),
  painPoints: [
    L(
      "Metal contamination bans: copper/zinc sensitivity makes dust and foreign metal a consistency killer",
      "禁铜锌管控：粉尘与金属异物直接破坏正极材料一致性",
    ),
    L(
      "Inventory blind spots: many process stages and buffers mean manual counts and no live stock data",
      "库存盲区：工序多、缓存料多，人工盘点、无实时库存，设备数据难以协同",
    ),
    L(
      "Compound safety rules: fire, explosion, moisture, acid and static controls multiply storage complexity",
      "安全要求叠加：材料品类多、密度高、含化学成分，防火防爆防潮防静电缺一不可",
    ),
    L(
      "Unsustainable workloads: heavy throughput and graphite dust put health and uptime at risk",
      "作业强度大：仓库吞吐量大、石墨粉尘污染，人员健康与设备停机风险并存",
    ),
  ],
  productSlugs: ["mba12t-latent-jacking-agv", "mbh08l-latent-lifting-amr", "mbt10r-roller-top-amr", "mbv20p-stacker-agv-forklift", "hiwhale-wcs-fleet-scheduling-system", "hiwhale-iwms"],
  process: [
    {
      title: L("Clean Raw Material Intake", "原料洁净入库"),
      description: L(
        "Incoming raw materials are received, verified and put away through contamination-controlled automated handling.",
        "原料在洁净受控的自动化链路中完成接收、校验与入库，从源头隔绝异物引入。",
      ),
    },
    {
      title: L("Inter-process Automated Transfer", "制程间自动转运"),
      description: L(
        "Sealed carriers move materials between mixing, drying, sintering, milling and blending without manual exposure.",
        "封闭式载具在混料、干燥、烧结、粉碎、合批各工序间自动转运，全程无人工接触。",
      ),
    },
    {
      title: L("Batch Buffering & Blending Management", "批次缓存与合批管理"),
      description: L(
        "High-density buffers hold work-in-progress by lot, with WCS sequencing each batch precisely into the next stage.",
        "高密度缓存按批次管理在制品，WCS 精确排序每一批次进入下一工序。",
      ),
    },
    {
      title: L("Demagnetizing, Packing & Putaway", "除磁包装与成品入库"),
      description: L(
        "Finished materials pass demagnetizing and automated packing before stacker AGV forklifts place them into the AS/RS.",
        "成品经除磁与自动化包装后，由堆垛式无人叉车送入立体库。",
      ),
    },
    {
      title: L("Full Traceability & Outbound", "全程追溯与发运"),
      description: L(
        "IWMS maintains batch genealogy from intake to dispatch and executes order-driven, paperless outbound.",
        "IWMS 维系从入库到发运的批次谱系，按订单驱动无纸化出库发运。",
      ),
    },
  ],
  results: [
    { value: "+70%", label: L("Space Utilization", "空间利用率提升") },
    { value: "100%", label: L("Batch Traceability", "批次追溯覆盖") },
    { value: "-40%", label: L("Manual Labor", "人工用量减少") },
    { value: "+30%", label: L("Logistics Efficiency", "物流效率提升") },
  ],
  imageName: "solution-lithium.png",
};
