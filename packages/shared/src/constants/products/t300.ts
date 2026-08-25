import { L, S, DELIVERY_ROBOT } from "./helpers";
import type { MockProduct } from "./types";

export const t300: MockProduct = {
  slug: "t300-industrial-delivery-robot",
  model: "WTID01（标准版）/ WTIDL1（顶升版）",
  category: DELIVERY_ROBOT,
  name: L("Industrial Delivery Robot", "工业配送机器人"),
  tagline: L(
    "The 300 kg all-rounder — freely expandable with lifting, towing and roller modules.",
    "300kg载重工业配送全能选手，顶升牵引辊筒自由扩展",
  ),
  description: L(
    "PUDU T300 is a transport robot for industrial material transfer and commercial heavy-load delivery, built around an open, highly extensible chassis with a 300 kg max payload and a 10.1-inch operator screen. Six native modes — delivery, cruise, lifting (WTIDL1), towing, following and roller — connect to roller lines and smart warehouse systems. IoT capabilities include elevator riding, gate passing and remote calling, and quick-swap batteries keep it running 24/7.",
    "PUDU T300 是应用于工业场景物料转运与商用场景大负载配送的运载机器人， 以载重底盘为核心、开放性强，最大负载 300kg，带 10.1 寸操作屏幕便于一线使用。 原生支持配送、巡航、顶升（WTIDL1）、牵引、跟随、辊筒六大模式，可对接辊筒线与智能仓储系统； 具备乘梯、过闸门、远程呼叫等 IoT 能力，快拆电池实现 7×24 小时连续作业。",
  ),
  quickSpecs: [
    S("Max Payload", "最大负载", "300 kg"),
    S("Net Weight", "整机重量", "标准版 65 kg / 顶升版 81 kg"),
    S("Runtime", "续航时间", "12 h（空载巡航）"),
    S("Protection Rating", "防护等级", "标准机型 IP42 / 顶升机型 IP40"),
  ],
  specGroups: [
    {
      group: L("General", "通用"),
      items: [
        S("Model", "产品型号", "标准版 WTID01 / 顶升版 WTIDL1"),
        S("Net Weight", "整机重量", "标准版 65 kg / 顶升版 81 kg"),
        S("Dimensions (L×W×H)", "整机尺寸（L×W×H）", "835 × 500 × 1350 mm"),
        S("Chassis Dimensions", "底盘尺寸", "780 × 500 × 240 mm"),
        S("Body Material", "整机材质", "外壳 PC+ABS；立柱、底盘铝合金；负载面盖板铁"),
        S("Display", "屏幕规格", "10.1 寸 LCD 屏"),
        S("Operating System", "操作系统", "Android 12.0"),
      ],
    },
    {
      group: L("Performance", "性能"),
      items: [
        S("Max Payload", "最大负载", "300 kg"),
        S("Cruise Speed", "巡航速度", "0.2 ~ 1.2 m/s（可调节）"),
        S("Runtime", "续航时间", "12 h（空载巡航）/ 6 h（最大负载）"),
        S("Max Obstacle Height", "最大越障高度", "20 mm"),
        S("Max Gap Width", "最大过缝宽度", "35 mm"),
        S("Speaker Power", "音响功率", "10 W × 2 立体声音响"),
      ],
    },
    {
      group: L("Battery", "电池"),
      items: [
        S("Battery Type", "电池类型", "锂电池（支持快速更换）"),
        S("Battery Capacity", "电池容量", "30 Ah"),
        S("Charging Time", "充电时间", "约 2 h（0% 到 90%）"),
        S("Charging Method", "充电方式", "充电器、充电桩、快拆电池"),
        S(
          "Stay Powered During Battery Swap",
          "换电保持开机",
          "支持（拔出电池后维持 60 秒开机状态）",
        ),
      ],
    },
    {
      group: L("Navigation & Perception", "导航与感知"),
      items: [
        S("Navigation", "导航方式", "VSLAM + 激光雷达融合导航"),
        S("RGBD Depth Camera", "RGBD深度相机", "2 个（前部，上/下探测）"),
        S("LiDAR", "激光雷达", "2 个（底盘对角布置，360°覆盖，FDA Class 1）"),
        S("Top Camera", "顶视相机", "1 个（VSLAM建图与天花板定位码识别）"),
        S("Front Camera", "前视相机", "1 个（人体轮廓识别，支持跟随模式）"),
        S("Bumper Switch", "碰撞开关", "2 个（底盘前后下边缘）"),
      ],
    },
    {
      group: L("Work Modes", "作业模式"),
      items: [
        S("Delivery Mode", "配送", "多目标点物料配送，自动规划最优路径"),
        S("Cruise Mode", "巡航", "沿预设路径循环运行，逗留点取放物料"),
        S("Lifting Mode", "顶升", "自动取货、顶起货架运送、自动卸下（仅 WTIDL1）"),
        S("Towing Mode", "牵引", "搭配牵引装置，自动适配被牵引物轮廓（需加装牵引机构）"),
        S("Following Mode", "跟随", "基于前视RGB相机与激光雷达跟随工作人员"),
        S("Roller Mode", "辊筒", "搭配辊筒组件对接辊筒线/智能仓储系统（需加装辊筒机构）"),
      ],
    },
    {
      group: L("Safety", "安全"),
      items: [
        S("Protection Rating", "防护等级", "标准机型 IP42 / 顶升机型 IP40"),
        S("Emergency Stop Switch", "急停开关", "3 个（1 个顶部 + 2 个底盘侧边）"),
        S("Brake Switch", "制动器开关", "支持关机自锁驻停，防负载溜坡"),
      ],
    },
    {
      group: L("Communication & IoT", "通信与IoT"),
      items: [
        S("IoT Capabilities", "IoT能力", "自主乘梯、过闸门、远程呼叫"),
        S("External Power Interface", "对外供电接口", "24V（电池电压），最大输出电流 2.5A"),
        S("Expansion Interface", "扩展接口", "USB 2.0、IO、SIM卡槽（nano）、OTG调试"),
      ],
    },
    {
      group: L("Environment", "环境"),
      items: [
        S("Operating Environment", "工作环境", "温度 0℃ ~ 40℃；湿度 ≤ 85% RH"),
        S("Storage Environment", "储存环境", "温度 -20℃ ~ 60℃；湿度 ≤ 85% RH"),
        S("Operating Altitude", "工作海拔", "< 2000 m"),
        S("Road Requirements", "路面要求", "室内环境，平坦光滑地面"),
      ],
    },
  ],
  features: [
    L("300 kg payload with open, extensible chassis", "300kg大负载，工业转运主力"),
    L(
      "Six modes: delivery, cruise, lifting, towing, following, roller",
      "顶升/牵引/辊筒多模组扩展",
    ),
    L("Elevator riding, gate passing and remote calling", "乘梯过闸IoT联动跨楼层"),
    L("Quick-swap battery for 24/7 operation", "快换电池，7×24连续作业"),
  ],
  scenarios: [],
  imageName: "product-t300.png",
};
