import {
  L,
  S,
  GROUP_GENERAL,
  GROUP_PERFORMANCE,
  GROUP_SAFETY,
  GROUP_COMMUNICATION,
  RGV,
  E_COMMERCE,
  PHARMACEUTICAL,
} from "./helpers";
import type { MockProduct } from "./types";

export const mbr04g: MockProduct = {
  slug: "mbr04g-rail-guided-shuttle-rgv",
  model: "MBR04G",
  category: RGV,
  name: L("Rail-Guided Shuttle (RGV)", "有轨制导穿梭车 RGV"),
  tagline: L(
    "High-speed rail-guided transport for aisle-to-aisle pallet movement.",
    "高速有轨穿梭，胜任巷道间托盘转运。",
  ),
  description: L(
    "The MBR04G rail-guided shuttle runs on fixed rails to move pallets at high speed between aisles, conveyors and AS/RS stations. Rail power supply enables true 24/7 operation with no charging downtime — the backbone of high-throughput automated warehouses.",
    "MBR04G 有轨制导穿梭车沿固定轨道高速运行，在巷道、输送线与立体库站台之间转运托盘。滑触线供电实现真正的 24/7 连续作业，无需充电等待，是高吞吐自动化仓库的骨干运力。",
  ),
  quickSpecs: [
    S("Load Capacity", "额定载重", "1,500 kg"),
    S("Travel Speed", "行驶速度", "160 m/min"),
    S("Positioning Accuracy", "定位精度", "±5 mm"),
    S("Power Supply", "供电方式", "滑触线供电"),
  ],
  specGroups: [
    {
      group: GROUP_GENERAL,
      items: [
        S("Overall Dimensions", "整车尺寸", "2,000 × 1,100 × 550 mm"),
        S("Dead Weight", "自重", "850 kg"),
        S("Rail Gauge", "轨道间距", "760 mm"),
        S("Pallet Size", "适配托盘", "1,200 × 1,000 mm"),
      ],
    },
    {
      group: GROUP_PERFORMANCE,
      items: [
        S("Load Capacity", "额定载重", "1,500 kg"),
        S("Travel Speed", "行驶速度", "160 m/min"),
        S("Acceleration", "加速度", "0.5 m/s²"),
        S("Positioning Accuracy", "定位精度", "±5 mm"),
      ],
    },
    {
      group: L("Power Supply", "动力系统"),
      items: [
        S("Power Supply", "供电方式", "滑触线 48V DC 持续供电"),
        S("Drive", "驱动方式", "伺服电机 + 同步带"),
        S("Backup", "应急电源", "超级电容（断电回位）"),
        S("Duty Cycle", "工作制", "24/7 连续作业"),
      ],
    },
    {
      group: GROUP_SAFETY,
      items: [
        S("Obstacle Detection", "障碍物检测", "前后激光测距 + 安全触边"),
        S("Emergency Stop", "急停装置", "车身急停按钮 + 远程急停"),
        S("Anti-Collision", "防撞", "同轨多车联锁防撞"),
        S("Standard", "安全标准", "CE / EN 528"),
      ],
    },
    {
      group: GROUP_COMMUNICATION,
      items: [
        S("Network", "通信网络", "工业无线 AP / 漏波电缆"),
        S("Protocol", "通信协议", "PROFINET / Modbus TCP"),
        S("Scheduling", "调度方式", "WCS 集群调度"),
        S("API", "开放接口", "REST API"),
      ],
    },
  ],
  features: [
    L(
      "160 m/min rail-guided speed for high-throughput aisles",
      "160 m/min 有轨高速，胜任高吞吐巷道作业",
    ),
    L(
      "Rail-powered 24/7 operation, zero charging downtime",
      "滑触线供电 24/7 连续作业，零充电停机",
    ),
    L("±5 mm stopping accuracy for precise conveyor handover", "±5 mm 停车精度，输送线交接精准"),
    L("Multi-shuttle interlock on shared rails", "同轨多车联锁调度，安全高效"),
  ],
  scenarios: [E_COMMERCE, PHARMACEUTICAL],
  imageName: "product-mbr04g.png",
};
