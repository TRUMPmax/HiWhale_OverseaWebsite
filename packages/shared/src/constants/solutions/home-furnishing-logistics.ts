import { HOME_FURNISHING, L } from "../products/helpers";
import type { MockSolution } from "./types";

export const homeFurnishingLogistics: MockSolution = {
  slug: "home-furnishing-logistics",
  industry: HOME_FURNISHING,
  title: L("Home Furnishing Manufacturing Logistics", "家居制造智能仓储物流方案"),
  summary: L(
    "From panel storage to order-complete kitting — flexible automation for custom furniture at scale.",
    "从板材存储到订单齐套，柔性自动化支撑规模化定制家居。",
  ),
  description: L(
    "The home furnishing industry is shifting from standard products to whole-house customization, and its logistics must keep pace. Product variety is enormous — panels, sofas, mattresses and hardware — with extreme size variance, from small fittings to sliding doors over four meters long. This solution pairs high-bay panel storage and automated buffering with flexible conveying that tolerates irregular dimensions: raw panels are received, stored, picked and fed to cutting, edge-banding and drilling; order buffers hold machined parts until packing; finished goods are stored, picked and kitted so that every multi-part product ships complete. HiWhale IWMS tracks each component by order, turning kitting — the industry's hardest discipline — into an automated, error-proof process.",
    "家居行业正从标准化产品转向全屋定制，物流体系必须同步升级。行业货物品类繁多——板材、沙发、床垫、五金——且规格差异极大，从小件五金到超过四米的趟门。本方案以板材高位立体存储与自动化缓存为核心，搭配兼容异型尺寸的柔性输送：原料板材收货、上架、拣选后自动供料至开料、封边、打孔工序；加工件按订单缓存直至包装；成品入库、拣选并齐套，确保多部件组合产品完整发出。浩鲸 IWMS 按订单追踪每一个部件，把行业最难的“齐套”环节变成自动化、零差错的流程。",
  ),
  painPoints: [
    L(
      "Vast product variety: panels, upholstered goods, mattresses and hardware each need different handling",
      "品类极其繁多：板式家具、沙发、床垫、五金各有不同的存储搬运要求",
    ),
    L(
      "Extreme size variance: from small fittings to 4-meter-plus sliding doors, one system must adapt to all",
      "规格差异巨大：从小五金到四米以上趟门，同一套系统须全面兼容",
    ),
    L(
      "Multi-part kitting: products assembled from many components make picking and packing error-prone",
      "多部件齐套难：产品由多个组件配套组合，拣选、打包、收发差错高发",
    ),
    L(
      "Customization pressure: mass customization demands flexible lines and fast changeovers",
      "定制柔性压力：定制家居要求产线具备柔性化能力与快速换产",
    ),
  ],
  productSlugs: [
    "mbv20p-stacker-agv-forklift",
    "mbv15r-counterbalanced-agv-forklift",
    "mbr160-palletizing-robotic-arm",
    "hiwhale-wcs-fleet-scheduling-system",
    "hiwhale-iwms",
  ],
  process: [
    {
      title: L("Panel Intake & High-bay Storage", "板材收货与立体存储"),
      description: L(
        "Raw panels are received, identified and stored in high-bay racking that maximizes vertical space.",
        "原料板材收货识别后进入高位立体库，最大化利用垂直空间。",
      ),
    },
    {
      title: L("Cutting, Edge-banding & Buffering", "开料封边与分拣缓存"),
      description: L(
        "Automated picking feeds panels to cutting, edge-banding and drilling; machined parts are buffered by order.",
        "自动化拣选向开料、封边、打孔工序供料，加工件按订单分拣缓存。",
      ),
    },
    {
      title: L("Order Buffering & Packing", "订单缓存与包装"),
      description: L(
        "Parts for each order accumulate in dedicated buffers and move to automated or assisted packing stations.",
        "同一订单的部件在专属缓存区集齐，流向自动化或人机协同包装工位。",
      ),
    },
    {
      title: L("Finished Storage & Kitting", "成品仓储与齐套拣选"),
      description: L(
        "IWMS-directed storage and retrieval assemble every multi-part product into complete, verified shipments.",
        "IWMS 指挥成品存取，将多部件产品齐套为经验证的完整发货单元。",
      ),
    },
    {
      title: L("Loading & Dispatch", "装车发运"),
      description: L(
        "Sequenced staging and automated loading keep high-volume, mixed-SKU dispatch accurate and on time.",
        "按线路排序集货、自动化装车，保障多品类大流量发运准确准时。",
      ),
    },
  ],
  results: [
    { value: "+70%", label: L("Space Utilization", "空间利用率提升") },
    { value: "99.99%", label: L("Kitting Accuracy", "齐套拣选准确率") },
    { value: "+90%", label: L("Logistics Efficiency", "物流效率提升") },
    { value: "-40%", label: L("Manual Labor", "人工用量减少") },
  ],
  imageName: "solution-home-furnishing.png",
};
