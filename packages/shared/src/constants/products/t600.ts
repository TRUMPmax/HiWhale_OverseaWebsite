import { L, S, DELIVERY_ROBOT } from "./helpers";
import type { MockProduct } from "./types";

export const t600: MockProduct = {
  slug: "t600-heavy-payload-industrial-delivery-robot",
  model: "WTIDL2（标准版）/ WTIDU2（潜伏版）",
  category: DELIVERY_ROBOT,
  name: L("Heavy-Payload Industrial Delivery Robot", "大载重工业配送机器人"),
  tagline: L(
    "600 kg heavy payload — a dual-form industrial delivery platform in standard and latent variants.",
    "600kg超大载重，标准版与潜伏版双形态工业配送平台",
  ),
  description: L(
    "PUDU T600 is the heavy-payload flagship of the PUDU industrial delivery line, with a 600 kg max payload that completes the lineup above T150 and T300. Two forms: the standard variant (WTIDL2) with a 10.1-inch screen and VSLAM + laser dual navigation for mixed human-robot environments, and the latent variant (WTIDU2) at only 255 mm tall with laser SLAM, sliding under racks to lift and move them efficiently. A 30Ah quick-swap lithium battery with auto-recharging delivers 6 hours of full-load runtime for 24/7 production-line operation.",
    "PUDU T600 是普渡工业配送线的大载重旗舰，最大负载 600kg，补齐 T150/T300 之上的重载空白。 提供双形态：标准版（WTIDL2）带 10.1 寸屏与 VSLAM+激光双导航，胜任人机混行复杂场景； 潜伏版（WTIDU2）机身高度仅 255mm，激光SLAM导航，可潜伏顶起货架类物料高效转运。 30Ah 快换锂电池配合充电桩自动回充，满载续航 6 小时，支撑 7×24 小时连续厂线运转。",
  ),
  quickSpecs: [
    S("Max Payload", "最大负载", "600 kg"),
    S("Net Weight", "整机重量", "标准版 112 kg / 潜伏版 94 kg", "Standard 112 kg / latent 94 kg"),
    S("Body Height", "机身高度", "潜伏版仅 255 mm", "Latent variant only 255 mm"),
    S(
      "Navigation",
      "导航方式",
      "标准版 VSLAM+激光SLAM / 潜伏版激光SLAM",
      "Standard VSLAM + laser SLAM / latent laser SLAM",
    ),
  ],
  specGroups: [
    {
      group: L("General", "通用"),
      items: [
        S("Model", "产品型号", "标准版 WTIDL2 / 潜伏版 WTIDU2", "Standard WTIDL2 / latent WTIDU2"),
        S(
          "Net Weight",
          "整机重量",
          "标准版 112 kg / 潜伏版 94 kg",
          "Standard 112 kg / latent 94 kg",
        ),
        S(
          "Dimensions (L×W×H)",
          "整机尺寸（L×W×H）",
          "标准版 960 × 500 × 1350 mm；潜伏版 845 × 500 × 255 mm",
          "Standard 960×500×1350 mm; Latent 845×500×255 mm",
        ),
        S(
          "Display",
          "屏幕规格",
          "标准版 10.1 寸 LCD 屏；潜伏版无屏",
          'Standard 10.1" LCD; latent no screen',
        ),
        S("Operating System", "操作系统", "Android"),
      ],
    },
    {
      group: L("Performance", "性能"),
      items: [
        S("Max Payload", "最大负载", "600 kg"),
        S("Travel Speed", "运行速度", "0.2 ~ 1.2 m/s（可调节）", "0.2–1.2 m/s (adjustable)"),
        S(
          "Runtime",
          "续航时间",
          "12 h（空载巡航）/ 6 h（最大负载）",
          "12 h (no-load) / 6 h (max payload)",
        ),
        S(
          "Max Obstacle Height",
          "最大越障高度",
          "10 mm（满载工况）",
          "10 mm (full-load condition)",
        ),
        S("Max Gap Width", "最大过缝宽度", "35 mm"),
        S(
          "Min Passage Width",
          "最小通过宽度",
          "标准版 70 cm / 潜伏版 65 cm",
          "Standard 70 cm / latent 65 cm",
        ),
        S("Speaker Power", "音响功率", "10 W × 2 立体声音响", "10 W × 2 stereo speakers"),
      ],
    },
    {
      group: L("Battery", "电池"),
      items: [
        S("Battery Type", "电池类型", "锂电池（支持快速更换）", "Lithium battery (quick-swap)"),
        S("Battery Capacity", "电池容量", "30 Ah"),
        S("Charging Time", "充电时间", "约 2 h（0% 到 90%）", "Approx. 2 h (0% to 90%)"),
        S(
          "Charging Method",
          "充电方式",
          "充电器、充电桩、快拆换电",
          "Charger, charging dock, quick-swap battery",
        ),
        S(
          "Stay Powered During Battery Swap",
          "换电保持开机",
          "支持（拔出电池后维持 60 秒开机状态）",
          "Supported (stays on for 60 s after battery removal)",
        ),
      ],
    },
    {
      group: L("Navigation & Perception", "导航与感知"),
      items: [
        S(
          "Navigation",
          "导航方式",
          "标准版 VSLAM + 激光SLAM / 潜伏版激光SLAM",
          "Standard VSLAM + laser SLAM / latent laser SLAM",
        ),
        S(
          "RGBD Depth Camera",
          "RGBD深度相机",
          "向下RGBD + 向上RGBD",
          "Downward RGBD + upward RGBD",
        ),
        S(
          "Top Camera",
          "顶视相机",
          "标准版配置（VSLAM建图与天花板定位码识别）",
          "Standard fit (VSLAM mapping & ceiling marker recognition)",
        ),
        S(
          "Front Camera",
          "前视相机",
          "标准版配置（人体轮廓识别）",
          "Standard fit (human-shape recognition)",
        ),
        S(
          "Bumper Switch",
          "碰撞开关",
          "2 个（底盘前后下边缘）",
          "2 (front & rear lower chassis edges)",
        ),
      ],
    },
    {
      group: L("Safety", "安全"),
      items: [
        S(
          "Emergency Stop Switch",
          "急停开关",
          "标准版多处配置",
          "Standard fit (multiple positions)",
        ),
        S(
          "Brake Switch",
          "制动器开关",
          "支持关机自锁驻停，防负载溜坡",
          "Auto-lock parking when powered off, prevents load rollback",
        ),
        S("Power-Assist Switch", "助力开关", "标准版配置", "Standard fit"),
      ],
    },
    {
      group: L("Communication & IoT", "通信与IoT"),
      items: [
        S(
          "IoT Capabilities",
          "IoT能力",
          "自主乘梯、过闸门、远程呼叫",
          "Autonomous elevator riding, gate passing, remote call",
        ),
        S(
          "Multi-Robot Scheduling",
          "多机调度",
          "支持多机协同调度",
          "Multi-robot collaborative scheduling",
        ),
      ],
    },
    {
      group: L("Environment", "环境"),
      items: [
        S(
          "Operating Environment",
          "工作环境",
          "温度 0℃ ~ 40℃；湿度 ≤ 85% RH",
          "Temperature 0–40 °C; humidity ≤85% RH",
        ),
        S(
          "Storage Environment",
          "储存环境",
          "温度 -20℃ ~ 60℃；湿度 ≤ 85% RH",
          "Temperature -20–60 °C; humidity ≤85% RH",
        ),
        S("Operating Altitude", "工作海拔", "< 2000 m"),
        S(
          "Road Requirements",
          "路面要求",
          "室内环境，平坦光滑地面",
          "Indoor use, flat smooth floors",
        ),
      ],
    },
  ],
  features: [
    L("600 kg max payload", "600kg超大载重，重载转运王者"),
    L("Standard and 255 mm-low latent variants", "标准版+潜伏版双形态按需选"),
    L("VSLAM + laser dual navigation", "潜伏版机身仅255mm钻入货架"),
    L("6h full-load runtime with auto recharging", "快换电池，7×24连续作业"),
  ],
  scenarios: [],
  imageName: "product-t600.png",
};
