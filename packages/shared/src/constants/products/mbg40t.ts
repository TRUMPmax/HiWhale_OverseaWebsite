import {
  L,
  S,
  GROUP_GENERAL,
  GROUP_PERFORMANCE,
  GROUP_SAFETY,
  GROUP_COMMUNICATION,
  GANTRY_CRANE,
  THIRD_PARTY_LOGISTICS,
  PORT,
} from "./helpers";
import type { MockProduct } from "./types";

export const mbg40t: MockProduct = {
  slug: "mbg40t-rail-mounted-gantry-crane",
  model: "MBG40T",
  category: GANTRY_CRANE,
  name: L("Rail-Mounted Gantry Crane (RMG)", "轨道式集装箱龙门吊"),
  tagline: L(
    "Automated 40.5 t container handling for yards and terminals.",
    "40.5 吨级自动化集装箱堆场作业。",
  ),
  description: L(
    "The MBG40T rail-mounted gantry crane automates container stacking in yards and port terminals. With a 40.5 t rated load, 30 m span and full automation package, it delivers precise, unmanned container handling around the clock.",
    "MBG40T 轨道式集装箱龙门吊面向堆场与港口码头的自动化集装箱堆垛作业。额定载荷 40.5 吨、跨距 30 m，全自动化套件支持全天候无人化精准作业。",
  ),
  quickSpecs: [
    S("Rated Load", "额定载荷", "40.5 t"),
    S("Span", "跨距", "30 m"),
    S("Lifting Height", "起升高度", "18 m（堆 5 过 6）"),
    S("Automation", "自动化", "全自动无人作业"),
  ],
  specGroups: [
    {
      group: GROUP_GENERAL,
      items: [
        S("Span", "跨距", "30 m"),
        S("Lifting Height", "起升高度", "18 m"),
        S("Spreader", "吊具", "20' / 40' / 45' 伸缩吊具"),
        S("Duty Class", "工作级别", "A8"),
      ],
    },
    {
      group: GROUP_PERFORMANCE,
      items: [
        S("Rated Load", "额定载荷", "40.5 t（吊具下）"),
        S("Hoisting Speed", "起升速度", "满载 28 m/min / 空载 56 m/min"),
        S("Trolley Speed", "小车速度", "70 m/min"),
        S("Gantry Speed", "大车速度", "120 m/min"),
      ],
    },
    {
      group: L("Power Supply", "动力系统"),
      items: [
        S("Power Supply", "供电方式", "10 kV 电缆卷筒 / 滑触线"),
        S("Installed Power", "装机容量", "320 kW"),
        S("Energy Recovery", "能量回馈", "起升下降势能回馈电网"),
        S("Drive", "驱动方式", "全变频驱动"),
      ],
    },
    {
      group: GROUP_SAFETY,
      items: [
        S("Anti-Sway", "防摇系统", "电子防摇，摆动 ±50 mm"),
        S("Protection", "安全防护", "防雷 / 防风锚定 / 大车防撞"),
        S("Monitoring", "状态监测", "CMS 起重机健康管理系统"),
        S("Standard", "安全标准", "FEM 1.001 / GB/T 3811"),
      ],
    },
    {
      group: GROUP_COMMUNICATION,
      items: [
        S("Network", "通信网络", "5G / 光纤环网"),
        S("Positioning", "定位方式", "GNSS + 编码器 + 激光扫描"),
        S("Scheduling", "调度方式", "对接 TOS / ECS 堆场系统"),
        S("Remote Ops", "远程操作", "远程操控台一键接管"),
      ],
    },
  ],
  features: [
    L("Fully automated unmanned container stacking, 24/7", "全自动无人化集装箱堆垛，全天候作业"),
    L("Electronic anti-sway keeps swing within ±50 mm", "电子防摇，吊具摆动控制在 ±50 mm"),
    L("Regenerative energy recovery lowers operating cost", "势能回馈电网，降低运营能耗"),
    L("Remote takeover console for exception handling", "远程操控台一键接管，处理异常工况"),
  ],
  scenarios: [PORT, THIRD_PARTY_LOGISTICS],
  imageName: "product-mbg40t.png",
};
