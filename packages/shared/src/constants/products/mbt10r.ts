import {
  L,
  S,
  GROUP_GENERAL,
  GROUP_PERFORMANCE,
  GROUP_BATTERY,
  GROUP_SAFETY,
  GROUP_COMMUNICATION,
  AMR,
  AUTOMOTIVE,
  THIRD_PARTY_LOGISTICS,
} from "./helpers";
import type { MockProduct } from "./types";

export const mbt10r: MockProduct = {
  slug: "mbt10r-roller-top-amr",
  model: "MBT10R",
  category: AMR,
  name: L("Roller-Top Transfer AMR", "辊筒对接式 AMR"),
  tagline: L(
    "Automated conveyor docking for totes, cartons and bins up to 1 t.",
    "1 吨级料箱/纸箱输送线自动对接搬运。",
  ),
  description: L(
    "The MBT10R roller-top AMR docks directly with conveyors and packing stations to transfer totes, cartons and bins automatically — closing the last gap between production lines and warehouse automation.",
    "MBT10R 辊筒对接式 AMR 可与输送线、包装工位直接对接，自动移载料箱、纸箱与周转箱，打通产线与仓储自动化之间的最后一环。",
  ),
  quickSpecs: [
    S("Payload", "额定负载", "1,000 kg"),
    S("Navigation", "导航方式", "LiDAR SLAM"),
    S("Transfer Speed", "移载速度", "0.3 m/s"),
    S("Battery", "电池", "Li-ion 48V / 100Ah"),
  ],
  specGroups: [
    {
      group: GROUP_GENERAL,
      items: [
        S("Overall Dimensions", "整车尺寸", "1,400 × 950 × 850 mm"),
        S("Dead Weight", "自重", "350 kg"),
        S("Roller Height", "辊筒面高度", "800 mm（可定制 650–1,000 mm）"),
        S("Docking Width", "对接宽度", "600 mm"),
      ],
    },
    {
      group: GROUP_PERFORMANCE,
      items: [
        S("Payload", "额定负载", "1,000 kg"),
        S("Travel Speed", "行驶速度", "1.5 m/s"),
        S("Transfer Speed", "移载速度", "0.3 m/s"),
        S("Docking Accuracy", "对接精度", "±5 mm"),
      ],
    },
    {
      group: GROUP_BATTERY,
      items: [
        S("Battery Type", "电池类型", "Li-ion 磷酸铁锂"),
        S("Capacity", "电池容量", "48V / 100Ah"),
        S("Charging Time", "充电时长", "≤ 2 h（快充）"),
        S("Runtime", "续航时间", "8 h"),
      ],
    },
    {
      group: GROUP_SAFETY,
      items: [
        S("Safety Scanner", "安全雷达", "2 × 激光避障雷达"),
        S("Emergency Stop", "急停装置", "车身急停按钮 + 远程急停"),
        S("Obstacle Detection", "障碍物检测", "激光雷达 + 3D 视觉"),
        S("Standard", "安全标准", "CE / ISO 3691-4"),
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
      "Powered roller deck docks with any standard conveyor",
      "动力辊筒台面，可与标准输送线任意对接",
    ),
    L("±5 mm docking accuracy for reliable load transfer", "±5 mm 对接精度，移载稳定可靠"),
    L("Customizable roller height from 650 to 1,000 mm", "辊筒高度 650–1,000 mm 可定制"),
    L("Bi-directional transfer for flexible line layouts", "双向移载，适配柔性产线布局"),
  ],
  scenarios: [AUTOMOTIVE, THIRD_PARTY_LOGISTICS],
  imageName: "product-mbt10r.png",
};
