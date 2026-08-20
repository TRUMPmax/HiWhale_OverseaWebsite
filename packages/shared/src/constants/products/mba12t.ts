import {
  L,
  S,
  GROUP_GENERAL,
  GROUP_PERFORMANCE,
  GROUP_BATTERY,
  GROUP_SAFETY,
  GROUP_COMMUNICATION,
  AGV,
  AUTOMOTIVE,
  THIRD_PARTY_LOGISTICS,
} from "./helpers";
import type { MockProduct } from "./types";

export const mba12t: MockProduct = {
  slug: "mba12t-latent-jacking-agv",
  model: "MBA12T",
  category: AGV,
  name: L("Latent Jacking AGV", "潜伏顶升式 AGV"),
  tagline: L(
    "QR-guided jacking AGV for reliable trolley transport up to 1.2 t.",
    "二维码导航顶升 AGV，1.2 吨级料车搬运稳定可靠。",
  ),
  description: L(
    "The MBA12T latent jacking AGV follows QR-code routes to transport trolleys and racks between production lines and warehouses. Mature QR navigation delivers ultra-stable operation and rapid deployment — the proven choice for automotive line-side logistics.",
    "MBA12T 潜伏顶升式 AGV 沿二维码路径运行，在产线与仓库之间搬运料车与货架。成熟的二维码导航带来超高稳定性与快速部署能力，是汽车行业线边物流的成熟之选。",
  ),
  quickSpecs: [
    S("Payload", "额定负载", "1,200 kg"),
    S("Navigation", "导航方式", "QR Code"),
    S("Travel Speed", "行驶速度", "1.5 m/s"),
    S("Battery", "电池", "Li-ion 48V / 80Ah"),
  ],
  specGroups: [
    {
      group: GROUP_GENERAL,
      items: [
        S("Overall Dimensions", "整车尺寸", "1,150 × 800 × 300 mm"),
        S("Dead Weight", "自重", "220 kg"),
        S("Lifting Stroke", "顶升行程", "60 mm"),
        S("Rotation", "旋转方式", "原地 360° 旋转"),
      ],
    },
    {
      group: GROUP_PERFORMANCE,
      items: [
        S("Payload", "额定负载", "1,200 kg"),
        S("Travel Speed", "行驶速度", "1.5 m/s"),
        S("Positioning Accuracy", "定位精度", "±10 mm"),
        S("Gradeability", "爬坡能力", "3%"),
      ],
    },
    {
      group: GROUP_BATTERY,
      items: [
        S("Battery Type", "电池类型", "Li-ion 磷酸铁锂"),
        S("Capacity", "电池容量", "48V / 80Ah"),
        S("Charging Time", "充电时长", "≤ 1.5 h（快充）"),
        S("Runtime", "续航时间", "8 h"),
      ],
    },
    {
      group: GROUP_SAFETY,
      items: [
        S("Safety Scanner", "安全雷达", "前后激光避障雷达"),
        S("Emergency Stop", "急停装置", "车身急停按钮 + 远程急停"),
        S("Obstacle Detection", "障碍物检测", "激光雷达 + 安全触边"),
        S("Standard", "安全标准", "CE / ISO 3691-4"),
      ],
    },
    {
      group: GROUP_COMMUNICATION,
      items: [
        S("Network", "通信网络", "Wi-Fi 6"),
        S("Protocol", "通信协议", "VDA 5050 / MQTT"),
        S("Scheduling", "调度方式", "WCS 集群调度"),
        S("API", "开放接口", "REST API"),
      ],
    },
  ],
  features: [
    L(
      "Mature QR navigation with ultra-stable, drift-free routing",
      "成熟二维码导航，路径稳定不漂移",
    ),
    L("Rapid deployment — map a 10,000 m² site in days", "快速部署，万平米场地数天内完成建图"),
    L("In-place 360° rotation for tight line-side aisles", "原地 360° 旋转，适应狭窄线边通道"),
    L("Auto-charging with smart task-based energy management", "自动充电，按任务智能调度电量"),
  ],
  scenarios: [AUTOMOTIVE, THIRD_PARTY_LOGISTICS],
  imageName: "product-mba12t.png",
};
