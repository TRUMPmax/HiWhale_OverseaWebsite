import {
  L,
  S,
  GROUP_GENERAL,
  GROUP_PERFORMANCE,
  GROUP_BATTERY,
  GROUP_SAFETY,
  GROUP_COMMUNICATION,
  AGV_FORKLIFT,
  E_COMMERCE,
  AUTOMOTIVE,
} from "./helpers";
import type { MockProduct } from "./types";

export const mbv20p: MockProduct = {
  slug: "mbv20p-stacker-agv-forklift",
  model: "MBV20P",
  category: AGV_FORKLIFT,
  name: L("High-Lift Stacker AGV Forklift", "高举升堆垛式无人叉车"),
  tagline: L(
    "High-bay stacking up to 4.5 m for narrow-aisle warehouses.",
    "最高 4.5 米高位堆垛，适配窄巷道仓库。",
  ),
  description: L(
    "The MBV20P stacker AGV handles pallets up to 2,000 kg and stacks them as high as 4,500 mm, making it ideal for high-bay and narrow-aisle warehouses. Laser SLAM plus QR hybrid navigation keeps it reliable even in dynamic environments.",
    "MBV20P 堆垛式无人叉车可搬运 2,000 kg 托盘并堆垛至 4,500 mm 高位，适用于高位立体库与窄巷道仓库。激光 SLAM + 二维码混合导航，在动态环境中依然稳定可靠。",
  ),
  quickSpecs: [
    S("Load Capacity", "额定载重", "2,000 kg"),
    S("Lift Height", "起升高度", "4,500 mm"),
    S("Navigation", "导航方式", "LiDAR SLAM + QR"),
    S("Battery", "电池", "Li-ion 48V / 300Ah"),
  ],
  specGroups: [
    {
      group: GROUP_GENERAL,
      items: [
        S("Overall Dimensions", "整车尺寸", "2,350 × 1,050 × 2,400 mm"),
        S("Dead Weight", "自重", "3,200 kg"),
        S("Fork Size", "货叉尺寸", "1,150 × 140 × 50 mm"),
        S("Min. Aisle Width", "最小通道宽度", "2,200 mm"),
      ],
    },
    {
      group: GROUP_PERFORMANCE,
      items: [
        S("Load Capacity", "额定载重", "2,000 kg"),
        S("Lift Height", "起升高度", "4,500 mm"),
        S("Travel Speed", "行驶速度", "1.2 m/s"),
        S("Positioning Accuracy", "定位精度", "±10 mm"),
      ],
    },
    {
      group: GROUP_BATTERY,
      items: [
        S("Battery Type", "电池类型", "Li-ion 磷酸铁锂"),
        S("Capacity", "电池容量", "48V / 300Ah"),
        S("Charging Time", "充电时长", "≤ 2.5 h（快充）"),
        S("Runtime", "续航时间", "8 h"),
      ],
    },
    {
      group: GROUP_SAFETY,
      items: [
        S("Safety Scanner", "安全雷达", "2 × 360° 激光扫描仪"),
        S("Emergency Stop", "急停装置", "车身四周急停按钮"),
        S("Obstacle Detection", "障碍物检测", "3D 视觉 + 安全触边 + 声光报警"),
        S("Standard", "安全标准", "ISO 3691-4 / CE"),
      ],
    },
    {
      group: GROUP_COMMUNICATION,
      items: [
        S("Network", "通信网络", "Wi-Fi 6 / 5G"),
        S("Protocol", "通信协议", "VDA 5050 / Modbus TCP"),
        S("Scheduling", "调度方式", "WCS 集群调度"),
        S("API", "开放接口", "REST API"),
      ],
    },
  ],
  features: [
    L("4,500 mm high-lift stacking for high-bay racking", "4,500 mm 高位堆垛，适配高位立体货架"),
    L(
      "Hybrid LiDAR SLAM + QR navigation for dynamic floors",
      "激光 SLAM + 二维码混合导航，适应动态作业环境",
    ),
    L("Narrow-aisle operation from 2,200 mm aisle width", "最小 2,200 mm 通道宽度内作业"),
    L("Automatic fork leveling at height for safe stacking", "高位自动调平货叉，堆垛更安全"),
  ],
  scenarios: [E_COMMERCE, AUTOMOTIVE],
  imageName: "product-mbv20p.png",
};
