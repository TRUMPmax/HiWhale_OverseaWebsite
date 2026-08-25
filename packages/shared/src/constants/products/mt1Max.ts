import { L, S, CLEANING_ROBOT } from "./helpers";
import type { MockProduct } from "./types";

export const mt1Max: MockProduct = {
  slug: "mt1-max-3d-sweeping-robot",
  model: "MTBC03",
  category: CLEANING_ROBOT,
  name: L("3D-Perception AI Sweeping Robot", "3D感知AI扫地机器人"),
  tagline: L(
    "3D LiDAR and triple RGBD stereo perception — all-terrain industrial sweeping.",
    "3D激光雷达+三目RGBD立体感知，工业扫地全场景通行",
  ),
  description: L(
    "PUDU MT1 Max is the 3D-perception flagship of the MT1 series, combining 3D LiDAR, a VSLAM camera and three RGBD depth cameras for stereo perception and stable obstacle avoidance in complex industrial environments — it even crosses common 50 mm speed bumps. IP54 protection, a -10 °C to 45 °C operating range and a 60Ah battery for 5–10 hours of runtime, with a ~70 cm cleaning width and ~35L bin for heavy-duty factory and warehouse cleaning.",
    "PUDU MT1 Max 是 MT1 系列的 3D 感知旗舰，搭载 3D 激光雷达、VSLAM 相机与三组 RGBD 深度相机， 实现复杂工业环境下的立体感知与稳定避障，可通过 50mm 以下常见汽车减速带。 IP54 防护等级配合 -10℃~45℃ 宽温工作域，60Ah 大电池带来 5-10 小时续航， 清洁宽度约 70cm、垃圾盒容量约 35L，专为高强度工厂与仓储清洁作业而生。",
  ),
  quickSpecs: [
    S("Net Weight", "整机重量", "约 85 kg"),
    S("Runtime", "续航时间", "5 ~ 10 h"),
    S("Cleaning Width", "清洁宽度", "约 70 cm（含边刷）"),
    S("Protection Rating", "防护等级", "IP54（-10℃~45℃ 宽温工作）"),
  ],
  specGroups: [
    {
      group: L("General", "通用"),
      items: [
        S("Model", "产品型号", "MTBC03"),
        S("Net Weight", "整机重量", "约 85 kg"),
        S("Dimensions (L×W×H)", "整机尺寸（L×W×H）", "840 × 600 × 675 mm"),
        S("Housing Material", "整机外壳材质", "PC+ABS"),
        S("Display", "屏幕规格", "10.1 寸 LCD 屏"),
        S("Operating System", "操作系统", "Android"),
      ],
    },
    {
      group: L("Performance", "性能"),
      items: [
        S("Cleaning Functions", "清洁能力", "纸片碎屑、塑料膜等垃圾"),
        S("Cleaning Width (incl. side brush)", "清洁宽度（含边刷）", "约 70 cm"),
        S("Cruise Speed", "巡航速度", "0.2 ~ 1.2 m/s（可调节）"),
        S("Min Passage Width", "最小通过宽度", "75 cm"),
        S("Max Obstacle Height", "最大越障高度", "20 mm；可通过 50 mm 以下常见汽车减速带"),
        S("Max Gap Width", "最大过缝宽度", "30 mm"),
        S("Max Slope Angle", "最大爬坡角度", "8°"),
        S("Cleaning Noise", "清洁作业噪音", "< 75 dB"),
      ],
    },
    {
      group: L("Battery", "电池"),
      items: [
        S("Operating Voltage", "工作电压", "DC 23 ~ 29.2 V"),
        S("Battery Capacity", "电池容量", "60 Ah"),
        S("Charging Time", "充电时间", "约 3.5 h"),
        S("Runtime", "续航时间", "5 ~ 10 h"),
        S("Auto-Charging", "自动充电", "支持（需选配充电桩）"),
      ],
    },
    {
      group: L("Dust Box", "尘盒"),
      items: [S("Waste Bin Capacity", "垃圾盒容量", "约 35 L")],
    },
    {
      group: L("Navigation & Perception", "导航与感知"),
      items: [
        S("Navigation", "导航方式", "激光雷达 + 视觉融合定位"),
        S("3D LiDAR", "3D激光雷达", "1 个（顶部）"),
        S("VSLAM Camera", "VSLAM相机", "1 个"),
        S("RGBD Depth Camera", "RGBD深度相机", "3 组"),
        S("RGB Camera", "RGB相机", "2 个"),
        S("Water Drop Sensor", "水滴传感器", "1 个"),
        S("Work Modes", "作业模式", "手动模式、自动模式"),
      ],
    },
    {
      group: L("Safety", "安全"),
      items: [S("Protection Rating", "防护等级", "IP54")],
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
        S(
          "Operating Environment (excl. charging)",
          "工作环境（不含充电）",
          "温度 -10℃ ~ 45℃；湿度 ≤ 90% RH",
        ),
        S("Charging Environment", "充电环境", "温度 0℃ ~ 40℃；湿度 ≤ 90% RH"),
        S("Storage Environment", "储存环境", "温度 -20℃ ~ 70℃；湿度 ≤ 90% RH"),
        S("Operating Altitude", "工作海拔", "< 2000 m"),
        S("Applicable Floors", "适用地面", "抛光水泥地、环氧树脂、橡胶、规整砖石、瓷砖等硬化地面"),
      ],
    },
  ],
  features: [
    L("3D LiDAR + triple RGBD stereo perception", "3D激光雷达+三RGBD立体感知"),
    L("Crosses 50 mm speed bumps", "IP54防护，-10℃~45℃宽温作业"),
    L("IP54 rated, -10 °C to 45 °C wide-temperature operation", "60Ah大电池，续航5-10小时"),
    L("60Ah battery for 5–10h runtime", "可通过50mm以下减速带"),
  ],
  scenarios: [],
  imageName: "product-mt1-max.png",
};
