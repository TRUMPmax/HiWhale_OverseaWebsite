import { L, S, CLEANING_ROBOT } from "./helpers";
import type { MockProduct } from "./types";

export const cc1: MockProduct = {
  slug: "cc1-commercial-cleaning-robot",
  model: "CCBC01",
  category: CLEANING_ROBOT,
  name: L("Commercial Cleaning Robot", "商用清洁机器人"),
  tagline: L(
    "4-in-1 multi-function cleaning with laser + Marker positioning — the entry-level commercial cleaner.",
    "4合1多功能清洁，激光+Marker定位的商用清洁入门款",
  ),
  description: L(
    "PUDU CC1 is a multi-function cleaning robot for small and medium venues, combining sweeping, scrubbing, (carpet) vacuuming and dust mopping in one machine. The base CC1 uses laser + Marker positioning, a 2.5L dust box and dual 15L water tanks, and covers 5,000–8,000 m² with its optional workstation for automatic water refill/drain and recharging — ideal for retail, restaurants, hotels and offices.",
    "PUDU CC1系列机器人是一款定位于中小场景的多功能清洁机器人，集扫地、洗地、（地毯）吸尘、尘推于一体。 基础款CC1采用激光+Marker定位，配备2.5L尘盒与15L双水箱，支持洗地、扫吸推、地毯吸尘、静音尘推四种清洁模式。 配合专属工作站可实现自动加排水与自动回充，单机清洁覆盖面积达5000-8000㎡，广泛适用于零售、餐饮、酒店、写字楼等场景。",
  ),
  quickSpecs: [
    S("Net Weight", "整机重量", "75 kg"),
    S("Runtime", "续航时间", "洗地 5h / 静音尘推 9h", "Scrubbing 5h / silent dust-mop 9h"),
    S("Cleaning Width", "清洁宽度", "500 mm（含边刷）", "500 mm (incl. side brush)"),
    S("Cleaning Efficiency", "清洁效率", "700-1000 m²/h"),
  ],
  specGroups: [
    {
      group: L("General", "通用"),
      items: [
        S("Model", "产品型号", "CCBC01"),
        S("Net Weight", "整机重量", "75 kg（165.35 lb）"),
        S("Dimensions", "整机尺寸", "629×552×695 mm"),
        S("Housing Material", "整机外壳材质", "PC+ABS"),
        S("Display", "屏幕规格", "10.1 寸 LCD 屏", '10.1" LCD display'),
      ],
    },
    {
      group: L("Performance", "性能"),
      items: [
        S("Operating Voltage", "工作电压", "DC 23~29.2 V"),
        S(
          "Cleaning Functions",
          "清洁能力",
          "清扫、(地毯)吸尘、尘推、洗地",
          "Sweeping, (carpet) vacuuming, dust mopping, scrubbing",
        ),
        S("Cleaning Width (incl. side brush)", "清洁宽度（含边刷）", "500 mm"),
        S("Cleaning Efficiency", "清洁效率", "700-1000 m²/h"),
        S("Cruise Speed", "巡航速度", "0.2~1.2 m/s（可调节）", "0.2–1.2 m/s (adjustable)"),
        S("Max Obstacle Height", "最大越障高度", "20 mm"),
        S("Max Gap Width", "最大过缝宽度", "35 mm"),
        S("Min Passage Width", "最小通过宽度", "70 cm"),
        S("Max Slope Angle", "最大爬坡角度", "8°"),
      ],
    },
    {
      group: L("Battery", "电池"),
      items: [
        S("Battery Type", "电池类型", "磷酸铁锂电池", "LiFePO4 battery"),
        S("Battery Capacity", "电池容量", "50 Ah"),
        S("Charging Time", "充电时间", "约 3 h", "Approx. 3 h"),
        S("Auto-Charging", "自动充电", "支持（需选配工作站）", "Supported (optional workstation)"),
        S(
          "Runtime",
          "续航时间",
          "洗地 5h；扫吸推 5h；地毯吸尘 4h；静音尘推 9h",
          "Scrubbing 5h; sweep-vacuum-mop 5h; carpet vacuum 4h; silent dust-mop 9h",
        ),
      ],
    },
    {
      group: L("Water Tanks & Dust Box", "水箱与尘盒"),
      items: [
        S("Clean Water Tank", "清水箱", "15 L"),
        S("Waste Water Tank", "污水箱", "15 L"),
        S(
          "Dust Box Capacity",
          "尘盒容量",
          "2.5 L（默认）/ 6 L（扩容）",
          "2.5 L (standard) / 6 L (extended)",
        ),
      ],
    },
    {
      group: L("Navigation & Positioning", "导航与定位"),
      items: [
        S("Navigation", "导航方式", "激光 + Marker", "Laser + Marker"),
        S("Positioning Accuracy", "定位精度", "厘米级", "Centimeter-level"),
      ],
    },
    {
      group: L("Safety", "安全"),
      items: [
        S("Protection Rating", "防护等级", "IPX4"),
        S("Emergency Stop Button", "急停按钮", "支持", "Supported"),
      ],
    },
    {
      group: L("Communication", "通信"),
      items: [
        S(
          "Connectivity",
          "通信网络",
          "支持 4G、Wi-Fi、蓝牙、ESP、LORA 通信（选装）",
          "4G, Wi-Fi, Bluetooth, ESP, LORA (optional)",
        ),
        S("Mobile App", "手机端 APP", "支持", "Supported"),
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
        S(
          "Storage Environment",
          "储存环境",
          "温度 -20~60℃；湿度 ≤85% RH",
          "Temperature -20–60 °C; humidity ≤85% RH",
        ),
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
    L("4-in-1 multi-function cleaning", "4合1多功能清洁"),
    L("Laser + Marker high-precision positioning", "激光+Marker高精定位"),
    L("Auto water refill/drain and recharging", "自动加排水与回充"),
    L("4–9h long cleaning runtime", "4-9h长续航清洁"),
  ],
  scenarios: [],
  imageName: "product-cc1.png",
};
