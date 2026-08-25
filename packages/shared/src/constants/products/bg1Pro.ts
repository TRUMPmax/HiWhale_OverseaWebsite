import { L, S, CLEANING_ROBOT } from "./helpers";
import type { MockProduct } from "./types";

export const bg1Pro: MockProduct = {
  slug: "bg1-pro-ai-scrubber-dryer",
  model: "BGBC02",
  category: CLEANING_ROBOT,
  name: L("AI Commercial Scrubber-Dryer", "AI商用洗地机器人"),
  tagline: L(
    "AI scrubbing with 3D perception — the large-venue cleaning expert built for 24/7 operation.",
    "AI智能洗地，3D感知，24/7连续运行的大场景清洁专家",
  ),
  description: L(
    "PUDU BG1 Pro is an AI scrubber-dryer for large venues, handling scrubbing, sweeping, vacuuming, dust mopping and polishing. 3D LiDAR and 3D VSLAM multi-sensor fusion positioning plus AI vision deliver edge-to-edge cleaning, automatic stain detection and dual-detergent smart dosing. Large clean/waste water tanks and an all-in-one workstation enable true 24/7 unattended operation — built for supermarkets, malls, factories, warehouses and transport hubs.",
    "PUDU BG1 Pro AI机器人是一款专为大场景设计的AI大型洗地机器人，支持洗地、扫地、吸尘、尘推、抛光等多功能清洁作业。 搭载3D激光雷达与3D VSLAM多传感器融合定位，配合AI视觉识别实现边到边清洁、自动污渍检测、双药剂智能配比。 配备大容量清水/污水箱与一体化工作站，可7×24小时无人值守运行。适用于零售超市、商业综合体、工厂、仓库、交通枢纽等大场景硬地面深度清洁。",
  ),
  quickSpecs: [
    S("Net Weight", "整机重量", "约 344 kg", "Approx. 344 kg"),
    S("Clean/Waste Water Tanks", "清水/污水箱", "75L / 60L"),
    S("Runtime", "续航时间", "扫洗一体最大 7.5 h", "Up to 7.5 h combined scrubbing/sweeping"),
    S(
      "Cleaning Width",
      "清洁宽度",
      "550 mm（洗）/ 708 mm（含边刷）",
      "550 mm (scrub) / 708 mm (incl. side brush)",
    ),
  ],
  specGroups: [
    {
      group: L("General", "通用"),
      items: [
        S("Model", "产品型号", "BGBC02"),
        S(
          "Net Weight",
          "整机重量",
          "约 344 kg（758 lbs，空载、水箱无水）",
          "Approx. 344 kg (758 lbs, empty, tanks drained)",
        ),
        S(
          "Dimensions",
          "整机尺寸",
          "1195×760×1303 mm（含吸水扒）/ 1120×660×1303 mm（不含吸水扒）",
          "1195×760×1303 mm (with squeegee) / 1120×660×1303 mm (without squeegee)",
        ),
        S("Housing Material", "整机外壳材质", "ABS + LLDPE"),
        S("Display", "屏幕规格", "10.1 寸 LCD 屏", '10.1" LCD display'),
      ],
    },
    {
      group: L("Performance", "性能"),
      items: [
        S("Operating Voltage", "工作电压", "DC 41.6~57.2 V"),
        S(
          "Cleaning Modes",
          "清洁模式",
          "洗地、扫地、吸尘、尘推、抛光",
          "Scrubbing, sweeping, vacuuming, dust mopping, polishing",
        ),
        S(
          "Cleaning Efficiency",
          "清洁效率",
          "覆盖模式 2000 m²/h；巡检模式 6000 m²/h",
          "Coverage mode 2,000 m²/h; patrol mode 6,000 m²/h",
        ),
        S("Travel Speed", "运行速度", "0.2~1.0 m/s（可调节）", "0.2–1.0 m/s (adjustable)"),
        S("Max Obstacle Height", "最大越障高度", "25 mm"),
        S("Min Passage Width", "最小通过宽度", "850 mm"),
        S(
          "Max Slope Angle",
          "最大爬坡角度",
          "清洁任务时 5°，非清洁任务 8°",
          "5° during cleaning; 8° when not cleaning",
        ),
      ],
    },
    {
      group: L("Battery", "电池"),
      items: [
        S("Battery Capacity", "电池容量", "90 Ah（48V平台）", "90 Ah (48V platform)"),
        S("Battery Type", "电池类型", "磷酸铁锂", "LiFePO4"),
        S(
          "Charging Time",
          "充电时间",
          "高压地区（AC≥180V）约 3h；低压地区（AC≤180V）约 4.5h",
          "High-voltage (AC≥180V) ~3h; low-voltage (AC≤180V) ~4.5h",
        ),
        S("Auto-Charging", "自动充电", "支持（需选配工作站）", "Supported (optional workstation)"),
      ],
    },
    {
      group: L("Water Tanks & Detergent", "水箱与药剂"),
      items: [
        S("Clean Water Tank Capacity", "清水箱容量", "75 L"),
        S("Waste Water Tank Capacity", "污水箱容量", "60 L"),
        S("Detergent Tank Capacity", "清洁药剂仓容量", "7 L（双仓）", "7 L (dual tank)"),
        S("Waste Bin Capacity", "垃圾盒容量", "5 L"),
      ],
    },
    {
      group: L("Navigation & Positioning", "导航与定位"),
      items: [
        S(
          "Navigation",
          "导航方式",
          "3D Lidar + 3D VSLAM 多传感器融合定位 + AI",
          "3D LiDAR + 3D VSLAM multi-sensor fusion positioning + AI",
        ),
        S("Auto Parking Brake", "自动驻车", "支持，轮毂内置制动器", "Supported, in-wheel brake"),
      ],
    },
    {
      group: L("Safety", "安全"),
      items: [
        S("Protection Rating", "防护等级", "IPX4"),
        S("Emergency Stop Button", "急停按钮", "双侧配置", "Dual-side configuration"),
      ],
    },
    {
      group: L("Communication", "通信"),
      items: [
        S(
          "Connectivity",
          "通信网络",
          "支持 4G、Wi-Fi、蓝牙通信、E-gate/Elevator 通信（选装）",
          "4G, Wi-Fi, Bluetooth; E-gate/Elevator comms (optional)",
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
          "温度 0~40℃；湿度 ≤90% RH",
          "Temperature 0–40 °C; humidity ≤90% RH",
        ),
        S(
          "Storage Environment",
          "储存环境",
          "温度 -20~70℃；湿度 ≤90% RH",
          "Temperature -20–70 °C; humidity ≤90% RH",
        ),
        S("Operating Altitude", "工作海拔", "< 2500 m"),
        S("Cleaning Noise", "清洁作业噪音", "约 75 dB(A)", "Approx. 75 dB(A)"),
      ],
    },
  ],
  features: [
    L("3D perception with AI stain detection", "AI智能识别污渍，自动调压"),
    L("24/7 unattended operation with workstation", "3D感知融合，复杂场景稳定"),
    L("Dual-detergent smart dosing", "7.5h长续航，24/7无人值守"),
    L("Edge-to-edge cleaning coverage", "洗扫吸尘推，五合一清洁"),
  ],
  scenarios: [],
  imageName: "product-bg1-pro.png",
};
