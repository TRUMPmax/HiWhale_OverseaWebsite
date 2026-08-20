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
  THIRD_PARTY_LOGISTICS,
} from "./helpers";
import type { MockProduct } from "./types";

export const mbv15r: MockProduct = {
  slug: "mbv15r-counterbalanced-agv-forklift",
  model: "MBV15R",
  category: AGV_FORKLIFT,
  name: L("Counterbalanced AGV Forklift", "平衡重式无人叉车"),
  tagline: L(
    "Automated pallet transport and stacking for loads up to 1.5 t.",
    "1.5 吨级自动化托盘搬运与堆垛。",
  ),
  description: L(
    "The MBV15R is a counterbalanced AGV forklift designed for automated pallet transport, stacking and dock docking. With LiDAR SLAM navigation and ±10 mm positioning accuracy, it integrates seamlessly into existing racking and conveyor layouts without infrastructure changes.",
    "MBV15R 平衡重式无人叉车面向自动化托盘搬运、堆垛与月台对接场景。采用激光 SLAM 导航，定位精度 ±10 mm，无需改造场地即可接入现有货架与输送线布局。",
  ),
  quickSpecs: [
    S("Load Capacity", "额定载重", "1,500 kg"),
    S("Lift Height", "起升高度", "3,000 mm"),
    S("Navigation", "导航方式", "LiDAR SLAM"),
    S("Battery", "电池", "Li-ion 48V / 200Ah"),
  ],
  specGroups: [
    {
      group: GROUP_GENERAL,
      items: [
        S("Overall Dimensions", "整车尺寸", "2,650 × 1,100 × 2,150 mm"),
        S("Dead Weight", "自重", "2,800 kg"),
        S("Fork Size", "货叉尺寸", "1,070 × 125 × 45 mm"),
        S("Turning Radius", "转弯半径", "1,750 mm"),
      ],
    },
    {
      group: GROUP_PERFORMANCE,
      items: [
        S("Load Capacity", "额定载重", "1,500 kg"),
        S("Lift Height", "起升高度", "3,000 mm"),
        S("Travel Speed", "行驶速度", "1.5 m/s"),
        S("Positioning Accuracy", "定位精度", "±10 mm"),
      ],
    },
    {
      group: GROUP_BATTERY,
      items: [
        S("Battery Type", "电池类型", "Li-ion 磷酸铁锂"),
        S("Capacity", "电池容量", "48V / 200Ah"),
        S("Charging Time", "充电时长", "≤ 2 h（快充）"),
        S("Runtime", "续航时间", "6–8 h"),
      ],
    },
    {
      group: GROUP_SAFETY,
      items: [
        S("Safety Scanner", "安全雷达", "2 × 360° 激光扫描仪"),
        S("Emergency Stop", "急停装置", "车身前后急停按钮"),
        S("Obstacle Detection", "障碍物检测", "3D 视觉 + 安全触边"),
        S("Standard", "安全标准", "ISO 3691-4"),
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
    L(
      "LiDAR SLAM navigation, no reflectors or floor markers required",
      "激光 SLAM 导航，无需反光板与地面标识",
    ),
    L(
      "±10 mm pallet positioning with 3D vision fork guidance",
      "3D 视觉货叉引导，托盘定位精度 ±10 mm",
    ),
    L("Opportunity charging for 24/7 multi-shift operation", "支持机会充电，满足 24/7 多班次作业"),
    L("Seamless docking with conveyors, racks and dock doors", "与输送线、货架、月台无缝对接"),
  ],
  scenarios: [E_COMMERCE, THIRD_PARTY_LOGISTICS],
  imageName: "product-mbv15r.png",
};
