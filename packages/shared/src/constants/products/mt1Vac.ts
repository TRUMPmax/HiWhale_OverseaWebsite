import { L, S, CLEANING_ROBOT } from "./helpers";
import type { MockProduct } from "./types";

export const mt1Vac: MockProduct = {
  slug: "mt1-vac-sweep-vacuum-robot",
  model: "MTBC02",
  category: CLEANING_ROBOT,
  name: L("AI Sweep-Vacuum-Mop Robot", "AI扫吸推机器人"),
  tagline: L(
    "Sweep, vacuum and dust-mop in one — HEPA filtration keeps noise down to 65 dB.",
    "扫地吸尘尘推三合一，HEPA过滤降噪至65dB",
  ),
  description: L(
    "PUDU MT1 Vac integrates a sweeping roller brush, a quick-release vacuum tube and a vacuum-mop combo tool, completing sweeping, vacuuming and dust mopping in one pass. Standard HEPA filtration (non-washable) and dual 14L dust bags, up to 55 cm vacuum width. Quiet mode keeps noise below 65 dB(A), and short-pile or industrial carpets are supported. A 60Ah battery delivers 3–6.5 hours of continuous work on mixed factory and warehouse floors.",
    "PUDU MT1 Vac 是 MT1 系列的扫吸推一体机型，集成扫地滚刷、可快拆吸尘管与吸尘尘推二合一扒， 一机完成扫、吸、推三种清洁作业。标配 HEPA 过滤（不可水洗）与 14L 双尘袋，最大吸尘宽度 55cm。 降噪模式下工作噪音低于 65dB(A)，适用地面扩展至短毛地毯与工业地毯， 60Ah 电池支撑 3-6.5 小时连续作业，是工厂、仓储混合地面场景的清洁多面手。",
  ),
  quickSpecs: [
    S("Net Weight", "整机重量", "约 75 kg"),
    S("Runtime", "续航时间", "3 ~ 6.5 h"),
    S("Cleaning Functions", "清洁能力", "扫地 + 吸尘 + 尘推三合一"),
    S("Operating Noise", "工作噪音", "降噪模式 < 65 dB(A)"),
  ],
  specGroups: [
    {
      group: L("General", "通用"),
      items: [
        S("Model", "产品型号", "MTBC02"),
        S("Net Weight", "整机重量", "约 75 kg"),
        S("Dimensions (L×W×H)", "整机尺寸（L×W×H）", "840 × 600 × 490 mm"),
        S("Housing Material", "整机外壳材质", "PC+ABS"),
        S("Display", "屏幕规格", "10.1 寸 LCD 屏"),
        S("Operating System", "操作系统", "Android"),
      ],
    },
    {
      group: L("Performance", "性能"),
      items: [
        S("Cleaning Functions", "清洁能力", "纸片碎屑、木屑、灰尘等垃圾"),
        S("Cleaning Method", "清洁方式", "扫地、吸尘、尘推三合一"),
        S("Cleaning Width (incl. side brush)", "清洁宽度（含边刷）", "约 70 cm"),
        S("Max Vacuum Width", "最大吸尘宽度", "55 cm"),
        S("Cruise Speed", "巡航速度", "0.2 ~ 1.2 m/s（可调节）"),
        S("Min Passage Width", "最小通过宽度", "75 cm"),
        S("Max Obstacle Height", "最大越障高度", "20 mm"),
        S("Max Gap Width", "最大过缝宽度", "30 mm"),
        S("Max Slope Angle", "最大爬坡角度", "8°"),
        S("Operating Noise", "工作噪音", "降噪模式 < 65 dB(A)"),
      ],
    },
    {
      group: L("Battery", "电池"),
      items: [
        S("Operating Voltage", "工作电压", "DC 23 ~ 29.2 V"),
        S("Battery Capacity", "电池容量", "60 Ah"),
        S("Charging Time", "充电时间", "约 3.5 h"),
        S("Runtime", "续航时间", "3 ~ 6.5 h"),
        S("Auto-Charging", "自动充电", "支持（需选配充电桩）"),
      ],
    },
    {
      group: L("Dust Box & Filtration", "尘盒与过滤"),
      items: [
        S("Dust Bag Capacity", "尘袋容量", "14 L（7 L × 2，不可水洗）"),
        S("Waste Bin Capacity", "垃圾盒容量", "6 L"),
        S("HEPA Filtration", "HEPA过滤", "标配（不可水洗）"),
      ],
    },
    {
      group: L("Navigation & Perception", "导航与感知"),
      items: [
        S("Navigation", "导航方式", "激光雷达 + 视觉融合定位"),
        S("RGBD Depth Camera", "RGBD深度相机", "2 组"),
        S("RGB Camera", "RGB相机", "2 个"),
        S("Work Modes", "作业模式", "手动模式、自动模式"),
      ],
    },
    {
      group: L("Communication", "通信"),
      items: [
        S("Connectivity", "通信网络", "支持 4G、Wi-Fi、蓝牙通信、Lora 或 2.4G（选装）"),
        S("Mobile App", "手机端 APP", "支持"),
      ],
    },
    {
      group: L("Environment", "环境"),
      items: [
        S("Operating Environment", "工作环境", "温度 -10℃ ~ 40℃；湿度 ≤ 90% RH"),
        S("Charging Environment", "充电环境", "温度 0℃ ~ 40℃；湿度 ≤ 90% RH"),
        S("Storage Environment", "储存环境", "温度 -20℃ ~ 70℃；湿度 ≤ 90% RH"),
        S("Operating Altitude", "工作海拔", "< 2000 m"),
        S(
          "Applicable Floors",
          "适用地面",
          "抛光水泥地、环氧树脂、橡胶、规整砖石、瓷砖等硬化地面；短毛地毯、工业地毯",
        ),
      ],
    },
  ],
  features: [
    L("3-in-1 sweep, vacuum and dust mop", "扫吸推三合一，一机多能"),
    L("HEPA filtration with dual 14L dust bags", "HEPA过滤，木屑灰尘全搞定"),
    L("Quiet mode below 65 dB(A)", "降噪模式<65dB，安静作业"),
    L("Works on short-pile and industrial carpets", "兼容短毛地毯与工业地毯"),
  ],
  scenarios: [],
  imageName: "product-mt1-vac.png",
};
