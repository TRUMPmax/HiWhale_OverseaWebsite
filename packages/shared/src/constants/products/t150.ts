import { L, S, DELIVERY_ROBOT } from "./helpers";
import type { MockProduct } from "./types";

export const t150: MockProduct = {
  slug: "t150-light-payload-industrial-delivery-robot",
  model: "WTID00（标准版）/ WTIDL0（顶升版）",
  category: DELIVERY_ROBOT,
  name: L("Light-Payload Industrial Delivery Robot", "轻载重工业配送机器人"),
  tagline: L(
    "150 kg light-payload industrial delivery — out-of-box deployment in as fast as 1 hour.",
    "150kg轻载重工业配送，1小时开箱即用快速部署",
  ),
  description: L(
    "PUDU T150 (launched January 2026) is a light-payload material delivery robot for industrial and warehouse settings, anchoring the 150–600 kg payload lineup with T300 and T600. VSLAM + LiDAR fusion navigation with top and bottom RGBD cameras and dual 360° LiDARs handles highly dynamic environments. Out-of-box deployment: walk it once with a cart to map and it is stably running within 1 hour, with multi-robot self-organizing fleet scheduling. The lifting variant (WTIDL0) adds a 60 mm lift for automated integration workflows.",
    "PUDU T150 是面向工业及仓储场景的轻负载物料配送机器人（2026年1月发布）， 以 150kg 负载能力为核心，与 T300/T600 形成从 150kg 到 600kg 的工业配送负载全覆盖。 VSLAM+激光雷达融合导航配合上下 RGBD 相机与 360° 双激光雷达，无惧高动态复杂环境； 开箱即用，推车走一圈即可完成建图，最快 1 小时稳定运行，支持多机自组网调度。 顶升版（WTIDL0）支持 60mm 顶升，可融入自动化集成工作流。",
  ),
  quickSpecs: [
    S("Max Payload", "最大载重", "150 kg"),
    S("Net Weight", "整机重量", "标准版 65 kg / 顶升版 81 kg", "Standard 65 kg / lifting 81 kg"),
    S("Runtime", "续航时间", "12 h（空载巡航）", "12 h (no-load cruising)"),
    S("Navigation", "导航方式", "VSLAM + 激光雷达融合导航", "VSLAM + LiDAR fusion navigation"),
  ],
  specGroups: [
    {
      group: L("General", "通用"),
      items: [
        S("Model", "产品型号", "标准版 WTID00 / 顶升版 WTIDL0", "Standard WTID00 / lifting WTIDL0"),
        S(
          "Net Weight",
          "整机重量",
          "标准版 65 kg / 顶升版 81 kg",
          "Standard 65 kg / lifting 81 kg",
        ),
        S("Dimensions (L×W×H)", "整机尺寸（L×W×H）", "835 × 500 × 1350 mm"),
        S("Chassis Dimensions", "底盘尺寸", "780 × 500 × 240 mm"),
        S("Display", "屏幕规格", "10.1 寸 LCD 屏", '10.1" LCD display'),
        S("Operating System", "操作系统", "Android"),
      ],
    },
    {
      group: L("Performance", "性能"),
      items: [
        S("Max Payload", "最大载重", "150 kg"),
        S(
          "Lift Height",
          "顶升高度",
          "60 mm（仅顶升版 WTIDL0）",
          "60 mm (lifting variant WTIDL0 only)",
        ),
        S("Cruise Speed", "巡航速度", "0.2 ~ 1.2 m/s（可调节）", "0.2–1.2 m/s (adjustable)"),
        S("Min Passage Width", "最小通过宽度", "60 cm"),
        S("Max Obstacle Height", "最大越障高度", "20 mm"),
        S("Max Gap Width", "最大过缝宽度", "35 mm"),
        S(
          "Runtime",
          "续航时间",
          "12 h（空载巡航）/ 8 h（最大负载）",
          "12 h (no-load) / 8 h (max payload)",
        ),
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
        S("Navigation", "导航方式", "VSLAM + 激光雷达融合导航", "VSLAM + LiDAR fusion navigation"),
        S(
          "RGBD Depth Camera",
          "RGBD深度相机",
          "2 个（上、下双向探测）",
          "2 (up/down bidirectional sensing)",
        ),
        S(
          "LiDAR",
          "激光雷达",
          "2 个（底盘对角布置，360°覆盖）",
          "2 (diagonal chassis layout, 360° coverage)",
        ),
        S(
          "Top Camera",
          "顶视相机",
          "1 个（VSLAM建图与天花板定位码识别）",
          "1 (VSLAM mapping & ceiling marker recognition)",
        ),
        S("Front Camera", "前视相机", "1 个（人体轮廓识别）", "1 (human-shape recognition)"),
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
          "Safety Standard",
          "安全标准",
          "ISO 3691-4；工业配送机器人 CE 认证",
          "ISO 3691-4; CE for industrial delivery robots",
        ),
        S(
          "Emergency Stop Switch",
          "急停开关",
          "3 个（1 个顶部 + 2 个底盘侧边）",
          "3 (1 top + 2 chassis sides)",
        ),
        S(
          "Brake Switch",
          "制动器开关",
          "支持关机自锁驻停，防负载溜坡",
          "Auto-lock parking when powered off, prevents load rollback",
        ),
      ],
    },
    {
      group: L("Communication & IoT", "通信与IoT"),
      items: [
        S("Connectivity", "通信网络", "4G、Wi-Fi"),
        S(
          "IoT Capabilities",
          "IoT能力",
          "自主乘梯、自主闸机通行、按键器远程呼叫、PUDULink APP",
          "Autonomous elevator riding, gate passing, button remote call, PUDULink APP",
        ),
        S(
          "External Power Interface",
          "对外供电接口",
          "24V（电池电压），最大输出电流 2.5A",
          "24V (battery), max output current 2.5A",
        ),
        S(
          "Expansion Interface",
          "扩展接口",
          "USB 2.0、IO（选配件信号通信）、SIM卡槽（nano）、OTG调试",
          "USB 2.0, IO (optional signal comms), SIM slot (nano), OTG debug",
        ),
        S(
          "Multi-Robot Scheduling",
          "多机调度",
          "支持多机自组网调度，无需本地服务器",
          "Multi-robot self-organizing scheduling, no local server needed",
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
        S("Speaker Power", "音响功率", "10 W × 2 立体声音响", "10 W × 2 stereo speakers"),
      ],
    },
  ],
  features: [
    L("150 kg payload for light industrial delivery", "1小时开箱即用，免场地改造"),
    L("Out-of-box setup, stable operation within 1 hour", "150kg载重，顶升版融入自动流"),
    L("VSLAM + LiDAR fusion with 360° dual LiDARs", "VSLAM+激光双导航稳运行"),
    L("Multi-robot self-organizing fleet scheduling", "快换电池，7×24全天候作业"),
  ],
  scenarios: [],
  imageName: "product-t150.png",
};
