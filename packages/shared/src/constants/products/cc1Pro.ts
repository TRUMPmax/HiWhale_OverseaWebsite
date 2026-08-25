import { L, S, CLEANING_ROBOT } from "./helpers";
import type { MockProduct } from "./types";

export const cc1Pro: MockProduct = {
  slug: "cc1-pro-ai-cleaning-robot",
  model: "CCBC02",
  category: CLEANING_ROBOT,
  name: L("AI Commercial Cleaning Robot", "AI商用清洁机器人"),
  tagline: L(
    "AI patrol scrubbing with marker-free VSLAM+ positioning — the AI-driven cleaning flagship.",
    "AI巡检洗地，VSLAM+定位的AI驱动智能清洁旗舰",
  ),
  description: L(
    "PUDU CC1 Pro is the AI flagship of the CC1 series, combining VSLAM and laser fusion positioning for marker-free high-precision navigation. Front and rear AI cameras detect wet stains such as coffee, sauces and standing water in real time and plan cleaning paths automatically, reaching 1,500–3,000 m²/h. With AI adaptive cleaning, AI cleaning-quality inspection with heat-map visualization, and IEC 63327 safety compliance, it unifies sweeping, scrubbing, vacuuming and dust mopping.",
    "PUDU CC1 Pro是CC1系列的AI智能旗舰，搭载VSLAM与激光融合定位算法实现免贴码高精度导航。 配备前视AI相机与后视AI相机，可实时识别咖啡、酱料、积水等湿污渍并自动规划清洁路径，作业效率达1500-3000㎡/h。 支持AI自适应清洁、AI清洁效果检测与热力图可视化，通过IEC 63327安全标准。集扫地、洗地、吸尘、尘推四合一。",
  ),
  quickSpecs: [
    S("Net Weight", "整机重量", "75 kg"),
    S("Runtime", "续航时间", "洗地 5h / 巡检清洁 1500-3000 m²/h"),
    S("Cleaning Width", "清洁宽度", "500 mm（含边刷）"),
    S("Navigation", "导航方式", "激光 + Marker + VSLAM"),
  ],
  specGroups: [
    {
      group: L("General", "通用"),
      items: [
        S("Model", "产品型号", "CCBC02"),
        S("Net Weight", "整机重量", "75 kg（165.35 lb）"),
        S("Dimensions", "整机尺寸", "629×552×695 mm"),
        S("Housing Material", "整机外壳材质", "PC+ABS"),
        S("Display", "屏幕规格", "10.1 寸 LCD 屏"),
        S("Operating System", "操作系统", "Android"),
      ],
    },
    {
      group: L("Performance", "性能"),
      items: [
        S("Operating Voltage", "工作电压", "DC 23~29.2 V"),
        S("Cleaning Functions", "清洁能力", "清扫、(地毯)吸尘、尘推、洗地"),
        S("Cleaning Width (incl. side brush)", "清洁宽度（含边刷）", "500 mm"),
        S("Coverage Cleaning Efficiency", "覆盖清洁效率", "700-1000 m²/h"),
        S("Patrol Cleaning Efficiency", "巡检清洁效率", "1500-3000 m²/h"),
        S("Cruise Speed", "巡航速度", "0.2~1.2 m/s（可调节）"),
        S("Max Obstacle Height", "最大越障高度", "20 mm"),
        S("Max Gap Width", "最大过缝宽度", "35 mm"),
        S("Min Passage Width", "最小通过宽度", "70 cm"),
        S("Max Slope Angle", "最大爬坡角度", "8°"),
      ],
    },
    {
      group: L("Battery", "电池"),
      items: [
        S("Battery Type", "电池类型", "磷酸铁锂电池"),
        S("Battery Capacity", "电池容量", "50 Ah"),
        S("Charging Time", "充电时间", "约 3 h"),
        S("Runtime", "续航时间", "洗地 5h；扫吸推 5h；地毯吸尘 4h；静音尘推 9h"),
      ],
    },
    {
      group: L("Water Tanks & Dust Box", "水箱与尘盒"),
      items: [
        S("Clean Water Tank", "清水箱", "15 L"),
        S("Waste Water Tank", "污水箱", "15 L"),
        S("Dust Box Capacity", "尘盒容量", "2.5 L（默认）/ 6 L（扩容）"),
      ],
    },
    {
      group: L("Navigation & AI", "导航与AI"),
      items: [
        S("Navigation", "导航方式", "激光 + Marker + VSLAM"),
        S("Front AI Camera", "前视AI相机", "识别地面污渍（咖啡、酱料、积水等）"),
        S("Rear AI Camera", "后视AI相机", "清洁效果检测 + 二次污染监测"),
        S("AI Patrol Cleaning", "AI巡检清洁", "实时识别脏污自动生成最优路径"),
        S("AI Adaptive Cleaning", "AI自适应清洁", "自动切换强力/低功耗模式"),
        S("AI Debris/Obstacle Recognition", "AI垃圾/障碍物识别", "支持"),
      ],
    },
    {
      group: L("Safety", "安全"),
      items: [
        S("Protection Rating", "防护等级", "IPX4"),
        S("Safety Standard", "安全标准", "IEC 63327"),
        S("360° All-round Safety Perception", "360° 全方位安全感知", "AI融合感知系统"),
        S("Emergency Stop Button", "急停按钮", "支持"),
      ],
    },
    {
      group: L("Communication", "通信"),
      items: [
        S("Connectivity", "通信网络", "支持 4G、Wi-Fi、蓝牙、ESP、LORA 通信（选装）"),
        S("Mobile App", "手机端 APP", "支持"),
      ],
    },
    {
      group: L("Environment", "环境"),
      items: [
        S(
          "Operating Environment (incl. charging)",
          "工作环境（含充电）",
          "温度 1~40℃；湿度 ≤85% RH",
        ),
        S("Storage Environment", "储存环境", "温度 -20~60℃；湿度 ≤85% RH"),
        S("Operating Altitude", "工作海拔", "< 2000 m"),
        S("Cleaning Noise", "清洁作业噪音", "< 70 dB"),
        S(
          "Applicable Floors",
          "适用地面",
          "水磨石、大理石、地板砖、环氧树脂、砂岩、人造石地面、短毛地毯等",
        ),
      ],
    },
  ],
  features: [
    L("AI patrol cleaning with 2–3× efficiency gain", "AI巡检洗地，效率2-3倍提升"),
    L("Marker-free VSLAM+ positioning", "VSLAM+定位免贴码"),
    L("360° AI fusion safety perception", "360° AI融合安全感知"),
    L("Rear AI real-time cleaning-quality monitoring", "后视AI实时监测清洁效果"),
  ],
  scenarios: [],
  imageName: "product-cc1-pro.png",
};
