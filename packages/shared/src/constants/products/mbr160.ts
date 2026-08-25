import {
  L,
  S,
  GROUP_GENERAL,
  GROUP_PERFORMANCE,
  GROUP_SAFETY,
  GROUP_COMMUNICATION,
  ROBOTIC_ARM,
  E_COMMERCE,
  FOOD_COLD_CHAIN,
  PHARMACEUTICAL,
} from "./helpers";
import type { MockProduct } from "./types";

export const mbr160: MockProduct = {
  slug: "mbr160-palletizing-robotic-arm",
  model: "MBR160",
  category: ROBOTIC_ARM,
  name: L("Palletizing Robotic Arm", "码垛机械臂"),
  tagline: L(
    "160 kg payload palletizing at up to 1,200 cycles per hour.",
    "160 kg 负载码垛，最高每小时 1,200 循环。",
  ),
  description: L(
    "The MBR160 palletizing robotic arm handles cartons, bags and totes up to 160 kg with a 3,150 mm reach. Integrated 3D vision enables mixed-SKU depalletizing and automatic pattern generation for stable, dense pallets.",
    "MBR160 码垛机械臂可搬运 160 kg 以内的纸箱、袋包与料箱，臂展 3,150 mm。集成 3D 视觉，支持混码拆垛与自动垛型生成，码垛整齐致密。",
  ),
  quickSpecs: [
    S("Payload", "额定负载", "160 kg"),
    S("Reach", "臂展", "3,150 mm"),
    S("Cycle Rate", "循环节拍", "≤ 1,200 次/小时", "≤ 1,200 cycles/hour"),
    S("Repeatability", "重复定位精度", "±0.1 mm"),
  ],
  specGroups: [
    {
      group: GROUP_GENERAL,
      items: [
        S("Axes", "轴数", "4 轴", "4 axes"),
        S("Dead Weight", "自重", "1,150 kg"),
        S("Mounting", "安装方式", "地面安装", "Floor-mounted"),
        S("Protection Rating", "防护等级", "IP54（腕部 IP67）", "IP54 (wrist IP67)"),
      ],
    },
    {
      group: GROUP_PERFORMANCE,
      items: [
        S("Payload", "额定负载", "160 kg"),
        S("Reach", "臂展", "3,150 mm"),
        S("Cycle Rate", "循环节拍", "≤ 1,200 次/小时", "≤ 1,200 cycles/hour"),
        S("Repeatability", "重复定位精度", "±0.1 mm"),
      ],
    },
    {
      group: L("Power", "动力系统"),
      items: [
        S("Power Supply", "电源", "380V / 3 相 / 50-60Hz", "380V / 3-phase / 50-60Hz"),
        S("Rated Power", "额定功率", "8 kW"),
        S("Servo", "伺服系统", "绝对值编码器伺服电机", "Absolute-encoder servo motors"),
        S("Brake", "制动", "全轴抱闸", "Brakes on all axes"),
      ],
    },
    {
      group: GROUP_SAFETY,
      items: [
        S("Safety Controller", "安全控制器", "安全 PLC，PL d / Cat.3", "Safety PLC, PL d / Cat.3"),
        S(
          "Safeguarding",
          "防护方式",
          "安全围栏 + 光幕 + 安全门锁",
          "Safety fencing + light curtains + interlocked doors",
        ),
        S(
          "Collision Detection",
          "碰撞检测",
          "全轴力矩碰撞检测",
          "All-axis torque collision detection",
        ),
        S("Standard", "安全标准", "ISO 10218-1 / CE"),
      ],
    },
    {
      group: GROUP_COMMUNICATION,
      items: [
        S("Fieldbus", "现场总线", "EtherCAT / PROFINET"),
        S(
          "Vision",
          "视觉系统",
          "3D 视觉拆垛 + 垛型规划",
          "3D vision depalletizing + pattern planning",
        ),
        S("Scheduling", "调度方式", "接入 WCS 统一调度", "Integrates with WCS unified scheduling"),
        S("API", "开放接口", "REST API / SDK"),
      ],
    },
  ],
  features: [
    L("3D vision mixed-SKU depalletizing out of the box", "开箱即用的 3D 视觉混码拆垛"),
    L("Automatic pallet pattern generation for dense stacking", "自动生成垛型，码垛致密稳固"),
    L("Quick-change gripper for cartons, bags and totes", "快换夹具，兼容纸箱、袋包与料箱"),
    L("Up to 1,200 cycles per hour sustained throughput", "持续节拍最高 1,200 次/小时"),
  ],
  scenarios: [FOOD_COLD_CHAIN, PHARMACEUTICAL, E_COMMERCE],
  imageName: "product-mbr160.png",
};
