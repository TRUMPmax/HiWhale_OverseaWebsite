import {
  L,
  S,
  GROUP_GENERAL,
  GROUP_PERFORMANCE,
  GROUP_BATTERY,
  GROUP_SAFETY,
  GROUP_COMMUNICATION,
  MANNED_FORKLIFT,
  THIRD_PARTY_LOGISTICS,
  FOOD_COLD_CHAIN,
} from "./helpers";
import type { MockProduct } from "./types";

export const mbf35e: MockProduct = {
  slug: "mbf35e-electric-counterbalanced-forklift",
  model: "MBF35E",
  category: MANNED_FORKLIFT,
  name: L("Electric Counterbalanced Forklift", "电动平衡重式叉车"),
  tagline: L(
    "3.5 t Li-ion workhorse for hybrid and transitional operations.",
    "3.5 吨锂电主力车型，适配人机混合作业。",
  ),
  description: L(
    "The MBF35E electric counterbalanced forklift delivers diesel-grade performance with zero emissions. Its Li-ion battery supports opportunity charging for multi-shift operations, and it can be retrofitted with HiWhale autonomy kits later.",
    "MBF35E 电动平衡重式叉车以零排放提供媲美柴油车的性能。锂电池支持机会充电满足多班次作业，后期可加装浩鲸自动驾驶套件升级为无人叉车。",
  ),
  quickSpecs: [
    S("Load Capacity", "额定载重", "3,500 kg"),
    S("Lift Height", "起升高度", "4,800 mm"),
    S("Battery", "电池", "Li-ion 80V / 460Ah"),
    S("Runtime", "续航时间", "8 h"),
  ],
  specGroups: [
    {
      group: GROUP_GENERAL,
      items: [
        S("Overall Dimensions", "整车尺寸", "3,650 × 1,230 × 2,250 mm"),
        S("Dead Weight", "自重", "5,400 kg"),
        S("Fork Size", "货叉尺寸", "1,070 × 125 × 50 mm"),
        S("Turning Radius", "转弯半径", "2,250 mm"),
      ],
    },
    {
      group: GROUP_PERFORMANCE,
      items: [
        S("Load Capacity", "额定载重", "3,500 kg"),
        S("Lift Height", "起升高度", "4,800 mm"),
        S("Travel Speed", "行驶速度", "18 km/h"),
        S("Gradeability", "爬坡能力", "20%"),
      ],
    },
    {
      group: GROUP_BATTERY,
      items: [
        S("Battery Type", "电池类型", "Li-ion 磷酸铁锂", "Li-ion (LiFePO4)"),
        S("Capacity", "电池容量", "80V / 460Ah"),
        S("Charging Time", "充电时长", "≤ 2 h（快充）", "≤ 2 h (fast charge)"),
        S("Runtime", "续航时间", "8 h"),
      ],
    },
    {
      group: GROUP_SAFETY,
      items: [
        S(
          "Operator Protection",
          "驾驶员保护",
          "OPS 驾驶在位感应系统",
          "OPS operator-presence sensing",
        ),
        S(
          "Stability",
          "稳定性",
          "弯道自动减速 + 门架缓冲",
          "Curve auto-slowdown + mast cushioning",
        ),
        S("Visibility", "视野", "宽视野门架 + LED 作业灯", "Wide-view mast + LED work lights"),
        S("Standard", "安全标准", "CE / ISO 6292"),
      ],
    },
    {
      group: GROUP_COMMUNICATION,
      items: [
        S("Telematics", "车队管理", "车载 4G 远程诊断终端", "Onboard 4G remote diagnostics"),
        S("Protocol", "通信协议", "CAN bus / Modbus"),
        S("Fleet System", "车队系统", "可选配 FMS 车队管理", "Optional FMS fleet management"),
        S("Upgrade Path", "升级路径", "支持加装自动驾驶套件", "Retrofittable with autonomy kit"),
      ],
    },
  ],
  features: [
    L("Zero-emission Li-ion power with opportunity charging", "锂电零排放，支持机会充电"),
    L("20% gradeability for yard and ramp operations", "20% 爬坡能力，胜任堆场与坡道作业"),
    L("Operator-presence sensing and curve speed control", "驾驶在位感应与弯道自动减速"),
    L("Retrofittable with HiWhale autonomy kit", "可加装浩鲸自动驾驶套件升级为无人车"),
  ],
  scenarios: [FOOD_COLD_CHAIN, THIRD_PARTY_LOGISTICS],
  imageName: "product-mbf35e.png",
};
