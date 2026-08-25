import { L, S, CLEANING_ROBOT } from "./helpers";
import type { MockProduct } from "./types";

export const mt1: MockProduct = {
  slug: "mt1-ai-sweeping-robot",
  model: "MTBC01",
  category: CLEANING_ROBOT,
  name: L("AI Sweeping Robot", "AI智能扫地机器人"),
  tagline: L(
    "The workshop debris and plastic-film sweeping specialist with a 35L waste bin.",
    "工厂车间纸屑塑料膜清扫专家，35L大容量垃圾盒",
  ),
  description: L(
    "PUDU MT1 is an AI sweeping robot for industrial and warehouse environments, purpose-built for dry waste such as paper scraps and plastic film. LiDAR + vision fusion navigation, a ~70 cm cleaning width, a ~35L waste bin and 4–8 hours of runtime. Manual and automatic work modes plus an optional charging dock enable 24/7 unmanned cleaning.",
    "PUDU MT1 是面向工业与仓储场景的 AI 智能扫地机器人，专注清理纸片碎屑、塑料膜等干垃圾。 采用激光雷达与视觉融合定位导航，清洁宽度约 70cm，垃圾盒容量约 35L，续航 4-8 小时。 支持手动/自动双作业模式，选配充电桩可实现自动回充，7×24 小时无人化清洁作业。",
  ),
  quickSpecs: [
    S("Net Weight", "整机重量", "约 65 kg", "Approx. 65 kg"),
    S("Runtime", "续航时间", "4 ~ 8 h"),
    S("Cleaning Width", "清洁宽度", "约 70 cm（含边刷）", "Approx. 70 cm (incl. side brush)"),
    S("Waste Bin Capacity", "垃圾盒容量", "约 35 L", "Approx. 35 L"),
  ],
  specGroups: [
    {
      group: L("General", "通用"),
      items: [
        S("Model", "产品型号", "MTBC01"),
        S("Net Weight", "整机重量", "约 65 kg", "Approx. 65 kg"),
        S("Dimensions (L×W×H)", "整机尺寸（L×W×H）", "840 × 600 × 490 mm"),
        S("Housing Material", "整机外壳材质", "PC+ABS"),
        S("Display", "屏幕规格", "10.1 寸 LCD 屏", '10.1" LCD display'),
        S("Operating System", "操作系统", "Android"),
      ],
    },
    {
      group: L("Performance", "性能"),
      items: [
        S(
          "Cleaning Functions",
          "清洁能力",
          "纸片碎屑、塑料膜等垃圾",
          "Paper scraps, plastic film and other debris",
        ),
        S("Cleaning Width (incl. side brush)", "清洁宽度（含边刷）", "约 70 cm", "Approx. 70 cm"),
        S("Cruise Speed", "巡航速度", "0.2 ~ 1.2 m/s（可调节）", "0.2–1.2 m/s (adjustable)"),
        S("Min Passage Width", "最小通过宽度", "75 cm"),
        S("Max Obstacle Height", "最大越障高度", "20 mm"),
        S("Max Gap Width", "最大过缝宽度", "30 mm"),
        S("Max Slope Angle", "最大爬坡角度", "8°"),
        S("Cleaning Noise", "清洁作业噪音", "< 75 dB"),
      ],
    },
    {
      group: L("Battery", "电池"),
      items: [
        S("Operating Voltage", "工作电压", "DC 23 ~ 29.2 V"),
        S("Battery Capacity", "电池容量", "45 Ah"),
        S("Charging Time", "充电时间", "约 3 h", "Approx. 3 h"),
        S("Runtime", "续航时间", "4 ~ 8 h"),
        S(
          "Auto-Charging",
          "自动充电",
          "支持（需选配充电桩）",
          "Supported (optional charging dock)",
        ),
      ],
    },
    {
      group: L("Dust Box", "尘盒"),
      items: [S("Waste Bin Capacity", "垃圾盒容量", "约 35 L", "Approx. 35 L")],
    },
    {
      group: L("Navigation & Perception", "导航与感知"),
      items: [
        S("Navigation", "导航方式", "激光雷达 + 视觉融合定位", "LiDAR + vision fusion positioning"),
        S("Work Modes", "作业模式", "手动模式、自动模式", "Manual and automatic modes"),
      ],
    },
    {
      group: L("Safety", "安全"),
      items: [S("Protection Rating", "防护等级", "IPX3")],
    },
    {
      group: L("Communication", "通信"),
      items: [
        S(
          "Connectivity",
          "通信网络",
          "支持 4G、Wi-Fi、蓝牙通信、Lora 或 2.4G（选装）",
          "4G, Wi-Fi, Bluetooth; LoRa or 2.4G (optional)",
        ),
        S("Mobile App", "手机端 APP", "支持", "Supported"),
      ],
    },
    {
      group: L("Environment", "环境"),
      items: [
        S(
          "Operating Environment",
          "工作环境",
          "温度 0℃ ~ 40℃；湿度 ≤ 90% RH",
          "Temperature 0–40 °C; humidity ≤90% RH",
        ),
        S(
          "Storage Environment",
          "储存环境",
          "温度 -20℃ ~ 70℃；湿度 ≤ 90% RH",
          "Temperature -20–70 °C; humidity ≤90% RH",
        ),
        S("Operating Altitude", "工作海拔", "< 2000 m"),
        S(
          "Applicable Floors",
          "适用地面",
          "抛光水泥地、环氧树脂、橡胶、规整砖石、瓷砖等硬化地面",
          "Polished concrete, epoxy, rubber, pavers, tile and other hard floors",
        ),
      ],
    },
  ],
  features: [
    L("35L large-capacity waste bin", "35L大容量垃圾盒，少频次倾倒"),
    L("LiDAR + vision fusion navigation", "激光+视觉融合导航"),
    L("4–8h runtime with auto recharging", "70cm清洁宽度，作业效率高"),
    L("Manual and automatic work modes", "选配充电桩，自动回充"),
  ],
  scenarios: [],
  imageName: "product-mt1.png",
};
